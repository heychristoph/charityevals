"""Run: python3 .claude/skills/build-cea/scripts/gen-templates.py
Generates the build-cea template skeletons. Each is a valid model file (kind "template") whose
numbers are placeholders marked TEMPLATE; the lint (npm run check, src/engine/lint.test.ts) refuses a
model that still has one. Filled in, each ends in a ranked unit (uov, wellby, ced) and passes
scripts/normalization-audit.ts: output.native is the bottom line before our shared steps, the donor
(and, for animals, species) sections are kind "ours", animal models go through ced_<species>."""
import json, sys, os

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "templates")
EX = "https://example.org/REPLACE"
D = "2026-01-01"

def src(title, page="REPLACE: page/table", quote="REPLACE: verbatim sentence"):
    return {"title": f"TEMPLATE: {title}", "url": EX, "page": page, "quote": quote, "retrieved": D}

def inp(id, section, label, value, kind, explainer, fmt="number", unit=None, source=None):
    r = {"id": id, "section": section, "label": label, "format": fmt, "value": value, "kind": kind}
    if unit: r["unit"] = unit
    if source: r["source"] = source
    r["explainer"] = "TEMPLATE: " + explainer
    return r

def f(id, section, label, formula, explainer=None, fmt="number", unit=None):
    r = {"id": id, "section": section, "label": label, "format": fmt, "formula": formula}
    if unit: r["unit"] = unit
    if explainer: r["explainer"] = explainer
    return r

SECTIONS = [
    {"id": "cost", "title": "Cost", "explainer": "What the modelled program cost in the period the outcomes below are counted for, including its share of overhead. From audited financial statements or the annual report."},
    {"id": "reach", "title": "Reach", "explainer": "How many people, animals or meals the spending reached, as the charity reports it."},
    {"id": "effect", "title": "Effect per unit", "explainer": "What the intervention does for each unit reached, from the best available studies, before any adjustment."},
    {"id": "adjustments", "title": "Adjustments", "explainer": "Discounts for weaker evidence, what would have happened anyway, credit shared with others, and delivery falling short. All multiply the outcome."},
    {"id": "outcome", "title": "Outcome", "explainer": "The outcome in the family's shared unit, per dollar."},
    {"id": "donor", "title": "Your dollar's share", "kind": "ours", "explainer": "Staff who earn less than they could elsewhere pay part of the cost in kind. With credit by share of resources, your dollar is credited with its share of the full cost only."},
]
SPECIES_SECTION = {"id": "species", "title": "In chicken pain days", "kind": "ours", "explainer": "charityevals' standard step for every animal model. The shared SAD figures are Ambitious Impact's, which count each species' pain as a share of a person's with its own species weights. Here those weights come out and Rethink Priorities' go in, so every species is counted in days of a chicken's disabling pain. How a chicken compares with a person is the one animal slider."}

def cost_rows():
    return [
        inp("program_spend", "cost", "Spending on the modelled program(s) in the period", 1_000_000, "observed",
            "program expenses for the activities modelled below, for the same year as the reach numbers. Cite the audited statement of functional expenses (or the annual report) and the page.", "usd", source=src("audited financial statements")),
        inp("total_expenses", "cost", "Total expenses (all programs, management, fundraising)", 1_200_000, "observed",
            "total expenses for the same year, from the same document.", "usd", source=src("audited financial statements")),
        inp("program_expenses", "cost", "Program expenses (all programs)", 1_000_000, "observed",
            "program-service expenses for the same year, from the same document.", "usd", source=src("audited financial statements")),
        f("overhead_ratio", "cost", "Overhead multiplier (total ÷ program expenses)", "total_expenses / program_expenses",
          "Spreads management and fundraising over programs in proportion to their cost, as GiveWell and ACE do.", "multiple"),
        f("cost_total", "cost", "Cost of the modelled program, including overhead", "program_spend * overhead_ratio", None, "usd"),
    ]

