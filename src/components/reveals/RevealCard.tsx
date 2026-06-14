"use client";

import type { RevealCardProps, RevealMechanic } from "./types";
import { ScratchReveal } from "./ScratchReveal";
import { PolaroidReveal } from "./PolaroidReveal";
import { EnvelopeReveal } from "./EnvelopeReveal";

interface RevealCardComponentProps extends RevealCardProps {
  mechanic: RevealMechanic | string;
}

/**
 * Dispatcher : choisit le bon composant de révélation selon `mechanic`.
 * Si la valeur est inconnue (corruption DB, ancien format, mécanique
 * supprimée), fallback sur Scratch — comme ça les anciennes cartes
 * "champagne" ou "ink" restent accessibles, juste en mode gratter.
 */
export function RevealCard({ mechanic, ...rest }: RevealCardComponentProps) {
  switch (mechanic) {
    case "polaroid":
      return <PolaroidReveal {...rest} />;
    case "envelope":
      return <EnvelopeReveal {...rest} />;
    case "scratch":
    default:
      return <ScratchReveal {...rest} />;
  }
}
