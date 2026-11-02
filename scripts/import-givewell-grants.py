"""Imports every GiveWell grant model listed for import in inventory/givewell-models.json.

    python3 scripts/import-givewell-grants.py <cache dir for downloaded sheets> [model-id,...]
    python3 scripts/import-givewell-grants.py <cache dir> --dates     re-date imported models only (sheet_date)

Each sheet is downloaded as xlsx (once), converted by convert-sheet.py from its bottom-line cell, and
written to models/grants/givewell/<id>.json; link-parameters.py --only then ties the new models to the
shared assumptions (shared facts: the scripts it prints next). The manifest gets each import's row counts back.
"""
import importlib.util, json, re, subprocess, sys
from pathlib import Path

spec = importlib.util.spec_from_file_location("convert_sheet", Path(__file__).with_name("convert-sheet.py"))
cs = importlib.util.module_from_spec(spec); spec.loader.exec_module(cs)
sys.setrecursionlimit(20000)

cache = Path(sys.argv[1]); cache.mkdir(parents=True, exist_ok=True)
out = Path("models/grants/givewell"); out.mkdir(parents=True, exist_ok=True)
manifest_path = Path("inventory/givewell-models.json")
manifest = json.loads(manifest_path.read_text())


def clean(title):
    t = re.sub(r"\s*[\(\[][^()\[\]]*(public|shared)[^()\[\]]*[\)\]]\s*", " ", title, flags=re.I)
    t = re.sub(r"^(GiveWell|Givewell)(['’]s|,)?\s+", "", t.strip())
    t = re.sub(r"\.xlsx$", "", t).strip(" -,")
    return t[0].upper() + t[1:] if t else title


MONTHS = {m: i + 1 for i, m in enumerate("jan feb mar apr may jun jul aug sep oct nov dec".split())}


def sheet_date(e):
    """The sheet's own date, for "newest sheet first" (src/engine/ranking.ts): the latest date its title
    states ("[Dec 2023]", "2025 version 1", "updated 23 Feb 2026") where that is after the first grant page
    linking it; otherwise that grant's date. A sheet a grant page links can be years newer than the grant
    (a later version filed under the first page), never usefully older."""
    first = e.get("first_grant")
    t = e["title"].lower()
    dates = []
    for d, mon, y in re.findall(r"(?:(\d{1,2}) )?\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,? (20\d\d)\b", t):
        dates.append(f"{y}-{MONTHS[mon]:02d}-{int(d or 1):02d}")
    for y in re.findall(r"(?<![\d-])(20\d\d)(?![\d-])", t):
        dates.append(f"{y}-01-01")
    dates = [d for d in dates if d <= "2026-12-31"]
    best = max(dates, default=None)
    return best if best and (not first or best > first) else first


only = set(sys.argv[2].split(",")) if len(sys.argv) > 2 and sys.argv[2] != "--dates" else None
if len(sys.argv) > 2 and sys.argv[2] == "--dates":
    # Re-date the models already imported without converting them again.
    for e in manifest:
        if e["status"] != "imported": continue
        p = out / f"{e['model_id']}.json"
        if not p.exists(): continue
        m = json.loads(p.read_text())
        d = sheet_date(e)
        if d and m["source"].get("published") != d:
            print(e["model_id"], m["source"].get("published"), "->", d)
            m["source"]["published"] = d
            p.write_text(json.dumps(m, indent=1 if p.read_text().startswith('{\n "') else 2, ensure_ascii=False) + "\n")
    sys.exit(0)
for e in manifest:
    if not e["status"].startswith("import"): continue
    if only and e.get("model_id") not in only: continue
    f = cache / f"{e['sheet']}.xlsx"
    if not f.exists() or f.stat().st_size < 2000:
        subprocess.run(["curl", "-sL", "--max-time", "180", "-A", "Mozilla/5.0", f"https://docs.google.com/spreadsheets/d/{e['sheet']}/export?format=xlsx", "-o", str(f)], check=True)
    pages = e["grant_pages"]
    name = clean(e["title"])
    s = {"id": e["model_id"], "name": name, "charity": e["charity"], "owner": "givewell", "cause": "global-health",
         "summary": f"GiveWell's spreadsheet \"{name}\", linked from {'its grant page' if len(pages) == 1 else f'{len(pages)} of its grant pages'}. "
                    "Every number is traced from the sheet's bottom line; calculated rows reproduce the sheet's own values.",
         "source": {"publisher": "GiveWell", "title": e["title"], "url": pages[0] if pages else e["url"], "sheet": e["url"],
                    **({"published": sheet_date(e)} if sheet_date(e) else {}), "retrieved": "2026-10-27",
                    "license": "CC BY-NC-SA 3.0 US"},
         "evaluator": {"name": "GiveWell", "assumptions": {"resource_shares": 0}},
         "resources": [{"title": e["title"], "url": e["url"], "type": "model", "note": "The spreadsheet this page reproduces."}]
                      + [{"title": f"GiveWell grant page ({p.rstrip('/').rsplit('/', 1)[-1].replace('-', ' ')})", "url": p, "type": "evaluation"} for p in pages[:8]]}
    if e.get("cell"): s["cell"], s["bottom"] = e["cell"], e["bottom"]
    try:
        model, st = cs.build(cs.Sheet(str(f)), s)
    except Exception as ex:  # noqa: BLE001 - one bad sheet shouldn't stop the batch
        e["status"] = f"import failed: {str(ex)[:120]}"; print(e["model_id"], "FAILED", ex); continue
    (out / f"{model['id']}.json").write_text(json.dumps(model, indent=1, ensure_ascii=False) + "\n")
    e["status"] = "imported"
    e["import"] = {"bottom": st["bottom"], "value": st["value"], "rows": st["rows"], "reproduced": st["translated"], "fixed": st["frozen"]}
    print(model["id"], st["rows"], st["frozen"])
manifest_path.write_text(json.dumps(manifest, indent=1, ensure_ascii=False) + "\n")
# Moral weights, discount rates and shared data back onto the shared assumptions and facts.
# Only the sheets imported now: a full rebuild would undo links made since (link-parameters.py).
imported = [e["model_id"] for e in manifest if e.get("status") == "imported" and (not only or e["model_id"] in only)]
if imported:
    subprocess.run([sys.executable, str(Path(__file__).with_name("link-parameters.py")), "--only", ",".join(imported)], check=True)
    print("Next: python3 scripts/link-resource-shares.py, link-givewell-shared.py, link-fx.py, givewell-judgment-kinds.py")
