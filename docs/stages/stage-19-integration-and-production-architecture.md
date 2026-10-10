# Stage 19 — Integration & Production Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Brand mark:** The Exploded T  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Previous stage:** Stage 18 — Analytics, Observability & Quality  
**Next stage:** Stage 20 — Final Product Readiness & Launch Gate  
**Status:** STAGE 19 — ARCHITECTURE CONSOLIDATED; IMPLEMENTATION AND RUNTIME VALIDATION NOT CLAIMED  

## Owner-approved first-release integration contract — authoritative override

This section supersedes conflicting earlier wording about automatic Gumroad purchase verification, license-key activation, purchase webhooks, and recurring refund/dispute reconciliation. The approved first-release path is manual purchase review: the configured owner checks a Gumroad or Selar order record outside the app and approves the matching app account through a protected owner-only dashboard/action. Registration starts in `PENDING`; only the owner can approve, revoke, or block.

Stage 19 must implement the persistence and enforcement—not automatic purchase-provider integrations—for this flow:
- server-side owner identity/allowlist and protected approve/revoke/block actions;
- canonical entitlement state from Stage 3, purchase origin/reference metadata, decision actor/time, and privacy-minimized audit history;
- authentication and entitlement checks on every protected server operation, ownership checks, RLS, private/no-store response behavior, and fail-closed errors;
- subsequent protected requests deny pending/revoked/blocked accounts; no client-side role/status flag may grant access;
- automated tests cover no self-approval, forged role/entitlement, unauthorized admin actions, cross-user isolation, atomic/concurrent/duplicate actions, revocation propagation, audit integrity, and auth/entitlement outages;
- no paid email automation and no assumed Gumroad/Selar API, webhook, license-key activation, or automatic refund/dispute reconciliation.

## Stage 19 compatibility spike preflight — actual result

The repository baseline inspected for this change is `3743878c1c17ab3e7a89b6eb1e8b5c9b58e84c5a`. The README and recursive Git tree confirm that the baseline contains architecture/readiness documentation only: no application source tree, `package.json`, dependency lockfile, database migrations, automated app test suite, or GitHub Actions workflow. Therefore a runtime Next.js/OpenNext build, Supabase SSR session test, RLS/migration test, secret-injection test, Tavily adapter test, and CI run cannot execute against this baseline. These checks are **BLOCKED / NOT RUN**, not passed.

The actual preflight and per-gate result table are recorded in `docs/implementation/stage-19-compatibility-spike-evidence.md`. Stage 19 must create the minimal isolated spike harness, pin versions, execute real checks in local/non-production environments, and append command output, environment, service mode, commit SHA, failures, and rerun evidence before full feature coding. No production credentials or real customer purchase records may be used.

The stack compatibility spike remains the first technical gate. The contract reconciliation in this change does not claim runtime compatibility, and no full feature coding is authorized until the security-critical build/session/isolation/secret/migration gates pass.

**Architecture decision set:** D / D / D / D / D

---

## 1. Purpose and critical boundary

Stage 19 turns the contracts defined in Stages 1–18 into an implementable integration and production architecture. It defines how the application connects to hosting, storage, purchase/entitlement services, activation, discovery providers such as Tavily, external sources, telemetry, and deployment operations.

Its governing principle is:

**Every external dependency must be connected through an explicit, testable boundary; every secret and entitlement decision remains server-authoritative; and every integration must preserve the domain, evidence, failure, security, and observability contracts already established.**

Stage 19 is an integration architecture, not permission to start coding around undocumented assumptions. It specifies adapters, trust boundaries, configuration, environment separation, request flow, data persistence, deployment, integration testing, operational ownership, and implementation sequencing.

Stage 19 owns:
- concrete integration wiring and provider adapters;
- the server-side boundary for protected operations;
- configuration and environment strategy;
- storage and migration implementation decisions;
- manual owner-reviewed entitlement persistence and enforcement;
- buyer activation and authenticated session integration;
- Tavily and future discovery-provider integration;
- external content ingestion and provenance propagation;
- instrumentation wiring defined by Stage 18;
- deployment, readiness, rollback, and operational runbooks;
- integration tests and environment-specific validation.

Stage 19 does **not** own or redefine:
- product purpose, experience principles, or brand system (Stages 1–2);
- canonical domain meaning and system contracts (Stage 3);
- source capability and discovery policy (Stage 4);
- evidence truth, provenance, freshness, and conflicts (Stage 5);
- canonicalization and duplicate identity rules (Stage 6);
- eligibility, semantic match, score, rank, intelligence, quality, risk, recommendation, or user decision semantics (Stages 7–13);
- feedback/learning semantics or opportunity lifecycle states (Stages 14–15);
- failure taxonomy and recovery semantics (Stage 16);
- security, privacy, entitlement, and secret policy (Stage 17);
- metric definitions, quality measurement, and event semantics (Stage 18);
- launch approval (Stage 20).

If an implementation constraint appears to conflict with an earlier contract, do not quietly alter the contract in code. Record the conflict, identify the owning stage, resolve it explicitly, and only then implement the change.

---

## 2. The five governing architecture questions — answered

### Question 1: What integration shape best supports one secure product without coupling domain logic to vendors?

**Decision: D — A single application with a server-side application boundary and explicit provider/service adapters.**

Keep one product and one coherent domain model. Do not build separate apps for the 20 architecture stages, and do not let domain stages call vendor APIs directly.

The recommended logical flow is:

**Browser UI → authenticated application/API boundary → application use cases/orchestrator → domain services → adapters → external providers and persistence**

The browser owns presentation and user interaction only. It may submit user intent and render authorized responses, but it must not own platform credentials, entitlement truth, protected scoring rules that require server authority, or cross-user data access.

Use explicit interfaces for:
- discovery providers (Tavily and any later provider);
- purchase verification/webhooks (Gumroad or another explicitly approved channel);
- entitlement and activation;
- persistence;
- telemetry;
- time and other external capabilities where deterministic testing requires them.

A provider-specific adapter translates native request/response/error formats into the canonical contracts from Stages 3–5 and 16. Domain code depends on those contracts, not on Tavily, manual entitlement review, a hosting vendor, or a database SDK. Vendor replacement should require changing an adapter and configuration, not rewriting eligibility or scoring.

Keep the initial architecture intentionally modest: a modular application and server-side API boundary are preferred over microservices. Split a component into a separate service only when a measured operational, security, scaling, or ownership need justifies the additional network and deployment failure modes.

**Why this is the best fit:** one product stays understandable and economical to maintain while security-sensitive and provider-specific work is kept out of the browser and out of domain logic.

### Question 2: How is buyer-only access implemented for the approved manual-review flow?

