# T01 Proof Summary: Smooth Rover Deletion Without Full-Screen Reload

## Task

Fix the React hooks dependency chain in App.tsx so that deleting a rover does not trigger
a full-screen loading spinner.

## Changes Made

### src/App.tsx

1. Removed `selectedRoverId` from `loadRovers` useCallback dependency array (changed to `[]`)
2. Replaced conditional auto-select with functional state update:
   `setSelectedRoverId(prev => prev ?? fetchedRovers[0].id)`
3. Simplified `handleDeleteRover` to `setSelectedRoverId(null)` when deleted rover was selected,
   removing the stale-closure pattern that read `rovers` directly

### src/App.test.tsx

Added 4 new unit tests:

- `should auto-select the first rover on initial load`
- `should clear selection after deleting the selected rover`
- `should not show loading spinner when deleting the selected rover`
- `should not re-execute loadRovers when selectedRoverId changes`

Also added `getObstacles` to the mock setup in `beforeEach` to prevent unhandled promise
rejections from the auto-mock returning undefined.

## Proof Artifacts

| File            | Type                    | Status |
| --------------- | ----------------------- | ------ |
| T01-01-test.txt | test (npm run test:run) | PASS   |
| T01-02-cli.txt  | cli (npm run build)     | PASS   |

## Results

- Test Files: 6 passed (6)
- Tests: 68 passed (68) — up from 64 before this task
- Build: Clean TypeScript compilation, no errors
- Root cause fixed: loadRovers dep array is now `[]`, so it is created once and never
  recreated when selectedRoverId changes, meaning the data-loading useEffect never re-fires
  on selection changes

## Timestamp

2026-02-24T17:05:00Z
