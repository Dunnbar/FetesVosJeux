"use client";

import { useState, useTransition } from "react";
import { refundOrderAction } from "./actions";

export function RefundButton({ leadCode }: { leadCode: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleRefund() {
    if (
      !window.confirm(
        "Rembourser cette commande via Stripe ? Action irréversible."
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await refundOrderAction(leadCode);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Échec du remboursement.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleRefund}
        disabled={isPending}
        className="font-mono text-[0.7rem] uppercase tracking-widest text-[var(--color-rose-deep)] hover:underline disabled:opacity-50"
      >
        {isPending ? "..." : "Rembourser"}
      </button>
      {error && <span className="text-[0.65rem] text-[var(--color-rose-deep)]">{error}</span>}
    </div>
  );
}
