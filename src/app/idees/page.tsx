import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CtaCreerLink } from "@/components/analytics/CtaCreerLink";
import { HeroAutoScratch } from "@/components/HeroAutoScratch";
import { REVEAL_MECHANICS } from "@/components/reveals/types";
import {
  FAMILLES,
  FAMILLE_KEYS,
  OCCASIONS,
  occasionsParFamille,
} from "@/lib/occasions";
import { BASE_AMOUNT_CENTS } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { jsonLdHtml } from "@/lib/jsonld";
import { OG_BASE } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

/**
 * Hub des idées — le parent des 13 landings.
 *
 * Son rôle est autant éditorial que structurel : il donne à Google un seul
 * point d'entrée vers les 13 pages, et aux visiteurs un endroit où trouver
 * la leur. Les trois familles créent des grappes thématiques sans ajouter
 * de niveau d'URL.
 */
const titre = "Idées d'annonces et d'invitations originales";
const description =
  "Grossesse, mariage, naissance, crémaillère, retraite : 13 façons d'annoncer la nouvelle avec une photo à gratter, à développer ou à ouvrir.";

export const metadata: Metadata = {
  title: titre,
  description,
  // Explicite : sinon la page hérite du canonical du layout racine.
  alternates: { canonical: "/idees" },
  openGraph: {
    ...OG_BASE,
    url: "/idees",
    title: titre,
    description,
  },
  twitter: { card: "summary_large_image", title: titre, description },
};

export default function IdeesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/idees#page`,
        name: titre,
        description,
        url: `${SITE_URL}/idees`,
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/idees#liste`,
        numberOfItems: OCCASIONS.length,
        itemListElement: OCCASIONS.map((o, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: o.nom,
          url: `${SITE_URL}/idees/${o.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/idees#fil`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Idées", item: `${SITE_URL}/idees` },
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
        {/* ========== Chapeau ========== */}
        <section className="mx-auto max-w-6xl px-6 pt-10 sm:pt-16 pb-12">
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
            <span className="text-[var(--color-ink)]">Idées</span>
          </nav>

          {/*
            Le chapeau porte désormais une carte et un CTA.
            Avant, la page faisait 5 000 px de haut sur mobile pour UN seul
            lien vers /creer, tout en bas — et pas une seule image sur les
            treize cartes de texte, alors que la ligne ci-dessous promet
            « une vraie carte, jouable tout de suite ». Un visiteur arrivé de
            la home n'avait aucun moyen d'acheter sans traverser la page
            entière, et rien à regarder pour comprendre le produit.
          */}
          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95]">
                Une occasion,
                <br />
                <span className="text-[var(--color-rose-deep)]">une idée</span>.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-[var(--color-ink-dim)] leading-relaxed">
                Treize pages, treize situations. Chacune répond d&apos;abord à
                la question que tu te poses — quand annoncer, à qui
                d&apos;abord, quoi écrire — et te laisse essayer la carte avant
                de la créer.
              </p>
              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <CtaCreerLink position="hero">Créer ma carte ▸</CtaCreerLink>
              </div>
              <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--color-ink-dim)]">
                <span className="card-pack-tag">
                  À partir de {formatPrice(BASE_AMOUNT_CENTS)}
                </span>
                <span>
                  Chaque page contient une vraie carte, jouable tout de suite.
                </span>
              </p>
            </div>

            {/* Animée toute seule, sans JS : montre le produit sans voler le
                clic qui doit aller aux treize pages. Visible sur mobile aussi
                — c'est la seule image de la page, et elle y est le sommet du
                premier écran suivant. */}
            <div>
              <HeroAutoScratch />
            </div>
          </div>
        </section>

        {/* ========== Les trois familles ========== */}
        {FAMILLE_KEYS.map((cle) => {
          const famille = FAMILLES[cle];
          const liste = occasionsParFamille(cle);
          return (
            <section
              key={cle}
              id={cle}
              className="mx-auto max-w-6xl px-6 pb-14 scroll-mt-24"
            >
              <div className="mb-8">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-text)] mb-2">
                  ◆ {famille.emoji} {famille.label}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {famille.accroche}
                </h2>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {liste.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/idees/${o.slug}`}
                      className="card-pack group h-full flex flex-col"
                    >
                      <div className="text-4xl mb-4" aria-hidden>
                        {o.emoji}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{o.nom}</h3>
                      <p className="text-sm text-[var(--color-ink-dim)] leading-relaxed mb-5 flex-1">
                        {o.accroche}
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <span className="card-pack-tag">
                          {REVEAL_MECHANICS[o.demo.mechanic].label}
                        </span>
                        <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-dim)] group-hover:text-[var(--color-rose-deep)] transition-colors">
                          Lire ▸
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {/* ========== Dernier appel ========== */}
        <section className="mx-auto max-w-3xl px-6 pt-6 pb-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Tu sais déjà
            <br />
            <span className="text-[var(--color-rose-deep)]">ce que tu veux dire</span>.
          </h2>
          <p className="mt-5 text-[var(--color-ink-dim)] leading-relaxed">
            Upload une photo, écris ton annonce, récupère ton lien. Le reste,
            c&apos;est leur réaction.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaCreerLink position="bas_de_page">Créer ma carte ▸</CtaCreerLink>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
