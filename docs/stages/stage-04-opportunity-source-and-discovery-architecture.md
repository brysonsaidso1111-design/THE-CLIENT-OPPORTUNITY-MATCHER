# Stage 4 — Opportunity Source & Discovery Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Brand mark:** The Exploded T  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Status:** STAGE 4 — COMPLETED (ARCHITECTURE CONSOLIDATED)

---

## 1. Purpose

Stage 4 defines how THE CLIENT OPPORTUNITY MATCHER™ discovers candidate client opportunities from external information sources.

Stage 4 is the discovery architecture between the Stage 3 domain contract and later evidence, normalization, and live discovery implementation.

The core responsibility is:

**Find relevant candidate opportunities without pretending discovery itself proves truth, fit, quality, or recommendation.**

Stage 4 defines:

- source representation
- source capabilities
- source limitations
- discovery strategy
- query construction
- source selection
- freshness handling
- duplicate handling
- discovery failure behavior
- partial and degraded discovery
- cost and search budget controls
- discovery traceability

Stage 4 does not implement live providers or production search execution. Those responsibilities belong to later stages.

---

## 2. Locked architecture decisions

### Decision 1 — Source architecture

**D: Hybrid Source Registry + Capability Model**

Every source is represented by a structured registry record and a capability model.

A source record must be able to describe:

- source identity
- source type
- access method
- opportunity types discoverable
- searchable fields
- filtering capabilities
- query capabilities
- location coverage
- budget visibility
- client information visibility
- freshness characteristics
- pagination or result limits
- access restrictions
- known limitations
- reliability information
- cost characteristics
- supported discovery modes

The capability model exists so the system can ask:

**What can this source actually do for this hunt?**

A source must never be treated as interchangeable with another source simply because both return opportunity records.

---

### Decision 2 — Discovery strategy

**D: Hybrid Structured + Semantic Discovery**

Discovery combines structured hunt constraints with semantic query intelligence.

Structured information controls important boundaries such as:

- service
- capability
- target client type
- location
- remote or physical requirements
- engagement type
- budget conditions
- timeline conditions
- other hard discovery constraints

Semantic discovery may expand terminology, phrasing, related service language, problem language, deliverable language, and other meaningful variations.

Semantic expansion must not silently weaken hard constraints.

The architecture therefore follows:

**Structured controls → Semantic expands discovery → Source returns candidates**

Discovery is broader than exact keyword matching but remains controlled by the user's actual hunt.

---

### Decision 3 — Query construction

**D: Adaptive Query Strategy**

The system uses controlled query families and adapts discovery only when justified by the quality or coverage of returned candidates.

A query family may include:

- service queries
- capability queries
- problem or need queries
- deliverable queries
- client type queries
- location queries
- engagement queries
- terminology variants
- source specific query forms

The system must not automatically execute unlimited query variations.

Every query attempt belongs to the Hunt and must remain traceable.

Adaptive behavior may respond to:

- insufficient candidate volume
- weak terminology coverage
- poor source compatibility
- excessive duplicates
- missing required opportunity attributes
- source limitations
- degraded source response

Adaptive expansion must remain within the hunt's configured search budget.

---

### Decision 4 — Source selection

**C: Capability Based Routing**

Source selection is driven by the relationship between the Hunt requirements and registered source capabilities.

A source may be selected because it has useful capabilities for:

- the requested service
- the opportunity type
- location coverage
- budget visibility
- engagement information
- freshness
- query flexibility
- structured filtering
- semantic discovery
- client information
- other material hunt needs

The system should prefer sources that provide the information needed for the current hunt rather than treating all sources equally.

Source routing is not ranking of opportunities.

It only determines where discovery should be attempted.

**User-selection constraint:** capability routing must be applied only after the authenticated user's saved source selection is loaded and authorized. The effective discovery set is the intersection of (1) sources explicitly selected by that user, (2) sources that support the required operation, (3) sources allowed by the current policy/access rules, and (4) sources whose required setup and operational health permit execution. Capability routing must never silently add an unselected source. Unknown, unsupported, unauthorized, or unavailable selections must be returned as explicit per-source states, not counted as searched.

