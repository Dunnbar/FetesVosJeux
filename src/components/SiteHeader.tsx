import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b-2 border-[var(--color-edge)] bg-[var(--color-cream)]/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-ink)] text-lg shadow-[2px_2px_0_0_var(--color-gold)] transition-transform duration-200 group-hover:-rotate-6">
            🎟️
          </span>
          <span className="font-bold text-xl tracking-tight text-[var(--color-ink)]">
            Qui s&apos;y{" "}
            <span className="text-[var(--color-rose-deep)]">Gratte</span>
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
