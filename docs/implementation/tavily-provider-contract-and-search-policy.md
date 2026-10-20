# Tavily Provider Contract and Search Policy

**Product:** T4L GROWTH™ — The Client Opportunity Matcher  
**Implementation branch:** `implementation/live-discovery-foundation`  
**Authority:** Stages 3, 4, 5, 6, 16, 17, and 19  
**Status:** Provider adapter integrated with the domain normalization boundary; user-facing protected API integration remains pending.

## 1. Tavily's job

Tavily is a server-side web discovery and retrieval adapter. It helps the application find candidate publisher pages and collect retrievable source observations relevant to a user's structured Hunt.

Tavily is not:
- the opportunity database or source of truth;
- a guarantee that a company needs the user's service, has a budget, or is accepting proposals;
- a contact verification service;
- a semantic fit scorer, ranker, or recommendation engine;
- a substitute for structured APIs or source-specific adapters where those sources are available.

The acquisition provider and the original publisher are different identities. Tavily may discover a page, but the publisher URL and publisher evidence must be preserved as the source of any claims taken from that page.

## 2. Input contract

The adapter accepts a validated Hunt-derived discovery request, not arbitrary user text alone. The request should include:
- service and relevant capabilities;
- target client or organization type;
- requested geography and remote preference;
- engagement type;
- desired demand signals;
- hard constraints separately from preferences;
- freshness window, capped at 120 days;
- a bounded query and result budget;
- excluded result categories where the user selected them.

The query builder may translate service, problem, deliverable, target-client, geography, and engagement concepts into controlled query families. It must not silently drop a hard constraint or turn a preference into an exclusion. User-facing product flows should use occupation-aware structured choices; any optional free-text preference must be separately bounded and treated as a preference.

## 3. Discovery priorities

Rank query families by expected evidence value:

1. Explicit requests for the service, project briefs, contract requests, procurement notices, or requests for proposals.
2. Official organization pages or announcements that directly evidence a relevant project, expansion, launch, or operational need.
3. Relevant organization pages that identify a plausible prospect but do not directly establish current demand.
4. General contextual material only when it supports discovery or validation of a specific candidate.

Generic articles, tutorials, SEO pages, service-provider advertisements, and generic directories must not be promoted as active opportunities solely because their text matches a query. If a page only identifies a possible prospect, classify it as a **prospect with demand unconfirmed**, not an active opportunity.

## 4. Query and cost policy

- Begin with one high-value, structured query per Hunt whenever that is sufficient.
- Keep the provider result limit at no more than 10 results per request.
- Disable generated answer content when only source observations are required.
- Do not request raw page content during initial discovery unless a documented need justifies the extra payload or cost.
- Use advanced search or a second query only when the first result set is insufficient or materially weak and the remaining Hunt budget permits it.
- Deduplicate query variants and repeated URLs before any additional call.
- Record every attempted query, provider operation, retrieval time, result count, outcome, and budget consumption.
- Stop when the candidate set is sufficient, the budget is exhausted, or further expansion is unlikely to add useful coverage.
- Never perform unlimited query fanout.

Initial defaults for the adapter implementation:
- initial search depth: basic;
- maximum results per request: 10;
- initial discovery calls: 1;
- optional adaptive expansion: at most 2 additional calls, only when enabled by the Hunt budget and triggered by insufficient useful candidates;
- initial result cap carried into downstream processing: 10 unique candidates.

These are application policy limits, not claims about Tavily's account quotas or pricing. They must be configurable server-side and tested.

## 5. Freshness and date policy

The product supports a maximum lookback of 120 days. Do not rely solely on Tavily's coarse time filter to enforce that boundary.

- Apply the selected freshness window to dated source records in application code.
- Preserve the original publisher's publication or update date separately from the retrieval timestamp.
- If the source date is absent or cannot be parsed, mark freshness **Unknown**. Do not infer that a page is recent because Tavily retrieved it today.
- If the source is outside the selected window, exclude it from the dated active-opportunity set unless the user explicitly requested a separate undated prospect list.
- Do not invent dates or transform crawl dates into publication dates.

## 6. Evidence and candidate classification

Each raw result should retain, where available:
- acquisition provider ID and operation;
- original publisher URL and domain;
- result title and source snippet;
- provider query reference and retrieval timestamp;
- publisher publication or update date;
- raw provider metadata needed for traceability;
- retrieval outcome and known limitations.

