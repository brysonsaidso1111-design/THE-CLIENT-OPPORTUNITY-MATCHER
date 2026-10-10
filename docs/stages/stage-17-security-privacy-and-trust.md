# Stage 17 — Security, Privacy & Trust Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Brand mark:** The Exploded T  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Previous stage:** Stage 16 — Failure, Degradation & Recovery  
**Next stage:** Stage 18 — Analytics, Observability & Quality  
**Status:** STAGE 17 — ARCHITECTURE CONSOLIDATED; IMPLEMENTATION, SECURITY TESTS, AND PRODUCTION READINESS NOT CLAIMED

---

## 1. Purpose and critical boundary

Stage 17 defines the security, privacy, access-control, credential, entitlement, and trust rules that must protect the product and its users.

The governing rule is:

**Protected access must be granted only after server-side authorization succeeds; secrets must remain secret; and one buyer must never gain access to another buyer's private data.**

The product is buyer-only. A public URL, the quickstart PDF, a browser-side flag, a hidden screen, a locally stored PIN, or knowledge of an app route is not proof of purchase. Access is authorized by a server-controlled entitlement record and an authenticated session or equivalent server-verified request context.

Stage 17 owns security semantics and required controls. It does not claim to implement a production authentication system or payment verification. Stage 19 implements the Gumroad, activation, session, data-store, hosting, and provider integrations. Stage 20 verifies those implementations with adversarial tests and evidence.

Stage 17 does not own:
- opportunity lifecycle transitions (Stage 15);
- operational failure taxonomy and recovery policy (Stage 16);
- dashboards, analytics pipelines, or alerting implementation (Stage 18);
- live integrations, deployment wiring, and production runtime implementation (Stage 19);
- final launch approval (Stage 20).

---

## 2. The five governing architecture questions — answered

### Question 1: How does the system establish that a user is entitled to use the paid app?

**Decision: D — Server-verified, revocable entitlement with a unique activation credential and an authenticated session.**

The required customer journey is:

**Gumroad purchase → delivery of quickstart PDF and app link → unique activation credential → activation against the server → entitlement validation → authenticated, authorized app session.**

The quickstart PDF and app URL are onboarding conveniences, not access controls. A buyer activation credential is a bootstrap credential used to claim or activate the purchase; it is not the same as the Tavily API key, a permanent shared app password, or a user-created convenience PIN.

The server must maintain an authoritative entitlement record with, at minimum:
- a stable internal entitlement identifier;
- a trusted purchase/provider reference when available;
- product/SKU identifier and entitlement scope;
- status such as pending, active, suspended, revoked, refunded, disputed, or expired where applicable;
- activation status and activation timestamp;
- association with the account or identity that claimed it;
- created/updated timestamps and an auditable reason/source for status changes;
- only a cryptographic hash or equivalent non-reversible verifier for an activation secret when the credential must be retained for later verification.

Never trust a status, purchase amount, email address, or entitlement claim supplied only by browser code. The server must validate the claim against a trusted record or a properly authenticated purchase-verification mechanism. The exact Gumroad API/webhook flow and verification of webhook authenticity are Stage 19 implementation decisions constrained by this contract.

Activation credentials must be unique, sufficiently unpredictable, scoped to the intended product/entitlement, single-use where practical, time-limited where feasible, rate-limited, and revocable. Do not use sequential identifiers or weak, guessable codes. Store only a secure verifier/hash for credentials where possible; do not store recoverable plaintext activation secrets in application tables or logs. Deliver a newly generated secret only through the intended secure delivery channel and do not display it again casually after activation.

Activation must be atomic: concurrent attempts cannot claim the same single-use credential twice or attach one entitlement to multiple accounts. If the system cannot confirm entitlement safely, it must not grant protected access. Stage 16 governs how that verification outage is reported without leaking internals.

Refund, chargeback, dispute, manual support intervention, duplicate purchase, lost credential, and account recovery behavior must have explicit state-transition and reconciliation rules. Revocation must affect future authorization promptly and invalidate or re-check existing sessions according to the risk policy. Stage 19 must not assume a Gumroad event is authentic solely because it arrives at a public URL.

### Question 2: What credential and secret types exist, and where may each be used?

**Decision: D — Separate credentials by purpose, authority, and exposure boundary. Never reuse one credential across these roles.**

| Credential / secret | Purpose | Permitted location | Must never appear in |
|---|---|---|---|
| Tavily API key | Platform-owned discovery infrastructure | Server-side deployment secret manager/environment | Browser JS, HTML, client responses, Git, screenshots, buyer forms, URLs, routine logs |
| Gumroad integration credential | Server-to-provider purchase/entitlement verification | Server-side secret store, restricted integration runtime | Browser, user-visible errors, public repo, unredacted logs |
| Webhook signing/verification secret, if used | Authenticate provider event delivery | Server-side secret store and verification code | Browser, URL, event payload logs, public docs |
| Buyer activation credential | Bootstrap an entitlement claim | One-time delivery; transient submission over TLS; secure verifier on server | Tavily configuration, analytics, plaintext database, URLs, support tickets, logs |
| Session cookie/token | Identify an authenticated session | Secure cookie or carefully scoped server-side token mechanism | URLs, analytics, logs, other users' browsers or records |
| Optional user PIN | Convenience or step-up interaction only, if justified | Protected verification flow with appropriate hashing/rate limits | Platform secret store as a shared access key, cross-user lookup, logs |
| Password/reset/recovery token, if implemented | Authentication/account recovery | Secure verifier and time-limited one-use flow | Logs, URLs beyond necessary short-lived delivery, analytics |
| Public identifiers | Reference public products or non-sensitive records | UI/API where necessary | Must not be treated as authorization credentials |

