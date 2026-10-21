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
// OS/2 weight class. It also refuses a type role whose lineHeight is not its family's own line box ((ascender +
// descender) / units per em, as FreeType reads them) and gives the CSS emitter each family's metrics (`metrics`), from
// which lineBoxPx() makes the whole px line Godot 4.7.2 draws. A root without fonts/ (a test fixture, an overlay's
// temporary copy) has no fonts. A record written before its download (ui-2.0.0) holds the upstream git blob id and size
// instead of a sha256, and the build checks the file by them. A record whose file (or licence text) is not in
// fonts/<family>/ yet is listed in `missing` with its download URL, size and git blob: its record's expected `metrics`
// stand in for the line box, nothing of it ships, and tools/tokens/build.js fails naming each missing file. Node 20, no
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
// git's blob id of a file's bytes (sha1 of "blob <size>\0" + the bytes): what the GitHub API names for an upstream file
const gitBlob = (buf) => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest('hex');
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

// A face's vertical metrics as FreeType takes them (Godot 4.7.2's copy, thirdparty/freetype/src/sfnt/sfobjs.c
// L1380-L1411): OS/2 sTypoAscender and sTypoDescender when fsSelection bit 7 (USE_TYPO_METRICS) is set, else hhea's
// ascender and descender, and when both are 0 the OS/2 typo, then win values. { ascender, descender (both positive,
// font units), unitsPerEm } or null. A variable font's MVAR could move them per instance: refused (B04) when its
// MVAR names hasc or hdsc, so one set of metrics holds at every weight.
function faceMetrics(buf) {
  try {
    const t = {};
    const n = buf.readUInt16BE(4);
    for (let i = 0; i < n; i++) { const o = 12 + 16 * i; t[buf.toString('latin1', o, o + 4)] = buf.readUInt32BE(o + 8); }
    if (t.head === undefined || t.hhea === undefined) return null;
    const upem = buf.readUInt16BE(t.head + 18);
    let asc = buf.readInt16BE(t.hhea + 4);
    let desc = buf.readInt16BE(t.hhea + 6);
    const os2 = t['OS/2'];
    if (os2 !== undefined) {
      const typoAsc = buf.readInt16BE(os2 + 68);
      const typoDesc = buf.readInt16BE(os2 + 70);
      if (buf.readUInt16BE(os2 + 62) & 128) { asc = typoAsc; desc = typoDesc; }
      else if (!asc && !desc) {
        if (typoAsc || typoDesc) { asc = typoAsc; desc = typoDesc; }
        else { asc = buf.readUInt16BE(os2 + 74); desc = -buf.readUInt16BE(os2 + 76); }
      }
    }
    const mvar = [];
    if (t.MVAR !== undefined) {
      const size = buf.readUInt16BE(t.MVAR + 6);
      const count = buf.readUInt16BE(t.MVAR + 8);
      for (let i = 0; i < count; i++) mvar.push(buf.toString('latin1', t.MVAR + 12 + i * size, t.MVAR + 16 + i * size));
    }
    return { ascender: asc, descender: -desc, unitsPerEm: upem, varies: mvar.some((x) => x === 'hasc' || x === 'hdsc') };
  } catch (e) { return null; }
}

// The height of one line of text in Godot 4.7.2 at the whole pixel size `sizePx`: the font's ascent plus its descent
// (scene/gui/label.cpp L392-L400 adds a line's ascent and descent; modules/text_server_adv/text_server_adv.cpp
// L1638-L1659 takes them from FreeType's size metrics after a nominal size request, at scale 1). FreeType grid-fits
// them: the ascender rounded up, the descender down to a whole pixel (base/ftobjs.c L102 GRID_FIT_METRICS,
// L3176-L3182), from its 16.16 scale (FT_DivFix, FT_MulFix: base/ftcalc.c L212-L250), computed here the same way.
function lineBoxPx(sizePx, m) {
  const yScale = Math.floor((sizePx * 64 * 65536 + Math.floor(m.unitsPerEm / 2)) / m.unitsPerEm);
  const asc = Math.floor((m.ascender * yScale + 0x8000) / 65536); // 26.6
  const desc = Math.floor((-m.descender * yScale + 0x8000 - 1) / 65536); // 26.6, negative
  return Math.ceil(asc / 64) - Math.floor(desc / 64);
}

// The line height ratio a family's metrics give: (ascender + descender) / units per em, to 4 places.
const ownLineHeight = (m) => Math.round(((m.ascender + m.descender) / m.unitsPerEm) * 1e4) / 1e4;

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

