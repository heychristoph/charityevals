"""Better Season Project (AIM 2026 idea report): discounting in our view (coordinator decisions 2026-10-31).

1. The farmers' rate. AIM's farm-economics tab (per_month_farm_economics) discounts each household's month-by-month
   consumption, loan repayments netted against the tank's income gains, at its 4% "discount rate for income
   effects" / 12. That is how the household trades consumption now against later while repaying a loan: evidence
   about the farmers, like the loan's interest rate, not the site's time preference. It stays AIM's 4%, as its own
   input (farm_household_discount_rate, INV-2c waiver). The programme's benefits over the years read $discount_rate.
2. The costs. AIM's cost rate (4%, "keep fixed in all CEAs") reads $discount_rate like every other rate. AIM's last
   year counts ongoing costs forever at that rate alone (cost / rate), while the impacts' perpetuity fades with the
   chance the change happens anyway (5% a year) and grows with the population. At 0% the costs would be infinite and
   the benefits finite. In our view the costs run over the impacts' horizon: fixed costs stop when the change would
   have happened anyway (rate + that chance), costs per household reached follow the reach exactly as the impacts do
   (the impacts' effective rate), in every year as in the last. AIM's figures stay as the rows' `published` values.

    python3 scripts/aim-bsp-farm-rate.py     # idempotent
"""
import json, re
from pathlib import Path

p = Path(__file__).resolve().parent.parent / "models/grants/ambitious-impact/better-season-project-aim.json"
m = json.loads(p.read_text())
rows = {r["id"]: r for r in m["rows"]}

if "farm_household_discount_rate" not in rows:
    src = rows["discount_rate_for_income_effects"]
    new = {
        "id": "farm_household_discount_rate",
        "label": "Households' own discount rate on monthly consumption (farm economics)",
        "section": "per_month_farm_economics",
        "format": "percent",
        "value": 0.04,
        "kind": "estimate",
        "source": src.get("source", {"title": "Ambitious Impact, Better Season Project CEA"}),
        "explainer": ("Ambitious Impact's 4% a year, as it uses it on the farm-economics tab: each household's monthly consumption, loan "
                      "repayments netted against the tank's income gains over 30 years, is discounted at this rate / 12. It stands for "
                      "how the household weighs consumption now against later while it repays a loan, a fact about the farmers like the "
                      "loan's interest rate, so it isn't the site's discount rate and doesn't move with it. The programme's benefits and "
                      "costs over the years are discounted at the shared rate (Your values)."),
    }
    m["rows"].insert(m["rows"].index(src) + 1, new)
    for r in m["rows"]:
        if r.get("section") == "per_month_farm_economics" and r.get("formula") and re.search(r"\bdiscount_rate_for_income_effects\b", r["formula"]):
            r["formula"] = re.sub(r"\bdiscount_rate_for_income_effects\b", "farm_household_discount_rate", r["formula"])
    src["explainer"] = ("Discounts the programme's benefits over the years (the effective rate for the reach of impacts) at the shared rate "
                        "(Your values); the evaluator view pins Ambitious Impact's 4%. The farm-economics tab keeps the households' own 4% "
                        "(farm_household_discount_rate).")

cost = rows["discount_rate_for_fixed_costs_keep_fixed_in_all_ceas"]
cost.pop("value", None); cost.pop("kind", None)
cost["formula"] = "max($discount_rate, 0.000001)"
cost["published"] = 0.04
cost["explainer"] = ("**Changed for consistency.** Ambitious Impact discounts costs at a fixed 4% a year in every CEA (kept in the "
                     "evaluator view). Our view discounts costs at the shared rate (Your values), floored just above 0 because AIM's "
                     "formulas divide by it.")

term = rows["total_costs_if_successful_discounted_29"]
if "published" not in term:
    term["published"] = term["expected"]
    year = re.search(r"\^ \((cell_[a-z0-9_]+) - 1\)", term["formula"]).group(1)
    term["formula"] = (f"total_fixed_costs_29 / (discount_rate_for_fixed_costs_keep_fixed_in_all_ceas + probability_change_happens_anyway_per_year_suggest_0_for_dir) "
                       f"* (1 - discount_rate_for_fixed_costs_keep_fixed_in_all_ceas) ^ ({year} - 1) "
                       f"+ total_variable_costs_29 / effective_discount_rate_for_reach_of_impacts_over_time "
                       f"* (1 - effective_discount_rate_for_reach_of_costs_over_time) ^ ({year} - 1)")
    term["explainer"] = ("**Changed for consistency.** Ambitious Impact's last year counts the ongoing costs forever, divided by the cost "
                         "rate alone, while the impacts' perpetuity in the same year fades with the chance the change happens anyway (5% a "
                         "year) and grows with the population. With the shared discount rate that would make costs infinite at 0% and "
                         "benefits finite. Our view runs the costs over the impacts' horizon: fixed costs stop when the change would have "
                         "happened anyway (rate + 5%), costs per household reached follow the reach as the impacts do (the impacts' effective "
                         "rate). Ambitious Impact's figure is kept in the evaluator view.")
reach = rows["effective_discount_rate_for_reach_of_costs_over_time"]
if "published" not in reach:
    reach["published"] = reach["expected"]
    reach["formula"] = ("discount_rate_for_fixed_costs_keep_fixed_in_all_ceas + probability_change_happens_anyway_per_year_suggest_0_for_dir "
                        "- impacted_population_growth_rate_if_relevant_e_g_5_if_interve")
    reach["explainer"] = ("**Changed for consistency.** Ambitious Impact discounts the costs of reaching households at its fixed cost rate "
                          "(4%), while the impacts of reaching them fade with the chance the change happens anyway (5% a year) and grow with "
                          "the population (2%). Our view gives the costs the impacts' horizon: the charity stops paying when the change would "
                          "have happened anyway, and pays for more households as the population grows, discounted at the shared rate. "
                          "Ambitious Impact's 4% is kept in the evaluator view.")
p.write_text(json.dumps(m, indent=1, ensure_ascii=False) + "\n")