A buyer PIN is optional and must not be introduced as a second access architecture without a concrete need. If used, it is user-scoped and may only supplement—not replace—server-side entitlement checks and session authorization. A single shared PIN, client-side PIN comparison, or PIN hidden in source code is not acceptable.

Tavily is a platform infrastructure credential, not a customer credential. Buyers must never be asked to paste, store, or manage it. The app must not expose whether a secret value is configured or reveal its content to an unauthorized client. Secret rotation and revocation are operator responsibilities implemented through the deployment platform and Stage 19.

### Question 3: How are users, sessions, and private data isolated?

**Decision: D — Deny by default with server-side authorization at every protected boundary and ownership-scoped data access.**

Every protected API operation must authenticate the request and authorize the requested action against the current user, entitlement, resource ownership, and operation scope. Hiding UI controls is not authorization. A user-supplied ID is a locator, not proof of ownership.

Required rules:
- Every user-owned object is associated with an immutable internal owner/account ID, not merely a mutable email address or display name.
- Every query, read, update, delete, export, and action affecting user-owned data applies a server-side ownership/tenant constraint.
- Every opportunity, hunt/search, saved item, user preference, feedback event, decision, and lifecycle record must be scoped to its owner unless a later explicit sharing feature is approved.
- A request for another user's record must fail safely, without revealing whether a private record exists.
- Do not rely on browser-supplied `user_id`, `is_paid`, `is_admin`, `entitlement_status`, or similar flags. Derive authority from the authenticated server-side principal and trusted entitlement state.
- Re-check entitlement for protected operations according to the session/authorization policy, especially for long-lived sessions and after revocation.
- Administrative or support access must be separately authorized, least-privileged, auditable, and unavailable through ordinary buyer roles.
- Cross-user aggregate learning or analytics may use only the minimum necessary data and must not expose another user's records or identifiable private details.
- Shared community information, including Peer Lead Network intelligence, must have an explicit sharing and consent model. Community intelligence is not permission to disclose private saved opportunities, searches, profile data, or user decisions.
- Exports, logs, cached responses, background jobs, and asynchronous processing must preserve the same ownership boundary as direct API requests.
- Cache keys and background-job payloads must include the relevant tenant/user scope where needed to prevent cross-user leakage.

Authorization must be enforced server-side before protected data is fetched or returned. Where the data layer supports row-level security or tenant constraints, use them as defense in depth; do not assume a UI filter alone is sufficient.

### Question 4: How are application security, privacy, and data lifecycle handled?

**Decision: D — Layered defense, data minimization, explicit retention, and privacy by default.**

The implementation should use established framework and platform security primitives rather than inventing cryptography or authentication protocols.

Minimum controls:
- HTTPS/TLS for browser-to-app and app-to-provider connections.
- Secure session handling with `HttpOnly`, `Secure`, and an appropriate `SameSite` cookie policy when cookie-based sessions are used; rotate session identifiers after authentication/activation and invalidate them on logout, revocation, and relevant security events.
- CSRF protection for cookie-authenticated state-changing requests; strict origin checks where applicable.
- Protection against XSS through safe rendering, context-appropriate output handling, dependency hygiene, and a suitable Content Security Policy where feasible.
- Input validation and output encoding at trust boundaries; parameterized database operations; least-privileged service/database credentials.
- Rate limiting and abuse controls for activation, login/recovery, entitlement verification, sensitive reads, and expensive provider-backed discovery.
- CORS restricted to known production origins; never treat CORS as an authorization control.
- Server-side authorization for every protected operation and safe handling of direct-route/API access.
- Dependency and deployment configuration review; no secrets or production personal data in sample fixtures.
- Redacted, access-controlled security logs; never log API keys, session tokens, activation secrets, full authorization headers, or unnecessary sensitive content.
- Data minimization: collect only what is needed for the product, access, support, fraud prevention, and explicitly described functionality.
- Defined retention and deletion rules for user profiles, hunts, opportunities, evidence, decisions, feedback, activation records, security logs, and backups. Deletion must account for lawful retention requirements and backup lifecycle.
- Clear user-facing privacy information explaining what is collected, why, how external sources are used, what is shared, and how users can request access, correction, or deletion where applicable.
- No sale of user data and no unapproved sharing of identifiable private user data with discovery providers or community features.
- Keep product data, entitlement records, provider secrets, and operational telemetry logically separated, with separate access controls and retention where appropriate.
- Treat external opportunity content as untrusted input. It may contain malicious instructions, tracking, deceptive claims, or prompt-injection attempts; it must not be allowed to override system policy, trigger privileged actions, or change access control.

The app should avoid sending unnecessary user profile details to Tavily or other search providers. Construct provider queries using the minimum fields needed for discovery, and do not include activation credentials, session identifiers, private user notes, or sensitive profile data. Provider requests must be scoped to discovery, not entitlement validation.

Privacy and legal compliance must be reviewed for the actual deployment jurisdictions and data flows before launch; this architecture is not a claim of legal certification or regulatory compliance.

### Question 5: How do we verify security and trust rather than merely declare them?

**Decision: D — Threat-model-driven security acceptance with automated negative tests and release evidence.**

Before implementation, Stage 19 must turn the rules into concrete controls. Stage 20 must require evidence that the controls work in the integrated deployment.

