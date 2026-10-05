/**
 * Briques de métadonnées partagées entre les pages.
 *
 * Pourquoi un module à part : le merge des métadonnées Next est
 * SUPERFICIEL. Dès qu'une page déclare `openGraph`, celui du layout racine
 * est écrasé en entier — adieu `type`, `locale`, `siteName`. Il faut donc
 * ré-étaler les champs constants dans chaque page, et les tenir ici plutôt
 * que de les recopier quatorze fois.
 */
import { SITE_NAME } from "@/lib/site";

export const OG_BASE = {
  type: "website",
  locale: "fr_FR",
  siteName: SITE_NAME,
} as const;
