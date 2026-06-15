"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { stripe, assertStripeReady } from "@/lib/stripe";
import { sendScratchLinkEmail } from "@/lib/email";

/**
 * Crée une session Stripe Checkout pour la carte donnée, met à jour
 * le `stripeSessionId` en DB, et redirige l'utilisateur vers l'URL Stripe.
 *
 * Côté retour :
 *   - success_url : /creer/merci/{code}?session_id=... — la merci page
 *     attend que le webhook ait posé status=PAID (polling) puis affiche
 *     le lien à partager.
 *   - cancel_url  : /creer/{code}/preview?canceled=1 — retour à l'aperçu
 *     avec une bannière "paiement annulé, ta carte est toujours là".
 */
export async function payScratchAction(code: string) {
  assertStripeReady();

  const scratch = await db.scratch.findUnique({ where: { code } });
  if (!scratch) throw new Error("Carte introuvable.");

  if (scratch.status === "PAID") {
    redirect(`/creer/merci/${code}`);
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Carte à gratter — Qui S'y Gratte",
            description: scratch.annonceTitle ?? undefined,
          },
          unit_amount: scratch.amountCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/creer/merci/${code}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/creer/${code}/preview?canceled=1`,
    customer_email: scratch.buyerEmail ?? undefined,
    // Le code de la carte est passé en metadata pour que le webhook
    // sache quelle ligne DB mettre à jour à la réception.
    metadata: { scratchCode: code },
    locale: "fr",
  });

  await db.scratch.update({
    where: { code },
    data: { stripeSessionId: session.id },
  });

  if (!session.url) {
    throw new Error("Stripe n'a pas retourné d'URL de checkout.");
  }
  redirect(session.url);
}

/**
 * Débloque une carte gratuitement avec un code cadeau à usage unique
 * (généré par l'admin, cf. `npm run codes:gen`). Aucun passage par Stripe.
 *
 * Le code est consommé de façon atomique (updateMany sur `used: false`) pour
 * éviter qu'un même code serve deux fois en cas de double soumission. En cas
 * de succès, la carte passe PAID, l'email avec le lien est envoyé (si une
 * adresse est connue), et on redirige vers la page "merci".
 */
export async function redeemGiftCodeAction(
  scratchCode: string,
  rawGiftCode: string
) {
  const giftCode = rawGiftCode.trim().toUpperCase();
  if (!giftCode) throw new Error("Entre un code cadeau.");

  const scratch = await db.scratch.findUnique({ where: { code: scratchCode } });
  if (!scratch) throw new Error("Carte introuvable.");
  if (scratch.status === "PAID") {
    redirect(`/creer/merci/${scratchCode}`);
  }

  // Consommation atomique : la ligne ne matche que si le code existe ET
  // n'est pas déjà utilisé. count === 0 ⇒ code inconnu ou déjà consommé.
  const claimed = await db.promoCode.updateMany({
    where: { code: giftCode, used: false },
    data: {
      used: true,
      usedAt: new Date(),
      usedByScratchCode: scratchCode,
    },
  });

  if (claimed.count === 0) {
    throw new Error("Code cadeau invalide ou déjà utilisé.");
  }

  await db.scratch.update({
    where: { code: scratchCode },
    data: { status: "PAID", giftCode },
  });

  // Envoi du lien par mail si on a une adresse — non bloquant.
  if (scratch.buyerEmail) {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    try {
      await sendScratchLinkEmail({
        to: scratch.buyerEmail,
        code: scratch.code,
        shareUrl: `${siteUrl}/g/${scratch.code}`,
        annonceTitle: scratch.annonceTitle,
      });
    } catch {
      // On ne bloque pas le déblocage si l'email échoue.
    }
  }

  redirect(`/creer/merci/${scratchCode}`);
}