Threat scenarios and mandatory tests:
1. A non-buyer opens the app URL directly and calls protected APIs; access is denied.
2. A buyer shares the PDF or app URL without sharing an authorized credential; the recipient cannot gain access.
3. An invalid, guessed, expired, reused, revoked, refunded, or otherwise ineligible activation credential cannot create an authorized session.
4. Two concurrent activation requests cannot claim the same single-use credential twice.
5. A client forges `is_paid=true`, an owner ID, an entitlement status, or a role; server authorization remains unchanged.
6. Buyer A changes an object ID in a request to reference Buyer B's hunt, opportunity, evidence, feedback, or decision; no private data is disclosed or modified.
7. A user with an expired/revoked entitlement cannot continue protected operations beyond the explicitly approved revocation window.
8. Tavily and Gumroad credentials are absent from built frontend assets, browser network responses, public repository content, client errors, URLs, and routine logs.
9. Missing or invalid platform secrets fail safely and do not grant access or prompt buyers to supply infrastructure credentials.
10. Forged or replayed purchase webhooks do not create, reactivate, or extend entitlements.
11. Session fixation, CSRF, direct API calls, unsafe CORS, and basic XSS attempts are tested against the selected architecture.
12. Activation, login, recovery, and expensive discovery endpoints resist brute force and abuse within defined limits.
13. Logout, credential rotation, revocation, and account recovery invalidate or constrain old sessions as specified.
14. User data is isolated across database queries, caches, exports, background jobs, analytics, and logs.
15. Malicious content retrieved from an external source cannot execute code, override instructions, access secrets, or invoke privileged actions.
16. Logs and telemetry are checked for secrets and unnecessary personal data.
17. Backup retention, deletion, and recovery procedures are documented and tested to the degree required for launch.
18. Security failures generate safe user messaging and useful redacted operational signals without disclosing implementation details.
19. Production secret rotation can occur without committing secrets or requiring a buyer to change a user PIN.
20. Stage 20 records reproducible evidence and unresolved risk; a checklist alone does not count as a successful security test.

Architecture review, code review, automated test pass, external security assessment, and legal/privacy review are different evidence types. Do not imply one substitutes for the others. Any material unresolved critical or high-risk issue must be explicitly resolved or formally accepted by the authorized release owner before launch.

---

## 3. Trust boundaries and protected assets

### Protected assets
- Tavily API key and any other discovery-provider credentials.
- Gumroad integration credentials and webhook verification material.
- Buyer activation credentials, account identity, session state, and entitlement status.
- User profiles, search intents/hunts, saved opportunities, evidence notes, decisions, lifecycle records, and feedback.
- Private operational logs, support records, and security events.
- Source and evidence lineage where private user activity could be inferred.

### Trust boundaries
1. **Browser ↔ application server:** treat all browser inputs and client-side state as untrusted.
2. **Application server ↔ database:** use least-privileged credentials and enforce owner scoping.
3. **Application server ↔ Gumroad:** treat inbound notifications as untrusted hints until corroborated by an authoritative server-to-Gumroad lookup; validate product, sale/license identity, and current status before changing entitlement. Verify a webhook signature only if the current Gumroad event type and configured endpoint explicitly support a documented signature. Do not assume Gumroad Ping is signed or that it delivers refund/dispute events; Stage 19 owns verification of actual provider capabilities and the reconciliation implementation. If the trusted API lookup fails because of timeout or outage, preserve the entitlement state and report a Stage 16 technical failure; use `UNTRUSTED_EVENT` only when the event itself is shown to be untrusted.
4. **Application server ↔ Tavily:** send only necessary discovery queries; protect the API key; treat returned content and metadata as untrusted.
5. **Application server ↔ other source/publisher websites:** treat page content as untrusted and preserve source provenance.
6. **Application server ↔ observability/logging services:** redact secrets and minimize personal data.
7. **Support/admin ↔ production data:** require separate authorization, least privilege, and audit trails.
8. **User ↔ community or shared intelligence:** share only through explicit, documented product rules and consent.

No trust boundary is removed because a component belongs to the same repository or because an endpoint is not linked in the UI.

---

## 4. Buyer-only access contract

### Required sequence
1. Purchase occurs through Gumroad or another explicitly approved sales channel.
2. The purchase provider or a trusted server-side reconciliation process establishes a verified entitlement record.
3. The buyer receives the intended quickstart PDF and app link, plus a unique activation credential or secure activation path.
4. The buyer submits the activation credential through HTTPS to the app's server.
5. The server validates the credential, verifies the entitlement is eligible and unclaimed/claimable, atomically binds the entitlement to the account/session identity, and marks the credential consumed when applicable.
6. The server creates or establishes an authenticated session.
7. Each protected request is authenticated and authorized against the current session, entitlement, ownership, and action.
8. Refund, chargeback, dispute, expiry, revocation, or suspected compromise triggers the defined entitlement/session policy.
9. Support and recovery paths must not bypass entitlement verification; they must create an auditable, narrowly scoped change.

### Initial-release entitlement freshness and revocation policy

For the first release, the following values are explicit defaults, not implicit assumptions:

- **Protected-request check:** every protected server request must check the current local entitlement state and ownership, not merely the existence of an authenticated session or a client-side claim.
- **Reconciliation cadence:** Stage 19 must reconcile active entitlements and relevant purchase status at least every 15 minutes, using a trusted server-side Gumroad lookup. A trusted provider notification may trigger an earlier reconciliation but does not replace it.
- **Normal revocation target:** once Gumroad's authoritative API exposes a refund, dispute, disablement, or revocation, the local entitlement must be updated within 15 minutes under normal provider availability; once recorded locally, the next protected request must enforce it and existing sessions must be invalidated or re-authorized according to policy.
- **Provider-outage bound:** new activations fail closed immediately if purchase verification cannot be established. Existing entitlements may rely on the last successfully reconciled local state for at most 24 hours from the last successful authoritative status check. If that freshness bound expires, protected access is suspended until reconciliation succeeds; the user must see a service-availability message, not be told their purchase is invalid.
- **No silent relaxation:** if the compatibility spike proves that the selected Gumroad API/account configuration cannot support the required status checks and reconciliation cadence, stop the paid-access implementation and revisit the integration decision explicitly. Do not silently extend the 24-hour bound or grant access from an unverified notification.

