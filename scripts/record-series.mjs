// Enregistre la série de clips verticaux (9:16) définie dans clips.config.mjs.
//
// Pour chaque RÉVÉLATION (occasion × mécanique) :
//   1. enregistre l'interaction UNE fois (grattage / polaroid / enveloppe),
//      avec un watermark « 🎟️ quisygratte.fr » incrusté ;
//   2. génère un écran de fin (marque + domaine) ;
//   3. pour chaque accroche : génère un écran d'intro (wordmark + accroche)
//      et assemble intro + interaction + fin en un .mp4 (ffmpeg).
// ⇒ N accroches = N vidéos, sans ré-enregistrer l'interaction.
//
// Prérequis : serveur dev up (npm run dev) + cartes seedées
//   (npx tsx prisma/seed-series.ts). ffmpeg dans le PATH.
//
// Usage : node scripts/record-series.mjs [codes]
//   codes : ne traiter que ces révélation(s), séparées par des virgules
//           (ex: DEMOGROSSESSE,DEMOGENDER). Sinon : toute la série.

import { chromium } from "playwright";
import { mkdir, rename, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { CLIPS, BRAND } from "./clips.config.mjs";

const run = promisify(execFile);
const BASE = process.env.BASE || "http://localhost:3000";
const OUT_DIR = path.resolve("recordings");
const VIEWPORT = { width: 540, height: 960 };
const ONLY = process.argv[2];

const INTRO_SEC = 2.4; // écran d'intro
const OUTRO_SEC = 2.4; // écran de fin
const HEAD_TRIM = 1.3; // secondes rognées en tête de l'interaction (chargement)

const sleep = (page, ms) => page.waitForTimeout(ms);

// Fond + confettis + police de la marque, partagés par intro et fin.
const CARD_BASE_CSS = `
  position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;
  align-items:center;justify-content:center;text-align:center;padding:0 40px;
  background:radial-gradient(circle at 50% 30%, #3d3349 0%, #2d2438 62%);
  font-family:var(--font-display),system-ui,sans-serif;`;
const CONFETTI_CSS = `
  content:"";position:absolute;inset:0;opacity:.5;
  background-image:
    radial-gradient(circle at 14% 16%, #ef9bb4 1.4px, transparent 1.8px),
    radial-gradient(circle at 86% 30%, #e8c547 1.4px, transparent 1.8px),
    radial-gradient(circle at 28% 82%, #b5dcc1 1.4px, transparent 1.8px),
    radial-gradient(circle at 78% 90%, #f2b594 1.4px, transparent 1.8px);
  background-size:120px 120px;`;

async function hideDevBadge(page) {
  await page
    .addStyleTag({
      content:
        "nextjs-portal,[data-next-badge-root],[data-next-badge],#__next-dev-tools-indicator,[data-nextjs-toast]{display:none!important}",
    })
    .catch(() => {});
}

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

async function doScratch(page) {
  const box = await page.locator("canvas").boundingBox();
  if (!box) throw new Error("canvas introuvable");
  const M = 26;
  const left = box.x + M;
  const right = box.x + box.width - M;
  const top = box.y + M;
  const bottom = box.y + box.height - M;
  const ROW_GAP = 30;

  await page.mouse.move(left, top);
  await page.mouse.down();
  let y = top;
  let toRight = true;
  while (y <= bottom) {
    const xEnd = toRight ? right : left;
    await page.mouse.move(xEnd, y, { steps: 18 });
    await sleep(page, 110);
    y += ROW_GAP;
    if (y <= bottom) await page.mouse.move(xEnd, y, { steps: 5 });
    toRight = !toRight;
  }
  await page.mouse.move(left, top, { steps: 26 });
  await page.mouse.move(right, bottom, { steps: 26 });
  await page.mouse.up();
  await sleep(page, 2000);
}

async function playMechanic(page, clip) {
  if (clip.mechanic === "scratch") {
    await waitCanvasPainted(page);
    await sleep(page, 1300);
    await doScratch(page);
  } else if (clip.mechanic === "polaroid") {
    const btn = page.getByRole("button", { name: "Développer le polaroid" });
    await btn.waitFor();
    await sleep(page, 1400);
    await btn.click();
    await sleep(page, 4300);
  } else if (clip.mechanic === "envelope") {
    const btn = page.getByRole("button", { name: "Ouvrir l'enveloppe" });
    await btn.waitFor();
    await sleep(page, 1400);
    await btn.click();
    await sleep(page, 3200);
  } else {
    throw new Error(`mécanique inconnue: ${clip.mechanic}`);
  }
}

// Watermark « 🎟️ quisygratte.fr » — coin bas-gauche, discret, tout le clip.
async function injectWatermark(page, brand) {
  await page.evaluate((b) => {
    const w = document.createElement("div");
    w.textContent = `${b.emoji} ${b.domain}`;
    Object.assign(w.style, {
      position: "fixed",
      left: "16px",
      bottom: "16px",
      zIndex: "99998",
      fontFamily: "-apple-system,system-ui,sans-serif",
      fontSize: "15px",
      fontWeight: "700",
      color: "rgba(251,246,238,0.82)",
      textShadow: "0 1px 5px rgba(0,0,0,.55)",
      letterSpacing: ".01em",
      pointerEvents: "none",
    });
    document.body.appendChild(w);
  }, brand);
}

// Wordmark « 🎟️ Qui s'y Gratte » (Gratte en rose) — pour l'intro.
function brandMarkHtml(brand) {
  const [first, ...rest] = brand.name.split(" ");
  const last = rest.pop();
  const mid = rest.join(" ");
  return `<div class="__brand">${brand.emoji} ${first} ${mid} <span>${last}</span></div>`;
}

async function captureCard(browser, filename, buildOverlay) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/creer`, { waitUntil: "domcontentloaded" });
  await hideDevBadge(page);
  await page.evaluate(buildOverlay);
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(400);
  const out = path.join(OUT_DIR, filename);
  await page.screenshot({ path: out });
  await ctx.close();
  return out;
}

// L'évaluation navigateur ne capture pas la closure Node : on construit la
// source de la fonction avec les valeurs inlinées, via new Function().
function makeIntroFn({ hookLines, kicker, accent, brandHtml }) {
  const body = `
    const lines = ${JSON.stringify(hookLines)};
    const overlay = document.createElement("div");
    overlay.id = "__intro";
    overlay.innerHTML =
      ${JSON.stringify(brandHtml)} +
      '<div class="__kicker">◆ ' + ${JSON.stringify(kicker)} + '</div>' +
      '<div class="__title">' + lines.map((l,i)=>'<div class="__l'+i+'">'+l+'</div>').join('') + '</div>' +
      '<div class="__hint">à toi de découvrir</div>';
    const css = document.createElement("style");
    css.textContent =
      '#__intro{${CARD_BASE_CSS.replace(/\n/g, " ")}}' +
      '#__intro:before{${CONFETTI_CSS.replace(/\n/g, " ")}}' +
      '#__intro>*{position:relative}' +
      '#__intro .__brand{position:absolute;top:7%;left:0;right:0;color:#fbf6ee;font-weight:800;font-size:21px;letter-spacing:-0.01em}' +
      '#__intro .__brand span{color:#ef9bb4}' +
      '#__intro .__kicker{font-family:var(--font-mono),monospace;color:#e8c547;font-size:13px;letter-spacing:.32em;text-transform:uppercase;margin-bottom:24px}' +
      '#__intro .__title{color:#fbf6ee;font-weight:800;font-size:42px;line-height:1.08;letter-spacing:-0.02em}' +
      '#__intro .__title .__l1{color:${accent}}' +
      '#__intro .__hint{margin-top:32px;color:#c8bdd0;font-size:16px;font-weight:600}' +
      '#__intro .__hint:before{content:"👆 "}';
    document.head.appendChild(css);
    document.body.appendChild(overlay);`;
  return new Function(body);
}

function makeOutroFn({ brandHtml, tagline, domain }) {
  const body = `
    const overlay = document.createElement("div");
    overlay.id = "__outro";
    overlay.innerHTML =
      '<div class="__big">' + ${JSON.stringify(brandHtml)} + '</div>' +
      '<div class="__tag">' + ${JSON.stringify(tagline)} + '</div>' +
      '<div class="__cta">Crée la tienne 👉 <b>' + ${JSON.stringify(domain)} + '</b></div>';
    const css = document.createElement("style");
    css.textContent =
      '#__outro{${CARD_BASE_CSS.replace(/\n/g, " ")}}' +
      '#__outro:before{${CONFETTI_CSS.replace(/\n/g, " ")}}' +
      '#__outro>*{position:relative}' +
      '#__outro .__big{color:#fbf6ee;font-weight:800;font-size:40px;letter-spacing:-0.02em;margin-bottom:20px}' +
      '#__outro .__big span{color:#ef9bb4}' +
      '#__outro .__tag{color:#c8bdd0;font-style:italic;font-size:19px;margin-bottom:38px}' +
      '#__outro .__cta{color:#fbf6ee;font-size:20px;font-weight:700}' +
      '#__outro .__cta b{color:#e8c547}';
    document.head.appendChild(css);
    document.body.appendChild(overlay);`;
  return new Function(body);
}

async function recordInteraction(browser, clip) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    recordVideo: { dir: OUT_DIR, size: VIEWPORT },
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/g/${clip.code}`, { waitUntil: "networkidle" });
  await hideDevBadge(page);
  await injectWatermark(page, BRAND);
  await playMechanic(page, clip);
  const video = page.video();
  await ctx.close();
  const webmPath = path.join(OUT_DIR, `${clip.code}.webm`);
  await rename(await video.path(), webmPath);
  return webmPath;
}

