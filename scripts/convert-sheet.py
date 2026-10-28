"""Convert any cost-effectiveness spreadsheet into a charityevals model by tracing the bottom line.

Starting from the bottom-line cell, the converter walks every cell it depends on, across tabs. A
constant becomes an input row; a formula becomes a formula row over other rows, with the sheet's
own result as `expected`. The engine then has to reproduce every intermediate number, which is the
proof the import is faithful.

Formulas the engine can't express (lookups such as INDEX/MATCH/FILTER, text, IMPORTRANGE) are kept
as fixed inputs with the original formula in the explainer, so nothing is silently dropped. The
same happens when a translated formula doesn't reproduce the sheet's value.

    python3 scripts/convert-sheet.py sheet.xlsx --spec spec.json

The spec (one JSON object, or a list of them for several models from one sheet) says what to build:
    {"id": "...", "name": "...", "charity": "...", "owner": "givewell", "cause": "global-health",
     "cell": "'Main CEA'!H52"            # optional: bottom-line cell; otherwise found by label
     "bottom": "xcash" | "uov" | "uov_per:<n>" | "wellby_per:<n>" | "usd_per_daly" | "native", "unit": "...", "label": "...",
     "source": {...}, "summary": "...", "resources": [...], "evaluator": {...}}
"""
import argparse, json, math, re, sys
from pathlib import Path
import openpyxl
from openpyxl.formula.tokenizer import Tokenizer, Token
from openpyxl.utils import column_index_from_string, get_column_letter, range_boundaries

# GiveWell's value of a dollar given to GiveDirectly, in units of value. Multiples of cash ("x cash")
# convert to units of value through it.
CASH_UOV = 0.00335
MAX_ROWS = 15000

LIST_FNS = {"SUM", "AVERAGE", "MIN", "MAX", "PRODUCT", "MEDIAN", "GEOMEAN", "AND", "OR"}
SIMPLE = {"LN": "ln", "LOG10": "log10", "EXP": "exp", "ABS": "abs", "SQRT": "sqrt", "IF": "if", "IFERROR": "iferror",
          "NOT": "not", "ROUND": "round", "ROUNDUP": "roundup", "ROUNDDOWN": "rounddown", "PV": "pv"}

class Unsupported(Exception):
    pass


def slug(s, n=60):
    s = str(s).lower().replace("&", " and ")
    s = re.sub(r"[àáâãäå]", "a", s); s = re.sub(r"[èéêë]", "e", s); s = re.sub(r"[ìíîï]", "i", s)
    s = re.sub(r"[òóôõö]", "o", s); s = re.sub(r"[ùúûü]", "u", s); s = re.sub(r"[ç]", "c", s); s = re.sub(r"[ñ]", "n", s)
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")[:n].strip("_")
    return s if s and s[0].isalpha() else ("r_" + s if s else "row")


def num(v):
    if isinstance(v, bool): return 1.0 if v else 0.0
    if isinstance(v, (int, float)) and math.isfinite(v): return float(v)
    return None


def without_styles(path):
    """A copy of the workbook without cell styles, filters, conditional formats and validations. Some
    Google exports contain ones openpyxl refuses to load; none of them affect values or formulas."""
    import tempfile, zipfile
    tmp = tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False).name
    with zipfile.ZipFile(path) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename.startswith("xl/worksheets/sheet"):
                data = re.sub(rb'(<c [^>]*?) s="\d+"', rb"\1", data)
                for tag in (rb"autoFilter", rb"conditionalFormatting", rb"dataValidations", rb"extLst"):
                    data = re.sub(rb"<" + tag + rb"\b[^>]*/>|<" + tag + rb"\b.*?</" + tag + rb">", b"", data, flags=re.S)
            zout.writestr(item, data)
    return tmp


# Columns GiveWell's sheets keep between a row's description and its values: the row's type...
MARKER = re.compile(r"^(input|inputs|calc|calculation|output|feed|supp|main|val|number|-|n/a|#|x|tbd|source|note|notes)$", re.I)
# ...and its unit, which becomes the row's `unit` rather than its label.
UNIT = re.compile(r"^(%|\$|₦|£|€|usd|ppt|pp|uov|uov ?/ ?\$|uov per \$|xcash|x cash|x benchmark|years?|people|persons?|children|deaths?|"
                  r"ratio|rate|count|days?|weeks?|months?|kg|g|mg|km|hours?|per \$?[\d,.]+ ?[km]?|per (person|child|year|capita))$", re.I)
SHEET_ERROR = re.compile(r"^#(value|ref|n/a|div/0|name|num|null|error)[!?]?$", re.I)


