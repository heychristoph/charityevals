"""Convert a GiveWell cost-effectiveness spreadsheet (2026 layout) into charityevals models.

GiveWell's models share one layout: a "Main CEA" tab with labels in column E, units in F,
a row type in G, an "Overall" column H and one column per country or region from I on; an
"Inputs" tab with the same layout plus the source (R) and GiveWell's reasoning (S).

For the chosen column the script translates every Main CEA formula into the charityevals
formula language. Same-column references become row references; anything else (other tabs,
other columns, constants) becomes an input row carrying the cell's value, its address and,
for Inputs-tab cells, GiveWell's source and reasoning. Every calculated row records the
sheet's value as `expected`, so `npm run check` proves the translation.

Other columns become variants that extend the base model and override only what differs.

    python3 scripts/convert-givewell.py amf.xlsx --id against-malaria-foundation \\
        --name "Against Malaria Foundation" --sheet-url URL --page-url URL \\
        --base-col J --out models/global-health
"""
import argparse, json, re, sys, unicodedata
from pathlib import Path
import openpyxl
from openpyxl.utils import column_index_from_string, get_column_letter

p = argparse.ArgumentParser()
p.add_argument("xlsx")
p.add_argument("--id", required=True)
p.add_argument("--charity", required=True, help="charity id (charities/<id>.json); several models can share one")
p.add_argument("--name", required=True)
p.add_argument("--org", default=None)
p.add_argument("--website", default=None)
p.add_argument("--donate", default=None)
p.add_argument("--donate-via", default=None)
p.add_argument("--what", default="", help="one sentence on what the program does")
p.add_argument("--sheet-url", required=True)
p.add_argument("--page-url", required=True)
p.add_argument("--title", required=True)
p.add_argument("--published", required=True)
p.add_argument("--summary", default="")
p.add_argument("--base-col", required=True, help="column letter of the country used for the main model")
p.add_argument("--out", required=True)
p.add_argument("--tab", default="Main CEA")
a = p.parse_args()

F = openpyxl.load_workbook(a.xlsx)                 # formulas
V = openpyxl.load_workbook(a.xlsx, data_only=True)  # cached values

def text(v): return getattr(v, "text", v)
def fval(tab, addr): return F[tab][addr].value
def vval(tab, addr): return V[tab][addr].value

def slug(s, maxlen=60):
    s = unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode()
    s = re.sub(r"\(.*?\)", "", s).lower()
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")
    s = re.sub(r"_+", "_", s)
    if not s or not s[0].isalpha(): s = "r_" + s
    return s[:maxlen].rstrip("_")

main = F[a.tab]
LABEL, UNIT, TYPE = "E", "F", "G"

def label(tab, row):
    # Cached values, not formulas: some labels are themselves formulas pulling another row's label.
    ws = V[tab]
    for col in ("E", "D", "C", "B", "A"):
        v = text(ws[f"{col}{row}"].value)
        if isinstance(v, str) and v.strip() and not v.startswith("="): return v.strip()
    return None

# Column headers: country (row 2) plus sub-region (row 3) where present.
cols = {}
for c in range(column_index_from_string("I"), main.max_column + 1):
    L = get_column_letter(c)
    country = text(main[f"{L}2"].value)
    if not country: continue
    sub = text(main[f"{L}3"].value)
    cols[L] = f"{country} ({sub})" if sub and sub != country else str(country)

# ---- Excel formula tokenizer -------------------------------------------------------------
TOK = re.compile(r"""
  (?P<ws>\s+) |
  (?P<str>"[^"]*") |
  (?P<ref>(?:(?:'[^']+'|[A-Za-z_][A-Za-z0-9_ .]*?)!)?\$?[A-Z]{1,3}\$?\d+(?::\$?[A-Z]{1,3}\$?\d+)?) |
  (?P<num>\d+\.?\d*(?:[eE][+-]?\d+)?%?) |
  (?P<fn>[A-Z][A-Z0-9.]*\() |
  (?P<op><>|<=|>=|[-+*/^(),=<>&])
""", re.X)

def tokenize(f):
    out, i = [], 0
    while i < len(f):
        m = TOK.match(f, i)
        if not m: raise ValueError(f"can't tokenize {f!r} at {i}")
        i = m.end()
        k = m.lastgroup
        if k != "ws": out.append((k, m.group()))
    return out

def split_ref(ref, here_tab):
    tab = here_tab
    if "!" in ref:
        tab, ref = ref.rsplit("!", 1); tab = tab.strip("'")
    ref = ref.replace("$", "")
    return tab, ref

