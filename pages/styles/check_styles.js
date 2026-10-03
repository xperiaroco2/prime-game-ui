// Godot-safe lint and WCAG contrast check for the prime-game UI style directions.
// Usage: node check_styles.js [retro|card|toy ...]   (default: all three). Exit 1 on any violation or failed pair.
"use strict";
const fs = require("fs");
const path = require("path");
const DIR = __dirname;
const KEYS = process.argv.slice(2).length ? process.argv.slice(2) : ["retro", "card", "toy"];
const WORLD = { C9: "#C9C9C9", "97": "#979797" };

// ---------- CSS parsing ----------
function splitTop(s, sep) {
  const out = []; let depth = 0, q = null, cur = "";
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (depth === 0 && ch === sep) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map(x => x.trim()).filter(Boolean);
}
function parse(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = []; let i = 0; const at = [];
  while (i < src.length) {
    const open = src.indexOf("{", i); if (open < 0) break;
    const close = src.indexOf("}", open); if (close < 0) throw new Error("unbalanced braces");
    const selText = src.slice(i, open).trim();
    if (selText.startsWith("@")) at.push(selText);
    const body = src.slice(open + 1, close);
    if (body.includes("{")) throw new Error("nested block near: " + selText);
    const decls = splitTop(body, ";").map(d => {
      const k = d.indexOf(":"); return { prop: d.slice(0, k).trim().toLowerCase(), value: d.slice(k + 1).trim() };
    });
    rules.push({ selText, sels: splitTop(selText, ","), decls });
    i = close + 1;
  }
  if (src.slice(i).trim()) throw new Error("trailing text after last rule");
  return { rules, at };
}

