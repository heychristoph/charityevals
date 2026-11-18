"""Rule never-started-prose (18 Nov 2026; docs/normalization.md 2.25): the summaries and write-ups of the models
that count a future said it counts "through the discount rate", gave its share of the result and the result at
a 0.1% discount rate. Since rule never-started-weight the future counts times "Lives that never start count",
0% by default, so those sentences are reworded: the future counts only where the reader counts such lives, the
figures once given for a 0.1% discount rate are the Long-run value set's (0.1% and such lives in full), and
Redwood Research, whose simulation is now too skewed for a range, states none. No row and no result changes."""
import glob
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# Each model's result with the Long-run value set, at an 8% discount rate and with a cut counted one year
# (two significant figures; npx tsx scripts/headlines.ts gives the defaults).
FIGURES = {
 "1day-sooner-charityevals": {
  "longrun": "19",
  "d08": "1.2",
  "y1": "0.46"
 },
 "allfed-charityevals": {
  "longrun": "17",
  "d08": "7.1",
  "y1": "1.8"
 },
 "arms-control-association-charityevals": {
  "longrun": "44",
  "d08": "11",
  "y1": "2.6"
 },
 "blueprint-biosecurity-charityevals": {
  "longrun": "25",
  "d08": "1.4",
  "y1": "0.34"
 },
 "bulletin-of-the-atomic-scientists-charityevals": {
  "longrun": "19",
  "d08": "4.3",
  "y1": "1"
 },
 "center-for-ai-safety-charityevals": {
  "longrun": "8.5",
  "d08": "3.4",
  "y1": "0.84"
 },
 "centre-for-long-term-resilience-charityevals": {
  "longrun": "23",
  "d08": "1.6",
  "y1": "0.39"
 },
 "cepi-charityevals": {
  "longrun": "2.5",
  "d08": "0.13",
  "y1": "0.033"
 },
 "coalition-for-rainforest-nations-charityevals": {
  "longrun": "0.021",
  "d08": "-0.006",
  "y1": "-0.0024"
 },
 "cool-earth-charityevals": {
  "longrun": "0.13",
  "d08": "0.11",
  "y1": "0.11"
 },
 "council-on-strategic-risks-charityevals": {
  "longrun": "76",
  "d08": "8",
  "y1": "2"
 },
 "earthjustice-charityevals-biodiversity": {
  "longrun": "0.00001",
  "d08": "0",
  "y1": "0"
 },
 "epoch-ai-charityevals": {
  "longrun": "0.24",
  "d08": "0.03",
  "y1": "0.0072"
 },
 "far-ai-charityevals": {
  "longrun": "0.98",
  "d08": "0.42",
  "y1": "0.1"
 },
 "federation-of-american-scientists-charityevals": {
  "longrun": "1.6",
  "d08": "0.39",
  "y1": "0.093"
 },
 "govai-charityevals": {
  "longrun": "9.3",
  "d08": "2.3",
  "y1": "0.53"
 },
 "ibbis-charityevals": {
  "longrun": "37",
  "d08": "2.2",
  "y1": "0.52"
 },
 "ican-charityevals": {
  "longrun": "9",
  "d08": "2.3",
  "y1": "0.55"
 },
 "institute-for-ai-policy-and-strategy-charityevals": {
  "longrun": "5.1",
  "d08": "1.8",
  "y1": "0.46"
 },
 "johns-hopkins-center-for-health-security-charityevals": {
  "longrun": "45",
  "d08": "2.6",
  "y1": "0.62"
 },
 "machine-intelligence-research-institute-charityevals": {
  "longrun": "0.77",
  "d08": "0.027",
  "y1": "0.0067"
 },
 "mats-charityevals": {
  "longrun": "11",
  "d08": "2.7",
  "y1": "0.66"
 },
 "metr-charityevals": {
  "longrun": "0.65",
  "d08": "0.025",
  "y1": "0.0059"
 },
 "nuclear-threat-initiative-charityevals": {
  "longrun": "33",
  "d08": "6.5",
  "y1": "1.6"
 },
 "ploughshares-fund-charityevals": {
  "longrun": "30",
  "d08": "7.4",
  "y1": "1.8"
 },
 "rainforest-foundation-us-charityevals": {
  "longrun": "0.064",
  "d08": "0.0098",
  "y1": "0.011"
 },
 "redwood-research-charityevals": {
  "longrun": "0.71",
  "d08": "0.026",
  "y1": "0.0063"
 },
 "securebio-charityevals": {
  "longrun": "21",
  "d08": "1.9",
  "y1": "0.47"
 },
 "sentinel-bio-charityevals": {
  "longrun": "27",
  "d08": "1.8",
  "y1": "0.45"
 },
 "the-nature-conservancy-charityevals": {
  "longrun": "0.0012",
  "d08": "0.00018",
  "y1": "0.00014"
 },
 "union-of-concerned-scientists-charityevals": {
  "longrun": "17",
  "d08": "4.2",
  "y1": "1"
 }
}

