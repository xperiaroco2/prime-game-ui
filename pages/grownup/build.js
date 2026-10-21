// The grown-up options page (pages/grownup/index.html): the engineer called the sticker UI childish (2026-10-21), so
// this page shows three grown-up directions on the same MVP screens (dir-a.html, dir-b.html, dir-c.html), three item
// icon styles (icons.html, the PNGs in icons/ with their records in icons/LICENCES.json), a mix strip with each icon
// style in each direction's item slot, and the research's cues. The fragments are hand-written; this script assembles
// them into one self-contained page: their Google Fonts links go to the head (once each), their <style> blocks to the
// head in order, their markup and scripts stay in the body, and every PNG is carried once, as a base64 data URI inside
// an SVG <symbol> that each picture <use>s, so the page stays small.
//
//   node pages/grownup/build.js           write index.html
//   node pages/grownup/build.js --check   exit 1 when index.html is not what this script makes (tools/check.js runs it)
//
// Node 20, node's own modules only.
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const ROOT = path.resolve(DIR, '..', '..');
const PAGE = 'pages/grownup/index.html';
const MAX_BYTES = 4 * 1024 * 1024;
const REPORT = 'https://github.com/xperiaroco2/prime-game-ui/blob/main/docs/research/2026-10-21-grown-up/report.md';

const DIRECTIONS = [
  { file: 'dir-a.html', id: 'a', name: 'А · Стікер, що подорослішав' },
  { file: 'dir-b.html', id: 'b', name: 'Б · Ефірна графіка' },
  { file: 'dir-c.html', id: 'c', name: 'В · Інопланетна техніка' },
];
const STYLES = [
  { key: 'toy', name: 'Вініл' },
  { key: 'ink', name: 'Чорнило' },
  { key: 'real', name: 'Зйомка' },
];
const ITEMS = [
  ['burger', 'Бургер'], ['wrench', 'Гайковий ключ'], ['watering-can', 'Лійка'],
  ['battery', 'Батарейка'], ['flower', 'Квітка в горщику'], ['car-part', 'Друкована деталь двигуна'],
];
// The research's top cues, in Ukrainian, in the report's order (docs/research/2026-10-21-grown-up/report.md).
const CUES = [
  ['Тонкі обведення або жодних', 'товстий чорнильний контур і тверда тінь під кожною плашкою читаються як мобільна гра для дітей.'],
  ['Малі кути', '0–6 px замість «пігулок» і великих заокруглень; круглим лишається тільки те, що кругле за змістом.'],
  ['Стриманий шрифт', 'вузький або важкий гротеск великими літерами з розрядкою для заголовків, напівжирний для тексту; без круглих «дружніх» гарнітур.'],
  ['Один колір, одне значення', 'зелений лише для «натисни» та «іди», корал лише для тривоги; акцент, витрачений на все, перестає працювати.'],
  ['Приглушена насиченість', 'темні тла й спокійні тони, яскраве лише в акцентах; цукеркові кольори одразу молодять.'],
  ['Структура замість наліпок', 'смуги, поля, сітка й чітке вирівнювання тримають екран; окремі плашки, що «плавають», виглядають як іграшка.'],
  ['Числа як табло', 'таймер, ціна й результат великими цифрами з однаковою шириною, підписи короткі й рівні, без жартів у тексті.'],
  ['Справжні речі', 'картинки предметів у матеріалах будинку (хром, емаль, кераміка), а не мультяшні іконки; одна мова для всіх предметів.'],
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
    if (!rec || !rec.licence) throw new Error(`pages/grownup/icons/LICENCES.json: no licence record for ${file}`);
    const buf = fs.readFileSync(path.join(DIR, 'icons', file));
    const [w, h] = pngSize(buf, file);
    lines.push(`  <symbol id="gi-${st.key}-${item}" viewBox="0 0 ${w} ${h}"><image width="${w}" height="${h}" href="data:image/png;base64,${buf.toString('base64')}"/></symbol>`);
  }
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true">\n${lines.join('\n')}\n</svg>`;
}

