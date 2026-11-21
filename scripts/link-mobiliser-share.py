"""Classifies every imported model as mobilised or own delivery and links the mobilised ones to the
shared `mobiliser_share` setting (docs/normalization.md 2.24, INV-22).

    python3 scripts/link-mobiliser-share.py            # every imported model under models/
    python3 scripts/link-mobiliser-share.py --dry-run  # list what would change
    python3 scripts/link-mobiliser-share.py --table    # also write inventory/rule-changes/mobiliser-share-imports.md

The one test: would the party that carries out the good have committed its resources without the
organisation? An import is **mobilised** when its sheet's good is done by another party's own programme
or decision, taken because of the organisation: a government's law, budget or programme, companies'
compliance, donors' gifts, a funder's later grants, whoever adopts research. It is **own delivery** when
the organisation (or partners it pays) delivers the goods or services itself, also inside public
facilities or with a government's in-kind help (co-funders, under `$resource_shares`). Delivery that
also crowds in public money is classed whole by what the sheet's bottom line mostly is; the blend is
deferred (2.24).

Every import gets the field `mobilised`. A mobilised one also gets the row `mobiliser_share =
$mobiliser_share` in the ours section after `output.native`, the row after `output.native` times that
row, and `mobiliser_share: 1` in `evaluator.assumptions`, so the evaluator view stays the evaluator's.
An import that values money moved through the shared rows (scripts/moved-money.py) already multiplies
by the share there: it gets the field and the pin only.

The class comes from RULES, by evaluator and kind of programme (the model's id), first match wins.
The converters call `apply` on the model they write, so a re-import keeps the field, the row and the
pin. Files on disk are edited in place, leaving every other byte as it is. Idempotent.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TABLE = ROOT / "inventory/rule-changes/mobiliser-share-imports.md"
ROW_ID = "mobiliser_share"
# Word for word the shared row of src/engine/moved-money.ts (MOVED_MONEY_ROWS.mobiliser_share).
ROW = {
    "label": "This charity's share of the good done with money, work or budgets it brings in",
    "format": "percent",
    "formula": "$mobiliser_share",
    "explainer": "The site's one setting for resources another party commits only because of the organisation (docs/normalization.md 2.24): the charity is credited this share of the good done with them, net of their cost; the rest stays with those who paid or did the work.",
}
NOTE = "Times the charity's share of the good that others carry out (mobiliser_share)."
MONEY_ROWS = re.compile(r"(^|_)(moved_dollar_net_value|shifted_dollar_value|moved_dollar_value)$")

# class -> mobilised
CLASSES = {"research": True, "technical assistance": True, "policy": True, "campaign": True, "money moved": True, "delivery": False}

WHY = {
    "gw_research": "The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed.",
    "gw_policy": "The good is done by a government's law, tax or regulation and those who comply with it.",
    "gw_ta": "A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it.",
    "gw_delivery": "The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding.",
}

# evaluator (owner) -> [(class, pattern on the model id, reason)], first match wins.
RULES = {
    "givewell": [
        # Programme sheets that add a smaller optionality term to a delivery estimate, or whose id names a pilot of own delivery.
        ("delivery", r"^raising-the-village-2024|^rice-institute-kmc-with|^ird-global-breastfeeding-promotion-pilot",
         "A programme sheet: the grantee delivers, and the value of what GiveWell learns is the smaller part of the bottom line."),
        ("research", r"voi|value-information|optionality|option-value|incubat|accelerator-renewal|rough-beta|-rct|idinsight|m-e-msi|monitoring"
                     r"|atlas-ai|yale-research|medicines-development|who-gdg|sickkids|bridge-funding-water-vouchers-value|india-water-pilot", WHY["gw_research"]),
        ("policy", r"centre-for-pesticide-suicide-prevention|vital-strategies|pure-earth", WHY["gw_policy"]),
        ("technical assistance", r"technical-assistance|chai-ppm|chai-tsus|evidence-action-india$|-ifa-|iron-folic-acid|syphilis|healthy-futures"
                                 r"|rice-fortification|world-food-programme|^path-|in-line-chlorination-india"
                                 r"|^global-alliance-for-improved-nutrition|^iodine-global-network", WHY["gw_ta"]),
        ("delivery", r".", WHY["gw_delivery"]),
    ],
    "ace": [
        ("research", r"^wild-animal-initiative", "Counts published papers: the good is done by whoever acts on the research."),
        ("campaign", r".", "The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds."),
    ],
    "ambitious-impact": [
        ("money moved", r"^better-futures-guide|^cearch", "Moves donors' money to other charities (the shared money rows carry the share)."),
        ("policy", r"^alliance-for-reducing-microbial-resistance|^animal-policy-international|^concentric-policies|^labri",
         "Advocacy: the good is done by a government's law, tax or regulation and those who comply with it."),
        ("research", r"^lead-research-for-action", "Studies of lead sources: the good is done by the governments and others that act on them."),
        ("delivery", r".", "The charity delivers the service, training or goods itself."),
    ],
    "hli": [
        ("policy", r"^pure-earth", "Advocacy and enforcement monitoring: the good is done by the regulator and the producers that comply."),
        ("technical assistance", r"^pallium-india", "Builds palliative care and opioid access through state governments' and hospitals' own services (the model's staff-pay class is research and policy)."),
        ("delivery", r".", "The charity delivers the service or goods itself."),
    ],
    "self": [
        ("policy", r"^lead-exposure-elimination-project", "The good is done by governments' lead paint limits and the manufacturers that reformulate."),
    ],
    "sogive": [
        ("research", r"^breast-cancer-now|^motor-neurone-disease-association",
         "Nearly all the healthy years in SoGive's figure come from research: the good is done by the health systems that adopt it."),
        ("delivery", r".", "The charity (or partners it pays) delivers the service or goods; where research is the smaller part of the figure the model is classed whole."),
    ],
    "the-life-you-can-save": [
        ("technical assistance", r"iron-folic-acid|syphilis|^teaching-at-the-right-level|llins-south-sudan",
         "A government pays for and delivers the programme; the charity advises and supports it."),
        ("delivery", r".", "The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding."),
    ],
}


def is_import(m):
    return m.get("kind") != "variant" and m.get("owner") not in (None, "charityevals")


def classify(m):
    """(class, reason) of an imported model, by its evaluator's rules."""
    rules = RULES.get(m["owner"])
    if rules is None:
        sys.exit(f"{m['id']}: no rules for the evaluator {m['owner']}: add them to RULES in scripts/link-mobiliser-share.py")
    return next((c, why) for c, pat, why in rules if re.search(pat, m["id"]))


