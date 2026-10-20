// The MVP screens page (pages/mvp-screens/index.html) is hand-written, but the round HUD's pictures on it are the game's
// icon files: pages/components/icons/<name>.svg (the siren, the carried items, the empty slots; their licence records
// are in pages/components/icons/LICENCES.json). The page is reviewed as one self-contained file, so it carries them
// as inline <symbol id="i-<name>"> copies between the markers below; this script writes that block from the files.
//
//   node pages/mvp-screens/build.js           rewrite the block in index.html
//   node pages/mvp-screens/build.js --check   exit 1 when the block is not the files' copy (tools/check.js runs it)
//
// Node 20, node's own modules only.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PAGE = 'pages/mvp-screens/index.html';
const ICON_DIR = 'pages/components/icons';
const ICONS = ['siren-off', 'siren-on', 'slot-empty-hand', 'slot-empty-belt', 'item-rocket', 'item-bun', 'item-battery',
  'item-extinguisher', 'item-flower', 'item-car-part', 'item-patty', 'item-burger', 'item-watering-can', 'item-wrench',
  'item-bin-bag', 'item-knife'];
const BEGIN = '<!-- icons:begin: generated from pages/components/icons by pages/mvp-screens/build.js -->';
const END = '<!-- icons:end -->';

const read = (rel) => fs.readFileSync(path.join(ROOT, ...rel.split('/')), 'utf8').replace(/\r\n/g, '\n');

function block() {
  const licences = JSON.parse(read(`${ICON_DIR}/LICENCES.json`));
  const lines = ICONS.map((name) => {
    const file = `${ICON_DIR}/${name}.svg`;
    const m = /<svg\b[^>]*\sviewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/.exec(read(file));
    if (!m) throw new Error(`${file}: no <svg viewBox="…"> … </svg>`);
    const rec = licences[`${name}.svg`];
    if (!rec || rec.licence !== 'own work') throw new Error(`${ICON_DIR}/LICENCES.json: ${name}.svg is not recorded as own work`);
    return `  <symbol id="i-${name}" viewBox="${m[1]}">${m[2].trim()}</symbol>`;
  });
  return `${BEGIN}\n${lines.join('\n')}\n  ${END}`;
}

function main() {
  const check = process.argv.includes('--check');
  const html = read(PAGE);
  const a = html.indexOf(BEGIN);
  const b = html.indexOf(END);
  if (a < 0 || b < a) throw new Error(`${PAGE}: the markers ${BEGIN} … ${END} are missing`);
  const next = html.slice(0, a) + block() + html.slice(b + END.length);
  for (const name of ICONS) if (!next.includes(`href="#i-${name}"`)) console.log(`note: ${PAGE} does not draw i-${name}`);
  if (check) {
    if (next !== html) { console.log(`${PAGE}: the icon block is stale: run node pages/mvp-screens/build.js`); process.exit(1); }
    console.log(`${PAGE}: the icon block matches ${ICONS.length} icons`);
    return;
  }
  fs.writeFileSync(path.join(ROOT, ...PAGE.split('/')), next);
  console.log(`wrote the icon block of ${PAGE} (${ICONS.length} icons)`);
}

try { main(); } catch (e) { console.log(e.message); process.exit(1); }
