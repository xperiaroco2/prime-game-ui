// The glowing-bars page (pages/glow-bars/index.html), round 3 of the sticker with the glow. The engineer's answers on
// the sticker-glow page (2026-10-21): the glow he meant is on the progress bars, not on the item in hand; the neon item
// icons' shape is fine, but without the glow; keep researching. This page shows the sticker screens with three ways of
// lighting the bars and the critic's options (screens.html), the line icons without the glow in three colourings
// (icons.html; the SVGs in icons/ with their records in icons/LICENCES.json), the critic's verdict under each part and
// the research's main points (docs/research/2026-10-21-glow-bars/report.md). The fragments are hand-written; this
// script assembles them into one self-contained page: their Google Fonts links go to the head (once each), their
// <style> blocks to the head in order, their markup and scripts stay in the body.
//
//   node pages/glow-bars/build.js           write index.html
//   node pages/glow-bars/build.js --check   exit 1 when index.html is not what this script makes (tools/check.js runs it)
//
// Node 20, node's own modules only.
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const ROOT = path.resolve(DIR, '..', '..');
const PAGE = 'pages/glow-bars/index.html';
const MAX_BYTES = 4 * 1024 * 1024;
const REPORT = 'https://github.com/xperiaroco2/prime-game-ui/blob/main/docs/research/2026-10-21-glow-bars/report.md';

const read = (name) => fs.readFileSync(path.join(DIR, name), 'utf8').replace(/\r\n/g, '\n');

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
  if (/<img\b/.test(html) || /url\(/.test(styles.join('\n'))) throw new Error(`${name}: an outside picture or url()`);
  return { styles, body: html.trim() };
}

// Every icon the icons fragment draws has its SVG file and a licence record.
function checkIcons(body) {
  const licences = JSON.parse(read('icons/LICENCES.json'));
  const ids = [...body.matchAll(/<symbol id="gi3-([a-z-]+)"/g)].map((m) => m[1]);
  if (ids.length !== 12) throw new Error(`icons.html: ${ids.length} icons, 12 expected`);
  for (const id of ids) {
    const file = `line-${id}.svg`;
    if (!fs.existsSync(path.join(DIR, 'icons', file))) throw new Error(`pages/glow-bars/icons/${file} is missing`);
    if (!licences[file] || !licences[file].licence) throw new Error(`pages/glow-bars/icons/LICENCES.json: no licence record for ${file}`);
  }
}

// The critic's verdicts (round 3), one line per part; the scores are: keeps the sticker, grown-up, character, pretty.
const vd = (title, scores, text) =>
  `<div class="pg-vd"><b>${title}</b>${scores ? ` <span class="pg-sc">${scores}</span>` : ''} ${text}</div>`;

const BAR_VERDICTS = [
  vd('Спосіб 1 · заливка.', 'наліпка 7 · дорослість 6 · характер 5 · краса 5 · не готово.',
    'Світло нічого не означало: спокійні смужки світились сильніше за тривожні, бо коротка заливка дає меншу тінь; на білій доріжці тінь лягає брудом. Виправлено: спокійне світло тепер ледь-ледь.'),
  vd('Спосіб 2 · край.', '6 · 5 · 5 · 4 · не готово, критик радить відкинути.',
    'Світліший кінчик читається як друга, «щойно втрачена» частина смужки, а світло найсильніше, коли здоров\'я повне, тобто навпаки. Лишили лише для порівняння.'),
  vd('Спосіб 3 · поріг.', '8 · 7 · 6 · 6 · найкращий, ще не готово.',
    'Правильна думка (світло означає біду), але світло тривоги було слабке. Виправлено: тепер світиться вся доріжка, а не заливка; пік і спад пульсу показано нерухомими колонками; додано кадр зблизька. Темна доріжка й яскравіше світло — поради критика, вирішуєте ви.'),
  vd('Кнопки світяться: так.', '7 · 7 · 7 · 7 · готово.',
    'На м\'ятній картці світло майже зникає, і це радше кислотна кнопка, ніж та, що світиться; кислотний поруч із зеленим заголовком дає два майже однакові зелені. Виправлено: кнопка стоїть на тій самій лінії, що й звичайна.'),
  vd('Кнопки світяться: ні.', '10 · 6 · 7 · 7 · готово.',
    'Точно кнопка MVP: запасний варіант, якщо світло житиме лише на смужках.'),
  vd('Рушій.', '',
    'Перед вибором перевірити один ProgressBar у Godot 4.7.2: чи не обрізає він тінь і чи схоже лінійне згасання shadow_size на розмиття в браузері (не підтверджено).'),
];

