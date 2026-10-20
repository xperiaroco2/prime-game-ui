# Round 2, lens G: fonts for the Night flyer (gatherer report, 2026-10-20)

## Method
`METADATA.pb` read for about 170 families at `https://raw.githubusercontent.com/google/fonts/main/<licence-dir>/<dir>/METADATA.pb`
(the `license:` line, `subsets: "cyrillic"`); axes from https://fonts.google.com/metadata/fonts. The subset tag is not
proof of ґ є і ї: only Science Gothic (https://github.com/googlefonts/science-gothic) and TikTok Sans
(https://github.com/TikTok/TikTokSans) name Ukrainian in their sources; every other face is checked by eye on the
review page. Shape descriptions not taken from a README are (unconfirmed). CJK-bundled families (Dela Gothic One about
2.5 MB, Stick, Train One, Reggae One, DotGothic16) need subsetting before shipping; variable axes become
`FontVariation`s whose values the tokens pin.

## Survivors (OFL, cyrillic subset)
Display: Science Gothic (`sciencegothic`, wdth 50-200, wght 100-900, slnt, CTRS; Bank Gothic revived, condensed to
extra-expanded), TikTok Sans (`tiktoksans`, wdth 75-150, wght 300-900, opsz), Pliant (wdth 100-125), Roboto Flex
(wdth 25-151), Dela Gothic One (brick), Rubik Mono One (rounded brick, Tempel Softland's cousin), Oi (ultra-fat
twisted slab), Stalinist One, Days One, Climate Crisis (YEAR axis), Tektur, Russo One, Exo 2, Jura, Advent Pro (wdth
100-200), Handjet (dot-matrix, ELSH and ELGR axes), DotGothic16, Sofia Sans Extra Condensed (wght 1-1000; siblings
Condensed, Semi Condensed, regular), Alumni Sans, Oswald, Rubik (300-900), the Rubik specials (Glitch, Glitch Pop,
Broken Fax, Moonrocks, Wet Paint, Spray Paint), Monomakh (Old-Slavic display).
Text: Onest, Golos Text, Geologica, Commissioner, Manrope, Geist, Inter Tight, IBM Plex Sans, Libre Franklin,
Montserrat, Mulish, Jost, Raleway, Fira Sans Extra Condensed, Roboto Condensed.
Numbers: Martian Mono (wdth 75-112.5), Geist Mono, JetBrains Mono, IBM Plex Mono, Roboto Mono, Overpass Mono, Lilex,
Victor Mono, Fira Code.
Also passing, not shortlisted: Kablammo, Seymour One, Sansation, Orelega One, Prosto One, Underdog, Stick, Train One,
Reggae One, Rampart One, Moderustic, Akt, SN Pro, Google Sans, Nata Sans, Wix Madefor Display, Press Start 2P,
Pixelify Sans, Ruslan Display.

## Dropped
No Cyrillic: Kanit, Prompt, Bowlby One, Black Ops One, RocknRoll One, Zen Dots, Chakra Petch, Big Shoulders, Anybody,
Space Mono, Major Mono Display, Bebas Neue, Syne, Archivo, Lexend, Mona Sans, Hubot Sans, Familjen Grotesk. UFL
(not allowed): the Ubuntu families. Golos UI is not in google/fonts. Tone or legibility: Flow, Rubik Maze, Microbe,
Burned, Comfortaa and the cute rounded faces. No non-Google open font was confirmed worth naming (Velvetyne states no
licence policy per font: https://velvetyne.fr/about/faq/).

## Six trios
1. Stretched rave: Science Gothic wdth 170 wght 850 + Golos Text 500 + Geist Mono 600.
2. Brick tiles: Dela Gothic One + Rubik 500 + Rubik Mono One for digits.
3. Condensed line-up: Sofia Sans Extra Condensed 900 caps + Sofia Sans Semi Condensed 500 + Martian Mono wdth 75.
4. Techno floor: Tektur 800 + Geologica 500 (soft SHRP) + JetBrains Mono.
5. Fat-face sticker: Oi + Inter Tight 600 + Roboto Mono.
6. Wildcard "busted, melting": Climate Crisis (YEAR from 1979 toward 2050 as the cops arrive) + TikTok Sans 500 +
   Handjet 700 for the timer.
