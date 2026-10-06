// The in-page half of tools/screens/fit.js and shots.js. fit.js evaluates measure() in the screens page (measuring
// mode, ?only=all) after <html data-ready="1"> and gets back one JSON string. The functions must stay self-contained:
// they are sent to Edge as source text, so they can use nothing from Node.
//
// Per frame (.sc-frame[data-screen][data-state], in source order) it records every [data-node] element and every
// text element: [data-key] (a deck text) and [data-text] (a data text, recorded with the key "(data)"). Lengths are CSS
// px relative to the frame's top-left corner, rounded to 0.01; in measuring mode 1 CSS px = 1 reference px.
//   node: { node, type, variation, key, clip, visible, display, opacity, box, content, scroll: {w, h, cw, ch},
//           overflow: [x, y], parent, clipX, clipY }
//     clip     data-clip: "ellipsis" or "clip" when the node cuts its text on purpose (clip_text, text_overrun_behavior)
//     box      the border box; content: the box minus borders and padding
//     parent   the nearest [data-node] ancestor inside the frame (its data-node), or null
//     clipX/Y  the nearest element between the node and the frame (both excluded) whose overflow in that axis is not
//              visible, as [name, overflow], or null
//   text: { key, host, text, visible, children, box, rects, union, scroll, overflow, textOverflow, clips }
//     host     the nearest [data-node] at or above the element; rects: the client rects of its text (a Range over
//              its contents), union: their bounding box; clips: every element from the text element up to and
//              including the frame whose overflow is not visible: { who, ox, oy, pad (its padding box), own (it is
//              the host or inside it) }
//
// fontState() and frameList() are the small in-page checks shots.js uses; all three are sent as source text:
//   `(${measure})(${JSON.stringify(opts)}, ${fontState})`, `(${frameList})(${fontState})`.
"use strict";

