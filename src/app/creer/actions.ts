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
export async function createScratchAction(formData: FormData) {
  // 1. Validation des champs texte
  const revealMechanic = String(formData.get("revealMechanic") ?? "scratch");
  const validMechanics = ["scratch", "polaroid", "envelope"];
  const safeMechanic = validMechanics.includes(revealMechanic)
    ? revealMechanic
    : "scratch";

  const template = String(formData.get("template") ?? "mariage");
  const title = stringField(formData, "title");
  const subtitle = stringField(formData, "subtitle");
  const body = stringField(formData, "body");
  const buyerEmail = stringField(formData, "buyerEmail");
  const giftCode = stringField(formData, "giftCode")?.toUpperCase() ?? null;

  // Options payantes — checkbox values arrivent en tant que "on" / absent.
  const withFireworks = formData.get("withFireworks") === "on";
  const withSound = formData.get("withSound") === "on";
  const amountCents = computeAmountCents({ withFireworks, withSound });

  // Cadrage de la cover (éditeur "déplacer/zoomer"), avec garde-fous.
  const coverPosX = clampNum(formData.get("coverPosX"), 0, 1, 0.5);
  const coverPosY = clampNum(formData.get("coverPosY"), 0, 1, 0.5);
  const coverZoom = clampNum(formData.get("coverZoom"), 1, 3, 1);

  if (!title) {
    throw new Error("Le titre de l'annonce est requis.");
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

  // 2. Upload du fichier de couverture
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

  // Upload via le module storage — Vercel Blob en prod, fs local en dev.
  // L'URL retournée est directement utilisable en <img src>.
  const { url: coverImagePath } = await uploadCoverImage(file, slug, ext);

  // 3. Génère un code unique
  const code = await generateUniqueCode(async (candidate) => {
    const found = await db.scratch.findUnique({
      where: { code: candidate },
      select: { code: true },
    });
    return found !== null;
  });

  // 4. Insertion en base, status PENDING (paiement Stripe à venir)
  await db.scratch.create({
    data: {
      code,
      revealMechanic: safeMechanic,
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
      amountCents,
      status: "PENDING",
    },
  });

  // 5. Finalisation directe (plus de page d'aperçu intermédiaire — l'aperçu
  // est déjà dans le formulaire) :
  //   - code cadeau saisi  → on débloque gratuitement et on file vers "merci"
  //   - sinon              → paiement Stripe
  // La page /creer/[code]/preview ne sert plus que de reprise si le paiement
  // Stripe est annulé (cancel_url).
  if (giftCode) {
    await redeemGiftCode(code, giftCode);
    redirect(`/creer/merci/${code}`);
  }
  redirect(await createCheckoutForScratch(code));
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
