"use client";

import { ScratchCanvas } from "@/components/ScratchCanvas";
import { AnnonceCard } from "@/components/AnnonceCard";
import { FramedImage } from "@/components/CoverFramer";
import type { RevealCardProps } from "./types";

/**
 * Wrapper qui adapte le ScratchCanvas à l'interface RevealCardProps.
 *
 * Deux sens selon `scratchTextOnTop` :
 *   - false (défaut) : on gratte la PHOTO → révèle le TEXTE (annonce derrière).
 *   - true           : on gratte le TEXTE (dessiné sur le canvas) → révèle la PHOTO.
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
  coverPosX = 0.5,
  coverPosY = 0.5,
  coverZoom = 1,
  scratchTextOnTop = false,
}: RevealCardProps) {
  if (scratchTextOnTop) {
    // On gratte le texte → la photo (cadrée) est révélée derrière.
    return (
      <ScratchCanvas
        coverText={{
          title: annonceTitle,
          subtitle: annonceSubtitle,
          body: annonceBody,
        }}
        onReveal={onReveal}
        size={size}
      >
        <FramedImage
          src={coverImageSrc}
          framing={{ posX: coverPosX, posY: coverPosY, zoom: coverZoom }}
          alt={annonceTitle ?? "Photo"}
        />
      </ScratchCanvas>
    );
  }

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
