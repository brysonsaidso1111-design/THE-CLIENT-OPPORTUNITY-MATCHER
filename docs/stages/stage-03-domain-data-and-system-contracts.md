# Stage 3 — Domain, Data & System Contracts

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Brand mark:** The Exploded T  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Status:** STAGE 3 — COMPLETED (ARCHITECTURE CONSOLIDATED)

---

## 1. Purpose

Stage 3 converts the locked Stage 1 product constitution and Stage 2 user journey into the authoritative domain, data, and system contracts.

Stage 3 defines what the system knows, the authoritative objects that represent that knowledge, how those objects relate, what states and distinctions must be preserved, and what contracts later stages must consume.

Stage 3 does not implement search providers, evidence extraction, matching algorithms, scoring formulas, ranking weights, production UI, or database infrastructure. Those responsibilities belong to later stages.

---

## 2. Locked architecture decisions

### Decision 1 — Central domain model
**D: Hybrid — User + Hunt + Opportunity**

The primary relationship is:

**User Profile → Search Intent / Hunt → Discovered Opportunities → Evidence → Eligibility / Match / Ranking → Opportunity Intelligence → User Decision**

This preserves persistent user capability information while keeping each hunt traceable and each opportunity independently represented.

### Decision 2 — Requirement representation
**C: Structured constraint model**

Requirements and preferences are represented as structured constraints rather than vague text fields.

A constraint must be capable of representing:
- subject being constrained
- required versus preferred status
- value or acceptable value
- acceptable alternatives where relevant
- importance
- source
- satisfaction state
- unknown state

Stage 3 defines the structure, not scoring weights or matching formulas.

### Decision 3 — Opportunity representation
**C: Canonical opportunity + related objects**

The Opportunity is the canonical record for the discovered client opportunity. Related concepts remain authoritative objects where separation improves clarity, traceability, and reuse.

Core relationships include:
- Opportunity
- Client
- Requirements
- Deliverables
- Budget
- Timeline
- Engagement
- Location
- Source
- Evidence
- Status
- Freshness / knowledge state

Provider-specific formats must be normalized into this canonical model by later stages.

### Decision 4 — Evidence connection
**C: Claim → Evidence model**

Material system claims must be traceable to supporting evidence.

The conceptual chain is:

**Claim → Evidence → Source → Capture time → Evidence quality / knowledge state**

The model must allow later stages to explain why a fact or finding exists and to identify limitations.

### Decision 5 — Uncertainty representation
**C: Structured knowledge state**

Important facts must carry an explicit knowledge state rather than silently becoming certain.

The initial authoritative states are:
- **Verified**
- **Supported**
- **Inferred**
- **Unknown**
- **Conflicting**
- **Stale**

Knowledge state may be accompanied by supporting evidence, source information, and timestamps where applicable.

---

## 3. Authoritative domain model

### 3.1 User Profile

Represents the freelancer or independent service provider using the product.

The profile may contain:
- identity-independent product settings
- services
- capabilities
- skills
- experience
- deliverables
- domains
- preferences
- constraints
- pricing / rate information where provided
- availability where provided
- goals
- other capability signals required by later matching stages

The User Profile must not be confused with a single hunt.

### 3.2 Search Intent / Hunt

Represents one user-directed opportunity discovery request.

A Hunt connects:
- the user's current brief
- hard requirements
- preferences
- hunt configuration
- discovery attempt
- discovered candidate opportunities
- resulting intelligence
- user outcomes

A Hunt must remain traceable so the system can distinguish one research attempt from another.

### 3.3 Constraint

Represents a requirement or preference that can affect opportunity evaluation.

A Constraint must distinguish at minimum:
- requirement type
- subject
- desired value
- alternatives where applicable
- importance
- satisfaction state
- unknown state
- provenance where applicable

The authoritative distinction is:

**Hard requirement ≠ preference**

A preference must never silently become a hard exclusion.

### 3.4 Opportunity

Represents a normalized potential client opportunity that the system can evaluate.

An Opportunity may include:
- title
- summary / description
- client reference
- requirements reference
- deliverables reference
- budget reference
- timeline reference
- engagement reference
- location reference
- source reference
- evidence references
- freshness state
- current lifecycle state
- missing information
- conflicts
- other canonical facts

