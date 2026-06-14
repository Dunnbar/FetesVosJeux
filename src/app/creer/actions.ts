"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { generateUniqueCode, generateFileSlug } from "@/lib/codes";
import { sendScratchLinkEmail } from "@/lib/email";
import { uploadCoverImage } from "@/lib/storage";

/**
 * Server action : crée une carte à gratter à partir des données du formulaire.
 *
 * NOTE v1 — Pas de paiement Stripe pour cette itération : on insère
 * directement la Scratch en `status = "PAID"`. Le webhook Stripe sera
 * ajouté juste après pour que ce passage se fasse uniquement sur paiement
 * confirmé (alors `status = "PENDING"` à la création).
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

  if (!title) {
    throw new Error("Le titre de l'annonce est requis.");
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

  // 4. Insertion en base
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
      // v1 : paiement bypassé — Stripe Checkout viendra dans un prochain coup.
      status: "PAID",
    },
  });

  // 5. Envoi de l'email avec le lien (si email fourni).
  // Volontairement non bloquant : si Resend échoue (clé invalide, réseau,
  // domaine non vérifié…), la carte est quand même créée et l'utilisateur
  // récupère son lien sur la page de remerciement.
  let emailSent = false;
  if (buyerEmail) {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const result = await sendScratchLinkEmail({
      to: buyerEmail,
      code,
      shareUrl: `${siteUrl}/g/${code}`,
      annonceTitle: title,
    });
    if (result.sent) {
      emailSent = true;
    } else {
      console.warn(
        `[email] envoi échoué pour ${buyerEmail} (${result.reason})${
          "error" in result && result.error ? `: ${result.error}` : ""
        }`
      );
    }
  }

  // 6. Redirige vers la page de remerciement, en signalant l'état de l'email
  // via un query param pour qu'on puisse afficher un message rassurant.
  redirect(`/creer/merci/${code}${emailSent ? "?email=sent" : ""}`);
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
