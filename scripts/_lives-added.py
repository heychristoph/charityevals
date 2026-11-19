"""Rule lives-added (owner, 18 Nov 2026; issue 33; docs/normalization.md 2.25): the people and animals a result
adds. A death averted is more than the survivor's own years: parents have fewer later births, the survivor has
children, and everyone who lives eats animals. So is a stillbirth averted, a birth averted by contraception, an
income raised and a future kept. The engine reads these into every model at the shared figure that values the
outcome (src/engine/population.ts); this script adds what it reads:
  - facts/lives.json: life expectancy, reproduction, the fertility response, diets and farmed animals' lives,
    by World Bank income group;
  - facts/countries.json: each country's income group;
  - assumptions: $lives_added (1 in our view, 0 in the evaluator view) and the derived pieces per income group;
  - catastrophic-risk and conservation models: the deaths that end the future add no descendants (the model's
    own future row counts them), and the future kept carries the suffering of the animals its people would eat."""
import glob
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TODAY = "2026-11-18"
GROUPS = [
    ("low_income", "low-income countries", "Low-income countries"),
    ("lower_middle_income", "lower-middle-income countries", "Lower-middle-income countries"),
    ("upper_middle_income", "upper-middle-income countries", "Upper-middle-income countries"),
    ("high_income", "high-income countries", "High-income countries"),
    ("world", "the world", "World"),
]

# --- Countries' income groups (World Bank country API, retrieved 18 Nov 2026) ---------------------------------
INCOME = {
    "L": "AFG BDI BFA CAF COD ERI ETH GMB GNB LBR MDG MLI MOZ MWI NER PRK RWA SDN SLE SOM SSD SYR TCD UGA YEM".split(),
    "LM": "AGO BEN BGD BOL BTN CIV CMR COG COM DJI EGY GHA GIN HND HTI IND KEN KGZ KHM KIR LAO LBN LSO MAR MMR MRT NAM NGA NIC NPL PAK PNG PSE SEN SLB STP SWZ TGO TJK TLS TUN TZA UZB VEN VUT ZMB ZWE".split(),
    "UM": "ALB ARG ARM AZE BIH BLR BLZ BRA BWA CHN COL CPV CUB DMA DOM DZA ECU FJI FSM GAB GEO GNQ GRD GTM IDN IRN IRQ JAM JOR KAZ LBY LCA LKA MDA MDV MEX MHL MKD MNE MNG MUS MYS PER PHL PRY SLV SRB SUR THA TKM TON TUR TUV UKR VCT VNM WSM ZAF".split(),
    "H": "ABW AND ARE ASM ATG AUS AUT BEL BGR BHR BHS BMU BRB BRN CAN CHE CHL CRI CUW CYM CYP CZE DEU DNK ESP EST FIN FRA FRO GBR GIB GRC GRL GUM GUY HKG HRV HUN IMN IRL ISL ISR ITA JPN KNA KOR KWT LIE LTU LUX LVA MAC MAF MCO MLT MNP NCL NLD NOR NRU NZL OMN PAN PLW POL PRI PRT PYF QAT ROU RUS SAU SGP SMR SVK SVN SWE SXM SYC TCA TTO URY USA VGB VIR".split(),
}

p = ROOT / "facts/countries.json"
lines = p.read_text().split("\n")
group_of = {iso: g for g, isos in INCOME.items() for iso in isos}
tagged = 0
for i, line in enumerate(lines):
    m = re.match(r'^    \{ "iso3": "([A-Z]{3})", (.*) \}(,?)$', line)
    if not m or m.group(1) not in group_of:
        continue
    assert '"income"' not in line, line
    lines[i] = f'    {{ "iso3": "{m.group(1)}", {m.group(2)}, "income": "{group_of[m.group(1)]}" }}{m.group(3)}'
    tagged += 1
