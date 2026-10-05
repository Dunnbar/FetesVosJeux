// Config partagée de la série de clips (source unique).
// Utilisée par le recorder (scripts/record-series.mjs) et le seed
// (prisma/seed-series.ts en réplique les champs DB).
//
// Chaque entrée = une RÉVÉLATION (occasion × mécanique × photo). L'interaction
// est enregistrée UNE fois puis réutilisée avec chaque accroche de `hooks` →
// une vidéo par accroche. Ajouter une accroche = +1 vidéo pour ~0 coût.
//
// Marque incrustée par le recorder : wordmark sur l'intro, watermark pendant
// l'interaction, écran de fin (marque + domaine). Voir BRAND ci-dessous.

export const BRAND = {
  name: "Qui s'y Gratte", // « Gratte » ressort en rose
  emoji: "🎟️",
  domain: "quisygratte.fr",
  tagline: "Les annonces qui font dire waouh.",
};

export const CLIPS = [
  {
    code: "DEMOREEL",
    slug: "mariage",
    mechanic: "scratch",
    image: "/uploads/demo-fiancailles.jpg",
    template: "mariage",
    title: "Margaux & Antoine",
    subtitle: "se marient",
    body: "Le 14 septembre 2026 à Étretat",
    kicker: "UNE CARTE À GRATTER",
    accent: "#ef9bb4", // rose
    hooks: [
      "La façon la plus stylée\nd'annoncer un mariage 💍",
      "Arrête les faire-part\nennuyeux 💍",
      "POV : ta meilleure amie\nt'annonce son mariage 💍",
    ],
  },
  {
    code: "DEMONAISSANCE",
    slug: "naissance",
    mechanic: "polaroid",
    image: "/uploads/demo-naissance.jpg",
    template: "naissance",
    title: "Jules",
    subtitle: "est arrivé !",
    body: "Le 12 juin 2026 · 3,4 kg de bonheur",
    kicker: "UN POLAROID À DÉVELOPPER",
    accent: "#b5dcc1", // menthe
    hooks: [
      "La plus belle façon\nd'annoncer une naissance 🍼",
      "Annonce bébé en mode\n« développe la photo » 📸",
      "Fais fondre toute\nla famille 👶",
    ],
  },
  {
    code: "DEMOANNIV",
    slug: "anniversaire",
    mechanic: "envelope",
    image: "/uploads/demo-anniversaire.jpg",
    template: "anniversaire",
    title: "Camille",
    subtitle: "fête ses 30 ans",
    body: "Samedi 5 juillet · 20h · chez Manu",
    kicker: "UNE ENVELOPPE À OUVRIR",
    accent: "#e8c547", // doré
    hooks: [
      "Invite tes proches\navec un peu plus de style 🎉",
      "Une invit' d'anniv'\nqu'on n'oublie pas 🎂",
      "Arrête les invitations\npar SMS 🎉",
    ],
  },
  {
    code: "DEMOSTD",
    slug: "save-the-date",
    mechanic: "scratch",
    image: "/uploads/demo-savethedate.jpg",
    template: "save-the-date",
    title: "Sarah & Tom",
    subtitle: "vous invitent",
    body: "Réservez le 12 septembre 2026",
    kicker: "UNE CARTE À GRATTER",
    accent: "#f2b594", // pêche
    hooks: [
      "Réserve la date\navec classe ✨",
      "Ton save-the-date mérite\nmieux qu'un SMS 📅",
      "Annonce ton événement\nautrement ✨",
    ],
  },
  {
    code: "DEMOGROSSESSE",
    slug: "grossesse",
    mechanic: "scratch",
    image: "/uploads/demo-grossesse.jpg",
    template: "naissance",
    title: "On attend un bébé",
    subtitle: "pour décembre 2026",
    body: "La famille s'agrandit 🤰",
    kicker: "UNE CARTE À GRATTER",
    accent: "#b5dcc1", // menthe
    hooks: [
      "Annonce ta grossesse\nautrement 🤰",
      "La nouvelle qui va\nles faire pleurer 🍼",
      "On attend un bébé...\ndevine comment on l'a dit 👀",
    ],
  },
  {
    code: "DEMOGENDER",
    slug: "gender-reveal",
    mechanic: "scratch",
    image: "/uploads/demo-genderreveal.jpg",
    template: "save-the-date",
    title: "C'est une fille !",
    subtitle: "🎀 rose dragée",
    body: "Baby Léa arrive en décembre 2026",
    kicker: "UNE CARTE À GRATTER",
    accent: "#ef9bb4", // rose
    hooks: [
      "Fille ou garçon ?\nGratte pour savoir 🎀",
      "Le gender reveal\nnouvelle génération 💕",
      "Team fille ou team\ngarçon ? 👀",
    ],
  },
  {
    code: "DEMOCREMA",
    slug: "cremaillere",
    mechanic: "envelope",
    image: "/uploads/demo-cremaillere.jpg",
    template: "save-the-date",
    title: "Crémaillère",
    subtitle: "chez Léa & Max",
    body: "Samedi 19 juillet · 19h · 12 rue des Lilas",
    kicker: "UNE ENVELOPPE À OUVRIR",
    accent: "#e8c547", // doré
    hooks: [
      "Invite à ta crémaillère\navec style 🔑",
      "Nouvelle maison,\nnouvelle façon d'inviter 🏡",
      "Arrête les invitations\nWhatsApp 🔑",
    ],
  },
  {
    code: "DEMOMARIAGEF",
    slug: "mariage-femmes",
    mechanic: "polaroid",
    image: "/uploads/demo-mariage-femmes.jpg",
    template: "mariage",
    title: "Julie & Emma",
    subtitle: "se marient",
    body: "Le 20 juin 2026 à Aix-en-Provence",
    kicker: "UN POLAROID À DÉVELOPPER",
    accent: "#ef9bb4", // rose
    hooks: [
      "La façon la plus stylée\nd'annoncer un mariage 💍",
      "Elles se marient —\net l'annoncent comme ça 💕",
      "POV : ta meilleure amie\nt'annonce SON mariage 👰",
    ],
  },
  {
    code: "DEMOMARIAGEH",
    slug: "mariage-hommes",
    mechanic: "scratch",
    image: "/uploads/demo-mariage-hommes.jpg",
    template: "mariage",
    title: "Marc & Thomas",
    subtitle: "se marient",
    body: "Le 5 septembre 2026 à Lyon",
    kicker: "UNE CARTE À GRATTER",
    accent: "#f2b594", // pêche
    hooks: [
      "La façon la plus stylée\nd'annoncer un mariage 💍",
      "Ils se marient —\net c'est carrément stylé 🤵",
      "Arrête les faire-part\nennuyeux 💍",
    ],
  },
  {
    code: "DEMOFIANCAILLES",
    slug: "fiancailles",
    mechanic: "polaroid",
    image: "/uploads/demo-fiancailles-couple.jpg",
    template: "mariage",
    title: "Chloé & Inès",
    subtitle: "se fiancent",
    body: "On fête ça le 14 février 2026",
    kicker: "UN POLAROID À DÉVELOPPER",
    accent: "#ef9bb4", // rose
    hooks: [
      "Elle a dit oui 💍\nannonce-le autrement",
      "Fiançailles : la nouvelle\nqui fait crier 💕",
      "Annonce tes fiançailles\navec style ✨",
    ],
  },
  {
    code: "DEMODIPLOME",
    slug: "diplome",
    mechanic: "scratch",
    image: "/uploads/demo-diplome.jpg",
    template: "save-the-date",
    title: "Léa est diplômée !",
    subtitle: "Master 2 validé 🎓",
    body: "On fête ça samedi soir · 20h",
    kicker: "UNE CARTE À GRATTER",
    accent: "#e8c547", // doré
    hooks: [
      "Diplômé·e ?\nAnnonce-le en grand 🎓",
      "5 ans d'études,\nune annonce qui claque 🎓",
      "La façon la plus fun\nd'annoncer ton diplôme ✨",
    ],
  },
  {
    code: "DEMOBAPTEME",
    slug: "bapteme",
    mechanic: "envelope",
    image: "/uploads/demo-bapteme.jpg",
    template: "save-the-date",
    title: "Baptême de Gabriel",
    subtitle: "vous êtes invités",
    body: "Dimanche 21 juin · 11h · Église St-Pierre",
    kicker: "UNE ENVELOPPE À OUVRIR",
    accent: "#b5dcc1", // menthe
    hooks: [
      "Un baptême à organiser ?\nInvite autrement 🕊️",
      "L'invitation de baptême\nqu'on garde 🕊️",
      "Arrête les faire-part\nclassiques 🕊️",
    ],
  },
  {
    code: "DEMORETRAITE",
    slug: "retraite",
    mechanic: "envelope",
    image: "/uploads/demo-retraite.jpg",
    template: "save-the-date",
    title: "Pot de départ",
    subtitle: "Martine part en retraite",
    body: "Vendredi 27 juin · 18h · au bureau",
    kicker: "UNE ENVELOPPE À OUVRIR",
    accent: "#e8c547", // doré
    hooks: [
      "Un départ en retraite\nà fêter ? 🥂",
      "Invite au pot de départ\navec style 🎉",
      "La retraite, ça s'annonce\nen beauté 🥂",
    ],
  },
];
