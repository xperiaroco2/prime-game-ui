// Completion and expansion of the component tier (spec §3.5 "Completion", §5 ramp, §7.4 Variant objects).
// collectVariants() reads the variant groups once; expandAll() builds, per permutation, the complete StyleBox records,
// the press, label, items, size and ramp fields and the derived health stops.
// Node 20, no packages.
'use strict';

const { isObj } = require('./resolve.js');
const { parseHex, toHex, mixOklab, round4 } = require('../lib/color.js');

const SIDES = ['left', 'top', 'right', 'bottom'];
const CORNERS = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
const BOX_FIELDS = ['bg-color', 'draw-center', 'border-color',
  ...SIDES.map((s) => `border-width-${s}`), ...CORNERS.map((c) => `corner-radius-${c}`),
  ...SIDES.map((s) => `content-margin-${s}`), ...SIDES.map((s) => `expand-margin-${s}`)];
const FONT_FIELDS = ['font-color', 'font-shadow-color'];
// The authoring names of a state group (§3.5 "StyleBox fields (authoring forms)").
const AUTHOR_BOX = ['bg-color', 'border-color', 'border-width', ...SIDES.map((s) => `border-width-${s}`),
  'corner-radius', ...CORNERS.map((c) => `corner-radius-${c}`),
  'content-margin', 'content-margin-block', 'content-margin-inline', ...SIDES.map((s) => `content-margin-${s}`),
  'expand-margin', 'expand-margin-block', 'expand-margin-inline', ...SIDES.map((s) => `expand-margin-${s}`)];

// §3.5 "State groups per class" and P42. `textures`: the class's theme icons a variant may name in godot.textures (P61),
// kebab-case like items (godot-facts §9 table: option_button.cpp binds `arrow`; slider.cpp `grabber`,
// `grabber_highlight`, `grabber_disabled`, `tick`). A class without the list takes none.
const CLASSES = {
  Button: { states: ['normal', 'hover', 'pressed', 'hover-pressed', 'disabled', 'focus'],
    font: ['normal', 'hover', 'pressed', 'hover-pressed', 'disabled', 'focus'], shadow: [], label: true, press: true },
  OptionButton: { states: ['normal', 'hover', 'pressed', 'hover-pressed', 'disabled', 'focus'],
    font: ['normal', 'hover', 'pressed', 'hover-pressed', 'disabled', 'focus'], shadow: [], label: true, press: false,
    textures: ['arrow'] },
  LineEdit: { states: ['normal', 'focus', 'read-only'], font: ['normal', 'read-only'], shadow: [], label: true, press: false },
  PanelContainer: { states: ['panel'], font: [], shadow: [], label: false, press: false },
  Panel: { states: ['panel'], font: [], shadow: [], label: false, press: false },
  Label: { states: ['normal'], font: ['normal'], shadow: ['normal'], label: true, press: false },
  ProgressBar: { states: ['background', 'fill'], font: [], shadow: [], label: false, press: false, ramp: true },
  // HSlider (slider.cpp binds slider, grabber_area, grabber_area_highlight; its grabber, grabber_highlight and
  // grabber_disabled icons are textures, not tokens). `focus` is the Toy outer ring: Godot 4.7.2's Slider draws no focus
  // StyleBox itself, so the game draws this one over the slider while it has visible focus.
  HSlider: { states: ['slider', 'grabber-area', 'grabber-area-highlight', 'focus'], font: [], shadow: [], label: false, press: false,
    items: ['center-grabber', 'grabber-offset'], textures: ['grabber', 'grabber-highlight', 'grabber-disabled', 'tick'] },
  VScrollBar: { states: ['scroll', 'scroll-focus', 'grabber', 'grabber-highlight', 'grabber-pressed'], font: [], shadow: [], label: false,
    press: false, items: [] },
  // Containers draw nothing: their variations hold only the separation constants (the screens' gaps, space.*).
  VBoxContainer: { states: [], font: [], shadow: [], label: false, press: false, items: ['separation'], container: true },
  HBoxContainer: { states: [], font: [], shadow: [], label: false, press: false, items: ['separation'], container: true },
  GridContainer: { states: [], font: [], shadow: [], label: false, press: false, items: ['h-separation', 'v-separation'], container: true },
  // ScrollContainer (vertical scrolling only): scrollbar_h_separation is the gap between the content and the vertical
  // bar (Godot 4.7 class reference: "the space between the ScrollContainer's vertical scroll bar and its content").
  ScrollContainer: { states: [], font: [], shadow: [], label: false, press: false, items: ['scrollbar-h-separation'], container: true },
};
// The state an inheriting state completes from (the other states complete from StyleBoxFlat's defaults).
const INHERITS = {
  HSlider: { 'grabber-area-highlight': 'grabber-area' },
  VScrollBar: { 'scroll-focus': 'scroll', 'grabber-highlight': 'grabber', 'grabber-pressed': 'grabber' },
};
// The states that inherit nothing, where zero expand margins are omitted (P43).
const BASE_STATES = ['normal', 'panel', 'fill', 'background', 'slider', 'grabber-area', 'scroll', 'grabber'];
const PRESS_MEMBERS = ['depth', 'hover', 'held', 'disabled'];
const SIZE_NAMES = ['width', 'height', 'wide-width', 'min-width', 'wide-min-width'];
const CLEAR = { type: 'color', hex: '#000000', rgba: [0, 0, 0, 0] };

