# Locked Product Workflow Specification

**Product:** T4L GROWTH™ | THE CLIENT OPPORTUNITY MATCHER™  
**Attribution:** by Terrence  
**Owner approved:** 2026-10-19  
**Implementation branch:** implementation/ready-to-code-foundation  
**Status:** LOCKED PRODUCT REQUIREMENTS. Implementation and verification are tracked separately.

This specification records the owner approved product workflow. It supplements the existing 20 stage architecture and does not override security, data, evidence, provider, or release contracts. If implementation details conflict with an existing authoritative stage contract, stop and reconcile the contracts before coding.

## 1. Authoritative user journey

1. The user creates or edits a brief.
2. The user selects **Search based on my brief**.
3. The system searches the live internet using the selected brief and returns structured prospect cards.
4. The user reviews the real prospects, their source evidence, freshness, fit explanation, unknowns, and next steps.
5. The user navigates to the separate Opportunity Verdict page or section and selects **Analyse my latest search**.
6. The verdict evaluates the actual latest completed search results against the exact brief snapshot used for that search.
7. The user reviews evidence based findings and practical next steps.

The search action and verdict action are separate operations. Analysing the latest search must not silently launch another search.

## 2. Brief requirements

The brief is the central input to discovery and evaluation. It must support the user's service, target client or business type, target location or market, relevant requirements, preferences, and deal breakers, using the approved domain contract.

Keep the first brief experience straightforward. Optional advanced preferences must not make initial onboarding unnecessarily heavy.

Provide two distinct actions in the Client profile or brief workspace:
- **Search based on my brief**: starts discovery using the selected saved brief.
- **Edit brief**: opens the brief editor so the user can revise their requirements without starting from scratch.

The selected brief must be identifiable. Every completed search must retain a snapshot or immutable version reference to the brief used. If the user later edits the brief, do not represent results from the previous brief as if they were searched using the new one. Explain that a fresh search is needed when appropriate.

## 3. Discovery and result integrity

Search must use live internet discovery through configured, permitted providers. The provider is an acquisition mechanism; the original publisher page remains the evidence source. A search provider returning a URL does not prove that the page's claims are true.

Never fabricate prospects, organizations, source URLs, publication dates, budgets, contact information, hiring status, demand, or evidence. Do not call a result fresh merely because it was retrieved recently. Distinguish:
- verified source facts;
- reasonable inferences;
- unknown or unavailable information;
- conflicting evidence;
- retrieval or provider failures.

A provider failure is not the same as a successful search with zero results. If no results can be established, explain this truthfully. Respect configured provider budgets, result limits, caching, deduplication, and usage controls. Provider credentials must remain server side.

## 4. Prospect cards

Results must be presented as structured, individual prospect cards, never as a long AI generated article or essay.

Each card should include, where available:
- real prospect or organization name;
- original source link;
- concise evidence indicating potential need;
- concise explanation of relevance to the user's brief;
- publication or update date when the source provides one;
- freshness or uncertainty information;
- important unknowns such as budget or current need;
- a useful next action, such as opening the source or reviewing the prospect.

Do not invent missing values to make a card look complete. Label unavailable information clearly.

### Equal card layout

Cards displayed together in the same grid must have equal heights and consistent visual structure. Use consistent padding, spacing, typography, and section alignment. Limit long previews consistently and provide a way to inspect further details. Align source links and primary actions at the bottom of each card. Keep the layout responsive across mobile and desktop widths. Variable text length must not cause neighbouring cards to look uneven.

The card layout is a presentation rule only. It must never change evidence, matching, ranking, or verdict logic.

## 5. Opportunity Verdict

The Opportunity Verdict action must not appear as a primary action on the Client profile search screen. It belongs in its own clearly identifiable page or section.

The action label is **Analyse my latest search**.

The analysis must use:
- the actual latest completed search result set;
- the exact brief snapshot used for that search;
- source evidence and retrieval metadata available for those results.

It must not create a generic assessment from the brief alone, invent evidence, or silently analyse stale results as though they belong to an edited brief. If no completed search exists, explain that the user must search first. If the brief has changed since the search, clearly disclose the mismatch and offer a fresh search before analysis.

The verdict should separate evidence from inference and unknowns. Assess relevant fit, evidence of need, budget evidence when available, timing or freshness, deal breakers, risks, and missing information. Missing evidence must not automatically be treated as a mismatch. A hard requirement failure must remain distinct from an unknown. Recommendations must not be described as guaranteed outcomes.

## 6. Peer Lead Network

Provide a clearly labelled **Join the T4L Peer Lead Network** link in the main workspace. Also show it in a relevant empty results state where community collaboration may help.

Use the configured current Discord invitation URL. The previously supplied URL was https://discord.gg/ZdK56RFN, but the implementation should use a current configuration value rather than assume the invitation remains valid forever. Do not display a broken button if no valid invitation is configured.

The Peer Lead Network is a community pathway, not a prospect, source, matching input, ranking factor, or verdict signal. Keep it visually separate from prospect cards.

## 7. Navigation and state behavior

Every step must make the next action understandable:
- after saving a brief, guide the user to search;
- after a successful search, guide the user to review results and then open the separate verdict section;
- after analysis, show the verdict and relevant next steps;
- provide honest loading, empty, partial, error, and unavailable states;
- do not imply a search or analysis succeeded until it actually succeeds.

Preserve the distinction between a successful empty result set and a failed or degraded provider operation.

## 8. Existing architecture and security remain binding

This specification does not waive existing requirements for:
- server side authentication and current entitlement checks before protected operations;
- owner reviewed manual access approval for the first release;
- user data isolation and row level security;
- server side provider secrets;
- evidence provenance and freshness;
- controlled provider budgets, deduplication, and usage tracking;
- consistent operation outcomes and truthful failure handling;
- testing and release gates.

The current repository baseline must be inspected before implementation. Do not claim a feature is implemented or verified based only on this document.

## 9. Acceptance checklist

- [ ] The user can create, select, and edit a brief.
- [ ] Search uses the selected brief and starts a live provider operation.
- [ ] Each search retains its brief snapshot and source provenance.
- [ ] Results are structured prospect cards, not an article.
- [ ] Cards in the same grid have equal heights and aligned actions.
- [ ] Source facts, inferences, unknowns, conflicts, and freshness are distinguished.
- [ ] The Peer Lead Network link opens the configured invitation and is separate from matching.
- [ ] Opportunity Verdict is separate from the Client profile search page.
- [ ] **Analyse my latest search** evaluates the latest completed results against their original brief snapshot.
- [ ] Editing a brief cannot silently relabel old results as current.
- [ ] Empty, partial, failed, and unavailable states are distinguishable.
- [ ] Authentication, entitlement, data isolation, provider secret, usage, and release checks pass before protected release.

**Lock rule:** Product changes to this workflow require explicit owner approval. Implementation may improve clarity or accessibility but must not silently change the agreed journey or remove any of the requirements above.
