// The room-signs page's behaviour: the package's room (every sign marked data-swap follows it), the colour-vision
// switch for the scenes, and the engineer's choice saved through the artifact runtime's db capability when this view
// has it, as pages/choices/choices.js does. Collection "signs": doc "system" { option: "a" | "b" | "c" | "mix" | null,
// note, at } (null: a note without a choice), doc "binding" { option: "one" | "many" | null, note, at } (the second
// question: one drop-off per room, or several spots of which any free one takes the room's package) and, optional,
// doc "room-<id>" { note, at } per room. Nothing is written
// on load; a write happens only on a tap, one at a time per document. A tap made before the store answers waits and is
// written when it arrives; a refused write puts back the last saved answer. Without db the page still works and says so.
(function () {
  'use strict';
  var DATA = { options: {}, rooms: {}, bindings: {} };
  try { DATA = JSON.parse(document.getElementById('rs-data').textContent) || DATA; } catch (e) { /* keep the empty data */ }
  var OPTIONS = ['a', 'b', 'c', 'mix'];
  var BINDINGS = ['one', 'many'];
  var ROOM_RE = /-(storage|hall|kitchen|lab|office|lounge|workshop|server)$/;
  var VISIONS = ['protan', 'deutan', 'tritan', 'grey'];
  function all(sel, from) { return Array.prototype.slice.call((from || document).querySelectorAll(sel)); }

  // ----- the package's room -----
  all('[data-room]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var room = btn.getAttribute('data-room');
      all('[data-room]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      all('use[data-swap]').forEach(function (u) {
        var h = u.getAttribute('href') || '';
        if (ROOM_RE.test(h)) u.setAttribute('href', h.replace(ROOM_RE, '-' + room));
      });
      all('[data-room-name]').forEach(function (el) { el.textContent = DATA.rooms[room] || room; });
    });
  });

  // ----- frame size: big frames go one system per row (page.css [data-zoom="2"]) -----
  all('[data-zoom]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      all('[data-zoom]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      document.documentElement.setAttribute('data-zoom', btn.getAttribute('data-zoom'));
    });
  });

  // ----- colour vision: a precomputed palette class on each scene group (signs-cvd.css) -----
  all('[data-vision]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var v = btn.getAttribute('data-vision');
      all('[data-vision]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      all('.rs-cvd-target').forEach(function (el) {
        VISIONS.forEach(function (x) { el.classList.remove('rs-v-' + x); });
        if (VISIONS.indexOf(v) >= 0) el.classList.add('rs-v-' + v);
      });
    });
  });

  // ----- the store -----
  var saved = {};    // the last snapshot, plus writes confirmed since
  var local = {};    // taps not confirmed yet, shown over saved
  var state = {};    // what is shown
  var col = null;
  var mode = 'wait';
  var tag = '';      // which notice is shown: 'ok', 'write-error', 'live-error', 'read-only'
  var readOnly = false;
  var inflight = {};
  var queued = {};
  var TEXT = {
    ok: 'Відповідь зберігається тут, разом зі сторінкою.',
    readOnly: 'Ця сторінка тут лише для перегляду: відповідь не зберігається.',
  };

  function fmtTime(iso) {
    try { var d = new Date(iso); return isNaN(d.getTime()) ? '' : d.toLocaleString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  }
  function optTitle(o) { return o === 'mix' ? 'змішати (у нотатці)' : (DATA.options[o] || o); }
  function bindTitle(o) { return (DATA.bindings && DATA.bindings[o]) || o; }
  function noteInput() { return document.getElementById('rs-note'); }
  function noteText() { var t = noteInput(); return t ? t.value.trim().slice(0, 2000) : ''; }
  function bindInput() { return document.getElementById('rs-bind-note'); }
  function bindText() { var t = bindInput(); return t ? t.value.trim().slice(0, 2000) : ''; }
  // The line over a question's cards: the saved answer, when, and whether a write is on its way.
  function savedLine(id, el, title, note) {
    if (!el) return;
    var s = state[id] || {};
    var text = title ? 'ваша відповідь: ' + title : (note ? 'є нотатка' : 'ще без відповіді');
    if (s.at && mode === 'db') text += ' · ' + fmtTime(s.at);
    if (inflight[id]) text += ' · зберігаю…';
    else if (local[id] && mode === 'wait') text += ' · ще не збережено';
    el.textContent = text;
    el.classList.toggle('is-done', !!title);
  }

  function render() {
    var s = state.system || {};
    var opt = OPTIONS.indexOf(s.option) >= 0 ? s.option : null;
    all('.rs-opt[data-o]').forEach(function (card) { card.classList.toggle('is-chosen', card.getAttribute('data-o') === opt); });
    savedLine('system', document.getElementById('rs-saved'), opt ? optTitle(opt) : '', s.note);
    var input = noteInput();
    if (input && typeof s.note === 'string' && document.activeElement !== input && !input.getAttribute('data-dirty')) input.value = s.note;
    var b = state.binding || {};
    var bopt = BINDINGS.indexOf(b.option) >= 0 ? b.option : null;
    all('.rs-opt[data-b]').forEach(function (card) { card.classList.toggle('is-chosen', card.getAttribute('data-b') === bopt); });
    savedLine('binding', document.getElementById('rs-bind-saved'), bopt ? bindTitle(bopt) : '', b.note);
    var binput = bindInput();
    if (binput && typeof b.note === 'string' && document.activeElement !== binput && !binput.getAttribute('data-dirty')) binput.value = b.note;
    var lines = [];
    if (opt || s.note) lines.push('Знаки кімнат: ' + (opt ? optTitle(opt) : '—') + (s.note ? ' — ' + s.note : ''));
    if (bopt || b.note) lines.push('Точка доставки: ' + (bopt ? bindTitle(bopt) : '—') + (b.note ? ' — ' + b.note : ''));
    all('[data-room-note]').forEach(function (box) {
      var id = 'room-' + box.getAttribute('data-room-note');
      var d = state[id];
      var ta = box.querySelector('textarea');
      var st = box.querySelector('[data-room-saved]');
      if (ta && d && typeof d.note === 'string' && document.activeElement !== ta && !ta.getAttribute('data-dirty')) ta.value = d.note;
      if (st) {
        var t = '';
        if (inflight[id]) t = 'зберігаю…';
        else if (local[id] && mode !== 'db') t = 'ще не збережено';
        else if (d && d.note) t = 'збережено';
        st.textContent = t;
      }
      if (d && d.note) lines.push(box.getAttribute('data-name') + ': ' + d.note);
    });
    var box = document.getElementById('rs-summary');
    var area = document.getElementById('rs-summary-text');
    if (box && area) {
      box.hidden = mode === 'db' || !lines.length;
      area.value = lines.join('\n');
    }
  }

  function notice(kind, text, t) {
    mode = kind;
    tag = t || '';
    var el = document.getElementById('rs-db');
    if (el) { el.setAttribute('data-state', kind); el.textContent = text; }
    all('.rs-take, .rs-bind, [data-save-note], [data-save-bind-note], [data-save-room]').forEach(function (b) { b.disabled = readOnly; });
    render();
  }
  function noDb() {
    if (mode === 'db') return;
    notice('none', 'Тут відповідь не зберігається: сторінка відкрита без сховища. Вибір лишиться до перезавантаження; підсумок унизу можна скопіювати в чат.');
  }

  function show() {
    state = {};
    Object.keys(saved).forEach(function (k) { state[k] = saved[k]; });
    Object.keys(local).forEach(function (k) { state[k] = local[k]; });
    render();
  }
  // Before the store answers (col is null) a tap waits in local; start() sends it. Without a store it stays there.
  function write(id, doc) {
    if (readOnly) return;
    local[id] = doc;
    if (!col) { show(); return; }
    if (inflight[id]) { queued[id] = doc; show(); return; }
    send(id, doc);
  }
  function send(id, doc) {
    inflight[id] = true;
    show();
    var p;
    try { p = col.doc(id).set(doc); } catch (e) { p = Promise.reject(e); }
    p.then(function () {
      inflight[id] = false;
      saved[id] = doc;
      var next = queued[id];
      queued[id] = null;
      if (next) { send(id, next); return; }
      delete local[id];
      if (tag === 'write-error') notice('db', TEXT.ok, 'ok');
      show();
    }, function (e) {
      inflight[id] = false;
      queued[id] = null;
      delete local[id];
      var code = e && e.code;
      if (code === 'invalid_argument') { readOnly = true; notice('db', TEXT.readOnly, 'read-only'); }
      else notice('db', 'Не вдалося зберегти (' + (code || 'помилка') + '). Відповідь не змінилася; спробуйте ще раз трохи пізніше.', 'write-error');
      show();
    });
  }
  function now() { return new Date().toISOString(); }

  var hint = document.getElementById('rs-mix-hint');
  all('.rs-take').forEach(function (b) {
    b.addEventListener('click', function () {
      var o = b.getAttribute('data-take');
      var note = noteText();
      if (o === 'mix' && !note) {
        if (hint) hint.hidden = false;
        var t = noteInput();
        if (t) t.focus();
        return;
      }
      if (hint) hint.hidden = true;
      var t2 = noteInput();
      if (t2) t2.removeAttribute('data-dirty');
      write('system', { option: o, note: note, at: now() });
    });
  });
  var save = document.querySelector('[data-save-note]');
  if (save) save.addEventListener('click', function () {
    var t = noteInput();
    if (t) t.removeAttribute('data-dirty');
    var note = noteText();
    if (!note && !state.system) return;
    var cur = state.system || {};
    write('system', { option: OPTIONS.indexOf(cur.option) >= 0 ? cur.option : null, note: note, at: now() });
  });
  var input = noteInput();
  if (input) input.addEventListener('input', function () { input.setAttribute('data-dirty', '1'); if (hint && input.value.trim()) hint.hidden = true; });

  // The second question: the same tap-only writes, doc "binding".
  all('.rs-bind').forEach(function (b) {
    b.addEventListener('click', function () {
      var o = b.getAttribute('data-bind');
      if (BINDINGS.indexOf(o) < 0) return;
      var t = bindInput();
      if (t) t.removeAttribute('data-dirty');
      write('binding', { option: o, note: bindText(), at: now() });
    });
  });
  var saveBind = document.querySelector('[data-save-bind-note]');
  if (saveBind) saveBind.addEventListener('click', function () {
    var t = bindInput();
    if (t) t.removeAttribute('data-dirty');
    var note = bindText();
    if (!note && !state.binding) return;
    var cur = state.binding || {};
    write('binding', { option: BINDINGS.indexOf(cur.option) >= 0 ? cur.option : null, note: note, at: now() });
  });
  var binput = bindInput();
  if (binput) binput.addEventListener('input', function () { binput.setAttribute('data-dirty', '1'); });
  all('[data-room-note]').forEach(function (box) {
    var id = 'room-' + box.getAttribute('data-room-note');
    var ta = box.querySelector('textarea');
    var btn = box.querySelector('[data-save-room]');
    if (ta) ta.addEventListener('input', function () { ta.setAttribute('data-dirty', '1'); });
    if (btn) btn.addEventListener('click', function () {
      if (!ta) return;
      ta.removeAttribute('data-dirty');
      var note = ta.value.trim().slice(0, 2000);
      if (!note && !state[id]) return;
      write(id, { note: note, at: now() });
    });
  });

  function clean(id, v) {
    if (!v || typeof v !== 'object') return null;
    var note = typeof v.note === 'string' ? v.note : '';
    var at = typeof v.at === 'string' ? v.at : '';
    if (id === 'system') return { option: OPTIONS.indexOf(v.option) >= 0 ? v.option : null, note: note, at: at };
    if (id === 'binding') return { option: BINDINGS.indexOf(v.option) >= 0 ? v.option : null, note: note, at: at };
    if (/^room-[a-z]+$/.test(id)) return { note: note, at: at };
    return null;
  }

  // The runtime: window.claude.use("db") resolves the store or null. Absent outside a claude.ai view.
  function start(db) {
    try {
      col = db.collection('signs');
      col.onSnapshot(function (snap) {
        try {
          var next = {};
          snap.docs.forEach(function (d) {
            var v = clean(d.id, d.exists ? d.data() : null);
            if (v) next[d.id] = v;
          });
          saved = next;
          show();
        } catch (e) { /* a malformed snapshot: keep what is shown */ }
      }, function (e) {
        notice('db', 'Збережена відповідь зараз не оновлюється (' + ((e && e.code) || 'помилка') + '). Перезавантажте сторінку.', 'live-error');
      });
      notice('db', readOnly ? TEXT.readOnly : TEXT.ok, readOnly ? 'read-only' : 'ok');
      // Taps made while the store was on its way.
      if (readOnly) { local = {}; show(); }
      else Object.keys(local).forEach(function (k) { if (!inflight[k]) send(k, local[k]); });
    } catch (e) {
      col = null;
      noDb();
    }
  }
  try {
    var claude = window.claude;
    if (!claude || typeof claude.use !== 'function') { noDb(); }
    else {
      claude.use('user').then(function (user) {
        if (!user) return;
        return user.can('data.write').then(function (ok) {
          if (ok === false) { readOnly = true; local = {}; if (mode === 'db') notice('db', TEXT.readOnly, 'read-only'); else show(); }
        });
      }).catch(function () { /* no user capability: let a refused write decide */ });
      claude.use('db').then(function (db) { if (db) start(db); else noDb(); }, noDb);
    }
  } catch (e) {
    noDb();
  }
  render();
})();
