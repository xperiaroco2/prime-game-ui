# Lens 4: Typography and icons (prime-game UX/UI track, wave 1)

Date: 2026-10-02. Author: research agent, lens 4 of 6. Read-only research; nothing was downloaded.

How facts were checked. Font metadata and licence headers were read with read-only `gh api` calls against
[github.com/google/fonts](https://github.com/google/fonts) (`METADATA.pb`, `OFL.txt`, `DESCRIPTION.en_us.html`) and
against each icon set's repository; nothing was saved. Godot classes and properties were checked in
`D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json` with a small node script, and behaviour in the 4.7 docs.
"(unconfirmed)" marks anything not stated by a primary source I opened.

**Bottom line**

- Every Google Fonts candidate checked is SIL OFL 1.1 and is listed in Google's `cyrillic` subset. That subset's
  definition includes і ї є ґ and their capitals, and the `latin` subset includes ʼ (U+02BC). But a subset tag only
  says the family is listed there; it does not prove that each glyph is in each file. So we add a glyph check before
  we adopt any font.
- Remove two candidates: **Russo One** (its designer says the name means "Russian", and the name is a Reserved Font
  Name) and **e-Ukraine** (the official page gives no licence for the font itself, and it is the Diia state brand).
  **Kenney Fonts** are CC0, but I could not confirm Cyrillic support.
- Godot 4.7.2 can do more text effects than the CSS subset assumed so far. `LabelSettings` has **stacked outlines
  and stacked shadows**. So the "sticker" title look (several outlines plus a drop shadow) is Godot-safe.
- The game's base viewport is Godot's default 1152×648, scaled by `canvas_items`. A theme `font_size` of 18 is
  therefore about 30 physical px at 1080p. Tokens should use a fixed reference frame: 1920×1080 is recommended.
- Icons: use one MIT set (Phosphor or Tabler) for system icons and draw our own SVGs for the 15 to 25 signature game
  icons. Draw key prompts as a keycap component, not as images. Keep CC BY sets (game-icons.net, Font Awesome
  Free) as a fallback, because each icon then needs credit to its author.

---

## 1. Fonts: candidates, licences, Ukrainian coverage

### 1.1 What the licences require

- **SIL OFL 1.1** (all Google Fonts candidates and Fixel). From the [OFL FAQ](https://openfontlicense.org/ofl-faq/):
  - Fonts may be bundled with commercial software. The FAQ names "games and entertainment software" explicitly.
  - The copyright statement, the licence notice and the licence text must ship with the font. The FAQ suggests an
    About or credits mention with a link as good practice.
  - The font may not be sold by itself.
  - Sharing the full font package with its notices is allowed, so a public repo is fine.
  - Rendered output (screenshots, the game's pixels) needs no attribution.
  - Subsetting or removing parts of a font counts as a **Modified Version**. A Modified Version may not use the
    font's **Reserved Font Name (RFN)**. So never subset an RFN font, or rename it if we do.
- **CC0** (Kenney): no conditions.
- **CC BY 3.0 / 4.0** (game-icons.net, Font Awesome Free SVGs, the e-Ukraine site footer). The
  [CC BY 4.0 deed](https://creativecommons.org/licenses/by/4.0/) allows commercial use and adaptation. In return you
  must credit the author, link the licence and say whether you changed the work.
- **MIT / ISC** (Tabler, Phosphor, Iconoir, Lucide): the copyright and permission notice must ship with copies.
- **Apache 2.0** (Material Symbols): ship the licence text. The repo root has no NOTICE file (I checked the listing
  of [google/material-design-icons](https://github.com/google/material-design-icons)). I did not re-read the full
  Apache text in this session (unconfirmed detail).
- **Ubuntu Font Licence**: no candidate here uses it, so I did not research it.

### 1.2 The Ukrainian check

Google's subset definition files in
[googlefonts/nam-files `cyrillic_unique-glyphs.nam`](https://github.com/googlefonts/nam-files/tree/main/Lib/gfsubsets/data)
list U+0404/0454 (Є є), U+0406/0456 (І і), U+0407/0457 (Ї ї), U+0490/0491 (Ґ ґ) and U+2116 (№). The `latin` file
lists U+02BC (ʼ, modifier letter apostrophe). Each family's `METADATA.pb` then says which subsets it is listed in.

So "Cyrillic: subset" in the table below means the family is listed in Google's `cyrillic` subset, whose definition
contains every Ukrainian letter. **Glyph-level presence in the actual file is unconfirmed until a cmap check runs.**
That check is a recommended issue (§5).

### 1.3 Candidate table

V = variable (axis in the file name), S = static weights. Licence = link to the licence file in google/fonts unless
stated otherwise.

| Font | Roles | Cyrillic (how verified) | Licence | V/S | Notes |
|---|---|---|---|---|---|
| [Unbounded](https://github.com/google/fonts/tree/main/ofl/unbounded) | Loud display, titles, role screen | Subset: cyrillic and cyrillic-ext (METADATA) | [OFL](https://github.com/google/fonts/blob/main/ofl/unbounded/OFL.txt), no RFN | V `wght` | Very wide. Light to Black, Latin and Cyrillic, 1300+ glyphs (DESCRIPTION). Width will overflow with long Ukrainian strings |
| [Dela Gothic One](https://github.com/google/fonts/tree/main/ofl/delagothicone) | Poster display | Subset: cyrillic only, **no cyrillic-ext** (METADATA) | [OFL](https://github.com/google/fonts/blob/main/ofl/delagothicone/OFL.txt), no RFN | S (1 weight) | "Flat, very thick" (DESCRIPTION). Ukrainian letters are in the basic subset, but this font especially needs the ґ glyph check |
| [Climate Crisis](https://github.com/google/fonts/tree/main/ofl/climatecrisis) | Gimmick display (timer, end screen) | Subset: cyrillic and cyrillic-ext | [OFL](https://github.com/google/fonts/blob/main/ofl/climatecrisis/OFL.txt), no RFN | V `YEAR` axis | Has a `YEAR` axis that "melts" the letters (name from file; the melting effect is unconfirmed). Climate-themed origin (unconfirmed) |
| [Rubik](https://github.com/google/fonts/tree/main/ofl/rubik) | Friendly UI, body | Subset: cyrillic and cyrillic-ext | [OFL](https://github.com/google/fonts/blob/main/ofl/rubik/OFL.txt), no RFN | V `wght` and italic | Slightly rounded corners (DESCRIPTION) |
| [Rubik Mono One](https://github.com/google/fonts/tree/main/ofl/rubikmonoone) | Timers, counters | Subset: cyrillic and cyrillic-ext | OFL, no RFN | S | Monospaced Black Rubik (Rubik DESCRIPTION), so digits never jitter |
| [Rubik Bubbles](https://github.com/google/fonts/tree/main/ofl/rubikbubbles) / [Doodle Shadow](https://github.com/google/fonts/tree/main/ofl/rubikdoodleshadow) / [Wet Paint](https://github.com/google/fonts/tree/main/ofl/rubikwetpaint) | Cringe-fun shout moments (end screen, "YOU DIED") | Subset: cyrillic and cyrillic-ext (each) | OFL, no RFN | S | Rubik Filtered family by NaN. Use for one or two words only |
| [Nunito](https://github.com/google/fonts/tree/main/ofl/nunito) | Friendly rounded UI, and display at Black | Subset: cyrillic and cyrillic-ext | [OFL](https://github.com/google/fonts/blob/main/ofl/nunito/OFL.txt), no RFN | V `wght` and italic | Rounded terminals. One family can cover display and body |
| [Comfortaa](https://github.com/google/fonts/tree/main/ofl/comfortaa) | Rounded display | Subset: cyrillic and cyrillic-ext | [OFL](https://github.com/google/fonts/blob/main/ofl/comfortaa/OFL.txt), **RFN "Comfortaa"** | V `wght` | Geometric rounded. RFN: never subset it |
| [Montserrat Alternates](https://github.com/google/fonts/tree/main/ofl/montserratalternates) | Quirky display | Subset: cyrillic and cyrillic-ext | OFL, no RFN | S (18 files) | 18 static files make repo and credits heavier. Plain [Montserrat](https://github.com/google/fonts/tree/main/ofl/montserrat) is V `wght` |
| [Balsamiq Sans](https://github.com/google/fonts/tree/main/ofl/balsamiqsans) | Hand-drawn; **wireframe font** | Subset: cyrillic and cyrillic-ext; DESCRIPTION states Cyrillic | OFL, no RFN | S (4) | Made for Balsamiq wireframes (DESCRIPTION). Ideal for the wireframe phase: it says "not final" |
| [Onest](https://github.com/google/fonts/tree/main/ofl/onest) | Readable UI and body | Subset: cyrillic and cyrillic-ext | [OFL](https://github.com/google/fonts/blob/main/ofl/onest/OFL.txt), no RFN | V `wght` | Clean grotesque. Pairs with a loud display face |
| [Golos Text](https://github.com/google/fonts/tree/main/ofl/golostext) | Readable UI and body | Subset: cyrillic and cyrillic-ext | OFL, no RFN | V `wght` | Made "for continuous reading on screen" (DESCRIPTION) |
| [Inter](https://github.com/google/fonts/tree/main/ofl/inter) | UI, numbers | Subset: cyrillic and cyrillic-ext; [rsms.me/inter](https://rsms.me/inter/) lists the Ukrainian І | [OFL](https://github.com/google/fonts/blob/main/ofl/inter/OFL.txt), no RFN | V `opsz` and `wght` | **`tnum`, `case`, `zero` confirmed** on rsms.me. The safest choice for numbers. Neutral in look |
| [Manrope](https://github.com/google/fonts/tree/main/ofl/manrope) | UI | Subset: cyrillic and cyrillic-ext | OFL, no RFN | V `wght` | Semi-geometric |
| [Fixel](https://github.com/MacPaw/Fixel) (MacPaw) | UI (Text) and display (Display) | README: Latin and Cyrillic for 40+ languages, Ukrainian stated, includes the tryzub sign ([repo](https://github.com/MacPaw/Fixel)) | [OFL 1.1](https://github.com/MacPaw/Fixel/blob/main/OFL.txt) (header read: © 2023 MacPaw Way Ltd.), no RFN in header | 9 weights × 2 widths. Variable: unconfirmed | Made in Ukraine. Not confirmed to be on Google Fonts, so mockups would have to self-host it (a download batch) |
| [Oswald](https://github.com/google/fonts/tree/main/ofl/oswald) | Condensed: timers, counters, tags | Subset: cyrillic and cyrillic-ext | OFL, no RFN | V `wght` | Classic condensed. `tnum` unconfirmed |
| [Roboto Condensed](https://github.com/google/fonts/tree/main/ofl/robotocondensed) | Condensed UI and numbers | Subset: cyrillic and cyrillic-ext | OFL, no RFN | V `wght` and italic | Neutral |
| [Tektur](https://github.com/google/fonts/tree/main/ofl/tektur) | Condensed / techy display | Subset: cyrillic and cyrillic-ext | OFL, no RFN | V `wdth` and `wght` | Octagonal "constructed" shapes (DESCRIPTION). The width axis can squeeze long Ukrainian words |
| [Exo 2](https://github.com/google/fonts/tree/main/ofl/exo2) | Sci-fi UI | Subset: cyrillic and cyrillic-ext | OFL, no RFN | V `wght` and italic | Generic "gamer" look; low personality |
| [Pangolin](https://github.com/google/fonts/tree/main/ofl/pangolin) | Hand-drawn notes | Subset: cyrillic and cyrillic-ext | OFL, no RFN | S | Hand-written marker style |
| [Neucha](https://github.com/google/fonts/tree/main/ofl/neucha) | Hand-drawn | Subset: cyrillic, **no cyrillic-ext** | OFL, no RFN in header | S | Same designer as Russo One |
| [Bad Script](https://github.com/google/fonts/tree/main/ofl/badscript) | Script (hand-drawn) | Subset: cyrillic and cyrillic-ext | OFL, no RFN | S | Poor legibility at HUD sizes; at most a decoration |
| [Kenney Fonts](https://kenney.nl/assets/kenney-fonts) | Playful display | **Unconfirmed**: the page does not list character sets; a search found nothing | CC0 (page: "Creative Commons CC0") | 11 fonts | Do not plan on them for Ukrainian until a glyph check |
| ~~[Russo One](https://github.com/google/fonts/tree/main/ofl/russoone)~~ | (display) | Subset: cyrillic | OFL, **RFN "Russo"** | S | **Exclude.** Its own description says the name means "Russian" and celebrates Russian culture. Wrong signal for a Ukrainian team in 2026 |
| ~~e-Ukraine / e-Ukraine Head~~ | (UI) | Ukrainian by design | **Ambiguous.** The [official fonts page](https://thedigital.gov.ua/fonts) has no font licence, only a site-wide CC BY 4.0 footer. [Mirrors](https://github.com/abondarev-guru/e-ukraine-fonts) claim CC BY 4.0 (unconfirmed) | S | **Exclude.** The licence is not stated for the font itself, and it is the Diia state brand, which a cringe-fun game should not borrow |

### 1.4 Pairings for the style directions (the look is the humans' call)

Each pairing keeps the game to **two families plus at most one gimmick**. Fewer files mean fewer licence entries
and less glyph-cache memory.

1. **"Loud sticker pop"**: Unbounded Black/ExtraBold for titles, the role screen and the end screen, with Onest for
   everything else. Timers use Inter with `tnum` or Rubik Mono One. Risk: Unbounded's width with Ukrainian.
2. **"Soft toy / rounded"**: Nunito for everything, from 400 to Black. Rubik Bubbles or Rubik Doodle Shadow appears
   only for one-word shouts ("ВНИЗ!", "DOWNED!"). This is the warmest choice and the most inclusive for "not only
   guys".
3. **"Poster brutal-fun"**: Dela Gothic One for titles, Golos Text for UI, Oswald or Tektur (squeezed with `wdth`)
   for timers and tags. Run the glyph check on Dela Gothic One first.
4. **"Made in Ukraine"**: Fixel Display plus Fixel Text as one superfamily. Climate Crisis appears only for the
   round timer's last seconds, as a melting joke. Needs one download batch, because Fixel may not be on Google Fonts.

Wireframes (before any direction is chosen) should use **Balsamiq Sans**, so nobody mistakes a wireframe for a style
proposal.

---

## 2. In-game readability

### 2.1 Sizes

- [Xbox Accessibility Guideline 101](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101)
  sets PC minimums of **18 px at 1080p and 36 px at 4K**, measured as body height (top of the ascender to the bottom
  of the descender).
  - Players should be able to scale text **up to 200%**.
  - Text inside icons and glyphs must meet the same minimum.
  - Offer a non-stylized font option if decorative fonts are used.
  - Letter spacing ≥ 0.12 × size and line spacing ≥ 1.5 for blocks of more than two lines.
  - Use sentence case for lines of text; one- or two-word labels are exempt from the all-caps rule.
- **Our frame of reference.** `project.godot` sets `window/stretch/mode="canvas_items"` and `aspect="expand"` and no
  viewport size, so the size is the default **1152×648** (the
  [ProjectSettings reference](https://docs.godotengine.org/en/4.7/classes/class_projectsettings.html) gives 1152 and
  648).
  - A theme `font_size` N therefore renders at about 1.67·N physical px at 1080p and 3.33·N at 4K.
  - The current theme's smallest sizes (TaskDescription 15, DebugText 16) come out at about 25 to 27 px at 1080p,
    which is above the floor.
  - The [multiple-resolutions page](https://docs.godotengine.org/en/4.7/tutorials/rendering/multiple_resolutions.html)
    recommends a 1920×1080 base for non-pixel-art games.
- **Recommended token scale**, in reference px at 1920×1080, which is 1:1 with what a designer sees. These are
  starting values to test in mockups, not a standard.
  - Fine print and debug: 18 (floor)
  - Descriptions: 22
  - HUD hints and labels: 24
  - Buttons and tabs: 28
  - Section titles: 36
  - Countdown and timer: 64 to 96
  - Role screen and end titles: 96 to 140

### 2.2 Text over the 3D scene

- XAG 101 shows white text with a black outline as the pattern that stays readable over any background. A
  semi-opaque backplate is the other option.
- **Godot 4.7.2 can do more than the CSS subset assumed.**
  - [`LabelSettings`](https://docs.godotengine.org/en/4.7/classes/class_labelsettings.html) has `outline_size`,
    `outline_color`, `shadow_size`, `shadow_color`, `shadow_offset`, **`stacked_outline_count`** and
    **`stacked_shadow_count`**, with `add_stacked_outline` and `add_stacked_shadow` (all checked in
    extension_api.json).
  - The Label theme has `outline_size` (default 0), `font_outline_color`, `font_shadow_color`, `shadow_offset_x/y`
    and `shadow_outline_size`
    ([Label class](https://docs.godotengine.org/en/4.7/classes/class_label.html)).
  - So a "sticker" title, with a coloured inner outline, a dark outer outline and an offset hard shadow, is
    Godot-safe. The CSS equivalent is several `text-shadow`s or `-webkit-text-stroke` with `paint-order`.
  - Lens 3 should add **"up to N stacked outlines and shadows on text"** to the Godot-safe list. Blurred shadows
    are not confirmed: `shadow_size` exists, but how it renders is unconfirmed.
- Starting values (unconfirmed, to test):
  - HUD text gets a 2 to 4 px dark outline at the reference size, or a backplate. Thin outlines on the body font,
    heavy ones only on display text.
  - Avoid pure-colour text without an outline over the scene.
- In-world text (`Label3D` has `outline_size`, `fixed_size` and `billboard`, checked in the dump), such as names or
  circle labels: MSDF fonts suit text whose screen size changes with distance.
  - The [fonts page](https://docs.godotengine.org/en/4.7/tutorials/ui/gui_using_fonts.html) says MSDF needs
    **`msdf_pixel_range` ≥ 2 × outline size**, or the outline is cut off.
  - MSDF looks less clear at small sizes, and it disables LCD subpixel antialiasing.

### 2.3 Caps, Ukrainian length, numbers

- **Caps.** The #175 copy is all caps ("YOU ARE IN THE ENGINEERS' TEAM"). Keep caps to two or three words in titles
  (XAG exempts short labels) and add letter spacing.
  - In Godot this is `FontVariation.spacing_glyph` (also `spacing_space`, `spacing_top`, `spacing_bottom`) together
    with `Label.uppercase` (both in the dump).
  - A starting value of about +4 to 8% of the size for caps comes from common practice (unconfirmed).
  - Cyrillic capitals are wide. Mock the Ukrainian title first.
- **Ukrainian is longer.**
  - The [W3C text-size article](https://www.w3.org/International/articles/article-text-size), citing IBM, expects
    short English strings to grow 200 to 300% in European languages (≤10 characters) and long ones about 130%. A
    Ukrainian-specific figure is unconfirmed.
  - In the dump, Godot 4.7.2 `Label` has **no auto-shrink-to-fit property**. It offers wrapping
    (`autowrap_mode`), `clip_text` and `text_overrun_behavior` (ellipsis).
  - So the layouts must budget for the Ukrainian strings, and mockups should always show UA and EN together.
  - Later, Godot's [pseudolocalization](https://docs.godotengine.org/en/4.7/tutorials/i18n/pseudolocalization.html)
    (`internationalization/pseudolocalization/expansion_ratio`; `TranslationServer.pseudolocalization_enabled` is
    in the dump) can stress-test the real UI.
- **Numbers.** The respawn countdown, round timer and "3/10" progress jitter with proportional digits.
  - Use tabular figures: `FontVariation.opentype_features` with `tnum`. The fonts page names `tnum` as an example.
  - Inter has `tnum` (confirmed). For the other fonts it is unconfirmed, so the glyph check should also test for
    the `tnum` GSUB feature.
  - Rubik Mono One gets the same effect by design.
- **Apostrophe.** Ukrainian strings should use one apostrophe character consistently, ʼ (U+02BC) or ’ (U+2019).
  Google's latin subset covers both ranges. Which one the texts use is the humans' choice. Typography practice
  favours U+02BC (unconfirmed).

### 2.4 How Godot 4.7.2 renders fonts (checked in extension_api.json and the docs)

- **`FontFile`** has `antialiasing`, `hinting`, `subpixel_positioning`, `multichannel_signed_distance_field`,
  `msdf_pixel_range`, `msdf_size`, `oversampling`, `allow_system_fallback`, `force_autohinter`,
  `opentype_feature_overrides` and `generate_mipmaps`. `fallbacks` lives on the base `Font`.
  - Enums: `Hinting` NONE/LIGHT/NORMAL; `SubpixelPositioning` DISABLED/AUTO/ONE_HALF/ONE_QUARTER/...;
    `FontAntialiasing` NONE/GRAY/LCD.
- **Project defaults** ([ProjectSettings](https://docs.godotengine.org/en/4.7/classes/class_projectsettings.html)):
  - `gui/theme/default_font_multichannel_signed_distance_field` = false
  - `default_font_hinting` = 1 (Light)
  - `default_font_subpixel_positioning` = 1 (Auto)
  - The fonts page recommends grayscale antialiasing for games, because LCD antialiasing fringes on non-RGB panels.
- **Oversampling.** `Viewport.oversampling` (default true) and `oversampling_override` exist in the dump.
  - The [Viewport docs](https://docs.godotengine.org/en/4.7/classes/class_viewport.html) say they drive font and
    `DPITexture` oversampling from the viewport scale.
  - With `canvas_items` stretch, dynamic fonts are re-rasterized at the real size and stay crisp at 4K, so 2D UI
    does **not** need MSDF.
- **`FontVariation`** has `base_font`, `variation_opentype` (variable axes such as `wght`, `wdth`, `YEAR`),
  `variation_embolden` (faux bold), `variation_transform` (faux italic), `opentype_features` and spacing.
  - One variable TTF can serve every token weight as separate `FontVariation` resources.
- **Fallbacks.** Godot falls back to system fonts automatically (fonts page). The fallback font then differs from
  one player's PC to the next.
  - Give every display font an explicit fallback to the UI font, so a missing ʼ, № or arrow in a display face never
    shows a box or a random system font.
- **First-use stutter.** The import dialog's "Pre-render Configurations" can pre-shape translation strings or whole
  character sets (Latin, Cyrillic). Use it for the sizes used in the HUD.
- **Formats.** `ResourceImporterDynamicFont` is in the dump. Support for WOFF2 import is unconfirmed; keep TTF/OTF
  from the source repos.

---

## 3. Icons

### 3.1 Licensed sets (licence read from the repo or official page)

| Set | Licence (source) | Obligations | Fit for this game |
|---|---|---|---|
| [Kenney Game Icons](https://kenney.nl/assets/game-icons) | CC0 (page: "Creative Commons CC0"), 105 icons | None | Few icons, mostly controllers and prompts. Formats unconfirmed |
| [Kenney Input Prompts](https://kenney.nl/assets/input-prompts) | CC0, 1500 icons, keyboard and mouse included, v1.5a, ships fonts too | None | Good for mouse buttons (LMB/RMB) and a fallback for keys |
| [game-icons.net](https://game-icons.net/about.html) | CC BY 3.0. The repo's [license.txt](https://github.com/game-icons/icons/blob/master/license.txt) says CC BY 3.0, or CC0 where noted per author | Credit **each author** (site suggests "Icons made by {author}. Available on https://game-icons.net") | Huge game vocabulary (knife, skull, package, hand). Attribution per author is bookkeeping, but doable through the credits files |
| [Tabler Icons](https://github.com/tabler/tabler-icons) | MIT (repo licence, © Paweł Kuna); 6200+ icons per its description | Ship the MIT notice | Clean stroke icons; outline and filled variants |
| [Phosphor](https://github.com/phosphor-icons/core) | MIT (© 2023 Phosphor Icons) | Ship the MIT notice | Six weights including Bold, Fill and Duotone (weights unconfirmed in this session). Chunky weights read more "game" than web |
| [Lucide](https://github.com/lucide-icons/lucide) | **ISC**, plus **MIT for icons derived from Feather** (both in [LICENSE](https://github.com/lucide-icons/lucide/blob/main/LICENSE)) | Ship both notices | Web-app look; stroke only |
| [Iconoir](https://github.com/iconoir-icons/iconoir) | MIT (© 2021 Luca Burgio), 1600+ icons | Ship the MIT notice | Thin stroke; dropped by the bounds (beyond six sets) |
| [Material Symbols](https://github.com/google/material-design-icons) | Apache 2.0 (repo licence; no NOTICE file at the root) | Ship the licence text | Very complete, but looks unmistakably like Android |
| [Font Awesome Free](https://github.com/FortAwesome/Font-Awesome/blob/7.x/LICENSE.txt) | Icons as SVG/JS: **CC BY 4.0**. Icon fonts: OFL with **RFN "Font Awesome"** (LICENSE.txt) | Attribution | Avoid: CC BY plus an RFN gives no gain over MIT sets |

**Recommendation (technical; the look is the humans' call).**

- Draw **our own SVGs** for the signature icons the game's identity rests on: package, knife, downed, raise, give
  up, ready, host crown, proximity voice and speaking, belt and hand slots, task circle, respawn, spectate eye. That
  is roughly 15 to 25 icons. Own icons need no licence, match the chosen direction exactly and can be drawn on one
  grid.
- Use **one MIT set** (Phosphor or Tabler) for generic system icons: settings, close, check, arrows, volume, mic,
  exit.
- Use **Kenney Input Prompts (CC0)** only where drawing is not worth it (mouse buttons).
- Use game-icons.net as a fallback for odd one-offs, with per-author credit entries.

**Key prompts as a component.** The controls (E, Q, X, G hold, Tab hold, F, Esc, LMB/RMB) should render as a
**Keycap** component: a `StyleBoxFlat` with a thicker bottom border and the key letter in the UI font. This scales
with the text, survives later key rebinding, meets the XAG rule that "text inside glyphs meets the minimum size",
and needs no image per key. Only the mouse-button glyphs need art.

### 3.2 SVG in Godot 4.7

- From [importing images](https://docs.godotengine.org/en/4.7/tutorials/assets_pipeline/importing_images.html): SVGs
  are rasterized at import time with the `svg/scale` option.
  - `editor/scale_with_editor_scale` and `editor/convert_colors_with_editor_theme` exist but are meant for editor
    plugin icons. They do not apply to game UI.
  - The **DPITexture** import type re-rasterizes at runtime to match oversampling. `DPITexture` is in the dump with
    `base_scale`, `color_map`, `saturation` and `create_from_string`. The multiple-resolutions page recommends it
    for SVGs.
- Godot's SVG renderer (ThorVG) has limited SVG support. **Text must be converted to paths**, and complex vectors
  may render wrongly.
- **Godot-safe SVG rules for the icon set** (rules the repo should state):
  - Paths only, no `<text>`, no filters or masks (masks unconfirmed).
  - One colour, white, tinted in the theme.
  - Fixed viewBox grid (for example 24 or 32).
  - Strokes expanded to outlines if ThorVG stroke joins differ from the browser (unconfirmed; test).
- Theme wiring: `Theme.set_icon` / `get_icon`, `Button.icon` / `expand_icon` / `icon_alignment`, and
  `TextureRect.expand_mode` / `stretch_mode` (all in the dump).
  - A white icon tinted by `modulate` or Button icon colours (icon theme colours are unconfirmed) keeps one SVG per
    icon for every state.

---

## 4. Recording licences

prime-game today keeps one Markdown file per entry in `docs/credits/` (`docs/credits/gdunit4.md`).
`tools/runner/credits.py`:

- requires the fields **Files** (repo-relative globs in backticks), **Author**, **Source** and **License**;
- copies any extra `- **Field:** value` lines and free text into the generated `CREDITS.md`;
- has `check` fail when an LFS asset has no entry.

**Proposed format for prime-game-ui: the same format, so an entry moves to prime-game unchanged at porting time.**

```markdown
# Unbounded

- **Files:** `assets/fonts/unbounded/**`
- **Author:** The Unbounded Project Authors (NaN)
- **Source:** https://github.com/google/fonts/tree/<commit>/ofl/unbounded
- **License:** SIL OFL 1.1; the full text is `assets/fonts/unbounded/OFL.txt`
- **Reserved Font Name:** none
- **Retrieved:** 2026-10-xx, download batch 1 approved by @xperiaroco2 in #<issue>
- **Modified:** no (never subset; an RFN font must not be subset without renaming)
- **Ukrainian check:** і ї є ґ І Ї Є Ґ ʼ № present; `tnum` absent (tools/font-check output)
```

Rules:

- The licence file sits **next to** the asset, inside the matched `Files` glob.
- Pin the commit in **Source**.
- CC BY assets get an **Attribution** field with the exact credit line. For game-icons.net, use one entry per
  author, with `Files` listing that author's icons.
- Own SVGs get an entry with Author "prime-game team" and the project licence, so the "every asset has an entry"
  check stays total.
- A CI check in prime-game-ui mirrors `credits` and `check`: every file under `assets/` matches an entry glob, and
  every entry has its licence file.

---

## 5. Process fit and gaps this lens leaves

- Use the [Google Fonts CSS API](https://fonts.google.com) in mockup artifacts. Artifact pages may load Google Fonts
  stylesheets, so candidates can be compared on the phone **without downloading anything into the repo**. Font
  files enter the repo only for the chosen direction, in one approved download batch. Fixel is the exception: it
  needs a batch even for mockups.
- A zero-dependency Node script (reading the `cmap` and `GSUB` tables) can check Ukrainian codepoints and `tnum` on
  every font before adoption. A dependency such as opentype.js would need the humans' OK, so start without one.

## Sources

- OFL FAQ: https://openfontlicense.org/ofl-faq/
- CC BY 4.0 deed: https://creativecommons.org/licenses/by/4.0/
- Google Fonts metadata and licences: https://github.com/google/fonts (ofl/<family>/METADATA.pb, OFL.txt, DESCRIPTION.en_us.html for every family in §1.3)
- Google subset definitions: https://github.com/googlefonts/nam-files/tree/main/Lib/gfsubsets/data
- Inter: https://rsms.me/inter/
- Fixel: https://github.com/MacPaw/Fixel and https://github.com/MacPaw/Fixel/blob/main/OFL.txt
- e-Ukraine: https://thedigital.gov.ua/fonts, https://thedigital.gov.ua/news/diia_design, mirror https://github.com/abondarev-guru/e-ukraine-fonts
- Kenney: https://kenney.nl/assets/kenney-fonts, https://kenney.nl/assets/input-prompts, https://kenney.nl/assets/game-icons
- game-icons.net: https://game-icons.net/about.html, https://github.com/game-icons/icons/blob/master/license.txt
- Icon set repos: https://github.com/tabler/tabler-icons, https://github.com/phosphor-icons/core, https://github.com/lucide-icons/lucide/blob/main/LICENSE, https://github.com/iconoir-icons/iconoir, https://github.com/google/material-design-icons, https://github.com/FortAwesome/Font-Awesome
- Xbox Accessibility Guideline 101: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101
- W3C text size in translation: https://www.w3.org/International/articles/article-text-size
- Godot 4.7 docs: https://docs.godotengine.org/en/4.7/tutorials/ui/gui_using_fonts.html, https://docs.godotengine.org/en/4.7/tutorials/assets_pipeline/importing_images.html, https://docs.godotengine.org/en/4.7/tutorials/rendering/multiple_resolutions.html, https://docs.godotengine.org/en/4.7/tutorials/i18n/pseudolocalization.html, https://docs.godotengine.org/en/4.7/classes/class_viewport.html, https://docs.godotengine.org/en/4.7/classes/class_label.html, https://docs.godotengine.org/en/4.7/classes/class_projectsettings.html
- Godot API dump: D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json (FontFile, FontVariation, LabelSettings, Label, Label3D, Viewport, DPITexture, Theme, Button, TextureRect, TranslationServer, TextServer enums)
- prime-game: D:\prime-game\docs\credits\gdunit4.md, D:\prime-game\tools\runner\credits.py, D:\prime-game\project.godot, D:\prime-game\client\ui\theme\game_theme.tres
