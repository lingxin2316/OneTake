# Task: Engineering Process Controls

**Date:** 2026-07-10  
**Status:** Done  
**Priority:** P1  
**Owner:** TBD  
**Related version:** `../prd.md`

## Definition of Ready

- [x] Problem and expected behavior are written.
- [x] Scope and non-scope are clear.
- [x] Acceptance criteria are testable.
- [x] Affected modules are identified.
- [x] Verification plan is written.
- [x] Risk and rollback notes are included where applicable.

## Problem

The project has planning files, but the development process was still under-specified for new windows and handoffs. The missing pieces were Definition of Ready, Definition of Done, manual QA, decision log, release notes, rollback expectations, and clear commit/push/PR flow.

## Expected Behavior

A new development window or developer can enter the project, understand current status, choose one task, implement safely, verify behavior, record results, and hand off through commit/push/PR without relying on chat history.

## Scope

In scope:

- Add a development workflow.
- Add manual QA checklist.
- Add decision log.
- Add internal release notes structure.
- Enhance task template with Ready/Done-adjacent checks, review, risk, and rollback fields.
- Update `task/README.md` index and intake rules.

Out of scope:

- Installing actual Git hooks.
- Changing CI.
- Implementing Android behavior fixes.

## Implementation Notes

- Affected modules: `task/` documentation only.
- Data/model changes: none.
- UI changes: none.
- Migration/backward compatibility: none.

## Risk and Rollback

- Risk: Process docs become too heavy and are ignored.
- Rollback: Simplify `workflow.md` and task template after one or two real tasks if fields prove redundant.
- Data impact: none.

## Acceptance Criteria

- [x] `task/workflow.md` defines new-window intake and delivery flow.
- [x] `task/workflow.md` defines Definition of Ready and Definition of Done.
- [x] `task/qa.md` defines manual QA for system trash, undo, collections, skip/reimport, gestures, and dark mode.
- [x] `task/decisions.md` records current key decisions.
- [x] `task/release-notes.md` defines internal build notes and readiness checklist.
- [x] `task/templates/task.md` includes risk, rollback, and review checklist fields.
- [x] `task/README.md` references the new files.

## Review Checklist

- [x] Diff contains only task-related changes.
- [x] Edge cases are handled at process level.
- [x] Dark mode impact considered in QA checklist.
- [x] Permission/API-level behavior considered in QA checklist.
- [x] Stable docs update deferred until implementation behavior changes.

## Verification

Commands:

- [x] `Get-ChildItem -Recurse task`
- [x] `rg -n "Definition of Ready|Definition of Done|Release Readiness|Manual QA|Decision Log" task`
- [x] `git status --short`

Manual QA:

- [x] Not applicable. This task is documentation/process only.

## Result

Status: Done

Notes:

- Actual Git hooks and CI additions remain proposed, not installed.
- The next implementation task should follow `task/workflow.md` and use `task/templates/task.md`.
