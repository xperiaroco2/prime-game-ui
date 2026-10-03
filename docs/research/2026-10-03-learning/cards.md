# Lens C: comic how-to cards

Research and a concrete proposal for the engineer's idea: one short, drawn, step-by-step "how to" card per task
type. Written 2026-10-02 for the prime-game UX/UI brainstorm. Claims marked "(unconfirmed)" rest on a search
snippet, a fan wiki or memory; everything else was read on the linked page.

## TL;DR

- **Yes to cards, no to videos.** Short learner-paced segments beat one continuous video for procedures, and a
  strip of panels can be scanned in seconds, or read from panel 3 only. A one-minute video is linear.
- **Pictures plus one to three words per panel, never pictures alone.** Even professional airline safety
  pictograms are misread about a third of the time.
- **A card is a strip, not a slideshow:** 3 to 5 panels visible at once, one verb each, the same little drawn
  figure in every panel. If a task needs more than five panels, the task is too complex: that is the "five-panel
  test" for the designer, and it answers the engineer's other thought (make tasks readable without help).
- **The card teaches the method, never this round's answer.** "Read the label, find the place on the map", never
  "take it to Storage B". That keeps the decision that the UI never tells the player what to do.
- **Shown automatically once per task type per player (on the loading screen), then only on demand** from a small
  "?" on the task row and from a "How to play" board in the lobby. A player who has seen every card sees nothing.
- **The card is data the designer writes** (steps of verb + object + count); the engine composes the panel from
  a fixed pictogram set, so a new task type gets a card the same day and translation is a dozen verbs and the
  object names that already exist. Hand-drawn funny panels can replace composed ones later, one at a time.

## What the research says, and what it means for us

