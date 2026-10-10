# Implementation Readiness Record

**Branch:** `codex/implementation-readiness`  
**Purpose:** establish a tested first code baseline without misrepresenting architecture documents as production software.

## Verified in repository CI

- Strict TypeScript compiler configuration.
- Vitest test runner and GitHub Actions CI workflow.
- Canonical operation outcome union and runtime shape guard.
- Source/evidence/claim separation with evidence bundle referential-integrity checks.
- Canonical user, hunt, constraint, and opportunity types.
- Money-range and currency-code validation.
- Conservative tri-state hard-constraint eligibility evaluation.
- Provider-neutral discovery port and request validation.
- Pure server-authoritative entitlement policy, including ownership and expiry checks.
- Explicit opportunity lifecycle transition rules that require confirmation for external outcomes.

CI status is authoritative for the commit SHA shown in the [Actions runs](https://github.com/brysonsaidso1111-design/THE-CLIENT-OPPORTUNITY-MATCHER/actions). These tests validate domain contracts only.

## Architecture decisions deliberately not frozen yet

- Production framework/hosting adapter: run the Stage 19 Cloudflare/OpenNext compatibility spike before committing to framework-specific wiring.
- Database schema and migrations: choose only after the data contracts and Supabase SSR/session behavior are validated.
- Gumroad activation: verify current per-sale license-key behavior and purchase-verification API access for the actual configured product before implementing paid activation.
- Tavily adapter: use a server-only key and preserve provider/native identifiers separately from original publisher provenance.

## Required before any real buyer data or production launch

- Authenticated server session and verified entitlement integration.
- Database migrations, row-level security policies, and cross-user isolation tests.
- Authenticated and idempotent purchase event processing and reconciliation.
- Provider adapter error mapping, bounded retries, timeouts, rate limits, and live-vs-mock test separation.
- Privacy-safe telemetry, redaction, retention/deletion behavior, and operational alerts.
- Deployment, secret rotation, backup/restore where applicable, rollback rehearsal, accessibility review, and release-candidate evidence.

## Definition of ready to begin application coding

The repository now has a compiling/testable domain foundation and a CI path. Application implementation can begin on this branch. The production checklist above remains open until the relevant code, integration tests, and evidence exist. No existing launch-gate issue should be closed solely because these baseline tests pass.
