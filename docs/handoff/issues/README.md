# The handoff issues of wave prime-game-ui#19

Filed on 2026-10-07 in prime-game, after the `ui-0.2.0` tag: input #488, s7 #489, s8 #490, s5 #491, s1 #492, s2 #493,
s3 #494, s4 #495, s6 #496, s9 #497, s10 #498; the comments went to #288 and #289. The issues are the source of truth
from now on; these drafts are kept as filed. The notes the drafter left before filing:

- Before filing: tag ui-0.2.0 must exist (every Build link points at blob/ui-0.2.0/docs/handoff/...), and replace SCREENS_URL in all ten bodies.
- Placeholders ISSUE_S5, ISSUE_S7, ISSUE_S8, ISSUE_INPUT: file in the order input, s7, s8, s5, s1, s2, s3, s4, s6, s9, s10 and replace each with the number filed before it (s1 uses S5/S7/S8/INPUT; s2 S5; s3 S8; s4 S7; s5 S8/INPUT; s6 S7; s8 INPUT; s9 S7/INPUT). The input issue names no screen issue, so it has no cycle.
- s7 'raising' was decided by the engineer on 2026-10-06 (q9 a): the s7 body says so.
- Room pictograms (system B, pages/room-signs/systems/b/icons/) are not in dist/pack/icons/, yet s8 draws them and #306 expects 'a pictogram id from the UI pack'. Consider adding them to the pack (a minor release) before or after ui-0.2.0; the s8 body says they are not in the pack yet.
- The #288 comment flags three pack-side gaps the manager may prefer to fix in prime-game-ui instead: ui-sync's .gdignore would stop Godot importing dist/pack/icons/; the pack names no textures (slider knobs, dropdown arrow); the pack does not mark ToyChipNew/ToyChipNewText deprecated (only tokens $deprecated).
- No prime-game issue covers the tutorial itself (the room and the lesson flow) or the lobby presets (Standard, Quick, No knives, own preset; their values are content, the designer's). s1 and s5 carry them as UI behaviour per the handoffs; the tutorial room is level work.
- s2's name row and s5's Character tab depend on #73 (own name and body colour; area:core, needs-design, open questions). The game has no name field today (main_menu.gd).
- Input issue: drafted because the handoffs carry whole-game rules no issue holds (Space out of ui_accept in project.godot, the Esc overlay order, gameplay input per overlay, the 16 actions with per-phase clashes, one key-label helper). It builds on #211 and says so. The game's InputMap has no gamepad events and #211 puts controller support out of scope; the 'gamepad focus' criteria rely on Godot's built-in ui_* actions.
- #373, #144 and #145 are still OPEN although their code exists on the release branches; the bodies say 'reworks its look'. Action names in the input table were read from prime-game project.godot on release/m6 (voice_talk = V, task_screen = Tab, give_up = G).
