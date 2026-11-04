"""Link Ambitious Impact's bulk models (models/grants/ambitious-impact/, from scripts/convert-sheet.py) to the
shared levers and give them our steps after AIM's bottom line, as docs/normalization.md asks.

    python3 scripts/link-aim.py            # applies scripts/aim-links.json to every model it names

Per model, scripts/aim-links.json says:
  native        the row holding AIM's bottom line and its unit, e.g. {"row": "usd_daly", "unit": "$ per DALY averted"}
  outcome       "usd_per_daly" | "dalys_per_1000" | "doublings_per_1000" | "usd_per_doubling": how the native row reads
  discount      row ids of AIM's discount rate: they read $discount_rate; AIM's rate is pinned in the evaluator view
  deaths        row ids that value a death (DALYs or income doublings per death averted): AIM's number stays as an
                input, and the row multiplies it by $life_value_multiplier (pinned to 1 for AIM)
  sector        staff-pay defaults (delivery, services, media, research), as scripts/link-resource-shares.py
  summary       the model's summary

The script is idempotent: it rebuilds our rows from the converter's output each time it runs on a fresh
conversion, and leaves a model alone that it has already linked.

After linking, the audit (audit-cea skill) led to hand edits that a re-conversion would undo, so re-convert a
model only to re-import it, then repeat them: AIM's income-to-DALY rates ("one year of doubled consumption to
DALYs", 1/2.3) read 1 / $uov_per_daly with AIM's rate pinned; AIM's "keep fixed in all CEAs" cost discount rates
stay AIM's numbers; where several benefit rates exist, the one carrying most of the benefit is linked; a linked
rate that AIM's annuity formulas divide by reads max($discount_rate, 0.000001); death values inside formulas
(ACTRA's cost of a homicide) read $life_value_multiplier; sheets that don't discount get our discounting step.
"""
import json, math, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from importlib import import_module

ROOT = Path(__file__).resolve().parent.parent
SECTORS = import_module("link-resource-shares").SECTORS
LN2 = math.log(2)

OUTCOME = {
    # native row -> (output unit, label, formula of the per-dollar figure before staff pay)
    "usd_per_daly": ("daly", "DALYs averted per dollar", "1 / {n}"),
    "dalys_per_1000": ("daly", "DALYs averted per dollar", "{n} / 1000"),
    "doublings_per_1000": ("uov", "Units of value per dollar", "{n} / 1000 * ln(2) * $uov_per_ln_consumption"),
    "usd_per_doubling": ("uov", "Units of value per dollar", "1 / {n} * ln(2) * $uov_per_ln_consumption"),
}
DOUBLING_NOTE = ("Ambitious Impact counts income in years of doubled consumption. A doubling for a year is ln 2 of "
                 "log-consumption, which is one GiveWell unit of value at the shared value of income, so the result "
                 "ranks with the GiveWell models.")


