import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Politique de confidentialité — Qui S'y Gratte",
};

export default function ConfidentialitePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-12 sm:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-rose-deep)] mb-4">
          ◆ Vie privée · RGPD
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[0.95] mb-4">
          Politique de
          <br />
          <span className="text-[var(--color-rose-deep)]">confidentialité</span>.
        </h1>
        <p className="text-sm text-[var(--color-ink-dim)] mb-12">
          Dernière mise à jour : juin 2026
        </p>

        <div className="space-y-10 text-[var(--color-ink)] leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_p]:text-[var(--color-ink-dim)] [&_p]:mb-3 [&_li]:text-[var(--color-ink-dim)] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-[var(--color-ink)] [&_a]:underline [&_a]:decoration-[var(--color-gold)] [&_a:hover]:text-[var(--color-rose-deep)]">
          <section>
            <h2>1. Responsable du traitement</h2>
            <p>
              <strong>Dimitri Saint-Mleux</strong> (entrepreneur individuel,
              SIRET 829&nbsp;947&nbsp;985&nbsp;00026), 1 rue du 19 mars 1962,
              14730 Giberville. Contact :{" "}
              <strong>dimitri.developpeur@gmail.com</strong>.
            </p>
          </section>

          <section>
            <h2>2. Données collectées</h2>
            <ul>
              <li>
                <strong>Adresse e-mail</strong>{" "}de l&apos;acheteur (si fournie),
                pour envoyer le lien de la carte.
              </li>
              <li>
                <strong>Contenu de la carte</strong> : photo téléversée et texte
                de l&apos;annonce.
              </li>
              <li>
                <strong>Données de paiement</strong> : traitées intégralement par
                Stripe. Nous ne stockons aucune donnée de carte bancaire,
                uniquement un identifiant de transaction.
              </li>
              <li>
                <strong>Données techniques</strong> : logs serveur (adresse IP,
                horodatage) à des fins de sécurité et de bon fonctionnement.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Finalités et bases légales</h2>
            <ul>
              <li>
                Fournir le service (créer, héberger et partager la carte, envoyer
                le lien) — <strong>exécution du contrat</strong>.
              </li>
              <li>
                Traiter le paiement — <strong>exécution du contrat</strong> /
                obligation légale (comptabilité).
              </li>
              <li>
                Sécurité et prévention des abus — <strong>intérêt légitime</strong>.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Sous-traitants et destinataires</h2>
            <p>
              Vos données ne sont jamais vendues. Elles sont confiées à des
              prestataires techniques agissant comme sous-traitants :
            </p>
            <ul>
              <li>
                <strong>Stripe</strong> — paiement en ligne.
              </li>
              <li>
                <strong>Resend</strong> — envoi des e-mails.
              </li>
              <li>
                <strong>Neon</strong> — base de données (région Europe).
              </li>
              <li>
                <strong>Vercel</strong> — hébergement du site et stockage des
                images (Vercel Blob).
              </li>
            </ul>
            <p>
              Certains de ces prestataires sont situés hors de l&apos;Union
              européenne (États-Unis). Les transferts sont encadrés par des
              garanties appropriées (clauses contractuelles types / Data Privacy
              Framework).
            </p>
          </section>

          <section>
            <h2>5. Durée de conservation</h2>
            <p>
              La carte et son contenu sont conservés tant que le lien est actif
              (le service étant « sans expiration »). Les données de facturation
              sont conservées selon les obligations légales (10 ans). Tu peux
              demander la suppression d&apos;une carte à tout moment.
            </p>
          </section>

          <section>
            <h2>6. Tes droits</h2>
            <p>
              Conformément au RGPD, tu disposes d&apos;un droit d&apos;accès, de
              rectification, d&apos;effacement, de limitation, d&apos;opposition
              et de portabilité de tes données. Pour les exercer, écris à{" "}
              <strong>dimitri.developpeur@gmail.com</strong>. Tu peux aussi
              introduire une réclamation auprès de la{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener">
                CNIL
              </a>
              .
            </p>
          </section>

          <section>
            <h2>7. Cookies</h2>
            <p>
              Le Site n&apos;utilise pas de cookies de suivi publicitaire ni de
              mesure d&apos;audience. Seuls des cookies strictement nécessaires au
              fonctionnement peuvent être déposés. Le prestataire de paiement
              (Stripe) peut déposer ses propres cookies lors du paiement, à des
              fins de sécurité.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
