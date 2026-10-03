// System A (stamps): writes every SVG of the system from the geometry below. Own work, prime-game-ui.
// Run: node pages/room-signs/systems/a/build.js   (node 20, no packages)
// Grid: 64-unit artboard, 56-unit live area (4..60), strokes and gaps of at least 6 units, round corners.
// Output is plain paths and fills only (no text, filters, masks, gradients or external references),
// so Godot 4.7 imports it (svg/scale 8 gives 512 px for the icon; 4 gives 360 px for the 90-unit face).
'use strict';
const fs = require('fs');
const path = require('path');

const INK = '#2a1f33';   // palette.ink
const CREAM = '#fff4e2'; // palette.cream
const OUT = __dirname;

const f = (n) => String(Math.round(n * 100) / 100);
const P = (x, y) => [x, y];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const unit = (a) => { const l = Math.hypot(a[0], a[1]); return [a[0] / l, a[1] / l]; };
const pt = (p) => `${f(p[0])} ${f(p[1])}`;

// rounded rectangle
const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w)} ${f(y + r)}` +
  `V${f(y + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}` +
  `A${f(r)} ${f(r)} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y)}Z`;
// circle
const circ = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx + r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx - r)} ${f(cy)}Z`;
// a thick line with round caps
function capsule(a, b, w) {
  const d = unit([b[0] - a[0], b[1] - a[1]]);
  const n = mul([d[1], -d[0]], w / 2);
  const r = f(w / 2);
  return `M${pt(add(a, n))}L${pt(add(b, n))}A${r} ${r} 0 0 1 ${pt(add(b, mul(n, -1)))}` +
    `L${pt(add(a, mul(n, -1)))}A${r} ${r} 0 0 1 ${pt(add(a, n))}Z`;
}
// polygon with rounded corners (radius per vertex or one radius)
function rpoly(pts, r) {
  const n = pts.length;
  const rad = (i) => (Array.isArray(r) ? r[i] : r);
  let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
    const l0 = Math.hypot(p0[0] - p1[0], p0[1] - p1[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const k = Math.min(rad(i), l0 / 2, l2 / 2);
    const a = add(p1, mul(unit([p0[0] - p1[0], p0[1] - p1[1]]), k));
    const b = add(p1, mul(unit([p2[0] - p1[0], p2[1] - p1[1]]), k));
    d += (i === 0 ? 'M' : 'L') + pt(a) + 'Q' + pt(p1) + ' ' + pt(b);
  }
  return d + 'Z';
}
// a box (rectangle) turned by its axis: centre c, unit axis u, half length hl along u, half width hw across
function obox(c, u, hl, hw, r) {
  const v = [-u[1], u[0]];
  const pts = [add(add(c, mul(u, -hl)), mul(v, -hw)), add(add(c, mul(u, hl)), mul(v, -hw)),
    add(add(c, mul(u, hl)), mul(v, hw)), add(add(c, mul(u, -hl)), mul(v, hw))];
  return rpoly(pts, r);
}

// One entry per room: a list of path data strings. Each string is one <path>; holes in the same string use
// evenodd, and separate strings overlap to make a union.
const D45 = unit([1, 1]), U45 = unit([1, -1]);
const lampAxis = D45;
const lampHead = (() => {
  const c0 = [36, 14];
  const back = add(c0, mul(lampAxis, -2)), mouth = add(c0, mul(lampAxis, 17));
  const pp = [lampAxis[1], -lampAxis[0]];
  return rpoly([add(back, mul(pp, 5)), add(mouth, mul(pp, 13)), add(mouth, mul(pp, -13)), add(back, mul(pp, -5))], 3);
})();
const spannerJaw = (() => {
  const C = [48, 16], R = 10, hw = 4, q = U45; // the jaw opens along q (up and right)
  const pp = [-q[1], q[0]];
  const t = Math.sqrt(R * R - hw * hw);
  const e1 = add(add(C, mul(q, t)), mul(pp, hw)), e2 = add(add(C, mul(q, t)), mul(pp, -hw));
  const b2 = add(C, mul(pp, -hw)), b1 = add(C, mul(pp, hw));
  // long arc through the back of the jaw: pick the sweep whose centre is C
  const ang = (v) => Math.atan2(v[1] - C[1], v[0] - C[0]);
  let span = ang(e2) - ang(e1);
  while (span < 0) span += 2 * Math.PI;
  const sweep = span > Math.PI ? 1 : 0;
  return `M${pt(e1)}A${R} ${R} 0 1 ${sweep} ${pt(e2)}L${pt(b2)}L${pt(b1)}Z`;
})();

const ICONS = {
  storage: [
    rr(4, 36, 25, 23, 3) + rr(35, 36, 25, 23, 3) + rr(19.5, 7, 25, 23, 3),
  ],
  hall: [
    circ(32, 32, 27) + circ(32, 32, 18),
    rpoly([P(28.5, 21), P(35.5, 21), P(35.5, 28.5), P(43, 28.5), P(43, 35.5), P(28.5, 35.5)], 3.5),
  ],
  kitchen: [
    circ(19, 25, 10), circ(45, 25, 10), circ(32, 16, 12.5), rr(17, 22, 30, 16, 3),
    rr(21, 44, 22, 16, 3.5),
  ],
  lab: [
    rpoly([P(20, 5), P(44, 5), P(44, 12), P(39, 12), P(39, 25), P(58, 59), P(6, 59), P(25, 25), P(25, 12), P(20, 12)],
      [3, 3, 3, 2, 4, 6, 6, 4, 2, 3]) + circ(26, 48, 4.5) + circ(36, 37, 3.5),
  ],
  office: [
    rr(8, 52, 30, 7, 3.5),
    capsule([23, 53], [14, 32], 7),
    circ(14, 32, 5.5),
    capsule([14, 32], [36, 14], 7),
    lampHead,
  ],
  lounge: [
    rr(13, 17, 38, 14, 5),
    rr(4, 25, 13, 20, 5), rr(47, 25, 13, 20, 5),
    rr(13, 37, 38, 8, 3),
    rr(8, 43, 7, 8, 2.5), rr(49, 43, 7, 8, 2.5),
  ],
  workshop: [
    capsule([12, 52], [42, 22], 8), spannerJaw,
    capsule([52, 52], [19, 19], 8), obox([19, 19], U45, 12, 6, 3),
  ],
  server: [
    rr(10, 4, 44, 52, 4) + rr(16, 11, 16, 6, 3) + circ(44, 14, 3.5) + rr(16, 25, 16, 6, 3) + circ(44, 28, 3.5) +
    rr(16, 39, 16, 6, 3) + circ(44, 42, 3.5),
    rr(14, 52, 8, 8, 2.5), rr(42, 52, 8, 8, 2.5),
  ],
};

const paths = (list, fill, dx = 0, dy = 0) => list.map((d) =>
  `<path${dx || dy ? ` transform="translate(${dx} ${dy})"` : ''} fill="${fill}" fill-rule="evenodd" d="${d}"/>`).join('\n  ');
const svg = (size, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">\n  ${body}\n</svg>\n`;

// The plate: a 90-unit face (0.45 m on the package, 1 unit = 5 mm). Square ink frame (the box's plum edge),
// 4 units wide, a cream panel with radius 10 inside; the 64-unit icon sits at 13..77.
const PLATE = [`<rect width="90" height="90" fill="${INK}"/>`, `<path fill="${CREAM}" d="${rr(4, 4, 82, 82, 10)}"/>`];

fs.mkdirSync(path.join(OUT, 'icons'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'faces'), { recursive: true });
for (const [id, list] of Object.entries(ICONS)) {
  fs.writeFileSync(path.join(OUT, 'icons', `${id}.svg`), svg(64, paths(list, INK)));
  fs.writeFileSync(path.join(OUT, 'faces', `${id}.svg`), svg(90, PLATE.join('\n  ') + '\n  ' + paths(list, INK, 13, 13)));
}
fs.writeFileSync(path.join(OUT, 'plate.svg'), svg(90, PLATE.join('\n  ')));
console.log('wrote', Object.keys(ICONS).length, 'icons,', Object.keys(ICONS).length, 'faces and plate.svg');
