import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { REVEAL_MECHANICS, type RevealMechanic } from "@/components/reveals/types";
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
    select: {
      code: true,
      annonceTitle: true,
      buyerEmail: true,
      status: true,
      groupId: true,
      revealMechanic: true,
    },
  });

  if (!scratch) {
    notFound();
  }

  // Le webhook Stripe pose la carte en PAID quasi instantanément, mais c'est
  // asynchrone — tant que ce n'est pas PAID, on poll côté client.
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

  // Commande multi-formats : on liste toutes les cartes du groupe.
  const cards = scratch.groupId
    ? await db.scratch.findMany({
        where: { groupId: scratch.groupId },
        select: { code: true, revealMechanic: true },
        orderBy: { amountCents: "desc" },
      })
    : [{ code: scratch.code, revealMechanic: scratch.revealMechanic }];
  const multi = cards.length > 1;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-2xl w-full px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-deep)] mb-4">
          ◆ Ta carte est prête
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[0.95] mb-10">
          {multi ? "Voilà tes liens" : "Voilà ton lien"}
          <br />
          <span className="text-[var(--color-rose-deep)]">à partager</span>.
        </h1>

        {/* Bannière email — l'envoi est géré par le webhook Stripe. */}
        {scratch.buyerEmail && (
          <div className="mb-8 p-5 rounded-2xl border-2 border-[var(--color-mint)] bg-[var(--color-cream-2)] flex items-start gap-4">
            <div className="text-2xl shrink-0">✉️</div>
            <div className="min-w-0">
              <p className="font-bold text-sm">Email envoyé !</p>
              <p className="text-sm text-[var(--color-ink-dim)] mt-1 break-all">
                On a envoyé {multi ? "les liens" : "le lien"} à{" "}
                <strong className="text-[var(--color-ink)]">
                  {scratch.buyerEmail}
                </strong>
                .
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {cards.map((c) => {
            const url = `${siteUrl}/g/${c.code}`;
            const label =
              REVEAL_MECHANICS[c.revealMechanic as RevealMechanic]?.label ??
              "Lien public";
            return (
              <div key={c.code} className="card-pack">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-ink-dim)] mb-3">
                  ▸ {multi ? label : "Lien public"}
                </p>
                <p className="font-mono text-lg break-all mb-5 text-[var(--color-ink)]">
                  {url}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <CopyLinkButton url={url} />
                  <Link
                    href={`/g/${c.code}`}
                    className="font-mono text-sm uppercase tracking-widest text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] underline underline-offset-4 decoration-2 decoration-[var(--color-gold)]"
                  >
                    Voir ▸
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[var(--color-cream-2)] rounded-2xl p-6 border-2 border-[var(--color-edge)]">
          <p className="text-sm leading-relaxed text-[var(--color-ink-dim)]">
            {multi
              ? "Chaque lien est une clé d'accès unique — note-les quelque part."
              : "Le code dans le lien est la seule clé d'accès — note-le quelque part."}
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
