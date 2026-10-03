// Contrast gates (spec §11): every declared pair of tokens/gates.json and every auto pair derived from the pack's
// variations, in all permutations of the pack's modifiers, with WCAG 2.x ratios and sRGB compositing.
//
//   node tools/contrast/gates.js             compute and write dist/gates.json
//   node tools/contrast/gates.js --check     compute and compare with dist/gates.json (nothing is written)
//   node tools/contrast/gates.js --self-test run tools/contrast/fixtures/<case>/{pack.json,gates.json,expect.json}
//   options: --pack <file> --gates <file> --out <file> --verbose
//
// It reads only the pack and the gates file. Exit 1 on any FAIL, error, stale waiver or (with --check) a stale file.
"use strict";
const fs = require("fs");
const path = require("path");
const W = require("../lib/wcag");

const ROOT = path.resolve(__dirname, "..", "..");
const DEFAULTS = {
  pack: path.join(ROOT, "dist", "pack", "toy.pack.json"),
  gates: path.join(ROOT, "tokens", "gates.json"),
  out: path.join(ROOT, "dist", "gates.json"),
};
const FIX = path.join(__dirname, "fixtures");
const BUTTON_STATES = ["normal", "hover", "pressed", "hover-pressed", "disabled"];
const LINE_EDIT_STATES = ["normal", "read-only"];
const SIDES = ["top", "right", "bottom", "left"];

const round2 = x => Math.round(x * 100) / 100;
const key = c => W.toHex(c) + "/" + (Math.round((c.length > 3 ? c[3] : 1) * 10000) / 10000);

