import type { MetadataRoute } from "next";

/**
 * robots.txt généré dynamiquement.
 *
 * On autorise tout l'indexage des pages marketing/produit, et on bloque
 * les pages personnelles (/g/[code] et /creer/merci/[code]) — ces URLs
 * sont des liens privés partagés directement aux destinataires, on ne
 * veut pas qu'elles apparaissent dans Google.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://quisygratte.fr";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/g/", "/creer/merci/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
