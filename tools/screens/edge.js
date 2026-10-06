// Headless Microsoft Edge driven over the Chrome DevTools Protocol, for tools/screens/fit.js and shots.js.
// Local Windows only, not CI. Node's own modules only (node 20: no global WebSocket, so a minimal RFC 6455 client is
// here).
//
// Edge is started the way tools/visual/probe.js starts it (the only way that works on this machine): PowerShell
// Start-Process -Wait with a fresh --user-data-dir in a new OS temp folder. The PowerShell process runs in the
// background while Node talks to Edge on the port Edge writes to <profile>/DevToolsActivePort; Browser.close ends
// Edge, which ends PowerShell. Every host name except Google Fonts is unresolvable, so the page's Comfortaa loads and
// nothing else is fetched; the URLs of failed requests are collected so a run can say what was blocked.
//
//   const { launch } = require("./edge.js");
//   const edge = await launch();                  // 1920x1080 viewport, device scale 1, no scrollbars
//   const ready = await edge.page.open(href);     // waits for <html data-ready="1">
//   const value = await edge.page.eval("1 + 1");  // Runtime.evaluate, value returned by value
//   const png = await edge.page.shot({ scale: 0.5 });  // Buffer: the viewport's top-left 1920x1080 at scale
//   await edge.close();
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const crypto = require("crypto");
const { EventEmitter } = require("events");
const { spawn, spawnSync } = require("child_process");

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const W = 1920;
const H = 1080;
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function psq(s) { return "'" + s.replace(/'/g, "''") + "'"; }
function haveEdge() { return process.platform === "win32" && fs.existsSync(EDGE); }

// ---- a minimal WebSocket client: masked text frames out; text, binary, ping, close in -------------------------
class Ws extends EventEmitter {
  constructor(socket, head) {
    super();
    this.socket = socket;
    this.buf = head && head.length ? Buffer.from(head) : Buffer.alloc(0);
    this.chunks = [];
    this.have = this.buf.length;
    this.need = 2;
    this.parts = [];
    socket.setNoDelay(true);
    socket.on("data", (d) => this.onData(d));
    socket.on("close", () => this.emit("close"));
    socket.on("error", (e) => this.emit("error", e));
  }
  onData(d) {
    this.chunks.push(d);
    this.have += d.length;
    if (this.have < this.need) return; // a large frame (a screenshot) arrives in many chunks: join them once
    this.parse();
  }
  parse() {
    if (this.chunks.length) { this.buf = Buffer.concat([this.buf].concat(this.chunks)); this.chunks = []; }
    for (;;) {
      const b = this.buf;
      this.have = b.length;
      if (b.length < 2) { this.need = 2; return; }
      const fin = (b[0] & 0x80) !== 0, op = b[0] & 0x0f, masked = (b[1] & 0x80) !== 0;
      let len = b[1] & 0x7f, off = 2;
      if (len === 126) { if (b.length < 4) { this.need = 4; return; } len = b.readUInt16BE(2); off = 4; }
      else if (len === 127) { if (b.length < 10) { this.need = 10; return; } len = Number(b.readBigUInt64BE(2)); off = 10; }
      const mOff = off;
      if (masked) off += 4;
      if (b.length < off + len) { this.need = off + len; return; }
      let payload = b.subarray(off, off + len);
      if (masked) {
        payload = Buffer.from(payload);
        for (let i = 0; i < payload.length; i++) payload[i] ^= b[mOff + (i & 3)];
      }
      this.buf = b.subarray(off + len);
      if (op === 8) { this.socket.end(); continue; }
      if (op === 9) { this.frame(10, payload); continue; }
      if (op === 10) continue;
      this.parts.push(Buffer.from(payload));
      if (fin) {
        const msg = Buffer.concat(this.parts).toString("utf8");
        this.parts = [];
        this.emit("message", msg);
      }
    }
  }
  frame(op, payload) {
    const len = payload.length;
    let head;
    if (len < 126) { head = Buffer.alloc(2); head[1] = 0x80 | len; }
    else if (len < 65536) { head = Buffer.alloc(4); head[1] = 0x80 | 126; head.writeUInt16BE(len, 2); }
    else { head = Buffer.alloc(10); head[1] = 0x80 | 127; head.writeBigUInt64BE(BigInt(len), 2); }
    head[0] = 0x80 | op;
    const mask = crypto.randomBytes(4);
    const body = Buffer.alloc(len);
    for (let i = 0; i < len; i++) body[i] = payload[i] ^ mask[i & 3];
    this.socket.write(Buffer.concat([head, mask, body]));
  }
  send(text) { this.frame(1, Buffer.from(text, "utf8")); }
  close() {
    try { this.frame(8, Buffer.alloc(0)); } catch (e) { /* already closed */ }
    this.socket.end();
  }
}

function wsConnect(wsUrl) {
  return new Promise((resolve, reject) => {
    const u = new URL(wsUrl);
    const req = http.request({
      host: u.hostname, port: u.port, path: u.pathname + u.search,
      headers: { Connection: "Upgrade", Upgrade: "websocket", "Sec-WebSocket-Version": "13",
        "Sec-WebSocket-Key": crypto.randomBytes(16).toString("base64") },
    });
    req.on("upgrade", (res, socket, head) => resolve(new Ws(socket, head)));
    req.on("response", (res) => reject(new Error("DevTools refused the WebSocket: HTTP " + res.statusCode)));
    req.on("error", reject);
    req.end();
  });
}

// ---- the protocol: one browser connection, one page session (flat mode) ---------------------------------------
class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.handlers = [];
    ws.on("message", (m) => {
      let o;
      try { o = JSON.parse(m); } catch (e) { return; }
      if (o.id) {
        const p = this.pending.get(o.id);
        if (!p) return;
        this.pending.delete(o.id);
        if (o.error) p.reject(new Error(p.method + ": " + o.error.message));
        else p.resolve(o.result);
      } else for (const h of this.handlers) h(o);
    });
    const fail = () => {
      for (const p of this.pending.values()) p.reject(new Error(p.method + ": the DevTools connection closed"));
      this.pending.clear();
    };
    ws.on("close", fail);
    ws.on("error", fail);
  }
  send(method, params, sessionId) {
    const id = ++this.id;
    const msg = { id, method, params: params || {} };
    if (sessionId) msg.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method });
      this.ws.send(JSON.stringify(msg));
    });
  }
  on(fn) { this.handlers.push(fn); }
}

