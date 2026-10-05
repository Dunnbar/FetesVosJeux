/**
 * Occasions — source de vérité des pages SEO du site.
 *
 * Une entrée = une landing page /idees/<slug> : la requête visée, le
 * contenu rédigé, et la carte de démo jouable qui l'illustre.
 *
 * ── Pourquoi ce fichier double scripts/clips.config.mjs ──────────────
 * `scripts/clips.config.mjs` décrit les mêmes 13 occasions, mais pour le
 * recorder Playwright : c'est du .mjs pur, lancé hors Next (donc sans
 * l'alias `@/`, sans TypeScript, sans JSX), et il porte des champs qui
 * n'ont de sens qu'en vidéo (`hooks`, `kicker`). L'importer ici forcerait
 * à typer un module JS non typé et à embarquer les accroches TikTok dans
 * le bundle du site ; l'inverse ferait entrer Next dans le recorder.
 * La duplication est donc assumée, et elle est limitée au bloc `demo` de
 * chaque occasion. Règle : si tu changes un `code`, une `image`, une
 * `mechanic` ou un texte d'annonce ICI, répercute-le LÀ-BAS (et
 * réciproquement) — `cle` est la clé d'appariement entre les deux
 * fichiers (elle vaut le `slug` de clips.config.mjs).
 *
 * Les prix n'apparaissent jamais dans ce fichier : ils viennent de
 * src/lib/pricing.ts et sont injectés à l'affichage.
 */

import type { RevealMechanic } from "@/components/reveals/types";
import type { AnnonceTemplate } from "@/components/AnnonceCard";

/**
 * Familles de maillage interne : trois moments de vie. Elles regroupent les
 * occasions sur la page d'index et donnent des clusters thématiques à
 * Google sans créer de sous-dossiers d'URL.
 */
export const FAMILLES = {
  bebe: {
    label: "Côté bébé",
    emoji: "🍼",
    accroche: "De la première écho au baptême.",
  },
  amour: {
    label: "Côté amour",
    emoji: "💍",
    accroche: "De la demande au jour J.",
  },
  fetes: {
    label: "Côté fêtes",
    emoji: "🎉",
    accroche: "Tout ce qui se fête entre proches.",
  },
} as const;

export type FamilleKey = keyof typeof FAMILLES;

export const FAMILLE_KEYS = Object.keys(FAMILLES) as FamilleKey[];

/** Un lien contextuel vers une occasion sœur, écrit à la main. */
export interface LienConnexe {
  /** Slug de l'occasion visée. */
  readonly vers: string;
  /** Texte du lien. */
  readonly ancre: string;
  /**
   * Phrase d'accueil du lien. Le jeton `{lien}` marque l'emplacement de
   * l'ancre dans la phrase — on évite ainsi le bloc « voir aussi »
   * automatique, qui se ressemble d'une page à l'autre et que Google lit
   * comme du gabarit.
   */
  readonly phrase: string;
}

export interface Occasion {
  /** Segment d'URL : la requête visée, en kebab-case et sans accent. */
  readonly slug: string;
  /** Clé d'appariement avec scripts/clips.config.mjs (son champ `slug`). */
  readonly cle: string;
  /** Nom court — index, fil d'Ariane, liens. */
  readonly nom: string;
  readonly emoji: string;
  readonly famille: FamilleKey;

  /* ---- Référencement ---- */
  /** Balise <title>, 60 caractères maximum. */
  readonly titleTag: string;
  /** Meta description, 155 caractères maximum. */
  readonly metaDescription: string;
  /** H1 de la page — toujours différent du titleTag. */
  readonly h1: string;
  /** Chapeau : 2 ou 3 phrases sous le H1. */
  readonly intro: string;
  /** Corps de page. Trois sections, chacune avec son angle propre. */
  readonly sections: readonly {
    readonly titre: string;
    readonly corps: string;
  }[];
  /** FAQ visible ET reprise en JSON-LD — Google exige les deux identiques. */
  readonly faq: readonly { readonly q: string; readonly r: string }[];
  /**
   * Requêtes visées. Jamais rendues dans le HTML : elles documentent
   * l'intention et servent à relire le contenu, rien d'autre. (Elles ont un
   * temps fini en <meta name="keywords"> — balise que Google ignore depuis
   * 2009 et qui publiait en clair le plan de bataille SEO du site.)
   */
  readonly motsCles: readonly string[];
  /** Nom du produit pour le JSON-LD Product. */
  readonly produitNom: string;
  /** Titre court de l'image OG (2 lignes maximum à l'écran). */
  readonly ogTitre: string;
  /** Une ligne pour la carte de l'index /idees — ce que la page apporte. */
  readonly accroche: string;

  /* ---- Démo jouable (miroir de scripts/clips.config.mjs) ---- */
  readonly demo: {
    /** Code de la carte live correspondante : /g/<code>. */
    readonly code: string;
    readonly mechanic: RevealMechanic;
    readonly image: string;
    readonly template: AnnonceTemplate;
    readonly title: string;
    readonly subtitle: string;
    readonly body: string;
    /**
     * Couleur d'accent, en hexadécimal — même valeur que dans
     * clips.config.mjs. Pas une variable CSS : elle sert aussi dans
     * l'image Open Graph, et le moteur de rendu d'images ne résout pas
     * les `var(--…)`.
     */
    readonly accent: string;
    /** Texte alternatif de la photo de démo. */
    readonly alt: string;
  };

  /* ---- Maillage interne ---- */
  readonly liens: {
    readonly titre: string;
    readonly items: readonly LienConnexe[];
  };
}

/**
 * Les 13 occasions, dans l'ordre d'affichage de la page d'index.
 * `as const` : les slugs deviennent des littéraux, ce qui donne un type
 * `OccasionSlug` fermé — une faute de frappe dans un lien interne ou un
 * event d'analytics ne compile pas.
 */
