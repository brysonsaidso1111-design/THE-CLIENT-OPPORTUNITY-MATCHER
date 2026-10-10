# Stage 19 — Next.js/OpenNext Stack Compatibility Spike

**Status:** IMPLEMENTED IN BRANCH; HOSTED EXECUTION PENDING. This is a spike harness, not a production release.

## Exact top-level dependency pins

- Node.js: 22.20.0
- Next.js: 16.3.6
- React / React DOM: 19.3.0
- `@opennextjs/cloudflare`: 1.20.6
- Wrangler: 4.135.0
- `@supabase/ssr`: 0.12.7
- `@supabase/supabase-js`: 2.117.1
- TypeScript: 5.9.3
- `@types/node`: 22.18.6
- `@types/react`: 19.3.0
- `@types/react-dom`: 19.2.3

These are exact direct-dependency pins, not yet a committed transitive lock. The CI workflow generates a lockfile, performs a clean `npm ci`, typechecks, runs contract tests, builds Next.js, builds the OpenNext Worker output, and uploads the generated lockfile for review/commit. Do not claim reproducible dependency closure until the artifact lockfile is committed and a subsequent clean `npm ci` passes against that committed file.

## Spike artifacts

- Minimal App Router route and layout for framework build validation only; this is not the finished product UI.
- OpenNext Cloudflare config and Wrangler Worker config with `nodejs_compat`.
- Request-scoped server-only Supabase SSR client helper using async Next.js cookies.
- Non-secret `.env.example`; real values belong in deployment secret settings only.
- CI workflow with no production secrets and no deployment step.

## Acceptance gates

1. Exact direct dependencies resolve and install cleanly.
2. `npm ci` succeeds against generated lock.
3. `npm run check` succeeds (TypeScript and Node contract tests).
4. `npm run build` succeeds.
5. `npm run build:worker` succeeds with the selected OpenNext/Wrangler path.
6. Generated package-lock is reviewed, committed, and a fresh clean install succeeds.
7. This does not prove Supabase session lifecycle, PostgreSQL migrations/RLS, secret leakage, or live Tavily connectivity. Those remain separate non-waivable gates.


## Actual hosted result — 2026-10-10

- Successful workflow run: [#38093896644](https://github.com/brysonsaidso1111-design/THE-CLIENT-OPPORTUNITY-MATCHER/actions/runs/38093896644), tested candidate commit `e5eb883f5d2760e778380ebb1e2dd110a8c829b4`.
- Passed: generated lock, clean `npm ci`, TypeScript check, contract tests, Next.js production build, OpenNext Worker build.
- The lockfile was committed by the successful workflow as `0f6ba499483df918c3fe8bed1cfdcae3206bea66`. Lockfile v3 contains 472 package entries; SHA-256: `4dff7d38cdf4c3dea11316a0a09427c2542695e2854a866e66cf801a50c2d398`.
- A fresh workflow run against the branch containing the committed lockfile is still required before marking the lockfile gate VERIFIED.

## Stack decision note

Current Cloudflare guidance recommends vinext for new Next.js projects and documents OpenNext as a supported path for existing OpenNext apps. The approved project contract remains Next.js + OpenNext; this spike proves that the pinned OpenNext path builds. Do not silently switch to vinext. If a later compatibility/security issue materially favors changing the approved adapter, document the evidence and request an explicit architecture decision.