// ---------- colours ----------
function hex(h) {
  h = h.replace("#", ""); if (h.length === 3) h = h.split("").map(c => c + c).join("");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
}
function col(v) {
  v = String(v).replace(/!important/, "").trim();
  if (v === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  let m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i); if (m) return hex(v);
  m = v.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
  throw new Error("cannot parse colour: " + v);
}
const over = (fg, bg) => ({ r: fg.a * fg.r + (1 - fg.a) * bg.r, g: fg.a * fg.g + (1 - fg.a) * bg.g, b: fg.a * fg.b + (1 - fg.a) * bg.b, a: 1 });
function lum(c) { const f = x => { x /= 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
function ratio(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
const toHex = c => "#" + [c.r, c.g, c.b].map(x => Math.round(x).toString(16).padStart(2, "0")).join("").toUpperCase();

// ---------- lint ----------
const ALLOWED = new Set(["background", "background-color", "color", "border", "border-top", "border-right", "border-bottom", "border-left",
  "border-width", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-style", "border-color",
  "border-radius", "border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius",
  "box-shadow", "text-shadow", "-webkit-text-stroke", "opacity", "letter-spacing", "text-transform", "font-weight", "font-size",
  "font-family", "rotate", "transform", "transform-origin", "stroke", "fill", "outline-color", "outline"]);
const LAYOUT = new Set(["padding", "padding-top", "padding-right", "padding-bottom", "padding-left", "margin", "margin-top", "margin-right",
  "margin-bottom", "margin-left", "align-self", "width", "height"]);
const FORBIDDEN_PROPS = /^(filter|backdrop-filter|-webkit-backdrop-filter|clip-path|mix-blend-mode|background-image|mask.*|-webkit-mask.*|animation.*|transition.*|background-blend-mode)$/;
const BASE_SIZE = { room: 16 };
function lengthsIn(layer) {
  return splitTop(layer.replace(/\s+/g, " "), " ").filter(t => /^(-?[\d.]+(px|em|rem|cqw)?|calc\(.*\))$/.test(t)).length;
}

function lint(key, css) {
  const { rules, at } = parse(css);
  const V = [], I = [];
  const prefix = `body[data-style="${key}"]`;
  for (const a of at) V.push(`at-rule not allowed: ${a}`);
  let important = 0, previewSel = 0, shadows = 0;
  for (const r of rules) {
    const where = r.sels[0].slice(0, 90) + (r.sels.length > 1 ? ` (+${r.sels.length - 1})` : "");
    for (const s of r.sels) {
      if (!s.startsWith(prefix)) V.push(`selector without the ${prefix} prefix: ${s}`);
      if (/::?(before|after|first-letter|first-line|marker|placeholder|selection)\b/i.test(s)) V.push(`pseudo-element: ${s}`);
      if (/:has\(|:nth-child|\[style\*=|\[data-in|:first-child|:last-child/.test(s)) previewSel++;
    }
    const sideCol = {};
    const titleSel = r.sels.every(s => /\.t(28|36|48|64|96)\b/.test(s));
    for (const { prop, value } of r.decls) {
      const v = value.replace(/!important/, "").trim();
      if (/!important/.test(value)) important++;
      if (prop.startsWith("--")) continue;
      if (FORBIDDEN_PROPS.test(prop)) { V.push(`${where}: forbidden property ${prop}`); continue; }
      if (/gradient\(/i.test(v)) V.push(`${where}: gradient in ${prop}`);
      if (/url\(/i.test(v)) V.push(`${where}: url() in ${prop}`);
      if (/^(border|outline)/.test(prop) && /\b(dashed|dotted|double|groove|ridge|outset|inset)\b/.test(v)) V.push(`${where}: non-solid line style in ${prop}: ${v}`);
      if (prop === "outline" && v !== "none") V.push(`${where}: outline other than none (${v})`);
      if (!ALLOWED.has(prop) && !LAYOUT.has(prop)) V.push(`${where}: property outside the Godot-safe list: ${prop}`);
      if (LAYOUT.has(prop)) I.push(`layout property (check sizes are kept): ${where} { ${prop}: ${v} }`);
      if (prop === "transform" && v !== "none" && !/^((rotate|skew[XY]?)\([^)]*\)\s*)+$/.test(v)) V.push(`${where}: transform other than rotate/skew: ${v}`);
      if (prop === "box-shadow" && v !== "none") {
        shadows++;
        const layers = splitTop(v, ",");
        if (layers.length > 1) V.push(`${where}: ${layers.length} box-shadow layers`);
        for (const l of layers) {
          if (/\binset\b/.test(l)) V.push(`${where}: inset box-shadow`);
          if (lengthsIn(l) > 3) V.push(`${where}: box-shadow with a spread: ${l}`);
        }
      }
      if (prop === "text-shadow" || prop === "-webkit-text-stroke") {
        if (v !== "none") {
          const layers = splitTop(v, ",");
          if (layers.length > 1) V.push(`${where}: ${layers.length} text-shadow layers`);
          if (prop === "text-shadow" && layers.some(l => lengthsIn(l) > 3)) V.push(`${where}: text-shadow with too many lengths`);
          if (!titleSel) V.push(`${where}: text outline/shadow on a non-title selector`);
        }
      }
      // Godot ints: border widths, corner radii, font sizes, shadow sizes
      if (/^(border|font-size|box-shadow|text-shadow)/.test(prop)) {
        for (const m of v.matchAll(/calc\(\s*(-?[\d.]+)cqw\s*\/\s*19\.2\s*\)/g)) if (!Number.isInteger(+m[1])) V.push(`${where}: ${prop} uses ${m[1]} px, Godot needs an int`);
        for (const m of v.matchAll(/(^|[\s(])(-?\d*\.\d+)px/g)) V.push(`${where}: ${prop} uses ${m[2]} px, Godot needs an int`);
      }
      // text size: at most about 15% from the wireframe
      if (prop === "font-size") {
        const m = v.match(/calc\(\s*([\d.]+)cqw/); const px = m ? +m[1] : null;
        for (const s of r.sels) {
          const last = s.split(/\s+|>/).filter(Boolean).pop();
          const t = (last.match(/\.t(\d+)/g) || []).pop();
          const base = t ? +t.slice(2) : (/\.room\b/.test(last) ? BASE_SIZE.room : (/\.t(\d+)/.test(s) ? +s.match(/\.t(\d+)/g).pop().slice(2) : null));
          if (px && base && Math.abs(px / base - 1) > 0.155) V.push(`text size ${base} -> ${px} px (${Math.round((px / base - 1) * 100)}%): ${s}`);
          if (px && !base) I.push(`font-size ${px} px with no wireframe size class to compare: ${s}`);
        }
      }
      // one border colour per element
      if (/^border-(top|right|bottom|left)-color$/.test(prop)) V.push(`${where}: per-side border colour property ${prop}`);
      if (prop === "border-color") { const parts = splitTop(v, " "); if (new Set(parts).size > 1) V.push(`${where}: several border colours: ${v}`); ["t", "r", "b", "l"].forEach(sd => sideCol[sd] = parts[0]); }
      const sm = prop.match(/^border(?:-(top|right|bottom|left))?$/);
      if (sm) {
        const c = splitTop(v, " ").find(t => !/^(0|-?[\d.]+(px|em|rem|cqw)|calc\(.*\)|solid|none|hidden|dashed|dotted|double|groove|ridge|inset|outset|thin|medium|thick)$/.test(t));
        if (c) (sm[1] ? [sm[1][0]] : ["t", "r", "b", "l"]).forEach(sd => sideCol[sd] = c);
      }
      if (prop === "background" || prop === "background-color") {
        try { const cv = col(resolveVar(v, globalVars)); if (cv.a > 0 && cv.a < 0.6) I.push(`background below 60% (must not carry text over the world): ${where} -> ${v}`); } catch (e) { /* var or keyword */ }
      }
    }
    if (new Set(Object.values(sideCol)).size > 1) V.push(`${where}: different border colours per side: ${JSON.stringify(sideCol)}`);
  }
  I.push(`rules ${rules.length}; box-shadow declarations ${shadows}; !important ${important}; preview-only selectors (:has, :nth-child, [style*=], [data-in], :first/last-child) ${previewSel}`);
  return { V, I, rules };
}

// ---------- variables and rule lookups ----------
let globalVars = {};
function collectVars(rules) { const v = {}; for (const r of rules) for (const d of r.decls) if (d.prop.startsWith("--")) v[d.prop] = d.value; return v; }
function resolveVar(v, vars) {
  v = String(v).replace(/!important/, "").trim();
  for (let n = 0; n < 10 && /var\(/.test(v); n++) v = v.replace(/var\((--[\w-]+)\)/g, (_, k) => { if (!(k in vars)) throw new Error("undefined " + k); return vars[k]; });
  return v.trim();
}
function pick(rules, key, sel, prop) {
  const full = `body[data-style="${key}"] ${sel}`;
  let found = null;
  for (const r of rules) if (r.sels.includes(full)) for (const d of r.decls) if (d.prop === prop) found = d.value;
  if (found === null) throw new Error(`no ${prop} on ${full}`);
  if (prop === "border" || /^border-(top|right|bottom|left)$/.test(prop)) found = splitTop(found.replace(/!important/, ""), " ").find(t => /^(#|rgba?\(|var\()/.test(t));
  return resolveVar(found, globalVars);
}

// ---------- contrast pairs ----------
// each pair: [label, fg, bg (may be rgba), backdrop under bg (opaque) or null, minimum]
function pairs(key, rules) {
  const P = (s, p, fb) => { try { return pick(rules, key, s, p); } catch (e) { if (fb !== undefined) return resolveVar(fb, globalVars); throw e; } }, V = k => resolveVar(`var(${k})`, globalVars);
  const out = [];
  const add = (label, fg, bg, under, min, main) => out.push({ label, fg, bg, under, min, main });
  if (key === "retro") {
    const plate = P(".frame .plate", "background"), panel = P(".frame .panel", "background"), dim = P(".frame .dim", "background");
    for (const w of Object.keys(WORLD)) add(`text (cream) on HUD plate, world ${w}`, P(".frame", "color"), plate, WORLD[w], 4.5, 1);
    add("dim text (stone) on HUD plate, world C9", P(".frame .dimtext", "color"), plate, WORLD.C9, 4.5, 1);
    add("text (cream) on panel", P(".frame", "color"), panel, null, 4.5, 1);
    add("dim text (stone) on panel", P(".frame .dimtext", "color"), panel, null, 4.5, 1);
    add("primary button: ink on marigold", P(".frame .btn.fill", "color"), P(".frame .btn.fill", "background"), null, 4.5, 1);
    add("secondary button: cream on lift", P(".frame .btn", "color"), P(".frame .btn", "background"), null, 4.5, 1);
    for (const w of Object.keys(WORLD)) add(`HUD plate vs world ${w}`, plate, WORLD[w], null, 3, 1);
    add("ghost button text on panel", P(".frame .btn.ghost", "color"), panel, null, 4.5);
    add("menu text on .dim, world C9", P(".frame", "color"), dim, WORLD.C9, 4.5);
    add("menu selection (marigold, 28 px bold) on .dim, world C9", P(".frame > .abs.col:not(.c) > .t28.b:not(.c)", "color"), dim, WORLD.C9, 3);
    add("dim text (stone) on .dim, world C9", P(".frame .dimtext", "color"), dim, WORLD.C9, 4.5);
    add("outline (ghost, field, line chip) on panel", P(".frame .btn.ghost", "border-color"), panel, null, 3);
    add("outline on .dim, world C9 (invite chip, menu name field)", P(".frame > .abs > .chip.line", "border-color", "var(--rt-line)"), dim, WORLD.C9, 3);
    add("map room outline on map", P(".frame .room", "border-color"), P(".frame .map", "background"), null, 3);
    add("you-are-here marker on map", P(".frame .map .you", "background", "#FFFFFF"), P(".frame .map", "background"), null, 3);
    add("spinner arc on night", P(".frame .ring", "border-color", "#FFFFFF"), V("--rt-night"), null, 3);
  }
  if (key === "card") {
    const plate = P(".plate", "background"), panel = P(".panel", "background"), dim = P(".dim", "background");
    for (const w of Object.keys(WORLD)) add(`text (ink) on HUD plate (paper tag), world ${w}`, P(".plate", "color"), plate, WORLD[w], 4.5, 1);
    add("dim text (ink muted) on HUD plate", P(".plate .dimtext", "color"), plate, WORLD.C9, 4.5, 1);
    add("text (ink) on panel", P(".panel", "color"), panel, null, 4.5, 1);
    add("dim text (ink muted) on panel", P(".panel .dimtext", "color"), panel, null, 4.5, 1);
    add("primary button: ink on amber", P(".btn.fill", "color"), P(".btn.fill", "background"), null, 4.5, 1);
    add("secondary button: ink on light paper", P(".btn", "color"), P(".btn", "background"), null, 4.5, 1);
    for (const w of Object.keys(WORLD)) add(`HUD plate edge (ink border) vs world ${w}`, P(".plate", "border"), WORLD[w], null, 3, 1);
    add("ghost button text on panel", P(".panel .btn.ghost", "color"), panel, null, 4.5);
    add("menu text (paper) on .dim, world C9", P(".frame", "color"), dim, WORLD.C9, 4.5);
    add("menu selection (amber, 28 px bold) on .dim, world C9", P(".frame:not(.dark) > .abs.col:not(.panel) > .t28.b", "color"), dim, WORLD.C9, 3);
    add("dim text (paper muted) on .dim, world C9", P(".frame .dimtext", "color"), dim, WORLD.C9, 4.5);
    add("line chip outline on .dim, world C9", P(".chip.line", "border-color"), dim, WORLD.C9, 3);
    add("idle slot label on slot, world 97", P(".slot.dimtext", "color"), P(".slot", "background"), WORLD["97"], 4.5);
    add("map secondary text on map sheet", P(".map .dimtext", "color"), P(".map", "background"), null, 4.5);
    add("you-are-here marker on map", P(".map .you", "background", "var(--k-ink)"), P(".map", "background"), null, 3);
    add("spinner arc on ink", P(".ring", "border-color"), V("--k-ink"), null, 3);
  }
  if (key === "toy") {
    const plate = P(".frame .plate", "background"), panel = P(".frame .panel", "background"), dim = P(".frame .dim", "background");
    for (const w of Object.keys(WORLD)) add(`text (cream) on HUD plate, world ${w}`, P(".frame .plate", "color"), plate, WORLD[w], 4.5, 1);
    add("dim text (lilac) on HUD plate, world C9", V("--toy-lilac"), plate, WORLD.C9, 4.5, 1);
    add("text (plum ink) on cream panel", V("--toy-ink"), panel, null, 4.5, 1);
    add("dim text (muted plum) on cream panel", V("--toy-muted"), panel, null, 4.5, 1);
    add("primary button: ink on yellow", P(".frame .btn.fill", "color"), P(".frame .btn.fill", "background"), null, 4.5, 1);
    add("secondary button: ink on white", P(".frame .btn", "color"), P(".frame .btn", "background"), null, 4.5, 1);
    for (const w of Object.keys(WORLD)) add(`HUD plate vs world ${w}`, plate, WORLD[w], null, 3, 1);
    add("title (yellow) on HUD plate, world C9", V("--toy-yellow"), plate, WORLD.C9, 4.5);
    add("menu text (cream) on .dim, world C9", V("--toy-cream"), dim, WORLD.C9, 4.5);
    add("logo and menu selection (yellow, large) on .dim, world C9", V("--toy-yellow"), dim, WORLD.C9, 3);
    add("dim text (lilac) on .dim, world C9", V("--toy-lilac"), dim, WORLD.C9, 4.5);
    add("NEW sticker: ink on coral", V("--toy-ink"), P(".frame .panel .chip.light.t16", "background"), null, 4.5);
    add("idle slot outline on slot plate, world C9", P(".frame .slot", "border"), plate, WORLD.C9, 3);
    add("map secondary text on lavender board", V("--toy-muted"), P(".frame .map", "background"), null, 4.5);
    add("you-are-here marker outline on map", P(".frame .map .you", "border", "var(--toy-coral-deep)"), P(".frame .map", "background"), null, 3);
    add("ghost text (cream) on night", V("--toy-cream"), V("--toy-night"), null, 4.5);
  }
  return out;
}

let bad = 0;
for (const key of KEYS) {
  const file = path.join(DIR, key + ".css");
  const css = fs.readFileSync(file, "utf8");
  globalVars = {};
  let res;
  try { const pre = parse(css); globalVars = collectVars(pre.rules); res = lint(key, css); }
  catch (e) { console.log(`== ${key}: PARSE ERROR ${e.message}`); bad++; continue; }
  console.log(`\n== ${key}.css: ${res.V.length} violation(s)`);
  res.V.forEach(v => console.log("  VIOLATION " + v));
  res.I.forEach(v => console.log("  info " + v));
  console.log(`  -- contrast (main pairs marked *) --`);
  let ps;
  try { ps = pairs(key, res.rules); } catch (e) { console.log("  PAIR ERROR " + e.message); bad++; continue; }
  for (const p of ps) {
    let bg = col(p.bg); if (p.under) bg = over(bg, col(p.under));
    let fg = col(p.fg); fg = over(fg, bg);
    const r = ratio(fg, bg); const ok = r >= p.min;
    if (!ok) bad++;
    console.log(`  ${p.main ? "*" : " "} ${ok ? "ok  " : "FAIL"} ${r.toFixed(2).padStart(6)} (min ${p.min})  ${p.label}  [${toHex(fg)} on ${toHex(bg)}]`);
  }
  bad += res.V.length;
}
console.log(`\n${bad ? "FAILED: " + bad + " problem(s)" : "ALL CLEAN"}`);
process.exit(bad ? 1 : 0);
