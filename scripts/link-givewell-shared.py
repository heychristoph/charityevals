"""One figure for each of GiveWell's house constants: every GiveWell model reads facts/givewell_shared.json
(and facts/gbd_disability_weights.json, @fx, @cash) instead of its own typed-in copy.

    python3 scripts/link-givewell-shared.py

GiveWell types the same judgments and estimates into dozens of sheets (the resource-sharing multiplier,
treatment costs averted, the years long-term income gains last, what a dollar of government or Global
Fund money would otherwise do, the value of a year of contraception...). Copies of one vintage agree;
where an older sheet kept an older figure, our view uses the one shared figure (GiveWell's latest best
guess), the sheet's own number goes into `published` and the row says "changed for consistency", so
the evaluator view still reproduces the sheet. A row whose number equals the shared figure keeps it as
`expected`. Location statistics of one grant stay in their model; the same country's statistic in two
vintages becomes a dated fact.

It also values long-term income the way AMF and SMC do in sheets that state it as a fixed ratio of the
value of deaths (`ratio_income`), and is safe to run again: a linked row is a formula and is skipped.
"""
import json, re, glob, math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FACT_FILE = ROOT / "facts/givewell_shared.json"
GBD_FILE = ROOT / "facts/gbd_disability_weights.json"
FX_FILE = ROOT / "facts/fx.json"
RETRIEVED = "2026-10-31"
VC_URL = "https://docs.google.com/spreadsheets/d/1NH91oN0XpApQCOQ5RFAcYnOvhhpNFSJ2vFXU-LS30bI/edit"
GBD_URL = "https://ghdx.healthdata.org/record/ihme-data/gbd-2019-disability-weights"


def rng(low, best, high):
    return {"low": low, "best": best, "high": high}


