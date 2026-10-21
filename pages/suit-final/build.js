// The suit final page (pages/suit-final/index.html): the game's whole screen set in the look the engineer chose on
// 2026-10-22 (chat): the plain tile shape («Плитка») and the ink-mint palette («Чорнильна мʼята») of pages/suit-c.
// The game boots into the alien ship (the lobby you walk around), Esc opens the suit menu, the round HUD is a thin set
// of tiles, the mutation workbench is a screen on the machine. Calm everywhere; loud only in the big moments (the role
// reveal, the cops' minute, the three ends).
//
//   node pages/suit-final/build.js           write index.html
//   node pages/suit-final/build.js --check   exit 1 when index.html is not this script's output (tools/check.js runs it)
//
// Inside the frames, Godot-safe CSS only (solid fills, alpha allowed; per-side border widths with one colour; per-corner
// radii; no shadows here; one text outline). The world stand-ins (walls, floors, machines, other players) are not UI:
// in the game they are the 3D scene. A machine's screen is scaled with a CSS transform only as the stand-in for the 3D
// projection of its SubViewport texture; the anger close-up is scaled the same way, as a magnifier.
// Node 20, node's own modules only.
'use strict';
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'index.html');

// ---------- data (sample names and numbers; texts from copy/strings.csv unless listed as drafts) ----------

const C = { olena: '#7C5CC8', glorp: '#1C7A82', yizhak: '#E66B57', bulk: '#E8B04A', zinga: '#4AA3DF', taras: '#D46FB0', dead: '#5C5A60' };

// [class, colour, name, extra] — extra: 'human' (the tag a human sees), 'ready' / 'wait' (lobby), 'host'
const ROUND = [['me', C.olena, 'Олена (ти)'], ['', C.glorp, 'Ґлорп'], ['', C.yizhak, 'Їжак'], ['', C.bulk, 'Бульк'],
  ['', C.zinga, 'Зінґа'], ['dead', C.dead, 'Тарас · поза грою']];
const ROUND_HUMAN = ROUND.map((r) => (r[2] === 'Зінґа' ? [r[0], r[1], r[2], 'human'] : r));
const LOBBY = [['me', C.olena, 'Олена (ти)', 'ready host'], ['', C.glorp, 'Ґлорп', 'ready'], ['', C.yizhak, 'Їжак', 'wait'],
  ['', C.bulk, 'Бульк', 'ready'], ['', C.zinga, 'Зінґа', 'ready'], ['', C.taras, 'Тарас', 'wait']];

// ---------- the pieces ----------

