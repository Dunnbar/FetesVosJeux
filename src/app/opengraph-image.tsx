import { ImageResponse } from "next/og";

// Image Open Graph pour la home : ce que voient les gens quand on partage
// https://quisygratte.fr sur WhatsApp / iMessage / Twitter / etc.
export const runtime = "edge";
export const alt = "Qui S'y Gratte — Le faire-part à gratter";
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
        {/* Confettis décoratifs en fond */}
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 100,
            display: "flex",
            gap: 8,
            fontSize: 36,
          }}
        >
          ✨ 🎉 💌
        </div>

        {/* Pretag mono */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#d77a99",
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          ◆ QUI S&apos;Y GRATTE
        </div>

        {/* Titre principal */}
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
          <span>Offrez une photo</span>
          <span style={{ color: "#d77a99" }}>à gratter.</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#6b5f75",
            marginTop: 32,
            maxWidth: 900,
          }}
        >
          Tu uploades une photo, ils grattent pour découvrir ton annonce.
        </div>

        {/* Bande festive en bas */}
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