const ICON_VERDICTS = {
  1: vd('Вирок · 1, чорнильна лінія.', 'наліпка 8 · дорослість 7 · характер 5 · краса 6 · не готово.',
    'М\'ятний акцент зникав (близько 1:1, а треба 3:1); без заливки мішок схожий на мішечок грошей, булка — на купол, а разом це звичайні контурні іконки з меншим характером, ніж наліпка. Виправлено: акцент чорнильний.'),
  2: vd('Вирок · 2, темна плашка.', '5 · 8 · 6 · 7 · не готово.',
    'Рука губиться (близько 1,3:1 між двома фіолетовими), кислотні акценти на поясі стають цятками, а темні плашки тягнуть панель до «Інопланетної техніки»: це вже зміна характеру стилю, питання до вас.'),
  3: vd('Вирок · 3, одна заливка.', '9 · 8 · 7 · 8 · найближча до наліпки, найкраще читається.',
    'Виправлено в усіх трьох: деталь двигуна — свічка запалювання в металево-сірому замість радіатора, котлета вища, з рваним краєм і червонішим рожевим, у лійки довший носик і більша сітка, мішок грудкуватий. Заливки приглушені поруч із яскравою палітрою наліпки: брати їх з палітри чи ні — вирішуєте ви.'),
};

function iconsBody(body) {
  const at = (s, marker, add) => {
    const n = s.split(marker).length - 1;
    if (n !== 1) throw new Error(`icons.html: "${marker}" found ${n} times`);
    return s.replace(marker, `${add}\n${marker}`);
  };
  let out = at(body, '<h3>2 ·', ICON_VERDICTS[1]);
  out = at(out, '<h3>3 ·', ICON_VERDICTS[2]);
  if (!out.endsWith('</section>')) throw new Error('icons.html: does not end with </section>');
  return `${out.slice(0, -'</section>'.length)}${ICON_VERDICTS[3]}\n</section>`;
}

const a = (href, text) => `<a href="${href}">${text}</a>`;
const RESEARCH = [
  `Світіння смужки в Godot — це тінь StyleBoxFlat: яскравий shadow_color, зсув 0, shadow_size у пікселях; одна тінь без inset і spread, тож у межах наших правил. ProgressBar має лише дві плашки, доріжку й заливку; іскра на кінці чи поділки — окремі дочірні вузли (${a('https://docs.godotengine.org/en/stable/classes/class_styleboxflat.html', 'StyleBoxFlat')}, ${a('https://docs.godotengine.org/en/stable/classes/class_progressbar.html', 'ProgressBar')}).`,
  `Звичний прийом: смужка спокійна, доки не перейде поріг, і лише тоді пульсує. Так у стандартній смужці Torque 3D (pulseThreshold) і у вільному (CC0) шейдері для Godot (поріг 0.25); «живість» дають пульс, слід щойно втраченого й світлий край, а не сяйво (${a('https://torque3d.readthedocs.io/en/3.5/script/class/GuiHealthBarHud.html', 'Torque 3D')}, ${a('https://godotshaders.com/shader/health-bar/', 'godotshaders')}).`,
  `Колір не може бути єдиним сигналом: його дублюють формою, рухом, іконкою (${a('https://devdocs.xbox.com/gaming/accessibility/xbox-accessibility-guidelines/103', 'Xbox XAG 103')}). У нас це довжина смужки, пульс і сирена.`,
  `Спалахи: не більше трьох на секунду й не на великій площі (${a('https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html', 'WCAG 2.3.1')}, ${a('https://devdocs.xbox.com/gaming/accessibility/xbox-accessibility-guidelines/118', 'XAG 118')}). Повільний пульс близько 0,5 Гц на маленькій смужці далеко в межах (наш висновок).`,
  `Справжнє неонове сяйво (bloom) у Godot — пост-ефект усього кадру (HDR 2D), і воно поза нашими правилами для інтерфейсу; брати його чи ні — рішення про правила (${a('https://docs.godotengine.org/en/stable/tutorials/3d/environment_and_post_processing.html', 'Godot')}). А на світлому тлі світло майже не видно (порада з форуму, не підтверджено, ${a('https://discussions.unity.com/t/emission-glow-with-unity-ui/590375', 'Unity')}): звідси темна доріжка як варіант.`,
  `Іконки: спершу силует (залити чорним і впізнати предмет), мінімум деталей, одна товщина лінії на весь набір (${a('https://madegooddesigns.com/?p=5494', 'гайд з ігрових іконок')}). Характер дають товщина, кінці й кути лінії, а не ще один контурний набір за замовчуванням (${a('https://blog.streamlinehq.com/stroke-of-genius', 'Streamline')}).`,
];

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
.pg-vds { display: grid; gap: 8px; }
.pg-vd { padding: 10px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--raise); color: var(--ink-c);
  font: 15px/1.45 var(--chrome); max-width: 80ch; overflow-wrap: anywhere; }