# Each fact: the shared figure and, under "rules", the rows that are copies of it: a label pattern, the
# values a copy may carry (None: any), and optionally which models (by id). "formula" overrides the
# expression a linked row reads (default @givewell_shared.<id>).
FACTS = [
    dict(id="resource_sharing_multiplier", label="Multiplier for resource sharing within households (GiveWell)", unit="x", format="number",
         value=rng(1, 2, 3), kind="judgment",
         explainer="GiveWell's guess that an income gain to one person is shared with the household, so it counts twice. The same 2 in every GiveWell sheet that values long-term income (malaria, vitamin A, vaccines, deworming, iron). The range is ours: from no sharing counted (1) to half again more (3).",
         rules=[dict(label=r"^Multiplier for resource sharing( within households)?( \(.*\))?$", values=[2])]),
    dict(id="treatment_costs_averted", label="Treatment costs averted from prevention (GiveWell's supplemental adjustment)", unit="share", format="percent",
         value=rng(0.06, 0.2, 0.2), kind="judgment",
         explainer="GiveWell adds 20% to the value of a program that prevents illness, for the treatment costs households and health systems no longer pay. Every current GiveWell sheet uses 20%; its 2021–2023 malaria sheets (Borno SMC, Ondo and Anambra nets, PATH's malaria vaccine and PMC sheets), its PLA-MNH and its Mirriah ALIMA sheets used 6%, the low end of the range.",
         rules=[dict(label=r"^Treatment costs(/economic losses)? averted( from prevention)?( \((Not specified|overall|#REF!)\))?$", values=[0.2, 0.06])]),
    dict(id="investment_of_income_increases", label="Investment of income increases (GiveWell's supplemental adjustment, most programs)", unit="share", format="percent",
         value=rng(0.025, 0.05, 0.1), kind="judgment",
         explainer="GiveWell adds 5% for income gains that are invested and pay off later (SMC, vaccines, malnutrition treatment and most other programs); its net, vitamin A and deworming sheets use 2.5%, 3% and 10%, each its own figure here.",
         rules=[dict(label=r"^Investment of income increases( \(.*\))?$", values=[0.05])]),
    dict(id="investment_of_income_increases_nets", label="Investment of income increases, nets (GiveWell)", unit="share", format="percent",
         value=rng(0.025, 0.025, 0.05), kind="judgment",
         explainer="GiveWell's adjustment for invested income gains in its insecticide-treated net analyses: 2.5%, in every net sheet.",
         rules=[dict(label=r"^Investment of income increases( \(.*\))?$", values=[0.025])]),
    dict(id="investment_of_income_increases_vas", label="Investment of income increases, vitamin A (GiveWell)", unit="share", format="percent",
         value=rng(0.03, 0.03, 0.05), kind="judgment",
         explainer="GiveWell's adjustment for invested income gains in its vitamin A supplementation analyses: 3%, in every VAS sheet.",
         rules=[dict(label=r"^Investment of income increases( \(.*\))?$", values=[0.03])]),
    dict(id="long_term_benefit_years", label="Years long-term income gains last (GiveWell)", unit="years", format="number",
         value=rng(30, 40, 40), kind="judgment",
         explainer="How long GiveWell counts the income gain from better health in childhood: a working life of 40 years, in every current sheet (nets, SMC, vitamin A, vaccines, iron, deworming). Its 2018–2021 iron and fortification sheets used 30, the low end of the range.",
         rules=[dict(label=r"^(Expected number of years (the )?long-term benefits( of [a-z ]+)? will last|Duration of long-term benefits of deworming \(in years\)( \(Kenya\))?|Duration of long term benefits of fortification \(in years\)( \(Yes\))?|Median duration of consumption benefits( \(Preferred\))?|Expected number of years long-term benefits of receivign proper treatment.*)$", values=[40, 30])]),
    dict(id="years_until_income_benefits_malaria", label="Years between malaria prevention in childhood and the start of income gains (GiveWell)", unit="years", format="number",
         value=rng(8, 10, 12.5), kind="judgment",
         explainer="GiveWell's guess of when a child protected from malaria (nets, vaccines, testing) starts working: 10 years on average. SMC, which reaches slightly younger children for fewer years, has its own 12.5.",
         rules=[dict(label=r"^Average number of years between (nets being distributed|program implementation) and the beginning of long-term benefits", values=[10])]),
    dict(id="years_until_income_benefits_smc", label="Years between SMC and the start of income gains (GiveWell)", unit="years", format="number",
         value=rng(10, 12.5, 14), kind="judgment",
         explainer="GiveWell's guess of when a child who received seasonal malaria chemoprevention starts working: 12.5 years on average, in every SMC sheet.",
         rules=[dict(label=r"^Average number of years between receiving SMC and the beginning of", values=[12.5])]),
    dict(id="years_until_income_benefits_iron", label="Years between iron supplementation or fortification and the start of income gains (GiveWell)", unit="years", format="number",
         value=rng(10, 10, 12), kind="judgment",
         explainer="GiveWell's guess of when the income gain from better iron status in childhood starts: 10 years in its 2024–2025 iron sheets (Evidence Action IFA, Nutrition International rice fortification); its 2018–2023 iron and fortification sheets used 11 or 12.",
         rules=[dict(label=r"^(Average number of years between receiving iron and the beginning of|Mean number of years between supplementation and initial consumption benefits|Average number of years between 'entering fortification program' and)", values=[10, 11, 12])]),
    dict(id="wage_gain_per_iq_point", label="Increase in wages per IQ point (GiveWell)", unit="share", format="percent",
         value=rng(0.0067, 0.0067, 0.01), kind="estimate",
         explainer="GiveWell's estimate of how much one more IQ point raises adult earnings: 0.67% in its iron sheets from 2021 on. Its 2018–2019 sheets used 1% (0.75% in the 2018 Fortify Health consolidation), the high end of the range.",
         rules=[dict(label=r"^Percentage increase in wages/consumption for every 1 point increase in IQ", values=[0.0067, 0.01, 0.0075])]),
    dict(id="iq_points_per_sd", label="IQ points per standard deviation", unit="points", format="number",
         value=15, kind="observed",
         explainer="IQ scales are set so that one standard deviation is 15 points; GiveWell's iron sheets use it to turn effects in standard deviations into IQ points.",
         rules=[dict(label=r"^IQ points per standard deviation", values=[15])]),
    dict(id="cf_value_government", label="Counterfactual value of a dollar of domestic government spending (GiveWell)", unit="units of value per $", format="number",
         value=rng(0.00496, 0.005057, 0.0051), kind="estimate",
         explainer="What GiveWell thinks a dollar a government spends on a program would otherwise have done: 0.005057 units of value (about 1.5x cash), in most current sheets. Its 2020–2025 copies of 0.00496 to 0.0051 are earlier rounds of the same estimate. A sheet's own figure for one country's government (India's 0.00123 in Evidence Action's chlorination sheet) stays in that sheet.",
         rules=[dict(label=r"^(Counterfactual value per dollar spent by domestic governments?( on [a-zA-Z ]+)?( \(.*\))?|Counterfactual value of spending from domestic government.*|Counterfactual value of government spending.*|Counterfactual value of spending from (non-philanthropic|other) actors.*: Domestic government.*)$", values=[0.005057, 0.005071, 0.0051, 0.00496, 0.00507])]),
    dict(id="cf_value_global_fund", label="Counterfactual value of a dollar of Global Fund or PMI spending (GiveWell)", unit="units of value per $", format="number",
         value=rng(0.0154, 0.015433, 0.015433), kind="estimate",
         explainer="What GiveWell thinks a dollar the Global Fund or the US President's Malaria Initiative spends would otherwise have done: 0.015433 units of value (about 4.6x cash), in every current malaria sheet.",
         rules=[dict(label=r"^Counterfactual value per dollar spent by (the Global Fund or PMI|The Global Fund)( \(.*\))?$", values=[0.015433, 0.0154])]),
    dict(id="cf_value_gavi", label="Counterfactual value of a dollar of Gavi spending (GiveWell)", unit="units of value per $", format="number",
         value=rng(0.007, 0.007, 0.0154), kind="estimate",
         explainer="What GiveWell thinks a dollar Gavi spends on vaccines would otherwise have done: 0.007 units of value (about 2x cash), in its vaccine sheets from 2023 on. New Incentives' March 2025 renewal sheet uses the Global Fund's figure (0.0154) for Gavi, the high end of the range.",
         rules=[dict(label=r"^(Counterfactual value per dollar spent by Gavi|Counterfactual value of Gavi spending)$", values=[0.007, 0.0154])]),
    dict(id="income_to_mortality_value_ratio", label="Value of long-term income gains as a share of the value of deaths averted (GiveWell)", unit="ratio", format="number",
         value=rng(0.245, 0.30647, 0.3197), kind="estimate",
         explainer="GiveWell's shortcut for programs that save children's lives without modelling their later income: the income gain is 0.30647 times the value of the deaths averted, the ratio in its AMF and SMC models (2023–2024). Some sheets round it to 0.31; New Incentives' March 2025 renewal uses 0.3197.\n\nIt is a ratio at GiveWell's own values (4% discounting, its weight on a death). Our view rescales it in each model so that the income gain is discounted at your rate, valued at the income slider and doesn't grow with the weight on a life, as in AMF and SMC.",
         rules=[dict(label=r"^Ratio of value generated from income increases to value generated from mortalities", values=[0.30647, 0.31, 0.3197])]),
    dict(id="income_discount_rate", label="GiveWell's discount rate for future income, behind figures it states already discounted", unit="%", format="percent",
         value=0.04, kind="judgment",
         source=dict(title="GiveWell, CEA of insecticide-treated net distributions: 'Discount rate for future benefits'", url="https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc/edit"),
         explainer="The rate GiveWell's models discount income at (4%), so the rate built into figures they hand on already discounted: the ratio of income to mortality value above, and the multiples of cash its deworming CEA gives Sightsavers' sheets. Our view divides it out and puts your discount rate in (rows `..._at_shared_values`).",
         rules=[]),
    dict(id="years_until_income_benefits_deworming", label="Years between deworming and the start of income gains (GiveWell)", unit="years", format="number",
         value=rng(5, 8, 10), kind="judgment",
         explainer="GiveWell's guess of when a dewormed school-age child starts working: 8 years on average, in its deworming CEA. Range ours.",
         rules=[dict(label=r"^Average number of years between deworming and the beginning of long-term benefits", values=[8])]),
    dict(id="uov_per_cyp_low_income", label="Value of a year of modern contraception, low-income countries (GiveWell)", unit="units of value", format="number",
         value=rng(0.3, 0.6997, 1.1), kind="judgment",
         explainer="GiveWell's value of one year of modern contraception use in low-income countries on average, from its 'Valuing contraception' model: better health for women and children (maternal and child deaths and illness averted) 0.23, women's earnings 0.05, more resources for existing children 0.19, subjective well-being 0.23. The range is GiveWell's 25th to 75th percentile.\n\nOf the 0.70, 0.12 is the value of maternal and child deaths averted (`uov_per_cyp_deaths_low_income`); our view scales that part with the weight on a life under Your values.",
         source=dict(title="GiveWell, Valuing contraception, 'Model' tab", url=VC_URL, cell="Model!B106 (25th/75th: Model!C137:D137)"),
         rules=[dict(label=r"^(Units of value per CYP \(Best guess\)|Moral weight we assign to an additional year of contraceptive use by a woman.*)$", values=[0.7])],
         formula="@givewell_shared.uov_per_cyp_low_income + @givewell_shared.uov_per_cyp_deaths_low_income * ($life_value_multiplier - 1)"),
    dict(id="uov_per_cyp_deaths_low_income", label="Part of a year of contraception's value from deaths averted, low-income countries (GiveWell)", unit="units of value", format="number",
         value=0.12110, kind="estimate",
         explainer="Maternal deaths averted (0.0386 + 0.0103 units of value) and infant and child deaths averted through better birth timing (0.0723 before GiveWell's 25% for development effects) per year of contraception, from GiveWell's 'Valuing contraception' model at its weights of 125, 84 and 116 units of value per death. The part of `uov_per_cyp_low_income` that moves with the weight on a life.",
         source=dict(title="GiveWell, Valuing contraception, 'Model' tab", url=VC_URL, cell="Model!B53 + B61 + (B84*B85 + B88*B89)"),
         rules=[]),
    dict(id="uov_per_cyp_nigeria", label="Value of a year of modern contraception, Nigeria (GiveWell)", unit="units of value", format="number",
         value=rng(0.3, 0.8584, 1.1), kind="judgment",
         explainer="GiveWell's value of one year of modern contraception use in Nigeria (higher maternal and child mortality than the low-income average), from its 'Valuing contraception' model. Lafiya's 2026 sheet uses it (0.86); Family Empowerment Media's 2023 Kano sheet used a rough guess of 0.921. Of it, 0.21 is the value of deaths averted (`uov_per_cyp_deaths_nigeria`), scaled in our view with the weight on a life.",
         source=dict(title="GiveWell, Valuing contraception, 'Heterogeneity across locations' tab", url=VC_URL, cell="Heterogeneity across locations!C108"),
         rules=[dict(label=r"^(Moral weight for 1 additional wanted CYP|Value assigned to one CYP)$", values=[0.86, 0.921])],
         formula="@givewell_shared.uov_per_cyp_nigeria + @givewell_shared.uov_per_cyp_deaths_nigeria * ($life_value_multiplier - 1)"),
    dict(id="uov_per_cyp_deaths_nigeria", label="Part of a year of contraception's value from deaths averted, Nigeria (GiveWell)", unit="units of value", format="number",
         value=0.21269, kind="estimate",
         explainer="Maternal deaths averted (0.0802 + 0.0188 units of value) and infant and child deaths averted (0.1138 before GiveWell's 25% for development effects) per year of contraception in Nigeria, from GiveWell's 'Valuing contraception' model.",
         source=dict(title="GiveWell, Valuing contraception, 'Heterogeneity across locations' tab", url=VC_URL, cell="Heterogeneity across locations!C61 + C67 + C92/1.25"),
         rules=[]),
    dict(id="uov_per_cyp_sierra_leone", label="Value of a year of modern contraception, Sierra Leone (GiveWell)", unit="units of value", format="number",
         value=rng(0.3, 0.6789, 1.1), kind="judgment",
         explainer="GiveWell's value of one year of modern contraception use in Sierra Leone, from its 'Valuing contraception' model; MSI's 2026 mobile outreach sheet uses it (0.68). Of it, 0.14 is the value of deaths averted (`uov_per_cyp_deaths_sierra_leone`), scaled in our view with the weight on a life.",
         source=dict(title="GiveWell, Valuing contraception, 'Heterogeneity across locations' tab", url=VC_URL, cell="Heterogeneity across locations!J108"),
         rules=[dict(label=r"^Value we assign to an additional year of contraceptive use by a woman", values=[0.68])],
         formula="@givewell_shared.uov_per_cyp_sierra_leone + @givewell_shared.uov_per_cyp_deaths_sierra_leone * ($life_value_multiplier - 1)"),
    dict(id="uov_per_cyp_deaths_sierra_leone", label="Part of a year of contraception's value from deaths averted, Sierra Leone (GiveWell)", unit="units of value", format="number",
         value=0.14472, kind="estimate",
         explainer="Maternal deaths averted (0.0470 + 0.0104 units of value) and infant and child deaths averted (0.0873 before GiveWell's 25% for development effects) per year of contraception in Sierra Leone, from GiveWell's 'Valuing contraception' model.",
         source=dict(title="GiveWell, Valuing contraception, 'Heterogeneity across locations' tab", url=VC_URL, cell="Heterogeneity across locations!J61 + J67 + J92/1.25"),
         rules=[]),
    dict(id="uov_per_stillbirth", label="Value of averting a stillbirth (GiveWell)", unit="units of value", format="number",
         value=rng(21, 21, 33.4), kind="judgment",
         explainer="GiveWell's moral weight for averting a stillbirth or late miscarriage: 21 units of value in its 2022 and 2025 syphilis screening sheets. Its 2020 and 2024 Liberia technical-assistance sheets used 33.4, the high end of the range. Models multiply it by the weight on a life under Your values, like every death.",
         rules=[dict(label=r"^Units of value - averting stillbirth( or miscarriage)?$", values=[21, 33.4])],
         formula="@givewell_shared.uov_per_stillbirth * $life_value_multiplier"),
    dict(id="indirect_deaths_per_direct_diarrhea_death", label="Indirect deaths averted per diarrhea death averted (GiveWell)", unit="ratio", format="number",
         value=rng(0.25, 0.5, 1), kind="estimate",
         explainer="GiveWell's estimate that averting a child's death from diarrhea also averts half a death from other causes it would have led to (malnutrition, pneumonia), in each of its ORS and zinc sheets. Range ours.",
         rules=[dict(label=r"^# indirect deaths due to diarrhea averted for each direct diarrhea death averted", values=[0.5])]),
    dict(id="household_size_nigeria_northwest", label="Average household size, Northwest Nigeria (2021 Malaria Indicator Survey)", unit="people", format="number",
         value=rng(6.7, 6.7, 6.8), kind="observed",
         explainer="People per household in Northwest Nigeria, GiveWell's figure from the 2021 Nigeria Malaria Indicator Survey, used in its New Incentives and IRC vaccine sheets. One 2024 New Incentives sheet uses 6.8.",
         rules=[dict(label=r"^Average number of people per household$", values=[6.7, 6.8])]),
    dict(id="household_size_bangladesh", label="Average household size, Bangladesh (HIES 2022)", unit="people", format="number",
         value=4.26, kind="observed",
         explainer="People per household in Bangladesh: 4.26 in the Bangladesh Bureau of Statistics' Household Income and Expenditure Survey 2022 (rural households 4.3), as GiveWell's 2024 eyeglasses sheet cites. GiveWell's 2025 CHoBI7 sheet uses 4.5.",
         source=dict(title="Bangladesh Bureau of Statistics, Household Income and Expenditure Survey 2022, final report", url="https://bbs.gov.bd/site/page/648dd9f5-067b-4bcc-ba38-45bfb9b12394/-", note="Average household size 4.26 (cited in GiveWell's eyeglasses for workers CEA, 2024)"),
         rules=[dict(label=r"^(Average household size, Bangladesh \(Value - best guess\)|Income to household consumption: Household Size \(Workers in rural Bangladesh\))$", values=[4.5, 4.3])]),
    dict(id="malaria_mortality_1_59m_chad_2024", label="Annual malaria mortality rate among 1-59-month-olds, Chad (GiveWell, 2024 net models)", unit="%", format="percent",
         value=0.00263528145, kind="estimate",
         explainer="Chad's malaria death rate among children aged 1–59 months in GiveWell's net models from December 2024 on (0.26%; its June 2023 model had 0.15%, now that sheet is read at its DRC column). A dated fact: a later vintage that revises it gets its own.",
         rules=[dict(label=r"^Annual malaria mortality rate among 1-59-month-olds \(Chad\)$", values=[0.00263528145])]),
]

