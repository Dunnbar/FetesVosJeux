// Textes Pinterest, une entrée par occasion (source unique du copy épingles).
//
// Volontairement séparé de clips.config.mjs : ce dernier décrit les RÉVÉLATIONS
// (photo, mécanique, accroches vidéo) et sert au recorder. Ici, on ne stocke que
// ce qui part chez Pinterest. La clé est le `slug` de clips.config.mjs, et les
// 13 occasions sont couvertes 1:1.
//
// Champs :
//   urlSlug     slug de la future page SEO (/idees/<urlSlug>) — cf. PIN_TARGET
//               dans make-pins.mjs, à aligner sur src/lib/occasions.ts
//   overlay     les 2 lignes incrustées sur le visuel (« situation / action »).
//               26 caractères MAXI par ligne, sinon la police rétrécit.
//   title       titre de l'épingle, 100 caractères maxi
//   description description de l'épingle, 500 caractères maxi (seuls ~50 sont
//               visibles sans dépli → l'accroche d'abord)
//   alt         texte alternatif, 500 caractères maxi
//   board       tableau Pinterest de destination
//   keywords    mots-clés pour l'import en masse
//   hashtags    ajoutés en fin de description (sans le #)
//   band        (optionnel) [from, to] en fraction de la hauteur de carte :
//               la bande grattée, à resserrer si le texte de l'annonce ne
//               tombe pas au même endroit (défaut 0.20 → 0.58)