Stage 19 implements these limits and Stage 20 verifies them with deterministic tests and a controlled integration check. A confirmed revocation is applied immediately; the 24-hour bound applies only when the provider's current state cannot be obtained.

### Failure and edge-case rules
- A public app link is not an entitlement.
- A successful Gumroad checkout redirect alone is not sufficient proof unless verified server-side against trusted purchase data.
- A valid activation code alone is not enough if its entitlement is revoked, refunded, expired, mismatched, or already claimed contrary to policy.
- The same activation code cannot activate multiple accounts concurrently.
- Lost-code recovery must verify purchase/account ownership without disclosing whether another buyer's entitlement exists.
- Provider outage or verification uncertainty must fail closed for new protected access and follow Stage 16's safe error contract.
- Revocation checks must have a defined maximum propagation window; Stage 19 must implement and Stage 20 must test it.
- Avoid locking legitimate buyers out permanently after a typo or transient outage; use rate limits, clear recovery paths, and safe retries without weakening authorization.
- Support-issued manual grants must be exceptional, attributable, time-bounded where appropriate, and audited.

### Stage 16 operational-failure mapping for protected access

Security decisions remain owned by Stage 17; the operational failure codes and retry/recovery semantics are owned by Stage 16. Stage 19 must map the concrete integration outcome to both contracts without letting a technical fallback weaken authorization.

| Condition | Stage 16 operational classification | Required security decision | Safe response and recovery |
|---|---|---|---|
| Required authentication, signing, or entitlement-verification configuration is absent | `CONFIGURATION_MISSING` | Fail closed for the protected operation | Return a generic service-unavailable response to the buyer; alert authorized operators through redacted telemetry; do not ask the buyer for a platform secret |
| Session, entitlement store, or trusted verification dependency times out or is unavailable | `TIMEOUT` or `DEPENDENCY_UNAVAILABLE` | Do not grant new access or perform a protected mutation when authorization cannot be established | Preserve the distinction between service unavailability and invalid entitlement internally; permit retry only under Stage 16's bounded policy |
| Activation credential is invalid, expired, already consumed, or mismatched | `DENIED` with `denial_code=INVALID_CREDENTIAL` or `ENTITLEMENT_INACTIVE` as appropriate | Deny activation | Use a non-enumerating buyer-facing response; do not reveal whether another buyer, purchase, or entitlement exists |
| Activation or entitlement write fails or has an uncertain outcome | `PERSISTENCE_FAILED` | Do not issue a success response or authorized session until the entitlement claim is durable and atomic | Roll back where possible; otherwise perform an idempotent read-after-write/reconciliation before retrying |
| Activation/login/recovery attempts exceed an abuse threshold | `DENIED` with `denial_code=ABUSE_LIMITED` | Deny or defer the current attempt without weakening identity or entitlement checks | Apply bounded cooldown and safe retry guidance; do not count expected abuse throttling as a provider outage |
| A notification is malformed, unauthenticated where a documented signature is supported, or cannot be corroborated as a purchase/status change | If the event itself is untrusted: `DENIED` with `denial_code=UNTRUSTED_EVENT`; if the trusted lookup is unavailable: `FAILED` with the Stage 16 `failure_code` | Do not grant or revoke entitlement from the notification alone | Record a redacted security event for a demonstrably untrusted event; retry/reconcile a timeout or provider outage under Stage 16. Reserve `VALIDATION_FAILED` for a technical contract violation, not an ordinary untrusted event or unavailable provider |
| Refund/revocation status cannot be reconciled within the approved freshness/revocation window | Appropriate Stage 16 dependency/persistence failure | Do not silently extend access beyond the approved policy window | Re-check authoritative entitlement state; follow the documented conservative access policy and record the unresolved state |
| Tavily or another discovery provider fails after the buyer is already authorized | Stage 16's provider-specific failure code | Keep entitlement decisions independent from discovery health | Degrade discovery only; do not revoke the buyer's session, fabricate an empty result, or present provider failure as evidence that no opportunities exist |

**Outcome mapping invariant:** a correctly refused protected request is `DENIED` with a `denial_code`; an inability to determine authorization because a trusted service is unavailable is `FAILED` with the appropriate `failure_code` and must fail closed. Do not collapse an invalid buyer credential into a service outage or count a routine denial as a technical failure.

**Non-negotiable invariant:** an authorization or entitlement check may not use a stale positive cache, client-supplied claim, browser flag, public route, quickstart PDF, or successful redirect as a fallback grant. Any cache used to reduce load must have an explicit owner, freshness bound, invalidation strategy, and revocation-window approval. When the trusted authorization state cannot be established within that policy, deny the protected operation safely.

--- 

## 5. Secret-management contract

Stage 19 must use the selected hosting platform's server-side secret/environment configuration or managed secret store. Secret names may appear in deployment documentation; secret values may not.

- Read secrets only in server-side runtime code that needs them.
- Use separate credentials and least-privileged scopes for development, test, and production.
- Never commit real credentials in source files, HTML, client bundles, configuration examples, screenshots, issue text, or test fixtures.
- Provide placeholders such as `TAVILY_API_KEY=replace-in-deployment-secret-store` only in clearly marked examples; ensure the placeholder cannot be mistaken for a working credential.
- Never paste real API keys, Gumroad secrets, activation codes, or session tokens into chat or ordinary support messages.
- Redact sensitive values before error reporting. Avoid logging request headers or provider URLs if they can contain secrets.
- Restrict who can read or rotate production secrets. Rotate immediately after suspected exposure and verify the old value is no longer accepted.
- Ensure frontend build systems do not inline server-only variables into browser assets. A variable prefix convention is not sufficient proof of safety; inspect the generated bundle and network responses.
- Keep CI/CD access minimal. Only workflows that truly need a secret should receive it, and untrusted pull-request code must not receive production secrets.
- A missing secret is a deployment/configuration issue, not a reason to ask the buyer to enter a platform key.

