# Token architecture B: DTCG and pages first

Design for [prime-game-ui#5](https://github.com/xperiaroco2/prime-game-ui/issues/5), 2026-10-03: DTCG design tokens and
components for the chosen style Toy ([`docs/ui-decisions.md`](../../ui-decisions.md), Style). Architect B's angle: a
clean primitive → semantic → component system that is valid DTCG 2025.10, pleasant to write by hand, with the dark and
light contexts as semantic sets, as few component tokens as possible, and an elegant CSS output for the pages. Godot
fidelity is a hard limit: nothing below asks `StyleBoxFlat` for something it cannot draw.

**Inputs.** [godot-facts.md](godot-facts.md), [dtcg-facts.md](dtcg-facts.md), [inventory.md](inventory.md) with
[inventory.json](inventory.json), [`toy.css`](../../../pages/styles/toy.css),
[`motion-preview.css`](../../../pages/styles/motion-preview.css),
[`check_styles.js`](../../../pages/styles/check_styles.js),
[`build-styles-page.js`](../../../pages/styles/build-styles-page.js),
[lens 3](../2026-10-02-wave-1/lens-3-system.md), [lens 6](../2026-10-02-wave-1/lens-6-a11y.md) (§4).

**Facts I checked for this document**, beyond the ground work (throwaway files in the session's temp folder only):
1. **Local headless Edge** (`msedge.exe --headless=new --dump-dom`, a throwaway page, 2026-10-03):
   - `--px: calc(1cqw / 19.2)` and a token `--t: calc(18 * var(--px))`, both declared on `:root`, computed to **9px** on an
     element inside a 960 px wide `container-type: inline-size` frame. A custom property keeps `cqw` as text and only
     substitutes `var()`, so the unit resolves at the element that uses it, against its own container.
   - A custom property declared on `:root` as `0 calc(5 * var(--px)) 0 var(--toy-base)` kept **honey** inside an element
     that set `--toy-base` to ink; the same `box-shadow` written directly on the element followed it (ink). `var()`
     inside a custom property is substituted where the property is declared. Section E builds on both results.
   - The nested `color-mix(in srgb, …)` chain of section C gave `#FA6245` at hp 0.05, `#E87C47` at 0.22, `#C59E49` at
     0.5 and `#8FBA4C` at 0.8, the same as my node computation.
   - A 1.5 px border (3 reference px at half scale) computed to `1px`: Chromium rounds border widths down.
2. **Godot `Gradient` in `GRADIENT_COLOR_SPACE_SRGB` with `GRADIENT_INTERPOLATE_LINEAR`** returns
   `point1.color.lerp(point2.color, weight)` with no conversion
   ([gradient.h L75-L79, L193-L207](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/gradient.h#L75-L207)).
3. **CSS `color-mix(in srgb, …)`** converts both colours to the interpolation space and interpolates each component
   linearly ([css-color-5 Overview.bs L292-L330](https://github.com/w3c/csswg-drafts/blob/dddf78d1aec8935ae6fdb836e38459142e58dc59/css-color-5/Overview.bs#L292-L330),
   [css-color-4 Overview.bs L5189-L5218](https://github.com/w3c/csswg-drafts/blob/dddf78d1aec8935ae6fdb836e38459142e58dc59/css-color-4/Overview.bs#L5189-L5218));
   `srgb` holds gamma-encoded components, so it is the same formula as Godot's sRGB gradient.
4. **`Control.offset_transform_enabled` defaults to `false`**, and the other `offset_transform_*` properties do nothing
   until it is set ([Control.xml L1161-L1163](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Control.xml#L1161-L1163));
   `offset_transform_visual_only` defaults to `true`
   ([L1191-L1195](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Control.xml#L1191-L1195)).
   godot-facts §4 did not mention the enable flag.
5. **`BaseButton.get_draw_mode()`** is meant to be read from the `draw` signal
   ([BaseButton.xml L25-L28](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/BaseButton.xml#L25-L28));
   `button_down` and `button_up` mark holding ([L86-L94](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/BaseButton.xml#L86-L94)).
6. **No proposed type variation name collides** with a class in the 4.7.2 API dump
   (`D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json`), and all are letters only.
7. **Node 20 reached end of life on 2026-04-30** ([nodejs/Release schedule.json](https://github.com/nodejs/Release/blob/main/schedule.json));
   the latest `actions/setup-node` is [v7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0) and
   `actions/checkout` is [v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1) (GitHub API, 2026-10-03).
8. **Contrast of every proposed state colour**, computed with the lint's formula (section C and G).

## 0. The decisions on one page

1. **Three tiers, one rule each.** Primitives hold literals only (`palette.*`, `px.*`, `font.*`, `ease.*`, `delay.*`,
   and the modifier files' `font.size.*` and `duration.*`). Semantic tokens only alias primitives. Component tokens
   alias semantic tokens, or `px.*` for a length; a component colour always aliases a semantic colour.
2. **Lengths have a value-named primitive scale** (`px.18` is 18 px) and role-named semantic scales (`stroke.*`,
   `radius.*`, `elevation.*`, `focus.*`, `gap.*`). Font sizes are the one length that changes with a mode, so they get
   t-shirt names (`font.size.md`) and live in the `textSize` files.
3. **Contexts are two semantic sets with the same keys**, `on-dark.*` and `on-light.*` (`text`, `text-muted`, `title`,
   `line`, `base`, `focus`). No resolver modifier: both contexts appear on one screen. A component that follows the
   context has **no component token** for that property; its spec says `ctx.<key>`. In CSS it reads `--toy-ctx-<key>`,
   which a context class switches; in Godot it is one type variation per context.
4. **Components get 43 tokens, all lengths** (insets, sizes, the odd radius or base height). No component colour token:
   every colour a component needs is a semantic role.
5. **The toy base is `elevation` + a base colour**, not a DTCG `shadow`: its colour follows the context (honey on dark,
   ink on light), and a composite token cannot follow a context in CSS (fact 1). CSS draws it as
   `box-shadow: 0 <elevation> 0 <colour>`.
6. **Godot never uses `StyleBoxFlat.shadow_*` for a toy base.** Two exact forms: *merge* (a static element whose base
   colour equals its outline: `expand_margin_bottom = N`, bottom border + N) and *layer* (a `Panel` behind the face with
   the same radii, `expand_margin_top = -N`, `expand_margin_bottom = N`). Every pressable and every panel uses *layer*.
   `shadow_size = 1` would add a 1 px fade the token does not have (godot-facts §1.2).
7. **Press motion is a Tween of the face's visual-only offset**; the base stays still. Hover lifts the face by
   `elevation.lift` (1); pressed sinks it to leave `elevation.pressed` (1) showing; 70 ms; CSS `ease-out`
   `[0, 0, 0.58, 1]`; Godot `TRANS_SINE` + `EASE_OUT`; reduced motion sets the duration to 0 and keeps the offsets.
8. **Health colour: five stops sampled in Oklab at 0, 0.25, 0.5, 0.75 and 1, interpolated linearly in sRGB** between
   them. CSS (`color-mix(in srgb)` chain) and Godot (`Gradient`, linear, sRGB) run the same formula. The largest
   distance from the Oklab mock-up is ΔE_ok 0.0061; the lowest contrast on the dark track is 3.25:1 (at 0).
9. **CSS lengths are `calc(N * var(--px))`**, with every token on `:root`. `--px` is the only per-page switch:
   `calc(1cqw / 19.2)` on the frame pages, `calc(var(--zoom) * 1px)` on the showcase. Modes are attributes on `<html>`
   (`data-text-size`, `data-motion`), contexts are classes (`toy-on-dark`, `toy-on-light`).
10. **The pack is one JSON file**, `dist/pack/pack.json`: every token flat by path at the defaults, plus per-modifier
    override maps (the build proves orthogonality, so any combination is the base plus the overrides). Colours as hex
    and 0..1 floats, lengths as int px, durations as int ms, the Tween pair by name.
11. **One entry point**, `node tools/check.js`: token validation, all four permutations, stale-output check, contrast
    gates, the Godot-safe lint with its self-tests, and the page builds. CI runs it on node 20 with no packages.
12. **Disabled and focus are proposals in the Toy grammar**: a disabled toy has no base ("unplugged"), a pale lilac face
    and muted plum outline and label; focus is a chunky 3 px ring 3 px outside the face, yellow on dark and ink on
    light. Every proposed value reuses a palette colour; nothing new is invented.

## A. Files, build, outputs and checks

### A.1 Layout

```
tokens/                                  DTCG 2025.10 sources (hand-written)
  toy.resolver.json                      the resolver: one set, modifiers textSize and motion
  primitives.tokens.json                 palette, px, font family/weights/line height/tracking, delay, ease
  semantic.tokens.json                   colour roles, the two context sets, stroke, radius, elevation, focus, gap, type, motion
  components.tokens.json                 component lengths only
  text-size/default.tokens.json          font.size.* (9 steps)
  text-size/large.tokens.json            font.size.* (proposal values)
  motion/default.tokens.json             duration.press = 70 ms
  motion/reduced.tokens.json             duration.press = 0 ms
  gates.json                             contrast pairs, world samples, minimums, the health ramp gate (not a token file)
  VERSION                                the pack's semver, one line, e.g. 0.1.0
tools/
  check.js                               the one entry point
  lib/strict-json.js                     RFC 8259 parser: positions, duplicate keys, no comments
  lib/color.js                           hex, sRGB <-> Oklab, alpha compositing, WCAG 2.x ratio
  tokens/build.js                        validate + resolve + emit; --check, --validate-only
  tokens/lib/dtcg.js                     the validator (dtcg-facts §9 checklist + profile rules) and the resolver
  tokens/lib/emit-css.js                 dist/css/toy-tokens.css
  tokens/lib/emit-pack.js                dist/pack/pack.json
  tokens/gates.js                        contrast and ramp gates over dist/pack/pack.json and tokens/gates.json
  tokens/test/run.js                     validator self-test over fixtures
  tokens/test/fixtures/good/*.json       must validate
  tokens/test/fixtures/bad/*.json        each must fail with the rule ids listed in tokens/test/fixtures/expect.json
  lint/godot-css.js                      the Godot-safe lint, generalised from pages/styles/check_styles.js
  lint/targets.json                      which file is linted with which profile
  lint/test/run.js                       lint self-test
  lint/test/good/*.css                   must produce 0 violations
  lint/test/bad/*.css                    first line "/* expect: R05 R05 */" lists the violations it must produce
  pages/snapshot.js                      zero-change proof for the toy.css migration (local, needs Edge; not in CI)
  pages/intended-changes.json            the declared visual changes the proof may see
  a11y/                                  existing scripts, unchanged
dist/                                    generated, committed, LF line endings
  css/toy-tokens.css
  pack/pack.json
  gates.json                             every pair's ratio per permutation, for the showcase's tables
pages/
  components/                            the new component showcase (section H)
    build.js, page.html, components.css, components.motion.css, showcase.json, strings.json, icons/*.svg
    components.html                      generated, committed
  styles/                                toy.css and motion-preview.css migrated; retro.css, card.css, meta.json frozen
.github/workflows/check.yml
```

Why `dist/` at the root and committed: prime-game copies the pack from a tag (F.5), and the review pages inline the
CSS at build time, so both must exist in the tree; `--check` keeps them honest. The repo's `.gitattributes` already
forces `eol=lf` for text, so generated bytes compare equal on Windows and Linux.

### A.2 The build: `node tools/tokens/build.js [--check | --validate-only]`

- **Inputs:** `tokens/toy.resolver.json` and the files it references, `tokens/VERSION`.
- **Steps:** strict-parse every file (A.6 rules 1-2), validate each file's structure, resolve the four permutations
  (`textSize` × `motion`), validate each resolved tree (types, aliases, cycles, profile), check orthogonality (rule
  37: the override sets of the two modifiers are disjoint), then emit.
- **Outputs:** `dist/css/toy-tokens.css` (section E) and `dist/pack/pack.json` (section F). Deterministic: source order
  of tokens, `JSON.stringify(…, null, 2)`, a trailing newline, no timestamps, numbers as written.
- **`--check`:** builds in memory and compares bytes with the committed files; prints each stale path and exits 1.
- **Exit codes:** 0 clean, 1 any error. Errors print `file`, the JSON Pointer inside the file and the token path
  (dtcg-facts item 39).

### A.3 The Godot-safe lint: `node tools/lint/godot-css.js [--self-test]`

`tools/lint/targets.json`:

```json
[
  { "file": "dist/css/toy-tokens.css",                   "profile": "tokens" },
  { "file": "pages/styles/toy.css",                      "profile": "skin",   "scope": "body[data-style=\"toy\"]" },
  { "file": "pages/styles/motion-preview.css",           "profile": "motion", "scope": "body[data-style=\"toy\"]" },
  { "file": "pages/components/components.css",          "profile": "component", "scope": ".toy-" },
  { "file": "pages/components/components.motion.css",   "profile": "motion", "scope": ".toy-" }
]
```

`retro.css` and `card.css` are frozen as the record of the choice; `check.js` keeps running the old
`node pages/styles/check_styles.js retro card` on them (it resolves paths from `__dirname`, so it runs from the root).

Rules (ids are what fixtures expect). "Drawing properties" are colours, borders, radii, shadows, fonts and transforms;
layout properties (`display`, `position`, `inset`, `width`, `height`, `margin`, `padding`, `gap`, `flex*`, `grid*`,
`align*`, `justify*`, `overflow`) are allowed in every profile.

| Id | Rule | Profiles |
|---|---|---|
| R01 | Forbidden: gradients, `url()`, `filter`, `backdrop-filter`, `clip-path`, `mask*`, `mix-blend-mode`, `background-blend-mode`, `animation*`, `background-image` | all |
| R02 | Pseudo-elements (`::before`, `::after`, …) | all |
| R03 | `box-shadow` other than `none` or one `0 <len> 0 <colour>` layer (x 0, blur 0, no spread, no `inset`, one layer) | all |
| R04 | `box-shadow` on a rule whose background is missing, `none`, `transparent` or a colour token with alpha < 1 | skin, component |
| R05 | Border style other than `solid`; `outline` other than `none` | all |
| R06 | Per-side border colours, or several colours in `border-color` | all |
| R07 | `border-color: transparent` (write `border-width: 0` and add the width to the padding) | skin, component |
| R08 | `%`, `em`, `rem`, `vw`, `vh` in a drawing property; `border-radius` in `%` | skin, component, motion |
| R09 | `letter-spacing` other than `0` | skin, component |
| R10 | `transform` other than `rotate(<deg>)` | skin, component |
| R11 | `transform` other than `translateY(<token calc>)`; `transition` other than `transform` and `box-shadow` with `var(--toy-motion-press-duration)` and `var(--toy-motion-press-timing-function)` | motion |
| R12 | `transition` or `transform` translate outside the motion profile | skin, component |
| R13 | `text-shadow` other than one `0 <len> 0 <colour>` layer, or on a selector that is not the logo or a title class | skin, component |
| R14 | A raw length (`18px`, `calc(18cqw / 19.2)`) or raw colour (`#fff`, `rgb()`, named colours except `none`) in a drawing property; values must be `var(--toy-…)`, `var(--_…)`, `0`, `none`, or `calc()` of those | skin, component, motion |
| R15 | `calc()` in a drawing property that uses `/`, a non-integer literal, or a multiplier that is not an integer (keeps every length an int, since every token is an int) | skin, component, motion |
| R16 | `var(--toy-X)` that is not a token in `dist/css/toy-tokens.css`, not `--toy-ctx-*`, and not a `--_*` local declared in the same file | skin, component, motion |
| R17 | `var(--px)` or `var(--zoom)` used outside the tokens file and outside page-layout rules | component, motion |
| R18 | `color-mix()` other than `in srgb` | skin, component |
| R19 | A selector outside the profile's scope prefix | skin, component, motion |
| R20 | A declaration in `toy-tokens.css` that is not a custom property, or a selector other than `:root`, `:root[data-text-size="large"]`, `:root[data-motion="reduced"]`, the reduced-motion media block, `.toy-on-dark`, `.toy-on-light` | tokens |

`!important` stays allowed in the `skin` profile only (the frame hacks of inventory §6 still need it until the
wireframe HTML changes). The lint reports the same info lines as today (rules, box-shadows, `!important` count).
Self-test: every file in `lint/test/good/` gives 0 violations and every file in `lint/test/bad/` gives exactly the ids
on its first line; at least one bad fixture per rule.

### A.4 Contrast gates: `node tools/tokens/gates.js`

Declared in `tokens/gates.json` (shape in C.4), next to the tokens, because which pairs matter is a design statement.
`gates.js` reads only `dist/pack/pack.json` and `tokens/gates.json`, so it does not depend on the build's code:
- WCAG 2.x relative luminance and ratio ([WCAG 2.2 definition](https://www.w3.org/TR/WCAG22/#dfn-relative-luminance),
  0.04045 threshold, `(L1 + 0.05) / (L2 + 0.05)`), alpha composited in sRGB over the declared backdrop, as the current
  lint and `tools/a11y/contrast.js` do.
- Every pair in every permutation (colours do not change with today's modifiers, but the check is cheap and catches a
  future `contrast` modifier).
- A pair whose background has alpha < 1 must name what is under it (`over`), or the gate errors.
- Pairs with `"min": null` are printed as info and never fail.
- A **waiver** names one `over` sample and a reason with an issue link; the pair prints `WAIVED`. A waived pair that
  starts passing fails the gate ("remove the waiver"), so waivers cannot rot.
- The health ramp gate and the derived-stop check (section C).
- It writes every result (pair id, permutation, ratio, minimum, verdict; the 21 ramp samples) to `dist/gates.json`,
  which the showcase embeds; `--check` fails when that file is stale, like the build's outputs.

### A.5 One entry point: `node tools/check.js [--release ui-X.Y.Z] [--only <step>]`

Runs, in order, and prints one line per step plus each failing step's output; exit 1 if any step fails:

| Step | Command it runs |
|---|---|
| `tokens:selftest` | `node tools/tokens/test/run.js` |
| `tokens` | `node tools/tokens/build.js --check` (validation and all permutations included) |
| `gates` | `node tools/tokens/gates.js --check` |
| `lint:selftest` | `node tools/lint/godot-css.js --self-test` |
| `lint` | `node tools/lint/godot-css.js` |
| `legacy-skins` | `node pages/styles/check_styles.js retro card` |
| `page:styles` | `node pages/styles/build-styles-page.js --check` |
| `page:components` | `node pages/components/build.js --check` |
| `release` (only with `--release`) | the tag equals `ui-` + `tokens/VERSION`; `pack.version` equals `VERSION`; the bump is at least what F.6 requires against the previous `ui-*` tag's `dist/pack/pack.json` (read with `git show`) |

Each step is a child process (`child_process.spawnSync(process.execPath, …)`), so every script also runs alone.

### A.6 The validator profile

The validator implements dtcg-facts §9 items 1-39 as written, with these changes and additions:
- Item 31 (tiers) becomes: primitives and modifier files hold literals only; `semantic.tokens.json` tokens alias
  primitive paths only (composite sub-values included); `components.tokens.json` tokens alias semantic paths, or
  `px.*` for a dimension; a component `color` aliases a semantic colour.
- **40.** The groups `on-dark` and `on-light` have identical key sets, and every key is a `color`.
- **41.** `px.N`: the name is a non-negative integer and the value is `{ "value": N, "unit": "px" }`.
- **42.** No dead primitives: every `palette.*` and `px.*` token is referenced by at least one resolved token.
- **43.** `$extensions` members under `io.github.xperiaroco2.prime-game` are only `godot` (on `cubicBezier`:
  `{ "trans": "TRANS_*", "ease": "EASE_*" }`, names from godot-facts §4), `proposal` (a string; the token's look waits for
  the engineer) and `derived` (on a colour: `{ "from": [path, path], "space": "oklab", "at": 0..1 }`).
- **44.** `$description` is required on every semantic group, every component token and every proposal.
- **45.** The CSS variable name of every path (E.2) is unique.

### A.7 CI: `.github/workflows/check.yml`

```yaml
# Runs exactly what `node tools/check.js` runs locally. No packages, no npm install.
name: check
on:
  pull_request:
  push:
    branches: [main]
    tags: ['ui-*']
  workflow_dispatch:
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0          # the release step reads the previous ui-* tag
      - uses: actions/setup-node@v7
        with:
          node-version: '20'
      - run: node tools/check.js
      - if: startsWith(github.ref, 'refs/tags/ui-')
        run: node tools/check.js --only release --release "$GITHUB_REF_NAME"
```

Major-version pins match the game's CI, which uses `actions/checkout@v7`
([ci.yml](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/.github/workflows/ci.yml)).
Node 20 is the repo's rule (CLAUDE.md) but is past its end of life (fact 7): the scripts must use nothing that node 22
or 24 removed, so moving CI to 22 is a one-line change.

## B. Tiers, names and every token

### B.1 Naming rules

- Group and token names are lower kebab-case or digits (`^[a-z0-9]+(-[a-z0-9]+)*$`, dtcg-facts item 6).
- Paths read as English: `surface.hud`, `text.on-hud-muted`, `on-light.base`, `button.primary.elevation`.
- One `$type` per group wherever possible (items 13 and 17), so a token rarely repeats it; component tokens repeat it.
- A colour's name says what it is (`palette.*`) or what it does (everything else); never a value.
- Alpha variants are separate primitives named `<colour>-<percent>` (`palette.ink-86`), since DTCG has no alpha maths.
- `$extensions` key: `io.github.xperiaroco2.prime-game` (dtcg-facts §5).

### B.2 The resolver: `tokens/toy.resolver.json`

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/resolver.json",
  "name": "prime-game UI tokens, style Toy",
  "version": "2025.10",
  "description": "One set (primitives, semantic, components) and two orthogonal modifiers.",
  "sets": {
    "toy": {
      "description": "Primitives, then semantic roles and the two context sets, then component lengths.",
      "sources": [
        { "$ref": "primitives.tokens.json" },
        { "$ref": "semantic.tokens.json" },
        { "$ref": "components.tokens.json" }
      ]
    }
  },
  "modifiers": {
    "textSize": {
      "description": "The player's text size setting. Owns font.size.*.",
      "contexts": {
        "default": [{ "$ref": "text-size/default.tokens.json" }],
        "large": [{ "$ref": "text-size/large.tokens.json" }]
      },
      "default": "default"
    },
    "motion": {
      "description": "The player's reduced-motion setting. Owns duration.*.",
      "contexts": {
        "default": [{ "$ref": "motion/default.tokens.json" }],
        "reduced": [{ "$ref": "motion/reduced.tokens.json" }]
      },
      "default": "default"
    }
  },
  "resolutionOrder": [
    { "$ref": "#/sets/toy" },
    { "$ref": "#/modifiers/textSize" },
    { "$ref": "#/modifiers/motion" }
  ]
}
```

The semantic file aliases `{font.size.md}` and `{duration.press}`, which only the modifier files define; aliases
resolve after the merge ([R §6.3](https://www.designtokens.org/tr/2025.10/resolver/#aliases)), so every permutation
resolves and the type styles pick up the active text size.

### B.3 Primitives (`primitives.tokens.json`, literals)

**`palette` (`color`, all `srgb`, components = `round(byte / 255, 4)`, `hex` lowercase).** Every value is from the
inventory (§1.1, §1.3); the three middle health stops reproduce the mock-up's own Oklab mix at those fractions.

| Token | Hex | Alpha | From (toy.css today) |
|---|---|---|---|
| `palette.ink` | `#2a1f33` | | `--toy-ink` |
| `palette.ink-86` | `#2a1f33` | 0.86 | `--toy-plate` (exactly ink at 86 %) |
| `palette.night` | `#1f1727` | | `--toy-night` |
| `palette.night-plate` | `#352a41` | | `--toy-plate-solid` |
| `palette.dusk-70` | `#261c30` | 0.70 | `.dim` literal |
| `palette.dusk-80` | `#261c30` | 0.80 | `.dim.more` literal |
| `palette.shade-60` | `#0f0a14` | 0.60 | panel and map base literal |
| `palette.cream` | `#fff4e2` | | `--toy-cream` |
| `palette.white` | `#ffffff` | | `--toy-white` |
| `palette.yellow` | `#ffc23a` | | `--toy-yellow` |
| `palette.yellow-55` | `#ffc23a` | 0.55 | map zone literal |
| `palette.honey` | `#c98a10` | | `--toy-honey` |
| `palette.coral` | `#ff8466` | | `--toy-coral` |
| `palette.coral-deep` | `#d9482f` | | `--toy-coral-deep` |
| `palette.mint` | `#3cc4a8` | | `--toy-mint` |
| `palette.mint-tint` | `#d5f4ec` | | `--toy-mint-tint` |
| `palette.lavender` | `#e9dff0` | | `--toy-lavender` |
| `palette.lilac-pale` | `#f3edf6` | | quiet key face literal |
| `palette.lilac-line` | `#e2d6ea` | | setting-row divider literal |
| `palette.track-light` | `#dccfe4` | | `--toy-track-light` |
| `palette.track-dark` | `#4a3c5c` | | `--toy-track-dark` |
| `palette.muted` | `#64566f` | | `--toy-muted` |
| `palette.muted-deep` | `#4a3b55` | | secondary text on yellow literal |
| `palette.lilac` | `#d8cce3` | | `--toy-lilac` |
| `palette.key-shade` | `#b9a8c7` | | `--toy-keyshade` |
| `palette.slot-line` | `#9a8ca6` | | `--toy-slotline` |
| `palette.health-0` | `#ff5a44` | | `--toy-health-empty` |
| `palette.health-25` | `#e58147` | | Oklab mix at 0.25 (`derived`) |
| `palette.health-50` | `#c59e49` | | Oklab mix at 0.5 (`derived`) |
| `palette.health-75` | `#9cb64c` | | Oklab mix at 0.75 (`derived`) |
| `palette.health-100` | `#5bcb4e` | | `--toy-health-full` |

**`px` (`dimension`, integers, name = value):** `1 2 3 4 5 6 8 9 10 12 13 14 16 18 22 23 24 26 28 36 40 46 72 84 180
999` (26 tokens; rule 42 fails a primitive nobody uses).

**`font`:** `font.family.base` = `"Comfortaa"` (`fontFamily`; licence recorded in
[ui-decisions](../../ui-decisions.md), Type); `font.weight.semibold` = 600, `font.weight.bold` = 700 (`fontWeight`,
numbers, dtcg-facts item 24); `font.line-height.base` = 1.25 (`number`, the wireframe's `.frame`);
`font.tracking.none` = `{0, px}` (`dimension`, the only letter spacing: B.6).

**`delay.none`** = `{0, ms}` (`duration`). **`ease.press`** = `[0, 0, 0.58, 1]` (`cubicBezier`, CSS `ease-out`,
[CSS Easing 1 §2.2](https://www.w3.org/TR/css-easing-1/#cubic-bezier-easing-functions)) with
`$extensions … godot: { "trans": "TRANS_SINE", "ease": "EASE_OUT" }` (largest progress error 0.024, godot-facts §4).

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "palette": {
    "$type": "color",
    "$description": "The Toy palette chosen on prime-game-ui#2. Names only; meaning lives in semantic.tokens.json.",
    "ink": { "$value": { "colorSpace": "srgb", "components": [0.1647, 0.1216, 0.2], "hex": "#2a1f33" } },
    "ink-86": { "$value": { "colorSpace": "srgb", "components": [0.1647, 0.1216, 0.2], "alpha": 0.86, "hex": "#2a1f33" } },
    "health-25": {
      "$value": { "colorSpace": "srgb", "components": [0.898, 0.5059, 0.2784], "hex": "#e58147" },
      "$extensions": { "io.github.xperiaroco2.prime-game": {
        "derived": { "from": ["palette.health-0", "palette.health-100"], "space": "oklab", "at": 0.25 } } }
    }
  },
  "px": {
    "$type": "dimension",
    "$description": "Every length of the style, in px at the 1920x1080 reference. The name is the value.",
    "18": { "$value": { "value": 18, "unit": "px" } }
  },
  "font": {
    "family": { "$type": "fontFamily", "base": { "$value": "Comfortaa" } },
    "weight": { "$type": "fontWeight", "semibold": { "$value": 600 }, "bold": { "$value": 700 } },
    "line-height": { "$type": "number", "base": { "$value": 1.25 } },
    "tracking": { "$type": "dimension", "none": { "$value": { "value": 0, "unit": "px" } } }
  },
  "delay": { "$type": "duration", "none": { "$value": { "value": 0, "unit": "ms" } } },
  "ease": {
    "$type": "cubicBezier",
    "press": {
      "$description": "CSS ease-out. Tween has no cubic-bezier; SINE + OUT is the closest pair.",
      "$value": [0, 0, 0.58, 1],
      "$extensions": { "io.github.xperiaroco2.prime-game": { "godot": { "trans": "TRANS_SINE", "ease": "EASE_OUT" } } }
    }
  }
}
```

### B.4 Modifier files (primitives too)

`text-size/default.tokens.json` and `text-size/large.tokens.json` define the same nine paths (`$type` on the group in
both files). Default = the effective Toy sizes (inventory §2.4). **Large is a proposal:** ×1.25 rounded half up for the
reading sizes up to 36, and the display sizes unchanged, because 48 px and up is already "large" (XAG 102 via lens 6) and
those sit in fixed plates and timers.

| Token | Default | Large (proposal) | Frame class today |
|---|---|---|---|
| `font.size.xs` | 18 | 23 | `.t16`, `.room` |
| `font.size.sm` | 20 | 25 | `.t18`, `.t20` (both render 20) |
| `font.size.md` | 22 | 28 | `.t22` |
| `font.size.lg` | 24 | 30 | `.t24` |
| `font.size.xl` | 28 | 35 | `.t28` |
| `font.size.2xl` | 36 | 45 | `.t36` |
| `font.size.3xl` | 48 | 48 | `.t48` |
| `font.size.4xl` | 64 | 64 | `.t64` |
| `font.size.5xl` | 96 | 96 | `.t96` |

```json
{ "font": { "size": { "$type": "dimension",
  "xs": { "$value": { "value": 18, "unit": "px" } }, "sm": { "$value": { "value": 20, "unit": "px" } },
  "md": { "$value": { "value": 22, "unit": "px" } }, "lg": { "$value": { "value": 24, "unit": "px" } },
  "xl": { "$value": { "value": 28, "unit": "px" } }, "2xl": { "$value": { "value": 36, "unit": "px" } },
  "3xl": { "$value": { "value": 48, "unit": "px" } }, "4xl": { "$value": { "value": 64, "unit": "px" } },
  "5xl": { "$value": { "value": 96, "unit": "px" } } } } }
```

`motion/default.tokens.json` and `motion/reduced.tokens.json`:

```json
{ "duration": { "$type": "duration", "press": { "$value": { "value": 70, "unit": "ms" } } } }
```
```json
{ "duration": { "$type": "duration", "press": { "$value": { "value": 0, "unit": "ms" } } } }
```

### B.5 Semantic tokens (`semantic.tokens.json`, aliases of primitives)

Proposals (marked **P**) carry `$extensions … "proposal"`; their values are palette colours already in the style.

| Token | Alias | Used by |
|---|---|---|
| `surface.hud` | `palette.ink-86` | HUD plates, plate chips, slots, mic, HUD labels, name plate |
| `surface.hud-solid` | `palette.night-plate` | plates on the night backdrop, spinner disc |
| `surface.night` | `palette.night` | intro, outro, loading |
| `surface.backdrop` | `palette.dusk-70` | menu backdrop (`.dim`) |
| `surface.backdrop-deep` | `palette.dusk-80` | deep backdrop (`.dim.more`) |
| `surface.panel` | `palette.cream` | panels, dialogs, how-to cards, room tiles, keycap on dark, crosshair |
| `surface.board` | `palette.lavender` | map board, quiet preset card |
| `surface.tile` | `palette.white` | secondary button, field, setting row, card, keycap on light, how-to frame, hover of flat controls (**P**) |
| `surface.tile-quiet` | `palette.lilac-pale` | quiet keycap, disabled and read-only faces (**P**) |
| `surface.accent` | `palette.yellow` | primary button, selected chip/tab/card, stepper, title plate, field selection |
| `surface.accent-pressed` **P** | `palette.honey` | a flat yellow control while held (stepper, selected chip) |
| `surface.sticker` | `palette.coral` | NEW sticker |
| `surface.danger` **P** | `palette.coral` | danger button face |
| `surface.done` | `palette.mint-tint` | done how-to frame |
| `surface.zone` | `palette.yellow-55` | lit map zone |
| `surface.pin` | `palette.coral-deep` | you-are-here pin |
| `surface.track-dark` | `palette.track-dark` | bar tracks on dark |
| `surface.track-light` | `palette.track-light` | bar tracks in panels |
| `text.on-bright` | `palette.ink` | text on white, cream, yellow, coral, mint tint, lavender, honey |
| `text.on-bright-muted` | `palette.muted` | secondary text on bright faces; disabled labels (**P**); placeholder (**P**) |
| `text.on-accent-muted` | `palette.muted-deep` | secondary text on yellow (muted plum fails there, 4.20:1) |
| `text.on-hud` | `palette.cream` | text on HUD plates |
| `text.on-hud-muted` | `palette.lilac` | secondary text on HUD plates, idle slot label |
| `outline.default` | `palette.ink` | every ink outline; caret |
| `outline.quiet` | `palette.muted` | quiet keycap and card; disabled outline (**P**) |
| `outline.slot` | `palette.slot-line` | idle slot |
| `outline.selected` | `palette.yellow` | active slot, spinner arc |
| `outline.key-on-dark` | `palette.key-shade` | keycap edge on dark |
| `outline.alert` | `palette.coral` | downed plate edge; muted-mic icon (**P**) |
| `outline.divider` | `palette.lilac-line` | setting-row divider |
| `outline.error` **P** | `palette.coral-deep` | field with a bad value |
| `fill.stamina` | `palette.yellow` | stamina |
| `fill.progress` | `palette.mint` | loading, bleed-out, raising, task progress on dark |
| `fill.progress-on-light` | `palette.ink` | sliders and progress in panels |
| `fill.health.0` … `fill.health.100` | `palette.health-0` … `palette.health-100` | the five health stops (section C) |
| `base.drop` | `palette.shade-60` | panel and map base |
| `base.title` | `palette.coral` | title plate base, logo extrusion |
| `on-dark.text` | `palette.cream` | context set: dark |
| `on-dark.text-muted` | `palette.lilac` | |
| `on-dark.title` | `palette.yellow` | |
| `on-dark.line` | `palette.cream` | ghost button and line chip outline |
| `on-dark.base` | `palette.honey` | toy base under raised controls |
| `on-dark.focus` **P** | `palette.yellow` | focus ring |
| `on-light.text` | `palette.ink` | context set: light |
| `on-light.text-muted` | `palette.muted` | |
| `on-light.title` | `palette.ink` | |
| `on-light.line` | `palette.ink` | |
| `on-light.base` | `palette.ink` | |
| `on-light.focus` **P** | `palette.ink` | focus ring |
| `stroke.thin` | `px.2` | keycap sides, stepper, crosshair, swatch |
| `stroke.control` | `px.3` | button, field, chip, slot, tab, setting row, card, how-to frame, room, pin, HUD bar |
| `stroke.surface` | `px.4` | panel, map, title plate, alert plate, selected card, zone |
| `stroke.bold` | `px.5` | keycap bottom, active slot |
| `radius.small` | `px.8` | keycap, HUD label plate |
| `radius.medium` | `px.12` | field, setting row, room, zone |
| `radius.large` | `px.16` | plate, card, how-to frame |
| `radius.control` | `px.18` | button, slot |
| `radius.surface` | `px.24` | panel, map |
| `radius.pill` | `px.999` | chip, stepper, progress bar, round keycap |
| `elevation.raised` | `px.5` | base of secondary and danger buttons, preset card |
| `elevation.surface` | `px.10` | base of panel, map, title plate |
| `elevation.lift` | `px.1` | hover: the face rises by this |
| `elevation.pressed` | `px.1` | held: the base left showing |
| `focus.width` **P** | `px.3` | focus ring width (lens 6: 3 px) |
| `focus.gap` **P** | `px.3` | gap between face and ring |
| `gap.caption` | `px.6` | how-to frame art to caption |
| `gap.list` | `px.8` | tabs, chip rows |
| `gap.stack` | `px.10` | vertical stacks (`.col`) |
| `gap.row` | `px.12` | rows, setting row, how-to frames |
| `gap.value` | `px.14` | stepper value |
| `motion.press` (`transition`) | `{duration.press, delay.none, ease.press}` | press and hover motion |

**`type` (`typography`).** Every style is `{fontFamily: {font.family.base}, fontSize: {font.size.X}, fontWeight:
{font.weight.Y}, letterSpacing: {font.tracking.none}, lineHeight: {font.line-height.base}}`:

| Token | Size | Weight | Frame class | Used by |
|---|---|---|---|---|
| `type.label` | xs | semibold | `.t16` | HUD bar labels, map notes, version |
| `type.label-strong` | xs | bold | `.t16.b`, `.room` | slot labels, room names, NEW |
| `type.caption` | sm | semibold | `.t18`, `.t20` | ghost button, chips, lists, dim captions |
| `type.caption-strong` | sm | bold | `.t20.b` | selected chip, keycap glyph, how-to caption, name plate |
| `type.body` | md | semibold | `.t22` | body text, setting rows, plate text |
| `type.body-strong` | md | bold | `.t22.b` | field text, setting values, stepper, card titles |
| `type.lead` | lg | semibold | `.t24` | task rows, idle tabs, goals |
| `type.lead-strong` | lg | bold | `.t24.b` | raised button labels, selected tab |
| `type.menu` | xl | semibold | `.t28` | main-menu items |
| `type.menu-strong` | xl | bold | `.t28.b` | the selected main-menu item |
| `type.heading` | 2xl | bold | `.t36` | panel titles, countdowns |
| `type.timer` | 3xl | bold | `.t48` | round timer, "You're down" |
| `type.hero` | 4xl | bold | `.t64` | logo, role in the Esc menu |
| `type.display` | 5xl | bold | `.t96` | title plates |

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "surface": {
    "$type": "color",
    "$description": "What a thing is filled with.",
    "hud": { "$value": "{palette.ink-86}", "$description": "HUD plates, chips, slots and the mic over the 3D world." },
    "accent-pressed": {
      "$value": "{palette.honey}",
      "$description": "The face of a flat yellow control while it is held.",
      "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": "pressed look of flat yellow controls" } }
    }
  },
  "on-dark": {
    "$type": "color",
    "$description": "Context set: dark surroundings (world plates, backdrops, night). Same keys as on-light.",
    "text": { "$value": "{palette.cream}" },
    "text-muted": { "$value": "{palette.lilac}" },
    "title": { "$value": "{palette.yellow}" },
    "line": { "$value": "{palette.cream}" },
    "base": { "$value": "{palette.honey}" },
    "focus": { "$value": "{palette.yellow}", "$description": "Focus ring.",
      "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": "focus ring colour on dark" } } }
  },
  "radius": {
    "$type": "dimension",
    "$description": "Corner radii by role.",
    "control": { "$value": "{px.18}", "$description": "Buttons and slots." }
  },
  "type": {
    "$type": "typography",
    "$description": "Text styles. letterSpacing is always 0: Godot's spacing_glyph is an int.",
    "body": { "$value": { "fontFamily": "{font.family.base}", "fontSize": "{font.size.md}",
      "fontWeight": "{font.weight.semibold}", "letterSpacing": "{font.tracking.none}", "lineHeight": "{font.line-height.base}" } }
  },
  "motion": {
    "$type": "transition",
    "$description": "Motion by role.",
    "press": { "$value": { "duration": "{duration.press}", "delay": "{delay.none}", "timingFunction": "{ease.press}" } }
  }
}
```

### B.6 Component tokens (`components.tokens.json`, lengths only)

A component token exists only where no semantic role gives the value. Every one carries `$type` and `$description`.

| Token | Alias | Why it is not semantic |
|---|---|---|
| `button.inset-block` | `px.12` | content margin, border included (inventory §2.3) |
| `button.inset-inline` | `px.22` | |
| `button.primary.elevation` | `px.6` | the primary button stands 1 px taller than `elevation.raised` |
| `chip.inset-block` | `px.4` | |
| `chip.inset-inline` | `px.14` | also the name plate |
| `key.inset-inline` **P** | `px.10` | px for the wireframe's `.35em` (2 border + 8) |
| `key.min-width` **P** | `px.36` | px for `1.6em` at 22 px text |
| `key.wide-min-width` **P** | `px.72` | Space, Shift, Tab, Esc |
| `slot.size` | `px.84` | |
| `slot.wide-width` | `px.180` | two-handed carry |
| `slot.inset` | `px.9` | content margin in both states; content is centred |
| `bar.hud.height` | `px.16` | |
| `bar.hud.radius` | `px.10` | |
| `bar.hud.fill-radius` | `px.6` | |
| `bar.progress.height` | `px.10` | |
| `field.inset-block` | `px.10` | |
| `field.inset-inline` | `px.16` | |
| `tab.radius` | `px.14` | |
| `tab.inset-block` | `px.10` | |
| `tab.inset-inline` | `px.16` | |
| `tab.elevation` | `px.4` | |
| `setting-row.inset-top` | `px.8` | |
| `setting-row.inset-inline` | `px.14` | |
| `setting-row.inset-bottom` | `px.9` | 6 padding + 3 divider |
| `stepper.inset-inline` | `px.10` | block inset is the 2 px border |
| `card.inset` | `px.14` | idle and selected (G.12) |
| `card.elevation-pressed` | `px.2` | a held card sinks 3 px, not to 1 |
| `panel.inset` | `px.28` | Esc menu (24 + 4) |
| `dialog.inset` | `px.40` | invite dialog (36 + 4) |
| `howto.inset` | `px.26` | how-to card (22 + 4) |
| `howto.frame-inset` | `px.13` | |
| `plate.inset-block` | `px.10` | |
| `plate.inset-inline` | `px.18` | |
| `plate.label-inset-inline` | `px.8` | HUD bar label plate |
| `title-plate.radius` | `px.26` | |
| `title-plate.inset-inline` | `px.36` | drawn outside the layout box |
| `logo.shadow-offset` | `px.6` | |
| `room.inset` | `px.9` | |
| `pin.size` | `px.28` | |
| `pin.radius` | `px.14` | three corners; the fourth is 0 (the point) |
| `mic.size` | `px.46` | |
| `mic.radius` | `px.23` | half the size, as an int (godot-facts §2: no `%`) |
| `spinner.stroke` | `px.10` | the loading arc |

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "button": {
    "$description": "Only what buttons need beyond the semantic roles; the rest is in the component spec.",
    "inset-block": { "$type": "dimension", "$value": "{px.12}", "$description": "Content margin top and bottom, border included." },
    "inset-inline": { "$type": "dimension", "$value": "{px.22}", "$description": "Content margin left and right, border included." },
    "primary": {
      "elevation": { "$type": "dimension", "$value": "{px.6}", "$description": "The primary button's toy base." }
    }
  },
  "card": {
    "inset": { "$type": "dimension", "$value": "{px.14}", "$description": "Content margin of idle and selected cards." },
    "elevation-pressed": { "$type": "dimension", "$value": "{px.2}", "$description": "Base left showing while a card is held." }
  }
}
```

Totals: 31 palette, 26 px, 7 other primitives, 9 + 1 modifier tokens, 89 semantic (53 colours, 21 lengths, 14 type
styles, 1 transition), 43 component.
That is the whole list; nothing else is tokenised in this wave (swatch body colours, icons, spinner rotation and screen
transitions wait for their own decisions, inventory §3).

## C. The colours the engineer named

### C.1 Stamina

`fill.stamina` → `palette.yellow` (`#ffc23a`), on `surface.track-dark`: 6.23:1 (inventory n6).

### C.2 Health: stops sampled in Oklab, interpolated in sRGB

The mock-up mixes full and empty in Oklab per fraction; `Color.lerp` mixes sRGB; the two differ by up to 0.05 ΔE_ok
in the middle (godot-facts §6). Godot's Oklab `Gradient` and CSS `in oklab` would match only as closely as their
matrices agree, which I did not verify. Linear interpolation of **gamma-encoded sRGB components** is literally the same
formula on both sides (facts 2 and 3), so:

- **Stops:** `fill.health.0/25/50/75/100` = `#ff5a44`, `#e58147`, `#c59e49`, `#9cb64c`, `#5bcb4e`, sampled from the two
  ends in Oklab at their offsets (the three middle ones are exactly what the mock-up shows at 25, 50 and 75 %).
- **Between stops:** linear in sRGB. Largest distance from the true Oklab mix over the 21 sampled fractions: ΔE_ok
  0.0061 (at 0.90). Three stops would give 0.017, two (plain `Color.lerp`) 0.051; five is the smallest count well below a
  just-noticeable step, and stays readable as tokens.
- **Godot:** a `Gradient` with offsets `[0, 0.25, 0.5, 0.75, 1]`, the five colours, `interpolation_mode =
  GRADIENT_INTERPOLATE_LINEAR`, `interpolation_color_space = GRADIENT_COLOR_SPACE_SRGB`; `sample(hp)`. The generator
  writes it as `client/ui/theme/health_ramp.tres` from the pack's `ramps.health` (F.3); the HUD sets the fill-only bar's
  `self_modulate` from it (godot-facts §6), so no `Color(...)` appears in screen code.
- **CSS:** the chain below, written in the component rule that uses it (it reads `--hp` from the element, so it cannot
  live in a token; E.4). Checked in headless Edge (fact 1).

```css
background: color-mix(in srgb, var(--toy-fill-health-100) clamp(0%, (var(--hp) - 0.75) * 400%, 100%),
            color-mix(in srgb, var(--toy-fill-health-75) clamp(0%, (var(--hp) - 0.5) * 400%, 100%),
            color-mix(in srgb, var(--toy-fill-health-50) clamp(0%, (var(--hp) - 0.25) * 400%, 100%),
            color-mix(in srgb, var(--toy-fill-health-25) clamp(0%, var(--hp) * 400%, 100%),
                      var(--toy-fill-health-0)))));
```

Each layer is "the next stop, weighted by how far `--hp` is into its segment, clamped to 0..100 %", so below a segment
the layer passes the colour through and above it the layer is the stop. The percentages stay in 0..100 %, as color-mix
requires ([css-color-5 L252-L256](https://github.com/w3c/csswg-drafts/blob/dddf78d1aec8935ae6fdb836e38459142e58dc59/css-color-5/Overview.bs#L252-L256)).

### C.3 The health gate (every 0.05)

Ramp colour, quantised to 8 bits, against `surface.track-dark` `#4a3c5c`, minimum 3:1 (non-text, lens 6):

| hp | colour | ratio | hp | colour | ratio | hp | colour | ratio |
|---|---|---|---|---|---|---|---|---|
| 0.00 | `#FF5A44` | 3.25 | 0.35 | `#D88D48` | 3.74 | 0.70 | `#A4B14B` | 4.29 |
| 0.05 | `#FA6245` | 3.30 | 0.40 | `#D29248` | 3.80 | 0.75 | `#9CB64C` | 4.40 |
| 0.10 | `#F56A45` | 3.36 | 0.45 | `#CB9849` | 3.88 | 0.80 | `#8FBA4C` | 4.44 |
| 0.15 | `#EF7146` | 3.40 | 0.50 | `#C59E49` | 4.00 | 0.85 | `#82BE4D` | 4.50 |
| 0.20 | `#EA7946` | 3.50 | 0.55 | `#BDA34A` | 4.06 | 0.90 | `#75C34D` | 4.62 |
| 0.25 | `#E58147` | 3.61 | 0.60 | `#B5A84A` | 4.14 | 0.95 | `#68C74E` | 4.72 |
| 0.30 | `#DF8747` | 3.68 | 0.65 | `#ACAC4B` | 4.19 | 1.00 | `#5BCB4E` | 4.83 |

The gate also recomputes each `derived` stop from the two ends in Oklab (Björn Ottosson's matrices, as in
`tools/a11y/cvd.js`) and fails if its 8-bit hex differs, so the stops cannot drift from their definition. The bar's
length stays the real cue for colour-blind players ([ui-decisions](../../ui-decisions.md), Round HUD).

### C.4 `tokens/gates.json`

```json
{
  "worlds": { "white": "#ffffff", "light": "#c9c9c9", "mid": "#979797" },
  "min": { "text": 4.5, "large": 3, "ui": 3 },
  "pairs": [
    { "id": "c1", "fg": "text.on-hud", "bg": "surface.hud", "over": ["mid", "light", "white"], "min": "text",
      "what": "HUD text on a plate over the world" },
    { "id": "c13", "fg": "on-dark.text-muted", "bg": "surface.backdrop", "over": ["light", "white"], "min": "text",
      "what": "secondary text on the menu backdrop",
      "waive": { "over": "white", "reason": "3.93:1 over a white wall: a look decision, see prime-game-ui#5" } },
    { "id": "n17", "fg": "surface.accent", "bg": "surface.panel", "min": null,
      "what": "selected tab vs panel: carried by the ink outline" }
  ],
  "ramps": [
    { "id": "health", "stops": [["0", "fill.health.0"], ["0.25", "fill.health.25"], ["0.5", "fill.health.50"],
      ["0.75", "fill.health.75"], ["1", "fill.health.100"]],
      "space": "srgb", "step": 0.05, "against": "surface.track-dark", "min": "ui" }
  ]
}
```

`fg` is composited over the composited `bg`; `over` lists world samples (or a token path) under a translucent `bg`.
The full pair list, with today's ratios (all from the inventory or computed with the lint's formula):

| Ids | fg | bg (over) | min | ratios |
|---|---|---|---|---|
| c1, c2, x9 | `text.on-hud` | `surface.hud` (mid, light, white) | text | 11.54, 10.39, 9.25 |
| c3, x10, x12 | `text.on-hud-muted` | `surface.hud` (light, white, mid) | text | 7.36, 6.55, 8.18 |
| c4, c5 | `on-light.text`, `on-light.text-muted` | `surface.panel` | text | 14.37, 6.22 |
| c6, c7, c14, x4 | `text.on-bright` | `surface.accent`, `.tile`, `.sticker`, `.done` | text | 9.71, 15.65, 6.51, 13.40 |
| c8, c9, n35 | `surface.hud` | worlds mid, light, white | ui | 4.30, 6.83, 10.07 |
| c10, x11 | `on-dark.title` | `surface.hud` (light, white) | text | 7.02, 6.25 |
| c11, x14 | `on-dark.text` | `surface.backdrop` (light, white) | text | 7.12, 5.54 |
| c12, x16 | `on-dark.title` | `surface.backdrop` (light, white) | large | 4.81, 3.74 |
| c13, x15 | `on-dark.text-muted` | `surface.backdrop` (light, **white waived**) | text | 5.04, **3.93** |
| c15, n33, n34 | `outline.slot` | `surface.hud` (light, mid, white) | ui | 3.60, 3.99, 3.20 |
| c16, x17 | `on-light.text-muted`, `on-light.text` | `surface.board` | text | 5.25, 12.13 |
| c17 | `outline.default` | `surface.board` | ui | 12.13 |
| c18, x7, x8 | `on-dark.text`, `.title`, `.text-muted` | `surface.night` | text | 15.94, 10.77, 11.29 |
| x1, x5 | `text.on-bright-muted` | `surface.tile`, `.tile-quiet` | text | 6.77, 5.88 |
| x2 | `text.on-accent-muted` | `surface.accent` | text | 6.36 |
| x6 | `text.on-hud` | `surface.hud-solid` | text | 12.37 |
| x13 | `text.on-hud` | `surface.hud` (`surface.board`) | text | 9.83 |
| x18, x19 | `on-dark.text-muted`, `on-dark.text` | `surface.backdrop-deep` (white) | text | 5.55, 7.83 |
| n1, n2, n4, n5 | `outline.selected`, `outline.alert`, `surface.panel`, `outline.key-on-dark` | `surface.hud` (light) | ui | 7.02, 4.71, 10.39, 5.11 |
| n6, n9 | `fill.stamina`, `fill.progress` | `surface.track-dark` | ui | 6.23, 4.61 |
| n10 | `fill.progress-on-light` | `surface.track-light` | ui | 10.50 |
| n11, n12 | `outline.default` | worlds light, mid (HUD bar, crosshair) | ui | 9.45, 5.36 |
| n13 | `surface.track-dark` | world light | ui | 6.06 |
| n14, n15, n16 | `on-dark.line`; `on-dark.line`; `on-light.line` | `surface.night`; `surface.backdrop` (light); `surface.panel` | ui | 15.94, 7.12, 14.37 |
| n21, n22 | `surface.pin` | `surface.board`, `surface.panel` | ui | 3.31, 3.92 |
| n27 | `outline.selected` | `surface.hud-solid` | ui | 8.36 |
| n28, n29 | `on-dark.base`, `base.title` | `surface.night` | ui | 5.89, 7.23 |
| n30 | `surface.tile` | `surface.backdrop` (light) | ui | 7.75 |
| p1 **P** | `on-dark.focus` | `surface.night`; `surface.hud` (white, light, mid); `surface.backdrop` (white, light) | ui | 10.77; 6.25, 7.02, 7.80; 3.74, 4.81 |
| p2 **P** | `on-light.focus` | `surface.panel`, `surface.board`, `surface.tile` | ui | 14.37, 12.13, 15.65 |
| p3 **P** | `outline.quiet` | `surface.panel` | ui | 6.22 |
| p4 **P** | `text.on-bright` | `surface.danger`, `surface.accent-pressed` | text | 6.51, 5.31 |
| p5 **P** | `outline.error` | `surface.tile`, `surface.panel` | ui | 4.27, 3.92 |
| info | `surface.accent`, `surface.tile`, `outline.divider` (×2), `surface.zone` (×2), `surface.tile-quiet` | panel; panel; panel, tile; panel, board; panel | null | 1.48, 1.09, 1.28, 1.40, 1.25, 1.15, 1.06 |

**Why one focus colour cannot serve both contexts:** of the palette, yellow is the best on dark (3.74 at worst) but
1.48 on cream; ink is the best on light but 1.11 on night; coral-deep, honey, coral, mint and slot line each fall below
3:1 somewhere (lowest 1.41 to 2.05). So `focus` is a context key.

## D. Sizes, the toy base and the press

### D.1 Ints and the reference

Every length token is an int px at the 1920×1080 mock-up reference (rule 41). Godot's `border_width_*`,
`corner_radius_*` and font sizes are ints (godot-facts §2); content margins and offsets are floats but stay ints so the
mock-up and the theme are the same numbers. The pack is authored at the reference only; **the game must move its base
size to 1920×1080** (godot-facts §8, a prime-game issue) or every value scales by 0.6 and rounds. The generator never
scales.

Content margins are **insets = border + padding**, measured from the outer edge (godot-facts §2): the token is the
inset, and CSS writes `padding: calc(inset - stroke)`. A transparent border becomes width 0 with the width added to the
inset (godot-facts table, `border-color: transparent`); CSS paints a background under the border box, so the picture
does not change.

### D.2 The toy base

The token pair is `elevation` (an int) and a base colour: `ctx.base` for raised controls, cards and the selected tab,
`base.drop` for panels and the map, `base.title` for the title plate. CSS draws `box-shadow: 0 <elevation> 0 <colour>`
on an opaque face (lint R03, R04). Godot draws it exactly, in one of two ways, and **never with `shadow_size`**:

| Form | When | StyleBoxFlat | Exact because |
|---|---|---|---|
| **merge** | a static element whose base colour equals its outline colour: the selected tab (ink on ink) | on the face: `expand_margin_bottom = N`, `border_width_bottom = stroke + N`, all four `content_margin_*` set explicitly from the insets | the union of face and moved face is the face N px taller with the same radii; the inner bottom radius is `r - min(stroke + N, stroke)` = `r - stroke`, as in CSS (godot-facts §1.3) |
| **layer** | everything else: raised buttons, preset cards (they move), panels, the map, the title plate (base colour ≠ outline) | a `Panel` drawn behind the face, same rect: `bg_color` = base colour, the face's radii, `expand_margin_top = -N`, `expand_margin_bottom = N`, no border | it is the face's own shape moved N px down, in a hard colour; the face covers all but the bottom N px |

Node shape for *layer* (a prime-game component): a `MarginContainer` with no margins holding two children, the base
`Panel` (its own type variation, `mouse_filter = IGNORE`) and the face (`Button`, `PanelContainer` or `Label`). A
`MarginContainer` gives every child its full rect and draws children in order, so the base sits behind. Expand margins
never change layout or the click area ([StyleBoxFlat.xml L146-L149](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/StyleBoxFlat.xml#L146-L149)).
Why not `shadow_size = 1`: it grows the shadow by 1 px and fades it, so it is not the hard base the token describes; the
exact forms cost one node per pressable, which the press needs anyway (D.3).

The mock-up keeps its static bases unchanged; only the press motion changes (D.3, I.2).

### D.3 The press

| State | Face offset | Base showing | Tokens |
|---|---|---|---|
| rest | 0 | N | N = `elevation.raised` (5), `button.primary.elevation` (6), `elevation.raised` for cards |
| hover | `-lift` | N + lift | `elevation.lift` = 1 |
| pressed (held) | `N - pressed` | `pressed` | `elevation.pressed` = 1 (buttons: travel 4 or 5); `card.elevation-pressed` = 2 (cards: travel 3) |
| disabled **P** | 0 | none | |

The base's bottom edge never moves. Timing: `motion.press` = 70 ms, delay 0, `ease.press`.

- **CSS** (motion profile): the face carries the base as its shadow, so the shadow compensates:
  hover `transform: translateY(calc(-1 * lift))` with `box-shadow: 0 calc(N + lift) 0 base`; pressed
  `translateY(calc(N - pressed))` with `box-shadow: 0 pressed 0 base`; `transition` on `transform` and `box-shadow` with
  `--toy-motion-press-duration` and `--toy-motion-press-timing-function`.
- **Godot** (option B of godot-facts §4): the face's `offset_transform_enabled = true` (fact 4) and a Tween of
  `offset_transform_position:y` to `-lift`, `N - pressed` or 0, `set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)`,
  duration `press_ms / 1000.0`. The face reads its targets from custom theme constants of its variation (`lift`, `sink`,
  `press_ms`, `press_ms_reduced`), which the generator writes; custom item names are allowed (godot-facts §9). The
  component listens to the face's `draw` signal and reads `get_draw_mode()` (fact 5); a toggle card uses
  `button_down`/`button_up` for "held", because its pressed draw mode also means "selected". The offset is visual only,
  so the click area and layout never move. The focus ring is drawn by the face, so it moves with it.
- **Reduced motion:** `duration.press` = 0 ms (the `motion` modifier). CSS: `:root[data-motion="reduced"]`, and the OS
  hint `prefers-reduced-motion` unless the page forces `data-motion="default"`. Godot: the component uses
  `press_ms_reduced` when the game's reduced-motion setting is on (it can default from
  `DisplayServer.accessibility_should_reduce_animation()`, lens 6); the offsets still apply, instantly, as in CSS today.

## E. The CSS output

### E.1 One file, all on `:root`: `dist/css/toy-tokens.css`

Every token is a custom property on `:root`, aliases stay `var()` references, and modes and contexts are the only
other rules. Declaring everything on one element is what makes `var()` chains and mode overrides work (fact 1):
`:root[data-text-size="large"]` overrides `--toy-font-size-*` on the same element, so every `type.*` alias declared
there picks the new value up.

```css
/* Generated by tools/tokens/build.js from tokens/toy.resolver.json. Do not edit. */
:root {
  --px: 1px;
  --toy-palette-ink: #2a1f33;
  --toy-palette-ink-86: rgb(42 31 51 / 0.86);
  --toy-palette-cream: #fff4e2;
  /* … every palette token … */
  --toy-px-1: calc(1 * var(--px));
  --toy-px-18: calc(18 * var(--px));
  /* … every px token … */
  --toy-font-family-base: "Comfortaa";
  --toy-font-weight-semibold: 600;
  --toy-font-weight-bold: 700;
  --toy-font-line-height-base: 1.25;
  --toy-font-tracking-none: 0px;
  --toy-delay-none: 0ms;
  --toy-ease-press: cubic-bezier(0, 0, 0.58, 1);
  --toy-font-size-xs: calc(18 * var(--px));
  /* … textSize default … */
  --toy-duration-press: 70ms;
  --toy-surface-hud: var(--toy-palette-ink-86);
  --toy-on-dark-text: var(--toy-palette-cream);
  --toy-radius-control: var(--toy-px-18);
  --toy-type-body-font-family: var(--toy-font-family-base);
  --toy-type-body-font-size: var(--toy-font-size-md);
  --toy-type-body-font-weight: var(--toy-font-weight-semibold);
  --toy-type-body-letter-spacing: var(--toy-font-tracking-none);
  --toy-type-body-line-height: var(--toy-font-line-height-base);
  --toy-motion-press-duration: var(--toy-duration-press);
  --toy-motion-press-delay: var(--toy-delay-none);
  --toy-motion-press-timing-function: var(--toy-ease-press);
  --toy-button-inset-block: var(--toy-px-12);
  /* … every semantic and component token … */
  --toy-ctx-text: var(--toy-on-dark-text);
  --toy-ctx-text-muted: var(--toy-on-dark-text-muted);
  --toy-ctx-title: var(--toy-on-dark-title);
  --toy-ctx-line: var(--toy-on-dark-line);
  --toy-ctx-base: var(--toy-on-dark-base);
  --toy-ctx-focus: var(--toy-on-dark-focus);
}
:root[data-text-size="large"] {
  --toy-font-size-xs: calc(23 * var(--px));
  /* … the textSize=large overrides … */
}
:root[data-motion="reduced"] { --toy-duration-press: 0ms; }
@media (prefers-reduced-motion: reduce) {
  :root:not([data-motion="default"]) { --toy-duration-press: 0ms; }
}
.toy-on-dark {
  --toy-ctx-text: var(--toy-on-dark-text);
  /* … the six keys … */
}
.toy-on-light {
  --toy-ctx-text: var(--toy-on-light-text);
  /* … the six keys … */
}
```

### E.2 Variable names

| Name | Meaning | Set by |
|---|---|---|
| `--toy-<path with . replaced by ->` | one per token: `surface.hud` → `--toy-surface-hud`, `fill.health.50` → `--toy-fill-health-50`, `font.size.2xl` → `--toy-font-size-2xl`, `on-light.base` → `--toy-on-light-base` | the build |
| `--toy-<path>-font-family`, `-font-size`, `-font-weight`, `-letter-spacing`, `-line-height` | the parts of a `typography` token | the build |
| `--toy-<path>-duration`, `-delay`, `-timing-function` | the parts of a `transition` token | the build |
| `--toy-ctx-text`, `-text-muted`, `-title`, `-line`, `-base`, `-focus` | the active context; dark on `:root` | `.toy-on-dark`, `.toy-on-light`, and the frames' context block (I.2) |
| `--px` | one reference px: `1px` by default | each page (E.3) |
| `--zoom` | the showcase's zoom factor | the showcase's zoom control |
| `--hp` | a health fraction, 0..1 | inline on a health fill |
| `--_<name>` | a rule-local helper, e.g. `--_rest` (the element's rest elevation) | component and motion CSS only, declared in the same file (lint R16) |

Values by type: colour → lowercase hex, or `rgb(r g b / a)` when alpha < 1; dimension → `calc(N * var(--px))`, or
`0px` for 0; duration → `70ms`; cubicBezier → `cubic-bezier(…)`; number and fontWeight → the number; fontFamily → a
quoted name; an alias → `var(--toy-<target>)`. Only `font.size.*` and `duration.*` appear under the mode selectors.

### E.3 Two kinds of page, one switch

- **Frame pages** (`pages/styles/styles.html`, built from the 1920×1080 wireframes): `:root { --px: calc(1cqw / 19.2); }`
  after the tokens file. Each frame is the `container-type: inline-size` element, so `calc(18 * var(--px))` resolves to
  18 reference px inside every frame at every page zoom, which is the same computed length as today's
  `calc(18cqw / 19.2)`. A toy length must not be used on `.frame` itself or outside a frame: there `cqw` would resolve
  against the viewport (no rule does so today).
- **The component showcase** (`pages/components/components.html`): `:root { --zoom: 1; --px: calc(var(--zoom) * 1px); }`,
  and the zoom control sets `--zoom` on `<html>` (0.5, 0.75, 1, 1.5, 2). At 1 one reference px is one CSS px, so a
  260 px button fits a phone. Chromium rounds border widths down (fact 1), so below 1 the 3 px outlines draw thinner; the
  page says so next to the control.

### E.4 Three rules for writing component CSS against these tokens

1. Read context-following colours from `--toy-ctx-*` in the rule that paints: `box-shadow: 0 var(--_rest) 0
   var(--toy-ctx-base)`. Never wrap a context variable in another custom property on `:root`; it would freeze the dark
   value (fact 1). This is also why no token is a composite that contains a context colour.
2. Write insets as `calc(var(--toy-…-inset-…) - var(--toy-stroke-…))` so the Godot content margin and the CSS box agree.
3. Anything that depends on the element (`--hp`, `--_rest`) is computed in the rule that uses it, never in a token.

## F. The pack for prime-game

### F.1 What it is

`dist/pack/pack.json`, one file, built with every token resolved. Today it holds tokens only; font files and icons
join it later (F.4). One file with the modes inside, not four files: the modifiers are orthogonal (rule 37 and the
build's disjointness check), so any permutation is the default tokens plus the override maps of the chosen contexts,
and the build verifies this for all four permutations before writing.

### F.2 Schema (version 1)

```json
{
  "format": "prime-game-ui.pack",
  "schema": 1,
  "version": "0.1.0",
  "style": "toy",
  "dtcg": "2025.10",
  "reference": { "width": 1920, "height": 1080 },
  "source": { "repo": "xperiaroco2/prime-game-ui", "resolver": "tokens/toy.resolver.json", "tokens_sha256": "<hex>" },
  "modifiers": {
    "textSize": { "default": "default", "contexts": ["default", "large"] },
    "motion": { "default": "default", "contexts": ["default", "reduced"] }
  },
  "tokens": {
    "palette.ink": { "type": "color", "value": { "hex": "#2a1f33", "rgba": [0.1647, 0.1216, 0.2, 1] } },
    "surface.hud": { "type": "color", "from": "palette.ink-86",
      "value": { "hex": "#2a1f33", "rgba": [0.1647, 0.1216, 0.2, 0.86] } },
    "surface.accent-pressed": { "type": "color", "from": "palette.honey", "proposal": "pressed look of flat yellow controls",
      "value": { "hex": "#c98a10", "rgba": [0.7882, 0.5412, 0.0627, 1] } },
    "radius.control": { "type": "dimension", "from": "px.18", "value": 18 },
    "font.size.md": { "type": "dimension", "value": 22 },
    "duration.press": { "type": "duration", "value": 70 },
    "ease.press": { "type": "cubicBezier",
      "value": { "bezier": [0, 0, 0.58, 1], "godot": { "trans": "TRANS_SINE", "ease": "EASE_OUT" } } },
    "font.weight.bold": { "type": "fontWeight", "value": 700 },
    "font.family.base": { "type": "fontFamily", "value": "Comfortaa" },
    "type.body": { "type": "typography",
      "value": { "font_family": "Comfortaa", "font_size": 22, "font_weight": 600, "letter_spacing": 0, "line_height": 1.25 } },
    "motion.press": { "type": "transition",
      "value": { "duration": 70, "delay": 0, "bezier": [0, 0, 0.58, 1], "godot": { "trans": "TRANS_SINE", "ease": "EASE_OUT" } } }
  },
  "modes": {
    "textSize": { "large": {
      "font.size.md": { "type": "dimension", "value": 28 },
      "type.body": { "type": "typography",
        "value": { "font_family": "Comfortaa", "font_size": 28, "font_weight": 600, "letter_spacing": 0, "line_height": 1.25 } } } },
    "motion": { "reduced": {
      "duration.press": { "type": "duration", "value": 0 },
      "motion.press": { "type": "transition",
        "value": { "duration": 0, "delay": 0, "bezier": [0, 0, 0.58, 1], "godot": { "trans": "TRANS_SINE", "ease": "EASE_OUT" } } } } }
  },
  "ramps": {
    "health": { "interpolation": "linear", "space": "srgb",
      "stops": [ { "offset": 0, "token": "fill.health.0" }, { "offset": 0.25, "token": "fill.health.25" },
                 { "offset": 0.5, "token": "fill.health.50" }, { "offset": 0.75, "token": "fill.health.75" },
                 { "offset": 1, "token": "fill.health.100" } ] }
  },
  "files": {}
}
```

Rules:
- **Keys** are DTCG paths with dots, in source order; every token is present (primitives too, so the mapping may name
  any of them). `from` is the immediate alias target (absent for literals); `proposal` copies the extension.
- **Values by type:** `color` → `hex` (6 digits, lowercase) and `rgba` (four floats 0..1, 4 decimals, alpha as
  authored); `dimension` → an int, px at the reference; `duration` → an int, ms; `cubicBezier` → `bezier` plus the
  `godot` pair (enum names of `Tween.TransitionType` and `Tween.EaseType`); `number`, `fontWeight` → a number;
  `fontFamily` → a string; `typography` and `transition` → one object with snake_case fields, resolved.
- **`modes`** holds, per non-default context, exactly the keys whose resolved value differs from the default.
- **`schema`** bumps only when this shape changes; the generator refuses a schema it does not know.
- **`tokens_sha256`** is the SHA-256 of the token sources concatenated in resolution order, for traceability.
- No `commit` field: the pack cannot know the commit that contains it; the lock file records it.

### F.3 What the generator in prime-game does with it (for the handoff issue)

Reads `pack.json` and its mapping table, then writes: `game_theme.tres` (default contexts; restore
`uid://c8behqt7jtcn8` with `ResourceSaver.set_uid`, godot-facts §9), `game_theme_large.tres` (textSize large, for the
text-size setting; swapping themes needs a `GameUi` change, godot-facts §8), and `health_ramp.tres` (the `Gradient` of
C.2). Motion values go into custom constants (`press_ms`, `press_ms_reduced`), so the reduced setting needs no second
theme. It computes `sink = elevation - elevation.pressed` and focus-ring radii (`r + focus.gap + focus.width`); it never
scales or invents values.

### F.4 Contents beyond tokens (later)

`files` maps a path inside the pack to `{ "sha256", "licence", "licence_file", "source" }`. Planned: Comfortaa's
variable TTF and its `OFL.txt` (SIL OFL 1.1, Reserved Font Name "Comfortaa", ship unmodified:
[ui-decisions](../../ui-decisions.md), Type), after the engineer approves that download batch (CLAUDE.md), and the
own-work SVG icons (crossed mic, slot items, room pictograms), licence "own work". The game credits them in
`docs/credits/` as it does for GdUnit4.

### F.5 The sync contract

1. **Release in prime-game-ui:** a human merges the PR, sets `tokens/VERSION`, and pushes the tag `ui-<VERSION>` on
   `main`. The tag workflow runs `check.js --release`.
2. **Copy into prime-game:** a runner command (proposed name `ui-sync`, a prime-game issue with the UI `area:` label)
   takes a tag, fetches `dist/pack/**` at that tag from `xperiaroco2/prime-game-ui`, copies it to
   `client/ui/theme/pack/`, verifies `files` hashes, and writes `client/ui/theme/pack.lock.json`:

   ```json
   { "repo": "xperiaroco2/prime-game-ui", "tag": "ui-0.1.0", "commit": "<40 hex>" }
   ```
3. **Generate:** the generator (`tools/theme/build_theme.gd` in prime-game, recommended) reads
   `client/ui/theme/pack/pack.json` and the **mapping table next to it** (`tools/theme/mapping.json`: token → type
   variation, base type, item; G lists the hints), and writes the theme files of F.3.
4. **Test in prime-game:** the lock's tag is `ui-` + `pack.version`; `schema` is supported; every token the mapping names
   exists; the committed theme equals a regenerated one.
5. Recommended: put a `.gdignore` in `client/ui/theme/pack/` so Godot imports nothing there (the generator reads it with
   `FileAccess`; fonts are copied to their runtime place by the generator, with their `.import` sidecars committed per the
   game's resource rules). Whether Godot would otherwise import `.json` files is (unconfirmed).

### F.6 Semver of the pack

Major: a token removed or renamed, a type changed, or `schema` bumped (the mapping can break). Minor: a token added.
Patch: values only. `check.js --release` diffs the new `pack.json` against the previous `ui-*` tag's and fails if
`VERSION` bumps less than that.

## G. Components

### G.1 The Toy state grammar (disabled and focus are proposals)

- **Raised toys** (primary, secondary and danger buttons; preset cards) have a base. Hover lifts, held sinks onto the
  base (D.3).
- **Flat controls** (ghost button, line chip, idle tab, field, quiet `?` key) have no base. **P:** hover fills the face
  with `surface.tile` and the label turns `text.on-bright`; nothing moves.
- **Flat yellow controls** (stepper, selected chip). **P:** held turns the face `surface.accent-pressed` (honey): the toy
  is pushed into its base colour. Hover changes nothing (already highlighted).
- **Disabled, "unplugged" (P):** no base and no motion; face `surface.tile-quiet`, outline `outline.quiet`, label
  `text.on-bright-muted` (5.88:1, above the 3:1 XAG asks of inactive text, lens 6). A flat control on its context keeps no
  fill and uses `ctx.text-muted` for label and line (11.29:1 on night, 6.22:1 on cream).
- **Focus (P):** a ring `focus.width` (3) wide, `focus.gap` (3) outside the face, radius = face radius + 6, colour
  `ctx.focus` (yellow on dark, ink on light: C.4 p1, p2); drawn over every state, keyboard and gamepad only. Godot: the
  `focus` StyleBox with `draw_center = false`, borders 3, `expand_margin_* = 6`, radii + 6 (godot-facts §3.2). CSS: a real
  child `<span class="toy-focus" aria-hidden="true">` absolutely placed at `inset: calc(-1 * (gap + width))` with the same
  border and radius, shown when the control has `data-focus="true"`; no `outline`, no pseudo-element (lint R02, R05).

Notation below: `ctx.X` is the context key (`--toy-ctx-X`; in Godot the `OnLight` variation takes `on-light.X`,
the plain one `on-dark.X`). `in a/b` = content inset block/inline. "Face" lists fill, outline (width colour), radius.

### G.2 Buttons

| Variant | Face | Label | Insets | Base |
|---|---|---|---|---|
| primary | `surface.accent`, `stroke.control` `outline.default`, `radius.control` | `text.on-bright`, `type.lead-strong` | `button.inset-block` / `-inline` | `button.primary.elevation`, `ctx.base` |
| secondary | `surface.tile`, same outline and radius | same | same | `elevation.raised`, `ctx.base` |
| danger **P** (Leave, Quit confirm; light context) | `surface.danger`, same | same (6.51:1) | same | `elevation.raised`, `ctx.base` |
| ghost | none, `stroke.control` `ctx.line`, `radius.control` | `ctx.text`, `type.caption` | same | none |

States: normal; hover (raised: lift; ghost **P**: `surface.tile` face, `text.on-bright` label); pressed (raised: sink;
ghost: as hover); disabled **P** (raised: unplugged; ghost: `ctx.text-muted` label and line); focus **P** (ring, radius
24). Why a danger variant: lens 3 asks for one for Leave and Quit, and toy.css already names coral the "danger edge"; a
different face colour on the one destructive action in a confirm dialog prevents a misclick, and coral keeps 6.51:1 with
the ink label. It is used only in light-context dialogs.

Godot: faces `ButtonPrimary`, `ButtonSecondary`, `ButtonDanger`, `ButtonGhost` → `Button`, each with an `…OnLight`
variation chained to it (`ButtonPrimaryOnLight → ButtonPrimary`) that overrides only `focus` (and, for ghost, colours
and `normal`). Items: `normal`, `hover`, `pressed`, `hover_pressed` (raised: all the same face; the motion is the
Tween), `disabled`, `focus`; content margins from the insets in every state (godot-facts §3.4: keep sums equal);
`font_color`, `font_hover_color`, `font_pressed_color`, `font_hover_pressed_color`, `font_focus_color`,
`font_disabled_color`; `font` = the weight's `FontVariation`, `font_size`; constants `align_to_largest_stylebox = 0`,
custom `lift`, `sink`, `press_ms`, `press_ms_reduced`. Bases (layer form, `Panel`): `ButtonBase` (honey, 18, N 5),
`ButtonPrimaryBase` (honey, 18, N 6), `ButtonBaseOnLight` and `ButtonPrimaryBaseOnLight` (ink); danger uses
`ButtonBaseOnLight`.

### G.3 Chips

| Variant | Face | Label | Insets |
|---|---|---|---|
| plate (role, ready "no", protected, "you are here") | `surface.hud`, no outline, `radius.pill` | `text.on-hud`, `type.caption` | `chip.inset-block` / `-inline` (border 0) |
| selected ("ready: yes", language, sub-tab) | `surface.accent`, `stroke.control` `outline.default` | `text.on-bright`, `type.caption-strong` | same insets |
| line (idle interactive) | none, `stroke.control` `ctx.line` | `ctx.text`, `type.caption` | same |
| sticker (NEW) | `surface.sticker`, `stroke.control` `outline.default` | `text.on-bright`, `type.label-strong` | same |

Interactive chips toggle between line and selected. States: hover **P** (line: tile face), pressed **P** (selected:
`surface.accent-pressed`), disabled **P** (`ctx.text-muted` label and line), focus **P** (radius pill + 6).
Godot: static `ChipPlate`, `ChipSticker` → `PanelContainer`; interactive `ChipToggle` (line look),
`ChipToggleSelected` (selected look), each with `OnLight` → `Button` with `toggle_mode`. A Button has one `font` for all
states, so the 600 → 700 change on selection is a variation swap on `toggled` in the component (allowed: it names a
variation, it overrides nothing).

### G.4 Hand and belt slots

Face `surface.hud`, `stroke.control` `outline.slot`, `radius.control`; size `slot.size` square, wide
`slot.wide-width` × `slot.size`; inset `slot.inset`. Label `text.on-hud` `type.label-strong`; an empty idle slot's label
is `text.on-hud-muted`. Active: `stroke.bold` `outline.selected`. Filled: an own-work icon tinted `text.on-hud`.
Showcase states: hand empty active, hand filled active, belt empty idle, belt filled idle, hand two-handed wide active
filled. Godot: `Slot`, `SlotActive` → `PanelContainer` (custom constants `width`, `height`, `wide_width`, read by the slot
component for `custom_minimum_size`); `SlotText`, `SlotTextIdle` → `Label`; the icon is a `TextureRect` with
`self_modulate` from `get_theme_color("icon", "Slot")`.

### G.5 Bars

| Bar | Track | Fill | Height | Fractions shown |
|---|---|---|---|---|
| HUD stamina | `surface.track-dark`, `stroke.control` `outline.default`, `bar.hud.radius` | `fill.stamina`, `bar.hud.fill-radius`, inside the outline | `bar.hud.height` | 0.9, 0.5, 0.18, 0 |
| HUD health | same | the C.2 ramp at `--hp` | same | 1, 0.8, 0.5, 0.22, 0.05, 0, plus the 21-step strip in the tokens section |
| progress (loading, downed, raising, task progress on dark) | `surface.track-dark`, no outline, `radius.pill` | `fill.progress`, pill | `bar.progress.height` | 0.62, 0.7, 0.6 |
| progress on light (sliders, task progress in panels) | `surface.track-light` | `fill.progress-on-light` | same | 0.7, 0.55, 0.4 |

At 0 the fill is not drawn (Godot draws nothing while `round(r·(W − mp))` is 0, godot-facts §6; CSS `width: 0`).
Godot: `BarHudStamina` → `ProgressBar` (`background` = track, `fill` with `expand_margin_* = -3`,
`content_margin_left/right = 3`, godot-facts §6); health = `BarHudTrack` (`ProgressBar`, value 0, track only) under
`BarHudHealth` (`ProgressBar`, `background` = `StyleBoxEmpty`, white fill, `self_modulate = health_ramp.sample(hp)`);
`BarProgress`, `BarProgressOnLight` → `ProgressBar` (height from content margins 5 + 5).

### G.6 Panel, HUD plate, dialog, title plate, logo

| Component | Face | Text | Insets | Base |
|---|---|---|---|---|
| menu panel | `surface.panel`, `stroke.surface` `outline.default`, `radius.surface` | context `on-light` | `panel.inset` | `elevation.surface`, `base.drop` (layer) |
| dialog | as menu panel, over `surface.backdrop` | title `type.heading` `ctx.title`; body `type.body` `ctx.text`; actions primary + ghost (danger **P** for confirms) | `dialog.inset` | as panel |
| HUD plate | `surface.hud`, no outline, `radius.large` | `text.on-hud`, `type.body` | `plate.inset-block` / `-inline` | none |
| HUD plate, solid (night) | `surface.hud-solid` | same | same | none |
| HUD plate, alert (downed) | + `stroke.surface` `outline.alert` | same | inset + `stroke.surface` | none |
| HUD label plate | `surface.hud`, `radius.small` | `text.on-hud`, `type.label` | 0 / `plate.label-inset-inline` | none |
| title plate | `surface.accent`, `stroke.surface` `outline.default`, `title-plate.radius` | `text.on-bright`, `type.display` | drawn outside the layout box by `stroke.surface` / `title-plate.inset-inline` | `elevation.surface`, `base.title` (layer) |
| logo | none | `on-dark.title`, `type.hero`, hard text shadow `0 logo.shadow-offset 0 base.title` | | |

Godot: `MenuPanel`, `DialogPanel`, `HowToPanel`, `MapBoard` → `PanelContainer`, base `PanelBase` → `Panel` (shade 60 %,
radius 24, N 10); `Plate`, `PlateSolid`, `PlateAlert`, `HudLabelPlate` → `PanelContainer`; `Backdrop`, `BackdropDeep`,
`NightBackdrop` → `Panel`; `TitlePlate` → `Label` (`normal` StyleBox with expand margins 4 / 36 instead of the CSS
negative margins, godot-facts §5) with `TitlePlateBase` → `Panel` (coral, radius 26, expand margins 36 left and right,
`-6` top, `14` bottom: the plate's expanded rect moved 10 down); `Logo` → `Label` (`font_shadow_color` coral,
`shadow_offset_x` 0, `shadow_offset_y` 6, `shadow_outline_size` 0). The game's existing variation names (`HudPanel`,
`LifePanel`, `TaskPanel`, `EscTab`, …) stay as thin variations chained to the new ones, so no screen breaks; the mapping
table lists them.

### G.7 Keycaps

| Variant | Face | Glyph | Size |
|---|---|---|---|
| on dark | `surface.panel`, sides and top `stroke.thin`, bottom `stroke.bold`, `outline.key-on-dark`, `radius.small` | `text.on-bright`, `type.caption-strong` | inline inset `key.inset-inline` **P**, min width `key.min-width` **P** |
| on light | `surface.tile`, `outline.default` | same | same |
| dim (quiet `?` on the map) | `surface.tile-quiet`, `outline.quiet` | `text.on-bright-muted` | same |
| wide (Space, Shift, Tab, Esc) | as on dark or on light | same | min width `key.wide-min-width` **P** |
| round `?` | as on light, `radius.pill`, width = height | same | |

Godot: `KeyCap`, `KeyCapOnLight`, `KeyCapQuiet` → `PanelContainer` (per-side borders 2/2/2/5; corners are circular in
Godot and elliptical in CSS where widths differ, godot-facts §2: compare in a shot); `KeyCapText` → `Label`; custom
constant `min_width`.

### G.8 How-to card

A light panel (`howto.inset`) with a title row (`type.heading` `ctx.title`; "how to" `type.caption` `ctx.text-muted`)
and a row of 3 to 4 frames (`gap.row`). Frame: `surface.tile`, `stroke.control` `outline.default`, `radius.large`,
inset `howto.frame-inset`, art strokes `outline.default` (own-work SVG from the wireframes), caption `type.caption-strong`
`text.on-bright`, `gap.caption` between. Done frame: `surface.done`. Showcase: a 4-frame card with the 4th done, and a
3-frame card with the 2nd done. Godot: `HowToPanel`, `HowToFrame`, `HowToFrameDone` → `PanelContainer`; `HowToCaption`
→ `Label`.

### G.9 Field

Face `surface.tile`, `stroke.control` `outline.default`, `radius.medium`; insets `field.inset-block` / `-inline`; text
`text.on-bright` `type.body-strong`; caret `outline.default`; selection `surface.accent`. States: normal (value), empty
with placeholder **P** (`text.on-bright-muted`), focus **P** (ring radius 18), read-only **P** (`surface.tile-quiet`,
`outline.quiet`, text `text.on-bright`), disabled **P** (read-only face, `text.on-bright-muted`), error **P**
(`outline.error`; 4.27:1 on the white face). On dark (main-menu name over the backdrop) and on light (settings).
Godot: `Field`, `FieldOnLight` → `LineEdit` (`normal`, `read_only`, `focus` drawn over `normal`,
godot-facts §7; `font_color`, `font_placeholder_color`, `font_uneditable_color`, `caret_color`, `selection_color`). An
error look is a variation swap (`FieldError`) by the screen.

### G.10 Tabs (Esc menu)

Idle: no fill, border 0, `tab.radius`, insets `tab.inset-block` / `-inline`, label `ctx.text` `type.lead`. Selected:
`surface.accent`, `stroke.control` `outline.default`, base `tab.elevation` `ctx.base` (merge form), label
`text.on-bright` `type.lead-strong`. States: hover **P** (idle: tile face), pressed (held: selected look, no base),
disabled **P** (`ctx.text-muted`), focus **P** (radius 20). Godot: `Tab` and `TabSelected` → `Button` with `toggle_mode`
(the weight changes, so the component swaps the variation on `toggled`, as for chips); `TabSelected`'s StyleBoxes use the
merge form: `expand_margin_bottom = 4`, `border_width_bottom = 7`, content margins set to 10 / 16 / 10 / 16.

### G.11 Setting row and stepper

Row: `surface.tile`, bottom border `stroke.control` `outline.divider` (bottom only), `radius.medium`, insets
`setting-row.inset-top` / `-inline` / `-bottom`, `gap.row`; label `type.body` `text.on-bright`; value
`type.body-strong` `text.on-bright` with `gap.value`. Variants: host (stepper), guest (read-only value), with a field,
with a slider (progress on light). Stepper `‹ ›`: `surface.accent`, `stroke.thin` `outline.default`, `radius.pill`,
inset 0 (the border) / `stepper.inset-inline`, label `type.body-strong` `text.on-bright`. States: hover (no change),
pressed **P** (`surface.accent-pressed`), disabled **P** at min, max or for a guest (unplugged colours), focus **P**.
Godot: `SettingRow` → `PanelContainer`, `SettingValue` → `Label`, `Stepper` → `Button` with text glyphs (a SpinBox would
need arrow textures, godot-facts §7).

### G.12 Preset card

| Variant | Face | Text | Base |
|---|---|---|---|
| idle | `surface.tile`, `stroke.control` `outline.default`, `radius.large`, inset `card.inset` | title `type.body-strong` `text.on-bright`; detail `type.caption` `text.on-bright-muted` | `elevation.raised`, `ctx.base` |
| selected | `surface.accent`, `stroke.surface` `outline.default`, inset `card.inset` (padding 10) | detail `text.on-accent-muted` | same |
| quiet ("save your own") | `surface.board`, `stroke.control` `outline.quiet` | `text.on-bright-muted` | none |

States: hover **P** (lift), pressed (sink to `card.elevation-pressed`), disabled **P** (guest: unplugged), focus **P**
(radius 22). Selected keeps the idle outer size: a toggle `Button` takes its minimum size from one StyleBox
(godot-facts §3.4), so the two states must have equal content margins (intended change, I.2). Godot: `PresetCard` →
`Button` (`toggle_mode`; `normal` idle, `pressed` and `hover_pressed` selected), `PresetCardQuiet` → `Button`; base
`CardBase` → `Panel` (ink, radius 16, N 5).

### G.13 Map room and you-are-here pin

Board as G.6 (`MapBoard`). Room: `surface.panel`, `stroke.control` `outline.default`, `radius.medium`, inset
`room.inset`, name `type.label-strong` `text.on-bright`, pictogram strokes `outline.default`. Lit zone:
`surface.zone`, `stroke.surface` `outline.default`, `radius.medium`. Pin: `surface.pin`, `stroke.control`
`outline.default`, `pin.size` square, radii 0 (top left, the point) and `pin.radius`; rotated at runtime (80° in the
sample; lint allows `rotate`, Godot `rotation` or `offset_transform_rotation` in containers). "You are here" chip: a
plate chip on the board (9.83:1). Godot: `MapRoom` → `PanelContainer`, `MapRoomName` → `Label`, `MapZone`, `MapPin` →
`Panel`.

### G.14 Mic

Plate circle: `surface.hud`, `mic.size`, `mic.radius`. On: own-work mic icon tinted `text.on-hud`. Off **P**: own-work
crossed-mic icon tinted `outline.alert` (coral, 4.71:1 on the plate; the toy.css comment planned exactly this, and it
replaces the wireframe's pseudo-element slash). Godot: `MicPlate` → `PanelContainer` with custom colours `icon_on`,
`icon_off`; the icon is a `TextureRect`.

### G.15 Name plate

`surface.hud`, `radius.pill`, insets `chip.inset-block` / `-inline`, name `type.caption-strong` `text.on-hud`.
Variants: plain, with the teammate mark (only a dissident sees it, [#257](https://github.com/xperiaroco2/prime-game/issues/257)),
a long Ukrainian name. Godot: `NamePlate` → `PanelContainer`, `NamePlateText` → `Label`; the mark is an icon.

## H. The showcase page: `pages/components/`

| File | What |
|---|---|
| `showcase.json` | the catalogue: sections → rows (component, variant, contexts, states, label key, Godot hint, proposal flag) |
| `strings.json` | sample labels `{ "uk": {…}, "en": {…} }` (reuse the wireframes' `EN` map wording where it exists) |
| `page.html` | the template: Ukrainian page chrome, the sticky bar, page-chrome CSS (the artifact theming contract: chrome colours on `:root`, dark mode under `prefers-color-scheme` guarded by `:root:not([data-theme="light"])` and `:root[data-theme="dark"]`, body background), the script |
| `components.css` | hand-written component CSS, lint profile `component`, classes `.toy-<component>` |
| `components.motion.css` | lift and sink, lint profile `motion` |
| `icons/*.svg` | own-work icons; each file starts with a comment naming it own work |
| `build.js` | inlines `dist/css/toy-tokens.css`, both CSS files, the icons and strings into `components.html`; `--check` |
| `components.html` | the generated page, committed, published as a private claude.ai artifact |

`showcase.json` row shape:

```json
{ "id": "button-primary", "component": "button", "variant": "primary", "contexts": ["dark", "light"],
  "states": ["normal", "hover", "pressed", "disabled", "focus"], "live": true, "label": "start",
  "godot": "ButtonPrimary → Button · base ButtonPrimaryBase → Panel", "proposals": ["disabled", "focus"] }
```

The same file can later drive the Godot showcase scene in prime-game (lens 3 §5), so both show the same list.

**Markup.** `<button class="toy-button" data-variant="primary" data-state="hover" data-focus="false">`. One code path
for static and live: CSS styles `data-state` (`normal`, `hover`, `pressed`, `disabled`) and `data-focus`; toggles use
`aria-pressed="true"` for "selected". Every state is rendered statically side by side (columns: звичайна, наведення,
натиснута, вимкнена, фокус), then a live sample. Live samples get `data-state` from pointer events of every pointer type
(`pointerenter` → hover for mouse and pen; `pointerdown` → pressed; `pointerup`, `pointercancel`, `pointerleave` → back),
so hover and press work on a phone; `focus` and `blur` set `data-focus` only for keyboard focus (`:focus-visible`
matched in the handler).

**Stages.** Each row shows the component on its contexts: dark stage `surface.night` with HUD components also over the
three world samples of `gates.json` (white, `#c9c9c9`, `#979797`, as flat swatches: the world is not UI, so no
gradient), light stage `surface.panel` with class `toy-on-light`. Stages scroll sideways when zoomed.

**Controls in the sticky bar** (labels Ukrainian): Мова зразків UA / EN (only the sample labels change); Розмір тексту:
звичайний / великий (`data-text-size` on `<html>`); Рух: звичайний / менше (`data-motion`; default follows the OS);
Масштаб 50 / 75 / 100 / 150 / 200 % (`--zoom`, with the border-rounding note under 100 %); a section nav. Choices persist
in `localStorage` inside try/catch and the page renders without it.

**Sections**, in order: Токени (palette swatches with names and hex; the type scale at both sizes; the health strip at
0.05 steps with each ratio; the contrast table from the gates' last run, embedded by `build.js` from a JSON the gates
write to `dist/gates.json`), Кнопки, Чипи, Слоти, Смуги, Панелі й плашки, Клавіші, Картки «як робити», Поле, Вкладки,
Рядок налаштувань і степер, Картки пресетів, Карта, Мікрофон, Табличка з іменем. Every component has a one-line Godot
note and a «пропозиція» badge on each proposed state, so the engineer sees what to answer. Layout works at phone width
with a 16 px gutter; only the stages scroll sideways.

## I. Migrating `toy.css` onto the tokens

### I.1 Mechanics

- `build-styles-page.js` reads paths from `__dirname` (today it needs `pages/styles` as cwd), inlines
  `dist/css/toy-tokens.css` and `:root { --px: calc(1cqw / 19.2); }` **before** the three skins, and gains `--check`.
- `toy.css` keeps every selector and the `body[data-style="toy"]` scope; every value becomes a token, `calc()` of tokens,
  or a context variable. Its own variable block (lines 11-41) goes; the light context becomes:

```css
body[data-style="toy"] .frame { color: var(--toy-ctx-text); font-weight: var(--toy-font-weight-semibold); }
body[data-style="toy"] .frame .panel,
body[data-style="toy"] .frame .map {
  --toy-ctx-text: var(--toy-on-light-text);
  --toy-ctx-text-muted: var(--toy-on-light-text-muted);
  --toy-ctx-title: var(--toy-on-light-title);
  --toy-ctx-line: var(--toy-on-light-line);
  --toy-ctx-base: var(--toy-on-light-base);
  --toy-ctx-focus: var(--toy-on-light-focus);
  color: var(--toy-ctx-text);
}
body[data-style="toy"] .frame .btn {
  background: var(--toy-surface-tile);
  color: var(--toy-text-on-bright);
  border: var(--toy-stroke-control) solid var(--toy-outline-default);
  border-radius: var(--toy-radius-control);
  padding: calc(var(--toy-button-inset-block) - var(--toy-stroke-control))
           calc(var(--toy-button-inset-inline) - var(--toy-stroke-control));
  box-shadow: 0 var(--toy-elevation-raised) 0 var(--toy-ctx-base);
  font-weight: var(--toy-font-weight-bold);
}
body[data-style="toy"] .frame .chip {
  background: var(--toy-surface-hud);
  color: var(--toy-text-on-hud);
  border: 0;
  padding: var(--toy-chip-inset-block) var(--toy-chip-inset-inline);
}
```

- Text classes: `.t16` … `.t96` set `font-size: var(--toy-type-<style>-font-size)` for all sizes (today only `.t16`
  and `.t18` are set by Toy; the others come from the wireframe at the same values), so the frames would follow a text
  size mode if one were added.
- Map: palette names → semantic roles as in B.5 (`#F3EDF6` → `--toy-surface-tile-quiet`, `#E2D6EA` →
  `--toy-outline-divider`, `#4A3B55` → `--toy-text-on-accent-muted`, `rgba(38,28,48,.70/.80)` →
  `--toy-surface-backdrop(-deep)`, `rgba(15,10,20,.6)` → `--toy-base-drop`, `rgba(255,194,58,.55)` → `--toy-surface-zone`).
  Cards and the selected tab take `--toy-ctx-base` (ink in panels, as today). The checklist's current step uses
  `--toy-on-dark-title`. The `[style*=…]` hacks keep their selectors and `!important` with token values.
- `motion-preview.css` (motion profile):

```css
body[data-style="toy"] .frame .btn:not(.ghost),
body[data-style="toy"] .frame .card:not(.dimtext) {
  --_rest: var(--toy-elevation-raised);
  cursor: pointer;
  transition: transform var(--toy-motion-press-duration) var(--toy-motion-press-timing-function),
              box-shadow var(--toy-motion-press-duration) var(--toy-motion-press-timing-function);
}
body[data-style="toy"] .frame .btn.fill { --_rest: var(--toy-button-primary-elevation); }
body[data-style="toy"] .frame .btn:not(.ghost):hover {
  transform: translateY(calc(-1 * var(--toy-elevation-lift)));
  box-shadow: 0 calc(var(--_rest) + var(--toy-elevation-lift)) 0 var(--toy-ctx-base);
}
body[data-style="toy"] .frame .btn:not(.ghost):active {
  transform: translateY(calc(var(--_rest) - var(--toy-elevation-pressed)));
  box-shadow: 0 var(--toy-elevation-pressed) 0 var(--toy-ctx-base);
}
body[data-style="toy"] .frame .card:not(.dimtext):active {
  transform: translateY(calc(var(--_rest) - var(--toy-card-elevation-pressed)));
  box-shadow: 0 var(--toy-card-elevation-pressed) 0 var(--toy-ctx-base);
}
```

  The `@media (prefers-reduced-motion)` block goes: the tokens file sets the duration to 0 under the same query.
- `retro.css`, `card.css` and `meta.json` do not change (meta.json's Toy entry is stale, inventory §1.6; it stays as the
  record of the choice).

### I.2 Every intended visual change

| # | Change | Where it shows | Why |
|---|---|---|---|
| 1 | `letter-spacing` removed: +0.01em on `.t16`, `.t18` (+0.18, +0.2 px) and −0.01em on 36 px and up (−0.36 to −0.96 px) | all text, sub-pixel | Godot's `spacing_glyph` is an int (godot-facts §5); DTCG typography still needs `letterSpacing`, so it is `{0, px}` |
| 2 | Health colour: sRGB between Oklab-sampled stops instead of `color-mix(in oklab)`: 80 % `#92BA4C` → `#8FBA4C`, 22 % `#E87D46` → `#E87C47` | s7 health fill | one formula both sides run (C.2) |
| 3 | Selected preset card keeps the idle outer size: padding 12 → 10 inside its 4 px border (2 px smaller each side) | s5 host | a toggle Button cannot change size between states (G.12) |
| 4 | Press: buttons travel `N − 1` (4 / 5 px, was 5 / 6) and the base stays still; a held card shows a 2 px base (was the whole card and base moving 3 px); the quiet card no longer moves | live hover/press only | the base is a separate layer in Godot (D.2, D.3; godot-facts §4) |
| 5 | Dead rules `.marker` and `.circ` removed | none (no frame uses them, inventory §4) | |
| 6 | Transparent 3 px borders on chips and idle tabs → border 0 with the 3 px in the padding | none (the background is painted under the border box) | lint R07, godot-facts table |
| 7 | Literals and palette variables → semantic tokens with the same values; card and tab bases → `ctx.base` | none | |

### I.3 Proving it: `node tools/pages/snapshot.js --base <git ref>`

1. Writes two copies of the styles page into the OS temp folder: `git show <ref>:pages/styles/styles.html` (before)
   and the working tree's (after), each with an injected harness script and `.frame { width: 1920px !important }`, so one
   reference px is exactly one CSS px.
2. The harness sets `data-style="toy"`, then for every `section.screen` clicks each state button (`.seg [data-s]`), and
   for every visible element under the section's `.frame` records a path (section, state, child-index path), its
   bounding box relative to the frame (2 decimals) and the computed values of: `color`, `background-color`,
   `border-*-width`, `border-*-color`, `border-*-style`, the four radii, `box-shadow`, `text-shadow`, `padding-*`,
   `margin-*`, `font-size`, `font-weight`, `font-family`, `letter-spacing`, `line-height`, `transform`, `opacity`.
   It writes the JSON into a `<pre id="snapshot">`.
3. Runs `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe --headless=new --disable-gpu --no-first-run
   --user-data-dir=<temp> --host-resolver-rules="MAP * ~NOTFOUND" --virtual-time-budget=5000 --dump-dom <file>` for each
   copy (`Start-Process -Wait` with redirected output: launched from Git Bash the dump came back empty in my test). The
   blocked hosts make both runs use the same fallback font instead of a Google Fonts race.
4. Diffs the two snapshots (lengths within 0.01 px, colours exact), removes every difference matched by
   `tools/pages/intended-changes.json` (rows 1-3 of I.2, keyed by section, state, element path and property), prints the
   rest and exits 1 if any remain. The PR pastes its output. Row 4 is not visible at rest; the showcase shows it.

## Parallel work: four builders, one contract

The contract is this document's names: token paths (B), CSS variable names (E.2), the pack shape (F.2), the lint ids and
targets (A.3), the gates file (C.4) and the class and data attributes of H. Each builder owns its files only.

| Builder | Owns | Can start from |
|---|---|---|
| 1. Tokens | `tokens/**` (except `gates.json`), `tools/lib/strict-json.js`, `tools/tokens/build.js`, `tools/tokens/lib/**`, `tools/tokens/test/**`, `dist/css/**`, `dist/pack/**` | B and F |
| 2. Checks | `tokens/gates.json`, `tools/lib/color.js`, `tools/tokens/gates.js`, `dist/gates.json`, `tools/lint/**`, `tools/check.js`, `.github/workflows/check.yml` | a hand-written sample `pack.json` and `toy-tokens.css` in its own test fixtures |
| 3. Showcase | `pages/components/**` | E.2 names; a stub of `dist/css/toy-tokens.css` until builder 1 lands |
| 4. Migration | `pages/styles/toy.css`, `motion-preview.css`, `build-styles-page.js`, `styles.html`, `tools/pages/**` | E.2 names and I |

Merge order: 1, then 2, then 3 and 4 in either order, each rebased and green on `node tools/check.js`. Look questions
go to prime-game-ui#5; what the game needs becomes prime-game issues (base size 1920×1080, `ui-sync`, the generator and
mapping, the toy-press component with the base layer, the theme swap for large text), each noted on #150.

## Proposals the engineer answers (look)

1. **Disabled = "unplugged":** no base, pale lilac face `#F3EDF6`, muted plum outline and label `#64566F`.
2. **Focus ring:** 3 px wide, 3 px outside the face, the face's rounded shape; yellow on dark, ink on light.
3. **Flat controls on hover** (ghost button, line chip, idle tab, quiet `?` key): the face fills white.
4. **Flat yellow controls while held** (stepper, selected chip): the face turns honey `#C98A10`.
5. **Danger button** for Leave and Quit confirmations: coral face, ink outline and label, ink base.
6. **Selected preset card** the same size as an idle one (inner padding 10 inside its 4 px border).
7. **Press:** the base stays still (buttons sink 4 or 5 px, cards 3 px onto a 2 px base); the quiet card does not move.
8. **Large text:** ×1.25 for 18 to 36 px text, 48 / 64 / 96 unchanged.
9. **Lilac on the menu backdrop over a white wall** is 3.93:1 (waived in the gate until decided): raise `.dim` to 74 %,
   lighten the lilac, or use cream for that text.
10. **Field error outline** coral-deep `#D9482F`; **keycap sizes** in px (min width 36, wide 72, side inset 10);
    **muted mic** as a crossed-mic icon in coral.
11. Kept as they are, for a later look pass: the four near-identical plums and four pale lilacs (inventory §0), radius 18
    on buttons and slots, the 4/5/6 base heights, 14 px swatch numbers and 18 to 20 px HUD labels (lens 6 asks 24).

## Risks

- **Reference size:** until the game's base moves to 1920×1080 every int scales by 0.6 in Godot (godot-facts §8).
- **The layer base is component code in prime-game:** a wrapper per pressable and per panel, `offset_transform_enabled`
  must be set (fact 4), and whether `button_down` fires for keyboard and gamepad activation is (unconfirmed); the
  `draw` + `get_draw_mode()` path covers hover and press for all inputs.
- **Variation swaps on toggle** (tabs, chips) are needed because a Button has one font for all states.
- **Node 20 is end of life** (fact 7); CI keeps the repo rule, the scripts must stay 22/24-compatible.
- **The x15 waiver** keeps CI green over a known 3.93:1 text pair until the engineer decides.
- **Chromium rounds border widths down** below 100 % zoom on the showcase (fact 1); fidelity reviews should use 100 % or
  more.
- **`color-mix` and `clamp()` in a percentage** need a current browser; the frames already depend on `color-mix`.
- **A `cqw` length outside a frame** resolves against the viewport; the lint cannot see where a rule's element sits, so
  the frame rules must keep their `.frame` scope.
- **The zero-change proof** depends on local Edge and fixed fonts; it is a PR proof, not a CI gate.
- **Godot importing pack JSON** in `res://` is (unconfirmed); the `.gdignore` avoids the question.

## Sources

- Ground work: [godot-facts.md](godot-facts.md), [dtcg-facts.md](dtcg-facts.md), [inventory.md](inventory.md),
  [inventory.json](inventory.json), [lens 3](../2026-10-02-wave-1/lens-3-system.md), [lens 6](../2026-10-02-wave-1/lens-6-a11y.md),
  [ui-decisions](../../ui-decisions.md).
- DTCG 2025.10: [Format](https://www.designtokens.org/tr/2025.10/format/), [Color](https://www.designtokens.org/tr/2025.10/color/),
  [Resolver](https://www.designtokens.org/tr/2025.10/resolver/) (rules as quoted in dtcg-facts).
- Godot 4.7.2-stable: [gradient.h L75-L207](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/gradient.h#L75-L207),
  [Control.xml L1161-L1195](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Control.xml#L1161-L1195),
  [BaseButton.xml L25-L94](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/BaseButton.xml#L25-L94),
  [StyleBoxFlat.xml L146-L149](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/StyleBoxFlat.xml#L146-L149);
  the API dump `D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json` (class names, `Control.offset_transform_*`,
  `BaseButton` signals and `DrawMode`).
- CSS at csswg-drafts `dddf78d1`: [css-color-5 Overview.bs L240-L330](https://github.com/w3c/csswg-drafts/blob/dddf78d1aec8935ae6fdb836e38459142e58dc59/css-color-5/Overview.bs#L240-L330),
  [css-color-4 Overview.bs L5189-L5218](https://github.com/w3c/csswg-drafts/blob/dddf78d1aec8935ae6fdb836e38459142e58dc59/css-color-4/Overview.bs#L5189-L5218);
  [CSS Easing 1 §2.2](https://www.w3.org/TR/css-easing-1/#cubic-bezier-easing-functions).
- [WCAG 2.2 relative luminance](https://www.w3.org/TR/WCAG22/#dfn-relative-luminance).
- [nodejs/Release schedule.json](https://github.com/nodejs/Release/blob/main/schedule.json);
  [actions/setup-node v7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0);
  [actions/checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1);
  [prime-game ci.yml](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/.github/workflows/ci.yml).
- Local tests (2026-10-03, nothing saved in either repo): headless Microsoft Edge on a throwaway page (fact 1); node
  scripts for the health ramp, the stop counts and every contrast ratio above.