GBD = [
    dict(id="tuberculosis", label="Disability weight: tuberculosis, not HIV infected (GBD 2019)", value=rng(0.224, 0.333, 0.454),
         rules=[dict(label=r"Disability weight", values=[0.333], models=r"tb-hcm")]),
    dict(id="hiv_on_art", label="Disability weight: HIV/AIDS with antiretroviral treatment (GBD 2019)", value=rng(0.052, 0.078, 0.111),
         rules=[dict(label=r"^Disability weight - HIV, on ART$", values=[0.078017329])]),
    dict(id="hiv_symptomatic", label="Disability weight: HIV, symptomatic, pre-AIDS (GBD 2019)", value=rng(0.184, 0.274, 0.377),
         rules=[dict(label=r"^Disability weight - HIV, not on ART$", values=[0.2744787049])]),
    dict(id="aids_without_art", label="Disability weight: AIDS without antiretroviral treatment (GBD 2019)", value=rng(0.406, 0.582, 0.743),
         rules=[dict(label=r"^Disability weight from HIV$", values=[0.58159009])]),
    dict(id="near_vision_loss", label="Disability weight: near vision loss (presbyopia) (GBD 2019)", value=rng(0.005, 0.011, 0.02),
         rules=[dict(label=r"^Near vision impairment YLD weight", values=[0.011])]),
]

