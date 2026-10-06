// The token validator (spec §7.1 step 2, §7.2): runs the DTCG rules of resolve.js on every permutation (D38) and the
// component profile rules P40-P60. analyze(root) is the one entry used by api.js, build.js and the self-test.
// CLI: node tools/tokens/validate.js [--root <dir>] [--json]
// Node 20, no packages.
'use strict';

const path = require('path');
const R = require('./resolve.js');
const X = require('./expand.js');

// Letters only: the game's theme test sees `&"[A-Za-z]+"` only, and the pages that read the components CSS find its
// blocks by `/* Toy[A-Za-z]+: `. A number is spelled (ToyColumnSixteen for space.16).
const VARIATION_RE = /^Toy[A-Za-z]+$/;
const CONTEXTS = ['dark', 'light', 'any'];
const GODOT_VARIANT_KEYS = ['variation', 'class', 'parent', 'abstract', 'base', 'toggle', 'on'];
const NS_KEYS = ['godot', 'context', 'proposal'];
// P58 names PanelContainer and Panel; spec §3.7 (whose tables win, spec intro) also puts preset-card notes on the
// ToyPresetCard buttons, so a Button or OptionButton surface is accepted too.
const ON_CLASSES = ['PanelContainer', 'Panel', 'Button', 'OptionButton'];
const { SIDES, CORNERS, CLASSES, AUTHOR_BOX, PRESS_MEMBERS, SIZE_NAMES } = X;
const extPtr = (v, ...rest) => R.ptrJoin(v.pointer, '$extensions', R.NS, ...rest);

function analyze(root) {
  const P = new R.Problems();
  const model = R.loadModel(root, P);
  if (!model) return { problems: P, model: null, structs: null, results: [] };
  const structs = X.collectVariants(model);
  checkNamespace(model, structs, P);
  checkStructure(model, structs, P);
  const results = [];
  const defaultKeys = new Set();
  const d38 = new Set();
  model.permutations.forEach((perm, idx) => {
    const local = new R.Problems(P.positions);
    const res = R.resolvePermutation(model, perm, local);
    const variants = X.expandAll(structs, res);
    checkValues(model, structs, variants, res, local);
    results.push({ perm, res, variants });
    for (const p of local.list) {
      const k = `${p.rule}|${p.file}|${p.pointer}`;
      if (idx === 0) {
        defaultKeys.add(k);
        P.push(p);
      } else if (!defaultKeys.has(k) && !d38.has(k)) {
        d38.add(k);
        P.add(p.severity, 'D38', p.file, p.pointer, p.path, `only in the permutation ${perm.label}: [${p.rule}] ${p.message}`);
      }
    }
  });
  if (results.length) checkCssNames(results[0], P);
  return { problems: P, model, structs, results };
}

// P56 (descriptions, proposal flags) and P59 (namespace members, context, godot hints)
function checkNamespace(model, structs, P) {
  const variantNodes = new Set(structs.list.map((v) => v.node));
  for (const n of model.nodes) {
    const tp = n.path || null;
    if (variantNodes.has(n)) {
      if (!n.description) P.error('P56', n.file, n.pointer, tp, 'every variant group has a $description');
      if (!n.ext || !('context' in n.ext)) P.error('P59', n.file, n.pointer, tp, 'context ("dark", "light" or "any") is required on every variant group');
    }
    if (!n.ext) continue;
    const ep = R.ptrJoin(n.pointer, '$extensions', R.NS);
    for (const k of R.keysOf(n.ext)) if (!NS_KEYS.includes(k)) P.error('P59', n.file, R.ptrJoin(ep, k), tp, `unknown member ${JSON.stringify(k)}; allowed: ${NS_KEYS.join(', ')}`);
    if ('proposal' in n.ext && n.ext.proposal !== true) P.error('P56', n.file, R.ptrJoin(ep, 'proposal'), tp, 'proposal is the boolean true (omit it otherwise)');
    if (n.ownProposal && !n.description) P.error('P56', n.file, n.pointer, tp, 'every proposal has a $description');
    if ('context' in n.ext) {
      if (!variantNodes.has(n)) P.error('P59', n.file, R.ptrJoin(ep, 'context'), tp, 'context belongs only on variant groups (groups with godot.variation)');
      else if (!CONTEXTS.includes(n.ext.context)) P.error('P59', n.file, R.ptrJoin(ep, 'context'), tp, `context is "dark", "light" or "any", not ${JSON.stringify(n.ext.context)}`);
    }
    if ('godot' in n.ext) {
      const g = n.ext.godot;
      const gp = R.ptrJoin(ep, 'godot');
      if (variantNodes.has(n)) {
        for (const k of R.keysOf(g)) if (!GODOT_VARIANT_KEYS.includes(k)) P.error('P59', n.file, R.ptrJoin(gp, k), tp, `unknown godot hint ${JSON.stringify(k)} on a variant; allowed: ${GODOT_VARIANT_KEYS.join(', ')}`);
      } else if (n.kind === 'token' && n.path === 'ease.press') {
        const keys = R.isObj(g) ? R.keysOf(g) : null;
        if (!keys || keys.length !== 2 || !keys.includes('trans') || !keys.includes('ease')) P.error('P59', n.file, gp, tp, 'godot on ease.press is exactly {"trans": "TRANS_*", "ease": "EASE_*"}');
        else {
          if (!(g.trans in R.GODOT_TRANS)) P.error('P59', n.file, R.ptrJoin(gp, 'trans'), tp, `unknown Tween.TransitionType ${JSON.stringify(g.trans)}; one of ${Object.keys(R.GODOT_TRANS).join(', ')}`);
          if (!(g.ease in R.GODOT_EASE)) P.error('P59', n.file, R.ptrJoin(gp, 'ease'), tp, `unknown Tween.EaseType ${JSON.stringify(g.ease)}; one of ${Object.keys(R.GODOT_EASE).join(', ')}`);
        }
      } else {
        P.error('P59', n.file, gp, tp, 'godot hints belong on variant groups (with godot.variation, in components/ files) and as {trans, ease} on ease.press only');
      }
    }
  }
}

