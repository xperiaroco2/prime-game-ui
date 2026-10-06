// Godot-safe CSS lint (spec §10). It generalises pages/styles/check_styles.js, which stays frozen.
//
//   node tools/lint/godot-css.js                       lint every target of tools/lint/targets.json
//   node tools/lint/godot-css.js --self-test           run the fixtures and the built-in adversarial cases
//   node tools/lint/godot-css.js [--profile tokens|skin|motion|generated|layout] [--tokens <css>] [--companion <css>]
//                                [--quiet] <file.css> ...
//
// A file given without --profile takes it from a leading "/* profile: <name> */" comment or from targets.json.
// Output: "<file>:<line>: L<nn> <message>" per violation, an info line per file, then ALL CLEAN or FAILED.
// Exit 0 when clean, 1 on any violation, 2 on a usage error. Node's own modules only.
"use strict";
const fs = require("fs");
const path = require("path");
const R = require("./rules");

const ROOT = path.resolve(__dirname, "..", "..");
const TARGETS = path.join(__dirname, "targets.json");
const FIX = path.join(__dirname, "fixtures");

// ---------- parsing ----------

function lineIndex(src) {
  const starts = [0];
  for (let i = 0; i < src.length; i++) if (src[i] === "\n") starts.push(i + 1);
  return off => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= off) lo = mid; else hi = mid - 1; } return lo + 1; };
}

// Blank comments (keeping newlines, so offsets and lines stay true). Strings are skipped, escapes respected.
function blankComments(src, errors, lineOf) {
  const out = src.split("");
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\\") { i += 2; continue; }
    if (ch === '"' || ch === "'") { i = skipString(src, i, errors, lineOf); continue; }
    if (ch === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i + 2);
      const stop = end < 0 ? src.length : end + 2;
      if (end < 0) errors.push({ line: lineOf(i), rule: "L00", msg: "unterminated comment" });
      for (let j = i; j < stop; j++) if (out[j] !== "\n") out[j] = " ";
      i = stop; continue;
    }
    i++;
  }
  return out.join("");
}

// Returns the index after the closing quote. A raw newline ends a bad string (an error).
function skipString(src, i, errors, lineOf) {
  const q = src[i]; let j = i + 1;
  while (j < src.length) {
    const c = src[j];
    if (c === "\\") { j += 2; continue; }
    if (c === q) return j + 1;
    if (c === "\n") { if (errors) errors.push({ line: lineOf(i), rule: "L00", msg: "unterminated string" }); return j; }
    j++;
  }
  if (errors) errors.push({ line: lineOf(i), rule: "L00", msg: "unterminated string" });
  return j;
}

// Scan from i to the first of the stop characters at depth 0 (outside strings, parens and brackets).
function scanTo(src, i, end, stops) {
  let depth = 0;
  while (i < end) {
    const c = src[i];
    if (c === "\\") { i += 2; continue; }
    if (c === '"' || c === "'") { i = skipString(src, i, null); continue; }
    if (c === "(" || c === "[") depth++;
    else if ((c === ")" || c === "]") && depth > 0) depth--;
    else if (depth === 0 && stops.includes(c)) return i;
    i++;
  }
  return end;
}

// Index of the "}" matching the "{" at i, or -1.
function matchBrace(src, i, end) {
  let depth = 0;
  for (let j = i; j < end; j++) {
    const c = src[j];
    if (c === "\\") { j++; continue; }
    if (c === '"' || c === "'") { j = skipString(src, j, null) - 1; continue; }
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) return j; }
  }
  return -1;
}

const GROUP_AT = new Set(["media", "supports", "container", "layer", "scope", "document", "-moz-document", "starting-style"]);

function parseCss(text) {
  const lineOf = lineIndex(text);
  const errors = [];
  const src = blankComments(text, errors, lineOf);
  const rules = [], atRules = [];

  function parseList(start, end, atStack) {
    let i = start;
    while (i < end) {
      while (i < end && /\s/.test(src[i])) i++;
      if (i >= end) break;
      if (src[i] === "}") { errors.push({ line: lineOf(i), rule: "L00", msg: "unexpected }" }); i++; continue; }
      if (src[i] === ";") { i++; continue; }
      const stop = scanTo(src, i, end, "{;}");
      const prelude = src.slice(i, stop).trim();
      const at = /^@(-?[\w-]+|\\)/.exec(prelude);
      if (at) {
        const name = unescape(at[1]).toLowerCase();
        const rec = { name, prelude: unescape(prelude), line: lineOf(i), atStack };
        atRules.push(rec);
        if (stop >= end || src[stop] === "}") { errors.push({ line: lineOf(i), rule: "L00", msg: "unterminated at-rule " + prelude.slice(0, 40) }); i = stop; continue; }
        if (src[stop] === ";") { i = stop + 1; continue; }
        const close = matchBrace(src, stop, end);
        if (close < 0) { errors.push({ line: lineOf(i), rule: "L00", msg: "unbalanced braces in @" + name }); i = end; continue; }
        if (GROUP_AT.has(name)) parseList(stop + 1, close, atStack.concat([rec]));
        i = close + 1; continue;
      }
      if (stop >= end || src[stop] !== "{") {
        errors.push({ line: lineOf(i), rule: "L00", msg: "text outside a rule: " + prelude.slice(0, 60) });
        i = stop >= end ? end : stop + 1; continue;
      }
      const close = matchBrace(src, stop, end);
      if (close < 0) { errors.push({ line: lineOf(i), rule: "L00", msg: "unbalanced braces after " + prelude.slice(0, 60) }); i = end; continue; }
      rules.push(makeRule(i, stop, close, atStack));
      i = close + 1;
    }
  }

  function makeRule(selStart, open, close, atStack) {
    const selectors = [];
    let j = selStart;
    while (j < open) {
      const k = scanTo(src, j, open, ",");
      const raw = src.slice(j, k);
      const lead = raw.length - raw.trimStart().length;
      if (raw.trim()) selectors.push({ raw: raw.trim(), text: normSelector(raw), line: lineOf(j + lead) });
      else errors.push({ line: lineOf(j), rule: "L00", msg: "empty selector" });
      j = k + 1;
    }
    const decls = [];
    let p = open + 1;
    while (p < close) {
      const k = scanTo(src, p, close, ";{");
      const piece = src.slice(p, k);
      const lead = piece.length - piece.trimStart().length;
      if (k < close && src[k] === "{") {
        const nestedClose = matchBrace(src, k, close + 1);
        errors.push({ line: lineOf(p + lead), rule: "L00", msg: "nested rule " + piece.trim().slice(0, 50) + " (CSS nesting is not allowed)" });
        p = nestedClose < 0 ? close : nestedClose + 1; continue;
      }
      if (piece.trim()) {
        const line = lineOf(p + lead);
        const colon = scanTo(piece, 0, piece.length, ":");
        if (colon >= piece.length) errors.push({ line, rule: "L00", msg: "malformed declaration: " + piece.trim().slice(0, 60) });
        else {
          const rawProp = piece.slice(0, colon).trim();
          let value = piece.slice(colon + 1).trim();
          const imp = /!\s*important\s*$/i.exec(value);
          if (imp) value = value.slice(0, imp.index).trim();
          const propU = unescape(rawProp);
          const custom = propU.startsWith("--");
          decls.push({ prop: custom ? propU : propU.toLowerCase(), rawProp, raw: value, important: !!imp, line,
            value: unescape(value), scan: unescape(emptyStrings(value)) });
        }
      }
      p = k + 1;
    }
    return { selectors, decls, line: lineOf(selStart), atStack };
  }

  parseList(0, src.length, []);
  return { rules, atRules, errors };
}

// Decode CSS escapes. An escape always yields an identifier character, so a decoded non-identifier character
// (":" in ".a\:b") becomes "_" and can never turn into syntax.
function unescape(s) {
  return s.replace(/\\(?:([0-9a-fA-F]{1,6})[ \t\n\r\f]?|(\n)|([\s\S]))/g, (m, hex, nl, ch) => {
    if (nl) return "";
    let c = ch;
    if (hex) { const n = parseInt(hex, 16); c = n === 0 || n > 0x10ffff || (n >= 0xd800 && n <= 0xdfff) ? "\ufffd" : String.fromCodePoint(n); }
    return /[A-Za-z0-9_-]/.test(c) || c.codePointAt(0) > 0x7f ? c : "_";
  });
}

function emptyStrings(s) {
  return s.replace(/"(?:[^"\\\n]|\\[\s\S])*("|$)|'(?:[^'\\\n]|\\[\s\S])*('|$)/g, '""');
}