ROW_REF = re.compile(r"(?<![\w$@#.:-])[a-z_][a-z0-9_]*(?![\w(])")


def anchor(m):
    """The row that takes the share: the one ours row after `output.native` that everything of the evaluator's
    passes through on the way to the output, else the output row."""
    rows = {r["id"]: r for r in m["rows"]}
    reads = lambda rid: set(ROW_REF.findall(rows[rid].get("formula", "")))
    out = m["output"]["row"]
    native = (m["output"].get("native") or {}).get("row")
    ours = {s["id"] for s in m.get("sections", []) if s.get("kind") == "ours"}

    def feeding(without=None):
        path, todo = set(), [out]
        while todo:
            x = todo.pop()
            if x in path or x not in rows or x == without:
                continue
            path.add(x)
            todo += reads(x)
        return path

    path = feeding()
    after = [r["id"] for r in m["rows"] if native and native != out and r["id"] in path and r.get("section") in ours and native in reads(r["id"])]
    if len(after) == 1 and all(rows[x].get("section") in ours for x in feeding(after[0])):
        return after[0]
    return out


def plan(m):
    """What linking does to a model: (class, reason, the `mobilised` to set, row to multiply or None, pin or not).
    A money mover whose shared rows don't carry the share yet is left as it is (`mobilised` None) until
    scripts/moved-money.py has rewritten them: marked mobilised before that, it would read no share."""
    cls, why = classify(m)
    mob = CLASSES[cls]
    rows = {r["id"]: r for r in m.get("rows", [])}
    if not mob:
        if ROW_ID in rows or ROW_ID in (m.get("evaluator") or {}).get("assumptions", {}):
            sys.exit(f"{m['id']}: classed {cls} but reads {ROW_ID}: take the row, its factor and the pin out by hand")
        return cls, why, mob, None, False
    wired = ROW_ID in rows
    shared = any(MONEY_ROWS.search(rid) for rid in rows)  # scripts/moved-money.py carries the share
    target = None if wired or shared or not m.get("output") else anchor(m)
    if shared and not wired:
        return cls, why, None, None, False
    pin = bool(m.get("evaluator")) and (wired or target is not None)
    return cls, why, mob, target, pin


