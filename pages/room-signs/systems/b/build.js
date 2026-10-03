// Room signs, system B (shape-coded plates): writes icons/, plates/ and signs/ next to this file.
// Own work (prime-game-ui). Node 20, no packages. Run: node pages/room-signs/systems/b/build.js
// A sign = its plate (cream face, 6-unit ink outline, 64 grid) + its icon (48 grid, 6-unit stroke) scaled into the plate.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || __dirname;
const INK = '#2a1f33', CREAM = '#fff4e2';
const SW = 6; // the one stroke width of the system (plate outline on the 64 grid, icon stroke on the 48 grid)
const r2 = (n) => Math.round(n * 100) / 100;

// rounded polygon: pts [[x,y]...], radii number or array; returns path d
function rpoly(pts, radii) {
  const n = pts.length;
  const rad = Array.isArray(radii) ? radii : pts.map(() => radii);
  let area = 0;
  for (let i = 0; i < n; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n]; area += x1 * y2 - x2 * y1; }
  const cw = area > 0; // screen coords: positive area = clockwise on screen
  const segs = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    const v1 = [a[0] - p[0], a[1] - p[1]], v2 = [b[0] - p[0], b[1] - p[1]];
    const l1 = Math.hypot(...v1), l2 = Math.hypot(...v2);
    const u1 = [v1[0] / l1, v1[1] / l1], u2 = [v2[0] / l2, v2[1] / l2];
    const ang = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1])));
    const r = rad[i];
    if (!r) { segs.push({ s: p, e: p, r: 0 }); continue; }
    const d = Math.min(r / Math.tan(ang / 2), l1 / 2, l2 / 2);
    const rr = d * Math.tan(ang / 2);
    const s = [p[0] + u1[0] * d, p[1] + u1[1] * d], e = [p[0] + u2[0] * d, p[1] + u2[1] * d];
    const cross = (p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0]);
    const sweep = cross > 0 ? 1 : 0;
    segs.push({ s, e, r: rr, sweep });
  }
  let d = `M${r2(segs[0].e[0])},${r2(segs[0].e[1])}`;
  for (let k = 1; k <= n; k++) {
    const g = segs[k % n];
    d += ` L${r2(g.s[0])},${r2(g.s[1])}`;
    if (g.r) d += ` A${r2(g.r)},${r2(g.r)} 0 0 ${g.sweep} ${r2(g.e[0])},${r2(g.e[1])}`;
  }
  return d + ' Z';
}
const rr = (x, y, w, h, r) => rpoly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], r);
const circle = (cx, cy, r) => `M${cx - r},${cy} A${r},${r} 0 1 1 ${cx + r},${cy} A${r},${r} 0 1 1 ${cx - r},${cy} Z`;
const circleRev = (cx, cy, r) => `M${cx - r},${cy} A${r},${r} 0 1 0 ${cx + r},${cy} A${r},${r} 0 1 0 ${cx - r},${cy} Z`;

// ---------- plates (64 grid, live 4..60, path on the stroke centre line, stroke 6) ----------
function gear(cx, cy, teeth, rTip, rRoot, tipW, rootW) {
  const pts = [];
  const pitch = (2 * Math.PI) / teeth;
  for (let i = 0; i < teeth; i++) {
    const c = -Math.PI / 2 + i * pitch;
    const ht = tipW / 2 / rTip, hr = rootW / 2 / rRoot;
    pts.push([cx + rRoot * Math.cos(c - hr), cy + rRoot * Math.sin(c - hr)]);
    pts.push([cx + rTip * Math.cos(c - ht), cy + rTip * Math.sin(c - ht)]);
    pts.push([cx + rTip * Math.cos(c + ht), cy + rTip * Math.sin(c + ht)]);
    pts.push([cx + rRoot * Math.cos(c + hr), cy + rRoot * Math.sin(c + hr)]);
  }
  return rpoly(pts, pts.map((_, k) => (k % 4 === 1 || k % 4 === 2 ? 2.5 : 2.5)));
}
function cloud() {
  // three bumps on a flat base; base y = 54
  const L = { x: 18, y: 43, r: 11 }, M = { x: 31, y: 28, r: 16 }, R = { x: 46, y: 42, r: 12 };
  const inter = (A, B) => { // intersection of two circles, the one with smaller y
    const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy);
    const a = (A.r * A.r - B.r * B.r + d * d) / (2 * d), h = Math.sqrt(A.r * A.r - a * a);
    const px = A.x + (a * dx) / d, py = A.y + (a * dy) / d;
    const p1 = [px + (h * dy) / d, py - (h * dx) / d], p2 = [px - (h * dy) / d, py + (h * dx) / d];
    return p1[1] < p2[1] ? p1 : p2;
  };
  const lm = inter(L, M), mr = inter(M, R);
  const f = (p) => `${r2(p[0])},${r2(p[1])}`;
  return `M${L.x},${L.y + L.r} A${L.r},${L.r} 0 0 1 ${f(lm)} A${M.r},${M.r} 0 0 1 ${f(mr)} A${R.r},${R.r} 0 0 1 ${R.x},${R.y + R.r} Z`;
}