assert tagged == len(group_of) == 215, (tagged, len(group_of))
text = "\n".join(lines)
old = '"note": "Regions are the UN M49 sub-regions'
assert text.count(old) == 1
text = text.replace(old, '"note": "Income groups (income: L low, LM lower-middle, UM upper-middle, H high) are the World Bank\'s, from its country API (api.worldbank.org/v2/country, incomeLevel), retrieved 18 Nov 2026; a country it does not classify has none and reads the world\'s figures. Regions are the UN M49 sub-regions')
json.loads(text)
p.write_text(text)

# --- facts/lives.json ---------------------------------------------------------------------------------------
WHO = lambda code, what: {"title": f"World Health Organization, Global Health Observatory: {what}, both sexes, 2023, by World Bank income group", "url": f"https://ghoapi.azureedge.net/api/{code}", "note": "The observatory's data API, rows with SpatialDimType WORLDBANKINCOMEGROUP or GLOBAL, Dim1 SEX_BTSX, TimeDim 2023.", "retrieved": TODAY}
WPP = {"title": "United Nations, World Population Prospects 2024, Demographic Indicators, medium variant", "url": "https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_Demographic_Indicators_Medium.csv.gz", "retrieved": TODAY}
FAO = lambda what, slug: {"title": f"FAO Food Balance Sheets via Our World in Data: {what}, food available for consumption, kilograms per person per year, 2023", "url": f"https://ourworldindata.org/grapher/{slug}", "retrieved": TODAY}
ACE = {"title": "Animal Charity Evaluators, Global meal replacement estimates (2024), 'SADs per year (global)' tab", "url": "https://docs.google.com/spreadsheets/d/1aih91kFSwOc09TJl34gJxmJY6WHOZfwHtwML2OfS9Rg/edit", "retrieved": TODAY}
ROODMAN = "https://davidroodman.com/blog/2014/04/16/the-mortality-fertility-link/"
ERS = {"title": "Muhammad, Seale, Meade and Regmi (2011), International Evidence on Food Consumption Patterns: An Update Using 2005 International Comparison Program Data, USDA Economic Research Service Technical Bulletin 1929, appendix table 5 (unconditional expenditure elasticities of demand for food subcategories, 144 countries, 2005)", "url": "https://ageconsearch.umn.edu/record/120252/files/7637_tb1929.pdf", "retrieved": TODAY}

LE = {"low_income": 64.6, "lower_middle_income": 69.6, "upper_middle_income": 76.2, "high_income": 79.8, "world": 73.3}
HALE = {"low_income": 55.4, "lower_middle_income": 59.8, "upper_middle_income": 65.9, "high_income": 67.5, "world": 62.8}
LE60 = {"low_income": 17.1, "lower_middle_income": 18.6, "upper_middle_income": 21.4, "high_income": 23.8, "world": 21.2}
NRR = {
    "low_income": (1.361, 1.0953, 0.9666), "lower_middle_income": (1.0116, 0.9386, 0.8925),
    "upper_middle_income": (0.7569, 0.7677, 0.7773), "high_income": (0.7495, 0.7663, 0.778), "world": (0.9855, 0.9231, 0.8795),
}
TFR = {"low_income": 4.53, "lower_middle_income": 2.55, "upper_middle_income": 1.48, "high_income": 1.47, "world": 2.25}
# Births parents forgo per young child's death averted: Roodman's two anchors, about 1 where women have 2
# children or fewer and 0.33 to 0.5 where couples hardly limit births (Niger, Mali, about 6.5), on a straight line.
RESPONSE = {"low_income": (0.5, 0.67, 0.9), "lower_middle_income": (0.75, 0.93, 1), "upper_middle_income": (0.9, 1, 1), "high_income": (0.9, 1, 1), "world": (0.8, 0.97, 1)}
FISH = {"low_income": 4.8, "lower_middle_income": 10.69, "upper_middle_income": 29.87, "high_income": 23.5, "world": 19.93}
POULTRY = {"low_income": 2.57, "lower_middle_income": 5.61, "upper_middle_income": 23.17, "high_income": 37.1, "world": 17.32}
PIG = {"low_income": 1.71, "lower_middle_income": 0.88, "upper_middle_income": 25.27, "high_income": 31.7, "world": 15.36}
# USDA's low-, middle- and high-income averages for fish and for meats, weighted by the species' shares of a
# meal's suffering (@sad_factors.meal_sads_share_*: fish 0.922, chickens and pigs 0.078).
ELASTICITY = {"low_income": (0.654, 0.771), "lower_middle_income": (0.521, 0.649), "upper_middle_income": (0.521, 0.649), "high_income": (0.379, 0.490), "world": (0.521, 0.649)}

