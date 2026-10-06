# Toy tokens and components: the build spec

The spec for [prime-game-ui#5](https://github.com/xperiaroco2/prime-game-ui/issues/5): DTCG 2025.10 design tokens and
components for the chosen style Toy ([`docs/ui-decisions.md`](../../ui-decisions.md), Style), 2026-10-03.

It starts from architecture A (Godot first, [`architecture-a.md`](architecture-a.md)) and grafts in the better parts of
architecture B ([`architecture-b.md`](architecture-b.md)). Why A won and what was taken from B is in
[`judge.md`](judge.md). Ground facts: [`godot-facts.md`](godot-facts.md), [`dtcg-facts.md`](dtcg-facts.md),
[`inventory.md`](inventory.md), [`inventory.json`](inventory.json).

The spec is written so that four builder agents can work in parallel on disjoint files without asking questions (§16).
Where a table and a listing below disagree, the token tables of §3 and §4 win, and the builder reports the mismatch in
the PR.

**Conventions.**
- px are reference px at the 1920×1080 frame. All are ints.
- **(P)** marks a value added where the Toy mock-up had no state: a proposal for the engineer (§18). The token files mark
  every one of them (§3.5).
- Godot facts cite the 4.7.2 engine source or the API dump, through [`godot-facts.md`](godot-facts.md) unless a link is
  given.

---

## 0. The decisions

| # | Question | Decision | Reason |
|---|---|---|---|
| 1 | Reference size | Tokens are int px at **1920×1080**; the pack says so; the generator refuses to run until the game's viewport base is 1920×1080 | At the game's current 1152×648 base every int would be ×0.6 and rounded ([godot-facts §0, §8](godot-facts.md)) |
| 2 | Tiers | primitive (literals) → semantic (aliases: colour roles by context, type roles, motion) → component (one group per Godot type variation; its children are the variation's StyleBox items with exactly `StyleBoxFlat`'s fields, plus font colours) | The game reads the component tier one to one; both the showcase CSS and the Godot theme are generated from it, so no look is ever written twice ([CLAUDE.md](../../../CLAUDE.md): "never hand-copied") |
| 3 | Geometry | Int literals, or aliases to the role scales `stroke.*`, `radius.*`, `focus.*` | One edit changes every control outline or radius; one-off insets stay literal |
| 4 | Toy base | **Never** `StyleBoxFlat.shadow_*`. A **layer**: a base `Panel` behind the face inside a `MarginContainer` (every pressable, panels, the map board, the title plate). A **merge**: a thicker bottom border plus `expand_margin_bottom` (only the selected Esc tab) | `shadow_size ≥ 1` adds a 1 px linear fade (godot-facts §1.2); both forms are exact; the layer can be hidden (decision 8) |
| 5 | Press | The face moves by `Control.offset_transform_position` with **`offset_transform_enabled = true`**, tweened 70 ms, `TRANS_SINE` + `EASE_OUT`; the base stays still. The offsets per state are theme constants | Visual only: layout and hit area stay put (godot-facts §4 option B). The enable flag defaults to false ([Control.xml L1161-L1163](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Control.xml#L1161-L1163)) |
| 6 | Easing token | `cubicBezier [0.33, 0.52, 0.64, 1]`, with `$extensions` `{trans: TRANS_SINE, ease: EASE_OUT}` | Within 0.00051 of Godot's SINE/OUT `sin(πt/2)`, computed; CSS `ease-out` is 0.024 away (godot-facts §4) |
| 7 | Health colour | 21 stops computed once by the build in OKLab from the engineer's two end colours, every 0.05. Both engines draw the **nearest stop's stored hex**: `step = floor(hp × 20 + 0.5)` | Exact in both engines, with no colour maths at draw time; the gate covers every colour that can ever be drawn; nearest-stop error ≤ ΔE_ok 0.0096 (computed) |
| 8 | Disabled (P) | **Unplugged**: base hidden, face at rest, pale lilac face `#F3EDF6`, muted plum outline and label | Distinct from "held"; no base-coloured fringe |
| 9 | Focus (P) | **Inner**: the outline thickens inward by 3 px (a `focus` StyleBox with negative expand margins). **Outer** on small flat controls (chips, stepper, radio): a 3 px ring 2 px outside | Moves with the face, never crosses the base, works on any background |
| 10 | Toggles | A toggle is two variations, `X` (idle) and `XSelected`; the toggle component swaps `theme_type_variation` on `toggled` | Keeps the approved bold selected tab and chips: a Button has one `font` for all states (godot-facts §3) |
| 11 | Modes | Resolver modifiers `textSize` (default, large (P)) and `motion` (default, reduced); orthogonal | [dtcg-facts §5](dtcg-facts.md) |
| 12 | CSS lengths | Length variables are **unitless ints**; every use writes `calc(var(--toy-…) * var(--px))`; `--px` is set per page or per frame | `var()` inside a custom property is substituted where it is declared ([css-variables-1 §2](https://www.w3.org/TR/css-variables-1/#defining-variables)), so a length token holding `var(--px)` would freeze `--px` at `:root` |
| 13 | Pack | One file, `dist/pack/toy.pack.json`: defaults flat and resolved, mode overrides, complete StyleBox records, variation hints | The prime-game generator needs no inheritance logic or defaults |
| 14 | Build and checks | Zero-dependency node 20 under `tools/`; outputs committed under `dist/`; `--check` modes; one entry point `node tools/check.js`; GitHub Actions on node 20 | Repo rule ([CLAUDE.md](../../../CLAUDE.md), `tools/a11y`) |

---

## 1. File layout and owners

The digits are the builder that owns each file (§16).

```
tokens/                                        DTCG 2025.10 sources: the single source of truth
  prime.resolver.json                       1  one set + modifiers textSize, motion (§3.1)
  primitives.tokens.json                    1  palette, font, ease, duration.none, focus, stroke, radius (§3.2)
  semantic.tokens.json                      1  colour roles, type roles, motion.press (§3.4)
  components/<name>.tokens.json             1  20 files: backdrop bar button chip field howto hud keycap map mic
                                               name-plate panel pick plate preset-card setting slot tab text title (§4)
  text-size/default.tokens.json             1  font.size.* (§3.3)
  text-size/large.tokens.json               1
  motion/default.tokens.json                1  duration.press (§3.3)
  motion/reduced.tokens.json                1
  release.json                              1  {"version": "0.1.0"}: the semver the next ui-<semver> tag carries
  gates.json                                2  contrast pairs, surfaces, waivers (§11; not a DTCG file)
tools/
  lib/json-strict.js                        1  RFC 8259 parser: duplicate keys, positions, JSON Pointers in errors
  lib/color.js                              1  hex <-> sRGB floats, sRGB <-> OKLab, OKLab mix (§7.5)
  lib/wcag.js                               2  relative luminance, ratio, alpha compositing (§11.5)
  tokens/build.js                           1  node tools/tokens/build.js [--check]
  tokens/api.js                             1  load() for builders 2 and 3 (§7.4)
  tokens/validate.js resolve.js expand.js
         emit-css.js emit-pack.js           1
  tokens/test/run.js                        1  validator self-test + spec spot values (§7.6)
  tokens/test/expect-values.json            1
  tokens/test/fixtures/good/<name>/…        1
  tokens/test/fixtures/bad/<rule>-<slug>/…  1
  tokens/test/fixtures/warn/<rule>-<slug>/… 1
  lint/godot-css.js                         2  node tools/lint/godot-css.js [--self-test]
  lint/rules.js                             2
  lint/targets.json                         2
  lint/fixtures/fixture-tokens.css          2
  lint/fixtures/good/*.css                  2
  lint/fixtures/bad/L<nn>-<slug>.css        2
  contrast/gates.js                         2  node tools/contrast/gates.js [--check | --self-test]
  contrast/fixtures/<case>/{pack.json,gates.json,expect.json}   2
  check.js                                  2  the one entry point (§12)
  visual/probe.js                           4  zero-change proof, local Windows + Edge, not CI (§15.5)
  visual/compare.js                         4
  visual/intended-changes.css               4
  a11y/                                        unchanged
dist/                                          generated and committed; never edited by hand; LF endings
  css/toy-tokens.css                        1  every token as a CSS variable, plus the mode blocks (§8)
  pack/toy.pack.json                        1  the game's pack (§9)
  gates.json                                2  every gate result, embedded by the showcase (§11.6)
pages/
  components/                               3  the showcase (§13, §14)
    build.js  emit-css.js  showcase.json  strings.json  page.css  page.js
    icons/*.svg  icons/LICENCES.json
    toy-components.css                         generated: one class per type variation
    components.html                            generated: the page
  styles/
    toy.css  motion-preview.css             4  migrated onto token variables (§15)
    build-styles-page.js  styles.html       4
    retro.css card.css meta.json check_styles.js   frozen: never edited
.github/workflows/check.yml                 2  CI (§12.2)
```

No `package.json` and no `node_modules`: every script uses only node's own modules (`fs`, `path`, `child_process`,
`crypto`, `os`).

---

## 2. Names and notation

**Token names**
- Lower kebab-case segments, `^[a-z0-9]+(-[a-z0-9]+)*$` (dtcg-facts §9 item 6). Paths are dot-joined.
- The **CSS name** of a path is `--toy-` + the path with every `.` replaced by `-`. The validator fails if two paths give
  the same CSS name.
- Composite sub-values get suffixes:
  - typography: `-font-family`, `-font-size`, `-font-weight`, `-letter-spacing`, `-line-height`;
  - transition: `-duration`, `-delay`, `-timing-function`.

**`$extensions` namespace:** `io.github.xperiaroco2.prime-game`. Allowed members:
- `godot`, on variant groups: `{variation, class, parent?, abstract?, base?, toggle?, on?}`. On `ease.press`:
  `{trans, ease}`.
- `context`, on variant groups: `"dark" | "light" | "any"`.
- `proposal: true`, on any token or group the engineer has not approved.

**Notation in the tables** of §3 and §4:

| Short | Means |
|---|---|
| `p.x` / `c.x` / `t.x` | `{palette.x}` / `{color.x}` / `{type.x}` |
| `s.thin` `s.control` `s.surface` `s.bold` | `{stroke.thin}` … `{stroke.bold}` |
| `rd.small` `rd.medium` `rd.large` `rd.control` `rd.surface` `rd.pill` | `{radius.small}` … `{radius.pill}` |
| `fw` | `{focus.width}` |
| `bg` · `bc` · `bw` · `r` · `cm` · `ex` · `font` | `bg-color` · `border-color` · `border-width` · `corner-radius` · `content-margin` · `expand-margin` · `font-color` |
| `label t.x` | the variant's `label` token = `{type.x}` |
| box values | 1 value: all sides; 2: block inline; 3: top inline bottom; 4: top right bottom left. Radii with 4 values: TL TR BR BL |
| "= normal" | the state group is omitted, and completion (§3.5) fills it |

A number without a prefix is an int px literal: `{ "value": N, "unit": "px" }`.

---

## 3. Tokens

### 3.1 `tokens/prime.resolver.json` (complete)

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
        { "$ref": "components/preset-card.tokens.json" }, { "$ref": "components/setting.tokens.json" },
        { "$ref": "components/slot.tokens.json" }, { "$ref": "components/tab.tokens.json" },
        { "$ref": "components/text.tokens.json" }, { "$ref": "components/title.tokens.json" }
      ]
    }
  },
  "modifiers": {
    "textSize": {
      "description": "The player's text size setting. Owns font.size.*.",
      "contexts": { "default": [{ "$ref": "text-size/default.tokens.json" }],
                    "large": [{ "$ref": "text-size/large.tokens.json" }] },
      "default": "default"
    },
    "motion": {
      "description": "The player's reduced-motion setting. Owns duration.press.",
      "contexts": { "default": [{ "$ref": "motion/default.tokens.json" }],
                    "reduced": [{ "$ref": "motion/reduced.tokens.json" }] },
      "default": "default"
    }
  },
  "resolutionOrder": [ { "$ref": "#/sets/base" }, { "$ref": "#/modifiers/textSize" }, { "$ref": "#/modifiers/motion" } ]
}
```

### 3.2 Primitives (`tokens/primitives.tokens.json`, literals only)

**Palette.** Group `$type: color`. `colorSpace` is `srgb`, components are `round(byte / 255, 4)`, `hex` is lowercase, and
`alpha` is omitted when it is 1. Every value comes from `toy.css` through the inventory ([inventory §1.1, §1.3](inventory.md)).
Nothing is merged: merging near-duplicates is a look question (§18).

| Token | Hex | Alpha | From | Token | Hex | Alpha | From |
|---|---|---|---|---|---|---|---|
| `palette.ink` | #2a1f33 | | `--toy-ink` | `palette.track-dark` | #4a3c5c | | `--toy-track-dark` |
| `palette.night` | #1f1727 | | `--toy-night` | `palette.muted` | #64566f | | `--toy-muted` |
| `palette.plate` | #2a1f33 | 0.86 | `--toy-plate` | `palette.lilac` | #d8cce3 | | `--toy-lilac` |
| `palette.plate-solid` | #352a41 | | `--toy-plate-solid` | `palette.keyshade` | #b9a8c7 | | `--toy-keyshade` |
| `palette.cream` | #fff4e2 | | `--toy-cream` | `palette.slotline` | #9a8ca6 | | `--toy-slotline` |
| `palette.white` | #ffffff | | `--toy-white` | `palette.health-full` | #5bcb4e | | `--toy-health-full` |
| `palette.yellow` | #ffc23a | | `--toy-yellow` | `palette.health-empty` | #ff5a44 | | `--toy-health-empty` |
| `palette.honey` | #c98a10 | | `--toy-honey` | `palette.key-quiet` | #f3edf6 | | toy.css L195 literal |
| `palette.coral` | #ff8466 | | `--toy-coral` | `palette.row-line` | #e2d6ea | | L254 literal |
| `palette.coral-deep` | #d9482f | | `--toy-coral-deep` | `palette.muted-deep` | #4a3b55 | | L281 literal |
| `palette.mint` | #3cc4a8 | | `--toy-mint` | `palette.backdrop` | #261c30 | 0.7 | L91 `.dim` |
| `palette.mint-tint` | #d5f4ec | | `--toy-mint-tint` | `palette.backdrop-deep` | #261c30 | 0.8 | L92 `.dim.more` |
| `palette.lavender` | #e9dff0 | | `--toy-lavender` | `palette.drop` | #0f0a14 | 0.6 | L122, L311 panel and map base |
| `palette.track-light` | #dccfe4 | | `--toy-track-light` | `palette.zone` | #ffc23a | 0.55 | L324 map zone |
| | | | | `palette.clear` | #000000 | 0 | `transparent` |

That is 28 colours plus `clear`: 29 tokens.

**The other primitives**

| Token | Type | Value | Note |
|---|---|---|---|
| `font.family.base` | fontFamily | `"Comfortaa"` | SIL OFL 1.1, Reserved Font Name; ship unmodified ([ui-decisions, Type](../../ui-decisions.md)) |
| `font.weight.semibold`, `font.weight.bold` | fontWeight | 600, 700 | numbers: named weights under a group `$type` fail the schema (dtcg-facts §4) |
| `font.letter-spacing.none`, `font.letter-spacing.tight` | dimension | 0, −1 | toy.css `em` values rounded to whole px: `spacing_glyph` is an int (godot-facts §5) |
| `font.line-height.base` | number | 1.25 | the wireframe `.frame` |
| `ease.press` | cubicBezier | `[0.33, 0.52, 0.64, 1]` | `$extensions … godot: { "trans": "TRANS_SINE", "ease": "EASE_OUT" }` |
| `duration.none` | duration | 0 ms | transition delays |
| `focus.width` (P) | dimension | 3 | lens 6 asks for at least 2, proposes 3 |
| `focus.gap` (P) | dimension | 2 | the outer ring's gap |
| `stroke.thin` / `.control` / `.surface` / `.bold` | dimension | 2 / 3 / 4 / 5 | inventory §2.1 scale |
| `radius.small` / `.medium` / `.large` / `.control` / `.surface` / `.pill` | dimension | 8 / 12 / 16 / 18 / 24 / 999 | inventory §2.2; 999 is the pill and circle in both engines (godot-facts §2) |

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "palette": {
    "$type": "color",
    "$description": "The Toy palette chosen on prime-game-ui#2, from pages/styles/toy.css.",
    "ink": { "$value": { "colorSpace": "srgb", "components": [0.1647, 0.1216, 0.2], "hex": "#2a1f33" } },
    "night": { "$value": { "colorSpace": "srgb", "components": [0.1216, 0.0902, 0.1529], "hex": "#1f1727" } },
    "plate": { "$value": { "colorSpace": "srgb", "components": [0.1647, 0.1216, 0.2], "alpha": 0.86, "hex": "#2a1f33" } },
    "plate-solid": { "$value": { "colorSpace": "srgb", "components": [0.2078, 0.1647, 0.2549], "hex": "#352a41" } },
    "cream": { "$value": { "colorSpace": "srgb", "components": [1, 0.9569, 0.8863], "hex": "#fff4e2" } },
    "white": { "$value": { "colorSpace": "srgb", "components": [1, 1, 1], "hex": "#ffffff" } },
    "yellow": { "$value": { "colorSpace": "srgb", "components": [1, 0.7608, 0.2275], "hex": "#ffc23a" } },
    "honey": { "$value": { "colorSpace": "srgb", "components": [0.7882, 0.5412, 0.0627], "hex": "#c98a10" } },
    "coral": { "$value": { "colorSpace": "srgb", "components": [1, 0.5176, 0.4], "hex": "#ff8466" } },
    "coral-deep": { "$value": { "colorSpace": "srgb", "components": [0.851, 0.2824, 0.1843], "hex": "#d9482f" } },
    "mint": { "$value": { "colorSpace": "srgb", "components": [0.2353, 0.7686, 0.6588], "hex": "#3cc4a8" } },
    "mint-tint": { "$value": { "colorSpace": "srgb", "components": [0.8353, 0.9569, 0.9255], "hex": "#d5f4ec" } },
    "lavender": { "$value": { "colorSpace": "srgb", "components": [0.9137, 0.8745, 0.9412], "hex": "#e9dff0" } },
    "track-light": { "$value": { "colorSpace": "srgb", "components": [0.8627, 0.8118, 0.8941], "hex": "#dccfe4" } },
    "track-dark": { "$value": { "colorSpace": "srgb", "components": [0.2902, 0.2353, 0.3608], "hex": "#4a3c5c" } },
    "muted": { "$value": { "colorSpace": "srgb", "components": [0.3922, 0.3373, 0.4353], "hex": "#64566f" } },
    "lilac": { "$value": { "colorSpace": "srgb", "components": [0.8471, 0.8, 0.8902], "hex": "#d8cce3" } },
    "keyshade": { "$value": { "colorSpace": "srgb", "components": [0.7255, 0.6588, 0.7804], "hex": "#b9a8c7" } },
    "slotline": { "$value": { "colorSpace": "srgb", "components": [0.6039, 0.549, 0.651], "hex": "#9a8ca6" } },
    "health-full": { "$value": { "colorSpace": "srgb", "components": [0.3569, 0.7961, 0.3059], "hex": "#5bcb4e" } },
    "health-empty": { "$value": { "colorSpace": "srgb", "components": [1, 0.3529, 0.2667], "hex": "#ff5a44" } },
    "key-quiet": { "$value": { "colorSpace": "srgb", "components": [0.9529, 0.9294, 0.9647], "hex": "#f3edf6" } },
    "row-line": { "$value": { "colorSpace": "srgb", "components": [0.8863, 0.8392, 0.9176], "hex": "#e2d6ea" } },
    "muted-deep": { "$value": { "colorSpace": "srgb", "components": [0.2902, 0.2314, 0.3333], "hex": "#4a3b55" } },
    "backdrop": { "$value": { "colorSpace": "srgb", "components": [0.149, 0.1098, 0.1882], "alpha": 0.7, "hex": "#261c30" } },
    "backdrop-deep": { "$value": { "colorSpace": "srgb", "components": [0.149, 0.1098, 0.1882], "alpha": 0.8, "hex": "#261c30" } },
    "drop": { "$value": { "colorSpace": "srgb", "components": [0.0588, 0.0392, 0.0784], "alpha": 0.6, "hex": "#0f0a14" } },
    "zone": { "$value": { "colorSpace": "srgb", "components": [1, 0.7608, 0.2275], "alpha": 0.55, "hex": "#ffc23a" } },
    "clear": { "$value": { "colorSpace": "srgb", "components": [0, 0, 0], "alpha": 0, "hex": "#000000" } }
  },
  "font": {
    "family": { "$type": "fontFamily", "base": { "$value": "Comfortaa" } },
    "weight": { "$type": "fontWeight", "semibold": { "$value": 600 }, "bold": { "$value": 700 } },
    "letter-spacing": { "$type": "dimension",
      "none": { "$value": { "value": 0, "unit": "px" } }, "tight": { "$value": { "value": -1, "unit": "px" } } },
    "line-height": { "$type": "number", "base": { "$value": 1.25 } }
  },
  "ease": {
    "$type": "cubicBezier",
    "press": {
      "$description": "The CSS image of Godot's TRANS_SINE + EASE_OUT (Tween has no cubic-bezier).",
      "$value": [0.33, 0.52, 0.64, 1],
      "$extensions": { "io.github.xperiaroco2.prime-game": { "godot": { "trans": "TRANS_SINE", "ease": "EASE_OUT" } } }
    }
  },
  "duration": { "$type": "duration", "none": { "$value": { "value": 0, "unit": "ms" } } },
  "focus": {
    "$type": "dimension",
    "$description": "Keyboard and gamepad focus ring (proposal).",
    "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } },
    "width": { "$value": { "value": 3, "unit": "px" } },
    "gap": { "$value": { "value": 2, "unit": "px" } }
  },
  "stroke": { "$type": "dimension",
    "thin": { "$value": { "value": 2, "unit": "px" } }, "control": { "$value": { "value": 3, "unit": "px" } },
    "surface": { "$value": { "value": 4, "unit": "px" } }, "bold": { "$value": { "value": 5, "unit": "px" } } },
  "radius": { "$type": "dimension",
    "small": { "$value": { "value": 8, "unit": "px" } }, "medium": { "$value": { "value": 12, "unit": "px" } },
    "large": { "$value": { "value": 16, "unit": "px" } }, "control": { "$value": { "value": 18, "unit": "px" } },
    "surface": { "$value": { "value": 24, "unit": "px" } }, "pill": { "$value": { "value": 999, "unit": "px" } } }
}
```

### 3.3 Modifier files (primitives, each owned by one modifier)

| Token (`font.size.*`, dimension) | `text-size/default` | `text-size/large` (P) | Frame class today |
|---|---|---|---|
| `font.size.caption` | 18 | 23 | `.t16`, `.room` |
| `font.size.small` | 20 | 25 | `.t18`, `.t20` |
| `font.size.body` | 22 | 28 | `.t22` |
| `font.size.body-large` | 24 | 30 | `.t24` |
| `font.size.heading` | 28 | 35 | `.t28` |
| `font.size.title` | 36 | 45 | `.t36` |
| `font.size.display` | 48 | 48 | `.t48` |
| `font.size.display-large` | 64 | 64 | `.t64` |
| `font.size.hero` | 96 | 96 | `.t96` |

**Large text** is ×1.25, rounded half up, for sizes up to 36. 48 px and up is already large text, and those sizes sit in
fixed plates and timers. A wider UI scale is `Window.content_scale_factor`'s job (godot-facts §8).

```json
{ "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "font": { "size": { "$type": "dimension",
    "caption": { "$value": { "value": 18, "unit": "px" } }, "small": { "$value": { "value": 20, "unit": "px" } },
    "body": { "$value": { "value": 22, "unit": "px" } }, "body-large": { "$value": { "value": 24, "unit": "px" } },
    "heading": { "$value": { "value": 28, "unit": "px" } }, "title": { "$value": { "value": 36, "unit": "px" } },
    "display": { "$value": { "value": 48, "unit": "px" } }, "display-large": { "$value": { "value": 64, "unit": "px" } },
    "hero": { "$value": { "value": 96, "unit": "px" } } } } }
```

