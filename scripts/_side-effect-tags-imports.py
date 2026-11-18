"""Rule side-effect-tags-imports: every side effect in an imported model is read through the side-effects weight
(docs/normalization.md 2.16, INV-24). At 100% nothing moves; the evaluator view counts them in full.

- GiveWell's excluded effects and additional benefits: the components where a total includes development effects
  (kangaroo mother care: development, morbidity, hospital costs; the total stays untagged), else the typed-in total
  (`added` for a share added, `factor` for a multiplier like 1.2).
- Household spillovers in HLI's and SoGive's models: the spillover becomes its own row where it was folded into a
  total (World Spine Care, Pure Earth's Ghana cosmetics, Shamiri), or the household multiplier is tagged (SoGive's
  StrongMinds).
- Single rows: Fortify Health's possible harm of extra iron (HLI), NEEV's rebound (Ambitious Impact).

    python3 scripts/_side-effect-tags-imports.py
"""
import glob, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE / "lib"))
from keep_json import dumps_like

TAGS = {
    "clear-solutions-ors-zinc": {"added": ["total_adjustment_factor_for_excluded_effects", "total_adjustment_factor_for_excluded_effects_2", "total_adjustment_factor_for_excluded_effects_3"]},
    "clinton-health-access-initiative-chai-ors-zinc-updated-costs-january-202": {"added": ["total_adjustment_factor_for_excluded_effects", "total_adjustment_factor_for_excluded_effects_2", "total_adjustment_factor_for_excluded_effects_3"]},
    "clinton-health-access-initiative-chai-ors-zinc": {"added": ["total_adjustment_factor_for_excluded_effects", "total_adjustment_factor_for_excluded_effects_2", "total_adjustment_factor_for_excluded_effects_3"]},
    "clinton-health-access-initiative-msupply-rct-april-2026": {"added": ["total_excluded_effects_adjustment_laos_rct"]},
    "ird-global-breastfeeding-promotion-pilot-march-2024": {"added": ["adjustment_for_excluded_effects_pilot_best_guess", "adjustment_for_excluded_effects_pilot_best_guess_2"]},
    "evidence-action-ifa-supplementation-2022": {"added": ["benefits_from_folic_acid"]},
    "malaria-consortium-vitamin-a-supplementation-vas": {"added": ["additional_benefits_ref"]},
    "nutrition-international-2024-chad-renewal-vitamin-a": {"added": ["adjustment_for_additional_program_benefits_and_downsides_val"]},
    "nutrition-international-vitamin-a-chad-march-2022": {"added": ["supplemental_intervention_level_adjustments_developmental_ef", "supplemental_intervention_level_adjustments_reduced_morbidit"]},
    "ansh-kangaroo-care-2024": {"added": ["adjustment_for_developmental_effects_best_guess_at_shared_values", "adjustment_for_morbidity_effects_best_guess", "adjustment_for_costs_saved_to_hospital_best_guess"]},
    "rice-institute-kmc-with-r-i-c-e-in-uttar-pradesh-2023": {"added": ["adjustment_for_developmental_effects_best_guess_of_r_i_c_e_s_at_shared_values", "adjustment_for_morbidity_effects_best_guess_of_r_i_c_e_s_pro", "adjustment_for_costs_saved_to_hospital_best_guess_of_r_i_c_e"]},
    "rice-institute-kangaroo-mother-care": {"added": ["adjustment_for_developmental_effects_lower_cost_estimate_at_shared_values", "adjustment_for_morbidity_effects_lower_cost_estimate", "adjustment_for_costs_saved_to_hospital_lower_cost_estimate"]},
    "fika-update-to-bridges-to-prosperity": {"added": ["better_access_to_healthcare_education_government_services_br", "offsetting_effects_on_workers_in_migration_destinations_broo"]},
    "international-rescue-committee-malnutrition-treatment-irc-standard": {"factor": ["units_of_value_excluded_effects", "units_of_value_excluded_effects_2", "units_of_value_excluded_effects_3", "units_of_value_excluded_effects_4", "units_of_value_excluded_effects_5"]},
    "dimagi-optionality-mother-baby-wellness": {"factor": ["adjustment_for_excluded_effects_nigeria_dimagi"]},
    "ird-global-2023-zm-mcct-in-sindh": {"factor": ["new_incentives_adjustment_factor"]},
    "ird-global-mcct-in-high-risk-sindh-districts-2021": {"factor": ["new_incentives_adjustment_factor"]},
    "pure-earth-model": {"factor": ["adjustment_for_morbidity_and_mortality", "adjustment_for_reduced_social_harm_e_g_crime_aggression"]},
    "strongminds-sogive-march-2024": {"factor": ["household_multiplier"]},
    "fortify-health-hli": {"factor": ["harm_adjustment"]},
    "neev-aim": {"added": ["reduction_in_effect_size_from_rebound_effect"]},
}

