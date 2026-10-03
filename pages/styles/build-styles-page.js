// Builds styles.html: the session wireframes with the three style skins and a style switcher.
const fs = require('fs');
const path = require('path');
const W = path.join('..', 'wireframes', 'wireframes.html');
let s = fs.readFileSync(W, 'utf8');
const meta = JSON.parse(fs.readFileSync('meta.json', 'utf8'));
const order = ['retro', 'card', 'toy'];
// the skins, then the Toy press-feedback preview (outside the Godot-safe lint: motion is a Tween in the game)
const css = order.map((k) => fs.readFileSync(k + '.css', 'utf8')).join('\n') + '\n' + fs.readFileSync('motion-preview.css', 'utf8');
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const must = (a, b) => { if (!s.includes(a)) throw new Error('missing: ' + a.slice(0, 60)); s = s.replace(a, b); };

must('<title>Вайрфрейми сесії</title>', '<title>Стилі екранів</title>');
// the skins after the page's own style, plus the direction cards' style
const extra = `
.dirs { display: grid; gap: 12px; }
@media (min-width: 760px) { .dirs { grid-template-columns: repeat(3, 1fr); } }
.dir { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; display: grid; gap: 8px; align-content: start; min-width: 0; }
.dir button { justify-self: start; font: 600 0.84rem var(--font-ui); padding: 5px 11px; border-radius: 999px; border: 1.5px solid var(--ink); background: transparent; color: var(--ink); cursor: pointer; }
.sw { display: flex; flex-wrap: wrap; gap: 6px; }
.sw span { display: inline-flex; align-items: center; gap: 5px; font-size: 0.74rem; color: var(--muted); }
.sw i { width: 16px; height: 16px; border-radius: 4px; border: 1px solid var(--line); display: inline-block; }
`;
must('</style>', extra + '</style>\n<style>\n/* The three style skins (Godot-safe CSS, checked by check_styles.js) */\n' + css + '\n</style>');
must('<div class="eyebrow">prime-game · UX/UI-відділ · #150 · вайрфрейми</div>', '<div class="eyebrow">prime-game · UX/UI-відділ · prime-game-ui#2 · стилі</div>');
must('<h1>Вайрфрейми сесії</h1>', '<h1>Стилі екранів</h1>');
{
  const re = /<p class="muted">Сірі схеми десяти екранів[^<]*<\/p>/;
  if (!re.test(s)) throw new Error('missing: the intro paragraph');
  s = s.replace(re, '<p class="muted">Три варіанти вигляду на тих самих десяти екранах. Перемикай стиль угорі; стани кожного екрана, мова й масштаб працюють як раніше. Усе намальоване лише тим, що вміє Godot (перевірено скриптом), шрифт — Comfortaa. Кожен екран у масштабі гри (1920×1080): на телефоні вмикай 2× або 3× і гортай убік.</p>');
}
// the style switcher in the sticky bar
must('<span>Мова екранів</span>', '<span>Стиль</span>\n    <span class="seg" id="stylesw"><button type="button" data-st="">Сірий</button>' + order.map((k) => `<button type="button" data-st="${k}">${esc(meta.find((m) => m.key === k).name_uk)}</button>`).join('') + '</span>\n    <span>Мова екранів</span>');
// the direction cards before the fonts section
const cards = '<section class="screen nostate" id="dirs">\n  <h2>Три напрямки</h2>\n  <div class="dirs">\n' + order.map((k) => {
  const m = meta.find((x) => x.key === k);
  const pal = m.palette.slice(0, 8).map((p) => `<span title="${esc(p.use)}"><i style="background:${esc(p.hex)}"></i>${esc(p.name)}</span>`).join('');
  return `    <div class="dir"><h3>${esc(m.name_uk)}</h3><p>${esc(m.pitch_uk)}</p><div class="sw">${pal}${m.palette.length > 8 ? `<span>+${m.palette.length - 8}</span>` : ''}</div><button type="button" data-st="${k}">Показати на екранах</button></div>`;
}).join('\n') + '\n  </div>\n</section>\n';
must('<section class="screen" id="fonts">', cards + '<section class="screen" id="fonts">');
// switcher logic
must('  // zoom\n', `  // style skin
  function setStyle(k) {
    if (k) document.body.setAttribute("data-style", k); else document.body.removeAttribute("data-style");
    document.querySelectorAll("#stylesw [data-st]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-st") === k ? "true" : "false"); });
    try { localStorage.setItem("wf-style", k); } catch (e) {}
  }
  document.querySelectorAll("[data-st]").forEach(function (b) { b.addEventListener("click", function () { setStyle(b.getAttribute("data-st")); }); });
  var st0 = "toy"; try { var sv = localStorage.getItem("wf-style"); if (sv !== null) st0 = sv; } catch (e) {}
  setStyle(st0);
  document.addEventListener("touchstart", function () {}, { passive: true });
  // zoom
`);
fs.writeFileSync('styles.html', s);
new Function(s.slice(s.indexOf('<script>') + 8, s.lastIndexOf('</script>')));
console.log('built styles.html', s.length, 'bytes; divs', (s.match(/<div\b/g) || []).length, (s.match(/<\/div>/g) || []).length, '; sections', (s.match(/<section\b/g) || []).length, (s.match(/<\/section>/g) || []).length);
