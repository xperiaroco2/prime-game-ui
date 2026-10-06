# Copy deck

Every player-facing string of the screens, with a translation key, English and Ukrainian
([prime-game-ui#4](https://github.com/xperiaroco2/prime-game-ui/issues/4)). The game uses the same file and the same
keys ([prime-game#208](https://github.com/xperiaroco2/prime-game/issues/208)); the wireframes read their English from it.

- `strings.csv`: the deck, in Godot's CSV translation format. The single source of the texts.
- `flags.json`: the open questions for the engineer (one key or a `topic.*` over several keys), each with a reason and
  options a-c (the rows an option would write; empty uk and en remove a key), and what was decided in earlier rounds.
  The deck keeps the current wording until the engineer answers on the copy page (`pages/copy/`), then the answer is
  applied here.
- `node tools/copy/check.js` checks both (it is a step of `tools/check.js`); `--write` regenerates
  `pages/wireframes/en.json` and the English map inlined in `pages/wireframes/wireframes.html`. It also lists the keys
  no styled screen (`pages/screens/src`) draws or names in a note: wire them into a screen, or ask to remove them.

## Columns
`keys,en,uk,?plural,?context`, UTF-8, LF, RFC 4180 quoting (a cell with a comma is quoted).

- `keys`: snake_case `screen.element`, for example `menu.host`, `downed.give_up_hold`, `esc.lobby.ready`. Strings
  used on several screens take a shared prefix: `common.*` (Back, Cancel, Close), `player.*`, `role.*`, `task.*`,
  `room.*`, `item.*`, `unit.*`, `lang.*`. `lobby.*` is the lobby as one concept, shared by the lobby HUD (s4) and the
  Esc menu's Lobby tab (s5), as `lobby.setting.*` already is (`lobby.player_count`, `lobby.host_mark`).
- `en`, `uk`: both always filled. Language names are written in their own language in both columns.
- `?plural`: filled only on a counted string, and it repeats the key: the game calls `tr_n(key, key, n)`.
- `?context`: empty. Every meaning already has its own key, so no key needs a context; a filled context would make
  `tr()` need it too. The checker keeps (key, context) unique if one is ever used.

## Plurals
A counted string with a word that changes with the number takes three rows: the key row holds the "one" forms, then two
rows with an empty key: en "other" and uk "few", then en empty and uk "many". Ukrainian: one for 1, 21, 31; few for
2-4, 22-24; many for 0, 5-20, 11-14, 25. Example: `unit.knives` = 1 ніж, 2 ножі, 5 ножів.
A count without such a word needs no plural: "Гравці 4 / 10", "3 з 6", "10 хв", "Старт через 5".
The layout was confirmed on 2026-10-05 by importing this file (153 keys then) in a throwaway Godot 4.7.2 project: 153
messages per locale, and `get_plural_message("unit.knives", "unit.knives", n)` gives ніж for 1 and 21, ножі for 2, 3
and 22, ножів for 0, 5, 11 and 112, and en knife / knives. The game's own import test in prime-game#208 still covers it there.

## Placeholders
`{name}`, `{names}`, `{count}`, `{total}`, `{time}` (m:ss), `{key}` (the bound key, rebindable), `{lobby}`, `{preset}`,
`{task}`, `{port}`, `{version}`. The game fills them with `String.format({...})` after `tr()`. Both languages carry the
same placeholders; a string drawn in pieces (a keycap inside the sentence) keeps them in the same order.
Icons are never in a string: 🔒, ✓, ▸, the mic, arrows. A key the player presses is `{key}`, never a letter.

## Tone
- Few words. What the tutorial teaches once is not repeated on screen.
- The UI never tells the player what to do or where to go in a round. The tutorial and the how-to cards may.
- Instructions and errors: calm and plain, say what happened and what to do, no apologies, no jokes.
- Funny only in loading tips and big moments (the end of a round, a role reveal).
- Ukrainian: see the localization rules below; the check refuses ' and ’ in uk («Імʼя», «Здоровʼя»).
- English: sentence case, plain words, straight from the meaning, not word for word.

## Ukrainian localization rules
From [the localization research](../docs/research/2026-10-05-ukrainian-localization/report.md) and the engineer's
principle: players are experienced and the game is not for kids, so no string explains a convention or the obvious.

1. The player is «ти» everywhere; «ви» only as a real plural that cannot read as a switch of address.
2. Nothing about the player carries gender: no past tense with «ти», no adjectives or participles about the player.
   Present or future tense («дивишся», «вийдеш»), impersonal -но/-то («Тебе повалено»), nouns, state words
   («Готово»). Never «(-а)» or «/а».
3. Other players by name: present tense or a noun («{name} у грі», «{name} виходить»), never a masculine default.
4. Buttons are infinitives («Приєднатися», «Спробувати ще»); instructions are «ти» imperatives («Утримуй {key}, щоб
   здатися»).
5. No hand-holding: nothing is «new», no «Порада:», no notes on familiar controls or on what the player sees anyway.
6. Short and dry; a joke only in loading tips and big moments. Errors: what happened plus one action; no «Будь ласка»,
   no apology, no «!». The game never speaks as «ми»: a status is a noun («Підключення…», «Готові 3 з 4»).
7. One word per concept: лобі, хост, сесія, раунд, мапа, гравець, повернення (not «респавн»), поява (not «спавн»),
   Готово, задача (the engineer: it sounds technical, and the players are engineers), шаблон (a preset, so its names
   are masculine: «Звичайний», «Швидкий»), Нокдаун (downed), Готовність (the ready toggle). «Матч» stays in «Тривалість
   матчу» (the engineer, 2026-10-05).
8. Sentence case, small labels too («Рука», «Ти тут», «Готово»); team and role names capitalised in every string
   (Інженери, Дисиденти, Інженер).
9. A number before a word that changes goes through `tr_n` (see Plurals); otherwise the number follows a label
   («Гравці 4 / 10», «Ножі: 3»).
10. Units without a dot, after a no-break space (U+00A0): «10 хв», «5 с», «2 год».
11. The apostrophe is ʼ (U+02BC) only; every game font must have that glyph.
12. Quotes «», a single … character, a spaced « — ».
13. Translate the meaning, not the English sentence, and keep the Ukrainian within the layout's length.

## The wireframes
Every Ukrainian text inside a wireframe frame must match a key (a placeholder matches the frame's sample value), or be
listed in `pages/wireframes/frame-extras.json` as a world tag, a wireframe annotation or sample data (player and lobby
names). A new frame string without a key fails the check.
