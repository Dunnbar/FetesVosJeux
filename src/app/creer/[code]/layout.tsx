/**
 * Layout night-bg pour les routes /creer/[code]/* (preview, etc.).
 * Même fond plum sombre que la page de scratch publique pour que les
 * cartes (avec leur photo cover) pop visuellement et que les feux
 * d'artifice gardent leur impact.
 */
export default function CodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-night)] text-[var(--color-night-text)] relative">
      {children}
    </div>
  );
}
