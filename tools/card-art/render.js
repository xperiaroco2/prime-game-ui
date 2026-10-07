// The how-to card art the game ships (prime-game-ui#3): the chosen clean-sketch panels rendered to PNG at 2x with a
// transparent background, so Godot draws the sketch exactly as the pages do (its SVG importer has no SVG filters, and
// the clean sketch's wobbly line is an feTurbulence filter). Local Windows + Microsoft Edge only, not CI.
//
//   node tools/card-art/render.js          render every card of CARDS into pages/card-art/png/ and write renders.json
//   node tools/card-art/render.js --check  no Edge: exit 1 when a PNG or renders.json is out of date with its SVG
//
// The game has one task type, Delivery, so only its four panels ship. Switches is a sample card of the card-art pages,
// not a game task: its SVGs stay in pages/ and are never rendered here.
//
// How: one headless Edge (tools/screens/edge.js) with a 320x240 viewport at device scale 2 and a transparent default
// background loads a page holding only the SVG as an <img>, and captures the viewport: a 640x480 RGBA PNG whose
// alpha is the panel's own. renders.json records each PNG's sha256 and the sha256 of its SVG (LF text), so the token
// build (tools/tokens/cards.js), which copies the PNGs into dist/pack/cards/ and lists them in the pack's assets, can
// refuse a PNG older than its SVG without Edge.
// Node 20, node's own modules only.
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");
const { pathToFileURL } = require("url");

const ROOT = path.resolve(__dirname, "..", "..");
const OUT = "pages/card-art/png";
const MANIFEST = `${OUT}/renders.json`;
const W = 320;
const H = 240;
const SCALE = 2;
const SRC = "pages/card-art/round-2/clean-sketch";
// the Delivery card: frame 4 shows the finish (ToyHowtoFrameDone)
const CARDS = [1, 2, 3, 4].map((i) => ({ png: `delivery-${i}.png`, source: `${SRC}/delivery-${i}.svg`, task: "delivery", frame: i }));

const abs = (rel) => path.join(ROOT, ...rel.split("/"));
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const svgText = (rel) => fs.readFileSync(abs(rel), "utf8").replace(/\r\n/g, "\n");

// 8-bit RGBA, not interlaced (what Edge writes): the size, the colour type and the alpha of a few pixels
function readPng(buf) {
  if (buf.length < 8 || buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  let off = 8, w = 0, h = 0, depth = 0, type = 0, inter = 0;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off), kind = buf.toString("latin1", off + 4, off + 8), data = buf.subarray(off + 8, off + 8 + len);
    if (kind === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; type = data[9]; inter = data[12]; }
    else if (kind === "IDAT") idat.push(data);
    else if (kind === "IEND") break;
    off += 12 + len;
  }
  if (depth !== 8 || type !== 6 || inter) return { w, h, type, alpha: null };
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = 4, stride = w * bpp, px = Buffer.alloc(h * stride);
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
  let clear = 0, opaque = 0;
  for (let i = 3; i < px.length; i += 4) { if (px[i] === 0) clear++; else if (px[i] === 255) opaque++; }
  return { w, h, type, alpha: { corner: px[3], clear, opaque, total: w * h } };
}

function manifestText(entries) {
  const lines = entries.map((e) => "    " + JSON.stringify(e));
  return "{\n"
    + `  "about": ${JSON.stringify(`The how-to card art the pack ships, rendered by tools/card-art/render.js from the clean-sketch SVGs at ${SCALE}x (${W * SCALE}x${H * SCALE}, transparent background). source_sha256 is the SVG's LF text, png_sha256 the PNG's bytes; tools/tokens/cards.js copies each PNG into dist/pack/cards/ and refuses one whose SVG changed since.`)},\n`
    + `  "renders": [\n${lines.join(",\n")}\n  ]\n}\n`;
}

function entryOf(card, png) {
  return { png: card.png, source: card.source, source_sha256: sha256(Buffer.from(svgText(card.source), "utf8")),
    size: [W * SCALE, H * SCALE], scale: SCALE, png_sha256: sha256(png), task: card.task, frame: card.frame };
}