# Spillovers folded into a total: (model, row to rewrite, its old formula, new row, its new formula).
SPLITS = {
    "world-spine-care-hli": ("wellbys_per_patient",
        "life_satisfaction_gain * (1 + household_spillover_ratio * other_household_members) * replication_adjustment",
        "life_satisfaction_gain * household_spillover_factor * replication_adjustment",
        {"id": "household_spillover_factor", "label": "Household spillover: the household's WELLBYs per WELLBY of the patient's", "format": "number",
         "formula": "1 + household_spillover_ratio * other_household_members", "side_effect": "factor",
         "explainer": "The other household members' benefit, a spillover beyond the patient, as a multiplier on the patient's own: a side effect, weighed by the side-effects slider (docs/normalization.md 2.16). HLI multiplies it into the WELLBYs per patient."}),
    "pure-earth-hli-ghana-cosmetics": ("overall_effect_on_household_per_1_bll_adjusted_for_exposure",
        "total_wellbeing_loss_avoided_wellbys_adjusted * spillover_ratio * no_of_non_recipients_affected_by_spillovers_per_household + total_wellbeing_loss_avoided_wellbys_adjusted",
        "household_spillover_wellbys + total_wellbeing_loss_avoided_wellbys_adjusted",
        {"id": "household_spillover_wellbys", "label": "Effect on the other household members per 1 BLL adjusted for exposure (WELLBYs)", "format": "number",
         "formula": "total_wellbeing_loss_avoided_wellbys_adjusted * spillover_ratio * no_of_non_recipients_affected_by_spillovers_per_household", "side_effect": "added",
         "explainer": "The household spillover HLI adds to the child's own effect: a side effect, weighed by the side-effects slider (docs/normalization.md 2.16)."}),
    "pure-earth-hli-ghana-cosmetics-before-correction": ("overall_effect_on_household_per_1_bll_adjusted_for_exposure",
        "total_wellbeing_loss_avoided_wellbys_adjusted * spillover_ratio * no_of_non_recipients_affected_by_spillovers_per_household + total_wellbeing_loss_avoided_wellbys_adjusted",
        "household_spillover_wellbys + total_wellbeing_loss_avoided_wellbys_adjusted",
        {"id": "household_spillover_wellbys", "label": "Effect on the other household members per 1 BLL adjusted for exposure (WELLBYs)", "format": "number",
         "formula": "total_wellbeing_loss_avoided_wellbys_adjusted * spillover_ratio * no_of_non_recipients_affected_by_spillovers_per_household", "side_effect": "added",
         "explainer": "The household spillover HLI adds to the child's own effect: a side effect, weighed by the side-effects slider (docs/normalization.md 2.16)."}),
    "shamiri-institute-hli": ("overall_effect_model_1_effect_of_shamiri_based_on_direct_evi",
        "total_effect_in_wellbys_model_1_effect_of_shamiri_based_on_d + total_effect_in_wellbys_model_1_effect_of_shamiri_based_on_d * spillover_ratio_model_1_effect_of_shamiri_based_on_direct_ev * number_of_non_recipients_affected_by_spillovers_per_househol",
        "total_effect_in_wellbys_model_1_effect_of_shamiri_based_on_d + household_spillover_model_1",
        {"id": "household_spillover_model_1", "label": "Effect on the other household members (Model 1: Effect of Shamiri based on direct evidence)", "format": "number",
         "formula": "total_effect_in_wellbys_model_1_effect_of_shamiri_based_on_d * spillover_ratio_model_1_effect_of_shamiri_based_on_direct_ev * number_of_non_recipients_affected_by_spillovers_per_househol", "side_effect": "added",
         "explainer": "The household spillover HLI adds to the student's own effect: a side effect, weighed by the side-effects slider (docs/normalization.md 2.16)."}),
}

paths = {}
for p in glob.glob(str(ROOT / "models/**/*.json"), recursive=True):
    mid = json.loads(Path(p).read_text())["id"]
    if mid in TAGS or mid in SPLITS: paths[mid] = Path(p)
missing = (set(TAGS) | set(SPLITS)) - set(paths)
assert not missing, missing

for mid, p in sorted(paths.items()):
    t = p.read_text()
    m = json.loads(t)
    assert dumps_like(m, t) == t, p
    by = {r["id"]: r for r in m["rows"]}
    n = 0
    for form, ids in TAGS.get(mid, {}).items():
        for i in ids:
            r = by[i]
            if r.get("side_effect") == form: continue
            assert not r.get("side_effect"), (mid, i)
            # The tag goes right after the row's id, as in the models tagged before.
            items = list(r.items())
            r.clear()
            for k, v in items:
                r[k] = v
                if k == "id": r["side_effect"] = form
            n += 1
    if mid in SPLITS:
        row, old, new, add = SPLITS[mid]
        r = by[row]
        if r["formula"] == old:
            add = {"id": add["id"], "section": r.get("section"), **{k: v for k, v in add.items() if k != "id"}}
            r["formula"] = new
            m["rows"].insert(m["rows"].index(r), add)
            n += 1
        else:
            assert r["formula"] == new, (mid, r["formula"])
    p.write_text(dumps_like(m, t))
    print(f"{mid}: {n} rows")
