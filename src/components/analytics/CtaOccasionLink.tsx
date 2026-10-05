"use client";

import Link from "next/link";
import { track, type CtaPosition } from "@/lib/analytics";
import type { OccasionSlug } from "@/lib/occasions";
import type { RevealMechanic } from "@/components/reveals/types";
import type { AnnonceTemplate } from "@/components/AnnonceCard";

/**
 * CTA « Créer ma carte » des landings /idees/<slug>.
 *
 * Trois choses le distinguent du CtaCreerLink des pages marketing :
 *   1. il envoie `idee_cta_creer_clic` avec l'occasion d'origine — sans ça
 *      on saurait que le SEO convertit, pas quelle requête paie ;
 *   2. il ajoute `?src=idee` à la destination, que /creer relit pour
 *      qualifier sa propre page vue. Les deux bouts du funnel se recollent ;
 *   3. il emporte le modèle d'annonce et la mécanique de la démo. Le
 *      visiteur vient de jouer un polaroid sur une page « naissance » :
 *      sans ces deux paramètres, il atterrissait sur un formulaire réglé
 *      d'office sur « ticket à gratter » + modèle « mariage », avec les
 *      libellés « Noms des mariés », et devait refaire à la main le choix
 *      qu'il venait de faire. C'est le signal d'intention le plus fort du
 *      funnel ; il était jeté entre les deux pages.
 */
export function CtaOccasionLink({
  occasion,
  position,
  template,
  mechanic,
  className = "btn-primary",
  children,
}: {
  occasion: OccasionSlug;
  position: CtaPosition;
  /** Modèle d'annonce de la démo jouée — pré-sélectionné sur /creer. */
  template: AnnonceTemplate;
  /** Mécanique de la démo jouée — pré-cochée sur /creer. */
  mechanic: RevealMechanic;
  className?: string;
  children: React.ReactNode;
}) {
  const href =
    `/creer?src=idee&modele=${encodeURIComponent(template)}` +
    `&format=${encodeURIComponent(mechanic)}`;

  return (
    <Link
      href={href}
      className={className}
      onClick={() => track("idee_cta_creer_clic", { occasion, position })}
    >
      {children}
    </Link>
  );
}
