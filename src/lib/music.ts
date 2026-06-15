"use client";

/**
 * Musique de révélation — option payante « Son & musique ».
 *
 * Joue un vrai morceau (fichier MP3 dans /public) à l'instant où le
 * destinataire révèle l'annonce, avec un fade-in pour éviter l'effet
 * "jump-scare". Le fichier n'est chargé qu'à cet appel (donc zéro poids
 * tant qu'on n'a pas scratché), et seulement si l'option est activée.
 *
 * Doit être appelé en réponse à un geste utilisateur (le scratch) — sinon
 * les navigateurs bloquent le démarrage de la lecture audio.
 *
 * Si le fichier ne charge pas (réseau, format, autoplay bloqué), on rejoue
 * le synthé de secours (`playRevealSound`) pour que l'option ne soit jamais
 * muette, et on retourne `null` (rien à contrôler).
 */

import { playRevealSound } from "./sound";

const MUSIC_SRC = "/audio/son_reveal.mp3";
const TARGET_VOLUME = 0.6;

export interface RevealMusicController {
  /** Coupe (pause) ou reprend la musique. Retourne `true` si elle joue après l'appel. */
  toggle: () => boolean;
  /** Arrête définitivement et libère la ressource. */
  stop: () => void;
}

export function startRevealMusic(): RevealMusicController | null {
  if (typeof window === "undefined") return null;

  let fellBack = false;
  const fallback = () => {
    if (fellBack) return;
    fellBack = true;
    playRevealSound();
  };

  try {
    const audio = new Audio(MUSIC_SRC);
    audio.preload = "auto";
    audio.volume = 0;

    let fade: number | undefined;
    const fadeTo = (to: number, done?: () => void) => {
      if (fade) window.clearInterval(fade);
      fade = window.setInterval(() => {
        // Montée douce (~1s) / descente plus rapide à la coupure.
        const delta = to > audio.volume ? 0.04 : -0.08;
        audio.volume = Math.max(0, Math.min(TARGET_VOLUME, audio.volume + delta));
        const reached =
          (to >= audio.volume && audio.volume >= TARGET_VOLUME) ||
          (to <= 0 && audio.volume <= 0);
        if (reached) {
          window.clearInterval(fade);
          fade = undefined;
          done?.();
        }
      }, 50);
    };

    // Échec de chargement → synthé de secours.
    audio.addEventListener("error", fallback);

    const played = audio.play();
    if (played && typeof played.then === "function") {
      played.then(() => fadeTo(TARGET_VOLUME)).catch(fallback);
    } else {
      fadeTo(TARGET_VOLUME);
    }

    return {
      toggle() {
        if (audio.paused) {
          audio.play().catch(() => undefined);
          fadeTo(TARGET_VOLUME);
          return true;
        }
        fadeTo(0, () => audio.pause());
        return false;
      },
      stop() {
        if (fade) window.clearInterval(fade);
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      },
    };
  } catch {
    fallback();
    return null;
  }
}