// icons.html names its pictures as files; on the page each is a <use> of the sprite.
function iconsBody(body) {
  return body.replace(/<img src="icons\/([a-z]+-[a-z-]+)\.png" alt="([^"]*)">/g,
    (m, name, alt) => `<svg role="img" aria-label="${alt}"><use href="#gi-${name}"/></svg>`);
}

const pic = (st, item, label) => `<svg role="img" aria-label="${esc(label)}"><use href="#gi-${st}-${item}"/></svg>`;

function mixStrip() {
  const head = STYLES.map((s) => `<span class="mx-col">${s.name}</span>`).join('');
  const rows = DIRECTIONS.map((d) => {
    const cells = STYLES.map((s) => {
      const name = d.id === 'b' ? '<span class="mx-name">Бургер</span>' : d.id === 'a' ? '<span class="mx-tag">Бургер</span>' : '';
      const minis = ITEMS.map(([item, label]) => `<span class="mx-sl mx-mini">${pic(s.key, item, label)}</span>`).join('');
      const cap = d.id === 'c' ? '<span class="mx-nt">Бургер</span>' : '';
      return `<div class="mx-cell mx-${d.id}"><span class="mx-sl mx-big">${pic(s.key, 'burger', 'Бургер')}${name}</span>${cap}<span class="mx-minis">${minis}</span></div>`;
    }).join('\n      ');
    return `    <p class="mx-row">${d.name}</p>\n    <div class="mx-grid">\n      ${cells}\n    </div>`;
  }).join('\n');
  return `<section class="pg-part" id="mix">
  <h2 class="pg-h2">Мікс: кожен стиль іконок у слоті кожного напряму</h2>
  <p class="pg-text">Рядок — напрям, стовпчик — стиль іконок. Великий слот з бургером у руці, під ним усі шість предметів у тому самому слоті, дрібно, щоб видно було, що губиться на тлі. Якщо брати зйомку, то для всіх предметів, які носять: поруч із плоскими піктограмами це дві різні мови.</p>
  <div class="mx">
    <div class="mx-grid mx-headrow">${head}</div>
${rows}
  </div>
</section>`;
}

function cues() {
  const items = CUES.map(([t, d]) => `    <li><b>${t}:</b> ${d}</li>`).join('\n');
  return `<section class="pg-part" id="cues">
  <h2 class="pg-h2">Що робить інтерфейс дорослим: вісім ознак з дослідження</h2>
  <ol class="pg-cues">
${items}
  </ol>
  <p class="pg-text"><a href="${REPORT}">Повний звіт з посиланнями</a> (англійською).</p>
</section>`;
}

const PAGE_CSS = `/* The page chrome: quiet graphite, the same as the MVP screens page; the directions draw their own colours. */
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
.pg-cues { margin: 0; padding-left: 24px; display: grid; gap: 8px; max-width: 66ch; }

/* the mix strip: each slot drawn with its direction's values (A: the mint plate; B: the band; C: the smoked glass),
   over a stand-in for the room's oak floor (not UI) */
.mx { display: grid; gap: 8px; }
.mx-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
.mx-col { font-weight: 700; font-size: 14px; text-align: center; color: var(--dim); }
.mx-row { margin: 8px 0 0; font-weight: 700; font-size: 14px; }
.mx-cell { display: grid; justify-items: center; align-content: start; gap: 8px; padding: 10px 4px 10px; background: #9C6B45; border-radius: 8px; }
.mx-sl { position: relative; display: flex; align-items: center; justify-content: center; box-sizing: border-box; }
.mx-sl svg { display: block; }
.mx-big { width: 88px; height: 88px; }
.mx-big svg { width: 58px; height: 58px; }
.mx-minis { display: grid; grid-template-columns: repeat(3, 30px); gap: 3px; }
.mx-mini { width: 30px; height: 30px; }
.mx-mini svg { width: 22px; height: 22px; }
.mx-a .mx-sl { background: #C4E8D5; border: 2px solid #170D26; border-bottom-width: 3px; border-radius: 4px; }
.mx-a .mx-mini { border-width: 1px; border-bottom-width: 2px; border-radius: 2px; }
.mx-a .mx-big { margin-bottom: 8px; }
.mx-tag { position: absolute; left: 50%; bottom: -11px; transform: translateX(-50%); padding: 2px 6px; background: #170D26; color: #D3F0E0; border-radius: 3px;
  font: 800 11px/1.15 "Sofia Sans Condensed", "Arial Narrow", sans-serif; text-transform: uppercase; letter-spacing: .1em; white-space: nowrap; }
.mx-b .mx-sl { background: #2B1846; }
.mx-b .mx-big { flex-direction: column; justify-content: flex-start; }
.mx-b .mx-big svg { flex: 1; width: 52px; height: auto; }
.mx-name { display: grid; place-items: center; width: 100%; height: 18px; background: #CFF3DF; color: #120A1E;
  font: 600 11px/1 "Oswald", "Arial Narrow", sans-serif; text-transform: uppercase; letter-spacing: .08em; }
.mx-c .mx-sl { background: rgba(27, 18, 41, .92); border: 2px solid rgba(207, 243, 223, .35); border-radius: 16px 16px 4px 4px; }
.mx-c .mx-mini { border-width: 1px; border-radius: 6px 6px 2px 2px; }
.mx-nt { margin-top: -4px; font: 600 11px/1.2 "Geologica", "Segoe UI", sans-serif; text-transform: uppercase; letter-spacing: .08em; color: #CDEFDF;
  -webkit-text-stroke: 2px #0F0A18; paint-order: stroke fill; }`;

