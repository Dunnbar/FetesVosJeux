import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Conditions Générales de Vente — Qui S'y Gratte",
};

/**
 * CGV — modèle adapté à la vente de contenu numérique (carte à gratter en
 * ligne) à des consommateurs en France. Les champs entre crochets [ ... ]
 * sont à compléter par l'éditeur avant publication. Ce texte est un point de
 * départ sérieux mais ne remplace pas une validation juridique.
 */
export default function CGVPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-12 sm:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-rose-deep)] mb-4">
          ◆ Informations légales
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[0.95] mb-4">
          Conditions Générales
          <br />
          <span className="text-[var(--color-rose-deep)]">de Vente</span>.
        </h1>
        <p className="text-sm text-[var(--color-ink-dim)] mb-12">
          Dernière mise à jour : juin 2026
        </p>

        <div className="space-y-10 text-[var(--color-ink)] leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-2 [&_p]:text-[var(--color-ink-dim)] [&_p]:mb-3 [&_li]:text-[var(--color-ink-dim)] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-[var(--color-ink)]">
          <section>
            <h2>1. Objet</h2>
            <p>
              Les présentes conditions générales de vente (les «&nbsp;CGV&nbsp;»)
              régissent la vente, sur le site{" "}
              <strong>quisygratte.fr</strong> (le «&nbsp;Site&nbsp;»), de cartes à
              gratter numériques personnalisées permettant de révéler une annonce
              (mariage, naissance, anniversaire, etc.). Toute commande passée sur
              le Site implique l&apos;acceptation sans réserve des présentes CGV.
            </p>
          </section>

          <section>
            <h2>2. Éditeur / Vendeur</h2>
            <p>
              Le Site est édité par <strong>Dimitri Saint-Mleux</strong>,
              entrepreneur individuel (micro-entreprise), dont le siège est
              situé <strong>1 rue du 19 mars 1962, 14730 Giberville</strong>,
              immatriculé sous le numéro SIRET{" "}
              <strong>829&nbsp;947&nbsp;985&nbsp;00026</strong>.
            </p>
            <p>
              Contact&nbsp;: <strong>dimitri.developpeur@gmail.com</strong>.
            </p>
            <p>
              TVA&nbsp;: TVA non applicable, art. 293 B du CGI.
            </p>
          </section>

          <section>
            <h2>3. Produits</h2>
            <p>
              Le Site permet de créer une carte à gratter numérique&nbsp;:
              l&apos;acheteur téléverse une photo et saisit le texte de son
              annonce. Après paiement, un lien unique et permanent est généré, à
              partager librement avec les destinataires de son choix. Des options
              payantes (feux d&apos;artifice, musique) peuvent être ajoutées.
            </p>
            <p>
              Le produit est entièrement <strong>numérique</strong>&nbsp;: aucun
              bien physique n&apos;est expédié.
            </p>
          </section>

          <section>
            <h2>4. Prix</h2>
            <p>
              Les prix sont indiqués en euros, toutes taxes comprises, sur la page
              de création avant validation de la commande. Le prix applicable est
              celui affiché au moment de la commande. L&apos;éditeur se réserve le
              droit de modifier ses prix à tout moment, sans effet sur les
              commandes déjà passées.
            </p>
          </section>

          <section>
            <h2>5. Commande et paiement</h2>
            <p>
              La commande est validée par le paiement. Le paiement est traité de
              manière sécurisée par notre prestataire <strong>Stripe</strong>&nbsp;;
              aucune donnée de carte bancaire ne transite ni n&apos;est conservée
              par l&apos;éditeur. La commande n&apos;est définitive qu&apos;après
              confirmation du paiement.
            </p>
          </section>

          <section>
            <h2>6. Livraison</h2>
            <p>
              La «&nbsp;livraison&nbsp;» est immédiate et numérique&nbsp;: dès la
              confirmation du paiement, le lien d&apos;accès à la carte est mis à
              disposition sur le Site et, le cas échéant, envoyé à
              l&apos;adresse e-mail fournie. Le lien n&apos;a pas de date
              d&apos;expiration.
            </p>
          </section>

          <section>
            <h2>7. Droit de rétractation</h2>
            <p>
              Conformément à l&apos;article L.221-28 13° du Code de la
              consommation, le droit de rétractation ne peut être exercé pour la
              fourniture d&apos;un <strong>contenu numérique</strong>{" "}non fourni
              sur un support matériel dont l&apos;exécution a commencé après accord
              préalable exprès du consommateur et renoncement exprès à son droit de
              rétractation.
            </p>
            <p>
              En validant et en payant sa commande, l&apos;acheteur{" "}
              <strong>
                demande expressément l&apos;exécution immédiate
              </strong>{" "}
              de la prestation (génération du lien) et{" "}
              <strong>renonce à son droit de rétractation</strong>. Aucune
              rétractation n&apos;est donc possible une fois le lien généré.
            </p>
          </section>

          <section>
            <h2>8. Codes cadeaux</h2>
            <p>
              Des codes cadeaux à usage unique peuvent permettre de débloquer une
              carte gratuitement. Un code ne peut être utilisé qu&apos;une seule
              fois, n&apos;est ni remboursable ni échangeable contre des espèces,
              et peut être désactivé en cas d&apos;usage frauduleux.
            </p>
          </section>

          <section>
            <h2>9. Contenu fourni par l&apos;acheteur</h2>
            <p>
              L&apos;acheteur est seul responsable du contenu qu&apos;il
              téléverse (photo, texte). Il garantit détenir l&apos;ensemble des
              droits nécessaires et que ce contenu ne porte atteinte à aucun droit
              de tiers ni à l&apos;ordre public. L&apos;éditeur se réserve le droit
              de supprimer tout contenu manifestement illicite.
            </p>
          </section>

          <section>
            <h2>10. Disponibilité et responsabilité</h2>
            <p>
              L&apos;éditeur s&apos;efforce d&apos;assurer la disponibilité du Site
              et des liens générés, sans garantie d&apos;absence
              d&apos;interruption. Sa responsabilité ne saurait être engagée pour
              les dommages indirects ni en cas de force majeure ou de défaillance
              d&apos;un prestataire technique tiers.
            </p>
          </section>

          <section>
            <h2>11. Remboursements</h2>
            <p>
              Le produit étant numérique et livré immédiatement, les commandes ne
              sont en principe pas remboursables (cf. article 7). En cas de
              problème technique avéré imputable à l&apos;éditeur empêchant
              l&apos;accès à la carte, l&apos;acheteur peut contacter le service
              client&nbsp;; un remboursement pourra être effectué via Stripe à la
              discrétion de l&apos;éditeur.
            </p>
          </section>

          <section>
            <h2>12. Données personnelles</h2>
            <p>
              Les données collectées (e-mail, contenu de la carte) sont utilisées
              uniquement pour fournir le service. Conformément au RGPD,
              l&apos;acheteur dispose d&apos;un droit d&apos;accès, de
              rectification et de suppression de ses données en écrivant à{" "}
              <strong>dimitri.developpeur@gmail.com</strong>. Pour le détail, voir notre{" "}
              <a
                href="/confidentialite"
                className="underline decoration-[var(--color-gold)] hover:text-[var(--color-rose-deep)]"
              >
                Politique de confidentialité
              </a>
              .
            </p>
          </section>

          <section>
            <h2>13. Service client et réclamations</h2>
            <p>
              Pour toute question ou réclamation, écris-nous à{" "}
              <strong>dimitri.developpeur@gmail.com</strong>. Nous nous efforçons
              de répondre dans les meilleurs délais.
            </p>
          </section>

          <section>
            <h2>14. Droit applicable</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige,
              une solution amiable sera recherchée en priorité&nbsp;; à défaut, les
              tribunaux français seront compétents.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
