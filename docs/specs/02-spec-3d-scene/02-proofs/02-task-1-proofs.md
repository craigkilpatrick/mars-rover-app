# Task 1.0 Proof Artifacts — Mars Scene Foundation

## Task Summary

Installed React Three Fiber (v8), @react-three/drei (v9), and three.js dependencies.
Created `MarsScene.tsx` with Mars surface plane, `<Grid>` helper, drifting `<Stars>`,
warm Martian lighting, and `OrbitControls` defaulting to a top-down camera view.
Swapped `RoverGrid` for `MarsScene` in `App.tsx`. Updated ESLint config to allow
Three.js R3F properties. Updated Vite chunk config with `vendor-three`.

---

## CLI Output — Build

```
> mars-rover-app@0.0.0 build
> tsc && vite build

vite v5.1.4 building for production...
✓ 656 modules transformed.
dist/assets/index-bhkTtb-E.css                  41.85 kB │ gzip:  14.10 kB
dist/assets/index-l8V_cqpk.js                   99.41 kB │ gzip:  28.16 kB
dist/assets/vendor-react-am3vsJOy.js            312.00 kB │ gzip:  96.28 kB
dist/assets/vendor-three-QgMFEoOZ.js            995.02 kB │ gzip: 270.23 kB
✓ built in 2.83s
```

`vendor-three` chunk present — Three.js, @react-three/fiber, @react-three/drei
bundled separately from React and app code.

---

## CLI Output — Tests

```
 RUN  v1.3.1

 ✓ src/services/__tests__/roverApi.test.ts  (29 tests)
 ✓ src/components/__tests__/TopBar.test.tsx  (3 tests)
 ✓ src/components/__tests__/RoverGrid.test.tsx  (6 tests)
 ✓ src/components/__tests__/RoverList.test.tsx  (8 tests)
 ✓ src/components/__tests__/RoverControls.test.tsx  (8 tests)
 ✓ src/App.test.tsx  (11 tests)

 Test Files  6 passed (6)
      Tests  65 passed (65)
   Duration  1.65s
```

All 65 existing tests pass — no regressions from dependency install or App.tsx swap.

---

## Component Structure

### `src/components/MarsScene.tsx`

- Outer `<div data-testid="mars-scene" className="absolute inset-0">` wraps the Canvas
- `<Canvas camera={{ position: [0, 100, 0.001], fov: 60 }} shadows>` — top-down default
- `<MarsSurface />` — `PlaneGeometry(100×100)` with `MeshStandardMaterial color="#c1440e"`
- `<Grid position={[0, 0.01, 0]} args={[100, 100]} cellColor="#8B3A00" sectionColor="#6B2A00" fadeDistance={200} />`
- `<DriftingStars />` — `<Stars radius={200} depth={60} count={3000} factor={4}>` in a group that rotates at `delta * 0.02` via `useFrame`
- `<ambientLight color="#331100" intensity={0.5} />`
- `<directionalLight color="#ff9944" intensity={1.5} position={[30, 60, 20]} castShadow />`
- `<OrbitControls enableDamping dampingFactor={0.05} minDistance={5} maxDistance={200} />`

### `src/App.tsx` change

```diff
- import RoverGrid from './components/RoverGrid'
+ import MarsScene from './components/MarsScene'
...
- <RoverGrid rovers={rovers} obstacles={obstacles} selectedRoverId={selectedRoverId} />
+ <MarsScene rovers={rovers} obstacles={obstacles} selectedRoverId={selectedRoverId} />
```

### `vite.config.ts` change

```diff
  manualChunks: {
    'vendor-react': ['react', 'react-dom'],
+   'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
  },
- chunkSizeWarningLimit: 600,
+ chunkSizeWarningLimit: 1500,
```

### `eslint.config.js` change

```diff
+ 'react/no-unknown-property': 'off', // R3F uses Three.js props not known to ESLint
```

---

## Verification

- `vendor-three` chunk appears in `dist/assets/` — R3F integrated into Vite build
- 65/65 unit tests pass — no regressions
- `npm run lint` — no errors or warnings
- `npm run build` — clean TypeScript compile + Vite bundle
- `MarsScene` accepts identical props to `RoverGrid` — `App.tsx` change is a 2-line swap
