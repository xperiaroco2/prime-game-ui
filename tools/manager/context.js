// The manager's own context (#21): how old the manager session is and how large its newest call's context was, so it
// knows when a handover is due (CLAUDE.md, "Starting a new manager session").
//
//   node tools/manager/context.js                the manager session of this repo that made the newest call
//   node tools/manager/context.js <id|path>      a session id (or its first characters) or a transcript path
//   node tools/manager/context.js --self-test    the fixtures under tools/manager/fixtures/ (CI has no transcripts)
//   options: --dir <folder of the transcripts>   default: <CLAUDE_CONFIG_DIR or ~/.claude>/projects/<this repo>
//
// It prints one line: the session id, its age in hours since the transcript's first line, the context of its newest
// call (input + cache read + cache write) and whether a handover is due (over 12 hours or over 300k tokens). The
// workflow agents' transcripts live in sub-folders and are never read. Exit 2 when no transcript is found.
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..");
const MAX_HOURS = 12;
const MAX_CONTEXT = 300000;

// Claude Code keeps a project's transcripts in a folder named after the checkout's path with every character other
// than a letter or a digit replaced by "-". A worktree's sessions belong to the main checkout, found through git.
function transcriptDir() {
  let checkout = ROOT;
  try {
    const common = execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (common) checkout = path.dirname(common);
  } catch { /* not a git checkout: the folder of this file's repo */ }
  const home = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
  return path.join(home, "projects", path.resolve(checkout).replace(/[^a-zA-Z0-9]/g, "-"));
}

const isFile = p => { try { return fs.statSync(p).isFile(); } catch { return false; } };

// The newest session is the one whose newest call is the latest, not the newest file: an ended session's transcript
// still gets lines appended (an artifact's "artifact-autoreact-ledger" line, with no timestamp), which moves its mtime.
// A transcript with no call yet counts by its mtime.
function findTranscript(dir, arg) {
  if (arg && (arg.endsWith(".jsonl") || isFile(arg))) {
    if (!isFile(arg)) throw new Error(`no transcript ${arg}`);
    return arg;
  }
  let names;
  try { names = fs.readdirSync(dir).filter(n => n.endsWith(".jsonl")); } catch { throw new Error(`no transcript folder ${dir}`); }
  if (arg) names = names.filter(n => n.startsWith(arg));
  if (!names.length) throw new Error(arg ? `no transcript of session ${arg} in ${dir}` : `no transcript in ${dir}`);
  if (arg && names.length > 1) throw new Error(`session ${arg} is ambiguous: ${names.join(", ")}`);
  const withTime = names.map(n => {
    const file = path.join(dir, n);
    const call = lastCall(file);
    return { file, at: call ? Date.parse(call.timestamp) : fs.statSync(file).mtimeMs };
  });
  withTime.sort((a, b) => b.at - a.at);
  return withTime[0].file;
}

// The newest call of the session itself (not a sidechain, not a synthetic message) among the lines, or null. One call
// can span several lines with the same usage; the newest one is enough.
function newestCall(lines) {
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (!line.includes('"assistant"') || !line.includes('"usage"')) continue;
    let o;
    try { o = JSON.parse(line); } catch { continue; }
    const m = o.message;
    if (o.type !== "assistant" || o.isSidechain || !m || !m.usage || m.model === "<synthetic>") continue;
    return { timestamp: o.timestamp, usage: m.usage, sessionId: o.sessionId || null };
  }
  return null;
}

// The newest call from the transcript's last MiB (the whole file only when that holds none), so choosing the newest
// session does not read every transcript whole.
function lastCall(file) {
  const fd = fs.openSync(file, "r");
  let lines, whole;
  try {
    const size = fs.fstatSync(fd).size;
    const len = Math.min(size, 1 << 20);
    const buf = Buffer.alloc(len);
    fs.readSync(fd, buf, 0, len, size - len);
    lines = buf.toString("utf8").split("\n");
    whole = len === size;
  } finally {
    fs.closeSync(fd);
  }
  return newestCall(lines) || (whole ? null : newestCall(fs.readFileSync(file, "utf8").split("\n")));
}

// The first line that carries a timestamp, and the newest call of the session itself.
function readTranscript(file) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  let first = null, sessionId = null;
  for (const line of lines) {
    if (!line.includes('"timestamp"')) continue;
    try { const o = JSON.parse(line); if (o.timestamp) { first = o.timestamp; sessionId = o.sessionId || null; break; } } catch { /* a torn line */ }
  }
  const newest = newestCall(lines);
  if (newest && newest.sessionId) sessionId = newest.sessionId;
  return { first, newest, sessionId: sessionId || path.basename(file, ".jsonl") };
}

