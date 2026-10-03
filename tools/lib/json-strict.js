// Strict RFC 8259 JSON parser for the token build (spec §7.1 step 1, dtcg-facts §9 items 1 and 2).
// It rejects what JSON.parse lets through or what editors add: duplicate keys, comments, trailing commas, single
// quotes and a byte order mark. Errors carry the rule id (D01 syntax, D02 duplicate key), the line and column and the
// JSON Pointer of the place. Objects keep their source key order in the non-enumerable KEYS array, because plain
// objects move integer-like keys ("10", "500") to the front.
// Node 20, no packages.
'use strict';

const KEYS = Symbol('json-strict.keys');

class JsonStrictError extends Error {
  constructor(rule, message, line, col, pointer, reason) {
    super(message);
    this.reason = reason || message;
    this.name = 'JsonStrictError';
    this.rule = rule;
    this.line = line;
    this.col = col;
    this.pointer = pointer;
  }
}

const escapeSegment = (s) => String(s).replace(/~/g, '~0').replace(/\//g, '~1');
const pointerOf = (segments) => segments.map((s) => '/' + escapeSegment(s)).join('');
const pointerJoin = (pointer, ...segments) => pointer + pointerOf(segments);

// The keys of a parsed object in source order (falls back to Object.keys for other objects).
function keysOf(obj) {
  if (obj && obj[KEYS]) return obj[KEYS];
  return obj && typeof obj === 'object' ? Object.keys(obj) : [];
}

const NUMBER = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;

// parse(text) -> { value, position(pointer) -> { line, col } | null }
function parse(text) {
  if (typeof text !== 'string') throw new TypeError('json-strict: parse expects a string');
  const n = text.length;
  const lineStarts = [0];
  for (let k = 0; k < n; k++) if (text.charCodeAt(k) === 10) lineStarts.push(k + 1);
  const where = (idx) => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= idx) lo = mid; else hi = mid - 1;
    }
    return { line: lo + 1, col: idx - lineStarts[lo] + 1 };
  };
  const at = new Map(); // pointer -> index
  let i = 0;

  const fail = (rule, message, idx, segs) => {
    const { line, col } = where(Math.min(idx, n));
    throw new JsonStrictError(rule, `${message} (line ${line}, column ${col})`, line, col, pointerOf(segs), message);
  };
  const ws = () => {
    for (;;) {
      const c = text.charCodeAt(i);
      if (c === 32 || c === 9 || c === 10 || c === 13) i++;
      else break;
    }
  };
  const describe = (idx) => {
    if (idx >= n) return 'the end of the file';
    const ch = text[idx];
    return JSON.stringify(ch);
  };
  const unexpected = (segs, what) => {
    const c = text[i];
    if (c === '/' && (text[i + 1] === '/' || text[i + 1] === '*')) fail('D01', 'comments are not allowed in JSON', i, segs);
    if (c === "'") fail('D01', 'strings must use double quotes', i, segs);
    fail('D01', `expected ${what} but found ${describe(i)}`, i, segs);
  };

  function parseString(segs) {
    // text[i] === '"'
    const start = i;
    i++;
    let out = '';
    let run = i;
    for (;;) {
      if (i >= n) fail('D01', 'unterminated string', start, segs);
      const c = text.charCodeAt(i);
      if (c === 34) { out += text.slice(run, i); i++; return out; }
      if (c < 0x20) fail('D01', 'control characters must be escaped inside strings', i, segs);
      if (c === 92) {
        out += text.slice(run, i);
        const e = text[i + 1];
        if (e === '"' || e === '\\' || e === '/') { out += e; i += 2; }
        else if (e === 'b') { out += '\b'; i += 2; }
        else if (e === 'f') { out += '\f'; i += 2; }
        else if (e === 'n') { out += '\n'; i += 2; }
        else if (e === 'r') { out += '\r'; i += 2; }
        else if (e === 't') { out += '\t'; i += 2; }
        else if (e === 'u') {
          const hex = text.slice(i + 2, i + 6);
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) fail('D01', 'bad \\u escape', i, segs);
          out += String.fromCharCode(parseInt(hex, 16));
          i += 6;
        } else fail('D01', 'bad escape in string', i, segs);
        run = i;
        continue;
      }
      i++;
    }
  }

  function parseValue(segs) {
    ws();
    const c = text[i];
    if (c === '{') return parseObject(segs);
    if (c === '[') return parseArray(segs);
    if (c === '"') return parseString(segs);
    if (c === 't' && text.startsWith('true', i)) { i += 4; return true; }
    if (c === 'f' && text.startsWith('false', i)) { i += 5; return false; }
    if (c === 'n' && text.startsWith('null', i)) { i += 4; return null; }
    if (c === '-' || (c >= '0' && c <= '9')) {
      NUMBER.lastIndex = i;
      const m = NUMBER.exec(text);
      if (!m) fail('D01', 'malformed number', i, segs);
      const next = text[i + m[0].length];
      if (next !== undefined && /[0-9.eE+\-]/.test(next)) fail('D01', 'malformed number (leading zeros or a bad exponent)', i, segs);
      i += m[0].length;
      return Number(m[0]);
    }
    return unexpected(segs, 'a value');
  }

  function parseObject(segs) {
    const open = i;
    i++;
    const obj = {};
    const keys = [];
    const seen = new Set();
    ws();
    if (text[i] === '}') { i++; Object.defineProperty(obj, KEYS, { value: keys }); return obj; }
    for (;;) {
      ws();
      if (text[i] !== '"') {
        if (text[i] === '}' && keys.length) fail('D01', 'trailing comma before }', i, segs);
        unexpected(segs, 'a "key"');
      }
      const keyAt = i;
      const key = parseString(segs);
      const child = segs.concat([key]);
      if (seen.has(key)) fail('D02', `duplicate key ${JSON.stringify(key)}`, keyAt, child);
      seen.add(key);
      ws();
      if (text[i] !== ':') unexpected(child, '":"');
      i++;
      at.set(pointerOf(child), keyAt);
      const value = parseValue(child);
      Object.defineProperty(obj, key, { value, writable: true, enumerable: true, configurable: true });
      keys.push(key);
      ws();
      if (text[i] === ',') { i++; ws(); if (text[i] === '}') fail('D01', 'trailing comma before }', i, segs); continue; }
      if (text[i] === '}') { i++; break; }
      if (i >= n) fail('D01', 'unterminated object', open, segs);
      unexpected(child, '"," or "}"');
    }
    Object.defineProperty(obj, KEYS, { value: keys });
    return obj;
  }

  function parseArray(segs) {
    const open = i;
    i++;
    const arr = [];
    ws();
    if (text[i] === ']') { i++; return arr; }
    for (;;) {
      const child = segs.concat([String(arr.length)]);
      ws();
      at.set(pointerOf(child), i);
      arr.push(parseValue(child));
      ws();
      if (text[i] === ',') { i++; ws(); if (text[i] === ']') fail('D01', 'trailing comma before ]', i, segs); continue; }
      if (text[i] === ']') { i++; break; }
      if (i >= n) fail('D01', 'unterminated array', open, segs);
      unexpected(child, '"," or "]"');
    }
    return arr;
  }

  if (text.charCodeAt(0) === 0xfeff) fail('D01', 'a byte order mark is not allowed; save the file as UTF-8 without BOM', 0, []);
  ws();
  at.set('', i);
  const value = parseValue([]);
  ws();
  if (i < n) unexpected([], 'the end of the file');
  const position = (pointer) => {
    let p = pointer;
    for (;;) {
      if (at.has(p)) return where(at.get(p));
      if (!p) return null;
      p = p.slice(0, p.lastIndexOf('/'));
    }
  };
  return { value, position };
}

module.exports = { parse, keysOf, KEYS, JsonStrictError, pointerOf, pointerJoin, escapeSegment };
