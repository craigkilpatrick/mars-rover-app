# 02 Tasks — 3D Scene

## Relevant Files

- `src/components/MarsScene.tsx` - New R3F scene component replacing `RoverGrid`; accepts identical props (`rovers`, `obstacles`, `selectedRoverId`)
- `src/components/RoverMesh.tsx` - Sub-component: compound mesh (box body + turret) for a single rover with direction rotation and emissive selection glow
- `src/components/ObstacleMesh.tsx` - Sub-component: icosahedron rock mesh for a single obstacle
- `src/components/RoverGrid.tsx` - Existing 2D canvas component to be deleted when `MarsScene` replaces it
- `src/components/__tests__/MarsScene.test.tsx` - Unit tests for the new `MarsScene` component
- `src/components/__tests__/RoverGrid.test.tsx` - Existing test file to be deleted (replaced by `MarsScene.test.tsx`)
- `src/App.tsx` - Swap `RoverGrid` import and JSX element for `MarsScene`; props stay identical
- `src/test/setup.ts` - Existing test setup; canvas 2D mock stays in place; no changes required if R3F is mocked at the test-file level
- `src/types/rover.ts` - Existing type definitions (`Rover`, `Obstacle`, `Direction`) used by new components
- `vite.config.ts` - Add `vendor-three` chunk to `manualChunks`; increase `chunkSizeWarningLimit`
- `package.json` - New dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`
- `tests/rover.spec.ts` - Playwright e2e: update "should display grid" test to use `data-testid="mars-scene"` instead of `data-testid="rover-grid"`

### Notes

- Unit tests are placed alongside source files in `src/components/__tests__/`
- Run unit tests with `npm run test:run`; run e2e tests with `npm run test:e2e`
- `@react-three/fiber` and `@react-three/drei` should be mocked at the test-file level in `MarsScene.test.tsx` (not globally in `setup.ts`) to avoid affecting other tests
- Follow conventional commits: lowercase subject, type prefix (`feat:`, `chore:`, `test:`)
- Quality gates before each parent task commit: `npm run lint && npm run format && npm run test:run && npm run build`

## Tasks

### [x] 1.0 Mars Scene Foundation

Install R3F dependencies and stand up a working 3D scene in the app: Mars surface plane with procedural color variation, `<Grid>` helper for coordinate readability, gently drifting `<Stars>`, warm Martian directional + ambient lighting, and `OrbitControls` defaulting to a top-down camera. `RoverGrid` is replaced in `App.tsx` at this point — the scene renders with no game objects yet.

#### 1.0 Proof Artifact(s)

- Screenshot: Browser at `http://localhost:3000` showing the 3D Mars surface plane with grid lines, stars, and Martian lighting visible — no rover or obstacle meshes — demonstrates scene foundation is in place
- CLI: `npm run build` output showing successful build with `vendor-three` chunk present demonstrates R3F integrates cleanly with Vite

#### 1.0 Tasks

