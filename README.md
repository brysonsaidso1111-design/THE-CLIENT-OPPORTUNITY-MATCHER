# T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™

An evidence-backed client opportunity discovery, matching, and decision-intelligence system for freelancers and solo service providers.

## Repository status

The 20 documents in `docs/stages/` define the architecture. The repository previously contained architecture specifications only; this branch establishes the first executable domain foundation and CI test path.

**This is not a production-ready application.** Buyer activation, live Gumroad verification, authenticated sessions, database persistence/RLS, live provider adapters, UI, deployment, and security validation remain unimplemented.

## Start here

1. Read the authoritative product and system contracts in `docs/stages/`.
2. Install Node.js 22 LTS and npm.
3. Install dependencies: `npm install`.
4. Run all local checks: `npm run check`.
5. Review [the implementation-readiness record](docs/implementation-readiness.md).

## Architecture rules that must not be bypassed

- Browser state or a success-page redirect is never proof of purchase.
- Authorization and entitlement decisions are server-side and fail closed.
- User-owned records must be isolated by authenticated identity and database policy.
- Platform credentials stay server-side and never use a `NEXT_PUBLIC_` prefix.
- A valid empty search is not a provider failure.
- Expected authorization denial is `DENIED` with a `denialCode`; technical failure is `FAILED` with a `failureCode`.
- Source, evidence, and claim are distinct records; provenance and uncertainty must survive normalization and assessment.
- Unknown is not a failed requirement. Conflicting or stale evidence must not be silently treated as verified.
- Hard requirements gate eligibility; preferences do not independently exclude an opportunity.
- Eligibility, match, rank, quality, risk, recommendation, user action, and external outcome remain separate.
- An apply intention is not proof that an application was submitted.
- Never close an implementation issue based only on an architecture document or an unexecuted test.

## Environment variables

Copy `.env.example` to `.env.local` for local development and fill values from the relevant providers. Never commit real credentials. The example documents configuration boundaries; it is not proof that integrations exist.

## Current implementation slice

- Strict TypeScript baseline, Vitest, and GitHub Actions CI
- Canonical typed operation-outcome union and runtime shape guard
- Source/evidence/claim models and evidence referential-integrity validation
- User profile, hunt, constraint, and canonical opportunity contracts
- Currency and budget-range validation
- Conservative tri-state hard-constraint eligibility evaluation
- Provider-neutral discovery port and request validation
- Pure server-authoritative entitlement policy with session, product, expiry, and ownership checks
- Explicit opportunity lifecycle transition rules and confirmation guardrails
- Domain contract tests for the above

## Next implementation sequence

1. Run and review the deployment-adapter compatibility spike before locking framework-specific production wiring.
2. Implement database schema/migrations and user isolation/RLS policies.
3. Implement authenticated session and purchase-entitlement flows; verify Gumroad capabilities for the configured product before relying on license activation.
4. Implement server-side discovery adapter, timeouts/retries/rate limits, and provenance preservation.
5. Build assessment/matching/ranking layers according to their stage-owned contracts.
6. Build the UI and connect it only to authenticated server APIs.
7. Complete integration, adversarial, accessibility, recovery, and release-gate evidence.

Passing domain tests does not establish production security or launch readiness. Keep stage issues open until their actual acceptance evidence exists.
