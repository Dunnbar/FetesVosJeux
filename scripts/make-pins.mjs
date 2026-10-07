// Génère les épingles Pinterest verticales 1000×1500 (ratio 2:3) — une par
// occasion — à partir des vraies cartes du site, plus le fichier
// d'accompagnement (pins.json + pins.csv) pour l'upload.
//
// Pour chaque occasion :
//   1. ouvre la démo /g/<CODE> et amène la carte dans son état « épingle » :
//      grattage d'une bande centrée sur le texte (on voit la photo ET
//      l'annonce qui émerge), polaroid développé, carte en train de sortir
//      de l'enveloppe ;
//   2. capture la carte seule (dSF 2, donc 2× la résolution d'affichage) ;
//   3. compose l'épingle : accroche en haut, carte au centre sur un halo à la
//      couleur de l'occasion, marque + quisygratte.fr en bas.
//
// Tourne SANS serveur de dev : par défaut tout est capturé contre la PROD.
// Les photos /uploads/demo-*.jpg y sont servies depuis le commit dc14889 ;
// serveLocalUploads() les sert malgré tout depuis public/ quand elles existent
// en local, ce qui permet de prévisualiser un visuel pas encore déployé.
//
// Usage :
//   node scripts/make-pins.mjs                      toute la série (13 épingles)
//   node scripts/make-pins.mjs DEMOREEL             une seule occasion
//   node scripts/make-pins.mjs DEMOREEL,DEMOANNIV   plusieurs, séparées par des virgules
//
// Variables d'environnement :
//   BASE=http://localhost:3000   viser le dev plutôt que la prod
//   PIN_BAND=0.20,0.58           bande grattée, en fraction de la hauteur de
//                                carte (défaut 0.20,0.58 ; surchargeable par
//                                occasion avec `band` dans pins.config.mjs)
//   PIN_OUT=pins                 dossier de sortie (défaut : pins/)
//
// Prérequis : Playwright + Chromium (`npx playwright install chromium`).
// Sorties :
//   pins/<slug>.png        aperçu local, dossier ignoré par git
//   pins/pins.json         manifeste
//   pins/pins.csv          prêt à importer (colonne « Media URL » remplie)
//   public/pins/<slug>.jpg copie servie par le site — c'est ELLE que Pinterest
//                          télécharge à l'import ; à committer et déployer.

import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { CLIPS, BRAND } from "./clips.config.mjs";
import { PINS } from "./pins.config.mjs";

const BASE = process.env.BASE || "https://www.quisygratte.fr";
const OUT_DIR = path.resolve(process.env.PIN_OUT || "pins");
const PUBLIC_DIR = path.resolve("public");
const ONLY = process.argv[2];

// ─────────────────────────────────────────────────────────────────────────────
// URL DE DESTINATION DES ÉPINGLES — LA SEULE CONSTANTE À TOUCHER
//
// ⚠️ À ALIGNER sur src/lib/occasions.ts dès que les pages SEO par occasion
// seront en ligne (un collègue est en train de les créer). Le pattern retenu
// est /idees/<urlSlug>, et les <urlSlug> vivent dans scripts/pins.config.mjs.
// Si le routage final diffère, c'est ICI et nulle part ailleurs qu'on corrige.
// Tant que les pages n'existent pas (elles renvoient 404 aujourd'hui), tu peux
// viser la home : const PIN_TARGET = () => `${PIN_HOST}/?utm_...`.
// On ne pointe JAMAIS vers /g/<CODE> : ces pages sont en robots noindex.
// Le www est explicite : l'apex renvoie un 308, autant épargner le saut.
const PIN_HOST = `https://www.${BRAND.domain}`;
// Les JPEG servis par le site, que Pinterest télécharge à l'import. Doivent
// être déployés AVANT d'importer le CSV, sinon chaque ligne échoue sur
// « URL de média manquante ».
const PUBLIC_PINS_DIR = path.resolve("public/pins");
const PIN_MEDIA_BASE = process.env.PIN_MEDIA_BASE || `${PIN_HOST}/pins`;
const mediaUrl = (m) => `${PIN_MEDIA_BASE}/${m.file.replace(/\.png$/, ".jpg")}`;
const PIN_TARGET = (urlSlug) =>
  `${PIN_HOST}/idees/${urlSlug}` +
  `?utm_source=pinterest&utm_medium=social&utm_campaign=pins&utm_content=${urlSlug}`;
