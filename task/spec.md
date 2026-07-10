# Stabilization Implementation Spec

**Date:** 2026-07-10  
**Scope:** Android MVP stabilization

## Architectural Direction

Current implementation keeps too much product logic in `MainActivity.kt`. Stabilization work should move behavior into small testable units without requiring a full rewrite.

Recommended boundaries:

| Module | Responsibility |
|---|---|
| `MediaStoreRepository` | Query MediaStore and build `MediaItem` / `MediaGroup`. No review-state filtering inside raw query. |
| `TrashRepository` | Create system trash/restore requests only. It does not update local review state. |
| `DecisionStore` | Persist review action history, review states, staged items, collections, and settings. |
| `ReviewQueueBuilder` | Combine MediaStore results with local review state to decide what appears in the review queue. |
| `ReviewController` | Own action transitions: delete, skip, add to collection, stage, undo. Test this outside Compose where possible. |
| Compose screens | Render state and emit user intents. Avoid direct database branching inside composables. |

## State Model

Add or emulate a state table with this shape:

```kotlin
data class ReviewState(
    val mediaId: Long,
    val state: ReviewStateType,
    val updatedAtMillis: Long,
    val sourceUri: String,
    val displayName: String
)

enum class ReviewStateType {
    Unreviewed,
    Skipped,
    Trashed,
    Staged,
    InCollection
}
```

Implementation may store this as Room entities, but the product contract must remain state-based. `review_action` stays as audit/history, not as the single source of truth for queue filtering.

## Delete Flow

Expected flow:

```text
User commits delete
  -> UI requests PendingIntent from TrashRepository
  -> If request unavailable, show unsupported message and do not mark deleted
  -> Launch system IntentSender
  -> On ActivityResult OK, mark ReviewState = Trashed and append action history
  -> On cancel/failure, keep previous state and show message
```

Undo delete:

```text
User commits undo
  -> Load latest undoable action
  -> If latest action is delete, request system restore PendingIntent
  -> On ActivityResult OK, restore previous ReviewState and remove/mark undone action
  -> On cancel/failure, keep Trashed state and show message
```

Forbidden behavior:

- Marking a photo deleted before system confirmation.
- Restoring from an app cache as if the file was recovered from system trash.
- Showing success when Android trash APIs are unavailable.

## Collection Flow

Rules:

1. `collection_item` primary key `(collectionId, mediaId)` prevents exact duplicate rows, but UI must still prevent silent duplicate intent.
2. Default collection must be created once and reused.
3. Collection creation should return the new collection ID and refresh the list immediately.
4. Repeated favorite action logic:

```text
If item not in default collection:
  Add to default collection or chosen collection.
If item already in default collection:
  Ask: remove from default collection / add to another collection / cancel.
If item is in other collections:
  Show membership marker and allow additional collection selection.
```

## Skip and Reimport Flow

Skip:

- Set `ReviewState = Skipped`.
- Append action history for undo and recent actions.
- Exclude from default review queue.

Refresh scan:

- Requery MediaStore.
- Preserve existing local state.
- Add newly found media as `Unreviewed`.
- Remove or mark missing media as unavailable without destroying collection records until explicitly cleaned.

Reimport skipped:

- Change `Skipped` to `Unreviewed`.
- Preserve collection and staged membership.

Reimport all reviewable:

- Reset `Skipped` and non-destructive reviewed states to `Unreviewed`.
- Do not modify `Trashed` state unless MediaStore shows the item is present again.
- Do not delete collection folders or collection items.

## Gesture and Navigation

The review card should distinguish app gestures from system gestures:

- Ignore right-swipe undo if the pointer starts inside the reserved system back edge width.
- Add `BackHandler` for explicit in-app navigation.
- Collection sheet and dialogs should close on back before leaving the screen.
- Gesture feedback must be progressive, not only after commit.

Suggested feedback:

| Direction | Color | Label |
|---|---|---|
| Up | Delete red | `移入回收站` |
| Down | Favorite amber | `加入精选集` |
| Left | Muted gray | `跳过` |
| Right | Teal/green | `撤回` |

## Dark Mode

All reusable UI surfaces should use theme tokens:

| Use | Token |
|---|---|
| Screen background | `themeColors().Bg` |
| Cards/sheets/bars | `themeColors().Card` |
| Primary text | `themeColors().Ink` |
| Secondary text | `themeColors().Muted` |
| Borders/dividers | `themeColors().Line` |
| Scrims/overlays | `themeColors().SurfaceOverlay` or explicit dark-aware overlay |

Audit targets:

- `CategoryCard`
- `ReviewHeader`
- `ThumbnailStrip`
- `ReviewScreen` card
- `StagingBar`
- `ActionCircle`
- `CollectionSheet`
- `SettingsScreen`
- `CollectionSection`
- `InfoCard`
- `ScreenScaffold`
- `BottomNav`

## Test Requirements

Minimum tests for stabilization:

- `ReviewQueueBuilderTest`: skipped and collected items filtered/marked correctly.
- `DecisionStoreCollectionTest`: duplicate membership, default collection uniqueness, remove membership.
- `ReviewControllerTest`: state transitions for skip, stage, add collection, undo.
- `TrashRepositoryTest`: request unavailable below Android R and blank URI handling where Robolectric or instrumentation permits.
- Manual device QA: system trash and restore cannot be fully trusted from JVM tests.

