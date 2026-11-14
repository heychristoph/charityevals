# Audit: hias-charityevals-international, round 2
Result: 4.783e-5 daly/$ = 0.048 years of healthy life per 1,000 dollars (combined range 0.011-0.203); cause median 0.095 (x0.50). Verdict: pass.
Model-sha: 07969f095e9f259666e338581923d74a89fcff224079bd0ac1eebd98c6638f30
Scope: HIAS international operations, fiscal 2025 ($48,098,539, Exhibit B), now seven branches: cash and basic needs (about 65% of the result; Chad about 54%), legal, violence, mental health, child protection (about 2%), economic inclusion, Resettlement Support Center in Austria (about 3%). Matches the `international` line in charities/hias.json.
Mechanical: audit-model 0 findings (lint 0/0/0, invariants none); normalization-audit no violations; simulation stable (5% 0.57x, 95% 1.77x best guess). Source PDFs: Chad 33,000, Ecuador 19,600, 54,000, 1,100 graduation, 43,000 children, 127,133, Exhibit C payments 6,095,558 / supplies 2,385,466 / transient 3,216,079, Schedule F (818,332; 1,062,324), RSC expiry note all verified in the extracted text.

## Round-1 findings
| # | Status | Check |
|---|---|---|
| 1 RSC missing | resolved | `rsc_` branch with US vs origin log gain, 30-year annuity at the discount rate, counterfactual 15%, attribution 30%, slider; AUT in beneficiaries; transient assistance out of the cash anchor (explainer). Formulas and units fine (US consumption x 40% vs Egypt PPP, both PPP). Removing it: -3%; at 1,500 departures: +8%. See N1. |
| 2 cash by location | resolved | `cva_chad_people / cva_people`, log gain per place at its own consumption, deaths only for the Chad share at 2% (1.2-3.5%) minus Sudan's baseline. Chad quote verified. Residual N3. |
| 3 eco | resolved | 1,100 at graduation gain, `eco_light_ratio` 0.25 for the rest; zeroing the ratio gives -4%. |
| 4 period | resolved | `reach_period_adj` multiplies every branch count and divides cash per person consistently (`value_delivered_per_person` = FY cash / (people x adj)); no double step; `implementation_adj` explainer corrected. |
| 5 child protection | resolved | `cp_` branch in WELLBYs with own evidence/counterfactual/attribution/slider rows and `cp_new_share` overlap; `ue_child_share` replaced by childcare-only. N4. |
| 6 cash anchor | resolved | payments x cash share + supplies x supplies share; transient assistance excluded; Schedule F sub-grants verified. |
| 7 legal | resolved | `leg_lac_share`, `leg_other_ratio`, in `leg_ln_per_person`. |
| 8 distress rule | resolved | mh: direct share x distressed share (judgment, 60%); gbv and cp use Charlson 22.1%; one rule. |
| 9 beneficiaries | partly | Shares sum to 1 and include AUT, but see N6. |

## New findings
| # | Severity | Category | Row | Finding | Fix | Effect |
|---|---|---|---|---|---|---|
| N1 | medium | source | `rsc_people` | 400 (100-1,500) is a judgment with no reference class; the explainer says "a few hundred to a few thousand a year" without a source. | Anchor on the Refugee Processing Center (WRAPS) arrivals of Iranian/Lautenberg refugees processed through Austria in fiscal 2024 x 4/12, cite it and set the range from it. | -3% to +8% |
| N2 | low | presentation | `*_missing_data_adj` explainers | Every non-RSC branch's explainer says "(the Resettlement Support Center's departures are our judgment)", irrelevant there; the RSC row says "HIAS counts the people reached", which is false for it. | Remove the parenthesis from cva/mh/gbv/cp/leg/eco; for `rsc_missing_data_adj` say the departures are our judgment (no HIAS count). | none |
| N3 | low | plausibility | `value_delivered_per_person` | Chad and Latin American recipients get the same cash per person; Ecuador's voucher programmes usually pay more per head, so Chad's share of the log gain may be overstated. | Add a ranged judgment ratio (Latin America per person / Chad per person, about 1.5 (1-3)) or note the equal split in the explainer. | about -5% to -10% at 1.5-2 |
| N4 | low | comparability | `cp_children`, `cp_wellbys_per_child` | The mh and gbv branches take only the directly served share (awareness attendees left out); cp counts all 127,133 though the explainer includes awareness campaigns; only overlap (`cp_new_share`) is cut. | Add `cp_direct_share` (judgment, e.g. 0.6 (0.3-0.9)) to the formula. | about -1% |
| N5 | low | source | `cp_effect_sd` | Purgato et al. 2018 (Lancet Glob Health 6:e390; PTSD about 0.33 SD, no consistent depression effect) could not be fetched (paywalled redirect); unverified. | Confirm the figures against the abstract or cite the verified number. | none |
| N6 | low | presentation | `beneficiaries` / note | The note says "weighted by people served", but Colombia 0.16 and Ecuador 0.12 are well above their counts' shares (36,700 and about 21,000 of 544,081: 7% and 4%), and Chad 0.40 is below its 47%. Only matters for `$home_country`. | Derive from the Schedule O counts, as the note states, or say it is weighted by spending. | about 0 |
| N7 | low | presentation | writeups/hias-charityevals.md | Write-up otherwise matches the model (0.05 vs 0.048; RSC, 1,100 graduation, distress rule, child protection all described). Its "How this model was checked" names `audits/hias-charityevals/` only; this model's rounds are in `audits/hias-charityevals-international/`. | Name all three audit folders. | none |

## Drivers
1. `$missing_data_discount` (slider), `$uov_per_daly`, `$uov_per_ln_consumption` (shared).
2. `displaced_consumption_share` (judgment 45%, 30-70%), `cva_counterfactual_adj`, `cva_payment_cash_share` (judgment 60%, anchored on Schedule F sub-grants).
3. `leg_status_uplift`, `cva_attribution_share`. Branch sizes rest on HIAS's own counts (verified) and judged effects.

No high findings; no double counting found between branches beyond what `cp_new_share` handles.

**PASS**
Model-sha: 07969f095e9f259666e338581923d74a89fcff224079bd0ac1eebd98c6638f30