// ─────────────────────────────────────────────────────────────────────────────

const PIN = { width: 1000, height: 1500 }; // ratio 2:3 recommandé par Pinterest
const CARD_VIEWPORT = { width: 540, height: 1200 }; // ≥ 498 : la carte reste à 450 px

// Grattage : on ne gratte pas du haut vers le bas (ça laisse un gros aplat
// crème dépourvu de photo), mais une BANDE horizontale centrée sur le texte de
// l'annonce. Résultat : photo en haut, photo en bas, et au milieu une fenêtre
// grattée aux bords déchirés d'où sortent le titre et le sous-titre — la date
// reste cachée, c'est elle qui fait cliquer. Fractions de la hauteur de carte.
const SCRATCH_BAND = (process.env.PIN_BAND || "0.20,0.58")
  .split(",")
  .map(Number);
const HARD_CEIL = 72; // jamais au-delà : le seuil de révélation est à 80
const POLAROID_SETTLE = 4300; // DEVELOP_DURATION_MS (3500) + marge
// L'enveloppe une fois posée laisse un vide : la carte sortie et le corps de
// l'enveloppe sont séparés de 20 px de fond sombre (openHeight = height*2+20).
// On capture donc la carte EN TRAIN de sortir, quand l'enveloppe la touche
// encore — c'est aussi plus parlant qu'une carte immobile.
const ENVELOPE_SLIDE = 1150; // ms après le clic (rabat 800 + début de sortie)
const ENVELOPE_TAIL = 70; // px d'enveloppe gardés sous la carte

const MAX_TITLE = 100;
const MAX_DESC = 500;
const MAX_ALT = 500;

// Les /uploads/demo-*.jpg ne sont pas déployés : en prod le canvas tomberait
// dans son img.onerror et peindrait un aplat gris, le polaroid resterait noir.
// On sert donc les fichiers depuis public/. L'en-tête CORS est OBLIGATOIRE :
// ScratchCanvas pose img.crossOrigin = "anonymous" (sinon canvas tainté), et
// sans access-control-allow-origin l'image serait rejetée.
async function serveLocalUploads(page) {
  await page.route("**/uploads/**", async (route) => {
    const { pathname } = new URL(route.request().url());
    try {
      const body = await readFile(path.join(PUBLIC_DIR, pathname));
      await route.fulfill({
        status: 200,
        contentType: pathname.endsWith(".png") ? "image/png" : "image/jpeg",
        headers: {
          "access-control-allow-origin": "*",
          "cache-control": "no-store",
        },
        body,
      });
    } catch {
      console.warn(`    ⚠ ${pathname} absent de public/ — la prod renverra 404`);
      await route.continue(); // pas de fichier local : on laisse passer
    }
  });
}

// Repris tel quel de record-series.mjs — no-op en prod, utile si BASE=localhost.
async function hideDevBadge(page) {
  await page
    .addStyleTag({
      content:
        "nextjs-portal,[data-next-badge-root],[data-next-badge],#__next-dev-tools-indicator,[data-nextjs-toast]{display:none!important}",
    })
    .catch(() => {});
}

