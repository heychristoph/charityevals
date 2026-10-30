import { describe, expect, it } from "vitest";
import { upgrade } from "./assumption-state";
import { assumptionValues } from "../engine/model";
import assumptions from "../../assumptions/default.json";

describe("old assumption links", () => {
  it("drop overrides for rates that are now fixed", () => {
    expect(upgrade({ uov_per_wellby: 3, discount_rate: 0.02 })).toEqual({ discount_rate: 0.02 });
  });

  it("never apply an override to a fixed rate", () => {
    const av = assumptionValues(assumptions as never, { uov_per_wellby: 3 });
    expect(av.uov_per_wellby).toBe(1.15);
  });
});
