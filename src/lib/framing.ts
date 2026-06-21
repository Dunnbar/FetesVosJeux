import type { CSSProperties } from "react";

/**
 * Cadrage d'une cover dans un carré : point focal (0–1) + zoom.
 * 0.5/0.5 = centré, zoom 1 = "object-fit: cover" de base.
 */
export interface Framing {
  posX: number;
  posY: number;
  zoom: number;
}

export const DEFAULT_FRAMING: Framing = { posX: 0.5, posY: 0.5, zoom: 1 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Style CSS pour afficher une image cadrée qui remplit un conteneur carré
 * (relative + overflow-hidden). Exprimé en % → indépendant de la taille du
 * conteneur, donc l'éditeur et l'aperçu produisent EXACTEMENT le même rendu,
 * et ça correspond au crop fait côté canvas (ScratchCanvas).
 */
export function framedImageStyle(aspectRatio: number, f: Framing): CSSProperties {
  const z = Math.max(1, f.zoom);
  const widthPct = Math.max(1, aspectRatio) * z * 100;
  const heightPct = Math.max(1, 1 / aspectRatio) * z * 100;
  return {
    position: "absolute",
    width: `${widthPct}%`,
    height: `${heightPct}%`,
    left: `${-clamp01(f.posX) * (widthPct - 100)}%`,
    top: `${-clamp01(f.posY) * (heightPct - 100)}%`,
    maxWidth: "none", // annule un éventuel max-width:100% global sur <img>
  };
}
