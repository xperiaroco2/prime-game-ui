// The zero-change proof of the toy.css migration (spec §15.5). Local Windows + Microsoft Edge only, not CI.
//
//   node tools/visual/probe.js [--before <git ref>] [--verbose] [--keep]
//     --before   the ref whose pages/styles/styles.html is "before" (default: main)
//     --verbose  print every attributed difference, not three samples per item
//     --keep     keep the Edge profiles in the temp folder (the pages, dumps and records are always kept there)
//
// 1. Writes three copies of the styles page into a new OS temp folder (never into the repo): before (git show
//    <ref>:pages/styles/styles.html), after (pages/styles/styles.html, which must be up to date with its sources), and
//    after + tools/visual/intended-changes.css (the reverse patch of §15.3 items 1-4, one <style> per item).
// 2. Appends tools/visual/harness.js to each copy; it records every visible element of every state of every screen,
//    for the styles toy, retro and card. The patched copy also records toy with each item switched off in turn.
// 3. Runs headless Edge once per copy, through PowerShell Start-Process -Wait with a fresh --user-data-dir and every
//    host name unresolvable (nothing is fetched), and reads the records back from the dumped DOM.
// 4. Compares (tools/visual/compare.js): after + reverse patch against before must have zero differences for all
//    three styles (exit 1 otherwise); after against before is printed as the intended changes, each difference
//    attributed to an item of §15.3. A difference no item explains also exits 1.
// Node's own modules only.
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const url = require("url");
const { spawnSync, execFileSync } = require("child_process");
const { diff, overlay, same, fmt, line, TOL } = require("./compare.js");

const ROOT = path.resolve(__dirname, "..", "..");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const STYLES = ["toy", "retro", "card"];
const ITEMS = {
  1: "letter spacing of .t16 .t18 (+0.01em -> 0), .t36 .t48 (-0.01em -> 0), .t64 .t96 (-0.01em -> -1 px)",
  2: "the health fill at 22 % (s7 hurt): #E87D46 -> #EA7A46 (stop 04)",
  3: "the selected preset card: padding 12 -> 10 (2 px smaller on every side, the idle card's size)",
  4: "the stepper radius: 999px -> 999 reference px (still a pill)",
  5: "chips and idle tabs: a 3 px transparent border -> border 0 and padding + 3 (same picture)",
};

function args() {
  const o = { before: "main", verbose: false, keep: false };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (a[i] === "--before" && i + 1 < a.length) o.before = a[++i];
    else if (a[i] === "--verbose") o.verbose = true;
    else if (a[i] === "--keep") o.keep = true;
    else {
      console.error("usage: node tools/visual/probe.js [--before <git ref>] [--verbose] [--keep]; unknown: " + a[i]);
      process.exit(2);
    }
  }
  return o;
}

// the reverse patch, split at its "/* item N: ... */" comments
function patchItems(css) {
  const items = [];
  const re = /\/\* item (\d+):[^*]*\*\/\n([\s\S]*?)(?=\/\* item \d+:|$)/g;
  let m;
  while ((m = re.exec(css))) items.push({ id: m[1], css: m[2].trim() });
  if (items.map((i) => i.id).join(",") !== "1,2,3,4") throw new Error("intended-changes.css must hold items 1, 2, 3, 4 in order");
  return items;
}

function inject(page, cfg, items, harness) {
  const styles = items.map((it) => `<style data-probe-item="${it.id}">\n${it.css}\n</style>\n`).join("");
  return page + "\n" + styles + "<script>window.__PROBE_CFG = " + JSON.stringify(cfg) + ";</script>\n<script>\n" + harness + "\n</script>\n";
}

