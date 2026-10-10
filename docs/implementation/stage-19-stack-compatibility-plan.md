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