def cells_in(tab, ref):
    if ":" in ref:
        a1, a2 = ref.split(":")
        c1, r1 = re.match(r"([A-Z]+)(\d+)", a1).groups(); c2, r2 = re.match(r"([A-Z]+)(\d+)", a2).groups()
        return [(tab, f"{get_column_letter(c)}{r}") for c in range(column_index_from_string(c1), column_index_from_string(c2) + 1)
                for r in range(int(r1), int(r2) + 1)]
    return [(tab, ref)]

# ---- model building ----------------------------------------------------------------------
class Builder:
    def __init__(self, col):
        self.col = col
        self.rows = {}          # id -> row dict
        self.order = []
        self.by_cell = {}       # (tab, addr) -> id
        self.ids = set()
        self.section = None
        self.sections = []

    def new_id(self, base):
        i, n = base, 2
        while i in self.ids: i = f"{base}_{n}"; n += 1
        self.ids.add(i); return i

    def leaf(self, tab, addr):
        """An input row for a cell outside this column's calculation."""
        key = (tab, addr)
        if key in self.by_cell: return self.by_cell[key]
        row = int(re.sub(r"[A-Z]", "", addr)); col = re.sub(r"\d", "", addr)
        lab = label(tab, row) or f"{tab} {addr}"
        suffix = "" if col == self.col else (" (overall)" if col == "H" else f" ({cols.get(col, col)})")
        val = vval(tab, addr)
        if isinstance(val, str):
            raise ValueError(f"leaf {tab}!{addr} is text {val!r}")
        rid = self.new_id(slug(lab + suffix if tab == a.tab else (lab + suffix)))
        r = {"id": rid, "label": lab + suffix, "value": val if val is not None else 0, "kind": "estimate",
             "source": {"title": "GiveWell", "cell": f"{tab}!{addr}"}}
        unit = text(F[tab][f"F{row}"].value) if tab in (a.tab, "Inputs") else None
        if unit in ("%",): r["format"] = "percent"
        elif unit in ("$",): r["format"] = "usd"
        if tab == "Inputs":
            src, why = text(F[tab][f"R{row}"].value), text(F[tab][f"S{row}"].value)
            if isinstance(src, str) and src.strip():
                r["source"]["title"] = f"GiveWell ({src.strip()})"
                low = src.lower()
                r["kind"] = "judgment" if ("judgment" in low or "guess" in low or "subjective" in low or "arbitrary" in low) else \
                            "observed" if any(w in low for w in ("survey", "data", "report", "dhs", "who", "unicef", "gbd", "ihme")) else "estimate"
            if isinstance(why, str) and why.strip(): r["explainer"] = why.strip()
        if "explainer" not in r: r["explainer"] = f"Value from GiveWell's sheet, cell {tab}!{addr}."
        if self.section: r["section"] = self.section
        self.by_cell[key] = rid; self.rows[rid] = r; self.order.append(rid)
        return rid

    def expr(self, toks, here_tab):
        """Translate a token list to a charityevals expression."""
        out, i = [], 0
        def ref_id(tab, addr):
            col = re.sub(r"\d", "", addr)
            if tab == a.tab and col == self.col:
                return self.row_of(int(re.sub(r"[A-Z]", "", addr)))
            return self.leaf(tab, addr)
        while i < len(toks):
            k, t = toks[i]
            if k == "fn":
                name = t[:-1].upper()
                # collect arguments up to the matching paren
                depth, j, args, cur = 1, i + 1, [], []
                while depth:
                    kk, tt = toks[j]
                    if kk == "fn" or tt == "(": depth += 1
                    if tt == ")": depth -= 1
                    if depth == 0: break
                    if tt == "," and depth == 1: args.append(cur); cur = []
                    else: cur.append((kk, tt))
                    j += 1
                args.append(cur)
                i = j + 1
                if name == "IF":
                    cond = self.static_cond(args[0], here_tab)
                    if cond is None:
                        out.append(f"if({self.expr(args[0], here_tab)}, {self.expr(args[1], here_tab)}, {self.expr(args[2], here_tab)})")
                    else:
                        out.append("(" + self.expr(args[1] if cond else args[2], here_tab) + ")")
                elif name in ("SUM", "MIN", "MAX", "AVERAGE"):
                    parts = []
                    for arg in args:
                        if len(arg) == 1 and arg[0][0] == "ref":
                            tab, ref = split_ref(arg[0][1], here_tab)
                            parts += [ref_id(tb, ad) for tb, ad in cells_in(tab, ref) if self.nonempty(tb, ad)]
                        else:
                            parts.append(self.expr(arg, here_tab))
                    fn = {"SUM": "sum", "MIN": "min", "MAX": "max", "AVERAGE": "avg"}[name]
                    out.append(f"{fn}({', '.join(parts) or '0'})")
                elif name == "LN": out.append(f"ln({self.expr(args[0], here_tab)})")
                elif name == "EXP": out.append(f"exp({self.expr(args[0], here_tab)})")
                else: raise ValueError(f"unsupported function {name}")
                continue
            if k == "ref":
                tab, ref = split_ref(t, here_tab)
                if ":" in ref: raise ValueError(f"bare range {t}")
                out.append(ref_id(tab, ref))
            elif k == "num":
                out.append(t)
            elif k == "str":
                raise ValueError(f"string in arithmetic: {t}")
            elif t == "&" or t in ("=", "<>", "<", ">", "<=", ">="):
                raise ValueError(f"unsupported operator {t}")
            else:
                out.append(t)
            i += 1
        return " ".join(out).replace("( ", "(").replace(" )", ")").replace(" ,", ",")

    def nonempty(self, tab, addr):
        v = vval(tab, addr)
        return v is not None and not isinstance(v, str)

    def static_cond(self, toks, here_tab):
        """Evaluate IF conditions that compare a cell with a text constant (GiveWell's "-" checks)."""
        ops = [t for k, t in toks if t in ("=", "<>")]
        if len(toks) == 3 and ops and toks[0][0] == "ref" and toks[2][0] == "str":
            tab, ref = split_ref(toks[0][1], here_tab)
            v = vval(tab, ref); s = toks[2][1].strip('"')
            return (v == s) if toks[1][1] == "=" else (v != s)
        return None

    def row_of(self, row):
        key = (a.tab, f"{self.col}{row}")
        if key in self.by_cell: return self.by_cell[key]
        return self.convert(row)

    def convert(self, row):
        addr = f"{self.col}{row}"; key = (a.tab, addr)
        if key in self.by_cell: return self.by_cell[key]
        raw = text(F[a.tab][addr].value)
        lab = label(a.tab, row) or f"Row {row}"
        if not (isinstance(raw, str) and raw.startswith("=")):
            return self.leaf(a.tab, addr)
        self.by_cell[key] = None  # cycle guard
        rid = self.new_id(slug(lab))
        self.by_cell[key] = rid
        formula = self.expr(tokenize(raw[1:]), a.tab)
        # A formula that is only a reference to another tab's cell: keep it as a named calculated row.
        r = {"id": rid, "label": lab, "formula": formula}
        unit = text(F[a.tab][f"F{row}"].value)
        if unit == "%": r["format"] = "percent"
        elif unit == "$": r["format"] = "usd"
        elif unit == "xbenchmark": r["format"] = "multiple"
        v = vval(a.tab, addr)
        if isinstance(v, (int, float)): r["expected"] = v
        if self.section: r["section"] = self.section
        self.rows[rid] = r; self.order.append(rid)
        return rid

    def build(self):
        major = None
        for row in range(4, main.max_row + 1):
            A, C, E = (text(main[f"{x}{row}"].value) for x in ("A", "C", "E"))
            if isinstance(A, str) and A.strip() and not E: major = A.strip()
            if isinstance(C, str) and C.strip() and not E:
                sid = slug(C)
                if sid not in [s["id"] for s in self.sections]:
                    self.sections.append({"id": sid, "title": C.strip()})
                self.section = sid
            v = main[f"{self.col}{row}"].value
            cached = vval(a.tab, f"{self.col}{row}")
            # "-" marks a value GiveWell sets only in the Overall column; formulas pick it up via IF.
            if E and v is not None and row != 4 and not isinstance(cached, str):
                self.convert(row)
        return self