**Decision: D — Authenticated accounts with owner-reviewed purchase evidence and server-enforced, revocable entitlement.**

The required journey is:

**Gumroad/Selar purchase → app registration/sign-in → PENDING → owner checks purchase record in the storefront → owner approves/revokes/blocks through protected owner-only controls → server enforces current entitlement on protected requests.**

Integration requirements:
1. Registration creates an authenticated identity only; it never grants paid entitlement.
2. The configured owner independently reviews the purchase record outside the app and matches it to the app account. The app records only purchase origin, minimal review reference, decision actor/time, and a privacy-minimized reason.
3. Only the configured owner identity/allowlist may use server-protected approve/revoke/block actions. The server must derive actor authority from the authenticated principal, not request fields.
4. Persist one canonical state: `PENDING`, `ACTIVE`, `REVOKED`, or `BLOCKED`. Do not maintain `APPROVED` and `ACTIVE` as distinct persisted states.
5. Owner mutations are validated, atomic, concurrency-safe, idempotent where applicable, and auditable. No user may self-approve or alter roles/entitlement.
6. Every protected operation checks the current entitlement and resource ownership. RLS is defense in depth; client UI state is never authorization.
7. Revocation/blocking denies subsequent protected requests. Entitlement-store/auth failures fail closed and map to Stage 16's typed failure/denial semantics.
8. No automatic Gumroad/Selar API, license-key activation, purchase webhook, or recurring refund/dispute reconciliation is required in this release. Do not implement one from stale text without a separate approved architecture decision.
9. Do not add paid email automation. Do not store full payment details or unnecessary storefront payloads.
10. The Stage 19 compatibility spike still must prove the selected runtime, secure session handling, RLS/isolation, secret injection, and CI/build path before full feature coding.

The quickstart PDF and app URL are onboarding material, not security mechanisms. A manual review is a human owner action; it must not be represented as an automated provider verification.


### Question 3: How should Tavily and future providers be integrated safely and traceably?

**Decision: D — A server-only, provider-neutral adapter with strict secret handling and provenance-preserving normalized results.**

Tavily is an acquisition/search provider. It is not automatically the original publisher, proof of credibility, or the source of truth for an opportunity.

The Tavily adapter must:
- run only in a trusted server-side runtime;
- obtain `TAVILY_API_KEY` from that runtime's secret store/environment configuration;
- never request a Tavily key from buyers or expose it in HTML, browser JavaScript, browser storage, public API responses, source maps, logs, telemetry, screenshots, repository content, or error text;
- keep provider credentials distinct from session credentials and any future optional user PIN; no Gumroad webhook or buyer activation credential is required for the manual first release;
- use the request and response schema documented for the actual Tavily API version selected at implementation time;
- validate inputs and bound query length, result count, request duration, concurrency, and cost according to Stage 4's discovery budgets;
- normalize successful responses to Stage 4's discovery-result contract and Stage 5's provenance contract;
- retain the acquisition provider ID, safe provider request/query reference where available, retrieval timestamp, original result URL, title/snippet, and allowed metadata;
- preserve the original publisher/source identity separately from the provider that discovered the result;
- avoid treating provider rank, provider score, or a snippet as evidence credibility or a verified opportunity fact;
- map missing configuration, rejected credentials, rate limits, timeouts, malformed payloads, provider outage, valid empty results, and partial coverage to Stage 16's typed outcomes;
- never convert a failed request into a valid empty result;
- keep provider-specific fields in adapter metadata only when needed and safe; do not leak raw provider response bodies into downstream domain objects;
- support deterministic adapter tests with fixtures and mocked network responses.

**Secret placement rule:** the key is entered only into the hosting/deployment secret configuration by an authorized operator. It is not a buyer-facing “API key input” field. A local development environment may use an ignored local environment file, but the file must never be committed, packaged into the frontend, or copied into a production artifact. Provide a clearly named placeholder example only when useful, never a real credential.

The adapter's public application interface should expose a stable operation, such as “search opportunities,” and return the shared Stage 16 operation envelope. It should not expose the provider credential or require the UI to know which provider key was used.

**Provider outage behavior:** follow Stage 16 exactly. Other approved providers may continue within the discovery budget. Partial coverage must be visible. If no provider succeeds, return discovery unavailable—not “no opportunities found.” Cached results may be used only if Stage 4's policy allows it, and must carry their retrieval time and stale/degraded marker.

### Question 4: How should storage, configuration, and deployment protect correctness across development and production?

**Decision: D — Environment-isolated configuration, durable authoritative persistence, versioned migrations, and deployment-time validation.**

The approved initial hosting/runtime and persistence choices are recorded in Section 14. Before implementing domain persistence, pin compatible versions and verify transactions, atomic entitlement claiming, row-level security, migrations, backups/restore, and user-scoped queries in a minimal spike. Do not silently substitute a different database or runtime.

Regardless of vendor, storage must support:
- stable internal user/account identifiers;
- unique purchase-provider event identifiers for idempotent webhook processing;
- unique entitlement and activation-claim constraints;
- atomic activation and other security-critical state transitions;
- explicit user ownership on private records;
- durable operation/event references where required;
- versioned schema migrations and rollback/forward-recovery planning;
- indexes and query patterns aligned to user-scoped reads;
- backup and restore procedures tested before production;
- deletion/export/retention behavior required by Stage 17;
- separation of domain data, entitlement/access records, provider secret configuration, and operational telemetry according to least privilege.

Every query and mutation touching user-owned resources must enforce ownership in the trusted server layer and, where supported, the persistence layer. Never trust a client-supplied `user_id` as proof of ownership. Cache keys must include the correct tenant/user scope where data is private; shared caches must not return one buyer's records to another.

Use separate development, test/staging, and production environments, credentials, databases, webhook endpoints, and provider configurations. Never use production secrets in ordinary development or untrusted CI. Test data must be synthetic or appropriately de-identified. A production deployment must not start in a falsely healthy state if required security configuration or critical schema prerequisites are missing.

Configuration rules:
- validate required non-secret configuration at startup or readiness time;
- verify required secrets are present without printing their values;
- report capability readiness separately from process liveness;
- fail safely when critical entitlement/session configuration is missing;
- allow optional discovery capabilities to report unavailable under Stage 16 rather than taking down unrelated safe functionality;
- pin supported runtime/dependency versions and define an update process;
- keep migrations explicit, reviewable, and compatible with the planned release/rollback path.

Do not hard-code production hostnames, secret values, webhook secrets, API keys, or user-specific values into source. Keep deployment-specific values in environment configuration and document their names, purpose, required/optional status, and rotation owner.

### Question 5: How will integrations be operated, tested, and released without mistaking architecture for production readiness?

**Decision: D — Contract tests + deterministic adapter tests + end-to-end security tests + observable staged deployment and rollback.**

