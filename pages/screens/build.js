// The styled screens (prime-game-ui#19): every session screen as a Godot 4.7.2 scene tree in pages/screens/src/*.json,
// rendered from the Toy components and the copy deck into one review page, validated, and handed off to the game.
//
//   node pages/screens/build.js                      write screens.html, screens-ui.css and screens-layout.css
//   node pages/screens/build.js --check              exit 1 when an output differs from what the build would write
//   node pages/screens/build.js --validate [s2 ...]  validate the sources only (all, or these screens); writes nothing
//   node pages/screens/build.js --handoff s2         print the screen's Godot handoff (Markdown) to stdout
//
// THE FORMAT (pages/screens/README.md has the long form). One file per screen, src/s01-tutorial.json …
// src/s10-post-game.json; a missing file is a screen not drawn yet. Godot's defaults are the format's defaults, so a
// node states only what differs, with Godot's property names.
//   screen: { id "s2" (from the file name), wireframe "s2" (a wireframe section), title (English), background (the
//     world behind the UI, page art: menu | room-light | room-dark | black), note?, states [{id, label (Ukrainian), note?}],
//     nodes [root nodes] }
//   node:   { name, type, variation?, states? [ids it is visible in; default all], per_state? {state: {field: value}},
//     note? (English, for the game developer), custom_minimum_size? [w, h], children? [nodes], … }
//   placement: a root, or a child of a Control, Panel or Button, is placed by anchors: anchors_preset (Godot's
//     LayoutPreset name: top_left, center, full_rect, …; default top_left), offset_left/top/right/bottom (default 0),
//     grow_horizontal/grow_vertical (begin | end | both; default: what the editor sets for the preset). A child of a
//     container is placed by it: size_flags_horizontal/vertical (fill | shrink_begin | shrink_center | shrink_end |
//     expand_fill | expand_shrink_begin | expand_shrink_center | expand_shrink_end; default fill) and, in a box,
//     size_flags_stretch_ratio (default 1). A CenterContainer ignores size flags.
//   types (rendered faithfully, nothing else): Control, Panel, PanelContainer (wide), MarginContainer (margin_left/
//     top/right/bottom), CenterContainer, VBoxContainer and HBoxContainer (separation 4, alignment begin|center|end),
//     GridContainer (columns 1, h_separation 4, v_separation 4), Label (key, args, count, piece, value_of,
//     horizontal_alignment left|center|right|fill, vertical_alignment top|center|bottom|fill, autowrap_mode off|
//     arbitrary|word|word_smart), Button (key and/or icon, icon_size, args, count, state, toggle_mode, alignment
//     left|center|right, h_separation: the variation's theme constant, else 4), OptionButton (key, args, items,
//     state; its arrow is icons/chevron-down.svg), LineEdit (text: a sample value, placeholder: a key, editable,
//     state normal|focus), ProgressBar (value, max_value 100, show_percentage: must be false), TextureRect (icon,
//     theme_color icon-on|icon-off: a colour item of the surface it sits on, as ToyMic's; sized by
//     custom_minimum_size).
//   texts: only deck keys of copy/strings.csv. args gives each placeholder a sample value (a string, or {uk, en});
//     a plural key takes count. piece N draws only the Nth part of the text split at {key}/{preset} (a sentence drawn
//     around a keycap); value_of names the placeholder whose sample value a node draws (the keycap's letter).
//   states of a Button (the look shown on the page): normal, hover, held, disabled, focus, and with toggle_mode the
//     selected ones (selected, selected-hover, selected-held, selected-disabled, selected-focus) that draw the pack's
//     toggle.selected variation, as ToyToggle does.
//   per_state may change only content: key, args, count, state, value, text, placeholder, editable, icon,
//     theme_color, variation, wide. Layout never changes per state; a node shown only in some states lists them in
//     states.
//
// VALIDATION (every error names the file, the line, the JSON pointer and what to do): unknown types and fields; a
// variation missing from the pack, abstract, of a class that is not the node's type or a base of it, or a toggle's
// selected half named directly; a text that is not a deck key (no field takes literal player-facing text); a missing
// placeholder sample, an unknown arg, a plural key without count; an icon without a licence record; a state that is
// not declared, or where the parent is hidden; duplicate sibling names; an anchored root whose fixed size (its
// custom_minimum_size or the variation's size constants) leaves the 1920x1080 frame; and the context rule:
//   CONTEXT RULE. A surface is a node drawn with a Panel or PanelContainer variation, or any node with a variation that
//   holds children; the world behind the UI is a dark surface. A node drawn with a Label, Button, OptionButton,
//   LineEdit or ProgressBar variation sits on its nearest surface ancestor. When the pack gives the variation an `on`
//   list (ToyKeyText on ToyKeyOnDark, ToyKeyOnLight, ToyKeyRound) that surface must be one of them; otherwise a dark or
//   light variation needs a surface of the same context (a surface of context "any" passes on its own surface's
//   context). Variations of context "any" fit everywhere.
//
// OUTPUTS. screens-ui.css (lint profile generated) is the components CSS of the variations the screens draw, emitted
// from the tokens by pages/components/emit-css.js. screens-layout.css (lint profile layout) emulates Godot's
// containers: a box or grid container is a CSS grid (a non-expanding child gets an auto track, an expanding one
// <stretch_ratio>fr, so free space goes to the expanding children by ratio and never below their minimum, as in
// BoxContainer); a PanelContainer, MarginContainer or CenterContainer stacks its children in one grid cell (the
// PanelContainer's content margins are the StyleBox padding of the generated CSS); fill/shrink flags are
// justify-self/align-self; an anchored node sits in a .gd-anchor box at its anchor rect and grows from it as its
// grow direction says. page.css and page.js are the page chrome and the world art, outside the lint.
// THE PAGE CONTRACT (the fit tool, tools/screens/, measures it): <html lang data-lang data-text-size>; one
// <div class="sc-frame" data-screen data-state> per state, 1920x1080 reference px, clipping; every node one element
// with data-node="<screen>/<path>", data-type, data-variation; a text's element carries data-key and only that text;
// ?only=<screen>:<state>|all&lang=uk|en&size=default|large renders frames alone at zoom 1 (local only) and the page
// sets data-ready="1" when fonts and layout are done.
// Deterministic and LF-only. Node 20, no packages.
'use strict';

const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '..', '..');
const J = require(path.join(ROOT, 'tools', 'lib', 'json-strict.js'));
const D = require(path.join(ROOT, 'tools', 'copy', 'deck.js'));

const SRC = 'pages/screens/src';
const OUT_HTML = 'pages/screens/screens.html';
const OUT_UI = 'pages/screens/screens-ui.css';
const OUT_LAYOUT = 'pages/screens/screens-layout.css';
const PACK = 'dist/pack/toy.pack.json';
const TOKENS_CSS = 'dist/css/toy-tokens.css';
const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap';
const W = 1920;
const H = 1080;
const SCREENS = [
  ['s1', 's01-tutorial.json'], ['s2', 's02-main-menu.json'], ['s3', 's03-connecting.json'], ['s4', 's04-lobby.json'],
  ['s5', 's05-esc-menu.json'], ['s6', 's06-pre-game.json'], ['s7', 's07-hud.json'], ['s8', 's08-map.json'],
  ['s9', 's09-downed.json'], ['s10', 's10-post-game.json'],
];
const BACKGROUNDS = {
  menu: 'the lobby room seen behind the main menu',
  'room-light': 'a lit room of the level',
  'room-dark': 'a dark room of the level',
  black: 'black, no world (intro, outro, loading)',
};
const LICENCES_OK = /^(own work|OFL(-1\.1)?|CC0(-1\.0)?|MIT|ISC|Apache-2\.0)$/i;
const ICON_SOURCES = [
  { prefix: '', dir: 'pages/components/icons', licences: 'pages/components/icons/LICENCES.json', entry: (f) => f },
  { prefix: 'room/', dir: 'pages/room-signs/systems/b/icons', licences: 'pages/room-signs/systems/b/LICENCES.json', entry: (f) => `icons/${f}` },
];

