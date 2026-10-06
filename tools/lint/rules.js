// Godot-safe CSS rules (spec §10.2): the rule texts, the profile allowlists and the checks.
// The parser and the command line are in godot-css.js. Node's own modules only.
"use strict";

const RULES = {
  L00: "the file parses: balanced braces and strings, no nested rules, no declarations outside a rule",
  L01: "forbidden property (filter, clip-path, blend modes, background-image, mask*, animation*; transition* outside motion and generated)",
  L02: "no *-gradient()",
  L03: "no url() and no other image reference",
  L04: "border and outline styles are solid or none; outline only none",
  L05: "one border colour per element",
  L06: "no pseudo-elements",
  L07: "no at-rules (tokens: only @media (prefers-reduced-motion: reduce))",
  L08: "box-shadow: one layer",
  L09: "box-shadow: no inset",
  L10: "box-shadow: no spread (at most three lengths)",
  L11: "box-shadow: blur 0",
  L12: "box-shadow: x offset 0",
  L13: "box-shadow only on a rule whose base selector declares an opaque background",
  L14: "no transparent or alpha-0 border colour",
  L15: "no % radius",
  L16: "no em, rem, %, viewport or container units in lengths",
  L17: "ints only: integer literals in length calc(), the only literal multiplier is -1; token dimensions are ints",
  L18: "no literal colour outside the tokens file",
  L19: "every length is 0, none or calc(S * var(--px)) / calc(S * -1 * var(--px)); font weights are var(--toy-…)",
  L20: "every variable exists: --toy-* in the tokens file, --ctx-* and --tv-* in the same file; only --px, --zoom, --value besides",
  L21: "transform: rotate(<n>deg) in skin, translateY(calc(… * var(--px))) in motion and generated; transition: transform and box-shadow with var(--toy-…) timing",
  L22: "no CSS colour functions (color-mix, oklab, oklch, lab, lch, hsl, hwb, color, light-dark)",
  L23: "no var(--px) length on a selector whose last compound contains .frame",
  L24: "every selector is inside the profile's scope",
  L25: "text-shadow: one layer, blur 0, only on the title selectors",
  L26: "letter-spacing is calc(var(--toy-…-letter-spacing) * var(--px))",
  L27: "!important only in skin",
  L28: "property (and value form) outside the profile's allowlist",
};

const PROFILES = ["tokens", "skin", "motion", "generated", "layout"];

// The "layout" profile (pages/screens/screens-layout.css): the CSS that emulates Godot's containers. Only layout
// properties, each with a small value grammar; no paint at all (no colour, border, background, shadow, font, transform).
const LAYOUT_KEYWORDS = {
  display: ["block", "flex", "grid", "none"],
  position: ["relative", "absolute"],
  "box-sizing": ["border-box"],
  "flex-direction": ["row", "column"],
  flex: ["none"],
  "grid-auto-flow": ["row", "column"],
  "justify-content": ["start", "center", "end", "flex-start", "flex-end", "space-between", "stretch", "normal"],
  "align-content": ["start", "center", "end", "flex-start", "flex-end", "stretch", "normal"],
  "align-items": ["start", "center", "end", "flex-start", "flex-end", "stretch", "normal"],
  "justify-self": ["start", "center", "end", "stretch", "auto"],
  "align-self": ["start", "center", "end", "stretch", "auto"],
  "white-space": ["nowrap", "normal"],
  "text-align": ["left", "center", "right", "justify"],
  overflow: ["hidden", "visible"],
  "overflow-wrap": ["normal", "anywhere", "break-word"],
  contain: ["inline-size", "size", "none"],
  "pointer-events": ["none", "auto"],
};
const LAYOUT_LENGTHS = new Set(["top", "right", "bottom", "left", "width", "height", "min-width", "min-height", "row-gap",
  "column-gap", "padding-top", "padding-right", "padding-bottom", "padding-left"]);
