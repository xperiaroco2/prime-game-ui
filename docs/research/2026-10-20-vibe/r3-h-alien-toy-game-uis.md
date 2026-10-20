# Round 3, lens H: alien and toy-like comedy game UIs (gatherer report, 2026-10-20)

No image was looked at; looks without a text source are marked (unconfirmed). Blocked: the engine-maker interview,
Interface In Game, ArtStation, Mobius Digital's UI post, the KSP2 forum (403 or 404). No source names the typefaces of
the north-star games.

## The north-star games (a private tone reference, unnamed here; links kept out of the repo)
- The first game's main UI designer published a case study (portfolio page; link in the manager's chat only). Her
  brief: inject the game's irreverent humour into the interface; the art direction was "cartoonish yet sleek, and
  also occasionally peppered with the iconic jank of the 2000's". Screens on that page: HUD, start menu and a "Retro"
  start menu, settings, a minimal PC pause, popups, achievements, collectibles, shop (with a "cannot buy" state),
  dialogue, game over, critical health, shield broken, item pickup, an icon set; no map.
- Menus are in the fiction: opening a menu opens the spacesuit's interface (a review); the VR port's pause screen is
  diegetic.
- The sequel: a boss "hacks your game" through your own menus (a platform holder's news post). Its accessibility menu
  sits on a busy moving ink-splatter ground that hurts legibility, and the selected item turns dark red on white,
  hard to read (an accessibility review). A UX consultancy's playtest note: the guns need clear colour coding,
  iconography and effects.
- The design director: a noir sci-fi film crossed with a puppet show; the art aimed at "toyetic" design (search
  snippet, unconfirmed).
- Reading (unconfirmed): cartoon-sleek plates, sticker and poster graphics, a deliberate cheap-2000s layer, colour
  per character; a menu that is a character.
- Take: UI inside the fiction; a clean base with one intentional "wrong" layer; colour per character; jokes in the
  shop-denied and game-over states. Avoid: busy moving grounds behind text; a selected state darker than the rest.

## Other games
1. **Astroneer**: "reshape alien worlds like clay"; diegetic backpack, panels and catalogue, a ribbon to a held
   object ([Annie Vandermeer](https://www.annievandermeer.com/post/astronattering-diegetic-ui-and-astroneer),
   [Game Developer](https://gamedeveloper.com/business/an-analysis-of-astroneer-s-ui-system)); pastel, rounded
   (unconfirmed). Steam 361420.
2. **Slime Rancher 2**: glossy bubbles, candy hues per slime (unconfirmed); take only one colour per creature. Steam
   1657630.
3. **Ratchet & Clank: Rift Apart**: HUD colour options ([Insomniac](https://support.insomniac.games/hc/en-us/articles/46716208107795-What-Accessibility-options-does-Ratchet-Clank-Rift-Apart-feature));
   gadget shapes and springy motion (unconfirmed). Steam 1895880.
4. **Destroy All Humans! 2 Reprobed**: in-game Cold War and free-love satire posters
   ([Room 8](https://room8group.com/cases/destroy-all-humans-2-reprobed-2d-art-from-outer-space/)). Take: fake adverts
   as the joke layer.
5. **The Outer Worlds**: text too small at launch, a size slider added
   ([Destructoid](https://www.destructoid.com/?p=248603)); corporate-ad satire (unconfirmed). Steam 578650.
6. **Psychonauts 2**: hand-made wobble (unconfirmed). Steam 607080.
7. **Kerbal Space Program 2**: a junkyard pseudo-metal UI for the DIY programme (second-hand),
   [UX dev diary](https://kerbalspaceprogram.com/news/dev-diaries-developer-insights-7-ksp-2-ux-architects).
8. **Astro Bot**: pillars "Magical, Innovative, Playful, Inclusive"
   ([PlayStation Blog](https://blog.playstation.com/2024/09/09/astro-bot-how-team-asobi-created-a-unified-vision-for-fun/)).

## Five alien-toy recipes (Godot-safe)
1. **Vinyl pebble**: no outlines; plates with unequal corner radii (28/28/28/8) like poured blobs; pill buttons; dark
   tinted character hues as fills, mint text, the full hue for the selected item; one soft shadow.
2. **Ink-and-mint sticker**: rounded panels with a 4-6 px plum outline, hard offset shadow, rotated sticker labels;
   mint on deep purple, acid green, one warm coral; chunky caps.
3. **Alien OS that misread Earth**: clean 10-14 px radii, 2 px frames, tab corners, serial and barcode microtext;
   near-black plates, mint text, coral warning, violet focus; a confident wrong joke line per screen.
4. **Collector box**: mint label plates with a thick coloured tab on one side, "No. 07/12"; one hue per player.
5. **Space-age lounge**: big squircle-like plates, double frames; tangerine, teal, cream on night plum; for ad props
   only (risk: nostalgic).
Gatherer's lean: 1's shapes with 3's voice, 4's tab for player identity, 2 for wow moments and how-to cards, 5 for
props.
