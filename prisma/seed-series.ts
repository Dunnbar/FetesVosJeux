import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * Les 13 cartes de démo des landings SEO.
 *
 * Ce ne sont PAS des données optionnelles : chaque page /idees/<slug> se
 * termine par « Voir la carte comme la recevront tes proches ▸ » vers
 * /g/<code>, et les 13 codes ci-dessous sont ceux de src/lib/occasions.ts
 * (champ `demo.code`). Sans ces lignes en base, les 13 pages statiques
 * finissent chacune sur un notFound() — invisible au build, invisible aussi
 * en monitoring puisque robots.txt bloque /g/. On s'en aperçoit par un
 * visiteur.
 *
 * C'est pour ça que ce fichier est chaîné au seed principal dans
 * package.json (`db:seed` ET la clé `prisma.seed`, celle qu'utilise
 * `prisma migrate reset`) : un `npm run db:reset` ou le provisionnement
 * d'une base de preview les recrée automatiquement.
 *
 * Elles servent aussi de source aux clips (réels TikTok/Insta) et répliquent
 * les champs DB de scripts/clips.config.mjs. Si tu changes un `code`, une
 * `image` ou un texte ICI, répercute-le dans occasions.ts ET clips.config.mjs.
 */
const common = {
  annonceMode: "text" as const,
  buyerName: "Demo",
  buyerEmail: "demo@example.com",
  withFireworks: true,
  withSound: true,
  amountCents: 700,
  status: "PAID" as const,
};

const clips = [
  {
    code: "DEMOREEL",
    revealMechanic: "scratch",
    coverImagePath: "/uploads/demo-fiancailles.jpg",
    scratchTextOnTop: false,
    annonceTemplate: "mariage",
    annonceTitle: "Margaux & Antoine",
    annonceSubtitle: "se marient",
    annonceBody: "Le 14 septembre 2026 à Étretat",
    ...common,
  },
  {
    code: "DEMONAISSANCE",
    revealMechanic: "polaroid",
    coverImagePath: "/uploads/demo-naissance.jpg",
    annonceTemplate: "naissance",
    annonceTitle: "Jules",
    annonceSubtitle: "est arrivé !",
    annonceBody: "Le 12 juin 2026 · 3,4 kg de bonheur",
    ...common,
  },
  {
    code: "DEMOANNIV",
    revealMechanic: "envelope",
    coverImagePath: "/uploads/demo-anniversaire.jpg",
    annonceTemplate: "anniversaire",
    annonceTitle: "Camille",
    annonceSubtitle: "fête ses 30 ans",
    annonceBody: "Samedi 5 juillet · 20h · chez Manu",
    ...common,
  },
  {
    code: "DEMOSTD",
    revealMechanic: "scratch",
    coverImagePath: "/uploads/demo-savethedate.jpg",
    scratchTextOnTop: false,
    annonceTemplate: "save-the-date",
    annonceTitle: "Sarah & Tom",
    annonceSubtitle: "vous invitent",
    annonceBody: "Réservez le 12 septembre 2026",
    ...common,
  },
  {
    code: "DEMOGROSSESSE",
    revealMechanic: "scratch",
    coverImagePath: "/uploads/demo-grossesse.jpg",
    scratchTextOnTop: false,
    annonceTemplate: "naissance",
    annonceTitle: "On attend un bébé",
    annonceSubtitle: "pour décembre 2026",
    annonceBody: "La famille s'agrandit 🤰",
    ...common,
  },
  {
    code: "DEMOGENDER",
    revealMechanic: "scratch",
    coverImagePath: "/uploads/demo-genderreveal.jpg",
    scratchTextOnTop: false,
    annonceTemplate: "save-the-date",
    annonceTitle: "C'est une fille !",
    annonceSubtitle: "🎀 rose dragée",
    annonceBody: "Baby Léa arrive en décembre 2026",
    ...common,
  },
  {
    code: "DEMOCREMA",
    revealMechanic: "envelope",
    coverImagePath: "/uploads/demo-cremaillere.jpg",
    annonceTemplate: "save-the-date",
    annonceTitle: "Crémaillère",
    annonceSubtitle: "chez Léa & Max",
    annonceBody: "Samedi 19 juillet · 19h · 12 rue des Lilas",
    ...common,
  },
  {
    code: "DEMOMARIAGEF",
    revealMechanic: "polaroid",
    coverImagePath: "/uploads/demo-mariage-femmes.jpg",
    annonceTemplate: "mariage",
    annonceTitle: "Julie & Emma",
    annonceSubtitle: "se marient",
    annonceBody: "Le 20 juin 2026 à Aix-en-Provence",
    ...common,
  },
  {
    code: "DEMOMARIAGEH",
    revealMechanic: "scratch",
    coverImagePath: "/uploads/demo-mariage-hommes.jpg",
    scratchTextOnTop: false,
    annonceTemplate: "mariage",
    annonceTitle: "Marc & Thomas",
    annonceSubtitle: "se marient",
    annonceBody: "Le 5 septembre 2026 à Lyon",
    ...common,
  },
  {
    code: "DEMOFIANCAILLES",
    revealMechanic: "polaroid",
    coverImagePath: "/uploads/demo-fiancailles-couple.jpg",
    annonceTemplate: "mariage",
    annonceTitle: "Chloé & Inès",
    annonceSubtitle: "se fiancent",
    annonceBody: "On fête ça le 14 février 2026",
    ...common,
  },
  {
    code: "DEMODIPLOME",
    revealMechanic: "scratch",
    coverImagePath: "/uploads/demo-diplome.jpg",
    scratchTextOnTop: false,
    annonceTemplate: "save-the-date",
    annonceTitle: "Léa est diplômée !",
    annonceSubtitle: "Master 2 validé 🎓",
    annonceBody: "On fête ça samedi soir · 20h",
    ...common,
  },
  {
    code: "DEMOBAPTEME",
    revealMechanic: "envelope",
    coverImagePath: "/uploads/demo-bapteme.jpg",
    annonceTemplate: "save-the-date",
    annonceTitle: "Baptême de Gabriel",
    annonceSubtitle: "vous êtes invités",
    annonceBody: "Dimanche 21 juin · 11h · Église St-Pierre",
    ...common,
  },
  {
    code: "DEMORETRAITE",
    revealMechanic: "envelope",
    coverImagePath: "/uploads/demo-retraite.jpg",
    annonceTemplate: "save-the-date",
    annonceTitle: "Pot de départ",
    annonceSubtitle: "Martine part en retraite",
    annonceBody: "Vendredi 27 juin · 18h · au bureau",
    ...common,
  },
];

async function main() {
  for (const c of clips) {
    const r = await db.scratch.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
    console.log(`✔ ${r.revealMechanic.padEnd(9)} /g/${r.code}`);
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