function collectVariants(model) {
  const def = model.permutations[0];
  const list = [];
  for (const n of model.nodes) {
    if (n.kind !== 'group' || n.tier !== 'component' || !def.fileSet.has(n.file)) continue;
    const g = n.ext && isObj(n.ext.godot) ? n.ext.godot : null;
    if (!g || !('variation' in g)) continue;
    list.push({
      node: n, prefix: n.path, file: n.file, pointer: n.pointer, godot: g,
      variation: typeof g.variation === 'string' ? g.variation : null,
      cls: typeof g.class === 'string' ? g.class : null,
      parent: typeof g.parent === 'string' ? g.parent : null,
      abstract: g.abstract === true,
      base: isObj(g.base) ? g.base : null,
      toggle: isObj(g.toggle) ? g.toggle : null,
      on: Array.isArray(g.on) ? g.on.filter((s) => typeof s === 'string') : null,
      textures: isObj(g.textures) ? g.textures : null,
      replacement: typeof g.replacement === 'string' ? g.replacement : null,
      deprecated: n.deprecated,
      context: typeof n.ext.context === 'string' ? n.ext.context : null,
      description: n.description,
      proposal: n.proposal,
      child: (name) => n.childMap.get(name),
    });
  }
  const byName = new Map();
  for (const v of list) if (v.variation && !byName.has(v.variation)) byName.set(v.variation, v);
  const selectedOf = new Map();
  for (const v of list) if (v.toggle && typeof v.toggle.selected === 'string') selectedOf.set(v.toggle.selected, v.variation);
  return { list, byName, selectedOf };
}

// The authored fields of one state group, expanded to sides and corners (per side > axis > shorthand).
function authored(stateNode, val) {
  const rec = {};
  if (!stateNode || stateNode.kind !== 'group') return rec;
  const m = new Map();
  for (const c of stateNode.children) if (c.kind === 'token') m.set(c.name, c);
  const field = (name) => (m.has(name) ? { value: val(m.get(name).path), source: m.get(name).path } : null);
  const set = (k, f) => { if (f) rec[k] = f; };
  set('bg-color', field('bg-color'));
  set('border-color', field('border-color'));
  const bw = field('border-width');
  for (const s of SIDES) set(`border-width-${s}`, field(`border-width-${s}`) || bw);
  const cr = field('corner-radius');
  for (const c of CORNERS) set(`corner-radius-${c}`, field(`corner-radius-${c}`) || cr);
  for (const kind of ['content-margin', 'expand-margin']) {
    const all = field(kind);
    const block = field(`${kind}-block`);
    const inline = field(`${kind}-inline`);
    for (const s of SIDES) set(`${kind}-${s}`, field(`${kind}-${s}`) || (s === 'top' || s === 'bottom' ? block : inline) || all);
  }
  for (const f of FONT_FIELDS) set(f, field(f));
  return rec;
}

const zero = () => ({ value: { type: 'dimension', px: 0 }, source: null });
const alphaOf = (f) => (f && f.value && Array.isArray(f.value.rgba) ? f.value.rgba[3] : 1);
const drawCenter = (bg) => ({ value: { type: 'boolean', value: alphaOf(bg) > 0 }, source: null });
const ordered = (r) => {
  const out = {};
  for (const k of BOX_FIELDS) out[k] = r[k];
  return out;
};

