"use client";

import { useState, useTransition } from "react";
import { AnnonceCard } from "@/components/AnnonceCard";
import { payScratchAction, redeemGiftCodeAction } from "./actions";
import { formatPrice } from "@/lib/format";

interface PreviewExperienceProps {
  code: string;
  // Reçus depuis la page mais plus utilisés ici (l'aperçu interactif est
  // désormais dans le formulaire) : on ne garde que le récap de l'annonce.
  revealMechanic: string;
  coverImagePath: string;
  annonceMode: string;
  annonceTemplate: string | null;
  annonceTitle: string | null;
  annonceSubtitle: string | null;
  annonceBody: string | null;
  annonceImagePath: string | null;
  withFireworks: boolean;
  withSound: boolean;
  amountCents: number;
  canceled: boolean;
}

/**
 * Page après création : plus de test interactif (l'aperçu live est dans le
 * formulaire). Ici on finalise — paiement Stripe ou code cadeau — avec un
 * récap statique de l'annonce. Sert aussi de page de reprise si le paiement
 * Stripe a été annulé.
 */
export function PreviewExperience({
  code,
  annonceMode,
  annonceTemplate,
  annonceTitle,
  annonceSubtitle,
  annonceBody,
  annonceImagePath,
  amountCents,
  canceled,
}: PreviewExperienceProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showGift, setShowGift] = useState(false);
  const [giftCode, setGiftCode] = useState("");
  const [isGiftPending, startGiftTransition] = useTransition();

  const annonceImgSrc = annonceImagePath ? toPublicUrl(annonceImagePath) : null;

  function handlePay() {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await payScratchAction(code);
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "digest" in err &&
          String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
        ) {
          throw err; // laisse Next gérer la redirection
        }
        setErrorMsg(
          err instanceof Error ? err.message : "Une erreur est survenue."
        );
      }
    });
  }

  function handleRedeem() {
    setErrorMsg(null);
    startGiftTransition(async () => {
      try {
        await redeemGiftCodeAction(code, giftCode);
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "digest" in err &&
          String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
        ) {
          throw err; // laisse Next gérer la redirection
        }
        setErrorMsg(
          err instanceof Error ? err.message : "Une erreur est survenue."
        );
      }
    });
  }

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-12 sm:py-16 relative z-10">
      {/* En-tête */}
      <div className="text-center mb-8 max-w-xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] mb-3">
          ◆ Dernière étape
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Plus qu&apos;à
          <span className="text-[var(--color-gold)]"> valider</span>.
        </h1>
      </div>

      {/* Bannière si paiement annulé */}
      {canceled && (
        <div className="mb-8 w-full max-w-md p-4 rounded-2xl border-2 border-[var(--color-gold)] bg-[var(--color-night-2)] text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] mb-1">
            ▸ Paiement annulé
          </p>
          <p className="text-sm text-[var(--color-night-text-dim)]">
            Tu peux réessayer quand tu veux — ta carte est toujours là.
          </p>
        </div>
      )}

      {/* Récap statique de l'annonce — ce que le destinataire découvrira */}
      <div className="relative w-full max-w-[260px] aspect-square mb-10 rounded-2xl overflow-hidden border-2 border-[var(--color-edge-night)] shadow-[6px_6px_0_0_var(--color-gold)]">
        <AnnonceCard
          mode={annonceMode === "image" ? "image" : "text"}
          template={annonceTemplate}
          title={annonceTitle}
          subtitle={annonceSubtitle}
          body={annonceBody}
          imageSrc={annonceImgSrc}
        />
      </div>

      {/* Bloc paiement */}
      <div className="w-full max-w-md bg-[var(--color-night-2)] border-2 border-[var(--color-edge-night)] rounded-2xl p-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] mb-3">
          ▸ Génère ton lien
        </p>
        <h2 className="text-xl font-bold mb-3">Ta carte est prête à partir</h2>
        <p className="text-sm text-[var(--color-night-text-dim)] leading-relaxed mb-5">
          Après paiement, tu reçois immédiatement un lien unique que tu peux
          envoyer où tu veux. Pas d&apos;expiration, pas de limite de partages.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl border border-[var(--color-rose-deep)] bg-[var(--color-rose-deep)]/10 text-[var(--color-rose)] text-sm">
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handlePay}
          disabled={isPending}
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-wait"
        >
          {isPending
            ? "Redirection vers Stripe…"
            : `Payer ${formatPrice(amountCents)} ▸`}
        </button>

        <p className="mt-4 text-xs text-[var(--color-night-text-dim)] text-center">
          Paiement sécurisé par Stripe — tu peux annuler à tout moment.
        </p>

        {/* Code cadeau — déblocage gratuit, sans passer par Stripe */}
        <div className="mt-5 pt-5 border-t border-[var(--color-edge-night)]">
          {!showGift ? (
            <button
              type="button"
              onClick={() => setShowGift(true)}
              className="w-full text-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-night-text-dim)] hover:text-[var(--color-gold)] transition-colors"
            >
              🎁 J&apos;ai un code cadeau
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <label
                htmlFor="giftCode"
                className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]"
              >
                ▸ Code cadeau
              </label>
              <div className="flex gap-2">
                <input
                  id="giftCode"
                  type="text"
                  value={giftCode}
                  onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                  placeholder="TON CODE"
                  autoCapitalize="characters"
                  autoComplete="off"
                  className="flex-1 min-w-0 rounded-xl border-2 border-[var(--color-edge-night)] bg-[var(--color-night)] px-4 py-3 font-mono uppercase tracking-widest text-[var(--color-night-text)] placeholder:text-[var(--color-night-text-dim)] focus:border-[var(--color-gold)] outline-none"
                />
                <button
                  type="button"
                  onClick={handleRedeem}
                  disabled={isGiftPending || giftCode.trim().length === 0}
                  className="btn-primary shrink-0 justify-center disabled:opacity-60 disabled:cursor-wait"
                >
                  {isGiftPending ? "…" : "Débloquer"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function toPublicUrl(value: string): string {
  if (/^https?:\/\//.test(value)) return value;
  if (value.startsWith("/")) return value;
  return `/${value}`;
}
