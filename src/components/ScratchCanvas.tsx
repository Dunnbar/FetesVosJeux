"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Sprite de brosse circulaire — 80×49 px PNG avec alpha graduel.
// Servi depuis /public/brush.png (extrait du POC photo_a_gratter).
// Pourquoi pas un data:URI inline ? Un seul caractère corrompu au copier-coller
// avait causé "Image corrupt or truncated" en Firefox (Chrome plus tolérant).
// Le fichier statique élimine ce risque.
const BRUSH_URL = "/brush.png";

type Point = { x: number; y: number };

function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
function angle(a: Point, b: Point) {
  return Math.atan2(b.x - a.x, b.y - a.y);
}

interface ScratchCanvasProps {
  /** URL de l'image qui sert de couverture grattable (uploadée par l'acheteur). */
  coverImageSrc: string;
  /** Pourcentage de pixels effacés au-delà duquel on déclenche la révélation. */
  revealThreshold?: number;
  /** Callback déclenché une seule fois quand le seuil est atteint. */
  onReveal?: () => void;
  /** Taille du canvas (carré). */
  size?: number;
  /** Cadrage de la cover : point focal (0–1) + zoom (1 = cover de base). */
  coverPosX?: number;
  coverPosY?: number;
  coverZoom?: number;
  /** Contenu placé DERRIÈRE le canvas, révélé au fur et à mesure du grattage.
   *  Typiquement : <AnnonceCard ... /> ou une image annonce. */
  children: React.ReactNode;
}

