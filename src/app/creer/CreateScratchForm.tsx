"use client";

import { useState, useTransition } from "react";
import {
  ANNONCE_TEMPLATES,
  AnnonceCard,
  type AnnonceTemplate,
} from "@/components/AnnonceCard";
import {
  REVEAL_MECHANICS,
  REVEAL_MECHANIC_KEYS,
  type RevealMechanic,
} from "@/components/reveals/types";
import {
  BASE_AMOUNT_CENTS,
  ADDONS,
  computeAmountCents,
  bundleDiscountCents,
} from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { createScratchAction } from "./actions";

const TEMPLATE_KEYS = Object.keys(ANNONCE_TEMPLATES) as AnnonceTemplate[];

const MAX_SIZE_MB = 10;

/** Limites de caractères par champ — évite que l'annonce déborde de la carte. */
const FIELD_LIMITS = { title: 50, subtitle: 60, body: 140 } as const;

export function CreateScratchForm() {
  const [revealMechanic, setRevealMechanic] = useState<RevealMechanic>("scratch");
  const [template, setTemplate] = useState<AnnonceTemplate>("mariage");
  // Contenu contrôlé pour alimenter l'aperçu en direct.
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  // Aperçu en popup sur mobile (sur desktop il est toujours visible à côté).
  const [showPreview, setShowPreview] = useState(false);
  const [withFireworks, setWithFireworks] = useState(false);
  const [withSound, setWithSound] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const config = ANNONCE_TEMPLATES[template];
  const totalCents = computeAmountCents({ withFireworks, withSound });
  const discountCents = bundleDiscountCents({ withFireworks, withSound });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) {
      setCoverPreview(null);
      setCoverFileName(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Sélectionne une image (JPG, PNG, WebP…).");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`L'image dépasse ${MAX_SIZE_MB} Mo.`);
      e.target.value = "";
      return;
    }
    setCoverPreview(URL.createObjectURL(file));
    setCoverFileName(file.name);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createScratchAction(form);
        // redirect() côté server lèvera une NEXT_REDIRECT qui sera gérée par
        // Next ; le code après le throw ne s'exécute pas. On garde quand même
        // un try/catch pour afficher les erreurs métier (validation, etc.).
      } catch (err) {
        // Les erreurs "NEXT_REDIRECT" ne sont PAS de vraies erreurs — laisser
        // Next les rethrow pour qu'elles déclenchent la navigation.
        if (
          err &&
          typeof err === "object" &&
          "digest" in err &&
          String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
        ) {
          throw err;
        }
        setErrorMsg(
          err instanceof Error ? err.message : "Une erreur est survenue."
        );
      }
    });
  }

  return (
    <>
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 lg:items-start">
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* ============ 1. Type de carte (mécanique de révélation) ============ */}
      <section>
        <h2 className="text-xl font-bold mb-2">1. Le type de carte</h2>
        <p className="text-sm text-[var(--color-ink-dim)] mb-4">
          Comment la personne va découvrir ton annonce.
        </p>

        <input type="hidden" name="revealMechanic" value={revealMechanic} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {REVEAL_MECHANIC_KEYS.map((key) => {
            const m = REVEAL_MECHANICS[key];
            const selected = key === revealMechanic;
            return (
              <div key={key} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setRevealMechanic(key)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    selected
                      ? "border-[var(--color-rose-deep)] bg-[var(--color-cream-2)] shadow-[4px_4px_0_0_var(--color-gold)]"
                      : "border-[var(--color-edge)] bg-[var(--color-cream-2)] hover:border-[var(--color-rose-deep)]/40"
                  }`}
                >
                  <div className="text-3xl mb-2">{m.emoji}</div>
                  <div className="text-sm font-bold">{m.label}</div>
                </button>
                <a
                  href={`/g/${m.demoCode}`}
                  target="_blank"
                  rel="noopener"
                  className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-center mt-2 text-[var(--color-ink-dim)] hover:text-[var(--color-rose-deep)] underline underline-offset-2 decoration-1"
                >
                  Voir la démo ↗
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ 2. Upload de l'image cover ============ */}
      <section>
        <h2 className="text-xl font-bold mb-2">2. La photo</h2>
        <p className="text-sm text-[var(--color-ink-dim)] mb-4">
          JPG, PNG ou WebP — max {MAX_SIZE_MB} Mo.
        </p>

        <label
          htmlFor="coverFile"
          className="block cursor-pointer relative rounded-2xl border-2 border-dashed border-[var(--color-edge)] bg-[var(--color-cream-2)] hover:border-[var(--color-rose-deep)] transition-colors p-6"
        >
          <input
            id="coverFile"
            name="coverFile"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required
            onChange={handleFileChange}
            className="sr-only"
          />
          {coverPreview ? (
            <div className="flex items-center gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverPreview}
                alt="Aperçu"
                className="w-32 h-32 object-cover rounded-lg border-2 border-[var(--color-ink)]"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate">{coverFileName}</p>
                <p className="text-xs text-[var(--color-ink-dim)] mt-1">
                  Clique à nouveau pour changer
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🖼️</p>
              <p className="font-bold">Clique pour choisir une photo</p>
            </div>
          )}
        </label>
      </section>

      {/* ============ 3. Choix du template ============ */}
      <section>
        <h2 className="text-xl font-bold mb-4">3. Le type d&apos;annonce</h2>

        <input type="hidden" name="template" value={template} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TEMPLATE_KEYS.map((key) => {
            const t = ANNONCE_TEMPLATES[key];
            const selected = key === template;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTemplate(key)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  selected
                    ? "border-[var(--color-rose-deep)] bg-[var(--color-cream-2)] shadow-[4px_4px_0_0_var(--color-gold)]"
                    : "border-[var(--color-edge)] bg-[var(--color-cream-2)] hover:border-[var(--color-rose-deep)]/40"
                }`}
              >
                <div className="text-3xl mb-2">{t.emoji}</div>
                <div className="text-sm font-bold">{t.label}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============ 4. Champs texte (adaptés au template) ============ */}
      <section>
        <h2 className="text-xl font-bold mb-4">4. Le contenu</h2>

        <div className="space-y-4">
          <Field
            label={config.fieldLabels.title}
            name="title"
            placeholder={config.placeholders.title}
            value={title}
            onChange={setTitle}
            maxLength={FIELD_LIMITS.title}
            required
          />
          <Field
            label={config.fieldLabels.subtitle}
            name="subtitle"
            placeholder={config.placeholders.subtitle}
            value={subtitle}
            onChange={setSubtitle}
            maxLength={FIELD_LIMITS.subtitle}
          />
          <Field
            label={config.fieldLabels.body}
            name="body"
            placeholder={config.placeholders.body}
            value={body}
            onChange={setBody}
            maxLength={FIELD_LIMITS.body}
            showCount
            multiline
          />
        </div>
      </section>

      {/* ============ 5. Options payantes ============ */}
      <section>
        <h2 className="text-xl font-bold mb-2">5. Les petits plus</h2>
        <p className="text-sm text-[var(--color-ink-dim)] mb-4">
          Ajoute des effets pour rendre la révélation encore plus festive.
          Optionnel.
        </p>

        <div className="space-y-3">
          <AddonToggle
            name="withFireworks"
            checked={withFireworks}
            onChange={setWithFireworks}
            emoji={ADDONS.fireworks.emoji}
            label={ADDONS.fireworks.label}
            description={ADDONS.fireworks.description}
            priceCents={ADDONS.fireworks.cents}
          />
          <AddonToggle
            name="withSound"
            checked={withSound}
            onChange={setWithSound}
            emoji={ADDONS.sound.emoji}
            label={ADDONS.sound.label}
            description={ADDONS.sound.description}
            priceCents={ADDONS.sound.cents}
          />
        </div>
      </section>

      {/* ============ 6. Email du destinataire (toi) ============ */}
      <section>
        <h2 className="text-xl font-bold mb-2">6. Ton email</h2>
        <p className="text-sm text-[var(--color-ink-dim)] mb-4">
          Pour recevoir le lien par mail. Facultatif.
        </p>

        <Field
          label="Adresse email"
          name="buyerEmail"
          type="email"
          placeholder="toi@exemple.fr"
        />
      </section>

      {/* ============ Erreurs + Submit ============ */}
      {errorMsg && (
        <div className="p-4 rounded-xl border-2 border-[var(--color-rose-deep)] bg-[var(--color-cream-2)] text-[var(--color-rose-deep)] font-bold">
          {errorMsg}
        </div>
      )}

      {/* Récapitulatif prix + bouton submit, dans une card mise en avant */}
      <div className="bg-[var(--color-cream-2)] border-2 border-[var(--color-edge)] rounded-2xl p-6">
        <div className="flex items-baseline justify-between mb-4 gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-ink-dim)]">
              ▸ Total à payer
            </span>
            <span className="text-3xl font-bold">
              {formatPrice(totalCents)}
            </span>
          </div>
          <div className="text-xs text-[var(--color-ink-dim)] text-right">
            <div>Base : {formatPrice(BASE_AMOUNT_CENTS)}</div>
            {withFireworks && (
              <div>
                + {ADDONS.fireworks.label} :{" "}
                {formatPrice(ADDONS.fireworks.cents)}
              </div>
            )}
            {withSound && (
              <div>
                + {ADDONS.sound.label} : {formatPrice(ADDONS.sound.cents)}
              </div>
            )}
            {discountCents > 0 && (
              <div className="text-[var(--color-gold)]">
                Offre 2 options : − {formatPrice(discountCents)}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-wait"
        >
          {isPending ? "Création..." : "Créer ma carte ▸"}
        </button>
        <p className="mt-3 text-xs text-[var(--color-ink-dim)] text-center">
          Tu pourras tester ta carte avant de payer.
        </p>
      </div>
    </form>

      {/* Aperçu en direct — colonne de droite sur desktop, sticky au scroll. */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-ink-dim)] mb-3">
            ▸ Aperçu en direct
          </p>
          <LivePreview
            template={template}
            title={title}
            subtitle={subtitle}
            body={body}
            coverPreview={coverPreview}
          />
          <p className="text-xs text-[var(--color-ink-dim)] text-center mt-3 leading-relaxed">
            L&apos;annonce une fois révélée. Le destinataire la découvre après
            avoir gratté ta photo.
          </p>
        </div>
      </aside>
    </div>

    {/* Mobile : bouton flottant + popup d'aperçu. */}
    <button
      type="button"
      onClick={() => setShowPreview(true)}
      className="lg:hidden fixed bottom-5 right-5 z-40 btn-primary rounded-full shadow-lg"
    >
      👁 Aperçu
    </button>

    {showPreview && (
      <div
        className="lg:hidden fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/70 backdrop-blur-sm p-6"
        onClick={() => setShowPreview(false)}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-cream)] mb-3 text-center">
            ▸ Aperçu en direct
          </p>
          <LivePreview
            template={template}
            title={title}
            subtitle={subtitle}
            body={body}
            coverPreview={coverPreview}
          />
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="mt-5 btn-primary w-full justify-center"
          >
            Continuer l&apos;édition
          </button>
        </div>
      </div>
    )}
    </>
  );
}

