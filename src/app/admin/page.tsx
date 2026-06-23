import { db } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { formatPrice } from "@/lib/format";
import { REVEAL_MECHANICS, type RevealMechanic } from "@/components/reveals/types";
import { RefundButton } from "./RefundButton";

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
  const cards = await db.scratch.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      code: true,
      groupId: true,
      revealMechanic: true,
      status: true,
      amountCents: true,
      buyerEmail: true,
      giftCode: true,
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
    // "lead" = la carte qui porte le montant total.
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
      annonceTitle: lead.annonceTitle,
      paymentIntentId: lead.stripePaymentIntentId,
      formats: groupCards.map((c) => mechanicLabel(c.revealMechanic)),
      codes: groupCards.map((c) => c.code),
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

  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-12">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-rose-deep)] mb-2">
          ◆ Back-office
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
          Commandes
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
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

        {/* Tableau des commandes */}
        <div className="overflow-x-auto rounded-2xl border-2 border-[var(--color-edge)]">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-cream-2)] text-left font-mono text-[0.62rem] uppercase tracking-widest text-[var(--color-ink-dim)]">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Annonce</th>
                <th className="px-4 py-3">Formats</th>
                <th className="px-4 py-3">Acheteur</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Action</th>
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
                    <div className="font-mono text-[0.65rem] text-[var(--color-ink-dim)]">
                      {o.codes.join(", ")}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-dim)]">
                    {o.formats.join(" · ")}
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
                  <td className="px-4 py-3 text-right">
                    {o.status === "PAID" && o.paymentIntentId ? (
                      <RefundButton leadCode={o.leadCode} />
                    ) : (
                      <span className="text-[var(--color-ink-dim)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
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
