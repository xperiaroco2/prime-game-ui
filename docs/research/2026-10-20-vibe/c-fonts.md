# Lens C: fonts with Ukrainian Cyrillic (gatherer report, 2026-10-20)

## Method
- Licence and the `cyrillic` subset from each family's google/fonts `METADATA.pb`
  (`https://github.com/google/fonts/blob/main/ofl/<dir>/METADATA.pb`); axes and weights from
  `https://fonts.google.com/metadata/fonts`.
- The Ukrainian letters per Google's language data
  ([uk_Cyrl](https://raw.githubusercontent.com/googlefonts/lang/main/Lib/gflanguages/data/languages/uk_Cyrl.textproto)):
  ґ є і ї and the apostrophe U+02BC; `GF_Cyrillic_Core` contains them
  ([glyphset](https://raw.githubusercontent.com/googlefonts/glyphsets/main/data/results/nam/GF_Cyrillic_Core.nam)).
- **Per-glyph coverage is unconfirmed**: the css2 `text=` API returns a file even for fonts without Cyrillic, and
  reading the font binaries is not allowed. Each finalist must be rendered with `ҐґЇїЄєІі ʼ ’ ' №` before a pick.
  Many fonts lack U+02BC: normalise Ukrainian strings to ’ (U+2019) or test per font.
- Designer origin was not checked (Onest, Golos Text, the Jovanny Lemonad families: Russo One, Neucha, Days One)
  (unconfirmed); the engineer may want to weigh it.

## Dropped
No Cyrillic subset: Bungee, Syne, Bricolage Grotesque, Caveat Brush, Comic Neue, Bebas Neue, Orbitron, Lexend,
Gabarito, Anybody, Space Grotesk, Mona Sans, Hubot Sans, Familjen Grotesk, Instrument Sans, Funnel Display, Host
Grotesk, Oxanium, Saira, Chakra Petch, Share Tech Mono, Sometype Mono, Lilita One, Alfa Slab One, Permanent Marker,
Bangers, Titan One, Fredoka, Baloo 2, Bagel Fat One, Gluten, Tilt Warp, Monoton. Ubuntu family: UFL licence, not
allowed. Comfortaa: the old style. Rubik Bubbles: childish. Stalinist One: political baggage. Press Start 2P, Amatic
SC, Pangolin: nostalgic or childish.

## Candidates (all OFL with the cyrillic subset)
Display: Unbounded (`unbounded`, wght 200-900, wide club-poster; width risk), Dela Gothic One (`delagothicone`, ultra
heavy, 2.4 MB with CJK, needs subsetting), Tektur (`tektur`, wdth 75-100, wght 400-900, squared techno), Russo One
(`russoone`, esports feel), Rubik Mono One (`rubikmonoone`), Rubik Glitch / Glitch Pop, Rubik Marker Hatch (hatched
marker caps, echoes the comic reference), Rubik Vinyl, Rubik Spray Paint, Climate Crisis (`climatecrisis`, YEAR axis
melts letters: a "busted" sting), Oi (`oi`, ultra-fat didone, fashion absurdity), Playfair Display (fashion masthead,
plain cyrillic only), Shantell Sans (`shantellsans`, marker hand caps with bounce and informality axes), Neucha,
Underdog, Marck Script, Pixelify Sans, Alumni Sans (tall condensed scores), Sofia Sans Extra Condensed, Exo 2 (dated).

Text: Onest (`onest`, wght 100-900, Cyrillic-first grotesk), Golos Text (`golostext`, large x-height), Wix Madefor
Text / Display (Dalton Maag, wght 400-800), Manrope, Inter (opsz, generic), Geist, Mulish, Nunito Sans (wdth axis),
Montserrat Alternates, Geologica (`geologica`, SHRP axis from soft to sharp: tunable alien-ness), Sofia Sans /
Condensed.

Device: Martian Mono (`martianmono`, wdth 75-112.5, wght 100-800), JetBrains Mono, IBM Plex Mono, Tektur, Pixelify
Sans.

## Pairings
1. Neon club flyer: Unbounded 800 + Onest + Martian Mono.
2. Alien-misread tech: Tektur (wdth 75, wght 800) + Geologica (high SHRP) + Pixelify Sans on in-world screens.
3. Vinyl-toy packaging: Dela Gothic One (subsetted) + Wix Madefor Text.
4. Late-night makeover reveal: Oi or Playfair Display 900 + Golos Text + Alumni Sans for scores.
5. Comic sticker: Shantell Sans 800 caps or Rubik Marker Hatch + Nunito Sans / Mulish.
6. Busted broadcast sting: Climate Crisis (animated) or Rubik Glitch, only on the cops and end screens.

Nothing was downloaded; review pages load the fonts from Google Fonts. Shipping needs the engineer's yes for the named
batch and each font's OFL.txt; check Reserved Font Names before subsetting (unconfirmed per font).
