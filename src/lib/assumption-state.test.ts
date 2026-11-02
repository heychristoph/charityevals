import { describe, expect, it } from "vitest";
import { upgrade } from "./assumption-state";
import { assumptionValues } from "../engine/model";
import assumptions from "../../assumptions/default.json";

describe("old assumption links", () => {
  it("drop overrides for rates that are now fixed", () => {
    expect(upgrade({ climate_heat_share: 0.5, discount_rate: 0.02 })).toEqual({ discount_rate: 0.02 });
  });

  it("never apply an override to a fixed rate", () => {
    const av = assumptionValues(assumptions as never, { climate_heat_share: 0.5 });
    expect(av.climate_heat_share).toBe(0.2279);
  });
});

describe("the WELLBY rate", () => {
  it("is a slider, so an old link's value applies, restated in healthy years per WELLBY", () => {
    expect(upgrade({ uov_per_wellby: 0.55 })).toEqual({ daly_per_wellby: 0.275 });
    expect(upgrade({ daly_per_wellby: 0.1 })).toEqual({ daly_per_wellby: 0.1 });
  });
});
