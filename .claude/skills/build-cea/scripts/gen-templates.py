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
                    pledges kept @sad_factors.commitment_fulfilment_*, @next_dollar.<charity>
  diet-change       @sad_factors.sads_per_meal_replaced x meal_mix_vs_reference,
                    @sad_factors.production_response, $win_years_counted for won menu changes
  policy-research-meta  won policy ($win_years_counted, the wait), money moved through the shared
                    rows of src/engine/moved-money.ts (#model-id, @meta), the career-change step,
                    @next_dollar.<charity>; a climate skeleton in tco2e with years_until_avoided,
                    air_pollution_weight, extra_deaths_per_tco2e and methane_share
  domestic-services, humanitarian-relief, medical-research, conservation, rights-advocacy  in DALYs,
                    each other unit's outcome through one fixed bridge row (src/engine/bridges.ts,
                    docs/normalization.md 2.6); companion-animals  days of pain -> ced_dog / ced_cat
                    with @welfare_ranges (the raw species step)
  catastrophic-risk  yearly chances by size (@catastrophe, $ai_catastrophe_chance), a typical dollar's cut
                    (AI: misalignment and misuse presets weighted by ai_misuse_cost_share), deaths by the world's age split, the future through future_years_per_person,
                    each branch's adjustments applied to its own value (chained by healthy years, w_<branch>)
  every skeleton    missing_data_adj in total_adj (a branch's <branch>_missing_data_adj): the shared
                    $missing_data_discount where the outcome isn't measured for this charity, else 1 with
                    the reason (docs/normalization.md 2.12)
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..", "templates")
EX = "https://example.org/REPLACE"
D = "2026-01-01"
PUBLISHED = "2026-11-04"  # the build date; on or after src/engine/lint.ts MISSING_DATA_RULE_DATE

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

def missing_data_row(id, section, what="this branch's outcome"):
    """The shared missing-data step (docs/normalization.md 2.12, templates.md Convention 12): one marker per
    branch (Convention 4: <branch>_missing_data_adj), the shared slider or 1, nothing else."""
    return f(id, section, "Counted less where the outcome isn't measured for this charity", "$missing_data_discount",
             f"TEMPLATE: the shared missing-data step (docs/normalization.md 2.12). Keep $missing_data_discount when {what} rests on the research literature or on judgment rather than on this charity's own data: reach that is a judgment (spending over an assumed cost per person, no count of its own), an effect that is a judgment, or a programme with no outcome data built from the literature on its kind of work. Set the formula to 1 only when the charity's own count of who got the intervention meets an effect measured with a credible counterfactual (its own controlled evaluation, or trials of the same intervention delivered the same way, dose and population), and say which here.", "percent")

ATTRIBUTION = "where other organisations contributed to the same outcome (co-funders, coalition campaigns, government delivery), this charity's share of everyone's spending on it. Others' in-kind work counts too: government staff time, partners' own delivery costs, and volunteers' unpaid time (beyond any stipend the charity pays, which is in its cost), valued at the local wage for the hours given. 1 when it delivers alone."

def adj_rows(extra=(), leverage=False, unmodelled=False, implementation=True, implementation_row=None, factors_extra=(), evidence_rows=None, counterfactual_row=None, unmodelled_rows=None, leverage_row=None, attribution_row=None):
    rows = list(evidence_rows) if evidence_rows else [
        inp("evidence_adj", "adjustments", "Evidence adjustment (internal and external validity), a multiplier", {"low": 0.5, "best": 0.7, "high": 0.9}, "judgment",
            "how far the effect size above should be trusted for this charity's setting: publication bias, self-report bias, replication, differences between study populations and this program. A multiplier (1 = take the studies at face value), the product of its parts; say each part, its anchor (the same adjustment in another model of this intervention) and the range.", "multiple"),
    ]
    rows.append(counterfactual_row or inp("counterfactual_adj", "adjustments", "Share of the outcome that wouldn't have happened anyway", {"low": 0.6, "best": 0.8, "high": 0.95}, "judgment",
            "the share of the outcome that would not have happened without the program (other providers, existing trends, government). Cite coverage data or trend data where possible.", "percent"))
    rows += [
        attribution_row or inp("attribution_share_shared", "adjustments", "This charity's share of the resources behind the outcome", {"low": 0.5, "best": 0.8, "high": 1}, "judgment",
            ATTRIBUTION, "percent"),
        f("attribution_share", "adjustments", "Share of credit used", "attribution_share_shared",
          "The charity's share of the resources behind the outcome; it applies whichever way credit is shared.", "percent"),
    ]
    if implementation:
        rows.append(implementation_row or inp("implementation_adj", "adjustments", "Delivery adjustment (fidelity, compliance, follow-through)", {"low": 0.6, "best": 0.8, "high": 0.95}, "judgment",
            "the share of the reported reach that actually receives the intervention as studied: dose completion, coverage survey vs. reported.", "percent"))
    if leverage:
        rows.append(leverage_row or inp("leverage_funging_adj", "adjustments", "Leverage and funging", {"low": 0.85, "best": 0.95, "high": 1.05}, "judgment",
            "below 1 when other funders (governments, the Global Fund) would have paid for this work without the donation; above 1 when the donation pulls in other money. GiveWell's top charities typically sit at 0.85–0.95.", "multiple"))
    rows += list(extra)
    rows.append(missing_data_row("missing_data_adj", "adjustments"))
    factors = ["evidence_adj", "counterfactual_adj", "attribution_share"] + (["implementation_adj"] if implementation else []) + (["leverage_funging_adj"] if leverage else []) + list(factors_extra) + ["missing_data_adj"]
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
        rows.append(f("marginal_vs_past_average", "donor", "How much the next dollar does compared with the average dollar so far", "@next_dollar.no_evidence",
                      "TEMPLATE: replace the formula with `@next_dollar.<charity id, - as _>`, the charity's own figure written by docs/normalization.md 2.10 (room × use × run) in facts/next_dollar.json; the no-evidence figure here is only a placeholder that loads. This model's cost per outcome is the charity's past spending over what it won (estimate_basis past_average), so the next dollar is valued as a share of the average. 1 in `published`: what the past average itself says.", "percent", published=1))
    return rows

UNITS = json.load(open(os.path.join(ROOT, "assumptions", "default.json")))["units"]

def bridge(input, frm, to):
    """The one sanctioned way an outcome in one unit enters a model reporting in another (docs/normalization.md
    2.6, src/engine/bridges.ts bridgeFormula): times its unit's conversion, over the output unit's, so the output
    unit's conversion cancels and the outcome moves with its own sliders only."""
    tf, tt = UNITS[frm]["to_common"], UNITS[to]["to_common"]
    return input + ("" if tf == "1" else f" * ({tf})") + ("" if tt == "1" else f" / ({tt})")

BRIDGE_SECTION = {"id": "bridges", "title": "Other outcomes, in this model's unit", "kind": "ours", "explainer": "charityevals' standard step for outcomes in more than one unit (docs/normalization.md 2.6): each outcome is counted in its own unit (units of value for income and deaths, WELLBYs for life satisfaction, tonnes of CO₂e, chicken pain days) and put into this model's unit by its unit's conversion over this unit's, which the headline's conversion cancels. So each moves only with its own sliders, exactly as in a model of its own unit. The rows are fixed; don't edit them."}
PREFIX_OF = {"uov": "uov", "daly": "dalys", "wellby": "wellbys", "ced": "ced", "tco2e": "tco2e"}

def donor_tail(prefix, unit_label, marginal=False, dcs="cost_total / (cost_total + if($resource_shares, salary_sacrifice, 0))", unit="uov", animal=False):
    base = f"{prefix}_per_dollar * donor_cost_share" + (" * marginal_vs_past_average" if marginal else "")
    return [
        f("donor_cost_share", "donor", "Share of the full cost paid by cash donations", dcs, None, "percent"),
        f(f"{prefix}_per_donor_dollar", "donor", f"{unit_label} per dollar you give", base, None, "small", f"{unit_label} / $"),
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
    rows.append(f("ced_per_donor_dollar", "species", "Chicken-equivalent pain days averted per dollar you give", " + ".join(f"ced_{sp}" for sp, *_ in shares),
                  "Every species, already in chicken pain days.", "small", "chicken pain days / $"))
    return rows

def raw_species_rows(shares, base="pain_days_per_donor_dollar"):
    """The species step for days of pain counted in the animal itself (no Ambitious Impact weight inside):
    pain_days_<s> * @welfare_ranges.<s>_vs_chicken, the `raw` template of src/engine/invariants.ts."""
    rows = []
    for sp, share in shares:
        rows.append(f(f"pain_days_{sp}", "species", f"Days of pain spared per dollar you give: {sp}s", f"{base} * {share}", None, "number"))
        rows.append(f(f"ced_{sp}", "species", f"Chicken-equivalent pain days averted per dollar you give: {sp}s", f"pain_days_{sp} * @welfare_ranges.{sp}_vs_chicken",
                      f"Rethink Priorities' welfare range for the species relative to a chicken (@welfare_ranges.{sp}_vs_chicken). The formula is the standard one; don't edit it.", "number"))
    rows.append(f("ced_per_donor_dollar", "species", "Chicken-equivalent pain days averted per dollar you give", " + ".join(f"ced_{sp}" for sp, _ in shares),
                  "Every species, already in chicken pain days.", "small", "chicken pain days / $"))
    return rows

def model(family, name, unit, prefix, unit_label, cause, rows, summary, basis, species=None, sections=None, id=None, out=None):
    out = out or {"row": f"{prefix}_per_donor_dollar", "unit": unit, "label": f"{unit_label} per dollar you give", "native": {"row": f"{prefix}_per_dollar", "unit": unit}}
    if species:
        out = {"row": "ced_per_donor_dollar", "unit": "ced", "label": "Chicken-equivalent pain days averted per dollar you give",
               "native": {"row": f"{prefix}_per_dollar", "unit": unit}, "species": [sp for sp, *_ in species]}
        rows = rows + species_rows(species)
    secs = list(sections or SECTIONS)
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
        "source": {"publisher": "charityevals", "title": f"charityevals' estimate: {name}", "url": f"https://charityevals.org/{mid}", "published": PUBLISHED, "retrieved": D},
        "resources": [],
        "sections": secs + ([SPECIES_SECTION] if species else []),
        "rows": rows,
        "output": out,
    }

BOTTOM = "the year modelled, the bottom line in years of healthy life per $1,000 (quote it live in the write-up), and the biggest uncertainty."

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
        inp("dalys_illness_averted_per_person", "effect", "Illness averted per person reached, in DALYs (before adjustments)", 0, "estimate",
            "illness counted directly as healthy years: cases averted (or treated) per person × the GBD disability weight of the condition (@gbd_disability_weights where the site has it; add the weight there from the GBD 2019 disability-weights table if not) × the years it lasts, discounted at $discount_rate where it lasts more than a year. The route for hospital, hospice and other care in rich countries, where illness, not deaths, is most of the good. 0 when illness is in morbidity_value_ratio (GiveWell's share) instead: never both.", "small", "DALYs", src("GBD 2019 disability weights / trial")),
        f("dalys_bridged", "bridges", "Illness averted, in DALYs", "people_reached * dalys_illness_averted_per_person * total_adj", None, "number", "DALYs"),
        f("uov_from_daly", "bridges", "Illness averted, in units of value", bridge("dalys_bridged", "daly", "uov"),
          "The bridge from DALYs into units of value: the unit's conversion cancels it, so illness counts as healthy years whatever \"Healthy year vs doubled-income year\" is set to.", "number", "units of value"),
        f("outcome_total", "outcome", "Total units of value", "(uov_deaths + uov_stillbirths + uov_income + uov_from_daly) * (1 + unmodelled_benefits_adj) + uov_morbidity",
          "Illness and the other supplementary shares add to the modelled value side by side, as one sum of shares does in GiveWell's sheets; illness counted in DALYs comes in through its bridge, inside the side-effect share like every other outcome.", "number", "units of value"),
        f("uov_per_dollar", "outcome", "Units of value per dollar", "outcome_total / cost_total", None, "small", "units of value / $"),
    ] + donor_rows("uov", "Units of value", "goods") + donor_tail("uov", "Units of value"),
    "what the charity does, where, " + BOTTOM, "unit_cost", sections=SECTIONS[:4] + [BRIDGE_SECTION] + SECTIONS[4:])

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
            "recipients' consumption per person per year before the transfer, in 2017 international dollars, from the program's baseline survey or the World Bank poverty data for the region (household-survey consumption, @survey_consumption.*); a national-accounts figure only × the country's shared survey-to-national-accounts ratio (@survey_consumption.survey_to_na_<iso3>, a shared conversion, not thin data).", "usd", source=src("baseline survey / World Bank PIP")),
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
    ] + donor_rows("wellbys", "WELLBYs", "services") + donor_tail("wellbys", "WELLBYs", unit="wellby"),
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
    ] + donor_rows("sads", "SADs averted", "advocacy", marginal=True) + donor_tail("sads", "SADs averted", marginal=True, unit="ced", animal=True),
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
    ] + donor_rows("sads", "SADs averted", "advocacy") + donor_tail("sads", "SADs averted", unit="ced", animal=True),
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
        f("career_forgone_pay", "careers", "Pay a career changer gives up per year (US$)", "@meta.career_forgone_pay_default",
          "TEMPLATE: the site's shared default (facts/meta.json) while careers_changed is 0; a charity that changes careers replaces it with an input: what they could earn elsewhere less what they take, per year, from a salary survey.", "usd"),
        f("career_years_stayed", "careers", "Years a career changer stays in high-impact work", "@meta.career_years_stayed_default",
          "TEMPLATE: the site's shared default (facts/meta.json) while careers_changed is 0; else an input from the charity's follow-up survey or a labelled reference class.", "number", "years"),
        f("career_years", "careers", "Years a career changer stays, discounted", "pv_annuity_due(1, $discount_rate, career_years_stayed)", "Discounted at the shared rate.", "number", "years"),
        f("career_employer_value", "careers", "Value of a dollar of the new employers' work (units of value)", "moved_dollar_value",
          "TEMPLATE: the employer's live result per dollar (#model-id) where the jobs are at one charity the site models; the moved-money destinations where they are spread over many.", "small", "units of value / $"),
        f("career_counterfactual_share", "careers", "Share of the career changes the charity caused", "@meta.career_counterfactual_share_default",
          "TEMPLATE: the site's shared default (facts/meta.json) while careers_changed is 0; else an input: the share of the changes that wouldn't have happened without the charity, from its own survey of what people would have done, or a labelled reference class.", "percent"),
        f("career_change_value", "careers", "Value of one career change (units of value)", "career_forgone_pay * career_years * career_employer_value * career_counterfactual_share", "The site's one career-change step (docs/normalization.md 2.8).", "number", "units of value"),
        missing_data_row("careers_missing_data_adj", "careers", "the career changes' count or counterfactual share"),
        f("careers_value", "careers", "Value of the career changes (units of value)", "careers_changed * career_change_value * careers_missing_data_adj", None, "number", "units of value"),
    ] + adj_rows(implementation=False) + [
        f("outcome_total", "outcome", "Total value (units of value)", "downstream_value * total_adj + moved_value + careers_value",
          "The adjustments apply to the policy and research branch; money moved counts its counterfactual through the shared new-money share (its dollars are measured, so no missing-data step), career changes through their own share and missing-data step.", "number", "units of value"),
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
        f("methane_share", "conversion", "Share of these tonnes that are methane", "0",
          "TEMPLATE: the share of the tonnes (CO₂e) that is methane, weighted by tonnes a year before waits and years counted (a conversion row reads no shared assumption); the shared conversion values it by methane's own timing and adds its ozone deaths (docs/normalization.md 2.5). 0 for CO₂ only.", "percent"),
    ] + adj_rows(implementation=False) + [
        f("public_usd_per_year", "adjustments", "Public money a year that buys the tonnes or funds the work (none here)", "0",
          "TEMPLATE: public money the win spends a year once in effect (a tax credit per tonne × the tonnes, grants, public procurement, a won fund's levies) from a shared fact (facts/climate.json: the credit per tonne, the law's yearly cost), as an input with its source; 0 when the tonnes come with no public money.", "integer", "$ / year"),
        f("public_payer_uov_per_dollar", "adjustments", "Value lost per dollar of that money, units of value", "@public_funds.mcpf * $uov_per_ln_consumption / (@public_funds.us_federal_payer_multiple * @united_states.ce_expenditure_per_person_2024)",
          "TEMPLATE: what a dollar of public money costs its payers (docs/normalization.md 2.23): the shared cost of raising it over the payers' consumption on the survey scale (2.14), here US federal taxpayers. Other payers: their country's survey-scale consumption; a levy on traded goods: its payers at the shared compliance-cost multiple, without the cost of raising public funds.", "small", "units of value / $"),
        f("public_cost_uov", "adjustments", "What the public money costs its payers, units of value (negative)", "-public_usd_per_year * public_payer_uov_per_dollar * p_success * discounted_years * total_adj",
          "Netted against the tonnes it buys (docs/normalization.md 2.23), over the same years, wait and adjustments as the tonnes: money paid per unit delivered takes every adjustment; a fixed sum (grants, appropriations) all but the evidence step (divide total_adj by evidence_adj); a levy the steps of the spending it pays for.", "number", "units of value"),
        f("tco2e_from_uov", "bridges", "The public money's cost to its payers, in tonnes of CO₂e (negative)", bridge("public_cost_uov", "uov", "tco2e"),
          "Units of value into tonnes by the site's fixed bridge (docs/normalization.md 2.6). Fixed.", "number", "t CO₂e"),
        f("outcome_total", "outcome", "Tonnes of CO₂e averted", "downstream_value * total_adj + tco2e_from_uov", None, "number", "t CO₂e"),
        f("tco2e_per_dollar", "outcome", "Tonnes of CO₂e averted per dollar", "outcome_total / cost_total", None, "small", "t CO₂e / $"),
    ] + donor_rows("tco2e", "Tonnes of CO₂e averted", "research", marginal=True) + donor_tail("tco2e", "Tonnes of CO₂e averted", marginal=True, unit="tco2e"),
    "what the charity does, the causal chain to the tonnes, " + BOTTOM, "past_average",
    sections=SECTIONS[:4] + [CONV_SECTION, BRIDGE_SECTION] + SECTIONS[4:], id="template-policy-research-meta-climate")

