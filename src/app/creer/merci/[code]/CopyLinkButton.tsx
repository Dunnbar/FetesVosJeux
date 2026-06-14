"use client";

import { useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      // Reset l'état au bout de 2s
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // navigator.clipboard peut échouer en contexte non-HTTPS ou refus user.
      // Fallback minimal : on sélectionne l'URL pour copie manuelle.
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* tant pis */
      }
      document.body.removeChild(input);
    }
  }

  return (
    <button type="button" onClick={handleCopy} className="btn-primary">
      {copied ? "Copié ✓" : "Copier le lien"}
    </button>
  );
}
