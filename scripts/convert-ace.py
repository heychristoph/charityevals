"""Convert an Animal Charity Evaluators cost-effectiveness spreadsheet into a charityevals model.

ACE's CEA tabs share a layout: labels in column A, the best guess in B, two bounds in C and D
(named "Upper/Lower", "Optimistic/Conservative" or the reverse; the header row says which),
the source type in E and a source link in F. Each tab is a program; each program reports
suffering-adjusted days (SADs) averted per dollar as a row "X / cost".

Every formula in column B is translated; references outside column B become input rows with
the sheet's value. A best guess computed only from its own row's bounds (e.g. AVERAGE(C13:D13))
becomes an input with that range. Values computed with Google-only functions (NPV) are kept as
inputs with the sheet's value. Every calculated row records the sheet's value as `expected`.

The charity's bottom line is total SADs averted across programs divided by their total cost,
then reduced by the share of cost staff contribute through lower pay (charityevals adjustment).

    python3 scripts/convert-ace.py ace.xlsx --id the-humane-league --name "The Humane League" \\
        --review URL --sheet-url URL --published 2025-11-04 --out models/animal-welfare
"""
import argparse, json, re, sys, unicodedata
from pathlib import Path
import openpyxl

p = argparse.ArgumentParser()
p.add_argument("xlsx")
p.add_argument("--id", required=True)
p.add_argument("--charity", default=None, help="charity id; defaults to --id")
p.add_argument("--name", required=True)
p.add_argument("--website")
p.add_argument("--donate")
p.add_argument("--donate-via")
p.add_argument("--review", required=True)
p.add_argument("--sheet-url", required=True)
p.add_argument("--published", required=True)
p.add_argument("--what", default="")
p.add_argument("--tabs", nargs="*", help="CEA tabs (default: every tab with a 'Best guess' header)")
p.add_argument("--staff-share", type=float, nargs=3, default=[0.5, 0.65, 0.8])
p.add_argument("--salary-gap", type=float, nargs=3, default=[0.15, 0.35, 0.55])
p.add_argument("--metric", default=r"sads?", help="regex for the per-dollar rows to count (default: SADs)")
p.add_argument("--unit", default="sad", help="unit key in assumptions/default.json")
p.add_argument("--unit-label", default="SADs averted")
p.add_argument("--per", type=float, default=1, help="the metric rows are per this many dollars (e.g. 1000000)")
p.add_argument("--out", required=True)
a = p.parse_args()

F = openpyxl.load_workbook(a.xlsx)
V = openpyxl.load_workbook(a.xlsx, data_only=True)
text = lambda v: getattr(v, "text", v)

def slug(s, maxlen=48):
    s = unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"\[.*?\]|\(.*?\)", "", s)
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")
    if not s or not s[0].isalpha(): s = "r_" + s
    return s[:maxlen].rstrip("_")

def header_row(ws):
    for r in range(1, 12):
        b = text(ws[f"B{r}"].value)
        if isinstance(b, str) and b.strip().lower().startswith("best"):
            return r
    return None

tabs = a.tabs or [ws.title for ws in F.worksheets if header_row(ws)]
if not tabs: sys.exit("no CEA tabs found")

KIND = lambda src: ("observed" if src and "charity's data" in src.lower() else
                    "judgment" if src and "guess" in src.lower() else "estimate")

rows, order, ids, sections = {}, [], set(), []
by_cell = {}
programs = []   # (sads_row_id, cost_row_id, tab)

def new_id(base):
    i, n = base, 2
    while i in ids: i = f"{base}_{n}"; n += 1
    ids.add(i); return i

TOK = re.compile(r"""\s*(?:(?P<ref>(?:'[^']+'|[A-Za-z_][A-Za-z0-9_ ]*?)!\$?[A-Z]{1,3}\$?\d+(?::\$?[A-Z]{1,3}\$?\d+)?|\$?[A-Z]{1,3}\$?\d+(?::\$?[A-Z]{1,3}\$?\d+)?)
    |(?P<num>\d+\.?\d*(?:[eE][+-]?\d+)?%?)|(?P<fn>[A-Z][A-Z0-9.]*\()|(?P<op>[-+*/^(),]))""", re.X)

