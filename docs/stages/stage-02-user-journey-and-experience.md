# Stage 2 — User Journey & Experience Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Brand mark:** The Exploded T  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Status:** STAGE 2 — COMPLETED (ARCHITECTURE CONSOLIDATED)

---

## 1. Purpose

Stage 2 converts the locked Stage 1 product constitution into the authoritative user journey and experience architecture.

Stage 2 defines how a user moves through the product, what the user sees, what decisions the user can make, what information each experience state requires, and how the experience hands off into Stage 3.

Stage 2 must not redefine Stage 1 concepts. In particular, it must preserve the distinction between match, eligibility, ranking, opportunity quality, recommendation, evidence, uncertainty, and user decision authority.

---

## 2. Locked decisions from Stage 2 architecture questions

### Decision 1 — Entry
**B: Welcome → short explanation → Brief**

The product begins with a concise welcome experience that establishes what the product does and what the user can expect. It then moves directly into the brief.

### Decision 2 — Brief
**C: Simple brief first → optional advanced preferences**

The initial brief must be fast to complete. Advanced preferences are available without forcing every user through a heavy onboarding process.

### Decision 3 — Results
**D: Decision categories**

Results are organized into meaningful decision categories rather than presenting one undifferentiated list:

- Best Match
- Strong Opportunity
- Needs Verification
- Low Fit

These categories are experience labels. They must not erase the underlying match, eligibility, ranking, opportunity quality, evidence, or recommendation data defined elsewhere in the system.

### Decision 4 — Result card information
**C: Title + match strength + key reasons + opportunity quality + key risk**

A result card must provide enough decision context to help the user decide whether to open the opportunity without overwhelming the results surface.

### Decision 5 — Opportunity action
**C: Intelligence page → Apply / Save / Pass / Verify**

The product provides decision intelligence before the user acts. The user remains the final decision maker.

---

## 3. Authoritative experience journey

The complete access-to-product journey is:

**Gumroad Purchase → Quickstart PDF + App Link + Unique Buyer Activation Key → Activation → Server-Side Entitlement Validation → Authorized Session → Welcome → Brief → Optional Preferences → Opportunity Hunt → Results → Opportunity Intelligence → User Decision → Action → Management / Feedback → Future Personalization.**

A returning buyer with a valid authorized session may proceed directly to Welcome. The quickstart PDF helps the buyer get started; it does not grant access. Possession of the app URL alone must never bypass server-side entitlement checks.

The Peer Lead Network is an ecosystem pathway available from relevant product contexts, but it remains separate from the matching engine. The activation/authorization mechanism is owned by Stage 17, and purchase verification, entitlement synchronization, session integration, and production enforcement are owned by Stage 19.

---

## 4. Experience principles

1. The product must feel focused rather than heavy.
2. The brief remains central to the hunt.
3. Users should understand what the system is doing without being buried in technical detail.
4. Evidence and reasoning must remain accessible.
5. Strong fit must not automatically mean strong opportunity.
6. Uncertainty must be visible.
7. Weak opportunities must not be presented as strong simply to increase result volume.
8. The user remains the decision maker.
9. Every important action must have an understandable outcome.
10. Empty, uncertain, stale, and failed states are part of the architecture, not afterthoughts.
11. Peer Lead Network is community intelligence, not matching logic.
12. The experience should help users become better opportunity evaluators over time.

---

## 5. Screen and state architecture

### 5.0 Access & Activation (pre-entry gate)

**Purpose:** Establish whether the visitor is entitled to enter the protected application before showing buyer-only product content.

The access journey must support:
- a buyer receiving the quickstart PDF, app link, and unique activation key after a valid Gumroad purchase;
- an activation screen that accepts the buyer's activation credential without exposing whether another buyer's credential is valid;
- server-side validation of entitlement and activation state before an authorized session is granted;
- a clear successful activation/continue path;
- clear denied states for invalid, already-used where applicable, revoked, refunded, or non-entitled credentials;
- a truthful temporary-unavailable state when entitlement verification cannot be completed;
- a returning authorized buyer entering through a valid session without unnecessary repeated activation.

