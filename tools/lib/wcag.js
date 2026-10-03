// WCAG 2.x relative luminance, contrast ratio and sRGB alpha compositing (spec §11.5).
// Colours are arrays of sRGB floats in 0..1: [r, g, b] or [r, g, b, a].
// Sources: https://www.w3.org/TR/WCAG22/#dfn-relative-luminance and #dfn-contrast-ratio.
// Compositing is plain "over" in gamma-encoded sRGB, as browsers do and as Godot does with hdr_2d off.
"use strict";

function channel(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(rgb) {
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

function ratio(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// fg over an opaque under: [r, g, b, 1]. A translucent under has no single answer, so it throws.
function composite(fg, under) {
  const ua = under.length > 3 ? under[3] : 1;
  if (ua !== 1) throw new Error("composite: the colour underneath must be opaque (alpha " + ua + ")");
  const a = fg.length > 3 ? fg[3] : 1;
  return [0, 1, 2].map(i => a * fg[i] + (1 - a) * under[i]).concat(1);
}

// "#rrggbb" or "#rgb" (and an optional alpha float) -> [r, g, b, a] floats.
function fromHex(hex, alpha) {
  let h = String(hex).replace(/^#/, "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error("not a #rrggbb colour: " + hex);
  const n = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  return n.concat(alpha === undefined ? 1 : alpha);
}

function toHex(rgb) {
  return "#" + [0, 1, 2].map(i => Math.round(Math.min(1, Math.max(0, rgb[i])) * 255).toString(16).padStart(2, "0")).join("");
}

module.exports = { luminance, ratio, composite, fromHex, toHex };

if (require.main === module) {
  // Spot values: white on black is 21, a colour on itself is 1, mid grey #777777 on white is 4.48.
  const close = (a, b) => Math.abs(a - b) < 0.005;
  const checks = [
    ["white/black", ratio(fromHex("#ffffff"), fromHex("#000000")), 21],
    ["same", ratio(fromHex("#2a1f33"), fromHex("#2a1f33")), 1],
    ["#777 on white", ratio(fromHex("#777777"), fromHex("#ffffff")), 4.48],
    ["plate over 97", ratio(fromHex("#fff4e2"), composite(fromHex("#2a1f33", 0.86), fromHex("#979797"))), 11.54],
  ];
  let bad = 0;
  for (const [name, got, want] of checks) {
    const ok = close(got, want);
    if (!ok) bad++;
    console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${got.toFixed(2)} (want ${want})`);
  }
  process.exit(bad ? 1 : 0);
}
