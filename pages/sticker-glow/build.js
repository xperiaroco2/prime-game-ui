// The sticker-with-the-glow page (pages/sticker-glow/index.html): the engineer's answer to the grown-up options
// (2026-10-21) was to keep the original sticker UI and edit it a little, with Kablammo on the big titles and the acid
// green glow of direction C. This page shows the sticker screens with three glow strengths (screens.html), three new
// item icon treatments (icons-gpt.html: sticker and vinyl+, from a GPT-image batch; icons-neon.html: neon, own work;
// the PNGs in icons/ with their records in icons/LICENCES.json) and a mix strip with each treatment in the glowing hand
// slot of strength 2. The fragments are hand-written; this script assembles them into one self-contained page: their
// Google Fonts links go to the head (once each), their <style> blocks to the head in order, their markup and scripts
// stay in the body, and every PNG is carried once, as a base64 data URI inside an SVG <symbol> that each picture
// <use>s, so the page stays small.
//
//   node pages/sticker-glow/build.js           write index.html
//   node pages/sticker-glow/build.js --check   exit 1 when index.html is not what this script makes (tools/check.js runs it)
//
// Node 20, node's own modules only.
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const ROOT = path.resolve(DIR, '..', '..');
const PAGE = 'pages/sticker-glow/index.html';
const MAX_BYTES = 4 * 1024 * 1024;

const STYLES = [
  { key: 'sticker', name: 'Наліпка' },
  { key: 'vinyl', name: 'Вініл+' },
  { key: 'neon', name: 'Неон' },
];
const ITEMS = [
  ['burger', 'Бургер'], ['wrench', 'Гайковий ключ'], ['watering-can', 'Лійка'],
  ['battery', 'Батарейка'], ['flower', 'Квітка в горщику'], ['car-part', 'Друкована деталь двигуна'],
];

