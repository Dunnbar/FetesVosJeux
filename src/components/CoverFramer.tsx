"use client";

import { useEffect, useRef, useState } from "react";
import { framedImageStyle, type Framing } from "@/lib/framing";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Affiche une cover cadrée qui remplit son conteneur (relative + overflow-hidden).
 * Lecture seule — utilisé dans l'aperçu.
 */
export function FramedImage({
  src,
  framing,
  alt = "",
}: {
  src: string;
  framing: Framing;
  alt?: string;
}) {
  const [ar, setAr] = useState<number | null>(null);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setAr(img.naturalWidth / img.naturalHeight);
    img.src = src;
  }, [src]);
  if (!ar) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} draggable={false} style={framedImageStyle(ar, framing)} />;
}

/**
 * Éditeur de cadrage : on glisse l'image pour la repositionner et on zoome
 * avec le curseur. Contrôlé — remonte le cadrage via onChange.
 */
export function CoverFramer({
  src,
  framing,
  onChange,
  box = 280,
}: {
  src: string;
  framing: Framing;
  onChange: (f: Framing) => void;
  box?: number;
}) {
  const [ar, setAr] = useState<number | null>(null);
  const drag = useRef<{ x: number; y: number; posX: number; posY: number } | null>(
    null
  );

  useEffect(() => {
    const img = new Image();
    img.onload = () => setAr(img.naturalWidth / img.naturalHeight);
    img.src = src;
  }, [src]);

  const z = Math.max(1, framing.zoom);
  // Débordement de l'image au-delà du cadre, en px (pour convertir le drag).
  const oW = ar ? (Math.max(1, ar) * z - 1) * box : 0;
  const oH = ar ? (Math.max(1, 1 / ar) * z - 1) * box : 0;

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, posX: framing.posX, posY: framing.posY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    onChange({
      ...framing,
      posX: oW > 0 ? clamp01(drag.current.posX - dx / oW) : 0.5,
      posY: oH > 0 ? clamp01(drag.current.posY - dy / oH) : 0.5,
    });
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative overflow-hidden rounded-xl border-2 border-[var(--color-edge)] bg-[var(--color-cream-2)] cursor-grab active:cursor-grabbing touch-none"
        style={{ width: box, height: box, maxWidth: "100%" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {ar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" draggable={false} style={framedImageStyle(ar, framing)} />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/40"
        />
      </div>
      <div className="flex items-center gap-3 w-full" style={{ maxWidth: box }}>
        <span aria-hidden className="text-sm">
          🔍
        </span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={framing.zoom}
          onChange={(e) => onChange({ ...framing, zoom: parseFloat(e.target.value) })}
          aria-label="Zoom de la photo"
          className="flex-1 accent-[var(--color-rose-deep)]"
        />
      </div>
      <p className="text-xs text-[var(--color-ink-dim)]">
        Glisse l&apos;image pour la cadrer · zoom avec le curseur
      </p>
    </div>
  );
}
