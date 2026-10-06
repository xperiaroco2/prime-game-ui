# UI decisions so far

The engineer's decisions for the game's UI, 2026-10-02 and 2026-10-03, with where each was recorded (comments on
[prime-game #150](https://github.com/xperiaroco2/prime-game/issues/150), the game issues). The engineer answered as the
designer too. The wireframes that show them: the `pages/wireframes/` page. A newer decision replaces an older one; record
a change here in the same PR as the page change. A decision marked "(agent)" was taken by the agent alone under the
trust rules in `CLAUDE.md` (small and easy to change); the engineer can veto it at any time.

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

## Styled screens
The ten screens as Godot scene trees, `pages/screens/src/` (prime-game-ui#19; the spec
`docs/research/2026-10-06-screens/spec.md`; the Godot handoffs `docs/handoff/`). Small layout and behaviour choices
the agents took where the decisions were silent, after five reviews (agent):
- **Edges and top line:** HUD and lobby plates sit on a 40 px edge; the timer, the role chip, the lobby plates and the
  spectating plate share the top line at y 40; the spawn-protection chip sits 24 px under the timer.
- **Layers:** name plates, then the HUD (with the lobby HUD and the tutorial's lesson plates), the map, the Esc menu,
  its confirm dialog, and the black screens on top; the main menu is its own scene.
- **Main menu:** borderless menu items 4 px apart in a 592 px column; the open item shows its pressed look and names the
  panel, so the code and Direct panels (784 px) have no title; the code field opens empty and Join stays unplugged until
  the code is complete; Settings opens the Esc menu's Settings scene in a 960×888 panel, on Sound and voice; the version
  is muted text.
- **Connecting:** one failure layout for every failure (title, body, then the buttons 32 px below); a failed join shows
  its reason there, and Back returns to the menu with the code or address kept; a dismiss button standing alone is
  raised, beside a primary it is a ghost; the loading header is 768 px and the loading card is centred with 200 px art.
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
- **Map and tutorial:** the task panel grows from the top to its content; the sample map's rooms sit on one grid with
  48 px pictograms; a lit zone sits inside its room under the pictogram; «Ти тут» beside the pin; the how-to card is
  centred with Close inside it; the map's «?» is a 42 px round keycap; the tutorial's lesson plate is 912 px and its
  lesson list 440 px, a done lesson's check at the right edge of its row.
- **Lists:** a scrolling list keeps 8 px between its rows and its scroll bar (`ToyScroll`, the ScrollContainer theme
  constant `scrollbar_h_separation`).
- **Data on the page:** names, the room code, times, stepper values and key labels are data the game never translates;
  the ten character swatches show sample colours from the Toy palette (page samples: the body colours are not chosen).
- **Reduced motion** makes the raised buttons' press instant (the pressed look still shows).

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

## Type
Comfortaa for titles and text, provisionally, until the style is chosen (SIL OFL 1.1 with the Reserved Font Name
"Comfortaa": ship it unmodified) ([font pick](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5960452846)).
