"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RevealCard } from "@/components/reveals/RevealCard";
import {
  REVEAL_MECHANICS,
  type RevealMechanic,
} from "@/components/reveals/types";
import { Fireworks } from "@/components/Fireworks";
import { MusicButton, useRevealMusic } from "@/components/RevealMusic";

interface ScratchExperienceProps {
  code: string;
  revealMechanic: string;
  coverImagePath: string;
  annonceMode: string;
  annonceTemplate: string | null;
  annonceTitle: string | null;
  annonceSubtitle: string | null;
  annonceBody: string | null;
  annonceImagePath: string | null;
  withFireworks: boolean;
  withSound: boolean;
}

/**
 * Pour chaque mécanique, le verbe principal du headline.
 * "Gratte la photo / pour découvrir" → "[verbe] / pour découvrir".
 */
const HEADLINE_VERB: Record<RevealMechanic, string> = {
  scratch: "Gratte la photo",
  polaroid: "Développe le Polaroid",
  envelope: "Ouvre l'enveloppe",
};

export function ScratchExperience({
  revealMechanic,
  coverImagePath,
  annonceMode,
  annonceTemplate,
  annonceTitle,
  annonceSubtitle,
  annonceBody,
  annonceImagePath,
  withFireworks,
  withSound,
}: ScratchExperienceProps) {
  const [revealed, setRevealed] = useState(false);
  const music = useRevealMusic();

  const handleReveal = () => {
    setRevealed(true);
    if (withSound) music.start();
  };

  // Taille du canvas : on attend le premier client-render pour mesurer.
  const [canvasSize, setCanvasSize] = useState(450);
  useEffect(() => {
    setCanvasSize(Math.min(450, window.innerWidth - 48));
  }, []);

  const coverSrc = toPublicUrl(coverImagePath);
  const annonceImgSrc = annonceImagePath ? toPublicUrl(annonceImagePath) : null;

  // Cast safe avec fallback : si revealMechanic est inconnu, on tombe sur scratch.
  const mechanic = (revealMechanic in HEADLINE_VERB
    ? revealMechanic
    : "scratch") as RevealMechanic;
  const verb = HEADLINE_VERB[mechanic];
  const hint = REVEAL_MECHANICS[mechanic].hint;

  const showFireworks = revealed && withFireworks;

  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-8 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] mb-3">
            ◆ Tu as reçu une carte
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {verb}
            <span className="text-[var(--color-gold)]"> pour découvrir</span>
          </h1>
        </div>

        <div className="relative">
          <RevealCard
            mechanic={mechanic}
            coverImageSrc={coverSrc}
            annonceMode={annonceMode === "image" ? "image" : "text"}
            annonceTemplate={annonceTemplate}
            annonceTitle={annonceTitle}
            annonceSubtitle={annonceSubtitle}
            annonceBody={annonceBody}
            annonceImageSrc={annonceImgSrc}
            onReveal={handleReveal}
            size={canvasSize}
          />
        </div>

        {!revealed && (
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-night-text-dim)]">
            ▸ {hint}
          </p>
        )}

        {/* CTA viral — apparaît après la révélation */}
        <div
          aria-hidden={!revealed}
          className={`mt-16 text-center max-w-md transition-all duration-700 ${
            revealed
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          style={{ transitionDelay: revealed ? "0.6s" : "0s" }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] mb-3">
            ◆ À toi de surprendre
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
            Crée ta propre carte
            <span className="text-[var(--color-gold)]"> à gratter</span>.
          </h2>
          <Link href="/creer" className="btn-primary">
            Créer ma carte ▸
          </Link>
        </div>
      </main>

      <Fireworks active={showFireworks} />
      <MusicButton
        hasMusic={music.hasMusic}
        playing={music.playing}
        onToggle={music.toggle}
      />
    </>
  );
}

/** Normalise une valeur stockée en DB en URL utilisable en <img src>. */
function toPublicUrl(value: string): string {
  if (/^https?:\/\//.test(value)) return value;
  if (value.startsWith("/")) return value;
  return `/${value}`;
}
