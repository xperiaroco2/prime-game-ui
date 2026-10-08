// The token build (spec §7): validate, resolve, expand, then emit dist/css/toy-tokens.css and dist/pack/toy.pack.json,
// with the pack's icons (dist/pack/icons/), how-to card art (dist/pack/cards/, PNG) and fonts (dist/pack/fonts/); binary
// outputs are Buffers.
//   node tools/tokens/build.js            write both outputs and print counts
//   node tools/tokens/build.js --check    build in memory, compare bytes with dist/, name each stale file, exit 1
// Options: --root <dir> (default: the repo root; reads <root>/tokens), --out <dir> (default: <root>; writes <out>/dist).
// Exit 0 when all is well, 1 on any token error or stale output, 2 on bad arguments.
// Node 20, no packages.
'use strict';

const fs = require('fs');
const path = require('path');
const api = require('./api.js');

const USAGE = 'usage: node tools/tokens/build.js [--check] [--root <dir>] [--out <dir>]';

function parseArgs(argv) {
  const out = { check: false, root: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check') out.check = true;
    else if ((a === '--root' || a === '--out') && argv[i + 1]) out[a.slice(2)] = argv[++i];
    else if (a === '--help' || a === '-h') return { help: true };
    else return { bad: a };
  }
  return out;
}

function main(argv) {
  const args = parseArgs(argv);
  if (args.help) { console.log(USAGE); return 0; }
  if (args.bad) { console.error(`unknown argument ${args.bad}\n${USAGE}`); return 2; }
  const root = path.resolve(args.root || path.join(__dirname, '..', '..'));
  const outRoot = path.resolve(args.out || root);
  const { problems, sys } = api.analyzeAll(root);
  for (const p of api.sortProblems(problems.list)) {
    (p.severity === 'error' ? console.error : console.warn)(api.formatProblem(p));
  }
  const tally = `${problems.errors.length} error(s), ${problems.warnings.length} warning(s)`;
  if (!sys) {
    console.error(`${tally}; nothing ${args.check ? 'checked' : 'written'}`);
    return 1;
  }
  if (args.check) {
    let bad = 0;
    for (const [rel, text] of Object.entries(sys.outputs)) {
      let cur = null;
      try { cur = fs.readFileSync(path.join(outRoot, ...rel.split('/'))); } catch { cur = null; }
      if (cur === null) { console.error(`missing: ${rel}`); bad++; }
      else if (!cur.equals(Buffer.isBuffer(text) ? text : Buffer.from(text, 'utf8'))) { console.error(`stale: ${rel}`); bad++; }
    }
    if (bad) {
      console.error(`${bad} output(s) out of date: run node tools/tokens/build.js and commit dist/`);
      return 1;
    }
    console.log(`up to date: ${Object.keys(sys.outputs).join(', ')} (${tally})`);
    return 0;
  }
  for (const [rel, text] of Object.entries(sys.outputs)) {
    const abs = path.join(outRoot, ...rel.split('/'));
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, text);
  }
  const c = sys.counts;
  console.log(`wrote ${Object.keys(sys.outputs).join(', ')} (version ${sys.version})`);
  console.log(`tokens: ${c.authored} authored (primitive ${c.tiers.primitive}, semantic ${c.tiers.semantic}, component ${c.tiers.component}), `
    + `${c.packTokens} in the pack, ${c.derived} derived`);
  console.log(`variations: ${c.variations}; proposals: ${c.proposals}; permutations: ${c.permutations}; ${tally}`);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