class Sheet:
    def __init__(self, path):
        try:
            self.F = openpyxl.load_workbook(path)
        except (ValueError, IndexError):
            path = without_styles(path)
            self.F = openpyxl.load_workbook(path)
        self.V = openpyxl.load_workbook(path, data_only=True)
        self.names = {}
        try:
            for n, d in self.F.defined_names.items():
                self.names[n.upper()] = d.attr_text
        except AttributeError:
            for d in self.F.defined_names.definedName:
                self.names[d.name.upper()] = d.attr_text

    def ws(self, name):
        return self.F[name], self.V[name]

    def raw(self, sh, c):
        v = self.F[sh][c].value
        return getattr(v, "text", v)

    def val(self, sh, c):
        return self.V[sh][c].value

    def cell_text(self, sh, r, c, depth=0):
        """A cell's value. A label Google computed with its own functions exports as #NAME?: then the
        text Google cached as the IFERROR fallback, or the label it points at (HYPERLINK(url, label) or a
        plain reference to another label cell)."""
        v = self.V[sh].cell(r, c).value
        if not (isinstance(v, str) and SHEET_ERROR.match(v.strip())) or depth > 4:
            return v
        raw = self.F[sh].cell(r, c).value
        raw = getattr(raw, "text", raw)
        if not isinstance(raw, str): return None
        m = re.search(r',\s*"((?:[^"]|"")*)"\s*\)\s*$', raw)
        if m: return m.group(1).replace('""', '"')
        m = re.search(r"HYPERLINK\(.*,\s*((?:'[^']+'|[A-Za-z0-9_ ]+)!\$?[A-Z]{1,3}\$?\d+|\$?[A-Z]{1,3}\$?\d+)\s*\)\s*$", raw, re.I) \
            or re.fullmatch(r"=\s*((?:'[^']+'|[A-Za-z0-9_ ]+)!\$?[A-Z]{1,3}\$?\d+|\$?[A-Z]{1,3}\$?\d+)\s*", raw)
        if m:
            tab, ref = parse_ref(m.group(1), sh)
            if tab in self.F.sheetnames:
                cc, rr, _, _ = range_boundaries(ref)
                return self.cell_text(tab, rr, cc, depth + 1)
        return None

    def title_above(self, sh, r, col, limit=40):
        """The nearest heading above a cell in its column: text of three words or more on a row with no
        numbers (a value in a list, like a country name next to its data, isn't a heading)."""
        ws = self.V[sh]
        for rr in range(r - 1, max(0, r - limit), -1):
            v = ws.cell(rr, col).value
            if isinstance(v, str) and len(v.split()) >= 3 and not v.startswith("=") and not re.match(r"\s*(source|sources|note|notes)\b", v, re.I) \
                    and not self.numeric_cols(sh, rr):
                return re.sub(r"\s+", " ", v).strip()[:90]
        return None

    def text_above(self, sh, r, col, limit=60):
        ws = self.V[sh]
        for rr in range(r - 1, max(0, r - limit), -1):
            v = ws.cell(rr, col).value
            if isinstance(v, str) and v.strip() and len(v) < 80 and not MARKER.match(v.strip()) and not UNIT.match(v.strip()):
                return re.sub(r"\s+", " ", v).strip()
        return None

    def note_right(self, sh, r, col):
        ws = self.V[sh]; out = []
        for cc in range(col + 1, min(ws.max_column, col + 8) + 1):
            v = ws.cell(r, cc).value
            if isinstance(v, str) and len(v.strip()) > 3: out.append(v.strip())
        c = self.F[sh].cell(r, col).comment
        if c and c.text: out.append(c.text.strip())
        return " ".join(out)[:900]

    def numeric_cols(self, sh, r):
        ws = self.V[sh]
        return [cc for cc in range(1, ws.max_column + 1) if num(ws.cell(r, cc).value) is not None]


def parse_ref(ref, cur):
    """'Sheet name'!A1:B2 or A1 -> (sheet, 'A1:B2')."""
    ref = ref.replace("$", "")
    if "!" in ref:
        sh, rng = ref.rsplit("!", 1)
        sh = sh.strip("'").replace("''", "'")
    else:
        sh, rng = cur, ref
    return sh, rng.upper()