/**
 * Aperçu en direct, alimenté par les champs du form. Toggle recto/verso :
 *   - « Photo »   : la couverture grattable (ce que le destinataire voit d'abord)
 *   - « Annonce » : l'annonce révélée en dessous
 */
function LivePreview({
  template,
  title,
  subtitle,
  body,
  coverPreview,
}: {
  template: AnnonceTemplate;
  title: string;
  subtitle: string;
  body: string;
  coverPreview: string | null;
}) {
  const [face, setFace] = useState<"photo" | "annonce">("annonce");
  return (
    <div>
      {/* Toggle recto / verso */}
      <div className="flex w-fit mx-auto mb-3 p-1 gap-1 rounded-full bg-[var(--color-cream-2)] border-2 border-[var(--color-edge)]">
        {(
          [
            ["photo", "Photo"],
            ["annonce", "Annonce"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFace(key)}
            className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest transition-colors ${
              face === key
                ? "bg-[var(--color-rose-deep)] text-[var(--color-cream)]"
                : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-[340px] aspect-square mx-auto rounded-2xl overflow-hidden border-2 border-[var(--color-ink)] shadow-[6px_6px_0_0_var(--color-gold)]">
        {face === "annonce" ? (
          <AnnonceCard
            mode="text"
            template={template}
            title={title || null}
            subtitle={subtitle || null}
            body={body || null}
          />
        ) : coverPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverPreview}
            alt="Aperçu de la photo"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[var(--color-cream-2)] text-[var(--color-ink-dim)]">
            <span className="text-4xl">🖼️</span>
            <span className="text-sm font-bold">Ta photo ici</span>
          </div>
        )}
      </div>
    </div>
  );
}

/** Toggle visuel pour une option payante (feux d'artifice, son…). */
function AddonToggle({
  name,
  checked,
  onChange,
  emoji,
  label,
  description,
  priceCents,
}: {
  name: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  emoji: string;
  label: string;
  description: string;
  priceCents: number;
}) {
  return (
    <label
      className={`flex gap-4 items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
        checked
          ? "border-[var(--color-rose-deep)] bg-[var(--color-cream-2)] shadow-[3px_3px_0_0_var(--color-gold)]"
          : "border-[var(--color-edge)] bg-[var(--color-cream-2)] hover:border-[var(--color-rose-deep)]/40"
      }`}
    >
      {/* Checkbox cachée mais accessible — c'est elle qui finit dans FormData
          sous la clé `name`. */}
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div className="text-3xl shrink-0">{emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-bold">{label}</span>
          <span className="font-mono text-sm text-[var(--color-rose-deep)] whitespace-nowrap">
            +{formatPrice(priceCents)}
          </span>
        </div>
        <p className="text-sm text-[var(--color-ink-dim)] mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      {/* Indicateur visuel d'état (faux toggle) */}
      <div
        className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 transition-colors ${
          checked
            ? "bg-[var(--color-rose-deep)] border-[var(--color-rose-deep)]"
            : "border-[var(--color-ink-dim)]/40"
        }`}
        aria-hidden
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            className="w-full h-full p-1"
          >
            <polyline points="5 12 10 17 19 8" />
          </svg>
        )}
      </div>
    </label>
  );
}

/** Champ texte stylisé, optionnellement multiligne et/ou contrôlé. */
function Field({
  label,
  name,
  placeholder,
  required,
  type = "text",
  multiline,
  value,
  onChange,
  maxLength,
  showCount,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  multiline?: boolean;
  value?: string;
  onChange?: (v: string) => void;
  maxLength?: number;
  showCount?: boolean;
}) {
  const id = `field-${name}`;
  const sharedClasses =
    "block w-full px-4 py-3 bg-[var(--color-cream-2)] border-2 border-[var(--color-edge)] rounded-xl text-[var(--color-ink)] placeholder:text-[var(--color-ink-dim)] focus:outline-none focus:border-[var(--color-rose-deep)] transition-colors";
  // Un champ est contrôlé dès qu'on lui passe value + onChange.
  const controlled =
    value !== undefined && onChange !== undefined
      ? {
          value,
          onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) =>
            onChange(
              maxLength !== undefined
                ? e.target.value.slice(0, maxLength)
                : e.target.value
            ),
        }
      : {};
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label htmlFor={id} className="block text-sm font-bold">
          {label}
          {required && (
            <span className="text-[var(--color-rose-deep)] ml-1">*</span>
          )}
        </label>
        {showCount && maxLength !== undefined && (
          <span className="font-mono text-xs text-[var(--color-ink-dim)]">
            {(value ?? "").length}/{maxLength}
          </span>
        )}
      </div>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          rows={3}
          className={sharedClasses}
          {...controlled}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={sharedClasses}
          {...controlled}
        />
      )}
    </div>
  );
}
