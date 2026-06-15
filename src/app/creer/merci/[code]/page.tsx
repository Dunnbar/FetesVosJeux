import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CopyLinkButton } from "./CopyLinkButton";
import { PaymentPending } from "./PaymentPending";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ta carte est prête — Qui S'y Gratte",
};

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function MerciPage({ params }: PageProps) {
  const { code } = await params;

  const scratch = await db.scratch.findUnique({
    where: { code },
    select: { code: true, annonceTitle: true, buyerEmail: true, status: true },
  });

  if (!scratch) {
    notFound();
  }

  // L'utilisateur arrive ici juste après avoir payé Stripe (redirect
  // depuis success_url). Le webhook Stripe pose la carte en PAID quasi
  // instantanément, mais c'est asynchrone — il y a une milliseconde où
  // la page peut voir status PENDING. Dans ce cas on rend un composant
  // client qui va poller jusqu'à ce que la carte soit PAID.
  if (scratch.status !== "PAID") {
    return (
      <>
        <SiteHeader />
        <PaymentPending code={scratch.code} />
        <SiteFooter />
      </>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const shareUrl = `${siteUrl}/g/${scratch.code}`;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-2xl w-full px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-deep)] mb-4">
          ◆ Ta carte est prête
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[0.95] mb-10">
          Voilà ton lien
          <br />
          <span className="text-[var(--color-rose-deep)]">à partager</span>.
        </h1>

        {/* Bannière email — visible si on a une adresse en DB (l'envoi est
            géré par le webhook Stripe). */}
        {scratch.buyerEmail && (
          <div className="mb-8 p-5 rounded-2xl border-2 border-[var(--color-mint)] bg-[var(--color-cream-2)] flex items-start gap-4">
            <div className="text-2xl shrink-0">✉️</div>
            <div className="min-w-0">
              <p className="font-bold text-sm">Email envoyé !</p>
              <p className="text-sm text-[var(--color-ink-dim)] mt-1 break-all">
                On a envoyé le lien à{" "}
                <strong className="text-[var(--color-ink)]">
                  {scratch.buyerEmail}
                </strong>
                .
              </p>
            </div>
          </div>
        )}

        <div className="card-pack mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-ink-dim)] mb-3">
            ▸ Lien public
          </p>
          <p className="font-mono text-lg break-all mb-5 text-[var(--color-ink)]">
            {shareUrl}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <CopyLinkButton url={shareUrl} />
            <Link
              href={`/g/${scratch.code}`}
              className="font-mono text-sm uppercase tracking-widest text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] underline underline-offset-4 decoration-2 decoration-[var(--color-gold)]"
            >
              Voir ma carte ▸
            </Link>
          </div>
        </div>

        <div className="bg-[var(--color-cream-2)] rounded-2xl p-6 border-2 border-[var(--color-edge)]">
          <p className="text-sm leading-relaxed text-[var(--color-ink-dim)]">
            Code de la carte :{" "}
            <strong className="font-mono text-[var(--color-ink)]">
              {scratch.code}
            </strong>
            . Note-le quelque part — c&apos;est la seule clé d&apos;accès.
          </p>
        </div>

        <div className="mt-12">
          <Link
            href="/creer"
            className="font-mono text-sm uppercase tracking-widest text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
          >
            ← Créer une autre carte
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
