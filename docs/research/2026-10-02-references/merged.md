# UI reference hunt: merged result (wave 2, 2026-10-02)

Inputs: f1.md, f2.md, f3.md (three finders, 16 games) plus a gap-filling pass (about 25 searches and page fetches).
No image was downloaded or fetched; every image URL below is text taken from a page, an API or a caption.
Confidence: high = the page, caption or alt text says it shows that screen; medium = strongly implied; low = a guess
(uncaptioned store shots are always low: nobody here has seen them).

## 1. Coverage (at least one candidate per screen)

Legend: H / M / L = best confidence available; `-` = nothing found; `n/a` = the game has no such screen.
role_reveal is counted for the social deduction games only.

| Game | main_menu | lobby | hud | task | death_spectate | end_round | role_reveal |
|---|---|---|---|---|---|---|---|
| LOCKDOWN Protocol | - | H | M | H | - | - | L (role logos only) |
| Among Us | H | H | M | - | M | - | - |
| Goose Goose Duck | - | - | L | - | - | - | - |
| Lethal Company | - | - | H | L (terminal, page only) | - (text only) | H | n/a |
| Content Warning | - | M | M | - | L | M | n/a |
| R.E.P.O. | - | - | L | - | M | - | n/a |
| How to Fish | - | - | L | - | - | - | n/a |
| WEBFISHING | - | - | L | H (in-world quest board) | n/a | n/a | n/a |
| A Short Hike | H | n/a | H | H | n/a | n/a | n/a |
| Lil Gator Game | - | n/a | L | - | n/a | n/a | n/a |
| PEAK | - | H | H | - | M | - | n/a |
| Phasmophobia | - | L (video, no timestamp) | L | H (journal) | - | - | n/a |
| Overcooked! 2 | H | H | H | H (orders HUD) | n/a | H | n/a |
| Moving Out | - | - | L | - | n/a | - | n/a |
| Gang Beasts | H | H | L | n/a | - | - | n/a |
| Party Animals | - | - | L | L | - | - | n/a |

Also found: pause menu (Overcooked! 2 H), settings (A Short Hike H, Overcooked! 2 H), onboarding (Overcooked! 2 M,
PEAK guidebook M, Among Us "How to Play" M), meeting and voting (Among Us H, 2020 UI).

## 2. What the gap pass added

