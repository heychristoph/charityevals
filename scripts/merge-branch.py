#!/usr/bin/env python3
"""Merge an agent's branch into the current branch, resolve the shared files, regenerate and check, in one commit.

Usage (from the checkout to merge into, normally main, with a clean working tree):
  python3 scripts/merge-branch.py <branch> [-m MESSAGE] [--no-regen] [--no-checks] [--no-commit]
  python3 scripts/merge-branch.py --self-test

Resolution, for every file both sides changed (not only the ones git marks as conflicts, since a clean line
merge of JSON can still drop or duplicate rows):
  - JSON: a three-way merge against the merge base. A change on one side wins over the unchanged other side;
    objects merge by key; lists of objects with an "id" (rows, registers such as facts/next_dollar.json) merge
    by id, keeping each side's additions in place and honouring removals; lists of strings are unions with
    removals honoured; where both sides changed the same leaf differently, models/ take the branch's value
    (its audited version) and every other file keeps ours, each printed as CONFLICT. When the result equals
    one side, that side's text is kept byte for byte; otherwise every part equal to a side keeps that side's
    text and the rest is laid out as JSON.stringify(x, null, 2) would (a model's "beneficiaries" on one line).
  - generated/ files the regeneration rewrites (bulk-summaries, browser-models, browser-facts, distributions, usage, normalization-audit):
    ours, then regenerated.
  - audits/<id>/audit-r<n>.md added on both sides: ours keeps the number, the branch's moves to the next free one.
  - other text (scripts' registers such as the OURS table in beneficiary-countries.ts): each conflict hunk
    becomes the union of both sides' lines minus the lines either side removed; where both sides have an
    entry with the same quoted key ("id": ...), or a receipt's Model-sha or Verdict line, the branch's wins
    (CONFLICT printed). A receipt's fingerprint is checked by vitest afterwards like any other.
  Anything left unmerged (a file deleted on one side and changed on the other): stops, merge left in progress.
Then (unless --no-regen) the after-merge scripts: missing-data.ts, beneficiary-countries.ts --all, summaries.ts,
normalization-audit.ts; generated/ and the models they touched are staged. Then (unless --no-checks)
npx tsc --noEmit, npx tsx scripts/check.ts and npx vitest run src. All pass: one merge commit holding the
regenerated files, so no separate "After-merge" commit. A failure: the merge is left staged, not committed;
fix, then `git commit --no-edit`.
"""
import json, os, re, subprocess, sys, tempfile
from decimal import Decimal

REGENERATED = {"generated/bulk-summaries.json", "generated/browser-models.json", "generated/browser-facts.json", "generated/distributions.json", "generated/usage.json", "generated/normalization-audit.json"}
UNMERGED = ("UU", "AA", "DU", "UD", "AU", "UA", "DD")
MISSING = object()
REPO = os.getcwd()


def git(*a, check=True, cwd=None):
    r = subprocess.run(["git", *a], cwd=cwd or REPO, capture_output=True, text=True)
    if check and r.returncode:
        raise SystemExit(f"git {' '.join(a)} failed: {r.stderr.strip()}")
    return r


def show(rev, path):
    """A file's text at a revision or index stage (":2"), or None."""
    r = git("show", f"{rev}:{path}", check=False)
    return r.stdout if r.returncode == 0 else None


# --- JSON in JavaScript's layout ------------------------------------------------------------------------

def js_num(x):
    if isinstance(x, bool):
        return "true" if x else "false"
    if isinstance(x, int):
        return str(x)
    if x != x or x in (float("inf"), float("-inf")):
        return "null"
    r = repr(x)  # the shortest digits that round-trip, as JavaScript picks them
    if "e" not in r:
        return r[:-2] if r.endswith(".0") else r
    mant, exp = r.split("e")
    e = int(exp)
    if -7 < e < 21:
        return format(Decimal(r), "f")
    return f"{mant}e{'+' if e > 0 else '-'}{abs(e)}"


