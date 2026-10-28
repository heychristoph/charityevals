"""Builds inventory/givewell-models.json: one entry per spreadsheet linked from GiveWell's grant pages,
with what we do with it (import, or why not) and, for imports, the charity, model id and bottom-line cell.

    python3 scripts/givewell-manifest.py <inventory dir with gw_inventory.json, bulk_stats.json>

The crawl that produces those inputs is described in inventory/README.md. Decisions that a rule can't
make (which cell is the bottom line, which charity a research grant belongs to) are the tables below.
"""
import json, re, sys
from pathlib import Path

src = Path(sys.argv[1])
inv = json.loads((src / "gw_inventory.json").read_text())
stats = {s["sheet"]: s for s in json.loads((src / "bulk_stats.json").read_text())}

# Bottom-line cells picked by hand where the converter's rule picks wrong or nothing.
# kind: xcash (multiple of cash), uov (units of value per dollar), uov_per:<n> (units of value per $n).
CELL = {
    "18l_L5DHm7u0": ("'Malaria Consortium'!B254", "xcash"),
    "1K6gh89fCTDn": ("'Malaria Consortium (LLINs)'!B322", "uov"),
    "1T5joAEoQeym": ("'Main model - RTS,S for comparat'!B275", "xcash"),
    "1r6xUPGyF64b": ("'Simple HKI Madagascar CEA (for '!E37", "xcash"),
    "1ZWoQhJwsSkM": ("'Main calcs'!H92", "uov"),
    "1Ay6zbPv_a-N": ("Main!B43", "xcash"),
    "1MJA3GbjnU4z": ("'EAB BOTEC'!B33", "xcash"),
    "1Pl4gpFlLW93": ("PAD!C37", "uov_per:100000"),
    "1hQb7m6tLyMm": ("'New Incentives'!B15", "xcash"),
    "1njWQ1SZxoIh": ("'New Incentives'!B7", "xcash"),
    "1kQ5DTW37CsG": ("Sheet1!G7", "xcash"),
    "19S5CUI9H7HC": ("Sheet1!C8", "xcash"),
    "1AU8IwQChapO": ("Sheet1!C9", "xcash"),
    "1lLS-H141xKD": ("Sheet1!C22", "xcash"),
    "1o483FYbAAHM": ("Cameroon!D9", "xcash"),
    "1j66PaM4XAH0": ("'Main - New NI BOTEC'!B38", "xcash"),
    "1R7rwLphz9Vt": ("'No Lean Season'!C37", "xcash"),
    # Exports openpyxl only reads with styles and filters stripped (convert-sheet.py does that).
    "17ivGP0KATv3": ("Results!B44", "xcash"),
    "1CzcdhfViB1d": ("'Results Top-up'!B39", "xcash"),
    "1Nl5bhaB3HoR": ("Results!B62", "usd_per_daly"),  # US dollars per DALY saved, not a multiple of cash
}
NOT_PUBLIC = {"1VS9JXrnQVcK": "the sheet now asks for sign-in"}
# Linked as models but not cost-effectiveness estimates of a program: inputs, benchmarks, tables.
NOT_A_MODEL = {
    "1-wJwHvqgIZI": "values contraception per couple-year; an input to other models",
    "1NH91oN0XpAp": "values contraception per couple-year; an input to other models",
    "1o0l0xucYB": "GiveWell's cash benchmark itself",
    "1Ybv7Nzo_-": "counterfactual value of Global Fund spending; an input to leverage adjustments",
    "1nC6gNax30": "a table of results by country from another sheet",
    "1V4MRDqbCY": "MSI's impact data; inputs, no cost-effectiveness",
    "1iXOUUHcPO": "compares versions of Helen Keller's CEA",
    "1vyWoMl3_i": "suicides prevented by a pesticide ban; no costs",
}

