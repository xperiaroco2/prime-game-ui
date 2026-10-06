// The fit check of the styled screens (wave prime-game-ui#19): does every text fit, does every node stay in its frame,
// do the children of box and grid containers stay apart? Local Windows + Microsoft Edge only, not CI (tools/check.js
// does not run it).
//
//   node tools/screens/fit.js [--screens s2,s5] [--lang uk|en] [--size default|large] [--json <file>]
//                             [--page <file>] [--timeout <s>] [--keep] [--self-test]
//     --screens   only these screens (data-screen; s02 and s2 are the same); default: every frame of the page
//     --lang      one language; default: uk and en
//     --size      one text size; default: default and large
//     --json      write the full records (every node, every text with its client rects) and the problems to <file>
//     --page      measure another page that follows the contract (default: pages/screens/screens.html)
//     --timeout   seconds to wait for <html data-ready="1"> per page load (default 60)
//     --keep      keep Edge's temp folder (profile, stderr)
//     --self-test the checks on synthetic records, then the fixture tools/screens/fixtures/screens-fixture.html: its
//                 broken frame must show every problem kind, its clean frame none, and a page without Comfortaa
//                 must stop the run
//
// How: one headless Edge (tools/screens/edge.js: PowerShell Start-Process -Wait, a fresh profile, every host but
// Google Fonts unresolvable, DevTools Protocol) loads the page's measuring mode once per language and size,
// screens.html?only=all&lang=..&size=.. (1 reference px = 1 CSS px, frames stacked at multiples of 1080 px), waits for
// <html data-ready="1">, checks that Comfortaa is loaded (if not, the run stops: fallback metrics would make every
// number wrong) and runs tools/screens/measure.js in the page. The problems, per screen, state, language and size
// (lengths in reference px; a problem needs more than 1 px for a text, 0.5 px for a box; a text is a data-key element,
// a deck text, or a data-text element, a data text such as a name, reported as [(data)]):
//   text-overflow   a data-key text is wider or taller than its node's content box (the node: the nearest data-node
//                   at or above the text; in Godot the control would grow)
//   text-clipped    a data-key text is cut by an ancestor whose overflow is hidden or clip, up to and including the
//                   frame (a scroll container's overflow in its scroll axis is not a cut)
//   outside-frame   a visible node runs past its 1920x1080 frame, unless an ancestor below the frame clips or
//                   scrolls in that axis (only the outermost such node is reported)
//   overlap         two visible children of a Box, HBox, VBox, Grid or Flow container overlap, or two drawn siblings
//                   placed by anchors (under the frame, a Control, a Panel or a Button) partly overlap (one fully over
//                   the other is a layer, fine; OVERLAY_OK lists intended partial overlays)
//   outside-parent  a visible child runs past its parent container (any *Container but Container and
//                   ScrollContainer; Godot containers always hold their children); a PanelContainer's or
//                   MarginContainer's child, past its content rect (inside the StyleBox's content margins)
//   empty-text      a data-key element has no text (hidden or not)
//   key-shown       a data-key element shows its own key (the deck has no text for it)
//   contract        the page breaks the screens page contract (frame size or place, lang attributes, a node without
//                   data-type or outside every frame, a duplicate node, an element inside a data-key element, ...)
// Output: one table row per frame with the problem count per language/size ("." = none), then each problem once with
// the runs it occurs in and its worst case. Exit 0 when clean, 1 on any problem, 2 when it could not measure (no Edge,
// no page, no frames, Comfortaa not loaded, the page never ready).
// Node's own modules only.
"use strict";
const fs = require("fs");
const path = require("path");
const { launch, haveEdge, W, H } = require("./edge.js");
const { measure, fontState } = require("./measure.js");
const C = require("./common.js");

const USAGE = "usage: node tools/screens/fit.js [--screens s2,s5] [--lang uk|en] [--size default|large] [--json <file>] " +
  "[--page <file>] [--timeout <s>] [--keep] [--self-test]";
const TOL = 0.5; // boxes
const TTOL = 1; // texts: font rounding
const BOX_TYPES = new Set(["BoxContainer", "HBoxContainer", "VBoxContainer", "GridContainer", "FlowContainer",
  "HFlowContainer", "VFlowContainer"]);