// Godot 4.7.2 classes the renderer draws: the class chain (a variation fits when its class is in it), what the class
// does with children (anchored: they place themselves; vbox/hbox/grid/stack/center: the container places them), its
// own fields, and whether it draws only through a Toy variation.
const GODOT = {
  Control: { chain: ['Control'], holds: 'anchored', fields: [] },
  Panel: { chain: ['Panel', 'Control'], holds: 'anchored', themed: true, fields: [] },
  PanelContainer: { chain: ['PanelContainer', 'Container', 'Control'], holds: 'stack', themed: true, fields: ['wide'] },
  MarginContainer: { chain: ['MarginContainer', 'Container', 'Control'], holds: 'stack', fields: ['margin_left', 'margin_top', 'margin_right', 'margin_bottom'] },
  CenterContainer: { chain: ['CenterContainer', 'Container', 'Control'], holds: 'center', fields: [] },
  VBoxContainer: { chain: ['VBoxContainer', 'BoxContainer', 'Container', 'Control'], holds: 'vbox', fields: ['separation', 'alignment'] },
  HBoxContainer: { chain: ['HBoxContainer', 'BoxContainer', 'Container', 'Control'], holds: 'hbox', fields: ['separation', 'alignment'] },
  GridContainer: { chain: ['GridContainer', 'Container', 'Control'], holds: 'grid', fields: ['columns', 'h_separation', 'v_separation'] },
  Label: { chain: ['Label', 'Control'], holds: null, themed: true, fields: ['key', 'args', 'count', 'piece', 'value_of', 'horizontal_alignment', 'vertical_alignment', 'autowrap_mode'] },
  Button: { chain: ['Button', 'BaseButton', 'Control'], holds: 'anchored', themed: true, fields: ['key', 'args', 'count', 'icon', 'icon_size', 'state', 'toggle_mode', 'alignment', 'h_separation'] },
  OptionButton: { chain: ['OptionButton', 'Button', 'BaseButton', 'Control'], holds: null, themed: true, fields: ['key', 'args', 'items', 'state'] },
  LineEdit: { chain: ['LineEdit', 'Control'], holds: null, themed: true, fields: ['text', 'placeholder', 'editable', 'state'] },
  ProgressBar: { chain: ['ProgressBar', 'Range', 'Control'], holds: null, themed: true, fields: ['value', 'max_value', 'show_percentage'] },
  TextureRect: { chain: ['TextureRect', 'Control'], holds: null, fields: ['icon', 'theme_color'] },
};
const COMMON_FIELDS = ['name', 'type', 'variation', 'states', 'per_state', 'note', 'custom_minimum_size'];
const ANCHOR_FIELDS = ['anchors_preset', 'offset_left', 'offset_top', 'offset_right', 'offset_bottom', 'grow_horizontal', 'grow_vertical'];
const FLAG_FIELDS = ['size_flags_horizontal', 'size_flags_vertical', 'size_flags_stretch_ratio'];
const PER_STATE_FIELDS = ['key', 'args', 'count', 'state', 'value', 'text', 'placeholder', 'editable', 'icon', 'theme_color', 'variation', 'wide'];
// Colour items of a surface variation that tint an icon inside it (the CSS child class the components CSS colours).
const TINTS = { 'icon-on': 'tv-icon-on', 'icon-off': 'tv-icon-off' };
const ARROW_ICON = 'chevron-down'; // OptionButton's theme icon `arrow` (pages/components/icons)
const SCREEN_FIELDS = ['id', 'wireframe', 'title', 'background', 'note', 'states', 'nodes'];
// LayoutPreset -> [anchor left, top, right, bottom, grow horizontal, grow vertical] (the grow directions the editor
// sets with the preset, Control.set_grow_direction_preset).
const PRESETS = {
  top_left: [0, 0, 0, 0, 'end', 'end'], top_right: [1, 0, 1, 0, 'begin', 'end'],
  bottom_left: [0, 1, 0, 1, 'end', 'begin'], bottom_right: [1, 1, 1, 1, 'begin', 'begin'],
  center_left: [0, 0.5, 0, 0.5, 'end', 'both'], center_top: [0.5, 0, 0.5, 0, 'both', 'end'],
  center_right: [1, 0.5, 1, 0.5, 'begin', 'both'], center_bottom: [0.5, 1, 0.5, 1, 'both', 'begin'],
  center: [0.5, 0.5, 0.5, 0.5, 'both', 'both'], left_wide: [0, 0, 0, 1, 'end', 'both'],
  top_wide: [0, 0, 1, 0, 'both', 'end'], right_wide: [1, 0, 1, 1, 'begin', 'both'],
  bottom_wide: [0, 1, 1, 1, 'both', 'begin'], vcenter_wide: [0, 0.5, 1, 0.5, 'both', 'both'],
  hcenter_wide: [0.5, 0, 0.5, 1, 'both', 'both'], full_rect: [0, 0, 1, 1, 'both', 'both'],
};
const GROWS = ['begin', 'end', 'both'];
const GROW_FLEX = { begin: 'flex-end', end: 'flex-start', both: 'center' };
// Size flag -> [expands, position in its slot], and Godot's constant.
const FLAGS = {
  fill: [false, 'stretch'], shrink_begin: [false, 'start'], shrink_center: [false, 'center'], shrink_end: [false, 'end'],
  expand_fill: [true, 'stretch'], expand_shrink_begin: [true, 'start'], expand_shrink_center: [true, 'center'], expand_shrink_end: [true, 'end'],
};
const FLAG_GODOT = {
  fill: 'SIZE_FILL', shrink_begin: 'SIZE_SHRINK_BEGIN', shrink_center: 'SIZE_SHRINK_CENTER', shrink_end: 'SIZE_SHRINK_END',
  expand_fill: 'SIZE_EXPAND_FILL', expand_shrink_begin: 'SIZE_EXPAND', expand_shrink_center: 'SIZE_EXPAND | SIZE_SHRINK_CENTER',
  expand_shrink_end: 'SIZE_EXPAND | SIZE_SHRINK_END',
};
// A Button's shown state -> [draws the selected variation, CSS state class] (as pages/components/build.js STATE).
const BUTTON_STATES = {
  normal: [false, ''], hover: [false, 'is-hover'], held: [false, 'is-held'], disabled: [false, 'is-disabled'], focus: [false, 'is-focus'],
  selected: [true, ''], 'selected-hover': [true, 'is-hover'], 'selected-held': [true, 'is-held'], 'selected-disabled': [true, 'is-disabled'],
  'selected-focus': [true, 'is-focus'],
};
const OPTION_STATES = ['normal', 'hover', 'held', 'disabled', 'focus'];
const LINE_STATES = ['normal', 'focus'];
const ENUMS = {
  horizontal_alignment: ['left', 'center', 'right', 'fill'],
  vertical_alignment: ['top', 'center', 'bottom', 'fill'],
  autowrap_mode: ['off', 'arbitrary', 'word', 'word_smart'],
};
const DEFAULTS = {
  separation: 4, h_separation: 4, v_separation: 4, columns: 1, margin_left: 0, margin_top: 0, margin_right: 0, margin_bottom: 0,
  horizontal_alignment: 'left', vertical_alignment: 'top', autowrap_mode: 'off', state: 'normal', toggle_mode: false,
  editable: true, value: 0, max_value: 100, show_percentage: true,
};
const SPLIT = ['key', 'preset']; // placeholders drawn as their own element (copy/README.md, tools/copy/deck.js PH_SPLIT)
const SPLIT_RE = /\{(?:key|preset)\}/;
const PH_RE = /\{([a-z_]+)\}/g;
const SURFACES = new Set(['Panel', 'PanelContainer']);
const TEXT_CLASSES = new Set(['Label', 'Button', 'OptionButton', 'LineEdit', 'ProgressBar']);
const NAME_RE = /^[A-Za-z][A-Za-z0-9_]*$/;
const STATE_ID_RE = /^[a-z][a-z0-9-]*$/;

class BuildError extends Error {}
const fail = (msg) => { throw new BuildError(msg); };
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isInt = (v) => Number.isInteger(v);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const q = (s) => JSON.stringify(s);
function readText(rel) {
  try { return fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n'); } catch (e) { return fail(`${rel}: cannot read the file (${e.code || e.message})`); }
}
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const fmt = (x) => String(Math.round(x * 100) / 100);
const placeholdersOf = (s) => [...new Set([...String(s).matchAll(PH_RE)].map((m) => m[1]))];

// ---------------------------------------------------------------------------------------------------------------
// Inputs: the pack, the deck, the wireframe titles and the icons.

function loadIcons() {
  const icons = new Map();
  for (const src of ICON_SOURCES) {
    let lic = {};
    if (exists(src.licences)) {
      try { lic = JSON.parse(readText(src.licences)); } catch (e) { fail(`${src.licences}: ${e.message}`); }
    }
    let files = [];
    try { files = fs.readdirSync(path.join(ROOT, src.dir)).filter((f) => f.endsWith('.svg')).sort(); } catch (e) { files = []; }
    for (const f of files) {
      const rel = `${src.dir}/${f}`;
      const entry = lic[src.entry(f)];
      const text = readText(rel).replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '').trim();
      const open = /^<svg\b[^>]*>/.exec(text);
      if (!open) continue;
      const attr = (n) => { const m = new RegExp(`\\s${n}="([^"]*)"`).exec(open[0]); return m ? m[1] : null; };
      const vb = (attr('viewBox') || '').split(/[\s,]+/).map(Number);
      const w = Number(attr('width')) || vb[2] || 24;
      const h = Number(attr('height')) || vb[3] || 24;
      const head = open[0].replace(/\s(width|height|aria-hidden|focusable)="[^"]*"/g, '').replace(/>$/, ' width="100%" height="100%" aria-hidden="true" focusable="false">');
      icons.set(src.prefix + f.replace(/\.svg$/, ''), {
        file: rel, svg: head + text.slice(open[0].length), w, h,
        licence: entry && typeof entry.licence === 'string' && LICENCES_OK.test(entry.licence) ? entry.licence : null,
      });
    }
  }
  return icons;
}

function loadInputs(pack) {
  const deck = D.readDeck(readText(D.DECK));
  if (deck.errors.length) fail(`${D.DECK} has errors; run node tools/copy/check.js\n  ${deck.errors.slice(0, 10).join('\n  ')}`);
  const selectedOf = new Map();
  for (const [name, v] of Object.entries(pack.variations)) if (v.toggle && v.toggle.selected) selectedOf.set(v.toggle.selected, name);
  return {
    pack, selectedOf, byKey: new Map(deck.entries.map((e) => [e.key, e])),
    titles: D.screenTitles(readText(D.WIREFRAMES)), icons: loadIcons(),
  };
}
const readPack = () => { try { return JSON.parse(readText(PACK)); } catch (e) { return fail(`${PACK}: ${e.message}`); } };
const packPx = (C, v, name) => { const t = v && C.pack.tokens[`${v.prefix}.${name}`]; return t && isNum(t.px) ? t.px : 0; };

// The sources: [{id, file, rel, data, position}] for the screens that exist (or the ones asked for).
function readSources(only) {
  const errors = [];
  let present = [];
  try { present = fs.readdirSync(path.join(ROOT, SRC)); } catch (e) { present = []; }
  const known = new Set(SCREENS.map(([, f]) => f));
  if (!only) for (const f of present.sort()) if (!known.has(f)) errors.push(`${SRC}/${f}: not a screen file; the screens are ${SCREENS.map(([, x]) => x).join(', ')}`);
  const out = [];
  for (const [id, file] of SCREENS) {
    if (only && !only.includes(id)) continue;
    const rel = `${SRC}/${file}`;
    if (!present.includes(file)) { if (only) errors.push(`${rel}: no such file`); continue; }
    const text = readText(rel);
    try {
      const r = J.parse(text);
      out.push({ id, file, rel, data: r.value, position: r.position });
    } catch (e) {
      if (e instanceof J.JsonStrictError) errors.push(`${rel}:${e.line}: ${e.pointer || '/'}: ${e.reason}`);
      else throw e;
    }
  }
  return { sources: out, errors };
}

// ---------------------------------------------------------------------------------------------------------------
// Validation, which also builds the normalized tree the page, the layout CSS and the handoff use.

function reporter(src) {
  const list = [];
  const seen = new Set();
  const lineOf = (pointer) => {
    for (let p = pointer; ; p = p.slice(0, p.lastIndexOf('/'))) {
      const pos = src.position ? src.position(p) : null;
      if (pos) return pos.line;
      if (!p) return null;
    }
  };
  return {
    list,
    err(pointer, msg) {
      const line = lineOf(pointer);
      const s = `${src.rel}${line ? `:${line}` : ''}: ${pointer || '/'}: ${msg}`;
      if (!seen.has(s)) { seen.add(s); list.push(s); }
    },
  };
}
const ptr = (base, ...segs) => base + segs.map((s) => '/' + J.escapeSegment(String(s))).join('');

function sampleOk(v) {
  const one = (s) => typeof s === 'string' && s.length > 0 && s.length <= 80 && !/[{}\n]/.test(s) && s === s.trim();
  if (typeof v === 'string') return one(v);
  return isObj(v) && Object.keys(v).sort().join() === 'en,uk' && one(v.uk) && one(v.en);
}
const sampleText = (v, lang) => (typeof v === 'string' ? v : v[lang]);

