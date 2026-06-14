import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[0.95]">
            Offrez une photo
            <br />
            <span className="text-[var(--color-rose-deep)]">à gratter</span>.
          </h1>
          <p className="mt-8 max-w-xl text-lg sm:text-xl text-[var(--color-ink-dim)] leading-relaxed">
            Tu uploades une photo, ils grattent pour découvrir ton annonce.
          </p>
          <div className="mt-10 flex items-center gap-4 flex-wrap">
            <Link href="/creer" className="btn-primary">
              Créer ma carte ▸
            </Link>
            <Link
              href="/g/DEMO123456"
              className="font-mono text-sm uppercase tracking-widest text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] underline underline-offset-4 decoration-2 decoration-[var(--color-gold)]"
            >
              Voir la démo
            </Link>
          </div>
        </section>

        {/* Comment ça marche : 3 étapes */}
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
                title: "Tu crées",
                desc: "Upload une photo, choisis le modèle d'annonce, remplis les champs.",
              },
              {
                n: "02",
                title: "Tu paies 5 €",
                desc: "Paiement sécurisé. Tu reçois le lien immédiatement.",
              },
              {
                n: "03",
                title: "Ils grattent",
                desc: "Le destinataire ouvre le lien, gratte, découvre.",
              },
            ].map((step) => (
              <li key={step.n} className="card-pack">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-deep)] mb-4">
                  Étape {step.n}
                </p>
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