function report(file, now) {
  const t = readTranscript(file);
  if (!t.first) throw new Error(`no timestamped line in ${file}`);
  const hours = (now - Date.parse(t.first)) / 3600000;
  const u = t.newest ? t.newest.usage : {};
  const context = (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
  const why = [];
  if (hours > MAX_HOURS) why.push(`over ${MAX_HOURS} h`);
  if (context > MAX_CONTEXT) why.push(`context over ${MAX_CONTEXT / 1000}k`);
  const verdict = why.length ? `handover due at the next wave boundary (${why.join(", ")})` : "handover not due";
  const ctx = t.newest ? `context ${context} tokens` : "context unknown (no call yet)";
  return `session ${t.sessionId}, age ${hours.toFixed(1)} h, ${ctx}: ${verdict}`;
}

function selfTest() {
  const fix = path.join(__dirname, "fixtures");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "manager-context-"));
  let bad = 0;
  const expect = (name, got, want) => {
    const ok = got === want;
    if (!ok) bad++;
    console.log(`${ok ? "ok  " : "FAIL"} ${name}${ok ? "" : `\n     got:  ${got}\n     want: ${want}`}`);
  };
  try {
    for (const n of fs.readdirSync(fix)) fs.copyFileSync(path.join(fix, n), path.join(tmp, n));
    // The small session made the newest call, so it is the default, though the ended big session is the newer file:
    // a ledger line was appended to it after its last call, as Claude Code does.
    const big = path.join(tmp, "aaaa1111-0000-4000-8000-000000000001.jsonl");
    fs.appendFileSync(big, '{"type":"artifact-autoreact-ledger","v":1,"sessionId":"aaaa1111-0000-4000-8000-000000000001","artifacts":{}}\n');
    fs.utimesSync(big, new Date("2026-10-07T00:00:00Z"), new Date("2026-10-07T00:00:00Z"));
    fs.utimesSync(path.join(tmp, "bbbb2222-0000-4000-8000-000000000002.jsonl"), new Date("2026-10-06T10:31:00Z"), new Date("2026-10-06T10:31:00Z"));
    const at = iso => Date.parse(iso);
    expect("newest call, not newest file: young and small", report(findTranscript(tmp, null), at("2026-10-06T12:00:00Z")),
      "session bbbb2222-0000-4000-8000-000000000002, age 2.0 h, context 120500 tokens: handover not due");
    expect("over 12 hours", report(findTranscript(tmp, "bbbb"), at("2026-10-06T22:30:00Z")),
      "session bbbb2222-0000-4000-8000-000000000002, age 12.5 h, context 120500 tokens: handover due at the next wave boundary (over 12 h)");
    expect("over 300k, skipping the sidechain and synthetic lines", report(findTranscript(tmp, "aaaa1111"), at("2026-10-05T11:00:00Z")),
      "session aaaa1111-0000-4000-8000-000000000001, age 1.0 h, context 300004 tokens: handover due at the next wave boundary (context over 300k)");
    expect("both, by path", report(findTranscript(tmp, path.join(tmp, "aaaa1111-0000-4000-8000-000000000001.jsonl")), at("2026-10-06T10:00:00Z")),
      "session aaaa1111-0000-4000-8000-000000000001, age 24.0 h, context 300004 tokens: handover due at the next wave boundary (over 12 h, context over 300k)");
    let err = "";
    try { findTranscript(tmp, "cccc"); } catch (e) { err = e.message; }
    expect("an unknown session", err.startsWith("no transcript of session cccc"), true);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  console.log(bad ? `FAILED: ${bad} self-test mismatch(es)` : "ALL CLEAN");
  return bad ? 1 : 0;
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--self-test")) return selfTest();
  let dir = null, arg = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dir") dir = argv[++i];
    else if (argv[i].startsWith("--")) { console.error(`unknown argument ${argv[i]} (use --self-test, --dir)`); return 2; }
    else if (arg) { console.error("give one session id or path"); return 2; }
    else arg = argv[i];
  }
  try {
    console.log(report(findTranscript(dir || transcriptDir(), arg), Date.now()));
    return 0;
  } catch (e) {
    console.error(e.message);
    return 2;
  }
}

process.exitCode = main();
