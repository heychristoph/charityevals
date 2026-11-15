# Audit: salvation-army-charityevals-international, round 1 (verification of the rule changes)
Result: 2.576e-4 daly/$ = 0.2576 years of healthy life per 1,000 dollars (combined range 0.040-1.662); cause median 0.0898 (x2.87). Verdict: pass.
Model-sha: fdc5c543e7a1c485e4e3afb9a6c97d035b3eb0eebb109aa4fa2fc257645e9c2f
Scope: only the changes: ln_gain_per_person (disaster relief), livelihoods' mortality step (income_mortality_uov_ratio, livelihood_uov), relief evidence/attribution rows (rule 2), summary and write-up sentences. Not a full re-audit.
Mechanical: lint none above low (one low: spread), invariants none, check.ts all valid, simulation-check 5%/50%/95% = 0.343/1/2.77 x best guess, normalization-audit none (coordinator).
Previous round: none kept (grandfathered).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | ln_gain_per_person / summary | The relief rule-1 change is immaterial here (baseline $7,000, value $80, t 0.25: the gain is already tiny, so t x ln(1+v/(b t)) is within 0.1% of ln(1+v/b)). The whole 0.2343 -> 0.2576 move (+10%) is the livelihoods' mortality step: scratch copy with ratio 0 gives 0.2342, with years_exposed 1 gives 0.2578. Nothing in the summary or write-up claims otherwise; "over the months they cover" is correct. | Scratch runs of audit-model.ts | None needed; if the batch log states the move, attribute it to the mortality step. | none |
| 2 | low | presentation | attribution_share_shared / relief_total_adj | Rule 2 is met (relief_evidence_adj best 1, attribution 1), and the attribution 1 is backed by the model's own reasoning: people_reached is spending at SAWSO's own cost over the value each person got, so others' resources are not in the value counted. Confirmed; the explainer already says so. | people_reached and attribution_share_shared explainers | None. | none |

Checks passed: ln_gain_per_person formula and explainer agree (years_exposed x ln(1 + v ppp / (b x years_exposed)); t in years, 0.25, range 0.1-0.5; the same years_exposed drives deaths_averted_per_person, consistent). income_mortality_uov_ratio has a reason, anchor (Richterman 2023, GiveWell 0.2), range 0-0.5, kind judgment, same as Mercy Corps. livelihood_uov multiplies the ratio once, inside the branch before livelihood_total_adj (adjusted once, no double count); livelihood_dalys_unadjusted divides it back out, so the reading-only averages weight correctly and stay off the result path (uov_bridged carries the result). Bridge label "(after the branch's adjustments)" is true. Summary: 0.26, range 0.04-1.7, about 50x the US work (0.2576/0.005191 = 49.6), about three times the median (x2.87) all match; the stale "twelfth" is gone. Write-up: US headline 0.005 matches 0.005191; overseas 0.26; "about 50 times"; the gift is 0.976 x 0.00519 + 0.024 x 0.2576 = 0.0113, of which overseas is 55%, so "about 0.011, half from the overseas work" holds. The livelihoods sentence ("a fifth of the gain's value, the cash-income ratio") matches the 0.2 ratio.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| income_mortality_uov_ratio | not fetched (scoped round) | n/a | Anchor copied from Mercy Corps' model; wording consistent |

## Drivers
missing_data_discount, livelihood_consumption_gain, uov_per_daly, discount_rate, livelihood_cost_per_member (all judgment; 98% of uncertainty is judgment). Most improving: a SAWSO-published reach or outcome count for the livelihoods and schools branches.

Verdict: pass
Model-sha: fdc5c543e7a1c485e4e3afb9a6c97d035b3eb0eebb109aa4fa2fc257645e9c2f

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (15 Nov 2026): overhead ratio without the US donated goods (Convention 2); the income-mortality ratio read from the shared fact; 0.258 → 0.245.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)
