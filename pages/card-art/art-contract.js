// The SVG contract of the how-to card art (prime-game-ui#3): pages/card-art/brief.md, section 1. Every style folder in
// pages/card-art/art/ holds exactly the 8 panels (delivery-1 to switches-4) and LICENCES.json, and every panel uses only
// what both a browser and Godot 4.7.2's ThorVG draw the same: the allowed elements and presentation attributes,
// #rrggbb colours, plain numbers with at most 2 decimals, a fill on every shape, round joins on every stroke and round
// caps on open strokes, unique panel-prefixed ids, references only into the file's own defs, at most 12,288 bytes.
// Gradients only in the styles that allow them (GRADIENT_STYLES, brief section 5). Every panel is recorded as own work
// in its folder's LICENCES.json. It does not check the 12-unit margin (that needs a render; see brief section 2).
//
//   node pages/card-art/art-contract.js     check every style folder; print the problems, exit 1 on any
//
// pages/card-art/build.js runs it on every build and --check. Node 20, no packages.
'use strict';

const fs = require('fs');
const path = require('path');

const ART = path.join(__dirname, 'art');
const PANELS = ['delivery-1', 'delivery-2', 'delivery-3', 'delivery-4', 'switches-1', 'switches-2', 'switches-3', 'switches-4'];
const PREFIX = (panel) => `${panel[0]}${panel.slice(-1)}-`;
const GRADIENT_STYLES = new Set(['clay']);
const MAX_BYTES = 12288;
const LICENCE_LINE = '<!-- own work, prime-game-ui, licence: own work -->';
const ROOT_TAG = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">';
const LICENCES = new Set(['own work']);

const SHAPES = new Set(['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon']);
const GRADIENTS = new Set(['linearGradient', 'radialGradient']);
const PAINT_ATTRS = ['id', 'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'width', 'height', 'x1', 'y1', 'x2', 'y2', 'points',
  'transform', 'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linejoin',
  'stroke-linecap', 'stroke-miterlimit', 'opacity', 'paint-order', 'clip-path'];
const ATTRS = {
  svg: [],
  defs: [],
  g: PAINT_ATTRS,
  use: ['href'],
  clipPath: ['id'],
  linearGradient: ['id', 'x1', 'y1', 'x2', 'y2', 'gradientUnits', 'gradientTransform'],
  radialGradient: ['id', 'cx', 'cy', 'r', 'fx', 'fy', 'gradientUnits', 'gradientTransform'],
  stop: ['offset', 'stop-color', 'stop-opacity'],
};
for (const s of SHAPES) ATTRS[s] = PAINT_ATTRS;
const CLIP_CHILDREN = new Set(['path', 'circle', 'ellipse', 'rect', 'polygon']);
const NUMBER_ATTRS = new Set(['cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'width', 'height', 'x1', 'y1', 'x2', 'y2',
  'stroke-width', 'stroke-miterlimit', 'fx', 'fy', 'offset']);
const UNIT_ATTRS = new Set(['fill-opacity', 'stroke-opacity', 'opacity', 'stop-opacity', 'offset']);

const NUM = /^-?(\d+(\.\d{1,2})?|\.\d{1,2})$/;
const COLOUR = /^#[0-9a-f]{6}$/;
const URL_REF = /^url\(#([a-z0-9-]+)\)$/;
const TAG = /<!--[\s\S]*?-->|<(\/?)([A-Za-z][\w:.-]*)((?:\s+[^\s=<>/]+\s*=\s*"[^"]*")*)\s*(\/?)>|[^<]+|</g;
const ATTR = /([^\s=]+)\s*=\s*"([^"]*)"/g;

// The numbers inside a path, a points list or a transform: plain decimals, at most 2 decimals, no exponent.
function badNumbers(value) {
  if (/[eE]/.test(value.replace(/translate|rotate|scale|matrix/g, ''))) return 'an exponent';
  const long = (value.match(/\d*\.\d+/g) || []).find((n) => n.split('.')[1].length > 2);
  return long ? `${long} has more than 2 decimals` : null;
}

function checkTransform(value) {
  if (!/^\s*((translate|rotate|scale|matrix)\(\s*[-0-9.,\s]+\)\s*)+$/.test(value)) return 'only translate, rotate, scale and matrix';
  for (const m of value.matchAll(/scale\(([^)]*)\)/g)) {
    const a = m[1].trim().split(/[\s,]+/);
    if (a.length > 1 && Number(a[0]) !== Number(a[1])) return `a non-uniform scale(${m[1]})`;
  }
  return badNumbers(value);
}

