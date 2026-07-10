# OneTake Stabilization Phase Plan

**Date:** 2026-07-10  
**Version Plan:** `task/prd.md`  
**Status:** Planned

## Phase 0: Baseline Audit

**Goal:** Confirm current behavior from source and real-device reports before changing code.

Tasks:

- [x] Capture user-reported issues in `task/tasks/2026-07-10-v1-stabilization-feedback.md`.
- [x] Inspect current trash, collection, skip, and dark-mode implementation.
- [ ] Add a manual QA checklist for the current Android build.
- [ ] Identify which failures are code bugs, which are incomplete specs, and which are UX gaps.

Exit criteria:

- Current behavior is documented with expected vs actual outcomes.
- P0 implementation tasks are independently actionable.

## Phase 1: Safety-Critical Media Actions

**Goal:** Make delete, undo, and skipped-state behavior safe and explicit.

Tasks:

- [ ] Create a `ReviewState` model separate from action history.
- [ ] Add storage for review state and collection membership queries.
- [ ] Verify `TrashRepository` result flow: request launch, success/cancel handling, local state update only after confirmed success.
- [ ] Make Android 10 and lower behavior explicit: unsupported trash should not pretend to delete safely.
- [ ] Add tests for delete request generation, state transitions, and undo fallback behavior where unit-testable.

Exit criteria:

- Delete state updates only after system trash confirmation.
- Undo delete does not rely on an app cache pretending to restore the file.
- Skipped items are hidden through review state, not through accidental filtering.

## Phase 2: Collections and Favorites

**Goal:** Make collections usable and prevent duplicate or confusing favorite behavior.

Tasks:

- [ ] Add collection membership query APIs: `isInDefaultCollection`, `collectionsForMedia`, `removeFromDefaultCollection`.
- [ ] Make default collection creation unique and stable.
- [ ] Fix collection creation flow so repeated creation works from the collection page.
- [ ] On repeated favorite action, show a choice: cancel default collection membership or add to another collection.
- [ ] Add visual collected marker on review card and collection picker.
- [ ] Add tests for duplicate collection insert and membership removal.

Exit criteria:

- Repeated favorite action is never silent.
- Users can create multiple collections in one session.
- Collection membership state is visible before users act.

## Phase 3: Refresh and Reimport

**Goal:** Give users control over skipped and reviewed queues.

Tasks:

- [ ] Add UI entry points for refresh scan and reimport skipped.
- [ ] Define exact reset behavior for skipped, reviewed, staged, and collected items.
- [ ] Keep collection membership and staged items unless user chooses a destructive reset.
- [ ] Add confirmation copy for reset operations that clear local review state.
- [ ] Add tests for queue rebuilding after refresh/reimport.

Exit criteria:

- Skipped photos can be intentionally brought back.
- Refreshing newly added photos does not erase collections.
- Copy clearly distinguishes scan refresh from local-state reset.

## Phase 4: Gesture and Navigation Feedback

**Goal:** Make core gestures feel predictable and compatible with Android navigation.

Tasks:

- [ ] Add gesture progress overlay and color feedback before commit.
- [ ] Add haptic feedback on threshold crossing and commit.
- [ ] Reserve screen-edge areas for system back gesture or route edge gestures to navigation.
- [ ] Add in-app back handling for review, album viewer, collection sheet, and settings.
- [ ] Tune thresholds after real-device testing.

Exit criteria:

- Users can tell what action will happen before releasing.
- Edge back gesture works consistently.
- Right-swipe undo still works when started away from the edge.

## Phase 5: Dark Mode Completion

**Goal:** Make dark mode a complete UI state, not only a top-level color switch.

Tasks:

- [ ] Replace hard-coded `Color.White` surfaces with theme tokens.
- [ ] Replace fixed translucent white headers and bottom bars with light/dark-aware colors.
- [ ] Audit modal sheets, cards, thumbnail overlays, empty states, toasts, and nav bars.
- [ ] Add screenshots or manual QA notes for light, dark, and system modes.

Exit criteria:

- No unintended white cards/sheets remain in dark mode.
- Text contrast is acceptable in all main screens.

## Phase 6: Documentation and Release Readiness

**Goal:** Sync stable docs after implementation and prepare a reliable internal test build.

Tasks:

- [ ] Update `docs/prd.md` with accepted behavior changes.
- [ ] Update `docs/android-task-list.md` with finished stabilization tasks.
- [ ] Update `android-app/README.md` with accurate validation state.
- [ ] Add release notes for the internal build.
- [ ] Run final verification: Android assemble, lint, unit tests, Web typecheck/build.

Exit criteria:

- Stable docs match source behavior.
- Internal testers get a build plus a focused QA checklist.