function build() {
  const fonts = [];
  const styles = [];
  const parts = DIRECTIONS.map((d) => {
    const f = split(d.file, fonts);
    styles.push(`/* ---------- ${d.file} ---------- */\n${f.styles.join('\n')}`);
    return `<section class="pg-part" id="${d.id}">\n${f.body}\n</section>`;
  });
  const ic = split('icons.html', fonts);
  styles.push(`/* ---------- icons.html ---------- */\n${ic.styles.join('\n')}`);
  const icons = `<section class="pg-part" id="icons">\n${iconsBody(ic.body)}\n</section>`;
  if (/src="icons\//.test(icons)) throw new Error('icons.html: a picture the build does not carry');
  const nav = [...DIRECTIONS.map((d) => [d.id, d.name.split(' · ')[0] + ' · ' + d.name.split(' · ')[1]]), ['icons', 'Іконки'], ['mix', 'Мікс'], ['cues', 'Ознаки']]
    .map(([id, t]) => `<a href="#${id}">${t}</a>`).join('');
  const html = `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="claude:viewport-fit-sides" content="cover">
<title>Дорослий UI</title>
<!-- Generated by pages/grownup/build.js from dir-a.html, dir-b.html, dir-c.html, icons.html and icons/*.png: do not edit by hand. -->
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
  <h1 class="pg-h1">Дорослий UI</h1>
  <p class="pg-lede">Ви сказали, що інтерфейс тепер виглядає дуже по-дитячому, ніби гра для дітей, хоча початкова ідея була класна. Тут три дорослі напрями на тих самих екранах (раунд, мутаційний верстат, показ ролі, кінець) і три стилі іконок предметів. Фіолетовий, м'ята, зелена дія й корал лишилися в усіх трьох.</p>
  <ul class="pg-how">
    <li>Оберіть один напрям і один стиль іконок, або змішайте: наприклад, панелі з одного напряму, шрифт з іншого.</li>
    <li>Критик вважає готовим лише Б; А ще нагадує наліпку, В чистий, але безликий. Його виправлення вже внесено.</li>
    <li>З іконок дорослою виглядає тільки зйомка, і їй потрібні перегенерації; вініл і чорнило критик радить відкинути.</li>
  </ul>
  <nav class="pg-nav">${nav}</nav>
</header>
${parts.join('\n')}
${icons}
${mixStrip()}
${cues()}
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
    if (cur !== html) { console.log(`${PAGE} is stale: run node pages/grownup/build.js`); process.exit(1); }
    console.log(`${PAGE} matches its build (${bytes} bytes)`);
    return;
  }
  fs.writeFileSync(file, html);
  console.log(`wrote ${PAGE} (${bytes} bytes)`);
}

try { main(); } catch (e) { console.log(e.message); process.exit(1); }