.pg-vd b { font-weight: 700; }
.pg-sc { color: var(--dim); }
.pg-research { margin: 0; padding-left: 22px; display: grid; gap: 10px; max-width: 72ch; overflow-wrap: anywhere; }`;

function build() {
  const fonts = [];
  const styles = [];
  const sc = split('screens.html', fonts);
  styles.push(`/* ---------- screens.html ---------- */\n${sc.styles.join('\n')}`);
  const ic = split('icons.html', fonts);
  styles.push(`/* ---------- icons.html ---------- */\n${ic.styles.join('\n')}`);
  checkIcons(ic.body);
  const screens = `<section class="pg-part" id="screens">
${sc.body}
<h2 class="pg-h2">Вирок критика: смужки й кнопки</h2>
<div class="pg-vds">
${BAR_VERDICTS.join('\n')}
</div>
</section>`;
  const icons = `<section class="pg-part" id="icons">
${iconsBody(ic.body)}
</section>`;
  const research = `<section class="pg-part" id="research">
  <h2 class="pg-h2">Що знайшло дослідження</h2>
  <ol class="pg-research">
${RESEARCH.map((r) => `    <li>${r}</li>`).join('\n')}
  </ol>
  <p class="pg-text">Повний звіт з усіма посиланнями: ${a(REPORT, 'docs/research/2026-10-21-glow-bars/report.md')}.</p>
</section>`;
  const nav = [['screens', 'Смужки'], ['icons', 'Іконки'], ['research', 'Дослідження']]
    .map(([id, t]) => `<a href="#${id}">${t}</a>`).join('');
  return `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="claude:viewport-fit-sides" content="cover">
<title>Світні смуги</title>
<!-- Generated by pages/glow-bars/build.js from screens.html and icons.html: do not edit by hand. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fonts.map((h) => `<link rel="stylesheet" href="${h}">`).join('\n')}
<style>
${PAGE_CSS}

${styles.join('\n\n')}
</style>
</head>
<body>
<main class="pg">
<header class="pg-intro">
  <h1 class="pg-h1">Світні смуги</h1>
  <p class="pg-lede">Ви сказали: світіння ви мали на увазі на смужках прогресу, а не на іконці предмета; форма неонових іконок нормальна, але без світіння; і досліджувати далі. Тож світло переїхало з руки на смужки гніву, здоров'я, витривалості й повернення, а іконки стали лінійними, без світла.</p>
  <ul class="pg-how">
    <li>Перемикайте спосіб світіння над екранами: 1 — заливка, 2 — край, 3 — поріг. Критик радить 3 (світло лише в тривозі); 2 радить відкинути.</li>
    <li>Ще два перемикачі — поради критика: темна доріжка й яскравіше світло. Це колір і компонент, тож вирішуєте ви.</li>
    <li>Іконки в трьох розфарбовках; найкраще читається третя, з однією заливкою. Під кожною частиною — вирок критика.</li>
    <li>Нічого ще не обрано: скажіть, який спосіб, яка доріжка й яке світло, і яка розфарбовка іконок.</li>
  </ul>
  <nav class="pg-nav">${nav}</nav>
</header>
${screens}
${icons}
${research}
</main>
</body>
</html>
`;
}

function main() {
  const check = process.argv.includes('--check');
  const html = build();
  const bytes = Buffer.byteLength(html);
  if (bytes > MAX_BYTES) throw new Error(`${PAGE}: ${bytes} bytes, over the 4 MB limit`);
  const file = path.join(ROOT, ...PAGE.split('/'));
  if (check) {
    const cur = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    if (cur !== html) { console.log(`${PAGE} is stale: run node pages/glow-bars/build.js`); process.exit(1); }
    console.log(`${PAGE} matches its build (${bytes} bytes)`);
    return;
  }
  fs.writeFileSync(file, html);
  console.log(`wrote ${PAGE} (${bytes} bytes)`);
}

try { main(); } catch (e) { console.log(e.message); process.exit(1); }