const KINDS = ["text-overflow", "text-clipped", "outside-frame", "overlap", "outside-parent", "empty-text", "key-shown", "contract"];
const r1 = (n) => Math.round(n * 10) / 10;

// ---- the checks: pure functions of one run's records ----------------------------------------------------------

// how far `inner` runs past `outer` on each side (positive = past)
function past(inner, outer) {
  return {
    left: outer.x - inner.x, right: inner.x + inner.w - (outer.x + outer.w),
    top: outer.y - inner.y, bottom: inner.y + inner.h - (outer.y + outer.h),
  };
}
function sides(p, tol, axes) {
  const out = [];
  for (const s of ["left", "right", "top", "bottom"]) {
    if (axes && !axes[s === "left" || s === "right" ? "x" : "y"]) continue;
    if (p[s] > tol) out.push(s + " +" + r1(p[s]));
  }
  return out;
}
const worst = (p, axes) => Math.max(0, ...["left", "right", "top", "bottom"]
  .filter((s) => !axes || axes[s === "left" || s === "right" ? "x" : "y"]).map((s) => p[s]));
const scrolls = (o) => o === "auto" || o === "scroll";
const clipsAxis = (o) => o !== "visible";
const isContainer = (t) => /Container$/.test(t || "") && t !== "Container" && t !== "ScrollContainer";
// A PanelContainer or MarginContainer fits its children into its content rect (inside the StyleBox's content margins).
const FITS_CONTENT = new Set(["PanelContainer", "MarginContainer"]);
// The classes that draw something (a spacing container's variation draws nothing).
const DRAWN = new Set(["Panel", "PanelContainer", "Label", "Button", "OptionButton", "LineEdit", "ProgressBar", "TextureRect",
  "HSlider", "VScrollBar"]);
// Parents whose children place themselves by anchors and so may land on each other.
const ANCHORING = new Set(["Control", "Panel", "Button"]);
// Anchored siblings meant to overlap partly (a layer over another): [screen-relative path pattern, other pattern].
const OVERLAY_OK = [];
const contains = (a, b) => b.x >= a.x - TOL && b.y >= a.y - TOL && b.x + b.w <= a.x + a.w + TOL && b.y + b.h <= a.y + a.h + TOL;