---

## 6. Identity, session, and account lifecycle rules

Stage 19 must choose and document the concrete authentication mechanism before implementation. The architecture requires the following behavior regardless of vendor or framework:

- Establish a stable internal account/user identifier.
- Avoid using email as the sole permanent primary key; emails can change or be shared.
- Verify ownership of any email or recovery channel before using it for account recovery.
- Rotate session identifiers after activation/authentication and privilege changes.
- Apply idle and absolute session expiry suitable for the app's risk profile.
- Support explicit logout and server-side invalidation where applicable.
- Re-check entitlement on protected operations or through a cache with a bounded, documented staleness window.
- Define how entitlement revocation affects already active sessions and background jobs.
- Prevent activation replay, session fixation, token reuse, and account enumeration.
- If passwordless access is selected, one-time links/tokens must be short-lived, single-use, securely generated, and protected from referrer leakage.
- If passwords are selected, use a mature password-hashing implementation and established recovery protections; never invent a password-storage algorithm.
- Account recovery must not become an easier route around purchase validation.
- Avoid collecting extra identity attributes unless needed for access, fraud prevention, support, or the explicitly described product.

This document does not force a particular identity vendor. The final choice must fit the hosting/runtime, the purchase flow, the privacy needs, and the product's maintenance capacity, and must be recorded in Stage 19 before coding the authentication path.

---

## 7. External content, evidence, and AI trust boundaries

The product may discover content through Tavily or other providers, then use source pages and evidence to assess opportunities. All external content is untrusted data.

- Search results, snippets, pages, metadata, filenames, comments, and user-submitted opportunity details cannot issue privileged instructions to the application.
- Never execute code or commands derived from retrieved content.
- Keep external content separate from system/developer instructions and application policy when passed to any model or automated reasoning component.
- Use structured extraction outputs and validate them against schemas before storing or using them.
- Preserve source URLs, retrieval timestamps, provider identifiers, and evidence lineage according to Stages 4–5.
- Do not treat search-provider ranking as evidence quality or source authority.
- Do not let a source page request the Tavily key, activation key, session token, or private user records.
- Any automated tool/action capability must be allowlisted, scoped, and independently authorized; retrieved content cannot expand tool permissions.
- Store only the external content necessary for the product and allowed by source terms and applicable law.
- Make provenance and uncertainty visible to the user; a security filter does not establish that a claim is true.

---

## 8. Privacy, consent, retention, and user trust

The product must make data practices understandable and proportionate.

Stage 19 must produce a data inventory identifying, for each data class, its purpose, source, owner, recipients, storage location, access role, retention period, deletion method, and whether it leaves the platform. Stage 20 verifies the inventory matches actual behavior.

At minimum, inventory:
- account and entitlement data;
- activation and session records;
- profile and capability data;
- hunts/search queries;
- discovered opportunities and normalized records;
- evidence, source metadata, and user notes;
- decisions, actions, lifecycle changes, and feedback;
- operational and security telemetry;
- support and recovery records;
- backups and exported data.

Rules:
- Collect the minimum data needed for each declared purpose.
- Do not send private user notes or unrelated profile attributes to external search providers.
- Distinguish public opportunity-source information from private user activity.
- Do not use private user data to train or personalize cross-user behavior without a defined lawful basis, transparent disclosure, and appropriate controls.
- User-requested deletion must propagate to applicable derived stores and be reflected in backup retention policy; retain only what is necessary and permitted for legal/security reasons, with the exception explained.
- Restrict operational telemetry to the minimum data needed for reliability and security. Prefer stable pseudonymous IDs and aggregate metrics over raw user content.
- Define access and audit controls for staff/support; no routine browsing of private user records.
- Document the use of third-party providers, including the data sent to them and their role.
- Do not claim legal compliance, encryption, deletion, or privacy guarantees until the implementation and applicable review support the claim.

---

## 9. Security events and auditability

Security-relevant events should include, as applicable:
- activation attempted/succeeded/failed;
- entitlement created/updated/revoked/reconciled;
- login/session created, refreshed, expired, and revoked;
- recovery requested/completed/failed;
- repeated invalid credential or rate-limit events;
- denied access or cross-tenant access attempts;
- secret/configuration health changes without recording secret values;
- provider webhook verification and idempotent reconciliation outcomes;
- privileged support/admin action;
- data export/deletion request and completion.

Event records should capture timestamp, event type, outcome, correlation ID, affected internal record identifier where necessary, and actor category. They must not include raw secrets, session tokens, unnecessary request bodies, or full private user content.

Stage 18 owns how these events are measured, visualized, and alerted on. Stage 17 defines their security semantics and safe content. Retention and access to security logs must be restricted and documented.

---

## 10. Explicit handoffs and ownership

### Inputs from earlier stages
- **Stage 1 — Product definition:** buyer-only commercial intent, product trust principles, accessibility, global scope.
- **Stage 2 — User journey:** purchase-to-activation flow, entry states, safe error and recovery experiences.
- **Stage 3 — Domain/data contracts:** canonical user/account identity, data separation, ownership boundaries, domain contracts.
- **Stage 4 — Discovery:** provider adapter and source registry; Tavily is a platform-owned discovery dependency.
- **Stage 5 — Evidence/provenance:** external content is untrusted; preserve provenance, freshness, conflicts, and uncertainty.
- **Stage 6 — Normalization:** source content must not bypass canonicalization or safe identity rules.
- **Stages 7–12 — Assessment:** authorization and source trust must not be conflated with eligibility, fit, score, ranking, quality, risk, or recommendation.
- **Stage 13 — User action:** only authenticated, authorized user intent may initiate protected actions; confirm durable outcomes honestly.
- **Stage 14 — Feedback/learning:** only permitted, attributable, correctly scoped events may inform learning.
- **Stage 15 — Opportunity lifecycle:** private lifecycle records remain user-scoped; access/security events do not invent lifecycle transitions.
- **Stage 16 — Failure/recovery:** authorization failures, missing secrets, provider outages, and recovery use the shared failure taxonomy; failure must not grant access.

