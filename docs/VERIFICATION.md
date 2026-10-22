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

## Light-section inheritance correction

Subsequent visual feedback identified white inherited section/card titles despite valid light tokens, and mismatched straight/curved accent colours. All section bands now expose their selected colour scheme. The light boundary sets the foreground and resolves its accent gradient locally, with one hue fading to transparent. The browser regression first failed at 1.11:1 heading contrast, then passed for both languages at 1440px/375px, including card hover and matching straight/curved accent colours. Desktop computed foreground is #0b1828 against #e3e9ef; both accent pieces begin at #245a91. Earlier token-only checks did not establish inherited title contrast. The previous release artifact predates this correction.

## Header and Contact polish acceptance

Header social icons share the language/menu centreline, with a 1px white separator and compact adjacent 44×44px targets. Checked EN/EL at 1440px, 768px and 375px without overflow. Contact introduction spans the left column; socials sit below on the left and direct contact details on the right, stacking appropriately at smaller widths. Checked EN/EL at 1440px, 1024px, 768px and 375px. The enquiry form no longer renders marketing consent or newsletter interest controls; intercepted request verification confirmed marketingConsent=false and no interest field. Newsletter modal remained available in both languages.

Pre-commit verification: all 13 tests passed with the live browser regression enabled, check reported 0 errors/0 warnings (six existing hints), and static build produced 37 pages. Whitespace checks passed. Raw evidence is retained in `.generated/commit-polish-*.log` and the related browser scripts/screenshots.