function psq(s) { return "'" + s.replace(/'/g, "''") + "'"; }

function edge(tmp, name, file) {
  const profile = path.join(tmp, "edge-profile-" + name);
  const out = path.join(tmp, name + ".dom.html");
  const err = path.join(tmp, name + ".edge-stderr.txt");
  const list = ["--headless=new", "--disable-gpu", "--no-first-run", "--user-data-dir=" + profile,
    "--host-resolver-rules=MAP * ~NOTFOUND", "--force-device-scale-factor=1", "--window-size=1920,1080",
    "--virtual-time-budget=20000", "--dump-dom", url.pathToFileURL(file).href];
  // Start-Process joins -ArgumentList with spaces: an argument with a space is wrapped in double quotes
  const argList = list.map((a) => psq(/\s/.test(a) ? '"' + a + '"' : a)).join(",");
  const ps = "$ErrorActionPreference = 'Stop'; Start-Process -FilePath " + psq(EDGE) + " -ArgumentList " + argList +
    " -Wait -NoNewWindow -RedirectStandardOutput " + psq(out) + " -RedirectStandardError " + psq(err);
  const t0 = Date.now();
  const r = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-EncodedCommand", Buffer.from(ps, "utf16le").toString("base64")],
    { encoding: "utf8", timeout: 300000, windowsHide: true });
  if (r.error) throw new Error("PowerShell did not run: " + r.error.message);
  if (r.status !== 0) throw new Error("PowerShell exit " + r.status + ": " + (r.stderr || "").trim().slice(0, 400));
  const dom = fs.existsSync(out) ? fs.readFileSync(out, "utf8") : "";
  const tag = '<script type="application/json" id="probe-out">';
  const at = dom.lastIndexOf(tag), end = at < 0 ? -1 : dom.indexOf("</script>", at);
  const m = end < 0 ? null : [null, dom.slice(at + tag.length, end)];
  if (!m) throw new Error(`Edge dumped no records for ${name} (${dom.length} bytes in ${out}); see ${err}`);
  const data = JSON.parse(m[1]);
  fs.writeFileSync(path.join(tmp, name + ".json"), JSON.stringify(data));
  return { data, seconds: (Date.now() - t0) / 1000 };
}

function count(o) { return Object.keys(o || {}).length; }

// spec §15.3 item 5, per side whose declared box changed: a visible-nothing border of width w became border 0 and
// the padding grew by w
function item5(rawFields, before, after) {
  const at = (r, f) => r[rawFields.indexOf(f)];
  let changed = false;
  for (const side of ["top", "right", "bottom", "left"]) {
    const keys = ["pad-", "raw-bw-", "raw-bs-", "raw-bc-"].map((p) => p + side);
    if (keys.every((k) => same(at(before, k), at(after, k)))) continue;
    changed = true;
    const w = at(before, "raw-bw-" + side);
    const alpha = Number(String(at(before, "raw-bc-" + side)).split(",")[3]);
    const ok = w > 0 && alpha === 0 && at(after, "raw-bw-" + side) === 0 &&
      Math.abs(at(after, "pad-" + side) - at(before, "pad-" + side) - w) <= TOL;
    if (!ok) return false;
  }
  return changed;
}

function main() {
  const o = args();
  if (process.platform !== "win32" || !fs.existsSync(EDGE)) {
    console.error("probe: needs Windows and Microsoft Edge at " + EDGE + " (local only, not CI)");
    process.exit(2);
  }
  const build = spawnSync(process.execPath, [path.join(ROOT, "pages", "styles", "build-styles-page.js"), "--check"], { encoding: "utf8" });
  if (build.status !== 0) {
    console.error("probe: pages/styles/styles.html is not up to date: " + (build.stderr || build.stdout).trim());
    process.exit(1);
  }
  const before = execFileSync("git", ["show", o.before + ":pages/styles/styles.html"], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 << 20 });
  const after = fs.readFileSync(path.join(ROOT, "pages", "styles", "styles.html"), "utf8");
  const items = patchItems(fs.readFileSync(path.join(__dirname, "intended-changes.css"), "utf8").replace(/\r\n/g, "\n"));
  const harness = fs.readFileSync(path.join(__dirname, "harness.js"), "utf8");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "prime-ui-probe-"));
  console.log(`probe: before = ${o.before}:pages/styles/styles.html, after = pages/styles/styles.html (up to date)`);
  console.log("temp folder: " + tmp);

  const variants = items.map((it) => ({ name: "minus-" + it.id, off: [it.id], styles: ["toy"] }));
  const pages = {
    before: inject(before, { styles: STYLES, variants: [] }, [], harness),
    after: inject(after, { styles: STYLES, variants: [] }, [], harness),
    patched: inject(after, { styles: STYLES, variants }, items, harness),
  };
  const res = {};
  for (const name of Object.keys(pages)) {
    const file = path.join(tmp, "probe-" + name + ".html");
    fs.writeFileSync(file, pages[name]);
    const r = edge(tmp, name, file);
    res[name] = r.data;
    const recs = STYLES.map((s) => `${s} ${count(r.data.configs.base.rec[s])}`).join(", ");
    console.log(`edge ${name}: ${r.seconds.toFixed(1)} s; records ${recs}`);
  }
  if (!o.keep) for (const name of Object.keys(pages)) fs.rmSync(path.join(tmp, "edge-profile-" + name), { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });

  const F = res.before.fields, RF = res.before.rawFields, desc = res.before.desc;
  const B = res.before.configs.base, A = res.after.configs.base, P = res.patched.configs.base;
  let failed = 0;

  // comparison 1: after + reverse patch against before, the picture records of every style
  console.log("\n1. after + reverse patch vs before (must be zero for every style):");
  for (const s of STYLES) {
    const ds = diff(B.rec[s], P.rec[s], F);
    console.log(`   ${s}: ${count(B.rec[s])} elements, ${ds.length} differences`);
    for (const d of ds.slice(0, o.verbose ? Infinity : 20)) console.log("     " + line(d, desc));
    failed += ds.length;
  }

  // comparison 2: after against before, every difference attributed to an item of §15.3
  console.log("\n2. after vs before: the intended changes of spec §15.3");
  const perItem = {}; for (const k of Object.keys(ITEMS)) perItem[k] = { diffs: [], keys: new Set() };
  const unexplained = [];
  const itemDiffs = {};
  for (const it of items) {
    const v = res.patched.configs["minus-" + it.id];
    const full = overlay(P.rec.toy, v.rec.toy, v.missing.toy);
    itemDiffs[it.id] = new Set(diff(P.rec.toy, full, F).map((d) => d.key + "\u0000" + d.field));
  }
  for (const s of STYLES) {
    const ds = diff(B.rec[s], A.rec[s], F);
    for (const d of ds) {
      const hits = s === "toy" ? items.map((it) => it.id).filter((id) => itemDiffs[id].has(d.key + "\u0000" + d.field)) : [];
      if (!hits.length) { unexplained.push({ s, d }); continue; }
      for (const id of hits) { perItem[id].diffs.push(d); perItem[id].keys.add(d.key); }
    }
    // the declared box (padding, raw borders) after the reverse patch: what is left must be item 5
    for (const key of Object.keys(B.raw[s])) {
      if (!P.raw[s][key] || same(B.raw[s][key], P.raw[s][key])) continue;
      if (s === "toy" && item5(RF, B.raw[s][key], P.raw[s][key])) { perItem[5].keys.add(key); continue; }
      diff({ [key]: B.raw[s][key] }, { [key]: P.raw[s][key] }, RF).forEach((d) => unexplained.push({ s, d }));
    }
  }
  const place = (keys) => {
    const byScreen = {};
    for (const k of keys) { const [scr, , rest] = k.split("|"); byScreen[scr] = true; }
    const kinds = {};
    for (const k of keys) { const [scr, , rest] = k.split("|"); const dsc = desc[scr + "/" + rest] || "the frame"; kinds[dsc] = (kinds[dsc] || 0) + 1; }
    const top = Object.entries(kinds).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => `${k} x${n}`).join(", ");
    return `screens ${Object.keys(byScreen).join(" ")}; ${top}`;
  };
  for (const id of Object.keys(ITEMS)) {
    const p = perItem[id];
    console.log(`   item ${id}, ${ITEMS[id]}`);
    if (id === "5") {
      console.log(`     ${p.keys.size} element-states with the same picture and a different declared box (${p.keys.size ? place(p.keys) : "none"})`);
      if (p.keys.size) {
        const k = [...p.keys][0];
        const pick = (r) => `border ${r.slice(4, 8).join("/")} padding ${r.slice(0, 4).join("/")}`;
        console.log(`     e.g. ${k.split("|").slice(0, 2).join(" ")} ${desc[k.split("|")[0] + "/" + k.split("|")[2]]}: ${pick(B.raw.toy[k])} -> ${pick(P.raw.toy[k])}`);
      }
      continue;
    }
    if (!p.diffs.length) {
      console.log("     0 differences at the probe's 1920 px frame" + (id === "4" ? ", where 1 reference px = 1 px: the computed radius is 999px both before and after" : ""));
      continue;
    }
    const fields = {};
    for (const d of p.diffs) fields[d.field] = (fields[d.field] || 0) + 1;
    console.log(`     ${p.diffs.length} field differences on ${p.keys.size} element-states (${place(p.keys)})`);
    console.log("     fields: " + Object.entries(fields).map(([f, n]) => `${f} ${n}`).join(", "));
    const direct = { 1: "letter-spacing", 2: "bg", 3: "w", 4: "r-top-left" }[id];
    const sample = p.diffs.filter((d) => d.field === direct).concat(p.diffs.filter((d) => d.field !== direct));
    for (const d of sample.slice(0, o.verbose ? Infinity : 3)) console.log("     e.g. " + line(d, desc));
  }
  console.log(`   unexplained: ${unexplained.length}`);
  for (const u of unexplained.slice(0, o.verbose ? Infinity : 30)) console.log(`     ${u.s}: ${line(u.d, desc)}`);
  failed += unexplained.length;

  console.log(failed ? `\nFAILED: ${failed} difference(s)` : "\nZERO UNINTENDED CHANGES");
  process.exit(failed ? 1 : 0);
}

main();
