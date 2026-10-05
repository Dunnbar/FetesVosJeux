import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { OG_BASE } from "@/lib/seo";
import { CreateScratchForm } from "./CreateScratchForm";
import { CreerPageView } from "./CreerPageView";

const titre = "Créer ma carte à gratter — Qui S'y Gratte";
const description =
  "Crée ta carte à gratter personnalisée : ta photo, ton message, un lien unique à partager. Tes proches grattent l'écran et découvrent la surprise.";

export const metadata = {
  title: titre,
  description,
  // Sans ça, la page hériterait du canonical du layout racine.
  alternates: { canonical: "/creer" },
  // Et sans CE bloc, elle hériterait de l'openGraph du layout — donc du
  // titre ET de l'`url: "/"` de la home. Facebook et LinkedIn dédupliquent
  // les partages par og:url : tous les partages de /creer étaient agrégés
  // sur l'objet « home ».
  openGraph: { ...OG_BASE, url: "/creer", title: titre, description },
};

export default function CreerPage() {
  return (
    <>
      <SiteHeader />
      <CreerPageView />

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
