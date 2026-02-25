# 02-spec-3d-scene.md

## Introduction/Overview

Replace the current 2D HTML5 canvas grid (`RoverGrid.tsx`) with an immersive React Three Fiber (R3F) 3D scene that renders the Mars surface, rover models, and obstacle geometry in a live WebGL viewport. The goal is to give users a visually compelling, spatially intuitive view of the rover simulation while preserving all existing API integration, state management, and test infrastructure.

## Goals

- Replace `RoverGrid.tsx` with a `MarsScene.tsx` R3F component that renders the full 3D world without changing any external props or state management
- Render a Mars surface plane with a dusty red/orange base color and a procedural noise-like texture that suggests terrain variation
- Display 3D rover models (box body + directional turret) and rock-like obstacle meshes (icosahedron geometry) at correct game coordinates
- Provide a Martian atmosphere through warm sun-like directional lighting, dim ambient fill, and a gently drifting star field background
- Allow users to freely explore the scene with orbit controls (rotate, pan, zoom) while defaulting to a readable top-down perspective
- Highlight the selected rover with an emissive glow effect and animate rover movement with a smooth lerp/tween when commands are executed
- Maintain full test coverage by adding a WebGL mock and updating all affected unit and Playwright e2e tests

## User Stories

**As a user**, I want to see my rovers and obstacles rendered in a 3D Mars environment so that the simulation feels immersive and spatially intuitive.

**As a user**, I want to orbit, rotate, and zoom the 3D scene so that I can inspect rover positions and obstacle placement from any angle.

**As a user**, I want the selected rover to glow so that I can immediately identify which rover I am controlling at a glance.

**As a user**, I want rover movement to animate smoothly so that I can follow each command's effect without abrupt position jumps.

**As a developer**, I want the 3D scene to accept the same props as `RoverGrid` so that `App.tsx` requires minimal changes and existing state management is untouched.

## Demoable Units of Work

### Unit 1: Mars Scene Foundation

**Purpose:** Stand up the R3F Canvas, Mars surface, atmosphere, and camera controls as a working scene that renders in the app — before any game objects are added.

**Functional Requirements:**

