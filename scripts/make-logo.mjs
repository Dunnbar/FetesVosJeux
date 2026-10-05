// Génère le kit logo partageable de « Qui s'y Gratte » (PNG prêts réseaux).
//
// Rendu dans Chromium (police Space Grotesk du site + mark SVG maison), puis
// capture PNG. Sortie dans brand/ :
//   avatar-1080.png        — photo de profil carrée (Insta/TikTok/FB), safe en rond
//   banner-1500x500.png    — bannière (couverture X / FB / LinkedIn)
//   wordmark-light.png     — logo + nom, transparent, pour FOND SOMBRE
//   wordmark-dark.png      — logo + nom, transparent, pour FOND CLAIR
//   mark-1024.png          — le pictogramme seul, transparent
//   logo-mark.svg          — source vectorielle du pictogramme
//
// Prérequis : serveur dev up (npm run dev). Usage : node scripts/make-logo.mjs

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE || "http://localhost:3000";
const OUT = path.resolve("brand");

// Pictogramme : ticket doré à gratter (rose révélé) + étincelle. Repris et
// agrandi depuis src/app/icon.svg. `sparkle` = couleur de l'étincelle.
const mark = (sparkle) => `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <g transform="rotate(-8 60 60)">
    <rect x="22" y="33" width="76" height="54" rx="11" fill="#e8c547"/>
    <rect x="22" y="33" width="76" height="54" rx="11" fill="none" stroke="#c9a52d" stroke-width="2"/>
    <rect x="31" y="42" width="58" height="36" rx="6" fill="#ef9bb4"/>
    <g stroke="#d77a99" stroke-width="5.5" stroke-linecap="round" opacity="0.92">
      <line x1="39" y1="73" x2="60" y2="49"/>
      <line x1="52" y1="73" x2="73" y2="49"/>
      <line x1="65" y1="73" x2="84" y2="51"/>
    </g>
  </g>
  <path d="M95 17 L98.4 26 L107 29.5 L98.4 33 L95 42 L91.6 33 L83 29.5 L91.6 26 Z" fill="${sparkle}"/>
</svg>`;

const CONFETTI = `
  background-image:
    radial-gradient(circle at 14% 16%, #ef9bb4 1.6px, transparent 2px),
    radial-gradient(circle at 86% 26%, #e8c547 1.6px, transparent 2px),
    radial-gradient(circle at 24% 84%, #b5dcc1 1.6px, transparent 2px),
    radial-gradient(circle at 80% 88%, #f2b594 1.6px, transparent 2px);
  background-size:110px 110px;`;

const wordmark = (color, accent) =>
  `<span style="color:${color}">Qui s'y </span><span style="color:${accent}">Gratte</span>`;

// Remplit la page avec un html+css donné (composés côté Node) et éventuellement
// rend le fond transparent. Aucun script injecté (compatible CSP).
async function paint(page, { html, css, transparent }) {
  await page.evaluate(
    ({ html, css, transparent }) => {
      // Cache tout le contenu React existant (header, boutons flottants…) pour
      // qu'il ne pollue pas la capture, puis fond transparent si demandé.
      for (const el of Array.from(document.body.children)) {
        el.style.display = "none";
      }
      if (transparent) {
        document.documentElement.style.background = "transparent";
        document.body.style.background = "transparent";
      }
      // Ajoute nos éléments en FRÈRES du root React (React ne les touche pas).
      const wrap = document.createElement("div");
      wrap.innerHTML = html;
      while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
      const s = document.createElement("style");
      s.textContent = css;
      document.head.appendChild(s);
    },
    { html, css, transparent: !!transparent }
  );
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(400);
}

