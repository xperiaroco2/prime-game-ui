// The screens page's behaviour: the language (with the language chips, selected for the shown language), text-size and
// zoom (fit, 50 %, 100 %; a switch keeps the screen in view) switches, remembered for this viewer when storage works;
// the state tabs; the sticky bar's height for the screen chips' scroll margin; the ScrollContainers' bars; and the fit
// tool's local measuring mode (tools/screens/):
// ?only=<screen>:<state>|all with &lang=uk|en&size=default|large renders those frames alone at zoom 1, then sets
// data-ready="1" on <html>.
(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'prime-screens:';
  function load(k) { try { return window.localStorage.getItem(KEY + k); } catch (e) { return null; } }
  function save(k, v) { try { window.localStorage.setItem(KEY + k, v); } catch (e) { /* storage blocked */ } }
  function all(sel, from) { return Array.prototype.slice.call((from || document).querySelectorAll(sel)); }

  // ScrollContainers, as Godot's update_scrollbars: the VScrollBar shows when the child is taller than the view, and
  // then takes its width from the child (data-vscroll="1", screens-layout.css); the grabber is the visible part
  // (--page) at the scroll position (--value), both fractions of the child's height. data-scroll-v (scroll_vertical,
  // reference px) scrolls the view; wheel and touch scroll it too, and the bar follows.
  function partsOf(sc) {
    var p = { view: null, bar: null };
    for (var i = 0; i < sc.children.length; i++) {
      var c = sc.children[i];
      if (c.classList.contains('gd-scroll-view')) p.view = c;
      else if (c.classList.contains('gd-VScrollBar')) p.bar = c;
    }
    p.content = p.view ? p.view.firstElementChild : null;
    return p;
  }
  function height(el) { return el ? el.getBoundingClientRect().height : 0; }
  function paintBar(p) {
    var ch = height(p.content);
    var vh = height(p.view);
    p.bar.style.setProperty('--value', ch > 0 ? String(p.view.scrollTop / ch) : '0');
    p.bar.style.setProperty('--page', ch > 0 ? String(Math.min(1, vh / ch)) : '1');
  }
  function fitScroll(sc) {
    var p = partsOf(sc);
    if (!p.view || !p.bar || !sc.getClientRects().length) return; // a hidden frame: done when it is shown
    var show = null;
    for (var k = 0; k < 3; k++) {
      var need = !!p.content && height(p.content) > height(p.view) + 0.5;
      if (need === show) break;
      show = need;
      sc.setAttribute('data-vscroll', show ? '1' : '0');
    }
    var frame = sc.closest('.sc-frame');
    var scale = frame ? frame.getBoundingClientRect().width / 1920 : 1;
    var want = Number(sc.getAttribute('data-scroll-v') || 0) * scale;
    p.view.scrollTop = Math.min(want, Math.max(0, height(p.content) - height(p.view)));
    paintBar(p);
  }
  function fitScrolls(from) { all('.gd-ScrollContainer', from).forEach(fitScroll); }
  all('.gd-ScrollContainer').forEach(function (sc) {
    var p = partsOf(sc);
    if (p.view && p.bar) p.view.addEventListener('scroll', function () { paintBar(p); }, { passive: true });
  });
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () { fitScrolls(); barHeight(); }, 100);
  });
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
    // A language chip is selected while its language is the one shown (build.js writes both looks).
    all('[data-lang-chip]').forEach(function (el) {
      el.className = el.getAttribute('data-cls-' + l);
      el.setAttribute('data-variation', el.getAttribute('data-var-' + l));
    });
    root.setAttribute('lang', l);
    root.setAttribute('data-lang', l);
    pressed('lang', l);
    fitScrolls();
  }
  function applyText(t) {
    if (t !== 'large') t = 'default';
    root.setAttribute('data-text-size', t);
    pressed('text', t);
    fitScrolls();
  }
  // The screen at the top of the view (under the sticky bar), so that a zoom switch keeps the reader on it.
  function screenInView() {
    var bar = document.getElementById('pg-bar');
    // A screen scrolled to by its chip sits 12 px under the bar (its scroll-margin-top).
    var edge = bar ? bar.getBoundingClientRect().bottom + 20 : 0;
    var secs = all('.pg-screen');
    var cur = null;
    secs.forEach(function (s) { if (s.getBoundingClientRect().top <= edge) cur = s; });
    return cur;
  }
  function applyZoom(z, keep) {
    if (z !== '100' && z !== '50') z = 'fit';
    var sec = keep ? screenInView() : null;
    root.setAttribute('data-zoom', z);
    pressed('zoom', z);
    fitScrolls();
    if (sec) sec.scrollIntoView({ block: 'start' });
  }
  // The sticky bar wraps on a phone: a screen chip scrolls its screen to just under it (page.css scroll-margin-top).
  function barHeight() {
    var bar = document.getElementById('pg-bar');
    if (bar) root.style.setProperty('--pg-bar-h', bar.offsetHeight + 'px');
  }

  // State tabs: one frame of a screen at a time.
  function show(sec, id) {
    all('.pg-tab', sec).forEach(function (t) { t.setAttribute('aria-selected', String(t.getAttribute('data-tab') === id)); });
    all('.sc-frame', sec).forEach(function (f) { f.hidden = f.getAttribute('data-state') !== id; });
    all('[data-note-for]', sec).forEach(function (n) { n.hidden = n.getAttribute('data-note-for') !== id; });
    fitScrolls(sec);
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
    barHeight();
    var apply = { lang: applyLang, text: applyText, zoom: applyZoom };
    all('[data-ctl]').forEach(function (b) {
      b.addEventListener('click', function () {
        var ctl = b.getAttribute('data-ctl');
        var val = b.getAttribute('data-val');
        apply[ctl](val, true);
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
    fitScrolls();
    if (!only) barHeight();
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
