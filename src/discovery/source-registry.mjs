const TAVILY_SOURCE = Object.freeze({
  id: "tavily-web-search",
  name: "Tavily Web Search",
  category: "PUBLIC_WEB_SEARCH",
  acquisitionProvider: "TAVILY",
  status: "CONFIGURED",
  capabilities: Object.freeze({
    semanticWebDiscovery: true,
    structuredOpportunitySearch: false,
    publisherUrl: true,
    snippets: true,
    rawPageExtraction: false,
    reliablePublicationDate: false,
    structuredBudget: false,
    structuredContactDetails: false,
    sourceSpecificStatus: false,
    geographicFilter: "QUERY_HINT_ONLY",
    resultLimit: 10,
    maxLookbackDays: 120,
  }),
  limitations: Object.freeze([
    "Search results are observations, not verified opportunities.",
    "Publication dates and contact details may be absent.",
    "The source does not guarantee active demand, budget, or availability.",
    "A search snippet is not sufficient proof for a material claim.",
  ]),
  costPolicy: Object.freeze({
    initialCallsPerHunt: 1,
    adaptiveAdditionalCalls: 2,
    maxResultsPerCall: 10,
    advancedDepthRequiresJustification: true,
  }),
});

export function getSourceRegistry() {
  return [TAVILY_SOURCE];
}

export function routeSources(hunt, registry = getSourceRegistry()) {
  if (!hunt || typeof hunt !== "object") {
    throw new TypeError("A validated Hunt is required for source routing.");
  }

  const requestedType = hunt.opportunityType ?? "ANY_RELEVANT";
  const sources = registry.map((source) => {
    const limitations = [...source.limitations];
    let eligible = source.status === "CONFIGURED";
    let routeReason = "Supports semantic public web discovery.";

    if (
      ["STRUCTURED_JOB_LISTING", "FREELANCE_MARKETPLACE_LISTING", "PROCUREMENT_RECORD"].includes(requestedType) &&
      !source.capabilities.structuredOpportunitySearch
    ) {
      routeReason = "Can discover relevant pages, but cannot guarantee structured records for this opportunity type.";
      limitations.push("Use a source specific structured adapter when available.");
    }

    if (hunt.requireStructuredContacts && !source.capabilities.structuredContactDetails) {
      eligible = false;
      routeReason = "Excluded because structured contact data is a hard requirement and this source cannot guarantee it.";
    }

    if (hunt.requireStructuredBudget && !source.capabilities.structuredBudget) {
      eligible = false;
      routeReason = "Excluded because structured budget data is a hard requirement and this source cannot guarantee it.";
    }

    return {
      sourceId: source.id,
      eligible,
      routeReason,
      limitations,
      capabilities: source.capabilities,
    };
  });

  return {
    selectedSourceIds: sources.filter((source) => source.eligible).map((source) => source.sourceId),
    sources,
    status: sources.some((source) => source.eligible) ? "ROUTED" : "NO_COMPATIBLE_SOURCE",
  };
}

export function createHuntBudget(overrides = {}) {
  const integer = (value, fallback, min, max) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) return fallback;
    return Math.max(min, Math.min(max, parsed));
  };

  return Object.freeze({
    maxProviderCalls: integer(overrides.maxProviderCalls, 3, 1, 3),
    initialProviderCalls: 1,
    maxResultsPerCall: integer(overrides.maxResultsPerCall, 10, 1, 10),
    maxUniqueCandidates: integer(overrides.maxUniqueCandidates, 10, 1, 10),
    maxFreshnessDays: integer(overrides.maxFreshnessDays, 120, 1, 120),
  });
}
