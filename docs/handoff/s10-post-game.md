# 10 · Post game

<!-- node pages/screens/build.js --handoff s10 (prime-game-ui, pages/screens/src/s10-post-game.json); generated, do not edit by hand -->

The styled post game screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s10-post-game.json`; the review page is `pages/screens/screens.html#s10`; the wireframe is section `s10` («Post game: кінець раунду»).
- **Theme:** the Toy pack ui-2.0.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): black, no world (intro, outro, loading).
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The black outro of about 3 s: the End phase fades to black (0.4 s; a cut under reduced motion), plays one sound for the win and one for the loss (the cops' end with a siren, m8 §6), routes no voice (#213) and returns everyone to the lobby after 3 s (#212). Nobody hears anybody and no text says so. No input. Three ends (m8 §6; the sketch pages/mvp-screens frames 10 to 12 at 0.75). Open: whether the end reveals who was human, and whether it shows the points (today it names only the winner).

## States

| State | Page label | What it shows |
|---|---|---|
| `aliens` | Прибульці перемогли | An alien's view: every task done before the timer and the cops (the sketch's frame 10). The own side won: the winner on the result plate. |
| `time` | Час вийшов | A human's view: the timer ran out with the tasks unfinished (frame 11). The own side won: the plate. |
| `cops` | Копи приїхали | An alien's view: the cops' minute ran out (frame 12). The own side lost: the winner in plain text, no plate (the decided rule: the plate is for a win). |

## Node tree in `aliens`

- **Night** `Panel` · variation `ToyBackdropFullScreen` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: P2, opaque: the full screens' base ground (ui-2.0.0). The cops' end fills the whole screen with the danger colour in the target page (ToyBackdropAlert, ToyTextOnDanger): open for the game, the screen here keeps the base under the danger band. It fades in over 0.4 s when the End phase starts (a cut under reduced motion).
- **V** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
  - Note: A centred column on the night, 32 px between its lines (the sketch's 20 x 1.5 = 30, the nearest step).
  - **Band** `PanelContainer` · variation `ToyBand` · custom_minimum_size (1920, 315)
    - Note: ui-2.0.0 (the target page, frame 10): the loud band across the whole width, 315 px tall (210 x 1.5): the accent when the aliens won, the danger colour when the humans did.
    - **Title** `Label` · variation `ToyTitleHero` · text `end.title.party`: en "Great party!" · uk "Вечірка вдалася!" · horizontal_alignment `CENTER` · vertical_alignment `CENTER`
      - Note: How the party ended, in Unbounded at the hero size on the band, the same for every player: end.title.party (the accent ink), end.title.time_up or end.title.busted (the danger ink).
  - **Winner** `PanelContainer` · variation `ToyPlateResult` · size flags horizontal `SIZE_SHRINK_CENTER`
    - Note: When the own side won: the winning side on the result plate.
    - **Text** `Label` · variation `ToyPlateTitle` · text `end.won_aliens`: en "The aliens won" · uk "Прибульці перемогли"
      - Note: end.won_aliens or end.won_humans.
  - **Reason** `PanelContainer` · variation `ToyStickerHighlight` · size flags horizontal `SIZE_SHRINK_CENTER`
    - Note: Why the round ended, from the host's reason id (#208), on a word tile: an accent outline when the aliens won, a danger outline when the humans did. An unknown reason hides it.
    - **Text** `Label` · variation `ToyStickerTextLarge` · text `end.reason.all_tasks` with sample {time} = "8:12": en "All tasks done in 8:12." · uk "Усі задачі виконано за 8:12."
      - Note: end.reason.all_tasks with the round's time (m:ss), end.reason.time_up, or end.reason.cops.
  - **Gap** `Control` · custom_minimum_size (0, 12)
    - Note: With the column's two 32 px gaps, 76 px between the reason and the countdown.
  - **Back** `Label` · variation `ToyTextOnDark` · text `end.back_to_ship` with sample {count} = "3": en "Back to the ship in 3…" · uk "Повернення на корабель через 3…" · horizontal_alignment `CENTER`
    - Note: Counts 3, 2, 1 once a second; at 0 everyone is back in the lobby, the aliens' ship (#212). Open: how the return to the ship looks.

## `time`: what differs from `aliens`

- **Changed** `V/Band`: variation `ToyBandAlert` (was: variation `ToyBand`)
- **Changed** `V/Band/Title`: variation `ToyTitleHeroAlert` · text `end.title.time_up`: en "Time's up" · uk "Час вийшов" (was: variation `ToyTitleHero` · text `end.title.party`: en "Great party!" · uk "Вечірка вдалася!")
- **Changed** `V/Winner/Text`: text `end.won_humans`: en "The humans won" · uk "Люди перемогли" (was: text `end.won_aliens`: en "The aliens won" · uk "Прибульці перемогли")
- **Changed** `V/Reason`: variation `ToyStickerAlert` (was: variation `ToyStickerHighlight`)
- **Changed** `V/Reason/Text`: text `end.reason.time_up`: en "The tasks aren't done." · uk "Задачі не виконано." (was: text `end.reason.all_tasks` with sample {time} = "8:12": en "All tasks done in 8:12." · uk "Усі задачі виконано за 8:12.")

## `cops`: what differs from `aliens`

- **Hidden:** `V/Winner`.
- **Changed** `V/Band`: variation `ToyBandAlert` (was: variation `ToyBand`)
- **Changed** `V/Band/Title`: variation `ToyTitleHeroAlert` · text `end.title.busted`: en "Busted!" · uk "Попались!" (was: variation `ToyTitleHero` · text `end.title.party`: en "Great party!" · uk "Вечірка вдалася!")
- **Changed** `V/Reason`: variation `ToyStickerAlert` (was: variation `ToyStickerHighlight`)
- **Changed** `V/Reason/Text`: text `end.reason.cops`: en "The cops came: the party's over." · uk "Приїхали копи: вечірці кінець." (was: text `end.reason.all_tasks` with sample {time} = "8:12": en "All tasks done in 8:12." · uk "Усі задачі виконано за 8:12.")
- **Shown:**
  - **V/WinnerLoss** `Label` · variation `ToyTextOnDark` · text `end.won_humans`: en "The humans won" · uk "Люди перемогли" · horizontal_alignment `CENTER`
    - Note: When the own side lost: the winning side in plain text, no plate. end.won_aliens or end.won_humans.

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (9): `end.back_to_ship`, `end.reason.all_tasks`, `end.reason.cops`, `end.reason.time_up`, `end.title.busted`, `end.title.party`, `end.title.time_up`, `end.won_aliens`, `end.won_humans`.

## Layers and input (every screen)

| CanvasLayer | What |
|---|---|
| 1 | Name plates in the world (s4, s7) |
| 2 | HUD: the round HUD (s7), downed and spectating (s9), the lobby HUD (s4), the tutorial's lesson plates (s1) |
| 3 | Map and tasks (s8), with its how-to card |
| 4 | Esc menu (s5) and its dim |
| 5 | The Esc menu's confirm dialog |
| 6 | Black screens: connecting and loading (s3), pre game (s6), post game (s10) |

- The main menu (s2) is its own scene, under none of these.
- Esc closes the topmost open overlay first (a how-to card, then the map; in the Esc menu its confirm dialog, then the menu) and opens the Esc menu only when nothing else is open. M is ignored while the Esc menu is open.
