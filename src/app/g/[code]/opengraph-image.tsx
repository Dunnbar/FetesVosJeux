import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

// OG image dynamique pour /g/[code] — vue quand qqun partage le lien
// d'une carte sur WhatsApp / iMessage / Slack / etc.
//
// ⚠️ Crucial : on ne RÉVÈLE PAS l'annonce dans l'image — ce serait spoiler
// la surprise. On montre juste un teaser "Tu as reçu une carte à gratter"
// avec le titre (qui est neutre, ex: "Margaux & Antoine"), pas le subtitle
// ("se marient") ni le body ("le 14 septembre…").
//
// Le node runtime est utilisé (et non "edge") parce que la query Prisma
// passe par le Neon serverless adapter qui marche dans les deux mais
// node est plus simple pour le bundling.
export const alt = "Tu as reçu une carte à gratter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function OgImage({ params }: Props) {
  const { code } = await params;
  const scratch = await db.scratch.findUnique({
    where: { code },
    select: { annonceTitle: true, status: true },
  });

  // Si la carte n'existe pas ou n'est pas payée, on affiche un teaser
  // générique sans titre — évite de leak l'info.
  const showName = scratch?.status === "PAID" && scratch.annonceTitle;
  const title = showName ? scratch.annonceTitle : "Une surprise t'attend";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          background: "#2d2438",
          color: "#fbf6ee",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Confettis */}
        <div
          style={{
            position: "absolute",
            top: 60,
            display: "flex",
            gap: 32,
            fontSize: 56,
          }}
        >
          ✨ 🎉 ✨
        </div>

        {/* Pretag */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#e8c547",
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          ◆ Tu as reçu une carte
        </div>

        {/* "Carte" centrale — ne révèle pas plus que le nom (neutre) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "#c8bdd0",
              marginTop: 32,
            }}
          >
            Clique pour gratter et découvrir ✦
          </div>
        </div>

        {/* Brand discret */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#6b5f75",
            fontWeight: 700,
          }}
        >
          Qui S&apos;y Gratte
        </div>

        {/* Bande festive bas */}
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
