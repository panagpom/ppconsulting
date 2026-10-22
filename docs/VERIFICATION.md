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

## Native accessibility controls (2026-10-22)

Implementation remains on the owner's sole `main` branch, based on `50b178b`, with no external overlay service. Settings → Accessibility controls owns enablement and desktop placement. Detailed behavior, PDF interpretation, storage scope and manual qualification gates are documented in `docs/ACCESSIBILITY.md`.

- Final live acceptance: **21 tests passed** in six files with `SITE_TEST_URL=http://127.0.0.1:4331` and `SITE_STATIC_TEST_URL=http://127.0.0.1:8791`. The strict static-CSP regression initializes both newsletter and accessibility controllers without eval violations.
- Reflow: 90 combinations across five page types, EN/EL, 1440/375/320px and default/200%/combined spacing states, no overflow. Panel axe: 18 combinations, no automatic violations. High-contrast public-page axe: 20 checks, no automatic violations. Baseline public-site axe: 64 checks, no automatic violations. Incomplete/manual checks remain explicitly open.
- Keyboard, persistence/reset, blocked storage, cross-tab updates, computed visual preferences and native Tina settings position save/reload/restore passed. A real Greek FAQ reflow defect and a launcher suppression-on-scroll defect each had a failing browser regression before the fix.
- Served public build at Worker port 8791: response 200, unchanged strict `script-src 'self'; style-src 'self'`, zero CSP violations, zero page errors and zero external requests during the tested journey. Active scroll animations cancelled when reduced motion was selected; menu motion was suppressed and native menu close remained functional.
- Build: 37 pages. Type checks: 0 errors/0 warnings, six existing hints. Final isolated release rehearsal `run-294c25e0-672d-4e38-96c2-db5ca59386d6`, release ID `ae3cbfa2d5f8bcf3795f24bdc20e304edc85800cb6fa3ee19611648dd0a511c8`: frozen install, typecheck, public build, Worker bundle, fresh disposable local migrations and packaged dry-run passed. Integrity verified. Production readiness remains blocked by existing configuration/qualification gates; hosted CMS was not built/certified. No remote deployment or real sending occurred.
- Independent review found no Critical/Important issues. Its minor fluid-heading observation was addressed by naming the preference **Base text size**. Final acceptance additionally found the existing newsletter Zod JIT probe; browser-only interpreter configuration removed the CSP violation without changing server/Worker parsing rules.

Owned local website/CMS were restarted on 4331, Worker 8791, Tina 4011 and datalayer 9011. Screenshots and raw regression/CSP/release evidence remain under ignored `.generated/accessibility-*` and `.generated/releases`. This feature has not been automatically committed or pushed.

## Accessibility panel visual polish

The drawer now has a blue gradient header, separated icon wells, current-state chips and localized per-control action hints. Boolean hints update between enable/disable; multi-value controls indicate that tapping changes the selection. Selected states include a checkmark. A 220ms side entrance and hover lift respect both device and site reduced-motion settings.

Acceptance: 12 EN/EL panel axe checks across 1440/320px and all three contrast modes, zero automatic violations and no panel overflow; hint/state changes and both motion settings checked in-browser. Final live/static suite: 21 passed. Typecheck: zero errors/warnings, six existing hints. Build: 37 pages. Source site/CMS restarted on their existing ports. The earlier sealed release artifact predates this visual polish and would need rebuilding before deployment. No new runtime files/dependencies or remote actions were introduced.
