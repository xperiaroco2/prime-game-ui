# prime-game-ui

The UI and UX design track of [prime-game](https://github.com/xperiaroco2/prime-game): research, wireframes, style
directions and, after a choice, the design system the game's Godot theme is built from. The plan and the wave reports
live on prime-game issue #150. The engineer runs the track and, for now, also answers as the designer. Chat follows the
human's language (Ukrainian); everything in this repo is English.

## Hard rules
- **HTML-first, shown not named.** Every deliverable is an HTML page the engineer reviews on a phone as a private
  claude.ai artifact; its source lives in `pages/`. A style, a layout or a screen is presented as a picture or a page,
  never only as a name and a paragraph.
- **Godot-safe CSS** in every mock-up: only what Godot 4.7.2 `StyleBoxFlat`, `LabelSettings` and `Theme` can draw
  (solid fills, per-side border widths with one colour, per-corner radii, one shadow with no inset and no spread, one text
  outline). In the UI: no gradients, images, blur or filters, several or inset shadows, per-side border colours, dashed
  borders, `clip-path`, blend modes or pseudo-element decoration.
- **After the style choice, a DTCG tokens file is the single source of truth**; the Godot theme is generated from it in
  prime-game, never hand-copied.
- **Licences.** Every font, icon, sound or image has a verified licence recorded next to it (allowed: OFL, CC0, MIT, ISC,
  Apache-2.0, own work). Never another studio's screenshots or art in this repo: reference images stay in private pages.
- **Downloads.** Nothing is downloaded from the internet without the engineer's yes for that batch (name the files, the
  sources and the size). Web research reads HTML, JSON and text only, never a direct image, PDF or archive URL.
- **Trust and autonomy** (the engineer, 2026-10-03: free the human from needless cognitive load and let the agent decide
  what does not depend on the human's taste).
  - **Merging.** The agent works on a branch, opens a PR for every change and merges it into `main` itself once CI is
    green and it has verified the change. It never pushes to `main` directly; a bad change is undone with a revert PR. It
    also tags releases (`ui-x.y.z`) and closes this repo's issues whose acceptance criteria are met and verified.
  - **The agent decides alone and reports:**
    - technical choices;
    - applying the engineer's decisions;
    - small look adjustments that are easy to change later and keep the style's character (a pixel or two, alignment,
      consistent states).
    Every look decision the agent takes alone goes into `docs/ui-decisions.md` marked "(agent)", so the engineer can veto
    it later.
  - **The agent stops and asks about:**
    - the style's character (new colours, fonts, large component changes);
    - player-facing texts;
    - money, subscriptions and downloads;
    - decisions that affect the whole game or a large scope;
    - changes to these rules.
    A workflow above about 1.5M subagent tokens is agreed first; smaller ones run and are reported. Every `agent()` in
    a workflow passes `agentType`, one of the lean types in `.claude/agents/` (see Layout); only a rare agent that
    needs the browser launches untyped.
  - **Reporting.** A comment on prime-game #150 after each wave and a short message to the engineer when something
    happens. When the engineer's attention or decision is needed, say so and stop.
- **The game's code is not edited from here.** What the game needs becomes an issue in prime-game (with its `area:` label)
  and a note on #150.
- **Research claims carry a link**; anything not confirmed by a primary source says "(unconfirmed)".
- **Moving state** (who does what, what is next) lives only in GitHub issues, never in Markdown files.

## Layout
- `docs/ui-decisions.md`: the UI decisions made so far and where each was recorded. Read it before any screen work.
- `docs/research/<date>-<topic>/`: research reports.
- `pages/<page>/`: sources of the review pages; `pages/components/` is the generated component showcase.
- `tokens/`: the DTCG 2025.10 tokens of the chosen style, the single source of truth (`tokens/README.md`). `dist/` is
  generated from them (the pages' CSS, the game's pack, the contrast results) and never edited by hand.
- `tools/check.js`: runs every check (the token build, the Godot-safe lint, the contrast gates, the page builds); run it
  before every commit, CI runs it too. `tools/tokens/`, `tools/lint/`, `tools/contrast/`, `tools/visual/` (the local
  zero-change probe), `tools/a11y/`: node 20, no packages.
- `.claude/agents/`: the lean workflow agent types (#22): `ui-reader` (Sonnet, read-only) for web gatherers and scouts,
  `ui-judge` (Opus, read-only) for critics of the look and verifiers, `ui-writer` (Opus) for every agent that writes.

## The process
References, then wireframes of every screen, then three style directions, the choice, tokens and components, the styled
screens, and finally handoff issues in prime-game.

## Starting a new manager session
Start a new session for each wave instead of compacting a long one: the repo, `docs/ui-decisions.md` and the wave
comments on prime-game #150 carry everything a session needs.
- **Handover.** It is due at a wave boundary (no workflow in flight, its results reported) once the session is over 12
  hours old or its context over 300k tokens: check with `node tools/manager/context.js`. Never hand over mid-wave. The
  outgoing manager posts the handover comment on prime-game #150; the next session continues from it.
- **Keep-alive** (from prime-game orchestrate-stage §7): while a workflow runs or the engineer's reply is expected, one
  background `sleep 3000` (Bash, `run_in_background`, `timeout` 3300000) keeps the 1-hour cache warm and re-arms at
  each wake. A wake re-reads only its state lines (session start, timer, wake count). At most 14 wakes in a row (a
  message from the engineer resets the count); none after a handover or once the session ends.

The engineer's first message:

```text
ultracode: ти менеджер UX/UI-треку prime-game. Прочитай CLAUDE.md і docs/ui-decisions.md у D:\prime-game-ui,
останні коментарі на xperiaroco2/prime-game#150 і відкриті задачі xperiaroco2/prime-game-ui. Продовжуй з <задача>.
Правила в CLAUDE.md (довіра, 2026-10-03): технічне й дрібне вирішуй і зливай у main сам після зеленого CI; характер
вигляду, тексти, гроші, завантаження й великі рішення питай; workflow понад ~1,5M токенів узгоджуй. Звіт — коментар на
#150 після хвилі.
```
