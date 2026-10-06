// Self-test of the token build (spec §7.6): node tools/tokens/test/run.js
//  1. json-strict and color.js units (the 21 health stops of spec §5 and its two computed bounds);
//  2. fixtures/good/<name>: 0 errors, 0 warnings, outputs built, two runs give the same bytes;
//     fixtures/bad/<rule>-<slug> and fixtures/warn/<rule>-<slug>: exactly the rule ids of expect.json;
//     every error rule (D01-D39 except D11, D12, D25, D26; P40-P62) and warning rule (D11, D12) has a folder;
//  3. build.js as a CLI: write, --check up to date, --check on stale and missing outputs, D39 report shape;
//  4. expect-values.json against the kinds fixture (paths it has) and against the real tokens/ (SKIPPED until they exist).
// Exit 1 on any failure. Node 20, no packages.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const api = require('../api.js');
const color = require('../../lib/color.js');
const json = require('../../lib/json-strict.js');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '..', '..', '..');
const FIX = path.join(HERE, 'fixtures');
const BUILD = path.join(HERE, '..', 'build.js');
const range = (p, a, b) => Array.from({ length: b - a + 1 }, (_, i) => `${p}${String(a + i).padStart(2, '0')}`);
const ERROR_RULES = range('D', 1, 39).filter((r) => !['D11', 'D12', 'D25', 'D26'].includes(r)).concat(range('P', 40, 62));
const WARN_RULES = ['D11', 'D12'];
const HEALTH = ['#ff5a44', '#fa6345', '#f56b45', '#f07346', '#ea7a46', '#e58147', '#df8747', '#d98d48', '#d39348', '#cc9849',
  '#c59e49', '#bea34a', '#b6a84a', '#aeac4b', '#a6b14b', '#9cb64c', '#92ba4c', '#87be4d', '#7bc34d', '#6cc74e', '#5bcb4e'];