// A state that takes nothing from another: missing fields are StyleBoxFlat's defaults, content margins the border width.
function completeBase(partial, clear) {
  const r = {};
  r['bg-color'] = partial['bg-color'] || { value: clear, source: null };
  r['draw-center'] = drawCenter(r['bg-color']);
  r['border-color'] = partial['border-color'] || { value: clear, source: null };
  for (const s of SIDES) r[`border-width-${s}`] = partial[`border-width-${s}`] || zero();
  for (const c of CORNERS) r[`corner-radius-${c}`] = partial[`corner-radius-${c}`] || zero();
  for (const s of SIDES) {
    const bw = r[`border-width-${s}`];
    r[`content-margin-${s}`] = partial[`content-margin-${s}`]
      || { value: { type: 'dimension', px: bw.value ? bw.value.px : 0 }, source: bw.source };
  }
  for (const s of SIDES) r[`expand-margin-${s}`] = partial[`expand-margin-${s}`] || zero();
  return ordered(r);
}

function inheritFrom(baseRec, partial) {
  const r = {};
  for (const k of BOX_FIELDS) r[k] = partial[k] || baseRec[k];
  r['draw-center'] = drawCenter(r['bg-color']);
  return ordered(r);
}

const hasBox = (partial) => Object.keys(partial).some((k) => !FONT_FIELDS.includes(k));

function pressOf(v, structs, val, seen) {
  const own = v.child('press');
  const s = seen || new Set();
  s.add(v.variation);
  const parent = v.parent && structs.byName.has(v.parent) && !s.has(v.parent) ? structs.byName.get(v.parent) : null;
  const inherited = parent ? pressOf(parent, structs, val, s) : null;
  if ((!own || own.kind !== 'group') && !inherited) return null;
  const out = {};
  for (const m of PRESS_MEMBERS) {
    const t = own && own.kind === 'group' ? own.childMap.get(m) : null;
    if (t && t.kind === 'token') out[m] = { value: val(t.path), source: t.path };
    else if (inherited && inherited[m]) out[m] = inherited[m];
    else out[m] = zero();
  }
  return out;
}

function fieldsOfGroup(node, val, prefixLen) {
  const out = {};
  if (!node || node.kind !== 'group') return out;
  const visit = (n) => {
    if (n.kind === 'token') out[n.segs.slice(prefixLen).join('.')] = { value: val(n.path), source: n.path };
    else n.children.forEach(visit);
  };
  node.children.forEach(visit);
  return out;
}

function proposalChildren(v) {
  if (v.proposal) return ['*'];
  const out = [];
  for (const c of v.node.children) {
    let any = c.ownProposal;
    if (!any && c.kind === 'group') {
      const visit = (n) => { if (n.ownProposal) any = true; if (n.kind === 'group') n.children.forEach(visit); };
      c.children.forEach(visit);
    }
    if (any) out.push(c.name);
  }
  return out;
}

function stopName(prefix, k, steps) {
  return `${prefix}.ramp.stop-${String(k).padStart(Math.max(2, String(steps).length), '0')}`;
}

// The ramp stops of a ProgressBar (§5): stop k = color-mix(in oklab, full k/steps, empty), stored as 8-bit hex.
function rampStops(prefix, ramp) {
  if (!ramp || !ramp.full || !ramp.empty || !ramp.steps) return [];
  const full = ramp.full.value;
  const empty = ramp.empty.value;
  const steps = ramp.steps.value;
  if (!full || !empty || !steps || full.type !== 'color' || empty.type !== 'color' || steps.type !== 'number') return [];
  const n = steps.value;
  if (!Number.isInteger(n) || n < 1 || n > 1000) return [];
  const a = parseHex(full.hex);
  const b = parseHex(empty.hex);
  const out = [];
  for (let k = 0; k <= n; k++) {
    const hex = toHex(mixOklab(a, b, k / n));
    out.push({ path: stopName(prefix, k, n), step: k, fraction: round4(k / n), hex,
      rgba: parseHex(hex).map(round4).concat(1) });
  }
  return out;
}

