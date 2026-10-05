/**
 * Analytics centralisé — un seul endroit pour nommer et envoyer les events.
 *
 * On s'appuie sur Vercel Web Analytics. Les PAGES VUES sont gérées toutes
 * seules par le composant <Analytics /> monté dans le layout racine
 * (src/components/analytics/VercelAnalytics.tsx) : ce fichier ne s'occupe
 * que des events custom du funnel.
 *
 * Quatre contraintes expliquent la forme du code ci-dessous :
 *
 *   1. le `track()` de Vercel JETTE une vraie exception si on l'appelle hors
 *      navigateur (en dev) → garde `typeof window === "undefined"` ;
 *   2. un event custom n'accepte que 2 PROPRIÉTÉS sur le plan Pro → chaque
 *      event du catalogue en déclare 2 au maximum, et `sanitize()` borne ;
 *   3. une propriété invalide est supprimée en silence en prod mais fait
 *      abandonner l'event entier en dev → on normalise avant d'envoyer ;
 *   4. AUCUNE donnée perso ne sort d'ici. Pas d'email, pas de code de carte,
 *      pas de titre ni de texte d'annonce, pas de nom de fichier. Uniquement
 *      des catégories produit (occasion, format) et des montants.
 */

import { track as vercelTrack } from "@vercel/analytics";
import type { RevealMechanic } from "@/components/reveals/types";
import type { AnnonceTemplate } from "@/components/AnnonceCard";
import type { OccasionSlug } from "@/lib/occasions";

/** Les seules valeurs qu'une propriété d'event peut porter. */
type PropValue = string | number | boolean | null;

/** Event sans propriété : `keyof` vaut `never`, donc TS interdit le 2e argument. */
type NoProps = Record<never, never>;

/** D'où vient le visiteur qui arrive sur /creer (paramètre `?src=` de l'URL). */
export type CreationSource = "carte" | "merci" | "idee" | "direct";

/** Emplacement du CTA « Créer ma carte » cliqué sur une page marketing. */
export type CtaPosition = "header" | "hero" | "bas_de_page";

/**
 * Catalogue des events du funnel. Une clé = un nom d'event tel qu'il
 * apparaîtra dans le dashboard Vercel. Les six marches principales sont
 * repérées par « marche N » dans les commentaires.
 */
type EventMap = {
  /** Marche 1 — clic sur un CTA « Créer ma carte » d'une page marketing. */
  cta_creer_clic: { position: CtaPosition };

  /** Marche 2 — arrivée sur /creer, avec la provenance si on la connaît. */
  creer_vue: { source: CreationSource };

  /** Une photo vient d'être acceptée : premier vrai engagement du formulaire. */
  creer_photo_ajoutee: { occasion: AnnonceTemplate };

  /** Un format vient d'être coché ou décoché — mesure l'upsell 5 / 8 / 10 €. */
  creer_format_choisi: { format: RevealMechanic; total: number };

  /** Marche 3 — le formulaire part : après, on est chez Stripe. */
  creer_soumis: { formats: number; cents: number };

  /** Soumission avec un code cadeau. Jamais la valeur du code, juste le fait. */
  code_cadeau_utilise: NoProps;

  /** Marche 4 — page de rattrapage /creer/[code]/preview (retour d'abandon). */
  apercu_vue: { cents: number; annule: boolean };

  /** Marche 5 — clic sur « Payer X € » depuis la page de rattrapage. */
  apercu_paiement_clic: { cents: number };

  /** Marche 6 — la page de remerciement s'affiche : la carte est payée. */
  merci_vue: { formats: number };

  /** Le lien privé a été copié par l'acheteur. L'URL, elle, ne sort jamais. */
  lien_copie: { formats: number };

  /** Un destinataire ouvre /g/<code>. `demo` isole les cartes de démo. */
  carte_ouverte: { format: RevealMechanic; demo: boolean };

  /** Boucle virale — il est allé au bout : gratté, développé ou ouvert. */
  carte_revelee: { format: RevealMechanic; demo: boolean };

  /** Boucle virale — clic sur « Créer ma carte » depuis une carte reçue. */
  carte_cta_creer_clic: { format: RevealMechanic; demo: boolean };

  /**
   * Marche 1 bis — clic sur un CTA d'une landing /idees/<slug>.
   * Un event à part de `cta_creer_clic` : les deux marches mènent au même
   * endroit, mais celle-ci part d'une intention de recherche précise. Les
   * confondre rendrait impossible de savoir quelle occasion rapporte.
   * L'occasion est portée par l'event parce que la destination (/creer) ne
   * la connaît plus.
   */
  idee_cta_creer_clic: { occasion: OccasionSlug; position: CtaPosition };

  /**
   * La démo embarquée d'une landing est allée au bout (grattée, développée
   * ou ouverte). Mesure l'engagement réel de la page, là où le temps passé
   * ne dit rien. Pas de page vue dédiée : Vercel la compte déjà, et le slug
   * d'occasion est dans le chemin.
   */
  idee_demo_jouee: { occasion: OccasionSlug; format: RevealMechanic };
};