The app URL and PDF are not access controls. Do not store activation keys in browser-readable configuration or treat client-side checks as authorization. Stage 17 defines credential, session, authorization, privacy, and revocation policy; Stage 19 integrates Gumroad and production enforcement. Stage 2 owns only the user-facing journey and states.

### 5.1 Welcome

**Purpose:** Establish product identity and move the user quickly into the product.

Must communicate:
- T4L GROWTH™
- THE CLIENT OPPORTUNITY MATCHER™
- by Terrence
- The Exploded T
- concise product value
- clear entry into the brief

Primary action:
**Start finding opportunities**

Secondary navigation may provide relevant context without becoming a long onboarding sequence.

### 5.2 Brief

**Purpose:** Capture the user's current opportunity intent.

Core information should support:
- service
- target or client type
- location
- relevant immediate requirements

The initial brief should remain simple.

Required information must be defined by Stage 3's data contract rather than invented separately here.

### 5.3 Optional Preferences

**Purpose:** Let the user refine the hunt without making advanced configuration mandatory.

Potential preference areas include:
- budget
- engagement preferences
- working constraints
- experience requirements
- other user preferences

Preferences must remain distinguishable from hard requirements.

### 5.4 Opportunity Hunt state

**Purpose:** Communicate that the system is actively processing the brief and researching opportunities.

The experience should make the process understandable without exposing unnecessary implementation details.

Possible states:
- preparing hunt
- searching
- evaluating candidates
- preparing results
- completed
- degraded
- failed

The exact backend states belong to later technical/data contracts.

### 5.5 Results

**Purpose:** Help the user identify which opportunities deserve attention.

Primary categories:
1. **Best Match**
2. **Strong Opportunity**
3. **Needs Verification**
4. **Low Fit**

Each opportunity remains an individual result with its own underlying intelligence.

Result card minimum information:
- opportunity title
- match strength
- key match reasons
- opportunity quality
- key risk

The result should provide access to the original opportunity/source and the deeper intelligence view where available.

### 5.6 Opportunity Intelligence

**Purpose:** Give the user enough evidence and reasoning to make an informed decision.

The experience should organize, as available:
- opportunity summary
- source/original opportunity
- relevant evidence
- why it matches
- requirement coverage
- important gaps
- opportunity quality
- risks
- uncertainty
- budget information
- important missing information
- confidence/limitations
- recommended next action

The experience must distinguish system findings from user decisions.

### 5.7 User decision

Primary actions:

**Apply**  
User chooses to pursue the opportunity.

**Save**  
User wants to retain the opportunity for later.

**Pass**  
User chooses not to pursue it.

**Verify**  
User wants to resolve uncertainty before deciding.

The system must not represent a recommendation as a guaranteed outcome.

### 5.8 Opportunity management

After a decision, the user should be able to understand the opportunity's current state.

Examples:
- saved
- pursuing
- passed
- verification needed
- completed action

Notes and later feedback may be attached where supported by later stages.

### 5.9 Feedback and personalization

User decisions and explicit feedback may become personalization signals.

The experience must not imply that the system can silently override the user's preferences or decision authority.

Stage 13 owns user decisions and opportunity actions; Stage 14 owns feedback and governed learning; Stage 15 owns opportunity lifecycle states and transitions; Stage 16 owns technical failure, degradation, and recovery semantics. Stage 16 operational state must never replace or infer Stage 15 lifecycle state. These stages must preserve user decision authority and keep feedback signals separate from authoritative evidence.

### 5.10 Peer Lead Network

The Peer Lead Network should be reachable as a community pathway from appropriate product contexts.

It may be useful when the user wants:
- peer opinions
- community feedback
- collaboration
- opportunity sharing
- support
- access to Terrence
- connection with other independent service providers

It must remain separate from the product's matching and ranking logic.

---

## 6. Required experience states

Stage 2 requires deliberate handling of the following states.

### Empty state
No suitable opportunities are currently available.

The product should explain the situation honestly and offer useful next steps such as refining the brief, changing preferences, or trying another hunt where appropriate.

### Weak result state
Opportunities exist but none meet the product's stronger thresholds.

