// The pack emitter (spec §9.1): dist/pack/toy.pack.json, schema 1. packTokens() builds the flat token map of one
// permutation (spec §7.3 value objects, the "What tokens holds" list); computeModes() keeps per non-default context
// exactly the keys that differ and verifies that every permutation is the defaults plus its contexts' overrides.
// Node 20, no packages.
'use strict';

const crypto = require('crypto');
const R = require('./resolve.js');
const { PRESS_MEMBERS } = require('./expand.js');

function withMeta(value, from, proposal) {
  const out = Object.assign({}, value);
  if (from) out.from = from;
  if (proposal) out.proposal = true;
  return out;
}

function packTokens(result) {
  const { res, variants } = result;
  const out = new Map();
  for (const [p, n] of res.tokens) {
    if (n.tier === 'component') continue;
    const v = res.valueOf(p);
    if (v) out.set(p, withMeta(v, n.alias, n.proposal));
  }
  for (const v of variants) {
    // non-StyleBox component tokens: from = the alias target, or the authored token an inherited value came from
    const add = (p, field) => {
      if (!field || !field.value) return;
      const node = field.source ? res.tokens.get(field.source) : null;
      const from = field.source === p ? (node && node.alias) || null : field.source;
      out.set(p, withMeta(field.value, from, node ? node.proposal : false));
    };
    if (v.label) add(`${v.prefix}.label`, v.label);
    if (v.motion) add(`${v.prefix}.motion`, v.motion);
    if (v.press) for (const m of PRESS_MEMBERS) add(`${v.prefix}.press.${m}`, v.press[m]);
    for (const [k, f] of Object.entries(v.items)) add(`${v.prefix}.items.${k}`, f);
    for (const [k, f] of Object.entries(v.size)) add(`${v.prefix}.size.${k}`, f);
    if (v.ramp) for (const k of ['full', 'empty', 'steps']) add(`${v.prefix}.ramp.${k}`, v.ramp[k]);
    // complete StyleBox states: from = the authored token each field came from
    for (const st of Object.keys(v.states)) {
      const rec = v.states[st];
      for (const field of Object.keys(rec)) {
        const f = rec[field];
        if (!f || !f.value) continue;
        const node = f.source ? res.tokens.get(f.source) : null;
        out.set(`${v.prefix}.${st}.${field}`, withMeta(f.value, f.source, v.stateProposal[st] || (node ? node.proposal : false)));
      }
    }
    for (const s of v.stops) out.set(s.path, { type: 'color', hex: s.hex, rgba: s.rgba });
  }
  return out;
}

// The permutation result where modifier `name` takes `ctx` and every other modifier its default.
function resultFor(model, results, name, ctx) {
  return results.find((r) => model.modifiers.every((m) => r.perm.inputs[m.name] === (m.name === name ? ctx : m.default)));
}

function computeModes(model, results, P) {
  const def = results[0].packTokens;
  const modes = {};
  const overrides = new Map(); // `${mod}/${ctx}` -> Map
  for (const m of model.modifiers) {
    modes[m.name] = {};
    for (const ctx of m.contexts) {
      if (ctx === m.default) continue;
      const r = resultFor(model, results, m.name, ctx);
      const diff = new Map();
      if (r) for (const [p, v] of r.packTokens) if (!R.packEqual(v, def.get(p))) diff.set(p, v);
      modes[m.name][ctx] = diff;
      overrides.set(`${m.name}/${ctx}`, diff);
    }
  }
  // every permutation = defaults + each chosen context's overrides
  for (const r of results.slice(1)) {
    const expect = new Map(def);
    for (const m of model.modifiers) {
      const ctx = r.perm.inputs[m.name];
      if (ctx === m.default) continue;
      for (const [p, v] of overrides.get(`${m.name}/${ctx}`) || []) expect.set(p, v);
    }
    const bad = [];
    for (const [p, v] of r.packTokens) if (!R.packEqual(v, expect.get(p))) bad.push(p);
    for (const p of expect.keys()) if (!r.packTokens.has(p)) bad.push(p);
    if (bad.length) {
      P.error('D37', R.RESOLVER_FILE, '', bad[0], `the permutation ${r.perm.label} is not the defaults plus each chosen context's overrides (${bad.length} key(s), first ${bad[0]}): the modifiers are not orthogonal`);
    }
  }
  return modes;
}

