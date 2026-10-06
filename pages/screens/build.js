// The styled screens (prime-game-ui#19): every session screen as a Godot 4.7.2 scene tree in pages/screens/src/*.json,
// rendered from the Toy components and the copy deck into one review page, validated, and handed off to the game.
//
//   node pages/screens/build.js                      write screens.html, screens-ui.css, screens-layout.css and the
//                                                    handoffs docs/handoff/<screen file>.md
//   node pages/screens/build.js --check              exit 1 when an output differs from what the build would write
//   node pages/screens/build.js --validate [s2 ...]  validate the sources only (all, or these screens); writes nothing
//   node pages/screens/build.js --handoff s2         print the screen's Godot handoff (Markdown) to stdout
//   node pages/screens/build.js --out <file.html> s2 [s5 ...]
//                                                    a private page with only these screens (validated alone), written
//                                                    outside the repo, CSS inlined: build and measure one screen while
//                                                    other screens are being edited (tools/screens/fit.js --page <file>)
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
//   types (rendered faithfully, nothing else): Control, Panel, PanelContainer (wide), MarginContainer (no margins:
//     they are theme constants, so overrides the theme test forbids), CenterContainer, VBoxContainer and HBoxContainer
//     (alignment begin|center|end; the gap only from a spacing variation: ToyColumn*/ToyRow*), GridContainer (columns
//     1; the gaps only from ToyGridList/ToyGridSwatch), ScrollContainer (vertical only: scroll_vertical; one child,
//     expand_fill across; its bar is a VScrollBar drawn with ToyScrollBar when the child is taller; the gap between the
//     child and the bar only from ToyScroll), HSlider (value, min_value, max_value, step, editable, state
//     normal|hover|focus), VScrollBar (value, min_value, max_value, page, state normal|hover|held|focus),
//     Label (key, args, count, piece, value_of, or text; horizontal_alignment left|center|right|fill,
//     vertical_alignment top|center|bottom|fill, autowrap_mode off|arbitrary|word|word_smart), Button (key or text,
//     and/or icon, icon_size, args, count, state, toggle_mode, alignment left|center|right, h_separation: the
//     variation's theme constant, else 4; with no key, text or icon its children fill its StyleBox content rect),
//     OptionButton (key, args, items, state; its arrow is icons/chevron-down.svg); a Label, Button and OptionButton
//     also take clip_text and text_overrun_behavior (no_trimming|trim_char|trim_word|trim_ellipsis|trim_word_ellipsis):
//     a cut text adds no width, so the node needs a slot that stretches it or a custom_minimum_size width. LineEdit
//     (text: a sample value, ""
//     or neither for an empty field (drawn one line tall), placeholder: a key, editable, state normal|focus),
//     ProgressBar (value, max_value
//     100, show_percentage: must be false), TextureRect (icon, theme_color icon-on|icon-off: a colour item of the
//     surface it sits on, as ToyMic's, or self_modulate: a sample colour "#rrggbb" of content data such as a body
//     colour; sized by custom_minimum_size).
//   texts: deck keys of copy/strings.csv (key), or a data text (text: a sample, a string or {uk, en}) for what the game
//     fills from data and never translates (names, the room code, times, numbers, glyphs; auto_translate_mode
//     DISABLED). A data text equal to a deck value is refused: that text is the key's. args gives each placeholder of a
//     key a sample value (a string, or {uk, en}); a plural key takes count. piece N draws only the Nth part of the text
//     split at {key}/{preset} (a sentence drawn around a keycap); value_of names the placeholder whose sample value a
//     node draws (the keycap's letter inside that sentence).
//   states of a Button (the look shown on the page): normal, hover, held, disabled, focus, and with toggle_mode the
//     selected ones (selected, selected-hover, selected-held, selected-disabled, selected-focus) that draw the pack's
//     toggle.selected variation, as ToyToggle does; a variation with no toggle partner (ToyMenuItem) draws its own
//     pressed StyleBox while selected (button_pressed). A toggle with a lang.* key is drawn pressed while its language
//     is the page's (the language chips), whatever its source state.
//   per_state may change only content: key, args, count, state, value, text, placeholder, editable, icon,
//     theme_color, self_modulate, variation, wide. Layout never changes per state; a node shown only in some states
//     lists them in states.
//
// VALIDATION (every error names the file, the line, the JSON pointer and what to do): unknown types and fields; a
// variation missing from the pack, abstract, of a class that is not the node's type or a base of it, or a toggle's
// selected half named directly; a box or grid with more than one child and no spacing variation, or a separation or a
// MarginContainer margin written on the node (the theme test forbids overrides: the message names the variation to
// use); a ScrollContainer with other than one child, or a child that does not fill its width; a text that is not a deck
// key, a node with both a key and a data text, or a data text that is a deck value (no field takes literal
// player-facing text); a cut text that gets no width; a tinted Button icon on a variation without icon colours; a missing
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
// containers: a box or grid container is a CSS grid (a non-expanding child gets a minmax(min-content, auto) track, an
// expanding one minmax(min-content, <stretch_ratio>fr), so free space goes to the expanding children by ratio and never
// below their minimum, the larger of custom_minimum_size and the content, as in BoxContainer); a PanelContainer,
// MarginContainer or CenterContainer stacks its children in one grid cell (the PanelContainer's content margins are the
// StyleBox padding of the generated CSS); fill/shrink flags are justify-self/align-self; an anchored node sits in a
// .gd-anchor box at its anchor rect, sized at Godot's combined minimum when that is larger (min-content), and grows from
// it as its grow direction says. page.css and page.js are the page chrome and the world art, outside the lint.
// docs/handoff/<screen file>.md is each screen's handoff (the --handoff text), generated and checked by --check: the
// prime-game handoff issues link to it (a long screen's handoff passes GitHub's 65,536-character issue limit).
// THE PAGE CONTRACT (the fit tool, tools/screens/, measures it): <html lang data-lang data-text-size>; one
// <div class="sc-frame" data-screen data-state> per state, 1920x1080 reference px, clipping; every node one element
// with data-node="<screen>/<path>", data-type, data-variation; a text's element carries data-key (a deck text) or
// data-text="data" (a data text) and only that text;
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
const OUT_HANDOFF = 'docs/handoff'; // <screen file name>.md: each screen's handoff, generated
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
const GAME_ICONS = 'dist/pack/icons'; // the white copies of the tinted icons the game imports (tools/tokens/api.js)
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
  // Its margins are theme constants (margin_left …), so setting them is an override the theme test forbids.
  MarginContainer: { chain: ['MarginContainer', 'Container', 'Control'], holds: 'stack', fields: [] },
  CenterContainer: { chain: ['CenterContainer', 'Container', 'Control'], holds: 'center', fields: [] },
  // A box or grid takes its gaps only from a spacing variation (`spacing`: the pack items it reads).
  VBoxContainer: { chain: ['VBoxContainer', 'BoxContainer', 'Container', 'Control'], holds: 'vbox', fields: ['alignment'], spacing: ['separation'] },
  HBoxContainer: { chain: ['HBoxContainer', 'BoxContainer', 'Container', 'Control'], holds: 'hbox', fields: ['alignment'], spacing: ['separation'] },
  GridContainer: { chain: ['GridContainer', 'Container', 'Control'], holds: 'grid', fields: ['columns'], spacing: ['h-separation', 'v-separation'] },
  // Vertical scrolling only (horizontal_scroll_mode SCROLL_MODE_DISABLED): one child; the bar is drawn with SCROLL_BAR.
  // The gap between the child and the bar (scrollbar_h_separation, Godot's default 0) comes only from a variation.
  ScrollContainer: { chain: ['ScrollContainer', 'Container', 'Control'], holds: 'scroll', fields: ['scroll_vertical'], spacing: ['scrollbar-h-separation'] },
  HSlider: { chain: ['HSlider', 'Slider', 'Range', 'Control'], holds: null, themed: true, fields: ['value', 'min_value', 'max_value', 'step', 'editable', 'state'] },
  VScrollBar: { chain: ['VScrollBar', 'ScrollBar', 'Range', 'Control'], holds: null, themed: true, fields: ['value', 'min_value', 'max_value', 'page', 'state'] },
  Label: { chain: ['Label', 'Control'], holds: null, themed: true, fields: ['key', 'args', 'count', 'piece', 'value_of', 'text', 'horizontal_alignment', 'vertical_alignment', 'autowrap_mode', 'clip_text', 'text_overrun_behavior'] },
  // A Button with a key, a text or an icon places its children by anchors; with none of them its children are its
  // content and fill its StyleBox content rect (place 'content').
  Button: { chain: ['Button', 'BaseButton', 'Control'], holds: 'anchored', themed: true, fields: ['key', 'args', 'count', 'text', 'icon', 'icon_size', 'state', 'toggle_mode', 'alignment', 'h_separation', 'wide', 'clip_text', 'text_overrun_behavior'] },
  OptionButton: { chain: ['OptionButton', 'Button', 'BaseButton', 'Control'], holds: null, themed: true, fields: ['key', 'args', 'items', 'state', 'clip_text', 'text_overrun_behavior'] },
  LineEdit: { chain: ['LineEdit', 'Control'], holds: null, themed: true, fields: ['text', 'placeholder', 'editable', 'state'] },
  ProgressBar: { chain: ['ProgressBar', 'Range', 'Control'], holds: null, themed: true, fields: ['value', 'max_value', 'show_percentage'] },
  TextureRect: { chain: ['TextureRect', 'Control'], holds: null, fields: ['icon', 'theme_color', 'self_modulate'] },
};
const COMMON_FIELDS = ['name', 'type', 'variation', 'states', 'per_state', 'note', 'custom_minimum_size'];
const ANCHOR_FIELDS = ['anchors_preset', 'offset_left', 'offset_top', 'offset_right', 'offset_bottom', 'grow_horizontal', 'grow_vertical'];
const FLAG_FIELDS = ['size_flags_horizontal', 'size_flags_vertical', 'size_flags_stretch_ratio'];
const PER_STATE_FIELDS = ['key', 'args', 'count', 'state', 'value', 'text', 'placeholder', 'editable', 'icon', 'theme_color', 'self_modulate', 'variation', 'wide'];
// The fields that give a Button its own content; a Button with none of them draws its children as its content.
const BUTTON_CONTENT = ['key', 'text', 'icon'];
// A data text's element (the page contract): data-text="data" in place of a deck text's data-key.
const DATA_TEXT = 'data';
const COLOUR_RE = /^#[0-9a-fA-F]{6}$/;
// Colour items of a surface variation that tint an icon inside it (the CSS child class the components CSS colours).
const TINTS = { 'icon-on': 'tv-icon-on', 'icon-off': 'tv-icon-off' };
const ARROW_ICON = 'chevron-down'; // OptionButton's theme icon `arrow` (pages/components/icons)
// The variation of every OptionButton's open list (the game sets it on get_popup()), and the radio icons it draws (its
// textures in the pack: radio_checked, radio_checked_disabled, radio_unchecked and radio_unchecked_disabled).
const LIST_VARIATION = 'ToyDropdownList';
const LIST_ICONS = ['radio-checked', 'radio-checked-disabled', 'radio-unchecked'];
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
const SLIDER_STATES = ['normal', 'hover', 'focus'];
const SCROLLBAR_STATES = ['normal', 'hover', 'held', 'focus'];
// The theme's grabber textures of an HSlider (grabber and grabber_highlight, grabber_disabled), pages/components/icons.
const KNOB_ICON = 'slider-knob';
const KNOB_DISABLED_ICON = 'slider-knob-disabled';
// The variation of every ScrollContainer's VScrollBar (the game sets it on get_v_scroll_bar()).
const SCROLL_BAR = 'ToyScrollBar';
// The separation fields Godot has, which the theme test forbids as overrides: a spacing variation sets them.
const SEPARATION_FIELDS = { VBoxContainer: ['separation'], HBoxContainer: ['separation'], GridContainer: ['h_separation', 'v_separation'], ScrollContainer: ['scrollbar_h_separation'] };
// MarginContainer's margins are theme constants too, so they are overrides the theme test forbids.
const MARGIN_FIELDS = ['margin_left', 'margin_top', 'margin_right', 'margin_bottom'];
const ENUMS = {
  horizontal_alignment: ['left', 'center', 'right', 'fill'],
  vertical_alignment: ['top', 'center', 'bottom', 'fill'],
  autowrap_mode: ['off', 'arbitrary', 'word', 'word_smart'],
  // TextServer.OverrunBehavior (Label, Button and OptionButton text_overrun_behavior).
  text_overrun_behavior: ['no_trimming', 'trim_char', 'trim_word', 'trim_ellipsis', 'trim_word_ellipsis'],
};
const DEFAULTS = {
  separation: 4, h_separation: 4, v_separation: 4, scrollbar_h_separation: 0, columns: 1,
  horizontal_alignment: 'left', vertical_alignment: 'top', autowrap_mode: 'off', state: 'normal', toggle_mode: false,
  editable: true, value: 0, min_value: 0, max_value: 100, step: 1, page: 0, scroll_vertical: 0, show_percentage: true,
  clip_text: false, text_overrun_behavior: 'no_trimming',
};
const SPLIT = ['key', 'preset']; // placeholders drawn as their own element (copy/README.md, tools/copy/deck.js PH_SPLIT)
const SPLIT_RE = /\{(?:key|preset)\}/;
const PH_RE = /\{([a-z_]+)\}/g;
const SURFACES = new Set(['Panel', 'PanelContainer']);
// The classes whose variations sit on a surface (the context rule), and the containers whose variations draw nothing
// (a spacing variation is never a surface).
const TEXT_CLASSES = new Set(['Label', 'Button', 'OptionButton', 'LineEdit', 'ProgressBar', 'HSlider', 'VScrollBar']);
const LAYOUT_CLASSES = new Set(['VBoxContainer', 'HBoxContainer', 'GridContainer', 'ScrollContainer']);
const isSurfaceOf = (v, n) => !!v && (SURFACES.has(v.class) || (n.children.length > 0 && !LAYOUT_CLASSES.has(v.class)));
// A Label, Button or OptionButton whose text is cut at its width (clip_text, or a text_overrun_behavior that trims):
// Godot no longer counts the text in its minimum width (Label::get_minimum_size: 1 px; Button: its StyleBox and icon).
const clipsText = (p) => p.clip_text === true || (typeof p.text_overrun_behavior === 'string' && p.text_overrun_behavior !== 'no_trimming');
const trimsWithEllipsis = (p) => /ellipsis/.test(p.text_overrun_behavior || '');
// Whether Godot gives the node only its minimum width (no slot stretches it across): a CenterContainer's child, a box or
// grid child that does not expand and fill along a row, a column or stack child that does not fill across, an anchored
// node at a horizontal point.
function widthIsMinimum(n) {
  if (n.place === 'center') return true;
  if (n.place === 'hbox' || n.place === 'grid') return n.flags.h !== 'expand_fill';
  if (n.place === 'vbox' || n.place === 'stack' || n.place === 'scroll') return n.flags.h !== 'fill' && n.flags.h !== 'expand_fill';
  if (n.place === 'anchored') return n.anchor.a[0] === n.anchor.a[2] && n.anchor.o[2] - n.anchor.o[0] <= 0;
  return false;
}
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
const fmt4 = (x) => String(Math.round(x * 10000) / 10000);
// pages/components/emit-css.js emitScrollBar: the part above the grabber, the grabber, the part below.
const SCROLL_BAR_INNER = '<i class="tv-pre"></i><i class="tv-grabber"></i><i class="tv-post"></i>';
const placeholdersOf = (s) => [...new Set([...String(s).matchAll(PH_RE)].map((m) => m[1]))];

