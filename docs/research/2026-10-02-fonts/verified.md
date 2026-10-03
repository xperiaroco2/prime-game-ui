# Font list: adversarial verification (2026-10-02)

Sources: the google/fonts `METADATA.pb` and `OFL.txt` (raw.githubusercontent.com, branch main) for each family, one
Google Fonts CSS API request, upstream READMEs on GitHub and Wikipedia (JIS X 0208). No font file was downloaded.

## Method and limits
- **Google Fonts CSS strings.** One `fonts.googleapis.com/css2` request listed all 11 family strings exactly as the
  finder wrote them, ranges included. It returned valid CSS with no error, so every string and weight range is
  accepted. The response, served to the fetch tool's user agent, had no `/* cyrillic */` subset comments, so
  this request does not prove which subsets exist. The subsets below come from METADATA.pb.
- **Subset tags do not prove glyphs.** A `cyrillic`/`cyrillic-ext` tag in METADATA.pb does not prove that ґ є і ї,
  U+02BC or U+2019 exist. No font file was opened, so every glyph claim below stays **unconfirmed** unless a
  primary source says otherwise.
- **Pixelify Sans glyph check.** I fetched `sources/PixelifySans.glyphs` upstream. The content was cut off in the
  Latin range, so the check is inconclusive.

## A Short Hike
**Unconfirmed.** No primary source I reached names the in-game typeface:
- The Soreine/A-Short-Hike-Translations README names no font.
- Two web searches found nothing.
- One search summary claimed "Cardenio Modern". That font is used on adamgryu.com, not shown to be used in the
  game, so I reject it as the game font.

I did not re-read the finder's other claims (Unity; the PlayStation Blog render notes; per-script font sizes in the
Steam fan-translation post), so they are carried over, not re-verified. The target style ("chunky pixel-ish sans")
is the finder's recollection, not a sourced fact.

## Verified list (survivors)

| Font | Licence / RFN | Subsets (METADATA.pb) | CSS family (accepted by API) | Ukrainian glyphs | Status |
|---|---|---|---|---|---|
| Pixelify Sans | OFL 1.1 / none | cyrillic, latin, latin-ext (no cyrillic-ext) | `Pixelify Sans:wght@400..700` | unconfirmed (source fetch truncated in Latin; only aggregator sites claim ґ) | OK, check glyphs before choosing |
| Tiny5 | OFL 1.1 / none | cyrillic, cyrillic-ext, greek, latin, latin-ext | `Tiny5` (400 only) | unconfirmed; upstream README: Latin, Greek, Cyrillic, Armenian, "974 languages", 1,942 glyphs | OK, strongest pixel candidate on evidence |
| Press Start 2P | OFL 1.1 / RFN "Press Start 2P" | cyrillic, cyrillic-ext, greek, latin, latin-ext | `Press Start 2P` (400 only) | unconfirmed | OK; ship unmodified, rename if subset or edited |
| Handjet | OFL 1.1 / none | arabic, armenian, cyrillic, cyrillic-ext, greek, hebrew, latin, latin-ext, vietnamese | `Handjet:wght@100..900` (axes also ELGR 1–2, ELSH 0–16 default 2) | unconfirmed; README lists Cyrillic, not Ukrainian | OK |
| Rubik Pixels | OFL 1.1 / none | cyrillic, cyrillic-ext, hebrew, latin, latin-ext | `Rubik Pixels` (400 only) | unconfirmed | OK; finder's "heavy weight" is visual only, registered weight is 400 |
| M PLUS Rounded 1c | OFL per METADATA.pb; **no licence file in google/fonts/ofl/mplusrounded1c** / RFN none stated | cyrillic, cyrillic-ext, greek, greek-ext, hebrew, japanese, latin, latin-ext, vietnamese | `M PLUS Rounded 1c:wght@100;300;400;500;700;800;900` | unconfirmed, Japanese family | **Caution**: licence text not shipped next to the binary |
| Comfortaa | OFL 1.1 / RFN "Comfortaa" | cyrillic, cyrillic-ext, greek, latin, latin-ext, vietnamese | `Comfortaa:wght@300..700` | unconfirmed | OK; ship unmodified, rename if subset or edited |
| Nunito | OFL 1.1 / none | cyrillic, cyrillic-ext, latin, latin-ext, vietnamese | `Nunito:wght@200..1000` (italic exists too) | unconfirmed | OK |
| Rubik | OFL 1.1 / none | arabic, cyrillic, cyrillic-ext, hebrew, latin, latin-ext | `Rubik:wght@300..900` (italic exists too) | unconfirmed | OK |
| Golos Text | OFL 1.1 / none | cyrillic, cyrillic-ext, latin, latin-ext | `Golos Text:wght@400..900` | unconfirmed | OK; "by Paratype" not verified (METADATA designers: Alexandra Korolkova, Vitaly Kuzmin) |

All 10 are on Google Fonts.

