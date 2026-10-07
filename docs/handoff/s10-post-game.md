# 10 · Post game

<!-- node pages/screens/build.js --handoff s10 (prime-game-ui, pages/screens/src/s10-post-game.json); generated, do not edit by hand -->

The styled post game screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s10-post-game.json`; the review page is `pages/screens/screens.html#s10`; the wireframe is section `s10` («Post game: кінець раунду»).
- **Theme:** the Toy pack ui-0.4.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): black, no world (intro, outro, loading).
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The black outro of about 3 s: the End phase fades to black (0.4 s; a cut under reduced motion), plays one sound for both outcomes, routes no voice (#213) and returns everyone to the lobby after 3 s (#212). Nobody hears anybody and no text says so. Roles are not revealed. No input.

## States

| State | Page label | What it shows |
|---|---|---|
| `win` | Перемога | An Engineer's view: every task done in time. |
| `lose` | Поразка | An Engineer's view: the time ran out. |

## Node tree in `win`

- **Night** `Panel` · variation `ToyBackdropNight` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: P2, opaque: the style's darkest stands for the decided black. It fades in over 0.4 s when the End phase starts (a cut under reduced motion).
- **V** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (1440, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
  - Note: The 32 px gaps clear the title plate's expand margins (4 px above it, the base 14 px below).
  - **Title** `Label` · variation `ToyTextMutedOnDark` · text `end.title`: en "End of the round" · uk "Кінець раунду" · horizontal_alignment `CENTER`
  - **Winner** `Label` · variation `ToyTitlePlate` (raised: ToyRaised with base `ToyBaseTitle`) · size flags horizontal `SIZE_SHRINK_CENTER` · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `end.won_engineers`: en "The Engineers won" · uk "Перемогли Інженери"
    - Note: When the own team won: the winning team on the title plate (raised on ToyBaseTitle), end.won_engineers or end.won_dissidents.
  - **Result** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
    - Note: Why the round ended. Whether the own team won shows in the winner line itself: on the plate or plain.
    - **Reason** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (1152, 0) · text `end.reason.all_tasks` with sample {time} = "7:41": en "All tasks done in 7:41." · uk "Усі задачі виконано за 7:41." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - Note: Why the round ended, from the host's reason id (#208): end.reason.all_tasks with the round's time (m:ss) or end.reason.time_up. An unknown reason hides the line.
  - **Gap** `Control` · custom_minimum_size (0, 8)
    - Note: With the column's two 32 px gaps, 72 px between the reason and the countdown.
  - **Back** `Label` · variation `ToyTextOnDark` · text `end.back_to_lobby` with sample {count} = "3": en "Back to the lobby in 3…" · uk "Повернення в лобі через 3…" · horizontal_alignment `CENTER`
    - Note: Counts 3, 2, 1 once a second; at 0 everyone is back in the lobby (#212).

## `lose`: what differs from `win`

- **Hidden:** `V/Winner`.
- **Changed** `V/Result/Reason`: text `end.reason.time_up`: en "Time's up and the tasks aren't done." · uk "Час вийшов, а задачі ще не виконано." (was: text `end.reason.all_tasks` with sample {time} = "7:41": en "All tasks done in 7:41." · uk "Усі задачі виконано за 7:41.")
- **Shown:**
  - **V/WinnerLoss** `Label` · variation `ToyTextOnDark` · text `end.won_dissidents`: en "The Dissidents won" · uk "Перемогли Дисиденти" · horizontal_alignment `CENTER`
    - Note: When the own team lost: the winning team in plain text, no plate (the plate is only for a win and for the roles). end.won_engineers or end.won_dissidents.

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- A raised variation is built as the tokens spec (§6) says: a `ToyRaised` MarginContainer holding first the base `Panel` (the base named above, chosen by the context it sits in), then the face. The wrapper is the node in its parent: anchors, offsets, grow, size flags, stretch ratio, custom_minimum_size and visibility belong to the wrapper; the variation, the text, toggle_mode, disabled, focus and the signals belong to the face. Hide or show the wrapper, not the face.
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (6): `end.back_to_lobby`, `end.reason.all_tasks`, `end.reason.time_up`, `end.title`, `end.won_dissidents`, `end.won_engineers`.

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
