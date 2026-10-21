# 11 · Mutation workbench

<!-- node pages/screens/build.js --handoff s11 (prime-game-ui, pages/screens/src/s11-workbench.json); generated, do not edit by hand -->

The styled mutation workbench screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s11-workbench.json`; the review page is `pages/screens/screens.html#s11`; no wireframe section (a screen new with the MVP; its page heading is «Мутаційний верстат»).
- **Theme:** the Toy pack ui-2.0.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): a lit room of the level.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

New with the MVP (m8 §4; the sketch pages/mvp-screens frame 6 at 0.75, every length x 1.5): the mutation workbench in the laboratory, opened by Interact at the workbench, over the running round. The mouse is freed while it is open; the player stands at the workbench. Points buy three positive mutations; the points show only here. Esc or Close closes it.

## States

| State | Page label | What it shows |
|---|---|---|
| `buy` | Можна купити й бракує | 7 points: Quick feet (4) and Spring legs (3) can be bought, Thick skin (9) cannot. The first card's button has keyboard focus, as when the workbench opens by keyboard or gamepad. |

## Node tree in `buy`

- **Dim** `Panel` · variation `ToyBackdropDeep` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: mouse_filter STOP. Dims the running round behind the workbench.
- **Bench** `PanelContainer` · variation `ToyPanelDialog` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (1260, 690)
  - Note: The workbench panel, 1260 x 690 (the sketch's 840 x 460 x 1.5), centred; raised on ToyBasePanel.
  - **V** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
    - **Top** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnLight` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `workbench.title`: en "Mutation workbench" · uk "Мутаційний верстат"
      - **Balance** `PanelContainer` · variation `ToyPlateBalance` · size flags vertical `SIZE_SHRINK_CENTER`
        - Note: The player's points: the only place they show (decided 2026-10-20: no points on the HUD). Updates live.
        - **Row** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Label** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text `workbench.points`: en "Your points" · uk "Твої очки"
          - **Points** `Label` · variation `ToyPlateTimer` · size flags vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "7"
            - Note: The points, a number from code (auto_translate_mode DISABLED).
    - **Cards** `HBoxContainer` · variation `ToyRowThirtyTwo` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 32
      - Note: The three MVP mutations (m8 §4: run faster, jump higher, more HP), equal widths, 32 px apart (the sketch's 22 x 1.5 = 33, the nearest step). Open: their names, prices, whether one can be bought twice, whether a mutation lasts the match or ends at death, whether the HUD shows the ones you have.
      - **Fast** `PanelContainer` · variation `ToyMutationCard` · size flags horizontal `SIZE_EXPAND_FILL`
        - Note: One mutation (content data): its name, what it does, its price in points and the buy button. The card looks the same whether it can be bought or not; only its button changes (Buy: enabled, mutation.* "can buy"; disabled with workbench.short, "not enough"). There is no "already have" state: whether a mutation can be bought twice is open.
        - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToyPlateTitle` · text `mutation.fast.name`: en "Quick feet" · uk "Швидкі ноги"
          - **Effect** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_EXPAND_FILL` · custom_minimum_size (280, 0) · text `mutation.fast.effect`: en "You run faster" · uk "Бігаєш швидше" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - Note: Takes the card's free height, so the price and the button sit at the bottom.
          - **Cost** `Label` · variation `ToyPlateTitle` · text `tr_n("unit.points", "unit.points", 4)`: en "4 points" · uk "4 очки"
            - Note: The price, tr_n("unit.points", "unit.points", price) with {count} = the price (content data; the prices are placeholders, open).
          - **Buy** `Button` · variation `ToyButtonPrimaryOnMint` · text `workbench.mutate`: en "Mutate" · uk "Мутувати" · shown with keyboard focus (grab_focus)
            - Note: Spends the price and gives the mutation; disabled when the balance is short.
      - **Jump** `PanelContainer` · variation `ToyMutationCard` · size flags horizontal `SIZE_EXPAND_FILL`
        - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToyPlateTitle` · text `mutation.jump.name`: en "Spring legs" · uk "Пружні ноги"
          - **Effect** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_EXPAND_FILL` · custom_minimum_size (280, 0) · text `mutation.jump.effect`: en "You jump higher" · uk "Стрибаєш вище" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Cost** `Label` · variation `ToyPlateTitle` · text `tr_n("unit.points", "unit.points", 3)`: en "3 points" · uk "3 очки"
          - **Buy** `Button` · variation `ToyButtonPrimaryOnMint` · text `workbench.mutate`: en "Mutate" · uk "Мутувати"
      - **Health** `PanelContainer` · variation `ToyMutationCard` · size flags horizontal `SIZE_EXPAND_FILL`
        - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToyPlateTitle` · text `mutation.health.name`: en "Thick skin" · uk "Товста шкіра"
          - **Effect** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_EXPAND_FILL` · custom_minimum_size (280, 0) · text `mutation.health.effect`: en "More health" · uk "Більше здоровʼя" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Cost** `Label` · variation `ToyPlateTitle` · text `tr_n("unit.points", "unit.points", 9)`: en "9 points" · uk "9 очок"
          - **Buy** `Button` · variation `ToyButtonPrimaryOnMint` · text `workbench.short` with sample {count} = "2": en "2 short" · uk "Бракує 2" · disabled true
            - Note: Not enough points: disabled, with workbench.short, {count} = price - balance.
    - **Bar** `HBoxContainer` · alignment `ALIGNMENT_END`
      - **Close** `Button` · variation `ToyButtonSecondary` · text `common.close`: en "Close" · uk "Закрити"
        - Note: Closes the workbench; Esc (ui_cancel) does the same.

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (12): `common.close`, `mutation.fast.effect`, `mutation.fast.name`, `mutation.health.effect`, `mutation.health.name`, `mutation.jump.effect`, `mutation.jump.name`, `unit.points`, `workbench.mutate`, `workbench.points`, `workbench.short`, `workbench.title`.

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