FX = [dict(id="usd_per_eur_2020", label="US dollars per euro, 2020 yearly average", value=1.1403,
           note="Table row Euro Zone (Euro), column 2020: 0.877 euros per dollar; 1 / 0.877 = 1.1403 dollars per euro",
           url="https://web.archive.org/web/20211229205151/https://www.irs.gov/individuals/international-taxpayers/yearly-average-currency-exchange-rates",
           rules=[dict(label=r"^Euro to U\.S\. dollar$", values=[1.21])])]


def best(v):
    return v["best"] if isinstance(v, dict) else v


def close(a, b):
    return a is not None and b is not None and abs(a - b) <= 1e-9 * max(1, abs(a), abs(b))


def models():
    for p in sorted(glob.glob(str(ROOT / "models/grants/givewell/*.json")) + glob.glob(str(ROOT / "models/global-health/*.json"))):
        txt = Path(p).read_text()
        m = json.loads(txt)
        if m.get("owner") == "givewell" and m.get("kind") != "variant":
            yield Path(p), m, 1 if txt.startswith('{\n "') else 2


def matches(rule, m, r, taken):
    if rule["values"] == "other": return False
    if "formula" in r or not isinstance(best(r.get("value")), (int, float)) or isinstance(r.get("value"), bool): return False
    if not re.search(rule["label"], r.get("label", ""), re.I): return False
    if rule.get("models") and not re.search(rule["models"], m["id"]): return False
    v = best(r["value"])
    if rule["values"] == "other": return not any(close(v, x) for x in taken)
    return any(close(v, x) for x in rule["values"])


