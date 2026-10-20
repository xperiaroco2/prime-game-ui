# The new setting's UI vibe (2026-10-20)

The engineer, 2026-10-20 (chat, translated): the game's setting changed, so the UI track now looks for an entirely new
design, with new colours and new fonts; the Toy style does not fit any more; start with research into the new vibe.

## The new setting in short
Read from prime-game's `docs/GDD.md`, `docs/design/COMPASS.md` and `docs/design/m8-match.md`, the private design repo's
MVP freeze (2026-10-20) and the art track's decisions up to art#196 (2026-10-20):
- Aliens at their prime throw the best party on Earth at a lord's country estate at night; humans in disguise spoil
  it. First person, 4-10 players, proximity voice, about 10 minutes. Adult, absurd, deadpan comedy; never childish.
- Characters are soft-matte "designer vinyl toy" aliens: a saturated hue on the head (teal, coral, violet of a planned
  twelve), a pale belly and face, coral lips and lids. They are the most saturated thing on screen; the world is
  realistic and clean, lit by warm windows and magenta, violet and cyan party neon.
- The engineer saved a comic infographic as the reference for the how-to cards (art repo's raw folder,
  `refs/ui-task-cards/README.md`, private).

## The gatherers
Four read-only agents (`ui-reader`, Sonnet), about 160 tool calls in all, nothing downloaded. Image URLs in the
reports were found in page HTML and never fetched; the review page links the sources instead of showing them.

| File | Lens |
|---|---|
| `a-game-uis.md` | 17 game UIs and five vibe families |
| `b-graphic-palettes.md` | Six mood boards outside games, each with a UI palette and WCAG ratios; neon under the Godot-safe limits |
| `c-fonts.md` | 28 OFL fonts with a Cyrillic subset, the ones dropped, and six pairings |
| `d-earth-formats.md` | Broadcast graphics, appliance displays, constructed scripts and diegetic formats; three UI languages |

## The synthesis: five vibes
The manager merged the families, boards and pairings into five directions, each drawn on the review page
(`pages/vibe/`, [artifact](https://claude.ai/artifact/92UtrYbscouh7xj6BrLoM2)) as the same HUD over the estate concept,
a menu card, the palette and the type:

1. **Night flyer**: a 90s club flyer in today's acid version; near-black violet, acid lime, a small orange; Unbounded,
   Onest, Martian Mono. From lens A's family 1, lens B's board A, lens C's pairing 1.
2. **Live broadcast**: aliens redo an Earth TV show; lower thirds, a live bug, a scoreboard, a pink flash kept for the
   reveal; Alumni Sans, Oi for the reveal, Golos Text. Lens A family 2, lens B board F, lens D proposal A.
3. **Appliance with a mania**: a misread appliance display; dark glass, one phosphor colour, unlit segments shown;
   Tektur, Geologica, Martian Mono. Lens A family 3, lens D proposal B; the natural voice of the in-world screens.
4. **Vinyl shelf**: a designer-toy shop's packaging; graphite and bone, one orange line, small tracked labels; Dela
   Gothic One, Wix Madefor Text. Lens B board D; the quietest next to the characters.
5. **Comic sticker**: ink outlines and hard offset shadows on mint and deep purple with acid green, after the saved
   card reference; Shantell Sans, Nunito Sans. Lens A family 5, lens B board C, lens C pairing 5.

Left out as directions: the jet-age lounge (lens B board B: nostalgic, the cream the engineer left behind), the tube
sign (board E: the scene's own magenta and cyan, generic cyberpunk) and glossy toy packaging (lens A family 4: gloss
is a gradient and the register is childish). The glyph sign kit (lens D proposal C) is a thread for any direction, not
a direction.

## Checked on the page
Every font on the page drew ґ, ї, є, і, the apostrophes and № in its own glyphs in Chromium on 2026-10-20 (the page's
last section), so per-glyph coverage is confirmed for those twelve; U+02BC against U+2019 needs a closer look in the
display faces before a pick. Designer origin was not checked (lens C notes it).

## Next
The engineer picks one or two vibes and what to borrow from the others; then three full style directions on the
real screens.