// Static checks of one field value (the same for a node's own field and a per_state override); null when fine.
function fieldProblem(type, field, v) {
  const int = (min, max) => (isInt(v) && v >= min && v <= max ? null : `${field} is an integer from ${min} to ${max}`);
  const bool = () => (typeof v === 'boolean' ? null : `${field} is true or false`);
  const oneOf = (list) => (list.includes(v) ? null : `${field} is one of ${list.join(', ')}; found ${q(v)}`);
  switch (field) {
    case 'theme_color': return Object.prototype.hasOwnProperty.call(TINTS, v) ? null : `theme_color is one of ${Object.keys(TINTS).join(', ')} (a colour item of the surface it sits on)`;
    case 'variation': case 'key': case 'placeholder': case 'icon':
      return typeof v === 'string' && v ? null : `${field} is a non-empty string`;
    case 'note': return typeof v === 'string' && v.trim() ? null : 'note is a non-empty string (English, for the game developer)';
    case 'args':
      if (!isObj(v)) return 'args is an object {placeholder: sample value}';
      for (const [k, x] of Object.entries(v)) if (!sampleOk(x)) return `args.${k} is a sample value: a string (at most 80 characters, no braces or line breaks) or {"uk": …, "en": …}`;
      return null;
    case 'count': return int(0, 1000000);
    case 'piece': return int(0, 9);
    case 'value_of': return typeof v === 'string' && /^[a-z_]+$/.test(v) ? null : 'value_of names a placeholder of the key, such as "key"';
    case 'horizontal_alignment': case 'vertical_alignment': case 'autowrap_mode': return oneOf(ENUMS[field]);
    case 'icon_size': return int(8, 512);
    case 'state':
      if (type === 'Button') return oneOf(Object.keys(BUTTON_STATES));
      if (type === 'OptionButton') return oneOf(OPTION_STATES);
      return oneOf(LINE_STATES);
    case 'toggle_mode': case 'editable': case 'show_percentage': case 'wide': return bool();
    case 'alignment': return oneOf(type === 'Button' ? ['left', 'center', 'right'] : ['begin', 'center', 'end']);
    case 'separation': case 'h_separation': case 'v_separation': return int(-200, 400);
    case 'margin_left': case 'margin_top': case 'margin_right': case 'margin_bottom': return int(-400, 1000);
    case 'columns': return int(1, 32);
    case 'items': return Array.isArray(v) && v.length && v.every((x) => typeof x === 'string' && x) ? null : 'items is a list of deck keys';
    case 'text': return sampleOk(v) ? null : 'text is a sample value: a string (at most 80 characters) or {"uk": …, "en": …}';
    case 'value': return isNum(v) && v >= 0 ? null : 'value is a number of at least 0';
    case 'max_value': return isNum(v) && v > 0 ? null : 'max_value is a number above 0';
    default: return null;
  }
}

function validateScreen(src, C) {
  const R = reporter(src);
  const s = src.data;
  const S = { id: src.id, file: src.file, rel: src.rel, roots: [], all: [], states: [], stateIds: [] };
  if (!isObj(s)) { R.err('', 'a screen is a JSON object'); return { errors: R.list, screen: null }; }
  for (const k of Object.keys(s)) if (!SCREEN_FIELDS.includes(k)) R.err(ptr('', k), `unknown field ${k} (a screen has ${SCREEN_FIELDS.join(', ')})`);
  for (const k of ['id', 'wireframe', 'title', 'background', 'states', 'nodes']) if (!(k in s)) R.err('', `a screen needs ${k}`);
  if ('id' in s && s.id !== src.id) R.err('/id', `the file ${src.file} holds screen ${q(src.id)}, not ${q(s.id)}`);
  if ('wireframe' in s) {
    if (typeof s.wireframe !== 'string' || !C.titles[s.wireframe]) R.err('/wireframe', `${q(s.wireframe)} is not a wireframe section; pages/wireframes has ${Object.keys(C.titles).join(', ')}`);
    else S.wireframe = s.wireframe;
  }
  if ('title' in s) {
    if (typeof s.title !== 'string' || !s.title.trim() || /[Ѐ-ӿ]/.test(s.title)) R.err('/title', 'title is the screen\'s English name');
    else S.title = s.title;
  }
  if ('background' in s) {
    if (!Object.prototype.hasOwnProperty.call(BACKGROUNDS, s.background)) R.err('/background', `background is one of ${Object.keys(BACKGROUNDS).join(', ')} (the world behind the UI)`);
    else S.background = s.background;
  }
  if ('note' in s) { if (typeof s.note !== 'string' || !s.note.trim()) R.err('/note', 'note is a non-empty string (English)'); else S.note = s.note; }
  if ('states' in s) {
    if (!Array.isArray(s.states) || !s.states.length) R.err('/states', 'states is a non-empty list of {id, label, note?}');
    else s.states.forEach((st, i) => {
      const P = ptr('/states', i);
      if (!isObj(st)) { R.err(P, 'a state is {id, label, note?}'); return; }
      for (const k of Object.keys(st)) if (!['id', 'label', 'note'].includes(k)) R.err(ptr(P, k), `unknown field ${k} (a state has id, label, note)`);
      if (typeof st.id !== 'string' || !STATE_ID_RE.test(st.id)) { R.err(ptr(P, 'id'), 'a state id is lower-case letters, digits and dashes'); return; }
      if (S.stateIds.includes(st.id)) { R.err(ptr(P, 'id'), `state ${st.id} is declared twice`); return; }
      if (typeof st.label !== 'string' || !st.label.trim()) R.err(ptr(P, 'label'), 'label is the state\'s short Ukrainian name for the page');
      if ('note' in st && (typeof st.note !== 'string' || !st.note.trim())) R.err(ptr(P, 'note'), 'note is a non-empty string (English)');
      S.stateIds.push(st.id);
      S.states.push({ id: st.id, label: String(st.label || ''), note: st.note || null });
    });
  }
  if ('nodes' in s) {
    if (!Array.isArray(s.nodes) || !s.nodes.length) R.err('/nodes', 'nodes is a non-empty list of the screen\'s root nodes');
    else S.roots = buildChildren(s.nodes, '/nodes', null, 'anchored', S, C, R);
  }
  if (R.list.length) return { errors: R.list, screen: null };
  for (const st of S.stateIds) {
    for (const n of S.all) if (n.eff.has(st)) checkContent(n, st, S, C, R);
    checkContext(S.roots, st, { name: null, context: 'dark' }, C, R);
    if (!S.roots.some((n) => n.eff.has(st))) R.err('/states', `nothing is visible in state ${st}`);
  }
  for (const n of S.roots) checkRootRect(n, S, C, R);
  return { errors: R.list, screen: R.list.length ? null : S };
}

function buildChildren(list, P, parent, place, S, C, R) {
  const out = [];
  const names = new Set();
  list.forEach((raw, i) => {
    const n = buildNode(raw, ptr(P, i), parent, place, S, C, R);
    if (!n) return;
    if (names.has(n.name)) R.err(ptr(P, i, 'name'), `a sibling is already named ${n.name}; sibling names are unique (they make the node paths)`);
    names.add(n.name);
    out.push(n);
  });
  return out;
}

function buildNode(raw, P, parent, place, S, C, R) {
  if (!isObj(raw)) { R.err(P, 'a node is a JSON object'); return null; }
  const type = raw.type;
  if (typeof type !== 'string' || !GODOT[type]) { R.err(ptr(P, 'type'), `unknown type ${q(type)}; the renderer draws ${Object.keys(GODOT).join(', ')}`); return null; }
  const G = GODOT[type];
  const where = parent ? `a ${parent.type}` : 'the frame';
  const allowed = new Set([...COMMON_FIELDS, ...G.fields, ...(G.holds ? ['children'] : []),
    ...(place === 'anchored' ? ANCHOR_FIELDS : place === 'center' ? [] : place === 'vbox' || place === 'hbox' ? FLAG_FIELDS : FLAG_FIELDS.slice(0, 2))]);
  for (const k of Object.keys(raw)) {
    if (allowed.has(k)) continue;
    if (ANCHOR_FIELDS.includes(k)) R.err(ptr(P, k), `${k} works only on a node placed by anchors (a root, or a child of a Control, Panel or Button); this node is inside ${where}, which places it: use size flags`);
    else if (k === 'size_flags_stretch_ratio' && place !== 'anchored' && place !== 'center') R.err(ptr(P, k), 'size_flags_stretch_ratio matters only inside a VBoxContainer or HBoxContainer');
    else if (FLAG_FIELDS.includes(k)) R.err(ptr(P, k), place === 'center' ? 'a CenterContainer ignores size flags: it keeps its children at their minimum size, centred' : `size flags work only inside a container; this node is placed by anchors in ${where}`);
    else if (k === 'children') R.err(ptr(P, k), `a ${type} holds no children in this renderer`);
    else R.err(ptr(P, k), `unknown field ${k} for a ${type} (allowed: ${[...allowed].join(', ')})`);
  }
  if (typeof raw.name !== 'string' || !NAME_RE.test(raw.name)) { R.err(ptr(P, 'name'), 'name is a Godot node name: a letter, then letters, digits or _'); return null; }
  const n = {
    name: raw.name, type, G, ptr: P, parent, place, raw, children: [], per: {},
    path: `${parent ? parent.path : S.id}/${raw.name}`, depth: parent ? parent.depth + 1 : 0,
  };
  S.all.push(n);
  const parentEff = parent ? parent.eff : new Set(S.stateIds);
  n.eff = new Set(parentEff);
  if ('states' in raw) {
    if (!Array.isArray(raw.states) || !raw.states.length || raw.states.some((x) => typeof x !== 'string')) R.err(ptr(P, 'states'), 'states lists the state ids this node is visible in');
    else {
      const own = new Set();
      raw.states.forEach((st, i) => {
        if (!S.stateIds.includes(st)) R.err(ptr(P, 'states', i), `${q(st)} is not a declared state (${S.stateIds.join(', ')})`);
        else if (!parentEff.has(st)) R.err(ptr(P, 'states', i), `visible in ${st}, where its parent ${parent.path} is hidden`);
        else if (own.has(st)) R.err(ptr(P, 'states', i), `${st} is listed twice`);
        own.add(st);
      });
      n.eff = new Set([...own].filter((st) => parentEff.has(st)));
      n.states = [...n.eff];
    }
  }
  for (const f of [...G.fields, 'variation', 'note']) {
    if (!(f in raw)) continue;
    const p = fieldProblem(type, f, raw[f]);
    if (p) R.err(ptr(P, f), p);
  }
  if ('per_state' in raw) {
    if (!isObj(raw.per_state)) R.err(ptr(P, 'per_state'), 'per_state is {state id: {field: value}}');
    else for (const [st, o] of Object.entries(raw.per_state)) {
      const PS = ptr(P, 'per_state', st);
      if (!S.stateIds.includes(st)) { R.err(PS, `${q(st)} is not a declared state (${S.stateIds.join(', ')})`); continue; }
      if (!n.eff.has(st)) { R.err(PS, `the node is not visible in ${st}`); continue; }
      if (!isObj(o)) { R.err(PS, 'a per_state entry is {field: value}'); continue; }
      for (const [f, v] of Object.entries(o)) {
        if (!PER_STATE_FIELDS.includes(f) || !(f === 'variation' || G.fields.includes(f))) {
          R.err(ptr(PS, f), `${f} cannot change per state on a ${type} (per_state takes ${PER_STATE_FIELDS.filter((x) => x === 'variation' || G.fields.includes(x)).join(', ')})`);
          continue;
        }
        const p = fieldProblem(type, f, v);
        if (p) R.err(ptr(PS, f), p);
      }
      n.per[st] = { ptr: PS, raw: o };
    }
  }
  if ('custom_minimum_size' in raw) {
    const v = raw.custom_minimum_size;
    if (!Array.isArray(v) || v.length !== 2 || !v.every((x) => isNum(x) && x >= 0 && x <= 4000)) R.err(ptr(P, 'custom_minimum_size'), 'custom_minimum_size is [width, height] in reference px, each 0 or more');
  }
  n.cmin = Array.isArray(raw.custom_minimum_size) && raw.custom_minimum_size.length === 2 ? raw.custom_minimum_size.map((x) => (isNum(x) ? x : 0)) : [0, 0];
  if (place === 'anchored') {
    const preset = raw.anchors_preset === undefined ? 'top_left' : raw.anchors_preset;
    if (!PRESETS[preset]) R.err(ptr(P, 'anchors_preset'), `anchors_preset is a Godot LayoutPreset name: ${Object.keys(PRESETS).join(', ')}`);
    const pr = PRESETS[preset] || PRESETS.top_left;
    const o = ['offset_left', 'offset_top', 'offset_right', 'offset_bottom'].map((f) => {
      if (!(f in raw)) return 0;
      if (!isNum(raw[f]) || Math.abs(raw[f]) > 4000) { R.err(ptr(P, f), `${f} is a number of reference px`); return 0; }
      return raw[f];
    });
    const grow = ['grow_horizontal', 'grow_vertical'].map((f, i) => {
      if (!(f in raw)) return pr[4 + i];
      if (!GROWS.includes(raw[f])) { R.err(ptr(P, f), `${f} is begin, end or both`); return pr[4 + i]; }
      return raw[f];
    });
    n.anchor = { preset, a: pr.slice(0, 4), o, grow };
  } else if (place !== 'center') {
    const flag = (f) => {
      if (!(f in raw)) return 'fill';
      if (!FLAGS[raw[f]]) { R.err(ptr(P, f), `${f} is one of ${Object.keys(FLAGS).join(', ')}`); return 'fill'; }
      return raw[f];
    };
    n.flags = { h: flag('size_flags_horizontal'), v: flag('size_flags_vertical'), ratio: 1 };
    if ('size_flags_stretch_ratio' in raw) {
      if (!isNum(raw.size_flags_stretch_ratio) || raw.size_flags_stretch_ratio <= 0) R.err(ptr(P, 'size_flags_stretch_ratio'), 'size_flags_stretch_ratio is a number above 0');
      else n.flags.ratio = raw.size_flags_stretch_ratio;
      const axis = place === 'vbox' ? 'v' : 'h';
      if (!FLAGS[n.flags[axis]][0]) R.err(ptr(P, 'size_flags_stretch_ratio'), `a stretch ratio needs an expand flag on size_flags_${axis === 'v' ? 'vertical' : 'horizontal'}`);
    }
  }
  if (G.holds && 'children' in raw) {
    if (!Array.isArray(raw.children)) R.err(ptr(P, 'children'), 'children is a list of nodes');
    else n.children = buildChildren(raw.children, ptr(P, 'children'), n, G.holds, S, C, R);
  }
  return n;
}

