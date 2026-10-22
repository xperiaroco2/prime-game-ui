# 11 · Mutation workbench

<!-- node pages/screens/build.js --handoff s11 (prime-game-ui, pages/screens/src/s11-workbench.json); generated, do not edit by hand -->

The styled mutation workbench screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s11-workbench.json`; the review page is `pages/screens/screens.html#s11`; no wireframe section (a screen new with the MVP; its page heading is «Мутаційний верстат»).
- **Theme:** the Toy pack ui-2.0.2 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): black, no world (intro, outro, loading).
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

New with the MVP (m8 §4). The workbench is the machine's own screen (the engineer, 2026-10-21/22; the target page pages/suit-final, frames 9a to 9c): this scene is the root of a SubViewport (960 x 540, the target's 640 x 360 x 1.5, with the game's Theme) whose ViewportTexture the machine's screen mesh shows, so whoever stands there sees the same screen. It is no overlay: the mouse stays captured, the player's own HUD (s7) stays over the world, and the player works the screen with the crosshair: the game raycasts the screen mesh and pushes the hit point into the SubViewport as mouse motion and Interact as a left click (SubViewport.push_input), so the control under the crosshair hovers; how the input reaches it is the game's choice. The page draws the 960 x 540 canvas alone, centred in the frame. The flow: walk up and start it, choose a mutation, step into the capsule beside the machine, and it mutates you. Points buy three positive mutations; the points show only here. Walking away leaves the screen to the next player (no Close).

## States

| State | Page label | What it shows |
|---|---|---|
| `idle` | Чекає | Nobody uses the machine: its name and Start. Interact on Start starts it. |
| `choose` | Вибір | 7 points: Quick feet (4) and Spring legs (3) can be bought, Thick skin (9) cannot. The crosshair is on Spring legs' button, so it hovers. |
| `step` | У машині | Spring legs chosen: the screen names it and fills its ten pips while the player stands in the capsule (seen from inside on the target page); when they are full the mutation is done and the screen goes back to idle. |

## Node tree in `idle`

- **Screen** `PanelContainer` · variation `ToyPanelDialog` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (960, 540)
  - Note: In the game: the SubViewport's root, anchors full_rect in the 960 x 540 viewport (the page centres it in the frame). ToyPanelDialog is the pack's machine screen frame: the plain tile, 42 px inside.
  - **Idle** `CenterContainer`
    - **V** `VBoxContainer` · variation `ToyColumnTwentyFour` · centred by its CenterContainer · gaps from the variation: separation 24 · alignment `ALIGNMENT_CENTER`
      - **Title** `Label` · variation `ToyTitleOnLight` · text `workbench.title`: en "Mutation workbench" · uk "Мутаційний верстат" · horizontal_alignment `CENTER`
      - **Start** `Button` · variation `ToyButtonPrimary` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (288, 0) · text `workbench.start`: en "Start" · uk "Почати"
        - Note: workbench.start («Почати», the engineer's word, 2026-10-22): Interact with the crosshair on it opens the choice (choose) for this player. At least 288 wide (the target's large button), an easy mark for the crosshair (agent).

## `choose`: what differs from `idle`

