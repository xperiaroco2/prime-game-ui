// The copy deck (prime-game-ui#4, xperiaroco2/prime-game#208): copy/strings.csv in Godot's CSV translation format,
// read, validated and matched against the wireframes' frames. Used by tools/copy/check.js and pages/copy/build.js.
// Node 20, no packages.
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DECK = 'copy/strings.csv';
const FLAGS = 'copy/flags.json';
const WIREFRAMES = 'pages/wireframes/wireframes.html';
const EXTRAS = 'pages/wireframes/frame-extras.json';
const EN_JSON = 'pages/wireframes/en.json';

const HEADER = ['keys', 'en', 'uk', '?plural', '?context'];
const KEY_RE = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
const PH_RE = /\{([a-z_]+)\}/g;
// What each placeholder may stand for when a frame's sample text is matched against a template.
const PH_PATTERN = {
  count: '\\d+', total: '\\d+', port: '\\d+',
  time: '\\d+(?::\\d+)*',
  version: '\\d+(?:\\.\\d+)*',
  key: '[A-Za-z0-9]+',
};
const PH_ANY = '.+?';
// Placeholders a frame draws as their own element (a keycap, a bold value), so the text around them is separate
// text nodes: only templates with these may be matched piece by piece.
const PH_SPLIT = new Set(['key', 'preset']);
// Icons and separators drawn as text in the wireframes; in the game they are icons or layout, never in a string.
const DECOR = '\\s▸✓•🔒‹›▾◈←+·';
const DECOR_HEAD = new RegExp('^[' + DECOR + ']+', 'u');
const DECOR_TAIL = new RegExp('[' + DECOR + ']+$', 'u');
const CYRILLIC = /[Ѐ-ӿ]/;
const FLAG_KINDS = ['gender', 'rule', 'less-text', 'clarity', 'consistency', 'obvious', 'word', 'tone', 'case'];
const OPTION_IDS = ['a', 'b', 'c'];
const PLURAL_FORMS = { en: 2, uk: 3 };

// Ukrainian plural form of n: 0 one (1, 21), 1 few (2-4, 22), 2 many (0, 5-20, 11-14).
function ukForm(n) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 0;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 1;
  return 2;
}
const enForm = (n) => (n === 1 ? 0 : 1);

const readText = (rel, root) => fs.readFileSync(path.join(root || ROOT, rel), 'utf8');
const placeholders = (s) => [...String(s).matchAll(PH_RE)].map((m) => m[1]);
const sameSet = (a, b) => { const x = [...new Set(a)].sort().join(','); return x === [...new Set(b)].sort().join(','); };

// RFC 4180: quoted cells may hold commas, quotes ("") and newlines. Returns [{cells, line}].
function parseCsv(text) {
  const rows = [];
  let cells = [], cell = '', i = 0, line = 1, rowLine = 1, quoted = false, any = false;
  const endCell = () => { cells.push(cell); cell = ''; };
  const endRow = () => { endCell(); rows.push({ cells, line: rowLine }); cells = []; any = false; };
  if (text.charCodeAt(0) === 0xfeff) i = 1;
  for (; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false;
      } else { if (c === '\n') line++; cell += c; }
      continue;
    }
    if (c === '"') {
      if (cell !== '') throw new Error(`line ${line}: a quote inside an unquoted cell`);
      quoted = true; any = true;
    } else if (c === ',') { endCell(); any = true; } else if (c === '\r') {
      if (text[i + 1] !== '\n') throw new Error(`line ${line}: a bare CR`);
    } else if (c === '\n') {
      endRow(); line++; rowLine = line;
    } else { cell += c; any = true; }
  }
  if (quoted) throw new Error('the file ends inside a quoted cell');
  if (any || cell !== '' || cells.length) endRow();
  return rows;
}