async function buildFinal(outPath, introPath, webmPath, outroPath) {
  const introFade = (INTRO_SEC - 0.3).toFixed(2);
  await run("ffmpeg", [
    "-y",
    "-loop", "1", "-t", String(INTRO_SEC), "-i", introPath,
    "-ss", String(HEAD_TRIM), "-i", webmPath,
    "-loop", "1", "-t", String(OUTRO_SEC), "-i", outroPath,
    "-filter_complex",
    `[0:v]scale=1080:1920,fps=30,format=yuv420p,fade=t=in:st=0:d=0.3,fade=t=out:st=${introFade}:d=0.3,setsar=1[a];` +
      `[1:v]scale=1080:1920:flags=lanczos,fps=30,format=yuv420p,setsar=1[b];` +
      `[2:v]scale=1080:1920,fps=30,format=yuv420p,fade=t=in:st=0:d=0.3,setsar=1[c];` +
      `[a][b][c]concat=n=3:v=1:a=0[v]`,
    "-map", "[v]",
    "-c:v", "libx264", "-preset", "slow", "-crf", "20",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    outPath,
  ]);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const only = ONLY ? ONLY.split(",").map((s) => s.trim()) : null;
  const clips = only ? CLIPS.filter((c) => only.includes(c.code)) : CLIPS;
  if (!clips.length) throw new Error(`aucune révélation pour "${ONLY}"`);

  const brandHtml = brandMarkHtml(BRAND);
  const browser = await chromium.launch();
  const outputs = [];

  for (const clip of clips) {
    console.log(`\n▸ ${clip.slug} (${clip.mechanic}) — ${clip.hooks.length} accroche(s)`);
    const webm = await recordInteraction(browser, clip);
    const outro = await captureCard(
      browser,
      `_outro_${clip.code}.png`,
      makeOutroFn({ brandHtml, tagline: BRAND.tagline, domain: BRAND.domain })
    );

    for (let i = 0; i < clip.hooks.length; i++) {
      const hookLines = clip.hooks[i].split("\n");
      const intro = await captureCard(
        browser,
        `_intro_${clip.code}_${i + 1}.png`,
        makeIntroFn({ hookLines, kicker: clip.kicker, accent: clip.accent, brandHtml })
      );
      const out = path.join(OUT_DIR, `${clip.slug}-${i + 1}.mp4`);
      await buildFinal(out, intro, webm, outro);
      console.log(`  ✔ ${path.relative(process.cwd(), out)}`);
      outputs.push(out);
    }
    await rm(webm, { force: true });
  }
  await browser.close();

  console.log(`\n✅ ${outputs.length} clip(s) générés dans recordings/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
