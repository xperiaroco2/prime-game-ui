# Lens B: self-explaining tasks and balance

Research for the prime-game brainstorm on separating learning from playing (2026-10-02). Question for this lens:
how do we design tasks and their objects so they teach themselves, keep them neither trivial nor exhausting in a
party game, offer optional help without loading the UI, and stay true to the "no markers" decision?

Marking: "(unconfirmed)" means the claim rests on a search snippet, a fan wiki, a forum or memory, not on a page I
opened. Everything else was read on the linked page.

## TL;DR

1. **The task list says WHAT, the world says HOW.** The hold-Tab list stays a list of goals with counters; every
   "how" lives in the objects: their shape, their 3D label, a lamp on the station, a sound when it works.
2. **One symbol, four hops.** Item label → map → door sign → exact spot all repeat the same pictogram and colour.
   That is the whole navigation system, and it works in English and Ukrainian without reading sentences.
3. **A verb budget.** Every task is built only from the verbs the tutorial room teaches. A new task may add at most
   one new verb, and the object itself must show it.
4. **Effort comes from macro, never from micro.** Distance, search, carrying limits, sequencing, teamwork and the
   dissidents make a task effortful; precision, reflexes and reading never do.
5. **Help in two kinds.** Help that changes the rules (more time, fewer packages) is a host setting for the whole
   match. Help that only explains is per player, fades by itself, and is visible to others (a funny "learner" badge).
6. **The comic card is also a test.** A task that cannot be drawn in four wordless panels is too complex.
   §8 is a 12-question "readable without the UI?" checklist for every new task.

## 1. What the evidence says about teaching

