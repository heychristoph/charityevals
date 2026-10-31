// The WELLBY exchange rate is calibrated on depression (owner, 2026-10-31; docs/normalization.md 2.3):
// at its default, one standard deviation of depression for a year counts the same through HLI's
// WELLBYs as through the GBD disability weights on the PHQ-9 that Founders Pledge's and SoGive's
// models go through. The default is a number (a slider), so this keeps it in step with the facts. The
// rate is in healthy years per WELLBY, so the two routes agree at any "Healthy year vs doubled-income
// year": neither moves with that slider.
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
  const calibrated = (sd * perPoint) / wellbysPerSd;
  const units = read("assumptions/default.json").units;

  it("the slider's default makes a depression SD-year worth the same by WELLBYs and by GBD weights", () => {
    const u = assumption("daly_per_wellby");
    expect(best(u.value)).toBeCloseTo(calibrated, 7);
    // Healthy years per SD-year, both routes, at the default.
    expect(wellbysPerSd * best(u.value)).toBeCloseTo(sd * perPoint, 7);
  });

  it("holds at any healthy-year rate: the WELLBY unit converts in healthy years (its units of value cancel)", () => {
    expect(units.wellby.to_common).toBe("$daly_per_wellby * $uov_per_daly");
    expect(units.daly.to_common).toBe("$uov_per_daly");
  });

  it("is a slider whose range covers HLI's own implied rate (0.275) and the GiveDirectly calibration (0.575)", () => {
    const u = assumption("daly_per_wellby");
    expect(u.fixed).toBeFalsy();
    expect(u.slider!.low!).toBeLessThan(calibrated);
    expect(u.slider!.high!).toBeGreaterThan(0.575);
  });
});
