# Lens 1: References and style (prime-game UX/UI research, wave 1)

Date: 2026-10-02. Author: research agent, lens 1 of 6. Scope: what makes party and social game UI noticeable,
what would make ours generic, and five style directions for prime-game. Read-only research: nothing was downloaded;
every image is a link. Claims I could not check against a primary source are marked **(unconfirmed)**.

## 0. What the game asks of its UI (the brief in one paragraph)

prime-game is a first-person, stylized low-poly party game for 4 to 10 players with proximity voice. Its pillars
(`docs/decisions/2026-10-01-vision-revision-1.md`): fun from the first second, cringe-fun, an audience that is not
only guys, action over talk, macro skill over aim, death that does not take you out. The UI has two jobs that pull
in opposite directions: a **quiet, readable HUD over a busy 3D scene** (hands, belt, carried package destination,
life state, Tab task screen) and **loud, characterful moments** (lobby, role reveal #175, downed, respawn, end
screen). The one hard constraint that shapes every palette: **ten saturated package colours** already cover the
whole hue wheel (red #E61A1A, orange #F2800D, yellow #F2D91A, green #26B333, cyan #1ACCD9, blue #264DF2, purple
#8C33D9, pink #F266B3, brown #804D1A, white #F2F2F2; converted from `content/tasks/delivery.tres`, whose
`PackedColorArray` I read). Any saturated UI accent collides with one of them.

I measured that collision (WCAG relative-luminance contrast, my own node script, not a tool claim):

| Background | Package colours under 3:1 against it |
|---|---|
| Cream paper #FFF6E5 | orange 2.49, yellow 1.33, green 2.58, cyan 1.83, pink 2.67, white 1.04 |
| Kraft cardboard #C89B6D | all ten (orange 1.06, green 1.10, pink 1.14 are near-invisible) |
| Night violet #2A1F4D | blue 2.44, purple 2.56, brown 2.14 |
| Pale LCD #B9C4A4 | eight of ten |

So **no single background shows all ten swatches**. Whatever direction wins, a package swatch must carry its own
ring (dark outer ring plus light inner keyline), so one of the two rings always clears 3:1. The 3:1 figure is the
WCAG 2.x non-text contrast threshold ([W3C Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html),
not opened this session: **(unconfirmed)** here; lens 6 owns it).

## 1. Reference table

Fifteen references, picked for this game, not for fame. "Borrow" is what we take, never the look itself.