The system must not manufacture a Best Match merely to fill the interface.

### Needs verification state
An opportunity may have potential but lacks sufficient evidence or contains uncertainty that matters to the decision.

The interface must make the uncertainty visible.

### Low fit state
The system identifies meaningful incompatibility.

Low fit must not be presented as a positive recommendation.

### Stale opportunity state
An opportunity may have changed or may no longer be sufficiently current.

Freshness limitations must affect confidence and action guidance.

### Missing information state
Important information is unavailable.

The product should identify what is missing rather than silently infer it.

### Conflict state
Sources or extracted facts materially disagree.

The conflict must be visible and handled according to later evidence/provenance rules.

### Search failure state
The live hunt cannot complete normally.

The product must communicate that the hunt did not complete rather than pretending there are no opportunities.

### Partial/degraded state
Some information is available but the complete intelligence chain could not be completed.

The product should preserve available evidence while clearly identifying limitations.

---

## 7. Experience decision hierarchy

The interface must preserve this conceptual hierarchy:

**Eligibility → Match → Ranking → Opportunity Quality → Recommendation → User Decision**

This does not mean the interface must literally display these as six separate screens.

It means the experience must never collapse them into an unexplained single judgment.

For example:

**High Match + Low Opportunity Quality ≠ automatic pursuit recommendation**

and:

**Moderate Match + Strong Opportunity Quality ≠ automatic rejection**

The user should be able to understand the relevant tradeoff.

---

## 8. Stage boundaries

### Stage 2 owns
- user journey
- experience sequence
- screen/state responsibilities
- user decisions
- experience-level information requirements
- empty and degraded experience states
- action pathways
- Peer Lead Network experience placement

### Stage 2 does not own
- authoritative data schemas
- database implementation
- search provider implementation
- evidence extraction implementation
- matching algorithms
- ranking weights
- scoring formulas
- technical application implementation
- authentication, entitlement validation, activation-key generation/storage, session enforcement, Gumroad event verification, and Tavily API execution

Those responsibilities belong to later stages. Stage 17 owns security/privacy/trust controls; Stage 19 owns production purchase/access/provider integration.

---

## 9. Stage 2 → Stage 3 handoff contract

Stage 3 must receive from Stage 2:

1. Complete primary user journey.
2. Major screens and states.
3. User decisions and action outcomes.
4. Required information at each experience point.
5. Required distinctions between hard requirements and preferences.
6. Required distinction between match and opportunity quality.
7. Required visibility of evidence and uncertainty.
8. Required result categories.
9. Required opportunity actions.
10. Required empty, weak, verification, stale, conflict, failure, and degraded states.
11. Peer Lead Network placement and architectural separation.
12. Experience boundaries that Stage 3 must support through authoritative domain and data contracts.
13. The pre-entry buyer activation journey, access-related experience states, and authorized-session entry path.
14. The separation between onboarding material, buyer entitlement, activation credentials, and infrastructure-provider credentials.

Stage 3 must convert these experience requirements into authoritative domain objects and system contracts without redefining the product journey.

---

## 10. Handoff navigation

**Previous stage:**  
[Stage 1 — Product Definition & System Contract](./stage-01-product-definition-and-system-contract.md)

**Next stage:**  
[Stage 3 — Domain, Data & System Contracts](./stage-03-domain-data-and-system-contracts.md)

The Stage 3 link resolves to the existing authoritative Stage 3 specification. Stage 2's handoff is binding: Stage 3 must preserve the journey and experience states without taking ownership of presentation or security policy.

---

## 11. Stage 2 acceptance criteria

Stage 2 can only PASS when:

- The journey is complete from entry through decision and management.
- The five user architecture decisions are represented accurately.
- All major experience states are defined.
- Results categories are defined without collapsing the underlying intelligence model.
- Evidence, reasoning, uncertainty and risk are visible at the appropriate experience level.
- User decision authority is preserved.
- Peer Lead Network remains separate from matching logic.
- Stage 1 principles are preserved.
- Stage 3 has enough information to define authoritative domain and system contracts.
- The Stage 2 specification is committed to GitHub main.
- The specification has been reviewed against Stage 1.
- No Stage 1 rule was silently redefined.
- The Stage 2 → Stage 3 handoff is explicit.

