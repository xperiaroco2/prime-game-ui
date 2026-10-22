# Round 2: mid-20th-century American commercial art for the how-to cards

2026-10-22. The engineer picked round 1's direction 1 (three-ink screenprint) and asked to go deeper into mid-century
American commercial art (print ads, enamel and tin signs, safety posters with a cartoon mascot). His reference images
stay private. Gathered by one web-research agent. Print mechanics rest on encyclopedia pages; the style claims
(palettes, proportions, composition) are mostly craft knowledge and say "(unconfirmed)". The hex values are the agent's
approximations.

## The era's visual grammar
- **Line:** print needed solid black line art, shading as hatching or patterns; inkers vary the weight
  ([Inker](https://en.wikipedia.org/wiki/Inker)). Brush thick-thin against an even pen line is craft knowledge
  (unconfirmed). Jointless rubber limbs faded after the late 1930s
  ([Rubber hose animation](https://en.wikipedia.org/wiki/Rubber_hose_animation)).
- **Flat colour, few inks:** screenprint lays one colour per screen
  ([Screen printing](https://en.wikipedia.org/wiki/Screen_printing)); 1930s–40s public-information posters were often
  silkscreened ([LoC record](https://www.loc.gov/item/98516617)); workplace safety posters used humour against accidents
  ([AWM](https://www.awm.gov.au/collection/C97266)); offset on newsprint soaks the ink in
  ([Offset printing](https://en.wikipedia.org/wiki/Offset_printing)); a duotone overprints a second ink, black with
  blue, yellow, brown or red ([Duotone](https://en.wikipedia.org/wiki/Duotone)).
- **Dots:** Ben-Day dots are uniform, applied to line art, the cheap shading of colour comics
  ([Ben-Day dots](https://en.wikipedia.org/wiki/Ben-Day_dots)); newspaper screens ran about 85–105 lpi, rotated angles
  avoid moiré ([Halftone](https://en.wikipedia.org/wiki/Halftone)).
- **Registration:** misregistration makes edge fringes, white gaps or overprint; trapping spreads the lighter ink
  under the darker; black often overprints ([Printing registration](https://en.wikipedia.org/wiki/Printing_registration)).
- **Paper and wear:** newsprint yellows (lignin) ([Newsprint](https://en.wikipedia.org/wiki/Newsprint)); foxing is
  reddish-brown spotting ([Foxing](https://en.wikipedia.org/wiki/Foxing)); fired enamel does not fade, it chips and
  crazes ([Porcelain enamel](https://en.wikipedia.org/wiki/Porcelain_enamel),
  [Enamel sign](https://en.wikipedia.org/wiki/Enamel_sign)), so "faded enamel" is wrong and chipped corners are right.
- **Composition:** atomic-age starbursts, boomerangs, atoms; optimism peaking in the 1950s
  ([Googie architecture](https://en.wikipedia.org/wiki/Googie_architecture)); curved, pastel consumer design
  ([Populuxe](https://en.wikipedia.org/wiki/Populuxe)). Pointing hand, insets, before/after pairs: craft knowledge
  (unconfirmed).
- **Mascot arc:** 1940s rubber limbs and gloves; 1950s near-cartoon naïve charm
  ([dealer's primer](https://www.internationalposter.com/style-primers/1950s-style-posters/), a search snippet);
  TV's simplified drawing from 1957 ([Limited animation](https://en.wikipedia.org/wiki/Limited_animation)); 1960s mod
  geometric and lineless (unconfirmed).

## Cheap against authentic (inferred from the process facts)
- Cheap: grunge everywhere and on the characters; muddy colours and gradients; halftone of several sizes or angles;
  identical random misregistration; pseudo-lettering; perfect vector outlines; wear that ignores the process.
- Authentic: one dot size and angle per ink; 2–4 inks, overprint making the third; one consistent registration
  offset; wear that follows the material (paper edges, enamel corner chips, tin edge rust); real brush thick-thin;
  readable composition first, wear last.

## At 160x120 (agent's working figures)
Key shapes over 8 px; the face 30–40% of the frame width; outline 3–5 px; dots only in big background areas, at most
about 12 across the frame, never on faces or the action; wear only in the outer 8%; offset 2–3 px; the action pair in
the two strongest inks; test in greyscale on the dark tile.

## Ten sub-directions (as run in prime-game-art batch `2026-10-22-howto-styles-r2`)
| # | Name | Era, process | Palette | Risk |
|---|---|---|---|---|
| 1 | Two-ink safety sheet | 1940s, two-ink offset, brush line, rubber-limb mascot | #F1E4C3 #D8432B #23305A | three tones only |
| 2 | Four-colour ad page | 1950s magazine, Ben-Day dots in backgrounds, fine pen | #00A6D6 #E5367A #FFD93B #1B1B1B on #F4EBD3 | moiré when small |
| 3 | Enamel sign | 1940s–50s, glossy flat fills, thick rim, corner chips | #F5F0E1 #C8102E #0B3D91 #F6C700 #111111 | icon-like if too clean |
| 4 | Off-register spot screenprint | 1950s modern, no outline, offset keyline | #F2E6C8 #1FA6A0 #F26B4F #232A3B | close to round 1 |
| 5 | Newspaper spot colour | 1940s grocery ad, black and one red, hatching | #E9DFC6 #1E1E1E #D63A2F | cramped when small |
| 6 | Atomic starburst panel | 1950s, sunburst, boomerangs, winking mascot | #1FA6A0 #F26B4F #FFC93C #1D2A44 #F4EBD3 | background overpowers |
| 7 | Mod cut-paper | 1960s, lineless geometric blocks | #F26B21 #E8508F #8A9A2B #4B2A5C #F4EBD3 | details vanish |
| 8 | Leaflet line manual | 1950s instruction leaflet, pen line, one offset spot | #F3EAD2 #202A3A #E8672C | thin line when small |
| 9 | Diner-menu gouache | 1950s, opaque paint, dry-brush edges | #D93A3A #F2B632 #3FA796 #3A2A22 on #F6ECD6 | muddy when small |
| 10 | Worn tin litho | 1940s, bold line, rust on the border only | #E4D3A8 #B5382A #2D5C7A #EAB83A #2B2220 | wear competes |

The agent's bets: 6, 1, 3.
