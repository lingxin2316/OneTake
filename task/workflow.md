# Development Workflow

**Date:** 2026-07-10  
**Status:** Active

This workflow is the default path for a new Codex window or a human developer picking up OneTake work.

## New Window Intake

Before editing code:

1. Check repository state:
   - `git status --short --branch`
   - `git log --oneline -8`
2. Read active planning context:
   - `task/README.md`
   - `task/prd.md`
   - `task/plan.md`
   - the relevant file under `task/tasks/`
3. Read stable references only as needed:
   - `docs/prd.md`
   - `docs/android-task-list.md`
   - `docs/android-ui-spec.md`
   - `docs/git-workflow.md`
4. Inspect the code paths touched by the task.
5. Confirm or create the task file.
6. Do not start implementation until the task satisfies Definition of Ready.

## Standard Delivery Flow

1. Propose: capture the feature, bug, or product gap; record current and expected behavior; assign P0/P1/P2.
2. Clarify: define in scope, out of scope, assumptions, and risky areas such as deletion, permissions, database migration, MediaStore, system UI, or release packaging.
3. Plan: create or update one task file; add acceptance criteria, test plan, manual QA plan, and rollback plan when needed.
4. Branch: use one branch per task or tightly coupled task cluster. Preferred Codex branch prefix is `codex/`, for example `codex/fix-trash-state`.
5. Implement: keep changes scoped, prefer testable data/state modules over more logic in `MainActivity.kt`, and update tests with behavior changes.
6. Self-review: inspect `git diff`, remove unrelated edits, and check null, empty, denied-permission, low-API, repeated-action, and dark-mode paths.
7. Verify: run required checks from `task/hooks.md`; run manual QA for system UI, MediaStore trash, restore, gestures, or visual changes.
8. Record: update the task file with implementation notes, commands, manual QA, residual risk, and final status.
9. Commit: stage only task-related files and use Conventional Commits, for example `fix(android): correct trash state handling`.
10. Push and Review: push the branch, open PR, wait for CI, and address review or CI issues.
11. Release and Feedback: for internal APKs, add release notes; record tester feedback as new task files unless it belongs to the active task.

## Definition of Ready

A task is ready to implement when:

- [ ] Problem and expected behavior are written.
- [ ] Scope and non-scope are clear.
- [ ] Acceptance criteria are testable.
- [ ] Affected modules are identified.
- [ ] Verification plan is written.
- [ ] Data, permission, MediaStore, or migration risks are called out.
- [ ] Rollback plan exists when user data or release stability can be affected.

## Definition of Done

A task is done when:

- [ ] Implementation matches acceptance criteria.
- [ ] Automated tests are added or updated where practical.
- [ ] Required commands pass, or failures are documented with cause and next step.
- [ ] Manual QA is complete when the behavior depends on Android system UI or real device behavior.
- [ ] Task file records implementation, verification, residual risk, and final status.
- [ ] Stable docs are updated or explicitly deferred.
- [ ] No unrelated files are staged.
- [ ] PR/CI is green before merge.

## Priority Rules

| Priority | Meaning | Examples |
|---|---|---|
| P0 | Data safety, broken core flow, or release blocker. | Trash/restore correctness, duplicate destructive action, broken collection creation. |
| P1 | Major usability or trust issue. | Gesture feedback, Android edge back, incomplete dark mode. |
| P2 | Quality, maintainability, or polish. | Refactor, screenshots, lint cleanup, documentation sync. |

## Change Size Rules

- Prefer one task per PR.
- Split a task when it touches unrelated modules or requires different verification environments.
- Do not bundle product behavior changes with broad formatting.
- Database changes must be isolated and documented.
