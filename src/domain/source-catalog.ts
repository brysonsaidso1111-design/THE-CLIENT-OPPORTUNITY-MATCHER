export const SOURCE_CATEGORIES = [
  "freelance_marketplace",
  "professional_network",
  "social_network",
  "web_search",
  "business_directory",
  "community",
  "job_board",
  "portfolio_network",
  "startup_network",
  "developer_platform",
  "creative_network",
  "referral_network",
  "local_business",
  "procurement",
  "event_network",
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
 * Catalog metadata, not a claim that an integration is live. All entries
 * remain unverified until a permitted adapter or source-specific workflow is
 * implemented, tested, and its status is deliberately updated.
 */
export const SOURCE_CATALOG: readonly SourceDefinition[] = [
  // Freelance marketplaces
  { id: "upwork", name: "Upwork", category: "freelance_marketplace", description: "Project briefs, contract work, and client requests.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.upwork.com/" },
  { id: "fiverr", name: "Fiverr", category: "freelance_marketplace", description: "Service marketplace and buyer opportunities.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.fiverr.com/" },
  { id: "freelancer", name: "Freelancer.com", category: "freelance_marketplace", description: "Contests, project listings, and contract briefs.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.freelancer.com/" },
  { id: "people_per_hour", name: "PeoplePerHour", category: "freelance_marketplace", description: "Freelance projects and service requests.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.peopleperhour.com/" },
  { id: "contra", name: "Contra", category: "freelance_marketplace", description: "Independent-work opportunities and professional profiles.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://contra.com/" },
  { id: "guru", name: "Guru", category: "freelance_marketplace", description: "Freelance jobs across service categories.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.guru.com/" },
  { id: "workana", name: "Workana", category: "freelance_marketplace", description: "Freelance projects, especially across Latin American markets.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.workana.com/" },
  { id: "toptal", name: "Toptal", category: "freelance_marketplace", description: "Vetted talent network for experienced specialists.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.toptal.com/" },
  { id: "99designs", name: "99designs", category: "freelance_marketplace", description: "Design projects and design contests.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://99designs.com/" },
  { id: "designhill", name: "Designhill", category: "freelance_marketplace", description: "Design briefs, contests, and creative work.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.designhill.com/" },
  { id: "truelancer", name: "Truelancer", category: "freelance_marketplace", description: "Freelance jobs and projects across disciplines.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.truelancer.com/" },

  // Professional and social networks
  { id: "linkedin", name: "LinkedIn", category: "professional_network", description: "Companies, decision-makers, posts, and professional relationships.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.linkedin.com/" },
  { id: "x_twitter", name: "X (Twitter)", category: "social_network", description: "Public requests, founder posts, launches, and service needs.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://x.com/" },
  { id: "facebook", name: "Facebook", category: "social_network", description: "Business pages, public groups, and community requests.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.facebook.com/" },
  { id: "instagram", name: "Instagram", category: "social_network", description: "Business profiles, creators, and public service requests.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.instagram.com/" },
  { id: "threads", name: "Threads", category: "social_network", description: "Public conversations where people discuss business needs.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.threads.net/" },
  { id: "youtube", name: "YouTube", category: "social_network", description: "Creators and businesses that may need production or growth services.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.youtube.com/" },
  { id: "tiktok", name: "TikTok", category: "social_network", description: "Brands and creators with public business or content needs.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.tiktok.com/" },

  // Search and public business discovery
  { id: "web_search", name: "Web search", category: "web_search", description: "Search public web pages for buying signals and service needs.", supportMode: "unsupported", operationalState: "not_verified", websiteUrl: "https://www.google.com/" },
  { id: "google_maps", name: "Google Maps", category: "business_directory", description: "Local businesses that may need websites, marketing, design, or operations help.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://maps.google.com/" },
  { id: "yelp", name: "Yelp", category: "business_directory", description: "Local business discovery and business profile research.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.yelp.com/" },
  { id: "yellow_pages", name: "Yellow Pages", category: "business_directory", description: "Business listings for targeted local prospecting.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.yellowpages.com/" },
  { id: "crunchbase", name: "Crunchbase", category: "business_directory", description: "Company research, funding signals, and growing businesses.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.crunchbase.com/" },
  { id: "clutch", name: "Clutch", category: "business_directory", description: "Agency and company profiles useful for partner or subcontracting leads.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://clutch.co/" },
  { id: "product_hunt", name: "Product Hunt", category: "startup_network", description: "Newly launched products and founders who may need specialist support.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.producthunt.com/" },

  // Job boards and remote work
  { id: "indeed", name: "Indeed", category: "job_board", description: "Contract, freelance, and project-related listings where available.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.indeed.com/" },
  { id: "wellfound", name: "Wellfound", category: "startup_network", description: "Startup hiring and early-stage company opportunities.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://wellfound.com/" },
  { id: "remoteok", name: "Remote OK", category: "job_board", description: "Remote roles and contract opportunities.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://remoteok.com/" },
  { id: "we_work_remotely", name: "We Work Remotely", category: "job_board", description: "Remote job listings, including roles adjacent to freelance services.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://weworkremotely.com/" },
  { id: "flexjobs", name: "FlexJobs", category: "job_board", description: "Remote and flexible work listings.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.flexjobs.com/" },
  { id: "problogger", name: "ProBlogger Jobs", category: "job_board", description: "Writing, blogging, and content-related opportunities.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://problogger.com/jobs/" },
  { id: "dynamite_jobs", name: "Dynamite Jobs", category: "job_board", description: "Remote-first company roles and opportunities.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://dynamitejobs.com/" },

  // Communities and public requests
  { id: "reddit", name: "Reddit", category: "community", description: "Public community posts and service requests, subject to each community's rules.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.reddit.com/" },
  { id: "hacker_news", name: "Hacker News", category: "community", description: "Founder discussions, startup launches, and hiring threads.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://news.ycombinator.com/" },
  { id: "indie_hackers", name: "Indie Hackers", category: "community", description: "Independent founders discussing products, growth, and business needs.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.indiehackers.com/" },
  { id: "discord", name: "Discord communities", category: "community", description: "Niche professional and founder communities; discovery depends on server rules and access.", supportMode: "manual", operationalState: "not_verified", websiteUrl: "https://discord.com/" },
  { id: "slack_communities", name: "Slack communities", category: "community", description: "Professional communities and referral conversations.", supportMode: "manual", operationalState: "not_verified", websiteUrl: "https://slack.com/" },
  { id: "facebook_groups", name: "Facebook Groups", category: "community", description: "Niche and local groups where businesses request help.", supportMode: "manual", operationalState: "not_verified", websiteUrl: "https://www.facebook.com/groups/" },
  { id: "whatsapp_business_networks", name: "WhatsApp business networks", category: "community", description: "User-managed professional groups and local business networks.", supportMode: "manual", operationalState: "not_verified", websiteUrl: "https://www.whatsapp.com/" },

  // Portfolios, creative and developer platforms
  { id: "behance", name: "Behance", category: "creative_network", description: "Creative briefs, portfolios, and potential client or partner discovery.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.behance.net/" },
  { id: "dribbble", name: "Dribbble", category: "creative_network", description: "Design opportunities, portfolios, and hiring signals.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://dribbble.com/" },
  { id: "github", name: "GitHub", category: "developer_platform", description: "Public issues, project discussions, sponsorship, and explicitly posted contract needs.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://github.com/" },
  { id: "dev_to", name: "DEV Community", category: "developer_platform", description: "Developer and startup discussions that may reveal service needs.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://dev.to/" },
  { id: "hashnode", name: "Hashnode", category: "developer_platform", description: "Developer and founder publishing community.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://hashnode.com/" },
  { id: "medium", name: "Medium", category: "portfolio_network", description: "Public company and creator publishing that can reveal relevant needs.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://medium.com/" },
  { id: "substack", name: "Substack", category: "portfolio_network", description: "Newsletters and independent publishers who may need specialist services.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://substack.com/" },

  // Referrals, local networks, events and procurement
  { id: "referrals", name: "Referral and past-client network", category: "referral_network", description: "Warm leads from past clients, colleagues, and professional contacts.", supportMode: "manual", operationalState: "not_verified", websiteUrl: "https://www.linkedin.com/" },
  { id: "agency_partners", name: "Agency and consultant partners", category: "referral_network", description: "Agencies and consultants who may need reliable subcontractors or delivery partners.", supportMode: "manual", operationalState: "not_verified", websiteUrl: "https://clutch.co/" },
  { id: "local_business_networks", name: "Local business networks", category: "local_business", description: "Chambers, business associations, and local company networks.", supportMode: "manual", operationalState: "not_verified", websiteUrl: "https://www.google.com/maps/" },
  { id: "meetup", name: "Meetup and professional events", category: "event_network", description: "Events and communities for relationship-led prospecting.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.meetup.com/" },
  { id: "eventbrite", name: "Eventbrite", category: "event_network", description: "Business events, workshops, and networking opportunities.", supportMode: "link_out", operationalState: "not_verified", websiteUrl: "https://www.eventbrite.com/" },
  { id: "government_tenders", name: "Government and public tenders", category: "procurement", description: "Public procurement notices and formal service opportunities; region-specific sources vary.", supportMode: "manual", operationalState: "not_verified", websiteUrl: "https://www.sam.gov/" },
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
 * Automated discovery is allowed only for a source with a real, tested,
 * server-side API adapter and verified operational state. The catalog alone
 * never enables automated searching.
 */
export function isEligibleForAutomatedDiscovery(
  source: SourceDefinition,
): boolean {
  return (
    source.supportMode === "api" &&
    source.operationalState === "available"
  );
}