const PLATES = {
  storage: { name: 'rounded square (a crate)', d: rr(8, 8, 48, 48, 10), win: [32, 32], s: 0.72 },
  hall: { name: 'arch (a doorway)', d: 'M10,30 A22,22 0 0 1 54,30 L54,51 A6,6 0 0 1 48,57 L16,57 A6,6 0 0 1 10,51 Z', win: [32, 35], s: 0.7 },
  kitchen: { name: 'frying pan', d: circle(25, 32, 18), ears: [rr(40, 28, 20, 8, 4)], win: [25, 32], s: 0.56 },
  lab: { name: 'hexagon (a molecule ring)', d: rpoly([0, 1, 2, 3, 4, 5].map((i) => { const a = -Math.PI / 2 + i * Math.PI / 3; return [32 + 25.5 * Math.cos(a), 32 + 25.5 * Math.sin(a)]; }), 6), win: [32, 32], s: 0.7 },
  office: { name: 'folder', d: rpoly([[7, 12], [24, 12], [30, 20], [57, 20], [57, 54], [7, 54]], [5, 3, 3, 6, 6, 6]), win: [32, 37], s: 0.6 },
  lounge: { name: 'house', d: rpoly([[32, 6], [58, 30], [51, 30], [51, 57], [13, 57], [13, 30], [6, 30]], [5, 2.5, 3, 6, 6, 3, 2.5]), win: [32, 39], s: 0.62 },
  workshop: { name: 'gear', d: gear(32, 32, 8, 25.5, 18, 10, 11), win: [32, 32], s: 0.56 },
  server: { name: 'cloud', d: cloud(), win: [32, 39], s: 0.6 },
};

// ---------- icons (48 grid, live 4..44, stroke 6) ----------
// element: [d, mode] mode 'f' fill, 's' stroke, 'fe' fill evenodd
const ICONS = {
  storage: [[rr(4, 27, 17, 17, 3), 'f'], [rr(27, 27, 17, 17, 3), 'f'], [rr(15.5, 4, 17, 17, 3), 'f']],
  hall: [[circle(24, 24, 18), 's'], ['M24,16 L24,24 L31,24', 's']],
  kitchen: [['M12,42 L36,42 A4,4 0 0 0 40,38 C40,28 34,20 24,20 C14,20 8,28 8,38 A4,4 0 0 0 12,42 Z', 'f'], ['M13,33 L6,23', 's'], ['M15,20 C15,7 33,7 33,20', 's']],
  lab: [[rr(15, 4, 18, 6, 2.5), 'f'], [rpoly([[19, 8], [29, 8], [29, 18], [41, 38], [41, 44], [7, 44], [7, 38], [19, 18]], [0, 0, 2, 4, 3, 3, 4, 2]) + ' ' + circleRev(19, 36, 3.5) + ' ' + circleRev(28, 29, 3), 'fe']],
  office: [[rr(5, 38, 22, 6, 3), 'f'], ['M15,39 L10,25 L23,14', 's'], [rpoly([[26.5, 9.5], [42, 15.5], [29.5, 30.5], [21.5, 17]], 2.5), 'f']],
  lounge: [[rr(4, 16, 10, 24, 4), 'f'], [rr(34, 16, 10, 24, 4), 'f'], [rr(12, 6, 24, 18, 4), 'f'], [rr(12, 30, 24, 10, 2), 'f'], [rr(7, 39, 5, 5, 1.5), 'f'], [rr(36, 39, 5, 5, 1.5), 'f']],
  workshop: [['<g transform="rotate(-35 24 24)">', 'raw'], [rr(7, 5, 34, 13, 3), 'f'], [rr(20, 17, 8, 28, 3), 'f'], ['</g>', 'raw']],
  server: [[rr(15, 4, 6, 12, 2), 'f'], [rr(27, 4, 6, 12, 2), 'f'], [rr(11, 13, 26, 16, 5), 'f'], [rr(19, 27, 10, 6, 1), 'f'], ['M24,31 L24,34 Q24,41 31,41 L41,41', 's']],
};

function iconBody(id) {
  return ICONS[id].map(([d, m]) => {
    if (m === 'raw') return d;
    if (m === 's') return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (m === 'fe') return `<path d="${d}" fill="${INK}" fill-rule="evenodd"/>`;
    return `<path d="${d}" fill="${INK}"/>`;
  }).join('');
}
const svg = (w, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${w}" viewBox="0 0 ${w} ${w}">${body}</svg>\n`;
const plateEl = (id) => (PLATES[id].ears || []).map((d) => `<path d="${d}" fill="${INK}"/>`).join("") + `<path d="${PLATES[id].d}" fill="${CREAM}" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>`;

for (const sub of ['icons', 'plates', 'signs']) fs.mkdirSync(path.join(OUT, sub), { recursive: true });
for (const id of Object.keys(PLATES)) {
  const P = PLATES[id];
  fs.writeFileSync(path.join(OUT, 'icons', `${id}.svg`), svg(48, iconBody(id)));
  fs.writeFileSync(path.join(OUT, 'plates', `${id}.svg`), svg(64, plateEl(id)));
  const tx = r2(P.win[0] - 24 * P.s), ty = r2(P.win[1] - 24 * P.s);
  fs.writeFileSync(path.join(OUT, 'signs', `${id}.svg`), svg(64, plateEl(id) + `<g transform="translate(${tx} ${ty}) scale(${P.s})">${iconBody(id)}</g>`));
}
console.log('wrote', Object.keys(PLATES).length * 3, 'SVGs to', OUT);