def adj_rows(extra=(), leverage=False, unmodelled=False, implementation=True):
    rows = [
        inp("evidence_adj", "adjustments", "Evidence adjustment (internal and external validity)", {"low": 0.5, "best": 0.7, "high": 0.9}, "judgment",
            "how far the effect size above should be trusted for this charity's setting: publication bias, self-report bias, replication, differences between study populations and this program. 1 = take the studies at face value. Explain each component and give the range.", "multiple"),
        inp("counterfactual_adj", "adjustments", "Share of the outcome that wouldn't have happened anyway", {"low": 0.6, "best": 0.8, "high": 0.95}, "judgment",
            "the share of the outcome that would not have happened without the program (other providers, existing trends, government). Cite coverage data or trend data where possible.", "percent"),
        inp("attribution_share_shared", "adjustments", "This charity's share of credit, when shared with others", {"low": 0.5, "best": 0.8, "high": 1}, "judgment",
            "where other organisations contributed to the same outcome (co-funders, coalition campaigns, government delivery), the share credited to this charity. 1 when it delivers alone.", "percent"),
        f("attribution_share", "adjustments", "Share of credit used", "attribution_share_shared",
          "The charity's share of the resources behind the outcome; it applies whichever way credit is shared.", "percent"),
    ]
    if implementation:
        rows.append(inp("implementation_adj", "adjustments", "Delivery adjustment (fidelity, compliance, follow-through)", {"low": 0.6, "best": 0.8, "high": 0.95}, "judgment",
            "the share of the reported reach that actually receives the intervention as studied: dose completion, coverage survey vs. reported, companies honouring pledges.", "percent"))
    if leverage:
        rows.append(inp("leverage_funging_adj", "adjustments", "Leverage and funging", {"low": 0.85, "best": 0.95, "high": 1.05}, "judgment",
            "below 1 when other funders (governments, the Global Fund) would have paid for this work without the donation; above 1 when the donation pulls in other money. GiveWell's top charities typically sit at 0.85–0.95.", "multiple"))
    rows += list(extra)
    factors = ["evidence_adj", "counterfactual_adj", "attribution_share"] + (["implementation_adj"] if implementation else []) + (["leverage_funging_adj"] if leverage else [])
    rows.append(f("total_adj", "adjustments", "All adjustments combined", " * ".join(factors), "The product of the adjustments above.", "multiple"))
    if unmodelled:
        rows.append(inp("unmodelled_benefits_adj", "adjustments", "Benefits and costs not modelled, as a share of modelled value", {"low": 0, "best": 0.1, "high": 0.25}, "judgment",
            "GiveWell-style supplementary adjustment: list each effect not modelled (morbidity, stillbirths, treatment costs averted, rebound effects) with its sign and size.", "percent"))
    return rows

def donor_rows(prefix, unit_label):
    return [
        inp("staff_cost_share", "donor", "Staff pay as a share of total cost", {"low": 0.1, "best": 0.2, "high": 0.3}, "estimate",
            "salaries and benefits ÷ total expenses, from the statement of functional expenses (or Form 990 Part IX lines 5–9).", "percent", source=src("audited financial statements")),
        inp("salary_gap", "donor", "Pay gap versus comparable for-profit jobs", {"low": 0, "best": 0.15, "high": 0.35}, "judgment",
            "how much less staff earn than in comparable for-profit roles. Anchor on the sector defaults in scripts/link-resource-shares.py (SECTORS: delivery 10%, services 15%, media 20%, research 30%) or, for animal advocacy, the 35% the ACE models use.", "percent"),
        f("salary_sacrifice", "donor", "Salary forgone by staff (in-kind donation)", "cost_total * staff_cost_share * salary_gap / (1 - salary_gap)", None, "usd"),
        f("donor_cost_share", "donor", "Share of the full cost paid by cash donations", "cost_total / (cost_total + if($resource_shares, salary_sacrifice, 0))", None, "percent"),
        f(f"{prefix}_per_donor_dollar", "donor", f"{unit_label} per dollar you give", f"{prefix}_per_dollar * donor_cost_share", None, "small", f"{unit_label} / $"),
    ]

