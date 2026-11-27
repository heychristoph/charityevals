// The MCP server's files (/data/mcp-*.json, /data/mcp/<id>.json): every value set precomputed at the
// pages' figures, a get_model answer per id, and a library half the size that still rebuilds them.
import { describe, expect, it } from "vitest";
import { lib } from "./data";
import { figureOf } from "./open-data";
import { libraryFrom } from "../../worker/mcp/library";
import { LiveFigures } from "../../worker/mcp/catalogue";
import { GET as resultsGet } from "../pages/data/mcp-results.json";
import { GET as libraryGet } from "../pages/data/mcp-library.json";
import { GET as fullLibraryGet } from "../pages/data/library.json";
import { GET as answerGet, getStaticPaths } from "../pages/data/mcp/[id].json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const call = (get: any, params: Record<string, string> = {}) => (get({ params }) as Response).text();

describe("MCP files", () => {
  it("hold every figure at the defaults and under every value set, at the pages' figures", async () => {
    const results = JSON.parse(await call(resultsGet));
    expect(Object.keys(results.scenarios)).toEqual(["default", ...(lib.assumptions.presets ?? []).map((p) => p.id)]);
    for (const [id, f] of Object.entries(results.scenarios.default.models) as [string, (number | null)[]][]) {
      const page = figureOf(lib.models.get(id)!);
      if (Number.isFinite(page.headline)) expect(f[0]).toBeCloseTo(page.headline, 9);
    }
  });

  it("answer get_model for every model and charity, with text and licence", async () => {
    const ids = getStaticPaths().map((p) => p.params.id);
    expect(ids).toContain("givedirectly");
    expect(ids).toContain("against-malaria-foundation-chad");
    const answer = JSON.parse(await call(answerGet, { id: "givedirectly" }));
    expect(answer.summary).toBeTruthy();
    expect(answer.summary).not.toContain("{{");
    expect(answer.licence.name).toBeTruthy();
    // As the page shows it: its story, its questions with their explanations, its write-up and sources.
    expect(answer.story.sentence).toBeTruthy();
    expect(answer.depends_on.some((d: { explainer?: string }) => d.explainer)).toBe(true);
    expect(answer.writeup).not.toContain("{{");
    expect(answer.sources.length).toBeGreaterThan(0);
  });

  it("give a library half the size of library.json that computes the same figures", async () => {
    const slim = await call(libraryGet);
    expect(slim.length).toBeLessThan((await call(fullLibraryGet)).length / 1.8);
    const loaded = libraryFrom(JSON.parse(slim));
    expect(loaded.lib.errors).toEqual([]);
    const results = JSON.parse(await call(resultsGet));
    const live = new LiveFigures(loaded.lib, loaded.defaults);
    for (const id of results.scenarios.default.rankings.slice(0, 30)) expect(live.charity(id)!.central).toBeCloseTo(results.scenarios.default.charities[id].central, 9);
  });
});
