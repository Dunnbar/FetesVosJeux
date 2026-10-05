/**
 * Identité du site — source unique de l'URL publique.
 *
 * Avant ce fichier, l'URL était écrite à trois endroits et PAS de la même
 * façon : le layout racine retombait sur « www.quisygratte.fr », sitemap.ts
 * et robots.ts sur « quisygratte.fr » sans www. Résultat, si
 * NEXT_PUBLIC_SITE_URL n'est pas définie, le canonical et le sitemap
 * désignent deux hôtes différents — Google y voit deux sites et dilue le
 * jus de chaque page. Tout le monde passe désormais par SITE_URL.
 */
const brut = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.quisygratte.fr";

/**
 * L'apex quisygratte.fr répond 308 vers www.quisygratte.fr : c'est www qui
 * sert réellement les pages. Un canonical, une entrée de sitemap ou un
 * og:url qui désignent l'apex pointent donc sur une URL de redirection —
 * Google classe la page en « Page avec redirection » et l'indexation passe
 * par un saut de plus. On normalise ici une bonne fois : peu importe ce que
 * vaut la variable d'environnement, tout le site parle de www.
 *
 * Le `localhost` et les URL de preview Vercel passent au travers sans être
 * touchés — seul l'apex de prod est réécrit.
 */
export const SITE_URL = brut
  .replace(/^https:\/\/quisygratte\.fr/, "https://www.quisygratte.fr")
  .replace(/\/+$/, "");

export const SITE_NAME = "Qui S'y Gratte";
