# Font finder: A Short Hike look, Ukrainian + English

Researched 2026-10-02. Read-only: web search and WebFetch of google/fonts `METADATA.pb` and `OFL.txt` on
raw.githubusercontent.com (branch `main`). No font files were downloaded and no glyphs were inspected, so
Ukrainian letter coverage is inferred from subset tags only (see "Ukrainian check" below).

## 1. What A Short Hike uses

**The typeface name is not confirmed.** No developer post, credit line, Steam/itch page, PlayStation Blog article
or fan-translation repo I could reach names the in-game font.

Confirmed context:
- Unity game; adamgryu deliberately renders the 3D world at very low resolution with pixels as "a core part of the
  aesthetic", flat shading, no anti-aliasing, and a soft outline for readability (PlayStation Blog, 2021-08-05).
- The developer's Steam post "Regarding Fan Translations" lets a translation CSV pick a per-script font set with a
  size, e.g. `Cyrillic:16`, `Chinese:12:...`, `Japanese:12:2`, `Korean:16:2`. So the game ships separate font sets
  per script (one for Cyrillic), not one family for everything. Font names are not given.
- adamgryu.com is set in Cardenio Modern (Nils Cordes); that is his website, not evidence for the game.

Traits (unconfirmed, from memory of screenshots, not a source): dialogue and menu text in white rounded speech
boxes, dark text in a chunky, bold-ish pixel-style sans that matches the low-res render; large x-height, simple
open shapes, no serifs; small caps-free UI labels. The logo is hand-lettered and is not a font.

Takeaway for prime-game: aim for a clean pixel or low-res sans at a fixed pixel size for titles and short labels,
and a soft rounded sans for longer text.

## 2. Candidates (all on Google Fonts, all SIL OFL 1.1)

"RFN" = Reserved Font Name in `OFL.txt`. With an RFN you may ship the font unmodified under its name; if you modify
it (subset, re-hint, merge glyphs) the derivative must be renamed. Plain bitmap baking by the engine at runtime is
not a modified font file.

### Pixel / low-res (titles, HUD, short labels)

| Font | CSS API family | Subsets (METADATA.pb) | RFN | Notes |
|---|---|---|---|---|
| Pixelify Sans (Stefie Justprince, 2023) | `Pixelify Sans:wght@400..700` | cyrillic, latin, latin-ext | none | Closest match: friendly pixel sans with readable lowercase, variable weight. No cyrillic-ext tag. |
| Tiny5 (Stefan Schmidt) | `Tiny5` | cyrillic, cyrillic-ext, greek, latin, latin-ext | none | 5 px tall minimal pixel sans; very clean, HUD counters and small labels. Single weight. |
| Press Start 2P (CodeMan38) | `Press Start 2P` | cyrillic, cyrillic-ext, greek, latin, latin-ext | "Press Start 2P" | Classic 8x8 arcade; wide and loud, good only for short titles. RFN: rename if modified. |
| DotGothic16 (Fontworks) | `DotGothic16` | cyrillic, japanese, latin, latin-ext | none | 16 px dot-matrix gothic, calm and readable. Risk: a Japanese font's Cyrillic may be the JIS Russian set only; check ґ є і ї first. |
| Handjet (Rosetta, David Brezina) | `Handjet:wght@100..900` | arabic, armenian, cyrillic, cyrillic-ext, greek, hebrew, latin, latin-ext, vietnamese | none | Modular "pixel" built from elements; extra axes ELSH 0..16 (element shape, round to square) and ELGR 1..2; condensed. |
| Rubik Pixels (NaN, Luke Prowse) | `Rubik Pixels` | cyrillic, cyrillic-ext, hebrew, latin, latin-ext | none | Rubik's rounded shapes rendered as pixels; heavy display only. Pairs naturally with Rubik. |

### Soft retro / rounded

| Font | CSS API family | Subsets | RFN | Notes |
|---|---|---|---|---|
| M PLUS Rounded 1c (Coji Morishita, M+) | `M PLUS Rounded 1c:wght@100;300;400;500;700;800;900` | cyrillic, cyrillic-ext, greek, greek-ext, hebrew, japanese, latin, latin-ext, vietnamese | unverified (OFL.txt 404 at the expected path) | Soft rounded sans, game-UI friendly; static weights. |
| Comfortaa (Johan Aakerlund) | `Comfortaa:wght@300..700` | cyrillic, cyrillic-ext, greek, latin, latin-ext, vietnamese | "Comfortaa" | Geometric rounded, a little 80s/90s; titles or short UI. RFN: rename if modified. |

### Clean non-pixel faces for long UI text (settings, the Tab task list)

| Font | CSS API family | Subsets | RFN | Notes |
|---|---|---|---|---|
| Nunito | `Nunito:wght@200..1000` | cyrillic, cyrillic-ext, latin, latin-ext, vietnamese | none | Rounded terminals, generous x-height; the softest pairing with Pixelify Sans or Tiny5. |
| Rubik | `Rubik:wght@300..900` | arabic, cyrillic, cyrillic-ext, hebrew, latin, latin-ext | none | Slightly rounded corners, sturdy at small sizes; same skeleton as Rubik Pixels. |
| Golos Text (Paratype: Korolkova, Kuzmin) | `Golos Text:wght@400..900` | cyrillic, cyrillic-ext, latin, latin-ext | none | Neutral UI sans drawn Cyrillic-first; best Ukrainian typesetting of the three, least "retro". |

Suggested pairs to look at first: Pixelify Sans + Nunito; Tiny5 (HUD) + Rubik; Rubik Pixels + Rubik.

## Ukrainian check (to do before choosing)

The `cyrillic` subset tag does not prove ґ (U+0491), є, і, ї or the apostrophes. Nothing here was glyph-checked.
Test string for the specimen page or the editor: `Ґанок ґудзик Єнот їжак Іван мʼята м’ята ʼ ’ — «лапки»`.
- U+02BC (ʼ) is unconfirmed for every candidate. If missing, use U+2019 (’), which Latin fonts normally include,
  or a Godot font fallback.
- Highest risk: DotGothic16 and M PLUS Rounded 1c (Japanese families with possibly Russian-only Cyrillic) and
  Pixelify Sans (no cyrillic-ext tag). Lowest risk: Golos Text, Rubik, Nunito.

## Sources
- PlayStation Blog, "Crafting a tiny open world" (2021-08-05): https://blog.playstation.com/2021/08/05/crafting-a-tiny-open-world-a-look-behind-the-scenes-at-the-creation-of-a-short-hike/
- Steam, "Regarding Fan Translations": https://steamcommunity.com/app/1055540/discussions/0/3581993633007919887/
- itch.io page: https://adamgryu.itch.io/a-short-hike
- google/fonts `ofl/<family>/METADATA.pb` and `OFL.txt` for: pixelifysans, tiny5, pressstart2p, dotgothic16, handjet,
  rubikpixels, mplusrounded1c (METADATA only), comfortaa, nunito, rubik, golostext.
