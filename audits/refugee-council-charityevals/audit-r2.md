# Audit: refugee-council-charityevals, round 2 (verification)
Result: 1.835e-6 daly/$ = 0.001835 years of healthy life per 1,000 dollars (combined range 0.00037-0.0090). Verdict: pass.
Verdict: pass
Model-sha: 1382e3e034f07e370a2c84c1448685413814c93a88bd7b9a26e2884cd03309f2
Rules: 0.3.1
Mechanical: lint 0 high / 0 medium / 1 low (far-below, summary gives the reason); simulation stable (5% 0.42, 95% 2.45 x best guess); normalization-audit printed no line for this model (generated/ reverted).

Round-1 findings:
1. `int_value_gbp` (medium): settled. Now `int_changed_share` (15%, 5-30%, anchored on advice vs casework mix) x `int_weeks_secured` (4, 2-10) x `int_weekly_value_gbp` (60, 45-95, GOV.UK £49.18 quote and UC about £90 a week) + `int_health_access_gbp` (15, 5-40); about £51 a client, in line with the reference class I asked for. Weeks is now in the tornado (0.00167-0.00232), no longer a bare point.
2. `recipients_consumption_share` (low): settled; reads `@united_kingdom.asylum_recipients_consumption_share` (18%); the fact's label and explainer now cover first-year refugees. Resettlement's gain is lower, result 0.0029 -> 0.0018 and the summary's shares (half resettlement, two-fifths integration) and range are updated.
3. "88%" -> 76% (£9.3m of £12.25m): fixed, matches my round-1 arithmetic.
4. "£370" -> "£430": fixed.
5. `cost_per_person` explainer: stale number removed: fixed.
6. `int_homeless_ln_gain` explainer: reworded and now consistent with the formula: fixed.

New findings: none. Spot-checked that the new rows are ranged judgments with explainers, the formula chain feeds the canonical `int_value_gbp`, and the weekly-value source quote (£49.18) is the GOV.UK page's wording.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against d150f0b2.
