// The look-choices page's own behaviour. pages/components/page.js (inlined before this) already runs the live states,
// toggles and the sample-language switch. This adds: the per-question "show focus / hover / disabled" switches, the
// «Беру цей» and note buttons, and saving them through the artifact runtime's db capability when this view has it.
// Collection "choices", one document per question id: { option: "a".."d" | "other" | null, note, at } (null: a note
// without a choice). Nothing is written on load; a write happens only on a tap, one at a time per document. A tap made
// before the store answers waits and is written when it arrives; a refused write puts back the last saved answer.
// Without db the page still works and says so.
(function () {
  'use strict';
  var DATA = { questions: [] };
  try { DATA = JSON.parse(document.getElementById('ch-data').textContent); } catch (e) { DATA = { questions: [] }; }
  var OPTIONS = ['a', 'b', 'c', 'd', 'other'];
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
    ok: 'Відповіді зберігаються тут, разом зі сторінкою.',
    readOnly: 'Ця сторінка тут лише для перегляду: відповіді не зберігаються.',
  };
  function all(sel, from) { return Array.prototype.slice.call((from || document).querySelectorAll(sel)); }
  function section(qid) { return document.getElementById(qid); }

  // Forced states: a phone has no hover or keyboard focus, so a switch draws them; page.js clears is-hover after a
  // touch, so a forced hover is put back after it.
  function applyForce(btn) {
    var q = btn.closest('.ch-q');
    var kind = btn.getAttribute('data-force-toggle');
    var on = btn.getAttribute('aria-pressed') === 'true';
    all('[data-force="' + kind + '"]', q).forEach(function (el) { el.classList.toggle('is-' + kind, on); });
  }
  all('[data-force-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true'));
      applyForce(btn);
    });
  });
  all('[data-force="hover"]').forEach(function (el) {
    function back() {
      var q = el.closest('.ch-q');
      var sw = q && q.querySelector('[data-force-toggle="hover"]');
      if (sw && sw.getAttribute('aria-pressed') === 'true') el.classList.add('is-hover');
    }
    ['pointerleave', 'pointerup', 'pointercancel'].forEach(function (t) { el.addEventListener(t, back); });
  });

  function fmtTime(iso) {
    try { var d = new Date(iso); return isNaN(d.getTime()) ? '' : d.toLocaleString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  }
  function titleOf(qid, oid) {
    for (var i = 0; i < DATA.questions.length; i++) {
      var q = DATA.questions[i];
      if (q.id !== qid) continue;
      for (var j = 0; j < q.options.length; j++) if (q.options[j].id === oid) return oid + ' · ' + q.options[j].title;
    }
    return oid === 'other' ? 'інше (у нотатці)' : oid;
  }

  function render() {
    var n = 0;
    var lines = [];
    DATA.questions.forEach(function (q, i) {
      var s = state[q.id];
      var sec = section(q.id);
      if (!sec) return;
      var opt = s && OPTIONS.indexOf(s.option) >= 0 ? s.option : null;
      if (opt) n++;
      all('.ch-opt[data-o]', sec).forEach(function (card) { card.classList.toggle('is-chosen', card.getAttribute('data-o') === opt); });
      var saved = sec.querySelector('[data-saved]');
      if (saved) {
        var text = opt ? 'ваша відповідь: ' + titleOf(q.id, opt) : (s && s.note ? 'є нотатка' : 'ще без відповіді');
        if (s && s.at && mode === 'db') text += ' · ' + fmtTime(s.at);
        if (inflight[q.id]) text += ' · зберігаю…';
        else if (local[q.id] && mode === 'wait') text += ' · ще не збережено';
        saved.textContent = text;
        saved.classList.toggle('is-done', !!opt);
      }
      var input = sec.querySelector('[data-note-input]');
      if (input && s && typeof s.note === 'string' && document.activeElement !== input && !input.getAttribute('data-dirty')) input.value = s.note;
      if (opt || (s && s.note)) lines.push((i + 1) + '. ' + q.title + ': ' + (opt ? titleOf(q.id, opt) : '—') + (s && s.note ? ' — ' + s.note : ''));
    });
    var count = document.getElementById('ch-count');
    if (count) count.textContent = String(n);
    var box = document.getElementById('ch-summary');
    var area = document.getElementById('ch-summary-text');
    if (box && area) {
      box.hidden = mode === 'db' || !lines.length;
      area.value = lines.join('\n');
    }
  }

  function notice(kind, text, t) {
    mode = kind;
    tag = t || '';
    var el = document.getElementById('ch-db');
    if (el) { el.setAttribute('data-state', kind); el.textContent = text; }
    all('.ch-take, [data-save-note], [data-other]').forEach(function (b) { b.disabled = readOnly; });
    render();
  }
  function noDb() {
    if (mode === 'db') return;
    notice('none', 'Тут відповіді не зберігаються: сторінка відкрита без сховища. Вибір лишиться до перезавантаження; підсумок нижче можна скопіювати в чат.');
  }

  function show() {
    state = {};
    Object.keys(saved).forEach(function (k) { state[k] = saved[k]; });
    Object.keys(local).forEach(function (k) { state[k] = local[k]; });
    render();
  }
  // Before the store answers (col is null) a tap waits in local; start() sends it. Without a store it stays there.
  function write(qid, doc) {
    if (readOnly) return;
    local[qid] = doc;
    if (!col) { show(); return; }
    if (inflight[qid]) { queued[qid] = doc; show(); return; }
    send(qid, doc);
  }
  function send(qid, doc) {
    inflight[qid] = true;
    show();
    var p;
    try { p = col.doc(qid).set(doc); } catch (e) { p = Promise.reject(e); }
    p.then(function () {
      inflight[qid] = false;
      saved[qid] = doc;
      var next = queued[qid];
      queued[qid] = null;
      if (next) { send(qid, next); return; }
      delete local[qid];
      if (tag === 'write-error') notice('db', TEXT.ok, 'ok');
      show();
    }, function (e) {
      inflight[qid] = false;
      queued[qid] = null;
      delete local[qid];
      var code = e && e.code;
      if (code === 'invalid_argument') { readOnly = true; notice('db', TEXT.readOnly, 'read-only'); }
      else notice('db', 'Не вдалося зберегти (' + (code || 'помилка') + '). Відповідь не змінилася; спробуйте ще раз трохи пізніше.', 'write-error');
      show();
    });
  }
  function current(qid) { return state[qid] || {}; }
  function noteOf(sec) { var t = sec.querySelector('[data-note-input]'); return t ? t.value.trim().slice(0, 2000) : ''; }

  all('.ch-q').forEach(function (sec) {
    var qid = sec.getAttribute('data-q');
    all('.ch-take', sec).forEach(function (b) {
      b.addEventListener('click', function () {
        write(qid, { option: b.getAttribute('data-take'), note: noteOf(sec), at: new Date().toISOString() });
      });
    });
    var save = sec.querySelector('[data-save-note]');
    if (save) save.addEventListener('click', function () {
      var t = sec.querySelector('[data-note-input]');
      if (t) t.removeAttribute('data-dirty');
      var note = noteOf(sec);
      if (!note && !state[qid]) return;
      write(qid, { option: current(qid).option || null, note: note, at: new Date().toISOString() });
    });
    var other = sec.querySelector('[data-other]');
    if (other) other.addEventListener('click', function () {
      write(qid, { option: 'other', note: noteOf(sec), at: new Date().toISOString() });
    });
    var input = sec.querySelector('[data-note-input]');
    if (input) input.addEventListener('input', function () { input.setAttribute('data-dirty', '1'); });
  });

  // The runtime: window.claude.use("db") resolves the store or null. Absent outside a claude.ai view.
  function start(db) {
    try {
      col = db.collection('choices');
      col.onSnapshot(function (snap) {
        try {
          var next = {};
          snap.docs.forEach(function (d) {
            var v = d.exists ? d.data() : null;
            if (!v || typeof v !== 'object') return;
            next[d.id] = { option: OPTIONS.indexOf(v.option) >= 0 ? v.option : null, note: typeof v.note === 'string' ? v.note : '', at: typeof v.at === 'string' ? v.at : '' };
          });
          saved = next;
          show();
        } catch (e) { /* a malformed snapshot: keep what is shown */ }
      }, function (e) {
        notice('db', 'Збережені відповіді зараз не оновлюються (' + ((e && e.code) || 'помилка') + '). Перезавантажте сторінку.', 'live-error');
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