// Repris tel quel de record-series.mjs.
async function waitCanvasPainted(page) {
  await page.waitForFunction(
    () => {
      const c = document.querySelector("canvas");
      if (!c) return false;
      const ctx = c.getContext("2d");
      if (!ctx) return false;
      try {
        const d = ctx.getImageData(
          Math.floor(c.width / 2),
          Math.floor(c.height / 2),
          1,
          1
        ).data;
        return d[3] > 10;
      } catch {
        return false;
      }
    },
    { timeout: 10000 }
  );
}

// waitCanvasPainted() passe aussi sur l'aplat gris du 404 : elle prouve qu'un
// canvas est peint, pas qu'une photo est chargée. On vérifie donc qu'il y a de
// la variance de couleur — un aplat uni = photo manquante.
async function assertPhotoLoaded(page, clip) {
  const flat = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let min = 255;
    let max = 0;
    for (let i = 0; i < d.length; i += 4 * 997) {
      const v = (d[i] + d[i + 1] + d[i + 2]) / 3;
      if (d[i + 3] < 128) continue; // pixel transparent : ignoré
      if (v < min) min = v;
      if (v > max) max = v;
    }
    return max - min < 12;
  });
  if (flat) {
    console.warn(
      `    ⚠ ${clip.code} : le cover est un aplat uni — la photo ${clip.image} n'a pas chargé.`
    );
  }
}

// Même formule que computeErasedPercent() dans ScratchCanvas.tsx (stride 32,
// seuil alpha 128) : notre chiffre et celui de l'app sont le même nombre.
const erasedPercent = (page) =>
  page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return 0;
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let erased = 0;
    let sampled = 0;
    for (let i = 3; i < d.length; i += 32) {
      sampled++;
      if (d[i] < 128) erased++;
    }
    return Math.round((erased / sampled) * 100);
  });

// Gratte en serpentin la bande [from, to] de la carte, sans jamais franchir le
// seuil de 80 % — au-delà, onReveal passe le canvas à opacity 0 et il ne reste
// plus rien à voir. On mesure après chaque ligne : filet de sécurité si une
// occasion demande une bande large.
async function scratchForPin(page, clip) {
  const [from, to] = PINS[clip.slug]?.band ?? SCRATCH_BAND;
  const box = await page.locator("canvas").boundingBox();
  if (!box) throw new Error("canvas introuvable");

  const M = 26; // même marge latérale que doScratch() du recorder
  const left = box.x + M;
  const right = box.x + box.width - M;
  const top = box.y + box.height * from;
  const bottom = box.y + box.height * to;

  await page.mouse.move(left, top);
  await page.mouse.down();
  let y = top;
  let toRight = true;
  let pct = 0;
  while (y <= bottom) {
    await page.mouse.move(toRight ? right : left, y, { steps: 14 });
    pct = await erasedPercent(page);
    if (pct >= HARD_CEIL) break;
    y += 24;
    if (y <= bottom) await page.mouse.move(toRight ? right : left, y, { steps: 4 });
    toRight = !toRight;
  }
  await page.mouse.up();
  await page.waitForTimeout(250);

  const revealed = await page.evaluate(
    () => document.querySelector("canvas").style.opacity === "0"
  );
  if (revealed) {
    throw new Error(
      `${clip.code} : seuil de 80 % franchi, la carte s'est révélée — resserre la bande (PIN_BAND ou pin.band)`
    );
  }
  return pct;
}

