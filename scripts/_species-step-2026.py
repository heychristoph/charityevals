"""Rule species-step-2026: ACE's 2026 SADs (Ambitious Impact's method v2, April 2026) carry no species weight,
so the weight inside them is 1. Greener by Default, the one model on them, takes the shared species step
(docs/normalization.md 2.4) with that version: `sads_<s> / @aim_sads.<s>_2026 * if($rp_species_weights,
@welfare_ranges.<s>_vs_chicken, @aim_sads.<s>_2026 / @aim_sads.chicken_2024)`, so the toggle is read and the
evaluator view counts ACE's SADs as SADs (it multiplied them by Rethink Priorities' welfare ranges). Our
view doesn't move (weight 1 in, Rethink's range out, as before).

    python3 scripts/_species-step-2026.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPECIES = {"shrimp": "a farmed shrimp (extensive farming): 76.5 SADs, the sum of its pain-scaled days",
           "chicken": "a battery-caged hen: 29.5 SADs, 7.5 + 15.4 + 6.7 + 0 pain-scaled days",
           "fish": "every species alike",
           "pig": "every species alike"}
SHEET = "https://docs.google.com/spreadsheets/d/14D-LlxdO88dVXyY9FlNJd6oJfX9PCCIJCKavTERTQEU/edit"
NAMES = {"shrimp": "a shrimp's", "chicken": "a hen's", "fish": "a fish's", "pig": "a pig's"}

# --- facts/aim_sads.json: the 2026 (v2) weights, 1 ----------------------------------------------------------
facts = ROOT / "facts/aim_sads.json"
text = facts.read_text()
if '"chicken_2026"' not in text:
    rows = []
    for s, eg in SPECIES.items():
        rows.append({
            "id": f"{s}_2026", "label": f"Ambitious Impact's weight for {NAMES[s]} suffering against a person's (2026 SADs)",
            "unit": "× a person", "format": "number", "value": 1, "kind": "estimate",
            "source": {"title": "ACE, 2026 SADs summary", "url": SHEET,
                       "quote": "Type of Pain, Days, Days in Disabling Pain-Equivalents, % of SADs",
                       "note": f"Each species' SADs are the sum of its days in disabling-pain equivalents, with no species multiplier ({eg}). Ambitious Impact's method v2 (April 2026) made the unweighted figure its main output.",
                       "retrieved": "2026-11-18"},
            "explainer": "ACE's 2026 SADs count days of pain weighted by intensity only: no sentience probability or welfare range is built in, so the weight to take out is 1. Models on 2026 SADs put Rethink Priorities' welfare range in (our view) or Ambitious Impact's 2024 hen weight's inverse (evaluator view, where the chicken slider is pinned to it), so ACE's SADs count as SADs there."})
    block = ",\n".join("    " + json.dumps(r, indent=2, ensure_ascii=False).replace("\n", "\n    ") for r in rows)
    assert text.endswith("\n  ]\n}\n")
    text = text[: -len("\n  ]\n}\n")] + ",\n" + block + "\n  ]\n}\n"
    facts.write_text(text)

# --- models/animal-welfare/greener-by-default.json -----------------------------------------------------------
p = ROOT / "models/animal-welfare/greener-by-default.json"
t = p.read_text()
for s in SPECIES:
    t = t.replace(f'"id": "pain_days_{s}"', f'"id": "sads_{s}"')
    t = t.replace(f'"label": "Pain days averted per dollar you give: ', '"label": "SADs averted per dollar you give: ')
    t = t.replace(f'"formula": "pain_days_{s} * @welfare_ranges.{s}_vs_chicken"',
                  f'"formula": "sads_{s} / @aim_sads.{s}_2026 * if($rp_species_weights, @welfare_ranges.{s}_vs_chicken, @aim_sads.{s}_2026 / @aim_sads.chicken_2024)"')
t = t.replace('"explainer": "Days of this species\' pain counted as a chicken\'s with Rethink Priorities\' welfare range."',
              '"explainer": "The shared species step on 2026 SADs, whose species weight is 1: in our view days of this species\' pain counted as a chicken\'s with Rethink Priorities\' welfare range; in the evaluator view ACE\'s SADs count as SADs."')
t = t.replace('So they enter as days of this species\' disabling pain."', 'So they enter as days of this species\' disabling pain (`@aim_sads.<species>_2026` = 1)."')
old = '      "chicken_vs_person": 0.463966,\n      "mobiliser_share": 1\n'
assert old in t
t = t.replace(old, '      "chicken_vs_person": 0.463966,\n      "rp_species_weights": 0,\n      "mobiliser_share": 1\n')
assert "pain_days_" not in t, "a pain_days_ reference is left"
p.write_text(t)
print("greener-by-default: species step on 2026 SADs; facts aim_sads.*_2026 = 1")