| # | Game | What its UI does well | Link | What to borrow |
|---|---|---|---|---|
| 1 | Among Us | The role reveal is a ritual: a hush screen, then your side and, for impostors, your teammates, as big silhouettes **(unconfirmed, from memory and fan wiki)** | [Fandom: Impostor](https://among-us.fandom.com/wiki/Impostor), [Game UI Database: Among Us VR](https://www.gameuidatabase.com/gameData.php?id=1590) | The choreography for #175 (hush, reveal, teammates for dissidents). Not its look: we are in its genre and must not read as a clone |
| 2 | LOCKDOWN Protocol | Our closest cousin: first-person, tasks, "dissidents"; HUD shows role, task list and minimap, built for mouse and pad **(unconfirmed: store copy, not inspected)** | [Kickstarter page](https://www.kickstarter.com/projects/miragecreativelab/lockdown-protocol/description), [SteamDB](https://steamdb.info/app/2780980/info/) | A negative reference: study it, then diverge in tone (we play roles through actions, not lies) and in look |
| 3 | Goose Goose Duck | The UI agency set "a clear set of rules for the interactive components" so buttons stay findable inside a vibrant palette; dense role screens re-organised by layout logic | [PUNCHev case study](https://punchev.com/cases/goose-goose-duck-let-the-duck-hunt-begin) | A written rule that separates interactive from decorative, essential if our chrome is loud |
| 4 | Fall Guys | Big state screens (Countdown, Qualified, Eliminated, Round over) catalogued as their own screen types; art researched sweets to look "delicious" **(art claim unconfirmed, search summary)** | [Interface In Game](https://interfaceingame.com/games/fall-guys-ultimate-knockout/), [Game UI Database](https://www.gameuidatabase.com/gameData.php?id=305) | Treat Downed, Respawn and End as celebratory set pieces, not text in a corner |
| 5 | Splatoon | High-chroma icons over low-chroma panels; a festive palette as a deliberate break from military darks; a custom liquid typeface **(unconfirmed: secondary summaries; the Medium article returned 403)** | [Game UI Database: Splatoon 3](https://www.gameuidatabase.com/gameData.php?id=1512), [Nintendo: Ask the Developer Vol. 7](https://www.nintendo.com/us/whatsnew/ask-the-developer-vol-7-splatoon-3-part-1/) | The chroma hierarchy is exactly our package problem: quiet panels, loud packages |
| 6 | Lethal Company | UI set in 3270font (an IBM terminal face) and run through the same pixelation as the world, so it feels part of the ship | [Fonts In Use](https://fontsinuse.com/uses/68901/lethal-company-video-game) | UI that belongs to the world's tech and post-process. Health as a figure filling up and visor cracks **(unconfirmed, [fan wiki](https://lethal.miraheze.org/wiki/HUD))** |
| 7 | Buckshot Roulette | Diegetic: lives are defibrillator charges, you sign a waiver; UI font "Fake Receipt" scratched by a pixel filter | [Fonts In Use](https://fontsinuse.com/uses/64498/buckshot-roulette-video-game), [Wikipedia](https://en.wikipedia.org/wiki/Buckshot_Roulette) | A first-launch "sign here" name entry is pure cringe-fun onboarding |
| 8 | PEAK | Passport-style character editor; one stamina bar where each affliction stacks as its own coloured, diagonally striped segment with an icon **(unconfirmed, review and guide sites)** | [Wikipedia](https://en.wikipedia.org/wiki/Peak_(video_game)), [GameRant: stamina effects](https://gamerant.com/peak-all-status-effects/) | Passport or ID card for the lobby player card; colour plus pattern plus icon for multi-cause bars (life panel) |
| 9 | Content Warning | Players type emoticons or text that their diving visor displays; a handheld camera is the core object **(unconfirmed, Wikipedia via search)** | [Wikipedia](https://en.wikipedia.org/wiki/Content_Warning), [Landfall press kit](https://landfall.se/content-warning-press-kit) | A viewfinder frame for spectating; player-authored expressive text as customisation |
| 10 | Untitled Goose Game | Objectives are a to-do list on notebook paper, crossed off, sliding in and out; save files are notebooks **(unconfirmed, blog and wiki)** | [Blog: Goose Game & UI](https://atomicbobomb.home.blog/2019/10/12/untitled-goose-game-and-ui/), [Fandom: To-Do List](https://untitledgoosegame.fandom.com/wiki/To-Do_List) | The Tab task screen as a list whose jokes live in its copy; crossing-out as the progress animation |
| 11 | Jackbox Party Packs | Art leads say the art "sets them apart" on purpose: each game its own look (UPA cartoons, 60s jazz covers, technical drawing), the picker unifies | [Jackbox blog: PP10 art](https://www.jackboxgames.com/blog/behind-the-scenes-of-pp10-art) | A stable shell plus per-mode skins later; style chosen to fit the mechanic, not the genre |
| 12 | Persona 5 | One dominant red, almost no sub-colours, black and white text, a white line that guides the gaze, "pop-punk" balance of mass appeal and attitude | [Persona Central: UI panel](https://personacentral.com/persona-5-panel-concept-development-ui/) **(a fan translation of a CEDEC panel)** | Discipline: one hero tone and attitude in motion and angles, not in more colours |
| 13 | Bomb Rush Cyberfunk | Y2K, stickers and graffiti; the designer's first pass was "too videogamey" until a personal motif (marbling) took over **(unconfirmed, interview via search summary)** | [TouchArcade interview](https://toucharcade.com/2023/12/14/bomb-rush-cyberfunk-interview-game-director-dion-koster-career-soundtrack-vinyl-physical-release-switch-iam8bit-skybound/), [Büro Destruct graffiti](https://burodestruct.net/work/bd-bomb-rush-cyberfunk-graffiti) | Find our own motif instead of genre defaults; stickers as a UI material |
| 14 | WarioWare | One-word imperatives ("Stomp!") before each microgame; instant comprehension; themes relatable across ages **(unconfirmed, interview via search summary)** | [Nintendo Life interview](https://www.nintendolife.com/features/butt-movements-pitches-and-9-volts-retro-microgames-we-speak-with-wariowares-chief-director), [Gingold, Game Studies](https://www.gamestudies.org/0501/gingold/) | Role screen and hints as one big verb ("DELIVER!", "HIDE!") plus a silly line |
| 15 | Overcooked / Moving Out | Order tickets and a moving checklist: the task list is the HUD's backbone, readable in chaos **(unconfirmed, not inspected)** | [GUIDB: Overcooked 2](https://www.gameuidatabase.com/gameData.php?id=235), [GUIDB: Moving Out](https://www.gameuidatabase.com/gameData.php?id=471) | Moving Out's "things to deliver" list is the closest analogue to our Delivery task screen |

Also worth a look but not studied: Party Animals ([GUIDB](https://www.gameuidatabase.com/gameData.php?id=1890)),
Webfishing (made in Godot, cozy social; [Wikipedia](https://en.wikipedia.org/wiki/Webfishing)), Gang Beasts,
Pico Park, R.E.P.O. (no UI source found).

**Non-game trends that fit:**
- **Neo-brutalism:** NN/g (April 2025) defines it as high contrast, blocky layouts, bold colours, thick borders,
  stark single-colour drop shadows and "unpolished" elements; its advice: two or three bold colours, a neutral body
  font, clear hierarchy ([NN/g](https://www.nngroup.com/articles/neobrutalism/)). This maps almost one-to-one onto
  StyleBoxFlat.
- **Safety signage:** ISO 7010 and ISO 3864 code meaning by shape as well as colour: circle with slash prohibits,
  triangle warns, square or rectangle marks safe conditions ([Wikipedia: ISO 7010](https://en.wikipedia.org/wiki/ISO_7010),
  [ISO 3864](https://en.wikipedia.org/wiki/ISO_3864); **(unconfirmed)**, the ISO texts are paywalled). Shape coding is
  colour-blind safe.
- **Memphis** (Milan, 1980, Sottsass): squiggles, zig-zags, neon plus pastel, a rebellion against grey seriousness
  ([Wallpaper guide](https://www.wallpaper.com/design-interiors/memphis-design-group-definitive-guide), **(unconfirmed)**).
- **Y2K** as named by CARI: chrome, blobs, metallic gloss ([Wikipedia: Y2K aesthetic](https://en.wikipedia.org/wiki/Y2K_aesthetic),
  [CARI](https://cari.institute/history), **(unconfirmed)**). Mostly gradients, so not Godot-safe; only its stickers
  and blob shapes travel.
- **Sticker, zine and kids' TV** (UPA-style simple shapes over busy backgrounds, per Jackbox's TimeJinx above).

## 2. Anti-patterns: what would make ours generic

1. **The SaaS dashboard.** White or dark-grey rounded-8 px cards, 1 px grey borders, a blue primary button, toggles,
   14 px neutral sans. It says "settings app". Our greybox theme (`client/ui/theme/game_theme.tres`: near-black
   panels `Color(0.05, 0.05, 0.07)` at 60 to 85 % alpha) is fine for greybox but already sits in this family.
2. **The default sci-fi HUD.** Thin cyan lines on black, corner brackets, hex grids, glitch, techno type. It is sold
   as ready-made kits ([itch.io example](https://vill8tion.itch.io/sci-fi-holographic-hud-kit-cyberpunk-ui-4k),
   [Synty INTERFACE](https://syntystore.com/products/interface-sci-fi-soldier-hud)), it signals "military shooter"
   against our "not only guys" and "macro skill" pillars, and its cyan collides with the cyan package.
3. **Tactical palette:** olive, gunmetal, warning red. Splatoon's team reportedly broke from it on purpose to feel
   festive **(unconfirmed)**.
4. **The Among Us clone look:** beans, the hush screen copied frame by frame, red-vs-blue. Same genre, so every echo
   costs us identity. LOCKDOWN Protocol is the other neighbour to stay clear of.
5. **Rainbow chrome:** decorating panels with saturated hues. The ten packages own saturated colour; a pink button
   next to a pink package is a bug, not a style.
6. **Red team vs blue team.** The default, and both are package colours. Teams must read by shape, word and
   light-versus-dark first.
7. **Glassmorphism and blur.** Low contrast over a moving 3D scene, and in Godot it needs a screen-reading shader;
   StyleBoxFlat has no blur.
8. **Mobile F2P gloss:** gradient bevels, sparkles, ribbon banners. Not Godot-safe (gradients) and it reads as a cash
   shop.
9. **Tiny corner text.** 16 to 18 px labels hugging the corners (today's `HudText` is 18 px) vanish at 1080p in
   first person. Fewer, bigger elements.
10. **Over-diegesis.** Buckshot Roulette can hide everything in the world because it is a slow two-player table game;
    ten players in chaos need a readable layer. Diegetic flavour on slow screens only.
11. **Mean cringe.** "LOL U DIED" mocks the player who is already down. Cringe-fun is self-deprecating and warm; the
    joke is on the situation, never on a person. This matters for the audience that is not only guys.

## 3. Rules every direction keeps (proposed)

- **R1. Packages own saturated colour.** Chrome is neutral or pastel; at most one hero tone per direction.
- **R2. Packages are round.** A package swatch is always a circle (echoing the floor circles) with an ink outer ring
  and a light inner keyline. UI elements are never plain filled circles in a package hue.
- **R3. Teams read without hue:** by shape, word and light-versus-dark. Colour is a bonus.
- **R4. HUD over 3D sits on an opaque or near-opaque panel or carries an outline.** No floating thin text.
- **R5. Personality lives in the big moments** (lobby, role reveal, downed, respawn, end, Esc menu); the round HUD
  stays quiet.
- **R6. Microcopy is part of the style.** The tone is a human decision (texts are reserved).

## 4. Five style directions

Godot facts used below are from the 4.7.2 API dump (`tools/out/godot-api/4.7.2/extension_api.json`) and the
[4.7 StyleBoxFlat page](https://docs.godotengine.org/en/4.7/classes/class_styleboxflat.html): StyleBoxFlat has
`bg_color`, `skew`, per-side `border_width_*`, one `border_color`, per-corner `corner_radius_*`, `expand_margin_*`,
one shadow (`shadow_color`, `shadow_size`, `shadow_offset`) and anti-aliasing; no gradients, no second shadow.
`LabelSettings` has `outline_*`, `shadow_*` and **stacked outlines and stacked shadows**
(`stacked_outline_count`, `add_stacked_outline`, `stacked_shadow_count`). `Control` has `rotation`, `scale`,
`pivot_offset`, `pivot_offset_ratio` and `offset_transform_rotation/scale/pivot` (the latter names exist in the dump;
I did not read their docs, so whether they leave container layout untouched is **(unconfirmed)**).
`StyleBoxTexture` and `NinePatchRect` cover 9-slice textures. A crisp, unblurred offset shadow from one StyleBoxFlat
is **(unconfirmed)**: `shadow_size` is a blur; the safe tricks are thicker right and bottom borders (an "extruded"
edge) or a second panel behind.

### D1. Sticker Bomb

- **Pitch:** every panel is a sticker a friend just slapped on your screen.
- **Mood:** loud, handmade, cheeky, photocopied zine, scrapbook, neo-brutal.
- **Palette:** Ink #1A1424 (text, outlines), Paper #FFF6E5 (panels), Sticker white #FFFFFF (keylines),
  Photocopy grey #8A8492 (disabled, secondary), one spot tone Highlighter lilac #CBB8FF (selection, focus).
  Ink on paper 16.7:1, ink on lilac 10.1:1 (measured). Zines are black-and-white photocopies, so colour arrives only
  as stickers: the ten packages and nothing else saturated. Lilac is a pale tint, far in lightness from the purple
  package. **Teams:** Engineers a white sticker with an ink tick; Dissidents the inverse, an ink sticker with white
  type.
- **Shape language:** rectangles at a 1 to 3 degree tilt, 0 to 6 px corners, 3 px ink border plus a heavier
  bottom-right edge as a block shadow, tape strips, peel corners, starbursts for events.
- **Type idea:** chunky rounded grotesque display for headings; marker hand-lettering for one-word stickers; a plain
  sans for body text. Cyrillic required in all three.
- **Motion idea:** slap-on (scale 1.15 to 1 with a small rotation overshoot), peel-off exits, a jiggle on hover.
- **References:** [NN/g neobrutalism](https://www.nngroup.com/articles/neobrutalism/), Bomb Rush Cyberfunk stickers
  (row 13), Untitled Goose Game list (row 10).
- **Cringe-fun and audience:** stickers carry silly captions ("I'M HELPING!"); sticker and journaling culture is
  broad, not a "gamer" code; a player sticker sheet in the lobby is customisation that is fun before any match.
- **Godot-safe:** panels, borders, extruded edge, tilt, focus states: StyleBoxFlat plus `Control.rotation`.
  Sticker text (white outline then ink outline): `LabelSettings` stacked outlines, confirmed in the API. Needs
  textures: tape, peel corners, torn edges, halftone (small 9-slices, made by us).
- **Risks:** neo-brutalism is a 2023 to 2025 web trend and can read as a startup landing page; clutter if every HUD
  element is a sticker (R5 keeps the HUD quiet); tilted text is harder to read in motion, so tilt only big moments.
  Readability over 3D is high (opaque paper). Cost: medium.

### D2. Parcel Post (unexpected)

- **Pitch:** the whole game is paperwork from a slightly incompetent courier company.
- **Mood:** deadpan, office, kraft cardboard, rubber stamps, receipts, packing tape, "FRAGILE".
- **Palette:** Label white #FBF7EE (panels that hold information), Kraft #C89B6D (frames, backgrounds only),
  Ink #231F1C, Tape #E8D3A8 at about 85 % alpha, one stamp tone Oxblood #7A1F2B (9.5:1 on label white).
  Kraft hides every package colour (all ten under 3:1, measured), so package swatches live only on label white,
  with R2's ring. **Teams:** Engineers get a staff ID badge on a lanyard; Dissidents the same badge with a
  "RETURN TO SENDER" stamp across it, so a dissident seeing their teammates is a stack of stamped badges.
- **Shape language:** shipping labels (square corners, a perforated or torn edge), barcodes as decoration,
  clipboard for the Tab screen (a manifest of packages and circles), stamps at an angle, receipt strips.
- **Type idea:** a typewriter or receipt monospace for labels, a condensed stencil for stamps, a plain grotesque for
  body text. Cyrillic typewriter faces must be checked by lens 4.
- **Motion idea:** stamp thunk (fast scale-down, one shake, a puff), tape-pull reveal (a clipped width tween),
  receipts printing line by line for the end screen.
- **References:** Buckshot Roulette receipt font and waiver (row 7), Untitled Goose Game list (row 10), Moving Out
  checklist (row 15), PEAK passport (row 8).
- **Cringe-fun and audience:** corporate absurdity ("Knocked down. Please fill in form 27-B."), a "sign here" name
  entry on first launch, an "Employee of the round" end card. Office humour is gender-neutral and not violent.
- **Godot-safe:** label panels, stamps as rotated Labels with stacked outlines, a manifest list: StyleBoxFlat and
  Labels. Needs textures: paper grain, kraft fibre, torn or perforated edges, tape, stamp ink roughness, barcodes
  (all simple, self-made).
- **Risks:** **it implies a setting** (a courier firm) while the names are provisional until the setting is chosen
  (V12 in the vision ADR); brown-on-brown can turn muddy over warm levels; it can feel slow if the HUD also becomes
  paper (keep the round HUD to a single label). Cost: medium-high, mostly textures.

### D3. Pocket LCD (unexpected)

- **Pitch:** your HUD is a cheap 1998 virtual-pet toy clipped to your belt.
- **Mood:** Tamagotchi, Game and Watch, calculator, beeps, kawaii plastic, nostalgic, silly.
- **Palette:** LCD background #B9C4A4, LCD segment #262E22 (7.7:1, measured), ghost segments #262E22 at about 12 %
  alpha, toy shell Milk #F4EFE6 with Lilac #B9A7F2 buttons. The screen is monochrome by nature, so colour exists only
  as "stickers" and LEDs on the shell: the packages, which is R1 for free. **Teams:** an Engineer pet with a hard hat,
  a Dissident pet with a bandit mask, both drawn in the same monochrome segments. **Idea:** the shell takes the
  player's chosen body colour, so the HUD frame is personal.
- **Shape language:** a pill-shaped plastic bezel around rectangular LCD windows, segmented bars, pixel icons, two
  or three chunky round buttons as decoration.
- **Type idea:** a pixel font with full Cyrillic for text, 7-segment digits for timers only (7-segment cannot draw
  Cyrillic letters).
- **Motion idea:** stepped frames at 4 to 8 fps with no easing (it snaps), boot flicker, the pet faints when you are
  downed and climbs a ladder of dots while you respawn.
- **References:** Lethal Company's terminal UI that shares the world's post-process (row 6), PEAK's segmented bar
  (row 8). Toy references are from memory **(unconfirmed)**.
- **Cringe-fun and audience:** a pet that reacts to your bad luck is affectionate cringe; virtual-pet nostalgia is
  strongly cross-gender **(unconfirmed)**; it also fits low-poly retro rendering.
- **Godot-safe:** LCD windows, bezels (a big corner radius), segmented bars (one StyleBoxFlat per segment): yes.
  Ghost segments: a second Label behind, at low alpha. Needs: a pixel icon set and pet sprites, pixel-perfect
  integer scaling of the UI at 1080p and 1440p (a technical test), optionally a tiny LCD-tint shader.
- **Risks:** pixel text with Cyrillic at small sizes; a low-contrast LCD if the hexes drift; the toy frame eats
  screen space (keep it to one corner); can feel like a gimmick after an hour. Cost: medium, art-heavy.

### D4. Karaoke Night

- **Pitch:** a late-night karaoke bar where the lyrics screen runs your match.
- **Mood:** neon tubes, velvet, VHS lyrics, bouncing ball, mic feedback, warm embarrassment.
- **Palette:** Night #15112B (backdrops), Velvet #2A1F4D (panels), Tube white #FFF1D6 (text and all chrome glow;
  13.4:1 on velvet, measured). The city is dark and **only the packages glow in colour**: chrome glows warm white.
  Blue, purple and brown packages fall under 3:1 on velvet (measured), so R2's light keyline is mandatory.
  **Teams:** Engineers a steady lit tube; Dissidents an unlit, flickering outline of the same word.
- **Shape language:** monoline rounded outlines (neon tubes), pill buttons, a lyrics band across the lower third,
  a bouncing dot as the cursor and as the countdown.
- **Type idea:** a monoline rounded script or tube display for big moments, a friendly humanist sans for body text.
- **Motion idea:** flicker-on (stepped alpha), the karaoke wipe that fills a word left to right as progress bars and
  hold-to-act timers (hold G to give up, hold E to raise), the bouncing ball over "3, 2, 1".
- **References:** Persona 5's single-tone discipline (row 12); karaoke screens from memory **(unconfirmed)**.
- **Cringe-fun and audience:** karaoke is the definition of cringe-fun, and our core toy is the voice: a
  proximity-voice game whose UI is a karaoke screen tells you to talk. Broadly social, not "gamer".
- **Godot-safe:** the glow is one StyleBoxFlat shadow with zero offset and a tube-white `shadow_color`; outlines are
  borders with `draw_center` off; text glow through `LabelSettings` shadow or stacked shadows. The wipe needs two
  Labels and a clipped container. A real bloom or flicker noise needs a shader (optional).
- **Risks:** synthwave cliché (grids, sunsets, magenta and cyan) if we drift; dark UI over dark levels loses edges
  (the glow helps); glow stacked on many elements costs fill-rate **(unconfirmed)**. Cost: low-medium.

### D5. Safety Card (unexpected)

- **Pitch:** an airline safety card, calmly explaining the chaos you are causing.
- **Mood:** deadpan pictograms, pastel colour fields, calm people in absurd danger, instruction leaflets.
- **Palette:** Card cream #FBF3E4, Pictogram ink #24223A (14:1, measured), pastel fields Mint #CDEFE0,
  Peach #FFD9C7, Sky #D3E4FA, Butter #FFF0B8 (backgrounds only, never small marks, so they never pose as packages).
  **Teams by sign shape** (ISO logic): Engineers in a square "safe condition" frame, Dissidents in a rounded
  triangle "warning" frame. Shape survives every kind of colour blindness.
- **Shape language:** square and triangular sign frames, numbered steps (1, 2, 3 panels), arrows, a pictogram
  person for every state: downed is the calm pictogram lying with three stars; respawn is them stepping back in.
- **Type idea:** a clean transport or DIN-like grotesque, large, sentence case, very legible in Cyrillic.
- **Motion idea:** two-frame pictogram loops, card flips (`scale.x` through zero), unhurried ease-in-out: the
  calmness is the joke.
- **References:** [ISO 7010](https://en.wikipedia.org/wiki/ISO_7010) and [ISO 3864](https://en.wikipedia.org/wiki/ISO_3864)
  shape logic, WarioWare's one-word instructions (row 14).
- **Cringe-fun and audience:** the safety-card voice ("Remain calm. You have been stabbed.") is gentle, absurd and
  non-violent in depiction; pastel fields and pictograms read as friendly, not macho; it doubles as the tutorial
  (first-launch onboarding as a safety briefing).
- **Godot-safe:** cards, square frames, numbered steps: StyleBoxFlat. Triangles, pictograms and arrows: SVG icons
  imported as textures (our own drawings). Hazard stripes: a tiling texture.
- **Risks:** like D2 it implies a workplace setting; corporate-safety humour is common in co-op games such as
  Lethal Company **(unconfirmed)**, so the pictograms must be ours and funny; the joke depends on illustration
  quality (an illustrator's time); pastels wash out over bright scenes (keep them inside opaque cards). Cost: high
  in illustration, low in UI code.

### Wildcards considered and set aside
- **Claymation** (thumb-printed plasticine panels, boiling outlines): very unexpected, but every panel is a texture
  and the wobble a shader. Too costly for a two-person team.
- **Early-2000s messenger** (glossy bubbles, "uh-oh" sounds): strong nostalgia in Ukraine, but gloss needs gradients
  and the famous references are trademarks.
- **Folk pop** (Petrykivka-style flourishes made modern): distinctive and personal for a Ukrainian team, but it
  risks reading as a national theme for a game whose setting is not chosen. A human call if anyone wants it.

### At a glance

| | Light or dark | Readability over 3D | Godot cost | Implies a setting | Cliché risk |
|---|---|---|---|---|---|
| D1 Sticker Bomb | light | high | medium | no | medium (web trend) |
| D2 Parcel Post | light, warm | high on labels | medium-high | yes (courier) | low |
| D3 Pocket LCD | light, mono | medium | medium | no | low-medium |
| D4 Karaoke Night | dark | high, edges need glow | low-medium | mild (bar) | medium (synthwave) |
| D5 Safety Card | light, pastel | high in cards | high (illustration) | yes (workplace) | medium |

## 5. Recommendations

1. Mock four, not five: **D1, D2, D3, D4**; keep D5 as the wildcard (it shares D2's setting risk and costs the most
   illustration). This is a style choice for the humans.
2. Mock every direction on the **same five screens** with the same content so the comparison is fair: role reveal
   (#175), in-round HUD while carrying a package, Tab task screen, downed then spectating, end screen. Add the lobby
   player card if time allows.
3. Put each mock over three backdrops (bright, dark, busy) at 1920x1080 and 1280x720, because readability over 3D is
   the first thing that kills a style.
4. Adopt R1 to R6 now, before tokens: they are cheap and constrain every direction usefully.
5. Write the "Godot-safe CSS subset" before mockups start (lens 3 owns the details): solid colours, per-side borders,
   per-corner radii, one box-shadow, skew and rotate transforms, opacity; no gradients, no second or inset shadow,
   no backdrop-filter or filter; any texture is a declared 9-slice asset.

## 6. Gaps
- Game UI Database pages and the Splatoon article returned HTTP 403; I saw no screenshots, only text. Every visual
  description of a game is from text sources or memory.
- LOCKDOWN Protocol's actual UI, R.E.P.O., Pico Park, Gang Beasts, Webfishing and Party Animals were not inspected.
- Whether one StyleBoxFlat can draw a crisp offset shadow, and how `offset_transform_*` behaves inside containers,
  needs a Godot test (later, in prime-game).
- No licences were checked (lens 4).

## Sources
- prime-game: `docs/decisions/2026-10-01-vision-revision-1.md`, `content/tasks/delivery.tres`,
  `client/ui/theme/game_theme.tres`, `client/CLAUDE.md`, `tools/out/godot-api/4.7.2/extension_api.json` (read locally)
- Godot 4.7 StyleBoxFlat: https://docs.godotengine.org/en/4.7/classes/class_styleboxflat.html
- NN/g, Neobrutalism (2025-04-11): https://www.nngroup.com/articles/neobrutalism/
- Interface In Game, Fall Guys: https://interfaceingame.com/games/fall-guys-ultimate-knockout/
- Game UI Database: https://www.gameuidatabase.com/ (entries 305, 1512, 235, 471, 1590, 1890)
- Fonts In Use, Lethal Company: https://fontsinuse.com/uses/68901/lethal-company-video-game
- Fonts In Use, Buckshot Roulette: https://fontsinuse.com/uses/64498/buckshot-roulette-video-game
- Jackbox blog, PP10 art: https://www.jackboxgames.com/blog/behind-the-scenes-of-pp10-art
- PUNCHev, Goose Goose Duck: https://punchev.com/cases/goose-goose-duck-let-the-duck-hunt-begin
- Persona Central, Persona 5 UI panel: https://personacentral.com/persona-5-panel-concept-development-ui/
- Nintendo, Ask the Developer Vol. 7 (Splatoon 3): https://www.nintendo.com/us/whatsnew/ask-the-developer-vol-7-splatoon-3-part-1/
- Wikipedia: Buckshot Roulette, Peak (video game), Content Warning, Webfishing, ISO 7010, ISO 3864, Y2K aesthetic
- GameRant, PEAK status effects: https://gamerant.com/peak-all-status-effects/
- Lethal Company fan wiki, HUD: https://lethal.miraheze.org/wiki/HUD
- Untitled Goose Game UI blog: https://atomicbobomb.home.blog/2019/10/12/untitled-goose-game-and-ui/
- TouchArcade, Bomb Rush Cyberfunk interview: https://toucharcade.com/2023/12/14/bomb-rush-cyberfunk-interview-game-director-dion-koster-career-soundtrack-vinyl-physical-release-switch-iam8bit-skybound/
- Nintendo Life, WarioWare interview: https://www.nintendolife.com/features/butt-movements-pitches-and-9-volts-retro-microgames-we-speak-with-wariowares-chief-director
- Gingold, What WarioWare can teach us: https://www.gamestudies.org/0501/gingold/
- LOCKDOWN Protocol Kickstarter: https://www.kickstarter.com/projects/miragecreativelab/lockdown-protocol/description
- Wallpaper, Memphis guide: https://www.wallpaper.com/design-interiors/memphis-design-group-definitive-guide
- CARI: https://cari.institute/history
- Sci-fi HUD kits: https://vill8tion.itch.io/sci-fi-holographic-hud-kit-cyberpunk-ui-4k , https://syntystore.com/products/interface-sci-fi-soldier-hud
- W3C, Non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html (not opened)
