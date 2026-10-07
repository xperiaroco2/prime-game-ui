// The how-to card art the game imports beside the pack (spec §9.1 `assets`, since ui-0.4.0), written to
// dist/pack/cards/ by the token build.
//
//   cards/<name>.png       the PNGs tools/card-art/render.js renders from the chosen clean-sketch panels (2x, 640x480,
//                          transparent), listed in pages/card-art/png/renders.json; copied byte for byte.
//   cards/LICENCES.json    the licence record of each PNG's SVG (pages/card-art/round-2/clean-sketch/LICENCES.json).
//
// The PNGs are rendered with Edge, which CI does not have, so the build does not render: it refuses a PNG whose bytes or
// whose SVG changed since renders.json was written (run node tools/card-art/render.js), and an SVG without an allowed
// licence record. A root without renders.json (a test fixture, an overlay's temporary copy) has no card art.
// Node 20, no packages.
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { LICENCES_OK } = require('./icons.js');

const OUT = 'dist/pack/cards';
const MANIFEST = 'pages/card-art/png/renders.json';
const PNG_DIR = 'pages/card-art/png';

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

// { outputs: { 'dist/pack/cards/<name>.png': Buffer, 'dist/pack/cards/LICENCES.json': text }, assets, problems: [text] }
function cardSet(root) {
  const abs = (rel) => path.join(root, ...rel.split('/'));
  const out = { outputs: {}, assets: [], problems: [] };
  if (!fs.existsSync(abs(MANIFEST))) return out;
  let list;
  try { list = JSON.parse(fs.readFileSync(abs(MANIFEST), 'utf8')).renders; } catch (e) { out.problems.push(`${MANIFEST}: ${e.message}`); return out; }
  if (!Array.isArray(list) || !list.length) { out.problems.push(`${MANIFEST}: "renders" is a non-empty array`); return out; }
  const licences = new Map();
  const records = [];
  for (const r of list) {
    const where = `${MANIFEST} ${r && r.png}`;
    if (!r || typeof r.png !== 'string' || !/^[a-z0-9-]+\.png$/.test(r.png) || typeof r.source !== 'string') { out.problems.push(`${where}: a render is {png, source, source_sha256, size, scale, png_sha256, task, frame}`); continue; }
    let png, svg;
    try { png = fs.readFileSync(abs(`${PNG_DIR}/${r.png}`)); } catch { out.problems.push(`${PNG_DIR}/${r.png} is missing: run node tools/card-art/render.js`); continue; }
    try { svg = fs.readFileSync(abs(r.source), 'utf8').replace(/\r\n/g, '\n'); } catch { out.problems.push(`${where}: its source ${r.source} is missing`); continue; }
    if (sha256(png) !== r.png_sha256) out.problems.push(`${PNG_DIR}/${r.png} is not the PNG renders.json records: run node tools/card-art/render.js`);
    if (sha256(Buffer.from(svg, 'utf8')) !== r.source_sha256) out.problems.push(`${r.source} changed since ${r.png} was rendered: run node tools/card-art/render.js`);
    const dir = path.posix.dirname(r.source);
    if (!licences.has(dir)) {
      let recs = {};
      try { recs = JSON.parse(fs.readFileSync(abs(`${dir}/LICENCES.json`), 'utf8')); } catch { recs = {}; }
      licences.set(dir, recs);
    }
    const rec = licences.get(dir)[path.posix.basename(r.source)];
    if (!rec || typeof rec.licence !== 'string' || !LICENCES_OK.test(rec.licence)) {
      out.problems.push(`${r.source} has no allowed licence record in ${dir}/LICENCES.json`);
      continue;
    }
    out.outputs[`${OUT}/${r.png}`] = png;
    records.push(`  ${JSON.stringify(r.png)}: ${JSON.stringify({ licence: rec.licence, author: rec.author, what: rec.what, source: r.source }).replace(/":/g, '": ').replace(/,"/g, ', "')}`);
    const a = { path: `cards/${r.png}`, kind: 'card-art', sha256: r.png_sha256, licence: rec.licence, licence_file: 'cards/LICENCES.json',
      source: r.source, size: r.size, task: r.task, frame: r.frame };
    if (list.filter((x) => x && x.task === r.task).every((x) => x.frame <= r.frame)) a.done = true;
    out.assets.push(a);
  }
  if (out.assets.length) out.outputs[`${OUT}/LICENCES.json`] = `{\n${records.join(',\n')}\n}\n`;
  return out;
}

module.exports = { cardSet, OUT, MANIFEST };
