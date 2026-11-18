"""Rule later-benefits-discount: benefits that come years later move with the discount rate (docs/normalization.md
2.7, INV-9c).

1. GiveWell's typed-in later benefits (development effects per SMC treatment-year, deworming's and malaria's
   ln(consumption) present values, development shares of the value of deaths or of all benefits) get an
   `*_at_shared_values` row: scripts/link-givewell-shared.py `later_benefits`, which future imports run too.
2. The Life You Can Save's dispenser model reads GiveWell's income-to-mortality ratio raw: it rescales it like the
   other readers (discount rate, income slider, weight on a life).
3. HLI's GiveDirectly figure is one published total: split into the recipient's WELLBYs and the household's
   (a side effect), spread over the years the effect lasts and discounted at $discount_rate, as HLI's AMF and
   ACTRA models are; the evaluator view pins the rate at 0 (HLI doesn't discount).

    python3 scripts/_later-benefits-discount.py
"""
import importlib.util, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE / "lib"))
from keep_json import dumps_like

spec = importlib.util.spec_from_file_location("lgs", HERE / "link-givewell-shared.py")
lgs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lgs)

# --- 1. GiveWell's later benefits ------------------------------------------------------------------------------
files = list(lgs.models())
texts = {p: p.read_text() for p, m, ind in files}
log = []
changed = lgs.later_benefits(files, log)
for p, m, ind in files:
    if m["id"] in changed:
        assert dumps_like(json.loads(texts[p]), texts[p], ind) == texts[p], p
        p.write_text(dumps_like(m, texts[p], ind))
print("\n".join(log))


def edit(path, fn):
    t = path.read_text()
    m = json.loads(t)
    assert dumps_like(m, t) == t, path
    fn(m)
    path.write_text(dumps_like(m, t))


# --- 2. The Life You Can Save's dispensers: the income ratio at your values --------------------------------------
def tlycs(m):
    r = next(x for x in m["rows"] if x["id"] == "income_share")
    if r["formula"] != "@givewell_shared.income_to_mortality_value_ratio": return
    r["formula"] = f"@givewell_shared.income_to_mortality_value_ratio * {lgs.disc('malaria')} * $uov_per_ln_consumption * @givewell_shared.ln_consumption_per_doubling / $life_value_multiplier"
    r["explainer"] = (r.get("explainer", "").rstrip() + "\n\n" if r.get("explainer") else "") + (
        "Changed for consistency: GiveWell's ratio is at its own values (income from 10 years on, discounted at 4%, valued at 1/ln 2, "
        "against its weight on a death). Like every other model that reads it, ours rescales it: the present value of those 40 years at "
        "your discount rate over the same at 4%, times the income slider over 1/ln 2, divided by the weight on a life. At the defaults "
        "it is GiveWell's ratio.")


edit(ROOT / "models/global-health/evidence-action-tlycs-dispensers-for-safe-water.json", tlycs)

# --- 3. HLI's GiveDirectly: recipient and household, spread over the years and discounted -------------------------
SUMMARY = "https://www.happierlivesinstitute.org/research/charity-evaluations/givedirectly-comprehensive-summary/"


def gd_hli(m):
    if any(r["id"] == "discount_factor" for r in m["rows"]): return
    m["evaluator"]["assumptions"]["discount_rate"] = 0
    secs = m["sections"]
    secs.insert(next(i for i, s in enumerate(secs) if s["id"] == "staff_pay"), {
        "id": "per_dollar", "title": "Recipient, household and discounting", "kind": "ours",
        "explainer": "charityevals' step, not HLI's. HLI's figure counts the recipient and the other members of the household together, and a year of better wellbeing the same whenever it comes. In our view the household's share is a side effect (the side-effects slider weighs it) and later years count less at the discount rate under Your values; the evaluator view counts both in full and sets the rate to 0, so HLI's figure is unchanged there."})
    rows = m["rows"]
    at = next(i for i, r in enumerate(rows) if r["id"] == "staff_cost_share")
    new = [
        {"id": "recipient_share_of_household", "section": "per_dollar", "label": "Recipient's share of the household's WELLBYs", "format": "percent",
         "value": 2.10 / 9.22, "kind": "estimate",
         "source": {"title": "HLI, GiveDirectly comprehensive summary (December 2024)", "url": SUMMARY,
                    "quote": "a total effect over time of 2.10 WELLBYs on the recipient ... 7.12 WELLBYs for the other household members combined ... 9.22 WELLBYs for the whole household",
                    "retrieved": "2026-11-18"},
         "explainer": "HLI's $1,000 transfer gives the recipient 2.10 WELLBYs and the four other household members 7.12 together (each 86% of the recipient's benefit), 9.22 in all: the recipient's share is 2.10 / 9.22 = 23%."},
        {"id": "wellbys_recipient_per_1000", "section": "per_dollar", "label": "WELLBYs per $1,000 for the recipients", "format": "number",
         "formula": "wellbys_per_1000 * recipient_share_of_household"},
        {"id": "wellbys_household_spillover_per_1000", "section": "per_dollar", "label": "WELLBYs per $1,000 for the other household members (spillover)", "format": "number",
         "formula": "wellbys_per_1000 * (1 - recipient_share_of_household)", "side_effect": "added",
         "explainer": "The other household members' benefit, a spillover beyond the person given the cash: a side effect, weighed by the side-effects slider (docs/normalization.md 2.16)."},
        {"id": "discount_rate_per_year", "section": "per_dollar", "label": "Discount rate on future wellbeing", "format": "percent", "formula": "$discount_rate",
         "explainer": "The shared discount rate (Your values). HLI doesn't discount, so the evaluator view pins it at 0."},
        {"id": "effect_duration_years", "section": "per_dollar", "label": "Years the benefits are spread over", "format": "number", "unit": "years",
         "value": {"low": 4, "best": 7, "high": 12}, "kind": "judgment",
         "explainer": "Our judgment from HLI's meta-analysis of cash transfers (McGuire, Kaiser and Bach-Mortensen, Nature Human Behaviour 2022): the effect on wellbeing fades linearly and is gone about seven years after the transfer; HLI's summary says only that the benefits dissipate linearly. Spread evenly over 7 years (4 to 12); an even spread discounts slightly more than a linear fade over the same years."},
        {"id": "discount_factor", "section": "per_dollar", "label": "Discount factor for benefits spread evenly over those years", "format": "number",
         "formula": "pv_annuity_due(1, discount_rate_per_year, effect_duration_years) / effect_duration_years",
         "explainer": "The present value of an equal benefit each year over the years above, starting with the transfer, as a share of the undiscounted total: 1 at a 0% rate."},
        {"id": "wellbys_per_1000_discounted", "section": "per_dollar", "label": "WELLBYs per $1,000, discounted", "format": "number",
         "formula": "(wellbys_recipient_per_1000 + wellbys_household_spillover_per_1000) * discount_factor"},
    ]
    for k, r in enumerate(new): rows.insert(at + k, r)
    top = next(r for r in rows if r["id"] == "wellbys_per_1000")
    top["explainer"] = top.get("explainer", "").replace("so this model has a single input.", "and its December 2024 summary gives the recipient and household shares our steps below use.")
    out = next(r for r in rows if r["id"] == "wellbys_per_dollar")
    assert out["formula"] == "(wellbys_per_1000 / 1000) * donor_cost_share", out["formula"]
    out["formula"] = "(wellbys_per_1000_discounted / 1000) * donor_cost_share"


edit(ROOT / "models/global-health/givedirectly-hli.json", gd_hli)
print("tlycs dispensers: income share at your values; givedirectly-hli: recipient / household split, discounted")