class Converter:
    def __init__(self, book, sheet_url):
        self.b = book; self.url = sheet_url
        self.rows = {}        # (sheet, coord) -> row dict
        self.order = []
        self.ids = set()
        self.sections = {}
        self.frozen = 0; self.translated = 0

    def section_for(self, sh):
        if sh not in self.sections: self.sections[sh] = slug(sh, 40) or "sheet"
        return self.sections[sh]

    def label_for(self, sh, r, col):
        """A readable label and unit for a cell, from its row and table.

        The label zone is the run of text to the left of the value, back to the last number before
        it (years count as text: they're keys in data tables). Type and unit columns are set aside;
        the nearest descriptive text (three words or more) is the label. A row with no description,
        like a record in a data table, is labelled by its key fields joined, with the table's title
        in front. A column header is added when the row has values in several columns."""
        ws = self.b.V[sh]
        zone, started = [], False
        for c in range(col - 1, 0, -1):
            v = self.b.cell_text(sh, r, c)
            if isinstance(v, (int, float)) and not isinstance(v, bool) and float(v).is_integer() and 1900 <= v <= 2100:
                v = str(int(v))
            if isinstance(v, str):
                t = re.sub(r"\s+", " ", v).strip()
                # "-" and "n/a" are empty cells in other columns, not part of the label.
                if t and t not in ("-", "–", "n/a", "N/A") and not t.startswith("="): zone.append((c, t)); started = True
            elif num(v) is not None and started:
                break
        zone.reverse()
        units = [t for _, t in zone if UNIT.match(t)]
        desc = [(c, t) for c, t in zone if not MARKER.match(t) and not UNIT.match(t)]
        long = [(c, t) for c, t in desc if len(t.split()) >= 3 or len(t) >= 24]
        if long:
            lab = long[-1][1]
        elif desc:
            lab = ", ".join(t for _, t in desc[-6:])
            title = self.b.title_above(sh, r, desc[0][0])
            if title and title.lower() not in lab.lower(): lab = f"{title}: {lab}"
        else:
            # Nothing in the row: name the cell by the table it sits in and its column.
            parts = [p for p in (self.b.title_above(sh, r, col), self.b.text_above(sh, r, col)) if p]
            lab = " – ".join(dict.fromkeys(parts)) or f"Cell {get_column_letter(col)}{r} on {sh}"
            if parts: return f"{lab} (row {r})"[:160], (units[0] if units else None)
        if len(self.b.numeric_cols(sh, r)) > 1:
            head = self.b.text_above(sh, r, col)  # e.g. the location a column is about
            if head and head.lower() not in lab.lower(): lab = f"{lab} ({head})"
        return lab[:160], (units[0] if units else None)

    def new_id(self, label):
        base = slug(label); i = base; k = 2
        while i in self.ids: i = f"{base}_{k}"; k += 1
        self.ids.add(i); return i

    # -- formula translation -------------------------------------------------------------
    def cell_ref(self, sh, coord):
        """Row id for a single cell, creating the row (and its precedents) if needed. Empty cells are 0."""
        key = (sh, coord)
        if key in self.rows: return self.rows[key]["id"]
        if sh not in self.b.F.sheetnames: raise Unsupported(f"unknown tab {sh}")
        raw = self.b.raw(sh, coord); v = self.b.val(sh, coord)
        if raw is None and v is None: return None
        return self.visit(sh, coord)["id"]

    def grid(self, sh, rng):
        """A range's bounds, with whole columns or rows cut to the tab's used area (for lookups)."""
        if sh not in self.b.F.sheetnames: raise Unsupported(f"unknown tab {sh}")
        ws = self.b.V[sh]
        if ":" not in rng:
            c1, r1, _, _ = range_boundaries(rng); return c1, r1, c1, r1
        c1, r1, c2, r2 = range_boundaries(rng)
        return c1 or 1, r1 or 1, c2 or ws.max_column, r2 or ws.max_row

    def static(self, node):
        """The value of a lookup key: a literal, or a cell's value as the sheet has it."""
        if node[0] in ("str", "num"): return node[1]
        if node[0] == "range" and ":" not in node[2]: return self.b.val(node[1], node[2])
        low = self.lower(node)
        if low[0] == "num": return low[1]
        raise Unsupported("lookup key isn't fixed")

    def lookup(self, name, args):
        """MATCH and INDEX with fixed keys resolve to the cell they point at, keeping the dependency."""
        if name == "MATCH":
            if len(args) > 2 and not (args[2][0] == "num" and args[2][1] == 0): raise Unsupported("MATCH that isn't exact")
            if args[1][0] != "range": raise Unsupported("MATCH over an expression")
            key = self.static(args[0]); sh = args[1][1]
            c1, r1, c2, r2 = self.grid(sh, args[1][2])
            cells = [(c, r) for r in range(r1, r2 + 1) for c in range(c1, c2 + 1)]
            norm = lambda v: v.strip().lower() if isinstance(v, str) else num(v)
            for i, (c, r) in enumerate(cells):
                if norm(self.b.val(sh, f"{get_column_letter(c)}{r}")) == norm(key): return ("num", float(i + 1))
            raise Unsupported("MATCH finds nothing")
        if name == "FILTER":
            # FILTER(values, keys1 = k1, keys2 = k2, ...) used as a lookup: exactly one row may match.
            if args[0][0] != "range": raise Unsupported("FILTER over an expression")
            sh = args[0][1]; c1, r1, c2, r2 = self.grid(sh, args[0][2])
            if c1 != c2: raise Unsupported("FILTER returning several columns")
            conds = []
            for a in args[1:]:
                if not (a[0] == "bin" and a[1] == "=" and a[2][0] == "range"): raise Unsupported("FILTER condition isn't range = key")
                kc1, kr1, kc2, kr2 = self.grid(a[2][1], a[2][2])
                if kc1 != kc2 or kr2 - kr1 != r2 - r1: raise Unsupported("FILTER ranges differ")
                conds.append((a[2][1], kc1, kr1, self.static(a[3])))
            norm = lambda v: v.strip().lower() if isinstance(v, str) else num(v)
            hits = [i for i in range(r2 - r1 + 1)
                    if all(norm(self.b.val(ksh, f"{get_column_letter(kc)}{kr + i}")) == norm(key) for ksh, kc, kr, key in conds)]
            if len(hits) != 1: raise Unsupported(f"FILTER matches {len(hits)} rows")
            return ("cell", sh, f"{get_column_letter(c1)}{r1 + hits[0]}")
        if args[0][0] != "range": raise Unsupported("INDEX over an expression")
        sh = args[0][1]; c1, r1, c2, r2 = self.grid(sh, args[0][2])
        pos = []
        for a in args[1:3]:
            if a[0] == "empty": pos.append(0); continue
            v = self.lower(a) if a[0] != "num" else a
            if v[0] != "num": raise Unsupported("INDEX position isn't fixed")
            pos.append(int(v[1]))
        while len(pos) < 2: pos.append(0)
        r, c = pos
        if c2 == c1 and r == 0 and c > 0: r, c = c, 0  # single column: one position is the row
        if r2 == r1 and r > 0 and c == 0 and c2 > c1: r, c = 1, r  # single row: one position is the column
        r, c = r or 1, c or 1
        if r1 + r - 1 > r2 or c1 + c - 1 > c2: raise Unsupported("INDEX outside its range")
        return ("cell", sh, f"{get_column_letter(c1 + c - 1)}{r1 + r - 1}")

    def range_cells(self, sh, rng):
        if ":" not in rng: return [(sh, rng)]
        c1, r1, c2, r2 = range_boundaries(rng)
        if None in (c1, r1, c2, r2): raise Unsupported("whole-column range")
        if (c2 - c1 + 1) * (r2 - r1 + 1) > 400: raise Unsupported("range too large")
        return [(sh, f"{get_column_letter(c)}{r}") for r in range(r1, r2 + 1) for c in range(c1, c2 + 1)]

    def visit(self, sh, coord):
        key = (sh, coord)
        if key in self.rows: return self.rows[key]
        if len(self.rows) >= MAX_ROWS: raise Unsupported("row limit")
        ws = self.b.F[sh]; cell = ws[coord]; r, col = cell.row, cell.column
        label, unit = self.label_for(sh, r, col)
        row = {"id": self.new_id(label), "label": label, "section": self.section_for(sh)}
        if unit: row["unit"] = unit
        self.rows[key] = row  # registered first so cycles terminate
        raw = self.b.raw(sh, coord); v = num(self.b.val(sh, coord))
        cellname = f"{sh}!{coord}"
        note = self.b.note_right(sh, r, col)
        if isinstance(raw, str) and raw.startswith("="):
            raw = unwrap_google(raw)
            try:
                lowered = self.lower(self.parse(raw[1:], sh))
                expr = self.render(lowered, 0)
                got = ev(lowered, self)
                if v is None: raise Unsupported("no numeric result in the sheet")
                if got is None or not close(got, v): raise Unsupported(f"translation gives {got}, sheet has {v}")
                row.update({"formula": expr, "expected": v})
                self.translated += 1
            except (Unsupported, ZeroDivisionError, OverflowError, ValueError, RecursionError) as e:
                if v is None: v = 0.0
                for k in ("formula", "expected"): row.pop(k, None)
                row.update({"value": v, "kind": "estimate", "source": {"title": "Source spreadsheet", "url": self.url, "cell": cellname},
                            "explainer": f"Calculated in the source sheet as `={raw[1:][:400]}`; kept as a fixed number here ({short(e)})."
                                         + (f"\n\n{note}" if note else "")})
                self.frozen += 1
        else:
            if v is None: v = 0.0
            row.update({"value": v, "kind": "estimate", "source": {"title": "Source spreadsheet", "url": self.url, "cell": cellname}})
            if note: row["explainer"] = note
        fmt = number_format(self.b.F[sh][coord].number_format)
        if fmt: row["format"] = fmt
        self.order.append(key)
        return row

    def parse(self, src, sh):
        toks = [t for t in Tokenizer("=" + src).items if t.type != Token.WSPACE]
        p = [0]
        def peek(): return toks[p[0]] if p[0] < len(toks) else None
        def nxt(): t = peek(); p[0] += 1; return t
        PREC = {"=": 0, "<>": 0, "<": 0, ">": 0, "<=": 0, ">=": 0, "+": 1, "-": 1, "*": 2, "/": 2, "^": 4}
        def primary():
            t = nxt()
            if t is None: raise Unsupported("unexpected end")
            if t.type == Token.OP_PRE:
                a = expr(3)
                return ("neg", a) if t.value == "-" else a
            if t.type == Token.PAREN and t.subtype == Token.OPEN:
                e = expr(0); c = nxt()
                if not c or c.type != Token.PAREN: raise Unsupported("paren")
                return e
            if t.type == Token.FUNC and t.subtype == Token.OPEN:
                name = t.value[:-1].upper().replace("_XLFN.", "").replace("_XLWS.", "")
                args = []
                if not (peek() and peek().type == Token.FUNC and peek().subtype == Token.CLOSE):
                    while True:
                        nx = peek()
                        if nx and ((nx.type == Token.SEP and nx.subtype == Token.ARG) or (nx.type == Token.FUNC and nx.subtype == Token.CLOSE)):
                            args.append(("empty",))  # an omitted argument, as in INDEX(range,,col)
                        else:
                            args.append(expr(0))
                        s = peek()
                        if s and s.type == Token.SEP and s.subtype == Token.ARG: p[0] += 1; continue
                        break
                c = nxt()
                if not c or c.type != Token.FUNC: raise Unsupported("func close")
                return ("call", name, args)
            if t.type == Token.OPERAND:
                if t.subtype == Token.NUMBER: return ("num", float(t.value))
                if t.subtype == Token.LOGICAL: return ("num", 1.0 if t.value.upper() == "TRUE" else 0.0)
                if t.subtype == Token.TEXT: return ("str", t.value[1:-1].replace('""', '"'))
                if t.subtype == Token.RANGE:
                    v = t.value
                    if v.upper() in self.b.names: v = self.b.names[v.upper()]
                    if v.upper() in ("TRUE", "FALSE"): return ("num", 1.0 if v.upper() == "TRUE" else 0.0)
                    s2, rng = parse_ref(v, sh)
                    if not re.fullmatch(r"[A-Z]{1,3}\d+(:[A-Z]{1,3}\d+)?|[A-Z]{1,3}:[A-Z]{1,3}|\d+:\d+", rng): raise Unsupported(f"reference {v}")
                    return ("range", s2, rng)
                raise Unsupported(f"{t.subtype.lower()} operand")
            raise Unsupported(f"token {t.value}")
        def expr(minp):
            left = primary()
            while True:
                t = peek()
                if t and t.type == Token.OP_POST and t.value == "%": p[0] += 1; left = ("bin", "/", left, ("num", 100.0)); continue
                if not t or t.type != Token.OP_IN or t.value not in PREC: break
                pr = PREC[t.value]
                if pr < minp: break
                p[0] += 1
                right = expr(pr if t.value == "^" else pr + 1)
                left = ("bin", t.value, left, right)
            if peek() and peek().type == Token.OP_IN and peek().value not in PREC: raise Unsupported(f"operator {peek().value}")
            return left
        e = expr(0)
        if p[0] < len(toks): raise Unsupported("trailing tokens")
        return e

    def items(self, node):
        """Flatten a function argument into a list of scalar nodes (ranges expand, empty cells drop)."""
        if node[0] == "range":
            out = []
            for s, c in self.range_cells(node[1], node[2]):
                if num(self.b.val(s, c)) is None and not (isinstance(self.b.raw(s, c), str) and str(self.b.raw(s, c)).startswith("=")): continue
                if num(self.b.val(s, c)) is None: continue
                out.append(("cell", s, c))
            return out
        return [node]

    def scalar(self, node):
        if node[0] == "range":
            cells = self.range_cells(node[1], node[2])
            if len(cells) != 1: raise Unsupported("range used as a number")
            return ("cell", *cells[0])
        return node

    def lower(self, node):
        """Rewrite spreadsheet calls into engine calls over scalar nodes."""
        k = node[0]
        if k == "num" or k == "cell": return node
        if k in ("str", "empty"): raise Unsupported("text in arithmetic")
        if k == "range": return self.lower(self.scalar(node))
        if k == "neg": return ("neg", self.lower(node[1]))
        if k == "bin": return ("bin", node[1], self.lower(node[2]), self.lower(node[3]))
        name, args = node[1], node[2]
        if name in LIST_FNS:
            flat = [self.lower(x) for a in args for x in self.items(a)]
            if not flat: raise Unsupported(f"{name} of nothing")
            if name == "GEOMEAN": return ("fn", "exp", [("fn", "avg", [("fn", "ln", [x]) for x in flat])])
            return ("fn", {"AVERAGE": "avg"}.get(name, name.lower()), flat)
        if name == "SUMPRODUCT":
            lists = []
            for a in args:
                if a[0] != "range": raise Unsupported("SUMPRODUCT of an expression")
                lists.append(self.range_cells(a[1], a[2]))
            if len({len(l) for l in lists}) != 1: raise Unsupported("SUMPRODUCT ranges differ in size")
            terms = []
            for cells in zip(*lists):
                if any(num(self.b.val(s, c)) is None for s, c in cells): continue
                t = ("cell", *cells[0])
                for x in cells[1:]: t = ("bin", "*", t, ("cell", *x))
                terms.append(t)
            return ("fn", "sum", terms) if terms else ("num", 0.0)
        if name == "AVERAGE.WEIGHTED":
            # Google Sheets: AVERAGE.WEIGHTED(values, weights, [more values, more weights, ...])
            if len(args) % 2: raise Unsupported("AVERAGE.WEIGHTED with an odd number of arguments")
            terms, weights = [], []
            for va, wa in zip(args[0::2], args[1::2]):
                vs = self.range_cells(va[1], va[2]) if va[0] == "range" else None
                ws_ = self.range_cells(wa[1], wa[2]) if wa[0] == "range" else None
                if vs is None or ws_ is None:
                    v, w = self.lower(self.scalar(va)), self.lower(self.scalar(wa))
                    terms.append(("bin", "*", v, w)); weights.append(w); continue
                if len(vs) != len(ws_): raise Unsupported("AVERAGE.WEIGHTED ranges differ in size")
                for vc, wc in zip(vs, ws_):
                    if num(self.b.val(*vc)) is None or num(self.b.val(*wc)) is None: continue
                    terms.append(("bin", "*", ("cell", *vc), ("cell", *wc))); weights.append(("cell", *wc))
            if not terms: raise Unsupported("AVERAGE.WEIGHTED of nothing")
            return ("bin", "/", ("fn", "sum", terms), ("fn", "sum", weights))
        if name == "POWER" and len(args) == 2: return ("bin", "^", self.lower(args[0]), self.lower(args[1]))
        if name == "IFERROR" and len(args) == 1: args = [args[0], ("num", 0.0)]
        if name == "IF" and len(args) == 2: args = [*args, ("num", 0.0)]
        if name in ("MATCH", "INDEX", "FILTER"): return self.lookup(name, args)
        if name in SIMPLE: return ("fn", SIMPLE[name], [self.lower(self.scalar(a)) for a in args])
        raise Unsupported(f"{name}()")

    def render(self, n, parent):
        k = n[0]
        if k == "num": return fmtnum(n[1])
        if k == "cell":
            i = self.cell_ref(n[1], n[2])
            return i if i else "0"
        if k == "neg": return f"-{self.render(n[1], 3)}"
        if k == "fn": return f"{n[1]}({', '.join(self.render(a, 0) for a in n[2])})"
        op = n[1]; pr = {"=": 0, "<>": 0, "<": 0, ">": 0, "<=": 0, ">=": 0, "+": 1, "-": 1, "*": 2, "/": 2, "^": 4}[op]
        l = self.render(n[2], pr); r = self.render(n[3], pr + (0 if op == "^" else 1))
        s = f"{l} {op} {r}"
        return f"({s})" if pr < parent else s

    def value_of(self, sh, c):
        v = num(self.b.val(sh, c))
        return 0.0 if v is None else v


