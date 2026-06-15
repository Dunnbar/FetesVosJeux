"use client";

/**
 * Branche la musique de révélation (option « Son & musique ») dans une
 * expérience de carte, et fournit le bouton 🔊/🔇 toujours accessible pour
 * couper / reprendre.
 *
 * Partagé entre la carte réelle (/g/[code]) et l'aperçu créateur
 * (/creer/[code]/preview) pour un comportement strictement identique.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { startRevealMusic, type RevealMusicController } from "@/lib/music";

export function useRevealMusic() {
  const controllerRef = useRef<RevealMusicController | null>(null);
  const startedRef = useRef(false);
  const [hasMusic, setHasMusic] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Lance la musique une seule fois, à la révélation.
  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const controller = startRevealMusic();
    controllerRef.current = controller;
    if (controller) {
      setHasMusic(true);
      setPlaying(true);
    }
  }, []);

  const toggle = useCallback(() => {
    if (controllerRef.current) setPlaying(controllerRef.current.toggle());
  }, []);

  // Coupe la musique si on quitte la page.
  useEffect(() => () => controllerRef.current?.stop(), []);

  return { start, toggle, hasMusic, playing };
}

interface MusicButtonProps {
  hasMusic: boolean;
  playing: boolean;
  onToggle: () => void;
}

export function MusicButton({ hasMusic, playing, onToggle }: MusicButtonProps) {
  if (!hasMusic) return null;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Couper la musique" : "Remettre la musique"}
      title={playing ? "Couper la musique" : "Remettre la musique"}
      className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-night-2)] text-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
    >
      <span aria-hidden>{playing ? "🔊" : "🔇"}</span>
    </button>
  );
}