// Map family -> [{ role, lineHeight }] from the type roles: each `type.*` composite's fontFamily and lineHeight
// (aliases of primitives, `{font.line-height.text}`, or literals).
function familyLineHeights(primitives, semantic) {
  const font = primitives.font || {};
  const lookup = (v) => {
    const m = typeof v === 'string' && /^\{font\.(family|line-height)\.([^{}]+)\}$/.exec(v);
    if (!m) return v;
    const t = (font[m[1]] || {})[m[2]];
    return t && '$value' in t ? t.$value : undefined;
  };
  const out = new Map();
  for (const [name, role] of members(semantic.type)) {
    const v = role.$value;
    if (!v || typeof v !== 'object') continue;
    const family = lookup(v.fontFamily);
    if (typeof family !== 'string') continue;
    if (!out.has(family)) out.set(family, []);
    out.get(family).push({ role: `type.${name}`, lineHeight: Number(lookup(v.lineHeight)) });
  }
  return out;
}

// { outputs: { 'dist/pack/fonts/<file>': Buffer, 'dist/pack/fonts/LICENCES.json': text }, assets, problems: [text],
//   metrics: { <family>: { ascender, descender, unitsPerEm } }, missing: [{ path, download, bytes, blob }] }
function fontSet(root) {
  const abs = (rel) => path.join(root, ...rel.split('/'));
  const out = { outputs: {}, assets: [], problems: [], metrics: {}, missing: [] };
  if (!fs.existsSync(abs(SRC))) return out;
  let primitives;
  let semantic;
  try { primitives = JSON.parse(fs.readFileSync(abs(PRIMITIVES), 'utf8')); } catch (e) { out.problems.push(`${PRIMITIVES}: ${e.message}`); return out; }
  try { semantic = JSON.parse(fs.readFileSync(abs(SEMANTIC), 'utf8')); } catch (e) { out.problems.push(`${SEMANTIC}: ${e.message}`); return out; }
  const families = values((primitives.font || {}).family);
  const byFamily = familyWeights(primitives, semantic);
  const byLine = familyLineHeights(primitives, semantic);
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
    // every font a record names, whether its file is here yet or not (ui-2.0.0: a record may wait for its download)
    const fontNames = [...new Set(files.concat(Object.keys(recs)))].filter((x) => /\.(ttf|otf)$/i.test(x)).sort();
    for (const f of fontNames) {
      const rec = recs[f];
      if (!rec) continue;
      const where = `${dir}/${f}`;
      if (typeof rec.licence !== 'string' || !LICENCES_OK.test(rec.licence)) { out.problems.push(`${where} has no allowed licence in ${dir}/LICENCES.json`); continue; }
      const text = rec.licence_text;
      if (!text || !recs[text]) { out.problems.push(`${where}: its licence text ${text || '(none named)'} has no record`); continue; }
      if (typeof rec.family !== 'string' || !/^[A-Za-z0-9 ]+$/.test(rec.family)) { out.problems.push(`${where}: its record has no family name`); continue; }
      // a file not downloaded yet: named in `missing` (the build fails on it with the list), its record's expected
      // metrics stand in for the line box until it is here, and nothing of it ships
      const absent = [[f, rec], [text, recs[text]]].filter(([name]) => !fs.existsSync(abs(`${dir}/${name}`)));
      if (absent.length) {
        for (const [name, r] of absent) out.missing.push({ path: `${dir}/${name}`, download: r.download || r.upstream || null, bytes: r.bytes == null ? null : r.bytes, blob: r.upstream_git_blob || null });
        const em = rec.metrics;
        if (!em || !(em.unitsPerEm > 0) || !Number.isFinite(em.ascender) || !Number.isFinite(em.descender)) { out.problems.push(`${where} is not here and its record has no expected metrics (metrics: ascender, descender, unitsPerEm)`); continue; }
        if (!out.metrics[rec.family]) {
          out.metrics[rec.family] = { ascender: em.ascender, descender: em.descender, unitsPerEm: em.unitsPerEm, source: `${dir}/LICENCES.json (expected)` };
          const own = ownLineHeight(em);
          for (const r of byLine.get(rec.family) || []) {
            if (r.lineHeight !== own) out.problems.push(`${where}: ${r.role} gives ${rec.family} the line height ${r.lineHeight}, not the record's expected ${own}`);
          }
        }
        const ws = [...(byFamily.get(rec.family) || [])].sort((a, b) => a - b);
        if (!families.includes(rec.family)) out.problems.push(`${where}: family ${rec.family} is not a font.family token (${families.join(', ')})`);
        if (!ws.length) out.problems.push(`${where}: no type role (type.*) uses the family ${rec.family}`);
        const ax = rec.axes && rec.axes.wght;
        if (ax) for (const w of ws) if (w < ax[0] || w > ax[1]) out.problems.push(`${where}: a type role gives ${rec.family} the weight ${w}, outside its wght axis ${ax.join('..')}`);
        continue;
      }
      const buf = fs.readFileSync(abs(where));
      const textBuf = fs.readFileSync(abs(`${dir}/${text}`));
      // the file is upstream's: by its sha256 when the record holds one, else by its git blob and size (what the
      // GitHub API names before anything is downloaded)
      const same = (b, r) => (r.sha256 ? sha256(b) === r.sha256 : r.upstream_git_blob === gitBlob(b) && (r.bytes == null || r.bytes === b.length));
      if (!same(buf, rec)) { out.problems.push(`${where} is not the file its record holds (${rec.sha256 ? 'sha256' : 'git blob and size'}): a third-party font ships unmodified`); continue; }
      if (!same(textBuf, recs[text])) { out.problems.push(`${dir}/${text} is not the file its record holds (${recs[text].sha256 ? 'sha256' : 'git blob and size'})`); continue; }
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
      // the line height: every type role of the family takes the font's own line box, as Godot draws a line
      const m = faceMetrics(buf);
      if (!m || !(m.unitsPerEm > 0)) out.problems.push(`${where}: no vertical metrics (head, hhea, OS/2) to read`);
      else if (m.varies) out.problems.push(`${where}: its MVAR moves the ascender or descender per instance, so one line height cannot hold`);
      else if (rec.metrics && (rec.metrics.ascender !== m.ascender || rec.metrics.descender !== m.descender || rec.metrics.unitsPerEm !== m.unitsPerEm)) {
        out.problems.push(`${where}: its own metrics (ascender ${m.ascender}, descender ${m.descender}, units per em ${m.unitsPerEm}) differ from its record's expected ones; set them in ${dir}/LICENCES.json and the family's font.line-height to ${ownLineHeight(m)}`);
      } else if (out.metrics[rec.family]) {
        const o = out.metrics[rec.family];
        if (o.ascender !== m.ascender || o.descender !== m.descender || o.unitsPerEm !== m.unitsPerEm) out.problems.push(`${where}: its vertical metrics differ from ${o.source}'s, the same family`);
      } else {
        out.metrics[rec.family] = { ascender: m.ascender, descender: m.descender, unitsPerEm: m.unitsPerEm, source: where };
        const own = ownLineHeight(m);
        for (const r of byLine.get(rec.family) || []) {
          if (r.lineHeight !== own) out.problems.push(`${where}: ${r.role} gives ${rec.family} the line height ${r.lineHeight}, not the font's own ${own} ((ascender ${m.ascender} + descender ${m.descender}) / ${m.unitsPerEm}), the line Godot draws`);
        }
      }
      const dot = text.lastIndexOf('.');
      const textName = `${dot > 0 ? text.slice(0, dot) : text}-${rec.family.replace(/ /g, '')}${dot > 0 ? text.slice(dot) : ''}`;
      if (!ship(f, buf, where) || !ship(textName, textBuf, `${dir}/${text}`)) continue;
      const fontRec = Object.assign({}, rec, { licence_text: textName, source: where, sha256: sha256(buf) });
      const textRec = Object.assign({}, recs[text], { source: `${dir}/${text}`, sha256: sha256(textBuf) });
      for (const [name, r] of [[f, fontRec], [textName, textRec]]) {
        records.push(`  ${JSON.stringify(name)}: ${JSON.stringify(r, null, 0).replace(/":/g, '": ').replace(/,"/g, ', "')}`);
      }
      out.assets.push({ path: `fonts/${f}`, kind: 'font', sha256: sha256(buf), licence: rec.licence, licence_file: 'fonts/LICENCES.json',
        licence_text: `fonts/${textName}`, source: where, family: rec.family, axes: rec.axes, weights });
    }
  }
  if (out.assets.length) out.outputs[`${OUT}/LICENCES.json`] = `{\n${records.join(',\n')}\n}\n`;
  return out;
}

module.exports = { gitBlob, fontSet, familyWeights, familyLineHeights, weightClass, faceMetrics, lineBoxPx, ownLineHeight, OUT };