An Opportunity is not itself a match, recommendation, or guarantee.

### 3.5 Client

Represents the client or organization associated with an opportunity where identifiable.

Client information may include:
- name
- organization
- location
- relevant public profile information
- client-related evidence
- client information state
- missing or conflicting information

Unknown client information must remain unknown.

### 3.6 Requirement

Represents a requirement extracted or normalized from an opportunity.

Requirements may concern:
- capability
- skill
- experience
- deliverable
- location
- engagement
- timeline
- budget
- other material opportunity conditions

Requirements are opportunity-side facts and must not be confused with the user's constraints.

### 3.7 Deliverable

Represents an expected output, service outcome, or project deliverable associated with an opportunity.

Deliverables support later capability and semantic matching.

### 3.8 Budget

Represents budget information associated with the opportunity.

Budget may contain:
- amount or range
- currency
- budget type
- source
- knowledge state
- ambiguity or missing information

No budget must be invented when the source does not provide one.

### 3.9 Timeline

Represents timing information associated with an opportunity.

It may include:
- deadline
- expected start
- expected duration
- urgency
- source
- knowledge state

### 3.10 Engagement

Represents the type or structure of work being offered.

Examples may include:
- project
- ongoing
- contract
- one-time
- other normalized engagement types

Exact provider-specific values belong to later source normalization.

### 3.11 Location

Represents geographic or remote-work information relevant to the opportunity or user constraint.

Location must support the product's global scope and must not assume a single country, currency, or local market.

### 3.12 Source

Represents the origin of discovered opportunity information.

A Source identifies where information came from without itself determining whether that information is true, current, or suitable.

Detailed source acquisition and provider behavior belong to Stage 4.

### 3.13 Evidence

Represents captured support for a material claim or fact.

Evidence should be traceable to:
- source
- captured content or relevant excerpt/reference
- capture time
- related claim or fact
- knowledge state / quality information

Detailed evidence and provenance rules are expanded in Stage 5.

### 3.14 Claim

Represents a material statement the system may rely on or communicate.

Examples:
- a stated budget
- a stated required skill
- a stated location
- a client identity
- a project timeline

Claims must be supportable by evidence when evidence is required.

### 3.15 Eligibility

Represents whether an opportunity satisfies hard constraints sufficiently to remain eligible for matching.

Eligibility is distinct from match strength.

### 3.16 Match

Represents the degree to which the user's capabilities and intent align with an eligible opportunity.

Match is distinct from:
- eligibility
- ranking
- opportunity quality
- recommendation

### 3.17 Ranking

Represents the ordered prioritization of opportunities after applicable eligibility and matching logic.

Ranking is not itself a recommendation.

### 3.18 Opportunity Quality

Represents how worthwhile, clear, credible, and actionable an opportunity appears independently of how well it fits the user.

Opportunity Quality must remain separate from Match.

### 3.19 Recommendation

Represents the system's decision guidance after considering relevant intelligence.

A Recommendation is guidance, not a guarantee.

### 3.20 Opportunity Intelligence

Represents the combined decision-ready understanding of an opportunity, including:
- opportunity facts
- evidence
- match findings
- quality findings
- risks
- uncertainty
- important gaps
- recommendation
- next action

### 3.21 User Decision

Represents the user's chosen action.

Stage 2 establishes the primary actions:
- Apply
- Save
- Pass
- Verify

The system must preserve the difference between a system recommendation and the user's actual decision.

### 3.22 Feedback

Represents explicit or behavioral information that may later improve personalization.

Feedback must not silently override user authority.

### 3.23 Memory

Represents durable personalization signals derived from appropriate profile information, feedback, and user history.

User decisions and opportunity actions belong to Stage 13; feedback and governed learning signals belong to Stage 14; opportunity lifecycle states and transitions belong to Stage 15; technical failure, degradation, and recovery semantics belong to Stage 16. Stage 16 operational state is not opportunity lifecycle state. Any personalization memory must respect those contracts and the security/privacy boundaries owned by Stage 17.

---

## 4. Relationship model

The authoritative conceptual relationship is:

