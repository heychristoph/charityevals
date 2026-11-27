import { describe, expect, it } from "vitest";
import assumptions from "../../assumptions/default.json";
import { Assumptions } from "../../src/engine/schema";
import { parseValues } from "./values";

const a = Assumptions.parse(assumptions);

describe("values in a tool call", () => {
  it("takes a switch as on or off, never in between", () => {
    expect(parseValues(a, { resource_shares: 1 }).applied).toEqual({ resource_shares: 1 });
    expect(() => parseValues(a, { resource_shares: 0.5 })).toThrow("1 or 0");
  });
});
