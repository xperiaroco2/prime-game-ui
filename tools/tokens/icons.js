// The icons the game imports beside the pack (spec §9.1 `assets`), written to dist/pack/icons/ by the token build.
//
//   icons/<name>.svg       pages/components/icons/*.svg, with their LICENCES.json. The pages draw an icon in its
//                          context's colour (CSS currentColor); Godot's SVG importer (ThorVG) has no such context, and the
//                          game tints an icon by multiplying it (TextureRect self_modulate, a Button's icon_*_color,
//                          OptionButton's modulate_arrow), so the game's copy is white and the tint gives its colour.
//                          Icons drawn in their own hex (the slider knobs) are copied as they are.
//   icons/room/<name>.svg  the room pictograms (the engineer's room-signs decision: system B's icons, plain on packages
//                          and the map), drawn in one ink colour, written as white for the same tint (the pages draw them
//                          in that ink, so the game multiplies by it: `tint_color`); their licence records are copied
//                          into icons/room/LICENCES.json.
//
// Each icon's import settings are derived, not kept by hand: its size is the SVG's width and height (else its viewBox),
// `drawn_px` the largest size any screen of pages/screens/src draws it at (as the screens handoffs measure it: a
// TextureRect by its custom_minimum_size, a Button icon by icon_size or its own size, an OptionButton's arrow and list
// icons and an HSlider's knobs at their own size; an icon no screen draws keeps its own size), and `svg_scale` = drawn_px / the larger
// side, rounded up to 0.01, the svg/scale Godot imports it at (it rasterises an SVG at import).
// A root without these folders (a test fixture, an overlay's temporary copy) has no icons.
// Node 20, no packages.
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUT = 'dist/pack/icons';
const SCREENS_SRC = 'pages/screens/src';
// The licences this repo accepts (CLAUDE.md, Licences).
const LICENCES_OK = /^(own work|OFL(-1\.1)?|CC0(-1\.0)?|MIT|ISC|Apache-2\.0)$/i;
const ROOM_INK = '#2a1f33';
const SOURCES = [
  { prefix: '', dir: 'pages/components/icons', licences: 'pages/components/icons/LICENCES.json', entry: (f) => f },
  { prefix: 'room/', dir: 'pages/room-signs/systems/b/icons', licences: 'pages/room-signs/systems/b/LICENCES.json', entry: (f) => `icons/${f}`, ink: ROOM_INK },
];
// The textures a screen draws without naming them (pages/screens/build.js ARROW_ICON, LIST_ICONS, KNOB_ICON,
// KNOB_DISABLED_ICON): an OptionButton's arrow and its open list's radio icons (ToyDropdownList), an HSlider's knobs.
const IMPLIED = { OptionButton: ['chevron-down', 'radio-checked', 'radio-checked-disabled', 'radio-unchecked'], HSlider: ['slider-knob', 'slider-knob-disabled'] };

const readNorm = (abs) => fs.readFileSync(abs, 'utf8').replace(/\r\n/g, '\n').replace(/\s+$/, '') + '\n';
const sha256 = (text) => crypto.createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex');

// The SVG's own size: width and height, else the viewBox (as pages/screens/build.js loadIcons reads it).
function svgSize(text) {
  const open = /<svg\b[^>]*>/.exec(text.replace(/<!--[\s\S]*?-->/g, ''));
  if (!open) return [24, 24];
  const attr = (n) => { const m = new RegExp(`\\s${n}="([^"]*)"`).exec(open[0]); return m ? m[1] : null; };
  const vb = (attr('viewBox') || '').split(/[\s,]+/).map(Number);
  return [Number(attr('width')) || vb[2] || 24, Number(attr('height')) || vb[3] || 24];
}