export const OCCASIONS = [
  /* ============================================================
     Côté bébé
     ============================================================ */
  {
    slug: "annonce-grossesse-originale",
    cle: "grossesse",
    nom: "Annonce de grossesse",
    emoji: "🤰",
    famille: "bebe",
    titleTag: "Annonce de grossesse originale : la carte à gratter",
    metaDescription:
      "Tu attends un bébé ? Ta photo devient une carte à gratter : tes proches frottent l'écran et découvrent la nouvelle. Lien prêt tout de suite.",
    h1: "Annoncer ta grossesse autrement qu'avec un test posé sur la table",
    intro:
      "Tu as fait le test il y a quelques jours et depuis, tu tiens la nouvelle à bout de bras. La vraie question n'est pas quoi dire, c'est comment, à qui d'abord, et sans que ça se sache par la bande. Ici, ta photo devient une carte à gratter : tes proches frottent l'écran et la phrase apparaît.",
    produitNom: "Carte à gratter pour annoncer une grossesse",
    ogTitre: "Annonce ta grossesse en carte à gratter",
    accroche:
      "Qui prévenir en premier, et comment garder la main sur la nouvelle.",
    sections: [
      {
        titre: "Décide de l'ordre avant d'envoyer quoi que ce soit",
        corps:
          "Une annonce de grossesse se joue surtout à l'ordre. Le co-parent d'abord, évidemment. Puis les parents et beaux-parents, idéalement le même jour, pour éviter le classique « ils l'ont su avant nous ». Ensuite la fratrie, et les deux ou trois amis qui sauront tenir leur langue. Le reste peut attendre. Écris cette liste avant même de créer ta carte : tu sauras combien de liens tu envoies et dans quel ordre tu appuies sur envoyer. Le travail arrive en dernier, et rarement par carte.",
      },
      {
        titre: "Le cap des trois mois, et ce que tu en fais",
        corps:
          "La règle des douze semaines existe parce que le risque de fausse couche baisse après le premier trimestre. C'est une précaution, pas une obligation. Beaucoup de couples préviennent deux ou trois personnes très tôt, justement pour ne pas rester seuls si ça tourne mal, puis font l'annonce large après la première échographie. Si tu attends l'écho, tu auras en prime une image à glisser sous le grattage. Décidez à deux, avec l'autre parent — pas avec le calendrier des autres.",
      },
      {
        titre: "La photo qui fait le plus d'effet",
        corps:
          "Sous le grattage, l'image a deux secondes pour se lire. Ce qui marche : un plan serré, un seul sujet, une lumière de jour près d'une fenêtre. Un ventre, une main posée dessus, l'écho tenue à deux, une paire de chaussons sur le parquet. Ce qui marche moins : les photos de groupe, les captures d'écran pleines de texte, les images sombres. Le cadrage est carré, alors laisse de l'air autour du sujet : le doigt passe au milieu, c'est là que ça se révèle.",
      },
    ],
    faq: [
      {
        q: "Au bout de combien de temps je reçois mon lien ?",
        r: "Tout de suite après le paiement. Le lien s'affiche à l'écran et part aussi par email. Tu peux l'envoyer dans la foulée.",
      },
      {
        q: "Mes parents peuvent gratter depuis leur téléphone ?",
        r: "Oui. Ça se gratte au doigt sur mobile, à la souris sur ordinateur. Aucune appli à installer, aucun compte à créer pour eux.",
      },
      {
        q: "Combien de personnes peuvent ouvrir le lien ?",
        r: "Autant que tu veux. Le lien se repartage, et la carte se regratte à chaque ouverture : chacun vit sa propre révélation.",
      },
      {
        q: "Je peux voir le rendu avant de payer ?",
        r: "Oui. Une page d'aperçu te montre ta photo et ton texte dans le format choisi. Tu paies seulement si ça te plaît.",
      },
      {
        q: "Et si je veux garder la surprise jusqu'au dernier moment ?",
        r: "Le titre de ta carte apparaît dans l'aperçu du lien sur WhatsApp. Garde-le neutre et mets la nouvelle dans le sous-titre ou la phrase du bas : ces deux-là restent cachés jusqu'au grattage.",
      },
    ],
    motsCles: [
      "annonce grossesse originale",
      "comment annoncer sa grossesse",
      "idée annonce grossesse",
      "annoncer sa grossesse à ses proches",
      "carte à gratter grossesse",
      "annonce grossesse à distance",
    ],
    demo: {
      code: "DEMOGROSSESSE",
      mechanic: "scratch",
      image: "/uploads/demo-grossesse.jpg",
      template: "naissance",
      title: "On attend un bébé",
      subtitle: "pour décembre 2026",
      body: "La famille s'agrandit 🤰",
      accent: "#b5dcc1",
      alt: "Photo d'annonce de grossesse cachée sous une carte à gratter",
    },
    liens: {
      titre: "La suite du programme",
      items: [
        {
          vers: "gender-reveal-original",
          ancre: "la révélation du sexe",
          phrase:
            "Dans trois mois tu auras un deuxième secret à tenir : {lien} se prépare exactement de la même façon, en un peu plus tendu.",
        },
        {
          vers: "annonce-naissance-originale",
          ancre: "annoncer sa naissance",
          phrase:
            "Et le jour où il sera là, {lien} se fera en trois minutes depuis la maternité, avec un peu moins de sommeil.",
        },
      ],
    },
  },

  {
    slug: "gender-reveal-original",
    cle: "gender-reveal",
    nom: "Gender reveal",
    emoji: "🎀",
    famille: "bebe",
    titleTag: "Gender reveal original : fille ou garçon, à gratter",
    metaDescription:
      "Révéler le sexe de ton bébé sans ballon ni fumigène : chacun gratte l'écran de son côté et découvre la réponse, même à 600 km. Un seul lien.",
    h1: "Révéler le sexe de ton bébé sans ballon ni fumigène",
    intro:
      "L'échographie a parlé, et te voilà avec un secret que tout le monde veut t'arracher. Pas envie de ballon géant, de fumigène ni de gâteau coloré ? Ta photo devient une carte à gratter : chacun frotte l'écran de son côté et découvre si c'est une fille ou un garçon.",
    produitNom: "Carte à gratter de gender reveal",
    ogTitre: "Fille ou garçon ? Gratte pour savoir",
    accroche:
      "Fille ou garçon, révélé à tout le monde en même temps — même à 600 km.",
    sections: [
      {
        titre: "Garder le secret jusqu'au bout",
        corps:
          "La méthode la plus sûre : demande à l'échographe d'écrire le résultat sur un papier plié, dans une enveloppe, sans te le dire. Tu la confies à une personne qui préparera la carte, ou vous l'ouvrez à deux, tranquillement. Décide aussi qui sait quoi : si trois personnes connaissent la réponse « juste pour aider », elle finira par sortir. Attention enfin aux comptes rendus d'échographie envoyés par mail, où le sexe est parfois écrit noir sur blanc.",
      },
      {
        titre: "Révéler à ceux qui ne sont pas dans la pièce",
        corps:
          "C'est la limite des gender reveal physiques : les grands-parents à 600 kilomètres, la sœur expatriée, les amis qui travaillent ce samedi-là. Un lien règle le problème. Tu peux l'envoyer à tous au même moment pour que la découverte soit simultanée, ou le garder pour l'après-fête : ceux qui n'ont pas pu venir grattent chez eux et t'appellent dans la foulée. C'est aussi la solution si tu ne veux tout simplement pas organiser de fête.",
      },
      {
        titre: "Choisir ce qui apparaît sous le grattage",
        corps:
          "Le moment fort, c'est la seconde où la réponse se découvre. Évite donc le texte long : « C'est une fille », « Team bleu », ou le prénom s'il est déjà choisi. Côté image, une couleur franche se lit mieux qu'un dégradé pastel sur un petit écran. Tu peux aussi inverser la mécanique et mettre le texte par-dessus, pour faire gratter et révéler la photo dessous. Les deux sens fonctionnent : tout dépend de ce que tu veux garder pour la fin.",
      },
    ],
    faq: [
      {
        q: "On peut tous gratter en même temps ?",
        r: "Oui. Le même lien s'ouvre sur autant de téléphones que tu veux, et chacun a sa propre carte à gratter. Personne ne grille la surprise des autres.",
      },
      {
        q: "Le lien peut-il vendre la mèche avant le grattage ?",
        r: "Un détail à connaître : le titre de ta carte s'affiche dans l'aperçu du lien sur WhatsApp. Mets la réponse dans le sous-titre ou la phrase du bas, qui restent cachés, et garde un titre neutre.",
      },
      {
        q: "Et si quelqu'un ouvre le lien trop tôt ?",
        r: "La carte se révèle dès qu'on la gratte, il n'y a pas de minuteur. Envoie le lien au moment où tu veux que ça se sache, pas avant.",
      },
      {
        q: "On peut gratter le texte plutôt que la photo ?",
        r: "Oui, le sens du grattage se choisit. Par défaut on gratte la photo pour révéler le texte ; tu peux inverser et faire gratter le texte pour révéler la photo dessous.",
      },
      {
        q: "Ça remplace une vraie gender reveal party ?",
        r: "Ça dépend de ce que tu cherches. Pour une fête avec confettis, non. Pour prévenir trente personnes d'un coup, y compris celles qui sont loin, oui — et sans rien faire exploser.",
      },
    ],
    motsCles: [
      "gender reveal original",
      "idée gender reveal",
      "annoncer le sexe du bébé",
      "gender reveal à distance",
      "gender reveal sans ballon",
      "carte à gratter gender reveal",
    ],
    demo: {
      code: "DEMOGENDER",
      mechanic: "scratch",
      image: "/uploads/demo-genderreveal.jpg",
      template: "save-the-date",
      title: "C'est une fille !",
      subtitle: "🎀 rose dragée",
      body: "Baby Léa arrive en décembre 2026",
      accent: "#ef9bb4",
      alt: "Carte à gratter de gender reveal, réponse cachée sous la photo",
    },
    liens: {
      titre: "Avant, après",
      items: [
        {
          vers: "annonce-grossesse-originale",
          ancre: "l'annonce de grossesse",
          phrase:
            "Si la nouvelle elle-même n'est pas encore sortie, commence par {lien} — l'ordre des personnes à prévenir y est détaillé.",
        },
        {
          vers: "annonce-naissance-originale",
          ancre: "l'annonce de naissance",
          phrase:
            "Garde la même photo de côté : elle fera une jolie paire avec {lien}, quelques mois plus tard.",
        },
      ],
    },
  },

  {
    slug: "annonce-naissance-originale",
    cle: "naissance",
    nom: "Annonce de naissance",
    emoji: "👶",
    famille: "bebe",
    titleTag: "Annonce de naissance : le polaroid à développer",
    metaDescription:
      "Bébé est là. Ta photo de maternité devient un polaroid qui se développe : un clic, et le prénom apparaît. Un lien à partager, rien à imprimer.",
    h1: "Annoncer la naissance de ton bébé sans faire-part à imprimer",
    intro:
      "Il est né. Tu as trois heures de sommeil dans les jambes, soixante messages non lus et l'envie de dire la nouvelle correctement — pas en copiant-collant le même SMS quarante fois. Ta photo devient un polaroid : on clique, l'image se développe lentement, et le prénom apparaît.",
    produitNom: "Faire-part de naissance numérique à développer",
    ogTitre: "Il est arrivé. Développe la photo",
    accroche:
      "Le prénom, le poids, la date : ce qu'on met vraiment dans une annonce.",
    sections: [
      {
        titre: "Ce qu'on met vraiment dans une annonce de naissance",
        corps:
          "Le prénom et la date, et c'est déjà beaucoup. Le poids et la taille, parce que la famille les réclamera de toute façon. Le nom de famille si tes proches ne le connaissent pas encore, et le prénom du grand frère ou de la grande sœur s'il y en a un : ça lui donne une place dans l'annonce. Ce que tu peux garder pour toi : l'heure exacte, le déroulé de l'accouchement, le nom de la maternité. Une annonce, ce n'est pas un compte rendu.",
      },
      {
        titre: "Annoncer depuis la maternité sans y passer la nuit",
        corps:
          "Tu crées la carte une fois, tu récupères un lien, tu l'envoies à tout le monde. Pas de liste de diffusion à monter, pas d'adresse postale à retrouver dans un vieux carnet. Si tu veux que les grands-parents l'apprennent avant le groupe familial, envoie-leur le lien d'abord et attends une heure. Et pense à ceux qui ne sont pas à l'aise avec un téléphone : un coup de fil reste imbattable, tu leur montreras la carte à la première visite.",
      },
      {
        titre: "La photo des premiers jours",
        corps:
          "Les photos de nouveau-né sont difficiles : lumière de néon, peau marbrée, bonnet trop grand. Trois réflexes suffisent. Approche-toi d'une fenêtre et coupe le flash. Cadre serré sur le visage, ou sur une main qui serre un doigt. Et prends-en vingt, tu en garderas une. Si tu préfères ne pas montrer son visage tout de suite, une étiquette de maternité, un bracelet ou des chaussons font très bien l'affaire : l'effet de développement fonctionne avec n'importe quelle image.",
      },
    ],
    faq: [
      {
        q: "Le lien expire au bout de combien de temps ?",
        r: "Il n'expire pas. Tu pourras le renvoyer dans six mois à la tante qui l'avait raté, la carte sera toujours là.",
      },
      {
        q: "Ça marche sur un vieux téléphone ?",
        r: "Ça s'ouvre dans le navigateur, comme une page web. Pas d'appli, pas de compte. Un doigt sur mobile, un clic sur ordinateur.",
      },
      {
        q: "Je peux choisir autre chose que le polaroid ?",
        r: "Oui. Il y a trois formats : le ticket à gratter, le polaroid à développer et l'enveloppe à ouvrir. Tu peux en prendre deux ou les trois, et c'est dégressif.",
      },
      {
        q: "Il y a quelque chose d'imprimé et envoyé par la poste ?",
        r: "Non, tout est numérique. Tu reçois un lien à partager, rien n'est expédié.",
      },
      {
        q: "Combien de personnes peuvent voir la photo se développer ?",
        r: "Autant que tu veux. Le développement se rejoue à chaque ouverture du lien, donc chacun le voit en entier, même le dernier arrivé.",
      },
    ],
    motsCles: [
      "annonce naissance originale",
      "faire-part naissance original",
      "annoncer la naissance de son bébé",
      "texte annonce naissance",
      "faire-part naissance numérique",
      "idée annonce naissance",
    ],
    demo: {
      code: "DEMONAISSANCE",
      mechanic: "polaroid",
      image: "/uploads/demo-naissance.jpg",
      template: "naissance",
      title: "Jules",
      subtitle: "est arrivé !",
      body: "Le 12 juin 2026 · 3,4 kg de bonheur",
      accent: "#b5dcc1",
      alt: "Polaroid d'annonce de naissance en cours de développement",
    },
    liens: {
      titre: "Dans la même série",
      items: [
        {
          vers: "annonce-grossesse-originale",
          ancre: "l'annonce de grossesse",
          phrase:
            "Si tu as déjà fait {lien} avec nous, reprends le même cadrage : les deux cartes se répondent bien côte à côte.",
        },
        {
          vers: "invitation-bapteme-originale",
          ancre: "l'invitation au baptême",
          phrase:
            "Et si un baptême se profile, {lien} sert aussi à demander à quelqu'un d'être parrain ou marraine.",
        },
      ],
    },
  },

  {
    slug: "invitation-bapteme-originale",
    cle: "bapteme",
    nom: "Invitation de baptême",
    emoji: "🕊️",
    famille: "bebe",
    titleTag: "Invitation baptême originale : l'enveloppe à ouvrir",
    metaDescription:
      "Une invitation de baptême qui s'ouvre comme une enveloppe : église, heure, réception, tout est dedans. Sert aussi à demander parrain ou marraine.",
    h1: "Inviter au baptême sans oublier la moitié des infos",
    intro:
      "Une date à l'église, une salle réservée, et une liste d'invités qui mélange trois générations. Entre les grands-parents, les cousins et les amis qui n'ont jamais mis les pieds dans une église, il faut une invitation limpide. Celle-ci s'ouvre comme une enveloppe, avec ta photo à l'intérieur.",
    produitNom: "Invitation de baptême numérique à ouvrir",
    ogTitre: "Un baptême à fêter. Ouvre l'enveloppe",
    accroche:
      "Les infos qu'on oublie, et la carte qui demande parrain ou marraine.",
    sections: [
      {
        titre: "Les infos qu'on oublie une fois sur deux",
        corps:
          "Le prénom de l'enfant, la date, l'heure et le nom exact de l'église : c'est la base. Ce qu'on oublie : l'adresse complète du lieu de culte, l'heure et l'adresse de la réception qui suit, et le fait qu'on peut venir à l'un sans l'autre. Précise aussi si le repas est assis ou en buffet, s'il y a de quoi occuper les enfants, et jusqu'à quelle heure ça dure. Une invitation complète, c'est dix appels en moins la veille.",
      },
      {
        titre: "Quand l'envoyer",
        corps:
          "Six à huit semaines avant, c'est la bonne fenêtre : assez tôt pour que la famille éloignée réserve un trajet, assez tard pour que personne n'oublie. Compte dix à douze semaines si le baptême tombe sur un week-end de pont ou en plein été. Demande une réponse deux semaines avant la date, pas la veille : le traiteur et la salle en auront besoin. Et prévois une relance, il y a toujours trois invités qui n'ont jamais répondu à rien.",
      },
      {
        titre: "Demander à quelqu'un d'être parrain ou marraine",
        corps:
          "C'est l'autre usage de ce format, et souvent le plus émouvant. Au lieu de poser la question au téléphone, tu envoies une carte : une photo du bébé, et sous l'enveloppe la phrase « tu veux être sa marraine ? ». La personne ouvre, lit, et t'appelle dans la seconde. Fais-le bien avant les invitations : le parrain et la marraine sont parfois cités dans le faire-part, et il vaut mieux avoir la réponse avant de l'écrire.",
      },
    ],
    faq: [
      {
        q: "Ça peut servir à demander le parrain ou la marraine ?",
        r: "Oui, c'est un usage très fréquent. Tu crées une carte avec la question cachée sous l'enveloppe et tu l'envoies à la personne concernée.",
      },
      {
        q: "Les grands-parents vont réussir à l'ouvrir ?",
        r: "L'enveloppe s'ouvre d'un clic ou d'une pression du doigt, il n'y a rien d'autre à faire. Pas de compte, pas d'appli. Un seul conseil : envoie-leur le lien seul, sans dix autres messages autour.",
      },
      {
        q: "Je peux écrire un texte religieux ?",
        r: "Tu écris ce que tu veux dans le titre, le sous-titre et la phrase du bas. Verset, formule traditionnelle ou phrase simple, rien n'est imposé.",
      },
      {
        q: "Le lien reste accessible après le baptême ?",
        r: "Oui, il n'expire pas. Tu peux le garder avec les photos du jour.",
      },
      {
        q: "Comment je récupère les réponses des invités ?",
        r: "Il n'y a pas de formulaire de réponse intégré. Mets ton numéro ou ton mail dans le texte de l'invitation : les réponses t'arrivent directement, comme pour un faire-part papier.",
      },
    ],
    motsCles: [
      "invitation baptême originale",
      "texte invitation baptême",
      "faire-part baptême original",
      "demande parrain marraine originale",
      "invitation baptême numérique",
      "annonce baptême",
    ],
    demo: {
      code: "DEMOBAPTEME",
      mechanic: "envelope",
      image: "/uploads/demo-bapteme.jpg",
      template: "save-the-date",
      title: "Baptême de Gabriel",
      subtitle: "vous êtes invités",
      body: "Dimanche 21 juin · 11h · Église St-Pierre",
      accent: "#b5dcc1",
      alt: "Enveloppe d'invitation de baptême prête à être ouverte",
    },
    liens: {
      titre: "Deux étapes plus tôt, une étape plus tard",
      items: [
        {
          vers: "annonce-naissance-originale",
          ancre: "l'annonce de naissance",
          phrase:
            "Beaucoup de parents enchaînent : {lien} en juin, l'invitation au baptême en septembre, avec la même photo en fil rouge.",
        },
        {
          vers: "invitation-anniversaire-originale",
          ancre: "l'invitation d'anniversaire",
          phrase:
            "L'enveloppe sert aussi à tout ce qui réunit du monde autour d'une date — {lien} fonctionne exactement pareil.",
        },
      ],
    },
  },

  /* ============================================================
     Côté amour
     ============================================================ */
  {
    slug: "annonce-fiancailles-originale",
    cle: "fiancailles",
    nom: "Annonce de fiançailles",
    emoji: "💍",
    famille: "amour",
    titleTag: "Annonce de fiançailles : le polaroid à développer",
    metaDescription:
      "C'est oui. Ta photo se développe comme un polaroid et la nouvelle apparaît. Un lien à envoyer, même à la famille qui habite loin.",
    h1: "Dire oui, puis le dire à tout le monde",
    intro:
      "La demande est faite. Tu n'as pas vraiment atterri, la bague brille mal sur les photos et ton téléphone commence déjà à vibrer. Avant que ça parte tout seul, voilà comment annoncer tes fiançailles dans le bon ordre — avec une photo qui se développe comme un polaroid.",
    produitNom: "Annonce de fiançailles numérique à développer",
    ogTitre: "On s'est dit oui. Développe la photo",
    accroche:
      "L'ordre des annonces, et comment ne pas griller ton mariage.",
    sections: [
      {
        titre: "L'ordre qui évite les vexations",
        corps:
          "La règle non écrite : le cercle le plus proche apprend la nouvelle de vive voix, les réseaux sociaux en dernier. Concrètement, garde le jour même pour vous deux. Le lendemain ou le surlendemain, les parents des deux côtés, en vrai ou en visio. Les jours suivants, frères, sœurs, grands-parents et amis proches. La famille élargie ensuite. Et seulement après, la publication publique. Ça paraît long, mais ça tient en une semaine et ça évite le fameux « on l'a appris comme tout le monde ».",
      },
      {
        titre: "Annoncer tes fiançailles sans griller ton mariage",
        corps:
          "Deux annonces en un mois, c'est une de trop pour l'entourage. Si le mariage est déjà calé, tu peux tout dire d'un coup et sauter l'étape fiançailles. S'il ne l'est pas — et c'est le cas le plus fréquent — tiens-t'en à « on s'est dit oui », sans date ni lieu. Tu garderas de la place pour le save the date dans six mois. Et si on te demande la date dix fois par jour, « on vous dira, promis » est une réponse parfaitement valable.",
      },
      {
        titre: "La bague, ou vous deux ?",
        corps:
          "Le réflexe est de photographier la main. Ça marche, à condition que ce soit net et en lumière du jour : une bague floue sous un plafonnier ne rend rien. L'autre option, souvent plus forte : vous deux, dix minutes après la demande, pas coiffés, vrais. Le polaroid se développe lentement, donc l'image gagne à être simple et contrastée. Et si tu n'as aucune photo potable de ce moment-là, une photo de vous ensemble fait très bien le travail.",
      },
    ],
    faq: [
      {
        q: "C'est différent d'une annonce de mariage ?",
        r: "Oui. Les fiançailles annoncent l'engagement, pas la date. Beaucoup envoient d'abord ça, puis un save the date quand le lieu est réservé.",
      },
      {
        q: "On peut l'envoyer à distance ?",
        r: "C'est fait pour. Un lien par SMS, WhatsApp ou mail, et la famille qui habite loin découvre la nouvelle en même temps que les autres.",
      },
      {
        q: "Le lien expire ?",
        r: "Non. Tu pourras le rouvrir plus tard et le garder avec les photos de la demande.",
      },
      {
        q: "On peut faire deux cartes, une pour chaque famille ?",
        r: "Oui, avec deux photos et deux textes différents. Chaque carte a son propre lien et se paie séparément.",
      },
      {
        q: "Combien de temps dure le développement de la photo ?",
        r: "Quelques secondes, le temps que le flou se dissipe et que la couleur revienne. C'est volontairement lent : c'est là que la personne en face retient son souffle.",
      },
    ],
    motsCles: [
      "annonce fiançailles originale",
      "comment annoncer ses fiançailles",
      "idée annonce fiançailles",
      "annoncer ses fiançailles à sa famille",
      "faire-part fiançailles",
      "elle a dit oui annonce",
    ],
    demo: {
      code: "DEMOFIANCAILLES",
      mechanic: "polaroid",
      image: "/uploads/demo-fiancailles-couple.jpg",
      template: "mariage",
      title: "Chloé & Inès",
      subtitle: "se fiancent",
      body: "On fête ça le 14 février 2026",
      accent: "#ef9bb4",
      alt: "Polaroid d'annonce de fiançailles en cours de développement",
    },
    liens: {
      titre: "Ce qui vient après",
      items: [
        {
          vers: "save-the-date-original",
          ancre: "le save the date",
          phrase:
            "Dès que le lieu est réservé, {lien} prend le relais : il bloque la date sans rien promettre d'autre.",
        },
        {
          vers: "annonce-mariage-originale",
          ancre: "annoncer le mariage lui-même",
          phrase:
            "Et si tu décides de tout dire d'un coup, saute l'étape et passe directement à {lien}.",
        },
      ],
    },
  },

  {
    slug: "save-the-date-original",
    cle: "save-the-date",
    nom: "Save the date",
    emoji: "📅",
    famille: "amour",
    titleTag: "Save the date original : la carte à gratter du mariage",
    metaDescription:
      "Pose ta date dans la tête de tes invités : une carte à gratter avec ta photo, un lien à envoyer. Six à douze mois avant le jour J.",
    h1: "Poser ta date de mariage dans la tête de tes invités",
    intro:
      "Tu as la date et le lieu. Tu n'as ni le menu, ni le plan de table, ni la moindre idée du faire-part, et c'est parfaitement normal. Le save the date sert à une seule chose : que tes proches bloquent ce jour-là avant que quelqu'un d'autre ne leur prenne le week-end.",
    produitNom: "Save the date numérique à gratter",
    ogTitre: "Bloque la date. Gratte pour la voir",
    accroche:
      "Quand l'envoyer, ce qu'il contient, et la règle à ne pas casser.",
    sections: [
      {
        titre: "Quand l'envoyer",
        corps:
          "Six à douze mois avant, c'est la fenêtre. Six mois suffisent pour un mariage près de chez toi, hors haute saison. Passe à huit ou douze si tu te maries à l'étranger, en plein mois d'août, sur un week-end de pont, ou si beaucoup d'invités viennent de loin. Plus tôt que douze mois, les gens oublient ; plus tard que six, les agendas sont déjà pris. Et envoie-le même si rien d'autre n'est calé : c'est exactement son intérêt.",
      },
      {
        titre: "Ce qu'il contient, ce qu'il ne contient pas",
        corps:
          "Il contient vos deux prénoms, la date, la ville ou la région, et la mention « invitation à suivre ». C'est tout. Il ne contient ni l'adresse exacte, ni l'horaire, ni le dress code, ni la liste de mariage, ni le lien du site des mariés : tout cela arrivera avec le faire-part, deux à trois mois avant. Un save the date trop bavard vide le faire-part de son contenu et prive tes invités de la vraie annonce.",
      },
      {
        titre: "La règle à ne pas casser",
        corps:
          "Toute personne qui reçoit un save the date doit recevoir une invitation. Sans exception. C'est la seule erreur vraiment coûteuse de cette étape : on envoie large « pour prévenir », puis on réduit la liste en cours de route, et on se retrouve à expliquer à un cousin pourquoi il a bloqué un samedi pour rien. Fais donc ta liste à peu près définitive avant d'envoyer, quitte à rester flou sur les plus-un.",
      },
    ],
    faq: [
      {
        q: "Quelle différence avec le faire-part ?",
        r: "Le save the date pose la date, le faire-part donne tous les détails et demande une réponse. Le premier part six à douze mois avant, le second deux à trois mois avant.",
      },
      {
        q: "On peut l'envoyer uniquement par message ?",
        r: "Oui. C'est un lien : SMS, WhatsApp ou mail. Rien n'est imprimé ni posté.",
      },
      {
        q: "Le lien reste valable jusqu'au mariage ?",
        r: "Oui, il n'expire pas. Tes invités peuvent y revenir pour retrouver la date.",
      },
      {
        q: "On peut en faire un pour les témoins et un autre pour le reste ?",
        r: "Oui : tu crées deux cartes, chacune avec sa photo, son texte et son lien. Elles se paient séparément.",
      },
      {
        q: "Et si la date change après l'envoi ?",
        r: "Le contenu d'une carte déjà payée est figé. Crée une nouvelle carte avec la bonne date et renvoie le nouveau lien — l'ancien continuera de fonctionner, préviens donc tes invités clairement.",
      },
    ],
    motsCles: [
      "save the date original",
      "quand envoyer save the date",
      "save the date mariage",
      "save the date numérique",
      "idée save the date",
      "annoncer la date de son mariage",
    ],
    demo: {
      code: "DEMOSTD",
      mechanic: "scratch",
      image: "/uploads/demo-savethedate.jpg",
      template: "save-the-date",
      title: "Sarah & Tom",
      subtitle: "vous invitent",
      body: "Réservez le 12 septembre 2026",
      accent: "#f2b594",
      alt: "Carte à gratter de save the date, date cachée sous la photo",
    },
    liens: {
      titre: "Avant et après le save the date",
      items: [
        {
          vers: "annonce-fiancailles-originale",
          ancre: "l'annonce de fiançailles",
          phrase:
            "Si la date n'est pas encore posée, {lien} suffit largement pour l'instant — le save the date viendra après la réservation du lieu.",
        },
        {
          vers: "annonce-mariage-originale",
          ancre: "la page sur l'annonce de mariage",
          phrase:
            "Et pour la question « qui prévient-on, et dans quel ordre », tout est dans {lien}.",
        },
      ],
    },
  },

  {
    slug: "annonce-mariage-originale",
    cle: "mariage",
    nom: "Annonce de mariage",
    emoji: "💌",
    famille: "amour",
    titleTag: "Annoncer son mariage : la carte à gratter originale",
    metaDescription:
      "On se marie. Ta photo devient une carte à gratter, tes proches frottent l'écran et la date apparaît. Un lien à envoyer, rien à imprimer.",
    h1: "Annoncer ton mariage avant même d'avoir choisi la salle",
    intro:
      "Tu as dit oui quelque part entre le dessert et le trajet du retour, et depuis tu tiens un secret à deux. Avant la salle, le traiteur et le plan de table, il y a cette étape-là : le dire, et bien le dire. Ta photo devient une carte à gratter, ils frottent, la nouvelle apparaît.",
    produitNom: "Carte à gratter pour annoncer un mariage",
    ogTitre: "On se marie. Gratte pour la date",
    accroche:
      "Annoncer avant d'avoir la salle, sans vexer ceux qui ne viendront pas.",
    sections: [
      {
        titre: "Qui prévenir en premier, et pourquoi ça compte",
        corps:
          "L'ordre des annonces crée plus de froissements que le plan de table. Les parents des deux côtés d'abord, si possible le même jour. Puis les futurs témoins : leur demander est une annonce à part entière, et beaucoup la ratent en la glissant dans un message groupé. Ensuite la famille proche, puis les amis. Les réseaux sociaux en dernier, une fois que plus personne ne risque de l'apprendre par une story. Compte une semaine pour dérouler tout ça, pas une soirée.",
      },
      {
        titre: "Ce que l'annonce doit dire, et ce qui peut attendre",
        corps:
          "À ce stade, trois informations suffisent : vos deux prénoms, le fait que vous vous mariez, et la date si tu l'as. Si tu ne l'as pas encore, dis-le franchement — « on se marie, la date arrive ». La ville suffit, l'adresse viendra plus tard. Ne mets ni horaire, ni liste de mariage, ni dress code : tu viderais le faire-part de sa raison d'être. Et n'écris pas « vous êtes invités » tant que la liste n'est pas arrêtée, c'est une promesse difficile à reprendre.",
      },
      {
        titre: "Le cas des gens que tu n'inviteras pas",
        corps:
          "Une annonce large touche forcément des personnes qui ne seront pas sur la liste. C'est le moment le plus délicat, et il se gère avant, pas après. Deux options. Soit tu annonces largement en restant sur « on se marie », sans parler d'invitation, et les faire-part arrivent plus tard sans ambiguïté. Soit tu gardes l'annonce pour le cercle qui sera présent et tu préviens les autres de vive voix. Les deux marchent, à condition de choisir.",
      },
    ],
    faq: [
      {
        q: "C'est un faire-part ou une annonce ?",
        r: "Une annonce. Elle sert à dire la nouvelle, pas à donner l'heure du vin d'honneur. Pour les détails et les réponses, il te faudra un faire-part à part.",
      },
      {
        q: "On peut en faire plusieurs versions ?",
        r: "Oui : une carte par version, chacune avec sa photo, son texte et son lien. Pratique pour une annonce aux témoins différente de celle à la famille. Chaque carte se paie séparément.",
      },
      {
        q: "Le lien marche combien de temps ?",
        r: "Il n'expire pas. Tu pourras le rouvrir après le mariage, c'est devenu un petit souvenir.",
      },
      {
        q: "Les invités doivent installer quelque chose ?",
        r: "Non. Ils cliquent sur le lien, ils grattent avec le doigt, c'est tout.",
      },
      {
        q: "On peut mettre une photo de nous deux prise au téléphone ?",
        r: "Oui, et c'est souvent le meilleur choix. Le cadrage est carré : vérifie juste que vous êtes bien tous les deux dans le carré, pas coupés sur les côtés.",
      },
    ],
    motsCles: [
      "annonce mariage originale",
      "comment annoncer son mariage",
      "idée annonce mariage",
      "faire-part mariage original",
      "annoncer son mariage à ses proches",
      "carte à gratter mariage",
    ],
    demo: {
      code: "DEMOREEL",
      mechanic: "scratch",
      image: "/uploads/demo-fiancailles.jpg",
      template: "mariage",
      title: "Margaux & Antoine",
      subtitle: "se marient",
      body: "Le 14 septembre 2026 à Étretat",
      accent: "#ef9bb4",
      alt: "Carte à gratter d'annonce de mariage, date cachée sous la photo",
    },
    liens: {
      titre: "Les étapes voisines",
      items: [
        {
          vers: "save-the-date-original",
          ancre: "un save the date",
          phrase:
            "Une fois la date et le lieu arrêtés, {lien} est l'envoi suivant : il bloque le week-end dans les agendas.",
        },
        {
          vers: "faire-part-mariage-deux-femmes",
          ancre: "la page écrite pour vous deux",
          phrase:
            "Si vous êtes deux femmes et que la papeterie classique vous laisse dehors, {lien} reprend la question des formules et des prénoms.",
        },
        {
          vers: "faire-part-mariage-deux-hommes",
          ancre: "celle-ci",
          phrase:
            "Pour deux hommes qui se marient, c'est {lien}, avec l'envoi en deux temps qui évite les « je l'ai appris par Insta ».",
        },
      ],
    },
  },

  {
    slug: "faire-part-mariage-deux-femmes",
    cle: "mariage-femmes",
    nom: "Mariage de deux femmes",
    emoji: "👰",
    famille: "amour",
    titleTag: "Faire-part mariage deux femmes : le polaroid",
    metaDescription:
      "Un faire-part où vous êtes toutes les deux : ta photo se développe comme un polaroid et l'annonce apparaît. Vos mots, pas un modèle.",
    h1: "Un faire-part où vous êtes toutes les deux, enfin",
    intro:
      "Tu cherches un faire-part depuis deux semaines et tu tombes sur les mêmes silhouettes : une robe, un costume, et vos prénoms qui ne rentrent nulle part. Ici, c'est ta photo qui fait le faire-part. On clique, elle se développe comme un polaroid, et l'annonce apparaît dessous.",
    produitNom: "Faire-part de mariage pour deux femmes, à développer",
    ogTitre: "Elles se marient. Développe la photo",
    accroche:
      "Des mots qui vous vont, là où la papeterie classique vous oublie.",
    sections: [
      {
        titre: "Des mots qui vous vont",
        corps:
          "La papeterie classique est écrite pour un couple homme-femme : « la mariée », « le marié », « Monsieur et Madame ». Rien ne t'oblige à y rentrer. « Julie & Emma se marient » dit exactement ce qu'il faut. Pour la formule des parents, « les parents de Julie et d'Emma ont la joie de… » remplace sans heurt les tournures traditionnelles. Si l'une de vous change de nom, ou aucune des deux, l'annonce est l'endroit où le dire une bonne fois. Lis la phrase à voix haute : si elle sonne faux, c'est qu'elle n'est pas de vous.",
      },
      {
        titre: "La photo, c'est vous deux",
        corps:
          "Le format se développe comme un polaroid : plus la photo est simple, plus l'effet est fort. Vous deux, cadrées serré, en lumière naturelle. Pas besoin d'une séance pro — une photo de téléphone prise un dimanche fonctionne souvent mieux qu'un shooting posé. Évite les plans larges où l'on vous cherche, les photos de groupe et les images prises de nuit. Le cadrage est carré : ce qui dépasse sur les côtés sera coupé, alors laisse-vous de la marge.",
      },
      {
        titre: "Prévenir les familles avant la diffusion large",
        corps:
          "Selon les familles, l'annonce est une formalité ou un moment plus chargé. Si une partie de l'entourage découvre à la fois le mariage et le couple, un appel avant le lien évite que la nouvelle arrive par un écran. Décidez à deux qui s'occupe de quel côté, et gardez-vous deux ou trois jours avant l'envoi large. Pour le reste, vous ne devez d'explication à personne : l'annonce dit que vous vous mariez, pas pourquoi.",
      },
    ],
    faq: [
      {
        q: "Il y a des modèles pensés pour deux mariées ?",
        r: "Tu écris toi-même le titre, le sous-titre et la phrase du bas. Rien n'est pré-rempli avec « le marié » ou « la mariée » : tu mets vos deux prénoms et le texte que vous voulez.",
      },
      {
        q: "On peut avoir plusieurs formats pour la même annonce ?",
        r: "Oui : le polaroid à développer, le ticket à gratter et l'enveloppe à ouvrir. Prendre deux ou trois formats coûte moins cher que deux ou trois cartes séparées.",
      },
      {
        q: "Ça s'ouvre sur tous les téléphones ?",
        r: "Oui, c'est une page web. Un doigt sur mobile, un clic sur ordinateur, aucune appli à installer.",
      },
      {
        q: "On peut voir le rendu avant de payer ?",
        r: "Oui. Une page d'aperçu te montre ta photo et ton texte dans le format choisi. Tu paies seulement si ça te plaît.",
      },
      {
        q: "On peut envoyer le même lien aux deux familles ?",
        r: "Oui, un lien se partage sans limite. Beaucoup préfèrent quand même deux cartes, avec une photo et un texte différents de chaque côté.",
      },
    ],
    motsCles: [
      "faire-part mariage deux femmes",
      "faire-part mariage lesbien",
      "annonce mariage couple de femmes",
      "faire-part mariage original",
      "faire-part mariage LGBT",
      "annoncer son mariage",
    ],
    demo: {
      code: "DEMOMARIAGEF",
      mechanic: "polaroid",
      image: "/uploads/demo-mariage-femmes.jpg",
      template: "mariage",
      title: "Julie & Emma",
      subtitle: "se marient",
      body: "Le 20 juin 2026 à Aix-en-Provence",
      accent: "#ef9bb4",
      alt: "Polaroid de faire-part de mariage de deux femmes, en développement",
    },
    liens: {
      titre: "Pour la suite de l'organisation",
      items: [
        {
          vers: "save-the-date-original",
          ancre: "le save the date",
          phrase:
            "Si le faire-part complet n'est pas prêt, {lien} permet déjà de bloquer la date dans les agendas.",
        },
        {
          vers: "annonce-mariage-originale",
          ancre: "l'ordre des annonces",
          phrase:
            "Et pour savoir qui prévenir en premier sans vexer personne, {lien} détaille la marche à suivre.",
        },
      ],
    },
  },

  {
    slug: "faire-part-mariage-deux-hommes",
    cle: "mariage-hommes",
    nom: "Mariage de deux hommes",
    emoji: "🤵",
    famille: "amour",
    titleTag: "Faire-part mariage deux hommes : la carte à gratter",
    metaDescription:
      "Ta photo devient une carte à gratter : ils frottent l'écran, l'annonce apparaît. Vos prénoms, vos mots, aucun modèle à corriger.",
    h1: "Annoncer ton mariage sans passer par la case faire-part générique",
    intro:
      "Il y a le moment où vous décidez, et celui où vous le dites. Entre les deux, il y a souvent deux semaines passées à chercher un faire-part qui ne ressemble pas à un modèle rempli à la va-vite. Ta photo devient un ticket à gratter : ils frottent l'écran, l'annonce apparaît.",
    produitNom: "Faire-part de mariage pour deux hommes, à gratter",
    ogTitre: "Ils se marient. Gratte pour la date",
    accroche:
      "Écrire sans modèle à corriger, et envoyer la nouvelle en deux temps.",
    sections: [
      {
        titre: "Écrire sans chercher le modèle qui n'existe pas",
        corps:
          "Les générateurs de texte proposent « le marié et la mariée », et tu passes une heure à corriger. Pars plutôt de la phrase la plus simple : « Marc & Thomas se marient », suivie de la date et du lieu. « Les futurs mariés », « nos deux mariés », « M. & M. » fonctionnent très bien si tu veux une formule. Pour l'humour, dose : une annonce drôle vieillit mal quand on la relit à trois cents personnes. Une phrase vraie vaut mieux qu'une punchline.",
      },
      {
        titre: "Envoyer en deux temps",
        corps:
          "Un premier envoi au noyau dur : parents, frères et sœurs, témoins pressentis, les cinq amis qui étaient là avant tout le monde. Puis, deux ou trois jours plus tard, l'envoi large. Ça laisse à ceux qui comptent le temps de vous appeler avant que la nouvelle devienne publique, et ça évite les « je l'ai appris par Insta ». Si certains proches sont peu à l'aise avec les écrans, appelle-les d'abord : le lien viendra ensuite, comme souvenir.",
      },
      {
        titre: "Pourquoi le grattage change la réaction",
        corps:
          "Une image statique se regarde une seconde puis se scrolle. Une carte à gratter oblige à poser le doigt, et ce geste fabrique deux ou trois secondes d'attente. C'est court, mais c'est là que se joue la réaction — et c'est aussi ce qui donne envie de filmer la tête de l'autre pendant qu'il gratte. Si tu veux inverser l'effet, tu peux mettre le texte par-dessus et faire gratter pour révéler la photo dessous.",
      },
    ],
    faq: [
      {
        q: "Je peux choisir ce qui est caché : la photo ou le texte ?",
        r: "Oui, sur le ticket à gratter. Par défaut on gratte la photo pour révéler le texte, mais tu peux inverser et faire gratter le texte pour révéler la photo.",
      },
      {
        q: "C'est un vrai faire-part avec RSVP ?",
        r: "Non, c'est une annonce : elle transmet la nouvelle et la date. Pour collecter les réponses, prévois un mail, un formulaire ou ton numéro dans le texte.",
      },
      {
        q: "Combien de personnes peuvent gratter ?",
        r: "Autant que tu veux. Le lien se partage sans limite et la carte se regratte à chaque ouverture.",
      },
      {
        q: "Rien n'est imprimé ?",
        r: "Non, tout est numérique. Tu reçois un lien, tu l'envoies, il n'y a ni impression ni envoi postal.",
      },
      {
        q: "On peut faire deux cartes avec deux photos différentes ?",
        r: "Oui. Chaque carte est indépendante : sa photo, son texte, son lien. Pratique pour distinguer l'annonce aux proches de celle au reste du carnet d'adresses.",
      },
    ],
    motsCles: [
      "faire-part mariage deux hommes",
      "faire-part mariage gay",
      "annonce mariage couple d'hommes",
      "faire-part mariage homme homme",
      "annoncer son mariage originalement",
      "carte à gratter mariage",
    ],
    demo: {
      code: "DEMOMARIAGEH",
      mechanic: "scratch",
      image: "/uploads/demo-mariage-hommes.jpg",
      template: "mariage",
      title: "Marc & Thomas",
      subtitle: "se marient",
      body: "Le 5 septembre 2026 à Lyon",
      accent: "#f2b594",
      alt: "Carte à gratter de faire-part de mariage de deux hommes",
    },
    liens: {
      titre: "À lire dans la foulée",
      items: [
        {
          vers: "annonce-mariage-originale",
          ancre: "la page annonce de mariage",
          phrase:
            "La question des invités qu'on ne pourra pas inviter est traitée en détail sur {lien} — c'est le passage le plus délicat.",
        },
        {
          vers: "save-the-date-original",
          ancre: "le save the date",
          phrase:
            "Et si l'envoi en deux temps te tente, {lien} est tout indiqué pour la seconde vague.",
        },
      ],
    },
  },

  /* ============================================================
     Côté fêtes
     ============================================================ */
  {
    slug: "invitation-anniversaire-originale",
    cle: "anniversaire",
    nom: "Invitation d'anniversaire",
    emoji: "🎂",
    famille: "fetes",
    titleTag: "Invitation anniversaire : l'enveloppe à ouvrir",
    metaDescription:
      "Ton invitation s'ouvre comme une enveloppe : ta photo, ta date, ton adresse dedans. Un lien à coller dans le groupe, aucune appli à installer.",
    h1: "Inviter à ton anniversaire sans noyer l'info dans un groupe WhatsApp",
    intro:
      "Tu veux voir du monde, pas remplir un tableur. Le problème des invitations d'anniversaire n'est pas le design : c'est que le message se perd au milieu de la conversation de groupe et que personne ne note la date. Ici, l'invitation est une enveloppe qu'on ouvre, alors on la regarde vraiment.",
    produitNom: "Invitation d'anniversaire numérique à ouvrir",
    ogTitre: "T'es invité. Ouvre l'enveloppe",
    accroche:
      "Faire venir les gens — et monter une surprise sans vendre la mèche.",
    sections: [
      {
        titre: "Faire venir les gens, pas juste les prévenir",
        corps:
          "Une invitation qui marche répond à quatre questions en une phrase : quand, où, à quelle heure, faut-il répondre. Ajoute ensuite ce qu'on oublie toujours et qui change tout : jusqu'à quelle heure ça dure, s'il y a un vrai repas ou juste de quoi grignoter, si on peut venir accompagné, si les enfants sont les bienvenus. Envoie trois semaines avant pour un samedi soir, et relance une fois à cinq jours. La relance n'est pas impolie, elle est indispensable.",
      },
      {
        titre: "Les anniversaires à dizaine se préparent plus tôt",
        corps:
          "30, 40, 50 ans : les gens viennent de loin, posent parfois une nuit d'hôtel ou un vendredi de congé. Six semaines d'avance, c'est le minimum ; deux mois, c'est mieux. Dis clairement s'il y a un thème, une couleur ou un dress code, sinon la moitié arrivera en jean et l'autre en paillettes. Et si tu ne veux pas de cadeaux, écris-le dans l'invitation : c'est le seul endroit où ça passe sans mettre personne mal à l'aise.",
      },
      {
        titre: "Organiser une surprise sans vendre la mèche",
        corps:
          "Pour une surprise, le lien part à tout le monde sauf à la personne concernée. Mets l'heure d'arrivée des invités trente minutes avant la sienne, et écris-la en grand : c'est le détail qui rate le plus souvent. Demande les réponses en message privé, jamais dans un groupe où elle pourrait être. Petit piège à connaître : le titre que tu donnes à ta carte s'affiche dans l'aperçu du lien sur WhatsApp. Mets-y « Samedi soir » plutôt que « Surprise pour Camille ».",
      },
    ],
    faq: [
      {
        q: "Je peux l'envoyer dans un groupe WhatsApp ?",
        r: "Oui, c'est un lien classique. Tu le colles dans le groupe, par SMS, par mail ou en story. Chacun l'ouvre de son côté.",
      },
      {
        q: "Combien de personnes peuvent l'ouvrir ?",
        r: "Il n'y a pas de limite. Le même lien sert pour trois invités comme pour cent, et l'enveloppe se rouvre à chaque visite.",
      },
      {
        q: "Les invités doivent créer un compte ?",
        r: "Non. Ils cliquent, ils ouvrent, ils lisent. Rien à installer, rien à remplir.",
      },
      {
        q: "Il y a un système de réponse RSVP ?",
        r: "Non, pas pour l'instant. Mets ton numéro ou ton mail dans le texte de l'invitation, les réponses te reviendront directement.",
      },
      {
        q: "Je peux mettre une vieille photo de la personne ?",
        r: "C'est même souvent la meilleure idée, surtout pour une dizaine. Une photo de dix ans en arrière sous l'enveloppe fait toujours son effet.",
      },
    ],
    motsCles: [
      "invitation anniversaire originale",
      "texte invitation anniversaire",
      "invitation anniversaire 30 ans",
      "invitation anniversaire adulte",
      "invitation anniversaire surprise",
      "carte invitation anniversaire numérique",
    ],
    demo: {
      code: "DEMOANNIV",
      mechanic: "envelope",
      image: "/uploads/demo-anniversaire.jpg",
      template: "anniversaire",
      title: "Camille",
      subtitle: "fête ses 30 ans",
      body: "Samedi 5 juillet · 20h · chez Manu",
      accent: "#e8c547",
      alt: "Enveloppe d'invitation d'anniversaire prête à être ouverte",
    },
    liens: {
      titre: "Les autres soirées à organiser",
      items: [
        {
          vers: "invitation-cremaillere-originale",
          ancre: "une invitation de crémaillère",
          phrase:
            "Même enveloppe, autre occasion : {lien} a en plus tout un paragraphe sur l'adresse, l'étage et le code de l'immeuble.",
        },
        {
          vers: "annonce-diplome-originale",
          ancre: "annoncer un diplôme",
          phrase:
            "Si la fête célèbre une réussite plutôt qu'une date de naissance, va plutôt voir comment {lien}.",
        },
      ],
    },
  },

  {
    slug: "invitation-cremaillere-originale",
    cle: "cremaillere",
    nom: "Invitation de crémaillère",
    emoji: "🔑",
    famille: "fetes",
    titleTag: "Invitation crémaillère : l'enveloppe à ouvrir",
    metaDescription:
      "Nouvelle adresse, nouvelle invitation : une enveloppe à ouvrir avec ta photo, ton adresse et le code de l'immeuble dedans. Un lien à envoyer.",
    h1: "Inviter chez toi quand personne ne connaît encore l'adresse",
    intro:
      "Les cartons sont pliés, il reste une étagère à monter, et tu as déjà envie de voir du monde dans ce salon. Reste à faire venir les gens jusqu'à une adresse que personne ne connaît. L'invitation s'ouvre comme une enveloppe, avec ta photo du nouveau chez-toi à l'intérieur.",
    produitNom: "Invitation de crémaillère numérique à ouvrir",
    ogTitre: "Nouvelle adresse. Ouvre l'enveloppe",
    accroche:
      "L'adresse, l'étage, le code : l'invitation où tout doit être écrit.",
    sections: [
      {
        titre: "L'adresse, c'est le cœur de l'invitation",
        corps:
          "C'est le seul événement où tes invités ne savent pas où ils vont. Mets donc tout : numéro, rue, ville, étage, code de l'immeuble, nom sur l'interphone s'il n'est pas encore le tien. Ajoute la station la plus proche et un mot sur le stationnement — « parking difficile après 19 h » t'évitera trois appels paniqués. Si tu es en maison, précise si on sonne au portail ou si on pousse. Ces six lignes feront plus pour ta soirée que n'importe quel design.",
      },
      {
        titre: "Le bon moment pour la faire",
        corps:
          "Trop tôt, tu reçois au milieu des cartons et tu passes la soirée à t'excuser. Trop tard, l'effet nouveauté est retombé. Un à trois mois après l'emménagement, c'est la bonne fenêtre : l'essentiel est installé et les murs sont encore un sujet de conversation. Préviens deux à trois semaines à l'avance pour un samedi soir. Et si l'appartement est petit, assume deux tournées plutôt qu'une soirée où personne ne peut s'asseoir.",
      },
      {
        titre: "Dire ce que tu attends, ou pas",
        corps:
          "La crémaillère est le seul moment où parler cadeau n'est pas malpoli : les gens arriveront avec quelque chose, autant que ce soit utile. Tu peux écrire « pas de cadeau, viens avec une bouteille », ou glisser un lien vers une liste si tu as vraiment besoin de choses. Précise aussi le format : apéro dînatoire, repas assis, ou « on commande des pizzas ». Tes invités mangeront avant ou pas, et ça change toute la soirée.",
      },
    ],
    faq: [
      {
        q: "L'adresse est visible avant l'ouverture ?",
        r: "Le texte de l'invitation reste caché jusqu'à l'ouverture de l'enveloppe. En revanche, le titre que tu donnes à ta carte apparaît dans l'aperçu du lien sur WhatsApp : mets-y « Crémaillère » plutôt que ton adresse.",
      },
      {
        q: "Je peux mettre une photo de l'appartement ?",
        r: "Oui, c'est même l'idée. Le salon, la vue, la clé dans la serrure, la pile de cartons : tout fonctionne.",
      },
      {
        q: "Combien de personnes peuvent ouvrir le lien ?",
        r: "Autant que tu veux, il n'y a pas de limite. Le lien se repartage librement.",
      },
      {
        q: "Je peux l'envoyer par mail ?",
        r: "Oui : SMS, WhatsApp, mail, peu importe. C'est une page web, elle s'ouvre sur n'importe quel téléphone.",
      },
      {
        q: "Et si j'organise deux soirées différentes ?",
        r: "Crée deux cartes, une par tournée, avec chacune sa date et son lien. Tu envoies le bon lien au bon groupe, sans que personne ne voie l'autre date.",
      },
    ],
    motsCles: [
      "invitation crémaillère originale",
      "texte invitation crémaillère",
      "invitation pendaison de crémaillère",
      "idée invitation crémaillère",
      "carte invitation crémaillère",
      "invitation crémaillère numérique",
    ],
    demo: {
      code: "DEMOCREMA",
      mechanic: "envelope",
      image: "/uploads/demo-cremaillere.jpg",
      template: "save-the-date",
      title: "Crémaillère",
      subtitle: "chez Léa & Max",
      body: "Samedi 19 juillet · 19h · 12 rue des Lilas",
      accent: "#e8c547",
      alt: "Enveloppe d'invitation de crémaillère prête à être ouverte",
    },
    liens: {
      titre: "Dans le même esprit",
      items: [
        {
          vers: "invitation-anniversaire-originale",
          ancre: "l'invitation d'anniversaire",
          phrase:
            "Si la soirée est aussi l'occasion de fêter autre chose, {lien} traite la question des relances et des surprises.",
        },
        {
          vers: "annonce-diplome-originale",
          ancre: "la page diplôme",
          phrase:
            "Et pour une pendaison de crémaillère qui tombe juste après la fin des études, {lien} donne de quoi écrire les deux en une seule carte.",
        },
      ],
    },
  },

  {
    slug: "annonce-diplome-originale",
    cle: "diplome",
    nom: "Annonce de diplôme",
    emoji: "🎓",
    famille: "fetes",
    titleTag: "Annoncer son diplôme : la carte à gratter originale",
    metaDescription:
      "C'est validé. Ta photo devient une carte à gratter : ils frottent, ils découvrent ce que tu viens de décrocher et quand on fête ça.",
    h1: "Annoncer ton diplôme à ceux qui t'ont vu galérer",
    intro:
      "Trois ans, cinq ans, ou une année qui a compté double. Le résultat tombe un matin sur un portail en ligne parfaitement moche, et tu as envie de le dire autrement qu'avec une capture d'écran. Ta photo devient une carte à gratter : ils frottent, et ils découvrent ce que tu viens de décrocher.",
    produitNom: "Carte à gratter pour annoncer un diplôme",
    ogTitre: "C'est validé. Gratte pour voir quoi",
    accroche:
      "Le dire sans avoir l'air de se la raconter, et inviter dans la foulée.",
    sections: [
      {
        titre: "Le dire sans avoir l'air de se la raconter",
        corps:
          "La différence tient à une chose : parler du chemin plutôt que du titre. « Master validé » est une information. « Cinq ans, deux déménagements et un mémoire écrit en quinze jours : c'est validé » est une histoire. Mentionne ceux qui ont tenu la corde — les parents qui ont relu, la colocataire qui a supporté la période de révisions. Et si le diplôme a été dur à obtenir, tu as le droit de l'écrire : ça rend l'annonce plus juste qu'un simple « diplômée ».",
      },
      {
        titre: "Enchaîner avec l'invitation",
        corps:
          "La plupart du temps, l'annonce et la fête vont ensemble. Tu peux tout mettre sur la même carte : le diplôme dans le titre, la date et le lieu de la soirée juste en dessous. Prévois deux à trois semaines d'avance si tes amis partent en stage ou en vacances, parce que juillet vide les agendas très vite. Et si la remise officielle a lieu en amphi avec deux places par étudiant, dis-le franchement : ceux qui ne pourront pas venir le comprendront mieux écrit que sous-entendu.",
      },
      {
        titre: "La photo : la toge, le diplôme, ou autre chose",
        corps:
          "Si tu as la photo de remise, c'est elle. Sinon, tout fonctionne : le diplôme posé sur une table, la pile de bouquins enfin fermée, toi devant la fac un dernier jour. Sur un petit écran, un plan serré en lumière de jour l'emporte toujours sur une photo de groupe prise de loin. Et si tu n'as rien de potable, mets ton visage : c'est toi qu'on a envie de voir, pas le papier.",
      },
    ],
    faq: [
      {
        q: "Je peux annoncer et inviter sur la même carte ?",
        r: "Oui. Mets le diplôme dans le titre et les infos de la fête dans la phrase du bas. Tout apparaît en même temps à la révélation.",
      },
      {
        q: "Ça marche pour le bac ou un concours ?",
        r: "Oui, c'est le même principe : une photo, un texte caché, un lien à envoyer. Rien n'est spécifique à un type de diplôme.",
      },
      {
        q: "Mes proches doivent créer un compte ?",
        r: "Non. Ils ouvrent le lien et ils grattent, c'est tout.",
      },
      {
        q: "Je récupère mon lien quand ?",
        r: "Juste après le paiement. Il s'affiche à l'écran et part aussi par email.",
      },
      {
        q: "Je peux l'envoyer avant d'avoir la photo de remise ?",
        r: "Oui, et c'est même le cas le plus fréquent : les résultats tombent des mois avant la cérémonie. N'importe quelle photo de toi fait l'affaire en attendant.",
      },
    ],
    motsCles: [
      "annonce diplôme originale",
      "annoncer sa réussite au diplôme",
      "invitation remise de diplôme",
      "annoncer son bac",
      "fête de diplôme invitation",
      "carte annonce diplôme",
    ],
    demo: {
      code: "DEMODIPLOME",
      mechanic: "scratch",
      image: "/uploads/demo-diplome.jpg",
      template: "save-the-date",
      title: "Léa est diplômée !",
      subtitle: "Master 2 validé 🎓",
      body: "On fête ça samedi soir · 20h",
      accent: "#e8c547",
      alt: "Carte à gratter d'annonce de diplôme, résultat caché sous la photo",
    },
    liens: {
      titre: "Et pour la soirée qui va avec",
      items: [
        {
          vers: "invitation-anniversaire-originale",
          ancre: "la page invitation d'anniversaire",
          phrase:
            "Les conseils de relance et d'horaires valent pour toutes les soirées : {lien} les détaille.",
        },
        {
          vers: "invitation-pot-de-depart-retraite",
          ancre: "le pot de départ",
          phrase:
            "À l'autre bout de la vie professionnelle, {lien} pose les mêmes questions de ton et de créneau.",
        },
      ],
    },
  },

  {
    slug: "invitation-pot-de-depart-retraite",
    cle: "retraite",
    nom: "Pot de départ en retraite",
    emoji: "🥂",
    famille: "fetes",
    titleTag: "Invitation pot de départ retraite : l'enveloppe",
    metaDescription:
      "Une invitation de pot de départ qui change du mail interne : une enveloppe à ouvrir, ta photo d'équipe dedans. Un lien à transférer.",
    h1: "Organiser le pot de départ sans mail d'entreprise déprimant",
    intro:
      "Quarante ans de maison, et le risque c'est un mail interne avec « pot de départ » en objet et trois réponses. La personne mérite mieux, et les collègues ont envie de venir : il faut juste que l'invitation arrive autrement. Celle-ci s'ouvre comme une enveloppe, avec la photo que tu auras choisie.",
    produitNom: "Invitation de pot de départ en retraite, à ouvrir",
    ogTitre: "Pot de départ. Ouvre l'enveloppe",
    accroche:
      "Faire circuler sans fuite, viser le bon créneau, trouver le bon ton.",
    sections: [
      {
        titre: "Faire circuler l'invitation sans que ça fuite",
        corps:
          "Si c'est une surprise, le lien ne passe pas par la messagerie professionnelle : SMS, WhatsApp, ou de la main à la main. Désigne une seule personne pour centraliser les réponses et la collecte du cadeau, sinon trois cagnottes circuleront en parallèle. Préviens aussi les anciens collègues partis ailleurs et les retraités de l'équipe : ce sont eux qui font la différence le jour J, et ce sont toujours eux qu'on oublie. Un lien unique rend ça simple, il suffit de le transférer.",
      },
      {
        titre: "Le bon créneau",
        corps:
          "Fin d'après-midi, entre 17 h et 18 h 30, un jeudi ou un vendredi : c'est le créneau qui remplit la salle. Évite le tout dernier jour, souvent chargé en passation de dossiers et en émotion — la semaine d'avant est plus confortable pour tout le monde. Indique une heure de début et une heure de fin : les collègues qui ont un train ou une nounou sauront s'ils peuvent passer. Et précise si les conjoints sont invités, c'est la question qui revient toujours.",
      },
      {
        titre: "Le ton : ni enterrement ni roast",
        corps:
          "Deux pièges. L'invitation triste qui parle de « fin de carrière » comme d'un décès, et la blague de trop sur l'âge. Le bon réglage est simple : parler de ce que la personne laisse, pas de ce qu'elle arrête. « Trente-deux ans à tenir ce service à bout de bras » dit plus que « bonne retraite ». Si tu veux de l'humour, mets-le sur la logistique, pas sur elle. Et laisse une ligne pour dire pourquoi vous venez tous : c'est celle qu'elle relira.",
      },
    ],
    faq: [
      {
        q: "On peut l'envoyer à des collègues qui ont quitté l'entreprise ?",
        r: "Oui. C'est un simple lien, il se transfère à qui tu veux, y compris à des gens qui n'ont plus d'adresse interne.",
      },
      {
        q: "On peut mettre une photo d'équipe ?",
        r: "Oui. Une vieille photo d'équipe retrouvée dans un dossier partagé fait souvent plus d'effet qu'une photo récente.",
      },
      {
        q: "On peut s'en servir pour le cadeau plutôt que pour l'invitation ?",
        r: "Oui. Certains envoient la carte à la personne elle-même le jour du pot : elle ouvre l'enveloppe et découvre un message de l'équipe.",
      },
      {
        q: "Les collègues doivent installer quelque chose ?",
        r: "Non. Le lien s'ouvre dans le navigateur, sur ordinateur comme sur téléphone.",
      },
      {
        q: "Ça passe les filtres de la messagerie du bureau ?",
        r: "C'est une page web ordinaire, pas une pièce jointe. Si ton entreprise bloque les domaines externes, passe par SMS ou par une messagerie personnelle — c'est de toute façon plus sûr pour une surprise.",
      },
    ],
    motsCles: [
      "invitation pot de départ retraite",
      "texte invitation départ retraite",
      "invitation départ retraite originale",
      "annoncer un départ à la retraite",
      "pot de départ collègue",
      "carte départ retraite",
    ],
    demo: {
      code: "DEMORETRAITE",
      mechanic: "envelope",
      image: "/uploads/demo-retraite.jpg",
      template: "save-the-date",
      title: "Pot de départ",
      subtitle: "Martine part en retraite",
      body: "Vendredi 27 juin · 18h · au bureau",
      accent: "#e8c547",
      alt: "Enveloppe d'invitation à un pot de départ en retraite",
    },
    liens: {
      titre: "Deux voisines utiles",
      items: [
        {
          vers: "invitation-anniversaire-originale",
          ancre: "l'invitation d'anniversaire",
          phrase:
            "Pour un départ qui tombe la même semaine qu'un anniversaire rond, {lien} aide à doser les deux.",
        },
        {
          vers: "annonce-diplome-originale",
          ancre: "l'annonce de diplôme",
          phrase:
            "Et si c'est une reconversion plutôt qu'une retraite, {lien} a le bon ton pour célébrer un nouveau départ.",
        },
      ],
    },
  },
] as const satisfies readonly Occasion[];

