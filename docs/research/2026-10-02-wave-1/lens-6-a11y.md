# Lens 6: Accessibility (prime-game UX/UI research, wave 1)

Date: 2026-10-02. Read-only research. Scripts and raw output (my own code, nothing downloaded):

- `scratchpad/a11y/cvd.js` and `scratchpad/a11y/cvd-output.txt`: colour-blindness simulation and colour distances
- `scratchpad/a11y/contrast.js` and `scratchpad/a11y/contrast-output.txt`: WCAG contrast for HUD backplates and colour swatches
- `scratchpad/a11y/api_check.js`: confirms every Godot member named below against `tools/out/godot-api/4.7.2/extension_api.json`

Full paths are under `C:\Users\xperi\AppData\Local\Temp\claude\D--prime-game\ce8374ce-5cfc-424c-bd40-f671bc77f06b\scratchpad\`.

## TL;DR

1. **The current package palette fails colour-blind players.** Simulated with the Machado 2009 model, red and brown are almost identical for protanopes (CIEDE2000 distance 2.7), and blue and purple merge for protanopes, deuteranopes and both milder "anomalous" forms (3.2 to 6.0). Seven pairs fall below my "confusable" line of 10. About 1 in 12 men has a colour vision deficiency, most often red-green ([NEI](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness)). In a 10-player lobby that is likely at least one person in most matches.
2. **No 10-colour palette is safe by colour alone.** I searched about 30 colours from proven colour-blind-safe sets for the 10 that are most distinct in normal vision and all three full colour blindnesses at once. The best minimum distance was 22 for 6 colours, 16 for 7, 13.5 for 8 and only 11.7 for 10. **Every package, circle, HUD swatch and body colour needs a symbol and a spoken colour name.** Colour is the third cue.
3. **A safer 10-colour palette exists** (Okabe-Ito hues plus white, near-black and indigo). Under all simulations it has no confusable pair: its worst full-blindness pair scores 10.9, against 2.7 for the current palette. It is still weak for tritanopes, so it does not remove the need for symbols.
4. **Numbers to adopt:**
   - Text: at least 18 px body height at 1080p (Xbox PC/VR minimum), with 20 to 24 px as our default.
   - Contrast: 4.5:1 for text and important elements, 3:1 for large text (36 px and up at 1080p) and non-text UI, 7:1 in a high-contrast mode.
   - Text scaling up to 200%.
   - Focus ring: at least 2 px with a 3:1 change.
   - Flashing: at most 3 flashes per second.
   - HUD backplate: black at 60% or more opacity behind HUD text over the 3D world. 60% gives 5.7:1 over a pure white wall; I recommend 70% by default.
5. **Settings, top ten:**
   1. UI scale and text size.
   2. Hold or toggle for Tab, G and E.
   3. Full key remapping.
   4. A colour-vision palette mode. Symbols and names stay on all the time.
   5. Reduced motion and no screen shake.
   6. Field-of-view (FOV) slider and a head-bob toggle.
   7. Crosshair style and colour.
   8. A "who is talking" indicator and per-player volume.
   9. A mono audio toggle and captions for key game sounds.
   10. Photosensitivity-safe effects and an adjustable text backplate.
6. **Accessibility belongs in the tokens.** Package colours become semantic tokens with mode overrides, and symbols become tokens too. Text sizes, contrast floors, focus ring and motion durations are tokens with an "a11y" or reduced-motion mode. A palette check script (the one written for this report) runs in the prime-game-ui CI.

## 1. Colour blindness: the biggest risk

### 1.1 Method

- **Model.** [Machado, Oliveira and Fernandes (2009), "A Physiologically-based Model for Simulation of Color Vision Deficiency", IEEE TVCG 15(6)](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html). I used the matrices from the authors' table, copied exactly:
  - protanopia, deuteranopia and tritanopia at severity 1.0
  - protanomaly and deuteranomaly at severity 0.6, the milder and more common "weak" forms
- **Colour space.** The page does not say whether the matrices apply to linear or gamma-encoded RGB. I applied them in linear RGB: decode sRGB, multiply, clamp, re-encode. This is the common practice in open-source simulators (unconfirmed, from memory).
- **Distance.** CIEDE2000 (ΔE00, Sharma et al. 2005) in CIELAB under D65. The script checks itself against two published reference pairs (2.0425 and 1.0000) and stops if they fail. As a cross-check it also reports OKLab distance × 100.
- **"grey" row.** Luminance only: total colour blindness (rare), or what survives in very dark scenes. This row is for information only.
- **Input.** The placeholder floats from `content/tasks/delivery.tres` (checked live; same values as the brief), treated as sRGB 0..1.

**Thresholds** (my heuristic for separate, small, lit 3D objects, not side-by-side patches; no standard defines this):

- ΔE00 < 10: **confusable**
- 10 to 20: **weak**, needs redundancy
- 20 and up: comfortable

For scale, a ΔE00 of about 1 to 2 is a just-noticeable difference for patches side by side (unconfirmed, common rule of thumb).

### 1.2 Result: current placeholder palette

Simulated colours (sRGB hex) from `cvd-output.txt`:

| colour | normal | protan | deutan | tritan |
|---|---|---|---|---|
| red | #E61A1A | #645914 | #948303 | #FD001F |
| orange | #F2800D | #A28E00 | #BDA808 | #FF656D |
| yellow | #F2D91A | #EFD200 | #F6DC2F | #FFC8B9 |
| green | #26B333 | #B6A11E | #A79740 | #00AD99 |
| cyan | #1ACCD9 | #BBC3DA | #A3B1D9 | #00D5D0 |
| blue | #264DF2 | #006BF7 | #0058EF | #007B9A |
| purple | #8C33D9 | #0063DD | #0065D5 | #7D5E85 |
| pink | #F266B3 | #7789B5 | #9DA2AF | #FF6184 |
| brown | #804D1A | #5C5112 | #685D1A | #8C4142 |
| white | #F2F2F2 | #F2F2F2 | #F2F2F2 | #F2F2F2 |

Confusable pairs (ΔE00 < 10, OKLab×100 in brackets):

```
protan    red/brown 2.7 [2.7]; blue/purple 4.3 [4.4]; orange/green 6.2 [6.3]
deutan    blue/purple 6.0 [5.0]; red/green 7.7 [6.7]; orange/green 8.4 [7.0]; cyan/pink 9.9 [6.5]
tritan    orange/pink 7.1 [3.4]
protan06  blue/purple 4.3
deutan06  blue/purple 3.2
summary   normal min 13.3 (blue/purple) | protan 2.7 | deutan 6.0 | tritan 7.1 | protan06 4.3 | deutan06 3.2
```

Weak pairs (10 to 20) include:

- protan: yellow/green 14.0, blue/pink 14.6, cyan/white 14.6
- deutan: red/orange 12.5, orange/yellow 13.4
- tritan: green/cyan 12.0

**In plain words.** A protanope carrying the "red" package sees brown-olive. They cannot tell whether the brownish circle in front of them is the red one or the brown one. Blue and purple fail for nearly every kind of colour-blind player, even the mild ones. Even with normal vision, blue/purple (13.3) is the weakest pair. In the luminance-only row, green, orange and pink have almost the same brightness (0.7 to 1.8). Brightness alone cannot rescue them.

### 1.3 Result: known safe palettes, and how many colours are realistic

| palette | colours | normal min | protan | deutan | tritan |
|---|---|---|---|---|---|
| [Okabe-Ito](https://jfly.uni-koeln.de/color/) | 8 | 21.7 | 12.2 | 11.6 | 10.9 |
| [Tol bright](https://sronpersonalpages.nl/~pault/) | 7 | 20.5 | 14.2 | 14.8 | **8.6** (blue/green) |
| Tol muted | 9 | 15.0 | 11.8 | 14.3 | 11.5 |

Notes on the sources:

- **Okabe-Ito.** The page shows the palette only as an image. The hex values I used (#E69F00 orange, #56B4E9 sky blue, #009E73 bluish green, #F0E442 yellow, #0072B2 blue, #D55E00 vermillion, #CC79A7 reddish purple) are the widely reproduced ones, not read from the page (unconfirmed).
- **Paul Tol.** Hex values confirmed on his page, updated 16 August 2026. It states that the bright, vibrant and muted schemes are colour-blind safe, and for more than about 9 colours it points to other schemes ([source](https://sronpersonalpages.nl/~pault/)).

**Search for the most distinct set.** Pool: Okabe-Ito, Tol bright, vibrant and muted, plus white, black, pink and brown. Goal: the set whose minimum ΔE00 across normal, protan, deutan and tritan vision is largest (greedy pick, then swap improvement; nameable colours only):

| N | best min ΔE00 | set |
|---|---|---|
| 6 | 22.2 | white, black, green #117733, purple #AA3377, cyan #33BBEE, orange #E69F00 |
| 7 | 15.8 | + yellow, rose-red |
| 8 | 13.5 | white, black, green, purple, cyan, yellow, red #EE6677, indigo #332288 |
| 10 | 11.7 | the 8 above + wine #882255, pink #FFAABB |

When greys were allowed, the search filled the set with three greys, which is useless in a 3D lit scene. Colour coding saturates fast: **about 6 colours are comfortable by colour alone; 7 or 8 need care; 9 or 10 work only with symbols as the main cue for colour-blind players.**

### 1.4 Proposed safer palette (for discussion; the look is a human decision)

"Hand A": Okabe-Ito's 7 hues plus white, near-black and Tol's indigo, all with plain names a player can say over voice.

| name (EN / UK) | hex | symbol (example) |
|---|---|---|
| white / білий | #F2F2F2 | circle |
| black / чорний | #1E1E1E | square |
| yellow / жовтий | #F0E442 | triangle |
| orange / помаранчевий | #E69F00 | star |
| red / червоний | #D55E00 | plus |
| sky / блакитний | #56B4E9 | drop |
| blue / синій | #0072B2 | crescent |
| green / зелений | #009E73 | leaf / clover |
| pink / рожевий | #CC79A7 | heart |
| indigo / фіолетовий | #332288 | ring |

Script result:

- normal-vision minimum: 21.7, against 13.3 for the current palette
- protan 12.2, deutan 11.6, tritan 10.9
- protanomaly 15.0, deuteranomaly 12.8
- **zero confusable pairs in every simulation**

Ukrainian has separate basic words for light blue (блакитний) and blue (синій), so "sky" and "blue" are easy to say apart in Ukrainian voice chat. In English, "sky" versus "blue" needs the symbol.

**Caveats:**

1. "Red" here is vermillion (#D55E00). For a protanope it looks olive (#817100). It is distinct from the others only because the brown slot is gone.
2. Black packages vanish in shadow and white ones under bright light. The 3D objects need an emissive or unshaded symbol decal (§1.6).
3. "Hand B" (Tol vibrant hues) failed: red/green scored 7.9 for protanopes.

### 1.5 Redundancy: what to put on each thing

The rule from [XAG 103](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/103) and the Basic Game Accessibility Guideline "Ensure no essential information is conveyed by a fixed colour alone" ([GAG](https://gameaccessibilityguidelines.com/full-list/)): critical information carried by colour also needs shape, pattern, icon or a text label. If colour stays the main cue, players should get presets or free colour choice.

- **Symbols, not patterns.** Stripes, dots and hatching blur at distance and alias on low-poly faces. A bold silhouette survives mip-mapping (my judgement, unconfirmed). Use one symbol per colour, filled, with a thick dark-and-light double outline. XAG 102 cites For Honor's black-then-white outline as a way to stay readable on both dark and light backgrounds ([XAG 102](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/102)).
- **Rotation-safe set.** Packages are carried and rotated, so pairs that differ only by rotation are banned: square/diamond, plus/×, triangle up/down. ColorSym was designed to read the same from every side for the same reason ([BoardGameWire](https://boardgamewire.com/index.php/2026/07/06/designer-pair-launch-colorsym-giving-publishers-a-free-tool-for-colourblind-friendly-board-game-creation/)). Avoid:
  - circle/hexagon/octagon (they merge when small)
  - thin line icons
  - two symbols that differ only by a detail smaller than about 1/4 of the icon
- **Where it goes:**
  - **Package:** the symbol on every face, as a decal, emissive or unshaded so it reads in shadow.
  - **Delivery circle:** the symbol large in the centre of the floor ring, plus a small standing post or flag with the symbol, visible over a crowd.
  - **HUD swatch for a carried package:** symbol + colour name + swatch, for example "▲ Yellow → circle". At 1080p, glyphs must meet the text minimum and scale with text up to 200% ([XAG 101](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101)).
  - **On-screen marker over the destination:** the symbol inside the marker. There is only one marker (your own package), so it is already unambiguous; the symbol confirms the match.
  - **Tab task screen:** each package row shows symbol + name + state.
  - **Body colours:** show the colour name with the player name on the nameplate. Among Us added a "Colorblind Text" option (version 2022.6.21) that shows colour names over characters and in chat, because players refer to each other by colour ([Among Us wiki](https://among-us.fandom.com/wiki/Colors), unconfirmed: fan wiki; the official Innersloth help page returned 403). Our players will say "pink has the knife" over voice, so the name matters as much as the hue.
- **Licensing a symbol set:**
  - **ColorADD:** commercial use needs a paid licence; fees are not public ([Wikipedia](https://en.wikipedia.org/wiki/ColorADD), unconfirmed: secondary source).
  - **ColorSym (July 2026):** 11 colours (red, yellow, blue, black, white, orange, green, brown, violet, pink, grey; **no cyan**). Symbols are CC BY-SA 4.0 and the font OFL 1.1, per the [repo](https://github.com/luisfrancisco/colorsym); I did not open the licence file text itself. ShareAlike means our adapted symbols would also be BY-SA. Its combined-symbol logic (orange = red + yellow marks) takes learning.
  - **Recommendation:** draw 10 simple symbols ourselves (no licence question) and use ColorSym only as a reference.
- **Palette mode, not a filter.** Full-screen "daltonize" filters tint the whole world and every UI colour at once. XAG 103 instead recommends presets or free colour choice for the elements that carry meaning, and says simulation filters are a development tool, not a substitute for testing with colour-blind players. For a voice game there is one more constraint: **everyone must keep the same names.** A protan mode may change what "red" looks like on my screen, but the package stays "red ✚" for everyone. So:
  - modes swap only the token values
  - names and symbols never change
  - free colour pickers are not offered for packages, because they would break the shared vocabulary

## 2. Guidelines and the numbers we adopt

| Topic | Number | Source |
|---|---|---|
| Minimum text size, PC, 1080p | **18 px body height** (ascender to descender); 36 px at 4K. Console/TV: 26 px | [XAG 101](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101) (updated 2026-06-17) |
| GAG floor | 28 px at 1080p, from a 10-foot TV guideline, as "a minimum rather than a target" | [GAG](https://gameaccessibilityguidelines.com/use-an-easily-readable-default-font-size/) |
| Text scaling | Up to 200% without losing content; icons and glyphs scale with text | XAG 101 |
| Text blocks | Line width ≤ 80 characters, line spacing ≥ 1.5, sentence case available, left-aligned | XAG 101 |
| Contrast, standard text and important elements | **4.5:1** | [XAG 102](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/102) |
| Large text and large elements | **3:1**; "large" on PC = 36 px at 1080p | XAG 102 |
| Inactive or disabled text | 3:1 | XAG 102 |
| High-contrast mode | **7:1** for all UI | XAG 102 |
| Text over a changing background | Measure against the **lowest-contrast** area of the background; offer a solid backplate with adjustable opacity | XAG 102 |
| Non-text UI (swatches, icons, focus ring) | 3:1 against adjacent colours (WCAG 1.4.11) | [WCAG 2.2 Understanding 2.4.13](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) |
| Focus visibility | A visible focus indicator (2.4.7, AA). Target: at least the area of a **2 px perimeter** with a **3:1 change** between focused and unfocused (2.4.13, AAA) | WCAG 2.2 |
| Flashing | **No more than 3 flashes in any 1 s**; stricter for saturated red (2.3.1, Level A) | [WCAG 2.2 Understanding 2.3.1](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) |

**WCAG 3 and APCA in 2026.** WCAG 3.0 is still a W3C Working Draft (dated 10 September 2026). It says the contrast algorithm "is yet to be determined" and does not name APCA ([W3C](https://www.w3.org/TR/wcag-3.0/)). Secondary sources expect a Candidate Recommendation no earlier than about 2027 ([ADA Compliance Pros](https://www.adacompliancepros.com/blog/wcag-3-draft-status-procurement), unconfirmed). **Decision: the WCAG 2.x ratio is our gate. APCA may be reported for information only, never as a pass or fail.**

**APX (AbleGamers).** Twelve design patterns ([accessible.games](https://accessible.games/accessible-player-experiences/)). The ones that matter for us:

- **Distinguish This From That:** the colour work above.
- **Clear Text:** sizes, backplates.
- **Second Channel:** sound captions, the speaking indicator.
- **Same Controls But Different:** remapping.
- **Do More With Less:** toggles instead of holds.
- **Personal Interface** and **Flexible Displays:** UI scale, HUD opacity.
- **Leave It There:** the task screen must not vanish while the player reads it, which argues for a Tab toggle.

**Applied to prime-game's current theme.** Live read of `client/ui/theme/game_theme.tres` and `project.godot`:

- Font sizes are 15 (TaskDescription), 16 (DebugText), 18 (HudText, HudHint), 20, 24, 26, 28 and 40.
- `project.godot` sets `canvas_items` stretch with `expand` and no viewport size. The base canvas is therefore Godot's default, 1152×648 (unconfirmed for 4.7), and at 1080p every theme size is multiplied by about 1.67 (TaskDescription 15 becomes about 25 px on screen).
- Godot's `font_size` is the em size, not XAG's body height. For most fonts the body height is close to but not equal to the em size (unconfirmed, font-dependent).

**Recommendation.** The design system states all sizes in px at a **1920×1080 reference**. The token generator converts them to the Godot base canvas. The minimums at the reference:

- **body 20 px**
- **HUD key text 24 px**
- **nothing below 18 px**, including the task description and hints

**HUD backplate (computed in `contrast.js`).** White text over a black backplate, measured against a pure-white world pixel, the worst case:

| backplate opacity | contrast |
|---|---|
| 50% | 3.98:1 (fails) |
| 60% | 5.74:1 |
| 70% | 8.52:1 (passes the 7:1 high-contrast bar) |

Default to 70% and let players raise it to 100%. The current theme already uses 0.6 to 0.85 alpha panels. The script assumes Godot blends 2D in sRGB space (unconfirmed for every renderer).

**Swatch contrast.** No single panel colour gives all 10 package swatches 3:1:

- current palette: blue 2.83, purple 2.98 and brown 2.46 on a dark panel; yellow 1.28 and white 1.00 on a light one
- Hand A: black 1.04 and indigo 1.43 on dark

**Every swatch therefore needs a two-tone keyline** (an outer light ring and an inner dark ring). In Godot this is a `StyleBoxFlat` border plus `expand_margin_*`, or a nested panel. Both are inside the "Godot-safe" subset: `StyleBoxFlat` has `border_width_*`, `expand_margin_*`, `shadow_size` and `corner_radius_*` (confirmed in the API dump).

## 3. Settings to plan (top ten; deeper detail dropped by budget)

Every Godot member named here is confirmed in the 4.7.2 API dump (`api_check.js`). Behaviour notes not on a docs page are marked.

1. **UI scale and text size.** UI scale from 75% to 200%. For larger text, XAG allows scaling text down only at the player's discretion. GAG intermediate: "Allow interfaces to be resized". Godot: `Window.content_scale_factor` for the whole UI, and a separate text-size step through the theme's font sizes (`Theme.default_font_size`, type variations). Wireframe every screen at 100% and 200% from the start.
2. **Hold or toggle for every hold action.** GAG intermediate: "Avoid / provide alternatives to requiring buttons to be held down".
   - **Tab, task screen:** hold (default) or toggle. APX "Leave It There" favours a toggle for reading.
   - **G, give up while downed:** the hold is a safety against accidents. Offer "press twice within 2 s" instead of a toggle, and make the hold length adjustable.
   - **E, raise a downed player:** hold or "press once, keep raising while in range; move or press again to cancel".
   - **F, Ready in the lobby:** already a press.
   - Show a progress ring for every hold. It is a component, so it gets a reduced-motion variant.
3. **Full key and mouse remapping.** GAG basic: "Allow controls to be remapped / reconfigured". Godot: `InputMap.action_erase_events` and `InputMap.action_add_event`, saved to `user://`. The key-hint UI must read the live binding, never hard-code "E" or "Tab". This touches every HUD hint and the role screen (#175).
4. **Colour-vision palette mode.** Options: Default / Red-green / Blue-yellow / High contrast. Symbols and colour names are always on, not a setting. Also an optional "colour names on nameplates" (the Among Us precedent), or always on, which is a human call.
5. **Reduced motion.** Shortens or removes UI tweens, bounces, slides and camera shake, and replaces them with crossfades or instant changes. Default the setting from the OS hint `DisplayServer.accessibility_should_reduce_animation()`; it exists in the dump, but its Windows support is not stated on the docs page I read (unconfirmed). Godot: `Tween.set_speed_scale`, or zero-duration tokens.
6. **First-person comfort.**
   - **FOV slider.** GAG basic: an appropriate default FOV; intermediate: let players adjust it. Godot: `Camera3D.fov`. Godot's default is about 75° vertical (unconfirmed default value).
   - **Head-bob off.**
   - **No camera shake** on being struck or downed; use a vignette or edge flash under the flash limits.
   - **An optional always-on centre dot**, which some players use against motion sickness (unconfirmed claim).