const icon = (id, s) => `<svg class="ic" width="${s}" height="${s}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const pips = (total, n, cls) => Array.from({ length: total }, (_, i) => `<i${i < n ? ` class="${cls}"` : ''}></i>`).join('');

// the time and the neighbours' anger: state 'calm' | 'alarm' | 'full'
function timeModule(state = 'calm', v = 0.35, t = '07:42') {
  const siren = state === 'full' ? `<span class="sir">${icon('siren', 16)}</span>` : icon('siren', 18);
  return `<div class="m row time ${state}">
        <span class="u tm">${t}</span><i class="div"></i>
        <div class="col ang"><span class="lab">Гнів сусідів</span><div class="row bw"><div class="bar"><b class="fill" style="--v:${v}"></b></div>${siren}</div></div>
      </div>`;
}

function rosterModule(rows, title = 'Гравці') {
  const r = rows.map(([c, col, n, x = '']) => {
    const tail = (x.includes('host') ? '<span class="tg h">хост</span>' : '') +
      (x.includes('human') ? '<span class="tg">людина</span>' : '') +
      (x.includes('ready') ? '<b class="rd on"></b>' : x.includes('wait') ? '<b class="rd"></b>' : '');
    return `<div class="row rw${c ? ' ' + c : ''}"><i style="background:${col}"></i><span class="n">${n}</span>${tail}</div>`;
  }).join('');
  return `<div class="m col roster"><span class="tab">${title}</span>${r}</div>`;
}

function vitalsModule(low) {
  return `<div class="m col vit"><span class="tab">Костюм</span>
        <div class="row vr"><span class="lab${low ? ' dn' : ''}">Здоровʼя</span><div class="row segs">${low ? pips(10, 2, 'd') : pips(10, 8, 'a')}</div></div>
        <div class="row vr"><span class="lab">Витривалість</span><div class="row segs">${pips(10, 6, 'b')}</div></div>
      </div>`;
}

function slots(low) {
  const hand = low ? ['battery', 'Батарейка'] : ['rocket', 'Феєрверк'];
  return `<div class="m col sl on hand"><span class="tab">Рука</span>${icon(hand[0], 38)}<span class="nm">${hand[1]}</span></div>
      <div class="m col sl belt"><span class="tab">Пояс</span>${low ? '<span class="nm">&nbsp;</span>' : icon('bun', 36) + '<span class="nm">Булка</span>'}</div>`;
}

const cross = '<div class="abs ch1"></div><div class="abs ch2"></div>';
const roundHud = (rows = ROUND, low = false) => `${rosterModule(rows)}${cross}${vitalsModule(low)}${slots(low)}`;

const WORLD = {
  ship: '<div class="floor"></div><div class="door"></div><div class="port"></div><div class="pod" style="left:80%"></div><div class="pod" style="left:89.5%"></div>',
  house: '<div class="floor"></div><div class="door"></div><div class="win"></div><div class="sofa"></div>',
  lab: '<div class="floor"></div><div class="abs cable" style="left:0;top:560px;width:120px;height:14px"></div>',
  dead: '<div class="floor"></div><div class="capsule" style="left:8%"></div><div class="capsule" style="left:22%"></div><div class="capsule" style="left:70%"></div><div class="capsule" style="left:84%"></div>',
};

const frame = (world, inner, extra = '') => `<div class="scroller"><div class="frame"><div class="stage w-${world}${extra ? ' ' + extra : ''}">
      ${WORLD[world] || ''}
      ${inner}
    </div></div></div>`;

// another player in the world (a stand-in for the 3D body), with the name plate the game draws over the head
const pal = (x, y, col, name, s = 1) => `<div class="abs pal" style="left:${x}px;top:${y}px;--c:${col};transform:scale(${s})"><i class="head"></i><i class="eye" style="left:22px"></i><i class="eye" style="left:56px"></i><i class="body"></i></div>` +
  (name ? `<span class="abs plate" style="left:${x + 55 * s}px;top:${y - 28}px">${name}</span>` : '');

// a machine with a screen: the SubViewport (640x360) drawn on its mesh, at a given place and size
function machine(x, y, w, content, opts = {}) {
  const sh = Math.round(w * 9 / 16), pad = Math.round(w * 0.06);
  const mw = w + pad * 2, mh = sh + pad * 2 + (opts.foot || 90);
  return `<div class="abs mach-top" style="left:${x - 6}px;top:${y - 18}px;width:${mw + 12}px;height:22px"></div>
      <div class="abs mach" style="left:${x}px;top:${y}px;width:${mw}px;height:${mh}px"></div>
      <div class="abs bezel" style="left:${x + pad - 12}px;top:${y + pad - 12}px;width:${w + 24}px;height:${sh + 24}px"></div>
      <div class="abs scr" style="left:${x + pad}px;top:${y + pad}px;width:${w}px;height:${sh}px"><div class="vpw" style="transform:scale(${(w / 640).toFixed(4)})">${content}</div></div>
      <div class="abs slotm" style="left:${x + mw / 2 - 90}px;top:${y + sh + pad * 2 + 30}px;width:180px;height:12px"></div>`;
}

// ---------- the machine screens (640x360 SubViewports with the same Theme) ----------

const stepper = (v) => `<span class="row stp"><span class="u sb">−</span><span class="u sv">${v}</span><span class="u sb">+</span></span>`;
const screenMatch = `<div class="vp col">
          <div class="row vhd"><span class="u vt">Матч</span><span class="vn">Ти хост: зміни бачать усі</span></div>
          <div class="col srows">
            <div class="row sr"><span>Люди</span>${stepper('3 з 10')}</div>
            <div class="row sr"><span>Поріг гніву</span><span class="row seg"><span class="u on">50</span><span class="u">100</span></span></div>
            <div class="row sr"><span>Тривалість матчу</span>${stepper('10 хв')}</div>
          </div>
          <div class="row vft"><span class="vn">Код</span><span class="u code">QF7K2</span></div>
        </div>`;

const screenIdle = `<div class="vp col mid">
          <span class="u vt big">Мутаційний верстат</span>
          <span class="u btn xl">Почати</span>
        </div>`;

function screenChoose(pointed) {
  const card = (i, name, fx, cost, btn, off) => `<div class="m col card${i === pointed ? ' on' : ''}${off ? ' off' : ''}"><span class="u nm">${name}</span><span class="fx">${fx}</span><span class="u c">${cost}</span><span class="row" style="margin-top:auto"><span class="u btn${off ? ' no' : i === pointed ? '' : ' o'}">${btn}</span></span></div>`;
  return `<div class="vp col">
          <div class="row vhd"><span class="u vt">Мутаційний верстат</span><span class="row pts"><span class="vn">Твої очки</span><b class="u">7</b></span></div>
          <div class="row cards">
            ${card(0, 'Швидкі ноги', 'Бігаєш швидше', '4 очки', 'Мутувати')}
            ${card(1, 'Пружні ноги', 'Стрибаєш вище', '3 очки', 'Мутувати')}
            ${card(2, 'Товста шкіра', 'Більше здоровʼя', '9 очок', 'Бракує 2', true)}
          </div>
        </div>`;
}

const screenStep = `<div class="vp col mid">
          <span class="u vk">Пружні ноги</span>
          <span class="u vt big">Стань у машину</span>
          <div class="row prog">${pips(10, 6, 'a')}</div>
        </div>`;

// the workbench: the machine on the left, the capsule you step into on the right
function bench(content) {
  return `${machine(150, 150, 560, content, { foot: 70 })}
      <div class="abs pod-top" style="left:870px;top:110px;width:260px;height:30px"></div>
      <div class="abs pod-body" style="left:880px;top:130px;width:240px;height:470px"></div>
      <div class="abs pod-in" style="left:910px;top:170px;width:180px;height:400px"></div>
      <div class="abs pod-base" style="left:860px;top:590px;width:280px;height:24px"></div>`;
}

// ---------- the frames ----------

const F = {};

F.boot = frame('ship', `<div class="m row hint"><span class="u key">Esc</span><span>меню</span></div>`);

function escMenu(tab) {
  const tabs = `<div class="row tabs"><span class="u t${tab === 'find' ? ' on' : ''}">Знайти лобі</span><span class="u t${tab === 'set' ? ' on' : ''}">Налаштування</span><span class="row" style="margin-left:auto;padding-right:16px"><span class="u key">Esc</span></span></div>`;
  let body;
  if (tab === 'find') {
    body = `<div class="row mb">
          <div class="col lst"><span class="tab">Лобі поруч</span>
            <div class="row lr on"><span class="n">Лобі: Ґлорп</span><span class="u c">6 / 10</span><span class="p">24 мс</span></div>
            <div class="row lr"><span class="n">Лобі: Зінґа</span><span class="u c">3 / 10</span><span class="p">41 мс</span></div>
            <div class="row lr full"><span class="n">Лобі: Бульк</span><span class="p">Лобі заповнене.</span></div>
            <div class="row" style="justify-content:flex-end;margin-top:4px"><span class="u btn">Приєднатися</span></div>
          </div>
          <div class="col jn"><span class="tab">Код</span>
            <div class="row cells"><span class="u cell">Q</span><span class="u cell">F</span><span class="u cell">7</span><span class="u cell cur"></span><span class="u cell"></span></div>
            <div class="row"><span class="u btn o">Приєднатися</span></div>
          </div>
        </div>
        <div class="row mf"><span class="vn">Твій код</span><span class="u code">KD4WX</span><span class="u btn o s">Копіювати</span><span class="q">Вийти з гри</span></div>`;
  } else {
    const sld = (label, v) => `<div class="row sr"><span>${label}</span><span class="row" style="gap:12px"><span class="sld"><b style="width:${v}%"></b><i style="left:calc(${v}% - 7px)"></i></span><span class="u vv">${v}</span></span></div>`;
    body = `<div class="row mb">
          <div class="col nav"><span class="on">Звук і голос</span><span>Керування</span><span>Екран</span><span>Доступність</span><span>Мова</span></div>
          <div class="col srows">
            ${sld('Загальна гучність', 80)}
            ${sld('Гучність голосів', 70)}
            <div class="row sr"><span>Як говорити</span><span class="row dd">Натисни й говори${icon('chev', 14)}</span></div>
            <div class="row sr"><span>Мікрофон</span><span class="row dd">Стандартний${icon('chev', 14)}</span></div>
          </div>
        </div>`;
  }
  return frame('ship', `<div class="abs dim"></div>
      <div class="m col menu">${tabs}${body}</div>`);
}
F.escFind = escMenu('find');
F.escSet = escMenu('set');

F.lobby = frame('ship', `${machine(110, 200, 390, screenMatch, { foot: 60 })}
      ${pal(640, 300, C.glorp, 'Ґлорп', 0.8)}${pal(800, 330, C.bulk, 'Бульк', 0.7)}
      <div class="m row wait"><span>Готові 4 з 6</span><span class="row segs">${pips(6, 4, 'a')}</span></div>
      ${rosterModule(LOBBY, 'Гравці 6 / 10')}${cross}
      <div class="m row rdy"><b class="rd on"></b><span>Готовність: так</span></div>`);

F.lobbyClose = frame('ship', `${machine(170, 70, 860, screenMatch, { foot: 40 })}
      ${rosterModule(LOBBY, 'Гравці 6 / 10')}${cross}
      <div class="m row rdy"><b class="rd on"></b><span>Готовність: так</span></div>`);

function reveal(human) {
  return frame('none', `<span class="abs who u">Твоя роль</span>
      <div class="abs band"><span class="u">${human ? 'Людина' : 'Прибулець'}</span></div>
      <p class="abs goal">${human ? 'Ти людина під маскою прибульця. Зіпсуй вечірку: протягни час або розлюти сусідів, щоб приїхали копи.' : 'Влаштуй найкращу вечірку: виконай усі задачі, поки не скінчився час і не приїхали копи.'}</p>
      ${human ? `<span class="abs team row"><i style="background:${C.zinga}"></i>Твоя команда: Зінґа</span>` : ''}`, 'loud reveal' + (human ? ' hum' : ''));
}
F.revealAlien = reveal(false);
F.revealHuman = reveal(true);

F.round = frame('house', `${timeModule('calm', 0.35)}${roundHud()}`);
F.roundHuman = frame('house', `${timeModule('calm', 0.35)}${roundHud(ROUND_HUMAN)}`);

F.anger = frame('house', `<div class="abs dim2"></div>
      <div class="abs zm" style="top:120px">${timeModule('calm', 0.35)}</div>
      <div class="abs zm" style="top:300px">${timeModule('alarm', 0.8, '05:31')}</div>
      <div class="abs zm" style="top:480px">${timeModule('full', 1, '04:12')}</div>`);

F.cops = frame('house', `<div class="abs edge"></div>
      ${timeModule('full', 1, '04:12')}
      <div class="m col cops"><span class="u s1">Сусіди викликали копів!</span><span class="s2">Копи будуть за</span><span class="u t">0:58</span></div>
      ${roundHud(ROUND, true)}`, 'loud');

F.dead = frame('dead', `<div class="m dtitle"><span class="u">Кімната мертвих</span></div>
      <div class="m col dback"><span class="lab">Повернення через</span><span class="u t">0:24</span></div>
      <div class="m dalso">Тут також: Бульк, Зінґа</div>
      <div class="m dcap">Випадкова капсула · 3 с захисту</div>`);

F.wbIdle = frame('lab', `${bench(screenIdle)}${timeModule('calm', 0.35)}${roundHud()}`);
F.wbChoose = frame('lab', `${bench(screenChoose(1))}${timeModule('calm', 0.35)}${roundHud()}`);
F.wbStep = frame('lab', `${machine(390, 200, 420, screenStep, { foot: 50 })}<div class="abs inpod"></div>${timeModule('calm', 0.35)}${roundHud()}`);

function end(kind) {
  const d = {
    party: ['Вечірка вдалася!', 'Прибульці перемогли', 'Усі задачі виконано за 08:12.'],
    time: ['Час вийшов', 'Люди перемогли', 'Задачі не виконано.'],
    cops: ['Попались!', 'Люди перемогли', 'Приїхали копи: вечірці кінець.'],
  }[kind];
  return frame('none', `<div class="abs band"><span class="u">${d[0]}</span></div>
      <span class="abs won u">${d[1]}</span>
      <span class="abs why">${d[2]}</span>
      <span class="abs back">Повернення на корабель через 3…</span>`, `loud end e-${kind}`);
}
F.endParty = end('party');
F.endTime = end('time');
F.endCops = end('cops');

// the real-size close-up under the human's HUD: the roster both ways and the suit tile
const DETAIL = `<div class="det" aria-label="Модулі в реальному розмірі">
      ${rosterModule(ROUND)}${rosterModule(ROUND_HUMAN)}${vitalsModule(false)}
    </div>`;

// ---------- the page ----------

const SECTIONS = [
  ['boot', '1', 'Старт: одразу на кораблі', [[F.boot, 'Гра вантажиться просто на корабель прибульців — це твоє лобі, по ньому ходиш. Інтерфейсу немає, лише крихітна підказка в куті. <span class="dr">Чернетка: «меню».</span>']]],
  ['esc', '2', 'Меню костюма (Esc)', [
    [F.escFind, '<b>Знайти лобі.</b> Лобі поруч, вхід за кодом і твій власний код, щоб покликати друзів. Світ не на паузі, лише притемнений. <span class="dr">Чернетки: «Знайти лобі», «Лобі поруч», «Твій код».</span>'],
    [F.escSet, '<b>Налаштування.</b> Ті самі вкладки, що й були: звук і голос, керування, екран, доступність, мова.']]],
  ['lobby', '3', 'На кораблі: готовність і налаштування матчу', [
    [F.lobby, 'Готові 4 з 6: згори по центру. У списку гравців — квадратик готовності й бирка хоста. Налаштування матчу — екран на пульті корабля: його бачать усі, хто поруч. <span class="dr">Моє рішення, перевірте: пульт замість вкладки «Лобі» в Esc.</span>'],
    [F.lobbyClose, 'Хост підійшов до пульта: кількість людей, поріг гніву, тривалість. Тут же код лобі. <span class="dr">Чернетка: «Матч».</span>']]],
  ['reveal', '4', 'Показ ролі — гучно', [
    [F.revealAlien, '<b>Прибулець.</b> Перший гучний момент: на весь екран — смуга мʼяти й велике слово.'],
    [F.revealHuman, '<b>Людина.</b> Та сама будова, смуга коралова; під метою — хто ще людина.']]],
  ['round', '5', 'Раунд', [
    [F.round, 'Тонкі плитки: час і гнів угорі, гравці справа, костюм (сегменти здоровʼя й витривалості) зліва внизу, рука й пояс справа. Очок на HUD немає, повідомлень про вбивства теж. <span class="dr">Чернетки: «Гнів сусідів», «Костюм».</span>'],
    [F.roundHuman, '<b>5б · Очима людини.</b> Те саме, але в списку гравців інші люди мають коралову бирку «людина».']]],
  ['anger', '6', 'Гнів сусідів: три стани', [[F.anger, 'Збільшено. <b>Спокій:</b> сіра смужка, сирена тиха. <b>Тривога</b> (за порогом): смужка, підпис і сирена коралові. <b>Повний:</b> плитка отримує кораловий низ, сирена світиться — далі хвилина копів. <span class="dr">Моє рішення: сіра смужка у спокої замість коралової, щоб раунд був тихим.</span>']]],
  ['cops', '7', 'Хвилина копів — гучно', [[F.cops, 'Єдиний гучний момент усередині раунду: коралова рамка по краю екрана й велика плитка відліку. Решта HUD та сама.']]],
  ['dead', '8', 'Кімната мертвих', [[F.dead, 'Тихо: назва, відлік до повернення, хто ще тут, капсула. Решту HUD сховано. Хто тебе вбив — не показуємо.']]],
  ['bench', '9', 'Мутаційний верстат: екран на машині', [
    [F.wbIdle, '<b>9а · Чекає.</b> Підходиш, наводиш приціл і тиснеш «Почати». <span class="dr">Чернетка: «Почати».</span>'],
    [F.wbChoose, '<b>9б · Вибір.</b> Картка під прицілом підсвічена; очки видно лише тут. Хто стоїть поруч, бачить той самий екран.'],
    [F.wbStep, '<b>9в · У машині.</b> Після вибору екран каже стати в капсулу (праворуч на 9а). Ти всередині й бачиш екран крізь отвір: сегменти заповнюються — і мутацію зроблено. <span class="dr">Чернетка: «Стань у машину».</span>']]],
  ['ends', '10', 'Три кінці — гучно', [
    [F.endParty, '<b>Прибульці перемогли.</b> Смуга мʼяти, як у показі ролі.'],
    [F.endTime, '<b>Час вийшов.</b> Перемогли люди: смуга коралова.'],
    [F.endCops, '<b>Копи.</b> Найгучніше: увесь екран кораловий.']]],
];

function sections() {
  return SECTIONS.map(([id, n, title, frames]) => `
  <section class="sec" id="${id}">
    <h2><span class="num">${n}</span>${title}</h2>