The home-page Sources experience, saved-selection semantics, and UI states are defined in [the Stage 2 journey](./stage-02-user-journey-and-experience.md) and the [Sources page contract](../source-selection.md). Stage 17 owns authorization and isolation policy; Stage 19 owns persistence and runtime enforcement.

---

### Decision 5 — Freshness, duplicates, and failures

**C: Structured Freshness + Duplicate Detection + Failure States**

Discovery must explicitly represent:

- discovery timestamp
- source supplied timestamp where available
- freshness state
- duplicate identity signals
- duplicate relationships
- source conflicts
- missing source information
- unavailable source
- failed query
- timeout or access failure
- partial results
- degraded discovery

A discovered candidate must not appear current merely because the system found it recently.

A duplicate must not become multiple independent opportunities simply because it appears through multiple sources.

A source failure must not be represented as zero opportunities.

---

## 3. Discovery responsibility boundary

Stage 4 sits between the domain contract and later execution.

The conceptual flow is:

**User Profile / Hunt**
→ **Discovery Requirements**
→ **Source Capability Evaluation**
→ **Source Selection**
→ **Controlled Query Construction**
→ **Candidate Discovery**
→ **Freshness / Duplicate / Failure Handling**
→ **Candidate Opportunity Set**
→ **Stage 5 Evidence Architecture**
→ **Stage 6 Normalization & Canonicalization**

Stage 4 defines the architecture of this flow.

It does not perform provider calls itself. Stage 19 integrates this architecture into live provider execution and the production system; it is an implementation/integration owner, not a downstream data-processing step.

---

## 4. Source registry contract

Each registered source should be represented with a consistent capability profile.

### 4.1 Source identity

The registry must distinguish:

- source identifier
- source name
- source category
- source endpoint or acquisition reference where appropriate
- source status
- source ownership or provider identity where relevant

A source identifier must remain stable enough for discovery history and provenance.

### 4.2 Source category

The architecture should allow categories such as:

- freelance marketplace
- professional network
- business directory
- public company source
- job or contract board
- public web source
- specialized industry source
- other legitimate opportunity source

The category is descriptive. It must not automatically imply quality.

### 4.3 Capability profile

A source capability profile should be able to represent:

| Capability | Meaning |
|---|---|
| opportunity search | Can locate candidate opportunities |
| structured filtering | Supports structured discovery conditions |
| semantic or flexible search | Supports broader language variation |
| location coverage | Geographic scope supported |
| service coverage | Types of services commonly discoverable |
| budget visibility | Whether budget information is commonly available |
| timeline visibility | Whether timing information is available |
| client visibility | Whether client information is available |
| engagement visibility | Whether engagement structure is available |
| freshness visibility | Whether source timing information is available |
| pagination | Whether additional result pages can be requested |
| result limits | Source imposed result limitations |
| access method | API, permitted web retrieval, public source, or other approved method |
| cost characteristics | Search or retrieval cost implications |

Capability information may be known, estimated, or unknown.

Unknown capability must not be silently treated as supported.

### 4.4 Acquisition provider versus evidence source

The architecture must distinguish the **retrieval/acquisition provider** from the **underlying source that publishes an opportunity or claim**. For example, Tavily may be used as a web-search/retrieval provider. Tavily is the acquisition provider; the original publisher page, marketplace listing, company page, or other returned URL remains the candidate evidence source to be evaluated through Stage 5.

A provider adapter contract must expose, as applicable:
- stable provider/adapter ID and version;
- supported operations and query capabilities;
- source/page URL, title, snippet or extracted content when permitted, and any available publication/observation timestamps;
- provider request/query reference and retrieval timestamp;
- pagination/result limits, rate/cost constraints, and relevant coverage limitations;
- per-result provenance and retrieval status;
- timeout, rate-limit, authentication-failure, partial-result, and provider-unavailable outcomes;
- a reference to the required secret/configuration entry, never the raw credential itself.

Provider output is a discovery observation, not proof that a claim is true. Preserve the original URL and provider retrieval metadata so Stage 5 can evaluate evidence authority, directness, recency, conflicts, and provenance. Do not attribute a publisher's claim to Tavily merely because Tavily found the page.

