// PNG pictures of the styled screens for review (wave prime-game-ui#19): one per screen, state, language and text
// size, taken from the page's single-frame measuring mode. Local Windows + Microsoft Edge only, not CI (tools/check.js
// does not run it). The pictures go to a folder outside the repo; reviewers read them from there.
//
//   node tools/screens/shots.js [--screens s2,s5] [--lang uk|en] [--size default|large] [--scale 0.5] [--out <dir>]
//                               [--page <file>] [--timeout <s>] [--keep] [--self-test]
//     --screens   only these screens (data-screen; s02 and s2 are the same); default: every frame of the page
//     --lang      one language; default: uk and en
//     --size      one text size; default: default and large
//     --scale     picture scale, 0.1 to 1 (default 1 = 1920x1080 px; 0.5 = 960x540, a cheap review copy)
//     --out       the folder for the pictures, created if missing; it must be outside the repo
//                 (default: a new folder prime-ui-shots-* in the OS temp folder)
//     --page      another page that follows the contract (default: pages/screens/screens.html)
//     --timeout   seconds to wait for <html data-ready="1"> per page load (default 60)
//     --keep      keep Edge's temp folder (profile, stderr)
//     --self-test pictures of the fixture tools/screens/fixtures/screens-fixture.html: the names, the sizes (also at
//                 --scale 0.5), each picture showing its own frame, the languages and sizes differing
//
// How: one headless Edge (tools/screens/edge.js) with a 1920x1080 viewport loads screens.html?only=all once to list the
// frames (in source order), then, per language, size and frame, screens.html?only=<screen>:<state>&lang=..&size=..
// (the frame alone at the viewport's top-left, 1 reference px = 1 CSS px), waits for <html data-ready="1">, checks
// that Comfortaa is loaded (if not, the run stops: the pictures would show a fallback font) and captures the viewport.
// Names: s02-main-uk-default.png (the screen number in two digits, the state, the language, the size).
// It prints the folder and the files, and a warning when the single-frame view breaks the contract (another frame
// shown, the frame not at 0,0 or not 1920x1080, wrong lang attributes). Exit 0 when every picture was taken, 1 when
// there were warnings, 2 when it could not run.
// Node's own modules only.
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const zlib = require("zlib");
const { launch, haveEdge, W, H } = require("./edge.js");
const { frameList, fontState } = require("./measure.js");
const C = require("./common.js");

const USAGE = "usage: node tools/screens/shots.js [--screens s2,s5] [--lang uk|en] [--size default|large] [--scale 0.5] " +
  "[--out <dir>] [--page <file>] [--timeout <s>] [--keep] [--self-test]";