def tokenize(f):
    out, i = [], 0
    f = f.strip()
    while i < len(f):
        m = TOK.match(f, i)
        if not m or m.end() == i: raise ValueError(f"can't parse {f!r} at {i}")
        i = m.end(); out.append((m.lastgroup, m.group(m.lastgroup)))
    return out

def split_ref(ref, tab):
    if "!" in ref: t, ref = ref.rsplit("!", 1); tab = t.strip("'")
    return tab, ref.replace("$", "")

def expand(tab, ref):
    if ":" not in ref: return [(tab, ref)]
    (c1, r1), (c2, r2) = (re.match(r"([A-Z]+)(\d+)", x).groups() for x in ref.split(":"))
    from openpyxl.utils import column_index_from_string as ci, get_column_letter as gl
    return [(tab, f"{gl(c)}{r}") for c in range(ci(c1), ci(c2) + 1) for r in range(int(r1), int(r2) + 1)]

def leaf(tab, addr, prefix, section):
    key = (tab, addr)
    if key in by_cell: return by_cell[key]
    v = V[tab][addr].value
    if not isinstance(v, (int, float)): raise ValueError(f"{tab}!{addr} is {v!r}")
    row = int(re.sub(r"[A-Z]", "", addr)); col = re.sub(r"\d", "", addr)
    lab = text(F[tab][f"A{row}"].value) or f"{tab} {addr}"
    hdr = header_row(F[tab]) if tab in F.sheetnames else None
    colname = text(F[tab][f"{col}{hdr}"].value) if hdr and col != "B" else None
    label = f"{lab} ({colname.lower()})" if colname else str(lab)
    rid = new_id(f"{prefix}{slug(label)}")
    src = text(F[tab][f"E{row}"].value) if tab in tabs else None
    link = text(F[tab][f"F{row}"].value) if tab in tabs else None
    r = {"id": rid, "section": section, "label": label.strip(), "value": v, "kind": KIND(src if isinstance(src, str) else None),
         "source": {"title": f"ACE ({src.strip()})" if isinstance(src, str) and src.strip() else "ACE", "cell": f"{tab}!{addr}"}}
    if isinstance(link, str) and link.startswith("http"): r["source"]["url"] = link
    r["explainer"] = f"From ACE's spreadsheet, cell {tab}!{addr}" + (f" ({src.strip()})." if isinstance(src, str) and src.strip() else ".")
    rows[rid] = r; order.append(rid); by_cell[key] = rid
    return rid

