# Architecture A: Toy tokens, Godot first

Research for [prime-game-ui#5](https://github.com/xperiaroco2/prime-game-ui/issues/5): DTCG 2025.10 tokens and components
for the chosen style Toy ([`docs/ui-decisions.md`](../../ui-decisions.md), Style). This is one of two independent
architectures. Its angle is **Godot first**: the component tier is shaped so that the later Theme generator in
prime-game maps it one to one. Each component variant is a future type variation. Each state is one `StyleBoxFlat`
with exactly the properties `StyleBoxFlat` has, plus the font colour of that state. The semantic tier is thin. Where
CSS and Godot disagree, the design follows what Godot draws exactly, and the CSS mock-up is changed to show that.

**Inputs read:** [`godot-facts.md`](godot-facts.md), [`dtcg-facts.md`](dtcg-facts.md), [`inventory.md`](inventory.md)
and [`inventory.json`](inventory.json), [`toy.css`](../../../pages/styles/toy.css),
[`motion-preview.css`](../../../pages/styles/motion-preview.css), [`check_styles.js`](../../../pages/styles/check_styles.js),
[`build-styles-page.js`](../../../pages/styles/build-styles-page.js), [`wireframes.html`](../../../pages/wireframes/wireframes.html),
[lens 3](../2026-10-02-wave-1/lens-3-system.md) and [lens 6](../2026-10-02-wave-1/lens-6-a11y.md). I also checked the
game repo (read only, `main` = `83a2c2f`) and the 4.7.2 API dump (`D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json`)
for the extra members this design uses (listed in §4.4).

**Computed values** (the 21 health stops, contrast ratios, the easing fit) come from throwaway node 20 scripts in the
session scratchpad. They use the CSS Color 4 OKLab matrices and the WCAG 2.x formula from `tools/a11y/contrast.js`.
Godot was not run.

**Conventions.** px are reference px at 1920×1080. **(P)** marks a value I added where a state was missing. Each (P)
is a proposal for the engineer and is marked in the token files (§2.1). `p.x` is short for `{palette.x}` and `c.x` for
`{color.x}`. Box values use the CSS order: one value means all sides, `a b` means block then inline, `a b c` means top,
inline, bottom, and `a b c d` means top right bottom left. Radii are TL TR BR BL.

---

## 0. The decisions on one screen

| # | Question | Decision | Why |
|---|---|---|---|
| 1 | Reference scale | Tokens are px at **1920×1080**. The pack says so. The generator refuses to run while the game's viewport base is not 1920×1080 | One mock-up px = 1 Godot px, so every int stays an int. At today's 1152×648 base every border, radius and font size would be ×0.6 and rounded ([godot-facts §0, §8](godot-facts.md#8-scaling-and-text-size)) |
| 2 | Tiers | primitive → semantic (thin: colour roles, type roles, motion) → component (StyleBoxFlat records) | The game reads the component tier. The semantic tier only holds what several components share or what switches by context |
| 3 | Component shape | `<component>.<variant>` = one type variation. Its children named after Godot StyleBox items (`normal`, `hover`, `pressed`, `hover-pressed`, `disabled`, `focus`, `panel`, `fill`, `background`, `read-only`) hold StyleBoxFlat fields plus `font-color` | One-to-one: `button.primary.hover.bg-color` → `ToyButtonPrimary/styles/hover` → `bg_color` |
| 4 | Geometry in components | Integer px literals in the component tokens. Colours and type are always aliases | In Godot, geometry is per-StyleBox data. A value-named primitive adds nothing, and a role-named one is a component token in disguise. Colours stay a closed palette, so no colour can be invented |
| 5 | The toy base | **Never a StyleBoxFlat shadow.** It is drawn exactly in one of two ways. (a) **Base node:** a wrapper `PanelContainer` whose `panel` StyleBox is the face's shape moved down by the depth. Used by every pressable toy and every base whose colour differs from the outline. (b) **Border base:** a thicker bottom border plus `expand_margin_bottom`, inside the state StyleBox. Used only by the selected Esc tab | `shadow_size ≥ 1` adds a 1 px linear fade ([godot-facts §1.2–1.3](godot-facts.md#13-the-closest-match-for-the-toy-base)). On night the ink outline nearly vanishes (1.25:1), so a 50 % honey or coral fringe would read as a glowing rim. Both ways are exact for any colour |
| 6 | Press motion | The face moves by a **visual-only offset** (`Control.offset_transform_position`). A shared `ToyPress` component tweens it for 70 ms, TRANS_SINE + EASE_OUT. The offsets per interaction state are theme constants on the variation. The base node stays still | Layout and the hit area do not move ([godot-facts §4](godot-facts.md#4-the-press-motion-hover-lifts-1-px-press-sinks-onto-the-base-in-70-ms), option B). The `focus` StyleBox moves with the face, because Button draws it in its own canvas item (read from the code godot-facts cites; not run). No `add_theme_*_override` is needed |
| 7 | Easing token | `cubicBezier [0.33, 0.52, 0.64, 1]` with `$extensions` `{trans: TRANS_SINE, ease: EASE_OUT}` | This curve is the CSS image of Godot's pair: largest progress error 0.0005 (computed). CSS `ease-out` differs from SINE/OUT by 0.024 |
| 8 | Health colour | 21 stops (every 0.05) computed once by the build in OKLab from the engineer's two endpoints. Both CSS and Godot draw the **nearest stop's hex**: `step = floor(hp × 20 + 0.5)` | Exact in both engines, with no runtime colour maths. The largest difference from a continuous OKLab mix is ΔE_ok 0.0067, under the ~0.02 just-noticeable step (computed). All 21 stops are ≥ 3.25:1 on the dark track |
| 9 | Disabled look (P) | **Sunk flat and faded:** the face drops by the full depth onto its base, with a lavender face and muted-plum text and outline | It reads as a toy pushed into the board, uses existing colours, and needs no extra node |
| 10 | Focus look (P) | **The outline thickens inward by 3 px** (a `focus` StyleBox drawn over the face). On small controls (chips, stepper, radio) it is a 3 px ring outside at a 2 px gap | It moves with the face (decision 6), never touches the base, and works on any background. Contrast is 9.71 to 15.94:1 (§4.5) |
| 11 | Toggles | A toggle keeps the **normal state's size and font weight** in every state. Selection shows through face colour, outline and base only | Godot has one `font` per variation, and toggling only redraws, so the minimum size comes from `normal` ([godot-facts §3.4](godot-facts.md#34-minimum-size)) |
| 12 | Modes | Resolver modifiers `textSize` (default, large (P) ×1.25) and `motion` (default, reduced = 0 ms). They are orthogonal | [dtcg-facts §5](dtcg-facts.md#5-the-resolver-module); the validator proves orthogonality |
| 13 | Pack | **One file** `dist/pack/toy.pack.json`. It holds the default permutation, flat and resolved, plus per-context overrides | The generator builds the default theme and one overlay theme per non-default context |
| 14 | CSS lengths | Length variables are **unitless ints**. Every use site writes `calc(var(--toy-…) * var(--px))`. `--px` is `calc(1cqw / 19.2)` on frames and `calc(var(--zoom) * 1px)` in the showcase | A custom property substitutes its `var()`s on the element that declares it, before inheritance ([css-variables-1 §2](https://www.w3.org/TR/css-variables-1/#defining-variables)). A length variable that already contains `var(--px)` would freeze `--px` at `:root` |
| 15 | Build | Zero-dependency node 20 under `tools/`. Outputs are committed under `dist/`. `--check` fails when an output is stale. `node tools/check.js` runs everything | The repo rule (node 20, no packages); [lens 3 §2](../2026-10-02-wave-1/lens-3-system.md) |

---

## 1. Files, build, lint, gates, CI (A)

### 1.1 Layout

```
tokens/                                  DTCG 2025.10 sources: the single source of truth
  prime.resolver.json                    sets.base + modifiers textSize, motion
  primitives.tokens.json                 palette, font family/weights/spacing/line height, easing, focus width
  semantic.tokens.json                   colour roles, type roles, motion.press
  components/                            one file per component root group, alphabetical
    backdrop.tokens.json  bar.tokens.json  button.tokens.json  chip.tokens.json  field.tokens.json
    howto.tokens.json  hud.tokens.json  keycap.tokens.json  map.tokens.json  mic.tokens.json
    name-plate.tokens.json  panel.tokens.json  pick.tokens.json  plate.tokens.json  preset-card.tokens.json
    setting-row.tokens.json  slot.tokens.json  stepper.tokens.json  tab.tokens.json  title.tokens.json
  text-size/default.tokens.json  text-size/large.tokens.json
  motion/default.tokens.json     motion/reduced.tokens.json
  gates.json                             contrast gate declarations and waivers (not a DTCG file)
  release.json                           {"version": "0.1.0"}: the semver the next ui-<semver> tag must carry
tools/
  check.js                               the one entry point
  lib/json-strict.js                     RFC 8259 parser that rejects duplicate keys, with JSON Pointers in errors
  lib/color.js                           sRGB <-> OKLab (CSS Color 4 matrices), WCAG 2.x ratio, alpha compositing
  tokens/api.js                          load() for the lint, gates and pages (§1.8)
  tokens/validate.js  resolve.js  expand.js  emit-css.js  emit-pack.js  build.js
  tokens/test/run.js  tokens/test/fixtures/{good,bad}/…        validator self-tests
  lint/godot-css.js  lint/rules.js  lint/fixtures/{good,bad}/*.css
  contrast/gates.js
  visual/probe.js  visual/compare.js  visual/intended-changes.css   (local proof, Edge, not in CI)
  a11y/                                  unchanged
dist/                                    generated and committed: never edited by hand
  css/toy-tokens.css                     every token as a CSS variable, plus the mode blocks
  css/toy-components.css                 one class per type variation, every state (§5.4)
  pack/toy.pack.json                     the game's pack (§6)
pages/components/                        the showcase (§8)
  build.js  showcase.json  strings.json  page.css  page.js  icons/*.svg  icons/LICENCES.json  components.html
pages/styles/                            toy.css and motion-preview.css migrated (§9); retro.css, card.css,
                                         meta.json, check_styles.js frozen
.github/workflows/check.yml
```

### 1.2 The token build: `node tools/tokens/build.js [--check]`

- **Inputs:** `tokens/prime.resolver.json` and every file it references. Every `*.tokens.json` must be reachable from
  the resolver ([dtcg-facts §9](dtcg-facts.md#9-validator-checklist) item 3).
- **Steps:**
  1. **Parse** strictly with duplicate keys rejected.
  2. **Validate** against the 39-item checklist in dtcg-facts §9, plus the Godot profile in §10 below.
  3. **Resolve** the 4 permutations: textSize × motion, defaults first, aliases only after the merge.
  4. **Expand** components (§7.0). Shorthands become per-side fields. Missing states are filled from `normal`.
     `draw-center` is derived. The health ramp stops are computed.
  5. **Emit** the three `dist/` files.
- **Determinism:** LF line endings and a trailing newline. Keys follow source order in CSS and are sorted in the pack.
  Colour floats get 4 decimals. No timestamps, no commit ids. Running the build twice gives the same bytes.
- **`--check`:** does steps 1 to 4, renders every output in memory and compares it with the file on disk. It exits 1
  and names each stale or missing file. Without the flag, it writes the files and prints a summary: token counts per
  tier, variations, proposals and permutations.
- **Self-tests:** `node tools/tokens/test/run.js` checks the fixtures. Each `good/` set must validate. Each `bad/<item>/`
  set must fail with exactly the checklist item named in its folder. There is at least one bad set per checklist item.

### 1.3 The Godot-safe lint: `node tools/lint/godot-css.js [--self-test]`

This generalises `check_styles.js`. That script stays frozen and keeps checking `retro.css` and `card.css` (§1.6).
Each file gets a profile:

| File | Profile |
|---|---|
| `pages/styles/toy.css` | `skin`: the `body[data-style="toy"]` prefix, token-only values |
| `pages/styles/motion-preview.css` | `motion`: `skin` plus `transition` and `transform: translateY(calc(var(--…) * var(--px)))` |
| `dist/css/toy-components.css` | `generated`: `motion` rules without the prefix; `position`, `inset`, `display`, `pointer-events` allowed |
| `dist/css/toy-tokens.css` | `tokens`: only custom-property declarations, `@media (prefers-reduced-motion: reduce)` and attribute blocks; every length variable an int |
| `pages/components/page.css` | not linted (page chrome) |

| Id | Rule (all profiles unless noted) | Source |
|---|---|---|
| L01 | Forbidden properties: `filter`, `backdrop-filter`, `clip-path`, `mix-blend-mode`, `background-blend-mode`, `background-image`, `mask*`, `animation*`; `transition*` outside `motion` and `generated` | CLAUDE.md; check_styles.js L70 |
| L02 | No `*-gradient(` | CLAUDE.md |
| L03 | No `url(` | CLAUDE.md |
| L04 | Border and outline styles `solid` or `none` only | CLAUDE.md |
| L05 | One border colour per element: no `border-*-color` per side, no several colours | `StyleBoxFlat.border_color` is one colour ([godot-facts §2](godot-facts.md#2-styleboxflat-properties-and-types)) |
| L06 | No pseudo-elements | CLAUDE.md |
| L07 | No at-rules, except `@media (prefers-reduced-motion: reduce)` in `tokens` | |
| L08 | `box-shadow`: one layer | |
| L09 | `box-shadow`: no `inset` | |
| L10 | `box-shadow`: no spread | |
| L11 | `box-shadow`: blur 0 (it is the image of a base node or border base, never of `shadow_size`) | decision 5 |
| L12 | `box-shadow`: x offset 0 | the base only drops |
| L13 | `box-shadow` only on a selector whose base selector declares an opaque background. The base selector is the selector with `:hover`, `:active`, `:focus-visible`, `:not(…)` and the `.is-*` state classes removed. It is looked up in the same skin (`toy.css` together with `motion-preview.css`) or, for generated CSS, in the same class's base rule | Godot fills the shadow under the box ([godot-facts §1.2](godot-facts.md#1-styleboxflat-drawing-and-the-toy-base)); lint addition from godot-facts' last section |
| L14 | No `transparent` and no colour with alpha 0 on a border: use border 0 and add the width to the padding | Godot leaves a see-through ring ([godot-facts, CSS → Godot table](godot-facts.md)) |
| L15 | No `%` radius | no Godot form |
| L16 | No `em`, `rem`, `%`, `vw` or `cq*` lengths in Godot properties (borders, radii, padding, font size, letter spacing, shadows, width, height). Only allowed: `calc(1cqw / 19.2)` as the value of `--px` in `skin` | [lens 3 §4](../2026-10-02-wave-1/lens-3-system.md) tier C |
| L17 | Ints only: a numeric literal in a length `calc()` must be an integer multiplier (`* -1` allowed); a resolved token length must be an int | Godot ints ([godot-facts §2](godot-facts.md#2-styleboxflat-properties-and-types)) |
| L18 | `skin`, `motion`, `generated`: no literal colour (`#…`, `rgb()`, named colours, `transparent`); only `var(--toy-*)` or `var(--ctx-*)` | token-only |
| L19 | `skin`, `motion`, `generated`: every length is `0`, `calc(var(--toy-…) * var(--px))` or `calc((var(--toy-a) - var(--toy-b)) * var(--px))` (optionally `* -1`); font weights are `var(--toy-font-weight-*)` | token-only |
| L20 | Every `var(--toy-…)` exists in `dist/css/toy-tokens.css`. Every `var(--ctx-…)` is defined in the same file from `--toy-*` | |
| L21 | `transform`: `rotate()` only in `skin`; `translateY(calc(var(--…) * var(--px)))` only in `motion` and `generated` | `translateY` is the image of `offset_transform_position` |
| L22 | No CSS colour functions (`color-mix`, `oklab()`, `oklch()`, `lab()`, `hsl()`) | Godot cannot mix at draw time |
| L23 | No `var(--px)` length on a selector whose last compound is `.frame` | cq units resolve against the nearest **ancestor** container ([css-contain-3 §6](https://www.w3.org/TR/css-contain-3/#container-lengths)) |
| L24 | `skin`, `motion`: every selector starts with `body[data-style="toy"]` | check_styles.js L85 |
| L25 | `text-shadow`: one layer, blur 0, only on title selectors | Label only, one hard shadow ([godot-facts §5](godot-facts.md#5-text)) |
| L26 | `letter-spacing` is `calc(var(--toy-font-letter-spacing-*) * var(--px))` | `FontVariation.spacing_glyph` is an int |

**Info, not violations** (as check_styles.js prints today): preview-only selectors (`[style*=]`, `:nth-child`,
`[data-in]`) and `!important` counts.

**Self-test:** `--self-test` lints `tools/lint/fixtures/good/*.css`, which must give 0 violations. It then lints each
`tools/lint/fixtures/bad/<id>-<name>.css`. Each file starts with a header comment `/* expect: L13 */`, and the test
passes only when exactly that rule fires. There is one bad fixture per rule, L01 to L26. The good fixtures are a
copy of the migrated `toy.css` and a hand-written component file.

### 1.4 Contrast gates: `node tools/contrast/gates.js`

The pairs are declared in **`tokens/gates.json`**. They sit next to the tokens because they are part of the
system's contract. The gates run on **all 4 permutations**, because the large-text threshold depends on the font
size. Ratios use WCAG 2.x ([WCAG 2.2 §1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum), §1.4.11). Translucent
colours are composited in sRGB over the backdrop, as the lint does today and as Godot does with `hdr_2d` off
([godot-facts §8](godot-facts.md#8-scaling-and-text-size)).

| Kind | Pairs | Minimum |
|---|---|---|
| auto: component text | Every Button, LineEdit and OptionButton state: `font-color` over `bg-color`. If the face is translucent or clear, it is composited over every surface of the variant's context (below). The same holds for every companion `…Text` label over its container | 4.5; 3 when the label's font size is ≥ 36 px in that permutation (lens 6: large = 36 px at 1080p) |
| auto: disabled text | `disabled` and `read-only` font colours, as above | **3** (profile). WCAG exempts inactive components ([WCAG 2.2 §1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum), "Incidental") |
| auto: focus | An inner ring against its own face colour. An outer ring (expand > 0) against every surface of the context | 3 (lens 6) |
| auto: ramp | Each of the 21 health stops against `p.track-dark` | 3 |
| auto: fills | Stamina, progress and slider fills against their tracks | 3 |
| declared | The 72 pairs of `inventory.json` `contrast_pairs` (ids c1–c18, x…, n…), rewritten with token paths. **x3 is dropped** (muted plum on yellow is not a used pair: `#4A3B55` replaced it). Pairs the inventory calls "carried by the outline" or "decorative" (n3, n17–n20, n23–n25) are `kind: "info"`, printed but never failing | per pair |
| waiver | **x15**, lilac on `.dim` over a white wall, 3.93:1. It needs a look decision: `.dim` at 74 % or a lighter lilac. The waiver names the decision and the issue. A waived pair is printed as `WAIVED` and does not fail. A waiver whose pair passes is an error, so stale waivers get removed | |

`surfaces` in `gates.json`:
- `dark` = `c.surface.night`, plus `c.surface.plate`, `c.surface.backdrop` and `c.surface.backdrop-deep`, each over
  the world samples `#FFFFFF`, `#C9C9C9` and `#979797`. White is lens 6's worst case; the other two are the lint's
  samples.
- `light` = `c.surface.panel`, `c.surface.board` and `c.surface.tile`.

High contrast (7:1) is reported only, since there is no such mode yet.

```json
{
  "version": 1,
  "world": { "white": "#ffffff", "light": "#c9c9c9", "mid": "#979797" },
  "min": { "text": 4.5, "large-text": 3, "disabled-text": 3, "non-text": 3 },
  "large-text-px": 36,
  "surfaces": {
    "dark": [ { "color": "color.surface.night" },
              { "color": "color.surface.plate", "over": ["white", "light", "mid"] },
              { "color": "color.surface.backdrop", "over": ["white", "light", "mid"] },
              { "color": "color.surface.backdrop-deep", "over": ["white", "light", "mid"] } ],
    "light": [ { "color": "color.surface.panel" }, { "color": "color.surface.board" }, { "color": "color.surface.tile" } ]
  },
  "auto": { "component-text": true, "focus": true, "fills": true,
            "ramp": { "group": "bar.health.ramp", "track": "palette.track-dark", "min": 3 } },
  "pairs": [
    { "id": "c1", "kind": "text", "fg": "color.on-dark.text", "bg": "color.surface.plate", "over": ["mid"],
      "label": "text (cream) on HUD plate, world 97" },
    { "id": "n17", "kind": "info", "fg": "palette.yellow", "bg": "color.surface.panel",
      "label": "selected tab vs cream panel: carried by the 3 px ink outline" }
  ],
  "waivers": [
    { "id": "x15", "reason": "lilac on the 70 % menu backdrop over a white wall is 3.93:1",
      "decision": "the engineer: .dim at 74 % or a lighter lilac", "issue": "https://github.com/xperiaroco2/prime-game-ui/issues/5" }
  ]
}
```

### 1.5 The page builds

- `node pages/components/build.js [--check]` writes `pages/components/components.html` (§8).
- `node pages/styles/build-styles-page.js [--check]` is updated in three ways. It resolves paths from `__dirname`, so
  it runs from any working directory. It injects `dist/css/toy-tokens.css` before the three skins. It gains `--check`.

### 1.6 One entry point: `node tools/check.js`

It runs these steps in order. It runs every step even after a failure, prints one line per step (name, OK/FAIL,
seconds) and then `ALL CLEAN` or `FAILED: n`. It exits with 1 if any step failed.

1. `node tools/tokens/test/run.js`: the validator self-tests.
2. `node tools/tokens/build.js --check`: validate, resolve, expand, then compare against `dist/`.
3. `node tools/lint/godot-css.js --self-test`
4. `node tools/lint/godot-css.js`
5. `node tools/contrast/gates.js`
6. `node pages/styles/check_styles.js retro card`: the frozen record, still clean.
7. `node pages/styles/build-styles-page.js --check`
8. `node pages/components/build.js --check`

### 1.7 CI: `.github/workflows/check.yml`

```yaml
name: check
on:
  pull_request:
  push:
    branches: [main]
    tags: ["ui-*"]
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 20
      - run: node tools/check.js
      - name: tag matches tokens/release.json
        if: startsWith(github.ref, 'refs/tags/ui-')
        run: node -e "const v=require('./tokens/release.json').version; if ('ui-'+v !== process.env.GITHUB_REF_NAME) { console.error('tag '+process.env.GITHUB_REF_NAME+' != ui-'+v); process.exit(1) }"
```

- The workflow runs no `npm install` and uses no cache.
- `actions/checkout@v7` matches the game's CI ([prime-game ci.yml](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/.github/workflows/ci.yml)).
- `actions/setup-node` v7.0.0 is the latest release ([release](https://github.com/actions/setup-node/releases/tag/v7.0.0),
  read through the GitHub API).
- **Node 20 reached end of life on 2026-04-30** ([nodejs/Release schedule.json](https://github.com/nodejs/Release/blob/main/schedule.json)).
  The repo rule says node 20, so the scripts must use only APIs present in both 20 and 22, and moving CI to 22 is one
  line. Whether setup-node still installs an end-of-life 20 is (unconfirmed).

### 1.8 Work split for four builders, and the contracts between them

| Builder | Writes | Reads | Done when |
|---|---|---|---|
| **1 Tokens** | `tokens/**` except `gates.json`: every value in §2, §3 and §7, with the JSON shapes of §2.2 and §7.1 and the authoring convention of §7.0 | this document | step 2 of `check.js` passes once builder 2's validator lands |
| **2 Build** | `tools/lib/*`, `tools/tokens/*` (§1.2, §6, §10), `tools/check.js`, `.github/workflows/check.yml`, `dist/**` | `tokens/**` | `check.js` steps 1 and 2 pass |
| **3 Lint and gates** | `tools/lint/**`, `tools/contrast/gates.js`; `tokens/gates.json` pairs | `tools/tokens/api.js`, `dist/css/*` | steps 3 to 5 pass |
| **4 Pages** | `pages/components/**`; `toy.css` and `motion-preview.css` migration; `build-styles-page.js`; `tools/visual/**` | `dist/**`, `api.js` | steps 7 and 8 pass, plus the Edge proof (§9.5) |

The fixed contracts are the token paths (§2, §7), the CSS variable names (§5.1), the CSS classes `.tv-<Variation>` with
their state classes (§5.4), the pack (§6), and this API, which builders 3 and 4 can stub before builder 2 finishes:

```js
// tools/tokens/api.js
const sys = require('./api.js').load({ root });  // throws { problems: [{ file, pointer, path, rule, message }] }
sys.permutations;  // [{ inputs: { textSize, motion }, tokens: Map<path, Value> }], defaults first; Value = pack value objects (§6.2)
sys.variants;      // [{ variation, class, parent, prefix, context, abstract, states: { name: { field: Value } },
                   //    press: { depth, hover, held, disabled } | null, proposal: [stateName|'*'] }]
sys.healthStops;   // [{ step: 0..20, fraction, hex, rgba }]
sys.cssVar(path);  // '--toy-' + path.split('.').join('-')
```

Order of merging: 1 → 2 → 3 and 4. Only builder 2's PR writes `dist/`. The others regenerate after rebasing.

---

## 2. Tiers and naming (B)

### 2.1 Rules

- **Names** are lower kebab-case segments, `^[a-z0-9]+(-[a-z0-9]+)*$` ([dtcg-facts §9](dtcg-facts.md#9-validator-checklist)
  item 6). Paths are dot-joined. The CSS name is `--toy-` + the path with dots replaced by hyphens. The validator fails
  if two paths produce the same CSS name.
- **Primitives** hold literals only: the 30-colour palette, font family, weights, letter spacing, line height,
  easing and focus width. The modifier files are primitives too: font sizes and durations.
- **Semantic** tokens are aliases to primitives. They exist for colours that switch with the dark or light context or
  are shared by several components, plus `type.*` (typography) and `motion.press` (transition).
- **Component** tokens:
  - Colours and typography are aliases to `palette.*`, `color.*` or `type.*` only, so no colour can be invented.
  - Geometry is integer px literals. Focus ring widths alias `{focus.width}`.
  - Every component token carries its own `$type`, or inherits it from its immediate group.
- **`$extensions`** use one key, `io.github.xperiaroco2.prime-game`
  ([dtcg-facts §4](dtcg-facts.md#4-types), checklist item 11). It holds:
  - `godot`: `{ "variation", "class", "parent", "abstract"? }` on variant groups, and `{ "trans", "ease" }` on
    `ease.press`.
  - `context`: `"dark" | "light" | "any"` on variant groups. The showcase and the gates use it.
  - `proposal`: `true` on any token or group the engineer has not approved. The pack lists these, and the showcase
    badges them «пропозиція».
- **No** `$ref`, `$extends`, `$root`, gradient, standalone strokeStyle, shadow arrays or `inset` (checklist items 8,
  15 and 26).

### 2.2 `tokens/prime.resolver.json`

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/resolver.json",
  "name": "prime-game UI tokens (Toy)",
  "version": "2025.10",
  "description": "Toy: one base set and two orthogonal modifiers.",
  "sets": {
    "base": {
      "description": "Primitives, semantic tokens, then one file per component.",
      "sources": [
        { "$ref": "primitives.tokens.json" },
        { "$ref": "semantic.tokens.json" },
        { "$ref": "components/backdrop.tokens.json" }, { "$ref": "components/bar.tokens.json" },
        { "$ref": "components/button.tokens.json" }, { "$ref": "components/chip.tokens.json" },
        { "$ref": "components/field.tokens.json" }, { "$ref": "components/howto.tokens.json" },
        { "$ref": "components/hud.tokens.json" }, { "$ref": "components/keycap.tokens.json" },
        { "$ref": "components/map.tokens.json" }, { "$ref": "components/mic.tokens.json" },
        { "$ref": "components/name-plate.tokens.json" }, { "$ref": "components/panel.tokens.json" },
        { "$ref": "components/pick.tokens.json" }, { "$ref": "components/plate.tokens.json" },
        { "$ref": "components/preset-card.tokens.json" }, { "$ref": "components/setting-row.tokens.json" },
        { "$ref": "components/slot.tokens.json" }, { "$ref": "components/stepper.tokens.json" },
        { "$ref": "components/tab.tokens.json" }, { "$ref": "components/title.tokens.json" }
      ]
    }
  },
  "modifiers": {
    "textSize": {
      "description": "The player's text size setting.",
      "contexts": { "default": [{ "$ref": "text-size/default.tokens.json" }],
                    "large": [{ "$ref": "text-size/large.tokens.json" }] },
      "default": "default"
    },
    "motion": {
      "description": "The player's reduced-motion setting.",
      "contexts": { "default": [{ "$ref": "motion/default.tokens.json" }],
                    "reduced": [{ "$ref": "motion/reduced.tokens.json" }] },
      "default": "default"
    }
  },
  "resolutionOrder": [ { "$ref": "#/sets/base" }, { "$ref": "#/modifiers/textSize" }, { "$ref": "#/modifiers/motion" } ]
}
```

### 2.3 Primitives (`primitives.tokens.json`)

**Palette** (`palette`, group `$type: color`, `colorSpace: srgb`, components rounded to 4 decimals, `hex` lowercase;
the alpha is omitted when it is 1). Every value comes from toy.css through the inventory (§1.1, §1.3). Nothing is
merged: merging near-duplicates is a look question (§11).

| Token | Hex | Alpha | From | Token | Hex | Alpha | From |
|---|---|---|---|---|---|---|---|
| `palette.ink` | #2A1F33 | | `--toy-ink` | `palette.track-dark` | #4A3C5C | | `--toy-track-dark` |
| `palette.night` | #1F1727 | | `--toy-night` | `palette.muted` | #64566F | | `--toy-muted` |
| `palette.plate` | #2A1F33 | 0.86 | `--toy-plate` | `palette.lilac` | #D8CCE3 | | `--toy-lilac` |
| `palette.plate-solid` | #352A41 | | `--toy-plate-solid` | `palette.keyshade` | #B9A8C7 | | `--toy-keyshade` |
| `palette.cream` | #FFF4E2 | | `--toy-cream` | `palette.slotline` | #9A8CA6 | | `--toy-slotline` |
| `palette.white` | #FFFFFF | | `--toy-white` | `palette.health-full` | #5BCB4E | | `--toy-health-full` |
| `palette.yellow` | #FFC23A | | `--toy-yellow` | `palette.health-empty` | #FF5A44 | | `--toy-health-empty` |
| `palette.honey` | #C98A10 | | `--toy-honey` | `palette.key-quiet` | #F3EDF6 | | toy.css L195 (hard-coded) |
| `palette.coral` | #FF8466 | | `--toy-coral` | `palette.row-line` | #E2D6EA | | L254 (hard-coded) |
| `palette.coral-deep` | #D9482F | | `--toy-coral-deep` | `palette.muted-deep` | #4A3B55 | | L281 (hard-coded) |
| `palette.mint` | #3CC4A8 | | `--toy-mint` | `palette.backdrop` | #261C30 | 0.70 | L91 `.dim` |
| `palette.mint-tint` | #D5F4EC | | `--toy-mint-tint` | `palette.backdrop-deep` | #261C30 | 0.80 | L92 `.dim.more` |
| `palette.lavender` | #E9DFF0 | | `--toy-lavender` | `palette.drop` | #0F0A14 | 0.60 | L122, L311 panel and map base |
| `palette.track-light` | #DCCFE4 | | `--toy-track-light` | `palette.zone` | #FFC23A | 0.55 | L324 map zone |
| | | | | `palette.clear` | #000000 | 0 | `transparent` (becomes `draw_center = false`) |

**Other primitives**

| Token | Type | Value |
|---|---|---|
| `font.family.base` | fontFamily | `"Comfortaa"` (SIL OFL 1.1, ship unmodified; [ui-decisions, Type](../../ui-decisions.md)) |
| `font.weight.semibold`, `font.weight.bold` | fontWeight | 600, 700 (numbers: named weights under a group `$type` fail the schema, dtcg-facts §4) |
| `font.letter-spacing.none`, `font.letter-spacing.tight` | dimension | 0 px, −1 px |
| `font.line-height.base` | number | 1.25 (the wireframe `.frame`) |
| `ease.press` | cubicBezier | `[0.33, 0.52, 0.64, 1]`, with `$extensions` `godot: { "trans": "TRANS_SINE", "ease": "EASE_OUT" }` |
| `duration.none` | duration | 0 ms (transition delays) |
| `focus.width` | dimension | 3 px (lens 6 §4) |
| `focus.gap` | dimension | 2 px |

### 2.4 Modifier files (primitives owned by one modifier each)

| Token (`font.size.*`, dimension) | `text-size/default` | `text-size/large` **(P)** ×1.25, nearest int | Was |
|---|---|---|---|
| `font.size.caption` | 18 | 23 | `.t16` in Toy |
| `font.size.small` | 20 | 25 | `.t18`, `.t20` |
| `font.size.body` | 22 | 28 | `.t22` |
| `font.size.body-large` | 24 | 30 | `.t24` |
| `font.size.heading` | 28 | 35 | `.t28` |
| `font.size.title` | 36 | 45 | `.t36` |
| `font.size.display` | 48 | 60 | `.t48` |
| `font.size.display-large` | 64 | 80 | `.t64` |
| `font.size.hero` | 96 | 120 | `.t96` |

| Token | `motion/default` | `motion/reduced` |
|---|---|---|
| `duration.press` (duration) | 70 ms | 0 ms |

Why ×1.25 for large text: the HUD's fixed boxes (84 px slots, 16 px bars) still fit an 18 → 23 px label, and lens 6's
200 % ceiling is the job of a separate UI scale (`Window.content_scale_factor`), not of this modifier
([lens 6 §3](../2026-10-02-wave-1/lens-6-a11y.md); [godot-facts §8](godot-facts.md#8-scaling-and-text-size)).

### 2.5 Semantic (`semantic.tokens.json`): 47 tokens

| Token | Alias | Token | Alias |
|---|---|---|---|
| `color.on-dark.text` | p.cream | `color.on-light.text` | p.ink |
| `color.on-dark.text-muted` | p.lilac | `color.on-light.text-muted` | p.muted |
| `color.on-dark.title` | p.yellow | `color.on-light.title` | p.ink |
| `color.on-dark.line` | p.cream | `color.on-light.line` | p.ink |
| `color.on-dark.base` | p.honey | `color.on-light.base` | p.ink |
| `color.on-accent.text` | p.ink | `color.on-accent.text-muted` | p.muted-deep |
| `color.outline` | p.ink | `color.surface.night` | p.night |
| `color.surface.night-plate` | p.plate-solid | `color.surface.plate` | p.plate |
| `color.surface.backdrop` | p.backdrop | `color.surface.backdrop-deep` | p.backdrop-deep |
| `color.surface.panel` | p.cream | `color.surface.board` | p.lavender |
| `color.surface.tile` | p.white | `color.surface.drop` | p.drop |
| `color.status.stamina` | p.yellow | `color.status.health-full` | p.health-full |
| `color.status.health-empty` | p.health-empty | `color.status.progress` | p.mint |
| `color.status.alert` | p.coral | `color.state.disabled-face` **(P)** | p.lavender |
| `color.state.disabled-ink` **(P)** | p.muted | `color.state.disabled-ink-on-dark` **(P)** | p.slotline |
| `color.state.hover-on-dark` **(P)** | p.plate-solid | `color.state.hover-on-light` **(P)** | p.lavender |
| `motion.press` (transition) | `{duration: {duration.press}, delay: {duration.none}, timingFunction: {ease.press}}` | | |

Typography (`type.*`). Every token uses `fontFamily {font.family.base}` and `lineHeight {font.line-height.base}`:

| Token | fontSize | fontWeight | letterSpacing |
|---|---|---|---|
| `type.caption` / `type.caption-bold` | `{font.size.caption}` | semibold / bold | none |
| `type.small` / `type.small-bold` | `{font.size.small}` | semibold / bold | none |
| `type.body` / `type.body-bold` | `{font.size.body}` | semibold / bold | none |
| `type.body-large` / `type.body-large-bold` | `{font.size.body-large}` | semibold / bold | none |
| `type.heading` / `type.heading-bold` | `{font.size.heading}` | semibold / bold | none |
| `type.title` | `{font.size.title}` | bold | none |
| `type.display` | `{font.size.display}` | bold | none |
| `type.display-large` | `{font.size.display-large}` | bold | tight |
| `type.hero` | `{font.size.hero}` | bold | tight |

Letter spacing is the toy.css `em` value rounded to whole px, because `spacing_glyph` is an int
([godot-facts §5](godot-facts.md#5-text)): +0.18 and +0.2 → 0; −0.36 and −0.48 → 0; −0.64 and −0.96 → −1. In Godot
this takes three `FontVariation`s over one `FontFile`: (wght 600, spacing 0), (700, 0) and (700, −1).

---

## 3. The colours the engineer named (C)

**Stamina** = `c.status.stamina` = `p.yellow` #FFC23A. It is 6.23:1 on `p.track-dark` (inventory n6), and the auto
gate checks it.

**Health: green when full, red as it runs low.** The endpoints are the engineer's `p.health-full` #5BCB4E and
`p.health-empty` #FF5A44, the same pair the approved mock-up mixes. The build samples them in **OKLab** at every 0.05,
using the CSS Color 4 matrices, so that `stop k` equals `color-mix(in oklab, full k×5 %, empty)` as the browser drew
it. It writes 21 hex stops. That is the "one colour space": the mixing happens once, in the build, and both engines
then draw the same stored hex with no interpolation.

- **CSS:** `--toy-bar-health-ramp-stop-NN`.
- **Godot:** theme colour items `ramp_stop_00` … `ramp_stop_20` on `ToyBarHealth`.
- **Which stop:** `step = floor(hp × 20 + 0.5)`, clamped to 0..20, the same expression in JS and GDScript.
  `Color.lerp` (sRGB) and `Gradient` are not used.
- Godot's `roundi` rounds halfway cases away from 0
  ([@GlobalScope.xml L1154-L1158](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/@GlobalScope.xml#L1154-L1158)),
  which for hp ≥ 0 equals `floor(x + 0.5)`. The spec still writes `floor` so that no rounding rule can differ.

| Step | hp | Hex | On track | Step | hp | Hex | On track | Step | hp | Hex | On track |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 00 | 0.00 | #FF5A44 | 3.25 | 07 | 0.35 | #D98D48 | 3.75 | 14 | 0.70 | #A6B14B | 4.31 |
| 01 | 0.05 | #FA6345 | 3.32 | 08 | 0.40 | #D39348 | 3.84 | 15 | 0.75 | #9CB64C | 4.40 |
| 02 | 0.10 | #F56B45 | 3.38 | 09 | 0.45 | #CC9849 | 3.90 | 16 | 0.80 | #92BA4C | 4.47 |
| 03 | 0.15 | #F07346 | 3.46 | 10 | 0.50 | #C59E49 | 4.00 | 17 | 0.85 | #87BE4D | 4.54 |
| 04 | 0.20 | #EA7A46 | 3.52 | 11 | 0.55 | #BEA34A | 4.08 | 18 | 0.90 | #7BC34D | 4.66 |
| 05 | 0.25 | #E58147 | 3.61 | 12 | 0.60 | #B6A84A | 4.15 | 19 | 0.95 | #6CC74E | 4.74 |
| 06 | 0.30 | #DF8747 | 3.68 | 13 | 0.65 | #AEAC4B | 4.21 | 20 | 1.00 | #5BCB4E | 4.83 |

**Checks on the table (computed):**
- Every stop is ≥ 3:1 on #4A3C5C; the lowest is stop 00 at 3.25.
- It matches godot-facts §6 at 0.75, 0.50, 0.25 and 0.10.
- Adjacent stops differ by at most ΔE_ok 0.0185. Nearest-stop drawing is at most ΔE_ok 0.0067 from the continuous
  mix.

**The gate:** the ramp gate checks all 21 stops, which are every colour that can ever be drawn.

**Tokens:**

| Token | Value |
|---|---|
| `bar.health.ramp.full` | `{color.status.health-full}` |
| `bar.health.ramp.empty` | `{color.status.health-empty}` |
| `bar.health.ramp.steps` | number 20 |
| `bar.health.ramp.stop-00` … `stop-20` | derived by the build. They appear in the pack and the CSS, never in `tokens/` |

---

## 4. Geometry, the toy base, press motion (D)

### 4.1 Scale and ints

- Every dimension is an int in reference px. `StyleBoxFlat.border_width_*`, `corner_radius_*`, `shadow_size`,
  `font_size` and `spacing_glyph` are ints. Content and expand margins are floats, but they stay ints here as well, so
  that mock-ups and theme match ([godot-facts §2](godot-facts.md#2-styleboxflat-properties-and-types)).
- Pills and circles use radius **999**. With four equal radii, Godot's per-corner adaptation equals the CSS factor
  (godot-facts §2), so 999 gives the same pill or circle in both. There is no `50 %`.

**Prime-game issue:**
- Set `display/window/size/viewport_width = 1920` and `viewport_height = 1080`.
- Set `window_width_override = 1152` and `window_height_override = 648`, so the start window stays the size it is
  today ([godot-facts §8](godot-facts.md#8-scaling-and-text-size)).

The generator reads `reference` from the pack and stops with an error when the project base differs.

### 4.2 The geometry in use

| Kind | Values (px) | Where |
|---|---|---|
| Border widths | 0, 2, 3, 4, 5, 7 (border base), 10 | 2 thin (keys' sides, stepper, crosshair, swatch, radio); 3 controls; 4 surfaces and selection; 5 key bottom and active slot; 7 = 3 + 4 selected tab; 10 spinner arc |
| Radii | 0, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 24, 26, 999 | 9, 11, 13 and 15 are focus rings (face radius − 3, concentric) |
| Content margins (outer = border + padding) | button 12 22; field 10 16; chip 4 14; tab 10 16; preset card 14; setting row 8 14 9; stepper 2 10; label plate 0 8; slot 7 / active 9; room 9; how-to frame 13; plate 10 18 / alert 14 22; panel menu 28, dialog 40, how-to 26; keycap 2 10 5 10; bar track 3; fills 5 0 | inventory §2.3 |
| Base depth | 4 (selected tab), 5 (secondary, danger, preset card), 6 (primary), 10 (panel, map, title plate) | inventory §2.5 |
| Node sizes (`custom_minimum_size`) | slot 84 × 84, wide 180 × 84; HUD bar height 16; pin 28; mic 46; crosshair 8; spinner 90; swatch and radio 26; keycap min width 36, wide 96 (P) | inventory §2.6 |

### 4.3 The toy base, exactly

**Rule:** `shadow_size = 0` everywhere in the Toy theme. The StyleBox record keeps the four shadow fields for
completeness, but the validator requires `shadow-size = 0` (§10). There are two drawings, and both match the CSS
`box-shadow: 0 Npx 0 C` pixel for pixel in shape:

1. **Base node** (`<Variation>Base…`, a `PanelContainer` wrapping the face):
   - The `panel` StyleBox has `bg_color` = the base colour, the face's `normal` radii and content margins 0.
   - `expand_margin_top = −depth` and `expand_margin_bottom = +depth`, so it draws the face's rect moved down by the
     depth (StyleBoxFlat grows the drawn rect by the expand margins, negatives included,
     [godot-facts §2](godot-facts.md#2-styleboxflat-properties-and-types)).
   - The opaque face covers all of it except the strip below.
   - Set `mouse_filter = MOUSE_FILTER_IGNORE` on the wrapper as cheap insurance. The game builds the wrapper in
     `UiParts`.
   - Used by every primary, secondary and danger button, the preset card (the quiet card has no base), panels, the map
     board and the title plate.
2. **Border base** (inside the state StyleBox):
   - `border_width_bottom = border + depth`, `expand_margin_bottom = depth`, and an explicit `content_margin_bottom`.
     Otherwise it would default to the thick border ([godot-facts §1.3](godot-facts.md#13-the-closest-match-for-the-toy-base)).
   - Exact only when the base colour equals the outline colour, so it is used only by the selected Esc tab (ink on
     ink). That base appears and disappears with the toggle state, which a wrapper cannot follow.

**The CSS mock-up keeps `box-shadow: 0 Npx 0 C`** as the image of both drawings, under lint rules L08 to L13. Nothing
changes in the mock-up's geometry. The one change is in the motion (§4.4): with a base that stays still, a pressed face
must travel depth − 1, not depth.

### 4.4 Press motion

**Per variant** (`<variant>.press`, dimension tokens, theme constants on the variation):

| Token | Godot constant | primary | secondary, danger | preset card | quiet card | ghost | others |
|---|---|---|---|---|---|---|---|
| `press.depth` | `press_depth` | 6 | 5 | 5 | 0 | 0 | 0 |
| `press.hover` | `face_offset_hover` | −1 | −1 | −1 (P) | 0 | 0 | 0 |
| `press.held` | `face_offset_held` | 5 | 4 | 3 | 3 | 2 (P) | 0 |
| `press.disabled` | `face_offset_disabled` | 6 (P) | 5 (P) | 5 (P) | 0 | 0 | 0 |

**Timing** (`button.motion` = `{motion.press}`, on the root variation `ToyButton`, inherited by every Toy button):

| Constant | Value |
|---|---|
| `press_duration_ms` | 70, or 0 under `motion: reduced` |
| `press_trans` | 1 = `TRANS_SINE` |
| `press_ease` | 1 = `EASE_OUT` |

The enum values are from the API dump.

**`ToyPress`** (prime-game component code, one script on every Toy button):
- It listens to `mouse_entered`, `mouse_exited`, `button_down`, `button_up`, `focus_entered` and the `disabled` state.
  All are in the 4.7.2 dump. `button_down` and `button_up` are emitted by
  [base_button.cpp L204-L308](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/base_button.cpp#L204-L308).
- From these it derives the interaction state. Precedence: disabled > held > hover > rest. The **toggle state does not
  count**, so a selected card or tab is not shown sunk.
- It tweens `offset_transform_position:y` to that state's constant over `press_duration_ms`. With a duration of 0 it
  sets the value directly.
- The offset is visual only: layout and the hit area stay put
  ([godot-facts §4](godot-facts.md#4-the-press-motion-hover-lifts-1-px-press-sinks-onto-the-base-in-70-ms)).
- The face's StyleBox, label and `focus` box move together. The base node does not move.
- Reduced motion defaults from `DisplayServer.accessibility_should_reduce_animation()`, which is in the dump.

**StyleBoxes stay still.** `hover`, `pressed` and `hover-pressed` of an action button have the same geometry as
`normal`, so the content margin sums never change and no neighbour moves ([godot-facts §3.4](godot-facts.md#34-minimum-size)).

**CSS:**
- The face gets `transform: translateY(offset)` plus `box-shadow: 0 (depth − offset) 0 base`.
- `transition: transform, box-shadow` over `var(--toy-motion-press-duration)` with `var(--toy-motion-press-timing-function)`.
- Both animate with the same easing, so the base's bottom edge stays at `depth` throughout, as in Godot.

### 4.5 Disabled and focus (proposals)

**Disabled (P):**
- Face `c.state.disabled-face` (lavender), outline and text `c.state.disabled-ink` (muted plum, 5.25:1 on lavender).
  On ghosts and toggle chips over dark, `c.state.disabled-ink-on-dark` (slot line, 5.52:1 on night).
- `press.disabled` = depth, so the face covers its base exactly: sunk flat.
- The quiet card has no disabled look. The screen hides it for guests, because its normal face already uses the
  disabled colours.

**Focus (P):**
- **Inner** (buttons, tab, preset cards, field, dropdown): a `focus` StyleBox with `bg` `p.clear`, border
  `{focus.width}` 3 in the face's outline colour, `expand_margin` = −(the largest border width of the variation's
  states), and radius = face radius − that inset. It thickens the outline from 3 to 6 px, inside the face. Content
  margins leave at least 4 px clear above the label.
- **Outer** (chips, stepper, radio, where the content margin is under 7): `expand_margin` = `focus.gap` +
  `focus.width` = 5, radius 999, in the context line colour.
- Godot draws `focus` over the state StyleBox, on keyboard or gamepad focus only
  ([godot-facts §3.2](godot-facts.md#32-which-stylebox-in-which-state)).

Contrast (computed):
- Ink ring on yellow 9.71, on white 15.65, on lavender 12.13.
- Cream ring on night 15.94; on the backdrop over a white wall 5.54.
- Ink ring on the cream panel 14.37.

### 4.6 What the mock-ups change to stay faithful

| Change | File | Before → after | Reason |
|---|---|---|---|
| Press travel | motion-preview.css | `.btn:active` 5 → **4**, `.btn.fill:active` 6 → **5** (the shadow stays 1) | The base stays put ([godot-facts §4](godot-facts.md#4-the-press-motion-hover-lifts-1-px-press-sinks-onto-the-base-in-70-ms), last paragraph) |
| Card press | motion-preview.css | `translateY(3)` with the 5 px base moving along → `translateY(3)` with a **2 px** shadow | A sink, not a slide, like the buttons |
| Easing | motion-preview.css | `ease-out` → `cubic-bezier(0.33, 0.52, 0.64, 1)` | Shows Godot's SINE/OUT (largest difference 0.024 of the progress) |
| Letter spacing | toy.css | ±0.01em → 0, and −1 px at 64 and 96 | int `spacing_glyph` |
| Selected preset card | toy.css | `.card.on` padding 12 → **10** (outer 14, as idle) | a toggle cannot change size in Godot (decision 11) |
| Health fill | toy.css | `color-mix(in oklab, …)` → the stop variables; s7 "hurt" (22 %) #E87D46 → stop 04 #EA7A46; 80 % stays #92BA4C | decision 8 |
| Transparent borders | toy.css | `.chip`, `.tabs > div`: `3px solid transparent` → border 0, padding + 3 | Lint L14; renders identically |

---

## 5. CSS output (E)

### 5.1 Variables

| Kind | Name | Value form | Example |
|---|---|---|---|
| Colour | `--toy-<path>` | `#rrggbb`, or `rgba(r, g, b, a)` when alpha < 1; aliases as `var(--toy-…)` | `--toy-palette-plate: rgba(42, 31, 51, 0.86);` `--toy-color-on-dark-text: var(--toy-palette-cream);` |
| Dimension | `--toy-<path>` | **unitless int** | `--toy-button-primary-normal-corner-radius: 18;` |
| Duration | `--toy-<path>` | `70ms` | `--toy-duration-press: 70ms;` |
| cubicBezier | `--toy-<path>` | `cubic-bezier(…)` | `--toy-ease-press: cubic-bezier(0.33, 0.52, 0.64, 1);` |
| number | `--toy-<path>` | number | `--toy-font-line-height-base: 1.25;` |
| fontFamily, fontWeight | `--toy-<path>` | `"Comfortaa"`, `700` | |
| typography | `--toy-<path>-font-family`, `-font-size` (int), `-font-weight`, `-letter-spacing` (int), `-line-height` | one variable per sub-value | `--toy-type-body-font-size: var(--toy-font-size-body);` |
| transition | `--toy-<path>-duration`, `-delay`, `-timing-function` | | `--toy-motion-press-duration: var(--toy-duration-press);` |
| Derived ramp | `--toy-bar-health-ramp-stop-00` … `-20` | `#rrggbb` | |
| Page plumbing (not tokens) | `--px`, `--zoom`, `--ctx-text`, `--ctx-text-muted`, `--ctx-title`, `--ctx-line`, `--ctx-base`, `--tv-offset`, `--tv-depth`, `--tv-base` | | §5.2, §5.4, §9 |

**How the variables are emitted:**
- Only the **source** tokens get variables: as authored, shorthands included. That is about 1,100 variables, all on
  `:root`.
- Aliases stay `var()` chains, which is safe because every one of them is declared on `:root`. So a mode block
  overrides only the primitives it owns.
- The pack carries the expanded records (§6), not the CSS.

### 5.2 One reference px: `--px`

- **Frame pages** (1920×1080 frames in `pages/styles/styles.html`): toy.css declares
  `body[data-style="toy"] .frame { --px: calc(1cqw / 19.2); }`.
  - Every length is `calc(var(--toy-…) * var(--px))`.
  - The `cqw` token in `--px` is evaluated where it is used, inside the frame, so it equals today's
    `calc(Ncqw / 19.2)`.
  - Lint L23 keeps lengths off `.frame` itself, because cq units skip the element's own container.
- **The showcase:** `.sc { --zoom: 1; --px: calc(var(--zoom) * 1px); }`. The zoom control sets `--zoom` to 0.5,
  0.75, 1, 1.5 or 2. At 1, one reference px is one CSS px, which fits a phone: a primary button is about 250 px wide.

### 5.3 Modes in CSS (generated into `toy-tokens.css`)

```css
:root { /* every token, default permutation */ }
:root[data-text-size="large"] { --toy-font-size-caption: 23; --toy-font-size-small: 25; /* …the 9 sizes */ }
:root[data-motion="reduced"] { --toy-duration-press: 0ms; }
@media (prefers-reduced-motion: reduce) { :root:not([data-motion="default"]) { --toy-duration-press: 0ms; } }
```

The modifiers are orthogonal, so `large` plus `reduced` is both blocks together. The frames do not expose the modes.

### 5.4 Component CSS (generated `toy-components.css`)

**Classes:**
- One class per variation: **`.tv-<Variation>`** (for example `.tv-ToyButtonPrimary`), so the showcase and the game use
  the same names.
- State classes: `.is-hover`, `.is-held`, `.is-disabled`, `.is-focus`, `.is-selected`.
- Godot states map to them:

| Godot state | CSS |
|---|---|
| `normal` | no class |
| `hover` | `.is-hover` |
| `pressed` (action button) | `.is-held` |
| `pressed` (toggle) | `.is-selected` |
| `hover_pressed` | `.is-selected.is-hover` |
| `disabled` | `.is-disabled` |
| `focus` | `.is-focus`, or `:focus-visible`, which shows the child `.tv-focus` |

**Drawing:**
- The `focus` StyleBox is a real child element, `<span class="tv-focus">`, absolutely positioned. Its `inset` is
  −expand − face border, because absolute insets count from the padding box. It has the focus border and radius.
- CSS padding = content margin − border width, per side.
- Depth-0 variants get `box-shadow: none`.

```css
.tv-ToyButtonPrimary {
  --tv-offset: 0; --tv-depth: var(--toy-button-primary-press-depth);
  --tv-base: var(--toy-button-primary-base-on-dark-panel-bg-color);
  position: relative;
  background: var(--toy-button-primary-normal-bg-color);
  border: 0 solid var(--toy-button-primary-normal-border-color);
  border-width: calc(var(--toy-button-primary-normal-border-width) * var(--px));
  border-radius: calc(var(--toy-button-primary-normal-corner-radius) * var(--px));
  padding: calc((var(--toy-button-primary-normal-content-margin-block) - var(--toy-button-primary-normal-border-width)) * var(--px))
           calc((var(--toy-button-primary-normal-content-margin-inline) - var(--toy-button-primary-normal-border-width)) * var(--px));
  color: var(--toy-button-primary-normal-font-color);
  font-family: var(--toy-button-primary-label-font-family), var(--font-ui);
  font-size: calc(var(--toy-button-primary-label-font-size) * var(--px));
  font-weight: var(--toy-button-primary-label-font-weight);
  letter-spacing: calc(var(--toy-button-primary-label-letter-spacing) * var(--px));
  line-height: var(--toy-button-primary-label-line-height);
  transform: translateY(calc(var(--tv-offset) * var(--px)));
  box-shadow: 0 calc((var(--tv-depth) - var(--tv-offset)) * var(--px)) 0 var(--tv-base);
  transition: transform var(--toy-button-motion-duration) var(--toy-button-motion-timing-function),
              box-shadow var(--toy-button-motion-duration) var(--toy-button-motion-timing-function);
}
[data-context="light"] .tv-ToyButtonPrimary { --tv-base: var(--toy-button-primary-base-on-light-panel-bg-color); }
.tv-ToyButtonPrimary.is-hover { --tv-offset: var(--toy-button-primary-press-hover); }
.tv-ToyButtonPrimary.is-held { --tv-offset: var(--toy-button-primary-press-held); }
.tv-ToyButtonPrimary.is-disabled { --tv-offset: var(--toy-button-primary-press-disabled);
  background: var(--toy-button-primary-disabled-bg-color); border-color: var(--toy-button-primary-disabled-border-color);
  color: var(--toy-button-primary-disabled-font-color); }
.tv-ToyButtonPrimary > .tv-focus { display: none; position: absolute; pointer-events: none;
  inset: calc((0 - var(--toy-button-primary-focus-expand-margin) - var(--toy-button-primary-normal-border-width)) * var(--px));
  border: 0 solid var(--toy-button-primary-focus-border-color);
  border-width: calc(var(--toy-focus-width) * var(--px));
  border-radius: calc(var(--toy-button-primary-focus-corner-radius) * var(--px)); }
.tv-ToyButtonPrimary.is-focus > .tv-focus, .tv-ToyButtonPrimary:focus-visible > .tv-focus { display: block; }
```

(`border-width: calc(var(--toy-focus-width) …)` follows the alias `button.primary.focus.border-width` →
`{focus.width}`. The emitter always writes the source variable of each field: a state's own value if it has one,
otherwise its shorthand, otherwise the same field of `normal`.)

---

## 6. The pack for prime-game (F)

### 6.1 `dist/pack/toy.pack.json`

One file with the modes inside. It holds the default permutation and the per-context overrides. The modifiers are
orthogonal, so any permutation is the defaults plus each chosen context's overrides, in any order.

```json
{
  "format": "prime-game-ui/toy-pack",
  "version": 1,
  "release": "0.1.0",
  "dtcg": "2025.10",
  "reference": { "width": 1920, "height": 1080 },
  "modifiers": {
    "textSize": { "contexts": ["default", "large"], "default": "default" },
    "motion": { "contexts": ["default", "reduced"], "default": "default" }
  },
  "tokens": {
    "bar.health.ramp.stop-04": { "type": "color", "hex": "#ea7a46", "rgba": [0.9176, 0.4784, 0.2745, 1] },
    "button.primary.focus.expand-margin-top": { "type": "dimension", "px": -3 },
    "button.primary.normal.bg-color": { "type": "color", "hex": "#ffc23a", "rgba": [1, 0.7608, 0.2275, 1] },
    "button.primary.normal.draw-center": { "type": "boolean", "value": true },
    "button.primary.label": { "type": "typography", "fontFamily": "Comfortaa", "fontSizePx": 24, "fontWeight": 700,
                              "letterSpacingPx": 0, "lineHeight": 1.25 },
    "button.primary.press.held": { "type": "dimension", "px": 5 },
    "duration.press": { "type": "duration", "ms": 70 },
    "motion.press": { "type": "transition", "durationMs": 70, "delayMs": 0, "points": [0.33, 0.52, 0.64, 1],
                      "godot": { "trans": "TRANS_SINE", "transValue": 1, "ease": "EASE_OUT", "easeValue": 1 } },
    "palette.plate": { "type": "color", "hex": "#2a1f33", "rgba": [0.1647, 0.1216, 0.2, 0.86] }
  },
  "overrides": {
    "textSize": { "default": {}, "large": { "font.size.body": { "type": "dimension", "px": 28 },
                                            "button.primary.label": { "type": "typography", "fontSizePx": 30, "…": "…" } } },
    "motion": { "default": {}, "reduced": { "duration.press": { "type": "duration", "ms": 0 }, "motion.press": { "…": "…" } } }
  },
  "variations": {
    "ToyButton": { "class": "Button", "parent": null, "prefix": "button", "context": "any", "abstract": true },
    "ToyButtonPrimary": { "class": "Button", "parent": "ToyButton", "prefix": "button.primary", "context": "any",
                          "styleboxes": ["normal", "hover", "pressed", "hover-pressed", "disabled", "focus"] },
    "ToyButtonPrimaryBaseOnDark": { "class": "PanelContainer", "parent": null, "prefix": "button.primary.base-on-dark",
                                    "context": "dark", "styleboxes": ["panel"] },
    "ToyBarHealth": { "class": "ProgressBar", "parent": null, "prefix": "bar.health", "context": "dark",
                      "styleboxes": ["fill"], "empty": ["background"] }
  },
  "derived": ["bar.health.ramp.stop-00", "…", "bar.health.ramp.stop-20"],
  "proposals": { "groups": ["button.primary.disabled", "button.primary.focus", "button.danger", "…"],
                 "contexts": ["textSize.large"] },
  "assets": []
}
```

### 6.2 Value objects (flat keys are token paths; keys sorted)

| type | Shape |
|---|---|
| color | `{ hex: "#rrggbb" (lowercase, no alpha), rgba: [r, g, b, a] }`, floats 0..1 to 4 decimals |
| dimension | `{ px: int }` (the validator guarantees ints) |
| duration | `{ ms: int }` |
| cubicBezier | `{ points: [x1, y1, x2, y2], godot?: { trans, transValue, ease, easeValue } }` |
| number | `{ value }` |
| fontFamily, fontWeight | `{ name }`, `{ value }` |
| typography | `{ fontFamily, fontSizePx, fontWeight, letterSpacingPx, lineHeight }` |
| transition | `{ durationMs, delayMs, points, godot }` |
| boolean (pack only, derived) | `{ value }`. Only `draw-center` is a boolean: false when `bg-color` alpha is 0 |

- Every StyleBox state in `variations[V].styleboxes` is **complete** in `tokens`, with 23 fields:
  - `bg-color`, `draw-center`, `border-color`
  - `border-width-left/top/right/bottom`
  - `corner-radius-top-left/top-right/bottom-right/bottom-left`
  - `content-margin-left/top/right/bottom`
  - `expand-margin-left/top/right/bottom`
  - `shadow-color`, `shadow-size`, `shadow-offset-x`, `shadow-offset-y`
- Plus `font-color` for the classes that have per-state font colours.
- The generator therefore needs no inheritance logic and no defaults.

### 6.3 The sync contract

1. **Release in prime-game-ui:**
   - A PR bumps `tokens/release.json`. Semver rule: MAJOR when a token path or variation is removed, renamed or
     retyped; MINOR when one is added; PATCH when only values change.
   - After the engineer merges, the engineer tags the merge commit `ui-<version>`.
   - CI on the tag checks that the tag equals `release.json` (§1.7).
2. **Copy into prime-game.** A runner command in prime-game (its own issue) copies `dist/pack/` at the tag's commit
   into **`client/ui/theme/pack/`**, byte for byte. It writes **`client/ui/theme/pack.lock.json`**:
   ```json
   { "repo": "xperiaroco2/prime-game-ui", "tag": "ui-0.1.0", "commit": "<40 hex>",
     "files": { "toy.pack.json": "sha256:<hex>" } }
   ```
   A prime-game test fails if a copied file's sha256 differs from the lock, so the pack cannot be edited by hand. The
   pack files are never edited in prime-game.
3. **The mapping table lives in prime-game, next to the generator**, for example `tools/theme/mapping.json` beside
   `tools/theme/build_theme.gd`. It maps the pack's StyleBox state names to theme item names (`hover-pressed` →
   `styles/hover_pressed`), per-state `font-color` to `font_hover_color` and the like, `press.*` to constants, ramp stops
   to colours, and `label` to font plus `font_size`.
   - The generator test fails when a pack variation has no mapping, or when the mapping names a token the pack lacks.
     The pack's `variations` hints and the table are therefore checked against each other.
   - The generator writes `game_theme.tres` from the defaults, plus one overlay theme per non-default context
     (`game_theme.text_large.tres`, `game_theme.motion_reduced.tres`), merged at runtime with `Theme.merge_with`.
   - It restores the uid `uid://c8behqt7jtcn8` with `ResourceSaver.set_uid`
     ([godot-facts §9](godot-facts.md#9-theme-type-variations-and-the-generator)).
   - The existing 29 screen-facing variation names keep working as variations of the Toy ones (for example
     `EscTab` → `ToyTab`), so screens change later.
4. **Pack contents beyond tokens:** `assets` lists files shipped beside the JSON, each `{ path, licence, source,
   sha256 }`. The Comfortaa variable font and its OFL text come once the engineer says yes to that download; own-work
   SVG icons come later. `assets` stays empty until then.

**Handoff issues for prime-game** (each with an `area:` label and a note on #150):
- the 1920×1080 base;
- the pack sync runner command and lock test;
- the generator with its mapping;
- `ToyPress` and the base wrappers in `UiParts`;
- the health bar (track wrapper, a fill-only bar, ramp stops through `self_modulate`);
- the text-size and reduced-motion settings with their overlay themes.

---

## 7. Components (G)

### 7.0 Shape, state names, completion

**State names per Godot class.** These are the only child groups of a variant, apart from `label`, `press`,
`items`, `text`, `size` and nested variants:

| Class | StyleBox states (token name → item) | Per-state colours |
|---|---|---|
| Button, toggle Button | `normal`, `hover`, `pressed`, `hover-pressed`, `disabled`, `focus` | `font-color` → `font_color`, `font_hover_color`, `font_pressed_color`, `font_hover_pressed_color`, `font_disabled_color`, `font_focus_color` |
| OptionButton | as Button | as Button |
| LineEdit | `normal`, `focus`, `read-only` | `font-color` (normal), `read-only.font-color` → `font_uneditable_color`; `items.*` → `font_placeholder_color`, `caret_color`, `selection_color`, `font_selected_color` |
| PanelContainer, Panel | `panel` | none (text goes on a companion Label, `<Variation>Text`) |
| Label | `normal` | `font-color`, `font-shadow-color`; `shadow-offset-x/y`, `shadow-outline-size` as constants |
| ProgressBar | `background`, `fill` (a missing `background` means `StyleBoxEmpty`) | none; ramp colours via `items` |

**StyleBox fields:**
- Required on the first state: `bg-color`. The exception is a Label variation, where an absent StyleBox means
  `StyleBoxEmpty`.
- Optional:
  - `border-color` (default `p.clear`)
  - `border-width-{top,right,bottom,left}`, or the shorthand `border-width`
  - `corner-radius-{top-left,top-right,bottom-right,bottom-left}`, or `corner-radius`
  - `content-margin-{top,right,bottom,left}`, or `content-margin-block` / `content-margin-inline` / `content-margin`
  - `expand-margin-{top,right,bottom,left}`, or `expand-margin-block` / `expand-margin-inline` / `expand-margin`
  - `shadow-*`: default 0, and must stay 0
- Precedence: per side over block/inline over all.
- A missing content margin defaults to that side's border width, which is Godot's −1 rule. The pack always writes it
  explicitly.

**Authoring convention** (binding for builder 1, so that the CSS variable names toy.css uses are known in advance).
Use the most compact form that does not overlap:
- If all four sides or corners are equal, use the plain shorthand (`border-width`, `corner-radius`, `content-margin`,
  `expand-margin`).
- Otherwise, for margins, each axis whose two sides are equal uses `-block` or `-inline`, and an unequal axis uses
  its two per-side names.
- Unequal border widths and radii are written as all four per-side names.
- Zero sides of expand margins may be omitted.
- Examples:
  - `cm 12 22` → `content-margin-block` 12, `content-margin-inline` 22.
  - `cm 8 14 9` → `content-margin-top` 8, `content-margin-inline` 14, `content-margin-bottom` 9.
  - `ex −6 36 14 36` → `expand-margin-top` −6, `expand-margin-inline` 36, `expand-margin-bottom` 14.
  - `bw 3 3 7 3` → all four `border-width-*`.

**Other child groups:**
- Label colours live in `normal` (`font-color`, `font-shadow-color`). Label constants (`shadow-offset-x`,
  `shadow-offset-y`, `shadow-outline-size`) live in `items`.
- A companion text is a nested Label variant (for example `chip.plate.text` → `ToyChipPlateText`) with `label`
  (typography) and `normal.font-color`.

**Completion** (done by `expand.js`, so the pack is complete):
- `hover` and `pressed` inherit any missing field from `normal`. `hover-pressed` inherits from `pressed`.
- `disabled` and `focus` are **required** for every non-abstract Button, OptionButton and LineEdit variation (`focus`
  only for LineEdit). This is the validator rule that makes sure no default grey Godot look leaks in.

### 7.1 The canonical JSON (`components/button.tokens.json`, excerpt)

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "button": {
    "$description": "Toy buttons. One type variation per variant; states are Button StyleBox items.",
    "$extensions": { "io.github.xperiaroco2.prime-game": {
      "godot": { "variation": "ToyButton", "class": "Button", "abstract": true }, "context": "any" } },
    "motion": { "$type": "transition", "$value": "{motion.press}" },
    "press": {
      "$type": "dimension",
      "depth": { "$value": { "value": 0, "unit": "px" } },
      "hover": { "$value": { "value": 0, "unit": "px" } },
      "held": { "$value": { "value": 0, "unit": "px" } },
      "disabled": { "$value": { "value": 0, "unit": "px" } }
    },
    "primary": {
      "$extensions": { "io.github.xperiaroco2.prime-game": {
        "godot": { "variation": "ToyButtonPrimary", "class": "Button", "parent": "ToyButton" }, "context": "any" } },
      "label": { "$type": "typography", "$value": "{type.body-large-bold}" },
      "normal": {
        "bg-color": { "$type": "color", "$value": "{palette.yellow}" },
        "border-color": { "$type": "color", "$value": "{color.outline}" },
        "border-width": { "$type": "dimension", "$value": { "value": 3, "unit": "px" } },
        "corner-radius": { "$type": "dimension", "$value": { "value": 18, "unit": "px" } },
        "content-margin-block": { "$type": "dimension", "$value": { "value": 12, "unit": "px" } },
        "content-margin-inline": { "$type": "dimension", "$value": { "value": 22, "unit": "px" } },
        "font-color": { "$type": "color", "$value": "{color.on-accent.text}" }
      },
      "disabled": {
        "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } },
        "bg-color": { "$type": "color", "$value": "{color.state.disabled-face}" },
        "border-color": { "$type": "color", "$value": "{color.state.disabled-ink}" },
        "font-color": { "$type": "color", "$value": "{color.state.disabled-ink}" }
      },
      "focus": {
        "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } },
        "bg-color": { "$type": "color", "$value": "{palette.clear}" },
        "border-color": { "$type": "color", "$value": "{color.outline}" },
        "border-width": { "$type": "dimension", "$value": "{focus.width}" },
        "corner-radius": { "$type": "dimension", "$value": { "value": 15, "unit": "px" } },
        "expand-margin": { "$type": "dimension", "$value": { "value": -3, "unit": "px" } }
      },
      "press": {
        "$type": "dimension",
        "depth": { "$value": { "value": 6, "unit": "px" } },
        "hover": { "$value": { "value": -1, "unit": "px" } },
        "held": { "$value": { "value": 5, "unit": "px" } },
        "disabled": { "$value": { "value": 6, "unit": "px" },
                      "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } } }
      },
      "base-on-dark": {
        "$extensions": { "io.github.xperiaroco2.prime-game": {
          "godot": { "variation": "ToyButtonPrimaryBaseOnDark", "class": "PanelContainer" }, "context": "dark" } },
        "panel": {
          "bg-color": { "$type": "color", "$value": "{color.on-dark.base}" },
          "corner-radius": { "$type": "dimension", "$value": { "value": 18, "unit": "px" } },
          "content-margin": { "$type": "dimension", "$value": { "value": 0, "unit": "px" } },
          "expand-margin-top": { "$type": "dimension", "$value": { "value": -6, "unit": "px" } },
          "expand-margin-bottom": { "$type": "dimension", "$value": { "value": 6, "unit": "px" } }
        }
      },
      "base-on-light": { "…": "as base-on-dark with {color.on-light.base} and variation ToyButtonPrimaryBaseOnLight, context light" }
    }
  }
}
```

The tables below give every other variant in the same terms. "= normal" means the state group is omitted and
completion fills it.

### 7.2 Buttons (`button`)

| Path | Variation (class → parent) | Context | label | normal bg | normal font | depth / hover / held / disabled | (P) |
|---|---|---|---|---|---|---|---|
| `button` | **ToyButton** (Button, abstract) | any | – | – | – | 0 / 0 / 0 / 0; `motion` | |
| `button.primary` | **ToyButtonPrimary** (Button → ToyButton) | any | type.body-large-bold | p.yellow | c.on-accent.text | 6 / −1 / 5 / 6 | disabled, focus |
| `button.secondary` | **ToyButtonSecondary** (Button → ToyButton) | any | type.body-large-bold | p.white | c.on-light.text | 5 / −1 / 4 / 5 | disabled, focus |
| `button.danger` | **ToyButtonDanger** (Button → ToyButton) | any | type.body-large-bold | p.coral (ink 6.51:1) | c.on-accent.text | 5 / −1 / 4 / 5 | whole variant |

The three share:
- `normal`: bc c.outline · bw 3 · r 18 · cm 12 22.
- `hover`, `pressed`, `hover-pressed` = normal.
- `disabled` (P): bg c.state.disabled-face · bc c.state.disabled-ink · font c.state.disabled-ink.
- `focus` (P): bg p.clear · bc c.outline · bw {focus.width} · r 15 · ex −3.

Each has two bases:

| Base | Variation (PanelContainer) | panel |
|---|---|---|
| `<v>.base-on-dark` | **ToyButtonPrimaryBaseOnDark**, …SecondaryBaseOnDark, …DangerBaseOnDark | bg c.on-dark.base (honey) · r 18 · cm 0 · ex −depth 0 depth 0 |
| `<v>.base-on-light` | **ToyButtonPrimaryBaseOnLight**, …SecondaryBaseOnLight, …DangerBaseOnLight | bg c.on-light.base (ink), the same geometry |

**Why danger is justified:**
- In the Esc menu's Game page, "Покинути сесію" ends the session for everyone when the player is the host
  (wireframes s5 "game", with the warning line).
- Lens 3 asks for a danger button for Leave and Quit and for the confirm dialog
  ([lens 3 §3](../2026-10-02-wave-1/lens-3-system.md)).
- It uses an existing colour: coral is already "danger edge" in toy.css L20.
- It is not used in any frame.

| Ghost | **ToyButtonGhostOnDark** (Button → ToyButton), dark | **ToyButtonGhostOnLight** (Button → ToyButton), light |
|---|---|---|
| label | type.small (20/600) | type.small |
| normal | bg p.clear · bc c.on-dark.line · bw 3 · r 18 · cm 12 22 · font c.on-dark.text | bg p.clear · bc c.on-light.line · bw 3 · r 18 · cm 12 22 · font c.on-light.text |
| hover, pressed, hover-pressed (P) | bg c.state.hover-on-dark (cream on it 12.37) | bg c.state.hover-on-light (ink on it 12.13) |
| disabled (P) | bc and font c.state.disabled-ink-on-dark | bc and font c.state.disabled-ink |
| focus (P) | bg p.clear · bc c.on-dark.line · bw {focus.width} · r 15 · ex −3 | bc c.on-light.line, the rest the same |
| press | 0 / 0 / 2 (P) / 0 | 0 / 0 / 2 (P) / 0 |

### 7.3 Esc tabs (`tab`)

**ToyTab** (toggle Button → ToyButton), light, label type.body-large (24/600: the idle weight, decision 11). There is
no `press` group. The existing `EscTab` becomes a variation of ToyTab.

| State | Values |
|---|---|
| normal (idle) | bg p.clear · bw 0 · r 14 · cm 10 16 · font c.on-light.text |
| hover (P) | bg c.state.hover-on-light |
| pressed = selected; hover-pressed = pressed | bg p.yellow · bc c.outline · **bw 3 3 7 3 · ex 0 0 4 0** (border base, depth 4) · r 14 · **cm 10 16 explicit** · font c.on-accent.text |
| disabled (P) | bg p.clear · bw 0 · font c.state.disabled-ink |
| focus (P) | bg p.clear · bc c.outline · bw {focus.width} · r 11 · ex −3 |

### 7.4 Chips (`chip`)

Static chips are PanelContainers with a companion `<Variation>Text` (Label):

| Path | Variation | Context | panel | Companion text (label · font) |
|---|---|---|---|---|
| `chip.plate` | **ToyChipPlate** | dark | bg c.surface.plate · bw 0 · r 999 · cm 4 14 | type.small-bold · c.on-dark.text |
| `chip.light` | **ToyChipLight** | any | bg p.yellow · bc c.outline · bw 3 · r 999 · cm 4 14 | type.small-bold · c.on-accent.text |
| `chip.new` | **ToyChipNew** | light | bg p.coral · bc c.outline · bw 3 · r 999 · cm 4 14 | type.caption-bold · c.on-accent.text |
| `chip.line-on-dark` | **ToyChipLineOnDark** | dark | bg p.clear · bc c.on-dark.line · bw 3 · r 999 · cm 4 14 | type.small · c.on-dark.text |
| `chip.line-on-light` | **ToyChipLineOnLight** | light | bg p.clear · bc c.on-light.line · bw 3 · r 999 · cm 4 14 | type.small · c.on-light.text |

Toggle chips (language, settings sub-tabs, guide list) are toggle Buttons → ToyButton, with label type.small (20/600):

| State | **ToyChipToggleOnDark** (dark) | **ToyChipToggleOnLight** (light) |
|---|---|---|
| normal | as chip.line-on-dark · font c.on-dark.text | as chip.line-on-light · font c.on-light.text |
| hover (P) | bg c.state.hover-on-dark | bg c.state.hover-on-light |
| pressed = selected; hover-pressed | bg p.yellow · bc c.outline · font c.on-accent.text | the same |
| disabled (P) | bc and font c.state.disabled-ink-on-dark | bc and font c.state.disabled-ink |
| focus (P), outer | bg p.clear · bc c.on-dark.line · bw {focus.width} · r 999 · **ex 5** | bc c.on-light.line, the rest the same |

### 7.5 Hand and belt slots (`slot`, HUD, not focusable)

| Path | Variation | panel |
|---|---|---|
| `slot.idle` | **ToySlot** (PanelContainer), dark | bg c.surface.plate · bc p.slotline · bw 3 · r 18 · cm 7 |
| `slot.active` | **ToySlotActive** (PanelContainer), dark | bg c.surface.plate · bc p.yellow · bw 5 · r 18 · cm 9 |
| `slot.text` | **ToySlotText** (Label) | type.caption · c.on-dark.text (filled) |
| `slot.text-empty` | **ToySlotTextEmpty** (Label) | type.caption · c.on-dark.text-muted (empty) |
| `slot.size.square`, `slot.size.wide` | node `custom_minimum_size` | 84 × 84; 180 × 84 |

How the showcase states are built:
- **empty** = ToySlot + ToySlotTextEmpty.
- **filled** = an icon placeholder + ToySlotText. The item icons are tier B and come later.
- **active** = ToySlotActive.
- **two-handed** = ToySlotActive at the wide size.

### 7.6 Bars (`bar`)

| Path | Variation | Context | StyleBoxes and items |
|---|---|---|---|
| `bar.track` | **ToyBarTrack** (PanelContainer) | dark | panel: bg p.track-dark · bc c.outline · bw 3 · r 10 · cm 3; `size.height` 16 |
| `bar.stamina` | **ToyBarStamina** (ProgressBar) | dark | background: none (StyleBoxEmpty); fill: bg c.status.stamina · r 6 · cm 5 0 |
| `bar.health` | **ToyBarHealth** (ProgressBar) | dark | background: none; fill: bg p.white · r 6 · cm 5 0; `ramp.*` (§3) → colours `ramp_stop_00..20` |
| `bar.progress` | **ToyBarProgress** (ProgressBar) | dark | background: bg p.track-dark · r 999 · cm 5 0; fill: bg c.status.progress · r 999 |
| `bar.slider` | **ToyBarSlider** (ProgressBar) | light | background: bg p.track-light · r 999 · cm 5 0; fill: bg c.outline · r 999 (the HSlider grabber is a texture: later) |
| `bar.label` | **ToyBarLabel** (PanelContainer) + **ToyBarLabelText** (Label) | dark | bg c.surface.plate · r 8 · cm 0 8; text type.caption · c.on-dark.text |

The HUD bar in Godot is ToyBarTrack wrapping a fill-only bar (ToyBarStamina or ToyBarHealth).
- The track's content margin of 3 insets the bar inside the outline, and the fill has a horizontal minimum size of 0.
  So `round(r · W_inner)` is exactly the CSS fraction of the inner width, with no `expand_margin −3` trick
  ([godot-facts §6](godot-facts.md#6-progressbar-gradient-and-the-health-colour)).
- For health, the HUD sets `self_modulate = get_theme_color("ramp_stop_%02d" % step, &"ToyBarHealth")`. The white fill
  times that colour is that colour, and the empty background takes no tint (godot-facts §6).

### 7.7 Surfaces: panel, dialog, HUD plate, backdrops (`panel`, `plate`, `backdrop`)

| Path | Variation | Context | Values |
|---|---|---|---|
| `panel.menu` | **ToyPanelMenu** (PanelContainer) | light | bg c.surface.panel · bc c.outline · bw 4 · r 24 · cm 28 |
| `panel.dialog` | **ToyPanelDialog** | light | as menu · cm 40 |
| `panel.howto` | **ToyPanelHowto** | light | as menu · cm 26 |
| `panel.base` | **ToyPanelBase** (PanelContainer wrapper) | any | bg c.surface.drop · r 24 · cm 0 · ex −10 0 10 0 (also under the map board) |
| `plate.default` | **ToyPlate** + **ToyPlateText** | dark | bg c.surface.plate · bw 0 · r 16 · cm 10 18; text type.body · c.on-dark.text |
| `plate.night` | **ToyPlateNight** | dark | bg c.surface.night-plate · r 16 · cm 10 18 |
| `plate.alert` | **ToyPlateAlert** | dark | bg c.surface.plate · bc c.status.alert · bw 4 · r 16 · cm 14 22 |
| `backdrop.dim` | **ToyBackdrop** (Panel) | – | bg c.surface.backdrop |
| `backdrop.deep` | **ToyBackdropDeep** (Panel) | – | bg c.surface.backdrop-deep |
| `backdrop.night` | **ToyBackdropNight** (Panel) | – | bg c.surface.night |

A **dialog** is a composition, not a variation: ToyPanelBase › ToyPanelDialog › title (type.title, c.on-light.title),
body (type.body, c.on-light.text), muted note, and a row of ToyButtonPrimary plus ToyButtonGhostOnLight.

### 7.8 Keycaps (`keycap`)

| Path | Variation (PanelContainer) + text | Context | panel | text |
|---|---|---|---|---|
| `keycap.on-dark` | **ToyKeyOnDark** + ToyKeyOnDarkText | dark | bg p.cream · bc p.keyshade · bw 2 2 5 2 · r 8 · cm 2 10 5 10 | type.body-bold · c.on-light.text |
| `keycap.on-light` | **ToyKeyOnLight** + ToyKeyOnLightText | light | bg p.white · bc c.outline · the same geometry | the same |
| `keycap.quiet` | **ToyKeyQuiet** + ToyKeyQuietText | light | bg p.key-quiet · bc p.muted · the same geometry | type.body-bold · p.muted (5.88:1) |
| `keycap.size.min-width` | node | | 36 (1.6 em at 22 px, rounded up) | |
| `keycap.size.wide-min-width` (P) | node | | 96 (Space, Shift, Esc, Tab) | |

The wide keycap is the same variation at a larger minimum width.

### 7.9 How-to card (`howto`)

| Path | Variation | Values |
|---|---|---|
| (the card) | ToyPanelBase › **ToyPanelHowto** | §7.7 |
| `howto.frame` | **ToyHowtoFrame** (PanelContainer) + **ToyHowtoFrameText** (Label), light | bg p.white · bc c.outline · bw 3 · r 16 · cm 13; text type.small-bold · c.on-light.text |
| `howto.frame-done` | **ToyHowtoFrameDone**, light | bg p.mint-tint, the rest as frame (ink on it 13.40) |

The showcase shows the card in two states: **normal** (4 frames, none done) and **done** (the last frame
ToyHowtoFrameDone). It also shows a 3-frame card.

### 7.10 Field and dropdown (`field`)

**ToyField** (LineEdit), context any, label type.body-bold:

| State | Values |
|---|---|
| normal | bg p.white · bc c.outline · bw 3 · r 12 · cm 10 16 · font c.on-light.text |
| focus (P) | bg p.clear · bc c.outline · bw {focus.width} · r 9 · ex −3 (LineEdit draws it over `normal`) |
| read-only (P; also the disabled look) | bg c.state.disabled-face · bc c.state.disabled-ink · bw 3 · r 12 · cm 10 16 · font (`font_uneditable_color`) c.state.disabled-ink |
| items (P) | `placeholder-color` p.muted (6.77:1 on white) · `caret-color` c.outline · `selection-color` p.yellow · `selected-font-color` c.on-accent.text |

**ToyDropdown** (OptionButton → OptionButton; it does not chain to ToyButton, so OptionButton's own items still
resolve):
- normal = ToyField `normal`.
- hover (P) and pressed: bg c.state.hover-on-light.
- disabled (P) = ToyField `read-only`.
- focus (P) = ToyField `focus`.
- Label type.body-bold, font c.on-light.text.
- The arrow is an icon texture and comes later. Its width will then be added to the right content margin.

### 7.11 Setting row and stepper (`setting-row`, `stepper`)

| Path | Variation | Values |
|---|---|---|
| `setting-row` | **ToySettingRow** (PanelContainer), light | bg p.white · bc p.row-line · bw 0 0 3 0 · r 12 · cm 8 14 9 |
| `setting-row.text`, `setting-row.value` | **ToySettingRowText**, **ToySettingRowValue** (Label) | type.body · c.on-light.text; type.body-bold · c.on-light.text |
| `stepper` | **ToyStepper** (Button → ToyButton), light, label type.body-bold | normal: bg p.yellow · bc c.outline · bw 2 · r 999 · cm 2 10 · font c.on-accent.text. hover = normal. pressed and hover-pressed (P): bg p.honey (ink 5.31:1). disabled (P, at min or max): bg c.state.disabled-face · bc and font c.state.disabled-ink. focus (P), outer: bg p.clear · bc c.outline · bw {focus.width} · r 999 · ex 5 |

### 7.12 Preset cards (`preset-card`)

**ToyPresetCard** (toggle Button → ToyButton), light, label type.small-bold:

| State | Values |
|---|---|
| normal (idle) | bg p.white · bc c.outline · bw 3 · r 16 · cm 14 · font c.on-light.text |
| hover | = normal (the face lifts through `press.hover` −1, P) |
| pressed = selected; hover-pressed | bg p.yellow · bc c.outline · **bw 4 · cm 14** · r 16 · font c.on-accent.text |
| disabled (P) | bg c.state.disabled-face · bc c.state.disabled-ink · bw 3 · font c.state.disabled-ink |
| focus (P) | bg p.clear · bc c.outline · bw {focus.width} · r 12 · ex −4 |
| press | 5 / −1 (P) / 3 / 5 (P) |

**Base:** `preset-card.base` → **ToyPresetCardBase** (PanelContainer): bg c.on-light.base · r 16 · cm 0 · ex −5 0 5 0.

**Note line:**
- `preset-card.note` → **ToyPresetCardNote** (Label): type.small · c.on-light.text-muted.
- `preset-card.note-selected` → **ToyPresetCardNoteSelected** (Label): type.small · c.on-accent.text-muted (6.36:1
  on yellow).
- The screen swaps the note's variation on `toggled`. A Label inside a Button does not follow the Button's state.

**ToyPresetCardQuiet** (Button → ToyButton), "Save your own":
- normal: bg p.lavender · bc p.muted · bw 3 · r 16 · cm 14 · font p.muted.
- hover, pressed and disabled = normal. It is hidden for guests.
- focus (P): bg p.clear · bc c.outline · bw {focus.width} · r 13 · ex −3.
- press 0 / 0 / 3 / 0.

### 7.13 Map (`map`)

| Path | Variation | Values |
|---|---|---|
| `map.board` | **ToyMapBoard** (PanelContainer), light; base ToyPanelBase | bg c.surface.board · bc c.outline · bw 4 · r 24 · cm 4 |
| `map.room` | **ToyMapRoom** (PanelContainer) + **ToyMapRoomText** (Label) | bg p.cream · bc c.outline · bw 3 · r 12 · cm 9; text type.caption-bold · c.on-light.text |
| `map.zone` | **ToyMapZone** (Panel) | bg p.zone · bc c.outline · bw 4 · r 12 |
| `map.pin` (you are here) | **ToyMapPin** (Panel) | bg p.coral-deep · bc c.outline · bw 3 · r 0 14 14 14 · size 28; rotation set at runtime (`rotation`, or `offset_transform_rotation` inside a container) |
| "ти тут" chip | ToyChipPlate + a caption label | |

### 7.14 Mic, name plate, title plate, logo, HUD bits

| Path | Variation | Values |
|---|---|---|
| `mic` | **ToyMic** (PanelContainer), dark | bg c.surface.plate · r 999 · cm 0 · size 46. Items `icon-on` c.on-dark.text (9.25:1 over a white wall), `icon-off` p.coral (4.19:1 over a white wall) → colours `icon_on`, `icon_off`, applied to the icon `TextureRect` through `self_modulate`. The icons are own-work SVG, tier B |
| `name-plate` | **ToyNamePlate** (PanelContainer) + **ToyNamePlateText** (Label), dark | bg c.surface.plate · r 999 · cm 4 14; text type.small-bold · c.on-dark.text; the teammate mark uses the text colour. It is drawn as a HUD Control placed by unprojecting the head, not a `Label3D`, so the theme applies (an assumption for prime-game) |
| `title.plate` | **ToyTitlePlate** (Label), dark | label type.hero; normal: bg p.yellow · bc c.outline · bw 4 · r 26 · cm 0 · **ex 4 36** (expand margins replace the CSS negative margins, [godot-facts §5](godot-facts.md#5-text)) · font c.on-accent.text |
| `title.base` | **ToyTitlePlateBase** (PanelContainer wrapper), dark | bg p.coral · r 26 · cm 0 · ex −6 36 14 36 (the plate's drawn rect moved down 10) |
| `title.logo` | **ToyLogo** (Label), dark | label type.display-large · `normal.font-color` p.yellow · `normal.font-shadow-color` p.coral · `items.shadow-offset-x` 0 · `items.shadow-offset-y` 6 · `items.shadow-outline-size` **0** |
| `hud.crosshair` | **ToyCrosshair** (Panel) | bg p.cream · bc c.outline · bw 2 · r 999 · size 8 |
| `hud.spinner` | **ToySpinner** (Panel) | bg c.surface.night-plate · bc p.yellow · bw 10 10 0 0 · r 999 · size 90 |
| `pick.swatch-ring` | **ToySwatchRing** (Panel) | bg p.clear · bc c.outline · bw 2 · r 999 · size 26. The fill is a white Panel tinted with `self_modulate`, once body colours are decided |
| `pick.swatch-selected` | **ToySwatchSelected** (Panel) | bg p.clear · bc c.outline · bw 4 · r 999 · ex 7 |
| `pick.radio` | **ToyRadio** (toggle Button → ToyButton) | normal: bg p.white · bc c.outline · bw 2 · r 999 · cm 0 · size 26; pressed: bg p.yellow. disabled (P): the disabled colours. focus (P), outer ex 5. The check mark is an own-work icon, later |

### 7.15 Godot mapping summary (for the generator issue)

| Variation | Class → parent | StyleBox items | Colours | Constants / font |
|---|---|---|---|---|
| ToyButton | Button | – | – | `press_duration_ms`, `press_trans`, `press_ease`, `face_offset_*` 0 |
| ToyButtonPrimary, …Secondary, …Danger, …GhostOnDark, …GhostOnLight | Button → ToyButton | normal, hover, pressed, hover_pressed, disabled, focus | font_color, font_hover_color, font_pressed_color, font_hover_pressed_color, font_disabled_color | `press_depth`, `face_offset_hover/held/disabled`; font + font_size from `label` |
| ToyButton…BaseOnDark/OnLight (6), ToyPresetCardBase, ToyPanelBase, ToyTitlePlateBase | PanelContainer | panel | – | – |
| ToyTab, ToyChipToggleOnDark/OnLight, ToyPresetCard, ToyPresetCardQuiet, ToyStepper, ToyRadio | Button → ToyButton | as Button | as Button | as Button |
| ToyDropdown | OptionButton | as Button | as Button | font from `label` |
| ToyField | LineEdit | normal, focus, read_only | font_color, font_uneditable_color, font_placeholder_color, caret_color, selection_color, font_selected_color | font from `label` |
| ToyChip*, ToySlot*, ToyBarTrack, ToyBarLabel, ToyPanel*, ToyPlate*, ToyKey*, ToyHowtoFrame*, ToySettingRow, ToyMapBoard, ToyMapRoom, ToyMic, ToyNamePlate | PanelContainer | panel | ToyMic: icon_on, icon_off | – |
| ToyMapZone, ToyMapPin, ToyBackdrop*, ToyCrosshair, ToySpinner, ToySwatch* | Panel | panel | – | – |
| ToyBarStamina, ToyBarHealth, ToyBarProgress, ToyBarSlider | ProgressBar | fill, background (StyleBoxEmpty when absent) | ToyBarHealth: ramp_stop_00..20 | – |
| …Text companions, ToyPresetCardNote(Selected), ToySettingRowValue | Label | – | font_color | font + font_size from `label` |
| ToyTitlePlate, ToyLogo | Label | normal (title plate) | font_color, font_shadow_color (logo) | shadow_offset_x/y, shadow_outline_size 0 (logo) |

There are about 80 variations. All names are letters only, so the game's theme test sees them
(`&"([A-Za-z]+)"`, [godot-facts §0](godot-facts.md#0-the-game-today-read-only)).

---

## 8. The showcase page (H)

- **Sources:** `pages/components/` holds:
  - `build.js` (node 20, no packages)
  - `showcase.json`: sections, rows and samples
  - `strings.json`: Ukrainian page chrome; sample labels as `uk` and `en`, taken where possible from
    `pages/wireframes/en.json`
  - `page.css` and `page.js`
  - `icons/*.svg`: own-work placeholders (mic, crossed mic, item, check), with `icons/LICENCES.json`
- **Output:** `pages/components/components.html`, a single file that inlines `dist/css/toy-tokens.css`,
  `dist/css/toy-components.css`, page.css and page.js. Comfortaa comes from the Google Fonts CSS, as on the wireframes
  page. The output is committed and covered by `--check`.
- **Artifact contract:** title «Компоненти Toy». Page chrome tokens on `:root`, with the dark-mode guard pattern of
  `wireframes.html`. A 16 px side gutter and no horizontal page scroll: the state matrices scroll inside `.sc-scroll`.
  The builder publishes it as a private artifact for the engineer's phone.
- **Sticky controls** (Ukrainian):
  - «Мова зразків» UA | EN: swaps sample labels only.
  - «Розмір тексту» звичайний | великий: `data-text-size` on `<html>`.
  - «Рух» звичайний | менше: `data-motion`; the default follows `prefers-reduced-motion`.
  - «Масштаб» 50 | 75 | 100 | 150 | 200 %: `--zoom`.
  - Every choice is kept in `localStorage` inside try/catch.
- **Every row** shows:
  - the variant name and its Godot hint in monospace: `ToyButtonPrimary · Button → ToyButton · normal hover pressed
    disabled focus · база ToyButtonPrimaryBaseOnDark`;
  - one **static** sample per state, side by side (normal, hover, held, disabled, focus, and selected and
    selected + hover for toggles), each on its context surface (`data-context`): night or a world tile with a plate
    for dark, the cream panel for light;
  - one **live** sample;
  - a «пропозиція» badge on every cell the pack lists in `proposals`.
- **Live on touch:** `page.js` drives the state classes with pointer events, so mouse and touch behave like Godot's
  `ToyPress`:
  - `pointerenter` / `pointerleave` (mouse only) → `.is-hover`;
  - `pointerdown` → `.is-held` with `setPointerCapture`;
  - `pointerup` / `pointercancel` → off;
  - Space and Enter keydown/keyup → `.is-held`;
  - click on a toggle → `.is-selected` and `aria-pressed`.
  - Keyboard focus uses real `<button>`s and `:focus-visible`.
- **Sections, in order:**
  1. Кнопки: primary, secondary, danger (P), and both ghosts, on dark and on light.
  2. Чипи: five static chips, two toggles.
  3. Слоти: empty, filled, active, active filled, two-handed wide.
  4. Смужки:
     - stamina at 1, 0.9, 0.5, 0.18, 0.03;
     - health at 1, 0.8, 0.5, 0.22, 0.03;
     - the 21-stop ramp with hp, hex and contrast;
     - progress (mint) at 0.62, 0.7, 0.6;
     - slider at 0.7, 0.55, 0.4;
     - a bar label plate.
  5. Поверхні: menu panel, dialog, HUD plate (default, night, alert), backdrops over a white and a grey world tile.
  6. Клавіші: on dark, on light, quiet, wide (P) «Пробіл / Space».
  7. Картка «як робити»: 4 frames, with and without the done frame; a 3-frame card.
  8. Поле: field normal, focus and read-only, with placeholder and selection; dropdown in every state.
  9. Вкладки: idle, hover, selected, selected + hover, disabled, focus.
  10. Рядок налаштувань і степер.
  11. Картки пресетів: idle, selected, quiet, plus the states.
  12. Карта: board, rooms, a lit zone, the pin at 0° and 80°, the «ти тут» chip.
  13. Мікрофон: on, off.
  14. Табличка з іменем: plain, with the mark.
  15. Заголовок і логотип.
  16. Текст: the 14 `type.*` tokens in on-dark and on-light colours.

---

## 9. Migrating toy.css (I)

### 9.1 Rules

- `toy.css` and `motion-preview.css` keep their selectors, hacks included. The wireframe markup does not change, and
  the hacks are retired when the styled screens are built from components.
- Every colour, length and weight becomes `var(--toy-…)`, `var(--ctx-…)` or `calc(var(--toy-…) * var(--px))` (lint
  L18 to L20).
- The 21 `--toy-*` palette variables and the 5 context variables in toy.css are deleted. The palette now comes from
  `dist/css/toy-tokens.css`, which `build-styles-page.js` injects before the skins. The context variables are renamed
  `--ctx-text`, `--ctx-text-muted`, `--ctx-title`, `--ctx-line` and `--ctx-base`, so they can never collide with a
  token.
- The dead rules `.marker` and `.circ` are removed. No frame uses them.
- **retro.css, card.css, meta.json and check_styles.js are frozen**: not edited, still built into styles.html, still
  checked by `check_styles.js retro card`.

### 9.2 Selector → tokens

| toy.css rule | After migration (prefix `body[data-style="toy"]` kept) |
|---|---|
| `.frame` (L11–41) | `--px: calc(1cqw / 19.2)`; `--ctx-text: var(--toy-color-on-dark-text)`; `--ctx-text-muted: …on-dark-text-muted`; `--ctx-title: …on-dark-title`; `--ctx-line: …on-dark-line`; `--ctx-base: …on-dark-base`; `color: var(--ctx-text)`; `font-weight: var(--toy-font-weight-semibold)` |
| `.frame .panel, .frame .map` | the five `--ctx-*` from `color.on-light.*` |
| `.b` · `.dimtext` | `var(--toy-font-weight-bold)` · `color: var(--ctx-text-muted)` |
| `.t16` · `.t18` | size `--toy-font-size-caption` / `-small`; letter spacing `--toy-font-letter-spacing-none` (**change**) |
| `.t36, .t48` · `.t64, .t96` | bold; letter spacing none · **tight** (the rule is split; **change**) |
| `.t28.b … .t64.b` | `color: var(--ctx-title)` |
| logo (L69) | `color: var(--toy-title-logo-normal-font-color)`; `text-shadow: 0 calc(var(--toy-title-logo-items-shadow-offset-y) * var(--px)) 0 var(--toy-title-logo-normal-font-shadow-color)` |
| `.t96` (L76) | bg, border and radius from `title.plate.normal`. `box-shadow: 0 calc((var(--toy-title-base-panel-expand-margin-bottom) - var(--toy-title-plate-normal-expand-margin-block)) * var(--px)) 0 var(--toy-title-base-panel-bg-color)`, which is 14 − 4 = 10. `padding: 0 calc((var(--toy-title-plate-normal-expand-margin-inline) - var(--toy-title-plate-normal-border-width)) * var(--px))`, which is 32. `margin: calc(var(--toy-title-plate-normal-expand-margin-block) * -1 * var(--px)) calc(var(--toy-title-plate-normal-expand-margin-inline) * -1 * var(--px))` |
| `.frame.dark`, `[style*="background:#0E0E0E"]` | `--toy-color-surface-night` |
| `.dim`, `.dim.more` | `--toy-color-surface-backdrop`, `-backdrop-deep` |
| `.plate`, `.frame.dark .plate`, `[data-in="down"]`, the current checklist step (yellow) | `plate.default`, `plate.night`, `plate.alert` tokens; `--toy-color-on-dark-title` |
| bar label plates (L109) | `bar.label` tokens |
| `.panel` | `panel.menu.panel` tokens; `box-shadow` depth 10, colour `--toy-panel-base-panel-bg-color` |
| `.btn` · `.btn.fill` · `.btn.ghost` | `button.secondary` · `button.primary` · ghost: `color: var(--ctx-text)`, `border-color: var(--ctx-line)`; the base colour from `var(--ctx-base)` |
| `.field` | `field.normal` (padding = cm − border = 7 13) |
| `.chip` · `.chip.light` · `.chip.line` · NEW | `chip.plate` (border 0, padding 4 14) · `chip.light` (border 3, padding 1 11) · `chip.line-on-*` through `--ctx-line`, `--ctx-text` · `chip.new` bg |
| `.key` · `.panel .key` · `.panel .key.dimtext` | `keycap.on-dark` · `.on-light` · `.quiet` (colours, widths and radius only; the em sizes stay in wireframes.html) |
| `.slot` · `.slot.dimtext` · `.slot.on` | `slot.idle` · `--toy-color-on-dark-text-muted` · `slot.active` |
| `.bar2` · `.panel .bar2` | `bar.progress` · `bar.slider` |
| `.cross` · `.mic` · `.ring` | `hud.crosshair` · `mic` · `hud.spinner` |
| `.tabs > div` · `.tabs > div.on` | `tab.normal` (**border 0, padding 10 16**, the weight stays semibold) · `tab.pressed` (`box-shadow` depth 4 ink, weight bold kept in frames) |
| `.setrow` · `.val` · `.val .ar` | `setting-row` (`border-bottom` with the row-line token) · ink · `stepper.normal` |
| `.card` · `.card.on` · `.card.on .dimtext` · `.card.dimtext` | `preset-card.normal` · `.pressed` (**padding 10**) · `preset-card.note-selected` · `preset-card-quiet` |
| `.dot`, swatch ring, radios | `pick.*` |
| how-to frames, `:nth-child(4)`, `.panel svg` | `howto.frame`, `howto.frame-done`, `--toy-color-outline` |
| `.map`, `.room`, zone, `.you` | `map.*` (rotation kept as `rotate(80deg)`) |
| `[data-bar]`, `> i`, stamina | `bar.track` (height `size.height` 16), the fill radius, `bar.stamina` fill |
| `[data-bar="health"] > i` | `background: var(--toy-bar-health-ramp-stop-16)`; `[data-bar="health"] > i[data-in="hurt"]`: `var(--toy-bar-health-ramp-stop-04)` (**change**). `color-mix` is gone (L22) |
| motion-preview.css | `transition` from `--toy-motion-press-*`; `.btn:not(.ghost)` uses `button.secondary.press`, `.btn.fill` uses `button.primary.press`, `.card` uses `preset-card.press` with the base colour `--toy-preset-card-base-panel-bg-color`; shadow = depth − offset (**changes**, §4.6); the `@media` block is dropped because the tokens CSS handles reduced motion |

### 9.3 Intended visual changes (everything else must be identical)

1. **Health fill at 22 % (s7 hurt):** #E87D46 → #EA7A46 (stop 04). The 80 % fill stays #92BA4C.
2. **Letter spacing:**
   - `.t16`, `.t18`: +0.01em → 0.
   - `.t36`, `.t48`: −0.01em → 0.
   - `.t64`, `.t96`: −0.01em → −1 px.
3. **Selected preset card (s5 host):** padding 12 → 10, so it is 2 px smaller on every side.
4. **Live only** (motion-preview):
   - The pressed travel is 4 and 5, not 5 and 6.
   - The card sinks onto a 2 px base.
   - The easing is cubic-bezier(0.33, 0.52, 0.64, 1).

### 9.4 Known Godot differences left visible in the frames (checked later in a Godot `shot`, not changed here)

- **Inner corners:** where the border widths are uneven (keycap 2/2/5, setting row bottom-only, spinner), Godot's
  inner corners are circles and CSS's are ellipses ([godot-facts §2](godot-facts.md#2-styleboxflat-properties-and-types)).
- **Toggle weight:** the frames still show the selected tab bold and the selected chips bold (`.b` in the markup).
  The components use one weight per toggle (decision 11, look question §11).
- **Button text sizes:** the frames show 22 or 24 px buttons, from the wireframe size classes. The variations fix one
  size each.
- **Line height:** CSS uses 1.25. Godot's single-line height is the font's ascent plus descent. The generator
  converts `lineHeight` to `line_spacing` per size using Comfortaa's metrics, which are not in the repo yet.

### 9.5 Proving it with local headless Edge: `node tools/visual/probe.js --before main`

The probe runs locally on Windows and is not part of CI.

1. **Pages.**
   - "before" = `git show main:pages/styles/styles.html`.
   - "after" = the freshly built `pages/styles/styles.html`.
   - A third page, **after + reverse patch**, injects `tools/visual/intended-changes.css`. That file restores exactly
     the old values of §9.3 items 1 to 3 in their old form (`.01em`, `-.01em`, `calc(12cqw / 19.2)`, `#E87D46`), with
     `!important`.
   - Each page is copied into the OS temp dir, never the repo.
2. **Injected probe script.**
   - It sets `data-style="toy"`, the `uk` language and zoom 1.
   - It forces `.frame { width: 1920px !important }` and `.stage { overflow: visible !important }`, so 1 cqw = 19.2 px
     and every length is a reference px.
   - It sets `* { transition: none !important }`.
   - For every `section.screen[data-states]` and every state (38 states over 10 screens), it clicks the state button
     and records every visible element of the frame. The key is screen, state and the element path from the frame.
3. **Record per element:**
   - position and size relative to the frame;
   - content-box rect;
   - background RGBA;
   - visible borders per side: width and RGBA. A border with alpha 0 counts as background, so `transparent 3px` with
     padding 1 equals border 0 with padding 4;
   - 4 corner radii;
   - `box-shadow` and `text-shadow`, normalised;
   - colour, font size, weight, letter spacing, line height;
   - transform, opacity.
4. **Edge run:**
   `"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --no-first-run
   --user-data-dir=<temp> --host-resolver-rules="MAP * ~NOTFOUND" --virtual-time-budget=20000
   --window-size=1920,1080 --dump-dom file:///<temp>/probe-after.html`
   - Edge 154 is installed.
   - The resolver rule blocks every network fetch, so nothing is downloaded and both runs fall back to the same font.
   - The probe writes its JSON into `<script type="application/json" id="probe-out">`, and node reads it from the
     dumped DOM.
   - That `--dump-dom` waits for the virtual-time budget in Edge 154 is (unconfirmed): verify once with a probe that
     sets the output from a 5 s timer.
5. **Compare** (`compare.js`). Numbers match within 0.02 px (layout snaps to 1/64 px); colours and strings must match
   exactly.
   - "after + reverse patch" must equal "before" **with zero differences**: the proof of zero unintended change.
   - "after" against "before" prints the intended differences for the PR description.
   - The probe exits 1 on any difference in the first comparison.

---

## 10. Validator profile additions (beyond dtcg-facts §9, items 40 to 56)

These are all [profile] items:

40. A variant group is any group with `$extensions…godot.variation`. Variation names match `^Toy[A-Za-z]+$` and are
    unique. `class` is one of Button, OptionButton, LineEdit, PanelContainer, Panel, Label, ProgressBar. `parent`
    names another variant whose class is the same.
41. A variant's children are only: the state names of its class (§7.0), `label`, `press`, `motion`, `items`, `text`,
    `size`, `ramp`, nested variants, and `note…` companions.
42. StyleBox fields are only the names in §7.0. A per-side field and its shorthand may both appear; the per-side one
    wins. Duplicating a shorthand is an error.
43. `shadow-size` = 0 and `shadow-color` alpha 0, or both absent (decision 5).
44. All dimensions are ints. `border-width-*`, `corner-radius-*` and `content-margin-*` are ≥ 0. A radius is either
    999 or at most half the smaller side, when `size` is known.
45. `content-margin-side ≥ border-width-side − expand-margin-side`, so the label never overlaps the border.
46. Button-class variants: the sums of top + bottom and of left + right content margins are equal across `normal`,
    `hover`, `pressed`, `hover-pressed` and `disabled` ([godot-facts §3.4](godot-facts.md#34-minimum-size)). The same
    holds for the border width once it has been added into the content margin.
47. A non-abstract Button or OptionButton has `disabled` and `focus`. A LineEdit has `focus` and `read-only`.
48. `focus` has `bg-color` alpha 0. Its border width aliases `{focus.width}`. Either `expand-margin` < 0 (inner, and
    then `content-margin-min − |expand| − focus.width ≥ 4` holds for every state), or `expand-margin` =
    `focus.gap + focus.width` (outer).
49. `press`:
    - `hover ≤ 0` and `disabled = depth`.
    - If `depth > 0`, then `0 ≤ held ≤ depth − 1`, and the variant has a base: nested `base…` variants, or the border
      base of item 51.
    - If `depth = 0`, then `held ≥ 0`.
50. A base variant's `panel` has `expand-margin-top = −expand-margin-bottom`. The bottom equals the owner's
    `press.depth` (or 10 for panels, map and title plate), and its radii equal the owner's `normal` radii. The title
    base is the one exception: its expand equals the plate's expand moved down 10.
51. A border base has `border-width-bottom − expand-margin-bottom` = the side border width, and `border-color` equals
    the colour of the base it replaces.
52. Component colour tokens are aliases. Their chains end in `palette.*`.
53. Component geometry tokens are literals, or aliases to `focus.*`.
54. The ramp: `steps` is an int ≥ 1. `full` and `empty` are colours. Stop names are reserved, so authoring
    `stop-NN` is an error.
55. `size.*` tokens are ints > 0.
56. Proposals: any `$extensions…proposal` is `true`. The build lists the proposals with their paths in the pack.

---

## 11. Risks and questions for the engineer

**Risks (technical, mine to watch):**
- **Code in prime-game.** The base nodes and `ToyPress` are component code there. Without them, buttons have no base
  and no press feedback, though they still look right otherwise.
- **The resolution move gates everything.** The 1920×1080 base must land before the generator runs.
- **Element heights will differ slightly** between CSS and Godot until Comfortaa's metrics are in the repo, which
  needs the font download (§9.4).
- **Edge `--dump-dom` timing** is unconfirmed (§9.5).
- **Node 20 is past end of life** (§1.7).
- **Authoring load.** There are about 80 variations and about 1,100 source tokens. Shorthands and completion keep this
  manageable, and the validator catches inconsistencies.
- **Health is drawn in 21 steps**, not continuously. The worst error is ΔE_ok 0.0067.
- **The disabled face covers its base exactly**, so anti-aliased edges may show a faint tint of the base colour.

**Look questions (the engineer's):**
1. **Disabled** = sunk flat, lavender face, muted plum text and outline. OK?
2. **Focus** = the outline thickens inward to 6 px (ink on light faces, cream on dark ghosts). Chips, stepper and
   radio get an outside ring at a 2 px gap. OK?
3. **Toggles keep one weight**: 600 (the selected tab and chips lose bold) or 700 (every tab and chip bold)?
4. **A coral danger button** for the host's "Покинути сесію" and the confirm dialog: yes or no?
5. **Large text** ×1.25 (18→23, 22→28, 24→30, 36→45, 96→120). OK, or a different step?
6. **Hover for flat controls** (a lavender or night-plate fill), a 1 px hover lift for preset cards, and the stepper
   held in honey. OK?
7. **The selected preset card** stays the size of an idle one (padding 10 instead of 12). OK?
8. **x15** (lilac on the menu backdrop over a white wall, 3.93:1): raise `.dim` to 74 % or lighten lilac?
9. **Merge the near-duplicates?** There are 4 dark plums and 4 pale lilacs (inventory §1). The tokens keep all 30
   colours until you decide.

## Sources

- Local research: [godot-facts.md](godot-facts.md), [dtcg-facts.md](dtcg-facts.md), [inventory.md](inventory.md),
  [inventory.json](inventory.json), [lens 3](../2026-10-02-wave-1/lens-3-system.md), [lens 6](../2026-10-02-wave-1/lens-6-a11y.md),
  [ui-decisions.md](../../ui-decisions.md); pages: `toy.css`, `motion-preview.css`, `check_styles.js`,
  `build-styles-page.js`, `wireframes.html`.
- Godot 4.7.2: API dump `D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json` (queried for `button_down`,
  `button_up`, `mouse_entered`, `focus_entered`, `offset_transform_position`, `self_modulate`, `StyleBoxEmpty`,
  `TRANS_SINE = 1`, `EASE_OUT = 1`, `accessibility_should_reduce_animation`);
  [base_button.cpp](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/base_button.cpp#L204-L308);
  [@GlobalScope.xml `roundi`](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/@GlobalScope.xml#L1154-L1158).
- CSS: [CSS Custom Properties 1 §2](https://www.w3.org/TR/css-variables-1/#defining-variables) ("custom properties
  resolve any var() functions in their values at computed-value time, which occurs before the value is inherited");
  [CSS Containment 3, container lengths](https://www.w3.org/TR/css-contain-3/#container-lengths) ("the nearest
  ancestor container").
- WCAG: [WCAG 2.2 §1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum) (inactive components exempt).
- CI: [nodejs/Release schedule.json](https://github.com/nodejs/Release/blob/main/schedule.json) (v20 end 2026-04-30);
  [actions/setup-node v7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0);
  [actions/checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1);
  [prime-game ci.yml](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/.github/workflows/ci.yml).
- Game repo (read only, `83a2c2f`): `client/ui/theme/game_theme.tres`, `.github/workflows/ci.yml`.
