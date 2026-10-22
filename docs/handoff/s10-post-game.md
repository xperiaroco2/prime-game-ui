# 10 · Post game

<!-- node pages/screens/build.js --handoff s10 (prime-game-ui, pages/screens/src/s10-post-game.json); generated, do not edit by hand -->

The styled post game screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s10-post-game.json`; the review page is `pages/screens/screens.html#s10`; the wireframe is section `s10` («Post game: кінець раунду»).
- **Theme:** the Toy pack ui-2.2.1 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): black, no world (intro, outro, loading).
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The outro of about 3 s, one of the three loud moments that end a round (the target page pages/suit-final, section 10): the End phase fades to this screen (0.4 s; a cut under reduced motion), plays one sound for the win and one for the loss (the cops' end with a siren, m8 §6), routes no voice (#213) and returns everyone to the ship after 3 s (#212). Nobody hears anybody and no text says so. No input, so no control and no focus. The loud part is only the band (or, for the cops, the whole screen); the lines under it are quiet text. Open: whether the end reveals who was human, and whether it shows the points (today it names only the winner).

## States

| State | Page label | What it shows |
|---|---|---|
| `aliens` | Прибульці перемогли | Every task done before the timer and the cops (the target's frame 10a): the accent band. |
| `time` | Час вийшов | The timer ran out with the tasks unfinished (frame 10b): the danger band. |
| `cops` | Копи приїхали | The cops' minute ran out (frame 10c), the loudest end: the whole screen in the danger colour, the band the same colour, every line in the danger ink. |

## Node tree in `aliens`

- **Night** `Panel` · variation `ToyBackdropFullScreen` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: Opaque, the whole screen: the full screens' base ground, ToyBackdropAlert (the danger colour) for the cops' end. It fades in over 0.4 s when the End phase starts (a cut under reduced motion). The texts are its children, so they sit on it (the danger ink needs the danger ground).
  - **Band** `PanelContainer` · variation `ToyBand` · anchors `top_wide`, offsets 0, 300, 0, 615 (left, top, right, bottom), grow both/end
    - Note: The loud band across the whole width, 300 px down and 315 tall (the target's 200 and 210 x 1.5): the accent when the aliens won, the danger colour when the humans did; on the cops' danger ground it is the same colour, so the title stands on the whole screen.
    - **Title** `Label` · variation `ToyTitleHero` · text `end.title.party`: en "Great party!" · uk "Вечірка вдалася!" · horizontal_alignment `CENTER` · vertical_alignment `CENTER`
      - Note: How the party ended, the same for every player, in Unbounded at the hero size: end.title.party in the accent ink, end.title.time_up or end.title.busted in the danger ink. The cops' title is in capitals (uppercase in that state only), as the target writes it; the party's and the time's are not. The target also sets the cops' title larger (210 px); the pack's hero is 126 px (open).
  - **Lines** `VBoxContainer` · variation `ToyColumnTwentyFour` · anchors `top_wide`, offsets 0, 672, 0, 672 (left, top, right, bottom), grow both/end · gaps from the variation: separation 24
    - Note: Under the band, 57 px below it (the target's 450 - 410 = 40 x 1.5 less the title's leading): who won, then why. Quiet text, centred.
    - **Won** `Label` · variation `ToyTitleOnDark` · text `end.won_aliens`: en "The aliens won" · uk "Прибульці перемогли" · horizontal_alignment `CENTER`
      - Note: The winning side, end.won_aliens or end.won_humans, the same for every player (no plate for a win or a loss since ui-2.0.0). ToyTextOnDanger on the cops' ground.
    - **Reason** `Label` · variation `ToyTextMutedOnDark` · text `end.reason.all_tasks` with sample {time} = "8:12": en "All tasks done in 8:12." · uk "Усі задачі виконано за 8:12." · horizontal_alignment `CENTER`
      - Note: Why the round ended, from the host's reason id (#208), in the dim text: end.reason.all_tasks with the round's time (m:ss), end.reason.time_up, or end.reason.cops. An unknown reason hides it.
  - **Back** `Label` · variation `ToyTextMutedOnDark` · anchors `bottom_wide`, offsets 0, -72, 0, -72 (left, top, right, bottom), grow both/begin · text `end.back_to_ship` with sample {count} = "3": en "Back to the ship in 3…" · uk "Повернення на корабель через 3…" · horizontal_alignment `CENTER`
    - Note: 72 px from the bottom (the target's 48 x 1.5), dim. Counts 3, 2, 1 once a second; at 0 everyone is back on the ship, the lobby (#212).

## `time`: what differs from `aliens`

- **Changed** `Night/Band`: variation `ToyBandAlert` (was: variation `ToyBand`)
- **Changed** `Night/Band/Title`: variation `ToyTitleHeroAlert` · text `end.title.time_up`: en "Time's up" · uk "Час вийшов" (was: variation `ToyTitleHero` · text `end.title.party`: en "Great party!" · uk "Вечірка вдалася!")
- **Changed** `Night/Lines/Won`: text `end.won_humans`: en "The humans won" · uk "Люди перемогли" (was: text `end.won_aliens`: en "The aliens won" · uk "Прибульці перемогли")
- **Changed** `Night/Lines/Reason`: text `end.reason.time_up`: en "The tasks aren't done." · uk "Задачі не виконано." (was: text `end.reason.all_tasks` with sample {time} = "8:12": en "All tasks done in 8:12." · uk "Усі задачі виконано за 8:12.")

## `cops`: what differs from `aliens`

- **Changed** `Night`: variation `ToyBackdropAlert` (was: variation `ToyBackdropFullScreen`)
- **Changed** `Night/Band`: variation `ToyBandAlert` (was: variation `ToyBand`)
- **Changed** `Night/Band/Title`: variation `ToyTitleHeroAlert` · text `end.title.busted`: en "Busted!" · uk "Попались!" · uppercase true (the text drawn in capitals) (was: variation `ToyTitleHero` · text `end.title.party`: en "Great party!" · uk "Вечірка вдалася!")
- **Changed** `Night/Lines/Won`: variation `ToyTextOnDanger` · text `end.won_humans`: en "The humans won" · uk "Люди перемогли" (was: variation `ToyTitleOnDark` · text `end.won_aliens`: en "The aliens won" · uk "Прибульці перемогли")
- **Changed** `Night/Lines/Reason`: variation `ToyTextOnDanger` · text `end.reason.cops`: en "The cops came: the party's over." · uk "Приїхали копи: вечірці кінець." (was: variation `ToyTextMutedOnDark` · text `end.reason.all_tasks` with sample {time} = "8:12": en "All tasks done in 8:12." · uk "Усі задачі виконано за 8:12.")
- **Changed** `Night/Back`: variation `ToyTextOnDanger` (was: variation `ToyTextMutedOnDark`)

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (9): `end.back_to_ship`, `end.reason.all_tasks`, `end.reason.cops`, `end.reason.time_up`, `end.title.busted`, `end.title.party`, `end.title.time_up`, `end.won_aliens`, `end.won_humans`.

## Layers and input (every screen)

| CanvasLayer | What |
|---|---|
| 1 | Name plates in the world (s4, s7) |
| 2 | HUD: the round HUD (s7), downed and the dead's room (s9), the lobby HUD (s4), the tutorial's lesson plates (s1) |
| 3 | Map and tasks (s8), with its how-to card |
| 4 | Esc menu (s5) and its dim |
| 5 | The Esc menu's confirm dialog |
| 6 | Black screens: connecting and loading (s3), pre game (s6), post game (s10) |

- The game boots straight into the ship (the lobby, s4); the suit menu (s5) hosts, joins and holds Settings.
- The mutation workbench (s11) is on no CanvasLayer: it is a SubViewport drawn on the machine in the world, under the HUD.
- Esc closes the topmost open overlay first (a how-to card, then the map; in the Esc menu its confirm dialog, then the menu) and opens the Esc menu only when nothing else is open. M is ignored while the Esc menu is open.