async function newPage(browser, w, h) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/creer`, { waitUntil: "domcontentloaded" });
  await page
    .addStyleTag({
      content:
        "nextjs-portal,[data-next-badge-root],[data-next-badge]{display:none!important}",
    })
    .catch(() => {});
  return { ctx, page };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await writeFile(path.join(OUT, "logo-mark.svg"), mark("#e8c547").trim() + "\n");

  const browser = await chromium.launch();

  // ---- Avatar 1080×1080 (fond opaque) ----
  {
    const { ctx, page } = await newPage(browser, 540, 540);
    await paint(page, {
      html: `<div id="stage"><div class="mark">${mark("#fbf6ee")}</div><div class="wm">${wordmark("#fbf6ee", "#ef9bb4")}</div></div>`,
      css: `#stage{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;
        justify-content:center;gap:22px;font-family:var(--font-display),system-ui,sans-serif;
        background:radial-gradient(circle at 50% 40%, #3d3349 0%, #2d2438 66%)}
        #stage:before{content:"";position:absolute;inset:0;opacity:.55;${CONFETTI}}
        #stage>*{position:relative}
        #stage .mark{width:250px;height:250px;filter:drop-shadow(0 8px 22px rgba(0,0,0,.4))}
        #stage .wm{font-size:38px;font-weight:800;letter-spacing:-0.02em}`,
    });
    await page.screenshot({ path: path.join(OUT, "avatar-1080.png") });
    await ctx.close();
    console.log("✔ brand/avatar-1080.png");
  }

  // ---- Bannière 1500×500 (fond opaque) ----
  {
    const { ctx, page } = await newPage(browser, 750, 250);
    await paint(page, {
      html: `<div id="stage"><div class="mark">${mark("#fbf6ee")}</div>
        <div class="txt"><div class="wm">${wordmark("#fbf6ee", "#ef9bb4")}</div>
        <div class="tag">Les annonces qui font dire waouh.</div></div></div>`,
      css: `#stage{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
        gap:34px;font-family:var(--font-display),system-ui,sans-serif;
        background:radial-gradient(circle at 40% 50%, #3d3349 0%, #2d2438 70%)}
        #stage:before{content:"";position:absolute;inset:0;opacity:.5;${CONFETTI}}
        #stage>*{position:relative}
        #stage .mark{width:150px;height:150px;filter:drop-shadow(0 8px 22px rgba(0,0,0,.4))}
        #stage .txt{text-align:left}
        #stage .wm{font-size:52px;font-weight:800;letter-spacing:-0.02em;line-height:1}
        #stage .tag{margin-top:12px;color:#c8bdd0;font-style:italic;font-size:22px}`,
    });
    await page.screenshot({ path: path.join(OUT, "banner-1500x500.png") });
    await ctx.close();
    console.log("✔ brand/banner-1500x500.png");
  }

  // ---- Wordmarks + mark seul (transparents, capture de l'élément) ----
  const transp = [
    {
      file: "wordmark-light.png",
      html: `<div id="asset" class="row"><div class="m">${mark("#e8c547")}</div><div class="t">${wordmark("#fbf6ee", "#ef9bb4")}</div></div>`,
    },
    {
      file: "wordmark-dark.png",
      html: `<div id="asset" class="row"><div class="m">${mark("#2d2438")}</div><div class="t">${wordmark("#2d2438", "#d77a99")}</div></div>`,
    },
    {
      file: "mark-1024.png",
      html: `<div id="asset"><div class="m big">${mark("#e8c547")}</div></div>`,
    },
  ];
  const transpCss = `#asset{position:fixed;top:40px;left:40px;font-family:var(--font-display),system-ui,sans-serif}
    #asset.row{display:inline-flex;align-items:center;gap:22px}
    #asset .m{width:96px;height:96px}
    #asset .m.big{width:512px;height:512px}
    #asset .t{font-size:70px;font-weight:800;letter-spacing:-0.02em;white-space:nowrap}`;

  for (const a of transp) {
    const { ctx, page } = await newPage(browser, 1200, 640);
    await paint(page, { html: a.html, css: transpCss, transparent: true });
    await page
      .locator("#asset")
      .screenshot({ path: path.join(OUT, a.file), omitBackground: true });
    await ctx.close();
    console.log(`✔ brand/${a.file}`);
  }

  await browser.close();
  console.log("\n✅ Kit logo dans brand/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