**User Profile**
→ creates **Search Intent / Hunt**
→ contains **Constraints**
→ produces candidate **Opportunities**
→ opportunities contain **Claims / Facts**
→ claims are supported by **Evidence**
→ evidence identifies **Sources**
→ hard constraints produce **Eligibility**
→ eligible opportunities are evaluated for **Match**
→ opportunities are **Ranked**
→ opportunities receive separate **Opportunity Quality**
→ combined intelligence produces a **Recommendation**
→ the system presents **Opportunity Intelligence**
→ the **User Decision** becomes Apply / Save / Pass / Verify
→ later **Feedback** and appropriate **Memory** may inform future personalization

This relationship is authoritative for Stage 3 and must not be replaced by provider-specific or UI-specific terminology.

---

## 5. Mandatory conceptual distinctions

The system must preserve all of the following distinctions:

**User Profile ≠ Hunt**

**User Constraint ≠ Opportunity Requirement**

**Hard Requirement ≠ Preference**

**Source ≠ Evidence**

**Evidence ≠ Claim**

**Eligibility ≠ Match**

**Match ≠ Ranking**

**Match ≠ Opportunity Quality**

**Opportunity Quality ≠ Recommendation**

**Recommendation ≠ User Decision**

**Unknown ≠ Negative**

**Inferred ≠ Verified**

**Stale ≠ Current**

**Conflict ≠ Certainty**

These distinctions are foundational system contracts.

---

## 6. Knowledge state contract

Every material fact or claim that can affect user understanding must be capable of carrying an explicit knowledge state.

### Verified
The available evidence sufficiently establishes the fact for the system's intended use.

### Supported
The evidence provides meaningful support, but the fact should not be represented as fully verified.

### Inferred
The system derived the information from available evidence rather than receiving it as a directly stated fact.

### Unknown
The required information is unavailable or cannot be established.

### Conflicting
Relevant evidence materially disagrees.

### Stale
The information may once have been valid but is no longer sufficiently current for confident use.

The system must not silently convert Unknown, Conflicting, Stale, or Inferred information into Verified information.

---

## 7. Constraint contract

Constraints must support at least:

| Attribute | Purpose |
|---|---|
| subject | What the constraint concerns |
| type | Hard requirement or preference |
| value | Desired or required value |
| alternatives | Acceptable alternatives where relevant |
| importance | Relative significance without defining scoring |
| satisfaction | Satisfied, unsatisfied, partial, unknown, or not applicable where supported |
| provenance | Where the constraint originated |
| state | Current knowledge state |

Stage 3 defines the contract only. Stage 7 owns eligibility and constraint evaluation. Stage 8 owns semantic matching and fit evaluation. Stage 9 owns match scoring and fit evaluation; Stage 10 owns ranking and prioritization.

---

## 8. System state contract

The domain model must support the major experience states required by Stage 2:

- empty
- weak result
- needs verification
- low fit
- stale opportunity
- missing information
- conflict
- search failure
- partial / degraded

These are experience-visible conditions. They must be backed by authoritative domain state rather than UI-only labels.

---

## 9. User decision contract

The system must preserve these actions:

### Apply
The user chooses to pursue the opportunity.

### Save
The user chooses to retain the opportunity for later.

### Pass
The user chooses not to pursue the opportunity.

### Verify
The user chooses to resolve uncertainty before deciding.

A Recommendation may guide these actions but must never be stored or displayed as if it were the user's decision.

---

## 10. Data ownership boundaries

### Stage 3 owns
- authoritative domain vocabulary
- object definitions
- relationships
- required conceptual states
- system-level distinctions
- domain contracts
- experience-to-domain mapping
- boundaries between authoritative objects

### Stage 3 does not own
- source discovery strategy
- source/provider implementation
- evidence extraction implementation
- canonicalization algorithms
- eligibility algorithms
- semantic matching algorithms
- scoring formulas
- ranking weights
- recommendation algorithms
- production database implementation
- production frontend implementation
- authentication, authorization, buyer-entitlement policy, activation credential/session design, and secret management (Stage 17)
- production purchase verification, Gumroad entitlement synchronization, and provider-specific execution (Stage 19)

Those responsibilities belong to later stages.

---

### Cross-cutting buyer-access boundary (reserved for Stages 17 and 19)

Buyer access must remain a separate authorization/entitlement concern, not a matching-domain attribute or a user preference. The domain architecture must permit an authenticated principal to be associated with the appropriate product user/profile while keeping purchase entitlement, activation credential, and session state under Stage 17's security contract. Stage 19 connects verified Gumroad purchase/refund/chargeback events, entitlement records, activation delivery, session establishment, and protected app access.

