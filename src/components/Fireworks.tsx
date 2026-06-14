"use client";

import "./fireworks.css";

/**
 * Feux d'artifice plein écran déclenchés à la révélation.
 * Le CSS provient du POC photo_a_gratter — 20 patterns indépendants
 * positionnés en pourcentage de l'écran, chacun avec sa propre animation.
 *
 * Quand `active` est vrai, les patterns deviennent visibles et leurs
 * animations CSS jouent en boucle.
 */
export function Fireworks({ active }: { active: boolean }) {
  const count = 20;

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
      style={{ display: active ? "block" : "none" }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`pattern${i} fireworks fire${i}`}
          style={{ display: "block" }}
        >
          <div className="ring_1" />
          <div className="ring_2" />
        </div>
      ))}
    </div>
  );
}
