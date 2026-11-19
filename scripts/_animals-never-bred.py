"""Rule animals-never-bred (owner, 18 Nov 2026; issue 33; docs/normalization.md 2.25): a meal with animal
products replaced spares animals that are then never bred. Their suffering was all the meal models counted;
their good days now count too, at the reader's two settings ("Lives that never start count", "An animal's
pain-free time counts as ... % good", both 0% by default). The engine reads it into every meal model at the
shared figure @sad_factors.sads_per_meal_replaced (src/engine/population.ts); this script adds what it reads:
the animals in a year of the world's average diet (ACE) and two derived pieces."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TODAY = "2026-11-18"

# --- The fact: all animals spared in a vegan year, the base of each kind's share of a meal's animals ---------
p = ROOT / "facts/lives.json"
facts = json.loads(p.read_text())
ids = [r["id"] for r in facts["rows"]]
assert "animals_per_person_year" not in ids
facts["rows"].insert(ids.index("farmed_birds_per_person_year"), {
    "id": "animals_per_person_year", "section": "Diets, farmed animals and births",
    "label": "Animals eaten per person a year, all kinds (world's average diet)", "unit": "animals / person-year", "format": "number",
    "value": 104.82, "kind": "estimate",
    "source": {"title": "Animal Charity Evaluators, Global meal replacement estimates (2024), 'SADs per year (global)' tab", "url": "https://docs.google.com/spreadsheets/d/1aih91kFSwOc09TJl34gJxmJY6WHOZfwHtwML2OfS9Rg/edit", "cell": "SADs per year (global)!B10", "retrieved": TODAY},
    "explainer": "Wild-caught fish (78.77), farmed fish (13.76), farmed birds (11.62), farmed mammals (0.61) and a few others. Over it, each kind's share of the animals a replaced meal spares (@sad_factors.animals_spared_per_meal_replaced).",
})
p.write_text(json.dumps(facts, indent=2, ensure_ascii=False) + "\n")

# --- The derived pieces ---------------------------------------------------------------------------------------
STEP = lambda s: f"/ @aim_sads.{s}_2024 * if($rp_species_weights, @welfare_ranges.{s}_vs_chicken, @aim_sads.{s}_2024 / @aim_sads.chicken_2024)"
new = [
    {"id": "good_days_per_animal_spared", "label": "Pain-free days in the life of an average animal a meal spares, in a chicken's days",
     "technical": "Chicken-equivalent pain-free days per animal spared by a replaced meal: each farmed kind's share of the animals in the world's average diet times its days alive less its days of disabling pain, at the species' welfare range; wild-caught fish live anyway and farmed fish have no sourced lifespan (none counted)",
     "unit": "chicken days / animal", "format": "number",
     "formula": "(@lives.farmed_birds_per_person_year * (@lives.lifespan_days_broiler - @lives.sads_per_broiler / @aim_sads.chicken_2024 + @lives.lifespan_days_laying_hen - @lives.sads_per_laying_hen / @aim_sads.chicken_2024) / 2 * @welfare_ranges.chicken_vs_chicken + @lives.farmed_mammals_per_person_year * (@lives.lifespan_days_pig - @lives.sads_per_piglet / @aim_sads.pig_2024) * @welfare_ranges.pig_vs_chicken + @lives.farmed_fish_per_person_year * @lives.pain_free_days_farmed_fish * @welfare_ranges.fish_vs_chicken) / @lives.animals_per_person_year",
     "explainer": "Not a slider. The good a replaced meal takes away with the animals it spares, before your two settings: of the animals in a year of the world's average diet (ACE), the farmed birds and pigs and their days alive not spent in pain. It counts only where lives that never start count and pain-free time counts as good."},
    {"id": "meal_ced_per_sad", "label": "A chicken's days of pain in one suffering day of a replaced meal",
     "technical": "Chicken-equivalent pain days per suffering-adjusted day (SAD) of a replaced meal: the species step (docs/normalization.md 2.4) over the meal's species shares",
     "unit": "chicken days / SAD", "format": "number",
     "formula": f"@sad_factors.meal_sads_share_fish {STEP('fish')} + @sad_factors.meal_sads_share_chicken {STEP('chicken')} + @sad_factors.meal_sads_share_pig {STEP('pig')}",
     "explainer": "Not a slider. Puts the spared animals' good days into the meal figure's own unit, so the species step every meal model takes turns them back into a chicken's days."},
]
p = ROOT / "assumptions/default.json"
s = p.read_text()
at = s.index('    {\n      "id": "life_value_multiplier"')
block = "".join("\n".join("    " + l for l in json.dumps(r, indent=2, ensure_ascii=False).split("\n")) + ",\n" for r in new)
s = s[:at] + block + s[at:]
json.loads(s)
p.write_text(s)
print("animals-never-bred: one fact and two derived pieces added")