// Rows into entries: {key, en: [forms], uk: [forms], plural, context, line}. Every problem goes to errors.
function readDeck(text) {
  const errors = [];
  let rows;
  try { rows = parseCsv(text); } catch (e) { return { entries: [], errors: ['csv: ' + e.message] }; }
  if (!rows.length || rows[0].cells.join(',') !== HEADER.join(',')) {
    errors.push(`csv: the header must be ${HEADER.join(',')}`);
    return { entries: [], errors };
  }
  const entries = [];
  const seen = new Map();
  let open = null; // the plural entry continuation rows belong to
  for (const { cells, line } of rows.slice(1)) {
    const where = `line ${line}`;
    if (cells.length !== HEADER.length) { errors.push(`${where}: ${cells.length} cells, expected ${HEADER.length}`); continue; }
    const [key, en, uk, plural, context] = cells;
    for (const c of cells) if (c !== c.trim()) errors.push(`${where}: a cell starts or ends with whitespace: "${c}"`);
    if (key === '') {
      if (!open) { errors.push(`${where}: a row without a key that continues no ?plural row`); continue; }
      if (plural || context) errors.push(`${where}: a continuation row keeps ?plural and ?context empty`);
      open.en.push(en); open.uk.push(uk);
      continue;
    }
    open = null;
    if (!KEY_RE.test(key)) errors.push(`${where}: key "${key}" is not snake_case screen.element`);
    const id = key + '\u0000' + context;
    if (seen.has(id)) errors.push(`${where}: key "${key}"${context ? ` (context ${context})` : ''} repeats line ${seen.get(id)}`);
    seen.set(id, line);
    const e = { key, en: [en], uk: [uk], plural, context, line };
    entries.push(e);
    if (plural) open = e;
  }
  for (const e of entries) {
    const where = `${e.key} (line ${e.line})`;
    if (e.plural) {
      if (e.plural !== e.key) errors.push(`${where}: ?plural must repeat the key (the game calls tr_n(key, key, n))`);
      if (e.uk.length !== PLURAL_FORMS.uk) errors.push(`${where}: a plural needs ${PLURAL_FORMS.uk} rows (uk one, few, many), has ${e.uk.length}`);
      for (let i = 0; i < e.uk.length; i++) if (!e.uk[i]) errors.push(`${where}: uk plural form ${i + 1} is empty`);
      for (let i = 0; i < e.en.length; i++) {
        if (i < PLURAL_FORMS.en && !e.en[i]) errors.push(`${where}: en plural form ${i + 1} is empty`);
        if (i >= PLURAL_FORMS.en && e.en[i]) errors.push(`${where}: en has ${PLURAL_FORMS.en} plural forms; row ${i + 1} must leave en empty`);
      }
      e.en = e.en.slice(0, PLURAL_FORMS.en);
    } else {
      if (!e.en[0]) errors.push(`${where}: en is empty`);
      if (!e.uk[0]) errors.push(`${where}: uk is empty`);
    }
    const ref = placeholders(e.en[0]);
    for (const [lang, forms] of [['en', e.en], ['uk', e.uk]]) {
      forms.forEach((f, i) => {
        if (!f) return;
        if (!sameSet(placeholders(f), ref)) errors.push(`${where}: ${lang}${forms.length > 1 ? ' form ' + (i + 1) : ''} has placeholders {${placeholders(f).join('}, {')}} but en has {${ref.join('}, {')}}`);
        if (/[{}]/.test(f.replace(PH_RE, ''))) errors.push(`${where}: ${lang} has a stray brace: "${f}"`);
        if (lang === 'uk' && /['‘’`]/.test(f)) errors.push(`${where}: uk writes the apostrophe as ʼ (U+02BC): "${f}"`);
        for (const w of f.split(/[^\p{L}]+/u)) if (/\p{Script=Cyrillic}/u.test(w) && /\p{Script=Latin}/u.test(w)) errors.push(`${where}: ${lang} mixes Latin and Cyrillic letters in "${w}"`);
      });
    }
    if (e.plural && !ref.includes('count')) errors.push(`${where}: a plural string needs {count}`);
  }
  return { entries, errors };
}

// copy/flags.json, round 2: the open questions, each with options a-c (an option is the rows it would write: a row
// with empty uk and en removes that key; an option without rows keeps the deck as it is and says so in its label), and
// the decided ones (what was applied; "removed" names keys taken out of the deck). "asked" is when this round was put
// to the engineer: the page ignores answers saved before it.
function readFlags(text, entries) {
  const errors = [];
  let data;
  try { data = JSON.parse(text); } catch (e) { return { flags: [], decided: [], errors: ['flags: ' + e.message] }; }
  const flags = Array.isArray(data.open) ? data.open : [];
  const decided = Array.isArray(data.decided) ? data.decided : [];
  if (!Array.isArray(data.open)) errors.push('flags: no "open" array');
  if (!Array.isArray(data.decided)) errors.push('flags: no "decided" array');
  if (typeof data.asked !== 'string' || isNaN(Date.parse(data.asked))) errors.push('flags: "asked" must be an ISO time');
  if (typeof data.principle !== 'string' || !data.principle) errors.push('flags: "principle" is empty');
  const byKey = new Map(entries.map((e) => [e.key, e]));
  const seen = new Set();
  const ID_RE = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
  for (const f of flags) {
    const where = `flag ${f && f.id}`;
    if (!f || typeof f.id !== 'string' || !ID_RE.test(f.id)) { errors.push(`${where}: id must be a deck key or a topic.* id`); continue; }
    if (seen.has(f.id)) errors.push(`${where}: asked twice`);
    seen.add(f.id);
    if (!f.keys) f.keys = [f.id];
    if (!Array.isArray(f.keys) || !f.keys.length) { errors.push(`${where}: keys must be a list`); continue; }
    if (!f.id.startsWith('topic.') && (f.keys.length !== 1 || f.keys[0] !== f.id)) errors.push(`${where}: a flag on one key has that key as its id; several keys take a topic.* id`);
    for (const k of f.keys) if (!byKey.has(k)) errors.push(`${where}: no key ${k} in the deck`);
    if (!FLAG_KINDS.includes(f.kind)) errors.push(`${where}: kind must be one of ${FLAG_KINDS.join(', ')}`);
    if (typeof f.why !== 'string' || !f.why) errors.push(`${where}: why is empty`);
    if (!['rejected', 'new'].includes(f.round)) errors.push(`${where}: round must be "rejected" or "new"`);
    const opts = Array.isArray(f.options) ? f.options : [];
    if (opts.length < 1 || opts.length > OPTION_IDS.length) errors.push(`${where}: 1 to ${OPTION_IDS.length} options`);
    opts.forEach((o, i) => {
      const ow = `${where} option ${o && o.id}`;
      if (!o || o.id !== OPTION_IDS[i]) { errors.push(`${where}: option ${i + 1} must have id "${OPTION_IDS[i]}"`); return; }
      if (o.label !== undefined && (typeof o.label !== 'string' || !o.label)) errors.push(`${ow}: label must be a text`);
      if (o.note !== undefined && typeof o.note !== 'string') errors.push(`${ow}: note must be a text`);
      const rows = Array.isArray(o.rows) ? o.rows : null;
      if (!rows) { errors.push(`${ow}: rows must be a list`); return; }
      if (!rows.length && !o.label) errors.push(`${ow}: an option that keeps the deck needs a label`);
      let same = rows.length > 0;
      const rowKeys = new Set();
      for (const r of rows) {
        if (!r || !f.keys.includes(r.key)) { errors.push(`${ow}: row key ${r && r.key} is not one of the flag's keys`); same = false; continue; }
        if (rowKeys.has(r.key)) errors.push(`${ow}: key ${r.key} twice`);
        rowKeys.add(r.key);
        const e = byKey.get(r.key);
        if (typeof r.uk !== 'string' || typeof r.en !== 'string') { errors.push(`${ow}: ${r.key} needs uk and en texts`); continue; }
        if (!!r.uk !== !!r.en) errors.push(`${ow}: ${r.key}: give both uk and en, or neither (a removal)`);
        const ref = placeholders(e.en[0]);
        for (const k of ['uk', 'en']) if (r[k] && !sameSet(placeholders(r[k]), ref)) errors.push(`${ow}: ${r.key}: ${k} must keep the placeholders {${ref.join('}, {')}}`);
        if (r.uk && /['‘’`]/.test(r.uk)) errors.push(`${ow}: ${r.key}: uk writes the apostrophe as ʼ (U+02BC)`);
        if (!(r.uk === e.uk[0] && r.en === e.en[0])) same = false;
      }
      if (same) errors.push(`${ow}: every row is the current text; use no rows and a label`);
    });
  }
  const removed = Array.isArray(data.removed) ? data.removed : [];
  for (const k of removed) if (byKey.has(k)) errors.push(`removed key ${k} is still in the deck`);
  const done = new Set();
  for (const d of decided) {
    const where = `decided ${d && d.id}`;
    if (!d || typeof d.id !== 'string') { errors.push(`${where}: no id`); continue; }
    if (done.has(d.id) || seen.has(d.id)) errors.push(`${where}: listed twice`);
    done.add(d.id);
    if (!d.keys) d.keys = [d.id];
    for (const k of d.keys) if (!byKey.has(k) && !removed.includes(k)) errors.push(`${where}: no key ${k} in the deck or in "removed"`);
    if (typeof d.how !== 'string' || !d.how) errors.push(`${where}: how is empty`);
  }
  return { flags, decided, removed, asked: data.asked, principle: data.principle, errors };
}

// ---------- the wireframes' frames ----------

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return Object.prototype.hasOwnProperty.call(ENTITIES, e.toLowerCase()) ? ENTITIES[e.toLowerCase()] : m;
  });
}

// Every text node inside a .frame (outside inline SVG drawings), in document order, with its screen section:
// [{screen, raw, text}] where text is normalised the way the wireframes' EN switch does it.
function frameTexts(html) {
  const out = [];
  const stack = [];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let last = 0, m;
  const inFrame = () => stack.some((s) => s.frame) && !stack.some((s) => s.svg || s.raw);
  const screen = () => { for (let i = stack.length - 1; i >= 0; i--) if (stack[i].screen) return stack[i].screen; return ''; };
  const text = (s) => {
    if (!s || !inFrame()) return;
    const raw = decode(s);
    const norm = raw.replace(/\s+/g, ' ').trim();
    if (norm) out.push({ screen: screen(), raw, text: norm });
  };
  while ((m = re.exec(html))) {
    text(html.slice(last, m.index));
    last = re.lastIndex;
    if (!m[2]) continue; // a comment
    const tag = m[2].toLowerCase();
    if (m[1]) {
      for (let i = stack.length - 1; i >= 0; i--) if (stack[i].tag === tag) { stack.length = i; break; }
      continue;
    }
    const attrs = m[3] || '';
    if (VOID.has(tag) || /\/\s*$/.test(attrs)) continue;
    const cls = /\bclass\s*=\s*"([^"]*)"/.exec(attrs);
    const id = /\bid\s*=\s*"([^"]*)"/.exec(attrs);
    stack.push({
      tag,
      frame: !!cls && cls[1].split(/\s+/).includes('frame'),
      svg: tag === 'svg',
      raw: tag === 'script' || tag === 'style',
      screen: tag === 'section' && id ? id[1] : '',
    });
  }
  text(html.slice(last));
  return out;
}