`text-size/large.tokens.json` has the same paths with the values 23, 25, 28, 30, 35, 45, 48, 64, 96. The group carries
`"$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } }` and a `$description`.

```json
{ "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "duration": { "$type": "duration", "press": { "$value": { "value": 70, "unit": "ms" } } } }
```

`motion/reduced.tokens.json` is the same with `0`.

### 3.4 Semantic (`tokens/semantic.tokens.json`, aliases of primitives only)

**Colours (`color.*`, 33 tokens)**

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
| `color.status.alert` | p.coral | `color.state.disabled-face` (P) | p.key-quiet |
| `color.state.disabled-ink` (P) | p.muted | `color.state.disabled-ink-on-dark` (P) | p.lilac |
| `color.state.hover-on-dark` (P) | p.plate-solid | `color.state.hover-on-light` (P) | p.lavender |
| `color.state.held-accent` (P) | p.honey | | |

**Typography (`type.*`, 14 tokens).** Each is
`{fontFamily: {font.family.base}, fontSize: {font.size.X}, fontWeight: {font.weight.Y}, letterSpacing: {font.letter-spacing.Z}, lineHeight: {font.line-height.base}}`.

| Token | fontSize | fontWeight | letterSpacing |
|---|---|---|---|
| `type.caption` / `type.caption-bold` | caption | semibold / bold | none |
| `type.small` / `type.small-bold` | small | semibold / bold | none |
| `type.body` / `type.body-bold` | body | semibold / bold | none |
| `type.body-large` / `type.body-large-bold` | body-large | semibold / bold | none |
| `type.heading` / `type.heading-bold` | heading | semibold / bold | none |
| `type.title` | title | bold | none |
| `type.display` | display | bold | none |
| `type.display-large` | display-large | bold | tight |
| `type.hero` | hero | bold | tight |

**Motion.** `motion.press` (transition) = `{duration: {duration.press}, delay: {duration.none}, timingFunction: {ease.press}}`.

Total: 48 semantic tokens.

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "color": {
    "$type": "color",
    "on-dark": { "$description": "Text and lines on dark surroundings: world plates, backdrops, night.",
      "text": { "$value": "{palette.cream}" }, "text-muted": { "$value": "{palette.lilac}" },
      "title": { "$value": "{palette.yellow}" }, "line": { "$value": "{palette.cream}" }, "base": { "$value": "{palette.honey}" } },
    "on-light": { "$description": "Text and lines on cream panels and the lavender map board.",
      "text": { "$value": "{palette.ink}" }, "text-muted": { "$value": "{palette.muted}" },
      "title": { "$value": "{palette.ink}" }, "line": { "$value": "{palette.ink}" }, "base": { "$value": "{palette.ink}" } },
    "on-accent": { "text": { "$value": "{palette.ink}" }, "text-muted": { "$value": "{palette.muted-deep}" } },
    "outline": { "$value": "{palette.ink}" },
    "surface": {
      "night": { "$value": "{palette.night}" }, "night-plate": { "$value": "{palette.plate-solid}" },
      "plate": { "$value": "{palette.plate}" }, "backdrop": { "$value": "{palette.backdrop}" },
      "backdrop-deep": { "$value": "{palette.backdrop-deep}" }, "panel": { "$value": "{palette.cream}" },
      "board": { "$value": "{palette.lavender}" }, "tile": { "$value": "{palette.white}" }, "drop": { "$value": "{palette.drop}" } },
    "status": {
      "stamina": { "$value": "{palette.yellow}" }, "health-full": { "$value": "{palette.health-full}" },
      "health-empty": { "$value": "{palette.health-empty}" }, "progress": { "$value": "{palette.mint}" },
      "alert": { "$value": "{palette.coral}" } },
    "state": {
      "$description": "State colours added where the mock-up had none (proposals).",
      "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } },
      "disabled-face": { "$value": "{palette.key-quiet}" }, "disabled-ink": { "$value": "{palette.muted}" },
      "disabled-ink-on-dark": { "$value": "{palette.lilac}" }, "hover-on-dark": { "$value": "{palette.plate-solid}" },
      "hover-on-light": { "$value": "{palette.lavender}" }, "held-accent": { "$value": "{palette.honey}" } }
  },
  "type": {
    "$type": "typography",
    "caption": { "$value": { "fontFamily": "{font.family.base}", "fontSize": "{font.size.caption}",
      "fontWeight": "{font.weight.semibold}", "letterSpacing": "{font.letter-spacing.none}", "lineHeight": "{font.line-height.base}" } },
    "hero": { "$value": { "fontFamily": "{font.family.base}", "fontSize": "{font.size.hero}",
      "fontWeight": "{font.weight.bold}", "letterSpacing": "{font.letter-spacing.tight}", "lineHeight": "{font.line-height.base}" } }
  },
  "motion": { "$type": "transition",
    "press": { "$value": { "duration": "{duration.press}", "delay": "{duration.none}", "timingFunction": "{ease.press}" } } }
}
```

The `type` group has all 14 tokens of the table. Only two are shown above.

### 3.5 The component tier: shape, fields, completion

**A variant group** is a group whose `$extensions…godot.variation` is set. One variant group is one Godot type variation.
Variant groups are never nested. Plain groups (`button`, `chip`, …) only hold variant groups.

**State groups per class.** These, plus `label`, `press`, `motion`, `items`, `size` and `ramp`, are the only children
of a variant group.

| Class | State groups (token name → Godot StyleBox item) | Colours in states |
|---|---|---|
| Button (also toggles) | `normal`, `hover`, `pressed`, `hover-pressed`, `disabled`, `focus` | `font-color` per state |
| OptionButton | as Button | as Button |
| LineEdit | `normal`, `focus`, `read-only` (→ `read_only`) | `font-color` in `normal` and `read-only` |
| PanelContainer, Panel | `panel` | none (text sits in a companion Label variation) |
| Label | `normal` (StyleBox fields optional: absent means `StyleBoxEmpty`) | `font-color`, `font-shadow-color` |
| ProgressBar | `background` (absent means `StyleBoxEmpty`), `fill` | none |

**StyleBox fields (authoring forms):**
- `bg-color`;
- `border-color` (default `{palette.clear}`);
- `border-width`, or per side `border-width-top|right|bottom|left`;
- `corner-radius`, or per corner `corner-radius-top-left|top-right|bottom-right|bottom-left`;
- `content-margin`, `content-margin-block`, `content-margin-inline`, or per side `content-margin-top|right|bottom|left`;
- `expand-margin`, `-block`, `-inline`, or per side, as for content margins.

**Forbidden:** `draw-center` (derived: false when `bg-color` alpha is 0) and every `shadow-*` (decision 4).

**Precedence:** a per-side value beats an axis value, which beats the shorthand.

**The authoring convention** is binding, because the CSS variable names depend on it. Use the most compact form that does
not overlap:
- If all four sides or corners are equal, use the shorthand.
- For margins, an axis whose two sides are equal uses `-block` or `-inline`; an unequal axis uses its two per-side
  names.
- Unequal border widths and unequal radii are written as all four per-side names.
- Zero expand sides are omitted.

Examples:
- `cm 12 22` → `content-margin-block`, `content-margin-inline`.
- `cm 2 10 5` → `content-margin-top`, `content-margin-inline`, `content-margin-bottom`.
- `ex −6 36 14 36` → `expand-margin-top`, `expand-margin-inline`, `expand-margin-bottom`.
- `bw 3 3 7 3` → all four `border-width-*`.

**Other children:**

| Child | Type | Allowed on | Godot |
|---|---|---|---|
| `label` | typography (alias of `type.*`) | Button, OptionButton, LineEdit, Label | `font` (a FontVariation of weight + letter spacing) and `font_size` |
| `press.depth`, `.hover`, `.held`, `.disabled` | dimension (group `$type`) | Button | constants `press_depth`, `press_hover`, `press_held`, `press_disabled` |
| `motion` | transition (alias of `motion.press`) | the abstract ToyButton only | constants `press_duration_ms`, `press_trans`, `press_ease` |
| `items.*` | as needed | per table in §4 | colours or constants named in §4.18 |
| `size.width`, `.height`, `.wide-width`, `.min-width`, `.wide-min-width` | dimension (group `$type`) | any | constants `width`, `height`, `wide_width`, `min_width`, `wide_min_width`, read by component code for `custom_minimum_size` |
| `ramp.full`, `ramp.empty`, `ramp.steps` | color, color, number | ProgressBar `bar.health` | colours `ramp_stop_00` … `ramp_stop_20` (§5) |

**Typing.** Every token in a state group, in `label` and in `items` carries its own `$type`. `press` and `size` groups
carry `$type: dimension` on the group.

**Proposals.** Put `"$extensions": {"io.github.xperiaroco2.prime-game": {"proposal": true}}` and a `$description` on the
proposed state group, token or variant group.

**Completion** (done by `expand.js`, so the pack is complete):
1. Expand the authoring forms to the 19 StyleBox fields:
   - `bg-color`, `draw-center`, `border-color`;
   - `border-width-left/top/right/bottom`;
   - `corner-radius-top-left/top-right/bottom-right/bottom-left`;
   - `content-margin-left/top/right/bottom`;
   - `expand-margin-left/top/right/bottom`.
2. A missing border width, radius or expand margin is 0. A missing content margin is that side's border width (Godot's
   −1 rule, godot-facts §2), written out explicitly.
3. These states take every field they do not author from `normal`'s expanded record: `hover`, `pressed`, `disabled`,
   `read-only`, and `font-color`. A state's own value, in any authoring form, beats the inherited value per side.
4. `hover-pressed` takes missing fields from `pressed`.
5. `focus` takes **nothing** from `normal`. Missing fields are the StyleBoxFlat defaults above. Its `font-color` is the
   `normal` font colour, because Button's focus colour replaces only the normal state's (godot-facts §3.2).
6. A missing `press` group, or a missing member of it, is taken from the `parent` variation.
7. An `XSelected` toggle variation authors only `normal`, `disabled` and `focus`. `hover`, `pressed` and `hover-pressed`
   all complete from `normal`.

### 3.6 `tokens/components/button.tokens.json` (complete)

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "button": {
    "$description": "Toy buttons. One type variation per group with a godot.variation.",
    "common": {
      "$description": "The abstract parent of every Toy button: press timing and zero offsets.",
      "$extensions": { "io.github.xperiaroco2.prime-game": {
        "godot": { "variation": "ToyButton", "class": "Button", "abstract": true }, "context": "any" } },
      "motion": { "$type": "transition", "$value": "{motion.press}" },
      "press": { "$type": "dimension",
        "depth": { "$value": { "value": 0, "unit": "px" } }, "hover": { "$value": { "value": 0, "unit": "px" } },
        "held": { "$value": { "value": 0, "unit": "px" } }, "disabled": { "$value": { "value": 0, "unit": "px" } } }
    },
    "primary": {
      "$description": "The main action: yellow face, ink outline, a 6 px toy base.",
      "$extensions": { "io.github.xperiaroco2.prime-game": {
        "godot": { "variation": "ToyButtonPrimary", "class": "Button", "parent": "ToyButton",
                   "base": { "dark": "ToyBasePrimaryOnDark", "light": "ToyBasePrimaryOnLight" } }, "context": "any" } },
      "label": { "$type": "typography", "$value": "{type.body-large-bold}" },
      "normal": {
        "bg-color": { "$type": "color", "$value": "{palette.yellow}" },
        "border-color": { "$type": "color", "$value": "{color.outline}" },
        "border-width": { "$type": "dimension", "$value": "{stroke.control}" },
        "corner-radius": { "$type": "dimension", "$value": "{radius.control}" },
        "content-margin-block": { "$type": "dimension", "$value": { "value": 12, "unit": "px" } },
        "content-margin-inline": { "$type": "dimension", "$value": { "value": 22, "unit": "px" } },
        "font-color": { "$type": "color", "$value": "{color.on-accent.text}" }
      },
      "disabled": {
        "$description": "Unplugged: the base is hidden, the face rests, pale and quiet (proposal).",
        "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } },
        "bg-color": { "$type": "color", "$value": "{color.state.disabled-face}" },
        "border-color": { "$type": "color", "$value": "{color.state.disabled-ink}" },
        "font-color": { "$type": "color", "$value": "{color.state.disabled-ink}" }
      },
      "focus": {
        "$description": "The outline thickens inward by the focus width (proposal).",
        "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } },
        "bg-color": { "$type": "color", "$value": "{palette.clear}" },
        "border-color": { "$type": "color", "$value": "{color.outline}" },
        "border-width": { "$type": "dimension", "$value": "{focus.width}" },
        "corner-radius": { "$type": "dimension", "$value": { "value": 15, "unit": "px" } },
        "expand-margin": { "$type": "dimension", "$value": { "value": -3, "unit": "px" } }
      },
      "press": { "$type": "dimension",
        "depth": { "$value": { "value": 6, "unit": "px" } }, "hover": { "$value": { "value": -1, "unit": "px" } },
        "held": { "$value": { "value": 5, "unit": "px" } }, "disabled": { "$value": { "value": 0, "unit": "px" } } }
    },
    "secondary": { "…": "as primary: description, variation ToyButtonSecondary, base ToyBaseRaisedOnDark / ToyBaseRaisedOnLight, normal.bg-color {palette.white}, normal.font-color {color.on-light.text}, press depth 5 hover -1 held 4 disabled 0" },
    "danger": { "…": "as secondary with variation ToyButtonDanger, normal.bg-color {color.status.alert}, normal.font-color {color.on-accent.text}; the whole group carries proposal: true" },
    "ghost-on-dark": {
      "$description": "A quiet action on dark: no fill, cream outline, no base.",
      "$extensions": { "io.github.xperiaroco2.prime-game": {
        "godot": { "variation": "ToyButtonGhostOnDark", "class": "Button", "parent": "ToyButton" }, "context": "dark" } },
      "label": { "$type": "typography", "$value": "{type.small}" },
      "normal": {
        "bg-color": { "$type": "color", "$value": "{palette.clear}" },
        "border-color": { "$type": "color", "$value": "{color.on-dark.line}" },
        "border-width": { "$type": "dimension", "$value": "{stroke.control}" },
        "corner-radius": { "$type": "dimension", "$value": "{radius.control}" },
        "content-margin-block": { "$type": "dimension", "$value": { "value": 12, "unit": "px" } },
        "content-margin-inline": { "$type": "dimension", "$value": { "value": 22, "unit": "px" } },
        "font-color": { "$type": "color", "$value": "{color.on-dark.text}" }
      },
      "hover": { "$description": "Hover fill (proposal).", "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } },
        "bg-color": { "$type": "color", "$value": "{color.state.hover-on-dark}" } },
      "pressed": { "$description": "Held: as hover (proposal).", "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } },
        "bg-color": { "$type": "color", "$value": "{color.state.hover-on-dark}" } },
      "disabled": { "$description": "Unplugged ghost (proposal).", "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } },
        "border-color": { "$type": "color", "$value": "{color.state.disabled-ink-on-dark}" },
        "font-color": { "$type": "color", "$value": "{color.state.disabled-ink-on-dark}" } },
      "focus": { "$description": "Inner focus (proposal).", "$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } },
        "bg-color": { "$type": "color", "$value": "{palette.clear}" },
        "border-color": { "$type": "color", "$value": "{color.on-dark.line}" },
        "border-width": { "$type": "dimension", "$value": "{focus.width}" },
        "corner-radius": { "$type": "dimension", "$value": { "value": 15, "unit": "px" } },
        "expand-margin": { "$type": "dimension", "$value": { "value": -3, "unit": "px" } } }
    },
    "ghost-on-light": { "…": "as ghost-on-dark with ToyButtonGhostOnLight, context light, {color.on-light.line}, {color.on-light.text}, {color.state.hover-on-light}, {color.state.disabled-ink}" },
    "base-raised-on-dark": {
      "$description": "The 5 px toy base under secondary and danger buttons on dark.",
      "$extensions": { "io.github.xperiaroco2.prime-game": {
        "godot": { "variation": "ToyBaseRaisedOnDark", "class": "Panel" }, "context": "dark" } },
      "panel": {
        "bg-color": { "$type": "color", "$value": "{color.on-dark.base}" },
        "corner-radius": { "$type": "dimension", "$value": "{radius.control}" },
        "expand-margin-top": { "$type": "dimension", "$value": { "value": -5, "unit": "px" } },
        "expand-margin-bottom": { "$type": "dimension", "$value": { "value": 5, "unit": "px" } }
      }
    },
    "base-raised-on-light": { "…": "as base-raised-on-dark with ToyBaseRaisedOnLight, context light, {color.on-light.base}" },
    "base-primary-on-dark": { "…": "as base-raised-on-dark with ToyBasePrimaryOnDark and expand margins -6 / 6" },
    "base-primary-on-light": { "…": "as base-primary-on-dark with ToyBasePrimaryOnLight, context light, {color.on-light.base}" }
  }
}
```

The `"…"` members above are notes for the reader, not file content. In the real file, each of those groups is written out
in full in the same way as its sibling, with the values of §4.1.

### 3.7 Skeletons of the other component files

Each file is valid JSON as written below, once every `{}` state group is filled with the tokens of §4. An empty group is
valid DTCG (dtcg-facts §2), but the validator requires the states of P47. Every variant group also gets a `$description`
(P56).

Short form used below: `"X": V("ToyName", "Class", "context", {extra godot keys})` stands for:

```json
"X": { "$description": "…", "$extensions": { "io.github.xperiaroco2.prime-game": {
  "godot": { "variation": "ToyName", "class": "Class", …extra }, "context": "context" } }, …children }
```

```text
backdrop.tokens.json   backdrop: { dim: V("ToyBackdrop","Panel","dark") {panel},
                                   deep: V("ToyBackdropDeep","Panel","dark") {panel},
                                   night: V("ToyBackdropNight","Panel","dark") {panel} }
bar.tokens.json        bar: { track: V("ToyBarTrack","PanelContainer","dark") {panel, size},
                              stamina: V("ToyBarStamina","ProgressBar","dark",{on:["ToyBarTrack"]}) {fill},
                              health: V("ToyBarHealth","ProgressBar","dark",{on:["ToyBarTrack"]}) {fill, ramp},
                              progress: V("ToyBarProgress","ProgressBar","dark") {background, fill},
                              slider: V("ToyBarSlider","ProgressBar","light") {background, fill},
                              label: V("ToyBarLabel","PanelContainer","dark") {panel} }
chip.tokens.json       chip: { plate: V("ToyChipPlate","PanelContainer","dark") {panel},
                               plate-text: V("ToyChipPlateText","Label","dark",{on:["ToyChipPlate"]}) {label, normal},
                               light: V("ToyChipLight","PanelContainer","any") {panel},
                               light-text: V("ToyChipLightText","Label","any",{on:["ToyChipLight"]}) {label, normal},
                               new: V("ToyChipNew","PanelContainer","light") {panel},
                               new-text: V("ToyChipNewText","Label","light",{on:["ToyChipNew"]}) {label, normal},
                               line-on-dark: V("ToyChipLineOnDark","PanelContainer","dark") {panel},
                               line-on-dark-text: V("ToyChipLineOnDarkText","Label","dark") {label, normal},
                               line-on-light: V("ToyChipLineOnLight","PanelContainer","light") {panel},
                               line-on-light-text: V("ToyChipLineOnLightText","Label","light") {label, normal},
                               toggle-on-dark: V("ToyChipToggleOnDark","Button","dark",{parent:"ToyButton",toggle:{selected:"ToyChipToggleOnDarkSelected"}}) {label, normal, hover, pressed, disabled, focus},
                               toggle-on-dark-selected: V("ToyChipToggleOnDarkSelected","Button","dark",{parent:"ToyButton"}) {label, normal, disabled, focus},
                               toggle-on-light: V("ToyChipToggleOnLight","Button","light",{parent:"ToyButton",toggle:{selected:"ToyChipToggleOnLightSelected"}}) {label, normal, hover, pressed, disabled, focus},
                               toggle-on-light-selected: V("ToyChipToggleOnLightSelected","Button","light",{parent:"ToyButton"}) {label, normal, disabled, focus} }
field.tokens.json      field: { input: V("ToyField","LineEdit","any") {label, normal, focus, read-only, items},
                                dropdown: V("ToyDropdown","OptionButton","any") {label, normal, hover, pressed, disabled, focus} }
howto.tokens.json      howto: { frame: V("ToyHowtoFrame","PanelContainer","light") {panel},
                                frame-done: V("ToyHowtoFrameDone","PanelContainer","light") {panel},
                                caption: V("ToyHowtoCaption","Label","light",{on:["ToyHowtoFrame","ToyHowtoFrameDone"]}) {label, normal},
                                note: V("ToyHowtoNote","Label","light",{on:["ToyPanelHowto"]}) {label, normal} }
hud.tokens.json        hud: { crosshair: V("ToyCrosshair","Panel","dark") {panel, size},
                              spinner: V("ToySpinner","Panel","dark") {panel, size} }
keycap.tokens.json     keycap: { on-dark: V("ToyKeyOnDark","PanelContainer","dark") {panel, size},
                                 on-light: V("ToyKeyOnLight","PanelContainer","light") {panel, size},
                                 quiet: V("ToyKeyQuiet","PanelContainer","light") {panel, size},
                                 round: V("ToyKeyRound","PanelContainer","light") {panel, size},
                                 round-quiet: V("ToyKeyRoundQuiet","PanelContainer","light") {panel, size},
                                 text: V("ToyKeyText","Label","any",{on:["ToyKeyOnDark","ToyKeyOnLight","ToyKeyRound"]}) {label, normal},
                                 quiet-text: V("ToyKeyQuietText","Label","light",{on:["ToyKeyQuiet","ToyKeyRoundQuiet"]}) {label, normal} }
map.tokens.json        map: { board: V("ToyMapBoard","PanelContainer","light",{base:{any:"ToyBasePanel"}}) {panel},
                              room: V("ToyMapRoom","PanelContainer","light") {panel},
                              room-text: V("ToyMapRoomText","Label","light",{on:["ToyMapRoom"]}) {label, normal},
                              zone: V("ToyMapZone","Panel","light") {panel},
                              pin: V("ToyMapPin","Panel","light") {panel, size} }
mic.tokens.json        mic: { plate: V("ToyMic","PanelContainer","dark") {panel, size, items} }
name-plate.tokens.json name-plate: { plate: V("ToyNamePlate","PanelContainer","dark") {panel},
                                     text: V("ToyNamePlateText","Label","dark",{on:["ToyNamePlate"]}) {label, normal} }
panel.tokens.json      panel: { menu: V("ToyPanelMenu","PanelContainer","light",{base:{any:"ToyBasePanel"}}) {panel},
                                dialog: V("ToyPanelDialog","PanelContainer","light",{base:{any:"ToyBasePanel"}}) {panel},
                                howto: V("ToyPanelHowto","PanelContainer","light",{base:{any:"ToyBasePanel"}}) {panel},
                                base: V("ToyBasePanel","Panel","any") {panel} }
pick.tokens.json       pick: { swatch-ring: V("ToySwatchRing","Panel","light") {panel, size},
                               swatch-selected: V("ToySwatchSelected","Panel","light") {panel},
                               radio: V("ToyRadio","Button","light",{parent:"ToyButton",toggle:{selected:"ToyRadioSelected"}}) {label, normal, disabled, focus, size},
                               radio-selected: V("ToyRadioSelected","Button","light",{parent:"ToyButton"}) {label, normal, disabled, focus, size} }
plate.tokens.json      plate: { default: V("ToyPlate","PanelContainer","dark") {panel},
                                night: V("ToyPlateNight","PanelContainer","dark") {panel},
                                alert: V("ToyPlateAlert","PanelContainer","dark") {panel},
                                text: V("ToyPlateText","Label","dark",{on:["ToyPlate","ToyPlateNight","ToyPlateAlert"]}) {label, normal} }
preset-card.tokens.json preset-card: { idle: V("ToyPresetCard","Button","light",{parent:"ToyButton",base:{any:"ToyBaseCard"},toggle:{selected:"ToyPresetCardSelected"}}) {label, normal, disabled, focus, press},
                                       selected: V("ToyPresetCardSelected","Button","light",{parent:"ToyButton",base:{any:"ToyBaseCard"}}) {label, normal, disabled, focus, press},
                                       quiet: V("ToyPresetCardQuiet","Button","light",{parent:"ToyButton"}) {label, normal, disabled, focus, press},
                                       note: V("ToyPresetCardNote","Label","light",{on:["ToyPresetCard"]}) {label, normal},
                                       note-selected: V("ToyPresetCardNoteSelected","Label","light",{on:["ToyPresetCardSelected"]}) {label, normal},
                                       base: V("ToyBaseCard","Panel","light") {panel} }
setting.tokens.json    setting: { row: V("ToySettingRow","PanelContainer","light") {panel},
                                  text: V("ToySettingRowText","Label","light",{on:["ToySettingRow"]}) {label, normal},
                                  value: V("ToySettingRowValue","Label","light",{on:["ToySettingRow"]}) {label, normal},
                                  stepper: V("ToyStepper","Button","light",{parent:"ToyButton"}) {label, normal, pressed, disabled, focus} }
slot.tokens.json       slot: { idle: V("ToySlot","PanelContainer","dark") {panel, size},
                               active: V("ToySlotActive","PanelContainer","dark") {panel, size},
                               text: V("ToySlotText","Label","dark",{on:["ToySlot","ToySlotActive"]}) {label, normal},
                               text-empty: V("ToySlotTextEmpty","Label","dark",{on:["ToySlot","ToySlotActive"]}) {label, normal} }
tab.tokens.json        tab: { idle: V("ToyTab","Button","light",{parent:"ToyButton",toggle:{selected:"ToyTabSelected"}}) {label, normal, hover, pressed, disabled, focus},
                              selected: V("ToyTabSelected","Button","light",{parent:"ToyButton"}) {label, normal, disabled, focus} }
text.tokens.json       text: { on-dark: V("ToyTextOnDark","Label","dark") {label, normal},
                               muted-on-dark: V("ToyTextMutedOnDark","Label","dark") {label, normal},
                               title-on-dark: V("ToyTitleOnDark","Label","dark") {label, normal},
                               on-light: V("ToyTextOnLight","Label","light") {label, normal},
                               muted-on-light: V("ToyTextMutedOnLight","Label","light") {label, normal},
                               title-on-light: V("ToyTitleOnLight","Label","light") {label, normal},
                               timer: V("ToyTimer","Label","dark") {label, normal},
                               hud-caption: V("ToyHudCaption","Label","dark",{on:["ToyBarLabel","ToyChipPlate"]}) {label, normal} }
title.tokens.json      title: { plate: V("ToyTitlePlate","Label","dark",{base:{any:"ToyBaseTitle"}}) {label, normal},
                                base: V("ToyBaseTitle","Panel","dark") {panel},
                                logo: V("ToyLogo","Label","dark") {label, normal, items} }
```