def js_dumps(v, indent="", compact=False, top_compact=()):
    """JSON.stringify(v, null, 2), or JSON.stringify(v) when compact; top-level keys in top_compact on one line."""
    if v is None:
        return "null"
    if isinstance(v, (bool, int, float)):
        return js_num(v)
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    inner = indent + "  "
    if isinstance(v, list):
        if not v:
            return "[]"
        if compact:
            return "[" + ",".join(js_dumps(x, compact=True) for x in v) + "]"
        return "[\n" + ",\n".join(inner + js_dumps(x, inner) for x in v) + "\n" + indent + "]"
    if isinstance(v, dict):
        if not v:
            return "{}"
        if compact:
            return "{" + ",".join(json.dumps(k, ensure_ascii=False) + ":" + js_dumps(x, compact=True) for k, x in v.items()) + "}"
        return "{\n" + ",\n".join(inner + json.dumps(k, ensure_ascii=False) + ": " + js_dumps(x, inner, compact=k in top_compact) for k, x in v.items()) + "\n" + indent + "}"
    raise TypeError(type(v))


def same(a, b):
    if a is MISSING or b is MISSING:
        return a is b
    return json.dumps(a, sort_keys=True) == json.dumps(b, sort_keys=True)


class Node:
    """A parsed JSON value with where its text is: kids by key (objects) or position (arrays)."""
    __slots__ = ("v", "s", "e", "kids")

    def __init__(self, v, s, e, kids=None):
        self.v, self.s, self.e, self.kids = v, s, e, kids


def parse_spans(t):
    dec = json.JSONDecoder()
    ws = re.compile(r"\s*")

    def val(i):
        i = ws.match(t, i).end()
        c = t[i]
        if c == "{":
            kids, out, j = {}, {}, ws.match(t, i + 1).end()
            if t[j] == "}":
                return Node({}, i, j + 1, {}), j + 1
            while True:
                k, j = dec.raw_decode(t, ws.match(t, j).end())
                j = ws.match(t, j).end() + 1  # the colon
                n, j = val(j)
                kids[k], out[k] = n, n.v
                j = ws.match(t, j).end()
                if t[j] == ",":
                    j += 1
                    continue
                return Node(out, i, j + 1, kids), j + 1
        if c == "[":
            kids, j = [], ws.match(t, i + 1).end()
            if t[j] == "]":
                return Node([], i, j + 1, []), j + 1
            while True:
                n, j = val(j)
                kids.append(n)
                j = ws.match(t, j).end()
                if t[j] == ",":
                    j += 1
                    continue
                return Node([k.v for k in kids], i, j + 1, kids), j + 1
        v, j = dec.raw_decode(t, i)
        return Node(v, i, j), j

    return val(0)[0]


def render(v, cands, indent="", top=True, top_compact=()):
    """v as JSON text, reusing the text of any candidate (node, file text) whose value equals it, at every
    depth, so the parts of a merged file that came from one side keep that side's layout."""
    for n, t in cands:
        if n is not None and same(n.v, v):
            return t[n.s:n.e]
    inner = indent + "  "
    if isinstance(v, dict) and v:
        parts = []
        for k, x in v.items():
            sub = [(n.kids.get(k), t) for n, t in cands if n is not None and isinstance(n.kids, dict)]
            text = js_dumps(x, compact=True) if top and k in top_compact else render(x, sub, inner, False)
            parts.append(inner + json.dumps(k, ensure_ascii=False) + ": " + text)
        return "{\n" + ",\n".join(parts) + "\n" + indent + "}"
    if isinstance(v, list) and v:
        parts = []
        for k, x in enumerate(v):
            sub = []
            for n, t in cands:
                if n is None or not isinstance(n.kids, list):
                    continue
                if isinstance(x, dict) and "id" in x:
                    sub += [(c, t) for c in n.kids if isinstance(c.v, dict) and c.v.get("id") == x["id"]]
                elif k < len(n.kids):
                    sub.append((n.kids[k], t))
            parts.append(inner + render(x, sub, inner, False))
        return "[\n" + ",\n".join(parts) + "\n" + indent + "]"
    return js_dumps(v)


# --- Three-way merges -----------------------------------------------------------------------------------

