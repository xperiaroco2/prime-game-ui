// The screens page's behaviour: the language, text-size and zoom switches (remembered for this viewer when storage
// works), the state tabs, and the fit tool's local measuring mode (tools/screens/): ?only=<screen>:<state>|all with
// &lang=uk|en&size=default|large renders those frames alone at zoom 1, then sets data-ready="1" on <html>.
(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'prime-screens:';
  function load(k) { try { return window.localStorage.getItem(KEY + k); } catch (e) { return null; } }
  function save(k, v) { try { window.localStorage.setItem(KEY + k, v); } catch (e) { /* storage blocked */ } }
  function all(sel, from) { return Array.prototype.slice.call((from || document).querySelectorAll(sel)); }
  function pressed(ctl, val) {
    all('[data-ctl="' + ctl + '"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-val') === val)); });
  }

  // Every text element holds Ukrainian and carries its English in data-en; the first switch keeps the Ukrainian in data-uk.
  function applyLang(l) {
    if (l !== 'en') l = 'uk';
    all('[data-en]').forEach(function (el) {
      if (!el.hasAttribute('data-uk')) el.setAttribute('data-uk', el.textContent);
      el.textContent = el.getAttribute(l === 'en' ? 'data-en' : 'data-uk');
    });
    root.setAttribute('lang', l);
    root.setAttribute('data-lang', l);
    pressed('lang', l);
  }
  function applyText(t) {
    if (t !== 'large') t = 'default';
    root.setAttribute('data-text-size', t);
    pressed('text', t);
  }
  function applyZoom(z) {
    if (z !== '100') z = 'fit';
    root.setAttribute('data-zoom', z);
    pressed('zoom', z);
  }

  // State tabs: one frame of a screen at a time.
  function show(sec, id) {
    all('.pg-tab', sec).forEach(function (t) { t.setAttribute('aria-selected', String(t.getAttribute('data-tab') === id)); });
    all('.sc-frame', sec).forEach(function (f) { f.hidden = f.getAttribute('data-state') !== id; });
    all('[data-note-for]', sec).forEach(function (n) { n.hidden = n.getAttribute('data-note-for') !== id; });
  }
  all('.pg-screen').forEach(function (sec) {
    all('.pg-tab', sec).forEach(function (tab) {
      tab.addEventListener('click', function () { show(sec, tab.getAttribute('data-tab')); });
    });
  });

  // The measuring mode works only on a local copy; the published page shows its normal view.
  var params = null;
  try { params = new URLSearchParams(window.location.search); } catch (e) { params = null; }
  var host = window.location.hostname;
  var local = window.location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1';
  var only = local && params ? params.get('only') : null;
  if (only) {
    root.setAttribute('data-measure', '1');
    var box = document.createElement('div');
    box.id = 'pg-measure';
    all('.sc-frame').forEach(function (f) {
      if (only === 'all' || f.getAttribute('data-screen') + ':' + f.getAttribute('data-state') === only) {
        f.hidden = false;
        box.appendChild(f);
      }
    });
    document.body.insertBefore(box, document.body.firstChild);
    applyLang(params.get('lang') === 'en' ? 'en' : 'uk');
    applyText(params.get('size') === 'large' ? 'large' : 'default');
  } else {
    applyLang(load('lang') || 'uk');
    applyText(load('text') || 'default');
    applyZoom(load('zoom') || 'fit');
    var apply = { lang: applyLang, text: applyText, zoom: applyZoom };
    all('[data-ctl]').forEach(function (b) {
      b.addEventListener('click', function () {
        var ctl = b.getAttribute('data-ctl');
        var val = b.getAttribute('data-val');
        apply[ctl](val);
        save(ctl, val);
      });
    });
  }

  // Ready: the fonts have loaded (data-fonts="loaded"), or after 8 s without them (data-fonts="timeout", so a measurer
  // can tell); reading offsetHeight forces the layout first. No requestAnimationFrame: headless pages may draw no frames.
  var done = false;
  function ready(how) {
    if (done) return;
    done = true;
    root.setAttribute('data-fonts', how);
    void root.offsetHeight;
    root.setAttribute('data-ready', '1');
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ready('loaded'); }, function () { ready('failed'); });
    window.setTimeout(function () { ready('timeout'); }, 8000);
  } else {
    ready('unsupported');
  }
})();