def apply(m, strict=True):
    """Links a model in memory (the converters call this before writing). Returns whether it changed.
    Not strict (a converter whose output gets our steps later): a model whose bottom line isn't in an
    ours section yet only gets the field, and the row and pin when this script next runs."""
    if not is_import(m):
        return False
    before = json.dumps(m, sort_keys=True)
    if not strict and m["owner"] not in RULES:
        print(f"{m['id']}: no rules for the evaluator {m['owner']} yet: add them to RULES in scripts/link-mobiliser-share.py, then run it")
        return False
    cls, why, mob, target, pin = plan(m)
    if mob is not None and m.get("mobilised") != mob:
        items = list(m.items())
        at = next((i + 1 for i, (k, _) in enumerate(items) if k == "owner"), len(items))
        items[at:at] = [("mobilised", mob)]
        new = dict((k, v) for k, v in items if k != "mobilised" or v is mob)
        m.clear(); m.update(new)
    if target:
        r = next(x for x in m["rows"] if x["id"] == target)
        ours = {s["id"] for s in m.get("sections", []) if s.get("kind") == "ours"}
        if r.get("section") not in ours:
            if strict:
                sys.exit(f"{m['id']}: {target} isn't in an ours section: the share is our step")
            return json.dumps(m, sort_keys=True) != before
        r["formula"] = f"({r['formula']}) * {ROW_ID}"
        r["explainer"] = (NOTE + ("\n\n" + r["explainer"] if r.get("explainer") else "")).strip()
        m["rows"].insert(m["rows"].index(r), {"id": ROW_ID, "section": r["section"], **ROW})
    if pin:
        m["evaluator"].setdefault("assumptions", {})[ROW_ID] = 1
    return json.dumps(m, sort_keys=True) != before


# --- Editing a model's text in place -------------------------------------------------------------------

def skip_ws(t, i):
    while i < len(t) and t[i] in " \t\r\n":
        i += 1
    return i


STRING = re.compile(r'"(?:[^"\\]|\\.)*"', re.S)
TOKEN = re.compile(r'"(?:[^"\\]|\\.)*"|[{}\[\]]', re.S)
SCALAR = re.compile(r"[^,}\]\s]*")


def skip_string(t, i):
    return STRING.match(t, i).end()


def skip_value(t, i):
    if t[i] == '"':
        return skip_string(t, i)
    if t[i] in "{[":
        depth = 0
        for tok in TOKEN.finditer(t, i):
            c = tok.group()
            depth += c in ("{", "[")
            depth -= c in ("}", "]")
            if depth == 0:
                return tok.end()
    return SCALAR.match(t, i).end()


