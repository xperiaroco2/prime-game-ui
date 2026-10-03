// CVD simulation + CIEDE2000 / OKLab distances for prime-game palettes.
// Matrices: Machado, Oliveira, Fernandes 2009, "A Physiologically-based Model for Simulation of
// Color Vision Deficiency", IEEE TVCG 15(6). Table at
// https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
// Applied in LINEAR RGB (sRGB decoded), result clamped to [0,1] and re-encoded.
// Run: node cvd.js
'use strict';

const M = {
  protan:  [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan:  [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritan:  [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
  protan06: [[0.385450, 0.769005, -0.154455], [0.100526, 0.829802, 0.069673], [-0.007442, -0.022190, 1.029632]],
  deutan06: [[0.498864, 0.674741, -0.173604], [0.205199, 0.754872, 0.039929], [-0.011131, 0.030969, 0.980162]],
};
const VISIONS = ['normal', 'protan', 'deutan', 'tritan', 'protan06', 'deutan06', 'grey'];
const CVD_FULL = ['protan', 'deutan', 'tritan'];

const toLin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const toSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
const clamp = (x) => Math.min(1, Math.max(0, x));
const hex = (rgb) => '#' + rgb.map((c) => Math.round(clamp(c) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const fromHex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

function simulateLin(lin, vision) {
  if (vision === 'normal') return lin;
  if (vision === 'grey') { const y = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]; return [y, y, y]; }
  const m = M[vision];
  return m.map((row) => clamp(row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2]));
}

function linToLab(lin) {
  const [r, g, b] = lin;
  const X = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  const Y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
  const Z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
  const [Xn, Yn, Zn] = [0.95047, 1.0, 1.08883];
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const fx = f(X / Xn), fy = f(Y / Yn), fz = f(Z / Zn);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function linToOklab(lin) {
  const [r, g, b] = lin;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
}

// CIEDE2000 (Sharma, Wu, Dalal 2005), kL = kC = kH = 1.
function de2000(a, b) {
  const [L1, a1, b1] = a, [L2, a2, b2] = b;
  const rad = Math.PI / 180;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cm = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cm, 7) / (Math.pow(Cm, 7) + Math.pow(25, 7))));
  const a1p = (1 + G) * a1, a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const hp = (x, y) => { if (x === 0 && y === 0) return 0; let h = Math.atan2(y, x) / rad; return h < 0 ? h + 360 : h; };
  const h1p = hp(a1p, b1), h2p = hp(a2p, b2);
  const dLp = L2 - L1, dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) { dhp = h2p - h1p; if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360; }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * rad);
  const Lpm = (L1 + L2) / 2, Cpm = (C1p + C2p) / 2;
  let hpm = h1p + h2p;
  if (C1p * C2p !== 0) { if (Math.abs(h1p - h2p) > 180) hpm = h1p + h2p < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2; else hpm = (h1p + h2p) / 2; }
  const T = 1 - 0.17 * Math.cos((hpm - 30) * rad) + 0.24 * Math.cos(2 * hpm * rad) + 0.32 * Math.cos((3 * hpm + 6) * rad) - 0.20 * Math.cos((4 * hpm - 63) * rad);
  const dTheta = 30 * Math.exp(-Math.pow((hpm - 275) / 25, 2));
  const Rc = 2 * Math.sqrt(Math.pow(Cpm, 7) / (Math.pow(Cpm, 7) + Math.pow(25, 7)));
  const Sl = 1 + (0.015 * Math.pow(Lpm - 50, 2)) / Math.sqrt(20 + Math.pow(Lpm - 50, 2));
  const Sc = 1 + 0.045 * Cpm, Sh = 1 + 0.015 * Cpm * T;
  const Rt = -Math.sin(2 * dTheta * rad) * Rc;
  return Math.sqrt(Math.pow(dLp / Sl, 2) + Math.pow(dCp / Sc, 2) + Math.pow(dHp / Sh, 2) + Rt * (dCp / Sc) * (dHp / Sh));
}

// Sharma 2005 test pair 1: (50, 2.6772, -79.7751) vs (50, 0, -82.7485) => 2.0425
const t = de2000([50, 2.6772, -79.7751], [50, 0, -82.7485]);
if (Math.abs(t - 2.0425) > 1e-3) throw new Error('CIEDE2000 self-test failed: ' + t);
const t2 = de2000([50, -1.3802, -84.2814], [50, 0, -82.7485]); // expected 1.0000
if (Math.abs(t2 - 1.0) > 1e-3) throw new Error('CIEDE2000 self-test 2 failed: ' + t2);

const CONFUSE = 10, WEAK = 20; // heuristic thresholds in dE2000 for separate objects, not side-by-side patches