export type AnalyticsEvent = keyof EventMap;

/** Plan Pro : 2 propriétés par event, pas une de plus. */
const MAX_PROPS = 2;

/** Vercel refuse un nom, une clé ou une valeur au-delà de 255 caractères. */
const MAX_LEN = 255;

/**
 * Les events custom sont réservés aux plans Pro/Enterprise : sur Hobby ils
 * partent dans le vide, autant les couper à la source. Passe la variable à
 * "1" sur Vercel le jour du passage en Pro, puis REDÉPLOIE — les
 * NEXT_PUBLIC_* sont inlinées au moment du build.
 *
 * En `next dev` on les laisse passer quoi qu'il arrive : le package charge
 * alors script.debug.js, qui se contente de logger dans la console du
 * navigateur sans rien envoyer. C'est le seul moyen de vérifier le câblage
 * en local.
 */
const EVENTS_ENABLED =
  process.env.NEXT_PUBLIC_VA_EVENTS === "1" ||
  process.env.NODE_ENV === "development";

/** Un event sans propriété ne prend pas de 2e argument, et inversement. */
type TrackArgs<N extends AnalyticsEvent> = keyof EventMap[N] extends never
  ? []
  : [props: EventMap[N]];

/**
 * Envoie un event custom. Ne jette JAMAIS : si l'analytics casse, c'est
 * l'analytics qui perd, pas le parcours de l'acheteur.
 */
export function track<N extends AnalyticsEvent>(
  name: N,
  ...args: TrackArgs<N>
): void {
  // Rendu serveur d'un composant client, ou appel depuis une Server Action :
  // on ne fait rien (le track() de Vercel jetterait).
  if (typeof window === "undefined") return;
  if (!EVENTS_ENABLED) return;

  amorcerFile();

  const brut = args[0] as Record<string, PropValue | undefined> | undefined;

  try {
    vercelTrack(name, brut ? sanitize(brut) : undefined);
  } catch {
    // Bloqueur de pub, quota atteint, propriété exotique : on avale.
  }
}

/**
 * Amorce la file d'events de Vercel si elle n'existe pas encore.
 *
 * Pourquoi c'est indispensable : le `track()` du package fait
 * `window.va?.call(...)`. L'optional chaining veut dire que si la file n'est
 * pas encore là, l'event est perdu SANS la moindre erreur. Or `window.va`
 * n'est créée que par l'`inject()` du composant <Analytics />, dans un effet
 * — et React vide les effets des enfants AVANT ceux du layout. Résultat,
 * tout event émis au montage d'une page (creer_vue, apercu_vue, merci_vue,
 * carte_ouverte : quatre des six marches du funnel) tombait dans le vide.
 *
 * La fonction posée ici est la copie exacte de l'`initQueue()` du package :
 * un stub qui empile les appels dans `window.vaq`, que le script distant
 * rejoue à son chargement. `inject()` commence par `if (window.va) return;`,
 * il réutilisera donc la nôtre telle quelle — aucun doublon, aucun conflit.
 */
function amorcerFile(): void {
  if (typeof window.va === "function") return;
  window.va = (...params: Parameters<NonNullable<Window["va"]>>) => {
    window.vaq = window.vaq ?? [];
    window.vaq.push(params);
  };
}

/**
 * Jette les `undefined`, tronque à 255 caractères, borne à 2 propriétés.
 * Filet de sécurité : le catalogue ci-dessus respecte déjà ces limites.
 */
function sanitize(
  props: Record<string, PropValue | undefined>
): Record<string, PropValue> {
  const out: Record<string, PropValue> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;
    if (Object.keys(out).length >= MAX_PROPS) break;
    out[key.slice(0, MAX_LEN)] =
      typeof value === "string" ? value.slice(0, MAX_LEN) : value;
  }
  return out;
}

/** Les valeurs de `?src=` qu'on accepte — tout le reste devient "direct". */
const SOURCES: readonly string[] = ["carte", "merci", "idee"];

/**
 * Lit le `?src=` de l'URL courante.
 *
 * On passe par window.location plutôt que par useSearchParams() : /creer est
 * une page statique, et lire la query avec le hook la ferait basculer en
 * rendu client (et réclamerait un <Suspense>). Ici la lecture se fait dans
 * un effet, après hydratation — aucun impact sur le rendu de la page.
 */
export function sourceDepuisUrl(): CreationSource {
  if (typeof window === "undefined") return "direct";
  try {
    const src = new URLSearchParams(window.location.search).get("src") ?? "";
    return SOURCES.includes(src) ? (src as CreationSource) : "direct";
  } catch {
    return "direct";
  }
}