# --- outcomes in several units (the new families) --------------------------------------------
VPD = "(share_under5 * @moral_weights.uov_per_death_under5 + (1 - share_under5) * (share_5_14_of_over5 * @moral_weights.uov_per_death_age_5_14 + (1 - share_5_14_of_over5) * (share_15_49_of_over15 * @moral_weights.uov_per_death_age_15_49 + (1 - share_15_49_of_over15) * @moral_weights.uov_per_death_age_50_74))) * $life_value_multiplier"

# Future generations (docs/normalization.md 2.19): the discounted healthy years of people not yet born, per person of
# the long-run population, if humanity's future ends now. The people alive are counted as deaths, so the stream rises
# from nothing to the long-run population over one lifetime (a linear ramp, closed form), then runs for ever:
# (1 - e^-dL) / (d^2 L) with d = ln(1 + rate); 1/d - L/2 at a rate near 0.
FUTURE = "(1 - (1 + $discount_rate) ^ -@catastrophe.life_expectancy_now) / (ln(1 + $discount_rate) * ln(1 + $discount_rate) * @catastrophe.life_expectancy_now)"
FUTURE_ROW = f("future_years_per_person", "effect", "Discounted future years of healthy life per person of the long-run population, if the future ends now", FUTURE,
    "The site's one count of future generations (docs/normalization.md 2.19): the healthy years of people not yet born, discounted for ever at the shared rate. People alive now die in the catastrophe and are counted as deaths, so this stream rises from nothing to the long-run population over one lifetime (@catastrophe.life_expectancy_now) and then runs on: about 8 years at the default 4%, about 960 at the 0.1% floor. Fixed; don't edit.", "number", "years")

def age_rows(section, under5, what):
    return [
        inp("share_under5", section, f"Share of {what} that are of children under five", under5, "estimate",
            "the age split of the deaths averted, from WHO Global Health Estimates or IHME GBD for the causes and places (a split another model could reuse goes into facts/death_ages.json and is read here).", "percent", source=src("WHO Global Health Estimates / IHME GBD")),
        inp("share_5_14_of_over5", section, f"Of {what} at five or older, share aged 5 to 14", {"low": 0.1, "best": 0.2, "high": 0.4}, "estimate",
            "the rest of the age split, band by band, from the same source, so every death is valued at its own band (docs/normalization.md 2.7).", "percent", source=src("WHO Global Health Estimates / IHME GBD")),
        inp("share_15_49_of_over15", section, f"Of {what} at 15 or older, share aged 15 to 49", {"low": 0.3, "best": 0.5, "high": 0.7}, "estimate",
            "the rest at 50 and over (GiveWell's 50-74 weight; for deaths mostly above 75, as in rich-country care, a mix of @moral_weights.givewell_age_75_79 … _85_plus by the deaths' ages instead).", "percent", source=src("WHO Global Health Estimates / IHME GBD")),
    ]

def multi(inputs, direct, unmodelled=True, extra_outcome=(), side=("unmodelled_benefits_adj",)):
    """Bridges for every unit a family counts in (`inputs`: unit -> (formula, label)), summed with the DALYs
    counted directly into outcome_total, in DALYs; `side`: the added shares (side effects) in the last factor."""
    rows, parts = [], ["dalys_direct"]
    for unit, (formula, label) in inputs.items():
        p = PREFIX_OF[unit]
        rows.append(f(f"{p}_bridged", "bridges", f"{label}, in {UNITS[unit]['label']} (before adjustments)", formula, None, "number", UNITS[unit]["short"]))
        rows.append(f(f"dalys_from_{unit}", "bridges", f"{label}, in healthy years", bridge(f"{p}_bridged", unit, "daly"),
                      f"The bridge from {UNITS[unit]['short']} into healthy years (docs/normalization.md 2.6): fixed, don't edit.", "number", "DALYs"))
        parts.append(f"dalys_from_{unit}")
    rows.append(f("dalys_direct", "outcome", "Healthy years counted directly (before adjustments)", direct, None, "number", "DALYs"))
    rows += list(extra_outcome)
    rows.append(f("outcome_total", "outcome", "Years of healthy life", f"({' + '.join(parts)}) * total_adj" + (f" * (1 + {' + '.join(side)})" if unmodelled else ""),
                  "Every outcome, each in healthy years by its own unit's conversion, times the adjustments.", "number", "DALYs"))
    rows.append(f("dalys_per_dollar", "outcome", "Years of healthy life per dollar", "outcome_total / cost_total", None, "small", "DALYs / $"))
    return rows

MULTI_SECTIONS = SECTIONS[:4] + [BRIDGE_SECTION] + SECTIONS[4:]
LS = "life-satisfaction points (0-10) gained per person per year while it lasts: a WELLBY per point-year. A result in standard deviations of a wellbeing or depression scale is SDs × @wellby_factors.wellbys_per_sd_year (a formula row); PHQ-9 points ÷ @depression.phq9_sd first. Never converted into DALYs here (the bridge does it)."

