import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt généré dynamiquement.
 *
 * L'URL vient de SITE_URL : avant, ce fichier retombait sur
 * « quisygratte.fr » quand le layout utilisait « www.quisygratte.fr » —
 * le sitemap déclaré ici et les canonicals des pages ne désignaient donc
 * pas le même hôte.
 *
 * On autorise tout l'indexage des pages marketing/produit, et on bloque
 * les trois familles d'URL privées — /g/[code], /creer/merci/[code] et
 * /creer/[code]/preview. Ce sont des liens personnels partagés de la main
 * à la main, et l'aperçu montre en plus la photo et le texte d'une annonce
 * PAS ENCORE PAYÉE : elle n'a rien à faire dans Google Images.
 *
 * Le Disallow n'est que l'économie de crawl ; la vraie protection est le
 * `robots: { index: false }` posé dans le metadata de chaque page privée —
 * c'est le seul qui tienne quand l'URL est atteinte par un lien externe.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/g/", "/creer/merci/", "/creer/*/preview"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
