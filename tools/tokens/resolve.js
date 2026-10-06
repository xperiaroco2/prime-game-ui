// The DTCG 2025.10 layer of the token build (spec §7.1 steps 1-3): the resolver, strict parsing, the walk of every
// token file, the static rules D01-D37 of dtcg-facts §9 (with the spec §7.1 changes), the merge of the permutations
// and alias resolution to pack value objects (spec §7.3). Rules of the component profile (P40-P63) are in validate.js.
// Node 20, no packages.
'use strict';

const fs = require('fs');
const path = require('path');
const { parse, keysOf, JsonStrictError, escapeSegment } = require('../lib/json-strict.js');
const { round4 } = require('../lib/color.js');

const NS = 'io.github.xperiaroco2.prime-game';
const FORMAT_SCHEMA = 'https://www.designtokens.org/schemas/2025.10/format.json';
const RESOLVER_SCHEMA = 'https://www.designtokens.org/schemas/2025.10/resolver.json';
const RESOLVER_FILE = 'tokens/prime.resolver.json';
const DTCG_TYPES = ['color', 'dimension', 'fontFamily', 'fontWeight', 'duration', 'cubicBezier', 'number',
  'strokeStyle', 'border', 'transition', 'shadow', 'gradient', 'typography'];
const ALLOWED_TYPES = ['color', 'dimension', 'duration', 'cubicBezier', 'number', 'fontFamily', 'fontWeight',
  'transition', 'typography'];
// sub-value key -> [sub-type, CSS suffix]
const COMPOSITES = {
  typography: [['fontFamily', 'fontFamily', 'font-family'], ['fontSize', 'dimension', 'font-size'],
    ['fontWeight', 'fontWeight', 'font-weight'], ['letterSpacing', 'dimension', 'letter-spacing'],
    ['lineHeight', 'number', 'line-height']],
  transition: [['duration', 'duration', 'duration'], ['delay', 'duration', 'delay'],
    ['timingFunction', 'cubicBezier', 'timing-function']],
};
const TOKEN_KEYS = ['$value', '$type', '$description', '$extensions', '$deprecated'];
const GROUP_KEYS = ['$type', '$description', '$extensions', '$deprecated'];
const RESERVED = ['$value', '$type', '$description', '$extensions', '$deprecated', '$schema', '$ref', '$root',
  '$extends', '$defs'];
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Fonts whose licence is recorded in the repo (dtcg-facts §9 item 23; docs/ui-decisions.md, Type: Comfortaa, OFL 1.1).
const LICENSED_FONTS = ['Comfortaa'];
// godot-facts §4: Tween.TransitionType and Tween.EaseType in 4.7.2.
const GODOT_TRANS = { TRANS_LINEAR: 0, TRANS_SINE: 1, TRANS_QUINT: 2, TRANS_QUART: 3, TRANS_QUAD: 4, TRANS_EXPO: 5,
  TRANS_ELASTIC: 6, TRANS_CUBIC: 7, TRANS_CIRC: 8, TRANS_BOUNCE: 9, TRANS_BACK: 10, TRANS_SPRING: 11 };
const GODOT_EASE = { EASE_IN: 0, EASE_OUT: 1, EASE_IN_OUT: 2, EASE_OUT_IN: 3 };

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isAlias = (v) => typeof v === 'string' && /^\{[^{}]*\}$/.test(v);
const aliasPath = (v) => v.slice(1, -1);
const hasBraces = (v) => typeof v === 'string' && /[{}]/.test(v);
const validAliasPath = (p) => p.length > 0 && p.split('.').every((s) => s.length > 0 && !s.startsWith('$'));
const cssVar = (p) => '--toy-' + p.split('.').join('-');
const ptrJoin = (ptr, ...segs) => ptr + segs.map((s) => '/' + escapeSegment(s)).join('');
const q = JSON.stringify;

// ---------------------------------------------------------------------------------------------------------------
// Problems: every report carries the file, the JSON Pointer, the token path, the rule id and a message (D39).

class Problems {
  constructor(positions) {
    this.list = [];
    this.keys = new Set();
    this.positions = positions || new Map(); // file -> position(pointer)
  }
  add(severity, rule, file, pointer, tokenPath, message, pos) {
    const key = [severity, rule, file, pointer, tokenPath, message].join('\u0000');
    if (this.keys.has(key)) return;
    this.keys.add(key);
    let where = pos || null;
    if (!where && file && this.positions.has(file)) where = this.positions.get(file)(pointer || '');
    this.list.push({ file: file || null, pointer: pointer == null ? null : pointer, path: tokenPath || null, rule,
      severity, message, line: where ? where.line : null, col: where ? where.col : null });
  }
  error(rule, file, pointer, tokenPath, message, pos) { this.add('error', rule, file, pointer, tokenPath, message, pos); }
  warn(rule, file, pointer, tokenPath, message, pos) { this.add('warning', rule, file, pointer, tokenPath, message, pos); }
  push(p) {
    const key = [p.severity, p.rule, p.file, p.pointer, p.path, p.message].join('\u0000');
    if (this.keys.has(key)) return;
    this.keys.add(key);
    this.list.push(p);
  }
  get errors() { return this.list.filter((p) => p.severity === 'error'); }
  get warnings() { return this.list.filter((p) => p.severity === 'warning'); }
}

function formatProblem(p) {
  const loc = p.file ? p.file + (p.line ? `:${p.line}:${p.col}` : '') : '(no file)';
  const ptr = p.pointer != null ? ` #${p.pointer}` : '';
  const tp = p.path ? ` (${p.path})` : '';
  return `${p.severity} [${p.rule}] ${loc}${ptr}${tp}: ${p.message}`;
}

function sortProblems(list) {
  return list.slice().sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1)
    || String(a.file).localeCompare(String(b.file)) || (a.line || 0) - (b.line || 0)
    || String(a.pointer).localeCompare(String(b.pointer)) || a.rule.localeCompare(b.rule));
}

// ---------------------------------------------------------------------------------------------------------------
// Files

function readJson(root, rel, P, missingRule) {
  const abs = path.join(root, ...rel.split('/'));
  let text;
  try {
    text = fs.readFileSync(abs, 'utf8');
  } catch (e) {
    P.error(missingRule || 'D34', rel, '', null, `cannot read the file (${e.code || e.message})`);
    return null;
  }
  try {
    const r = parse(text);
    P.positions.set(rel, r.position);
    return { value: r.value, text };
  } catch (e) {
    if (e instanceof JsonStrictError) {
      P.error(e.rule, rel, e.pointer, null, e.reason, { line: e.line, col: e.col });
      return null;
    }
    throw e;
  }
}

