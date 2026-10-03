// WCAG 2.x contrast checks for HUD text over the 3D world and colour swatches on panels.
// Relative luminance and ratio per WCAG 2.2 (https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio).
'use strict';
const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const Y = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const ratio = (a, b) => { const [h, l] = [Y(a), Y(b)].sort((x, y) => y - x); return (h + 0.05) / (l + 0.05); };
const fromHex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
// Backplate: black at alpha a over the worst-case world pixel, blended in sRGB space
// (Godot 2D blends in sRGB unless HDR 2D is on; unconfirmed for every renderer).
console.log('White text (#FFFFFF) on a black backplate of alpha a over a pure white world pixel (worst case):');
for (const a of [0.4, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8]) {
  const bg = [1 - a, 1 - a, 1 - a];
  console.log(`  a=${a.toFixed(2)}  ratio=${ratio([1, 1, 1], bg).toFixed(2)}:1`);
}
console.log('Near-white text #F2F2F2 on the same, a=0.6/0.7:', ratio(fromHex('#F2F2F2'), [0.4, 0.4, 0.4]).toFixed(2), ratio(fromHex('#F2F2F2'), [0.3, 0.3, 0.3]).toFixed(2));
const panels = { darkPanel: '#1A1A1A', midPanel: '#2B2B2B', lightPanel: '#F2F2F2' };
const sets = {
  current: { red: [0.9, 0.1, 0.1], orange: [0.95, 0.5, 0.05], yellow: [0.95, 0.85, 0.1], green: [0.15, 0.7, 0.2], cyan: [0.1, 0.8, 0.85], blue: [0.15, 0.3, 0.95], purple: [0.55, 0.2, 0.85], pink: [0.95, 0.4, 0.7], brown: [0.5, 0.3, 0.1], white: [0.95, 0.95, 0.95] },
  handA: Object.fromEntries(Object.entries({ white: '#F2F2F2', black: '#1E1E1E', yellow: '#F0E442', orange: '#E69F00', red: '#D55E00', skyblue: '#56B4E9', blue: '#0072B2', green: '#009E73', pink: '#CC79A7', indigo: '#332288' }).map(([k, v]) => [k, fromHex(v)])),
};
for (const [name, set] of Object.entries(sets)) {
  console.log(`\nSwatch contrast vs panels (non-text needs >= 3:1, WCAG 1.4.11 / XAG 102) -- ${name}`);
  for (const [c, rgb] of Object.entries(set)) {
    const r = Object.entries(panels).map(([p, h]) => `${p} ${ratio(rgb, fromHex(h)).toFixed(2)}`).join('  ');
    const fails = Object.entries(panels).filter(([, h]) => ratio(rgb, fromHex(h)) < 3).map(([p]) => p);
    console.log(`  ${c.padEnd(8)} ${r}${fails.length ? '   < 3:1 on ' + fails.join(', ') : ''}`);
  }
}