def ev(n, cv):
    k = n[0]
    if k == "num": return n[1]
    if k == "cell": return cv.value_of(n[1], n[2])
    if k == "neg": return -ev(n[1], cv)
    if k == "fn":
        a = [ev(x, cv) for x in n[2]]; f = n[1]
        if f == "sum": return sum(a)
        if f == "avg": return sum(a) / len(a)
        if f == "min": return min(a)
        if f == "max": return max(a)
        if f == "product": return math.prod(a)
        if f == "median": s = sorted(a); m = len(s) // 2; return s[m] if len(s) % 2 else (s[m - 1] + s[m]) / 2
        if f == "ln": return math.log(a[0])
        if f == "log10": return math.log10(a[0])
        if f == "exp": return math.exp(a[0])
        if f == "abs": return abs(a[0])
        if f == "sqrt": return math.sqrt(a[0])
        if f == "if": return a[1] if a[0] else a[2]
        if f == "iferror": return a[0] if math.isfinite(a[0]) else a[1]
        if f == "and": return 1.0 if all(a) else 0.0
        if f == "or": return 1.0 if any(a) else 0.0
        if f == "not": return 0.0 if a[0] else 1.0
        if f in ("round", "roundup", "rounddown"):
            d = a[1] if len(a) > 1 else 0; k10 = 10 ** d; x = abs(a[0]) * k10
            g = {"round": lambda y: math.floor(y + 0.5), "roundup": math.ceil, "rounddown": math.trunc}[f]
            return math.copysign(g(float(f"{x:.15g}")) / k10, a[0])
        if f == "pv":
            rate, per, pmt = a[:3]; fv = a[3] if len(a) > 3 else 0; typ = a[4] if len(a) > 4 else 0
            if rate == 0: return -(pmt * per + fv)
            g = (1 + rate) ** per
            return -(pmt * (1 + rate * typ) * (g - 1) / rate + fv) / g
        raise Unsupported(f)
    op = n[1]; l = ev(n[2], cv); r = ev(n[3], cv)
    if op == "+": return l + r
    if op == "-": return l - r
    if op == "*": return l * r
    if op == "/": return l / r if r != 0 else (math.inf if l else math.nan)
    if op == "^": return l ** r
    return float({"=": l == r, "<>": l != r, "<": l < r, ">": l > r, "<=": l <= r, ">=": l >= r}[op])


