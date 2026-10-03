# Gap G3: verifying the remaining high-stakes claims

Read-only check of the claims that the synthesis rests on but had marked "(unconfirmed)". Date: 2026-10-02.
Method: WebFetch of raw licence and metadata files on GitHub and of official pages; a node script over the
Godot 4.7.2 API dump `D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json` (this dump includes the class
reference descriptions, which are what docs.godotengine.org/en/4.7 renders). Nothing was downloaded, Godot was not
started. WebFetch returns a summary from a small model, so "quoted" text below is as that model reported it. Where
that matters (licence wording, code), I say so.

## Verdict table

| # | Claim | Verdict |
|---|---|---|
| 1 | The 10 fonts in the pairings are OFL and have Cyrillic | **Holds.** All 10 are OFL and list `cyrillic`; 9 of 10 also list `cyrillic-ext` (Dela Gothic One does not). **Comfortaa has a Reserved Font Name**; the other 9 do not |
| 2 | Tabler is MIT; Lucide is a permissive licence | **Holds, with a detail.** Tabler: MIT. Lucide: ISC **plus** MIT for icons derived from Feather (two notices to keep) |
| 3 | Kenney UI Audio is CC0 | **Holds on the page; the zip's own licence file is still unconfirmed** (reading it needs a download) |
| 4a | Reduced motion and high contrast can default from `DisplayServer` hints on Windows | **Holds.** The 4.7.2 class reference names Windows for both |
| 4b | A hard "sticker" shadow is impossible in StyleBoxFlat, use thicker borders | **Wrong as stated.** `shadow_size` 0 draws nothing (holds), but `shadow_size` 1 with an offset draws a solid copy of the box with a 1 px soft edge: a near-hard sticker shadow (from the 4.7.2 source; not rendered) |
| 4c | `border_blend`, `expand_margin_*` | Confirmed: blend fades the border into the background; expand margins draw outside the control and do not grow the click area |
| 5 | Okabe-Ito hexes behind "Hand A" | **Still unconfirmed from a primary source.** The authors' page shows the values only as an image; secondary sources agree on the hexes |
| 6 | ColorSym licence | **Dual: CC BY-SA 4.0 and OFL 1.1** (repo page); which part is under which licence is unconfirmed |
| 7 | Godot 4.7 imports WOFF2 fonts | **Holds** (4.7.2 class reference) |

## 1. Google Fonts: licence, subsets, Reserved Font Name

Sources: `METADATA.pb` and `OFL.txt` at `raw.githubusercontent.com/google/fonts/main/ofl/<family>/`. All ten
`METADATA.pb` files say `license: "OFL"`.