Downstream classification must distinguish at least:
- **Direct opportunity evidence:** the source explicitly describes a relevant request, project, contract, or procurement need.
- **Demand signal:** the source indicates a relevant need but does not establish a directly actionable opening.
- **Potential prospect:** a real organization may fit the target profile, but current demand is unconfirmed.
- **Irrelevant result:** the page does not substantively support the Hunt.

Discovery classification is not final fit scoring or recommendation. Keep the Stage 5 knowledge states and evidence lineage intact. Never label a candidate Verified simply because Tavily returned it.

## 7. Public contact information

Tavily may discover pages containing public contact details, but its search response alone does not guarantee complete or correct email and phone fields.

- Do not synthesize, guess, or pattern-generate email addresses or phone numbers.
- Capture contact details only from an accessible public source and preserve the exact source URL and extraction context.
- Distinguish **published on official site**, **published on third-party source**, and **not found**.
- If contact enrichment requires opening a candidate page, use a separate bounded retrieval step only for shortlisted candidates.
- A contact value is not verified merely because it appears in a search snippet.
- Where the provider cannot reliably supply structured contact details, use a dedicated permitted retrieval or source-specific adapter rather than overstating Tavily's capabilities.

## 8. Failure and security behavior

Represent authentication failure, rate limiting, timeout, provider outage, malformed payload, partial response, and successful search with no useful candidates as different outcomes. A provider failure must not be shown as an empty market.

The Tavily key is a server-side infrastructure secret:
- read only from protected runtime configuration;
- never placed in browser bundles, client responses, repository files, or logs;
- never used as a buyer activation key;
- never included in diagnostics or error messages.

Respect existing authentication, entitlement, user-isolation, URL validation, and recovery contracts. Provider errors returned to users must be safe and actionable without disclosing credentials.

## 9. Separation of responsibilities

- **Stage 4:** source capabilities, query strategy, routing, budget, and discovery traceability.
- **Stage 5:** source provenance, evidence, claims, freshness, conflicts, and explicit unknown states.
- **Stage 6:** canonical opportunity normalization and duplicate relationships.
- **Stages 8–12:** fit, scoring, ranking, intelligence, quality, and recommendation.
- **Stage 16:** failure, degradation, and recovery.
- **Stage 17:** secrets, access, privacy, and trust.
- **Stage 19:** live provider adapter, runtime integration, and compatibility evidence.

Do not put fit scoring or recommendation logic inside the Tavily adapter.

## 10. Acceptance tests

The implementation cannot be accepted until deterministic tests demonstrate:
1. The API key is read server-side and never returned or logged.
2. Query construction includes relevant Hunt dimensions and respects hard constraints.
3. The initial request is bounded and does not trigger unlimited expansion.
4. Basic discovery results are normalized while preserving the original publisher URL and provider provenance.
5. Generic articles and service-provider advertisements are not automatically treated as active opportunities.
6. A result with no direct demand evidence is labelled as an unconfirmed prospect rather than an active opening.
7. Dates are evaluated against the selected window, up to 120 days, and unknown dates remain unknown.
8. No contact detail, date, budget, or active status is fabricated.
9. Duplicate URLs and repeated query results do not inflate the candidate count.
10. Authentication failure, rate limit, timeout, malformed response, empty successful response, and partial results remain distinguishable.
11. A provider failure is not represented as “no opportunities found.”
12. Existing authentication, entitlement, URL safety, and user-isolation behavior remains intact.
13. The separate Opportunity Verdict consumes normalized, evidence-linked candidates and returns no more than three recommendations with reasons and gaps.
14. Tests and hosted build evidence are linked before this work is described as implemented or production-ready.

## 11. Handoff

This contract is the implementation boundary for the Tavily adapter. The next implementation step is to integrate the adapter behind the authenticated, entitlement-checked API boundary after the Stage 19 entitlement persistence contract and migrations exist. Do not bypass those prerequisites to expose a public provider route. Merge only after the relevant automated checks and review pass.

**Current status:** server-side adapter and deterministic tests are present in this branch. Live API connectivity, protected route integration, contact enrichment, and production verification are not claimed as complete.
