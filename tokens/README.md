# Toy design tokens

The single source of truth for the Toy look ([DTCG 2025.10](https://www.designtokens.org/tr/2025.10/)). The showcase CSS
and the game's Godot theme are both generated from these files, never copied by hand. The full contract is the build
spec, [`docs/research/2026-10-03-tokens/spec.md`](../docs/research/2026-10-03-tokens/spec.md) (§2 to §6).

## Files

| File | What it holds |
|---|---|
| `prime.resolver.json` | The resolver: one base set (the files below, in order) and two modifiers, `textSize` and `motion` |
| `primitives.tokens.json` | Literals: the palette, font family, weights, letter spacing, line height, `ease.press`, `duration.none`, `focus.*`, `stroke.*`, `radius.*` |
| `semantic.tokens.json` | Aliases of primitives: colour roles by context (`color.*`), the 14 type roles (`type.*`), `motion.press` |
| `components/<name>.tokens.json` | 20 files, 95 Godot type variations: one variant group per variation, with its StyleBox states, `label`, `press`, `size`, `items`, `ramp` |
| `text-size/default.tokens.json`, `text-size/large.tokens.json` | `font.size.*` for the player's text size setting |
| `motion/default.tokens.json`, `motion/reduced.tokens.json` | `duration.press` for the reduced-motion setting |
| `release.json` | The semver the next `ui-<semver>` tag carries |
| `gates.json` | Contrast pairs, surfaces and waivers for `tools/contrast/gates.js` (not a DTCG file) |

## Tiers

1. **Primitive**: literals only. The modifier files are primitives owned by one modifier.
2. **Semantic**: aliases of primitives only (`{palette.ink}`), composite sub-values included.
3. **Component**: one group per variation, marked by `$extensions` `io.github.xperiaroco2.prime-game` `godot.variation`.
   Colours alias down to `palette.*`; dimensions are int px literals or aliases to `stroke.*`, `radius.*`, `focus.*`.
   The build completes each state to the 19 `StyleBoxFlat` fields (spec §3.5), so the pack needs no inheritance logic.

Lengths are int px at the 1920×1080 reference frame.

## Editing a value

- A colour used everywhere: change the primitive in `primitives.tokens.json` (keep `components`, `hex` and `alpha` in
  agreement: components are `round(byte / 255, 4)`).
- A role (what "muted text on dark" is): change the alias in `semantic.tokens.json`.
- One control: change its token in `components/<name>.tokens.json`. Follow the compact authoring form of spec §3.5
  (shorthand when all sides are equal, `-block` / `-inline` for an equal axis, zero expand sides omitted); the validator
  enforces it.
- Then rebuild and commit `tokens/` and `dist/` together:

```sh
node tools/tokens/build.js          # validate, then write dist/css/toy-tokens.css and dist/pack/toy.pack.json
node tools/tokens/build.js --check  # fail if dist/ is stale (CI runs this)
node tools/tokens/test/run.js       # validator self-test and the spec's spot values
node tools/check.js                 # every check: tokens, lint, contrast gates, showcase
```

Every error names the rule (D01–D39, P40–P60, or B01 for `release.json`) and the file; where the file parses it also
gives the line and column, the JSON Pointer and the token path.

## Proposal marks

`"$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } }` with a `$description` marks a value the
engineer has not approved: a state the Toy mock-up never drew (disabled, focus, hover on flat controls), the large text
sizes, the danger button. A mark on a group covers everything in it. The pack lists every mark under `proposals`, and the
showcase puts a proposal badge on each. When a proposal is approved, remove its mark (keep the description) and rebuild.

## Releases

`release.json` holds the version; the pack copies it. A release is the git tag `ui-<version>` on `main`, and
`node tools/check.js --release ui-X.Y.Z` checks that the tag, `release.json` and the pack agree and that the bump is big
enough against the previous `ui-*` tag's pack:

- **major**: a token path or variation removed, renamed or retyped, or the pack `schema` bumped;
- **minor**: one added;
- **patch**: only values changed.

The PR is merged once CI is green and the merge commit is tagged (by the agent, under the trust rules in
`CLAUDE.md`); prime-game then copies `dist/pack/` at that tag byte for byte and
records the tag and commit in its lock file (spec §9.3).
