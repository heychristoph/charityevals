# Audit: central-square-foundation-charityevals, round 5 (scoped to the credit step: classes of six branches, governance share)
Result: 0.001757 uov/$ = 0.879 years of healthy life per 1,000 dollars (combined range 0.056-13.9); cause median 0.0803 (x10.9). Verdict: pass (0 high, 0 medium, 2 low).
Model-sha: 3c6a82b49e5a63e24ffb66509c9746d3c871c8415c4439bf16a62900e6daa0d3
Scope: only the rows changed for normalization.md 2.24: the class of the used share of fln, ece, pal, php, edo, hps (now `delivery`), `gov_attribution_share_shared` (now a judged 0.85) and `gov_attribution_share` (class `win`), the two deleted rows, and the text that followed. No full re-audit.
Preflight: pass (two lows: distributions.json out of date, ignored as instructed; a typed "40%" in the `learning_persistence` prose, not from this change).
Previous round: round 4 had no open high or medium. Headline at mobiliser_share 100% 0.852 -> 0.879 reproduced; the +0.027 is all governance (share about 0.5 -> 0.85, the branch is about 7% of the result). At 30% the headline is 0.833; only governance moves with the setting.

## Class of each branch (rule 2.24: would the party have committed the resource without CSF?)

Reading used for all six: the denominator holds the governments' and partners' budgets for the programme the gain is measured on, and the gain credited is the whole programme's gain. That is the pro-rata, co-funder structure. The class `win` (government out of the denominator, share among co-advisers, times s) is only coherent if the government's money was committed because of CSF. For FLN, early childhood, adaptive learning and EdTech it was not, so the alternative reading is wrong for each:

