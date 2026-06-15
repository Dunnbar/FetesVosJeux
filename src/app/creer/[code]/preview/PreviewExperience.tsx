"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { RevealCard } from "@/components/reveals/RevealCard";
import { Fireworks } from "@/components/Fireworks";
import { payScratchAction } from "./actions";
import { formatPrice } from "@/lib/format";
import { playRevealSound } from "@/lib/sound";

interface PreviewExperienceProps {
  code: string;
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

export function PreviewExperience({
  code,
  revealMechanic,
  coverImagePath,
  annonceMode,
  annonceTemplate,
  annonceTitle,
  annonceSubtitle,
  annonceBody,
  annonceImagePath,
  withFireworks,
  withSound,
  amountCents,
  canceled,
}: PreviewExperienceProps) {
  const [revealed, setRevealed] = useState(false);
  const soundPlayedRef = useRef(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleReveal = () => {
    setRevealed(true);
    if (withSound && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      playRevealSound();
    }
  };

  const [canvasSize, setCanvasSize] = useState(450);
  useEffect(() => {
    setCanvasSize(Math.min(450, window.innerWidth - 48));
  }, []);

  const coverSrc = toPublicUrl(coverImagePath);
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

  return (
    <>
      <main className="flex-1 flex flex-col items-center px-6 py-12 sm:py-16 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-8 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] mb-3">
            ◆ Ton aperçu
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Teste ta carte avant
            <span className="text-[var(--color-gold)]"> de l&apos;envoyer</span>.
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

        {/* La carte elle-même — le user peut interagir, tester sa mécanique */}
        <div className="relative mb-12">
          <RevealCard
            mechanic={revealMechanic}
            coverImageSrc={coverSrc}
            annonceMode={annonceMode === "image" ? "image" : "text"}
            annonceTemplate={annonceTemplate}
            annonceTitle={annonceTitle}
            annonceSubtitle={annonceSubtitle}
            annonceBody={annonceBody}
            annonceImageSrc={annonceImgSrc}
            onReveal={handleReveal}
            size={canvasSize}
          />
        </div>

        {/* Indication de scratch sous la carte */}
        {!revealed && (
          <p className="mb-12 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-night-text-dim)]">
            ▸ Vas-y, teste — c&apos;est qu&apos;un aperçu
          </p>
        )}

        {/* Bloc paiement */}
        <div className="w-full max-w-md bg-[var(--color-night-2)] border-2 border-[var(--color-edge-night)] rounded-2xl p-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] mb-3">
            ▸ Étape finale
          </p>
          <h2 className="text-xl font-bold mb-3">
            Génère ton lien à partager
          </h2>
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
        </div>
      </main>

      {/* Feux d'artifice — seulement si l'utilisateur a coché l'option payante.
          Permet à l'utilisateur de "tester" exactement ce qu'aura le destinataire. */}
      <Fireworks active={revealed && withFireworks} />
    </>
  );
}

function toPublicUrl(value: string): string {
  if (/^https?:\/\//.test(value)) return value;
  if (value.startsWith("/")) return value;
  return `/${value}`;
}
