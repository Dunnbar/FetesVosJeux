import Stripe from "stripe";

/**
 * Client Stripe singleton.
 *
 * En dev local, si STRIPE_SECRET_KEY n'est pas défini, on instancie avec
 * une clé factice — le client ne pourra évidemment rien faire de réel,
 * mais ça évite que l'app crashe au démarrage. Les actions qui essaient
 * de l'utiliser jettent une erreur explicite via `assertStripeReady()`.
 */
const key = process.env.STRIPE_SECRET_KEY ?? "";

// `apiVersion` non spécifié → la version par défaut du SDK est utilisée.
// Évite les warnings TypeScript sur les date strings et garde la lib à
// jour automatiquement.
export const stripe = new Stripe(key || "sk_test_placeholder_unused");

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * À appeler en début de chaque action qui dépend de Stripe.
 * Jette un message explicite si la clé n'est pas configurée.
 */
export function assertStripeReady(): void {
  if (!isStripeConfigured()) {
    throw new Error(
      "Stripe n'est pas configuré (STRIPE_SECRET_KEY manquante)."
    );
  }
}