### Credential and execution boundary

Tavily's API key is a platform infrastructure secret, not a buyer credential. It must be injected into server-side execution through protected runtime configuration, never embedded in browser JavaScript, returned to clients, stored in public source-registry fields, written to logs, or committed to Git. Stage 17 owns secret protection and access policy; Stage 19 owns provider adapter execution, secure runtime configuration, and production integration; Stage 16 owns retry/degradation/recovery behavior. A buyer's unique activation key must never be reused as a provider API credential.

---

## 5. Source limitations contract

Every source may have limitations.

Examples include:

- limited geography
- limited service categories
- incomplete budget information
- incomplete client information
- limited search operators
- stale listings
- pagination restrictions
- result caps
- access restrictions
- rate limits
- provider outages
- duplicate listings
- inconsistent terminology

Limitations must be available to routing and discovery logic.

A source with a material limitation should not be selected for a hunt where that limitation makes the source unsuitable unless the system can clearly represent the limitation.

---

## 6. Hunt discovery requirements

Before source routing, the Hunt should be converted into a discovery requirement profile.

The profile may contain:

- requested service
- capability terms
- target client type
- location
- remote preference or requirement
- engagement preference or requirement
- budget conditions
- timeline conditions
- desired opportunity characteristics
- hard constraints
- preferences
- discovery breadth
- search budget
- freshness expectation

The discovery profile must preserve the Stage 3 distinction:

**Hard requirement ≠ preference**

Discovery may use preferences to improve search relevance, but preferences must not silently become hard exclusions.

---

## 7. Query architecture

### 7.1 Query family

A Hunt may generate multiple controlled query forms rather than one literal query.

The query family can contain:

1. primary service query
2. capability variation
3. problem or need variation
4. deliverable variation
5. target client variation
6. location variation
7. engagement variation
8. terminology expansion
9. source specific syntax

Not every Hunt requires every query type.

### 7.2 Query priority

Queries should have a priority so the system can stop early when discovery quality is already sufficient.

High value queries should be attempted before lower value expansions.

### 7.3 Query budget

Every Hunt must have a bounded discovery budget.

The budget should control at minimum:

- maximum discovery attempts
- maximum source attempts
- maximum query expansions
- maximum result volume accepted for processing
- optional provider specific limits

The architecture must make cost control explicit rather than relying on accidental behavior.

### 7.4 Adaptive expansion

Expansion should occur only when a useful reason exists.

Possible triggers:

- too few candidates
- weak candidate relevance
- terminology mismatch
- source limitation
- excessive duplicates
- poor coverage of an important hunt requirement

Expansion should stop when:

- sufficient candidates have been discovered
- the search budget is exhausted
- remaining expansion is unlikely to add useful coverage
- source limitations prevent meaningful improvement

---

## 8. Source capability routing

Routing should compare:

**Hunt requirements ↔ Source capabilities**

The routing decision should consider:

- required capability support
- geographic coverage
- opportunity type
- service coverage
- expected freshness
- expected information completeness
- query compatibility
- access availability
- cost
- known source limitations

Routing must not use final match scores.

Stage 4 answers:

**Where should we search?**

Stage 8 answers:

**How well does this opportunity semantically fit the freelancer?**

Those are different decisions.

---

## 9. Discovery result contract

Discovery returns candidate opportunities, not final recommendations.

Each discovery result should retain enough context to identify:

- Hunt
- source
- query or discovery attempt
- source result identity
- discovered timestamp
- source timestamp where available
- source location or reference
- raw candidate reference
- initial candidate fields
- discovery state
- duplicate indicators
- freshness indicators
- source limitations
- failure or partial result information where applicable

The result may be incomplete.

Incomplete information must remain incomplete until later stages establish more.

---

## 10. Freshness architecture

Freshness must be treated as a knowledge property.

Potential states include:

- current
- recently observed
- aging
- stale
- unknown

Exact thresholds should remain configurable rather than hard coded into the Stage 4 domain architecture.

Freshness may depend on:

