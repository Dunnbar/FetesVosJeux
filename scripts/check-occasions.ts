/**
 * Contrôle des pages d'occasion — `npx tsx scripts/check-occasions.ts`.
 *
 * Trois choses que TypeScript ne peut pas vérifier tout seul :
 *
 *   1. les limites éditoriales (longueur des balises title et description,
 *      nombre de sections, de questions, de mots-clés) ;
 *   2. la cohérence avec scripts/clips.config.mjs, qui décrit les mêmes 13
 *      occasions pour le recorder Playwright — les deux fichiers doivent
 *      raconter la même histoire (même code de démo, même photo, même
 *      mécanique, même texte d'annonce) ;
 *   3. le duplicate content. C'est LE risque de treize pages bâties sur le
 *      même gabarit : si Google les juge interchangeables, il les déclasse
 *      toutes. On mesure donc la similarité en 4-grammes entre chaque paire
 *      de pages, et on échoue au-delà de 10 %.
 *
 * Le script sort en code 1 au premier problème, pour pouvoir être branché
 * sur un hook de pré-commit ou la CI.
 */
import { OCCASIONS, OCCASION_SLUGS, getOccasion } from "@/lib/occasions";
import { CLIPS } from "./clips.config.mjs";

type Clip = {
  code: string;
  slug: string;
  mechanic: string;
  image: string;
  template: string;
  title: string;
  subtitle: string;
  body: string;
  accent: string;
};

let ko = 0;
const fail = (m: string) => {
  console.log("KO  " + m);
  ko++;
};

console.log("Occasions :", OCCASIONS.length);
if (OCCASIONS.length !== 13) fail("il n'y a pas 13 occasions");

const slugs = new Set<string>(OCCASION_SLUGS);
if (slugs.size !== OCCASIONS.length) fail("slugs dupliqués");

for (const o of OCCASIONS) {
  if (!/^[a-z0-9-]+$/.test(o.slug)) fail(`${o.slug} : slug non kebab-case ASCII`);
  if (o.titleTag.length > 60)
    fail(`${o.slug} : titleTag ${o.titleTag.length} car. (max 60)`);
  if (o.metaDescription.length > 155)
    fail(`${o.slug} : metaDescription ${o.metaDescription.length} car. (max 155)`);
  // Comparaison élargie en `string` : les littéraux du tableau n'ayant, par
  // construction, aucun recouvrement, TypeScript refuse l'égalité telle
  // quelle. Il prouve donc déjà l'invariant — on garde le test pour le jour
  // où le contenu viendra d'ailleurs qu'un module `as const`.
  if ((o.h1 as string) === (o.titleTag as string))
    fail(`${o.slug} : h1 identique au titleTag`);
  if (o.sections.length !== 3) fail(`${o.slug} : ${o.sections.length} sections`);
  if (o.faq.length !== 5) fail(`${o.slug} : ${o.faq.length} questions`);
  if (o.motsCles.length !== 6) fail(`${o.slug} : ${o.motsCles.length} mots-clés`);
  if (o.liens.items.length < 2) fail(`${o.slug} : moins de 2 liens internes`);

  for (const l of o.liens.items) {
    if (!slugs.has(l.vers)) fail(`${o.slug} : lien mort vers ${l.vers}`);
    if (l.vers === o.slug) fail(`${o.slug} : lien vers lui-même`);
    if (!l.phrase.includes("{lien}"))
      fail(`${o.slug} : phrase de maillage sans jeton {lien}`);
  }

  // Le bloc `demo` doit être le reflet exact de clips.config.mjs.
  const clip = (CLIPS as Clip[]).find((c) => c.slug === o.cle);
  if (!clip) {
    fail(`${o.slug} : aucune entrée clips.config.mjs pour cle="${o.cle}"`);
    continue;
  }
  const champs = [
    "code",
    "mechanic",
    "image",
    "template",
    "title",
    "subtitle",
    "body",
    "accent",
  ] as const;
  for (const k of champs) {
    const ici = (o.demo as unknown as Record<string, unknown>)[k];
    const la = (clip as unknown as Record<string, unknown>)[k];
    if (ici !== la)
      fail(`${o.slug} : demo.${k} diverge de clips.config.mjs ("${String(ici)}" vs "${String(la)}")`);
  }
}

// Aucune page ne doit dépendre du seul index pour être atteinte.
for (const o of OCCASIONS) {
  const entrants = OCCASIONS.filter((x) =>
    x.liens.items.some((l) => l.vers === o.slug)
  ).length;
  if (entrants < 1) fail(`${o.slug} : orpheline, aucun lien contextuel entrant`);
}

if (getOccasion("slug-qui-nexiste-pas") !== undefined)
  fail("getOccasion accepte un slug inconnu");

/* ---- Duplicate content : similarité 4-grammes entre pages ---- */
const mots = (o: (typeof OCCASIONS)[number]) =>
  [o.intro, ...o.sections.map((s) => s.corps), ...o.faq.map((f) => `${f.q} ${f.r}`)]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const grammes = (w: string[]) =>
  new Set(w.slice(0, -3).map((_, i) => w.slice(i, i + 4).join(" ")));

const pages = OCCASIONS.map((o) => {
  const w = mots(o);
  return { slug: o.slug, g: grammes(w), n: w.length };
});

let max = 0;
let pire = "";
const scores: number[] = [];
for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    let inter = 0;
    for (const g of pages[i].g) if (pages[j].g.has(g)) inter++;
    const s = (2 * inter) / (pages[i].g.size + pages[j].g.size);
    scores.push(s);
    if (s > max) {
      max = s;
      pire = `${pages[i].slug} / ${pages[j].slug}`;
    }
  }
}
scores.sort((a, b) => a - b);

console.log("Mots par page :", pages.map((p) => p.n).join(", "));
console.log("Total :", pages.reduce((a, b) => a + b.n, 0), "mots");
console.log(
  `Similarité 4-grammes — max ${(max * 100).toFixed(1)} % (${pire}), médiane ${(
    scores[Math.floor(scores.length / 2)] * 100
  ).toFixed(1)} %`
);
if (max > 0.1) fail("deux pages dépassent 10 % de similarité");

console.log(ko === 0 ? "\nTOUT OK" : `\n${ko} PROBLÈME(S)`);
process.exit(ko === 0 ? 0 : 1);