rows = []
def row(id, label, value, kind, source=None, explainer=None, unit=None, fmt="number", section=None):
    r = {"id": id, **({"section": section} if section else {}), "label": label, **({"unit": unit} if unit else {}), "format": fmt, "value": value, "kind": kind}
    if source: r["source"] = source
    if explainer: r["explainer"] = explainer
    rows.append(r)

for g, name, cap in GROUPS:
    S = cap
    row(f"life_expectancy_{g}", f"Life expectancy at birth, {name}", LE[g], "observed", WHO("WHOSIS_000001", "life expectancy at birth"), "How long a newborn lives on average: the years a life that starts, or a life saved in infancy, adds.", "years", section=S)
    row(f"healthy_life_expectancy_{g}", f"Healthy life expectancy at birth, {name}", HALE[g], "observed", WHO("WHOSIS_000002", "healthy life expectancy (HALE) at birth"), "Years lived in full health on average: the healthy years of a life that never starts otherwise (docs/normalization.md 2.25).", "years", section=S)
    row(f"life_expectancy_at_60_{g}", f"Life expectancy at age 60, {name}", LE60[g], "observed", WHO("WHOSIS_000015", "life expectancy at age 60"), "Years a 60-year-old lives on average. With life expectancy at birth it gives the years a survivor of any age has left (a straight line between the two, falling to nothing at 95).", "years", section=S)
    for year, v in zip((2050, 2075, 2100), NRR[g]):
        row(f"reproduction_{year}_{g}", f"Surviving daughters per woman in {year}, {name} (net reproduction rate)", v, "estimate", {**WPP, "note": f"Location {cap if g != 'world' else 'World'}, Time {year}, column NRR."}, "How many people replace each person a generation on: 1 keeps the population level. The first generation after a life saved today reads 2050, the second 2075, the third and later 2100 (at most 1: no population grows for ever).", "per woman", section=S)
    lo, best, hi = RESPONSE[g]
    row(f"births_averted_per_child_death_{g}", f"Births parents forgo for each young child's death averted, {name}", {"low": lo, "best": best, "high": hi}, "judgment",
        {"title": "David Roodman (2014), The impact of life-saving interventions on fertility, for GiveWell", "url": ROODMAN, "quote": "Here, mortality-drop-fertility-drop ratios of 1:0.5 and 1:0.33 appear more plausible.", "retrieved": TODAY},
        f"When fewer children die, parents have fewer later births. Roodman's review: nearly one birth fewer per life saved where women have about 2 children or fewer (\"The impact of mortality drops on fertility will be nearly 1:1\"), a third to a half where couples hardly limit births (Niger and Mali, about 6.5 children). Ours: a straight line between those two anchors at this group's {TFR[g]} births per woman (UN, 2023), and a range to both anchors' ends.", "births", section=S)
    for what, table, slug in (("fish", FISH, "fish-and-seafood-consumption-per-capita"), ("poultry", POULTRY, "per-capita-meat-type"), ("pig", PIG, "per-capita-meat-type")):
        row(f"{what}_supply_{g}", f"{'Fish and seafood' if what == 'fish' else 'Poultry meat' if what == 'poultry' else 'Pig meat'} available per person a year, {name}", table[g], "observed", FAO("fish and seafood" if what == "fish" else f"{what} meat", slug), "Scales the animals a person eats, and their suffering, from the world's average diet to this group's.", "kg / person / year", section=S)
    fish, meat = ELASTICITY[g]
    row(f"animal_food_income_elasticity_{g}", f"Rise in animal products eaten per rise in income, {name} (income elasticity)", {"low": fish, "best": round(0.922 * fish + 0.078 * meat, 3), "high": meat}, "estimate", ERS,
        f"A 1% higher income raises spending on fish by {fish}% and on meats by {meat}% (USDA's average for {'low' if g == 'low_income' else 'high' if g == 'high_income' else 'middle'}-income countries). Best guess: the two weighted by the species' shares of a meal's suffering (fish 0.922). An income raised by a year of doubling adds this share of a person-year's animals eaten.", "% per %", section=S)