def translate(tab, row, prefix, section):
    """Row id for column B of `row` in `tab`, converting it on first use."""
    key = (tab, f"B{row}")
    if key in by_cell: return by_cell[key]
    raw = text(F[tab][f"B{row}"].value)
    cached = V[tab][f"B{row}"].value
    lab = text(F[tab][f"A{row}"].value) or f"Row {row}"
    if not (isinstance(raw, str) and raw.startswith("=")):
        if not isinstance(cached, (int, float)): raise ValueError(f"{tab}!B{row} is {cached!r}")
        rid = new_id(f"{prefix}{slug(lab)}")
        src = text(F[tab][f"E{row}"].value); link = text(F[tab][f"F{row}"].value)
        hi_lo = [V[tab][f"{c}{row}"].value for c in ("C", "D")]
        val = cached
        if all(isinstance(x, (int, float)) for x in hi_lo) and min(hi_lo) != max(hi_lo):
            val = {"low": min(hi_lo + [cached]), "best": cached, "high": max(hi_lo + [cached])}
        r = {"id": rid, "section": section, "label": str(lab).strip(), "value": val, "kind": KIND(src if isinstance(src, str) else None),
             "source": {"title": f"ACE ({src.strip()})" if isinstance(src, str) and src.strip() else "ACE", "cell": f"{tab}!B{row}"}}
        if isinstance(link, str) and link.startswith("http"): r["source"]["url"] = link
        note = text(F[tab][f"H{row}"].value)
        r["explainer"] = (note.strip() + "\n\n" if isinstance(note, str) and note.strip() and not note.strip().startswith("=") else "") + \
                         f"ACE's input" + (f", source type: {src.strip()}" if isinstance(src, str) and src.strip() else "") + \
                         (". Range: ACE's bounds." if isinstance(val, dict) else ".")
        rows[rid] = r; order.append(rid); by_cell[key] = rid
        return rid
    if "DUMMYFUNCTION" in raw:
        rid = new_id(f"{prefix}{slug(lab)}")
        r = {"id": rid, "section": section, "label": str(lab).strip(), "value": cached, "kind": "estimate",
             "source": {"title": "ACE", "cell": f"{tab}!B{row}"},
             "explainer": "ACE computes this with a Google Sheets function (such as NPV over the years of impact). "
                          "The value is copied from the sheet, so changing the inputs above doesn't change it yet."}
        rows[rid] = r; order.append(rid); by_cell[key] = rid
        return rid
    toks = tokenize(raw[1:])
    # A best guess computed only from its own row's bounds is an input with that range.
    refs_ = [split_ref(t, tab) for k, t in toks if k == "ref"]
    cells = [c for tb, rf in refs_ for c in expand(tb, rf)]
    if cells and all(tb == tab and re.sub(r"[A-Z]", "", ad) == str(row) and ad[0] in "CD" for tb, ad in cells):
        lo_hi = [V[tab][ad].value for _, ad in cells]
        rid = new_id(f"{prefix}{slug(lab)}")
        r = {"id": rid, "section": section, "label": str(lab).strip(),
             "value": {"low": min(lo_hi), "best": cached, "high": max(lo_hi)}, "kind": "estimate",
             "source": {"title": "ACE", "cell": f"{tab}!B{row}:D{row}"},
             "explainer": "ACE's best guess is the midpoint of its bounds; the range is ACE's."}
        rows[rid] = r; order.append(rid); by_cell[key] = rid
        return rid
    by_cell[key] = None
    rid = new_id(f"{prefix}{slug(lab)}"); by_cell[key] = rid
    out, i = [], 0
    while i < len(toks):
        k, t = toks[i]
        if k == "fn":
            name = t[:-1]
            depth, j, args, cur = 1, i + 1, [], []
            while True:
                kk, tt = toks[j]
                if kk == "fn" or tt == "(": depth += 1
                if tt == ")": depth -= 1
                if depth == 0: break
                if tt == "," and depth == 1: args.append(cur); cur = []
                else: cur.append((kk, tt))
                j += 1
            args.append(cur); i = j + 1
            fn = {"SUM": "sum", "AVERAGE": "avg", "MIN": "min", "MAX": "max", "LN": "ln", "EXP": "exp"}.get(name)
            if not fn: raise ValueError(f"unsupported function {name} in {tab}!B{row}")
            parts = []
            for arg in args:
                if len(arg) == 1 and arg[0][0] == "ref":
                    tb, rf = split_ref(arg[0][1], tab)
                    parts += [ref_id(tb, ad, prefix, section) for tb, ad in expand(tb, rf)
                              if isinstance(V[tb][ad].value, (int, float))]
                else: parts.append(sub(arg, tab, prefix, section))
            out.append(f"{fn}({', '.join(parts)})"); continue
        if k == "ref":
            tb, rf = split_ref(t, tab); out.append(ref_id(tb, rf, prefix, section))
        elif k == "num": out.append(t)
        else: out.append(t)
        i += 1
    f = " ".join(out).replace("( ", "(").replace(" )", ")").replace(" ,", ",")
    r = {"id": rid, "section": section, "label": str(lab).strip(), "formula": f}
    if isinstance(cached, (int, float)): r["expected"] = cached
    rows[rid] = r; order.append(rid)
    return rid

def sub(toks, tab, prefix, section):
    # small helper for nested function args: translate via a throwaway formula
    s = []
    for k, t in toks:
        if k == "ref": tb, rf = split_ref(t, tab); s.append(ref_id(tb, rf, prefix, section))
        else: s.append(t)
    return " ".join(s)

