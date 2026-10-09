# Visual Design System & Color Architecture

**Status:** Locked product-level visual direction; implementation tokens defined for Stage 21  
**Applies to:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Architecture relationship:** Stage 1 product identity and experience principles; implemented during the proposed Stage 21 — Application Implementation & Intelligence Integration; verified at Stage 20 — Final Readiness & Launch Gate.

## 1. Purpose

This decision establishes one consistent visual system for the application before implementation. Screens and components must not invent their own palette or use color as a substitute for clear language, evidence, or accessible interaction design.

## 2. Locked visual direction

The application uses a **premium teal-and-black identity**: dark, restrained, modern, evidence-oriented, and legible. Teal is the primary brand/action accent. Black and charcoal create the primary surfaces. Soft white and muted neutral tones carry content. Semantic colors are reserved for meaningful status and feedback.

This direction applies consistently to the welcome experience, brief creation, discovery, opportunity results, intelligence dossiers, Apply / Save / Pass / Verify controls, history, settings, activation, and error/recovery screens.

## 3. Initial implementation color tokens

The following values are the canonical starting tokens for implementation. They are now specified as the project palette, not presented as values that had previously been recorded in earlier stage documents.

| Token | Hex | Required use |
|---|---|---|
| `color.brand.teal` | `#0D9488` | Brand accent, restrained highlights, selected indicators, progress and emphasis |
| `color.action.primary` | `#0F766E` | Primary interactive controls with light text; use for primary calls to action |
| `color.background.base` | `#0B0B0D` | Main application background |
| `color.surface.default` | `#17191C` | Cards, panels, and standard elevated surfaces |
| `color.surface.raised` | `#1F2327` | Nested panels, focused/raised surfaces, menus where needed |
| `color.border.default` | `#343B40` | Structural borders and separators; do not rely on borders alone to convey state |
| `color.text.primary` | `#F5F7F7` | Main content and headings on dark surfaces |
| `color.text.secondary` | `#B8C0C4` | Supporting text and secondary metadata |
| `color.status.success` | `#4ADE80` | Confirmed successful operations and positive system status |
| `color.status.warning` | `#F59E0B` | Caution, limitations, pending verification, or attention required |
| `color.status.danger` | `#F87171` | Errors, blocked actions, security warnings, and destructive-action feedback |
| `color.status.info` | `#60A5FA` | Neutral informational messages and system guidance |

These are semantic design tokens. Components must reference tokens rather than scattering unrelated raw hex values through implementation files. A future palette change must update the token definitions centrally and be reviewed for contrast and meaning.

## 4. Use and meaning rules

1. **Teal identifies brand and primary interaction, not truth.** Teal must never imply that an opportunity is verified, eligible, high-quality, safe, or recommended unless the relevant evidence-backed state explicitly supports that meaning.
2. **Status colors communicate system or assessment state only with labels.** Color must be paired with visible text and, where useful, an icon or shape. Meaning cannot depend on color alone.
3. **Eligibility, fit, ranking, quality, risk, recommendation, and user action remain distinct.** A green/success color cannot collapse these separate concepts or override their canonical state from the responsible architecture stage.
4. **Uncertainty stays visible.** Unknown, conflicting, stale, inferred, unsupported, withheld, incomplete, and degraded states must be expressed in plain language and not silently mapped to positive or negative colors.
5. **No decorative traffic-light scoring.** Do not color a numerical fit score as if it were a probability of success, a guarantee, or an opportunity-quality verdict. Use the state and explanation supplied by the owning stage.
6. **Destructive actions are not styled as primary actions.** Revocation, deletion, and irreversible operations require clear labels and proportionate confirmation.
7. **Apply / Save / Pass / Verify must be distinguishable by wording and behavior**, not color alone. A click or navigation event must not be represented as proof of external completion.

## 5. Accessibility and contrast requirements

- Meet WCAG 2.2 AA contrast requirements for text and user-interface components wherever applicable: normally at least 4.5:1 for regular text and 3:1 for large text and meaningful UI graphics/boundaries.
- Verify the actual rendered foreground/background pairs during implementation; do not assume every palette pairing is compliant merely because the individual colors are approved.
- Do not place small white text on the brand-teal accent unless the specific pairing passes contrast checks. Prefer the primary-action token for light-on-dark button text, and adjust if measured contrast or component states fail.
- Provide visible keyboard focus, logical tab order, accessible names, and non-color state indicators.
- Check hover, focus, active, disabled, error, loading, success, and high-contrast behavior. Disabled controls must remain understandable.
- Respect reduced-motion preferences; animation must not be required to understand status or progress.

## 6. Component and screen consistency

- **Primary buttons:** use the primary-action token; maintain clear focus and disabled states.
- **Secondary buttons:** use neutral surfaces/borders with readable text; do not compete visually with the primary action.
- **Cards and panels:** use the default/raised surface tokens and consistent border/radius/spacing rules established in the implementation design system.
- **Evidence and provenance:** prioritize readable source labels, evidence status, timestamps/freshness, and uncertainty. Do not style a source or claim as verified solely for visual polish.
- **Warnings and risks:** use warning/danger semantics only when the assessment data supports them, and always include explanatory text.
- **Empty, loading, error, partial, and degraded states:** design these as explicit application states, not blank screens or misleading success states.
- **Mobile first:** preserve hierarchy, contrast, touch-target usability, and legibility on narrow screens before expanding to desktop layouts.

## 7. Ownership and change control

- **Stage 1 — Product Constitution:** owns the product-level brand direction and experience principles.
- **Stage 21 — Application Implementation & Intelligence Integration (proposed):** turns these tokens into the actual theme, reusable components, screen styles, and responsive behavior.
- **Stage 20 — Final Readiness & Launch Gate:** verifies consistency, contrast, state semantics, accessibility, and behavior in the implemented application.
- Any change to the teal-and-black direction or semantic meanings requires an explicit decision record update. Implementation convenience alone is not sufficient reason to create a competing palette.

## 8. Acceptance criteria

The visual system is considered implemented only when:

- Every application screen uses the same central token set.
- No competing, undocumented palette is introduced.
- Actual foreground/background combinations are contrast-tested.
- State labels remain understandable without color.
- Opportunity evidence, uncertainty, eligibility, fit, ranking, quality, risk, recommendation, and user action remain visually and semantically distinct.
- Keyboard focus, mobile layouts, loading/error/empty/degraded states, and primary interactions have been checked.
- Stage 20 records the visual/accessibility verification outcome; documenting this decision alone does not count as implementation or a passing test.

## 9. Explicit status boundary

This file locks the visual direction and defines implementation tokens. It does **not** claim that the application UI has been coded, that the palette has been contrast-tested in a rendered application, or that accessibility tests have passed. Those checks belong to implementation and final verification.