def merge3(bv, o, t, where, path, prefer_theirs, log):
    if same(o, t):
        return o
    if same(o, bv):
        return t
    if same(t, bv):
        return o
    if isinstance(o, dict) and isinstance(t, dict):
        bd = bv if isinstance(bv, dict) else {}
        out = {}
        for k in list(o) + [k for k in t if k not in o]:
            r = merge3(bd.get(k, MISSING), o.get(k, MISSING), t.get(k, MISSING), f"{where}.{k}", path, prefer_theirs, log)
            if r is not MISSING:
                out[k] = r
        return out
    if isinstance(o, list) and isinstance(t, list):
        bl = bv if isinstance(bv, list) else []
        if o + t and all(isinstance(x, dict) and "id" in x for x in o + t + bl):
            bi = {x["id"]: x for x in bl}; oi = {x["id"]: x for x in o}; ti = {x["id"]: x for x in t}
            ids = [x["id"] for x in o]
            for k, x in enumerate(t):  # theirs' additions after their predecessor in theirs' order
                if x["id"] in oi:
                    continue
                prev = next((t[j]["id"] for j in range(k - 1, -1, -1) if t[j]["id"] in ids), None)
                ids.insert(ids.index(prev) + 1 if prev is not None else 0, x["id"])
            out = []
            for i in ids:
                r = merge3(bi.get(i, MISSING), oi.get(i, MISSING), ti.get(i, MISSING), f"{where}[{i}]", path, prefer_theirs, log)
                if r is not MISSING:
                    out.append(r)
            return out
        if all(isinstance(x, str) for x in o + t + bl) or all(isinstance(x, dict) for x in o + t + bl):
            key = lambda x: json.dumps(x, sort_keys=True)
            bk = {key(x) for x in bl}; ok = {key(x) for x in o}; tk = {key(x) for x in t}
            gone = (bk - ok) | (bk - tk)
            out, seen = [], set()
            for x in o + t:
                k = key(x)
                if k not in gone and k not in seen:
                    out.append(x); seen.add(k)
            return out
    show_ = lambda x: "(removed)" if x is MISSING else json.dumps(x, ensure_ascii=False)[:80]
    log(f"CONFLICT {path} {where or '(whole file)'}: ours={show_(o)} theirs={show_(t)} -> {'theirs' if prefer_theirs else 'ours'}")
    return t if prefer_theirs else o


def merge_json(path, base_txt, ours_txt, theirs_txt, log):
    """The merged text of a JSON file, or None if a side doesn't parse."""
    try:
        ours = json.loads(ours_txt) if ours_txt is not None else MISSING
        theirs = json.loads(theirs_txt) if theirs_txt is not None else MISSING
        base = json.loads(base_txt) if base_txt is not None else MISSING
    except json.JSONDecodeError as e:
        log(f"UNRESOLVED {path}: a side isn't valid JSON ({e})")
        return None
    merged = merge3(base, ours, theirs, "", path, path.startswith("models/"), log)
    if merged is MISSING:
        return MISSING
    if same(merged, ours):
        return ours_txt
    if same(merged, theirs):
        return theirs_txt
    cands = [(parse_spans(x), x) for x in (ours_txt, theirs_txt) if x is not None]
    return render(merged, cands, top_compact=("beneficiaries",) if path.startswith("models/") else ()) + "\n"


# An entry with a key: a quoted key in a register ("id": ...), or a receipt's Model-sha / Verdict line.
KEYED = re.compile(r'^(\s*)(?:"([^"]+)"\s*:|((?:\W*)(?:Model-sha|Verdict))\b)')


def merge_text_hunks(text, path, log):
    """Resolve diff3 conflict hunks: both sides' lines, minus what either removed; a quoted key on both sides
    keeps the branch's line."""
    pat = re.compile(r"^<<<<<<< [^\n]*\n(.*?)^\|\|\|\|\|\|\| [^\n]*\n(.*?)^=======\n(.*?)^>>>>>>> [^\n]*\n", re.S | re.M)

    def key(l):
        k = KEYED.match(l)
        return (k.group(1), k.group(2) or k.group(3)) if k else None

    def resolve(m):
        ours, base, theirs = (m.group(i).splitlines(keepends=True) for i in (1, 2, 3))
        bs, os_, ts = set(base), set(ours), set(theirs)
        out = [l for l in ours if not (l in bs and l not in ts)]       # ours, minus what theirs removed
        out += [l for l in theirs if l not in os_ and l not in bs]     # plus what theirs added
        theirs_keys = {key(l) for l in out if l in ts and key(l)}
        final = []
        for l in out:
            if key(l) in theirs_keys and l not in ts:                  # ours' version of an entry theirs has too
                log(f"CONFLICT {path} {key(l)[1]}: both sides have an entry -> theirs")
                continue
            final.append(l)
        return "".join(final)

    return pat.sub(resolve, text)


# --- The merge ------------------------------------------------------------------------------------------

def changed(a, b):
    return set(filter(None, git("diff", "--name-only", "--no-renames", a, b).stdout.splitlines()))


