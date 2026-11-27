// A link from a model to charityevals.org must reach a page that exists: our own models name their
// page as their source, and which model is a charity's main one (at /<charity>) can change.
import { describe, expect, it } from "vitest";
import { lib, modelUrl, rankable } from "./data";

const SITE = "https://charityevals.org";

describe("links to charityevals.org in models", () => {
  it("a model's own source is its page", () => {
    const wrong = rankable
      .filter((m) => m.source?.url.startsWith(SITE))
      .filter((m) => m.source!.url !== `${SITE}${modelUrl(lib, m)}`)
      .map((m) => `${m.id}: ${m.source!.url} (page: ${SITE}${modelUrl(lib, m)})`);
    expect(wrong).toEqual([]);
  });
});
