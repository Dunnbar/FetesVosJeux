"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Affichage en attendant que le webhook Stripe ait fait passer la carte
 * en PAID. Polling léger : on refresh la page côté Next toutes les 1.5 s.
 * En pratique le webhook arrive en < 1 s, donc l'utilisateur voit ce
 * state une fraction de seconde, voire pas du tout.
 *
 * Garde-fou : si après ~30 s la carte est toujours PENDING (cas d'un
 * vrai souci côté Stripe ou webhook), on arrête le polling et on affiche
 * un message d'aide.
 */
export function PaymentPending({ code: _code }: { code: string }) {
  const router = useRouter();
  const startedAt = useRef(Date.now());
  const stoppedRef = useRef(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      // Au bout de 30 secondes, on arrête de polling — un truc cloche.
      if (Date.now() - startedAt.current > 30_000) {
        stoppedRef.current = true;
        window.clearInterval(interval);
        return;
      }
      router.refresh();
    }, 1500);

    return () => window.clearInterval(interval);
  }, [router]);

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold-deep)] mb-6">
          ◆ Paiement en cours
        </p>
        <div className="mx-auto mb-6 w-12 h-12 rounded-full border-2 border-[var(--color-edge)] border-t-[var(--color-rose-deep)] animate-spin" />
        <h1 className="text-2xl font-bold mb-3">
          On confirme avec Stripe…
        </h1>
        <p className="text-sm text-[var(--color-ink-dim)] leading-relaxed">
          Ça prend quelques secondes. La page se rafraîchit toute seule dès
          que ton lien est prêt.
        </p>
      </div>
    </main>
  );
}