class Page {
  constructor(cdp, sessionId) {
    this.cdp = cdp;
    this.sessionId = sessionId;
    this.failed = []; // URLs of requests that failed (blocked hosts, missing files)
    this.errors = []; // uncaught page exceptions and console errors
    const reqs = new Map();
    cdp.on((o) => {
      if (o.sessionId !== sessionId) return;
      if (o.method === "Network.requestWillBeSent") reqs.set(o.params.requestId, o.params.request.url);
      else if (o.method === "Network.loadingFailed" && !o.params.canceled) {
        const u = reqs.get(o.params.requestId) || "?";
        this.failed.push(u.slice(0, 200) + " (" + o.params.errorText + ")");
      } else if (o.method === "Runtime.exceptionThrown") {
        const d = o.params.exceptionDetails || {};
        this.errors.push(((d.exception && d.exception.description) || d.text || "exception").split("\n")[0].slice(0, 300));
      }
    });
  }
  send(method, params) { return this.cdp.send(method, params, this.sessionId); }
  async eval(expression, awaitPromise) {
    const r = await this.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: !!awaitPromise });
    if (r.exceptionDetails) {
      const d = r.exceptionDetails;
      throw new Error("in-page script failed: " + ((d.exception && d.exception.description) || d.text).split("\n").slice(0, 3).join(" | "));
    }
    return r.result.value;
  }
  // navigate and wait until the new document sets <html data-ready="1"> (the screens page contract, item 4); returns
  // the time it took in seconds. The old document is marked first, so a page that rewrites its own URL still works.
  async open(href, timeoutSec) {
    const limit = (timeoutSec || 60) * 1000;
    this.failed = [];
    this.errors = [];
    await this.eval("window.__screensToolOld = 1");
    const t0 = Date.now();
    const nav = await this.send("Page.navigate", { url: href });
    if (nav.errorText) throw new Error("Edge could not open " + href + ": " + nav.errorText);
    let last = "";
    while (Date.now() - t0 < limit) {
      try {
        last = await this.eval("window.__screensToolOld === 1 ? 'old' : (document.readyState + ' ' + (document.documentElement.dataset.ready || '-'))");
        if (/ 1$/.test(last)) return (Date.now() - t0) / 1000;
      } catch (e) { last = e.message; /* the context is being replaced */ }
      await sleep(50);
    }
    const why = this.errors.length ? "; page errors: " + this.errors.slice(0, 3).join(" | ") : "";
    throw new Error(`the page did not set <html data-ready="1"> within ${limit / 1000} s (state: ${last})${why}: ${href}`);
  }
  // the viewport's top-left W x H CSS px as a PNG, at the given scale (1 = 1920x1080 px)
  async shot(opt) {
    const scale = (opt && opt.scale) || 1;
    const r = await this.send("Page.captureScreenshot", {
      format: "png", fromSurface: true, captureBeyondViewport: false,
      clip: { x: 0, y: 0, width: W, height: H, scale },
    });
    return Buffer.from(r.data, "base64");
  }
}

