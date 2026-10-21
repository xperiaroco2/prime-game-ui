// The suit C page (pages/suit-c/index.html): direction C of the suit UI page ("the ship's modules") developed after the
// engineer's choice (2026-10-21, chat): four module shapes on the same round HUD, four palettes on one shape (the HUD
// and the cops' minute each), and the mutation workbench as a screen on the machine in the world. Every HUD frame is
// drawn by the same function, so only the shape or the palette differs between them.
//
//   node pages/suit-c/build.js           write index.html
//   node pages/suit-c/build.js --check   exit 1 when index.html is not this script's output (tools/check.js runs it)
//
// Inside the frames, Godot-safe CSS only (solid fills, alpha allowed; per-side border widths with one colour; per-corner
// radii; at most one shadow, no inset, no spread; one text outline). The world stand-ins (walls, floor, the machine's
// body, the other player) are not UI: in the game they are the 3D scene. The machine's screen is scaled with a CSS
// transform only as the stand-in for the 3D projection of its SubViewport texture.
// Node 20, node's own modules only.
'use strict';
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'index.html');

// ---------- the variants ----------

const SHAPES = [
  { id: 'sA', name: 'Плитка', fishka: 'простий прямокутник із малими однаковими кутами й тонкою межею; підпис — рядок тексту всередині.',
    godot: 'StyleBoxFlat: усі чотири радіуси 8 px, межа 1 px одного кольору.' },
  { id: 'sB', name: 'Великий кут', fishka: 'один великий кут, повернутий до центру екрана (у модуля часу — обидва нижні), решта малі; товстіший низ, як у В.',
    godot: 'StyleBoxFlat: один радіус 30 px (свій для кожного кута екрана), три по 6 px; нижня межа 4 px.' },
  { id: 'sC', name: 'Бирка-смуга', fishka: 'тонка світла смуга згори з підписом, як наклейка на обладнанні; кути малі.',
    godot: 'StyleBoxFlat: верхня межа 16 px кольору бирки, радіуси 7 px; підпис — Label поверх цієї межі.' },
  { id: 'sD', name: 'Підкладка', fishka: 'без рамки: текст із контуром на напівпрозорій темній підкладці; найменше «коробок».',
    godot: 'StyleBoxFlat: заливка з альфою 0.6, радіуси 4 px, без межі; текст — LabelSettings з контуром 2 px.' },
];

// calm neutrals + one accent + the danger colour; C as it was is "pC", shown only on the shapes
const PALETTES = [
  { id: 'p1', name: 'Тихий ангар', feel: 'холодний графіт і бірюза: спокійно, технічно, найближче до В.',
    sw: [['#20242B', 'модуль'], ['#C9D3DE', 'бирка'], ['#4FD6C8', 'акцент'], ['#FF5A4E', 'небезпека']] },
  { id: 'p2', name: 'Теплий вініл', feel: 'теплий какао-сірий і зелений прибульця: м’якше, як іграшка з вінілу.',
    sw: [['#2F2A28', 'модуль'], ['#F1E8DC', 'бирка'], ['#A8E063', 'акцент'], ['#FF5A4A', 'небезпека']] },
  { id: 'p3', name: 'Чорнильна м’ята', feel: 'чорнильно-фіолетовий і м’ята: ті кольори, що вам сподобались у наліпці, але тихіше.',
    sw: [['#2A2540', 'модуль'], ['#ECE8F7', 'бирка'], ['#6FF2B4', 'акцент'], ['#FF5C6C', 'небезпека']] },
  { id: 'p4', name: 'Кістяний корпус', feel: 'світлі кістяні модулі й кобальт: як пластиковий корпус корабля вдень.',
    sw: [['#E8E2D6', 'модуль'], ['#23212A', 'бирка'], ['#3557E0', 'акцент'], ['#E2392F', 'небезпека']] },
];

const PAL_SHAPE = 'sC';   // the one shape the palettes are shown on
const REC = { shape: 'sC', palette: 'p3' };

const ROSTER = [
  ['me', '#7C5CC8', 'Олена (ти)'], ['', '#1C7A82', 'Ґлорп'], ['', '#E66B57', 'Їжак'], ['', '#E8B04A', 'Бульк'],
  ['', '#4AA3DF', 'Зінґа'], ['dead', '#5C5A60', 'Тарас · поза грою'],
];
const ROSTER_LOUD = ROSTER.slice(0, 5).concat([['', '#D46FB0', 'Тарас']]);

// ---------- the pieces ----------

const pips = (n, cls) => Array.from({ length: 10 }, (_, i) => `<i${i < n ? ` class="${cls}"` : ''}></i>`).join('');
const icon = (id, s) => `<svg class="ic" width="${s}" height="${s}"><use href="#i-${id}"/></svg>`;

