// node tools/screens/sync-shared.js (from the repo root) re-copies the shared subtrees from their source screen: s7's Hud
// into s1/Hud, s6/Hud and s9/Hud (each as that screen draws it). Prints what it copied. Since #111 there is no main menu
// (s2), so s5's Settings page is drawn only in s5.
const fs = require('fs');
const { find, spliceChildren } = require('./src-format.js');
const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const clone = (x) => JSON.parse(JSON.stringify(x));
// Keep what is visible in state `st` of the source, flatten per_state[st] into the node, drop states and notes.
function atState(n, st, keepNote) {
  if (n.states && !n.states.includes(st)) return null;
  const o = clone(n);
  delete o.states;
  if (o.per_state) { Object.assign(o, o.per_state[st] || {}); delete o.per_state; }
  if (!keepNote) delete o.note;
  if (o.children) o.children = o.children.map((c) => atState(c, st, false)).filter(Boolean);
  return o;
}
// Every pip full: the round's first second, the tutorial, the return from the dead's room.
function fullPips(h) {
  for (const [row, full] of [['Health', 'ToyPipHealth'], ['Stamina', 'ToyPipStamina']]) {
    for (const p of find(h.children, ['Vitals', 'Suit', 'Rows', row, 'Pips']).children) p.variation = full;
  }
  return h;
}
const byName = (h, name) => h.children.find((n) => n.name === name);
const write = (f, path, children) => fs.writeFileSync(f, spliceChildren(fs.readFileSync(f, 'utf8'), path, children, 6));

const s7 = read('pages/screens/src/s07-hud.json');
const hud = fullPips(atState(find(s7.nodes, ['Hud']), 'empty', false));
const asS7 = (n, note) => Object.assign(n, { note: note || 'As s7.' });

// s1: the crosshair, the vitals and the slots (no time, roster, role or aim)
{
  const h = clone(hud);
  h.children = h.children.filter((n) => ['Cross', 'Vitals', 'Slots'].includes(n.name));
  asS7(byName(h, 'Vitals')); asS7(byName(h, 'Slots'), 'As s7: both slots empty.');
  write('pages/screens/src/s01-tutorial.json', ['Hud'], h.children);
  console.log('s1/Hud <- s7 Hud:', h.children.map((n) => n.name).join(' '));
}
// s6: all but Aim, at the round's first second (the full time, no anger, nobody dead, empty hands)
{
  const h = clone(hud);
  h.children = h.children.filter((n) => n.name !== 'Aim');
  const time = byName(h, 'Time');
  find(time.children, ['Row', 'Timer']).text = '09:57';
  find(time.children, ['Row', 'Anger', 'Bar']).value = 0;
  asS7(time, 'As s7, at the round\'s first second: the full time, no anger.');
  const roster = byName(h, 'Roster');
  const dead = find(roster.children, ['Rows', 'Row6', 'Name']);
  for (const k of ['key', 'args']) delete dead[k];
  Object.assign(dead, { variation: 'ToyRosterName', text: { uk: 'Тарас', en: 'Taras' } });
  asS7(roster, 'As s7; nobody is dead yet.');
  asS7(byName(h, 'Vitals')); asS7(byName(h, 'Slots'), 'As s7: both slots empty.');
  write('pages/screens/src/s06-pre-game.json', ['Hud'], h.children);
  console.log('s6/Hud <- s7 Hud:', h.children.map((n) => n.name).join(' '));
}
// s9: the Hud returns on "back"; while downed only the vitals' mic shows. s9 keeps its own roster and mic.
{
  const f = 'pages/screens/src/s09-downed.json';
  const s9 = read(f);
  const own = find(s9.nodes, ['Hud']);
  const h = clone(hud);
  h.children = h.children.filter((n) => n.name !== 'Aim').map((n) => {
    if (n.name === 'Roster') return byName(own, 'Roster');
    n.states = n.name === 'Vitals' ? ['down', 'down-holding', 'raise', 'back'] : ['back'];
    return n;
  });
  const time = byName(h, 'Time');
  find(time.children, ['Row', 'Timer']).text = '05:10';
  find(time.children, ['Row', 'Anger', 'Bar']).value = 0.55;
  find(time.children, ['Row', 'Anger', 'Siren']).icon = 'siren-on';
  asS7(time);
  const vit = byName(h, 'Vitals');
  const suit = find(vit.children, ['Suit']);
  Object.assign(suit, { states: ['back'], note: 'Hidden while downed; every pip full again on return.' });
  vit.children = [suit, find(own.children, ['Vitals', 'Mic'])];
  asS7(byName(h, 'Slots'), 'As s7; the player comes back with empty hands.');
  write(f, ['Hud'], h.children);
  console.log('s9/Hud <- s7 Hud:', h.children.map((n) => n.name).join(' '));
}