The Stage 3 domain model does not define credential storage or security schemas. It does require that:
- access entitlement is not inferred from a URL, quickstart PDF, client-side flag, or an ordinary User Profile field;
- each buyer's activation credential and entitlement are distinguishable from the shared Tavily/provider service credential;
- matching data, buyer identity/access records, and provider secrets remain separate data/security domains;
- later access checks can authorize the user before reading or mutating user-scoped profiles, Hunts, feedback, actions, or lifecycle records.

Stage 17 owns security semantics and credential protection; Stage 19 owns the production integration and persistence mechanisms. Stage 20 verifies bypass resistance, revocation, and authorized/unauthorized paths.

---

## 11. Downstream stage contracts

### Stage 4 — Opportunity Source & Discovery Architecture
Consumes:
- Opportunity
- Source
- Hunt
- Search Intent

Must define how external sources are selected and queried without changing the canonical domain model.

### Stage 5 — Evidence & Provenance Architecture
Consumes:
- Claim
- Evidence
- Source
- Knowledge State

Must define detailed evidence traceability without changing the foundational distinctions.

### Stage 6 — Opportunity Normalization & Canonicalization
Consumes:
- Opportunity
- Client
- Requirement
- Deliverable
- Budget
- Timeline
- Engagement
- Location
- Source

Must convert discovered source data into the canonical model.

### Stage 7 — Eligibility & Constraint Evaluation Architecture
Consumes canonical opportunities, user constraints, and evidence/knowledge-state metadata to produce structured eligibility results without performing semantic fit or ranking.

### Stage 8 — Semantic Matching & Fit Evaluation
Evaluates semantic and capability fit among opportunities that remain eligible or explicitly uncertain, without redefining hard eligibility.

### Stage 9 — Match Scoring & Fit Evaluation
Produces a transparent, multidimensional fit assessment from Stage 8 outputs without collapsing uncertainty or opportunity quality into an unexplained score.

### Stage 10 — Ranking & Prioritization
Orders evaluated opportunities using declared priorities and fit signals while preserving the distinction between fit, opportunity quality, and user preference.

### Stage 11 — Opportunity Intelligence & Explanation
Assembles evidence-backed reasons, gaps, uncertainty, differentiators, and decision context without inventing support.

### Stage 12 — Recommendation & Decision Support
Provides reasoned recommendations and alternatives while preserving the user's final decision authority.

### Stage 13 — User Decision & Opportunity Actions
Owns user-directed actions such as save, pass, pursue, verify, and revisit.

### Stage 14 — Feedback & Learning
Owns structured feedback and learning signals without rewriting evidence, truth, or user decisions.

### Stage 15 — Opportunity Lifecycle
Owns user-scoped lifecycle states and transitions such as discovered, saved, in review, closed, expired/unavailable, and archived. It does not own cross-system operational failure state.

### Stage 16 — Failure, Degradation & Recovery
Defines consistent handling of partial results, provider failures, missing inputs, and recovery without confusing technical failure with business ineligibility.

### Stage 17 — Security, Privacy & Trust
Owns authentication, authorization, buyer entitlement and activation, secret handling, privacy, and protection of customer data.

### Stage 18 — Analytics, Observability & Quality
Measures system behavior, access outcomes, reliability, and intelligence quality without becoming a decision engine.

### Stage 19 — Integration & Production Architecture
Connects the stage contracts and providers into the production system, including deployment and operational integration.

### Stage 20 — Final Product Readiness & Launch Gate
Verifies end-to-end behavior, security, reliability, buyer access controls, and launch acceptance.

---

## 12. Stage 3 acceptance criteria

Stage 3 can only PASS when:

- The central User + Hunt + Opportunity model is explicit.
- The authoritative domain objects are defined.
- Object relationships are explicit.
- Hard requirements and preferences are structurally distinct.
- Opportunity-side requirements are distinct from user-side constraints.
- Evidence and claims are explicitly related.
- Source and evidence remain distinct.
- Knowledge states are explicit.
- Eligibility, Match, Ranking, Opportunity Quality, Recommendation, and User Decision remain distinct.
- Stage 2 experience states have authoritative domain support.
- User decision authority is preserved.
- Global scope is preserved.
- Peer Lead Network remains outside matching logic.
- Later stage ownership boundaries are explicit.
- No Stage 4 or later implementation has been prematurely introduced.