function timeModule(loud, extra = '') {
  return `<div class="m row time k-b nt${loud ? ' hot' : ''}"${extra}>
        <span class="u tm">${loud ? '04:12' : '07:42'}</span><i class="div"></i>
        <div class="col ang"><span class="lab${loud ? ' dn' : ''}">Гнів сусідів</span><div class="bar"><b class="fill" style="--v:${loud ? 1 : 0.55}"></b></div></div>
      </div>`;
}
function rosterModule(loud) {
  const rows = (loud ? ROSTER_LOUD : ROSTER).map(([c, col, n]) => `<div class="row rw${c ? ' ' + c : ''}"><i style="background:${col}"></i>${n}</div>`).join('');
  return `<div class="m col roster k-bl"><span class="tab">Гравці</span>${rows}</div>`;
}
function vitalsModule(loud) {
  return `<div class="m col vit k-tr"><span class="tab">Костюм</span>
        <div class="row vr"><span class="lab${loud ? ' dn' : ''}">Здоровʼя</span><div class="row segs">${loud ? pips(2, 'd') : pips(8, 'a')}</div></div>
        <div class="row vr"><span class="lab">Витривалість</span><div class="row segs">${pips(6, 'b')}</div></div>
      </div>`;
}
function slots(loud) {
  const hand = loud ? ['battery', 'Батарейка'] : ['rocket', 'Феєрверк'];
  return `<div class="m col sl on hand k-tl"><span class="tab">Рука</span>${icon(hand[0], 38)}<span class="nm">${hand[1]}</span></div>
      <div class="m col sl belt k-tl"><span class="tab">Пояс</span>${loud ? '<span class="nm">&nbsp;</span>' : icon('bun', 36) + '<span class="nm">Булка</span>'}</div>`;
}
const cross = '<div class="abs ch1"></div><div class="abs ch2"></div>';
const house = '<div class="floor"></div><div class="door"></div><div class="win"></div><div class="sofa"></div>';

function hud(shape, pal, loud) {
  const cops = loud ? `
      <div class="m col cops k-b nt"><span class="u s1">Сусіди викликали копів!</span><span class="s2">Копи будуть за</span><span class="u t">0:58</span></div>` : '';
  return `<div class="frame"><div class="stage w-house ${shape} ${pal}${loud ? ' loud' : ''}">
      ${house}
      ${timeModule(loud)}${cops}
      ${rosterModule(loud)}
      ${cross}
      ${vitalsModule(loud)}
      ${slots(loud)}
    </div></div>`;
}

// the close-up: the same modules at their real size (0.75x, the MVP scale), outside the stage
function detail(shape, pal) {
  return `<div class="det ${shape} ${pal}" aria-label="Модулі в реальному розмірі">
      ${vitalsModule(false)}
      <div class="row" style="gap:10px;align-items:flex-end">${slots(false)}</div>
      ${rosterModule(false)}
    </div>`;
}

// the palette close-up: the calm modules and the loud ones at their real size
function detailPal(shape, pal) {
  return `<div class="det ${shape} ${pal}" aria-label="Модулі в реальному розмірі">
      ${timeModule(false)}
      ${vitalsModule(false)}
      <div class="row" style="gap:10px;align-items:flex-end">${slots(false)}</div>
      ${timeModule(true)}
      <div class="m col cops nt"><span class="u s1">Сусіди викликали копів!</span><span class="s2">Копи будуть за</span><span class="u t">0:58</span></div>
      ${vitalsModule(true)}
    </div>`;
}

// the workbench screen, a 640x360 SubViewport's content
function screen(pointed) {
  const card = (i, name, fx, cost, btn, off) => `<div class="m col card k-tl${i === pointed ? ' on' : ''}${off ? ' off' : ''}"><span class="u nm">${name}</span><span class="fx">${fx}</span><span class="u c">${cost}</span><span class="row" style="margin-top:auto"><span class="u btn${off ? ' no' : i === pointed ? '' : ' o'}">${btn}</span></span></div>`;
  return `<div class="vp col">
          <div class="row vhd"><span class="u vt">Мутаційний верстат</span><span class="row pts"><span class="lab">Твої очки</span><b class="u">7</b></span></div>
          <div class="row cards">
            ${card(0, 'Швидкі ноги', 'Бігаєш швидше', '4 очки', 'Мутувати')}
            ${card(1, 'Пружні ноги', 'Стрибаєш вище', '3 очки', 'Мутувати')}
            ${card(2, 'Товста шкіра', 'Більше здоровʼя', '9 очок', 'Бракує 2', true)}
          </div>
        </div>`;
}

