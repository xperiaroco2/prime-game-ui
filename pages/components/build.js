// The components CSS and the showcase page (spec §13, §14).
//   node pages/components/build.js            write pages/components/toy-components.css and components.html
//   node pages/components/build.js --check    exit 1 when either file differs from what the build would write
// Inputs: tools/tokens/api.js (the token system), showcase.json, strings.json, page.css, page.js, icons/*.svg,
// dist/css/toy-tokens.css and dist/gates.json. Output is deterministic and LF-only. Node 20, no packages.
'use strict';

const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '..', '..');
const api = require(path.join(ROOT, 'tools', 'tokens', 'api.js'));
const { emitComponentsCss } = require('./emit-css.js');

const OUT_CSS = 'pages/components/toy-components.css';
const OUT_HTML = 'pages/components/components.html';
const TOKENS_CSS = 'dist/css/toy-tokens.css';
const GATES = 'dist/gates.json';
const EN_JSON = 'pages/wireframes/en.json';
const ICONS = ['check', 'item', 'mic', 'mic-off', 'pointer', 'chevron-left', 'chevron-right', 'chevron-down', 'lock', 'teammate-mark',
  'knife', 'slider-knob', 'slider-knob-disabled', 'swatch-disc'];
const ICON_HEAD = '<!-- own work, prime-game-ui, licence: own work -->';
const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap';
const TILES = [['white', '#ffffff'], ['grey', '#c9c9c9'], ['dim', '#979797']];
// Showcase state -> [index into the row's variations, Godot state, CSS state class].
const STATE = {
  normal: [0, 'normal', ''], hover: [0, 'hover', 'is-hover'], held: [0, 'pressed', 'is-held'],
  disabled: [0, 'disabled', 'is-disabled'], focus: [0, 'focus', 'is-focus'], 'read-only': [0, 'read-only', 'is-readonly'],
  selected: [1, 'normal', ''], 'selected-hover': [1, 'hover', 'is-hover'], 'selected-held': [1, 'pressed', 'is-held'],
  'selected-disabled': [1, 'disabled', 'is-disabled'], 'selected-focus': [1, 'focus', 'is-focus'],
};