### Outputs to later stages
- **Stage 18 — Analytics/observability/quality:** security-event definitions, redaction requirements, privacy constraints, access and retention rules.
- **Stage 19 — Integration/production:** implementable requirements for purchase verification, activation, authentication/session management, entitlement checks/revocation, secret storage, user-data isolation, webhook verification, privacy controls, and secure deployment.
- **Stage 20 — Final readiness/launch gate:** adversarial test scenarios, evidence requirements, unresolved-risk policy, and proof that protected access and user isolation work.

### Authority rule
Stage 17 owns security and privacy requirements. It does not redefine the meaning of opportunity evidence, matching, ranking, lifecycle, or operational failure. Later stages implement these requirements without silently weakening them. If implementation constraints require a change, record the decision and its cross-stage consequences explicitly rather than making an undocumented exception.

---

## 11. Required acceptance criteria

- [ ] Entitlement is authoritative on the server and cannot be granted by browser flags or a purchase redirect alone.
- [ ] Purchase events are authenticated, validated, deduplicated, and reconciled idempotently.
- [ ] Activation credentials are unique, sufficiently unpredictable, scoped, rate-limited, and consumed/revoked according to policy.
- [ ] Concurrent activation cannot claim one entitlement twice.
- [ ] Tavily, Gumroad, webhook, and other platform secrets remain server-side.
- [ ] Buyer activation credentials, sessions, provider credentials, and optional PINs are separate credential classes.
- [ ] Every protected endpoint verifies authentication, current entitlement, action permission, and resource ownership.
- [ ] Cross-user access is denied across primary storage, caches, exports, jobs, feedback, and logs.
- [ ] Session creation, expiry, logout, revocation, and recovery behavior are specified.
- [ ] Security errors follow Stage 16 and do not leak sensitive details.
- [ ] External source content is treated as untrusted and cannot trigger privileged behavior.
- [ ] Data inventory, purpose, retention, deletion, third-party flows, and support access are documented.
- [ ] Security telemetry is useful, access-controlled, and redacted.
- [ ] Threat-based negative tests exist and pass in the actual implementation before launch.
- [ ] Stage 20 contains reviewable evidence for buyer-only access, secret protection, and user isolation.
- [ ] No claim of production security or legal compliance is made from architecture documentation alone.

---

## 12. Stage-specific integration points and executable handoff contracts

This section converts Stage 17's security principles into explicit boundaries that Stage 19 can implement and Stage 20 can verify. These are architecture contracts, not claims that the endpoints, middleware, storage, or tests already exist.

### 12.1 Integration-point register

| Integration point | Producer / caller | Consumer / authority | Required input | Required output / observable result | Failure and security rule |
|---|---|---|---|---|---|
| Purchase confirmation intake | Gumroad webhook or controlled reconciliation job (Stage 19) | Entitlement service owned by Stage 17 | Authenticated event or trusted server-side purchase lookup; provider event ID; product/SKU; purchase reference; event timestamp | Validated, deduplicated entitlement command and recorded reconciliation result | Reject unauthenticated/invalid events; idempotently ignore duplicates; never trust browser redirect or client-submitted purchase status |
| Entitlement record write | Verified purchase intake or authorized support workflow | Entitlement store/service | Validated purchase reference, product scope, status transition, actor/reason | Durable entitlement state and audit event | Enforce legal transitions and uniqueness; no grant on uncertain verification; support overrides are narrowly scoped and attributable |
| Activation claim | Buyer activation UI (Stage 2) | Server-side activation service | Activation credential over HTTPS, minimal account/session-claim data, CSRF protection where cookie-based | Generic success/failure response and authenticated session only after atomic validation | Rate-limit; resist guessing and enumeration; consume single-use credential atomically; do not reveal another buyer's record |
| Session establishment | Successful activation/authentication service | Session service and protected app shell | Verified identity, entitlement ID, session policy | Secure session cookie/token and server-side session state as selected by Stage 19 | Use secure cookie attributes where cookies are chosen; rotate after privilege change; no tokens in URLs or analytics |
| Protected-request authorization | Every protected route, API, server action, job, and export | Shared authorization guard | Session identity, requested action, resource owner/tenant, current entitlement state | Allow/deny decision with stable internal reason and minimal safe client response | Default deny if identity, entitlement, ownership, or policy cannot be verified; do not rely on UI hiding controls |
| User-data scope enforcement | Domain/data access layer (Stage 3) | Storage adapters, caches, background jobs, exports, feedback and lifecycle services | Authenticated user/tenant scope plus requested record identifiers | Only records the caller is authorized to access | Enforce scope server-side on every read/write; test IDOR/cross-user access; never use a public identifier as authorization |
| Platform secret resolution | Server-side adapter runtime (Stage 19) | Deployment secret manager/environment | Named secret reference and runtime identity | Secret available only to the minimum server-side process that needs it; no secret value in the returned application payload | Missing secret maps to Stage 16 configuration failure; do not ask buyers for platform keys; never expose secret in logs, source maps, bundles, or client responses |
| External content boundary | Discovery/evidence adapters (Stages 4–5) | Normalization and downstream assessment pipeline | Provider payload plus provenance and retrieval metadata | Validated untrusted content, provenance preserved, safely bounded size/type | Treat content as data, not instructions; sanitize rendered output; no external content can change authorization or trigger privileged actions |
| Privacy and retention control | User settings/support/admin process, where authorized | Data lifecycle services and storage adapters | Authenticated request, purpose/legal basis policy, data category, scope | Recorded export/deletion/retention action or explicit blocked/pending state | Verify ownership and permissions; preserve legally/operationally required audit records under documented policy; don't claim deletion until confirmed |
| Security audit event | Auth, entitlement, authorization, secret and privacy control points | Stage 18 telemetry/audit pipeline | Event type, timestamp, correlation ID, pseudonymous actor/resource refs, outcome and normalized reason | Redacted, access-controlled event with retention classification | Never log activation secrets, session tokens, API keys, full payment payloads, or unnecessary personal data; telemetry failure must not silently grant access |
| Revocation and reconciliation | Verified refund/chargeback/dispute event or trusted reconciliation job | Entitlement and session services | Verified provider event/reference, target entitlement, transition reason | Durable status update, session invalidation/re-check and auditable outcome | Idempotent processing; define and test maximum revocation propagation; uncertainty must not extend access silently |
| Security acceptance evidence | Stage 19 tests and deployment artifacts | Stage 20 launch gate | Test IDs, environment/build, result, timestamp, sanitized evidence, unresolved defects | Reviewable pass/fail evidence linked to each acceptance criterion | Architecture text or a green UI alone is not evidence; no launch approval with unresolved critical access-control or secret-exposure defects |