# --- domestic-services -----------------------------------------------------------------------
T["domestic-services"] = model("domestic-services", "social services in rich countries", "daly", "dalys", "Years of healthy life", "global-health",
    cost_rows() + [
        inp("households_reached", "reach", "Households served in the year modelled", 10_000, "observed",
            "households (or individuals, with household_size 1 and the reason) that received the service in the year the spending covers: food parcels, housing, mentoring, visits, gifts. Unique households, not visits; say how the charity counts.", "integer", source=src("charity annual report")),
        f("household_size", "reach", "People per household", "@household_size.united_states",
          "TEMPLATE: the site's household size for the country (@household_size.united_states, @household_size.united_kingdom; add the country's from its statistics office). 1, with the reason, for a service to one person (a mentee, a veteran, an older person living alone).", "number", "people"),
        f("people_reached", "reach", "People reached", "households_reached * household_size", None, "integer"),
        f("cost_per_person", "reach", "Cost per person reached", "cost_total / people_reached", "Context: compare with the charity's own figure and with other models of the family.", "usd"),
        inp("ls_gain_per_person_year", "effect", "Life satisfaction gained per person per year while the effect lasts (points, 0-10)", {"low": 0.02, "best": 0.1, "high": 0.3}, "estimate",
            LS + " From a trial or quasi-experiment of the same service (food insecurity, housing, mentoring, loneliness), else a published wellbeing valuation of the change it makes; 0, with the reason, when the evidence is only on income or health.", "number", "points", src("trial / wellbeing study")),
        inp("ls_effect_years", "effect", "Years the wellbeing effect lasts", {"low": 0.5, "best": 1, "high": 3}, "estimate",
            "from follow-ups; 1 for a year's service whose effect ends with it.", "number", "years", src("follow-up study")),
        f("wellbys_per_person", "effect", "WELLBYs per person reached, discounted", "ls_gain_per_person_year * pv_annuity_due(1, $discount_rate, ls_effect_years)", "Point-years, discounted at the shared rate.", "number", "WELLBYs"),
        inp("value_per_person", "effect", "Value received per person in the year (US$)", {"low": 200, "best": 400, "high": 800}, "estimate",
            "what the goods or services are worth to the people who get them, per person per year, at what they would otherwise pay (food at retail, rent saved, benefits claimed), in US dollars (pounds × @fx.usd_per_gbp_<year>). Only the part not already counted as wellbeing or health above; 0 for services with no money value.", "usd", source=src("charity report / price data")),
        f("consumption_mean", "effect", "Average consumption per person in the country by the household survey (US$)", "@united_states.ce_expenditure_per_person_2024",
          "TEMPLATE: the household-survey consumption per person of the country (@united_states.ce_expenditure_per_person_2024, the Consumer Expenditure Survey, whose income-fifth ratios scale it to the clients); where only national accounts exist, the national figure × the shared survey-to-national-accounts ratio (@united_kingdom.consumption_per_person_2024 * @survey_consumption.survey_to_na_gbr; add a country's ratio to facts/survey_consumption.json). A shared conversion, not thin data. In the same dollars as value_per_person.", "usd"),
        inp("recipients_consumption_share", "effect", "The people served's consumption per person, as a share of the average", {"low": 0.3, "best": 0.5, "high": 0.8}, "judgment",
            "how far below the average the clients consume, per person: anchored on the poorest fifth's spending against the average (@united_states.ce_lowest_quintile_vs_all_2024, 0.45 per household, higher per person since their households are smaller) and on the service's eligibility rule (an income threshold, benefits receipt). Say the anchor.", "percent"),
        f("baseline_consumption", "effect", "The people served's consumption per person (US$)", "consumption_mean * recipients_consumption_share", None, "usd"),
        inp("income_years", "effect", "Years the help keeps its money value for the people served", {"low": 1, "best": 1, "high": 3}, "estimate",
            "1 for a year's goods; longer for a gain that persists (a benefit claim won, a home kept), from follow-ups.", "number", "years", src("follow-up study")),
        f("ln_gain_per_person", "effect", "ln(consumption) gain per person, discounted", "ln(1 + value_per_person / baseline_consumption) * pv_annuity_due(1, $discount_rate, income_years)",
          "The site's one log-income scale at the clients' own consumption: a dollar does far less for a US household than for one living on a few dollars a day.", "number"),
        inp("dalys_averted_per_person", "effect", "Illness averted per person reached, in DALYs (before adjustments)", {"low": 0, "best": 0.002, "high": 0.01}, "estimate",
            "health gained other than deaths: cases averted × the GBD disability weight (@gbd_disability_weights; add it if missing) × the years it lasts. 0, with the reason, when the evidence shows none.", "small", "DALYs", src("study / GBD 2019 disability weights")),
        inp("deaths_averted_per_person", "effect", "Deaths averted per person reached (before adjustments)", {"low": 0, "best": 0.0001, "high": 0.0005}, "estimate",
            "deaths the service averts (overdoses, exposure, suicides): the group's death rate × the relative reduction × the years, from the study. 0 with the reason when there is no evidence.", "small", source=src("study")),
    ] + age_rows("effect", {"low": 0, "best": 0.05, "high": 0.2}, "the deaths averted") + [
        f("value_per_death", "effect", "Value of a death averted (units of value)", VPD, "GiveWell's moral weights by the age band of each death, times your value of a life: the site's one value of a death.", "number", "units of value"),
    ] + adj_rows(leverage=True, unmodelled=True) + multi({
        "uov": ("people_reached * (ln_gain_per_person * $uov_per_ln_consumption + deaths_averted_per_person * value_per_death)", "Income gained and deaths averted"),
        "wellby": ("people_reached * wellbys_per_person", "Life satisfaction gained"),
    }, "people_reached * dalys_averted_per_person") + donor_rows("dalys", "Years of healthy life", "services") + donor_tail("dalys", "Years of healthy life", unit="daly"),
    "what the charity does, where, which outcomes the evidence measures (wellbeing, income, health), " + BOTTOM, "unit_cost", sections=MULTI_SECTIONS)

# --- humanitarian-relief ---------------------------------------------------------------------
T["humanitarian-relief"] = model("humanitarian-relief", "humanitarian relief in crises", "daly", "dalys", "Years of healthy life", "global-health",
    cost_rows() + [
        inp("people_reached", "reach", "People reached in the year modelled", 100_000, "observed",
            "people who received the response (food, water, shelter, health care) in the year the spending covers, unique people, from the charity's or the cluster's reporting; say which.", "integer", source=src("charity report / OCHA cluster data")),
        f("cost_per_person", "reach", "Cost per person reached", "cost_total / people_reached", "Context: compare with the charity's own figure and with other responses.", "usd"),
        inp("crisis_mortality_rate", "effect", "Death rate among the people reached during the crisis, without the response", {"low": 0.01, "best": 0.02, "high": 0.05}, "estimate",
            "deaths per person-year (a crude mortality rate of 1 per 10,000 a day is 0.0365), from mortality surveys of the crisis (SMART, CDC, the Sphere emergency thresholds as a check), for the period before the response or a comparable unserved group.", "small", "deaths / person-year", src("SMART survey / mortality study")),
        inp("baseline_mortality_rate", "effect", "Death rate in the same population before the crisis", {"low": 0.005, "best": 0.008, "high": 0.012}, "observed",
            "deaths per person-year before the crisis (UN WPP, DHS, the country's facts file), so only excess deaths count.", "small", "deaths / person-year", src("UN WPP / DHS")),
        inp("share_excess_averted", "effect", "Share of the excess deaths the response averts among the people reached", {"low": 0.1, "best": 0.3, "high": 0.6}, "judgment",
            "how much of the crisis's excess mortality this kind of response removes for those it reaches, anchored on studies of the intervention (food aid, water and sanitation, measles campaigns, nutrition treatment) in emergencies; name the anchor.", "percent"),
        inp("years_exposed", "effect", "Years of the crisis the response covers per person", {"low": 0.25, "best": 0.5, "high": 1}, "estimate",
            "how long each person is protected by the response (months served ÷ 12).", "number", "years", src("charity report")),
        f("deaths_averted_per_person", "effect", "Deaths averted per person reached (before adjustments)", "(crisis_mortality_rate - baseline_mortality_rate) * share_excess_averted * years_exposed",
          "Excess deaths over the years covered, times the share the response averts.", "small"),
    ] + age_rows("effect", {"low": 0.3, "best": 0.45, "high": 0.6}, "the deaths averted") + [
        f("value_per_death", "effect", "Value of a death averted (units of value)", VPD, "The site's one value of a death, by age band, times your value of a life.", "number", "units of value"),
        inp("dalys_illness_per_person", "effect", "Illness averted per person reached, in DALYs (before adjustments)", {"low": 0, "best": 0.003, "high": 0.01}, "estimate",
            "illness other than deaths (acute malnutrition, cholera, injuries treated): cases averted per person × the GBD disability weight (@gbd_disability_weights; add it if missing) × the years it lasts.", "small", "DALYs", src("study / GBD 2019 disability weights")),
        inp("value_delivered_per_person", "effect", "Food, water and shelter delivered per person in the year (US$)", {"low": 20, "best": 50, "high": 120}, "estimate",
            "what the goods cost on the local market per person, in US dollars, for the share of their value not counted as deaths and illness averted above (0 when the response is valued only through those).", "usd", source=src("charity report / market prices")),
        f("ppp_factor", "effect", "PPP conversion (2017 international $ per US $)", "@kenya.ppp_factor_2017", "TEMPLATE: point at the country's fact (add facts/<country>.json from the World Bank).", "number"),
        inp("baseline_consumption", "effect", "Consumption per person per year of the people reached (PPP)", {"low": 300, "best": 500, "high": 800}, "estimate",
            "in 2017 international dollars, from a crisis needs assessment or the World Bank poverty data for the region (household-survey consumption, @survey_consumption.*); a national-accounts figure only × the country's shared survey-to-national-accounts ratio (@survey_consumption.survey_to_na_<iso3>, a shared conversion, not thin data).", "usd", source=src("needs assessment / World Bank PIP")),
        f("ln_gain_per_person", "effect", "ln(consumption) gain per person", "years_exposed * ln(1 + value_delivered_per_person * ppp_factor / (baseline_consumption * years_exposed))",
          "The goods on the site's one log-income scale over the months they are used (years_exposed, at most 1): years_exposed × ln(1 + value ÷ the consumption of those months).", "number"),
    ] + adj_rows(leverage=True, unmodelled=True, counterfactual_row=inp("counterfactual_adj", "adjustments", "Share of the outcome other responders wouldn't have delivered", {"low": 0.3, "best": 0.6, "high": 0.9}, "judgment",
            "how much of this response would have been delivered anyway by the government, UN agencies or other NGOs had this charity not been there: from the response's funding coverage (OCHA FTS, the appeal's percentage funded) and gaps in the cluster's 4W data. Name the source.", "percent")) + multi({
        "uov": ("people_reached * (deaths_averted_per_person * value_per_death + ln_gain_per_person * $uov_per_ln_consumption)", "Deaths averted and goods delivered"),
        "wellby": ("0", "Life satisfaction (not counted: deaths, illness and goods cover the response)"),
    }, "people_reached * dalys_illness_per_person") + donor_rows("dalys", "Years of healthy life", "services") + donor_tail("dalys", "Years of healthy life", unit="daly"),
    "what the charity does, in which crises, " + BOTTOM, "unit_cost", sections=MULTI_SECTIONS)