That is 95 variations: 85 in the 19 files above, plus the 10 of `button.tokens.json`. (ToyHowtoNote was added in the
fix pass: §4.8 draws "як робити" at t.small, and no other Label variation gives t.small in c.on-light.text-muted.)

---

## 4. Components: variant × state × tokens

Every row below is one variant group. The tokens are written exactly as listed, following the notation of §2 and the
authoring convention of §3.5. A state not listed is "= normal". The Godot class and parent are in the skeletons (§3.7).

### 4.1 Buttons (`button`)

| Variant | Label | `normal` | Other states | `press` depth / hover / held / disabled |
|---|---|---|---|---|
| `button.common` (ToyButton, abstract) | – | – | `motion` = `{motion.press}` | 0 / 0 / 0 / 0 |
| `button.primary` | t.body-large-bold | bg p.yellow · bc c.outline · bw s.control · r rd.control · cm 12 22 · font c.on-accent.text | disabled (P): bg c.state.disabled-face · bc c.state.disabled-ink · font c.state.disabled-ink. focus (P): bg p.clear · bc c.outline · bw fw · r 15 · ex −3 | 6 / −1 / 5 / 0 |
| `button.secondary` | t.body-large-bold | bg p.white · bc c.outline · bw s.control · r rd.control · cm 12 22 · font c.on-light.text | disabled (P), focus (P): as primary | 5 / −1 / 4 / 0 |
| `button.danger` (P, whole variant) | t.body-large-bold | bg c.status.alert · bc c.outline · bw s.control · r rd.control · cm 12 22 · font c.on-accent.text | disabled, focus: as primary | 5 / −1 / 4 / 0 |
| `button.ghost-on-dark` | t.small | bg p.clear · bc c.on-dark.line · bw s.control · r rd.control · cm 12 22 · font c.on-dark.text | hover (P), pressed (P): bg c.state.hover-on-dark. disabled (P): bc c.state.disabled-ink-on-dark · font c.state.disabled-ink-on-dark. focus (P): bg p.clear · bc c.on-dark.line · bw fw · r 15 · ex −3 | inherited 0 |
| `button.ghost-on-light` | t.small | bg p.clear · bc c.on-light.line · bw s.control · r rd.control · cm 12 22 · font c.on-light.text | hover (P), pressed (P): bg c.state.hover-on-light. disabled (P): bc c.state.disabled-ink · font c.state.disabled-ink. focus (P): bc c.on-light.line, the rest as on dark | inherited 0 |

| Base variant (Panel, `panel` state) | Context | Values | Used by |
|---|---|---|---|
| `button.base-raised-on-dark` → ToyBaseRaisedOnDark | dark | bg c.on-dark.base · r rd.control · ex −5 0 5 0 | secondary, danger |
| `button.base-raised-on-light` → ToyBaseRaisedOnLight | light | bg c.on-light.base · r rd.control · ex −5 0 5 0 | secondary, danger |
| `button.base-primary-on-dark` → ToyBasePrimaryOnDark | dark | bg c.on-dark.base · r rd.control · ex −6 0 6 0 | primary |
| `button.base-primary-on-light` → ToyBasePrimaryOnLight | light | bg c.on-light.base · r rd.control · ex −6 0 6 0 | primary |

**Why there is a danger variant.**
- In the Esc menu's Game page, "Покинути сесію" ends the session for everyone when the host presses it (wireframes s5).
- Lens 3 asks for a danger button for Leave and Quit and for the confirm dialog.
- Coral is already toy.css's "danger edge" (L20). Ink on coral is 6.51:1.
- It appears in no frame, so the whole variant is a proposal.

### 4.2 Esc tabs (`tab`): a toggle pair

| Variant | Label | `normal` | Other states |
|---|---|---|---|
| `tab.idle` (ToyTab) | t.body-large | bg p.clear · r 14 · cm 10 16 · font c.on-light.text | hover (P), pressed (P, held): bg c.state.hover-on-light. disabled (P): font c.state.disabled-ink. focus (P): bg p.clear · bc c.outline · bw fw · r 14 · ex 0 |
| `tab.selected` (ToyTabSelected) | t.body-large-bold | bg p.yellow · bc c.outline · bw s.control s.control 7 s.control · ex 0 0 4 0 · r 14 · cm 10 16 · font c.on-accent.text (the **merge-form base**, depth 4, ink) | disabled (P): bg c.state.disabled-face · bc c.state.disabled-ink · bw s.control · ex 0 · font c.state.disabled-ink. focus (P): bg p.clear · bc c.outline · bw fw · r 11 · ex −3 |

`tab.selected.normal` writes `border-width-top`, `-right`, `-left` as `{stroke.control}` and `border-width-bottom` as 7.
It writes `expand-margin-bottom` as 4, and `content-margin-block` 10 and `content-margin-inline` 16 explicitly. The
existing game variation `EscTab` becomes a variation of ToyTab (§19).

### 4.3 Chips (`chip`)

**Static chips** (PanelContainer) with their companion Labels:

| Variant | `panel` | Companion | Its label · `normal.font-color` |
|---|---|---|---|
| `chip.plate` (ToyChipPlate), dark | bg c.surface.plate · r rd.pill · cm 4 14 | `chip.plate-text` (ToyChipPlateText) | t.small-bold · c.on-dark.text |
| `chip.light` (ToyChipLight), any | bg p.yellow · bc c.outline · bw s.control · r rd.pill · cm 4 14 | `chip.light-text` | t.small-bold · c.on-accent.text |
| `chip.new` (ToyChipNew), light | bg p.coral · bc c.outline · bw s.control · r rd.pill · cm 4 14 | `chip.new-text` | t.caption-bold · c.on-accent.text |
| `chip.line-on-dark` (ToyChipLineOnDark), dark | bg p.clear · bc c.on-dark.line · bw s.control · r rd.pill · cm 4 14 | `chip.line-on-dark-text` | t.small · c.on-dark.text |
| `chip.line-on-light` (ToyChipLineOnLight), light | bg p.clear · bc c.on-light.line · bw s.control · r rd.pill · cm 4 14 | `chip.line-on-light-text` | t.small · c.on-light.text |

**Toggle chips** (language, settings sub-tabs, guide list): toggle pairs, Button → ToyButton.

| Variant | Label | `normal` | Other states |
|---|---|---|---|
| `chip.toggle-on-dark` | t.small | bg p.clear · bc c.on-dark.line · bw s.control · r rd.pill · cm 4 14 · font c.on-dark.text | hover (P), pressed (P): bg c.state.hover-on-dark. disabled (P): bc c.state.disabled-ink-on-dark · font c.state.disabled-ink-on-dark. focus (P, outer): bg p.clear · bc c.on-dark.line · bw fw · r rd.pill · ex 5 |
| `chip.toggle-on-dark-selected` | t.small-bold | bg p.yellow · bc c.outline · bw s.control · r rd.pill · cm 4 14 · font c.on-accent.text | disabled (P): bg c.state.disabled-face · bc c.state.disabled-ink · font c.state.disabled-ink. focus (P, outer): bg p.clear · bc c.on-dark.line · bw fw · r rd.pill · ex 5 |
| `chip.toggle-on-light` | t.small | as on dark with c.on-light.line, c.on-light.text | hover (P), pressed (P): bg c.state.hover-on-light. disabled (P): bc c.state.disabled-ink · font c.state.disabled-ink. focus (P, outer): bc c.on-light.line, the rest as on dark |
| `chip.toggle-on-light-selected` | t.small-bold | as on dark selected | disabled (P) as on dark selected; focus (P, outer): bc c.on-light.line |

### 4.4 Hand and belt slots (`slot`; HUD, not focusable)

| Variant | Values |
|---|---|
| `slot.idle` (ToySlot), dark | panel: bg c.surface.plate · bc p.slotline · bw s.control · r rd.control · cm 7. size: width 84 · height 84 · wide-width 180 |
| `slot.active` (ToySlotActive), dark | panel: bg c.surface.plate · bc p.yellow · bw s.bold · r rd.control · cm 9. size: as idle |
| `slot.text` (ToySlotText), on ToySlot, ToySlotActive | label t.caption · font c.on-dark.text (filled) |
| `slot.text-empty` (ToySlotTextEmpty) | label t.caption · font c.on-dark.text-muted (empty) |

Showcase states:
- **empty** = ToySlot + ToySlotTextEmpty ("пояс").
- **filled** = an icon placeholder + ToySlotText.
- **active** = ToySlotActive.
- **two-handed** = ToySlotActive at `wide-width` × `height`, filled ("Пакунок").

### 4.5 Bars (`bar`)

| Variant | Values |
|---|---|
| `bar.track` (ToyBarTrack, PanelContainer), dark | panel: bg p.track-dark · bc c.outline · bw s.control · r 10 · cm 3. size: height 16 |
| `bar.stamina` (ToyBarStamina, ProgressBar), dark, on ToyBarTrack | background: none (StyleBoxEmpty). fill: bg c.status.stamina · r 6 · cm 5 0 |
| `bar.health` (ToyBarHealth, ProgressBar), dark, on ToyBarTrack | background: none. fill: bg p.white · r 6 · cm 5 0. ramp: full `{color.status.health-full}` · empty `{color.status.health-empty}` · steps 20 (§5) |
| `bar.progress` (ToyBarProgress), dark | background: bg p.track-dark · r rd.pill · cm 5 0. fill: bg c.status.progress · r rd.pill |
| `bar.slider` (ToyBarSlider), light | background: bg p.track-light · r rd.pill · cm 5 0. fill: bg c.outline · r rd.pill (the HSlider grabber is a texture: later) |
| `bar.label` (ToyBarLabel, PanelContainer), dark | panel: bg c.surface.plate · r rd.small · cm 0 8. Its text is ToyHudCaption (§4.16) |

**How a HUD bar is built.** It is ToyBarTrack wrapping a fill-only bar (ToyBarStamina or ToyBarHealth).
- The track's content margin of 3 insets the bar inside the outline.
- The fill's horizontal minimum size is 0, so the drawn width is `round(r · W_inner)`, exactly the CSS fraction
  (godot-facts §6).
- The fill's `cm 5 0` gives the 10 px inner height.

**Task progress** is ToyBarProgress (on dark) or ToyBarSlider (in panels).

### 4.6 Surfaces: panels, dialog, HUD plates, backdrops

| Variant | Values |
|---|---|
| `panel.menu` (ToyPanelMenu), light, base ToyBasePanel | panel: bg c.surface.panel · bc c.outline · bw s.surface · r rd.surface · cm 28 |
| `panel.dialog` (ToyPanelDialog), light, base ToyBasePanel | as menu · cm 40 |
| `panel.howto` (ToyPanelHowto), light, base ToyBasePanel | as menu · cm 26 |
| `panel.base` (ToyBasePanel, Panel), any | panel: bg c.surface.drop · r rd.surface · ex −10 0 10 0 (also under the map board) |
| `plate.default` (ToyPlate), dark | panel: bg c.surface.plate · r rd.large · cm 10 18 |
| `plate.night` (ToyPlateNight), dark | panel: bg c.surface.night-plate · r rd.large · cm 10 18 |
| `plate.alert` (ToyPlateAlert), dark | panel: bg c.surface.plate · bc c.status.alert · bw s.surface · r rd.large · cm 14 22 |
| `plate.text` (ToyPlateText, Label) | label t.body · font c.on-dark.text |
| `backdrop.dim` (ToyBackdrop, Panel) | panel: bg c.surface.backdrop |
| `backdrop.deep` (ToyBackdropDeep) | panel: bg c.surface.backdrop-deep |
| `backdrop.night` (ToyBackdropNight) | panel: bg c.surface.night |

A **dialog** is a composition, not a variation. In order:
- ToyBackdrop behind;
- the ToyRaised of ToyBasePanel and ToyPanelDialog;
- a title (ToyTitleOnLight), the body (ToyTextOnLight), and a muted note (ToyTextMutedOnLight);
- a row with ToyButtonPrimary (or ToyButtonDanger for a confirm) and ToyButtonGhostOnLight.

### 4.7 Keycaps (`keycap`)