1. **Wordless step-by-step instructions (IKEA).** IKEA's manuals rest on clarity and continuity, are drawn from
   test assemblies, and use a simple human figure that shows rather than tells; wordlessness is a scaling choice
   that avoids translation and reading-level problems ([Fast Company](https://www.fastcompany.com/3052604/how-ikea-designs-its-infamous-instruction-manuals),
   [Sketchboat](https://www.sketchboat.com/blog/the-ikea-manual-the-ux-of-building-furniture-and-why-it-works),
   both via search snippet, unconfirmed). [Cadasio](https://www.cadasio.com/post/designing-assembly-instructions-without-words)
   confirms the language-barrier argument but gives no concrete rules. From memory, IKEA also draws "wrong way"
   panels with a cross (unconfirmed). **For us:** one recurring figure, one action per panel, and a "don't" panel
   style for the dissident threat.
2. **Pictograms alone fail often.** The FAA's study of airline safety-card pictorials (Corbett, McLean, Cosper,
   2008; 785 participants) found comprehension from 28.8% to 96.3%, mean 65%; only 45.8% of the pictorials met the
   ISO 67% acceptance criterion and 8.3% the ANSI 85% one. It recommends designing for novices and suggests that
   text could help ([ROSAP abstract](https://rosap.ntl.bts.gov/view/dot/58470); a search snippet of the
   [FAA page](https://www.faa.gov/data_research/research/med_humanfacs/oamtechreports/2000s/2008/200820) said 29%
   met ISO, so one of the two figures is off). **For us:** every panel carries a caption of one to three words,
   and each card is tested on someone who has never played.
3. **Segments and learner pace beat continuous video.** Arguel and Jamet (2009) found that a procedure video
   segmented by static pictures taught better than continuous video or static pictures alone, with the number of
   pictures as a moderator ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0747563208002252),
   unconfirmed: abstract read via search snippet). Mayer's segmenting principle: people learn more deeply from
   learner-paced segments than from a continuous unit ([Cambridge Handbook chapter](https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-managing-essential-processing-in-multimedia-learning/A9E77D0172F905AC957689D1771E2888),
   unconfirmed, snippet). **For us:** static panels at the reader's pace now; a one-second loop per panel is an
   optional later polish, never a video.
4. **One verb is enough when the world shows the rest (WarioWare).** Each microgame opens with a one- or two-word
   command such as "Dodge!" and the screen supplies the context ([Super Mario Wiki](https://www.mariowiki.com/Microgame),
   fan wiki, unconfirmed). **For us:** the caption is a verb in capitals plus its object; the 3D world (the
   package's label, the circle on the floor) carries everything specific to this round.
5. **Explain right before the first time, offer practice (Mario Party).** Mario Party Superstars shows a
   how-it-works screen before each minigame, where players can practise before starting
   ([Twinfinite](https://twinfinite.net/guides/mario-party-superstars-minigames-how-practice/), snippet,
   unconfirmed). **For us:** the moment of need is the first match with that task type; the practice is the
   tutorial room for the basics.
6. **Teaching moments shrink as the audience matures (Fall Guys, Jackbox).** Fall Guys' round intros show the
   round name, type and a short description; many intros were cut from about 9 s to about 4 s in Season 4
   ([Fall Guys wiki](https://fallguysultimateknockout.fandom.com/wiki/Intro), fan wiki, unconfirmed). Jackbox added
   a skip for tutorials from Pack 6 because experienced players wanted to get into games faster; the VIP chooses
   ([Jackbox blog](https://www.jackboxgames.com/blog/responding-to-your-questions-from-the-jackbox-customer-survey)),
   and Pack 10 has a "Skip Tutorials" toggle in settings ([Jackbox blog](https://www.jackboxgames.com/blog/accessibility-features-in-the-jackbox-party-pack-10),
   snippet, unconfirmed). **For us:** remember "seen" per player, so nobody has to skip anything twice; a group
   setting is a blunt fallback, because one new friend in a group of veterans still needs the card.
7. **LOCKDOWN Protocol.** Tasks live in a tablet with glowing spots to travel to (snippet, unconfirmed) and
   per-task videos (the engineer's report). Players still made many task tutorials, e.g.
   [an every-task video](https://www.youtube.com/watch?v=vRvoqHCTO_A) and [Steam guides](https://steamcommunity.com/app/2780980/guides/),
   which hints that multi-step tasks stayed hard to learn in game (my inference, unconfirmed). **For us:** the
   five-panel test, and no long medium inside the round.
8. **Recipe cards before a level (Overcooked 2).** Players get each recipe's instructions before a stage starts
   ([iMore](https://www.imore.com/overcooked-2-everything-you-need-know), snippet, unconfirmed); from memory, recipes
   and order tickets are drawn as ingredient icons plus processing icons (unconfirmed). **For us:** the loading
   screen before the first match with a task type is the natural place for its card.
9. **A consistent pictogram set comes from a grid and rules (Otl Aicher, Munich 1972).** About 180 pictograms
   were built on one strict orthogonal and diagonal grid, which made them coherent and readable across languages
   ([Wikipedia](https://en.wikipedia.org/wiki/Otl_Aicher), [Smithsonian](https://www.smithsonianmag.com/innovation/this-graphic-artists-olympic-pictograms-changed-urban-design-forever-180978256/),
   snippets, unconfirmed). **For us:** one grid and one figure for every card, so the tenth task's card looks like
   the first one even when a different person makes it.
10. **Comics: closure in the gutter.** Readers fill the gap between panels; "action-to-action" transitions follow
    one subject through distinct steps (McCloud, *Understanding Comics*, via
    [EBSCO](https://www.ebsco.com/research-starters/literature-and-writing/understanding-comics-invisible-art-scott-mccloud),
    snippet, unconfirmed). **For us:** never draw "walk there"; same figure, same viewpoint, one change per panel.
11. **Accessibility** ([Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/)): own
    reading pace (basic); instructions not by text alone (intermediate); nothing essential by colour alone (basic);
    readable font size (basic); objective reminders during play (intermediate); replayable instructions (advanced).
12. **Godot 4.7 localization** ([docs](https://docs.godotengine.org/en/4.7/tutorials/i18n/internationalizing_games.html)):
    `tr()`, auto-translated Controls, CSV and PO import, per-locale image remaps, pseudolocalization. **For us:** no
    text inside drawings; captions are translation keys; pseudolocalization catches overflowing Ukrainian captions.

## The proposal

### The card's anatomy

- **Header:** the task's pictogram (the same one as its row on the Tab screen) and its name. Nothing else.
- **Strip of 3 to 5 panels, all visible at once,** left to right, numbered. At narrow widths the strip wraps into
  two rows. Each panel:
  - the drawing: the same little figure (gender-neutral, deadpan face, a nod to airline safety cards) doing one
    action with one object;
  - the caption: one verb in capitals plus its object, at most three words, in the player's language;
  - optional badges: "×N" or "×ALL" for repetition, a map glyph when the step uses the map.
- **The last panel is "done when"**, drawn as the task's counter going up (for example 3/8 → 4/8), so the player
  learns where progress shows.
- **An optional "watch out" panel** in a distinct frame (hatched border and a warning triangle, not only red)
  shows what dissidents do to this task. It belongs on the card because the rules are open knowledge.
- **Reading time target:** under five seconds for a first read, one second for a glance.

### Rules for writing a card (the designer's style guide)

1. One verb per panel, taken from a closed list: FIND, GO, TAKE, CHECK, CARRY, PUT, TURN ON, TURN OFF, HOLD, GIVE,
   WAIT, WATCH, REPEAT. A new verb needs a new figure pose, so adding one is a small art request, which keeps the
   list short.
2. Objects come from names that already exist in content (item kinds, stations, map), shown with their pictogram.
3. Teach the method, never this round's answer: no room names, no "the blue one".
4. No walking panels; the gutter does it.
5. The five-panel test: if a task does not fit in five panels, simplify or split it.
6. The hallway test: show the card to someone who has not played and ask "what do you do?". If they cannot say it,
   redraw or recaption that panel. Two of three fresh testers right is the bar, close to the ISO 67% criterion.

### Where it lives

1. **The loading screen, automatically, once.** Task types in a match are public (they come from the mode and its
   settings), so during Loading the client shows the card of each task type this player has not seen yet. Loading
   has no voice and the player is waiting anyway, so the card costs no playing time. It never blocks the match:
   when the round starts the card closes and its task row keeps a "NEW" dot until the card is opened once.
   The same mechanism can show a role card ("You are a dissident: …") the first time a player gets a role, built
   locally from the role the client already knows; that is per-peer filtering as it is today, with nothing new
   on the wire.
2. **A "?" on each task row of the Tab/M screen.** Small, at the row's end, always available. Opening it lays the
   card over the map half of the screen; Esc, the same key or a click outside closes it.
3. **A "How to play" board in the lobby,** a diegetic level piece showing every card of the selected mode. Players
   walk up to it, and a veteran can point at panel 3 and explain by voice: proximity voice turns the board into
   social teaching, the best tutorial a party game has. The tutorial room can end facing the same board.
4. **While dead or spectating:** the "?" stays usable, the best idle moment to browse cards.
5. **Loading-screen tips stay funny** and are not cards; at most a tip can reuse one panel as a joke.

### Staying out of a veteran's way

- "Seen" is stored per player in `user://`, keyed by card id and a card version. Each card auto-shows once in a
  player's life. If the designer changes a task enough to bump the version, it shows once more with "CHANGED".
- After that, the only trace is the "?" glyph on a screen the veteran opens anyway. Nothing on the HUD, ever.
- A personal setting, "Show how-to cards automatically" (default on), plus "Reset seen cards" for a shared PC.
- **The session hints setting** governs hints about the current round (zone highlighting on hover, any future
  nudge), not cards. Cards are rules knowledge, and open knowledge is a pillar, so the "?" stays even "without
  hints". If the humans want a hardcore mode, "without hints" can also suppress the auto-show for everyone.

### Tab held vs toggle vs M: what to read a card with

A held key and a card do not mix. Holding Tab while moving the mouse to a "?" and reading four panels is awkward;
releasing Tab to rest a finger closes the card mid-read; and a held screen keeps the mouse captured for looking
around, so there is nothing to click with. **Recommendation:**

- **Tab tapped** (released within about 0.2 s): the screen opens and stays open with a free cursor; rows, the "?"
  and the map are clickable; WASD still walks, the mouse no longer turns the camera. Tab or Esc closes it.
- **Tab held:** a peek (counters and the map, no cursor) that closes on release, for veterans who just want the
  counters.
- **M** opens the same toggled screen with the map focused, for players who expect a map key.
- A card is never shown on a held screen. The tap-versus-hold threshold (a common pattern, unconfirmed) is tuned
  in a playtest; it keeps one key for both kinds of player.

### Scaling to 10+ tasks: the card as content data

A card is presentation data: it lives on the client, never in `core/`, and it does not touch the rules. A sketch
of the shape (names illustrative, the engineer decides):

- `HowToCard` (a `Resource`): `id`, `version`, `title_key`, `icon`, `steps: Array[HowToStep]`, `warn: HowToStep`
  (optional).
- `HowToStep` (a `Resource`): `verb` (from the closed list), `object` (a pictogram id: an item kind, a station,
  "map", "switch"), `count` (0 = none, -1 = "ALL", or bound to a task setting such as the number of switches),
  `caption_key` (optional; by default the caption is built from the verb's and the object's translations),
  `art` (optional texture: a hand-drawn panel that replaces the composed one).
- Each task type's data names its card; the designer writes the steps in `content/` with no engine change.
- The engine composes a panel from the verb pose plus the object pictogram plus badges, so a new task type has a
  readable card on day one, before any custom drawing exists.
- **Translation stays cheap:** about a dozen verbs and the object names (already translated for the task list)
  in the existing CSV or PO files; a custom `caption_key` only where the default reads badly. Ukrainian runs
  longer than English (e.g. "CARRY" vs "ВІДНЕСИ"), so captions wrap to two lines and pseudolocalization catches
  overflow.
- **A content test** keeps cards from being forgotten when task number 11 arrives: every task type has a card;
  3 to 5 steps; every verb is in the list; every key exists in EN and UK.

### Who draws the art

- **Tier 1, now: an agent-made SVG pictogram set on one grid** (Aicher-style): the figure in about 13 verb poses,
  about 15 object pictograms, badges and frames. SVG is text, so agents can make and extend it from the command
  line, and Godot imports SVG as textures (unconfirmed for 4.7 details; check with `check`). The comic feeling comes
  from the poses, a slightly wobbly line and the deadpan face.
- **Tier 2, later: hand-drawn hero panels** per task, swapped in through `art`, one at a time. Who draws them is a
  human decision: the designer (an asset, not code, but it is outside "scene layout and imported third-party
  assets", so the humans should say), a friend, a commissioned artist (costs money: ask first), or CC0 or
  CC BY icon sets with entries in `docs/credits/`.
- One style sheet (grid, line weight, palette, figure proportions) in `docs/design/` keeps every source
  consistent.

### Accessibility

- Picture plus word in every panel; no colour-only meaning (the warning frame has a shape and a hatch); captions
  scale with the UI scale; no timer; reopen any time; static, and any later animation respects "reduce motion".
  Short captions help slow readers and second-language readers.

### Cost (rough)

- **Engine (engineer's agent):** one medium issue: the two resources, the strip renderer, the "?" on the task row,
  the seen store, the loading-screen hook, the Tab tap and hold behaviour and the content test. A few agent days.
- **Tier 1 art (agent):** one small to medium issue for about 30 SVG pictograms and a style sheet.
- **Designer, per task type:** 15 to 30 minutes to write the steps, plus a hallway test.
- **Lobby board:** one level piece (`new-level-piece`).
- **Money:** zero unless an artist is commissioned.

## Example 1: Delivery

From the GDD and the content-API ADR: packages are scattered at Loading, each carries its destination label in 3D,
and a package is done when it rests in its circle station; dissidents hide packages.

| # | Verb + object | Drawing | EN caption | UA caption |
|---|---|---|---|---|
| 1 | FIND package | figure, hand over eyes, a box with "?" | FIND A PACKAGE | ЗНАЙДИ ПОСИЛКУ |
| 2 | TAKE package | figure lifting the box (hand), a second box on the belt | PICK IT UP | ВІЗЬМИ ЇЇ |
| 3 | CHECK label + map | close-up of the box label's symbol, then the same symbol on a map | CHECK WHERE | ГЛЯНЬ КУДИ |
| 4 | PUT package, circle | figure setting the box inside a floor circle; counter 3/8 → 4/8 | PUT IT IN THE CIRCLE | ПОСТАВ У КОЛО |
| ! | warn | a sneaky figure stuffing a box behind a crate | THEY HIDE PACKAGES | ЇХ ХОВАЮТЬ |

If packages spawn in a storage room rather than scattered, panel 1 becomes "GO storage". Whether the card shows a
key glyph for the map is open: the HUD has no key prompts, and the tutorial room teaches the key.

## Example 2: Switches (hypothetical)

Find every switch, turn them on, keep them on. The card forces the designer to decide the "done when" panel,
which is still open for this idea (all on at once, or all on for N seconds).

| # | Verb + object | Drawing | EN caption | UA caption |
|---|---|---|---|---|
| 1 | FIND switch ×ALL | figure with a magnifier, three switch icons, "×ALL" (or "×5" from the setting) | FIND ALL SWITCHES | ЗНАЙДИ ВСІ РУБИЛЬНИКИ |
| 2 | TURN ON switch | figure pulling a lever up, a lamp lights | TURN ON | УВІМКНИ |
| 3 | WATCH switch | figure on guard; a sneaky figure's hand at a lever, warning triangle | DON'T LET THEM FLIP | НЕ ДАЙ ВИМКНУТИ |
| 4 | done when | every lamp lit (with a timer ring, if the designer picks "for N seconds"); counter fills | ALL ON = DONE | ВСІ УВІМКНЕНІ = ГОТОВО |

## Risks and open questions

- Pictograms are misread (FAA); the hallway test and the captions are the mitigation, and they cost minutes.
- Auto-showing on the loading screen depends on Loading lasting long enough to read; if it is very short on a LAN,
  the "NEW" dot carries the rest.
- Who draws Tier 2, and whether the designer drawing panels by hand fits the hard rules.
- Whether the card may show key glyphs, given "no key prompts on screen".
- Whether "without hints" also suppresses the automatic first showing.
- Whether role cards (dissident, engineer) and item cards use the same system from the start.
