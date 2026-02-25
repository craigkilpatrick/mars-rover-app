# 01 Questions Round 1 - UI Foundation

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Visual Theme & Aesthetic

What overall look and feel should the mission control UI have?

- [x] (A) Deep space dark — near-black background (#0a0a0f), cool blue/cyan accents, subtle grid lines. Think NASA ops center.
- [ ] (B) Terminal/hacker green — dark background with green accent colors and monospace typography throughout.
- [ ] (C) Warm Mars tones — dark background with red/orange/amber accents to match the Mars theme.
- [ ] (D) Neutral dark — dark slate background (#1e293b), white text, muted accents. Clean and professional.
- [ ] (E) Other (describe)

## 2. Layout Structure

Should the layout change from the current arrangement (canvas left, sidebar right)?

- [ ] (A) Keep the current layout — canvas/grid on the left, controls panel on the right. Just reskin with shadcn/ui.
- [ ] (B) Full-width top header with app name/status, main area split canvas + controls, footer for notifications.
- [x] (C) Controls as a floating HUD overlay on top of the canvas/grid area (preparation for full-screen 3D in Spec 02).
- [ ] (D) Other (describe)

## 3. Typography

What font style fits the mission control aesthetic?

- [ ] (A) Space Mono — monospace throughout. Classic terminal/ops feel.
- [ ] (B) Inter (body) + Space Mono (data/coords) — readable interface with monospace only for rover positions and commands.
- [x] (C) JetBrains Mono — monospace, slightly more modern than Space Mono.
- [ ] (D) Keep system font stack (current behavior). Focus on layout/color, not typography.
- [ ] (E) Other (describe)

## 4. Component Reskin Scope

Beyond replacing MUI with shadcn/ui components, should any UX behaviors change in this spec?

- [ ] (A) Visual reskin only — same interactions, same layout, just swap the component library and styling.
- [ ] (B) Minor UX improvements allowed — e.g., better command input feedback, clearer rover selection state, improved error display.
- [x] (C) Significant UX rework — rethink the interaction model while keeping the same underlying functionality.
- [ ] (D) Other (describe)

## 5. Rover Status Display

How should rover position/direction be displayed in the list and control panel?

- [ ] (A) Same as current — text like "Position: (12, 34) | Direction: N".
- [ ] (B) Styled data badges — coordinate and direction shown as distinct badge/chip components with accent color.
- [x] (C) Compact card per rover — each rover gets a mini card with color indicator, ID, coords, and direction icon.
- [ ] (D) Other (describe)

## 6. Command Input

How should the command input area feel?

- [ ] (A) Keep current design — text field + execute button + single "Forward" shortcut button.
- [ ] (B) Terminal-style input — dark input with a blinking cursor, monospace font, output log below showing command history and results.
- [x] (C) Button grid — directional pad (F/B/L/R) as clickable buttons in addition to the text input.
- [ ] (D) Other (describe)

## 7. Notifications & Errors

How should obstacle collisions and errors be surfaced?

- [x] (A) Keep snackbar/toast pattern — same behavior, just reskinned with shadcn/ui Toast component.
- [ ] (B) Inline status — show result directly in the command panel below the input (no floating toast).
- [ ] (C) Both — inline result for command outcomes, toast for system-level errors.
- [ ] (D) Other (describe)

## 8. Testing Approach

The existing unit tests use MUI class selectors (`.MuiListItem-root`, `.Mui-selected`). How should tests be updated?

- [ ] (A) Replace MUI selectors with `data-testid` attributes — add explicit test IDs to all interactive elements.
- [ ] (B) Replace MUI selectors with accessible role/label queries — use `getByRole`, `getByLabelText` (Testing Library best practice).
- [ ] (C) Mix — use `data-testid` for complex structural queries, accessible queries for interactive elements.
- [x] (D) Other (Use your best judgement)
