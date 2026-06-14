import { ImageResponse } from "next/og";

// OG image pour /creer — l'écran qu'on voit en partageant l'URL du formulaire.
export const runtime = "edge";
export const alt = "Crée ta carte à gratter — Qui S'y Gratte";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
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
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#c9a52d",
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          ◆ Crée ta carte en 2 min
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 110,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: -3,
          }}
        >
          <span>Ta photo,</span>
          <span style={{ color: "#d77a99" }}>leur surprise.</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#6b5f75",
            marginTop: 36,
            maxWidth: 980,
          }}
        >
          Choisis ticket à gratter, polaroid ou enveloppe — puis envoie le lien
          à qui tu veux.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            display: "flex",
            gap: 24,
            fontSize: 60,
          }}
        >
          🎟️ 📸 ✉️
        </div>

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
