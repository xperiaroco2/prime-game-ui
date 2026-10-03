// Compares the element records of the zero-change probe (spec §15.5 step 5). Numbers match within 0.02 px; colours
// (already normalised to "r,g,b,a" by tools/visual/harness.js) and strings must be equal.
//
//   node tools/visual/compare.js <a.json> <b.json> [--style toy] [--config base] [--raw]
//     a.json, b.json: the records probe.js saved in its temp folder (before.json, after.json, patched.json).
//     Prints every difference of the picture records (with --raw, of the declared-box records too); exit 1 on any.
//
// Used as a module by tools/visual/probe.js. Node's own modules only.
"use strict";
const fs = require("fs");

const TOL = 0.02;

function same(a, b, tol = TOL) {
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) <= tol;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => same(x, b[i], tol));
  return a === b;
}

// a, b: {key: record array}; fields: the names of the record positions. Keys keep a's order, then b's extras.
function diff(a, b, fields, tol = TOL) {
  const out = [];
  const keys = Object.keys(a).concat(Object.keys(b).filter((k) => !Object.prototype.hasOwnProperty.call(a, k)));
  for (const key of keys) {
    const ra = a[key], rb = b[key];
    if (ra === undefined || rb === undefined) {
      out.push({ key, field: "(element)", a: ra === undefined ? "absent" : "present", b: rb === undefined ? "absent" : "present" });
      continue;
    }
    fields.forEach((f, i) => { if (!same(ra[i], rb[i], tol)) out.push({ key, field: f, a: ra[i], b: rb[i] }); });
  }
  return out;
}

// a full record map from a base map and a sparse variant (only the keys that differ, plus the keys it lacks)
function overlay(base, sparse, missing) {
  const out = Object.assign({}, base, sparse || {});
  for (const k of missing || []) delete out[k];
  return out;
}

function fmt(v) {
  if (Array.isArray(v)) return "[" + v.map(fmt).join(" ") + "]";
  if (typeof v === "string" && /^\d+,\d+,\d+,[\d.]+$/.test(v)) {
    const [r, g, b, al] = v.split(",").map(Number);
    const hex = "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase();
    return al === 1 ? hex : hex + "@" + al;
  }
  return v === "" ? "-" : String(v);
}

function line(d, desc) {
  const [screen, state, rest] = d.key.split("|");
  const what = (desc && desc[screen + "/" + rest]) || (rest.endsWith("/") ? "the frame" : rest);
  return `${screen} ${state} ${what} (${rest}): ${d.field} ${fmt(d.a)} -> ${fmt(d.b)}`;
}

module.exports = { TOL, same, diff, overlay, fmt, line };

if (require.main === module) {
  const args = process.argv.slice(2);
  const files = [];
  let style = null, config = "base", raw = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--style") style = args[++i];
    else if (args[i] === "--config") config = args[++i];
    else if (args[i] === "--raw") raw = true;
    else files.push(args[i]);
  }
  if (files.length !== 2) {
    console.error("usage: node tools/visual/compare.js <a.json> <b.json> [--style toy] [--config base] [--raw]");
    process.exit(2);
  }
  const [A, B] = files.map((f) => JSON.parse(fs.readFileSync(f, "utf8")));
  const ca = A.configs.base, cb = B.configs[config];
  if (!cb) { console.error("no config " + config + " in " + files[1]); process.exit(2); }
  const styles = style ? [style] : Object.keys(ca.rec);
  let n = 0;
  for (const st of styles) {
    const recB = config === "base" ? cb.rec[st] : overlay(B.configs.base.rec[st], cb.rec[st], cb.missing && cb.missing[st]);
    const ds = diff(ca.rec[st], recB, A.fields);
    if (raw) {
      const rawB = config === "base" ? cb.raw[st] : overlay(B.configs.base.raw[st], cb.raw[st], cb.missing && cb.missing[st]);
      ds.push(...diff(ca.raw[st], rawB, A.rawFields));
    }
    console.log(`${st}: ${ds.length} difference(s)`);
    for (const d of ds) console.log("  " + line(d, A.desc));
    n += ds.length;
  }
  process.exit(n ? 1 : 0);
}