---

## 12. Execution gate

After this architecture is accepted, implementation follows the project's permanent execution cycle:

**Inspect → Analyze → Build → Test → Review → Commit → Push → Handoff**

No Stage 3 implementation begins until Stage 2 passes its acceptance gate.

---

## 13. Implementation and review record

### Implementation scope

Stage 2 implementation is the authoritative journey and experience specification. No production application code is introduced at this stage because production integration and deployment architecture belong to Stage 19, while visible product work may emerge progressively in later stages after their contracts are locked. The experience must first be translated into authoritative domain and system contracts in Stage 3.

### Verification completed

- Stage 1 handoff requirements were checked against the Stage 2 journey.
- All five user decisions were checked against the specification.
- The complete primary journey is represented.
- Major screens and states are represented.
- Empty, weak, verification, stale, missing information, conflict, search failure, and degraded states are represented.
- Match and opportunity quality remain distinct.
- Evidence, reasoning, uncertainty, and risk remain visible experience requirements.
- User decision authority remains explicit.
- Peer Lead Network remains separate from matching and ranking logic.
- Stage 2 boundaries do not claim ownership of Stage 3 or later technical responsibilities.
- The Stage 2 → Stage 3 handoff is explicit.

### Review result

**PASS — Stage 2 is internally consistent with the locked Stage 1 contract and is ready to hand off to Stage 3.**

### Status

**STAGE 2 — COMPLETED**


---

## Stage 2 completion and consolidation record

- The complete user journey, screen/state architecture, decision hierarchy, failure and degraded states, boundaries, and Stage 2 → Stage 3 handoff are consolidated in this authoritative document.
- The separate Stage 2 handoff document is not required; its downstream contract is maintained in Section 9.
- This completion records architecture consolidation and cross-stage consistency, not production UI implementation or runtime test completion.

---

## 14. Locked Visual Design System

### 14.1 Ownership and purpose
Stage 2 owns the user-facing visual direction and experience-level design rules for T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™. These rules apply consistently to the welcome experience, brief creation, discovery, opportunity results, intelligence dossiers, Apply / Save / Pass / Verify controls, history, settings, activation, and error/recovery screens.

This section is the authoritative home of the visual design decision previously maintained separately. It locks the design direction and implementation tokens; it does not claim that the production UI has been implemented or tested.

### 14.2 Brand direction
Use a premium teal-and-black identity: dark, restrained, modern, evidence-oriented, and legible. Teal is the primary brand/action accent. Black and charcoal establish the main surfaces. Soft white and muted neutral tones carry content. Semantic colors are reserved for meaningful status and feedback.

The brand must consistently display **T4L GROWTH™**, **THE CLIENT OPPORTUNITY MATCHER™**, creator attribution **by Terrence**, and the **Exploded T** brand mark where appropriate to the screen and its hierarchy.

### 14.3 Canonical semantic color tokens
| Token | Hex | Required use |
|---|---|---|
| `color.brand.teal` | `#0D9488` | Brand accent, restrained highlights, selected indicators, progress, and emphasis |
| `color.action.primary` | `#0F766E` | Primary interactive controls with light text; primary calls to action |
| `color.background.base` | `#0B0B0D` | Main application background |
| `color.surface.default` | `#17191C` | Cards, panels, and standard surfaces |
| `color.surface.raised` | `#1F2327` | Nested panels, focused/raised surfaces, and menus where needed |
| `color.border.default` | `#343B40` | Structural borders and separators; never the sole state indicator |
| `color.text.primary` | `#F5F7F7` | Main content and headings on dark surfaces |
| `color.text.secondary` | `#B8C0C4` | Supporting text and secondary metadata |
| `color.status.success` | `#4ADE80` | Confirmed successful operations and positive system status |
| `color.status.warning` | `#F59E0B` | Caution, limitations, pending verification, or attention required |
| `color.status.danger` | `#F87171` | Errors, blocked actions, security warnings, and destructive-action feedback |
| `color.status.info` | `#60A5FA` | Neutral informational messages and system guidance |