function checkStructure(model, structs, P) {
  const seen = new Map();
  const variantNodes = new Set(structs.list.map((v) => v.node));
  for (const v of structs.list) {
    const tp = v.prefix;
    // P40
    if (!v.variation || !VARIATION_RE.test(v.variation)) {
      P.error('P40', v.file, extPtr(v, 'godot', 'variation'), tp, `godot.variation must match ^Toy[A-Za-z]+$ (letters only; spell a number: ToyColumnSixteen), not ${JSON.stringify(v.godot.variation)}`);
    } else if (seen.has(v.variation)) {
      P.error('P40', v.file, extPtr(v, 'godot', 'variation'), tp, `variation ${v.variation} is already used by ${seen.get(v.variation)}`);
    } else seen.set(v.variation, tp);
    // P41
    const info = CLASSES[v.cls];
    if (!info) {
      P.error('P41', v.file, extPtr(v, 'godot', 'class'), tp, `godot.class must be one of ${Object.keys(CLASSES).join(', ')}, not ${JSON.stringify(v.godot.class)}`);
    }
    if ('parent' in v.godot) {
      const par = typeof v.godot.parent === 'string' ? structs.byName.get(v.godot.parent) : null;
      if (!par) P.error('P41', v.file, extPtr(v, 'godot', 'parent'), tp, `parent ${JSON.stringify(v.godot.parent)} names no variant`);
      else if (par.cls !== v.cls) P.error('P41', v.file, extPtr(v, 'godot', 'parent'), tp, `parent ${par.variation} is a ${par.cls}, not a ${v.cls}`);
      else {
        const chain = [v.variation];
        let cur = par;
        while (cur) {
          if (chain.includes(cur.variation)) {
            P.error('P41', v.file, extPtr(v, 'godot', 'parent'), tp, `parent cycle: ${chain.concat(cur.variation).join(' -> ')}`);
            break;
          }
          chain.push(cur.variation);
          cur = cur.parent ? structs.byName.get(cur.parent) : null;
        }
      }
    }
    if ('abstract' in v.godot && (v.godot.abstract !== true || v.prefix !== 'button.common' || v.cls !== 'Button')) {
      P.error('P41', v.file, extPtr(v, 'godot', 'abstract'), tp, 'abstract: true is allowed only on the Button variant button.common');
    }
    if (!info) continue;
    // P42
    const allowed = new Set([...info.states, 'items']);
    if (!info.container) allowed.add('size');
    if (info.label) allowed.add('label');
    if (v.cls === 'Button') allowed.add('press');
    if (v.cls === 'Button' && v.abstract) allowed.add('motion');
    if (info.ramp) allowed.add('ramp');
    for (const c of v.node.children) {
      if (!allowed.has(c.name)) {
        P.error('P42', c.file, c.pointer, c.path, `${c.name} is not a child of a ${v.cls}${v.abstract ? ' (abstract)' : ''} variant; allowed: ${[...allowed].join(', ')}`);
        continue;
      }
      const wantToken = c.name === 'label' || c.name === 'motion';
      if (wantToken !== (c.kind === 'token')) P.error('P42', c.file, c.pointer, c.path, `${c.name} must be a ${wantToken ? 'token' : 'group'}`);
      if (c.name === 'press' && c.kind === 'group') {
        for (const m of c.children) if (!PRESS_MEMBERS.includes(m.name) || m.kind !== 'token') P.error('P42', m.file, m.pointer, m.path, `press holds only the tokens ${PRESS_MEMBERS.join(', ')}`);
      }
    }
    const nest = (n) => {
      for (const c of n.kind === 'group' ? n.children : []) {
        if (variantNodes.has(c)) P.error('P42', c.file, c.pointer, c.path, `variant groups are never nested (inside ${v.prefix})`);
        nest(c);
      }
    };
    nest(v.node);
    // P42: the classes that list their theme items (HSlider, VScrollBar, the containers) take only those items.
    const items = v.child('items');
    if (info.items && items && items.kind === 'group') {
      for (const m of items.children) {
        if (!info.items.includes(m.name) || m.kind !== 'token') {
          P.error('P42', m.file, m.pointer, m.path, `the items of a ${v.cls} variant are ${info.items.length ? info.items.join(', ') : 'none'}`);
        }
      }
    }
    // P43 (names; the compact-form convention is checked with values in checkValues)
    for (const s of info.states) {
      const g = v.child(s);
      if (!g || g.kind !== 'group') continue;
      for (const m of g.children) {
        if (m.kind !== 'token') {
          P.error('P43', m.file, m.pointer, m.path, 'state groups hold tokens only');
          continue;
        }
        if (m.name === 'draw-center') P.error('P43', m.file, m.pointer, m.path, 'draw-center is derived (false when bg-color alpha is 0); do not author it');
        else if (m.name.startsWith('shadow')) P.error('P43', m.file, m.pointer, m.path, 'StyleBoxFlat shadows are never used (decision 4): the toy base is a layer or a merge');
        else if (AUTHOR_BOX.includes(m.name)) continue;
        else if (m.name === 'font-color' && info.font.includes(s)) continue;
        else if (m.name === 'font-shadow-color' && info.shadow.includes(s)) continue;
        else P.error('P43', m.file, m.pointer, m.path, `${m.name} is not a field of the ${v.cls} state ${s}`);
      }
    }
    // P47
    let required = [];
    if ((v.cls === 'Button' || v.cls === 'OptionButton') && !v.abstract) required = ['normal', 'disabled', 'focus'];
    else if (v.cls === 'LineEdit') required = ['normal', 'focus', 'read-only'];
    else if (v.cls === 'Panel' || v.cls === 'PanelContainer') required = ['panel'];
    else if (v.cls === 'ProgressBar') required = ['fill'];
    else if (v.cls === 'Label') required = ['normal'];
    else if (v.cls === 'HSlider') required = ['slider', 'grabber-area'];
    else if (v.cls === 'VScrollBar') required = ['scroll', 'grabber'];
    for (const s of required) if (!v.child(s)) P.error('P47', v.file, v.pointer, tp, `a ${v.cls} variant needs the state ${s}`);
    if (info.container) {
      for (const k of info.items) {
        if (!items || items.kind !== 'group' || !items.childMap.has(k)) P.error('P47', v.file, v.pointer, tp, `a ${v.cls} variant needs items.${k} (its whole job)`);
      }
    }
    // P54 names
    const ramp = v.child('ramp');
    if (ramp && ramp.kind === 'group') {
      for (const m of ramp.children) {
        if (/^stop-/.test(m.name)) P.error('P54', m.file, m.pointer, m.path, 'the names stop-* are reserved for the derived ramp stops');
        else if (!['full', 'empty', 'steps'].includes(m.name) || m.kind !== 'token') P.error('P54', m.file, m.pointer, m.path, 'ramp holds only the tokens full, empty and steps');
      }
      for (const k of ['full', 'empty', 'steps']) if (!ramp.childMap.has(k)) P.error('P54', ramp.file, ramp.pointer, ramp.path, `ramp needs ${k}`);
    }
    // P55 names
    const size = v.child('size');
    if (size && size.kind === 'group') {
      for (const m of size.children) if (!SIZE_NAMES.includes(m.name) || m.kind !== 'token') P.error('P55', m.file, m.pointer, m.path, `size members are ${SIZE_NAMES.join(', ')}`);
    }
    // P50 shape
    if ('base' in v.godot) {
      const b = v.godot.base;
      const keys = R.isObj(b) ? R.keysOf(b).slice().sort().join(',') : '';
      if (keys !== 'dark,light' && keys !== 'any') P.error('P50', v.file, extPtr(v, 'godot', 'base'), tp, 'base is {"dark": "<Panel variant>", "light": "<Panel variant>"} or {"any": "<Panel variant>"}');
      else {
        for (const k of R.keysOf(b)) {
          const bv = structs.byName.get(b[k]);
          if (!bv || bv.cls !== 'Panel') P.error('P50', v.file, extPtr(v, 'godot', 'base', k), tp, `base ${JSON.stringify(b[k])} names no Panel variant`);
        }
      }
    }
    // P57
    if ('toggle' in v.godot) {
      const t = v.godot.toggle;
      const tptr = extPtr(v, 'godot', 'toggle');
      if (!R.isObj(t) || R.keysOf(t).join(',') !== 'selected' || typeof t.selected !== 'string') {
        P.error('P57', v.file, tptr, tp, 'toggle is {"selected": "<variation>"}');
      } else {
        const sv = structs.byName.get(t.selected);
        if (!sv) P.error('P57', v.file, tptr, tp, `toggle.selected ${JSON.stringify(t.selected)} names no variant`);
        else {
          if (sv.cls !== v.cls || sv.parent !== v.parent) P.error('P57', v.file, tptr, tp, `${sv.variation} must have the same class and parent as ${v.variation}`);
          if (sv.toggle || 'toggle' in sv.godot) P.error('P57', sv.file, sv.pointer, sv.prefix, `the selected variation ${sv.variation} has no toggle of its own`);
          const ok = ['normal', 'disabled', 'focus', 'label', 'press', 'size'];
          for (const c of sv.node.children) if (!ok.includes(c.name)) P.error('P57', c.file, c.pointer, c.path, `a selected toggle variation authors only ${ok.join(', ')}; ${c.name} completes from normal`);
        }
      }
    }
    // P58
    if ('on' in v.godot) {
      const onp = extPtr(v, 'godot', 'on');
      if (v.cls !== 'Label' && v.cls !== 'ProgressBar') P.error('P58', v.file, onp, tp, 'on is only for Label and ProgressBar variants');
      else if (!Array.isArray(v.godot.on) || !v.godot.on.length || !v.godot.on.every((s) => typeof s === 'string')) P.error('P58', v.file, onp, tp, 'on is a non-empty array of variation names');
      else {
        v.godot.on.forEach((name, i) => {
          const ov = structs.byName.get(name);
          if (!ov || !ON_CLASSES.includes(ov.cls)) P.error('P58', v.file, R.ptrJoin(onp, String(i)), tp, `${JSON.stringify(name)} names no ${ON_CLASSES.join(', ')} variant`);
        });
      }
    }
  }
  // P42: plain groups (and component file roots) hold only groups
  const inVariant = new Set();
  const mark = (n) => { inVariant.add(n); if (n.kind === 'group') n.children.forEach(mark); };
  structs.list.forEach((v) => mark(v.node));
  for (const n of model.nodes) {
    if (n.kind !== 'group' || n.tier !== 'component' || inVariant.has(n)) continue;
    for (const c of n.children) if (c.kind === 'token') P.error('P42', c.file, c.pointer, c.path, 'plain groups in component files hold only groups (one variant group per Godot type variation)');
  }
}