# --- medical-research ------------------------------------------------------------------------
T["medical-research"] = model("medical-research", "medical research and disease charities", "daly", "dalys", "Years of healthy life", "global-health",
    cost_rows() + [
        inp("disease_dalys_per_year", "reach", "Disease burden the funded work addresses, DALYs per year", 1_000_000, "observed",
            "DALYs a year from the disease (or the stage, subtype or population the funded work is about) in the places its results would reach, from IHME GBD (GBD Results tool, the latest year), cited with the query.", "integer", "DALYs / year", src("IHME GBD Results")),
        inp("share_burden_addressable", "effect", "Share of that burden the kind of advance funded could avert once adopted", {"low": 0.02, "best": 0.05, "high": 0.15}, "judgment",
            "if the research succeeds, how much of the burden the result (a drug, test, guideline, screening change) averts at the uptake such results reach, anchored on past advances in the field (the burden averted by a comparable earlier result). Name the anchor.", "percent"),
        inp("p_success", "effect", "Probability the funded portfolio changes practice", {"low": 0.01, "best": 0.05, "high": 0.15}, "judgment",
            "the chance the work funded in the year leads to a change in practice, from a reference class (share of grants or trials in the field leading to a guideline change or approval; phase success rates for drug work). Name it.", "percent"),
        inp("years_brought_forward", "effect", "Years the field's work brings the advance forward", {"low": 1, "best": 3, "high": 10}, "judgment",
            "how much sooner the advance arrives because the field is funded at its current level, the credit then split by attribution_share_shared (this charity's share of the field's funding). Anchored on published research-returns estimates (the reference class in references/families/medical-research.md); name it.", "number", "years"),
        inp("years_until_effect", "effect", "Years from the funding until the result is in practice", {"low": 5, "best": 10, "high": 20}, "estimate",
            "typical lag from funding to practice in the field (the 17 years often cited for translation; shorter for guideline and screening work), discounted at the shared rate.", "number", "years", src("translation-lag study")),
        f("wait_discount", "effect", "Discount for the wait until the result is in practice", "(1 + $discount_rate) ^ -years_until_effect", "The wait discounted at the shared rate.", "percent"),
        f("discounted_years", "effect", "Discounted years brought forward", "pv_annuity_due(1, $discount_rate, years_brought_forward) * wait_discount", None, "number", "years"),
        f("research_dalys", "effect", "Expected DALYs averted by the research (before adjustments)", "disease_dalys_per_year * share_burden_addressable * p_success * discounted_years", None, "number", "DALYs"),
        inp("adv_people_affected_per_year", "effect", "Advocacy: people per year the policy won or pressed would affect", 0, "observed",
            "people covered by the screening, funding or prevention policy the charity's advocacy won or pressed in the year; 0, with the reason, without advocacy.", "integer", source=src("government statistics / charity report")),
        inp("adv_dalys_per_person_year", "effect", "Advocacy: DALYs averted per person affected per year", {"low": 0.0001, "best": 0.001, "high": 0.005}, "estimate",
            "the policy's health effect per person-year, from the evidence on that policy.", "small", source=src("study")),
        inp("adv_p_success", "effect", "Advocacy: probability the policy changes because of this work", {"low": 0.02, "best": 0.1, "high": 0.3}, "judgment",
            "from a reference class of similar campaigns; for a policy already won, the charity's share of the cause of the win.", "percent"),
        f("adv_years_of_impact", "effect", "Advocacy: years a won reform counts", "$win_years_counted", "The site's one answer (docs/normalization.md 2.9).", "number", "years"),
        inp("adv_years_until_effect", "effect", "Advocacy: years from the win until the policy takes effect", {"low": 0, "best": 1, "high": 3}, "judgment",
            "from the policy's own start date; discounted at the shared rate.", "number", "years"),
        f("adv_discounted_years", "effect", "Advocacy: discounted years of impact", "pv_annuity_due(1, $discount_rate, adv_years_of_impact) * (1 + $discount_rate) ^ -adv_years_until_effect", None, "number", "years"),
        f("advocacy_dalys", "effect", "Expected DALYs averted by advocacy (before adjustments)", "adv_people_affected_per_year * adv_dalys_per_person_year * adv_p_success * adv_discounted_years", None, "number", "DALYs"),
    ] + adj_rows(implementation=False, unmodelled=True) + multi({
        "uov": ("0", "Value in units of value (none by default: the burden is counted in DALYs)"),
        "wellby": ("0", "Life satisfaction (patients' wellbeing gains, where evidence is in WELLBYs)"),
    }, "research_dalys + advocacy_dalys") + donor_rows("dalys", "Years of healthy life", "research", marginal=True) + donor_tail("dalys", "Years of healthy life", marginal=True, unit="daly"),
    "what the charity funds, the disease and the chain from funding to practice, " + BOTTOM, "past_average", sections=MULTI_SECTIONS)

# --- companion-animals -----------------------------------------------------------------------
T["companion-animals"] = model("companion-animals", "companion animals", "ced", "pain_days", "Days of pain spared", "animal-welfare",
    cost_rows() + [
        inp("animals_helped", "reach", "Animals rehomed, rescued or treated in the year modelled", 10_000, "observed",
            "dogs and cats whose lives the care changes in the year the spending covers: rehomed, taken in from cruelty or the street, treated. Unique animals, from the charity's annual report.", "integer", source=src("charity annual report")),
        inp("suffering_share_avoided", "effect", "Suffering averted per day of the animal's better life, in days of disabling pain", {"low": 0.01, "best": 0.04, "high": 0.1}, "judgment",
            "how much less the animal suffers each day after the care than it would have (on the street, in a cruel home, untreated), in disabling-pain-equivalent days per day: Ambitious Impact's pain scale (disabling 1, hurtful about 0.1, annoying about 0.01 of a day of disabling pain) applied to the hours of each pain the care removes, anchored on veterinary welfare assessments. Name the anchor. A death the care averts or causes counts only through the days of suffering, as in every animal model.", "percent"),
        inp("years_better_life", "effect", "Years the animal's better life lasts", {"low": 1, "best": 4, "high": 8}, "estimate",
            "the animal's remaining years under the better conditions: remaining life expectancy at the age helped (dogs about 12 years in all, cats about 14; veterinary cohort studies), times the share that stays in the home.", "number", "years", src("veterinary cohort study")),
        f("pain_days_per_animal", "effect", "Days of disabling pain spared per animal helped, discounted", "suffering_share_avoided * 365 * pv_annuity_due(1, $discount_rate, years_better_life)", "Every future year discounted at the shared rate.", "number", "days"),
        inp("neuters", "reach", "Neuterings of owned or free-roaming animals in the year", 5_000, "observed",
            "neuterings the charity paid for or performed in the year; 0, with the reason, without a neutering programme.", "integer", source=src("charity annual report")),
        inp("births_averted_per_neuter", "effect", "Unowned animals' births averted per neutering", {"low": 0.5, "best": 2, "high": 5}, "estimate",
            "litters averted over the animal's breeding years × kittens or puppies per litter × the share that would be born unowned, net of population rebound (free-roaming population models). 0 for animals that would not have bred.", "number", source=src("population model study")),
        inp("pain_days_per_unowned_life", "effect", "Days of disabling pain in the life of an unowned animal that isn't born", {"low": 10, "best": 40, "high": 120}, "judgment",
            "suffering in a typical unowned dog's or cat's life (disease, injury, starvation, early death), on the same pain scale, net of its good days only where the evidence measures them; anchored on free-roaming welfare studies. Name the anchor.", "number", "days"),
        f("neuter_pain_days", "effect", "Days of pain spared by neutering (before adjustments)", "neuters * births_averted_per_neuter * pain_days_per_unowned_life * (1 + $discount_rate) ^ -1",
          "The births come about a year later, discounted at the shared rate.", "number", "days"),
    ] + adj_rows(counterfactual_row=inp("counterfactual_adj", "adjustments", "Share of the outcome that wouldn't have happened anyway", {"low": 0.3, "best": 0.6, "high": 0.9}, "judgment",
            "the share of the animals that would not have found a home or care anyway (other shelters, owners, councils): from local intake and rehoming rates. Name the source.", "percent")) + [
        f("outcome_total", "outcome", "Days of disabling pain spared", "(animals_helped * pain_days_per_animal + neuter_pain_days) * total_adj", None, "number", "days"),
        f("pain_days_per_dollar", "outcome", "Days of pain spared per dollar", "outcome_total / cost_total", None, "small", "days / $"),
        inp("share_dog", "species", "Share of the days spared that are dogs'", {"low": 0.3, "best": 0.5, "high": 0.7}, "estimate",
            "dogs' share of the animals helped, weighted by days spared, from the charity's intake figures; the rest are cats.", "percent", source=src("charity annual report")),
        f("share_cat", "species", "Share of the days spared that are cats'", "1 - share_dog", None, "percent"),
    ] + donor_rows("pain_days", "Days of pain spared", "services") + donor_tail("pain_days", "Days of pain spared", unit="ced", animal=True),
    "what the charity does, where, " + BOTTOM, "unit_cost")
T["companion-animals"]["rows"] += raw_species_rows([("dog", "share_dog"), ("cat", "share_cat")])
T["companion-animals"]["sections"].append(SPECIES_SECTION)
T["companion-animals"]["output"] = {"row": "ced_per_donor_dollar", "unit": "ced", "label": "Chicken-equivalent pain days averted per dollar you give", "native": {"row": "pain_days_per_dollar", "unit": "pain days"}, "species": ["dog", "cat"]}