- [x] 1.1 Install runtime dependencies: `npm install three @react-three/fiber @react-three/drei`
- [x] 1.2 Install dev dependency: `npm install -D @types/three`
- [x] 1.3 Update `vite.config.ts`: add `'vendor-three': ['three', '@react-three/fiber', '@react-three/drei']` to `manualChunks`; increase `chunkSizeWarningLimit` to `1500` to accommodate the Three.js bundle
- [x] 1.4 Create `src/components/MarsScene.tsx` as a shell R3F component: outer `<div>` wrapper with `data-testid="mars-scene"` and `className="absolute inset-0"`, containing an R3F `<Canvas>` that fills the div; accept props `rovers: Rover[]`, `obstacles: Obstacle[]`, `selectedRoverId: number | null` (same interface as `RoverGrid`)
- [x] 1.5 Add the Mars surface plane inside `<Canvas>`: `<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>` with `<planeGeometry args={[100, 100]} />` and `<meshStandardMaterial color="#c1440e" roughness={0.9} metalness={0.1} />`
- [x] 1.6 Add the `<Grid>` helper from `@react-three/drei` directly above the surface plane (`position={[0, 0.01, 0]}`); set `args={[100, 100]}`, `cellColor="#8B3A00"`, `sectionColor="#6B2A00"`, and `fadeDistance={200}` so grid lines are visible but subtle
- [x] 1.7 Add `<Stars>` from `@react-three/drei` with `radius={200}`, `depth={60}`, `count={3000}`, `factor={4}`; wrap it in a `<group>` ref and use `useFrame((_, delta) => { starsRef.current.rotation.y += delta * 0.02 })` for a gentle continuous drift
- [x] 1.8 Add scene lighting inside `<Canvas>`: `<ambientLight color="#331100" intensity={0.5} />` and `<directionalLight color="#ff9944" intensity={1.5} position={[30, 60, 20]} castShadow />`
- [x] 1.9 Add `<OrbitControls>` from `@react-three/drei`; set the initial camera position in `<Canvas camera={{ position: [0, 100, 0.001], fov: 60 }}>` for a near-top-down default view with OrbitControls allowing free rotation, pan, and zoom
- [x] 1.10 In `App.tsx`, replace `import RoverGrid from './components/RoverGrid'` with `import MarsScene from './components/MarsScene'` and rename `<RoverGrid ...>` to `<MarsScene ...>` (props are identical: `rovers`, `obstacles`, `selectedRoverId`)
- [x] 1.11 Run `npm run lint && npm run build` and confirm no errors; verify `vendor-three` chunk appears in build output

---

### [x] 2.0 Rover Meshes, Obstacle Meshes, and Selection Highlight

Add `RoverMesh` and `ObstacleMesh` sub-components to the scene. Each rover renders as a box body + directional turret, correctly rotated for N/S/E/W. Each obstacle renders as an icosahedron rock. All game objects are placed at their correct world positions mapped from game coordinates. The selected rover shows an emissive glow.

#### 2.0 Proof Artifact(s)

- Screenshot: Browser at `http://localhost:3000` with two or more rover meshes and at least one obstacle rock visible at their correct positions, with the selected rover clearly glowing — demonstrates game-state-to-3D mapping works
- CLI: `npm run test:run` output showing all existing tests still pass demonstrates no regressions

#### 2.0 Tasks

- [x] 2.1 Define a coordinate mapping helper inside `MarsScene.tsx`: `const toWorld = (n: number) => n - 49.5` — converts game coordinate 0–99 to world space −49.5 to +49.5, centering the grid at the world origin
- [x] 2.2 Create `src/components/RoverMesh.tsx`: accept props `rover: Rover` and `isSelected: boolean`; render a `<group>` positioned at `(toWorld(rover.x), 0.2, toWorld(rover.y))` with `rotation.y` set based on direction (`N=0`, `S=Math.PI`, `E=-Math.PI/2`, `W=Math.PI/2`); inside the group, render a box body mesh (`<boxGeometry args={[0.8, 0.4, 0.8]} />`) and a turret mesh (`<boxGeometry args={[0.35, 0.25, 0.5]} />`) offset to `position={[0, 0.32, 0.15]}`
- [x] 2.3 Apply materials to `RoverMesh`: body uses `<meshStandardMaterial color={rover.color} emissive={isSelected ? rover.color : '#000000'} emissiveIntensity={isSelected ? 0.6 : 0} roughness={0.6} />`; turret uses the same color without emissive
- [x] 2.4 Create `src/components/ObstacleMesh.tsx`: accept prop `obstacle: Obstacle`; render a `<mesh>` positioned at `(toWorld(obstacle.x), 0.4, toWorld(obstacle.y))`; use `<icosahedronGeometry args={[0.5, 0]} />` with `<meshStandardMaterial color="#5c2a00" roughness={1} />`; slightly randomize scale per obstacle id (`scale={0.8 + (obstacle.id % 5) * 0.08}`) so rocks feel varied
- [x] 2.5 Wire `RoverMesh` into `MarsScene.tsx` inside `<Canvas>`: `{rovers.map(rover => <RoverMesh key={rover.id} rover={rover} isSelected={rover.id === selectedRoverId} />)}`
- [x] 2.6 Wire `ObstacleMesh` into `MarsScene.tsx` inside `<Canvas>`: `{obstacles.map(obs => <ObstacleMesh key={obs.id} obstacle={obs} />)}`
- [x] 2.7 Run `npm run test:run` to verify no regressions; visually verify rovers and obstacles render at expected positions in the browser