class BuildError extends Error {}
const fail = (msg) => { throw new BuildError(msg); };
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
function readText(r) {
  try { return fs.readFileSync(path.join(ROOT, r), 'utf8'); } catch (e) { return fail(`${r}: cannot read the file (${e.code || e.message})`); }
}
function readJson(r) {
  const t = readText(r);
  try { return JSON.parse(t); } catch (e) { return fail(`${r}: ${e.message}`); }
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad2 = (n) => String(n).padStart(2, '0');
const fmt = (x) => String(Math.round(x * 1000) / 1000);

function renderPage(sys, componentsCss) {
  const showcase = readJson('pages/components/showcase.json');
  const strings = readJson('pages/components/strings.json');
  const en = readJson(EN_JSON);
  const gates = readJson(GATES);
  const tokensCss = readText(TOKENS_CSS);
  if (tokensCss !== sys.outputs[TOKENS_CSS]) fail(`${TOKENS_CSS} is stale: run node tools/tokens/build.js`);
  const pageCss = readText('pages/components/page.css');
  const pageJs = readText('pages/components/page.js');
  const licences = readJson('pages/components/icons/LICENCES.json');
  const icons = {};
  for (const name of ICONS) {
    const file = `pages/components/icons/${name}.svg`;
    const text = readText(file);
    if (!text.startsWith(ICON_HEAD)) fail(`${file}: must start with ${ICON_HEAD}`);
    const lic = licences[`${name}.svg`];
    if (!lic || lic.licence !== 'own work') fail(`pages/components/icons/LICENCES.json: ${name}.svg is not recorded as own work`);
    icons[name] = text.slice(ICON_HEAD.length).trim();
  }
  for (const f of Object.keys(licences)) if (!ICONS.includes(f.replace(/\.svg$/, ''))) fail(`icons/LICENCES.json lists ${f}, which the build does not use`);

  const chrome = strings.chrome || {};
  const samples = strings.samples || {};
  const T = (key, vars) => {
    if (typeof chrome[key] !== 'string') fail(`strings.json: chrome.${key} is missing`);
    return chrome[key].replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? String(vars[k]) : m));
  };
  // Ukrainian number agreement: chrome.<key> holds "one|few|many" (1 варіація, 94 варіації, 60 варіацій).
  const plural = (n, key) => {
    const forms = T(key).split('|');
    if (forms.length !== 3) fail(`strings.json: chrome.${key} needs three forms "one|few|many"`);
    const d = n % 10, h = n % 100;
    return `${n} ${forms[d === 1 && h !== 11 ? 0 : d >= 2 && d <= 4 && (h < 12 || h > 14) ? 1 : 2]}`;
  };
  const verdictLabel = (v) => T(`verdict_${v}`);
  for (const [key, s] of Object.entries(samples)) {
    if (typeof s.uk !== 'string' || typeof s.en !== 'string') fail(`strings.json: samples.${key} needs "uk" and "en"`);
    if (!s.new && en[s.uk] !== s.en) {
      fail(`strings.json: samples.${key}: "${s.uk}" is not marked "new" but ${EN_JSON} has ${en[s.uk] === undefined ? 'no such string' : `"${en[s.uk]}"`}`);
    }
  }
  const usedSamples = new Set();
  const S = (key) => {
    if (!samples[key]) fail(`strings.json: samples.${key} is missing`);
    usedSamples.add(key);
    return samples[key].uk;
  };
  const sampleSpan = (key, cls) => `<span${cls ? ` class="${cls}"` : ''} data-s="${key}">${esc(S(key))}</span>`;

  // The token system.
  const byName = new Map(sys.variants.map((v) => [v.variation, v]));
  const used = new Set();
  const V = (name) => {
    const v = byName.get(name);
    if (!v) fail(`showcase.json: unknown variation ${name}`);
    used.add(name);
    return v;
  };
  const memo = new Map();
  const isProp = (p) => {
    if (memo.has(p)) return memo.get(p);
    memo.set(p, false);
    const s = sys.sources.get(p);
    const r = !!s && (s.proposal || (s.alias ? isProp(s.alias) : false));
    memo.set(p, r);
    return r;
  };
  const defaultState = (v) => (v.states.panel ? 'panel' : v.states.normal ? 'normal' : Object.keys(v.states)[0] || null);
  function sourcesOf(v, gstate, opts) {
    const out = [];
    const rec = gstate ? v.states[gstate] : null;
    if (rec) for (const f of Object.values(rec)) if (f && f.source) out.push(f.source);
    if (v.label && v.label.source) out.push(v.label.source);
    if (v.press && (v.base || ['depth', 'hover', 'held', 'disabled'].some((k) => v.press[k].value.px !== 0))) {
      out.push(v.press.depth.source);
      const k = { hover: 'hover', pressed: 'held', disabled: 'disabled' }[gstate];
      if (k) out.push(v.press[k].source);
    }
    for (const [n, f] of Object.entries(v.size || {})) if (!n.startsWith('wide-') || (opts && opts.wide)) out.push(f.source);
    for (const n of (opts && opts.items) || []) if (v.items[n]) out.push(v.items[n].source);
    return out.filter(Boolean);
  }
  // uses = [[variation, Godot state, opts]]: a cell gets the badge when any variant, state or token it draws is a proposal.
  function proposal(uses) {
    for (const [name, gstate, opts] of uses) {
      const v = V(name);
      const g = gstate === undefined ? defaultState(v) : gstate;
      if (v.proposal.includes('*')) return true;
      if (g && v.stateProposal && v.stateProposal[g]) return true;
      if (sourcesOf(v, g, opts).some(isProp)) return true;
    }
    return false;
  }
  const BADGE = `<span class="sc-badge">${esc(T('badge'))}</span>`;
  // The large text sizes are badged only while a textSize=large font size still carries a proposal mark.
  const largeProposal = Object.values((sys.pack.modes.textSize || {}).large || {}).some((e) => e && e.proposal);

  function hint(v) {
    const parts = [v.variation, `${v.class}${v.parent ? ` → ${v.parent}` : ''}`, v.context];
    const st = Object.keys(v.states);
    if (st.length) parts.push(st.join(' '));
    if (v.base) {
      let b = v.base.any || v.base.dark;
      if (v.base.light) b += ` / ${v.base.light.startsWith(v.base.dark.replace(/OnDark$/, '')) ? v.base.light.slice(v.base.dark.replace(/OnDark$/, '').length) : v.base.light}`;
      parts.push(`${T('base')} ${b}`);
    }
    if (v.toggle) parts.push(`${T('toggle')} → ${v.toggle.selected}`);
    if (v.selectedOf) parts.push(`${T('toggle')} ← ${v.selectedOf}`);
    if (v.on) parts.push(`${T('on')} ${v.on.join(', ')}`);
    const sizes = Object.entries(v.size || {}).map(([n, f]) => `${n} ${f.value.px}`);
    if (sizes.length) parts.push(sizes.join(' '));
    const items = Object.keys(v.items || {});
    if (items.length) parts.push(items.join(' '));
    return parts.join(' · ');
  }

  // Cells and stages.
  function cell(caption, badge, html, o = {}) {
    const cls = ['sc-cell'];
    if (o.live) cls.push('sc-live');
    if (o.tile) cls.push(`sc-tile-${o.tile}`);
    const pad = o.pad !== undefined ? ` style="--pad: ${o.pad}"` : '';
    return `<figure class="${cls.join(' ')}"><figcaption>${esc(caption)}${badge ? BADGE : ''}</figcaption>`
      + `<div class="sc-sample"${pad}${o.live ? '' : ' inert'}>${html}</div>${o.after || ''}</figure>`;
  }
  const stage = (ctx, cells, label) => `<p class="sc-stage-label">${esc(label || T(`ctx_${ctx}`))}</p>`
    + `<div class="sc-scroll"><div class="sc-stage" data-context="${ctx}">${cells.join('')}</div></div>`;
  const hudTiles = (html, badge, pad) => TILES.map(([t, hex]) => cell(`${T('tile')} ${hex}`, badge, html, { tile: t, pad }));
  const icon = (name, cls) => `<span class="sc-icon${cls ? ` ${cls}` : ''}">${icons[name]}</span>`;
  // A Button's own icon (Godot's icon, tinted by the icon_*_color items: the .tv-icon rules) and OptionButton's arrow
  // (.tv-arrow, the label colour), at the texture's size.
  const bicon = (name, cls) => {
    if (!icons[name]) fail(`showcase.json: unknown icon ${name}`);
    return `<span class="sc-bicon ${cls}">${icons[name]}</span>`;
  };

  function buttonEl(name, stateCls, content, o = {}) {
    const a = ['type="button"', `class="tv-${name}${stateCls ? ` ${stateCls}` : ''}"`];
    if (o.live) a.push('data-live');
    else a.push('tabindex="-1"');
    if (o.toggle) a.push(`data-toggle="${o.toggle.join(' ')}"`, `aria-pressed="${o.pressed ? 'true' : 'false'}"`);
    if (o.group) a.push(`data-group="${o.group}"`);
    return `<button ${a.join(' ')}>${content}<span class="tv-focus"></span></button>`;
  }
  const textIn = (panel, text, label, extra) => `<div class="tv-${panel}${extra ? ` ${extra}` : ''}">${sampleSpan(label, `tv-${text}`)}</div>`;

  // Row kinds.
  function rowButton(row) {
    const names = row.variations;
    names.forEach(V);
    const toggle = row.kind === 'toggle';
    if (toggle && names.length !== 2) fail(`showcase.json: ${row.id}: a toggle row lists X and XSelected`);
    const content = (idx, label, noteLabel) => {
      const main = (row.icon ? bicon(row.icon, 'tv-icon') : '') + (row.icon_only ? '' : sampleSpan(label)) + (row.arrow ? bicon(row.arrow, 'tv-arrow') : '');
      if (!row.note) return main;
      const nv = row.note.variations;
      nv.forEach(V);
      return `<span class="sc-stack">${main}<span class="tv-${nv[idx]}" data-note="${nv.join(' ')}" data-s="${noteLabel}">${esc(S(noteLabel))}</span></span>`;
    };
    const noteUse = (idx) => (row.note ? [[row.note.variations[idx], 'normal']] : []);
    const stages = [];
    for (const ctx of row.contexts) {
      const cells = [];
      if (row.live) {
        const liveStates = row.states.filter((s) => !/disabled|read-only/.test(s));
        const uses = liveStates.flatMap((s) => [[names[STATE[s][0]], STATE[s][1]], ...noteUse(STATE[s][0])]);
        let html;
        if (toggle && row.group) {
          const g = `${row.id}-${ctx}`;
          html = `<div class="sc-group" role="group">${row.group.map((label, i) => buttonEl(names[i === 0 ? 1 : 0], '',
            content(i === 0 ? 1 : 0, label, row.group_notes ? row.group_notes[i] : row.note && row.note.label),
            { live: true, toggle: names, pressed: i === 0, group: g })).join('')}</div>`;
        } else if (toggle) {
          html = buttonEl(names[0], '', content(0, row.label, row.note && row.note.label), { live: true, toggle: names });
        } else {
          html = buttonEl(names[0], '', content(0, row.label, row.note && row.note.label), { live: true });
        }
        cells.push(cell(T('live'), proposal(uses), html, { live: true }));
      }
      for (const s of row.states) {
        const st = STATE[s];
        if (!st) fail(`showcase.json: ${row.id}: unknown state ${s}`);
        const name = names[st[0]];
        if (!name) fail(`showcase.json: ${row.id}: state ${s} needs a second variation`);
        const uses = [[name, st[1]], ...noteUse(st[0])];
        if (st[1] === 'focus') uses.push([name, 'normal']);
        cells.push(cell(T(`st_${s}`), proposal(uses), buttonEl(name, st[2], content(st[0], row.label, row.note && row.note.label))));
      }
      stages.push(stage(ctx, cells));
    }
    return stages.join('');
  }

  function rowField(row) {
    const name = row.variations[0];
    V(name);
    const fieldEl = (cls, inner) => `<div class="tv-${name}${cls ? ` ${cls}` : ''}">${inner}<span class="tv-focus"></span></div>`;
    const value = () => sampleSpan(row.label);
    const all = ['placeholder-color', 'caret-color', 'selection-color', 'selected-font-color'];
    const stages = [];
    for (const ctx of row.contexts) {
      const cells = [];
      if (row.live) {
        const ph = S(row.placeholder);
        cells.push(cell(T('live'), proposal([[name, 'normal', { items: all }], [name, 'focus']]),
          `<label class="tv-${name}" data-live-field><input class="sc-input" type="text" data-s-ph="${row.placeholder}" placeholder="${esc(ph)}" aria-label="${esc(ph)}"><span class="tv-focus"></span></label>`,
          { live: true }));
      }
      for (const s of row.states) {
        let html;
        let uses;
        if (s === 'normal') { html = fieldEl('', value()); uses = [[name, 'normal']]; }
        else if (s === 'placeholder') { html = fieldEl('', sampleSpan(row.placeholder, 'tv-placeholder')); uses = [[name, 'normal', { items: ['placeholder-color'] }]]; }
        else if (s === 'selection') {
          html = fieldEl('', `<span>${sampleSpan(row.label, 'tv-selection')}</span>`);
          uses = [[name, 'normal', { items: ['selection-color', 'selected-font-color'] }]];
        } else if (s === 'focus') {
          html = fieldEl('is-focus', `${value()}<span class="tv-caret"></span>`);
          uses = [[name, 'normal', { items: ['caret-color'] }], [name, 'focus']];
        } else if (s === 'read-only') { html = fieldEl('is-readonly', value()); uses = [[name, 'read-only']]; }
        else fail(`showcase.json: ${row.id}: unknown field state ${s}`);
        cells.push(cell(T(`st_${s}`), proposal(uses), html));
      }
      stages.push(stage(ctx, cells));
    }
    return stages.join('');
  }

  function barEl(name, value, track, live) {
    const v = V(name);
    const steps = v.ramp ? v.ramp.steps.value.value : 0;
    const step = steps ? pad2(Math.floor(value * steps + 0.5)) : null;
    const attrs = [`class="tv-${name}"`];
    if (step !== null) attrs.push(`data-step="${step}"`);
    if (live) attrs.push('data-live-bar', ...(steps ? [`data-steps="${steps}"`] : []));
    attrs.push(`style="--value: ${fmt(value)}"`);
    const inner = `<div ${attrs.join(' ')}><i class="tv-fill"></i></div>`;
    if (track) V('ToyBarTrack');
    return { html: track ? `<div class="tv-ToyBarTrack sc-barbox">${inner}</div>` : `<div class="sc-barbox">${inner}</div>`, step };
  }
  function rowBar(row) {
    const name = row.variations[0];
    const v = V(name);
    const uses = [[name, 'fill'], ...(v.states.background ? [[name, 'background']] : []), ...(row.track ? [['ToyBarTrack', 'panel']] : [])];
    const badge = proposal(uses);
    const stages = [];
    for (const ctx of row.contexts) {
      const cells = [];
      if (row.live) {
        const init = row.values[1] !== undefined ? row.values[1] : row.values[0];
        const b = barEl(name, init, row.track, true);
        cells.push(cell(T('live'), badge, b.html, { live: true, after: `<div class="sc-live-extra"><input type="range" class="sc-range" min="0" max="100" step="1" value="${Math.round(init * 100)}" data-bar-input aria-label="${esc(T('bar_value'))}"><output class="sc-out" data-step-label="${esc(T('bar_step'))}"></output></div>` }));
      }
      row.values.forEach((value, i) => {
        const b = barEl(name, value, row.track, false);
        let cap = `${T('bar_value')} ${fmt(value)}`;
        if (b.step !== null) cap += ` · ${T('bar_step')} ${Number(b.step)}`;
        if (row.captions && row.captions[i]) cap = `${T(row.captions[i])} · ${fmt(value)}`;
        cells.push(cell(cap, badge, b.html));
      });
      if (row.hud) cells.push(...hudTiles(barEl(name, row.values[1], row.track, false).html, badge));
      stages.push(stage(ctx, cells));
    }
    return stages.join('');
  }

  // HSlider: the markup emit-css.js documents; the grabber texture at its own size (the SVG's viewBox).
  const iconSize = (name) => {
    const m = /viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/.exec(icons[name] || '');
    if (!m) fail(`pages/components/icons/${name}.svg: no viewBox "0 0 w h"`);
    return [Number(m[1]), Number(m[2])];
  };
  function sliderEl(name, value, stateCls, editable, live) {
    V(name);
    const knob = editable ? 'slider-knob' : 'slider-knob-disabled';
    const [w, h] = iconSize(knob);
    const attrs = [`class="tv-${name}${stateCls ? ` ${stateCls}` : ''}"`, `style="--value: ${fmt(value)}"`];
    if (live) attrs.push('data-live-bar', 'tabindex="0"');
    return `<div class="sc-sliderbox"><div ${attrs.join(' ')}><i class="tv-slider"></i><span class="tv-grabber-area"><i class="tv-fill"></i>`
      + `<span class="tv-grabber" style="width: calc(${w} * var(--px)); height: calc(${h} * var(--px))">${icons[knob]}</span></span>`
      + '<i class="tv-rest"></i><span class="tv-focus"></span></div></div>';
  }
  function rowSlider(row) {
    const name = row.variations[0];
    const stages = [];
    for (const ctx of row.contexts) {
      const cells = [];
      if (row.live) {
        const init = row.values[0];
        cells.push(cell(T('live'), proposal([[name, 'slider'], [name, 'grabber-area'], [name, 'focus']]), sliderEl(name, init, '', true, true),
          { live: true, after: `<div class="sc-live-extra"><input type="range" class="sc-range" min="0" max="100" step="1" value="${Math.round(init * 100)}" data-bar-input aria-label="${esc(T('bar_value'))}"><output class="sc-out"></output></div>` }));
      }
      row.values.forEach((value) => cells.push(cell(`${T('bar_value')} ${fmt(value)}`, proposal([[name, 'slider'], [name, 'grabber-area']]), sliderEl(name, value, '', true, false))));
      const v = row.values[0];
      cells.push(cell(T('st_hover'), proposal([[name, 'grabber-area-highlight']]), sliderEl(name, v, 'is-hover', true, false)));
      cells.push(cell(T('st_focus'), proposal([[name, 'grabber-area-highlight'], [name, 'focus']]), sliderEl(name, v, 'is-focus', true, false)));
      cells.push(cell(T('st_disabled'), proposal([[name, 'slider']]), sliderEl(name, v, '', false, false)));
      stages.push(stage(ctx, cells));
    }
    return stages.join('');
  }
  // VScrollBar: value and page as fractions of the range (emit-css.js), at a fixed sample length.
  function rowScrollBar(row) {
    const name = row.variations[0];
    V(name);
    const bar = (value, page, cls) => `<div class="sc-scrollbox"><div class="tv-${name}${cls ? ` ${cls}` : ''}" style="--value: ${fmt(value)}; --page: ${fmt(page)}">`
      + '<i class="tv-pre"></i><i class="tv-grabber"></i><i class="tv-post"></i></div></div>';
    const stages = [];
    for (const ctx of row.contexts) {
      const cells = row.samples.map(([value, page]) => cell(`${T('bar_value')} ${fmt(value)} · ${T('scroll_page')} ${fmt(page)}`,
        proposal([[name, 'scroll'], [name, 'grabber']]), bar(value, page, '')));
      const [v0, p0] = row.samples[0];
      cells.push(cell(T('st_hover'), proposal([[name, 'grabber-highlight']]), bar(v0, p0, 'is-hover')));
      cells.push(cell(T('st_held'), proposal([[name, 'grabber-pressed']]), bar(v0, p0, 'is-held')));
      cells.push(cell(T('st_focus'), proposal([[name, 'scroll-focus']]), bar(v0, p0, 'is-focus')));
      stages.push(stage(ctx, cells));
    }
    return stages.join('');
  }
  // Spacing containers: placeholder boxes at the variation's gaps (a column, a row, a grid of three columns).
  function rowLayout(row) {
    const box = '<i class="sc-lay-box"></i>';
    const cells = row.variations.map((name) => {
      const v = V(name);
      const kind = v.class === 'VBoxContainer' ? 'col' : v.class === 'HBoxContainer' ? 'row' : v.class === 'ScrollContainer' ? 'scroll' : 'grid';
      const n = kind === 'grid' ? 6 : 3;
      const gaps = Object.values(v.items).map((f) => f.value.px).join(' · ');
      // A ScrollContainer: a column of boxes beside the drawn bar (ToyScrollBar), its gap the variation's.
      const body = kind === 'scroll'
        ? `<div class="sc-lay-col">${box.repeat(n)}</div><div class="tv-ToyScrollBar" style="--value: 0; --page: 0.6"><i class="tv-pre"></i><i class="tv-grabber"></i><i class="tv-post"></i></div>`
        : box.repeat(n);
      if (kind === 'scroll') V('ToyScrollBar');
      return cell(`${name} · ${gaps}`, proposal([[name, null, { items: Object.keys(v.items) }]]),
        `<div class="tv-${name} sc-lay-${kind}">${body}</div>`);
    });
    return stage(row.context || 'light', cells);
  }

  function itemHtml(it) {
    V(it.v);
    if (it.text) V(it.text);
    if (it.box) return `<div class="tv-${it.v}" style="width: calc(${it.box[0]} * var(--px)); height: calc(${it.box[1]} * var(--px))"></div>`;
    if (it.text) return textIn(it.v, it.text, it.label, it.wide ? 'tv-wide' : '');
    if (it.label) return sampleSpan(it.label, `tv-${it.v}`);
    return `<div class="tv-${it.v}"></div>`;
  }
  function rowStatic(row) {
    const order = [];
    const groups = new Map();
    for (const it of row.items) {
      if (!groups.has(it.context)) { groups.set(it.context, []); order.push(it.context); }
      groups.get(it.context).push(it);
    }
    const stages = [];
    for (const ctx of order) {
      const cells = groups.get(ctx).map((it) => {
        const uses = [[it.v, undefined, { wide: !!it.wide }], ...(it.text ? [[it.text, 'normal']] : [])];
        const cap = it.caption ? T(it.caption) : `${it.v}${it.wide ? ` · ${T('st_wide')}` : ''}`;
        return cell(cap, proposal(uses), itemHtml(it), { pad: it.pad });
      });
      if (row.hud && ctx === 'dark') {
        const its = groups.get(ctx);
        const badge = proposal(its.map((it) => [it.v, undefined, { wide: !!it.wide }]));
        cells.push(...hudTiles(`<div class="sc-col">${its.map(itemHtml).join('')}</div>`, badge));
      }
      stages.push(stage(ctx, cells));
    }
    return stages.join('');
  }

  // Fixed composites (§14.2).
  function rowSlotSet() {
    ['ToySlot', 'ToySlotActive', 'ToySlotText', 'ToySlotTextEmpty'].forEach(V);
    const filled = (label) => `${icon('item')}${sampleSpan(label, 'tv-ToySlotText')}`;
    const list = [
      ['slot_belt_empty', `<div class="tv-ToySlot">${sampleSpan('belt', 'tv-ToySlotTextEmpty')}</div>`, [['ToySlot'], ['ToySlotTextEmpty']]],
      ['slot_hand_empty', `<div class="tv-ToySlotActive">${sampleSpan('hand', 'tv-ToySlotTextEmpty')}</div>`, [['ToySlotActive'], ['ToySlotTextEmpty']]],
      ['slot_hand_filled', `<div class="tv-ToySlotActive">${filled('knife')}</div>`, [['ToySlotActive'], ['ToySlotText']]],
      ['slot_belt_filled', `<div class="tv-ToySlot">${filled('key_item')}</div>`, [['ToySlot'], ['ToySlotText']]],
      ['slot_two_handed', `<div class="tv-ToySlotActive tv-wide">${filled('package')}</div>`, [['ToySlotActive', undefined, { wide: true }], ['ToySlotText']]],
    ];
    const cells = list.map(([cap, html, uses]) => cell(T(cap), proposal(uses), html));
    const set = `<div class="sc-group"><div class="tv-ToySlotActive tv-wide">${filled('package')}</div><div class="tv-ToySlot">${filled('key_item')}</div><div class="tv-ToySlot">${sampleSpan('belt', 'tv-ToySlotTextEmpty')}</div></div>`;
    cells.push(cell(T('slot_set'), false, set), ...hudTiles(set, false));
    return stage('dark', cells);
  }
  function rowHudBar() {
    ['ToyBarLabel', 'ToyHudCaption'].forEach(V);
    const html = `<div class="sc-hudbar"><div class="tv-ToyBarLabel">${sampleSpan('stamina', 'tv-ToyHudCaption')}</div>${barEl('ToyBarStamina', 0.9, true).html}`
      + `<div class="tv-ToyBarLabel">${sampleSpan('health', 'tv-ToyHudCaption')}</div>${barEl('ToyBarHealth', 0.8, true).html}</div>`;
    const badge = proposal([['ToyBarLabel'], ['ToyHudCaption'], ['ToyBarTrack'], ['ToyBarStamina', 'fill'], ['ToyBarHealth', 'fill']]);
    return stage('dark', [cell('ToyBarLabel + ToyHudCaption', badge, html), ...hudTiles(html, badge)]);
  }
  function rowMenu() {
    ['ToyPanelMenu', 'ToyBasePanel', 'ToyTitleOnLight', 'ToyTextMutedOnLight', 'ToyTab', 'ToyTabSelected', 'ToyButtonPrimary', 'ToyButtonSecondary'].forEach(V);
    const html = `<div class="tv-ToyPanelMenu sc-panel" data-context="light">${sampleSpan('settings', 'tv-ToyTitleOnLight')}`
      + `<div class="sc-group">${buttonEl('ToyTabSelected', '', sampleSpan('game'))}${buttonEl('ToyTab', '', sampleSpan('lobby'))}${buttonEl('ToyTab', '', sampleSpan('character'))}</div>`
      + `${sampleSpan('leave_host_note', 'tv-ToyTextMutedOnLight sc-wrap')}`
      + `<div class="sc-actions">${buttonEl('ToyButtonPrimary', '', sampleSpan('resume'))}${buttonEl('ToyButtonSecondary', '', sampleSpan('settings'))}</div></div>`;
    const badge = proposal([['ToyPanelMenu'], ['ToyBasePanel'], ['ToyTitleOnLight'], ['ToyTextMutedOnLight'], ['ToyTab', 'normal'], ['ToyTabSelected', 'normal'], ['ToyButtonPrimary', 'normal'], ['ToyButtonSecondary', 'normal']]);
    return stage('dark', [cell(T('menu_panel'), badge, html)]);
  }
  function rowDialog() {
    ['ToyBackdrop', 'ToyPanelDialog', 'ToyBasePanel', 'ToyTitleOnLight', 'ToyTextOnLight', 'ToyTextMutedOnLight', 'ToyButtonPrimary', 'ToyButtonDanger', 'ToyButtonGhostOnLight'].forEach(V);
    const dialog = (title, body, note, act, actLabel, ghostLabel) => `<div class="tv-ToyBackdrop sc-backdrop"><div class="tv-ToyPanelDialog sc-dialog" data-context="light">`
      + `${sampleSpan(title, 'tv-ToyTitleOnLight sc-wrap')}${sampleSpan(body, 'tv-ToyTextOnLight sc-wrap')}${note ? sampleSpan(note, 'tv-ToyTextMutedOnLight sc-wrap') : ''}`
      + `<div class="sc-actions">${buttonEl(act, '', sampleSpan(actLabel), { live: true })}${buttonEl('ToyButtonGhostOnLight', '', sampleSpan(ghostLabel), { live: true })}</div></div></div>`;
    const base = [['ToyBackdrop'], ['ToyPanelDialog'], ['ToyBasePanel'], ['ToyTitleOnLight'], ['ToyTextOnLight'], ['ToyButtonGhostOnLight', 'normal']];
    return stage('dark', [
      cell(T('dialog_tutorial'), proposal([...base, ['ToyButtonPrimary', 'normal']]), dialog('first_time', 'tutorial_body', null, 'ToyButtonPrimary', 'start', 'skip'), { live: true, tile: 'grey', pad: 0 }),
      cell(T('dialog_confirm'), proposal([...base, ['ToyTextMutedOnLight'], ['ToyButtonDanger', 'normal']]), dialog('leave_q', 'leave_body', 'host_note', 'ToyButtonDanger', 'leave', 'cancel'), { live: true, tile: 'grey', pad: 0 }),
    ]);
  }
  function rowBackdrops(row) {
    row.variations.forEach(V);
    V('ToyTextOnDark');
    const cells = [];
    for (const name of row.variations) {
      for (const [t, hex] of TILES.slice(0, 2)) {
        cells.push(cell(`${name} · ${T('tile')} ${hex}`, proposal([[name], ['ToyTextOnDark']]),
          `<div class="tv-${name} sc-fill">${sampleSpan('raise_hint', 'tv-ToyTextOnDark')}</div>`, { tile: t, pad: 0 }));
      }
    }
    return stage('dark', cells);
  }
  function rowHowto() {
    ['ToyPanelHowto', 'ToyBasePanel', 'ToyHowtoFrame', 'ToyHowtoFrameDone', 'ToyHowtoCaption', 'ToyTitleOnLight', 'ToyHowtoNote'].forEach(V);
    const frame = (label, done) => `<div class="tv-${done ? 'ToyHowtoFrameDone' : 'ToyHowtoFrame'} sc-frame">${icon(done ? 'check' : 'item')}${sampleSpan(label, 'tv-ToyHowtoCaption')}</div>`;
    const card = (steps, doneIdx) => `<div class="tv-ToyPanelHowto sc-howto" data-context="light"><div class="sc-howto-head">${sampleSpan('switches', 'tv-ToyTitleOnLight')}</div>${sampleSpan('how_to', 'tv-ToyHowtoNote')}`
      + `<div class="sc-frames">${steps.map((s, i) => frame(s, i === doneIdx)).join('')}</div></div>`;
    const uses = [['ToyPanelHowto'], ['ToyBasePanel'], ['ToyHowtoFrame'], ['ToyHowtoCaption'], ['ToyTitleOnLight'], ['ToyHowtoNote']];
    const four = ['step1', 'step2', 'step3', 'step4'];
    return stage('dark', [
      cell(T('howto_four'), proposal(uses), card(four, -1)),
      cell(T('howto_done'), proposal([...uses, ['ToyHowtoFrameDone']]), card(four, 3)),
      cell(T('howto_three'), proposal([...uses, ['ToyHowtoFrameDone']]), card(['step1', 'step2', 'step4'], 1)),
    ]);
  }
  function rowSettings() {
    ['ToySettingRow', 'ToySettingRowText', 'ToySettingRowValue', 'ToyStepper', 'ToyTextMutedOnLight'].forEach(V);
    const stepper = (disabled, live) => `<span class="sc-stepper">${buttonEl('ToyStepper', disabled ? 'is-disabled' : '', bicon('chevron-left', 'tv-icon'), { live })}`
      + `${sampleSpan('min10', 'tv-ToySettingRowValue')}${buttonEl('ToyStepper', disabled ? 'is-disabled' : '', bicon('chevron-right', 'tv-icon'), { live })}</span>`;
    const rowHtml = (label, right) => `<div class="tv-ToySettingRow sc-setrow">${sampleSpan(label, 'tv-ToySettingRowText')}${right}</div>`;
    const base = [['ToySettingRow'], ['ToySettingRowText'], ['ToySettingRowValue']];
    const lockNote = `<span class="sc-lockline">${icon('lock', 'sc-icon-small')}${sampleSpan('host_only_text', 'tv-ToyTextMutedOnLight')}</span>`;
    return stage('light', [
      cell(T('set_value'), proposal(base), rowHtml('game_volume', sampleSpan('volume_value', 'tv-ToySettingRowValue'))),
      cell(T('set_stepper'), proposal([...base, ['ToyStepper', 'normal']]), rowHtml('match_duration', stepper(false, true)), { live: true }),
      cell(T('set_guest'), proposal([...base, ['ToyStepper', 'disabled'], ['ToyTextMutedOnLight']]),
        `<div class="sc-setcol">${rowHtml('match_duration', stepper(true, false))}${lockNote}</div>`),
    ]);
  }
  function rowMap() {
    ['ToyMapBoard', 'ToyBasePanel', 'ToyMapRoom', 'ToyMapRoomText', 'ToyMapZone', 'ToyMapPin', 'ToyChipPlate', 'ToyHudCaption', 'ToyKeyRound', 'ToyKeyText'].forEach(V);
    const room = (label, extra) => `<div class="sc-room-wrap"><div class="tv-ToyMapRoom sc-room">${icon('item')}${sampleSpan(label, 'tv-ToyMapRoomText')}</div>${extra || ''}</div>`;
    const chip = textIn('ToyChipPlate', 'ToyHudCaption', 'you_are_here');
    const pin = (deg) => `<div class="tv-ToyMapPin" style="transform: rotate(${deg}deg)"></div>`;
    const board = `<div class="tv-ToyMapBoard sc-map" data-context="light"><div class="sc-map-grid">`
      + room('storage') + room('kitchen', `<div class="tv-ToyMapZone sc-overlay"></div>`) + room('lab', `<div class="sc-pin-at">${textIn('ToyKeyRound', 'ToyKeyText', 'question')}</div>`)
      + room('office', `<div class="sc-pin-at">${pin(80)}${chip}</div>`) + room('hall') + '</div></div>';
    return stage('dark', [
      cell(T('map_board'), proposal([['ToyMapBoard'], ['ToyBasePanel'], ['ToyMapRoom'], ['ToyMapRoomText'], ['ToyMapZone'], ['ToyMapPin'], ['ToyChipPlate'], ['ToyHudCaption'], ['ToyKeyRound'], ['ToyKeyText']]), board),
      cell(T('map_pin0'), proposal([['ToyMapPin']]), `<div class="sc-pin-solo" data-context="light">${pin(0)}</div>`),
      cell(T('map_pin80'), proposal([['ToyMapPin']]), `<div class="sc-pin-solo" data-context="light">${pin(80)}</div>`),
      cell(T('map_zone'), proposal([['ToyMapZone']]), `<div class="tv-ToyMapZone" style="width: calc(120 * var(--px)); height: calc(80 * var(--px))"></div>`),
      cell(T('map_chip'), proposal([['ToyChipPlate'], ['ToyHudCaption']]), chip),
    ]);
  }
  function rowMic() {
    V('ToyMic');
    const on = `<div class="tv-ToyMic">${icon('mic', 'tv-icon-on')}</div>`;
    const off = `<div class="tv-ToyMic">${icon('mic-off', 'tv-icon-off')}</div>`;
    const b = proposal([['ToyMic', 'panel', { items: ['icon-on', 'icon-off'] }]]);
    return stage('dark', [cell(T('mic_on'), b, on), cell(T('mic_off'), b, off), ...hudTiles(`<div class="sc-group">${on}${off}</div>`, b)]);
  }
  function rowSwatches() {
    ['ToySwatchRing', 'ToySwatchSelected', 'ToySwatchFocus'].forEach(V);
    return stage('light', [
      cell(T('swatch_ring'), proposal([['ToySwatchRing']]), '<div class="tv-ToySwatchRing"></div>'),
      cell(T('swatch_selected'), proposal([['ToySwatchRing'], ['ToySwatchSelected']]),
        '<div class="sc-swatch"><div class="tv-ToySwatchRing"></div><div class="tv-ToySwatchSelected sc-overlay"></div></div>'),
      cell(T('swatch_focus'), proposal([['ToySwatchRing'], ['ToySwatchFocus']]),
        '<div class="sc-swatch"><div class="tv-ToySwatchRing"></div><div class="tv-ToySwatchFocus sc-overlay"></div></div>'),
    ]);
  }

  // Every own-work icon at its texture size, on dark and on light (tinted ones take the context's text colour).
  function rowIcons() {
    const cells = (ctx) => ICONS.map((name) => cell(`${name}.svg`, false, `<span class="sc-icon sc-icon-${name}">${icons[name]}</span>`));
    return stage('dark', cells('dark')) + stage('light', cells('light'));
  }

  // The Tokens section.
  function rowPalette() {
    const items = [];
    for (const [p, s] of sys.sources) {
      if (!p.startsWith('palette.')) continue;
      const val = sys.tokens.get(p);
      const a = val.rgba ? val.rgba[3] : 1;
      const text = a < 1 ? `${val.hex} · α ${fmt(a)}` : val.hex;
      items.push(`<div class="sc-pal"><span class="sc-pal-chip"><i></i><i></i><b style="background: var(${sys.cssVar(p)})"></b></span>`
        + `<span class="sc-pal-name">${esc(p.slice(8))}${s.proposal ? BADGE : ''}</span><code class="sc-pal-val">${esc(text)}</code></div>`);
    }
    return `<div class="sc-palette">${items.join('')}</div>`;
  }
  function rowTypeScale(row) {
    const large = sys.permutations.find((p) => p.inputs.textSize === 'large' && p.inputs.motion === 'default');
    if (!large) fail('the token system has no textSize=large permutation');
    const out = [];
    for (const [p] of sys.sources) {
      if (!p.startsWith('type.')) continue;
      const d = sys.tokens.get(p);
      const l = large.tokens.get(p);
      const b = sys.cssVar(p);
      const style = (size) => `font-family: var(${b}-font-family), system-ui, sans-serif; font-size: calc(${size} * var(--px)); font-weight: var(${b}-font-weight); line-height: var(${b}-line-height); letter-spacing: calc(var(${b}-letter-spacing) * var(--px))`;
      const diff = l.fontSizePx !== d.fontSizePx;
      out.push(`<div class="sc-type"><div class="sc-type-head"><code>${esc(p)}</code><span>${d.fontSizePx} / ${l.fontSizePx} px · ${d.fontWeight} · ${d.lineHeight} · ${d.letterSpacingPx}</span></div>`
        + `<div class="sc-type-samples"><div><small>${esc(T('type_default'))} ${d.fontSizePx}</small><span class="sc-type-sample" style="${style(d.fontSizePx)}" data-s="${row.label}">${esc(S(row.label))}</span></div>`
        + `<div><small>${esc(T('type_large'))} ${l.fontSizePx}${diff && largeProposal ? BADGE : ''}</small><span class="sc-type-sample" style="${style(l.fontSizePx)}" data-s="${row.label}">${esc(S(row.label))}</span></div></div></div>`);
    }
    return out.join('');
  }
  function rowRamp() {
    const stops = sys.healthStops;
    if (!gates.ramp || gates.ramp.length !== stops.length) fail(`${GATES}: the ramp has ${gates.ramp ? gates.ramp.length : 0} stops, the tokens ${stops.length}: run node tools/contrast/gates.js`);
    const strip = stops.map((s) => `<span style="background: var(${sys.cssVar(s.path || `bar.health.ramp.stop-${pad2(s.step)}`)})"></span>`).join('');
    const cells = stops.map((s, i) => {
      const g = gates.ramp[i];
      if (g.hex.toLowerCase() !== s.hex.toLowerCase()) fail(`${GATES}: ramp step ${s.step} is ${g.hex}, the tokens ${s.hex}: run node tools/contrast/gates.js`);
      return `<div class="sc-ramp-cell"><span class="sc-ramp-sw" style="background: ${s.hex}"></span><b>hp ${s.fraction.toFixed(2)}</b>`
        + `<code>${s.hex}</code><span>${g.ratio.toFixed(2)} : 1 <span class="sc-v sc-v-${esc(g.verdict)}">${esc(verdictLabel(g.verdict))}</span></span></div>`;
    }).join('');
    return `<div class="sc-ramp-strip">${strip}</div><div class="sc-ramp-grid">${cells}</div><p class="sc-note">${esc(T('ramp_note'))}</p>`;
  }
  function rowContrast() {
    // What a pair sits over: a world tile by its chrome name, a surface as its token path ("color.surface.plate/light").
    const overText = (over) => over.split('/').map((p) => (/^[a-z]+$/.test(p) ? esc(T(`world_${p}`)) : `<code>${esc(p)}</code>`)).join(' / ');
    const perms = [...new Set(gates.results.map((r) => r.permutation))];
    const first = perms[0];
    const verdicts = ['ok', 'FAIL', 'WAIVED', 'info'];
    const count = (list) => verdicts.map((v) => list.filter((r) => r.verdict === v).length);
    const table = `<table class="sc-perm"><thead><tr><th></th>${verdicts.map((v) => `<th class="sc-v sc-v-${v}">${esc(verdictLabel(v))}</th>`).join('')}</tr></thead><tbody>`
      + perms.map((p) => `<tr><td><code>${p.split(',').map(esc).join('<br>')}</code></td>${count(gates.results.filter((r) => r.permutation === p)).map((n) => `<td>${n}</td>`).join('')}</tr>`).join('')
      + '</tbody></table>';
    const item = (r) => `<li class="sc-cr"><span class="sc-cr-sw" style="color: ${esc(r.fg)}; background: ${esc(r.bg)}">Aa</span>`
      + `<span class="sc-cr-txt"><b>${esc(r.id)}</b>${r.what ? ` <span lang="en">${esc(r.what)}</span>` : ''}<br><code>${esc(r.fgPath)}</code> ${esc(T('on'))} <code>${esc(r.bgPath)}</code>${r.over ? ` · ${esc(T('contrast_over'))} ${overText(r.over)}` : ''}</span>`
      + `<span class="sc-cr-num"><b>${r.ratio.toFixed(2)}</b><small>${r.min == null ? esc(T('contrast_no_min')) : `≥ ${r.min}`}</small><span class="sc-v sc-v-${esc(r.verdict)}">${esc(verdictLabel(r.verdict))}</span></span></li>`;
    const rows = gates.results.filter((r) => r.permutation === first);
    const declared = rows.filter((r) => r.kind === 'declared');
    const auto = rows.filter((r) => r.kind !== 'declared');
    return `<p class="sc-note">${esc(T('contrast_note'))}</p><h4 class="sc-sub">${esc(T('contrast_perms'))}</h4>${table}`
      + `<h4 class="sc-sub">${esc(T('contrast_declared'))} · ${declared.length}</h4><ul class="sc-cr-list">${declared.map(item).join('')}</ul>`
      + `<details class="sc-more-list"><summary>${esc(T('contrast_auto'))} · ${auto.length}</summary><ul class="sc-cr-list">${auto.map(item).join('')}</ul></details>`;
  }

  const KINDS = {
    button: rowButton, toggle: rowButton, field: rowField, bar: rowBar, static: rowStatic, 'slot-set': rowSlotSet,
    'hud-bar': rowHudBar, menu: rowMenu, dialog: rowDialog, backdrops: rowBackdrops, howto: rowHowto, settings: rowSettings,
    map: rowMap, mic: rowMic, swatches: rowSwatches, palette: rowPalette, 'type-scale': rowTypeScale, ramp: rowRamp,
    contrast: rowContrast, icons: rowIcons, slider: rowSlider, scrollbar: rowScrollBar, layout: rowLayout,
  };
  const TOKEN_KINDS = new Set(['palette', 'type-scale', 'ramp', 'contrast', 'icons']);

  // The page.
  const sections = [];
  const options = [];
  const rowIds = new Set();
  for (const sec of showcase.sections) {
    const title = T(sec.title_key);
    options.push(`<option value="${esc(sec.id)}">${esc(title)}</option>`);
    const rows = [];
    for (const row of sec.rows) {
      if (rowIds.has(row.id)) fail(`showcase.json: duplicate row id ${row.id}`);
      rowIds.add(row.id);
      const render = KINDS[row.kind];
      if (!render) fail(`showcase.json: ${row.id}: unknown kind ${row.kind}`);
      const names = row.variations || (row.items ? [...new Set(row.items.flatMap((it) => [it.v, it.text].filter(Boolean)))] : []);
      names.forEach(V);
      const head = row.title_key ? T(row.title_key) : names.join(' / ');
      const hints = TOKEN_KINDS.has(row.kind) ? '' : `<div class="sc-hints">${names.map((n) => `<code class="sc-hint">${esc(hint(byName.get(n)))}</code>`).join('')}</div>`;
      rows.push(`<article class="sc-row" id="row-${esc(row.id)}"><h3 class="sc-row-title">${esc(head)}</h3>${hints}${render(row)}</article>`);
    }
    sections.push(`<section id="${esc(sec.id)}"><h2>${esc(title)}</h2>${rows.join('\n')}</section>`);
  }
  const missing = sys.variants.filter((v) => !v.abstract && !used.has(v.variation)).map((v) => v.variation);
  if (missing.length) fail(`showcase.json: these variations appear nowhere on the page: ${missing.join(', ')}`);
  // A sample marked other_page is read by another page (pages/choices reads minus and plus), not by this one.
  const unusedSamples = Object.keys(samples).filter((k) => !usedSamples.has(k) && !samples[k].other_page);
  if (unusedSamples.length) fail(`strings.json: unused samples: ${unusedSamples.join(', ')}`);

  const seg = (ctl, label, opts) => `<div class="sc-ctl" role="group" aria-label="${esc(label)}"><span class="sc-ctl-label">${esc(label)}</span><div class="sc-seg">`
    + opts.map(([val, text, badge]) => `<button type="button" data-ctl="${ctl}" data-val="${val}" aria-pressed="false">${esc(text)}${badge ? BADGE : ''}</button>`).join('')
    + '</div></div>';
  const controls = seg('lang', T('ctl_lang'), [['uk', 'UA'], ['en', 'EN']])
    + seg('text', T('ctl_text'), [['default', T('text_default')], ['large', T('text_large'), largeProposal]])
    + seg('motion', T('ctl_motion'), [['default', T('motion_default')], ['reduced', T('motion_reduced')]])
    + seg('zoom', T('ctl_zoom'), [50, 75, 100, 150, 200].map((z) => [String(z), `${z} %`]));
  const sampleJson = JSON.stringify(Object.fromEntries(Object.keys(samples).sort().map((k) => [k, { uk: samples[k].uk, en: samples[k].en }])))
    .replace(/</g, '\\u003c');
  const meta = T('meta', { version: sys.version, variations: plural(sys.counts.variations, 'n_variations'),
    proposals: plural(sys.counts.proposals, 'n_proposals'), permutations: plural(sys.counts.permutations, 'n_permutations') });
  const styleBlock = (id, text) => `<style id="${id}">\n${text.replace(/\s+$/, '')}\n</style>`;

  return [
    '<!doctype html>',
    '<html lang="uk" data-text-size="default">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${esc(T('title'))}</title>`,
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${FONT_LINK}">`,
    styleBlock('toy-tokens', tokensCss),
    styleBlock('toy-components', componentsCss),
    styleBlock('sc-page', pageCss),
    '</head>',
    '<body>',
    '<main>',
    `<h1>${esc(T('title'))}</h1>`,
    `<p class="sc-lead">${esc(T('lead'))}</p>`,
    `<p class="sc-meta">${esc(meta)}</p>`,
    `<div class="sc-bar" id="sc-bar"><div class="sc-bar-top"><label class="sc-sel"><span>${esc(T('ctl_section'))}</span><select id="sc-section">${options.join('')}</select></label>`
      + `<button type="button" class="sc-more" id="sc-more" aria-expanded="false" aria-controls="sc-controls">${esc(T('ctl_settings'))}</button></div>`
      + `<div class="sc-controls" id="sc-controls">${controls}</div>`
      + `<p class="sc-note" id="sc-zoom-note" hidden>${esc(T('zoom_note'))}</p>`
      + `${largeProposal ? `<p class="sc-note" id="sc-large-note" hidden>${esc(T('large_note'))}</p>` : ''}</div>`,
    sections.join('\n'),
    `<footer>${esc(T('footer'))}</footer>`,
    '</main>',
    `<script id="sc-samples" type="application/json">${sampleJson}</script>`,
    `<script>\n${pageJs.replace(/\s+$/, '')}\n</script>`,
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

function main(argv) {
  const check = argv.includes('--check');
  const unknown = argv.filter((a) => a !== '--check');
  if (unknown.length) {
    console.error(`unknown argument ${unknown[0]}\nusage: node pages/components/build.js [--check]`);
    return 2;
  }
  let sys;
  try {
    sys = api.load({ root: ROOT });
  } catch (e) {
    console.error(e.message);
    return 1;
  }
  let outputs;
  try {
    const css = emitComponentsCss(sys);
    outputs = [[OUT_CSS, css], [OUT_HTML, renderPage(sys, css)]];
  } catch (e) {
    if (e instanceof BuildError || /^emit-css:/.test(e.message)) { console.error(`error: ${e.message}`); return 1; }
    throw e;
  }
  for (const [file, text] of outputs) if (/\r/.test(text)) { console.error(`error: ${file} would contain CR bytes`); return 1; }
  if (check) {
    const stale = [];
    for (const [file, text] of outputs) {
      let disk = null;
      try { disk = fs.readFileSync(path.join(ROOT, file), 'utf8'); } catch (e) { disk = null; }
      if (disk !== text) stale.push(`${file} (${disk === null ? 'missing' : 'differs'})`);
    }
    if (stale.length) {
      console.log(`stale: ${stale.join(', ')}; run node pages/components/build.js`);
      return 1;
    }
    console.log(`up to date: ${outputs.map(([f]) => f).join(', ')}`);
    return 0;
  }
  for (const [file, text] of outputs) fs.writeFileSync(path.join(ROOT, file), text);
  const kb = (t) => `${Math.round(Buffer.byteLength(t) / 1024)} KB`;
  console.log(`wrote ${outputs.map(([f, t]) => `${f} (${kb(t)})`).join(', ')}`);
  return 0;
}

module.exports = { renderPage, main, rel };

if (require.main === module) process.exitCode = main(process.argv.slice(2));
