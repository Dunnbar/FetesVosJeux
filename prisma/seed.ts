import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * Cartes demo accessibles publiquement :
 *   /g/DEMOSCRATCH    — mécanique scratch (gratter)
 *   /g/DEMOPOLAROID   — mécanique polaroid
 *   /g/DEMOENVELOPPE  — mécanique envelope
 *
 * Toutes utilisent la même cover image (paysage Picsum) et la même
 * annonce mariage Guillemette & Dimitri, pour qu'on puisse comparer
 * les mécaniques.
 */
const baseAnnonce = {
  coverImagePath: "/uploads/demo-cover.jpg",
  annonceMode: "text" as const,
  annonceTemplate: "mariage",
  annonceTitle: "Margaux & Antoine",
  annonceSubtitle: "se marient",
  annonceBody:
    "Le 14 septembre 2026 à Étretat — Save the date, plus d'infos très bientôt",
  buyerName: "Demo",
  buyerEmail: "demo@example.com",
  // Démos = produit complet : on active toutes les options pour montrer
  // l'expérience maxi (feux + son). 5 € base + 2 × 1 € addon = 700 cents.
  withFireworks: true,
  withSound: true,
  amountCents: 700,
  status: "PAID" as const,
};

const demos = [
  { code: "DEMOSCRATCH", revealMechanic: "scratch", ...baseAnnonce },
  { code: "DEMOPOLAROID", revealMechanic: "polaroid", ...baseAnnonce },
  { code: "DEMOENVELOPPE", revealMechanic: "envelope", ...baseAnnonce },
  // Legacy : l'ancien code DEMO123456 reste accessible (scratch)
  { code: "DEMO123456", revealMechanic: "scratch", ...baseAnnonce },
];

async function main() {
  for (const demo of demos) {
    const result = await db.scratch.upsert({
      where: { code: demo.code },
      update: demo,
      create: demo,
    });
    console.log(`✔ ${result.revealMechanic.padEnd(10)} /g/${result.code}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
