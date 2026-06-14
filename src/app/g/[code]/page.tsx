import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ScratchExperience } from "./ScratchExperience";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  const scratch = await db.scratch.findUnique({
    where: { code },
    select: { annonceTitle: true },
  });
  return {
    title: scratch?.annonceTitle
      ? `${scratch.annonceTitle} — Qui S'y Gratte`
      : "Une carte à gratter — Qui S'y Gratte",
  };
}

export default async function PublicScratchPage({ params }: PageProps) {
  const { code } = await params;
  const scratch = await db.scratch.findUnique({ where: { code } });

  if (!scratch) {
    notFound();
  }

  // Carte créée mais paiement non confirmé : on ne révèle pas le contenu.
  if (scratch.status !== "PAID") {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-deep)] mb-6">
            ◆ Carte en attente
          </p>
          <h1 className="text-3xl font-bold mb-4">Pas encore prête.</h1>
          <p className="text-[var(--color-ink-dim)]">
            Reviens dans quelques minutes.
          </p>
        </div>
      </main>
    );
  }

  return (
    <ScratchExperience
      code={scratch.code}
      revealMechanic={scratch.revealMechanic}
      coverImagePath={scratch.coverImagePath}
      annonceMode={scratch.annonceMode}
      annonceTemplate={scratch.annonceTemplate}
      annonceTitle={scratch.annonceTitle}
      annonceSubtitle={scratch.annonceSubtitle}
      annonceBody={scratch.annonceBody}
      annonceImagePath={scratch.annonceImagePath}
    />
  );
}
