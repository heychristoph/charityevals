import { describe, expect, it } from "vitest";
import { formatValue, plainModelName, possessive } from "./format";

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

describe("plainModelName", () => {
  it("drops a spreadsheet copy's leftovers and reads a leading note after the name", () => {
    expect(plainModelName("[Borno crowding out assumptions copy] GiveWell's CEA of seasonal malaria chemoprevention (SMC)")).toBe("GiveWell's cost-effectiveness analysis of seasonal malaria chemoprevention (SMC) [Borno crowding out assumptions]");
    expect(plainModelName("[Copy for 2024 Chad renewal grant] GiveWell, CEA of vitamin A supplementation, 2024 v1")).toBe("GiveWell, cost-effectiveness analysis of vitamin A supplementation, 2024 [2024 Chad renewal grant]");
    expect(plainModelName("Borno SMC Copy of 2021 GiveWell cost-effectiveness analysis")).toBe("Borno SMC 2021 GiveWell cost-effectiveness analysis");
    expect(plainModelName("CHAI, mSupply BOTEC and VOI, 2025 (GiveWell copy)")).toBe("CHAI, mSupply rough estimate and VOI, 2025");
  });
});

describe("possessive", () => {
  it("adds only an apostrophe after an s", () => {
    expect([possessive("GiveWell"), possessive("charityevals"), possessive("Animal Charity Evaluators")]).toEqual(["GiveWell's", "charityevals'", "Animal Charity Evaluators'"]);
  });
});
