# Testing, Environment & Release Evidence Plan

This is the common verification contract for all 20 stage handoffs. Detailed stage documents retain authority over stage-specific behavior.

## Environment tiers

| Tier | Purpose | Credentials/data | Release restrictions |
|---|---|---|---|
| Local development | Fast deterministic unit/contract/UI work | Local-only dummy secrets and synthetic fixtures | Never use production credentials or buyer data |
| CI / pull request | Reproducible install, lint, type-check, unit/contract tests, build, selected security checks | No production secrets; use fixtures and ephemeral test configuration | Required checks must pass before merge |
| Integration test | Controlled provider/API contract checks and database behavior | Dedicated test project/database, synthetic users, test provider credentials where available | Label mock vs live; no real purchase/refund/application actions |
| Staging | Full deployment rehearsal and end-to-end security/recovery checks | Separate staging secrets, database, webhook endpoint, test purchase data | No production buyer records; release candidate identified by commit SHA |
| Production | Paying users | Least-privilege production secrets and durable records | Deploy only after Stage 20 GO and verified rollback/recovery plan |

## Required check layers

1. **Static/repository:** clean install from lockfile; formatter/linter; TypeScript type-check; secret scanning; dependency/security checks as selected; production build.
2. **Unit:** pure domain rules and policy functions; deterministic fixtures; explicit boundary-value cases.
3. **Contract:** stage inputs/outputs, typed result envelopes, schema validation, version compatibility, and prohibition of hidden semantic changes.
4. **Adapter:** Tavily, Gumroad, persistence, telemetry, and hosting/runtime boundaries; test timeouts, malformed data, auth denial, rate limits, and unavailable services.
5. **Database:** migrations, constraints, transaction/atomic activation, RLS, ownership, concurrency, idempotency, backup/restore, and forward recovery.
6. **Security/adversarial:** unauthenticated access, entitlement bypass, wrong product, stale/revoked entitlement, cross-user reads/writes, session refresh/expiry/logout, webhook replay/forgery, secret leakage, unsafe cache headers, injection/untrusted external content, and abuse/rate limits.
7. **Pipeline integration:** discovery → evidence → normalization → eligibility → semantic fit → score → rank → intelligence → quality/risk/recommendation; assert provenance, uncertainty, completeness, and failures survive every handoff.
8. **User journey/e2e:** activation, protected access, create/edit brief, hunt/discovery, inspect evidence, compare, save/pass/apply-open, record actual outcome, feedback, lifecycle, empty/partial/degraded states, logout/revocation.
9. **Resilience/recovery:** provider outage, timeout, rate limit, telemetry outage, uncertain persistence result, duplicate/out-of-order webhooks, concurrent action/activation, migration failure, restore, rollback, and recovery verification.
10. **Accessibility/usability:** keyboard-only path, focus order/visibility, labels and announcements, contrast, responsive behavior, and error/uncertainty comprehension.
11. **Operational/release:** health/readiness, dependency capability status, required config, redacted logs, alert firing, migration state, deploy/rollback, secret rotation, runbook rehearsal, and post-rollback verification.

## Shared operation outcome taxonomy

Use the Stage 16 contract; do not create local variations. At minimum, preserve valid success with data; valid empty result (SUCCESS_EMPTY); valid incomplete result (SUCCESS_PARTIAL); expected authorization/access denial (DENIED plus denial_code); technical/dependency failure (FAILED plus failure_code); and cancellation/timeout/retryability where defined by the contract.

Never map an outage, invalid credentials, parse failure, or unavailable provider into a successful empty result. A mock pass is not a live provider pass.

## Required evidence record per check

For each test or operational check, record:
- stage(s) and acceptance criterion;
- test/check name and exact command or reproducible procedure;
- result and timestamp;
- commit SHA / release candidate;
- environment tier and dependency mode (mock, sandbox/test, or live);
- sanitized logs/report link;
- failures, known blind spots, and defect IDs;
- owner and retest result for resolved defects.

Do not store secrets, session cookies, activation keys, raw payment data, or unnecessary personal data in test output.

## Release blocking rules

- Any P0/P1 security, data-isolation, entitlement, provenance, lifecycle integrity, or release-critical contract defect blocks launch.
- Missing evidence is NOT VERIFIED, not PASS.
- Failed required checks block merge/release according to branch protection policy.
- A failed live integration check cannot be replaced by a passing mock; scope must be explicitly limited or the failure fixed.
- A rollback is not verified until data compatibility, entitlement, persistence, access, telemetry, and user-visible behavior have been rechecked.
- Stage 20 records the final GO/NO-GO decision against one exact commit and environment. The stage cannot approve itself on documentation or a green build alone.