// Amène la carte dans son état « épingle » et renvoie le PNG (Buffer).
async function captureCardShot(browser, clip) {
  const ctx = await browser.newContext({
    viewport: CARD_VIEWPORT,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await serveLocalUploads(page);
  await page.goto(`${BASE}/g/${clip.code}`, { waitUntil: "networkidle" });
  await hideDevBadge(page);

  let shot;
  if (clip.mechanic === "scratch") {
    await waitCanvasPainted(page);
    await page.waitForTimeout(500);
    await assertPhotoLoaded(page, clip);
    const pct = await scratchForPin(page, clip);
    console.log(`    grattage ${pct} %`);
    shot = await page.locator("canvas").boundingBox();
  } else if (clip.mechanic === "polaroid") {
    const btn = page.getByRole("button", { name: "Développer le polaroid" });
    await btn.waitFor();
    await page.waitForTimeout(600);
    await btn.click();
    await page.waitForTimeout(POLAROID_SETTLE);
    shot = await btn.boundingBox();
  } else if (clip.mechanic === "envelope") {
    const btn = page.getByRole("button", { name: "Ouvrir l'enveloppe" });
    await btn.waitFor();
    await page.waitForTimeout(600);
    // Cadrage calculé AVANT le clic : la boîte de la carte ne bouge pas, et on
    // ne veut surtout pas mesurer pendant l'animation.
    const card = await page
      .locator("main > div.relative > div > div:first-child")
      .boundingBox();
    if (!card) throw new Error(`${clip.code} : carte intérieure introuvable`);
    shot = {
      x: card.x,
      y: card.y,
      width: card.width,
      height: card.height + ENVELOPE_TAIL,
    };
    await btn.click();
    await page.waitForTimeout(ENVELOPE_SLIDE);
  } else {
    throw new Error(`mécanique inconnue : ${clip.mechanic}`);
  }

  if (!shot) throw new Error(`${clip.code} : cadrage introuvable`);
  // page.screenshot({clip}) et NON locator.screenshot() : ce dernier attend la
  // stabilité de la boîte englobante et ré-attendrait la fin des transitions.
  const buf = await page.screenshot({ clip: shot });
  await ctx.close();
  return buf;
}

// Injecté dans la page via page.evaluate(fn, data) : Playwright sérialise
// l'argument, pas besoin de reconstruire la source comme dans record-series.
function buildPinOverlay(d) {
  // On masque le contenu réel de /creer : seule la police nous intéresse.
  for (const el of Array.from(document.body.children)) el.style.display = "none";

  const o = document.createElement("div");
  o.id = "__pin";
  o.innerHTML = `
    <div class="__top">
      <div class="__kicker">◆ ${d.kicker}</div>
      <div class="__hook">${d.lines.map((l, i) => `<span class="__l${i}">${l}</span>`).join("")}</div>
    </div>
    <div class="__stage">
      <div class="__halo"></div>
      <img class="__card" src="${d.img}" alt="">
    </div>
    <div class="__foot">
      <div class="__brand">${d.brandHtml}</div>
      <div class="__dom">${d.domain}</div>
    </div>`;

  const s = document.createElement("style");
  s.textContent = `
    html,body{margin:0;padding:0;overflow:hidden;background:#2d2438}
    #__pin{position:fixed;inset:0;z-index:99999;display:grid;
      grid-template-rows:340px 1fr 220px;
      background:radial-gradient(circle at 50% 24%, #3d3349 0%, #2d2438 62%);
      font-family:var(--font-display),system-ui,sans-serif;overflow:hidden}
    /* confettis — repris de CARD_BASE_CSS du recorder, trame agrandie (canevas 2× plus large) */
    #__pin:before{content:"";position:absolute;inset:0;opacity:.5;pointer-events:none;
      background-image:
        radial-gradient(circle at 14% 16%, #ef9bb4 1.8px, transparent 2.3px),
        radial-gradient(circle at 86% 30%, #e8c547 1.8px, transparent 2.3px),
        radial-gradient(circle at 28% 82%, #b5dcc1 1.8px, transparent 2.3px),
        radial-gradient(circle at 78% 90%, #f2b594 1.8px, transparent 2.3px);
      background-size:150px 150px}
    #__pin>*{position:relative}

    .__top{display:flex;flex-direction:column;align-items:center;justify-content:center;
      text-align:center;padding:0 48px}
    .__kicker{font-family:var(--font-mono),monospace;color:#e8c547;font-size:22px;
      font-weight:700;letter-spacing:.30em;text-transform:uppercase;margin-bottom:30px;
      padding-left:.30em}
    .__hook{color:#fbf6ee;font-weight:700;font-size:74px;line-height:1.06;
      letter-spacing:-0.03em;display:flex;flex-direction:column;gap:4px}
    .__hook span{display:block;white-space:nowrap}
    .__hook .__l1{color:${d.accent}}

    .__stage{display:flex;align-items:center;justify-content:center}
    .__halo{position:absolute;width:680px;height:680px;border-radius:50%;
      background:${d.accent};filter:blur(120px);opacity:.32}
    .__card{position:relative;max-width:880px;max-height:860px;width:auto;height:auto;
      border-radius:12px;transform:rotate(-1.6deg);
      box-shadow:0 34px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(251,246,238,.10)}

    .__foot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}
    .__brand{color:#fbf6ee;font-weight:800;font-size:44px;letter-spacing:-0.02em}
    .__brand span{color:#ef9bb4}
    .__dom{font-family:var(--font-mono),monospace;color:#2d2438;background:#e8c547;
      font-size:24px;font-weight:700;letter-spacing:.06em;padding:14px 32px;border-radius:999px}`;

  document.head.appendChild(s);
  document.body.appendChild(o);

  // Les accroches tiennent sur une ligne : si l'une déborde, on réduit la
  // police plutôt que de laisser Chromium couper le mot.
  const hook = o.querySelector(".__hook");
  const maxW = 1000 - 2 * 48;
  let fs = 74;
  const overflows = () =>
    Array.from(hook.children).some((l) => l.scrollWidth > maxW);
  while (fs > 42 && overflows()) {
    fs -= 2;
    hook.style.fontSize = `${fs}px`;
  }
}

async function renderPin(browser, { cardPng, clip, pin, outPath, jpegPath }) {
  const ctx = await browser.newContext({ viewport: PIN, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  // On passe par une page du site uniquement pour hériter de --font-display /
  // --font-mono, posées sur <html> par next/font (src/app/layout.tsx).
  // Sur about:blank l'overlay tomberait en police système.
  await page.goto(`${BASE}/creer`, { waitUntil: "domcontentloaded" });
  await hideDevBadge(page);

  await page.evaluate(buildPinOverlay, {
    kicker: clip.kicker,
    lines: pin.overlay,
    accent: clip.accent,
    domain: BRAND.domain,
    brandHtml: brandMarkHtml(BRAND),
    img: `data:image/png;base64,${cardPng.toString("base64")}`,
  });

  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(600);
  await page.screenshot({ path: outPath }); // viewport 1000×1500 → PNG 1000×1500
  if (jpegPath) {
    // Copie JPEG pour public/pins/ : ~3× plus légère que le PNG à dimensions
    // égales, ce qui évite d'alourdir le dépôt. Playwright encode nativement,
    // pas de dépendance d'image à installer.
    await page.screenshot({ path: jpegPath, type: "jpeg", quality: 85 });
  }
  await ctx.close();
}

// Wordmark « 🎟️ Qui s'y Gratte » (Gratte en rose) — même balisage que le recorder.
function brandMarkHtml(brand) {
  const [first, ...rest] = brand.name.split(" ");
  const last = rest.pop();
  const mid = rest.join(" ");
  return `${brand.emoji} ${first} ${mid} <span>${last}</span>`;
}

const MECHANIC_LINE = {
  scratch:
    "Tu uploades ta photo, elle devient une carte à gratter. Tes proches grattent l'écran et découvrent ton annonce.",
  polaroid:
    "Tu uploades ta photo, elle devient un polaroid à développer. Tes proches le développent et découvrent ton annonce.",
  envelope:
    "Tu uploades ta photo, elle devient une enveloppe à ouvrir. Tes proches l'ouvrent et découvrent ton annonce.",
};

function buildPinMeta(clip, pin, file) {
  const hashtags = (pin.hashtags ?? []).map((h) => `#${h}`).join(" ");
  const description = [pin.description, hashtags].filter(Boolean).join(" ");
  return {
    file,
    slug: clip.slug,
    code: clip.code,
    mechanic: clip.mechanic,
    board: pin.board,
    title: pin.title.slice(0, MAX_TITLE),
    description: description.slice(0, MAX_DESC),
    alt: (pin.alt ?? pin.title).slice(0, MAX_ALT),
    keywords: pin.keywords ?? [],
    link: PIN_TARGET(pin.urlSlug),
    mechanicLine: MECHANIC_LINE[clip.mechanic],
  };
}

// Échappement RFC 4180 maison : on double les guillemets et on entoure tout
// champ contenant une virgule, un guillemet ou un saut de ligne.
function csvCell(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Gabarit « Bulk create Pins » de Pinterest. ⚠️ Pinterest fait évoluer ces
// intitulés : vérifie-les dans ton hub Business avant le premier import, un
// en-tête non conforme fait rejeter tout le fichier (vérifié contre le modèle
// officiel : s.pinimg.com/sub/helpcenter/assets/pinterest-bulk-upload-sample.csv).
// « Media URL » pointe vers public/pins/<slug>.jpg servi par le site : le bulk
// create télécharge l'image, il ne lit pas de fichier local.
function toPinterestCsv(manifest) {
  const header = [
    "Title",
    "Media URL",
    "Pinterest board",
    "Thumbnail",
    "Description",
    "Link",
    "Publish date",
    "Keywords",
  ];
  const rows = manifest.map((m) =>
    [
      m.title,
      mediaUrl(m),
      m.board,
      "",
      m.description,
      m.link,
      "",
      // Virgules et non points-virgules : c'est ce qu'attend Pinterest, et le
      // modèle officiel le confirme ("world, earth"). csvCell met la cellule
      // entre guillemets puisqu'elle contient des virgules.
      m.keywords.join(", "),
    ]
      .map(csvCell)
      .join(",")
  );
  return [header.join(","), ...rows].join("\n") + "\n";
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(PUBLIC_PINS_DIR, { recursive: true });
  const only = ONLY ? ONLY.split(",").map((s) => s.trim()) : null;
  const clips = only ? CLIPS.filter((c) => only.includes(c.code)) : CLIPS;
  if (!clips.length) throw new Error(`aucune occasion pour "${ONLY}"`);

  const missing = clips.filter((c) => !PINS[c.slug]);
  if (missing.length) {
    throw new Error(
      `textes Pinterest manquants dans pins.config.mjs : ${missing.map((c) => c.slug).join(", ")}`
    );
  }

  const browser = await chromium.launch();
  const manifest = [];

  for (const clip of clips) {
    const pin = PINS[clip.slug];
    console.log(`\n▸ ${clip.slug} (${clip.mechanic})`);
    const cardPng = await captureCardShot(browser, clip);
    const file = `${clip.slug}.png`;
    await renderPin(browser, {
      cardPng,
      clip,
      pin,
      outPath: path.join(OUT_DIR, file),
      jpegPath: path.join(PUBLIC_PINS_DIR, `${clip.slug}.jpg`),
    });
    manifest.push(buildPinMeta(clip, pin, file));
    console.log(`  ✔ ${path.relative(process.cwd(), path.join(OUT_DIR, file))}`);
  }
  await browser.close();

  await writeFile(
    path.join(OUT_DIR, "pins.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );
  await writeFile(path.join(OUT_DIR, "pins.csv"), toPinterestCsv(manifest));
  console.log(
    `\n✅ ${manifest.length} épingle(s) + pins.json + pins.csv dans ${path.relative(process.cwd(), OUT_DIR)}/`
  );
  console.log(
    `   ${manifest.length} JPEG dans public/pins/ — à committer et déployer AVANT d'importer le CSV.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
