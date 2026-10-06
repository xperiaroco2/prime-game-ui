// The token system as one object (spec §7.4): the contract the contrast gates, the lint and the showcase code against.
//   const sys = require('./tools/tokens/api.js').load({ root: '<repo root>' });
// load() throws an Error whose .problems = [{ file, pointer, path, rule, severity, message, line, col }] when any
// error is found; warnings do not throw and are in sys.warnings.
// Node 20, no packages.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { parse, JsonStrictError } = require('../lib/json-strict.js');
const R = require('./resolve.js');
const { analyze } = require('./validate.js');
const { packTokens, computeModes, buildPack, serializePack } = require('./emit-pack.js');
const { renderCss } = require('./emit-css.js');

const OUTPUTS = { css: 'dist/css/toy-tokens.css', pack: 'dist/pack/toy.pack.json' };
// The icons the game imports beside the pack: pages/components/icons/*.svg with currentColor written as white, and their
// LICENCES.json. The pages draw an icon in its context's colour (CSS currentColor); Godot's SVG importer (ThorVG) has no
// such context, and the game tints an icon by multiplying it (TextureRect self_modulate, a Button's icon_*_color,
// OptionButton's modulate_arrow), so the game's copy is white and the tint gives its colour. Icons drawn in their own hex
// (the slider knobs) are copied as they are. A root without pages/components/icons (a test fixture, an overlay) has none.
const ICONS_SRC = 'pages/components/icons';
const ICONS_OUT = 'dist/pack/icons';
function iconOutputs(root) {
  let files = [];
  try { files = fs.readdirSync(path.join(root, ...ICONS_SRC.split('/'))).filter((n) => n.endsWith('.svg') || n === 'LICENCES.json').sort(); } catch { return {}; }
  const out = {};
  for (const name of files) {
    const text = fs.readFileSync(path.join(root, ...ICONS_SRC.split('/'), name), 'utf8').replace(/\r\n/g, '\n').replace(/\s+$/, '') + '\n';
    if (!name.endsWith('.svg') || !text.includes('currentColor')) { out[`${ICONS_OUT}/${name}`] = text; continue; }
    const note = `<!-- generated from ${ICONS_SRC}/${name} by tools/tokens/build.js: currentColor written as #ffffff, for Godot's tint -->\n`;
    out[`${ICONS_OUT}/${name}`] = note + text.replace(/currentColor/g, '#ffffff');
  }
  return out;
}
const RELEASE_FILE = 'tokens/release.json';

// tokens/release.json = {"version": "X.Y.Z"} (spec §1, §9.2). Its problems use the build rule id B01.
function readRelease(root, P) {
  let text;
  try {
    text = fs.readFileSync(path.join(root, 'tokens', 'release.json'), 'utf8');
  } catch {
    P.error('B01', RELEASE_FILE, '', null, 'tokens/release.json is missing; it holds {"version": "X.Y.Z"}');
    return null;
  }
  try {
    const { value } = parse(text);
    const keys = value && typeof value === 'object' && !Array.isArray(value) ? Object.keys(value) : [];
    if (keys.length !== 1 || keys[0] !== 'version' || typeof value.version !== 'string' || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value.version)) {
      P.error('B01', RELEASE_FILE, '', null, 'release.json is exactly {"version": "X.Y.Z"} (semver, no pre-release)');
      return null;
    }
    return value.version;
  } catch (e) {
    if (e instanceof JsonStrictError) {
      P.error(e.rule, RELEASE_FILE, e.pointer, null, e.reason, { line: e.line, col: e.col });
      return null;
    }
    throw e;
  }
}