# --- conservation ----------------------------------------------------------------------------
T["conservation"] = model("conservation", "conservation of land, water and species", "daly", "dalys", "Years of healthy life", "climate",
    cost_rows() + [
        inp("hectares_protected", "reach", "Hectares newly protected or restored in the year modelled", 10_000, "observed",
            "land or water the year's spending protected, bought, restored or brought under management (not the stock under management from earlier years), from the charity's report or the protected-area database.", "integer", "ha", src("charity report / WDPA")),
        inp("years_protected", "effect", "Years the protection lasts", {"low": 10, "best": 30, "high": 100}, "estimate",
            "how long the land stays protected (an easement in perpetuity is long, a management grant short), from the legal form or reference-class studies of protected-area downgrading.", "number", "years", src("PADDD / legal form")),
        f("protection_years", "effect", "Years of protection, discounted", "pv_annuity_due(1, $discount_rate, years_protected) * (1 + $discount_rate) ^ -years_until_avoided", "Every year of protection, and the wait before it, discounted at the shared rate.", "number", "years"),
        inp("tco2e_per_hectare_year", "effect", "Climate: tonnes of CO₂e a year a protected hectare keeps out of the air", {"low": 1, "best": 3, "high": 10}, "estimate",
            "avoided emissions (the baseline loss rate × carbon stock per hectare) plus sequestration, per hectare per year, from a remote-sensing or verified-carbon study of comparable sites, net of leakage only if the study nets it (else in unmodelled_benefits_adj).", "number", "t CO₂e / ha / year", src("remote-sensing / carbon study")),
        inp("years_until_avoided", "effect", "Climate: years until the tonnes are avoided", {"low": 0, "best": 1, "high": 5}, "judgment",
            "the wait from the spending to the protection taking effect; discounted at the shared rate, also for the other branches' benefits.", "number", "years"),
        inp("fuel_share", "bridges", "Share of these tonnes from burning less fossil fuel near people", 0, "estimate",
            "0 for land and ocean carbon, which carries no smoke; the climate skeleton's row (docs/normalization.md 2.5).", "percent", source=src("emissions inventory")),
        inp("fuel_smoke_factor", "bridges", "Air-pollution deaths per tonne of this fuel, relative to the fossil-fuel average", {"low": 0.02, "best": 0.1, "high": 0.3}, "estimate",
            "only where fuel_share is above 0: the fuel's smoke per tonne against the average behind the shared rate.", "number", source=src("deaths per TWh study")),
        f("air_pollution_weight", "bridges", "Air pollution these tonnes cut, relative to an average fossil-fuel tonne", "fuel_share * fuel_smoke_factor", "Read by the tonnes' bridge, as by the tco2e unit's conversion.", "number"),
        f("extra_deaths_per_tco2e", "bridges", "Air-pollution deaths averted per tonne, counted directly (none here)", "0",
          "Deaths a source counts directly beside the tonnes; 0 when the smoke is in air_pollution_weight, so nothing is counted twice.", "small"),
        f("methane_share", "bridges", "Share of these tonnes that are methane", "0",
          "The share of the tonnes (CO₂e) that is methane (wetland or rice methane, livestock), which the bridge values by methane's own timing and ozone (docs/normalization.md 2.5); 0 for land carbon.", "percent"),
        inp("health_people", "reach", "Health: people whose air, water, food or disease exposure the protection changes", 0, "estimate",
            "people downstream or downwind of the protected area, or living with it, whose health the evidence shows it changes (water quality, fire smoke, malaria, zoonotic spillover); 0, with the reason, where there is no evidence.", "integer", source=src("study")),
        inp("dalys_per_person_year", "effect", "Health: DALYs averted per person per year", {"low": 0.0001, "best": 0.0005, "high": 0.002}, "estimate",
            "from the study of the exposure the protection changes, × the GBD disability weight where it is illness (@gbd_disability_weights).", "small", "DALYs", src("study")),
        inp("livelihood_people", "reach", "Livelihoods: people whose income or food security the protection changes", 0, "estimate",
            "fishers, farmers, forest users; 0 where there is no evidence. Lost access is a negative effect below.", "integer", source=src("study")),
        inp("ln_gain_per_person_year", "effect", "Livelihoods: ln(consumption) gain per person per year", {"low": -0.02, "best": 0.02, "high": 0.06}, "estimate",
            "ln(1 + income gain / baseline consumption) per year, from impact evaluations of comparable protected areas or fisheries reserves (negative where access is lost).", "small", "ln / year", src("impact evaluation")),
        inp("nature_people", "reach", "Wellbeing: people who visit or live with the protected nature", 0, "estimate",
            "visitors or residents, from park counts; 0 where there is no evidence.", "integer", source=src("visitor counts")),
        inp("ls_gain_per_person_year", "effect", "Wellbeing: life satisfaction gained per person per year (points, 0-10)", {"low": 0, "best": 0.01, "high": 0.05}, "estimate",
            LS + " From studies of green or blue space and life satisfaction, net of where people would otherwise go.", "number", "points", src("wellbeing study")),
        inp("wild_animal_years", "reach", "Wild animals: animal-years whose welfare the protection changes", 0, "estimate",
            "only where the charity claims an effect on wild animals' welfare (not species counts): animal-years affected per year; 0 otherwise, with that reason.", "integer", source=src("population study")),
        inp("wild_pain_days_per_animal_year", "effect", "Wild animals: days of disabling pain spared per animal-year (negative if more)", {"low": -5, "best": 0, "high": 5}, "judgment",
            "on Ambitious Impact's pain scale, from welfare biology for the species; more animals living is not by itself a gain. Name the anchor; the sign is often unknown, so the range spans 0.", "number", "days"),
        f("pain_days_fish", "bridges", "Wild animals: days of pain spared (before adjustments)", "wild_animal_years * wild_pain_days_per_animal_year * protection_years", None, "number", "days"),
        f("ced_fish", "bridges", "Wild animals: chicken-equivalent pain days", "pain_days_fish * @welfare_ranges.fish_vs_chicken",
          "TEMPLATE: the species step (docs/normalization.md 2.4) with the species' Rethink Priorities welfare range: rename _fish to the species (@welfare_ranges.<s>_vs_chicken; add it if missing, a ranged judgment where Rethink has none).", "number", "chicken pain days"),
        inp("catastrophe_deaths", "effect", "Catastrophic risk: deaths if the catastrophe happens", {"low": 1e5, "best": 1e6, "high": 2e7}, "estimate",
            "deaths in the catastrophe the work lowers the risk of (a pandemic from wildlife spillover, a collapse of a fishery many depend on), from published scenario estimates; 0 where the charity claims no such effect.", "integer", source=src("scenario study")),
        inp("annual_risk_reduction", "effect", "Catastrophic risk: fall in the catastrophe's yearly probability from the year's work", {"low": 0, "best": 1e-7, "high": 1e-6}, "judgment",
            "absolute, per year of protection (from 1-in-a-hundred to slightly less), anchored on published risk estimates and the share of the risk's drivers the work touches. Usually the least grounded number in the model: a wide range, and the summary says so.", "small"),
    ] + age_rows("effect", {"low": 0.05, "best": 0.1, "high": 0.2}, "the catastrophe's deaths") + [
        f("catastrophe_value_per_death", "effect", "Catastrophic risk: value of a death averted (units of value)", VPD,
          "A catastrophe's deaths are valued like every death on the site, by age band × your value of a life; no premium for their number. Future generations are the next two rows.", "number", "units of value"),
        inp("future_share_lost", "effect", "Catastrophic risk: share of every later year's healthy life the catastrophe would take", {"low": 0, "best": 0, "high": 0.001}, "judgment",
            "0 for a catastrophe the world recovers from (its deaths are counted above); 1 for one that ends humanity's future; between for one that permanently shrinks it. Anchor on published scenario studies; usually 0 for conservation.", "percent"),
        FUTURE_ROW,
        f("future_dalys_averted", "effect", "Catastrophic risk: future years of healthy life kept, discounted", "annual_risk_reduction * protection_years * future_share_lost * @catastrophe.world_population_long_run * future_years_per_person",
          "Every later year's healthy life the catastrophe would take from people not yet born (the long-run world population × the share lost), discounted for ever at the shared rate. How much future generations count is your discount rate.", "number", "DALYs"),
    ] + adj_rows(leverage=True, unmodelled=True, counterfactual_row=inp("counterfactual_adj", "adjustments", "Share of the outcome that wouldn't have happened anyway", {"low": 0.2, "best": 0.5, "high": 0.8}, "judgment",
            "the share of the land that would have been lost without the protection (the baseline loss rate over the years protected, from matched comparisons of protected and unprotected sites), and that no one else would have protected. Name the study.", "percent")) + multi({
        "uov": ("livelihood_people * ln_gain_per_person_year * protection_years * $uov_per_ln_consumption + catastrophe_deaths * annual_risk_reduction * protection_years * catastrophe_value_per_death", "Livelihoods and catastrophic risk"),
        "wellby": ("nature_people * ls_gain_per_person_year * protection_years", "Wellbeing from nature"),
        "tco2e": ("hectares_protected * tco2e_per_hectare_year * protection_years", "Climate"),
        "ced": ("ced_fish", "Wild animals"),
    }, "health_people * dalys_per_person_year * protection_years + future_dalys_averted") + donor_rows("dalys", "Years of healthy life", "advocacy") + donor_tail("dalys", "Years of healthy life", unit="daly"),
    "what the charity protects, where, which branches the evidence supports (climate, health, livelihoods, wellbeing, wild animals, catastrophic risk), " + BOTTOM, "unit_cost", sections=MULTI_SECTIONS)

# --- rights-advocacy -------------------------------------------------------------------------
T["rights-advocacy"] = model("rights-advocacy", "rights and advocacy", "daly", "dalys", "Years of healthy life", "global-health",
    cost_rows() + [
        inp("people_affected_per_year", "reach", "People per year the laws, rulings or policies won or pressed affect", 100_000, "observed",
            "people covered by the year's wins (a ruling's class, a law's population, a policy's caseload), from the ruling or official statistics; count everyone covered, the chance of the win in p_success.", "integer", source=src("ruling / government statistics")),
        inp("ls_gain_per_person_year", "effect", "Wellbeing gained per person affected per year (points, 0-10)", {"low": 0.005, "best": 0.02, "high": 0.08}, "estimate",
            LS + " From studies of the right's effect on those it covers (discrimination, detention, legal status).", "number", "points", src("study")),
        inp("dalys_per_person_year", "effect", "Health gained per person affected per year (DALYs)", {"low": 0, "best": 0.0005, "high": 0.002}, "estimate",
            "illness averted (GBD disability weights, @gbd_disability_weights) where the right changes health (access to care, violence, detention conditions); 0 with the reason otherwise.", "small", "DALYs", src("study")),
        inp("ln_gain_per_person_year", "effect", "Income gained per person affected per year, ln(consumption)", {"low": 0, "best": 0.01, "high": 0.04}, "estimate",
            "ln(1 + income gain / consumption) where the right changes income (work permits, benefits, wages); 0 otherwise.", "small", "ln / year", src("study")),
        inp("p_success", "effect", "Probability the win happens because of this work", {"low": 0.02, "best": 0.1, "high": 0.3}, "judgment",
            "for pending cases and campaigns, the chance of winning from a reference class (the organisation's or the court's win rate in similar cases); for wins already in the year, the charity's share of the cause of the win (it led the case, joined, filed a brief). Name the reference class.", "percent"),
        f("years_of_impact", "effect", "Years a won reform counts before it would have come anyway", "$win_years_counted", "The site's one answer (docs/normalization.md 2.9).", "number", "years"),
        inp("years_until_effect", "effect", "Years from the win until it takes effect", {"low": 0, "best": 1, "high": 3}, "judgment",
            "from the ruling's or law's own dates; discounted at the shared rate.", "number", "years"),
        f("wait_discount", "effect", "Discount for the wait until the win takes effect", "(1 + $discount_rate) ^ -years_until_effect", "The wait discounted at the shared rate.", "percent"),
        f("discounted_years", "effect", "Discounted years of impact", "pv_annuity_due(1, $discount_rate, years_of_impact) * wait_discount", None, "number", "years"),
        inp("released_people", "reach", "People released, cleared or kept out of detention in the year", 0, "observed",
            "people the charity's casework freed or kept free in the year (0, with the reason, without casework), from its case records.", "integer", source=src("charity case records")),
        inp("released_years", "effect", "Years of freedom gained per person released", {"low": 0.5, "best": 2, "high": 8}, "estimate",
            "the sentence or detention avoided (time left to serve, expected detention), against what would have happened with other counsel (the counterfactual in counterfactual_adj).", "number", "years", src("case records / sentencing data")),
        inp("released_ls_gain_per_year", "effect", "Wellbeing gained per year of freedom (points, 0-10)", {"low": 0.5, "best": 1, "high": 2}, "estimate",
            "the life-satisfaction gap between detention and release, from surveys of prisoners or detainees and the released.", "number", "points", src("wellbeing study")),
        f("released_value", "effect", "WELLBYs per person released, discounted", "released_ls_gain_per_year * pv_annuity_due(1, $discount_rate, released_years)", "The person's own years, discounted at the shared rate (a release isn't a won reform).", "number", "WELLBYs"),
    ] + adj_rows(implementation=True, implementation_row=inp("implementation_adj", "adjustments", "Share of the win that is enforced", {"low": 0.4, "best": 0.7, "high": 0.95}, "judgment",
            "how much of a law or ruling is applied in practice (compliance, enforcement), from studies of similar wins.", "percent"), unmodelled=True) + multi({
        "uov": ("people_affected_per_year * ln_gain_per_person_year * $uov_per_ln_consumption * p_success * discounted_years", "Income gained"),
        "wellby": ("people_affected_per_year * ls_gain_per_person_year * p_success * discounted_years + released_people * released_value", "Wellbeing gained"),
    }, "people_affected_per_year * dalys_per_person_year * p_success * discounted_years") + donor_rows("dalys", "Years of healthy life", "advocacy", marginal=True) + donor_tail("dalys", "Years of healthy life", marginal=True, unit="daly"),
    "what the charity does, its theory of change from the wins to people's lives, " + BOTTOM, "past_average", sections=MULTI_SECTIONS)

