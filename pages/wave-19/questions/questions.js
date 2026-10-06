// The question page's behaviour (prime-game-ui#19): per question, «Беру цей» saves that option, «Зберегти нотатку»
// saves the note with the answer already given, «Беру всі рекомендовані» saves option a for every question still
// unanswered. Saved through the artifact runtime's db capability when this view has it: collection COLLECTION (set by
// build.js), one document per question id, { answer: "a" | "b" | "c" | null, note, at }. Nothing is written on load; a
// write happens only on a tap, one at a time per document (a tap during a write waits and is written after it). A
// tap made before the store answers waits and is written when it arrives; a refused write puts back the last saved
// answer. Without db the page still works, says so and offers a summary to copy. The pattern of pages/copy/copy.js.
(function () {
  'use strict';
  var NAME = typeof COLLECTION === 'string' ? COLLECTION : 'q19';
  var saved = {};
  var local = {};
  var state = {};
  var col = null;
  var mode = 'wait';
  var tag = '';
  var readOnly = false;
  var inflight = {};
  var queued = {};
  var TEXT = {
    wait: 'Підключаю збереження…',
    ok: 'Відповіді зберігаються тут, разом зі сторінкою.',
    readOnly: 'Ця сторінка тут лише для перегляду: відповіді не зберігаються.',
    none: 'Тут відповіді не зберігаються: сторінку відкрито без сховища. Вибір лишиться до перезавантаження, а підсумок унизу можна скопіювати в чат.',
  };
  function all(sel, from) { return Array.prototype.slice.call((from || document).querySelectorAll(sel)); }
  function str(v, max) { return typeof v === 'string' ? v.slice(0, max) : ''; }
  function choices(box) { return all('[data-answer]', box).map(function (b) { return b.getAttribute('data-answer'); }); }
  function fmtTime(iso) {
    try { var d = new Date(iso); return isNaN(d.getTime()) ? '' : d.toLocaleString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  }
  var boxes = all('[data-q]');

  function render() {
    var done = 0, lines = [];
    boxes.forEach(function (box) {
      var key = box.getAttribute('data-q');
      var s = state[key] || null;
      var ans = s && choices(box).indexOf(s.answer) >= 0 ? s.answer : null;
      if (ans) done++;
      box.classList.toggle('is-answered', !!ans);
      all('[data-answer]', box).forEach(function (b) {
        var on = b.getAttribute('data-answer') === ans;
        b.setAttribute('aria-pressed', String(on));
        b.textContent = on ? '✓ Обрано' : 'Беру цей';
      });
      all('[data-opt]', box).forEach(function (o) { o.classList.toggle('is-chosen', o.getAttribute('data-opt') === ans); });
      var n = box.querySelector('[data-note]');
      if (n && s && document.activeElement !== n && !n.getAttribute('data-dirty')) n.value = s.note || '';
      var out = box.querySelector('[data-saved]');
      if (out) {
        var text = ans ? 'Відповідь: ' + ans : (s && s.note ? 'Є нотатка, без відповіді' : 'Ще без відповіді');
        if (s && s.at && mode === 'db' && !local[key]) text += ' · ' + fmtTime(s.at);
        if (inflight[key]) text += ' · зберігаю…';
        else if (local[key] && mode === 'wait') text += ' · ще не збережено';
        out.textContent = text;
        out.classList.toggle('is-done', !!ans);
      }
      if (ans || (s && s.note)) lines.push(key + ': ' + (ans || '—') + (s && s.note ? ' — ' + s.note : ''));
    });
    var d = document.getElementById('q-done'); if (d) d.textContent = String(done);
    var allBtn = document.getElementById('q-all');
    if (allBtn) allBtn.disabled = readOnly || done === boxes.length;
    var box = document.getElementById('q-summary');
    var area = document.getElementById('q-summary-text');
    if (box && area) { box.hidden = mode === 'db' || !lines.length; area.value = lines.join('\n'); }
  }

  function notice(kind, text, t) {
    mode = kind;
    tag = t || '';
    var el = document.getElementById('q-db');
    if (el) { el.setAttribute('data-state', t || kind); el.textContent = text; }
    all('[data-answer], [data-save], #q-all').forEach(function (b) { b.disabled = readOnly; });
    render();
  }
  function noDb() {
    if (mode === 'db') return;
    notice('none', TEXT.none, 'none');
  }
  function show() {
    state = {};
    Object.keys(saved).forEach(function (k) { state[k] = saved[k]; });
    Object.keys(local).forEach(function (k) { state[k] = local[k]; });
    render();
  }
  function write(key, doc) {
    if (readOnly) return;
    local[key] = doc;
    if (!col) { show(); return; }
    if (inflight[key]) { queued[key] = doc; show(); return; }
    send(key, doc);
  }
  function send(key, doc) {
    inflight[key] = true;
    show();
    var p;
    try { p = col.doc(key).set(doc); } catch (e) { p = Promise.reject(e); }
    p.then(function () {
      inflight[key] = false;
      saved[key] = doc;
      var next = queued[key];
      queued[key] = null;
      if (next) { send(key, next); return; }
      delete local[key];
      if (tag === 'write-error') notice('db', TEXT.ok, 'ok');
      show();
    }, function (e) {
      inflight[key] = false;
      queued[key] = null;
      delete local[key];
      var code = e && e.code;
      if (code === 'invalid_argument' || code === 'not_granted' || code === 'permission_denied') { readOnly = true; notice('db', TEXT.readOnly, 'read-only'); }
      else notice('db', 'Не вдалося зберегти (' + (code || 'помилка') + '). Відповідь не змінилася; спробуй ще раз трохи пізніше.', 'write-error');
      show();
    });
  }
  function noteOf(box) { var t = box.querySelector('[data-note]'); return t ? t.value.trim().slice(0, 2000) : ''; }
  function clean(box) { all('[data-dirty]', box).forEach(function (t) { t.removeAttribute('data-dirty'); }); }

  var allBtn = document.getElementById('q-all');
  if (allBtn) allBtn.addEventListener('click', function () {
    boxes.forEach(function (box) {
      var key = box.getAttribute('data-q');
      var s = state[key];
      if (s && s.answer && choices(box).indexOf(s.answer) >= 0) return;
      if (!box.querySelector('[data-answer="a"]')) return;
      clean(box);
      write(key, { answer: 'a', note: noteOf(box), at: new Date().toISOString() });
    });
  });

  boxes.forEach(function (box) {
    var key = box.getAttribute('data-q');
    all('[data-answer]', box).forEach(function (b) {
      b.addEventListener('click', function () {
        clean(box);
        write(key, { answer: b.getAttribute('data-answer'), note: noteOf(box), at: new Date().toISOString() });
      });
    });
    var save = box.querySelector('[data-save]');
    if (save) save.addEventListener('click', function () {
      var cur = state[key];
      var ans = cur && choices(box).indexOf(cur.answer) >= 0 ? cur.answer : null;
      var note = noteOf(box);
      if (!ans && !note && !cur) return;
      clean(box);
      write(key, { answer: ans, note: note, at: new Date().toISOString() });
    });
    all('[data-note]', box).forEach(function (t) { t.addEventListener('input', function () { t.setAttribute('data-dirty', '1'); }); });
  });

  // A tap on a picture shows it at its own size (up to 900 px wide) in an overlay that scrolls; Close or Esc ends it.
  var zoom = document.getElementById('q-zoom');
  var zoomImg = document.getElementById('q-zoom-img');
  var zoomClose = document.getElementById('q-zoom-close');
  var zoomFrom = null;
  function closeZoom() {
    if (!zoom || zoom.hidden) return;
    zoom.hidden = true;
    document.documentElement.classList.remove('is-zoomed');
    if (zoomFrom) { try { zoomFrom.focus(); } catch (e) { /* gone */ } }
  }
  all('[data-zoom]').forEach(function (b) {
    b.addEventListener('click', function () {
      var img = b.querySelector('img');
      if (!zoom || !zoomImg || !img) return;
      zoomFrom = b;
      zoomImg.src = img.currentSrc || img.src;
      zoomImg.alt = img.alt;
      zoomImg.width = Number(img.getAttribute('width')) || img.naturalWidth || 900;
      zoomImg.height = Number(img.getAttribute('height')) || img.naturalHeight || 300;
      zoom.hidden = false;
      document.documentElement.classList.add('is-zoomed');
      var sc = document.getElementById('q-zoom-scroll');
      if (sc) { sc.scrollLeft = 0; sc.scrollTop = 0; }
      if (zoomClose) zoomClose.focus();
    });
  });
  if (zoomClose) zoomClose.addEventListener('click', closeZoom);
  if (zoom) zoom.addEventListener('click', function (e) { if (e.target === zoom) closeZoom(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeZoom(); });

  var copyBtn = document.getElementById('q-copy');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var area = document.getElementById('q-summary-text');
    if (!area) return;
    var done = function () { copyBtn.textContent = 'Скопійовано'; };
    var fallback = function () { area.focus(); area.select(); copyBtn.textContent = 'Виділено: скопіюй сам'; };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(area.value).then(done, fallback);
      else fallback();
    } catch (e) { fallback(); }
  });

  function start(db) {
    try {
      col = db.collection(NAME);
      col.onSnapshot(function (snap) {
        try {
          var next = {};
          (snap && snap.docs || []).forEach(function (d) {
            var v = d && d.exists ? d.data() : null;
            if (!v || typeof v !== 'object') return;
            next[d.id] = { answer: typeof v.answer === 'string' ? v.answer.slice(0, 10) : null, note: str(v.note, 2000), at: str(v.at, 40) };
          });
          saved = next;
          show();
        } catch (e) { /* a malformed snapshot: keep what is shown */ }
      }, function (e) {
        notice('db', 'Збережені відповіді зараз не оновлюються (' + ((e && e.code) || 'помилка') + '). Перезавантаж сторінку.', 'live-error');
      });
      notice('db', readOnly ? TEXT.readOnly : TEXT.ok, readOnly ? 'read-only' : 'ok');
      if (readOnly) { local = {}; show(); }
      else Object.keys(local).forEach(function (k) { if (!inflight[k]) send(k, local[k]); });
    } catch (e) {
      col = null;
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
          if (ok === false) { readOnly = true; local = {}; if (mode === 'db') notice('db', TEXT.readOnly, 'read-only'); else show(); }
        });
      }).catch(function () { /* no user capability: let a refused write decide */ });
      claude.use('db').then(function (db) { if (db) start(db); else noDb(); }, noDb);
    }
  } catch (e) {
    noDb();
  }
})();
