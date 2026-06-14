/**
 * Formate un prix en centimes vers une chaîne lisible en euros.
 * ex: 500 -> "5 €"
 */
export function formatPrice(cents: number): string {
  const euros = cents / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: euros % 1 === 0 ? 0 : 2,
  }).format(euros);
}