// ---------------------------------------------------------------------------------------------------------------
// Inputs: the pack, the deck, the wireframe titles and the icons.

// pack: the token pack, whose assets give each icon's copy in the game (dist/pack/icons/…), its tint and its svg/scale.
function loadIcons(pack) {
  const assets = new Map(((pack && pack.assets) || []).map((a) => [a.source, a]));
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
      // A tinted icon draws in currentColor on the page; the game imports its white copy (dist/pack/icons, written by
      // tools/tokens/build.js) and tints it. An icon in its own colours (the room pictograms, the slider knobs) is not.
      // The pack's assets record says where the game's copy is, whether it is white (tint "multiply") and, for an icon the
      // pages always draw in one colour (the room pictograms' ink), the self_modulate that gives that colour back.
      const tinted = /currentColor/.test(text);
      const asset = assets.get(rel) || null;
      icons.set(src.prefix + f.replace(/\.svg$/, ''), {
        file: rel, svg: head + text.slice(open[0].length), w, h, tinted,
        game: asset ? `dist/pack/${asset.path}` : tinted && !src.prefix ? `${GAME_ICONS}/${f}` : rel,
        white: asset ? asset.tint === 'multiply' : tinted, tintColor: asset && asset.tint_color ? asset.tint_color : null, asset,
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
  // Every deck text (both languages, every plural form), lower case: a data text equal to one of them is the key's.
  const deckValues = new Map();
  for (const e of deck.entries) {
    for (const s of [...e.en, ...e.uk]) {
      const k = String(s || '').trim().toLowerCase();
      if (k && !deckValues.has(k)) deckValues.set(k, e.key);
    }
  }
  return {
    pack, selectedOf, deckValues, byKey: new Map(deck.entries.map((e) => [e.key, e])),
    titles: D.screenTitles(readText(D.WIREFRAMES)), icons: loadIcons(pack),
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
    case 'horizontal_alignment': case 'vertical_alignment': case 'autowrap_mode': case 'text_overrun_behavior': return oneOf(ENUMS[field]);
    case 'icon_size': return int(8, 512);
    case 'state':
      if (type === 'Button') return oneOf(Object.keys(BUTTON_STATES));
      if (type === 'OptionButton') return oneOf(OPTION_STATES);
      if (type === 'HSlider') return oneOf(SLIDER_STATES);
      if (type === 'VScrollBar') return oneOf(SCROLLBAR_STATES);
      return oneOf(LINE_STATES);
    case 'min_value': return isNum(v) ? null : 'min_value is a number';
    case 'step': return isNum(v) && v > 0 ? null : 'step is a number above 0';
    case 'page': return isNum(v) && v >= 0 ? null : 'page is a number of at least 0 (the visible part of the range)';
    case 'scroll_vertical': return int(0, 100000);
    case 'toggle_mode': case 'editable': case 'show_percentage': case 'wide': case 'clip_text': return bool();
    case 'alignment': return oneOf(type === 'Button' ? ['left', 'center', 'right'] : ['begin', 'center', 'end']);
    case 'separation': case 'h_separation': case 'v_separation': return int(-200, 400);
    case 'margin_left': case 'margin_top': case 'margin_right': case 'margin_bottom': return int(-400, 1000);
    case 'columns': return int(1, 32);
    case 'items': return Array.isArray(v) && v.length && v.every((x) => typeof x === 'string' && x) ? null : 'items is a list of deck keys';
    case 'text':
      if (type === 'LineEdit' && v === '') return null; // an empty field
      return sampleOk(v) ? null : 'text is a sample value: a string (at most 80 characters, no braces or line breaks) or {"uk": …, "en": …}';
    case 'self_modulate': return typeof v === 'string' && COLOUR_RE.test(v) ? null : 'self_modulate is a sample colour "#rrggbb" (content data, such as a body colour)';
    case 'value':
      if (type === 'HSlider' || type === 'VScrollBar') return isNum(v) ? null : 'value is a number';
      return isNum(v) && v >= 0 ? null : 'value is a number of at least 0';
    case 'max_value': return isNum(v) && v > 0 ? null : 'max_value is a number above 0';
    default: return null;
  }
}

// The spacing variations of a container class in the pack: [{name, gaps: [px …]}] (gaps in the order of G.spacing).
function spacingVariations(C, type) {
  const items = GODOT[type].spacing;
  const out = [];
  for (const [name, v] of Object.entries(C.pack.variations)) {
    if (v.class !== type) continue;
    out.push({ name, gaps: items.map((k) => packPx(C, v, `items.${k}`)) });
  }
  return out.sort((a, b) => a.gaps[0] - b.gaps[0] || a.gaps[1] - b.gaps[1]);
}
// The error for a separation written on a box or grid: name the variation that gives it, else the ones there are.
function spacingHint(C, type, raw) {
  const list = spacingVariations(C, type);
  const want = SEPARATION_FIELDS[type].map((f) => (isNum(raw[f]) ? raw[f] : DEFAULTS[f]));
  const hit = list.find((x) => x.gaps.every((g, i) => g === want[i]));
  const all = list.map((x) => `${x.name} (${x.gaps.join(' × ')})`).join(', ');
  const head = `${SEPARATION_FIELDS[type].join(' and ')} cannot be set on a node (the game's theme test forbids theme overrides)`;
  if (hit) return `${head}: use "variation": "${hit.name}" (${hit.gaps.join(' × ')} px)`;
  return `${head}, and no spacing variation gives ${want.join(' × ')} px: use one of ${all || '(none in the pack)'}`;
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
    ...(place === 'anchored' ? ANCHOR_FIELDS : place === 'center' || place === 'content' ? [] : place === 'vbox' || place === 'hbox' ? FLAG_FIELDS : FLAG_FIELDS.slice(0, 2))]);
  for (const k of Object.keys(raw)) {
    if (allowed.has(k)) continue;
    if (SEPARATION_FIELDS[type] && SEPARATION_FIELDS[type].includes(k)) R.err(ptr(P, k), spacingHint(C, type, raw));
    else if (type === 'MarginContainer' && MARGIN_FIELDS.includes(k)) R.err(ptr(P, k), `${k} cannot be set on a node: a MarginContainer's margins are theme constants, and the game's theme test forbids theme overrides; leave the space with an empty Control spacer (custom_minimum_size) in a box, or let a PanelContainer's StyleBox give it`);
    else if (place === 'content' && (ANCHOR_FIELDS.includes(k) || FLAG_FIELDS.includes(k))) R.err(ptr(P, k), `the child of a Button without a key, text or icon is its content and fills its StyleBox content rect: no ${ANCHOR_FIELDS.includes(k) ? 'anchors or offsets' : 'size flags'}`);
    else if (ANCHOR_FIELDS.includes(k)) R.err(ptr(P, k), `${k} works only on a node placed by anchors (a root, or a child of a Control, Panel or Button); this node is inside ${where}, which places it: use size flags`);
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
  // A Button with no key, text or icon draws its children as its content (in its StyleBox content rect).
  n.content = type === 'Button' && !BUTTON_CONTENT.some((f) => f in raw);
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
        if (f === 'variation' && LAYOUT_CLASSES.has(type)) {
          R.err(ptr(PS, f), 'a spacing variation is layout, and layout never changes per state');
          continue;
        }
        if (!PER_STATE_FIELDS.includes(f) || !(f === 'variation' || G.fields.includes(f))) {
          R.err(ptr(PS, f), `${f} cannot change per state on a ${type} (per_state takes ${PER_STATE_FIELDS.filter((x) => x === 'variation' || G.fields.includes(x)).join(', ')})`);
          continue;
        }
        if (n.content && BUTTON_CONTENT.includes(f)) {
          R.err(ptr(PS, f), `this Button draws its children as its content; a ${f} cannot appear per state (use another node shown in that state)`);
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
  if (place === 'content') n.flags = { h: 'fill', v: 'fill', ratio: 1 };
  if (G.holds && 'children' in raw) {
    if (!Array.isArray(raw.children)) R.err(ptr(P, 'children'), 'children is a list of nodes');
    else n.children = buildChildren(raw.children, ptr(P, 'children'), n, n.content ? 'content' : G.holds, S, C, R);
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

// A data text (text on a Label or Button): what the game fills from data and never translates. It takes none of a
// key's fields, and a text the deck already holds is that key's (the player reads it in their language).
function checkDataText(n, st, p, C, R) {
  const at = (f) => fieldAt(n, st, f);
  for (const f of ['args', 'count', 'piece', 'value_of']) {
    if (f in p) R.err(at(f), `${f} belongs to a deck key; a data text (text) is drawn as it is`);
  }
  if (!sampleOk(p.text)) return;
  for (const lang of ['uk', 'en']) {
    const s = sampleText(p.text, lang);
    const key = C.deckValues.get(s.trim().toLowerCase());
    if (key) {
      R.err(at('text'), `${q(s)} is the deck text of ${key}: a text the player reads in their language is a key ("key": "${key}"); text is only for data the game never translates (names, codes, times, numbers, glyphs)`);
      return;
    }
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
    if ('key' in p && 'text' in p) R.err(at('text'), 'a Label draws a deck key or a data text, not both');
    else if ('key' in p) checkText(n, st, p, C, R);
    else if ('text' in p) checkDataText(n, st, p, C, R);
    else R.err(n.ptr, 'a Label draws a deck key (key) or a data text (text: names, codes, times, numbers the game never translates)');
    if (p.autowrap_mode !== 'off' && !(n.cmin[0] > 0)) R.err(ptr(n.ptr, 'autowrap_mode'), 'an autowrapping Label has no width of its own in Godot: give custom_minimum_size a width');
  }
  if (T === 'Button') {
    if (n.content) {
      if (!n.children.length) R.err(n.ptr, 'a Button draws a key or a data text, an icon, or (with none of them) its child nodes as its content');
      for (const f of ['args', 'count', 'icon_size', 'alignment', 'h_separation']) {
        if (f in n.raw) R.err(ptr(n.ptr, f), `${f} has nothing to act on: this Button draws its children as its content (no key, text or icon)`);
      }
    }
    if ('key' in p && 'text' in p) R.err(at('text'), 'a Button draws a deck key or a data text, not both');
    else if ('key' in p) checkText(n, st, p, C, R);
    else if ('text' in p) checkDataText(n, st, p, C, R);
    // A selected toggle draws the pack's toggle.selected; a variation with no toggle partner draws its own pressed
    // StyleBox while button_pressed (ToyMenuItem's open item).
    const pressedLook = (x) => !!x && (!!x.toggle || x.styleboxes.includes('pressed'));
    if (BUTTON_STATES[p.state] && BUTTON_STATES[p.state][0]) {
      if (p.toggle_mode !== true) R.err(at('state'), `${p.state} is a toggle's state: set toggle_mode true`);
      else if (v && !pressedLook(v)) R.err(at('state'), `${p.variation} has no selected look (no toggle in the pack and no pressed StyleBox)`);
    }
    if (p.toggle_mode === true && v && !pressedLook(v)) R.err(ptr(n.ptr, 'toggle_mode'), `${p.variation} has no selected look (no toggle.selected in the pack and no pressed StyleBox)`);
    if ('icon_size' in p && !('icon' in p)) R.err(ptr(n.ptr, 'icon_size'), 'icon_size without an icon');
  }
  if (T === 'Button' || T === 'TextureRect') {
    // Godot tints a Button's icon with the variation's icon colours, white without them; the page draws it in the
    // label colour, so a tinted icon needs them.
    const ic = 'icon' in p ? C.icons.get(p.icon) : null;
    if (T === 'Button' && ic && ic.tinted && v && !C.pack.tokens[`${v.prefix}.items.icon-normal-color`]) {
      R.err(at('icon'), `${p.variation} has no icon colours (icon_normal_color …), so Godot would draw the ${p.icon} icon white: add them to its tokens, or use a variation that has them`);
    }
    if ('icon' in p) checkIcon(n, st, p, C, R);
    else if (T === 'TextureRect') R.err(n.ptr, 'a TextureRect draws an icon: add icon');
  }
  if ((T === 'Label' || T === 'Button' || T === 'OptionButton') && clipsText(p)) {
    const f = 'clip_text' in n.raw ? 'clip_text' : 'text_overrun_behavior';
    if (n.content) R.err(ptr(n.ptr, f), `${f} cuts a Button's own text; this Button draws its children (no key, text or icon)`);
    else if (!(n.cmin[0] > 0) && widthIsMinimum(n)) R.err(ptr(n.ptr, f), `a cut text adds no width in Godot (a Label's minimum is 1 px, a Button's its StyleBox and icon), and this node gets only its minimum width here: give it a custom_minimum_size width, or let its slot stretch it (${n.place === 'hbox' || n.place === 'grid' ? 'size_flags_horizontal expand_fill' : n.place === 'anchored' ? 'anchors or offsets with a width' : 'size_flags_horizontal fill'})`);
  }
  if (T === 'TextureRect' && !(n.cmin[0] > 0 && n.cmin[1] > 0)) R.err(n.ptr, 'a TextureRect is sized by custom_minimum_size (expand_mode ignore_size): give both a width and a height');
  if (T === 'TextureRect' && 'theme_color' in p && 'self_modulate' in p) R.err(at('self_modulate'), 'a TextureRect takes its tint from a theme colour (theme_color) or from data (self_modulate), not both');
  if (T === 'OptionButton') {
    const arrow = C.icons.get(ARROW_ICON);
    if (!arrow || !arrow.licence) R.err(n.ptr, `an OptionButton draws its arrow with pages/components/icons/${ARROW_ICON}.svg, which is missing or has no licence record`);
    if (!C.pack.variations[LIST_VARIATION]) R.err(n.ptr, `an OptionButton's open list is ${LIST_VARIATION}, which the pack does not have`);
    for (const k of LIST_ICONS) {
      const ic = C.icons.get(k);
      if (!ic || !ic.licence) R.err(n.ptr, `an OptionButton's open list draws pages/components/icons/${k}.svg, which is missing or has no licence record`);
    }
    if (!('key' in p)) R.err(n.ptr, 'an OptionButton shows its selected item: add key');
    else checkText(n, st, p, C, R);
    if (Array.isArray(p.items)) {
      p.items.forEach((k, i) => { if (!C.byKey.has(k)) R.err(ptr(at('items'), i), `${q(k)} is not a key of copy/strings.csv`); });
      if ('key' in p && !p.items.includes(p.key)) R.err(at('items'), `items does not include the shown key ${p.key}`);
    }
  }
  if (T === 'LineEdit') {
    // Neither text nor placeholder (or text "") is an empty field, as the code field opens.
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
  // A box or grid draws its gaps only through a spacing variation; without one it keeps Godot's default separation,
  // which is allowed only where there is no gap to draw.
  if (n.G.spacing && !p.variation && n.children.length > 1) {
    const list = spacingVariations(C, T).map((x) => `${x.name} (${x.gaps.join(' × ')})`).join(', ');
    R.err(n.ptr, `a ${T} with ${n.children.length} children takes its gap from a spacing variation (the theme test forbids a separation override): add "variation", one of ${list}`);
  }
  if (T === 'ScrollContainer') {
    if (n.children.length !== 1) R.err(n.ptr, `a ScrollContainer holds exactly one child, the scrolled content (it has ${n.children.length})`);
    else {
      const c = n.children[0];
      if (c.flags.h !== 'expand_fill') R.err(ptr(c.ptr, 'size_flags_horizontal'), 'the child of a ScrollContainer sets "size_flags_horizontal": "expand_fill", so that it fills the width (scrolling is vertical only)');
      if (FLAGS[c.flags.v][0]) R.err(ptr(c.ptr, 'size_flags_vertical'), 'the child of a ScrollContainer keeps its minimum height (it scrolls vertically): drop the vertical expand flag');
    }
    const sb = C.pack.variations[SCROLL_BAR];
    if (!sb || sb.class !== 'VScrollBar') R.err(n.ptr, `${SCROLL_BAR}, the VScrollBar variation of every ScrollContainer, is missing from the pack`);
  }
  if ((T === 'HSlider' || T === 'VScrollBar') && isNum(p.min_value) && isNum(p.max_value) && isNum(p.value)) {
    const top = T === 'VScrollBar' && isNum(p.page) ? p.max_value - p.page : p.max_value;
    if (!(p.max_value > p.min_value)) R.err(at('max_value'), `max_value ${p.max_value} is not above min_value ${p.min_value}`);
    else if (T === 'VScrollBar' && p.page > p.max_value - p.min_value) R.err(at('page'), `page ${p.page} is more than the range ${p.max_value - p.min_value}`);
    else if (p.value < p.min_value || p.value > top) R.err(at('value'), `value ${p.value} is outside ${p.min_value} … ${top}${T === 'VScrollBar' ? ' (max_value − page)' : ''}`);
    else if (T === 'HSlider' && isNum(p.step) && p.step > 0) {
      const k = (p.value - p.min_value) / p.step;
      if (Math.abs(k - Math.round(k)) > 1e-6) R.err(at('value'), `value ${p.value} is not on a step of ${p.step} from ${p.min_value} (Godot snaps it)`);
    }
  }
  if (T === 'HSlider') {
    if (p.editable === false && p.state !== 'normal') R.err(at('state'), 'a slider that is not editable shows no hover or focus');
    for (const k of [KNOB_ICON, KNOB_DISABLED_ICON]) {
      const ic = C.icons.get(k);
      if (!ic || !ic.licence) R.err(n.ptr, `an HSlider draws its grabber with pages/components/icons/${k}.svg, which is missing or has no licence record`);
    }
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
    if (n.type === 'ScrollContainer') {
      const sb = C.pack.variations[SCROLL_BAR];
      const on = surface.name ? `${surface.name} (${surface.context})` : 'the world (dark)';
      if (sb && (sb.context === 'dark' || sb.context === 'light') && sb.context !== surface.context) {
        R.err(n.ptr, `in ${st}: its bar ${SCROLL_BAR} is a ${sb.context}-context variation on ${on}`);
      }
    }
    const next = isSurfaceOf(v, n) ? { name, context: v.context === 'any' ? surface.context : v.context } : surface;
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
  if (!('key' in p) && 'text' in p) return sampleText(p.text, lang); // a data text
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

// The CSS state classes of a Button's shown state (v: its idle variation). A selected toggle draws the pack's toggle.selected variation in the
// state's look; a variation with no toggle partner draws its own pressed StyleBox while selected (hover_pressed has no
// CSS form, so selected-hover shows the pressed look too).
function buttonClasses(v, p) {
  const [selected, cls] = BUTTON_STATES[p.state];
  if (!selected || (v && v.toggle)) return cls ? [cls] : [];
  if (p.state === 'selected-disabled') return ['is-disabled'];
  return p.state === 'selected-focus' ? ['is-held', 'is-focus'] : ['is-held'];
}

// A language chip (a toggle Button with a lang.* key) is pressed while its language is the game's, so the page draws
// the chip of the language it shows as selected, whatever the source's state (the source is drawn for Ukrainian).
const LANG_KEY_RE = /^lang.([a-z]+)$/;
function langChipOf(n, p) {
  const m = n.type === 'Button' && p.toggle_mode === true && typeof p.key === 'string' ? LANG_KEY_RE.exec(p.key) : null;
  return m ? m[1] : null;
}
function stateForLang(p, chipLang, lang) {
  const base = String(p.state).replace(/^selected-?/, '') || 'normal';
  return Object.assign({}, p, { state: chipLang === lang ? (base === 'normal' ? 'selected' : `selected-${base}`) : base });
}
// The variation drawn and the element's classes for the node's fields in one state.
function nodeLook(n, p, C) {
  const name = drawnVariation(C, n, p);
  const cls = ['gd-node', `gd-${n.type}`];
  if (name) cls.push(`tv-${name}`);
  if (p.wide) cls.push('tv-wide');
  if (p.theme_color) cls.push(TINTS[p.theme_color]);
  if (n.type === 'Button') for (const c of buttonClasses(C.pack.variations[p.variation], p)) cls.push(c);
  if (n.content) cls.push('gd-content');
  if (n.type === 'OptionButton' && p.state !== 'normal') cls.push({ hover: 'is-hover', held: 'is-held', disabled: 'is-disabled', focus: 'is-focus' }[p.state]);
  if (n.type === 'LineEdit') { if (p.state === 'focus') cls.push('is-focus'); if (p.editable === false) cls.push('is-readonly'); }
  if ((n.type === 'HSlider' || n.type === 'VScrollBar') && p.state !== 'normal') cls.push({ hover: 'is-hover', held: 'is-held', focus: 'is-focus' }[p.state]);
  return { name, cls };
}

function renderNode(n, st, S, C, ctx) {
  if (!n.eff.has(st)) return '';
  const p0 = merged(n, st);
  const chipLang = langChipOf(n, p0);
  const p = chipLang ? stateForLang(p0, chipLang, 'uk') : p0;
  const { name, cls } = nodeLook(n, p, C);
  const v = name ? C.pack.variations[name] : null;
  if (name) ctx.used.add(name);
  const attrs = [`class="${cls.join(' ')}"`, `data-node="${esc(n.path)}"`, `data-type="${n.type}"`];
  if (name) attrs.push(`data-variation="${name}"`);
  // A cut text (clip_text, text_overrun_behavior): the fit tool names it so.
  if ((n.type === 'Label' || n.type === 'Button' || n.type === 'OptionButton') && clipsText(p)) attrs.push(`data-clip="${trimsWithEllipsis(p) ? 'ellipsis' : 'clip'}"`);
  if (chipLang) {
    // page.js swaps the class list and data-variation with the page's language.
    const en = nodeLook(n, stateForLang(p0, chipLang, 'en'), C);
    if (en.name) ctx.used.add(en.name);
    attrs.push(`data-lang-chip="${chipLang}"`, `data-cls-uk="${cls.join(' ')}"`, `data-cls-en="${en.cls.join(' ')}"`,
      `data-var-uk="${name}"`, `data-var-en="${en.name}"`);
  }
  if (v && SURFACES.has(v.class) && (v.context === 'dark' || v.context === 'light')) attrs.push(`data-context="${v.context}"`);
  let inner = '';
  const kids = () => n.children.map((c) => renderNode(c, st, S, C, ctx)).join('');
  // A deck text's element carries data-key, a data text's data-text="data" (the page contract).
  const textMark = () => ('key' in p ? `data-key="${esc(p.key)}"` : `data-text="${DATA_TEXT}"`);
  // A Button's or OptionButton's text: one line (gd-label), cut at the Button's width when it clips (the layout CSS).
  const textSpan = () => {
    const uk = textOf(C, p, 'uk'), en = textOf(C, p, 'en');
    return `<span class="gd-label" ${textMark()}${textAttrs(uk, en)}>${esc(uk)}</span>`;
  };
  const icon = (ic) => `<span class="gd-icon tv-icon">${ic.svg}</span>`;
  switch (n.type) {
    case 'Label': {
      const uk = textOf(C, p, 'uk'), en = textOf(C, p, 'en');
      attrs.push(textMark());
      if (isInt(p.piece)) {
        attrs.push(`data-piece="${p.piece}"`);
        // A piece that is empty in a language (a keycap at the sentence's end) is hidden there, as the game hides it.
        const empty = ['uk', 'en'].filter((l) => !(l === 'uk' ? uk : en).trim());
        if (empty.length) attrs.push(`data-piece-empty="${empty.join(' ')}"`);
      }
      if (p.value_of) attrs.push(`data-value-of="${esc(p.value_of)}"`);
      attrs.push(textAttrs(uk, en).trim());
      inner = esc(uk);
      break;
    }
    case 'Button':
      inner = (p.icon ? icon(C.icons.get(p.icon)) : '') + ('key' in p || 'text' in p ? textSpan() : '') + '<span class="tv-focus"></span>' + kids();
      break;
    case 'OptionButton':
      inner = `${textSpan()}<span class="gd-arrow tv-arrow">${C.icons.get(ARROW_ICON).svg}</span><span class="tv-focus"></span>`;
      break;
    case 'LineEdit':
      if ('text' in p && p.text !== '') {
        // The sample value is a data text (the page contract), so the fit tool measures it against the field.
        const uk = sampleText(p.text, 'uk'), en = sampleText(p.text, 'en');
        inner = `<span class="gd-text" data-text="${DATA_TEXT}"${textAttrs(uk, en)}>${esc(uk)}</span>`;
      } else if (!('placeholder' in p)) {
        // An empty field keeps one line of its font, as Godot's LineEdit minimum height does: a zero-width space.
        inner = '<span class="gd-text" aria-hidden="true">&#8203;</span>';
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
      // A sample colour (content data) tints the icon through its currentColor; it is page data, not a theme colour.
      if (p.self_modulate) attrs.push(`style="color: ${p.self_modulate}"`);
      inner = C.icons.get(p.icon).svg;
      break;
    case 'HSlider': {
      // pages/components/emit-css.js emitSlider: the track, the grabber-area (fill and grabber), the rest, the ring.
      const r = (p.value - p.min_value) / (p.max_value - p.min_value);
      attrs.push(`style="--value: ${fmt4(r)}"`);
      const knob = C.icons.get(p.editable === false ? KNOB_DISABLED_ICON : KNOB_ICON);
      inner = `<i class="tv-slider"></i><span class="tv-grabber-area"><i class="tv-fill"></i><span class="tv-grabber gd-knob">${knob.svg}</span></span>`
        + '<i class="tv-rest"></i><span class="tv-focus"></span>';
      break;
    }
    case 'VScrollBar': {
      const range = p.max_value - p.min_value;
      attrs.push(`style="--value: ${fmt4((p.value - p.min_value) / range)}; --page: ${fmt4(p.page / range)}"`);
      inner = SCROLL_BAR_INNER;
      break;
    }
    case 'ScrollContainer': {
      // The view scrolls (its native bar hidden); the drawn bar is ToyScrollBar, shown and sized by page.js (Godot's
      // update_scrollbars: visible when the child's minimum height is more than the view's height).
      ctx.used.add(SCROLL_BAR);
      if (p.scroll_vertical) attrs.push(`data-scroll-v="${p.scroll_vertical}"`);
      inner = `<div class="gd-scroll-view">${kids()}</div><div class="gd-VScrollBar tv-${SCROLL_BAR}" data-bar-of="${esc(n.path)}" aria-hidden="true" style="--value: 0; --page: 1">${SCROLL_BAR_INNER}</div>`;
      break;
    }
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
.gd-PanelContainer, .gd-MarginContainer, .gd-CenterContainer { display: grid; grid-auto-columns: minmax(min-content, auto); grid-auto-rows: minmax(min-content, auto); }
.gd-TextureRect { display: grid; contain: size; }
.gd-VBoxContainer { display: grid; grid-auto-flow: row; grid-template-columns: minmax(min-content, 1fr); align-content: start; }
.gd-HBoxContainer { display: grid; grid-auto-flow: column; grid-template-rows: minmax(min-content, 1fr); justify-content: start; }
.gd-GridContainer { display: grid; justify-content: start; align-content: start; }
.gd-ScrollContainer { display: grid; grid-template-columns: 1fr; }
.gd-scroll-view { grid-area: 1 / 1; display: grid; grid-template-rows: 0; overflow-x: hidden; overflow-y: auto; scrollbar-width: none; min-width: min-content; }
.gd-scroll-view > .gd-node { align-self: start; }
.gd-ScrollContainer > .gd-VScrollBar { grid-area: 1 / 2; display: none; }
.gd-ScrollContainer[data-vscroll="1"] > .gd-VScrollBar { display: flex; }
.gd-Label { display: flex; flex-direction: column; justify-content: flex-start; white-space: nowrap; text-align: left; }
.gd-Button { display: flex; align-items: center; justify-content: center; white-space: nowrap; }
.gd-Button.gd-content { display: grid; justify-content: stretch; align-items: stretch; }
.gd-OptionButton { display: flex; align-items: center; justify-content: space-between; white-space: nowrap; }
.gd-label { white-space: nowrap; }
.gd-LineEdit { display: flex; align-items: center; white-space: nowrap; overflow: hidden; contain: inline-size; }
.gd-icon { display: grid; flex: none; }
.gd-arrow { display: grid; flex: none; }
.gd-caret { display: block; flex: none; align-self: stretch; width: calc(2 * var(--px)); }
.gd-anchor { position: absolute; display: flex; pointer-events: none; }
.gd-anchor > .gd-node { width: min-content; }
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

// The expand margins [left, top, right, bottom] of a Panel or PanelContainer variation's panel StyleBox.
function expandOf(C, v) {
  if (!v || !v.styleboxes.includes('panel')) return [0, 0, 0, 0];
  return ['left', 'top', 'right', 'bottom'].map((side) => packPx(C, v, `panel.expand-margin-${side}`));
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

// A track is never smaller than its children's minimum sizes, as in Godot, where a control's minimum is the larger of
// its custom_minimum_size and its content's: minmax(min-content, …) takes the children's min-content contributions
// (a child's min-width counts only up to its content), where a plain auto or fr track would take its min-width alone.
const track = (expands, ratio) => (expands ? `minmax(min-content, ${fmt(ratio)}fr)` : 'minmax(min-content, auto)');
function tracksFor(n, st) {
  const kids = n.children.filter((c) => c.eff.has(st));
  if (!kids.length) return null;
  if (n.type === 'VBoxContainer' || n.type === 'HBoxContainer') {
    const ax = n.type === 'VBoxContainer' ? 'v' : 'h';
    return { [n.type === 'VBoxContainer' ? 'grid-template-rows' : 'grid-template-columns']: kids.map((c) => track(FLAGS[c.flags[ax]][0], c.flags.ratio)).join(' ') };
  }
  const cols = merged(n, st).columns;
  const colX = new Array(Math.min(cols, kids.length)).fill(false);
  const rowX = new Array(Math.ceil(kids.length / cols)).fill(false);
  kids.forEach((c, i) => {
    if (FLAGS[c.flags.h][0]) colX[i % cols] = true;
    if (FLAGS[c.flags.v][0]) rowX[Math.floor(i / cols)] = true;
  });
  return {
    'grid-template-columns': colX.map((x) => track(x, 1)).join(' '),
    'grid-template-rows': rowX.map((x) => track(x, 1)).join(' '),
  };
}

function layoutCss(screens, C) {
  const out = [LAYOUT_HEAD.replace(/\n$/, '')];
  const arrow = C.icons.get(ARROW_ICON);
  if (arrow) out.push(`.gd-arrow { width: ${len(arrow.w)}; height: ${len(arrow.h)}; }`);
  // An HSlider's grabber at its texture's size; while its bar shows, a ScrollContainer is two columns, the view and the
  // bar at its minimum width (its scroll StyleBox's inline content margins), the gap between them its variation's
  // scrollbar_h_separation (the column gap in the components CSS; Godot's default 0 without one).
  const knob = C.icons.get(KNOB_ICON);
  if (knob) out.push(`.gd-knob { width: ${len(knob.w)}; height: ${len(knob.h)}; }`);
  const sb = C.pack.variations[SCROLL_BAR];
  if (sb) out.push(`.gd-ScrollContainer[data-vscroll="1"] { grid-template-columns: 1fr ${len(Math.max(packPx(C, sb, 'scroll.content-margin-left') + packPx(C, sb, 'scroll.content-margin-right'), packPx(C, sb, 'grabber.content-margin-left') + packPx(C, sb, 'grabber.content-margin-right')))}; }`);
  const rule = (sel, decls) => { if (decls.size) out.push(`${sel} { ${[...decls].map(([k, x]) => `${k}: ${x};`).join(' ')} }`); };
  for (const S of screens) {
    out.push(`/* ${S.id}: ${S.title} */`);
    for (const n of S.all) {
      const sel = `[data-node="${n.path}"]`;
      const own = new Map();
      const raw = n.raw;
      const p = merged(n, S.stateIds.find((st) => n.eff.has(st)) || S.stateIds[0]);
      const v = p.variation ? C.pack.variations[p.variation] : null;
      // The variation's own size constants (a slot, the mic plate, a keycap's min-width: a minimum in Godot, as the
      // components CSS draws them) stay when this rule sets min-width or min-height too.
      const fixed = fixedSize(n, p, C);
      const minW = n.place === 'anchored' || n.cmin[0] > 0 ? fixed[0] : 0;
      const minH = n.place === 'anchored' || n.cmin[1] > 0 ? fixed[1] : 0;
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
        // A panel's expand margins draw outside its rect: the components CSS gives the box negative margins, so the box
        // is the anchor rect plus the expand margins (ToySwatchSelected's ring), never cut back to the rect.
        const ex = expandOf(C, v);
        const ew = ex[0] + ex[2], eh = ex[1] + ex[3];
        own.set('min-width', minW > 0 ? `max(${pctLen(1, ew)}, ${len(minW + ew)})` : pctLen(1, ew));
        own.set('min-height', minH > 0 ? `max(${pctLen(1, eh)}, ${len(minH + eh)})` : pctLen(1, eh));
      } else {
        if (minW > 0) own.set('min-width', len(minW));
        if (minH > 0) own.set('min-height', len(minH));
        if (n.place === 'stack' || n.place === 'center' || n.place === 'content') own.set('grid-area', '1 / 1');
        if (n.place === 'center') { own.set('justify-self', 'center'); own.set('align-self', 'center'); }
        else {
          // fill is the grid default (stretch); only shrink positions are written.
          if (n.flags.h !== 'fill' && n.flags.h !== 'expand_fill') own.set('justify-self', FLAGS[n.flags.h][1]);
          if (n.flags.v !== 'fill' && n.flags.v !== 'expand_fill') own.set('align-self', FLAGS[n.flags.v][1]);
        }
      }
      // The gaps of a box or grid are its spacing variation's (the components CSS); without one it has a single child.
      if (n.type === 'VBoxContainer' || n.type === 'HBoxContainer') {
        const vb = n.type === 'VBoxContainer';
        if (p.alignment !== 'begin') own.set(vb ? 'align-content' : 'justify-content', p.alignment === 'center' ? 'center' : 'end');
      }
      const clip = clipsText(p);
      const cut = trimsWithEllipsis(p) ? 'ellipsis' : 'clip';
      if (n.type === 'Label') {
        if (p.horizontal_alignment !== 'left') own.set('text-align', p.horizontal_alignment === 'fill' ? 'justify' : p.horizontal_alignment);
        if (clip) {
          // A cut text adds no width (contain), and is cut at the Label's width with Godot's trim: a block box, its
          // vertical alignment by align-content.
          own.set('display', 'block');
          own.set('contain', 'inline-size');
          own.set('overflow', 'hidden');
          own.set('text-overflow', cut);
          if (p.vertical_alignment === 'center') own.set('align-content', 'center');
          if (p.vertical_alignment === 'bottom') own.set('align-content', 'end');
        } else {
          if (p.vertical_alignment === 'center') own.set('justify-content', 'center');
          if (p.vertical_alignment === 'bottom') own.set('justify-content', 'flex-end');
        }
        if (p.autowrap_mode !== 'off') {
          own.set('white-space', 'normal');
          own.set('contain', 'inline-size');
          // arbitrary breaks anywhere; word_smart breaks at words and force-breaks a word longer than the line
          // (TextServer AUTOWRAP_WORD_SMART), which overflow-wrap: anywhere does.
          if (p.autowrap_mode === 'arbitrary' || p.autowrap_mode === 'word_smart') own.set('overflow-wrap', 'anywhere');
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
      if ((n.type === 'Button' || n.type === 'OptionButton') && clip) {
        // A cut Button text adds no width and fills the space its Button gets, aligned as the Button aligns it.
        const align = n.type === 'OptionButton' ? 'left' : p.alignment;
        rule(`${sel} > .gd-label`, new Map([['contain', 'inline-size'], ['flex-grow', '1'], ['overflow', 'hidden'], ['text-overflow', cut], ['text-align', align]]));
      }
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
      // The screen's note (what it leaves out, what shows with it), then the shown state's note.
      + (S.note ? `<p class="pg-screen-note" lang="en">${esc(S.note)}</p>` : '')
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
    `<div class="pg-controls">${seg('lang', 'Мова', [['uk', 'UA'], ['en', 'EN']])}${seg('text', 'Текст', [['default', 'Звичайний'], ['large', 'Великий']])}${seg('zoom', 'Масштаб', [['fit', 'По ширині'], ['50', '50 %'], ['100', '100 %']])}</div>`,
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

// The icons a screen draws, each at the largest size it is drawn (px) and the svg/scale Godot imports it at, so that
// EXPAND_IGNORE_SIZE never stretches a small bitmap (Godot rasterises an SVG at import, svg/scale 1 = its viewBox).
// One file has one import setting, so the values are the pack's (assets: drawn_px and svg_scale, the largest over every
// screen, tools/tokens/icons.js); this screen's own measure is the fallback for an icon the pack does not list.
function iconImportNotes(S, C) {
  const best = new Map();
  const see = (name, px) => { if (C.icons.get(name)) best.set(name, Math.max(best.get(name) || 0, px)); };
  for (const n of S.all) {
    const icons = [n.raw.icon, ...Object.values(n.per).map((o) => o.raw.icon)].filter(Boolean);
    for (const name of icons) {
      const ic = C.icons.get(name);
      if (!ic) continue;
      if (n.type === 'TextureRect') see(name, Math.min(n.cmin[0] / ic.w, n.cmin[1] / ic.h) * Math.max(ic.w, ic.h));
      else see(name, n.raw.icon_size || Math.max(ic.w, ic.h));
    }
    // An OptionButton draws its arrow, and its open list the radio icons, at their own size.
    if (n.type === 'OptionButton') for (const k of [ARROW_ICON, ...LIST_ICONS]) { const a = C.icons.get(k); if (a) see(k, Math.max(a.w, a.h)); }
  }
  if (!best.size) return [];
  const tick = '`';
  const list = [...best].sort((a, b) => a[0].localeCompare(b[0])).map(([name, own]) => {
    const ic = C.icons.get(name);
    const px = ic.asset ? ic.asset.drawn_px : own;
    const scale = ic.asset ? ic.asset.svg_scale : Math.ceil((own / Math.max(ic.w, ic.h)) * 100) / 100;
    return `${tick}${name}${tick} ${scale} (${fmt(px)} px)`;
  });
  return [
    `- Icons: the tinted ones are white SVGs in ${tick}${GAME_ICONS}/${tick} (the pack's copy of ${tick}pages/components/icons${tick}, currentColor written as white): a TextureRect tints one with the ${tick}self_modulate${tick} its line gives (the colour the page draws it in), a Button with its variation's ${tick}icon_*_color${tick}, an OptionButton its arrow with ${tick}modulate_arrow${tick}. The room pictograms are white copies too (${tick}${GAME_ICONS}/room/${tick}), drawn in ink: their lines give the ${tick}self_modulate${tick}. The pack's ${tick}assets${tick} list every icon with its tint and ${tick}svg_scale${tick}.`,
    `- SVG import: Godot rasterises an SVG at import, so import each at ${tick}svg/scale${tick} = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's ${tick}assets${tick} give it): ${list.join(', ')}.`,
  ];
}

// The deck keys the screen draws, and the keys only its notes name (the developer wires those too).
function keysSection(S, C) {
  const drawn = new Set();
  const named = new Set();
  const KEY_RE = /\b[a-z][a-z0-9_]*(?:\.[a-z0-9_]+)+\b/g;
  const scan = (s) => { for (const m of String(s || '').match(KEY_RE) || []) if (C.byKey.has(m)) named.add(m); };
  scan(S.note);
  for (const st of S.states) scan(st.note);
  for (const n of S.all) {
    for (const o of [n.raw, ...Object.values(n.per).map((x) => x.raw)]) {
      for (const f of ['key', 'placeholder']) if (typeof o[f] === 'string' && C.byKey.has(o[f])) drawn.add(o[f]);
      if (Array.isArray(o.items)) for (const k of o.items) if (C.byKey.has(k)) drawn.add(k);
    }
    scan(n.raw.note);
  }
  const code = (k) => '`' + k + '`';
  const only = [...named].filter((k) => !drawn.has(k)).sort();
  const out = ['## Keys', '', `- **Drawn** (${drawn.size}): ${[...drawn].sort().map(code).join(', ')}.`];
  if (only.length) out.push(`- **Named only in the notes** (wire them too): ${only.map(code).join(', ')}.`);
  return out;
}

// Every handoff ends with the stacking of the session's screens and who takes Esc and M (the agent's choice, recorded
// in docs/ui-decisions.md), so that two developers stack them the same way.
const LAYERS_MD = [
  '## Layers and input (every screen)',
  '',
  '| CanvasLayer | What |',
  '|---|---|',
  '| 1 | Name plates in the world (s4, s7) |',
  '| 2 | HUD: the round HUD (s7), downed and spectating (s9), the lobby HUD (s4), the tutorial\'s lesson plates (s1) |',
  '| 3 | Map and tasks (s8), with its how-to card |',
  '| 4 | Esc menu (s5) and its dim |',
  '| 5 | The Esc menu\'s confirm dialog |',
  '| 6 | Black screens: connecting and loading (s3), pre game (s6), post game (s10) |',
  '',
  '- The main menu (s2) is its own scene, under none of these.',
  '- Esc closes the topmost open overlay first (a how-to card, then the map; in the Esc menu its confirm dialog, then the menu) and opens the Esc menu only when nothing else is open. M is ignored while the Esc menu is open.',
];

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
    } else if (n.place === 'content') {
      // The content of a Button without text: Godot places a Button's children by anchors, so it fills the Button's
      // content rect with a full-rect anchor inset by the idle StyleBox's content margins.
      const pv = n.parent.raw.variation ? C.pack.variations[n.parent.raw.variation] : null;
      const m = ['left', 'top', 'right', 'bottom'].map((side) => packPx(C, pv, `normal.content-margin-${side}`));
      bits.push(`the Button's content: anchors \`full_rect\`, offsets ${fmt(m[0])}, ${fmt(m[1])}, ${fmt(-m[2])}, ${fmt(-m[3])} (the \`normal\` StyleBox's content margins), mouse_filter \`MOUSE_FILTER_IGNORE\` on it and every node inside`);
    } else {
      const f = [];
      if (n.flags.h !== 'fill') f.push(`horizontal \`${FLAG_GODOT[n.flags.h]}\``);
      if (n.flags.v !== 'fill') f.push(`vertical \`${FLAG_GODOT[n.flags.v]}\``);
      if (n.flags.ratio !== 1) f.push(`stretch_ratio ${fmt(n.flags.ratio)}`);
      if (f.length) bits.push(`size flags ${f.join(', ')}`);
    }
    // custom_minimum_size: the node's own, and the variation's size constants (theme constants width, height,
    // min_width, wide_width, wide_min_width), which component code reads in (tokens spec §4): a Panel or PanelContainer
    // takes no size from them on its own.
    const sv = p.variation ? C.pack.variations[p.variation] : null;
    const sizeKey = (axis) => {
      const has = (k) => !!(sv && C.pack.tokens[`${sv.prefix}.size.${k}`]);
      if (axis === 'y') return has('height') ? 'height' : null;
      if (p.wide) return has('wide-width') ? 'wide-width' : has('wide-min-width') ? 'wide-min-width' : null;
      return has('width') ? 'width' : has('min-width') ? 'min-width' : null;
    };
    const axisPart = (i, k) => {
      const own = n.cmin[i];
      if (!k) return { px: own, code: fmt(own) };
      const c = packPx(C, sv, `size.${k}`);
      if (own > c) return { px: own, code: fmt(own) };
      return { px: c, code: `get_theme_constant("${k.replace(/-/g, '_')}", "${p.variation}")` };
    };
    const kx = sizeKey('x'), ky = sizeKey('y');
    if (kx || ky) {
      const x = axisPart(0, kx), y = axisPart(1, ky);
      bits.push(`custom_minimum_size (${fmt(x.px)}, ${fmt(y.px)}) = Vector2(${x.code}, ${y.code})${p.wide ? ' (wide)' : ''}`);
    } else if (n.cmin[0] || n.cmin[1]) bits.push(`custom_minimum_size (${fmt(n.cmin[0])}, ${fmt(n.cmin[1])})`);
    if (v && v.base) bits.push('placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper');
    const T = n.type;
    if (n.G.spacing && v) bits.push(`${T === 'ScrollContainer' ? 'the gap between the child and the bar' : 'gaps'} from the variation: ${n.G.spacing.map((k) => `${k.replace(/-/g, '_')} ${packPx(C, v, `items.${k}`)}`).join(', ')}`);
    if (T === 'VBoxContainer' || T === 'HBoxContainer') {
      if (p.alignment !== 'begin') bits.push(`alignment \`ALIGNMENT_${p.alignment.toUpperCase()}\``);
    }
    if (T === 'GridContainer') bits.push(`columns ${p.columns}`);
    if (T === 'ScrollContainer') {
      bits.push(`horizontal_scroll_mode \`SCROLL_MODE_DISABLED\` (vertical scrolling only); \`get_v_scroll_bar().theme_type_variation = &"${SCROLL_BAR}"\`; the bar shows when the child is taller`);
      if (p.scroll_vertical) bits.push(`shown scrolled: scroll_vertical ${p.scroll_vertical} (review only)`);
    }
    if (T === 'HSlider') {
      bits.push(`value ${fmt(p.value)} (min_value ${fmt(p.min_value)}, max_value ${fmt(p.max_value)}, step ${fmt(p.step)})`);
      if (p.editable === false) bits.push('editable false');
      if (p.state === 'hover') bits.push('shown hovered (review only)');
      if (p.state === 'focus') bits.push('shown with keyboard focus (grab_focus; the ring: see the notes)');
    }
    if (T === 'VScrollBar') {
      bits.push(`value ${fmt(p.value)}, page ${fmt(p.page)} (min_value ${fmt(p.min_value)}, max_value ${fmt(p.max_value)})`);
      if (p.state !== 'normal') bits.push(`shown ${{ hover: 'hovered', held: 'dragged', focus: 'focused' }[p.state]} (review only)`);
    }
    const sample = (x) => (typeof x === 'string' ? quote(x) : `${quote(x.en)} / ${quote(x.uk)}`);
    const text = (k) => {
      if (!('key' in p)) return `text from data (auto_translate_mode = DISABLED), sample: ${sample(p.text)}`;
      const e = C.byKey.get(p[k]);
      const how = p.value_of ? `the value of {${p.value_of}} in \`${p.key}\``
        : isInt(p.piece) ? `piece ${p.piece} of \`tr("${p.key}")\` split at ${SPLIT.map((x) => `{${x}}`).join('/')} (strip_edges(); hidden when the piece is empty)`
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
    if ((T === 'Label' || T === 'Button' || T === 'OptionButton') && clipsText(p)) {
      if (p.clip_text) bits.push('clip_text true');
      if (p.text_overrun_behavior !== 'no_trimming') bits.push(`text_overrun_behavior \`OVERRUN_${p.text_overrun_behavior.toUpperCase()}\``);
    }
    if (T === 'Button' || T === 'OptionButton') {
      if (p.key || 'text' in p) bits.push(text('key'));
      if (langChipOf(n, p)) bits.push('button_pressed while this is the game\'s language (TranslationServer.get_locale()); the page draws the shown language\'s chip pressed');
      if (n.content) bits.push('no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button\'s minimum size does not follow its children, so custom_minimum_size holds the content at large text');
      if (p.icon) {
        const ic = C.icons.get(p.icon);
        bits.push(`icon \`${p.icon}\` (${ic.game}, ${ic.licence}) at ${p.icon_size || Math.max(ic.w, ic.h)} px${ic.tinted ? `, tinted by \`${p.variation}\`'s icon_*_color` : ''}`);
      }
      if (T === 'Button' && p.alignment !== 'center') bits.push(`alignment \`${p.alignment.toUpperCase()}\``);
      if (T === 'Button' && 'h_separation' in n.raw) bits.push(`theme_override_constants/h_separation ${p.h_separation}`);
      if (T === 'OptionButton') {
        const arrow = C.icons.get(ARROW_ICON);
        const mod = v && C.pack.tokens[`${v.prefix}.items.modulate-arrow`];
        bits.push(`arrow: theme icon \`arrow\` (${arrow.game})${mod ? ', tinted by the font colour (modulate_arrow)' : ''}`);
        bits.push(`\`get_popup().theme_type_variation = &"${LIST_VARIATION}"\` (its open list, see the notes)`);
      }
      if (T === 'OptionButton' && Array.isArray(p.items)) bits.push(`items ${p.items.map((x) => `\`${x}\``).join(', ')}`);
      if (p.toggle_mode) bits.push(`toggle_mode true, button_pressed ${BUTTON_STATES[p.state][0]}${BUTTON_STATES[p.state][0] ? (C.pack.variations[p.variation] && C.pack.variations[p.variation].toggle ? ` (ToyToggle draws \`${name}\`)` : ' (its own `pressed` StyleBox; the variation has no toggle partner)') : ''}`);
      const st2 = String(p.state).replace(/^selected-?/, '') || 'normal';
      if (st2 === 'disabled') bits.push('disabled true');
      else if (st2 === 'focus') bits.push('shown with keyboard focus (grab_focus)');
      else if (st2 === 'hover' || st2 === 'held') bits.push(`shown ${st2 === 'hover' ? 'hovered' : 'held down'} (review only)`);
    }
    if (T === 'LineEdit') {
      if ('text' in p && p.text !== '') bits.push(`text (sample data) ${sample(p.text)}`);
      else if (!p.placeholder) bits.push('empty (no text, no placeholder)');
      if (p.placeholder) {
        const e = C.byKey.get(p.placeholder);
        bits.push(`placeholder_text \`${p.placeholder}\`: en ${quote(e.en[0])} · uk ${quote(e.uk[0])}`);
      }
      if (p.editable === false) bits.push('editable false');
      bits.push('context_menu_enabled false (Godot\'s right-click menu would show untranslated English labels; see the notes)');
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
      bits.push(`texture \`${p.icon}\` (${ic.game}${ic.white ? ', white' : ''}, ${ic.licence}), expand_mode \`EXPAND_IGNORE_SIZE\`, stretch_mode \`STRETCH_KEEP_ASPECT_CENTERED\``);
      if (p.theme_color) bits.push(`self_modulate = get_theme_color("${p.theme_color.replace(/-/g, '_')}", "${surface.name}")`);
      else if (p.self_modulate) bits.push(`self_modulate from data (a content colour, not a theme colour), sample ${p.self_modulate}`);
      // An icon with no tint of its own draws in the text colour of its context (as the page draws it).
      else if (ic.tinted) bits.push(`self_modulate = get_theme_color("font_color", "${surface.context === 'light' ? 'ToyTextOnLight' : 'ToyTextOnDark'}")`);
      else if (ic.tintColor) bits.push(`self_modulate ${ic.tintColor} (the colour the pages draw it in; the pack's copy is white)`);
      else bits.push('not tinted (drawn in its own colours)');
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
      lines(n.children, st, isSurfaceOf(v, n) ? { name, context: v.context === 'any' ? surface.context : v.context } : surface, depth + 1, acc);
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
  out.push('- **How to read it:** the roots are children of the screen\'s full-rect root `Control`; every property not listed keeps Godot\'s default; sizes and offsets are reference px. In a state\'s **Shown** list, the first node of each subtree gives its path from the screen root.');
  out.push('- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu\'s Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).');
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
        for (const x of shown) {
          if (x.n !== t.n && !x.n.path.startsWith(t.n.path + '/')) continue;
          // The top of a shown subtree names its path from the screen root, so the developer finds where it goes.
          const line = x.n === t.n ? x.line.replace(/^\*\*[^*]+\*\*/, `**${x.n.path.slice(S.id.length + 1)}**`) : x.line;
          out.push(item({ ...x, line, depth: x.depth - t.depth + 1 }));
        }
      }
    }
  }
  out.push('');
  out.push('## Notes');
  out.push('');
  out.push('- The review page emulates Godot\'s containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.');
  const usedVars = S.all.map((n) => C.pack.variations[n.raw.variation]).filter(Boolean);
  if (usedVars.some((v) => v.base)) out.push('- A raised variation is built as the tokens spec (§6) says: a `ToyRaised` MarginContainer holding first the base `Panel` (the base named above, chosen by the context it sits in), then the face. The wrapper is the node in its parent: anchors, offsets, grow, size flags, stretch ratio, custom_minimum_size and visibility belong to the wrapper; the variation, the text, toggle_mode, disabled, focus and the signals belong to the face. Hide or show the wrapper, not the face.');
  if (S.all.some((n) => { const sv = C.pack.variations[n.raw.variation]; return sv && Object.keys(C.pack.tokens).some((k) => k.startsWith(`${sv.prefix}.size.`)); })) out.push('- Size constants: a variation\'s `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.');
  out.push(...iconImportNotes(S, C));
  if (S.all.some((n) => n.type === 'OptionButton')) {
    const g = (k) => `\`${C.icons.get(k).game}\``;
    out.push(`- An OptionButton's open list is its \`get_popup()\`, a PopupMenu in a window of its own: set its \`theme_type_variation\` to \`${LIST_VARIATION}\` in code when the scene is ready (a cream list with the dropdown's ink outline, a lavender hovered or keyboard-focused row). The selected item shows the theme icon \`radio_checked\` (${g('radio-checked')}, \`radio_checked_disabled\` ${g('radio-checked-disabled')}); the others \`radio_unchecked\` and \`radio_unchecked_disabled\` (${g('radio-unchecked')}, empty, so every label starts at the same x). PopupMenu does not tint these icons, so they are drawn in their own colours (not white; the pack names them in the variation's \`textures\`). Its rounded corners need the default embedded subwindows (\`display/window/subwindows/embed_subwindows\` true).`);
  }
  if (S.all.some((n) => n.type === 'LineEdit')) out.push('- A LineEdit\'s right-click menu is a PopupMenu too, but its labels (Cut, Copy, Paste, Select All, Clear, Undo, Redo, Text Writing Direction, …) are Godot\'s English source strings, translated at run time only through translations of those exact strings, which the copy deck (keyed, copy/strings.csv) does not have: in Ukrainian they would show in English. So LineEdits keep `context_menu_enabled = false`; the keyboard shortcuts (copy, paste, select all, undo) still work.');
  if (S.all.some((n) => n.G.spacing)) out.push('- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.');
  if (S.all.some((n) => n.type === 'HSlider')) out.push(`- An HSlider's grabber is a texture: the theme icons \`grabber\` and \`grabber_highlight\` are \`${C.icons.get(KNOB_ICON).game}\`, \`grabber_disabled\` \`${C.icons.get(KNOB_DISABLED_ICON).game}\` (own work, in their own colours, not tinted; the pack names them in the variation's \`textures\`). Slider draws no focus StyleBox of its own: draw the variation's \`focus\` StyleBox over the slider while it has visible focus.`);
  if (S.all.some((n) => n.type === 'ScrollContainer')) out.push(`- A ScrollContainer's bar is its own \`VScrollBar\`: set its \`theme_type_variation\` to \`${SCROLL_BAR}\` in code (\`get_v_scroll_bar()\`); the child fills the width (\`SIZE_EXPAND_FILL\`) and keeps its minimum height.`);
  out.push('');
  out.push(...keysSection(S, C));
  out.push('');
  out.push(...LAYERS_MD);
  return out.join('\n') + '\n';
}

// ---------------------------------------------------------------------------------------------------------------

// A private page goes outside the repo (it is never committed): null when `file` is fine, else why not.
function privateOutProblem(file) {
  const abs = path.resolve(file);
  const r = path.relative(ROOT, abs);
  if (!r || (!r.startsWith('..') && !path.isAbsolute(r))) return `${file} is inside the repo; write a private page outside it (for example to your temp folder)`;
  if (!/\.html?$/i.test(abs)) return `${file}: a private page is an .html file`;
  return null;
}

function main(argv) {
  const usage = 'usage: node pages/screens/build.js [--check | --validate [s2 ...] | --handoff s2 | --out <file.html> s2 [s5 ...]]';
  let out = null;
  const oi = argv.indexOf('--out');
  if (oi >= 0) {
    out = argv[oi + 1];
    if (!out || out.startsWith('--')) { console.error(`--out needs a file\n${usage}`); return 2; }
    argv = argv.slice(0, oi).concat(argv.slice(oi + 2));
  }
  const mode = out ? 'private' : argv.includes('--check') ? 'check' : argv.includes('--validate') ? 'validate' : argv.includes('--handoff') ? 'handoff' : 'write';
  const flags = argv.filter((a) => a.startsWith('--'));
  const ids = argv.filter((a) => !a.startsWith('--')).map((a) => {
    const m = /^s0*(\d+)(?:-[a-z-]+)?(?:\.json)?$/.exec(a);
    return m ? `s${m[1]}` : a;
  });
  if (flags.length > (out ? 0 : 1) || flags.some((f) => !['--check', '--validate', '--handoff'].includes(f))) { console.error(usage); return 2; }
  if ((mode === 'write' || mode === 'check') && ids.length) { console.error(usage); return 2; }
  if (mode === 'handoff' && ids.length !== 1) { console.error(usage); return 2; }
  if (mode === 'private') {
    if (!ids.length) { console.error(`--out builds the screens you name: --out <file.html> s2 [s5 ...]\n${usage}`); return 2; }
    const why = privateOutProblem(out);
    if (why) { console.error(`error: ${why}`); return 2; }
  }
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
    // The handoffs (docs/handoff/s05-esc-menu.md …): the prime-game issues link to them.
    for (const S of screens) outputs.push([`${OUT_HANDOFF}/${S.file.replace(/\.json$/, '.md')}`, handoff(S, C)]);
    const handoffDir = path.join(ROOT, OUT_HANDOFF);
    const strayHandoffs = () => {
      let list = [];
      try { list = fs.readdirSync(handoffDir).filter((x) => x.endsWith('.md')); } catch (e) { list = []; }
      return list.map((x) => `${OUT_HANDOFF}/${x}`).filter((x) => !outputs.some(([o]) => o === x));
    };
    for (const [file, text] of outputs) if (/\r/.test(text)) { console.error(`error: ${file} would contain CR bytes`); return 1; }
    if (mode === 'private') {
      // The page inlines both stylesheets, so it is the one file to write.
      const abs = path.resolve(out);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, outputs[2][1]);
      console.log(`wrote ${abs} (${Math.round(Buffer.byteLength(outputs[2][1]) / 1024)} KB): ${screens.map((S) => `${S.id} (${S.stateIds.length} states)`).join(', ')}`);
      console.log(`measure it: node tools/screens/fit.js --page "${abs}"; pictures: node tools/screens/shots.js --page "${abs}"`);
      return 0;
    }
    if (mode === 'check') {
      const stale = [];
      for (const [file, text] of outputs) {
        let disk = null;
        try { disk = fs.readFileSync(path.join(ROOT, file), 'utf8'); } catch (e) { disk = null; }
        if (disk !== text) stale.push(`${file} (${disk === null ? 'missing' : 'differs'})`);
      }
      for (const x of strayHandoffs()) stale.push(`${x} (no screen source)`);
      if (stale.length) { console.log(`stale: ${stale.join(', ')}; run node pages/screens/build.js`); return 1; }
      console.log(`up to date: ${outputs.map(([f]) => f).join(', ')}`);
      return 0;
    }
    fs.mkdirSync(handoffDir, { recursive: true });
    for (const x of strayHandoffs()) fs.unlinkSync(path.join(ROOT, x));
    for (const [file, text] of outputs) fs.writeFileSync(path.join(ROOT, file), text);
    const kb = (t) => `${Math.round(Buffer.byteLength(t) / 1024)} KB`;
    console.log(`wrote ${outputs.slice(0, 3).map(([f, t]) => `${f} (${kb(t)})`).join(', ')} and ${outputs.length - 3} handoff(s) in ${OUT_HANDOFF}; screens: ${screens.map((S) => S.id).join(', ') || 'none yet'}`);
    return 0;
  } catch (e) {
    if (e instanceof BuildError || /^emit-css:|^tokens:/.test(e.message)) { console.error(`error: ${e.message}`); return 1; }
    throw e;
  }
}

module.exports = { main, validateAll, readSources, loadInputs, readPack, handoff, renderNode, renderPage, layoutCss, uiCss, GODOT, PRESETS, FLAGS, BACKGROUNDS };

if (require.main === module) process.exitCode = main(process.argv.slice(2));
