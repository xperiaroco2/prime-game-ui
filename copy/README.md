# Copy deck

Every player-facing string of the screens, with a translation key, English and Ukrainian
([prime-game-ui#4](https://github.com/xperiaroco2/prime-game-ui/issues/4)). The game uses the same file and the same
keys ([prime-game#208](https://github.com/xperiaroco2/prime-game/issues/208)); the wireframes read their English from it.

- `strings.csv`: the deck, in Godot's CSV translation format. The single source of the texts.
- `flags.json`: strings that need the engineer, each with a reason and a proposed text. The deck keeps the current
  wording until the engineer answers on the copy page (`pages/copy/`), then the answer is applied here.
- `node tools/copy/check.js` checks both (it is a step of `tools/check.js`); `--write` regenerates
  `pages/wireframes/en.json` and the English map inlined in `pages/wireframes/wireframes.html`.

## Columns
`keys,en,uk,?plural,?context`, UTF-8, LF, RFC 4180 quoting (a cell with a comma is quoted).

- `keys`: snake_case `screen.element`, for example `menu.host`, `downed.give_up_hold`, `esc.lobby.ready`. Strings
  used on several screens take a shared prefix: `common.*` (Back, Cancel, Close), `player.*`, `role.*`, `task.*`,
  `room.*`, `item.*`, `unit.*`, `lang.*`.
- `en`, `uk`: both always filled. Language names are written in their own language in both columns.
- `?plural`: filled only on a counted string, and it repeats the key: the game calls `tr_n(key, key, n)`.
- `?context`: empty. Every meaning already has its own key, so no key needs a context; a filled context would make
  `tr()` need it too. The checker keeps (key, context) unique if one is ever used.

## Plurals
A counted string with a word that changes with the number takes three rows: the key row holds the "one" forms, then two
rows with an empty key: en "other" and uk "few", then en empty and uk "many". Ukrainian: one for 1, 21, 31; few for
2-4, 22-24; many for 0, 5-20, 11-14, 25. Example: `unit.knives` = 1 ніж, 2 ножі, 5 ножів.
A count without such a word needs no plural: "Гравці 4 / 10", "3 з 6", "10 хв", "Старт через 5".
The layout was confirmed on 2026-10-05 by importing this file in a throwaway Godot 4.7.2 project: 153 messages per
locale, and `get_plural_message("unit.knives", "unit.knives", n)` gives ніж for 1 and 21, ножі for 2, 3 and 22, ножів
for 0, 5, 11 and 112, and en knife / knives. The game's own import test in prime-game#208 still covers it there.

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
- Ukrainian is gender-neutral: no "готовий(-а)", no masculine adjectives about the player; impersonal forms
  ("Тебе повалено") and nouns ("Падіння") instead. Address the player as "ти". Role names (Інженер, Дисидент) are
  titles; team names are capitalised (Інженери, Дисиденти).
- The Ukrainian apostrophe is ʼ (U+02BC): «Імʼя», «Здоровʼя»; the check refuses ' and ’ in uk.
- English: sentence case, plain words, straight from the meaning, not word for word.

## The wireframes
Every Ukrainian text inside a wireframe frame must match a key (a placeholder matches the frame's sample value), or be
listed in `pages/wireframes/frame-extras.json` as a world tag, a wireframe annotation or sample data (player and lobby
names). A new frame string without a key fails the check.