G = "Diets, farmed animals and births"
row("generation_years", "Years from one generation to the next (mean age at childbearing, world)", 28.202, "observed", {**WPP, "note": "Location World, Time 2023, column MAC (mean age at childbearing)."}, "How far in the future a survivor's children, and theirs, are born: each generation's lives are discounted by this many years more.", "years", section=G)
row("sads_per_person_year", "Suffering-adjusted days of the animals one person eats in a year (world's average diet)", 2819.7, "estimate", {**ACE, "cell": "SADs per year (global)!A2:F10", "note": "Animals spared per vegan year times SADs per animal at the mean of ACE's bounds: wild-caught fishes 78.77 x 19.17, farmed fishes 13.76 x 78.9, farmed birds 11.62 x 15.735, farmed mammals 0.61 x 59.7, farmed reptiles and amphibians 0.06 x 78.9. In 2024 SADs."},
    "What a person-year of the world's average diet costs the animals eaten, in the days of suffering the diet-change models count per meal (the same sheet their species shares come from, @sad_factors.meal_sads_share_*). Every person a result adds eats for the years they live.", "SADs / person-year", section=G)
row("farmed_birds_per_person_year", "Farmed birds eaten per person a year (world's average diet)", 11.62, "estimate", {**ACE, "cell": "SADs per year (global)!B4"}, "Chickens raised for one person's meat and eggs in a year: lives that would not start without the eater.", "animals / person-year", section=G)
row("farmed_mammals_per_person_year", "Farmed mammals eaten per person a year (world's average diet)", 0.61, "estimate", {**ACE, "cell": "SADs per year (global)!B5"}, "Mostly pigs.", "animals / person-year", section=G)
row("farmed_fish_per_person_year", "Farmed fish eaten per person a year (world's average diet)", 13.76, "estimate", {**ACE, "cell": "SADs per year (global)!B3"}, "Farmed fish only: a wild-caught fish (79 a year) lives whether or not it is eaten, so its life is not one that never starts.", "animals / person-year", section=G)
row("sads_per_broiler", "Suffering-adjusted days in a broiler chicken's life (ACE)", 2.53, "estimate", {**ACE, "cell": "SADs per year (global)!D4"}, "ACE's lower-bound animal for a farmed bird, in 2024 SADs. Over Ambitious Impact's weight for a chicken it is the days of disabling pain in the life.", "SADs", section=G)
row("sads_per_laying_hen", "Suffering-adjusted days in a caged laying hen's life (ACE)", 28.94, "estimate", {**ACE, "cell": "SADs per year (global)!F4"}, "ACE's upper-bound animal for a farmed bird, in 2024 SADs.", "SADs", section=G)
row("sads_per_piglet", "Suffering-adjusted days in a pig's life raised for meat (ACE)", 34.85, "estimate", {**ACE, "cell": "SADs per year (global)!D5"}, "ACE's lower-bound animal for a farmed mammal (a piglet raised for slaughter), in 2024 SADs.", "SADs", section=G)
row("lifespan_days_broiler", "Days a broiler chicken lives", {"low": 42, "best": 44.5, "high": 47}, "observed", {"title": "Welfare Footprint Project, Welfare of broiler chickens", "url": "https://welfarefootprint.org/?p=5677", "quote": "average slaughter weight of broilers in the EU and the US is, respectively, 2.5 kg and 2.9 kg, reached at 42 and 47 days.", "retrieved": TODAY}, "The days alive of which the pain-free ones may count as good (your setting).", "days", section=G)
row("lifespan_days_laying_hen", "Days a laying hen lives", {"low": 504, "best": 532, "high": 560}, "estimate", {"title": "Zootecnica International, Layer production cycle reaching week 100", "url": "https://zootecnicainternational.com/eggs/layer-production-cycle-reaching-week-100/", "quote": "The production cycle of laying hens conventionally ends before 80 weeks old", "retrieved": TODAY}, "72 to 80 weeks from hatch to the end of laying; the best guess is the middle.", "days", section=G)
row("lifespan_days_pig", "Days a pig raised for meat lives", {"low": 154, "best": 161, "high": 168}, "observed", {"title": "Frontiers in Animal Science (2026), study of a commercial pig farm in Colombia", "url": "https://www.frontiersin.org/journals/animal-science/articles/10.3389/fanim.2026.1768496/full", "quote": "from birth until their transfer to the slaughter plant at 22 to 24 weeks of age", "retrieved": TODAY}, "22 to 24 weeks.", "days", section=G)
row("pain_free_days_farmed_fish", "Pain-free days in a farmed fish's life (none counted)", 0, "judgment", None, "None counted: we found no source we could open for how long a farmed fish lives (ACE's stand-in is a farmed salmon), so its pain-free days are left at 0 whatever you set. A sourced lifespan would replace this.", "days", section=G)
row("unwanted_births_averted_per_cyp", "Births that never happen per year of modern contraception (GiveWell)", {"low": 0.033, "best": 0.049, "high": 0.065}, "estimate",
    {"title": "GiveWell, Valuing contraception, 'Model' tab: number of unwanted births averted per year of modern contraception", "url": "https://docs.google.com/spreadsheets/d/1-wJwHvqgIZIlXHx-bgSmEuX5ITV4OOxCdYZkrXpndtc/edit", "cell": "Model!B11", "retrieved": TODAY},
    "Of the 0.3 unintended pregnancies a year of contraception averts (GiveWell's 0.2 to 0.4), 49% would end in a birth and a third of those births are unwanted rather than mistimed: 0.049 births that never happen. The 0.099 mistimed births a year happen later, so they are not lives that never start. Range: GiveWell's 0.2 to 0.4 pregnancies.", "births / year", section=G)

