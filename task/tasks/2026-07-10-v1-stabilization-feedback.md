# Task: V1 Stabilization Feedback Triage

**Date:** 2026-07-10  
**Status:** Done  
**Priority:** P0  
**Owner:** TBD  
**Related version:** `../prd.md`

## Problem

Field testing found several core behavior problems in the Android MVP:

1. Delete appears to be direct delete or simulated delete/restore from cache, not a trustworthy system-trash operation.
2. Four-direction gesture feedback is weak, and Android edge-swipe back navigation is not implemented.
3. New collection creation and favorite actions are not fully connected. Creating a collection can block further creation, while creating from selected staged items works.
4. Default collection allows repeated favorite intent without clear handling. Users need collected markers and a prompt to cancel favorite or add to another collection.
5. Skipped photos disappear from later sessions. Users need refresh/reimport controls to intentionally reprocess skipped media.
6. Dark mode does not fully update components; many UI surfaces remain hard-coded light colors.

## Expected Behavior

The app should provide a safe and predictable photo-cleaning loop:

- Delete goes to Android system trash when the OS supports it.
- Undo delete restores through Android system restore, not app cache simulation.
- Gestures give clear visual/haptic feedback and do not block system back gestures.
- Collections can be created repeatedly and selected during review.
- Favorite/collection membership is idempotent and visible.
- Skipped photos can be reimported on demand.
- Dark mode updates all major UI surfaces and text contrast.

## Scope

In scope:

- Rewrite the active v1.0 stabilization plan.
- Define state and behavior contracts for delete, skip, collection, refresh, gestures, and dark mode.
- Create task-management structure under `task/`.
- Split implementation into actionable phases.

Out of scope for this task:

- Implementing all Android fixes immediately.
- Updating stable `docs/` after code changes. That should happen after each fix lands.
- Adding AI/OCR/duplicate-detection features.

## Current Source Findings

- `TrashRepository` creates `MediaStore.createTrashRequest` and restore requests, but product behavior must verify that local state only changes after successful system result.
- `MainActivity.kt` owns most state and action routing, making edge cases hard to test.
- `DecisionStore` records actions and collections, but review state and action history are not yet clearly separated.
- `collection_item` uses `(collectionId, mediaId)` as a primary key, which prevents duplicate rows but does not prevent confusing repeated favorite intent.
- Dark mode theme tokens exist, but many components still use hard-coded `Color.White` or white translucent overlays.

## Acceptance Criteria

- [x] Create `task/README.md` to define the task workspace.
- [x] Create `task/prd.md` as the version plan.
- [x] Create `task/plan.md` as the phase plan.
- [x] Create `task/spec.md` as the stabilization implementation spec.
- [x] Create `task/hooks.md` for quality gates and proposed hooks.
- [x] Create a reusable task template.
- [x] Record this feedback triage as the first task file.

## Verification

Commands:

- [x] `git status --short`
- [x] Inspect `task/` tree.

Manual QA:

- [ ] Not applicable. This task is planning/specification only.

## Result

Status: Done

Notes:

- Implementation should start with Phase 1 because deletion and undo semantics are safety-critical.
- The next code task should be a narrow P0 fix: system trash result handling and review-state separation.


