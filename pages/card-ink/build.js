#!/usr/bin/env node
// Builds pages/card-ink/index.html: the how-to card pilot (Wi-Fi A, cooking B, pages/card-art/round-4/) inside the
// ui-2.0.0 how-to card (ToyPanelHowto, ToyHowtoFrame, ToyHowtoFrameDone: the module tile, a 2 px edge, 12 px corners,
// the finish frame's 3 px mint outline). The clean sketch was drawn in dark ink for a white frame; on the dark tile its
// lines vanish, so the page shows three ways to fit it, each a colour swap of the same SVGs:
//   A pale lines on the tile, the mint accent; B pale lines, the yellow kept; C a pale sheet with the ink kept.
// The art is a texture in the game (an SVG rendered to PNG by tools/card-art/render.js), so any colour in it is safe.
//
//   node pages/card-ink/build.js           write index.html
//   node pages/card-ink/build.js --check   exit 1 when index.html is not this script's output (tools/check.js runs it)
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'card-art', 'round-4');
const sets = [
  { name: 'Wi-Fi', dir: 'wifi/a', files: ['wifi-1', 'wifi-2', 'wifi-3', 'wifi-4'] },
  { name: 'Готування', dir: 'cooking/b', files: ['cooking-1', 'cooking-2', 'cooking-3', 'cooking-4'] },
];
// the ink-mint palette (tokens/primitives.tokens.json)
const P = { base: '#1A1629', module: '#2A2540', edge: '#4A4170', text: '#ECE8F7', dim: '#A39DBD', accent: '#6FF2B4' };
// the SVGs' own colours: the ink, the paper fills that hide lines behind a shape, the accent
const SRC = { ink: '#1f2433', paper: ['#fff', '#FFFFFF', '#ffffff'], accent: '#FFD60A' };
const variants = [
  { id: 'a', title: 'А · світлі лінії, мʼятний акцент', rec: true, ink: P.text, paper: P.module, accent: P.accent, frame: P.module,
    note: 'Лінії кольору тексту, акцент — та сама мʼята, що й у всьому інтерфейсі. Картка — ще один екран костюма: один акцент, нічого зайвого.' },
  { id: 'b', title: 'Б · світлі лінії, жовтий акцент', ink: P.text, paper: P.module, accent: '#FFD60A', frame: P.module,
    note: 'Як А, але лишається жовтий пілота (21.10). Головне в кадрі видно сильніше; жовтого більше ніде в палітрі немає.' },
  { id: 'c', title: 'В · світлий аркуш, чорнило лишається', ink: SRC.ink, paper: P.text, accent: '#FFD60A', frame: P.text,
    note: 'Кадр — світлий аркуш у темній картці, малюнок як є. Найближче до оригіналу, але це найгучніша пляма на темному екрані.' },
];

function inline(file, v) {
  let svg = fs.readFileSync(path.join(root, file), 'utf8').replace(/<!--[\s\S]*?-->/g, '').trim();
  const ids = [...svg.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) svg = svg.split(`"${id}"`).join(`"${id}-${v.id}"`).split(`#${id})`).join(`#${id}-${v.id})`);
  // an inline SVG's <style> is global to the page: scope its class rules to the variant's section
  svg = svg.replace(/<style>([\s\S]*?)<\/style>/, (m, css) => `<style>${css.replace(/(^|[\s}])\.([\w-]+)(?=[{\s,.:])/g, `$1.v-${v.id} .$2`)}</style>`);
  svg = svg.split(SRC.ink).join(v.ink).split(SRC.accent).join(v.accent);
  for (const p of SRC.paper) svg = svg.split(`"${p}"`).join(`"${v.paper}"`).split(`:${p};`).join(`:${v.paper};`).split(`:${p}}`).join(`:${v.paper}}`);
  return svg.replace(/ width="320" height="240"/, '');
}