function fileName(screen, state, lang, size) {
  const m = /^s(\d+)$/.exec(screen || "");
  const s = m ? "s" + m[1].padStart(2, "0") : String(screen).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const st = String(state).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${s}-${st}-${lang}-${size}.png`;
}

function insideRepo(dir) {
  const r = path.relative(C.ROOT, path.resolve(dir));
  return !r || (!r.startsWith("..") && !path.isAbsolute(r));
}

async function frameState(edge) {
  return JSON.parse(await edge.page.eval(`(${frameList})(${fontState})`));
}

// returns { files, warnings }
async function takeShots(edge, o, outDir) {
  await edge.page.open(C.pageUrl(o.page, { only: "all", lang: o.langs[0], size: o.sizes[0] }), o.timeout);
  const all = await frameState(edge);
  const frames = all.frames.filter((f) => !o.screens || o.screens.includes(f.screen));
  if (!frames.length) throw new Error("no frames in " + C.rel(o.page) + (o.screens ? " for --screens " + o.screens.join(",") : "") + " (no .sc-frame[data-screen][data-state])");
  const files = [], warnings = [], used = new Set();
  for (const lang of o.langs) for (const size of o.sizes) for (const f of frames) {
    const id = f.screen + ":" + f.state;
    await edge.page.open(C.pageUrl(o.page, { only: id, lang, size }), o.timeout);
    const st = await frameState(edge);
    const err = C.fontVerdict(st.fonts, `${id} ${lang}/${size}`, edge.page.failed);
    if (err) throw err;
    const where = `${id} ${lang}/${size}`;
    const shown = st.frames.filter((x) => x.visible);
    if (shown.length !== 1 || shown[0].screen !== f.screen || shown[0].state !== f.state) {
      warnings.push(`${where}: ?only=${id} shows ${shown.length} frame(s): ${shown.map((x) => x.screen + ":" + x.state).join(", ") || "none"}`);
    } else {
      const b = shown[0].box;
      if (Math.abs(b.x) > 0.5 || Math.abs(b.y) > 0.5 || Math.abs(b.w - W) > 0.5 || Math.abs(b.h - H) > 0.5) {
        warnings.push(`${where}: the frame is at ${b.x},${b.y} and ${b.w}x${b.h}, not at 0,0 and ${W}x${H}`);
      }
    }
    if (st.lang !== lang || st.dataLang !== lang || st.size !== size) {
      warnings.push(`${where}: <html lang="${st.lang}" data-lang="${st.dataLang}" data-text-size="${st.size}">`);
    }
    if (edge.page.errors.length) warnings.push(`${where}: page errors: ${edge.page.errors.slice(0, 2).join(" | ")}`);
    let name = fileName(f.screen, f.state, lang, size);
    for (let k = 2; used.has(name); k++) name = fileName(f.screen, f.state + "-" + k, lang, size);
    used.add(name);
    fs.writeFileSync(path.join(outDir, name), await edge.page.shot({ scale: o.scale }));
    files.push(name);
  }
  return { files, warnings };
}

// ---- a small PNG reader for the self-test (8-bit RGB or RGBA, not interlaced: what Edge writes) ---------------
function readPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  let off = 8, w = 0, h = 0, depth = 0, type = 0, inter = 0;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off), kind = buf.toString("latin1", off + 4, off + 8), data = buf.subarray(off + 8, off + 8 + len);
    if (kind === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; type = data[9]; inter = data[12]; }
    else if (kind === "IDAT") idat.push(data);
    else if (kind === "IEND") break;
    off += 12 + len;
  }
  const bpp = type === 6 ? 4 : type === 2 ? 3 : 0;
  if (depth !== 8 || !bpp || inter) return { w, h, pixel: null };
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * bpp, px = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = y * (stride + 1) + 1, dst = y * stride;
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? px[dst + i - bpp] : 0, b = y ? px[dst - stride + i] : 0, c = i >= bpp && y ? px[dst - stride + i - bpp] : 0;
      let v = raw[src + i];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      px[dst + i] = v & 0xff;
    }
  }
  const pixel = (x, y) => { const i = y * stride + x * bpp; return "#" + [px[i], px[i + 1], px[i + 2]].map((n) => n.toString(16).padStart(2, "0")).join(""); };
  return { w, h, pixel };
}

async function selfTest(o) {
  let failed = 0;
  const say = (ok, name, more) => { if (!ok) failed++; console.log((ok ? "ok   " : "FAIL ") + name + (ok || !more ? "" : "\n     " + more)); };
  say(fileName("s2", "main", "uk", "default") === "s02-main-uk-default.png" && fileName("s10", "Lobby Full", "en", "large") === "s10-lobby-full-en-large.png",
    "names: s02-main-uk-default.png, s10-lobby-full-en-large.png");
  say(insideRepo(path.join(C.ROOT, "pages")) && !insideRepo(os.tmpdir()), "--out inside the repo is refused, the temp folder is not");
  if (!haveEdge()) { console.log("FAIL the fixture tests need Windows and Edge"); process.exit(1); }
  const t0 = Date.now();
  const edge = await launch({ keep: o.keep });
  const dirs = [];
  try {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "prime-ui-shots-selftest-"));
    dirs.push(out);
    const base = Object.assign({}, o, { page: C.FIXTURE, screens: null, langs: C.LANGS, sizes: C.SIZES, scale: 1 });
    const r = await takeShots(edge, base, out);
    const want = [];
    for (const l of C.LANGS) for (const s of C.SIZES) want.push(`s01-broken-${l}-${s}.png`, `s02-clean-${l}-${s}.png`);
    say(JSON.stringify(r.files) === JSON.stringify(want), "fixture: one picture per frame, language and size, named by the rule", JSON.stringify(r.files));
    say(r.warnings.length === 0, "fixture: no contract warnings", r.warnings.join("\n     "));
    const png = {};
    for (const f of r.files) png[f] = readPng(fs.readFileSync(path.join(out, f)));
    say(r.files.every((f) => png[f].w === W && png[f].h === H), `fixture: every picture is ${W}x${H}`, r.files.map((f) => `${f} ${png[f].w}x${png[f].h}`).join(", "));
    const corner = (f) => png[f].pixel ? png[f].pixel(W - 10, H - 10) : "?";
    say(r.files.every((f) => corner(f) === (f.startsWith("s01") ? "#20304a" : "#f9d65c")), "fixture: each picture shows its own frame (its background in the corner)",
      r.files.map((f) => `${f} ${corner(f)}`).join(", "));
    const bytes = (f) => fs.readFileSync(path.join(out, f));
    say(!bytes("s02-clean-uk-default.png").equals(bytes("s02-clean-en-default.png")), "fixture: uk and en pictures differ");
    say(!bytes("s02-clean-uk-default.png").equals(bytes("s02-clean-uk-large.png")), "fixture: default and large pictures differ");
    const out2 = fs.mkdtempSync(path.join(os.tmpdir(), "prime-ui-shots-selftest-"));
    dirs.push(out2);
    const r2 = await takeShots(edge, Object.assign({}, base, { screens: ["s2"], langs: ["en"], sizes: ["large"], scale: 0.5 }), out2);
    const p2 = r2.files.length === 1 ? readPng(fs.readFileSync(path.join(out2, r2.files[0]))) : null;
    say(p2 && r2.files[0] === "s02-clean-en-large.png" && p2.w === W / 2 && p2.h === H / 2 && p2.pixel && p2.pixel(W / 2 - 5, H / 2 - 5) === "#f9d65c",
      "--screens s2 --lang en --size large --scale 0.5: one 960x540 picture of s2", JSON.stringify(r2.files) + (p2 ? ` ${p2.w}x${p2.h}` : ""));
  } finally {
    await edge.close();
    for (const d of dirs) fs.rmSync(d, { recursive: true, force: true });
  }
  console.log(failed ? `\nSELF-TEST FAILED: ${failed}` : `\nSELF-TEST OK (${((Date.now() - t0) / 1000).toFixed(1)} s in Edge)`);
  process.exit(failed ? 1 : 0);
}

async function main() {
  const o = C.parseArgs(process.argv.slice(2), USAGE, { "--out": ["out", true], "--scale": ["scale", true] });
  o.scale = o.scale === undefined ? 1 : Number(o.scale);
  if (!(o.scale >= 0.1 && o.scale <= 1)) { console.error(USAGE + "\n--scale is a number from 0.1 to 1"); process.exit(2); }
  if (o.selfTest) return selfTest(o);
  if (!haveEdge()) { console.error("shots: needs Windows and Microsoft Edge (local only, not CI)"); process.exit(2); }
  if (o.out && insideRepo(o.out)) { console.error("shots: --out must be outside the repo (the pictures are not committed): " + path.resolve(o.out)); process.exit(2); }
  const pc = C.checkPage(o.page);
  if (!pc.ok) { console.error("shots: " + pc.why); process.exit(2); }
  for (const w of pc.warn) console.log("warning: " + w);
  const out = o.out ? path.resolve(o.out) : fs.mkdtempSync(path.join(os.tmpdir(), "prime-ui-shots-"));
  fs.mkdirSync(out, { recursive: true });
  const t0 = Date.now();
  const edge = await launch({ keep: o.keep });
  let r;
  try {
    r = await takeShots(edge, o, out);
  } finally {
    await edge.close();
  }
  console.log(`shots: ${C.rel(o.page)}, ${r.files.length} picture(s) at scale ${o.scale} (${Math.round(W * o.scale)}x${Math.round(H * o.scale)}), ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  console.log("folder: " + out);
  for (const f of r.files) console.log("  " + f);
  for (const w of r.warnings) console.log("warning: " + w);
  process.exit(r.warnings.length ? 1 : 0);
}

main().catch((e) => {
  console.error("shots: " + (e && e.message ? e.message : e));
  process.exit(2);
});