Stage 19 must provide evidence that each integration preserves the contracts of its owning stage.

Required test layers:
1. **Unit/contract tests:** domain contracts, operation envelopes, provider normalization, event schemas, entitlement state transitions, ownership checks, and idempotency behavior.
2. **Adapter tests:** Tavily request construction, response normalization, timeout/rate-limit/auth/malformed-response handling, provenance fields, secret non-disclosure, and deterministic fixtures.
3. **Owner-action tests:** ordinary-user denial, no self-approval, forged role/status, duplicate/concurrent approve/revoke/block, audit consistency, revocation propagation, and fail-closed auth/store outages.
4. **Access-control tests:** pending/revoked/blocked entitlement, unauthorized owner action, self-approval attempt, forged role/status, concurrent/duplicate owner actions, session expiry/logout, cross-user reads/writes, and guessed URL access.
5. **Pipeline integration tests:** discovery → evidence/provenance → normalization → eligibility → match/scoring → ranking → intelligence/quality/recommendation, with typed failures and completeness preserved.
6. **Persistence tests:** transaction boundaries, unique constraints, migration from previous schema, backup/restore, concurrent writes, idempotent retries, and uncertain write outcomes.
7. **Observability tests:** required Stage 18 events are emitted from authoritative outcomes; event delivery failure is visible; secrets and unnecessary personal data are redacted.
8. **End-to-end tests:** buyer activation, authorized use, expired/revoked access, discovery success/empty/partial/failure, saved actions, feedback, logout, and recovery.
9. **Deployment checks:** required configuration, health/readiness behavior, HTTPS/security headers/cookie policy as applicable, migration status, logs, monitoring, rollback path, and absence of secrets in the built client.
10. **Release rehearsal:** use a staging environment with test purchase events and test provider credentials; exercise the runbook before production.

A green build is not proof that external integrations work. A mocked Tavily response is not proof that a real key is valid. A successful checkout is not proof that entitlement revocation works. Each claim must be matched to the appropriate test evidence.

The launch gate belongs to Stage 20. Stage 19 supplies the implementation and test evidence; it does not self-approve the release.

---

## 3. Reference integration topology

The logical production topology is:

1. **Client/UI:** renders product screens, collects user intent, and displays safe responses. Contains no provider secrets or authoritative entitlement flags.
2. **Trusted application/API layer:** authenticates the session, authorizes the action and resource, validates input, orchestrates use cases, applies rate limits, and emits correlated outcomes.
3. **Domain/use-case layer:** executes the Stage 3–15 contracts and consumes normalized results rather than vendor-specific response formats.
4. **Adapter layer:** purchase provider, discovery providers, persistence, and telemetry adapters; maps external contracts and errors to internal contracts.
5. **Authoritative persistence:** stores user-owned domain data, entitlements, activation claims, and required durable state under separate access policies.
6. **Secret/configuration service:** injects platform and provider secrets only into the server-side components that require them.
7. **Operational telemetry:** receives allowlisted, redacted events and metrics under Stage 18's schemas and Stage 17's privacy rules.
8. **External services:** Gumroad or approved purchase channel, Tavily or approved discovery providers, original publisher websites, and any explicitly selected identity/storage/monitoring vendor.

This is a logical topology, not a mandate to deploy eight separate services. The initial release should use the smallest deployment arrangement that preserves these boundaries. In particular, do not create microservices solely to mirror the stage numbers.

---

## 4. Canonical request and data flows

### 4.1 Protected app request
1. Client sends a request over HTTPS with its session credential handled according to Stage 17.
2. Trusted server validates the session and current entitlement state or checks an approved cache with a documented maximum staleness window.
3. Server authorizes the requested operation and verifies ownership of every referenced resource.
4. Server validates and normalizes input against Stage 3 and the owning domain-stage contract.
5. Use-case orchestration invokes the relevant domain services and adapters.
6. Each adapter returns normalized data or a Stage 16 typed failure envelope.
7. Domain logic preserves evidence completeness and assessment semantics; failures do not manufacture domain results.
8. Server persists durable outcomes before claiming they are saved.
9. Server emits Stage 18 events from the authoritative outcome, with correlation IDs and redaction.
10. Server returns only the authorized response and safe error details.

### 4.2 Manual purchase review and entitlement

The first release does not receive or verify Gumroad/Selar purchase webhooks, call purchase/license APIs, or run recurring refund/dispute reconciliation. The configured owner checks the purchase record in the relevant storefront outside the app, then records a decision through a protected owner-only app action.

1. New app registrations receive `PENDING` entitlement; neither a checkout redirect nor registration grants protected access.
2. The owner authenticates through the configured owner identity/allowlist and matches the storefront record to the app account. Do not treat a buyer-supplied email, screenshot, or redirect as sufficient by itself.
3. The owner action records purchase origin, minimal purchase reference, decision actor/time, and a privacy-minimized reason. Do not store full payment data or unnecessary storefront payloads.
4. The server atomically validates and applies only permitted transitions to the canonical Stage 3 state (`PENDING`, `ACTIVE`, `REVOKED`, `BLOCKED`). `APPROVED` may be a UI label for `ACTIVE`, not a second persisted active state.
5. Only the configured owner may approve, revoke, or block. Ordinary users cannot alter roles, target another user's account, or approve themselves.
6. Every protected request checks the authenticated principal, current durable entitlement, and resource ownership. RLS remains defense in depth. Revocation/blocking denies subsequent protected requests.
7. Auth/entitlement-store failure fails closed and maps to Stage 16's typed failure/denial contract. Do not convert technical failure into an invalid-purchase verdict or grant access.
8. Owner actions are auditable, concurrency-safe, and idempotent where applicable. The application does not implement paid email automation or an automatic purchase-provider integration in this release.
9. If automated provider verification is proposed later, stop and obtain a separate explicit product/architecture decision before adding credentials, APIs, webhook endpoints, reconciliation jobs, or new acceptance criteria.

### 4.3 Discovery through Tavily
1. Authorized buyer submits a valid hunt/search request.
2. Server enforces the buyer's entitlement, input validation, request budget, and allowed source policy.
3. Orchestrator selects the provider according to Stage 4's source capability and budget rules.
4. Tavily adapter reads its key from server-only secret configuration and performs a bounded request.
5. Adapter maps native results/errors to the Stage 4 and Stage 16 contracts.
6. Original publisher/source metadata and retrieval provenance flow into Stage 5 without being conflated with Tavily's provider identity.
7. Downstream processing runs only with the evidence/completeness states it actually received.
8. Stage 18 captures provider outcome, latency, failure category, and completeness with redaction.
9. UI displays full, partial, empty-success, or unavailable states distinctly.