let body = '';
for (const v of variants) {
  body += `<section class="v v-${v.id}"><h2>${v.title}${v.rec ? ' <span class="rec">рекомендую</span>' : ''}</h2><p class="cap">${v.note}</p>`;
  for (const s of sets) {
    body += `<div class="howto"><p class="ttl">${s.name}</p><div class="row">`;
    s.files.forEach((f, i) => {
      body += `<div class="fr${i === s.files.length - 1 ? ' done' : ''}" style="background:${v.frame}">${inline(path.join(s.dir, f + '.svg'), v)}</div>`;
    });
    body += '</div></div>';
  }
  body += '</section>\n';
}

const html = `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Картки на темній плитці</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;600;700&family=Unbounded:wght@700&display=swap">
<style>
/* The page chrome is dark by choice (one look, as the suit pages). The card is the ui-2.0.0 how-to card: the module
   tile with the 2 px edge and 12 px corners; each frame the same tile around its art; the last one the finish frame
   with the 3 px mint outline. No shadows. The art inside is a texture. */
:root { color-scheme: dark; --ground: #121019; --raise: #1C1926; --line: #2E2A3C; --ink-c: #ECE8F7; --dim: #A39DBD;
  --base: ${P.base}; --module: ${P.module}; --edge: ${P.edge}; --acc: ${P.accent}; }
body { margin: 0; background: var(--ground); color: var(--ink-c); font: 16px/1.5 "Onest", "Segoe UI", system-ui, sans-serif; }
.wrap { max-width: 1040px; margin: 0 auto; padding: 28px 16px 64px; display: grid; gap: 40px; }
h1, h2, .ttl { font-family: "Unbounded", "Segoe UI", sans-serif; }
h1 { font-size: clamp(26px, 6vw, 40px); line-height: 1.1; margin: 0; }
h2 { font-size: clamp(18px, 4vw, 22px); margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
p { margin: 0; max-width: 66ch; }
.lede, .cap { color: var(--dim); }
.ask { border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; background: var(--raise); }
.rec { font-family: "Onest", sans-serif; font-size: 12px; font-weight: 700; color: #082418; background: var(--acc); border-radius: 6px; padding: 2px 8px; }
.v { display: grid; gap: 12px; }
.howto { background: var(--module); border: 2px solid var(--edge); border-radius: 12px; padding: 16px; display: grid; gap: 12px; }
.ttl { font-size: 18px; font-weight: 700; margin: 0; }
.row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
.fr { border: 2px solid var(--edge); border-radius: 12px; padding: 4px; }
.fr.done { border: 3px solid var(--acc); padding: 3px; }
.fr svg { display: block; width: 100%; height: auto; }
footer { color: var(--dim); font-size: 14px; }
</style>
</head>
<body>
<main class="wrap">
  <header style="display:grid;gap:14px">
    <h1>Картки «як грати» на темній плитці</h1>
    <p class="lede">Чистий скетч малювали темним чорнилом для білої рамки. У ui-2.0.0 рамка картки — темна плитка, і лінії на ній майже зникають. Ось три способи це полагодити; картка вже в новому вигляді, міняються лише кольори малюнка.</p>
    <p class="ask"><b>Що вирішити:</b> А, Б чи В. Решту трьох задач (двигун, авто, фото) і Доставку перемалюю тим самим способом.</p>
  </header>
${body}  <footer>Малюнки — наша власна робота (<code>pages/card-art/round-4/</code>, їхні <code>LICENCES.json</code>); сторінку збирає <code>pages/card-ink/build.js</code>.</footer>
</main>
</body>
</html>
`;
const out = path.join(__dirname, 'index.html');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== html) { console.error('pages/card-ink/index.html is stale: run node pages/card-ink/build.js'); process.exit(1); }
} else {
  fs.writeFileSync(out, html);
  console.log('wrote pages/card-ink/index.html (' + Math.round(html.length / 1024) + ' KB)');
}
