# 03 Tasks — Framer Motion Animations

## Relevant Files

- `src/App.tsx` — Replace loading div with animated spinner; update `handleSendCommands` to return the command result.
- `src/components/RoverControls.tsx` — Add command result state, Execute button spring + glow, shake animation on obstacle, position odometer.
- `src/components/DirectionalPad.tsx` — Convert D-pad buttons to `motion.button` with spring press.
- `src/components/RoverList.tsx` — Wrap rover cards in `AnimatePresence` + `motion.div` for animated add/remove.
- `src/components/__tests__/RoverControls.test.tsx` — Update `mockOnSendCommands` to return a resolved Promise since the prop now returns `Promise`.
- `src/test/setup.ts` — Add global `vi.mock('framer-motion', ...)` so all tests get plain HTML elements instead of motion components.
- `vite.config.ts` — Add `'vendor-framer': ['framer-motion']` to `manualChunks`.
- `package.json` — Updated by `npm install framer-motion`.

### Notes

- Unit tests are in `src/components/__tests__/`. Run with `npm run test:run`.
- Run e2e tests with `npm run test:e2e`.
- The global `framer-motion` mock in `setup.ts` must strip framer-specific props (`animate`, `initial`, `exit`, `transition`, `whileTap`, `layout`, etc.) before passing the rest to the underlying HTML element so React doesn't warn about unknown DOM props.
- Conventional commits: lowercase subject, `feat:` prefix, body lines ≤ 100 characters.
- Quality gates before each parent task commit: `npm run lint && npm run format && npm run test:run && npm run build`.

## Tasks

### [x] 1.0 Install Framer Motion and Animated Loading Screen

Install `framer-motion` as a dependency, wire it into the Vite chunk config, and replace the static "Loading..." div with an animated pulsing spinner. This is the first visible animation in the app and confirms Framer Motion is correctly integrated.

#### 1.0 Proof Artifact(s)

- Screenshot: Browser showing the animated spinner during app load (before API data returns) demonstrates the loading animation is live.
- CLI: `npm run build` output showing a `vendor-framer` chunk present demonstrates Framer Motion is correctly split from the main bundle.
- CLI: `npm run test:run` showing all tests pass demonstrates no regressions from the install.

#### 1.0 Tasks

- [x] 1.1 Install Framer Motion: `npm install framer-motion`. Confirm it appears in `package.json` `dependencies`.
- [x] 1.2 In `vite.config.ts`, add `'vendor-framer': ['framer-motion']` to the `manualChunks` object inside `build.rollupOptions.output` so Framer Motion is split into its own bundle.
- [x] 1.3 In `App.tsx`, replace the loading return block:
  ```tsx
  if (loading) {
    return <div data-testid="loading">Loading...</div>
  }
  ```
  with an animated spinner. Import `motion` from `framer-motion`. The new loading block should render a full-screen centered `<div data-testid="loading">` containing:
  - A `<motion.div>` outer wrapper with `initial={{ opacity: 0 }}` and `animate={{ opacity: 1 }}` for fade-in.
  - Inside, a `<motion.div>` spinner element styled as a 32×32px circle with a visible cyan border on one side only (e.g., `border-2 border-transparent border-t-cyan-400 rounded-full`), animated with `animate={{ rotate: 360 }}` and `transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}`.
  - A small text label below the spinner (e.g., `<span>Initializing...</span>`) in the existing muted slate color `#64748b` with `font-mono text-xs`.
- [x] 1.4 Run `npm run lint && npm run test:run && npm run build`. Confirm lint is clean, all 64 tests pass, and `vendor-framer` chunk appears in the build output.

---

### [x] 2.0 Command Feedback Animations

Add spring press feedback to the Execute button and all four directional pad buttons. Track command result state (`idle | success | obstacle`) in `RoverControls` and animate the Execute button border with a cyan glow on success and a red glow on obstacle, returning to default after 800 ms. Trigger a horizontal shake on the command input area when an obstacle is detected. Animate the X, Y, and DIR position values with an odometer slide effect whenever rover coordinates change.

#### 2.0 Proof Artifact(s)

- Screenshot/recording: Execute button visibly compresses on tap and border glows cyan after a successful command demonstrates spring + success glow works.
- Screenshot/recording: Command input shakes and Execute button glows red when an obstacle is detected demonstrates obstacle feedback animations work.
- Screenshot/recording: X and Y values slide upward like an odometer after a move command demonstrates the position readout animation.
- CLI: `npm run test:run` showing all tests pass demonstrates no regressions in `RoverControls.test.tsx` or `App.test.tsx`.

