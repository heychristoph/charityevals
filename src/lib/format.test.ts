import { describe, expect, it } from "vitest";
import { formatValue } from "./format";

describe("formatValue", () => {
  it("keeps two significant figures for small numbers", () => {
    expect(formatValue(0.0003328815743)).toBe("0.00033");
    expect(formatValue(0.0487)).toBe("0.049");
  });

  it("rounds and groups large numbers", () => {
    expect(formatValue(48715)).toBe("49,000");
    expect(formatValue(116.253)).toBe("120");
    expect(formatValue(2_400_000)).toBe("2.4M");
  });
});
