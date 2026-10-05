# Ukrainian localization: how games handle what our copy deck faces

2026-10-05, for [prime-game-ui#4](https://github.com/xperiaroco2/prime-game-ui/issues/4). Read-only research: HTML, JSON and plain-text sources only, nothing saved. The strongest evidence is shipped string files that are public as text: Minecraft's `uk_ua.json` ([mirror, 1.21.4](https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/refs/heads/1.21.4/assets/minecraft/lang/uk_ua.json)), Mindustry's `bundle_uk_UA.properties` ([repo](https://raw.githubusercontent.com/Anuken/Mindustry/master/core/assets/bundles/bundle_uk_UA.properties)), and the Steam client's Ukrainian strings ([SteamTracking](https://github.com/SteamDatabase/SteamTracking/tree/master/ClientExtracted/steamui/localization)). No Ukrainian UX-writing guide that covers grammatical gender was found as an HTML page; the Ukrainian UX-writing material found is mostly lecture announcements and Telegram channels ([dev.ua list](https://dev.ua/news/top-ukr-resursiv-ux-raitynh)). So the gender rules below come from what shipped games do, plus grammar.

## 1. Grammatical gender when addressing the player

**What carries gender in Ukrainian.** With «ти», the past tense (ти загинув / загинула), adjectives (готовий / готова) and participles (повалений / повалена) agree with the player's gender. The present and future tense do not: «дивишся», «вийдеш», «завантажує» are the same for everyone. Neither do imperatives («Утримуй», «Знайди»), infinitives («Приєднатися»), impersonal forms in -но/-то («Тебе повалено»), nouns («Падіння») or state words («Готово»).

**What shipped localizations do:**

- **Address with «ви» and the past tense becomes neutral.** Minecraft: «Ви загинули!» (`deathScreen.title`); Steam: «Ви вийшли зі Steam.» (`ConnectionTrouble_LoginLost`). This is the main argument for «ви» in a [gamedev DOU thread (2024-03-20)](https://gamedev.dou.ua/forums/topic/48030/): with «ти» a line like «ти голодний» needs a gender, with «ви» it does not.
- **Impersonal forms for states and results.** Minecraft: «Гру призупинено», «Точку відродження встановлено», «Викинуто оператором»; Mindustry: «Сервер зачинено.», «Гру завершено!».
- **State words and nouns.** «Готово» is the Done button in Minecraft (`gui.done`) and Steam (`Button_Done`); Steam shows a game's state as «Готово до запуску»; Minecraft's death screen has «Рахунок», «Кількість смертей».
- **Infinitives on buttons.** Minecraft: «Відродитися», «Вийти з гри», «Спостерігати за світом»; Steam: «Приєднатися до голосового чату», «Запросити інших».
- **Imperatives in instructions.** Minecraft advancements: «Знайдіть елітри»; Mindustry: «Відбийте атаки ворога».

**Where shipped games fall short:** lines about *other* players default to the masculine. Minecraft: «%s приєднався до гри», «%s покинув гру», «%2$s убив %1$s». In a party game with voice, a woman reading «Аня приєднався» notices. Our deck avoids such lines today; any future feed line about a named player needs the present tense or a noun: «{name} у грі», «{name} виходить», «{name}: повалено».

**What players accept** (unconfirmed beyond the sources here): slashes and brackets like «готовий(-а)» read as a form to fill in, and none of the localizations above use them in UI lines; the DOU thread splits between «ви» ("a game speaks to the player with ви") and «ти» (one participant finds «ви» irritating), and nobody there proposes slashes.

## 2. «Ти» or «ви»

- Big localizations checked here use «ви»: Minecraft («Бажаєте ввімкнути диктора»), Mindustry («Тут ви можете…»), Steam («Миттєво довідайтеся…»). They are general-audience products.
- For a game among friends, «ти» is defensible: it matches a voice-chat party game's register and the English "you" of a peer. The [DOU thread](https://gamedev.dou.ua/forums/topic/48030/) shows working devs choosing either way.
- The cost of «ти» is the gender work of section 1: every past tense and adjective about the player must be rephrased. Our deck already does this, so «ти» stays (the deck's current rule).
- **Consistency is the hard rule**: one address in every string, including tips, settings and errors. Do not mix «ти» in the HUD with «ви» in menus (the DOU question was exactly that temptation). The deck's `connect.fail.body` «Перевір адресу і чи ви в одній мережі» uses «ви» as a real plural (you and the host), which is correct but reads like a switch of address; «чи ти з хостом в одній мережі» avoids the doubt.

## 3. Anglicisms and Ukrainian terms

What the checked sources use (Minecraft / Mindustry / Steam string files, 2026-10-05):

| Concept | Seen in shipped strings | Recommendation |
|---|---|---|
| lobby | «лобі Steam» (Mindustry) | **лобі** (indeclinable) |
| host | «Хост», «Хост встановив якість трансляції» (Steam Remote Play) | **хост** |
| session | «Недійсна сесія» (Minecraft, technical) | **сесія**, rare in UI |
| round | not used in the three files | **раунд**, the usual word in Ukrainian game coverage (unconfirmed) |
| map | «Мапа», «Порожня мапа» (Minecraft); «Мапи», «Перегляд мап» (Mindustry); «карта» only for payment cards (Steam) | **мапа**, everywhere |
| respawn | «Відродитися», «Відроджуватися миттєво» (Minecraft); «щоби відродитися в ядрі» (Mindustry); «респавн»: 0 hits | **повернення** (our fiction has no magic) or відродження; never «респавн» in UI |
| spawn point | «Точку відродження встановлено» (Minecraft); «спавн» only in commands | **поява**; «спавн» is chat slang |
| preset | «Шаблони» (`createWorld.customize.presets`, Minecraft); «пресет»: 0 hits | **шаблон**, or no label |
| task / objective | game objectives are «завдання» (Mindustry «необов’язкове завдання»); Minecraft uses «задача» for scoreboard objectives and scheduled jobs | **завдання** for what the player does; «задача» reads as a problem or a technical job (unconfirmed as a norm) |
| player | «Гравці», «Гравців: {0}» (Minecraft, Mindustry) | **гравець** |
| Done | «Готово» (Minecraft, Steam) | **Готово** |

Gamer slang («респ», «спавн», «таска», «імба») belongs in voice chat, not in UI (unconfirmed as a convention; none of the three files use it).

## 4. Tone for an adult party game

- Short, dry, sure of itself. Minecraft's death screen is two words and a button; Mindustry's vote-kick message ends with a dry «Прощавайте.»: one joke at a big moment.
- The player has played this genre: no line that explains a convention (the menu does not pause, a thing is new, how a familiar control works); the decision is in `docs/ui-decisions.md` (2026-10-05). Deck strings that break it today: `esc.running` «Гра триває: меню її не зупиняє», `map.new` «НОВЕ», `loading.new_task`, the second sentence of `tutorial.invite.body` and of `settings.language.hint`, `esc.character.live`, `join.port` «(зазвичай не чіпати)», and the «Порада:» prefix of tips (the loading screen already says it is a tip by where it is).
- Ukrainian UX advice found agrees on brevity: short sentences, calls to action in the fewest words ([SKVOT](https://skvot.io/uk/blog/kak-napisat-khoroshii-ux-tekst)).
- Errors: what happened, then one action. No «Будь ласка», no apology, no exclamation marks.
- Translate the meaning, not the English: «Тебе повалено» beats a calque of "You're down".

## 5. Mechanics: capitals, plurals, apostrophe, abbreviations

- **Sentence case only.** Ukrainian does not use Title Case in UI; Minecraft and Steam capitalise only the first word («Вийти з гри», «Назад до головного меню»). Mozilla's Ukrainian guide keeps localized names of services and technologies in lower case ([Mozilla l10n uk](https://mozilla-l10n.github.io/styleguides/uk/)).
- **Team and role names.** Ukrainian capitalises proper names, not common nouns; a game's factions are a choice. Shipped role names are lower case in running text (Minecraft «Режим спостерігача»). Our deck treats team names as proper names («Перемогли Інженери») but `role.goal.dissident` has «заважати інженерам»: pick one and apply it everywhere (the deck's README says capitalised).
- **Plurals.** Three forms (one, few, many), as in Mozilla's guide: «Одна вкладка / Три вкладки / Шість вкладок» ([Mozilla l10n uk](https://mozilla-l10n.github.io/styleguides/uk/)). Two ways out: `tr_n` with three rows (our `unit.knives`), or the number after a label so nothing agrees: «Гравців: {0}» (Mindustry), «Гравці 4 / 10» (our deck). Never «{count} гравців» without plural rows. The deck's `lobby.setting.task_steps` «{task}: кроків» is a genitive waiting for a number; «{task}: кроки» reads as a label.
- **Apostrophe.** The deck uses ʼ (U+02BC), which Unicode treats as a letter and macOS's default Ukrainian layout types ([uk.wikipedia: Апостроф](https://uk.wikipedia.org/wiki/%D0%90%D0%BF%D0%BE%D1%81%D1%82%D1%80%D0%BE%D1%84)). Shipped games are not strict: Minecraft mixes ' (50) and ’ (108); Steam and Mindustry use ’. Ours is stricter than the market, which is fine as long as every game font has a U+02BC glyph (a missing glyph shows as a box).
- **Units** without a dot: «10 хв», «5 с», «2 год», «%s мс» (Minecraft). The 2019 orthography, §155 as cited by [nfront.org.ua](https://nfront.org.ua/?p=30128) (the orthography's own text was not read).
- **Punctuation.** «» for quotes (Minecraft «дев'ять» in «», Steam «%1$s»), … as one character, a spaced dash « — », a non-breaking space between a number and its unit.

## 6. Examples from well-regarded localizations

Steam language tables, read 2026-10-05 (interface / full audio / subtitles) from each game's store page (for example [Cyberpunk 2077](https://store.steampowered.com/app/1091500/)):

| Game | Ukrainian on Steam |
|---|---|
| S.T.A.L.K.E.R. 2 | interface, audio, subtitles |
| Cyberpunk 2077 | interface, subtitles |
| Baldur's Gate 3 | interface, subtitles |
| Counter-Strike 2, Dota 2, PEAK | interface |
| LOCKDOWN Protocol | full audio only, as listed |
| Among Us, Hollow Knight, Lethal Company, R.E.P.O. | none listed |

- **Cyberpunk 2077**: text localization with Phantom Liberty, September 2023 ([Suspilne](https://suspilne.media/505843-teper-i-ukrainskou-u-veresni-u-cyberpunk-2077-zavitsa-tekstova-lokalizacia/)). Ukrainian players on the Russian version fell from 88% to 46-48% within two weeks; 42% switched to Ukrainian subtitles ([itc.ua, 2024-01-09](https://itc.ua/news/vyhod-ukraynskoj-lokalyzatsyy-cyberpunk-2077-pochty-vdvoe-snyzyl-dolyu-ukraynskyh-ygrokov-vybyrayushhyh-russkyj-yazyk/amp/), citing a podcast). Players take a decent Ukrainian text over a familiar Russian one.
- **Among Us**: the PlayStation Ukraine store text uses «самозванець» and «члени екіпажу» ([PlayStation](https://www.playstation.com/uk-ua/games/among-us/)); the game's own UI strings are not confirmed.
- **PEAK** (one of our references) ships a Ukrainian interface; its strings are not public as text (unconfirmed wording).
- S.T.A.L.K.E.R. 2, Baldur's Gate 3, CS2, Dota 2, Hollow Knight: their UI strings could not be read from a text source within this budget, so no wording is quoted from them.
- Minecraft, Mindustry and Steam strings are quoted above by key.

## Rules for our deck

1. Address the player as «ти» in every string; «ви» only as a real plural, phrased so it cannot read as a switch.
2. Nothing about the player carries gender: no past tense with «ти», no adjectives or participles about the player. Use the present or future tense («дивишся», «вийдеш»), impersonal -но/-то («Тебе повалено»), nouns («Падіння»), state words («Готово»). Never «(-а)» or «/а».
3. Lines about other players by name use the present tense or a noun, never a masculine default: «{name} у грі», «{name} виходить», not «{name} приєднався».
4. Buttons are infinitives: «Приєднатися», «Вийти з гри», «Спробувати ще». Instructions are «ти» imperatives: «Утримуй {key}, щоб здатися».
5. Never explain a convention or the obvious: no "menu doesn't pause", no «НОВЕ», no "nothing will need explaining", no "usually leave it", no «Порада:» prefix. If a line only restates what the player sees, delete it.
6. Short and dry; a joke only in loading tips and big moments (role reveal, end of round). Errors: what happened, one action, no «Будь ласка», no apology, no «!».
7. One word per concept: лобі, хост, сесія, раунд, мапа (never «карта» for the map), гравець, повернення (not «респавн»), поява (not «спавн»), Готово.
8. For the engineer: «завдання» instead of «задача» for what players do (shipped game objectives use «завдання»), and «шаблон» instead of «пресет» (Minecraft's word), or no label at all.
9. Sentence case everywhere; team names capitalised as proper names in every string («Інженери», «Інженерам»); role names capitalised the same way on the role card and in running text.
10. A number before a noun goes through `tr_n` with one/few/many rows; otherwise put the number after a label: «Гравці 4 / 10», «Ножі: 3».
11. Units without a dot and with a non-breaking space: «10 хв», «5 с», «2 год».
12. Apostrophe ʼ (U+02BC) only; check that every game font has the glyph.
13. Quotes «», a single … character, a spaced « — ».
14. Translate the meaning, not the English sentence, and keep the Ukrainian within the layout's length.