// run: { lang, size, data } where data is measure()'s result; returns the problems
function check(run, opt) {
  opt = opt || {};
  const out = [];
  const add = (fr, kind, subject, detail, amount, extra) => out.push(Object.assign({
    frame: fr ? fr.screen + ":" + fr.state : "-", screen: fr ? fr.screen : null, state: fr ? fr.state : null,
    lang: run.lang, size: run.size, kind, subject, detail, amount: r1(amount || 0) }, extra || {}));
  const d = run.data;
  if (d.lang !== run.lang || d.dataLang !== run.lang) add(null, "contract", "<html>", `lang="${d.lang}" data-lang="${d.dataLang}", asked for ${run.lang}`);
  if (d.size !== run.size) add(null, "contract", "<html>", `data-text-size="${d.size}", asked for ${run.size}`);
  for (const s of d.strays || []) add(null, "contract", s, "a data-node outside every .sc-frame");

  let lastY = -Infinity;
  for (const fr of d.frames) {
    if (!fr.screen || !fr.state) add(fr, "contract", "frame #" + fr.index, "a .sc-frame without data-screen or data-state");
    if (fr.hidden) { add(fr, "contract", "frame", "the frame is not shown in ?only=all"); continue; }
    const b = fr.box;
    if (Math.abs(b.w - W) > TOL || Math.abs(b.h - H) > TOL) add(fr, "contract", "frame", `the frame is ${r1(b.w)}x${r1(b.h)}, not ${W}x${H}`);
    if (opt.stacked !== false) {
      const m = b.y / H;
      if (Math.abs(b.x) > TOL || Math.abs(m - Math.round(m)) * H > TOL || b.y <= lastY) {
        add(fr, "contract", "frame", `in ?only=all the frame's top-left is ${r1(b.x)},${r1(b.y)}: not x 0 and the next multiple of ${H}`);
      }
      lastY = b.y;
    }
    if (!clipsAxis(fr.overflow[0]) || !clipsAxis(fr.overflow[1])) add(fr, "contract", "frame", `the frame does not clip (overflow ${fr.overflow.join("/")})`);

    const byName = new Map();
    const seen = new Set();
    for (const n of fr.nodes) {
      if (seen.has(n.node)) add(fr, "contract", n.node, "the same data-node twice in the frame");
      seen.add(n.node);
      if (!byName.has(n.node)) byName.set(n.node, n);
      if (!n.type) add(fr, "contract", n.node, "a node without data-type");
      if (!String(n.node).startsWith(fr.screen + "/")) add(fr, "contract", n.node, `the data-node does not start with "${fr.screen}/"`);
    }

    // texts
    for (const t of fr.texts) {
      const subj = (t.host || "?") + " [" + t.key + "]";
      const txt = (t.text || "").trim();
      if (t.children > 0) add(fr, "contract", subj, `the data-key element holds ${t.children} element(s); it must hold only its text`);
      if (!t.host) add(fr, "contract", subj, "a data-key element outside every data-node");
      if (!txt) { add(fr, "empty-text", subj, t.visible ? "no text" : "no text (the element is hidden)", 0, { node: t.host, key: t.key }); continue; }
      if (txt === t.key) add(fr, "key-shown", subj, "shows its key: the deck has no text for it", 0, { node: t.host, key: t.key });
      if (!t.visible || !t.union) continue;
      const u = t.union;
      const host = t.host ? byName.get(t.host) : null;
      let over = false;
      if (host) {
        const p = past(u, host.content);
        const s = sides(p, TTOL);
        if (s.length) {
          over = true;
          const selfCut = clipsAxis(host.overflow[0]) || clipsAxis(host.overflow[1]) || clipsAxis(t.overflow[0]) || clipsAxis(t.overflow[1]);
          add(fr, "text-overflow", subj, `text ${r1(u.w)}x${r1(u.h)} in content box ${r1(host.content.w)}x${r1(host.content.h)}: ` +
            s.join(", ") + (host.clip ? ` (clip_text: Godot cuts it${host.clip === "ellipsis" ? " with an ellipsis" : ""}; size the node so a realistic value fits)` : selfCut ? " (cut by the node itself)" : ""), worst(p), { node: t.host, key: t.key });
        }
      }
      // the clipping ancestors, from the text element up to the frame; an axis stops at its first scroll or cut
      const done = { x: false, y: false };
      for (const c of t.clips) {
        const axes = { x: false, y: false };
        for (const ax of ["x", "y"]) {
          const o = ax === "x" ? c.ox : c.oy;
          if (done[ax] || !clipsAxis(o)) continue;
          if (scrolls(o)) { done[ax] = true; continue; }
          axes[ax] = true;
        }
        if (!axes.x && !axes.y) continue;
        const p = past(u, c.pad);
        const s = sides(p, TTOL, axes);
        if (!s.length) continue;
        if (s.some((x) => /^(left|right)/.test(x))) done.x = true;
        if (s.some((x) => /^(top|bottom)/.test(x))) done.y = true;
        if (over && c.own) continue; // the host or an element inside it: already said as text-overflow
        add(fr, "text-clipped", subj, `cut by ${c.who} (overflow ${c.ox}/${c.oy}): ` + s.join(", "), worst(p, axes), { node: t.host, key: t.key, by: c.who });
      }
      // a cut the rects cannot show (an ellipsis): the text element's own scroll size
      if (!over && !done.x && clipsAxis(t.overflow[0]) && !scrolls(t.overflow[0]) && t.scroll.w > t.scroll.cw + TTOL && t.scroll.cw > 0) {
        add(fr, "text-clipped", subj, `cut by its own element (scroll width ${t.scroll.w} > ${t.scroll.cw}${t.textOverflow === "ellipsis" ? ", ellipsis" : ""})`,
          t.scroll.w - t.scroll.cw, { node: t.host, key: t.key, by: "self" });
      }
    }

    // nodes: outside the frame, outside the parent container
    const frameBox = { x: 0, y: 0, w: W, h: H };
    const outside = new Set();
    for (const n of fr.nodes) {
      if (!n.visible) continue;
      const axes = { x: !n.clipX, y: !n.clipY };
      const p = past(n.box, frameBox);
      const s = sides(p, TOL, axes);
      if (s.length) {
        outside.add(n.node);
        if (!(n.parent && outside.has(n.parent))) {
          add(fr, "outside-frame", n.node, `box ${r1(n.box.x)},${r1(n.box.y)} ${r1(n.box.w)}x${r1(n.box.h)}: ` + s.join(", "), worst(p, axes), { node: n.node });
        }
      }
      const par = n.parent ? byName.get(n.parent) : null;
      if (par && par.visible && isContainer(par.type)) {
        const inner = FITS_CONTENT.has(par.type) && par.content ? par.content : par.box;
        const pp = past(n.box, inner);
        const ps = sides(pp, TOL);
        if (ps.length) add(fr, "outside-parent", n.node, `past ${par.node} (${par.type}${inner === par.box ? "" : ", its content rect"}): ` + ps.join(", "), worst(pp), { node: n.node });
      }
    }

    // anchored siblings that draw (under a root, a Control, a Panel or a Button) and partly overlap: a layer fully over
    // another (a dialog over its dim) is fine, and so are the pairs listed in OVERLAY_OK
    const groups = new Map();
    for (const n of fr.nodes) {
      if (!n.visible || !DRAWN.has(n.type) || !(n.box.w > 0 && n.box.h > 0)) continue;
      const par = n.parent ? byName.get(n.parent) : null;
      if (par && !ANCHORING.has(par.type)) continue;
      const k = n.parent || "";
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(n);
    }
    const rel = (x) => x.slice(fr.screen.length + 1);
    for (const kids of groups.values()) {
      for (let i = 0; i < kids.length; i++) {
        for (let j = i + 1; j < kids.length; j++) {
          const a = kids[i].box, b = kids[j].box;
          const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (!(ix > TOL && iy > TOL) || contains(a, b) || contains(b, a)) continue;
          const p = rel(kids[i].node), q = rel(kids[j].node);
          if (OVERLAY_OK.some(([x, y]) => (x.test(p) && y.test(q)) || (x.test(q) && y.test(p)))) continue;
          add(fr, "overlap", kids[i].node + " & " + kids[j].node, `${r1(ix)}x${r1(iy)}, anchored siblings`, Math.min(ix, iy), { node: kids[i].node, other: kids[j].node });
        }
      }
    }

    // overlapping children of box, grid and flow containers
    for (const c of fr.nodes) {
      if (!c.visible || !BOX_TYPES.has(c.type)) continue;
      const kids = fr.nodes.filter((n) => n.parent === c.node && n.visible && n.box.w > 0 && n.box.h > 0);
      for (let i = 0; i < kids.length; i++) {
        for (let j = i + 1; j < kids.length; j++) {
          const a = kids[i].box, b = kids[j].box;
          const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (ix > TOL && iy > TOL) {
            add(fr, "overlap", kids[i].node + " & " + kids[j].node, `${r1(ix)}x${r1(iy)} in ${c.node} (${c.type})`, Math.min(ix, iy), { node: kids[i].node, other: kids[j].node });
          }
        }
      }
    }
  }
  return out;
}