// Every icon of the root: [{ name (the screens' id: check, room/lab), path (in the pack: icons/check.svg), out, source,
// text (the pack's bytes), size, tint, tintColor, licence, licenceOk, licenceFile }] plus the LICENCES.json outputs.
function listIcons(root) {
  const icons = [];
  const licenceOutputs = {};
  for (const src of SOURCES) {
    const dir = path.join(root, ...src.dir.split('/'));
    let files = [];
    try { files = fs.readdirSync(dir).filter((n) => n.endsWith('.svg')).sort(); } catch { continue; }
    let records = {};
    let licencesText = null;
    try { licencesText = readNorm(path.join(root, ...src.licences.split('/'))); records = JSON.parse(licencesText); } catch { records = {}; }
    const packDir = `icons/${src.prefix}`;
    const lines = [];
    for (const f of files) {
      const source = `${src.dir}/${f}`;
      const raw = readNorm(path.join(dir, f));
      let text = raw;
      let tint = 'none';
      let tintColor = null;
      if (src.ink) {
        // one ink colour: written white, drawn on the pages in that ink
        const colours = new Set((raw.match(/#[0-9a-fA-F]{6}\b/g) || []).map((c) => c.toLowerCase()));
        const ink = colours.size === 1 && colours.has(src.ink);
        text = `<!-- generated from ${source} by tools/tokens/build.js${ink ? `: ${src.ink} written as #ffffff, for Godot's tint` : ''} -->\n`
          + (ink ? raw.split(src.ink).join('#ffffff') : raw);
        if (ink) { tint = 'multiply'; tintColor = src.ink; }
      } else if (raw.includes('currentColor')) {
        text = `<!-- generated from ${source} by tools/tokens/build.js: currentColor written as #ffffff, for Godot's tint -->\n`
          + raw.replace(/currentColor/g, '#ffffff');
        tint = 'multiply';
      }
      const rec = records[src.entry(f)];
      if (src.ink && rec) lines.push(`  ${JSON.stringify(f)}: ${JSON.stringify(rec).replace(/":/g, '": ').replace(/,"/g, ', "')}`);
      icons.push({
        name: src.prefix + f.replace(/\.svg$/, ''), path: `${packDir}${f}`, out: `${OUT}/${src.prefix}${f}`, source, text,
        size: svgSize(raw), tint, tintColor,
        licence: rec && typeof rec.licence === 'string' ? rec.licence : null,
        licenceOk: !!(rec && typeof rec.licence === 'string' && LICENCES_OK.test(rec.licence)),
        licenceFile: `${packDir}LICENCES.json`,
      });
    }
    // the components' records are copied as they are; the room pictograms' are the records of the copied files
    if (src.ink) licenceOutputs[`${OUT}/${src.prefix}LICENCES.json`] = `{\n${lines.join(',\n')}\n}\n`;
    else if (licencesText !== null) licenceOutputs[`${OUT}/${src.prefix}LICENCES.json`] = licencesText;
  }
  return { icons, licenceOutputs };
}

// The largest size each icon (by the screens' id) is drawn at over every screen source. Throws on a source that is not
// JSON (the screens step names the problem; the pack cannot be built without it).
function drawnSizes(root, icons) {
  const byName = new Map(icons.map((ic) => [ic.name, ic]));
  const best = new Map();
  const see = (name, px) => { if (byName.has(name) && Number.isFinite(px) && px > 0) best.set(name, Math.max(best.get(name) || 0, px)); };
  const own = (name) => { const ic = byName.get(name); return ic ? Math.max(ic.size[0], ic.size[1]) : 0; };
  let files = [];
  try { files = fs.readdirSync(path.join(root, ...SCREENS_SRC.split('/'))).filter((n) => n.endsWith('.json')).sort(); } catch { return best; }
  const visit = (n) => {
    if (!n || typeof n !== 'object' || Array.isArray(n)) return;
    const per = n.per_state && typeof n.per_state === 'object' ? Object.values(n.per_state) : [];
    const names = [n.icon, ...per.map((o) => (o && typeof o === 'object' ? o.icon : null))].filter((x) => typeof x === 'string');
    for (const name of names) {
      const ic = byName.get(name);
      if (!ic) continue;
      const c = n.custom_minimum_size;
      if (n.type === 'TextureRect' && Array.isArray(c) && c[0] > 0 && c[1] > 0) see(name, Math.min(c[0] / ic.size[0], c[1] / ic.size[1]) * own(name));
      else see(name, typeof n.icon_size === 'number' ? n.icon_size : own(name));
    }
    for (const name of IMPLIED[n.type] || []) see(name, own(name));
    if (Array.isArray(n.children)) n.children.forEach(visit);
  };
  for (const f of files) {
    const rel = `${SCREENS_SRC}/${f}`;
    let doc;
    try { doc = JSON.parse(fs.readFileSync(path.join(root, ...rel.split('/')), 'utf8')); } catch (e) {
      throw new Error(`${rel}: ${e.message} (the pack's icon sizes are read from the screens; run node pages/screens/build.js --validate)`);
    }
    if (doc && Array.isArray(doc.nodes)) doc.nodes.forEach(visit);
  }
  return best;
}

// The outputs (dist/pack/icons/**) and the pack's `assets` records, sorted by path.
function iconSet(root) {
  const { icons, licenceOutputs } = listIcons(root);
  const outputs = {};
  for (const ic of icons) outputs[ic.out] = ic.text;
  Object.assign(outputs, licenceOutputs);
  const sorted = {};
  for (const k of Object.keys(outputs).sort()) sorted[k] = outputs[k];
  const drawn = icons.length ? drawnSizes(root, icons) : new Map();
  const assets = icons.slice().sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0)).map((ic) => {
    const side = Math.max(ic.size[0], ic.size[1]);
    const px = drawn.get(ic.name) || side;
    const rec = { path: ic.path, kind: 'icon', sha256: sha256(ic.text), licence: ic.licence, licence_file: ic.licenceFile, source: ic.source,
      size: ic.size, drawn_px: Math.round(px * 100) / 100, svg_scale: Math.ceil((px / side) * 100) / 100, tint: ic.tint };
    if (ic.tintColor) rec.tint_color = ic.tintColor;
    return rec;
  });
  return { outputs: sorted, assets, icons };
}

module.exports = { iconSet, listIcons, drawnSizes, svgSize, LICENCES_OK, OUT };
