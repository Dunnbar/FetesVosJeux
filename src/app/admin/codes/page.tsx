import Link from "next/link";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { generateGiftCodesAction } from "../actions";
import { CopyCode } from "../CopyCode";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Codes cadeaux — Admin",
  robots: { index: false, follow: false },
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function AdminCodesPage() {
  const codes = await db.promoCode.findMany({
    orderBy: [{ used: "asc" }, { createdAt: "desc" }],
  });
  const available = codes.filter((c) => !c.used).length;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-12">
        <div className="flex items-center justify-between gap-4 mb-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-rose-deep)]">
            ◆ Back-office
          </p>
          <Link
            href="/admin"
            className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
          >
            ← Commandes
          </Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
          Codes cadeaux
        </h1>

        {/* Générateur */}
        <form
          action={generateGiftCodesAction}
          className="rounded-2xl border-2 border-[var(--color-edge)] bg-[var(--color-cream-2)] p-5 mb-8 flex flex-wrap items-end gap-4"
        >
          <div>
            <label
              htmlFor="count"
              className="block text-xs font-bold mb-1"
            >
              Combien ?
            </label>
            <input
              id="count"
              name="count"
              type="number"
              min={1}
              max={50}
              defaultValue={1}
              className="w-24 px-3 py-2 rounded-xl border-2 border-[var(--color-edge)] bg-[var(--color-cream)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-rose-deep)]"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label htmlFor="note" className="block text-xs font-bold mb-1">
              Note (facultatif)
            </label>
            <input
              id="note"
              name="note"
              type="text"
              placeholder="ex. jeu concours insta"
              className="w-full px-3 py-2 rounded-xl border-2 border-[var(--color-edge)] bg-[var(--color-cream)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-dim)] focus:outline-none focus:border-[var(--color-rose-deep)]"
            />
          </div>
          <button type="submit" className="btn-primary">
            Générer ▸
          </button>
        </form>

        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--color-ink-dim)] mb-3">
          ▸ {available} dispo · {codes.length} au total — clique un code pour le
          copier
        </p>

        <div className="overflow-x-auto rounded-2xl border-2 border-[var(--color-edge)]">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-cream-2)] text-left font-mono text-[0.62rem] uppercase tracking-widest text-[var(--color-ink-dim)]">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Note</th>
                <th className="px-4 py-3">Utilisé par / le</th>
                <th className="px-4 py-3">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr
                  key={c.code}
                  className={`border-t border-[var(--color-edge)] ${
                    c.used ? "opacity-55" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <CopyCode code={c.code} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest ${
                        c.used
                          ? "bg-[var(--color-cream-3)] text-[var(--color-ink-dim)]"
                          : "bg-[var(--color-mint)] text-[var(--color-ink)]"
                      }`}
                    >
                      {c.used ? "Utilisé" : "Dispo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-dim)]">
                    {c.note ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-dim)] font-mono text-[0.7rem]">
                    {c.used
                      ? `${c.usedByScratchCode ?? "?"}${
                          c.usedAt ? " · " + dateFmt.format(c.usedAt) : ""
                        }`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--color-ink-dim)]">
                    {dateFmt.format(c.createdAt)}
                  </td>
                </tr>
              ))}
              {codes.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-[var(--color-ink-dim)]"
                  >
                    Aucun code pour l&apos;instant — génères-en ci-dessus.
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