function screenTitles(html) {
  const titles = {};
  for (const m of html.matchAll(/<section class="screen" id="(s\d+)"[^>]*>\s*<div class="head"><h2><span class="num">\d+<\/span>([^<]+)<\/h2>/g)) titles[m[1]] = decode(m[2]).trim();
  return titles;
}

// ---------- matching frame text to keys ----------

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function compile(entries) {
  const exact = new Map();
  const templates = [];
  const fragments = new Map();
  for (const e of entries) {
    e.uk.forEach((form0, fi) => {
      if (!form0) return;
      // A frame text is whitespace-normalised (a no-break space before a unit becomes a space), so the deck form is too.
      const form = form0.replace(/\u00a0/g, ' ');
      const names = placeholders(form);
      if (!names.length) {
        if (!exact.has(form)) exact.set(form, []);
        exact.get(form).push({ e, form: fi });
        return;
      }
      const parts = form.split(/\{[a-z_]+\}/);
      const re = new RegExp('^' + parts.map(escRe).reduce((acc, p, i) => acc + (i ? '(' + (PH_PATTERN[names[i - 1]] || PH_ANY) + ')' : '') + p, '') + '$', 'u');
      templates.push({ e, form: fi, names, re, weight: parts.join('').length });
      if (names.every((n) => PH_SPLIT.has(n))) {
        parts.forEach((p, pi) => {
          const t = p.trim();
          if (!t) return;
          if (!fragments.has(t)) fragments.set(t, []);
          fragments.get(t).push({ e, form: fi, part: pi });
        });
      }
    });
  }
  templates.sort((a, b) => b.weight - a.weight);
  return { exact, templates, fragments };
}

