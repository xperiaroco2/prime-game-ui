// The token system as one object (spec §7.4): the contract the contrast gates, the lint and the showcase code against.
//   const sys = require('./tools/tokens/api.js').load({ root: '<repo root>' });
// load() throws an Error whose .problems = [{ file, pointer, path, rule, severity, message, line, col }] when any
// error is found; warnings do not throw and are in sys.warnings.
// Node 20, no packages.
'use strict';

const fs = require('fs');
const path = require('path');
const { parse, JsonStrictError } = require('../lib/json-strict.js');
const R = require('./resolve.js');
const { analyze } = require('./validate.js');
const { packTokens, computeModes, buildPack, serializePack } = require('./emit-pack.js');
const { renderCss } = require('./emit-css.js');

const OUTPUTS = { css: 'dist/css/toy-tokens.css', pack: 'dist/pack/toy.pack.json' };
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

// analyzeAll(root) -> { problems, sys | null }: never throws on token problems.
function analyzeAll(root) {
  const a = analyze(root);
  const P = a.problems;
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
    outputs: { [OUTPUTS.css]: css, [OUTPUTS.pack]: packText },
    modifiers: a.model.modifiers.map((m) => ({ name: m.name, contexts: m.contexts.slice(), default: m.default })),
    warnings: P.warnings,
    counts: { tiers, authored: sources.size, packTokens: r0.packTokens.size, variations: Object.keys(pack.variations).length,
      proposals: pack.proposals.length, derived: pack.derived.length, permutations: a.results.length },
  };
  return { problems: P, sys };
}

function load(opts) {
  const root = path.resolve((opts && opts.root) || path.join(__dirname, '..', '..'));
  const { problems, sys } = analyzeAll(root);
  if (!sys) {
    const errs = problems.errors;
    const e = new Error(`tokens: ${errs.length} error(s)\n${R.sortProblems(errs).slice(0, 20).map(R.formatProblem).join('\n')}`);
    e.problems = problems.list;
    throw e;
  }
  return sys;
}

module.exports = { load, analyzeAll, OUTPUTS, formatProblem: R.formatProblem, sortProblems: R.sortProblems };