def resolve(branch, log):
    base = git("merge-base", "HEAD", branch).stdout.strip()
    both = changed(base, "HEAD") & changed(base, branch)
    r = git("merge", "--no-ff", "--no-commit", branch, check=False)
    if "Already up to date" in r.stdout:
        return None
    if git("rev-parse", "-q", "--verify", "MERGE_HEAD", check=False).returncode:
        raise SystemExit(f"git merge didn't start: {(r.stdout + r.stderr).strip()[:500]}")
    status = {l[3:]: l[:2] for l in git("status", "--porcelain", "--no-renames").stdout.splitlines()}
    unmerged = {p for p, s in status.items() if s in UNMERGED}
    unresolved = []
    for path in sorted(both | unmerged):
        full = os.path.join(REPO, path)
        st = status.get(path, "")
        ours_txt, theirs_txt, base_txt = show("HEAD", path), show(branch, path), show(base, path)
        if path in REGENERATED:
            if ours_txt is not None:
                open(full, "w").write(ours_txt)
            git("add", path)
            continue
        m_audit = re.match(r"(audits/[^/]+)/audit-r(\d+)\.md$", path)
        if m_audit and st == "AA":
            d = os.path.join(REPO, m_audit[1])
            open(full, "w").write(ours_txt)
            n = max(int(f[7:-3]) for f in os.listdir(d) if re.match(r"audit-r\d+\.md$", f)) + 1
            moved = re.sub(r"round \d+", f"round {n}", theirs_txt, count=1)
            open(os.path.join(d, f"audit-r{n}.md"), "w").write(moved.rstrip("\n") + f"\n\n(Numbered {m_audit[2]} on its branch; renumbered at merge.)\n")
            git("add", path, f"{m_audit[1]}/audit-r{n}.md")
            log(f"NOTE {path}: the branch's round moved to audit-r{n}.md")
            continue
        if st in ("DU", "UD", "AU", "UA", "DD"):
            unresolved.append(f"{path} ({st}: deleted on one side, changed on the other)")
            continue
        if ours_txt is None or theirs_txt is None:
            continue  # deleted on a side and git merged it cleanly
        if path.endswith(".json"):
            out = merge_json(path, base_txt, ours_txt, theirs_txt, log)
            if out is None:
                unresolved.append(path)
                continue
            current = open(full).read() if os.path.exists(full) else None
            if path not in unmerged and current is not None and out is not MISSING:
                try:
                    if same(json.loads(current), json.loads(out)):
                        continue  # git's line merge already says the same: keep its text
                except json.JSONDecodeError:
                    pass
                log(f"NOTE {path}: git's line merge differed from the three-way merge; the three-way result is kept")
            if out is MISSING:
                git("rm", "-q", "--", path)
            else:
                open(full, "w").write(out)
                git("add", path)
            continue
        if path in unmerged:
            git("checkout", "--conflict=diff3", "--", path)
            merged = merge_text_hunks(open(full).read(), path, log)
            open(full, "w").write(merged)
            git("add", path)
    left = [l for l in git("status", "--porcelain", "--no-renames").stdout.splitlines() if l[:2] in UNMERGED and l[3:] not in " ".join(unresolved)]
    for p in sorted(p for p in unmerged if os.path.exists(os.path.join(REPO, p))):
        if re.search(r"^(<<<<<<<|>>>>>>>) ", open(os.path.join(REPO, p), errors="replace").read(), re.M):
            left.append(f"{p} (conflict markers left)")
    return unresolved + left


def run(cmd, label, log):
    r = subprocess.run(cmd, cwd=REPO, capture_output=True, text=True)
    out = (r.stdout + r.stderr).strip().splitlines()
    log(f"{'ok  ' if r.returncode == 0 else 'FAIL'} {label}")
    if r.returncode:
        for l in out[-25:]:
            log(f"     {l}")
    return r.returncode == 0, out


