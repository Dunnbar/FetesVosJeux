import { ImageResponse } from "next/og";
import { OCCASIONS, getOccasion } from "@/lib/occasions";
import { REVEAL_MECHANICS } from "@/components/reveals/types";

/**
 * Image de partage d'une landing d'occasion.
 *
 * Pas de `runtime = "edge"` ici, contrairement aux deux images OG plus
 * anciennes du projet : le runtime Node est le défaut documenté en 16, il
 * suffit pour next/og, et « edge » n'est pas supporté avec Cache
 * Components — autant ne pas semer de dette sur une route neuve.
 *
 * Les métadonnées d'image (alt, size, contentType) sont des exports de
 * module : elles ne peuvent donc pas varier selon l'occasion. L'alternative
 * (generateImageMetadata) déplacerait l'URL de l'image, pour un gain
 * d'accessibilité nul — ces images ne sont jamais lues par un lecteur
 * d'écran, seulement affichées par WhatsApp ou X.
 */
export const alt =
  "Qui S'y Gratte — ta photo devient une carte à gratter, un polaroid ou une enveloppe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Une image par occasion, générée au build. */
export function generateStaticParams() {
  return OCCASIONS.map((o) => ({ slug: o.slug }));
}

export default async function OgImage({
  params,
}: {
  // ⚠️ Promise depuis Next 16 — en 15 c'était encore un objet synchrone.
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const o = getOccasion(slug);

  const titre = o?.ogTitre ?? "Les annonces qui font dire waouh";
  const accent = o?.demo.accent ?? "#ef9bb4";
  const emoji = o?.emoji ?? "🎟️";
  const meca = o ? REVEAL_MECHANICS[o.demo.mechanic] : REVEAL_MECHANICS.scratch;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "#fbf6ee",
          color: "#2d2438",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Pastille d'occasion, teintée de l'accent de la page */}
        <div
          style={{
            position: "absolute",
            top: 64,
            right: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 108,
            height: 108,
            borderRadius: 999,
            background: accent,
            fontSize: 56,
          }}
        >
          {emoji}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#c9a52d",
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          {/* Pas de losange « ◆ » comme sur le site : le moteur d'images
              n'a pas ce glyphe dans sa police par défaut et part le
              télécharger à chaque build (13 requêtes, 13 échecs 400, un
              carré vide à l'arrivée). */}
          QUI S&apos;Y GRATTE
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 940,
          }}
        >
          {titre}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              background: "#2d2438",
              color: "#fbf6ee",
              fontSize: 26,
              fontWeight: 700,
              padding: "12px 26px",
              borderRadius: 999,
            }}
          >
            {meca.label}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#6b5f75" }}>
            {meca.hint}
          </div>
        </div>

        {/* Bande festive en bas — identité partagée avec les autres OG */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 12,
            display: "flex",
            background:
              "repeating-linear-gradient(90deg, #ef9bb4 0 24px, transparent 24px 48px, #e8c547 48px 72px, transparent 72px 96px, #b5dcc1 96px 120px, transparent 120px 144px)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
