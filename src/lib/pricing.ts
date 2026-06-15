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
    cents: 200, // +2 €
    label: "Feux d'artifice",
    emoji: "🎆",
    description:
      "Animation festive plein écran à la révélation, comme un feu d'artifice de soirée.",
  },
  sound: {
    cents: 100, // +1 €
    label: "Son & musique",
    emoji: "🎵",
    description:
      "Une musique de fête se lance à la révélation (le destinataire peut la couper d'un bouton).",
  },
} as const;

export type AddonKey = keyof typeof ADDONS;

/**
 * Prix des deux options prises ensemble — au lieu de 200 + 100 = 300.
 * Le bundle fait économiser 0,50 € pour inciter à prendre les deux.
 */
export const BUNDLE_CENTS = 250;

interface AddonSelection {
  withFireworks?: boolean;
  withSound?: boolean;
}

/**
 * Calcule le montant total selon les options activées.
 * Les deux options ensemble bénéficient du tarif bundle.
 */
export function computeAmountCents(opts: AddonSelection): number {
  if (opts.withFireworks && opts.withSound) {
    return BASE_AMOUNT_CENTS + BUNDLE_CENTS;
  }
  let total = BASE_AMOUNT_CENTS;
  if (opts.withFireworks) total += ADDONS.fireworks.cents;
  if (opts.withSound) total += ADDONS.sound.cents;
  return total;
}

/**
 * Remise (en centimes, positive) appliquée quand les deux options sont
 * prises ensemble. 0 si une seule ou aucune option n'est sélectionnée.
 * Sert à afficher la ligne « − 0,50 € » dans le récapitulatif.
 */
export function bundleDiscountCents(opts: AddonSelection): number {
  if (opts.withFireworks && opts.withSound) {
    return ADDONS.fireworks.cents + ADDONS.sound.cents - BUNDLE_CENTS;
  }
  return 0;
}