const pxOf = (f) => (f && f.value && typeof f.value.px === 'number' ? f.value.px : null);
const alphaOf = (f) => (f && f.value && Array.isArray(f.value.rgba) ? f.value.rgba[3] : null);

function checkValues(model, structs, variants, res, P) {
  const byVar = new Map();
  variants.forEach((v) => { if (v.variation && !byVar.has(v.variation)) byVar.set(v.variation, v); });
  const val = (p) => res.valueOf(p);
  const loc = (node) => [node.file, node.pointer, node.path];
  structs.list.forEach((s, i) => {
    const v = variants[i];
    const info = CLASSES[s.cls];
    if (!info) return;
    const at = (rec, field, fallback) => {
      const f = rec && rec[field];
      const n = f && f.source ? res.tokens.get(f.source) : null;
      return loc(n || fallback);
    };
    const authoredStates = info.states.filter((st) => s.child(st) && s.child(st).kind === 'group' && v.states[st] && 'bg-color' in v.states[st]);
    // P43 compact authoring form
    for (const st of info.states) {
      const g = s.child(st);
      if (g && g.kind === 'group') checkConvention(g, val, P, X.BASE_STATES.includes(st));
    }
    // P42 and P44 on the listed theme items: separations are dimensions of 0 or more, grabber_offset a dimension,
    // center_grabber the number 0 or 1.
    const itemsNode = s.child('items');
    if (info.items && itemsNode && itemsNode.kind === 'group') {
      for (const m of itemsNode.children) {
        if (m.kind !== 'token' || !info.items.includes(m.name)) continue;
        const ty = res.typeOf(m.path);
        const vv = val(m.path);
        const want = m.name === 'center-grabber' ? 'number' : 'dimension';
        if (ty && ty !== want) P.error('P42', ...loc(m), `items.${m.name} is a ${want}, not a ${ty}`);
        else if (want === 'number' && vv && vv.value !== 0 && vv.value !== 1) P.error('P42', ...loc(m), `items.center-grabber is 0 or 1 (Godot's constant used as a flag), not ${vv.value}`);
        else if (/separation$/.test(m.name) && vv && typeof vv.px === 'number' && vv.px < 0) P.error('P44', ...loc(m), `items.${m.name} is ${vv.px}; separations are ≥ 0`);
      }
    }
    // P44
    // the smaller size side needs both sides: bar.track has only a height (16) and r 10 (spec §4.5)
    const sizeSides = ['width', 'height'].map((k) => pxOf(v.size[k]));
    const fixedSize = sizeSides.every((x) => x != null);
    const half = fixedSize ? Math.min(...sizeSides) / 2 : null;
    for (const st of authoredStates) {
      const rec = v.states[st];
      const g = s.child(st);
      const once = new Set();
      const p44 = (k, msg) => {
        const where = at(rec, k, g);
        if (once.has(where[1])) return;
        once.add(where[1]);
        P.error('P44', ...where, msg);
      };
      for (const k of [...SIDES.map((x) => `border-width-${x}`), ...CORNERS.map((x) => `corner-radius-${x}`), ...SIDES.map((x) => `content-margin-${x}`)]) {
        const x = pxOf(rec[k]);
        if (x != null && x < 0) p44(k, `${st}.${k} is ${x}; border widths, radii and content margins are ≥ 0`);
      }
      if (half != null) {
        for (const c of CORNERS) {
          const r = pxOf(rec[`corner-radius-${c}`]);
          if (r != null && r !== 999 && r > half) p44(`corner-radius-${c}`, `${st}.corner-radius-${c} ${r} is more than half the smaller size side (${half}); use 999 for a pill or circle`);
        }
      }
    }
    // P45
    // Panels draw no content; a fixed-size control (size.width and size.height) lays nothing out with its content
    // margins (pick.radio: cm 0 inside a 2 px border, 26 x 26, spec §4.15)
    if (s.cls !== 'Panel' && !fixedSize) {
      for (const st of authoredStates) {
        if (st === 'focus') continue;
        const rec = v.states[st];
        for (const side of SIDES) {
          const cm = pxOf(rec[`content-margin-${side}`]);
          const ex = pxOf(rec[`expand-margin-${side}`]);
          const bw = pxOf(rec[`border-width-${side}`]);
          if (cm == null || ex == null || bw == null) continue;
          if (cm + ex - bw < 0) P.error('P45', ...loc(s.child(st)), `${st} ${side}: content margin ${cm} + expand ${ex} - border ${bw} = ${cm + ex - bw} < 0 (CSS padding would be negative)`);
        }
      }
    }
    // P46
    const sums = (rec) => {
      const g = (k) => pxOf(rec[`content-margin-${k}`]);
      const t = [g('top'), g('bottom'), g('left'), g('right')];
      return t.some((x) => x == null) ? null : [t[0] + t[1], t[2] + t[3]];
    };
    if ((s.cls === 'Button' || s.cls === 'OptionButton') && !s.abstract && v.states.normal) {
      const ref = sums(v.states.normal);
      for (const st of ['hover', 'pressed', 'hover-pressed', 'disabled']) {
        const x = v.states[st] ? sums(v.states[st]) : null;
        if (ref && x && (x[0] !== ref[0] || x[1] !== ref[1])) {
          P.error('P46', ...loc(s.child(st) || s.node), `${st} content margins sum to ${x[0]} (top + bottom) and ${x[1]} (left + right); normal sums to ${ref[0]} and ${ref[1]}`);
        }
      }
      if (s.toggle && typeof s.toggle.selected === 'string' && byVar.has(s.toggle.selected)) {
        const sel = byVar.get(s.toggle.selected);
        const x = sel.states.normal ? sums(sel.states.normal) : null;
        const ss = structs.byName.get(s.toggle.selected);
        if (ref && x && (x[0] !== ref[0] || x[1] !== ref[1])) {
          P.error('P46', ...loc(ss.child('normal') || ss.node), `${sel.variation} content margins sum to ${x[0]} and ${x[1]}; its toggle partner ${v.variation} sums to ${ref[0]} and ${ref[1]}`);
        }
      }
    }
    // P48
    const fg = s.child('focus');
    const own = v.states.normal || v.states.slider;
    if (fg && fg.kind === 'group' && v.states.focus && own && ['Button', 'OptionButton', 'LineEdit', 'HSlider'].includes(s.cls)) {
      checkFocus(s, v, fg, res, P);
    }
    // P49
    if (s.cls === 'Button' && v.press) {
      const pn = s.child('press') && s.child('press').kind === 'group' ? s.child('press') : s.node;
      const [d, h, held, dis] = PRESS_MEMBERS.map((m) => pxOf(v.press[m]));
      if ([d, h, held, dis].every((x) => x != null)) {
        const e = (msg) => P.error('P49', ...loc(pn), msg);
        if (h > 0) e(`press.hover is ${h}; a hover lift is ≤ 0`);
        if (d < 0) e(`press.depth is ${d}; it is ≥ 0`);
        else if (d > 0) {
          if (held < 0 || held > d - 1) e(`press.held is ${held}; with depth ${d} it is 0..${d - 1}`);
          if (dis !== 0 && dis !== d) e(`press.disabled is ${dis}; it is 0 or the depth ${d}`);
          if (!s.base) e(`press.depth is ${d} but the variant has no base hint (godot.base)`);
        } else {
          if (held < 0) e(`press.held is ${held}; it is ≥ 0`);
          if (dis !== 0) e(`press.disabled is ${dis}; with depth 0 it is 0`);
        }
      }
    }
    // P50 values
    if (s.base && R.isObj(s.base)) {
      const owner = s.cls === 'Panel' || s.cls === 'PanelContainer' ? v.states.panel : s.cls === 'ProgressBar' ? v.states.fill : v.states.normal;
      const bptr = extPtr(s, 'godot', 'base');
      const e = (msg) => P.error('P50', s.file, bptr, s.prefix, msg);
      const ds = [];
      for (const k of R.keysOf(s.base)) {
        const bv = byVar.get(s.base[k]);
        if (!bv || bv.class !== 'Panel' || !bv.states.panel) continue;
        const b = bv.states.panel;
        const o = owner && 'bg-color' in owner ? owner : null;
        const opx = (f) => (o ? pxOf(o[f]) : 0);
        if (SIDES.some((x) => pxOf(b[`border-width-${x}`]) !== 0)) e(`base ${bv.variation} has a border; a base has none`);
        for (const c of CORNERS) {
          if (pxOf(b[`corner-radius-${c}`]) !== opx(`corner-radius-${c}`)) e(`base ${bv.variation} corner-radius-${c} is ${pxOf(b[`corner-radius-${c}`])}; the owner's is ${opx(`corner-radius-${c}`)}`);
        }
        for (const x of ['left', 'right']) {
          if (pxOf(b[`expand-margin-${x}`]) !== opx(`expand-margin-${x}`)) e(`base ${bv.variation} expand-margin-${x} is ${pxOf(b[`expand-margin-${x}`])}; the owner's is ${opx(`expand-margin-${x}`)}`);
        }
        const dTop = opx('expand-margin-top') - pxOf(b['expand-margin-top']);
        const dBottom = pxOf(b['expand-margin-bottom']) - opx('expand-margin-bottom');
        if (dTop !== dBottom || dTop <= 0) e(`base ${bv.variation} must sit d > 0 lower on both edges: top gives d = ${dTop}, bottom gives d = ${dBottom}`);
        else ds.push([bv.variation, dTop]);
      }
      if (ds.length > 1 && ds.some((x) => x[1] !== ds[0][1])) e(`the bases use different depths: ${ds.map((x) => `${x[0]} ${x[1]}`).join(', ')}`);
      if (s.cls === 'Button' && v.press && ds.length) {
        const depth = pxOf(v.press.depth);
        for (const [name, d] of ds) if (depth != null && d !== depth) e(`base ${name} sits ${d} px lower but press.depth is ${depth}`);
      }
    }
    // P51
    for (const st of authoredStates) {
      const rec = v.states[st];
      const ex = (x) => pxOf(rec[`expand-margin-${x}`]);
      const bw = (x) => pxOf(rec[`border-width-${x}`]);
      if (ex('bottom') > 0 && ex('top') === 0 && ex('left') === 0 && ex('right') === 0) {
        const eff = bw('bottom') - ex('bottom');
        if (!(bw('top') === eff && bw('left') === eff && bw('right') === eff)) {
          P.error('P51', ...loc(s.child(st)), `merge form: border-width-bottom ${bw('bottom')} - expand-margin-bottom ${ex('bottom')} = ${eff} must equal the other borders (${bw('top')}, ${bw('right')}, ${bw('left')})`);
        }
      }
    }
    // P54 values
    const ramp = s.child('ramp');
    if (ramp && ramp.kind === 'group') {
      for (const k of ['full', 'empty']) {
        const t = ramp.childMap.get(k);
        if (!t || t.kind !== 'token') continue;
        const ty = res.typeOf(t.path);
        const vv = val(t.path);
        if (ty && ty !== 'color') P.error('P54', ...loc(t), `ramp.${k} is a color, not a ${ty}`);
        else if (vv && vv.rgba[3] !== 1) P.error('P54', ...loc(t), `ramp.${k} must be opaque (alpha 1)`);
      }
      const st = ramp.childMap.get('steps');
      if (st && st.kind === 'token') {
        const vv = val(st.path);
        const ty = res.typeOf(st.path);
        if (ty && ty !== 'number') P.error('P54', ...loc(st), `ramp.steps is a number, not a ${ty}`);
        else if (vv && (!Number.isInteger(vv.value) || vv.value < 1 || vv.value > 1000)) P.error('P54', ...loc(st), `ramp.steps is an integer ≥ 1, not ${vv.value}`);
      }
    }
    // P55 values
    const size = s.child('size');
    if (size && size.kind === 'group') {
      for (const m of size.children) {
        if (m.kind !== 'token' || !SIZE_NAMES.includes(m.name)) continue;
        const ty = res.typeOf(m.path);
        const x = pxOf({ value: val(m.path) });
        if (ty && ty !== 'dimension') P.error('P55', ...loc(m), `size.${m.name} is a dimension, not a ${ty}`);
        else if (x != null && x <= 0) P.error('P55', ...loc(m), `size.${m.name} is ${x}; sizes are > 0`);
      }
    }
  });
  // P52, P53 on every component token
  const variantNodes = new Set(structs.list.map((x) => x.node));
  for (const [p, n] of res.tokens) {
    if (n.tier !== 'component') continue;
    const ty = res.typeOf(p);
    const isVariantChild = n.parent && variantNodes.has(n.parent);
    if (isVariantChild && n.name === 'label') {
      if (!n.alias || !n.alias.startsWith('type.')) P.error('P53', n.file, `${n.pointer}/$value`, p, 'label is a reference to a type.* token');
      continue;
    }
    if (isVariantChild && n.name === 'motion') {
      if (!n.alias || !n.alias.startsWith('motion.')) P.error('P53', n.file, `${n.pointer}/$value`, p, 'motion is a reference to a motion.* token');
      continue;
    }
    if (ty === 'color') {
      if (!n.alias) P.error('P52', n.file, `${n.pointer}/$value`, p, 'component colours are references (to palette.* or a color.* role), not literals');
      else if (!res.inCycle.has(p)) {
        const term = res.terminalOf(p);
        if (term && !term.startsWith('palette.')) P.error('P52', n.file, `${n.pointer}/$value`, p, `the reference chain ends at ${term}, not at a palette.* colour`);
      }
    } else if (ty === 'dimension') {
      // the primitives stroke.*, radius.*, focus.* and space.* (the screens' gaps); a container's separation is always
      // one of space.* (the only gaps a screen uses)
      const target = n.alias ? res.tokens.get(n.alias) : null;
      const sep = isItemOf(n, variantNodes, structs) && /separation$/.test(n.name);
      if (n.alias && (!/^(stroke|radius|focus|space)\./.test(n.alias) || (target && target.tier !== 'primitive'))) {
        P.error('P53', n.file, `${n.pointer}/$value`, p, `component dimensions are int literals or references to the primitives stroke.*, radius.*, focus.* or space.*, not {${n.alias}}`);
      } else if (sep && (!n.alias || !n.alias.startsWith('space.'))) {
        P.error('P53', n.file, `${n.pointer}/$value`, p, `a container's ${n.name} is a reference to space.* (the screens' gaps: 4, 8, 12, 16, 24, 32)`);
      }
    }
  }
}

