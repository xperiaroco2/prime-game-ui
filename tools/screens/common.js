// What tools/screens/fit.js and shots.js share: the page, the filters, the measuring-mode URL and the fonts verdict.
// Node's own modules only.
"use strict";
const fs = require("fs");
const path = require("path");
const url = require("url");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..");
const PAGE = path.join(ROOT, "pages", "screens", "screens.html");
const FIXTURE = path.join(__dirname, "fixtures", "screens-fixture.html");
const LANGS = ["uk", "en"];
const SIZES = ["default", "large"];

function rel(p) {
  const r = path.relative(ROOT, p);
  return r && !r.startsWith("..") && !path.isAbsolute(r) ? r.split(path.sep).join("/") : p;
}

// "s02" and "s2" name the same screen; the page's data-screen is "s2"
function normScreen(s) {
  const m = /^s0*(\d+)$/i.exec(s.trim());
  return m ? "s" + Number(m[1]) : s.trim();
}

// the options both tools take; `extra` maps further flags to [key, takesValue]
function parseArgs(argv, usage, extra) {
  const o = { page: PAGE, screens: null, langs: LANGS.slice(), sizes: SIZES.slice(), timeout: 60, keep: false, selfTest: false };
  const bad = (why) => { console.error(usage + "\n" + why); process.exit(2); };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => { if (i + 1 >= argv.length) bad("missing value for " + a); return argv[++i]; };
    if (a === "--page") o.page = path.resolve(val());
    else if (a === "--screens") o.screens = val().split(",").filter(Boolean).map(normScreen);
    else if (a === "--lang") { const v = val(); if (!LANGS.includes(v)) bad("--lang is uk or en"); o.langs = [v]; }
    else if (a === "--size") { const v = val(); if (!SIZES.includes(v)) bad("--size is default or large"); o.sizes = [v]; }
    else if (a === "--timeout") { o.timeout = Number(val()); if (!(o.timeout > 0)) bad("--timeout is seconds > 0"); }
    else if (a === "--keep") o.keep = true;
    else if (a === "--self-test") o.selfTest = true;
    else if (a === "--help" || a === "-h") { console.log(usage); process.exit(0); }
    else if (extra && extra[a]) { const [key, takes] = extra[a]; o[key] = takes ? val() : true; }
    else bad("unknown argument: " + a);
  }
  return o;
}

function pageUrl(page, q) {
  return url.pathToFileURL(page).href + "?" + new URLSearchParams(q).toString();
}

// the page must exist; the real page is also checked against its sources when its builder can say so
function checkPage(page) {
  if (!fs.existsSync(page)) return { ok: false, why: "no page at " + rel(page) + " (the screens page is not built yet?)" };
  const warn = [];
  const build = path.join(path.dirname(page), "build.js");
  if (page === PAGE && fs.existsSync(build)) {
    const r = spawnSync(process.execPath, [build, "--check"], { encoding: "utf8", cwd: ROOT, timeout: 120000 });
    if (r.status !== 0) warn.push(rel(page) + " may be out of date with its sources (" + rel(build) + " --check: " +
      ((r.stderr || r.stdout || "").trim().split("\n")[0] || "exit " + r.status) + "); measuring it as it is");
  }
  return { ok: true, warn };
}

class FontError extends Error {}

// fonts: fontState() of measure.js; failed: the URLs Edge could not load
function fontVerdict(fonts, where, failed) {
  if (fonts && fonts.ok) return null;
  const f = fonts || {};
  const blocked = (failed || []).filter((u) => /fonts\.(googleapis|gstatic)\.com/.test(u));
  return new FontError(`Comfortaa is not loaded (${where}): document.fonts.check('700 32px Comfortaa') = ${f.check}, ` +
    `check with the shown texts = ${f.checkShown}, ${f.loaded || 0} of ${f.faces || 0} Comfortaa faces loaded. ` +
    "The page must load it from Google Fonts (fonts.googleapis.com and fonts.gstatic.com must be reachable); with a " +
    "fallback font every measurement and picture would be wrong, so nothing is reported." +
    (blocked.length ? " Failed requests: " + blocked.slice(0, 4).join("; ") : ""));
}

module.exports = { ROOT, PAGE, FIXTURE, LANGS, SIZES, rel, normScreen, parseArgs, pageUrl, checkPage, FontError, fontVerdict };
