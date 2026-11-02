"""Currency rates the evaluators type into their sheets read facts/fx.json in our view.

    python3 scripts/link-fx.py        # idempotent

One source per currency (docs/normalization.md 2.7): the IRS yearly average where the IRS table lists the
currency, else the World Bank's World Development Indicators, official exchange rate (local currency per US$,
period average, PA.NUS.FCRF). The IRS lists pounds, euros, kroner and rupees but not the naira, the East African
currencies or the leone, which the World Bank does.

Each typed-in rate becomes a formula on the year's average, `@fx.usd_per_<cur>_<year>` (or its reciprocal where
the sheet states local currency per dollar). The year is the one the evaluator's rate is for: the date the sheet
gives for it, else the year its prices are from. Where the evaluator used a rate for a particular day (a grant
date, "Google, 5/12/2024") our view still uses that year's average; the evaluator's figure stays in `published`,
so the evaluator view reproduces the sheet. A rate equal to the average (to 1e-6) keeps it as `expected`.
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FX_FILE = ROOT / "facts/fx.json"
RETRIEVED = "2026-11-02"
WDI_TITLE = "World Bank, World Development Indicators: Official exchange rate (LCU per US$, period average), PA.NUS.FCRF"
IRS_TITLE = "US Internal Revenue Service, Yearly average currency exchange rates"
IRS_ARCHIVE = "https://web.archive.org/web/20210111132442/https://www.irs.gov/individuals/international-taxpayers/yearly-average-currency-exchange-rates"

# (currency, name, plural, ISO3 country, World Bank country) -> {year: local currency per US$} as WDI gives it
# (API, last updated 2026-10-08).
WDI = {
    ("ngn", "Nigerian naira", "naira", "NGA", "Nigeria"): {2018: 306.083688245234, 2019: 306.920951495222, 2024: 1478.96519740023},
    ("kes", "Kenyan shilling", "Kenyan shillings", "KEN", "Kenya"): {2017: 103.410004519013, 2020: 106.450780158517, 2024: 134.822483279332},
    ("ugx", "Ugandan shilling", "Ugandan shillings", "UGA", "Uganda"): {2017: 3611.2244580446, 2021: 3587.05170733908},
    ("rwf", "Rwandan franc", "Rwandan francs", "RWA", "Rwanda"): {2017: 831.55433975},
    ("mwk", "Malawian kwacha", "kwacha", "MWI", "Malawi"): {2017: 730.2725},
    ("mzn", "Mozambican metical", "meticais", "MOZ", "Mozambique"): {2017: 63.584322913399},
    ("sle", "Sierra Leonean leone (new, SLE)", "new leones", "SLE", "Sierra Leone"): {2023: 21.3048751103817},
}
# The IRS table: rupees per dollar (archived copy of 11 January 2021, columns 2015 to 2020).
IRS = {("inr", "Indian rupee", "rupees", "India (Rupee)"): {2015: 66.768}}


def sig(x, n=12):
    return float(f"{x:.{n}g}")


def fact_rows():
    rows = []
    for (cur, name, plural, iso, country), years in WDI.items():
        for y, lcu in years.items():
            rows.append({
                "id": f"usd_per_{cur}_{y}", "label": f"US dollars per {name}, {y} yearly average", "unit": f"USD / {cur.upper()}",
                "format": "number", "value": sig(1 / lcu), "kind": "observed",
                "source": {"title": WDI_TITLE, "url": f"https://api.worldbank.org/v2/country/{iso}/indicator/PA.NUS.FCRF?format=json",
                           "note": f"{country}, {y}: {lcu:,.4f} {plural} per dollar; 1 / {lcu:.4f} = {sig(1 / lcu, 6):g} dollars per {name.split(' (')[0].split()[-1]} (WDI last updated 2026-10-08).",
                           "retrieved": RETRIEVED},
                "explainer": f"The World Bank's yearly average for {y}. The IRS table, the site's source for the currencies it lists, has no rate for the {name.split(' (')[0]}, so the site uses the World Bank's official rate (period average) for it. Models that state costs or transfers in {plural} for that year convert them to dollars at this average, whatever day's rate the evaluator used.",
            })
    for (cur, name, plural, row), years in IRS.items():
        for y, lcu in years.items():
            rows.append({
                "id": f"usd_per_{cur}_{y}", "label": f"US dollars per {name}, {y} yearly average", "unit": f"USD / {cur.upper()}",
                "format": "number", "value": sig(1 / lcu), "kind": "observed",
                "source": {"title": IRS_TITLE, "url": IRS_ARCHIVE,
                           "note": f"Table row {row}, column {y}: {lcu} {plural} per dollar; 1 / {lcu} = {sig(1 / lcu, 6):g} dollars per rupee (archived copy of 11 January 2021).",
                           "retrieved": RETRIEVED},
                "explainer": f"The IRS's yearly average for {y}, the site's source for every currency the IRS lists. Models that state an amount in {plural} for that year convert it to dollars at this average.",
            })
    return rows


# model -> [(row, formula, why)]. `why` names the evaluator's rate and the year chosen.
NAIRA_2024 = "GiveWell's sheet uses ₦1,165 per dollar, the Central Bank of Nigeria's rate on 25 April 2024"
NAIRA_JUNE_2019 = "GiveWell's sheet uses ₦362.3 per dollar (1 / 0.00276), a market rate from Google in June 2019"
NAIRA_300 = "GiveWell's sheet uses ₦300 per dollar, a round figure for the year"
LINKS = {
    **{m: [("nigerian_naira_per_u_s_dollar_2", "1 / @fx.usd_per_ngn_2024", NAIRA_2024 + "; our view uses the 2024 average.")]
       for m in ("new-incentives-conditional-cash-transfers-to-increase-2023-11", "new-incentives-conditional-cash-transfers-to-increase-2024-10",
                 "new-incentives-march-2025-renewal-conditional-cash", "new-incentives-niger-yobe-expansion-conditional-cash",
                 "international-rescue-committee-global-vaccines-based-on-new-incentives")},
    "new-incentives-conditional-cash-transfers-to-increase": [("nigerian_naira_per_u_s_dollar_2", "1 / @fx.usd_per_ngn_2019", NAIRA_JUNE_2019 + "; our view uses the 2019 average.")],
    "new-incentives-june-2023": [(f"exchange_rate_naira_per_usd{s}", "1 / @fx.usd_per_ngn_2019", NAIRA_JUNE_2019 + "; our view uses the 2019 average.") for s in ("", "_2", "_3")],
    "new-incentives-june-2019": [("exchange_rate_naira_per_usd", "1 / @fx.usd_per_ngn_2019", NAIRA_300 + " (2019, the sheet's year); our view uses the 2019 average.")],
    "new-incentives-june-2019-endline-updated-ni-early-2018": [(f"exchange_rate_naira_per_usd{s}", "1 / @fx.usd_per_ngn_2019", NAIRA_300 + " (2019, the sheet's year); our view uses the 2019 average.")
                                                               for s in ("", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9")],
    "new-incentives-ni-early-2018-with-baseline-rates": [(f"exchange_rate_naira_per_usd{s}", "1 / @fx.usd_per_ngn_2018", NAIRA_300 + " (2018, the sheet's year); our view uses the 2018 average.")
                                                         for s in ("", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9")],
    **{m: [("exchange_rate_grevillea", "1 / @fx.usd_per_kes_2020",
            "GiveWell's sheet uses 108 Kenyan shillings per dollar for One Acre Fund's Kenyan seedling prices, undated; its rates for the other countries in the sheet (Rwanda 950, Malawi 740, Burundi 1,951, Ethiopia 29.25) are 2020 levels, so our view uses the 2020 average.")]
       for m in ("one-acre-fund-seedlings-2022", "one-acre-fund-updated-value-information-rwanda")},
    "malengo-2024": [("usd_ugx_exchange_rate_2021", "1 / @fx.usd_per_ugx_2021", "GiveWell's sheet uses 3,586 Ugandan shillings per dollar, exchangerates.org.uk's 2021 average; our view uses the World Bank's 2021 average.")],
    **{m: [(f"official_exchange_rate_lcu_per_us_period_average{s}", f"1 / @fx.usd_per_{c}_2017", f"GiveWell's sheet copies the World Bank's 2017 rate for {n}; it reads the same figure here.")
           for s, c, n in (("", "kes", "Kenya"), ("_2", "mwk", "Malawi"), ("_3", "mzn", "Mozambique"), ("_4", "rwf", "Rwanda"), ("_5", "ugx", "Uganda"))]
       for m in ("givedirectly-cash-poverty-relief-2024", "givedirectly-v2-6x-botecs-givewell")},
    "oxygen-access-project-aim": [("exchange_rate_of_usd_to_ngn", "1 / @fx.usd_per_ngn_2024", "Ambitious Impact's sheet uses ₦1,570 per dollar, the rate on 12 July 2024; our view uses the 2024 average.")],
    "better-season-project-aim": [("ksh_to_usd_conversion_rate", "@fx.usd_per_kes_2024", "Ambitious Impact's sheet uses $0.00772 per Kenyan shilling (Google Finance, 5/12/2024); our view uses the 2024 average.")],
    "innovation-in-government-initiative-founders-pledge": [("usd_per_rs_crore", "@fx.usd_per_inr_2015 * rupees_per_crore",
                                                             "Founders Pledge converts at the June 2015 rate (OANDA), $156,414 per crore; our view uses the IRS's 2015 average.")],
    "opal-health-aim": [("sierra_leone_currency_conversion_rate", "@fx.usd_per_sle_2023 / 1000",
                         "Ambitious Impact's sheet uses $0.0000508 per old leone (SLL), undated, in a 2024 sheet; our view uses the 2023 average, the latest full year the World Bank has, in new leones (SLE; 1 SLE = 1,000 SLL since the July 2022 redenomination).")],
}


def close(a, b):
    return abs(a - b) <= 1e-6 * max(abs(a), abs(b))


# Rows a link needs that the sheet folds into a constant.
EXTRA_ROWS = {
    "innovation-in-government-initiative-founders-pledge": ("usd_per_rs_crore", {
        "id": "rupees_per_crore", "section": "india", "label": "Rupees in a crore", "format": "integer", "value": 10000000, "kind": "observed",
        "explainer": "A crore is ten million rupees in Indian numbering; the sheet's =7.8207*10000000 for Rs 500 crore carries it."}),
}


def evaluate(formula, facts, rows):
    expr = re.sub(r"@fx\.(\w+)", lambda m: repr(facts[m.group(1)]), formula)
    expr = re.sub(r"(?<![\w.])([a-z_][a-z0-9_]*)\b", lambda m: repr(rows[m.group(1)]["value"]), expr)
    return eval(expr, {"__builtins__": {}})  # noqa: S307 - our own arithmetic on numbers


def main():
    fx = json.loads(FX_FILE.read_text())
    have = {r["id"] for r in fx["rows"]}
    for row in fact_rows():
        if row["id"] in have:
            fx["rows"][[r["id"] for r in fx["rows"]].index(row["id"])] = row
        else:
            fx["rows"].append(row)
    FX_FILE.write_text(json.dumps(fx, indent=2, ensure_ascii=False) + "\n")
    facts = {r["id"]: r["value"] for r in fx["rows"]}

    paths = {}
    for p in sorted(ROOT.glob("models/**/*.json")):
        txt = p.read_text()
        paths[json.loads(txt)["id"]] = (p, 1 if txt.startswith('{\n "') else 2)
    for mid, links in LINKS.items():
        p, ind = paths[mid]
        m = json.loads(p.read_text())
        if mid in EXTRA_ROWS and not any(r["id"] == EXTRA_ROWS[mid][1]["id"] for r in m["rows"]):
            before, extra = EXTRA_ROWS[mid]
            m["rows"].insert(next(i for i, r in enumerate(m["rows"]) if r["id"] == before), dict(extra))
        rows = {r["id"]: r for r in m["rows"]}
        for rid, formula, why in links:
            r = rows[rid]
            if r.get("formula") == formula:
                continue
            theirs = r.get("published", r.get("expected", r.get("value")))
            theirs = theirs["best"] if isinstance(theirs, dict) else theirs
            ours = evaluate(formula, facts, rows)
            for k in ("value", "kind", "expected", "published"):
                r.pop(k, None)
            r["formula"] = formula
            ref = re.search(r"@fx\.\w+", formula).group(0)
            if close(theirs, ours):
                r["expected"] = theirs
                note = f"Reads the shared exchange rate (`{ref}`). {why}"
            else:
                r["published"] = theirs
                note = f"Changed for consistency. {why} The site converts every currency at one yearly average (`{ref}`): {ours:.6g} here against the sheet's {theirs:.6g}; the evaluator view keeps the sheet's."
            old = r.get("explainer", "")
            old = re.sub(r"^(Reads the shared exchange rate|Changed for consistency)[^\n]*(\n\n)?", "", old)
            r["explainer"] = (note + ("\n\n" + old if old else "")).strip()
            print(f"{mid}:{rid} {theirs:.6g} -> {ours:.6g} ({ref})")
        p.write_text(json.dumps(m, indent=ind, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