// analyzeAll(root, opts) -> { problems, sys | null }: never throws on token problems.
// opts.overlay: a DTCG file (absolute, or relative to root) applied on a temporary copy of tokens/ (see withOverlay).
// opts.allow: rule ids reported as warnings instead of errors (an overlay that deliberately changes a rule's look).
function analyzeAll(root, opts) {
  if (opts && opts.overlay) {
    return withOverlay(root, opts.overlay, (tmp) => {
      const r = analyzeAll(tmp, Object.assign({}, opts, { overlay: null }));
      if (r.sys) { r.sys.root = root; r.sys.overlay = rel(root, opts.overlay); }
      return r;
    });
  }
  const a = analyze(root);
  const P = a.problems;
  const allow = (opts && opts.allow) || [];
  for (const p of P.list) if (p.severity === 'error' && allow.includes(p.rule)) { p.severity = 'warning'; p.allowed = true; }
  const version = readRelease(root, P);
  if (P.errors.length || !a.model) return { problems: P, sys: null };
  for (const r of a.results) r.packTokens = packTokens(r);
  const modes = computeModes(a.model, a.results, P);
  if (P.errors.length) return { problems: P, sys: null };
  const pack = buildPack(a.model, a.results, modes, version);
  const packText = serializePack(pack);
  const css = renderCss(a.model, a.results);
  const r0 = a.results[0];
  const sources = new Map();
  for (const [p, n] of r0.res.tokens) {
    sources.set(p, { file: n.file, pointer: n.pointer, type: r0.res.typeOf(p), alias: n.alias || null, proposal: !!n.proposal,
      description: n.description || null });
  }
  const health = r0.variants.find((v) => v.prefix === 'bar.health' && v.stops.length) || r0.variants.find((v) => v.stops.length);
  const tiers = { primitive: 0, semantic: 0, component: 0 };
  for (const n of r0.res.tokens.values()) tiers[n.tier] = (tiers[n.tier] || 0) + 1;
  const sys = {
    root,
    version,
    permutations: a.results.map((r) => ({ inputs: Object.assign({}, r.perm.inputs), tokens: r.packTokens })),
    tokens: r0.packTokens,
    sources,
    variants: r0.variants,
    healthStops: health ? health.stops.map((s) => ({ step: s.step, fraction: s.fraction, hex: s.hex, rgba: s.rgba })) : [],
    cssVar: R.cssVar,
    pack,
    css,
    outputs: Object.assign({ [OUTPUTS.css]: css, [OUTPUTS.pack]: packText }, iconOutputs(root)),
    modifiers: a.model.modifiers.map((m) => ({ name: m.name, contexts: m.contexts.slice(), default: m.default })),
    warnings: P.warnings,
    counts: { tiers, authored: sources.size, packTokens: r0.packTokens.size, variations: Object.keys(pack.variations).length,
      proposals: pack.proposals.length, derived: pack.derived.length, permutations: a.results.length },
  };
  return { problems: P, sys };
}

// ---------------------------------------------------------------------------------------------------------------
// Overlays: a DTCG file holding only the tokens one look option changes (pages/choices/overlays/*.tokens.json).
// Each overlay token replaces the $value (and $type, $description, $extensions when it gives them) of the token at the
// same path; a path the base set lacks is added to the base-set file that holds its deepest existing group. A path a
// modifier owns is changed only in the contexts named by the overlay's root
//   "$extensions": { "io.github.xperiaroco2.prime-game": { "overlay": { "contexts": { "textSize": "large" } } } }
// The patched files are written to a temporary copy of tokens/, which then goes through the real resolver, validator
// and emitters, so an option is valid exactly when its winner, applied to tokens/, would be.

const rel = (root, p) => path.relative(root, path.resolve(root, p)).split(path.sep).join('/');
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isToken = (v) => isObj(v) && '$value' in v;
const clone = (v) => JSON.parse(JSON.stringify(v));

function overlayError(file, message) {
  const e = new Error(`overlay ${file}: ${message}`);
  e.problems = [{ file, pointer: '', path: null, rule: 'O01', severity: 'error', message, line: null, col: null }];
  return e;
}