def species_rows(shares):
    """The species step (docs/normalization.md 2.4): SADs per donor dollar split by species, each converted
    with the standard ced_<species> template (src/engine/invariants.ts CED_TEMPLATES.aim), then summed."""
    names = {"chicken": "chickens", "pig": "pigs", "fish": "fish", "shrimp": "shrimp"}
    rows = []
    for sp, share in shares:
        rows.append(f(f"sads_{sp}", "species", f"SADs averted per dollar you give: {names[sp]}", f"sads_per_donor_dollar * {share}" if share else "sads_per_donor_dollar",
                      None if share else "TEMPLATE: one species takes all the SADs. For several, add a sads_<species> row per species with its share (a sourced fact or a judgment row with a range) and a ced_<species> row for each.", "number"))
        rows.append(f(f"ced_{sp}", "species", f"Chicken-equivalent pain days averted per dollar you give: {names[sp]}",
                      f"sads_{sp} / @aim_sads.{sp} * if($rp_species_weights, @welfare_ranges.{sp}_vs_chicken, @aim_sads.{sp} / @aim_sads.chicken)",
                      "Ambitious Impact's species weight taken out and Rethink Priorities' (relative to a chicken) put in. The formula is the standard one; don't edit it.", "number"))
    rows.append(f("ced_per_donor_dollar", "species", "Chicken-equivalent pain days averted per dollar you give", " + ".join(f"ced_{sp}" for sp, _ in shares), None, "small", "chicken pain days / $"))
    return rows

def model(family, name, unit, prefix, unit_label, cause, rows, summary, species=None):
    out = {"row": f"{prefix}_per_donor_dollar", "unit": unit, "label": f"{unit_label} per dollar you give", "native": {"row": f"{prefix}_per_dollar", "unit": unit}}
    if species:
        out = {"row": "ced_per_donor_dollar", "unit": "ced", "label": "Chicken-equivalent pain days averted per dollar you give",
               "native": {"row": f"{prefix}_per_dollar", "unit": unit}, "species": [sp for sp, _ in species]}
        rows = rows + species_rows(species)
    return {
        "id": f"template-{family}",
        "name": f"Template: {name}",
        "kind": "template",
        "cause": cause,
        "template": family,
        "charity": "template-charity",
        "owner": "charityevals",
        "summary": "TEMPLATE: " + summary,
        "resources": [],
        "sections": SECTIONS + ([SPECIES_SECTION] if species else []),
        "rows": rows,
        "output": out,
    }

BOTTOM = "the bottom line in years of healthy life per $1,000 (quote it live in the write-up), and the biggest uncertainty."

T = {}

