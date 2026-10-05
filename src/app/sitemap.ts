import type { MetadataRoute } from "next";
import { OCCASIONS } from "@/lib/occasions";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap — pages publiques de marketing, le hub d'idées et ses 13 landings.
 *
 * Les routes privées (/g/[code], /creer/merci/[code]) restent volontairement
 * exclues du sitemap ET du robots.txt : ce sont des liens personnels,
 * partagés de la main à la main.
 *
 * Ce fichier est statique (aucune API de requête, aucune config dynamique),
 * donc `new Date()` est figé à l'heure du build. C'est voulu : chaque
 * déploiement rafraîchit les dates, et le contenu ne change pas entre deux.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/creer`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/idees`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...OCCASIONS.map((o) => ({
      url: `${SITE_URL}/idees/${o.slug}`,
      lastModified,
      // `as const` obligatoire : dans un .map() TypeScript élargirait la
      // valeur en `string`, que MetadataRoute.Sitemap refuse.
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: [`${SITE_URL}${o.demo.image}`],
    })),
  ];
}
