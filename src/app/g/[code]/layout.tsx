/**
 * Layout dédié à la page de scratch publique.
 *
 * Le reste du site est sur fond crème pastel ; ici on bascule sur un
 * fond plum profond (--color-night). Pourquoi ? Les feux d'artifice CSS
 * (issus du POC photo_a_gratter) ont été dessinés pour pop sur fond
 * sombre — un fond clair les rendrait quasi invisibles.
 *
 * Le layout couvre l'écran avec `min-h-screen` et `relative` pour que
 * les feux d'artifice en `fixed inset-0` se positionnent correctement
 * dans le viewport au-dessus du contenu.
 */
export default function ScratchLayout({
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