---

## 13. Stage 2 → Stage 3 traceability

Stage 2 requires:
- simple brief → represented by Hunt and Search Intent
- advanced preferences → represented by structured Constraints
- result categories → supported by Eligibility, Match, Ranking, Opportunity Quality, and Recommendation
- evidence visibility → supported by Claim, Evidence, Source, and Knowledge State
- uncertainty visibility → supported by Knowledge State
- Apply / Save / Pass / Verify → supported by User Decision
- empty / weak / verification / stale / conflict / failure / degraded states → supported by authoritative domain states
- Peer Lead Network separation → preserved as an experience/ecosystem boundary rather than a matching domain object

---

## 14. Handoff navigation

**Previous stage:**  
[Stage 2 — User Journey & Experience Architecture](./stage-02-user-journey-and-experience.md)

**Next stage:**  
[Stage 4 — Opportunity Source & Discovery Architecture](./stage-04-opportunity-source-and-discovery-architecture.md)

The Stage 4 link resolves to the existing authoritative Stage 4 specification. Stage 3's handoff is binding: Stage 4 must consume the canonical domain and source contracts without redefining them.

---

## 15. Execution gate

After Stage 3 architecture is accepted, implementation follows the permanent project cycle:

**Inspect → Analyze → Build → Test → Review → Commit → Push → Handoff**

Stage 4 must not begin until Stage 3 passes its acceptance gate.

---

## 16. Implementation and review record

### Implementation scope

Stage 3 implementation is the authoritative domain, data, and system contract specification. No production search, evidence, matching, scoring, ranking, database, or frontend implementation was introduced because those responsibilities belong to later stages.

### Verification completed

- Stage 2 requirements were traced into authoritative domain objects and states.
- The User + Hunt + Opportunity model is explicit.
- Hard requirements and preferences are structurally distinct.
- User constraints and opportunity requirements are distinct.
- Claims, evidence, and sources are distinct and traceable.
- Structured knowledge states preserve uncertainty.
- Eligibility, Match, Ranking, Opportunity Quality, Recommendation, and User Decision remain distinct.
- Stage 2 decision actions are represented.
- Stage 2 empty, weak, verification, stale, conflict, failure, and degraded conditions have domain support.
- Global scope is preserved.
- Peer Lead Network remains outside matching logic.
- Later stage ownership boundaries are explicit.
- No Stage 4 or later implementation was introduced.
- The specification is committed to GitHub main and re-read from the repository after commit.

### Review result

**PASS — Stage 3 is internally consistent with the locked Stage 1 and Stage 2 contracts and is ready to hand off to Stage 4.**

### Status

**Architecture decisions locked: D / C / C / C / C**

**STAGE 3 — COMPLETED**


---

## Stage 3 completion and consolidation record

- The authoritative Stage 3 architecture, its domain-specific decisions, constraints, failure conditions, ownership boundaries, and downstream handoff contract are maintained in this document.
- Redundant standalone handoff and audit documents are not needed when their binding requirements are preserved here.
- This completion records architecture consolidation and consistency with prior stages; it does not claim that production application code or runtime tests for this stage have been implemented.


---

## Stage 3 → Stage 4 operational handoff contract (consolidated)

- **Consumes:** Stage 1 product constitution and Stage 2 user journey.
- **Creates:** Authoritative domain, data, terminology, knowledge-state, and system contracts, including the distinctions among User Profile, Hunt/Search Intent, Opportunity, Source, Evidence, Claim, Eligibility, Match, Ranking, Opportunity Quality, Recommendation, and User Decision.
- **Guarantees:** Domain entities and system states retain their separate meanings; unknown, inferred, stale, and conflicting information are not silently collapsed; downstream stages cannot redefine the locked product or journey.
- **Stage 4 receives:** Canonical domain concepts and contracts for Source, Hunt/Search Intent, Opportunity, Evidence/provenance, knowledge states, and data boundaries, used to design discovery without changing the domain model.
- **Locked answers:** **D / C / C / C / C**.
- **Status:** Stage 3 PASS / LOCKED.
