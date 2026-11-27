// A charity's page leads with the figure and range its main evaluator has in the rankings: the page
// combines locations and programmes (src/lib/whole.ts) the way the engine does (src/engine/figures.ts).
import { describe, expect, it } from "vitest";
import { lib, primaryOf } from "./data";
import { assumptionValues } from "../engine/model";
import { charityFigure, modelFigure } from "../engine/figures";
import { charityOf, programsOf, wholeOf } from "./whole";

const close = (a: number, b: number) => Math.abs(a - b) <= 1e-6 * Math.max(1e-12, Math.abs(a), Math.abs(b));

describe("a charity's page", () => {
  it("shows its main evaluator's figure and range as the rankings make them", () => {
    const av = assumptionValues(lib.assumptions);
    const off: string[] = [];
    for (const c of lib.charities.values()) {
      const m = primaryOf(lib, c.id);
      const f = m && charityFigure(lib, c.id, av, (x) => modelFigure(lib, x, av), false);
      if (!m || !f) continue;
      const lead = f.evaluators.find((e) => e.owner === f.primary)!;
      const programs = programsOf(m);
      const page = programs ? charityOf(programs, av, {}) : wholeOf(m, av, {});
      if (!close(page.result, lead.central) || !close(page.low, lead.low) || !close(page.high, lead.high))
        off.push(`${c.id}: page ${page.result} (${page.low}–${page.high}), rankings ${lead.central} (${lead.low}–${lead.high})`);
    }
    expect(off).toEqual([]);
  });
});