base = Builder(a.base_col).build()

def ordered(b):
    # input rows first within their section, in sheet order; the engine sorts dependencies itself
    return [b.rows[i] for i in b.order]

# Output: GiveWell's units of value per philanthropic dollar, the number its "x benchmark"
# multiple divides by the benchmark. Units of value are the site's common unit.
def is_final(lab):
    lab = lab.lower()
    return lab.startswith("units of value generated per") and "after accounting for all" in lab
final_id = next((i for i in base.order if is_final(base.rows[i]["label"])), None)
if not final_id: sys.exit("no 'Units of value generated per ... after accounting for all adjustments' row found")
extra = []
# GiveWell's uncertainty: the "Confidence intervals" tab gives a 25th and 75th percentile per
# country for the model's key quantities. Each quantity is found in Main CEA (through the Simple
# CEA tab's reference, or by label), checked against GiveWell's best guess, and attached as a
# range: low/high on an input row, `range` on a calculated row.
def ci_ranges(b):
    if "Confidence intervals" not in F.sheetnames: return 0
    ci, civ = F["Confidence intervals"], V["Confidence intervals"]
    k = list(cols).index(b.col)
    lo_col = column_index_from_string("F") + 3 * k
    simple = F["Simple CEA"] if "Simple CEA" in F.sheetnames else None
    simple_rows = {}
    if simple:
        for r in range(1, simple.max_row + 1):
            lab = text(simple[f"E{r}"].value)
            for c in range(6, simple.max_column + 1):
                f = text(simple.cell(r, c).value)
                m = re.match(r"='Main CEA'!\$?[A-Z]+\$?(\d+)$", f) if isinstance(f, str) else None
                if lab and m: simple_rows[str(lab).strip().lower()] = int(m.group(1)); break
    main_rows = {}
    for r in range(1, main.max_row + 1):
        lab = text(main[f"E{r}"].value)
        if isinstance(lab, str): main_rows.setdefault(lab.strip().lower(), r)
    n = 0
    for r in range(5, ci.max_row + 1):
        lab = text(ci[f"E{r}"].value)
        if not isinstance(lab, str): continue
        lo, best, hi = (civ.cell(r, lo_col + i).value for i in range(3))
        if not all(isinstance(x, (int, float)) for x in (lo, best, hi)): continue
        row = simple_rows.get(lab.strip().lower()) or main_rows.get(lab.strip().lower())
        if not row: continue
        rid = b.by_cell.get((a.tab, f"{b.col}{row}"))
        cur = vval(a.tab, f"{b.col}{row}")
        if not rid or not isinstance(cur, (int, float)) or abs(cur - best) > 0.02 * max(abs(best), 1e-12): continue
        if hi < lo: lo, hi = hi, lo
        note = "GiveWell's 25th–75th percentile"
        rr = b.rows[rid]
        if "formula" in rr:
            rr["range"] = {"low": lo, "high": hi, "note": note}
        else:
            rr["value"] = {"low": min(lo, rr["value"]), "best": rr["value"], "high": max(hi, rr["value"])}
            rr["explainer"] = rr.get("explainer", "") + f"\n\nRange: {note}."
        n += 1
    return n

