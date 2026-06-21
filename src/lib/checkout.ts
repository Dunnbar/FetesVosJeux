import { db } from "@/lib/db";
import { stripe, assertStripeReady } from "@/lib/stripe";
import { sendScratchLinkEmail } from "@/lib/email";

/**
 * Logique de finalisation d'une carte, partagée entre la création
 * (`/creer`) et la page de reprise (`/creer/[code]/preview`) :
 *   - paiement Stripe (createCheckoutForScratch)
 *   - déblocage par code cadeau (redeemGiftCode)
 *
 * Ces fonctions ne redirigent PAS — elles renvoient une URL / lèvent une
 * erreur. La redirection reste dans les Server Actions appelantes.
 */

const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Crée une session Stripe Checkout pour la carte et renvoie l'URL de paiement. */
export async function createCheckoutForScratch(code: string): Promise<string> {
  assertStripeReady();
  const scratch = await db.scratch.findUnique({ where: { code } });
  if (!scratch) throw new Error("Carte introuvable.");

  const base = siteUrl();
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
    success_url: `${base}/creer/merci/${code}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/creer/${code}/preview?canceled=1`,
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
  return session.url;
}

/**
 * Consomme un code cadeau à usage unique et passe la carte en PAID (offerte).
 * Atomique (updateMany sur `used: false`) : pas de double-usage possible.
 * Lève si le code est invalide ou déjà utilisé. Envoie le lien par mail.
 */
export async function redeemGiftCode(
  scratchCode: string,
  rawGiftCode: string
): Promise<void> {
  const giftCode = rawGiftCode.trim().toUpperCase();
  if (!giftCode) throw new Error("Entre un code cadeau.");

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

  const scratch = await db.scratch.update({
    where: { code: scratchCode },
    data: { status: "PAID", giftCode },
  });

  if (scratch.buyerEmail) {
    try {
      await sendScratchLinkEmail({
        to: scratch.buyerEmail,
        code: scratch.code,
        shareUrl: `${siteUrl()}/g/${scratch.code}`,
        annonceTitle: scratch.annonceTitle,
      });
    } catch {
      // Envoi non bloquant : le déblocage reste valide même si l'email échoue.
    }
  }
}
