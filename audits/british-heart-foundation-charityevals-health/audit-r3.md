# Audit: british-heart-foundation-charityevals-health, round 3
Result: 9.377e-6 uov/$ = 0.00469 years of healthy life per 1,000 dollars (combined range 5.3e-4 to 0.042); cause median 0.108 (x0.043). Verdict: pass.
Model-sha: 50d1144dc7b7b4eb6978959e1c90b4409e8d63afedaf86a5753ace5e0c592432
Scope: health expenditure £54.2m (year to 31 March 2026) less policy (6%) and Healthcare Implementation Fund pilots (5%), both in the main model: information and support (74%), RevivR and The Circuit (15%). Matches charities/british-heart-foundation.json line health-and-support ($63.56m) and the SOFA (p. 109) and note 4 (p. 125).
Mechanical: lint 0 high / 1 medium (far-below, explained below) / 1 low (spread; the summary says so); invariants none; normalization-audit none for this model (generated/ restored); check.ts all models valid; simulation-check stable (5% 0.233, 50% 1, 95% 5.29 x best guess).
Previous round: rounds 1 and 2 (2026-11-04, the rebuild) were not kept on disk; their changes are listed in the write-up. This is the first round on file. Done by the batch agent itself: the subagent limit was reached, so no fresh auditor could be started (the agent had not built or read the model before).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | normalization | info_value_per_death | Heart patients whose deaths the information branch averts are valued as an average person of their age. normalization.md 2.14 (survivors' remaining life): where studies show survivors live shorter than their age group, x the condition's shared remaining-life ratio. People with coronary heart disease do: after a heart attack, adjusted loss of life expectancy in 2022 was 1.9 to 2.0 years at 50 and 0.9 to 1.0 years at 80 (Reitan et al., Circulation 2024, 335,748 cases), more unadjusted and with reduced ejection fraction (up to 11.1 years). The CPR branches already take @survival.ohca_remaining_life_ratio; the information branch (68% of the result) takes nothing. | Reitan et al. 2024 abstract (Europe PMC, PMID 38966988) | Add `chd_remaining_life_ratio` to facts/survival.json: 0.85 (0.7 to 0.95), estimate, from Reitan et al. (about a year lost of nine at 80, two of 33 at 50 adjusted; more unadjusted, with heart failure and among the patients at highest risk). Multiply info_value_per_death by it; say so in its explainer and the write-up. | about -10% |
| 2 | medium | plausibility | (headline) | far-below: 0.043x the global-health median. The row is found: a page read is a hundredth of a trial programme (info_reading_dose) and a UK cost per patient reached, on a programme BHF measures no outcomes for (missing-data step). Scope is complete (both lines of health spending), the year is the latest, reach is BHF's own counts, persistence is the trials' follow-up. The evidence supports the gap. | tornado; scope above | No change (noted here, not in site text). | none |
| 3 | low | presentation | writeups/british-heart-foundation-charityevals-health.md | Two stale figures from before round 2's UK share (0.65): "about 2 million people" (now 1.73 million) and "about 23,000 people's worth of a trial programme" (now 20,800). | info_readers 1,734,333; info_trial_equivalents 20,843 | Write "about 1.7 million people" and "about 21,000 people's worth". | none |
| 4 | low | structure | estimate_basis | The Circuit is a fixed national service whose lives saved are a past average (2.10), but it is about 8% of the result inside a unit_cost model of services (the helpline, RevivR and information are bought with staff, promotion and print, as in Macmillan's and the American Cancer Society's support models, both unit_cost). One basis per model; splitting the Circuit into its own model for a 5% effect (x0.39 on 8%) would be disproportionate. | branch shares: information 90%, Circuit 8%, RevivR 2% | No change: unit_cost stays (a fix would be wrong at this share). | none |

## Checks (all fine)
- Branch shares at the defaults: information deaths 560 UoV, information quality of life 180, Circuit 69, RevivR 13 (of 822): "about nine tenths" in the write-up is right.
- Chain: info deaths = trial-equivalents 20,843 x 3%/yr x 0.20 x 1.5 years = 188 before adjustments; 3% x 1.5 = 4.5%, the trials' control-group 4.6%: no double counting of time. The dose rows scale the contact; the effect years are the trials' follow-up.
- Counterfactual: trials' control arms had usual care, so info_counterfactual_adj takes only other sources (0.55); not counted twice. Circuit counterfactual 1, since circuit_share_of_aed_uses is already the uses that need the network (Convention 5).
- Adjustments per branch (Convention 4); canonical rows are deaths-weighted averages for reading; every branch takes $missing_data_discount (thin: no outcomes measured; the effects are from other interventions or registries).
- Deaths valued by age: CPR survivors by the judged survivor age mix x ohca_remaining_life_ratio; heart patients by GBD 2023 UK cardiovascular deaths by age (@death_ages), five-year weights over 70; x $life_value_multiplier. Discounting at $discount_rate for every wait.
- Overhead: (150.4 + 50.3 + 6.7) / 150.4 = 1.379 (support costs already allocated in note 4); staff share (6.4 + 6.1)/54.2 = 23% plus fundraising staff 19.8/150.4 = 13%, over 1.38: 26%.
- Peers: services models (Macmillan, American Cancer Society support) are unit_cost too; consistent.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| health_spend_gbp, charitable_spend_gbp | BHF Annual Report and Accounts 2025-26 PDF, p. 109 | verified | "Health 4 (51.0) (3.2) (54.2)"; "Total charitable expenditure (135.8) (14.6) (150.4)" |
| fundraising_cost_gbp, retail_net_loss_gbp | same, p. 65 | verified | £46.2m + £4.1m; retail net loss £(6.7)m |
| staff_cost_share | same, note 4 p. 125 | verified | Health 7.8 6.4 34.0 6.1 54.2; fundraising staff 19.8 |
| people_reached | same, p. 32 | verified | "more than 190,000 people across the UK completed training" |
| info_helpline_contacts, info_peer_active, info_print_readers (anchor) | same, p. 31 | verified | 26,000+; around 9,000 a month; over 150,000 copies; 118,000 uses |
| info_web_views | same, p. 30 | verified | "35m+ views to our health information web pages" |
| hif_share_of_health (anchor) | same, note 11 p. 137 | verified | ASH £1.0m; other health grants £6.9m |
| ohca_incidence, uk_ohca_attempted, aed_use_rate, extra_cpr_prob (anchor) | resus.org.uk epidemiology page | verified | 54 per 100,000 (England 2024); around 43,000 a year in the UK; AED 9.0%; bystander CPR 72.6%; 30-day survival 9.5% |
| info_mortality_rrr | Europe PMC, Anderson et al. 2017 | verified | 189/5187 vs 222/4888, RR 0.80 (0.60 to 1.05), moderate quality |
| cpr_survival_gain | Europe PMC, Hasselqvist-Ax et al. 2015 | verified | 10.5% vs 4.0%; adjusted OR 2.15 (1.88 to 2.45); 30,381 arrests |
| (finding 1) | Europe PMC, Reitan et al. 2024 | verified | LOLE figures quoted above |
| info_uk_share_of_views, info_views_per_reader (anchors) | Similarweb | not fetched | judgments; anchors stated |

## Drivers
missing_data_discount (shared slider), info_reading_dose (judgment, anchored on ISLAND), info_mortality_rrr (sourced, Cochrane), info_views_per_reader and info_patient_share (judgments). What would most improve the model: any measured outcome for BHF's information or helpline users (a follow-up survey of behaviour or medication adherence).
