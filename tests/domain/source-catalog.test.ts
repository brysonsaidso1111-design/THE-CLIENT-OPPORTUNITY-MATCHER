import { describe, expect, it } from "vitest";
import {
  SOURCE_CATALOG,
  getSourceById,
  isEligibleForAutomatedDiscovery,
  isSourceId,
  normalizeSelectedSourceIds,
} from "../../src/domain/source-catalog";

describe("source catalog", () => {
  it("uses unique stable IDs and valid website URLs", () => {
    const ids = SOURCE_CATALOG.map((source) => source.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const source of SOURCE_CATALOG) {
      expect(source.id).toMatch(/^[a-z][a-z0-9_]*$/);
      expect(() => new URL(source.websiteUrl)).not.toThrow();
      expect(source.name.trim().length).toBeGreaterThan(0);
    }
  });

  it("covers a broad, extensible set of freelancer discovery sources", () => {
    expect(SOURCE_CATALOG.length).toBeGreaterThanOrEqual(50);
    expect(SOURCE_CATALOG.map((source) => source.id)).toEqual(
      expect.arrayContaining([
        "upwork",
        "fiverr",
        "linkedin",
        "web_search",
        "freelancer",
        "people_per_hour",
        "clutch",
        "facebook_groups",
        "eventbrite",
        "reddit",
        "github",
        "behance",
        "google_maps",
        "government_tenders",
        "referrals",
      ]),
    );
  });

  it("recognizes catalog IDs and safely handles unknown IDs", () => {
    expect(isSourceId("upwork")).toBe(true);
    expect(isSourceId("not-a-source")).toBe(false);
    expect(getSourceById("fiverr")?.name).toBe("Fiverr");
    expect(getSourceById("missing")).toBeUndefined();
  });

  it("deduplicates selected IDs and returns unknown IDs separately", () => {
    expect(
      normalizeSelectedSourceIds(["upwork", "upwork", "fiverr", "unknown"]),
    ).toEqual({
      validIds: ["upwork", "fiverr"],
      unknownIds: ["unknown"],
    });
  });

  it("does not treat manual, link-out, or unverified sources as automated adapters", () => {
    for (const source of SOURCE_CATALOG) {
      expect(isEligibleForAutomatedDiscovery(source)).toBe(false);
    }
  });
});