def members(t, i):
    """The members of the JSON object whose `{` is at i: (key, key start, value start, value end); and the index of its `}`."""
    out, i = [], skip_ws(t, i + 1)
    while t[i] != "}":
        ks = i
        ke = skip_string(t, i)
        vs = skip_ws(t, skip_ws(t, ke) + 1)
        ve = skip_value(t, vs)
        out.append((json.loads(t[ks:ke]), ks, vs, ve))
        i = skip_ws(t, ve)
        if t[i] == ",":
            i = skip_ws(t, i + 1)
    return out, i


def elements(t, i):
    """The (start, end) of each element of the JSON array whose `[` is at i."""
    out, i = [], skip_ws(t, i + 1)
    while t[i] != "]":
        e = skip_value(t, i)
        out.append((i, e))
        i = skip_ws(t, e)
        if t[i] == ",":
            i = skip_ws(t, i + 1)
    return out


def add_member(t, obj_start, key, value, after=None):
    """Adds `key: value` to the object at obj_start, after the member `after` (or last), in the object's own style."""
    ms, close = members(t, obj_start)
    dump = json.dumps(value, ensure_ascii=False)
    if not ms:
        return t[:obj_start] + "{" + f"{json.dumps(key)}: {dump}" + "}" + t[close + 1:]
    k, ks, vs, ve = next((x for x in ms if x[0] == after), ms[-1])
    pad = t[obj_start + 1:ms[0][1]]                      # between `{` and the first key
    colon = t[skip_string(t, ms[0][1]):ms[0][2]]        # between a key and its value
    return t[:ve] + "," + (pad if pad else (" " if colon.endswith(" ") else "")) + json.dumps(key) + colon + dump + t[ve:]


def set_string(t, obj_start, key, value, after):
    """Sets a string member of the object at obj_start, adding it after `after` if it isn't there."""
    ms, _ = members(t, obj_start)
    hit = next((x for x in ms if x[0] == key), None)
    if hit:
        return t[:hit[2]] + json.dumps(value, ensure_ascii=False) + t[hit[3]:]
    return add_member(t, obj_start, key, value, after)


def link_text(text):
    """A model file's text, linked. Returns (new text, what was done)."""
    m = json.loads(text)
    if not is_import(m):
        return text, None
    want = json.loads(text)
    cls, why, mob, target, pin = plan(m)
    apply(want)
    t = text
    top = lambda: {k: (vs, ve) for k, _, vs, ve in members(t, skip_ws(t, 0))[0]}
    if mob is not None and m.get("mobilised") != mob:
        if "mobilised" in m:
            vs, ve = top()["mobilised"]
            t = t[:vs] + json.dumps(mob) + t[ve:]
        else:
            t = add_member(t, skip_ws(t, 0), "mobilised", mob, after="owner")
    if target:
        spans = elements(t, top()["rows"][0])
        ids = [r["id"] for r in m["rows"]]
        s, e = spans[ids.index(target)]
        row = t[s:e]
        old = m["rows"][ids.index(target)]
        new = next(r for r in want["rows"] if r["id"] == target)
        row = set_string(row, 0, "formula", new["formula"], None)
        row = set_string(row, 0, "explainer", new["explainer"], "formula")
        # The share's row, in the style of the row it sits before.
        ms, close = members(t[s:e], 0)
        src = t[s:e]
        pad, colon = src[1:ms[0][1]], src[skip_string(src, ms[0][1]):ms[0][2]]
        fields = {"id": ROW_ID, "section": old["section"], **ROW}
        body = ("," + (pad if pad else (" " if colon.endswith(" ") else ""))).join(json.dumps(k) + colon + json.dumps(v, ensure_ascii=False) for k, v in fields.items())
        share = "{" + pad + body + src[ms[-1][3]:close] + "}"
        between = t[spans[0][1]:spans[1][0]] if len(spans) > 1 else ", "
        t = t[:s] + share + between + row + t[e:]
    if pin and (m.get("evaluator") or {}).get("assumptions", {}).get(ROW_ID) != 1:
        ev = top()["evaluator"][0]
        hit = next((x for x in members(t, ev)[0] if x[0] == "assumptions"), None)
        t = add_member(t, hit[2], ROW_ID, 1) if hit else add_member(t, ev, "assumptions", {ROW_ID: 1})
    if json.loads(t) != want:
        sys.exit(f"{m['id']}: the edited text doesn't hold the intended model")
    return t, (cls, why, mob, target, pin)