### 4.4 User action and lifecycle persistence
1. Client expresses explicit intent, such as save, pass, verify, or apply/open an external destination, according to Stage 13.
2. Server validates identity, entitlement, ownership, allowed transition, and required confirmation.
3. Server applies the action idempotently and persists the state according to Stages 13 and 15.
4. UI confirms success only after the authoritative persistence outcome is known.
5. Stage 18 records intent, outcome, and persistence as distinct events.
6. Failure or timeout follows Stage 16; an uncertain write is reconciled before a non-idempotent retry.

---

## 5. Integration adapter contracts

### 5.1 Shared adapter requirements

Every adapter must define:
- a stable internal interface and versioned input/output schema;
- required and optional configuration;
- secret source and rotation procedure, if applicable;
- timeout, retry, cancellation, and idempotency behavior;
- mapping from native responses/errors to internal outcomes;
- exact Stage 16 operation-result mapping: `DENIED` requires `denial_code`; `FAILED` requires `failure_code`; `SUCCESS_EMPTY` and `SUCCESS_PARTIAL` remain successful statuses with explicit completeness context;
- expected authorization/ownership/policy denials must not be mapped to generic technical failures, and technical dependency failures must never be mapped to `DENIED`;
- completeness and freshness semantics;
- safe logging and redaction rules;
- dependency health/readiness signals;
- test fixtures and negative test cases;
- rate/cost/concurrency budgets where relevant;
- owner and fallback policy;
- documentation for external API version changes.

Adapters must not return raw unvalidated external payloads as canonical domain entities. Retain only allowlisted metadata needed for traceability, debugging, or downstream reasoning.

### 5.2 Tavily discovery adapter

Required configuration:
- server-side `TAVILY_API_KEY`;
- selected API endpoint/version and supported request parameters;
- configured timeout, maximum results, concurrency/rate limits, and request budget;
- optional provider-specific settings, only if they do not violate Stage 4.

Required normalized output:
- operation ID/correlation ID;
- provider identifier;
- query family or safe query reference;
- retrieval timestamp;
- original result URL and available publisher identity;
- title/snippet or permitted result metadata;
- completeness and warnings;
- provider request ID where available and safe;
- normalized Stage 16 outcome.

Do not persist or expose the API key with the result. Do not log full query text by default; if query observability is necessary, follow Stage 17/18 minimization and access rules.

### 5.3 Gumroad or approved purchase adapter

Required configuration:
- trusted product/variant identifiers;
- webhook endpoint and authenticity-verification mechanism;
- server-only webhook/API credentials where the provider requires them;
- event-idempotency storage;
- canonical entitlement state mapping and owner decision/audit strategy.

Required normalized behavior:
- verify before processing;
- map provider event types to Stage 17's entitlement policy;
- handle duplicate and out-of-order events;
- distinguish verified purchase from pending/uncertain/unverified state;
- reconcile missed events;
- emit safe processing outcomes;
- never allow the browser to assert paid status.

Provider documentation and webhook verification mechanisms may change. At implementation time, verify the current official API contract and document the selected version and verification method. This architecture intentionally does not invent a signature algorithm or assume that all purchase providers use the same webhook scheme.

### 5.4 Persistence adapter

The persistence adapter must:
- enforce schema and unique constraints;
- preserve transactions or an explicit compensating/reconciliation strategy where a multi-record operation cannot be atomic;
- scope reads and writes to authorized ownership;
- expose typed persistence outcomes;
- support migrations and backups;
- avoid silent success on write failure;
- keep secrets out of domain records;
- allow deterministic tests against a disposable database or suitable test instance.

### 5.5 Telemetry adapter

The telemetry adapter must emit Stage 18's versioned events and metrics with bounded-cardinality labels, safe timestamps, operation IDs, and redacted fields. Telemetry failure must not alter domain truth or grant access. Critical security/audit events may require stronger durability than ordinary analytics, as specified by Stages 17–18.

---

### 5.6 Authorized marketplace discovery adapters — Upwork and Fiverr

#### Product requirement

The product is intended to discover **buyer demand and client projects** on Upwork and Fiverr and pass eligible candidate listings through the existing evidence → normalization → eligibility → matching → scoring → ranking → intelligence → recommendation pipeline. It must not confuse a freelancer's service catalogue with a client opportunity.

**Scope boundary:** marketplace listings are candidate opportunities for the freelancer using this app. Stage 19 does not authorize discovering, harvesting, or profiling marketplace user accounts for marketing; nor does it treat freelancer profiles or service listings as buyer-demand opportunities. If marketplace-user acquisition or profile discovery becomes a product requirement, Stage 1 scope, Stage 4 discovery semantics, Stage 5 provenance, and Stage 17 privacy/security review must be deliberately revised before implementation. Do not smuggle that different use case into a source adapter.

#### Integration posture: authorization-first, capability-gated

Implement marketplace adapters behind the Stage 4 provider-neutral interface, but do not enable an adapter merely because its name or endpoint is known.

Each adapter must expose:
- configured/authorized/disabled capability status;
- exact permitted discovery surface and API scopes;
- buyer-demand semantics for each returned object;
- normalized source/listing IDs and original listing URLs, where permitted;
- attribution, retention, cache-expiry, and rate-limit metadata required by the approval;
- Stage 16 typed operational outcomes;
- safe direct-link behavior and an explicit coverage/completeness status.

#### Upwork

The intended object is a client job/project listing. Before implementation is enabled, obtain and record the required API/partner approval for this commercial application and its exact search/browse use case. Use only the approved API endpoint, OAuth/scopes, rate limits, caching policy, and display behavior. Do not scrape the website, automate browser pages, reuse session cookies, collect via unofficial endpoints, or assume that possession of a key grants broader permission. Marketplace-origin content must remain attributable to Upwork and must not be aggregated in a way prohibited by the applicable API terms.

If approved access is not available, ship the Upwork source as `pending_approval` or `unavailable`, not as a functioning automated connector. A user-directed link/manual-review flow may be considered only after its compliance and data-use design is reviewed.

#### Fiverr

Do not build a scraper for Fiverr Gig pages or buyer-brief pages. A Gig usually describes a freelancer's offered service and is not a client seeking to hire the product's user. Automated discovery of buyer demand may be implemented only if Fiverr provides an authorized access route for the relevant buyer-demand surface and the application's use is permitted.

If no such approved route is available, mark Fiverr automated buyer-demand discovery `unavailable` and provide a clearly labeled direct-open/manual-review path only if that path has passed the Stage 17 policy review. Do not silently substitute Gig listings, freelancer profiles, search-engine snippets, or guessed data and label them as client leads.

#### Tavily boundary