- source type
- source supplied update time
- discovery time
- opportunity type
- expected opportunity lifespan
- hunt requirements

The system must distinguish:

**recently discovered ≠ recently updated**

An opportunity discovered today may contain information that was published or updated much earlier.

---

## 11. Duplicate architecture

Duplicate handling must operate across sources as well as within a source.

Potential duplicate identity signals include:

- source native opportunity ID
- canonical source URL
- normalized title
- client identity
- organization identity
- location
- distinctive description signals
- budget or timeline signals
- other stable opportunity characteristics

Duplicate detection should produce a relationship or confidence state rather than silently deleting information.

When multiple sources represent the same opportunity, the system should preserve source provenance.

This supports later evidence and provenance work.

The architecture therefore prefers:

**One canonical opportunity candidate + multiple source observations**

over:

**Multiple apparently independent opportunities**

---

## 12. Source conflict architecture

Different sources may disagree.

Examples:

- different budget
- different deadline
- different title
- different client information
- opportunity appears active in one source and inactive in another

Stage 4 must preserve the conflict rather than deciding which source is correct.

The distinction is:

**Discovery detects source observations. Stage 5 determines evidence and provenance treatment.**

No discovery component may silently convert disagreement into certainty.

---

## 13. Failure architecture

Discovery failures must be explicit.

### Source unavailable

The source could not be reached or used.

### Query failure

A specific discovery request failed.

### Timeout

The source did not respond within the allowed period.

### Access restriction

The source could not be used through the permitted acquisition method.

### Result limitation

The source returned an incomplete or capped result set.

### Partial discovery

Some intended sources or query paths succeeded while others failed.

### Degraded discovery

Discovery completed but with materially reduced coverage or quality.

### No useful candidates

Discovery completed successfully but did not find useful candidates.

These states must remain distinguishable.

**No useful candidates ≠ search failure**

That distinction is essential to honest user communication.

---

## 14. Cost control architecture

The product must optimize for useful opportunity discovery rather than maximum search volume.

Cost controls should therefore exist at multiple levels:

### Hunt level

Limit total discovery work for one user request.

### Source level

Limit attempts against a particular source.

### Query level

Limit adaptive query expansion.

### Result level

Limit the number of candidates carried forward for processing.

### Provider level

Respect provider specific cost, rate, and access constraints.

The system should prefer:

**better targeted discovery → fewer unnecessary searches → higher useful candidate density**

rather than:

**more searches → more results → assumed better discovery**

---

## 15. Discovery quality principles

Discovery quality should consider:

- relevance
- coverage
- freshness
- information completeness
- source suitability
- duplication rate
- failure rate
- search efficiency
- cost efficiency

However, Stage 4 does not create the final Match score or Opportunity Quality score.

Discovery quality answers:

**Did we search intelligently enough to produce a useful candidate set?**

It does not answer:

**Is this opportunity worth pursuing?**

---

## 16. Traceability contract

Every discovery attempt must be traceable to:

**Hunt → Source → Query / Discovery Attempt → Result → Candidate Opportunity**

The trace should support later diagnosis of:

- why a source was selected
- what query was used
- when it was attempted
- what was returned
- whether the source failed
- whether results were partial
- whether duplicates were detected
- whether freshness was known
- whether the search budget was exhausted

This is necessary for explainability, debugging, cost control, and later observability.

---

## 17. Stage boundaries

### Stage 4 owns

- source registry architecture
- source capability model
- source limitation model
- discovery requirement profile
- query family architecture
- adaptive query strategy
- source capability routing
- freshness discovery architecture
- duplicate discovery architecture
- source conflict preservation
- discovery failure states
- search budget architecture
- discovery traceability

### Stage 4 does not own

- detailed evidence extraction
- evidence quality adjudication
- final provenance rules
- canonical normalization algorithms
- live provider implementation
- production API integrations
- hard eligibility logic
- semantic matching
- scoring
- ranking
- recommendation logic
- opportunity quality scoring
- production frontend
- final observability implementation

Those responsibilities belong to later stages.

---

## 18. Downstream contracts

### Stage 5 — Evidence & Provenance Architecture