- **LOCKDOWN Protocol**: TheGamer vents guide (https://www.thegamer.com/lockdown-protocol-vents-fix-explained-guide/)
  has alt-texted shots: the tablet open on the vents task with vent locations on the map (task, high), a first-person
  view holding a screwdriver (hud, medium), an opened vent and a fixed vent (task, medium). Steam news (count=100)
  added: UPDATE 1.2.0 "Custom Session Presets" menu `44859328/7644721b686e636b2ab9a70c718e30601c9e713e.jpg` (lobby,
  medium), UPDATE 1.0.0 lobby museum `44859328/eb48904c43978866324a8b84d7e245757b43079c.jpg` (lobby, medium),
  UPDATE 0.13.0 duplicate colours and 16-player limit `44859328/7787ee037efa3e4a3a32905ce5dbd1438de876c6.png` (lobby,
  low); base https://clan.akamai.steamstatic.com/images/. Text: Q opens the map and task list; 0.12.0 lets you click a
  player name in the pause menu; 1.0.0 shows an indicator when a player is in the pause menu. Still no image of the
  main menu, the role reveal, the ghost view or the end of a match. Videos without chapters: EHTUQjfGCp0 ("The ULTIMATE
  Beginner's Guide to LOCKDOWN Protocol"), 3cpuVJp5s7k ("How To Play Lockdown Protocol").
- **Among Us**: nerdschalk voting guide (2020 UI, https://nerdschalk.com/how-to-vote-in-among-us/): REPORT button on
  the HUD, discussion panel, voting panel, "I voted" marks, Skip Vote, results tally, the lobby laptop and its Game
  customization tab. Innersloth: the Influencer ghost role GIF (death_spectate, medium), the new "How to Play" screen
  (onboarding, medium) and a role-settings list GIF (lobby, medium). MobyGames has captioned screenshots but returned
  403: https://www.mobygames.com/game/149316/among-us/screenshots/
- **Lethal Company**: the community wiki on Miraheze fetches fine and has captioned UI files: Player_stats_ui (health,
  stamina, weight), Utility_Slot (health, utility slot, battery), CracksForming.gif (visor cracks with injury) and
  Performance_report ("how well you did at your job", the end-of-round screen). Spectator page (text): third-person
  view of a living employee, the dead talk to each other, auto-switch when the target dies.
- **Content Warning**: TheGamer beginner guide alt texts: approaching the Dive Bell (O2 section), filming a teammate
  (camera view), the crew ordering gadgets in the house shop, watching a video on SpookTube (end of day), a dead body.
  wiki.gg Diving Bell: its monitor lists each player's name, oxygen and distance and says "READY TO SUBMERGE".
- **R.E.P.O.**: TheGamer death-head guide: an activated death head, a death head powering down (death_spectate,
  medium), the death-head battery upgrade at the Service Station (shop). The English game wiki is
  repo-2025horror.fandom.com (not repo.fandom.com).

## 3. Shortlist for the manager (66 items, at most 6 per game)

Open each `url`; if a derived URL fails, open `page_url`. Store shots are uncaptioned (low): view to classify.

| id | game | screen | conf | url | page_url | shows | why pick |
|---|---|---|---|---|---|---|---|
| lp-lobby-1 | LOCKDOWN Protocol | lobby | H | https://clan.akamai.steamstatic.com/images/44859328/d4e4229d052fe07353eaef0f37a080e296b484dc.png | https://store.steampowered.com/news/app/2780980/view/578271438186743048 | 0.14.0 "New lobby design": lobby with wall panels guiding new players | Our model game's walkable 3D lobby |
| lp-lobby-2 | LOCKDOWN Protocol | lobby | M | https://clan.akamai.steamstatic.com/images/44859328/5786a414f62dd62f522d12504e4013841e168156.png | https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=2780980&count=40&maxlength=0&feeds=steam_community_announcements | 0.12.0 extra session settings (host) | Host settings panel to copy or improve |
| lp-lobby-3 | LOCKDOWN Protocol | lobby | M | https://clan.akamai.steamstatic.com/images/44859328/7644721b686e636b2ab9a70c718e30601c9e713e.jpg | https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=2780980&count=100&maxlength=0&feeds=steam_community_announcements | 1.2.0 Custom Session Presets menu | Presets keep host settings simple |
| lp-task-1 | LOCKDOWN Protocol | task | H | https://static0.thegamerimages.com/wordpress/wp-content/uploads/wm/2024/10/vents-task-manager-in-lockdown-protocol-1.png?q=49&fit=crop&w=825&dpr=2 | https://www.thegamer.com/lockdown-protocol-vents-fix-explained-guide/ | Alt: tablet open showing the vents task and vent locations | The in-hand tablet task list and map |
| lp-task-2 | LOCKDOWN Protocol | task | M | https://clan.akamai.steamstatic.com/images/44859328/0269da4b3a086d7801d2eec86d8638ff334e6a0d.jpg | https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=2780980&count=40&maxlength=0&feeds=steam_community_announcements | 1.0.0 tablet redesign (shortcuts to menus, tutorials) | The current tablet design |
| lp-hud-1 | LOCKDOWN Protocol | hud | M | https://static0.thegamerimages.com/wordpress/wp-content/uploads/wm/2024/10/holding-a-screwdriver-in-lockdown-protocol.png?q=49&fit=crop&w=825&dpr=2 | https://www.thegamer.com/lockdown-protocol-vents-fix-explained-guide/ | Alt: holding a screwdriver in front of an opened vent | First-person held item and HUD, if shown |
| au-main-1 | Among Us | main_menu | H | https://www.innersloth.com/wp-content/uploads/2025/03/newmm2-ezgif.com-crop-1024x575.png | https://www.innersloth.com/a-match-made-in-update-16-0-0-emergency-meeting-40/ | Find Game: lobby listings (map, players, speed, roles) | Host/join flow of the genre leader |
| au-lobby-1 | Among Us | lobby | H | https://www.innersloth.com/wp-content/uploads/2024/12/lobby-settings-1024x576.png | https://www.innersloth.com/new-roles-enter-the-fray-v2024-6-18-emergency-meeting-38/ | Redesigned lobby settings: code, map, privacy, presets | Host settings done well |
| au-lobby-2 | Among Us | lobby | H | https://www.innersloth.com/wp-content/uploads/2025/03/mm2-ezgif.com-crop-1024x574.png | https://www.innersloth.com/a-match-made-in-update-16-0-0-emergency-meeting-40/ | Settings laptop inside the dropship lobby | Settings as an object in the lobby |
| au-hud-1 | Among Us | hud | M | https://cdn.nerdschalk.com/wp-content/uploads/2020/10/imported-image-18.jpg | https://nerdschalk.com/how-to-vote-in-among-us/ | REPORT button bottom right (2020 UI) | Action buttons on the HUD |
| au-meet-1 | Among Us | meeting_vote | H | https://cdn.nerdschalk.com/wp-content/uploads/2020/10/img-1171.jpg | https://nerdschalk.com/how-to-vote-in-among-us/ | Voting panel, green check to vote, red X to cancel | The canonical vote screen |
| au-death-1 | Among Us | death_spectate | M | https://t8594055.p.clickup-attachments.com/t8594055/c3dfbba1-c355-44bd-838f-a93ab75f92a3/2026-08-26_16-59-20-ezgif.com-video-to-gif-converter.gif | https://www.innersloth.com/new-ghost-crewmate-role-the-influencer-emergency-meeting-44/ | GIF: the Influencer ghost using its message ability | What a dead player can still do |
| gd-other-1 | Goose Goose Duck | unknown | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1568590/414b9c3c2873d25c9c91ed355d01f8688eeb43d7/ss_414b9c3c2873d25c9c91ed355d01f8688eeb43d7.1920x1080.jpg?t=1778102536 | https://store.steampowered.com/app/1568590/ | Store shot 0, uncaptioned | Only images of a proximity-voice social game |
| gd-other-2 | Goose Goose Duck | unknown | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1568590/a44c91f1719d76ec0944fc8bd687c48d1fdf0a70/ss_a44c91f1719d76ec0944fc8bd687c48d1fdf0a70.1920x1080.jpg?t=1778102536 | https://store.steampowered.com/app/1568590/ | Store shot 1, uncaptioned | As above |
| lc-hud-1 | Lethal Company | hud | H | https://static.wikitide.net/lethalwiki/thumb/9/91/Player_stats_ui.png/300px-Player_stats_ui.png | https://lethal.miraheze.org/wiki/Player_Stats | Caption: the player's UI with health, stamina and weight | First-person co-op vitals, minimal |
| lc-hud-2 | Lethal Company | hud | H | https://static.wikitide.net/lethalwiki/thumb/4/49/Utility_Slot.png/250px-Utility_Slot.png | https://lethal.miraheze.org/wiki/Echo_Scanner | Caption: health indicator, utility slot and battery indicator | Item slot and battery readout |
| lc-hud-3 | Lethal Company | hud | H | https://static.wikitide.net/lethalwiki/thumb/7/7d/CracksForming.gif/250px-CracksForming.gif | https://lethal.miraheze.org/wiki/Echo_Scanner | Caption: visor cracks growing with injury | Damage shown without numbers |
| lc-end-1 | Lethal Company | end_round | H | https://static.wikitide.net/lethalwiki/thumb/1/1e/Performance_report.png/250px-Performance_report.png | https://lethal.miraheze.org/wiki/Echo_Scanner | Caption: the Performance Report (end of round, funny awards) | A playful results screen |
| lc-hud-4 | Lethal Company | hud | H (page) | https://game8.co/games/Lethal-Company/archives/437771 | https://game8.co/games/Lethal-Company/archives/437771 | Captions: terminal "Press E to Start", moon list, store (no direct URL) | Interaction prompt and a diegetic menu |
| cw-hud-1 | Content Warning | hud | M | https://static0.thegamerimages.com/wordpress/wp-content/uploads/2024/04/o2.jpg?q=70&fit=crop&w=825&dpr=1 | https://www.thegamer.com/content-warning-beginner-tips-tricks-how-to-play-guide/ | Alt: approaching the Dive Bell; section on the O2 bar (lower left) | Single-bar minimal HUD |
| cw-hud-2 | Content Warning | hud | M | https://static0.thegamerimages.com/wordpress/wp-content/uploads/2024/04/take-care-of-your-camera.jpg?q=70&fit=crop&w=825&dpr=1 | https://www.thegamer.com/content-warning-beginner-tips-tricks-how-to-play-guide/ | Alt: filming a teammate (camera view) | Diegetic viewfinder UI |
| cw-end-1 | Content Warning | end_round | M | https://static0.thegamerimages.com/wordpress/wp-content/uploads/2024/04/start-early.jpg?q=70&fit=crop&w=825&dpr=1 | https://www.thegamer.com/content-warning-beginner-tips-tricks-how-to-play-guide/ | Alt: watching a video on SpookTube (end-of-day result on the TV) | Results shown in the world |
| cw-lobby-1 | Content Warning | lobby | M | https://static0.thegamerimages.com/wordpress/wp-content/uploads/2024/04/defib.jpg?q=70&fit=crop&w=825&dpr=1 | https://www.thegamer.com/content-warning-beginner-tips-tricks-how-to-play-guide/ | Alt: the crew ordering gadgets from the shop (house) | The house as a lobby with a shop |
| cw-lobby-2 | Content Warning | lobby | L | https://commons.wiki.gg/images/thumb/DivingBell.png/350px-DivingBell.png?da2d08 | https://contentwarning.wiki.gg/wiki/Diving_Bell | The Diving Bell; its monitor lists names, O2, distance, "READY TO SUBMERGE" | An in-world ready check |
| re-death-1 | R.E.P.O. | death_spectate | M | https://static0.thegamerimages.com/wordpress/wp-content/uploads/wm/2025/11/an-activated-death-head-in-repo.jpg?&fit=crop&w=1600&h=900 | https://www.thegamer.com/repo-death-head-possession-explained-guide/ | Caption: an activated death head | Dead players keep a voice and a body |
| re-death-2 | R.E.P.O. | death_spectate | M | https://static0.thegamerimages.com/wordpress/wp-content/uploads/wm/2025/11/a-death-head-powering-down-in-repo.jpg?q=49&fit=crop&w=825&dpr=2 | https://www.thegamer.com/repo-death-head-possession-explained-guide/ | Caption: a death head powering down (battery) | The battery limit on the dead |
| re-shop-1 | R.E.P.O. | other (shop) | H | https://static0.thegamerimages.com/wordpress/wp-content/uploads/wm/2025/11/the-death-head-battery-upgrade-from-the-service-station-in-repo.jpg?q=49&fit=crop&w=825&dpr=2 | https://www.thegamer.com/repo-death-head-possession-explained-guide/ | Caption: the death-head battery upgrade at the Service Station | In-world shop between levels |
| re-hud-1 | R.E.P.O. | hud | L | https://upload.wikimedia.org/wikipedia/en/b/be/REPO_gameplay_screenshot.jpg | https://en.wikipedia.org/wiki/File:REPO_gameplay_screenshot.jpg | Caption: three players carrying a dinosaur statue | Possibly the health/stamina HUD |
| re-hud-2 | R.E.P.O. | hud | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3241660/ss_e6babaab52581f81df91e50768cee6a9334ef6ec.1920x1080.jpg?t=1778158882 | https://store.steampowered.com/app/3241660/ | Store shot 0, uncaptioned | First store shot, often gameplay |
| hf-hud-1 | How to Fish | hud | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4001890/48f6817fe466a7c9666605527558bf1fac48d0d2/ss_48f6817fe466a7c9666605527558bf1fac48d0d2.1920x1080.jpg | https://store.steampowered.com/app/4001890/ | Store shot 1, uncaptioned | Newest low-poly co-op look |
| hf-hud-2 | How to Fish | hud | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4001890/5f867d8c9b03c63867cc95b7bfaa4a3d2193ea48/ss_5f867d8c9b03c63867cc95b7bfaa4a3d2193ea48.1920x1080.jpg | https://store.steampowered.com/app/4001890/ | Store shot 2, uncaptioned | As above |
| wf-task-1 | WEBFISHING | task | H | https://webfishing.wiki.gg/images/thumb/Questboard.png/320px-Questboard.png | https://webfishing.wiki.gg/wiki/Quests | Caption: quest board, red ! when a reward is ready | In-world objective board |
| wf-hud-1 | WEBFISHING | hud | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3146520/ss_d1fdc753a7dc005896e239ea5ea055618a744bb6.1920x1080.jpg | https://store.steampowered.com/app/3146520/WEBFISHING/ | Store shot 1, uncaptioned | Low-poly, pixelated, social |
| wf-hud-2 | WEBFISHING | hud | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3146520/ss_93c1c90ce81dbf0fd3ca2aada73e1ff4c5e62a9a.1920x1080.jpg | https://store.steampowered.com/app/3146520/WEBFISHING/ | Store shot 2, uncaptioned | As above |
| sh-main-1 | A Short Hike | main_menu | H | https://interfaceingame.com/wp-content/uploads/a-short-hike/a-short-hike-main-menu.png | https://interfaceingame.com/screenshots/a-short-hike-main-menu/ | Main menu (URL read from the page) | Simple but charming title screen |
| sh-hud-1 | A Short Hike | hud | H | https://interfaceingame.com/wp-content/uploads/a-short-hike/a-short-hike-interaction.png | https://interfaceingame.com/screenshots/a-short-hike-interaction/ | Interaction prompt (URL derived) | Friendly prompt style |
| sh-hud-2 | A Short Hike | hud | H | https://interfaceingame.com/wp-content/uploads/a-short-hike/a-short-hike-found-a-golden-feather.png | https://interfaceingame.com/screenshots/a-short-hike-found-a-golden-feather/ | Pickup popup (URL derived) | Pickup feedback |
| sh-task-1 | A Short Hike | task | H | https://interfaceingame.com/wp-content/uploads/a-short-hike/a-short-hike-fishing.png | https://interfaceingame.com/screenshots/a-short-hike-fishing/ | Fishing minigame (URL derived) | A tiny minigame panel |
| sh-task-2 | A Short Hike | task | H | https://interfaceingame.com/wp-content/uploads/a-short-hike/a-short-hike-fish-journal.png | https://interfaceingame.com/screenshots/a-short-hike-fish-journal/ | Fish journal checklist (URL derived) | Checklist layout |
| sh-set-1 | A Short Hike | settings | H | https://interfaceingame.com/wp-content/uploads/a-short-hike/a-short-hike-options.png | https://interfaceingame.com/screenshots/a-short-hike-options/ | Options (URL derived) | A small, clean options screen |
| lg-hud-1 | Lil Gator Game | hud | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1586800/ss_d3ee72455db9006d13b564f3811f21c03bc99cc2.1920x1080.jpg | https://store.steampowered.com/app/1586800/Lil_Gator_Game/ | Store shot 1, uncaptioned | Friendly stylized 3D |
| lg-hud-2 | Lil Gator Game | hud | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1586800/ss_1d59c0b307971f6d839c6659784b799d0264910c.1920x1080.jpg | https://store.steampowered.com/app/1586800/Lil_Gator_Game/ | Store shot 2, uncaptioned | As above |
| pk-hud-1 | PEAK | hud | M | https://peak.wiki.gg/images/thumb/OwBar.png/192px-OwBar.png | https://peak.wiki.gg/wiki/Stamina | The stamina bar that doubles as health | One bar, coloured segments |
| pk-hud-2 | PEAK | hud | M | https://peak.wiki.gg/images/thumb/Stamina_Bar_Numb.jpg/320px-Stamina_Bar_Numb.jpg | https://peak.wiki.gg/wiki/Stamina | Stamina bar under the Numb status | Status shown on the bar |
| pk-hud-3 | PEAK | hud | H | https://commons.wiki.gg/images/thumb/Emote_wheel.png/240px-Emote_wheel.png | https://peak.wiki.gg/wiki/How_to_play | Caption: the Emote Wheel | Radial menu |
| pk-lobby-1 | PEAK | lobby | H | https://peak.wiki.gg/images/thumb/Passport_HUD.png/120px-Passport_HUD.png | https://peak.wiki.gg/wiki/Passport | Caption: customization menu from the Passport (Airport lobby) | In-world lobby customization |
| pk-lobby-2 | PEAK | lobby | M | https://peak.wiki.gg/images/Kiosk_boarding.png | https://peak.wiki.gg/wiki/Airport | Gate Kiosk that starts the run (URL built) | Start-game as an object |
| pk-death-1 | PEAK | death_spectate | M | https://peak.wiki.gg/images/thumb/Unconscious_Eyes.png/175px-Unconscious_Eyes.png | https://peak.wiki.gg/wiki/Scout | Screen indicator when a scout passes out | Down/death screen effect |
| ph-task-1 | Phasmophobia | task | H | https://kineticgames.co.uk/payload-api/media/file/Chronicle%20Screenshot%201.webp | https://www.kineticgames.co.uk/blog/phasmophobia-chronicle-v013 | Journal (photos page) | Journal as checklist |
| ph-task-2 | Phasmophobia | task | H | https://kineticgames.co.uk/payload-api/media/file/Chronicle%20Screenshot%203.webp | https://www.kineticgames.co.uk/blog/phasmophobia-chronicle-v013 | Journal media page, new Unique system | Journal layout |
| ph-other-1 | Phasmophobia | other | H | https://kineticgames.co.uk/payload-api/media/file/Chronicle%20Screenshot%202.webp | https://www.kineticgames.co.uk/blog/phasmophobia-chronicle-v013 | Truck monitors, up to five live feeds | Shared info screen in the world |
| ph-hud-1 | Phasmophobia | hud | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/739630/ec30a770064ea10c2bcfb1b3002a3dbd086be516/ss_ec30a770064ea10c2bcfb1b3002a3dbd086be516.1920x1080.jpg?t=1789487643 | https://store.steampowered.com/app/739630/ | Store shot 1, uncaptioned | Mostly diegetic first-person view |
| oc-main-1 | Overcooked! 2 | main_menu | H | https://interfaceingame.com/wp-content/uploads/overcooked-2/overcooked-2-main-menu.jpg | https://interfaceingame.com/screenshots/overcooked-2-main-menu/ | Main menu (URL derived) | Readable party-game menu |
| oc-lobby-1 | Overcooked! 2 | lobby | H | https://interfaceingame.com/wp-content/uploads/overcooked-2/overcooked-2-versus-lobby.jpg | https://interfaceingame.com/screenshots/overcooked-2-versus-lobby/ | Versus lobby (URL read) | Lobby with level choice |
| oc-hud-1 | Overcooked! 2 | hud | H | https://interfaceingame.com/wp-content/uploads/overcooked-2/overcooked-2-cooking.jpg | https://interfaceingame.com/screenshots/overcooked-2-cooking/ | In-level HUD: orders, timer | Task progress at a glance |
| oc-other-1 | Overcooked! 2 | other (round start) | H | https://interfaceingame.com/wp-content/uploads/overcooked-2/overcooked-2-ready.jpg | https://interfaceingame.com/screenshots/overcooked-2-ready/ | "Ready" round-start splash | Countdown/round-start card |
| oc-end-1 | Overcooked! 2 | end_round | H | https://interfaceingame.com/wp-content/uploads/overcooked-2/overcooked-2-score.jpg | https://interfaceingame.com/screenshots/overcooked-2-score/ | Score screen (URL read) | Results screen |
| oc-pause-1 | Overcooked! 2 | pause_menu | H | https://interfaceingame.com/wp-content/uploads/overcooked-2/overcooked-2-paused.jpg | https://interfaceingame.com/screenshots/overcooked-2-paused/ | Paused | Simple Esc menu |
| mo-hud-1 | Moving Out | hud | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/996770/ss_17984d719e442ba6863288e3c1ebedea216005b2.1920x1080.jpg?t=1781014487 | https://store.steampowered.com/app/996770/ | Store shot 1, uncaptioned | Co-op task HUD, if shown |
| mo-hud-2 | Moving Out | hud | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/996770/ss_7ac336466088cdac14c27870dd770aa30ed11a08.1920x1080.jpg?t=1781014487 | https://store.steampowered.com/app/996770/ | Store shot 2, uncaptioned | As above |
| gb-main-1 | Gang Beasts | main_menu | H | https://static0.gamerantimages.com/wordpress/wp-content/uploads/2021/08/GangBeasts-StartingMenu.jpg?q=50&fit=crop&w=825&dpr=1.5 | https://gamerant.com/gang-beasts-private-lobby-guide/ | Caption: starting menu (Local or Online) | Minimal host/join entry |
| gb-lobby-1 | Gang Beasts | lobby | H | https://static0.gamerantimages.com/wordpress/wp-content/uploads/2021/08/GangBeasts-OnlineSettings.jpg?q=50&fit=crop&w=825&dpr=1.5 | https://gamerant.com/gang-beasts-private-lobby-guide/ | Caption: online lobby, Custom toggle, Invite | Private lobby and invite |
| gb-hud-1 | Gang Beasts | hud | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/285900/ss_0476d6b0403313cb4fa727fd99146762eb80f611.1920x1080.jpg?t=1780410654 | https://store.steampowered.com/app/285900/ | Store shot 1, uncaptioned | Near-zero HUD |
| pa-other-1 | Party Animals | other (store menu) | H | https://i0.wp.com/waytoomany.games/wp-content/uploads/2023/09/eaa29ed6-3467-4f23-94fb-f7a147296926.png?resize=860%2C484&ssl=1 | https://waytoomany.games/2023/09/29/review-party-animals/ | Caption: in-game store menu | Soft, rounded menu style |
| pa-task-1 | Party Animals | task | L | https://i0.wp.com/waytoomany.games/wp-content/uploads/2023/09/Screenshot-2023-09-29-120029.png?resize=860%2C484&ssl=1 | https://waytoomany.games/2023/09/29/review-party-animals/ | Caption: Team Score level (carry the safe) | Team objective, HUD unconfirmed |
| pa-hud-1 | Party Animals | hud | L | https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1260320/ss_18fa4ea184c84befeef65bc4518aa26f4084c6c0.1920x1080.jpg?t=1789480764 | https://store.steampowered.com/app/1260320/ | Store shot 1, uncaptioned | Polished current party look |

## 4. Gaps left

- LOCKDOWN Protocol: no image anywhere of the main menu, the role reveal, the ghost (dead) view, the end of a match or
  the pause menu. No video with chapters. Cheapest fix: one short play session with screenshots, or scrub
  https://www.youtube.com/watch?v=EHTUQjfGCp0 (beginner guide) in a browser.
- Among Us: role reveal (Crewmate/Impostor intro), victory/defeat screen, a task minigame and the current HUD. MobyGames
  (403) and the Fandom wiki (402) have them: open in a browser.
- Goose Goose Duck: everything; only 13 uncaptioned store shots.
- Lethal Company: main menu, lobby (ship), the spectator view as an image.
- R.E.P.O.: main menu, lobby (truck), a confirmed HUD, end of level. Try https://repo-2025horror.fandom.com in a browser.
- Content Warning: main menu, a confirmed spectator view.
- How to Fish: all screens beyond uncaptioned store shots (video YVPYjhBdRbE has no known timestamps).
- PEAK, Party Animals, Moving Out: main menu and end screens; Game UI Database ids 2326, 1890, 471 refuse fetches but
  should open in a browser.
- Phasmophobia: main menu, lobby still, death and end-of-contract screens.
- WEBFISHING: main menu, lobby browser and create-lobby screens. Lil Gator Game: any confirmed screen.
- Settings and onboarding were not searched (dropped first per bounds).
- Refused fetches: MobyGames 403, Fandom 402, Game UI Database 403, Steam guides 429, NamuWiki 403.
