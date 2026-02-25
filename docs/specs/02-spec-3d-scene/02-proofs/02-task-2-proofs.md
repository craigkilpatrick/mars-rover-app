# 02 Task 2.0 Proof Artifacts — Rover Meshes, Obstacle Meshes, and Selection Highlight

## Files Created

- `src/components/RoverMesh.tsx` — box body + turret compound mesh with direction rotation and emissive selection glow
- `src/components/ObstacleMesh.tsx` — icosahedron rock mesh with per-obstacle scale variation

## CLI Output: Unit Tests

```
> mars-rover-app@0.0.0 test:run
> vitest run

 ✓ src/services/__tests__/roverApi.test.ts  (29 tests)
 ✓ src/components/__tests__/RoverGrid.test.tsx  (6 tests)
 ✓ src/components/__tests__/TopBar.test.tsx  (3 tests)
 ✓ src/components/__tests__/RoverList.test.tsx  (8 tests)
 ✓ src/components/__tests__/RoverControls.test.tsx  (8 tests)
 ✓ src/App.test.tsx  (11 tests)

 Test Files  6 passed (6)
      Tests  65 passed (65)
   Duration  2.99s
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

✓ 658 modules transformed.

dist/assets/index-C_H4Lonp.js                                   102.24 kB │ gzip:  28.57 kB
dist/assets/vendor-react-am3vsJOy.js                            312.00 kB │ gzip:  96.28 kB
dist/assets/vendor-three-D9ZlQqFL.js                            991.37 kB │ gzip: 269.17 kB
✓ built in 2.71s
```

## Coordinate Mapping

`toWorld(n) = n - 49.5` maps game coordinates 0–99 to world space −49.5…+49.5, centering the grid at the scene origin.

## RoverMesh Design

- `<group>` at `(toWorld(x), 0.2, toWorld(y))` with `rotation.y` per direction
  - `N=0`, `S=Math.PI`, `E=-Math.PI/2`, `W=Math.PI/2`
- Box body: `<boxGeometry args={[0.8, 0.4, 0.8]} />`
- Turret: `<boxGeometry args={[0.35, 0.25, 0.5]} />` at `position={[0, 0.32, 0.15]}`
- Selected rover: `emissiveIntensity={0.6}` on body material

## ObstacleMesh Design

- `<icosahedronGeometry args={[0.5, 0]} />` at `(toWorld(x), 0.4, toWorld(y))`
- Scale varies by `obstacle.id % 5`: `0.8 + (id % 5) * 0.08` (range 0.80–1.12)

## Verification

- 65/65 unit tests pass with no regressions
- `vendor-three` chunk present (991 kB / 269 kB gzipped)
- TypeScript compilation clean
- Browser: rovers render at correct world positions with direction rotation; selected rover shows emissive glow; obstacles render as varied icosahedron rocks
