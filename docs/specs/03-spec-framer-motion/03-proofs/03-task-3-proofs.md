# 03 Task 3.0 Proof Artifacts — Fleet List AnimatePresence and Full Test Coverage

## Files Changed

- `src/test/setup.ts` — global `vi.mock('framer-motion', ...)` added; `makeMotion` creates
  `React.forwardRef` components with `displayName = motion.${tag}` to satisfy `react/display-name`
  lint rule; strips framer-specific props via `MOTION_PROPS` Set before passing to plain HTML elements
- `src/components/RoverList.tsx` — rover cards list wrapped in `<AnimatePresence>`; each card
  wrapped in `<motion.div key={rover.id} layout initial={{ opacity: 0, height: 0 }}
animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>`

## Global framer-motion Mock

Added to bottom of `src/test/setup.ts`:

```ts
vi.mock('framer-motion', async () => {
  const React = await import('react')
  const MOTION_PROPS = new Set([
    'animate', 'initial', 'exit', 'transition', 'variants', 'whileTap',
    'whileHover', 'whileFocus', 'whileInView', 'layout', 'layoutId',
  ])
  const makeMotion = (tag: string) => {
    const Component = React.forwardRef(
      ({ children, ...props }: Record<string, unknown>, ref: unknown) => {
        const domProps = Object.fromEntries(
          Object.entries(props).filter(([k]) => !MOTION_PROPS.has(k))
        )
        return React.createElement(tag, { ...domProps, ref }, children as React.ReactNode)
      }
    )
    Component.displayName = `motion.${tag}`
    return Component
  }
  return {
    motion: { div: makeMotion('div'), span: makeMotion('span'), button: makeMotion('button'), ... },
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() }),
    ...
  }
})
```

Note: `displayName` assignment required to fix `react/display-name` ESLint error.

## AnimatePresence Fleet List

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
      <RoverCard rover={rover} isSelected={rover.id === selectedRoverId} ... />
    </motion.div>
  ))}
</AnimatePresence>
```

The `key` prop moves from `RoverCard` to the `motion.div` wrapper so `AnimatePresence` can track
enter/exit. Tests pass because the global mock renders `motion.div` as a plain `div` and
`AnimatePresence` renders children directly.

## CLI Output: Unit Tests (final run)

```
> mars-rover-app@0.0.0 test:run
> vitest run

 ✓ src/services/__tests__/roverApi.test.ts  (29 tests)
 ✓ src/components/__tests__/TopBar.test.tsx  (3 tests)
 ✓ src/components/__tests__/MarsScene.test.tsx  (5 tests)
 ✓ src/components/__tests__/RoverList.test.tsx  (8 tests)
 ✓ src/components/__tests__/RoverControls.test.tsx  (8 tests)
 ✓ src/App.test.tsx  (11 tests)

 Test Files  6 passed (6)
      Tests  64 passed (64)
   Duration  1.49s
```

## CLI Output: Lint

```
> mars-rover-app@0.0.0 lint
> eslint src

(no errors or warnings)
```

## CLI Output: Production Build

```
> mars-rover-app@0.0.0 build
> tsc && vite build

✓ 1056 modules transformed.

dist/assets/index-BunlhliZ.js          106.57 kB │ gzip:  29.26 kB
dist/assets/vendor-framer-GJq1gW6a.js  127.61 kB │ gzip:  42.60 kB
dist/assets/vendor-react-am3vsJOy.js   312.00 kB │ gzip:  96.28 kB
dist/assets/vendor-three-BfnKRtf8.js   991.39 kB │ gzip: 270.52 kB
✓ built in 3.00s
```

`vendor-framer` chunk confirmed present. TypeScript compiles cleanly (tsc --noEmit passes in
pre-commit hook). All 64 tests pass with the global mock active.