function withOverlay(root, overlay, fn) {
  const file = rel(root, overlay);
  let ov;
  try {
    ov = parse(fs.readFileSync(path.resolve(root, overlay), 'utf8')).value;
  } catch (e) {
    throw overlayError(file, e instanceof JsonStrictError ? `[${e.rule}] ${e.reason} at #${e.pointer} (line ${e.line})` : e.message);
  }
  if (!isObj(ov)) throw overlayError(file, 'an overlay is a JSON object');
  const ext = isObj(ov.$extensions) && isObj(ov.$extensions[R.NS]) && isObj(ov.$extensions[R.NS].overlay) ? ov.$extensions[R.NS].overlay : {};
  const contexts = isObj(ext.contexts) ? ext.contexts : {};
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'toy-overlay-'));
  try {
    fs.cpSync(path.join(root, 'tokens'), path.join(tmp, 'tokens'), { recursive: true });
    const resolver = JSON.parse(fs.readFileSync(path.join(tmp, R.RESOLVER_FILE), 'utf8'));
    const files = [];
    const add = (ref, modifier, context) => {
      const r = `tokens/${ref.$ref}`;
      files.push({ rel: r, doc: JSON.parse(fs.readFileSync(path.join(tmp, r), 'utf8')), modifier, context, changed: false });
    };
    for (const s of Object.values(resolver.sets || {})) (s.sources || []).forEach((ref) => add(ref, null, null));
    for (const [m, def] of Object.entries(resolver.modifiers || {})) {
      for (const [c, list] of Object.entries(def.contexts || {})) list.forEach((ref) => add(ref, m, c));
    }
    for (const m of Object.keys(contexts)) {
      if (!files.some((f) => f.modifier === m && f.context === contexts[m])) throw overlayError(file, `no context ${JSON.stringify(contexts[m])} of a modifier ${JSON.stringify(m)}`);
    }
    const at = (doc, segs) => segs.reduce((n, s) => (isObj(n) && s in n ? n[s] : undefined), doc);
    const put = (segs, chain, tok, type) => {
      const name = segs.join('.');
      const holders = files.filter((f) => isToken(at(f.doc, segs)));
      if (holders.length) {
        const targets = holders.filter((f) => !f.modifier || contexts[f.modifier] === f.context);
        if (!targets.length) throw overlayError(file, `${name} is owned by the modifier ${holders[0].modifier}: name its context in $extensions.${R.NS}.overlay.contexts`);
        for (const f of targets) {
          const t = at(f.doc, segs);
          for (const k of ['$value', '$type', '$description', '$extensions']) if (k in tok) t[k] = clone(tok[k]);
          f.changed = true;
        }
        return;
      }
      for (let n = segs.length - 1; n > 0; n--) {
        const g = segs.slice(0, n);
        const owners = files.filter((f) => !f.modifier && isObj(at(f.doc, g)) && !isToken(at(f.doc, g)));
        if (!owners.length) continue;
        if (owners.length > 1) throw overlayError(file, `the new token ${name}: its group ${g.join('.')} is in ${owners.map((f) => f.rel).join(' and ')}`);
        const f = owners[0];
        let typed = false;
        for (let i = 1; i <= n; i++) if (at(f.doc, segs.slice(0, i)).$type) typed = true;
        let node = at(f.doc, g);
        for (let i = n; i < segs.length - 1; i++) {
          node = node[segs[i]] = {};
          for (const k of ['$type', '$description', '$extensions']) if (k in chain[i + 1]) node[k] = clone(chain[i + 1][k]);
          if (node.$type) typed = true;
        }
        const copy = clone(tok);
        if (!copy.$type && type && !typed) copy.$type = type;
        node[segs[segs.length - 1]] = copy;
        f.changed = true;
        return;
      }
      throw overlayError(file, `the new token ${name} has no group in the base set`);
    };
    const walk = (node, segs, chain, type) => {
      for (const k of Object.keys(node)) {
        if (k.startsWith('$')) continue;
        const child = node[k];
        if (!isObj(child)) throw overlayError(file, `${segs.concat(k).join('.')} is neither a token nor a group`);
        const t = child.$type || type;
        if (isToken(child)) put(segs.concat(k), chain.concat([child]), child, t);
        else walk(child, segs.concat(k), chain.concat([child]), t);
      }
    };
    walk(ov, [], [ov], null);
    for (const f of files) if (f.changed) fs.writeFileSync(path.join(tmp, f.rel), JSON.stringify(f.doc, null, 2) + '\n');
    return fn(tmp);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function load(opts) {
  const root = path.resolve((opts && opts.root) || path.join(__dirname, '..', '..'));
  const { problems, sys } = analyzeAll(root, opts);
  if (!sys) {
    const errs = problems.errors;
    const e = new Error(`tokens: ${errs.length} error(s)\n${R.sortProblems(errs).slice(0, 20).map(R.formatProblem).join('\n')}`);
    e.problems = problems.list;
    throw e;
  }
  return sys;
}

module.exports = { load, analyzeAll, OUTPUTS, formatProblem: R.formatProblem, sortProblems: R.sortProblems };