COUNTED = "only where you count lives that never start (0% by default)"
NOT_COUNTED = "does not count (lives that never start: 0%)"
LONG_RUN = "With the Long-run value set (a 0.1% discount rate, lives that never start in full)"

def reword(text, fig):
    t = text
    # The future counted "through the discount rate".
    t = re.sub(r"\b(count(?:s|ed)?) (?:only )?through the discount rate", r"\1 " + COUNTED, t)
    # Its weight at the default discount rate.
    t = re.sub(r"At the default 4% discount rate,? the future counts for little; at 0\.1% the result rises to about [\d.]+\.",
               f"By default the future {NOT_COUNTED}. {LONG_RUN} the result rises to about {fig['longrun']}.", t)
    t = re.sub(r"At the default 4% discount rate,? the future counts for little\.", f"By default the future {NOT_COUNTED}.", t)
    t = re.sub(r"\bat the default 4% discount rate,? the future( of people not yet born)? counts for (?:only )?about 8 years of the long-run population( anyway)?",
               lambda m: f"by default the future{m.group(1) or ''} does not count{m.group(2) or ''} (lives that never start: 0%)", t)
    t = t.replace("At the default 4% discount rate this part is under 1% of the result.", f"By default this part {NOT_COUNTED}.")
    # The split between people alive now and the future.
    t = re.sub(r"Deaths of people alive now are (?:about )?\d+% of the value,? (?:and )?the future lost (?:about )?\d+%\.",
               "Deaths of people alive now are all of the value at the defaults: the future lost counts " + COUNTED + ".", t)
    t = t.replace("Deaths of people alive now are 99% of it: those catastrophes don't take the future, and by default",
                  "Deaths of people alive now are all of it: those catastrophes don't take the future, and by default")
    t = t.replace("Deaths of people alive now are about 85% of the value, in catastrophes that end humanity's future and ones the world survives alike.",
                  "Deaths of people alive now are all of the value, in catastrophes that end humanity's future and ones the world survives alike.")
    t = t.replace("Deaths among people alive now account for most of the result, because by default", "Deaths among people alive now account for all of the result, because by default")
    # The result once given for a 0.1% discount rate is the Long-run value set's.
    t = re.sub(r"At a 0\.1% discount rate,? (?:the future counts far more,? and )?the result (rises to|is) about [\d.]+\.",
               lambda m: f"{LONG_RUN} the result {m.group(1)} about {fig['longrun']}.", t)
    t = re.sub(r"At 0\.1% the result is about [\d.]+; at 8% it is about [\d.]+\.",
               f"{LONG_RUN} the result is about {fig['longrun']}; at an 8% discount rate it is about {fig['d08']}.", t)
    t = re.sub(r"These are shared sliders, and they swing the result from about [\d.]+ to about [\d.]+\.",
               f"These are shared sliders: a cut counted for one year gives about {fig['y1']}, and the Long-run value set (a 0.1% discount rate, lives that never start in full) about {fig['longrun']}.", t)
    t = t.replace("and a share of an extinction-level war's future.", "and a share of an extinction-level war's future, counted " + COUNTED + ".")
    return t

REDWOOD = [
    ("from {{low}} to {{high}} in 90% of the simulation's draws, so the result is mostly uncertainty:", "and its simulation swings too widely to give a range, so the result is mostly uncertainty:"),
    ("Both are deeply uncertain, so the plausible range runs from {{low}} to {{high}}.", "Both are deeply uncertain, too much for the simulation to give a reliable range."),
]

changed = []
for f in sorted(glob.glob(str(ROOT / "models/*/*.json"))):
    text = open(f).read()
    m = json.loads(text)
    if m["id"] not in FIGURES:
        continue
    fig = FIGURES[m["id"]]
    fix = lambda t: reword(t, fig) if m["id"] != "redwood-research-charityevals" else reword(t, fig).replace(*REDWOOD[0]).replace(*REDWOOD[1])
    summary = m.get("summary", "")
    new = fix(summary)
    touched = False
    if new != summary:
        old_json, new_json = json.dumps(summary, ensure_ascii=False), json.dumps(new, ensure_ascii=False)
        assert text.count(old_json) == 1, (f, "summary not found once")
        text = text.replace(old_json, new_json)
        assert json.loads(text)["summary"] == new
        open(f, "w").write(text)
        touched = True
    w = ROOT / "writeups" / f"{m['id']}.md"
    if w.exists():
        old = w.read_text()
        new = fix(old)
        if new != old:
            w.write_text(new)
            touched = True
    if touched:
        changed.append(m["id"])
print(f"never-started-prose: {len(changed)} models reworded")
