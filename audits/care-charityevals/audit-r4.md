# Audit: care-charityevals, round 4 (verification)

Result: 3.308e-4 daly/$ = 0.331 years of healthy life per $1,000 (combined range 0.076–1.43); global-health median 0.0994 (x3.33). Verdict: pass (0 high, 0 medium).

Scope: unchanged (all three programme lines, year to 30 June 2025). Verification of one change only: `aid_value_vs_cash` (public-information branch) was a typed judgment 1x (0.3–2.5), now `@aid_value.oda_vs_cash` (1, 0.4–2), per docs/normalization.md 2.20 and facts/aid_value.json.

Mechanical: audit-model lint 0 findings, no invariant violation; check.ts valid; normalization-audit not re-run (0 violations reported by the caller); the headline 0.3308 and the combined range 0.0763–1.434 are identical to round 3, as the write-up (0.33) and summary say.

Previous round: audit-r3 low 1 (share_under5 explainer cites guidance) was not part of this verification; not re-checked.

Checks:
1. Rule applied correctly: the row sits in the `effect` section, is a formula reading the shared fact with no typed number, and is used once, in the awareness branch (`awareness_spend * aid_kept_per_dollar * aid_value_vs_cash * @cash.uov_per_dollar * awareness_total_adj`). Aid kept here is a donor's whole budget with unknown use, which is exactly 2.20's `oda_vs_cash` case (US aid, not a single sector). The multiple still multiplies `@cash.uov_per_dollar`; no double conversion.
2. Derivation of `oda_vs_cash`: GiveWell cf_value_gavi 0.007 / cash 0.00335 = 2.09x; cf_value_global_fund 0.015433 / 0.00335 = 4.61x (both match the fact's 2.1x and 4.6x). Mix 0.25 x 3 + 0.25 x 0.2 + 0.5 x 0.5 = 1.05, rounds to 1. The "3" is a rounded health average between 2.1 and 4.6 (mean 3.35), slightly generous but inside the stated range; the low and high mixes land near 0.4 and 2 (health fifth at 2x = 0.4 plus small remainder; health third at 4.6x = 1.5 plus 0.05 plus 0.5).
3. Humanitarian anchor: the 0.2 (0.05–0.8) is a judgment anchored on the 17 relief models' median 0.21 before the missing-data step; the recomputation recipe is stated. I did not recompute all 17 (the caller's check). This row's own relief model sits at the same scale, so 0.2 is consistent with it. Only a quarter weight in the mix; effect of the anchor on 1.05 is about 0.05.
4. CEGA source: fetched. Quote "the nutrition and WASH program had a positive impact on savings, a secondary outcome, but did not affect any of the primary outcomes measuring children's well-being" is on the page; so is the cost of $142 per household of which $114 was transferred. Status verified. Reading "about 0.5x" is a judgment (the page shows cash did as well as the programme, with 80% of its cost reaching households), but the fact files it as a judgment with its anchor.
5. Fit to US foreign aid: reasonable. US aid is more humanitarian-heavy than a quarter, but the range (0.4–2) covers it; at 0.2x for a larger humanitarian share the figure would fall only to about 0.7.
6. Effect: result unchanged at the defaults (the old and new best are both 1x). Range: the awareness branch is $7 million of $748 million and `aid_kept_per_dollar` is 0.3 (0–3), so the narrower 0.4–2 changes the combined range by under 1%; `aid_value_vs_cash` is not among the tornado's top 12.
7. Write-up: the headline reads live (0.33); the write-up and summary make no claim about the old 0.3–2.5 range. Nothing stale.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `oda_vs_cash` source note | The mix's "3" for health is not stated as an average of 2.1 and 4.6 (mean 3.35), and the low/high mixes are described without the arithmetic. | facts/aid_value.json note. | Write "health at the mean of 2.1 and 4.6, about 3" and show low 0.2 x 2 + 0.25 x 0.2 + 0.55 x 0.2 ≈ 0.4. | None. |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `oda_vs_cash` | https://cega.berkeley.edu/collection/gikuriro-rwanda-cash-benchmarking/ | verified | quote present; $142 and $114 per household present |
| `oda_vs_cash` (Gavi, Global Fund) | facts/givewell_shared.json, facts/cash.json | verified | 0.007 / 0.00335 = 2.09x; 0.015433 / 0.00335 = 4.61x |

## Drivers
Unchanged from round 3: missing-data discount, `$uov_per_daly`, `livelihood_consumption_gain`, `affected_consumption_share`, `food_consumption_gain`. The aid-value multiple drives under 1%.

Findings by severity: high 0, medium 0, low 1.

Verdict: pass
Model-sha: b2f400cfafd307597f00659385fc7ab8749055de3c3d11b5446bec8eb84983aa
Rules: 0.3.6

Re-stamped (15 Nov 2026): consumption surveys carried forward by 0.7 of real growth (the shared line-up rule); 0.331 → 0.332.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)
Re-stamped (15 Nov 2026): shared LMIC learning-to-earnings and iodine facts (consistency, mechanical)

Re-stamped (16 Nov 2026): Pre-audit gate cleanup: typed figures now read shared facts at the same best values (@sub_saharan_africa.*, @newborn_care.*, @education.learning_gain_sd_median_rct_lmic, @education.years_primary_programme_to_work, @relief_development.*); where a copy's range differed it takes the fact's (livelihood years 1-4, years to work 6-15); explainers no longer compare with other charities' models; headline unchanged. Mechanical: headline unchanged, against 4a6180e3.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 52be53be.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.
