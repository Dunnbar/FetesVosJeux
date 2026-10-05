"use client";

import { useEffect, useRef } from "react";
import { sourceDepuisUrl, track } from "@/lib/analytics";

/**
 * Marche 2 du funnel : l'arrivée sur /creer.
 *
 * Ne rend rien — la page reste un Server Component statique, ce petit
 * composant client se contente d'envoyer l'event après hydratation. La
 * provenance est lue dans `?src=` côté client (cf. sourceDepuisUrl) pour ne
 * pas rendre la page dynamique.
 */
export function CreerPageView() {
  // React remonte deux fois les composants en dev (StrictMode) : sans ce
  // garde-fou, chaque visite compterait double.
  const envoye = useRef(false);

  useEffect(() => {
    if (envoye.current) return;
    envoye.current = true;
    track("creer_vue", { source: sourceDepuisUrl() });
  }, []);

  return null;
}