function bench(close) {
  const s = REC.shape, p = REC.palette;
  if (close) {
    return `<div class="frame"><div class="stage w-lab ${s} ${p}">
      <div class="floor"></div>
      <div class="abs mach-top" style="left:190px;top:96px;width:960px;height:28px"></div>
      <div class="abs mach-side" style="left:1090px;top:112px;width:60px;height:620px"></div>
      <div class="abs mach" style="left:190px;top:112px;width:900px;height:620px"></div>
      <div class="abs bezel" style="left:244px;top:130px;width:792px;height:460px"></div>
      <div class="abs scr" style="left:260px;top:146px;width:760px;height:428px"><div class="vpw" style="transform:scale(${(760 / 640).toFixed(4)})">${screen(1)}</div></div>
      <div class="abs slotm" style="left:490px;top:630px;width:300px;height:12px"></div>
      ${timeModule(false)}
      ${rosterModule(false)}
      ${cross}
      ${vitalsModule(false)}
      ${slots(false)}
    </div></div>`;
  }
  const sc = 320 / 640;
  return `<div class="frame"><div class="stage w-lab ${s} ${p}">
      <div class="floor"></div><div class="abs cable" style="left:40px;top:300px;width:150px;height:14px"></div>
      <div class="abs mach-top" style="left:180px;top:196px;width:482px;height:22px"></div>
      <div class="abs mach-side" style="left:600px;top:210px;width:62px;height:356px"></div>
      <div class="abs mach" style="left:180px;top:210px;width:420px;height:356px"></div>
      <div class="abs bezel" style="left:220px;top:240px;width:340px;height:196px"></div>
      <div class="abs scr" style="left:230px;top:250px;width:320px;height:180px"><div class="vpw" style="transform:scale(${sc})">${screen(0)}</div></div>
      <div class="abs knob" style="left:236px;top:470px"></div><div class="abs knob" style="left:280px;top:470px"></div><div class="abs slotm" style="left:348px;top:476px;width:200px;height:12px"></div>
      <div class="abs leg" style="left:208px;top:560px;width:40px;height:30px"></div><div class="abs leg" style="left:530px;top:560px;width:40px;height:30px"></div>
      <div class="abs pal" style="left:720px;top:330px"><i class="head"></i><i class="eye" style="left:22px"></i><i class="eye" style="left:56px"></i><i class="body"></i></div>
      <span class="abs plate" style="left:752px;top:300px">Ґлорп</span>
      ${timeModule(false)}
      ${rosterModule(false)}
      ${cross}
      ${vitalsModule(false)}
      ${slots(false)}
    </div></div>`;
}

const sw = (list) => `<div class="sw">${list.map(([c, n]) => `<span><i style="background:${c}"></i>${n}</span>`).join('')}</div>`;
const shapeName = (id) => SHAPES.find((s) => s.id === id).name;
const palName = (id) => PALETTES.find((p) => p.id === id).name;

// ---------- the page ----------