// ---- measuring ---------------------------------------------------------------------------------------------------

async function measureRun(edge, page, lang, size, o, extraQuery) {
  const href = C.pageUrl(page, Object.assign({ only: "all", lang, size }, extraQuery || {}));
  const seconds = await edge.page.open(href, o.timeout);
  const data = JSON.parse(await edge.page.eval(`(${measure})(${JSON.stringify({ screens: o.screens })}, ${fontState})`));
  const err = C.fontVerdict(data.fonts, lang + "/" + size, edge.page.failed);
  if (err) throw err;
  return { lang, size, href, seconds, failedRequests: edge.page.failed.slice(), pageErrors: edge.page.errors.slice(), data };
}

async function measureAll(edge, page, o) {
  const runs = [];
  for (const lang of o.langs) for (const size of o.sizes) runs.push(await measureRun(edge, page, lang, size, o));
  return runs;
}

// ---- the report ----------------------------------------------------------------------------------------------

const runName = (r) => r.lang + "/" + r.size;

function report(runs, problems, page, seconds) {
  const lines = [];
  const frames = [];
  for (const r of runs) for (const f of r.data.frames) {
    const id = f.screen + ":" + f.state;
    if (!frames.find((x) => x.id === id)) frames.push({ id, nodes: (f.nodes || []).length, texts: (f.texts || []).length });
  }
  lines.push(`fit: ${C.rel(page)}, ${frames.length} frame(s) x ${runs.length} run(s) (${runs.map(runName).join(", ")}), ${seconds.toFixed(1)} s`);
  for (const r of runs) {
    if (r.failedRequests.length) lines.push(`  ${runName(r)}: failed requests: ${r.failedRequests.slice(0, 5).join("; ")}`);
    if (r.pageErrors.length) lines.push(`  ${runName(r)}: page errors: ${r.pageErrors.slice(0, 3).join(" | ")}`);
  }
  const head = ["frame", ...runs.map(runName), "nodes", "texts"];
  const rows = [];
  const pre = problems.filter((p) => p.frame === "-");
  if (pre.length) rows.push(["(page)", ...runs.map((r) => String(pre.filter((p) => p.lang === r.lang && p.size === r.size).length || ".")), "", ""]);
  for (const f of frames) {
    rows.push([f.id, ...runs.map((r) => {
      const n = problems.filter((p) => p.frame === f.id && p.lang === r.lang && p.size === r.size).length;
      return n ? String(n) : ".";
    }), String(f.nodes), String(f.texts)]);
  }
  const wid = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const fmt = (r) => r.map((c, i) => (i === 0 ? c.padEnd(wid[i]) : c.padStart(wid[i]))).join("  ");
  lines.push("", fmt(head), ...rows.map(fmt));

  const kinds = {};
  for (const p of problems) kinds[p.kind] = (kinds[p.kind] || 0) + 1;
  lines.push("", problems.length ? `problems: ${problems.length} (` + KINDS.filter((k) => kinds[k]).map((k) => `${k} ${kinds[k]}`).join(", ") + ")" : "problems: none");
  // each problem once: frame, kind, subject; the runs it occurs in and its worst case
  const groups = new Map();
  for (const p of problems) {
    const k = p.frame + "\u0000" + p.kind + "\u0000" + p.subject;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(p);
  }
  for (const list of groups.values()) {
    const w = list.slice().sort((a, b) => b.amount - a.amount)[0];
    const where = list.length === runs.length && runs.length > 1 ? "all runs" : list.map(runName).join(", ");
    const varies = list.some((p) => p.amount !== w.amount);
    lines.push(`  ${w.frame}  ${w.kind}  ${w.subject}  [${where}]  ${w.detail}${varies ? " (worst: " + runName(w) + ")" : ""}`);
  }
  return lines.join("\n");
}