const fill = (s, values) => s.replace(PH_RE, (m, n) => (Object.prototype.hasOwnProperty.call(values, n) ? values[n] : m));

// One frame text node -> {kind: 'key'|'world'|'annotation'|'sample', keys, en} or {kind: 'missing'}. en is the
// English the EN switch shows for the whole node (decoration kept); null when the node stays as it is.
function matchNode(node, C, extras) {
  const head = (DECOR_HEAD.exec(node.text) || [''])[0];
  const core0 = node.text.slice(head.length);
  const tail = (DECOR_TAIL.exec(core0) || [''])[0];
  const core = core0.slice(0, core0.length - tail.length);
  const wrap = (s) => (head + s + tail).trim();
  if (!core) return { kind: 'none' };
  const ex = C.exact.get(core);
  if (ex) {
    const ens = [...new Set(ex.map((x) => x.e.en[0]))];
    if (ens.length > 1) return { kind: 'ambiguous', keys: ex.map((x) => x.e.key), core };
    return { kind: 'key', keys: ex.map((x) => x.e.key), en: wrap(ens[0]) };
  }
  if (extras.world[core]) return { kind: 'world', en: wrap(extras.world[core]) };
  if (extras.annotations[core]) return { kind: 'annotation', en: wrap(extras.annotations[core]) };
  if (extras.samples.includes(core)) return { kind: 'sample', en: null };
  for (const t of C.templates) {
    const m = t.re.exec(core);
    if (!m) continue;
    const values = {};
    // A value that is itself a deck string (a task name inside a setting's label) is shown in English too.
    t.names.forEach((n, i) => { const v = m[i + 1]; const x = C.exact.get(v); values[n] = x ? x[0].e.en[0] : v; });
    let enText = t.e.en[0];
    if (t.e.plural) {
      const n = Number(values.count);
      if (ukForm(n) !== t.form) return { kind: 'plural', keys: [t.e.key], core, n, form: t.form };
      enText = t.e.en[enForm(n)];
    }
    return { kind: 'key', keys: [t.e.key], en: wrap(fill(enText, values)) };
  }
  const fr = C.fragments.get(core);
  if (fr) {
    const x = fr[0];
    const ukParts = x.e.uk[x.form].split(/\{[a-z_]+\}/);
    const enParts = x.e.en[0].split(/\{[a-z_]+\}/);
    if (placeholders(x.e.uk[x.form]).join() !== placeholders(x.e.en[0]).join()) return { kind: 'order', keys: [x.e.key], core };
    let s = enParts[x.part];
    const u = ukParts[x.part];
    if (/^\s/.test(u) || x.part === 0) s = s.replace(/^\s+/, '');
    if (/\s$/.test(u) || x.part === ukParts.length - 1) s = s.replace(/\s+$/, '');
    return { kind: 'key', keys: [x.e.key], en: (head.trim() ? head : '') + s + (tail.trim() ? tail : ''), fragment: true };
  }
  return { kind: 'missing', core };
}

