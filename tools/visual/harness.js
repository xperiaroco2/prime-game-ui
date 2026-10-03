/* The zero-change probe's in-page harness (spec §15.5 step 2). tools/visual/probe.js appends it, after
   window.__PROBE_CFG, to each temp copy of pages/styles/styles.html. It runs on load and writes its records as JSON
   into a JSON script element with the id probe-out, which Edge's --dump-dom then prints.

   For each configuration (the page as loaded, then each variant that switches off some injected <style> elements),
   each style and each screen section with states, it clicks every state button of the section and records every
   visible element under the frame. Keys: "<screen>|<state>|f<frame index>/<child-index path>". Records are arrays in
   the order of FIELDS (the picture) and RAW (the declared box, used only to recognise a "(box)" item of the
   intended-changes file).
   Browser script, ES5, no network. */
(function () {
  "use strict";
  var CFG = window.__PROBE_CFG || {};
  var STYLES = CFG.styles || ["toy", "retro", "card"];
  var VARIANTS = CFG.variants || []; // [{name, off: [item ids], styles: [...]}]
  var FIELDS = ["x", "y", "w", "h", "cx", "cy", "cw", "ch", "bg",
    "bw-top", "bw-right", "bw-bottom", "bw-left", "bc-top", "bc-right", "bc-bottom", "bc-left",
    "r-top-left", "r-top-right", "r-bottom-right", "r-bottom-left", "box-shadow", "text-shadow",
    "color", "font-size", "font-weight", "letter-spacing", "line-height", "transform", "opacity"];
  var RAW = ["pad-top", "pad-right", "pad-bottom", "pad-left", "raw-bw-top", "raw-bw-right", "raw-bw-bottom",
    "raw-bw-left", "raw-bs-top", "raw-bs-right", "raw-bs-bottom", "raw-bs-left", "raw-bc-top", "raw-bc-right",
    "raw-bc-bottom", "raw-bc-left"];
  var SIDES = ["top", "right", "bottom", "left"];

  var canvas = document.createElement("canvas");
  canvas.width = 1; canvas.height = 1;
  var g = canvas.getContext("2d", { willReadFrequently: true });
  var colCache = {};
  function round(n) { return Math.round(n * 1000) / 1000; }
  // a colour as "r,g,b,a": rgb()/rgba() are read exactly; any other form (oklab() from color-mix) is drawn on a
  // 1 px canvas and read back, which is what the screen shows
  function col(s) {
    if (!s) return "";
    if (colCache.hasOwnProperty(s)) return colCache[s];
    var out;
    var m = /^rgba?\(([^()]*)\)$/.exec(s);
    var p = m ? m[1].split(/[\s,\/]+/).filter(Boolean).map(Number) : [];
    if (m && (p.length === 3 || p.length === 4) && p.every(isFinite)) {
      if (p.length === 3) p.push(1);
      out = p[0] + "," + p[1] + "," + p[2] + "," + round(p[3]);
    } else {
      g.globalCompositeOperation = "copy";
      g.clearRect(0, 0, 1, 1);
      g.fillStyle = "rgba(0,0,0,0)";
      g.fillStyle = s;
      g.fillRect(0, 0, 1, 1);
      var d = g.getImageData(0, 0, 1, 1).data;
      out = d[0] + "," + d[1] + "," + d[2] + "," + Math.round(d[3] / 255 * 100) / 100;
    }
    colCache[s] = out;
    return out;
  }
  function alpha(c) { return c ? Number(c.split(",")[3]) : 0; }
  function px(s) { var n = parseFloat(s); return isFinite(n) ? round(n) : s; }
  function nums(s) { return String(s).split(/\s+/).map(px); }
  // split at commas outside parentheses
  function topSplit(s) {
    var out = [], depth = 0, cur = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  // box-shadow and text-shadow as [[colour, n, n, n(, n)(, "inset")], ...] or "none"
  function shadow(s) {
    if (!s || s === "none") return "none";
    return topSplit(s).map(function (one) {
      var cm = /([a-z-]+\([^()]*\)|#[0-9a-f]+|transparent|currentcolor)/i.exec(one);
      var c = cm ? col(cm[1]) : "";
      var rest = cm ? one.replace(cm[1], " ") : one;
      var parts = rest.split(/\s+/).filter(Boolean);
      var r = [c];
      parts.forEach(function (t) { r.push(t === "inset" ? "inset" : px(t)); });
      return r;
    });
  }
  function transform(s) {
    if (!s || s === "none") return "none";
    var m = /^([a-z0-9]+)\(([^()]*)\)$/.exec(s);
    return m ? [m[1]].concat(m[2].split(",").map(function (t) { return round(parseFloat(t)); })) : s;
  }
  function lenOr(s) { return /px$/.test(s) ? px(s) : s; }

  function record(el, fr) {
    var cs = getComputedStyle(el);
    var b = el.getBoundingClientRect();
    var rawW = [], pad = [], bs = [], bcRaw = [], visW = [], visC = [];
    SIDES.forEach(function (side) {
      var w = parseFloat(cs.getPropertyValue("border-" + side + "-width")) || 0;
      var st = cs.getPropertyValue("border-" + side + "-style");
      var c = col(cs.getPropertyValue("border-" + side + "-color"));
      rawW.push(round(w)); bs.push(st); bcRaw.push(c);
      pad.push(round(parseFloat(cs.getPropertyValue("padding-" + side)) || 0));
      var vis = w > 0 && st !== "none" && st !== "hidden" && alpha(c) > 0;
      visW.push(vis ? round(w) : 0);
      visC.push(vis ? c : "");
    });
    var x = b.left - fr.left, y = b.top - fr.top;
    var rec = [round(x), round(y), round(b.width), round(b.height),
      round(x + rawW[3] + pad[3]), round(y + rawW[0] + pad[0]),
      round(b.width - rawW[1] - rawW[3] - pad[1] - pad[3]), round(b.height - rawW[0] - rawW[2] - pad[0] - pad[2]),
      col(cs.backgroundColor)]
      .concat(visW, visC)
      .concat(["top-left", "top-right", "bottom-right", "bottom-left"].map(function (k) { return nums(cs.getPropertyValue("border-" + k + "-radius")); }))
      .concat([shadow(cs.boxShadow), shadow(cs.textShadow), col(cs.color), px(cs.fontSize), Number(cs.fontWeight),
        lenOr(cs.letterSpacing), lenOr(cs.lineHeight), transform(cs.transform), Number(cs.opacity)]);
    return { rec: rec, raw: pad.concat(rawW, bs, bcRaw) };
  }
  function describe(el) {
    var d = el.tagName.toLowerCase();
    if (el.classList && el.classList.length) d += "." + Array.prototype.join.call(el.classList, ".");
    ["data-bar", "data-in", "data-on"].forEach(function (a) { if (el.hasAttribute(a)) d += "[" + a + "=" + el.getAttribute(a) + "]"; });
    return d;
  }

  function walk(root, fr, prefix, out, raw, desc, screen) {
    var kids = root.children;
    for (var i = 0; i < kids.length; i++) {
      var el = kids[i];
      var p = prefix === "" ? String(i) : prefix + "." + i;
      var cs = getComputedStyle(el);
      if (el.getClientRects().length > 0 && cs.visibility !== "hidden") {
        var r = record(el, fr);
        out[p] = r.rec; raw[p] = r.raw;
        if (desc && !desc.hasOwnProperty(screen + "/" + p)) desc[screen + "/" + p] = describe(el);
      }
      walk(el, fr, p, out, raw, desc, screen);
    }
  }

  function pass(styles, desc) {
    var res = {}, raws = {};
    styles.forEach(function (st) {
      document.body.setAttribute("data-style", st);
      var recs = res[st] = {}, rawRecs = raws[st] = {};
      document.querySelectorAll("section.screen[data-states]").forEach(function (sec) {
        var screen = sec.id;
        sec.querySelectorAll(".seg [data-s]").forEach(function (btn) {
          btn.click();
          var state = btn.getAttribute("data-s");
          sec.querySelectorAll(".frame").forEach(function (frame, fi) {
            var fr = frame.getBoundingClientRect();
            var out = {}, raw = {};
            var self = record(frame, fr);
            out[""] = self.rec; raw[""] = self.raw;
            walk(frame, fr, "", out, raw, desc, screen + "/f" + fi);
            Object.keys(out).forEach(function (p) {
              var key = screen + "|" + state + "|f" + fi + "/" + p;
              recs[key] = out[p]; rawRecs[key] = raw[p];
            });
          });
        });
        // leave the section in its first state, as on load
        var first = sec.querySelector(".seg [data-s]");
        if (first) first.click();
      });
    });
    return { rec: res, raw: raws };
  }

  function run() {
    var st = document.createElement("style");
    st.textContent = ".frame { width: 1920px !important; }\n.stage { overflow: visible !important; }\n" +
      "*, *::before, *::after { transition: none !important; animation: none !important; }";
    document.head.appendChild(st);
    var desc = {};
    var result = { fields: FIELDS, rawFields: RAW, configs: {}, desc: desc, userAgent: navigator.userAgent };
    var base = pass(STYLES, desc);
    result.configs.base = base;
    VARIANTS.forEach(function (v) {
      var off = [];
      document.querySelectorAll("style[data-probe-item]").forEach(function (el) {
        if (v.off.indexOf(el.getAttribute("data-probe-item")) >= 0) { el.sheet.disabled = true; off.push(el); }
      });
      var r = pass(v.styles, null);
      off.forEach(function (el) { el.sheet.disabled = false; });
      // keep only what differs from the page as loaded: a missing key means "same as base"
      var sparse = { rec: {}, raw: {}, missing: {} };
      v.styles.forEach(function (s) {
        var a = r.rec[s], b = base.rec[s];
        var o = sparse.rec[s] = {}, ro = sparse.raw[s] = {}, mi = sparse.missing[s] = [];
        Object.keys(a).forEach(function (k) {
          if (!b.hasOwnProperty(k) || JSON.stringify(a[k]) !== JSON.stringify(b[k]) ||
              JSON.stringify(r.raw[s][k]) !== JSON.stringify(base.raw[s][k])) { o[k] = a[k]; ro[k] = r.raw[s][k]; }
        });
        Object.keys(b).forEach(function (k) { if (!a.hasOwnProperty(k)) mi.push(k); });
      });
      result.configs[v.name] = sparse;
    });
    document.body.setAttribute("data-style", STYLES[0]);
    var out = document.createElement("script");
    out.type = "application/json";
    out.id = "probe-out";
    out.textContent = JSON.stringify(result).replace(/</g, "\\u003c").replace(/[\u007f-\uffff]/g, function (c) {
      return "\\u" + ("000" + c.charCodeAt(0).toString(16)).slice(-4);
    });
    document.body.appendChild(out);
  }

  if (document.readyState === "complete") run(); else window.addEventListener("load", run);
})();