def unwrap_google(raw):
    """Google Sheets exports its own functions as IFERROR(__xludf.DUMMYFUNCTION("formula"), cached)."""
    m = re.fullmatch(r'=IFERROR\(__xludf\.DUMMYFUNCTION\("((?:[^"]|"")*)"\),.*\)', raw.strip(), re.S)
    return "=" + m.group(1).replace('""', '"') if m else raw


def close(a, b):
    return math.isfinite(a) and abs(a - b) <= 1e-6 * max(1.0, abs(b))


def fmtnum(x):
    return str(int(x)) if x == int(x) and abs(x) < 1e15 else repr(x)


def short(e):
    s = str(e)
    return s if len(s) < 80 else s[:77] + "..."


def number_format(f):
    f = f or ""
    if "%" in f: return "percent"
    if "$" in f: return "usd"
    return None


XCASH = re.compile(r"multiples? of|x ?cash|\bxcash\b|times (as cost.?effective as )?(cash|givedirectly)|x benchmark|givedirectly'?s (unconditional )?cash|cost.?effectiveness", re.I)
UOV = re.compile(r"units? of value (generated )?per (philanthropic )?(dollar|\$)|value per dollar", re.I)
FINAL = re.compile(r"final cost.?effectiveness|final estimate", re.I)
AFTER = re.compile(r"after (all )?(adjustments|accounting for (all|leverage|funging))|overall cost.?effectiveness|total cost.?effectiveness|after leverage|after funging", re.I)
SKIP = re.compile(r"\bonly\b|before|\bif\b|gap|p\(|threshold|% change|percent|from (mortality|development|income|morbidity|deaths|value of information)|per (child|person|beneficiary|death|treatment)|comparison|bar\b|lower bound|upper bound|\(low|\(high|25th|75th|pessimistic|optimistic", re.I)