# --- catastrophic-risk -----------------------------------------------------------------------
# AI, pandemics and nuclear war (docs/normalization.md 2.19, references/families/catastrophic-risk.md). Each area's
# yearly chance of a catastrophe by size (extinction-level, one that kills a share of people, a smaller one) is
# shared (@catastrophe, the AI chance the slider $ai_catastrophe_chance); the charity's work cuts it by a relative
# share: a typical dollar's cut (@catastrophe.<area>_*_cut_per_million) for field work, a judged cut for a policy won,
# work-years for people trained; every cut counts $win_years_counted years, discounted. Deaths are valued like every
# death (world age split), the future lost by future_years_per_person.
AREAS = [("ai", "AI", "$ai_catastrophe_chance / forecast_years", "$ai_catastrophe_chance * (@catastrophe.ai_catastrophe_vs_extinction - 1) / forecast_years", 0.3,
          "AI (technical safety research, evaluations, AI governance and policy)"),
         ("bio", "Pandemics", "$bio_catastrophe_chance / forecast_years", "max(0, @catastrophe.bio_catastrophe_by_2100 - $bio_catastrophe_chance) / forecast_years", 0.3,
          "pandemics (biosecurity, DNA synthesis screening, biosafety policy, preparedness)"),
         ("nuclear", "Nuclear war", "$nuclear_catastrophe_chance / forecast_years", "max(0, @catastrophe.nuclear_catastrophe_by_2100 - $nuclear_catastrophe_chance) / forecast_years", 0.2,
          "nuclear war (arms control, diplomacy, materials security, resilience such as food after a nuclear winter)")]

def area_rows(a, name, ext, cat, share, what):
    small = {"bio": ("@catastrophe.pandemic_probability_covid_scale", "@catastrophe.covid_excess_deaths")}.get(a)
    # AI has two of Rethink Priorities' presets, misalignment and misuse, weighted by ai_misuse_cost_share.
    cut = lambda size: (f"((1 - ai_misuse_cost_share) * @catastrophe.ai_{size}_cut_per_million + ai_misuse_cost_share * @catastrophe.ai_misuse_{size}_cut_per_million)"
                        if a == "ai" else f"@catastrophe.{a}_{size}_cut_per_million")
    rows = [
        f(f"{a}_extinction_per_year", "effect", f"{name}: yearly chance of a catastrophe that ends humanity's future", ext,
          "The shared chance by 2100 spread over the forecasts' years (@catastrophe, from the Existential Risk Persuasion Tournament" + (", the AI chance your slider" if a == "ai" else "") + "). Fixed; don't edit.", "small", "per year"),
        f(f"{a}_catastrophe_per_year", "effect", f"{name}: yearly chance of a catastrophe the world survives (over 10% of people die)", cat,
          "The tournament's catastrophes (over 10% of the people alive die within five years) less the extinction-level ones, per year. Fixed; don't edit.", "small", "per year"),
    ]
    if small:
        rows += [f(f"{a}_smaller_per_year", "effect", f"{name}: yearly chance of a smaller catastrophe (a COVID-scale pandemic)", small[0], "The shared yearly chance of a pandemic as deadly as COVID-19 (@catastrophe.pandemic_probability_covid_scale). Fixed.", "small", "per year"),
                 f(f"{a}_smaller_deaths", "effect", f"{name}: deaths in a smaller catastrophe", small[1], "WHO's excess deaths of COVID-19's first two years (@catastrophe.covid_excess_deaths). Fixed.", "integer", "deaths")]
    else:
        rows += [inp(f"{a}_smaller_per_year", "effect", f"{name}: yearly chance of a smaller catastrophe", 0, "estimate",
                     f"a smaller {name.lower()} disaster the work also lowers (a single nuclear detonation in a city, a limited war; an AI incident that kills thousands), per year, from a published forecast or record, and its deaths in the next row; 0 with this reason where none is sourced. A shared figure another model could reuse goes into facts/catastrophe.json and is read here.", "small", "per year", src("forecast / historical record")),
                 inp(f"{a}_smaller_deaths", "effect", f"{name}: deaths in a smaller catastrophe", 0, "estimate", "the deaths in the smaller disaster above, from the same source; 0 when the row above is 0.", "integer", "deaths", src("scenario study"))]
    rows += [
        f(f"{a}_deaths_if_catastrophe", "effect", f"{name}: deaths in a catastrophe the world survives", f"@catastrophe.world_population_now * @catastrophe.{a}_catastrophe_death_share",
          "Everyone alive × the shared share such a catastrophe kills (over the tournament's 10% threshold; @catastrophe.<area>_catastrophe_death_share). Fixed.", "integer", "deaths"),
    ]
    if a == "ai":
        rows += [inp("ai_misuse_cost_share", "effect", "AI: share of the AI spending on work against misuse (dangerous-capability evaluations, defences against misuse)", {"low": 0, "best": 0, "high": 0.3}, "judgment",
            "of the AI spending, the share aimed at misuse, people using AI to do harm: bio, cyber and chemical uplift evaluations, unlearning hazardous knowledge, refusal and robustness (jailbreak) work aimed at misuse. The rest is misalignment work (alignment, interpretability, control, governance of loss of control); work aimed at both counts there. It weights Rethink Priorities' misuse preset (@catastrophe.ai_misuse_extinction_cut_per_million, ai_misuse_catastrophe_cut_per_million) against its misalignment one (@catastrophe.ai_extinction_cut_per_million, ai_catastrophe_cut_per_million) in the two rows per $1 million. From the charity's named outputs and their spending; 0 with the reason where none of its AI work is aimed at misuse; the high end for outputs that could be read either way.", "percent")]
    rows += [
        f(f"{a}_deaths_per_year", "effect", f"{name}: expected deaths a year from these catastrophes", f"{a}_extinction_per_year * deaths_if_extinct + {a}_catastrophe_per_year * {a}_deaths_if_catastrophe + {a}_smaller_per_year * {a}_smaller_deaths", "Each size's yearly chance × the people it kills.", "number", "deaths / year"),
        f(f"{a}_future_per_year", "effect", f"{name}: expected future healthy years lost a year (extinction-level)", f"{a}_extinction_per_year * future_dalys_if_extinct", "Only a catastrophe that ends humanity's future takes the future; the world recovers from the others.", "number", "DALYs / year"),
        f(f"{a}_deaths_per_million", "effect", f"{name}: deaths averted a year by a typical $1 million of work, while its cut counts",
          f"{cut('extinction')} * {a}_extinction_per_year * deaths_if_extinct + {cut('catastrophe')} * ({a}_catastrophe_per_year * {a}_deaths_if_catastrophe + {a}_smaller_per_year * {a}_smaller_deaths)",
          "The share of each yearly risk a typical $1 million of work in the area removes (Rethink Priorities' cross-cause model, its backfire step included; shared), × the deaths that risk carries" + (": misuse work at Rethink's misuse preset, other AI work at its misalignment preset, weighted by ai_misuse_cost_share" if a == "ai" else "") + ". The catastrophe figure also applies to the smaller size. Fixed; don't edit.", "small", "deaths / year"),
        f(f"{a}_future_per_million", "effect", f"{name}: future healthy years kept a year by a typical $1 million of work", f"{cut('extinction')} * {a}_future_per_year",
          "As ai_deaths_per_million, for the future lost in an extinction-level catastrophe: the two presets' extinction cuts weighted by ai_misuse_cost_share." if a == "ai" else None, "small", "DALYs / year"),
    ]
    if a == "bio":
        rows += [f("bio_covid_scale_share", "effect", "Pandemics: share of those deaths averted that are in a COVID-scale pandemic",
                   f"@catastrophe.bio_catastrophe_cut_per_million * bio_smaller_per_year * bio_smaller_deaths / bio_deaths_per_million",
                   "The COVID-scale size's part of the deaths a typical $1 million of pandemic work averts: valued at COVID-19's age mix (covid_value_per_death), the rest at the world's. Fixed; don't edit.", "percent")]
    rows += [
        inp(f"{a}_cost_share", "effect", f"{name}: share of the cost spent on work against {name.lower()} risk (research, evaluations, convening, advocacy)", share, "estimate",
            f"the share of the modelled spending on {what}, from the charity's programme expenses (Form 990 Part III, the accounts' programme notes), overhead spread alike. Leave out the spending behind a specific win counted in the policy branch (pol_cost_share) and on training counted in fb_cost_share, so nothing counts twice. 0 with the reason where the charity does none.", "percent", source=src("Form 990 Part III / annual accounts")),
        inp(f"{a}_years_until_effect", "effect", f"{name}: years from the spending until the work cuts the risk", {"low": 0, "best": 1, "high": 3}, "judgment",
            "from the spending to the work's effect (a paper read, an evaluation run, a norm adopted); discounted at the shared rate.", "number", "years"),
        f(f"{a}_discounted_years", "effect", f"{name}: discounted years the cut counts", f"pv_annuity_due(1, $discount_rate, years_of_impact) * (1 + $discount_rate) ^ -{a}_years_until_effect", None, "number", "years"),
        f(f"{a}_deaths_averted", "effect", f"{name}: deaths averted by the work (expected, before adjustments)", f"cost_total * {a}_cost_share / 1e6 * {a}_deaths_per_million * {a}_discounted_years", None, "small", "deaths"),
        f(f"{a}_future_dalys", "effect", f"{name}: future healthy years kept (expected, before adjustments)", f"cost_total * {a}_cost_share / 1e6 * {a}_future_per_million * {a}_discounted_years", None, "number", "DALYs"),
    ]
    return rows

CR_POL = ("TEMPLATE: the area's extinction-to-catastrophe mix of the {what}, defaulting to a typical project's: the {what} a typical $1 million averts a year (the area's *_{row}_per_million) over its cut "
          "in the catastrophe risk (@catastrophe.<area>_catastrophe_cut_per_million), so pol_relative_cut (a share of the catastrophe risk) cuts the extinction-level and the survivable risk in the proportion a typical project does. "
          "Point both at the win's area (nuclear_, ai_ or bio_); replace with the area's own yearly figure (<area>_{row}_per_year) only where the measure acts on one size alone (name which), several areas: a weighted sum with a weight row.")
CR_POINT = "TEMPLATE: point it at the area of the {what} (ai_, bio_ or nuclear_{row}); several areas: a weighted sum with a weight row."

# Adjustments branch by branch: a branch's value per dollar differs (by area, and for a win or people trained),
# so each branch's evidence, counterfactual and attribution apply to its own value. The canonical rows chain
# them, each weighted by the branches' healthy years (w_<branch>) after the earlier factors, so that
# evidence_adj × counterfactual_adj × attribution_share is the healthy-years-weighted sum of each branch's
# own product; never a blend by spending, which would give a branch the weight of its cost, not its value.
CR_BRANCHES = [("ai", "AI field work", "the AI work"), ("bio", "Pandemic field work", "the pandemic work"),
               ("nuclear", "Nuclear field work", "the nuclear work"), ("climate", "Climate work", "the climate work"), ("pol", "Policy win", "the policy win"),
               ("fb", "Field-building", "the people trained")]