// Matches every Cyrillic frame text; returns {nodes, en (the EN map, document order), used (key -> screens), errors}.
function matchFrames(html, entries, extras) {
  const C = compile(entries);
  const errors = [];
  const en = {};
  const used = new Map();
  const nodes = frameTexts(html).filter((n) => CYRILLIC.test(n.text));
  for (const n of nodes) {
    const r = matchNode(n, C, extras);
    n.match = r;
    const where = `${n.screen || 'outside a screen'}: "${n.text}"`;
    if (r.kind === 'missing') { errors.push(`${where}: no key in ${DECK} matches this frame text (add a row, or list it in ${EXTRAS} if it is not player-facing)`); continue; }
    if (r.kind === 'ambiguous') { errors.push(`${where}: keys ${r.keys.join(', ')} share this Ukrainian text but differ in English`); continue; }
    if (r.kind === 'plural') { errors.push(`${where}: ${r.keys[0]} uses plural form ${r.form + 1} for ${r.n}, Ukrainian needs form ${ukForm(r.n) + 1}`); continue; }
    if (r.kind === 'order') { errors.push(`${where}: ${r.keys[0]} is drawn in pieces, so en and uk need their placeholders in the same order`); continue; }
    if (r.kind === 'key') for (const k of r.keys) { if (!used.has(k)) used.set(k, []); if (!used.get(k).includes(n.screen)) used.get(k).push(n.screen); }
    if (r.en !== null && r.en !== undefined) {
      if (Object.prototype.hasOwnProperty.call(en, n.text) && en[n.text] !== r.en) errors.push(`${where}: two different English texts for the same frame text`);
      en[n.text] = r.en;
    }
  }
  return { nodes, en, used, errors };
}

function readExtras(text) {
  const x = JSON.parse(text);
  return { world: x.world || {}, annotations: x.annotations || {}, samples: x.samples || [] };
}

// Everything at once, from the repo (or another root, for tests).
function load(root) {
  const r = root || ROOT;
  const deck = readDeck(readText(DECK, r));
  const flags = readFlags(readText(FLAGS, r), deck.entries);
  const html = readText(WIREFRAMES, r);
  const extras = readExtras(readText(EXTRAS, r));
  const frames = matchFrames(html, deck.entries, extras);
  return { deck, flags, html, extras, frames, titles: screenTitles(html), errors: [...deck.errors, ...flags.errors, ...frames.errors] };
}

module.exports = {
  ROOT, DECK, FLAGS, WIREFRAMES, EXTRAS, EN_JSON, HEADER, FLAG_KINDS, OPTION_IDS,
  ukForm, parseCsv, readDeck, readFlags, frameTexts, screenTitles, matchFrames, readExtras, load, placeholders,
};