### 12.2 Shared contract fields

Stage 19 must select concrete framework and persistence representations, but all integration points must preserve these semantics:

- **Identity:** stable internal user/account identifier; never infer identity from an unverified email or browser-supplied user ID.
- **Entitlement:** stable entitlement identifier, product scope, authoritative status, verified purchase reference, activation/claim state, timestamps, and auditable status source.
- **Activation credential:** high-entropy random secret; only a secure verifier/hash retained server-side where possible; expiry/consumption state; rate-limit and attempt metadata that does not store the raw credential.
- **Authorization decision:** subject, action, resource scope, decision, normalized reason, policy/version where useful, and correlation ID. Keep detailed reasons internal; expose only safe messages.
- **Session:** stable session identifier or verifier, subject, creation/expiry/last-activity metadata as required, revocation state, and authentication strength where relevant. Never log the bearer value.
- **Secret reference:** logical name and environment/scope only; no raw value in contracts, client state, telemetry, or persisted business records.
- **Security event:** event ID, timestamp, event type, outcome, correlation ID, minimized actor/resource references, normalized reason, and retention/access classification.
- **Operation outcome:** use Stage 16's exact status set and fields: `DENIED` requires `denial_code`; `FAILED` requires `failure_code`; valid empty and partial success, cancellation, and not-run remain separate. Distinguish invalid credentials, inactive/revoked entitlement, abuse throttling, and service unavailability internally while keeping buyer-facing errors safe.

Do not make every object contain every field. Each contract includes only fields needed for its purpose. The above list fixes meaning, not a universal giant schema.

### 12.3 API and interaction boundaries

Stage 19 must map these logical operations to the chosen framework without changing their security semantics:

1. **Activate entitlement:** accept activation data only over HTTPS; validate and atomically claim; return a session only after entitlement checks succeed.
2. **Read current access state:** return only the authenticated caller's minimal account/entitlement state; never return activation verifiers or provider secrets.
3. **Authorize protected operation:** enforce authentication, current entitlement, permission, and resource ownership server-side for every protected request.
4. **Receive purchase-provider event:** verify authenticity before processing; validate product identity and state; deduplicate using the provider's stable event/reference; acknowledge only according to the provider's retry contract.
5. **Reconcile entitlement:** query trusted provider records when required; process status changes idempotently; invalidate or re-check sessions within the declared revocation window.
6. **Logout/revoke session:** invalidate the relevant server-side session or rotate/revoke its verifier; do not treat deleting a client UI flag as sufficient.
7. **Request data export/deletion:** authenticate and scope the request; apply retention/legal holds where applicable; report pending, completed, or blocked accurately.
8. **Emit security event:** send the minimum redacted event to Stage 18 using a stable schema; telemetry must not contain raw secrets.

These are logical operations, not a demand to create eight separate public endpoints. Stage 19 may combine or split routes based on the framework, provided every operation remains explicit, testable, and covered by the authorization guard.

### 12.4 End-to-end invariants and test seams

The implementation must expose test seams for:
- trusted purchase-event verification and duplicate-event replay;
- atomic single-use activation under concurrent requests;
- active, revoked, refunded, disputed, expired, mismatched-product, and unclaimed entitlement states;
- session expiry, logout, revocation, and authorization re-check;
- direct API calls that bypass the UI;
- cross-user access attempts against IDs, exports, cached results, background tasks, feedback, and lifecycle records;
- missing/invalid Tavily and Gumroad secrets without leaking values;
- malicious or instruction-like external content;
- audit/telemetry redaction;
- privacy request authorization and truthful completion status.

The test suite must assert both the expected result and the forbidden side effect. For example, a failed activation must not create a session; a duplicated purchase event must not create a second entitlement; a cross-user request must not return data; and a missing secret must not trigger a buyer-facing request to supply it.

### 12.5 Integration dependencies and handoff ownership

