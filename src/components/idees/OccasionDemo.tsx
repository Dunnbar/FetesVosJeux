"use client";

import { useEffect, useRef, useState } from "react";
import { RevealCard } from "@/components/reveals/RevealCard";
import { Fireworks } from "@/components/Fireworks";
import { REVEAL_MECHANICS, type RevealMechanic } from "@/components/reveals/types";
import type { AnnonceTemplate } from "@/components/AnnonceCard";
import { track } from "@/lib/analytics";
import type { OccasionSlug } from "@/lib/occasions";

/**
 * La vraie carte, jouable, au milieu d'une page SEO.
 *
 * Ce n'est pas une capture ni une animation en boucle : c'est le composant
 * que recevra le destinataire, monté avec un contenu figé et sans base de
 * données. C'est tout l'intérêt de la page — on ne décrit pas le produit,
 * on le fait essayer.
 *
 * Pourquoi ce wrapper client existe alors que les pages sont serveur :
 * `onReveal` est une fonction, donc non sérialisable à travers la frontière
 * RSC. Impossible de la passer depuis la page. Tout le reste de la landing
 * reste un Server Component statique.
 */

/** Place verticale réservée selon la mécanique, pour que rien ne saute. */
function hauteurReservee(mechanic: RevealMechanic, size: number): number {
  switch (mechanic) {
    // Le polaroid fait `size` de large mais ajoute son cadre bas + la légende.
    case "polaroid":
      return size + 64;
    // L'enveloppe est fermée en paysage (0.62) et grandit à l'ouverture.
    case "envelope":
      return Math.round(size * 1.24) + 20;
    case "scratch":
    default:
      return size;
  }
}

export function OccasionDemo({
  occasion,
  mechanic,
  coverImageSrc,
  template,
  title,
  subtitle,
  body,
  alt,
}: {
  occasion: OccasionSlug;
  mechanic: RevealMechanic;
  coverImageSrc: string;
  template: AnnonceTemplate;
  title: string;
  subtitle: string;
  body: string;
  alt: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const conteneur = useRef<HTMLDivElement>(null);

  // 320 au premier rendu, des deux côtés de l'hydratation : on ne mesure
  // qu'après, sinon le HTML serveur et le HTML client divergent.
  const [size, setSize] = useState(320);

  useEffect(() => {
    const mesurer = () => {
      const dispo = conteneur.current?.clientWidth ?? 320;
      // Bornes : assez grand pour qu'un doigt gratte, assez petit pour
      // tenir dans le px-6 d'un iPhone SE.
      setSize(Math.max(240, Math.min(360, Math.floor(dispo))));
    };
    mesurer();
    window.addEventListener("resize", mesurer);
    return () => window.removeEventListener("resize", mesurer);
  }, []);

  const meca = REVEAL_MECHANICS[mechanic];

  return (
    <figure className="m-0" ref={conteneur}>
      <div
        className="relative flex items-center justify-center"
        style={{ minHeight: hauteurReservee(mechanic, size) }}
      >
        {/* Le `group` ARIA donne un nom à la zone interactive : sans lui, un
            lecteur d'écran annonce un bouton « développer » sans contexte. */}
        <div role="group" aria-label={alt}>
          <RevealCard
            mechanic={mechanic}
            coverImageSrc={coverImageSrc}
            // L'alt descend jusqu'à l'<img> des mécaniques polaroid et
            // enveloppe. Sans lui, la seule image des landings sortait avec
            // un alt vide — illisible pour Google Images, alors que le
            // sitemap d'images déclare justement cette photo.
            alt={alt}
            annonceMode="text"
            annonceTemplate={template}
            annonceTitle={title}
            annonceSubtitle={subtitle}
            annonceBody={body}
            annonceImageSrc={null}
            size={size}
            onReveal={() => {
              setRevealed(true);
              track("idee_demo_jouee", { occasion, format: mechanic });
            }}
          />
        </div>

        {/* `contained` est obligatoire ici : sans lui l'overlay est en
            position fixed et couvre toute la page. */}
        <Fireworks active={revealed} contained />
      </div>

      <figcaption
        className="mt-6 text-center text-sm text-[var(--color-ink-dim)] leading-relaxed"
        aria-live="polite"
      >
        {revealed
          ? "Voilà exactement ce que verront tes proches — avec ta photo et tes mots."
          : `${meca.emoji} ${meca.hint} — c'est une vraie carte, vas-y.`}
      </figcaption>
    </figure>
  );
}