const CSS = `
/* The page chrome is dark by choice (one look, as the other suit pages); every colour is set explicitly. */
:root {
  color-scheme: dark;
  --ground: #121216;
  --raise: #1B1B21;
  --line: #2C2C34;
  --ink-c: #ECEAF0;
  --dim: #A3A1AD;
  --hi: #6FF2B4;
  --chrome: "Onest", "Segoe UI", system-ui, sans-serif;
  --disp: "Unbounded", "Segoe UI", sans-serif;
}
body { margin: 0; background: var(--ground); color: var(--ink-c); font: 16px/1.5 var(--chrome); overflow-wrap: anywhere; }
.wrap { max-width: 1040px; margin: 0 auto; padding-block: 28px 64px;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
  display: grid; gap: 48px; }
h1 { font: 700 clamp(28px, 6vw, 44px)/1.08 var(--disp); margin: 0; text-wrap: balance; letter-spacing: -0.01em; }
h2 { font: 700 clamp(22px, 4.2vw, 30px)/1.15 var(--disp); margin: 0; text-wrap: balance; }
h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .1em; color: var(--dim); margin: 0; font-weight: 600; }
h3 b { color: var(--ink-c); font-weight: 700; }
p { margin: 0; max-width: 66ch; }
.lede { font-size: 18px; }
.intro, .sec, .sec > header, .var, .pair { display: grid; gap: 14px; min-width: 0; }
.sec { gap: 28px; }
.var { gap: 10px; }
.kicker { font-size: 13px; text-transform: uppercase; letter-spacing: .1em; color: var(--dim); font-weight: 600; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px; color: var(--dim); }
.tag.rec { color: var(--hi); border-color: var(--hi); }
.note, .cap { color: var(--dim); font-size: 15px; }
.cap b { color: var(--ink-c); font-weight: 600; }
.switch { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--ground); padding-block: 10px; border-bottom: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--ground); }
.switch span { font-weight: 600; }
.switch button { font: 600 15px/1.2 var(--chrome); color: var(--ink-c); background: var(--raise); border: 1px solid var(--line); border-radius: 999px; padding: 8px 16px; cursor: pointer; }
.switch button[aria-pressed="true"] { background: var(--ink-c); color: var(--ground); border-color: var(--ink-c); }
.switch button:focus-visible { outline: 2px solid var(--ink-c); outline-offset: 2px; }
.switch small { color: var(--dim); font-size: 13px; flex-basis: 100%; }
.sw { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; color: var(--dim); font-size: 13px; }
.sw i { display: inline-block; width: 18px; height: 18px; border-radius: 5px; border: 1px solid var(--line); vertical-align: -4px; margin-right: 5px; }
.scroller { overflow-x: auto; border-radius: 12px; }
.frame { position: relative; width: 100%; aspect-ratio: 16 / 9; max-width: 100%; border-radius: 12px; overflow: hidden; background: #55606A; }
.big .frame { width: 200%; max-width: none; }
.stage { position: absolute; left: 0; top: 0; width: 1280px; height: 720px; transform-origin: 0 0; overflow: hidden; }
.pair { gap: 18px; }
.pair .lbl { color: var(--dim); font-size: 13px; }
.godot { border: 1px solid var(--line); border-radius: 12px; padding: 12px 16px; background: var(--raise); display: grid; gap: 6px; font-size: 15px; }
.godot b { color: var(--ink-c); }
.godot a, .foot a, .intro a { color: var(--ink-c); }
.recbox { border: 2px solid var(--hi); border-radius: 14px; padding: 16px 18px; display: grid; gap: 8px; background: var(--raise); }
.recbox h2 { font-size: 22px; }
.foot { color: var(--dim); font-size: 14px; display: grid; gap: 8px; border-top: 1px solid var(--line); padding-top: 20px; }
.foot ul { margin: 0; padding-left: 20px; display: grid; gap: 4px; }
.det { display: flex; flex-wrap: wrap; gap: 24px 14px; align-items: flex-end; padding-block: 26px 14px; padding-inline: 10px; min-width: 0; border-radius: 12px; background: #7A6F63; }

/* ---------- Inside the frames (Godot-safe) ---------- */
.stage, .det { white-space: nowrap; line-height: 1.2; overflow-wrap: normal; font-family: "Onest", "Segoe UI", sans-serif; color: var(--tx); }
.u { font-family: "Unbounded", "Segoe UI", sans-serif; }
.abs { position: absolute; }
.row { display: flex; align-items: center; }
.col { display: flex; flex-direction: column; }
.fill { position: absolute; left: 0; top: 0; bottom: 0; width: calc(var(--v) * 100%); background: var(--dan); border-radius: 5px; }
svg.ic { display: block; fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }

/* the world stand-ins (in the game: the 3D scene) */
.w-house { background: #7A6F63; }
.w-house .floor { position: absolute; left: 0; right: 0; bottom: 0; height: 34%; background: #514539; }
.w-house .door { position: absolute; left: 13%; bottom: 34%; width: 11%; height: 44%; background: #5F5448; }
.w-house .win { position: absolute; left: 57%; top: 17%; width: 19%; height: 23%; background: #8C9AA3; border: 0 solid #6A5F54; border-width: 8px; }
.w-house .sofa { position: absolute; left: 52%; bottom: 22%; width: 28%; height: 15%; border-radius: 18px 18px 6px 6px; background: #4E5A6A; }
.w-lab { background: #55615F; }
.w-lab .floor { position: absolute; left: 0; right: 0; bottom: 0; height: 30%; background: #3A4241; }
.mach { background: #33403E; border-radius: 10px 10px 4px 4px; }
.mach-top { background: #4C5A57; border-radius: 12px 12px 0 0; }
.mach-side { background: #262F2E; border-radius: 0 10px 4px 0; }
.bezel { background: #0C0F0F; border-radius: 14px; }
.scr { overflow: hidden; border-radius: 6px; background: var(--base); }
.vpw { width: 640px; height: 360px; transform-origin: 0 0; }
.knob { width: 26px; height: 26px; border-radius: 13px; background: #6F7D7A; border: 0 solid #262F2E; border-bottom-width: 4px; }
.slotm { background: #1C2322; border-radius: 6px; }
.leg { background: #262F2E; }
.cable { background: #1E2524; border-radius: 7px; }
.pal { width: 110px; height: 240px; }
.pal .body { position: absolute; left: 0; top: 70px; width: 110px; height: 170px; border-radius: 40px 40px 26px 26px; background: #1C7A82; }
.pal .head { position: absolute; left: 6px; top: 0; width: 98px; height: 84px; border-radius: 49px 49px 36px 36px; background: #1C7A82; }
.pal .eye { position: absolute; top: 28px; width: 24px; height: 24px; border-radius: 12px; background: #F2F0EA; border: 0 solid #10151A; border-width: 0 7px 3px 0; z-index: 1; }
.plate { font: 600 15px/1 "Onest", sans-serif; color: #F2F0EA; -webkit-text-stroke: 4px rgba(10, 12, 14, 0.75); paint-order: stroke fill; }

/* the palettes: calm neutrals, one accent, the danger colour */
.pC { --mod: #2B2D34; --row: #363941; --base: #17181C; --edge: #44474F; --tab: #E4DED2; --tab-ink: #1C1D22; --tx: #E4DED2; --dm: #9A978F;
  --acc: #63D9C9; --acc-ink: #0E2623; --acc-deep: #2E9E90; --pip2: #E4DED2; --dan: #FF5148; --dan-ink: #1E0807; --dan-deep: #A82A22;
  --plate: rgba(23, 24, 28, 0.6); --ol: rgba(12, 12, 16, 0.8); }
.p1 { --mod: #20242B; --row: #2A2F38; --base: #12151A; --edge: #3A414C; --tab: #C9D3DE; --tab-ink: #12151A; --tx: #E3E8EE; --dm: #8E98A6;
  --acc: #4FD6C8; --acc-ink: #06211E; --acc-deep: #2A9489; --pip2: #C9D3DE; --dan: #FF5A4E; --dan-ink: #210605; --dan-deep: #A3251C;
  --plate: rgba(18, 21, 26, 0.6); --ol: rgba(10, 12, 16, 0.8); }
.p2 { --mod: #2F2A28; --row: #3A3431; --base: #1B1817; --edge: #4C4440; --tab: #F1E8DC; --tab-ink: #1B1817; --tx: #F1E8DC; --dm: #A99D90;
  --acc: #A8E063; --acc-ink: #15240A; --acc-deep: #6E9E35; --pip2: #F1E8DC; --dan: #FF5A4A; --dan-ink: #230605; --dan-deep: #A8261B;
  --plate: rgba(27, 24, 23, 0.6); --ol: rgba(16, 12, 10, 0.8); }
.p3 { --mod: #2A2540; --row: #352F4F; --base: #1A1629; --edge: #4A4170; --tab: #ECE8F7; --tab-ink: #1A1629; --tx: #ECE8F7; --dm: #A39DBD;
  --acc: #6FF2B4; --acc-ink: #082418; --acc-deep: #33A877; --pip2: #ECE8F7; --dan: #FF5C6C; --dan-ink: #26060C; --dan-deep: #A8243A;
  --plate: rgba(26, 22, 41, 0.6); --ol: rgba(14, 10, 24, 0.8); }
.p4 { --mod: #E8E2D6; --row: #DAD3C5; --base: #C4BBAB; --edge: #CFC7B8; --tab: #23212A; --tab-ink: #E8E2D6; --tx: #23212A; --dm: #6C675F;
  --acc: #3557E0; --acc-ink: #FFFFFF; --acc-deep: #213BA6; --pip2: #23212A; --dan: #E2392F; --dan-ink: #FFFFFF; --dan-deep: #9C1F18;
  --plate: rgba(232, 226, 214, 0.75); --ol: rgba(232, 226, 214, 0.9); }

/* the modules, shared by every shape */
.m { background: var(--mod); box-sizing: border-box; position: relative; }
.stage .m { position: absolute; }
.stage .vp .m { position: relative; }
.det .m { max-width: 100%; }
.det .cops { width: 500px; }
.det .cops .s1 { white-space: normal; text-align: center; }
.tab { font: 700 8px/1.2 "Unbounded", sans-serif; letter-spacing: 1px; text-transform: uppercase; color: var(--dm); }
.lab { font-size: 10px; color: var(--dm); }
.lab.dn { color: var(--dan); }
.time { width: 320px; height: 60px; padding: 0 18px; gap: 16px; }
.stage .time { left: calc(50% - 160px); top: 24px; }
.time .tm { font-size: 24px; font-weight: 700; }
.time .div { display: block; width: 2px; height: 32px; background: var(--base); }
.ang { gap: 5px; flex: 1; }
.bar { position: relative; height: 10px; border-radius: 5px; background: var(--base); }
.roster { width: 176px; padding: 12px 14px; gap: 5px; }
.stage .roster { right: 24px; top: 24px; }
.rw { gap: 8px; font-size: 12px; font-weight: 500; }
.rw i { display: block; width: 10px; height: 10px; border-radius: 3px; }
.rw.me { color: var(--acc); }
.rw.dead { color: var(--dm); }
.vit { padding: 12px 16px; gap: 7px; }
.stage .vit { left: 24px; bottom: 24px; }
.vr { gap: 10px; }
.vr .lab { width: 86px; }
.segs { gap: 3px; }
.segs i { display: block; width: 15px; height: 10px; border-radius: 3px; background: var(--base); }
.segs i.a { background: var(--acc); }
.segs i.b { background: var(--pip2); }
.segs i.d { background: var(--dan); }
.sl { width: 78px; height: 88px; align-items: center; justify-content: center; gap: 4px; padding-top: 2px; }
.stage .hand { right: 112px; bottom: 24px; }
.stage .belt { right: 24px; bottom: 24px; }
.sl .nm { font-size: 10px; }
.sl.on { color: var(--acc); }
.sl.on .nm { color: var(--tx); }
.ch1 { left: calc(50% - 7px); top: calc(50% - 1px); width: 14px; height: 2px; background: #F2F0EA; }
.ch2 { left: calc(50% - 1px); top: calc(50% - 7px); width: 2px; height: 14px; background: #F2F0EA; }
.stage .cops { left: calc(50% - 250px); top: 100px; width: 500px; }
.cops { align-items: center; gap: 2px; padding: 14px 30px 12px; background: var(--dan); color: var(--dan-ink); }
.cops .s1 { font-size: 19px; font-weight: 700; }
.cops .s2 { font-size: 12px; font-weight: 600; }
.cops .t { font-size: 58px; font-weight: 700; line-height: 1; }

/* ===== shape A · the plain tile ===== */
.sA .m { border: 1px solid var(--edge); border-radius: 8px; }
.sA .tab { margin-bottom: 3px; }
.sA .sl.on { border: 2px solid var(--acc); }
.sA .cops, .sA .time.hot { border-color: var(--dan-deep); }

/* ===== shape B · one big corner, turned to the screen's centre ===== */
.sB .m { border: 0 solid var(--base); border-bottom-width: 4px; border-radius: 6px; }
.sB .k-tl { border-top-left-radius: 30px; }
.sB .k-tr { border-top-right-radius: 30px; }
.sB .k-bl { border-bottom-left-radius: 30px; }
.sB .k-b { border-bottom-left-radius: 30px; border-bottom-right-radius: 30px; }
.sB .tab { margin-bottom: 3px; }
.sB .roster { padding-bottom: 16px; }
.sB .sl.on { border: 2px solid var(--acc); border-bottom-width: 4px; }
.sB .cops, .sB .time.hot { border-color: var(--dan-deep); }

/* ===== shape C · the label strip on top ===== */
.sC .m { border: 0 solid var(--tab); border-top-width: 16px; border-radius: 7px; }
.sC .m.nt { border-top-width: 0; }
.sC .tab { position: absolute; top: -16px; left: 12px; height: 16px; line-height: 16px; color: var(--tab-ink); }
.sC .roster, .sC .vit { padding-top: 10px; }
.sC .sl { height: 100px; padding-top: 0; }
.sC .sl.on { border: 2px solid var(--acc); border-top-width: 16px; }
.sC .sl.on .tab { left: 10px; color: var(--acc-ink); }
.sC .time.hot { border: 0 solid var(--dan); border-bottom-width: 4px; }

/* ===== shape D · no frame: outlined text on a dark plate ===== */
.sD .m { background: var(--plate); border-radius: 4px; -webkit-text-stroke: 2px var(--ol); paint-order: stroke fill; }
.sD .tab { margin-bottom: 3px; color: var(--tx); }
.sD .sl.on { border: 0 solid var(--acc); border-bottom-width: 3px; }
.sD .cops { background: var(--dan); -webkit-text-stroke: 0; }
.sD .time.hot { border: 0 solid var(--dan); border-bottom-width: 3px; }

/* ===== the workbench screen: a 640x360 SubViewport with the same Theme ===== */
.vp { width: 640px; height: 360px; box-sizing: border-box; padding: 18px 22px 22px; gap: 16px; background: var(--base); color: var(--tx); }
.vhd { justify-content: space-between; }
.vt { font-size: 20px; font-weight: 700; }
.pts { gap: 10px; }
.pts .lab { font-size: 13px; }
.pts b { font-size: 30px; font-weight: 700; color: var(--acc); }
.cards { gap: 14px; align-items: stretch; flex: 1; }
.card { flex: 1; white-space: normal; gap: 6px; padding: 14px 14px 14px; }
.sC .card { padding-top: 12px; }
.card .nm { font-size: 14px; font-weight: 700; line-height: 1.25; }
.card .fx { font-size: 13px; color: var(--dm); }
.card .c { font-size: 22px; font-weight: 700; margin-top: 6px; }
.card.off { color: var(--dm); }
.card.on { border: 3px solid var(--acc); }
.sC .card.on { border-top-width: 16px; }
.btn { font-size: 11px; font-weight: 700; padding: 9px 14px 8px; border-radius: 6px; background: var(--acc); color: var(--acc-ink); border: 0 solid var(--acc-deep); border-bottom-width: 3px; }
.btn.o { background: var(--row); color: var(--acc); border: 2px solid var(--acc); }
.btn.no { background: var(--row); color: var(--dm); border: 0 solid var(--base); border-bottom-width: 3px; }
`;