// ---- launching and closing Edge ----------------------------------------------------------------------------
async function launch(opt) {
  opt = opt || {};
  if (!haveEdge()) throw new Error("needs Windows and Microsoft Edge at " + EDGE + " (local only, not CI)");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "prime-ui-screens-edge-"));
  const profile = path.join(tmp, "profile");
  const out = path.join(tmp, "edge-stdout.txt");
  const err = path.join(tmp, "edge-stderr.txt");
  const rules = "MAP * ~NOTFOUND, " + FONT_HOSTS.map((h) => "EXCLUDE " + h).join(", ");
  const list = ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--user-data-dir=" + profile, "--remote-debugging-port=0", "--host-resolver-rules=" + rules,
    "--force-device-scale-factor=1", "--window-size=" + W + "," + H, "--hide-scrollbars", "--mute-audio",
    "--disable-extensions", "--disable-sync", "--disable-component-update", "--disable-background-networking",
    "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "about:blank"];
  // Start-Process joins -ArgumentList with spaces: an argument with a space is wrapped in double quotes
  const argList = list.map((a) => psq(/\s/.test(a) ? '"' + a + '"' : a)).join(",");
  const ps = "$ErrorActionPreference = 'Stop'; Start-Process -FilePath " + psq(EDGE) + " -ArgumentList " + argList +
    " -Wait -NoNewWindow -RedirectStandardOutput " + psq(out) + " -RedirectStandardError " + psq(err);
  const child = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-EncodedCommand", Buffer.from(ps, "utf16le").toString("base64")],
    { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] });
  let psErr = "";
  child.stderr.on("data", (d) => { psErr += d; });
  let exited = false;
  const exit = new Promise((r) => child.on("exit", (code) => { exited = true; r(code); }));
  // an interrupted run (Ctrl+C, an uncaught error, a failed setup) must not leave Edge running
  let closed = false;
  const onExit = () => { if (!closed && !exited) killProfile(profile); };
  const onSignal = () => process.exit(130);
  process.once("exit", onExit);
  process.once("SIGINT", onSignal);
  const tail = (f) => { try { return fs.readFileSync(f, "utf8").trim().split("\n").slice(-5).join(" | "); } catch (e) { return ""; } };

  const portFile = path.join(profile, "DevToolsActivePort");
  const t0 = Date.now();
  let lines = null;
  while (!lines) {
    try {
      const l = fs.readFileSync(portFile, "utf8").split(/\r?\n/);
      if (l.length >= 2 && /^\d+$/.test(l[0]) && l[1]) lines = l;
    } catch (e) { /* not written yet */ }
    if (lines) break;
    if (exited) throw new Error("Edge exited before it opened DevTools: " + (psErr.trim() || tail(err)).slice(0, 500));
    if (Date.now() - t0 > 30000) { killProfile(profile); throw new Error("Edge did not open DevTools within 30 s; see " + err); }
    await sleep(100);
  }
  let ws, cdp, page;
  try {
    ws = await wsConnect("ws://127.0.0.1:" + lines[0] + lines[1]);
    cdp = new Cdp(ws);
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
    page = new Page(cdp, sessionId);
    await page.send("Page.enable");
    await page.send("Runtime.enable");
    await page.send("Network.enable");
    await page.send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    try { await page.send("Emulation.setScrollbarsHidden", { hidden: true }); } catch (e) { /* --hide-scrollbars covers it */ }
  } catch (e) {
    if (ws) ws.close();
    killProfile(profile);
    throw new Error("Edge DevTools setup failed: " + e.message);
  }

  async function close() {
    if (closed) return;
    try { await Promise.race([cdp.send("Browser.close"), sleep(5000)]); } catch (e) { /* closing anyway */ }
    try { ws.close(); } catch (e) { /* closed */ }
    await Promise.race([exit, sleep(15000)]);
    if (!exited) killProfile(profile);
    closed = true;
    process.removeListener("exit", onExit);
    process.removeListener("SIGINT", onSignal);
    if (!opt.keep) fs.rmSync(tmp, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  }
  return { page, cdp, close, tmp, profile };
}

// the last resort: end the Edge processes of this profile only (synchronous, so it also works in an exit handler)
function killProfile(profile) {
  const ps = "Get-CimInstance Win32_Process -Filter \"Name = 'msedge.exe'\" | Where-Object { $_.CommandLine -like " +
    psq("*" + profile + "*") + " } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }";
  spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-EncodedCommand", Buffer.from(ps, "utf16le").toString("base64")],
    { windowsHide: true, timeout: 30000 });
}

module.exports = { launch, haveEdge, EDGE, W, H, FONT_HOSTS, sleep };
