import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroAutoScratch } from "@/components/HeroAutoScratch";
import {
  REVEAL_MECHANICS,
  REVEAL_MECHANIC_KEYS,
} from "@/components/reveals/types";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* ========== Hero — texte à gauche, mini-démo à droite ========== */}
        <section className="mx-auto max-w-6xl px-6 pt-12 sm:pt-20 pb-16">
          <div className="grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-16 items-center">
            <div>
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[0.95]">
                Offrez une photo
                <br />
                <span className="text-[var(--color-rose-deep)]">à gratter</span>.
              </h1>
              <p className="mt-8 max-w-xl text-lg sm:text-xl text-[var(--color-ink-dim)] leading-relaxed">
                Tu uploades une photo, ils grattent pour découvrir ton annonce.
              </p>
              <div className="mt-10 flex items-center gap-3 flex-wrap">
                <Link href="/creer" className="btn-primary">
                  Créer ma carte ▸
                </Link>
                <Link href="/g/DEMOSCRATCH" className="btn-outline">
                  Voir la démo
                </Link>
              </div>
            </div>

            {/* Mini-démo animée — visible sur lg+, cachée sur mobile */}
            <div className="hidden lg:block">
              <HeroAutoScratch />
            </div>
          </div>
        </section>

        {/* ========== 3 mécaniques de cartes ========== */}
        <section className="mx-auto max-w-6xl px-6 pt-8 pb-16">
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-deep)] mb-2">
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

        {/* ========== Comment ça marche en 3 étapes ========== */}
        <section
          id="comment"
          className="mx-auto max-w-6xl px-6 pt-12 pb-20 scroll-mt-12"
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
                title: "Tu paies",
                desc: "Paiement sécurisé en un clic. Tu reçois ton lien dans la foulée.",
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
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-deep)]">
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
            <Link href="/creer" className="btn-primary">
              Créer ma carte ▸
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
