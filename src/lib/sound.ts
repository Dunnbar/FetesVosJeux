"use client";

/**
 * Son de révélation joué au moment où le destinataire découvre l'annonce.
 *
 * Implémenté en pur Web Audio API — pas de fichier audio à charger, pas
 * de souci de licence, pas de format ni de compatibilité navigateur.
 * Synthèse de 3 notes en arpège ascendant (Do-Mi-Sol majeur) + une
 * petite "sparkle" aiguë à la fin pour l'effet champagne.
 *
 * Doit être appelé en réponse à un geste utilisateur (clic / scratch) —
 * les navigateurs bloquent autrement le démarrage de l'AudioContext.
 */
export function playRevealSound() {
  // AudioContext n'existe que côté client. On garde un try/catch global
  // au cas où le navigateur le bloque (Safari avec restrictions, etc.).
  try {
    type AudioCtor =
      | typeof AudioContext
      | (Window & { webkitAudioContext?: typeof AudioContext })["webkitAudioContext"];
    const Ctor: AudioCtor | undefined =
      typeof window === "undefined"
        ? undefined
        : window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
    if (!Ctor) return;

    const ctx = new Ctor();
    const now = ctx.currentTime;

    // Arpège majeur : Do5 — Mi5 — Sol5, chaque note ~120ms d'attaque,
    // décroissance exponentielle pour un son chaleureux pas agressif.
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle"; // doux, festif
      osc.frequency.value = freq;
      const start = now + i * 0.12;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.5);
    });

    // Petite "sparkle" aiguë juste après pour le côté champagne / paillette.
    const sparkleStart = now + 0.4;
    const sparkleOsc = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    sparkleOsc.type = "sine";
    sparkleOsc.frequency.value = 1568; // G6
    sparkleGain.gain.setValueAtTime(0, sparkleStart);
    sparkleGain.gain.linearRampToValueAtTime(0.1, sparkleStart + 0.02);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, sparkleStart + 0.6);
    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);
    sparkleOsc.start(sparkleStart);
    sparkleOsc.stop(sparkleStart + 0.7);

    // Fermeture du contexte après lecture pour libérer les ressources.
    window.setTimeout(() => ctx.close().catch(() => undefined), 1500);
  } catch (e) {
    console.warn("[sound] playback failed", e);
  }
}
