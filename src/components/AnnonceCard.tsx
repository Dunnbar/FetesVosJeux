/**
 * AnnonceCard — l'annonce révélée sous la couverture grattable.
 *
 * Deux modes :
 *   - "image" : on affiche simplement une image annonce uploadée par l'acheteur.
 *   - "text"  : on affiche un template typographique (Mariage / Naissance /
 *               Anniversaire / Save the Date) avec 3 champs génériques :
 *               title (gros), subtitle (verbe / liaison), body (date / lieu /
 *               infos complémentaires).
 *
 * Chaque template a sa propre identité visuelle (couleur d'accent, font,
 * ornement) mais partage le même format de données — l'acheteur peut
 * passer d'un template à l'autre sans tout retaper.
 *
 * La carte est dimensionnée pour remplir un carré (taille fixée par le
 * parent via `width/height` 100%), pour s'insérer derrière le canvas.
 */

import Image from "next/image";

export type AnnonceTemplate =
  | "mariage"
  | "naissance"
  | "anniversaire"
  | "save-the-date";

interface TemplateConfig {
  label: string;
  emoji: string;
  fieldLabels: { title: string; subtitle: string; body: string };
  placeholders: { title: string; subtitle: string; body: string };
}

export const ANNONCE_TEMPLATES: Record<AnnonceTemplate, TemplateConfig> = {
  mariage: {
    label: "Mariage",
    emoji: "💍",
    fieldLabels: {
      title: "Noms des mariés",
      subtitle: "Petite phrase",
      body: "Texte d'annonce",
    },
    placeholders: {
      title: "Sarah & Tom",
      subtitle: "se marient",
      body: "Le 14 juin 2026 à Étretat",
    },
  },
  naissance: {
    label: "Naissance",
    emoji: "👶",
    fieldLabels: {
      title: "Prénom du bébé",
      subtitle: "Annonce",
      body: "Texte d'annonce",
    },
    placeholders: {
      title: "Léon",
      subtitle: "est arrivé !",
      body: "Le 3 mars 2026 — 3,2 kg de bonheur",
    },
  },
  anniversaire: {
    label: "Anniversaire",
    emoji: "🎂",
    fieldLabels: {
      title: "Nom de la personne",
      subtitle: "Ce qu'on fête",
      body: "Texte d'annonce",
    },
    placeholders: {
      title: "Camille",
      subtitle: "fête ses 30 ans",
      body: "Samedi 12 septembre — RDV chez Manu",
    },
  },
  "save-the-date": {
    label: "Autre annonce",
    emoji: "📣",
    fieldLabels: {
      title: "Titre",
      subtitle: "Annonce",
      body: "Texte d'annonce",
    },
    placeholders: {
      title: "Notre crémaillère",
      subtitle: "On vous invite",
      body: "Samedi 5 décembre dès 19h — ramène ta bonne humeur",
    },
  },
};

interface AnnonceCardProps {
  mode: "text" | "image";
  template?: string | null;
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  imageSrc?: string | null;
  imageAlt?: string;
}