// ---- the self-test -------------------------------------------------------------------------------------------

function synthetic() {
  // one frame of records, built by hand
  const node = (name, type, box, extra) => Object.assign({ node: name, type, variation: null, key: null, visible: true,
    display: "block", opacity: 1, box, content: box, scroll: { w: box.w, h: box.h, cw: box.w, ch: box.h },
    overflow: ["visible", "visible"], parent: null, clipX: null, clipY: null }, extra || {});
  const text = (key, host, union, extra) => Object.assign({ key, host, text: "Text", visible: true, children: 0, box: union,
    rects: [union], union, scroll: { w: 0, h: 0, cw: 0, ch: 0 }, overflow: ["visible", "visible"], textOverflow: "clip",
    clips: [{ who: "s9:x", ox: "hidden", oy: "hidden", pad: { x: 0, y: 0, w: W, h: H } }] }, extra || {});
  const frame = (nodes, texts, extra) => Object.assign({ index: 0, screen: "s9", state: "x", box: { x: 0, y: 0, w: W, h: H },
    overflow: ["hidden", "hidden"], nodes, texts }, extra || {});
  const run = (frames, extra) => ({ lang: "uk", size: "default", data: Object.assign({ lang: "uk", dataLang: "uk", size: "default", frames, strays: [] }, extra || {}) });
  const kinds = (ps) => ps.map((p) => p.kind + ":" + p.subject).sort();
  const cases = [];
  const t = (name, got, want) => cases.push({ name, ok: JSON.stringify(got) === JSON.stringify(want), got, want });

  t("a clean frame has no problems", kinds(check(run([frame([node("s9/a", "Label", { x: 10, y: 10, w: 100, h: 40 })],
    [text("k.a", "s9/a", { x: 10, y: 12, w: 99.5, h: 36 })])]))), []);
  t("a text 1 px past its content box is font rounding, 1.5 px is a problem", kinds(check(run([frame(
    [node("s9/a", "Label", { x: 0, y: 0, w: 100, h: 40 }), node("s9/b", "Label", { x: 0, y: 50, w: 100, h: 40 })],
    [text("k.a", "s9/a", { x: 0, y: 0, w: 101, h: 40 }), text("k.b", "s9/b", { x: 0, y: 50, w: 101.5, h: 40 })])]))),
  ["text-overflow:s9/b [k.b]"]);
  t("children of a VBox overlapping by 0.4 px pass, by 0.6 px fail", kinds(check(run([frame([
    node("s9/v", "VBoxContainer", { x: 0, y: 0, w: 100, h: 300 }),
    node("s9/v/a", "Panel", { x: 0, y: 0, w: 100, h: 100 }, { parent: "s9/v" }),
    node("s9/v/b", "Panel", { x: 0, y: 99.6, w: 100, h: 100 }, { parent: "s9/v" }),
    node("s9/v/c", "Panel", { x: 0, y: 199, w: 100, h: 100 }, { parent: "s9/v" })], [])]))),
  ["overlap:s9/v/b & s9/v/c"]);
  t("anchored siblings: a layer fully over another passes, a partial overlap of drawn nodes fails", kinds(check(run([frame([
    node("s9/c", "Control", { x: 0, y: 0, w: 100, h: 300 }),
    node("s9/c/a", "Panel", { x: 0, y: 0, w: 100, h: 100 }, { parent: "s9/c" }),
    node("s9/c/b", "Panel", { x: 0, y: 50, w: 100, h: 100 }, { parent: "s9/c" }),
    node("s9/c/d", "Label", { x: 10, y: 10, w: 20, h: 20 }, { parent: "s9/c" }),
    node("s9/c/e", "Control", { x: 0, y: 40, w: 100, h: 100 }, { parent: "s9/c" })], [])]))), ["overlap:s9/c/a & s9/c/b"]);
  t("only the outermost node past the frame is reported; a scroll container excuses its axis", kinds(check(run([frame([
    node("s9/p", "Panel", { x: 1800, y: 0, w: 200, h: 100 }),
    node("s9/p/c", "Label", { x: 1850, y: 0, w: 100, h: 100 }, { parent: "s9/p" }),
    node("s9/s", "ScrollContainer", { x: 0, y: 900, w: 300, h: 100 }, { overflow: ["hidden", "auto"] }),
    node("s9/s/list", "VBoxContainer", { x: 0, y: 900, w: 300, h: 400 }, { parent: "s9/s", clipX: ["s9/s", "hidden"], clipY: ["s9/s", "auto"] })], [])]))),
  ["outside-frame:s9/p"]);
  t("a text scrolled out of a scroll container is not cut; the same text under overflow hidden is", kinds(check(run([frame(
    [node("s9/s", "ScrollContainer", { x: 0, y: 0, w: 300, h: 100 }), node("s9/s/l", "Label", { x: 0, y: 150, w: 300, h: 40 }, { parent: "s9/s" }),
      node("s9/h", "Panel", { x: 400, y: 0, w: 300, h: 100 }), node("s9/h/l", "Label", { x: 400, y: 150, w: 300, h: 40 }, { parent: "s9/h" })],
    [text("k.s", "s9/s/l", { x: 0, y: 150, w: 200, h: 40 }, { clips: [{ who: "s9/s", ox: "hidden", oy: "auto", pad: { x: 0, y: 0, w: 300, h: 100 } },
      { who: "div.sc-frame", ox: "hidden", oy: "hidden", pad: { x: 0, y: 0, w: W, h: H } }] }),
    text("k.h", "s9/h/l", { x: 400, y: 150, w: 200, h: 40 }, { clips: [{ who: "s9/h", ox: "hidden", oy: "hidden", pad: { x: 400, y: 0, w: 300, h: 100 } },
      { who: "div.sc-frame", ox: "hidden", oy: "hidden", pad: { x: 0, y: 0, w: W, h: H } }] })])]))),
  ["text-clipped:s9/h/l [k.h]"]);
  t("a child past its container is reported; past a ScrollContainer or a Control it is not", kinds(check(run([frame([
    node("s9/m", "MarginContainer", { x: 0, y: 0, w: 100, h: 100 }),
    node("s9/m/a", "Panel", { x: 0, y: 0, w: 140, h: 100 }, { parent: "s9/m" }),
    node("s9/s", "ScrollContainer", { x: 200, y: 0, w: 100, h: 100 }),
    node("s9/s/a", "Panel", { x: 200, y: 0, w: 100, h: 400 }, { parent: "s9/s", clipY: ["s9/s", "auto"] }),
    node("s9/c", "Control", { x: 400, y: 0, w: 100, h: 100 }),
    node("s9/c/a", "Panel", { x: 400, y: 0, w: 300, h: 100 }, { parent: "s9/c" })], [])]))),
  ["outside-parent:s9/m/a"]);
  t("empty text, a shown key and an element inside a data-key element", kinds(check(run([frame([node("s9/a", "Label", { x: 0, y: 0, w: 300, h: 40 })], [
    text("k.e", "s9/a", null, { text: " ", visible: false }), text("k.k", "s9/a", { x: 0, y: 0, w: 50, h: 40 }, { text: "k.k" }),
    text("k.c", "s9/a", { x: 0, y: 0, w: 50, h: 40 }, { children: 1 })])]))),
  ["contract:s9/a [k.c]", "empty-text:s9/a [k.e]", "key-shown:s9/a [k.k]"]);
  t("contract: frame size and place, lang, node names, data-type, duplicates, strays", kinds(check(run([
    frame([node("s9/a", "", { x: 0, y: 0, w: 10, h: 10 }), node("s8/b", "Label", { x: 0, y: 0, w: 10, h: 10 }),
      node("s9/a", "Label", { x: 20, y: 0, w: 10, h: 10 })], [], { box: { x: 0, y: 0, w: 1900, h: H } }),
    frame([], [], { index: 1, state: "y", box: { x: 0, y: 1000, w: W, h: H }, overflow: ["visible", "visible"] })],
  { lang: "en", strays: ["s7/z"] }))), ["contract:<html>", "contract:frame", "contract:frame", "contract:frame",
    "contract:s7/z", "contract:s8/b", "contract:s9/a", "contract:s9/a"]);
  return cases;
}