${frames.map(([f, cap]) => `    <figure class="fr">
    ${f}
    <figcaption class="cap">${cap}</figcaption></figure>`).join('\n')}${id === 'round' ? `
    <p class="note">Ті самі плитки в реальному розмірі (масштаб 0.75×): список гравців прибульця й людини, костюм.</p>
    ${DETAIL}` : ''}
  </section>`).join('\n');
}

const CSS = `
/* The page chrome is dark by choice (one look, as the other suit pages); every colour is set explicitly.
   Layout: one column of 16:9 frames, each with a short caption; a sticky switch sizes the frames for a phone. */
:root {
  color-scheme: dark;
  --ground: #121019;
  --raise: #1C1926;
  --line: #2E2A3C;
  --ink-c: #ECE8F7;
  --dim: #A39DBD;
  --hi: #6FF2B4;
  --warn: #FF5C6C;
  --chrome: "Onest", "Segoe UI", system-ui, sans-serif;
  --disp: "Unbounded", "Segoe UI", sans-serif;
}
body { margin: 0; background: var(--ground); color: var(--ink-c); font: 16px/1.5 var(--chrome); overflow-wrap: anywhere; }
.wrap { max-width: 1040px; margin: 0 auto; padding-block: 28px 64px;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
  display: grid; gap: 52px; }
