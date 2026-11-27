// Every surface shows the same figures: the rankings and pages (use-results), the engine every other
// surface calls (src/engine/figures.ts), the MCP server, the data files and search snippets / llms.txt.
// One function makes each figure; this test fails if any surface grows its own copy again.
import { describe, expect, it } from "vitest";
import { lib, primaryOf, rankable } from "./data";
import { assumptionValues, comparable } from "../engine/model";
import { modelFigure, rankings } from "../engine/figures";
import { rankings as mcpRankings } from "../../worker/mcp/figures";
import { pageEvaluator, rankingsAt } from "./use-results";
import { figureOf } from "./open-data";
import { charityDefaultYears } from "./seo";

const close = (a: number, b: number) => (a === b || Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)));
const same = (a: { central: number; low: number; high: number }, b: { central: number; low: number; high: number }) =>
  close(a.central, b.central) && close(a.low, b.low) && close(a.high, b.high);

const values = {
  "the defaults": assumptionValues(lib.assumptions),
  "other values": assumptionValues(lib.assumptions, { discount_rate: 0.01, long_shot_value: 3, chicken_vs_person: 0.3, ignore_old_estimates: 0 }),
};

describe.each(Object.entries(values))("at %s", (_, av) => {
  const site = rankingsAt(av);
  const engine = rankings(lib, av, (m) => modelFigure(lib, m, av));
  const mcp = mcpRankings(lib, av);

  it("the rankings, the engine and the MCP server list the same charities in the same order with the same figures", () => {
    expect(site.results.map((r) => r.charity.id)).toEqual(engine.map((f) => f.charity.id));
    expect(mcp.map((f) => f.charity.id)).toEqual(engine.map((f) => f.charity.id));
    for (const [i, f] of engine.entries()) {
      expect(same(site.results[i], f), f.charity.id).toBe(true);
      expect(same(mcp[i], f), f.charity.id).toBe(true);
    }
  });

  it("a charity's page leads with the figure search snippets and llms.txt quote", () => {
    if (av !== values["the defaults"]) return;
    for (const f of engine) {
      // The page leads with its main model's evaluator, even where the rankings drop that one's estimate.
      const page = pageEvaluator(site.pages, f.charity.id, primaryOf(lib, f.charity.id)!.owner);
      expect(close(page!.central, charityDefaultYears(f.charity.id) ?? 0), f.charity.id).toBe(true);
    }
  });
});

describe("the data files", () => {
  it("give every model the range its page shows", () => {
    const av = values["the defaults"];
    for (const m of rankable.filter((x) => comparable(lib, x))) {
      const page = modelFigure(lib, m, av), file = figureOf(m);
      expect(same(page, { central: file.headline, low: file.low, high: file.high }), m.id).toBe(true);
    }
  });
});
