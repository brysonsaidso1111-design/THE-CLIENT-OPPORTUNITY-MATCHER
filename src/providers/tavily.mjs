const API_URL = "https://api.tavily.com/search";
const MAX_QUERY_LENGTH = 400;
const MAX_RESULTS = 10;
const MAX_FRESHNESS_DAYS = 120;
const ALLOWED_DEPTHS = new Set(["basic", "advanced", "fast", "ultra-fast"]);

export class TavilyProviderError extends Error {
  constructor(code, message, status = null) {
    super(message);
    this.name = "TavilyProviderError";
    this.code = code;
    this.status = status;
  }
}

function validDate(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isoDay(date) {
  return date.toISOString().slice(0, 10);
}

function clampInteger(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isInteger(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

export function buildTavilyQuery(hunt) {
  if (typeof hunt === "string") {
    const query = hunt.trim();
    if (!query || query.length > MAX_QUERY_LENGTH) {
      throw new TypeError("Search query must contain between 1 and 400 characters.");
    }
    return query;
  }

  if (!hunt || typeof hunt !== "object") {
    throw new TypeError("A structured Hunt is required.");
  }

  const terms = [
    hunt.service,
    ...(Array.isArray(hunt.capabilities) ? hunt.capabilities : []),
    hunt.problemSolved,
    hunt.deliverable,
    hunt.targetClientType,
    hunt.industry,
    hunt.location,
    hunt.engagementType,
    ...(Array.isArray(hunt.demandSignals) ? hunt.demandSignals : []),
  ]
    .filter((value) => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  const uniqueTerms = [...new Set(terms)];
  if (!uniqueTerms.length) {
    throw new TypeError("Hunt must include a service, capability, or demand signal.");
  }

  const demandTerms = [
    "project",
    "contract",
    "request for proposal",
    "looking for",
    "seeking",
    "procurement",
  ];
  const composed = [...uniqueTerms, ...demandTerms].join(" ");
  const query = composed.slice(0, MAX_QUERY_LENGTH).trim();
  if (!query) throw new TypeError("Hunt did not produce a usable query.");
  return query;
}

export function assessTavilyFreshness(result, options = {}) {
  const now = options.now instanceof Date ? options.now : new Date();
  const freshnessDays = clampInteger(options.freshnessDays, MAX_FRESHNESS_DAYS, 1, MAX_FRESHNESS_DAYS);
  const sourceDate = validDate(
    result?.published_date ??
    result?.publishedDate ??
    result?.updated_date ??
    result?.updatedDate ??
    result?.date
  );

  if (!sourceDate) {
    return {
      sourceDate: null,
      freshnessState: "UNKNOWN",
      isWithinWindow: false,
      ageDays: null,
    };
  }

  const ageDays = Math.floor((now.getTime() - sourceDate.getTime()) / 86400000);
  if (ageDays < 0) {
    return {
      sourceDate: isoDay(sourceDate),
      freshnessState: "UNKNOWN",
      isWithinWindow: false,
      ageDays,
    };
  }

  const isWithinWindow = ageDays <= freshnessDays;
  return {
    sourceDate: isoDay(sourceDate),
    freshnessState: isWithinWindow ? "WITHIN_WINDOW" : "OUTSIDE_WINDOW",
    isWithinWindow,
    ageDays,
  };
}

export function classifyDiscoveryObservation(result) {
  const title = typeof result?.title === "string" ? result.title : "";
  const content = typeof result?.content === "string" ? result.content : "";
  const text = `${title} ${content}`.toLowerCase();

  const directSignals = [
    /\b(request for proposal|request for quotation|rfp|rfq|seeking a|looking for a|looking for an|hiring a freelancer|contract opportunity|submit proposal|project brief|vendor solicitation|procurement notice)\b/,
    /\b(we are seeking|we are looking for|need a freelancer|need an agency|inviting bids|open call for proposals)\b/,
  ];
  const demandSignal = directSignals.some((pattern) => pattern.test(text));
  const genericContent = /\b(how to|tutorial|ultimate guide|tips for|what is|top \d+|best practices|course|training)\b/.test(text);
  const servicePromotion = /\b(our services|hire our team|we offer|contact us for|award winning agency|service provider)\b/.test(text);

  if (genericContent || servicePromotion) {
    return {
      candidateType: "CONTEXT_OR_PROMOTION",
      demandEvidence: "NOT_ESTABLISHED",
      requiresReview: true,
    };
  }

  if (demandSignal) {
    return {
      candidateType: "POSSIBLE_DIRECT_OPPORTUNITY",
      demandEvidence: "SIGNAL_DETECTED_REQUIRES_SOURCE_REVIEW",
      requiresReview: true,
    };
  }

  return {
    candidateType: "POTENTIAL_PROSPECT",
    demandEvidence: "UNCONFIRMED",
    requiresReview: true,
  };
}

function validateResult(result, now, freshnessDays) {
  if (!result || typeof result !== "object") return null;
  if (typeof result.url !== "string" || typeof result.title !== "string") return null;

  let url;
  try {
    url = new URL(result.url);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const freshness = assessTavilyFreshness(result, { now, freshnessDays });
  const classification = classifyDiscoveryObservation(result);
  return {
    title: result.title.trim(),
    sourceUrl: url.toString(),
    sourceDomain: url.hostname.toLowerCase(),
    evidenceSnippet: typeof result.content === "string" ? result.content.trim() : "",
    providerScore: Number.isFinite(result.score) ? result.score : null,
    provider: "TAVILY_SEARCH",
    retrievedAt: now.toISOString(),
    sourcePublishedAt: freshness.sourceDate,
    freshnessState: freshness.freshnessState,
    ageDays: freshness.ageDays,
    withinFreshnessWindow: freshness.isWithinWindow,
    candidateType: classification.candidateType,
    demandEvidence: classification.demandEvidence,
    requiresReview: classification.requiresReview,
    verificationState: "UNVERIFIED",
  };
}

export async function searchTavily({
  query,
  hunt,
  apiKey = process.env.TAVILY_API_KEY,
  fetchImpl = globalThis.fetch,
  maxResults = MAX_RESULTS,
  searchDepth = "basic",
  freshnessDays = MAX_FRESHNESS_DAYS,
  now = new Date(),
} = {}) {
  const normalizedQuery = buildTavilyQuery(hunt ?? query);
  if (typeof apiKey !== "string" || !apiKey.trim()) {
    throw new TavilyProviderError("MISSING_API_KEY", "Tavily is not configured on the server.");
  }
  if (typeof fetchImpl !== "function") {
    throw new TavilyProviderError("FETCH_UNAVAILABLE", "The server cannot execute web discovery.");
  }
  if (!ALLOWED_DEPTHS.has(searchDepth)) {
    throw new TypeError("Unsupported Tavily search depth.");
  }

  const resultLimit = clampInteger(maxResults, MAX_RESULTS, 1, MAX_RESULTS);
  const lookbackDays = clampInteger(freshnessDays, MAX_FRESHNESS_DAYS, 1, MAX_FRESHNESS_DAYS);
  const startDate = new Date(now.getTime() - lookbackDays * 86400000);
  const payload = {
    api_key: apiKey,
    query: normalizedQuery,
    search_depth: searchDepth,
    topic: "general",
    max_results: resultLimit,
    start_date: isoDay(startDate),
    end_date: isoDay(now),
    include_answer: false,
    include_raw_content: false,
    include_images: false,
    include_usage: true,
  };

  let response;
  try {
    response = await fetchImpl(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new TavilyProviderError("NETWORK_ERROR", "Tavily could not be reached.");
  }

  if (response.status === 401 || response.status === 403) {
    throw new TavilyProviderError("AUTHENTICATION_FAILED", "Tavily rejected the server credentials.", response.status);
  }
  if (response.status === 429) {
    throw new TavilyProviderError("RATE_LIMITED", "Tavily rate limit reached.", response.status);
  }
  if (!response.ok) {
    throw new TavilyProviderError("PROVIDER_ERROR", `Tavily returned HTTP ${response.status}.`, response.status);
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new TavilyProviderError("MALFORMED_RESPONSE", "Tavily returned an unreadable response.");
  }
  if (!body || !Array.isArray(body.results)) {
    throw new TavilyProviderError("MALFORMED_RESPONSE", "Tavily response did not contain a results list.");
  }

  const seen = new Set();
  const results = [];
  for (const raw of body.results) {
    const normalized = validateResult(raw, now, lookbackDays);
    if (!normalized) continue;
    const dedupeKey = normalized.sourceUrl.replace(/#.*$/, "").replace(/\/$/, "");
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    results.push(normalized);
  }

  const inWindow = results.filter((result) => result.withinFreshnessWindow);
  const unknownDate = results.filter((result) => result.freshnessState === "UNKNOWN");
  return {
    provider: "TAVILY_SEARCH",
    query: normalizedQuery,
    retrievedAt: now.toISOString(),
    requestedFreshnessDays: lookbackDays,
    searchDepth,
    resultCount: results.length,
    usage: body.usage ?? null,
    results: [...inWindow, ...unknownDate].slice(0, resultLimit),
    excludedOutsideWindowCount: results.filter((result) => result.freshnessState === "OUTSIDE_WINDOW").length,
    unknownDateCount: unknownDate.length,
    outcome: results.length ? "RESULTS_RETURNED" : "NO_VALID_RESULTS",
  };
}