Consumes discovery outputs, Source references, candidate observations, and traceability.

Must define how claims are connected to evidence and source provenance.

### Stage 6 — Opportunity Normalization & Canonicalization

Consumes candidate source records and converts provider specific information into the canonical Opportunity model.

### Stage 7 — Eligibility & Constraint Evaluation Architecture

Consumes normalized opportunities, user constraints, and evidence states to determine hard-requirement eligibility.

### Stage 8 — Semantic Matching & Fit Evaluation

Evaluates semantic and capability alignment after eligibility, without replacing hard-gate decisions.

### Stage 9 — Match Scoring & Fit Evaluation

Builds a transparent multidimensional fit assessment from semantic fit outputs.

### Stage 10 — Ranking & Prioritization

Orders evaluated opportunities using explicit ranking policy and available fit signals.

### Stage 11 — Opportunity Intelligence & Explanation

Explains match rationale, evidence, gaps, uncertainty, and relevant differentiators.

### Stage 12 — Recommendation & Decision Support

Provides decision support without substituting for the user's decision.

### Stage 19 — Integration & Production Architecture

Connects discovery architecture to actual provider execution and the production system, preserving source capabilities, query traceability, and failure/degradation metadata.

---

## 19. Stage 3 traceability

Stage 4 must preserve the Stage 3 contracts:

- Opportunity remains the canonical opportunity concept.
- Source remains the origin of information, not proof of truth.
- Hunt remains the user directed discovery request.
- Search Intent remains distinct from Opportunity.
- User constraints remain distinct from opportunity requirements.
- Unknown remains unknown.
- Inferred remains distinct from Verified.
- Stale remains distinct from Current.
- Conflict remains distinct from Certainty.
- Discovery remains distinct from Eligibility.
- Discovery remains distinct from Match.
- Discovery remains distinct from Ranking.
- Discovery remains distinct from Opportunity Quality.
- Discovery remains distinct from Recommendation.

---

## 20. Stage 4 acceptance criteria

Stage 4 can PASS only when:

- Source Registry + Capability Model is explicit.
- Source limitations are representable.
- Hunt discovery requirements are explicit.
- Structured and semantic discovery are combined without weakening hard constraints.
- Query families are defined.
- Adaptive query behavior is bounded.
- Search budgets are explicit.
- Source routing is capability based.
- Discovery results remain candidate opportunities rather than recommendations.
- Freshness is explicitly represented.
- Recently discovered and recently updated are distinguishable.
- Duplicate detection can operate across sources.
- Multiple source observations can remain traceable.
- Source conflicts are preserved rather than silently resolved.
- No useful candidates is distinct from search failure.
- Partial and degraded discovery are representable.
- Discovery attempts are traceable to the Hunt.
- Stage 3 domain boundaries remain intact.
- Stage 5 and later responsibilities are not prematurely implemented.

---

## 21. Architecture decision record

### Locked decisions

**Decision 1:** D — Hybrid Source Registry + Capability Model  
**Decision 2:** D — Hybrid Structured + Semantic Discovery  
**Decision 3:** D — Adaptive Query Strategy  
**Decision 4:** C — Capability Based Routing  
**Decision 5:** C — Structured Freshness + Duplicate Detection + Failure States

### Product DNA alignment

These decisions reinforce the product's permanent principles:

**Research First**  
Discovery is deliberate rather than random.

**Evidence Before Confidence**  
Discovery does not masquerade as proof.

**Reasoning Must Be Visible**  
Search decisions remain traceable.

**Budget Matters**  
Search work is bounded and cost controlled.

**Brief Centered Intelligence**  
Discovery begins from the user's actual hunt.

**Honest Information**  
Unknown, stale, conflicting, partial, and failed states remain visible.

**Useful Opportunities Over Maximum Volume**  
The system optimizes for useful candidate density rather than result count.

**User Remains the Decision Maker**  
Discovery never becomes an automatic recommendation.

---

## 22. Handoff navigation

**Previous stage:**  
[Stage 3 — Domain, Data & System Contracts](./stage-03-domain-data-and-system-contracts.md)