function analyse(name, entries, opts = {}) {
  const lin = entries.map(([, rgb]) => rgb.map(toLin));
  console.log(`\n=== ${name} (${entries.length} colours) ===`);
  console.log('colour       normal   protan   deutan   tritan   (simulated sRGB hex)');
  entries.forEach(([n, rgb], i) => {
    console.log(n.padEnd(12), hex(rgb), ...['protan', 'deutan', 'tritan'].map((v) => hex(simulateLin(lin[i], v).map(toSrgb))));
  });
  const summary = [];
  for (const v of VISIONS) {
    const labs = lin.map((c) => linToLab(simulateLin(c, v)));
    const oks = lin.map((c) => linToOklab(simulateLin(c, v)));
    const pairs = [];
    for (let i = 0; i < entries.length; i++) for (let j = i + 1; j < entries.length; j++) {
      const d = de2000(labs[i], labs[j]);
      const ok = Math.hypot(oks[i][0] - oks[j][0], oks[i][1] - oks[j][1], oks[i][2] - oks[j][2]) * 100;
      pairs.push({ a: entries[i][0], b: entries[j][0], d, ok });
    }
    pairs.sort((x, y) => x.d - y.d);
    const conf = pairs.filter((p) => p.d < CONFUSE), weak = pairs.filter((p) => p.d >= CONFUSE && p.d < WEAK);
    summary.push(`${v.padEnd(9)} min dE00=${pairs[0].d.toFixed(1).padStart(5)} (${pairs[0].a}/${pairs[0].b})  confusable(<${CONFUSE})=${conf.length}  weak(${CONFUSE}-${WEAK})=${weak.length}`);
    if (!opts.brief || v !== 'normal') {
      const fmt = (p) => `${p.a}/${p.b} ${p.d.toFixed(1)} [ok ${p.ok.toFixed(1)}]`;
      if (conf.length) console.log(`  ${v} CONFUSABLE: ` + conf.map(fmt).join('; '));
      if (weak.length && !opts.noWeak) console.log(`  ${v} weak: ` + weak.map(fmt).join('; '));
    }
  }
  console.log('  -- summary --');
  summary.forEach((s) => console.log('  ' + s));
}

const f = (r, g, b) => [r, g, b];
const current = [
  ['red', f(0.9, 0.1, 0.1)], ['orange', f(0.95, 0.5, 0.05)], ['yellow', f(0.95, 0.85, 0.1)],
  ['green', f(0.15, 0.7, 0.2)], ['cyan', f(0.1, 0.8, 0.85)], ['blue', f(0.15, 0.3, 0.95)],
  ['purple', f(0.55, 0.2, 0.85)], ['pink', f(0.95, 0.4, 0.7)], ['brown', f(0.5, 0.3, 0.1)],
  ['white', f(0.95, 0.95, 0.95)],
];
const H = (n, h) => [n, fromHex(h)];
const okabeIto = [H('black', '#000000'), H('orange', '#E69F00'), H('skyblue', '#56B4E9'), H('bluegreen', '#009E73'),
  H('yellow', '#F0E442'), H('blue', '#0072B2'), H('vermillion', '#D55E00'), H('redpurple', '#CC79A7')];
const tolBright = [H('blue', '#4477AA'), H('red', '#EE6677'), H('green', '#228833'), H('yellow', '#CCBB44'),
  H('cyan', '#66CCEE'), H('purple', '#AA3377'), H('grey', '#BBBBBB')];
const tolMuted = [H('rose', '#CC6677'), H('indigo', '#332288'), H('sand', '#DDCC77'), H('green', '#117733'),
  H('cyan', '#88CCEE'), H('wine', '#882255'), H('teal', '#44AA99'), H('olive', '#999933'), H('purple', '#AA4499')];

analyse('CURRENT placeholder palette (content/tasks/delivery.tres)', current);
analyse('Okabe-Ito (8)', okabeIto, { noWeak: true });
analyse('Tol bright (7)', tolBright, { noWeak: true });
analyse('Tol muted (9)', tolMuted, { noWeak: true });

