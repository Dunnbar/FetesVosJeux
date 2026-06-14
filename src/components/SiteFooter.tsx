export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-2 border-[var(--color-edge)]">
      <div className="pixel-rule" />
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-ink-dim)]">
          © {new Date().getFullYear()} — Qui S&apos;y Gratte
        </p>
        <p className="text-sm text-[var(--color-ink-dim)] italic">
          Qui s&apos;y gratte… découvre.
        </p>
      </div>
    </footer>
  );
}
