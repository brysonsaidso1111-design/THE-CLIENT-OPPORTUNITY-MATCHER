export const SOURCE_CATEGORIES = [
  "freelance_marketplace",
  "professional_network",
  "web_search",
  "business_directory",
  "community",
  "job_board",
] as const;

export type SourceCategory = (typeof SOURCE_CATEGORIES)[number];

export const SOURCE_SUPPORT_MODES = [
  "api",
  "manual",
  "link_out",
  "unsupported",
] as const;

export type SourceSupportMode = (typeof SOURCE_SUPPORT_MODES)[number];

export const SOURCE_OPERATIONAL_STATES = [
  "available",
  "setup_required",
  "degraded",
  "unavailable",
  "not_verified",
] as const;

export type SourceOperationalState =
  (typeof SOURCE_OPERATIONAL_STATES)[number];

export interface SourceDefinition {
  readonly id: string;
  readonly name: string;
  readonly category: SourceCategory;
  readonly description: string;
  readonly supportMode: SourceSupportMode;
  readonly operationalState: SourceOperationalState;
  readonly websiteUrl: string;
}

/**
 * Static catalog metadata only. These entries do not imply that live adapters,
 * account connections, or automated search are implemented.
 */
export const SOURCE_CATALOG: readonly SourceDefinition[] = [
  {
    id: "upwork",
    name: "Upwork",
    category: "freelance_marketplace",
    description: "Find project briefs and client opportunities on Upwork.",
    supportMode: "link_out",
    operationalState: "not_verified",
    websiteUrl: "https://www.upwork.com/",
  },
  {
    id: "fiverr",
    name: "Fiverr",
    category: "freelance_marketplace",
    description: "Explore relevant buyer and service opportunities on Fiverr.",
    supportMode: "link_out",
    operationalState: "not_verified",
    websiteUrl: "https://www.fiverr.com/",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "professional_network",
    description: "Identify relevant companies, decision-makers, and public posts.",
    supportMode: "link_out",
    operationalState: "not_verified",
    websiteUrl: "https://www.linkedin.com/",
  },
  {
    id: "web_search",
    name: "Web search",
    category: "web_search",
    description: "Discover public pages that signal a need for your services.",
    supportMode: "unsupported",
    operationalState: "not_verified",
    websiteUrl: "https://www.google.com/",
  },
  {
    id: "business_directories",
    name: "Business directories",
    category: "business_directory",
    description: "Find businesses that match your target-client criteria.",
    supportMode: "manual",
    operationalState: "not_verified",
    websiteUrl: "https://www.google.com/maps/",
  },
  {
    id: "online_communities",
    name: "Online communities",
    category: "community",
    description: "Explore relevant public discussions and requests for help.",
    supportMode: "manual",
    operationalState: "not_verified",
    websiteUrl: "https://www.reddit.com/",
  },
  {
    id: "job_boards",
    name: "Job boards",
    category: "job_board",
    description: "Find contract, freelance, and specialist service requests.",
    supportMode: "manual",
    operationalState: "not_verified",
    websiteUrl: "https://www.indeed.com/",
  },
] as const;

export type SourceId = (typeof SOURCE_CATALOG)[number]["id"];

export function isSourceId(value: string): value is SourceId {
  return SOURCE_CATALOG.some((source) => source.id === value);
}

export function getSourceById(id: string): SourceDefinition | undefined {
  return SOURCE_CATALOG.find((source) => source.id === id);
}

export function normalizeSelectedSourceIds(
  ids: readonly string[],
): { readonly validIds: readonly SourceId[]; readonly unknownIds: readonly string[] } {
  const validIds: SourceId[] = [];
  const unknownIds: string[] = [];
  const seen = new Set<string>();

  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);

    if (isSourceId(id)) validIds.push(id);
    else unknownIds.push(id);
  }

  return { validIds, unknownIds };
}

/**
 * A source is eligible for automated discovery only when it is explicitly
 * API-backed and verified available. Manual/link-out sources remain useful
 * UI choices but must not be reported as searched by an automated adapter.
 */
export function isEligibleForAutomatedDiscovery(
  source: SourceDefinition,
): boolean {
  return (
    source.supportMode === "api" &&
    source.operationalState === "available"
  );
}
