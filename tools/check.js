// The one entry point (spec §12.1): every check of this repo, each as a child process, even after a failure.
//
//   node tools/check.js                          every step
//   node tools/check.js --only lint,gates        only these steps
//   node tools/check.js --release ui-X.Y.Z       every step plus the release checks of spec §9.2
//   node tools/check.js --only release --release ui-X.Y.Z
//
// Each step prints one line: name, OK, FAIL or MISSING (its script is not in the repo yet), seconds. The output of
// every failing step follows. The last line is ALL CLEAN or FAILED: n. Exit 1 on any FAIL or MISSING.
// Node's own modules only; works on node 20, 22 and 24.
"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync, execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const STEPS = [
  ["tokens:selftest", ["tools/tokens/test/run.js"]],
  ["tokens", ["tools/tokens/build.js", "--check"]],
  ["lint:selftest", ["tools/lint/godot-css.js", "--self-test"]],
  ["lint", ["tools/lint/godot-css.js"]],
  ["gates:selftest", ["tools/contrast/gates.js", "--self-test"]],
  ["gates", ["tools/contrast/gates.js", "--check"]],
  ["legacy-skins", ["pages/styles/check_styles.js", "retro", "card"]],
  ["page:styles", ["pages/styles/build-styles-page.js", "--check"]],
  ["page:components", ["pages/components/build.js", "--check"]],
  ["page:choices", ["pages/choices/build.js", "--check"]],
  ["page:room-signs", ["pages/room-signs/build.js", "--check"]],
  ["copy", ["tools/copy/check.js"]],
  ["page:copy", ["pages/copy/build.js", "--check"]],
  ["screens:selftest", ["pages/screens/build.js", "--self-test"]],
  ["screens", ["pages/screens/build.js", "--validate"]],
  ["page:screens", ["pages/screens/build.js", "--check"]],
  // the self-test only: CI has no manager transcripts
  ["manager:selftest", ["tools/manager/context.js", "--self-test"]],
];
const MAX_LINES = 200;

function parseArgs(argv) {
  const o = { only: null, release: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--only" || a === "--release" || a === "--release-step") {
      if (i + 1 >= argv.length) throw new Error("missing value for " + a);
      o[a === "--only" ? "only" : a === "--release" ? "release" : "releaseStep"] = argv[++i];
    } else throw new Error("unknown argument " + a);
  }
  return o;
}

// ---------- release checks (spec §9.2), run as the child step "release" ----------

const semver = v => { const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v || ""); return m ? m.slice(1).map(Number) : null; };
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

function releaseCheck(tag) {
  const problems = [];
  const m = /^ui-(\d+\.\d+\.\d+)$/.exec(tag);
  if (!m) { console.log(`tag ${tag} is not ui-X.Y.Z`); return 1; }
  const version = m[1];
  const read = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
  let release, pack;
  try { release = read("tokens/release.json"); } catch (e) { problems.push("tokens/release.json: " + e.message); }
  try { pack = read("dist/pack/toy.pack.json"); } catch (e) { problems.push("dist/pack/toy.pack.json: " + e.message); }
  if (release && release.version !== version) problems.push(`tag ${tag} but tokens/release.json says ${release.version}`);
  if (pack && pack.version !== version) problems.push(`tag ${tag} but the pack version is ${pack.version}`);
  if (pack) {
    let tags = [];
    try { tags = execFileSync("git", ["tag", "--list", "ui-*"], { cwd: ROOT, encoding: "utf8" }).split(/\r?\n/).filter(Boolean); }
    catch (e) { problems.push("git tag failed: " + e.message); }
    const prev = tags.map(t => ({ t, v: semver(t.slice(3)) })).filter(x => x.v && cmp(x.v, semver(version)) < 0).sort((a, b) => cmp(b.v, a.v))[0];
    if (!prev) console.log(`no earlier ui-* tag: any version is accepted`);
    else {
      let old = null;
      try { old = JSON.parse(execFileSync("git", ["show", `${prev.t}:dist/pack/toy.pack.json`], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 })); }
      catch (e) { problems.push(`cannot read dist/pack/toy.pack.json at ${prev.t}: ${e.message.split("\n")[0]}`); }
      if (old) {
        const need = requiredBump(old, pack);
        const got = bumpOf(prev.v, semver(version));
        const rank = { none: 0, patch: 1, minor: 2, major: 3 };
        console.log(`previous ${prev.t}: the diff needs a ${need.level} bump (${need.why}); ${prev.v.join(".")} -> ${version} is a ${got} bump`);
        if (rank[got] < rank[need.level]) problems.push(`the bump ${got} is smaller than the ${need.level} bump the diff needs`);
      }
    }
  }
  for (const p of problems) console.log("RELEASE " + p);
  return problems.length ? 1 : 0;
}