// Comfortaa must be the font the texts were laid out with. document.fonts.check() alone is true when the page has no
// Comfortaa face at all (nothing to load), so the faces are counted too.
function fontState() {
  var shown = "";
  document.querySelectorAll("[data-key], [data-text]").forEach(function (el) {
    if (el.getClientRects().length) shown += el.textContent;
  });
  var faces = [];
  document.fonts.forEach(function (f) {
    if (f.family.replace(/["']/g, "").trim().toLowerCase() === "comfortaa") faces.push(f.status);
  });
  var loaded = faces.filter(function (s) { return s === "loaded"; }).length;
  var check = document.fonts.check("700 32px Comfortaa");
  var checkShown = document.fonts.check("700 32px Comfortaa", shown || " ");
  return { ok: check && checkShown && loaded > 0, check: check, checkShown: checkShown, faces: faces.length,
    loaded: loaded, status: document.fonts.status };
}

// the frames of the page as loaded: what shots.js needs to name and verify its pictures
function frameList(fontState) {
  var html = document.documentElement;
  var frames = [];
  document.querySelectorAll(".sc-frame").forEach(function (fr) {
    var r = fr.getBoundingClientRect();
    var cs = getComputedStyle(fr);
    frames.push({ screen: fr.getAttribute("data-screen"), state: fr.getAttribute("data-state"),
      visible: fr.getClientRects().length > 0 && cs.visibility !== "hidden",
      box: { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height } });
  });
  return JSON.stringify({ lang: html.getAttribute("lang"), dataLang: html.getAttribute("data-lang"),
    size: html.getAttribute("data-text-size"), fonts: fontState(), frames: frames });
}

function measure(opts, fontState) {
  var R = function (n) { return Math.round(n * 100) / 100; };
  var html = document.documentElement;
  var screens = opts && opts.screens && opts.screens.length ? opts.screens : null;
  var res = {
    lang: html.getAttribute("lang"), dataLang: html.getAttribute("data-lang"), size: html.getAttribute("data-text-size"),
    ready: html.getAttribute("data-ready"), viewport: [innerWidth, innerHeight], scroll: [scrollX, scrollY],
    userAgent: navigator.userAgent, fonts: fontState(), frames: [], strays: [],
  };

  function name(el) {
    if (el.hasAttribute("data-node")) return el.getAttribute("data-node");
    if (el.classList && el.classList.contains("sc-frame")) return "the frame";
    var d = el.tagName.toLowerCase();
    if (el.classList && el.classList.length) d += "." + Array.prototype.slice.call(el.classList, 0, 3).join(".");
    return d;
  }
  function visible(el, cs) { return el.getClientRects().length > 0 && cs.visibility !== "hidden"; }

  document.querySelectorAll("[data-node]").forEach(function (el) {
    if (!el.closest(".sc-frame")) res.strays.push(el.getAttribute("data-node"));
  });

  var frames = document.querySelectorAll(".sc-frame");
  for (var fi = 0; fi < frames.length; fi++) {
    var fr = frames[fi];
    var screen = fr.getAttribute("data-screen"), state = fr.getAttribute("data-state");
    if (screens && screens.indexOf(screen) < 0) continue;
    var fcs = getComputedStyle(fr);
    var F = fr.getBoundingClientRect();
    if (!visible(fr, fcs)) { res.frames.push({ index: fi, screen: screen, state: state, hidden: true }); continue; }
    var rel = function (r) { return { x: R(r.left - F.left), y: R(r.top - F.top), w: R(r.width), h: R(r.height) }; };
    var inner = function (el, cs, withPadding) {
      var r = el.getBoundingClientRect();
      var bt = parseFloat(cs.borderTopWidth) || 0, br = parseFloat(cs.borderRightWidth) || 0;
      var bb = parseFloat(cs.borderBottomWidth) || 0, bl = parseFloat(cs.borderLeftWidth) || 0;
      var pt = 0, pr = 0, pb = 0, pl = 0;
      if (withPadding) {
        pt = parseFloat(cs.paddingTop) || 0; pr = parseFloat(cs.paddingRight) || 0;
        pb = parseFloat(cs.paddingBottom) || 0; pl = parseFloat(cs.paddingLeft) || 0;
      }
      return { x: R(r.left - F.left + bl + pl), y: R(r.top - F.top + bt + pt),
        w: R(r.width - bl - br - pl - pr), h: R(r.height - bt - bb - pt - pb) };
    };
    var rec = {
      index: fi, screen: screen, state: state,
      box: { x: R(F.left + scrollX), y: R(F.top + scrollY), w: R(F.width), h: R(F.height) },
      overflow: [fcs.overflowX, fcs.overflowY], nodes: [], texts: [],
    };

    fr.querySelectorAll("[data-node]").forEach(function (el) {
      var cs = getComputedStyle(el);
      var p = el.parentElement ? el.parentElement.closest("[data-node]") : null;
      if (p && !fr.contains(p)) p = null;
      var clipX = null, clipY = null;
      for (var a = el.parentElement; a && a !== fr; a = a.parentElement) {
        var acs = getComputedStyle(a);
        if (!clipX && acs.overflowX !== "visible") clipX = [name(a), acs.overflowX];
        if (!clipY && acs.overflowY !== "visible") clipY = [name(a), acs.overflowY];
      }
      rec.nodes.push({
        node: el.getAttribute("data-node"), type: el.getAttribute("data-type"),
        variation: el.getAttribute("data-variation"), key: el.getAttribute("data-key"), clip: el.getAttribute("data-clip"),
        visible: visible(el, cs), display: cs.display, opacity: Number(cs.opacity),
        box: rel(el.getBoundingClientRect()), content: inner(el, cs, true),
        scroll: { w: el.scrollWidth, h: el.scrollHeight, cw: el.clientWidth, ch: el.clientHeight },
        overflow: [cs.overflowX, cs.overflowY], parent: p ? p.getAttribute("data-node") : null, clipX: clipX, clipY: clipY,
      });
    });

    fr.querySelectorAll("[data-key], [data-text]").forEach(function (el) {
      var cs = getComputedStyle(el);
      var host = el.closest("[data-node]");
      if (host && !fr.contains(host)) host = null;
      var range = document.createRange();
      range.selectNodeContents(el);
      var rects = [];
      var list = range.getClientRects();
      for (var i = 0; i < list.length; i++) if (list[i].width > 0 || list[i].height > 0) rects.push(rel(list[i]));
      var u = null;
      rects.forEach(function (r) {
        if (!u) { u = { x: r.x, y: r.y, r: r.x + r.w, b: r.y + r.h }; return; }
        u.x = Math.min(u.x, r.x); u.y = Math.min(u.y, r.y); u.r = Math.max(u.r, r.x + r.w); u.b = Math.max(u.b, r.y + r.h);
      });
      var clips = [];
      for (var a = el; a; a = a.parentElement) {
        var acs = a === el ? cs : getComputedStyle(a);
        if (acs.overflowX !== "visible" || acs.overflowY !== "visible") {
          clips.push({ who: name(a), ox: acs.overflowX, oy: acs.overflowY, pad: inner(a, acs, false),
            own: !!host && host.contains(a) });
        }
        if (a === fr) break;
      }
      rec.texts.push({
        key: el.getAttribute("data-key") || "(data)", host: host ? host.getAttribute("data-node") : null,
        text: el.textContent, visible: visible(el, cs), children: el.children.length,
        box: rel(el.getBoundingClientRect()), rects: rects,
        union: u ? { x: R(u.x), y: R(u.y), w: R(u.r - u.x), h: R(u.b - u.y) } : null,
        scroll: { w: el.scrollWidth, h: el.scrollHeight, cw: el.clientWidth, ch: el.clientHeight },
        overflow: [cs.overflowX, cs.overflowY], textOverflow: cs.textOverflow, clips: clips,
      });
    });
    res.frames.push(rec);
  }
  return JSON.stringify(res);
}

module.exports = { measure, fontState, frameList };