function isOpen(el) {
  if (el.name === 'line' || el.name === 'polyline') return true;
  if (el.name !== 'path') return false;
  return (el.attrs.d || '').split(/(?=[Mm])/).filter((s) => s.trim()).some((s) => !/[Zz]\s*$/.test(s));
}

// One panel's text -> its problems (strings).
function checkSvg(text, panel, style) {
  const problems = [];
  const add = (line, msg) => problems.push(line ? `line ${line}: ${msg}` : msg);
  const bytes = Buffer.byteLength(text);
  if (bytes > MAX_BYTES) add(0, `${bytes} bytes, the limit is ${MAX_BYTES}`);
  if (/\r/.test(text)) add(0, 'CR bytes (LF only)');
  const lines = text.split('\n');
  if (lines[0] !== LICENCE_LINE) add(1, `the first line is the licence comment ${LICENCE_LINE}`);
  if (lines[1] !== ROOT_TAG) add(2, `the root is exactly ${ROOT_TAG}`);
  // One element per line, so the brief's line greps see every shape whole; a <g transform> wrapping one <use> (the
  // brief's way to place a use) may share its line.
  lines.forEach((l, i) => { if ((l.match(/<(?!\/|g[\s>]|use[\s/>])/g) || []).length > 1) add(i + 1, 'one element per line'); });
  const gradients = GRADIENT_STYLES.has(style);
  const prefix = PREFIX(panel);

  const els = [];
  const ids = new Map();
  const stack = [];
  let roots = 0, closed = false, line = 1, firstChild = true;
  const body = text.slice(lines[0].length + 1);
  for (const m of body.matchAll(TAG)) {
    const tok = m[0];
    const at = line + 1;
    line += (tok.match(/\n/g) || []).length;
    if (tok.startsWith('<!--')) { add(at, 'a comment (only line 1 is one)'); continue; }
    if (tok === '<') { add(at, 'a stray <'); continue; }
    if (!tok.startsWith('<')) { if (tok.trim()) add(at, `text outside a tag: ${tok.trim().slice(0, 30)}`); continue; }
    const [, slash, name, attrText, self] = m;
    if (slash) {
      const top = stack.pop();
      if (!top || top.name !== name) add(at, `</${name}> does not close <${top ? top.name : 'nothing'}>`);
      if (!stack.length) closed = true;
      continue;
    }
    if (closed) add(at, `<${name}> after the root`);
    if (!(name in ATTRS) || (GRADIENTS.has(name) || name === 'stop') && !gradients) { add(at, `<${name}> is not allowed${GRADIENTS.has(name) || name === 'stop' ? ` in ${style} (no gradients)` : ''}`); }
    const parent = stack[stack.length - 1] || null;
    if (name === 'svg') { if (stack.length) add(at, 'a nested <svg>'); roots++; }
    else if (!stack.length) add(at, `<${name}> outside the root`);
    if (parent && parent.name === 'svg') {
      if (name === 'defs' && !firstChild) add(at, '<defs> comes first');
      firstChild = false;
    }
    if (parent && parent.name === 'clipPath' && !CLIP_CHILDREN.has(name)) add(at, `<${name}> inside <clipPath>`);
    if (name === 'stop' && !(parent && GRADIENTS.has(parent.name))) add(at, '<stop> outside a gradient');

    const attrs = {};
    const rest = attrText.replace(ATTR, (all, k, v) => {
      if (k in attrs) add(at, `${k} twice`);
      attrs[k] = v;
      return '';
    });
    if (rest.trim()) add(at, `unreadable attributes: ${rest.trim().slice(0, 30)}`);
    const el = { name, attrs, line: at, inDefs: stack.some((s) => s.name === 'defs'), parent };
    const allowed = ATTRS[name] || [];
    for (const [k, v] of Object.entries(attrs)) {
      if (name === 'svg') continue;
      if (!allowed.includes(k)) { add(at, `${k}= on <${name}>`); continue; }
      if (k === 'id') {
        if (!/^[a-z0-9-]+$/.test(v) || !v.startsWith(prefix)) add(at, `id ${v} is lowercase and starts with ${prefix}`);
        if (ids.has(v)) add(at, `id ${v} twice`);
        ids.set(v, el);
      } else if (k === 'fill' || k === 'stroke') {
        if (v !== 'none' && !COLOUR.test(v) && !(gradients && URL_REF.test(v))) add(at, `${k}="${v}" is not #rrggbb${gradients ? ', url(#gradient)' : ''} or none`);
      } else if (k === 'stop-color') {
        if (!COLOUR.test(v)) add(at, `stop-color="${v}" is not #rrggbb`);
      } else if (k === 'clip-path') {
        if (!URL_REF.test(v)) add(at, `clip-path="${v}" is not url(#id)`);
      } else if (k === 'href') {
        if (!/^#[a-z0-9-]+$/.test(v)) add(at, `href="${v}" is not #id`);
      } else if (k === 'd' || k === 'points') {
        if (k === 'd' && !/^[MmLlHhVvCcSsQqTtAaZz0-9.,\s+-]*$/.test(v)) add(at, 'd holds something that is not a path command or a number');
        if (k === 'points' && !/^[0-9.,\s-]*$/.test(v)) add(at, 'points holds something that is not a number');
        const b = badNumbers(v);
        if (b) add(at, `${k}: ${b}`);
      } else if (k === 'transform' || k === 'gradientTransform') {
        const b = checkTransform(v);
        if (b) add(at, `${k}="${v}": ${b}`);
      } else if (k === 'stroke-linejoin') {
        if (v !== 'round') add(at, 'stroke-linejoin is round');
      } else if (k === 'stroke-linecap') {
        if (v !== 'round') add(at, 'stroke-linecap is round');
      } else if (k === 'fill-rule') {
        if (v !== 'nonzero' && v !== 'evenodd') add(at, `fill-rule="${v}"`);
      } else if (k === 'paint-order') {
        if (!/^(normal|(stroke|fill|markers)( (stroke|fill|markers)){0,2})$/.test(v)) add(at, `paint-order="${v}"`);
      } else if (k === 'gradientUnits') {
        if (v !== 'userSpaceOnUse' && v !== 'objectBoundingBox') add(at, `gradientUnits="${v}"`);
      }
      if (NUMBER_ATTRS.has(k) && !NUM.test(v)) add(at, `${k}="${v}" is not a plain number with at most 2 decimals`);
      if (UNIT_ATTRS.has(k) && !(NUM.test(v) && Number(v) >= 0 && Number(v) <= 1)) add(at, `${k}="${v}" is not between 0 and 1`);
    }
    if (SHAPES.has(name) && !('fill' in attrs)) add(at, `<${name}> has no fill`);
    // The paint this element inherits: stroke and caps come down from its g ancestors.
    const inherited = (k) => { for (let i = stack.length - 1; i >= 0; i--) if (k in stack[i].attrs) return stack[i].attrs[k]; return null; };
    const stroke = 'stroke' in attrs ? attrs.stroke : inherited('stroke');
    const stroked = stroke !== null && stroke !== 'none';
    if ('stroke' in attrs && attrs.stroke !== 'none' && attrs['stroke-linejoin'] !== 'round') add(at, 'a stroke without stroke-linejoin="round"');
    if (SHAPES.has(name) && stroked && isOpen(el) && (attrs['stroke-linecap'] || inherited('stroke-linecap')) !== 'round') add(at, `an open stroked <${name}> without stroke-linecap="round"`);
    els.push(el);
    if (!self) stack.push(el);
  }
  if (stack.length) add(0, `<${stack[stack.length - 1].name}> is never closed`);
  if (roots !== 1) add(0, `${roots} <svg> roots, exactly 1 expected`);

  // References point into this file: use -> a shape or g in defs; clip-path -> a clipPath; url(#) paint -> a gradient.
  for (const el of els) {
    const target = (id) => ids.get(id) || null;
    if (el.name === 'use') {
      const t = target((el.attrs.href || '').slice(1));
      if (!t) add(el.line, `href ${el.attrs.href} points to nothing in this file`);
      else if (!t.inDefs || !(SHAPES.has(t.name) || t.name === 'g')) add(el.line, `href ${el.attrs.href} is not a shape or g in defs`);
    }
    if (el.attrs['clip-path']) {
      const m = URL_REF.exec(el.attrs['clip-path']);
      const t = m && target(m[1]);
      if (m && (!t || t.name !== 'clipPath')) add(el.line, `clip-path ${el.attrs['clip-path']} is not a clipPath in this file`);
    }
    for (const k of ['fill', 'stroke']) {
      const m = URL_REF.exec(el.attrs[k] || '');
      const t = m && target(m[1]);
      if (m && (!t || !GRADIENTS.has(t.name))) add(el.line, `${k} ${el.attrs[k]} is not a gradient in this file`);
    }
    if (GRADIENTS.has(el.name) && !el.inDefs) add(el.line, `<${el.name}> outside defs`);
    if (el.name === 'clipPath' && !el.inDefs) add(el.line, '<clipPath> outside defs');
  }
  // Gradient stops ascend from 0 to 1.
  for (const g of els.filter((e) => GRADIENTS.has(e.name))) {
    const offs = els.filter((e) => e.name === 'stop' && e.parent === g).map((e) => Number(e.attrs.offset));
    if (offs.length < 2 || offs.some((o, i) => Number.isNaN(o) || (i && o < offs[i - 1]))) add(g.line, `<${g.name}> needs 2 or more stops with ascending offsets`);
  }
  return problems;
}

function checkLicences(dir, style) {
  const problems = [];
  let rec;
  try { rec = JSON.parse(fs.readFileSync(path.join(dir, 'LICENCES.json'), 'utf8')); } catch (e) { return [`LICENCES.json: ${e.message}`]; }
  if (!rec || typeof rec !== 'object' || Array.isArray(rec)) return ['LICENCES.json: an object keyed by file name'];
  for (const p of PANELS) {
    const r = rec[`${p}.svg`];
    if (!r) { problems.push(`LICENCES.json: no record for ${p}.svg`); continue; }
    if (!LICENCES.has(r.licence)) problems.push(`LICENCES.json: ${p}.svg licence "${r.licence}" (everything drawn is own work)`);
    for (const k of ['author', 'what']) if (typeof r[k] !== 'string' || !r[k].trim()) problems.push(`LICENCES.json: ${p}.svg has no "${k}"`);
  }
  for (const k of Object.keys(rec)) if (!PANELS.includes(k.replace(/\.svg$/, '')) || !k.endsWith('.svg')) problems.push(`LICENCES.json: ${k} is not one of the 8 panels`);
  return problems.map((p) => `${style}/${p}`);
}

// Every style folder (or only `styles`, when given) -> { problems, styles, panels }.
function checkArt(styles) {
  const problems = [];
  let found = [];
  try { found = fs.readdirSync(ART, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort(); } catch (e) { return { problems: [`pages/card-art/art: ${e.message}`], styles: [], panels: 0 }; }
  const want = styles || found;
  for (const s of want) if (!found.includes(s)) problems.push(`${s}: no folder pages/card-art/art/${s}`);
  for (const s of found) if (!want.includes(s)) problems.push(`${s}: a folder that is not one of the styles`);
  let panels = 0;
  for (const style of want.filter((s) => found.includes(s))) {
    const dir = path.join(ART, style);
    const files = fs.readdirSync(dir).sort();
    const expected = PANELS.map((p) => `${p}.svg`).concat('LICENCES.json');
    for (const f of expected) if (!files.includes(f)) problems.push(`${style}/${f}: missing`);
    for (const f of files) if (!expected.includes(f)) problems.push(`${style}/${f}: not part of a style (8 panels and LICENCES.json)`);
    for (const p of PANELS) {
      const file = path.join(dir, `${p}.svg`);
      if (!fs.existsSync(file)) continue;
      panels++;
      for (const msg of checkSvg(fs.readFileSync(file, 'utf8'), p, style)) problems.push(`${style}/${p}.svg ${msg}`);
    }
    problems.push(...checkLicences(dir, style));
  }
  return { problems, styles: want, panels };
}

module.exports = { checkArt, checkSvg, PANELS, PREFIX, ART };

if (require.main === module) {
  const r = checkArt();
  for (const p of r.problems) console.error(p);
  if (r.problems.length) { console.error(`art contract: ${r.problems.length} problem(s)`); process.exitCode = 1; }
  else console.log(`art contract: ${r.panels} panels in ${r.styles.length} styles follow pages/card-art/brief.md section 1`);
}