# Charity for each sheet, by the first matching pattern in its title. Grants to universities for
# trials are filed under the organisation running the study.
CHARITY = [
    (r"Ondo and Anambra LLINs|version 24\.3 \(Ondo", "malaria-consortium"),
    (r"Cameroon grant to Jhpiego", "jhpiego"),
    (r"RTS,S|PMC|PATH", "path"),
    (r"SMC\+VAS|VAS\) codelivery by Malaria Consortium|seasonal malaria|\bSMC\b|Malaria Consortium", "malaria-consortium"),
    (r"Chad renewal grant\] GiveWell, CEA of vitamin A|Nutrition International", "nutrition-international"),
    (r"vitamin A|Helen Keller|HKI", "helen-keller-intl"),
    (r"insecticide-treated net|\bITN\b|AMF", "against-malaria-foundation"),
    (r"value of the grant model for New Incentives|IDinsight", "idinsight"),
    (r"Global Vaccines", "international-rescue-committee"),  # IRC's vaccination scoping, modelled on New Incentives
    (r"New Incentives|NI CEA", "new-incentives"),
    (r"IRC|Malnutrition treatment CEA \(IRC", "international-rescue-committee"),
    (r"Taimaka", "taimaka"),
    (r"ALIMA|combined protocol", "alima"),
    (r"Uduma", "uduma"),
    (r"J-PAL", "j-pal"),
    (r"Vouchers|Water Vouchers|DIL Bridge", "development-innovation-lab"),
    (r"Deworm the World|Evidence Action|EvAc|In-line Chlorination|India Water|Water quality|Dispensers|IFA|folic acid|NLS|No Lean|[Ss]yphilis|Beta|Phase 2 IFA", "evidence-action"),
    (r"Sightsavers", "sightsavers"),
    (r"GiveDirectly", "givedirectly"),
    (r"World Food Programme", "world-food-programme"),
    (r"Fortify Health|Iron [Ff]ortification", "fortify-health"),
    (r"Spiro", "spiro"),
    (r"CHAI|mSupply|Malaria RDT|TB HCM program in India", "clinton-health-access-initiative"),
    (r"ORS/Zinc", "clear-solutions"),
    (r"Suvita", "suvita"),
    (r"IRD", "ird-global"),
    (r"Dimagi", "dimagi"),
    (r"Notify Health", "notify-health"),
    (r"Malengo", "malengo"),
    (r"Lafiya", "lafiya-nigeria"),
    (r"IPA M&E", "innovations-for-poverty-action"),
    (r"MSI|Family planning mobile outreach", "msi-reproductive-choices"),
    (r"UNFPA", "unfpa"),
    (r"radio campaigns|FEM", "family-empowerment-media"),
    (r"Pure Earth", "pure-earth"),
    (r"One Acre Fund", "one-acre-fund"),
    (r"Bridges to Prosperity", "fika"),
    (r"Precision Agriculture", "precision-development"),
    (r"DMI", "development-media-international"),
    (r"Ansh", "ansh"),
    (r"r\.i\.c\.e\.|Kangaroo Mother Care", "rice-institute"),
    (r"AtlasAI", "atlas-ai"),
    (r"CA CODE|CHoBI7", "johns-hopkins-university"),
    (r"CPSP|[Pp]esticide", "centre-for-pesticide-suicide-prevention"),
    (r"EARN|Eyeglasses", "lshtm"),
    (r"F35 milk", "sickkids"),
    (r"Moxidectin", "medicines-development-for-global-health"),
    (r"Raising the Village", "raising-the-village"),
    (r"WHO GDG", "world-health-organization"),
    (r"Walter and Eliza Hall", "wehi"),
    (r"Desalination", "yale-research-initiative-on-innovation-and-scale"),
    (r"Vital Strategies", "vital-strategies"),
    (r"PLA-MNH", "university-college-london"),
    (r"Healthy Futures", "healthy-futures"),
    (r"R4D", "results-for-development"),
    (r"MiracleFeet", "miraclefeet"),
]

