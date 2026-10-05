"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/**
 * Marche 6 du funnel : la page de remerciement s'affiche, la carte est
 * payée. Event de CONTINUITÉ de funnel uniquement — le chiffre d'affaires,
 * lui, se lit côté Stripe, pas ici.
 *
 * On ne passe que le nombre de formats : ni le code, ni l'email, ni le lien.
 */
export function MerciPageView({ formats }: { formats: number }) {
  const envoye = useRef(false);

  useEffect(() => {
    if (envoye.current) return;
    envoye.current = true;
    track("merci_vue", { formats });
  }, [formats]);

  return null;
}
