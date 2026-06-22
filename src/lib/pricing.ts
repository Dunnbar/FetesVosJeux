/**
 * Pricing centralisé — un seul endroit pour modifier les prix.
 *
 * Le montant final stocké dans Scratch.amountCents est calculé par
 * `computeAmountCents()` au moment de la création (Server Action).
 * Stripe reçoit ce montant en centimes au moment du checkout.
 */

export const BASE_AMOUNT_CENTS = 500; // 5,00 € — carte avec révélation sans effet

/**
 * Option unique groupée : sons + feux d'artifice à la révélation, +1 €.
 * (En base, ça active à la fois `withFireworks` et `withSound`.)
 */
export const EFFECTS = {
  cents: 100, // +1 €
  label: "Sons & feux d'artifice",
  emoji: "🎉",
  description:
    "Feux d'artifice plein écran et musique de fête au moment où le destinataire découvre l'annonce.",
} as const;

interface AddonSelection {
  withFireworks?: boolean;
  withSound?: boolean;
}

/**
 * Calcule le montant total. Sons et feux sont groupés : dès que l'un est
 * activé, on facture l'option d'effets une seule fois (+1 €).
 */
export function computeAmountCents(opts: AddonSelection): number {
  const withEffects = Boolean(opts.withFireworks || opts.withSound);
  return BASE_AMOUNT_CENTS + (withEffects ? EFFECTS.cents : 0);
}
