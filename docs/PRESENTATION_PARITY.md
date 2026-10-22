# PPConsulting presentation parity plan

The app was created using the source starter CLI dry-run and actual initializer, professional-services preset, EN/EL, default EN. starter-provenance.json records source revision fa16a5f and actual input digest. Initial frozen install/check/test/build/Worker dry-run/site:inspect passed before presentation adaptation. Original financial-consulting-example is read-only. The initializer baseline is committed as `5cee0de`; the presentation adaptation is tracked separately on `codex/ppconsulting-design`. The following evidence describes the adaptation and its remaining verification limits.

## Canonical migration map

| Reference | Destination |
| --- | --- |
| Shared brand/contact/social and bilingual labels | v2 Settings, visible brand PPConsulting; placeholder legal/contact details remain unreviewed |
| Six Pages: home/about/contact/services/insights/privacy | v2 Home/About/Contact/Offerings/Insights/Standard; preserve /offerings index and all EN/EL paths |
| Seven offerings and business/individual groups/numbers | v2 Offerings plus typed audience/number fields and native controls |
| Two articles, dates, category and images | v2 Articles plus typed preview metadata; publication dates converted explicitly per locale |
| One author profile | v2 People with published locale copy and preserved article relationships |
| Hero, perspective, services, method, articles and FAQ | v2 registered sections with typed eyebrow/actions/background appearance; retain required capabilities |
| Advisory palette, fonts, typography/emphasis/eyebrow/divider/footer settings | Theme source and validated presentation options, generated external CSS, real shared consumers |
| Section colour/image/position/opacity | Typed shared section appearance, native controls and external CSS; preserve strict public CSP |
| Existing visitor prompt and privacy copy | v2 newsletter experience/policy with localized modal/footer/consent fields; record retired or differing policy controls |

## Presentation and feature acceptance

Preserve navy base, Lato body, Merriweather English and Georgia Greek headings, identical language scales, 3px radius, soft silver eyebrows, curved left accents, between-row/FAQ dividers, clear footer, alternating service groups, contextual icons, article previews and native motion/reduced-motion behavior. Keep v2 safe text/media/link rendering, validated CMS, form protection/submission lifecycle, newsletter state, admin roles, budgets/usage/static routing and release guards. Use shared reusable renderers rather than old loaders/backend.

Before writing content, validate a staged one-way conversion and report mapped and unsupported legacy fields. Preserve deprecated unused data in an explicit nonruntime migration archive instead of silently discarding it. Never copy databases, captures, secrets, generated CSS/editor/manifests or old runtime infrastructure. Add new fonts/components/scripts to this app's hand-maintained release-files.json. Theme/upload directories are collected automatically.

Verify both languages and desktop/mobile across home/about/contact/offerings and detail/insights and detail/people/privacy. Native CMS appearance/copy/visibility edits must reach public output. Compile success alone is not visual parity. Public inline scripts/styles must not be introduced to bypass CSP. Domain/email/sending/retention/legal signoff remain pending production gates.

## Migration evidence and deliberate differences

The public source content digest is `9e6b2166cfbf582a8ec62e67268fd17185e332d7b66752b00638756d424b84c3`. `docs/migration/import-report.json` lists converted files and retired policies; `source-public-content.json` preserves public source fields that were already unused by the reference renderer. AXIA appears only in that historical archive. No source files were written. The importer validated the staged documents before applying; configure subsequently validated the complete catalog. Only the three verified untouched initializer sample editorial records were removed. The disabled rooms module and its dormant sample remain available.

Native v2 form, visitor consent, preference, subscriber and admin/runtime controllers remain authoritative. Cookie/prompt lifecycle wording and controls follow v2; old scroll-percentage and separate confirmed cooldown policies are archived, not silently reinterpreted. Footer legal notices stay visible until business/legal review. Header/menu navigation follows CMS order rather than the reference's hardcoded list.

Local tests cover safe presentation inputs, strict public CSP, background CSS percentages, complete catalog/relationships, optional visibility and original rich-text AST preservation. Native browser testing identified and fixed raw-vs-registered Tina field rendering; a native save/reload cycle changed perspective image opacity 0.60 → 0.59 → 0.60. CMS now receives the selected design theme through the public descriptor; infrastructure remains excluded.

Preliminary route screenshots compared the original existing dist snapshot with new output at 1440px and 375px, EN/EL. Both language hero sizes were 92.8px desktop and 44px mobile, with intended font families. No broken main images, JS errors or horizontal overflow occurred in those checks. These checks are local evidence, not a claim of pixel identity, hosted readiness or complete WCAG certification.

The first independent reviewer could not start because its model usage limit was exhausted. The replacement independent reviewer found one P2 issue: light sections inherited the dark-theme eyebrow colour, at 1.19:1 contrast. It was accepted as important and fixed in one pass: scoped light eyebrow role, theme mapping and 4.5:1 validation for light text roles. A regression was observed failing before the fix and passing afterwards; no other Critical/Important findings were reported. Production domain/identities/Turnstile/sending, retention/recovery and legal approval remain blocked through existing readiness gates.

Final local browser sweep visited 32 public routes at two widths (64 checks), with exactly one main H1, status 200, no horizontal overflow and no page errors. Native menu Escape returned focus to the opener; FAQ opened normally. The Contact form selected funding from `contextId`, accepted synthetic local data and returned its receipt. Newsletter modal opened from the footer and accepted a synthetic local subscription with a confirmation receipt. Real delivery remained disabled. Theme palette opened with the advisory colours and no render errors. Raw screenshots/logs are under ignored `.generated`; the app uses no reference backend.