- The system shall render an R3F `<Canvas>` component that fills the full viewport behind the HUD panels (same layout position as the current `RoverGrid`)
- The system shall render a flat plane geometry as the Mars surface with a dusty red/orange (#c1440e) base color combined with a procedural noise-derived vertex or shader variation to suggest terrain texture
- The system shall render grid lines on the surface plane using the `<Grid>` helper from `@react-three/drei` so the coordinate system remains readable
- The system shall render a `<Stars>` background (from `@react-three/drei`) with custom density and a gentle continuous drift/rotation
- The system shall render a warm directional light (orange/yellow tint) positioned to simulate the Martian sun, plus a dim ambient light for shadow fill
- The system shall provide `OrbitControls` (from `@react-three/drei`) with a default top-down camera position and allow free rotation, pan, and zoom
- The system shall add `@react-three/fiber`, `@react-three/drei`, `three`, and `@types/three` as dependencies

**Proof Artifacts:**

- Screenshot: Browser at `http://localhost:3000` showing the 3D Mars surface plane with grid lines, stars background, and lighting — no rover or obstacle meshes yet — demonstrates the scene foundation is in place
- CLI: `npm run build` completes without errors demonstrates R3F integrates cleanly with the existing Vite build

### Unit 2: Rover Meshes, Obstacle Meshes, and Selection Highlight

**Purpose:** Place 3D game objects at their correct game coordinates so the scene accurately reflects the simulation state, and visually distinguish the selected rover.

**Functional Requirements:**

- The system shall render each rover as a compound mesh: a box body (rover color) with a smaller box "turret" offset on top, rotated to face the rover's current direction (N/S/E/W)
- The system shall render each obstacle as an icosahedron mesh with a dark red/brown color to represent a Mars rock
- The system shall map game coordinates (x: 0–99, y: 0–99) to 3D world positions at a scale chosen by the implementation to fit comfortably in the default camera view
- The system shall apply an emissive glow material to the selected rover's mesh, making it visually distinct from unselected rovers
- The system shall accept the same props interface as `RoverGrid`: `rovers: Rover[]`, `obstacles: Obstacle[]`, `selectedRoverId: number | null`
- The system shall update mesh positions and selection highlight reactively when props change

**Proof Artifacts:**

- Screenshot: Browser at `http://localhost:3000` with two or more rovers and at least one obstacle visible as 3D meshes at their correct positions, with the selected rover clearly glowing — demonstrates game-state-to-3D mapping works
- Test: `MarsScene.test.tsx` passes demonstrating the component renders without errors and accepts rover/obstacle/selectedRoverId props correctly

### Unit 3: Smooth Movement Animation and Full Test Coverage

**Purpose:** Make rover movement feel responsive and polished, and ensure the full test suite passes with the new 3D component in place.

**Functional Requirements:**

- The system shall animate each rover mesh to its new position using a smooth lerp/tween (via `useFrame` from `@react-three/fiber`) when the rover's game coordinates change, rather than instantly snapping to the new position
- The system shall add `jest-webgl-canvas-mock` (or a Vitest-compatible WebGL mock equivalent) to `src/test/setup.ts` so that the WebGL context is available in the jsdom test environment
- The system shall replace the existing canvas 2D mock in `src/test/setup.ts` with the WebGL mock so that `MarsScene` tests do not throw WebGL-not-available errors
- The system shall update `RoverGrid.test.tsx` (renamed/replaced as `MarsScene.test.tsx`) with tests covering: component renders without crash, correct number of rover meshes rendered, correct number of obstacle meshes rendered, selected rover prop is accepted
- The system shall update `tests/rover.spec.ts` (Playwright e2e) to remove any selectors that rely on the canvas element and add assertions that the 3D scene container is present
- The system shall pass `npm run test:run` (all Vitest unit tests) with no failures
- The system shall pass `npm run build` with no TypeScript errors

**Proof Artifacts:**

- CLI: `npm run test:run` output showing all tests pass (including `MarsScene.test.tsx`) demonstrates full unit test coverage
- CLI: `npm run build` output showing successful build with no TypeScript errors demonstrates production readiness
- Screenshot: Rover visibly moving to a new position in the 3D scene after sending a command demonstrates the lerp animation works

## Non-Goals (Out of Scope)

1. **Framer Motion animations**: UI panel transitions and command feedback animations are covered in Spec 03
2. **Imported 3D model files (.gltf/.glb)**: Rover and obstacle shapes use primitive Three.js geometry only — no asset pipeline
3. **Physics simulation**: No collision detection or physics engine; game logic remains in the API
4. **Multiplayer or real-time updates**: The scene reflects the current React state snapshot; no WebSocket or polling changes
5. **Mobile/touch orbit controls**: OrbitControls defaults are sufficient; touch optimization is not required
6. **Performance optimization for large grids**: The 100×100 grid with typical rover/obstacle counts does not require instanced meshes or LOD in this spec
7. **Custom Mars textures or image assets**: Surface appearance is achieved with geometry and material properties only

## Design Considerations

The 3D scene occupies the same full-viewport area as the current `RoverGrid` canvas — behind the fixed TopBar, RoverList (left panel), and RoverControls (right panel). The HUD layout does not change.

**Camera default:** Top-down perspective looking straight down at the surface, positioned high enough to see the full 100×100 grid. OrbitControls allow the user to tilt, rotate, and zoom freely.

**Surface aesthetic:** Dusty red/orange (#c1440e) base with procedural noise variation to break up the flat look. Subtle grid lines rendered as line geometry (or a grid helper) on top of the surface plane so coordinates remain readable.

**Rover color:** Rovers retain their existing assigned colors (from `getRoverColor(id)` in `roverApi.ts`). The turret box on top uses the same color. The selected rover's material adds an emissive property to glow in that color.

**Obstacle color:** Dark brown/red (`#5c2a00` or similar) icosahedron meshes to read as Mars rocks.

**Stars:** Rendered as the `<Stars>` component from `@react-three/drei` with higher radius and a slow continuous rotation applied via `useFrame` to create a gentle drift effect.

## Repository Standards

- **Language and types:** TypeScript throughout; all Three.js objects typed with `@types/three`
- **Component pattern:** Functional React components with hooks; `useRef`, `useFrame`, `useMemo` from R3F as appropriate
- **File organization:** New component at `src/components/MarsScene.tsx`; sub-components (e.g., `RoverMesh.tsx`, `ObstacleMesh.tsx`) in `src/components/` if needed for clarity
- **Testing:** Vitest + React Testing Library; test files alongside source in `src/components/__tests__/`; Playwright e2e in `tests/`
- **Styling:** The R3F `<Canvas>` replaces the canvas element; surrounding layout uses Tailwind CSS classes (same as current `RoverGrid` wrapper div)
- **Commit conventions:** Conventional commits (`feat:`, `fix:`, `test:`, `chore:`) with lowercase subject line
- **Quality gates:** `npm run lint`, `npm run format`, `npm run test:run`, and `npm run build` must all pass before each parent task commit
- **Build chunk:** Update `manualChunks` in `vite.config.ts` to include a `vendor-three` chunk for `three`, `@react-three/fiber`, and `@react-three/drei` to keep the main bundle size reasonable

## Technical Considerations

**New dependencies:**

- `three` — core WebGL 3D library
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — helper components (`OrbitControls`, `Stars`, `Grid`)
- `@types/three` — TypeScript type definitions for Three.js
- `jest-webgl-canvas-mock` (or `vitest-webgl-canvas-mock`) — WebGL context mock for jsdom tests; if compatibility issues arise, the fallback is to mock `@react-three/fiber`'s `Canvas` component entirely in tests

**Coordinate mapping:** Game coordinates use (x, y) on a 100×100 grid. In 3D space, x maps to the world X axis and y maps to the world Z axis (Three.js convention: Y is up). The implementation should choose a world scale (e.g., 1 unit per cell) that keeps the full grid visible at the default camera distance.

**Direction → rotation mapping:**

- N → rotation.y = 0 (turret faces positive Z / "north")
- S → rotation.y = Math.PI
- E → rotation.y = -Math.PI / 2
- W → rotation.y = Math.PI / 2

**Lerp animation:** Each rover mesh tracks a `targetPosition` ref. In the `useFrame` callback, the mesh position lerps toward `targetPosition` each frame (e.g., `mesh.position.lerp(target, 0.1)`). When props update with a new rover position, `targetPosition` is updated; the mesh animates smoothly to the new location.

**WebGL mock in tests:** The existing `src/test/setup.ts` mocks `canvas.getContext('2d')`. R3F uses `getContext('webgl')` or `getContext('webgl2')`. Adding `jest-webgl-canvas-mock` (which also works with Vitest) to the setup file resolves this. The 2D canvas mock may remain alongside it.

**Vite chunk splitting:** Three.js is large (~600KB gzipped). Add `vendor-three` to `manualChunks` in `vite.config.ts`:

```ts
manualChunks: {
  'vendor-react': ['react', 'react-dom'],
  'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
}
```

Update `chunkSizeWarningLimit` if needed.

**`App.tsx` change:** Swap `import RoverGrid from './components/RoverGrid'` for `import MarsScene from './components/MarsScene'` and rename the JSX element. Props remain identical (`rovers`, `obstacles`, `selectedRoverId`).

## Security Considerations

No specific security considerations identified. No API keys, tokens, or credentials are involved in the 3D rendering layer. Proof artifacts (screenshots, CLI output) contain no sensitive data.

## Success Metrics

1. **Visual quality:** The 3D scene renders a recognizable Mars environment (red surface, stars, Martian lighting) with clearly readable rover and obstacle positions at the default camera view
2. **Test coverage:** All existing Vitest unit tests continue to pass; `MarsScene.test.tsx` adds meaningful coverage for the new component; Playwright e2e tests pass
3. **Build health:** `npm run build` produces a clean production bundle with `vendor-three` chunk split; no TypeScript errors; no lint warnings
4. **Performance:** The scene maintains smooth rendering at a typical rover/obstacle count (≤ 10 rovers, ≤ 20 obstacles) without perceptible frame drops in the browser

## Open Questions

No open questions at this time.
