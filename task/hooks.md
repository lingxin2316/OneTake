# Quality Gates and Hooks

**Date:** 2026-07-10  
**Status:** Proposed

This file defines recommended gates for task completion. The current repository already has CI for Android build/lint/unit tests and Web typecheck/build. Local hooks are optional until explicitly installed.

## Required Gates Per Task

| Change Type | Required Checks |
|---|---|
| Android source | `./gradlew :app:assembleDebug`, `./gradlew :app:lintDebug`, `./gradlew :app:testDebugUnitTest` |
| Android data/model logic | Relevant unit tests or a written reason why only instrumentation/manual QA is possible |
| MediaStore trash behavior | Manual real-device or emulator QA notes in the task file |
| Compose UI behavior | Light/dark manual QA notes, plus screenshots when practical |
| Web prototype | `npm run typecheck`, `npm run build` |
| Docs/task only | Link check by inspection, no build required unless release docs changed |

## Proposed Local Hooks

Do not install hooks automatically. If adopted, use a documented setup script later.

### pre-commit

Purpose:

- Block accidental large media, heap dumps, APKs, and generated build directories.
- Encourage specific staging instead of broad unrelated changes.

Suggested checks:

- Reject staged files matching `*.hprof`, `*.apk`, `*.aab`, `*.mp4`, `node_modules/`, `dist/`, `android-app/**/build/`.
- Reject files larger than 5 MB unless explicitly allowlisted.
- Warn when editing `docs/prd.md` without updating `task/prd.md` during active stabilization.

### pre-push

Purpose:

- Run the appropriate verification before pushing.

Suggested behavior:

- If Android source changed: run Android unit tests and lint.
- If Web prototype changed: run `npm run typecheck`.
- If Gradle or CI changed: run full Android build.

## CI Improvements to Consider

1. Add a job that fails when generated Android build artifacts are accidentally tracked.
2. Add an Android instrumentation test job only after emulator runtime cost is acceptable.
3. Add lint baseline review instead of ignoring recurring warnings.
4. Add a docs-only job to validate Markdown links if documentation grows.

## Task Completion Checklist

Each task file must include:

- Commands run.
- Manual QA device or emulator details, if behavior depends on Android system UI.
- Known residual risk.
- Whether stable docs need syncing now or after a later phase.