function requiredBump(old, cur) {
  if (old.schema !== cur.schema) return { level: "major", why: `schema ${old.schema} -> ${cur.schema}` };
  // the reasons are kept per level; the report names the first five of the level the diff needs
  const why = { patch: [], minor: [], major: [] };
  let level = "none";
  const raise = (l, w) => { const r = { none: 0, patch: 1, minor: 2, major: 3 }; if (r[l] > r[level]) level = l; why[l].push(w); };
  const ot = old.tokens || {}, nt = cur.tokens || {};
  for (const k of Object.keys(ot)) {
    if (!(k in nt)) raise("major", "token removed: " + k);
    else if (ot[k].type !== nt[k].type) raise("major", "token retyped: " + k);
    else if (JSON.stringify(ot[k]) !== JSON.stringify(nt[k])) raise("patch", "value changed: " + k);
  }
  for (const k of Object.keys(nt)) if (!(k in ot)) raise("minor", "token added: " + k);
  const ov = old.variations || {}, nv = cur.variations || {};
  // a variation's optional members (textures, deprecated): one added is a minor bump, one removed a major
  for (const k of Object.keys(ov)) {
    if (!(k in nv)) raise("major", "variation removed: " + k);
    else if (ov[k].class !== nv[k].class) raise("major", "variation retyped: " + k);
    else if (JSON.stringify(ov[k]) !== JSON.stringify(nv[k])) {
      const gone = Object.keys(ov[k]).filter(f => !(f in nv[k]));
      const added = Object.keys(nv[k]).filter(f => !(f in ov[k]));
      if (gone.length) raise("major", `variation member removed: ${k}.${gone[0]}`);
      if (added.length) raise("minor", `variation member added: ${k}.${added[0]}`);
      if (!gone.length && !added.length) raise("patch", "variation changed: " + k);
    }
  }
  for (const k of Object.keys(nv)) if (!(k in ov)) raise("minor", "variation added: " + k);
  if (JSON.stringify(old.modes) !== JSON.stringify(cur.modes)) raise("patch", "mode values changed");
  // assets (spec §9.1): files beside the JSON, by path
  const oa = new Map((old.assets || []).map(a => [a.path, a])), na = new Map((cur.assets || []).map(a => [a.path, a]));
  for (const [p, a] of oa) {
    if (!na.has(p)) raise("major", "asset removed: " + p);
    else if (JSON.stringify(a) !== JSON.stringify(na.get(p))) raise("patch", "asset changed: " + p);
  }
  for (const p of na.keys()) if (!oa.has(p)) raise("minor", "asset added: " + p);
  // top-level members: a new one is a minor bump, a removed one a major
  for (const k of Object.keys(old)) if (!(k in cur)) raise("major", "pack member removed: " + k);
  for (const k of Object.keys(cur)) if (!(k in old)) raise("minor", "pack member added: " + k);
  const list = level === "none" ? [] : why[level];
  const more = list.length > 5 ? `; and ${list.length - 5} more` : "";
  return { level, why: list.length ? list.slice(0, 5).join("; ") + more : "no change" };
}

function bumpOf(a, b) {
  if (b[0] !== a[0]) return "major";
  if (b[1] !== a[1]) return "minor";
  if (b[2] !== a[2]) return "patch";
  return "none";
}

// ---------- the runner ----------

function main() {
  let o;
  try { o = parseArgs(process.argv.slice(2)); } catch (e) { console.error(e.message); return 2; }
  if (o.releaseStep) return releaseCheck(o.releaseStep);
  const steps = STEPS.slice();
  if (o.release) steps.push(["release", [path.relative(ROOT, __filename).split(path.sep).join("/"), "--release-step", o.release]]);
  let chosen = steps;
  if (o.only) {
    const names = o.only.split(",").map(s => s.trim()).filter(Boolean);
    const unknown = names.filter(n => !steps.some(s => s[0] === n));
    if (unknown.length) { console.error(`unknown step ${unknown.join(", ")}${unknown.includes("release") ? " (release needs --release ui-X.Y.Z)" : ""}; steps: ${steps.map(s => s[0]).join(", ")}`); return 2; }
    chosen = steps.filter(s => names.includes(s[0]));
  }
  let bad = 0;
  const width = Math.max(...chosen.map(s => s[0].length));
  for (const [name, args] of chosen) {
    const script = path.join(ROOT, args[0]);
    if (!fs.existsSync(script)) { bad++; console.log(`${name.padEnd(width)}  MISSING  ${args[0]} is not in the repo yet`); continue; }
    const t0 = process.hrtime.bigint();
    const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28, env: process.env });
    const secs = (Number(process.hrtime.bigint() - t0) / 1e9).toFixed(1);
    const ok = r.status === 0 && !r.error;
    console.log(`${name.padEnd(width)}  ${ok ? "OK  " : "FAIL"}     ${secs}s`);
    if (!ok) {
      bad++;
      const out = ((r.stdout || "") + (r.stderr || "") + (r.error ? "\n" + r.error.message : "") + (r.signal ? "\nkilled by " + r.signal : "")).replace(/\s+$/, "");
      const lines = out.split(/\r?\n/);
      const shown = lines.length > MAX_LINES ? lines.slice(0, MAX_LINES).concat([`… ${lines.length - MAX_LINES} more lines (run node ${args.join(" ")})`]) : lines;
      console.log(shown.map(l => "    " + l).join("\n") + "\n");
    }
  }
  console.log(bad ? `FAILED: ${bad}` : "ALL CLEAN");
  return bad ? 1 : 0;
}

process.exitCode = main();