#### 2.0 Tasks

- [x] 2.1 Update the `onSendCommands` prop type in `RoverControls.tsx`. Change `RoverControlsProps`:

  ```ts
  // Before
  onSendCommands: (commands: Command[]) => void
  // After
  onSendCommands: (commands: Command[]) => Promise<{ obstacleDetected?: boolean } | void>
  ```

  In `App.tsx`, update `handleSendCommands` to return the result. In the `try` block, return `{ obstacleDetected: result.obstacleDetected }` after handling the toasts. In the `catch` block, return `undefined` (or nothing). This allows `RoverControls` to read the outcome without knowing about toasts.

- [x] 2.2 Update `RoverControls.test.tsx` to match the new async signature. Change:

  ```ts
  const mockOnSendCommands = vi.fn()
  ```

  to:

  ```ts
  const mockOnSendCommands = vi.fn().mockResolvedValue(undefined)
  ```

  Run `npm run test:run` and confirm all existing 8 `RoverControls` tests still pass.

- [x] 2.3 Add `commandResult` state to `RoverControls.tsx`. Import `useState` (already imported). Add:

  ```ts
  const [commandResult, setCommandResult] = useState<'idle' | 'success' | 'obstacle'>('idle')
  ```

  Update `handleExecute` to call `setCommandString('')` synchronously (before the async result), then chain `.then()` on `onSendCommands(...)` to set state:

  ```ts
  const handleExecute = () => {
    if (!commandString) return
    const commands = commandString.split('') as Command[]
    setCommandString('')
    onSendCommands(commands).then(result => {
      const outcome = result?.obstacleDetected ? 'obstacle' : 'success'
      setCommandResult(outcome)
      setTimeout(() => setCommandResult('idle'), 800)
    })
  }
  ```

- [x] 2.4 Convert the Execute button in `RoverControls.tsx` to `motion.button`. Import `motion` from `framer-motion`. Replace `<button data-testid="execute-btn" ...>` with `<motion.button data-testid="execute-btn" ...>`. Add these Framer Motion props:

  - `whileTap={{ scale: 0.93 }}` with `transition={{ type: 'spring', stiffness: 400, damping: 17 }}` for the spring press.
  - `animate={{ borderColor: commandResult === 'success' ? '#06b6d4' : commandResult === 'obstacle' ? '#ef4444' : 'rgba(255,255,255,0.15)' }}` for the glow. Remove the static `borderColor` from the `style` prop since `animate` now drives it.

- [x] 2.5 Convert all four `<button>` elements in `DirectionalPad.tsx` to `motion.button`. Import `motion` from `framer-motion`. Add `whileTap={{ scale: 0.93 }}` and `transition={{ type: 'spring', stiffness: 400, damping: 17 }}` to all four directional buttons (forward, backward, turn left, turn right). Keep all existing `aria-label`, `disabled`, `onClick`, `className`, and `style` props unchanged.

- [x] 2.6 Add the shake animation to the command input area in `RoverControls.tsx`. Import `useAnimation` from `framer-motion`. Create `const shakeControls = useAnimation()`. Wrap the `<div className="flex flex-col gap-2 px-1">` that contains the `<input>` and execute button with `<motion.div animate={shakeControls}>`. Add a `useEffect` that triggers the shake when an obstacle is detected:

  ```ts
  useEffect(() => {
    if (commandResult === 'obstacle') {
      shakeControls.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.35 } })
    }
  }, [commandResult, shakeControls])
  ```

- [x] 2.7 Add the odometer effect to the position readout in `RoverControls.tsx`. Import `AnimatePresence` from `framer-motion`. Replace the single `<span data-testid="rover-position">X: {rover.x} Y: {rover.y} | DIR: {rover.direction}</span>` with a container that keeps `data-testid="rover-position"` but animates each value individually:

  ```tsx
  <div
    data-testid="rover-position"
    className="font-mono text-xs flex items-center gap-0"
    style={{ color: '#64748b', overflow: 'hidden' }}
  >
    <span>X:&nbsp;</span>
    <AnimatePresence mode="wait">
      <motion.span
        key={`x-${rover.x}`}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.15 }}
        style={{ display: 'inline-block' }}
      >
        {rover.x}
      </motion.span>
    </AnimatePresence>
    <span>&nbsp;Y:&nbsp;</span>
    <AnimatePresence mode="wait">
      <motion.span
        key={`y-${rover.y}`}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.15 }}
        style={{ display: 'inline-block' }}
      >
        {rover.y}
      </motion.span>
    </AnimatePresence>
    <span>&nbsp;| DIR:&nbsp;</span>
    <AnimatePresence mode="wait">
      <motion.span
        key={`dir-${rover.direction}`}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.15 }}
        style={{ display: 'inline-block' }}
      >
        {rover.direction}
      </motion.span>
    </AnimatePresence>
  </div>
  ```

  Note: The existing test checks `toHaveTextContent('X: 5 Y: 10 | DIR: N')` — the text content of the container element still includes all these values, so the test should continue to pass.