| Family | Subsets (Cyrillic part) | Files | Copyright line (OFL.txt) | RFN |
|---|---|---|---|---|
| [Onest](https://raw.githubusercontent.com/google/fonts/main/ofl/onest/METADATA.pb) | cyrillic, cyrillic-ext | `Onest[wght].ttf` (variable) | Copyright 2021 The Onest Project Authors (github.com/googlefonts/onest) | none |
| [Dela Gothic One](https://raw.githubusercontent.com/google/fonts/main/ofl/delagothicone/METADATA.pb) | **cyrillic only** (no cyrillic-ext) | `DelaGothicOne-Regular.ttf` | Copyright 2020 The Dela Gothic Project Authors (github.com/syakuzen/DelaGothic) | none |
| [Pangolin](https://raw.githubusercontent.com/google/fonts/main/ofl/pangolin/METADATA.pb) | cyrillic, cyrillic-ext | `Pangolin-Regular.ttf` | Copyright 2016 The Pangolin Project Authors (github.com/googlefonts/pangolin) | none |
| [Rubik Bubbles](https://raw.githubusercontent.com/google/fonts/main/ofl/rubikbubbles/METADATA.pb) | cyrillic, cyrillic-ext | `RubikBubbles-Regular.ttf` | Copyright 2020 The Rubik Filtered Project Authors (the URL is written `https://https://github.com/NaN-xyz/Rubik-Filtered`) | none |
| [Rubik Mono One](https://raw.githubusercontent.com/google/fonts/main/ofl/rubikmonoone/METADATA.pb) | cyrillic, cyrillic-ext | `RubikMonoOne-Regular.ttf` | Copyright 2015 The Rubik Project Authors (mail@hubertfischer.com) | none |
| [Comfortaa](https://raw.githubusercontent.com/google/fonts/main/ofl/comfortaa/METADATA.pb) | cyrillic, cyrillic-ext | `Comfortaa[wght].ttf` | Copyright 2011 The Comfortaa Project Authors (github.com/alexeiva/comfortaa), **with Reserved Font Name "Comfortaa"** | **yes** |
| [Tektur](https://raw.githubusercontent.com/google/fonts/main/ofl/tektur/METADATA.pb) | cyrillic, cyrillic-ext | `Tektur[wdth,wght].ttf` | Copyright 2023 The Tektur Project Authors (github.com/hyvyys/Tektur) | none |
| [Oswald](https://raw.githubusercontent.com/google/fonts/main/ofl/oswald/METADATA.pb) | cyrillic, cyrillic-ext | `Oswald[wght].ttf` | Copyright 2016 The Oswald Project Authors (github.com/googlefonts/OswaldFont) | none |
| [Climate Crisis](https://raw.githubusercontent.com/google/fonts/main/ofl/climatecrisis/METADATA.pb) | cyrillic, cyrillic-ext | `ClimateCrisis[YEAR].ttf` (a "year" axis) | Copyright 2020 The Climate Crisis Project Authors (github.com/dancoull/ClimateCrisis) | none |
| [Balsamiq Sans](https://raw.githubusercontent.com/google/fonts/main/ofl/balsamiqsans/METADATA.pb) | cyrillic, cyrillic-ext | Regular, Italic, Bold, BoldItalic | Copyright 2011 The Balsamiq Sans Project Authors (github.com/balsamiq/balsamiqsans) | none |

OFL.txt sources: the same folders, file `OFL.txt` (e.g.
[comfortaa/OFL.txt](https://raw.githubusercontent.com/google/fonts/main/ofl/comfortaa/OFL.txt),
[onest/OFL.txt](https://raw.githubusercontent.com/google/fonts/main/ofl/onest/OFL.txt)).

What this means for us:

- **Ukrainian letters.** і ї є (U+0456, U+0457, U+0454) and ґ (U+0491) are in the basic Cyrillic block. Google's
  `cyrillic` subset is defined to cover U+0400 to U+045F plus U+0490 to U+0491 (from memory of the Google Fonts CSS
  `unicode-range`; unconfirmed in this run). So Dela Gothic One's missing `cyrillic-ext` should not matter for
  Ukrainian, but this is a subset label, not a per-glyph check (unconfirmed).
- **The apostrophe ʼ (U+02BC)** sits in Google's `latin` range, not in `cyrillic` (unconfirmed, memory). No font
  above was checked glyph by glyph. Recommendation: the first page of the UI repo's type showcase renders a test
  line with і ї є ґ Ґ ʼ ’ and № in every candidate, and later the Godot port checks the same string against the font
  (a `Font` coverage method; not checked in the dump this run, unconfirmed).
- **Comfortaa's Reserved Font Name.** Under OFL 1.1, a Modified Version may not use a Reserved Font Name. If we ever
  subset or edit Comfortaa (e.g. to trim file size), we would have to rename it. Whether a pure format conversion
  (TTF to WOFF2) counts as modification is discussed in the OFL FAQ, which I did not open (unconfirmed). Simplest rule:
  ship every font as the original, unmodified TTF from google/fonts, in both repos. The other nine have no RFN.
- **Credits:** each `docs/credits/` entry should carry the copyright line exactly as written, including the
  Rubik Bubbles "Rubik Filtered" name and its doubled `https://`.

## 2. Icon licences

- **Tabler Icons:** [LICENSE](https://raw.githubusercontent.com/tabler/tabler-icons/main/LICENSE) is the MIT License,
  "Copyright (c) 2020-2026 Paweł Kuna". Holds.
- **Lucide:** [LICENSE](https://raw.githubusercontent.com/lucide-icons/lucide/main/LICENSE) holds **two** sections:
  the ISC License, "Copyright (c) 2026 Lucide Icons and Contributors", and the MIT License, "Copyright (c)
  2013-present Cole Bemis", which the file says applies to icons derived from Feather (about 150 named icons listed).
  Any credit entry for Lucide must keep both notices. Both licences are permissive and fine for a commercial game.
- Phosphor (named next to Tabler in the synthesis) was not checked in this run (unconfirmed).

## 3. Kenney UI Audio

The [asset page](https://kenney.nl/assets/ui-audio) states the licence as "Creative Commons CC0" and lists 50 files;
the fetched content did not show the audio format. CC0 needs no attribution. The licence text inside the zip was not
read (that would need a download, which needs the human's permission). Recommendation: when the human approves the
download batch, open `License.txt` in the zip before committing it and record both the page URL and the file's
wording in `docs/credits/`.

## 4. Godot 4.7.2 (API dump, the engine's own class reference)

### DisplayServer accessibility hints

All three exist in 4.7.2 and return `int` (1 yes, 0 no, -1 unknown):

- `accessibility_should_reduce_animation()`: 1 if flashing, blinking and other moving content that can cause
  seizures should be disabled. **Note: implemented on macOS and Windows.**
- `accessibility_should_increase_contrast()`: 1 if a high-contrast theme should be used. **Note: implemented on
  Linux (X11/Wayland, GNOME), macOS, and Windows.**
- `accessibility_should_reduce_transparency()` (a bonus): implemented on macOS and Windows.

Rendered page: [DisplayServer (4.7)](https://docs.godotengine.org/en/4.7/classes/class_displayserver.html) (I read
the dump, not the page). The plan "default from the OS hint" holds for our Windows target. Two details for the
design: treat -1 as "off", and the wording of the reduce-animation hint is about seizure-risk motion, so the
in-game "Reduce motion" switch should stay a player setting that the hint only pre-fills. Which Windows setting
feeds each hint is not stated (unconfirmed).

### StyleBoxFlat shadow: a hard "sticker" shadow is possible

The dump says `shadow_color` "has no effect if shadow_size is lower than 1"; `shadow_offset` moves the shadow
relative to the box. The source at the
[4.7.2-stable tag](https://raw.githubusercontent.com/godotengine/godot/4.7.2-stable/scene/resources/style_box_flat.cpp)
(read through WebFetch) shows how it is drawn:

```cpp
bool draw_shadow = (shadow_size > 0);
...
Rect2 shadow_inner_rect = style_rect;  shadow_inner_rect.position += shadow_offset;
Rect2 shadow_rect = style_rect.grow(shadow_size);  shadow_rect.position += shadow_offset;
// a ring from shadow_color to transparent between the two rects, then, only if draw_center:
// the inner rect filled solid with shadow_color
```

So:

- `shadow_size = 0` draws nothing, whatever the offset (the synthesis guess holds).
- `shadow_size = 1` with `shadow_offset = (4, 4)` and `draw_center = true` draws a **solid copy of the box shape,
  offset 4 px, with only a 1 px fade at its edge**. That is a near-hard sticker shadow, and it follows corner radius
  and skew. The CSS twin for the mockups is `box-shadow: 4px 4px 0 <colour>` (the 1 px feather is the only
  difference). **Correction to the synthesis:** the Godot-safe table row "hard offset shadow: write it as thicker
  right and bottom borders" should become "`shadow_size` 1 plus `shadow_offset`; allowed in mockups as a
  zero-blur offset `box-shadow`". Caveats: with `draw_center = false` only the 1 px ring is drawn (a hollow shadow);
  a semi-transparent `bg_color` will show the solid shadow through it. This comes from reading code, not from a
  render; the port task in prime-game should confirm it with `tools\run.cmd shot` (unconfirmed visually).
- Still only one shadow per stylebox; no inner shadow, no gradient fill.

### border_blend and expand_margin

- `border_blend`: "If true, the border will fade into the background color" (dump). In the source it applies only
  when a border is drawn. A thick blended border is the one gradient-like effect StyleBoxFlat has; it can stand in
  for a soft inner glow, but it has no exact CSS twin, so keep it out of the mockup subset unless the showcase
  compares it side by side (unconfirmed visually).
- `expand_margin_left/top/right/bottom`: "Expands the stylebox outside of the control rect", useful with a border to
  draw a border outside the control; unlike content margins it does **not** change the clickable area (dump). This is
  the right tool for a focus ring outside a button: a focus stylebox with `draw_center = false`, a 3 px border and
  4 px expand margins. CSS twin: `outline` with `outline-offset`, or a second element; both map to this. That
  Button draws a separate `focus` stylebox over the normal one is from memory (unconfirmed in this run).

## 5. Okabe-Ito hexes

The authors' page, [Color Universal Design by Masataka Okabe and Kei Ito](https://jfly.uni-koeln.de/color/)
(last modified 2008-09-24 per the page), presents the eight-colour palette as an image (its Fig. 16); the text gives
no numeric values that a fetch can read. The hexes widely quoted are black `#000000`, orange `#E69F00`, sky blue
`#56B4E9`, bluish green `#009E73`, yellow `#F0E442`, blue `#0072B2`, vermillion `#D55E00`, reddish purple
`#CC79A7`. Five of these appeared in search results from secondary sites (e.g.
[scifig.ai](https://scifig.ai/blog/okabe-ito-color-palette-hex-codes)); yellow and blue are from memory. An attempt to
read R's `grDevices` source (which ships an "Okabe-Ito" palette) hit a wrong path (404). **Status: unconfirmed from a
primary text source**, consistent across secondary sources. Risk is low: these are colour values, not an asset; Hand
A is judged by our own computed simulations anyway. The palette page in the UI repo should cite the jfly page and say
the values were transcribed from secondary sources.

## 6. ColorSym

The [repository page](https://github.com/luisfrancisco/colorsym) shows two licences in its sidebar, CC-BY-SA-4.0 and
OFL-1.1, with files `LICENSE.txt` and `LICENSE_OFL.txt`; the README says it is free for commercial and non-commercial
use and asks for credit, under share-alike terms; authors Chris Eastridge and Luis Francisco. I did not open the two
licence files, so which part (font vs symbol artwork) is under which licence is unconfirmed. Practical effect: if we
adapt ColorSym symbols, the adapted symbols would be CC BY-SA too (share-alike). That supports the synthesis line
"draw our own symbols"; ColorSym stays a reference, or an unmodified, credited asset if the humans choose it.

## 7. WOFF2 in Godot 4.7

Confirmed in the dump: `ResourceImporterDynamicFont` "Imports a TTF, TTC, OTF, OTC, WOFF or WOFF2 font file", and
`FontFile.load_dynamic_font()` loads `.woff2`. The same class reference advises using the format the font's
developer ships. Google Fonts ships TTF (the file names above), so the recommendation is: commit the original TTF
once and use it in both the HTML mockups (`@font-face` accepts TTF) and the later Godot theme. That also sidesteps
the Comfortaa RFN question. Rendered page:
[ResourceImporterDynamicFont (4.7)](https://docs.godotengine.org/en/4.7/classes/class_resourceimporterdynamicfont.html)
(not opened; the dump is its source).

## Corrections to the synthesis

1. Godot-safe CSS table: the hard offset shadow is a StyleBoxFlat shadow with `shadow_size` 1 and an offset, not
   "thicker borders" (needs `draw_center` true; visual check pending).
2. `accessibility_should_increase_contrast()` and `accessibility_should_reduce_animation()` are implemented on
   Windows in 4.7.2; drop "(platform support unconfirmed)".
3. Lucide is ISC plus MIT (Feather-derived icons); keep both notices.
4. Comfortaa carries the Reserved Font Name "Comfortaa": ship it unmodified or rename a modified copy.
5. Dela Gothic One has `cyrillic` but not `cyrillic-ext` (fine for Ukrainian by the subset definition, unconfirmed
   per glyph).
6. ColorSym is CC BY-SA 4.0 plus OFL 1.1, share-alike.

## Gaps left

- Kenney UI Audio `License.txt` inside the zip (needs a permitted download).
- Per-glyph coverage of і ї є ґ ʼ in each font (needs the fonts; do it in the showcase after the download batch).
- Okabe-Ito values from a primary text source (Wong 2011 in Nature Methods, or R's grDevices source at its real path).
- The OFL FAQ on whether format conversion is modification; ColorSym's licence files; Phosphor's licence.
- A render of the `shadow_size` 1 sticker shadow and of a blended border (engine task, `shot`).