function tokensSha256(model) {
  const h = crypto.createHash('sha256');
  const items = [[R.RESOLVER_FILE, model.resolverText]];
  for (const fe of model.files.values()) items.push([fe.rel, fe.text || '']);
  items.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  for (const [rel, text] of items) {
    h.update(`${rel}\n`);
    h.update(text.replace(/\r\n/g, '\n'));
    h.update('\n');
  }
  return h.digest('hex');
}

const sortedObject = (map) => {
  const out = {};
  for (const k of [...map.keys()].sort()) out[k] = map.get(k);
  return out;
};

// A variation's optional members (schema 1, present only where they apply):
//   textures    { "<theme icon, kebab-case>": "<pack path of an assets entry>" } (godot.textures, P61)
//   deprecated  { "replacement": "<variation>" | null, "note": "<the $deprecated text>" | null } (`$deprecated`, godot.replacement, P62)
function buildPack(model, results, modes, version, assets) {
  const r0 = results[0];
  const variations = new Map();
  for (const v of r0.variants) {
    if (!v.variation || variations.has(v.variation)) continue;
    const out = { class: v.class, parent: v.parent, prefix: v.prefix, context: v.context, abstract: v.abstract,
      styleboxes: v.styleboxes, empty: v.empty, base: v.base, toggle: v.toggle, on: v.on, proposal: v.proposal };
    if (v.textures && Object.keys(v.textures).length) out.textures = v.textures;
    if (v.deprecated) out.deprecated = v.deprecated;
    variations.set(v.variation, out);
  }
  const proposals = new Set();
  for (const n of model.nodes) if (n.ownProposal && n.path) proposals.add(n.path);
  const derived = [];
  for (const v of r0.variants) for (const s of v.stops) derived.push(s.path);
  const modesOut = {};
  for (const m of model.modifiers) {
    modesOut[m.name] = {};
    for (const ctx of Object.keys(modes[m.name])) modesOut[m.name][ctx] = sortedObject(modes[m.name][ctx]);
  }
  return {
    format: 'prime-game-ui/pack',
    schema: 1,
    version,
    style: 'toy',
    dtcg: '2025.10',
    reference: { width: 1920, height: 1080 },
    source: { repo: 'xperiaroco2/prime-game-ui', resolver: R.RESOLVER_FILE, tokens_sha256: tokensSha256(model) },
    modifiers: Object.fromEntries(model.modifiers.map((m) => [m.name, { contexts: m.contexts, default: m.default }])),
    tokens: sortedObject(r0.packTokens),
    modes: modesOut,
    variations: sortedObject(variations),
    derived: derived.sort(),
    proposals: [...proposals].sort(),
    assets: assets || [],
  };
}

// Pretty at the top, one line per token, mode entry, variation and asset: readable diffs, deterministic bytes.
function serializePack(pack) {
  const S = JSON.stringify;
  const block = (obj, indent) => {
    const keys = Object.keys(obj);
    if (!keys.length) return '{}';
    return `{\n${keys.map((k) => `${indent}  ${S(k)}: ${S(obj[k])}`).join(',\n')}\n${indent}}`;
  };
  const list = (arr, indent) => (arr.length ? `[\n${arr.map((x) => `${indent}  ${S(x)}`).join(',\n')}\n${indent}]` : '[]');
  const parts = [];
  for (const k of Object.keys(pack)) {
    const v = pack[k];
    let text;
    if (k === 'tokens' || k === 'variations') text = block(v, '  ');
    else if (k === 'derived' || k === 'proposals' || k === 'assets') text = list(v, '  ');
    else if (k === 'modes') {
      const mods = Object.keys(v);
      text = mods.length ? `{\n${mods.map((m) => {
        const ctxs = Object.keys(v[m]);
        const inner = ctxs.length ? `{\n${ctxs.map((c) => `      ${S(c)}: ${block(v[m][c], '      ')}`).join(',\n')}\n    }` : '{}';
        return `    ${S(m)}: ${inner}`;
      }).join(',\n')}\n  }` : '{}';
    } else text = S(v);
    parts.push(`  ${S(k)}: ${text}`);
  }
  return `{\n${parts.join(',\n')}\n}\n`;
}

module.exports = { packTokens, computeModes, buildPack, serializePack, tokensSha256, resultFor };