7. **Crosshair options:** style (dot, cross, circle), colour, size, outline. GAG: "Provide a choice of cursor / crosshair colours / designs", linked from XAG 103. The crosshair can sit over any colour, so the default must be two-tone (light with a dark outline).
8. **Voice chat for deaf and hard-of-hearing players.**
   - A **visual "who is talking" indicator**: a speaker glyph or ring over the talking player's head, plus an off-screen edge arrow for voices you can hear but not see. GAG intermediate: "Provide a visual indication of who is currently speaking". XAG 103 shows Forza's speaker icon with the speaker's name.
   - Per-player volume and mute.
   - The privacy rule still holds: the indicator shows only what is audible to you; it reveals nothing about roles.
   - Speech-to-text captions of voice chat need a speech-recognition dependency Godot does not have built in. Park this as a later research item (unconfirmed feasibility).
9. **Audio.**
   - **Mono toggle.** GAG intermediate: "Provide a stereo/mono toggle". Godot: `AudioEffectStereoEnhance.pan_pullout = 0` on the Master bus "will downmix stereo to mono" ([Godot 4.7 docs](https://docs.godotengine.org/en/4.7/classes/class_audioeffectstereoenhance.html)). Proximity voice still fades with distance; only left and right are lost.
   - **Captions for key game sounds:** a knife strike, a player downed nearby, a package placed, the timer warning, the round end. GAG basic: subtitles for important speech; XAG 103: important audio needs a second channel.
10. **Photosensitivity and the text backplate.**
    - No effect may flash more than 3 times per second, and no full-screen red flash when downed (WCAG 2.3.1; GAG basic "Avoid flickering images and repetitive patterns").
    - A "reduce flashing" switch.
    - HUD backplate opacity from 70% (default) to 100%.
    - A high-contrast mode at 7:1, which can default from `DisplayServer.accessibility_should_increase_contrast()` (platform support unconfirmed).

Dropped by budget, worth a later pass:

- text-to-speech for menus (`DisplayServer.tts_speak` exists)
- screen-reader support (the dump has 85 `accessibility_*`/`tts_*` members on `DisplayServer`)
- dyslexia-friendly font option, adjustable mouse sensitivity, a first-launch tutorial or practice sandbox (GAG basic: "Include interactive tutorials")

## 4. Accessibility as tokens and modes

Make accessibility a property of the design system, not a later patch.

- **Semantic colour tokens.**
  - Package colours: `color.package.red`, `color.package.sky` … ; body colours: `color.body.*`.
  - Each has `name.en`, `name.uk` and a `symbol` token (an asset reference to our own SVG).
  - Modes: `default`, `cvd-red-green`, `cvd-blue-yellow`, `high-contrast`. A mode overrides only the colour values; names and symbols are the same in every mode.
  - DTCG itself has no "mode" field in the format I know of. Use one base file plus a small override file per mode, merged by the generator (unconfirmed; lens 3 owns the DTCG details).
- **Floors as tokens.**
  - `a11y.text.min` = 18, `text.body` = 20, `text.hud` = 24, all in px at the 1920×1080 reference
  - `a11y.contrast.text` = 4.5, `a11y.contrast.large` = 3, `a11y.contrast.nonText` = 3, `a11y.contrast.high` = 7
  - The check script reads these values, so the gate and the design share one number.
- **Component tokens with a11y variants.**
  - `focus.ring.width` = 3 px at the reference (above the 2 px floor, because the game is played at desk distance with motion), `focus.ring.color` with a contrast check. Godot's `Button` has a `focus` StyleBox drawn over the base box, "an outline or an underline works well" ([Godot docs](https://docs.godotengine.org/en/4.7/classes/class_button.html)).
  - `backplate.opacity` = 0.7, minimum 0.6
  - `swatch.keyline.outer` and `swatch.keyline.inner`
  - `hold.progress` ring
  - `speaking.indicator`
- **Motion tokens with a reduced mode:** `motion.duration.fast/normal/slow`, `motion.shake.amplitude`, `motion.bounce`. Reduced mode sets durations to 0 or a short crossfade and shake to 0.
- **Scale tokens:** `ui.scale` 0.75 to 2.0 and `text.scale`. Every wireframe is reviewed at 1.0 and 2.0.
- **Automated gates in prime-game-ui CI** (node, no download), extended from the scripts above:
  1. Package and body palettes, every mode: minimum ΔE00 ≥ 10 under protan, deutan and tritan; ≥ 20 in normal vision; report weak pairs.
  2. Every text/background token pair ≥ 4.5:1 (3:1 for large); every swatch-on-panel pair passes through its keyline.
  3. Every coloured component spec has a symbol or text field, so colour is never the only cue.

The gates are an early warning. XAG 103 is explicit that simulation is no substitute for testing with real colour-blind players.

## 5. Risks

- **Lighting changes the colours.** The script checks flat sRGB values; a lit, shadowed low-poly box is darker and tinted. Make symbols and circles emissive or unshaded, and run simulated screenshots of the real level, made later with `tools\run.cmd shot` by the engineer, through the same matrices.
- **Simulation is not people.** Recruit two or three colour-blind playtesters. With about 1 in 12 men affected, they are likely in the friend circle.
- **Palette modes could break the shared vocabulary in voice.** Names and symbols are mode-invariant; no free pickers for packages.
- **Unit mismatch.** Sizes are stated at the 1080p reference and the generator owns the conversion. Godot's base canvas and em-based `font_size` differ from XAG's "body height at 1080p".
- **Scope creep in settings.** Ship the top ten in stages: remap, UI scale, hold/toggle and the colour mode first. The design system must reserve the screen space (an Accessibility tab in the Esc menu, #169) now.
- **Licence traps.** ColorADD is paid. ColorSym symbols are ShareAlike. Draw our own.

## Sources

- Machado, Oliveira, Fernandes 2009, matrices table: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
- NEI, colour blindness (1 in 12 men, red-green most common): https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness
- Paul Tol, colour schemes (updated 16 Aug 2026): https://sronpersonalpages.nl/~pault/
- Okabe and Ito, Color Universal Design: https://jfly.uni-koeln.de/color/
- Xbox Accessibility Guidelines 101 (text), 102 (contrast), 103 (additional channels, colour blindness): https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101 , /102 , /103
- Game Accessibility Guidelines, full list and the font-size guideline: https://gameaccessibilityguidelines.com/full-list/ , https://gameaccessibilityguidelines.com/use-an-easily-readable-default-font-size/
- AbleGamers APX patterns: https://accessible.games/accessible-player-experiences/
- WCAG 2.2 Understanding 2.4.13 Focus Appearance: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- WCAG 2.2 Understanding 2.3.1 Three Flashes: https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
- WCAG 3.0 Working Draft (10 Sep 2026): https://www.w3.org/TR/wcag-3.0/
- WCAG 3 timeline commentary (secondary): https://www.adacompliancepros.com/blog/wcag-3-draft-status-procurement
- ColorSym: https://github.com/luisfrancisco/colorsym , https://boardgamewire.com/index.php/2026/07/06/designer-pair-launch-colorsym-giving-publishers-a-free-tool-for-colourblind-friendly-board-game-creation/
- ColorADD (secondary): https://en.wikipedia.org/wiki/ColorADD
- Among Us colours and Colorblind Text (fan wiki): https://among-us.fandom.com/wiki/Colors
- Godot 4.7 docs: AudioEffectStereoEnhance https://docs.godotengine.org/en/4.7/classes/class_audioeffectstereoenhance.html ; Button https://docs.godotengine.org/en/4.7/classes/class_button.html ; DisplayServer https://docs.godotengine.org/en/4.7/classes/class_displayserver.html
- Godot 4.7.2 API dump: `D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json`
