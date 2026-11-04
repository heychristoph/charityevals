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

describe("the value of a life", () => {
  it("was a multiplier on GiveWell's values; an old link's value is restated in healthy years at the default rate", () => {
    expect(upgrade({ life_value_multiplier: 1.2 })).toEqual({ daly_per_child_death: 1.2 * 116.25262 / 2 });
    expect(upgrade({ life_value_multiplier: 1.2, daly_per_child_death: 40 })).toEqual({ daly_per_child_death: 40 });
  });

  it("is worked out from the sliders, never set by a link", () => {
    expect(assumptionValues(assumptions as never, { life_value_multiplier: 3 }).life_value_multiplier).toBeUndefined();
  });
});