facts = {"id": "lives", "label": "Lives a result adds: life expectancy, reproduction, diets and farmed animals' lives", "rows": rows}
(ROOT / "facts/lives.json").write_text(json.dumps(facts, indent=2, ensure_ascii=False) + "\n")

# --- Assumptions: the switch and the derived pieces per income group -----------------------------------------
D = "(1 + $discount_rate) ^ -@lives.generation_years"
STEP = lambda s: f"/ @aim_sads.{s}_2024 * if($rp_species_weights, @welfare_ranges.{s}_vs_chicken, @aim_sads.{s}_2024 / @aim_sads.chicken_2024)"
def animal(g):
    ratio = lambda what: "" if g == "world" else f" * @lives.{what}_supply_{g} / @lives.{what}_supply_world"
    pain = (f"@lives.sads_per_person_year * (@sad_factors.meal_sads_share_fish{ratio('fish')} {STEP('fish')}"
            f" + @sad_factors.meal_sads_share_chicken{ratio('poultry')} {STEP('chicken')}"
            f" + @sad_factors.meal_sads_share_pig{ratio('pig')} {STEP('pig')})")
    good = (f"(@lives.farmed_birds_per_person_year{ratio('poultry')} * (@lives.lifespan_days_broiler - @lives.sads_per_broiler / @aim_sads.chicken_2024 + @lives.lifespan_days_laying_hen - @lives.sads_per_laying_hen / @aim_sads.chicken_2024) / 2 * @welfare_ranges.chicken_vs_chicken"
            f" + @lives.farmed_mammals_per_person_year{ratio('pig')} * (@lives.lifespan_days_pig - @lives.sads_per_piglet / @aim_sads.pig_2024) * @welfare_ranges.pig_vs_chicken"
            f" + @lives.farmed_fish_per_person_year{ratio('fish')} * @lives.pain_free_days_farmed_fish * @welfare_ranges.fish_vs_chicken)")
    return f"$chicken_vs_person * $daly_per_sad * @sad_factors.production_response * ({pain} - $never_started_weight * $pain_free_time_good / (365 * $daly_per_sad) * {good})"