def main(argv, log=lambda s: print(s, flush=True)):
    if argv[:1] == ["--self-test"]:
        return self_test()
    import argparse
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("branch")
    ap.add_argument("-m", dest="msg")
    for f in ("--no-regen", "--no-checks", "--no-commit"):
        ap.add_argument(f, action="store_true")
    a = ap.parse_args(argv)
    branch, msg = a.branch, a.msg
    argv = [f for f in ("--no-regen", "--no-checks", "--no-commit") if getattr(a, f[2:].replace("-", "_"))]
    if git("status", "--porcelain", "--untracked-files=no").stdout.strip():
        log("the working tree has uncommitted changes: commit or set them aside first"); return 2
    left = resolve(branch, log)
    if left is None:
        log(f"{branch}: already merged"); return 0
    if left:
        log("UNRESOLVED (merge left in progress):"); [log(f"  {p}") for p in left]; return 1
    if "--no-regen" not in argv:
        for script in (["scripts/missing-data.ts"], ["scripts/beneficiary-countries.ts", "--all"], ["scripts/summaries.ts"], ["scripts/normalization-audit.ts"]):
            ok, out = run(["npx", "tsx", *script], " ".join(script), log)
            if script[0].endswith("normalization-audit.ts"):
                for l in out:
                    if l.startswith("## ") and " 0 violations" not in l:
                        log(f"     {l}")
            if not ok:
                log("regeneration failed: merge staged, not committed"); return 1
        git("add", "-A", "--", "generated")
        git("add", "-u", "--", "models")
    if "--no-checks" not in argv:
        results = [run(c, l, log)[0] for c, l in ((["npx", "tsc", "--noEmit"], "tsc"), (["npx", "tsx", "scripts/check.ts"], "check.ts"), (["npx", "vitest", "run", "src"], "vitest"))]
        if not all(results):
            log("checks failed: the merge is staged, not committed; fix, then `git commit --no-edit`"); return 1
    if "--no-commit" in argv:
        log("merged and staged, not committed (--no-commit)"); return 0
    text = msg or f"Merge {branch}"
    if "--no-regen" not in argv:
        text += "\n\ngenerated/, missing-data and beneficiaries regenerated in the merge (scripts/merge-branch.py)."
    git("commit", "-q", "-m", text)
    log(f"merged {branch}: {git('rev-parse', '--short', 'HEAD').stdout.strip()}")
    return 0


# --- Self-test ------------------------------------------------------------------------------------------