---

### [ ] 3.0 Smooth Movement Animation and Full Test Coverage

Add lerp/tween animation so rovers smoothly glide to new positions when commands are executed. Write `MarsScene.test.tsx` (mocking R3F at the file level), delete the now-obsolete `RoverGrid.test.tsx`, and update the Playwright e2e test to use the new `data-testid`. All unit tests pass; build is clean.

#### 3.0 Proof Artifact(s)

- CLI: `npm run test:run` output showing all tests pass (including `MarsScene.test.tsx`) demonstrates full unit test coverage
- CLI: `npm run build` output showing successful production build with no TypeScript errors demonstrates production readiness
- Screenshot: Rover mesh visibly animating (sliding) to a new position in the 3D scene after a command is sent demonstrates the lerp animation works

#### 3.0 Tasks

- [ ] 3.1 Add lerp animation to `RoverMesh.tsx`: import `useRef` from React and `useFrame` from `@react-three/fiber`; import `* as THREE` from `three`; create `const groupRef = useRef<THREE.Group>(null)` and `const targetPos = useRef(new THREE.Vector3(toWorld(rover.x), 0.2, toWorld(rover.y)))`; add `useEffect(() => { targetPos.current.set(toWorld(rover.x), 0.2, toWorld(rover.y)) }, [rover.x, rover.y])`; add `useFrame((_, delta) => { if (groupRef.current) groupRef.current.position.lerp(targetPos.current, delta * 5) })`; attach `ref={groupRef}` to the outer `<group>` and remove the static `position` prop from it (position is now managed by `useFrame`)
- [ ] 3.2 Create `src/components/__tests__/MarsScene.test.tsx`: at the top, add `vi.mock('@react-three/fiber', ...)` mapping `Canvas` to `({ children }) => <div data-testid="r3f-canvas">{children}</div>`, and mocking `useFrame` and `useThree` as `vi.fn()`; add `vi.mock('@react-three/drei', ...)` mapping `OrbitControls`, `Stars`, and `Grid` to `() => null`; also mock `../RoverMesh` and `../ObstacleMesh` as simple `<div data-testid>` stubs so tests focus on `MarsScene` structure
- [ ] 3.3 Write unit tests in `MarsScene.test.tsx` covering: (a) renders wrapper div with `data-testid="mars-scene"` without crashing; (b) renders one `RoverMesh` stub per rover in the `rovers` prop; (c) renders one `ObstacleMesh` stub per obstacle in the `obstacles` prop; (d) renders nothing when `rovers` and `obstacles` are empty arrays; (e) accepts `selectedRoverId` prop without error
- [ ] 3.4 Delete `src/components/__tests__/RoverGrid.test.tsx` (replaced by `MarsScene.test.tsx`)
- [ ] 3.5 Delete `src/components/RoverGrid.tsx` (fully replaced by `MarsScene.tsx`)
- [ ] 3.6 Update `tests/rover.spec.ts`: in the "should display grid" test, change `page.locator('[data-testid="rover-grid"]')` to `page.locator('[data-testid="mars-scene"]')` and remove the inner canvas assertion (`[data-testid="rover-grid"] canvas`); replace it with `await expect(page.locator('[data-testid="mars-scene"]')).toBeVisible()`
- [ ] 3.7 Run `npm run test:run` and confirm all tests pass with no failures
- [ ] 3.8 Run `npm run lint && npm run format && npm run build` and confirm a clean build with no TypeScript errors; verify `vendor-three` chunk is present in `dist/assets/`
