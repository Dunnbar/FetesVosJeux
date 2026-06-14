"use client";

import { useEffect, useRef, useState } from "react";
import type { RevealCardProps } from "./types";

/**
 * Mécanique "Polaroid à développer".
 * Au clic, l'image cover passe progressivement d'un état flou / désaturé / sombre
 * à une image nette en couleur en 3.5s — métaphore du développement photo.
 * `onReveal` est appelé une seule fois à la fin du développement.
 */

const DEVELOP_DURATION_MS = 3500;

export function PolaroidReveal({
  coverImageSrc,
  annonceTitle,
  annonceSubtitle,
  annonceBody,
  annonceTemplate,
  onReveal,
  size = 320,
}: RevealCardProps) {
  const [developing, setDeveloping] = useState(false);
  const [developed, setDeveloped] = useState(false);
  // Ref garde-fou : onReveal ne doit être appelé qu'UNE seule fois,
  // même si le composant re-render entre le clic et le timeout.
  const revealedRef = useRef(false);
  const onRevealRef = useRef(onReveal);

  useEffect(() => {
    onRevealRef.current = onReveal;
  }, [onReveal]);

  const handleDevelop = () => {
    if (developing || developed) return;
    setDeveloping(true);
    window.setTimeout(() => {
      setDeveloped(true);
      if (!revealedRef.current) {
        revealedRef.current = true;
        onRevealRef.current?.();
      }
    }, DEVELOP_DURATION_MS);
  };

  const isMariage = annonceTemplate === "mariage";
  // Filtre initial : flou, désaturé, sombre — comme une photo non développée.
  // À l'activation, on passe à "neutre" sur la durée de développement.
  const filterStyle = developing
    ? "blur(0) grayscale(0) brightness(1)"
    : "blur(20px) grayscale(1) brightness(0.7)";

  return (
    <div
      className="inline-block"
      style={{ width: size }}
    >
      <button
        type="button"
        onClick={handleDevelop}
        disabled={developing || developed}
        className={`group block bg-white rounded-sm shadow-2xl p-3 pb-16 transition-transform duration-500 ease-out ${
          developed || developing ? "rotate-0" : "-rotate-2 hover:rotate-0 cursor-pointer"
        }`}
        style={{ width: size }}
        aria-label="Développer le polaroid"
      >
        {/* Zone image carrée — fond noir pour la phase "non développée" */}
        <div
          className="relative overflow-hidden bg-black"
          style={{ width: size - 24, height: size - 24 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImageSrc}
            alt=""
            draggable={false}
            className="block w-full h-full object-cover select-none"
            style={{
              filter: filterStyle,
              transition: `filter ${DEVELOP_DURATION_MS}ms ease-out`,
            }}
          />

          {/* Indication de clic — disparaît dès le début du développement */}
          {!developing && !developed && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/90 bg-black/50 px-3 py-1.5 rounded-sm">
                ▸ Clique pour développer
              </span>
            </div>
          )}
        </div>

        {/* Pied du Polaroid — caption manuscrite.
            Reste invisible tant que la photo n'est pas développée, sinon
            l'annonce serait "spoilée" avant l'interaction. Fade-in à la fin
            du développement, avec un petit délai pour laisser souffler après
            la révélation de la photo. */}
        <div
          className="mt-4 px-2 text-center text-[var(--color-ink)] transition-opacity duration-700"
          style={{
            opacity: developed ? 1 : 0,
            transitionDelay: developed ? "300ms" : "0ms",
          }}
          aria-hidden={!developed}
        >
          {annonceTitle && (
            <div className="font-bold text-xl leading-tight">
              {isMariage && (
                <span className="text-[var(--color-gold)] mr-2">✦ ♥ ✦</span>
              )}
              {annonceTitle}
            </div>
          )}
          {annonceSubtitle && (
            <div className="italic text-sm text-[var(--color-ink-dim)] mt-1">
              {annonceSubtitle}
            </div>
          )}
          {annonceBody && (
            <div className="text-xs text-[var(--color-ink-dim)] mt-2 leading-snug">
              {annonceBody}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

export default PolaroidReveal;