def ref_id(tab, addr, prefix, section):
    if tab in tabs and addr.startswith("B") and addr[1:].isdigit():
        return translate(tab, int(addr[1:]), prefix, section)
    return leaf(tab, addr, prefix, section)

for n, tab in enumerate(tabs, 1):
    ws = F[tab]; hdr = header_row(ws); prefix = f"p{n}_"
    # Program name: a "Program ..." line near the header, else the first title line; tab names are cut at 31 characters.
    near = [text(ws[f"A{r}"].value) for r in range(1, hdr + 4)]
    above = [text(ws[f"A{r}"].value) for r in range(1, hdr)]
    title = next((c for c in near if isinstance(c, str) and c.lower().startswith("program")), None) \
        or next((c for c in above if isinstance(c, str) and "analysis of" in c.lower() and "program" in c.lower()), tab)
    title = re.sub(r"^ACE's Cost-Efficiency Analysis of [^']+'s ", "", str(title))
    section = slug(f"p{n} {tab}")
    sections.append({"id": section, "title": str(title).strip().rstrip(".")})
    sad_row = None
    for r in range(hdr + 1, ws.max_row + 1):
        lab, raw = text(ws[f"A{r}"].value), text(ws[f"B{r}"].value)
        if lab is None or raw is None: continue
        cached = V[tab][f"B{r}"].value
        if not isinstance(cached, (int, float)): continue
        try:
            translate(tab, r, prefix, section)
        except ValueError as e:
            print(f"  skipped {tab}!B{r}: {e}")
            continue
        l = lab.lower().replace(" ", "") if isinstance(lab, str) else ""
        if re.search(a.metric, l) and ("/$" in l or "per$" in l or "per$1" in l or "/\$" in l):
            sad_row = r
    if sad_row is None:
        # fall back: last row whose label mentions SAD and per $
        for r in range(ws.max_row, hdr, -1):
            lab = text(ws[f"A{r}"].value)
            if isinstance(lab, str) and re.search(a.metric, lab.lower().replace(" ", "")) and ("$" in lab or "dollar" in lab.lower()) and (ws.title, f"B{r}") in by_cell:
                sad_row = r; break
    if sad_row is None:
        print(f"  {tab}: no SADs-per-dollar row; program not counted in the bottom line"); continue
    raw = text(ws[f"B{sad_row}"].value) or ""
    # Split "=numerator/denominator" at the last top-level "/": the denominator is the program cost.
    depth, cut = 0, None
    for i, ch in enumerate(raw):
        depth += ch == "("; depth -= ch == ")"
        if ch == "/" and depth == 0: cut = i
    if cut is None:
        print(f"  {tab}: SADs-per-dollar row isn't something/cost ({raw}); program not counted"); continue
    den = raw[cut + 1:].strip()
    m = re.fullmatch(r"\$?B\$?(\d+)", den)
    if m:
        cost_id = by_cell[(tab, f"B{m.group(1)}")]
    else:
        cost_id = new_id(f"{prefix}program_cost")
        rows[cost_id] = {"id": cost_id, "section": section, "label": "Program cost used for SADs per dollar", "format": "usd",
                         "formula": sub(tokenize(den.strip("()")), tab, prefix, section)}
        order.append(cost_id)
    rate_id = by_cell[(tab, f"B{sad_row}")]
    # The program's SADs are its SADs-per-dollar times its cost, whatever the numerator's shape.
    programs.append((f"{rate_id} * {cost_id}" + (f" / {a.per:g}" if a.per != 1 else ""), cost_id, tab))

if not programs: sys.exit(f"no program reports {a.unit_label} per dollar")