// The node's fields in one state: its own, with that state's per_state values over them, and Godot's defaults under.
function merged(n, st) {
  const p = {};
  for (const f of n.G.fields) if (f in DEFAULTS) p[f] = DEFAULTS[f];
  for (const f of [...n.G.fields, 'variation']) if (f in n.raw) p[f] = n.raw[f];
  if (n.type === 'Button' && !('alignment' in n.raw)) p.alignment = 'center';
  if (n.type === 'VBoxContainer' || n.type === 'HBoxContainer') if (!('alignment' in n.raw)) p.alignment = 'begin';
  const o = n.per[st];
  if (o) for (const [f, v] of Object.entries(o.raw)) p[f] = v;
  return p;
}
const fieldAt = (n, st, f) => (n.per[st] && f in n.per[st].raw ? ptr(n.per[st].ptr, f) : ptr(n.ptr, f));
// The variation drawn in a state: a toggle shown selected draws the pack's toggle.selected.
function drawnVariation(C, n, p) {
  if (!p.variation) return null;
  const v = C.pack.variations[p.variation];
  if (v && n.type === 'Button' && BUTTON_STATES[p.state] && BUTTON_STATES[p.state][0] && v.toggle) return v.toggle.selected;
  return p.variation;
}

function checkText(n, st, p, C, R) {
  const at = (f) => fieldAt(n, st, f);
  const e = C.byKey.get(p.key);
  if (!e) { R.err(at('key'), `${q(p.key)} is not a key of copy/strings.csv (texts come only from the deck)`); return; }
  const phs = placeholdersOf(e.en[0]);
  if (e.plural && !isInt(p.count)) R.err(at('key'), `${p.key} is a plural key: give count (tr_n picks the form)`);
  if (!e.plural && 'count' in p) R.err(at('count'), `${p.key} is not a plural key; a {count} sample goes in args`);
  const args = isObj(p.args) ? p.args : {};
  for (const k of Object.keys(args)) {
    if (!phs.includes(k)) R.err(ptr(at('args'), k), `${p.key} has no placeholder {${k}} (it has ${phs.length ? phs.map((x) => `{${x}}`).join(', ') : 'none'})`);
    else if (k === 'count' && e.plural) R.err(ptr(at('args'), k), `{count} of a plural key comes from count`);
  }
  if ('piece' in p && 'value_of' in p) R.err(at('piece'), 'a node draws either a piece of the text or the value of one placeholder, not both');
  let need = phs;
  if ('value_of' in p) {
    if (!phs.includes(p.value_of)) R.err(at('value_of'), `${p.key} has no placeholder {${p.value_of}}`);
    need = [p.value_of];
  } else if ('piece' in p) {
    const forms = [...e.en, ...e.uk].filter(Boolean);
    const parts = forms.map((f) => f.split(SPLIT_RE));
    if (!phs.some((x) => SPLIT.includes(x))) R.err(at('piece'), `${p.key} has no {${SPLIT.join('} or {')}} to split at`);
    else if (parts.some((x) => p.piece >= x.length)) R.err(at('piece'), `${p.key} splits into ${parts[0].length} pieces; piece counts from 0`);
    else need = [...new Set(parts.flatMap((x) => placeholdersOf(x[p.piece])))];
  }
  for (const k of need) {
    if (k === 'count' && e.plural) continue;
    if (!(k in args)) R.err(at('args'), `{${k}} of ${p.key} has no sample value: add args.${k}`);
  }
}

function checkIcon(n, st, p, C, R) {
  const ic = C.icons.get(p.icon);
  if (!ic) R.err(fieldAt(n, st, 'icon'), `no icon ${q(p.icon)}; the icons are ${[...C.icons.keys()].join(', ')}`);
  else if (!ic.licence) R.err(fieldAt(n, st, 'icon'), `${ic.file} has no licence record (own work, OFL, CC0, MIT, ISC or Apache-2.0) in its LICENCES.json`);
}

function checkContent(n, st, S, C, R) {
  const p = merged(n, st);
  const at = (f) => fieldAt(n, st, f);
  const T = n.type;
  if (n.G.themed && !p.variation) R.err(n.ptr, `a ${T} draws only through a Toy variation: add variation (its theme_type_variation)`);
  let v = null;
  if (p.variation) {
    v = C.pack.variations[p.variation];
    if (!v) R.err(at('variation'), `${p.variation} is not a variation of the pack (${PACK})`);
    else if (v.abstract) R.err(at('variation'), `${p.variation} is abstract; use one of its concrete variations`);
    else if (!n.G.chain.includes(v.class)) R.err(at('variation'), `${p.variation} is a ${v.class} variation; a ${T} takes variations of ${n.G.chain.join(', ')}`);
    else if (C.selectedOf.has(p.variation)) R.err(at('variation'), `${p.variation} is the selected half of the toggle ${C.selectedOf.get(p.variation)}: name ${C.selectedOf.get(p.variation)} and show it with state "selected" (ToyToggle swaps the variation)`);
    if (v && v.abstract) v = null;
  }
  if (p.wide) {
    if (!v || !(C.pack.tokens[`${v.prefix}.size.wide-width`] || C.pack.tokens[`${v.prefix}.size.wide-min-width`])) R.err(at('wide'), `${p.variation || 'this node'} has no wide size (wide-width or wide-min-width)`);
  }
  if (T === 'Label') {
    if (!('key' in p)) R.err(n.ptr, 'a Label draws a deck key: add key');
    else checkText(n, st, p, C, R);
    if (p.autowrap_mode !== 'off' && !(n.cmin[0] > 0)) R.err(ptr(n.ptr, 'autowrap_mode'), 'an autowrapping Label has no width of its own in Godot: give custom_minimum_size a width');
  }
  if (T === 'Button') {
    if (!('key' in p) && !('icon' in p)) R.err(n.ptr, 'a Button draws a key, an icon or both');
    if ('key' in p) checkText(n, st, p, C, R);
    if (BUTTON_STATES[p.state] && BUTTON_STATES[p.state][0]) {
      if (p.toggle_mode !== true) R.err(at('state'), `${p.state} is a toggle's state: set toggle_mode true`);
      else if (v && !v.toggle) R.err(at('state'), `${p.variation} has no selected look (no toggle in the pack)`);
    }
    if (p.toggle_mode === true && v && !v.toggle) R.err(ptr(n.ptr, 'toggle_mode'), `${p.variation} is not a toggle variation (the pack gives it no toggle.selected)`);
    if ('icon_size' in p && !('icon' in p)) R.err(ptr(n.ptr, 'icon_size'), 'icon_size without an icon');
  }
  if (T === 'Button' || T === 'TextureRect') {
    if ('icon' in p) checkIcon(n, st, p, C, R);
    else if (T === 'TextureRect') R.err(n.ptr, 'a TextureRect draws an icon: add icon');
  }
  if (T === 'TextureRect' && !(n.cmin[0] > 0 && n.cmin[1] > 0)) R.err(n.ptr, 'a TextureRect is sized by custom_minimum_size (expand_mode ignore_size): give both a width and a height');
  if (T === 'OptionButton') {
    const arrow = C.icons.get(ARROW_ICON);
    if (!arrow || !arrow.licence) R.err(n.ptr, `an OptionButton draws its arrow with pages/components/icons/${ARROW_ICON}.svg, which is missing or has no licence record`);
    if (!('key' in p)) R.err(n.ptr, 'an OptionButton shows its selected item: add key');
    else checkText(n, st, p, C, R);
    if (Array.isArray(p.items)) {
      p.items.forEach((k, i) => { if (!C.byKey.has(k)) R.err(ptr(at('items'), i), `${q(k)} is not a key of copy/strings.csv`); });
      if ('key' in p && !p.items.includes(p.key)) R.err(at('items'), `items does not include the shown key ${p.key}`);
    }
  }
  if (T === 'LineEdit') {
    if (!('text' in p) && !('placeholder' in p)) R.err(n.ptr, 'a LineEdit shows a sample text or a placeholder key');
    if ('placeholder' in p) {
      const e = C.byKey.get(p.placeholder);
      if (!e) R.err(at('placeholder'), `${q(p.placeholder)} is not a key of copy/strings.csv`);
      else if (placeholdersOf(e.en[0]).length || e.plural) R.err(at('placeholder'), `${p.placeholder} has placeholders or plural forms; a placeholder_text cannot fill them`);
    }
  }
  if (T === 'ProgressBar') {
    if (p.show_percentage !== false) R.err(n.ptr, 'show_percentage is true by Godot\'s default and draws a percentage that is not in the deck: set "show_percentage": false');
    if (isNum(p.value) && isNum(p.max_value) && p.value > p.max_value) R.err(at('value'), `value ${p.value} is above max_value ${p.max_value}`);
  }
}

