# Task Workspace

This directory is the execution workspace for OneTake planning and delivery. It is intentionally separate from `docs/`:

- `docs/` records stable product, engineering, and historical documentation.
- `task/` records active version planning, phase planning, task execution, verification, and delivery status.

## File Roles

| File | Role | Update Trigger |
|---|---|---|
| `prd.md` | Version plan. Defines current release scope, user-facing behavior, acceptance criteria, and priority. | Scope changes, release decisions, user feedback that changes product behavior. |
| `plan.md` | Phase plan. Breaks the version plan into ordered implementation phases. | Sprint planning, priority changes, phase completion. |
| `spec.md` | Implementation specification. Defines state model, module boundaries, and behavior contracts for the current stabilization work. | Any code change that touches shared behavior or cross-module contracts. |
| `workflow.md` | Development workflow. Defines new-window intake, Ready/Done, branch, review, commit, push, and release flow. | Process changes or onboarding improvements. |
| `hooks.md` | Quality gates and proposed local/CI hooks. Defines checks that must pass before task completion. | Build/test/lint workflow changes. |
| `qa.md` | Manual QA checklist for Android system behavior, gestures, dark mode, and release smoke testing. | Manual test scope changes or newly discovered regression paths. |
| `decisions.md` | Decision log for product and engineering choices that should survive context changes. | New accepted/rejected/superseded decisions. |
| `release-notes.md` | Internal build release notes and release readiness checklist. | Every internal test build or release candidate. |
| `templates/task.md` | Template for a single task record. | Template evolution only. |
| `tasks/` | Single-task records. Each file tracks one concrete task from problem to verification. | Every non-trivial fix or feature. |

## Task Rules

1. One task file tracks one behavior change or one tightly coupled bug cluster.
2. Every task must include: problem, scope, acceptance criteria, implementation notes, verification, and final status.
3. A task is not `Done` until code, tests, docs, and manual verification notes are all complete or explicitly marked not applicable.
4. User-reported behavior has priority over stale docs. If `docs/` and source behavior disagree, update `task/` first, then sync stable docs after implementation.
5. `prd.md` owns version scope. `plan.md` owns sequencing. Task files own execution history.
6. New windows must start from `workflow.md` before implementation.
7. Product or engineering decisions that affect future work must be recorded in `decisions.md`.
8. Internal builds must have an entry in `release-notes.md`.

## Status Values

| Status | Meaning |
|---|---|
| `Proposed` | Captured but not accepted into the current plan. |
| `Planned` | Accepted and sequenced, implementation not started. |
| `In Progress` | Implementation or verification is active. |
| `Blocked` | Cannot proceed without external input or environment. |
| `Done` | Accepted, implemented, verified, and documented. |
| `Deferred` | Explicitly moved out of the current version. |

## Naming

Task files use:

```text
tasks/YYYY-MM-DD-short-topic.md
```

Example:

```text
tasks/2026-07-10-v1-stabilization-feedback.md
```

## New Window Start

A new development window should follow this order:

1. Read `workflow.md`.
2. Check `git status --short --branch`.
3. Read `prd.md`, `plan.md`, and the relevant task file.
4. Inspect affected source files.
5. Confirm Definition of Ready.
6. Implement, verify, record, commit, push, and open PR according to `workflow.md`.
