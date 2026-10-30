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
  roster at the top right. This replaces "only the time at the top" (Styled screens below).
- **No points on the HUD** (the engineer, 2026-10-20, chat): the points show only on the mutation workbench screen.
- **The anger meter is A** (the engineer, 2026-10-20, chat, translated, on the MVP screens page): a thicker bar with the
  siren at its right end; B (six pips) and C (the siren filling up) stay on the page, not chosen. One "A" answered
  both open choices, this one and the item bar's; read as both.
- **The anger meter gives no hint, A** (the engineer, 2026-10-22, chat, translated, on section 2 of the MVP screens
  page): "A, only the bar". The HUD names neither the cause nor the place of the mischief; the aliens find it themselves
  (they hear the music, see the bins, talk), and the map marks no mischief. B (a line under the bar naming the type of
  problem) stays on the page, not chosen. The game design (m8 §5, §9) is updated by [prime-game#1312](https://github.com/xperiaroco2/prime-game/issues/1312).
- **The dead's room: the return shown small at the top** (the engineer, 2026-10-22, chat, translated): "the return
  must be written nicely at the top, because the player can hang out in the purgatory and interact with the space, so
  it must not fill the screen". The dead's room is a place to walk in, not a waiting screen: its name and the return
  countdown sit in one quiet tile at the top centre, the middle of the screen stays clear. This replaces the centred
  countdown plate of the target page and of s9; the design note is on [prime-game#1032](https://github.com/xperiaroco2/prime-game/issues/1032).
- **The suit menu is a left side panel** (the engineer, 2026-10-22, chat, translated, on the proposal page
  `pages/esc-start/`): "Yes, the menu on the left as on the page." His notes: the ship's footer row (Copy, Host, Join by
  address, Tutorial, Quit) under the top tabs read oddly; no Role tab, since the HUD shows the role; Character can be
  changed only in the lobby; Guide and Settings are always there; Esc brings a menu out from the left, like a start
  menu, with options; the Game tab with Resume and Leave looked odd. s5 (ui-2.3.0) is one panel at the left, full
  height, the world visible at its right with no dim (the game is not paused); per place only what makes sense there:
  the ship with no session, the own code with Copy, Find a lobby, Host, Tutorial, Guide, Settings and, apart at the
  bottom, Quit; the lobby, the lobby's code with Copy, Resume, Character, Guide, Settings, then Leave and Quit; a round,
  Resume, Guide, Settings, then Leave and Quit; the tutorial, Resume, Guide, Settings, then Leave the tutorial. An entry
  with a page opens it in a tile beside the panel; Join by address moved into Find a lobby's code column as a quiet
  ghost button; the host's confirm dialog is unchanged. This replaces, in the lines below: the tabs on the hairline
  strip with the Esc keycap (ui-2.1.0), the fixed 1200 x 780 tile, the footer row and the Game tab's body over the
  hairline, Resume's absence in the ship and the Esc keycap closing the menu (ui-2.2.0), the backdrop behind the suit
  menu at 87 % (ui-2.0.0), the Game tab's name «Знайти лобі» / «Гра» (ui-2.0.2), the Game tab of the ship (the boot
  into the ship), the Role tab and the locked Character in a round. Taken by the agent, for the engineer to veto
  (agent):
  - the panel is the existing `ToyPanelMenu` (rounded, its edge on every side), so it stands 36 px off the screen's left,
    top and bottom edges (the HUD tiles' margin) instead of square against them, and the pack gains no variation; 520 px
    wide, as the page;
  - the head is two lines, «Твій код» / «Код» in small capitals over the code and Copy (the page's one line does not fit
    520 px at large text); it sits in a hairline row (`ToySettingRow`) whose 18 px sides line the code up with the
    entries' text; the hairline over the bottom group is an empty `ToySettingRow`;
  - every entry is a `ToyMenuItem` row with dim idle text; the entries with a page (Find a lobby, Character, Guide,
    Settings) are toggles in one ButtonGroup, the open one pressed; the ones that act (Resume, Host, Tutorial, Leave,
    Quit) are plain buttons; the page's brighter first entry is not drawn; Quit is not in the tutorial's menu;
  - the page tile is `ToyPanelMenu` 24 px right of the panel, top-aligned with it, 1120 px wide on every page (Settings'
    rows and Character's preview need it; the Guide's card then shows two frames and the edge of a third), its height
    following the page; Settings and Guide share an 828 px view, so Sound and voice's nine rows fit unscrolled;
  - a click on the world beside the menu does nothing (the menu closes with Esc or Resume);
  - the states: Settings and Guide are drawn in a round (the page's frame 4), Find a lobby's states in the ship.
- **The library brought to the approved target (ui-2.1.0)** (the engineer's "the look is ok" on `pages/suit-final/`; the nine
  differences of `pages/library-check/`; `tokens/README.md`, "The library brought to the target, ui-2.1.0"). This replaces
  the lines of "The look in the tokens and the pack, ui-2.0.0" below on the chosen tab as a row fill and on the target's
  small capitals not added as a style. Taken by the agent, for the engineer to veto (agent):
  - the tile head is the existing `ToyKicker` (Unbounded capitals at 14 px, 2 px apart; the target's 8 px x 1.5 = 12 would
    be too small), now usable on every surface, not a second style; the capitals are the Label's `uppercase` property,
    which the pack names (`uppercase: true`) since a Theme cannot set it; the roster's human tag uses the same;
  - the chosen tab's underline is 3 px and stands right on the strip's 2 px line (a StyleBox's content cannot overlap
    its own border, so the target's overlap is not drawn); a hovered tab only lightens its text; a focused tab's ring is
    inside with square corners; the s5 suit menu's tabs moved from the left column into the strip with Esc at its right;
  - the stepper's buttons are 51 px squares with own-work minus and plus icons; the threshold's joined halves are
    `ToySegmentStart` and `ToySegmentEnd` with Unbounded numbers, and a chosen half locked for a guest keeps the deeper
    accent so the choice stays readable; s5's threshold stays two chips until the screens step (no zero-gap row exists);
  - the time tile's divider is 3 x 48 px of the base; a slot is 6 px inside above and below (12 at the sides) so a
    large-text name still fits the 132 px tile; the slot's picture is 57 px, the accent in the hand and light on the belt;
  - the workbench: the title Unbounded 36 (the nearest role to the target's 30), the card's name Unbounded 22 (a new
    role, `type.display-small`), its effect Onest 20 dim, its price Unbounded 36, a card you cannot afford dims its name
    and price; the card under the crosshair has a 3 px accent outline; «Мутувати» is one variation, outlined until
    hovered and filled while hovered or held;
  - the dead's room's tile sits 36 px down, where the round's time tile is: the room's name as its head, then «Повернення
    через» and the countdown at the time's size (36), so the return reads as the round's time does; `ToyPlateCount`,
    `ToyPlateHead` and `ToyPlateHeadText` are deprecated;
  - not drawn: the target's «Лобі поруч» head, since it has no copy key.
- **The screens redrawn to the approved target (ui-2.2.0)** (the target `pages/suit-final/`; prime-game-ui#133 s5, #134
  s4 and s6, #135 s1, s3, s8 and s10, and the follow-ups that finished the step; `tokens/README.md`, "The screens step,
  ui-2.2.0"). The engineer's words (2026-10-22, chat, translated):
  - no frame draws a focus ring by default: the game grabs no visible focus when a screen opens, and one «З клавіатури»
    state per screen shows the ring (s5 `ship-keys`, s8 `keyboard`); s4 and s6 have no focusable control, s1, s3 and s10
    no keyboard state;
  - the language is chosen only in Settings (s1's invite lost its language chips);
  - the match settings are on the ship's console (s4 `console-host`, `console-guest`), not in the Esc menu;
  - the Lobby tab is gone from the Esc menu (s5), with its states.

  Taken by the agents, for the engineer to veto (agent):
  - s5: the menu tile is a fixed 1200 x 780 on every tab, so switching tabs never moves it (a session's five tabs at large
    text and Character's 456 x 608 preview set it; the target's 990 holds two tabs);
  - s5: the page body above the footer is a `ToySettingRow`, so its bottom hairline is the target's line over the footer
    (Find a lobby, Game); Host, Join by address and Tutorial are ghost buttons at the footer's left, Quit at its right; no
    Resume in the ship (the Esc keycap closes the menu); Join by address is a ghost toggle whose pressed fill marks the
    open address entry; the code entry's column is 420 px and the address entry takes its place and width;
  - s5: every settings row is at least 88 px (a dropdown row's height; the target's is 69), in the target's order, volumes
    first (Overall, Voices, Effects, Music, Talk mode, Threshold, Mic, Mic test, Noise); the two-way choices (noise,
    window, large text, reduced motion, language) stay toggle chips, since the screens have no zero-gap row for the joined
    halves;
  - s5: Leave is the outlined secondary button for everyone, the host's danger colour stays on the confirm dialog's
    button; the Guide's card has no panel of its own inside the menu's tile (no tile in a tile); the world behind s5 is
    the ship, as in the target's frames;
  - s5: the settings section list and the Guide's topic list are `ToyMenuItem` (dim idle text, the open entry a row fill
    with light text), now a light-context variation; the Guide's card has the same head as s3's and s8's, «Як робити» in
    small capitals over the task's name, so the card is the same in s3, s5 and s8;
  - s4: the console's title is the lobby's name (`lobby.default_name`); no presets, no lobby-name field and no Knives on
    it; its setting rows are at least 72 px, so four rows and the code fit the 456 px inside the frame, the four values in
    one 156 px column; the 50 | 100 halves (`ToySegmentStart`, `ToySegmentEnd`, 120 px each) touch, placed by anchors
    inside a `Control`; a guest sees the value «50», not the locked segment; the room code is plain text after «Код», no
    keycap and no Copy (the crosshair is no clipboard);
  - s4: the console is drawn off centre so the crosshair rests on the lower right of the humans' minus, which hovers, clear
    of its icon (on the icon it read as a broken glyph);
  - s4: the ready marks (roster, ready plate, own tile) are the suit's pips (`ToyPip`, `ToyPipHealth`, 23 x 15); the roster
    is 330 wide (target 276) so «Олена · хост» fits at large text; the countdown keeps the calm `ToyPlateText`; no
    crosshair at the boot; the mic stays beside the ready tile; the boot hint is an «Esc» keycap (`ToyKeyOnDark`) and
    `tutorial.list.menu` («Меню»); the sample names are Глорп and Зінга, as on the other screens;
  - s6: the human's team line is a body-colour dot and the text, as on the target;
  - s1: the invite's head and the lesson list's head reuse `tutorial.list.title` («Навчання»); the lesson tile's head is
    `tutorial.step.progress` in `ToyKicker`; the lesson tile sits 36 px down (the time tile's place) and hugs its content
    (at least 720), everything at the left; the lesson list takes the roster's styles and place, the current lesson in
    the accent instead of a mint chip;
  - s3: the three tiles keep their text at the left; the spinner is 72 px inside the join tile; the loading title is
    `ToyPlateTitle`, not a small-capitals head (a frame with only Unbounded text stops the shots tool's font check);
  - s3 and s8: the how-to card's head is «Як робити» (`ToyKicker`) over the task's name, `ToyHowtoNote` no longer used
    there; s8: a room's name is its small-capitals head (`ToyKicker`), its pictogram stays 72 px and centred in the room's
    body, the lit zone fills that body; the pictograms are drawn in the dim colour (`palette.dim`, the pack's
    `tint_color`), the quiet level of the room's head (they were the source ink, nearly invisible on the dark tiles);
  - s10: the winner line is `ToyTitleOnDark` (Unbounded 44, the target's 30 x 1.5), the reason and the countdown
    `ToyTextMutedOnDark`; on the cops' coral ground all three lines are `ToyTextOnDanger`, so the target's three sizes are
    one there;
  - s3 and s8: the hairline rows (`ToySettingRow`) keep the row's 18 px inside margin, so they sit 18 px in from the
    small-capitals head above them (in the target they line up);
  - the screens page's worlds behind the UI (page art, not game UI) are the target's ship (`menu`), house (`room-light`)
    and dead's room (`room-dark`) in its colours, instead of the old lilac and beige stand-ins.

  Open:
  - a missing copy key, not drawn: «хост» on its own (the roster's host tag; the host's row uses `lobby.host_mark`);
  - the workbench step screen is parked until the device's new art.

  Since (the engineer, 2026-10-22, chat: the six drafts "as recommended", copy round 8): `find.nearby` «Лобі поруч»,
  `find.none` «Поруч лобі немає», `find.your_code` «Твій код», `unit.ms` «{count} мс», `console.title` «Матч» and
  `map.title` «Мапа», drawn in ui-2.2.1. Taken by the agent, for the engineer to veto (agent):
  - s5's lobbies nearby replace the placeholder tile, as the target's list: the head, one `ToyPresetCard` row per
    lobby (a toggle; the chosen one draws `ToyPresetCardSelected`, the target's accent edge) with the name
    (`lobby.default_name`), the players as data («6 / 10») and the latency (`unit.ms`); a full lobby is a disabled row
    with its name dim and `connect.fail.full`; the filled Join under the list at the right (the code entry's stays
    outlined); a new state, nobody nearby, shows `find.none` in one quiet line and no Join. What "nearby" means and
    whether every ship has a code are the game's ([prime-game#1316](https://github.com/xperiaroco2/prime-game/issues/1316));
  - s5's footer starts with «Твій код», the code and an outlined Copy, before the ghost jobs, as the target's `.mf`;
  - s4's console title is `console.title` «Матч» in place of the lobby's name (#214), which the nearby list shows;
  - s8's board has the head «МАПА» (`ToyKicker`) 30 px from its top, on the line of the task list's «ЗАДАЧІ», in line
    with the rooms' left edge; the sample rooms moved 24 px down under it.

  Since (agent, 2026-10-22): the role bands «Прибулець» / «Людина» (s6) and the cops' «Попались!» (s10) are in
  capitals, as the target writes them, while «Вечірка вдалася!» and «Час вийшов» keep their case (the target sets
  those in sentence case). The capitals are the Label's `uppercase` set on the node in the screen source (in s10 only
  in the cops' state), not on `ToyTitleHero` / `ToyTitleHeroAlert`, which draw both; the deck keeps its sentence-case
  words. The screens' format takes `uppercase` on a Label and in `per_state`, and the handoff names it.
  No failure head over s3's failure tile (agent, 2026-10-22): the tile's own title (`connect.fail.title` and the
  other `*.title` keys) already says what happened, and a small-capitals head above it would only repeat it; the target
  draws no failure screen. No key is added.
- **The engineer decides on finished results** (the engineer, 2026-10-22, chat, translated): "do everything by the recommendations, I approve it all; I have no time to reread every text; I will look at the finished results and say what to change". From here the agent takes its recommended option on texts and look questions itself and shows him the result; see the rules change in `CLAUDE.md`.
- **Copy round 9** (the engineer, 2026-10-22, "as recommended"): the host tag «хост» (`hud.roster.host`) and the four keys the side menu no longer draws removed (`esc.tab.game`, `esc.tab.role`, `esc.role.teammates`, `esc.character.locked`). Drawn in ui-2.4.0: s04's roster puts a quiet «ХОСТ» tag beside the host's name, as on the target. Agent: the tag is a new pair of variations, `ToyRosterTagHost` / `ToyRosterTagHostText` (the human tag with the edge colour and dim text, the target's `.tg.h`); `lobby.host_mark` («{name} · хост») is no longer drawn and was removed from the deck.
- **Copy round 10** (the engineer, 2026-10-30, director's chat, "За рекомендацією, нова UI-сесія", recorded on [prime-game#1039](https://github.com/xperiaroco2/prime-game/issues/1039#issuecomment-6520833637)): the rows the night's game work asked for, in ui-2.5.0; the English the game PRs and issues recommend, the rest by the agent's recommendation under his standing word of 2026-10-22.
  - The three places ([#149](https://github.com/xperiaroco2/prime-game-ui/issues/149), prime-game#1218): `control.swap` "Back to the last place" (as #149 asks), «Назад до попереднього місця» (agent); `control.place_1` to `control.place_3` "Place 1" to "Place 3", «Місце 1» to «Місце 3» (agent: the place is the game's word, and a Controls row names the place it draws).
  - The Hand and belt lesson (prime-game#1376, [the wording](https://github.com/xperiaroco2/prime-game/issues/1376#issuecomment-6508538736)): `tutorial.step.hand_belt_draw.*` "Draw from the belt" / "Press {key} to take that place into your hand", `tutorial.step.hand_belt_wheel.*` "Scroll through your places" / "Turn the mouse wheel to take the next place", `tutorial.step.hand_belt.title` "Back to the last place". Ukrainian (agent): «Візьми з пояса» / «Натисни {key}, щоб узяти в руку предмет із цього місця», «Перебери свої місця» / «Покрути коліщатко миші, щоб перейти до наступного місця», «Повернися до попереднього місця». s01's step note lists the lesson's three steps.
  - The lobby bar, both languages as prime-game PR #1414 and #1415 recommend: `station.tap` «Пивний кран», `item.mug` «Кухоль пива», `item.mug_empty` «Порожній кухоль», `hud.hand_over` «Натисни {key}, щоб передати». `station.*` joins the shared prefixes (agent).
  - The estate's rooms (prime-game PR #1402): `room.house` House, `room.summer_kitchen` Summer kitchen, `room.ship` Ship, `room.fallen_trunk` Fallen trunk (estate-map.md §3, as the PR recommends); «Будинок», «Літня кухня», «Корабель», «Повалений стовбур» (agent). `room.pantry`, `room.greenhouse` and `room.garage` were already in the deck.
  - Joined by the agent: `settings.controls.reserved` "Reserved key" / «Зарезервована клавіша» ([#116](https://github.com/xperiaroco2/prime-game-ui/issues/116), as proposed), and `room.roof` removed ([#65](https://github.com/xperiaroco2/prime-game-ui/issues/65)). [#114](https://github.com/xperiaroco2/prime-game-ui/issues/114) (13 key drops) waits: s01, s03 and s05 still draw five of them, so it is screen work, not a copy row.
  - ui-2.5.1, restored (agent, technical, on the director's recommendation of 2026-10-30): the game still pins ui-0.8.0 and reads 19 keys later rounds removed, so they are back with their ui-0.8.0 rows until the game adopts the redesign (prime-game#1319) and stops reading them: `control.spectate_next`, `control.spectate_previous`, `dead.respawn_in`, `dead.watching`, `item.gnome`, `item.oil`, `item.package`, `item.parasol`, `item.wine`, `lobby.setting.packages`, `map.zone_hint`, `tutorial.list.deliver`, `tutorial.step.deliver.title`, `tutorial.step.deliver.how`, and five that copy round 9 retired on purpose, `esc.tab.game`, `esc.tab.role`, `esc.role.teammates`, `esc.character.locked`, `lobby.host_mark`. The screens still draw none of them; the decisions that retired them stand. `room.roof` stays removed.
  - ui-2.5.2, the package again (agent, technical, on the director's recommendation of 2026-10-30): the game's tutorial completes the pick-up lesson on the kind `package`, and the battery left the MVP on 2026-10-23 (GDD, "The battery"), so `tutorial.step.pick_up.title`, `tutorial.step.pick_up.how` and `tutorial.step.put_down.title` take their ui-0.8.0 rows back ("Pick up a package" / «Візьми пакунок», "Aim at the package and press {key}" / «Наведи приціл на пакунок і натисни {key}», "Put the package down" / «Поклади пакунок»); s1's wireframe frame and the showcase sample follow.
- **The dead talk to each other** (the engineer, 2026-10-22, chat, translated): "yes: the dead hear and talk to each other, the living do not hear them (and the other way round)". s09's dead's room shows the mic on at the bottom left, with «Тут також: …» (`dead.also_here`) beside it, the dead the player hears; no other HUD. Agent: the chip moved from its own corner into the mic's row so the two do not overlap. Noted on [prime-game#1032](https://github.com/xperiaroco2/prime-game/issues/1032). Drawn in ui-2.2.3.
- **The cops' minute shows one clock** (the engineer, 2026-10-22, chat, on [the choice page](https://claude.ai/artifact/BayyQwMMTHbvmCsze2qqe4), `pages/cops-clock/`): A, "only the cops' countdown, the round timer hides". While the minute runs, s07's top tile keeps only the anger meter (the timer and its divider hide) and the danger banner counts down; both ends are a human win, so the earlier clock is the only one that matters. When the round has less time left than the countdown, the banner is not shown and the timer stays. B (both clocks, as on the target) stays on the page, not chosen. Drawn in ui-2.2.2. Open: how long the minute is (game design).
- **The item bar is A** (the engineer, 2026-10-20, chat, translated, on the MVP screens page): sticker slots with a
  big item picture and a name tag over the bottom edge; B (a belt strap with a pocket) and C (the alien's hand
  holding the item) stay on the page, not chosen. The name tags' words are his texts.
- **No inventory for now** (the engineer, 2026-10-20, chat, translated): "forget the inventory for now, we don't make
  it, everything as it was": no inventory screen is made; the round keeps the hand and belt slots.
- **No kill notice and no killer shown** (the engineer, 2026-10-21, chat, translated): "There will be no banner of who
  killed whom. None at all. The game does not show who killed you." The round HUD (s7) has no kill notice and the
  dead's room (s9) no killer line; `hud.kill_notice` and `dead.killed_by` left the deck, and `ToyPlateNotice` and
  `ToyPlateHeading` stay in the pack unused until a major release. This replaces the kill-notice and killer-line
  lines of ui-1.2.0 and of the screens s06 to s11 below. Open: how the return from the dead's room is shown, to be
  redone later (the engineer, same message).
- **Childish, the grown-up options (2026-10-21)** (the engineer, 2026-10-21, chat, translated): "the initial idea was
  cool, but now it looks very childish, as if we made a game for kids". He keeps what he liked: the deep purple, the
  mint, the alien green for the main action, the coral for alarm; the fonts were fine. The answer is the grown-up
  options page (`pages/grownup/`, built by `pages/grownup/build.js`): three directions on the same MVP screens (A, the
  sticker grown up; B, broadcast graphics; C, alien tech), three item icon styles from a GPT-image batch
  (`batches/2026-10-21-ui-item-icons.toml`, cap $3: vinyl toy, ink line, studio product shot) and a mix strip; the
  research behind it is `docs/research/2026-10-21-grown-up/report.md`. Nothing is decided yet: the sticker sections
  below stay what the game ships until he picks a direction and an icon style.
- **Keep the sticker, add the glow (2026-10-21)** (the engineer, 2026-10-21, chat, translated): he liked our original
  interface and would edit it a little rather than redo it; the title face he likes is Kablammo, the logo's face (read
  back in chat); from C (alien tech) he likes the bright acid-green buttons that glow ("acidic"), but C alone looks too
  simple; the icons so far look like AI slop, more options are needed. The answer is the page `pages/sticker-glow/`
  (built by `pages/sticker-glow/build.js`): the sticker screens of `pages/mvp-screens` with Kablammo on the
  full-screen titles and the acid glow at three strengths (1: the focused action and the item in hand; 2: plus the
  siren while anger rises; 3: brighter and wider, plus the timer's last seconds), three new item icon treatments
  (sticker and vinyl+ from `batches/2026-10-21-ui-item-icons-2.toml`, neon as own work) and a mix strip of each in
  the glowing hand slot. Nothing is chosen yet among the strengths and the icon treatments. On the page, open to his
  veto: a glowing plate's hard ink shadow becomes a thicker bottom and right border (4/9/9/4 px), because Godot's one
  shadow carries the glow (agent); the full-screen field is the soft ink `#54457A` instead of `#1F1033`, where the
  ink outline was invisible (1.00:1) (agent); the rocket's fins are mint in the acid slot, where green vanished (agent);
  the "missing points" button text is ink (3.82:1 before) (agent); one glow per screen, so the cards you can buy do not
  glow (agent). Kablammo: Google Fonts serves it with the `cyrillic` and `cyrillic-ext` subsets, so Ґ, Є, І and Ї
  are there (OFL); it draws lower case as capitals (seen in the page's render); it smears into blots at 34 px, so it is
  for the 84 px full-screen titles only and the workbench title stays Nunito; Ч, Ц, Щ and Ь carry curled drips and
  "!" reads as a dagger (the end title keeps it: the text is his).
- **The glow is for the bars; the line icons unlit (2026-10-21)** (the engineer, 2026-10-21, chat, translated, on the
  sticker-glow page): "by the glow I meant the progress bar, not the icon"; the neon item icons: "the shape is fine, but
  without the glow"; "let's keep researching". So the hand slot no longer glows: it is the plain green sticker slot of
  `pages/mvp-screens` again, and the siren and the timer do not glow either; the acid main action keeps its glow behind
  a switch. The answer is the page `pages/glow-bars/` (built by `pages/glow-bars/build.js`, research in
  `docs/research/2026-10-21-glow-bars/`): three ways to light the anger, health, stamina and return bars (1: the fill
  always glows, faintly while calm; 2: a lighter tip plate glows; 3: a plain bar until its alarm line, then the track
  glows and pulses), two options from the critic (a dark purple track; a brighter light, acid for the green bars and a hotter
  coral `#FF5C38` for anger), and the twelve item icons as unlit line drawings in three colourings. Nothing is chosen
  yet among the three ways, the options and the colourings. On the page, open to his veto (agent): the alarm lines
  (anger over 70 %, health and stamina under 30 %, the return bar's last 5 s), health at 24 % in frame 4 to show an
  alarm, the fully rounded fill end, a 0.9 s pulse each way, and the glowing button keeping the plain button's footprint
  (its box 5 px bigger to the right and down, where the hard shadow was).
- **The chosen look, ui-1.3.0 (2026-10-21)** (the engineer, 2026-10-21, chat, translated, on the glow-bars page,
  recorded on prime-game#150): "we take way 3, the threshold, for the bars and colouring 3 (the line and one fill) for
  the icons". The page's other switches stayed at their defaults and are read as chosen too (agent): the acid main
  action glows, the bar track is white (not the dark purple), the light is the bar's own colour (not the brighter
  acid and hot coral). The sticker style stays; the pack ui-1.3.0 carries it (`tokens/README.md`, "The glow since
  ui-1.3.0"), and `pages/mvp-screens/`, the components showcase and the screens s01 to s11 show it:
  - the main action (`ToyButtonPrimary`, a value change) is the acid `#B6FF3C` with Godot's one shadow as its glow;
    its hard ink shadow is the edge form, so its `base` is gone and the game drops its ToyRaised wrapper;
  - the anger, health, stamina and return bars are one ProgressBar each with a Calm and an Alarm variation (new); only
    Alarm glows (the track's shadow in the bar's own colour); the alarm lines and the 0.9 s alpha pulse are game code
    (the handoff in `tokens/README.md`); the old fill and track variations of the bars are deprecated;
  - the full-screen titles (`ToyTitleHero`, `ToyTitleHeroAlert`) are Kablammo (`type.hero-display`, a value change)
    on the new `ToyBackdropFullScreen`, the soft ink `#54457A`; smaller titles stay Nunito Black;
  - the twelve `item-*` icons are the line icons in colouring 3 (ink line and accent, one muted fill of the item's
    own colour), a value change under the same names; the fourteen `item2-*` icons (not chosen) left the pack's
    assets before any tag shipped them, so they never reach the game (stray copies stayed in its folder until
    ui-1.4.0); they live on in `pages/mvp-screens/item2/` for
    the sketch page (agent).
  The look choices the agent took alone:
  - the acid hover and held shades `#CEFF73` and `#9BE800` (agent);
  - the glow sizes at the 0.75 scale: the main action's 45 px and the alarm's 42 px (the page's 30 and 28 × 1.5)
    (agent);
  - the unplugged main action is flat: no glow, no edge form, a 6 px outline, its label ink (agent);
  - pill ends on every bar, and the fill drawn over the track's full height in the same 5 px outline (agent);
  - the health bar is plain green; the old coral-to-green ramp is dropped (agent);
  - the full screens' ground is a new variation, `ToyBackdropFullScreen`, rather than a recoloured night ground,
    which stays for the other screens (agent);
  - Kablammo at the hero size 96, the pack's size for the sketches' 84 px titles (agent);
  - on the full screens the "Your role" and return lines are mint (`ToyTextOnDark`), since the muted lilac is
    3.82:1 on the soft ink (agent);
  - on `pages/mvp-screens/` frame 4 (anger full) health is at 24 %, so both an anger and a health alarm show, as on
    the glow-bars page (agent);
  - the knife's two dots are drawn as filled circles, since Godot's SVG import may skip zero-length round-capped
    paths (unconfirmed) (agent);
  - on the screens, s09's bleed-out bar takes the health bar's look and alarm line (under 30 %), since the time
    left reads as life, and the dead's room return bar on the count plate moves from `ToyBarProgress` to
    `ToyBarReturnCalm` / `Alarm` (agent).
- **Buttons are the sketches' sticker** (the engineer, 2026-10-21, chat, on the buttons-fix page, `pages/buttons-fix/`,
  look "Б"): the ui-1.3.0 buttons sat in a dark ink slab (14 px right and bottom outlines, a base under some), the
  focused one drew a second frame inside, and the acid main action had the slab under its glow. Look B, as on the MVP
  sketches (`pages/mvp-screens/`, `.st .btn`), replaces that; the pack ui-1.4.0 carries it (`tokens/README.md`, "The
  buttons since ui-1.4.0"):
  - every sticker button (the main-menu entries `ToyMenuItem`, `ToyButtonSecondary`, `ToyButtonDanger`,
    `ToyButtonPrimary`) is its face in its fill with an equal ink outline on every side and the corners as before; no
    edge form;
  - the hard ink shadow is offset right and down with no blur, drawn as the base layer (`ToyBaseRaisedOnDark` /
    `OnLight`): exactly the face's shape moved, nothing sticking out on the left or top; the main-menu entries gain it
    (the game builds them through ToyRaised);
  - hover a step lighter, held a step darker with the face sinking toward its shadow, unplugged lilac with a soft-ink
    outline and no shadow;
  - the focused, selected or open main-menu entry is the green #A6E85A, as the sketches' open entry, with no second
    frame inside;
  - the main action keeps its acid fill and its glow, with the equal outline and no slab or hard shadow under it.
  The look choices the agent took alone:
  - the sketch's 4 px outline, 5 px shadow and 14 px corners are 6, 8 and 21 px in the pack, the 0.75 scale's × 1.5
    as every length since ui-1.2.0 (the existing `stroke.control`, `offset.base`, `radius.control`) (agent);
  - held, the face sinks 4 px (half the shadow) and only down, as the game's press moves it (agent);
  - a focused secondary button turns green too, as a focused entry (both are mint stickers) (agent);
  - the focused main action and danger button keep their acid and coral and get a thin ring outside instead (the
    review of 2026-10-21: an 11 px inward outline read as the slab again): the pack's outer ring, 5 px (`focus.width`)
    at a 3 px gap (`focus.gap`), corners 29, in mint rather than ink, since an ink ring vanishes on the purple (1.1:1)
    and fails the contrast gate (agent);
  - the ring follows the surface, as the on-dark and on-light variations do: mint on the purple, ink on a mint face;
    the buttons on mint take the new `ToyButtonPrimaryOnMint` / `ToyButtonDangerOnMint` (the names say mint, since
    this pack's "light" context is the inside of a purple panel), today the workbench's buy buttons (agent);
  - chips, tabs, keys, fields, the dropdown, preset cards, plates, `ToyButtonPlain` and the ghost buttons stay as in
    ui-1.3.0 (agent);
  - the fourteen stray `item2-*` SVGs left in `dist/pack/icons/` at ui-1.3.0 (listed nowhere in the pack) are deleted
    (agent).
- **The round HUD's pictures are icon files** (`pages/components/icons/`, own work, page-only today; the pack lists
  them but no token names them yet): the siren as two files, `siren-off` (the lilac dome, anger calm) and `siren-on`
  (the coral dome with rays, rising and full); the empty slots `slot-empty-hand` and `slot-empty-belt`; and one
  `item-*` per MVP carried item. The new drawings take palette fills only (agent): the flower coral (its five colours
  not drawn yet), the printed car part a white rim before painting, the patty coral with grill marks, the burger with
  a coral party pick, the watering can lilac zinc, the garage's tools one wrench with a coral grip and its cable, the
  rubbish a purple bin bag with a yellow tie, the knife (in case it stays in the MVP) white with a coral handle; each
  kept from two candidates at 60 and 120 px (agent).
- **The sticker tokens, ui-1.0.0** (the re-skin of every Toy variation; the guide is
  `docs/research/2026-10-20-vibe/restyle-guide.md`). The look choices the agent took alone:
  - state shades inside the palette: mint, green and coral each one step lighter for hover and darker for held, a
    lighter purple `#3C2660` and a soft ink `#54457A` (agent);
  - a pressed sticker does not move: hover lightens the face, held darkens it, the shadow stays (agent; for the
    buttons replaced by the sketches' sticker of ui-1.4.0 above: a held button sinks toward its shadow);
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
    the engineer picked; they stand 12 px apart so the shadow clears the next entry (agent; the edge form replaced by
    the base layer in ui-1.4.0 above);
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
- **The tokens at the 0.75 scale and the MVP HUD, ui-1.2.0** (the engineer's 0.75 above: every sketch length × 1.5 at
  1920x1080, the font sizes kept; `tokens/README.md`). The look choices the agent took alone:
  - the hard shadow 8 px (the sketch's 5 × 1.5 = 7.5 rounded up as every length): it stays wider than the 6 px
    outline and equals a key's 8 px bottom edge (agent);
  - thin strokes (bar tracks, keycaps, small tags) 5 px and the focus ring 5 px with a 3 px gap (agent);
  - content margins grow only where the sketches draw the piece roomier (buttons 16/30, main-menu entries 17/33, tabs
    18/27, chips 10/24, toggle chips 13/30, the stepper 13/15, fields 15/27, setting rows 13/18, the alert plate 16/39);
    elsewhere they grow by the thicker outline, so a label keeps its room (agent);
  - the crosshair ring stays 3 px (the sketch's 2 × 1.5), thinner than the thin stroke (agent);
  - the map pin stays 28 px until the map screen is reworked: at 42 it covers the you-are-here chip (agent; replaced by
    the screens s06 to s11 below: 42 px, the chip moved clear);
  - a keycap is at least 44 px wide (52 at large text), so a one-letter key stays square (agent);
  - the old slots grow to 132 px; item bar A's hand and belt slots are new variations at the sketch's 150 and 126 (agent);
  - the anger track is a pill: the sketch's 12 px corners × 1.5 pass half its 30 px height (agent);
  - the roster's colour dot is a white disc the game tints to the body colour (agent);
  - text roles nearest the sketch's sizes: the cops' line at the title size 36, the goal and the full-screen stickers
    at the heading size 28, the tags at the caption size 18, the dead's head at 36, the countdowns Rubik 64 (agent);
  - the new HUD plates, the roster and the slots cast the edge-form shadow, as the existing plates (agent);
  - a mutation card's "not enough" state is only its disabled button, as on the sketch; the workbench panel is
    ToyPanelDialog (42 px inside where the sketch has 39 and 45) (agent).
- **The screens s01 to s05 at the 0.75 scale, for the MVP** (the audit `docs/research/2026-10-20-mvp-screens/audit.md`,
  the sketches `pages/mvp-screens/` and `pages/sticker/` × 1.5; it replaces the Styled screens lengths below for these
  five screens). The look choices the agent took alone:
  - gaps: each old gap × 1.5 taken to the nearest step of the space scale (4→8, 8→12, 12→16, 16→24, 24→32; 32 stays),
    so no spacing variation is added (agent);
  - edges 39 px (the sketch's 26 × 1.5): the language chips, the lobby HUD, the tutorial's HUD and plates, the version
    (agent);
  - the Esc menu is 1536×864, 0.8 of the screen: the sketch's 1230×672 holds the host settings alone, the Lobby tab
    also needs its players column, the code row and Ready; the tabs keep 288 px (agent);
  - the Lobby tab: the four preset cards share the page width (at least 196 px), as on the sketch; the controls in a
    345 px column at the right (the sketch's 230 × 1.5), steppers and chips right-aligned, the stepper value 156 px;
    the players column 420 px (agent);
  - the anger threshold is a pair of toggle chips, as on the sketch; a player who is not the host sees its value (agent);
  - setting rows are at least 96 px (the field row's height, 64 × 1.5) in every list (agent);
  - the Settings controls sit in a 450 px column (the sticker sketch's 300 × 1.5), in the Esc menu and in the main
    menu's Settings panel (812 to 1881 px across, 90 to 990 down) (agent);
  - the Guide's card stands its four frames two by two (272×204 art) beside a 360 px topic list, so the art stays large;
    s3 and s8 keep one row (agent);
  - Character: the preview 456×608, the swatches 60 px (agent); the Game tab's buttons keep 760 px (agent);
  - the main menu column at the sticker sketch's place, 84 and 66 px in, 600 px wide; the code and Direct panels keep
    784 px (agent);
  - connecting 1152 px and the failure column 1272 px (× 1.5); the loading column 960 px and the tip plate 1072 px, as
    at × 1.5 the names and their states read apart (agent);
  - the lobby HUD's players plate is 570 px (the sticker sketch's 380 × 1.5) (agent);
  - the tutorial draws the MVP round HUD of s7 without the timer, the anger meter, the roster (the lesson list takes the
    top right) and the role: the bars (no captions since s7 dropped them, below) and the mic beside them at the bottom
    left, item bar A 51 px up at the bottom right; the lesson plate 1140 px, the list 520 px from 270 px down (agent);
  - Controls lose the two spectating keys (spectating left the MVP) and gain Crouch, Sneak and Throw, the game's keys
    since rounds 4 and 5 (agent);
  - icons at the new scale: the slider knob and the check boxes 42 px with a 6 px outline, the spin arrows 27 px; the
    mic drawn at 42, the check at 36, the lock and the teammate mark at 30 (agent);
  - a human's Role tab lists the other humans under the existing «Твоя команда · {count}» (agent);
  - a human's role on the Role tab is coral, as on the role reveal (s6) and the HUD's role sticker (s7): a new
    `ToyDisplayAlertOnLight`, the coral `ToyDisplayOnLight` (6.9:1 on the panel, gate a17); an alien's stays mint (agent);
  - every MVP task's how-to card shows Delivery's frames as a placeholder until its own wordless art is drawn (agent).
- **The screens s06 to s11 at the 0.75 scale, for the MVP** (the same audit and sketches × 1.5; s11, the mutation
  workbench, is new; it replaces the Styled screens lengths below for these screens). The look choices the agent took
  alone:
  - the round HUD of s7 as decided, at the sketch × 1.5: the time 33 px down, the anger meter 96 px down with the siren
    122 px right of the centre (the track's half, 112.5, plus 9), the role sticker and the roster 39 px in (agent);
  - the object name and the raising bar centred 64 px under the screen's centre, so the chip's top is the sketch's 33
    px under it (agent);
  - the roster lists the own row first, does not cut names and grows to its longest row; a dead player is dimmed with a
    draft «· поза грою» (agent);
  - a slot of item bar A is a Control holding its face and its name tag, so the tag can sit over the bottom edge (agent);
  - in a human's view another human's name plate keeps the old teammate mark (30 px) as a visible placeholder, since
    whether it is still needed is open (agent);
  - the protection chip 165 px down, the cops' banner 168 (the sketch's 110 and 112 × 1.5) (agent);
  - the role reveal and the ends: a centred column with 32 px gaps (the sketch's 30); the goal plate 900 with its text
    802; a human's team line on a coral sticker with the existing «Твоя команда: {names}» (agent);
  - the ends keep the recorded rule (the winner on a plate for a win, plain text for a loss); the reason line sits on a
    word sticker, green when the aliens won, coral when the humans did (agent);
  - the map keeps its panels inside the frame (the task list 60 to 684 across, the board 732 to 1860 and 60 to 1020
    down); rows 96, the «?» 63, pictograms 72; the House's sample rooms borrow the system B pictograms that fit (the
    garage the workshop's, the pantry the storage's, the study the office's, the living room the lounge's) (agent);
  - the map pin 42 px with 21 px corners; the you-are-here chip 21 px right of the pin's rect (the 9 px a turned pin
    reaches past it, then 12) and centred on it (agent);
  - the downed plate 900 wide (the old 688 × 1.5 capped at the goal plate's width) 228 px down, its bars 810 × 24; the
    give-up plate 192 px up with a 540 px hold bar (agent);
  - the dead's room as on the sketch: the head 39 px down, the countdown plate 540 in the centre, who else is there
    at the bottom left, the capsule note at the bottom right (agent);
  - the workbench: the price as one plural string («4 очки») at the card title's size, since the sketch's big number
    and small word would split a plural the game cannot split; a Close button in place of the «Esc — закрити» line, as
    the how-to card; every buyable card's button primary, the first focused (agent);
  - no captions on the health and stamina bars (the engineer wants less screen; the sketch draws none): health is the
    green bar on top, stamina the yellow one under it, 12 px apart (the sketch's 8 × 1.5), as everywhere in the game;
    the same in every screen that draws s7's vitals (s1, s6, s9); `hud.health` and `hud.stamina` stay in the deck
    (agent).
- **The UI is the alien's own equipment; no main menu** (the engineer, 2026-10-21, chat, translated): the current UI
  looks like a website, soulless, with no signature; bright and aggressive where it should be calm, dull where it
  should be fun; too much of everything. The UI should feel like the aliens' own: the alien ship's or the suit's
  interface (a helmet visor, a wrist device, something in that spirit). There is no main-menu screen: the game boots
  straight into the alien ship, which is the lobby the player walks around; Esc opens the menu on the suit (find a
  lobby, join one, settings). Three directions inside that idea, each on the same four frames, are on the suit UI page
  (`pages/suit-ui/`): A the helmet visor, B the wrist device, C the ship's plastic modules; calm everywhere except the
  cops' minute (the role reveal and the ends are loud too), one accent per direction plus the danger colour (agent:
  the three directions, their accents and fonts, for the engineer to pick from).
- **C, the ship's modules, is the base; physical screens for world interactions** (the engineer, 2026-10-21, chat,
  translated, on the suit UI page): take C and develop it. He likes its minimalism ("nothing extra") and health and
  stamina as segmented pips, not a solid bar; C's box shapes look odd, so the shape is to be reworked, and the colours
  developed. From B he likes that the interface is physical where the player uses a thing in the world: such an
  interface (the mutation workbench, for one) is a screen on the machine itself, shared by whoever stands there (in
  Godot a SubViewport drawn on the machine's mesh), while the personal HUD stays a thin C-style overlay. The boot
  straight into the ship (no main menu) is recorded on prime-game#150. Four module shapes and four palettes to pick
  from, and the workbench as a screen on the machine, are on the suit C page (`pages/suit-c/`); the agent recommends
  the label strip and the ink-and-mint palette (agent: the variants and the recommendation, for the engineer to pick).
- **The plain tile and the ink-mint palette** (the engineer, 2026-10-22, chat, translated, on the suit C page): the
  shape is «Плитка» (one fill, a 1 px edge of one colour, 8 px corners; the label is a line of text inside), the
  palette «Чорнильна мʼята» (module #2A2540, base #1A1629, text #ECE8F7, accent #6FF2B4, danger #FF5C6C), fonts
  Unbounded and Onest. The big-corner shape is not used for now (maybe somewhere later). The mutation workbench is a
  physical screen on the machine: you walk up, press a button to start, choose a mutation, step into the machine, and
  it mutates you. Earlier choices stand: minimalism; health and stamina as segmented pips; the boot straight into the
  ship with no main menu, Esc opens the suit menu (find a lobby, join by code, settings); calm everywhere, loud only in
  the big moments (the cops, the role reveal, the ends); no points on the HUD; no kill notice; the roster with body
  colours, humans see other humans marked. The whole screen set in this look is the suit final page
  (`pages/suit-final/`). Taken there by the agent, for the engineer to veto (agent):
  - the host's match settings (humans, anger threshold, duration, the lobby code) are a shared screen on the ship's
    console, as the workbench is, not a tab of the Esc menu; the lobby HUD is the ready count at the top, a ready
    square and a host tag in the roster, and the player's own ready state at the bottom left;
  - the anger bar is muted grey while calm and turns danger-coloured past the alarm threshold, so the round stays
    quiet; the siren hangs off the bar's right end (meter A) and becomes a solid danger chip when the meter is full;
  - loud moments are full-width bands with 84 to 140 px Unbounded titles (mint for the aliens, the danger colour for
    the humans and the cops); the cops' minute adds an 8 px danger edge around the screen; the cops' end fills the
    whole screen with the danger colour;
  - the workbench's third step is seen from inside the capsule, the machine's screen ahead showing the progress pips.
- **The look in the tokens and the pack, ui-2.0.0** (the engineer, 2026-10-22, chat: put the approved look into the
  tokens and the game's pack): the palette, the tile, the pips, the minimal plates, the loud moments and the fonts of
  `pages/suit-final/` are the tokens now (`tokens/README.md`, "The plain tile since ui-2.0.0"); the target's lengths x 1.5,
  rounded up (its 1 px edge is 2 px at 1920x1080). A major release: the old palette names, the glow and the hard shadow
  left the pack; no variation was removed (the replaced ones are deprecated). Taken by the agent, for the engineer to
  veto (agent):
  - the backdrop behind the suit menu is the base at 87 % (a dialog's 90 %), not the target's 50 %, so light and dim text
    keep 4.5:1 over a white world;
  - shades for states: hover #403962 (row) and #9AF7CC (accent), held #4FDB99 and #E84556, an unplugged button a row face
    with dim text and a base bottom edge; focus is a 3 px accent ring, outside the bright and row buttons, inside fields,
    tabs and cards;
  - numbers and titles are Unbounded (as the target page sets the time, counts, prices and the machine screens' titles),
    text Onest Medium and Bold; the kicker is Unbounded at 14 px (the target's 8 px x 1.5 = 12 would be too small);
    display 36, display-large 78, hero 126; smaller text sizes unchanged;
  - the menu's tab list: the chosen tab is a row fill (the target's `.nav`), not an underline; the alert tag (a key clash)
    is the danger face with the danger ink, since danger text on a row face is 4.2:1;
  - the item pictures are the line alone in currentColor (the target's line icons), tinted by the game; the slider knob,
    the check boxes and the sirens are redrawn in the palette;
  - the screens: s07 puts the time and the anger meter in one tile, health and stamina as ten pips with their labels
    (`hud.health`, `hud.stamina`) in a suit tile, the slots' names inside the tiles and a danger edge around the screen in
    the cops' minute; s06 and s10 put the loud titles on a full-width band. The target's words that have no copy key yet
    (the «Гнів сусідів» caption, the kickers «Час» and «Костюм» over the tiles, «Готові 4 з 6») are not drawn: they are the
    engineer's texts (`ToyKicker` is ready for them).
  - The fonts (Onest, Unbounded, OFL-1.1, google/fonts at 45e3d52) are wired but not downloaded: the build names the four
    files to add (`tokens/README.md`, "The pack's fonts").
- **The how-to cards in the game's own look** (the engineer, 2026-10-22, chat, translated): the clean-sketch cards are
  outdated now that the game has its own look, so their art is generated with the art track's OpenAI image tool
  (prime-game-art `docs/openai-images.md`, its standing permission). **Amended the same day:** the pilot in 3D with the
  roster's chameleon h01-3 (rf2 was rejected first) reads as "AI slop"; the cards are **flat 2D cartoon**, not 3D
  renders, and their figure need not be a game character (any cartoon alien); a player must not take them for AI
  images at first glance. Next: research, then about ten card looks side by side before any one card is finished
  (`docs/research/2026-10-22-howto-card-styles/`). **Round 1's pick** (the engineer, 2026-10-22, chat, on
  [the styles page](https://claude.ai/artifact/UdYpeFtaeo7drCXmeToqrN)): direction 1, the three-ink screenprint; go
  deeper into mid-20th-century American commercial art (print ads, enamel signs, safety posters with a cartoon
  mascot), with ten sub-directions next. His references stay private; the agent's reading: bold flat colour on cream
  paper, a thick ink line, an expressive mascot with motion bursts, slightly worn print; no lettering (the cards stay
  wordless) (agent). **Round 2's reading** (the engineer, same day, chat, on
  [the round-2 page](https://claude.ai/artifact/UG2Np47ojuCu11DqU6aGGc)): the graphics of sub-direction 1 (the 1940s
  two-ink safety poster) but not its red alien; the character is round 1's cute little green alien; round 3 crosses the
  two ([page](https://claude.ai/artifact/9xtL695eJFfprJ3Bb4r5A5), prime-game-art batch `2026-10-22-howto-styles-r3`).
  **The card style** (the engineer, same day, chat, on round 3): variation 1's inks (teal-green alien, signal red,
  navy, cream paper) with variation 4's white three-fingered gloves; the antenna balls are always signal red; the eyes
  are the same in every frame, white eyeballs with dark pupils (the fry frame's), never dark alien ovals. One
  high-quality check first ("to make sure we understood each other"): batch `2026-10-22-howto-style-check`, the fry
  frame and the plate frame drawn from it ([page](https://claude.ai/artifact/3cgDfjGFYs3cZjmWFQ9cvw)).
  On the check (the engineer, same day): right, but the done burger gets round 3's thumbs-up; the three dots under
  the burger (the agent's plate mark for the order's place) are dropped, unclear in one frame (agent). The whole Cooking
  card, seven frames, each drawn from the check frame's alien: batch `2026-10-22-howto-cooking-card`
  ([page](https://claude.ai/artifact/3TRbWHbruTJm8nTZz2CrW8)).
  **A concept, not the final art** (the engineer, same day, chat, translated): "we don't know yet how the final art
  will look, the herbs, the barbecue, the 3D printer, the icons; we'll do these later, when the main art is ready; I
  wanted to see the concept". So the look is the concept (the 1940s poster with the teal alien); **the Cooking card
  stands in as the placeholder for every how-to card** in the screens and the pack until the game's art exists, and
  then each task's card is drawn to match its real props. Frame 5's herb mismatch is left for then.
  **A card has as many frames as its task
  needs**, not four: when they do not fit, the card scrolls ("we're not limited to 4 cards; it can scroll if needed;
  the engine, for one, is hard to fit in 4"). The pilot is Cooking, seven frames (batch
  `2026-10-22-howto-cooking-pilot` in prime-game-art). This replaces the colourings of the card-ink page
  (`pages/card-ink/`), which is not decided. The images stay in the art repo (the raw folder, its manifests): this
  repo's licence list does not cover generated art, and the frame, the tile and the scroll stay the UI's.
- **The screens spec and the showcase in the new flow and ui-2.0.0** ([#111](https://github.com/xperiaroco2/prime-game-ui/issues/111);
  the engineer's decisions above: the boot into the ship, the suit menu, the pips, the workbench on the machine, the how-to
  card that scrolls). The main-menu screen s02 and its handoff are removed (the other numbers stay); this replaces the
  main-menu lines of "Screens" and "Styled screens" below. Taken by the agent, for the engineer to veto (agent):
  - the suit menu's Game tab in the ship with no session (s5 `ship`, `ship-code`, `ship-direct`) holds the old main menu's
    jobs with its existing texts: Resume, Host, Join (a code field), Join by address (the address field; Join or host
    directly), Tutorial, Quit, as a 420 px list of secondary buttons with the open field to its right and no panel of its
    own; Join and Join by address show their pressed look while their field is open; there is no Lobby or Role tab without
    a session; the target page's «Знайти лобі» list is not drawn (no copy key, no server browser);
  - the how-to card's frames scroll sideways with no bar drawn (the pack has no sideways bar yet): in s3 and s8 the view
    shows three and a half frames (1384 px), in s5's Guide it fills the card beside the topic list (one row, 272 px art),
    so a frame cut at the edge shows there is more; seven own-work Delivery frames stand in for the Cooking card's seven,
    whose generated art stays in the art track;
  - s11 is the SubViewport's own scene, 960 x 540 (the target's 640 x 360 x 1.5), framed by ToyPanelDialog: idle (the
    machine's name), choose (the cards; the button under the crosshair hovered) and step (the chosen mutation's name and ten
    progress pips); no Close (walking away frees the machine); the target's «Почати» and «Стань у машину» are not drawn,
    since they have no copy key;
  - s1, s6 and s9 draw s7's HUD as it is now (the time tile, the suit tile with ten pips each, the slot tiles), every pip
    full at the round's start, in the tutorial and on the return from the dead's room;
  - s9's bleed-out bar is `ToyBarReturnCalm`, `ToyBarReturnAlarm` under 30 % (the health bars are deprecated);
  - the component showcase: the time tile (the anger calm, rising, past the alarm line, full) and the suit tile with the pips
    in the round HUD's section; the deprecated variations in a section of their own, a table with nothing drawn, so no
    clear base layer or caption shows; the role reveal and the ends on their bands; the workbench's buttons
    `ToyButtonPrimary`; a wordless how-to card, and one of seven frames that scrolls.
- **The five suit-screen words drawn on the screens spec** (the engineer's words, 2026-10-22, prime-ui#123, #124; ui-2.0.2).
  Taken by the agent, for the engineer to veto (agent):
  - s5: the Game tab and its page title read «Знайти лобі» (`esc.tab.find`) while there is no session (`ship`, `ship-code`,
    `ship-direct`) and «Гра» in a session: one tab, the game swaps its key; the target's list of lobbies nearby stays
    undrawn (no server browser);
  - s7: «Гнів сусідів» (`hud.anger`) over the anger bar inside the time tile, in `ToyHudCaption`, in
    `ToyTextAlertOnLight` past the alarm line; «Костюм» (`hud.suit`) heads the suit tile over the pips in
    `ToyHudCaption`; the target's small capitals were not added as a new style;
  - s11: idle shows the machine's name and «Почати» (`workbench.start`, `ToyButtonPrimary`, at least 288 wide for the
    crosshair); step shows «Стань у машину» (`workbench.step_in`, `ToyTitleOnLight`) between the mutation's name and
    its pips. This replaces the line above that the two are not drawn.

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
  - one accent for what matters: amber until 2026-10-21, then the sticker yellow #FFD60A (see below);
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

**MVP round of the copy and the card pilot** (the engineer, 2026-10-21, chat, translated: "all by the recommendations,
we fix later"):
- the 31 open copy questions of the MVP round (56 draft keys) take option a, the deck as it is; the deck did not change,
  so the game needs no new strings (`copy/flags.json`, round 6);
- the how-to cards keep the clean sketch; the pilot's picks are Wi-Fi A and cooking B, their accent the sticker yellow
  #FFD60A (option Б of [the card-look page](https://claude.ai/artifact/3uhpU2HXbp1bLsnxafAKck), the agent's
  recommendation), since the amber was not in the ui-1.3.0 palette.