# --- direct-health ---------------------------------------------------------------------------
T["direct-health"] = model("direct-health", "direct health (deaths and illness averted)", "uov", "uov", "Units of value", "global-health",
    cost_rows() + [
        inp("people_reached", "reach", "People reached in the period", 100_000, "observed",
            "people who received the intervention in the year the spending covers (children dosed, people sleeping under nets distributed, infants vaccinated). Prefer independent coverage surveys to administrative counts; note which.", "integer", source=src("charity annual report / coverage survey")),
        f("cost_per_person", "reach", "Cost per person reached", "cost_total / people_reached", "Context: compare with the charity's own figure and with other models of the family.", "usd"),
        inp("years_of_coverage", "reach", "Years of protection per person reached", {"low": 0.5, "best": 1, "high": 1.5}, "estimate",
            "how long one round of the intervention protects a person (e.g. one dose, one net's useful life × usage).", "number", "years", src("study or program data")),
        inp("baseline_mortality_rate", "effect", "Annual mortality the intervention can reduce, in the target group", 0.005, "observed",
            "deaths per person-year from the causes the intervention affects, in the target age group and region, without the program. Use (or add) a country fact in facts/<country>.json (IHME GBD, UN IGME, DHS).", "small", "deaths / person-year", src("IHME GBD / UN IGME")),
        inp("mortality_reduction", "effect", "Reduction in that mortality from the intervention", {"low": 0.05, "best": 0.12, "high": 0.2}, "estimate",
            "relative risk reduction from the best meta-analysis (Cochrane or equivalent); the 95% CI as low/high.", "percent", source=src("meta-analysis")),
        f("deaths_averted_per_person", "effect", "Deaths averted per person reached (before adjustments)", "baseline_mortality_rate * mortality_reduction * years_of_coverage",
          "If the intervention protects several age groups with different risks, replace this formula with one row per group and sum them here.", "small"),
        inp("share_under5", "effect", "Share of deaths averted that are of children under five", {"low": 0.6, "best": 0.8, "high": 0.95}, "estimate",
            "the age split of the deaths averted, from the age split of cause-specific deaths in the target group.", "percent", source=src("IHME GBD")),
        inp("morbidity_value_ratio", "effect", "Value of illness averted, as a share of the value of deaths averted", 0, "estimate",
            "illness averted (GBD disability weights × cases averted × duration) valued against the deaths averted, as GiveWell's supplementary adjustments do. A share, not DALYs × an exchange rate: no rate between outcomes may sit inside a model (docs/normalization.md INV-2). 0 with an explanation when illness is covered by unmodelled_benefits_adj instead; never both.", "percent", source=src("IHME GBD disability weights / GiveWell")),
        inp("ln_income_gain_per_year", "effect", "Later-life income gain per person reached, ln(consumption) per year", 0, "estimate",
            "the yearly increase in ln(consumption) in adulthood from developmental effects (e.g. malaria or deworming and adult earnings), per person reached, undiscounted. 0 with an explanation when there is no evidence.", "small", "ln / year", src("study")),
        inp("years_until_income_gain", "effect", "Years until the income gain starts", {"low": 8, "best": 10, "high": 15}, "estimate",
            "years from the intervention to adult earnings (GiveWell uses about 10 for child-health programs).", "number", "years", src("study / GiveWell")),
        inp("years_income_gain_lasts", "effect", "Years the income gain lasts", {"low": 20, "best": 40, "high": 45}, "estimate",
            "working years over which the gain lasts (GiveWell uses 40).", "number", "years", src("study / GiveWell")),
        f("ln_income_gain_per_person", "effect", "Later-life income gain per person reached, present value", "pv_annuity_due(ln_income_gain_per_year, $discount_rate, years_income_gain_lasts) / (1 + $discount_rate) ^ years_until_income_gain",
          "Discounted at the shared rate, so the result moves with it. Never type in a present value worked out elsewhere: rebuild it from its inputs.", "small", "ln-years"),
    ] + adj_rows(leverage=True, unmodelled=True) + [
        f("deaths_averted", "outcome", "Deaths averted", "people_reached * deaths_averted_per_person * total_adj", None, "number"),
        f("value_per_death", "outcome", "Value of a death averted (units of value)", "(share_under5 * @moral_weights.uov_per_death_under5 + (1 - share_under5) * @moral_weights.uov_per_death_over5) * $life_value_multiplier",
          "GiveWell's moral weights for the age mix of deaths averted, times your multiplier on the value of a life.", "number", "units of value"),
        f("uov_deaths", "outcome", "Units of value from deaths averted", "deaths_averted * value_per_death", None, "number", "units of value"),
        f("uov_morbidity", "outcome", "Units of value from illness averted", "uov_deaths * morbidity_value_ratio", None, "number", "units of value"),
        f("uov_income", "outcome", "Units of value from later-life income", "people_reached * ln_income_gain_per_person * total_adj * $uov_per_ln_consumption", None, "number", "units of value"),
        f("outcome_total", "outcome", "Total units of value", "(uov_deaths + uov_morbidity + uov_income) * (1 + unmodelled_benefits_adj)", None, "number", "units of value"),
        f("uov_per_dollar", "outcome", "Units of value per dollar", "outcome_total / cost_total", None, "small", "units of value / $"),
    ] + donor_rows("uov", "Units of value"),
    "what the charity does, where, " + BOTTOM)

