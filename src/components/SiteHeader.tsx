import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b-2 border-[var(--color-edge)] bg-[var(--color-cream)]/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-ink-dim)] group-hover:text-[var(--color-rose-deep)] transition-colors">
            ◆ Qui s&apos;y
          </span>
          <span className="font-bold text-lg tracking-tight text-[var(--color-ink)]">
            Gratte
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
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
      </div>
      <div className="pixel-rule" />
    </header>
  );
}
