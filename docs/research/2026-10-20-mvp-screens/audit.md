# The ten screens against the MVP match (audit, 2026-10-20)

The styled screens (`pages/screens/src/s01`..`s10`, `docs/handoff/`) were drawn for the M7 game: Engineers and
Dissidents, Delivery and Switches, the knockdown, spectating the living, "The Engineers won". The MVP match was frozen
on 2026-10-20 in prime-game `docs/design/m8-match.md` (cited below as §N with its source issue) and the GDD's MVP task
set (GDD §8, #1144). This audit says, for each screen and each MVP element, what to keep, change, add or drop. It
decides no game design: whatever the MVP leaves open is marked **open, the engineer's design**. The sketches of the new
and changed pieces are on `pages/mvp-screens/`. Every player-facing text there is a draft for the engineer.

Verdicts: **keep** (as drawn), **change** (same place, new content), **new**, **drop**.

## The screens

| Screen | Verdict | What exactly | Source |
|---|---|---|---|
| s01 Tutorial | change | The invite, the lesson plate, the keycaps and the lesson list keep their look. The lessons "Deliver" and "Death" (spectate) describe M7: Delivery left the MVP; the dead now wait in the dead's room. The lesson list itself is open, the engineer's design. | GDD §8 (#1144); §3 (#1032 c6289051758); GDD §15 (DD10) |
| s02 Main menu | keep | Host, Join, Join by address, Tutorial, Settings, Quit as drawn. Only the logo's words wait for the title. | §1 (#1031: title open) |
| s03 Connecting and loading | keep / change | Join steps and every failure keep. Loading: the tip `tip.two_hands` and its how-to card are about packages (change). Whether loading shows the flight to Earth is open. | GDD §8 (#1144); §1 (#1031) |
| s04 Lobby | keep / change | The player list, Ready, the code and the countdown keep (GDD §3). The world behind it becomes the aliens' spaceship; how the trip maps onto Lobby, Countdown, Loading and Pregame is open. | §1 (#1031) |
| s05 Esc menu, Lobby tab | change | "Dissidents" becomes the number of humans (the host sets it exactly, e.g. 3 of 10). New row: the neighbours' anger threshold (e.g. 50 or 100). "Packages" drops (Delivery is out). "Knives" and the "No knives" preset: open (weapons are deferred). "Tasks" and step counts: the MVP's five types; which settings stay is open. | §2 (#1032); §5 (#1031); GDD §8 (#1144); §7 (#1040) |
| s05 Esc menu, Role tab | change | Role names and goals: alien and human, the goals of §6. The teammates list depends on whether humans know each other: open. | §1, §6 (#1031) |
| s05 Esc menu, Guide tab | change | The topics "Downed" and "Tasks" describe M7; new topics (points, mutations, anger, cops, the dead's room) are the engineer's texts. | §3 to §6 |
| s05 Esc menu, other tabs | keep | Game (Resume, Leave, Quit), Character (name, body colour), Settings (sound, controls, display, language, accessibility). | — |
| s06 Pre game | change | The black 3 s intro, one sound per role and no input keep. The role names and goals change to alien and human. The human's "Your team: names" line: open (as the Role tab). | §1, §2, §6 (#1031); GDD §3 (#213) |
| s07 Round HUD | change | Keep the timer, health, stamina, mic, slots, crosshair, aim name and name plates. The role chip reads alien or human. The items in the slots change with the MVP tasks (battery, flower, printed part, tools; no package). New: points, the anger meter, the kill notice, the cops' minute (below). The HUD rule "never show who knocked the player down" conflicts with the kill notice and changes. The "mate" state (a teammate mark) is open. | §2, §4, §5 (#1031, #1040); GDD §8 (#1144) |
| s08 Map and tasks | change | The board, the list, the «?» how-to cards keep their look. The tasks become the MVP's five (car tuning, the ship's engine, cooking, photo, Wi-Fi); the rooms become the House's (laboratory, greenhouse, pantry, garage and the rest). Delivery's zones drop. Whether the map shows the capsules or the mutation workbench is open; the map never marks a mischief while the hint rule is open. | GDD §8 (#1144); §5, §6b (#1089) |
| s09 Downed, dead, respawn | change / drop / keep | Drop the `dead` state (spectating the living): the dead go to the dead's room. New: the dead's room overlay with the 30 s countdown and who killed you. Keep `back`: the 3 s protection chip after a respawn at a random capsule. The downed states (`down`, `down-holding`, `raise`) and s7's `raising`: open; m8-match.md is silent, but GDD §3 (#728) and the ship's engine (GDD §8, 2026-10-20: "raised by someone") still use the knockdown. | §3 (#1032 c6289051758); GDD §3, §8 |
| s10 Post game | change | The black outro, one sound and the return to the lobby keep. Two ends become three: the aliens win (tasks done before the timer and the cops), the humans win by the timer, the cops arrive ("busted: the party is over", with a siren). Whether the end reveals the roles or shows points: open (today it names only the winner). | §6 (#1031); GDD §3 |

## The MVP elements

| Element | Verdict | What exactly | Source |
|---|---|---|---|
| Role: alien or human | change | Role chip, pre-game intro and Role tab name the side and its goal. | §1, §2 (#1031) |
| Points | new | A HUD counter of the player's points; a short "+N" when work or mischief pays. How many points each action gives is to be validated. | §4 (#1040) |
| The neighbours' anger meter | new | A HUD bar that rises with ongoing mischief (bins knocked over, loud music) and jumps with a one-off (the fireworks); fixing stops the rise, the gained anger stays. | §5 (#1031; #1033 c6289051351) |
| The cops' minute | new | When the meter fills: "they arrive in a minute", a countdown the whole party sees. Stalling the cops is not in the MVP. | §5.3 (#1031; #1040 c6289148858) |
| Kill notice | new | "X killed Y" to everyone: a killed alien names his killer. | §4 (#1040) |
| The dead's room | new | The dead wait together in a separate room, 30 s, then respawn. Replaces spectating. | §3 (#1032 c6289051758) |
| Respawn | keep | A random capsule, 3 s of invulnerability: s9 `back`'s protection chip as drawn. Choosing the capsule is a later perk. | §3 (#1032) |
| Mutation workbench | new | In the laboratory: three positive mutations (run faster, jump higher, more HP), each for points. No negative mutations yet. | §4 (#1040 c6289148858) |
| Host settings | change | The number of humans; the anger threshold; the match timer stays. | §2 (#1032); §5 (#1031) |
| Round ends | change | Three ends: aliens win; humans win by the timer; busted. | §6 (#1031) |
| Lobby as the spaceship | change | The lobby's world; the panel itself keeps. | §1 (#1031) |
| Being outed | none | No UI: an outed human just plays openly. | §2 (#1031) |
| Mischief stations, fixing | none | World objects with the usual aim name; no extra HUD beyond the anger meter. | §5 (#1031) |
| Task sabotage | none | Earns nothing and the neighbours do not care: no UI. | §4, §5 (#1040) |

## Open, the engineer's design (a screen depends on each)

1. **The knockdown in the MVP** (s9 downed states, s7 `raising`): m8-match.md is silent; GDD §3 (#728) and the ship's
   engine (GDD §8) still use it. Keep or drop?
2. **Do humans know each other?** (s6's team line, s5 Role tab, s7's teammate mark): §2 does not say.
3. **What the anger meter hints** (s7): nothing, or the type of problem without its place (§5, §9).
4. **The numbers** (s5, s7): the humans' defaults per player count, the anger threshold's choices, the rise and the
   jump, the cops' minute (§2, §5, §9; #1089).
5. **Points per action** (s7's "+N"): "what earns points and how many is to be validated" (§4, §9).
6. **Mutations** (workbench, s7): the cost of each, whether one can be bought twice, whether a mutation lasts the match
   or ends at death, whether the HUD shows the ones you have (§4; M8.3, #1040).
7. **The dead's room** (s9): where it is; whether the dead can talk to each other there (GDD §11 says the dead hear
   and speak to nobody, written for spectating); whether the dead see the timer, the anger and the kills.
8. **The cops' minute and the round timer** (s7): both shown, or the earlier one only; a finale beyond the minute
   (§6, §9).
9. **The end** (s10): reveal who was human; show the points; a reason line per end (GDD §3: "names only the winning
   side").
10. **The lobby as the spaceship** (s4, s3): how the trip maps onto Lobby, Countdown, Loading and Pregame (§1).
11. **Weapons and knives** (s5's Knives and the No knives preset, s7's belt): §7 is deferred; which melee the MVP
    keeps.
12. **The title** (s2's logo): §1, before any public store page.
13. **The tutorial's lessons** for the MVP (s1): GDD §15.
14. **The map** (s8): whether it shows the capsules and the mutation workbench.

## What the UI track does next (no game design)
- After the engineer's answers: restyle and rewrite s04 to s10 in the sticker tokens with the new elements, as new
  screen sources; the copy deck gets the new keys once the engineer approves the texts.
- The new HUD pieces are built from existing components (plate, chip, bar track, panel, button); no new colour or font.
