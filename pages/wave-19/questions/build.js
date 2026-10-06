// The wave-19 question page (prime-game-ui#19): the questions the screen reviews left for the engineer, each option
// shown as a picture of the real screen, answered by tapping. questions.json holds the Ukrainian texts and names the
// pictures; render.js makes the pictures (outside the repo; they are published next to the page as img/<name>.jpg,
// never committed); questions.css and questions.js are inlined.
//
//   node pages/wave-19/questions/build.js                   write questions.html
//   node pages/wave-19/questions/build.js --check           exit 1 when questions.html is stale
//   node pages/wave-19/questions/build.js --renders <dir>   also check that every picture is in <dir> at the size
//                                                           questions.json gives (combine with --check or not)
//
// Answers are saved through the artifact runtime's db capability (declare {db: {}, user: {}} when publishing):
// collection questions.json's "collection", one document per question id, {answer: "a" | "b" | "c" | null, note, at}.
// Deterministic and LF-only. Node 20, no packages.
'use strict';

const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const SRC = path.join(HERE, 'questions.json');
const OUT = path.join(HERE, 'questions.html');
const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap';
const TITLE = 'Питання хвилі 19';

class BuildError extends Error {}
const fail = (msg) => { throw new BuildError(msg); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8').replace(/\r\n/g, '\n').replace(/\s+$/, '');
const isStr = (v) => typeof v === 'string' && v.trim() !== '' && v === v.trim();

function load() {
  let data;
  try { data = JSON.parse(fs.readFileSync(SRC, 'utf8')); } catch (e) { fail(`questions.json: ${e.message}`); }
  for (const k of ['title', 'eyebrow', 'lead', 'collection']) if (!isStr(data[k])) fail(`questions.json: "${k}" is a non-empty string`);
  if (!/^[a-z][a-z0-9_]*$/.test(data.collection)) fail('questions.json: "collection" is a db collection name (one path segment)');
  if (!Array.isArray(data.questions) || !data.questions.length) fail('questions.json: "questions" is a non-empty array');
  const ids = new Set(), files = new Set();
  data.questions.forEach((q, i) => {
    const at = `questions[${i}]`;
    if (!/^q\d+$/.test(q.id || '') || ids.has(q.id)) fail(`${at}: id is q<n> and unique`);
    ids.add(q.id);
    for (const k of ['screen', 'title', 'shows']) if (!isStr(q[k])) fail(`${at} (${q.id}): "${k}" is a non-empty string`);
    if (!Array.isArray(q.why) || !q.why.length || q.why.length > 2 || !q.why.every(isStr)) fail(`${at} (${q.id}): "why" is one or two lines`);
    if (!Array.isArray(q.options) || q.options.length < 2) fail(`${at} (${q.id}): "options" has two or more options`);
    q.options.forEach((o, j) => {
      const oat = `${at}.options[${j}]`;
      if (o.id !== 'abc'[j]) fail(`${oat}: the options are a, b, c in order`);
      if (!isStr(o.label)) fail(`${oat}: "label" is a non-empty string`);
      if ('note' in o && !isStr(o.note)) fail(`${oat}: "note" is a non-empty string`);
      if (!Array.isArray(o.images) || !o.images.length) fail(`${oat}: "images" lists the option's pictures`);
      o.images.forEach((im, k) => {
        const iat = `${oat}.images[${k}]`;
        if (!/^[a-z0-9-]+\.jpg$/.test(im.src || '')) fail(`${iat}: "src" is a file name like q1a-bars-uk.jpg`);
        if (files.has(im.src)) fail(`${iat}: ${im.src} is used twice`);
        files.add(im.src);
        if (!Array.isArray(im.size) || im.size.length !== 2 || !im.size.every((n) => Number.isInteger(n) && n > 0 && n <= 2000)) fail(`${iat}: "size" is [width, height] in px`);
        if (!isStr(im.alt)) fail(`${iat}: "alt" describes the picture`);
        if ('lang' in im && im.lang !== 'en') fail(`${iat}: "lang" is "en" for an English picture (Ukrainian is the default)`);
        if ('label' in im && !isStr(im.label)) fail(`${iat}: "label" is a non-empty string`);
      });
    });
  });
  return data;
}

// The size of a baseline or progressive JPEG (its SOF segment).
function jpegSize(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let off = 2;
  while (off + 9 < buf.length) {
    if (buf[off] !== 0xff) { off++; continue; }
    const marker = buf[off + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { off += 2; continue; }
    const len = buf.readUInt16BE(off + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return [buf.readUInt16BE(off + 7), buf.readUInt16BE(off + 5)];
    }
    off += 2 + len;
  }
  return null;
}

function checkRenders(data, dir) {
  const problems = [];
  const want = new Set();
  for (const q of data.questions) for (const o of q.options) for (const im of o.images) {
    want.add(im.src);
    let buf;
    try { buf = fs.readFileSync(path.join(dir, im.src)); } catch (e) { problems.push(`${im.src}: missing in ${dir}`); continue; }
    const size = jpegSize(buf);
    if (!size) problems.push(`${im.src}: not a JPEG`);
    else if (size[0] !== im.size[0] || size[1] !== im.size[1]) problems.push(`${im.src}: ${size[0]}x${size[1]}, questions.json says ${im.size[0]}x${im.size[1]}`);
  }
  const extra = fs.readdirSync(dir).filter((f) => f.endsWith('.jpg') && !want.has(f));
  return { problems, extra, count: want.size };
}

function figure(im) {
  const en = im.lang === 'en';
  const cap = en ? (im.label ? `${im.label}, англійською` : 'Англійською') : im.label || '';
  return `<figure class="shot${en ? ' en' : ''}"><button class="zoom" type="button" data-zoom aria-label="Збільшити картинку"><img src="img/${esc(im.src)}" width="${im.size[0]}" height="${im.size[1]}" alt="${esc(im.alt)}" loading="lazy" decoding="async"></button>` +
    (cap ? `<figcaption>${esc(cap)}</figcaption>` : '') + '</figure>';
}

function question(q, n) {
  const opts = q.options.map((o) => {
    const uk = o.images.filter((im) => im.lang !== 'en'), en = o.images.filter((im) => im.lang === 'en');
    return [
      `      <li class="opt" data-opt="${o.id}">`,
      `        <div class="opt-head"><span class="letter" aria-hidden="true">${o.id}</span><p class="opt-label" id="${q.id}-${o.id}">${esc(o.label)}${o.id === 'a' ? ' <span class="badge">рекомендую</span>' : ''}</p></div>`,
      o.note ? `        <p class="opt-note">${esc(o.note)}</p>` : null,
      `        <div class="shots">${uk.concat(en).map(figure).join('')}</div>`,
      `        <button class="btn quiet" type="button" data-answer="${o.id}" aria-pressed="false" aria-describedby="${q.id}-${o.id}">Беру цей</button>`,
      '      </li>',
    ].filter((x) => x !== null).join('\n');
  });
  return [
    `  <section class="q" id="${q.id}" data-q="${q.id}" aria-labelledby="${q.id}-title">`,
    '    <div class="q-head">',
    `      <span class="eyebrow">Питання ${n} · ${esc(q.screen)}</span>`,
    `      <h2 id="${q.id}-title">${esc(q.title)}</h2>`,
    `      <div class="why">${q.why.map((l) => `<p>${esc(l)}</p>`).join('')}</div>`,
    `      <p class="shows">На картинках: ${esc(q.shows.charAt(0).toLowerCase() + q.shows.slice(1))}</p>`,
    '    </div>',
    '    <ul class="opts">',
    opts.join('\n'),
    '    </ul>',
    '    <div class="note">',
    `      <label for="${q.id}-note">Інакше або нотатка</label>`,
    `      <textarea id="${q.id}-note" data-note maxlength="2000" placeholder="Якщо жоден варіант не підходить, напиши, як треба"></textarea>`,
    '      <button class="btn quiet" type="button" data-save>Зберегти нотатку</button>',
    '    </div>',
    '    <p class="saved" data-saved>Ще без відповіді</p>',
    '  </section>',
  ].join('\n');
}

function page(data) {
  const total = data.questions.length;
  return [
    `<title>${esc(TITLE)}</title>`,
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${FONT_LINK}">`,
    `<style>\n${read('questions.css')}\n</style>`,
    '<!-- Generated by pages/wave-19/questions/build.js from questions.json. Do not edit. -->',
    '',
    '<div class="wrap">',
    '  <header class="head">',
    `    <span class="eyebrow">${esc(data.eyebrow)}</span>`,
    `    <h1>${esc(data.title)}</h1>`,
    `    <p class="lead">${esc(data.lead)}</p>`,
    '  </header>',
    '  <div class="bar">',
    `    <span class="count">Відповідей: <b><span id="q-done">0</span> з ${total}</b></span>`,
    '    <button class="btn" type="button" id="q-all">Беру всі рекомендовані</button>',
    '  </div>',
    '  <p class="db" id="q-db" role="status" data-state="wait">Підключаю збереження…</p>',
    data.questions.map((q, i) => question(q, i + 1)).join('\n'),
    '  <section class="summary" id="q-summary" hidden>',
    '    <h2>Підсумок для чату</h2>',
    '    <p>Тут відповіді не зберігаються, тож скопіюй цей підсумок і встав мені в чат.</p>',
    '    <label class="eyebrow" for="q-summary-text">Твої відповіді</label>',
    '    <textarea id="q-summary-text" readonly></textarea>',
    '    <button class="btn quiet" type="button" id="q-copy">Копіювати</button>',
    '  </section>',
    '  <p class="foot">Кожну картинку зібрано з тих самих описів екранів, що підуть у гру: варіант застосовано до копії, і екран зібрано заново. Відповідь можна змінити, поки її не застосовано.</p>',
    '</div>',
    '<div class="lightbox" id="q-zoom" role="dialog" aria-modal="true" aria-label="Картинка більшою" hidden>',
    '  <div class="lb-bar"><span class="lb-hint">Гортай, щоб побачити все</span><button class="btn quiet" type="button" id="q-zoom-close">Закрити</button></div>',
    '  <div class="lb-scroll" id="q-zoom-scroll"><img id="q-zoom-img" src="data:," alt=""></div>',
    '</div>',
    '',
    `<script>\nvar COLLECTION = ${JSON.stringify(data.collection)};\n${read('questions.js')}\n</script>`,
    '',
  ].join('\n');
}

function main(argv) {
  const usage = 'usage: node pages/wave-19/questions/build.js [--check] [--renders <dir>]';
  const check = argv.includes('--check');
  const ri = argv.indexOf('--renders');
  const renders = ri >= 0 ? argv[ri + 1] : null;
  const rest = argv.filter((a, i) => a !== '--check' && i !== ri && i !== ri + 1);
  if (rest.length || (ri >= 0 && !renders)) { console.error(usage); return 2; }
  let data, html;
  try {
    data = load();
    html = page(data);
  } catch (e) {
    if (e instanceof BuildError) { console.error('error: ' + e.message); return 1; }
    throw e;
  }
  let status = 0;
  if (renders) {
    const r = checkRenders(data, path.resolve(renders));
    for (const p of r.problems) console.error('renders: ' + p);
    if (r.extra.length) console.log(`renders: not on the page: ${r.extra.join(', ')}`);
    if (r.problems.length) status = 1;
    else console.log(`renders: all ${r.count} pictures present at their sizes in ${path.resolve(renders)}`);
  }
  if (check) {
    let disk = null;
    try { disk = fs.readFileSync(OUT, 'utf8'); } catch (e) { disk = null; }
    if (disk !== html) { console.log('stale: pages/wave-19/questions/questions.html; run node pages/wave-19/questions/build.js'); return 1; }
    console.log('up to date: pages/wave-19/questions/questions.html');
    return status;
  }
  fs.writeFileSync(OUT, html);
  console.log(`wrote pages/wave-19/questions/questions.html (${Math.round(Buffer.byteLength(html) / 1024)} KB, ${data.questions.length} questions)`);
  return status;
}

process.exitCode = main(process.argv.slice(2));