const LAYOUT_TRACKS = new Set(["grid-template-columns", "grid-template-rows"]);
const LAYOUT_NUM = "-?\\d+(?:\\.\\d+)?";
const LAYOUT_LEN_RE = new RegExp("^(?:0|" + LAYOUT_NUM + "%|calc\\(\\s*" + LAYOUT_NUM + "\\s*\\*\\s*var\\(\\s*--px\\s*\\)\\s*\\)" +
  "|calc\\(\\s*" + LAYOUT_NUM + "%\\s*[+-]\\s*" + LAYOUT_NUM + "\\s*\\*\\s*var\\(\\s*--px\\s*\\)\\s*\\))$");

// One layout length: 0, n%, calc(n * var(--px)), calc(n% ± n * var(--px)), or max() of two of those.
function layoutLength(c) {
  if (LAYOUT_LEN_RE.test(c)) return true;
  const f = fnCall(c);
  if (!f || f.name !== "max") return false;
  const args = splitTop(f.args, ",");
  return args.length === 2 && args.every(a => LAYOUT_LEN_RE.test(a));
}

// Checks one declaration of the layout profile; returns null or a message (rule L28).
function checkLayout(prop, val) {
  const comps = splitTop(val, " ");
  if (LAYOUT_KEYWORDS[prop]) {
    return comps.length === 1 && LAYOUT_KEYWORDS[prop].includes(comps[0]) ? null : `${prop} takes one of ${LAYOUT_KEYWORDS[prop].join(", ")}; found ${val}`;
  }
  if (LAYOUT_LENGTHS.has(prop)) {
    return comps.length === 1 && layoutLength(comps[0]) ? null : `${prop} must be 0, n%, calc(n * var(--px)), calc(n% ± n * var(--px)) or max() of two; found ${val}`;
  }
  if (prop === "padding") {
    return comps.length >= 1 && comps.length <= 4 && comps.every(layoutLength) ? null : `padding takes 1-4 layout lengths; found ${val}`;
  }
  if (LAYOUT_TRACKS.has(prop)) {
    const ok = comps.length >= 1 && comps.every(c => c === "auto" || /^\d+(\.\d+)?fr$/.test(c) || layoutLength(c));
    return ok ? null : `${prop} lists tracks of auto, <n>fr or a layout length; found ${val}`;
  }
  if (prop === "grid-area") return /^\d+\s*\/\s*\d+$/.test(val) ? null : `grid-area must be <row> / <column>; found ${val}`;
  return `property outside the layout allowlist: ${prop}`;
}
const LAYOUT_PROPS = new Set([...Object.keys(LAYOUT_KEYWORDS), ...LAYOUT_LENGTHS, ...LAYOUT_TRACKS, "padding", "grid-area"]);

const NAMED_COLOURS = new Set((
  "aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood " +
  "cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray " +
  "darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen " +
  "darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue " +
  "firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew " +
  "hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan " +
  "lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray " +
  "lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue " +
  "mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred " +
  "midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid " +
  "palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple " +
  "rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue " +
  "slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white " +
  "whitesmoke yellow yellowgreen").split(" "));
const OTHER_COLOUR_WORDS = new Set((
  "transparent currentcolor accentcolor accentcolortext activetext buttonborder buttonface buttontext canvas canvastext " +
  "field fieldtext graytext highlight highlighttext linktext mark marktext selecteditem selecteditemtext visitedtext " +
  "activeborder activecaption appworkspace buttonhighlight buttonshadow captiontext inactiveborder inactivecaption " +
  "inactivecaptiontext infobackground infotext menu menutext scrollbar threeddarkshadow threedface threedhighlight " +
  "threedlightshadow threedshadow window windowframe windowtext").split(" "));

