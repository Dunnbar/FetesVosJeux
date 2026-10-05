import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroAutoScratch } from "@/components/HeroAutoScratch";
import { CtaCreerLink } from "@/components/analytics/CtaCreerLink";
import {
  REVEAL_MECHANICS,
  REVEAL_MECHANIC_KEYS,
} from "@/components/reveals/types";
import { OCCASIONS } from "@/lib/occasions";
import { BASE_AMOUNT_CENTS } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

/**
 * Le canonical de la home est posé ici et non plus sur le layout racine :
 * là-bas, il était hérité par toutes les pages enfants.
 */
export const metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* ========== Hero — titre, démo, accroche, CTA ========== */}
        <section className="mx-auto max-w-6xl px-6 pt-6 sm:pt-20 pb-16">
          {/*
            Le bloc de texte s'efface en `display: contents` sous lg : ses deux
            enfants deviennent alors des cellules de la grille, et la démo peut
            être renvoyée APRÈS le CTA. Ordre de lecture mobile : titre →
            accroche → CTA + prix → la démo. L'ordre précédent (démo entre le
            titre et l'accroche) poussait le bouton à ~135 px sous la ligne de
            flottaison d'un iPhone et le prix à ~265 px : à 5 €, un acheteur
            qui doit scroller pour savoir que ce n'est pas 30 € ne scrolle
            pas. La démo fait 4/5 de 220 px sous sm, donc son haut reste
            visible au premier écran — elle invite à continuer sans manger la
            place du CTA. À partir de lg, le wrapper redevient un bloc unique
            en colonne de gauche et la démo repasse à droite : le layout
            desktop d'origine, inchangé.
          */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_340px] lg:gap-16 items-center">
            <div className="contents lg:block">
              <h1 className="order-1 lg:order-none text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[0.95]">
                Offre une photo
                <br />
                <span className="text-[var(--color-rose-deep)]">à gratter</span>.
              </h1>

              <div className="order-2 lg:order-none lg:mt-8">
                <p className="max-w-xl text-lg sm:text-xl text-[var(--color-ink-dim)] leading-relaxed">
                  Tu uploades une photo, ils grattent pour découvrir ton
                  annonce.
                </p>
                <div className="mt-6 sm:mt-10 flex items-center gap-3 flex-wrap">
                  <CtaCreerLink position="hero">Créer ma carte ▸</CtaCreerLink>
                  <Link href="/g/DEMOSCRATCH" className="btn-outline">
                    Voir la démo
                  </Link>
                </div>
                {/* Le prix dès le premier écran : à 5 €, le cacher fait fuir
                    ceux qui imaginent 30 €. Montant tiré de lib/pricing. */}
                <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--color-ink-dim)]">
                  <span className="card-pack-tag">
                    À partir de {formatPrice(BASE_AMOUNT_CENTS)}
                  </span>
                  <span>
                    Paiement unique — pas d&apos;abonnement, pas de compte à
                    créer.
                  </span>
                </p>
              </div>
            </div>

            {/* Mini-démo animée — sous le CTA sur mobile, à droite sur lg+ */}
            <div className="order-3 lg:order-none">
              <HeroAutoScratch />
            </div>
          </div>
        </section>

        {/* ========== 3 mécaniques de cartes ========== */}
        <section className="mx-auto max-w-6xl px-6 pt-8 pb-16">
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-text)] mb-2">
              ◆ Trois façons de surprendre
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              À gratter, à développer, à ouvrir.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {REVEAL_MECHANIC_KEYS.map((key) => {
              const m = REVEAL_MECHANICS[key];
              return (
                <Link
                  key={key}
                  href={`/g/${m.demoCode}`}
                  className="card-pack group"
                >
                  <div className="text-5xl mb-4">{m.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{m.label}</h3>
                  <p className="text-sm text-[var(--color-ink-dim)] leading-relaxed mb-5">
                    {m.hint}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-dim)] group-hover:text-[var(--color-rose-deep)] transition-colors">
                    Voir la démo ▸
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ========== Les occasions — 13 liens vers les pages d'idées ========== */}
        <section className="mx-auto max-w-6xl px-6 pt-4 pb-16">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-text)] mb-2">
              ▸ Pour quelle occasion ?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Chaque annonce a ses règles.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--color-ink-dim)] leading-relaxed">
              On a écrit une page par situation : quand annoncer, à qui
              d&apos;abord, quoi écrire. Avec la carte à essayer en vrai.
            </p>
          </div>

          <ul className="flex flex-wrap gap-3">
            {OCCASIONS.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/idees/${o.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-edge)] bg-[var(--color-cream-2)] px-4 py-2.5 text-sm transition-[transform,border-color,box-shadow] duration-150 hover:-translate-y-0.5 hover:border-[var(--color-rose)] hover:shadow-[3px_3px_0_0_var(--color-mint)]"
                >
                  <span aria-hidden>{o.emoji}</span>
                  {o.nom}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8">
            <Link
              href="/idees"
              className="inline-block py-3 font-mono text-xs uppercase tracking-widest text-[var(--color-ink-dim)] hover:text-[var(--color-rose-deep)] underline underline-offset-4 decoration-[var(--color-gold)]"
            >
              Toutes les idées ▸
            </Link>
          </p>
        </section>

        {/* ========== Comment ça marche en 3 étapes ========== */}
        <section
          id="comment"
          className="mx-auto max-w-6xl px-6 pt-12 pb-20 scroll-mt-24"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12">
            Comment ça marche
          </h2>

          <ol className="grid sm:grid-cols-3 gap-8">
            {[
              {
                n: "01",
                emoji: "📸",
                title: "Tu crées",
                desc: "Upload une photo, choisis le modèle d'annonce, remplis les champs.",
              },
              {
                n: "02",
                emoji: "💳",
                // Le montant vient de lib/pricing — jamais écrit en dur.
                title: `Tu paies ${formatPrice(BASE_AMOUNT_CENTS)}`,
                desc: "Paiement sécurisé en un clic, dégressif dès deux formats. Tu reçois ton lien dans la foulée.",
              },
              {
                n: "03",
                emoji: "🎁",
                title: "Ils grattent",
                desc: "Le destinataire ouvre le lien, gratte, découvre.",
              },
            ].map((step) => (
              <li key={step.n} className="card-pack">
                <div className="flex items-start justify-between mb-4">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-text)]">
                    Étape {step.n}
                  </p>
                  <span className="text-3xl leading-none">{step.emoji}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-[var(--color-ink-dim)] text-sm leading-relaxed">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex justify-center">
            <CtaCreerLink position="bas_de_page">
              Créer ma carte ▸
            </CtaCreerLink>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
