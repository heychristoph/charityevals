import { describe, expect, it } from "vitest";
import { formatValue } from "./format";

describe("formatValue", () => {
  it("keeps two significant figures for small numbers", () => {
    expect(formatValue(0.0003328815743)).toBe("0.00033");
    expect(formatValue(0.0487)).toBe("0.049");
  });

  it("writes powers of ten only for tiny numbers in the small format", () => {
    expect(formatValue(0.00012, "small")).toBe("1.2 × 10⁻⁴");
    expect(formatValue(0.19, "small")).toBe("0.19");
    expect(formatValue(1300, "small")).toBe("1,300");
    expect(formatValue(0, "small")).toBe("0");
  });

  it("rounds and groups large numbers", () => {
    expect(formatValue(48715)).toBe("49,000");
    expect(formatValue(116.253)).toBe("120");
    expect(formatValue(2_400_000)).toBe("2.4M");
  });
});
