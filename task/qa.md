# Manual QA Checklist

**Date:** 2026-07-10  
**Status:** Active

Manual QA is required for behavior that depends on Android system UI, permissions, MediaStore, gestures, or visual rendering.

## Test Matrix

Record this for every manual QA run:

| Field | Value |
|---|---|
| Build commit | |
| APK/build variant | |
| Device model | |
| Android version | |
| Navigation mode | Gesture / 3-button |
| Theme | Light / Dark / System |
| Media library size | |
| Tester | |
| Date | |

## P0 Flows

### Permission and Scan

- [ ] Fresh install requests the expected media permission.
- [ ] Permission denied shows a recoverable state.
- [ ] Permission granted loads real media.
- [ ] Empty library uses the intended empty/example state.
- [ ] Refresh scan finds newly added media.

### Delete to System Trash

- [ ] First delete shows the delete tip unless disabled.
- [ ] Delete launches Android system confirmation when required.
- [ ] Confirmed delete removes the item from the review queue.
- [ ] Deleted item appears in system trash or system equivalent.
- [ ] Cancelled delete does not mark the item deleted.
- [ ] Unsupported OS behavior shows a compatibility message.

### Undo Restore

- [ ] Undo after delete launches restore flow where Android supports it.
- [ ] Confirmed restore makes the item visible again when MediaStore reports it.
- [ ] Cancelled restore keeps the item marked trashed.
- [ ] Undo after skip restores the item to the review queue.
- [ ] Undo after add-to-collection removes only the intended membership.
- [ ] Undo after stage removes only the staged state.

### Collections

- [ ] Default collection exists once.
- [ ] User can create multiple collections in one session.
- [ ] New collection appears immediately after creation.
- [ ] Add to collection works from review flow.
- [ ] Add to collection works from staged flow.
- [ ] Repeated default favorite action asks what to do.
- [ ] Collected item shows a marker before repeated action.
- [ ] Removing from collection updates item count and cover behavior.

### Skip and Reimport

- [ ] Skip hides the item from the normal queue.
- [ ] Refresh scan does not automatically bring skipped items back.
- [ ] Reimport skipped brings skipped items back.
- [ ] Reimport does not delete collections or staged items.
- [ ] Reset copy clearly explains what will change.

## P1 Flows

### Gestures and Back Navigation

- [ ] Up gesture shows delete feedback before commit.
- [ ] Down gesture shows collection feedback before commit.
- [ ] Left gesture shows skip feedback before commit.
- [ ] Right gesture shows undo feedback before commit.
- [ ] Haptic feedback fires only at intended threshold/commit points.
- [ ] Android edge back works from review screen.
- [ ] Android edge back closes collection sheet before leaving screen.
- [ ] Android edge back works from album viewer and settings.
- [ ] In-app right swipe undo still works when not started from screen edge.

### Dark Mode

- [ ] Home screen has no unintended white surfaces.
- [ ] Review screen card, header, staging bar, and action bar are dark-aware.
- [ ] Collection sheet and dialogs are dark-aware.
- [ ] Collections page cards and thumbnails are readable.
- [ ] Settings screen rows and segmented controls are readable.
- [ ] Bottom navigation and status/navigation bar areas are dark-aware.
- [ ] Toasts and overlays have acceptable contrast.

## Regression Smoke Test

Run before an internal build:

- [ ] Launch app.
- [ ] Grant media permission.
- [ ] Open a group.
- [ ] Skip one item.
- [ ] Add one item to default collection.
- [ ] Create one new collection.
- [ ] Stage one item.
- [ ] Delete one item to system trash.
- [ ] Undo latest action.
- [ ] Toggle dark mode.
- [ ] Refresh scan.
- [ ] Reimport skipped.
- [ ] Relaunch app and confirm persisted state.
