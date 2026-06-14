/**
 * Mini "ticket à gratter" auto-animé pour le hero de la home.
 *
 * Donne vie au produit sans interaction : la photo cover "se gratte"
 * en loop et révèle l'annonce dessous, puis revient. Réalisé en pur
 * CSS (keyframes définies dans globals.css).
 */
export function HeroAutoScratch() {
  return (
    <div className="relative w-full max-w-[320px] aspect-[4/5] mx-auto">
      {/* Halo doré décoratif derrière la carte */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-3 bg-[var(--color-gold)] rounded-2xl -z-10"
      />

      {/* Carte (wrapper) */}
      <div
        className="relative w-full h-full bg-white rounded-2xl overflow-hidden border-2 border-[var(--color-ink)] shadow-xl"
        style={{ animation: "hero-float 4s ease-in-out infinite" }}
      >
        {/* Couche révélée (annonce) — toujours présente derrière */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-[var(--color-cream)]">
          {/* Double cadre festif */}
          <div
            aria-hidden
            className="absolute inset-3 border-2 border-[var(--color-rose-deep)] rounded-sm pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute inset-4 border border-[var(--color-rose-deep)]/40 pointer-events-none"
          />

          <p className="font-mono text-[0.6rem] uppercase tracking-[0.4em] text-[var(--color-rose-deep)] mb-3">
            ✦ ♥ ✦
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Margaux & Antoine
          </h3>
          <p className="mt-1 text-sm italic text-[var(--color-ink-dim)]">
            se marient
          </p>
          <div className="mt-3 w-10 h-px bg-[var(--color-rose-deep)] opacity-60" />
          <p className="mt-3 text-xs text-[var(--color-ink)]">
            Le 14 septembre 2026
          </p>
          <p className="text-xs text-[var(--color-ink-dim)]">à Étretat</p>
        </div>

        {/* Couche cover (photo) — animée en clip-path / opacity */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/uploads/demo-cover.jpg)",
            animation: "hero-scratch-loop 6s ease-in-out infinite",
          }}
        >
          {/* Indication "gratter" qui disparaît avec la cover */}
          <div className="absolute inset-x-0 bottom-6 flex justify-center">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/90 bg-black/45 px-2.5 py-1 rounded-sm">
              ▸ Gratte la photo
            </span>
          </div>
        </div>
      </div>

      {/* Sparkles festifs en orbite (CSS only) */}
      <div
        aria-hidden
        className="absolute -top-3 -right-2 text-3xl pointer-events-none"
        style={{
          animation: "hero-sparkle 6s ease-in-out infinite",
          animationDelay: "0.5s",
        }}
      >
        ✨
      </div>
      <div
        aria-hidden
        className="absolute -bottom-3 -left-2 text-2xl pointer-events-none"
        style={{
          animation: "hero-sparkle 6s ease-in-out infinite",
          animationDelay: "1s",
        }}
      >
        🎉
      </div>
      <div
        aria-hidden
        className="absolute top-1/3 -right-6 text-xl pointer-events-none"
        style={{
          animation: "hero-sparkle 6s ease-in-out infinite",
          animationDelay: "0.2s",
        }}
      >
        💍
      </div>
    </div>
  );
}
