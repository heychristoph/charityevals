# Audit: village-enterprise-charityevals, round 3

Result: 0.008316 uov/$ = 4.16 years of healthy life per $1,000 (joint 0.099–90.6; own ranges 0.29–28.3); cause median 7.01 (×0.59). Verdict: **pass** (no high or medium findings). Five low findings remain, all wording or presentation. Fixing them together changes the result by less than 0.5%.

Scope: unchanged and still right. The model covers all program services for FY2025 (July 2024 to June 2025): $17,076,992, or $20,993,131 with overhead (audited). It sets them against the 47,505 entrepreneurs trained that year. Every program line is the same graduation model, so pooling is right. DREAMS (32% of spending) is split into Uganda (3,600 households, a judgment from the cohort schedule), Ethiopia (8,000) and Tanzania (1,561), which is 27.7% of households. No newer audited year exists.

Mechanical:
- Lint: 0 high, 0 medium, 0 low.
- Invariants: none violated.
- normalization-audit (`--exclude village-enterprise-founders-pledge`): 0 violations for this model. The report lists no waiver entry against this model now. The `study_household_size` waiver in normalization-waivers.json is the same checked false positive accepted in round 2.

Blind note: I read nothing from the DREAMS report's section 5 or its executive-summary cost bullets, and no evaluator model or review of Village Enterprise. The DREAMS passages I used come from the round-1 auditor's redacted extract (Table C1, Table E1, p. 53). No evaluator cost-effectiveness figure for Village Enterprise came up in anything I read.

