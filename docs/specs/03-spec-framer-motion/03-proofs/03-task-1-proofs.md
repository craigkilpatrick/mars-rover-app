# 03 Task 1.0 Proof Artifacts — Install Framer Motion and Animated Loading Screen

## Files Changed

- `package.json` — framer-motion added to dependencies
- `vite.config.ts` — `'vendor-framer': ['framer-motion']` added to `manualChunks`
- `src/App.tsx` — loading block replaced with animated spinner using `motion.div`

## CLI Output: package.json Dependency

```
"framer-motion": "^12.34.3"
```

Confirmed in `package.json` `dependencies` section.

## CLI Output: Unit Tests

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
   Duration  2.21s
```

## CLI Output: Production Build

```
> mars-rover-app@0.0.0 build
> tsc && vite build

vite v5.1.4 building for production...
✓ 1056 modules transformed.

dist/assets/index-DCXI1_Md.js                                   103.32 kB │ gzip:  28.79 kB
dist/assets/vendor-framer-BBxl-BP4.js                           122.73 kB │ gzip:  40.67 kB
dist/assets/vendor-react-am3vsJOy.js                            312.00 kB │ gzip:  96.28 kB
dist/assets/vendor-three-BfnKRtf8.js                            991.39 kB │ gzip: 270.52 kB
✓ built in 3.27s
```

`vendor-framer` chunk present at 122.73 kB (40.67 kB gzip).

## Animated Loading Screen Implementation

`src/App.tsx` loading block now renders:

- Full-screen centered container with `data-testid="loading"` (preserves existing test assertion)
- `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>` for fade-in wrapper
- `<motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>` for spinning arc in `border-t-cyan-400`
- `<span>Initializing...</span>` in `#64748b` muted slate with `font-mono text-xs`

## CLI Output: Lint

```
> mars-rover-app@0.0.0 lint
> eslint src

(no errors or warnings)
```
