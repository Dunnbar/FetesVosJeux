import { NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendScratchLinkEmail } from "@/lib/email";
import { REVEAL_MECHANICS, type RevealMechanic } from "@/components/reveals/types";

/**
 * Webhook Stripe — reçoit les notifications de paiement et fait passer
 * la carte associée à PAID + envoie l'email avec le lien.
 *
 * Setup Stripe :
 *   1. Dashboard Stripe → Developers → Webhooks → Add endpoint
 *   2. URL : https://quisygratte.fr/api/webhooks/stripe
 *   3. Events à écouter : `checkout.session.completed`
 *   4. Récupère le "Signing secret" (whsec_...) → STRIPE_WEBHOOK_SECRET
 *      à mettre dans Vercel env vars
 *
 * Setup dev local (optionnel) :
 *   brew install stripe/stripe-cli/stripe
 *   stripe login
 *   stripe listen --forward-to localhost:3000/api/webhooks/stripe
 *   → te donne un whsec_... à coller dans .env
 */

// On lit le body en RAW (pas .json()) car la signature Stripe se calcule
// sur les bytes bruts du payload.
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Server misconfigured", { status: 500 });
  }

  // Vérification de la signature : confirme que le webhook vient bien de
  // Stripe et que le body n'a pas été altéré.
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe webhook] signature verification failed:", msg);
    return new Response(`Invalid signature: ${msg}`, { status: 400 });
  }

  // On ne traite que les événements de paiement réussi pour l'instant.
  // D'autres events utiles plus tard : `checkout.session.expired`,
  // `payment_intent.payment_failed`, `charge.refunded`, etc.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const code = session.metadata?.scratchCode;
    if (!code) {
      console.warn("[stripe webhook] checkout.session.completed without scratchCode metadata");
      return new Response("Missing scratchCode metadata", { status: 400 });
    }

    // Update DB : status PAID + lien vers le payment_intent pour audit.
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    const scratch = await db.scratch.update({
      where: { code },
      data: {
        status: "PAID",
        stripePaymentIntentId: paymentIntentId,
        // Si Stripe a collecté un email différent (paiement par invité),
        // on le persiste pour s'en servir comme adresse d'envoi du lien.
        ...(session.customer_email && { buyerEmail: session.customer_email }),
      },
    });

    // Commande multi-formats : on marque aussi les autres cartes du groupe.
    let groupCards: { code: string; revealMechanic: string }[] = [
      { code: scratch.code, revealMechanic: scratch.revealMechanic },
    ];
    if (scratch.groupId) {
      await db.scratch.updateMany({
        where: { groupId: scratch.groupId, status: { not: "PAID" } },
        data: { status: "PAID" },
      });
      groupCards = await db.scratch.findMany({
        where: { groupId: scratch.groupId },
        select: { code: true, revealMechanic: true },
        orderBy: { amountCents: "desc" }, // lead (montant total) en premier
      });
    }

    // Envoi du mail avec le(s) lien(s) partageable(s). Non bloquant : si Resend
    // est en panne, on confirme quand même 200 OK à Stripe (sinon il
    // re-tente le webhook en boucle).
    if (scratch.buyerEmail) {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      const links = groupCards.map((c) => ({
        label:
          REVEAL_MECHANICS[c.revealMechanic as RevealMechanic]?.label ??
          "Ta carte",
        url: `${siteUrl}/g/${c.code}`,
      }));
      try {
        const result = await sendScratchLinkEmail({
          to: scratch.buyerEmail,
          code: scratch.code,
          shareUrl: `${siteUrl}/g/${scratch.code}`,
          annonceTitle: scratch.annonceTitle,
          links,
        });
        if (!result.sent) {
          console.warn(
            `[stripe webhook] email échec pour ${scratch.buyerEmail}: ${result.reason}`
          );
        }
      } catch (e) {
        console.error("[stripe webhook] email crash:", e);
      }
    }
  }

  return new Response("OK", { status: 200 });
}