These are canonical semantic tokens, not permission to scatter raw hex values throughout implementation files. Components must reference centrally defined tokens. Palette changes must update the central definitions and be reviewed for contrast, accessibility, and meaning.

### 14.4 Meaning and state rules
1. **Teal identifies brand and primary interaction, not truth.** It must not imply that an opportunity is verified, eligible, high-quality, safe, or recommended unless the responsible architecture stage's evidence-backed state supports that meaning.
2. **Status colors require labels.** Pair color with visible text and, where useful, an icon or shape. Meaning must never depend on color alone.
3. **Keep product judgments distinct.** Eligibility, fit, ranking, opportunity quality, risk, recommendation, and user action remain separate. A success color must not collapse or override their authoritative states.
4. **Keep uncertainty visible.** Unknown, conflicting, stale, inferred, unsupported, withheld, incomplete, and degraded states must use plain language and must not be silently mapped to positive or negative states.
5. **No decorative traffic-light scoring.** A numerical fit score must not be styled as a probability of success, guarantee, or opportunity-quality verdict. Use the state and explanation supplied by the owning stage.
6. **Destructive actions are not primary actions.** Revocation, deletion, and irreversible operations require clear labels and proportionate confirmation.
7. **Apply / Save / Pass / Verify remain distinct by wording and behavior**, not color alone. A click or navigation event is not proof of external completion.

### 14.5 Accessibility and contrast
- Meet WCAG 2.2 AA contrast requirements wherever applicable: at least 4.5:1 for normal text and 3:1 for large text and meaningful UI graphics/boundaries.
- Test actual rendered foreground/background combinations during implementation; do not assume every palette pairing passes because individual colors are approved.
- Do not use small white text on the brand-teal accent unless the specific pairing passes contrast checks. Prefer the primary-action token for light-on-dark button text, then verify it.
- Provide visible keyboard focus, logical tab order, accessible names, and non-color state indicators.
- Check hover, focus, active, disabled, error, loading, success, and high-contrast behavior. Disabled controls must remain understandable.
- Respect reduced-motion preferences; animation must not be necessary to understand state or progress.

### 14.6 Component and screen consistency
- Primary buttons use the primary-action token with clear focus and disabled states.
- Secondary buttons use neutral surfaces/borders and readable text without competing with the primary action.
- Cards and panels use the canonical surface tokens and a consistent spacing, radius, and border system.
- Evidence and provenance prioritize readable source labels, evidence status, timestamps/freshness, and uncertainty. Visual polish must never imply verification.
- Warnings and risks use warning/danger semantics only when supported by the assessment data, always accompanied by explanatory text.
- Empty, loading, error, partial, and degraded states are explicit experience states, never blank screens or misleading success states.
- Mobile-first design preserves hierarchy, contrast, touch-target usability, and legibility on narrow screens before desktop expansion.

### 14.7 Ownership, implementation, and change control
- **Stage 1** owns product identity, brand direction, and high-level experience principles.
- **Stage 2** owns this user-facing visual system and its design rules.
- **Application implementation** must translate these tokens into one central theme, reusable components, and responsive screen behavior within the agreed 20-stage architecture. It must not create a Stage 21 or a separate application stage.
- **Stage 20 — Final Readiness & Launch Gate** verifies rendered consistency, contrast, state semantics, accessibility, and behavior.
- Changes to the teal-and-black direction or semantic color meanings require an explicit update to this Stage 2 specification. Implementation convenience alone is not sufficient reason to introduce a competing palette.

### 14.8 Acceptance criteria
The visual system is considered implemented only when every screen uses the same central token set; no competing palette is introduced; rendered foreground/background combinations are contrast-tested; labels remain understandable without color; evidence, uncertainty, eligibility, fit, ranking, quality, risk, recommendation, and user action remain distinct; and keyboard focus, mobile layouts, loading/error/empty/degraded states, and primary interactions are checked. Stage 20 records the verification outcome.

Documenting this system alone does not count as implementation or a passing test.