print(f"  ranges: {ci_ranges(base)} quantities with GiveWell percentiles")

# Moral weights: keep GiveWell's numbers, but route them through the shared assumptions so a
# visitor's moral weights move every GiveWell model together. The evaluator view pins them back.
def link_moral_weights(rows):
    for r in rows:
        lab = r["label"].lower()
        if "value" not in r or not lab.startswith("value assigned to"): continue
        v = r.pop("value"); r.pop("kind", None); r.pop("source", None)
        if "ln(consumption)" in lab or "ln by one unit" in lab:
            r["formula"] = "$uov_per_ln_consumption"
        elif "death" in lab:
            r["formula"] = f"{v} * $life_value_multiplier"
        else:
            r["value"] = v; r["kind"] = "estimate"; r["source"] = {"title": "GiveWell moral weights"}; continue
        r["expected"] = v
        r["explainer"] = (f"GiveWell's moral weight: {v:g} units of value. In our model it scales with your moral weights; "
                          "GiveWell's model uses its own value.")
link_moral_weights(base.rows.values())

secs = [s for s in base.sections if any(r.get("section") == s["id"] for r in base.rows.values())]
summary = a.summary or (f"{a.what} A re-implementation of GiveWell's model. GiveWell models {len(cols)} locations; "
                        f"this page shows {cols[a.base_col]}, the median location by cost-effectiveness. The others are listed below.").strip()
model = {
    "id": a.id, "name": a.name, "kind": "charity", "cause": "global-health", "charity": a.charity, "owner": "givewell",
    "summary": summary,
    "source": {"publisher": "GiveWell", "title": a.title, "url": a.page_url, "sheet": a.sheet_url,
               "published": a.published, "retrieved": "2026-10-26", "license": "CC BY-NC-SA 3.0 US"},
    "sections": secs,
    "rows": ordered(base) + extra,
    "output": {"row": final_id, "unit": "uov", "label": "Units of value per dollar"},
    "evaluator": {"name": "GiveWell", "assumptions": {"count_salary_sacrifice": 0, "full_credit": 0,
                                                      "life_value_multiplier": 1, "uov_per_ln_consumption": 1.4426950408889634}},
}
# Shared rule, also applied by convert-givewell.py: a sheet's explicit discount-rate input moves in
# proportion to the shared $discount_rate (GiveWell's general rate is 4%), so a 0.5% rate for future
# deaths stays 0.5% at the default, becomes 0 at 0% and 1% at 8%.
GW_RATE = 0.04
def link_discount(rows, ev):
    n = 0
    for r in rows:
        if isinstance(r.get("value"), (int, float)) and re.match(r"(annual )?discount rate", r.get("label", ""), re.I) and 0 <= r["value"] <= 0.15:
            v = r.pop("value"); r.pop("kind", None)
            r["formula"] = "$discount_rate" if v == GW_RATE else f"{v!r} * $discount_rate / {GW_RATE}"
            r["expected"] = v
            r["explainer"] = (f"GiveWell's {v:.1%} here, scaled with the shared discount rate (GiveWell's general rate is 4%)."
                              + ("\n\n" + r["explainer"] if r.get("explainer") else ""))
            n += 1
    if n: ev["discount_rate"] = GW_RATE
    return n