Tavily may support general web research or locate public publisher pages only where that use is permitted. It is **not** a fallback route for scraping, reconstructing, or bypassing access to Upwork/Fiverr listings, buyer briefs, or restricted data. The Tavily adapter must preserve its identity separately from the original publisher and must not label an indexed marketplace snippet as an authorized, complete, current marketplace feed.

#### Feature flags and launch behavior

Use server-side capability flags/configuration such as `UPWORK_DISCOVERY_ENABLED` and `FIVERR_BUYER_DEMAND_DISCOVERY_ENABLED` only after approval records are reviewed. These flags are not substitutes for authorization. Default to disabled unless the corresponding approval and deployment configuration are confirmed. On revocation, policy change, or uncertain permission, disable the affected adapter and preserve safe direct-link/manual-review behavior where permitted.

Do not expose API credentials, OAuth tokens, or user session secrets to the browser. Do not automate proposals, buyer messages, orders, or account actions unless separately approved and architected through Stage 13.

#### Implementation and verification gates

- Build adapter contract tests with fixtures before connecting live credentials.
- Verify that every result is genuinely buyer-demand content, not a seller service listing.
- Verify attribution, retention, caching, access scope, rate-limit behavior, and provenance against the applicable written approval.
- Verify invalid/inactive/revoked entitlement maps to `DENIED` with a denial code, while unavailable verification maps to `FAILED` with a technical failure code; neither may become an empty discovery result.
- Verify Tavily cannot be used as an unapproved marketplace data path.
- Keep live integrations disabled until an authorized access basis and end-to-end test evidence are recorded for each marketplace independently.

Stage 4 owns discovery semantics; Stage 5 provenance; Stage 16 failure outcomes; Stage 17 security/policy; Stage 18 monitoring; Stage 20 release acceptance.

---

## 6. Environment and secret matrix

| Item | Local development | Test/staging | Production |
|---|---|---|---|
| Tavily credential | Local server-only secret, ignored by version control | Test/restricted key in deployment secret store | Production key in managed hosting secret store |
| Owner identity/allowlist | Synthetic test owner in test mode | Protected server-side owner configuration and authorization guard | No client-editable role or public configuration |
| Entitlement data | Synthetic test records | Isolated test purchases/data | Authoritative production records |
| Session signing/encryption secrets | Local-only random values | Separate staging values | Managed production secrets with rotation |
| Database | Local/disposable | Isolated staging database | Production database with backups and access controls |
| Telemetry | Local/no-op or test sink | Staging project | Production project with restricted access |
| Logs | Redacted developer logs | Redacted, access-controlled | Redacted, access-controlled, retention-controlled |

Rules:
- Never reuse production credentials in local development or staging.
- Never put a secret in a `VITE_*`, `NEXT_PUBLIC_*`, or equivalent client-exposed variable merely because the build system supports environment variables.
- A secret variable name is not proof that its value remains server-side. Inspect the compiled assets, source maps, browser network responses, and client-visible configuration.
- Do not include real keys in bug reports, prompts, screenshots, test fixtures, or docs.
- Rotate a suspected exposed credential, remove it from active use, and investigate the exposure. Deleting the latest line is not sufficient if the secret was committed into history.
- Document who can provision, read, and rotate each production secret.

---

## 7. API, schema, and version compatibility

- Version externally consumed application APIs when a breaking change cannot be avoided; keep internal module contracts explicit even when they do not need public URLs.
- Version event schemas according to Stage 18.
- Version database schema through reviewed migrations.
- Pin provider API behavior to a documented version or supported contract where the vendor offers versioning.
- Validate external payloads at adapter boundaries; do not assume a successful HTTP response is valid data.
- Reject or safely quarantine unsupported schema changes rather than silently coercing materially different fields.
- Preserve backward compatibility for existing persisted records during rolling deployments or document a safe migration window.
- Do not silently change scoring/ranking versions during a provider or database integration change. Stages 9–10 own assessment semantics; Stage 18 requires reproducibility metadata.
- Store the version/configuration reference necessary to explain which assessment rules and evidence were used, without storing secrets.
- Use feature flags or controlled rollout only when the flag's server-side authority, default, auditability, and rollback behavior are specified. A client-controlled flag must never enable protected features.

---

## 8. Deployment, operations, and rollback

### Deployment gates
Before deployment:
- automated checks and tests pass for the change;
- required environment configuration is present;
- no real secrets are present in tracked files or client bundles;
- database migrations have been reviewed and a recovery plan exists;
- webhook endpoint configuration and signature verification are confirmed;
- health/readiness checks match required and optional dependency policy;
- logs, events, and alerts are connected and redacted;
- a rollback or forward-recovery plan is documented;
- the deployment has an identifiable version/commit and configuration version.

### Health model
- **Liveness** answers whether the application process is alive and able to make progress.
- **Readiness** answers whether the deployment can safely accept the operations it claims to support.
- **Capability health** reports dependency-specific availability, such as Tavily discovery, purchase verification, persistence, or telemetry.
- A failure in an optional discovery provider should not automatically restart the entire application.
- A failure that makes entitlement verification or required persistence unsafe must prevent protected operations from being treated as healthy.

### Rollback and data changes
- Application rollback must account for schema compatibility and external side effects.
- Do not automatically reverse irreversible purchase or user actions just because application code is rolled back.
- Prefer backward-compatible expand/migrate/contract database changes where practical.
- For a migration that cannot be safely reversed, define a forward-recovery procedure and backup/restore conditions before production.
- After rollback, verify entitlement state, access checks, discovery outcomes, persistence, and telemetry—not just that the homepage loads.
- If a secret is rotated, verify both the new value works and the old value is no longer accepted where revocation is supported.

### Runbooks
Maintain concise, actionable operator procedures for:
- missing/rejected Tavily key;
- Tavily rate limit/outage;
- unauthorized/failed owner entitlement actions or audit-write failures;
- entitlement reconciliation and revocation;
- activation/support recovery;
- database outage or migration failure;
- secret rotation or suspected exposure;
- elevated error rate or telemetry blind spot;
- rollback and restoration.

Runbooks must never instruct operators to bypass entitlement, paste secrets into chat/logs, or manually alter user state without authorization and an auditable record.

---

## 9. Observability and privacy integration

Stage 19 implements, but does not redefine, Stage 18's event and metric semantics.

Mandatory integration signals include:
- application request outcomes and latency;
- activation funnel outcomes and entitlement denials by normalized reason;
- webhook received/verified/rejected/processed/deduplicated/reconciled outcomes;
- discovery outcome by provider: results, valid empty, partial, failed, cancelled;
- per-provider latency, timeout, rate limit, and configuration failure;
- evidence completeness/freshness and assessment pipeline stage outcomes;
- persistence requested versus confirmed outcomes;
- feedback acceptance/deduplication/failure;
- dependency health and recovery;
- telemetry delivery lag/failure;
- deployment version, migration version, and rollback outcome.

