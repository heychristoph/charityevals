"""Owner decision 2026-10-31 (one consistent way): inside Ambitious Impact's DALY-equivalents, every conversion
we have a shared version of reads ours in our view, AIM's number kept in the evaluator view.

    python3 scripts/aim-shared-rates.py      # idempotent

- Income: AIM's "one year of doubled consumption to DALYs" (1/2.3 or 1/2.5) reads
  ln(2) * $uov_per_ln_consumption / $uov_per_daly, with AIM's rate pinned ($uov_per_daly) and the log-consumption
  value pinned to one unit per doubling, so the evaluator view reproduces AIM's rate.
- Deaths: AIM's DALYs per death averted read GiveWell's moral weights, the site's value of a death
  (@moral_weights.uov_per_death_under5 or _over5 * $life_value_multiplier / $uov_per_daly); AIM's figure is the
  row's `published` value, which the evaluator view uses. Stillbirths have no shared value and stay AIM's.
- Future benefits: every discount rate for benefits reads $discount_rate (AIM's in `published` where AIM uses a
  second rate beside the pinned one). AIM's "keep fixed in all CEAs" cost discount rates stay AIM's.
"""
import json, math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIR = ROOT / "models/grants/ambitious-impact"
LN2 = math.log(2)

INCOME = {
    "labri-aim": "one_year_of_doubled_consumption_to_dalys_fixed",
    "lead-research-for-action-aim": "one_year_of_doubled_consumption_to_dalys_fixed",
    "learning-alliance-aim": "givewell_moral_weight_doubled_years_of_income_equivalent_in",
    "novah-aim": "conversion_from_one_year_of_doubled_consumption_to_dalys",
    "respira-health-aim": "one_year_of_doubled_consumption_to_dalys_fixed",
}
# model -> {death row: age group}; AIM's rate pin for models that read $uov_per_daly only through deaths.
DEATHS = {
    "first-embrace-aim": {"set_at_2_times_median_salary_data_dalys_weighted_row_30": "under5"},
    "opal-health-aim": {
        "set_at_2_times_median_salary_data_dalys_weighted_row_28": "under5",
        "set_at_2_times_median_salary_data_dalys_weighted_row_29": "over5",
        "set_at_2_times_median_salary_data_dalys_weighted_row_30": "over5",
        "set_at_2_times_median_salary_data_dalys_weighted_row_31": "over5",
        "set_at_2_times_median_salary_data_dalys_weighted_row_32": "over5",
    },
    "oxygen-access-project-aim": {"one_5_life_saved_equivelent_dalys": "under5"},
    "novah-aim": {"dalys_weighted_row_7": "over5"},
    "respira-health-aim": {"years_of_life_gained_per_copd_death_averted": "over5"},
}
# AIM's income-to-DALY rate in the sheet's year (its standard inputs: GiveWell's 2.3 until 2024, 2.5 in 2025).
AIM_RATE = {"first-embrace-aim": 2.5, "opal-health-aim": 2.3, "oxygen-access-project-aim": 2.3}
# Second benefit discount rates: (row, AIM's value); a formula substitution for npv() over benefits.
DISCOUNT_INPUTS = {"labri-aim": [("discount_rate_for_health_impacts", 0.014)]}
DISCOUNT_FORMULAS = {"learning-alliance-aim": [("total_discounted_benefit_2", "npv(discount_rate,", "npv($discount_rate,")]}

AGE = {"under5": "a child under five", "over5": "a person aged five or older"}


def edit(mid, fn):
    p = DIR / f"{mid}.json"
    m = json.loads(p.read_text())
    if fn(m):
        p.write_text(json.dumps(m, indent=1, ensure_ascii=False) + "\n")


def income(m, rid):
    r = next(x for x in m["rows"] if x["id"] == rid)
    if "uov_per_ln_consumption" in r["formula"]:
        return False
    rate = m["evaluator"]["assumptions"]["uov_per_daly"]
    r["formula"] = "ln(2) * $uov_per_ln_consumption / $uov_per_daly"
    m["evaluator"]["assumptions"]["uov_per_ln_consumption"] = 1 / LN2
    r["explainer"] = (f"**Changed for consistency.** Ambitious Impact turns a year of doubled consumption into {1 / rate:.4g} DALYs "
                      f"(1/{rate:g}, its own exchange rate), kept in the evaluator view. Our view uses the site's shared values: a doubling "
                      "is ln 2 of log-consumption, valued at the shared value of income (Your values), and converted to healthy years at "
                      "the shared rate, so this model moves with both sliders like every income model.")
    return True


def deaths(m, rows):
    by = {x["id"]: x for x in m["rows"]}
    changed = False
    pins = m["evaluator"]["assumptions"]
    for rid, age in rows.items():
        r = by[rid]
        if "@moral_weights" in r.get("formula", ""):
            continue
        aim = by.get(f"{rid}_aim")
        val = aim["value"] if aim else r["value"]
        src = (aim or r).get("source")
        label = (aim or r)["label"].replace(" (Ambitious Impact's figure)", "")
        if aim:
            m["rows"].remove(aim)
        r.pop("value", None); r.pop("kind", None)
        r["label"] = label
        r["formula"] = f"@moral_weights.uov_per_death_{age} * $life_value_multiplier / $uov_per_daly"
        r["published"] = val
        r["expected"] = r.get("expected", val)
        if src:
            r["source"] = src
        r["explainer"] = (f"**Changed for consistency.** Ambitious Impact counts {val:g} DALYs for this death averted (its own figure, kept in "
                          f"the evaluator view). Our view values every death the site counts the same way: GiveWell's value of averting the "
                          f"death of {AGE[age]} (@moral_weights), scaled by how much Your values weigh a life, in healthy years at the shared "
                          "rate.")
        changed = True
    if changed:
        pins.setdefault("uov_per_daly", AIM_RATE.get(m["id"], 2.3))
        pins.setdefault("life_value_multiplier", 1)
    return changed


def discount_inputs(m, items):
    by = {x["id"]: x for x in m["rows"]}
    changed = False
    for rid, val in items:
        r = by[rid]
        if r.get("formula") == "$discount_rate":
            continue
        r.pop("value"); r.pop("kind", None)
        r["formula"] = "$discount_rate"
        r["published"] = val
        r["explainer"] = (f"**Changed for consistency.** Ambitious Impact discounts health benefits at {val:g} a year and income at "
                          f"{m['evaluator']['assumptions']['discount_rate']:g}; the evaluator view keeps both. Our view discounts every future "
                          "benefit at the shared rate (Your values).")
        changed = True
    return changed


def discount_formulas(m, items):
    by = {x["id"]: x for x in m["rows"]}
    changed = False
    for rid, old, new in items:
        r = by[rid]
        if old in r["formula"]:
            r["formula"] = r["formula"].replace(old, new)
            r["explainer"] = ("Benefits discounted at the shared rate (Your values); the evaluator view pins it to Ambitious Impact's "
                              f"{m['evaluator']['assumptions']['discount_rate']:g}. Costs keep Ambitious Impact's fixed rate.")
            changed = True
    return changed


def main():
    for mid, rid in INCOME.items():
        edit(mid, lambda m: income(m, rid))
    for mid, rows in DEATHS.items():
        edit(mid, lambda m: deaths(m, rows))
    for mid, items in DISCOUNT_INPUTS.items():
        edit(mid, lambda m: discount_inputs(m, items))
    for mid, items in DISCOUNT_FORMULAS.items():
        edit(mid, lambda m: discount_formulas(m, items))


if __name__ == "__main__":
    main()
