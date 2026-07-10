# Decision Log

**Status:** Active

Record product and engineering decisions that affect future implementation. This file prevents new windows from rediscovering settled decisions.

## Template

```text
## YYYY-MM-DD: <decision title>

Status: Accepted / Superseded / Rejected

Context:
- 

Decision:
- 

Consequences:
- 

Links:
- 
```

## 2026-07-10: Separate Action History from Review State

Status: Accepted

Context:
- Current code uses review/action records for recent actions and parts of queue behavior.
- User feedback shows skipped, deleted, cached, and collected behavior is confusing.

Decision:
- Use explicit review state as the source of truth for queue behavior.
- Keep action history for recent actions and undo/audit.

Consequences:
- Future implementation should introduce or emulate `ReviewState`.
- Tests should cover state transitions separately from action history ordering.

Links:
- `task/prd.md`
- `task/spec.md`

## 2026-07-10: System Trash Must Be Real, Not Simulated

Status: Accepted

Context:
- User testing reports delete feels like direct delete or cache simulation.
- Product promise is Android system trash with restore through system APIs.

Decision:
- On Android 11+, deletion and restore must use `MediaStore.createTrashRequest`.
- Local state should change only after system result confirms the action.
- Unsupported OS paths must say they are unsupported or degraded.

Consequences:
- Manual QA is required on real device/emulator.
- JVM tests alone are insufficient for final acceptance.

Links:
- `task/qa.md`
- `android-app/app/src/main/java/com/albumcleaner/prototype/data/TrashRepository.kt`

## 2026-07-10: Collections Are App-Owned

Status: Accepted

Context:
- The product uses "精选集" as an app-owned organization feature.
- It should not imply Android system favorite synchronization.

Decision:
- Collection membership is stored in the app database.
- Repeated favorite intent must be explicit and idempotent.

Consequences:
- UI needs collected markers.
- Duplicate membership should be prevented in both data and UX.

Links:
- `task/prd.md`
- `task/spec.md`