const read = (name) => fs.readFileSync(path.join(DIR, name), 'utf8').replace(/\r\n/g, '\n');
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Split a fragment into its font links, its styles and the rest of its markup.
function split(name, fonts) {
  let html = read(name);
  const styles = [];
  html = html.replace(/<link rel="preconnect"[^>]*>\n?/g, '');
  html = html.replace(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com\/[^"]+)">\n?/g, (m, href) => {
    if (!fonts.includes(href)) fonts.push(href);
    return '';
  });
  if (/<link\b/.test(html)) throw new Error(`${name}: a <link> that is not a Google Fonts stylesheet`);
  html = html.replace(/<style>\n?([\s\S]*?)<\/style>\n?/g, (m, css) => { styles.push(css.replace(/\s+$/, '')); return ''; });
  if (/<img\b[^>]*\ssrc="(?!icons\/)/.test(html) || /url\(/.test(styles.join('\n'))) throw new Error(`${name}: an outside picture or url()`);
  return { styles, body: html.trim() };
}

function pngSize(buf, file) {
  if (buf.readUInt32BE(0) !== 0x89504e47 || buf.toString('ascii', 12, 16) !== 'IHDR') throw new Error(`${file}: not a PNG`);
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

function sprite() {
  const licences = JSON.parse(read('icons/LICENCES.json'));
  const lines = [];
  for (const st of STYLES) for (const [item] of ITEMS) {
    const file = `${st.key}-${item}.png`;
    const rec = licences[file];
    if (!rec || !rec.licence) throw new Error(`pages/sticker-glow/icons/LICENCES.json: no licence record for ${file}`);
    const buf = fs.readFileSync(path.join(DIR, 'icons', file));
    const [w, h] = pngSize(buf, file);
    lines.push(`  <symbol id="si-${st.key}-${item}" viewBox="0 0 ${w} ${h}"><image width="${w}" height="${h}" href="data:image/png;base64,${buf.toString('base64')}"/></symbol>`);
  }
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true">\n${lines.join('\n')}\n</svg>`;
}

// The icon fragments name their pictures as files; on the page each is a <use> of the sprite.
function iconsBody(body, name) {
  const out = body.replace(/<img src="icons\/([a-z]+-[a-z-]+)\.png" alt="([^"]*)">/g,
    (m, file, alt) => `<svg role="img" aria-label="${alt}"><use href="#si-${file}"/></svg>`);
  if (/src="icons\//.test(out)) throw new Error(`${name}: a picture the build does not carry`);
  return out;
}

const pic = (st, item, label) => `<svg role="img" aria-label="${esc(label)}"><use href="#si-${st}-${item}"/></svg>`;

function mixStrip() {
  const rows = STYLES.map((s) => {
    const slots = ITEMS.map(([item, label]) => `<span class="mx-sl">${pic(s.key, item, label)}</span>`).join('');
    return `    <p class="mx-row">${s.name}</p>\n    <div class="mx-room"><div class="mx-grid">${slots}</div></div>`;
  }).join('\n');
  return `<section class="pg-part" id="mix">
  <h2 class="pg-h2">Мікс: кожна манера в руці, що світиться (сила 2)</h2>
  <p class="pg-text">Усі шість предметів кожної манери в тій самій кислотній плашці руки, що й на екрані раунду, з тим самим світінням і товстішим обведенням знизу й праворуч. Тут видно, що губиться на кислотному тлі.</p>
  <div class="mx">
${rows}
  </div>
</section>`;
}

const PAGE_CSS = `/* The page chrome: quiet graphite, the same as the MVP screens page; the fragments draw their own colours. */
:root {
  color-scheme: dark;
  --ground: #141317;
  --raise: #1C1B21;
  --line: #2E2C35;
  --ink-c: #ECE9F1;
  --dim: #A6A2B1;
  --link: #C4E8D5;
  --chrome: "Golos Text", "Segoe UI", system-ui, sans-serif;
}
body { margin: 0; background: var(--ground); color: var(--ink-c); font: 16px/1.5 var(--chrome); }
a { color: var(--link); }
.pg { max-width: 1040px; margin: 0 auto; padding-block: 28px 64px; box-sizing: border-box;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
  display: grid; gap: 44px; min-width: 0; }
.pg > * { min-width: 0; }
.pg-intro { display: grid; gap: 14px; }
.pg-h1 { margin: 0; font-size: clamp(30px, 6vw, 46px); line-height: 1.05; letter-spacing: -0.01em; }
.pg-h2 { margin: 0; font-size: clamp(20px, 3.6vw, 26px); line-height: 1.15; }
.pg-text { margin: 0; max-width: 66ch; overflow-wrap: anywhere; }
.pg-lede { margin: 0; max-width: 66ch; font-size: 17px; }
.pg-how { margin: 0; padding: 14px 16px 14px 34px; border: 1px solid var(--line); border-radius: 12px; background: var(--raise); display: grid; gap: 6px; max-width: 66ch; }
.pg-nav { display: flex; flex-wrap: wrap; gap: 8px; }
.pg-nav a { padding: 6px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--raise); text-decoration: none; font-weight: 600; }
.pg-part { display: grid; gap: 16px; padding-top: 28px; border-top: 1px solid var(--line); min-width: 0; }

/* the mix strip: the hand slot of strength 2 (screens.html .sg-s2 .sg-sl.sg-on, the same values), over a stand-in
   for the room's wall (not UI) */
.mx { display: grid; gap: 8px; }
.mx-row { margin: 8px 0 0; font-weight: 700; font-size: 14px; }
.mx-room { background: #9C8670; border-radius: 12px; padding: 24px 18px; }
.mx-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 105px)); justify-content: space-between; gap: 26px 10px; }
@media (min-width: 760px) { .mx-grid { grid-template-columns: repeat(6, 105px); } }
.mx-sl { display: grid; place-items: center; box-sizing: border-box; width: 100%; aspect-ratio: 1; background: #B6FF3C;
  border: 4px solid #1E1230; border-width: 4px 9px 9px 4px; border-radius: 16px; box-shadow: 0 0 30px rgba(182, 255, 60, 1); }
.mx-sl svg { display: block; width: 74%; height: 74%; }`;

function build() {
  const fonts = [];
  const styles = [];
  const sc = split('screens.html', fonts);
  styles.push(`/* ---------- screens.html ---------- */\n${sc.styles.join('\n')}`);
  const screens = `<section class="pg-part" id="screens">\n${sc.body}\n</section>`;
  const gpt = split('icons-gpt.html', fonts);
  styles.push(`/* ---------- icons-gpt.html ---------- */\n${gpt.styles.join('\n')}`);
  const neon = split('icons-neon.html', fonts);
  styles.push(`/* ---------- icons-neon.html ---------- */\n${neon.styles.join('\n')}`);
  const icons = `<section class="pg-part" id="icons">
  <h2 class="pg-h2">Іконки предметів: три нові манери</h2>
  <p class="pg-text">Ті самі шість предметів, що й минулого разу. Наліпка й вініл+ — нова генерація, неон намальовано вручну. Під кожною манерою — вирок критика.</p>
${iconsBody(gpt.body, 'icons-gpt.html')}
${iconsBody(neon.body, 'icons-neon.html')}
</section>`;
  const nav = [['screens', 'Екрани'], ['icons', 'Іконки'], ['mix', 'Мікс']]
    .map(([id, t]) => `<a href="#${id}">${t}</a>`).join('');
  const html = `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="claude:viewport-fit-sides" content="cover">
<title>Наліпка зі світінням</title>
<!-- Generated by pages/sticker-glow/build.js from screens.html, icons-gpt.html, icons-neon.html and icons/*.png: do not edit by hand. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fonts.map((h) => `<link rel="stylesheet" href="${h}">`).join('\n')}
<style>
${PAGE_CSS}

${styles.join('\n\n')}
</style>
</head>
<body>
${sprite()}
<main class="pg">
<header class="pg-intro">
  <h1 class="pg-h1">Наліпка зі світінням</h1>
  <p class="pg-lede">Ви сказали: наш перший інтерфейс-наліпка подобався, його треба трохи підредагувати, а не переробляти. Шрифт, що вам подобається, — Kablammo, як на логотипі; тут він на великих заголовках. З «Інопланетної техніки» взято кислотно-зелені кнопки, що світяться: сама по собі вона надто проста, тож світло додано до наліпки. Іконки досі виглядали як AI-слоп, тож нижче три нові манери.</p>
  <ul class="pg-how">
    <li>Перемикайте силу світіння над екранами: 1 — ледь, 2 — як просили, 3 — кислота. Критик радить 2.</li>
    <li>Жодна з трьох манер іконок ще не проходить: критик пропонує наступним кроком плоскі намальовані іконки в мові наших нинішніх, а світіння — від слота.</li>
    <li>Нічого ще не обрано: оберіть силу й скажіть, яка манера іконок ближча.</li>
  </ul>
  <nav class="pg-nav">${nav}</nav>
</header>
${screens}
${icons}
${mixStrip()}
</main>
</body>
</html>
`;
  return html;
}

function main() {
  const check = process.argv.includes('--check');
  const html = build();
  const bytes = Buffer.byteLength(html);
  if (bytes > MAX_BYTES) throw new Error(`${PAGE}: ${bytes} bytes, over the 4 MB limit`);
  const file = path.join(ROOT, ...PAGE.split('/'));
  if (check) {
    const cur = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    if (cur !== html) { console.log(`${PAGE} is stale: run node pages/sticker-glow/build.js`); process.exit(1); }
    console.log(`${PAGE} matches its build (${bytes} bytes)`);
    return;
  }
  fs.writeFileSync(file, html);
  console.log(`wrote ${PAGE} (${bytes} bytes)`);
}

try { main(); } catch (e) { console.log(e.message); process.exit(1); }
