// The copy page's behaviour, round 3: per open question, a tap on «Беру цей» saves that option, «Інакше» saves the own
// text, «Зберегти нотатку» saves the note with the answer already given. Saved through the artifact runtime's db
// capability when this view has it: collection "copy", one document per question id,
// { answer: option id | "other" | null, text, note, at } (text: the Ukrainian the option writes, or the own text).
// ASKED (set by build.js) is when round 3 was asked: a document saved before it is an earlier round's answer, shown only as a
// past note. Nothing is written on load; a write happens only on a tap, one at a time per document. A tap made before
// the store answers waits and is written when it arrives; a refused write puts back the last saved answer. Without db
// the page still works, says so and offers a summary to copy.
(function () {
  'use strict';
  var asked = typeof ASKED === 'string' ? Date.parse(ASKED) : NaN;
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
    ok: 'Відповіді зберігаються тут, разом зі сторінкою.',
    readOnly: 'Ця сторінка тут лише для перегляду: відповіді не зберігаються.',
  };
  function all(sel, from) { return Array.prototype.slice.call((from || document).querySelectorAll(sel)); }
  function str(v, max) { return typeof v === 'string' ? v.slice(0, max) : ''; }
  function choices(box) { return all('[data-answer]', box).map(function (b) { return b.getAttribute('data-answer'); }); }
  // A saved document counts for round 3 only when it was saved after ASKED.
  function fresh(s) { if (!s) return false; var t = Date.parse(s.at || ''); return isNaN(asked) || (!isNaN(t) && t >= asked); }

  // Toy buttons sink while held (the generated CSS draws is-held and is-hover).
  all('.cp-act button').forEach(function (el) {
    el.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') el.classList.add('is-hover'); });
    el.addEventListener('pointerleave', function () { el.classList.remove('is-hover', 'is-held'); });
    el.addEventListener('pointerdown', function () { el.classList.add('is-held'); });
    ['pointerup', 'pointercancel'].forEach(function (t) { el.addEventListener(t, function (e) { el.classList.remove('is-held'); if (e.pointerType === 'touch') el.classList.remove('is-hover'); }); });
    el.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) el.classList.add('is-held'); });
    el.addEventListener('keyup', function () { el.classList.remove('is-held'); });
    el.addEventListener('blur', function () { el.classList.remove('is-held'); });
  });
  all('.tv-ToyField').forEach(function (field) {
    var input = field.querySelector('.cp-input');
    if (!input) return;
    input.addEventListener('focus', function () { field.classList.add('is-focus'); });
    input.addEventListener('blur', function () { field.classList.remove('is-focus'); });
  });

  function fmtTime(iso) {
    try { var d = new Date(iso); return isNaN(d.getTime()) ? '' : d.toLocaleString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  }

  function render() {
    var done = 0, lines = [];
    all('[data-key]').forEach(function (box) {
      var key = box.getAttribute('data-key');
      var raw = state[key];
      var s = fresh(raw) ? raw : null;
      var ans = s && choices(box).indexOf(s.answer) >= 0 ? s.answer : null;
      if (ans) done++;
      box.classList.toggle('is-answered', !!ans);
      all('[data-answer]', box).forEach(function (b) {
        var id = b.getAttribute('data-answer');
        var on = id === ans;
        b.setAttribute('aria-pressed', String(on));
        b.classList.toggle('tv-ToyButtonPrimary', on);
        b.classList.toggle('tv-ToyButtonSecondary', !on);
        var label = b.querySelector('span');
        if (label && id !== 'other') label.textContent = on ? '✓ Обрано' : 'Беру цей';
        if (label && id === 'other') label.textContent = on ? '✓ Інакше' : 'Інакше';
      });
      all('[data-opt]', box).forEach(function (o) { o.classList.toggle('is-chosen', o.getAttribute('data-opt') === ans); });
      var t = box.querySelector('[data-text-input]');
      if (t && s && ans === 'other' && document.activeElement !== t && !t.getAttribute('data-dirty')) t.value = s.text || '';
      var n = box.querySelector('[data-note-input]');
      if (n && s && document.activeElement !== n && !n.getAttribute('data-dirty')) n.value = s.note || '';
      var prev = box.querySelector('[data-prev]');
      if (prev) {
        var old = raw && !s && raw.note ? raw.note : '';
        prev.hidden = !old;
        prev.textContent = old ? 'Твоя нотатка з першого кола: «' + old + '»' : '';
      }
      var out = box.querySelector('[data-saved]');
      if (out) {
        var text = ans === 'other' ? 'Відповідь: інакше' + (s.text ? ' — «' + s.text + '»' : '') : ans ? 'Відповідь: ' + ans : (s && s.note ? 'Є нотатка, без відповіді' : 'Ще без відповіді');
        if (s && s.at && mode === 'db') text += ' · ' + fmtTime(s.at);
        if (inflight[key]) text += ' · зберігаю…';
        else if (local[key] && mode === 'wait') text += ' · ще не збережено';
        out.textContent = text;
        out.classList.toggle('is-done', !!ans);
      }
      if (ans || (s && s.note)) lines.push(key + ': ' + (ans === 'other' ? 'інакше' + (s.text ? ' «' + s.text + '»' : '') : ans || '—') + (s && s.note ? ' — ' + s.note : ''));
    });
    var d = document.getElementById('cp-done'); if (d) d.textContent = String(done);
    var box = document.getElementById('cp-summary');
    var area = document.getElementById('cp-summary-text');
    if (box && area) { box.hidden = mode === 'db' || !lines.length; area.value = lines.join('\n'); }
  }

  function notice(kind, text, t) {
    mode = kind;
    tag = t || '';
    var el = document.getElementById('cp-db');
    if (el) { el.setAttribute('data-state', kind); el.textContent = text; }
    all('[data-answer], [data-save]').forEach(function (b) { b.disabled = readOnly; });
    render();
  }
  function noDb() {
    if (mode === 'db') return;
    notice('none', 'Тут відповіді не зберігаються: сторінка відкрита без сховища. Вибір лишиться до перезавантаження; підсумок унизу можна скопіювати в чат.');
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

  all('[data-key]').forEach(function (box) {
    var key = box.getAttribute('data-key');
    var noteOf = function () { var t = box.querySelector('[data-note-input]'); return t ? t.value.trim().slice(0, 2000) : ''; };
    var ownOf = function () { var t = box.querySelector('[data-text-input]'); return t ? t.value.trim().slice(0, 300) : ''; };
    var clean = function () { all('[data-dirty]', box).forEach(function (t) { t.removeAttribute('data-dirty'); }); };
    all('[data-answer]', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var ans = b.getAttribute('data-answer');
        var text = ans === 'other' ? ownOf() : (b.getAttribute('data-text') || '');
        clean();
        write(key, { answer: ans, text: text, note: noteOf(), at: new Date().toISOString() });
      });
    });
    var save = box.querySelector('[data-save]');
    if (save) save.addEventListener('click', function () {
      var cur = fresh(state[key]) ? state[key] : null;
      var ans = cur && choices(box).indexOf(cur.answer) >= 0 ? cur.answer : null;
      var note = noteOf();
      if (!ans && !note && !cur) return;
      var text = ans === 'other' ? ownOf() : (ans ? cur.text || '' : '');
      clean();
      write(key, { answer: ans, text: text, note: note, at: new Date().toISOString() });
    });
    all('[data-note-input], [data-text-input]', box).forEach(function (t) { t.addEventListener('input', function () { t.setAttribute('data-dirty', '1'); }); });
  });

  function start(db) {
    try {
      col = db.collection('copy');
      col.onSnapshot(function (snap) {
        try {
          var next = {};
          (snap && snap.docs || []).forEach(function (d) {
            var v = d && d.exists ? d.data() : null;
            if (!v || typeof v !== 'object') return;
            next[d.id] = { answer: typeof v.answer === 'string' ? v.answer.slice(0, 10) : null, text: str(v.text, 300), note: str(v.note, 2000), at: str(v.at, 40) };
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
  render();
})();
