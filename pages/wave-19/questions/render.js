// The pictures of the wave-19 question page (prime-game-ui#19): each option of each question drawn as the real screen
// would look with that option applied, cropped to the part that matters. Local Windows + Microsoft Edge only, not CI.
//
//   node pages/wave-19/questions/render.js --out <dir> [--only q1,q5] [--keep]
//     --out   the folder for the JPEGs (created; it must be outside the repo: the pictures are published next to the
//             page as artifact files, never committed)
//     --only  only these questions
//     --keep  keep the temp copies (to look at a built option page)
//
// How: per option, a temp copy of the repo's pages/, tools/, tokens/, dist/ and copy/ (outside the repo) gets the
// option applied there (a deck text, a screen source node or a token value; the repo itself is never written), the
// token build reruns when tokens changed, and `node pages/screens/build.js --out <file> <ids>` builds that copy's private
// page. One headless Edge (tools/screens/edge.js) then opens each frame in the page's measuring mode
// (?only=<screen>:<state>&lang=..&size=..), checks that Comfortaa is loaded, and measures the nodes a picture is about.
// The options of one question share one crop (the union of what each option draws, padded), so the pictures line up.
// A crop is captured as JPEG (quality 80) at up to twice its size, so it stays sharp on a phone, and at most 900 px
// wide and 760 px tall. Names: <question><option>-<part>-<lang>.jpg; questions.json gives each picture its size.
// Node's own modules only.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const { launch, haveEdge } = require(path.join(ROOT, 'tools', 'screens', 'edge.js'));
const { fontState } = require(path.join(ROOT, 'tools', 'screens', 'measure.js'));
const C = require(path.join(ROOT, 'tools', 'screens', 'common.js'));
const D = require(path.join(ROOT, 'tools', 'copy', 'deck.js'));

const COPY = ['pages', 'tools', 'tokens', 'dist', 'copy'];
const MAX_W = 900;
const MAX_H = 760;
const QUALITY = 80;
const FILES = {
  s1: 's01-tutorial.json', s3: 's03-connecting.json', s4: 's04-lobby.json', s5: 's05-esc-menu.json',
  s7: 's07-hud.json', s9: 's09-downed.json', s10: 's10-post-game.json',
};

// ---- editing a temp copy ----------------------------------------------------------------------------------------
const readJson = (r, rel) => JSON.parse(fs.readFileSync(path.join(r, rel), 'utf8'));
const writeJson = (r, rel, v) => fs.writeFileSync(path.join(r, rel), JSON.stringify(v, null, 2) + '\n');

// edit(r, 's9', (S, at) => …): S is the screen source; at('Hud/Vitals') is that node (throws when missing)
function edit(r, id, fn) {
  const rel = `pages/screens/src/${FILES[id]}`;
  const S = readJson(r, rel);
  const at = (p) => {
    let list = S.nodes, n = null;
    for (const name of p.split('/')) {
      n = (list || []).find((x) => x.name === name);
      if (!n) throw new Error(`${id}: no node ${p}`);
      list = n.children;
    }
    return n;
  };
  fn(S, at);
  writeJson(r, rel, S);
}
const drop = (parent, name) => {
  const i = parent.children.findIndex((x) => x.name === name);
  if (i < 0) throw new Error('no child ' + name);
  return parent.children.splice(i, 1)[0];
};

