# The ten screens against the MVP match (audit, 2026-10-20)

The styled screens (`pages/screens/src/s01`..`s10`, `docs/handoff/`) were drawn for the M7 game: Engineers and
Dissidents, Delivery and Switches, spectating the living, "The Engineers won". The MVP match was frozen on 2026-10-20
in prime-game `docs/design/m8-match.md` (cited below as §N with its source issue) and the GDD's MVP task set (GDD §8,
#1144). This audit says, for each screen and each MVP element, what to keep, change, add or drop. It decides no game
design: whatever the MVP leaves open is marked **open, the engineer's design**. The sketches of the new and changed
pieces are on `pages/mvp-screens/`. Every player-facing text there is a draft for the engineer.

Verdicts: **keep** (as drawn), **change** (same place, new content), **new**, **drop**.

## The screens

| Screen | Verdict | What exactly | Source |
|---|---|---|---|
| s01 Tutorial | change | The invite, the lesson plate, the keycaps and the lesson list keep their look. The downed lesson keeps (the knockdown stays). The lessons "Deliver" and "Death" (spectate) describe M7: Delivery left the MVP; the dead now wait in the dead's room. Which lessons the MVP adds is open, the engineer's design. | GDD §3 (#728); GDD §8 (#1144); §3 (#1032 c6289051758); GDD §15 (DD10) |
| s02 Main menu | keep | Host, Join, Join by address, Tutorial, Settings, Quit as drawn. Only the logo's words wait for the title. | §1 (#1031: title open) |
| s03 Connecting and loading | keep / change / new | Join steps and every failure keep. Loading: the tip `tip.two_hands` is about packages (change), and its how-to card draws Delivery's art (`card/delivery-meaning-1..4`): **new work**, wordless card art for each of the five MVP tasks. Whether loading shows the flight to Earth is open. | GDD §8 (#1144); §1 (#1031) |
| s04 Lobby | keep / change | The player list, Ready, the code and the countdown keep (GDD §3). The world behind it becomes the aliens' spaceship; how the trip maps onto Lobby, Countdown, Loading and Pregame is open. | §1 (#1031) |
| s05 Esc menu, Lobby tab | change | "Dissidents" becomes the number of humans (the host sets it exactly, e.g. 3 of 10). New row: the neighbours' anger threshold (e.g. 50 or 100). New row, decided: the Wi-Fi's number of passwords N. "Packages" drops (Delivery is out). The preset cards Standard (10 min), Quick (5 min) and Save your own keep their place; what each preset sets for the humans and the threshold is open. "Knives" and the "No knives" preset: open (weapons are deferred). The other task settings for the MVP's five types: open. | §2 (#1032); §5 (#1031); GDD §8 (#1144, Wi-Fi); §7 (#1040) |
| s05 Esc menu, Role tab | change | Role names and goals: alien and human, the goals of §6. The teammates list depends on whether humans know each other: open. | §1, §6 (#1031) |
| s05 Esc menu, Guide tab | change / new | The topic "Tasks" and its how-to cards describe M7: new card art per MVP task (as s03). "Downed" keeps. New topics (points, mutations, anger, cops, the dead's room) are the engineer's texts. | §3 to §6; GDD §8 |
| s05 Esc menu, other tabs | keep | Game (Resume, Leave, Quit), Character (name, body colour), Settings (sound, controls, display, language, accessibility). | — |
| s06 Pre game | change | The black 3 s intro, one sound per role and no input keep. The role names and goals change to alien and human. The human's "Your team: names" line: open (as the Role tab). | §1, §2, §6 (#1031); GDD §3 (#213) |
| s07 Round HUD | change | Keep the timer, health, stamina, mic, the hand and belt slots, crosshair, aim name, name plates and `raising`. The role chip reads alien or human. The carried items change (below). New: points (top left), the anger meter (top right), the kill notice, the cops' minute. **A change to a recorded decision, for the engineer:** `docs/ui-decisions.md` says the round HUD shows "only the time at the top"; points and anger add two plates there. The "mate" state (a teammate mark) is open. | §2, §4, §5 (#1031, #1040); GDD §8 (#1144) |
| s07 carried items | change | The slots show what the MVP carries: battery, flower, printed car part, bun, patty, burger, the watering can, the garage's cabled tools, the extinguisher, the fireworks (one-off mischief), the picked-up rubbish (fixing the bins); no package. Which take two hands is the game's data. | GDD §8 (#1144); §5 (#1033 c6289051351) |
| s08 Map and tasks | change / new | The board, the list, the «?» and the zone highlight keep (zones are general: Switches has them too). Only Delivery's zones drop; the MVP tasks' zones fit in. The tasks become the MVP's five (car tuning, the ship's engine, cooking, photo, Wi-Fi); the rooms become the House's (laboratory, greenhouse, pantry, garage and the rest). The «?» how-to cards need **new wordless card art** per MVP task (as s03). Whether the map shows the capsules or the mutation workbench is open; the map never marks a mischief while the hint rule is open. | GDD §8 (#1144); §5, §6b (#1089) |
| s09 Downed, dead, respawn | keep / change / drop | Keep `down`, `down-holding`, `raise` and their rule "never show who knocked the player down" (the knockdown is decided; the kill notice is a separate event at death). Change: bleeding out or giving up now leads to the dead's room. Drop the `dead` state (spectating the living). New: the dead's room overlay with the 30 s countdown. Keep `back`: the 3 s protection chip after a respawn at a random capsule. | GDD §3 (#728); GDD §8 (the engine: "raised by someone"); §3 (#1032 c6289051758) |
| s10 Post game | change | The black outro, one sound and the return to the lobby keep; the reason line keeps (`end.reason.all_tasks` with the time, `end.reason.time_up`). Two ends become three: the aliens win (tasks done before the timer and the cops), the humans win by the timer, the cops arrive ("busted: the party is over", with a siren): a new cops reason line. Whether the end reveals the roles or shows points: open (today it names only the winner). | §6 (#1031); GDD §3 |

## The MVP elements

| Element | Verdict | What exactly | Source |
|---|---|---|---|
| Role: alien or human | change | Role chip, pre-game intro and Role tab name the side and its goal. | §1, §2 (#1031) |
| Points | new | A HUD counter of the player's points; a short "+N" when work or mischief pays. How many points each action gives is to be validated. | §4 (#1040) |
| The neighbours' anger meter | new | A HUD bar that rises with ongoing mischief (bins knocked over, loud music) and jumps with a one-off (the fireworks); fixing stops the rise, the gained anger stays. | §5 (#1031; #1033 c6289051351) |
| The cops' minute | new | When the meter fills: "they arrive in a minute", a countdown the whole party sees. Stalling the cops is not in the MVP. | §5.3 (#1031; #1040 c6289148858) |
| Kill notice | new | A killed alien tells everyone who killed him. Its form and scope are open (below). | §4 (#1040) |
| The dead's room | new | The dead wait together in a separate room, 30 s, then respawn. Replaces spectating. | §3 (#1032 c6289051758) |
| Respawn | keep | A random capsule, 3 s of invulnerability: s9 `back`'s protection chip as drawn. Choosing the capsule is a later perk. | §3 (#1032) |
| Mutation workbench | new | In the laboratory: three positive mutations (run faster, jump higher, more HP), each for points. No negative mutations yet. | §4 (#1040 c6289148858) |
| Host settings | change | The number of humans; the anger threshold; the Wi-Fi's N passwords; the match timer stays. | §2 (#1032); §5 (#1031); GDD §8 |
| Round ends | change | Three ends, each with its reason line. | §6 (#1031) |
| Lobby as the spaceship | change | The lobby's world; the panel itself keeps. | §1 (#1031) |
| Being outed; task sabotage; mischief stations | none | No UI beyond the anger meter and the usual aim name. | §2, §4, §5 |

## MVP task interactions (GDD §8, #1144)

Where each task's own interaction lives. "World" means drawn in the 3D level, not by this track; "undecided" is a
question for the engineer: a UI overlay or a screen in the world.

| Interaction | Where | Question for the engineer |
|---|---|---|
| Wi-Fi computer: a 4-glyph password, a 0-9 keypad, the ~5 s "HACKER" lock | undecided | A 2D overlay when the player uses the computer, or its screen in the world? |
| Wi-Fi decoder book (static, in the library) | world | — |
| The house phone: two receivers held bridge two voices | undecided | Does s07's mic count as heard while on the line, and does the HUD show "on the line"? |
| Photo: the photographer sees the pose silhouette (#1102) | undecided | A viewfinder overlay or a picture in the world? Details are open on #1102. |
| Food printer: bun or patty, and its kind | undecided | A choice overlay, or buttons on the machine? |
| Parts printer: which car part | undecided | As the food printer. |
| Engine overheat: hold the vent, a needle rises, let go in the green band | undecided | A gauge on the machine, or a HUD gauge while holding? |
| Engine panel (four coloured switches and lamps), problem lamps and wails | world | Whether the HUD shows the problems' timers. |
| Car order board, burger order board, paint mixer, microwave charger, the grill | world | — |

## Open, the engineer's design (a screen depends on each)

1. **The kill notice** (s07): a HUD banner or the dead alien speaking in the world; for killed aliens only (then a
   killed human's silence outs him) or for every kill (beyond §4).
2. **Do humans know each other?** (s6's team line, s5 Role tab, s7's teammate mark): §2 does not say.
3. **What the anger meter hints** (s7): nothing, or the type of problem without its place (§5, §9).
4. **The HUD's top** (s7): points and anger at the top change the recorded "only the time at the top".
5. **The numbers** (s5, s7): the humans' defaults per player count, the anger threshold's choices, the rise and the
   jump, the cops' minute (§2, §5, §9; #1089); what each preset sets.
6. **Points per action** (s7's "+N"): "what earns points and how many is to be validated" (§4, §9).
7. **Mutations** (workbench, s7): the cost of each, whether one can be bought twice, whether a mutation lasts the match
   or ends at death, whether the HUD shows the ones you have (§4; M8.3, #1040).
8. **The dead's room** (s9): where it is; whether the dead can talk to each other there (GDD §11 says the dead hear
   and speak to nobody, written for spectating); whether the dead see the timer, the anger and the kills.
9. **The cops' minute and the round timer** (s7): both shown, or the earlier one only; a finale beyond the minute
   (§6, §9).
10. **The end** (s10): reveal who was human; show the points (GDD §3: "names only the winning side").
11. **The lobby as the spaceship** (s4, s3): how the trip maps onto Lobby, Countdown, Loading and Pregame (§1).
12. **Weapons and knives** (s5's Knives and the No knives preset; whether a knife still goes on s7's belt): §7 is
    deferred; which melee the MVP keeps.
13. **The task interactions** above: overlay or world, each.
14. **The title** (s2's logo): §1, before any public store page.
15. **The tutorial's lessons** for the MVP (s1): GDD §15.
16. **The map** (s8): whether it shows the capsules and the mutation workbench.

## What the UI track does next (no game design)
- After the engineer's answers: restyle and rewrite s04 to s10 in the sticker tokens with the new elements, as new
  screen sources; the copy deck gets the new keys once the engineer approves the texts.
- Wordless how-to card art for the five MVP tasks (s03, s05 Guide, s08), by the art quality bar.
- The new HUD pieces are built from existing components (plate, chip, bar track, panel, button); no new colour or font.
