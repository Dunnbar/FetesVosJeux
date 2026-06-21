import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CreateScratchForm } from "./CreateScratchForm";

export const metadata = {
  title: "Créer ma carte à gratter — Qui S'y Gratte",
  description:
    "Crée ta carte à gratter personnalisée : ta photo, ton message, un lien unique à partager. Tes proches grattent l'écran et découvrent la surprise.",
};

export default function CreerPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 mx-auto max-w-3xl lg:max-w-6xl w-full px-6 py-12 sm:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[0.95] mb-12">
          Ta photo,
          <br />
          <span className="text-[var(--color-rose-deep)]">leur surprise</span>.
        </h1>

        <CreateScratchForm />
      </main>

      <SiteFooter />
    </>
  );
}
