# Audit: world-vision-charityevals, round 4 (verification of the relief, goods and livelihoods changes)
Result: 2.903e-4 daly/$ = 0.2903 years of healthy life per 1,000 dollars (combined range 0.072–1.174); cause median 0.0898 (×3.23). Verdict: pass.
Model-sha: 7ab6eb3b5112f59f92e9009ad18400d259a8010aaadf94d2af535699ce41b50c
Scope: scoped verification of the changes listed (ln_gain_per_person, relief goods adjusted apart from deaths, gik_evidence_adj, livelihoods' mortality step, summary and write-up); the rest of the model as in round 3.
Mechanical: lint 0 high / 0 medium / 0 low (audit-model findings: 0, only the usual wide-range warnings), invariants none, check.ts all models valid, simulation-check 5% 0.561 / 50% 1 / 95% 1.81 × best guess (stable), normalization-audit not rerun (coordinator: none).
Previous round: round 3 passed with no open findings; nothing carried over.

Checked and correct:
- ln_gain_per_person = years_exposed × ln(1 + v ÷ (b × years_exposed)), v about $19, b $259.7, t 0.2: 0.0633 (was 0.0719). The deaths use the same years_exposed, so one period t.
- relief_uov = deaths × relief_total_adj + goods × relief_goods_total_adj. relief_goods_total_adj is the same product as relief_total_adj without the evidence step and with the goods attribution 0.95 (0.85–1, reason, anchor CARE); counterfactual, implementation, funging, wait and missing-data are in both, none twice. dalys_direct is 0 (relief illness 0), so relief_total_adj there is harmless.
- relief_uov_unadjusted, relief_deaths_share_unadj, relief_dalys_unadjusted: consistent; the evidence_adj and attribution_share_shared averages weight the two parts correctly; counterfactual, missing-data and other averages need no split. None is on the result's path (outcome_total reads uov_bridged only).
- gik_evidence_adj = 1 with the valuation doubt in gik_inkind_equivalence: no double discount. GIK was 8,638 before, now 9,092.
- Livelihoods: formula is the family's (identical to Save the Children's); the new judgment has a reason, anchor (Richterman 2023, GiveWell 0.2) and range 0–0.5. Measured: the step adds about 0.0029 (1%) to the result; the livelihood branch is 0.0176 (6%).
- Before → after 0.2644 → 0.2903 reproduced (old model run in a scratch copy). Relief is 2.177e5 of 3.303e5 healthy years (66%): "about two thirds" is right; 0.2903 is 3.23× the median: "about three times" is right.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up "What drives the result" | "a small change here moves a fifth of the result" is wrong for the livelihoods gain: the whole branch is 6% of the result (scratch copy with gain and mortality ratio at 0: 0.2727 vs 0.2903) | scratch run | Write "a small change here moves a few percent of the result" (the 5% upper end adds about 12%) | none |
| 2 | low | presentation | livelihood_dalys_unadjusted label | Label says "consumption gained" but the row now also holds the deaths higher incomes avert (it is livelihood_dalys ÷ total_adj) | formula line 1776 | Relabel "Livelihoods: consumption gained and the deaths higher incomes avert, in healthy years before adjustments" | none |
| 3 | low | presentation | summary | "then livelihoods, child health and water" lists livelihoods (6%) before health and water, which together are about a quarter | branch sizes | Write "then child health and water, and livelihoods" | none |

## Sources checked
No new sourced numbers; the new judgments cite published anchors (Richterman et al. 2023, GiveWell's cash mortality ratio, CARE's goods attribution), not fetched this round.

## Drivers
Missing-data discount (judgment), uov_per_daly (shared), relief_counterfactual_adj, affected_consumption_share, health_cost_per_child (all judgments). The result rests on judgments (about 99% of the uncertainty); the best improvement would be a sourced split of World Vision US's international money between relief and development.

Verdict: pass
Model-sha: 7ab6eb3b5112f59f92e9009ad18400d259a8010aaadf94d2af535699ce41b50c