### Per-font evidence
- **Pixelify Sans.**
  - METADATA.pb: license "OFL"; DISPLAY; added 2023-09-13; designer Stefie Justprince; axis wght 400–700; subsets
    cyrillic, latin, latin-ext, menu. Source: eifetx/Pixelify-Sans @39df74a.
  - OFL.txt copyright line: "Copyright 2021 The Pixelify Sans Project Authors (https://github.com/eifetx/Pixelify-Sans)",
    with no RFN.
  - Upstream README: says nothing about scripts or languages.
  - Glyph check: inconclusive (the .glyphs fetch was cut off).
- **Tiny5.**
  - METADATA.pb: OFL; category SANS_SERIF with classification DISPLAY; added 2024-04-19; Stefan Schmidt. Source:
    Gissio/font_tiny5 @1d6e16f.
  - OFL.txt: "Copyright 2022-2024 The Tiny5 Project Authors (https://github.com/Gissio/font_tiny5)", with no RFN.
  - README: claims Latin, Greek, Cyrillic and Armenian. The Google Fonts build has no armenian subset, so the
    README may describe a newer upstream than the Google Fonts binary.
- **Press Start 2P.**
  - METADATA.pb: OFL; DISPLAY; added 2012-04-04; CodeMan38. Source: googlefontdirectory-hg.
  - OFL.txt: "Copyright 2012 The Press Start 2P Project Authors (cody@zone38.net), with Reserved Font Name
    "Press Start 2P"."
- **Handjet.**
  - METADATA.pb: OFL; DISPLAY; added 2020-09-11; Rosetta and David Březina.
  - OFL.txt: "Copyright 2018 The Handjet Project Authors (https://github.com/rosettatype/Handjet/)", with no RFN.
  - README scripts: Arabic, Armenian, Cyrillic, Greek, Hebrew, Latin, Korean.
- **Rubik Pixels.**
  - METADATA.pb: OFL; DISPLAY; added 2022-11-25; NaN and Luke Prowse.
  - OFL.txt: "Copyright 2020 The Rubik Filtered Project Authors (...)", with no RFN.
- **M PLUS Rounded 1c.**
  - METADATA.pb: license OFL; added 2018-05-17; static weights 100/300/400/500/700/800/900. Copyright string:
    "Copyright 2016 The Rounded M+ Project Authors.". Primary script Jpan.
  - GitHub API listing of the folder: METADATA.pb, 7 TTFs and upstream_info.md, with **no OFL.txt** (this explains
    the finder's 404).
  - upstream_info.md: the upstream coz-m/MPLUS_FONTS is matched with low confidence and may not contain the Rounded
    variant. The binary was re-added on 2025-04-10 in a "Missing in GH" fix.
  - coz-m/MPLUS_FONTS OFL.txt is OFL 1.1, "Copyright 2021 The M+ FONTS Project Authors", with no RFN. It is a
    different copyright holder from the Rounded binary.
  - Verdict: usable only if we bundle our own OFL 1.1 text with the 2016 Rounded M+ copyright line, and the font's
    embedded licence field is unchecked. Prefer another body font.
- **Comfortaa.**
  - METADATA.pb: OFL; DISPLAY; added 2011-08-10; wght 300–700.
  - OFL.txt: "Copyright 2011 The Comfortaa Project Authors (https://github.com/alexeiva/comfortaa), with Reserved
    Font Name "Comfortaa"."
- **Nunito.**
  - METADATA.pb: OFL; added 2012-08-12; wght 200–1000, roman and italic.
  - OFL.txt: "Copyright 2014 The Nunito Project Authors (https://github.com/googlefonts/nunito)", with no RFN.
- **Rubik.**
  - METADATA.pb: OFL; added 2015-07-22; wght 300–900, roman and italic. Designers: Hubert and Fischer, Meir Sadan,
    Cyreal, Daniel Grumer, Omaima Dajani.
  - OFL.txt: "Copyright 2015 The Rubik Project Authors (https://github.com/googlefonts/rubik)", with no RFN.
- **Golos Text.**
  - METADATA.pb: OFL; added 2023-01-06; wght 400–900.
  - OFL.txt: "Copyright 2019 The Golos Text Project Authors (https://github.com/googlefonts/golos-text)", with no RFN.

## Dropped
- **DotGothic16.** The licence passes (OFL 1.1, no RFN, METADATA subsets cyrillic, japanese, latin, latin-ext), but the
  Ukrainian evidence points against it:
  - The upstream README (fontworks-fonts/DotGothic16) states coverage as "All glyphs in Adobe-Japan1-3" and
    "GF Latin Core".
  - The Cyrillic in Adobe-Japan1 comes from JIS X 0208 row 7. Per Wikipedia, that row is "the modern Russian
    alphabet" (66 letters), with no ґ є і ї.

  This is a soft drop: the letters are likely missing, not proven missing. Re-add the font only if a glyph check
  shows ґ є і ї.

## Open checks for the engineer (one local glyph check settles them)
- Check ґ Ґ є Є і І ї Ї, ʼ (U+02BC) and ’ (U+2019) in every survivor. Pixelify Sans and the M PLUS family carry the
  most risk.
- For the RFN fonts (Press Start 2P, Comfortaa): ship the file unmodified. A subset or edited copy must be renamed.
