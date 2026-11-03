# High-income care: hospitals, hospices, crisis lines, wishes (direct-health or wellbeing)

Care in rich countries needs no family of its own: the existing chains hold, at the country's own
costs, baselines and rates. Pick by what the evidence measures.

## Hospitals and medical care: `direct-health`

- **Deaths averted** by age band (`@moral_weights.*` × `$life_value_multiplier`); rich-country deaths
  are older, so mix the five-year weights (`@moral_weights.givewell_age_75_79` … `_85_plus`) by the
  patients' ages instead of the 50–74 band.
- **Illness in DALYs**: `dalys_illness_averted_per_person` (cases treated × the gain in disability
  weight from `@gbd_disability_weights`, add a missing one from the GBD 2019 table, × the years it
  lasts, discounted), entering through the template's bridge `uov_from_daly` (normalization.md 2.6).
  Then `morbidity_value_ratio` is 0: illness is counted once.
- **Counterfactual**: patients in rich countries would mostly be treated by public or insured care;
  `counterfactual_adj` is the share that wouldn't, or the difference in outcome (specialist versus
  general care), from outcome comparisons.
- Income gains, stillbirths and GiveWell's supplementary shares are usually 0, each with the reason.
- **Research hospitals**: the research is a `medical-research` model, the care this one, each
  weighted by spending.

## Hospices and end-of-life care: `wellbeing` or `direct-health`

- Quality of life in the last months: a wellbeing effect in life-satisfaction points or SDs (palliative
  care trials with quality-of-life scales), or DALYs from the disability-weight gain, never both.
- Family members' wellbeing (caregiver burden, bereavement) is a spillover with its own evidence.
- Extended life is short; deaths are valued only where care changes them.

## Crisis lines, wishes and other wellbeing services: `wellbeing`

- The household size is the country's (`@household_size.united_states`, `_united_kingdom`); suicide
  rates are the country's (WHO Global Health Estimates) in the template's suicides recipe.
- The wellbeing effect of a wish or a call is short; follow-ups without controls are checks.

## Costs

The charity's own costs in the country's currency (× `@fx.usd_per_<cur>_<year>`); volunteers' hours
at the local wage in `attribution_share_shared` (Convention 2).
