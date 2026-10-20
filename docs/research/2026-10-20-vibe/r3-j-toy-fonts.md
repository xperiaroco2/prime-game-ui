# Round 3, lens J: fonts for an alien-toy UI (gatherer report, 2026-10-20)

About 28 calls; licence and the `cyrillic` subset read from google/fonts `METADATA.pb`
(`https://raw.githubusercontent.com/google/fonts/main/ofl/<dir>/METADATA.pb`); no font downloaded, no glyph seen.
Looks marked (eyeball) must be seen; alien-ness (A) and childish risk (C), 0-3, are the gatherer's judgment.

## The north-star game's type
The engineer's north star (a private tone reference, unnamed here) has a custom-drawn title wordmark; no UI typeface
is confirmed anywhere reachable (its studio's press kit is empty; Fonts In Use has nothing) (unconfirmed). Its art
director cites 80s and 90s sci-fi films, action figures and playsets, aiming for "toyetic" design and proportions (an
engine-maker interview; link kept out of the repo). So: chunky, rounded, slightly rubbery letters with a rounded sans
as the quiet voice. Community identifications for other games: Among Us's UI a rounded face ("Roostt", Fredoka as
stand-in) ([designbeep](https://designbeep.com/2026/01/16/among-us-font/)); Fall Guys a bold rounded sans
([madegooddesigns](https://madegooddesigns.com/?p=9271)) (both unconfirmed). Fredoka has no Cyrillic.

## Survivors (OFL with the cyrillic subset)
Display: Kablammo (`kablammo`, MORF 0-60; "maximalist curly doodad", Memphis, cartoons and toys; A3 C2), the Rubik
filters Puddles, Microbe, Bubbles, Gemstones, Wet Paint, Vinyl ([Rubik-Filtered](https://github.com/NaN-xyz/Rubik-Filtered);
A2-3 C1-2, logo size only), Climate Crisis (YEAR axis; A2 C1), Orelega One (whimsical Clarendon with oversized ears;
A1 C1), Montserrat Alternates (A1 C0), Prosto One (A1 C1), Days One (A1 C1), Seymour One (A0 C2), Underdog (rubbery
caps; A1 C2), Reggae One, Train One, Rampart One (A2 C1), Geologica (SHRP soft to sharp; A1 C0), Commissioner (FLAR,
VOLM; A1 C0), Shantell Sans (low INFM a quirky sans; A2 C2), Rubik (A1 C1).
Text: Nunito, SN Pro ([repo](https://github.com/supernotes/sn-pro)), M PLUS Rounded 1c, Zen Maru Gothic, Kosugi Maru
(Apache-2.0), Marmelad, Nunito Sans, Onest, Golos Text, Manrope, Wix Madefor Text, Akt; Balsamiq Sans, Neucha,
Pangolin for comic captions only; Exo 2 and Russo One sparingly.
Numbers: Martian Mono, JetBrains Mono, Geist Mono; Rubik, Nunito and Prosto One for soft numerals (tabular figures
unconfirmed; Godot sets `tnum` through `FontVariation.opentype_features`).

## Drops
No Cyrillic: Fredoka, Baloo 2 and siblings, Varela Round, Quicksand, Coiny, Chango, Gluten, Sniglet, Mochiy Pop One,
Dongle, Gaegu, Potta One, Yusei Magic, Jua, Grandstander, Bagel Fat One, Darumadrop One, Lilita One, Titan One,
Bowlby One, Sigmar, Wendy One, Gabarito, Lexend, Rethink Sans, Familjen Grotesk, Tourney, Bungee, Mali, Itim,
Sriracha, Gochi Hand, Nerko One, Boogaloo, Chelsea Market, Ribeye, Rammetto One, M PLUS 2, Share Tech Mono,
Sometype Mono, Spline Sans Mono. Only cyrillic-ext: DynaPuff. Wrong tone: Comic Relief, Playpen Sans, Hachi Maru Pop
(C3); Pixelify Sans, Lobster, Pacifico (nostalgic); Jura, Tektur, Advent Pro (techno).

## Five trios
1. Memphis toy-lab: Kablammo (huge titles only) + SN Pro or Nunito + Rubik 600 numbers.
2. One soft family, deadpan: Geologica SHRP 0 wght 800 + Geologica 400 or Onest + Geologica numbers.
3. Whimsical ears: Orelega One + M PLUS Rounded 1c 500 + Martian Mono.
4. Goo and melt: Rubik Puddles or Microbe, or Climate Crisis (logo and sting only) + Nunito + JetBrains Mono.
5. Quirky grotesk: Montserrat Alternates 800 + Commissioner (FLAR about 50) + Prosto One.
Alternate for comic how-to cards: Underdog + Balsamiq Sans + Rubik.