| Variant | panel | size |
|---|---|---|
| `keycap.on-dark` (ToyKeyOnDark), dark | bg p.cream · bc p.keyshade · bw s.thin s.thin s.bold s.thin · r rd.small · cm 2 10 5 | min-width 36 · wide-min-width 96 (P) |
| `keycap.on-light` (ToyKeyOnLight), light | bg p.white · bc c.outline · the same geometry | the same |
| `keycap.quiet` (ToyKeyQuiet), light ("dim") | bg p.key-quiet · bc p.muted · the same geometry | the same |
| `keycap.round` (ToyKeyRound), light (the map's "?") | as on-light · r rd.pill | min-width 36 |
| `keycap.round-quiet` (ToyKeyRoundQuiet), light | as quiet · r rd.pill | min-width 36 |
| `keycap.text` (ToyKeyText, Label) | label t.body-bold · font c.on-light.text | |
| `keycap.quiet-text` (ToyKeyQuietText, Label) | label t.body-bold · font p.muted (5.88:1) | |

- `cm 2 10 5` and `min-width 36` are the px forms of the wireframe's `.35em` and `1.6em` at 22 px. The frames keep their
  em sizes (in `wireframes.html`, not in `toy.css`).
- The **wide** keycap is the same variation at `wide-min-width`.
- The border widths are written per side: `border-width-top`, `-right`, `-left` `{stroke.thin}`, `-bottom`
  `{stroke.bold}`.

### 4.8 How-to card (`howto` and `panel.howto`)

| Variant | Values |
|---|---|
| (the card) | the ToyRaised of ToyBasePanel and ToyPanelHowto (§4.6); title ToyTitleOnLight, "як робити" ToyHowtoNote |
| `howto.frame` (ToyHowtoFrame), light | panel: bg p.white · bc c.outline · bw s.control · r rd.large · cm 13 |
| `howto.frame-done` (ToyHowtoFrameDone), light | panel: bg p.mint-tint · the rest as frame (ink on it 13.40:1) |
| `howto.caption` (ToyHowtoCaption, Label) | label t.small-bold · font c.on-light.text |
| `howto.note` (ToyHowtoNote, Label), on ToyPanelHowto | label t.small · font c.on-light.text-muted |

Showcase states:
- **normal**: four frames, none done;
- **done**: the 4th frame is ToyHowtoFrameDone;
- a three-frame card with the 2nd frame done.

### 4.9 Field and dropdown (`field`)

**`field.input`** (ToyField, LineEdit), context any, label t.body-bold:

| State | Values |
|---|---|
| normal | bg p.white · bc c.outline · bw s.control · r rd.medium · cm 10 16 · font c.on-light.text |
| focus (P) | bg p.clear · bc c.outline · bw fw · r 9 · ex −3 (LineEdit draws it over `normal`) |
| read-only (P; also the guest's view) | bg c.state.disabled-face · bc c.state.disabled-ink · font c.on-light.text (13.60:1: still readable content) |
| items (P) | `placeholder-color` p.muted (6.77:1 on white) · `caret-color` c.outline · `selection-color` p.yellow · `selected-font-color` c.on-accent.text, all `$type: color` |

**`field.dropdown`** (ToyDropdown, OptionButton; no parent, because it does not chain to ToyButton, so OptionButton's
own items still resolve), context any, label t.body-bold:
- **normal:** bg p.white · bc c.outline · bw s.control · r rd.medium · cm 10 16 · font c.on-light.text.
- **hover (P), pressed (P):** bg c.state.hover-on-light.
- **disabled (P):** bg c.state.disabled-face · bc c.state.disabled-ink · font c.state.disabled-ink.
- **focus (P):** bg p.clear · bc c.outline · bw fw · r 9 · ex −3.
- **The arrow** is an icon texture and comes later. Its width is added to `content-margin-right` then.

### 4.10 Setting row and stepper (`setting`)

| Variant | Values |
|---|---|
| `setting.row` (ToySettingRow, PanelContainer), light | panel: bg p.white · bc p.row-line · bw 0 0 s.control 0 · r rd.medium · cm 8 14 9 |
| `setting.text` (ToySettingRowText, Label) | label t.body · font c.on-light.text |
| `setting.value` (ToySettingRowValue, Label) | label t.body-bold · font c.on-light.text |
| `setting.stepper` (ToyStepper, Button → ToyButton), light | label t.body-bold. normal: bg p.yellow · bc c.outline · bw s.thin · r rd.pill · cm 2 10 · font c.on-accent.text. pressed (P): bg c.state.held-accent (ink on honey 5.31:1). disabled (P, at min, at max, or for a guest): bg c.state.disabled-face · bc c.state.disabled-ink · font c.state.disabled-ink. focus (P, outer): bg p.clear · bc c.outline · bw fw · r rd.pill · ex 5 |

### 4.11 Preset cards (`preset-card`): a toggle pair plus a quiet card

| Variant | Label | `normal` | Other states | `press` |
|---|---|---|---|---|
| `preset-card.idle` (ToyPresetCard), base ToyBaseCard | t.small-bold | bg p.white · bc c.outline · bw s.control · r rd.large · cm 14 · font c.on-light.text | disabled (P): bg c.state.disabled-face · bc c.state.disabled-ink · font c.state.disabled-ink. focus (P): bg p.clear · bc c.outline · bw fw · r 13 · ex −3 | 5 / −1 (P) / 3 / 0 |
| `preset-card.selected` (ToyPresetCardSelected), base ToyBaseCard | t.small-bold | bg p.yellow · bc c.outline · bw s.surface · r rd.large · cm 14 · font c.on-accent.text | disabled (P): as idle's; focus (P): bg p.clear · bc c.outline · bw fw · r 12 · ex −4 | 5 / −1 (P) / 3 / 0 |
| `preset-card.quiet` (ToyPresetCardQuiet), "Save your own", no base, not a toggle | t.small-bold | bg p.lavender · bc p.muted · bw s.control · r rd.large · cm 14 · font p.muted | disabled: `{}` (= normal: it is already quiet). focus (P): r 13 · ex −3, colours as idle | 0 / 0 / 3 / 0 |
| `preset-card.note` (ToyPresetCardNote, Label), on ToyPresetCard | t.small | font c.on-light.text-muted | | |
| `preset-card.note-selected` (ToyPresetCardNoteSelected), on ToyPresetCardSelected | t.small | font c.on-accent.text-muted (6.36:1 on yellow) | | |
| `preset-card.base` (ToyBaseCard, Panel), light | | panel: bg c.on-light.base · r rd.large · ex −5 0 5 0 | | |

- The selected card keeps the idle card's outer size: content margins 14 in both, so the padding is 10 inside its 4 px
  border. This is an intended change (§15.3): a toggle cannot change size in Godot (godot-facts §3.4).
- The screen swaps the note's variation on `toggled`. A Label inside a Button does not follow the Button's state.

### 4.12 Map (`map`)

| Variant | Values |
|---|---|
| `map.board` (ToyMapBoard), light, base ToyBasePanel | panel: bg c.surface.board · bc c.outline · bw s.surface · r rd.surface · cm 4 |
| `map.room` (ToyMapRoom) | panel: bg p.cream · bc c.outline · bw s.control · r rd.medium · cm 9 |
| `map.room-text` (ToyMapRoomText, Label) | label t.caption-bold · font c.on-light.text |
| `map.zone` (ToyMapZone, Panel) | panel: bg p.zone · bc c.outline · bw s.surface · r rd.medium |
| `map.pin` (ToyMapPin, Panel), "you are here" | panel: bg p.coral-deep · bc c.outline · bw s.control · r 0 14 14 14. size: width 28 · height 28. The angle is set at runtime about the pin's centre, as the showcase draws it: with `rotation`, also set `pivot_offset_ratio = Vector2(0.5, 0.5)` (the default pivot is the top-left corner, [Control.xml L1197-L1204](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Control.xml#L1197-L1204)); inside a container, use `offset_transform_rotation` with `offset_transform_enabled`, whose `offset_transform_pivot_ratio` defaults to (0.5, 0.5) ([L1161-L1172](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Control.xml#L1161-L1172)) |
| the «ти тут» chip | ToyChipPlate + ToyHudCaption |

### 4.13 Mic and name plate

| Variant | Values |
|---|---|
| `mic.plate` (ToyMic, PanelContainer), dark | panel: bg c.surface.plate · r rd.pill · cm 0. size: width 46 · height 46. items: `icon-on` c.on-dark.text · `icon-off` c.status.alert (`$type: color`) → custom colours `icon_on`, `icon_off`, applied to the icon `TextureRect` through `self_modulate`. The crossed-mic icon tinted coral is the plan in toy.css L226. Icons are own-work SVG, later |
| `name-plate.plate` (ToyNamePlate), dark | panel: bg c.surface.plate · r rd.pill · cm 4 14 |
| `name-plate.text` (ToyNamePlateText, Label) | label t.small-bold · font c.on-dark.text. The teammate mark (#257) uses the text colour |

### 4.14 Title plate and logo (`title`)

| Variant | Values |
|---|---|
| `title.plate` (ToyTitlePlate, Label), dark, base ToyBaseTitle | label t.hero. normal: bg p.yellow · bc c.outline · bw s.surface · r 26 · cm 0 · ex 4 36 · font c.on-accent.text. The expand margins replace the CSS negative margins (godot-facts §5) |
| `title.base` (ToyBaseTitle, Panel), dark | panel: bg p.coral · r 26 · ex −6 36 14 36 (the plate's drawn rect moved down 10) |
| `title.logo` (ToyLogo, Label), dark | label t.display-large. normal: font c.on-dark.title · `font-shadow-color` p.coral. items (dimension): `shadow-offset-x` 0 · `shadow-offset-y` 6 · `shadow-outline-size` 0 (the default 1 would fatten the shadow, godot-facts §5) |

### 4.15 HUD bits and pickers

| Variant | Values |
|---|---|
| `hud.crosshair` (ToyCrosshair, Panel), dark | panel: bg p.cream · bc c.outline · bw s.thin · r rd.pill. size 8 × 8 |
| `hud.spinner` (ToySpinner, Panel), dark | panel: bg c.surface.night-plate · bc p.yellow · bw 10 10 0 0 · r rd.pill. size 90 × 90 |
| `pick.swatch-ring` (ToySwatchRing, Panel), light | panel: bg p.clear · bc c.outline · bw s.thin · r rd.pill. size 26 × 26. The fill is a white Panel tinted by `self_modulate` once body colours are decided |
| `pick.swatch-selected` (ToySwatchSelected, Panel) | panel: bg p.clear · bc c.outline · bw s.surface · r rd.pill · ex 7 (the wireframe's 4 px outline at a 3 px offset) |
| `pick.radio` (ToyRadio, toggle → ToyRadioSelected) | label t.caption-bold. normal: bg p.white · bc c.outline · bw s.thin · r rd.pill · cm 0 · font c.on-light.text. disabled (P): bg c.state.disabled-face · bc c.state.disabled-ink · font c.state.disabled-ink. focus (P, outer): bg p.clear · bc c.outline · bw fw · r rd.pill · ex 5. size 26 × 26 |
| `pick.radio-selected` (ToyRadioSelected) | as radio with normal bg p.yellow · font c.on-accent.text |

### 4.16 Text roles (`text`, Label variations)

| Variant | Label · font |
|---|---|
| `text.on-dark` (ToyTextOnDark) | t.body · c.on-dark.text |
| `text.muted-on-dark` (ToyTextMutedOnDark) | t.body · c.on-dark.text-muted |
| `text.title-on-dark` (ToyTitleOnDark) | t.title · c.on-dark.title |
| `text.on-light` (ToyTextOnLight) | t.body · c.on-light.text |
| `text.muted-on-light` (ToyTextMutedOnLight) | t.body · c.on-light.text-muted |
| `text.title-on-light` (ToyTitleOnLight) | t.title · c.on-light.title |
| `text.timer` (ToyTimer) | t.display · c.on-dark.title |
| `text.hud-caption` (ToyHudCaption), on ToyBarLabel, ToyChipPlate | t.caption · c.on-dark.text |

### 4.17 The state grammar (one place for the rules above)

| Kind | Members | hover | held | disabled (P) | focus (P) |
|---|---|---|---|---|---|
| Raised toys (with a base) | primary, secondary, danger, preset cards | the face lifts 1 px (`press.hover` −1) | the face sinks `depth − 1`, leaving 1 px of base (2 px for cards) | unplugged: base hidden, face at rest, `disabled` colours | inner ring |
| Flat controls | ghosts, idle tab, idle toggle chips, dropdown | fill `hover-on-dark` / `-light` (P) | as hover | `disabled-ink*` on clear | inner, or outer on chips |
| Flat yellow controls | stepper | none | face honey (P) | `disabled` colours | outer |
| Selected toggles | `…Selected` variations | none (`= normal`) | none | `disabled` colours | inner, or outer on chips and radio |
| Quiet card | `preset-card.quiet` | none | a 3 px nudge (today's behaviour) | = normal | inner |
| Static parts | panels, plates, chips, slots, keycaps, bars, map, mic, text | – | – | – | – |

### 4.18 Godot mapping summary (for the generator issue)

| Variation | Class → parent | StyleBox items | Colours | Constants and font |
|---|---|---|---|---|
| ToyButton | Button (abstract) | – | – | `press_depth/hover/held/disabled` 0, `press_duration_ms`, `press_duration_reduced_ms`, `press_trans`, `press_ease` |
| ToyButtonPrimary, Secondary, Danger, GhostOnDark, GhostOnLight, ToyTab(Selected), ToyChipToggleOnDark(Selected), ToyChipToggleOnLight(Selected), ToyPresetCard(Selected), ToyPresetCardQuiet, ToyStepper, ToyRadio(Selected) | Button → ToyButton | normal, hover, pressed, hover_pressed, disabled, focus | font_color, font_hover_color, font_pressed_color, font_hover_pressed_color, font_disabled_color, font_focus_color | own `press_*` when authored; `font` + `font_size` from `label`; `width`, `height` (radio) |
| ToyDropdown | OptionButton | as Button | as Button | `font` + `font_size` |
| ToyField | LineEdit | normal, focus, read_only | font_color, font_uneditable_color, font_placeholder_color, caret_color, selection_color, font_selected_color | `font` + `font_size` |
| ToyBase* (7), ToyBackdrop*, ToyMapZone, ToyMapPin, ToyCrosshair, ToySpinner, ToySwatch* | Panel | panel | – | size constants |
| ToyChip* (static), ToySlot*, ToyBarTrack, ToyBarLabel, ToyPanel*, ToyPlate*, ToyKey* (box), ToyHowtoFrame*, ToySettingRow, ToyMapBoard, ToyMapRoom, ToyMic, ToyNamePlate | PanelContainer | panel | ToyMic: icon_on, icon_off | size constants |
| ToyBarStamina, ToyBarHealth, ToyBarProgress, ToyBarSlider | ProgressBar | fill; background (StyleBoxEmpty when absent) | ToyBarHealth: ramp_stop_00 … ramp_stop_20 | – |
| …Text companions, text roles, ToyHowtoCaption, ToyHowtoNote, ToyPresetCardNote(Selected), ToySettingRowText/Value, ToyMapRoomText | Label | normal = StyleBoxEmpty | font_color | `font` + `font_size` |
| ToyTitlePlate, ToyLogo | Label | normal (title plate) | font_color, font_shadow_color (logo) | `shadow_offset_x/y`, `shadow_outline_size` (logo) |

All 95 names are letters only. No Godot 4.7.2 class starts with "Toy" (dump queried), and the game's theme test only
sees `&"[A-Za-z]+"` (godot-facts §0).

---

## 5. The health ramp (stamina is the toy yellow)

- **Stamina** = `color.status.stamina` = `#ffc23a`: 6.23:1 on the dark track (inventory n6).
- **Health:**
  - **The end colours** are the engineer's: `color.status.health-full` `#5bcb4e` and `color.status.health-empty`
    `#ff5a44`.
  - **Stops.** The build samples them in **OKLab** at `k / steps`, k = 0 … 20. It uses Ottosson's linear-sRGB ↔ OKLab
    matrices (the ones in [`tools/a11y/cvd.js`](../../../tools/a11y/cvd.js)). Stop k is `color-mix(in oklab, full
    k×5 %, empty)` as the mock-up drew it, rounded to 8 bits. The CSS Color 4 XYZ path gives the same 21 hex (checked).
  - **One colour space, mixed once:** the mixing happens in the build. CSS and Godot then draw the same stored hex.
  - **Which stop** to draw: `step = floor(hp × 20 + 0.5)`, clamped to 0..20, the same expression in JS and GDScript.
    `Color.lerp` and `Gradient` are not used.
- **Names.** The stops are `bar.health.ramp.stop-00` … `stop-20`, derived by the build. They are in the pack and the CSS
  (`--toy-bar-health-ramp-stop-NN`), never in `tokens/`. In Godot they are the colours `ramp_stop_00` … `ramp_stop_20`
  on ToyBarHealth.

| Step | hp | Hex | On track | Step | hp | Hex | On track | Step | hp | Hex | On track |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 00 | 0.00 | #ff5a44 | 3.25 | 07 | 0.35 | #d98d48 | 3.75 | 14 | 0.70 | #a6b14b | 4.31 |
| 01 | 0.05 | #fa6345 | 3.32 | 08 | 0.40 | #d39348 | 3.84 | 15 | 0.75 | #9cb64c | 4.40 |
| 02 | 0.10 | #f56b45 | 3.38 | 09 | 0.45 | #cc9849 | 3.90 | 16 | 0.80 | #92ba4c | 4.47 |
| 03 | 0.15 | #f07346 | 3.46 | 10 | 0.50 | #c59e49 | 4.00 | 17 | 0.85 | #87be4d | 4.54 |
| 04 | 0.20 | #ea7a46 | 3.52 | 11 | 0.55 | #bea34a | 4.08 | 18 | 0.90 | #7bc34d | 4.66 |
| 05 | 0.25 | #e58147 | 3.61 | 12 | 0.60 | #b6a84a | 4.15 | 19 | 0.95 | #6cc74e | 4.74 |
| 06 | 0.30 | #df8747 | 3.68 | 13 | 0.65 | #aeac4b | 4.21 | 20 | 1.00 | #5bcb4e | 4.83 |

"On track" is the contrast against `#4a3c5c`.

**Checks (computed):**
- Every stop is ≥ 3:1 on the dark track; the lowest is stop 00 at 3.25.
- Adjacent stops differ by at most ΔE_ok 0.0185.
- The nearest-stop colour is at most ΔE_ok 0.0096 from the continuous mix (at hp 0.575).
- The bar's length stays the real cue for colour-blind players ([ui-decisions](../../ui-decisions.md), Round HUD).

---

## 6. Bases, press, disabled, focus and toggles in both engines

**The toy base.**
- **Layer** (every pressable with a base, panels, the map board, the title plate). A `MarginContainer` (`ToyRaised`, its
  margins 0 by the default theme) holds two children:
  - first, the base `Panel`, with the base variation from the face's `base` hint for the screen's context, and
    `mouse_filter = IGNORE`;
  - then the face.

  A MarginContainer fits every child to its own rect
  ([margin_container.cpp L122-L130](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/margin_container.cpp#L122-L130)).
  The base StyleBox draws the face's shape moved down by the depth (expand top −d, bottom +d). Expand margins never touch
  layout or the hit area (godot-facts §2).
- **Merge** (ToyTabSelected only): bottom border = side + 4, `expand_margin_bottom` 4, explicit content margins. It is
  exact because the base colour (ink) equals the outline colour (godot-facts §1.3).
- **CSS** draws both forms as `box-shadow: 0 Npx 0 <base colour>` on an opaque face (lint L08–L13).

**Press.**
- ToyPress (prime-game component, §19) re-evaluates on the face's `draw`, `button_down`, `button_up`, `mouse_entered`
  and `mouse_exited`. The target offset is:
  - `press_disabled` if disabled;
  - else `press_held` while held (between `button_down` and `button_up`);
  - else `press_hover` if `is_hovered()`;
  - else 0.
- `button_down` fires for mouse, touch and `ui_accept`, so for keyboard and gamepad too
  ([base_button.cpp L96-L101, L236-L249](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/base_button.cpp#L96-L101)).
- It sets `offset_transform_enabled = true` once. When the target changes, it tweens `offset_transform_position:y` over
  `press_duration_ms`, or `press_duration_reduced_ms` when the game's reduced-motion setting is on (that setting can
  default from `DisplayServer.accessibility_should_reduce_animation()`). The tween uses
  `set_trans(TRANS_SINE).set_ease(EASE_OUT)`.
- The face's StyleBoxes do not change between normal, hover and pressed for raised toys. So the content-margin sums never
  change and no neighbour moves (godot-facts §3.4).
- **CSS:** `transform: translateY(offset)` plus `box-shadow: 0 (depth − offset) 0 base`, both transitioned with
  `motion.press`. The base's bottom edge stays at `depth` throughout, as in Godot.

**Disabled (P), unplugged.**
- ToyPress hides the base Panel (`visible = not disabled`), and `press_disabled` is 0.
- CSS writes `box-shadow: none` for the disabled state.

**Focus (P).**
- Godot draws `focus` over the state StyleBox, for keyboard or gamepad focus only (godot-facts §3.2). The face draws it,
  so it moves with the face.
- **Inner** (buttons, tabs, preset cards, field, dropdown): `expand-margin` = −(the largest effective border width of
  `normal`, where effective = border − max(expand, 0)); radius = `normal` radius + expand.
- **Outer** (chips, stepper, radio): `expand-margin` = `focus.gap + focus.width` = 5, radius 999.

**Toggles.**
- ToyToggle (prime-game, §19) sets `theme_type_variation` to `XSelected` when toggled on and back to `X` when toggled off.
  The pair comes from the pack's `toggle` hint.
- In `XSelected` every interactive state shows the selected face. In `X`, `pressed` is the held look.
- Both variations have equal content-margin sums (P46), so only the font weight can change the size, as in the frames.

---

## 7. The token build: `node tools/tokens/build.js [--check]` (builder 1)

### 7.1 Steps

1. **Parse** every file reachable from the resolver with `tools/lib/json-strict.js`: RFC 8259, duplicate keys rejected,
   JSON Pointers in errors.
2. **Validate:** dtcg-facts §9 items 1–39 as rules **D01–D39**, with the changes below, plus the profile rules
   **P40–P60** (§7.2).
3. **Resolve** the 4 permutations (textSize × motion), defaults first, aliases only after the merge
   ([R §6](https://www.designtokens.org/tr/2025.10/resolver/#resolution-logic)). Check orthogonality (D37).
4. **Expand** the components (§3.5 completion) and **derive** the 21 ramp stops (§5).
5. **Emit** `dist/css/toy-tokens.css` (§8) and `dist/pack/toy.pack.json` (§9).

**Changes to the dtcg-facts checklist:**
- **D15** allowed types: color, dimension, duration, cubicBezier, number, fontFamily, fontWeight, transition,
  typography. No border, shadow, strokeStyle or gradient composites: StyleBox fields are separate tokens.
- **D17:** component tokens carry their own `$type`, except members of `press` and `size` groups, which take the
  group's `$type: dimension`.
- **D19:** px only, ints. Negatives are allowed: expand margins, `press.hover`, letter spacing.
- **D25 and D26** (border and shadow composites) cannot be reached once D15 forbids those types. They need no fixture.
- **D31** (tiers) becomes:
  - primitives and modifier files hold literals only;
  - semantic tokens alias primitives only, composite sub-values included;
  - component tokens follow P52 and P53.

**Output and determinism:**
- Errors print the file, the JSON Pointer, the token path, the rule id and a message. Warnings are separate. Exit 1 on
  any error.
- Deterministic: LF, a trailing newline, keys in source order for the CSS and sorted for the pack, colour floats to 4
  decimals, no timestamps. Two runs give the same bytes.
- **`--check`** runs steps 1–4, renders both outputs in memory and compares bytes with `dist/`. It names each stale or
  missing file and exits 1.
- **Without `--check`** it writes both files and prints counts: tokens per tier, variations, proposals, permutations.

### 7.2 Profile rules

| Id | Rule |
|---|---|
| P40 | A variant group has `godot.variation` matching `^Toy[A-Za-z]+$`, unique |
| P41 | `godot.class` ∈ {Button, OptionButton, LineEdit, PanelContainer, Panel, Label, ProgressBar}; `parent` names a variant of the same class; `abstract: true` only on `button.common` |
| P42 | A variant's children are only its class's state groups (§3.5) and `label` (Button, OptionButton, LineEdit, Label), `press` (Button), `motion` (abstract ToyButton), `items`, `size`, `ramp` (ProgressBar). No nested variants; plain groups contain only groups |
| P43 | State-group members are only the authoring field names of §3.5, `font-color` (Button, OptionButton, LineEdit, Label states) and `font-shadow-color` (Label `normal`). `draw-center` and `shadow-*` are forbidden |
| P44 | All dimensions are ints; border widths, radii and content margins ≥ 0; a radius is 999 or ≤ half the smaller `size` side when `size` exists |
| P45 | Every state except `focus`, per side: content margin + expand margin − border width ≥ 0 (CSS padding is never negative) |
| P46 | Button and OptionButton: top + bottom and left + right content-margin sums are equal across normal, hover, pressed, hover-pressed and disabled, and between the two variations of a toggle pair |
| P47 | Required states. Non-abstract Button and OptionButton: `normal`, `disabled`, `focus`. LineEdit: `normal`, `focus`, `read-only`. PanelContainer and Panel: `panel`. ProgressBar: `fill`. Label: `normal` |
| P48 | `focus`: `bg-color` alpha 0; `border-width` aliases `{focus.width}`; `expand-margin` as a shorthand only. Either **inner**: expand = −(largest effective border of `normal`), radius = `normal` radius + expand, and smallest `normal` content margin + expand − focus width ≥ 4. Or **outer**: expand = `focus.gap + focus.width`, radius 999 |
| P49 | `press` (own or inherited): `hover ≤ 0`. If `depth > 0`: `0 ≤ held ≤ depth − 1`, `disabled ∈ {0, depth}`, and the variant has a `base` hint. If `depth = 0`: `held ≥ 0`, `disabled = 0` |
| P50 | `base` is `{dark, light}` or `{any}` naming Panel variants. Each base `panel`: no border; radii equal the owner's `normal` (or `panel`) radii; inline expand equals the owner's; top = owner top − d and bottom = owner bottom + d with one d > 0 for all of the owner's bases; for a Button, d = `press.depth` |
| P51 | Merge form: a state with bottom expand > 0 and the other sides 0 has `border-width-bottom − expand-margin-bottom` = the other sides' border width |
| P52 | Component colour tokens (`bg-color`, `border-color`, `font-color`, `font-shadow-color`, colour `items`, `ramp.full/empty`) are aliases whose chains end in `palette.*` |
| P53 | Component dimension tokens are int literals or aliases to `stroke.*`, `radius.*` or `focus.*`; `label` aliases `type.*`; `motion` aliases `motion.*` |
| P54 | `ramp` has `full`, `empty` (colour) and `steps` (number, int ≥ 1); the names `stop-*` are reserved for the build |
| P55 | `size.*` are ints > 0, names ∈ {width, height, wide-width, min-width, wide-min-width} |
| P56 | Every variant group and every proposal has a `$description`; `proposal` is the boolean `true` |
| P57 | `toggle.selected` names a variant of the same class and parent that has no `toggle` and authors only `normal`, `disabled`, `focus` (plus `label`, `press`, `size`) |
| P58 | `on` (Label and ProgressBar only) is an array of PanelContainer or Panel variation names |
| P59 | Namespace members are only `godot`, `context`, `proposal`; `context` is required on every variant; `godot.trans`/`godot.ease` only on `ease.press`, as `TRANS_*`/`EASE_*` names from godot-facts §4 |
| P60 | The CSS name of every path, sub-value suffixes included, is unique |

### 7.3 The pack value objects (also what `api.js` returns)

| type | Shape |
|---|---|
| color | `{ "type": "color", "hex": "#rrggbb", "rgba": [r, g, b, a] }`: hex lowercase without alpha, floats 0..1 to 4 decimals |
| dimension | `{ "type": "dimension", "px": int }` |
| duration | `{ "type": "duration", "ms": int }` |
| cubicBezier | `{ "type": "cubicBezier", "points": [x1, y1, x2, y2], "godot": { "trans": "TRANS_SINE", "transValue": 1, "ease": "EASE_OUT", "easeValue": 1 } }` |
| number | `{ "type": "number", "value": n }` |
| fontFamily, fontWeight | `{ "type": "fontFamily", "value": "Comfortaa" }`, `{ "type": "fontWeight", "value": 700 }` |
| typography | `{ "type": "typography", "fontFamily", "fontSizePx", "fontWeight", "letterSpacingPx", "lineHeight" }` |
| transition | `{ "type": "transition", "durationMs", "delayMs", "points", "godot" }` |
| boolean (derived only) | `{ "type": "boolean", "value": bool }` (only `draw-center`) |

Optional on any entry:
- `"from"`: for an authored alias, its immediate target path; for an expanded StyleBox field, the authored token it came
  from. Omitted for completion defaults.
- `"proposal": true`.

### 7.4 `tools/tokens/api.js` (the contract builders 2 and 3 code against)

```js
const api = require('./tools/tokens/api.js');
const sys = api.load({ root: '<repo root>' });
// throws an Error with .problems = [{ file, pointer, path, rule, severity: 'error'|'warning', message }]

sys.version;          // "0.1.0" from tokens/release.json
sys.permutations;     // [{ inputs: { textSize, motion }, tokens: Map<path, PackValue> }], defaults first, then
                      // {large,default}, {default,reduced}, {large,reduced}
sys.tokens;           // = sys.permutations[0].tokens
sys.sources;          // Map<path, { file, pointer, type, alias: string|null, proposal: bool, description: string|null }>
                      // authored tokens only (what toy-tokens.css declares)
sys.variants;         // Array<Variant> in source order
sys.healthStops;      // [{ step: 0..20, fraction, hex, rgba }]
sys.cssVar(path);     // '--toy-' + path.split('.').join('-')
sys.pack;             // the object written to dist/pack/toy.pack.json
```

```js
// Variant
{ variation: 'ToyButtonPrimary', class: 'Button', parent: 'ToyButton' | null, prefix: 'button.primary',
  context: 'dark' | 'light' | 'any', abstract: false,
  states: { normal: Record, hover: Record, … },   // every state the class has that is authored or completed
  label: Field | null,                            // typography
  press: { depth: Field, hover: Field, held: Field, disabled: Field } | null,   // own or inherited from parent
  base: { dark: 'ToyBasePrimaryOnDark', light: 'ToyBasePrimaryOnLight' } | { any: '…' } | null,
  toggle: { selected: 'ToyTabSelected' } | null, selectedOf: 'ToyTab' | null,
  on: ['ToyChipPlate'] | null, items: { [name]: Field }, size: { [name]: Field }, ramp: { full, empty, steps } | null,
  proposal: ['disabled', 'focus'] | ['*'] | [] }
// Record = { 'bg-color': Field, 'draw-center': Field, 'border-color': Field, 'border-width-top': Field, …19 fields,
//            'font-color'?: Field, 'font-shadow-color'?: Field }
// Field  = { value: PackValue, source: '<authored token path>' | null }   // source null = completion default
```

`source` is what the CSS emitters write: `var(--toy-<source>)`. A `null` source is written as the literal `0`, or as
`var(--toy-palette-clear)` for a colour.

### 7.5 `tools/lib/color.js` (builder 1)

```js
parseHex('#rrggbb') -> [r, g, b]          // 0..1
toHex([r, g, b]) -> '#rrggbb'             // lowercase, round(x * 255), clamped
srgbToOklab([r, g, b]) -> [L, a, b]       // Ottosson matrices on linear sRGB
oklabToSrgb([L, a, b]) -> [r, g, b]
mixOklab(full, empty, t) -> [r, g, b]     // = color-mix(in oklab, full t*100%, empty)
```

### 7.6 Self-tests: `node tools/tokens/test/run.js`

- **`fixtures/good/minimal/`:** one palette colour, one semantic alias, one Button variant with every required state,
  one Panel base. It must validate with 0 errors and 0 warnings.
- **`fixtures/good/modes/`:** two modifiers. All four permutations must resolve.
- **`fixtures/bad/<rule>-<slug>/`:** a resolver plus token files and `expect.json` `{ "errors": ["P46"] }`. The validator
  must report exactly those rule ids. There is at least one folder per error rule, D01–D39 (the error ones) and P40–P60.
- **`fixtures/warn/<rule>-<slug>/`:** the same for warnings (D11, D12).
- **`expect-values.json`:** spot values checked against the real built pack. The test fails on any mismatch.

| Path | Expected |
|---|---|
| `palette.plate` | rgba [0.1647, 0.1216, 0.2, 0.86] |
| `button.primary.normal.bg-color` | #ffc23a |
| `button.primary.normal.content-margin-top` / `-left` | 12 / 22 |
| `button.primary.normal.corner-radius-top-left` | 18 |
| `button.primary.press.depth` / `.held` / `.hover` | 6 / 5 / −1 |
| `button.secondary.press.depth` | 5 |
| `button.primary.focus.expand-margin-top` / `.corner-radius-top-left` | −3 / 15 |
| `button.primary.disabled.bg-color` | #f3edf6 |
| `button.ghost-on-dark.hover.bg-color` | #352a41 |
| `tab.selected.normal.border-width-bottom` / `.expand-margin-bottom` / `.content-margin-bottom` | 7 / 4 / 10 |
| `chip.plate.panel.border-width-top` / `.content-margin-left` | 0 / 14 |
| `preset-card.selected.normal.content-margin-top` / `.border-width-top` | 14 / 4 |
| `title.plate.normal.expand-margin-left` · `title.base.panel.expand-margin-top` / `-bottom` | 36 · −6 / 14 |
| `keycap.on-dark.panel.border-width-bottom` / `.content-margin-left` | 5 / 10 |
| `setting.row.panel.border-width-bottom` / `.content-margin-bottom` | 3 / 9 |
| `map.pin.panel.corner-radius-top-left` / `-top-right` | 0 / 14 |
| `hud.spinner.panel.border-width-top` / `-bottom` | 10 / 0 |
| `field.input.read-only.font-color` | #2a1f33 |
| `bar.health.ramp.stop-00` / `-04` / `-10` / `-16` / `-20` | #ff5a44 / #ea7a46 / #c59e49 / #92ba4c / #5bcb4e |
| `type.hero` | fontSizePx 96, letterSpacingPx −1 |
| `font.size.body` in modes.textSize.large | 28; `font.size.hero` absent from that mode |
| `duration.press` default / reduced | 70 / 0 |
| `ease.press` | points [0.33, 0.52, 0.64, 1], godot.trans TRANS_SINE |

---

## 8. CSS output: `dist/css/toy-tokens.css`

Every **authored** token (`sys.sources`) plus the derived ramp stops becomes one custom property on `:root`, in source
order. Aliases stay `var()` chains. Every declaration sits on `:root`, so a mode block overriding a primitive reaches
every alias.

| Type | Value form | Example |
|---|---|---|
| color | `#rrggbb`, or `rgba(r, g, b, a)` when alpha < 1 | `--toy-palette-plate: rgba(42, 31, 51, 0.86);` |
| alias | `var(--toy-<target>)` | `--toy-color-on-dark-text: var(--toy-palette-cream);` |
| dimension | **unitless int** | `--toy-stroke-control: 3;` `--toy-button-primary-normal-content-margin-block: 12;` |
| duration | `70ms` | `--toy-duration-press: 70ms;` |
| cubicBezier | `cubic-bezier(…)` | `--toy-ease-press: cubic-bezier(0.33, 0.52, 0.64, 1);` |
| number, fontWeight | number | `--toy-font-line-height-base: 1.25;` |
| fontFamily | quoted | `--toy-font-family-base: "Comfortaa";` |
| typography | five variables (`-font-size` and `-letter-spacing` unitless) | `--toy-type-body-font-size: var(--toy-font-size-body);` |
| transition | three variables | `--toy-motion-press-duration: var(--toy-duration-press);` |
| derived ramp | `#rrggbb` | `--toy-bar-health-ramp-stop-04: #ea7a46;` |

```css
/* Generated by tools/tokens/build.js from tokens/prime.resolver.json. Do not edit. */
:root {
  --toy-palette-ink: #2a1f33;
  /* … every authored token, then the 21 ramp stops after bar.health.ramp.steps … */
}
:root[data-text-size="large"] {
  --toy-font-size-caption: 23; --toy-font-size-small: 25; --toy-font-size-body: 28;
  --toy-font-size-body-large: 30; --toy-font-size-heading: 35; --toy-font-size-title: 45;
}
:root[data-motion="reduced"] { --toy-duration-press: 0ms; }
@media (prefers-reduced-motion: reduce) {
  :root:not([data-motion="default"]) { --toy-duration-press: 0ms; }
}
```

- Mode blocks hold only the modifier-owned primitives whose value differs from the default.
- The file defines no `--px`. Each page sets it:
  - **Frame pages:** `body[data-style="toy"] .frame { --px: calc(1cqw / 19.2); }`. Every length is
    `calc(var(--toy-…) * var(--px))`. The `cqw` resolves at the using element against the frame, which is
    `container-type: inline-size` ([wireframes.html L56-L57](../../../pages/wireframes/wireframes.html#L56-L57)). This
    was checked in headless Edge 154: `--px` declared on a 960 px frame and `calc(18 * var(--px))` on a child computed
    9px.
  - **No length on `.frame` itself:** cq units skip the element's own container
    ([css-contain-3](https://www.w3.org/TR/css-contain-3/#container-lengths)); lint L23 enforces this.
  - **The showcase:** `:root { --zoom: 1; --px: calc(var(--zoom) * 1px); }`, with the zoom control setting `--zoom`.

**Page plumbing variables** are not tokens:
- `--px`, `--zoom`;
- `--ctx-text`, `--ctx-text-muted`, `--ctx-title`, `--ctx-line`, `--ctx-base` (toy.css only);
- `--tv-offset`, `--tv-depth`, `--tv-base` (generated components CSS);
- `--value` (bar fraction, inline in the showcase).

---

## 9. The pack and the sync contract

### 9.1 `dist/pack/toy.pack.json` (schema 1)

```json
{
  "format": "prime-game-ui/pack",
  "schema": 1,
  "version": "0.1.0",
  "style": "toy",
  "dtcg": "2025.10",
  "reference": { "width": 1920, "height": 1080 },
  "source": { "repo": "xperiaroco2/prime-game-ui", "resolver": "tokens/prime.resolver.json", "tokens_sha256": "<64 hex>" },
  "modifiers": {
    "textSize": { "contexts": ["default", "large"], "default": "default" },
    "motion": { "contexts": ["default", "reduced"], "default": "default" }
  },
  "tokens": {
    "bar.health.ramp.stop-04": { "type": "color", "hex": "#ea7a46", "rgba": [0.9176, 0.4784, 0.2745, 1] },
    "button.common.motion": { "type": "transition", "durationMs": 70, "delayMs": 0, "points": [0.33, 0.52, 0.64, 1],
                              "godot": { "trans": "TRANS_SINE", "transValue": 1, "ease": "EASE_OUT", "easeValue": 1 }, "from": "motion.press" },
    "button.primary.focus.expand-margin-top": { "type": "dimension", "px": -3, "from": "button.primary.focus.expand-margin", "proposal": true },
    "button.primary.label": { "type": "typography", "fontFamily": "Comfortaa", "fontSizePx": 24, "fontWeight": 700,
                              "letterSpacingPx": 0, "lineHeight": 1.25, "from": "type.body-large-bold" },
    "button.primary.normal.bg-color": { "type": "color", "hex": "#ffc23a", "rgba": [1, 0.7608, 0.2275, 1], "from": "button.primary.normal.bg-color" },
    "button.primary.normal.draw-center": { "type": "boolean", "value": true },
    "button.primary.press.held": { "type": "dimension", "px": 5 },
    "palette.plate": { "type": "color", "hex": "#2a1f33", "rgba": [0.1647, 0.1216, 0.2, 0.86] }
  },
  "modes": {
    "textSize": { "large": { "font.size.body": { "type": "dimension", "px": 28 } } },
    "motion": { "reduced": { "duration.press": { "type": "duration", "ms": 0 } } }
  },
  "variations": {
    "ToyButton": { "class": "Button", "parent": null, "prefix": "button.common", "context": "any", "abstract": true,
                   "styleboxes": [], "empty": [], "base": null, "toggle": null, "on": null, "proposal": [] },
    "ToyButtonPrimary": { "class": "Button", "parent": "ToyButton", "prefix": "button.primary", "context": "any", "abstract": false,
                          "styleboxes": ["normal", "hover", "pressed", "hover-pressed", "disabled", "focus"], "empty": [],
                          "base": { "dark": "ToyBasePrimaryOnDark", "light": "ToyBasePrimaryOnLight" }, "toggle": null, "on": null,
                          "proposal": ["disabled", "focus"] },
    "ToyBarHealth": { "class": "ProgressBar", "parent": null, "prefix": "bar.health", "context": "dark", "abstract": false,
                      "styleboxes": ["fill"], "empty": ["background"], "base": null, "toggle": null, "on": ["ToyBarTrack"], "proposal": [] }
  },
  "derived": ["bar.health.ramp.stop-00", "…", "bar.health.ramp.stop-20"],
  "proposals": ["button.danger", "button.primary.disabled", "…"],
  "assets": []
}
```

**What `tokens` holds** (keys sorted, flat):
1. Every primitive, modifier-owned (default context) and semantic token.
2. Every component token that is not a StyleBox field: `label`, `press.*`, `motion`, `items.*`, `size.*`, `ramp.*`.
3. Every StyleBox state of every variant, **complete**: 19 fields `<prefix>.<state>.<field>`, plus `font-color` and
   `font-shadow-color` where the class has them.
4. The 21 derived ramp stops.

**Other members:**
- **`modes`** holds, per non-default context, exactly the keys whose resolved value differs from the default: font sizes,
  every typography token and label, durations, transitions, and (since ui-0.3.0) `size.keycap` with the keycap
  variations' `size.min-width` that reference it (textSize `large`: 42). Any permutation is the defaults plus each chosen context's
  overrides; the build verifies this for all four before writing.
- **`proposals`** lists every path or group path marked proposal.
- **`assets`** lists files shipped beside the JSON, as `{ "path", "sha256", "licence", "licence_file", "source" }`. Since
  ui-0.3.0 it lists every own-work SVG icon of `icons/` and `icons/room/` (licence "own work"), each with
  `"kind": "icon"` and its import: `size` (the SVG's own), `drawn_px` (the largest size a screen draws it at),
  `svg_scale` (`drawn_px` ÷ the larger side, rounded up to 0.01), `tint` (`"multiply"` for a white copy, `"none"` for an
  icon in its own colours) and, for an icon the pages always draw in one colour, `tint_color` (the room pictograms'
  `#2a1f33`); `tokens/README.md` ("The pack's members since ui-0.3.0") has the details. Fonts follow once the engineer
  approves the Comfortaa download batch (CLAUDE.md, Downloads).
- **`variations`** may carry two optional members (since ui-0.3.0, schema 1): `textures`
  `{ "<theme icon, kebab-case>": "<assets path>" }` (ToySlider's knobs, ToyDropdown's `arrow`, ToyDropdownList's radio
  icons) and `deprecated`
  `{ "replacement": "<variation>" | null, "note": "<the $deprecated text>" | null }` (ToyChipNew, ToyChipNewText).
  Both are absent where they do not apply.
- **A PopupMenu variation** (since ui-0.3.0: `ToyDropdownList`, set on every OptionButton's `get_popup()`) has the
  StyleBoxes `panel`, `hover` and `separator`; its font colours and layout constants are `items` (`font_color`,
  `font_hover_color`, `font_disabled_color`, `v_separation`, `h_separation`, `item_start_padding`,
  `item_end_padding`), its `font` and `font_size` its `label` (`tokens/README.md`, Classes).
- **`schema`** bumps only when this shape changes; the generator refuses a schema it does not know. **`version`** is
  `tokens/release.json`.
- There is no commit field: the lock file records the commit.

### 9.2 Release and semver

- **Major** when a token path or variation is removed, renamed or retyped, or when `schema` bumps.
- **Minor** when one is added.
- **Patch** when only values change.
- `node tools/check.js --release ui-X.Y.Z` checks:
  - the tag equals `ui-` + `tokens/release.json` version;
  - `pack.version` equals that version;
  - the bump is at least what the diff against the previous `ui-*` tag's pack requires (read with
    `git show <tag>:dist/pack/toy.pack.json`; with no previous tag, any version).

### 9.3 Sync into prime-game (contract; the code is a prime-game issue, §19)

1. A human merges the PR and tags the merge commit `ui-<version>`. CI runs the release check.
2. In prime-game, `tools\run.cmd ui-sync ui-<version>` copies `dist/pack/**` at that tag byte for byte into
   **`client/ui/theme/pack/`** and writes **`client/ui/theme/pack.lock.json`**:

   ```json
   { "repo": "xperiaroco2/prime-game-ui", "tag": "ui-0.1.0", "commit": "<40 hex>",
     "files": { "toy.pack.json": "sha256:<64 hex>" } }
   ```

   It also puts a `.gdignore` in `client/ui/theme/pack/`. Whether Godot would otherwise import the JSON is
   (unconfirmed); the generator reads it with `FileAccess`. The `.gdignore` also stops Godot importing the icons under
   `icons/`, so the game copies the `assets` into a folder it imports, under the same sha256 lock, and imports each SVG
   at its `svg_scale`.
3. **The mapping table lives in prime-game next to the generator** (`tools/theme/mapping.json` beside
   `tools/theme/build_theme.gd`). It maps the pack's state and field names to theme items per class (§4.18), and the old
   variation names to Toy ones (§19).

---

## 10. The Godot-safe lint: `node tools/lint/godot-css.js [--self-test]` (builder 2)

It generalises `pages/styles/check_styles.js`. That script stays frozen and keeps checking `retro.css` and `card.css`.

### 10.1 Targets and profiles

`tools/lint/targets.json`:

```json
{
  "tokens": "dist/css/toy-tokens.css",
  "targets": [
    { "file": "dist/css/toy-tokens.css", "profile": "tokens" },
    { "file": "pages/styles/toy.css", "profile": "skin" },
    { "file": "pages/styles/motion-preview.css", "profile": "motion" },
    { "file": "pages/components/toy-components.css", "profile": "generated" }
  ],
  "textShadowSelectors": ["\\.t(28|36|48|64|96)(?![\\w-])", "\\.tv-ToyLogo(?![\\w-])"]
}
```

(Fix pass: the patterns end in `(?![\w-])`, not `\b`, because `\b` also matches before a `-` and let `.t28-foo` through.
The motion target also names its `companion`, `pages/styles/toy.css`.)

| Profile | Scope (L24) | Extra allowed |
|---|---|---|
| `tokens` | selectors `:root`, `:root[data-text-size="large"]`, `:root[data-motion="reduced"]`, and `:root:not([data-motion="default"])` inside `@media (prefers-reduced-motion: reduce)` | only custom-property declarations |
| `skin` | every selector starts with `body[data-style="toy"]` | `!important`; `--px`, `--ctx-*` declarations; `transform: rotate(<deg>)` |
| `motion` | as skin | `transition`, `transform: translateY(…)`, `cursor` |
| `generated` | the last compound of every selector starts with `.tv-` | `transition`, `transform: translateY(…)`; layout: `position`, `inset`, `top/right/bottom/left`, `display`, `pointer-events`, `box-sizing`, `min-width`, `min-height`; `--tv-*` declarations; `width: 100%` and `height: 100%` anywhere; `width: calc(var(--value) * 100%)` on selectors ending in `.tv-fill` |

Layout properties allowed in every profile except `tokens`: `padding*`, `margin*`, `width`, `height`, `align-self`.

### 10.2 Rules

| Id | Rule (all profiles unless noted) |
|---|---|
| L01 | Forbidden properties: `filter`, `backdrop-filter`, `clip-path`, `mix-blend-mode`, `background-blend-mode`, `background-image`, `mask*`, `animation*`; `transition*` outside `motion` and `generated` |
| L02 | No `*-gradient(` |
| L03 | No `url(` |
| L04 | Border and outline styles `solid` or `none` only; `outline` other than `none` |
| L05 | One border colour per element: no `border-*-color` per side, no several colours in `border-color`, no different colours across side shorthands. Colours are compared after resolving through the tokens file; a side with a style but no colour counts as `currentcolor` (resolved through `color`); logical sides (`border-block-start`, …) are one side each. Checked on the cascade: a rule over its base-selector rules and the earlier rules with the same selector |
| L06 | No pseudo-elements |
| L07 | No at-rules, except `@media (prefers-reduced-motion: reduce)` in `tokens` |
| L08 | `box-shadow`: one layer |
| L09 | `box-shadow`: no `inset` |
| L10 | `box-shadow`: no spread (at most three lengths) |
| L11 | `box-shadow`: blur 0 |
| L12 | `box-shadow`: x offset 0 |
| L13 | `box-shadow` (other than `none`) only on a rule whose base selector declares an opaque background. The base selector strips `:hover`, `:active`, `:focus-visible`, `:not(…)` and `.is-*`. It is looked up in the same file, or `toy.css` for `motion-preview.css`. Backgrounds are resolved through the tokens file; alpha must be 1. Also: a rule whose background is not opaque may not sit under a box-shadow that a rule with a covering selector (same ancestors, a subset of its last compound) gives the same elements, unless a rule in between sets `box-shadow: none` |
| L14 | No `transparent` and no colour with alpha 0 on a border, including a `currentcolor` border whose `color` is transparent |
| L15 | No `%` radius |
| L16 | No `em`, `rem`, `%`, `vw`, `vh`, `cq*` units in border, radius, padding, margin, font-size, letter-spacing, box-shadow, text-shadow, width, height, min-*, inset and translate values (the exemptions of §10.1 apply) |
| L17 | Ints only: every numeric literal in a length `calc()` is an integer, and the only literal multiplier is `-1`; in `tokens`, every dimension variable is an int or a `var()` |
| L18 | `skin`, `motion`, `generated`: no literal colour (`#…`, `rgb()`, `rgba()`, `hsl()`, named colours, `transparent`, `currentColor`). Only `var(--toy-*)`, `var(--ctx-*)` (skin, motion) or `var(--tv-*)` (generated) |
| L19 | `skin`, `motion`, `generated`: every length is `0`, `none`, or `calc(S * var(--px))` / `calc(S * -1 * var(--px))`, where S is `var(--toy-…)`, `var(--tv-…)`, or a parenthesised sum or difference of those and ints. Font weights are `var(--toy-…)` |
| L20 | Every `var(--toy-…)` exists in the tokens file; every `var(--ctx-…)` and `var(--tv-…)` is declared in the same file; `--px`, `--zoom`, `--value` are the only other variables |
| L21 | `transform`: `rotate(<n>deg)` only in `skin`; `translateY(calc(… * var(--px)))` only in `motion` and `generated`. `transition`: only `transform` and `box-shadow`, with durations and timing functions written as `var(--toy-…)` |
| L22 | No CSS colour functions: `color-mix`, `oklab()`, `oklch()`, `lab()`, `lch()`, `hsl()`, `hwb()` |
| L23 | No `var(--px)` length on a selector whose last compound contains `.frame` |
| L24 | Every selector is inside the profile's scope (§10.1) |
| L25 | `text-shadow`: one layer, blur 0, only on selectors matching `textShadowSelectors` |
| L26 | `letter-spacing` is `calc(var(--toy-…-letter-spacing) * var(--px))` |
| L27 | `!important` only in `skin` |
| L28 | Property allowlist. Drawing: `background`, `background-color`, `color`, `border*`, `box-shadow`, `text-shadow`, `font-size`, `font-weight`, `font-family`, `letter-spacing`, `line-height`, `stroke`, `fill`, `outline-color`, `transform`, `opacity`, `cursor` (motion and generated). Layout per §10.1. Anything else is a violation |

**Info lines** (as check_styles.js prints today): rule count, box-shadow count, `!important` count, and preview-only
selectors (`[style*=]`, `:nth-child`, `[data-in]`, `:first-child`).

### 10.3 Fixtures and the self-test

- Every fixture starts with a header comment: `/* profile: skin */`, or `/* profile: skin; expect: L13 */` for a bad one.
- L20 resolves against `tools/lint/fixtures/fixture-tokens.css`, a small hand-written tokens file in the `tokens`
  format. So the self-test never needs builder 1's output.
- **Good:** `good/tokens.css`, `good/skin.css`, `good/motion.css`, `good/generated.css`. Each must give 0 violations.
  - `good/tokens.css` uses all three mode blocks.
  - `good/skin.css` has a `.frame` context block, a button with a base, a merge-form tab, a negative-margin title
    plate, `!important` and `rotate(80deg)`.
- **Bad**, one file each, exactly the named rule must fire:

| File | File | File | File |
|---|---|---|---|
| `L01-forbidden-property.css` | `L08-two-shadows.css` | `L15-percent-radius.css` | `L22-color-mix.css` |
| `L02-gradient.css` | `L09-inset-shadow.css` | `L16-em-padding.css` | `L23-px-on-frame.css` |
| `L03-url.css` | `L10-shadow-spread.css` | `L17-fractional-multiplier.css` | `L24-out-of-scope.css` |
| `L04-dashed-border.css` | `L11-shadow-blur.css` | `L18-literal-colour.css` | `L25-text-shadow-on-body.css` |
| `L05-side-colours.css` | `L12-shadow-x-offset.css` | `L19-raw-length.css` | `L26-em-letter-spacing.css` |
| `L06-pseudo-element.css` | `L13-shadow-on-clear.css` | `L20-unknown-token.css` | `L27-important-in-generated.css` |
| `L07-at-rule.css` | `L14-transparent-border.css` | `L21-translate-in-skin.css` | `L28-unknown-property.css` |

`--self-test` prints one line per fixture and exits 1 on any mismatch.

---

## 11. Contrast gates: `node tools/contrast/gates.js [--check | --self-test]` (builder 2)

### 11.1 Inputs and method

- It reads **only** `dist/pack/toy.pack.json` and `tokens/gates.json`, so it does not depend on the build's code.
- It runs on all 4 permutations, because the large-text threshold depends on the font size.
- **Ratios:** WCAG 2.x relative luminance and ratio ([WCAG 2.2](https://www.w3.org/TR/WCAG22/#dfn-relative-luminance);
  §1.4.3, §1.4.11).
- **Compositing:** translucent colours are composited in sRGB over what is under them, as check_styles.js does and as
  Godot does with `hdr_2d` off (godot-facts §8). `bg` is composited over `over`, then `fg` over the result.

### 11.2 `tokens/gates.json`

```json
{
  "schema": 1,
  "world": { "white": "#ffffff", "light": "#c9c9c9", "mid": "#979797" },
  "min": { "text": 4.5, "large-text": 3, "inactive-text": 3, "ui": 3 },
  "large-text-px": 36,
  "surfaces": {
    "dark": [ { "bg": "color.surface.night" }, { "bg": "color.surface.night-plate" },
              { "bg": "color.surface.plate", "over": ["white", "light", "mid"] },
              { "bg": "color.surface.backdrop", "over": ["white", "light", "mid"] },
              { "bg": "color.surface.backdrop-deep", "over": ["white", "light", "mid"] } ],
    "light": [ { "bg": "color.surface.panel" }, { "bg": "color.surface.board" }, { "bg": "color.surface.tile" } ]
  },
  "auto": { "component-text": true, "label-text": true, "focus": true, "fills": true,
            "ramp": { "variation": "ToyBarHealth", "track": "bar.track.panel.bg-color", "min": "ui" } },
  "pairs": [
    { "id": "c1", "fg": "color.on-dark.text", "bg": "color.surface.plate", "over": ["mid"], "min": "text",
      "what": "text (cream) on HUD plate, world 97" },
    { "id": "n17", "fg": "palette.yellow", "bg": "color.surface.panel", "min": null,
      "what": "selected tab vs cream panel: carried by the 3 px ink outline" }
  ],
  "waivers": [
    { "fg": "color.on-dark.text-muted", "bg": "color.surface.backdrop", "over": "white",
      "reason": "lilac on the 70 % menu backdrop over a white wall is 3.93:1",
      "decision": "the engineer: .dim at 74 % (4.50:1), a lighter lilac, or cream for that text",
      "issue": "https://github.com/xperiaroco2/prime-game-ui/issues/5" }
  ]
}
```

- `bg` is a token path or `world:<name>`. `over` lists world names or token paths.
- `min` is a key of `min`, or `null` for an info pair: printed, never failing.
- A **waiver** matches by its resolved token triple, in declared and auto pairs alike. A waived failing pair prints
  `WAIVED`. A waiver that matches no failing pair is an **error**, so stale waivers get removed.

### 11.3 Auto pairs (derived from the pack's variations)

| Kind | Pairs | Minimum |
|---|---|---|
| component text | Every non-abstract Button and OptionButton state (normal, hover, pressed, disabled): `font-color` on `bg-color`. A translucent or clear face is composited over every surface of the variant's context (`any` = dark and light). LineEdit: normal and read-only `font-color` on their `bg-color`; `placeholder-color` on the normal face; `selected-font-color` on `selection-color` | 4.5, or 3 when the label's `fontSizePx` ≥ 36 in that permutation; disabled states use `inactive-text` (3) |
| label text | Every Label variation: `normal.font-color` on each `on` variation's `panel` bg (composited over the context surfaces when translucent), or on the context surfaces when `on` is absent; ToyTitlePlate on its own bg | as above |
| focus | Inner: the ring colour against every state face of the variant. Outer: against every context surface | ui (3) |
| fills | ToyBarStamina fill on ToyBarTrack's bg; ToyBarProgress and ToyBarSlider fill on their own background | ui |
| ramp | each of the 21 stops on `bar.track.panel.bg-color` | ui |

### 11.4 Declared pairs: the inventory's 72, minus x3

x3 is dropped: muted plum on yellow is not a used pair, since `#4a3b55` replaced it. `T` = text (4.5), `L` = large text
(3), `U` = ui (3), `I` = info (`null`).

| Id | fg | bg | over | min |
|---|---|---|---|---|
| c1, c2 | color.on-dark.text | color.surface.plate | mid; light | T |
| c3 | color.on-dark.text-muted | color.surface.plate | light | T |
| c4 | color.on-light.text | color.surface.panel | | T |
| c5 | color.on-light.text-muted | color.surface.panel | | T |
| c6 | color.on-accent.text | palette.yellow | | T |
| c7 | color.on-light.text | color.surface.tile | | T |
| c8, c9 | color.surface.plate | world:mid; world:light | | U |
| c10 | color.on-dark.title | color.surface.plate | light | T |
| c11 | color.on-dark.text | color.surface.backdrop | light | T |
| c12 | color.on-dark.title | color.surface.backdrop | light | L |
| c13 | color.on-dark.text-muted | color.surface.backdrop | light | T |
| c14 | color.on-accent.text | palette.coral | | T |
| c15 | palette.slotline | color.surface.plate | light | U |
| c16 | color.on-light.text-muted | color.surface.board | | T |
| c17 | color.outline | color.surface.board | | U |
| c18 | color.on-dark.text | color.surface.night | | T |
| x1 | color.on-light.text-muted | color.surface.tile | | T |
| x2 | color.on-accent.text-muted | palette.yellow | | T |
| x4 | color.on-light.text | palette.mint-tint | | T |
| x5 | palette.muted | palette.key-quiet | | T |
| x6 | color.on-dark.text | color.surface.night-plate | | T |
| x7 | color.on-dark.title | color.surface.night | | T |
| x8 | color.on-dark.text-muted | color.surface.night | | T |
| x9, x10, x11 | color.on-dark.text; .text-muted; .title | color.surface.plate | white | T |
| x12 | color.on-dark.text-muted | color.surface.plate | mid | T |
| x13 | color.on-dark.text | color.surface.plate | color.surface.board | T |
| x14 | color.on-dark.text | color.surface.backdrop | white | T |
| x15 | color.on-dark.text-muted | color.surface.backdrop | white | T (**waived**) |
| x16 | color.on-dark.title | color.surface.backdrop | white | L |
| x17 | color.on-light.text | color.surface.board | | T |
| x18, x19 | color.on-dark.text-muted; color.on-dark.text | color.surface.backdrop-deep | white | T |
| n1 | palette.yellow | color.surface.plate | light | U |
| n2 | color.status.alert | color.surface.plate | light | U |
| n3 | color.status.alert | world:light | | I |
| n4 | palette.cream | color.surface.plate | light | U |
| n5 | palette.keyshade | color.surface.plate | light | U |
| n6 | color.status.stamina | palette.track-dark | | U |
| n7, n8 | color.status.health-full; .health-empty | palette.track-dark | | U |
| n9 | color.status.progress | palette.track-dark | | U |
| n10 | color.outline | palette.track-light | | U |
| n11, n12 | color.outline | world:light; world:mid | | U |
| n13 | palette.track-dark | world:light | | U |
| n14 | color.on-dark.line | color.surface.night | | U |
| n15 | color.on-dark.line | color.surface.backdrop | light | U |
| n16 | color.on-light.line | color.surface.panel | | U |
| n17 | palette.yellow | color.surface.panel | | I |
| n18 | palette.white | color.surface.panel | | I |
| n19, n20 | palette.row-line | color.surface.panel; palette.white | | I |
| n21 | palette.coral-deep | color.surface.board | | U |
| n22 | palette.coral-deep | palette.cream | | U |
| n23, n24 | palette.zone over palette.cream; over palette.lavender | palette.cream; palette.lavender | | I |
| n25 | palette.cream | world:light | | I |
| n26 | color.outline | world:light | | U |
| n27 | palette.yellow | color.surface.night-plate | | U |
| n28 | color.on-dark.base | color.surface.night | | U |
| n29 | palette.coral | color.surface.night | | U |
| n30 | palette.white | color.surface.backdrop | light | U |
| n31, n32 | palette.muted | color.surface.panel | | U |
| n33, n34 | palette.slotline | color.surface.plate | mid; white | U |
| n35 | color.surface.plate | world:white | | U |
| m1, m2 | mic.plate.items.icon-on; mic.plate.items.icon-off | color.surface.plate | white, light, mid | U |

For n23 and n24, `fg` is the translucent zone composited over the room or board colour, written as
`"fg": "palette.zone", "fgOver": "palette.cream"`. That is the one use of `fgOver`.

Expected today: everything passes except x15 and its auto twin (ToyTextMutedOnDark on the backdrop over white), and
both are waived. High contrast (7:1) is reported only; no such mode exists yet.

### 11.5 `tools/lib/wcag.js` (builder 2)

```js
luminance([r, g, b]) -> number
ratio(a, b) -> number                       // (L1 + 0.05) / (L2 + 0.05)
composite(fg: [r,g,b,a], under: [r,g,b,a]) -> [r,g,b,1]
```

### 11.6 Output: `dist/gates.json`

```json
{ "schema": 1,
  "results": [ { "id": "c1", "kind": "declared", "permutation": "textSize=default,motion=default",
                 "fg": "#fff4e2", "bg": "#393041", "fgPath": "color.on-dark.text", "bgPath": "color.surface.plate",
                 "over": "mid", "ratio": 11.54, "min": 4.5, "verdict": "ok" } ],
  "ramp": [ { "step": 0, "hp": 0, "hex": "#ff5a44", "ratio": 3.25 } ] }
```

- Verdicts are `ok`, `FAIL`, `WAIVED` or `info`. Ratios are rounded to 2 decimals. The order is deterministic: declared
  pairs in file order, then auto pairs sorted by id.
- Auto ids are `auto:<Variation>:<state>:<surface>[/<over>]`.
- `--check` compares with the file. `--self-test` runs `tools/contrast/fixtures/{pass,fail,stale-waiver}/`, each with
  `pack.json`, `gates.json` and `expect.json` `{ "exit": 0 | 1 }`.

---

## 12. One entry point and CI (builder 2)

### 12.1 `node tools/check.js [--only <step>] [--release ui-X.Y.Z]`

It runs every step as a child process (`spawnSync(process.execPath, …)`), even after a failure. It prints one line per
step (name, OK or FAIL, seconds) plus each failing step's output, then `ALL CLEAN` or `FAILED: n`, and exits 1 if
anything failed.

| Step | Command |
|---|---|
| `tokens:selftest` | `node tools/tokens/test/run.js` |
| `tokens` | `node tools/tokens/build.js --check` |
| `lint:selftest` | `node tools/lint/godot-css.js --self-test` |
| `lint` | `node tools/lint/godot-css.js` |
| `gates:selftest` | `node tools/contrast/gates.js --self-test` |
| `gates` | `node tools/contrast/gates.js --check` |
| `legacy-skins` | `node pages/styles/check_styles.js retro card` |
| `page:styles` | `node pages/styles/build-styles-page.js --check` |
| `page:components` | `node pages/components/build.js --check` |
| `release` (only with `--release`) | the checks of §9.2 |

The local Edge proof (§15.5) is not a step: it needs Windows and Edge.

### 12.2 `.github/workflows/check.yml`

```yaml
name: check
on:
  pull_request:
  push:
    branches: [main]
    tags: ['ui-*']
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v7
        with:
          node-version: '20'
      - run: node tools/check.js
      - if: startsWith(github.ref, 'refs/tags/ui-')
        run: node tools/check.js --only release --release "$GITHUB_REF_NAME"
```

- No `npm install` and no cache.
- `checkout@v7` matches the game's CI
  ([ci.yml](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/.github/workflows/ci.yml)).
- `setup-node` v7.0.0 is the latest release ([release page](https://github.com/actions/setup-node/releases/tag/v7.0.0),
  as read by both architects through the GitHub API).
- Node 20 reached its end of life on 2026-04-30
  ([nodejs/Release schedule.json](https://github.com/nodejs/Release/blob/main/schedule.json)). The scripts use only APIs
  present in node 20, 22 and 24, so moving CI is one line. Whether setup-node still installs 20 is (unconfirmed); local
  runs use node 20.19.5.

---

## 13. The components CSS: `pages/components/toy-components.css` (builder 3)

`pages/components/emit-css.js` exports `emitComponentsCss(sys) -> string`. `build.js` writes its result to
`toy-components.css`. It is generated from `api.load()`, never hand-written, and linted with the `generated` profile.

### 13.1 Classes and states

- **Classes:** one class per non-abstract variation, `.tv-<Variation>`.
- **State classes:**

| Godot | CSS |
|---|---|
| `normal` (or `panel`, or Label `normal`) | the base rule |
| `hover` | `.is-hover` |
| `pressed` (a held action, or a held idle toggle) | `.is-held` |
| `disabled` | `.is-disabled` |
| `read-only` | `.is-readonly` |
| `focus` | `.is-focus`, or `:focus-visible`, showing the child `<span class="tv-focus">` |
| toggled on | the `.tv-<X>Selected` class itself (the page swaps classes, as Godot swaps variations) |

- **Context:** `[data-context="dark"]` and `[data-context="light"]` on a stage ancestor choose the base variation.

### 13.2 StyleBox record → CSS

For a record R, per side s and corner c, with every value written as `var(--toy-<source>)`:

```css
box-sizing: border-box; position: relative;
background: var(bg-color);  border-style: solid;  border-color: var(border-color);
border-s-width: calc(var(bw_s) * var(--px));
padding-s:      calc((var(cm_s) + var(ex_s) - var(bw_s)) * var(--px));   /* drop the ex term when ex_s is 0 */
margin-s:       calc(var(ex_s) * -1 * var(--px));                         /* only when ex_s ≠ 0 */
border-c-radius: calc(var(r_c) * var(--px));
```

The element then draws the StyleBox's drawn rect: the control rect grown by the expand margins. Its layout box stays the
control rect, because the negative margins cancel the growth (title plate, merge-form tab). This is exact for any expand
margin.

**Text:**
- `font-family: var(<label>-font-family), system-ui, sans-serif`;
- `font-size` and `letter-spacing` as `calc(var(…) * var(--px))`;
- `font-weight` and `line-height` as `var(…)`;
- `color: var(font-color)`.

**State rules** write only the fields whose source differs from the base rule's.

**Press** (Buttons whose `press` has any non-zero member or that have a `base`):

```css
.tv-V { --tv-offset: 0; --tv-depth: var(press.depth); --tv-base: var(<base dark>.panel.bg-color);
  transform: translateY(calc(var(--tv-offset) * var(--px)));
  box-shadow: 0 calc((var(--tv-depth) - var(--tv-offset)) * var(--px)) 0 var(--tv-base);
  transition: transform var(--toy-button-common-motion-duration) var(--toy-button-common-motion-timing-function),
              box-shadow var(--toy-button-common-motion-duration) var(--toy-button-common-motion-timing-function); }
[data-context="light"] .tv-V { --tv-base: var(<base light>.panel.bg-color); }
.tv-V.is-hover { --tv-offset: var(press.hover); }
.tv-V.is-held { --tv-offset: var(press.held); }
.tv-V.is-disabled { --tv-offset: var(press.disabled); box-shadow: none; }
```

- Without a base, `box-shadow` is omitted.
- Static surfaces with a base (panels, map board, title plate) get
  `box-shadow: 0 calc((var(<base>.expand-margin-bottom) - var(<face>.expand-margin-bottom)) * var(--px)) 0 var(<base>.bg-color)`.
  A `null` face expand is written `0`.
- `.is-held` on a Button without press offsets only changes the fields of its `pressed` record.

**Focus:**

```css
.tv-V > .tv-focus { display: none; position: absolute; pointer-events: none; box-sizing: border-box;
  border-style: solid; border-color: var(focus.border-color); border-width: calc(var(focus.border-width) * var(--px));
  border-radius: calc(var(focus.corner-radius) * var(--px));
  top: calc((var(ex_state_top) - var(bw_state_top) - var(focus.expand-margin)) * var(--px)); /* …right, bottom, left */ }
.tv-V.is-focus > .tv-focus, .tv-V:focus-visible > .tv-focus { display: block; }
```

Absolute insets count from the padding box. That box sits `ex_state − bw_state` outside the control rect, so the inset
is `ex_state − bw_state − ex_focus`, re-emitted for every state class whose border or expand differs.

**ProgressBar.**
- The bar is `.tv-V`, from its `background` record, or nothing when `empty`. The fill is `.tv-V > .tv-fill`, from the
  `fill` record, with `height: 100%` and `width: calc(var(--value) * 100%)`.
- HUD bars: `<div class="tv-ToyBarTrack" style="height:…"><div class="tv-ToyBarHealth" data-step="16"><i class="tv-fill"></i></div></div>`.
  ToyBarTrack takes `height: calc(var(--toy-bar-track-size-height) * var(--px))`, and the fill-only bar takes
  `height: 100%`.
- 21 rules: `.tv-ToyBarHealth[data-step="NN"] > .tv-fill { background: var(--toy-bar-health-ramp-stop-NN); }`. The page
  sets `data-step = floor(hp × 20 + 0.5)`.

**Sizes:**
- `size.width` / `height` → `width` / `height`.
- `min-width` → `min-width`.
- `wide-width` and `wide-min-width` → the modifier class `.tv-wide`, which uses them instead.

**Labels with a font shadow** (ToyLogo):
`text-shadow: calc(var(items.shadow-offset-x) * var(--px)) calc(var(items.shadow-offset-y) * var(--px)) 0 var(normal.font-shadow-color)`.

---

## 14. The showcase page: `pages/components/` (builder 3)

### 14.1 Build

`node pages/components/build.js [--check]`:
1. Loads `tools/tokens/api.js`.
2. Writes `toy-components.css` (§13).
3. Renders `components.html` from `showcase.json` and `strings.json`.
4. Inlines `dist/css/toy-tokens.css`, `toy-components.css`, `page.css`, `page.js`, the icons and `dist/gates.json`.

`--check` compares both generated files with the disk.

**The page contract** (an HTML page the engineer reviews on a phone as a private claude.ai artifact):
- `<title>Компоненти Toy</title>`.
- Chrome colours as tokens on `:root`, redefined for dark mode under `@media (prefers-color-scheme: dark)` guarded by
  `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`. An explicit `body` background.
- A 16 px side gutter and no horizontal page scroll: wide state rows scroll inside `.sc-scroll`.
- External: only the Google Fonts stylesheet for Comfortaa, as the wireframes page does. Everything else is inline.

### 14.2 Sources

| File | Content |
|---|---|
| `showcase.json` | `{ "sections": [{ "id", "title_key", "rows": [Row] }] }` |
| `strings.json` | `{ "chrome": { key: "uk text" }, "samples": { key: { "uk": …, "en": … } } }`. Sample wording reuses `pages/wireframes/en.json` where the string exists (for example «Почати навчання» / "Start the tutorial", «Покинути сесію» / "Leave the session", «НОВЕ» / "NEW", «ти тут» / "you are here"). New sample words are marked `"new": true` and listed in the PR |
| `page.css` | chrome only (not linted): layout, the sticky bar, stages, badges, the `--zoom`/`--px` declaration |
| `page.js` | controls, live states, health steps |
| `icons/*.svg` | own-work placeholders (mic, crossed mic, item, check). Each starts with `<!-- own work, prime-game-ui, licence: own work -->`; `icons/LICENCES.json` lists them |

**Row shape:**

```json
{ "id": "button-primary", "kind": "button", "variations": ["ToyButtonPrimary"], "contexts": ["dark", "light"],
  "states": ["normal", "hover", "held", "disabled", "focus"], "label": "start", "live": true }
```

- Toggles list both variations and add the states `selected` and `selected-hover`.
- Bars add `"values": [1, 0.8, 0.5, 0.22, 0.05, 0]`.
- Composites (`dialog`, `howto`, `slot-set`, `map`, `hud-bar`) are fixed templates in `build.js`.

### 14.3 Controls (a sticky bar, Ukrainian)

- **«Мова зразків»** UA | EN: swaps sample labels only.
- **«Розмір тексту»** звичайний | великий: `data-text-size` on `<html>`.
- **«Рух»** звичайний | менше: `data-motion` on `<html>`. The default follows `prefers-reduced-motion`.
- **«Масштаб»** 50 | 75 | 100 | 150 | 200 %: `--zoom` on `<html>`. Below 100 % a note says borders may draw thinner;
  architect B observed Chromium rounding 1.5 px borders down.
- **A section menu.**
- Every choice is kept in `localStorage` inside try/catch, and the page renders without it.

### 14.4 Every row

- **The name and its Godot hint** in monospace, for example
  `ToyButtonPrimary · Button → ToyButton · normal hover pressed disabled focus · база ToyBasePrimaryOnDark / OnLight`.
- **One static cell per state, side by side**, columns labelled звичайна, наведення, натиснута, вимкнена, фокус,
  вибрана, вибрана + наведення. Each sits on its context stage:
  - **dark:** `color.surface.night`, plus, for HUD rows, three flat world tiles `#ffffff`, `#c9c9c9`, `#979797` (the
    world is not UI, so no gradient);
  - **light:** `color.surface.panel`.
- **One live sample.**
- **A «пропозиція» badge** on every cell whose variation, state or token is in `pack.proposals`.

### 14.5 Live states (mouse and touch behave like ToyPress)

- `pointerenter` → `.is-hover`, for mouse and pen only.
- `pointerdown` → `.is-held`, with `setPointerCapture`; `pointerup` and `pointercancel` → off.
- Space and Enter: keydown → `.is-held`, keyup → off.
- Click on a toggle swaps `.tv-X` ↔ `.tv-XSelected` and sets `aria-pressed`.
- Keyboard focus uses real `<button>` elements and `:focus-visible`.

### 14.6 Sections, in order

1. **Токени:**
   - the palette as swatches with name and hex;
   - the 14 `type.*` at both text sizes;
   - the 21-stop health strip with hp, hex and ratio;
   - the contrast table from `dist/gates.json`.
2. **Кнопки:** primary, secondary, danger (P), ghost on dark and on light; every state; on dark and on light.
3. **Чипи:** the five static chips; both toggle pairs in every state.
4. **Слоти:** belt empty idle, hand empty active, hand filled active, belt filled idle, hand two-handed wide filled.
5. **Смуги:**
   - stamina at 1, 0.9, 0.5, 0.18, 0.03;
   - health at 1, 0.8, 0.5, 0.22, 0.05, 0;
   - progress at 0.62, 0.7, 0.6 (loading, downed, raising);
   - slider and task progress at 0.7, 0.55, 0.4;
   - a bar label plate.
6. **Поверхні:** the menu panel, a dialog (with the danger confirm (P)), HUD plates (default, night, alert), backdrops
   over a white and a grey world tile.
7. **Клавіші:** on dark, on light, quiet, wide «Пробіл / Space» (P), round «?» normal and quiet.
8. **Картка «як робити»:** 4 frames without and with the done frame; a 3-frame card with the 2nd done.
9. **Поле:** the field normal, with a placeholder, with a selection, focus, read-only; the dropdown in every state.
10. **Вкладки:** idle, hover, held, selected, selected + hover, disabled, focus.
11. **Рядок налаштувань і степер:** a row with a value, with a stepper, a guest's read-only row; the stepper in every
    state.
12. **Картки пресетів:** idle, selected, quiet; every state.
13. **Карта:** board, rooms with a pictogram, a lit zone, the pin at 0° and 80°, the «ти тут» chip.
14. **Мікрофон:** on, off.
15. **Табличка з іменем:** plain, with the teammate mark, a long Ukrainian name.
16. **Заголовок і логотип:** the title plate, the logo.
17. **Текст:** the 8 text roles.

---

## 15. Migrating `toy.css` (builder 4)

### 15.1 Rules

- **Selectors stay, hacks included.** `toy.css` and `motion-preview.css` keep their selectors and their
  `body[data-style="toy"]` scope. The wireframe markup does not change.
- **Values become tokens.** Every colour, length and weight becomes `var(--toy-…)`, `var(--ctx-…)`, or
  `calc(<token sum> * var(--px))` (lint L18–L20).
- **The old variables go.** The palette and context variables (toy.css L11–L41) are deleted. The palette comes from
  `dist/css/toy-tokens.css`, which `build-styles-page.js` injects before the three skins. The context variables are
  renamed `--ctx-*`, so they can never collide with a token.
- **Dead rules go:** `.marker` and `.circ` (no frame uses them, inventory §4).
- **Frozen:** `retro.css`, `card.css`, `meta.json` and `check_styles.js` are not edited. They stay in `styles.html` as
  the record of the choice, and `check_styles.js retro card` stays clean.
- **`build-styles-page.js` changes:**
  - it resolves every path from `__dirname`, so it runs from any directory;
  - it inlines `dist/css/toy-tokens.css` at the start of the skins `<style>`;
  - it gains `--check`, which compares the rendered `styles.html` with the file.

### 15.2 The target `toy.css`

Builder 4 writes this. Every name is `--toy-` + a path of §3–§4, and lint L20 proves each one exists.

```css
/* prime-game UI style "Toy" (Іграшка), the chosen style (prime-game-ui#2), on the design tokens of prime-game-ui#5.
   Values come only from dist/css/toy-tokens.css (generated from tokens/); this file maps the wireframe classes onto
   them. Godot-safe (tools/lint, profile "skin"). !important appears only where the wireframe HTML uses inline styles. */

/* ---------- unit and text contexts ---------- */
body[data-style="toy"] .frame {
  --px: calc(1cqw / 19.2);
  --ctx-text: var(--toy-color-on-dark-text);
  --ctx-text-muted: var(--toy-color-on-dark-text-muted);
  --ctx-title: var(--toy-color-on-dark-title);
  --ctx-line: var(--toy-color-on-dark-line);
  --ctx-base: var(--toy-color-on-dark-base);
  color: var(--ctx-text);
  font-weight: var(--toy-font-weight-semibold);
}
body[data-style="toy"] .frame .panel,
body[data-style="toy"] .frame .map {
  --ctx-text: var(--toy-color-on-light-text);
  --ctx-text-muted: var(--toy-color-on-light-text-muted);
  --ctx-title: var(--toy-color-on-light-title);
  --ctx-line: var(--toy-color-on-light-line);
  --ctx-base: var(--toy-color-on-light-base);
  color: var(--ctx-text);
}

/* ---------- type ---------- */
body[data-style="toy"] .frame .b { font-weight: var(--toy-font-weight-bold); }
body[data-style="toy"] .frame .dimtext { color: var(--ctx-text-muted); }
body[data-style="toy"] .frame .t16 { font-size: calc(var(--toy-type-caption-font-size) * var(--px)); letter-spacing: calc(var(--toy-type-caption-letter-spacing) * var(--px)); }
body[data-style="toy"] .frame .t18 { font-size: calc(var(--toy-type-small-font-size) * var(--px)); letter-spacing: calc(var(--toy-type-small-letter-spacing) * var(--px)); }
body[data-style="toy"] .frame .t36 { font-weight: var(--toy-type-title-font-weight); letter-spacing: calc(var(--toy-type-title-letter-spacing) * var(--px)); }
body[data-style="toy"] .frame .t48 { font-weight: var(--toy-type-display-font-weight); letter-spacing: calc(var(--toy-type-display-letter-spacing) * var(--px)); }
body[data-style="toy"] .frame .t64 { font-weight: var(--toy-type-display-large-font-weight); letter-spacing: calc(var(--toy-type-display-large-letter-spacing) * var(--px)); }
body[data-style="toy"] .frame .t28.b,
body[data-style="toy"] .frame .t36.b,
body[data-style="toy"] .frame .t48.b,
body[data-style="toy"] .frame .t64.b { color: var(--ctx-title); }

/* the game's name in the main menu: the toy logo */
body[data-style="toy"] .frame .abs.col:not(.panel) > .t64:first-child {
  color: var(--toy-title-logo-normal-font-color);
  text-shadow: calc(var(--toy-title-logo-items-shadow-offset-x) * var(--px)) calc(var(--toy-title-logo-items-shadow-offset-y) * var(--px)) 0 var(--toy-title-logo-normal-font-shadow-color);
}

/* big moments: the title plate (Godot: ToyTitlePlate with expand margins; base ToyBaseTitle) */
body[data-style="toy"] .frame .t96 {
  font-weight: var(--toy-type-hero-font-weight);
  letter-spacing: calc(var(--toy-type-hero-letter-spacing) * var(--px));
  color: var(--toy-title-plate-normal-font-color);
  background: var(--toy-title-plate-normal-bg-color);
  border: calc(var(--toy-title-plate-normal-border-width) * var(--px)) solid var(--toy-title-plate-normal-border-color);
  border-radius: calc(var(--toy-title-plate-normal-corner-radius) * var(--px));
  box-shadow: 0 calc((var(--toy-title-base-panel-expand-margin-bottom) - var(--toy-title-plate-normal-expand-margin-block)) * var(--px)) 0 var(--toy-title-base-panel-bg-color);
  padding: calc((var(--toy-title-plate-normal-content-margin) + var(--toy-title-plate-normal-expand-margin-block) - var(--toy-title-plate-normal-border-width)) * var(--px))
           calc((var(--toy-title-plate-normal-content-margin) + var(--toy-title-plate-normal-expand-margin-inline) - var(--toy-title-plate-normal-border-width)) * var(--px));
  margin: calc(var(--toy-title-plate-normal-expand-margin-block) * -1 * var(--px)) calc(var(--toy-title-plate-normal-expand-margin-inline) * -1 * var(--px));
}

/* ---------- backdrops ---------- */
body[data-style="toy"] .frame.dark { background: var(--toy-backdrop-night-panel-bg-color); }
body[data-style="toy"] .frame [style*="background:#0E0E0E"] { background: var(--toy-backdrop-night-panel-bg-color) !important; }
body[data-style="toy"] .frame .dim { background: var(--toy-backdrop-dim-panel-bg-color); }
body[data-style="toy"] .frame .dim.more { background: var(--toy-backdrop-deep-panel-bg-color); }

/* ---------- HUD plates ---------- */
body[data-style="toy"] .frame .plate {
  background: var(--toy-plate-default-panel-bg-color);
  color: var(--toy-plate-text-normal-font-color);
  border-radius: calc(var(--toy-plate-default-panel-corner-radius) * var(--px));
}
body[data-style="toy"] .frame.dark .plate { background: var(--toy-plate-night-panel-bg-color); }
body[data-style="toy"] .frame .plate.col.t18 > .b:not(.t20) { color: var(--toy-color-on-dark-title); }
body[data-style="toy"] .frame .plate.col[data-in="down"] {
  border: calc(var(--toy-plate-alert-panel-border-width) * var(--px)) solid var(--toy-plate-alert-panel-border-color);
}
body[data-style="toy"] .frame .abs.col > .col > span.t16 {
  align-self: flex-start;
  background: var(--toy-bar-label-panel-bg-color);
  color: var(--toy-text-hud-caption-normal-font-color);
  border-radius: calc(var(--toy-bar-label-panel-corner-radius) * var(--px));
  padding: 0 calc(var(--toy-bar-label-panel-content-margin-inline) * var(--px));
}

/* ---------- panels ---------- */
body[data-style="toy"] .frame .panel {
  background: var(--toy-panel-menu-panel-bg-color);
  border: calc(var(--toy-panel-menu-panel-border-width) * var(--px)) solid var(--toy-panel-menu-panel-border-color);
  border-radius: calc(var(--toy-panel-menu-panel-corner-radius) * var(--px));
  box-shadow: 0 calc(var(--toy-panel-base-panel-expand-margin-bottom) * var(--px)) 0 var(--toy-panel-base-panel-bg-color);
}

/* ---------- buttons ---------- */
body[data-style="toy"] .frame .btn {
  background: var(--toy-button-secondary-normal-bg-color);
  color: var(--toy-button-secondary-normal-font-color);
  border: calc(var(--toy-button-secondary-normal-border-width) * var(--px)) solid var(--toy-button-secondary-normal-border-color);
  border-radius: calc(var(--toy-button-secondary-normal-corner-radius) * var(--px));
  padding: calc((var(--toy-button-secondary-normal-content-margin-block) - var(--toy-button-secondary-normal-border-width)) * var(--px))
           calc((var(--toy-button-secondary-normal-content-margin-inline) - var(--toy-button-secondary-normal-border-width)) * var(--px));
  box-shadow: 0 calc(var(--toy-button-secondary-press-depth) * var(--px)) 0 var(--ctx-base);
  font-weight: var(--toy-button-secondary-label-font-weight);
}
body[data-style="toy"] .frame .btn.fill {
  background: var(--toy-button-primary-normal-bg-color);
  color: var(--toy-button-primary-normal-font-color);
  border-color: var(--toy-button-primary-normal-border-color);
  box-shadow: 0 calc(var(--toy-button-primary-press-depth) * var(--px)) 0 var(--ctx-base);
}
body[data-style="toy"] .frame .btn.ghost {
  background: var(--toy-palette-clear);
  color: var(--ctx-text);
  border-color: var(--ctx-line);
  box-shadow: none;
  font-weight: var(--toy-button-ghost-on-dark-label-font-weight);
}

/* ---------- fields ---------- */
body[data-style="toy"] .frame .field {
  background: var(--toy-field-input-normal-bg-color);
  color: var(--toy-field-input-normal-font-color);
  border: calc(var(--toy-field-input-normal-border-width) * var(--px)) solid var(--toy-field-input-normal-border-color);
  border-radius: calc(var(--toy-field-input-normal-corner-radius) * var(--px));
  padding: calc((var(--toy-field-input-normal-content-margin-block) - var(--toy-field-input-normal-border-width)) * var(--px))
           calc((var(--toy-field-input-normal-content-margin-inline) - var(--toy-field-input-normal-border-width)) * var(--px));
  font-weight: var(--toy-field-input-label-font-weight);
}

/* ---------- chips (a 3 px transparent border became border 0 + 3 px more padding: same picture) ---------- */
body[data-style="toy"] .frame .chip {
  background: var(--toy-chip-plate-panel-bg-color);
  color: var(--toy-chip-plate-text-normal-font-color);
  border: 0;
  padding: calc(var(--toy-chip-plate-panel-content-margin-block) * var(--px)) calc(var(--toy-chip-plate-panel-content-margin-inline) * var(--px));
}
body[data-style="toy"] .frame .chip.light {
  background: var(--toy-chip-light-panel-bg-color);
  color: var(--toy-chip-light-text-normal-font-color);
  border: calc(var(--toy-chip-light-panel-border-width) * var(--px)) solid var(--toy-chip-light-panel-border-color);
  padding: calc((var(--toy-chip-light-panel-content-margin-block) - var(--toy-chip-light-panel-border-width)) * var(--px))
           calc((var(--toy-chip-light-panel-content-margin-inline) - var(--toy-chip-light-panel-border-width)) * var(--px));
}
body[data-style="toy"] .frame .chip.line {
  background: var(--toy-palette-clear);
  color: var(--ctx-text);
  border: calc(var(--toy-chip-line-on-dark-panel-border-width) * var(--px)) solid var(--ctx-line);
  padding: calc((var(--toy-chip-line-on-dark-panel-content-margin-block) - var(--toy-chip-line-on-dark-panel-border-width)) * var(--px))
           calc((var(--toy-chip-line-on-dark-panel-content-margin-inline) - var(--toy-chip-line-on-dark-panel-border-width)) * var(--px));
}
body[data-style="toy"] .frame .panel .chip.light.t16 { background: var(--toy-chip-new-panel-bg-color); }

/* ---------- keycaps ---------- */
body[data-style="toy"] .frame .key {
  background: var(--toy-keycap-on-dark-panel-bg-color);
  color: var(--toy-keycap-text-normal-font-color);
  border-style: solid;
  border-color: var(--toy-keycap-on-dark-panel-border-color);
  border-width: calc(var(--toy-keycap-on-dark-panel-border-width-top) * var(--px)) calc(var(--toy-keycap-on-dark-panel-border-width-right) * var(--px))
                calc(var(--toy-keycap-on-dark-panel-border-width-bottom) * var(--px)) calc(var(--toy-keycap-on-dark-panel-border-width-left) * var(--px));
  border-radius: calc(var(--toy-keycap-on-dark-panel-corner-radius) * var(--px));
}
body[data-style="toy"] .frame .panel .key {
  background: var(--toy-keycap-on-light-panel-bg-color);
  border-color: var(--toy-keycap-on-light-panel-border-color);
}
body[data-style="toy"] .frame .panel .key.dimtext {
  background: var(--toy-keycap-quiet-panel-bg-color);
  color: var(--toy-keycap-quiet-text-normal-font-color);
  border-color: var(--toy-keycap-quiet-panel-border-color);
}

/* ---------- hand and belt slots ---------- */
body[data-style="toy"] .frame .slot {
  background: var(--toy-slot-idle-panel-bg-color);
  color: var(--toy-slot-text-normal-font-color);
  border: calc(var(--toy-slot-idle-panel-border-width) * var(--px)) solid var(--toy-slot-idle-panel-border-color);
  border-radius: calc(var(--toy-slot-idle-panel-corner-radius) * var(--px));
}
body[data-style="toy"] .frame .slot.dimtext { color: var(--toy-slot-text-empty-normal-font-color); }
body[data-style="toy"] .frame .slot.on {
  border-color: var(--toy-slot-active-panel-border-color);
  border-width: calc(var(--toy-slot-active-panel-border-width) * var(--px));
}

/* ---------- bars ---------- */
body[data-style="toy"] .frame .bar2 { background: var(--toy-bar-progress-background-bg-color); }
body[data-style="toy"] .frame .bar2 > i { background: var(--toy-bar-progress-fill-bg-color); }
body[data-style="toy"] .frame .panel .bar2 { background: var(--toy-bar-slider-background-bg-color); }
body[data-style="toy"] .frame .panel .bar2 > i { background: var(--toy-bar-slider-fill-bg-color); }

/* ---------- small HUD bits ---------- */
body[data-style="toy"] .frame .cross {
  background: var(--toy-hud-crosshair-panel-bg-color);
  border: calc(var(--toy-hud-crosshair-panel-border-width) * var(--px)) solid var(--toy-hud-crosshair-panel-border-color);
  box-shadow: none;
}
body[data-style="toy"] .frame .mic { background: var(--toy-mic-plate-panel-bg-color); color: var(--toy-mic-plate-items-icon-on); }
/* .mic.off keeps the wireframe's slash; in Godot it is the crossed-mic icon tinted with icon_off */
body[data-style="toy"] .frame .ring {
  background: var(--toy-hud-spinner-panel-bg-color);
  border-style: solid;
  border-color: var(--toy-hud-spinner-panel-border-color);
  border-width: calc(var(--toy-hud-spinner-panel-border-width-top) * var(--px)) calc(var(--toy-hud-spinner-panel-border-width-right) * var(--px))
                calc(var(--toy-hud-spinner-panel-border-width-bottom) * var(--px)) calc(var(--toy-hud-spinner-panel-border-width-left) * var(--px));
}

/* ---------- Esc menu: tabs (idle: border 0 + 3 px more padding, same picture), rows, steppers, cards ---------- */
body[data-style="toy"] .frame .tabs > div {
  border: 0;
  border-radius: calc(var(--toy-tab-idle-normal-corner-radius) * var(--px));
  padding: calc(var(--toy-tab-idle-normal-content-margin-block) * var(--px)) calc(var(--toy-tab-idle-normal-content-margin-inline) * var(--px));
}
body[data-style="toy"] .frame .tabs > div:not(.dimtext) { color: var(--toy-tab-idle-normal-font-color); }
body[data-style="toy"] .frame .tabs > div.on {
  background: var(--toy-tab-selected-normal-bg-color);
  color: var(--toy-tab-selected-normal-font-color);
  border: calc(var(--toy-tab-selected-normal-border-width-top) * var(--px)) solid var(--toy-tab-selected-normal-border-color);
  padding: calc((var(--toy-tab-selected-normal-content-margin-block) - var(--toy-tab-selected-normal-border-width-top)) * var(--px))
           calc((var(--toy-tab-selected-normal-content-margin-inline) - var(--toy-tab-selected-normal-border-width-left)) * var(--px));
  box-shadow: 0 calc(var(--toy-tab-selected-normal-expand-margin-bottom) * var(--px)) 0 var(--toy-tab-selected-normal-border-color);
  font-weight: var(--toy-tab-selected-label-font-weight);
}
body[data-style="toy"] .frame .setrow {
  background: var(--toy-setting-row-panel-bg-color);
  border-bottom: calc(var(--toy-setting-row-panel-border-width-bottom) * var(--px)) solid var(--toy-setting-row-panel-border-color);
  border-radius: calc(var(--toy-setting-row-panel-corner-radius) * var(--px));
  padding: calc((var(--toy-setting-row-panel-content-margin-top) - var(--toy-setting-row-panel-border-width-top)) * var(--px))
           calc((var(--toy-setting-row-panel-content-margin-inline) - var(--toy-setting-row-panel-border-width-right)) * var(--px))
           calc((var(--toy-setting-row-panel-content-margin-bottom) - var(--toy-setting-row-panel-border-width-bottom)) * var(--px));
}
body[data-style="toy"] .frame .val { color: var(--toy-setting-value-normal-font-color); }
body[data-style="toy"] .frame .val .ar {
  background: var(--toy-setting-stepper-normal-bg-color);
  color: var(--toy-setting-stepper-normal-font-color);
  border: calc(var(--toy-setting-stepper-normal-border-width) * var(--px)) solid var(--toy-setting-stepper-normal-border-color);
  border-radius: calc(var(--toy-setting-stepper-normal-corner-radius) * var(--px));
  padding: calc((var(--toy-setting-stepper-normal-content-margin-block) - var(--toy-setting-stepper-normal-border-width)) * var(--px))
           calc((var(--toy-setting-stepper-normal-content-margin-inline) - var(--toy-setting-stepper-normal-border-width)) * var(--px));
  font-weight: var(--toy-setting-stepper-label-font-weight);
}
body[data-style="toy"] .frame .card {
  background: var(--toy-preset-card-idle-normal-bg-color);
  color: var(--toy-preset-card-idle-normal-font-color);
  border: calc(var(--toy-preset-card-idle-normal-border-width) * var(--px)) solid var(--toy-preset-card-idle-normal-border-color);
  border-radius: calc(var(--toy-preset-card-idle-normal-corner-radius) * var(--px));
  padding: calc((var(--toy-preset-card-idle-normal-content-margin) - var(--toy-preset-card-idle-normal-border-width)) * var(--px));
  box-shadow: 0 calc(var(--toy-preset-card-idle-press-depth) * var(--px)) 0 var(--toy-preset-card-base-panel-bg-color);
}
body[data-style="toy"] .frame .card.on {
  background: var(--toy-preset-card-selected-normal-bg-color);
  border-width: calc(var(--toy-preset-card-selected-normal-border-width) * var(--px));
  padding: calc((var(--toy-preset-card-selected-normal-content-margin) - var(--toy-preset-card-selected-normal-border-width)) * var(--px));
}
body[data-style="toy"] .frame .card.on .dimtext { color: var(--toy-preset-card-note-selected-normal-font-color); }
body[data-style="toy"] .frame .card.dimtext {
  background: var(--toy-preset-card-quiet-normal-bg-color);
  color: var(--toy-preset-card-quiet-normal-font-color);
  border-color: var(--toy-preset-card-quiet-normal-border-color);
  box-shadow: none;
}
/* swatches and radio dots */
body[data-style="toy"] .frame .dot {
  border: calc(var(--toy-pick-swatch-ring-panel-border-width) * var(--px)) solid var(--toy-pick-swatch-ring-panel-border-color);
  color: var(--toy-pick-radio-normal-font-color);
}
body[data-style="toy"] .frame .dot[style*="outline"] { outline-color: var(--toy-pick-swatch-selected-panel-border-color) !important; }
body[data-style="toy"] .frame .dot[style*="background:#EDEDED"] { background: var(--toy-pick-radio-selected-normal-bg-color) !important; }
body[data-style="toy"] .frame .dot[style*="background:#555"] { background: var(--toy-pick-radio-normal-bg-color) !important; }

/* ---------- how-to cards ---------- */
body[data-style="toy"] .frame .panel .row > .col.c[style*="#1C1C1C"] {
  background: var(--toy-howto-frame-panel-bg-color) !important;
  border: calc(var(--toy-howto-frame-panel-border-width) * var(--px)) solid var(--toy-howto-frame-panel-border-color);
  border-radius: calc(var(--toy-howto-frame-panel-corner-radius) * var(--px)) !important;
}
body[data-style="toy"] .frame .panel .row > .col.c[style*="#1C1C1C"]:nth-child(4) { background: var(--toy-howto-frame-done-panel-bg-color) !important; }
body[data-style="toy"] .frame .panel svg { stroke: var(--toy-color-outline); }
body[data-style="toy"] .frame .panel svg text { fill: var(--toy-color-outline); }

/* ---------- map ---------- */
body[data-style="toy"] .frame .map {
  background: var(--toy-map-board-panel-bg-color);
  border: calc(var(--toy-map-board-panel-border-width) * var(--px)) solid var(--toy-map-board-panel-border-color);
  border-radius: calc(var(--toy-map-board-panel-corner-radius) * var(--px));
  box-shadow: 0 calc(var(--toy-panel-base-panel-expand-margin-bottom) * var(--px)) 0 var(--toy-panel-base-panel-bg-color);
}
body[data-style="toy"] .frame .room {
  background: var(--toy-map-room-panel-bg-color);
  color: var(--toy-map-room-text-normal-font-color);
  border: calc(var(--toy-map-room-panel-border-width) * var(--px)) solid var(--toy-map-room-panel-border-color);
  border-radius: calc(var(--toy-map-room-panel-corner-radius) * var(--px));
  font-size: calc(var(--toy-map-room-text-label-font-size) * var(--px));
  font-weight: var(--toy-map-room-text-label-font-weight);
}
body[data-style="toy"] .frame .room svg { stroke: var(--toy-color-outline); }
body[data-style="toy"] .frame .map [style*="z-index:2"] {
  background: var(--toy-map-zone-panel-bg-color) !important;
  border: calc(var(--toy-map-zone-panel-border-width) * var(--px)) solid var(--toy-map-zone-panel-border-color) !important;
  border-radius: calc(var(--toy-map-zone-panel-corner-radius) * var(--px));
}
body[data-style="toy"] .frame .map .you {
  width: calc(var(--toy-map-pin-size-width) * var(--px));
  height: calc(var(--toy-map-pin-size-height) * var(--px));
  border: calc(var(--toy-map-pin-panel-border-width) * var(--px)) solid var(--toy-map-pin-panel-border-color);
  border-radius: calc(var(--toy-map-pin-panel-corner-radius-top-left) * var(--px)) calc(var(--toy-map-pin-panel-corner-radius-top-right) * var(--px))
                 calc(var(--toy-map-pin-panel-corner-radius-bottom-right) * var(--px)) calc(var(--toy-map-pin-panel-corner-radius-bottom-left) * var(--px));
  background: var(--toy-map-pin-panel-bg-color);
  transform: rotate(80deg);
}

/* ---------- HUD health and stamina (the engineer, 2026-10-03): stamina yellow; health in 21 stored stops ---------- */
body[data-style="toy"] .frame [data-bar] {
  height: calc(var(--toy-bar-track-size-height) * var(--px));
  background: var(--toy-bar-track-panel-bg-color);
  border: calc(var(--toy-bar-track-panel-border-width) * var(--px)) solid var(--toy-bar-track-panel-border-color);
  border-radius: calc(var(--toy-bar-track-panel-corner-radius) * var(--px));
}
body[data-style="toy"] .frame [data-bar] > i { border-radius: calc(var(--toy-bar-stamina-fill-corner-radius) * var(--px)); }
body[data-style="toy"] .frame [data-bar="stamina"] > i { background: var(--toy-bar-stamina-fill-bg-color); }
body[data-style="toy"] .frame [data-bar="health"] > i { background: var(--toy-bar-health-ramp-stop-16); }
body[data-style="toy"] .frame [data-bar="health"] > i[data-in="hurt"] { background: var(--toy-bar-health-ramp-stop-04); }
```

The health rules work because the frames show hp 0.8 (`--hp:.8`, step 16) and, in the "hurt" state, 0.22 (step 4)
([wireframes.html L415](../../../pages/wireframes/wireframes.html#L415)).

**The target `motion-preview.css`** (profile `motion`):

```css
/* Press feedback preview for Toy (prime-game-ui#2, #5). In Godot: ToyPress tweens the face's visual-only offset
   (offset_transform_position, enabled) with TRANS_SINE + EASE_OUT; the base Panel stays still. */
body[data-style="toy"] .frame .btn:not(.ghost),
body[data-style="toy"] .frame .card {
  cursor: pointer;
  transition: transform var(--toy-motion-press-duration) var(--toy-motion-press-timing-function),
              box-shadow var(--toy-motion-press-duration) var(--toy-motion-press-timing-function);
}
body[data-style="toy"] .frame .btn:not(.ghost):hover {
  transform: translateY(calc(var(--toy-button-secondary-press-hover) * var(--px)));
  box-shadow: 0 calc((var(--toy-button-secondary-press-depth) - var(--toy-button-secondary-press-hover)) * var(--px)) 0 var(--ctx-base);
}
body[data-style="toy"] .frame .btn.fill:hover {
  transform: translateY(calc(var(--toy-button-primary-press-hover) * var(--px)));
  box-shadow: 0 calc((var(--toy-button-primary-press-depth) - var(--toy-button-primary-press-hover)) * var(--px)) 0 var(--ctx-base);
}
body[data-style="toy"] .frame .btn:not(.ghost):active {
  transform: translateY(calc(var(--toy-button-secondary-press-held) * var(--px)));
  box-shadow: 0 calc((var(--toy-button-secondary-press-depth) - var(--toy-button-secondary-press-held)) * var(--px)) 0 var(--ctx-base);
}
body[data-style="toy"] .frame .btn.fill:active {
  transform: translateY(calc(var(--toy-button-primary-press-held) * var(--px)));
  box-shadow: 0 calc((var(--toy-button-primary-press-depth) - var(--toy-button-primary-press-held)) * var(--px)) 0 var(--ctx-base);
}
body[data-style="toy"] .frame .card:active {
  transform: translateY(calc(var(--toy-preset-card-idle-press-held) * var(--px)));
  box-shadow: 0 calc((var(--toy-preset-card-idle-press-depth) - var(--toy-preset-card-idle-press-held)) * var(--px)) 0 var(--toy-preset-card-base-panel-bg-color);
}
body[data-style="toy"] .frame .card.dimtext:active {
  transform: translateY(calc(var(--toy-preset-card-quiet-press-held) * var(--px)));
  box-shadow: none;
}
```

- The old `@media (prefers-reduced-motion)` block goes, because the tokens CSS sets the duration to 0 under the same
  query.
- L13 for these rules looks up the base selector in `toy.css`. `.card.dimtext:active` has `box-shadow: none`.

### 15.3 Every intended visual change (everything else must be identical)

| # | Change | Where | Why |
|---|---|---|---|
| 1 | Letter spacing: `.t16`, `.t18` +0.01em → 0; `.t36`, `.t48` −0.01em → 0; `.t64`, `.t96` −0.01em → −1 px. Sub-pixel per glyph, but it moves some line wraps and so panel heights (fix pass: at a 1022 px frame the s1 invite checklist line and the s2 join hint go from 2 lines to 1) | all text | `spacing_glyph` is an int (godot-facts §5) |
| 2 | Health fill at 22 % (s7 "hurt"): `#E87D46` → `#EA7A46` (stop 04). The 80 % fill stays `#92BA4C` | s7 | decision 7 |
| 3 | Selected preset card: padding 12 → 10, so it is 2 px smaller on every side, the idle card's size | s5 host | a toggle cannot change size in Godot |
| 4 | Stepper radius: `999px` → 999 reference px. The computed value differs, the picture does not (still a pill). At the probe's 1920 px frame 1 reference px is 1 px, so there the computed value is 999px both times | s5 host | token-only lengths |
| 5 | Chips and idle tabs: a 3 px transparent border → border 0 and padding + 3. The background is painted under the border box, so the picture is the same at the probe's 1920 px frame. At other frame widths Chrome snaps the 3 reference px border to whole pixels but not the padding that replaces it, so chips and idle tabs move by up to about 1 px, and idle tabs are no longer exactly the selected tab's height (fix pass, measured at 1022 and 358 px) | s4, s5, s6, s7, s8 (s1 has only bordered chips) | lint L14 (godot-facts, `border-color: transparent`) |
| 6 | Live only: buttons travel 4 / 5 px (was 5 / 6) and the base stays still; the held card shows a 2 px base (was the card and its base moving 3 px); the easing is `cubic-bezier(0.33, 0.52, 0.64, 1)` (was `ease-out`) | hover and press | decisions 5 and 6 |
| 7 | `.marker` and `.circ` rules removed | none: no frame uses them | dead rules |

### 15.4 Known Godot differences left visible in the frames

These are checked later in a Godot `shot`, not changed here.
- **Inner corners** where border widths are uneven and the inner radii do not overflow (keycap 2/2/5, the setting
  row's bottom-only border, the selected tab's 3/3/7/3 merge form): Godot draws circles, CSS draws ellipses
  (godot-facts §2). The spinner (10 10 0 0, pill) overflows; Godot 4.7.2's `set_corner_scale` makes it elliptical
  too, so it matches.
- **Button text sizes:** the frames show 20 to 24 px buttons from the wireframe size classes. The variations fix one
  size each.
- **Line height:** CSS uses 1.25. The generator turns `lineHeight` into `line_spacing` once Comfortaa's metrics are
  available, which needs the font download approval.

### 15.5 The zero-change proof: `node tools/visual/probe.js --before main` (builder 4, local only)

1. **Pages.** It writes three copies of the styles page into the OS temp folder, never into the repo:
   - **before:** `git show main:pages/styles/styles.html`;
   - **after:** the freshly built `pages/styles/styles.html`;
   - **after + reverse patch:** the after page plus `tools/visual/intended-changes.css`, which restores items 1–4 of
     §15.3 in their old form with `!important`. Exactly these declarations:

     ```css
     body[data-style="toy"] .frame .t16, body[data-style="toy"] .frame .t18 { letter-spacing: .01em !important; }
     body[data-style="toy"] .frame .t36, body[data-style="toy"] .frame .t48,
     body[data-style="toy"] .frame .t64, body[data-style="toy"] .frame .t96 { letter-spacing: -.01em !important; }
     body[data-style="toy"] .frame [data-bar="health"] > i[data-in="hurt"] { background: #E87D46 !important; }
     body[data-style="toy"] .frame .card.on { padding: calc(12cqw / 19.2) !important; }
     body[data-style="toy"] .frame .val .ar { border-radius: 999px !important; }
     ```

2. **A harness script** is injected into each copy. It:
   - forces `.frame { width: 1920px !important }`, the stage `overflow: visible`, and `* { transition: none !important }`;
   - for each style `toy`, `retro`, `card`, sets `data-style`;
   - for every screen section, clicks each of its state buttons (the page's existing state switcher) and records every
     visible element under the frame.

   The key of a record is style, screen, state and the element's child-index path.
3. **The record per element:**
   - the border box relative to the frame, and the content box;
   - background RGBA;
   - per side, the visible border width and RGBA. A border with alpha 0 counts as background, so "3 px transparent +
     padding 1" equals "0 + padding 4";
   - the four radii;
   - `box-shadow` and `text-shadow`, normalised;
   - `color`, `font-size`, `font-weight`, `letter-spacing`, `line-height`;
   - `transform`, `opacity`.

   The JSON goes into `<script type="application/json" id="probe-out">`.
4. **Edge.** It runs through PowerShell, because node `spawnSync` and Git Bash both get an empty dump (checked, see
   [judge.md](judge.md)):

   ```
   powershell -NoProfile -Command "Start-Process -FilePath 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
     -ArgumentList '--headless=new','--disable-gpu','--no-first-run','--user-data-dir=<temp>',
     '\"--host-resolver-rules=MAP * ~NOTFOUND\"','--force-device-scale-factor=1','--window-size=1920,1080',
     '--virtual-time-budget=20000','--dump-dom','file:///<temp>/probe-after.html'
     -Wait -NoNewWindow -RedirectStandardOutput '<temp>/after.dom.html'"
   ```

   - The resolver rule blocks every network fetch: nothing is downloaded, and all runs use the same fallback font.
   - `--virtual-time-budget` makes `--dump-dom` wait. Edge 154 dumped a page after a 3 s timer had fired.
5. **Compare** (`tools/visual/compare.js`). Numbers must match within 0.02 px; colours and strings exactly.
   - **after + reverse patch** against **before** must have **zero differences**, for all three styles. This proves
     there is no unintended change.
   - **after** against **before** prints the intended differences. They must be exactly items 1–5 of §15.3, and the PR
     pastes them.
   - It exits 1 on any difference in the first comparison.

---

## 16. Work split for workflow 2

Four builders own disjoint files (the owners in §1). They share this spec and these interfaces:
- the token paths and CSS variable names (§3, §4, §8);
- the pack schema (§9.1);
- `api.load()` (§7.4);
- `tools/lib/color.js` (§7.5) and `tools/lib/wcag.js` (§11.5);
- the lint profiles and `targets.json` (§10);
- `dist/gates.json` (§11.6);
- the `.tv-*` classes (§13).

| Builder | Owns | Builds | Runs before it reports done |
|---|---|---|---|
| **1: tokens and the build** | `tokens/**` except `gates.json`; `tools/lib/json-strict.js`, `tools/lib/color.js`; `tools/tokens/**`; `dist/css/toy-tokens.css`; `dist/pack/toy.pack.json` | §3–§9: every token file, validator D01–D39 + P40–P60, resolver, expansion, ramp, both emitters, `api.js`, fixtures, `expect-values.json` | `node tools/tokens/test/run.js` (all fixtures and spot values pass); `node tools/tokens/build.js` then `node tools/tokens/build.js --check` (clean); `node -e "require('./tools/tokens/api.js').load({root:'.'})"` prints no error; the build's summary shows 95 variations (94 before the fix pass added ToyHowtoNote) and 4 permutations |
| **2: lint, gates, check.js and CI** | `tokens/gates.json`; `tools/lib/wcag.js`; `tools/lint/**`; `tools/contrast/**`; `dist/gates.json`; `tools/check.js`; `.github/workflows/check.yml` | §10, §11, §12 | `node tools/lint/godot-css.js --self-test`; `node tools/contrast/gates.js --self-test`; once builder 1 has landed, `node tools/contrast/gates.js` then `--check`, where only x15 and its auto twin may be WAIVED and nothing may FAIL; `node tools/check.js` runs every step and reports each |
| **3: components CSS and the showcase** | `pages/components/**` | §13, §14 | `node pages/components/build.js` then `--check`; `node tools/lint/godot-css.js` with its `generated` target clean; one headless Edge dump of `components.html` (via PowerShell, §15.5) showing `.tv-ToyButtonPrimary`'s computed background `rgb(255, 194, 58)` and no script error in a `<pre>` the page fills on load |
| **4: toy.css on tokens and the styles page** | `pages/styles/toy.css`, `motion-preview.css`, `build-styles-page.js`, `styles.html`; `tools/visual/**` | §15 | `node pages/styles/build-styles-page.js` then `--check`; `node tools/lint/godot-css.js` with the `skin` and `motion` targets clean; `node pages/styles/check_styles.js retro card` (ALL CLEAN); `node tools/visual/probe.js --before main` (zero differences after the reverse patch; the intended list equals §15.3) |

**Order and parallelism:**
- **All four start at once, from this spec.** Every interface above is fixed here. Builder 2 needs no generated file:
  its self-tests use its own fixtures.
- **Builders 3 and 4 need builder 1's outputs** (`dist/css/toy-tokens.css`, `dist/pack/toy.pack.json`,
  `tools/tokens/api.js`) to run their final checks. They write code and CSS against the names in the meantime, and run
  their done-checks only after `node tools/tokens/build.js --check` passes.
- **Builder 2's gates run on the real pack** after builder 1.
- **Only builder 1 writes under `dist/css` and `dist/pack`. Only builder 2 writes `dist/gates.json`.**
- **Merge order:** 1, then 2, then 3 and 4 in either order. Each is rebased and runs `node tools/check.js` to ALL CLEAN
  at the end.
- **If a builder finds a spec gap,** it decides the technical point, writes it in its PR description, and does not
  edit another builder's files.

---

## 17. Verification plan (four verifiers)

1. **Godot fidelity.**
   - From `dist/pack/toy.pack.json`, check every variation against godot-facts:
     - each field maps to a real `StyleBoxFlat` property;
     - no `shadow_*`;
     - ints where Godot needs ints;
     - equal content-margin sums across states and toggle pairs (§3.4 of godot-facts);
     - base geometry (P50) and merge form (P51);
     - focus geometry (P48);
     - the ProgressBar fill math for the HUD bars (godot-facts §6).
   - Hand-compute the drawn rects for 10 variations (primary, the selected tab, title plate and base, keycap, selected
     card, field focus, chip toggle outer focus, HUD health at 0.03, map pin, spinner). Compare them with the showcase's
     computed styles at 100 % zoom.
   - Check the ToyPress contract against base_button.cpp (`button_down` on `ui_accept`) and Control.xml
     (`offset_transform_enabled`).
   - Recompute the 21 stops and the bezier fit.
2. **Lint attacker.** Write adversarial CSS for each rule and report every one that passes:
   - `0 5px 0 0 red` (spread), `0 5px 1px red`, `-1px 5px 0 red`;
   - `border-color: red red red blue`, `border-top: 3px solid red` next to `border-bottom: 3px solid blue`;
   - `calc(18.5 * var(--px))`, `calc(18 * var(--px) / 2)`, `calc(var(--toy-a) * 2 * var(--px))`;
   - `var(--toy-nope)`, `TRANSPARENT`, `rgba(0,0,0,0)` borders, `currentColor`, `color-mix(…)`;
   - `::before`, `:is(.x)::after`, `outline: 2px dashed`, `@supports`, `@layer`;
   - `letter-spacing: .01em`, `transform: translateY(5px)` in skin, `!important` in generated;
   - a `box-shadow` on a `.btn.ghost` that inherits a clear background, `width: 50%` outside `.tv-fill`, `var(--px)` on
     `.frame.dark`.

   Also confirm that the good fixtures and the real targets pass.
3. **Toy look regression.**
   - Run `node tools/visual/probe.js --before main` on a clean checkout. Confirm zero differences after the reverse
     patch for toy, retro and card, and that the printed intended list is exactly §15.3 items 1–5.
   - Spot-check, in the probe's JSON, the computed values of `.btn.fill`, `.tabs > div.on`, `.t96`, `.chip.line`,
     `[data-bar="health"] > i` in s7 "hurt", and `.card.on`.
4. **Completeness against #5 and the engineer's list.**
   - Every component, variant and state of §4 and §14.6 exists in the tokens, the pack, `toy-components.css` and
     `components.html`. The engineer's list must be covered: buttons (normal, hover, pressed, disabled), chips, hand and
     belt slots (empty, filled, active, two-handed wide), bars (yellow stamina, green-to-red health at several
     fractions, task progress), panels, keycap, and the how-to card (normal and done). Its check is in
     [judge.md](judge.md), "The engineer's list".
   - The page chrome is Ukrainian; the samples switch uk/en; text size, motion and zoom work; live hover and press work
     on touch; every state is also static side by side; proposals carry the badge.
   - `node tools/check.js` is ALL CLEAN, and the workflow file is valid YAML.
   - Validate two token files and the resolver against the published 2025.10 schemas (read as JSON, not saved) with a
     throwaway script, knowing the schema quirks of dtcg-facts §0.

---

## 18. Open look questions for the engineer

Only look, texts and money. Every proposal below is in the tokens with `proposal: true` and badged «пропозиція» on the
showcase.

1. **Disabled.** "Unplugged": no toy base, the face pale lilac `#F3EDF6`, muted plum outline and label. OK, or "sunk
   flat" (the face pushed down onto its base)?
2. **Focus** for keyboard and gamepad. Big controls: the outline thickens inward from 3 to 6 px (ink; cream on ghost
   buttons on dark). Chips, the stepper and radios: a 3 px ring 2 px outside. OK?
3. **Hover and held on flat controls.** Ghost buttons, line chips and idle tabs fill night-plate on dark and lavender on
   light. A held stepper turns honey. Raised cards lift 1 px on hover. OK?
4. **A coral danger button** for the host's «Покинути сесію» and the confirm dialog: yes or no?
5. **Large text.** ×1.25 for 18 to 36 px (18→23, 20→25, 22→28, 24→30, 28→35, 36→45); 48, 64 and 96 unchanged. OK?
6. **The selected preset card** keeps the idle card's size (padding 10 instead of 12). OK?
7. **The press.** The base stays still, buttons sink 4 or 5 px leaving 1 px, a card sinks 3 px onto a 2 px base. Ghost
   buttons do not move. OK?
8. **x15.** Lilac text on the menu backdrop over a white wall is 3.93:1, waived until you decide:
   - raise `.dim` to 74 % (4.50:1);
   - lighten the lilac;
   - or use cream for that text.
9. **Keycaps.** Wide keys (Space, Shift, Tab, Esc) at least 96 px. OK?
10. **Near-duplicates.** Four near-identical dark plums and four pale lilacs (inventory §0) stay as 28 separate colours.
    Merge any of them?

---

## 19. For the prime-game issue

File one issue per item in prime-game, each with its `area:` label and a note on
[#150](https://github.com/xperiaroco2/prime-game/issues/150).

1. **Base resolution.**
   - Set `display/window/size/viewport_width = 1920` and `viewport_height = 1080`.
   - Set `window_width_override = 1152` and `window_height_override = 648`, so the start window keeps its size
     (godot-facts §8).
   - The generator stops with an error until this is in.
2. **Sync command.** A `ui-sync` subcommand of `tools/runner/cli.py`: `tools\run.cmd ui-sync ui-<version>`.
   - It fetches `dist/pack/**` at the tag, copies it into `client/ui/theme/pack/` with a `.gdignore`, and writes
     `client/ui/theme/pack.lock.json` `{repo, tag, commit, files: {name: sha256}}` (§9.3).
   - A unit test fails when a copied file's sha256 differs from the lock, when the lock's tag ≠ `ui-` + `pack.version`,
     or when `schema` is unknown.
3. **Generator.** `tools/theme/build_theme.gd`, run with `tools\run.cmd run tools/theme/build_theme.gd`, plus
   `tools/theme/mapping.json`. It reads the pack and the mapping, then:
   - writes `client/ui/theme/game_theme.tres` from the defaults;
   - restores the uid `uid://c8behqt7jtcn8` with `ResourceSaver.set_uid` (godot-facts §9);
   - sets `resource_scene_unique_id` per StyleBox, for stable diffs;
   - writes `game_theme_large.tres` (textSize large: the font sizes and, since ui-0.3.0, the keycaps' `min_width`
     constant, 42), applied through a `GameUi` change
     (godot-facts §8);
   - writes the motion values as constants `press_duration_ms` and `press_duration_reduced_ms`, so no second theme is
     needed for motion.

   **The mapping** is per class (§4.18):
   - state names → items (`hover-pressed` → `hover_pressed`, `read-only` → `read_only`);
   - fields → `StyleBoxFlat` properties (`-` → `_`);
   - per-state `font-color` → the `font_*_color` items;
   - `label` → `font` (a `FontVariation` per weight and letter spacing over one Comfortaa `FontFile`, once the font is
     approved; until then only `font_size`) and `font_size`;
   - `press.*`, `size.*`, `items.*` → constants and colours;
   - ramp stops → `ramp_stop_NN`;
   - the `empty` list → `StyleBoxEmpty`.

   **Legacy names** become thin variations of the Toy ones, so screens keep working: `EscTab` → `ToyTab`;
   `HudPanel`, `LifePanel`, `TaskPanel` → `ToyPlate`; `HudText`, `TaskRow`, `LifeText` → `ToyTextOnDark`; `HudTitle`,
   `Title`, `EndTitle`, `LifeTitle` → `ToyTitleOnDark`; `TaskDescription` → `ToyTextMutedOnDark`; `EscShade` →
   `ToyBackdrop`; `EndBackdrop`, `LoadingBackdrop` → `ToyBackdropNight`; `LifeBar` → `ToyBarProgress`. Containers stay
   as they are.

   **Tests:** every pack variation is mapped, and every mapped key exists; the committed theme equals a regenerated
   one; names are letters only.
4. **Press motion.** Two components in `client/ui/`:
   - **`ToyRaised`**: a `MarginContainer` with the base `Panel` (variation from the face's `base` hint for the screen's
     context, `mouse_filter = IGNORE`) and the face. `UiParts.button()` builds Toy buttons through it.
   - **`ToyPress`**, on every Toy button:
     - `face.offset_transform_enabled = true` (the default is false);
     - targets `press_hover`, `press_held`, `press_disabled` read with `get_theme_constant`;
     - re-evaluated on `draw`, `button_down`, `button_up`, `mouse_entered` and `mouse_exited`;
     - a tween only when the target changes: `create_tween().set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)` on
       `offset_transform_position:y`, over `press_duration_ms`, or `press_duration_reduced_ms` under the reduced-motion
       setting (default from `DisplayServer.accessibility_should_reduce_animation()`);
     - `base.visible = not face.disabled`.
   - **`ToyToggle`**: sets `theme_type_variation` to the pack's `toggle.selected` name on `toggled(true)`, and back on
     `toggled(false)`.
   - **Tests:** call the handlers directly (headless runs have no InputEvents) and assert the target offsets, base
     visibility and the variation swap.
5. **Health colour.** The HUD bar is a ToyBarTrack holding a fill-only ProgressBar (ToyBarHealth or ToyBarStamina) with
   `show_percentage = false` (the default is true,
   [ProgressBar.xml L21](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/ProgressBar.xml#L21)).
   - `step = clampi(floori(hp * 20.0 + 0.5), 0, 20)`;
   - `fill_bar.self_modulate = get_theme_color("ramp_stop_%02d" % step, &"ToyBarHealth")`. The fill StyleBox is white,
     so white × colour = colour, and the empty background takes no tint (godot-facts §6). There is no `Color(...)` in
     screen code.
   - **Test:** step(0.22) = 4, step(0.8) = 16, step(1.0) = 20, and all 21 colours exist in the theme.
6. **Godot showcase scene and its shot.**
   - `tools/theme/showcase.tscn` plus a script that reads the pack's `variations` and instantiates each one in every
     state it can force: normal, disabled, toggled, focused with `grab_focus`, and press offsets set directly for hover
     and held. It goes on night and cream stages at 1920×1080, in the order of the HTML showcase.
   - The map pin turns about its centre, as in the HTML showcase: `rotation` with `pivot_offset_ratio = Vector2(0.5, 0.5)`,
     or `offset_transform_rotation` with `offset_transform_enabled` (§4.12). The default pivot (top-left) moves a 28 px
     pin by about 25 px at 80°.
   - It lives under `tools/`, not `client/ui/`, because it is a dev tool, not a screen.
   - Shot: `tools\run.cmd shot tools/theme/showcase.tscn --size 1920x1080`
     ([cli.py L130-L134](https://github.com/xperiaroco2/prime-game/blob/c43c0e185918b346ea3a537e48c8c950b230a87c/tools/runner/cli.py#L130-L134)).
   - The PR compares the PNG with `components.html` at 100 %, above all the inner corners of the keycap, the setting row
     and the selected tab (with its focus ring), and the 1 px edges of the bases.
7. **Text size and fonts.**
   - The text-size setting and the `GameUi` theme swap.
   - Comfortaa ships after the engineer approves the download batch: the file, its OFL text and its licence entry in the
     pack's `assets`. Then the generator also writes `line_spacing` from the font's metrics.

---

## Sources

- **Ground files:** [godot-facts.md](godot-facts.md), [dtcg-facts.md](dtcg-facts.md), [inventory.md](inventory.md),
  [inventory.json](inventory.json), [architecture-a.md](architecture-a.md), [architecture-b.md](architecture-b.md),
  [judge.md](judge.md); [`toy.css`](../../../pages/styles/toy.css),
  [`motion-preview.css`](../../../pages/styles/motion-preview.css), [`check_styles.js`](../../../pages/styles/check_styles.js),
  [`build-styles-page.js`](../../../pages/styles/build-styles-page.js), [`wireframes.html`](../../../pages/wireframes/wireframes.html),
  [`ui-decisions.md`](../../ui-decisions.md).
- **DTCG 2025.10:** [Format](https://www.designtokens.org/tr/2025.10/format/),
  [Color](https://www.designtokens.org/tr/2025.10/color/), [Resolver](https://www.designtokens.org/tr/2025.10/resolver/)
  (rules as quoted in dtcg-facts).
- **Godot 4.7.2-stable:**
  [Control.xml L1161-L1195](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Control.xml#L1161-L1195),
  [base_button.cpp](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/base_button.cpp#L59-L290),
  [margin_container.cpp L122-L130](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/margin_container.cpp#L122-L130),
  [ProgressBar.xml L21](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/ProgressBar.xml#L21); the
  API dump `D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json` (local).
- **CSS and WCAG:** [CSS Custom Properties 1 §2](https://www.w3.org/TR/css-variables-1/#defining-variables),
  [CSS Containment 3, container lengths](https://www.w3.org/TR/css-contain-3/#container-lengths),
  [WCAG 2.2](https://www.w3.org/TR/WCAG22/#dfn-relative-luminance).
- **prime-game** (read only): [cli.py `shot`](https://github.com/xperiaroco2/prime-game/blob/c43c0e185918b346ea3a537e48c8c950b230a87c/tools/runner/cli.py#L130-L134),
  [ci.yml](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/.github/workflows/ci.yml).
- **CI:** [nodejs/Release schedule.json](https://github.com/nodejs/Release/blob/main/schedule.json),
  [actions/setup-node v7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0).
- **Local checks** (2026-10-03, scratchpad only): the ramp by two matrix paths; the bezier fit; contrast ratios; headless
  Edge 154 for `--px` resolution, the `--dump-dom` timing and the PowerShell launch.
