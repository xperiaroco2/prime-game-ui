// Colour helpers for the token build (spec §7.5): hex <-> sRGB floats, sRGB <-> OKLab, OKLab mixing.
// OKLab: Björn Ottosson, "A perceptual color space for image processing" (2020),
// https://bottosson.github.io/posts/oklab/ ; the same forward matrices as tools/a11y/cvd.js.
// Node 20, no packages.
'use strict';

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const round4 = (x) => {
  const r = Math.round(x * 10000) / 10000;
  return r === 0 ? 0 : r; // no -0
};

// '#rrggbb' -> [r, g, b] in 0..1
function parseHex(hex) {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) throw new Error(`color.parseHex: not a #rrggbb colour: ${hex}`);
  return [0, 2, 4].map((k) => parseInt(m[1].slice(k, k + 2), 16) / 255);
}

// [r, g, b] in 0..1 -> '#rrggbb', lowercase, round(x * 255), clamped
function toHex(rgb) {
  return '#' + rgb.map((c) => Math.round(clamp01(c) * 255).toString(16).padStart(2, '0')).join('');
}

const toLinear = (c) => {
  const a = Math.abs(c);
  const v = a <= 0.04045 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  return c < 0 ? -v : v;
};
const toGamma = (c) => {
  const a = Math.abs(c);
  const v = a <= 0.0031308 ? 12.92 * a : 1.055 * Math.pow(a, 1 / 2.4) - 0.055;
  return c < 0 ? -v : v;
};

// [r, g, b] sRGB 0..1 -> [L, a, b]
function srgbToOklab(rgb) {
  const [r, g, b] = rgb.map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ];
}

// [L, a, b] -> [r, g, b] sRGB (not clamped; toHex clamps)
function oklabToSrgb(lab) {
  const [L, a, b] = lab;
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ].map(toGamma);
}

// = color-mix(in oklab, full t*100%, empty): t = 1 gives full, t = 0 gives empty. Opaque colours only.
function mixOklab(full, empty, t) {
  const A = srgbToOklab(full);
  const B = srgbToOklab(empty);
  return oklabToSrgb([0, 1, 2].map((k) => A[k] * t + B[k] * (1 - t)));
}

// Euclidean distance in OKLab (ΔE_ok).
function deltaEOk(rgbA, rgbB) {
  const A = srgbToOklab(rgbA);
  const B = srgbToOklab(rgbB);
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
}

module.exports = { parseHex, toHex, srgbToOklab, oklabToSrgb, mixOklab, deltaEOk, round4, clamp01 };