function expandVariant(v, structs, res) {
  const val = (p) => res.valueOf(p);
  const clear = res.valueOf('palette.clear') || CLEAR;
  const info = CLASSES[v.cls] || null;
  const states = {};
  const empty = [];
  const part = (name) => authored(v.child(name), val);
  if (info && (v.cls === 'Button' || v.cls === 'OptionButton') && !v.abstract) {
    const p = Object.fromEntries(info.states.map((s) => [s, part(s)]));
    const normal = completeBase(p.normal, clear);
    const pressed = inheritFrom(normal, p.pressed);
    states.normal = normal;
    states.hover = inheritFrom(normal, p.hover);
    states.pressed = pressed;
    states['hover-pressed'] = inheritFrom(pressed, p['hover-pressed']);
    states.disabled = inheritFrom(normal, p.disabled);
    states.focus = completeBase(p.focus, clear);
    const fcN = p.normal['font-color'];
    const fcP = p.pressed['font-color'] || fcN;
    const fonts = { normal: fcN, hover: p.hover['font-color'] || fcN, pressed: fcP,
      'hover-pressed': p['hover-pressed']['font-color'] || fcP, disabled: p.disabled['font-color'] || fcN,
      focus: p.focus['font-color'] || fcN };
    for (const s of info.states) if (fonts[s]) states[s]['font-color'] = fonts[s];
  } else if (info && v.cls === 'LineEdit') {
    const p = Object.fromEntries(info.states.map((s) => [s, part(s)]));
    states.normal = completeBase(p.normal, clear);
    states.focus = completeBase(p.focus, clear);
    states['read-only'] = inheritFrom(states.normal, p['read-only']);
    const fcN = p.normal['font-color'];
    if (fcN) states.normal['font-color'] = fcN;
    const fcR = p['read-only']['font-color'] || fcN;
    if (fcR) states['read-only']['font-color'] = fcR;
  } else if (info && (v.cls === 'Panel' || v.cls === 'PanelContainer')) {
    states.panel = completeBase(part('panel'), clear);
  } else if (info && v.cls === 'Label') {
    const p = part('normal');
    if (hasBox(p)) states.normal = completeBase(p, clear);
    else {
      states.normal = {};
      empty.push('normal');
    }
    if (p['font-color']) states.normal['font-color'] = p['font-color'];
    states.normal['font-shadow-color'] = p['font-shadow-color'] || { value: clear, source: null };
  } else if (info && v.cls === 'ProgressBar') {
    const bg = v.child('background');
    if (bg && bg.kind === 'group') states.background = completeBase(part('background'), clear);
    else empty.push('background');
    states.fill = completeBase(part('fill'), clear);
  } else if (info && (v.cls === 'HSlider' || v.cls === 'VScrollBar')) {
    // Base states complete from the defaults, an inheriting state from its base (INHERITS), focus only when authored.
    const inh = INHERITS[v.cls];
    for (const s of info.states) {
      if (inh[s]) states[s] = inheritFrom(states[inh[s]], part(s));
      else if (s !== 'focus' || (v.child('focus') && v.child('focus').kind === 'group')) states[s] = completeBase(part(s), clear);
    }
  }
  const tokenField = (name) => {
    const t = v.child(name);
    return t && t.kind === 'token' ? { value: val(t.path), source: t.path } : null;
  };
  const rampNode = v.child('ramp');
  let ramp = null;
  if (rampNode && rampNode.kind === 'group') {
    const f = (k) => (rampNode.childMap.get(k) && rampNode.childMap.get(k).kind === 'token'
      ? { value: val(rampNode.childMap.get(k).path), source: rampNode.childMap.get(k).path } : null);
    ramp = { full: f('full'), empty: f('empty'), steps: f('steps') };
  }
  const order = info ? info.states : [];
  const styleboxes = order.filter((s) => states[s] && !empty.includes(s) && 'bg-color' in states[s]);
  return {
    variation: v.variation, class: v.cls, parent: v.parent, prefix: v.prefix, context: v.context, abstract: v.abstract,
    states, styleboxes, empty,
    label: tokenField('label'),
    press: v.cls === 'Button' ? pressOf(v, structs, val) : null,
    motion: tokenField('motion'),
    base: v.base, toggle: v.toggle, selectedOf: structs.selectedOf.get(v.variation) || null, on: v.on,
    items: fieldsOfGroup(v.child('items'), val, v.node.segs.length + 1),
    size: fieldsOfGroup(v.child('size'), val, v.node.segs.length + 1),
    ramp, stops: rampStops(v.prefix, ramp),
    proposal: proposalChildren(v),
    // godot.textures as authored (P61 checks each names a pack icon); $deprecated with its replacement (P62)
    textures: v.textures ? Object.fromEntries(Object.entries(v.textures).filter(([, p]) => typeof p === 'string')) : null,
    deprecated: v.deprecated ? { replacement: v.replacement, note: typeof v.deprecated === 'string' ? v.deprecated : null } : null,
    stateProposal: Object.fromEntries(Object.keys(states).map((st) => [st, v.child(st) ? !!v.child(st).proposal : !!v.proposal])),
    description: v.description, file: v.file, pointer: v.pointer,
  };
}

function expandAll(structs, res) {
  return structs.list.map((v) => expandVariant(v, structs, res));
}

module.exports = { collectVariants, expandAll, authored, completeBase, CLASSES, INHERITS, BASE_STATES, BOX_FIELDS, FONT_FIELDS,
  AUTHOR_BOX, SIDES, CORNERS, PRESS_MEMBERS, SIZE_NAMES, stopName, rampStops };