function page() {
  const shapeBlocks = SHAPES.map((s, i) => `
    <div class="var" id="${s.id}">
      <h3>${i + 1} · <b>${s.name}</b>${s.id === REC.shape ? ' · моя порада' : ''}</h3>
      <div class="scroller">${hud(s.id, 'pC', false)}</div>
      <p class="cap"><b>Фішка:</b> ${s.fishka}</p>
      ${detail(s.id, 'pC')}
      <p class="cap"><b>Godot:</b> ${s.godot}</p>
    </div>`).join('\n');

  const palBlocks = PALETTES.map((p, i) => `
    <div class="var" id="${p.id}">
      <h3>${String.fromCharCode(1040 + i)} · <b>${p.name}</b>${p.id === REC.palette ? ' · моя порада' : ''}</h3>
      <p class="cap">${p.feel}</p>
      ${sw(p.sw)}
      <div class="pair">
        <div class="var"><span class="lbl">Спокійно: раунд</span><div class="scroller">${hud(PAL_SHAPE, p.id, false)}</div></div>
        <div class="var"><span class="lbl">Гучно: копи, 0:58</span><div class="scroller">${hud(PAL_SHAPE, p.id, true)}</div></div>
      </div>
      ${detailPal(PAL_SHAPE, p.id)}
    </div>`).join('\n');

  return `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="claude:viewport-fit-sides" content="cover">
<title>Модулі корабля</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700&family=Onest:wght@400;500;600;700&display=swap">
<!-- generated by pages/suit-c/build.js: edit the script, then run node pages/suit-c/build.js -->
<style>${CSS}</style>
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <!-- own work (LICENCES.json): line icons in a 48 box, drawn in currentColor -->
  <symbol id="i-rocket" viewBox="0 0 48 48"><path d="M24 5C30 11 32 19 30 31H18C16 19 18 11 24 5Z"/><circle cx="24" cy="17" r="3"/><path d="M18 24L12 33L18 32M30 24L36 33L30 32M21 35L24 42L27 35"/></symbol>
  <symbol id="i-bun" viewBox="0 0 48 48"><path d="M7 25C7 14 41 14 41 25Z"/><rect x="7" y="29" width="34" height="8" rx="4"/><path d="M18 19L20 18M27 18L29 19"/></symbol>
  <symbol id="i-battery" viewBox="0 0 48 48"><rect x="13" y="12" width="22" height="30" rx="4"/><path d="M20 7H28V12H20ZM25 18L20 27H28L23 36"/></symbol>
</svg>

<main class="wrap">
  <header class="intro">
    <p class="kicker">prime-game · UI · напрямок В далі · 21.10.2026</p>
    <h1>Модулі корабля, крок другий</h1>
    <p class="lede">Ви взяли В: мінімум на екрані, здоровʼя й витривалість — сегментами. Тут три речі: форма модулів, кольори і фізичні екрани на машинах у світі.</p>
    <div class="tags"><span class="tag">тексти — чернетки</span><span class="tag">масштаб UI 0.75×</span><span class="tag rec">порада: ${shapeName(REC.shape)} + ${palName(REC.palette)}</span></div>
    <p class="note">Кожен кадр — 16:9, тло — плоскі кольори замість світу гри. Під кожною формою — ті самі модулі в реальному розмірі, щоб на телефоні було видно деталі.</p>
  </header>

  <div class="switch" role="group" aria-label="Розмір кадрів"><span>Кадри:</span>
    <button type="button" id="fit-w" data-big="0">На ширину</button>
    <button type="button" id="fit-2x" data-big="1">Удвічі, з прокруткою</button>
    <small>«Удвічі» — для телефона: кадр удвічі ширший, гортайте його вбік.</small>
  </div>

  <section class="sec" id="shapes">
    <header>
      <h2>1 · Форма модулів</h2>
      <p class="note">Той самий раунд, ті самі кольори В; змінюється лише форма коробки. Час із гнівом угорі, гравці справа, костюм (сегменти) зліва внизу, рука й пояс справа внизу.</p>
    </header>
${shapeBlocks}
  </section>

  <section class="sec" id="colours">
    <header>
      <h2>2 · Кольори</h2>
      <p class="note">Чотири палітри на одній формі — «${shapeName(PAL_SHAPE)}». У кожній спокійні нейтральні, один акцент і колір небезпеки. Зліва звичайний раунд, справа єдиний гучний момент.</p>
    </header>
${palBlocks}
  </section>

  <section class="sec" id="physical">
    <header>
      <h2>3 · Фізичний екран: мутаційний верстат</h2>
      <p class="note">Верстат — машина у світі, а його меню — екран на ній. Хто стоїть поруч, бачить той самий екран; особистий HUD лишається тонким шаром поверх. Форма й кольори — моя порада: «${shapeName(REC.shape)}», «${palName(REC.palette)}».</p>
    </header>
    <div class="var">
      <h3><b>Здалеку</b> · біля верстата Ґлорп</h3>
      <div class="scroller">${bench(false)}</div>
      <p class="cap">Ґлорп обирає мутацію; ви бачите його екран через кімнату. Особистий HUD нікуди не зникає.</p>
    </div>
    <div class="var">
      <h3><b>Впритул</b> · ви дивитесь на екран</h3>
      <div class="scroller">${bench(true)}</div>
      <p class="cap">Підійшли й навели приціл: картка під прицілом підсвічена, натискання — «Мутувати». Окремого вікна немає: меню — сам екран машини.</p>
    </div>
    <div class="godot">
      <p><b>Як це в Godot.</b> Екран — SubViewport 640×360 з тим самим Theme; його ViewportTexture лягає на меш екрана машини. Промінь від камери влучає в меш, його UV стає позицією курсора всередині SubViewport (<code>push_input</code>), тож керує той, хто дивиться й натискає; стан верстата — на сервері, і всі поруч бачать одне. Так робить офіційне демо Godot <a href="https://github.com/godotengine/godot-demo-projects/tree/master/viewport/gui_in_3d">gui_in_3d</a>.</p>
      <p>«Твої очки» на спільному екрані — очки того, хто зараз керує (чернетка; це рішення для гри).</p>
    </div>
  </section>

  <section class="recbox">
    <h2>Моя порада</h2>
    <p><b>Форма — «${shapeName(REC.shape)}».</b> Смуга згори з підписом читається як наклейка на корабельному обладнанні: є підпис без зайвої рамки, і модулі не схожі на картки сайту. «Плитка» — запасний варіант, найнейтральніший.</p>
    <p><b>Кольори — «${palName(REC.palette)}».</b> Тихо в раунді й чітко в копах; фіолетовий і мʼята продовжують те, що вам сподобалось раніше, а червоний небезпеки від них далекий.</p>
  </section>

  <footer class="foot">
    <p><b>Шрифти</b> (Google Fonts, з кирилицею; ліцензію перевірено в METADATA.pb репозиторію google/fonts, 21.10.2026):</p>
    <ul>
      <li>Unbounded — SIL Open Font License 1.1, <a href="https://github.com/google/fonts/tree/main/ofl/unbounded">ofl/unbounded</a></li>
      <li>Onest — SIL Open Font License 1.1, <a href="https://github.com/google/fonts/tree/main/ofl/onest">ofl/onest</a></li>
    </ul>
    <p>Іконки предметів (феєрверк, булка, батарейка) — власна робота, <code>pages/suit-c/LICENCES.json</code>. Жодних зображень: світ, машина й гравець — плоскі кольори-заглушки. Імена гравців, числа й підписи модулів — зразки; тексти з колоди <code>copy/strings.csv</code>, решта — чернетки.</p>
    <p>Джерело: <code>pages/suit-c/build.js</code> → <code>pages/suit-c/index.html</code> у prime-game-ui.</p>
  </footer>
</main>

<script>
// The frames: the stage is 1280x720 (UI scale 0.75x), scaled to the frame's width; "big" makes frames twice as wide.
let big = false;
try { big = localStorage.getItem("suit-c-big") === "1"; } catch (e) {}
function fit() {
  document.querySelectorAll(".frame").forEach(f => {
    const st = f.querySelector(".stage");
    st.style.transform = "scale(" + f.clientWidth / 1280 + ")";
  });
}
function setBig(b) {
  big = b;
  document.querySelectorAll(".scroller").forEach(s => s.classList.toggle("big", b));
  document.querySelectorAll(".switch button").forEach(x => x.setAttribute("aria-pressed", String((x.dataset.big === "1") === b)));
  try { localStorage.setItem("suit-c-big", b ? "1" : "0"); } catch (e) {}
  fit();
}
document.querySelectorAll(".switch button").forEach(x => x.addEventListener("click", () => setBig(x.dataset.big === "1")));
setBig(big);
if ("ResizeObserver" in window) new ResizeObserver(fit).observe(document.body); else addEventListener("resize", fit);
document.fonts.ready.then(() => { document.documentElement.dataset.ready = "1"; fit(); });
</script>
</body>
</html>
`;
}

function main() {
  const html = page();
  if (process.argv.includes('--check')) {
    const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : '';
    if (cur !== html) { console.log('pages/suit-c/index.html is stale: run node pages/suit-c/build.js'); process.exit(1); }
    console.log(`pages/suit-c/index.html matches its build (${Math.round(html.length / 1024)} KB)`);
    return;
  }
  fs.writeFileSync(OUT, html);
  console.log(`wrote pages/suit-c/index.html (${Math.round(html.length / 1024)} KB)`);
}

main();
