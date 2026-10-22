# Accessibility controls and verification design

## Approved intent

The owner requested a UserWay-like floating accessibility panel, explicitly outside the header, and supplied two screenshots plus a two-page requirements extract. They selected an in-house implementation without an external service. Desktop default: right-middle; narrow screens: right-bottom. The existing visual design is the default. Work belongs only to PPConsulting. Preserve its single main branch, CMS/native content, strict public CSP and existing form/newsletter lifecycles. No paid service, external trackers or compliance certification claims.

## Requirements interpretation

The provided Greek extract (printed pages 151-152, section E) calls for EN 301 549 chapter 9 and WCAG 2.1 AA for websites, chapter 10 for non-web documents, and compatibility with assistive technologies. Its AAA passage concerns websites specifically aimed at disabled people; this consultancy is not classified as that special case. The extract does not require UserWay or enumerate widget buttons. Tool controls supplement accessible baseline content; they cannot certify the site. Reference: https://www.w3.org/TR/WCAG21/ and https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf.

## Product design

A named 52px launcher opens a native modal drawer on the right, with a two-column grid of icon/text controls, active indicators, explanatory text, close and reset. EN/EL built-in interface strings. The panel fits the viewport and scrolls internally, retains Escape/focus restoration and never captures browser shortcuts such as Ctrl+U. It pauses auto newsletter invitations through the existing open-dialog guard.

Controls: text size 100/125/150/175/200%; normal/dark-high/light-high contrast; highlighted links; text spacing; line spacing; reduced motion; hide decorative photography; readable sans-serif headings; larger pointer; left/centre/right text alignment; reduced/grayscale image saturation. Readable font is a preference, not a dyslexia treatment claim. Meaningful images, labels, names, form validation and document semantics remain available. Reset restores project defaults. System reduced-motion preference remains authoritative.

Settings own enabled/desktop position, exposed natively in Tina. Theme tokens own panel styling. Finite enumerated browser preferences are versioned and scoped by project name; store only requested appearance choices, no personal data. Storage failure falls back to session-only operation with feedback. Reset removes stored state. No browser-wide zoom override or forced stylesheet/ARIA rewrites.

## Implementation boundaries

Browser-safe preference functions in packages/accessibility; settings schema with safe defaults; native settings controls; one Astro panel/icon component; focused external CSS; external controller bootstrapped from site-entry. Coordinate motion through an explicit preference event with scroll/menu controllers. Keep generated files off limits and extend the hand-maintained release inventory.

## Acceptance and limits

Unit tests for malformed state, safe enum bounds, reset/storage errors and settings validation; native CMS edit/reload; browser EN/EL desktop/mobile, keyboard open/Tab/Escape/focus, every option, persistence/navigation/reset, reduced motion, blocked storage, 200% text and 320px reflow, panel/contrast automated audits and form/newsletter coexistence. Baseline axe scan: 32 public content routes × 1440px/375px, zero automated WCAG 2.1 A/AA violations. Manual screen-reader/assistive-device and uploaded-document review remain explicit qualification gates; do not claim complete conformance from automated tests.
