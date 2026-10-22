# PPConsulting verification record

Date: 2026-10-22. Independent app on `codex/ppconsulting-design`, initialized from starter revision `fa16a5f` through the actual dry-run and initializer commands. Scaffold baseline: `5cee0de`.

- App `check`: 0 errors, 0 warnings, 6 existing unused-symbol hints.
- App tests: 12 passed, including native field registration and selected-theme descriptor regressions.
- Static build: 37 pages, with 32 public content routes across EN/EL plus feed/system/root output.
- Worker bundling: dry-run passed. Sending and marketing disabled.
- Browser: 32 public content routes × desktop/mobile = 64 checks, all status 200, one main H1, no page errors or horizontal overflow. Home/contact screenshots checked at 375px and 1440px. Main photographs loaded. Menu open/Escape/focus restoration, FAQ toggle, contact context preselection and synthetic local receipt passed. Newsletter footer opened modal; synthetic subscription returned confirmation receipt. No real email was sent.
- Native CMS: Home editor loaded, background opacity changed 0.60 → 0.59, saved/reloaded and restored to 0.60 through the editor. Advisory theme palette opened without errors. Validation retained native rich-text AST values.
- Independent review: replacement reviewer completed after first model was unavailable. One P2 contrast issue accepted and fixed: light section eyebrow inherited a dark-theme colour. Regression failed before the fix, passed after. Theme validation now checks light text roles at 4.5:1. No other Critical/Important issues reported.
- Final isolated release rehearsal: `run-dc4de9c6-216b-4d80-b923-e1b79e48d5e3`, release ID `58a02a975c37aa0156d15d9631917a03284d68f84a1703f1707a9f98cfb095d5`. Frozen install, typecheck, public build, Worker bundle, fresh disposable local migrations and packaged dry-run all passed. Integrity verified; deployment readiness correctly remains blocked. CMS publishing was not built or certified by this rehearsal.
- Financial reference Git working tree remains clean. Its public content digest still matches the import report: `9e6b2166cfbf582a8ec62e67268fd17185e332d7b66752b00638756d424b84c3`. Original source was not modified. The source starter's two unrelated provider-usage edits were preserved.

Raw logs, browser screenshots, failed-test evidence and isolated release workspaces are retained under ignored `.generated`. This record does not claim pixel identity, complete accessibility certification or production readiness. See deployment/readiness documents for final domain, actual business/legal data, Cloudflare resources/Access/Turnstile, delivery verification, retention/recovery and hosted capacity gates.

## Local use

From this app folder, use separate ports while the source starter uses 4330:

```powershell
$env:SITE_PORT='4331'
$env:WORKER_PORT='8791'
$env:TINA_PORT='4011'
$env:TINA_DATALAYER_PORT='9011'
pnpm dev:cms
```

Website: http://127.0.0.1:4331/el and /en. CMS: http://127.0.0.1:4331/cms/index.html. Run `pnpm site:inspect` to discover current configuration owners before prompt-driven edits.
