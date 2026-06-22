/**
 * Pricing centralisé — un seul endroit pour modifier les prix.
 *
 * Le montant final stocké dans Scratch.amountCents est calculé par
 * `computeAmountCents()` au moment de la création (Server Action).
 * Stripe reçoit ce montant en centimes au moment du checkout.
 */

/** Prix de base selon le nombre de formats achetés (mécaniques distinctes). */
export const FORMAT_PRICES_CENTS: Record<number, number> = {
  1: 500, // 5 €
  2: 800, // 8 €
  3: 1000, // 10 €
};

/** Carte simple (1 format) — référence utilisée par défaut. */
export const BASE_AMOUNT_CENTS = FORMAT_PRICES_CENTS[1];

/**
 * Option unique groupée : sons + feux d'artifice à la révélation, +1 €.
 * S'applique à toute la commande (tous les formats). En base, ça active
 * à la fois `withFireworks` et `withSound`.
 */
export const EFFECTS = {
  cents: 100, // +1 €
  label: "Sons & feux d'artifice",
  emoji: "🎉",
  description:
    "Feux d'artifice plein écran et musique de fête au moment où le destinataire découvre l'annonce.",
} as const;

interface AmountSelection {
  /** Nombre de formats (mécaniques) achetés : 1, 2 ou 3. */
  formatCount?: number;
  withEffects?: boolean;
}

/** Prix de base pour un nombre de formats (borné à 1–3). */
export function formatBaseCents(formatCount: number): number {
  const n = Math.min(3, Math.max(1, Math.round(formatCount) || 1));
  return FORMAT_PRICES_CENTS[n] ?? FORMAT_PRICES_CENTS[1];
}

/** Montant total = base (selon nb de formats) + effets éventuels. */
export function computeAmountCents(opts: AmountSelection): number {
  return formatBaseCents(opts.formatCount ?? 1) + (opts.withEffects ? EFFECTS.cents : 0);
}
