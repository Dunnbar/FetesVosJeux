import type { MetadataRoute } from "next";

/**
 * Sitemap minimal — uniquement les pages publiques de marketing.
 * Les routes privées (/g/[code], /creer/merci/[code]) sont volontairement
 * exclues du sitemap ET du robots.txt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://quisygratte.fr";
  const lastModified = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/creer`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