- **Tutorials pay off only when a game is complex.** A study of over 45,000 players with eight tutorial designs in
  three games found tutorials increased play time by up to 29% in the most complex game and had no significant
  effect in the two simpler ones; the authors suggest tutorials may not be worth it for mechanics players can
  discover by experimenting ([Andersen et al., CHI 2012](https://grail.cs.washington.edu/projects/game-abtesting/chi2012/chi2012.pdf),
  [abstract](https://www.semanticscholar.org/paper/The-impact-of-tutorials-on-games-of-varying-Andersen-O'Rourke/d4a00da8cab8c5b2777385a698b02edc69736bea))
  (unconfirmed: read from the abstract's search snippet). For us: the more a task can be discovered by trying, the
  less it needs a card or a video. The engineer's instinct ("make tasks so easy to read that no explanation is
  needed") is the cheaper path, and how-to material should be the exception for multi-step tasks.
- **LOCKDOWN Protocol pairs signage with a reference tablet.** Its studio page says players find their way through
  "architecture signage" or the tablet, which holds a map and "explanations on procedures for every task"
  ([Mirage Creative Lab](https://miragecreativelab.com/lockdown-protocol/)). A community guide lists eight tasks;
  only Delivery is simple ("collect packages from Storage, deliver to the rooms"), while Pizzushi, Analysis, Pressure
  and Alimentation are chains across several machines and rooms ([Steam task guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3305518998)).
  A reviewer says the first few matches are spent working out what to do, and a beginner guide advises new players
  to start with Computers, Delivery, Vents and Scanner ([Backloggd review](https://backloggd.com/u/spyrospy/review/4020631/),
  [9Puz guide](https://9puz.com/2542-lockdown-protocol-guide/)) (unconfirmed: snippets). Lesson: their videos exist
  because some tasks are hidden recipes. If our tasks have no hidden recipes, we need far less teaching.
- **Among Us shows the opposite choice.** Its multi-stage tasks show a yellow arrow to the next stage, and a task
  gets a yellow outline when you are close ([Among Us wiki, Tasks](https://among-us.fandom.com/wiki/Tasks))
  (unconfirmed: fan wiki). That is the "UI tells you what to do" layer we decided against; in our game finding the
  way is part of the effort, so the information stays in the world.

## 2. The task list says WHAT, the world says HOW

**Untitled Goose Game** is the closest model for our hold-Tab list: a to-do list of goals, a small space, and the
player works out the how by playing with the objects ([Wikipedia](https://en.wikipedia.org/wiki/Untitled_Goose_Game),
[Game Developer Q&A](https://www.gamedeveloper.com/design/behind-the-honk-an-i-untitled-goose-game-i-q-a))
(unconfirmed: snippets). Our list already has only names and counters; the rest of this section is how the world
carries the how.

**Affordances and signifiers.** Don Norman separates what an object lets you do (affordance) from the perceivable
cue that tells you where and how (signifier) ([Norman 2008, "Signifiers, not affordances"](https://www.alice.id.tue.nl/references/norman-2008.pdf),
[Wikipedia: Affordance](https://en.wikipedia.org/wiki/Affordance)) (unconfirmed: snippets). For us: the affordances
come from the tutorial (pick up, put down, hand and belt, use); each task's job is to add signifiers in 3D.

**A fixed visual grammar for every task** (proposal):
- **Same symbol everywhere.** Each room has one pictogram and one colour. The package label shows it with the room
  name, the map shows it on the room, the door sign shows it, and the delivery spot shows it. A player who never
  reads a word can match picture to picture. This is LOCKDOWN's "architecture signage", applied to items too.
- **Shape matching.** An item fits only a socket of its own silhouette (a box shelf, a fuse slot, a canister
  cradle). The world, not the UI, says "this goes here".
- **State on the object.** A station shows its own progress: lamps, a fill gauge, a screen with big digits. Dead
  Space put the health bar on the hero's back for this reason ([Game Developer, Dead Space UI](https://www.gamedeveloper.com/design/video-designing-i-dead-space-i-s-immersive-user-interface))
  (unconfirmed: snippet). For a "switches" task, a board in the generator room shows one lamp per switch: the
  global count is in the world, and a switch a dissident turned off is visible from across the room.
- **One "task paint" colour.** Every socket, slot and station that belongs to a task carries the same diegetic
  hazard-stripe or colour, the same for every player. The "yellow paint" debate is relevant here: one critic argues
  the paint itself is fine and the real problem is levels with a single interaction point; Mirror's Edge's red
  objects worked because they were diegetic and there were several routes, with the red one often not the fastest
  ([critpoints](https://critpoints.net/2024/03/03/yellow-paint-is-fine-actually/), [Wikipedia: Yellow paint debate](https://en.wikipedia.org/wiki/Yellow_paint_debate)
  (unconfirmed)). Our task paint marks *places where task things happen* (open knowledge, like the task circles),
  never *where you should go now*, so it does not break the no-markers decision. The designer and engineer should
  confirm this reading.

**A verb budget.** Every task uses only the tutorial's verbs: walk, sprint, jump, pick up, put down, hand and belt,
give, use. A task may add one new verb (for example "hold use to crank"), and the object must show it (a crank
handle that visibly turns a little when you look at it). Two new verbs in one task means two tasks, or a
redesign.

## 3. Teaching inside the task: kishotenketsu and the nudge that disappears

**Kishotenketsu.** Koichi Hayashida (Super Mario 3D Land) describes four beats: first you learn the mechanic, then
a slightly harder scenario, then a twist that makes you think of it differently, then you show mastery
([Game Developer](https://www.gamedeveloper.com/design/the-secret-to-i-mario-i-level-design)). The structure comes
from four-panel comics, which ties neatly to the engineer's comic idea. In a match, without levels, we can still
order the beats:
1. *Introduction:* the first item of each task in a match spawns in its easiest zone, in plain sight (a content
   rule, seeded like the rest).
2. *Development:* the later items spawn in harder zones (far, high, behind something).
3. *Twist:* the dissidents: a package hidden, a switch turned off, an item carried away.
4. *Mastery:* the last item under time pressure, with the team coordinating by voice.

**Teach by a situation, not by a sentence.** Half-Life 2 teaches pick up and throw with a guard who orders you to
pick up a can and bin it ([The Escapist](https://www.escapistmagazine.com/half-life-2-pick-up-the-can/))
(unconfirmed: snippet). World 1-1 starts with the Goomba because the designers judged a Koopa too hard as the first
enemy ([Wikipedia: World 1-1](https://en.wikipedia.org/wiki/World_1-1)) (unconfirmed: snippet). That is the right
model for the tutorial room: a short situation per verb, never a list of tasks.

**The first-time-only nudge** (proposal, local to each player, no HUD):
- While a player has not yet finished a task type twice (a local profile counter), its items and sockets do a
  small idle "wiggle" or glint when the player looks at them, and the socket answers with a soft chime when the
  matching item comes near. After the second completion, it is gone for good. A ten-match veteran sees nothing.
- **Failure-triggered help.** Nintendo's Super Guide appears only after eight deaths in a row in a level and lets
  the computer show the way ([Wikipedia: New Super Mario Bros. Wii](https://en.wikipedia.org/wiki/New_Super_Mario_Bros._Wii))
  (unconfirmed: snippet). Our version: after two wrong tries on the same socket, the socket's own pictogram lights
  up for that player only. Help comes only to someone who is visibly stuck.
- Both are effects on world objects rendered by the client, so they fit "spatialization and presentation happen on
  the listener" and need no hidden information: the rules and places are open knowledge.

## 4. Not too easy, not too hard

**Flow.** Jenova Chen's thesis builds on Csikszentmihalyi: flow needs challenge matched to skill, otherwise
anxiety (too hard) or boredom (too easy), and he lets players adjust difficulty through their own choices
([thesis](https://www.jenovachen.com/flowingames/Flow_in_games_final.pdf), [Engadget](https://www.engadget.com/2006-09-12-flow-in-games-an-interactive-thesis-on-dynamic-difficulty.html))
(unconfirmed: snippets). In a mixed group of 4 to 10, the safe way is to let players choose their own challenge:
several tasks open at once, a newcomer takes the nearby package, a veteran goes for the hidden one.

**Where effort should come from** (the "every task asks some effort" goal, under "macro over micro"):

| Good effort (macro) | Bad effort (micro or opaque) |
|---|---|
| Distance and route choice on the map | Precision aiming, timing minigames |
| Search inside known zones (items are moved, places are fixed) | Hidden recipes you must memorize |
| Carrying limits: hand and belt, two-hand heavy items | Reading instructions mid-round |
| Sequencing: a short chain of 2 to 3 hops | Chains of 4+ steps across the whole map |
| Teamwork: two-person stations, handing items over | Pixel hunting for a tiny socket |
| Interference by the dissidents | Silent failure you cannot diagnose |

Overcooked's developers built each level around one element and wanted every level to introduce something new
([Game Developer deep dive](https://www.gamedeveloper.com/design/game-design-deep-dive-building-truly-cooperative-play-in-i-overcooked-i-))
(unconfirmed: snippet). Our analogue: each task type gets one core idea of effort (Delivery: route and search; a
switch task: watching several places at once; a two-person station: coordination).

**Short loops** (starting values to tune after a playtest): an unhindered player sees first progress within about
20 to 30 seconds of starting a task; one hop (pick up, carry, place) takes under a minute; a multi-step task has at
most three hops. Each hop's success is its own small reward.

**Clear success.** "Juice" (abundant feedback: sound, light, motion) turns a flat action into a satisfying one
([Juice it or lose it, Jonasson and Purho 2012](https://roblog.co.uk/2024/03/juicy-games/)) (unconfirmed: snippet).
A placed package lands with a heavy thunk, the socket lamp turns green, a cringe-fun fanfare plays that nearby
players hear through proximity, and the counter ticks. Hearing a teammate's "done" sound is free teaching for the
newcomers around them.

**Readable failure.** The world says "no" in the same language it says "yes": a wrong item bounces out of the
socket with a buzzer and a red lamp. A wrong try costs time, never progress. Nothing fails silently.

## 5. Optional assistance: four examples and what they teach

| Game | What the help does | Lesson for us |
|---|---|---|
| **Celeste** | Assist Mode: game speed down to 50%, infinite stamina, more dashes, invincibility, chapter skip ([Game Developer](https://www.gamedeveloper.com/design/check-out-i-celeste-s-i-remarkably-granular-assist-options), [Celeste wiki](https://celeste.ink/wiki/Assist_Mode)) (unconfirmed). Its intro text changed from difficulty being "essential" to the game being "intended" as a challenge after an accessibility advocate said the wording felt othering ([Vice](https://www.vice.com/en/article/celeste-assist-mode-change-and-accessibility/)) | Granular switches; no shaming words |
| **Moving Out 2** (a physical delivery party game) | Six assists: longer time limits, objects vanish on delivery, reduced obstacles, skip level on fail, lighter two-person items, placement snap. Enabled at the start of every level, with no negative consequences ([Can I Play That](https://caniplaythat.com/2023/06/05/moving-out-2-accessibility-and-assist-modes-detailed/)) | Rule-changing help is set per session for the whole group, with no penalty |
| **Super Mario Odyssey** | Assist Mode: arrows on the ground to the objective, double health that refills, a bubble that returns you after a fall ([Super Mario Wiki](https://www.mariowiki.com/Super_Mario_Odyssey)) (unconfirmed: fan wiki) | Explaining help is a separate switch from rule help; arrows are exactly what we avoid |
| **Mario Kart 8 Deluxe** | Smart Steering and Auto-Accelerate, set per player on the kart screen; with Smart Steering on, an antenna on the kart lights up near the edge ([win.gg](https://win.gg/news/should-you-use-smart-steering-in-mario-kart-8-deluxe/)) (unconfirmed: snippet) | Per-player help in a multiplayer match, made visible to everyone |

**What this means for prime-game:**
- **Rule help is a host setting** (Moving Out): "longer timer", "fewer items per task", maybe "items glow when
  dropped". It changes the balance between Engineers and Dissidents, so it belongs to the lobby settings, locked at
  the countdown like the others, and shown to all.
- **Explaining help is per player** (Odyssey's split, Mario Kart's per-player choice): the first-time nudges and
  the failure-triggered pictogram from §3. They reveal nothing hidden (rules and places are open knowledge), so they
  can be local. Default on for a new profile, fading by the profile's own counters; a player can turn them off.
- **The host can switch explaining help off** for a group of veterans: this is the "with hints / without" session
  setting, and it should mean "explaining help allowed or not", not a separate rule set.
- **Make it visible and funny**, like the Mario Kart antenna: a player with hints on wears a "learner" L-plate or a
  "new hire" sticker on their back. It fits the cringe-fun vibe, tells veterans who to help, and turns being new into
  a joke rather than a shame. Wording follows the Celeste lesson: "new here? the world will help you", never "easy".

## 6. Fit with the no-markers decision and the zone highlight

The current decisions already form a good chain; the proposals above only make each hop read the same:

1. **The item** carries its destination as a 3D label: pictogram, room colour, room name (EN or UK).
2. **The map** (hold Tab) shows "you are here" and the same pictogram on every room, permanently. That is a legend
   of fixed places (open knowledge), not an instruction. Hovering a task lights up the zones where its items may be.
3. **The door** of each room has a large sign with the same pictogram and colour.
4. **The spot** inside the room is a socket with the same pictogram and the task paint.

No hop tells the player what to do; each hop only answers "is this the place that matches what I hold?".

**Multi-step tasks become chains of labelled deliveries.** Each intermediate item carries the label of its next
stop: a dead fuse says "Workshop"; after the charger it becomes a charged fuse that says "Generator". The chain
lives in the objects, so the task list needs no description, and anyone who picks up (or is handed) an item
mid-chain knows its next step.

**Sabotage.** A hidden package's label stays readable when found; a label-scrambling sabotage, if wanted, should
visibly glitch so the player knows it was sabotaged.

## 7. Where the comic cards fit

Self-explaining tasks make the cards smaller and rarer, not useless. Proposal:
- A card exists only for a task with more than one hop or one new verb. Delivery may need no card at all.
- A card has at most **four panels** (the four-panel comic that kishotenketsu comes from), drawn with the **same
  pictograms** the world uses: panel 1 the item with its label, panel 2 the map icon, panel 3 the door sign, panel 4
  the socket with a green lamp. The card then teaches the visual grammar, not just the task.
- **If a task cannot be drawn in four wordless panels, simplify the task**, do not add a fifth panel.

## 8. Checklist: "readable without the UI?" (run it on every new task)

1. **Verbs.** Does it use only the tutorial's verbs, plus at most one new verb that the object itself shows?
2. **Goal.** Can the task list entry be a name and a counter only ("Delivery 3/8")?
3. **Item says where.** Does every item carry its next destination as a 3D pictogram, colour and room name, readable
   from about three metres?
4. **Spot says what.** Does the destination show the same pictogram, carry the task paint, and accept only the
   matching item (shape or slot)?
5. **State in the world.** Can a player see the task's progress on the station itself, from the doorway?
6. **Loud success.** Does success give sound, light and motion at once, audible to nearby players?
7. **Readable failure.** Is a wrong try rejected visibly and audibly, costing time but never progress?
8. **No hidden recipe.** Is everything needed visible in the world or part of the open knowledge (map, fixed
   places)?
9. **Short.** At most three hops; first progress within about 20 to 30 seconds for an unhindered player?
10. **Macro effort.** Does the effort come from route, search, carrying, sequencing, teamwork or dissidents, and
    none from precision, reflexes or reading?
11. **Four panels.** Can it be drawn as a wordless four-panel card with the world's pictograms?
12. **Silent playtest.** Does a player who never saw the task finish its first hop within 60 seconds without anyone
    explaining, in at least three of four tries? And does a ten-match veteran see nothing extra on screen?

## 9. Recommendations

1. Adopt the rule "task list = what, world = how" and the one-symbol chain (label, map, door, spot) as a level
   convention for every task and room.
2. Add a verb budget to the designer's `new-mechanic` interview: tutorial verbs plus at most one new, self-shown verb.
3. Build multi-step tasks as chains of labelled deliveries, where each item names its next stop.
4. Give every station diegetic state (lamps, gauges) and every action loud success and readable failure.
5. Split assistance: rule help as host lobby settings; explaining help per player, fading by the profile's counters,
   allowed or forbidden by the host's "with hints / without" setting, and visible as a funny learner badge.
6. Keep the comic cards to multi-step tasks, four panels, the world's pictograms; treat "needs a fifth panel" as a
   design bug.
7. Make the checklist above part of the definition of a task, and run the silent playtest before a task ships.

## 10. Open questions for the humans

- Is a diegetic "task paint" on sockets and stations acceptable under the no-markers decision, given it marks fixed
  places for everyone, not a destination for one player?
- Does the map show every room's pictogram all the time, or only while hovering a task?
- Is the "learner" badge fun or embarrassing for this audience? Should it be opt-in?
- How many completions before a task type's nudges stop for a player: one, two, three?
- Should rule help (longer timer, fewer items) exist at all, or does the host's existing timer setting cover it?
- Which language does a 3D label use when players in one match have different UI languages: each client's own
  (labels are rendered locally), or pictogram only?