def short(x):
    return f"{x:.6g}"


def link_row(r, formula, fact_value, ref, fact_label):
    old = r.pop("value"); r.pop("kind", None)
    r["formula"] = formula
    note = r.get("explainer", "")
    if close(best(old), fact_value):
        r["expected"] = best(old)
        r["explainer"] = (f"Reads the figure every GiveWell model shares: {fact_label} (`{ref}`), the same number as this sheet's." + ("\n\n" + note if note else "")).strip()
        return False
    r["published"] = old
    r.pop("expected", None)
    r["explainer"] = (f"Changed for consistency. GiveWell's sheet has {short(best(old))} here. The site uses one figure for this in every GiveWell model, "
                      f"{short(fact_value)} ({fact_label}, `{ref}`), GiveWell's current best guess; the evaluator view keeps {short(best(old))}."
                      + ("\n\n" + note if note else "")).strip()
    return True


def main():
    files = list(models())
    facts, gbd, log = [], [], []
    for group, prefix, out in ((FACTS, "givewell_shared", facts), (GBD, "gbd_disability_weights", gbd), (FX, "fx", None)):
        for f in group:
            taken = [x for rule in f["rules"] for x in (rule["values"] if isinstance(rule["values"], list) else [])]
            linked, src = [], None
            for p, m, ind in files:
                for r in m["rows"]:
                    if not any(matches(rule, m, r, [best(g["value"]) for g in group if g is not f and g.get("value") is not None] if rule["values"] == "other" else taken) for rule in f["rules"]): continue
                    if f.get("value") is None: f["value"] = best(r["value"])
                    linked.append((m, r, best(r["value"])))
            if f.get("value") is None: continue
            fv = best(f["value"])
            ref = f"@{prefix}.{f['id']}"
            # Rows a previous run linked count for the source too.
            rx = re.compile(re.escape(ref) + r"(?!\w)")
            already = [(m, r, best(r.get("published", r.get("expected")))) for p, m, ind in files for r in m["rows"] if rx.search(r.get("formula", ""))]
            # The source: the newest sheet that has the shared figure itself.
            same = sorted([(m.get("source", {}).get("published", ""), m, r) for m, r, v in linked + already if close(v, fv)], key=lambda x: x[0])
            if same and not f.get("source"):
                _, m, r = same[-1]
                f["source"] = {"title": f"GiveWell, {m['name']}", "url": r.get("source", {}).get("url") or m["source"].get("sheet") or m["source"]["url"],
                               **({"cell": r["source"]["cell"]} if r.get("source", {}).get("cell") else {}),
                               "note": f"The same figure in {len(same)} of GiveWell's sheets; " + ", ".join(sorted({x[1]['id'] for x in same}))[:600]}
            formula = f.get("formula", ref)
            for m, r, v in linked:
                changed = link_row(r, formula, fv, ref, f["label"])
                log.append(f"{'CHANGED' if changed else 'linked '} {ref:60s} {m['id']}:{r['id']} {short(v)} -> {short(fv)}")
            row = {"id": f["id"], "label": f["label"], "unit": f.get("unit", "weight"), "format": f.get("format", "number"), "value": f["value"],
                   "kind": f.get("kind", "estimate"), "source": {**(f.get("source") or {}), "retrieved": RETRIEVED}, "explainer": f.get("explainer", "")} if out is not None else None
            if prefix == "gbd_disability_weights":
                row.update({"unit": "disability weight", "kind": "estimate",
                            "source": {"title": "IHME, Global Burden of Disease Study 2019 (GBD 2019) Disability Weights", "url": GBD_URL, "retrieved": RETRIEVED},
                            "explainer": "GBD 2019's disability weight (0 = full health, 1 = death) with its 95% uncertainty interval as the range; the same values as Salomon et al. 2015. GiveWell's sheets type it in; they read it here."})
            if out is not None: out.append(row)
            if prefix == "fx":
                fx = json.loads(FX_FILE.read_text())
                if not any(x["id"] == f["id"] for x in fx["rows"]):
                    fx["rows"].append({"id": f["id"], "label": f["label"], "unit": "USD", "format": "number", "value": f["value"], "kind": "observed",
                                       "source": {"title": "IRS, Yearly average currency exchange rates", "url": f["url"], "note": f["note"], "retrieved": RETRIEVED},
                                       "explainer": "The IRS yearly average, the site's source for every currency it lists (the World Bank's for the rest). Models read it instead of an evaluator's own rate."})
                    FX_FILE.write_text(json.dumps(fx, indent=2, ensure_ascii=False) + "\n")
    ratio_income(files, log)
    deworming_multiples(files, log)
    policy_years(files, log)
    mixed_counterfactual(files, log)
    for p, m, ind in files:
        p.write_text(json.dumps(m, indent=ind, ensure_ascii=False) + "\n")
    FACT_FILE.write_text(json.dumps({"id": "givewell_shared", "label": "GiveWell's house constants (one figure for every GiveWell model)", "rows": facts}, indent=2, ensure_ascii=False) + "\n")
    GBD_FILE.write_text(json.dumps({"id": "gbd_disability_weights", "label": "GBD 2019 disability weights", "rows": gbd}, indent=2, ensure_ascii=False) + "\n")
    print("\n".join(log))


