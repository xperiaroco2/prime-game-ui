<!-- Draft of a prime-game issue. Title: client: the UI's input rules across the game: Space out of ui_accept, Esc closes the top overlay, gameplay input per screen, the 16 rebindable actions · Labels: area:client -->

## Goal
The styled screens (prime-game-ui#19) rely on input rules that hold across the whole game, not on one screen. Set them once, in the project's InputMap and one place in the client, so every screen issue can rely on them. Source: the «Layers and input (every screen)» section of every handoff, and the notes of s1, s5, s8 and s9, in prime-game-ui [`docs/handoff/`](https://github.com/xperiaroco2/prime-game-ui/tree/ui-0.2.0/docs/handoff) at `ui-0.2.0`.

## Rules
1. **Space leaves `ui_accept`** in `project.godot`. Enter and the gamepad's A still press a focused control; `jump` keeps Space. Why: the map keeps gameplay input while a «?» may have focus, so a jump must never press it. The rule is project-wide because `ui_accept` is.
2. **Esc (`ui_cancel`) closes the topmost overlay first**: a how-to card, then the map; in the Esc menu its confirm dialog, then the menu. It opens the Esc menu only when nothing else is open. Each overlay handles `ui_cancel` itself and calls `get_viewport().set_input_as_handled()`, so one press closes one overlay. A key capture in Settings › Controls takes Esc as cancel and consumes it. On the main menu Esc closes the open panel. Esc is fixed, not rebindable.
3. **The map key** opens and closes the map; with its how-to card open it closes only the card; it is ignored while the Esc menu is open.
4. **Gameplay input per screen.**
   - Esc menu open: the own character takes no gameplay input (no move, look, sprint, jump, interact or item use); the mouse is free; voice keeps working as set (voice activation, or Talk while held). Closing captures the mouse again.
   - Map open: move, sprint, jump, interact and talk keep working; only the mouse look stops; the mouse is free. The map's focus moves only with the arrows and the d-pad, never with the movement keys.
   - Lobby HUD, round HUD, downed and spectating: the mouse stays captured; HUD nodes take no mouse.
   - Connecting and loading: the backdrop stops the mouse. Pre game and post game: no input.
5. **The 16 rebindable actions** of Settings › Controls, with the deck key, today's action and the default:

| Deck key | Action today | Default |
|---|---|---|
| `control.forward` | `move_forward` | W |
| `control.backward` | `move_back` | S |
| `control.left` | `move_left` | A |
| `control.right` | `move_right` | D |
| `control.sprint` | `sprint` | Shift |
| `control.jump` | `jump` | Space |
| `control.interact` | `interact` | E |
| `control.use` | `use` | left mouse |
| `control.put_down` | `put_down` | Q |
| `control.swap` | `swap` | X |
| `control.map` | `task_screen` | M (Tab today, #253) |
| `control.give_up` | `give_up` | F (G today, #211) |
| `control.ready` | `ready` | F |
| `control.talk` | `voice_talk` | V |
| `control.spectate_next` | `spectate_next` | left mouse |
| `control.spectate_previous` | `spectate_previous` | right mouse |

   `debug_overlay` (F3) is not listed. Whether `task_screen` is renamed is the implementer's call.
6. **«Same key» is per phase.** Two actions on one key clash only when both act in the same phase; `give_up` (downed) and `ready` (lobby) share F legally (#211). The review page shows Map and Talk on M as a clash. The implementer defines and tests the phase of each action.
7. **One key-label helper** for every key the UI draws (the tutorial's keycaps, the downed «Hold F to give up», Settings › Controls): `DisplayServer.keyboard_get_label_from_physical()` of the action's binding, so a label follows a rebind and the keyboard layout. Space and the mouse buttons use the deck keys `key.space`, `key.mouse_left`, `key.mouse_right`. Space, Shift, Tab and Esc keycaps take the wide size.

## Not in this issue
Saving, loading and resetting the bindings (#211); each screen's look (the screen issues).

## Depends on
#211 (rebinding), #253 (the map key), #208 (key labels as deck keys).

## Acceptance criteria
- [ ] `ui_accept` has no Space; Enter, keypad Enter and the gamepad's A press a focused button; Space still jumps (a test).
- [ ] The Esc order holds: card before map, dialog before the Esc menu, a capture before the menu; one press closes one overlay (tests).
- [ ] The map key opens and closes the map, closes only an open card, and does nothing under the Esc menu (tests).
- [ ] With the Esc menu open no movement or look is sent and voice still works; with the map open movement works and the look does not (tests).
- [ ] The 16 actions exist with the defaults above and appear in Settings › Controls.
- [ ] The clash check: Map and Talk on M clash, `give_up` and `ready` on F do not (a test).
- [ ] The key-label helper follows a rebind; Space and the mouse buttons use the deck keys (a test).
- [ ] `tools\run.cmd verify` green.

Tracking: #150

🤖 Generated with [Claude Code](https://claude.com/claude-code)