export const PINS = {
  grossesse: {
    urlSlug: "annonce-grossesse-originale",
    overlay: ["On attend un bébé.", "Gratte pour savoir."],
    title: "Annonce ta grossesse en carte à gratter",
    description:
      "Une annonce de grossesse originale, sans ballon ni gâteau surprise : tu uploades ta photo, elle devient une carte à gratter, et tes proches frottent l'écran pour découvrir la nouvelle. Lien privé à envoyer par SMS ou WhatsApp, 5 €. Idée annonce grossesse, même à distance.",
    alt: "Carte à gratter à moitié grattée révélant une annonce de grossesse sur une photo",
    board: "Annonce de grossesse",
    keywords: [
      "annonce grossesse originale",
      "comment annoncer sa grossesse",
      "idée annonce grossesse",
      "carte à gratter grossesse",
      "annonce grossesse à distance",
    ],
    hashtags: ["annoncegrossesse", "jesuisenceinte", "grossesse2026"],
  },

  naissance: {
    urlSlug: "annonce-naissance-originale",
    overlay: ["Il est arrivé.", "Développe la photo."],
    title: "Annonce de naissance à développer",
    description:
      "Annonce de naissance originale et numérique : ta photo de maternité devient un polaroid qui se développe à l'écran, et le prénom de bébé apparaît dessous. Un lien à envoyer à toute la famille, dès 5 €, rien à imprimer ni à poster. Idée faire-part de naissance.",
    alt: "Polaroid développé montrant un nouveau-né et l'annonce de sa naissance",
    board: "Faire-part de naissance",
    keywords: [
      "annonce naissance originale",
      "faire-part naissance original",
      "annoncer la naissance de son bébé",
      "faire-part naissance numérique",
      "idée annonce naissance",
    ],
    hashtags: ["fairepartnaissance", "annoncenaissance", "bebe2026"],
  },

  anniversaire: {
    urlSlug: "invitation-anniversaire-originale",
    overlay: ["T'es invité.", "Ouvre l'enveloppe."],
    title: "Invitation anniversaire à ouvrir",
    description:
      "Invitation d'anniversaire originale et numérique : ta photo glissée dans une enveloppe que tes invités ouvrent à l'écran pour découvrir la date, l'heure et l'adresse. Un lien à coller dans le groupe WhatsApp, 5 €. Parfait pour un 30 ans ou une soirée surprise.",
    alt: "Enveloppe ouverte à l'écran laissant sortir une carte d'invitation d'anniversaire",
    board: "Invitation anniversaire",
    keywords: [
      "invitation anniversaire originale",
      "texte invitation anniversaire",
      "invitation anniversaire 30 ans",
      "invitation anniversaire adulte",
      "invitation anniversaire surprise",
    ],
    hashtags: ["invitationanniversaire", "anniversaire30ans", "fetedanniversaire"],
  },

  "save-the-date": {
    urlSlug: "save-the-date-original",
    overlay: ["Bloque la date.", "Gratte pour la voir."],
    title: "Save the date à gratter",
    description:
      "Save the date original et numérique : votre photo devient une carte à gratter, vos invités frottent l'écran et découvrent la date du mariage. Un lien à envoyer six à douze mois avant le jour J, dès 5 €. Idée save the date sans impression ni envoi postal.",
    alt: "Carte à gratter à moitié grattée révélant la date d'un mariage",
    board: "Save the date mariage",
    keywords: [
      "save the date original",
      "quand envoyer save the date",
      "save the date mariage",
      "save the date numérique",
      "idée save the date",
    ],
    hashtags: ["savethedate", "mariage2026", "fairepartmariage"],
  },

  "gender-reveal": {
    urlSlug: "gender-reveal-original",
    overlay: ["Fille ou garçon ?", "Gratte pour savoir."],
    title: "Gender reveal : fille ou garçon ?",
    description:
      "Gender reveal original et sans fumigène : ta photo devient une carte à gratter et chacun frotte l'écran de son côté pour découvrir si c'est une fille ou un garçon. Un lien à envoyer, même aux proches qui habitent loin, 5 €. Idée annonce du sexe de bébé à distance.",
    alt: "Carte à gratter à moitié grattée révélant le sexe du bébé",
    board: "Gender reveal",
    keywords: [
      "gender reveal original",
      "idée gender reveal",
      "annoncer le sexe du bébé",
      "gender reveal à distance",
      "gender reveal sans ballon",
    ],
    hashtags: ["genderreveal", "filleougarcon", "annoncebebe"],
  },

  cremaillere: {
    urlSlug: "invitation-cremaillere-originale",
    overlay: ["Nouvelle adresse.", "Ouvre l'enveloppe."],
    title: "Invitation crémaillère à ouvrir",
    description:
      "Invitation de crémaillère originale : ta photo du nouveau chez-toi glissée dans une enveloppe que tes invités ouvrent à l'écran, avec l'adresse, l'étage et le code à l'intérieur. Un lien à envoyer par SMS, 5 €. Idée d'invitation pour une pendaison de crémaillère.",
    alt: "Enveloppe ouverte à l'écran laissant sortir une invitation de crémaillère",
    board: "Invitation crémaillère",
    keywords: [
      "invitation crémaillère originale",
      "texte invitation crémaillère",
      "invitation pendaison de crémaillère",
      "idée invitation crémaillère",
      "invitation crémaillère numérique",
    ],
    hashtags: ["cremaillere", "pendaisondecremaillere", "nouvelleadresse"],
  },

  mariage: {
    urlSlug: "annonce-mariage-originale",
    overlay: ["On se marie.", "Gratte pour la date."],
    title: "Annoncer son mariage en grattant",
    description:
      "Annonce de mariage originale : votre photo devient une carte à gratter, vos proches frottent l'écran et découvrent la nouvelle et la date. Un lien à envoyer par message, dès 5 €, rien à imprimer. Une idée pour annoncer son mariage à ses proches autrement.",
    alt: "Carte à gratter à moitié grattée révélant l'annonce d'un mariage",
    board: "Faire-part de mariage",
    keywords: [
      "annonce mariage originale",
      "comment annoncer son mariage",
      "idée annonce mariage",
      "faire-part mariage original",
      "carte à gratter mariage",
    ],
    hashtags: ["fairepartmariage", "annoncemariage", "mariage2026"],
  },

  "mariage-femmes": {
    urlSlug: "faire-part-mariage-deux-femmes",
    overlay: ["Elles se marient.", "Développe la photo."],
    title: "Faire-part mariage : elles se marient",
    description:
      "Faire-part de mariage pour deux femmes, sans modèle imposé ni silhouette toute faite : votre photo se développe comme un polaroid et votre annonce apparaît dessous. Vos prénoms, vos mots, votre date. Un lien à envoyer, dès 5 €, rien à imprimer.",
    alt: "Polaroid développé montrant deux femmes et l'annonce de leur mariage",
    board: "Faire-part de mariage",
    keywords: [
      "faire-part mariage deux femmes",
      "faire-part mariage lesbien",
      "annonce mariage couple de femmes",
      "faire-part mariage original",
      "faire-part mariage LGBT",
    ],
    hashtags: ["fairepartmariage", "mariagelesbien", "loveislove"],
  },

  "mariage-hommes": {
    urlSlug: "faire-part-mariage-deux-hommes",
    overlay: ["Ils se marient.", "Gratte pour la date."],
    title: "Faire-part mariage : ils se marient",
    description:
      "Faire-part de mariage pour deux hommes : votre photo devient une carte à gratter, vos proches frottent l'écran et découvrent votre annonce et la date. Vos prénoms, vos mots, aucun modèle à corriger. Un lien à envoyer, dès 5 €, rien à imprimer.",
    alt: "Carte à gratter à moitié grattée révélant l'annonce du mariage de deux hommes",
    board: "Faire-part de mariage",
    keywords: [
      "faire-part mariage deux hommes",
      "faire-part mariage gay",
      "annonce mariage couple d'hommes",
      "faire-part mariage homme homme",
      "carte à gratter mariage",
    ],
    hashtags: ["fairepartmariage", "mariagegay", "loveislove"],
  },

  fiancailles: {
    urlSlug: "annonce-fiancailles-originale",
    overlay: ["On s'est dit oui.", "Développe la photo."],
    title: "Annoncer ses fiançailles autrement",
    description:
      "Annonce de fiançailles originale : votre photo se développe comme un polaroid à l'écran et la nouvelle apparaît dessous. Un lien à envoyer à la famille et aux amis, même ceux qui habitent loin, dès 5 €. Une idée pour annoncer ses fiançailles dans le bon ordre.",
    alt: "Polaroid développé montrant un couple et l'annonce de ses fiançailles",
    board: "Annonce de fiançailles",
    keywords: [
      "annonce fiançailles originale",
      "comment annoncer ses fiançailles",
      "idée annonce fiançailles",
      "faire-part fiançailles",
      "elle a dit oui annonce",
    ],
    hashtags: ["fiancailles", "elleaditoui", "shesaidyes"],
  },

  diplome: {
    urlSlug: "annonce-diplome-originale",
    overlay: ["C'est validé.", "Gratte pour voir quoi."],
    title: "Annonce ton diplôme en grattant",
    description:
      "Annonce de diplôme originale : ta photo devient une carte à gratter, tes proches frottent l'écran et découvrent ce que tu viens de décrocher, plus la date de la fête. Un lien à envoyer, dès 5 €. Marche aussi pour le bac ou la réussite à un concours.",
    alt: "Carte à gratter à moitié grattée révélant l'annonce d'un diplôme obtenu",
    board: "Remise de diplôme",
    keywords: [
      "annonce diplôme originale",
      "annoncer sa réussite au diplôme",
      "invitation remise de diplôme",
      "annoncer son bac",
      "fête de diplôme invitation",
    ],
    hashtags: ["remisedediplome", "diplome", "graduation"],
  },

  bapteme: {
    urlSlug: "invitation-bapteme-originale",
    overlay: ["Un baptême à fêter.", "Ouvre l'enveloppe."],
    title: "Invitation baptême à ouvrir",
    description:
      "Invitation de baptême originale et numérique : ta photo glissée dans une enveloppe que tes invités ouvrent à l'écran, avec l'église, l'heure et la réception à l'intérieur. Sert aussi à demander à quelqu'un d'être parrain ou marraine. Un lien à envoyer, 5 €.",
    alt: "Enveloppe ouverte à l'écran laissant sortir une invitation de baptême",
    board: "Invitation baptême",
    keywords: [
      "invitation baptême originale",
      "texte invitation baptême",
      "faire-part baptême original",
      "demande parrain marraine originale",
      "invitation baptême numérique",
    ],
    hashtags: ["bapteme", "invitationbapteme", "parrainmarraine"],
  },

  retraite: {
    urlSlug: "invitation-pot-de-depart-retraite",
    overlay: ["Pot de départ.", "Ouvre l'enveloppe."],
    title: "Invitation pot de départ retraite",
    description:
      "Invitation de pot de départ à la retraite qui change du mail interne : votre photo d'équipe glissée dans une enveloppe que les collègues ouvrent à l'écran, avec la date, l'heure et le lieu dedans. Un lien à transférer, même aux anciens collègues. Dès 5 €.",
    alt: "Enveloppe ouverte à l'écran laissant sortir une invitation de pot de départ",
    board: "Pot de départ retraite",
    keywords: [
      "invitation pot de départ retraite",
      "texte invitation départ retraite",
      "invitation départ retraite originale",
      "annoncer un départ à la retraite",
      "pot de départ collègue",
    ],
    hashtags: ["potdedepart", "departenretraite", "retraite"],
  },
};