RATIO = re.compile(r"^Ratio of value generated from income increases to value generated from mortalities", re.I)
SCALE = ("pv($discount_rate, @givewell_shared.long_term_benefit_years, -1) / (1 + $discount_rate) ^ @givewell_shared.years_until_income_benefits_malaria"
         " / (pv(@givewell_shared.income_discount_rate, @givewell_shared.long_term_benefit_years, -1) / (1 + @givewell_shared.income_discount_rate) ^ @givewell_shared.years_until_income_benefits_malaria)"
         " * $uov_per_ln_consumption * ln(2) / $life_value_multiplier")


def ratio_income(files, log):
    """Sheets that value long-term income as a fixed ratio of the value of deaths averted: our view discounts
    that income at your rate, values it at the income slider and stops it growing with the weight on a life,
    as AMF's and SMC's explicit income rows do. One row per model, after the leaf ratio, that every reader of
    the ratio now reads; the evaluator view keeps the sheet's ratio (`published`)."""
    for p, m, ind in files:
        rows = m["rows"]
        leaves = [r for r in rows if RATIO.search(r.get("label", "")) and ("value" in r or r.get("formula", "").startswith("@givewell_shared.income_to_mortality_value_ratio"))]
        for leaf in leaves:
            new_id = f"{leaf['id']}_at_shared_values"
            if any(r["id"] == new_id for r in rows): continue
            pub = best(leaf.get("published", leaf.get("expected", leaf.get("value"))))
            new = {"id": new_id, "label": f"{leaf['label']}, at your discount rate and values", "section": leaf.get("section"),
                   "formula": f"{leaf['id']} * {SCALE}", "published": pub, "format": "number",
                   "explainer": ("Changed for consistency. GiveWell values long-term income here as a fixed share of the value of the deaths averted, "
                                 "a ratio it took from its AMF and SMC models at its own values: income discounted at 4% over 40 years starting 10 years on, "
                                 "1/ln 2 units of value per unit of ln(consumption), and its weight on a death. So in the sheet the income gain would grow "
                                 "with the weight on a life and ignore the discount rate, unlike in AMF and SMC. Our view rescales the ratio: the present "
                                 "value of those 40 years at your discount rate over the same at 4%, times the income slider over 1/ln 2, divided by the "
                                 "weight on a life (which the value of deaths it multiplies already carries). At the defaults it is the sheet's ratio; the "
                                 "evaluator view keeps it.")}
            rx = re.compile(r"(?<![\w.@$#])" + re.escape(leaf["id"]) + r"(?!\w)")
            n = 0
            for r in rows:
                if r is leaf or "formula" not in r or not rx.search(r["formula"]): continue
                r["formula"] = rx.sub(new_id, r["formula"]); n += 1
            rows.insert(rows.index(leaf) + 1, new)
            log.append(f"ratio   {m['id']}:{leaf['id']} -> {new_id} ({n} readers)")