export function AnnonceCard({
  mode,
  template,
  title,
  subtitle,
  body,
  imageSrc,
  imageAlt = "",
}: AnnonceCardProps) {
  if (mode === "image" && imageSrc) {
    return (
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="450px"
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  // Mode text : on route vers la template demandée, ou Mariage par défaut.
  const t = (template as AnnonceTemplate) || "mariage";
  switch (t) {
    case "naissance":
      return <NaissanceLayout title={title} subtitle={subtitle} body={body} />;
    case "anniversaire":
      return (
        <AnniversaireLayout title={title} subtitle={subtitle} body={body} />
      );
    case "save-the-date":
      return <SaveTheDateLayout title={title} subtitle={subtitle} body={body} />;
    case "mariage":
    default:
      return <MariageLayout title={title} subtitle={subtitle} body={body} />;
  }
}

/* ============================================================
   Templates — chacun rempli avec title / subtitle / body
   ============================================================ */

interface TextProps {
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
}

/** Wrapper commun : centre verticalement, padding, fond crème pastel. */
function TemplateFrame({
  accent,
  ornament,
  children,
}: {
  accent: string;
  ornament: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 py-6"
      style={{ background: "var(--color-cream)", color: "var(--color-ink)" }}
    >
      {/* Bord intérieur double — détail "papeterie" */}
      <div
        aria-hidden
        className="absolute inset-3 border-2 rounded-sm pointer-events-none"
        style={{ borderColor: accent }}
      />
      <div
        aria-hidden
        className="absolute inset-4 border pointer-events-none"
        style={{ borderColor: accent, opacity: 0.4 }}
      />
      {/* Ornement décoratif au sommet */}
      <div
        className="font-mono text-xs uppercase tracking-[0.4em] mb-4"
        style={{ color: accent }}
      >
        {ornament}
      </div>
      {children}
    </div>
  );
}

function MariageLayout({ title, subtitle, body }: TextProps) {
  return (
    <TemplateFrame accent="var(--color-rose-deep)" ornament="✦ ♥ ✦">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight max-w-[85%]">
        {title || "Sarah & Tom"}
      </h2>
      <p
        className="mt-3 text-base italic"
        style={{ color: "var(--color-ink-dim)" }}
      >
        {subtitle || "se marient"}
      </p>
      <div className="mt-4 mx-auto w-12 h-px bg-[var(--color-rose-deep)] opacity-60" />
      <p className="mt-4 text-sm leading-relaxed max-w-[85%]">
        {body || "Le 14 juin 2026 à Étretat"}
      </p>
    </TemplateFrame>
  );
}

function NaissanceLayout({ title, subtitle, body }: TextProps) {
  return (
    <TemplateFrame accent="var(--color-peach)" ornament="✿ • ✿">
      <p
        className="font-mono text-[0.65rem] uppercase tracking-[0.4em] mb-1"
        style={{ color: "var(--color-ink-dim)" }}
      >
        Bienvenue
      </p>
      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
        {title || "Léon"}
      </h2>
      <p className="mt-3 text-base">{subtitle || "est arrivé !"}</p>
      <div className="mt-4 mx-auto w-12 h-px bg-[var(--color-peach)] opacity-70" />
      <p className="mt-4 text-sm leading-relaxed max-w-[85%]">
        {body || "Le 3 mars 2026 — 3,2 kg de bonheur"}
      </p>
    </TemplateFrame>
  );
}

function AnniversaireLayout({ title, subtitle, body }: TextProps) {
  return (
    <TemplateFrame accent="var(--color-gold-deep)" ornament="★ • ★">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
        {title || "Camille"}
      </h2>
      <p
        className="mt-2 text-lg italic"
        style={{ color: "var(--color-gold-deep)" }}
      >
        {subtitle || "fête ses 30 ans"}
      </p>
      <div className="mt-4 mx-auto w-12 h-px bg-[var(--color-gold-deep)] opacity-70" />
      <p className="mt-4 text-sm leading-relaxed max-w-[85%]">
        {body || "Samedi 12 septembre — RDV chez Manu"}
      </p>
    </TemplateFrame>
  );
}

function SaveTheDateLayout({ title, subtitle, body }: TextProps) {
  return (
    <TemplateFrame accent="var(--color-rose-deep)" ornament="◇ ◇ ◇">
      <p
        className="font-mono text-[0.65rem] uppercase tracking-[0.5em]"
        style={{ color: "var(--color-ink-dim)" }}
      >
        {subtitle || "On vous invite"}
      </p>
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
        {title || "Notre crémaillère"}
      </h2>
      <div className="mt-4 mx-auto w-12 h-px bg-[var(--color-rose-deep)] opacity-70" />
      <p className="mt-4 text-sm leading-relaxed max-w-[85%]">
        {body || "Samedi 5 décembre dès 19h"}
      </p>
    </TemplateFrame>
  );
}