// what the fixture's broken frame must show in every run (kind and subject), and its clean frame never
const FIXTURE_EXPECT = [
  "empty-text:s1/empty [fixture.empty]", "key-shown:s1/missing [fixture.missing]", "outside-frame:s1/badge",
  "outside-parent:s1/col/wide", "overlap:s1/row/a & s1/row/b", "text-clipped:s1/clip/label [fixture.clip]",
  "text-overflow:s1/play [fixture.play]",
];

async function selfTest(o) {
  let failed = 0;
  const say = (ok, name, more) => { if (!ok) failed++; console.log((ok ? "ok   " : "FAIL ") + name + (ok || !more ? "" : "\n     " + more)); };
  for (const c of synthetic()) say(c.ok, "checks: " + c.name, "got " + JSON.stringify(c.got) + ", want " + JSON.stringify(c.want));

  if (!haveEdge()) { console.log("FAIL the fixture tests need Windows and Edge"); process.exit(1); }
  const t0 = Date.now();
  const edge = await launch({ keep: o.keep });
  try {
    const runs = await measureAll(edge, C.FIXTURE, Object.assign({}, o, { screens: null, langs: C.LANGS, sizes: C.SIZES }));
    say(runs.length === 4, "fixture: four runs (uk, en x default, large)");
    for (const r of runs) {
      const ps = check(r);
      const broken = [...new Set(ps.filter((p) => p.frame === "s1:broken").map((p) => p.kind + ":" + p.subject))].sort();
      const clean = ps.filter((p) => p.frame !== "s1:broken");
      say(JSON.stringify(broken) === JSON.stringify(FIXTURE_EXPECT), `fixture ${runName(r)}: s1:broken shows every problem kind, once each`,
        "got " + JSON.stringify(broken) + "\n     want " + JSON.stringify(FIXTURE_EXPECT));
      say(clean.length === 0, `fixture ${runName(r)}: s2:clean and the page have no problems`, clean.map((p) => `${p.frame} ${p.kind} ${p.subject}: ${p.detail}`).join("\n     "));
      const f2 = r.data.frames.find((f) => f.screen === "s2");
      say(f2 && f2.box.y === H && f2.nodes.length === 29 && f2.texts.length === 19, `fixture ${runName(r)}: s2 at y ${H} with 29 nodes and 19 texts`,
        f2 ? `y ${f2.box.y}, ${f2.nodes.length} nodes, ${f2.texts.length} texts` : "no s2");
    }
    const uk = runs[0].data.frames[1].texts.find((x) => x.key === "fixture.host");
    const ukL = runs[1].data.frames[1].texts.find((x) => x.key === "fixture.host");
    say(uk && ukL && ukL.union.h > uk.union.h * 1.15, "fixture: large text is taller than default", uk && ukL ? `${uk.union.h} vs ${ukL.union.h}` : "");
    const only = await measureRun(edge, C.FIXTURE, "en", "default", Object.assign({}, o, { screens: ["s2"] }));
    say(only.data.frames.length === 1 && check(only).length === 0, "--screens s2 measures only s2");
    let fontErr = null;
    try { await measureRun(edge, C.FIXTURE, "uk", "default", o, { font: "off" }); } catch (e) { fontErr = e; }
    say(fontErr instanceof C.FontError && /Comfortaa is not loaded/.test(fontErr.message), "a page without Comfortaa stops the run with a clear message",
      fontErr ? fontErr.message : "no error");
  } finally {
    await edge.close();
  }
  console.log(failed ? `\nSELF-TEST FAILED: ${failed}` : `\nSELF-TEST OK (${((Date.now() - t0) / 1000).toFixed(1)} s in Edge)`);
  process.exit(failed ? 1 : 0);
}

