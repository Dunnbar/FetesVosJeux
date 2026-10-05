"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Montage de Vercel Web Analytics + Speed Insights.
 *
 * Pourquoi un composant client dédié plutôt que <Analytics /> posé
 * directement dans src/app/layout.tsx ? Parce qu'on passe `beforeSend`, et
 * qu'une fonction n'est pas sérialisable : un Server Component ne peut pas
 * la passer en prop à un Client Component (doc Next 16,
 * 03-api-reference/01-directives/use-client.md : « the props of the Client
 * Components must be serializable »). Et marquer le layout racine
 * "use client" serait pire : on perdrait `export const metadata`.
 *
 * Pas de <Suspense> à ajouter : @vercel/analytics/next s'enveloppe lui-même
 * (il lit useSearchParams en interne).
 *
 * `beforeSend` n'est pas un luxe ici : tout le produit repose sur des liens
 * privés. Sans lui, chaque page vue enverrait à Vercel l'URL brute
 * /g/<CODE> — le lien que l'acheteur a payé pour garder privé — et le
 * session_id Stripe de /creer/merci/<CODE>.
 */

/** Paramètres d'acquisition qu'on garde ; tout le reste est jeté. */
const QUERY_AUTORISES = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
  "src",
];

/**
 * Remplace les codes privés par la forme de la route et vide la query de
 * tout ce qui n'est pas de l'acquisition. Renvoie null quand l'event ne
 * doit pas partir du tout.
 */
function anonymiserUrl(brut: string): string | null {
  let url: URL;
  try {
    url = new URL(brut);
  } catch {
    // URL inattendue : on préfère ne rien envoyer plutôt que fuiter un code.
    return null;
  }

  // L'admin ne nous apprend rien et consomme du quota.
  if (url.pathname.startsWith("/admin")) return null;

  // On garde la FORME de la route, jamais le code privé de la carte.
  //   /g/ABC123             -> /g/[code]
  //   /creer/merci/ABC123   -> /creer/merci/[code]
  //   /creer/ABC123/preview -> /creer/[code]/preview
  url.pathname = url.pathname
    .replace(/^\/g\/[^/]+/, "/g/[code]")
    .replace(/^\/creer\/merci\/[^/]+/, "/creer/merci/[code]")
    .replace(/^\/creer\/[^/]+\/preview/, "/creer/[code]/preview");

  // Le session_id Stripe arrive sur /creer/merci/<CODE>?session_id=cs_...
  // Il ne sort pas d'ici.
  for (const key of [...url.searchParams.keys()]) {
    if (!QUERY_AUTORISES.includes(key)) url.searchParams.delete(key);
  }

  return url.toString();
}

function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = anonymiserUrl(event.url);
  return url === null ? null : { ...event, url };
}

/**
 * Speed Insights n'exporte pas son type d'event : on le récupère depuis la
 * signature de sa prop `beforeSend` plutôt que de le réécrire à la main.
 */
type SpeedInsightsEvent = Parameters<
  NonNullable<React.ComponentProps<typeof SpeedInsights>["beforeSend"]>
>[0];

function beforeSendVitals(
  event: SpeedInsightsEvent
): SpeedInsightsEvent | null {
  const url = anonymiserUrl(event.url);
  return url === null ? null : { ...event, url };
}

export function VercelAnalytics() {
  return (
    <>
      <Analytics beforeSend={beforeSend} />
      <SpeedInsights beforeSend={beforeSendVitals} />
    </>
  );
}
