"use client";

import { useState } from "react";

/** Affiche un code en monospace, cliquable pour le copier dans le presse-papier. */
export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponible
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copier"
      className="font-mono font-bold tracking-wider hover:text-[var(--color-rose-deep)] transition-colors"
    >
      {code} {copied ? "✓" : "⧉"}
    </button>
  );
}