// The context rule (the header comment).
function checkContext(nodes, st, surface, C, R) {
  for (const n of nodes) {
    if (!n.eff.has(st)) continue;
    const p = merged(n, st);
    const name = drawnVariation(C, n, p);
    const v = name ? C.pack.variations[name] : null;
    if (v && TEXT_CLASSES.has(v.class)) {
      const on = surface.name ? `${surface.name} (${surface.context})` : 'the world (dark)';
      if (Array.isArray(v.on) && v.on.length) {
        if (!v.on.includes(surface.name)) R.err(fieldAt(n, st, 'variation'), `in ${st}: ${name} sits only on ${v.on.join(', ')} (its pack hint); here it sits on ${on}`);
      } else if ((v.context === 'dark' || v.context === 'light') && v.context !== surface.context) {
        R.err(fieldAt(n, st, 'variation'), `in ${st}: ${name} is a ${v.context}-context variation on ${on}: use its ${surface.context} counterpart`);
      }
    }
    if (n.type === 'TextureRect' && p.theme_color) {
      // A tint is a colour item of the surface the icon sits on (ToyMic's icon-on and icon-off).
      const sv = surface.name ? C.pack.variations[surface.name] : null;
      if (!sv || !C.pack.tokens[`${sv.prefix}.items.${p.theme_color}`]) {
        R.err(fieldAt(n, st, 'theme_color'), `in ${st}: ${surface.name || 'the world'} has no colour item ${p.theme_color} to tint this icon with`);
      }
    }
    const isSurface = v && (SURFACES.has(v.class) || n.children.length);
    const next = isSurface ? { name, context: v.context === 'any' ? surface.context : v.context } : surface;
    checkContext(n.children, st, next, C, R);
  }
}

// The size Godot cannot shrink below, as far as the build knows it: custom_minimum_size and the variation's size
// constants (content sizes are the fit tool's to measure).
function fixedSize(n, p, C) {
  const v = p.variation ? C.pack.variations[drawnVariation(C, n, p)] : null;
  const w = Math.max(n.cmin[0], packPx(C, v, p.wide ? 'size.wide-width' : 'size.width'), packPx(C, v, p.wide ? 'size.wide-min-width' : 'size.min-width'));
  const h = Math.max(n.cmin[1], packPx(C, v, 'size.height'));
  return [w, h];
}
function anchorRect(n, size, frameW, frameH) {
  const { a, o, grow } = n.anchor;
  const axis = (a0, a1, o0, o1, full, min, g) => {
    const lo = a0 * full + o0, hi = a1 * full + o1;
    const len = Math.max(hi - lo, min);
    const start = g === 'end' ? lo : g === 'begin' ? hi - len : (lo + hi) / 2 - len / 2;
    return { start, len };
  };
  return { x: axis(a[0], a[2], o[0], o[2], frameW, size[0], grow[0]), y: axis(a[1], a[3], o[1], o[3], frameH, size[1], grow[1]) };
}
function checkRootRect(n, S, C, R) {
  for (const st of S.stateIds) {
    if (!n.eff.has(st)) continue;
    const r = anchorRect(n, fixedSize(n, merged(n, st), C), W, H);
    for (const [ax, full, f] of [['x', W, 'width'], ['y', H, 'height']]) {
      const s = r[ax];
      if (s.len > 0 && (s.start < 0 || s.start + s.len > full)) {
        R.err(n.ptr, `its ${f} of ${fmt(s.len)} px spans ${ax} ${fmt(s.start)} to ${fmt(s.start + s.len)}, outside the ${W}x${H} frame`);
      }
    }
  }
}

function validateAll(sources, C) {
  const errors = [];
  const screens = [];
  for (const src of sources) {
    const r = validateScreen(src, C);
    errors.push(...r.errors);
    if (r.screen) screens.push(r.screen);
  }
  return { errors, screens };
}

// ---------------------------------------------------------------------------------------------------------------
// Texts.

function textOf(C, p, lang) {
  const e = C.byKey.get(p.key);
  const args = isObj(p.args) ? p.args : {};
  if (p.value_of) return sampleText(args[p.value_of], lang);
  let s = e.plural ? e[lang][lang === 'uk' ? D.ukForm(p.count) : (p.count === 1 ? 0 : 1)] : e[lang][0];
  if (isInt(p.piece)) s = s.split(SPLIT_RE)[p.piece];
  return s.replace(PH_RE, (m, k) => (k === 'count' && e.plural ? String(p.count) : k in args ? sampleText(args[k], lang) : m));
}
// The page shows Ukrainian first; page.js swaps every [data-en] element's text for the language switch.
const textAttrs = (uk, en) => ` data-en="${esc(en)}"`;

// ---------------------------------------------------------------------------------------------------------------
// The page.

function renderNode(n, st, S, C, ctx) {
  if (!n.eff.has(st)) return '';
  const p = merged(n, st);
  const name = drawnVariation(C, n, p);
  const v = name ? C.pack.variations[name] : null;
  const cls = ['gd-node', `gd-${n.type}`];
  if (name) { cls.push(`tv-${name}`); ctx.used.add(name); }
  if (p.wide) cls.push('tv-wide');
  if (p.theme_color) cls.push(TINTS[p.theme_color]);
  if (n.type === 'Button' && BUTTON_STATES[p.state][1]) cls.push(BUTTON_STATES[p.state][1]);
  if (n.type === 'OptionButton' && p.state !== 'normal') cls.push({ hover: 'is-hover', held: 'is-held', disabled: 'is-disabled', focus: 'is-focus' }[p.state]);
  if (n.type === 'LineEdit') { if (p.state === 'focus') cls.push('is-focus'); if (p.editable === false) cls.push('is-readonly'); }
  const attrs = [`class="${cls.join(' ')}"`, `data-node="${esc(n.path)}"`, `data-type="${n.type}"`];
  if (name) attrs.push(`data-variation="${name}"`);
  if (v && SURFACES.has(v.class) && (v.context === 'dark' || v.context === 'light')) attrs.push(`data-context="${v.context}"`);
  let inner = '';
  const kids = () => n.children.map((c) => renderNode(c, st, S, C, ctx)).join('');
  const textSpan = (extra) => {
    const uk = textOf(C, p, 'uk'), en = textOf(C, p, 'en');
    return `<span data-key="${esc(p.key)}"${extra || ''}${textAttrs(uk, en)}>${esc(uk)}</span>`;
  };
  const icon = (ic) => `<span class="gd-icon tv-icon">${ic.svg}</span>`;
  switch (n.type) {
    case 'Label': {
      const uk = textOf(C, p, 'uk'), en = textOf(C, p, 'en');
      attrs.push(`data-key="${esc(p.key)}"`);
      if (isInt(p.piece)) attrs.push(`data-piece="${p.piece}"`);
      if (p.value_of) attrs.push(`data-value-of="${esc(p.value_of)}"`);
      attrs.push(textAttrs(uk, en).trim());
      inner = esc(uk);
      break;
    }
    case 'Button':
      inner = (p.icon ? icon(C.icons.get(p.icon)) : '') + (p.key ? textSpan() : '') + '<span class="tv-focus"></span>' + kids();
      break;
    case 'OptionButton':
      inner = `${textSpan()}<span class="gd-arrow tv-arrow">${C.icons.get(ARROW_ICON).svg}</span><span class="tv-focus"></span>`;
      break;
    case 'LineEdit':
      if ('text' in p) {
        const uk = sampleText(p.text, 'uk'), en = sampleText(p.text, 'en');
        inner = `<span class="gd-text"${textAttrs(uk, en)}>${esc(uk)}</span>`;
      } else {
        const e = C.byKey.get(p.placeholder);
        inner = `<span class="tv-placeholder" data-key="${esc(p.placeholder)}"${textAttrs(e.uk[0], e.en[0])}>${esc(e.uk[0])}</span>`;
      }
      if (p.state === 'focus') inner += '<span class="tv-caret gd-caret"></span>';
      inner += '<span class="tv-focus"></span>';
      break;
    case 'ProgressBar': {
      const f = Math.min(1, Math.max(0, p.value / p.max_value));
      const steps = v && C.pack.tokens[`${v.prefix}.ramp.steps`];
      if (steps) attrs.push(`data-step="${String(Math.min(steps.value, Math.max(0, Math.floor(f * steps.value + 0.5)))).padStart(2, '0')}"`);
      attrs.push(`style="--value: ${fmt(f)}"`);
      inner = '<i class="tv-fill"></i>';
      break;
    }
    case 'TextureRect':
      inner = C.icons.get(p.icon).svg;
      break;
    default:
      inner = kids();
  }
  const el = `<div ${attrs.join(' ')}>${inner}</div>`;
  return n.place === 'anchored' ? `<div class="gd-anchor" data-anchor="${esc(n.path)}">${el}</div>` : el;
}