- **Stage 1 → Stage 17:** commercial access intent and trust promises. Stage 17 makes the buyer-only rule enforceable.
- **Stage 2 → Stage 17:** activation, login, session-expiry, denial, recovery, and logout screens. Stage 2 owns the journey; Stage 17 owns the security conditions for each state.
- **Stage 3 → Stage 17:** canonical user, entitlement, ownership, and data-boundary concepts. Stage 3 owns domain shape; Stage 17 owns the security policy applied to it.
- **Stages 4–5 → Stage 17:** provider identity, provenance, and untrusted content. Stage 17 sets trust boundaries; it does not rewrite evidence quality.
- **Stages 6–15 → Stage 17:** canonical records, assessment outputs, decisions, feedback, and opportunity lifecycle. Stage 17 enforces access and ownership without redefining those domain meanings.
- **Stage 16 → Stage 17:** typed failure outcomes and fail-safe recovery. Stage 17 defines the security result when verification or authorization is unavailable; Stage 16 defines operational failure semantics.
- **Stage 17 → Stage 18:** security event vocabulary, data minimization, redaction, retention class, and access control for telemetry.
- **Stage 17 → Stage 19:** authoritative buyer-entitlement, activation, session, authorization, secret-management, privacy, and audit contracts. Stage 19 chooses framework-specific implementation details and proves them with tests.
- **Stage 17 → Stage 20:** threat scenarios, forbidden side effects, acceptance criteria, revocation timing, and required evidence. Stage 20 decides launch readiness based on verified results.

### 12.6 Scope decisions for the first implementation

The first release should implement the minimum secure architecture—not speculative account features:
- buyer-specific verified entitlement and a unique activation path;
- server-side authorization on all protected app data and operations;
- secure session lifecycle and revocation;
- server-side secret handling for Tavily and purchase integration;
- user-scoped data access;
- redacted security events;
- explicit recovery and support procedures;
- adversarial automated tests for the critical access and isolation paths.

An optional user PIN, complex role hierarchy, multi-tenant organization model, or advanced device-risk scoring must not be added unless a demonstrated requirement justifies it. A PIN cannot substitute for entitlement validation.

### 12.7 Stage 17 handoff is complete when

- Each protected operation has an identified authorization owner and test seam.
- Buyer activation and purchase verification have explicit inputs, outputs, state transitions, and failure semantics.
- All secret types have a defined owner, location, exposure prohibition, and rotation/revocation path.
- User/resource ownership checks cover APIs and background execution, not just visible UI screens.
- Security telemetry has a schema and redaction boundary compatible with Stage 18.
- Stage 19 can implement the contracts without guessing about security meaning.
- Stage 20 can map each critical requirement to reproducible evidence.
- Any unresolved policy decision is explicitly marked as a blocker or bounded decision—not silently deferred to coding.

---
## 13. Final architecture decision

**Selected: D — Server-authoritative entitlement and sessions + unique activation credentials + strict separation of platform and user secrets + ownership-scoped access + privacy by default + threat-based release evidence.**

This is the strongest fit because it enforces the product's paid-access model without confusing onboarding links with security, prevents a provider credential from becoming a buyer-facing concern, and creates explicit controls for user-data isolation. It keeps security semantics centralized while assigning implementation and verification to the correct later stages.

**Completion boundary:** Stage 17 architecture is specified here. Authentication code, Gumroad verification, secret configuration, data-layer enforcement, penetration testing, and production readiness remain unclaimed until implemented and verified in Stages 19–20.


---

## Marketplace access and platform-policy safeguards — Upwork and Fiverr

The product's goal of helping freelancers find opportunities on Upwork and Fiverr does not override either marketplace's terms, access controls, API approval requirements, privacy rules, or data-use restrictions.

### Required authorization gate

Before enabling any automated marketplace adapter, the operator must document:
- the exact approved access route and application/use case;
- written approval, API agreement, partner authorization, or other required permission;
- the specific data fields and discovery surfaces permitted;
- display attribution, caching, retention, and redistribution conditions;
- rate limits and revocation/incident procedures;
- the date of review and the owner responsible for revalidation.

**Upwork:** Do not scrape, crawl, automate browser interactions, reuse session cookies, or collect marketplace content through unapproved methods. An API credential alone is not proof that this product's commercial use, scopes, aggregation, or data display is approved. Where required, obtain prior written commercial/API permission and implement only the authorized scope.

**Fiverr:** Do not scrape Gig pages or buyer-demand surfaces, bypass restrictions, imitate a user session, or use unofficial endpoints to extract marketplace data. Fiverr Gig listings are sellers' service offers, not proof that those sellers are clients seeking to hire the app's user. Enable buyer-brief discovery only if the relevant surface is available to this application through an authorized and permitted route.

If authorization is absent, expired, revoked, or unclear, disable the automated capability and expose a clear unavailable/pending-approval state. Do not route around the restriction through Tavily, another search provider, a third-party scraper, user cookies, or a proxy. A result indexed by a search engine is not automatic permission to collect, republish, or retain it.

### Safe fallback and user-submitted material

A user may be offered a manual review path—such as opening the marketplace directly and optionally submitting a listing URL or content they are authorized to share—only after the platform terms and content-use restrictions for that path have been reviewed. The app must:
- label such material as user-supplied, with submission time and an explicit unverified-freshness state;
- avoid automatically fetching restricted pages or requesting platform passwords, cookies, or session tokens;
- collect only the minimum content needed for assessment;
- retain original attribution and respect deletion/retention limits;
- avoid treating manual submission as permission to redistribute marketplace data to other users.

### Marketplace account and action safety

Do not ask for marketplace passwords, session cookies, or personal access tokens in the app. Do not automate proposals, messages, purchases, orders, ranking manipulation, or other account actions without a separately approved platform capability and explicit product authorization. The default user action is to open the original listing on the marketplace and decide/act there.

Stage 17 owns security and policy gates; Stage 4 defines source capabilities; Stage 16 defines the shared technical-failure and expected-denial outcome taxonomy; Stage 19 implements the approved integration; Stage 20 verifies evidence before any marketplace source is advertised as live.
