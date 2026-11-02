"""Second pass of scripts/aim-shared-rates.py, after INV-2c (one consistent way, 2026-10-31):

- Deaths read GiveWell's moral weight for the age of the death (facts/moral_weights.json: under five, 5-14,
  15-49, 50-74; GiveWell's 2020 curve), not one adult value for every age.
- AIM's "keep fixed in all CEAs" 4% cost discount rates, and Learning Alliance's 4% rate and its 3% income-growth
  offset, read $discount_rate in our view; AIM's numbers stay in `published`.
- The converter named AIM's timeline-year index (column C of the template, year 1) after the row it sat beside
  ("counsumption doublings per person"); it is a year count, not a conversion, so it gets its own name.

    python3 scripts/aim-shared-rates-2.py     # idempotent
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIR = ROOT / "models/grants/ambitious-impact"

BAND = {
    "under5": ("uov_per_death_under5", "a child under five"),
    "5_14": ("uov_per_death_age_5_14", "a person aged 5 to 14"),
    "15_49": ("uov_per_death_age_15_49", "a person aged 15 to 49"),
    "50_74": ("uov_per_death_age_50_74", "a person aged 50 to 74"),
}
# model -> {row: (band, why that age)}
DEATHS = {
    "first-embrace-aim": {"set_at_2_times_median_salary_data_dalys_weighted_row_30": ("under5", "a newborn (age 0)")},
    "opal-health-aim": {
        "set_at_2_times_median_salary_data_dalys_weighted_row_28": ("under5", "age 0 in AIM's standard inputs"),
        "set_at_2_times_median_salary_data_dalys_weighted_row_29": ("5_14", "age 5 in AIM's standard inputs"),
        "set_at_2_times_median_salary_data_dalys_weighted_row_30": ("15_49", "age 15 in AIM's standard inputs"),
        "set_at_2_times_median_salary_data_dalys_weighted_row_31": ("15_49", "age 30 in AIM's standard inputs"),
        "set_at_2_times_median_salary_data_dalys_weighted_row_32": ("15_49", "age 45 in AIM's standard inputs"),
    },
    "oxygen-access-project-aim": {"one_5_life_saved_equivelent_dalys": ("under5", "a child under five with pneumonia")},
    "novah-aim": {"dalys_weighted_row_7": ("15_49", "age 30 in AIM's standard inputs (women in partner violence, by suicide or other causes)")},
    "respira-health-aim": {"years_of_life_gained_per_copd_death_averted": ("50_74", "people hospitalised with COPD, whom AIM's sheet gives 6.1 years of life left; GiveWell publishes no older band")},
}
COST_RATES = {
    # better-season-project-aim keeps AIM's 4% for costs: scripts/aim-bsp-farm-rate.py and the INV-2c waiver say why.
    "first-embrace-aim": ["discount_rate_for_fixed_costs_keep_fixed_in_all_ceas"],
    "labri-aim": ["discount_rate_for_fixed_costs_keep_fixed_in_all_ceas"],
    "lead-research-for-action-aim": ["discount_rate_for_fixed_costs_keep_fixed_in_all_ceas"],
    "neev-aim": ["discount_rate_for_fixed_costs_keep_fixed_in_all_ceas"],
    "opal-health-aim": ["discount_rate_for_costs_keep_fixed_in_all_ceas_never"],
    "oxygen-access-project-aim": ["discount_rate_for_costs"],
    "respira-health-aim": ["discount_rate_for_costs_keep_fixed_in_all_ceas"],
    "learning-alliance-aim": ["discount_rate"],
}
YEAR_ROWS = {
    "better-season-project-aim": "counsumption_doublings_per_person_consumption_doublings_row",
    "first-embrace-aim": "counsumption_doublings_per_person_daly_row_243",
    "labri-aim": "counsumption_doublings_per_person_daly_equivelents_row_241",
    "lead-research-for-action-aim": "counsumption_doublings_per_person_daly_equivelents_row_207",
    "neev-aim": "counsumption_doublings_per_person_daly_row_275",
}


def run(mid, m):
    rows = {r["id"]: r for r in m["rows"]}
    for rid, (band, why) in DEATHS.get(mid, {}).items():
        r = rows[rid]
        fact, who = BAND[band]
        r["formula"] = f"@moral_weights.{fact} * $life_value_multiplier / $uov_per_daly"
        r["explainer"] = (f"**Changed for consistency.** Ambitious Impact counts {r['published']:g} DALYs for this death averted (its own figure, "
                          f"kept in the evaluator view). Our view values every death the site counts the same way: GiveWell's value of averting "
                          f"the death of {who} (@moral_weights, GiveWell's moral weights by age; this death is {why}), scaled by how much Your "
                          "values weigh a life, in healthy years at the shared rate.")
    for rid in COST_RATES.get(mid, []):
        r = rows[rid]
        if "value" in r:
            val = r.pop("value"); r.pop("kind", None)
            r["published"] = val
        # AIM's annuity formulas divide by the rate, so it never reaches 0 (as scripts/link-aim.py does).
        r["formula"] = "max($discount_rate, 0.000001)"
        r["explainer"] = (f"**Changed for consistency.** Ambitious Impact discounts {'costs' if 'cost' in rid else 'costs and benefits'} at a fixed "
                          f"{r['published']:g} a year in every CEA (kept in the evaluator view). Our view discounts everything in the future at the "
                          "shared rate (Your values).")
    if mid == "learning-alliance-aim" and "income_growth_offset" in rows:
        g = rows.pop("income_growth_offset")
        m["rows"].remove(g)
        r = rows["discount_rate_assuming_income_increase_tracks_growth"]
        r["formula"] = "$discount_rate"
        r["published"] = 0.01
        r["explainer"] = ("**Changed for consistency.** Ambitious Impact discounts the income gain at 1% a year: its 4% less 3% because it "
                          "assumes the gain grows with the economy (kept in the evaluator view). Our view discounts every future benefit at the "
                          "shared rate and, as for every other model, doesn't grow a benefit with the economy.")
    old = YEAR_ROWS.get(mid)
    if old and old in rows:
        new = "timeline_year_1"
        assert new not in rows
        for x in m["rows"]:
            if x["id"] == old:
                x["id"] = new
                x["label"] = "Timeline year (column C): year 1 of the cost and impact schedule"
                x["explainer"] = ("The year index of AIM's template (column C), here year 1. The converter named it after the row beside it "
                                  "(\"counsumption doublings per person\"); it is a count of years, not a conversion.")
            if x.get("formula"):
                x["formula"] = re.sub(rf"\b{old}\b", new, x["formula"])
    return True


def main():
    for p in sorted(DIR.glob("*.json")):
        m = json.loads(p.read_text())
        mid = m["id"]
        if mid in DEATHS or mid in COST_RATES or mid in YEAR_ROWS:
            run(mid, m)
            p.write_text(json.dumps(m, indent=1, ensure_ascii=False) + "\n")
    p = DIR / "cearch-aim.json"
    m = json.loads(p.read_text())
    for r in m["rows"]:
        if r["id"] == "cash_benchmark" and "value" in r:
            r.pop("value"); r.pop("kind", None)
            r["formula"] = "@cash.uov_per_dollar"
            r["explainer"] = ("GiveWell's benchmark, the value of a dollar given as cash (0.00335 units of value per dollar), read from the shared "
                              "fact every \"multiple of cash\" uses.")
    p.write_text(json.dumps(m, indent=1, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