rows_out = [rows[i] for i in order]
sads = " + ".join(s for s, _, _ in programs)
costs = " + ".join(dict.fromkeys(c for _, c, _ in programs))
lo, best, hi = a.staff_share; glo, gbest, ghi = a.salary_gap
rows_out += [
    {"id": "sads_total", "section": "bottom", "label": f"{a.unit_label}, all modelled programs", "format": "integer", "formula": sads},
    {"id": "cost_total", "section": "bottom", "label": "Spending on the modelled programs", "format": "usd", "formula": costs},
    {"id": "sads_per_dollar", "section": "bottom", "label": f"All modelled programs: {a.unit_label} per dollar", "format": "small" if a.per != 1 else "number",
     "formula": "sads_total / cost_total"},
    {"id": "staff_cost_share", "section": "donor", "label": "Staff pay as a share of program cost", "format": "percent",
     "value": {"low": lo, "best": best, "high": hi}, "kind": "judgment",
     "explainer": "Advocacy is mostly people, so staff pay is usually most of the budget. We haven't seen this charity's breakdown; "
                  "the default is the same guess we use for other animal advocacy groups. Range is ours."},
    {"id": "salary_gap", "section": "donor", "label": "Pay gap versus comparable for-profit jobs", "format": "percent",
     "value": {"low": glo, "best": gbest, "high": ghi}, "kind": "judgment",
     "explainer": "Campaigners, researchers and negotiators could typically earn considerably more in comparable for-profit roles. Range is ours."},
    {"id": "salary_sacrifice", "section": "donor", "label": "Salary forgone by staff (in-kind donation)", "format": "usd",
     "formula": "cost_total * staff_cost_share * salary_gap / (1 - salary_gap)"},
    {"id": "donor_cost_share", "section": "donor", "label": "Share of the full cost paid by cash donations", "format": "percent",
     "formula": "cost_total / (cost_total + if($count_salary_sacrifice, salary_sacrifice, 0))"},
    {"id": "sads_per_donor_dollar", "section": "donor", "label": f"{a.unit_label} per dollar you give", "format": "small" if a.per != 1 else "number",
     "formula": "sads_per_dollar * donor_cost_share"},
]
sections += [{"id": "bottom", "title": "Bottom line", "explainer": f"{a.unit_label} per dollar across the programs ACE modelled. Programs ACE didn't model are left out, not assumed to be zero or equal."},
             {"id": "donor", "title": "Your dollar's share", "explainer": "charityevals adjustments on top of ACE's model."}]
names = ", ".join(t for *_, t in programs)
model = {
    "id": a.id, "name": a.name, "kind": "charity", "cause": "animal-welfare", "charity": a.charity or a.id, "owner": "ace",
    "summary": (f"{a.what} A re-implementation of Animal Charity Evaluators' cost-effectiveness sheet "
                f"({len(programs)} program{'s' if len(programs) > 1 else ''} with {a.unit_label} estimates: {names}).").strip(),
    "source": {"publisher": "Animal Charity Evaluators", "title": f"{a.name} review", "url": a.review, "sheet": a.sheet_url,
               "published": a.published, "retrieved": "2026-10-26", "license": "Unclear: check ACE's terms before republishing"},
    "sections": [s for s in sections if any(r.get("section") == s["id"] for r in rows_out)],
    "rows": rows_out,
    "output": {"row": "sads_per_donor_dollar", "unit": a.unit, "label": f"{a.unit_label} per dollar you give"},
    "evaluator": {"name": "ACE", "assumptions": {"count_salary_sacrifice": 0, "full_credit": 0}},
}
out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
cpath = Path("charities") / f"{a.charity or a.id}.json"
crec = json.loads(cpath.read_text()) if cpath.exists() else {"id": a.charity or a.id, "name": a.name, "cause": "animal-welfare"}
crec.update({k: v for k, v in {"website": a.website, "donate": a.donate, "donate_via": a.donate_via}.items() if v})
cpath.write_text(json.dumps(crec, indent=2, ensure_ascii=False) + "\n")
# carry over resources collected earlier (scripts/import-resources.sh), so a re-import keeps them
_prev = out / f"{a.id}.json"
if _prev.exists(): model["resources"] = json.loads(_prev.read_text()).get("resources", [])
(out / f"{a.id}.json").write_text(json.dumps(model, indent=2, ensure_ascii=False) + "\n")
print(f"{a.id}: {len(rows_out)} rows, {sum('expected' in r for r in rows_out)} expected, programs: {names}")
