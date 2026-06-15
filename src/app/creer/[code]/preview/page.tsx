import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PreviewExperience } from "./PreviewExperience";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aperçu de ta carte — Qui S'y Gratte",
};

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ canceled?: string }>;
}

export default async function PreviewPage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const { canceled } = await searchParams;

  const scratch = await db.scratch.findUnique({ where: { code } });
  if (!scratch) notFound();

  // Déjà payée → on l'envoie sur la page de partage (cas où elle a déjà
  // été payée et que l'utilisateur revient sur le preview par accident).
  if (scratch.status === "PAID") {
    redirect(`/creer/merci/${scratch.code}`);
  }

  return (
    <PreviewExperience
      code={scratch.code}
      revealMechanic={scratch.revealMechanic}
      coverImagePath={scratch.coverImagePath}
      annonceMode={scratch.annonceMode}
      annonceTemplate={scratch.annonceTemplate}
      annonceTitle={scratch.annonceTitle}
      annonceSubtitle={scratch.annonceSubtitle}
      annonceBody={scratch.annonceBody}
      annonceImagePath={scratch.annonceImagePath}
      withFireworks={scratch.withFireworks}
      withSound={scratch.withSound}
      amountCents={scratch.amountCents}
      canceled={canceled === "1"}
    />
  );
}