// A token in the items group of a container variant (VBoxContainer, HBoxContainer, GridContainer, ScrollContainer).
function isItemOf(n, variantNodes, structs) {
  const g = n.parent;
  if (!g || g.name !== 'items' || !variantNodes.has(g.parent)) return false;
  const v = structs.list.find((x) => x.node === g.parent);
  return !!(v && CLASSES[v.cls] && CLASSES[v.cls].container);
}

function checkFocus(s, v, fg, res, P) {
  const rec = v.states.focus;
  // the record the ring surrounds: normal, or an HSlider's slider (its track)
  const nrec = v.states.normal || v.states.slider;
  const nname = v.states.normal ? 'normal' : 'slider';
  const once = new Set();
  const e = (node, msg) => {
    if (once.has(node.pointer)) return;
    once.add(node.pointer);
    P.error('P48', node.file, node.pointer, node.path, msg);
  };
  const m = new Map();
  for (const c of fg.children) if (c.kind === 'token') m.set(c.name, c);
  const a = alphaOf(rec['bg-color']);
  if (a != null && a !== 0) e(m.get('bg-color') || fg, 'focus bg-color is transparent (alpha 0): the ring draws no fill');
  const bwTok = m.get('border-width');
  const perSide = SIDES.filter((x) => m.has(`border-width-${x}`));
  if (!bwTok || bwTok.raw !== '{focus.width}' || perSide.length) e(bwTok || fg, 'focus border-width is the shorthand "{focus.width}"');
  const exNames = ['expand-margin-block', 'expand-margin-inline', ...SIDES.map((x) => `expand-margin-${x}`)].filter((x) => m.has(x));
  if (exNames.length) {
    e(m.get(exNames[0]), 'focus expand-margin is written as the shorthand expand-margin only');
    return;
  }
  const exNode = m.get('expand-margin') || fg;
  const ex = pxOf(rec['expand-margin-top']);
  const fw = pxOf(rec['border-width-top']);
  if (ex == null || fw == null) return;
  if (ex <= 0) {
    const eff = SIDES.map((x) => {
      const bw = pxOf(nrec[`border-width-${x}`]);
      const nx = pxOf(nrec[`expand-margin-${x}`]);
      return bw == null || nx == null ? null : bw - Math.max(0, nx);
    });
    if (eff.some((x) => x == null)) return;
    const maxEff = Math.max(...eff);
    if (ex !== -maxEff) e(exNode, `inner focus: expand-margin is ${ex}; it must be ${-maxEff} (minus the largest border of normal, ${maxEff})`);
    for (const c of CORNERS) {
      const nr = pxOf(nrec[`corner-radius-${c}`]);
      const fr = pxOf(rec[`corner-radius-${c}`]);
      if (nr == null || fr == null) continue;
      const ok = fr === nr + ex || (nr >= 999 && fr >= 999);
      if (!ok) e(m.get('corner-radius') || m.get(`corner-radius-${c}`) || fg, `inner focus: corner-radius-${c} is ${fr}; it must be ${nr + ex} (normal ${nr} + expand ${ex})`);
    }
    const cms = SIDES.map((x) => pxOf(nrec[`content-margin-${x}`]));
    if (cms.every((x) => x != null)) {
      const room = Math.min(...cms) + ex - fw;
      if (room < 4) e(exNode, `inner focus: the smallest normal content margin ${Math.min(...cms)} + expand ${ex} - focus width ${fw} = ${room} < 4 px left for the label`);
    }
  } else {
    const gap = res.valueOf('focus.gap');
    const width = res.valueOf('focus.width');
    if (gap && width && ex !== gap.px + width.px) e(exNode, `outer focus: expand-margin is ${ex}; it must be focus.gap + focus.width = ${gap.px + width.px}`);
    // The outer ring is a pill (999), or it follows the control's corners: radius = its radius + the expand margin (a
    // keycap's ring, r 8 + 5 = 13).
    for (const c of CORNERS) {
      const fr = pxOf(rec[`corner-radius-${c}`]);
      const nr = pxOf(nrec[`corner-radius-${c}`]);
      if (fr == null || fr === 999 || (nr != null && nr < 999 && fr === nr + ex)) continue;
      const follow = nr != null && nr < 999 ? ` or follows the ${nname} corner (${nr} + expand ${ex} = ${nr + ex})` : '';
      e(m.get('corner-radius') || m.get(`corner-radius-${c}`) || fg, `outer focus: corner-radius-${c} is ${fr}; the outer ring is a pill (999)${follow}`);
    }
  }
}