def find_bottom(b):
    """The sheet's headline number. A cell labelled as the final estimate wins; otherwise one labelled as
    after all adjustments; otherwise the lowest multiple-of-cash row in the first tab that has one; failing
    all of those, units of value per dollar the same way. Rows that are partial ('only', 'before', 'if')
    don't count."""
    found = []
    for t, sh in enumerate(b.F.sheetnames):
        ws = b.V[sh]
        for row in ws.iter_rows(max_row=min(ws.max_row, 600), max_col=min(ws.max_column, 40)):
            for c in row:
                if not (isinstance(c.value, str) and 3 < len(c.value) < 220): continue
                lab = c.value
                if SKIP.search(lab): continue
                kind = "xcash" if XCASH.search(lab) and not UOV.search(lab) else "uov" if UOV.search(lab) else None
                if not kind: continue
                for cc in range(c.column + 1, min(ws.max_column, c.column + 12) + 1):
                    v = num(ws.cell(c.row, cc).value)
                    if v is None: continue
                    if str(b.F[sh].cell(c.row, cc).value or "").startswith("=") or "pulled" in lab.lower():
                        ok = 0.05 <= v <= 500 if kind == "xcash" else 1e-4 <= v <= 2
                        if ok: found.append((kind, t, c.row, sh, f"{get_column_letter(cc)}{c.row}", lab))
                    break
    if not found: return None
    def pick(cands):
        first_tab = min(x[1] for x in cands)
        return max((x for x in cands if x[1] == first_tab), key=lambda x: x[2])
    for test in (lambda x: FINAL.search(x[5]), lambda x: AFTER.search(x[5]) and x[0] == "xcash"):
        hit = [x for x in found if test(x)]
        if hit:
            x = min(hit, key=lambda x: (x[1], x[2]))
            return x[0], x[3], x[4]
    for kind in ("xcash", "uov"):
        hit = [x for x in found if x[0] == kind]
        if hit:
            x = pick(hit); return x[0], x[3], x[4]
    return None


