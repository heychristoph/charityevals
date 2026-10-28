"""Collect the documents, data and studies an evaluator's review page links to, as `resources`
entries for a model.  python3 scripts/collect-resources.py <review-url> <model.json>

Keeps links inside the review's article body; drops navigation, social and the evaluator's own
site chrome. Classifies spreadsheets as model/data, PDFs and journals as studies."""
import json, re, sys, urllib.parse, urllib.request
from html.parser import HTMLParser

url, path = sys.argv[1], sys.argv[2]
core = json.loads(sys.argv[3]) if len(sys.argv) > 3 else []   # [{title,url,type,note}] listed first
html = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30).read().decode("utf8", "replace")
# The review body; ACE wraps it in <article> or the main content area.
m = re.search(r"<article.*?</article>", html, re.S) or re.search(r"<main.*?</main>", html, re.S)
body = m.group(0) if m else html

class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.href = None; self.buf = []
    def handle_starttag(self, tag, attrs):
        if tag == "a": self.href = dict(attrs).get("href"); self.buf = []
    def handle_data(self, data):
        if self.href is not None: self.buf.append(data)
    def handle_endtag(self, tag):
        if tag == "a" and self.href:
            self.links.append((self.href, " ".join("".join(self.buf).split())))
        if tag == "a": self.href = None

p = Links(); p.feed(body)
_m = json.load(open(path))
site = re.sub(r"^https?://(www\.)?", "", (_m.get("org") or {}).get("website") or "").split("/")[0] or None
SKIP = re.compile(r"(web\.archive\.org|secure\.givewell\.org|facebook|twitter|x\.com|linkedin|instagram|youtube\.com/@|mailto:|#|/donate|/blog/category|/charity-review/?$|docs\.google\.com/forms)", re.I)

DATA = re.compile(r"ourworldindata|fishcount|chickenwatch|fao\.org|faostat|worldbank|data\.|statista|ihme|healthdata|dhsprogram|who\.int/data|unicef\.org/.*data|cagefreelaws", re.I)
RESEARCH = re.compile(r"openphilanthropy|rethinkpriorities|animalask|faunalytics|welfarefootprint|founderspledge|givewell\.org/research|happierlivesinstitute|forum\.effectivealtruism|psycnet|cochrane", re.I)

def kind(u, t):
    if DATA.search(u) or "givewell.org/files" in u or "files.givewell.org" in u: return "data"
    if RESEARCH.search(u): return "study"
    if "spreadsheets" in u: return "model" if re.search(r"cost|cea|sad", t, re.I) else "data"
    if re.search(r"\.pdf($|\?)|doi\.org|journal|ncbi|sciencedirect|springer|wiley|jstor|nber|ssrn|arxiv|researchgate", u, re.I): return "study"
    if "docs.google.com/document" in u: return "evaluation"
    if "animalcharityevaluators.org" in u or "givewell.org" in u: return "evaluation"
    return "other"

seen, out = set(), []
for href, t in p.links:
    if not href or not href.startswith("http") or SKIP.search(href): continue
    u = href.split("#")[0]
    if u in seen: continue
    seen.add(u)
    if t.lower() in ("archive", "donate", "donate now"): continue
    weak = not t or len(t) <= 3 or t.lower() in ("source", "here", "this", "link", "more", "pdf") or t.lower().startswith(("here", "this ", "link"))
    if weak:
        tail = urllib.parse.unquote(u.rstrip("/").rsplit("/", 1)[-1]).split("?")[0]
        tail = re.sub(r"\.(pdf|aspx|html?|xlsx?|docx?)$", "", tail, flags=re.I).replace("_", " ").replace("-", " ")
        host = re.sub(r"^https?://(www\.)?", "", u).split("/")[0]
        title = f"{tail} ({host})" if tail and not tail.startswith(("edit", "view")) else host
    else:
        title = t
    k = kind(u, t)
    if site and site in u: k = "charity"
    out.append({"title": title[:160], "url": u, "type": k})

d = json.load(open(path))
merged, urls = [], set()
for r in core + out:
    if r["url"] in urls: continue
    urls.add(r["url"]); merged.append(r)
d["resources"] = merged
open(path, "w").write(json.dumps(d, indent=2, ensure_ascii=False) + "\n")
print(f"{path}: {len(d['resources'])} resources ({len(out)} found)")