new = [{
    "id": "lives_added", "label": "Count the people and animals a result adds", "technical": "Switch on the lives a death averted, a stillbirth averted, a year of contraception, an income raised and a future kept add besides the life itself (src/engine/population.ts)",
    "format": "toggle", "value": 1, "kind": "judgment",
    "explainer": "On (our view): a life saved also changes how many people are born later and how many animals are raised to feed them, and each shared value of a death, a stillbirth, a year of contraception and a year of doubled income is read with that (docs/normalization.md 2.25). Off (the evaluator view), so an evaluator's own results reproduce. Not offered as a control: \"Side effects count\" scales it, \"Lives that never start count\" weighs the people.",
}]
for g, name, cap in GROUPS:
    n1, n2, n3 = f"@lives.reproduction_2050_{g}", f"@lives.reproduction_2075_{g}", f"min(1, @lives.reproduction_2100_{g})"
    new += [
        {"id": f"descendants_{g}", "label": f"Lives that follow from one life, {name}, discounted", "technical": "Discounted descendants per person: each generation the last times the net reproduction rate; 0 where the sum has no end (a 0% discount rate, which only an evaluator's sheet pins)", "unit": "lives", "format": "number",
         "formula": f"iferror({n1} * {D} + {n1} * {n2} * ({D}) ^ 2 + {n1} * {n2} * {n3} * ({D}) ^ 3 / (1 - {n3} * {D}), 0)",
         "explainer": "Not a slider. A person's children, grandchildren and so on, each generation the last times the UN's surviving daughters per woman and discounted a generation further (facts: lives.reproduction_*, lives.generation_years); from the third generation on at the 2100 figure, at most 1."},
        {"id": f"newborn_life_years_{g}", "label": f"Years a life lasts, {name}, discounted from birth", "technical": "Present value of life expectancy at birth as a stream of years", "unit": "years", "format": "number",
         "formula": f"iferror((1 - (1 + $discount_rate) ^ -@lives.life_expectancy_{g}) / ln(1 + $discount_rate), @lives.life_expectancy_{g})",
         "explainer": "Not a slider. Life expectancy at birth as a stream of years, discounted at your rate: the years a person who is added eats animals for."},
        {"id": f"newborn_healthy_years_{g}", "label": f"Healthy years in a life, {name}, discounted from birth", "technical": "Present value of healthy life expectancy (HALE) at birth", "unit": "years of healthy life", "format": "number",
         "formula": f"$newborn_life_years_{g} * @lives.healthy_life_expectancy_{g} / @lives.life_expectancy_{g}",
         "explainer": "Not a slider. The good in a person's life that never starts otherwise, counted times \"Lives that never start count\"."},
        {"id": f"animal_dalys_per_person_year_{g}", "label": f"Suffering of the animals one person eats in a year, {name}, in years of healthy life", "technical": "Healthy years (DALYs) of animal suffering per person-year of diet: suffering-adjusted days through the species step, net of farmed animals' weighted pain-free days", "unit": "years of healthy life / person-year", "format": "number",
         "formula": animal(g),
         "explainer": "Not a slider. ACE's suffering-adjusted days for a year of the world's average diet, scaled to this group's fish, poultry and pig meat (FAO), times the fall in production per unit not eaten, through the species step every animal model takes (2.4), in a person's healthy time. Less the farmed animals' pain-free days, where you count them as good and count lives that never start."},
    ]
