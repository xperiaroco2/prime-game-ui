# Gap G1: Ukrainian-language UX beyond glyphs

Plural forms, gendered verb forms, translation context, key labels on the Ukrainian layout, and name entry.
Research date 2026-10-02. "(unconfirmed)" marks claims I did not see stated in a primary source.

## Short version

1. **Plurals.** Ukrainian integers need three forms (one, few, many). Godot 4.7 CSV supports them through a
   `?plural` column and continuation rows, but only through `tr_n()` in code, never through automatic Control
   translation. Most HUD counters can avoid plurals entirely with a "Label: N" or "N/M" pattern. Use `tr_n`
   only for full sentences.
2. **Deck layout:** `keys,?plural,uk,en,_notes`. Drop `?context`, because translation keys are already unique.
   The notes column starts with `_` so Godot ignores it.
3. **Gender.** No line may give a player (you or NAME) a gendered past tense, adjective or role noun. Five
   neutral patterns cover every line I found. No gender setting is needed.
4. **Case.** A name or team name dropped into a Ukrainian sentence cannot be declined. Keep `{name}` in the
   nominative, either as the subject or after a colon, and give each team its own whole-sentence key.
5. **Keycaps** show the Latin (US-position) letter, not the Cyrillic one. On the Ukrainian layout, F reads "А",
   D reads "В" and S reads "І", and each looks like a different Latin key.
6. **Names.** Limit them by characters, not bytes, at the same 16-character limit in both languages. Accept all
   three apostrophes and compare names with the apostrophes normalised. The IP address field has a real
   layout trap: the period key types "ю" on the Ukrainian layout.

## 1. Plurals