CR_EVIDENCE = "a multiplier on the shared cut per dollar (a typical project's, Rethink Priorities) for {what}: above 1 only where the charity's outputs show its work is taken up more than a typical project's (evaluations labs or governments run, standards adopted, citations in policy), below where they show less or nothing. Name the outputs. 1 = a typical project; 1 with 'unused' where the branch's cost share is 0."
CR_CF = "the share of {what} another organisation (a lab, a government, a better-funded group) would not have done in its place now; that it would have come years later is already in years_of_impact. Name the closest substitutes; 1 with 'unused' where the branch's cost share is 0."
CR_ADJ_INPUTS = {
    "evidence_adj": ("How far the typical project's effect applies", "multiple", {"low": 0.3, "best": 0.7, "high": 1.2}, {
        "pol": ({"low": 0.8, "best": 1, "high": 1.2}, "1 by default: the win's cut is judged directly (pol_relative_cut), not read from a typical project, so its evidence is in that judgment; differ from 1 only for doubt the cut cannot hold (whether the measure is enforced), named."),
        "fb": ({"low": 0.7, "best": 1, "high": 1.2}, "how far the alumni's work beats or trails a typical project in its area (their roles, their employers' uptake); 1 = typical, as fb_work_dollars values it.")}),
    "counterfactual_adj": ("Share of the work no one else would have done now", "percent", {"low": 0.4, "best": 0.7, "high": 0.95}, {
        "pol": ({"low": 0.3, "best": 0.6, "high": 0.9}, "the share of the win no one else (other campaigners, the government on its own) would have brought about now; for a pending measure the chance it passes is pol_p_success, not here. Name the closest substitutes."),
        "fb": ({"low": 0.8, "best": 1, "high": 1}, "1 by default: those who would have got there anyway are already out of fb_share_working; below 1 only where another programme would have trained the same people (a substitute course), named.")}),
    "attribution_share": ("This charity's share of the resources behind it", "percent", {"low": 0.5, "best": 0.8, "high": 1}, {
        "pol": ({"low": 0.01, "best": 0.1, "high": 0.5}, "credit by share of resources: the campaign's spending (pol_cost_share × cost_total) over everyone's resources behind the win (coalition partners' spending and staff time, the officials drafting it, the submissions), each valued; name them. Counting seats or signatures overstates it where others did most of the work."),
        "fb": ({"low": 0.7, "best": 0.95, "high": 1}, "the charity's share of the programme's own resources (co-hosts, mentors' unpaid time, a partner's venue); the employers' share of the alumni's work is fb_credit_share, not here.")}),
}

def cr_adjustment_rows():
    rows = [f("dalys_per_death_value", "adjustments", "Healthy years per unit of value of the deaths averted (for the weights below)",
              "dalys_from_uov / uov_bridged * (1 + @catastrophe.nondeath_losses_vs_deaths)",
              "The bridge's healthy years per unit of value, over all value in the bridge (deaths and any other branch valued in units of value, such as a government's), scaled back to a death's own value: turns each branch's deaths into healthy years for the weights. Fixed.", "small")]
    for b, name, what in CR_BRANCHES:
        value = "((1 - bio_covid_scale_share) * value_per_death + bio_covid_scale_share * covid_value_per_death)" if b == "bio" else "value_per_death"
        if b == "climate":
            rows.append(f("w_climate", "adjustments", "Weight: healthy years from the climate work (before adjustments)", "climate_uov * dalys_per_death_value", "The branch's value in healthy years, by the same bridge: the weight its adjustments carry. Fixed.", "number", "DALYs"))
            continue
        rows.append(f(f"w_{b}", "adjustments", f"Weight: healthy years from {what} (before adjustments)", f"{b}_deaths_averted * {value} * dalys_per_death_value + {b}_future_dalys",
                      "The branch's deaths averted in healthy years" + (" (the COVID-scale part at COVID-19's age mix)" if b == "bio" else " (a policy or field-building branch pointed at pandemics: its deaths at w_bio's mix, as in covid_scale_deaths_averted)" if b in ("pol", "fb") else "") + ", plus its future healthy years kept: the weight its adjustments carry. Fixed.", "number", "DALYs"))
    rows.append(f("w_total", "adjustments", "Weight: healthy years from every branch (before adjustments)", " + ".join(f"w_{b}" for b, _, _ in CR_BRANCHES), None, "number", "DALYs"))
    for adj, (label, fmt, default, special) in CR_ADJ_INPUTS.items():
        for b, name, what in CR_BRANCHES:
            value, text = special.get(b, (default, {"evidence_adj": CR_EVIDENCE, "counterfactual_adj": CR_CF, "attribution_share": ATTRIBUTION}[adj].format(what=what)))
            rows.append(inp(f"{b}_{adj}", "adjustments", f"{name}: {label[0].lower() + label[1:]}", value, "judgment", text, fmt))
    return rows

CR_CHAIN = "Applied: each branch's own {what}, weighted by the branches' healthy years (w_<branch>){after}, so that evidence_adj × counterfactual_adj × attribution_share is each branch's own product weighted by its value, never by its spending. Fixed."
def cr_chain(adj, prev):
    num = " + ".join(f"w_{b} * " + " * ".join(f"{b}_{a}" for a in prev + [adj]) for b, _, _ in CR_BRANCHES)
    return f"({num}) / (w_total" + "".join(f" * {a}" for a in prev) + ")"
