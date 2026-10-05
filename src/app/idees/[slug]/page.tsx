import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CtaOccasionLink } from "@/components/analytics/CtaOccasionLink";
import { OccasionDemo } from "@/components/idees/OccasionDemo";
import { REVEAL_MECHANICS } from "@/components/reveals/types";
import { OCCASIONS, getOccasion, type LienConnexe } from "@/lib/occasions";
import { BASE_AMOUNT_CENTS, FIREWORKS, formatBaseCents } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { jsonLdHtml } from "@/lib/jsonld";
import { OG_BASE } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Landing d'occasion — /idees/<slug>.
 *
 * Entièrement statique : zéro I/O, les données viennent d'un module TS.
 * Les 13 pages sont donc prérendues au build et servies depuis le CDN.
 *
 * Le typage de `params` est écrit à la main plutôt que via le helper global
 * `PageProps<"/idees/[slug]">` : celui-ci n'existe qu'une fois les types de
 * routes générés, donc pas au premier build d'une route neuve.
 */
interface PageParams {
  params: Promise<{ slug: string }>;
}

/** Tout slug hors de la liste renvoie 404 — jamais de rendu à la demande. */
export const dynamicParams = false;

export function generateStaticParams() {
  return OCCASIONS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const o = getOccasion(slug);
  if (!o) return {};

  const chemin = `/idees/${o.slug}`;

  return {
    title: o.titleTag,
    description: o.metaDescription,
    // PAS de `keywords` : Next le sérialise en <meta name="keywords">, que
    // Google ignore depuis 2009 — ça ne servait qu'à publier en clair les
    // 78 requêtes visées du site. `o.motsCles` reste une note d'intention.
    // Obligatoire : sans ça la page hériterait du canonical du layout racine.
    alternates: { canonical: chemin },
    openGraph: {
      // Le merge des métadonnées est superficiel : déclarer `openGraph` ici
      // écrase intégralement celui du layout. D'où le ré-étalement d'OG_BASE.
      ...OG_BASE,
      url: chemin,
      title: o.titleTag,
      description: o.metaDescription,
      // Pas d'`images` : opengraph-image.tsx est prioritaire sur ce champ.
    },
    twitter: {
      card: "summary_large_image",
      title: o.titleTag,
      description: o.metaDescription,
    },
  };
}

