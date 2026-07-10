# Release Notes Log

**Status:** Active

Use this file for internal test builds. Keep entries short and tester-focused.

## Entry Template

```text
## YYYY-MM-DD: <build label>

Commit:
APK:
Audience:

Changes:
- 

Fixed:
- 

Known Issues:
- 

Tester Focus:
- 

Verification:
- 
```

## Release Readiness Checklist

- [ ] `git status --short` is clean except intentional release metadata.
- [ ] Android build passes.
- [ ] Android lint passes or warnings are accepted and recorded.
- [ ] Android unit tests pass.
- [ ] Web typecheck/build passes if Web files changed.
- [ ] Manual QA smoke test in `task/qa.md` is complete.
- [ ] Known issues are listed.
- [ ] Rollback plan is documented for risky changes.
- [ ] APK location and commit hash are recorded.

## 2026-07-10: v1.0 Stabilization Planning

Commit: TBD  
APK: Not produced  
Audience: Development planning only

Changes:
- Added active task workspace for v1.0 stabilization.
- Added workflow, QA, decision log, quality gate, and release note structure.

Known Issues:
- No Android behavior fixes are included yet.
- Stable docs under `docs/` are not fully synced to the new stabilization plan.

Tester Focus:
- Not applicable.

Verification:
- Planning files inspected by repository status and file tree.
