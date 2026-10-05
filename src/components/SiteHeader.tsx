import Link from "next/link";
import { CtaCreerLink } from "@/components/analytics/CtaCreerLink";

/**
 * En-tête commun aux pages marketing (la carte reçue, /g/<code>, n'en a pas).
 *
 * Deux choses à savoir avant d'y toucher :
 *
 *   1. La navigation est masquée sous sm — donc sur l'écrasante majorité du
 *      trafic — et il n'y a pas de menu burger. Pendant longtemps le header
 *      ne servait donc, sur mobile, qu'à afficher un logo : sur une landing
 *      /idees, il pouvait s'écouler près de quatre écrans entre le CTA du
 *      chapeau et celui du pied de page sans un seul moyen d'aller sur
 *      /creer. D'où le CTA compact ci-dessous, lui visible à TOUTES les
 *      tailles.
 *   2. Le header est `sticky` : le CTA reste donc atteignable pendant tout
 *      le scroll. C'est ce qui rend sa hauteur critique — d'où le `py-2`
 *      sous sm, qui rend une dizaine de pixels au premier écran. Le bouton
 *      fait 44 px de haut (`py-2.5` + bordures), la cible tactile minimale.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--color-edge)] bg-[var(--color-cream)]/90 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-2 sm:py-4 flex items-center justify-between gap-4">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="text-2xl leading-none transition-transform duration-200 group-hover:-rotate-6">
            🎟️
          </span>
          <span className="font-bold text-xl tracking-tight text-[var(--color-ink)]">
            Qui s&apos;y{" "}
            <span className="text-[var(--color-rose-deep)]">Gratte</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link
              href="/idees"
              className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] transition-colors"
            >
              Idées
            </Link>
            <Link
              href="/#comment"
              className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] transition-colors"
            >
              Comment ça marche
            </Link>
            <Link
              href="/g/DEMO123456"
              className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] transition-colors"
            >
              Voir la démo
            </Link>
          </nav>

          {/* Compact : on garde le verbe seul sous sm pour ne pas pousser le
              logo, et la phrase complète dès qu'il y a la place. */}
          <CtaCreerLink
            position="header"
            className="btn-primary px-4 py-2.5 whitespace-nowrap"
          >
            Créer<span className="hidden sm:inline"> ma carte</span> ▸
          </CtaCreerLink>
        </div>
      </div>
      <div className="pixel-rule" />
    </header>
  );
}
