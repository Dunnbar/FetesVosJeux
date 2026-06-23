"use client";

import { useState, useTransition } from "react";
import { deleteOrderAction } from "./actions";

export function DeleteOrderButton({ leadCode }: { leadCode: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function confirm() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteOrderAction(leadCode);
        setOpen(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Échec de la suppression.");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-[0.7rem] uppercase tracking-widest text-[var(--color-ink-dim)] hover:text-[var(--color-rose-deep)]"
      >
        Supprimer
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/60 backdrop-blur-sm p-6"
          onClick={() => !isPending && setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-sm rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-cream)] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2">Supprimer cette commande ?</h3>
            <p className="text-sm text-[var(--color-ink-dim)] mb-5 leading-relaxed">
              Les cartes et leurs liens seront définitivement supprimés. Cette
              action est irréversible.
            </p>
            {error && (
              <p className="text-sm text-[var(--color-rose-deep)] mb-3">{error}</p>
            )}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={isPending}
                className="btn-primary text-sm disabled:opacity-60 disabled:cursor-wait"
              >
                {isPending ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