// deck(r, { key: { uk, en } }): change these rows, or append a key the deck lacks
function deck(r, rows) {
  const file = path.join(r, 'copy', 'strings.csv');
  const table = D.parseCsv(fs.readFileSync(file, 'utf8')).map((x) => x.cells);
  for (const [key, v] of Object.entries(rows)) {
    const row = table.find((c) => c[0] === key);
    if (row) { if (v.en !== undefined) row[1] = v.en; if (v.uk !== undefined) row[2] = v.uk; }
    else table.push([key, v.en, v.uk, '', '']);
  }
  const cell = (s) => (/[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s);
  fs.writeFileSync(file, table.map((c) => c.map(cell).join(',')).join('\n') + '\n');
}

// tokens(r, 'components/bar.tokens.json', (T) => …): edit a tokens file; the token build reruns before the page build
function tokens(r, rel, fn) {
  const T = readJson(r, 'tokens/' + rel);
  fn(T);
  writeJson(r, 'tokens/' + rel, T);
  return true;
}

// ---- the shared setups ------------------------------------------------------------------------------------------
// q2: the loading list narrowed from 768 to 400 px for every option, so its texts read on a phone
function narrowLoading(r) {
  edit(r, 's3', (S, at) => { at('Loading').custom_minimum_size = [400, 0]; at('Loading/Bar').custom_minimum_size = [400, 16]; });
}

// q1: both bars half full in s9's return state, over the dark room
function halfBars(r) {
  edit(r, 's9', (S, at) => {
    at('Hud/Vitals/Health/Track/Fill').per_state = { back: { value: 0.5 } };
    at('Hud/Vitals/Stamina/Track/Fill').per_state = { back: { value: 0.5 } };
  });
}

// s1's step-howto frame becomes lesson 7 (death) with lessons 1-6 done; `extra` adds a tenth lesson (q8 c)
const DONE = (name, key, args) => ({
  name: name + 'Done', type: 'HBoxContainer', variation: 'ToyRowEight',
  children: [
    Object.assign({ name: 'Name', type: 'Label', variation: 'ToyTextOnDark', key, size_flags_horizontal: 'expand_fill', autowrap_mode: 'word_smart', custom_minimum_size: [240, 0] }, args ? { args } : {}),
    { name: 'Check', type: 'TextureRect', icon: 'check', custom_minimum_size: [24, 24], size_flags_vertical: 'shrink_center' },
  ],
});
const NOW = (name, key, args) => ({
  name: name + 'Now', type: 'PanelContainer', variation: 'ToyChipLight', size_flags_horizontal: 'shrink_begin',
  children: [Object.assign({ name: 'Name', type: 'Label', variation: 'ToyChipLightText', key }, args ? { args } : {})],
});
const NEXT = (name, key) => ({ name, type: 'Label', variation: 'ToyTextMutedOnDark', key, autowrap_mode: 'word_smart', custom_minimum_size: [240, 0] });
const LESSONS = [
  ['Move', 'tutorial.list.move'], ['PickUp', 'tutorial.list.pick_up'], ['HandBelt', 'tutorial.list.hand_belt'],
  ['Deliver', 'tutorial.list.deliver'], ['Map', 'tutorial.list.map', { key: 'M' }], ['Downed', 'tutorial.list.downed'],
  ['Death', 'tutorial.list.death'], ['Voice', 'tutorial.list.voice'], ['Menu', 'tutorial.list.menu'],
];
function lesson(r, o) {
  const list = o.ready ? LESSONS.concat([['Ready', 'tutorial.list.ready']]) : LESSONS;
  const now = o.ready ? list.length - 1 : 6;
  edit(r, 's1', (S, at) => {
    at('List/V/Rows').children = list.map(([n, k, a], i) => (i < now ? DONE(n, k, a) : i === now ? NOW(n, k, a) : NEXT(n, k)));
    const count = String(now + 1), total = String(list.length);
    at('Step/V/Progress').per_state['step-howto'] = { args: { count, total } };
    const how = o.ready ? 'tutorial.step.press' : 'tutorial.step.death.how';
    const key = o.ready ? 'F' : { uk: 'ЛКМ', en: 'LMB' };
    at('Step/V/Title').per_state['step-howto'] = { key: o.ready ? 'tutorial.step.ready.title' : 'tutorial.step.death.title' };
    at('Step/V/How/Before').per_state['step-howto'] = { key: how, args: { key } };
    at('Step/V/How/Key').per_state = {};
    at('Step/V/How/Key/Text').per_state['step-howto'] = { key: how, args: { key } };
    const after = at('Step/V/How/After');
    after.key = how;
    after.args = { key };
  });
  if (o.ready) deck(r, { 'tutorial.list.ready': { en: 'Ready', uk: 'Готовність' }, 'tutorial.step.ready.title': { en: 'Get ready', uk: 'Познач готовність' } });
}

// ---- the questions ------------------------------------------------------------------------------------------------
// Each option: { q, opt, apply(r) (returns true when tokens changed), shots: [{ part, frame, langs, size, nodes, pad }] }.
// nodes: data-node paths whose boxes (with every descendant's) make the crop; "~path" counts only the text under it.
const UK = ['uk'];
const BOTH = ['uk', 'en'];
const shot = (part, frame, langs, nodes, more) => Object.assign({ part, frame, langs, nodes, pad: 24, size: 'default' }, more || {});
const V = 's5/Menu/H/Page/Character/Body/Form';
const SW = (S, at) => at('Menu/H/Page/Character/Body/Form/ColourRow/H/Swatches');
const focusRing = (r) => tokens(r, 'components/pick.tokens.json', (T) => {
  T.pick['swatch-focus'] = {
    $description: 'The focused swatch: a 3 px ink ring flush outside the disc (no gap), unlike the chosen swatch\'s gapped ring.',
    $extensions: { 'io.github.xperiaroco2.prime-game': { godot: { variation: 'ToySwatchFocus', class: 'Panel' }, context: 'light' } },
    panel: {
      'bg-color': { $type: 'color', $value: '{palette.clear}' },
      'border-color': { $type: 'color', $value: '{color.outline}' },
      'border-width': { $type: 'dimension', $value: '{focus.width}' },
      'corner-radius': { $type: 'dimension', $value: '{radius.pill}' },
      'expand-margin': { $type: 'dimension', $value: { value: 3, unit: 'px' } },
    },
  };
});
const focusOn = (r, n) => edit(r, 's5', (S, at) => {
  SW(S, at).children[n - 1].children.push({ name: 'Focus', type: 'Panel', variation: 'ToySwatchFocus', anchors_preset: 'full_rect' });
});
const swatchShot = [shot('swatches', 's5:character', UK, [V + '/NameRow/H/Field', V + '/ColourRow/H/Swatches'], { pad: 28 })];
const endNodes = ['~s10/V/Title', 's10/V/Winner', '~s10/V/Result', '~s10/V/Back'];

const OPTIONS = [
  // q1: HUD bars over a dark room
  { q: 'q1', opt: 'a', apply: (r) => { halfBars(r); return tokens(r, 'components/bar.tokens.json', (T) => { T.bar.track.panel['border-color'].$value = '{palette.slotline}'; }); },
    shots: [shot('bars', 's9:back', UK, ['s9/Hud/Vitals'], { pad: 48 })] },
  { q: 'q1', opt: 'b', apply: (r) => { halfBars(r); edit(r, 's9', (S, at) => {
    const vit = at('Hud/Vitals');
    const health = drop(vit, 'Health'), stamina = drop(vit, 'Stamina');
    vit.children.unshift({ name: 'Bars', type: 'PanelContainer', variation: 'ToyPlate', states: ['back'],
      children: [{ name: 'V', type: 'VBoxContainer', variation: 'ToyColumnTwelve', children: [health, stamina] }] });
  }); },
    shots: [shot('bars', 's9:back', UK, ['s9/Hud/Vitals'], { pad: 48 })] },
  { q: 'q1', opt: 'c', apply: (r) => { halfBars(r); }, shots: [shot('bars', 's9:back', UK, ['s9/Hud/Vitals'], { pad: 48 })] },

  // q2: your own row while loading
  { q: 'q2', opt: 'a', apply: (r) => { narrowLoading(r); deck(r, { 'loading.player_loading': { uk: 'Завантаження…' } }); },
    shots: [shot('rows', 's3:load', BOTH, ['s3/Loading/Bar', '~s3/Loading/Players'])] },
  { q: 'q2', opt: 'b', apply: (r) => {
    narrowLoading(r);
    deck(r, { 'loading.player_loading_own': { en: 'Loading…', uk: 'Завантажуєш…' } });
    edit(r, 's3', (S, at) => { at('Loading/Players/Row/State').key = 'loading.player_loading_own'; });
  }, shots: [shot('rows', 's3:load', BOTH, ['s3/Loading/Bar', '~s3/Loading/Players'])] },
  { q: 'q2', opt: 'c', apply: (r) => { narrowLoading(r); }, shots: [shot('rows', 's3:load', BOTH, ['s3/Loading/Bar', '~s3/Loading/Players'])] },

  // q3: a sentence with a keycap (s9's give-up line and s1's death lesson)
  ...[['a', { 'downed.give_up_hold': { uk: 'Щоб здатися, утримуй {key}' }, 'tutorial.step.death.how': { uk: 'Щоб дивитися на іншого гравця, натисни {key}' } }],
    ['b', { 'downed.give_up_hold': { uk: 'Утримуй {key} щоб здатися' }, 'tutorial.step.death.how': { uk: 'Натисни {key} щоб дивитися на іншого гравця' } }],
    ['c', null]].map(([opt, rows]) => ({
    q: 'q3', opt, apply: (r) => { if (rows) deck(r, rows); lesson(r, {}); },
    shots: [shot('downed', 's9:down', BOTH, ['s9/GiveUp'], { pad: 20 }), shot('lesson', 's1:step-howto', BOTH, ['s1/Step'], { pad: 20 })],
  })),

  // q4: a loss on a festive plate
  { q: 'q4', opt: 'a', apply: (r) => { edit(r, 's10', (S, at) => {
    const v = at('V');
    const win = at('V/Winner');
    const loss = JSON.parse(JSON.stringify(win));
    win.states = ['win'];
    delete win.per_state;
    Object.assign(loss, { name: 'WinnerLoss', variation: 'ToyTextOnDark', key: 'end.won_dissidents', states: ['lose'] });
    delete loss.per_state;
    v.children.splice(v.children.indexOf(win) + 1, 0, loss);
  }); }, shots: [shot('win', 's10:win', UK, endNodes, { group: 'end', pad: 40 }), shot('lose', 's10:lose', UK, endNodes.concat(['s10/V/WinnerLoss']), { group: 'end', pad: 40 })] },
  { q: 'q4', opt: 'b', apply: (r) => tokens(r, 'components/title.tokens.json', (T) => { delete T.title.plate.$extensions['io.github.xperiaroco2.prime-game'].godot.base; }),
    shots: [shot('win', 's10:win', UK, endNodes, { group: 'end', pad: 40 }), shot('lose', 's10:lose', UK, endNodes, { group: 'end', pad: 40 })] },
  { q: 'q4', opt: 'c', apply: () => {},
    shots: [shot('win', 's10:win', UK, endNodes, { group: 'end', pad: 40 }), shot('lose', 's10:lose', UK, endNodes, { group: 'end', pad: 40 })] },

  // q5: colour swatches, the 1st chosen and the 3rd focused
  { q: 'q5', opt: 'a', apply: (r) => {
    edit(r, 's5', (S, at) => {
      for (const sw of SW(S, at).children) { sw.custom_minimum_size = [40, 40]; sw.children[0].custom_minimum_size = [40, 40]; }
    });
    focusOn(r, 3);
    return focusRing(r);
  }, shots: swatchShot },
  { q: 'q5', opt: 'b', apply: (r) => { focusOn(r, 3); return focusRing(r); }, shots: swatchShot },
  { q: 'q5', opt: 'c', apply: (r) => { edit(r, 's5', (S, at) => {
    const sws = SW(S, at).children;
    sws[2].children.push(JSON.parse(JSON.stringify(sws[0].children.find((x) => x.name === 'Sel'))));
  }); }, shots: swatchShot },

  // q6: the death lesson's name, as the current lesson, at large text
  { q: 'q6', opt: 'a', apply: (r) => { deck(r, { 'tutorial.list.death': { uk: 'Смерть', en: 'Death' } }); lesson(r, {}); },
    shots: [shot('list', 's1:step-howto', BOTH, ['s1/List'], { size: 'large' })] },
  { q: 'q6', opt: 'b', apply: (r) => { lesson(r, {}); edit(r, 's1', (S, at) => { at('List').custom_minimum_size = [608, 0]; }); },
    shots: [shot('list', 's1:step-howto', BOTH, ['s1/List'], { size: 'large' })] },
  { q: 'q6', opt: 'c', apply: (r) => { lesson(r, {}); }, shots: [shot('list', 's1:step-howto', BOTH, ['s1/List'], { size: 'large' })] },

  // q7: two lines that say the same (the win frame)
  { q: 'q7', opt: 'a', apply: (r) => { edit(r, 's10', (S, at) => { drop(at('V/Result'), 'Team'); }); },
    shots: [shot('end', 's10:win', BOTH, endNodes, { pad: 40 })] },
  { q: 'q7', opt: 'b', apply: (r) => { edit(r, 's10', (S, at) => { drop(at('V'), 'Winner'); }); },
    shots: [shot('end', 's10:win', BOTH, endNodes.filter((x) => !x.endsWith('Winner')), { pad: 40 })] },
  { q: 'q7', opt: 'c', apply: () => {}, shots: [shot('end', 's10:win', BOTH, endNodes, { pad: 40 })] },

  // q8: nothing teaches the ready key
  { q: 'q8', opt: 'a', apply: () => {}, shots: [
    shot('lobby', 's4:wait', UK, ['s4/Bottom'], { pad: 40 }),
    shot('esc', 's5:lobby-guest', UK, ['s5/Menu/H/Page/Lobby/Body/Side/Ready'], { pad: 32 }),
  ] },
  { q: 'q8', opt: 'b', apply: (r) => { edit(r, 's4', (S, at) => {
    const chip = at('Bottom/ReadyChip');
    const text = chip.children[0];
    text.size_flags_vertical = 'shrink_center';
    chip.children = [{ name: 'Row', type: 'HBoxContainer', variation: 'ToyRowEight', children: [text,
      { name: 'Key', type: 'PanelContainer', variation: 'ToyKeyOnDark', children: [{ name: 'Text', type: 'Label', variation: 'ToyKeyText', text: 'F', horizontal_alignment: 'center' }] }] }];
  }); }, shots: [shot('lobby', 's4:wait', UK, ['s4/Bottom'], { pad: 40 })] },
  { q: 'q8', opt: 'c', apply: (r) => { lesson(r, { ready: true }); }, shots: [
    shot('step', 's1:step-howto', UK, ['s1/Step'], { pad: 20 }),
    shot('list', 's1:step-howto', UK, ['s1/List'], { pad: 20 }),
  ] },

  // q9: what the raiser sees
  { q: 'q9', opt: 'a', apply: () => {}, shots: [shot('cross', 's7:raising', UK, ['s7/Hud/Cross', 's7/Hud/Raising'], { pad: 140 })] },
  { q: 'q9', opt: 'b', apply: (r) => { edit(r, 's7', (S, at) => { drop(at('Hud'), 'Raising'); }); },
    shots: [shot('cross', 's7:raising', UK, ['s7/Hud/Cross'], { pad: 140 })] },
];

// ---- building and capturing --------------------------------------------------------------------------------------
function run(args, cwd) {
  const r = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', timeout: 300000 });
  if (r.status !== 0) throw new Error(`node ${args.join(' ')} (in ${cwd}) failed:\n${(r.stderr || r.stdout || '').trim().split('\n').slice(0, 20).join('\n')}`);
  return r.stdout;
}

function prepare(o, tmp) {
  const r = path.join(tmp, `${o.q}${o.opt}`, 'repo');
  for (const d of COPY) fs.cpSync(path.join(ROOT, d), path.join(r, d), { recursive: true });
  const tokensChanged = o.apply(r) === true;
  if (tokensChanged) run(['tools/tokens/build.js'], r);
  const ids = [...new Set(o.shots.map((s) => s.frame.split(':')[0]))];
  const page = path.join(tmp, `${o.q}${o.opt}`, 'page.html');
  run(['pages/screens/build.js', '--out', page].concat(ids), r);
  return page;
}

// in the page: the union box of the nodes (and all they hold), or of their texts for "~path"
function measureIn(nodes) {
  var box = null, missing = [];
  function add(r) {
    if (!r || (r.width === 0 && r.height === 0)) return;
    if (!box) { box = { l: r.left, t: r.top, r: r.right, b: r.bottom }; return; }
    box.l = Math.min(box.l, r.left); box.t = Math.min(box.t, r.top); box.r = Math.max(box.r, r.right); box.b = Math.max(box.b, r.bottom);
  }
  nodes.forEach(function (n) {
    var textOnly = n.charAt(0) === '~', name = textOnly ? n.slice(1) : n;
    var el = document.querySelector('[data-node="' + name + '"]');
    if (!el || !el.getClientRects().length) { missing.push(n); return; }
    if (textOnly) {
      var texts = Array.prototype.slice.call(el.querySelectorAll('[data-key], [data-text]'));
      if (el.matches('[data-key], [data-text]')) texts.unshift(el);
      texts.forEach(function (t) {
        if (!t.getClientRects().length) return;
        var rg = document.createRange(); rg.selectNodeContents(t);
        Array.prototype.forEach.call(rg.getClientRects(), add);
      });
    } else {
      add(el.getBoundingClientRect());
      el.querySelectorAll('*').forEach(function (d) { if (d.getClientRects().length) add(d.getBoundingClientRect()); });
    }
  });
  return JSON.stringify({ box: box, missing: missing });
}

async function openFrame(edge, page, frame, lang, size) {
  await edge.page.open(C.pageUrl(page, { only: frame, lang, size }), 90);
  const fonts = await edge.page.eval(`(${fontState})()`);
  const err = C.fontVerdict(fonts, `${frame} ${lang}/${size}`, edge.page.failed);
  if (err) throw err;
  if (edge.page.errors.length) throw new Error(`${frame} ${lang}: page errors: ${edge.page.errors.slice(0, 2).join(' | ')}`);
}

async function main() {
  const argv = process.argv.slice(2);
  const val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
  const outArg = val('--out');
  const only = val('--only') ? val('--only').split(',') : null;
  const keep = argv.includes('--keep');
  if (!outArg) { console.error('usage: node pages/wave-19/questions/render.js --out <dir> [--only q1,q5] [--keep]'); process.exit(2); }
  const out = path.resolve(outArg);
  const relOut = path.relative(ROOT, out);
  if (!relOut || (!relOut.startsWith('..') && !path.isAbsolute(relOut))) { console.error('render: --out must be outside the repo: ' + out); process.exit(2); }
  if (!haveEdge()) { console.error('render: needs Windows and Microsoft Edge (local only)'); process.exit(2); }
  fs.mkdirSync(out, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'prime-ui-q19-'));
  const todo = OPTIONS.filter((o) => !only || only.includes(o.q));
  const t0 = Date.now();
  const pages = new Map();
  for (const o of todo) {
    pages.set(o, prepare(o, tmp));
    console.log(`built ${o.q}${o.opt}`);
  }
  const edge = await launch({});
  const files = [];
  try {
    // pass 1: measure every shot; the options of a question share the union of their boxes
    const jobs = [];
    for (const o of todo) for (const s of o.shots) for (const lang of s.langs) {
      await openFrame(edge, pages.get(o), s.frame, lang, s.size);
      const m = JSON.parse(await edge.page.eval(`(${measureIn})(${JSON.stringify(s.nodes)})`));
      const want = s.nodes.filter((n) => !m.missing.includes(n));
      if (!m.box || want.length === 0) throw new Error(`${o.q}${o.opt} ${s.part} ${lang}: nothing to crop (missing ${m.missing.join(', ')})`);
      jobs.push({ o, s, lang, box: m.box, group: `${o.q}:${s.group || s.part}:${lang}` });
    }
    const union = new Map();
    for (const j of jobs) {
      const u = union.get(j.group);
      union.set(j.group, u ? { l: Math.min(u.l, j.box.l), t: Math.min(u.t, j.box.t), r: Math.max(u.r, j.box.r), b: Math.max(u.b, j.box.b) } : Object.assign({}, j.box));
    }
    // pass 2: capture
    for (const j of jobs) {
      const u = union.get(j.group), pad = j.s.pad;
      const x = Math.max(0, Math.floor(u.l - pad)), y = Math.max(0, Math.floor(u.t - pad));
      const w = Math.min(1920, Math.ceil(u.r + pad)) - x, h = Math.min(1080, Math.ceil(u.b + pad)) - y;
      if (w < 8 || h < 8) throw new Error(`${j.o.q}${j.o.opt} ${j.s.part} ${j.lang}: the crop ${x},${y} ${w}x${h} is outside the frame (box ${JSON.stringify(u)})`);
      const scale = Math.min(2, MAX_W / w, MAX_H / h);
      await openFrame(edge, pages.get(j.o), j.s.frame, j.lang, j.s.size);
      const shotRes = await edge.page.send('Page.captureScreenshot', { format: 'jpeg', quality: QUALITY, fromSurface: true, captureBeyondViewport: false, clip: { x, y, width: w, height: h, scale } });
      const name = `${j.o.q}${j.o.opt}-${j.s.part}-${j.lang}.jpg`;
      const buf = Buffer.from(shotRes.data, 'base64');
      fs.writeFileSync(path.join(out, name), buf);
      files.push(name);
      console.log(`  ${name}  ${Math.round(w * scale)}x${Math.round(h * scale)}  ${Math.round(buf.length / 1024)} KB  (crop ${x},${y} ${w}x${h})`);
    }
  } finally {
    await edge.close();
    if (!keep) fs.rmSync(tmp, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    else console.log('kept: ' + tmp);
  }
  console.log(`render: ${files.length} picture(s) in ${out}, ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}

main().catch((e) => { console.error('render: ' + (e && e.message ? e.message : e)); process.exit(1); });