function listTokenFiles(root) {
  const out = [];
  const walk = (dirAbs, rel) => {
    let entries;
    try { entries = fs.readdirSync(dirAbs, { withFileTypes: true }); } catch { return; }
    for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(path.join(dirAbs, e.name), r);
      else if (e.name.endsWith('.tokens.json')) out.push(`tokens/${r}`);
    }
  };
  walk(path.join(root, 'tokens'), '');
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// The resolver (dtcg-facts §9 items 32-35, §5)

function readResolver(doc, root, P) {
  const F = RESOLVER_FILE;
  if (!isObj(doc)) {
    P.error('D32', F, '', null, 'the resolver must be a JSON object');
    return null;
  }
  const ROOT_KEYS = ['$schema', 'name', 'version', 'description', 'sets', 'modifiers', 'resolutionOrder', '$defs'];
  for (const k of keysOf(doc)) {
    if (!ROOT_KEYS.includes(k)) P.error('D32', F, ptrJoin('', k), null, `unknown root key ${q(k)}; allowed: ${ROOT_KEYS.join(', ')}`);
  }
  if ('$schema' in doc && doc.$schema !== RESOLVER_SCHEMA) {
    P.error('D04', F, '/$schema', null, `$schema must be ${q(RESOLVER_SCHEMA)}`);
  }
  if (doc.version !== '2025.10') P.error('D32', F, '/version', null, `version must be "2025.10", not ${q(doc.version)}`);
  for (const k of ['name', 'description']) {
    if (k in doc && typeof doc[k] !== 'string') P.error('D32', F, ptrJoin('', k), null, `${k} must be a string`);
  }
  const sets = isObj(doc.sets) ? doc.sets : {};
  const mods = isObj(doc.modifiers) ? doc.modifiers : {};
  if ('sets' in doc && !isObj(doc.sets)) P.error('D32', F, '/sets', null, 'sets must be an object');
  if ('modifiers' in doc && !isObj(doc.modifiers)) P.error('D32', F, '/modifiers', null, 'modifiers must be an object');
  const lower = new Map();
  for (const name of keysOf(mods)) {
    const lc = name.toLowerCase();
    if (lower.has(lc)) P.error('D35', F, ptrJoin('/modifiers', name), null, `modifier names ${q(lower.get(lc))} and ${q(name)} differ only in case`);
    else lower.set(lc, name);
  }
  if (!Array.isArray(doc.resolutionOrder) || doc.resolutionOrder.length === 0) {
    P.error('D32', F, '/resolutionOrder', null, 'resolutionOrder is required and must be a non-empty array');
    return null;
  }

  const fileRef = (ref, ptr) => {
    if (typeof ref !== 'string' || ref === '') {
      P.error('D34', F, ptr, null, '$ref must be a non-empty string');
      return null;
    }
    if (ref.includes('\\') || /^[a-zA-Z]:/.test(ref) || ref.startsWith('/') || /^[a-z]+:\/\//i.test(ref)) {
      P.error('D34', F, ptr, null, `file references are relative paths inside tokens/ with forward slashes: ${q(ref)}`);
      return null;
    }
    const rel = path.posix.normalize(`tokens/${ref}`);
    if (!rel.startsWith('tokens/') || rel.split('/').includes('..')) {
      P.error('D34', F, ptr, null, `file reference ${q(ref)} leaves tokens/`);
      return null;
    }
    if (!rel.endsWith('.tokens.json')) {
      P.error('D03', F, ptr, null, `token files end in .tokens.json: ${q(ref)}`);
      return null;
    }
    let ok = false;
    try { ok = fs.statSync(path.join(root, ...rel.split('/'))).isFile(); } catch { ok = false; }
    if (!ok) {
      P.error('D34', F, ptr, null, `the file ${rel} does not exist`);
      return null;
    }
    return rel;
  };

  // Sources of a set or a context: file references, or #/sets/<name> (recursively).
  const sourcesOf = (list, ptr, stack) => {
    const files = [];
    if (!Array.isArray(list)) return files;
    list.forEach((item, idx) => {
      const ip = `${ptr}/${idx}`;
      if (!isObj(item) || !('$ref' in item)) {
        P.error('D34', F, ip, null, 'inline token sources are not supported: reference a .tokens.json file with {"$ref": "…"}');
        return;
      }
      for (const k of keysOf(item)) if (k !== '$ref') P.error('D34', F, ptrJoin(ip, k), null, `a reference object holds only $ref, not ${q(k)}`);
      const ref = item.$ref;
      if (typeof ref === 'string' && ref.startsWith('#')) {
        let m;
        if ((m = /^#\/sets\/(.+)$/.exec(ref))) {
          const name = m[1].replace(/~1/g, '/').replace(/~0/g, '~');
          if (!(name in sets)) P.error('D34', F, `${ip}/$ref`, null, `${q(ref)} names no set`);
          else if (stack.includes(name)) P.error('D34', F, `${ip}/$ref`, null, `circular set reference: ${stack.concat(name).join(' -> ')}`);
          else files.push(...setFiles(name, stack.concat(name)));
        } else if (ref.startsWith('#/modifiers/')) {
          P.error('D34', F, `${ip}/$ref`, null, 'sets and modifier contexts never point at #/modifiers/…');
        } else if (ref.startsWith('#/resolutionOrder')) {
          P.error('D34', F, `${ip}/$ref`, null, 'nothing may point at #/resolutionOrder/…');
        } else {
          P.error('D34', F, `${ip}/$ref`, null, `${q(ref)} does not resolve`);
        }
        return;
      }
      const rel = fileRef(ref, `${ip}/$ref`);
      if (rel) files.push({ rel, ptr: `${ip}/$ref` });
    });
    return files;
  };

  const checkSetShape = (obj, ptr, inline) => {
    const allowed = ['description', 'sources', '$extensions'].concat(inline ? ['type', 'name'] : []);
    for (const k of keysOf(obj)) if (!allowed.includes(k)) P.error('D33', F, ptrJoin(ptr, k), null, `a set holds only ${allowed.join(', ')}; not ${q(k)}`);
    if (!Array.isArray(obj.sources)) P.error('D33', F, ptrJoin(ptr, 'sources'), null, 'a set needs a sources array');
    if ('$extensions' in obj && !isObj(obj.$extensions)) P.error('D33', F, ptrJoin(ptr, '$extensions'), null, '$extensions must be an object');
  };
  const setFiles = (name, stack) => {
    const ptr = ptrJoin('/sets', name);
    const s = sets[name];
    if (!isObj(s)) {
      P.error('D33', F, ptr, null, 'a set must be an object');
      return [];
    }
    return sourcesOf(s.sources, ptrJoin(ptr, 'sources'), stack);
  };
  for (const name of keysOf(sets)) if (isObj(sets[name])) checkSetShape(sets[name], ptrJoin('/sets', name), false);
  for (const name of keysOf(sets)) if (!isObj(sets[name])) P.error('D33', F, ptrJoin('/sets', name), null, 'a set must be an object');

  const buildModifier = (name, m, ptr, inline) => {
    const allowed = ['description', 'contexts', 'default', '$extensions'].concat(inline ? ['type', 'name'] : []);
    for (const k of keysOf(m)) if (!allowed.includes(k)) P.error('D33', F, ptrJoin(ptr, k), null, `a modifier holds only ${allowed.join(', ')}; not ${q(k)}`);
    if ('$extensions' in m && !isObj(m.$extensions)) P.error('D33', F, ptrJoin(ptr, '$extensions'), null, '$extensions must be an object');
    const contexts = [];
    if (!isObj(m.contexts) || keysOf(m.contexts).length < 2) {
      P.error('D33', F, ptrJoin(ptr, 'contexts'), null, 'a modifier needs a contexts object with at least 2 contexts');
    }
    const cl = new Map();
    for (const c of isObj(m.contexts) ? keysOf(m.contexts) : []) {
      const cp = ptrJoin(ptr, 'contexts', c);
      if (cl.has(c.toLowerCase())) P.error('D35', F, cp, null, `context names ${q(cl.get(c.toLowerCase()))} and ${q(c)} differ only in case`);
      cl.set(c.toLowerCase(), c);
      if (!Array.isArray(m.contexts[c])) {
        P.error('D33', F, cp, null, 'a context is an array of sources');
        contexts.push({ name: c, files: [] });
        continue;
      }
      contexts.push({ name: c, files: sourcesOf(m.contexts[c], cp, []) });
    }
    let def = null;
    if (!('default' in m)) {
      P.error('D35', F, ptr, null, `modifier ${q(name)} has no default, so a build without inputs cannot resolve it`);
    } else if (typeof m.default !== 'string' || !cl.has(m.default.toLowerCase())) {
      P.error('D33', F, ptrJoin(ptr, 'default'), null, `default ${q(m.default)} is not one of the contexts (${[...cl.values()].join(', ')})`);
    } else def = cl.get(m.default.toLowerCase());
    if (!def && contexts.length) def = contexts[0].name;
    // defaults first, then the rest in source order
    const ordered = contexts.filter((c) => c.name === def).concat(contexts.filter((c) => c.name !== def));
    return { kind: 'modifier', name, contexts: ordered, defaultName: def, ptr };
  };

  const layers = [];
  const listed = new Set();
  const inlineNames = new Set();
  doc.resolutionOrder.forEach((item, idx) => {
    const ptr = `/resolutionOrder/${idx}`;
    if (!isObj(item)) {
      P.error('D34', F, ptr, null, 'a resolutionOrder item is {"$ref": "#/sets/…" | "#/modifiers/…"} or an inline set or modifier');
      return;
    }
    if ('$ref' in item) {
      for (const k of keysOf(item)) if (k !== '$ref') P.error('D34', F, ptrJoin(ptr, k), null, `a reference object holds only $ref, not ${q(k)}`);
      const ref = item.$ref;
      let m;
      if (typeof ref === 'string' && (m = /^#\/(sets|modifiers)\/(.+)$/.exec(ref))) {
        const name = m[2].replace(/~1/g, '/').replace(/~0/g, '~');
        const key = `${m[1]}/${name}`;
        if (listed.has(key)) P.error('D34', F, `${ptr}/$ref`, null, `${q(ref)} is listed twice`);
        listed.add(key);
        if (m[1] === 'sets') {
          if (!(name in sets)) P.error('D34', F, `${ptr}/$ref`, null, `${q(ref)} names no set`);
          else layers.push({ kind: 'set', name, files: setFiles(name, [name]), ptr: ptrJoin('/sets', name) });
        } else if (!(name in mods)) {
          P.error('D34', F, `${ptr}/$ref`, null, `${q(ref)} names no modifier`);
        } else if (!isObj(mods[name])) {
          P.error('D33', F, ptrJoin('/modifiers', name), null, 'a modifier must be an object');
        } else {
          layers.push(buildModifier(name, mods[name], ptrJoin('/modifiers', name), false));
        }
      } else if (typeof ref === 'string' && ref.startsWith('#/resolutionOrder')) {
        P.error('D34', F, `${ptr}/$ref`, null, 'nothing may point at #/resolutionOrder/…');
      } else {
        P.error('D34', F, `${ptr}/$ref`, null, `${q(ref)}: a resolutionOrder reference names #/sets/<name> or #/modifiers/<name>`);
      }
      return;
    }
    const { type, name } = item;
    if (type !== 'set' && type !== 'modifier') {
      P.error('D34', F, ptrJoin(ptr, 'type'), null, 'an inline resolutionOrder item carries type "set" or "modifier"');
      return;
    }
    if (typeof name !== 'string' || !name) {
      P.error('D34', F, ptrJoin(ptr, 'name'), null, 'an inline resolutionOrder item carries a name');
      return;
    }
    const lc = name.toLowerCase();
    if (inlineNames.has(lc) || name in sets || name in mods) P.error('D34', F, ptrJoin(ptr, 'name'), null, `the inline name ${q(name)} is not unique`);
    inlineNames.add(lc);
    if (type === 'set') {
      checkSetShape(item, ptr, true);
      layers.push({ kind: 'set', name, files: sourcesOf(item.sources, ptrJoin(ptr, 'sources'), []), ptr });
    } else {
      layers.push(buildModifier(name, item, ptr, true));
    }
  });
  for (const name of keysOf(mods)) if (!listed.has(`modifiers/${name}`)) {
    P.error('D34', F, ptrJoin('/modifiers', name), null, `modifier ${q(name)} is not in resolutionOrder`);
  }
  return layers;
}

// ---------------------------------------------------------------------------------------------------------------
// The walk of one token file (dtcg-facts §9 items 4-12)

function tierOf(rel, role) {
  if (role === 'context') return 'primitive';
  const base = rel.slice(rel.lastIndexOf('/') + 1);
  if (base === 'primitives.tokens.json') return 'primitive';
  if (base === 'semantic.tokens.json') return 'semantic';
  if (rel.startsWith('tokens/components/')) return 'component';
  return null;
}

function checkTypeName(v, F, ptr, tp, P) {
  if (typeof v !== 'string' || !DTCG_TYPES.includes(v)) {
    const near = typeof v === 'string' ? DTCG_TYPES.find((t) => t.toLowerCase() === v.toLowerCase()) : null;
    P.error('D14', F, ptr, tp, `unknown $type ${q(v)}${near ? `; did you mean ${q(near)}? (exact case)` : ''}`);
    return null;
  }
  if (!ALLOWED_TYPES.includes(v)) {
    P.error('D15', F, ptr, tp, `$type ${q(v)} is not allowed here; allowed: ${ALLOWED_TYPES.join(', ')} (StyleBox fields are separate tokens)`);
    return null;
  }
  return v;
}

function walkFile(fe, P) {
  const F = fe.rel;
  const checkMeta = (obj, ptr, tp) => {
    if ('$description' in obj && typeof obj.$description !== 'string') P.error('D10', F, `${ptr}/$description`, tp, '$description must be a string');
    if ('$deprecated' in obj && typeof obj.$deprecated !== 'boolean' && typeof obj.$deprecated !== 'string') {
      P.error('D10', F, `${ptr}/$deprecated`, tp, '$deprecated must be a boolean or a string');
    }
    let ext = null;
    if ('$extensions' in obj) {
      if (!isObj(obj.$extensions)) P.error('D10', F, `${ptr}/$extensions`, tp, '$extensions must be an object');
      else {
        for (const k of keysOf(obj.$extensions)) {
          if (k !== NS) P.warn('D11', F, ptrJoin(`${ptr}/$extensions`, k), tp, `unknown $extensions key ${q(k)}; this repo uses only ${q(NS)} (kept, not dropped)`);
        }
        if (NS in obj.$extensions) {
          if (isObj(obj.$extensions[NS])) ext = obj.$extensions[NS];
          else P.error('P59', F, ptrJoin(`${ptr}/$extensions`, NS), tp, `${NS} must be an object`);
        }
      }
    }
    return ext;
  };
  const nameProblem = (name, ptr, tp) => {
    if (name === '' || /[{}.]/.test(name)) {
      P.error('D05', F, ptr, tp, `the name ${q(name)} is empty or contains "{", "}" or "."`);
      return true;
    }
    if (!NAME_RE.test(name)) {
      P.error('D06', F, ptr, tp, `the name ${q(name)} is not lower kebab-case (^[a-z0-9]+(-[a-z0-9]+)*$)`);
      return true;
    }
    return false;
  };

  const walk = (obj, segs, ptr, parent) => {
    const tp = segs.join('.');
    const isRoot = segs.length === 0;
    const ext = checkMeta(obj, ptr, tp || null);
    const proposalOwn = !!(ext && 'proposal' in ext);
    if ('$value' in obj && !isRoot) {
      const node = { kind: 'token', name: segs[segs.length - 1], path: tp, segs, file: F, pointer: ptr, fe,
        tier: fe.tier, parent, raw: obj.$value, ownType: obj.$type, description: typeof obj.$description === 'string' ? obj.$description : null,
        ext, ownProposal: proposalOwn && ext.proposal === true, proposalDeclared: proposalOwn,
        proposal: (proposalOwn && ext.proposal === true) || (parent ? parent.proposal : false),
        groupType: parent ? parent.effType : null, groupTypeInvalid: parent ? parent.effTypeInvalid : false };
      for (const k of keysOf(obj)) {
        const kp = ptrJoin(ptr, k);
        if (k.startsWith('$')) {
          if (TOKEN_KEYS.includes(k)) continue;
          if (RESERVED.includes(k)) P.error('D08', F, kp, tp, `a token holds only ${TOKEN_KEYS.join(', ')}; not ${k}`);
          else P.error('D05', F, kp, tp, `names starting with "$" are reserved: ${q(k)}`);
        } else {
          P.error('D07', F, kp, tp, `a token (an object with $value) has no children; move ${q(k)} out or drop $value`);
        }
      }
      return node;
    }
    const node = { kind: 'group', name: isRoot ? '' : segs[segs.length - 1], path: tp, segs, file: F, pointer: ptr, fe,
      tier: fe.tier, parent, isRoot, ownType: obj.$type, description: typeof obj.$description === 'string' ? obj.$description : null,
      ext, ownProposal: proposalOwn && ext.proposal === true, proposalDeclared: proposalOwn,
      proposal: (proposalOwn && ext.proposal === true) || (parent ? parent.proposal : false),
      // $deprecated (a boolean or the reason), inherited by the groups inside unless one sets its own
      deprecated: '$deprecated' in obj && (typeof obj.$deprecated === 'boolean' || typeof obj.$deprecated === 'string')
        ? obj.$deprecated : (parent ? parent.deprecated : false),
      children: [], childMap: new Map() };
    node.effType = parent ? parent.effType : null;
    node.effTypeInvalid = parent ? parent.effTypeInvalid : false;
    if ('$type' in obj) {
      const t = checkTypeName(obj.$type, F, `${ptr}/$type`, tp || null, P);
      node.effType = t;
      node.effTypeInvalid = !t;
    }
    let childCount = 0;
    for (const k of keysOf(obj)) {
      const kp = ptrJoin(ptr, k);
      if (k.startsWith('$')) {
        if (k === '$schema') {
          if (!isRoot) P.error('D04', F, kp, tp, '$schema is allowed only at the root of a file');
          else if (obj.$schema !== FORMAT_SCHEMA) P.error('D04', F, kp, null, `$schema must be ${q(FORMAT_SCHEMA)}`);
          continue;
        }
        if (GROUP_KEYS.includes(k)) continue;
        if (RESERVED.includes(k)) P.error('D08', F, kp, tp || null, `a group holds only ${GROUP_KEYS.join(', ')} and child objects; ${k} is not supported`);
        else P.error('D05', F, kp, tp || null, `names starting with "$" are reserved: ${q(k)}`);
        continue;
      }
      const childSegs = segs.concat(k);
      if (nameProblem(k, kp, childSegs.join('.'))) continue;
      if (!isObj(obj[k])) {
        P.error('D09', F, kp, childSegs.join('.'), `every member of a group is an object (a token or a group); ${q(k)} is ${Array.isArray(obj[k]) ? 'an array' : typeof obj[k]}`);
        continue;
      }
      childCount++;
      const child = walk(obj[k], childSegs, kp, node);
      node.children.push(child);
      node.childMap.set(k, child);
    }
    const inVariant = parent && parent.ext && isObj(parent.ext.godot) && 'variation' in parent.ext.godot;
    if (!isRoot && !inVariant && childCount === 0 && ('$type' in obj || '$description' in obj)) {
      P.warn('D12', F, ptr, tp, 'this looks like an unfinished token: it has $type or $description but no $value and no children');
    }
    return node;
  };
  if (!isObj(fe.doc)) {
    P.error('D09', F, '', null, 'a token file is a JSON object');
    return [];
  }
  fe.rootNode = walk(fe.doc, [], '', null);
  // document order: parents before children
  return orderNodes(fe.rootNode);
}

function orderNodes(rootNode) {
  const out = [];
  const visit = (n) => {
    out.push(n);
    if (n.kind === 'group') n.children.forEach(visit);
  };
  visit(rootNode);
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// Static value checks (dtcg-facts §9 items 13-31, with spec §7.1 changes)

function checkLiteral(type, v, F, ptr, tp, P) {
  const err = (rule, msg) => { P.error(rule, F, ptr, tp, msg); return false; };
  switch (type) {
    case 'color': {
      if (!isObj(v)) return err('D18', 'a colour is {"colorSpace": "srgb", "components": [r, g, b], "alpha"?, "hex": "#rrggbb"}');
      let ok = true;
      for (const k of keysOf(v)) if (!['colorSpace', 'components', 'alpha', 'hex'].includes(k)) ok = err('D18', `unknown colour member ${q(k)}`);
      if (v.colorSpace !== 'srgb') ok = err('D18', `colorSpace must be "srgb", not ${q(v.colorSpace)}`);
      const c = v.components;
      const comps = Array.isArray(c) && c.length === 3 && c.every((x) => typeof x === 'number' && x >= 0 && x <= 1);
      if (!comps) ok = err('D18', 'components must be 3 numbers in [0, 1] ("none" is not allowed)');
      else if (!c.every((x) => Math.abs(x * 10000 - Math.round(x * 10000)) < 1e-6)) ok = err('D18', 'components have at most 4 decimals');
      if ('alpha' in v) {
        if (typeof v.alpha !== 'number' || v.alpha < 0 || v.alpha > 1) ok = err('D18', 'alpha must be a number in [0, 1]');
        else if (v.alpha === 1) ok = err('D18', 'omit alpha when it is 1');
      }
      if (typeof v.hex !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(v.hex)) ok = err('D18', 'hex is required as "#rrggbb"');
      else if (v.hex !== v.hex.toLowerCase()) ok = err('D18', `hex must be lowercase: ${q(v.hex.toLowerCase())}`);
      else if (comps) {
        const want = '#' + c.map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
        if (want !== v.hex) ok = err('D18', `hex ${v.hex} does not match the components (round(c × 255) gives ${want})`);
      }
      return ok;
    }
    case 'dimension': {
      if (!isObj(v) || !('value' in v) || !('unit' in v) || keysOf(v).length !== 2) return err('D19', 'a dimension is {"value": <int>, "unit": "px"} (the unit is required, even for 0)');
      if (v.unit !== 'px') return err('D19', `px only, not ${q(v.unit)}`);
      if (typeof v.value !== 'number' || !Number.isInteger(v.value)) return err('D19', `dimensions are whole px; ${q(v.value)} is not an integer`);
      return true;
    }
    case 'duration': {
      if (!isObj(v) || !('value' in v) || !('unit' in v) || keysOf(v).length !== 2) return err('D20', 'a duration is {"value": <int ≥ 0>, "unit": "ms"}');
      if (v.unit !== 'ms') return err('D20', `ms only, not ${q(v.unit)}`);
      if (typeof v.value !== 'number' || !Number.isInteger(v.value) || v.value < 0) return err('D20', `a duration is an integer ≥ 0 ms, not ${q(v.value)}`);
      return true;
    }
    case 'cubicBezier': {
      if (Array.isArray(v) && v.some((x) => hasBraces(x))) return err('D30', 'no references inside arrays');
      if (!Array.isArray(v) || v.length !== 4 || !v.every((x) => typeof x === 'number' && Number.isFinite(x))) return err('D21', 'a cubicBezier is 4 numbers [x1, y1, x2, y2]');
      if (v[0] < 0 || v[0] > 1 || v[2] < 0 || v[2] > 1) return err('D21', 'x1 and x2 must be in [0, 1]');
      return true;
    }
    case 'number':
      if (typeof v !== 'number' || !Number.isFinite(v)) return err('D22', `a number token holds a JSON number, not ${q(v)}`);
      return true;
    case 'fontFamily':
      if (Array.isArray(v)) {
        if (v.some((x) => hasBraces(x))) return err('D30', 'no references inside arrays');
        return err('D23', 'one font family string, not a stack');
      }
      if (typeof v !== 'string' || !v) return err('D23', 'a fontFamily is a non-empty string');
      if (!LICENSED_FONTS.includes(v)) return err('D23', `${q(v)} has no licence recorded in this repo (allowed: ${LICENSED_FONTS.join(', ')})`);
      return true;
    case 'fontWeight':
      if (typeof v !== 'number' || !Number.isInteger(v) || v < 1 || v > 1000) return err('D24', `a fontWeight is an integer 1..1000 (no named weights), not ${q(v)}`);
      return true;
    case 'typography':
    case 'transition': {
      const subs = COMPOSITES[type];
      if (!isObj(v)) return err('D16', `a ${type} is an object with exactly ${subs.map((s) => s[0]).join(', ')}`);
      let ok = true;
      for (const k of keysOf(v)) if (!subs.some((s) => s[0] === k)) ok = err('D16', `a ${type} has no member ${q(k)}`);
      for (const [k, st] of subs) {
        const sp = ptrJoin(ptr, k);
        if (!(k in v)) { ok = err('D16', `a ${type} needs ${q(k)}`); continue; }
        const sv = v[k];
        if (isAlias(sv)) {
          if (!validAliasPath(aliasPath(sv))) { P.error('D27', F, sp, tp, `malformed reference ${q(sv)}`); ok = false; }
        } else if (hasBraces(sv)) {
          P.error('D27', F, sp, tp, `a reference is a whole string "{a.b.c}"; no interpolation: ${q(sv)}`);
          ok = false;
        } else if (!checkLiteral(st, sv, F, sp, tp, P)) ok = false;
      }
      return ok;
    }
    default:
      return false;
  }
}

function containsAlias(raw) {
  if (typeof raw === 'string') return hasBraces(raw);
  if (Array.isArray(raw)) return raw.some(containsAlias);
  if (isObj(raw)) return Object.keys(raw).some((k) => containsAlias(raw[k]));
  return false;
}

function checkTokenStatic(node, P) {
  const F = node.file;
  const tp = node.path;
  const vptr = `${node.pointer}/$value`;
  node.ownTypeValid = null;
  if (node.ownType !== undefined) node.ownTypeValid = checkTypeName(node.ownType, F, `${node.pointer}/$type`, tp, P);
  node.alias = null;
  node.literalOk = false;
  const raw = node.raw;
  if (isAlias(raw)) {
    if (validAliasPath(aliasPath(raw))) node.alias = aliasPath(raw);
    else P.error('D27', F, vptr, tp, `malformed reference ${q(raw)}`);
  } else if (hasBraces(raw)) {
    P.error('D27', F, vptr, tp, `a reference is a whole string "{a.b.c}"; no interpolation or maths: ${q(raw)}`);
  } else {
    const t = node.ownTypeValid || node.groupType;
    if (!t) {
      if (node.ownType === undefined && !node.groupTypeInvalid) P.error('D13', F, node.pointer, tp, 'no type: set $type on the token or on a parent group (types are never inferred from values)');
    } else {
      node.literalOk = checkLiteral(t, raw, F, vptr, tp, P);
    }
  }
  // sub-value aliases of a composite literal
  node.subAliases = null;
  const st = node.ownTypeValid || node.groupType;
  if (!node.alias && COMPOSITES[st] && isObj(raw)) {
    node.subAliases = new Map();
    for (const [k, sub] of COMPOSITES[st]) if (isAlias(raw[k]) && validAliasPath(aliasPath(raw[k]))) node.subAliases.set(k, { path: aliasPath(raw[k]), type: sub });
  }
  if (node.tier === 'component' && node.ownType === undefined && !(node.parent && ['press', 'size'].includes(node.parent.name))) {
    P.error('D17', F, node.pointer, tp, 'component tokens carry their own $type (only members of press and size groups take the group\'s)');
  }
  if (node.tier === 'primitive' && containsAlias(raw)) {
    P.error('D31', F, vptr, tp, `${node.fe.role === 'context' ? 'modifier files' : 'primitives'} hold literals only, not references`);
  }
  if (node.tier === 'semantic' && !node.alias) {
    const t = node.ownTypeValid || node.groupType;
    if (COMPOSITES[t] && isObj(raw)) {
      for (const [k] of COMPOSITES[t]) {
        if (k in raw && !isAlias(raw[k])) P.error('D31', F, ptrJoin(vptr, k), tp, `semantic tokens alias primitives only: ${k} must be a reference`);
      }
    } else if (!hasBraces(raw)) {
      P.error('D31', F, vptr, tp, 'semantic tokens are references to primitives, not literals');
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Loading: resolver, files, walks, merges (D36, D37) and the permutation list

function loadModel(root, P) {
  const rdoc = readJson(root, RESOLVER_FILE, P, 'D34');
  if (!rdoc) return null;
  const layers = readResolver(rdoc.value, root, P);
  if (!layers) return null;
  const files = new Map();
  const use = (rel, role, layer, context) => {
    if (!files.has(rel)) files.set(rel, { rel, uses: [] });
    files.get(rel).uses.push({ role, layer: layer.name, context: context || null });
  };
  for (const L of layers) {
    if (L.kind === 'set') L.files.forEach((f) => use(f.rel, 'set', L));
    else L.contexts.forEach((c) => c.files.forEach((f) => use(f.rel, 'context', L, c.name)));
  }
  // D37: a file belongs to the base set or to one modifier context
  for (const fe of files.values()) {
    const kinds = new Set(fe.uses.map((u) => (u.role === 'set' ? 'set' : `${u.layer}/${u.context}`)));
    if (kinds.size > 1) P.error('D37', RESOLVER_FILE, '', null, `${fe.rel} is used by more than one of: ${[...kinds].join(', ')}`);
    fe.role = fe.uses[0].role;
    fe.modifier = fe.role === 'context' ? fe.uses[0].layer : null;
    fe.context = fe.role === 'context' ? fe.uses[0].context : null;
  }
  // D03: orphans
  for (const rel of listTokenFiles(root)) {
    if (!files.has(rel)) P.error('D03', rel, '', null, 'this token file is not reachable from tokens/prime.resolver.json');
  }
  // parse and walk
  const allNodes = [];
  let unreadable = false;
  for (const fe of files.values()) {
    const r = readJson(root, fe.rel, P, 'D34');
    fe.text = r ? r.text : null;
    fe.doc = r ? r.value : null;
    fe.tier = tierOf(fe.rel, fe.role);
    fe.nodes = [];
    if (!r) { unreadable = true; continue; }
    if (!fe.tier) {
      P.error('D31', fe.rel, '', null, 'a base-set file is primitives.tokens.json, semantic.tokens.json or components/<name>.tokens.json; this one has no tier');
      fe.tier = 'semantic';
    }
    fe.nodes = walkFile(fe, P);
    allNodes.push(...fe.nodes);
  }
  for (const n of allNodes) if (n.kind === 'token') checkTokenStatic(n, P);
  // a file that does not parse stops the build here: its tokens would only cause follow-on errors
  if (unreadable) return null;

  // D36 within a layer, D37 across layers
  const layerPaths = new Map(); // layer key -> Map(path -> node)
  const modOwned = new Map(); // path -> modifier name
  for (const L of layers) {
    if (L.kind === 'set') {
      const key = 'set';
      if (!layerPaths.has(key)) layerPaths.set(key, new Map());
      collectLayer(L.files.map((f) => files.get(f.rel)), layerPaths.get(key), P);
    } else {
      const ctxPaths = L.contexts.map((c) => {
        const m = new Map();
        collectLayer(c.files.map((f) => files.get(f.rel)), m, P);
        return { c, m };
      });
      const def = ctxPaths[0];
      for (const { c, m } of ctxPaths.slice(1)) {
        for (const [p, n] of m) if (!def.m.has(p)) P.error('D37', n.file, n.pointer, p, `context ${q(c.name)} of ${q(L.name)} defines ${p}, which context ${q(def.c.name)} does not (all contexts define the same paths)`);
        for (const [p, n] of def.m) if (!m.has(p)) {
          const f = c.files[0] ? c.files[0].rel : RESOLVER_FILE;
          P.error('D37', f, '', p, `context ${q(c.name)} of ${q(L.name)} lacks ${p}, which context ${q(def.c.name)} defines (${n.file})`);
        }
      }
      for (const { m } of ctxPaths) {
        for (const [p, n] of m) {
          if (modOwned.has(p) && modOwned.get(p) !== L.name) P.error('D37', n.file, n.pointer, p, `${p} is defined by two modifiers (${modOwned.get(p)}, ${L.name})`);
          else modOwned.set(p, L.name);
        }
      }
    }
  }
  const basePaths = layerPaths.get('set') || new Map();
  for (const [p, n] of basePaths) if (modOwned.has(p)) P.error('D37', n.file, n.pointer, p, `the base set defines ${p}, which modifier ${q(modOwned.get(p))} owns`);

  // permutations: defaults first, the first modifier varying fastest
  const modifiers = layers.filter((L) => L.kind === 'modifier');
  const perms = [];
  const counts = modifiers.map((m) => Math.max(1, m.contexts.length));
  const total = counts.reduce((a, b) => a * b, 1);
  for (let k = 0; k < total; k++) {
    let rest = k;
    const choice = new Map();
    modifiers.forEach((m, i) => {
      const idx = rest % counts[i];
      rest = Math.floor(rest / counts[i]);
      choice.set(m.name, m.contexts[idx] ? m.contexts[idx].name : null);
    });
    const inputs = {};
    for (const m of modifiers) inputs[m.name] = choice.get(m.name);
    const fileOrder = [];
    for (const L of layers) {
      const list = L.kind === 'set' ? L.files : ((L.contexts.find((c) => c.name === choice.get(L.name)) || { files: [] }).files);
      for (const f of list) if (!fileOrder.includes(f.rel)) fileOrder.push(f.rel);
    }
    const perm = { index: k, inputs, label: modifiers.map((m) => `${m.name}=${choice.get(m.name)}`).join(', ') || 'default',
      files: fileOrder, fileSet: new Set(fileOrder), tokens: new Map(), groups: new Map() };
    for (const rel of fileOrder) {
      const fe = files.get(rel);
      for (const n of fe.nodes) {
        if (n.kind === 'group') {
          if (!n.isRoot) {
            if (!perm.groups.has(n.path)) perm.groups.set(n.path, []);
            perm.groups.get(n.path).push(n);
          }
        } else perm.tokens.set(n.path, n);
      }
    }
    perms.push(perm);
  }
  // token/group clashes (D36), checked on every permutation
  for (const perm of perms) {
    for (const [p, n] of perm.tokens) {
      if (perm.groups.has(p)) {
        const g = perm.groups.get(p)[0];
        P.error('D36', n.file, n.pointer, p, `${p} is a token here and a group in ${g.file}; a path is either a token or a group`);
      }
    }
  }
  return { root, resolverText: rdoc.text, files, layers, modifiers: modifiers.map((m) => ({ name: m.name, contexts: m.contexts.map((c) => c.name), default: m.defaultName,
    files: Object.fromEntries(m.contexts.map((c) => [c.name, c.files.map((f) => f.rel)])) })), permutations: perms, nodes: allNodes };
}

function collectLayer(fileEntries, map, P) {
  for (const fe of fileEntries) {
    if (!fe || !fe.nodes) continue;
    for (const n of fe.nodes) {
      if (n.kind !== 'token') continue;
      if (map.has(n.path)) {
        const prev = map.get(n.path);
        if (prev !== n) P.error('D36', n.file, n.pointer, n.path, `${n.path} is already defined in ${prev.file}; a later source would replace it whole, so define it once`);
        continue;
      }
      map.set(n.path, n);
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Per-permutation resolution (dtcg-facts §9 items 13, 17, 27-29, 31; spec §7.3 value objects)

function godotOf(node) {
  const g = node && node.ext && isObj(node.ext.godot) ? node.ext.godot : null;
  if (!g || !(g.trans in GODOT_TRANS) || !(g.ease in GODOT_EASE)) return null;
  return { trans: g.trans, transValue: GODOT_TRANS[g.trans], ease: g.ease, easeValue: GODOT_EASE[g.ease] };
}

function resolvePermutation(model, perm, P) {
  const tokens = perm.tokens;
  const typeMemo = new Map();
  const valueMemo = new Map();
  const inCycle = new Set();
  const edges = (n) => {
    const out = [];
    if (n.alias) out.push(n.alias);
    if (n.subAliases) for (const s of n.subAliases.values()) out.push(s.path);
    return out;
  };
  // D27: targets exist and are tokens
  for (const [p, n] of tokens) {
    const check = (target, ptr) => {
      if (tokens.has(target)) return;
      const what = perm.groups.has(target) ? `{${target}} names a group, not a token` : `{${target}} names no token`;
      P.error('D27', n.file, ptr, p, what);
    };
    if (n.alias) check(n.alias, `${n.pointer}/$value`);
    if (n.subAliases) for (const [k, s] of n.subAliases) check(s.path, ptrJoin(`${n.pointer}/$value`, k));
  }
  // D28: cycles
  const state = new Map();
  const stack = [];
  const visit = (p) => {
    state.set(p, 1);
    stack.push(p);
    for (const t of edges(tokens.get(p))) {
      if (!tokens.has(t)) continue;
      if (state.get(t) === 1) {
        const cyc = stack.slice(stack.indexOf(t));
        const text = cyc.concat(t).join(' -> ');
        for (const c of cyc) {
          inCycle.add(c);
          const cn = tokens.get(c);
          P.error('D28', cn.file, `${cn.pointer}/$value`, c, `reference cycle: ${text}`);
        }
      } else if (!state.has(t)) visit(t);
    }
    stack.pop();
    state.set(p, 2);
  };
  for (const p of tokens.keys()) if (!state.has(p)) visit(p);

  const typeOf = (p, seen) => {
    if (typeMemo.has(p)) return typeMemo.get(p);
    const n = tokens.get(p);
    if (!n) return null;
    let t = n.ownTypeValid;
    if (!t && n.ownType !== undefined) { typeMemo.set(p, null); return null; }
    if (!t && n.alias && tokens.has(n.alias) && !inCycle.has(p)) {
      const s = seen || new Set();
      if (!s.has(p)) { s.add(p); t = typeOf(n.alias, s); }
    }
    if (!t) t = n.groupType || null;
    typeMemo.set(p, t);
    return t;
  };
  // D13, D17, D29, D31 on references
  for (const [p, n] of tokens) {
    if (n.alias && tokens.has(n.alias) && !inCycle.has(p)) {
      const tt = typeOf(n.alias);
      const target = tokens.get(n.alias);
      if (n.ownTypeValid && tt && n.ownTypeValid !== tt) P.error('D29', n.file, `${n.pointer}/$value`, p, `$type is ${n.ownTypeValid} but {${n.alias}} is ${tt}`);
      else if (!n.ownTypeValid && n.ownType === undefined && n.groupType && tt && n.groupType !== tt) {
        P.error('D17', n.file, `${n.pointer}/$value`, p, `the group $type is ${n.groupType} but {${n.alias}} is ${tt}`);
      }
      if (!typeOf(p) && n.ownType === undefined && !n.groupTypeInvalid) P.error('D13', n.file, n.pointer, p, 'no type: neither the token, its reference nor a parent group gives one');
      if (n.tier === 'semantic' && target.tier !== 'primitive') P.error('D31', n.file, `${n.pointer}/$value`, p, `semantic tokens alias primitives only; {${n.alias}} is ${target.tier}`);
    }
    if (n.subAliases) {
      for (const [k, s] of n.subAliases) {
        if (!tokens.has(s.path)) continue;
        const tt = typeOf(s.path);
        if (tt && tt !== s.type) P.error('D29', n.file, ptrJoin(`${n.pointer}/$value`, k), p, `${k} needs a ${s.type} but {${s.path}} is ${tt}`);
        const target = tokens.get(s.path);
        if (n.tier === 'semantic' && target.tier !== 'primitive') P.error('D31', n.file, ptrJoin(`${n.pointer}/$value`, k), p, `semantic tokens alias primitives only; {${s.path}} is ${target.tier}`);
      }
    }
  }

  const literalPack = (type, raw, node) => {
    switch (type) {
      case 'color': return { type, hex: raw.hex.toLowerCase(), rgba: raw.components.map(round4).concat(round4('alpha' in raw ? raw.alpha : 1)) };
      case 'dimension': return { type, px: raw.value };
      case 'duration': return { type, ms: raw.value };
      case 'cubicBezier': return { type, points: raw.slice(), godot: godotOf(node) };
      case 'number': case 'fontFamily': case 'fontWeight': return { type, value: raw };
      default: return null;
    }
  };
  const subValue = (node, k, st) => {
    const raw = node.raw[k];
    if (isAlias(raw)) {
      const t = aliasPath(raw);
      if (!tokens.has(t) || typeOf(t) !== st) return null;
      return valueOf(t);
    }
    return literalPack(st, raw, null);
  };
  const valueOf = (p) => {
    if (valueMemo.has(p)) return valueMemo.get(p);
    valueMemo.set(p, null);
    const n = tokens.get(p);
    let v = null;
    const t = n ? typeOf(p) : null;
    if (n && t && !inCycle.has(p)) {
      if (n.alias) {
        if (tokens.has(n.alias) && typeOf(n.alias) === t) v = valueOf(n.alias);
      } else if (n.literalOk) {
        if (t === 'typography') {
          const s = Object.fromEntries(COMPOSITES.typography.map(([k, st]) => [k, subValue(n, k, st)]));
          if (Object.values(s).every(Boolean)) {
            v = { type: t, fontFamily: s.fontFamily.value, fontSizePx: s.fontSize.px, fontWeight: s.fontWeight.value,
              letterSpacingPx: s.letterSpacing.px, lineHeight: s.lineHeight.value };
          }
        } else if (t === 'transition') {
          const s = Object.fromEntries(COMPOSITES.transition.map(([k, st]) => [k, subValue(n, k, st)]));
          if (Object.values(s).every(Boolean)) {
            v = { type: t, durationMs: s.duration.ms, delayMs: s.delay.ms, points: s.timingFunction.points.slice(), godot: s.timingFunction.godot };
          }
        } else v = literalPack(t, n.raw, n);
      }
    }
    valueMemo.set(p, v);
    return v;
  };
  const terminalOf = (p) => {
    const seen = new Set();
    let cur = p;
    while (tokens.has(cur) && tokens.get(cur).alias && !seen.has(cur)) {
      seen.add(cur);
      cur = tokens.get(cur).alias;
    }
    return tokens.has(cur) && !tokens.get(cur).alias ? cur : null;
  };
  for (const p of tokens.keys()) valueOf(p);
  return { perm, tokens, typeOf, valueOf, terminalOf, inCycle };
}

// ---------------------------------------------------------------------------------------------------------------
// Small helpers shared by the emitters

function packEqual(a, b) {
  const strip = (v) => {
    if (!v) return v;
    const { from, proposal, ...rest } = v; // eslint-disable-line no-unused-vars
    return rest;
  };
  return JSON.stringify(strip(a)) === JSON.stringify(strip(b));
}

module.exports = {
  NS, FORMAT_SCHEMA, RESOLVER_SCHEMA, RESOLVER_FILE, ALLOWED_TYPES, COMPOSITES, GODOT_TRANS, GODOT_EASE, LICENSED_FONTS,
  Problems, formatProblem, sortProblems, loadModel, resolvePermutation, isObj, isAlias, aliasPath, cssVar, ptrJoin,
  keysOf, packEqual,
};
