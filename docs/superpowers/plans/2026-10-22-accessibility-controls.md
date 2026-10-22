# Accessibility Controls Implementation Plan

> For agentic workers: use superpowers:executing-plans inline, with one independent final review.

**Goal:** Build the owner-selected floating native accessibility preferences panel and verify meaningful site behavior against the supplied requirements.
**Architecture:** Existing Astro/Tina/token architecture; independent typed settings and pure browser preferences; native dialog and external controller/CSS. No third-party overlay or provider.
**Tech stack:** Astro, TypeScript, Zod, TinaCMS, Vitest, Playwright/axe.

- [x] Contract: add failing tests for settings and safe preference parsing/storage; implement pure packages/accessibility model plus settings/type/localization/CMS fields.
- [x] Experience: add browser regression before implementation, implement localized floating controls and CSS with visible baseline and keyboard-safe native dialog, persistence/reset and all selected controls.
- [x] Integration: coordinate motion, validate public CSP and modal/form lifecycles, update runtime inventory and configuration map.
- [x] Acceptance: run unit/type/build checks, browser reflow/200%/option/storage/keyboard/contrast tests and native settings roundtrip. Record known manual audit limits.
- [x] Independent final review, fix actual Important findings in one tested pass, restart owned site/CMS, hand off without remote deployment or automatic push.

## Execution rulings

User approval of an in-house panel and supplied placement/reference/requirements carries implementation authorization. The written design formalizes that approved scope; no redundant approval cycle is required. The user explicitly wants only main, so implementation stays on their clean main without creating another branch or worktree. The original starter/reference repos remain unchanged.

## Outcome

Accepted locally: 21 live/static browser-inclusive tests, 90 reflow checks, 18 panel and 20 high-contrast page axe checks, native CMS position roundtrip, strict-CSP/motion journey and final isolated release rehearsal passed. The independent reviewer found no Critical/Important issues. Final acceptance fixed launcher suppression on an unfocused body and a pre-existing browser Zod JIT CSP probe, each after a failing regression. See `docs/VERIFICATION.md` and `docs/ACCESSIBILITY.md` for evidence and manual qualification limits. Local site/CMS are running; no automatic commit, push or hosted deployment.