# Calls made by the rule where a model sits near the line, logged for the owner (in the table).
CALLS = [
    "Deworming (GiveWell's and SoGive's sheets), vitamin A, seasonal malaria chemoprevention, nets: own delivery. The charity pays most of the delivery cost (Deworm the World 61% in GiveWell's 2024 sheet, Helen Keller 45 to 70%); teachers' and health workers' time is a government's in-kind co-funding.",
    "Fortify Health: own delivery. It pays for the premix and equipment the mills use.",
    "Results for Development (amoxicillin): own delivery. It pays about two thirds of the drugs in GiveWell's sheet.",
    "UNFPA Supplies: own delivery (commodities bought); the governments' matched money is the deferred blend.",
    "PATH (malaria vaccines, perennial chemoprevention): technical assistance. Governments and Gavi pay for and deliver the vaccines and drugs; philanthropy covers 20 to 31% in GiveWell's sheets.",
    "Evidence Action: iron and folic acid, syphilis screening and in-line chlorination in India are technical assistance (the states buy and deliver); Dispensers for Safe Water and in-line chlorination in Kenya, Malawi and Uganda are own delivery.",
    "Sheets that add what GiveWell learns to a programme's own benefit: research where the sheet is about the pilot or trial (GiveDirectly's pilots: over half the bottom line is value of information), own delivery where it is a programme sheet with a smaller optionality term (Raising the Village 2024, r.i.c.e. kangaroo care 2023).",
    "Ambitious Impact's Neev, Learning Alliance and First Embrace: own delivery. The charity pays for the training; what kiln owners, teachers and hospitals add is small.",
    "SoGive: Motor Neurone Disease Association is research (91% of the healthy years in its figure), Versus Arthritis own delivery (research is 30%).",
    "HLI's Pallium India: technical assistance, on the model's own staff-pay class (research and policy); HLI gives only a range.",
    "Better Futures Guide and CEARCH (money moved): their shared money rows carry the share (scripts/moved-money.py), so they get the field and the pin only, no second factor.",
    "GiveWell's Iodine Global Network sheet has no result in common units: it gets the field only.",
]

# Mobilised imports whose evaluator already divides by the spending of the party that carries out the good:
# that party is in a pro-rata denominator and, below 100%, under the share too. Left as the evaluator has
# them here (no value changes in this step); the step that re-judges shares takes the adopter out (2.24).
REJUDGE = [
    "alliance-for-reducing-microbial-resistance-aim: Ambitious Impact's cost per DALY counts the governments' payments for the pull incentive (about $300 million a year, weighted by the chance of success) beside the charity's few million.",
    "teaching-at-the-right-level-africa-tlycs: The Life You Can Save's figure is per dollar of all the programme's money; the governments pay 39 to 77% of it in the three countries.",
    "malaria-consortium-tlycs-llins-south-sudan: the cost counted is $3.26 million of nets for the extra people found beside Malaria Consortium's $0.12 million.",
    "concentric-policies-aim: the government's cost of running the tax (about $44,000 a year) is in the cost per DALY beside the charity's $225,000 a year.",
    "lead-exposure-elimination-project-leep, lead-exposure-elimination-project-leep-2024: LEEP's cost is its own spending plus the governments' enforcement spending counted at half (about two fifths of the Malawi model's cost, about 7% of the 2024 model's).",
]


