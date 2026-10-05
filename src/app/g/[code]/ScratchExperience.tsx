"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RevealCard } from "@/components/reveals/RevealCard";
import { type RevealMechanic } from "@/components/reveals/types";
import { Fireworks } from "@/components/Fireworks";
import { MusicButton, useRevealMusic } from "@/components/RevealMusic";
import { track } from "@/lib/analytics";

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
  coverPosX: number;
  coverPosY: number;
  coverZoom: number;
  scratchTextOnTop: boolean;
}

/**
 * Pour chaque mécanique, le verbe principal du headline.
 * "Gratte la photo / pour découvrir" → "[verbe] / pour découvrir".
 */
const HEADLINE_VERB: Record<RevealMechanic, string> = {
  scratch: "Gratte le ticket",
  polaroid: "Développe le Polaroid",
  envelope: "Ouvre l'enveloppe",
};

export function ScratchExperience({
  code,
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
  coverPosX,
  coverPosY,
  coverZoom,
  scratchTextOnTop,
}: ScratchExperienceProps) {
  const [revealed, setRevealed] = useState(false);
  const music = useRevealMusic();

  // Toutes les cartes de démo (seed + seed-series) commencent par DEMO.
  // Sans ce drapeau, les démos de la home noieraient le signal des vraies
  // cartes reçues. Le code, lui, ne sort jamais d'ici.
  const estDemo = code.startsWith("DEMO");

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

  const showFireworks = revealed && withFireworks;

  // Ouverture de la carte — le dénominateur du taux de révélation.
  const ouvertureEnvoyee = useRef(false);
  useEffect(() => {
    if (ouvertureEnvoyee.current) return;
    ouvertureEnvoyee.current = true;
    track("carte_ouverte", { format: mechanic, demo: estDemo });
  }, [mechanic, estDemo]);

  // Boucle virale — il est allé au bout. onReveal est déjà garanti unique
  // par chaque mécanique, mais `revealed` suffit comme déclencheur.
  useEffect(() => {
    if (!revealed) return;
    track("carte_revelee", { format: mechanic, demo: estDemo });
  }, [revealed, mechanic, estDemo]);

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
            coverPosX={coverPosX}
            coverPosY={coverPosY}
            coverZoom={coverZoom}
            scratchTextOnTop={scratchTextOnTop}
          />
        </div>

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
          {/* `?src=carte` : c'est ce qui permet à /creer de savoir qu'un
              visiteur vient d'une carte reçue — l'event pivot de la boucle. */}
          <Link
            href="/creer?src=carte"
            className="btn-primary"
            onClick={() =>
              track("carte_cta_creer_clic", { format: mechanic, demo: estDemo })
            }
          >
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
