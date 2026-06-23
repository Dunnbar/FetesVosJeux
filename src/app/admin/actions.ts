"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { stripe, assertStripeReady } from "@/lib/stripe";

/**
 * Rembourse une commande via Stripe et passe ses cartes en REFUNDED.
 * `leadCode` = code de la carte qui porte le paiement (et le payment_intent).
 * Pour une commande multi-formats, toutes les cartes du groupe sont marquées.
 */
export async function refundOrderAction(leadCode: string) {
  assertStripeReady();

  const lead = await db.scratch.findUnique({
    where: { code: leadCode },
    select: { stripePaymentIntentId: true, groupId: true, status: true },
  });
  if (!lead) throw new Error("Commande introuvable.");
  if (lead.status !== "PAID") {
    throw new Error("Seule une commande payée peut être remboursée.");
  }
  if (!lead.stripePaymentIntentId) {
    throw new Error("Pas de paiement Stripe associé (carte offerte ?).");
  }

  await stripe.refunds.create({
    payment_intent: lead.stripePaymentIntentId,
  });

  if (lead.groupId) {
    await db.scratch.updateMany({
      where: { groupId: lead.groupId },
      data: { status: "REFUNDED" },
    });
  } else {
    await db.scratch.update({
      where: { code: leadCode },
      data: { status: "REFUNDED" },
    });
  }

  revalidatePath("/admin");
}

/**
 * Supprime définitivement une commande (toutes ses cartes).
 * `leadCode` = code de la carte lead ; le groupe entier est supprimé.
 */
export async function deleteOrderAction(leadCode: string) {
  const lead = await db.scratch.findUnique({
    where: { code: leadCode },
    select: { groupId: true },
  });
  if (!lead) throw new Error("Commande introuvable.");

  if (lead.groupId) {
    await db.scratch.deleteMany({ where: { groupId: lead.groupId } });
  } else {
    await db.scratch.delete({ where: { code: leadCode } });
  }

  revalidatePath("/admin");
}
