# UI decisions so far

The engineer's decisions for the game's UI, 2026-10-02 and 2026-10-03, with where each was recorded (comments on
[prime-game #150](https://github.com/xperiaroco2/prime-game/issues/150), the game issues). The engineer answered as the
designer too. The wireframes that show them: the `pages/wireframes/` page. A newer decision replaces an older one; record
a change here in the same PR as the page change. A decision marked "(agent)" was taken by the agent alone under the
trust rules in `CLAUDE.md` (small and easy to change); the engineer can veto it at any time.

## The new setting (2026-10-20)
- **A new design for the new setting** (the engineer, 2026-10-20, chat, translated): the game is now an alien party
  (prime-game `docs/design/COMPASS.md`, `docs/design/m8-match.md`; the MVP's design frozen on 2026-10-20), and the UI
  track's job now is to find an entirely new design for it, with new colours and new fonts; the Toy style below no
  longer fits. The work starts with research into the new vibe (`docs/research/2026-10-20-vibe/`, the
  [vibe page](https://claude.ai/artifact/92UtrYbscouh7xj6BrLoM2)). Until a new style is chosen, the sections below stay
  as the record of what the game ships today; a choice that replaces one of them says so here.
- **The Night flyer vibe** (the engineer, 2026-10-20, chat, translated, on the vibe page): of the five vibes the first,
  the Night flyer, fits best; he likes its acid green; its fonts are more or less fine; some moments he likes and
  some not. Next: deeper research and five variants close to it
  ([the variants page](https://claude.ai/artifact/PhwP9sUpF8rUKAMQchnjvA), `pages/vibe-flyer/`).
- **Not the flyer: alien and toy-like** (the engineer, 2026-10-20, chat, translated, on the variants page): none of the
  five flyer variants; techno and acid are wrong, because the party is at an estate in the woods, not in a club. The
  UI must feel alien and toy-like, like the vinyl-toy characters; look at how the alien comedy and space games he
  takes as the game's north star build their UI (a private tone reference, not named here). Round 3 of the research
  starts from that.
- **Ink and mint sticker** (the engineer, 2026-10-20, chat, translated, on the
  [alien toy page](https://claude.ai/artifact/2pqA9gzCUXEvLaEHT8432B)): direction 4, "really liked it, especially the
  colours": deep purple panels, mint plates, ink outlines and hard ink shadows, the alien green for the main action, a
  coral for alarm. Next, shown on five real screens in three strengths (calmer, as picked, louder) for him to pick
  ([the screens page](https://claude.ai/artifact/HtfG17WM8Wok5TqMkrQZkf), `pages/sticker/`) (agent).
- **Strength B, the alien title face on the logo only** (the engineer, 2026-10-20, chat, translated, on the screens
  page): the middle strength (4 px ink outlines, 5 px hard ink shadows, stickers tilted a few degrees); the cartoon
  title face (Kablammo) stays only on the logo for now, because using it everywhere is too much; every other title is
  Nunito Black, the text Nunito, the numbers Rubik. This is the new style that replaces Toy; its tokens and components
  come next.
- **No tilts for now; motion later** (the engineer, 2026-10-20, chat, translated): the colours and fonts look great;
  drop every tilted sticker and plate for a start, and add tilts back only where needed. An idea he likes, for later:
  a button shakes while the pointer is over it (the Ready button, for example), and pressing it gives a small effect,
  "a micro-game" that feels good to the player; he calls such things showing off, so not in the first version.
- **Less screen for the UI: 0.75 of the first MVP sketches** (the engineer, 2026-10-20, chat, translated, on the
  [MVP screens page](https://claude.ai/artifact/NHnqKdtYaNP9mDHdWE2FUy), `pages/mvp-screens/`): the interface took too
  much of the screen at the first sketches' size; 0.5 was too small; 0.75 is right. At 1920x1080 that keeps the text
  about as the pack ui-1.1.0 draws it and makes outlines, shadows and plates about 1.5 times the pack's; the pack
  follows when the screens are reworked for the MVP.
- **The roster in the round, and humans see each other** (the engineer, 2026-10-20, chat, translated, on the MVP screens
  page): the top right corner of the round HUD lists the players with their body colours, and a human sees who else is
  human. On the page: a slim purple list with a colour dot per name, the player's own name in green, the dead dimmed,
  and a coral "людина" tag on the other humans in a human's list (agent); the human's role reveal names the other
  humans. Whether a mark over another human's head is still needed in the world stays open. The game-design side (the
  humans know each other) is passed to the design track, prime-game#1095.
- **The round timer has no plate** (the engineer, 2026-10-20, chat, on the MVP screens page): mint Rubik digits with
  the ink text outline, centred at the top, the anger bar under it.
- **The top of the round HUD** (the engineer, 2026-10-20, chat, on the MVP screens page): the time with no plate, the
  neighbours' anger right under it, the bar itself exactly centred (its siren hangs off the bar's right end), and the
  roster at the top right. This replaces "only the time at the top" (Styled screens below). The anger meter's look
  (A a bar, B pips, C the siren filling up) is still his to pick.
- **No points on the HUD** (the engineer, 2026-10-20, chat): the points show only on the mutation workbench screen.
- **The sticker tokens, ui-1.0.0** (the re-skin of every Toy variation; the guide is
  `docs/research/2026-10-20-vibe/restyle-guide.md`). The look choices the agent took alone:
  - state shades inside the palette: mint, green and coral each one step lighter for hover and darker for held, a
    lighter purple `#3C2660` and a soft ink `#54457A` (agent);
  - a pressed sticker does not move: hover lightens the face, held darkens it, the shadow stays (agent);
  - unplugged (disabled): the lilac `#B7A8D6` face, soft-ink outline and label, no shadow (agent);
  - every context keeps its place in the game, so the inside of a panel is purple with mint text, and text on a mint,
    green or coral face is ink (agent);
  - HUD plates are mint stickers with ink text, as on the sticker page (new plate labels for dim text, titles and the
    timer, so the game switches those labels); the alert plate is coral; the mic badge, name plates and the bar caption
    stay purple with mint content, since the coral mic-off icon needs the dark face (agent);
  - a plate with no base layer in the game draws its hard shadow as thicker right and bottom ink edges (agent);
  - type: text Nunito 800, bold roles and titles Nunito Black 900, numbers Rubik 700 (the display roles), a logo role in
    Kablammo; the sizes stay (agent);
  - ghost buttons are borderless with mint labels (agent);
  - main-menu entries are mint sticker buttons with the edge-form shadow; the open entry is green, as on the screens page
    the engineer picked; they stand 12 px apart so the shadow clears the next entry (agent);
  - the title plate is a purple sticker around a green title; titles carry a 4 px ink outline (agent);
  - the backdrop over the world is the deep purple at 82 % (Toy's was 74 %), so dim text passes 4.5:1 over a white
    world (agent);
  - chips are flat pill stickers with a 4 px ink outline, every label Nunito Black; only the selected toggle chip casts
    the hard shadow; the highlight chip is green; the HUD plate chip stays purple with mint text (the map's "you are
    here" caption shares it); line chips keep a 4 px mint outline on no fill (agent);
  - idle Esc tabs are bare mint labels with a lighter-purple hover; the selected tab is a flat mint sticker, radius 12,
    no shadow (agent);
  - the check box is borderless on the purple with a mint label, its box (mint, green when checked, 4 px ink) draws the
    state; radios are mint and green discs with a 4 px ink outline (agent);
  - a setting row is a borderless lighter-purple band (Toy's underline dropped), its name mint and value lilac; the
    stepper is a mint sticker (agent);
  - the text field and dropdown are mint plates with the hard shadow; the SpinBox and its green arrows are flat;
    read-only and unplugged lose the shadow; the open list is mint with a darker-mint hover row (agent);
  - focus rings on the purple are mint, inside a mint face ink; the chosen swatch's ring is green (agent);
  - slots are mint stickers, the active slot green, labels ink (empty: soft ink) (agent);
  - keycaps are mint with a 3 px ink outline and a 5 px ink bottom edge; quiet keys are lilac with an ink name (soft ink
    is 3.8:1 there) (agent);
  - bars: white tracks with a 3 px ink outline; the HUD fills end in a 3 px ink edge; progress and slider fills are
    green with an ink outline; the slider knob is mint with an ink outline (agent);
  - progress and slider bars are 16 px tall (as the track), so a 10 px green face shows inside the 3 px ink (agent);
  - a selected tab, toggle chip, preset card or radio lifts to its lighter shade on hover, as its idle twin (agent);
  - ghost buttons take Nunito Black like every other button (agent);
  - map rooms are mint with ink names, no shadow; the room pictograms take the sticker ink; the crosshair is a white dot
    with an ink ring (agent);
  - titles on dark and in panels are green Nunito Black with the 4 px ink outline; the big readout and the timer are
    Rubik in mint (agent);
  - preset cards are mint stickers that do not move (hover lighter, held darker, selected green, notes soft ink); the
    quiet "save your own" card is lilac with a soft-ink outline and an ink label (agent);
  - how-to frames are mint plates (green when done) with the hard shadow as thicker right and bottom ink edges, the
    caption ink (agent);
  - contrast: an ink outline or shadow on the purple vanishes (1.0 to 1.1:1), so there the sticker's face carries its
    edge and the gates pair the face with the purple; bar fills on the white track (1.4 to 2.3:1) are waived, since each
    fill's ink end edge or outline marks where it ends (agent).
- **Line height from the fonts, ui-1.1.0** ([#75](https://github.com/xperiaroco2/prime-game-ui/issues/75)): each
  family's own line box, the line Godot draws (Nunito 1.364, Rubik 1.185, Kablammo 1.292 em, was 1.25); the HUD bar
  track's content margin 4 to 3 px, so the 10 px fill sits flush inside the outline (agent).

## Principles
- **The UI never tells the player what to do.** No "take it to X" line, no destination marker, no key prompts on the HUD;
  the player reads the world (labels and room signs) and the map. Learning is separate from playing.
  ([no hints](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5960844470))
- **Less text on screen**: what can be learned once is taught by the tutorial, not repeated on every screen.
  ([less text](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5968715316))
- **English and Ukrainian from the start**, a language choice on the first launch and in the settings, every player in
  their own language ([prime-game #208](https://github.com/xperiaroco2/prime-game/issues/208)).
- **Players are experienced; the game is not for kids.** They have played many similar games: never explain
  conventions or the obvious (that the Esc menu does not pause, that something is new, familiar controls). No
  hand-holding text. (The engineer, 2026-10-05, reviewing the copy deck, prime-game-ui#4.)
- **Simple, but not ugly**; references liked: A Short Hike, LOCKDOWN Protocol's HUD layout (more readable), PEAK,
  Overcooked's cards. ([references](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5955158412))

## Learning
- **Tutorial:** a separate room, skippable, on the first launch; it teaches the basics (moving, hand and belt, raising
  and giving up, voice, death and spectating, menus) and how to find out about any task: open the map (M), press "?".
- **How-to cards** per task type: 3 to 4 drawn panels with a few words, calm like an airline safety card with one funny
  panel where it fits; not videos. Opened by "?" on the map screen; shown once on the loading screen for a task type not
  done yet (at most twice); all of them in a Guide tab of the Esc menu. Cards for tasks first. No practice stations in the
  lobby. ([prime-game #254](https://github.com/xperiaroco2/prime-game/issues/254),
  [answers](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5968611538))
- **The cards are wordless** (the engineer, 2026-10-07, chat; this replaces "a few words" above): the pictures alone
  explain the task, with no captions; a caption under each panel reads like explaining to a child. The card art should
  be a fun, good-looking cartoon; the engineer named Overcooked's characters as an example of what looks good.
  The first four agent-drawn styles (`pages/card-art/`, 2026-10-07) were all rejected as ugly (big noses, clumsy hands);
  the next round starts from references
  ([prime-game-ui#3](https://github.com/xperiaroco2/prime-game-ui/issues/3#issuecomment-6033534497)).
- **The cards are the wireframe sketches done well** (the engineer, 2026-10-07, chat). The engineer shared a screenshot
  of Overcooked's chalk "how to make sashimi" board. They meant only that each step is clear at a glance, drawn in a
  fun comic way ("you grab it, you deliver it"), not chalk.
  - The first sketches of the cards (`pages/learning/`, section "Як це виглядає") already looked good to them, because
    they had no extra text.
  - Keep them as simple as possible. The game is for adults: nothing childish and no hand-holding.
  - Round 2 polishes those sketches instead of drawing a new cartoon world. The reference board of round 2
    ([page](https://claude.ai/artifact/Kvs7FghnBKwuCsYBLexMr9)) is not needed for the choice.
- **The card art style is the clean sketch** (the engineer, 2026-10-07, chat, on the
  [round-2 page](https://claude.ai/artifact/VQYpBbpZpM1PSptNyAME8h)): it looks as if drawn in pencil in a notebook.
  The look is set by `pages/card-art/round-2/clean-sketch/`:
  - a stick figure with a round head and a few-stroke face;
  - a dark ink line with a hand-drawn wobble;
  - one amber accent for what matters;
  - a small gag per card.

  The bold-silhouette style is not adopted. Card rules (agent):
  - no letters or digits, only pictorial symbols (? ! a tick, arrows, motion lines);
  - the same figure and view in every panel;
  - a room's pictogram is the same glyph on the package, the map and the door plate;
  - the art ships to the game as PNG at 2× (it uses browser SVG filters).
- **The House's Delivery by meaning card is set A, the gnome to the garden** (the engineer, 2026-10-14, chat,
  [prime-game-ui#60](https://github.com/xperiaroco2/prime-game-ui/issues/60)): take the gnome off the storage shelf,
  picture it among flowers, set it down in the garden's bed; the finish frame's gag is the figure resting under the
  terrace parasol. Sources `pages/card-art/round-3/a/`, shipped as `dist/pack/cards/delivery-meaning-1.png` to
  `delivery-meaning-4.png` (task `delivery`); the round-2 colour frames `delivery-1..4.png` stay for the greybox's
  `colour_delivery`. The critic's last small points, polished before shipping (agent):
  - frame 1: the dashed gap the gnome left on the shelf is the gnome's own outline at its size (boots, coat, hat brim,
    cone), not a larger arch with a triangle that read as a house;
  - frame 3: the round bush is a small garden tree with a trunk on the ground and a taller crown, so at 160×120 it no
    longer reads as a cloud and the scene's top is less empty;
  - frame 4: the resting figure in the background has a plain smiling face in profile (one eye, a smile) instead of
    sunglasses, which merged into one dark blob at 160×120.
- **Loading-screen tips** are funny.
- **A "with hints" host setting** (markers through walls, highlights) is dropped for now: a future idea, only if real
  maps prove too hard.

## Screens
- **Main menu:** A Short Hike's few words; host, join with a code, tutorial, settings, quit. No server browser.
  **Join with a code** (the engineer's M6 decision D19 in prime-game, `docs/decisions/2026-10-04-m6-playable-over-the-internet.md`
  §2.3 and §3, [prime-game #373](https://github.com/xperiaroco2/prime-game/issues/373)): "Join with a code" (a field
  and Join), Host (a room with a code), and "Direct (LAN or VPN)" (address and port) with its own host button, as the
  game already does (agent). A failed join shows its reason on the connecting screen; Back returns to the menu
  with what was typed kept (agent).
- **Connecting:** "Connecting to <lobby name>…"; the host names the lobby
  ([prime-game #214](https://github.com/xperiaroco2/prime-game/issues/214)). It names the step (finding the game,
  connecting, joined) and each failure in plain words (M6 §3).
- **Lobby:** in the world (already built); ready state and players; the mic as an icon. The room's code, with Copy,
  to whoever knows it (the host and each player who joined with it); never an address (M6 §3).
- **Esc menu** over the running game (no pause): Game, Role (own role, goal, a scrolling teammate list for dissidents:
  a proposal), Guide, Lobby (one settings view for everyone, the host edits, presets as cards; easy and complex tasks with
  a subtask count, [#256](https://github.com/xperiaroco2/prime-game/issues/256)), Character (changes only in the lobby),
  Settings (with Language).
- **Pre game** (role reveal) and **post game** (round end): black intro and outro of about 3 s each, nobody hears
  anybody and no text says so, one sound per role in pre game, one sound for win and loss; post game returns everyone to
  the lobby after 3 s; roles are not revealed at the end
  ([#213](https://github.com/xperiaroco2/prime-game/issues/213), [#212](https://github.com/xperiaroco2/prime-game/issues/212),
  [#175](https://github.com/xperiaroco2/prime-game/issues/175)). Goals are generic: Engineers complete the tasks,
  Dissidents get in their way.
- **Round HUD:** only the time at the top (task progress lives on the map screen); health and stamina always (stamina in the toy yellow; health green when full and turning red as it runs low, the colour computed from the fraction; both on a dark outlined track; the bar length is the real cue for colour-blind players); the mic as
  an icon, crossed out when nobody hears you; a hand slot and a belt slot, the hand slot widening into a rectangle while
  carrying with both hands; a small role chip; the object's name under the crosshair; no walk/run indicator, no player
  list, never who knocked you down.
- **Name plates** in line of sight within about 10 m; a dissident sees a mark next to a teammate's name, nobody else
  does ([#257](https://github.com/xperiaroco2/prime-game/issues/257)).
- **Map and tasks on M**, press to open and close, walking allowed: task counters without descriptions, "?" per task
  (no NEW tag: see Texts), a map with "you are here" and room names, hovering a task lights up zones; no circles, players, items, role or
  teammates. Tab is kept for an inventory later ([#253](https://github.com/xperiaroco2/prime-game/issues/253),
  [#258](https://github.com/xperiaroco2/prime-game/issues/258)).
- **Downed:** "Hold F to give up" (F instead of G; every key rebindable,
  [#211](https://github.com/xperiaroco2/prime-game/issues/211)). **Spectating:** only "Watching: <name>" and the time to
  respawn.

## Delivery (the designer's answers)
Packages have no colours, start in the storage room and carry their destination room's pictogram (no word); the same
sign marks the room on the map, the door and the spot, its look waiting for the style; no destination marker
([#255](https://github.com/xperiaroco2/prime-game/issues/255),
[answers](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5968656240)). Wave 1's package-colour and
colour-blindness work therefore applies to body colours only.

Room signs, decided by the agent from the "UI never tells" principle (agent): hovering the Delivery task on the map
lights only the storage room, never the rooms still waiting for a package; the HUD hand slot does not repeat the carried
package's sign; there are no direction signs at corridor junctions (signs mark rooms, not routes). The room list of the
room-signs page (the storage room and the hall take no deliveries) is a proposal for the designer's map
([prime-game #306](https://github.com/xperiaroco2/prime-game/issues/306), #146).

**Room signs** (the engineer, 2026-10-05, after the [room-signs page](https://claude.ai/artifact/ANqfgCi35uedLBffJr4F75);
[prime-game-ui#6](https://github.com/xperiaroco2/prime-game-ui/issues/6)): a mix, kept light while the game builds
mechanics and its art style is open. **On the wall by the door:** the shaped plates of system B (each room its own
plate shape with its pictogram), flat on the wall, not a hanging shop sign. **On the package and on the map:** the plain
pictogram (system B's icons, `pages/room-signs/systems/b/icons/`) with no plate, like a stamp. **The delivery spot:** for
now only a marked area in the room (a lit zone the player sees on arrival, like a delivery zone in GTA), one per room;
its real form waits for game design. No deeper design work on signs until the game's look is set.

## Texts
The engineer's word choices and removals, 2026-10-05, on the [copy page](https://claude.ai/artifact/XTywwaVhBdvGKEgdw4xL4s)
([prime-game-ui#4](https://github.com/xperiaroco2/prime-game-ui/issues/4)); the deck is `copy/strings.csv`, its rules
`copy/README.md`.
- **No gender in player-facing text**, and the player is «ти» everywhere.
- **Words:** «задача» for tasks (it sounds technical, and the players are engineers), «мапа» («Завантаження мапи»),
  «шаблон» for a preset («Шаблон: Звичайний», «Швидкий», «Зберегти свій»), «Нокдаун» for the downed lesson and guide
  page, «Готовність» for the ready button, «Доставка» for the delivery lesson; «матч» stays in «Тривалість матчу».
- **Sentence case** in every string, small labels too («Рука», «Пояс», «Ти тут», «Готово», «Версія 0.4»).
- **No «ми» voice:** «Підключення до «{lobby}»…», «Підключення…», «Готові 3 з 4» (no «Чекаємо на всіх»).
- **Removed hand-holding:** that the Esc menu does not pause the game, that the language changes at once, that everyone
  sees character changes, the loading screen's "a task that's new to you" sentence (the how-to card stays,
  prime-game#254), the map's NEW tag (the «?» stays), and the tutorial's sprint-and-jump and "new task" lessons (moving,
  looking, sprinting and jumping are one «Керування» lesson).
- Kept as is: «Ти хост: зміни бачать усі».
- **Round 3** (the engineer, 2026-10-06, the texts of the styled screens, prime-game-ui#19): the recommended wording
  everywhere (the connecting steps and failures, the room code, the lobby, leaving, presets, voice settings, controls,
  the tutorial steps, the delivery card), except: the main menu says «Приєднатися» (with a code) and «Приєднатися за
  адресою» (Direct); the voice mode is «Голосова активація» (the engineer offered it or «Активація голосом»; the agent
  took the first) (agent); the master slider is «Загальна гучність»; «Приєднатися до гри» and «Лише та сама мережа» are
  removed.
- **Round 4** (the engineer, 2026-10-13, the rows the game's M7 asked for, prime-game-ui#51, released in ui-0.6.0): the
  throw control is «Жбурнути» / "Toss"; crouch is «Присісти» / "Crouch" (prime-game PR #947); everything else as
  recommended: 33 House rooms plus «Навчання» for the tutorial room (`room.<id>`, «Склад» and «Кухня» reused), the
  throw lesson («Кидання», «Кинь предмет», «Візьми предмет у руку й натисни {key}»), four lobby shortfall lines and the
  Voice card's third frame «У нокдауні й після смерті тебе ніхто не чує». The upper floor's landing is «Верхній хол»,
  not «Хол», because the greybox's `room.hall` already reads «Хол» (agent).
- **Round 5** (the engineer, 2026-10-14, Delivery D2's item names and the sneak control, prime-game-ui#57, released in
  ui-0.7.0): every question as recommended: «Вино» / "Wine", «Моторна олива» / "Motor oil", «Садовий гном» / "Garden
  gnome", «Парасоля» / "Parasol" (`item.wine`, `item.oil`, `item.gnome`, `item.parasol`); the sneak control is
  «Крастися» / "Sneak" (`control.sneak`); the throw keeps two words, «Жбурнути» in Controls and «Кинь предмет» /
  «Кидання» in the lesson.

## Style
The engineer chose **Toy** (2026-10-03): chunky rounded shapes with a thick plum outline, cream panels, sunny-yellow buttons with a solid toy base that look pressable, and a small, calm HUD; it reads as arcade and game-like. **No tilted plates** (they break the design). **Press feedback** on the voluminous buttons: the button sinks onto its base when pressed (a pressed StyleBox and a short Tween in Godot; previewed in `pages/styles/motion-preview.css`). Safety card was liked but reads too much like an office; Quiet retro was not chosen. The 10 character colours proposed by the retro skin are not adopted. ([prime-game-ui#2](https://github.com/xperiaroco2/prime-game-ui/issues/2))

**Toy look details** (the engineer, 2026-10-03, on the [look-choices page](https://claude.ai/artifact/2gRChgdYcCBNUCbggt3z2S);
[prime-game-ui#5](https://github.com/xperiaroco2/prime-game-ui/issues/5)): a disabled control is "unplugged" (no base,
pale lilac face, muted outline and label); keyboard and gamepad focus thickens the outline inward from 3 to 6 px (ink;
cream on ghost buttons on dark), chips, the stepper and radios get a 3 px ring 2 px outside; hover and held on flat
controls (ghost buttons, line chips, idle tabs) is a quiet fill, night plate on dark and lavender on light (the
dropdown follows the same rule: (agent));
a coral danger button for the host's «Покинути сесію» and its confirm dialog; large text ×1.25 for 18 to 36 px (48 px
and up unchanged), and with it a keycap's minimum width follows its height, 36 px at the default size and 42 px at
large, so a single-letter key (every keycap and keycap button, round ones included) stays square instead of an upright
box; wide keycaps keep 96 px at both sizes (more than twice the 42 px height; their label sets any extra width)
(agent, `size.keycap`, [prime-game-ui#27](https://github.com/xperiaroco2/prime-game-ui/issues/27)); the selected preset card keeps the idle card's size; held buttons sink 4 px (white) or 5 px
(yellow), leaving 1 px of base; the menu backdrop `.dim` is 74 % instead of 70 %, so dim lilac text over a white wall
reaches 4.5:1; wide keycaps (Space, Shift, Tab, Esc) are at least 96 px; the near-identical plums and lilacs stay
separate (28 colours). Decided by the agent, small and easy to change (agent): a held stepper turns honey, preset
cards lift 1 px on hover, a read-only field (the guest's view) is a quiet pale-lilac box with readable text, and the
field's placeholder is muted plum with an ink caret and a yellow selection.

**Toy 0.2.0 additions** for the styled screens (prime-game-ui#19), decided by the agent (agent): a borderless menu
item for the main menu (`ToyMenuItem`, the ghost button's shape with no outline and a pointer icon on the hovered,
focused or open item); the map's «?» as a round keycap button (`ToyKeyRoundButton`); a preset card name label; a
64 px display label on light; a coral alert chip for a key clash (`ToyChipAlert`, which replaces the retired NEW chip);
chevron icons on the stepper instead of − and +, and a chevron arrow on the dropdown. New own-work icons: pointer,
chevrons, lock, teammate mark, knife, slider knob, swatch disc (`pages/components/icons/LICENCES.json`).

**Spacing and controls 0.2.0** (agent): gaps come only from container variations over a `space.*` scale (4, 8, 12, 16,
24, 32): `ToyColumnFour` … `ToyColumnThirtyTwo`, `ToyRowFour` … `ToyRowThirtyTwo`, `ToyGridList`, `ToyGridSwatch`
(names spelled out, since the game's theme test reads letters only); a keycap button for rebinding (`ToyKeyButton`), a
slider (`ToySlider`, whose focus ring the game draws in code, as Godot's Slider has no focus StyleBox) and a scroll bar
(`ToyScrollBar`).

**The dropdown's open list 0.3.0** (agent, `ToyDropdownList`,
[prime-game-ui#26](https://github.com/xperiaroco2/prime-game-ui/issues/26)): a cream list with the dropdown's 3 px ink
outline and 12 px corners, no shadow, flush under the dropdown; rows in the dropdown's bold ink text, 8 px above and
below the text, 4 px inside the outline; the hovered or keyboard-focused row takes the lavender quiet fill of the flat
controls with 8 px corners; a disabled row is muted plum; a separator is a 2 px ink line; the selected row shows an ink
check (the how-to tick, a new own-work icon in ink) before its label, and the other rows keep its 24 px gutter empty.
Text fields keep Godot's right-click menu off (`context_menu_enabled = false`): its labels are Godot's English strings,
which the copy deck does not translate; the keyboard shortcuts still work.

## Styled screens
The ten screens as Godot scene trees, `pages/screens/src/` (prime-game-ui#19; the spec
`docs/research/2026-10-06-screens/spec.md`; the Godot handoffs `docs/handoff/`). Small layout and behaviour choices
the agents took where the decisions were silent, after five reviews (agent):
- **Edges and top line:** HUD and lobby plates sit on a 40 px edge; the timer, the role chip, the lobby plates and the
  spectating plate share the top line at y 40; the spawn-protection chip sits 24 px under the timer.
- **Layers:** name plates, then the HUD (with the lobby HUD and the tutorial's lesson plates), the map, the Esc menu,
  its confirm dialog, and the black screens on top; the main menu is its own scene.
- **Main menu:** menu items 12 px apart in a 592 px column (4 px before the sticker re-skin); the open item shows its pressed look and names the
  panel, so the code and Direct panels (784 px) have no title; the code field opens empty and Join stays unplugged until
  the code is complete; Settings opens the Esc menu's Settings scene in a 960×888 panel, on Sound and voice; the version
  is muted text.
- **Connecting:** one failure layout for every failure (title, body, then the buttons 32 px below); a failed join shows
  its reason there, and Back returns to the menu with the code or address kept; a dismiss button standing alone is
  raised, beside a primary it is a ghost; the loading header is 768 px and the loading card is centred with 264 px art.
- **Lobby:** the lobby HUD shows the code only (Copy is in the Esc Lobby tab, since the mouse is captured in the lobby);
  the players plate is 400 px, in two groups (the lobby name and code, then the count and the rows); names are cut with
  an ellipsis; a not-ready player shows no mark.
- **Esc menu:** a 1600×880 panel with 288 px left-aligned tabs; the players list scrolls inside it; preset cards
  184×96 over a 784 px settings column, Save is a raised card; every setting row is at least 64 px with 8 px between
  rows; settings controls in one 500 px column at the right; the talk mode is a dropdown like the microphone; the
  language is one row with two chips; Character uses setting rows with the lock line in the title row; the
  leave and quit confirm uses the shared dialog layout, and the host's quit confirms too; the default tab is Lobby in the
  lobby and Game in a round and the tutorial, Role is hidden in the lobby; while the menu is open the own character
  takes no gameplay input, voice keeps working.
- **Pre and post game:** a centred column on the night backdrop with 32 px around the title plate.
- **HUD and downed:** slots are 88×88 (the wide hand slot 180); a carried item's name is cut at 106 px; the timer has a
  140 px minimum width (it holds 44:44); the downed plate is a HUD plate like the others; while downed only the downed
  plates and the mic show, while dead only the spectating plate; the give-up hold bar stays visible and empty until the
  key is held.
- **A long item name in the hand slot** (prime-game-ui#57) (agent): the wide hand slot wraps a two-handed item's name
  at word boundaries onto at most two lines and puts the ellipsis only after the second line, because "Garden gnome"
  and «Моторна олива» do not fit in 106 px; a name that fits in one line looks as before
  ([prime-game#1017](https://github.com/xperiaroco2/prime-game/issues/1017)).
- **Map and tutorial:** the task panel grows from the top to its content; the sample map's rooms sit on one grid with
  48 px pictograms; a lit zone sits inside its room under the pictogram; «Ти тут» beside the pin; the how-to card is
  centred with Close inside it; the map's «?» is a 42 px round keycap; the tutorial's lesson plate is 912 px and its
  lesson list 440 px, a done lesson's check at the right edge of its row.
- **Lists:** a scrolling list keeps 8 px between its rows and its scroll bar (`ToyScroll`, the ScrollContainer theme
  constant `scrollbar_h_separation`).
- **Data on the page:** names, the room code, times, stepper values and key labels are data the game never translates;
  the ten character swatches show sample colours from the Toy palette (page samples: the body colours are not chosen).
- **Reduced motion** makes the raised buttons' press instant (the pressed look still shows).
- **Icons beside text** (prime-game-ui#28) (agent): an icon with no tint of its own in a row takes the font colour of the
  row's nearest Label, so the lock beside muted text is muted; elsewhere it takes its surface's text colour.
- **Wordless how-to frames** (prime-game-ui#3) (agent): the how-to card's frames carry no captions (white frames, 3 px
  plum outline, 16 px corners, the finish frame mint, as before); the Delivery card art ships in the pack as 640×480 PNG
  (`dist/pack/cards/delivery-1.png` to `delivery-4.png`, transparent) rendered from the clean-sketch panels by
  `tools/card-art/render.js`. The art is 4:3 in every frame: 320×240 in the map's card, 352×264 in the loading card,
  160×120 in the Esc Guide; the loading card and the Guide show Delivery (since ui-0.8.0 the Delivery-by-meaning frames,
  `delivery-meaning-1..4`; prime-game-ui#63); Switches stays a sample of the card-art pages. `ToyHowtoCaption` is deprecated (removed at the next major release) and the caption
  keys `howto.delivery.*` and `howto.switches.*` are retired from the deck.

**The engineer's answers on the screens** (2026-10-06, the
[wave-19 question page](https://claude.ai/artifact/PnHGtBSbMzHMi28hmR6Cpd), each option shown as a render; all nine
took the recommended option):
- **HUD bars** keep a lilac slot-line outline (`palette.slotline`), so the empty part stays visible over a dark room and
  the bar's length reads.
- **Loading:** every row says «Завантаження…», yours too.
- **A keycap ends the sentence:** «Щоб здатися, утримуй [F]», «Щоб дивитися на іншого гравця, натисни [key]».
- **Post game:** a win shows the winning team on the title plate; a loss shows it as plain cream text (the plate is for
  a win and the roles only); the line «Твоя команда перемогла/програла» is gone.
- **Colour swatches** are 40 px; a focused swatch has a 3 px ink ring flush outside the disc (`ToySwatchFocus`), the
  chosen one keeps its gapped ring.
- **The death lesson** is named «Смерть» / Death.
- **The ready key** is not taught: the Esc Lobby tab has the Ready button and Settings › Controls shows the key.
- **Raising a teammate:** the raiser sees a thin progress bar under the crosshair in place of the object's name, no text.

**Base controls** (the engineer, 2026-10-14, every question as recommended, option a, on the base-controls page,
[prime-game-ui#52](https://github.com/xperiaroco2/prime-game-ui/issues/52), for the game's theme scale flip,
prime-game#620 and #576; released in ui-0.7.0): the looks of a control the screens build bare, with no variation of
its own (`tokens/README.md`, "The pack's base-type sources"):
- **CheckBox** (`ToyCheckBox`): a white tile with a thin ink outline and a 28 px box at its left, empty white or
  checked yellow with an ink check; hover turns the tile lavender, checked or not; focus is the buttons' ink ring;
  disabled is pale with a muted box. It sets every item a Button sets, so the plain Button's look never reaches it.
- **SpinBox arrows** (`ToySpinBox`, its field `ToySpinField`): two yellow buttons stacked 8 px right of the field, 2 px
  apart, in the stepper's colours (honey while held, pale when unplugged), 18 px ink chevrons; the number field has
  12 px above and below instead of 10, so each arrow is at least 24 px high.
- **Plain Button** (`ToyButtonPlain`): the white secondary button, flat (a bare Button has no toy base and does not
  move); hover and held look as normal.
- **Large-text `default_font_size`** (`font.size.theme-default`): 34, the large-text rule's 27 × 1.25; the default
  stays 27.
- (agent) The CheckBox tile has 9 px above and below its content instead of the page's 8, so the inner focus ring keeps
  4 px from the box (the tokens' focus rule); the plain Button and the CheckBox tint a Button icon of their own in the
  label's colour, as the yellow button does; the CheckBox's radio icons (a CheckBox in a button group) are not drawn,
  as no screen has one.

## Type
Comfortaa for titles and text, provisionally, until the style is chosen (SIL OFL 1.1 with the Reserved Font Name
"Comfortaa": ship it unmodified) ([font pick](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5960452846)).
The engineer confirmed Comfortaa for the game's vertical slice, M6.2
([#44](https://github.com/xperiaroco2/prime-game-ui/issues/44#issuecomment-6044249338)). The tokens use two weights, SemiBold 600
and Bold 700 (`font.weight` in `tokens/primitives.tokens.json`); the upstream font is one variable file with a `wght`
axis of 300 to 700 and Cyrillic coverage, so Godot draws both weights from it with two `FontVariation`s. Since ui-0.5.0 the
pack ships it (`dist/pack/fonts/`, the engineer's yes to the download, 2026-10-08), byte for byte from google/fonts at
db64f6b with its `OFL.txt`; it is renamed `Comfortaa-VariableFont_wght.ttf`, Google Fonts' download name, because
brackets in a path are wildcards to PowerShell and globs (agent).

## Sound
**UI clicks** (prime-game-ui#44) (agent): a control clicks when it is pressed, on Godot's `pressed` (or `toggled`,
`item_selected`) signal, never on hover or on focus moving, so keyboard and gamepad navigation stay silent. A disabled
control makes no sound. A slider clicks once when the drag ends (`drag_ended`), not per step; a stepper's arrows click
per press, and a held stepper only on its first step. A dropdown clicks when it opens and when an item is chosen.