**CLDR rule for uk.** CLDR's `plurals.xml` puts `ru` and `uk` in one `pluralRules` element, with four
categories ([CLDR plurals.xml](https://raw.githubusercontent.com/unicode-org/cldr/main/common/supplemental/plurals.xml);
chart: [Language Plural Rules](https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html)):

| Category | Rule (v = 0 means an integer) | Samples |
|---|---|---|
| one | i % 10 = 1 and i % 100 != 11 | 1, 21, 31, 101 |
| few | i % 10 = 2..4 and i % 100 != 12..14 | 2-4, 22-24, 102 |
| many | i % 10 = 0, or 5..9, or i % 100 = 11..14 | 0, 5-19, 100 |
| other | decimals only | 1.5, 10.0 |

The game shows only integers (packages, players, seconds), so it needs three forms. "other" never appears.
English needs two.

**Godot 4.7 CSV.** The [4.7 spreadsheet page](https://docs.godotengine.org/en/4.7/tutorials/i18n/localization_using_spreadsheets.html)
says plural and context support arrived in 4.6. A `?plural` column holds the source plural. Each extra plural
form goes in a continuation row whose key cell is empty. An optional `?pluralrule` row overrides a locale's rule
in gettext syntax; the page's example is `nplurals=2; plural=(n >= 2);`. `?context` goes in the second column, or
after `?plural` when both are used. Columns whose names start with `_` are comments and are not imported. The file
must be UTF-8 without a BOM, and the delimiter can be a comma, semicolon or tab. The page states that automatic
Control translation does not support plural forms or context: such strings must go through `tr_n()`.

**API, confirmed in `tools/out/godot-api/4.7.2/extension_api.json`:**
- `Object.tr_n(message: StringName, plural_message: StringName, n: int, context: StringName = &"") -> String`
- `Node.atr_n(message, plural_message, n, context)`, the variant that respects `auto_translate_mode`
- `TranslationServer.translate_plural(message, plural_message, n, context) -> StringName`, plus
  `TranslationServer.get_plural_rules` (its signature was not checked)
- `Translation.add_plural_message(src_message, xlated_messages: PackedStringArray, context)`, plus
  `Translation.plural_rules_override: String`
- `TranslationServer.set_pseudolocalization_enabled(bool)`, useful for length stress tests
- `String.format(values, placeholder = "{_}")`, for named placeholders like `{name}`

**Unverified, needs a probe test at port time:** the rule Godot uses for `uk` by default; whether it is the
3-form gettext rule; how a key-based CSV (one whose key column is not English text) fills the `?plural` cell. The
docs example uses English source text as the key (unconfirmed for keys). Cheap insurance is to put the gettext
rule for uk in a `?pluralrule` row:
`nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);`
This is the standard gettext rule for East Slavic languages, and it matches CLDR one/few/many (I wrote it from
memory and checked it against the CLDR table above).

**Avoid plurals where you can.** HUD counters read better as "Пакунки: 3/10" and "Готові: 4/8". That pattern
needs no plural form, keeps the width stable and stays short. Use `tr_n` only for sentences such as toasts and
the respawn line.

### Proposed `copy/deck.csv` layout

`keys,?plural,uk,en,_notes`

- `keys`: dotted translation keys (`screen.element.state`), as T15 decided.
- `?plural`: filled only on plural rows, with the key plus `.n`. Its value is the fallback that `tr_n` returns for
  n != 1 when no translation is found.
- `uk`, `en`: the texts. The uk column comes first because mockups are Ukrainian-first. Godot does not care
  about column order among locales.
- `_notes`: where the string appears, what each placeholder means, the maximum width, and "gender: checked".
  The leading `_` means Godot ignores the column (per the docs).
- No `?context`. With unique keys, two meanings of "Ready" are simply two keys (`lobby.ready.button`,
  `lobby.ready.status`). If source-text keys are ever adopted, `?context` goes after `?plural`.
- Edit the deck in a text editor or through the HTML page. Avoid Excel: saving can add a BOM, and on Ukrainian
  Windows locales it often switches to semicolons (unconfirmed).

Five example rows (draft wording; the texts are for the humans to approve):

```csv
keys,?plural,uk,en,_notes
hud.packages_left,hud.packages_left.n,Лишився %d пакунок,%d package left,"Toast. %d = undelivered packages. uk rows: one, few, many. HUD counter uses hud.packages (no plural)"
,,Лишилося %d пакунки,%d packages left,
,,Лишилося %d пакунків,,
lobby.players_ready,,Готові: %d/%d,Ready: %d/%d,"Lobby HUD. Deliberately no plural: label-colon pattern"
life.respawn_in,life.respawn_in.n,Повернення через %d секунду,Back in %d second,"Life panel, counts 30..1, so passes 21 (one), 22-24 (few), 25-30 (many)"
,,Повернення через %d секунди,Back in %d seconds,
,,Повернення через %d секунд,,
life.raised_by,,{name} піднімає тебе,{name} is raising you,"Toast while the rescuer holds E. Present tense hides the rescuer's gender. {name} stays nominative"
end.won.engineers,,Перемогли Інженери,The Engineers win,"End screen. One key per team: the team name is never inserted into a sentence. Plural past tense has no gender"
```

## 2. Gender

Ukrainian marks gender in the past tense (помер / померла), in adjectives and participles (готовий / готова,
поранений / поранена) and in role nouns (інженер / інженерка). The present tense, the plural past tense and the
impersonal -но/-то forms carry no gender (standard grammar; I opened no style source that states it, so
unconfirmed as a citation).

The [DOU article by a MacPaw technical writer (2023)](https://dou.ua/forums/topic/41944/) recommends rewriting
lines to avoid gendered forms entirely rather than writing "(а)" variants. Its example swaps a "subscriber (m/f)"
phrase for "Я вже маю реєстрацію". The same article covers the three numeral forms and uses the U+02BC
apostrophe. Microsoft's [Ukrainian style guide](https://learn.microsoft.com/en-us/globalization/reference/microsoft-style-guides)
covers gender (per its search listing), but its PDF did not render as text, so I could not read its advice
(gap).

Lines in this game that would be gendered if written naively, with neutral rewrites:

| Line | Naive uk (gendered) | Neutral pattern | Draft |
|---|---|---|---|
| You died | Ти помер / померла | impersonal -то; 3rd plural | "Тебе вбито" (knife); "Тебе не встигли підняти" (bled out) |
| You were knocked down | Ти впав / впала | impersonal -но/-то; noun | "Тебе поранено"; header "Поранення" |
| You are ready | Ти готовий / готова | predicative "готово"; noun | button "Готово ✓"; status "Готовність: так" |
| NAME raised you | Олена підняла тебе | present tense; 3rd plural + colon | "{name} піднімає тебе"; after: "Тебе підняли: {name}" |
| You are an engineer | Ти інженер / інженерка | team (plural) noun | "Ти в команді Інженерів" (#175's own wording) |
| You gave up (hold G) | Ти здався / здалася | noun | "Здача…" (hold ring label) |
| You are invulnerable | Ти невразливий / -а | noun + number | "Невразливість: 3 с" |
| NAME left | Олена вийшла | present tense; noun | "{name} виходить з гри" |
| You won | Ти переміг / перемогла | team subject | "Перемогли Інженери"; "Твоя команда перемогла" (agrees with команда) |

**Proposed deck rule (T15 addendum).** No uk string may give a player, you or `{name}`, a gendered past tense,
adjective, participle or role noun. Use one of five patterns:
(a) impersonal -но/-то ("Тебе поранено");
(b) the indefinite third person plural ("Тебе підняли");
(c) the present tense ("{name} піднімає тебе");
(d) a noun headline or "Label: value" ("Повернення через 12 с");
(e) a team or plural subject ("Перемогли Інженери").
Never use slash or bracket variants ("помер(ла)"). A deck check can reject `(ла)`, `(а)` and `/ла` mechanically.
The rest is a review item: `_notes` carries "gender: checked".

**Case rule.** Ukrainian has seven cases, and a placeholder cannot be declined. "Raised by Olena" would need
"Оленою". Keep `{name}` in the nominative, as the subject or after a colon. Team and colour names get
whole-sentence keys per value; they are never inserted. Use named placeholders through `String.format`, so a
translator can move `{name}` freely.

**Is a gender setting needed?** No. The patterns above cover every line found. A setting would fix only
second-person lines. Lines about other players ("{name} ...") would also need each player's setting sent over the
network, which adds data and a menu choice for little gain. English uses "they" for other players. Address form,
ти or ви, is a text decision for the humans. Ти fits the party tone. Plural "ви" would also remove gender
("Ви померли"), but it reads as formal or as addressing a group.

## 3. Keyboard layout and keycap text

The input map has 13 events, and the key events use `physical_keycode` (checked in `project.godot`: W S A D,
Shift, Space, E, Q, X, Tab, F, Esc, G). Gameplay therefore works on any layout. The question is only what the
keycap shows.

**API, confirmed in the dump:**
- `DisplayServer.keyboard_get_label_from_physical(Key) -> Key`
- `keyboard_get_keycode_from_physical`
- `keyboard_get_current_layout() -> int`
- `keyboard_get_layout_language(int) -> String`
- `keyboard_get_layout_name`
- `InputEventKey.key_label`, `as_text_key_label()`, `as_text_physical_keycode()`
- `OS.get_keycode_string`

The [4.7 InputEventKey page](https://docs.godotengine.org/en/4.7/classes/class_inputeventkey.html) describes
three properties. `key_label` is the localized label on the key and is "meant for key prompts". `physical_keycode`
is the US-QWERTY position, for WASD-style input. `keycode` is the Latin label, for shortcuts.

On the standard Ukrainian ЙЦУКЕН layout our keys read W→Ц, A→Ф, S→І, D→В, E→У, Q→Й, X→Ч, G→П, F→А
(unconfirmed: I did not open a layout chart). The trap is homoglyphs:
- Cyrillic "А" for F looks exactly like the Latin A, which is the strafe-left key.
- "В" for D looks like B.
- "І" for S looks like I.

So a prompt "Натисни А, щоб бути готовим" sends the eye to the wrong key. The label also changes whenever the
player switches layout (Alt+Shift or Win+Space on Windows, unconfirmed), so `key_label` prompts would flip between
"У" and "E" mid-match.

Known engine caveats:
- `OS.get_keycode_string` returns English names for special keys, and a proposal to localize them is still open
  ([godot-proposals #10350](https://github.com/godotengine/godot-proposals/issues/10350), opened 2024-08-03).
- Dead keys are not converted on Windows ([godot #118143](https://github.com/godotengine/godot/issues/118143),
  unconfirmed, title only).

Players dislike Cyrillic prompts. In one Steam thread a player called Cyrillic button prompts under the Russian
localization a bad decision and asked for Latin prompts with Russian text
([Ace Combat 8 forum, 2024-09-29](https://steamcommunity.com/app/2288340/discussions/0/592942834747710668/),
unconfirmed, forum). I found no platform guideline (gap).

**Recommendation (technical, mine):**
- **Letter keys.** The keycap shows `OS.get_keycode_string(DisplayServer.keyboard_get_label_from_physical(k))`
  only when that result is a Latin letter A-Z. AZERTY players then correctly see Z for forward. Otherwise it
  falls back to `OS.get_keycode_string(k)` on the physical keycode, so a Ukrainian layout shows the Latin letter.
  The label stays stable when the player switches layout. Ukrainian keyboards print both alphabets (unconfirmed),
  so the Latin letter is always on the key.
- **Special keys.** Names for Tab, Esc and Shift stay Latin; Ukrainian keycaps print them that way
  (unconfirmed). Space comes from the deck (`key.space`: "Пробіл" / "Space"). Mouse buttons are icons, as the
  synthesis already says.
- Showing both letters ("E/У") is rejected: it doubles the keycap width and still flips with the layout.

**IP address field (`client/ui/main_menu.gd`).** On the Ukrainian layout the "." key types "ю" and "," types "б".
The numpad decimal key may type "," (unconfirmed). A player typing `192.168.1.5` gets `192ю168ю1ю5`. The field
should accept "ю", "б" and "," as ".", or at least show "switch to English layout" (an engine issue later).

## 4. Name entry and display

Today names are auto-assigned as `"Player%d"` in `core/match/match_state.gd:79-81`, built on the host as text.
When a lobby has a Ukrainian host and English clients, everyone sees the host's language. The default name should
be localized on each client from a number. That is a later prime-game issue.

For typed names:
- **Length.** `LineEdit.max_length` counts characters (`set_max_length(chars: int)`, confirmed in the dump).
  Cyrillic takes 2 bytes per letter in UTF-8. Any byte limit in the network message would silently cut Ukrainian
  names to half length, so the host checks `String.length()` too. I recommend one 16-character limit for both
  languages. Long Ukrainian first names ("Олександра", "Святослав") fit with room to spare. Width is the real
  constraint: Ш, Щ, Ж and Ю are wide. Mock name plates with a 16 × "Ш" stress string, and let overflow ellipsize
  (`text_overrun_behavior`; confirmed on `Button` in the dump, assumed on `Label`).
- **Apostrophe.** Players will type U+0027 (the Windows Ukrainian layouts, unconfirmed), U+2019 (autocorrect) or
  U+02BC (the X.Org Ukrainian layout, per a search snippet, unconfirmed). Keep the name as typed. When checking
  for duplicates in a lobby, normalize all three to U+02BC, so "Мар'яна" and "Марʼяна" count as one name. The UI
  font must contain all three glyphs, so lens 4's glyph check should test all three, not only ʼ. Our own copy
  uses ʼ, as the synthesis Q15 recommends. U+02BC is a letter, used in Ukrainian IDNs where punctuation is not
  allowed ([Wikipedia](https://en.wikipedia.org/wiki/Modifier_letter_apostrophe)). Word selection therefore keeps
  "обовʼязок" whole (unconfirmed for Godot's word breaking).
- **Upper case.** `Label.uppercase` exists in the dump. Whether ї, є and ґ map to Ї, Є and Ґ in Godot's case
  tables is unverified: add it to the probe test.

## Gaps and what I could not verify

- The Microsoft Ukrainian style guide is only a PDF, and WebFetch could not extract its text, so its gender and
  apostrophe advice is unread. **Disclosure:** the WebFetch tool saved the binary response automatically to
  `C:\Users\xperi\.claude\projects\D--prime-game\ce8374ce-5cfc-424c-bd40-f671bc77f06b\tool-results\webfetch-1790946124631-96lffp.bin`
  (1.8 MB, Microsoft's style guide PDF). I did not open it, and I did not delete it, because it is outside the
  scratchpad. The manager may remove it.
- Still unverified:
  - Godot's built-in uk plural rule
  - key-based `?plural` import
  - case mapping for ї, є and ґ
  - whether Label overrun matches Button

  One headless probe test in prime-game at port time covers all four.
- The Ukrainian layout key map, which apostrophe each OS layout types, and the numpad decimal key are all from
  memory.
- I found no official platform guideline on prompts for non-Latin layouts. The only evidence is a forum thread.
