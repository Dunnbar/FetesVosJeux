import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Mentions légales — Qui S'y Gratte",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-12 sm:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-rose-deep)] mb-4">
          ◆ Informations légales
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[0.95] mb-12">
          Mentions
          <span className="text-[var(--color-rose-deep)]"> légales</span>.
        </h1>

        <div className="space-y-10 text-[var(--color-ink)] leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_p]:text-[var(--color-ink-dim)] [&_p]:mb-2 [&_strong]:text-[var(--color-ink)] [&_a]:underline [&_a]:decoration-[var(--color-gold)] [&_a:hover]:text-[var(--color-rose-deep)]">
          <section>
            <h2>Éditeur du site</h2>
            <p>
              <strong>Dimitri Saint-Mleux</strong> — entrepreneur individuel
              (micro-entreprise).
            </p>
            <p>Siège : 1 rue du 19 mars 1962, 14730 Giberville, France.</p>
            <p>SIRET : 829&nbsp;947&nbsp;985&nbsp;00026 (SIREN 829&nbsp;947&nbsp;985).</p>
            <p>Code APE : 6201Z — Programmation informatique.</p>
            <p>TVA : non applicable, art. 293 B du CGI.</p>
            <p>Contact : dimitri.developpeur@gmail.com</p>
            <p>Directeur de la publication : Dimitri Saint-Mleux.</p>
          </section>

          <section>
            <h2>Hébergement</h2>
            <p>
              Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon
              Ave #4133, Walnut, CA 91789, États-Unis —{" "}
              <a href="https://vercel.com" target="_blank" rel="noopener">
                vercel.com
              </a>
              .
            </p>
            <p>
              La base de données est hébergée par <strong>Neon</strong> (région
              Europe) et les images par <strong>Vercel Blob</strong>.
            </p>
          </section>

          <section>
            <h2>Propriété intellectuelle</h2>
            <p>
              La marque «&nbsp;Qui S&apos;y Gratte&nbsp;», le Site et son contenu
              (hors contenus téléversés par les utilisateurs) sont protégés. Toute
              reproduction non autorisée est interdite. Les photos et textes
              téléversés restent la propriété de leurs auteurs.
            </p>
          </section>

          <section>
            <h2>Données personnelles</h2>
            <p>
              Le traitement des données personnelles est décrit dans notre{" "}
              <a href="/confidentialite">Politique de confidentialité</a>. Les
              conditions de vente sont détaillées dans les{" "}
              <a href="/cgv">Conditions Générales de Vente</a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
