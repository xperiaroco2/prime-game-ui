// Compact JSON in the screens' hand style: a node with children spans lines, a leaf node is one line.
function one(v) {
  if (Array.isArray(v)) return v.length ? `[${v.map(one).join(', ')}]` : '[]';
  if (v && typeof v === 'object') { const e = Object.entries(v); return e.length ? `{ ${e.map(([k, x]) => `${JSON.stringify(k)}: ${one(x)}`).join(', ')} }` : '{}'; }
  return JSON.stringify(v);
}
function node(n, ind) {
  const pad = ' '.repeat(ind);
  if (!n.children || !n.children.length) return pad + one(n);
  const { children, ...rest } = n;
  const head = Object.entries(rest).map(([k, x]) => `${JSON.stringify(k)}: ${one(x)}`).join(', ');
  return `${pad}{\n${pad}  ${head},\n${pad}  "children": [\n${children.map((c) => node(c, ind + 4)).join(',\n')}\n${pad}  ]\n${pad}}`;
}
function find(list, path) {
  for (const n of list) if (n.name === path[0]) return path.length === 1 ? n : find(n.children || [], path.slice(1));
  return null;
}
// Replace the "children": [...] array of the node at `path` in the file text, keeping the rest of the text as it is.
function spliceChildren(text, path, children, ind) {
  // find the node's "name" line by walking names in order
  let pos = 0;
  for (const name of path) { const i = text.indexOf(`"name": "${name}"`, pos); if (i < 0) throw new Error('no ' + name); pos = i; }
  const c = text.indexOf('"children": [', pos);
  // bracket match
  let i = c + '"children": ['.length - 1, depth = 0, inStr = false;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (inStr) { if (ch === String.fromCharCode(92)) i++; else if (ch === '"') inStr = false; continue; }
    if (ch === '"') inStr = true; else if (ch === '[' || ch === '{') depth++; else if (ch === ']' || ch === '}') { depth--; if (depth === 0) break; }
  }
  const pad = ' '.repeat(ind);
  const body = `"children": [\n${children.map((n) => node(n, ind + 2)).join(',\n')}\n${pad}]`;
  return text.slice(0, c) + body + text.slice(i + 1);
}
module.exports = { one, node, find, spliceChildren };
