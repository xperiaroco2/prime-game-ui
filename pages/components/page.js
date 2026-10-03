// The showcase page's behaviour (spec §14.3, §14.5): the control bar, live states that behave like ToyPress, toggles,
// live bars and the live field. Every stored choice goes through try/catch; the page works without storage.
(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'toy-components:';
  var SAMPLES = {};
  try { SAMPLES = JSON.parse(document.getElementById('sc-samples').textContent); } catch (e) { SAMPLES = {}; }

  function load(k) { try { return window.localStorage.getItem(KEY + k); } catch (e) { return null; } }
  function save(k, v) { try { window.localStorage.setItem(KEY + k, v); } catch (e) { /* storage blocked */ } }
  function all(sel, from) { return Array.prototype.slice.call((from || document).querySelectorAll(sel)); }
  function pressed(ctl, val) {
    all('[data-ctl="' + ctl + '"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-val') === val)); });
  }
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  // Controls.
  function applyLang(l) {
    if (l !== 'uk' && l !== 'en') l = 'uk';
    all('[data-s]').forEach(function (el) {
      var s = SAMPLES[el.getAttribute('data-s')];
      if (s && typeof s[l] === 'string') el.textContent = s[l];
    });
    all('[data-s-ph]').forEach(function (el) {
      var s = SAMPLES[el.getAttribute('data-s-ph')];
      if (s && typeof s[l] === 'string') el.setAttribute('placeholder', s[l]);
    });
    pressed('lang', l);
  }
  function applyText(t) {
    if (t !== 'large') t = 'default';
    root.setAttribute('data-text-size', t);
    var note = document.getElementById('sc-large-note');
    if (note) note.hidden = t !== 'large';
    pressed('text', t);
  }
  function applyMotion(m) {
    if (m === 'default' || m === 'reduced') root.setAttribute('data-motion', m);
    else { root.removeAttribute('data-motion'); m = reduceQuery && reduceQuery.matches ? 'reduced' : 'default'; }
    pressed('motion', m);
  }
  function applyZoom(z) {
    var n = Number(z);
    if ([50, 75, 100, 150, 200].indexOf(n) < 0) n = 100;
    root.style.setProperty('--zoom', String(n / 100));
    var note = document.getElementById('sc-zoom-note');
    if (note) note.hidden = n >= 100;
    pressed('zoom', String(n));
  }
  var apply = { lang: applyLang, text: applyText, motion: applyMotion, zoom: applyZoom };
  applyLang(load('lang') || 'uk');
  applyText(load('text') || 'default');
  applyMotion(load('motion'));
  applyZoom(load('zoom') || '100');
  all('[data-ctl]').forEach(function (b) {
    b.addEventListener('click', function () {
      var ctl = b.getAttribute('data-ctl');
      var val = b.getAttribute('data-val');
      apply[ctl](val);
      save(ctl, val);
    });
  });
  if (reduceQuery && reduceQuery.addEventListener) {
    reduceQuery.addEventListener('change', function () { if (!root.hasAttribute('data-motion')) applyMotion(null); });
  }

  var bar = document.getElementById('sc-bar');
  var more = document.getElementById('sc-more');
  if (bar && more) {
    more.addEventListener('click', function () {
      var open = !bar.classList.contains('is-open');
      bar.classList.toggle('is-open', open);
      more.setAttribute('aria-expanded', String(open));
    });
  }
  var section = document.getElementById('sc-section');
  if (section) {
    section.addEventListener('change', function () {
      var target = document.getElementById(section.value);
      if (!target) return;
      var smooth = root.getAttribute('data-motion') !== 'reduced' && !(reduceQuery && reduceQuery.matches && !root.hasAttribute('data-motion'));
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    });
  }

  // Live states: like ToyPress. Hover for mouse and pen only; held between down and up (captured), and while Space or
  // Enter is down; keyboard focus is the element's own :focus-visible.
  all('[data-live]').forEach(function (el) {
    el.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') el.classList.add('is-hover'); });
    el.addEventListener('pointerleave', function () { el.classList.remove('is-hover'); });
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      el.classList.add('is-held');
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* not capturable */ }
    });
    function up(e) {
      el.classList.remove('is-held');
      if (e.pointerType === 'touch') el.classList.remove('is-hover');
    }
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', function () { el.classList.remove('is-held'); });
    el.addEventListener('keydown', function (e) {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) el.classList.add('is-held');
    });
    el.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') el.classList.remove('is-held'); });
    el.addEventListener('blur', function () { el.classList.remove('is-held'); });
  });

  // Toggles swap the variation class, as ToyToggle swaps theme_type_variation; a group keeps exactly one selected.
  function select(el, on) {
    var pair = el.getAttribute('data-toggle').split(' ');
    el.classList.toggle('tv-' + pair[0], !on);
    el.classList.toggle('tv-' + pair[1], on);
    el.setAttribute('aria-pressed', String(on));
    all('[data-note]', el).forEach(function (n) {
      var np = n.getAttribute('data-note').split(' ');
      n.classList.toggle('tv-' + np[0], !on);
      n.classList.toggle('tv-' + np[1], on);
    });
  }
  all('[data-toggle]').forEach(function (el) {
    el.addEventListener('click', function () {
      var group = el.getAttribute('data-group');
      if (group) all('[data-group="' + group + '"]').forEach(function (o) { select(o, o === el); });
      else select(el, el.getAttribute('aria-pressed') !== 'true');
    });
  });

  // Live bars: the value, and for the health bar the stored stop step = floor(hp × steps + 0.5).
  all('[data-bar-input]').forEach(function (input) {
    var cell = input.closest('.sc-cell');
    var target = cell && cell.querySelector('[data-live-bar]');
    var out = cell && cell.querySelector('output');
    if (!target) return;
    var steps = Number(target.getAttribute('data-steps') || 0);
    function update() {
      var v = Number(input.value) / 100;
      target.style.setProperty('--value', String(v));
      var text = v.toFixed(2);
      if (steps) {
        var s = Math.floor(v * steps + 0.5);
        target.setAttribute('data-step', (s < 10 ? '0' : '') + s);
        text = 'hp ' + text + ' · ' + (out.getAttribute('data-step-label') || 'step') + ' ' + s;
      }
      if (out) out.textContent = text;
    }
    input.addEventListener('input', update);
    update();
  });

  // The live field draws its focus StyleBox while the input inside has focus.
  all('[data-live-field]').forEach(function (field) {
    var input = field.querySelector('input');
    if (!input) return;
    input.addEventListener('focus', function () { field.classList.add('is-focus'); });
    input.addEventListener('blur', function () { field.classList.remove('is-focus'); });
  });

  // A no-op touchstart listener so :active and pointer events behave on mobile Safari.
  document.addEventListener('touchstart', function () {}, { passive: true });
})();