DEWORM_SCALE = ("pv($discount_rate, @givewell_shared.long_term_benefit_years, -1) / (1 + $discount_rate) ^ @givewell_shared.years_until_income_benefits_deworming"
                " / (pv(@givewell_shared.income_discount_rate, @givewell_shared.long_term_benefit_years, -1) / (1 + @givewell_shared.income_discount_rate) ^ @givewell_shared.years_until_income_benefits_deworming)"
                " * $uov_per_ln_consumption * ln(2)")
SIGHTSAVERS = ["sightsavers-cost-effectiveness-april-2023-drc", "sightsavers-cost-effectiveness-january-2023", "sightsavers-cameroon-nigeria-cost-effectiveness"]


def deworming_multiples(files, log):
    """Sightsavers' sheets average multiples of cash typed in from GiveWell's deworming CEA, already
    discounted at 4% and valued at 1/ln 2: no slider moved them. Our view scales the sheet's bottom line by
    the same deworming chain Deworm the World's model uses: 40 years of income gains starting 8 years on,
    at your discount rate over the same at 4%, times the income slider over 1/ln 2 (1 at the defaults; the
    evaluator view keeps the sheet's figure)."""
    for p, m, ind in files:
        if m["id"] not in SIGHTSAVERS: continue
        nat = m["output"]["native"]["row"]
        rows = m["rows"]
        if any(r["id"] == "deworming_value_at_shared_values" for r in rows): continue
        native = next(r for r in rows if r["id"] == nat)
        new = {"id": "deworming_value_at_shared_values", "label": "Deworming's long-term income gains at your discount rate and values, relative to GiveWell's",
               "section": native.get("section"), "formula": DEWORM_SCALE, "published": 1, "format": "number",
               "explainer": ("Changed for consistency. The sheet's multiples of cash come from GiveWell's deworming CEA, which values deworming by the income "
                             "children earn later: 40 years of gains starting 8 years on, discounted at 4% and valued at 1/ln 2 units of value per unit of "
                             "ln(consumption). Typed in as numbers, they ignored your discount rate and the income slider. This factor is the present value "
                             "of those 40 years at your rate over the same at 4%, times the income slider over 1/ln 2, the same chain Deworm the World's model "
                             "uses (it leaves out that CEA's decay of the effect over time, so it moves a little more than the full model would). It is 1 at "
                             "the defaults; the evaluator view keeps the sheet's figures.")}
        native["formula"] = f"({native['formula']}) * deworming_value_at_shared_values"
        rows.insert(rows.index(native), new)
        log.append(f"deworm  {m['id']}:{nat} x deworming_value_at_shared_values")


POLICY_MODELS = ["vital-strategies-model", "vital-strategies-botec-breakeven", "centre-for-pesticide-suicide-prevention-cpsp-skeleton"]
POLICY_YEARS = re.compile(r"^(Number of years brought forward|Number of years by which .* accelerate policy change|"
                          r"(Alcohol tax|Advertising restrictions|Drunk.driving countermeasures|Reducing days and hours of sale) \(Base\))", re.I)


