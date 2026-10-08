// The fonts the game imports beside the pack (spec §9.1 `assets`, since ui-0.5.0), written to dist/pack/fonts/ by the
// token build.
//
//   fonts/<file>.ttf       each font of fonts/<family>/ that has a record in its LICENCES.json, copied byte for byte
//   fonts/<licence text>   the licence text its record names (`licence_text`, e.g. OFL.txt), byte for byte
//   fonts/LICENCES.json    the records of both
//
// A third-party font ships unmodified (OFL's Reserved Font Name), so the build refuses (B04) a file whose sha256 is not
// the one its record holds, a record without an allowed licence or its licence text, a family the tokens do not name
// (`font.family.*`) and a token weight (`font.weight.*`) outside the font's `wght` axis. A root without fonts/ (a test
// fixture, an overlay's temporary copy) has no fonts. Node 20, no packages.
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { LICENCES_OK } = require('./icons.js');

const OUT = 'dist/pack/fonts';
const SRC = 'fonts';
const PRIMITIVES = 'tokens/primitives.tokens.json';

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const values = (group) => Object.entries(group || {}).filter(([k, v]) => !k.startsWith('$') && v && '$value' in v).map(([, v]) => v.$value);

// { outputs: { 'dist/pack/fonts/<file>': Buffer, 'dist/pack/fonts/LICENCES.json': text }, assets, problems: [text] }
function fontSet(root) {
  const abs = (rel) => path.join(root, ...rel.split('/'));
  const out = { outputs: {}, assets: [], problems: [] };
  if (!fs.existsSync(abs(SRC))) return out;
  let font;
  try { font = JSON.parse(fs.readFileSync(abs(PRIMITIVES), 'utf8')).font || {}; } catch (e) { out.problems.push(`${PRIMITIVES}: ${e.message}`); return out; }
  const families = values(font.family);
  const weights = values(font.weight).map(Number).sort((a, b) => a - b);
  const records = [];
  const shipped = new Map();
  const ship = (name, buf, from) => {
    if (shipped.has(name) && shipped.get(name) !== sha256(buf)) { out.problems.push(`${from} and another font's file both ship as ${OUT}/${name}`); return; }
    shipped.set(name, sha256(buf));
    out.outputs[`${OUT}/${name}`] = buf;
  };
  const dirs = fs.readdirSync(abs(SRC), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
  for (const d of dirs) {
    const dir = `${SRC}/${d}`;
    let recs;
    try { recs = JSON.parse(fs.readFileSync(abs(`${dir}/LICENCES.json`), 'utf8')); } catch (e) { out.problems.push(`${dir}/LICENCES.json: ${e.message}`); continue; }
    const files = fs.readdirSync(abs(dir)).filter((f) => f !== 'LICENCES.json').sort();
    for (const f of files) if (!recs[f]) out.problems.push(`${dir}/${f} has no record in ${dir}/LICENCES.json`);
    for (const f of files.filter((x) => /\.(ttf|otf)$/i.test(x))) {
      const rec = recs[f];
      if (!rec) continue;
      const where = `${dir}/${f}`;
      if (typeof rec.licence !== 'string' || !LICENCES_OK.test(rec.licence)) { out.problems.push(`${where} has no allowed licence in ${dir}/LICENCES.json`); continue; }
      const buf = fs.readFileSync(abs(where));
      if (sha256(buf) !== rec.sha256) { out.problems.push(`${where} is not the file its record holds (sha256): a third-party font ships unmodified`); continue; }
      const text = rec.licence_text;
      if (!text || !recs[text] || !fs.existsSync(abs(`${dir}/${text}`))) { out.problems.push(`${where}: its licence text ${text || '(none named)'} is missing`); continue; }
      const textBuf = fs.readFileSync(abs(`${dir}/${text}`));
      if (sha256(textBuf) !== recs[text].sha256) { out.problems.push(`${dir}/${text} is not the file its record holds (sha256)`); continue; }
      if (!families.includes(rec.family)) out.problems.push(`${where}: family ${rec.family} is not a font.family token (${families.join(', ')})`);
      const axis = rec.axes && rec.axes.wght;
      const used = axis ? weights.filter((w) => w >= axis[0] && w <= axis[1]) : [];
      for (const w of weights) if (!used.includes(w)) out.problems.push(`${where}: the token weight ${w} is outside its wght axis ${axis ? axis.join('..') : '(none)'}`);
      ship(f, buf, where);
      ship(text, textBuf, `${dir}/${text}`);
      for (const [name, r] of [[f, rec], [text, recs[text]]]) {
        records.push(`  ${JSON.stringify(name)}: ${JSON.stringify(Object.assign({}, r, { source: `${dir}/${name}` }), null, 0).replace(/":/g, '": ').replace(/,"/g, ', "')}`);
      }
      out.assets.push({ path: `fonts/${f}`, kind: 'font', sha256: rec.sha256, licence: rec.licence, licence_file: 'fonts/LICENCES.json',
        licence_text: `fonts/${text}`, source: where, family: rec.family, axes: rec.axes, weights: used });
    }
  }
  if (out.assets.length) out.outputs[`${OUT}/LICENCES.json`] = `{\n${records.join(',\n')}\n}\n`;
  return out;
}

module.exports = { fontSet, OUT };
