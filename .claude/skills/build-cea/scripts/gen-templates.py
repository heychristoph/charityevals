"""Run: python3 .claude/skills/build-cea/scripts/gen-templates.py
Generates the build-cea template skeletons. Each is a valid model file (kind "template") whose
numbers are placeholders marked TEMPLATE; the lint (npm run check, src/engine/lint.test.ts) refuses a
model that still has one. Filled in, each ends in a ranked unit (uov, wellby, ced, tco2e) and passes
every invariant of src/engine/invariants.ts and the lint out of the box (src/engine/templates.test.ts):
output.native is the bottom line before our shared steps, the donor (and, for animals, species)
sections are kind "ours", animal models go through ced_<species>, and every shared figure the family
needs is already read from its shared fact or slider (docs/normalization.md 2.7-2.11):

  every family      source.published (the build date: the estimate-age slider counts from it),
                    estimate_basis (INV-18), staff pay from @staff_pay, $discount_rate on every wait
  direct-health     deaths by age band (@moral_weights) x $life_value_multiplier, stillbirths at
                    @givewell_shared.uov_per_stillbirth, long-term income years @givewell_shared
  cash-income       household size @household_size.<place>, PPP @<country>
  wellbeing         household size @household_size.<place>, spillover and SD-years @wellby_factors,
                    deaths only through uov_valued_outside_wellbys -> wellbys_from_uov (INV-17)
  corporate-campaign  $win_years_counted, the wait until the pledges take effect discounted,
                    pledges kept @sad_factors.commitment_fulfilment_*, $marginal_vs_past_average
  diet-change       @sad_factors.sads_per_meal_replaced x meal_mix_vs_reference,
                    @sad_factors.production_response, $win_years_counted for won menu changes
  policy-research-meta  won policy ($win_years_counted, the wait), money moved through the shared
                    rows of src/engine/moved-money.ts (#model-id, @meta), the career-change step,
                    $marginal_vs_past_average; a climate skeleton in tco2e with years_until_avoided,
                    air_pollution_weight and extra_deaths_per_tco2e
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..", "templates")
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

def f(id, section, label, formula, explainer=None, fmt="number", unit=None, published=None):
    r = {"id": id, "section": section, "label": label, "format": fmt, "formula": formula}
    if unit: r["unit"] = unit
    if published is not None: r["published"] = published
    if explainer: r["explainer"] = explainer
    return r

SECTIONS = [
    {"id": "cost", "title": "Cost", "explainer": "What the modelled program cost in the year the outcomes below are counted for, including its share of overhead. From audited financial statements or the annual report."},
    {"id": "reach", "title": "Reach", "explainer": "How many people, animals or meals the spending reached in the same year, as the charity reports it."},
    {"id": "effect", "title": "Effect per unit", "explainer": "What the intervention does for each unit reached, from the best available studies, before any adjustment."},
    {"id": "adjustments", "title": "Adjustments", "explainer": "Discounts for weaker evidence, what would have happened anyway, credit shared with others, and delivery falling short. All multiply the outcome."},
    {"id": "outcome", "title": "Outcome", "explainer": "The outcome in the family's shared unit, per dollar."},
    {"id": "donor", "title": "Your dollar's share", "kind": "ours", "explainer": "Staff who earn less than they could elsewhere pay part of the cost in kind. With credit by share of resources, your dollar is credited with its share of the full cost only."},
]
SPECIES_SECTION = {"id": "species", "title": "In chicken pain days", "kind": "ours", "explainer": "charityevals' standard step for every animal model. The shared SAD figures are Ambitious Impact's, which count each species' pain as a share of a person's with its own species weights. Here those weights come out and Rethink Priorities' go in, so every species is counted in days of a chicken's disabling pain. How a chicken compares with a person is the one animal slider."}

def cost_rows():
    return [
        inp("program_spend", "cost", "Spending on the modelled program(s) in the year modelled", 1_000_000, "observed",
            "program expenses, in US dollars, for the activities modelled below and the same year as the reach numbers (say the year in the label and the summary). Cite the audited statement of functional expenses (or the annual report) and the page. Other currencies: a row in local currency times @fx.usd_per_<cur>_<year> (the IRS yearly average, else the World Bank's; add the fact with scripts/link-fx.py), never a typed rate.", "usd", source=src("audited financial statements")),
        inp("total_expenses", "cost", "Total expenses (all programs, management, fundraising)", 1_200_000, "observed",
            "total expenses for the same year, from the same document.", "usd", source=src("audited financial statements")),
        inp("program_expenses", "cost", "Program expenses (all programs)", 1_000_000, "observed",
            "program-service expenses for the same year, from the same document.", "usd", source=src("audited financial statements")),
        f("overhead_ratio", "cost", "Overhead multiplier (total ÷ program expenses)", "total_expenses / program_expenses",
          "Spreads management and fundraising over programs in proportion to their cost, as GiveWell and ACE do.", "multiple"),
        f("cost_total", "cost", "Cost of the modelled program, including overhead", "program_spend * overhead_ratio", None, "usd"),
    ]

def adj_rows(extra=(), leverage=False, unmodelled=False, implementation=True, implementation_row=None, factors_extra=(), evidence_rows=None, counterfactual_row=None, unmodelled_rows=None):
    rows = list(evidence_rows) if evidence_rows else [
        inp("evidence_adj", "adjustments", "Evidence adjustment (internal and external validity), a multiplier", {"low": 0.5, "best": 0.7, "high": 0.9}, "judgment",
            "how far the effect size above should be trusted for this charity's setting: publication bias, self-report bias, replication, differences between study populations and this program. A multiplier (1 = take the studies at face value), the product of its parts; say each part, its anchor (the same adjustment in another model of this intervention) and the range.", "multiple"),
    ]
    rows.append(counterfactual_row or inp("counterfactual_adj", "adjustments", "Share of the outcome that wouldn't have happened anyway", {"low": 0.6, "best": 0.8, "high": 0.95}, "judgment",
            "the share of the outcome that would not have happened without the program (other providers, existing trends, government). Cite coverage data or trend data where possible.", "percent"))
    rows += [
        inp("attribution_share_shared", "adjustments", "This charity's share of the resources behind the outcome", {"low": 0.5, "best": 0.8, "high": 1}, "judgment",
            "where other organisations contributed to the same outcome (co-funders, coalition campaigns, government delivery), this charity's share of everyone's spending on it. Others' in-kind work counts too: government staff time, partners' own delivery costs, and volunteers' unpaid time (beyond any stipend the charity pays, which is in its cost), valued at the local wage for the hours given. 1 when it delivers alone.", "percent"),
        f("attribution_share", "adjustments", "Share of credit used", "attribution_share_shared",
          "The charity's share of the resources behind the outcome; it applies whichever way credit is shared.", "percent"),
    ]
    if implementation:
        rows.append(implementation_row or inp("implementation_adj", "adjustments", "Delivery adjustment (fidelity, compliance, follow-through)", {"low": 0.6, "best": 0.8, "high": 0.95}, "judgment",
            "the share of the reported reach that actually receives the intervention as studied: dose completion, coverage survey vs. reported.", "percent"))
    if leverage:
        rows.append(inp("leverage_funging_adj", "adjustments", "Leverage and funging", {"low": 0.85, "best": 0.95, "high": 1.05}, "judgment",
            "below 1 when other funders (governments, the Global Fund) would have paid for this work without the donation; above 1 when the donation pulls in other money. GiveWell's top charities typically sit at 0.85–0.95.", "multiple"))
    rows += list(extra)
    factors = ["evidence_adj", "counterfactual_adj", "attribution_share"] + (["implementation_adj"] if implementation else []) + (["leverage_funging_adj"] if leverage else []) + list(factors_extra)
    rows.append(f("total_adj", "adjustments", "All adjustments combined", " * ".join(factors), "The product of the adjustments above.", "multiple"))
    if unmodelled_rows:
        rows += list(unmodelled_rows)
    elif unmodelled:
        rows.append(inp("unmodelled_benefits_adj", "adjustments", "Benefits and harms not modelled, as a share of modelled value", {"low": -0.05, "best": 0.1, "high": 0.25}, "judgment",
            "a supplementary adjustment: list each effect not modelled with its sign and size. Benefits are positive shares, harms and risks (funging inside the organisation, bottlenecks, monitoring errors) negative shares of value lost, added here: never a positive share subtracted elsewhere.", "percent"))
    return rows

# Staff pay below market: the shared defaults by kind of work (facts/staff_pay.json), the charity's own
# breakdown where its financials give one.
STAFF = {
    "goods": ("share_goods", "gap_local_delivery"),
    "services": ("share_staff_delivered", "gap_health_field"),
    "advocacy": ("share_advocacy", "gap_advocacy"),
    "research": ("share_research_policy", "gap_research_policy"),
}

def donor_rows(prefix, unit_label, staff, marginal=False):
    share, gap = STAFF[staff]
    rows = [
        f("staff_cost_share", "donor", "Staff pay as a share of program cost", f"@staff_pay.{share}",
          f"TEMPLATE: the shared default for this kind of work (@staff_pay.{share}; facts/staff_pay.json has one per kind: goods, staff-delivered, research and policy, advocacy, media). Where the charity's financials give salaries and benefits, use them instead: an estimate input (salaries ÷ total expenses, Form 990 Part IX lines 5–9) with its source.", "percent"),
        f("salary_gap", "donor", "Pay gap versus comparable jobs elsewhere", f"@staff_pay.{gap}",
          f"TEMPLATE: the shared pay gap for this kind of work (@staff_pay.{gap}); pick the fact that fits the staff (local delivery, health and field, research and policy, advocacy, media, UK charity). Don't type a gap in.", "percent"),
        f("salary_sacrifice", "donor", "Salary forgone by staff (in-kind donation)", "cost_total * staff_cost_share * salary_gap / (1 - salary_gap)", None, "usd"),
    ]
    if marginal:
        rows.append(f("marginal_vs_past_average", "donor", "How much the next dollar does compared with the average dollar so far", "$marginal_vs_past_average",
                      "This model's cost per outcome is the charity's past spending over what it won (estimate_basis past_average), so the next dollar is valued at the shared share of the average (docs/normalization.md 2.10). 1 in `published`: what the past average itself says.", "percent", published=1))
    return rows

def donor_tail(prefix, unit_label, marginal=False, dcs="cost_total / (cost_total + if($resource_shares, salary_sacrifice, 0))"):
    return [
        f("donor_cost_share", "donor", "Share of the full cost paid by cash donations", dcs, None, "percent"),
        f(f"{prefix}_per_donor_dollar", "donor", f"{unit_label} per dollar you give", f"{prefix}_per_dollar * donor_cost_share" + (" * marginal_vs_past_average" if marginal else ""), None, "small", f"{unit_label} / $"),
    ]

NAMES = {"chicken": "chickens", "pig": "pigs", "fish": "fish", "shrimp": "shrimp"}

def species_rows(shares):
    """The species step (docs/normalization.md 2.4): SADs per donor dollar split by species, each converted
    with the standard ced_<species> template (src/engine/invariants.ts CED_TEMPLATES.aim), then summed.
    `v` is the SAD version whose species weight is built into the shared figure the row divides (the
    fact's note says it: cage-to-aviary and meals 2024; enriched cages, broilers and shrimp 2025)."""
    rows = []
    for sp, share, v, extra in shares:
        base = "sads_per_donor_dollar" + "".join(f" * {x}" for x in extra)
        rows.append(f(f"sads_{sp}", "species", f"SADs averted per dollar you give: {NAMES[sp]}", f"{base} * {share}" if share else base,
                      None if share else f"TEMPLATE: one species takes all the SADs. For several, add a sads_<species> row per species with its share (a sourced fact or a judgment row with a range) and a ced_<species> row for each. A second SAD version for the same species (a broiler or enriched-cage figure, 2025 SADs, beside a cage-to-aviary one, 2024) gets its own pair sads_{sp}_2025 / ced_{sp}_2025.", "number"))
        rows.append(f(f"ced_{sp}", "species", f"Chicken-equivalent pain days averted per dollar you give: {NAMES[sp]}",
                      f"sads_{sp} / @aim_sads.{sp}_{v} * if($rp_species_weights, @welfare_ranges.{sp}_vs_chicken, @aim_sads.{sp}_{v} / @aim_sads.chicken_2024)",
                      f"Ambitious Impact's species weight ({v} SADs, the version of the shared figure above) taken out and Rethink Priorities' (relative to a chicken) put in. The formula is the standard one; don't edit it except the version, which must match the SAD figure's.", "number"))
    rows.append(f("ced_per_donor_dollar", "species", "Chicken-equivalent pain days averted per dollar you give", " + ".join(f"ced_{sp}" for sp, *_ in shares), None, "small", "chicken pain days / $"))
    return rows

def model(family, name, unit, prefix, unit_label, cause, rows, summary, basis, species=None, sections=None, id=None, out=None):
    out = out or {"row": f"{prefix}_per_donor_dollar", "unit": unit, "label": f"{unit_label} per dollar you give", "native": {"row": f"{prefix}_per_dollar", "unit": unit}}
    if species:
        out = {"row": "ced_per_donor_dollar", "unit": "ced", "label": "Chicken-equivalent pain days averted per dollar you give",
               "native": {"row": f"{prefix}_per_dollar", "unit": unit}, "species": [sp for sp, *_ in species]}
        rows = rows + species_rows(species)
    mid = id or f"template-{family}"
    return {
        "id": mid,
        "name": f"Template: {name}",
        "kind": "template",
        "cause": cause,
        "template": family,
        "estimate_basis": basis,
        "charity": "template-charity",
        "owner": "charityevals",
        "summary": "TEMPLATE: " + summary,
        "source": {"publisher": "charityevals", "title": f"charityevals' estimate: {name}", "url": f"https://charityevals.org/{mid}", "published": D, "retrieved": D},
        "resources": [],
        "sections": (sections or SECTIONS) + ([SPECIES_SECTION] if species else []),
        "rows": rows,
        "output": out,
    }

BOTTOM = "the year modelled, the bottom line in years of healthy life per $1,000 (quote it live in the write-up), and the biggest uncertainty. If the result is more than ten times its cause's median on the site, say why (\"more than ten times its peers because …\")."

T = {}

# --- direct-health ---------------------------------------------------------------------------
T["direct-health"] = model("direct-health", "direct health (deaths and illness averted)", "uov", "uov", "Units of value", "global-health",
    cost_rows() + [
        inp("people_reached", "reach", "People reached in the year modelled", 100_000, "observed",
            "people who received the intervention in the year the spending covers (children dosed, people sleeping under nets distributed, infants vaccinated). Prefer independent coverage surveys to administrative counts; note which.", "integer", source=src("charity annual report / coverage survey")),
        f("cost_per_person", "reach", "Cost per person reached", "cost_total / people_reached", "Context: compare with the charity's own figure and with other models of the family.", "usd"),
        inp("years_of_coverage", "reach", "Years of protection per person reached", {"low": 0.5, "best": 1, "high": 1.5}, "estimate",
            "how long one round of the intervention protects a person (e.g. one dose, one net's useful life × usage).", "number", "years", src("study or program data")),
        inp("baseline_mortality_rate", "effect", "Annual mortality the intervention can reduce, in the target group", 0.005, "observed",
            "deaths per person-year from the causes the intervention affects, in the target age group and region, today, without the program. Use (or add) a country fact in facts/<country>.json (IHME GBD, UN IGME, DHS).", "small", "deaths / person-year", src("IHME GBD / UN IGME")),
        inp("mortality_reduction", "effect", "Reduction in that mortality from the intervention", {"low": 0.05, "best": 0.12, "high": 0.2}, "estimate",
            "relative risk reduction from the best meta-analysis (Cochrane or equivalent); the 95% CI as low/high.", "percent", source=src("meta-analysis")),
        f("indirect_deaths_ratio", "effect", "Deaths malaria causes indirectly, per direct malaria death", "@givewell.indirect_malaria_deaths_per_direct_malaria_death_2",
          "TEMPLATE: where mortality_reduction is the fall in deaths from one cause, the deaths that cause brings on indirectly (through anaemia, low birth weight, other infections), per direct death: malaria @givewell.indirect_malaria_deaths_per_direct_malaria_death_2 (0.75, what the site's ranked malaria models read), diarrhoea @givewell_shared.indirect_deaths_per_direct_diarrhea_death. 0, with that reason, where mortality_reduction is the all-cause effect from the trials (it already holds them).", "number"),
        f("deaths_averted_per_person", "effect", "Deaths averted per person reached (before adjustments)", "baseline_mortality_rate * mortality_reduction * (1 + indirect_deaths_ratio) * years_of_coverage",
          "Direct and indirect deaths over the years of protection. If the intervention protects several age groups with different risks, replace this formula with one row per group and sum them here; check the result against the all-cause trial result per person-year, scaled to today's mortality.", "small"),
        inp("share_under5", "effect", "Share of deaths averted that are of children under five", {"low": 0.6, "best": 0.8, "high": 0.95}, "estimate",
            "the age split of the deaths averted: the split of deaths from the causes the intervention affects, in the countries it works in, weighted by its reach there. Source: WHO Global Health Estimates (deaths by cause, age, sex and country, the latest year) or IHME GBD. A split another model could reuse (one cause in one place) goes into facts/death_ages.json as `<cause>_<place>_share_<band>` (under5, 5_14, 15_49, 50plus) and is read here and below: share_5_14_of_over5 = @death_ages.<x>_share_5_14 / (1 - @death_ages.<x>_share_under5), and so on.", "percent", source=src("WHO Global Health Estimates / IHME GBD")),
        inp("share_5_14_of_over5", "effect", "Of the deaths averted at five or older, share aged 5 to 14", {"low": 0.2, "best": 0.4, "high": 0.6}, "estimate",
            "the rest of the age split, band by band, so every death is valued at its own age band (docs/normalization.md 2.7), from the same source as share_under5. 0 when only under-fives are reached.", "percent", source=src("WHO Global Health Estimates / IHME GBD")),
        inp("share_15_49_of_over15", "effect", "Of the deaths averted at 15 or older, share aged 15 to 49", {"low": 0.3, "best": 0.5, "high": 0.7}, "estimate",
            "the rest at 50 to 74 (GiveWell's older weight also stands in above 74), from the same source.", "percent", source=src("WHO Global Health Estimates / IHME GBD")),
        f("morbidity_value_ratio", "effect", "Illness averted, as a share of the mortality and income benefits", "@givewell_common.malaria_morbidity",
          "TEMPLATE: illness averted, as a share of the value of the deaths averted and the income gains together, the base GiveWell's supplementary adjustments apply to (uov_morbidity below). The site's one figure where it has one: malaria (nets, SMC) @givewell_common.malaria_morbidity; incentivised vaccines @givewell_common.morbidity_effects_from_directly_incentivized_vaccines_a. For another program, an estimate input (GBD disability weights, @gbd_disability_weights where the site has the weight, × cases averted × duration, against the deaths' and income's value), with its source; never DALYs × an exchange rate inside the model (docs/normalization.md INV-2). 0 with an explanation when illness is in unmodelled_benefits_adj instead; never both.", "percent"),
        inp("stillbirths_averted_per_person", "effect", "Stillbirths averted per person reached (before adjustments)", 0, "estimate",
            "for maternal and newborn programs, and nets and SMC protecting pregnant women: stillbirths averted per person reached, from the trial or meta-analysis. 0 with an explanation for programs that can't avert stillbirths.", "small", source=src("meta-analysis")),
        inp("ln_income_gain_per_year", "effect", "Later-life income gain per person reached, ln(consumption) per year", 0, "estimate",
            "the yearly increase in ln(consumption) in adulthood from developmental effects (e.g. malaria or deworming and adult earnings), per person reached, undiscounted. 0 with an explanation when there is no evidence.", "small", "ln / year", src("study")),
        f("years_until_income_gain", "effect", "Years until the income gain starts", "@givewell_shared.years_until_income_benefits_malaria",
          "TEMPLATE: the site's one figure for the program (@givewell_shared.years_until_income_benefits_malaria, _smc, _iron or _deworming); for a program none fits, an estimate input from the study, with its source and range.", "number", "years"),
        f("years_income_gain_lasts", "effect", "Years the long-term income gain lasts", "@givewell_shared.long_term_benefit_years",
          "The site's one figure for how long a long-term income gain lasts (GiveWell's working years, 40), read by every model that counts one (INV-13).", "number", "years"),
        f("ln_income_gain_per_person", "effect", "Later-life income gain per person reached, present value", "pv_annuity_due(ln_income_gain_per_year, $discount_rate, years_income_gain_lasts) / (1 + $discount_rate) ^ years_until_income_gain",
          "Discounted at the shared rate, the wait included, so the result moves with it. Never type in a present value worked out elsewhere: rebuild it from its inputs.", "small", "ln-years"),
        f("resource_sharing_multiplier", "effect", "Resource sharing within households (multiplier on an earner's gain)", "@givewell_shared.resource_sharing_multiplier",
          "The site's one figure (GiveWell's): an earner's income gain is shared with the household, so it counts this many times. Read by every model that values a long-term income gain (INV-13).", "multiple"),
    ] + adj_rows(leverage=True, factors_extra=["wait_discount"], evidence_rows=[
        f("internal_validity_adj", "adjustments", "Internal validity of the trials, a multiplier", "@givewell_common.internal_validity_adjustment_malaria",
          "TEMPLATE: how far the trials measured the effect they report. The site's one figure where it has one for the intervention: malaria trials (nets, SMC) @givewell_common.internal_validity_adjustment_malaria; vitamin A and iron @givewell_common.internal_validity_adjustment_vas_iron; a single trial's own @givewell_common.internal_validity_adjustment_* fact where the site has one; water treatment @givewell_common.internal_validity_adjustment_for_morbidity. Otherwise a judgment input with a range, anchored on those.", "multiple"),
        inp("external_validity_adj", "adjustments", "External validity: the trials' setting against this program's, a multiplier", {"low": 0.6, "best": 0.8, "high": 1}, "judgment",
            "how far the trials' effect carries to this program today: other countries, lower baseline mortality, resistance (insecticides, drugs), another delivery model. 1 = the same setting; name the anchor (another model of this intervention) and the reason.", "multiple"),
        f("evidence_adj", "adjustments", "Evidence adjustment (internal and external validity), a multiplier", "internal_validity_adj * external_validity_adj", "The product of its two parts.", "multiple"),
    ], extra=[
        inp("gift_to_grant_years", "adjustments", "Years a donation waits before the charity spends it", {"low": 0, "best": 0.5, "high": 1}, "estimate",
            "the charity's unspent funds at year end ÷ its yearly spending (balance sheet and statement of activities), for a charity that grants or buys ahead from reserves; 0 for one that spends as it raises. Where the accounts show interest earned on the waiting funds, the dollar grows meanwhile: add a row interest_yield (interest income ÷ average cash and deposits, from the accounts) and multiply wait_discount by (1 + interest_yield) ^ gift_to_grant_years.", "number", "years", src("audited financial statements")),
        inp("delay_years", "adjustments", "Years from the charity's spending to the intervention reaching people", {"low": 0.25, "best": 0.5, "high": 1}, "estimate",
            "procurement, shipping and distribution: from the grant or purchase to the nets hung, the doses given (the charity's own distribution schedule, cited).", "number", "years", src("charity distribution reports")),
        f("benefit_midpoint_years", "adjustments", "Years from delivery to the middle of the protection", "years_of_coverage * 0.5",
          "The benefits come over the years of protection (a net's life, a season's doses), so they are discounted from its middle; 0 for a one-off effect such as a vaccine dose's.", "number", "years"),
        f("wait_discount", "adjustments", "Discount for the wait until the benefits come", "(1 + $discount_rate) ^ -(gift_to_grant_years + delay_years + benefit_midpoint_years)",
          "Every wait is discounted at the shared rate, like every future benefit (the income gain's own wait is counted from delivery, in ln_income_gain_per_person).", "percent"),
    ], unmodelled_rows=[
        f("treatment_costs_share", "adjustments", "Treatment costs averted, as a share of modelled value", "@givewell_shared.treatment_costs_averted",
          "The site's one figure (GiveWell's supplementary adjustment) for prevention programs: illness prevented saves its treatment. 0, with the reason, for a treatment program.", "percent"),
        f("rebound_share", "adjustments", "Rebound malaria from lost immunity, as a share of value lost", "@givewell_common.rebound_effects_decreased_immunity_development",
          "TEMPLATE: malaria prevention only (nets, SMC, malaria vaccines): children protected build less immunity and catch more malaria later, a negative share (the site's one figure). 0, with the reason, for other programs.", "percent"),
        f("investment_of_income_share", "adjustments", "Investment of income increases, as a share of modelled value", "@givewell_shared.investment_of_income_increases_nets",
          "TEMPLATE: income gains partly invested and paying off later, the site's one figure per program: nets @givewell_shared.investment_of_income_increases_nets, vitamin A _vas, deworming _deworming, others @givewell_shared.investment_of_income_increases. 0, with the reason, when the model counts no income gain.", "percent"),
        inp("other_unmodelled_share", "adjustments", "Other benefits and harms not modelled, as a share of modelled value", {"low": -0.05, "best": 0, "high": 0.1}, "judgment",
            "each effect not modelled above, with its sign and size: benefits positive (other diseases prevented), harms and risks (misuse, faster resistance, funging inside the organisation, monitoring errors) negative shares of value lost, added here, never a positive share subtracted elsewhere.", "percent"),
        f("unmodelled_benefits_adj", "adjustments", "Benefits and harms not modelled, as a share of modelled value", "treatment_costs_share + rebound_share + investment_of_income_share + other_unmodelled_share",
          "GiveWell-style supplementary adjustments, each its own row, summed: they add to the modelled value as one share, as in GiveWell's sheets.", "percent"),
    ]) + [
        f("deaths_averted", "outcome", "Deaths averted", "people_reached * deaths_averted_per_person * total_adj", None, "number"),
        f("value_per_death", "outcome", "Value of a death averted (units of value)",
          "(share_under5 * @moral_weights.uov_per_death_under5 + (1 - share_under5) * (share_5_14_of_over5 * @moral_weights.uov_per_death_age_5_14 + (1 - share_5_14_of_over5) * (share_15_49_of_over15 * @moral_weights.uov_per_death_age_15_49 + (1 - share_15_49_of_over15) * @moral_weights.uov_per_death_age_50_74))) * $life_value_multiplier",
          "GiveWell's moral weights for the age band of each death averted (under five, 5–14, 15–49, 50 and over), times your multiplier on the value of a life: the site's one value of a death (docs/normalization.md 2.7).", "number", "units of value"),
        f("uov_deaths", "outcome", "Units of value from deaths averted", "deaths_averted * value_per_death", None, "number", "units of value"),
        f("uov_stillbirths", "outcome", "Units of value from stillbirths averted", "people_reached * stillbirths_averted_per_person * total_adj * @givewell_shared.uov_per_stillbirth * $life_value_multiplier",
          "A stillbirth averted at the site's one value (@givewell_shared.uov_per_stillbirth, GiveWell's), times your multiplier on the value of a life.", "number", "units of value"),
        f("uov_income", "outcome", "Units of value from later-life income", "people_reached * ln_income_gain_per_person * resource_sharing_multiplier * total_adj * $uov_per_ln_consumption", None, "number", "units of value"),
        f("uov_morbidity", "outcome", "Units of value from illness averted", "(uov_deaths + uov_income) * morbidity_value_ratio",
          "A share of the deaths' and income's value, the base GiveWell's supplementary share has.", "number", "units of value"),
        f("outcome_total", "outcome", "Total units of value", "(uov_deaths + uov_stillbirths + uov_income) * (1 + unmodelled_benefits_adj) + uov_morbidity",
          "Illness and the other supplementary shares add to the modelled value side by side, as one sum of shares does in GiveWell's sheets.", "number", "units of value"),
        f("uov_per_dollar", "outcome", "Units of value per dollar", "outcome_total / cost_total", None, "small", "units of value / $"),
    ] + donor_rows("uov", "Units of value", "goods") + donor_tail("uov", "Units of value"),
    "what the charity does, where, " + BOTTOM, "unit_cost")

# --- cash-income -----------------------------------------------------------------------------
T["cash-income"] = model("cash-income", "cash transfers and income gains", "uov", "uov", "Units of value", "global-health",
    cost_rows() + [
        inp("transfers_share_of_cost", "reach", "Transfers as a share of total cost", {"low": 0.75, "best": 0.82, "high": 0.88}, "observed",
            "the share of total cost that reaches recipients (cash transferred ÷ total expenses). For a livelihood program, the share spent on assets or services delivered.", "percent", source=src("audited financial statements")),
        inp("transfer_per_household", "reach", "Transfer per household (nominal USD)", 1000, "observed", "the transfer size the charity reports, in US dollars (local currency × @fx.usd_per_<cur>_<year>).", "usd", source=src("charity program page")),
        f("households", "reach", "Households reached", "cost_total * transfers_share_of_cost / transfer_per_household", None, "integer"),
        f("household_size", "reach", "Average household size", "@household_size.kenya_rural",
          "TEMPLATE: the site's household size for the place the charity works (facts/household_size.json, the latest DHS survey; rural where the recipients are rural). Add the place's fact if it is missing. A size the charity measured in its own recipients is another population: use it only with that reason in the explainer.", "number", "people"),
        f("people_reached", "reach", "People reached", "households * household_size", None, "integer"),
        f("ppp_factor", "reach", "PPP conversion (2017 international $ per US $)", "@kenya.ppp_factor_2017", "TEMPLATE: point at the right country's fact (add facts/<country>.json from the World Bank if missing).", "number"),
        f("transfer_per_person_ppp", "reach", "Transfer per person (PPP)", "transfer_per_household * ppp_factor / household_size", None, "usd"),
        inp("baseline_consumption", "effect", "Baseline annual consumption per person (PPP)", {"low": 500, "best": 650, "high": 800}, "observed",
            "recipients' consumption per person per year before the transfer, in 2017 international dollars, from the program's baseline survey or the World Bank poverty data for the region.", "usd", source=src("baseline survey / World Bank PIP")),
        inp("share_consumed_y1", "effect", "Share of the transfer consumed in year 1", {"low": 0.45, "best": 0.57, "high": 0.7}, "estimate",
            "the rest is invested. From the RCT literature (Egger et al. 2022; Haushofer & Shapiro 2016).", "percent", source=src("RCT")),
        f("y1_ln_gain", "effect", "Increase in ln(consumption) in year 1", "ln(1 + share_consumed_y1 * transfer_per_person_ppp / baseline_consumption)", None, "number"),
        inp("later_gain_share_per_year", "effect", "Yearly gain in later years, as a share of the year-1 gain", {"low": 0.1, "best": 0.165, "high": 0.23}, "estimate",
            "returns on the invested share in each later year, relative to the year-1 consumption gain, from the follow-up studies you cite. For a recurring income gain instead of a lump sum, replace y1_ln_gain and the later-years rows with ln(1 + gain / baseline) × pv_annuity_due(1, $discount_rate, persistence_years).", "percent", source=src("follow-up study")),
        inp("later_years", "effect", "Years the later gains last", {"low": 5, "best": 9, "high": 15}, "estimate",
            "how long the invested share keeps paying returns, from follow-up studies.", "number", "years", src("follow-up study")),
        f("later_years_ratio", "effect", "Value of later-year gains relative to year 1, present value", "later_gain_share_per_year * pv_annuity_due(1, $discount_rate, later_years) / (1 + $discount_rate)",
          "Later years' gains discounted at the shared rate, so the result moves with it.", "number"),
        f("ln_gain_per_person", "effect", "Total ln(consumption) gain per person", "y1_ln_gain * (1 + later_years_ratio)", None, "number"),
        inp("spillover_ratio", "effect", "Spillover benefits to non-recipients, as a share of recipients' benefits", {"low": 0, "best": 0.3, "high": 0.9}, "estimate",
            "local economic spillovers. Weakly identified (Egger et al. 2022), so give a wide range.", "percent", source=src("Egger et al. 2022")),
        inp("mortality_uov_ratio", "effect", "Mortality benefits as a share of consumption benefits", {"low": 0, "best": 0.2, "high": 0.5}, "estimate",
            "child-mortality effects of cash, as a share of consumption value. 0 for programs without mortality evidence. Where the evidence gives deaths averted, count them as deaths instead (@moral_weights by age band × $life_value_multiplier, as the direct-health template).", "percent", source=src("study")),
    ] + adj_rows(leverage=True, unmodelled=True, implementation=False) + [
        f("uov_consumption", "outcome", "Units of value from recipients' consumption", "people_reached * ln_gain_per_person * $uov_per_ln_consumption * total_adj", None, "number", "units of value"),
        f("uov_spillovers", "outcome", "Units of value from spillovers", "uov_consumption * spillover_ratio", None, "number", "units of value"),
        f("uov_mortality", "outcome", "Units of value from mortality effects", "uov_consumption * mortality_uov_ratio * $life_value_multiplier", None, "number", "units of value"),
        f("outcome_total", "outcome", "Total units of value", "(uov_consumption + uov_spillovers + uov_mortality) * (1 + unmodelled_benefits_adj)", None, "number", "units of value"),
        f("uov_per_dollar", "outcome", "Units of value per dollar", "outcome_total / cost_total", None, "small", "units of value / $"),
    ] + donor_rows("uov", "Units of value", "goods") + donor_tail("uov", "Units of value"),
    "what the charity does, where, " + BOTTOM, "unit_cost")

# --- wellbeing -------------------------------------------------------------------------------
DEATHS_SECTION = {"id": "deaths", "title": "Deaths averted, valued the site's way", "kind": "ours", "explainer": "Deaths a mental-health program averts (suicides) are valued like every death on the site, in units of value (GiveWell's moral weight for the age band × your value of a life), and enter the WELLBYs only through one fixed row, which the WELLBY unit's conversion cancels: so they don't move with the WELLBY slider (docs/normalization.md 2.3, INV-17)."}
WB_SECTIONS = SECTIONS[:4] + [DEATHS_SECTION] + SECTIONS[4:]
T["wellbeing"] = model("wellbeing", "mental health and wellbeing", "wellby", "wellbys", "WELLBYs", "global-health",
    cost_rows() + [
        inp("people_reached", "reach", "People treated in the year modelled", 10_000, "observed",
            "people who started treatment in the year the spending covers (not only completers: completion goes into implementation_adj).", "integer", source=src("charity annual report")),
        f("cost_per_person", "reach", "Cost per person treated", "cost_total / people_reached", "Context: compare with the charity's own published figure and with other models of the family.", "usd"),
        inp("initial_effect_sd", "effect", "Effect at the end of treatment (standard deviations)", {"low": 0.3, "best": 0.5, "high": 0.7}, "estimate",
            "standardised mean difference on depression or wellbeing at end of treatment, from the best meta-analysis or RCTs of this intervention type; CI as range. A result in PHQ-9 points becomes SDs by dividing by the site's one spread, @depression.phq9_sd (a formula row: points / @depression.phq9_sd), never a study's own SD typed in; PHQ-8 points (the PHQ-9 without its self-harm item, on nearly the same scale) the same way, said in the explainer. With a trial of the charity's own delivery as well, make this a formula: the precision-weighted blend of the trial and the literature (templates.md, wellbeing).", "number", "SD", src("meta-analysis")),
        inp("effect_duration_years", "effect", "Years until the effect has faded", {"low": 1.5, "best": 2.5, "high": 5}, "estimate",
            "how long until the effect has faded to zero, from follow-up studies (the effect is assumed to fall linearly). An input, not initial ÷ decay, so the effect size doesn't enter twice and inflate the joint range. If follow-ups show a plateau rather than a fade, say so and set the duration to the area-equivalent linear fade.", "number", "years", src("meta-analysis of follow-ups")),
        f("effect_decay_sd_per_year", "effect", "Implied decay of the effect (SDs per year)", "initial_effect_sd / effect_duration_years", "Context: compare with the decay rates reported in follow-up studies.", "number", "SD / year"),
        f("continuous_discount_rate", "effect", "Discount rate, continuous", "ln(1 + $discount_rate)", "The shared yearly rate as a continuous rate, so the effect can be discounted smoothly as it fades.", "number"),
        f("discount_factor", "effect", "Discount factor for the fading effect", "if(continuous_discount_rate > 0, (continuous_discount_rate * effect_duration_years - 1 + exp(-(continuous_discount_rate * effect_duration_years))) / (0.5 * (continuous_discount_rate * effect_duration_years) * (continuous_discount_rate * effect_duration_years)), 1)",
          "Present value of the triangle (linear fade to zero) at the shared rate, as a share of its undiscounted area; as in the HLI models.", "percent"),
        f("sd_years_per_person", "effect", "Total effect per person (SD-years, discounted)", "0.5 * initial_effect_sd * effect_duration_years * discount_factor", "Area of the triangle: linear decay from the initial effect to zero, discounted.", "number"),
        f("wellbys_per_person", "effect", "WELLBYs per person treated", "sd_years_per_person * @wellby_factors.wellbys_per_sd_year",
          "SD-years into WELLBYs at the site's one rate (@wellby_factors). The WELLBY slider then puts WELLBYs into healthy years, calibrated so a year of depression is worth the same here as through the GBD weights (@depression); never convert depression into DALYs inside this model.", "number", "WELLBYs"),
        f("household_size", "effect", "Household size", "@household_size.uganda", "TEMPLATE: the site's household size for the place the charity works (facts/household_size.json, the latest DHS survey); add the place's fact if it is missing.", "number"),
        f("household_multiplier", "effect", "Household multiplier (recipient plus spillovers)", "1 + (household_size - 1) * @wellby_factors.household_spillover_ratio_psychotherapy", "Each other household member gains the site's one share of the recipient's effect (HLI's, @wellby_factors).", "multiple"),
    ] + adj_rows(counterfactual_row=inp("counterfactual_adj", "adjustments", "Share of the outcome that wouldn't have happened anyway", {"low": 0.9, "best": 1, "high": 1}, "judgment",
            "1 when the effect is a trial's against its control arm (an RCT's effect is already net of the care as usual its controls had, and of recovery without treatment). Below 1 only for what the control arms didn't have and these clients would: other treatment that has since become available to them (a government service now reaching the same people), or an effect taken from pre-post data with no control group (then the share of the change that wouldn't have come anyway, from the trials' control-arm change). Say which, and the source.", "percent")) + [
        inp("deaths_averted_per_person", "deaths", "Deaths averted per person treated (before adjustments)", 0, "estimate",
            "suicides averted per person treated, by the site's one recipe (templates.md, wellbeing): the yearly suicide rate of the population treated (the clients' sex and age band, in their country: WHO Global Health Estimates) × (the relative risk of suicide with depression − 1) × the share of that excess the treatment removes, over the effect's years as it fades (× 0.5 × effect_duration_years × discount_factor, discounted like the WELLBYs). 0 with an explanation when the evidence shows none.", "small", source=src("WHO Global Health Estimates / meta-analysis")),
        f("value_per_death", "deaths", "Value of a death averted (units of value)", "@moral_weights.uov_per_death_age_15_49 * $life_value_multiplier",
          "TEMPLATE: GiveWell's moral weight for the age band of the people treated (15–49 for most adult programs; @moral_weights.uov_per_death_age_5_14 for school programs; a mix by the clients' ages where both), times your value of a life.", "number", "units of value"),
        f("uov_valued_outside_wellbys", "deaths", "Deaths averted, in units of value", "people_reached * deaths_averted_per_person * total_adj * value_per_death", None, "number", "units of value"),
        f("wellbys_from_uov", "deaths", "Deaths averted, in WELLBYs (cancelled by the unit's conversion)", "uov_valued_outside_wellbys / ($daly_per_wellby * $uov_per_daly)",
          "The one row that puts units of value into WELLBYs; the WELLBY unit's conversion multiplies it back, so the deaths count exactly their shared value at any WELLBY rate.", "number", "WELLBYs"),
        f("outcome_total", "outcome", "WELLBYs", "people_reached * wellbys_per_person * household_multiplier * total_adj + wellbys_from_uov", None, "number", "WELLBYs"),
        f("wellbys_per_dollar", "outcome", "WELLBYs per dollar", "outcome_total / cost_total", None, "small", "WELLBYs / $"),
    ] + donor_rows("wellbys", "WELLBYs", "services") + donor_tail("wellbys", "WELLBYs"),
    "what the charity does, where, " + BOTTOM, "unit_cost", sections=WB_SECTIONS)

# --- corporate-campaign ----------------------------------------------------------------------
T["corporate-campaign"] = model("corporate-campaign", "corporate and producer welfare campaigns", "sad", "sads", "SADs averted", "animal-welfare",
    cost_rows() + [
        inp("animals_per_year", "reach", "Animals per year in the supply chains covered by the commitments won", 10_000_000, "observed",
            "animals per year under the commitments the charity won (or held to account) in the year modelled: company egg or meat volumes ÷ per-animal output. Count everything the commitments cover, not only what is already delivered: whether companies deliver is implementation_adj (the shared fulfilment rate), so a delivered-only count would discount delivery twice. Cite the tracker or the company's report and the conversion.", "integer", "animals / year", src("Cage-Free Tracker / ChickenWatch / company report")),
        inp("share_not_yet_compliant", "reach", "Share not yet compliant when the work happened", {"low": 0.4, "best": 0.6, "high": 0.8}, "observed",
            "animals already covered by the reform before the campaign can't be credited to it.", "percent", source=src("tracker")),
        f("animals_affected_per_year", "reach", "Animals per year the campaign can change", "animals_per_year * share_not_yet_compliant", None, "integer"),
        f("sads_per_animal_year", "effect", "SADs averted per animal-year under the reform", "@sad_factors.sads_per_hen_year_cage_to_aviary",
          "TEMPLATE: the shared figure for the change (facts/sad_factors.json: battery cage to aviary 2024 SADs; enriched cage to aviary, broiler BCC, shrimp stunned 2025 SADs). A new change gets a new fact with sources and a `change` note; never put a SAD figure inline or adapt the shared one. Set the species section to match, with the ced row's version the figure's.", "number", "SADs / animal-year"),
        f("years_of_impact", "effect", "Years a won reform counts before it would have come anyway", "$win_years_counted",
          "The site's one answer to how many years a won pledge, law or rule counts before it would have come anyway (Your values → How impact is counted; docs/normalization.md 2.9). Never the charity's or an evaluator's own figure.", "number", "years"),
        inp("years_until_effect", "effect", "Years from winning the commitments until they take effect", {"low": 1, "best": 3, "high": 6}, "judgment",
            "the wait from the win to the deadline by which companies switch, from the commitments' own deadlines (cite them); the wait is discounted at the shared rate. For an accountability branch credited with the year's observed switches (templates.md, corporate-campaign), the lag between the pressure and the switches it causes (0–2 years), not the time left to every deadline.", "number", "years"),
        f("wait_discount", "effect", "Discount for the wait until the commitments take effect", "(1 + $discount_rate) ^ -years_until_effect", "The wait discounted at the shared rate, like every future benefit.", "percent"),
        f("discounted_years", "effect", "Discounted years of impact", "pv_annuity_due(1, $discount_rate, years_of_impact) * wait_discount", "Years counted, discounted at the shared rate from when the reform takes effect.", "number", "years"),
    ] + adj_rows(implementation_row=f("implementation_adj", "adjustments", "Share of commitments companies keep", "@sad_factors.commitment_fulfilment_cage_free",
            "TEMPLATE: the site's one rate of pledges kept: @sad_factors.commitment_fulfilment_cage_free for cage-free pledges, @sad_factors.commitment_fulfilment_broiler for broiler (BCC/ECC) pledges. A charity's own \"92% of pledges kept\" is the same Chicken Watch data (global, by commitment, among those due) the shared rate is built from: never in its place. Pig, fish and shrimp pledges have no shared record: a judgment input with a range and the tracker it rests on. Not applied to a count of hens already switched (an observed flow is delivered already).", "percent")) + [
        f("outcome_total", "outcome", "SADs averted", "animals_affected_per_year * discounted_years * sads_per_animal_year * total_adj", None, "number", "SADs"),
        f("sads_per_dollar", "outcome", "SADs averted per dollar", "outcome_total / cost_total", None, "number", "SADs / $"),
    ] + donor_rows("sads", "SADs averted", "advocacy", marginal=True) + donor_tail("sads", "SADs averted", marginal=True),
    "what the charity does, where, " + BOTTOM, "past_average", species=[("chicken", None, "2024", [])])

# --- diet-change -----------------------------------------------------------------------------
T["diet-change"] = model("diet-change", "diet change and meal replacement", "sad", "sads", "SADs averted", "animal-welfare",
    cost_rows() + [
        inp("meals_replaced_per_year", "reach", "Animal-product meals replaced per year by the changes made in the year modelled", 1_000_000, "observed",
            "meals per year replaced by the menu changes, pledges or trainings the charity achieved in the year modelled, across all its diet-change work (not one case study). Say how the charity measures it and whether it is self-reported. Only a running total of meals under all the changes won so far (a stock)? Then the wins per year are (meals a year still running + meals a year of changes that lapsed) ÷ the years of the campaign, set against the average real spending over the same years (estimate_basis past_average; templates.md, diet-change); never the year's flow ÷ the changes' average age.", "integer", "meals / year", src("charity impact report")),
        f("sads_per_meal", "effect", "SADs averted per meal replaced", "@sad_factors.sads_per_meal_replaced * meal_mix_vs_reference",
          "The site's one figure for a replaced meal (a Latin American canteen meal, 2024 SADs) times the meal-mix ratio below. Never rebuilt from a meat mix of your own.", "number", "SADs / meal"),
        inp("meal_mix_vs_reference", "effect", "Suffering in a replaced meal here, relative to the reference meal", {"low": 0.5, "best": 1, "high": 2}, "judgment",
            "1, range 0.5–2, unless one published estimate compares this country's replaced meal with the reference meal the same way (then its ratio and range, cited). Never a ratio of two different studies, never a per-meal figure rebuilt from a meat mix of your own (docs/normalization.md 2.9).", "multiple"),
        f("production_response", "effect", "Fall in production per meal not eaten", "@sad_factors.production_response", "Fewer meals bought lowers production by less than one for one, because prices fall and others buy more (Norwood and Lusk 2011).", "percent"),
        f("years_of_impact", "effect", "Years a won menu change counts", "$win_years_counted",
          "TEMPLATE: a menu or procurement change the charity won counts the site's one number of years (docs/normalization.md 2.9; no wait for meal policies). If meals_replaced_per_year is the year's whole flow from all partners, old and new, set 1 (a flow is credited once). For individuals' diet change, replace with a sourced estimate of how long it lasts.", "number", "years"),
        f("discounted_years", "effect", "Discounted years of impact", "pv_annuity_due(1, $discount_rate, years_of_impact)", None, "number", "years"),
    ] + adj_rows() + [
        f("outcome_total", "outcome", "SADs averted", "meals_replaced_per_year * discounted_years * sads_per_meal * production_response * total_adj", None, "number", "SADs"),
        f("sads_per_dollar", "outcome", "SADs averted per dollar", "outcome_total / cost_total", None, "number", "SADs / $"),
    ] + donor_rows("sads", "SADs averted", "advocacy") + donor_tail("sads", "SADs averted"),
    "what the charity does, where, " + BOTTOM, "unit_cost", species=[(sp, f"@sad_factors.meal_sads_share_{sp}", "2024", []) for sp in ("fish", "chicken", "pig")])

# --- policy-research-meta --------------------------------------------------------------------
# The shared moved-money rows, word for word from src/engine/moved-money.ts (INV-12).
MM = json.loads(subprocess.run(["npx", "tsx", os.path.join(ROOT, "scripts/moved-money.ts"), "global-health", "net"],
                               cwd=ROOT, check=True, capture_output=True, text=True).stdout)
CAREER_SECTION = {"id": "careers", "title": "Career changes", "kind": "ours", "explainer": "People the charity moves into high-impact jobs: per career changed, the pay they give up for the years they stay, valued at the new employer's live result per dollar, times the share of changes the charity caused (docs/normalization.md 2.8). The mirror of staff pay below market."}

def policy_rows(unit_word):
    return [
        inp("units_affected_per_year", "reach", f"People or animals per year the policy or research would affect", 1_000_000, "observed",
            "the population under the law or rule, or that the research's results reach, per year. 0 with an explanation if the charity only moves money.", "integer", source=src("government statistics / charity report")),
        inp("value_per_unit_year", "effect", f"Value per unit affected per year, in {unit_word}", {"low": 0.001, "best": 0.003, "high": 0.01}, "estimate",
            f"the downstream benefit per person or animal per year, in {unit_word}, built from the same shared figures a direct model of that benefit would use (deaths at @moral_weights × $life_value_multiplier, the site's SADs per change). Where it is the result per dollar of a program the site models, read that model live (#model-id) instead of typing its number.", "small", source=src("charityevals model of the downstream intervention")),
        inp("p_success", "effect", "Probability the change happens because of this work", {"low": 0.02, "best": 0.1, "high": 0.3}, "judgment",
            "the probability that the policy passes or the research changes decisions in the period, given the charity's work. Base it on a reference class (share of similar bills passed, of similar campaigns won) and say which. A not-yet-proven meta organisation's chance of success is @meta.success_chance_new_org, not this row.", "percent"),
        f("years_of_impact", "effect", "Years a won reform counts before it would have come anyway", "$win_years_counted",
          "The site's one answer (Your values → How impact is counted; docs/normalization.md 2.9). Never the charity's or an evaluator's own years.", "number", "years"),
    ]

POLICY_SECTIONS = SECTIONS[:4] + [MM["section"], CAREER_SECTION] + SECTIONS[4:]
T["policy-research-meta"] = model("policy-research-meta", "policy, research and meta", "uov", "uov", "Units of value", "global-health",
    cost_rows() + policy_rows("units of value") + [
        inp("years_until_effect", "effect", "Years from the win until the policy takes effect", {"low": 0, "best": 1, "high": 3}, "judgment",
            "the wait from the win to when the rule or law applies (its own implementation date, cited); discounted at the shared rate.", "number", "years"),
        f("wait_discount", "effect", "Discount for the wait until the policy takes effect", "(1 + $discount_rate) ^ -years_until_effect", "The wait discounted at the shared rate, like every future benefit.", "percent"),
        f("discounted_years", "effect", "Discounted years of impact", "pv_annuity_due(1, $discount_rate, years_of_impact) * wait_discount", None, "number", "years"),
        f("downstream_value", "effect", "Expected value of the policy or research (before adjustments)", "units_affected_per_year * value_per_unit_year * p_success * discounted_years", None, "number"),
        inp("money_moved", "reach", "Money moved or raised for other charities in the year modelled (US$)", 500_000, "observed",
            "donations the charity moved or raised for other charities in the same year as the cost, gross, from its own report (0 with an explanation if it moves none). Valued only through the shared rows below: never a multiple of cash, a counterfactual share or a leverage ratio of the charity's or an evaluator's own.", "usd", source=src("charity money-moved report")),
        f("moved_per_dollar", "reach", "Money moved per dollar of the charity's cost", "money_moved / cost_total", "Context, and the donors' share of the resources with credit by share of resources on.", "multiple"),
    ] + MM["rows"] + [
        f("moved_value", "effect", "Value of the money moved (units of value)", "money_moved * moved_dollar_net_value", None, "number", "units of value"),
        inp("careers_changed", "careers", "Careers changed to high-impact work in the year modelled", 0, "observed",
            "people the charity moved into high-impact jobs in the year modelled, from its own survey (0 with an explanation for most charities).", "integer", source=src("charity impact survey")),
        inp("career_forgone_pay", "careers", "Pay a career changer gives up per year (US$)", {"low": 5000, "best": 15000, "high": 30000}, "estimate",
            "what they could earn elsewhere less what they take, per year.", "usd", source=src("salary survey")),
        inp("career_years_stayed", "careers", "Years a career changer stays in high-impact work", {"low": 2, "best": 5, "high": 10}, "estimate",
            "from the charity's follow-up survey or a labelled reference class.", "number", "years", src("follow-up survey")),
        f("career_years", "careers", "Years a career changer stays, discounted", "pv_annuity_due(1, $discount_rate, career_years_stayed)", "Discounted at the shared rate.", "number", "years"),
        f("career_employer_value", "careers", "Value of a dollar of the new employers' work (units of value)", "moved_dollar_value",
          "TEMPLATE: the employer's live result per dollar (#model-id) where the jobs are at one charity the site models; the moved-money destinations where they are spread over many.", "small", "units of value / $"),
        inp("career_counterfactual_share", "careers", "Share of the career changes the charity caused", {"low": 0.1, "best": 0.3, "high": 0.6}, "judgment",
            "the share of the changes that wouldn't have happened without the charity, from its own survey of what people would have done, or a labelled reference class.", "percent"),
        f("career_change_value", "careers", "Value of one career change (units of value)", "career_forgone_pay * career_years * career_employer_value * career_counterfactual_share", "The site's one career-change step (docs/normalization.md 2.8).", "number", "units of value"),
        f("careers_value", "careers", "Value of the career changes (units of value)", "careers_changed * career_change_value", None, "number", "units of value"),
    ] + adj_rows(implementation=False) + [
        f("outcome_total", "outcome", "Total value (units of value)", "downstream_value * total_adj + moved_value + careers_value",
          "The adjustments apply to the policy and research branch; money moved counts its counterfactual through the shared new-money share, career changes through their own share.", "number", "units of value"),
        f("uov_per_dollar", "outcome", "Value per dollar", "outcome_total / cost_total", "For WELLBYs, rename the uov_* rows to wellbys_* and report in wellby. For animals, rename them to sads_* and add the species section of the corporate-campaign template (output ced_per_donor_dollar). For climate, start from the climate skeleton.", "small"),
    ] + donor_rows("uov", "Units of value", "research", marginal=True)
      + donor_tail("uov", "Units of value", marginal=True, dcs="cost_total / (cost_total + if($resource_shares, salary_sacrifice + money_moved * new_money_share, 0))"),
    "what the charity does, the causal chain to the outcome, " + BOTTOM, "past_average", sections=POLICY_SECTIONS)

CONV_SECTION = {"id": "conversion", "title": "Air pollution these tonnes carry", "kind": "ours", "explainer": "Every tonne avoids its heat deaths; a tonne from burning less fossil fuel near people also avoids air-pollution deaths. These rows say how much of the shared air-pollution rate applies to this charity's tonnes (docs/normalization.md 2.5); the rates themselves stay shared."}
T["policy-research-meta-climate"] = model("policy-research-meta", "climate policy and research", "tco2e", "tco2e", "Tonnes of CO₂e averted", "climate",
    cost_rows() + [
        inp("tonnes_per_year_if_won", "reach", "Tonnes of CO₂e a year the policy or technology would avert once in effect", 1_000_000, "estimate",
            "emissions avoided per year once the rule, law or technology the charity works on is in effect, from the regulator's or a modelling study's estimate (cited), in tonnes of CO₂e.", "integer", "t CO₂e / year", src("regulatory impact assessment / modelling study")),
        inp("p_success", "effect", "Probability the change happens because of this work", {"low": 0.02, "best": 0.1, "high": 0.3}, "judgment",
            "the probability that the change happens in the period because of the charity's work, from a reference class (similar rules won, similar campaigns) named here.", "percent"),
        f("years_of_impact", "effect", "Years a won reform counts before it would have come anyway", "$win_years_counted",
          "The site's one answer (docs/normalization.md 2.9).", "number", "years"),
        inp("years_until_avoided", "effect", "Years from the grant until the tonnes are avoided", {"low": 2, "best": 5, "high": 10}, "judgment",
            "the wait until the tonnes are avoided (the rule's effective date, plants re-powered, trees grown), from the policy's own dates where it has them; discounted at the shared rate.", "number", "years"),
        f("wait_discount", "effect", "Discount for the wait until the tonnes are avoided", "(1 + $discount_rate) ^ -years_until_avoided", "The wait discounted at the shared rate; the unit's conversion then discounts the heat deaths from the year the tonne is avoided, so nothing is discounted twice.", "percent"),
        f("discounted_years", "effect", "Discounted years of impact", "pv_annuity_due(1, $discount_rate, years_of_impact) * wait_discount", None, "number", "years"),
        f("downstream_value", "effect", "Expected tonnes averted (before adjustments)", "tonnes_per_year_if_won * p_success * discounted_years", None, "number", "t CO₂e"),
        inp("fuel_share", "conversion", "Share of these tonnes from burning less fossil fuel near people", {"low": 0.5, "best": 0.8, "high": 1}, "estimate",
            "the share of the tonnes that come from burning less fuel (power, industry, transport) rather than land use, capture or methane. 0 for tonnes with no smoke.", "percent", source=src("emissions inventory")),
        inp("fuel_smoke_factor", "conversion", "Air-pollution deaths per tonne of this fuel, relative to the fossil-fuel average", {"low": 0.02, "best": 0.1, "high": 0.3}, "estimate",
            "this fuel's and place's smoke per tonne of CO₂ against the average behind the shared rate, from per-fuel evidence (deaths per TWh, e.g. Markandya & Wilkinson 2007), not the world average.", "number", source=src("deaths per TWh study")),
        f("air_pollution_weight", "conversion", "Air pollution these tonnes cut, relative to an average fossil-fuel tonne", "fuel_share * fuel_smoke_factor", "Read by the tco2e unit's conversion (docs/normalization.md 2.5).", "number"),
        f("extra_deaths_per_tco2e", "conversion", "Air-pollution deaths averted per tonne, counted directly (none here)", "0",
          "TEMPLATE: deaths a source counts directly beside the tonnes (a coal plant's own death count), per tonne brought forward, as an input with its source; 0 when the smoke is in air_pollution_weight, so nothing is counted twice.", "small"),
    ] + adj_rows(implementation=False) + [
        f("outcome_total", "outcome", "Tonnes of CO₂e averted", "downstream_value * total_adj", None, "number", "t CO₂e"),
        f("tco2e_per_dollar", "outcome", "Tonnes of CO₂e averted per dollar", "outcome_total / cost_total", None, "small", "t CO₂e / $"),
    ] + donor_rows("tco2e", "Tonnes of CO₂e averted", "research", marginal=True) + donor_tail("tco2e", "Tonnes of CO₂e averted", marginal=True),
    "what the charity does, the causal chain to the tonnes, " + BOTTOM, "past_average",
    sections=SECTIONS[:4] + [CONV_SECTION] + SECTIONS[4:], id="template-policy-research-meta-climate")

os.makedirs(OUT, exist_ok=True)
for name, m in T.items():
    with open(os.path.join(OUT, f"{name}.json"), "w") as fh:
        json.dump(m, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
print("wrote", len(T))