export function ScratchCanvas({
  coverImageSrc,
  revealThreshold = 80,
  onReveal,
  size = 450,
  coverPosX = 0.5,
  coverPosY = 0.5,
  coverZoom = 1,
  children,
}: ScratchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brushRef = useRef<HTMLImageElement | null>(null);
  const lastPointRef = useRef<Point | null>(null);
  const drawingRef = useRef(false);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  // `coverPainted` reste false tant que la couverture canvas n'est pas peinte
  // (l'image cover doit d'abord avoir été décodée). Tant que c'est false,
  // on masque le contenu révélé sous le canvas pour éviter un flash visuel.
  const [coverPainted, setCoverPainted] = useState(false);

  // Pré-charge le sprite de brosse une seule fois.
  useEffect(() => {
    const brush = new Image();
    brush.src = BRUSH_URL;
    brushRef.current = brush;
  }, []);

  // Peint la couverture (image uploadée par l'acheteur) dans le canvas.
  // Doit se faire dans le canvas (et pas en CSS au-dessus) pour que
  // `globalCompositeOperation = "destination-out"` puisse l'effacer au grattage.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Backing pixel ratio — bords nets sur écrans hidpi.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const img = new Image();
    // L'image cover est servie depuis Vercel Blob (cross-origin) en prod.
    // Sans CORS, dessiner l'image "tainte" le canvas et getImageData() lève
    // "The operation is insecure" → la détection de grattage plante et la
    // carte ne se révèle jamais. crossOrigin="anonymous" évite le taint
    // (Vercel Blob public renvoie les en-têtes CORS). Doit être posé AVANT src.
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Crop "object-fit: cover" + cadrage (zoom & point focal).
      // baseScale = remplir le carré ; le zoom rétrécit la zone source visible ;
      // le point focal (0–1) choisit quelle portion on garde.
      const baseScale = Math.max(size / img.width, size / img.height);
      const z = Math.max(1, coverZoom);
      const sw = size / baseScale / z;
      const sh = size / baseScale / z;
      const px = Math.min(1, Math.max(0, coverPosX));
      const py = Math.min(1, Math.max(0, coverPosY));
      const sx = px * (img.width - sw);
      const sy = py * (img.height - sh);
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size);
      setCoverPainted(true);
    };
    img.onerror = () => {
      // En cas d'échec de chargement (URL morte, fichier supprimé…), on peint
      // un fallback gris uni pour que le canvas reste grattable et que l'utilisateur
      // accède quand même à l'annonce derrière.
      ctx.fillStyle = "#b6b3a8";
      ctx.fillRect(0, 0, size, size);
      setCoverPainted(true);
    };
    img.src = coverImageSrc;
  }, [size, coverImageSrc, coverPosX, coverPosY, coverZoom]);

  // Calcule le pourcentage de pixels suffisamment effacés.
  // La brosse a un alpha graduel (bords doux) : en grattant, beaucoup de
  // pixels deviennent partiellement transparents sans jamais atteindre
  // exactement alpha 0. On compte donc comme "effacé" tout pixel dont l'alpha
  // est passé sous la moitié — ça colle à ce que l'œil perçoit comme gratté.
  const computeErasedPercent = useCallback((): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const stride = 32; // 1 pixel sur 8 — assez précis et 8x plus rapide
    let erased = 0;
    let sampled = 0;
    for (let i = 3; i < data.length; i += stride) {
      sampled++;
      if (data[i] < 128) erased++;
    }
    return Math.round((erased / sampled) * 100);
  }, []);

  // Refs pour onReveal / revealThreshold : permet d'avoir un useEffect
  // d'écouteurs avec deps vide (pas de réattach à chaque re-render parent).
  const onRevealRef = useRef(onReveal);
  useEffect(() => {
    onRevealRef.current = onReveal;
  }, [onReveal]);

  const revealThresholdRef = useRef(revealThreshold);
  useEffect(() => {
    revealThresholdRef.current = revealThreshold;
  }, [revealThreshold]);

  // Écouteurs Mouse + Touch — pattern POC photo_a_gratter, universel
  // (Firefox inclus). Tout est sur le canvas, pas sur document.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getEventPos = (e: MouseEvent | TouchEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;
      if ("touches" in e) {
        const t = e.touches[0] ?? e.changedTouches[0];
        if (!t) return { x: 0, y: 0 };
        clientX = t.clientX;
        clientY = t.clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      if (revealedRef.current) return;
      drawingRef.current = true;
      lastPointRef.current = getEventPos(e);
      paintStroke(lastPointRef.current, lastPointRef.current);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!drawingRef.current || revealedRef.current) return;
      e.preventDefault();
      const current = getEventPos(e);
      if (lastPointRef.current) {
        paintStroke(lastPointRef.current, current);
      }
      lastPointRef.current = current;

      const pct = computeErasedPercent();
      if (pct >= revealThresholdRef.current && !revealedRef.current) {
        revealedRef.current = true;
        setRevealed(true);
        onRevealRef.current?.();
      }
    };

    const handleEnd = () => {
      drawingRef.current = false;
      lastPointRef.current = null;
    };

    // Souris : down sur le canvas (déclenche), mais move/up sur le DOCUMENT
    // pour que le drag continue même si le curseur sort temporairement du
    // cadre (cas classique : on gratte vite, on dépasse les bords, on revient).
    canvas.addEventListener("mousedown", handleStart);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);

    // Tactile : tout reste sur le canvas — le navigateur "capture" le doigt
    // une fois posé, même si on déborde un peu visuellement.
    canvas.addEventListener("touchstart", handleStart, { passive: false });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    canvas.addEventListener("touchend", handleEnd);
    canvas.addEventListener("touchcancel", handleEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("touchstart", handleStart);
      canvas.removeEventListener("touchmove", handleMove);
      canvas.removeEventListener("touchend", handleEnd);
      canvas.removeEventListener("touchcancel", handleEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paintStroke = (from: Point, to: Point) => {
    const canvas = canvasRef.current;
    const brush = brushRef.current;
    if (!canvas || !brush) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    const dist = distance(from, to);
    const a = angle(from, to);

    if (dist < 1) {
      // Pression simple : tampon en cercle pour produire une trace visible.
      for (let k = 0; k < 6; k++) {
        const theta = (k / 6) * Math.PI * 2;
        ctx.drawImage(
          brush,
          from.x + Math.cos(theta) * 6 - 25,
          from.y + Math.sin(theta) * 6 - 25
        );
      }
      ctx.drawImage(brush, from.x - 25, from.y - 25);
      return;
    }

    // Trace continue : un tampon tous les pixels (comme le POC).
    for (let i = 0; i < dist; i++) {
      const x = from.x + Math.sin(a) * i - 25;
      const y = from.y + Math.cos(a) * i - 25;
      ctx.drawImage(brush, x, y);
    }
  };

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      {/* Contenu révélé (annonce texte ou image) — placé derrière le canvas.
          On le monte seulement après que la couverture soit peinte, sinon il
          serait brièvement visible au chargement (le canvas est vide au
          premier paint React). */}
      {coverPainted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {children}
        </div>
      )}

      {/* Canvas — couverture grattable. Tous les écouteurs sont attachés
          via useEffect pour pouvoir passer { passive: false } sur touchmove
          (nécessaire pour bloquer le scroll mobile pendant le grattage). */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none select-none cursor-grab active:cursor-grabbing transition-opacity duration-500"
        style={{
          opacity: revealed ? 0 : 1,
          pointerEvents: revealed ? "none" : "auto",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}
