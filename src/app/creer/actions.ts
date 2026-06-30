"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { generateUniqueCode, generateFileSlug } from "@/lib/codes";
import { uploadCoverImage } from "@/lib/storage";
import { computeAmountCents } from "@/lib/pricing";
import { createCheckoutForScratch, redeemGiftCode } from "@/lib/checkout";

/**
 * Server action : crée une carte à gratter à partir des données du formulaire.
 *
 * Status initial = "PENDING". La carte n'est PAS encore accessible
 * publiquement via /g/[code] (qui filtre sur PAID). L'utilisateur est
 * redirigé vers une page d'aperçu où il peut tester son rendu, puis
 * cliquer pour payer via Stripe. C'est le webhook Stripe qui passera
 * la carte à PAID + enverra l'email avec le lien.
 */
const VALID_MECHANICS = ["scratch", "polaroid", "envelope"];

export async function createScratchAction(formData: FormData) {
  // 1. Formats choisis (1 à 3 mécaniques). Chaque format = une carte/lien.
  const rawMechanics = formData.getAll("mechanics").map(String);
  let mechanics = [...new Set(rawMechanics)].filter((m) =>
    VALID_MECHANICS.includes(m)
  );
  if (mechanics.length === 0) mechanics = ["scratch"];
  mechanics = mechanics.slice(0, 3);

  const template = String(formData.get("template") ?? "mariage");
  const title = stringField(formData, "title");
  const subtitle = stringField(formData, "subtitle");
  const body = stringField(formData, "body");
  const buyerEmail = stringField(formData, "buyerEmail");
  const giftCode = stringField(formData, "giftCode")?.toUpperCase() ?? null;

  // Feux d'artifice = option payante. Son = inclus (case cochée par défaut
  // côté form) ; décochée → absent du FormData → false.
  const withFireworks = formData.get("withFireworks") === "on";
  const withSound = formData.get("withSound") === "on";

  // Cadrage de la cover (éditeur "déplacer/zoomer"), avec garde-fous.
  const coverPosX = clampNum(formData.get("coverPosX"), 0, 1, 0.5);
  const coverPosY = clampNum(formData.get("coverPosY"), 0, 1, 0.5);
  const coverZoom = clampNum(formData.get("coverZoom"), 1, 3, 1);
  // Ticket : on gratte le texte pour révéler la photo (sens inversé).
  const scratchTextOnTop = formData.get("scratchTextOnTop") === "on";

  if (!title) {
    throw new Error("Le titre de l'annonce est requis.");
  }

  if (!buyerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
    throw new Error("Une adresse email valide est requise.");
  }

  // Si un code cadeau est saisi, on le valide AVANT de créer la carte / uploader
  // l'image — évite de laisser une carte orpheline en cas de code erroné. La
  // consommation atomique réelle se fait juste après la création (redeemGiftCode).
  if (giftCode) {
    const promo = await db.promoCode.findUnique({
      where: { code: giftCode },
      select: { used: true },
    });
    if (!promo || promo.used) {
      throw new Error("Code cadeau invalide ou déjà utilisé.");
    }
  }

  // 2. Upload du fichier de couverture (une seule fois, partagé par tous les formats).
  const file = formData.get("coverFile");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Une image de couverture est requise.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier doit être une image.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("L'image dépasse la limite de 10 Mo.");
  }

  const ext = extensionFromMime(file.type);
  const slug = generateFileSlug();
  const { url: coverImagePath } = await uploadCoverImage(file, slug, ext);

  // Contenu commun à toutes les cartes de la commande (seule la mécanique change).
  const sharedData = {
    coverImagePath,
    annonceMode: "text",
    annonceTemplate: template,
    annonceTitle: title,
    annonceSubtitle: subtitle ?? null,
    annonceBody: body ?? null,
    buyerEmail: buyerEmail ?? null,
    withFireworks,
    withSound,
    coverPosX,
    coverPosY,
    coverZoom,
    scratchTextOnTop,
  };

  const newCode = () =>
    generateUniqueCode(async (candidate) => {
      const found = await db.scratch.findUnique({
        where: { code: candidate },
        select: { code: true },
      });
      return found !== null;
    });

  // 3a. Code cadeau → une seule carte offerte (premier format), pas de Stripe.
  if (giftCode) {
    const code = await newCode();
    await db.scratch.create({
      data: { ...sharedData, code, revealMechanic: mechanics[0], amountCents: 0, status: "PENDING" },
    });
    await redeemGiftCode(code, giftCode);
    redirect(`/creer/merci/${code}`);
  }

  const total = computeAmountCents({
    formatCount: mechanics.length,
    withFireworks,
  });

  // 3b. Un seul format → une carte, comportement historique.
  if (mechanics.length === 1) {
    const code = await newCode();
    await db.scratch.create({
      data: { ...sharedData, code, revealMechanic: mechanics[0], amountCents: total, status: "PENDING" },
    });
    redirect(await createCheckoutForScratch(code));
  }

  // 3c. Plusieurs formats → N cartes liées par groupId, payées ensemble.
  // La carte "lead" (1er format) porte le montant total et sert au checkout.
  const groupId = await newCode();
  let leadCode = "";
  for (let i = 0; i < mechanics.length; i++) {
    const code = await newCode();
    if (i === 0) leadCode = code;
    await db.scratch.create({
      data: {
        ...sharedData,
        code,
        revealMechanic: mechanics[i],
        groupId,
        amountCents: i === 0 ? total : 0,
        status: "PENDING",
      },
    });
  }
  redirect(await createCheckoutForScratch(leadCode));
}

/** Parse un nombre depuis FormData, borné à [min, max], avec valeur par défaut. */
function clampNum(
  v: FormDataEntryValue | null,
  min: number,
  max: number,
  fallback: number
): number {
  const n = typeof v === "string" ? parseFloat(v) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** Extrait une chaîne non vide d'un FormData, ou null. */
function stringField(form: FormData, key: string): string | null {
  const v = form.get(key);
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Mappe un mime image vers une extension. */
function extensionFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}