p = ROOT / "assumptions/default.json"
s = p.read_text()
at = s.index('    {\n      "id": "life_value_multiplier"')
block = "".join("\n".join("    " + l for l in json.dumps(r, indent=2, ensure_ascii=False).split("\n")) + ",\n" for r in new)
s = s[:at] + block + s[at:]
json.loads(s)
p.write_text(s)

# --- Catastrophic risk and conservation: the future is counted once, with its animals ------------------------
VALUE_ROWS = {"value_per_death", "covid_value_per_death", "catastrophe_value_per_death"}
HARM = "future_animal_harm"
def add_field(lines, row_id, field):
    idx = [i for i, l in enumerate(lines) if l == f'      "id": "{row_id}",']
    assert len(idx) == 1, (row_id, idx)
    end = idx[0]
    while not lines[end].startswith("    }"):
        end += 1
    last = lines[end - 1]
    assert last.startswith("      ") and not last.startswith("       "), last
    lines[end - 1] = last.rstrip() + ("" if last.rstrip().endswith(",") else ",")
    lines.insert(end, f"      {field}")

done = 0
for f in sorted(glob.glob(str(ROOT / "models/*/*.json"))):
    text = open(f).read()
    m = json.loads(text)
    byid = {r["id"]: r for r in m["rows"]}
    if "future_dalys_averted" not in byid:
        continue
    lines = text.split("\n")
    values = [i for i in byid if i in VALUE_ROWS]
    assert values, f
    for i in values:
        add_field(lines, i, '"descendants": false')
    future = byid["future_dalys_averted"]
    idx = [i for i, l in enumerate(lines) if l == '      "id": "future_dalys_averted",'][0]
    end = idx
    while not lines[end].startswith("    }"):
        end += 1
    harm = {
        "id": HARM, "section": future["section"], "label": "Suffering of the farmed animals the people of that future would eat, in healthy years", "format": "number",
        "formula": f"-({future['formula']}) * $lives_added * $animal_dalys_per_person_year_world", "unit": "DALYs",
        "explainer": "A future kept is also every animal raised to feed it: each future person-year at the suffering of the animals an average person eats in a year today (docs/normalization.md 2.25). Suffering always counts, whatever lives that never start count; the farmed animals' own good days count where you set them to. Held at today's diet: no forecast of what people will eat is used.",
        "side_effect": "added",
    }
    # Where the future's own formula already reads a side effect (conservation's unmodelled benefits), a second
    # mark would weigh it twice: the row then moves with the weight through that one.
    seen, stack = set(), [future["id"]]
    while stack:
        for t in re.findall(r"(?<![$@.\w])[a-z_][a-z0-9_]*\b(?!\s*\()", byid[stack.pop()].get("formula", "")):
            if t in byid and t not in seen:
                seen.add(t)
                stack.append(t)
    if any(byid[t].get("side_effect") for t in seen):
        del harm["side_effect"]
    block = ["    {"] + ["      " + l for l in json.dumps(harm, indent=2, ensure_ascii=False).split("\n")[1:-1]] + ["    },"]
    lines[end + 1:end + 1] = block
    text = "\n".join(lines)
    direct = byid["dalys_direct"]["formula"]
    assert direct.count("future_dalys_averted") == 1, (f, direct)
    old = json.dumps(direct, ensure_ascii=False)
    assert text.count(f'"formula": {old}') >= 1, (f, old)
    text = text.replace(f'"formula": {old}', f'"formula": {json.dumps(direct.replace("future_dalys_averted", f"(future_dalys_averted + {HARM})"), ensure_ascii=False)}')
    after = {r["id"]: r for r in json.loads(text)["rows"]}
    assert all(after[i]["descendants"] is False for i in values) and HARM in after["dalys_direct"]["formula"], f
    open(f, "w").write(text)
    done += 1
assert done == 31, done
print(f"lives-added: {tagged} countries with an income group; facts/lives.json with {len(rows)} figures; {len(new)} assumptions; {done} models' future rows")