// The layout CSS: the fixed container rules, then one rule per node (and per state where a container's tracks differ).
const LAYOUT_HEAD = `/* Generated by pages/screens/build.js: Godot 4.7.2 containers emulated in CSS (lint profile layout). Do not edit. */
.gd-node { box-sizing: border-box; position: relative; }
.gd-Control, .gd-Panel, .gd-ProgressBar { display: block; }
.gd-PanelContainer, .gd-MarginContainer, .gd-CenterContainer { display: grid; }
.gd-TextureRect { display: grid; contain: size; }
.gd-VBoxContainer { display: grid; grid-auto-flow: row; grid-template-columns: 1fr; row-gap: calc(4 * var(--px)); align-content: start; }
.gd-HBoxContainer { display: grid; grid-auto-flow: column; grid-template-rows: 1fr; column-gap: calc(4 * var(--px)); justify-content: start; }
.gd-GridContainer { display: grid; column-gap: calc(4 * var(--px)); row-gap: calc(4 * var(--px)); justify-content: start; align-content: start; }
.gd-Label { display: flex; flex-direction: column; justify-content: flex-start; white-space: nowrap; text-align: left; }
.gd-Button { display: flex; align-items: center; justify-content: center; white-space: nowrap; }
.gd-OptionButton { display: flex; align-items: center; justify-content: space-between; white-space: nowrap; }
.gd-LineEdit { display: flex; align-items: center; white-space: nowrap; overflow: hidden; contain: inline-size; }
.gd-icon { display: grid; flex: none; }
.gd-arrow { display: grid; flex: none; }
.gd-caret { display: block; flex: none; align-self: stretch; width: calc(2 * var(--px)); }
.gd-anchor { position: absolute; display: flex; pointer-events: none; }
`;
const len = (x) => (x === 0 ? '0' : `calc(${fmt(x)} * var(--px))`);
const pctLen = (pct, x) => {
  const P = fmt(pct * 100);
  if (pct === 0) return len(x);
  if (Math.abs(x) < 0.005) return `${P}%`;
  return `calc(${P}% ${x < 0 ? '-' : '+'} ${fmt(Math.abs(x))} * var(--px))`;
};

// Godot lets a rect have a negative size (offset_right left of offset_left) and then places the minimum size by the grow
// direction; a CSS box cannot be negative, so a point anchor's rect becomes the zero-width rect Godot grows from.
function cssOffsets(anchor) {
  const { a, o, grow } = anchor;
  const out = o.slice();
  for (const i of [0, 1]) {
    if (a[i] !== a[i + 2] || o[i + 2] >= o[i]) continue;
    const x = grow[i] === 'end' ? o[i] : grow[i] === 'begin' ? o[i + 2] : (o[i] + o[i + 2]) / 2;
    out[i] = x;
    out[i + 2] = x;
  }
  return out;
}

function borderOf(C, n) {
  // The parent's border widths (its normal or panel StyleBox), so that anchors count from its rect, not from inside
  // its border (CSS absolute positions count from the padding box).
  if (!n || !n.raw.variation) return [0, 0, 0, 0];
  const v = C.pack.variations[n.raw.variation];
  if (!v) return [0, 0, 0, 0];
  const rec = v.styleboxes.includes('panel') ? 'panel' : v.styleboxes.includes('normal') ? 'normal' : null;
  if (!rec) return [0, 0, 0, 0];
  return ['left', 'top', 'right', 'bottom'].map((s) => packPx(C, v, `${rec}.border-width-${s}`));
}

function tracksFor(n, st) {
  const kids = n.children.filter((c) => c.eff.has(st));
  if (!kids.length) return null;
  if (n.type === 'VBoxContainer' || n.type === 'HBoxContainer') {
    const ax = n.type === 'VBoxContainer' ? 'v' : 'h';
    return { [n.type === 'VBoxContainer' ? 'grid-template-rows' : 'grid-template-columns']: kids.map((c) => (FLAGS[c.flags[ax]][0] ? `${fmt(c.flags.ratio)}fr` : 'auto')).join(' ') };
  }
  const cols = merged(n, st).columns;
  const colX = new Array(Math.min(cols, kids.length)).fill(false);
  const rowX = new Array(Math.ceil(kids.length / cols)).fill(false);
  kids.forEach((c, i) => {
    if (FLAGS[c.flags.h][0]) colX[i % cols] = true;
    if (FLAGS[c.flags.v][0]) rowX[Math.floor(i / cols)] = true;
  });
  return {
    'grid-template-columns': colX.map((x) => (x ? '1fr' : 'auto')).join(' '),
    'grid-template-rows': rowX.map((x) => (x ? '1fr' : 'auto')).join(' '),
  };
}

function layoutCss(screens, C) {
  const out = [LAYOUT_HEAD.replace(/\n$/, '')];
  const arrow = C.icons.get(ARROW_ICON);
  if (arrow) out.push(`.gd-arrow { width: ${len(arrow.w)}; height: ${len(arrow.h)}; }`);
  const rule = (sel, decls) => { if (decls.size) out.push(`${sel} { ${[...decls].map(([k, x]) => `${k}: ${x};`).join(' ')} }`); };
  for (const S of screens) {
    out.push(`/* ${S.id}: ${S.title} */`);
    for (const n of S.all) {
      const sel = `[data-node="${n.path}"]`;
      const own = new Map();
      const raw = n.raw;
      const p = merged(n, S.stateIds.find((st) => n.eff.has(st)) || S.stateIds[0]);
      const v = p.variation ? C.pack.variations[p.variation] : null;
      // The variation's own min-width (keycaps) stays when this rule sets min-width too.
      const compMin = packPx(C, v, p.wide ? 'size.wide-min-width' : 'size.min-width');
      const minW = n.place === 'anchored' || n.cmin[0] > 0 ? Math.max(n.cmin[0], compMin) : 0;
      if (n.place === 'anchored') {
        const b = borderOf(C, n.parent);
        const { a, grow } = n.anchor;
        const o = cssOffsets(n.anchor);
        const wrap = new Map([
          ['left', pctLen(a[0], a[0] * (b[0] + b[2]) - b[0] + o[0])],
          ['top', pctLen(a[1], a[1] * (b[1] + b[3]) - b[1] + o[1])],
          ['right', pctLen(1 - a[2], (1 - a[2]) * (b[0] + b[2]) - b[2] - o[2])],
          ['bottom', pctLen(1 - a[3], (1 - a[3]) * (b[1] + b[3]) - b[3] - o[3])],
          ['justify-content', GROW_FLEX[grow[0]]],
          ['align-items', GROW_FLEX[grow[1]]],
        ]);
        rule(`[data-anchor="${n.path}"]`, wrap);
        own.set('flex', 'none');
        own.set('min-width', minW > 0 ? `max(100%, ${len(minW)})` : '100%');
        own.set('min-height', n.cmin[1] > 0 ? `max(100%, ${len(n.cmin[1])})` : '100%');
      } else {
        if (minW > 0) own.set('min-width', len(minW));
        if (n.cmin[1] > 0) own.set('min-height', len(n.cmin[1]));
        if (n.place === 'stack' || n.place === 'center') own.set('grid-area', '1 / 1');
        if (n.place === 'center') { own.set('justify-self', 'center'); own.set('align-self', 'center'); }
        else {
          // fill is the grid default (stretch); only shrink positions are written.
          if (n.flags.h !== 'fill' && n.flags.h !== 'expand_fill') own.set('justify-self', FLAGS[n.flags.h][1]);
          if (n.flags.v !== 'fill' && n.flags.v !== 'expand_fill') own.set('align-self', FLAGS[n.flags.v][1]);
        }
      }
      if (n.type === 'VBoxContainer' || n.type === 'HBoxContainer') {
        const vb = n.type === 'VBoxContainer';
        if (p.separation !== DEFAULTS.separation) own.set(vb ? 'row-gap' : 'column-gap', len(p.separation));
        if (p.alignment !== 'begin') own.set(vb ? 'align-content' : 'justify-content', p.alignment === 'center' ? 'center' : 'end');
      }
      if (n.type === 'GridContainer') {
        if (p.h_separation !== DEFAULTS.h_separation) own.set('column-gap', len(p.h_separation));
        if (p.v_separation !== DEFAULTS.v_separation) own.set('row-gap', len(p.v_separation));
      }
      if (n.type === 'MarginContainer') {
        for (const s of ['top', 'right', 'bottom', 'left']) if (p[`margin_${s}`]) own.set(`padding-${s}`, len(p[`margin_${s}`]));
      }
      if (n.type === 'Label') {
        if (p.horizontal_alignment !== 'left') own.set('text-align', p.horizontal_alignment === 'fill' ? 'justify' : p.horizontal_alignment);
        if (p.vertical_alignment === 'center') own.set('justify-content', 'center');
        if (p.vertical_alignment === 'bottom') own.set('justify-content', 'flex-end');
        if (p.autowrap_mode !== 'off') {
          own.set('white-space', 'normal');
          own.set('contain', 'inline-size');
          if (p.autowrap_mode === 'arbitrary') own.set('overflow-wrap', 'anywhere');
        }
      }
      if (n.type === 'Button' || n.type === 'OptionButton') {
        if (n.type === 'Button' && p.alignment !== 'center') own.set('justify-content', p.alignment === 'left' ? 'flex-start' : 'flex-end');
        // h_separation: the node's override, else the variation's theme constant (in the components CSS), else Godot's 4.
        if ('h_separation' in raw) own.set('column-gap', len(raw.h_separation));
        else if (!(v && C.pack.tokens[`${v.prefix}.items.h-separation`])) own.set('column-gap', len(DEFAULTS.h_separation));
      }
      // Track lists per state (a hidden child takes no track, as in Godot): the most common list joins the node's
      // rule, the others are qualified by the frame's state.
      const others = [];
      if (n.type === 'VBoxContainer' || n.type === 'HBoxContainer' || n.type === 'GridContainer') {
        const groups = new Map();
        for (const st of S.stateIds) {
          if (!n.eff.has(st)) continue;
          const t = tracksFor(n, st);
          if (!t) continue;
          const k = JSON.stringify(t);
          if (!groups.has(k)) groups.set(k, []);
          groups.get(k).push(st);
        }
        [...groups].sort((x, y) => y[1].length - x[1].length).forEach(([k, sts], i) => {
          const decls = new Map(Object.entries(JSON.parse(k)));
          if (i === 0) for (const [prop, x] of decls) own.set(prop, x);
          else others.push([sts.map((st) => `.sc-frame[data-state="${st}"] ${sel}`).join(', '), decls]);
        });
      }
      rule(sel, own);
      for (const [osel, decls] of others) rule(osel, decls);
      if (n.type === 'Button' && 'icon' in raw) {
        const ic = C.icons.get(raw.icon);
        const size = raw.icon_size || (ic ? Math.max(ic.w, ic.h) : 24);
        rule(`${sel} > .gd-icon`, new Map([['width', len(size)], ['height', len(size)]]));
      }
    }
  }
  return out.join('\n') + '\n';
}

function uiCss(sys, used, emitComponentsCss) {
  const emitted = emitComponentsCss(sys).replace(/\r\n/g, '\n');
  const blocks = new Map();
  let cur = null;
  for (const l of emitted.split('\n')) {
    const h = /^\/\* (Toy[A-Za-z]+): /.exec(l);
    if (h) { cur = []; blocks.set(h[1], cur); }
    if (cur) cur.push(l);
  }
  const parts = ['/* Generated by pages/screens/build.js from tools/tokens/api.js (pages/components/emit-css.js): the variations the screens draw. Do not edit. */'];
  for (const v of sys.variants) {
    if (!used.has(v.variation)) continue;
    const b = blocks.get(v.variation);
    if (!b) fail(`emit-css: no variation ${v.variation}`);
    while (b.length && !b[b.length - 1].trim()) b.pop();
    parts.push(b.join('\n'));
  }
  return parts.join('\n') + '\n';
}

