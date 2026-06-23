import Link from "next/link";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { formatPrice } from "@/lib/format";
import { REVEAL_MECHANICS, type RevealMechanic } from "@/components/reveals/types";
import { RefundButton } from "./RefundButton";
import { DeleteOrderButton } from "./DeleteOrderButton";
import { OrderLinks } from "./OrderLinks";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Qui S'y Gratte",
  robots: { index: false, follow: false },
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
});

function mechanicLabel(m: string): string {
  return REVEAL_MECHANICS[m as RevealMechanic]?.label ?? m;
}

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-[var(--color-mint)] text-[var(--color-ink)]",
  PENDING: "bg-[var(--color-cream-3)] text-[var(--color-ink-dim)]",
  REFUNDED: "bg-[var(--color-rose)] text-[var(--color-ink)]",
  FAILED: "bg-[var(--color-rose-deep)] text-white",
};

export default async function AdminPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Les cartes de démo (codes DEMO*) sont exclues de tout l'admin.
  const cards = await db.scratch.findMany({
    where: { NOT: { code: { startsWith: "DEMO" } } },
    orderBy: { createdAt: "desc" },
    select: {
      code: true,
      groupId: true,
      revealMechanic: true,
      status: true,
      amountCents: true,
      buyerEmail: true,
      giftCode: true,
      withFireworks: true,
      stripePaymentIntentId: true,
      annonceTitle: true,
      createdAt: true,
    },
  });

  // Regroupe les cartes en commandes (1 commande = standalone, ou groupe multi-formats).
  const groups = new Map<string, typeof cards>();
  for (const c of cards) {
    const key = c.groupId ?? c.code;
    const arr = groups.get(key);
    if (arr) arr.push(c);
    else groups.set(key, [c]);
  }

  const orders = [...groups.values()].map((groupCards) => {
    const lead = groupCards.reduce(
      (a, b) => (b.amountCents > a.amountCents ? b : a),
      groupCards[0]
    );
    return {
      leadCode: lead.code,
      createdAt: lead.createdAt,
      status: lead.status,
      amountCents: lead.amountCents,
      buyerEmail: lead.buyerEmail,
      giftCode: lead.giftCode,
      withFireworks: lead.withFireworks,
      annonceTitle: lead.annonceTitle,
      paymentIntentId: lead.stripePaymentIntentId,
      mechanics: groupCards.map((c) => c.revealMechanic),
      links: groupCards.map((c) => ({
        label: mechanicLabel(c.revealMechanic),
        url: `${siteUrl}/g/${c.code}`,
      })),
    };
  });
  orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const paid = orders.filter((o) => o.status === "PAID");
  const gifted = orders.filter((o) => o.giftCode);
  const revenueCents = paid.reduce((sum, o) => sum + o.amountCents, 0);

  const stats = [
    { label: "Commandes", value: String(orders.length) },
    { label: "Payées", value: String(paid.length) },
    { label: "Offertes (code)", value: String(gifted.length) },
    { label: "Chiffre d'affaires", value: formatPrice(revenueCents) },
  ];

  // Détail des ventes (commandes payées uniquement).
  const singleByMech: Record<string, number> = {
    scratch: 0,
    polaroid: 0,
    envelope: 0,
  };
  let bundle2 = 0;
  let bundle3 = 0;
  let withFireworksCount = 0;
  for (const o of paid) {
    if (o.mechanics.length === 1) {
      singleByMech[o.mechanics[0]] = (singleByMech[o.mechanics[0]] ?? 0) + 1;
    } else if (o.mechanics.length === 2) {
      bundle2 += 1;
    } else if (o.mechanics.length >= 3) {
      bundle3 += 1;
    }
    if (o.withFireworks) withFireworksCount += 1;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-12">
        <div className="flex items-center justify-between gap-4 mb-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-rose-deep)]">
            ◆ Back-office
          </p>
          <Link
            href="/admin/codes"
            className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
          >
            Codes cadeaux →
          </Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
          Commandes
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border-2 border-[var(--color-edge)] bg-[var(--color-cream-2)] p-4"
            >
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--color-ink-dim)] mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Détail des ventes */}
        <div className="rounded-2xl border-2 border-[var(--color-edge)] bg-[var(--color-cream-2)] p-5 mb-10">
          <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--color-ink-dim)] mb-4">
            ▸ Détail des ventes (commandes payées)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-bold mb-2">Format unique</p>
              <ul className="space-y-1 text-sm text-[var(--color-ink-dim)]">
                {(["scratch", "polaroid", "envelope"] as const).map((m) => (
                  <li key={m} className="flex justify-between gap-3">
                    <span>{mechanicLabel(m)}</span>
                    <span className="font-bold text-[var(--color-ink)]">
                      {singleByMech[m]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold mb-2">Bundles</p>
              <ul className="space-y-1 text-sm text-[var(--color-ink-dim)]">
                <li className="flex justify-between gap-3">
                  <span>2 formats</span>
                  <span className="font-bold text-[var(--color-ink)]">
                    {bundle2}
                  </span>
                </li>
                <li className="flex justify-between gap-3">
                  <span>3 formats</span>
                  <span className="font-bold text-[var(--color-ink)]">
                    {bundle3}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold mb-2">Options</p>
              <ul className="space-y-1 text-sm text-[var(--color-ink-dim)]">
                <li className="flex justify-between gap-3">
                  <span>🎆 Avec feux d&apos;artifice</span>
                  <span className="font-bold text-[var(--color-ink)]">
                    {withFireworksCount}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tableau des commandes */}
        <div className="overflow-x-auto rounded-2xl border-2 border-[var(--color-edge)]">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-cream-2)] text-left font-mono text-[0.62rem] uppercase tracking-widest text-[var(--color-ink-dim)]">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Annonce & liens</th>
                <th className="px-4 py-3">Acheteur</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.leadCode}
                  className="border-t border-[var(--color-edge)] align-top"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--color-ink-dim)]">
                    {dateFmt.format(o.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold">{o.annonceTitle ?? "—"}</div>
                    <OrderLinks links={o.links} />
                  </td>
                  <td className="px-4 py-3 break-all text-[var(--color-ink-dim)]">
                    {o.buyerEmail ?? "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {o.giftCode ? (
                      <span className="text-[var(--color-ink-dim)]">
                        Offerte
                        <span className="block font-mono text-[0.6rem]">
                          {o.giftCode}
                        </span>
                      </span>
                    ) : (
                      formatPrice(o.amountCents)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest ${
                        STATUS_STYLE[o.status] ?? STATUS_STYLE.PENDING
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-end gap-2">
                      {o.status === "PAID" && o.paymentIntentId && (
                        <RefundButton leadCode={o.leadCode} />
                      )}
                      <DeleteOrderButton leadCode={o.leadCode} />
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-[var(--color-ink-dim)]"
                  >
                    Aucune commande pour l&apos;instant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