T["catastrophic-risk"] = model("catastrophic-risk", "global catastrophic risks (AI, pandemics, nuclear war)", "daly", "dalys", "Years of healthy life", "catastrophic-risk",
    cost_rows() + [
        f("forecast_years", "effect", "Years the shared forecasts cover", "@catastrophe.xpt_end_year - @catastrophe.xpt_forecast_year", "From the year the chances were forecast to 2100: turns a chance by 2100 into a yearly one. Fixed.", "number", "years"),
        f("deaths_if_extinct", "effect", "Deaths in a catastrophe that ends humanity's future", "@catastrophe.world_population_now", "Everyone alive. Fixed.", "integer", "deaths"),
        f("share_under5", "effect", "Share of the deaths that are of children under five", "@death_ages.population_world_share_under5", "A global catastrophe kills every age alike: the world's age split (@death_ages.population_world_*). Fixed.", "percent"),
        f("share_5_14_of_over5", "effect", "Of the deaths at five or older, share aged 5 to 14", "@death_ages.population_world_share_5_14_of_over5", None, "percent"),
        f("share_15_49_of_over15", "effect", "Of the deaths at 15 or older, share aged 15 to 49", "@death_ages.population_world_share_15_49_of_over15", None, "percent"),
        f("value_per_death", "effect", "Value of a death averted (units of value)", VPD, "GiveWell's moral weights by age band × your value of a life, the site's one value of a death; no premium for a catastrophe's size.", "number", "units of value"),
        FUTURE_ROW,
        f("future_dalys_if_extinct", "effect", "Future healthy years lost if humanity's future ends", "@catastrophe.world_population_long_run * future_years_per_person",
          "The long-run world population's healthy years, of people not yet born, discounted at the shared rate: your discount rate is how much future generations count.", "number", "DALYs"),
        f("years_of_impact", "effect", "Years a cut in the risk counts before it would have come anyway", "$win_years_counted",
          "The site's one answer (docs/normalization.md 2.9): work, a won policy or a trained person's career brings a cut in the risk forward by these years; Rethink Priorities' 15-25 years of persistence is replaced by it.", "number", "years"),
    ] + [r for a in AREAS for r in area_rows(*a)] + [
        inp("climate_cost_share", "effect", "Climate: share of the cost spent on climate work (an option: 0 where there is none)", {"low": 0, "best": 0, "high": 0.3}, "judgment",
            "unused (0) by default, so no source: when the model has climate work, relabel it estimate and cite the accounts. The share of the modelled spending on climate analysis, advocacy or coverage, from the charity's programme expenses; counted in tonnes' worth at the site's own climate average, not a bridge of its own. Leave it out of the other shares. Feeds the check cost_shares_total.", "percent"),
        f("climate_value_per_dollar", "effect", "Climate: value of a dollar of typical climate work (units of value)", "#cause:climate",
          "The site's own climate average: the equal-weight mean of the climate charities on the rankings, per dollar, in units of value (its tonnes already valued by the climate skeleton, normalization.md 2.5, 2.8). Not a Rethink figure or a bridge of the model's own. Fixed.", "small", "units of value / $"),
        f("climate_uov", "effect", "Climate: value of the climate work (units of value, before adjustments)", "cost_total * climate_cost_share * climate_value_per_dollar",
          "The climate spending × a typical climate dollar's value; how far this charity's climate work beats or trails a typical dollar is climate_evidence_adj. The average already counts its own wait and years.", "number", "UoV"),
        inp("pol_cost_share", "effect", "Policy win: share of the cost spent on the campaign that won it", 0.1, "estimate",
            "the spending behind the specific win below (a treaty, law, regulation, standard or institution launched), left out of the areas' shares; 0 with the reason without such a win in the year. Several wins: a pol2_ branch each. Feeds only the check cost_shares_total.", "percent", source=src("charity report / accounts")),
        inp("pol_wins", "reach", "Policy win: wins of this kind in the year", 1, "observed",
            "treaties, laws, regulations, standards or institutions won or launched in the year that the policy branch values (one kind per branch; a pol2_ branch for another); 0, with the reason, without one: then the branch counts nothing.", "integer", source=src("charity report / official record")),
        inp("pol_p_success", "effect", "Policy win: chance it happens because of this work", {"low": 0.05, "best": 0.3, "high": 0.7}, "judgment",
            "for a pending bill, treaty or standard, the chance of winning from a reference class (similar measures passed or failed); for a win already in the year, 1 (then delete single_event) and the charity's part of it in pol_counterfactual_adj and pol_attribution_share. Name the reference class.", "percent"),
        inp("pol_relative_cut", "effect", "Policy win: share of the area's yearly risk it removes while in force", {"low": 0.001, "best": 0.01, "high": 0.05}, "judgment",
            "how much of the area's catastrophe risk the measure removes once in force: the share of the risk's pathways it touches × how well it closes them, anchored on published estimates of the mechanism (screening coverage, verification, a hotline's use). Calibrate it per risk, since a typical dollar's cut differs by orders of magnitude between areas (the default 1% fits nuclear policy, about $30 million of typical nuclear work, but is tens of billions of dollars of typical AI misalignment work): everyone's resources behind the measure (all its drafters and campaigners, not only the charity) × the area's cut per $1 million (@catastrophe.<area>_catastrophe_cut_per_million, and the extinction one for the future) is a typical project's cut, then a named multiple of it for how much more directly the measure acts. Check both sizes: pol_relative_cut ÷ each cut per $1 million is the millions of typical work it equals, to set against those resources and the field's yearly spending. Name the anchors.", "percent"),
        inp("pol_years_until_effect", "effect", "Policy win: years until it takes effect", {"low": 0, "best": 1, "high": 3}, "judgment", "from the win to entry into force; discounted at the shared rate.", "number", "years"),
        f("pol_discounted_years", "effect", "Policy win: discounted years the cut counts", "pv_annuity_due(1, $discount_rate, years_of_impact) * (1 + $discount_rate) ^ -pol_years_until_effect", None, "number", "years"),
        f("pol_deaths_per_year", "effect", "Policy win: expected deaths a year from the area's catastrophes", "nuclear_deaths_per_million / @catastrophe.nuclear_catastrophe_cut_per_million", CR_POL.format(row="deaths", what="deaths"), "number", "deaths / year"),
        f("pol_future_per_year", "effect", "Policy win: expected future healthy years lost a year in the area", "nuclear_future_per_million / @catastrophe.nuclear_catastrophe_cut_per_million", CR_POL.format(row="future", what="future healthy years"), "number", "DALYs / year"),
        f("pol_deaths_averted", "effect", "Policy win: deaths averted (expected, before adjustments)", "pol_wins * pol_p_success * pol_relative_cut * pol_deaths_per_year * pol_discounted_years", None, "small", "deaths"),
        f("pol_future_dalys", "effect", "Policy win: future healthy years kept (expected, before adjustments)", "pol_wins * pol_p_success * pol_relative_cut * pol_future_per_year * pol_discounted_years", None, "number", "DALYs"),
        inp("fb_cost_share", "effect", "Field-building: share of the cost spent training or placing people", 0.1, "estimate",
            "fellowships, courses, mentorship and career advice for people who go on to work on these risks; 0 with the reason without such a programme. Feeds the check cost_shares_total; the branch's value comes from the people trained.", "percent", source=src("charity report / accounts")),
        inp("fb_people", "reach", "Field-building: people trained or placed in the year", 100, "observed",
            "people who completed the programme in the year (not applicants or sign-ups), from the charity's report.", "integer", source=src("charity report")),
        inp("fb_share_working", "effect", "Field-building: share who go on to work on these risks because of it", {"low": 0.05, "best": 0.2, "high": 0.4}, "estimate",
            "alumni in roles on these risks a year or more later (the charity's alumni survey, with response bias in mind) minus those who would have got there anyway (their plans before, a comparison group). Name the survey.", "percent", source=src("alumni survey")),
        f("fb_work_years", "effect", "Field-building: years each stays in the work", "@catastrophe.field_work_years",
          "The shared figure (@catastrophe.field_work_years), one for every model; discounted at the shared rate. Fixed.", "number", "years"),
        f("fb_work_dollars", "effect", "Field-building: the alumni's added work, in dollars of typical work", "fb_people * fb_share_working * pv_annuity_due(1, $discount_rate, fb_work_years) * @catastrophe.cost_per_work_year",
          "Work-years added × what a year of such work costs its employer (@catastrophe.cost_per_work_year), so it is valued at the area's typical dollar.", "usd"),
        inp("fb_credit_share", "effect", "Field-building: the training's share of the credit for that work", {"low": 0.1, "best": 0.3, "high": 0.6}, "judgment",
            "the employers pay for the work itself: the training's cost over training plus the employers' cost of the work-years is the anchor (credit by share of resources); name it.", "percent"),
        f("fb_deaths_per_million", "effect", "Field-building: deaths averted a year by a typical $1 million of the alumni's work", "ai_deaths_per_million", CR_POINT.format(what="alumni's work", row="deaths_per_million"), "small", "deaths / year"),
        f("fb_future_per_million", "effect", "Field-building: future healthy years kept a year by a typical $1 million of the alumni's work", "ai_future_per_million", CR_POINT.format(what="alumni's work", row="future_per_million"), "small", "DALYs / year"),
        f("fb_deaths_averted", "effect", "Field-building: deaths averted (expected, before adjustments)", "fb_work_dollars / 1e6 * fb_credit_share * fb_deaths_per_million * pv_annuity_due(1, $discount_rate, years_of_impact)", None, "small", "deaths"),
        f("fb_future_dalys", "effect", "Field-building: future healthy years kept (expected, before adjustments)", "fb_work_dollars / 1e6 * fb_credit_share * fb_future_per_million * pv_annuity_due(1, $discount_rate, years_of_impact)", None, "number", "DALYs"),
        f("cost_shares_total", "effect", "Check: the cost shares add up to all the modelled spending", "ai_cost_share + bio_cost_share + nuclear_cost_share + climate_cost_share + pol_cost_share + fb_cost_share",
          "Must be 1: every dollar of the modelled programme is in exactly one branch.", "percent"),
        f("deaths_averted", "effect", "Deaths averted, every branch (expected, before adjustments)", "ai_deaths_averted + bio_deaths_averted + nuclear_deaths_averted + pol_deaths_averted + fb_deaths_averted", None, "small", "deaths"),
        f("covid_scale_deaths_averted", "effect", "Deaths averted that are in a COVID-scale pandemic (a part of deaths_averted)", "bio_deaths_averted * bio_covid_scale_share",
          "A natural or zoonotic pandemic on COVID's scale kills mostly older people, so its deaths are valued at COVID-19's age mix; every other size (a catastrophe that kills a share of the world, extinction) at the world's. A policy or field-building branch pointed at the pandemic area adds its deaths averted × bio_covid_scale_share here. Fixed.", "small", "deaths"),
        f("covid_value_per_death", "effect", "Value of a death averted in a COVID-scale pandemic (units of value)",
          VPD.replace("share_under5", "@death_ages.covid_scale_share_under5").replace("share_5_14_of_over5", "@death_ages.covid_scale_share_5_14_of_over5").replace("share_15_49_of_over15", "@death_ages.covid_scale_share_15_49_of_over15"),
          "As value_per_death, with the shared COVID-scale age mix (@death_ages.covid_scale_*): the one value of a death by age. Fixed.", "number", "units of value"),
        f("future_dalys_averted", "effect", "Future healthy years kept, every branch (expected, before adjustments)", "ai_future_dalys + bio_future_dalys + nuclear_future_dalys + pol_future_dalys + fb_future_dalys", None, "number", "DALYs"),
    ] + adj_rows(implementation=False, leverage=True,
        leverage_row=inp("leverage_funging_adj", "adjustments", "Leverage and funging", {"low": 0.85, "best": 1, "high": 1.05}, "judgment",
            "1 by default: the next-dollar room factor (`@next_dollar`) already asks whether other funders would cover this work, so a funging cut here counts it twice. Differ from 1 only for a reason the room factor cannot hold: above 1 when the donation visibly pulls in other money (matching, a lab or government co-funding the work), below 1 when the charity redirects restricted gifts inside itself. Name the evidence.", "multiple"),
        evidence_rows=cr_adjustment_rows() + [f("evidence_adj", "adjustments", "How far the typical project's effect applies to this charity's work", cr_chain("evidence_adj", []),
            CR_CHAIN.format(what="multiplier (<branch>_evidence_adj)", after=""), "multiple")],
        counterfactual_row=f("counterfactual_adj", "adjustments", "Share of the work no one else would have done now", cr_chain("counterfactual_adj", ["evidence_adj"]),
            CR_CHAIN.format(what="share (<branch>_counterfactual_adj)", after=" after evidence_adj"), "percent"),
        attribution_row=f("attribution_share_shared", "adjustments", "This charity's share of the resources behind the outcome", cr_chain("attribution_share", ["evidence_adj", "counterfactual_adj"]),
            CR_CHAIN.format(what="share (<branch>_attribution_share)", after=" after the earlier factors"), "percent"),
        unmodelled_rows=[
            inp("unmodelled_benefits_adj", "adjustments", "Benefits not modelled, as a share of modelled value", {"low": 0, "best": 0.05, "high": 0.2}, "judgment",
                "good beyond the catastrophes counted, each named with its size: preparedness that also cuts ordinary outbreaks, materials security that also cuts radiological terrorism, safety work that also cuts everyday harm from AI.", "percent"),
            inp("speedup_harm_share", "adjustments", "Harm: speeding up dangerous capabilities, as a share of modelled value", {"low": -0.3, "best": 0, "high": 0}, "judgment",
                "beyond a typical project's chance of backfiring (already in the shared cut per dollar, Rethink Priorities' 70% chance of the intended sign), work that also advances what it guards against (safety research or evaluations that help build more capable AI, gain-of-function research done for preparedness, a race it provokes), a negative share; 0 with the reason where the work is no riskier than a typical project (most nuclear diplomacy). Anchor: Rethink's backfire step is worth −23% of a typical project's value, so −0.1 to −0.3 is for work clearly riskier than that (capabilities-adjacent research, dangerous-capability evaluations).", "percent"),
            inp("hazard_harm_share", "adjustments", "Harm: information hazards and attention, as a share of modelled value", {"low": -0.1, "best": 0, "high": 0}, "judgment",
                "beyond a typical project's backfire, published threat analyses, red-teaming results or advocacy that show bad actors a path or draw them to a weapon, a negative share; 0 with the reason where nothing sensitive is published.", "percent"),
        ]) + multi({
        "uov": ("((deaths_averted - covid_scale_deaths_averted) * value_per_death + covid_scale_deaths_averted * covid_value_per_death) * (1 + @catastrophe.nondeath_losses_vs_deaths) + climate_uov", "Deaths averted (and losses beyond them, 0 by default) and the climate work"),
    }, "future_dalys_averted", side=("unmodelled_benefits_adj", "speedup_harm_share", "hazard_harm_share")) + donor_rows("dalys", "Years of healthy life", "research", marginal=True) + donor_tail("dalys", "Years of healthy life", marginal=True, unit="daly"),
    "what the charity does against which risks (AI, pandemics, nuclear war), the year, which branches carry the result (field work, a policy win, people trained), " + BOTTOM + " Say that the result rests on shared forecasts and a typical project's effect, so it moves with the AI slider and the discount rate.", "past_average", sections=MULTI_SECTIONS)
for r in T["catastrophic-risk"]["rows"]:
    if r["id"] == "pol_p_success": r["single_event"] = True
    # Rows unused by default (smaller sizes at 0, field-building) carry no placeholder source: a judgment until
    # the model switches them on, when the builder relabels them observed/estimate and cites the document.
    if re.fullmatch(r"(ai|bio|nuclear)_smaller_(per_year|deaths)|fb_(cost_share|people|share_working)", r["id"]) and r.get("value") is not None:
        r.pop("source", None)
        r["kind"] = "judgment"
        v = r["value"]
        if not isinstance(v, dict):
            r["value"] = {"low": 0, "best": 0, "high": 0.01 if r["id"].endswith("per_year") else 1000000} if v == 0 else {"low": v / 2, "best": v, "high": v * 2}
        r["explainer"] += " Unused by default, so no source: when the model uses it, relabel it observed or estimate and cite the document."

# Side effects (docs/normalization.md 2.16): rows that add good or harm beyond the programme's main chain,
# read through $side_effect_weight in our view.
SIDE_EFFECTS = {"unmodelled_benefits_adj": "added", "uov_spillovers": "added", "household_multiplier": "factor", "speedup_harm_share": "added", "hazard_harm_share": "added"}

os.makedirs(OUT, exist_ok=True)
MODEL_REF = re.compile(r"#([a-z0-9]+(?:-[a-z0-9]+)*(?::[a-z0-9]+(?:-[a-z0-9]+)*)?)")
for name, m in T.items():
    # Money moved is read at its destinations' figures on the rankings, missing-data step included
    # (destination_reads, docs/normalization.md 2.12); a stand-in elsewhere is not.
    dest = sorted({x for r in m["rows"] if r.get("section") == MM["section"]["id"] for x in MODEL_REF.findall(r.get("formula", ""))})
    if dest:
        m = {k2: v2 for k, v in m.items() for k2, v2 in ([(k, v), ("destination_reads", dest)] if k == "resources" else [(k, v)])}
        T[name] = m
    for r in m["rows"]:
        if r["id"] in SIDE_EFFECTS: r["side_effect"] = SIDE_EFFECTS[r["id"]]
        if r["id"] in ("p_success", "adv_p_success"):
            r["explainer"] += " One chance (one bill, one case, one research bet): tag the row `single_event: true`; a share across many grants or campaigns: no tag (normalization.md 2.18)."
    with open(os.path.join(OUT, f"{name}.json"), "w") as fh:
        json.dump(m, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
print("wrote", len(T))
