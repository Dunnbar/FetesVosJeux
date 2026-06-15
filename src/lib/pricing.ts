/**
 * Pricing centralisé — un seul endroit pour modifier les prix.
 *
 * Le montant final stocké dans Scratch.amountCents est calculé par
 * `computeAmountCents()` au moment de la création (Server Action).
 * Stripe reçoit ce montant en centimes au moment du checkout.
 */

export const BASE_AMOUNT_CENTS = 500; // 5,00 € — carte avec révélation sans effet

export const ADDONS = {
  fireworks: {
    cents: 100, // +1 €
    label: "Feux d'artifice",
    emoji: "🎆",
    description:
      "Animation festive plein écran à la révélation, comme un feu d'artifice de soirée.",
  },
  sound: {
    cents: 100, // +1 €
    label: "Son de fête",
    emoji: "🎺",
    description:
      "Une mini-fanfare joue au moment où le destinataire découvre l'annonce.",
  },
} as const;

export type AddonKey = keyof typeof ADDONS;

interface AddonSelection {
  withFireworks?: boolean;
  withSound?: boolean;
}

/**
 * Calcule le montant total selon les options activées.
 */
export function computeAmountCents(opts: AddonSelection): number {
  let total = BASE_AMOUNT_CENTS;
  if (opts.withFireworks) total += ADDONS.fireworks.cents;
  if (opts.withSound) total += ADDONS.sound.cents;
  return total;
}
