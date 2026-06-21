import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-2 border-[var(--color-edge)]">
      <div className="pixel-rule" />
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-ink-dim)]">
            © {new Date().getFullYear()} — Qui S&apos;y Gratte
          </p>
          <Link
            href="/cgv"
            className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-ink-dim)] hover:text-[var(--color-rose-deep)] underline underline-offset-4 decoration-[var(--color-gold)]"
          >
            CGV
          </Link>
        </div>
        <p className="text-sm text-[var(--color-ink-dim)] italic">
          Les annonces qui font dire waouh.
        </p>
      </div>
    </footer>
  );
}
