// The cops' minute: one clock or two (s07 «Копи за хвилину»). Builds cops-clock.html with the two s07 renders
// inlined; the renders are own work (tools/screens/shots.js of pages/screens, uk, default text, scale 0.5).
// usage: node pages/cops-clock/build.js <option A png> <option B png>
'use strict';
const fs = require('fs');
const path = require('path');

const [a, b] = process.argv.slice(2);
if (!a || !b) { console.error('usage: node pages/cops-clock/build.js <A.png> <B.png>'); process.exit(2); }
const uri = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');

const html = `<title>Хвилина копів</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
/* Layout: one column, two framed shots, the recommended one first. */
:root {
  --bg: #f3f1f8; --fg: #1a1629; --dim: #5f5878; --line: #d9d4e8; --card: #ffffff; --accent: #1f8f5f; --danger: #c43347;
  --text: "Onest", system-ui, sans-serif; --display: "Unbounded", system-ui, sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #1a1629; --fg: #ece8f7; --dim: #a39dbd; --line: #3a3358; --card: #2a2540; --accent: #6ff2b4; --danger: #ff5c6c; color-scheme: dark } }
:root[data-theme="dark"] {
  --bg: #1a1629; --fg: #ece8f7; --dim: #a39dbd; --line: #3a3358; --card: #2a2540; --accent: #6ff2b4; --danger: #ff5c6c; color-scheme: dark }
body { background: var(--bg); color: var(--fg); font: 16px/1.5 var(--text); }
main { max-width: 980px; margin: 0 auto; padding-block: 24px 48px; padding-left: max(16px, env(safe-area-inset-left, 0px));
  padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 28px; }
h1 { font: 700 28px/1.2 var(--display); margin: 0; text-wrap: balance; }
.lead { margin: 0; max-width: 65ch; color: var(--dim); }
.opt { display: grid; gap: 12px; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 16px; }
.opt.rec { border: 2px solid var(--accent); }
.opt h2 { margin: 0; font: 700 18px/1.3 var(--display); display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: baseline; }
.tag { font: 700 12px/1 var(--text); letter-spacing: .06em; text-transform: uppercase; color: var(--accent); }
.opt p { margin: 0; max-width: 65ch; }
.opt img { display: block; width: 100%; height: auto; border-radius: 8px; }
.note { margin: 0; font-size: 14px; color: var(--dim); max-width: 65ch; }
</style>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;700&family=Unbounded:wght@700&display=swap">
<main>
  <h1>Хвилина копів: один годинник чи два</h1>
  <p class="lead">Сусіди викликали копів. Обидва кінці тут — перемога людей: і коли приїдуть копи, і коли скінчиться час
  раунду. Тож для прибульців важить лише той годинник, що спрацює раніше.</p>
  <section class="opt rec">
    <h2>A · Лише відлік копів <span class="tag">Рекомендую</span></h2>
    <p>Поки йде хвилина копів, таймер раунду вгорі ховається; лишається шкала гніву. Один годинник — один дедлайн.
    Якщо до кінця раунду менше хвилини, копів не показуємо: раунд закінчиться раніше.</p>
    <img src="${uri(b)}" alt="Варіант A: угорі лише шкала гніву, по центру червона плашка «Сусіди викликали копів!» з відліком 0:58">
  </section>
  <section class="opt">
    <h2>B · Обидва, як на зразку</h2>
    <p>Таймер раунду (04:12) лишається вгорі, відлік копів (0:58) — у плашці. Два числа, що біжать одночасно; гравцю
    треба зрозуміти, що 04:12 уже не має значення.</p>
    <img src="${uri(a)}" alt="Варіант B: угорі таймер 04:12 і шкала гніву, по центру червона плашка з відліком 0:58">
  </section>
  <p class="note">Знімки — екран s07 «Копи за хвилину» з бібліотеки ui-2.2.1. Довжина хвилини (60 с) лишається питанням до дизайну гри.</p>
</main>
`;
fs.writeFileSync(path.join(__dirname, 'cops-clock.html'), html);
console.log('wrote pages/cops-clock/cops-clock.html');
