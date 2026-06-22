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
 * Feux d'artifice : option payante (+1 €), plein écran à la révélation.
 */
export const FIREWORKS = {
  cents: 100, // +1 €
  label: "Feux d'artifice",
  emoji: "🎆",
  description:
    "Animation festive plein écran au moment où le destinataire découvre l'annonce.",
} as const;

/**
 * Son de fête : INCLUS dans le prix de base (activé par défaut). L'acheteur
 * peut le désactiver via une case. N'impacte pas le prix.
 */
export const SOUND = {
  label: "Son de fête",
  emoji: "🎵",
  description:
    "Une petite musique se lance à la révélation. Inclus — décoche pour l'enlever.",
} as const;

interface AmountSelection {
  /** Nombre de formats (mécaniques) achetés : 1, 2 ou 3. */
  formatCount?: number;
  /** Feux d'artifice (option payante). Le son n'impacte pas le prix. */
  withFireworks?: boolean;
}

/** Prix de base pour un nombre de formats (borné à 1–3). */
export function formatBaseCents(formatCount: number): number {
  const n = Math.min(3, Math.max(1, Math.round(formatCount) || 1));
  return FORMAT_PRICES_CENTS[n] ?? FORMAT_PRICES_CENTS[1];
}

/** Montant total = base (selon nb de formats) + feux d'artifice éventuels. */
export function computeAmountCents(opts: AmountSelection): number {
  return (
    formatBaseCents(opts.formatCount ?? 1) +
    (opts.withFireworks ? FIREWORKS.cents : 0)
  );
}
