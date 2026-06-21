"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createCheckoutForScratch, redeemGiftCode } from "@/lib/checkout";

/**
 * Lance le paiement Stripe pour la carte donnée et redirige vers l'URL
 * Stripe. Si la carte est déjà payée, redirige directement vers la page
 * "merci". La logique de session vit dans `@/lib/checkout`.
 */
export async function payScratchAction(code: string) {
  const scratch = await db.scratch.findUnique({
    where: { code },
    select: { status: true },
  });
  if (!scratch) throw new Error("Carte introuvable.");
  if (scratch.status === "PAID") {
    redirect(`/creer/merci/${code}`);
  }
  redirect(await createCheckoutForScratch(code));
}

/**
 * Débloque une carte gratuitement avec un code cadeau à usage unique.
 * Consomme le code (atomique) puis redirige vers la page "merci".
 */
export async function redeemGiftCodeAction(
  scratchCode: string,
  rawGiftCode: string
) {
  const scratch = await db.scratch.findUnique({
    where: { code: scratchCode },
    select: { status: true },
  });
  if (!scratch) throw new Error("Carte introuvable.");
  if (scratch.status === "PAID") {
    redirect(`/creer/merci/${scratchCode}`);
  }
  await redeemGiftCode(scratchCode, rawGiftCode);
  redirect(`/creer/merci/${scratchCode}`);
}