**Next stage:**  
[Stage 5 — Evidence & Provenance Architecture](./stage-05-evidence-and-provenance-architecture.md)

The Stage 5 link resolves to the existing authoritative Stage 5 specification. Stage 4 must hand off discovery observations with acquisition-provider metadata and original-source provenance kept distinct, without claiming that discovery proves truth, fit, or quality.

---

## 23. Execution gate

After Stage 4 architecture is accepted, implementation follows the permanent project cycle:

**Inspect → Analyze → Build → Test → Review → Commit → Push → Handoff**

Stage 5 must not begin until Stage 4 passes its acceptance gate.

---

## 24. Implementation and review record

### Implementation scope

Stage 4 implementation is the authoritative Opportunity Source & Discovery Architecture specification.

No live provider integration, search execution, evidence implementation, matching implementation, scoring, ranking, production UI, or database implementation was introduced because those responsibilities belong to later stages.

### Verification completed

- Stage 3 domain contracts were inspected from GitHub before Stage 4 creation.
- Source remains distinct from Evidence.
- Hunt remains distinct from Opportunity.
- Discovery remains distinct from Eligibility and Match.
- The five locked architecture decisions are explicitly recorded.
- Source capabilities and limitations are represented.
- Structured and semantic discovery are combined without weakening hard constraints.
- Adaptive query expansion is bounded by search budgets.
- Capability based routing is separated from opportunity ranking.
- Freshness, duplicates, conflicts, partial discovery, degraded discovery, and failures are explicitly represented.
- Discovery traceability is explicit.
- Cost control is explicit.
- No Stage 5 or later implementation was introduced.

### Review result

**PASS — Stage 4 is internally consistent with the locked Stage 1, Stage 2, and Stage 3 contracts and is ready to hand off to Stage 5.**

### Status

**Architecture decisions locked: D / D / D / C / C**

**STAGE 4 — COMPLETED**


---

## Stage 4 completion and consolidation record

- The authoritative Stage 4 architecture, its domain-specific decisions, constraints, failure conditions, ownership boundaries, and downstream handoff contract are maintained in this document.
- Redundant standalone handoff and audit documents are not needed when their binding requirements are preserved here.
- This completion records architecture consolidation and consistency with prior stages; it does not claim that production application code or runtime tests for this stage have been implemented.


---

## Stage 4 → Stage 5 operational handoff contract (consolidated)

- **Consumes:** Stage 3's authoritative domain, data, and system contracts, while preserving Stage 1–2 boundaries.
- **Creates:** The source registry/capability model, structured + semantic discovery strategy, adaptive query strategy, capability-based routing, and freshness/duplicate/failure handling.
- **Guarantees:** Discovery observations remain distinct from verified truth and evidence; provider capability, source limitations, duplicates, partial discovery, and degraded states remain traceable. Stage 4 does not own evidence adjudication, canonicalization, eligibility, matching, scoring, or ranking.
- **Stage 5 receives:** Source references, discovery observations, query/source traces, limitations, freshness, duplicate relationships, conflicts, and partial/degraded discovery states for evidence and provenance handling.
- **Locked answers:** **D / D / D / C / C**.
- **Status:** Stage 4 PASS / LOCKED.


---

## Cross-stage alignment amendment — Upwork and Fiverr discovery

**Purpose:** Make the product's intended marketplace focus explicit without assuming that public visibility grants permission to collect or redistribute marketplace content.

### Product-level discovery target

THE CLIENT OPPORTUNITY MATCHER™ is intended to help freelancers discover and evaluate **client demand and project opportunities** associated with Upwork and Fiverr. The system must distinguish a marketplace's buyer-demand surface from a marketplace's freelancer-service catalogue.

- **Upwork:** The target opportunity object is a client-posted job/project listing. Programmatic discovery is permitted only through access and API scopes approved for this application and use case. Upwork's current official guidance warns that unauthorized bots, scraping, browser automation, and collection through third parties can lead to account restrictions; commercial API access requires prior written permission for select partners. Therefore, the architecture must not assume that an API key exists or that it authorizes every intended use.
- **Fiverr:** A Gig generally represents a freelancer's offered service; it is not, by itself, a buyer looking to hire the app's user. The relevant target is buyer demand, such as a buyer brief or another expressly supported buyer-opportunity surface, only where Fiverr makes that information available through an authorized route and permits this product's use. Fiverr's official policies prohibit scraping and unauthorized access. The architecture must not treat crawling Gig pages or extracting seller identities as a substitute for finding clients.