let passed = 0;
let failed = 0;
let skipped = 0;
const check = (cond, name, detail) => {
  if (cond) passed++;
  else {
    failed++;
    console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`);
  }
  return cond;
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'toy-tokens-test-'));

// 1. units --------------------------------------------------------------------------------------------------------
console.log('-- units');
const parseErr = (text) => { try { json.parse(text); return null; } catch (e) { return e; } };
check(parseErr('{"a":1,"a":2}')?.rule === 'D02', 'json-strict rejects a duplicate key');
check(parseErr('{"a":1,"a":2}')?.pointer === '/a', 'json-strict gives the duplicate key\'s pointer');
check(parseErr('{"a":[1,2,]}')?.rule === 'D01', 'json-strict rejects a trailing comma');
check(parseErr('// c\n{}')?.rule === 'D01', 'json-strict rejects a comment');
check(parseErr('﻿{}')?.rule === 'D01', 'json-strict rejects a byte order mark');
check(parseErr('{"a":01}')?.rule === 'D01', 'json-strict rejects a leading zero');
{
  const r = json.parse('{\n  "b": {"10": 1, "a": 2}\n}');
  check(same(json.keysOf(r.value.b), ['10', 'a']), 'json-strict keeps source key order');
  check(same(r.position('/b/a'), { line: 2, col: 18 }), 'json-strict reports positions', JSON.stringify(r.position('/b/a')));
}
check(color.toHex(color.parseHex('#C98A10')) === '#c98a10', 'color hex round trip, lowercase');
{
  const full = color.parseHex('#5bcb4e');
  const empty = color.parseHex('#ff5a44');
  const stops = HEALTH.map((_, k) => color.toHex(color.mixOklab(full, empty, k / 20)));
  check(same(stops, HEALTH), 'the 21 OKLab health stops equal spec §5', stops.join(' '));
  const rgb = HEALTH.map(color.parseHex);
  let adj = 0;
  for (let k = 1; k <= 20; k++) adj = Math.max(adj, color.deltaEOk(rgb[k], rgb[k - 1]));
  check(adj <= 0.0186, 'adjacent stops differ by at most ΔE_ok 0.0185', adj.toFixed(5));
  let worst = 0;
  for (let i = 0; i <= 4000; i++) {
    const hp = i / 4000;
    const s = Math.min(20, Math.max(0, Math.floor(hp * 20 + 0.5)));
    worst = Math.max(worst, color.deltaEOk(rgb[s], color.mixOklab(full, empty, hp).map(color.clamp01)));
  }
  check(worst <= 0.0097, 'the nearest stop is within ΔE_ok 0.0096 of the continuous mix', worst.toFixed(5));
}

// 2. fixtures -----------------------------------------------------------------------------------------------------
console.log('-- fixtures');
const covered = new Set();
const listDirs = (kind) => {
  const d = path.join(FIX, kind);
  return fs.existsSync(d) ? fs.readdirSync(d).filter((n) => fs.statSync(path.join(d, n)).isDirectory()).sort() : [];
};
const ids = (list) => [...new Set(list.map((p) => p.rule))].sort();
for (const name of listDirs('good')) {
  const dir = path.join(FIX, 'good', name);
  const expect = JSON.parse(fs.readFileSync(path.join(dir, 'expect.json'), 'utf8'));
  const a = api.analyzeAll(dir);
  const shown = a.problems.list.slice(0, 5).map(api.formatProblem).join(' | ');
  check(a.problems.errors.length === 0 && a.problems.warnings.length === 0, `good/${name}: 0 errors and 0 warnings`, shown);
  if (!a.sys) continue;
  if (expect.permutations) check(a.sys.permutations.length === expect.permutations, `good/${name}: ${expect.permutations} permutations resolve`, String(a.sys.permutations.length));
  const b = api.analyzeAll(dir);
  check(b.sys && same(Object.values(a.sys.outputs), Object.values(b.sys.outputs)), `good/${name}: two runs give the same bytes`);
  for (const [rel, text] of Object.entries(a.sys.outputs)) {
    check(!text.includes('\r') && text.endsWith('\n') && !text.endsWith('\n\n'), `good/${name}: ${rel} has LF endings and one trailing newline`);
  }
  check(same(Object.keys(a.sys.pack.tokens), Object.keys(a.sys.pack.tokens).slice().sort()), `good/${name}: pack keys are sorted`);
  check(a.sys.tokens === a.sys.permutations[0].tokens && a.sys.sources.size > 0 && Array.isArray(a.sys.variants), `good/${name}: api.load shape`);
  check(a.sys.cssVar('button.primary.normal.bg-color') === '--toy-button-primary-normal-bg-color', `good/${name}: cssVar`);
  if (expect.spotValues) {
    const checks = JSON.parse(fs.readFileSync(path.join(HERE, 'expect-values.json'), 'utf8')).checks;
    const n = spot(a.sys, checks, true, `good/${name}`);
    check(n >= 30, `good/${name}: at least 30 spot values apply`, String(n));
    check(a.sys.healthStops.length === 21 && same(a.sys.healthStops.map((s) => s.hex), HEALTH), `good/${name}: sys.healthStops`);
  }
}
for (const kind of ['bad', 'warn']) {
  for (const name of listDirs(kind)) {
    const dir = path.join(FIX, kind, name);
    const rule = name.slice(0, 3);
    let expect;
    try { expect = JSON.parse(fs.readFileSync(path.join(dir, 'expect.json'), 'utf8')); } catch (e) {
      check(false, `${kind}/${name}: expect.json`, e.message);
      continue;
    }
    const want = { errors: (expect.errors || []).slice().sort(), warnings: (expect.warnings || []).slice().sort() };
    const a = api.analyzeAll(dir);
    const got = { errors: ids(a.problems.errors), warnings: ids(a.problems.warnings) };
    const shown = a.problems.list.slice(0, 4).map(api.formatProblem).join(' | ');
    check(same(got, want), `${kind}/${name}: reports exactly ${JSON.stringify(want)}`, `got ${JSON.stringify(got)} ${shown}`);
    check(a.problems.list.every((p) => p.rule && p.message && p.severity && (p.file === null || typeof p.file === 'string') && typeof p.pointer === 'string'),
      `${kind}/${name}: every problem has a file, a pointer, a rule and a message`);
    if (expect.cli) {
      covered.add(expect.cli);
      const r = spawnSync(process.execPath, [BUILD, '--check', '--root', dir, '--out', path.join(tmp, 'cli-bad')], { encoding: 'utf8' });
      const lines = (r.stderr || '').split('\n').filter((l) => /^error \[/.test(l));
      check(r.status === 1, `${kind}/${name}: build.js exits 1 on an error`, `status ${r.status}`);
      check(lines.length > 0 && lines.every((l) => /^error \[[A-Z]\d\d\] tokens\/\S+:\d+:\d+ #\/\S* \(\S+\): ./.test(l)),
        `${kind}/${name}: each error line names the file, line, JSON Pointer, token path and rule`, lines[0]);
    }
    if (got.errors.includes(rule) || got.warnings.includes(rule)) covered.add(rule);
    if (kind === 'warn') check(a.sys !== null, `${kind}/${name}: warnings alone still build`);
  }
}
for (const r of ERROR_RULES) check(covered.has(r), `a bad/ fixture covers ${r}`);
for (const r of WARN_RULES) check(covered.has(r), `a warn/ fixture covers ${r}`);
{
  let threw = null;
  try { api.load({ root: path.join(FIX, 'bad', 'P46-margin-sums') }); } catch (e) { threw = e; }
  check(threw && Array.isArray(threw.problems) && threw.problems.some((p) => p.rule === 'P46'), 'api.load throws with .problems');
}

// Overlays (api.js withOverlay): a changed value, a new token, a modifier-owned path, a deliberately changed rule.
console.log('-- overlays');
{
  const dir = path.join(FIX, 'good', 'modes');
  const ov = (name, doc) => { const f = path.join(tmp, `${name}.tokens.json`); fs.writeFileSync(f, JSON.stringify(doc)); return f; };
  const NS = 'io.github.xperiaroco2.prime-game';
  const hex = (sys, p) => sys.tokens.get(p) && sys.tokens.get(p).hex;
  const base = api.load({ root: dir });
  const ink = { colorSpace: 'srgb', components: [0.1216, 0.0902, 0.1529], hex: '#1f1727' };
  const a = api.load({ root: dir, overlay: ov('value', { palette: { $type: 'color', ink: { $value: ink } } }) });
  check(hex(a, 'palette.ink') === '#1f1727' && hex(base, 'palette.ink') === '#2a1f33', 'an overlay replaces a value; the base set is untouched', hex(a, 'palette.ink'));
  check(a.root === dir && /value\.tokens\.json$/.test(a.overlay), 'an overlaid sys names its root and overlay');
  const b = api.load({ root: dir, overlay: ov('new', { palette: { 'ink-half': { $type: 'color', $value: Object.assign({}, ink, { alpha: 0.5 }) } } }) });
  check(b.tokens.has('palette.ink-half') && !base.tokens.has('palette.ink-half'), 'an overlay adds a token to the file of its group');
  let threw = null;
  try { api.load({ root: dir, overlay: ov('owned', { font: { size: { $type: 'dimension', body: { $value: { value: 30, unit: 'px' } } } } }) }); } catch (e) { threw = e; }
  check(threw && /owned by the modifier textSize/.test(threw.message), 'a modifier-owned path needs a named context', threw && threw.message);
  const c = api.load({ root: dir, overlay: ov('large', { $extensions: { [NS]: { overlay: { contexts: { textSize: 'large' } } } },
    font: { size: { $type: 'dimension', body: { $value: { value: 30, unit: 'px' } } } } }) });
  const large = c.pack.modes.textSize.large['font.size.body'];
  check(large && large.px === 30 && c.tokens.get('font.size.body').px === base.tokens.get('font.size.body').px, 'an overlay changes only the named context', JSON.stringify(large));
  const held = ov('held', { button: { primary: { press: { $type: 'dimension', held: { $value: { value: 6, unit: 'px' } } } } } });
  threw = null;
  try { api.load({ root: dir, overlay: held }); } catch (e) { threw = e; }
  check(threw && threw.problems.some((p) => p.rule === 'P49'), 'an overlay goes through the validator (P49)', threw && threw.message);
  const d = api.load({ root: dir, overlay: held, allow: ['P49'] });
  check(d.warnings.some((p) => p.rule === 'P49' && p.allowed), 'allow reports a rule as a warning');
  threw = null;
  try { api.load({ root: dir, overlay: ov('bad', { nowhere: { x: { $type: 'number', $value: 1 } } }) }); } catch (e) { threw = e; }
  check(threw && threw.problems[0].rule === 'O01', 'a token with no group in the base set is an overlay error', threw && threw.message);
}

// The pack's assets, textures and deprecation marks (prime-game-ui#30), on the fixtures that carry them.
console.log('-- pack members');
{
  const crypto = require('crypto');
  const sha = (t) => crypto.createHash('sha256').update(Buffer.from(t, 'utf8')).digest('hex');
  const c = api.load({ root: path.join(FIX, 'good', 'controls') });
  const by = new Map(c.pack.assets.map((a) => [a.path, a]));
  const knob = by.get('icons/knob.svg');
  const mark = by.get('icons/mark.svg');
  check(c.pack.assets.length === 2 && knob && mark, 'assets list every icon of pages/components/icons', JSON.stringify(c.pack.assets.map((a) => a.path)));
  check(knob && knob.tint === 'none' && knob.svg_scale === 1 && knob.drawn_px === 28 && same(knob.size, [28, 28]),
    'an icon in its own colours is not tinted; an HSlider draws its knob at its own size', JSON.stringify(knob));
  check(mark && mark.tint === 'multiply' && mark.drawn_px === 40 && mark.svg_scale === 1.67 && !('tint_color' in mark),
    'a currentColor icon is multiplied; its drawn size is the largest a screen gives it (TextureRect 48 x 40 keeps aspect)', JSON.stringify(mark));
  const out = c.outputs['dist/pack/icons/mark.svg'];
  check(out && /fill="#ffffff"/.test(out) && !/"currentColor"/.test(out) && mark && mark.sha256 === sha(out), 'an asset\'s sha256 is the bytes of its file in the pack');
  check(knob && knob.licence === 'own work' && knob.licence_file === 'icons/LICENCES.json' && knob.source === 'pages/components/icons/knob.svg' && knob.kind === 'icon',
    'an asset names its licence, licence file and source');
  check(same(c.pack.variations.ToySlider.textures, { grabber: 'icons/knob.svg', 'grabber-highlight': 'icons/knob.svg', 'grabber-disabled': 'icons/mark.svg' }),
    'a variation lists its textures as pack paths', JSON.stringify(c.pack.variations.ToySlider.textures));
  check(same(c.pack.variations.ToyColumnOld.deprecated, { replacement: 'ToyColumnEight', note: 'Use ToyColumnEight.' }),
    'a deprecated variation is marked with its replacement', JSON.stringify(c.pack.variations.ToyColumnOld.deprecated));
  check(!('textures' in c.pack.variations.ToyColumnEight) && !('deprecated' in c.pack.variations.ToyColumnEight), 'the optional members are absent where they do not apply');
}

// 3. CLI ----------------------------------------------------------------------------------------------------------
console.log('-- build.js');
{
  const dir = path.join(FIX, 'good', 'modes');
  const out = path.join(tmp, 'cli-good');
  const run = (...args) => spawnSync(process.execPath, [BUILD, '--root', dir, '--out', out, ...args], { encoding: 'utf8' });
  let r = run();
  check(r.status === 0 && /permutations: 4/.test(r.stdout), 'build.js writes a fixture root', r.stderr || r.stdout);
  r = run('--check');
  check(r.status === 0 && /up to date/.test(r.stdout), 'build.js --check passes right after a build', r.stderr);
  const css = path.join(out, 'dist', 'css', 'toy-tokens.css');
  fs.appendFileSync(css, '/* edited */\n');
  r = run('--check');
  check(r.status === 1 && /stale: dist\/css\/toy-tokens\.css/.test(r.stderr), 'build.js --check names a stale file', r.stderr);
  fs.rmSync(path.join(out, 'dist', 'pack', 'toy.pack.json'));
  r = run('--check');
  check(r.status === 1 && /missing: dist\/pack\/toy\.pack\.json/.test(r.stderr), 'build.js --check names a missing file', r.stderr);
  r = spawnSync(process.execPath, [BUILD, '--nope'], { encoding: 'utf8' });
  check(r.status === 2, 'build.js rejects an unknown argument');
}

// 4. spot values on the real tokens ------------------------------------------------------------------------------
console.log('-- spot values');
function spot(sys, checks, lenient, label) {
  let n = 0;
  for (const c of checks) {
    const name = `${label}: ${c.mode ? `${c.mode} ` : ''}${c.path}`;
    let map = sys.pack.tokens;
    if (c.mode) {
      const [m, ctx] = c.mode.split('/');
      map = sys.pack.modes[m] && sys.pack.modes[m][ctx];
      if (!map) { if (!lenient) check(false, name, 'no such mode'); continue; }
    }
    const v = map[c.path];
    if (c.absent) { check(v === undefined, name, 'must be absent'); n++; continue; }
    if (v === undefined) { if (!lenient) check(false, name, 'missing from the pack'); continue; }
    for (const [k, want] of Object.entries(c.expect)) {
      const got = k.split('.').reduce((o, s) => (o == null ? o : o[s]), v);
      check(same(got, want), `${name} ${k}`, `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
    }
    n++;
  }
  return n;
}
if (fs.existsSync(path.join(ROOT, 'tokens', 'prime.resolver.json'))) {
  const checks = JSON.parse(fs.readFileSync(path.join(HERE, 'expect-values.json'), 'utf8')).checks;
  let sys = null;
  try { sys = api.load({ root: ROOT }); } catch (e) {
    check(false, 'the real tokens/ build', (e.problems || []).filter((p) => p.severity === 'error').slice(0, 10).map(api.formatProblem).join('\n  ') || e.message);
  }
  if (sys) {
    const n = spot(sys, checks, false, 'tokens/');
    check(n === checks.length, 'every spot value of spec §7.6 was checked', `${n} of ${checks.length}`);
    // the pack's own members: what the game's generator and ui-sync read beside the tokens (prime-game-ui#30)
    const V = sys.pack.variations;
    check(same(V.ToySlider.textures, { grabber: 'icons/slider-knob.svg', 'grabber-highlight': 'icons/slider-knob.svg', 'grabber-disabled': 'icons/slider-knob-disabled.svg' }),
      'tokens/: ToySlider names its knob textures', JSON.stringify(V.ToySlider.textures));
    check(same(V.ToyDropdown.textures, { arrow: 'icons/chevron-down.svg' }), 'tokens/: ToyDropdown names its arrow', JSON.stringify(V.ToyDropdown.textures));
    check(V.ToyChipNew.deprecated && V.ToyChipNew.deprecated.replacement === 'ToyChipAlert' && V.ToyChipNewText.deprecated
      && V.ToyChipNewText.deprecated.replacement === 'ToyChipAlertText', 'tokens/: ToyChipNew and ToyChipNewText are marked deprecated with their replacements');
    const assets = new Map(sys.pack.assets.map((a) => [a.path, a]));
    const files = Object.keys(sys.outputs).filter((k) => /^dist\/pack\/icons\/.+\.svg$/.test(k));
    check(files.length > 0 && files.every((k) => assets.has(k.slice('dist/pack/'.length))) && assets.size === files.length,
      'tokens/: every icon in dist/pack/icons has one assets entry', `${assets.size} assets, ${files.length} icons`);
    const knob = assets.get('icons/slider-knob.svg');
    const lab = assets.get('icons/room/lab.svg');
    check(knob && knob.tint === 'none' && lab && lab.tint === 'multiply' && lab.tint_color === '#2a1f33' && lab.svg_scale === 2.5,
      'tokens/: the knobs keep their colours; a room pictogram is white, drawn in ink, imported at its largest size', JSON.stringify(lab));
  }
} else {
  skipped++;
  console.log('SKIPPED spot values: tokens/prime.resolver.json does not exist yet');
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`${failed ? 'FAILED' : 'OK'}: ${passed} passed, ${failed} failed, ${skipped} skipped`);
process.exitCode = failed ? 1 : 0;