def table(rows):
    lines = [
        "# Imports: mobilised or own delivery (rule 2.24)",
        "",
        "Written by `python3 scripts/link-mobiliser-share.py --table`; the rules are RULES in that script.",
        "",
        "The one test: would the party that carries out the good have committed its resources without the organisation?",
        "",
        "- **Mobilised** (`mobilised: true`, takes `$mobiliser_share`): the sheet's good is done by another party's own programme or",
        "  decision, taken because of the organisation. Classes: research, technical assistance, policy, campaign, money moved.",
        "- **Own delivery** (`mobilised: false`): the organisation, or partners it pays, delivers the goods or services, also inside",
        "  public facilities or with a government's in-kind help (co-funders, under `$resource_shares`).",
        "- Delivery that also crowds in public money (GiveWell's leverage) is classed whole by what the bottom line mostly is; the",
        "  blend (own share + s × the rest) is deferred (docs/normalization.md 2.24).",
        "- Variants inherit their model's class.",
        "",
        "## Counts",
        "",
        "| Evaluator | Imports | Mobilised | Research | Technical assistance | Policy | Campaign | Money moved | Delivery |",
        "|---|---|---|---|---|---|---|---|---|",
    ]
    owners = sorted({r[1] for r in rows})
    count = lambda sel, cls=None: sum(1 for r in rows if sel(r) and (cls is None or r[2] == cls))
    for o in owners + [None]:
        sel = (lambda r, o=o: r[1] == o) if o else (lambda r: True)
        lines.append(f"| {o or '**All**'} | {count(sel)} | {sum(1 for r in rows if sel(r) and CLASSES[r[2]])} | " + " | ".join(str(count(sel, c)) for c in CLASSES) + " |")
    lines += ["", "## The rules", "", "First match on the model's id wins.", "", "| Evaluator | Class | Models whose id matches | Reason |", "|---|---|---|---|"]
    for o, rules in RULES.items():
        for c, pat, why in rules:
            lines.append(f"| {o} | {c} | `{pat.replace('|', ' ¦ ')}` | {why} |")
    lines += ["", "## Calls near the line", ""] + [f"- {c}" for c in CALLS]
    lines += ["", "## The adopter in the evaluator's denominator (done, 17 November 2026)", "",
              "Mobilised, and the evaluator's cost already includes the spending of the party that carries out the good, so below 100% that",
              "party would be cut twice. In our view the adopter's spending has left the denominator (`adopter_cost_out`, 1 in `published`) and",
              "is netted from the good at what the money would otherwise have done, inside the share; the evaluator view is unchanged:", ""] + [f"- {c}" for c in REJUDGE]
    lines += ["", "## Every import", "", "| Model | Evaluator | Class | Mobilised | Reason |", "|---|---|---|---|---|"]
    for mid, o, c, why in sorted(rows, key=lambda r: (r[1], not CLASSES[r[2]], r[2], r[0])):
        lines.append(f"| {mid} | {o} | {c} | {'yes' if CLASSES[c] else 'no'} | {why} |")
    TABLE.parent.mkdir(parents=True, exist_ok=True)
    TABLE.write_text("\n".join(lines) + "\n")


def main():
    dry = "--dry-run" in sys.argv
    done, listed = 0, []
    for p in sorted((ROOT / "models").rglob("*.json")):
        text = p.read_text()
        new, what = link_text(text)
        if what is None:
            continue
        cls, why, mob, target, pin = what
        m = json.loads(text)
        listed.append((m["id"], m["owner"], cls, why))
        if mob is None:
            print(f"{m['id']}: {cls}, left until its shared money rows carry the share (scripts/moved-money.py), then run this again")
        if new == text:
            continue
        done += 1
        if dry:
            print(f"{m['id']}: {cls}" + (f", × {ROW_ID} on {target}" if target else "") + (", pinned" if pin and target is None else ""))
        else:
            p.write_text(new)
    print(f"{done} of {len(listed)} imports {'would change' if dry else 'changed'}; {sum(1 for r in listed if CLASSES[r[2]])} mobilised")
    if "--table" in sys.argv and not dry:
        table(listed)


if __name__ == "__main__":
    main()