const REL_UNIT = "(?:em|rem|ex|rex|ch|rch|cap|rcap|ic|ric|lh|rlh|[sld]?v(?:w|h|i|b|min|max)|cq(?:w|h|i|b|min|max))";
const REL_UNIT_RE = new RegExp("(?:\\d|\\.)" + REL_UNIT + "(?![A-Za-z0-9_-])|%", "i");
const NUM = "[+-]?(?:\\d+\\.?\\d*|\\.\\d+)(?:[eE][+-]?\\d+)?";
const NUM_RE = new RegExp("^" + NUM + "$");
const INT_RE = /^[+-]?\d+$/;
const ZERO_RE = /^[+-]?0*\.?0+$/;

// ---------- small text helpers (values arrive with comments blanked, strings emptied, escapes decoded) ----------

// Split at depth 0 on a separator: "," for layers, " " for components. Parens and brackets nest.
function splitTop(s, sep) {
  const out = []; let depth = 0, cur = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(" || ch === "[") depth++;
    else if ((ch === ")" || ch === "]") && depth > 0) depth--;
    const isSep = sep === " " ? /\s/.test(ch) : ch === sep;
    if (depth === 0 && isSep) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map(x => x.trim()).filter(x => x !== "");
}

// "name(args)" when the first "(" closes at the very end; otherwise null.
function fnCall(tok) {
  const m = /^([A-Za-z_-][\w-]*)\(/.exec(tok);
  if (!m) return null;
  let depth = 0;
  for (let i = m[0].length - 1; i < tok.length; i++) {
    if (tok[i] === "(") depth++;
    else if (tok[i] === ")") { depth--; if (depth === 0) return i === tok.length - 1 ? { name: m[1].toLowerCase(), args: tok.slice(m[0].length, i) } : null; }
  }
  return null;
}

function varName(tok) {
  const f = fnCall(tok);
  if (!f || f.name !== "var") return null;
  const m = /^\s*(--[^\s,()]*)\s*$/.exec(f.args);
  return m ? m[1] : null;
}

// Every var() name referenced in a value (fallback contents are scanned by the other checks).
function varRefs(s) {
  const out = [];
  for (const m of s.matchAll(/\bvar\(\s*([^\s,()]*)/gi)) out.push(m[1]);
  return out;
}

function stripVarNames(s) { return s.replace(/\bvar\(\s*--[^\s,()]*/gi, "var("); }

// Literal colours in a value: hashes, rgb()/rgba(), named and system colours, transparent, currentColor.
function literalColours(s) {
  const t = stripVarNames(s);
  const found = [];
  for (const m of t.matchAll(/#[\w-]*/g)) found.push(m[0]);
  for (const m of t.matchAll(/\brgba?\s*\(/gi)) found.push(m[0].replace(/\s*\($/, "()"));
  for (const m of t.matchAll(/(^|[^\w-])(-?[A-Za-z_][\w-]*)(?![\w-]*\s*\()/g)) {
    const w = m[2].toLowerCase();
    if (NAMED_COLOURS.has(w) || OTHER_COLOUR_WORDS.has(w)) found.push(m[2]);
  }
  return found;
}

const COLOUR_FN_RE = /(^|[^\w-])(color-mix|oklab|oklch|lab|lch|hsla?|hwb|color|light-dark|device-cmyk|contrast-color)\s*\(/i;
const GRADIENT_RE = /[\w-]*gradient\s*\(/i;
const IMAGE_RE = /(^|[^\w-])(url|src|image|image-set|-webkit-image-set|cross-fade|element|paint)\s*\(/i;

// Parse a literal colour to [r, g, b, a] in 0..255 / 0..1, or null when it is not one.
function parseColour(v) {
  v = v.trim().toLowerCase();
  if (v === "transparent") return [0, 0, 0, 0];
  if (NAMED_COLOURS.has(v)) return [0, 0, 0, 1].map((x, i) => (i === 3 ? 1 : NaN));
  let m = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(v);
  if (m) {
    let h = m[1];
    if (h.length <= 4) h = h.split("").map(c => c + c).join("");
    const n = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
    return n.concat(h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1);
  }
  m = /^rgba?\(\s*([^)]*)\)$/.exec(v);
  if (m) {
    const parts = m[1].split(/\s*[,/]\s*|\s+/).filter(Boolean);
    if (parts.length < 3 || parts.length > 4) return null;
    const ch = parts.slice(0, 3).map(p => (/%$/.test(p) ? parseFloat(p) * 2.55 : parseFloat(p)));
    let a = 1;
    if (parts[3] !== undefined) a = /%$/.test(parts[3]) ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
    if ([...ch, a].some(x => Number.isNaN(x))) return null;
    return ch.concat(a);
  }
  return null;
}

// ---------- calc() analysis for lengths ----------

function calcTokens(s) {
  const toks = []; let i = 0;
  const numRe = new RegExp("^(" + NUM + ")([A-Za-z]+|%)?");
  while (i < s.length) {
    const rest = s.slice(i);
    if (/^\s/.test(rest)) { i++; continue; }
    const fm = /^([A-Za-z_-][\w-]*)?\(/.exec(rest);
    if (fm) {
      let depth = 0, j = i + fm[0].length - 1;
      for (; j < s.length; j++) {
        if (s[j] === "(") depth++;
        else if (s[j] === ")") { depth--; if (depth === 0) break; }
      }
      if (j >= s.length) return null;
      const raw = s.slice(i, j + 1);
      const name = (fm[1] || "").toLowerCase();
      if (name === "var") toks.push({ t: "var", name: varName(raw), raw });
      else if (name === "" || name === "calc") toks.push({ t: "group", inner: s.slice(i + fm[0].length, j), raw });
      else toks.push({ t: "fn", raw });
      i = j + 1; continue;
    }
    const prevIsValue = toks.length && toks[toks.length - 1].t !== "op";
    if (/^[*/]/.test(rest) || (prevIsValue && /^[+-]\s/.test(rest))) { toks.push({ t: "op", op: rest[0] }); i++; continue; }
    const nm = numRe.exec(rest);
    if (nm) { toks.push({ t: "num", value: nm[1], unit: nm[2] || "", raw: nm[0] }); i += nm[0].length; continue; }
    const im = /^[A-Za-z_-][\w-]*/.exec(rest);
    if (im) { toks.push({ t: "ident", raw: im[0] }); i += im[0].length; continue; }
    toks.push({ t: "bad", raw: rest[0] }); i++;
  }
  return toks;
}

// Checks a whole length calc(): returns [] or a list of {rule, msg}; L17 problems are reported before L19 ones.
function checkCalc(inner, ctx) {
  const l17 = [], l19 = [];
  const toks = calcTokens(inner);
  if (!toks) return [{ rule: "L19", msg: "unbalanced calc()" }];
  if (toks.some(t => t.t === "op" && (t.op === "+" || t.op === "-"))) l19.push("the top level of a length calc() must be a product S * var(--px)");
  const factors = []; let op = "*";
  for (const t of toks) {
    if (t.t === "op" && (t.op === "*" || t.op === "/")) { op = t.op; continue; }
    if (t.t === "op") continue;
    factors.push({ op, tok: t }); op = null;
  }
  if (factors.some(f => f.op === null)) l19.push("factors must be joined by *");
  const last = factors[factors.length - 1];
  if (!last || last.tok.t !== "var" || last.tok.name !== "--px" || last.op !== "*") l19.push("the last factor must be * var(--px)");
  const first = factors[0];
  if (first && first !== last) checkS(first.tok, ctx, l17, l19);
  else if (first === last) l19.push("no token before var(--px)");
  for (const f of factors.slice(1, -1)) {
    if (f.tok.t === "num" && !f.tok.unit) {
      if (f.op === "/") l17.push("division by a literal (" + f.tok.raw + ")");
      else if (Number(f.tok.value) !== -1) l17.push("literal multiplier " + f.tok.raw + " (only -1 is allowed)");
    } else l19.push("only a literal -1 may sit between S and var(--px), found " + f.tok.raw);
  }
  if (factors.slice(1, -1).length > 1) l17.push("more than one literal multiplier");
  return l17.length ? l17.map(msg => ({ rule: "L17", msg })) : l19.map(msg => ({ rule: "L19", msg }));
}

function checkS(tok, ctx, l17, l19) {
  const checkVar = (name) => {
    if (!name || !/^--(toy|tv)-/.test(name)) { l19.push("S may use only var(--toy-…) and var(--tv-…), found " + (name || "a malformed var()")); return; }
    for (const v of ctx.resolve(name)) {
      if (v === null) continue;
      if (INT_RE.test(v)) continue;
      if (NUM_RE.test(v)) l17.push(name + " resolves to " + v + ", not an int");
      else l19.push(name + " resolves to " + JSON.stringify(v) + ", not a unitless int");
    }
  };
  if (tok.t === "var") return checkVar(tok.name);
  if (tok.t === "num") {
    if (tok.unit) l19.push("raw length " + tok.raw + " (lengths are tokens times var(--px))");
    else l19.push("raw number " + tok.raw + " as S (lengths are tokens times var(--px))");
    if (!INT_RE.test(tok.value)) l17.push("non-integer literal " + tok.raw);
    return;
  }
  if (tok.t !== "group") { l19.push("S must be a token or a parenthesised sum, found " + tok.raw); return; }
  const inner = calcTokens(tok.inner);
  if (!inner || !inner.length) { l19.push("empty or unbalanced group in S"); return; }
  let expectTerm = true, vars = 0;
  for (const t of inner) {
    if (expectTerm) {
      if (t.t === "var") { vars++; checkVar(t.name); }
      else if (t.t === "num") {
        if (t.unit) l19.push("raw length " + t.raw + " inside S");
        else if (!INT_RE.test(t.value)) l17.push("non-integer literal " + t.raw + " inside S");
      } else l19.push("S terms are tokens or ints, found " + t.raw);
      expectTerm = false;
    } else {
      if (t.t === "op" && (t.op === "+" || t.op === "-")) expectTerm = true;
      else l19.push("S is a sum or difference, found " + (t.op || t.raw));
    }
  }
  if (expectTerm) l19.push("S ends with an operator");
  if (!vars) l19.push("S has no token");
}

// One length component. opts: {radius, exemptPercent}. Returns null or {rule, msg}.
function checkLength(comp, ctx, opts) {
  opts = opts || {};
  const low = comp.toLowerCase();
  if (ZERO_RE.test(comp) || low === "none") return null;
  if (opts.exempt && opts.exempt.includes(comp.replace(/\s+/g, " "))) return null;
  if (opts.radius && /%/.test(comp)) return { rule: "L15", msg: "percent radius " + comp };
  if (REL_UNIT_RE.test(stripVarNames(comp))) return { rule: "L16", msg: "relative unit in " + comp };
  const f = fnCall(comp);
  if (f && f.name === "calc") {
    const probs = checkCalc(f.args, ctx);
    return probs.length ? { rule: probs[0].rule, msg: probs.map(p => p.msg).join("; ") + ": " + comp } : null;
  }
  if (f && f.name === "var") return { rule: "L19", msg: "bare " + comp + " as a length (write calc(var(--toy-…) * var(--px)))" };
  return { rule: "L19", msg: "raw length " + comp + " (lengths are 0 or calc(S * var(--px)))" };
}

module.exports = {
  RULES, PROFILES, NAMED_COLOURS, REL_UNIT_RE, NUM_RE, INT_RE, ZERO_RE, LAYOUT_PROPS, checkLayout,
  splitTop, fnCall, varName, varRefs, stripVarNames, literalColours, parseColour,
  COLOUR_FN_RE, GRADIENT_RE, IMAGE_RE, checkCalc, checkLength,
};