def policy_years(files, log):
    """GiveWell's policy sheets credit a won law or regulation with the years it is brought forward (Open
    Philanthropy's default of 10 for Vital Strategies' alcohol policies, 9 for CPSP's pesticide bans). Our view
    reads the one slider every won reform reads, `$win_years_counted` (docs/normalization.md 2.9), the sheet's
    years in `published`; the years are discounted (`pv_annuity_due` at `$discount_rate`, 0 in `published`),
    and so is the wait until the policy takes effect (`policy_years_until_effect`, our judgment, discounted
    by `policy_wait_discount`, 1 in `published`)."""
    for p, m, ind in files:
        if m["id"] not in POLICY_MODELS: continue
        rows = m["rows"]
        if any(r["id"] == "policy_wait_discount" for r in rows): continue
        leaves = [r for r in rows if POLICY_YEARS.search(r.get("label", "")) and "value" in r]
        for r in leaves:
            old = r.pop("value"); r.pop("kind", None); r.pop("expected", None)
            r["formula"] = "$win_years_counted"; r["published"] = old
            r["explainer"] = (f"Changed for consistency. GiveWell credits the policy with {short(best(old))} years brought forward. Every model that "
                              "credits a won reform reads one figure for how long the win counts before it would have come anyway: Years a won reform "
                              "counts, under Your values (5 by default, 1–20). The evaluator view keeps the sheet's years."
                              + ("\n\n" + r["explainer"] if r.get("explainer") else ""))
        sec = next((r.get("section") for r in rows if r["id"].startswith("number_of_years_brought_forward")), leaves[0].get("section"))
        anchor = next(i for i, r in enumerate(rows) if r.get("section") == sec)
        new = []
        if not any(r["id"] == "years_discount_rate" for r in rows):
            new.append({"id": "years_discount_rate", "label": "Discount rate on the years of benefit", "section": sec, "formula": "$discount_rate", "published": 0, "format": "percent",
                        "explainer": "Changed for consistency. The sheet adds up the years a policy is brought forward at face value; the site discounts every future benefit at your discount rate (Timing, under Your values). The evaluator view keeps 0."})
        new += [
            {"id": "policy_years_until_effect", "label": "Years from the grant until the policy takes effect", "section": sec, "unit": "years",
             "value": {"low": 1, "best": 3, "high": 5}, "kind": "judgment",
             "explainer": "Our judgment, not GiveWell's: the sheet counts the policy's benefit from the grant on, but a campaign takes time to win and a law time to take effect (GiveWell's own question is whether the policy is in place within 5 years of a 3-year campaign). Three years on average, 1 to 5. The wait is discounted at your rate, as in every model that credits a won reform."},
            {"id": "policy_wait_discount", "label": "Discount for the wait until the policy takes effect", "section": sec,
             "formula": "(1 + $discount_rate) ^ -policy_years_until_effect", "published": 1, "format": "number",
             "explainer": "Changed for consistency: a benefit that starts later is worth less at your discount rate. The evaluator view keeps 1 (the sheet doesn't discount the wait)."}]
        for k, r in enumerate(new): rows.insert(anchor + k, r)
        n = 0
        for r in rows:
            f = r.get("formula", "")
            if "pv_annuity_due(1, years_discount_rate, number_of_years_brought_forward" in f:
                r["formula"] = f"{f} * policy_wait_discount"; n += 1
            elif re.search(r"(?<!\w)number_of_years_brought_forward\w*(?!\w)", f) and r["id"].startswith("expected_lives_saved"):
                r["formula"] = re.sub(r"(?<![\w(, ])(number_of_years_brought_forward\w*)", r"pv_annuity_due(1, years_discount_rate, \1) * policy_wait_discount", f); n += 1
        log.append(f"policy  {m['id']}: {len(leaves)} years rows -> $win_years_counted, {n} benefit rows discounted")


def mixed_counterfactual(files, log):
    """CHAI's TSU sheet values money moved from governments and other funders at the plain average of GiveWell's
    three figures, typed in (0.0056, 0.0154, 0.007): it reads the shared three instead."""
    shared = "avg(@givewell_shared.cf_value_government, @givewell_shared.cf_value_global_fund, @givewell_shared.cf_value_gavi)"
    for p, m, ind in files:
        for r in m["rows"]:
            if r.get("formula") == "avg(0.0056, 0.0154, 0.007)":
                r["published"] = r.pop("expected"); r["formula"] = shared
                r["explainer"] = ("Changed for consistency. The sheet averages GiveWell's values of a dollar of government (0.0056), Global Fund (0.0154) "
                                  "and Gavi (0.007) money, typed in; it reads the shared three (`@givewell_shared.cf_value_government`, "
                                  "`cf_value_global_fund`, `cf_value_gavi`). The evaluator view keeps the sheet's 0.00933."
                                  + ("\n\n" + r["explainer"] if r.get("explainer") else ""))
                log.append(f"mixed   {m['id']}:{r['id']}")


if __name__ == "__main__":
    main()