- **Hidden:** `Screen/Idle`.
- **Shown:**
  - **Screen/Choose** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
    - **Top** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnLight` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `workbench.title`: en "Mutation workbench" · uk "Мутаційний верстат"
      - **Balance** `PanelContainer` · variation `ToyPlateBalance` · size flags vertical `SIZE_SHRINK_CENTER`
        - Note: The player's points: the only place they show (decided 2026-10-20: no points on the HUD). The screen shows the points of the player using it; updates live.
        - **Row** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Label** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text `workbench.points`: en "Your points" · uk "Твої очки"
          - **Points** `Label` · variation `ToyPlateTimer` · size flags vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "7"
            - Note: The points, a number from code (auto_translate_mode DISABLED).
    - **Cards** `HBoxContainer` · variation `ToyRowTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
      - Note: The three MVP mutations (m8 §4: run faster, jump higher, more HP), equal widths, 24 px apart (the target's 14 x 1.5 = 21, the nearest step). Open: their names, prices, whether one can be bought twice, whether a mutation lasts the match or ends at death, whether the HUD shows the ones you have.
      - **Fast** `PanelContainer` · variation `ToyMutationCard` · size flags horizontal `SIZE_EXPAND_FILL`
        - Note: One mutation (content data): its name, what it does, its price in points and the buy button. The card looks the same whether it can be bought or not; only its button changes (Mutate: enabled; disabled with workbench.short when the points are short). There is no "already have" state: whether a mutation can be bought twice is open.
        - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToyPlateTitle` · text `mutation.fast.name`: en "Quick feet" · uk "Швидкі ноги"
          - **Effect** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_EXPAND_FILL` · custom_minimum_size (200, 0) · text `mutation.fast.effect`: en "You run faster" · uk "Бігаєш швидше" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - Note: Takes the card's free height, so the price and the button sit at the bottom.
          - **Cost** `Label` · variation `ToyPlateTitle` · text `tr_n("unit.points", "unit.points", 4)`: en "4 points" · uk "4 очки"
            - Note: The price, tr_n("unit.points", "unit.points", price) with {count} = the price (content data; the prices are placeholders, open).
          - **Buy** `Button` · variation `ToyButtonPrimary` · text `workbench.mutate`: en "Mutate" · uk "Мутувати"
            - Note: Spends the price, and the screen asks the player into the capsule (step); disabled when the points are short.
      - **Jump** `PanelContainer` · variation `ToyMutationCard` · size flags horizontal `SIZE_EXPAND_FILL`
        - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToyPlateTitle` · text `mutation.jump.name`: en "Spring legs" · uk "Пружні ноги"
          - **Effect** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_EXPAND_FILL` · custom_minimum_size (200, 0) · text `mutation.jump.effect`: en "You jump higher" · uk "Стрибаєш вище" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Cost** `Label` · variation `ToyPlateTitle` · text `tr_n("unit.points", "unit.points", 3)`: en "3 points" · uk "3 очки"
          - **Buy** `Button` · variation `ToyButtonPrimary` · text `workbench.mutate`: en "Mutate" · uk "Мутувати" · shown hovered (review only)
            - Note: Under the crosshair: hovered (the pushed mouse motion).
      - **Health** `PanelContainer` · variation `ToyMutationCard` · size flags horizontal `SIZE_EXPAND_FILL`
        - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToyPlateTitle` · text `mutation.health.name`: en "Thick skin" · uk "Товста шкіра"
          - **Effect** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_EXPAND_FILL` · custom_minimum_size (200, 0) · text `mutation.health.effect`: en "More health" · uk "Більше здоровʼя" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Cost** `Label` · variation `ToyPlateTitle` · text `tr_n("unit.points", "unit.points", 9)`: en "9 points" · uk "9 очок"
          - **Buy** `Button` · variation `ToyButtonPrimary` · text `workbench.short` with sample {count} = "2": en "2 short" · uk "Бракує 2" · disabled true
            - Note: Not enough points: disabled, with workbench.short, {count} = price - balance.

## `step`: what differs from `idle`

- **Hidden:** `Screen/Idle`.
- **Shown:**
  - **Screen/Step** `CenterContainer`
    - **V** `VBoxContainer` · variation `ToyColumnTwentyFour` · centred by its CenterContainer · gaps from the variation: separation 24 · alignment `ALIGNMENT_CENTER`
      - **Chosen** `Label` · variation `ToyKicker` · text `mutation.jump.name`: en "Spring legs" · uk "Пружні ноги" · horizontal_alignment `CENTER`
        - Note: The chosen mutation's name (content data) in the kicker (the game writes it in capitals).
      - **StepIn** `Label` · variation `ToyTitleOnLight` · text `workbench.step_in`: en "Step into the machine" · uk "Стань у машину" · horizontal_alignment `CENTER`
        - Note: workbench.step_in («Стань у машину», the engineer's word, 2026-10-22): the capsule beside the machine; the pips fill only while the player stands in it.
      - **Pips** `HBoxContainer` · variation `ToyRowFour` · size flags horizontal `SIZE_SHRINK_CENTER` · gaps from the variation: separation 4
        - Note: The mutation's progress as ten pips (the suit's ToyPip and ToyPipHealth), filling while the player stands in the capsule; 6 of 10 here.
        - **P1** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P2** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P3** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P4** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P5** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P6** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P7** `Panel` · variation `ToyPip` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
        - **P8** `Panel` · variation `ToyPip` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
        - **P9** `Panel` · variation `ToyPip` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
        - **P10** `Panel` · variation `ToyPip` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (13): `mutation.fast.effect`, `mutation.fast.name`, `mutation.health.effect`, `mutation.health.name`, `mutation.jump.effect`, `mutation.jump.name`, `unit.points`, `workbench.mutate`, `workbench.points`, `workbench.short`, `workbench.start`, `workbench.step_in`, `workbench.title`.

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
