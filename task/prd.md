# OneTake Version Plan

**Version:** v1.0 stabilization  
**Date:** 2026-07-10  
**Status:** Planned  
**Source:** User field testing feedback plus current Android source inspection.

## Version Goal

Make the Android MVP behavior trustworthy enough for real-device testing. The immediate goal is not to add AI features or visual polish in isolation; it is to fix the core cleaning loop so users can safely delete, skip, favorite, undo, refresh, and use dark mode without data-loss surprises or broken flows.

## Product Logic Baseline

### Media States

Each media item should have one clear review state:

| State | Meaning | Queue Behavior |
|---|---|---|
| `Unreviewed` | Not handled in the current app review model. | Eligible for review queue. |
| `Skipped` | User intentionally passed it for now. | Hidden from normal queue until user refreshes/reimports. |
| `Trashed` | Moved to Android system trash through MediaStore. | Hidden from queue; recoverable through undo while system allows restore. |
| `Staged` | Temporarily held for later batch action. | Still visible in staging area; queue behavior depends on current session decision. |
| `InCollection` | Saved into one or more app-owned collections. | Marked as collected; repeated favorite action must be explicit. |

`Skipped`, `Trashed`, and `InCollection` are not the same thing. Code and UI must not treat them as generic "decision records" without a state-specific contract.

### Delete Contract

Deletion must use Android system trash when supported:

1. Android 11+ (`Build.VERSION_CODES.R` and above): call `MediaStore.createTrashRequest(..., trashed = true)`.
2. Undo delete: call `MediaStore.createTrashRequest(..., trashed = false)`.
3. The app must not simulate deletion by hiding the item and restoring it from cache.
4. If system trash is unavailable, the app must show a compatibility message and avoid claiming the item was moved to trash.

### Gesture Contract

Four-direction review gestures remain:

| Gesture | Action |
|---|---|
| Up | Move to system trash. |
| Down | Add to collection or choose collection. |
| Left | Skip. |
| Right | Undo latest review action. |

Android system back gestures must also work:

- Edge swipe from the left/right screen edge should navigate back where Android expects it.
- In-app horizontal right swipe for undo must not consume system back gestures that start from the screen edge.
- Visual and haptic feedback must clearly indicate the action before commit.

### Collection Contract

Collections are app-owned and separate from Android system favorites.

1. Users can create more than one collection from the collection page and from the add-to-collection flow.
2. Creating a collection must not leave the UI in a blocked state.
3. Adding a media item to the default collection is idempotent.
4. If the item is already in the default collection, the next favorite action must ask whether to cancel collection or add it to another collection.
5. The UI should mark collected items in the review card and collection picker.

### Refresh/Reimport Contract

Users need explicit control over skipped/reviewed items:

| Action | Behavior |
|---|---|
| Refresh scan | Requery MediaStore and keep existing review states. Good for newly added photos. |
| Reimport skipped | Move `Skipped` items back to `Unreviewed`. |
| Reimport all reviewable | Reset local review states for existing media except permanent collection membership and system-trash history. |

The wording should avoid "delete history" unless data is actually removed.

### Dark Mode Contract

Dark mode is not complete until all visible components use theme tokens instead of hard-coded light surfaces. Any `Color.White`, light alpha overlay, or fixed dark text in UI components must be audited.

## Priority

### P0: Safety and Broken Flow Fixes

1. Verify and correct delete-to-system-trash behavior and undo restore.
2. Separate review state from generic action history.
3. Fix collection creation and add-to-collection flow.
4. Prevent repeated default collection additions and add collected markers.
5. Add refresh/reimport entry points and behavior.

### P1: Interaction Trust

1. Improve four-direction feedback: overlay, threshold progress, haptic signal, and commit animation.
2. Support Android edge back gesture without conflicting with right-swipe undo.
3. Complete dark mode token migration for all visible screens.

### P2: Engineering Quality

1. Move review/session logic out of `MainActivity.kt` into testable state/controller classes.
2. Add repository tests for review state and collection membership.
3. Add manual QA checklist for real device testing.
4. Keep release docs synced after the stabilization work lands.

## Non-Goals for This Version

- AI classification, duplicate detection, OCR, compression, social publish templates.
- Cloud backup detection.
- System album favorite synchronization.
- Full visual redesign beyond feedback, dark mode, and broken-flow fixes.

## Acceptance Criteria

The v1.0 stabilization version is acceptable when:

- A real Android 11+ device shows deleted photos in system trash after app deletion.
- Undo delete restores the same media URI when system restore is accepted.
- Edge back gesture works from review, collection picker, album viewer, and settings.
- A media item cannot be silently added twice to the default collection.
- A collected media item displays a clear mark in review and collection selection flows.
- Users can create multiple collections without restarting the app.
- Users can refresh scan and reimport skipped items from a visible UI entry point.
- Dark mode screens do not show unintended white cards, white sheets, or low-contrast text.
- Android unit tests, lint, and Web prototype build remain green.