# --- cash-income -----------------------------------------------------------------------------
T["cash-income"] = model("cash-income", "cash transfers and income gains", "uov", "uov", "Units of value", "global-health",
    cost_rows() + [
        inp("transfers_share_of_cost", "reach", "Transfers as a share of total cost", {"low": 0.75, "best": 0.82, "high": 0.88}, "observed",
            "the share of total cost that reaches recipients (cash transferred ÷ total expenses). For a livelihood program, the share spent on assets or services delivered.", "percent", source=src("audited financial statements")),
        inp("transfer_per_household", "reach", "Transfer per household (nominal USD)", 1000, "observed", "the transfer size the charity reports.", "usd", source=src("charity program page")),
        f("households", "reach", "Households reached", "cost_total * transfers_share_of_cost / transfer_per_household", None, "integer"),
        inp("household_size", "reach", "Average household size", 4.5, "observed", "from the charity's census or the country's DHS.", "number", "people", src("DHS / charity data")),
        f("people_reached", "reach", "People reached", "households * household_size", None, "integer"),
        f("ppp_factor", "reach", "PPP conversion (2017 international $ per US $)", "@kenya.ppp_factor_2017", "TEMPLATE: point at the right country's fact (add facts/<country>.json from the World Bank if missing).", "number"),
        f("transfer_per_person_ppp", "reach", "Transfer per person (PPP)", "transfer_per_household * ppp_factor / household_size", None, "usd"),
        inp("baseline_consumption", "effect", "Baseline annual consumption per person (PPP)", {"low": 500, "best": 650, "high": 800}, "observed",
            "recipients' consumption per person per year before the transfer, from the program's baseline survey or the World Bank poverty data for the region.", "usd", source=src("baseline survey / World Bank PIP")),
        inp("share_consumed_y1", "effect", "Share of the transfer consumed in year 1", {"low": 0.45, "best": 0.57, "high": 0.7}, "estimate",
            "the rest is invested. From the RCT literature (Egger et al. 2022; Haushofer & Shapiro 2016).", "percent", source=src("RCT")),
        f("y1_ln_gain", "effect", "Increase in ln(consumption) in year 1", "ln(1 + share_consumed_y1 * transfer_per_person_ppp / baseline_consumption)", None, "number"),
        inp("later_gain_share_per_year", "effect", "Yearly gain in later years, as a share of the year-1 gain", {"low": 0.1, "best": 0.165, "high": 0.23}, "estimate",
            "returns on the invested share in each later year, relative to the year-1 consumption gain. About 0.165 over 9 later years reproduces GiveWell's 1.23 (0.74–1.72) at 4% (GiveDirectly CEA, Nov 2024); cite the follow-up studies you use. For a recurring income gain instead of a lump sum, replace y1_ln_gain and the later-years rows with ln(1 + gain / baseline) × pv_annuity_due(1, $discount_rate, persistence_years).", "percent",
            source={"title": "TEMPLATE: GiveWell GiveDirectly CEA, Consumption tab", "url": "https://docs.google.com/spreadsheets/d/1LqkkwWCud9qGjSJmw9re6DIm5ocpPOaqOJ-KIEVLppk/edit", "cell": "Consumption!B23; Inputs!D23:F23", "retrieved": D}),
        inp("later_years", "effect", "Years the later gains last", {"low": 5, "best": 9, "high": 15}, "estimate",
            "how long the invested share keeps paying returns, from follow-up studies.", "number", "years", src("follow-up study")),
        f("later_years_ratio", "effect", "Value of later-year gains relative to year 1, present value", "later_gain_share_per_year * pv_annuity_due(1, $discount_rate, later_years) / (1 + $discount_rate)",
          "Later years' gains discounted at the shared rate, so the result moves with it.", "number"),
        f("ln_gain_per_person", "effect", "Total ln(consumption) gain per person", "y1_ln_gain * (1 + later_years_ratio)", None, "number"),
        inp("spillover_ratio", "effect", "Spillover benefits to non-recipients, as a share of recipients' benefits", {"low": 0, "best": 0.3, "high": 0.9}, "estimate",
            "local economic spillovers. GiveWell's adjusted Egger et al. figure is about 0.7; it is weakly identified, so give a wide range.", "percent", source=src("Egger et al. 2022 / GiveWell")),
        inp("mortality_uov_ratio", "effect", "Mortality benefits as a share of consumption benefits", {"low": 0, "best": 0.2, "high": 0.5}, "estimate",
            "child-mortality effects of cash, as a share of consumption value (GiveWell models these explicitly for GiveDirectly). 0 for programs without mortality evidence.", "percent", source=src("GiveWell GiveDirectly CEA")),
    ] + adj_rows(leverage=True, unmodelled=True, implementation=False) + [
        f("uov_consumption", "outcome", "Units of value from recipients' consumption", "people_reached * ln_gain_per_person * $uov_per_ln_consumption * total_adj", None, "number", "units of value"),
        f("uov_spillovers", "outcome", "Units of value from spillovers", "uov_consumption * spillover_ratio", None, "number", "units of value"),
        f("uov_mortality", "outcome", "Units of value from mortality effects", "uov_consumption * mortality_uov_ratio * $life_value_multiplier", None, "number", "units of value"),
        f("outcome_total", "outcome", "Total units of value", "(uov_consumption + uov_spillovers + uov_mortality) * (1 + unmodelled_benefits_adj)", None, "number", "units of value"),
        f("uov_per_dollar", "outcome", "Units of value per dollar", "outcome_total / cost_total", None, "small", "units of value / $"),
    ] + donor_rows("uov", "Units of value"),
    "what the charity does, where, " + BOTTOM)