// Selector text for comparisons: escapes decoded, strings kept, attribute quotes and whitespace normalised.
function normSelector(raw) {
  let s = unescape(raw).replace(/\s+/g, " ").trim();
  s = s.replace(/\[\s*([\w-]+)\s*([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s"']+))\s*([is])?\s*\]/g,
    (m, a, op, d, q, u, f) => `[${a}${op}"${d !== undefined ? d : q !== undefined ? q : u}"${f ? " " + f : ""}]`);
  // Combinators get one space on each side; the ~ of an attribute's ~= is not a combinator.
  return s.replace(/\s*([>+]|~(?!=))\s*/g, " $1 ").replace(/\s+/g, " ").trim();
}

// Compounds of a selector (split at top-level combinators).
function compounds(sel) {
  const out = []; let depth = 0, cur = "";
  for (let i = 0; i < sel.length; i++) {
    const c = sel[i];
    if (c === '"' || c === "'") { const j = skipString(sel, i, null); cur += sel.slice(i, j); i = j - 1; continue; }
    if (c === "(" || c === "[") depth++;
    else if ((c === ")" || c === "]") && depth > 0) depth--;
    if (depth === 0 && (/\s/.test(c) || c === ">" || c === "+" || c === "~")) { if (cur) out.push(cur); cur = ""; continue; }
    cur += c;
  }
  if (cur) out.push(cur);
  return out;
}

function stripSelStrings(sel) { return sel.replace(/"[^"]*"|'[^']*'/g, '""'); }

// L23: a compound that can select a .frame element: the class itself, or a class attribute test that "frame" passes.
function couldBeFrame(compound) {
  if (/\.frame(?![\w-])/.test(stripSelStrings(compound))) return true;
  const re = /\[class([~|^$*]?=)"([^"]*)"(?:\s+([is]))?\]/g;
  let m;
  while ((m = re.exec(compound))) {
    const op = m[1], v = m[3] === "i" ? m[2].toLowerCase() : m[2];
    if (op !== "~=" && v.split(/\s+/).includes("frame")) return true;
    if (op === "~=" || op === "|=") { if (v === "frame") return true; }
    else if (op === "*=") { if (v && "frame".includes(v)) return true; }
    else if (op === "^=") { if (v && "frame".startsWith(v)) return true; }
    else if (op === "$=") { if (v && "frame".endsWith(v)) return true; }
    else if (v === "frame") return true;
  }
  return false;
}

// The simple selectors of a compound, and whether selector q selects every element that selector s selects
// (the same ancestor compounds, and q's last compound a subset of s's).
const simpleCache = new Map();
function simples(compound) {
  if (!simpleCache.has(compound)) simpleCache.set(compound, compound.match(/[.#][\w-]+|\[[^\]]*\]|::?[\w-]+(?:\((?:[^()]|\([^()]*\))*\))?|^[\w*-]+/g) || []);
  return simpleCache.get(compound);
}
function covers(q, s) {
  if (q === s) return true;
  const a = compounds(q), b = compounds(s);
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length - 1; i++) if (a[i] !== b[i]) return false;
  const have = new Set(simples(b[b.length - 1]));
  return simples(a[a.length - 1]).every(x => have.has(x));
}

// The base selector of L13: without :hover, :active, :focus, :focus-visible, :not(…) and .is-*.
function baseSelector(sel) {
  let s = sel, prev;
  do { prev = s; s = s.replace(/:not\((?:[^()]|\([^()]*\))*\)/gi, ""); } while (s !== prev);
  s = s.replace(/:(hover|active|focus-visible|focus)(?![\w-])/gi, "").replace(/\.is-[\w-]+/g, "");
  return s.replace(/\s+/g, " ").trim();
}

// ---------- the lint ----------

const DRAWING = new Set(["background", "background-color", "color", "box-shadow", "text-shadow", "font-size", "font-weight",
  "font-family", "letter-spacing", "line-height", "stroke", "fill", "outline-color", "outline", "transform", "opacity"]);
// The longer logical sides come first, and SIDE_RE is anchored, so border-block-start never reads as border-block.
const BORDER_SIDE = "(block-start|block-end|inline-start|inline-end|top|right|bottom|left|block|inline)";
const BORDER_RE = new RegExp(`^border(-${BORDER_SIDE})?(-(width|style|color))?$`);
const SIDE_RE = new RegExp(`^border-${BORDER_SIDE}(?=-(width|style|color)$|$)`);
const RADIUS_RE = /^border(-(top-left|top-right|bottom-right|bottom-left|start-start|start-end|end-start|end-end))?-radius$/;
const LAYOUT_ALL = /^(padding|margin)(-[a-z-]+)?$|^(width|height|align-self)$/;
const TRANSITION_RE = /^transition(-(property|duration|timing-function|delay))?$/;
// column-gap and row-gap carry a theme constant such as a Button's h_separation (the gap between icon and text), gap a
// box container's separation. The flex properties lay out the parts Godot places by a ratio (an HSlider's grabber, a
// VScrollBar's grabber): flex-grow takes only --value, --page and 1 minus them.
const GENERATED_LAYOUT = new Set(["position", "inset", "top", "right", "bottom", "left", "display", "pointer-events",
  "box-sizing", "min-width", "min-height", "column-gap", "row-gap", "gap", "align-items", "justify-content", "flex-direction",
  "flex", "flex-grow"]);
const FLEX_GROW_RE = /^(?:\d+|var\(--(?:value|page)\)|calc\(1(?: - var\(--(?:value|page)\))+\))$/;
const FORBIDDEN_RE = /^(filter|backdrop-filter|clip-path|mix-blend-mode|background-blend-mode|background-image|mask(-.*)?|animation(-.*)?)$/;
const SIDES = { top: ["t"], right: ["r"], bottom: ["b"], left: ["l"], block: ["t", "b"], inline: ["l", "r"],
  "block-start": ["t"], "block-end": ["b"], "inline-start": ["l"], "inline-end": ["r"] };
const BORDER_STYLES = new Set(["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"]);
const WIDE = new Set(["inherit", "initial", "unset", "revert", "revert-layer"]);

function allowedProperty(prop, profile) {
  if (profile === "tokens") return false;
  if (profile === "layout") return R.LAYOUT_PROPS.has(prop);
  if (DRAWING.has(prop) || BORDER_RE.test(prop) || RADIUS_RE.test(prop) || LAYOUT_ALL.test(prop)) {
    return !/^border-(image|collapse|spacing)/.test(prop);
  }
  if (profile === "motion" || profile === "generated") {
    if (TRANSITION_RE.test(prop) || prop === "cursor") return true;
  }
  if (profile === "generated" && GENERATED_LAYOUT.has(prop)) return true;
  return false;
}

function lintText(text, opts) {
  const V = [];
  const add = (line, rule, msg) => V.push({ line, rule, msg });
  let sheet;
  try { sheet = parseCss(text.replace(/^﻿/, "")); } catch (e) { add(1, "L00", "parser failure: " + e.message); return { V, info: null }; }
  for (const e of sheet.errors) add(e.line, e.rule, e.msg);
  const profile = opts.profile;
  const companion = opts.companionSheet || null;

  // Local custom properties: this file, plus the companion skin for a motion file.
  const local = new Map();
  const addLocal = rs => { for (const r of rs) for (const d of r.decls) if (d.prop.startsWith("--")) { if (!local.has(d.prop)) local.set(d.prop, []); local.get(d.prop).push(d.value.trim()); } };
  addLocal(sheet.rules);
  if (companion) addLocal(companion.rules);
  const tokens = profile === "tokens" ? tokensMap(sheet) : opts.tokens;

  // All alternatives a variable can end as (null when unknown). Cycles and depth are bounded.
  function resolve(name, seen) {
    seen = seen || new Set();
    if (seen.has(name) || seen.size > 20) return [null];
    seen.add(name);
    let vals = null;
    if (name.startsWith("--toy-")) vals = tokens ? tokens.get(name) : null;
    else if (local.has(name)) vals = local.get(name);
    if (!vals) return [null];
    const out = [];
    for (const v of vals) {
      const n = R.varName(v.trim());
      if (n) out.push(...resolve(n, new Set(seen)));
      else out.push(v.trim());
      if (out.length > 32) break;
    }
    return out;
  }
  const ctx = { resolve };

  // Resolve one value component to its literal alternatives.
  const alternatives = comp => { const n = R.varName(comp); return n ? resolve(n) : [comp]; };
  const isColourLiteral = v => v !== null && (R.parseColour(v) !== null || v.toLowerCase() === "currentcolor");

  const textShadowRes = (opts.textShadowSelectors || []).map(s => new RegExp(s));
  let shadows = 0, important = 0, preview = 0;

  // What one border or shadow component is: a style, a colour, a length, or unknown (an undeclared variable).
  function classify(comp) {
    const low = comp.toLowerCase();
    if (BORDER_STYLES.has(low)) return "style";
    if (R.parseColour(comp) || low === "currentcolor") return "colour";
    if (R.varName(comp)) {
      const alts = alternatives(comp).filter(a => a !== null);
      if (alts.length && alts.every(isColourLiteral)) return "colour";
      if (!alts.length && /^--(ctx|tv)-/.test(R.varName(comp)) && !local.has(R.varName(comp))) return "unknown";
      if (!alts.length) return "unknown";
      return "length";
    }
    return "length";
  }

  // The rules this file is read over: the companion skin comes before a motion file.
  const pool = (companion ? companion.rules : []).concat(sheet.rules);
  const hasSel = (r, text) => r.selectors.some(x => x.text === text);

  // ----- at-rules -----
  for (const a of sheet.atRules) {
    const okTokens = profile === "tokens" && a.name === "media" && a.atStack.length === 0 &&
      a.prelude.replace(/^@media/i, "").replace(/\s+/g, "").toLowerCase() === "(prefers-reduced-motion:reduce)";
    if (!okTokens) add(a.line, "L07", "at-rule " + a.prelude.slice(0, 60));
  }

  // ----- rules -----
  for (const rule of sheet.rules) {
    const inMotionMedia = rule.atStack.length === 1 && rule.atStack[0].name === "media";
    for (const s of rule.selectors) {
      const bare = stripSelStrings(s.text);
      if (/::/.test(bare) || /:(before|after|first-letter|first-line)(?![\w-])/i.test(bare)) add(s.line, "L06", "pseudo-element in " + s.raw);
      if (/\[style\*=|:nth-child|\[data-in|:first-child/.test(s.text)) preview++;
      if (!inScope(s.text, profile, inMotionMedia)) add(s.line, "L24", "selector outside the " + profile + " scope: " + s.raw);
    }
    const lastCompounds = rule.selectors.map(s => { const c = compounds(s.text); return c[c.length - 1] || ""; });
    const onFrame = lastCompounds.some(couldBeFrame);
    let hasShadow = null, ownBackgrounds = [];

    for (const d of rule.decls) {
      const { prop, line } = d;
      const val = d.scan.trim();
      if (d.important) { important++; if (profile !== "skin") add(line, "L27", "!important on " + prop); }
      if (!d.raw.trim()) { add(line, "L00", "empty value for " + prop); continue; }
      if (/!/.test(val)) add(line, "L00", "stray ! in the value of " + prop);

      // Value checks that hold for every property and profile.
      let specific = false;
      if (R.GRADIENT_RE.test(val)) { add(line, "L02", "gradient in " + prop); specific = true; }
      if (R.IMAGE_RE.test(val)) { add(line, "L03", "image reference in " + prop); specific = true; }
      if (R.COLOUR_FN_RE.test(R.stripVarNames(val))) { add(line, "L22", "colour function in " + prop + ": " + d.value.slice(0, 60)); specific = true; }
      checkVars(d, val, line);

      if (prop.startsWith("--")) { customProperty(d, val, line, specific); continue; }
      if (profile === "tokens") { add(line, "L28", "the tokens file holds only custom properties, found " + prop); continue; }

      const unprefixed = prop.replace(/^-(webkit|moz|ms|o)-/, "");
      if (FORBIDDEN_RE.test(unprefixed) || (/^transition/.test(unprefixed) && !(profile === "motion" || profile === "generated"))) {
        add(line, "L01", "forbidden property " + prop); continue;
      }
      if (!allowedProperty(prop, profile)) { add(line, "L28", "property outside the " + profile + " allowlist: " + prop); continue; }
      // The layout profile checks its own small value grammar and draws nothing, so the paint checks below never apply.
      if (profile === "layout") { const p = R.checkLayout(prop, val); if (p) add(line, "L28", p); continue; }

      if (prop !== "font-family" && !TRANSITION_RE.test(prop)) {
        const lit = R.literalColours(val);
        if (lit.length) { add(line, "L18", "literal colour " + lit.join(", ") + " in " + prop); specific = true; }
      }
      if (onFrame && /\bvar\(\s*--px\s*\)/i.test(val)) add(line, "L23", "var(--px) length on a .frame selector (cq units skip the frame itself)");
      if (specific) {
        if (prop === "box-shadow" && val.toLowerCase() !== "none") { shadows++; hasShadow = hasShadow || line; }
        if (prop === "background" || prop === "background-color") ownBackgrounds.push(val);
        continue;
      }
      property(rule, d, prop, val, line);
      if (prop === "box-shadow" && val.toLowerCase() !== "none") { shadows++; hasShadow = hasShadow || line; }
      if (prop === "background" || prop === "background-color") ownBackgrounds.push(val);
    }

    // L05 and L14 (currentcolor) on the cascade: this rule over its base-selector and same-selector rules.
    cascadeBorders(rule);

    // L13: a base box-shadow needs an opaque background under it; a background that is not opaque may not sit under
    // a box-shadow that another rule gives the same elements.
    if (hasShadow) checkShadowBackground(rule, hasShadow, ownBackgrounds);
    else if (ownBackgrounds.length && !rule.decls.some(d => d.prop === "box-shadow")) checkClearedShadow(rule, ownBackgrounds);

    // ----- per-declaration helpers (closures over rule state) -----
    function borderColour(comp, line) {
      for (const alt of alternatives(comp)) {
        if (alt === null) continue;
        const c = R.parseColour(alt);
        if (c && c[3] === 0) { add(line, "L14", "transparent border colour " + comp + (alt !== comp ? " (" + alt + ")" : "")); return; }
      }
    }

    function property(rule, d, prop, val, line) {
      const comps = R.splitTop(val, " ");
      const one = () => { if (comps.length !== 1) { add(line, "L28", prop + " takes one value, found " + val); return false; } return true; };
      const colourValue = (allowNone) => {
        if (!one()) return;
        const c = comps[0], low = c.toLowerCase();
        if ((allowNone && low === "none") || WIDE.has(low)) return;
        if (!R.varName(c)) { add(line, "L28", prop + " must be one var(--…) colour, found " + val); return; }
        const k = classify(c);
        if (k === "length") add(line, "L28", prop + " must be a colour, " + c + " is not one");
      };
      const lengths = (min, max, o) => {
        if (comps.length < min || comps.length > max) { add(line, "L28", `${prop} takes ${min}-${max} values, found ${comps.length}`); return; }
        for (const c of comps) { const p = R.checkLength(c, ctx, o); if (p) add(line, p.rule, p.msg); }
      };
      const sideOf = prop.match(SIDE_RE);

      if (prop === "background" || prop === "background-color") return colourValue(prop === "background");
      if (prop === "color" || prop === "outline-color") return colourValue(false);
      if (prop === "stroke" || prop === "fill") return colourValue(true);
      if (prop === "outline") { if (val.toLowerCase() !== "none") add(line, "L04", "outline other than none: " + val); return; }
      if (RADIUS_RE.test(prop)) {
        if (R.splitTop(val, "/").length > 1) { add(line, "L28", "elliptical radius " + val + " (Godot corners are circular)"); return; }
        return lengths(1, prop === "border-radius" ? 4 : 1, { radius: true });
      }
      if (BORDER_RE.test(prop)) {
        const kind = (prop.match(/-(width|style|color)$/) || [])[1];
        if (kind === "style") {
          if (comps.length > 4) add(line, "L28", prop + " takes 1-4 values");
          for (const c of comps) if (!["solid", "none"].includes(c.toLowerCase()) && !WIDE.has(c.toLowerCase())) add(line, "L04", "border style " + c);
          return;
        }
        if (kind === "width") {
          lengths(1, sideOf ? 1 : 4);
          return;
        }
        if (kind === "color") {
          if (sideOf) add(line, "L05", "per-side border colour property " + prop);
          if (comps.length > (sideOf ? 1 : 4)) add(line, "L28", prop + " takes " + (sideOf ? "one value" : "1-4 values"));
          const distinct = new Set(comps);
          if (distinct.size > 1) add(line, "L05", "several border colours in " + prop + ": " + val);
          for (const c of distinct) { if (!R.varName(c) && !WIDE.has(c.toLowerCase())) add(line, "L28", "border colour must be a var(--…), found " + c); borderColour(c, line); }
          return;
        }
        // border / border-<side> shorthand
        if (comps.length === 1 && ["none", "0"].includes(comps[0].toLowerCase())) return;
        let width = null, style = null, colour = null;
        for (const c of comps) {
          const k = classify(c);
          if (k === "style") { if (style !== null) add(line, "L28", "two styles in " + prop); style = c.toLowerCase(); if (!["solid", "none"].includes(style)) add(line, "L04", "border style " + c + " in " + prop); }
          else if (k === "colour") { if (colour !== null) add(line, "L28", "two colours in " + prop); colour = c; borderColour(c, line); }
          else if (k === "unknown") { /* L20 already reported */ }
          else { if (width !== null) add(line, "L28", "two widths in " + prop); width = c; const p = R.checkLength(c, ctx); if (p) add(line, p.rule, p.msg); }
        }
        return;
      }
      if (prop === "box-shadow") return boxShadow(val, line);
      if (prop === "text-shadow") return textShadow(rule, val, line);
      if (prop === "font-size") return lengths(1, 1);
      if (prop === "font-weight") {
        if (!(comps.length === 1 && /^--toy-/.test(R.varName(comps[0]) || ""))) add(line, "L19", "font-weight must be var(--toy-…), found " + val);
        return;
      }
      if (prop === "font-family") return;
      if (prop === "letter-spacing") {
        if (!/^calc\(\s*var\(\s*--toy-[\w-]*-letter-spacing\s*\)\s*\*\s*var\(\s*--px\s*\)\s*\)$/i.test(val)) add(line, "L26", "letter-spacing must be calc(var(--toy-…-letter-spacing) * var(--px)), found " + val);
        return;
      }
      if (prop === "line-height") {
        if (!one()) return;
        const c = comps[0];
        if (R.NUM_RE.test(c) || c.toLowerCase() === "normal" || /^--toy-/.test(R.varName(c) || "")) return;
        const p = R.checkLength(c, ctx) || { rule: "L19", msg: "line-height " + c };
        if (/^calc\(/i.test(c) || R.REL_UNIT_RE.test(c)) add(line, p.rule, p.msg); else add(line, "L19", "line-height must be a number or var(--toy-…), found " + c);
        return;
      }
      if (prop === "opacity") {
        if (!(comps.length === 1 && (R.NUM_RE.test(comps[0]) || /^--toy-/.test(R.varName(comps[0]) || "")))) add(line, "L28", "opacity must be a number or var(--toy-…), found " + val);
        return;
      }
      if (prop === "transform") return transform(val, line);
      if (TRANSITION_RE.test(prop)) return transition(prop, val, line);
      if (prop === "flex-grow") {
        if (!FLEX_GROW_RE.test(val.replace(/\s+/g, " ").replace(/\(\s+/g, "(").replace(/\s+\)/g, ")"))) add(line, "L28", "flex-grow is an int, var(--value), var(--page) or calc(1 - var(--value) [- var(--page)]), found " + val);
        return;
      }
      if (prop === "flex" && !(comps.length === 1 && comps[0].toLowerCase() === "none")) { add(line, "L28", "flex takes only none, found " + val); return; }
      if (["cursor", "display", "position", "pointer-events", "box-sizing", "align-self", "align-items", "justify-content", "flex-direction", "flex"].includes(prop)) {
        if (!(comps.length === 1 && /^[a-z-]+$/i.test(comps[0]))) add(line, "L28", prop + " takes one keyword, found " + val);
        return;
      }
      if (/^(padding|margin)/.test(prop)) return lengths(1, /^(padding|margin)$/.test(prop) ? 4 : /-(block|inline)$/.test(prop) ? 2 : 1);
      if (prop === "inset") return lengths(1, 4);
      if (prop === "column-gap" || prop === "row-gap" || prop === "gap") return lengths(1, 1);
      if (["width", "height", "min-width", "min-height", "top", "right", "bottom", "left"].includes(prop)) {
        const exempt = [];
        if (profile === "generated" && (prop === "width" || prop === "height")) exempt.push("100%");
        if (profile === "generated" && prop === "width" && rule.selectors.every(s => /\.tv-fill$/.test(s.text))) exempt.push("calc(var(--value) * 100%)");
        const c = comps.length === 1 ? comps[0].replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").replace(/\s*\*\s*/g, " * ") : null;
        if (c && exempt.includes(c)) return;
        return lengths(1, 1);
      }
      add(line, "L28", "no value check for " + prop);
    }

    function boxShadow(val, line) {
      if (val.toLowerCase() === "none") return;
      const layers = R.splitTop(val, ",");
      if (layers.length > 1) add(line, "L08", layers.length + " box-shadow layers");
      for (const layer of layers) {
        const comps = R.splitTop(layer, " ");
        const lens = []; let colours = 0, unknowns = 0;
        for (const c of comps) {
          if (c.toLowerCase() === "inset") { add(line, "L09", "inset box-shadow"); continue; }
          const k = classify(c);
          if (k === "colour") colours++;
          else if (k === "style") add(line, "L28", "unexpected " + c + " in box-shadow");
          else if (k === "unknown") unknowns++;
          else lens.push(c);
        }
        if (lens.length > 3) add(line, "L10", "box-shadow with a spread (" + lens.length + " lengths)");
        if (lens.length < 2) add(line, "L28", "box-shadow needs an x and a y offset: " + layer);
        if (lens.length >= 3 && !R.ZERO_RE.test(lens[2])) add(line, "L11", "box-shadow blur " + lens[2]);
        if (lens.length >= 1 && !R.ZERO_RE.test(lens[0])) add(line, "L12", "box-shadow x offset " + lens[0]);
        if (colours > 1 || colours + unknowns === 0) add(line, "L28", "box-shadow needs exactly one colour: " + layer);
        if (lens.length >= 2) { const p = R.checkLength(lens[1], ctx); if (p) add(line, p.rule, p.msg); }
      }
    }

    function textShadow(rule, val, line) {
      if (val.toLowerCase() === "none") return;
      const layers = R.splitTop(val, ",");
      if (layers.length > 1) add(line, "L25", layers.length + " text-shadow layers");
      if (!rule.selectors.every(s => textShadowRes.some(re => re.test(s.text)))) add(line, "L25", "text-shadow on a selector that is not a title selector");
      for (const layer of layers) {
        const comps = R.splitTop(layer, " ");
        const lens = comps.filter(c => { const k = classify(c); return k === "length"; });
        if (lens.length > 3 || lens.length < 2) add(line, "L25", "text-shadow takes x, y and a 0 blur: " + layer);
        if (lens.length >= 3 && !R.ZERO_RE.test(lens[2])) add(line, "L25", "text-shadow blur " + lens[2]);
        lens.slice(0, 2).forEach(c => { const p = R.checkLength(c, ctx); if (p) add(line, p.rule, p.msg); });
        if (comps.length - lens.length !== 1) add(line, "L28", "text-shadow needs exactly one colour: " + layer);
      }
    }

    function transform(val, line) {
      if (val.toLowerCase() === "none") return;
      const comps = R.splitTop(val, " ");
      const f = comps.length === 1 ? R.fnCall(comps[0]) : null;
      if (profile === "skin") {
        if (!(f && f.name === "rotate" && /^\s*[+-]?(\d+\.?\d*|\.\d+)deg\s*$/i.test(f.args))) add(line, "L21", "skin transforms are one rotate(<n>deg), found " + val);
        return;
      }
      if (!(f && f.name === "translatey")) { add(line, "L21", "transforms here are one translateY(calc(… * var(--px))), found " + val); return; }
      const p = R.checkLength(f.args.trim(), ctx);
      if (p) add(line, p.rule, p.msg);
    }

    function transition(prop, val, line) {
      const layers = R.splitTop(val, ",");
      const isTiming = v => v !== null && /^(cubic-bezier|steps)\(|^(linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end)$/i.test(v);
      const isDuration = v => v !== null && /^[+-]?(\d+\.?\d*|\.\d+)m?s$/i.test(v);
      const tokenVar = c => /^--toy-/.test(R.varName(c) || "");
      if (prop === "transition-property") {
        for (const l of layers) if (!["transform", "box-shadow"].includes(l.toLowerCase())) add(line, "L21", "transition of " + l);
        return;
      }
      if (prop !== "transition") {
        for (const l of layers) if (!tokenVar(l)) add(line, "L21", prop + " must be var(--toy-…), found " + l);
        return;
      }
      if (val.toLowerCase() === "none") return;
      for (const l of layers) {
        const comps = R.splitTop(l, " ");
        const [p, ...rest] = comps;
        if (!p || !["transform", "box-shadow"].includes(p.toLowerCase())) { add(line, "L21", "transition must name transform or box-shadow first, found " + l); continue; }
        if (rest.length < 2 || rest.length > 3 || !rest.every(tokenVar)) { add(line, "L21", "transition timing must be var(--toy-…) duration and timing function: " + l); continue; }
        const kinds = rest.map(c => { const alts = alternatives(c).filter(a => a !== null); if (!alts.length) return "?"; if (alts.every(isTiming)) return "t"; if (alts.every(isDuration)) return "d"; return "x"; });
        if (kinds.includes("x") || kinds.filter(k => k === "t").length > 1 || kinds.filter(k => k === "d").length > 2 ||
            (!kinds.includes("?") && (!kinds.includes("t") || !kinds.includes("d")))) add(line, "L21", "transition needs one duration and one timing-function token: " + l);
      }
    }
  }

  function boxSides(comps, keys) {
    if (keys.length !== 4) return keys.map((k, i) => [k, comps[Math.min(i, comps.length - 1)]]);
    const [t, r = t, b = t, l = r] = comps;
    return [["t", t], ["r", r], ["b", b], ["l", l]];
  }

  function checkVars(d, val, line) {
    for (const name of R.varRefs(val)) {
      if (!/^--/.test(name)) { add(line, "L20", "malformed var(" + name + ")"); continue; }
      if (profile === "layout") { if (name !== "--px") add(line, "L20", "layout CSS uses no variable but --px, found " + name); continue; }
      if (name.startsWith("--toy-")) {
        if (!tokens) { if (!opts.tokensMissingReported) { opts.tokensMissingReported = true; add(line, "L20", "tokens file not found (" + (opts.tokensFile ? rel(opts.tokensFile) : "none") + "), var(--toy-…) cannot be checked"); } }
        else if (!tokens.has(name)) add(line, "L20", "unknown token " + name);
        continue;
      }
      if (profile === "tokens") { add(line, "L20", "the tokens file may reference only --toy-* variables, found " + name); continue; }
      if (name.startsWith("--ctx-")) {
        if (profile === "generated") add(line, "L20", name + " is not available in generated CSS (use --tv-*)");
        else if (!local.has(name)) add(line, "L20", name + " is not declared in this file" + (profile === "motion" ? " or its companion" : ""));
        continue;
      }
      if (name.startsWith("--tv-")) {
        if (profile !== "generated") add(line, "L20", name + " belongs to generated CSS");
        else if (!local.has(name)) add(line, "L20", name + " is not declared in this file");
        continue;
      }
      if (["--px", "--zoom", "--value"].includes(name)) continue;
      if (name === "--page" && profile === "generated") continue;
      add(line, "L20", "unknown variable " + name);
    }
  }

  function customProperty(d, val, line, specific) {
    const name = d.prop;
    if (profile === "tokens") {
      if (!/^--toy-[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) { add(line, "L28", "the tokens file declares only --toy-<kebab> variables, found " + name); return; }
      if (specific) return;
      return tokenValue(name, d, line);
    }
    const ok = (profile === "skin" && (name === "--px" || name.startsWith("--ctx-"))) || (profile === "generated" && name.startsWith("--tv-"));
    if (!ok) { add(line, "L28", "custom property " + name + " may not be declared in " + profile + " CSS"); return; }
    const lit = R.literalColours(val);
    if (lit.length) { add(line, "L18", "literal colour " + lit.join(", ") + " in " + name); return; }
    if (specific) return;
    if (name === "--px") {
      if (!/^[\w\s.()*/+-]*$/.test(R.stripVarNames(val)) || R.varRefs(val).some(n => n !== "--zoom")) add(line, "L28", "--px must be a plain scale such as calc(1cqw / 19.2), found " + val);
      return;
    }
    const n = R.varName(val);
    if (n && (/^--toy-/.test(n) || (name.startsWith("--ctx-") && /^--ctx-/.test(n)) || (name.startsWith("--tv-") && /^--tv-/.test(n)))) return;
    if (name.startsWith("--tv-") && R.INT_RE.test(val)) return;
    if (name.startsWith("--tv-") && R.NUM_RE.test(val)) { add(line, "L17", name + " must be an int, found " + val); return; }
    add(line, "L28", name + " must be one var(--toy-…)" + (name.startsWith("--tv-") ? " or an int" : "") + ", found " + val);
  }

  function tokenValue(name, d, line) {
    const v = d.value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(v)) return;
    const rgba = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/.exec(v);
    if (rgba) { if ([1, 2, 3].some(i => +rgba[i] > 255)) add(line, "L28", "rgba channel above 255 in " + name); return; }
    if (/^var\(\s*--toy-[\w-]+\s*\)$/.test(v)) return;
    if (R.INT_RE.test(v)) return;
    if (R.NUM_RE.test(v)) { if (!/-line-height(-|$)/.test(name)) add(line, "L17", name + " is " + v + ": token dimensions are ints"); return; }
    if (/^\d+ms$/.test(v)) return;
    if (/^cubic-bezier\(\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,\s*-?[\d.]+\s*\)$/i.test(v)) return;
    if (/^("[^"\\]*"|'[^'\\]*')(\s*,\s*("[^"\\]*"|'[^'\\]*'|[a-z-]+))*$/.test(v)) return;
    if (R.REL_UNIT_RE.test(v)) { add(line, "L16", name + " has a relative unit: " + v); return; }
    if (/^[+-]?[\d.]+[a-z]+$/i.test(v) || /^calc\(/i.test(v)) { add(line, "L17", name + " is " + v + ": token dimensions are unitless ints"); return; }
    add(line, "L28", name + ": value form outside spec §8: " + v);
  }

  function inScope(sel, prof, inMedia) {
    if (prof === "tokens") {
      if (inMedia) return sel === ':root:not([data-motion="default"])';
      return sel === ":root" || sel === ':root[data-text-size="large"]' || sel === ':root[data-motion="reduced"]';
    }
    if (prof === "skin" || prof === "motion") return /^body\[data-style="toy"\](?![\w-])/.test(sel);
    const c = compounds(sel);
    // layout: the last compound is a container class (.gd-*), a node ([data-node="…"]) or its anchor box ([data-anchor="…"]).
    if (prof === "layout") return c.length > 0 && /^(\.gd-|\[data-node="|\[data-anchor=")/.test(c[c.length - 1]);
    return c.length > 0 && /^\.tv-/.test(c[c.length - 1]);
  }

  // ----- the cascade view of L05, L13 and L14 -----
  // A rule is read over the rules of its base selector (any order: its states outrank them) and the earlier rules
  // with the same selector, in source order.

  function earlierRules(rule, sel) {
    const base = baseSelector(sel), out = [];
    if (base !== sel) for (const r of pool) if (r !== rule && hasSel(r, base)) out.push(r);
    for (const r of pool) { if (r === rule) break; if (hasSel(r, sel) && !out.includes(r)) out.push(r); }
    return out;
  }

  // The border of one element after a list of declarations: per side the style, width and colour as written, and
  // the color. A shorthand resets all three; a CSS-wide keyword makes the side unknown.
  function borderState(decls) {
    const st = { t: {}, r: {}, b: {}, l: {}, color: undefined };
    for (const d of decls) {
      const comps = R.splitTop(d.scan.trim(), " ");
      if (d.prop === "color") { st.color = comps.length === 1 && !WIDE.has(comps[0].toLowerCase()) ? comps[0] : undefined; continue; }
      if (!BORDER_RE.test(d.prop)) continue;
      const sideOf = d.prop.match(SIDE_RE), keys = sideOf ? SIDES[sideOf[1]] : ["t", "r", "b", "l"];
      if (comps.some(c => WIDE.has(c.toLowerCase()))) { for (const k of keys) st[k] = {}; continue; }
      const kind = (d.prop.match(/-(width|style|color)$/) || [])[1];
      if (kind) {
        const field = kind === "color" ? "colour" : kind;
        for (const [k, c] of boxSides(comps, keys)) st[k][field] = kind === "style" ? c.toLowerCase() : c;
        continue;
      }
      let width = "medium", style = "none", colour = "currentcolor";
      for (const c of comps) {
        const k = classify(c);
        if (k === "style") style = c.toLowerCase(); else if (k === "colour") colour = c; else if (k === "length") width = c;
      }
      for (const k of keys) st[k] = { style, width, colour };
    }
    return st;
  }

  // Two colours are the same when they resolve to the same literal (L05 compares colours, not token names).
  function colourKey(c) {
    const alts = alternatives(c);
    if (alts.length && alts.every(a => a !== null && R.parseColour(a))) return [...new Set(alts.map(a => R.parseColour(a).join(",")))].sort().join(" | ");
    return c.toLowerCase();
  }

  // The problems of a border state: L05 (two colours on the visible sides) and L14 (a visible side in currentcolor
  // whose color is transparent). A side is visible unless its style is none or hidden or its width is 0. A side with a
  // style but no colour draws in currentcolor; a side with neither is left out (its style may come from elsewhere).
  function borderProblems(st) {
    const out = new Map(), cols = new Map();
    for (const k of ["t", "r", "b", "l"]) {
      const sd = st[k];
      if (sd.style === "none" || sd.style === "hidden" || (sd.width !== undefined && R.ZERO_RE.test(sd.width))) continue;
      let c = sd.colour;
      if (c === undefined) { if (sd.style === undefined) continue; c = "currentcolor"; }
      let written = c;
      if (c.toLowerCase() === "currentcolor" && st.color !== undefined) {
        written = "currentcolor (color " + st.color + ")";
        c = st.color;
        const clear = alternatives(c).some(a => { const p = a !== null && R.parseColour(a); return !!p && p[3] === 0; });
        if (clear) out.set("L14", "transparent border colour " + written);
      }
      const key = colourKey(c);
      if (!cols.has(key)) cols.set(key, written);
    }
    if (cols.size > 1) out.set("L05", "different border colours per side: " + [...cols.values()].join(" / "));
    return out;
  }

  // Reports a problem where it begins: in this rule alone, or when this rule joins the earlier ones.
  function cascadeBorders(rule) {
    const own = borderProblems(borderState(rule.decls)), done = new Set();
    for (const [id, msg] of own) { done.add(id + msg); add(rule.line, id, msg); }
    for (const s of rule.selectors) {
      const prev = earlierRules(rule, s.text).flatMap(r => r.decls);
      if (!prev.length) continue;
      const before = borderProblems(borderState(prev));
      for (const [id, msg] of borderProblems(borderState(prev.concat(rule.decls)))) {
        if (before.has(id) || own.has(id) || done.has(id + msg)) continue;
        done.add(id + msg);
        add(rule.line, id, msg + " (this rule over the earlier rules for " + baseSelector(s.raw) + ")");
      }
    }
  }

  // L13 from the other side: this rule's background is not opaque, and a rule whose selector covers this one gives
  // the same elements a box-shadow that no rule in between turns off.
  function checkClearedShadow(rule, bgs) {
    if (!tokens && bgs.some(b => R.varName(b) && /^--toy-/.test(R.varName(b)))) return; // reported by L20
    const notOpaque = bgs.map(b => [b, alternatives(b).find(a => { if (a === null) return false; const c = R.parseColour(a); return !c || c[3] !== 1; })]).find(x => x[1] !== undefined);
    if (!notOpaque) return;
    const isShadow = d => d.prop === "box-shadow" && d.scan.trim().toLowerCase() !== "none";
    const isNone = d => d.prop === "box-shadow" && d.scan.trim().toLowerCase() === "none";
    for (const s of rule.selectors) {
      for (const q of pool) {
        if (q === rule || !q.decls.some(isShadow)) continue;
        const qs = q.selectors.find(x => covers(x.text, s.text));
        if (!qs) continue;
        const off = pool.some(p => p !== q && p.decls.some(isNone) && p.selectors.some(x => covers(x.text, s.text) && covers(qs.text, x.text) &&
          (x.text !== qs.text || pool.indexOf(p) > pool.indexOf(q))));
        if (off) continue;
        add(rule.line, "L13", "background that is not opaque (" + notOpaque[0] + " = " + notOpaque[1] + ") under the box-shadow of " + qs.raw);
        return;
      }
    }
  }

  function checkShadowBackground(rule, line, own) {
    const pool = sheet.rules.concat(companion ? companion.rules : []);
    for (const s of rule.selectors) {
      let bgs = own;
      if (!bgs.length) {
        const base = baseSelector(s.text);
        bgs = [];
        for (const r of pool) if (r.selectors.some(x => x.text === base)) for (const d of r.decls) if (d.prop === "background" || d.prop === "background-color") bgs.push(d.scan.trim());
        if (!bgs.length) { add(line, "L13", "box-shadow but no background on the base selector " + base); continue; }
      }
      if (!tokens && bgs.some(b => R.varName(b) && /^--toy-/.test(R.varName(b)))) continue; // reported by L20
      for (const b of bgs) {
        const alts = alternatives(b);
        const bad = alts.find(a => { if (a === null) return false; const c = R.parseColour(a); return !c || c[3] !== 1; });
        if (bad !== undefined) { add(line, "L13", "box-shadow over a background that is not opaque: " + b + " = " + bad); break; }
      }
    }
  }

  V.sort((a, b) => a.line - b.line || a.rule.localeCompare(b.rule));
  return { V, info: { rules: sheet.rules.length, shadows, important, preview } };
}

function tokensMap(sheet) {
  const m = new Map();
  for (const r of sheet.rules) for (const d of r.decls) if (d.prop.startsWith("--toy-")) { if (!m.has(d.prop)) m.set(d.prop, []); m.get(d.prop).push(d.value.trim()); }
  return m;
}

function loadTokens(file) {
  if (!file || !fs.existsSync(file)) return null;
  return tokensMap(parseCss(fs.readFileSync(file, "utf8")));
}

function header(text) {
  const m = /^\s*\/\*([\s\S]*?)\*\//.exec(text);
  const out = {};
  if (!m) return out;
  for (const part of m[1].split(";")) { const kv = /^\s*(profile|expect|companion)\s*:\s*(\S+)\s*$/.exec(part); if (kv) out[kv[1]] = kv[2]; }
  return out;
}

function lintFile(file, o) {
  const text = fs.readFileSync(file, "utf8");
  let companionSheet = null;
  if (o.companion) {
    if (fs.existsSync(o.companion)) companionSheet = parseCss(fs.readFileSync(o.companion, "utf8"));
    else return { V: [{ line: 1, rule: "L00", msg: "companion file not found: " + o.companion }], info: null };
  }
  return lintText(text, Object.assign({}, o, { companionSheet }));
}

const rel = f => path.relative(process.cwd(), f).split(path.sep).join("/") || f;

function report(file, profile, res, quiet) {
  for (const v of res.V) console.log(`${rel(file)}:${v.line}: ${v.rule} ${v.msg}`);
  if (res.info && !quiet) console.log(`${rel(file)}: info profile ${profile}; rules ${res.info.rules}; box-shadow ${res.info.shadows}; !important ${res.info.important}; preview-only selectors ([style*=], :nth-child, [data-in], :first-child) ${res.info.preview}`);
  return res.V.length;
}

// ---------- self-test ----------

const ADVERSARIAL = [
  ["skin", 'body[data-style="toy"] .a { \\66 ilter: blur(2px); }', ["L01"]],
  ["skin", 'body[data-style="toy"] .a { FILTER: none; }', ["L01"]],
  ["skin", 'body[data-style="toy"] .a { -webkit-mask-image: none; }', ["L01"]],
  ["skin", 'body[data-style="toy"] .a { background: var(--toy-palette-cream) U\\72 L(x.png); }', ["L03"]],
  ["skin", 'body[data-style="toy"] .a { background: Linear-Gradient(var(--toy-palette-ink), var(--toy-palette-cream)); }', ["L02"]],
  ["skin", 'body[data-style="toy"] .a { & .b { color: var(--toy-palette-ink); } }', ["L00"]],
  ["skin", 'body[data-style="toy"] .a { color: var(--toy-palette-ink) ', ["L00"]],
  ["skin", 'color: red; body[data-style="toy"] .a { color: var(--toy-palette-ink); }', ["L00"]],
  ["skin", 'body[data-style="toy"] .a, .b { color: var(--toy-palette-ink); }', ["L24"]],
  ["skin", 'body[data-style="toy"] .a:is(::BEFORE) { color: var(--toy-palette-ink); }', ["L06"]],
  ["skin", 'body[data-style="toy"] .a\\:\\:before { color: var(--toy-palette-ink); }', []],
  ["skin", 'body[data-style="toy"] .a { color: var(--toy-palette-ink, #fff); }', ["L18"]],
  ["skin", 'body[data-style="toy"] .a { color: currentColor; }', ["L18"]],
  ["skin", 'body[data-style="toy"] .a { border-color: TRANSPARENT; }', ["L18"]],
  ["skin", 'body[data-style="toy"] .a { padding: calc(var(--toy-stroke-control) / 2 * var(--px)); }', ["L17"]],
  ["skin", 'body[data-style="toy"] .a { padding: calc(var(--toy-stroke-control) * var(--px) + 1px); }', ["L19"]],
  ["skin", 'body[data-style="toy"] .a { padding: calc(var(--toy-palette-ink) * var(--px)); }', ["L19"]],
  ["skin", 'body[data-style="toy"] .a { padding: calc(5 * var(--px)); }', ["L19"]],
  ["skin", 'body[data-style="toy"] .a { padding: calc((var(--toy-stroke-control) + 0.5) * var(--px)); }', ["L17"]],
  ["skin", 'body[data-style="toy"] .a { padding: calc(var(--toy-font-line-height-base) * var(--px)); }', ["L17"]],
  ["skin", 'body[data-style="toy"] .a { font-size: max(calc(var(--toy-font-size-body) * var(--px)), 1px); }', ["L19"]],
  ["skin", 'body[data-style="toy"] .a { font-weight: bold; }', ["L19"]],
  ["skin", 'body[data-style="toy"] .a { border-radius: calc(var(--toy-radius-control) * var(--px)) / calc(var(--toy-radius-control) * var(--px)); }', ["L28"]],
  ["skin", 'body[data-style="toy"] .a { transform: rotate(80deg) scale(2); }', ["L21"]],
  ["skin", 'body[data-style="toy"] .a { translate: 0 1px; }', ["L28"]],
  ["skin", 'body[data-style="toy"] .a { outline: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-ink); }', ["L04"]],
  ["skin", 'body[data-style="toy"] .a { border: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-ink); border-bottom: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-yellow); }', ["L05"]],
  ["skin", 'body[data-style="toy"] .a { border: 0; border-bottom: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-yellow); }', []],
  ["skin", 'body[data-style="toy"] .a { border-inline-start-color: var(--toy-palette-ink); }', ["L05"]],
  ["skin", 'body[data-style="toy"] .a { background: var(--toy-palette-cream); box-shadow: 0 calc(var(--toy-stroke-control) * var(--px)) var(--toy-palette-ink) INSET; }', ["L09"]],
  ["skin", 'body[data-style="toy"] .a { background: var(--toy-palette-plate); box-shadow: 0 calc(var(--toy-stroke-control) * var(--px)) 0 var(--toy-palette-ink); }', ["L13"]],
  ["skin", 'body[data-style="toy"] .a { --ctx-z: var(--toy-palette-ink); background: var(--toy-palette-cream); box-shadow: 0 var(--ctx-z) 0 var(--toy-palette-ink); }', ["L28"]],
  ["skin", 'body[data-style="toy"] .a { --toy-palette-ink: #000; }', ["L28"]],
  ["skin", 'body[data-style="toy"] .a { --ctx-a: 0 0 3px red; }', ["L18"]],
  ["skin", 'body[data-style="toy"] .a { z-index: 2; }', ["L28"]],
  ["skin", 'body[data-style="toy"] .a { color: var(--Toy-palette-ink); }', ["L20"]],
  ["skin", 'body[data-style="toy"] .a { color: var(--toy-palette-ink) ! IMPORTANT; }', []],
  ["motion", 'body[data-style="toy"] .a { transition: all var(--toy-duration-press) var(--toy-ease-press); }', ["L21"]],
  ["motion", 'body[data-style="toy"] .a { transition: transform 70ms ease-out; }', ["L21"]],
  ["motion", 'body[data-style="toy"] .a { color: var(--toy-palette-ink) !important; }', ["L27"]],
  ["generated", '.tv-a { --tv-x: 1.5; }', ["L17"]],
  ["generated", '.tv-a > div { color: var(--toy-palette-ink); }', ["L24"]],
  ["generated", '.tv-a { width: 100%; height: calc(var(--value) * 100%); }', ["L16"]],
  ["generated", '.tv-a .tv-fill { width: calc(var(--value) * 100%); }', []],
  ["tokens", ':root { --toy-a: 2.5; --toy-b: 3px; --toy-c: red; --toy-d: hsl(0 0% 0%); }', ["L17", "L28", "L22"]],
  ["tokens", '@media screen and (prefers-reduced-motion: reduce) { :root:not([data-motion="default"]) { --toy-a: 0ms; } }', ["L07"]],
  ["tokens", '@media (prefers-reduced-motion:reduce) { :root { --toy-a: 0ms; } }', ["L24"]],
  ["tokens", ':root { color: #000; --toy-a: 1 !important; }', ["L28", "L27"]],
  // Logical sides map to one side each.
  ["skin", 'body[data-style="toy"] .a { border-block-start: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-ink); border-block-end: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-coral); }', ["L05"]],
  ["skin", 'body[data-style="toy"] .a { border: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-ink); border-bottom: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-coral); border-block-start-width: 0; }', ["L05"]],
  ["skin", 'body[data-style="toy"] .a { border: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-ink); border-left: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-coral); border-inline-end: 0; }', ["L05"]],
  // A styled side with no colour draws in currentcolor.
  ["skin", 'body[data-style="toy"] .a { color: var(--toy-palette-ink); border-style: solid; border-width: calc(var(--toy-stroke-control) * var(--px)); border-top: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-coral); }', ["L05"]],
  ["skin", 'body[data-style="toy"] .a { color: var(--toy-palette-clear); border: calc(var(--toy-stroke-control) * var(--px)) solid; }', ["L14"]],
  // The cascade: same-selector rules, and a state rule over its base.
  ["skin", 'body[data-style="toy"] .a { border-top: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-ink); } body[data-style="toy"] .a { border-bottom: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-coral); }', ["L05"]],
  ["skin", 'body[data-style="toy"] .a { border: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-ink); } body[data-style="toy"] .a:hover { border-bottom: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-coral); }', ["L05"]],
  ["skin", 'body[data-style="toy"] .a { background: var(--toy-palette-yellow); box-shadow: 0 calc(var(--toy-button-primary-press-depth) * var(--px)) 0 var(--toy-palette-ink); } body[data-style="toy"] .a { background: var(--toy-palette-clear); }', ["L13"]],
  ["skin", 'body[data-style="toy"] .a { background: var(--toy-palette-yellow); box-shadow: 0 calc(var(--toy-button-primary-press-depth) * var(--px)) 0 var(--toy-palette-ink); } body[data-style="toy"] .a.b { background: var(--toy-palette-clear); }', ["L13"]],
  ["skin", 'body[data-style="toy"] .a { background: var(--toy-palette-yellow); box-shadow: 0 calc(var(--toy-button-primary-press-depth) * var(--px)) 0 var(--toy-palette-ink); } body[data-style="toy"] .a.b { background: var(--toy-palette-clear); box-shadow: none; }', []],
  // L05 compares colours, not token names.
  ["skin", 'body[data-style="toy"] .a { border-top: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-palette-ink); border-bottom: calc(var(--toy-stroke-control) * var(--px)) solid var(--toy-color-outline); }', []],
  ["tokens", ':root[data-text-size="huge"] { --toy-a: 1; }', ["L24"]],
  ["skin", 'body[data-style="toy"] [class~="frame"] { padding: calc(var(--toy-stroke-control) * var(--px)); }', ["L23"]],
  ["skin", 'body[data-style="toy"] .frame .t28-foo { text-shadow: 0 calc(var(--toy-button-primary-press-depth) * var(--px)) 0 var(--toy-palette-ink); }', ["L25"]],
  // A theme constant as a gap in generated CSS (ToyMenuItem's h_separation), tokens times var(--px) only.
  ["generated", '.tv-a { column-gap: calc(var(--toy-stroke-control) * var(--px)); }', []],
  ["generated", '.tv-a { column-gap: 12px; }', ["L19"]],
  // A box variation's separation as a gap; the ratio layouts of a slider and a scroll bar.
  ["generated", '.tv-a { gap: calc(var(--toy-stroke-control) * var(--px)); display: flex; align-items: center; justify-content: flex-end; flex-direction: column; }', []],
  ["generated", '.tv-a > .tv-b { flex: none; flex-grow: var(--value); } .tv-a > .tv-c { flex-grow: calc(1 - var(--value) - var(--page)); }', []],
  ["generated", '.tv-a { flex-grow: 0.5; }', ["L28"]],
  ["generated", '.tv-a { flex-grow: var(--x); }', ["L20", "L28"]],
  ["generated", '.tv-a { flex: 1 1 0; }', ["L28"]],
  ["generated", '.tv-a { gap: 8px; }', ["L19"]],
  ["skin", 'body[data-style="toy"] .a { gap: calc(var(--toy-stroke-control) * var(--px)); }', ["L28"]],
  ["skin", 'body[data-style="toy"] .a { width: calc(var(--page) * 1px); }', ["L20", "L19"]],
  ["skin", 'body[data-style="toy"] .a { column-gap: calc(var(--toy-stroke-control) * var(--px)); }', ["L28"]],
  // The layout profile (pages/screens/screens-layout.css): layout only, its own value grammar, its own scope.
  ["layout", '.gd-VBoxContainer { display: grid; row-gap: calc(12 * var(--px)); grid-template-rows: auto 2fr auto; }', []],
  ["layout", '[data-anchor="s2/menu"] { left: calc(50% - 160 * var(--px)); top: 0; justify-content: center; }', []],
  ["layout", '[data-node="s2/menu"] { min-width: max(100%, calc(600 * var(--px))); flex: none; }', []],
  ["layout", '.gd-Label { color: var(--toy-palette-ink); }', ["L20", "L28"]],
  ["layout", '.gd-Label { border: 0; }', ["L28"]],
  ["layout", '.gd-Label { row-gap: 2em; }', ["L28"]],
  ["layout", '.gd-Label { min-width: calc(var(--toy-stroke-control) * var(--px)); }', ["L20", "L28"]],
  ["layout", '.tv-ToyPanelMenu { display: grid; }', ["L24"]],
  ["layout", '.gd-Label { --gd-x: 1; }', ["L28"]],
  ["layout", '.gd-Label { display: grid !important; }', ["L27"]],
  ["layout", '.gd-Label { grid-template-columns: repeat(2, 1fr); }', ["L28"]],
  ["layout", '.gd-Label::after { display: block; }', ["L06"]],
  // A ScrollContainer's view scrolls vertically with its native bar hidden; nothing else scrolls.
  ["layout", '.gd-scroll-view { overflow-x: hidden; overflow-y: auto; scrollbar-width: none; grid-template-rows: 0; }', []],
  ["layout", '.gd-scroll-view { overflow-x: auto; }', ["L28"]],
  ["layout", '.gd-scroll-view { overflow: auto; scrollbar-width: thin; }', ["L28"]],
];

function selfTest() {
  const tokensFile = path.join(FIX, "fixture-tokens.css");
  const tokens = loadTokens(tokensFile);
  const targets = JSON.parse(fs.readFileSync(TARGETS, "utf8"));
  const tss = targets.textShadowSelectors;
  let bad = 0;
  const line = (ok, name, detail) => { if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? "  " + detail : ""}`); };
  const fired = res => [...new Set(res.V.map(v => v.rule))].sort();

  const fixtureTokens = lintText(fs.readFileSync(tokensFile, "utf8"), { profile: "tokens", textShadowSelectors: tss });
  line(fixtureTokens.V.length === 0, "fixture-tokens.css (tokens)", fixtureTokens.V.map(v => v.line + ":" + v.rule + " " + v.msg).join("; "));

  const goodDir = path.join(FIX, "good"), badDir = path.join(FIX, "bad");
  const goods = fs.readdirSync(goodDir).filter(f => f.endsWith(".css")).sort();
  for (const want of ["tokens.css", "skin.css", "motion.css", "generated.css", "layout.css"]) if (!goods.includes(want)) line(false, "good/" + want, "missing");
  for (const f of goods) {
    const file = path.join(goodDir, f), h = header(fs.readFileSync(file, "utf8"));
    const res = lintFile(file, { profile: h.profile, tokens, tokensFile, textShadowSelectors: tss, companion: h.companion && path.join(goodDir, h.companion) });
    line(R.PROFILES.includes(h.profile) && res.V.length === 0, `good/${f} (${h.profile})`, res.V.map(v => v.line + ":" + v.rule + " " + v.msg).join("; "));
  }
  const bads = fs.readdirSync(badDir).filter(f => f.endsWith(".css")).sort();
  const covered = new Set();
  for (const f of bads) {
    const file = path.join(badDir, f), h = header(fs.readFileSync(file, "utf8"));
    const res = lintFile(file, { profile: h.profile, tokens, tokensFile, textShadowSelectors: tss, companion: h.companion && path.join(badDir, h.companion) });
    const got = fired(res);
    const ok = R.PROFILES.includes(h.profile) && f.startsWith(h.expect + "-") && got.length === 1 && got[0] === h.expect;
    if (ok) covered.add(h.expect);
    line(ok, `bad/${f} (${h.profile})`, `expect ${h.expect}, fired ${got.join(",") || "nothing"}` + (ok ? "" : "  " + res.V.map(v => v.line + ":" + v.rule + " " + v.msg).join("; ")));
  }
  for (const id of Object.keys(R.RULES)) if (id !== "L00" && !covered.has(id)) line(false, "coverage " + id, "no passing bad fixture");

  ADVERSARIAL.forEach(([profile, css, want], i) => {
    const res = lintText(css, { profile, tokens, tokensFile, textShadowSelectors: tss });
    const got = fired(res), exp = [...want].sort();
    line(got.join() === exp.join(), `case ${String(i + 1).padStart(2, "0")} (${profile})`, `expect ${exp.join(",") || "clean"}, fired ${got.join(",") || "nothing"}` + (got.join() === exp.join() ? "" : "  " + css.slice(0, 70)));
  });
  console.log(bad ? `FAILED: ${bad} self-test mismatch(es)` : "ALL CLEAN");
  return bad ? 1 : 0;
}

// ---------- command line ----------

function main(argv) {
  if (argv.includes("--self-test")) return selfTest();
  const o = { files: [], quiet: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--profile" || a === "--tokens" || a === "--companion") {
      if (i + 1 >= argv.length) { console.error("missing value for " + a); return 2; }
      o[a.slice(2)] = argv[++i];
    } else if (a === "--quiet") o.quiet = true;
    else if (a.startsWith("--")) { console.error("unknown option " + a); return 2; }
    else o.files.push(a);
  }
  if (o.profile && !R.PROFILES.includes(o.profile)) { console.error("unknown profile " + o.profile + " (" + R.PROFILES.join(", ") + ")"); return 2; }
  let targets;
  try { targets = JSON.parse(fs.readFileSync(TARGETS, "utf8")); } catch (e) { console.error("cannot read " + TARGETS + ": " + e.message); return 2; }
  const tss = targets.textShadowSelectors || [];
  const tokensFile = o.tokens ? path.resolve(o.tokens) : path.join(ROOT, targets.tokens);
  const tokens = loadTokens(tokensFile);
  const jobs = [];
  if (o.files.length) {
    for (const f of o.files) {
      const abs = path.resolve(f);
      const t = targets.targets.find(x => path.join(ROOT, x.file) === abs);
      let profile = o.profile;
      const h = fs.existsSync(abs) ? header(fs.readFileSync(abs, "utf8")) : {};
      if (!profile) profile = h.profile;
      if (!profile && t) profile = t.profile;
      if (!R.PROFILES.includes(profile)) { console.error(`${rel(abs)}: no profile (pass --profile ${R.PROFILES.join("|")})`); return 2; }
      // The companion: --companion, else the targets.json entry, else the file's own header (relative to the file).
      const companion = o.companion ? path.resolve(o.companion) : t && t.companion && profile === t.profile ? path.join(ROOT, t.companion)
        : h.companion ? path.resolve(path.dirname(abs), h.companion) : null;
      jobs.push({ file: abs, profile, companion, extra: t && t.profile === profile ? t.tokens : null });
    }
  } else {
    for (const t of targets.targets) jobs.push({ file: path.join(ROOT, t.file), profile: t.profile, companion: t.companion ? path.join(ROOT, t.companion) : null, extra: t.tokens });
  }
  let total = 0;
  for (const j of jobs) {
    if (!fs.existsSync(j.file)) { console.log(`${rel(j.file)}:1: L00 file not found`); total++; continue; }
    let res;
    // A target's own "tokens" files (generated option values, pages/choices) add to the tokens file for that target only.
    const own = tokens && j.extra && j.extra.length ? new Map([...tokens, ...j.extra.flatMap(x => [...(loadTokens(path.join(ROOT, x)) || new Map())])]) : tokens;
    try { res = lintFile(j.file, { profile: j.profile, tokens: own, tokensFile, textShadowSelectors: tss, companion: j.companion }); }
    catch (e) { res = { V: [{ line: 1, rule: "L00", msg: "internal error: " + e.message }], info: null }; }
    total += report(j.file, j.profile, res, o.quiet);
  }
  console.log(total ? `FAILED: ${total} violation(s)` : "ALL CLEAN");
  return total ? 1 : 0;
}

module.exports = { parseCss, lintText, loadTokens, normSelector, baseSelector };

if (require.main === module) {
  let code;
  try { code = main(process.argv.slice(2)); } catch (e) { console.log("L00 internal error: " + (e && e.stack || e)); code = 1; }
  process.exitCode = code;
}