// Greedy + swap search: choose N colours from a pool maximising the minimum dE2000 over normal + 3 full CVDs.
const pool = [
  ...okabeIto.map(([n, c]) => ['OI-' + n, c]),
  ...tolBright.map(([n, c]) => ['TB-' + n, c]),
  ...tolMuted.map(([n, c]) => ['TM-' + n, c]),
  H('TV-orange', '#EE7733'), H('TV-blue', '#0077BB'), H('TV-cyan', '#33BBEE'), H('TV-magenta', '#EE3377'),
  H('TV-red', '#CC3311'), H('TV-teal', '#009988'),
  H('white', '#F2F2F2'), H('darkgrey', '#333333'), H('midgrey', '#808080'), H('brown', '#7F4C19'),
  H('pink', '#FFAABB'), H('lightyellow', '#EEDD88'),
];
const plin = pool.map(([, c]) => c.map(toLin));
const visSet = ['normal', ...CVD_FULL];
const labsBy = Object.fromEntries(visSet.map((v) => [v, plin.map((c) => linToLab(simulateLin(c, v)))]));
const D = pool.map((_, i) => pool.map((__, j) => Math.min(...visSet.map((v) => de2000(labsBy[v][i], labsBy[v][j])))));
const minOf = (set) => { let m = Infinity; for (let i = 0; i < set.length; i++) for (let j = i + 1; j < set.length; j++) m = Math.min(m, D[set[i]][set[j]]); return m; };
function search(N) {
  // start from white + black-ish pair, greedy add farthest
  let set = [pool.findIndex((p) => p[0] === 'white'), pool.findIndex((p) => p[0] === 'OI-black')];
  while (set.length < N) {
    let best = -1, bestD = -1;
    for (let k = 0; k < pool.length; k++) if (!set.includes(k)) { const d = Math.min(...set.map((s) => D[s][k])); if (d > bestD) { bestD = d; best = k; } }
    set.push(best);
  }
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < set.length; i++) for (let k = 0; k < pool.length; k++) if (!set.includes(k)) {
      const cand = set.slice(); cand[i] = k;
      if (minOf(cand) > minOf(set) + 1e-9) { set = cand; improved = true; }
    }
  }
  return set;
}
for (const N of [6, 8, 10]) {
  const s = search(N);
  console.log(`\nBest found for N=${N}: min dE00 over normal+protan+deutan+tritan = ${minOf(s).toFixed(1)}`);
  console.log('  ' + s.map((k) => `${pool[k][0]} ${hex(pool[k][1])}`).join(', '));
  if (N === 10) analyse('PROPOSED 10 (search result)', s.map((k) => pool[k]), { noWeak: false });
}

// ---- Part 2: named palettes only (no extra greys), since players must SAY the colour over voice ----
console.log('\n\n######## PART 2: nameable palettes (white and black allowed, no other greys) ########');
const named = pool.filter(([n]) => !/grey/.test(n));
const nlin = named.map(([, c]) => c.map(toLin));
const nlabs = Object.fromEntries(visSet.map((v) => [v, nlin.map((c) => linToLab(simulateLin(c, v)))]));
const ND = named.map((_, i) => named.map((__, j) => Math.min(...visSet.map((v) => de2000(nlabs[v][i], nlabs[v][j])))));
const nmin = (set) => { let m = Infinity; for (let i = 0; i < set.length; i++) for (let j = i + 1; j < set.length; j++) m = Math.min(m, ND[set[i]][set[j]]); return m; };
function nsearch(N) {
  let set = [named.findIndex((p) => p[0] === 'white'), named.findIndex((p) => p[0] === 'OI-black')];
  while (set.length < N) { let best = -1, bd = -1; for (let k = 0; k < named.length; k++) if (!set.includes(k)) { const d = Math.min(...set.map((s) => ND[s][k])); if (d > bd) { bd = d; best = k; } } set.push(best); }
  let imp = true; while (imp) { imp = false; for (let i = 2; i < set.length; i++) for (let k = 0; k < named.length; k++) if (!set.includes(k)) { const c = set.slice(); c[i] = k; if (nmin(c) > nmin(set) + 1e-9) { set = c; imp = true; } } }
  return set;
}
for (const N of [6, 7, 8, 9, 10]) { const s = nsearch(N); console.log(`N=${N}: min dE00 (normal+P+D+T) = ${nmin(s).toFixed(1)} :: ` + s.map((k) => `${named[k][0]} ${hex(named[k][1])}`).join(', ')); }

const handA = [H('white', '#F2F2F2'), H('black', '#1E1E1E'), H('yellow', '#F0E442'), H('orange', '#E69F00'),
  H('red', '#D55E00'), H('skyblue', '#56B4E9'), H('blue', '#0072B2'), H('green', '#009E73'),
  H('pink', '#CC79A7'), H('indigo', '#332288')];
analyse('HAND A: Okabe-Ito 7 hues + white + near-black + Tol indigo', handA, { noWeak: true });
const handB = [H('white', '#F2F2F2'), H('black', '#1E1E1E'), H('yellow', '#F0E442'), H('orange', '#EE7733'),
  H('red', '#CC3311'), H('cyan', '#33BBEE'), H('blue', '#0077BB'), H('green', '#117733'),
  H('pink', '#FFAABB'), H('purple', '#AA3377')];
analyse('HAND B: Tol vibrant hues + white + near-black + Tol light pink + Tol purple', handB, { noWeak: true });