Requirements:
- use Stage 16's stable failure taxonomy and operation envelope;
- use Stage 18's event names, versioning, correlation IDs, denominators, and bounded-cardinality dimensions;
- use Stage 17's data minimization, retention, access control, and redaction rules;
- do not use raw user IDs, full query text, opportunity descriptions, session tokens, API keys, or raw provider payloads as metric labels;
- ensure a missing telemetry stream is itself detectable;
- do not let telemetry events grant access or modify entitlement/domain state.

Exact alert thresholds should be set from observed baseline and risk, not fabricated during architecture. Stage 20 must verify that the critical alerts fire under controlled test conditions.

---

## 10. Cross-stage synchronization and authority map

| Stage | Contract Stage 19 must implement | What Stage 19 must not redefine |
|---|---|---|
| 1 — Product definition | Buyer-only product, trust, accessibility, global scope, brand/design tokens | Product purpose or core promise |
| 2 — User journey | Purchase-to-activation and protected app journeys, states, error recovery | User journey goals without an explicit approved change |
| 3 — Domain/data | Canonical entities, ownership, schemas, typed domain contracts | Domain meanings or state ownership |
| 4 — Discovery | Source registry, query/cost budgets, capability selection, provider-vs-publisher distinction, and marketplace buyer-demand object semantics | Discovery policy, access permissions, or source credibility |
| 5 — Evidence | Claim/evidence/source lineage, freshness, conflict, uncertainty | Evidence truth or confidence semantics |
| 6 — Normalization | Canonical identity, duplicate policy, safe merge rules | Canonical identity decisions |
| 7 — Eligibility | Constraint-level outcomes and unknown handling | Eligibility requirements or pass/fail logic |
| 8 — Matching | Semantic fit inputs and explanations | Match meaning |
| 9 — Scoring | Versioned scoring inputs and reproducibility | Score formula/weights |
| 10 — Ranking | Ranking inputs and stable ordering semantics | Ranking formula/priority policy |
| 11 — Intelligence | Traceable intelligence and reasoning references | Claims not supported by evidence |
| 12 — Quality/risk/recommendation | Distinct quality, risk, and recommendation outputs | Collapsing them into one score |
| 13 — User action | Explicit intent and confirmed action outcomes | Inferring external application success |
| 14 — Feedback/learning | Attributable, consent-aware, idempotent feedback events | Learning from unverified or duplicate outcomes |
| 15 — Opportunity lifecycle | Valid persisted transitions and stale-context behavior | Opportunity lifecycle states |
| 16 — Failure/recovery | Typed errors, bounded retry, partial/failure distinction, recovery | Failure taxonomy or degrading failure into empty success |
| 17 — Security/privacy | Server-authoritative entitlement, session security, secret isolation, data privacy | Security policy or access grants from browser state |
| 18 — Observability/quality | Versioned event schemas, metrics, redaction, quality evidence | Domain truth or quality algorithms |
| 20 — Launch gate | Reviewable test/deployment evidence and unresolved-risk register | Self-approving launch |

**Authority rule:** Stage 19 is the implementation owner, not the semantic owner of all upstream contracts. If a vendor cannot satisfy a contract, record the limitation, propose a bounded change to the owning stage, and wait for explicit architecture reconciliation before weakening that contract.

---

## 11. Required integration acceptance criteria

Stage 19 is architecturally ready for Stage 20 review only when all are true:

- [ ] One coherent product uses a server-side application boundary; stages are not separate apps.
- [ ] Domain logic is insulated from vendor-specific API formats through adapters.
- [ ] The chosen hosting/runtime, identity/session approach, database, and telemetry stack are recorded before implementation, with reasons and constraints.
- [ ] Buyer entitlement is derived from verified purchase state, not a redirect or client-side flag.
- [ ] Owner-only approve/revoke/block actions are authorized, atomic/idempotent where applicable, audited, and tested. Automatic purchase webhooks/reconciliation are not required for this release.
- [ ] Activation is single-use/atomic as applicable, and protected requests check current entitlement and ownership.
- [ ] Revocation propagation and recovery are implemented and tested.
- [ ] Tavily credentials are injected only server-side; browser assets, source maps, responses, logs, and telemetry are inspected for leakage.
- [ ] Tavily responses preserve provider identity separately from original publisher/source provenance.
- [ ] Missing key, invalid key, rate limit, timeout, malformed payload, valid empty result, and partial success are distinguishable.
- [ ] Provider failures follow Stage 16 and never imply no opportunities exist.
- [ ] Persistence supports user isolation, uniqueness/idempotency, safe migrations, backups, and confirmed write outcomes.
- [ ] Local, staging, and production configurations and credentials are isolated.
- [ ] Stage 18 signals are emitted from authoritative outcomes and telemetry loss is detectable.
- [ ] External content is treated as untrusted data and cannot issue privileged instructions.
- [ ] Upwork automated discovery remains disabled until written access approval and the permitted commercial use, endpoint/scopes, attribution, caching, and rate limits are recorded.
- [ ] Fiverr automated buyer-demand discovery remains disabled unless an authorized access route for that exact surface is verified; Gig/service listings and freelancer profiles are never mislabeled as client opportunities.
- [ ] Server-side marketplace feature flags default to disabled and cannot override missing/withdrawn authorization.
- [ ] Tavily is not used to scrape, reconstruct, or bypass restricted marketplace content; any permitted public result retains provider-versus-original-publisher provenance.
- [ ] Marketplace discovery scope is explicitly limited to opportunity candidates, not harvesting marketplace user accounts/profiles for product marketing.
- [ ] Required unit, adapter, webhook, access-control, pipeline, persistence, observability, and end-to-end tests exist and pass.
- [ ] Deployment, rollback, secret rotation, and recovery runbooks are usable and rehearsed.
- [ ] No architecture document, mocked test, or green build is represented as proof of live production integration.
- [ ] Stage 20 receives the actual test results, environment evidence, known limitations, and unresolved risks.

---

## 12. Implementation sequence and stop/go gates

Implement in this order to reduce expensive rework and prevent a stack incompatibility from contaminating the full build:

