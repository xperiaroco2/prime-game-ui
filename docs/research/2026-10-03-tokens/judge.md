# Judging the two Toy token architectures

For [prime-game-ui#5](https://github.com/xperiaroco2/prime-game-ui/issues/5), 2026-10-03. Two architects designed the Toy
token system independently:
- **A**, Godot first: [`architecture-a.md`](architecture-a.md).
- **B**, DTCG and pages first: [`architecture-b.md`](architecture-b.md).

This page checks their claims against the ground files ([`godot-facts.md`](godot-facts.md),
[`dtcg-facts.md`](dtcg-facts.md), [`inventory.md`](inventory.md), [`inventory.json`](inventory.json)) and against primary
sources where a claim decides something. It then scores both and names the winner. The merged result is
[`spec.md`](spec.md).

**Method.** Both documents were read in full. Throwaway node 20 scripts ran in the session scratchpad, and nothing was
saved in either repo:
- the OKLab ramps, by two matrix paths;
- the cubic-bezier fit;
- every contrast ratio quoted below;
- a hex scan of both documents against the inventory.

The Godot 4.7.2 API dump (`D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json`) was queried, and the engine
source at `4.7.2-stable` was read as plain text. One local headless Edge 154 run used a throwaway page. Godot was not
run.

## Verdict

**Winner: A**, 24 points against B's 23, with eleven parts of B grafted in.

The deciding argument is the repo's own hard rule: "a DTCG tokens file is the single source of truth; the Godot theme is
generated from it in prime-game, never hand-copied" ([CLAUDE.md](../../../CLAUDE.md)).
- **A** makes the component tier the list of `StyleBoxFlat` records itself, one per Godot state. Both the showcase CSS and
  the Godot theme are generated from that one tier.
- **B** keeps 43 component lengths and states every component look twice, by hand:
  - in `pages/components/components.css`;
  - in a token → item mapping table in prime-game ([B §G](architecture-b.md), [B §F.3](architecture-b.md)).

  Those two copies can drift, and the later generator has to rebuild every component from roles.

A's weakness is its size: about 1,100 source tokens and about 80 variations. The spec keeps A's shape and cuts the
authoring load with shorthands, completion and shared bases.

## Scores (1 to 5)

| Criterion | A | B | Why |
|---|---|---|---|
| Godot fidelity | 4 | 4 | A has one-to-one StyleBox records, exact bases, 21 stored ramp colours and an easing curve matched to SINE/OUT. But A forgets that `offset_transform_enabled` defaults to false, so its press would never move, and its "sunk" disabled look risks a base-coloured anti-aliasing fringe. B found the flag and gives exact bases. But B's component looks live in hand-written CSS plus a separate Godot mapping, and its outside focus ring crosses the toy base under the face |
| DTCG 2025.10 validity | 4 | 5 | Both are valid. B's tiers are cleaner: every component colour is a semantic alias, and lengths go through `px.*` and role scales. A writes geometry as literal ints in about 1,100 component tokens and lets component colours alias `palette.*`. That relaxes dtcg-facts checklist item 31, which is a profile rule, not a spec rule |
| Completeness against the requirements | 5 | 4 | A gives every variation's exact values per state, a 17-item validator profile, the full Godot mapping summary and a declaration-level migration map. B covers every heading. But B gives component states only as role references, and the mapping per Godot item is left to prime-game. B's builder split matches the one asked for; A's does not |
| Simplicity for the builders | 2 | 4 | A means about 1,100 tokens, expansion and completion rules, and generated CSS per variation. B is about 200 hand-written tokens plus hand-written component CSS |
| Zero visual regression of the Toy pages | 4 | 4 | Each has three static changes. A's are closer to today: it keeps the 80 % health colour exactly and rounds −0.96 px letter spacing to −1 instead of 0. A's proof needs zero differences after a reverse patch, which is stronger. But A launches Edge directly from node, and that returns an empty DOM (checked below). B's proof filters the diffs and was tested through PowerShell |
| Ease of the later Godot generator | 5 | 2 | A's pack carries complete StyleBox records and variation hints, so the prime-game mapping is generic per class. B's generator has to rebuild every variation from about 140 role tokens through a hand-written table |
| **Total** | **24** | **23** | |

## Claims checked

### Godot (against godot-facts and the 4.7.2 source)

| Claim | Who | Result |
|---|---|---|
| `shadow_size ≥ 1` is the only way a StyleBoxFlat draws a shadow, and it adds a linear 1 px fade, so the toy base must be a separate node or a thicker bottom border | A, B | **True** ([godot-facts §1.1–1.3](godot-facts.md)). Both reject `shadow_size`; godot-facts had recommended `shadow_size = 1` as the best single StyleBox, and both architects went further, to exact forms |
| The merge form (bottom border + depth, `expand_margin_bottom`) is exact only when the base colour equals the outline colour | A, B | **True** (godot-facts §1.3). Both use it only for the selected Esc tab |
| `Control.offset_transform_enabled` defaults to `false`; the other `offset_transform_*` do nothing until it is set | B | **True**: [Control.xml L1161-L1163](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Control.xml#L1161-L1163) (`default="false"`), present in the API dump. **A omits it**, and godot-facts §4 did not mention it |
| `button_down` fires for keyboard and gamepad activation | B: "(unconfirmed)" | **True** for `ui_accept`: `gui_input` routes `is_action("ui_accept")` to `on_action_event`, which emits `button_down` for an accept event ([base_button.cpp L96-L101, L236-L249](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/base_button.cpp#L96-L101)). Touch goes the same way (L66-L81) |
| A `Gradient` in `GRADIENT_COLOR_SPACE_SRGB` lerps the stored components unchanged | B | **True**: `transform_color_space` returns the colour as is for SRGB ([gradient.h L75-L79](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/gradient.h#L75-L79)) |
| A `MarginContainer` gives every child the same rect | B (layer form) | **True**: [margin_container.cpp L122-L130](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/margin_container.cpp#L122-L130); the default theme sets its four margins to 0 ([default_theme.cpp L1274-L1277](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L1274-L1277)) |
| `ProgressBar.show_percentage` must be turned off for the HUD bars | neither said it | `default="true"` ([ProgressBar.xml L21](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/ProgressBar.xml#L21)): added to the spec's prime-game section |
| Variation names starting `Toy` never collide with a class | A | **True**: no class in the 4.7.2 dump starts with `Toy` (queried) |
| Tween enum values `TRANS_SINE` = 1, `EASE_OUT` = 1 | A, B | **True** (dump) |
| `DisplayServer.accessibility_should_reduce_animation()` exists | A, B | **True** (dump) |

### CSS and the pages

| Claim | Who | Result |
|---|---|---|
| A custom property substitutes its `var()`s where it is declared, so a length token that contains `var(--px)` freezes `--px` at `:root` | A ([css-variables-1 §2](https://www.w3.org/TR/css-variables-1/#defining-variables)), B (Edge test) | **True** (both sources agree). It is why A emits lengths as unitless ints and multiplies by `var(--px)` at each use, which also lets `--px` be set per frame |
| `--px: calc(1cqw / 19.2)` keeps `cqw` as text and resolves it at the using element against the frame container | B (Edge) | **True**, reproduced: with `--px` declared on a 960 px `container-type: inline-size` frame, a child with `width: calc(18 * var(--px))` computed `9px` (Edge 154, headless) |
| Headless Edge `--dump-dom` waits for `--virtual-time-budget` | A: "(unconfirmed)" | **True** in Edge 154: a 3 s timer had fired in the dump with `--virtual-time-budget=10000` |
| Edge launched from Git Bash returns an empty dump; PowerShell `Start-Process -Wait` works | B | **True**, and the same holds for node `child_process.spawnSync`: exit 0 and an empty stdout. `Start-Process -Wait -NoNewWindow -RedirectStandardOutput` gave the full DOM. **A's probe, which runs Edge from node, would read nothing** |
| Chromium rounds border widths down below 100 % zoom | B | Observed by B only, not re-checked; kept as a note |

### DTCG (against dtcg-facts)

- Both resolvers match the 2025.10 resolver module: `version`, `sets.sources`, two modifiers with `contexts` and
  `default`, and `resolutionOrder`.
- Both use structured values (`colorSpace`/`components`/`hex`, `{value, unit}`), numeric font weights and full
  typography objects with `letterSpacing`. Neither uses `$ref`, `$extends`, `$root`, gradients, shadow arrays or
  `inset`.
- A's derived ramp stops are generated outside `tokens/`: valid, since they are build output, not DTCG sources.
- B's three derived palette stops carry their derivation in `$extensions`: valid.
- No violation found in either.

### Values against the inventory

- **Hex scan.** Every `#rrggbb` in both documents was compared with the inventory's 21 palette variables and 7
  hard-coded colours. The only values outside it are:
  - health-ramp samples computed from the engineer's two endpoints;
  - the world samples `#C9C9C9` and `#979797`;
  - A's `#000000` at alpha 0 for "clear";
  - the wireframe's `#0E0E0E`, mentioned in a selector.

  **Neither invents a colour.** Both mark every added state colour as a proposal, and every proposal reuses a palette
  colour.
- **A's 21 health stops** are all reproduced exactly, by Ottosson's matrices and by the CSS Color 4 XYZ path. All are ≥
  3.25:1 on `#4A3C5C`.
- **A's "worst nearest-stop error ΔE_ok 0.0067"** is **understated**. A fine scan gives **0.0096**, at hp 0.575: half of
  the largest adjacent step, 0.0185. That is still under the adjacent step and under the commonly quoted ~0.02 (that
  threshold is unconfirmed).
- **B's 5-stop ramp** is reproduced (#FA6245 at 0.05, #E87C47 at 0.22, #8FBA4C at 0.8). Its largest distance from the
  continuous OKLab mix is 0.0061, and its minimum contrast is 3.25 at hp 0.
- **A's easing** `cubic-bezier(0.33, 0.52, 0.64, 1)` is within **0.00051** of `sin(πt/2)`, Godot's SINE/OUT. CSS
  `ease-out` is within 0.02397, as godot-facts §4 says.
- **A's palette count**: it says "30 palette colours", but it has 28 colours plus `clear` (29 tokens).

### The engineer's list

Both cover everything:
- buttons: normal, hover, pressed, disabled, focus;
- chips;
- hand and belt slots: empty, filled, active, two-handed wide;
- bars: stamina in the toy yellow, health green to red at several fractions, task progress;
- panels, the HUD plate, the dialog;
- keycaps: on dark, on light, dim, wide;
- the how-to card, normal and done;
- the field, tabs, setting row and stepper, preset cards, map room and pin, mic on and off, name plate.

## Where each falls short (and what the spec does about it)

**A**
1. **Press never moves.** It misses `offset_transform_enabled = true`. Fixed: the spec's ToyPress sets it.
2. **Bold selection lost.** "One weight per toggle" drops the approved bold selected tab and chips until the engineer
   answers. That is a look change made by default. Replaced by B's selected-variation swap.
3. **Disabled may fringe.** "Sunk flat" disabled sits the face exactly on its base, which risks an anti-aliased base
   fringe and reads like "held". Replaced by B's "unplugged" look: no base.
4. **Titles grow too far.** Large text scales 96 px titles to 120 px. Replaced by B's rule: ×1.25 up to 36 px, display
   sizes unchanged.
5. **The proof cannot run.** Its Edge probe runs from node and gets an empty DOM. Fixed: run Edge through PowerShell
   `Start-Process`.
6. **The split does not match.** Its builder split differs from the four the task fixes. Re-cut in the spec.
7. **Small numbers are off.** The nearest-stop error and the palette count are wrong (above).

**B**
1. **Looks are hand-copied.** Component looks are stated twice, by hand. The spec uses A's StyleBox-record tier.
2. **The ramp needs runtime colour maths.** Health uses a `color-mix` chain with `clamp()` in the pages. Its gate samples
   21 fractions, but the luminance of an sRGB segment is convex, so the minimum of a segment can lie between samples.
   The spec uses A's 21 stored stops, which are every colour that can ever be drawn.
3. **The focus ring crosses the base.** It sits 3 px outside the face and overlaps the 5 to 6 px base below the face. A
   parent that clips can cut it. The spec keeps A's inner ring, and an outer ring only on small flat controls.
4. **Letter spacing drops further.** It goes to 0 at every size, so the 96 px title loses −0.96 px. The spec keeps A's
   whole-pixel rounding (−1 px at 64 and 96).
5. **`--px` must live on `:root`.** Its length tokens contain `var(--px)`, which only works when `--px` is set on
   `:root`. The spec keeps A's unitless ints.

## Grafted from B into the spec

1. `offset_transform_enabled = true` on every pressable face (B fact 4).
2. The layer form: a `MarginContainer` holding a base `Panel` and the face. The base can then be hidden, which the
   unplugged look needs.
3. Disabled = "unplugged": no base, the face at rest, a pale lilac face (`#F3EDF6`), muted plum outline and label.
4. Weight-changing toggles swap between `X` and `XSelected` variations on `toggled`. This keeps the approved bold
   selection.
5. Large text: ×1.25 up to 36 px; 48, 64 and 96 unchanged.
6. Role scales `stroke.*` and `radius.*` that component tokens alias, so one edit changes every control outline or
   radius.
7. The gate design:
   - gates read only the pack and `gates.json`;
   - info pairs have `min: null`;
   - a waiver fails once its pair passes;
   - results go to `dist/gates.json` for the showcase, with `--check`.
8. The release check: `check.js --release` diffs the pack against the previous `ui-*` tag, and CI uses
   `fetch-depth: 0`.
9. The pack header: `schema` plus `version`, `source.tokens_sha256`, `from`, `modes`, and a `.gdignore` in the copied
   pack folder.
10. Lint `targets.json`, and `!important` allowed only in the skin profile.
11. The showcase's "Токени" section (palette, type scale at both sizes, the health strip, the contrast table), the
    border-rounding note below 100 % zoom, and world-sample stages for HUD parts.

From neither: the general StyleBox → CSS rule (margin = −expand, padding = content + expand − border), the shared base
variations, and the split of `tools/lib` between builders 1 and 2.

## Sources

- Ground files: [godot-facts.md](godot-facts.md), [dtcg-facts.md](dtcg-facts.md), [inventory.md](inventory.md),
  [inventory.json](inventory.json); [`toy.css`](../../../pages/styles/toy.css),
  [`check_styles.js`](../../../pages/styles/check_styles.js), [`ui-decisions.md`](../../ui-decisions.md).
- Godot 4.7.2-stable (read as text): [Control.xml L1161-L1195](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Control.xml#L1161-L1195),
  [base_button.cpp L59-L290](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/base_button.cpp#L59-L290),
  [gradient.h L75-L119](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/gradient.h#L75-L119),
  [margin_container.cpp L122-L130](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/margin_container.cpp#L122-L130),
  [default_theme.cpp L1274-L1277](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L1274-L1277),
  [ProgressBar.xml L21](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/ProgressBar.xml#L21);
  the API dump (local).
- CSS: [CSS Custom Properties 1 §2](https://www.w3.org/TR/css-variables-1/#defining-variables).
- Local Edge 154 test (scratchpad page, 2026-10-03): container-relative `--px`, `--dump-dom` timing, and node vs
  PowerShell launch.