def build(book, spec):
    url = spec["source"].get("sheet") or spec["source"]["url"]
    conv = Converter(book, url)
    if spec.get("cell"):
        sh, coord = parse_ref(spec["cell"], book.F.sheetnames[0]); kind = spec.get("bottom", "native")
        if sh not in book.F.sheetnames:  # tab names in hand-written specs may be cut short
            sh = next(n for n in book.F.sheetnames if n.startswith(sh))
    else:
        found = find_bottom(book)
        if not found: raise SystemExit(f"{spec['id']}: no bottom line found; pass a cell")
        kind, sh, coord = found
        kind = spec.get("bottom", kind)
    bottom = conv.visit(sh, coord)
    rows = [conv.rows[k] for k in conv.order]
    out = {"row": bottom["id"], "unit": spec.get("unit", "uov"), "label": spec.get("label", "Units of value per dollar")}
    if kind == "xcash":
        rows.append({"id": "cash_benchmark", "label": "Units of value per dollar given to GiveDirectly", "section": "bottom_line",
                     "value": spec.get("cash_uov", CASH_UOV), "kind": "estimate",
                     "source": {"title": "GiveWell, cost-effectiveness benchmark", "url": "https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness"},
                     "explainer": "GiveWell reports this model's result in multiples of cash transfers. Multiplying by GiveWell's value of a dollar to GiveDirectly converts it into units of value per dollar, so it ranks against the other models. Older sheets used older moral weights; the multiple of cash is the comparable number across years."})
        rows.append({"id": "uov_per_dollar", "label": "Units of value per dollar", "section": "bottom_line", "formula": f"{bottom['id']} * cash_benchmark"})
        out = {"row": "uov_per_dollar", "unit": "uov", "label": "Units of value per dollar"}
    elif kind == "usd_per_daly":
        # A cost per DALY averted: its reciprocal is DALYs per dollar, which converts to units of value
        # through the shared DALY exchange rate.
        rows.append({"id": "dalys_per_dollar", "label": "DALYs averted per dollar", "section": "bottom_line", "formula": f"1 / {bottom['id']}"})
        out = {"row": "dalys_per_dollar", "unit": "daly", "label": "DALYs averted per dollar"}
    elif re.fullmatch(r"(uov|wellby)_per:\d+", kind):
        unit, per = kind.split("_per:")
        label = {"uov": "Units of value per dollar", "wellby": "WELLBYs per dollar"}[unit]
        rows.append({"id": f"{unit}_per_dollar", "label": label, "section": "bottom_line", "formula": f"{bottom['id']} / {per}"})
        out = {"row": f"{unit}_per_dollar", "unit": unit, "label": label}
    elif kind == "native":
        out = {"row": bottom["id"], "unit": spec["unit"], "label": spec["label"]}
    sections = [{"id": v, "title": k} for k, v in conv.sections.items()]
    if kind in ("xcash", "usd_per_daly") or "_per:" in kind: sections.append({"id": "bottom_line", "title": "Bottom line"})
    # The bottom line first in its tab reads better than last; keep the traced order otherwise (precedents first).
    model = {k: spec[k] for k in ("id", "name") if k in spec}
    model.update({"kind": spec.get("kind", "charity"), "cause": spec.get("cause", "global-health"), "charity": spec["charity"],
                  "owner": spec["owner"], "bulk": True})
    for k in ("summary", "source", "evaluator"):
        if k in spec: model[k] = spec[k]
    model["resources"] = spec.get("resources", [])
    model["sections"] = sections
    model["rows"] = rows
    model["output"] = out
    stats = {"rows": len(rows), "translated": conv.translated, "frozen": conv.frozen, "bottom": f"{sh}!{coord}", "kind": kind,
             "value": num(book.val(sh, coord))}
    return model, stats


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("xlsx"); ap.add_argument("--spec", required=True); ap.add_argument("--out", default="models/global-health")
    ap.add_argument("--stats", help="append one JSON line of conversion stats per model to this file")
    a = ap.parse_args()
    sys.setrecursionlimit(20000)
    specs = json.loads(Path(a.spec).read_text())
    book = Sheet(a.xlsx)
    for spec in specs if isinstance(specs, list) else [specs]:
        model, stats = build(book, spec)
        Path(a.out, f"{model['id']}.json").write_text(json.dumps(model, indent=1, ensure_ascii=False) + "\n")
        stats["id"] = model["id"]
        print(json.dumps(stats))
        if a.stats:
            with open(a.stats, "a") as f: f.write(json.dumps(stats) + "\n")