### Source capability must be declared, not assumed

Each marketplace source adapter must publish an explicit capability record:
- `authorized_access_status`: `approved`, `pending_review`, `not_available`, or `disabled`;
- `permitted_discovery_surfaces`: exact approved surfaces and operations, not broad platform names;
- `supports_buyer_demand`: whether the authorized surface actually represents a buyer's hiring intent;
- `supports_search`, `supports_pagination`, `supports_incremental_updates`, and `supports_direct_listing_links`;
- `permitted_fields`, `display_attribution_rules`, `retention_limits`, `rate_limits`, and `redistribution_limits`, as applicable;
- `access_reviewed_at`, `policy_reference`, and an owner for periodic revalidation.

A marketplace name in the registry is not proof that the app can access it. A source with `pending_review`, `not_available`, or `disabled` status must not be presented as a live integrated source.

### Required discovery modes

1. **Authorized live integration:** Use only the API or partner integration, scopes, data fields, and display/retention behavior approved for the application.
2. **User-directed listing review:** Where live integration is unavailable, allow a user to paste a listing URL or provide text they are authorized to share, then assess that user-supplied material without automated crawling, login/session-cookie reuse, or background collection. Mark it as user-supplied and disclose that freshness and completeness have not been independently verified. Before enabling this mode for platform content, review applicable platform terms and content restrictions.
3. **Approved alerts or exports:** Accept an official notification, export, or other user-authorized artifact only if the platform's terms and the artifact's permissions allow this processing. Preserve its source and retrieval time.
4. **Unavailable capability:** Explain that automated marketplace discovery is not enabled, and provide a safe route to open the marketplace directly. Never fill the gap with guessed listings or generic web results mislabeled as marketplace results.

### Marketplace identity and result isolation

Every result must retain `marketplace_id`, `source_surface`, `source_listing_id` when permitted, `original_listing_url`, `retrieval_method`, `retrieved_at`, `access_basis`, `attribution_requirements`, and completeness/freshness status. These fields support Stages 5–6 and do not establish truth or current availability by themselves.

Marketplace-origin results must remain identifiable as Upwork or Fiverr results. Do not blend restricted marketplace content into an unattributed third-party search feed. Do not claim complete marketplace coverage unless the approved access method actually provides it.

### Non-goals and prohibited shortcuts

- No scraping, crawling, browser-extension collection, hidden API calls, session-cookie extraction, anti-bot evasion, access-control bypass, or proxy-based circumvention.
- No automated proposals, buyer messages, orders, bidding, or other marketplace actions unless a separate approved integration explicitly permits the specific action and Stage 13/17/19 contracts authorize it.
- No collection of freelancer profile data as a proxy for client demand.
- No assumption that Tavily can reliably index private, login-gated, personalized, or complete Upwork/Fiverr opportunity feeds. Search-provider snippets may be incomplete, stale, or disallowed for the intended use; they are not a compliant substitute for marketplace authorization.

### Handoff ownership

- **Stage 5:** Preserve marketplace, listing, access-basis, and retrieval provenance; distinguish user-supplied content from provider-retrieved content.
- **Stage 6:** Canonicalize only when identity is supported; preserve marketplace-specific IDs and listing URLs.
- **Stages 7–12:** Assess only the evidence actually available and mark unknowns honestly.
- **Stage 16:** Distinguish unavailable/unauthorized integration from a valid empty result.
- **Stage 17:** Own policy compliance, user privacy, credential handling, and prohibited collection controls.
- **Stage 18:** Measure coverage and failures without implying unauthorized or complete access.
- **Stage 19:** Implement only approved adapters and capability states.
- **Stage 20:** Block launch claims that Upwork/Fiverr automated discovery works until access authorization and end-to-end evidence are verified.
