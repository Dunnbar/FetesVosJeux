"use client";

import { useState } from "react";

/**
 * Affiche les liens partageables d'une commande (un par format), avec un
 * bouton « copier » et un lien d'ouverture.
 */
export function OrderLinks({
  links,
}: {
  links: { label: string; url: string }[];
}) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied((c) => (c === url ? null : c)), 1500);
    } catch {
      // clipboard indispo — l'utilisateur peut ouvrir le lien et copier l'URL.
    }
  }

  return (
    <div className="mt-1 space-y-1">
      {links.map((l) => (
        <div key={l.url} className="flex items-center gap-2 font-mono text-[0.65rem]">
          <a
            href={l.url}
            target="_blank"
            rel="noopener"
            className="text-[var(--color-rose-deep)] hover:underline"
          >
            {l.label} ↗
          </a>
          <button
            type="button"
            onClick={() => copy(l.url)}
            className="uppercase tracking-widest text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
          >
            {copied === l.url ? "copié ✓" : "copier"}
          </button>
        </div>
      ))}
    </div>
  );
}