| Branch | Co-funders in the share | Would they have committed it without CSF? | Class right? |
|---|---|---|---|
| fln | NIPUN Bharat central budget (grossed up by the states' share, taken for CSF's 11 states), other partners | Yes. A national mission (the annual report marks five years of the mission and asks for its extension) with its own budget line; the annual report itself calls the states' work "state-led" and CSF's part "technical support". `counterfactual_adj` already says "the programmes would run without CSF". | delivery: right |
| ece | States' spending on the first-time pre-primary children | Yes, in the main. Balvatika and Sishu Vatika are state reforms under NEP 2020 (annual report pp. 34-38: "anchored in the vision of NEP 2020", UP's own educator recruitment, "state-led efforts"). Telangana "initiated" its pre-primary grades "with technical support from CSF" (p. 37): the one place a mobilised reading has some pull. Mixed cases are classed whole by 2.24; the better whole is delivery. | delivery: right |
| pal, php | States' and researchers' spending on licences, devices, class time and the trial | Yes, mostly. Andhra Pradesh is state-funded and adaptive learning sits in the Samagra Shiksha ICT framework and PM SHRI guidelines (PAL brochure pp. 2-3). php reads the same share as pal, so one class for both. Weakest of the six (CSF's units pushed the adoption) but still the better whole. | delivery: right |
| edo | Partners' own spending on their products | Yes. Sesame Workshop India, ThinkZone, Top Parent and Chimple build and run them with their own funders (annual report p. 39). | delivery: right |
| hps | Partners' and schools' time | Mixed (CSF set the pilot up and funds it, the partners joined); the branch is under 0.1% of the result, so the class cannot matter. | delivery: acceptable |

What the other reading would do, for the record: FLN's share would be CSF's spending over CSF's plus other partners' only, about 18% instead of 3%; early childhood, adaptive learning and the rest have no named co-adviser in the model, so their shares would go to about 100% x s. At the default 100% that credits CSF with the whole of a state's pre-primary or mission gain, which is not what the evidence says CSF did. The class `delivery` therefore does not lose "would it have happened anyway": the pro-rata share carries it, and `counterfactual_adj` (0.85, replaceability by another technical partner) stays separate.

Checks 4 and 5 for the six: no used share row reads `mobiliser_share` (formulas are the `_shared` row or, for php, pal's used share); nothing in these branches takes it twice or at all, as a delivery share should. `fln/ece/pal/php/edo/hps_total_adj` each read the used share once. Counterfactual stays in `counterfactual_adj` / `hps_counterfactual_adj` / p_success, not in the share.

## Governance

- Denominator: co-advocates only. No district officer, teacher or other adopter is left in it; the deleted rows `gov_disclosure_share` and `gov_district_inr` fed only the old formula (no other reader; the model builds and the headline matches). No co-advocate named in the old text was dropped: the old denominator held CSF's own spending and the districts' staff time only.
- Class: `win`, and `gov_attribution_share = gov_attribution_share_shared * mobiliser_share` reads the setting once; `gov_total_adj` reads the used share once; p_success (0.5) and `gov_counterfactual_adj` (0.95) are the "would it have happened anyway" cuts and are untouched. Verified at s = 0.3: used share 0.255, the branch's part of the result falls by 70%, no other branch moves.
- Value: 0.85 (0.6-1.0), judged. Best guess, not conservative or optimistic: the annual report (pp. 44-46) shows CSF doing the assessment and report-card design, the item banks and the explainer films, and the collectors' own quotes credit "CSF's technical support" while saying the districts did the sharing, which is why the adopters sit outside. The prior ~0.5 included the districts' staff time and is the wrong thing to count under 2.24. The range is wide enough for co-advocates whom the report does not name.
- Cost of the mobilised resources: the districts' staff and teachers' time is no longer priced in the share (about 40% of the branch's credit before). 2.24 says public money for wins other than money moved, aid and climate is "not yet" netted, so this is the logged deferral, not a breach; the generic -2% teacher-time harm in `unmodelled_benefits_adj` is shared by every branch. Effect of the change on the result about +3%.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `gov_downstream_value` explainer | Says the districts' running costs "count in CSF's share of the resources", which is no longer true: the share now counts co-advocates only. | Row text, last sentence. | Replace the last sentence with: "The districts' staff and teachers' time on the assessments and report cards is a mobilised resource, valued only through the side effects' teacher-time harm (docs/normalization.md 2.24)." | none |
| 2 | low | source | `gov_attribution_share_shared` explainer | "With assessment partners beside it" is not supported: annual report pp. 44-46 name no assessment partner in the disclosure pilots. Also gives no page for the CSF-did-most-of-the-work anchor. | Annual report pp. 44-46 (Jodhpur and Angul text, the two collectors' quotes). | Reword to: "CSF designed the assessments, report cards and parent materials for the Jodhpur and Angul pilots (annual report pp. 44-46); co-advocates, if any, are not named there. 85% (60% to 100%), our judgment." Same value and range. | none |

## Text that follows the change
Model `summary`: "about 3% for the state missions" matches (3.1%). Writeup: FLN about 3%, early childhood about 6%, adaptive learning about 4%, other EdTech about 25%, governance about 85%, STEM pilot about 45% all match the model (3.1, 5.6, 4.4, 25.5, 85, 44.6), and "about half the result is FLN, over a quarter adaptive learning" matches (52%, 28%). The writeup's credit line ("its share of all resources behind each outcome") is still true for the delivery branches and the governance line says "a judged share among those who pressed for the pilots". No writeup edit made. (The "How this model was checked" section stops at round 2 though rounds 3-5 exist: older than this change, left.)

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `gov_*`, `ece_*`, class of fln/ece | Annual Report 2025-26 (cloudinary PDF in `source`) | verified | Pages 34-38 (state-led pre-primary, NEP 2020, technical support), 44-46 (Jodhpur 54 -> 1,339 schools, ~70,000 students; Angul 1,362 schools, ~30,000; collectors' quotes; no named assessment partner), 39 (EdTech partners). |
| `pal_*`, `php_*` | PAL Works brochure, Jan 2026 (cloudinary PDF in model) | verified | Samagra Shiksha ICT framework and PM SHRI guidelines name PAL; reach "partly through government funding" in the listed states. |
| `nipun_central_inr`, `central_share_nipun` | careers360 article | not re-fetched | Not changed in this step. |

## Drivers
Unchanged from round 4: discount rate, missing-data discount, value of a healthy year, the next dollar, how much of a test-score gain lasts. The credit step moves only governance (+3%); at 30% only governance falls.
