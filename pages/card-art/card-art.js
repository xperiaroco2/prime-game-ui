// The card-art choice page's behaviour (prime-game-ui#3): a tap on a style block picks that style, «Зберегти нотатку»
// saves the note with the style already picked, UA/EN switches the captions. Saved through the artifact runtime's db
// capability when this view has it: collection CFG.collection, document CFG.doc, { style: "<id>" | null, note, at }.
// Nothing is written on load; a write happens only on a tap, one at a time (a tap during a write waits and is written
// after it). A tap made before the store answers waits and is written when it arrives; a refused write puts back the
// last saved choice. Without db the page still works for this view and says the choice cannot be saved here. The
// pattern of pages/wave-19/questions/questions.js, for one document.
(function () {
  'use strict';
  var CFG = {};
  try { CFG = JSON.parse(document.getElementById('ca-data').textContent) || {}; } catch (e) { CFG = {}; }
  var NAMES = CFG.names || {};
  var COL = typeof CFG.collection === 'string' ? CFG.collection : 'cards3';
  var DOC = typeof CFG.doc === 'string' ? CFG.doc : 'choice';
  var saved = null;
  var local = null;
  var ref = null;
  var mode = 'wait';
  var tag = '';
  var readOnly = false;
  var inflight = false;
  var queued = null;
  var dirty = false;
  var TEXT = {
    wait: 'Підключаю збереження…',
    ok: 'Вибір і нотатка зберігаються тут, разом зі сторінкою.',
    readOnly: 'Ця сторінка тут лише для перегляду: вибір не зберігається.',
    none: 'Тут вибір не зберігається: сторінку відкрито без сховища. Вибір лишиться до перезавантаження; напиши його мені в чат.',
  };
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function str(v, max) { return typeof v === 'string' ? v.slice(0, max) : ''; }
  function fmtTime(iso) {
    try { var d = new Date(iso); return isNaN(d.getTime()) ? '' : d.toLocaleString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  }
  var blocks = all('[data-style]');
  var noteEl = document.getElementById('ca-note');
  var saveBtn = document.getElementById('ca-save');

  function current() { return local || saved; }
  function styleOf(c) { return c && Object.prototype.hasOwnProperty.call(NAMES, c.style) ? c.style : null; }

  function render() {
    var c = current();
    var style = styleOf(c);
    blocks.forEach(function (b) {
      var on = b.getAttribute('data-style') === style;
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('is-chosen', on);
      var st = b.querySelector('[data-pick-state]');
      if (st) st.textContent = on ? '✓ Обрано' : 'Обрати цей стиль';
    });
    var picked = document.getElementById('ca-picked');
    if (picked) picked.innerHTML = '';
    if (picked) {
      picked.appendChild(document.createTextNode(style ? 'Обрано: ' : 'Ще не обрано'));
      if (style) { var b = document.createElement('b'); b.textContent = NAMES[style]; picked.appendChild(b); }
    }
    if (noteEl && c && document.activeElement !== noteEl && !dirty) noteEl.value = c.note || '';
    var out = document.getElementById('ca-saved');
    if (out) {
      var text;
      if (inflight) text = 'Зберігаю…';
      else if (mode === 'db' && saved && !local) {
        var st2 = styleOf(saved);
        text = 'Збережено: ' + (st2 ? NAMES[st2] : 'стиль ще не обрано') + (saved.at ? ' · ' + fmtTime(saved.at) : '');
        if (saved.note) text += '\nНотатка: ' + saved.note;
      } else if (local) text = (mode === 'db' ? 'Ще не збережено' : 'Не збережено (немає сховища)') + (styleOf(local) ? ': ' + NAMES[styleOf(local)] : '');
      else text = 'Ще нічого не збережено';
      out.textContent = text;
      out.classList.toggle('is-done', mode === 'db' && !!saved && !local && !inflight);
    }
  }

  function notice(kind, text, t) {
    mode = kind;
    tag = t || '';
    var el = document.getElementById('ca-db');
    if (el) { el.setAttribute('data-state', t || kind); el.textContent = text; }
    if (saveBtn) saveBtn.disabled = readOnly;
    render();
  }
  function noDb() {
    if (mode === 'db') return;
    notice('none', TEXT.none, 'none');
  }
  function write(doc) {
    if (readOnly) return;
    local = doc;
    if (!ref) { render(); return; }
    if (inflight) { queued = doc; render(); return; }
    send(doc);
  }
  function send(doc) {
    inflight = true;
    render();
    var p;
    try { p = ref.set(doc); } catch (e) { p = Promise.reject(e); }
    p.then(function () {
      inflight = false;
      saved = doc;
      var next = queued;
      queued = null;
      if (next) { send(next); return; }
      local = null;
      if (tag === 'write-error') notice('db', TEXT.ok, 'ok');
      render();
    }, function (e) {
      inflight = false;
      queued = null;
      local = null;
      var code = e && e.code;
      if (code === 'not_granted' || code === 'permission_denied') { readOnly = true; notice('db', TEXT.readOnly, 'read-only'); }
      else notice('db', 'Не вдалося зберегти (' + (code || 'помилка') + '). Вибір не змінився; спробуй ще раз трохи пізніше.', 'write-error');
      render();
    });
  }
  function noteValue() { return noteEl ? noteEl.value.trim().slice(0, 2000) : ''; }

  blocks.forEach(function (b) {
    b.addEventListener('click', function () {
      if (readOnly) return;
      dirty = false;
      write({ style: b.getAttribute('data-style'), note: noteValue(), at: new Date().toISOString() });
    });
  });
  if (noteEl) noteEl.addEventListener('input', function () { dirty = true; });
  if (saveBtn) saveBtn.addEventListener('click', function () {
    var c = current();
    var note = noteValue();
    if (!c && !note) return;
    dirty = false;
    write({ style: styleOf(c), note: note, at: new Date().toISOString() });
  });

  // UA/EN: the captions' language, remembered in this browser only.
  var langBtns = all('[data-lang-set]');
  function setLang(l) {
    document.documentElement.setAttribute('data-lang', l);
    langBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang-set') === l)); });
  }
  var startLang = 'uk';
  try { if (window.localStorage.getItem('card-art-lang') === 'en') startLang = 'en'; } catch (e) { /* no storage */ }
  setLang(startLang);
  langBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang-set');
      setLang(l);
      try { window.localStorage.setItem('card-art-lang', l); } catch (e) { /* no storage */ }
    });
  });

  function start(db) {
    try {
      ref = db.collection(COL).doc(DOC);
      ref.onSnapshot(function (snap) {
        try {
          var v = snap && snap.exists ? snap.data() : null;
          saved = v && typeof v === 'object' ? { style: typeof v.style === 'string' ? v.style.slice(0, 40) : null, note: str(v.note, 2000), at: str(v.at, 40) } : null;
          render();
        } catch (e) { /* a malformed snapshot: keep what is shown */ }
      }, function (e) {
        notice('db', 'Збережений вибір зараз не оновлюється (' + ((e && e.code) || 'помилка') + '). Перезавантаж сторінку.', 'live-error');
      });
      notice('db', readOnly ? TEXT.readOnly : TEXT.ok, readOnly ? 'read-only' : 'ok');
      if (readOnly) { local = null; render(); }
      else if (local && !inflight) send(local);
    } catch (e) {
      ref = null;
      noDb();
    }
  }
  notice('wait', TEXT.wait, 'wait');
  try {
    var claude = window.claude;
    if (!claude || typeof claude.use !== 'function') { noDb(); }
    else {
      claude.use('user').then(function (user) {
        if (!user || typeof user.can !== 'function') return;
        return user.can('data.write').then(function (ok) {
          if (ok === false) { readOnly = true; local = null; if (mode === 'db') notice('db', TEXT.readOnly, 'read-only'); else render(); }
        });
      }).catch(function () { /* no user capability: let a refused write decide */ });
      claude.use('db').then(function (db) { if (db) start(db); else noDb(); }, noDb);
    }
  } catch (e) {
    noDb();
  }
})();
