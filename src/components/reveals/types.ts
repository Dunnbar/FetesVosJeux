/**
 * Interface partagée par tous les composants de révélation.
 * Chaque mécanique (scratch / polaroid / envelope / champagne / ink) implémente
 * cette interface — ScratchExperience choisit lequel rendre selon
 * `revealMechanic` stocké en DB.
 */
export interface RevealCardProps {
  /** L'image uploadée par l'acheteur (cover). Toujours URL absolue ou
   *  chemin relatif servi par Next (ex: "/uploads/x.jpg" ou
   *  "https://...blob.../x.jpg"). */
  coverImageSrc: string;

  /** Champs de l'annonce — utilisés en mode "text". */
  annonceTitle: string | null;
  annonceSubtitle: string | null;
  annonceBody: string | null;
  annonceTemplate: string | null;

  /** Mode image alternatif (rare pour l'instant, mais supporté). */
  annonceMode: "text" | "image";
  annonceImageSrc: string | null;

  /** Callback appelé une seule fois quand la révélation est complète. */
  onReveal?: () => void;

  /** Taille en pixels (carré). */
  size?: number;

  /** Cadrage de la cover : point focal (0–1) + zoom (1 = cover de base). */
  coverPosX?: number;
  coverPosY?: number;
  coverZoom?: number;
}

export type RevealMechanic = "scratch" | "polaroid" | "envelope";

export const REVEAL_MECHANICS: Record<
  RevealMechanic,
  { label: string; emoji: string; hint: string; demoCode: string }
> = {
  scratch: {
    label: "Ticket à gratter",
    emoji: "🎟️",
    hint: "Frotte la photo avec le doigt ou la souris",
    demoCode: "DEMOSCRATCH",
  },
  polaroid: {
    label: "Polaroid",
    emoji: "📸",
    hint: "Clique pour développer la photo",
    demoCode: "DEMOPOLAROID",
  },
  envelope: {
    label: "Enveloppe",
    emoji: "✉️",
    hint: "Ouvre l'enveloppe",
    demoCode: "DEMOENVELOPPE",
  },
};

export const REVEAL_MECHANIC_KEYS = Object.keys(
  REVEAL_MECHANICS
) as RevealMechanic[];