h1 { font: 700 clamp(28px, 6vw, 44px)/1.08 var(--disp); margin: 0; text-wrap: balance; letter-spacing: -0.01em; }
h2 { font: 700 clamp(20px, 3.8vw, 26px)/1.2 var(--disp); margin: 0; text-wrap: balance; display: flex; gap: 12px; align-items: baseline; }
h2 .num { color: var(--hi); font-size: .8em; min-width: 1.6em; }
p { margin: 0; max-width: 66ch; }
.lede { font-size: 18px; }
.intro, .sec { display: grid; gap: 16px; min-width: 0; }
.sec { gap: 22px; }
.fr { margin: 0; display: grid; gap: 10px; min-width: 0; }
.kicker { font-size: 13px; text-transform: uppercase; letter-spacing: .1em; color: var(--dim); font-weight: 600; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px; color: var(--dim); }
.tag.hi { color: var(--hi); border-color: var(--hi); }
.tag.loud { color: var(--warn); border-color: var(--warn); }
.note, .cap { color: var(--dim); font-size: 15px; max-width: 70ch; }
.cap b { color: var(--ink-c); font-weight: 600; }
.cap .dr { color: var(--ink-c); font-size: 13px; border: 1px solid var(--line); border-radius: 6px; padding: 1px 6px; white-space: normal; }
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
.det { display: flex; flex-wrap: wrap; gap: 20px 14px; align-items: flex-start; padding: 22px 12px; min-width: 0; border-radius: 12px; background: #7A6F63; }
.foot { color: var(--dim); font-size: 14px; display: grid; gap: 8px; border-top: 1px solid var(--line); padding-top: 20px; }
.foot ul { margin: 0; padding-left: 20px; display: grid; gap: 4px; }
.foot a { color: var(--ink-c); }

/* ---------- Inside the frames (Godot-safe) ---------- */
.stage, .det { white-space: nowrap; line-height: 1.2; overflow-wrap: normal; font-family: "Onest", "Segoe UI", sans-serif; color: var(--tx);
  --mod: #2A2540; --row: #352F4F; --base: #1A1629; --edge: #4A4170; --tx: #ECE8F7; --dm: #A39DBD;
  --acc: #6FF2B4; --acc-ink: #082418; --acc-deep: #33A877; --pip2: #ECE8F7; --dan: #FF5C6C; --dan-ink: #26060C; --dan-deep: #A8243A; }
.u { font-family: "Unbounded", "Segoe UI", sans-serif; }
.abs { position: absolute; }
.row { display: flex; align-items: center; }
.col { display: flex; flex-direction: column; }
svg.ic { display: block; fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; flex: none; }

/* the world stand-ins (in the game: the 3D scene) */
.w-ship { background: #5A6472; }
.w-ship .floor { position: absolute; left: 0; right: 0; bottom: 0; height: 34%; background: #3D444E; }
.w-ship .port { position: absolute; left: 60%; top: 13%; width: 15%; aspect-ratio: 1; border-radius: 999px; background: #18233A; border: 12px solid #747E8C; }
.w-ship .door { position: absolute; left: 36%; bottom: 34%; width: 11%; height: 42%; border-radius: 60px 60px 0 0; background: #444C58; }
.w-ship .pod { position: absolute; bottom: 28%; width: 7%; height: 28%; border-radius: 36px; background: #6F7A88; }
.w-house { background: #7A6F63; }
.w-house .floor { position: absolute; left: 0; right: 0; bottom: 0; height: 34%; background: #514539; }
.w-house .door { position: absolute; left: 13%; bottom: 34%; width: 11%; height: 44%; background: #5F5448; }
.w-house .win { position: absolute; left: 57%; top: 17%; width: 19%; height: 23%; background: #8C9AA3; border: 8px solid #6A5F54; }
.w-house .sofa { position: absolute; left: 52%; bottom: 22%; width: 28%; height: 15%; border-radius: 18px 18px 6px 6px; background: #4E5A6A; }
.w-lab { background: #55615F; }
.w-lab .floor { position: absolute; left: 0; right: 0; bottom: 0; height: 30%; background: #3A4241; }
.w-dead { background: #3F3B4A; }
.w-dead .floor { position: absolute; left: 0; right: 0; bottom: 0; height: 32%; background: #2D2A36; }
.w-dead .capsule { position: absolute; bottom: 26%; width: 8%; height: 40%; border-radius: 50px 50px 10px 10px; background: #514C5F; }
.w-none { background: #1A1629; }
.mach { background: #33403E; border-radius: 10px 10px 4px 4px; }
.mach-top { background: #4C5A57; border-radius: 12px 12px 0 0; }
.bezel { background: #0C0F0F; border-radius: 14px; }
.scr { overflow: hidden; border-radius: 6px; background: var(--base); }
.vpw { width: 640px; height: 360px; transform-origin: 0 0; }
.slotm { background: #1C2322; border-radius: 6px; }
.cable { background: #1E2524; border-radius: 7px; }
.pod-top { background: #4C5A57; border-radius: 40px 40px 0 0; }
.pod-body { background: #33403E; border-radius: 30px 30px 0 0; }
.pod-in { background: #1C2322; border-radius: 90px 90px 6px 6px; }
.pod-base { background: #262F2E; border-radius: 6px; }
.pal { width: 110px; height: 240px; transform-origin: 0 0; }
.pal .body { position: absolute; left: 0; top: 70px; width: 110px; height: 170px; border-radius: 40px 40px 26px 26px; background: var(--c); }
.pal .head { position: absolute; left: 6px; top: 0; width: 98px; height: 84px; border-radius: 49px 49px 36px 36px; background: var(--c); }
.pal .eye { position: absolute; top: 28px; width: 24px; height: 24px; border-radius: 12px; background: #F2F0EA; border: 0 solid #10151A; border-width: 0 7px 3px 0; z-index: 1; }
.plate { font: 600 15px/1 "Onest", sans-serif; color: #F2F0EA; -webkit-text-stroke: 4px rgba(10, 12, 14, 0.75); paint-order: stroke fill; transform: translateX(-50%); }

.inpod { left: -60px; top: -40px; width: 1400px; height: 820px; box-sizing: border-box; border: 0 solid #1C2322; border-width: 140px 230px 0; border-radius: 640px 640px 0 0; }

/* the tile («Плитка»): one fill, a 1 px edge, 8 px corners */
.m { background: var(--mod); box-sizing: border-box; position: relative; border: 1px solid var(--edge); border-radius: 8px; }
.stage .m { position: absolute; }
.stage .vp .m, .det .m, .stage .zm .m { position: relative; }
.tab { font: 700 8px/1.2 "Unbounded", sans-serif; letter-spacing: 1px; text-transform: uppercase; color: var(--dm); margin-bottom: 3px; }
.lab { font-size: 10px; color: var(--dm); }
.lab.dn { color: var(--dan); }
.key { font-size: 9px; font-weight: 700; color: var(--tx); border: 1px solid var(--edge); border-bottom-width: 3px; border-radius: 4px; padding: 3px 6px 2px; background: var(--row); }

/* the time and the anger */
.time { width: 320px; height: 60px; padding: 0 18px; gap: 16px; }
.stage .time { left: calc(50% - 160px); top: 24px; }
.time .tm { font-size: 24px; font-weight: 700; }
.time .div { display: block; width: 2px; height: 32px; background: var(--base); }
.ang { gap: 5px; flex: 1; }
.bw { gap: 6px; }
.bar { position: relative; height: 10px; border-radius: 5px; background: var(--base); flex: 1; }
.fill { position: absolute; left: 0; top: 0; bottom: 0; width: calc(var(--v) * 100%); background: var(--dm); border-radius: 5px; }
.time.calm svg.ic { color: var(--dm); }
.time.alarm .fill, .time.full .fill { background: var(--dan); }
.time.alarm .lab, .time.full .lab, .time.alarm svg.ic { color: var(--dan); }
.time.full { border-color: var(--dan); border-bottom-width: 4px; }
.time.full .tm { color: var(--dan); }
.sir { display: flex; background: var(--dan); color: var(--dan-ink); border-radius: 4px; padding: 1px; }
.stage .zm .time { left: auto; top: auto; }
.zm { left: 384px; width: 320px; transform: scale(1.6); transform-origin: 0 0; }
.dim2 { inset: 0; background: rgba(26, 22, 41, 0.35); }

/* the roster */
.roster { width: 184px; padding: 12px 14px; gap: 5px; }
.stage .roster { right: 24px; top: 24px; }
.rw { gap: 8px; font-size: 12px; font-weight: 500; }
.rw > i { display: block; width: 10px; height: 10px; border-radius: 3px; flex: none; }
.rw .n { flex: 1; }
.rw.me { color: var(--acc); }
.rw.dead { color: var(--dm); }
.tg { font: 700 7px/1 "Unbounded", sans-serif; letter-spacing: .8px; text-transform: uppercase; color: var(--dan); border: 1px solid var(--dan); border-radius: 3px; padding: 2px 3px 1px; }
.tg.h { color: var(--dm); border-color: var(--edge); }
.rd { display: block; width: 10px; height: 10px; border-radius: 3px; background: var(--base); border: 1px solid var(--edge); box-sizing: border-box; flex: none; }
.rd.on { background: var(--acc); border-color: var(--acc); }

/* the suit: health and stamina as segments */
.vit { padding: 12px 16px; gap: 7px; }
.stage .vit { left: 24px; bottom: 24px; }
.vr { gap: 10px; }
.vr .lab { width: 86px; }
.segs { gap: 3px; }
.segs i { display: block; width: 15px; height: 10px; border-radius: 3px; background: var(--base); }
.segs i.a { background: var(--acc); }
.segs i.b { background: var(--pip2); }
.segs i.d { background: var(--dan); }

/* the hand and belt */
.sl { width: 78px; height: 88px; align-items: center; justify-content: center; gap: 4px; padding-top: 2px; }
.stage .hand { right: 112px; bottom: 24px; }
.stage .belt { right: 24px; bottom: 24px; }
.sl .nm { font-size: 10px; }
.sl.on { color: var(--acc); border: 2px solid var(--acc); }
.sl.on .nm { color: var(--tx); }
.ch1 { left: calc(50% - 7px); top: calc(50% - 1px); width: 14px; height: 2px; background: #F2F0EA; }
.ch2 { left: calc(50% - 1px); top: calc(50% - 7px); width: 2px; height: 14px; background: #F2F0EA; }

/* the boot hint and the lobby tiles */
.hint { left: 24px; bottom: 24px; gap: 8px; padding: 7px 10px; font-size: 11px; color: var(--dm); }
.wait { left: calc(50% - 120px); top: 24px; width: 240px; height: 44px; padding: 0 16px; gap: 12px; justify-content: space-between; font-size: 13px; font-weight: 600; }
.rdy { left: 24px; bottom: 24px; gap: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; }

/* the Esc suit menu */
.dim { inset: 0; background: rgba(26, 22, 41, 0.5); }
.menu { left: calc(50% - 330px); top: 150px; width: 660px; }
.tabs { border: 0 solid var(--edge); border-bottom-width: 1px; }
.tabs .t { font-size: 11px; font-weight: 700; padding: 15px 18px 13px; color: var(--dm); border: 0 solid var(--acc); }
.tabs .t.on { color: var(--tx); border-bottom-width: 2px; }
.mb { gap: 18px; padding: 18px; align-items: flex-start; }
.lst { flex: 1; gap: 6px; }
.lr { height: 40px; padding: 0 12px; gap: 12px; background: var(--row); border: 1px solid var(--row); border-radius: 6px; font-size: 13px; font-weight: 600; box-sizing: border-box; }
.lr .n { flex: 1; }
.lr .c { font-size: 11px; }
.lr .p { font-size: 11px; color: var(--dm); font-weight: 500; }
.lr.on { border-color: var(--acc); }
.lr.full { color: var(--dm); }
.jn { width: 210px; gap: 10px; }
.cells { gap: 6px; }
.cell { width: 34px; height: 40px; background: var(--base); border: 0 solid var(--acc); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; box-sizing: border-box; }
.cell.cur { border-bottom-width: 3px; }
.mf { gap: 12px; padding: 12px 18px; border: 0 solid var(--edge); border-top-width: 1px; font-size: 13px; }
.mf .q { margin-left: auto; color: var(--dm); }
.vn { font-size: 13px; color: var(--dm); }
.code { font-size: 14px; font-weight: 700; letter-spacing: 1px; }
.btn { font-size: 11px; font-weight: 700; padding: 9px 14px 8px; border-radius: 6px; background: var(--acc); color: var(--acc-ink); border: 0 solid var(--acc-deep); border-bottom-width: 3px; }
.btn.o { background: var(--row); color: var(--acc); border: 1px solid var(--acc); }
.btn.s { padding: 5px 10px 4px; font-size: 10px; }
.btn.no { background: var(--row); color: var(--dm); border: 0 solid var(--base); border-bottom-width: 3px; }
.btn.xl { font-size: 18px; padding: 16px 44px 14px; border-bottom-width: 4px; }
.nav { width: 170px; gap: 2px; font-size: 13px; color: var(--dm); }
.nav span { padding: 9px 12px; border-radius: 6px; }
.nav .on { background: var(--row); color: var(--tx); font-weight: 600; }
.srows { flex: 1; }
.sr { height: 46px; justify-content: space-between; gap: 16px; font-size: 13px; border: 0 solid var(--edge); border-bottom-width: 1px; }
.sr:last-child { border-bottom-width: 0; }
.sld { position: relative; width: 190px; height: 8px; border-radius: 4px; background: var(--base); }
.sld b { position: absolute; left: 0; top: 0; bottom: 0; background: var(--acc); border-radius: 4px; }
.sld i { position: absolute; top: -7px; width: 14px; height: 22px; border-radius: 4px; background: var(--tx); }
.vv { width: 26px; text-align: right; font-size: 11px; color: var(--dm); }
.dd { gap: 10px; padding: 7px 10px 7px 12px; background: var(--row); border: 1px solid var(--edge); border-radius: 6px; }
.dd svg.ic { color: var(--dm); }

/* the machine screens: 640x360 SubViewports */
.vp { width: 640px; height: 360px; box-sizing: border-box; padding: 20px 24px 22px; gap: 16px; background: var(--base); color: var(--tx); }
.vp.mid { align-items: center; justify-content: center; gap: 22px; }
.vhd { justify-content: space-between; }
.vt { font-size: 20px; font-weight: 700; }
.vt.big { font-size: 30px; }
.vk { font-size: 13px; font-weight: 700; color: var(--acc); letter-spacing: 1px; text-transform: uppercase; }
.vft { gap: 12px; margin-top: auto; }
.srows .stp { gap: 6px; }
.sb { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 16px; background: var(--row); border: 1px solid var(--edge); border-radius: 6px; box-sizing: border-box; }
.sv { min-width: 96px; text-align: center; font-size: 15px; font-weight: 700; }
.seg { gap: 0; }
.seg .u { font-size: 13px; font-weight: 700; padding: 9px 18px; background: var(--row); color: var(--dm); border: 1px solid var(--edge); }
.seg .u:first-child { border-radius: 6px 0 0 6px; }
.seg .u:last-child { border-radius: 0 6px 6px 0; }
.seg .u.on { background: var(--acc); color: var(--acc-ink); border-color: var(--acc); }
.vp .sr { height: 64px; font-size: 16px; }
.pts { gap: 10px; }
.pts b { font-size: 30px; font-weight: 700; color: var(--acc); }
.cards { gap: 14px; align-items: stretch; flex: 1; }
.card { flex: 1; white-space: normal; gap: 6px; padding: 14px; }
.card .nm { font-size: 14px; font-weight: 700; line-height: 1.25; }
.card .fx { font-size: 13px; color: var(--dm); }
.card .c { font-size: 22px; font-weight: 700; margin-top: 6px; }
.card.off { color: var(--dm); }
.card.on { border: 2px solid var(--acc); }
.prog { gap: 6px; }
.prog i { display: block; width: 34px; height: 16px; border-radius: 4px; background: var(--row); }
.prog i.a { background: var(--acc); }

/* the dead's room */
.dtitle { left: calc(50% - 130px); top: 30px; width: 260px; padding: 10px 0; text-align: center; font-size: 14px; font-weight: 700; }
.dback { left: calc(50% - 130px); top: calc(50% - 60px); width: 260px; padding: 18px 0 16px; align-items: center; gap: 4px; }
.dback .lab { font-size: 12px; }
.dback .t { font-size: 52px; font-weight: 700; line-height: 1; }
.dalso { left: 24px; bottom: 24px; padding: 10px 14px; font-size: 13px; }
.dcap { right: 24px; bottom: 24px; padding: 10px 14px; font-size: 13px; color: var(--dm); }

/* ===== loud: the role reveal, the cops' minute, the ends ===== */
.edge { inset: 0; border: 8px solid var(--dan); }
.stage .cops { left: calc(50% - 290px); top: 104px; width: 580px; }
.cops { align-items: center; gap: 2px; padding: 16px 30px 12px; background: var(--dan); color: var(--dan-ink); border-color: var(--dan-deep); border-bottom-width: 5px; }
.cops .s1 { font-size: 22px; font-weight: 700; }
.cops .s2 { font-size: 13px; font-weight: 600; }
.cops .t { font-size: 72px; font-weight: 700; line-height: 1; }
.band { left: 0; right: 0; top: 230px; height: 190px; background: var(--acc); color: var(--acc-ink); display: flex; align-items: center; justify-content: center; }
.band .u { font-size: 92px; font-weight: 700; letter-spacing: -1px; text-transform: uppercase; }
.hum .band, .e-time .band { background: var(--dan); color: var(--dan-ink); }
.who { left: 0; right: 0; top: 180px; text-align: center; font-size: 14px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--dm); }
.goal { left: calc(50% - 360px); width: 720px; top: 456px; margin: 0; white-space: normal; text-align: center; font-size: 22px; line-height: 1.4; color: var(--tx); }
.team { left: 0; right: 0; top: 580px; justify-content: center; gap: 10px; font-size: 17px; font-weight: 600; color: var(--tx); }
.team i { display: block; width: 14px; height: 14px; border-radius: 4px; }
.end .band { top: 200px; height: 210px; }
.end .band .u { font-size: 84px; text-transform: none; }
.won { left: 0; right: 0; top: 450px; text-align: center; font-size: 30px; font-weight: 700; color: var(--tx); }
.why { left: 0; right: 0; top: 506px; text-align: center; font-size: 19px; color: var(--dm); }
.back { left: 0; right: 0; bottom: 48px; text-align: center; font-size: 14px; color: var(--dm); }
.e-cops { background: var(--dan); }
.e-cops .band { background: var(--dan); color: var(--dan-ink); }
.e-cops .band .u { font-size: 140px; text-transform: uppercase; }
.e-cops .won, .e-cops .why, .e-cops .back { color: var(--dan-ink); }
`;

function page() {
  return `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="claude:viewport-fit-sides" content="cover">
<title>Екрани костюма</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700&family=Onest:wght@400;500;600;700&display=swap">
<!-- generated by pages/suit-final/build.js: edit the script, then run node pages/suit-final/build.js -->
<style>${CSS}</style>
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <!-- own work (LICENCES.json): line icons in a 48 box, drawn in currentColor -->
  <symbol id="i-rocket" viewBox="0 0 48 48"><path d="M24 5C30 11 32 19 30 31H18C16 19 18 11 24 5Z"/><circle cx="24" cy="17" r="3"/><path d="M18 24L12 33L18 32M30 24L36 33L30 32M21 35L24 42L27 35"/></symbol>
  <symbol id="i-bun" viewBox="0 0 48 48"><path d="M7 25C7 14 41 14 41 25Z"/><rect x="7" y="29" width="34" height="8" rx="4"/><path d="M18 19L20 18M27 18L29 19"/></symbol>
  <symbol id="i-battery" viewBox="0 0 48 48"><rect x="13" y="12" width="22" height="30" rx="4"/><path d="M20 7H28V12H20ZM25 18L20 27H28L23 36"/></symbol>
  <symbol id="i-siren" viewBox="0 0 48 48"><path d="M13 36V26A11 11 0 0 1 35 26V36"/><rect x="9" y="36" width="30" height="6" rx="2"/><path d="M24 4V9M8 12L12 15M40 12L36 15"/></symbol>
  <symbol id="i-chev" viewBox="0 0 48 48"><path d="M14 19L24 29L34 19"/></symbol>
</svg>

<main class="wrap">
  <header class="intro">
    <p class="kicker">prime-game · UI · обраний вигляд · 22.10.2026</p>
    <h1>Усі екрани гри в обраному вигляді</h1>
    <p class="lede">Форма — «Плитка», кольори — «Чорнильна мʼята». Спокійно скрізь; гучно лише у великі моменти: показ ролі, хвилина копів і кінці.</p>
    <div class="tags"><span class="tag">масштаб UI 0.75×</span><span class="tag">тексти з колоди, чернетки позначено</span><span class="tag loud">гучно: 4, 7, 10</span></div>
    <div class="sw"><span><i style="background:#2A2540"></i>плитка</span><span><i style="background:#1A1629"></i>основа</span><span><i style="background:#ECE8F7"></i>текст</span><span><i style="background:#6FF2B4"></i>акцент</span><span><i style="background:#FF5C6C"></i>небезпека</span><span>Unbounded + Onest</span></div>
    <p class="note">Кожен кадр 16:9; тло — плоскі кольори замість світу гри. Інтерфейс лише плитками, які вміє намалювати Godot: заливка, тонка межа, кути 8 px.</p>
  </header>

  <div class="switch" role="group" aria-label="Розмір кадрів"><span>Кадри:</span>
    <button type="button" data-big="0">На ширину</button>
    <button type="button" data-big="1">Удвічі, з прокруткою</button>
    <small>«Удвічі» — для телефона: кадр удвічі ширший, гортайте його вбік.</small>
  </div>
${sections()}

  <footer class="foot">
    <p><b>Шрифти</b> (Google Fonts, з кирилицею; ліцензію перевірено в METADATA.pb репозиторію google/fonts, 21.10.2026):</p>
    <ul>
      <li>Unbounded — SIL Open Font License 1.1, <a href="https://github.com/google/fonts/tree/main/ofl/unbounded">ofl/unbounded</a></li>
      <li>Onest — SIL Open Font License 1.1, <a href="https://github.com/google/fonts/tree/main/ofl/onest">ofl/onest</a></li>
    </ul>
    <p>Іконки (феєрверк, булка, батарейка, сирена, стрілка списку) — власна робота, <code>pages/suit-final/LICENCES.json</code>. Жодних зображень: світ, машини й гравці — плоскі кольори-заглушки. Імена, назви лобі, коди й числа — зразки. Тексти — з колоди <code>copy/strings.csv</code>; чернетки позначено під кадрами.</p>
    <p>Джерело: <code>pages/suit-final/build.js</code> → <code>pages/suit-final/index.html</code> у prime-game-ui.</p>
  </footer>
</main>

<script>
// The frames: the stage is 1280x720 (UI scale 0.75x), scaled to the frame's width; "big" makes frames twice as wide.
let big = false;
try { big = localStorage.getItem("suit-final-big") === "1"; } catch (e) {}
function fit() {
  document.querySelectorAll(".frame").forEach(f => {
    f.querySelector(".stage").style.transform = "scale(" + f.clientWidth / 1280 + ")";
  });
}
function setBig(b) {
  big = b;
  document.querySelectorAll(".scroller").forEach(s => s.classList.toggle("big", b));
  document.querySelectorAll(".switch button").forEach(x => x.setAttribute("aria-pressed", String((x.dataset.big === "1") === b)));
  try { localStorage.setItem("suit-final-big", b ? "1" : "0"); } catch (e) {}
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
    if (cur !== html) { console.log('pages/suit-final/index.html is stale: run node pages/suit-final/build.js'); process.exit(1); }
    console.log(`pages/suit-final/index.html matches its build (${Math.round(html.length / 1024)} KB)`);
    return;
  }
  fs.writeFileSync(OUT, html);
  console.log(`wrote pages/suit-final/index.html (${Math.round(html.length / 1024)} KB)`);
}

main();