function renderPage(screens, C, sys, ui, layout) {
  const tokensCss = readText(TOKENS_CSS);
  if (tokensCss !== sys.outputs[TOKENS_CSS]) fail(`${TOKENS_CSS} is stale: run node tools/tokens/build.js`);
  const style = (id, text) => `<style id="${id}">\n${text.replace(/\s+$/, '')}\n</style>`;
  const num = (id) => id.replace(/^s/, '');
  const missing = SCREENS.filter(([id]) => !screens.some((S) => S.id === id)).map(([id]) => num(id));
  const chips = screens.map((S) => `<a class="pg-chip" href="#${S.id}"><b>${num(S.id)}</b> ${esc(C.titles[S.wireframe])}</a>`).join('');
  const seg = (ctl, label, opts) => `<div class="pg-ctl" role="group" aria-label="${esc(label)}"><span class="pg-ctl-label">${esc(label)}</span><div class="pg-seg">`
    + opts.map(([val, text], i) => `<button type="button" data-ctl="${ctl}" data-val="${val}" aria-pressed="${i === 0}">${esc(text)}</button>`).join('') + '</div></div>';
  const sections = screens.map((S) => {
    const tabs = S.states.map((st, i) => `<button type="button" role="tab" class="pg-tab" data-tab="${st.id}" aria-selected="${i === 0}">${esc(st.label)}</button>`).join('');
    const notes = S.states.map((st, i) => (st.note ? `<p class="pg-state-note" lang="en" data-note-for="${st.id}"${i ? ' hidden' : ''}>${esc(st.note)}</p>` : '')).join('');
    const frames = S.states.map((st, i) => {
      const ctx = { used: C.used };
      const body = S.roots.map((n) => renderNode(n, st.id, S, C, ctx)).join('');
      return `<div class="sc-frame" data-screen="${S.id}" data-state="${st.id}" data-context="dark"${i ? ' hidden' : ''}><div class="pg-world pg-world-${S.background}" aria-hidden="true"><i></i><i></i><i></i></div>${body}</div>`;
    }).join('\n');
    return `<section class="pg-screen" id="${S.id}" data-screen-id="${S.id}" aria-labelledby="${S.id}-h">`
      + `<h2 id="${S.id}-h"><span class="pg-num">${num(S.id)}</span> ${esc(C.titles[S.wireframe])} <small lang="en">${esc(S.title)}</small></h2>`
      + `<div class="pg-tabs" role="tablist" aria-label="Стани екрана">${tabs}</div>${notes}`
      + `<div class="pg-stage"><div class="pg-frames">\n${frames}\n</div></div></section>`;
  }).join('\n');
  return [
    '<!doctype html>',
    '<html lang="uk" data-lang="uk" data-text-size="default" data-zoom="fit">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Екрани гри</title>',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${FONT_LINK}">`,
    style('toy-tokens', tokensCss),
    style('screens-ui', ui),
    style('screens-layout', layout),
    style('pg-page', readText('pages/screens/page.css')),
    '</head>',
    '<body>',
    '<main>',
    '<h1>Екрани гри</h1>',
    `<p class="pg-lead">Екрани сесії у стилі Toy, зібрані з компонентів і текстів колоди так, як їх збудує Godot: кожен стан — окремий кадр 1920×1080. ${screens.length ? `Готово: ${screens.length} з ${SCREENS.length}.` : 'Екранів ще немає.'}</p>`,
    '<nav class="pg-bar" id="pg-bar" aria-label="Екрани й вигляд">',
    `<div class="pg-list">${chips}</div>`,
    `<div class="pg-controls">${seg('lang', 'Мова', [['uk', 'UA'], ['en', 'EN']])}${seg('text', 'Текст', [['default', 'Звичайний'], ['large', 'Великий']])}${seg('zoom', 'Масштаб', [['fit', 'По ширині'], ['100', '100 %']])}</div>`,
    '</nav>',
    sections,
    `<footer class="pg-foot">Зібрано з pages/screens/src (${screens.length} ${screens.length === 1 ? 'екран' : 'екранів'}), токенів Toy ${esc(sys.version)} і copy/strings.csv. ${missing.length ? `Ще немає екранів: ${missing.join(', ')}. ` : ''}Світ за інтерфейсом — лише фон сторінки. Для гри: node pages/screens/build.js --handoff &lt;екран&gt;.</footer>`,
    '</main>',
    `<script>\n${readText('pages/screens/page.js').replace(/\s+$/, '')}\n</script>`,
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------------------------------------------
// The Godot handoff (Markdown, the body of a prime-game issue).

function handoff(S, C) {
  const out = [];
  const md = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|');
  const quote = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
  const first = S.stateIds[0];
  function describe(n, st, surface) {
    const p = merged(n, st);
    const name = drawnVariation(C, n, p);
    const v = name ? C.pack.variations[name] : null;
    const bits = [`**${n.name}** \`${n.type}\``];
    if (name) {
      // A toggle keeps its idle variation in the scene; ToyToggle draws the selected one while it is pressed.
      let look = `variation \`${name !== p.variation ? p.variation : name}\``;
      if (v && v.base) {
        const ctx = surface.context;
        const base = v.base.any || v.base[ctx] || v.base.dark;
        look += ` (raised: ToyRaised with base \`${base}\`${n.type === 'Button' ? ', ToyPress; UiParts.button()' : ''})`;
      }
      bits.push(look);
    }
    if (n.place === 'anchored') {
      const { preset, o, grow } = n.anchor;
      bits.push(`anchors \`${preset}\`, offsets ${o.map(fmt).join(', ')} (left, top, right, bottom), grow ${grow[0]}/${grow[1]}`);
    } else if (n.place === 'center') {
      bits.push('centred by its CenterContainer');
    } else {
      const f = [];
      if (n.flags.h !== 'fill') f.push(`horizontal \`${FLAG_GODOT[n.flags.h]}\``);
      if (n.flags.v !== 'fill') f.push(`vertical \`${FLAG_GODOT[n.flags.v]}\``);
      if (n.flags.ratio !== 1) f.push(`stretch_ratio ${fmt(n.flags.ratio)}`);
      if (f.length) bits.push(`size flags ${f.join(', ')}`);
    }
    if (n.cmin[0] || n.cmin[1]) bits.push(`custom_minimum_size (${fmt(n.cmin[0])}, ${fmt(n.cmin[1])})`);
    if (p.wide) bits.push('wide (the variation\'s wide size constant)');
    const T = n.type;
    if (T === 'VBoxContainer' || T === 'HBoxContainer') {
      if (p.separation !== DEFAULTS.separation) bits.push(`theme_override_constants/separation ${p.separation}`);
      if (p.alignment !== 'begin') bits.push(`alignment \`ALIGNMENT_${p.alignment.toUpperCase()}\``);
    }
    if (T === 'GridContainer') {
      bits.push(`columns ${p.columns}`);
      if (p.h_separation !== DEFAULTS.h_separation) bits.push(`theme_override_constants/h_separation ${p.h_separation}`);
      if (p.v_separation !== DEFAULTS.v_separation) bits.push(`theme_override_constants/v_separation ${p.v_separation}`);
    }
    if (T === 'MarginContainer') {
      const m = ['left', 'top', 'right', 'bottom'].filter((s) => p[`margin_${s}`]).map((s) => `margin_${s} ${p[`margin_${s}`]}`);
      if (m.length) bits.push(`theme_override_constants: ${m.join(', ')}`);
    }
    const text = (k) => {
      const e = C.byKey.get(p[k]);
      const how = p.value_of ? `the value of {${p.value_of}} in \`${p.key}\``
        : isInt(p.piece) ? `piece ${p.piece} of \`tr("${p.key}")\` split at ${SPLIT.map((x) => `{${x}}`).join('/')}`
          : e.plural ? `\`tr_n("${p.key}", "${p.key}", ${p.count})\`` : `\`${p.key}\``;
      const args = isObj(p.args) && Object.keys(p.args).length
        ? ` with sample ${Object.entries(p.args).map(([a, x]) => `{${a}} = ${typeof x === 'string' ? quote(x) : `${quote(x.en)} / ${quote(x.uk)}`}`).join(', ')}` : '';
      return `text ${how}${args}: en ${quote(textOf(C, p, 'en'))} · uk ${quote(textOf(C, p, 'uk'))}`;
    };
    if (T === 'Label') {
      bits.push(text('key'));
      if (p.horizontal_alignment !== 'left') bits.push(`horizontal_alignment \`${p.horizontal_alignment.toUpperCase()}\``);
      if (p.vertical_alignment !== 'top') bits.push(`vertical_alignment \`${p.vertical_alignment.toUpperCase()}\``);
      if (p.autowrap_mode !== 'off') bits.push(`autowrap_mode \`AUTOWRAP_${p.autowrap_mode.toUpperCase()}\``);
    }
    if (T === 'Button' || T === 'OptionButton') {
      if (p.key) bits.push(text('key'));
      if (p.icon) {
        const ic = C.icons.get(p.icon);
        bits.push(`icon \`${p.icon}\` (${ic.file}, ${ic.licence}) at ${p.icon_size || Math.max(ic.w, ic.h)} px`);
      }
      if (T === 'Button' && p.alignment !== 'center') bits.push(`alignment \`${p.alignment.toUpperCase()}\``);
      if (T === 'Button' && 'h_separation' in n.raw) bits.push(`theme_override_constants/h_separation ${p.h_separation}`);
      if (T === 'OptionButton') bits.push(`arrow: theme icon \`arrow\` (pages/components/icons/${ARROW_ICON}.svg)`);
      if (T === 'OptionButton' && Array.isArray(p.items)) bits.push(`items ${p.items.map((x) => `\`${x}\``).join(', ')}`);
      if (p.toggle_mode) bits.push(`toggle_mode true, button_pressed ${BUTTON_STATES[p.state][0]}${BUTTON_STATES[p.state][0] ? ` (ToyToggle draws \`${name}\`)` : ''}`);
      const st2 = String(p.state).replace(/^selected-?/, '') || 'normal';
      if (st2 === 'disabled') bits.push('disabled true');
      else if (st2 === 'focus') bits.push('shown with keyboard focus (grab_focus)');
      else if (st2 === 'hover' || st2 === 'held') bits.push(`shown ${st2 === 'hover' ? 'hovered' : 'held down'} (review only)`);
    }
    if (T === 'LineEdit') {
      if ('text' in p) bits.push(`text (sample data) ${typeof p.text === 'string' ? quote(p.text) : `${quote(p.text.en)} / ${quote(p.text.uk)}`}`);
      if (p.placeholder) {
        const e = C.byKey.get(p.placeholder);
        bits.push(`placeholder_text \`${p.placeholder}\`: en ${quote(e.en[0])} · uk ${quote(e.uk[0])}`);
      }
      if (p.editable === false) bits.push('editable false');
      if (p.state === 'focus') bits.push('shown focused with the caret');
    }
    if (T === 'ProgressBar') {
      bits.push(`value ${fmt(p.value)} of max_value ${fmt(p.max_value)}, show_percentage false`);
      const steps = v && C.pack.tokens[`${v.prefix}.ramp.steps`];
      if (steps) {
        const step = Math.min(steps.value, Math.max(0, Math.floor((p.value / p.max_value) * steps.value + 0.5)));
        bits.push(`fill self_modulate = theme colour \`ramp_stop_${String(step).padStart(2, '0')}\` of \`${name}\` (step = clampi(floori(hp * ${steps.value}.0 + 0.5), 0, ${steps.value}))`);
      }
    }
    if (T === 'TextureRect') {
      const ic = C.icons.get(p.icon);
      bits.push(`texture \`${p.icon}\` (${ic.file}, ${ic.licence}), expand_mode \`EXPAND_IGNORE_SIZE\`, stretch_mode \`STRETCH_KEEP_ASPECT_CENTERED\``);
      if (p.theme_color) bits.push(`self_modulate = get_theme_color("${p.theme_color.replace(/-/g, '_')}", "${surface.name}")`);
    }
    return bits;
  }
  // [{n, depth, line}] of the visible tree in a state, with the surface context for the bases.
  function lines(nodes, st, surface, depth, acc) {
    for (const n of nodes) {
      if (!n.eff.has(st)) continue;
      const p = merged(n, st);
      const name = drawnVariation(C, n, p);
      const v = name ? C.pack.variations[name] : null;
      const bits = describe(n, st, surface);
      acc.push({ n, depth, bits, line: bits.join(' · ') });
      const isSurface = v && (SURFACES.has(v.class) || n.children.length);
      lines(n.children, st, isSurface ? { name, context: v.context === 'any' ? surface.context : v.context } : surface, depth + 1, acc);
    }
    return acc;
  }
  const item = (x) => `${'  '.repeat(x.depth)}- ${x.line}${x.n.raw.note ? `\n${'  '.repeat(x.depth + 1)}- Note: ${md(x.n.raw.note)}` : ''}`;
  out.push(`# ${S.id.replace(/^s/, '')} · ${S.title}`);
  out.push('');
  out.push(`<!-- node pages/screens/build.js --handoff ${S.id} (prime-game-ui, ${S.rel}); generated, do not edit by hand -->`);
  out.push('');
  out.push(`The styled ${S.title.toLowerCase()} screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.`);
  out.push('');
  out.push(`- **Source:** \`${S.rel}\`; the review page is \`pages/screens/screens.html#${S.id}\`; the wireframe is section \`${S.wireframe}\` («${C.titles[S.wireframe]}»).`);
  out.push(`- **Theme:** the Toy pack ui-${C.pack.version} (\`dist/pack/toy.pack.json\`); the variations below are \`theme_type_variation\` names.`);
  out.push(`- **World behind the UI** (not UI): ${BACKGROUNDS[S.background]}.`);
  out.push('- **How to read it:** the roots are children of the screen\'s full-rect root `Control`; every property not listed keeps Godot\'s default; sizes and offsets are reference px. Texts are keys of `copy/strings.csv` through `tr()`; sample values are data the game fills with `String.format()`.');
  if (S.note) { out.push(''); out.push(S.note); }
  out.push('');
  out.push('## States');
  out.push('');
  out.push('| State | Page label | What it shows |');
  out.push('|---|---|---|');
  for (const st of S.states) out.push(`| \`${st.id}\` | ${md(st.label)} | ${st.note ? md(st.note) : ''} |`);
  out.push('');
  const world = { name: null, context: 'dark' };
  const base = lines(S.roots, first, world, 0, []);
  out.push(`## Node tree in \`${first}\``);
  out.push('');
  out.push(...base.map(item));
  const byNode = new Map(base.map((x) => [x.n, x.line]));
  const byBits = new Map(base.map((x) => [x.n, x.bits]));
  for (const st of S.stateIds.slice(1)) {
    const cur = lines(S.roots, st, world, 0, []);
    const curSet = new Set(cur.map((x) => x.n));
    out.push('');
    out.push(`## \`${st}\`: what differs from \`${first}\``);
    out.push('');
    const shown = cur.filter((x) => !byNode.has(x.n));
    const shownTop = shown.filter((x) => !x.n.parent || byNode.has(x.n.parent));
    const hidden = base.filter((x) => !curSet.has(x.n) && (!x.n.parent || curSet.has(x.n.parent)));
    const changed = cur.filter((x) => byNode.has(x.n) && byNode.get(x.n) !== x.line);
    if (!shown.length && !hidden.length && !changed.length) out.push('- Nothing: the same tree.');
    if (hidden.length) out.push(`- **Hidden:** ${hidden.map((x) => `\`${x.n.path.slice(S.id.length + 1)}\``).join(', ')}.`);
    for (const x of changed) {
      const old = byBits.get(x.n);
      const now = x.bits.filter((b) => !old.includes(b));
      const was = old.filter((b) => !x.bits.includes(b));
      out.push(`- **Changed** \`${x.n.path.slice(S.id.length + 1)}\`: ${now.join(' · ')}${was.length ? `${now.length ? ' (was: ' : 'no longer '}${was.join(' · ')}${now.length ? ')' : ''}` : ''}`);
    }
    if (shownTop.length) {
      out.push('- **Shown:**');
      for (const t of shownTop) {
        for (const x of shown) if (x.n === t.n || x.n.path.startsWith(t.n.path + '/')) out.push(item({ ...x, depth: x.depth - t.depth + 1 }));
      }
    }
  }
  out.push('');
  out.push('## Notes');
  out.push('');
  out.push('- The review page emulates Godot\'s containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.');
  const usedVars = S.all.map((n) => C.pack.variations[n.raw.variation]).filter(Boolean);
  if (usedVars.some((v) => v.base)) out.push('- A raised variation is built as the tokens spec (§6) says: a `ToyRaised` MarginContainer holding first the base `Panel` (the base named above, chosen by the context it sits in), then the face.');
  if (S.all.some((n) => 'icon' in n.raw || Object.values(n.per).some((o) => 'icon' in o.raw))) out.push('- Icons draw in the text colour of their context on the page; in Godot import them in that colour or set `self_modulate`.');
  return out.join('\n') + '\n';
}

