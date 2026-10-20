# Round 2, lens F: acid lime in game and club UI (gatherer report, 2026-10-20)

No images were looked at; Interface In Game pages gave captions only, several slugs returned 404. Look notes marked
"(unconfirmed, memory)" have no fetched source.

## What the sources say
- **Acid graphics** is a recent umbrella: fluorescent yellow, green, orange, pink or blue on black or metallic grey;
  warped names with a condensed sans for details; time, place, price and the action isolated from the distorted
  layers; Unbounded among suggested faces ([daisyUI](https://trends.daisyui.com/trend/acid-graphics/)).
- **Roots in rave design**: The Designers Republic's vivid palette for Warp
  ([Warp](https://warp.net/editorial/reasonable-person-an-interview-with-ian-anderson)); Wipeout's crisp icons,
  wireframe illustration and Eurostile-like type ([Creative Review](https://www.creativereview.co.uk/an-oral-history-of-wipeout/)).
- **Two camps** ([Eye on Design](https://eyeondesign.aiga.org/acid-house-swiss-modernism-the-legacy-of-clubbing-on-graphics/)):
  Saville's gridded calm for the Haçienda; Fabric with "no DayGlo colors or lurid typography"; Boiler Room's logo in
  Univers 93 Extra Black Extended; early acid house "comical and humorous"; maximal 90s styles age worse.
- **Riso** ([Sweet Harmony brief](https://www.rendezvousprojects.org.uk/?p=228),
  [Oxford Greenprint](https://oxfordgreenprint.com/home/design-for-riso/)): fluorescent green and pink inks,
  misregistration as the look, fluorescent orange and pink too light for small text.
- **Neubrutalism** ([daisyUI](https://trends.daisyui.com/trend/neubrutalism/)): heavy outlines, zero-blur offset
  shadows, clashing flat colour.
- **Brat** (search summaries; Fonts In Use timed out): an "offensive" off-trend green, lowercase Arial; Spotify's lime
  Wrapped 2024 teaser read as Brat ([NationalWorld](https://www.nationalworld.com/culture/music/spotify-wrapped-2024-streaming-service-drops-major-teaser-with-fans-cracking-all-nine-references-4890883));
  Wrapped used bespoke type as the main graphic on flat fields
  ([It's Nice That](https://www.itsnicethat.com/features/spotify-wrapped-2024-graphic-design-041224)). Lesson: bare
  lime with plain lowercase type now reads as Brat; a flyer needs more structure.
- **Bomb Rush Cyberfunk**: the first UI was "too videogamey", so the team added a recurring motif
  ([TouchArcade](https://toucharcade.com/?p=315609)).
- **Rollerdrome**: 4-5 key colours per level, flat colour, a constant black outline
  ([Game Developer](https://www.gamedeveloper.com/art/deep-dive-rollerdrome-art-direction-q-a)).
- **Xbox green** #107C10 (unconfirmed from Microsoft; hue 120°).

## Per game (unconfirmed, memory, unless cited)
Splatoon 3 (colour as meaning, sticker labels), Bomb Rush Cyberfunk (one signature motif), Neon White (colour =
function), Hi-Fi Rush (action-text reveals; halftone not portable), Rollerdrome (outline for legibility), Ultrakill
(small colour-coded HUD parts), Lethal League Blaze (loud only at match start and end), Watch Dogs 2 (the hacker
cliché to avoid), Valorant (one accent plus a team colour,
[IIG](https://interfaceingame.com/games/valorant/)), Spotify Wrapped 2024 (type as hero on flat fields).
Steam screenshot URLs via `https://store.steampowered.com/api/appdetails?appids=<ID>`: 1353230, 1533420, 1817230,
1294420, 1229490, 553310, 447040.

## Five sub-styles proposed
1. Haçienda / Swiss grid: lime as one highlighter strip on a calm grid.
2. Wipeout / The Designers Republic: extended caps, product-code microtype, stark dark screens, one fluorescent.
3. Neubrutalist sticker: lime fills, 3 px ink borders, hard offset shadows (closest to the sample).
4. Riso two-ink: lime plus magenta or orange; the hard shadow plays the misregistered second ink.
5. Mono-field reveal (Wrapped): whole flat lime or violet fields with giant type, only for wow and busted moments.

## Rules for our flyer UI (WCAG 2 ratios computed by script)
- Lime #C8F000 as text on dark passes: 14.56 on #120B1F, 13.23 on #1E1433. Short key text only, never paragraphs.
- Lime as a fill with dark text is the flyer highlighter: ink #120B1F on lime 14.56, violet #2A1458 on lime 11.89.
- Never lime text or fine lines on light: lime on #F2F0E6 is 1.15. Lime touching orange is 2.17: separate with ink.
- Focus: a 3 px lime ring on dark, an ink ring on light.
- Bars: lime on the #1E1433 track 13.23; danger #FF5A6A on bg 6.33, success #3DDC97 10.87 (hue 154°, distinct
  from lime's 70°).
- In play lime stays small (timer digits, a prompt, the speaker ring), ink panels with a lime key element, the text
  outline over scenery. Loud moments (lobby, reveal, results, busted) may go full flat fields.
- Second colour: deep violet ink #2A1458 is the best partner; violet #6B3CFF only as a fill (white 4.95). Orange
  #FF6A1A a small accent (6.70 on bg), away from player identity (coral 8° vs orange 21°). Magenta #FF3EA5 as fill or
  shadow with ink text (5.93); lime on pink 2.46. Not cyan: it is scene neon, and lime plus magenta plus cyan is
  gamer RGB.
- Next to the aliens: never lime text on character-colour chips (lime on teal 3.83, coral 2.41, violet 2.78). The
  planned "lime-olive" and the mint belly (hue 94°) are near the UI lime: keep the vinyl lime-olive dull and darker.
- Clichés: one saturated accent per screen plus violet ink and no glow (not gamer RGB); yellow-green 70° with violet,
  never a mid green or a glossy sphere (not Xbox); no lime on pure black, mono only for numbers, no scanlines,
  brackets or blinking cursors (not a hacker terminal); real headline structure, never lowercase plain text on lime
  (not Brat).