function compute(pack, gates) {
  const errors = [];
  const err = msg => { if (!errors.includes(msg)) errors.push(msg); };

  // ----- input shape -----
  if (!pack || pack.format !== "prime-game-ui/pack" || pack.schema !== 1) err("pack: format must be prime-game-ui/pack, schema 1");
  if (!gates || gates.schema !== 1) err("gates: schema must be 1");
  if (errors.length) return { results: [], ramp: [], errors, waived: 0 };
  const world = gates.world || {};
  for (const [n, h] of Object.entries(world)) if (!/^#[0-9a-fA-F]{6}$/.test(h)) err(`gates.world.${n}: not #rrggbb`);
  const mins = gates.min || {};
  for (const k of ["text", "large-text", "inactive-text", "ui"]) if (typeof mins[k] !== "number") err(`gates.min.${k}: missing`);
  const largePx = gates["large-text-px"];
  if (typeof largePx !== "number") err("gates.large-text-px: missing");
  const ids = new Set();
  for (const p of gates.pairs || []) {
    if (!p.id || ids.has(p.id)) err(`gates.pairs: missing or repeated id ${p.id}`);
    ids.add(p.id);
    if (!p.fg || !p.bg) err(`pair ${p.id}: fg and bg are required`);
    if (p.min !== null && !(p.min in mins)) err(`pair ${p.id}: min ${JSON.stringify(p.min)} is not a key of gates.min (or null)`);
  }
  for (const [i, w] of (gates.waivers || []).entries()) {
    for (const k of ["fg", "bg", "reason", "decision", "issue"]) if (!w[k]) err(`waiver ${i + 1}: ${k} is required`);
  }
  const variations = pack.variations || {};

  // ----- permutations of the modifiers -----
  const mods = Object.entries(pack.modifiers || {});
  let perms = [[]];
  for (const [name, m] of mods) perms = perms.flatMap(p => (m.contexts || [m.default]).map(c => p.concat([[name, c, c === m.default]])));
  const results = [], rampRows = [];
  const waiverUse = (gates.waivers || []).map(() => 0);
  let waived = 0;

  for (const perm of perms) {
    const permName = perm.map(([n, c]) => `${n}=${c}`).join(",");
    const T = Object.assign({}, pack.tokens);
    for (const [n, c, isDefault] of perm) if (!isDefault) Object.assign(T, ((pack.modes || {})[n] || {})[c] || {});

    // Colour of a reference: a token path, "world:<name>", or (in over lists) a bare world name.
    const colour = (ref, overList) => {
      if (typeof ref !== "string") { err(`bad colour reference ${JSON.stringify(ref)}`); return null; }
      const wname = ref.startsWith("world:") ? ref.slice(6) : overList && ref in world ? ref : null;
      if (wname !== null) { if (!(wname in world)) { err(`unknown world colour ${ref}`); return null; } return W.fromHex(world[wname]); }
      const t = T[ref];
      if (!t) { err(`unknown token ${ref}`); return null; }
      if (t.type !== "color" || !/^#[0-9a-fA-F]{6}$/.test(t.hex) || !Array.isArray(t.rgba)) { err(`token ${ref} is not a colour`); return null; }
      return W.fromHex(t.hex, t.rgba[3]);
    };
    const layer = (name, ref, overList) => { const c = colour(ref, overList); return c && { name, ref, c }; };
    const waiverKeys = (gates.waivers || []).map(w => {
      const f = colour(w.fg), b = colour(w.bg), o = w.over ? colour(w.over, true) : null;
      return f && b && (!w.over || o) ? { fg: key(f), bg: key(b), under: o ? [key(o)] : [] } : null;
    });

    // Push a layer onto stacks; an opaque layer hides everything under it.
    const push = (stacks, l) => {
      if (!l) return [];
      if (l.c[3] === 1) return [[l]];
      if (l.c[3] === 0) return stacks;
      return stacks.map(s => s.concat([l]));
    };
    const contextStacks = (ctx, who) => {
      const names = ctx === "any" ? ["dark", "light"] : [ctx];
      const out = [];
      for (const n of names) {
        const list = (gates.surfaces || {})[n];
        if (!Array.isArray(list)) { err(`${who}: no gates.surfaces.${n} for context ${ctx}`); continue; }
        for (const s of list) {
          const top = layer(s.bg, s.bg);
          if (!top) continue;
          if (s.over && s.over.length) { for (const o of s.over) { const u = layer(o, o, true); if (u) out.push(...push([[u]], top)); } }
          else out.push([top]);
        }
      }
      const seen = new Set();
      return out.filter(st => { const k = st.map(l => l.name).join("/"); if (seen.has(k)) return false; seen.add(k); return true; });
    };
    // The stacks under (and including) one StyleBox state of a variation.
    const faceStacks = (vname, state, faceName) => {
      const v = variations[vname];
      const under = contextStacks(v.context, vname);
      if (!(v.styleboxes || []).includes(state)) return under;
      const p = `${v.prefix}.${state}`;
      const dc = T[p + ".draw-center"];
      if (dc && dc.value === false) return under;
      return push(under, layer(faceName, p + ".bg-color"));
    };
    const labelPx = vname => {
      for (let v = vname, n = 0; v && n < 10; v = (variations[v] || {}).parent, n++) {
        const t = T[`${variations[v].prefix}.label`];
        if (t && typeof t.fontSizePx === "number") return t.fontSizePx;
      }
      return null;
    };

    const rows = [];
    const evaluate = (row, fgLayer, stack, minKey) => {
      if (!fgLayer || !stack.length) return;
      if (stack[0].c[3] !== 1) { err(`${row.id}: nothing opaque under ${stack.map(l => l.name).join(" over ")}`); return; }
      let bg = stack[0].c;
      for (const l of stack.slice(1)) bg = W.composite(l.c, bg);
      const fg = W.composite(fgLayer.c, bg);
      const r = W.ratio(fg, bg);
      const top = stack[stack.length - 1];
      const under = stack.slice(0, -1).reverse();
      const min = minKey === null ? null : mins[minKey];
      let verdict = min === null ? "info" : r >= min ? "ok" : "FAIL";
      const out = Object.assign({ id: row.id, kind: row.kind, permutation: permName, fg: W.toHex(fg), bg: W.toHex(bg),
        fgPath: fgLayer.ref, bgPath: top.ref, over: under.length ? under.map(l => l.name).join("/") : null,
        ratio: round2(r), min, verdict }, row.what ? { what: row.what } : {});
      if (verdict === "FAIL") {
        const k = { fg: key(fgLayer.c), bg: key(top.c), under: under.map(l => key(l.c)).join() };
        const wi = waiverKeys.findIndex(w => w && w.fg === k.fg && w.bg === k.bg && w.under.join() === k.under);
        if (wi >= 0) { out.verdict = "WAIVED"; out.issue = gates.waivers[wi].issue; waiverUse[wi]++; waived++; }
      }
      rows.push(out);
      return out;
    };

    // ----- declared pairs, in file order -----
    for (const p of gates.pairs || []) {
      let fg = layer(p.fg, p.fg);
      if (fg && p.fgOver) {
        const fo = layer(p.fgOver, p.fgOver);
        if (fo && fo.c[3] === 1) fg = { name: p.fg, ref: p.fg, c: W.composite(fg.c, fo.c) };
        else if (fo) err(`pair ${p.id}: fgOver must be opaque`);
      }
      const bg = layer(p.bg.replace(/^world:/, ""), p.bg);
      if (!fg || !bg) continue;
      const overs = p.over && p.over.length ? p.over : [null];
      for (const o of overs) {
        const stack = o === null ? [bg] : (() => { const u = layer(o, o, true); return u ? (bg.c[3] === 1 ? [bg] : [u, bg]) : []; })();
        const r = evaluate({ id: p.id, kind: "declared", what: p.what }, fg, stack, p.min);
        if (r && o !== null) r.over = o;
      }
    }

    // ----- auto pairs -----
    const auto = gates.auto || {};
    const autoRows = [], autoIds = new Set();
    const autoEval = (id, fgLayer, stack, minKey) => {
      if (!fgLayer || !stack || !stack.length) return;
      const full = `${id}:${stack.map(l => l.name).reverse().join("/")}`;
      if (autoIds.has(full)) return;
      autoIds.add(full);
      const r = evaluate({ id: full, kind: "auto" }, fgLayer, stack, minKey);
      if (r) { rows.pop(); autoRows.push(r); }
    };
    const textMin = vname => { const px = labelPx(vname); return px !== null && px >= largePx ? "large-text" : "text"; };
    const onStacks = (vname) => {
      const v = variations[vname], out = [];
      for (const o of v.on || []) {
        const ov = variations[o];
        if (!ov) { err(`${vname}: unknown on variation ${o}`); continue; }
        const st = (ov.styleboxes || []).includes("panel") ? "panel" : (ov.styleboxes || [])[0];
        out.push(...(st ? faceStacks(o, st, o) : contextStacks(ov.context, o)));
      }
      return out;
    };
    for (const [vname, v] of Object.entries(variations).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
      if (v.abstract) continue;
      const pre = v.prefix;
      const boxes = (v.styleboxes || []).concat(v.empty || []);
      const isButton = v.class === "Button" || v.class === "OptionButton";
      if (auto["component-text"] && isButton) {
        for (const s of BUTTON_STATES) if (boxes.includes(s)) {
          const fg = layer("font", `${pre}.${s}.font-color`);
          for (const st of faceStacks(vname, s, "face")) autoEval(`auto:${vname}:${s}`, fg, st, s === "disabled" ? "inactive-text" : textMin(vname));
        }
      }
      if (auto["component-text"] && v.class === "LineEdit") {
        for (const s of LINE_EDIT_STATES) if (boxes.includes(s)) {
          for (const st of faceStacks(vname, s, "face")) autoEval(`auto:${vname}:${s}`, layer("font", `${pre}.${s}.font-color`), st, textMin(vname));
        }
        if (T[`${pre}.items.placeholder-color`]) for (const st of faceStacks(vname, "normal", "face")) autoEval(`auto:${vname}:placeholder`, layer("font", `${pre}.items.placeholder-color`), st, textMin(vname));
        if (T[`${pre}.items.selected-font-color`] && T[`${pre}.items.selection-color`]) {
          const sel = layer("selection", `${pre}.items.selection-color`);
          for (const st of push(faceStacks(vname, "normal", "face"), sel)) autoEval(`auto:${vname}:selection`, layer("font", `${pre}.items.selected-font-color`), st, textMin(vname));
        }
      }
      if (auto["label-text"] && v.class === "Label") {
        const fg = layer("font", `${pre}.normal.font-color`);
        const dc = T[`${pre}.normal.draw-center`];
        const ownDrawn = (v.styleboxes || []).includes("normal") && T[`${pre}.normal.bg-color`] && !(dc && dc.value === false);
        const below = v.on && v.on.length ? onStacks(vname) : contextStacks(v.context, vname);
        const stacks = ownDrawn ? push(below, layer("face", `${pre}.normal.bg-color`)) : below;
        for (const st of stacks) autoEval(`auto:${vname}:normal`, fg, st, textMin(vname));
      }
      if (auto.focus && (isButton || v.class === "LineEdit") && (v.styleboxes || []).includes("focus")) {
        const f = `${pre}.focus`;
        const widths = SIDES.map(s => (T[`${f}.border-width-${s}`] || {}).px || 0);
        const ring = layer("ring", `${f}.border-color`);
        if (ring && ring.c[3] > 0 && widths.some(w => w > 0)) {
          const outer = SIDES.some(s => ((T[`${f}.expand-margin-${s}`] || {}).px || 0) > 0);
          if (outer) for (const st of contextStacks(v.context, vname)) autoEval(`auto:${vname}:focus`, ring, st, "ui");
          else for (const s of isButton ? BUTTON_STATES : LINE_EDIT_STATES) if (boxes.includes(s)) {
            for (const st of faceStacks(vname, s, "face")) autoEval(`auto:${vname}:focus-on-${s}`, ring, st, "ui");
          }
        }
      }
      if (auto.fills && v.class === "ProgressBar" && (v.styleboxes || []).includes("fill") && !(auto.ramp && auto.ramp.variation === vname)) {
        const fill = layer("fill", `${pre}.fill.bg-color`);
        const stacks = v.on && v.on.length ? onStacks(vname) : faceStacks(vname, "background", "background");
        for (const st of stacks) autoEval(`auto:${vname}:fill`, fill, st, "ui");
      }
    }
    autoRows.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    results.push(...rows, ...autoRows);

    // ----- the health ramp -----
    if (auto.ramp) {
      const rv = variations[auto.ramp.variation];
      if (!rv) err(`auto.ramp: unknown variation ${auto.ramp.variation}`);
      else {
        const stem = `${rv.prefix}.ramp.stop-`;
        const stops = (pack.derived || []).filter(p => p.startsWith(stem)).sort();
        if (!stops.length) err(`auto.ramp: no derived stops ${stem}*`);
        const track = layer(auto.ramp.track, auto.ramp.track);
        const min = mins[auto.ramp.min];
        if (min === undefined) err(`auto.ramp.min: ${auto.ramp.min} is not a key of gates.min`);
        const permRows = [];
        if (track && track.c[3] !== 1) err(`auto.ramp.track ${auto.ramp.track} is not opaque`);
        else if (track) for (const s of stops) {
          const step = parseInt(s.slice(stem.length), 10);
          const c = colour(s);
          if (!c) continue;
          const fg = W.composite(c, track.c), r = W.ratio(fg, track.c);
          let verdict = r >= min ? "ok" : "FAIL";
          if (verdict === "FAIL") {
            const wi = waiverKeys.findIndex(w => w && w.fg === key(c) && w.bg === key(track.c) && !w.under.length);
            if (wi >= 0) { verdict = "WAIVED"; waiverUse[wi]++; waived++; }
          }
          permRows.push({ step, hp: stops.length > 1 ? Math.round((step / (stops.length - 1)) * 10000) / 10000 : 0, hex: W.toHex(c), ratio: round2(r), min, verdict });
        }
        rampRows.push({ permName, rows: permRows });
      }
    }
  }

  // The ramp once when every permutation draws the same stops, else per permutation.
  let ramp = [];
  if (rampRows.length) {
    const same = rampRows.every(x => JSON.stringify(x.rows) === JSON.stringify(rampRows[0].rows));
    ramp = same ? rampRows[0].rows : rampRows.flatMap(x => x.rows.map(r => Object.assign({ permutation: x.permName }, r)));
  }
  waiverUse.forEach((n, i) => { if (!n) { const w = gates.waivers[i]; err(`stale waiver ${i + 1} (${w.fg} on ${w.bg}${w.over ? " over " + w.over : ""}): it matches no failing pair, remove it`); } });
  return { results, ramp, rampAll: rampRows, errors, waived };
}

// One row per line, so the committed file diffs well.
function serialise(res) {
  const lines = ["{", '  "schema": 1,', '  "results": ['];
  res.results.forEach((r, i) => lines.push("    " + JSON.stringify(r) + (i < res.results.length - 1 ? "," : "")));
  lines.push("  ],", '  "ramp": [');
  res.ramp.forEach((r, i) => lines.push("    " + JSON.stringify(r) + (i < res.ramp.length - 1 ? "," : "")));
  lines.push("  ]" + (res.errors.length ? "," : ""));
  if (res.errors.length) lines.push('  "errors": ' + JSON.stringify(res.errors));
  lines.push("}");
  return lines.join("\n") + "\n";
}

function summarise(res, verbose) {
  const perms = [...new Set(res.results.map(r => r.permutation))];
  for (const p of perms) {
    const rows = res.results.filter(r => r.permutation === p);
    const count = v => rows.filter(r => r.verdict === v).length;
    console.log(`${p}: ${rows.length} pairs, ${count("ok")} ok, ${count("FAIL")} FAIL, ${count("WAIVED")} WAIVED, ${count("info")} info`);
    for (const r of rows) {
      if (!verbose && (r.verdict === "ok" || r.verdict === "info")) continue;
      console.log(`  ${r.verdict.padEnd(6)} ${String(r.ratio).padStart(6)} (min ${r.min}) ${r.id}  ${r.fgPath} on ${r.bgPath}${r.over ? " over " + r.over : ""}  [${r.fg} on ${r.bg}]`);
    }
  }
  if (perms.length) {
    const text = res.results.filter(r => r.permutation === perms[0] && (r.min === 4.5));
    console.log(`7:1 (report only, no high-contrast mode yet): ${text.filter(r => r.ratio >= 7).length} of ${text.length} text pairs in ${perms[0]}`);
  }
  if (res.ramp.length) {
    const worst = res.ramp.reduce((a, b) => (b.ratio < a.ratio ? b : a));
    const bad = res.ramp.filter(r => r.verdict === "FAIL");
    console.log(`ramp: ${res.ramp.length} stops, lowest ${worst.ratio} at step ${worst.step} (min ${worst.min})${bad.length ? ", FAIL at steps " + bad.map(r => r.step).join(", ") : ", all ok"}`);
  }
  for (const e of res.errors) console.log("ERROR " + e);
}

const failures = res => res.results.filter(r => r.verdict === "FAIL").length + (res.rampAll || []).reduce((n, x) => n + x.rows.filter(r => r.verdict === "FAIL").length, 0) + res.errors.length;

function readJson(file, what) {
  if (!fs.existsSync(file)) throw new Error(`${what} not found: ${path.relative(ROOT, file) || file}`);
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) { throw new Error(`${what} ${file}: ${e.message}`); }
}

function selfTest() {
  let bad = 0;
  const dirs = fs.readdirSync(FIX).filter(d => fs.statSync(path.join(FIX, d)).isDirectory()).sort();
  for (const want of ["pass", "fail", "stale-waiver"]) if (!dirs.includes(want)) { bad++; console.log(`FAIL fixture ${want}: missing`); }
  for (const d of dirs) {
    const dir = path.join(FIX, d);
    let msg = "", ok = true;
    try {
      const pack = readJson(path.join(dir, "pack.json"), "pack"), gates = readJson(path.join(dir, "gates.json"), "gates");
      const expect = readJson(path.join(dir, "expect.json"), "expect");
      const res = compute(pack, gates);
      const exit = failures(res) ? 1 : 0;
      if (exit !== expect.exit) { ok = false; msg += ` exit ${exit}, expected ${expect.exit}.`; }
      if (typeof expect.errors === "number" && res.errors.length !== expect.errors) { ok = false; msg += ` ${res.errors.length} error(s), expected ${expect.errors}: ${res.errors.join("; ")}.`; }
      for (const c of expect.rows || []) {
        const perm = c.permutation || res.results[0].permutation;
        const row = res.results.find(r => r.id === c.id && r.permutation === perm && (c.over === undefined || r.over === c.over));
        if (!row) { ok = false; msg += ` no row ${c.id}${c.over ? " over " + c.over : ""} in ${perm}.`; continue; }
        for (const k of Object.keys(c)) if (!["id", "permutation", "over"].includes(k) && row[k] !== c[k]) { ok = false; msg += ` ${c.id}: ${k} ${JSON.stringify(row[k])}, expected ${JSON.stringify(c[k])}.`; }
      }
      if (typeof expect.ramp === "number" && res.ramp.length !== expect.ramp) { ok = false; msg += ` ${res.ramp.length} ramp rows, expected ${expect.ramp}.`; }
      if (ok) msg = ` exit ${exit}, ${res.results.length} rows, ${res.waived} waived, ${res.errors.length} error(s)`;
    } catch (e) { ok = false; msg = " " + e.message; }
    if (!ok) bad++;
    console.log(`${ok ? "ok  " : "FAIL"} fixture ${d}:${msg}`);
  }
  console.log(bad ? `FAILED: ${bad} self-test mismatch(es)` : "ALL CLEAN");
  return bad ? 1 : 0;
}

function main(argv) {
  if (argv.includes("--self-test")) return selfTest();
  const o = Object.assign({}, DEFAULTS), flags = new Set();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (["--pack", "--gates", "--out"].includes(a)) { if (i + 1 >= argv.length) { console.error("missing value for " + a); return 2; } o[a.slice(2)] = path.resolve(argv[++i]); }
    else if (a === "--check" || a === "--verbose") flags.add(a);
    else { console.error("unknown argument " + a + " (use --check, --self-test, --pack, --gates, --out, --verbose)"); return 2; }
  }
  let pack, gates;
  try { pack = readJson(o.pack, "pack"); gates = readJson(o.gates, "gates file"); }
  catch (e) { console.log("ERROR " + e.message + (o.pack === DEFAULTS.pack ? " (build it with node tools/tokens/build.js)" : "")); return 1; }
  const res = compute(pack, gates);
  summarise(res, flags.has("--verbose"));
  const text = serialise(res);
  let stale = false;
  if (flags.has("--check")) {
    const old = fs.existsSync(o.out) ? fs.readFileSync(o.out, "utf8").replace(/\r\n/g, "\n") : null;
    if (old !== text) { stale = true; console.log(`STALE ${path.relative(ROOT, o.out)} ${old === null ? "is missing" : "differs from a fresh run"} (run node tools/contrast/gates.js)`); }
  } else {
    fs.mkdirSync(path.dirname(o.out), { recursive: true });
    fs.writeFileSync(o.out, text);
    console.log(`wrote ${path.relative(ROOT, o.out) || o.out}`);
  }
  const n = failures(res) + (stale ? 1 : 0);
  console.log(n ? `FAILED: ${n}` : "ALL CLEAN");
  return n ? 1 : 0;
}

module.exports = { compute, serialise };

if (require.main === module) {
  let code;
  try { code = main(process.argv.slice(2)); } catch (e) { console.log("ERROR internal: " + (e && e.stack || e)); code = 1; }
  process.exitCode = code;
}