// ---------------------------------------------------------------------------------------------------------------

function main(argv) {
  const mode = argv.includes('--check') ? 'check' : argv.includes('--validate') ? 'validate' : argv.includes('--handoff') ? 'handoff' : 'write';
  const flags = argv.filter((a) => a.startsWith('--'));
  const ids = argv.filter((a) => !a.startsWith('--')).map((a) => {
    const m = /^s0*(\d+)(?:-[a-z-]+)?(?:\.json)?$/.exec(a);
    return m ? `s${m[1]}` : a;
  });
  const usage = 'usage: node pages/screens/build.js [--check | --validate [s2 ...] | --handoff s2]';
  if (flags.length > 1 || flags.some((f) => !['--check', '--validate', '--handoff'].includes(f))) { console.error(usage); return 2; }
  if ((mode === 'write' || mode === 'check') && ids.length) { console.error(usage); return 2; }
  if (mode === 'handoff' && ids.length !== 1) { console.error(usage); return 2; }
  if (ids.some((id) => !SCREENS.some(([x]) => x === id))) { console.error(`unknown screen ${ids.find((id) => !SCREENS.some(([x]) => x === id))}; the screens are s1 … s10\n${usage}`); return 2; }
  try {
    const { sources, errors: readErrors } = readSources(ids.length ? ids : null);
    if (mode === 'validate' || mode === 'handoff') {
      const C = loadInputs(readPack());
      const { errors, screens } = validateAll(sources, C);
      const all = [...readErrors, ...errors];
      if (all.length) { console.error(all.join('\n')); console.error(`${all.length} error(s)`); return 1; }
      if (mode === 'handoff') { process.stdout.write(handoff(screens[0], C)); return 0; }
      console.log(`valid: ${screens.length ? screens.map((S) => `${S.id} (${S.all.length} nodes, ${S.stateIds.length} states)`).join(', ') : 'no screen sources yet'}`);
      return 0;
    }
    const api = require(path.join(ROOT, 'tools', 'tokens', 'api.js'));
    const { emitComponentsCss } = require(path.join(ROOT, 'pages', 'components', 'emit-css.js'));
    const sys = api.load({ root: ROOT });
    const C = loadInputs(sys.pack);
    const { errors, screens } = validateAll(sources, C);
    const all = [...readErrors, ...errors];
    if (all.length) { console.error(all.join('\n')); console.error(`${all.length} error(s): the page is not built`); return 1; }
    C.used = new Set();
    const layout = layoutCss(screens, C);
    // Render once to collect the variations used, then emit only their components CSS.
    for (const S of screens) for (const st of S.stateIds) S.roots.forEach((n) => renderNode(n, st, S, C, { used: C.used }));
    const ui = uiCss(sys, C.used, emitComponentsCss);
    const outputs = [[OUT_UI, ui], [OUT_LAYOUT, layout], [OUT_HTML, renderPage(screens, C, sys, ui, layout)]];
    for (const [file, text] of outputs) if (/\r/.test(text)) { console.error(`error: ${file} would contain CR bytes`); return 1; }
    if (mode === 'check') {
      const stale = [];
      for (const [file, text] of outputs) {
        let disk = null;
        try { disk = fs.readFileSync(path.join(ROOT, file), 'utf8'); } catch (e) { disk = null; }
        if (disk !== text) stale.push(`${file} (${disk === null ? 'missing' : 'differs'})`);
      }
      if (stale.length) { console.log(`stale: ${stale.join(', ')}; run node pages/screens/build.js`); return 1; }
      console.log(`up to date: ${outputs.map(([f]) => f).join(', ')}`);
      return 0;
    }
    for (const [file, text] of outputs) fs.writeFileSync(path.join(ROOT, file), text);
    const kb = (t) => `${Math.round(Buffer.byteLength(t) / 1024)} KB`;
    console.log(`wrote ${outputs.map(([f, t]) => `${f} (${kb(t)})`).join(', ')}; screens: ${screens.map((S) => S.id).join(', ') || 'none yet'}`);
    return 0;
  } catch (e) {
    if (e instanceof BuildError || /^emit-css:|^tokens:/.test(e.message)) { console.error(`error: ${e.message}`); return 1; }
    throw e;
  }
}

module.exports = { main, validateAll, readSources, loadInputs, readPack, handoff, renderNode, renderPage, layoutCss, uiCss, GODOT, PRESETS, FLAGS, BACKGROUNDS };

if (require.main === module) process.exitCode = main(process.argv.slice(2));