# --- wellbeing -------------------------------------------------------------------------------
T["wellbeing"] = model("wellbeing", "mental health and wellbeing", "wellby", "wellbys", "WELLBYs", "global-health",
    cost_rows() + [
        inp("people_reached", "reach", "People treated in the period", 10_000, "observed",
            "people who started treatment in the year the spending covers (not only completers: completion goes into implementation_adj).", "integer", source=src("charity annual report")),
        f("cost_per_person", "reach", "Cost per person treated", "cost_total / people_reached", "Context: compare with the charity's own published figure and with other models of the family.", "usd"),
        inp("initial_effect_sd", "effect", "Effect at the end of treatment (standard deviations)", {"low": 0.3, "best": 0.5, "high": 0.7}, "estimate",
            "standardised mean difference on depression or wellbeing at end of treatment, from the best meta-analysis or RCTs of this intervention type; CI as range.", "number", "SD", src("meta-analysis")),
        inp("effect_duration_years", "effect", "Years until the effect has faded", {"low": 1.5, "best": 2.5, "high": 5}, "estimate",
            "how long until the effect has faded to zero, from follow-up studies (the effect is assumed to fall linearly). An input, not initial ÷ decay, so the effect size doesn't enter twice and inflate the joint range. If follow-ups show a plateau rather than a fade, say so and set the duration to the area-equivalent linear fade.", "number", "years", src("meta-analysis of follow-ups")),
        f("effect_decay_sd_per_year", "effect", "Implied decay of the effect (SDs per year)", "initial_effect_sd / effect_duration_years", "Context: compare with the decay rates reported in follow-up studies.", "number", "SD / year"),
        f("continuous_discount_rate", "effect", "Discount rate, continuous", "ln(1 + $discount_rate)", "The shared yearly rate as a continuous rate, so the effect can be discounted smoothly as it fades.", "number"),
        f("discount_factor", "effect", "Discount factor for the fading effect", "if(continuous_discount_rate > 0, (continuous_discount_rate * effect_duration_years - 1 + exp(-(continuous_discount_rate * effect_duration_years))) / (0.5 * (continuous_discount_rate * effect_duration_years) * (continuous_discount_rate * effect_duration_years)), 1)",
          "Present value of the triangle (linear fade to zero) at the shared rate, as a share of its undiscounted area; as in the HLI models.", "percent"),
        f("sd_years_per_person", "effect", "Total effect per person (SD-years, discounted)", "0.5 * initial_effect_sd * effect_duration_years * discount_factor", "Area of the triangle: linear decay from the initial effect to zero, discounted.", "number"),
        f("wellbys_per_person", "effect", "WELLBYs per person treated", "sd_years_per_person * @wellby_factors.wellbys_per_sd_year", None, "number", "WELLBYs"),
        f("household_size", "effect", "Household size", "@wellby_factors.household_size_psychotherapy", "TEMPLATE: use a country fact when the charity works outside HLI's settings.", "number"),
        f("household_multiplier", "effect", "Household multiplier (recipient plus spillovers)", "1 + (household_size - 1) * @wellby_factors.household_spillover_ratio_psychotherapy", None, "multiple"),
    ] + adj_rows() + [
        f("outcome_total", "outcome", "WELLBYs", "people_reached * wellbys_per_person * household_multiplier * total_adj", None, "number", "WELLBYs"),
        f("wellbys_per_dollar", "outcome", "WELLBYs per dollar", "outcome_total / cost_total", None, "small", "WELLBYs / $"),
    ] + donor_rows("wellbys", "WELLBYs"),
    "what the charity does, where, " + BOTTOM)

