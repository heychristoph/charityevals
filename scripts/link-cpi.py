"""Consumer price indices, so a past average's spending of several years is counted in one year's prices.

    python3 scripts/link-cpi.py                 # refresh facts/cpi.json for the countries below
    python3 scripts/link-cpi.py MEX KEN         # add countries (ISO3), then refresh

One source for every country (docs/normalization.md 2.7): the World Bank's World Development Indicators,
Consumer price index (2010 = 100), FP.CPI.TOTL, yearly. A model turns a year's local-currency spending into
the prices of year Y as `amount * @cpi.<iso3>_<Y> / @cpi.<iso3>_<year>` and then converts it to dollars at
year Y's `@fx` rate; never a typed deflator or an inflation rate of its own.
"""
import json, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CPI_FILE = ROOT / "facts/cpi.json"
FIRST, LAST = 2005, 2025
TITLE = "World Bank, World Development Indicators: Consumer price index (2010 = 100), FP.CPI.TOTL"
# Countries where the site's charities spend in local currency over several years (past averages).
COUNTRIES = ["BRA", "USA", "GBR", "IND", "MEX", "KEN", "UGA", "NGA", "DEU", "FRA", "ESP", "ZAF", "CHN"]


def fetch(iso):
    url = f"https://api.worldbank.org/v2/country/{iso}/indicator/FP.CPI.TOTL?format=json&date={FIRST}:{LAST}&per_page=100"
    with urllib.request.urlopen(url, timeout=30) as r:
        meta, data = json.load(r)
    return url, meta.get("lastupdated", ""), [(int(d["date"]), d["value"], d["country"]["value"]) for d in data or [] if d["value"] is not None]


def main():
    old = json.loads(CPI_FILE.read_text()) if CPI_FILE.exists() else {"rows": []}
    have = sorted({r["id"].split("_")[0].upper() for r in old["rows"]})
    countries = sorted(set(COUNTRIES) | set(have) | {a.upper() for a in sys.argv[1:]})
    rows = []
    for iso in countries:
        url, updated, data = fetch(iso)
        for year, value, country in sorted(data):
            rows.append({
                "id": f"{iso.lower()}_{year}", "label": f"Consumer price index, {country}, {year} (2010 = 100)", "unit": "index",
                "format": "number", "value": float(f"{value:.6g}"), "kind": "observed",
                "source": {"title": TITLE, "url": url, "note": f"{country}, {year}: {value:.4f} (WDI last updated {updated}).", "retrieved": "2026-11-03"},
                "explainer": f"{country}'s consumer prices in {year}, 2010 = 100. A past average's spending of another year is put into one year's prices by the ratio of two years' indices (scripts/link-cpi.py), before it is converted to dollars.",
            })
    CPI_FILE.write_text(json.dumps({"id": "cpi", "label": "Consumer price indices (World Bank, 2010 = 100)", "rows": rows}, indent=1, ensure_ascii=False) + "\n")
    print(f"wrote {len(rows)} rows for {len(countries)} countries")


if __name__ == "__main__":
    main()