/**
 * Le type exact d'une entrée du tableau — littéraux compris.
 * On le préfère à `Occasion` pour les valeurs de retour : `Occasion.slug`
 * est un `string` quelconque, alors qu'ici c'est l'une des 13 valeurs. Les
 * composants qui reçoivent un slug (CTA, analytics) exigent cette précision.
 */
export type OccasionItem = (typeof OCCASIONS)[number];

/** Union fermée des 13 slugs — une faute de frappe ne compile pas. */
export type OccasionSlug = OccasionItem["slug"];

/** Ordre canonique des slugs (generateStaticParams, sitemap). */
export const OCCASION_SLUGS = OCCASIONS.map((o) => o.slug);

/**
 * Retrouve une occasion par son slug d'URL.
 * Retourne `undefined` sur un slug inconnu : à l'appelant d'appeler
 * `notFound()` — la page combine ça avec `dynamicParams = false`, donc en
 * pratique seul le dev local peut tomber sur ce cas.
 */
export function getOccasion(slug: string): OccasionItem | undefined {
  return OCCASIONS.find((o) => o.slug === slug);
}

/** Les occasions d'une famille, dans l'ordre du tableau. */
export function occasionsParFamille(famille: FamilleKey): OccasionItem[] {
  return OCCASIONS.filter((o) => o.famille === famille);
}