def link(m, cfg):
    rows = {r["id"]: r for r in m["rows"]}
    if "donor_cost_share" in rows:
        return False
    ev = m.setdefault("evaluator", {"name": "Ambitious Impact", "assumptions": {}})
    pins = ev.setdefault("assumptions", {})
    pins["resource_shares"] = 0

    rates = set()
    for rid in cfg.get("discount", []):
        r = rows[rid]
        rates.add(r["value"])
        val = r.pop("value"); r.pop("kind", None)
        r["formula"] = "$discount_rate"
        r["expected"] = val
        r["explainer"] = (f"Ambitious Impact discounts at {val:.4g} a year. Linked to the shared discount rate (Your values); "
                          "the evaluator view pins it to Ambitious Impact's rate.")
    if len(rates) > 1:
        sys.exit(f"{m['id']}: several discount rates {rates}")
    if rates:
        pins["discount_rate"] = rates.pop()

    for rid in cfg.get("deaths", []):
        r = rows[rid]
        base = {k: v for k, v in r.items() if k in ("value", "kind", "source", "unit", "format")}
        base.update(id=f"{rid}_aim", label=f"{r['label']} (Ambitious Impact's figure)", section=r["section"],
                    explainer=r.get("explainer", ""))
        val = r.pop("value"); r.pop("kind", None); r.pop("source", None)
        r["formula"] = f"{rid}_aim * $life_value_multiplier"
        r["expected"] = val
        r["explainer"] = ("Ambitious Impact's value of a death averted, scaled by how much Your values weigh a life "
                          "(1 in the evaluator view).")
        m["rows"].insert(m["rows"].index(r), base)
    if cfg.get("deaths"):
        # $life_value_multiplier is worked out from the life slider and the healthy-year rate: 1 at AIM's rate.
        pins.setdefault("uov_per_daly", 2.3)
        pins["daly_per_child_death"] = 116.25262 / pins["uov_per_daly"]

    native = cfg["native"]
    unit, label, formula = OUTCOME[cfg["outcome"]]
    # The converter's own bottom-line rows (dalys_per_dollar etc.) are replaced by ours.
    m["rows"] = [r for r in m["rows"] if r.get("section") != "bottom_line"]
    m["sections"] = [s for s in m["sections"] if s["id"] not in ("bottom_line", "staff_pay")]
    share, gap, why_share, why_gap = SECTORS[cfg.get("sector", "delivery")]
    out_id = {"daly": "dalys_per_dollar", "uov": "uov_per_dollar"}[unit]
    expl = "With credit by share of resources, times the share of the full cost paid in cash (staff's forgone pay is the rest)."
    if unit == "uov":
        expl = DOUBLING_NOTE + " " + expl
    m["sections"] += [
        {"id": "staff_pay", "title": "Staff pay below market", "kind": "ours",
         "explainer": "charityevals' step, not Ambitious Impact's: with credit by share of resources on, staff's forgone pay counts as part of the cost."},
        {"id": "bottom_line", "title": "Bottom line", "kind": "ours",
         "explainer": "charityevals' step, not Ambitious Impact's: its bottom line per dollar, in the site's units."},
    ]
    m["rows"] += [
        {"id": "staff_cost_share", "section": "staff_pay", "label": "Staff pay as a share of program cost", "format": "percent",
         "value": share, "kind": "judgment", "explainer": why_share},
        {"id": "salary_gap", "section": "staff_pay", "label": "Pay gap versus comparable jobs elsewhere", "format": "percent",
         "value": gap, "kind": "judgment", "explainer": why_gap},
        {"id": "salary_sacrifice", "section": "staff_pay", "label": "Salary forgone by staff per dollar of cost (in-kind donation)",
         "format": "number", "formula": "staff_cost_share * salary_gap / (1 - salary_gap)"},
        {"id": "donor_cost_share", "section": "staff_pay", "label": "Share of the full cost paid in cash", "format": "percent",
         "formula": "1 / (1 + if($resource_shares, salary_sacrifice, 0))",
         "explainer": "With credit by share of resources, staff's forgone pay counts as part of the cost, and staff get their share of the outcome. Off, this is 100%."},
        {"id": out_id, "section": "bottom_line", "label": label,
         "formula": f"({formula.format(n=native['row'])}) * donor_cost_share", "explainer": expl},
    ]
    m["output"] = {"row": out_id, "unit": unit, "label": label, "native": native}
    for k in ("name", "summary"):
        if cfg.get(k):
            m[k] = cfg[k]
    return True


def main():
    path = Path(sys.argv[sys.argv.index("--config") + 1]) if "--config" in sys.argv else ROOT / "scripts/aim-links.json"
    cfgs = json.loads(path.read_text())
    n = 0
    for mid, cfg in cfgs.items():
        p = ROOT / "models/grants/ambitious-impact" / f"{mid}.json"
        m = json.loads(p.read_text())
        if link(m, cfg):
            p.write_text(json.dumps(m, indent=1, ensure_ascii=False) + "\n")
            n += 1
    print(f"linked {n} models")


if __name__ == "__main__":
    main()