Change from round 2: the result rose from 3.34 to 4.16 (+24.5%). Testing in a scratch copy splits that rise:
- `fade_rate` from 10% to 5%: +16.9% (3.56 with 10% in today's model).
- The rest (+6.5%): the per-branch evidence adjustments (about +3.4%), the households for Ethiopia and Tanzania (about +1.9%) and the unwinsorized refugee pair (about +0.5%). These match round 2's estimates.

Previous round:
1. Summary result stale (medium): **resolved**. It now says "about 4", against 4.16 live, and the write-up uses the live figure (4.2).
2. `fade_rate` without a reference class (medium): **resolved**. The explainer now gives:
   - the trial's pooled cohort finding, with no significant differences except Cohort 4. I verified the wording on DIB printed p. 20, PDF p. 22: "seven cohorts" is right, because Cohort 4 is compared with "the other six cohorts".
   - the Kenya and Uganda patterns, and the DREAMS cohort result;
   - outside anchors: Banerjee et al. 2015, Bandiera et al. 2017, and Blattman, Fiala and Martinez 2020.

   The best guess moved from 10% to 5% because the stated anchors point there, not toward a peer. The anchors back that: no detectable fade in the program's own trials, flat or rising gains in the BRAC-style follow-ups, and a fade only after year 4 in Blattman. That is a defensible best guess, and the 0–20% range is kept. The new `persistence_years` claim, "worth about 6 years of the full gain", checks out: 5.95 years at 5% fade and 4% discount over 8 years. Low #1 is a remaining wording point.
3. Double evidence cut for Ethiopia and DREAMS Uganda (low): **resolved** as named. The branch rows (`core_evidence_adj` 0.87, `dreams_uganda_evidence_adj` 0.95, `dreams_tanzania_evidence_adj` 0.87, `dreams_ethiopia_evidence_adj` 0.81 = 0.95 × 0.85) are each applied in their branch inside `ln_gain_per_person`. `evidence_adj` is the household × gain-weighted average (0.866) and is out of `total_adj`. A cosmetic label point is in low #4.
4. Ethiopia and Tanzania households (low): **resolved**. 64,800/10,800 = 6.00 and 16,180/2,800 = 5.78 are read from the annual report's p. 11 counts, which I verified. Ethiopia gets 8,000 households and Tanzania 1,561. Entering the two raw counts is not a way around the shared household size: they only turn the charity's lives count back into its own entrepreneur count. `people_reached` still uses `household_size`, which reads `@household_size.*`. A new explainer error came with this fix (low #2).
5. `dreams_itt_month` range basis (low): **resolved**. The explainer says the range is the cohort spread, used as a proxy that is likely wider than the pooled interval.
6. Refugee pair (low): **resolved**. 14.11 on 106.07 come from the same row of Table E1, which I verified (PDF p. 88: "6560 113.66 20.28 *** 106.07 14.11 *** 127.35 30.56 ***"). The winsorized 13.74 is named in the explainer.
7. `fade_rate` page and wording (low): **resolved**. The citation is "printed p. 21, PDF p. 23", and the explainer says the evidence for the lockdown explanation is mixed.
8. Write-up "15%" and DREAMS countries (low): **resolved**. It now says 13%, and Tanzania is named with its local organisations.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | sensitivity | `fade_rate` explainer | The explainer leans on "no detectable fade over 0.5 to 2.5 years" for the move to 5%. But the cohort comparison cannot tell 5% from 10% a year apart. Over two years the two rates differ by only about 10% in the effect, well inside the cohort-level confidence intervals in Figure 7 (single-cohort effects are each about a seventh of the sample). So the trial shows that a fast fade is unlikely, not that the fade is slow. What makes 5% the best guess over 10% is the outside anchors (Banerjee 2015 flat, Bandiera 2017 rising, Blattman fading only after year 4). | DIB report printed p. 20, PDF p. 22, Figure 7, cohort-level estimates | Add one sentence: "The cohort comparison rules out a fast fade (well above 20% a year) but has too little power to tell 5% from 10%; the 5% rests on the outside anchors, which show flat or rising gains for 3–7 years." Keep the value. | none (wording) |
| 2 | low | units | `households_kenya`, `households_uganda`, `households_rwanda` explainers | Each says the charity "counts these three countries at the same 6.67 people per entrepreneur". The model's numbers show otherwise. After Ethiopia (8,000) and Tanzania (1,561), 37,945 households are left for 259,740 lives, i.e. **6.85** per household. That is above every ratio the annual report prints for these countries: Uganda DREAMS 80,000/12,000 = 6.67, Rwanda 102,000/15,300 = 6.67, Garissa 4,800/720 = 6.67, Nawiri 107,898/17,983 = 6.00. So the FY25 country lives counts don't fully reconcile with 47,505 entrepreneurs at the charity's own ratios: they imply 48,521, 2% more. The residual absorbs that gap. | Annual report pp. 6, 8–13 (the ratios above); model values: households − ET − TZ = 37,944.6 against lives 259,740 | Either (a) reword all three explainers: "the remaining households, about 6.85 people each by the charity's lives counts (its FY25 country counts sum to about 2% more entrepreneurs than the 47,505 it reports at its usual 6.67 and 6.0 ratios; the residual absorbs the gap)". Or (b) scale all five countries' implied households (lives ÷ the country's ratio, 6.67 for Kenya, Uganda and Rwanda from Uganda DREAMS' 80,000/12,000 on p. 11) to the 47,505 total. That gives Ethiopia 7,832 and Tanzania 1,528. (a) is enough. | (a) none; (b) −0.4% (4.14) |
| 3 | low | presentation | `summary`, write-up "How the impact happens" | The effect percentages mix two bases. "7.3% in Kenya, 3.6% in Uganda" are intention-to-treat shares of control consumption. "18% in DREAMS" is the effect on participants: the DREAMS report's own ITT figure is 17.1% (19.10/112.06, p. 53). "13% for its refugees" is the ITT (14.11/106.07 = 13.3%). Readers will compare them as like for like. | DREAMS report p. 53: "a 17.1% difference"; DIB Tables F1/F2 | Use the ITT figure throughout, the trials' headline basis: "7.3% in Kenya, 3.6% in Uganda, 17% in DREAMS, 13% for its refugees", in both the model summary and the write-up. (The effects on participants, 7.6%, 3.8%, 18% and 14%, are what the model uses. Either set works as long as one set is used.) | none |
| 4 | low | structure | `evidence_adj` label; branch evidence rows' section | Convention 4 asks that the canonical row be labelled "outcome-weighted average of the branches, for reading only". The label stops at "…average of the branches", and only the explainer says it is for reading. Also, the four branch rows (`core_evidence_adj`, `dreams_*_evidence_adj`) sit in the `effect` section, while their average and every other adjustment are in `adjustments`. | templates.md Convention 4 | Label: "Evidence adjustment (internal and external validity), outcome-weighted average of the branches, for reading only". Move the four branch evidence rows to section `adjustments`, just above `evidence_adj`. | none |
| 5 | low | presentation | write-up "What drives the result" | It says unmodelled benefits, "the trust put in the trials", the core effect and credit sharing "each move the result by about ±20%". Per the tornado: `unmodelled_benefits_adj` −18% / +28%; `attribution_share_shared` −18% / +18%; `core_uganda_itt_month` −16% / +15%; spillovers −9% / +27%; `core_evidence_adj` only −10% / +7.5%. | audit-model tornado | Write: "Other benefits and harms not modelled, the credit shared with partners, spillovers and the size of the core program's effect each move the result by about 15–25%; the trust put in the trials by about 10%." | none |

## Sources checked

Rows that are new or changed this round were checked against the round-1 auditor's downloaded copies (audit-scratch-r1/dl, the same URLs as the model). I re-extracted the DIB report's text myself (audit-scratch-r3/dib.txt). Rows verified in rounds 1 and 2 and unchanged since were not re-checked.

| Row | URL | Status | Note |
|---|---|---|---|
| dreams_refugee_control_month, dreams_refugee_itt_month | DREAMS report, Table E1, PDF p. 88 | verified | "Monthly Household Consumption (USD) 6560 113.66 20.28 *** 106.07 14.11 *** 127.35 30.56 *** -16.45 ***". The winsorized 13.74 is on p. 53, as the explainer says |
| dreams_itt_month, dreams_tot_month, dreams_itt_point, dreams_control_consumption_month | DREAMS report, Table C1 | verified | "6560 112.06 19.10 *** 20.21 *** 18.86 ***". No standard error is printed, so the range is a proxy, as the explainer now says |
| ethiopia_entrepreneurs_to_date, ethiopia_lives_to_date | 2025 Annual Report p. 11 | verified | "ENTREPRENEURS TRAINED 10,800 BUSINESSES STARTED 3,600 LIVES TRANSFORMED 64,800" |
| tanzania_entrepreneurs_to_date, tanzania_lives_to_date | 2025 Annual Report p. 11 | verified | "ENTREPRENEURS TRAINED 2,800 BUSINESSES STARTED 809 LIVES TRANSFORMED 16,180" |
| lives_* (5 rows), households | 2025 Annual Report p. 6 | verified | 116,880 / 91,400 / 51,460 / 48,000 / 9,020; FY25 47,505. Residual ratio: low #2 |
| fade_rate (trial reading) | DIB report printed pp. 20–21 (PDF pp. 22–23) | verified | "there are no significant differences in treatment effects on household consumption across cohorts, except for Cohort 4-Dec2019 … the other six cohorts"; Kenya's later cohorts larger, Uganda's the reverse; "the evidence to support this hypothesis is mixed" |
| persistence_years anchor | models/global-health/raising-the-village-founders-pledge.json `effect_years` | verified | 1 / 3 / 6, "GiveWell's best guess, 3 years" |
| core_kenya_*, core_uganda_*, core_itt/tot_month | DIB report Tables F1, F2, B1, L1 | verified (round 2) | unchanged |
| program_spend, total_expenses, staff_pay | FY25 audited statements | verified (round 1) | unchanged |

## Drivers

1. `$uov_per_daly` (shared): 8.32–2.08. Not the builder's.
2. `persistence_years` (judgment): 1.92–5.35. Anchored on Raising the Village (3 years), BRAC-style follow-ups at 7 and 10 years, and Blattman's convergence by year 9.
3. `fade_rate` (judgment): 4.89–2.66. Now anchored (low #1 is wording only). Persistence and fade together are still the main uncertainty.
4. `$uov_per_ln_consumption` (shared): 3.12–5.20.
5. `unmodelled_benefits_adj` (judgment): 3.42–5.34. Each component is listed with its sign.

After those come `attribution_share_shared`, `spillover_ratio` (judgments, anchored) and `core_uganda_itt_month` (observed, SE-based range).

The ranges reflect real uncertainty. Point values (cost, reach, control means, the TOT/ITT ratios) are audited or measured figures, which is fine.

Peers: the result is 0.59× the cause median, about level with GiveDirectly (3.96). As in round 2, the gap to Raising the Village (12.6) comes mainly from cost per person (about $68 here against about $30), not from persistence or the effect.

What would most improve the model: the DREAMS second endline (about 2.5 years after the program) and any longer follow-up of the impact-bond trial's households. When either is published, re-fit `fade_rate` and `persistence_years`.