STOP = r"\b(givewell'?s?|public|shared( publicly)?|cost-effectiveness analysis|cea|botec|of|for|the|and|copy|external|published|grant|program|programs|analysis|version|simple|simplified|gw)\b"


def slugify(title, charity):
    t = re.sub(r"\([^()]*public[^()]*\)|\[[^\[\]]*public[^\[\]]*\]|\.xlsx|\bcopy for\b|\bcopy of\b", " ", title, flags=re.I)
    for word in charity.split("-"):
        t = re.sub(rf"\b{re.escape(word)}\b", " ", t, flags=re.I)
    t = re.sub(r"[’']s\b", "", t)
    t = re.sub(STOP, " ", t, flags=re.I)
    s = re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")
    s = re.sub(r"-+", "-", s)
    return s[:40].rsplit("-", 1)[0] if len(s) > 40 else (s or "model")


out, seen_ids, by_value = [], set(), {}
COPY = re.compile(r"copy", re.I)
for r in sorted(inv, key=lambda r: (bool(COPY.search(r["title"])), r["title"])):
    sid, title = r["id"], r["title"]
    grants = sorted(r["grants"], key=lambda g: g["date"] or "9999")
    entry = {"sheet": sid, "title": title, "url": f"https://docs.google.com/spreadsheets/d/{sid}/edit",
             "category": r["cat"], "grant_pages": sorted({g["page"] for g in grants}),
             "recipients": r["recipients"], "first_grant": grants[0]["date"] if grants else None}
    short = next((k for k in NOT_A_MODEL if sid.startswith(k)), None)
    if r["cat"] == "archive": entry["status"] = "not imported: archived copy or change tracker"
    elif r["cat"] == "annual": entry["status"] = "not imported: GiveWell's yearly multi-charity CEA, superseded by the current top-charity models"
    elif r["cat"] == "supporting": entry["status"] = "not imported: supporting data (costs, funding gaps, inputs), not a cost-effectiveness model"
    elif short: entry["status"] = f"not imported: {NOT_A_MODEL[short]}"
    elif any(sid.startswith(k) for k in NOT_PUBLIC): entry["status"] = "not imported: " + next(v for k, v in NOT_PUBLIC.items() if sid.startswith(k))
    else:
        st = stats.get(sid, {})
        cell = next((v for k, v in CELL.items() if sid.startswith(k)), None)
        if not cell and "rows" not in st:
            entry["status"] = "not imported: the export can't be read (" + str(st.get("error", ["?"])[-1])[:80] + ")"
        else:
            charity = next((c for p, c in CHARITY if re.search(p, title)), None)
            if not charity: raise SystemExit(f"no charity for {sid} {title}")
            base = f"{charity}-{slugify(title, charity)}"[:72].strip("-")
            mid = base
            if mid in seen_ids and entry["first_grant"]: mid = f"{base[:64]}-{entry['first_grant'][:7]}"
            k = 2
            while mid in seen_ids: mid = f"{base}-{k}"; k += 1
            entry.update({"status": "import", "charity": charity, "model_id": mid})
            if cell: entry["cell"], entry["bottom"] = cell
            # Copies of a sheet with the same headline number for the same charity are one model.
            key = (charity, round(st.get("value") or -1, 6)) if not cell else None
            if key and key in by_value:
                entry.update({"status": f"not imported: same model and result as {by_value[key]}"})
                entry.pop("model_id"); out.append(entry); continue
            if key: by_value[key] = mid
            seen_ids.add(mid)
    out.append(entry)

# A copy titled "Copy"/"[Copy ...]" should lose to the original when both exist: originals sort later
# alphabetically only by accident, so swap where needed.
Path("inventory/givewell-models.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n")
from collections import Counter
print(Counter(e["status"].split(":")[0] for e in out))
print(len({e["charity"] for e in out if e.get("charity")}), "charities")
