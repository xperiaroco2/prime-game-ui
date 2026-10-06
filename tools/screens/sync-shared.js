// node tools/screens/sync-shared.js (from the repo root) re-copies the shared subtrees from their source screens: s5's Settings page into s2/SettingsPanel, s7's Hud into
// s1/Hud and s6/Hud. Run from the repo root. Prints what it copied.
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
// s2: the Settings page of s5, as on settings-sound
{
  const s5 = read('pages/screens/src/s05-esc-menu.json');
  const src = find(s5.nodes, ['Menu', 'H', 'Page', 'Settings']);
  const c = atState(src, 'settings-sound', false);
  c.note = 'The s5 Settings scene (s5/Menu/H/Page/Settings), instanced here on its Sound and voice page; its nodes, notes and other pages are s5\'s. Build it once, in s5.';
  delete c.size_flags_vertical; // it fills the panel's content rect
  const sound = find(c.children, ['Sub', 'Sound']); sound.state = 'selected-focus';
  const f = 'pages/screens/src/s02-main-menu.json';
  const t = fs.readFileSync(f, 'utf8');
  fs.writeFileSync(f, spliceChildren(t, ['SettingsPanel'], [c], 6));
  console.log('s2/SettingsPanel <- s5 Settings:', find(c.children, ['Scroll', 'Rows']).children.map((r) => r.name).join(' '));
}
// s1 and s6: s7's Hud as on empty
{
  const s7 = read('pages/screens/src/s07-hud.json');
  const hud = atState(find(s7.nodes, ['Hud']), 'empty', false);
  const full = (h) => { for (const p of [['Vitals', 'Health', 'Track', 'Fill'], ['Vitals', 'Stamina', 'Track', 'Fill']]) find(h.children, p).value = 1; return h; };
  // s6: all but Aim; the round's first second
  const h6 = full(clone(hud)); h6.children = h6.children.filter((n) => n.name !== 'Aim');
  find(h6.children, ['Timer', 'Time']).text = '09:57';
  let f = 'pages/screens/src/s06-pre-game.json';
  fs.writeFileSync(f, spliceChildren(fs.readFileSync(f, 'utf8'), ['Hud'], h6.children, 6));
  console.log('s6/Hud <- s7 Hud:', h6.children.map((n) => n.name).join(' '), '| timer min', JSON.stringify(find(h6.children, ['Timer', 'Time']).custom_minimum_size));
  // s1: the crosshair, the vitals and the slots (no timer, role or aim)
  const h1 = full(clone(hud)); h1.children = h1.children.filter((n) => ['Cross', 'Vitals', 'Slots'].includes(n.name));
  f = 'pages/screens/src/s01-tutorial.json';
  fs.writeFileSync(f, spliceChildren(fs.readFileSync(f, 'utf8'), ['Hud'], h1.children, 6));
  console.log('s1/Hud <- s7 Hud:', h1.children.map((n) => n.name).join(' '));
}
