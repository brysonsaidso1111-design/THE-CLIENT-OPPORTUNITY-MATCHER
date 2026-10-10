# T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™

An evidence-backed client opportunity discovery, matching, and decision-intelligence system for freelancers and solo service providers.

## Repository status

The 20 documents in `docs/stages/` define the architecture. This repository previously contained architecture specifications only; it did not contain an executable application. This branch establishes the first code baseline and canonical operation-outcome contract.

**This is not a production-ready application.** Purchase verification, authenticated buyer access, persistence, provider adapters, UI, deployment, and security validation are not implemented by this bootstrap.

## Start here

1. Read the authoritative product and system contracts in `docs/stages/`.
2. Install Node.js LTS and npm.
3. Install dependencies: `npm install`.
4. Run the initial checks: `npm run check`.

## Architecture rules that must not be bypassed

- Browser state or a success-page redirect is never proof of purchase.
- Authorization and entitlement decisions are server-side.
- User-owned records must be isolated by authenticated identity and database policy.
- Platform credentials stay server-side and never use a `NEXT_PUBLIC_` prefix.
- A valid empty search is not a provider failure.
- Expected authorization denial is `DENIED` with a `denialCode`; technical failure is `FAILED` with a `failureCode`.
- Evidence provenance and uncertainty must survive normalization and assessment.
- A score or rank must not erase hard eligibility failures, evidence gaps, or opportunity risk.
- Never close an implementation issue based only on an architecture document or an unexecuted test.

## Environment variables

Copy `.env.example` to `.env.local` for local development and fill values from the relevant providers. Never commit real credentials. The example is a contract, not proof that the integrations already exist.

## Current implementation slice

- Strict TypeScript baseline
- Vitest test runner
- Canonical typed operation-outcome union
- Runtime shape guard for untrusted outcome objects
- Initial contract tests for empty success, denial/failure separation, partial results, and malformed outcomes

## Next implementation sequence

1. Validate the deployment adapter choice with a minimal compatibility spike before locking framework-specific production wiring.
2. Implement domain entities and provenance/evidence contracts.
3. Implement user identity, entitlement, and authorization gates before exposing protected data.
4. Add persistence schemas and row-level user isolation.
5. Add provider interfaces and deterministic fake adapters before live Tavily/Gumroad integration.
6. Build end-to-end flows and launch evidence; do not mark runtime or production gates complete without test artifacts.