export default async function OccasionPage({ params }: PageParams) {
  const { slug } = await params;
  const o = getOccasion(slug);
  if (!o) notFound();

  const urlPage = `${SITE_URL}/idees/${o.slug}`;
  const meca = REVEAL_MECHANICS[o.demo.mechanic];

  // Les prix ne sont JAMAIS écrits en dur : tout vient de lib/pricing.
  const grilleTarifs = [1, 2, 3]
    .map((n) => `${n} format${n > 1 ? "s" : ""} ${formatPrice(formatBaseCents(n))}`)
    .join(" · ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${urlPage}#product`,
        name: o.produitNom,
        description: o.metaDescription,
        // Un fichier réel de public/uploads plutôt que l'URL de la route
        // opengraph-image, que Next suffixe d'un hash de cache.
        image: `${SITE_URL}${o.demo.image}`,
        brand: { "@type": "Brand", name: SITE_NAME },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/creer`,
          priceCurrency: "EUR",
          price: (BASE_AMOUNT_CENTS / 100).toFixed(2),
          availability: "https://schema.org/InStock",
        },
      },
      {
        // Les questions ci-dessous sont rendues À L'IDENTIQUE dans la page
        // (section FAQ). Google refuse le rich result — et sanctionne — si
        // le balisage décrit un contenu que le visiteur ne voit pas.
        "@type": "FAQPage",
        "@id": `${urlPage}#faq`,
        mainEntity: o.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.r },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${urlPage}#fil`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Idées", item: `${SITE_URL}/idees` },
          { "@type": "ListItem", position: 3, name: o.nom, item: urlPage },
        ],
      },
    ],
  };

  return (
    <>
      <SiteHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(jsonLd)}
      />

      <main className="flex-1">
        {/* ========== Chapeau — texte à gauche, carte jouable à droite ========== */}
        <section className="mx-auto max-w-6xl px-6 pt-8 sm:pt-12 pb-16">
          <nav
            aria-label="Fil d'Ariane"
            className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-ink-dim)]"
          >
            <Link
              href="/"
              className="hover:text-[var(--color-rose-deep)] transition-colors"
            >
              Accueil
            </Link>
            <span aria-hidden className="mx-2">
              ·
            </span>
            <Link
              href="/idees"
              className="hover:text-[var(--color-rose-deep)] transition-colors"
            >
              Idées
            </Link>
            <span aria-hidden className="mx-2">
              ·
            </span>
            <span className="text-[var(--color-ink)]">{o.nom}</span>
          </nav>

          {/*
            `contents` sous lg : les trois blocs de texte s'effacent et
            deviennent des cellules de la grille, ce qui laisse la démo se
            glisser JUSTE SOUS le titre. Ordre de lecture mobile : titre → la
            carte jouable → CTA + prix → le texte éditorial. Avant, la grille
            empilait tout le bloc texte d'abord : la démo — l'argument unique
            de la page, la seule chose qu'on promet de « laisser essayer » —
            n'arrivait qu'après une page et demie de scroll. À partir de lg le
            wrapper redevient un bloc : la colonne de gauche retrouve son
            ordre naturel et la démo repasse à droite, desktop inchangé.
          */}
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-16 items-start">
            <div className="contents lg:block">
              <div className="order-1 lg:order-none">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-text)] mb-3">
                  ◆ {o.emoji} {o.nom}
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[0.95]">
                  {o.h1}
                </h1>
              </div>

              <p className="order-4 lg:order-none lg:mt-8 max-w-xl text-lg text-[var(--color-ink-dim)] leading-relaxed">
                {o.intro}
              </p>

              <div className="order-3 lg:order-none lg:mt-10">
                <div className="flex items-center gap-3 flex-wrap">
                  <CtaOccasionLink
                    occasion={o.slug}
                    position="hero"
                    template={o.demo.template}
                    mechanic={o.demo.mechanic}
                  >
                    Créer ma carte ▸
                  </CtaOccasionLink>
                  <Link href="/idees" className="btn-outline">
                    Toutes les occasions
                  </Link>
                </div>

                <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--color-ink-dim)]">
                  <span className="card-pack-tag">
                    À partir de {formatPrice(BASE_AMOUNT_CENTS)}
                  </span>
                  <span>
                    {grilleTarifs} — {FIREWORKS.emoji} {FIREWORKS.label.toLowerCase()}{" "}
                    +{formatPrice(FIREWORKS.cents)}.
                  </span>
                </p>
              </div>
            </div>

            {/* La vraie mécanique, jouable, avec un contenu d'exemple. */}
            <div className="order-2 lg:order-none lg:pt-4">
              <OccasionDemo
                occasion={o.slug}
                mechanic={o.demo.mechanic}
                coverImageSrc={o.demo.image}
                template={o.demo.template}
                title={o.demo.title}
                subtitle={o.demo.subtitle}
                body={o.demo.body}
                alt={o.demo.alt}
              />
            </div>
          </div>
        </section>

        {/* ========== Le contenu utile — trois angles propres à l'occasion ========== */}
        <section className="mx-auto max-w-3xl px-6 pb-4">
          {o.sections.map((s) => (
            <article key={s.titre} className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                {s.titre}
              </h2>
              <p className="text-[var(--color-ink-dim)] leading-relaxed">
                {s.corps}
              </p>
            </article>
          ))}

          {/*
            La photo de démo en VRAIE <img>, et c'est volontaire à deux titres.

            1. Indexation. sitemap.ts déclare cette image pour les 13 pages,
               mais Google ignore une image d'un sitemap qu'il ne retrouve pas
               dans le HTML. Or la mécanique `scratch` (6 pages sur 13) peint
               la photo dans un <canvas>, qui n'est pas une image pour un
               moteur. Ces entrées de sitemap étaient mortes. Sur des requêtes
               aussi visuelles que « annonce grossesse originale », c'est tout
               l'onglet Images qu'on laissait passer.
            2. Performance. Même URL que la cover de la démo : le preload
               scanner la trouve dans le HTML et la télécharge dès la première
               passe, au lieu d'attendre le `new Image()` du useEffect de
               ScratchCanvas après hydratation. Sur un mobile en 4G lente,
               la carte du haut restait un carré vide plusieurs secondes.

            Placée APRÈS les trois sections : elle ne dévoile rien à qui
            commence par jouer la démo, puisque c'est la même photo.
          */}
          <figure className="mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={o.demo.image}
              alt={o.demo.alt}
              width={1000}
              height={1000}
              fetchPriority="high"
              className="w-full rounded-2xl border-2 border-[var(--color-edge)] shadow-sm"
            />
            <figcaption className="mt-3 text-sm text-[var(--color-ink-dim)] leading-relaxed">
              {o.demo.alt} — c&apos;est la photo de la carte à essayer en haut
              de page.
            </figcaption>
          </figure>
        </section>

        {/* ========== Maillage interne — des phrases, pas un bloc « voir aussi » ========== */}
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <div className="card-pack">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-text)] mb-4">
              ▸ {o.liens.titre}
            </p>
            {o.liens.items.map((item) => (
              <PhraseAvecLien key={item.vers} item={item} />
            ))}
          </div>
        </section>

        {/* ========== FAQ — même contenu que le JSON-LD, à la virgule près ========== */}
        <section
          id="faq"
          className="mx-auto max-w-3xl px-6 pb-16 scroll-mt-24"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
            Les questions qu&apos;on nous pose
          </h2>
          <div className="divide-y-2 divide-[var(--color-edge)] border-y-2 border-[var(--color-edge)]">
            {o.faq.map((item) => (
              // Le padding vertical est porté par le <summary> et non par le
              // <details> : c'est le <summary> qui déclenche l'ouverture, donc
              // c'est lui qui doit faire 44 px de haut. Posé sur le <details>,
              // il agrandissait une zone inerte et une question tenant sur une
              // seule ligne n'offrait que 24 px à viser au doigt.
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer items-start justify-between gap-4 font-bold list-none py-5">
                  <span>{item.q}</span>
                  <span
                    aria-hidden
                    className="shrink-0 text-[var(--color-rose-deep)] transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[var(--color-ink-dim)] leading-relaxed">
                  {item.r}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ========== Dernier appel ========== */}
        <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ta photo,
            <br />
            <span className="text-[var(--color-rose-deep)]">leur surprise</span>.
          </h2>
          <p className="mt-5 text-[var(--color-ink-dim)] leading-relaxed">
            Tu uploades une photo, tu écris ton annonce, tu reçois un lien.
            Eux {meca.previewVerb.toLowerCase()}nt, et découvrent.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaOccasionLink
              occasion={o.slug}
              position="bas_de_page"
              template={o.demo.template}
              mechanic={o.demo.mechanic}
            >
              Créer ma carte ▸
            </CtaOccasionLink>
          </div>
          <p className="mt-6 text-sm">
            <Link
              href={`/g/${o.demo.code}`}
              className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-dim)] hover:text-[var(--color-rose-deep)] underline underline-offset-4 decoration-[var(--color-gold)]"
            >
              Voir la carte comme la recevront tes proches ▸
            </Link>
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

/**
 * Rend une phrase de maillage en y insérant le lien à la place du jeton
 * `{lien}`. Chaque phrase est écrite à la main dans lib/occasions : c'est
 * ce qui évite que les 13 pages finissent avec le même bloc « voir aussi ».
 */
function PhraseAvecLien({ item }: { item: LienConnexe }) {
  const [avant, apres] = item.phrase.split("{lien}");
  return (
    <p className="text-[var(--color-ink-dim)] leading-relaxed mb-3 last:mb-0">
      {avant}
      <Link
        href={`/idees/${item.vers}`}
        className="font-bold text-[var(--color-rose-text)] underline underline-offset-4 decoration-[var(--color-gold)] hover:decoration-[var(--color-rose)]"
      >
        {item.ancre}
      </Link>
      {apres}
    </p>
  );
}
