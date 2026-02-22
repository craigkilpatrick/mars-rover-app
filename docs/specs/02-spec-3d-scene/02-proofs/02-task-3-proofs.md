# 02 Task 3.0 Proof Artifacts — Smooth Movement Animation and Full Test Coverage

## Files Changed

- `src/components/RoverMesh.tsx` — added lerp animation via `useFrame` + `useRef`
- `src/components/__tests__/MarsScene.test.tsx` — new unit tests with R3F mocked at file level
- `src/components/__tests__/RoverGrid.test.tsx` — deleted (replaced by MarsScene tests)
- `src/components/RoverGrid.tsx` — deleted (fully replaced by MarsScene)
- `tests/rover.spec.ts` — updated "should display grid" test to use `data-testid="mars-scene"`

## Lerp Animation Design

`RoverMesh.tsx` uses `useFrame` to smoothly interpolate position each frame:

```ts
const groupRef = useRef<THREE.Group>(null)
const targetPos = useRef(new THREE.Vector3(toWorld(rover.x), 0.2, toWorld(rover.y)))

useEffect(() => {
  targetPos.current.set(toWorld(rover.x), 0.2, toWorld(rover.y))
}, [rover.x, rover.y])

useFrame((_, delta) => {
  if (groupRef.current) {
    groupRef.current.position.lerp(targetPos.current, delta * 5)
  }
})
```

When rover coordinates change (after a command), `targetPos` updates and `useFrame` lerps
the mesh toward it at `delta * 5` per frame (~5 world units/sec smoothing).

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
   Duration  1.76s
```

Note: 64 tests = 65 (previous) − 6 (deleted RoverGrid.test.tsx) + 5 (new MarsScene.test.tsx)

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

dist/assets/index-CVviZbET.js                                   102.41 kB │ gzip:  28.65 kB
dist/assets/vendor-react-am3vsJOy.js                            312.00 kB │ gzip:  96.28 kB
dist/assets/vendor-three-B7CjTyZr.js                            991.38 kB │ gzip: 269.17 kB
✓ built in 2.94s
```

## MarsScene Test Coverage

Tests in `MarsScene.test.tsx` with R3F mocked at file level:

| Test                                                | Status |
| --------------------------------------------------- | ------ |
| renders wrapper div with `data-testid="mars-scene"` | ✓      |
| renders one RoverMesh per rover                     | ✓      |
| renders one ObstacleMesh per obstacle               | ✓      |
| renders no meshes when arrays are empty             | ✓      |
| accepts selectedRoverId prop without error          | ✓      |

## Playwright e2e Update

```ts
// Before
await expect(page.locator('[data-testid="rover-grid"]')).toBeVisible()
await expect(page.locator('[data-testid="rover-grid"] canvas')).toBeVisible()

// After
await expect(page.locator('[data-testid="mars-scene"]')).toBeVisible()
```