def self_test():
    global REPO
    env = {**os.environ, "GIT_AUTHOR_NAME": "t", "GIT_AUTHOR_EMAIL": "t@t", "GIT_COMMITTER_NAME": "t", "GIT_COMMITTER_EMAIL": "t@t"}
    os.environ.update(env)
    logs = []
    log = logs.append
    with tempfile.TemporaryDirectory() as d:
        REPO = d

        def write(path, content):
            os.makedirs(os.path.dirname(os.path.join(d, path)) or d, exist_ok=True)
            open(os.path.join(d, path), "w").write(content if isinstance(content, str) else js_dumps(content) + "\n")

        def commit(m):
            git("add", "-A"); git("commit", "-q", "-m", m)

        git("init", "-q", "-b", "main")
        model = {"id": "m", "cause": "global-health", "summary": "S", "rows": [{"id": "a", "value": 1}, {"id": "b", "value": 2}, {"id": "c", "value": 3}], "tags": ["x", "y"]}
        write("models/m.json", model)
        write("facts/next_dollar.json", {"id": "next_dollar", "rows": [{"id": "one", "value": 0.5}]})
        write("facts/shared.json", {"id": "shared", "rows": [{"id": "k", "value": 10}]})
        write("scripts/list.ts", 'const OURS = {\n  "a-model": { b: 1 },\n  "b-model": { b: 2 },\n};\n')
        write("audits/m/audit-r1.md", "round 1\nVerdict: pass\nModel-sha: " + "a" * 64 + "\n")
        write("generated/usage.json", "{}\n")
        compact = '{\n  "id": "n",\n  "source": { "title": "T", "url": "u" },\n  "rows": [\n    { "id": "a", "value": 1 },\n    { "id": "b", "value": 2.5e-7 }\n  ]\n}\n'
        write("models/n.json", compact)
        commit("base")
        git("checkout", "-q", "-b", "feature")
        branch_model = json.loads(json.dumps(model))
        branch_model["summary"] = "S theirs"
        branch_model["rows"][1]["value"] = 22                      # leaf both change -> theirs (models/)
        branch_model["rows"].insert(2, {"id": "b2", "value": 5})   # theirs adds after b
        branch_model["tags"] = ["x", "z"]                           # theirs removes y, adds z
        write("models/m.json", branch_model)
        write("facts/next_dollar.json", {"id": "next_dollar", "rows": [{"id": "one", "value": 0.5}, {"id": "theirs_row", "value": 0.3}]})
        write("facts/shared.json", {"id": "shared", "rows": [{"id": "k", "value": 12}]})
        write("scripts/list.ts", 'const OURS = {\n  "a-model": { b: 1 },\n  "b-model": { b: 2 },\n  "t-model": { b: 3 },\n};\n')
        write("audits/m/audit-r2.md", "round 2 theirs\n")
        write("audits/m/audit-r1.md", "round 1\nVerdict: pass\nModel-sha: " + "c" * 64 + "\nTheirs note.\n")
        write("generated/usage.json", '{"theirs": 1}\n')
        write("models/n.json", compact.replace('"value": 1 }', '"value": 7 }'))
        commit("feature")
        git("checkout", "-q", "main")
        main_model = json.loads(json.dumps(model))
        main_model["rows"][1]["value"] = 20
        main_model["rows"][0]["side_effect"] = "added"              # ours-only change kept
        main_model["rows"] = [r for r in main_model["rows"] if r["id"] != "c"]  # ours removes c
        main_model["beneficiaries"] = {"USA": 0.5, "GBR": 0.5}
        write("models/m.json", main_model)
        write("facts/next_dollar.json", {"id": "next_dollar", "rows": [{"id": "one", "value": 0.5}, {"id": "ours_row", "value": 1e-05}]})
        write("facts/shared.json", {"id": "shared", "rows": [{"id": "k", "value": 11}]})
        write("scripts/list.ts", 'const OURS = {\n  "a-model": { b: 1 },\n  "o-model": { b: 4 },\n};\n')  # ours removes b-model, adds o-model
        write("audits/m/audit-r2.md", "round 2 ours\n")
        write("audits/m/audit-r1.md", "round 1\nVerdict: pass\nModel-sha: " + "b" * 64 + "\nOurs note.\n")
        write("generated/usage.json", '{"ours": 1}\n')
        write("models/n.json", compact.replace('    { "id": "b", "value": 2.5e-7 }\n', '    { "id": "b", "value": 2.5e-7 },\n    { "id": "c", "value": 3 }\n'))
        commit("main")
        assert main(["feature", "--no-regen", "--no-checks"], log) == 0, logs
        rd = lambda p: open(os.path.join(d, p)).read()
        m = json.loads(rd("models/m.json"))
        assert [r["id"] for r in m["rows"]] == ["a", "b", "b2"], m["rows"]
        assert m["rows"][1]["value"] == 22 and m["rows"][0].get("side_effect") == "added" and m["summary"] == "S theirs"
        assert m["tags"] == ["x", "z"], m["tags"]
        assert '"beneficiaries": {"USA":0.5,"GBR":0.5}' in rd("models/m.json"), rd("models/m.json")
        nd = json.loads(rd("facts/next_dollar.json"))
        assert [r["id"] for r in nd["rows"]] == ["one", "theirs_row", "ours_row"], nd
        assert '"value": 0.00001' in rd("facts/next_dollar.json")
        assert json.loads(rd("facts/shared.json"))["rows"][0]["value"] == 11, "a non-model leaf both changed keeps ours"
        lst = rd("scripts/list.ts")
        assert '"t-model"' in lst and '"o-model"' in lst and '"b-model"' not in lst and "<<<<<<<" not in lst, lst
        assert rd("audits/m/audit-r2.md") == "round 2 ours\n" and rd("audits/m/audit-r3.md").startswith("round 3 theirs"), os.listdir(os.path.join(d, "audits/m"))
        assert rd("generated/usage.json") == '{"ours": 1}\n', "regenerated files keep ours (then the scripts rewrite them)"
        assert any(l.startswith("CONFLICT models/m.json .rows[b].value") and l.endswith("theirs") for l in logs), logs
        assert any(l.startswith("CONFLICT facts/shared.json") and l.endswith("ours") for l in logs), logs
        r1 = rd("audits/m/audit-r1.md")
        assert "c" * 64 in r1 and "b" * 64 not in r1 and "Ours note." in r1 and "Theirs note." in r1, r1
        n = rd("models/n.json")
        assert '"source": { "title": "T", "url": "u" },' in n and '{ "id": "a", "value": 7 }' in n and '{ "id": "b", "value": 2.5e-7 }' in n and '{ "id": "c", "value": 3 }' in n, n
        assert not git("status", "--porcelain").stdout.strip(), "everything committed"
        assert "Merge feature" in git("log", "-1", "--format=%s").stdout
    for x, s in ((1, "1"), (0.5, "0.5"), (1e-05, "0.00001"), (1.5e-07, "1.5e-7"), (1e21, "1e+21"), (2.0, "2"), (123456789012345680000.0, "123456789012345680000")):
        assert js_num(x) == s, (x, js_num(x))
    print("merge-branch.py self-test: ok")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