// every problem of the PNGs and renders.json against the SVGs, without Edge
function check() {
  const problems = [];
  let m = null;
  try { m = JSON.parse(fs.readFileSync(abs(MANIFEST), "utf8")); } catch (e) { return [`${MANIFEST}: ${e.message}`]; }
  const list = Array.isArray(m.renders) ? m.renders : [];
  if (list.length !== CARDS.length) problems.push(`${MANIFEST} lists ${list.length} renders, CARDS ${CARDS.length}`);
  for (const card of CARDS) {
    const e = list.find((x) => x && x.png === card.png);
    if (!e) { problems.push(`${MANIFEST}: no render ${card.png}`); continue; }
    let png;
    try { png = fs.readFileSync(abs(`${OUT}/${card.png}`)); } catch (err) { problems.push(`${OUT}/${card.png} is missing`); continue; }
    const want = entryOf(card, png);
    if (JSON.stringify(e) !== JSON.stringify(want)) problems.push(`${card.png}: stale (its SVG, PNG or record changed): run node tools/card-art/render.js`);
    const p = readPng(png);
    if (p.w !== W * SCALE || p.h !== H * SCALE || !p.alpha || p.alpha.corner !== 0 || !p.alpha.clear || !p.alpha.opaque) {
      problems.push(`${card.png}: not a ${W * SCALE}x${H * SCALE} RGBA PNG with a transparent background (${JSON.stringify(p.alpha)})`);
    }
  }
  return problems;
}

async function render() {
  const { launch } = require("../screens/edge.js");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "prime-ui-card-art-"));
  const edge = await launch();
  const entries = [];
  try {
    const page = edge.page;
    await page.send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: SCALE, mobile: false });
    await page.send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
    fs.mkdirSync(abs(OUT), { recursive: true });
    for (const card of CARDS) {
      const html = path.join(tmp, card.png.replace(/\.png$/, ".html"));
      fs.writeFileSync(html, "<!doctype html><html><head><meta charset=\"utf-8\"><style>html,body{margin:0;background:transparent}"
        + `img{display:block;width:${W}px;height:${H}px}</style></head><body><img alt="" src="${pathToFileURL(abs(card.source)).href}">`
        + "<script>const i=document.querySelector('img');const ok=()=>document.documentElement.dataset.ready='1';"
        + "i.complete?ok():(i.onload=ok,i.onerror=()=>document.documentElement.dataset.ready='error');</script></body></html>");
      await page.open(pathToFileURL(html).href, 30);
      const r = await page.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false,
        clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
      const png = Buffer.from(r.data, "base64");
      const p = readPng(png);
      if (p.w !== W * SCALE || p.h !== H * SCALE || !p.alpha || p.alpha.corner !== 0) {
        throw new Error(`${card.png}: Edge gave a ${p.w}x${p.h} PNG of colour type ${p.type}, corner alpha ${p.alpha && p.alpha.corner}; want ${W * SCALE}x${H * SCALE} RGBA with a transparent background`);
      }
      fs.writeFileSync(abs(`${OUT}/${card.png}`), png);
      entries.push(entryOf(card, png));
      console.log(`${OUT}/${card.png}  ${p.w}x${p.h}  ${png.length} bytes  ${Math.round((100 * p.alpha.clear) / p.alpha.total)}% transparent`);
    }
  } finally {
    await edge.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  fs.writeFileSync(abs(MANIFEST), manifestText(entries));
  console.log(`wrote ${MANIFEST}; now run node tools/tokens/build.js to copy them into dist/pack/cards/`);
}

async function main(argv) {
  if (argv.length === 1 && argv[0] === "--check") {
    const problems = check();
    for (const p of problems) console.log(p);
    console.log(problems.length ? `${problems.length} problem(s)` : `up to date: ${CARDS.length} card PNGs`);
    return problems.length ? 1 : 0;
  }
  if (argv.length) { console.error("usage: node tools/card-art/render.js [--check]"); return 2; }
  await render();
  const problems = check();
  for (const p of problems) console.log(p);
  return problems.length ? 1 : 0;
}

if (require.main === module) main(process.argv.slice(2)).then((c) => { process.exitCode = c; }, (e) => { console.error(e.stack || e.message); process.exitCode = 2; });

module.exports = { CARDS, OUT, MANIFEST, W, H, SCALE, readPng, check };
