"""Files GiveWell's judgment calls as judgments: the imports marked every typed-in number `estimate`, but
GiveWell's adjustments (internal and external validity, wastage, monitoring, fungibility, leverage and
crowding scenarios, supplemental adjustments), its probabilities, guesses and moral weights are its staff's
judgments, not measurements. They get `kind: judgment`, so the model pages and the uncertainty split count
them as judgment.

    python3 scripts/givewell-judgment-kinds.py
"""
import json, re, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JUDGMENT = re.compile(
    r"adjustment|validity|replicab|\bguess|guesstimate|probabilit|\bchance\b|\bP\(|scenario|would (replace|shift|stay|spend|fund)|"
    r"moral weight|value (assigned|we assign)|units of value per (cyp|year of)|subjective|"
    r"risk of wastage|wastage|misappropriation|false monitoring|change of priorities|confidence in funds|bottleneck|fungib|"
    r"crowding|leverage|funging|discount to|downside|upside|bar for|\bbar\b|% of (the )?(overall|value)|"
    r"proportion of .* attributable to (the )?(grant|program)|weight on|assumed|assumption", re.I)
# Measurements that the words above can catch: data, costs and study results stay as they are.
NOT = re.compile(r"\bcost\b|costs\b|spending|population|mortality rate|incidence|prevalence|coverage rate|number of|grant size|"
                 r"exchange|price|budget|\bdhs\b|survey|per capita|probability of death|chance of (infection|severe|death)|efficacy|seedling|"
                 r"attributed to|calculations for|consumption\b", re.I)


def main():
    n = 0
    for p in sorted(glob.glob(str(ROOT / "models/grants/givewell/*.json")) + glob.glob(str(ROOT / "models/global-health/*.json"))):
        txt = Path(p).read_text()
        m = json.loads(txt)
        if m.get("owner") != "givewell" or m.get("kind") == "variant": continue
        hit = 0
        for r in m.get("rows", []):
            if r.get("kind") not in ("estimate", "observed") or "formula" in r: continue
            lab = r.get("label", "")
            if JUDGMENT.search(lab) and not NOT.search(lab):
                r["kind"] = "judgment"; hit += 1
        if hit:
            Path(p).write_text(json.dumps(m, indent=1 if txt.startswith('{\n "') else 2, ensure_ascii=False) + "\n")
            n += hit
    print(n, "rows filed as judgment")


if __name__ == "__main__":
    main()