link_discount(model["rows"], model["evaluator"]["assumptions"])

out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
# the charity record: created if missing, its contact details updated from the arguments
cpath = Path("charities") / f"{a.charity}.json"
crec = json.loads(cpath.read_text()) if cpath.exists() else {"id": a.charity, "name": a.org or a.name, "cause": "global-health"}
crec.update({k: v for k, v in {"website": a.website, "donate": a.donate, "donate_via": a.donate_via}.items() if v})
cpath.write_text(json.dumps(crec, indent=2, ensure_ascii=False) + "\n")
# carry over resources collected earlier (scripts/import-resources.sh), so a re-import keeps them
_prev = out / f"{a.id}.json"
if _prev.exists(): model["resources"] = json.loads(_prev.read_text()).get("resources", [])
(out / f"{a.id}.json").write_text(json.dumps(model, indent=2, ensure_ascii=False) + "\n")
print(f"{a.id}: {len(model['rows'])} rows, {sum('expected' in r for r in model['rows'])} expected")

# Variants: same structure, other columns; keep only rows that differ.
for col, name in cols.items():
    if col == a.base_col: continue
    try:
        b = Builder(col).build()
        ci_ranges(b)
        link_moral_weights(b.rows.values())
    except Exception as e:
        print(f"  skip {name} ({col}): {e}"); continue
    base_by_label = {}
    for r in base.rows.values(): base_by_label.setdefault(r["label"].replace(f" ({name})", ""), r)
    patches = []
    # map variant rows onto base ids by sheet cell row (same row number = same meaning)
    def rowkey(bld, rid):
        for (tab, addr), i in bld.by_cell.items():
            if i == rid: return (tab, re.sub(r"[A-Z]", "", addr), re.sub(r"\d", "", addr) == bld.col)
    base_index = {rowkey(base, rid): rid for rid in base.order}
    # Rows this column has that the base column lacks are added to the variant; give them ids
    # that can't collide with the base model's.
    base_ids = set(base.rows)
    rename = {}
    for rid in b.order:
        bid = base_index.get(rowkey(b, rid))
        if bid: rename[rid] = bid
        else: rename[rid] = rid if rid not in base_ids else f"{rid}_{col.lower()}"
    def remap(f):
        return re.sub(r"\b[a-z][a-z0-9_]*\b", lambda m: rename.get(m.group(), m.group()) if m.group() in b.rows else m.group(), f)
    added = 0
    for rid in b.order:
        r = b.rows[rid]; bid = base_index.get(rowkey(b, rid))
        if not bid:
            nr = dict(r, id=rename[rid])
            if "formula" in nr: nr["formula"] = remap(nr["formula"])
            patches.append(nr); added += 1
            continue
        br = base.rows[bid]
        patch = {"id": bid}
        if "formula" in r:
            f = remap(r["formula"])
            if f != br.get("formula"): patch["formula"] = f
            if "expected" in r: patch["expected"] = r["expected"]
            if "range" in r: patch["range"] = r["range"]
        elif r.get("value") != br.get("value"):
            patch["value"] = r["value"]
            if r.get("source") != br.get("source"): patch["source"] = r["source"]
        if len(patch) > 1: patches.append(patch)
    vid = f"{a.id}-{slug(name.replace('(', ' ').replace(')', ' ')).replace('_', '-')}"
    variant = {"id": vid, "name": f"{a.name} ({name})", "kind": "variant", "cause": "global-health", "extends": a.id,
               "summary": f"The same GiveWell model with its {name} column.", "rows": patches}
    (out / f"{vid}.json").write_text(json.dumps(variant, indent=2, ensure_ascii=False) + "\n")
    print(f"  {vid}: {len(patches)} overrides{f', {added} added rows' if added else ''}")
