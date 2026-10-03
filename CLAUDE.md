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
- **Merging and issues.** Only a human merges into `main`; agents work on branches and open PRs. Agents never close
  issues.
- **Who decides.** Look, texts, money and subscriptions are the humans'; technical choices the agent decides and reports.
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

## The process
References, then wireframes of every screen, then three style directions, the choice, tokens and components, the styled
screens, and finally handoff issues in prime-game.

## Starting a new manager session
Start a new session for each wave instead of compacting a long one: the repo, `docs/ui-decisions.md` and the wave
comments on prime-game #150 carry everything a session needs. The engineer's first message:

```text
ultracode: ти менеджер UX/UI-треку prime-game. Прочитай CLAUDE.md і docs/ui-decisions.md у D:\prime-game-ui,
останні коментарі на xperiaroco2/prime-game#150 і відкриті задачі xperiaroco2/prime-game-ui. Продовжуй з <задача>.
Правила ті самі: нічого не завантажувати без мого «так» на партію, зливаю в main лише я, агенти не закривають задачі,
технічне вирішуй сам і повідомляй, вигляд, тексти й гроші питай. Звіт — коментар на #150 після хвилі.
```
