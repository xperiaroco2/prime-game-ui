// The copy deck's check (prime-game-ui#4): copy/strings.csv parses as Godot's CSV translation format, keys are unique
// and snake_case screen.element, every row has en and uk with the same placeholders, plural rows have every form,
// copy/flags.json names real keys, and every Ukrainian text inside the wireframes' frames maps to a key (or is listed
// in pages/wireframes/frame-extras.json as a world tag, an annotation or sample data). The wireframes read their
// English from the deck: pages/wireframes/en.json and the EN map inlined in wireframes.html are generated here.
//
//   node tools/copy/check.js           check (and that en.json and the inlined map are fresh)
//   node tools/copy/check.js --write   regenerate en.json and the inlined map, then check
//
// A self-test on small in-memory decks runs first. Node 20, no packages.
'use strict';

const fs = require('fs');
const path = require('path');
const D = require('./deck.js');

const EN_LINE = /^var EN = \{.*\};$/m;

function selfTest() {
  const bad = [];
  const head = D.HEADER.join(',') + '\n';
  const errs = (csv) => D.readDeck(head + csv).errors;
  const expect = (name, csv, want) => {
    const e = errs(csv);
    const ok = want ? e.some((x) => x.includes(want)) : e.length === 0;
    if (!ok) bad.push(`${name}: expected ${want ? '"' + want + '"' : 'no error'}, got ${JSON.stringify(e)}`);
  };
  expect('good', 'a.b,Hi {name},Привіт {name},,\nc.d,"x, y","х, у",,\n', null);
  expect('good plural', 'a.n,{count} knife,{count} ніж,a.n,\n,{count} knives,{count} ножі,,\n,,{count} ножів,,\n', null);
  expect('placeholders', 'a.b,Hi {name},Привіт,,\n', 'placeholders');
  expect('duplicate', 'a.b,A,А,,\na.b,B,Б,,\n', 'repeats');
  expect('key form', 'Menu.Host,A,А,,\n', 'snake_case');
  expect('empty uk', 'a.b,A,,,\n', 'uk is empty');
  expect('plural forms', 'a.n,{count} knife,{count} ніж,a.n,\n,{count} knives,{count} ножі,,\n', 'needs 3 rows');
  expect('orphan row', ',x,у,,\n', 'continues no');
  expect('apostrophe', "a.b,Name,Ім'я,,\n", 'U+02BC');
  expect('apostrophe 2', 'a.b,Name,Ім’я,,\n', 'U+02BC');
  expect('mixed script', 'a.b,A,Пaкунок,,\n', 'mixes Latin');
  // A frame string without a key fails; one with a key maps to its English.
  const deck = D.readDeck(head + 'a.b,Hold {key} to give up,"Утримуй {key}, щоб здатися",,\nc.d,{name} · host,{name} · хост,,\n').entries;
  const html = '<section class="screen" id="s1"><div class="frame"><div>Утримуй <span>F</span>, щоб здатися</div><span>Олена · хост</span><b>Новий рядок</b></div></section>';
  const r = D.matchFrames(html, deck, { world: {}, annotations: {}, samples: [] });
  if (!r.errors.some((e) => e.includes('Новий рядок'))) bad.push('a frame string without a key did not fail');
  if (r.en['Утримуй'] !== 'Hold' || r.en[', щоб здатися'] !== ' to give up' || r.en['Олена · хост'] !== 'Олена · host') bad.push('frame English: ' + JSON.stringify(r.en));
  const pl = D.readDeck(head + 'a.n,{count} knife,{count} ніж,a.n,\n,{count} knives,{count} ножі,,\n,,{count} ножів,,\n').entries;
  const wrong = D.matchFrames('<div class="frame"><i>5 ножі</i><i>21 ніж</i></div>', pl, { world: {}, annotations: {}, samples: [] });
  if (!wrong.errors.some((e) => e.includes('"5 ножі"')) || wrong.errors.some((e) => e.includes('21 ніж'))) bad.push('plural form check: ' + JSON.stringify(wrong.errors));
  for (const [n, f] of [[1, 0], [2, 1], [5, 2], [11, 2], [21, 0], [22, 1], [12, 2], [0, 2]]) if (D.ukForm(n) !== f) bad.push(`ukForm(${n}) = ${D.ukForm(n)}, expected ${f}`);
  return bad;
}

function main(argv) {
  const write = argv.includes('--write');
  const unknown = argv.filter((a) => a !== '--write');
  if (unknown.length) { console.error(`unknown argument ${unknown[0]}\nusage: node tools/copy/check.js [--write]`); return 2; }
  const st = selfTest();
  if (st.length) { console.log('self-test failed:\n' + st.map((s) => '  ' + s).join('\n')); return 1; }

  const L = D.load();
  const errors = L.errors.slice();
  const json = JSON.stringify(L.frames.en);
  if (/<\/script/i.test(json)) errors.push('the English map would close the wireframes\' script');
  if (!EN_LINE.test(L.html)) errors.push(`${D.WIREFRAMES}: no "var EN = {…};" line to fill`);
  const htmlNext = L.html.replace(EN_LINE, () => `var EN = ${json};`);
  const enPath = path.join(D.ROOT, D.EN_JSON);
  let enDisk = null;
  try { enDisk = fs.readFileSync(enPath, 'utf8'); } catch (e) { enDisk = null; }

  if (write && !errors.length) {
    if (enDisk !== json) fs.writeFileSync(enPath, json);
    if (htmlNext !== L.html) fs.writeFileSync(path.join(D.ROOT, D.WIREFRAMES), htmlNext);
    console.log(`wrote ${D.EN_JSON} and the EN map in ${D.WIREFRAMES}`);
  } else if (!write) {
    if (enDisk !== json) errors.push(`${D.EN_JSON} is stale; run node tools/copy/check.js --write`);
    if (htmlNext !== L.html) errors.push(`the EN map in ${D.WIREFRAMES} is stale; run node tools/copy/check.js --write`);
  }
  if (errors.length) { console.log(errors.join('\n')); return 1; }
  const keys = L.deck.entries.length;
  const plural = L.deck.entries.filter((e) => e.plural).length;
  const mapped = L.frames.nodes.filter((n) => n.match.kind === 'key').length;
  const unused = L.deck.entries.filter((e) => !L.frames.used.has(e.key)).map((e) => e.key);
  console.log(`${keys} keys (${plural} plural), ${L.flags.flags.length} flagged; ${mapped} frame texts map to keys, ${L.frames.nodes.length - mapped} are world tags, annotations or samples; en.json fresh${unused.length ? `; not on a frame: ${unused.join(', ')}` : ''}`);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