1. **Freeze the implementation decision record.** Confirm the approved hosting/runtime, database, authentication/session approach, purchase verification method, deployment secret store, telemetry destination, and candidate dependency versions. Do not put real secrets in the repository or conversation.
2. **Run the mandatory compatibility spike in Section 14.** This is the first implementation activity and the first stop/go gate. Prove the selected Next.js/Cloudflare OpenNext path, Supabase server-side session behavior, user-scoped database access, server-only secret injection, and the basic CI/build path. Do not begin full product feature implementation until this passes. If a required security property cannot be demonstrated, stop and approve a deliberate architecture adjustment.
3. **Establish the server-side trust boundary.** Implement authentication/authorization middleware, environment validation, ownership enforcement, and safe error envelopes before wiring paid functionality.
4. **Build persistence foundations.** Add schema/migrations, uniqueness constraints, user-scoped access, and test fixtures.
5. **Implement entitlement integration.** Verify owner-only approve/revoke/block, idempotent/atomic state changes, sessions, revocation enforcement, RLS, and audit integrity before exposing protected app functions.
6. **Implement the provider-neutral discovery contract.** Add typed outcomes and adapter tests using fixtures; only then wire Tavily with a server-side secret. Keep Upwork/Fiverr live capability flags off unless and until their independent authorization and permitted-use records are approved; do not scrape or use Tavily as a marketplace-policy bypass.
7. **Preserve provenance through the pipeline.** Connect discovery to evidence and normalization while validating Stage 4–6 contracts.
8. **Connect domain assessment stages.** Integrate eligibility through recommendation without changing their semantics; capture versions and completeness for reproducibility.
9. **Implement user actions and lifecycle persistence.** Verify explicit intent, idempotency, durable confirmation, and valid transitions.
10. **Wire observability.** Emit Stage 18 signals, verify redaction, and test that telemetry loss is visible without corrupting domain outcomes.
11. **Run adversarial and failure-injection tests.** Include access bypass, cross-user access, webhook replay, provider outages, missing/rejected secrets, malformed results, uncertain writes, and recovery.
12. **Deploy to isolated staging and rehearse operations.** Validate real integration contracts with test credentials and test purchases; inspect client bundles and network responses.
13. **Hand evidence to Stage 20.** Include the tested commit, test reports, migration status, deployment checks, runbooks, known limitations, and unresolved risks. Stage 20 independently decides readiness.

**Stop/go rule:** do not wire real production secrets or expose paid functionality until the compatibility spike and server-side secret-handling checks pass. Do not announce production readiness until Stage 20 has reviewed actual evidence.

---

## 13. Explicit handoff contract

### Inputs from earlier stages
- Stages 1–2: product constraints, brand/accessibility system, user journeys, activation/error/recovery experience.
- Stage 3: authoritative domain model, ownership, data separation, API/system contracts.
- Stages 4–6: discovery/source/provider boundaries, provenance, canonicalization, freshness, duplicate rules.
- Stages 7–12: assessment inputs and semantics, evidence-supported conclusions, uncertainty, reproducibility needs.
- Stages 13–15: explicit user actions, feedback integrity, lifecycle transition rules and durable state.
- Stage 16: normalized failure outcomes, retry/idempotency/cancellation/recovery behavior.
- Stage 17: security/privacy/entitlement/secret requirements and threat scenarios.
- Stage 18: versioned telemetry events, minimum signal set, quality and release evidence requirements.

### Outputs to Stage 20
Stage 19 must hand off:
- a documented implementation decision record for the chosen runtime, hosting, persistence, identity/session, purchase provider verification, discovery provider, secret store, and telemetry;
- adapter and API contracts, including versions and configuration names;
- environment and secret inventory without secret values;
- schema/migration and backup/restore documentation;
- buyer activation, entitlement, revocation, and recovery flow;
- Tavily integration and provenance behavior;
- Per-marketplace authorization/approved-use evidence, capability-flag state, permitted access scope, attribution/cache/rate-limit restrictions, and a clear `pending_approval`/`unavailable` status when automated access is not authorized;
- test plan and actual results, clearly separating mocks from live integration tests;
- deployment/rollback and incident runbooks;
- telemetry/alert validation evidence;
- known limitations, open risks, deferred features, and explicit owners;
- evidence of no client-side secret exposure and no cross-user access.

### Non-negotiable handoff
Stage 20 must be able to independently verify the system without relying on verbal claims. If an item is not implemented or not tested, label it as such and keep it open. A checklist marked complete without evidence is not acceptable.

---

## 14. Approved initial implementation decision record

**Decision status:** APPROVED ARCHITECTURE DEFAULT FOR THE FIRST IMPLEMENTATION; exact dependency versions and live account configuration must still be verified before coding is considered implementation-ready.

The purpose of this record is to remove avoidable technology ambiguity while preserving the stage boundaries. These are defaults for one modular application, not a mandate to create separate services.

| Concern | Approved initial choice | Binding implementation constraints |
|---|---|---|
| Application | Next.js App Router, React, TypeScript | One repository and one app. Keep domain logic in server-side modules and vendor-specific logic behind adapters. The browser owns presentation, not protected decisions or secrets. |
| Production runtime/hosting | Cloudflare Workers using the established OpenNext adapter for Next.js App Router | This is an intentional risk-based exception to Cloudflare's current recommendation of vinext for new Next.js applications: vinext is in beta/active development and documents compatibility gaps, while OpenNext has the longer production track record. The app prioritizes mature behavior for paid access, server sessions, and protected data over adopting the newer toolchain by default. Run the mandatory compatibility spike covering route handlers, secure cookies, scheduled work only if independently required by another approved capability, and Supabase connectivity. Pin supported versions. Do not switch to vinext mid-implementation; reconsider only through an explicit architecture review if the spike fails or vinext's compatibility evidence materially changes. |
| Identity and sessions | Supabase Auth with cookie-based server-side sessions via `@supabase/ssr` | Supabase documents `@supabase/ssr` as beta/unstable; pin the exact compatible version, encapsulate it behind one auth/session adapter, and do not scatter SDK-specific session logic across routes. The compatibility spike must test sign-in, verified identity, cookie refresh/write behavior, expiry, logout, revocation, cache headers (`private, no-store` for authenticated responses), and protected route behavior. Validate entitlement independently on the server. Do not treat client auth state as authorization. |
| Primary persistence | Supabase-managed PostgreSQL | Use versioned migrations, foreign keys, uniqueness constraints, transactions where needed, and row-level security on user-owned tables. Use user-scoped access for ordinary requests. A service-role credential is server-only and permitted only in trusted operations after explicit authorization or for narrowly scoped webhook/admin workflows. |
| Purchase source | Manual owner review of the Gumroad/Selar storefront order record, outside the app | Record only purchase origin and minimal owner-reviewed reference; no provider API/webhook/reconciliation is implemented or assumed. Owner review is not described as automated provider verification. |
| Buyer access decision | Owner-only approve/revoke/block action after manual purchase review | The server validates the configured owner principal, target account, state transition, and audit write. No buyer activation key, license API, or email automation is required. |
| Discovery | Tavily REST adapter in trusted server-side code | Read `TAVILY_API_KEY` only from the Cloudflare Worker secret configuration. Never expose it to the browser or buyers. Preserve provider-vs-original-source provenance and Stage 16 typed failure outcomes. |
| Marketplace opportunity access | Optional, independent Upwork and Fiverr adapters behind Stage 4's source interface; default disabled | Enable each only after documented authorization for the exact buyer-demand surface and commercial use. No scraping, unofficial endpoints, account/session-cookie reuse, or use of Tavily to bypass restrictions. Do not classify freelancer service listings or marketplace user profiles as client opportunities. If approved access is unavailable, label the capability `pending_approval`/`unavailable` and use only a reviewed direct-open/manual-review path where permitted. |
| Secret/configuration storage | Cloudflare Worker secrets for runtime secrets; environment-specific configuration for non-secrets | Separate local, test/staging, and production values. No production secret in Git, client assets, source maps, fixtures, or routine logs. Provide only unmistakable placeholders in examples. |
| Optional dedicated user PIN | **Deferred from the first release**; not a login or entitlement mechanism | Do not add PIN fields or PIN-based access paths to the MVP unless the scope is explicitly reopened. Authentication, server-side entitlement, and secure sessions are the required controls. If a PIN is later added as an app-lock convenience, it must be user-specific, rate-limited, securely verified server-side, and never replace authentication or entitlement. |
| Automated testing | Vitest for unit/contract tests; Playwright for browser/end-to-end flows | Use deterministic fixtures for provider, purchase, entitlement, and failure tests. Live integration tests are separate, controlled, and never use real buyer actions. |
| CI/CD and repository checks | GitHub Actions with type-check, lint, unit/contract tests, build, and required security/configuration checks | CI must not require production secrets for ordinary pull-request tests. Deployment is blocked by failed critical checks. Keep test/staging and production credentials separate. |
| Observability | Structured, redacted server logs and Cloudflare runtime observability for the first release | Emit the Stage 18 event contract and Stage 16 failure categories. Never log activation keys, session tokens, API keys, payment details, or unnecessary personal data. Add a third-party analytics service only if a specific need and privacy review justify it. |

