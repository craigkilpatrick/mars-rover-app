# 01-spec-ui-foundation

## Introduction/Overview

Replace the current Material UI dashboard with a polished mission-control interface built on
shadcn/ui, Tailwind CSS, and JetBrains Mono. The canvas grid moves to full-screen and becomes the
backdrop for floating HUD panels. This spec establishes the visual foundation and interaction model
that Spec 02 (3D Scene) and Spec 03 (Animations) will build on top of.

## Goals

- Replace all MUI components with shadcn/ui equivalents styled with Tailwind CSS.
- Establish a deep-space dark theme (#0a0a0f background, blue/cyan accents) that communicates
  "NASA ops center."
- Restructure the layout so the canvas fills the full viewport and all controls float as HUD panels
  on top of it.
- Introduce a directional pad (F/B/L/R buttons) alongside the existing text command input.
- Deliver a working, fully-tested app at the end of this spec — ready for the 3D scene swap in
  Spec 02.

## User Stories

**As a mission operator**, I want the interface to feel like a real mission control center so that
the experience is immersive and engaging while I issue rover commands.

**As a mission operator**, I want to see all active rovers as compact cards in a side panel so that
I can quickly scan the fleet status and select a rover without leaving the grid view.

**As a mission operator**, I want to issue movement commands via a directional pad as well as a
command string so that I can control a rover both interactively and in bulk.

**As a mission operator**, I want the grid to fill my entire screen so that I can see the full
mission terrain without any surrounding chrome obscuring it.

## Demoable Units of Work

### Unit 1: Project Foundation

**Purpose:** Remove MUI, install shadcn/ui + Tailwind + JetBrains Mono, and establish the deep
space theme. The app renders without visual errors once this unit is complete, even if styling is
incomplete.

**Functional Requirements:**

- The system shall remove all `@mui/*` and `@emotion/*` packages from `package.json`.
- The system shall install and configure Tailwind CSS v4 with PostCSS.
- The system shall install shadcn/ui and initialize it with the "New York" style variant.
- The system shall configure a custom Tailwind theme with the following design tokens:
  - Background: `#0a0a0f`
  - Surface (panels): `#0f1117` with `rgba(255,255,255,0.05)` glassmorphism overlay
  - Primary accent: cyan (`#06b6d4`)
  - Secondary accent: blue (`#3b82f6`)
  - Destructive: red (`#ef4444`)
  - Text primary: `#e2e8f0`
  - Text muted: `#64748b`
- The system shall load JetBrains Mono from Google Fonts and apply it as the sole font family
  across the entire application.
- The system shall apply the deep space background color to the root `<html>` and `<body>` elements.
- The build shall pass `make type-check`, `make lint`, and `make test:run` with no errors.

**Proof Artifacts:**

- Screenshot: App root rendered in browser at `http://localhost:3000` shows dark background with no
  MUI artifacts, demonstrating successful library swap.
- CLI: `make type-check && make lint` exits 0, demonstrating clean TypeScript and lint state.

---

### Unit 2: Full-Screen Canvas + HUD Shell

**Purpose:** Restructure the app layout so the canvas fills the entire viewport and a HUD shell
(top bar + empty panel slots) floats on top. Rover functionality remains intact — only the layout
structure changes.

**Functional Requirements:**

- The system shall render the existing 2D canvas grid at `100vw × 100vh` with no scrollbars.
- The system shall render a fixed top bar (height 48px) overlaid on the canvas containing:
  - Left: Application title "MISSION CONTROL" in uppercase, JetBrains Mono, cyan accent color,
    letter-spacing widened.
  - Right: A connection status indicator (green dot + "CONNECTED" or red dot + "DISCONNECTED")
    that reflects whether the API is reachable.
- The system shall render a collapsible Rover Fleet panel anchored to the left edge of the
  viewport, below the top bar, as a semi-transparent dark surface panel.
- The system shall render a Mission HQ panel anchored to the right edge of the viewport, below the
  top bar, as a semi-transparent dark surface panel.
- All HUD panels shall use `backdrop-filter: blur(12px)` and a subtle border
  (`border: 1px solid rgba(255,255,255,0.08)`) to visually separate them from the canvas.
- The system shall use a `ResizeObserver` in `RoverGrid` to dynamically match the canvas
  dimensions to the viewport whenever the window is resized.
- The canvas shall remain fully interactive (pan/zoom behaviors preserved) when the user is not
  interacting with a HUD panel.

**Proof Artifacts:**

- Screenshot: Full-browser view at `http://localhost:3000` shows canvas edge-to-edge with top bar,
  left panel slot, and right panel slot overlaid, demonstrating the HUD shell layout.
- Test: `RoverGrid` unit test passes, demonstrating the canvas component renders correctly in the
  new layout.

---

### Unit 3: Rover Fleet Panel

**Purpose:** Populate the left HUD panel with rover cards so operators can scan fleet status and
select a rover at a glance.

**Functional Requirements:**

- The system shall display one card per rover in the Rover Fleet panel.
- Each rover card shall display:
  - A color swatch (12×12px filled circle) using the rover's assigned color.
  - The rover ID (e.g., `ROV-01`) in monospace, truncated if necessary.
  - Coordinates displayed as `X: ## Y: ##` in muted text.
  - Cardinal direction displayed as a single uppercase letter (`N`, `S`, `E`, `W`) with a cyan
    accent color.
- The selected rover card shall have a cyan left border (`border-l-2 border-cyan-400`) and a
  slightly lighter background to indicate active selection.
- The user shall be able to click any rover card to select it as the active rover.
- The panel shall include an "Add Rover" button (+ icon, ghost variant) at the bottom that creates
  a new rover at a random position.
- The panel shall include a "Delete" icon button on the selected rover card that removes that rover.
- The panel header shall display "FLEET" in uppercase with the rover count as a muted badge
  (e.g., `FLEET  3`).

**Proof Artifacts:**

- Screenshot: Rover Fleet panel showing two or more rover cards with color swatches, coordinates,
  and direction letters, demonstrating the compact card layout.
- Test: `RoverList` unit test verifies rover cards render with correct coordinate and direction
  data, the selected card has the active style, and clicking a card fires the selection callback.

---

### Unit 4: Mission HQ Panel (Command Input)

**Purpose:** Populate the right HUD panel with the active rover's command interface — directional
pad, command string input, and execution controls.

**Functional Requirements:**

- The system shall display the selected rover's ID and current status (`X: ## Y: ## | DIR: N`) in
  the Mission HQ panel header.
- The system shall render a directional pad with four buttons arranged in a cross/diamond layout:
  - Top center: `↑ FWD` — sends command `f`
  - Bottom center: `↓ BWD` — sends command `b`
  - Left center: `← L` — sends command `l`
  - Right center: `→ R` — sends command `r`
- Each directional button shall be a square icon button (48×48px) using the shadcn/ui `Button`
  component with an outline variant, styled with cyan hover state.
- The system shall render a text input field below the directional pad that accepts a command string
  (e.g., `fflbr`), limited to 20 characters, accepting only `f`, `b`, `l`, `r` (case-insensitive,
  invalid characters stripped on input).
- The system shall render an "Execute" button that submits the command string to the API.
- When no rover is selected, the Mission HQ panel shall display a "Select a rover" placeholder
  state and all controls shall be disabled.
- The system shall display a shadcn/ui Toast notification at the bottom of the screen when:
  - A command sequence completes successfully (success variant).
  - An obstacle is detected (warning variant, showing obstacle coordinates).
  - An API error occurs (destructive variant).

**Proof Artifacts:**

- Screenshot: Mission HQ panel showing directional pad, command input, and execute button for a
  selected rover, demonstrating the full command interface.
- Test: `RoverControls` unit test verifies the directional pad buttons each fire the correct single
  command, the text input strips invalid characters, and the execute button submits the command
  string.
- Test: Toast notification appears with correct variant when obstacle detection response is
  received from the API mock.

---

## Non-Goals (Out of Scope)

1. **3D rendering**: The canvas remains the existing 2D HTML5 canvas. The 3D scene is Spec 02.
2. **Animations and transitions**: Framer Motion and movement animations are Spec 03.
3. **Responsive/mobile layout**: The HUD layout targets desktop viewport widths (≥1024px) only.
4. **Obstacle placement UI**: The existing obstacle creation behavior is preserved but not
   redesigned beyond the toast notification reskin.
5. **Keyboard shortcuts**: Arrow key or hotkey bindings for the directional pad are out of scope.
6. **User authentication or persistence**: No login, sessions, or local storage.

## Design Considerations

**Theme tokens (Tailwind CSS custom config):**

```
background:   #0a0a0f
surface:      #0f1117
panel-border: rgba(255, 255, 255, 0.08)
accent-cyan:  #06b6d4   (cyan-500)
accent-blue:  #3b82f6   (blue-500)
text:         #e2e8f0   (slate-200)
text-muted:   #64748b   (slate-500)
destructive:  #ef4444   (red-500)
```

**HUD Panel dimensions:**

- Rover Fleet panel: 240px wide, full height minus top bar
- Mission HQ panel: 280px wide, full height minus top bar
- Top bar: 48px tall, full width

**Directional pad layout (cross pattern):**

```
      [↑ FWD]
[← L]         [→ R]
      [↓ BWD]
```

**shadcn/ui components to install:** `button`, `card`, `input`, `badge`, `toast`, `separator`,
`tooltip`

## Repository Standards

- **Commits**: Conventional commits enforced by commitlint. Type must be one of `feat`, `fix`,
  `refactor`, `test`, `chore`, `style`. Subject lowercase, imperative mood.
  Example: `feat(rover-fleet): add rover card component with status display`
- **Code style**: Prettier (no semicolons, single quotes, trailing comma es5, 100 char print width)
  enforced via pre-commit hook.
- **Linting**: ESLint flat config with TypeScript strict rules. No unused variables or parameters.
- **TypeScript**: Strict mode. No `any` types. All props and function signatures fully typed.
- **Testing**:
  - Unit tests in `src/components/__tests__/` using Vitest + Testing Library.
  - Prefer accessible queries (`getByRole`, `getByLabelText`) over DOM selectors.
  - Use `data-testid` for structural elements that have no accessible role.
  - Mock API calls with `vi.mock()` and `vi.mocked()`.
  - E2E tests in `tests/` using Playwright with `page.route()` for API interception.
- **File structure**: Components in `src/components/`, API calls in `src/api/`, types
  in `src/types/` (if needed).
- **Pre-commit**: Running `make test:run` before commit is enforced via husky. All tests must pass.

## Technical Considerations

- **shadcn/ui installation**: Uses the CLI (`npx shadcn@latest init`). Components are copied into
  `src/components/ui/` and are fully owned — not a node_modules dependency.
- **Tailwind CSS v4**: Configuration via `tailwind.config.ts` and PostCSS. Requires
  `tailwindcss`, `postcss`, `autoprefixer` as dev dependencies.
- **MUI removal**: Remove `@mui/material`, `@mui/icons-material`, `@emotion/react`,
  `@emotion/styled`, `@fontsource/roboto` from `package.json`. Update `main.tsx` to remove
  `CssBaseline` and `ThemeProvider`.
- **JetBrains Mono**: Load via `@fontsource/jetbrains-mono` npm package (consistent with how
  Roboto was loaded) and import in `main.tsx`.
- **Canvas mock**: The existing `canvas` mock in `src/test/setup.ts` must be preserved for
  the `RoverGrid` unit tests.
- **Vite chunk splitting**: Remove MUI vendor chunk from `vite.config.ts`. Add a shadcn/ui
  vendor chunk entry if bundle size warrants it.
- **Tailwind + CSS Modules**: No CSS Modules. All styling via Tailwind utility classes and the
  `cn()` helper from shadcn/ui (`clsx` + `tailwind-merge`).

## Security Considerations

No specific security considerations for this spec. No new API endpoints, authentication, or
sensitive data handling is introduced. The existing `/api/*` proxy to the backend is unchanged.

## Success Metrics

1. **Zero MUI dependencies**: `npm ls @mui/material` returns nothing after the migration.
2. **All tests pass**: `make test:run` and `make test:e2e` exit 0 with no skipped tests.
3. **Type-safe**: `make type-check` exits 0 with no TypeScript errors.
4. **Lint-clean**: `make lint` exits 0 with no ESLint warnings or errors.
5. **Bundle size neutral or smaller**: Production build bundle is no larger than the pre-migration
   build (MUI is large; shadcn/ui + Tailwind should be smaller).

## Open Questions

No open questions at this time.

~~1. Should the Rover Fleet panel be collapsible?~~
**Resolved:** Always visible. No toggle or animation in this spec.

~~2. Should the canvas resize dynamically?~~
**Resolved:** Yes — `RoverGrid` shall use a `ResizeObserver` to match the canvas dimensions to
the viewport at all times. The canvas mock in `src/test/setup.ts` must be updated to account for
the resize behavior.