// P43: the binding compact authoring form (§3.5 "The authoring convention").
function checkConvention(g, val, P, baseState) {
  const m = new Map();
  for (const c of g.children) if (c.kind === 'token') m.set(c.name, c);
  const px = (name) => {
    const t = m.get(name);
    const v = t ? val(t.path) : null;
    return v && typeof v.px === 'number' ? v.px : null;
  };
  const e = (name, msg) => {
    const n = m.get(name) || g;
    P.error('P43', n.file, n.pointer, n.path, msg);
  };
  for (const [short, names] of [['border-width', SIDES.map((x) => `border-width-${x}`)], ['corner-radius', CORNERS.map((x) => `corner-radius-${x}`)]]) {
    const present = names.filter((x) => m.has(x));
    if (m.has(short) && present.length) e(present[0], `write ${short} or the four per-side names, not both`);
    else if (present.length && present.length < 4) e(present[0], `unequal values are written as all four of ${names.join(', ')}`);
    else if (present.length === 4) {
      const vals = names.map(px);
      if (vals.every((x) => x != null && x === vals[0])) e(present[0], `all four are ${vals[0]}: write ${short}`);
    }
  }
  for (const kind of ['content-margin', 'expand-margin']) {
    const axes = [['block', ['top', 'bottom']], ['inline', ['left', 'right']]];
    const axisVal = {};
    for (const [ax, sides] of axes) {
      const axName = `${kind}-${ax}`;
      const sideNames = sides.map((x) => `${kind}-${x}`);
      const present = sideNames.filter((x) => m.has(x));
      if (m.has(kind) && (m.has(axName) || present.length)) e(m.has(axName) ? axName : present[0], `${kind} and ${axName} or per-side names overlap`);
      if (m.has(axName) && present.length) e(present[0], `${axName} and ${present.join(', ')} overlap`);
      if (present.length === 2) {
        const [a, b] = sideNames.map(px);
        if (a != null && a === b) e(present[0], `${sideNames.join(' and ')} are both ${a}: write ${axName}`);
      }
      if (present.length === 1 && kind === 'content-margin') e(present[0], `write both ${sideNames.join(' and ')}, or ${axName} when they are equal`);
      if (m.has(axName)) axisVal[ax] = px(axName);
    }
    if (axisVal.block != null && axisVal.block === axisVal.inline) e(`${kind}-block`, `${kind}-block and ${kind}-inline are both ${axisVal.block}: write ${kind}`);
    // zero expand margins are omitted in the states that inherit nothing; an inheriting state (and focus) may write 0
    // to override an inherited value (tab.selected disabled: ex 0; tab.idle focus: ex 0, spec §4.2)
    if (kind === 'expand-margin' && baseState) {
      for (const name of [kind, `${kind}-block`, `${kind}-inline`, ...SIDES.map((x) => `${kind}-${x}`)]) {
        if (m.has(name) && px(name) === 0) e(name, 'zero expand margins are omitted');
      }
    }
  }
}

