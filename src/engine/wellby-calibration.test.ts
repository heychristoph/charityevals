// The WELLBY exchange rate is calibrated on depression (owner, 2026-10-31; docs/normalization.md 2.3):
// at its default, one standard deviation of depression for a year counts the same through HLI's
// WELLBYs as through the GBD disability weights on the PHQ-9 that Founders Pledge's and SoGive's
// models go through. The default is a number (a slider), so this keeps it in step with the facts.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(join(root, p), "utf8"));
type Row = { id: string; value: number | { best: number }; fixed?: boolean; slider?: { low?: number; high?: number } };
const best = (v: Row["value"]) => (typeof v === "number" ? v : v.best);
const fact = (file: string, id: string) => best((read(`facts/${file}.json`).rows as Row[]).find((r) => r.id === id)!.value);
const assumption = (id: string) => (read("assumptions/default.json").rows as Row[]).find((r) => r.id === id)!;

describe("WELLBY calibration", () => {
  const sd = fact("depression", "phq9_sd");
  const perPoint = fact("depression", "dalys_per_phq9_point_year");
  const wellbysPerSd = fact("wellby_factors", "wellbys_per_sd_year");
  const uovPerDaly = best(assumption("uov_per_daly").value);
  const calibrated = (sd * perPoint * uovPerDaly) / wellbysPerSd;

  it("the slider's default makes a depression SD-year worth the same by WELLBYs and by GBD weights", () => {
    const u = assumption("uov_per_wellby");
    expect(best(u.value)).toBeCloseTo(calibrated, 6);
    // Healthy years per SD-year, both routes, at the defaults.
    expect((wellbysPerSd * best(u.value)) / uovPerDaly).toBeCloseTo(sd * perPoint, 6);
  });

  it("the anchor fact HLI models use for deaths equals the slider's default", () => {
    expect(fact("wellby_factors", "uov_per_wellby_anchor")).toBeCloseTo(best(assumption("uov_per_wellby").value), 9);
  });

  it("is a slider whose range covers HLI's own implied rate (0.55) and the GiveDirectly calibration (1.15)", () => {
    const u = assumption("uov_per_wellby");
    expect(u.fixed).toBeFalsy();
    expect(u.slider!.low!).toBeLessThan(calibrated);
    expect(u.slider!.high!).toBeGreaterThan(1.15);
  });
});
