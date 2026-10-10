# Sources Page — Product and Implementation Contract

## Purpose

The home page must make source selection a first-class part of the discovery workflow. Users decide **where the app should look for client opportunities**; the system must then search only sources that are selected and genuinely supported.

## Home page

Include a prominent **Sources** navigation item or card. Show a compact summary of the user's current selection (for example, “4 sources selected”) and a clear route to manage it. The count must reflect the user's saved preferences, not the number of integrations that happen to be operational.

## Sources page

Group the catalog into understandable categories:

- **Freelance marketplaces:** Upwork, Fiverr, and other marketplaces only when a permitted and tested discovery method exists.
- **Professional and social networks:** LinkedIn and other networks only through permitted integrations or user-directed workflows.
- **Search and business discovery:** web search, company websites, public business directories, and niche directories.
- **Communities:** relevant forums, communities, and public discussion spaces where client needs may surface.
- **Job boards and opportunity listings:** general and specialist boards that publish relevant service needs.

The catalog is extensible. A source appearing in the catalog does not imply that automated search is currently available.

## Source record and status

Each source needs a stable machine ID, user-facing name, category, short explanation, support mode, operational status, and any setup instructions. Keep support mode distinct from the user's enabled/disabled preference.

Suggested support modes:

- `api`: a documented API or permitted provider integration is implemented.
- `manual`: the product guides the user through a source-specific manual workflow.
- `link_out`: the product can send the user to the source but does not claim to search it.
- `unsupported`: implementation is not yet available.

Suggested operational states include `available`, `setup_required`, `degraded`, and `unavailable`. Do not label a source “connected” unless a real connection check supports that claim.

## Selection and persistence

- Users can select and deselect sources and save their choices.
- Saved selections belong to the authenticated user and must be enforced server-side and through database row-level security.
- The discovery request may contain only selected sources that the server currently supports.
- Unknown, unsupported, or unauthorized source IDs must fail closed or be reported as unavailable; never silently claim they were searched.
- Show a useful explanation when no source is selected or no selected source is currently usable.

## Provenance and discovery integrity

Every discovered opportunity should retain source identity and the original listing URL when available, retrieval time, and evidence/provenance references. A provider returning zero results is different from a provider failure. Results from one source must not be presented as if they came from another.

## Platform and privacy constraints

Use documented APIs, permitted integrations, or user-directed/manual workflows. Respect source terms, access controls, rate limits, and robots/access restrictions. Do not request or store platform passwords/cookies, implement stealth scraping, or bypass access controls. Provider credentials remain server-side. Source selection is a user preference, not a guarantee of integration availability or client acquisition.

## Required UI states

Cover loading, saved selection, unsaved changes, no source selected, selected source unsupported, setup required, provider unavailable/degraded, valid zero results, and successful results. Selected states must be accessible by keyboard and assistive technology.

## Acceptance criteria

- Home page links to Sources and shows the saved selected-source count.
- Source catalog uses stable IDs, categories, clear descriptions, and truthful support/connection states.
- Users can select/deselect, save, and reload their choices.
- Preferences are isolated by authenticated user, with authorization tests.
- Discovery uses only selected, supported sources.
- Opportunity records preserve source identity, original URL, retrieval timestamp, and provenance/evidence where available.
- Loading, empty, unsupported, setup-required, and error states have tests.
- Keyboard interaction and accessible selected-state announcements are verified.
- UI never implies an unimplemented integration is live.
