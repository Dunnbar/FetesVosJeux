"use client";

import { ScratchCanvas } from "@/components/ScratchCanvas";
import { AnnonceCard } from "@/components/AnnonceCard";
import type { RevealCardProps } from "./types";

/**
 * Wrapper qui adapte le ScratchCanvas existant à l'interface RevealCardProps.
 * Permet de l'utiliser dans le dispatcher de manière uniforme avec les autres
 * mécaniques (Polaroid, Enveloppe, Champagne, Encre).
 */
export function ScratchReveal({
  coverImageSrc,
  annonceMode,
  annonceTemplate,
  annonceTitle,
  annonceSubtitle,
  annonceBody,
  annonceImageSrc,
  onReveal,
  size = 450,
  coverPosX,
  coverPosY,
  coverZoom,
}: RevealCardProps) {
  return (
    <ScratchCanvas
      coverImageSrc={coverImageSrc}
      onReveal={onReveal}
      size={size}
      coverPosX={coverPosX}
      coverPosY={coverPosY}
      coverZoom={coverZoom}
    >
      <AnnonceCard
        mode={annonceMode}
        template={annonceTemplate}
        title={annonceTitle}
        subtitle={annonceSubtitle}
        body={annonceBody}
        imageSrc={annonceImageSrc}
        imageAlt={annonceTitle ?? "Annonce"}
      />
    </ScratchCanvas>
  );
}