// P60: every CSS custom property name is unique (composite suffixes and the derived ramp stops included).
function checkCssNames(result, P) {
  const names = new Map();
  const claim = (name, p, node) => {
    if (names.has(name) && names.get(name) !== p) {
      P.error('P60', node ? node.file : null, node ? node.pointer : null, p, `the CSS name ${name} is also produced by ${names.get(name)}`);
    } else names.set(name, p);
  };
  const { res, variants } = result;
  for (const [p, n] of res.tokens) {
    const ty = res.typeOf(p);
    if (R.COMPOSITES[ty]) for (const [, , suffix] of R.COMPOSITES[ty]) claim(`${R.cssVar(p)}-${suffix}`, p, n);
    else claim(R.cssVar(p), p, n);
  }
  for (const v of variants) for (const st of v.stops) claim(R.cssVar(st.path), st.path, null);
}

// ---------------------------------------------------------------------------------------------------------------
if (require.main === module) {
  const args = process.argv.slice(2);
  const ri = args.indexOf('--root');
  const root = ri >= 0 ? path.resolve(args[ri + 1]) : path.resolve(__dirname, '..', '..');
  const { problems } = analyze(root);
  if (args.includes('--json')) {
    process.stdout.write(JSON.stringify(problems.list, null, 2) + '\n');
  } else {
    for (const p of R.sortProblems(problems.list)) console.log(R.formatProblem(p));
    console.log(`${problems.errors.length} error(s), ${problems.warnings.length} warning(s)`);
  }
  process.exit(problems.errors.length ? 1 : 0);
}

module.exports = { analyze };
