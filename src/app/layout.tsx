import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { VercelAnalytics } from "@/components/analytics/VercelAnalytics";
import { SITE_URL } from "@/lib/site";
import { OG_BASE } from "@/lib/seo";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const title = "Qui S'y Gratte — Les annonces qui font dire waouh";
const description =
  "Ta photo devient une carte à gratter : tes proches grattent l'écran et découvrent ton annonce. Mariage, naissance, anniversaire — l'effet waouh.";

export const metadata: Metadata = {
  // Base absolue pour résoudre les images OG/Twitter (sinon → localhost).
  metadataBase: new URL(SITE_URL),
  title,
  description,
  // PAS de `alternates.canonical` ici : les métadonnées sont héritées clé
  // par clé, donc un canonical posé sur le layout s'applique à TOUTES les
  // pages enfants qui n'en déclarent pas — /creer, /cgv et les autres se
  // canonicalisaient vers la home. Chaque page pose désormais le sien.
  openGraph: {
    ...OG_BASE,
    url: "/",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
          Mesure d'audience — ne rend rien, mais posée AVANT {children} :
          React vide les effets des frères dans l'ordre de la source, donc
          tant qu'elle était en dernier, les effets des pages (CreerPageView,
          MerciPageView, PreviewExperience, ScratchExperience) tournaient
          avant son inject(). window.va n'existait pas encore et les events
          de montage partaient dans le vide. src/lib/analytics.ts amorce en
          plus la file lui-même : les deux ensemble rendent l'ordre indifférent.
        */}
        <VercelAnalytics />
        {children}
      </body>
    </html>
  );
}
