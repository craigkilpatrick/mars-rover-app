# 02 Questions Round 1 - 3D Scene

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Rover Model Geometry

What should the 3D rover models look like?

- [ ] (A) Simple colored box (cube) with a directional marker — fast to implement, easy to read
- [x] (B) Box body + smaller box "turret" on top to indicate direction — slightly more character
- [ ] (C) Cylinder or capsule with a flat top indicator — rounder look
- [ ] (D) Other (describe)

## 2. Obstacle Geometry

What should 3D obstacles look like?

- [ ] (A) Simple dark red/brown box (cube) — matches current red-X aesthetic
- [x] (B) Rock-like irregular shape (use IcosahedronGeometry or similar) — more Mars-like
- [ ] (C) Tall thin spike / pillar — clearly distinct from rovers
- [ ] (D) Other (describe)

## 3. Camera / View Mode

How should the user be able to view the scene?

- [ ] (A) Full orbit controls (OrbitControls from @react-three/drei) — user can freely rotate, pan, zoom
- [ ] (B) Fixed isometric-style camera with zoom only (no rotation) — consistent bird's eye view
- [x] (C) Default to top-down with orbit controls available — best of both
- [ ] (D) Other (describe)

## 4. Mars Surface Appearance

What should the Mars surface plane look like?

- [ ] (A) Solid flat color (dusty red/orange #c1440e) with subtle grid lines — clean, minimal
- [ ] (B) Procedural texture (checkerboard or noise) to suggest terrain — more visual interest
- [ ] (C) Keep grid lines prominent so the coordinate system remains readable
- [x] (D) Other (A combination of A and B if it is possible)

## 5. Scene Lighting

What atmospheric lighting style fits the vision?

- [x] (A) Warm sun-like directional light (orange/yellow) + dim ambient — Martian daytime feel
- [ ] (B) Cool blue ambient + strong directional (sci-fi style) — dramatic contrast
- [ ] (C) Keep it simple: standard white ambient + directional — functional, neutral
- [ ] (D) Other (describe)

## 6. Selected Rover Highlight

How should the currently selected rover be visually distinguished in 3D?

- [x] (A) Glowing outline / emissive color on the mesh — sci-fi style
- [ ] (B) Floating ring or halo above the selected rover — clearly distinct
- [ ] (C) Pulsing scale animation (selected rover gently pulses) — motion-based
- [ ] (D) Other (describe)

## 7. Rover Movement Animation

When a rover moves in response to commands, should it animate?

- [ ] (A) Instant teleport to new position (simple, matches current behavior)
- [x] (B) Smooth lerp/tween to new position (looks polished but adds complexity)
- [ ] (C) Other (describe)

## 8. Testing Strategy for R3F

React Three Fiber requires WebGL which isn't available in jsdom. How should unit tests handle the new 3D component?

- [ ] (A) Mock the entire Canvas/R3F at the test level (existing pattern for canvas mock) — keep tests fast, focus on data/props
- [x] (B) Use a lightweight WebGL mock library (e.g., jest-webgl-canvas-mock) — more realistic
- [ ] (C) Skip unit tests for the 3D scene component; rely on Playwright e2e for visual verification
- [ ] (D) Other (describe)

## 9. Grid Coordinate Mapping

The game uses a 100×100 grid (x: 0–99, y: 0–99). In 3D space, what scale feels right?

- [ ] (A) 1 unit = 1 grid cell (100×100 world units) — matches game coords 1:1
- [ ] (B) Scale down (e.g., 0.5 units per cell = 50×50 world units) — fits better in viewport
- [x] (C) Let the implementation decide based on camera framing — not important to specify
- [ ] (D) Other (describe)

## 10. Stars Background

What should the stars look like?

- [ ] (A) @react-three/drei `<Stars>` component with default settings — simple and effective
- [x] (B) @react-three/drei `<Stars>` with custom density/speed (gently drifting) — subtle motion
- [ ] (C) No stars — keep focus on the surface
- [ ] (D) Other (describe)