### Compatibility rationale and external documentation checked

The selected OpenNext path is deliberate, not an accidental use of an older default. Cloudflare's current [OpenNext adapter guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/) recommends vinext for new Next.js applications when compatibility allows. However, the [official vinext project status](https://github.com/cloudflare/vinext/blob/main/README.md) still describes it as under active development with compatibility gaps and advises evaluating it against the target workload. Because this product's release-critical paths include paid entitlement, secure sessions, protected user data, webhook processing, and revocation, the initial implementation chooses OpenNext's longer-tested compatibility surface over vinext's newer toolchain. This is a documented risk-based exception, not a claim that OpenNext is universally preferred. The mandatory compatibility spike is still a stop/go gate.

Supabase's [server-side authentication guide](https://supabase.com/docs/guides/auth/server-side) currently identifies `@supabase/ssr` as beta/unstable. Stage 19 therefore requires exact version pinning, a single adapter boundary, explicit refresh/cookie/cache tests, and no dependency upgrade without the authentication and cross-user isolation regression suite. Do not scatter SDK-specific auth behavior through domain routes.

**Purchase-provider scope:** Gumroad and Selar are used as storefronts for the first release. The configured owner checks the purchase record manually; the application does not call provider purchase/license APIs or consume provider webhooks. This avoids treating undocumented provider behavior as an access-control dependency. If automated verification is considered later, it requires a separately approved contract, documented provider capabilities, security review, and new compatibility evidence before implementation.

### Purchase and entitlement rules that are fixed for implementation

1. Registration and checkout redirects never grant protected access.
2. New app accounts start in `PENDING` until the configured owner manually reviews the purchase record and approves the matching account.
3. Only the configured owner can approve, revoke, or block. Actor identity and role are established server-side.
4. Persist one canonical active-state value (`ACTIVE`) plus `PENDING`, `REVOKED`, and `BLOCKED`; keep UI label mapping separate.
5. Every protected request checks current entitlement and resource ownership; no client-supplied role/status is trusted.
6. Owner changes are atomic, concurrency-safe, idempotent where applicable, and auditable with minimal purchase metadata.
7. Revocation/blocking is enforced on subsequent protected requests; an auth or entitlement-store outage fails closed.
8. RLS prevents cross-user access, and owner actions cannot be called by customers.
9. No automatic Gumroad/Selar API, license-key activation, purchase webhook, or recurring refund/dispute reconciliation is a first-release requirement.
10. Do not add paid email automation or store full payment data.


### Mandatory pre-implementation spike

Before coding the full product, implement and test only the smallest proof of compatibility:
- deploy a minimal Next.js route through the selected Cloudflare/OpenNext path;
- establish and verify a Supabase Auth session using the pinned `@supabase/ssr` integration and intended server-side cookie approach, including refresh and `Cache-Control: private, no-store` behavior;
- read a protected test record with user-scoped authorization and confirm a second test user receives `DENIED` with no data leakage;
- connect to a non-production Supabase database with migrations and row-level security;
- inject a dummy secret through Cloudflare's server-side secret mechanism and prove it is absent from browser assets/responses/logs;
- verify mocked owner approve/revoke/block actions and a mocked Tavily adapter response through the canonical contracts, including distinct `DENIED` versus `FAILED` outcomes;
- verify owner-only access, no self-approval, pending/revoked/blocked enforcement, RLS, audit integrity, concurrent/duplicate owner actions, and fail-closed behavior using synthetic users in a non-production environment;
- prove duplicate and concurrent entitlement changes cannot bypass authorization or corrupt account bindings;
- prove revocation/blocking is enforced on the next protected request and entitlement-store outages fail closed;
- run automated type-check, unit/contract tests, and a production build.

**Stop/go rule:** if the spike cannot demonstrate server-authoritative sessions, data isolation, and server-only secret handling, do not build downstream features on top of it. Record and approve a stack adjustment first.

## 15. Final architecture decision

**Selected: D — One modular product + server-side application boundary + vendor-neutral adapters + server-authoritative entitlement + isolated secret/configuration environments + durable user-scoped persistence + contract-driven observability and deployment.**

This is the strongest fit for the product's trust model and implementation capacity. It prevents the most damaging architectural shortcuts: browser-held provider secrets, purchase redirects treated as payment proof, provider results treated as evidence truth, failure converted into empty discovery, and vendor-specific behavior leaking into assessment logic.

**Completion boundary:** Stage 19 architecture is specified here. The concrete technology decisions must be recorded before coding, and implementation, live provider verification, automated test execution, deployment rehearsal, and production readiness remain unclaimed until verified. Stage 20 owns the final launch decision.


---
