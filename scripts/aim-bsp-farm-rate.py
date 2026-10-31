"""Better Season Project (AIM 2026 idea report): split the discount rate (coordinator decision 2026-10-31).

AIM's farm-economics tab (per_month_farm_economics) discounts each household's month-by-month consumption, the
loan repayments netted against the tank's income gains, at its 4% "discount rate for income effects" / 12. That is
how the household itself trades consumption now against later while repaying a loan: evidence about the farmers,
like the loan's interest rate, not the site's time preference. It stays AIM's 4%, as its own input. Only the steps
that put the programme's benefits and costs over the years into present value read $discount_rate.

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
    n = 0
    for r in m["rows"]:
        if r.get("section") == "per_month_farm_economics" and r.get("formula") and re.search(r"\bdiscount_rate_for_income_effects\b", r["formula"]):
            r["formula"] = re.sub(r"\bdiscount_rate_for_income_effects\b", "farm_household_discount_rate", r["formula"])
            n += 1
    print("farm rows re-pointed:", n)
    src["explainer"] = ("Discounts the programme's benefits over the years (the effective rate for the reach of impacts) at the shared rate "
                        "(Your values); the evaluator view pins Ambitious Impact's 4%. The farm-economics tab keeps the households' own 4% "
                        "(farm_household_discount_rate).")
p.write_text(json.dumps(m, indent=1, ensure_ascii=False) + "\n")