- [x] 2.8 Run `npm run lint && npm run test:run && npm run build`. Confirm all tests pass and the build is clean.

---

### [ ] 3.0 Fleet List AnimatePresence and Full Test Coverage

Wrap the rover card list in `AnimatePresence` so cards animate in with a fade+height expand and animate out with a fade+height collapse, with `layout` prop for smooth reflow. Add a global `framer-motion` mock to `src/test/setup.ts` so all `motion.*` elements render as plain HTML and `AnimatePresence` passes children through — keeping the full test suite fast and predictable. Verify all unit tests and the Playwright e2e suite pass, and confirm a clean production build.

#### 3.0 Proof Artifact(s)

- Screenshot/recording: Fleet panel showing a rover card smoothly collapsing and remaining cards reflowing when one is deleted demonstrates AnimatePresence + layout animation works.
- CLI: `npm run test:run` output showing all tests pass (including `RoverList.test.tsx`) demonstrates the global framer-motion mock works and no regressions exist.
- CLI: `npm run build` output showing clean production build with `vendor-framer` chunk present demonstrates production readiness.

#### 3.0 Tasks

- [ ] 3.1 Add the global `framer-motion` mock to `src/test/setup.ts`. Add the following at the bottom of the file. The mock factory uses `async` to import React so it can create forwarded-ref components. It strips all framer-motion-specific props before passing remaining props to the plain HTML element:

  ```ts
  vi.mock('framer-motion', async () => {
    const React = await import('react')
    const MOTION_PROPS = new Set([
      'animate',
      'initial',
      'exit',
      'transition',
      'variants',
      'whileTap',
      'whileHover',
      'whileFocus',
      'whileInView',
      'layout',
      'layoutId',
    ])
    const makeMotion = (tag: string) =>
      React.forwardRef(({ children, ...props }: Record<string, unknown>, ref: unknown) => {
        const domProps = Object.fromEntries(
          Object.entries(props).filter(([k]) => !MOTION_PROPS.has(k))
        )
        return React.createElement(tag, { ...domProps, ref }, children as React.ReactNode)
      })
    return {
      motion: {
        div: makeMotion('div'),
        span: makeMotion('span'),
        button: makeMotion('button'),
        p: makeMotion('p'),
        ul: makeMotion('ul'),
        li: makeMotion('li'),
      },
      AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
      useAnimation: () => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() }),
      useMotionValue: (initial: unknown) => ({ get: () => initial, set: vi.fn() }),
      useTransform: vi.fn(),
      MotionConfig: ({ children }: { children: React.ReactNode }) => children,
    }
  })
  ```

- [ ] 3.2 Run `npm run test:run` immediately after adding the mock to confirm all existing 64 tests still pass. Fix any issues before continuing.

- [ ] 3.3 In `RoverList.tsx`, add the `AnimatePresence` fleet list animation. Import `AnimatePresence` and `motion` from `framer-motion`. Wrap the existing rover cards list (inside `<div className="flex-1 overflow-y-auto flex flex-col gap-1">`) with `<AnimatePresence>`. Replace each `<RoverCard key={rover.id} .../>` with a `motion.div` wrapper:

  ```tsx
  <AnimatePresence>
    {rovers.map(rover => (
      <motion.div
        key={rover.id}
        layout
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        style={{ overflow: 'hidden' }}
      >
        <RoverCard
          rover={rover}
          isSelected={rover.id === selectedRoverId}
          onSelect={onSelectRover}
          onDelete={onDeleteRover}
        />
      </motion.div>
    ))}
  </AnimatePresence>
  ```

  The `key` moves from `RoverCard` to the `motion.div` wrapper so `AnimatePresence` can track enter/exit.

- [ ] 3.4 Run `npm run test:run` and confirm all tests pass. The existing `RoverList.test.tsx` tests (`rover-card-1`, `rover-card-2`, selection style, etc.) should still pass because the global mock renders `motion.div` as a plain `div` and `AnimatePresence` passes children through.

- [ ] 3.5 Run `npm run lint && npm run format && npm run build`. Confirm clean lint (no errors or warnings), clean TypeScript compile, and `vendor-framer` chunk present in `dist/assets/`.
