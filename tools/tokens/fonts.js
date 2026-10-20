// The fonts the game imports beside the pack (spec §9.1 `assets`, since ui-0.5.0; several families since ui-1.0.0),
// written to dist/pack/fonts/ by the token build.
//
//   fonts/<file>.ttf                each font of fonts/<family>/ that has a record in its LICENCES.json, byte for byte
//   fonts/<stem>-<Family><ext>      the licence text its record names (`licence_text`, e.g. OFL.txt), byte for byte,
//                                   under its family's name so that two families' texts never collide (OFL-Nunito.txt)
//   fonts/LICENCES.json             the records of both
//
// A third-party font ships unmodified (OFL), so the build refuses (B04) a file whose sha256 is not the one its record
// holds, a record without an allowed licence or its licence text, a family the tokens do not name (`font.family.*`),
// a family no type role uses, and a weight a type role (`type.*` in the semantic file) gives a family outside that
// family's `wght` axis; a font without a `wght` axis is used at its default instance, so its roles' weight must be its
// OS/2 weight class. A root without fonts/ (a test fixture, an overlay's temporary copy) has no fonts. Node 20, no
// packages.
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { LICENCES_OK } = require('./icons.js');

const OUT = 'dist/pack/fonts';
const SRC = 'fonts';
const PRIMITIVES = 'tokens/primitives.tokens.json';
const SEMANTIC = 'tokens/semantic.tokens.json';

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const members = (group) => Object.entries(group || {}).filter(([k, v]) => !k.startsWith('$') && v && typeof v === 'object');
const values = (group) => members(group).filter(([, v]) => '$value' in v).map(([, v]) => v.$value);

// The OS/2 usWeightClass of a TrueType or OpenType file, or null.
function weightClass(buf) {
  try {
    const n = buf.readUInt16BE(4);
    for (let i = 0; i < n; i++) {
      const o = 12 + 16 * i;
      if (buf.toString('latin1', o, o + 4) === 'OS/2') return buf.readUInt16BE(buf.readUInt32BE(o + 8) + 4);
    }
  } catch (e) { /* not a font: the sha256 check has already refused it */ }
  return null;
}

// Map family -> Set(weight) from the type roles: each `type.*` composite's fontFamily and fontWeight, either an alias
// of a primitive (`{font.family.title}`) or a literal.
function familyWeights(primitives, semantic) {
  const font = primitives.font || {};
  const lookup = (v) => {
    const m = typeof v === 'string' && /^\{font\.(family|weight)\.([^{}]+)\}$/.exec(v);
    if (!m) return v;
    const t = (font[m[1]] || {})[m[2]];
    return t && '$value' in t ? t.$value : undefined;
  };
  const out = new Map();
  for (const [, role] of members(semantic.type)) {
    const v = role.$value;
    if (!v || typeof v !== 'object') continue;
    const family = lookup(v.fontFamily);
    const weight = Number(lookup(v.fontWeight));
    if (typeof family !== 'string' || !Number.isFinite(weight)) continue;
    if (!out.has(family)) out.set(family, new Set());
    out.get(family).add(weight);
  }
  return out;
}

// { outputs: { 'dist/pack/fonts/<file>': Buffer, 'dist/pack/fonts/LICENCES.json': text }, assets, problems: [text] }
function fontSet(root) {
  const abs = (rel) => path.join(root, ...rel.split('/'));
  const out = { outputs: {}, assets: [], problems: [] };
  if (!fs.existsSync(abs(SRC))) return out;
  let primitives;
  let semantic;
  try { primitives = JSON.parse(fs.readFileSync(abs(PRIMITIVES), 'utf8')); } catch (e) { out.problems.push(`${PRIMITIVES}: ${e.message}`); return out; }
  try { semantic = JSON.parse(fs.readFileSync(abs(SEMANTIC), 'utf8')); } catch (e) { out.problems.push(`${SEMANTIC}: ${e.message}`); return out; }
  const families = values((primitives.font || {}).family);
  const byFamily = familyWeights(primitives, semantic);
  const records = [];
  const shipped = new Map();
  const ship = (name, buf, from) => {
    if (shipped.has(name) && shipped.get(name) !== sha256(buf)) { out.problems.push(`${from} and another font's file both ship as ${OUT}/${name}`); return false; }
    shipped.set(name, sha256(buf));
    out.outputs[`${OUT}/${name}`] = buf;
    return true;
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
      if (typeof rec.family !== 'string' || !/^[A-Za-z0-9 ]+$/.test(rec.family)) { out.problems.push(`${where}: its record has no family name`); continue; }
      if (!families.includes(rec.family)) out.problems.push(`${where}: family ${rec.family} is not a font.family token (${families.join(', ')})`);
      const weights = [...(byFamily.get(rec.family) || [])].sort((a, b) => a - b);
      if (!weights.length) out.problems.push(`${where}: no type role (type.*) uses the family ${rec.family}`);
      const axis = rec.axes && rec.axes.wght;
      if (axis) {
        for (const w of weights) if (w < axis[0] || w > axis[1]) out.problems.push(`${where}: a type role gives ${rec.family} the weight ${w}, outside its wght axis ${axis.join('..')}`);
      } else {
        const own = weightClass(buf);
        for (const w of weights) if (w !== own) out.problems.push(`${where}: a type role gives ${rec.family} the weight ${w}; it has no wght axis, so only its default weight ${own} draws`);
      }
      const dot = text.lastIndexOf('.');
      const textName = `${dot > 0 ? text.slice(0, dot) : text}-${rec.family.replace(/ /g, '')}${dot > 0 ? text.slice(dot) : ''}`;
      if (!ship(f, buf, where) || !ship(textName, textBuf, `${dir}/${text}`)) continue;
      const fontRec = Object.assign({}, rec, { licence_text: textName, source: where });
      const textRec = Object.assign({}, recs[text], { source: `${dir}/${text}` });
      for (const [name, r] of [[f, fontRec], [textName, textRec]]) {
        records.push(`  ${JSON.stringify(name)}: ${JSON.stringify(r, null, 0).replace(/":/g, '": ').replace(/,"/g, ', "')}`);
      }
      out.assets.push({ path: `fonts/${f}`, kind: 'font', sha256: rec.sha256, licence: rec.licence, licence_file: 'fonts/LICENCES.json',
        licence_text: `fonts/${textName}`, source: where, family: rec.family, axes: rec.axes, weights });
    }
  }
  if (out.assets.length) out.outputs[`${OUT}/LICENCES.json`] = `{\n${records.join(',\n')}\n}\n`;
  return out;
}

module.exports = { fontSet, familyWeights, weightClass, OUT };
