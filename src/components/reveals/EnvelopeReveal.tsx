"use client";

/**
 * EnvelopeReveal — alternative à la mécanique de grattage.
 *
 * UX :
 *   1. Une enveloppe paysage fermée (rabat + sceau de cire rose).
 *   2. Au clic sur le rabat / sceau : le rabat pivote vers le haut (rotateX 180°).
 *   3. Une carte intérieure (l'annonce) glisse vers le haut hors de l'enveloppe.
 *   4. `onReveal` est appelé une seule fois quand la carte est sortie (~1500ms).
 *
 * Implémente l'interface RevealCardProps partagée avec les autres mécaniques.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import type { RevealCardProps } from "./types";
import { AnnonceCard } from "@/components/AnnonceCard";

export function EnvelopeReveal({
  coverImageSrc,
  annonceTitle,
  annonceSubtitle,
  annonceBody,
  annonceTemplate,
  annonceMode,
  annonceImageSrc,
  onReveal,
  size = 450,
}: RevealCardProps) {
  const [opened, setOpened] = useState(false);
  const [cardOut, setCardOut] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const revealedRef = useRef(false);

  // Proportions paysage : envelope ratio ~ 1 : 0.62 (style enveloppe DL).
  const width = size;
  const height = Math.round(size * 0.62);
  // Le rabat couvre le tiers supérieur — on prend ~52% pour que le triangle
  // descende joliment vers le centre.
  const flapHeight = Math.round(height * 0.52);
  // À l'ouverture, le wrapper s'agrandit en hauteur : la carte reste ancrée
  // en haut, l'enveloppe reste ancrée en bas, l'espace entre les deux est
  // créé par la croissance du wrapper lui-même.
  // ⇒ Le flex parent (page) "fait de la place" automatiquement : pas de
  //   débordement sur le headline au-dessus ni sur le CTA en dessous.
  const openHeight = height * 2 + 20;
  const wrapperHeight = cardOut ? openHeight : height;

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    // Le rabat ouvre en 800ms ; on lance le slide de la carte juste après.
    window.setTimeout(() => setCardOut(true), 800);
    // Total : 800ms (rabat) + 700ms (slide) = 1500ms avant onReveal.
    window.setTimeout(() => {
      if (!revealedRef.current) {
        revealedRef.current = true;
        onReveal?.();
      }
    }, 1500);
  };

  return (
    <>
    <div
      className="relative inline-block select-none transition-[height] duration-700 ease-out"
      style={{
        width,
        height: wrapperHeight,
        perspective: "1200px",
      }}
    >
      {/* Carte intérieure — ancrée en HAUT du wrapper (top: 0, height: h).
          Au repos, l'enveloppe (z-index 2) la recouvre. À l'ouverture, le
          wrapper grandit en hauteur : l'enveloppe glisse vers le bas (parce
          qu'elle est ancrée bottom: 0), la carte reste en place → elle
          devient visible. */}
      <div
        className="absolute left-0"
        style={{ width, height, top: 0, zIndex: 1 }}
      >
        <div className="relative w-full h-full bg-white rounded-md shadow-xl overflow-hidden">
          <AnnonceCard
            mode={annonceMode}
            template={annonceTemplate}
            title={annonceTitle}
            subtitle={annonceSubtitle}
            body={annonceBody}
            imageSrc={annonceImageSrc}
          />
          {/* Vignette du cover, coin bas-droit — cliquable pour agrandir. */}
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label="Agrandir la photo"
            title="Agrandir la photo"
            className="absolute bottom-2 right-2 w-[60px] h-[60px] rounded-md overflow-hidden border-2 border-white shadow-md bg-[var(--color-cream-3)] cursor-zoom-in p-0"
          >
            <Image
              src={coverImageSrc}
              alt=""
              width={60}
              height={60}
              className="w-full h-full object-cover"
              unoptimized
            />
          </button>
        </div>
      </div>

      {/* Groupe enveloppe (corps + rabat) — ancré en BAS du wrapper.
          Au repos il occupe tout le wrapper (couvre la carte). À l'ouverture,
          le wrapper devient plus haut, donc le groupe enveloppe glisse vers
          le bas tout en gardant sa taille — c'est ça qui révèle la carte. */}
      <div
        className="absolute left-0 right-0"
        style={{ bottom: 0, height, zIndex: 2 }}
      >
        {/* Corps de l'enveloppe (rectangle plein, avec un V intérieur suggéré
            par un dégradé subtil). */}
        <div
          className="absolute inset-0 bg-[var(--color-cream-2)] border border-[var(--color-ink-dim)]/30 rounded-sm shadow-sm"
          aria-hidden
        >
          {/* V intérieur (rabat fermé visuel) — purement décoratif. */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: opened ? 0 : 0.35,
              clipPath: "polygon(0 0, 100% 0, 50% 70%)",
              background:
                "linear-gradient(180deg, var(--color-cream-3) 0%, var(--color-cream-2) 100%)",
            }}
          />
        </div>

        {/* Wrapper 3D du rabat — perspective héritée du grand-parent. */}
        <div
          className="absolute left-0 right-0 top-0"
          style={{
            height: flapHeight,
            transformStyle: "preserve-3d",
            zIndex: 3,
          }}
        >
        <button
          type="button"
          onClick={handleOpen}
          disabled={opened}
          aria-label="Ouvrir l'enveloppe"
          className={`absolute inset-0 p-0 border-0 bg-transparent ${
            opened ? "cursor-default" : "cursor-pointer hover:scale-[1.02]"
          } transition-transform duration-200`}
          style={{
            transformOrigin: "top center",
            transform: opened ? "rotateX(180deg)" : "rotateX(0deg)",
            transitionProperty: "transform",
            transitionDuration: opened ? "800ms" : "200ms",
            transitionTimingFunction: "ease-out",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Triangle rabat */}
          <div
            className="absolute inset-0 bg-[var(--color-cream-2)] border border-[var(--color-ink-dim)]/30"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
          {/* Sceau de cire — ancré sur la pointe basse du triangle (≈ centre
              horizontal, juste au-dessus de la pointe). Dégradé "cire" +
              anneau gravé + étincelle, pour un rendu plus joli qu'une lettre. */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center"
            style={{
              top: flapHeight - 56 - 6,
              width: 56,
              height: 56,
              background:
                "radial-gradient(circle at 35% 30%, #ee9fb7 0%, var(--color-rose-deep) 55%, #b85e7d 100%)",
              boxShadow:
                "0 4px 10px -2px rgba(45,36,56,0.4), inset 0 2px 5px rgba(255,255,255,0.35), inset 0 -4px 7px rgba(0,0,0,0.22)",
            }}
            aria-hidden
          >
            {/* Anneau gravé */}
            <span
              className="absolute rounded-full"
              style={{ inset: 7, border: "1.5px solid rgba(255,255,255,0.35)" }}
            />
            {/* Emblème festif embossé */}
            <span
              style={{
                color: "rgba(255,255,255,0.92)",
                fontSize: 22,
                lineHeight: 1,
                textShadow: "0 1px 1px rgba(0,0,0,0.25)",
              }}
            >
              ✦
            </span>
          </div>
        </button>
        </div>
      </div>
    </div>

      {/* Lightbox : la photo en grand au clic sur la vignette. */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-zoom-out"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
        >
          <Image
            src={coverImageSrc}
            alt=""
            width={1000}
            height={1000}
            unoptimized
            className="max-w-[92vw] max-h-[88vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
