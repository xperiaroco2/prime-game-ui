#!/usr/bin/env node
// Builds pages/card-look/index.html: the card pilot (Wi-Fi A, cooking B, pages/card-art/round-4/) shown in the
// ui-1.3.0 look, its one accent in three colours, so the engineer can say whether the clean sketch still fits the
// grown-up turn. Each SVG is inlined once per accent, with its ids suffixed so the copies do not collide.
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'card-art', 'round-4');
const sets = [
  { name: 'Wi-Fi', dir: 'wifi/a', files: ['wifi-1', 'wifi-2', 'wifi-3', 'wifi-4'] },
  { name: 'Готування', dir: 'cooking/b', files: ['cooking-1', 'cooking-2', 'cooking-3', 'cooking-4'] },
  { name: 'Двигун', dir: 'engine/a', files: ['engine-1', 'engine-2', 'engine-3', 'engine-4'] },
  { name: 'Тюнінг авто', dir: 'car/a', files: ['car-1', 'car-2', 'car-3', 'car-4'] },
  { name: 'Фото', dir: 'photo/a', files: ['photo-1', 'photo-2', 'photo-3', 'photo-4'] },
];
const source = '#FFD60A'; // the pilot's accent since 2026-10-21 (Б); each variant swaps it
const accents = [
  { id: 'am', hex: '#e8a33a', title: 'А · бурштиновий (до 21.10)', note: 'Перший акцент пілота (07.10). Його немає в палітрі ui-1.3.0.' },
  { id: 'ye', hex: '#FFD60A', title: 'Б · жовтий палітри — вибрано 21.10', note: 'Жовтий наліпки (витривалість, бирки). Ближче до UI, лишається спокійним.' },
  { id: 'ac', hex: '#B6FF3C', title: 'В · кислотно-зелений', note: 'Колір головної дії ui-1.3.0. Найяскравіший; на білій картці світіння немає.' },
];

function inline(file, accent) {
  let svg = fs.readFileSync(path.join(root, file), 'utf8').replace(/<!--[\s\S]*?-->/g, '').trim();
  const ids = [...svg.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  for (const id of ids) svg = svg.split(`"${id}"`).join(`"${id}-${accent.id}"`).split(`#${id})`).join(`#${id}-${accent.id})`);
  return svg.split(source).join(accent.hex).replace(/ width="320" height="240"/, '');
}

let body = '';
for (const a of accents) {
  body += `<section class="v"><h2>${a.title}</h2><p class="cap">${a.note}</p>`;
  for (const s of sets) {
    body += `<h3>${s.name}</h3><div class="row">`;
    for (const f of s.files) body += `<div class="card">${inline(path.join(s.dir, f + '.svg'), a)}</div>`;
    body += '</div>';
  }
  body += '</section>\n';
}

const html = `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Картки в новому вигляді</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Commissioner:wght@400;600;700&display=swap">
<style>
/* Quiet graphite chrome, the same as pages/mvp-screens; each card frame is the how-to frame of ui-1.3.0: white, a
   4 px ink border, 16 px corners and the hard ink shadow. The art inside is a texture (an SVG rendered to PNG). */
:root { color-scheme: dark; --ground: #141317; --raise: #1C1B21; --line: #2E2C35; --ink-c: #ECE9F1; --dim: #A6A2B1; --ink: #1E1230; }
body { margin: 0; background: var(--ground); color: var(--ink-c); font: 16px/1.5 "Commissioner", "Segoe UI", system-ui, sans-serif; }
.wrap { max-width: 1040px; margin: 0 auto; padding: 28px 16px 64px; display: grid; gap: 36px; }
h1 { font-size: clamp(28px, 6vw, 42px); line-height: 1.05; margin: 0; }
h2 { font-size: clamp(21px, 4vw, 26px); margin: 0; }
h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .1em; color: var(--dim); margin: 14px 0 8px; font-weight: 600; }
p { margin: 0; max-width: 66ch; }
.lede, .cap { color: var(--dim); }
.how { border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; background: var(--raise); display: grid; gap: 8px; }
.v { display: grid; gap: 6px; }
.row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }
.card { background: #FFFFFF; border: 4px solid var(--ink); border-radius: 16px; box-shadow: 5px 5px 0 var(--ink); padding: 6px; }
.card svg { display: block; width: 100%; height: auto; }
</style>
</head>
<body>
<main class="wrap">
  <header style="display:grid;gap:14px">
    <h1>Картки «як грати» в новому вигляді</h1>
    <p class="lede">Пілот карток (Wi-Fi A і готування B, обидва пройшли критика) намальовано 07.10 у стилі «чистий скетч» — ще до дорослого повороту. Тут ті самі картки в рамці ui-1.3.0, з одним акцентом у трьох кольорах.</p>
    <div class="how">
      <p><b>Що вирішити.</b> 1) Чи лишаємо чистий скетч для карток: чорнильна лінія, фігурка з антенками, без слів, маленький візуальний жарт у кадрі (не написаний). 2) Якщо так — який акцент: А, Б чи В.</p>
      <p><b>21.10:</b> ви обрали Б; картки всіх п'яти задач MVP тепер у цьому стилі (двигун, авто й фото домальовано того ж дня).</p>
    </div>
  </header>
${body}  <footer class="cap">Малюнки — наша власна робота (<code>pages/card-art/round-4/</code>, їхні <code>LICENCES.json</code>); сторінку збирає <code>pages/card-look/build.js</code>.</footer>
</main>
</body>
</html>
`;
const out = path.join(__dirname, 'index.html');
if (process.argv.includes('--check')) {
  // node pages/card-look/build.js --check: exit 1 when index.html is not what this script makes (tools/check.js runs it)
  if (!fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== html) { console.error('pages/card-look/index.html is stale: run node pages/card-look/build.js'); process.exit(1); }
} else {
  fs.writeFileSync(out, html);
  console.log('wrote pages/card-look/index.html (' + Math.round(html.length / 1024) + ' KB)');
}
