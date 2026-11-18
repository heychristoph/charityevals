# Audit: project-drawdown-charityevals, round 11 (scoped verification)
Result: 8.033e-4 tco2e per donor dollar = 0.0004767 years of healthy life per 1,000 dollars (was 0.0005623; -15%). Combined range not re-run (scoped round). Verdict: fix needed (write-up prose only; the move is the rule's).
Model-sha: f4ac0a7d84adc5a19e58308e1b10749124fd0df31881db162e158f6d14edbd57
Rules: 0.2.0
Scope: rule theoretical-cause-aggregates only (commit 65635d2e; inventory/rule-changes/theoretical-cause-aggregates.md). No source or scope re-audit.
Preflight: not re-run; the model file is unchanged, so lint and invariants are as in round 10.
Previous round: round 10's findings stay as they were; this round adds none to the model.

## Checks
- Model unchanged: `npx tsx scripts/audit-receipt.ts project-drawdown-charityevals` equals round 10's Model-sha (both f4ac0a7d).
- Headline now 0.000476690 (`scripts/headlines.ts`), before 0.0005623: matches the rule's table.
- Row diff, engine at 07e611bd against the current engine on the same data: only the rows below change.
  prior_dollar_value 3.9888e-6 → 4.9031e-6; shifted_dollar_value 7.5085e-7 → 4.7657e-7; informed_money_value (= uov_bridged) 19.71 → 12.51; tco2e_from_uov 16607 → 10540; phil_downstream 47447 → 30115; downstream_value 3.880e5 → 3.707e5; counterfactual_adj, attribution_share_shared, attribution_share, total_adj (via the average-weighted shares reading `downstream`); outcome_total 11160 → 9460.8; tco2e_per_dollar 2.256e-3 → 1.913e-3; tco2e_per_donor_dollar 9.475e-4 → 8.033e-4. `moved_dollar_value` (= `#cause:climate`, 6.4916e-6) is unchanged.
- The model reads `#cause:climate` (unchanged) and `#cause:global-health` through the prior only: the prior rises ×1.229 (= 1/0.814), so the funders' gain 0.3×(6.4916e-6 − prior) falls 7.51e-7 → 4.77e-7 (×0.635); the funders' branch (tco2e_from_uov × 0.25) goes 4152 → 2635 tonnes, the corporate, investor and public branches are untouched, so the headline falls 15%. Mechanism (shared by all seven): `#cause:x` is the equal-weight mean of the charities ranked in cause x. Under the rule it leaves out purely theoretical models. At the defaults the global-health mean falls 0.012888 → 0.010485 (×0.814; 22 charities with a theoretical model drop out or lose a part), animal-welfare rises 2.104e-6 → 2.184e-6 (×1.038; five charities), and ai, biosecurity, nuclear, catastrophic-risk and climate are unchanged to the last digit. Checked by evaluating `causeFigure` with the old hidden-test (`tooOld`, engine at 07e611bd) and the new one (`!ranks`) on the same data.

## Prose
Write-up writeups/project-drawdown-charityevals.md has stale statements, two of them about sign (stale before this rule too, but the rule makes the first plainly wrong):
- Medium, Summary (line 3): "Most of it is foundation and family giving that follows its guidance, valued at the ranked climate charities' figures, which average below zero at the defaults." The ranked climate charities' mean is +6.49e-6 and the funders' gain is positive (shifted_dollar_value +4.77e-7, tco2e_from_uov +10,540). Funders' giving is now about 30% of outcome_total (2,635 of about 8,450 tonnes before the +12% side effects; companies about 48%, investors and public about 20%). Fix: replace the sentence with "A large part of it is foundation and family giving that follows its guidance, valued at the ranked climate charities' figures over an ordinary climate charity's." (drop "which average below zero at the defaults" and "Most of it").
- Medium, "What drives the result" (line 35): "Funders' giving is the negative part of the result; companies' and investors' money is the positive part, about three fifths its size." Wrong sign: funders' giving adds +2,635 tonnes and companies' +4,085 (investors and public about +1,730). Fix: replace the sentence with "Companies' money is the largest part of the result (about half), funders' giving about a third and investors' and the public's the rest."
- Low, model summary (models/climate/project-drawdown-charityevals.json): "a dollar given comes to the equivalent of about 0.0015 tonnes of CO₂e" is 0.0008 now (row tco2e_per_donor_dollar; was 0.00095 before the rule, so already 1.6× off). 1.9× off: below the 2× bar. Fix: write `{{row:tco2e_per_donor_dollar}}` for the figure. This changes the model's text and so its Model-sha: it needs a re-stamp or a short scoped round.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | writeups/project-drawdown-charityevals.md, Summary | states funders' giving averages below zero and is most of the result; funders' branch is positive and about 30% | prior 4.9031e-6 < moved_dollar_value 6.4916e-6; tco2e_from_uov 10540 × 0.25 = 2635 of outcome_total 9460.8 | rewrite as above | none |
| 2 | medium | presentation | writeups/project-drawdown-charityevals.md, What drives the result | wrong sign: funders' giving called the negative part | same | rewrite as above | none |
| 3 | low | presentation | model summary | typed 0.0015 tonnes per dollar given; row tco2e_per_donor_dollar is 0.0008 | row value 0.00080327 | use `{{row:tco2e_per_donor_dollar}}` | none |

## Sources checked
None (scoped round: no source read).

## Drivers
Unchanged by this round; the move comes from the `#cause:` aggregates alone.