# --- corporate-campaign ----------------------------------------------------------------------
T["corporate-campaign"] = model("corporate-campaign", "corporate and producer welfare campaigns", "sad", "sads", "SADs averted", "animal-welfare",
    cost_rows() + [
        inp("animals_per_year", "reach", "Animals per year in the supply chains covered", 10_000_000, "observed",
            "animals per year affected by the commitments won (or held to account) in the period: company egg/meat volumes ÷ per-animal output. Cite the tracker or the company's report; note the conversion.", "integer", "animals / year", src("Cage-Free Tracker / ChickenWatch / company report")),
        inp("share_not_yet_compliant", "reach", "Share not yet compliant when the work happened", {"low": 0.4, "best": 0.6, "high": 0.8}, "observed",
            "animals already covered by the reform before the campaign can't be credited to it.", "percent", source=src("tracker")),
        f("animals_affected_per_year", "reach", "Animals per year the campaign can change", "animals_per_year * share_not_yet_compliant", None, "integer"),
        f("sads_per_animal_year", "effect", "SADs averted per animal-year under the reform", "@sad_factors.sads_per_hen_year_cage_to_aviary",
          "TEMPLATE: pick the shared figure for the change (facts/sad_factors.json: cage-free, enriched-to-aviary, broiler BCC, shrimp stunned). A new change gets a new fact with sources and a `change` note; never put a SAD figure inline. Set the species section to match.", "number", "SADs / animal-year"),
        inp("years_of_impact", "effect", "Years the reform is brought forward", {"low": 4, "best": 15, "high": 36}, "estimate",
            "how many years earlier the reform happens than it would have without the campaign: Rethink Priorities' 90% interval for corporate chicken campaigns is 4–36 years.", "number", "years",
            {"title": "TEMPLATE: Rethink Priorities, corporate campaigns for chicken welfare", "url": "https://rethinkpriorities.org/publications/corporate-campaigns-affect-9-to-120-years-of-chicken-life-per-dollar-spent", "page": "summary", "retrieved": D}),
        f("discounted_years", "effect", "Discounted years of impact", "pv_annuity_due(1, $discount_rate, years_of_impact)", "Years of impact discounted at the shared rate.", "number", "years"),
    ] + adj_rows() + [
        f("outcome_total", "outcome", "SADs averted", "animals_affected_per_year * discounted_years * sads_per_animal_year * total_adj", None, "number", "SADs"),
        f("sads_per_dollar", "outcome", "SADs averted per dollar", "outcome_total / cost_total", None, "number", "SADs / $"),
    ] + donor_rows("sads", "SADs averted"),
    "what the charity does, where, " + BOTTOM, species=[("chicken", None)])