// ---- main ----------------------------------------------------------------------------------------------------

async function main() {
  const o = C.parseArgs(process.argv.slice(2), USAGE, { "--json": ["json", true] });
  if (o.selfTest) return selfTest(o);
  if (!haveEdge()) { console.error("fit: needs Windows and Microsoft Edge (local only, not CI)"); process.exit(2); }
  const pc = C.checkPage(o.page);
  if (!pc.ok) { console.error("fit: " + pc.why); process.exit(2); }
  for (const w of pc.warn) console.log("warning: " + w);
  const t0 = Date.now();
  const edge = await launch({ keep: o.keep });
  let runs;
  try {
    runs = await measureAll(edge, o.page, o);
  } finally {
    await edge.close();
  }
  const n = runs[0].data.frames.length;
  if (!n) {
    console.error("fit: no frames to measure in " + C.rel(o.page) + (o.screens ? " for --screens " + o.screens.join(",") : "") + " (no .sc-frame[data-screen][data-state])");
    process.exit(2);
  }
  const problems = [];
  for (const r of runs) problems.push(...check(r));
  console.log(report(runs, problems, o.page, (Date.now() - t0) / 1000));
  if (o.json) {
    const file = path.resolve(o.json);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ page: C.rel(o.page), when: new Date().toISOString(), tolerances: { box: TOL, text: TTOL },
      runs: runs.map((r) => ({ lang: r.lang, size: r.size, href: r.href, seconds: r.seconds, failedRequests: r.failedRequests,
        pageErrors: r.pageErrors, fonts: r.data.fonts, userAgent: r.data.userAgent, frames: r.data.frames, strays: r.data.strays })),
      problems }, null, 1));
    console.log("records: " + file);
  }
  process.exit(problems.length ? 1 : 0);
}

main().catch((e) => {
  console.error("fit: " + (e && e.message ? e.message : e));
  process.exit(2);
});