# --- diet-change -----------------------------------------------------------------------------
T["diet-change"] = model("diet-change", "diet change and meal replacement", "sad", "sads", "SADs averted", "animal-welfare",
    cost_rows() + [
        inp("meals_replaced_per_year", "reach", "Animal-product meals replaced per year", 1_000_000, "observed",
            "meals per year the charity reports replacing (institutional menu changes, pledges × meals per participant). Say how the charity measures it and whether it is self-reported.", "integer", "meals / year", src("charity impact report")),
        f("sads_per_meal", "effect", "SADs averted per meal replaced", "@sad_factors.sads_per_meal_replaced",
          "TEMPLATE: the shared figure; override only if the charity reports what the replaced meals contained, and explain.", "number", "SADs / meal"),
        f("production_response", "effect", "Fall in production per meal not eaten", "@sad_factors.production_response", "Fewer meals bought lowers production by less than one for one, because prices fall and others buy more.", "percent"),
        inp("years_of_impact", "effect", "Years the change persists", {"low": 1, "best": 3, "high": 8}, "estimate",
            "how long the change persists. Apply it only to NEW meals added in the period (new institutions, new pledges): if meals_replaced_per_year is the year's total flow from all partnerships, old and new, set this to 1, or the same meals are credited in several years' cost. For new additions, cite follow-up data (Faunalytics' study of former vegetarians, institutions' own reports).", "number", "years", src("follow-up study")),
        f("discounted_years", "effect", "Discounted years of impact", "pv_annuity_due(1, $discount_rate, years_of_impact)", None, "number", "years"),
    ] + adj_rows() + [
        f("outcome_total", "outcome", "SADs averted", "meals_replaced_per_year * discounted_years * sads_per_meal * production_response * total_adj", None, "number", "SADs"),
        f("sads_per_dollar", "outcome", "SADs averted per dollar", "outcome_total / cost_total", None, "number", "SADs / $"),
    ] + donor_rows("sads", "SADs averted"),
    "what the charity does, where, " + BOTTOM, species=[(sp, f"@sad_factors.meal_sads_share_{sp}") for sp in ("fish", "chicken", "pig")])

# --- policy-research-meta --------------------------------------------------------------------
T["policy-research-meta"] = model("policy-research-meta", "policy, research and meta", "uov", "uov", "Units of value", "global-health",
    cost_rows() + [
        inp("units_affected_per_year", "reach", "People or animals per year the change would affect", 1_000_000, "observed",
            "for policy: the population under the law or rule; for money moved or research: write the money influenced (USD) here and say so in the label.", "integer", source=src("government statistics / charity report")),
        inp("value_per_unit_year", "effect", "Value per unit affected per year, in the output unit", {"low": 0.001, "best": 0.003, "high": 0.01}, "estimate",
            "the downstream benefit per person or animal per year (or per dollar influenced), in the output unit. Take it from another charityevals model of the downstream intervention where one exists (cite its page and row) so the chain stays comparable.", "small", source=src("charityevals model of the downstream intervention")),
        inp("p_success", "effect", "Probability the change happens because of this work", {"low": 0.02, "best": 0.1, "high": 0.3}, "judgment",
            "the probability that the policy passes, the research changes decisions, or the money is moved, in the period, given the charity's work. Base it on reference classes (share of similar bills passed, of similar campaigns won).", "percent"),
        inp("years_of_impact", "effect", "Years the change is brought forward", {"low": 1, "best": 5, "high": 15}, "estimate",
            "for policy: years earlier than it would have happened anyway; for money moved: 1.", "number", "years", src("reference class")),
        f("discounted_years", "effect", "Discounted years of impact", "pv_annuity_due(1, $discount_rate, years_of_impact)", None, "number", "years"),
        f("downstream_value", "effect", "Expected value of the change (before adjustments)", "units_affected_per_year * value_per_unit_year * p_success * discounted_years", None, "number"),
    ] + adj_rows(implementation=False) + [
        f("outcome_total", "outcome", "Total value (output unit)", "downstream_value * total_adj", None, "number"),
        f("uov_per_dollar", "outcome", "Value per dollar", "outcome_total / cost_total", "For WELLBYs, rename the uov_* rows to wellbys_* and report in wellby. For animals, rename them to sads_* and add the species section of the corporate-campaign template (output ced_per_donor_dollar).", "small"),
    ] + donor_rows("uov", "Units of value"),
    "what the charity does, the causal chain to the outcome, " + BOTTOM)

os.makedirs(OUT, exist_ok=True)
for fam, m in T.items():
    with open(os.path.join(OUT, f"{fam}.json"), "w") as fh:
        json.dump(m, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
print("wrote", len(T))
