# Audit: refugee-council-charityevals-advocacy, round 2 (verification)
Result: 2.942e-6 daly/$ = 0.002942 years of healthy life per $1,000 (combined range 0.00043-0.0201). Verdict: pass.
Verdict: pass
Model-sha: d8f0a7a98585de85c9831080c02fdb1964d2b101eda59efc79a7e8406e84c473
Rules: 0.3.3
Mechanical: lint 0 high / 1 medium (spread, own ranges 2713x) / 2 low (attribution_share diagnostic, far-below); simulation stable (5% 0.25, 95% 3.93 x best guess); normalization-audit printed no line for this model (generated/ reverted).

Round-1 findings:
1. `mvo_lasting_days` unsourced (medium): settled by removal; the row is deleted and no lasting 42-day win is credited.
2. Cost window vs the March 2026 change (medium): settled. `ln_gain_per_person_year` = 0 with the Convention 11 reason in the explainer; only the pilot (9 Dec 2024 to 1 Sep 2025, inside the costed years) is counted. The summary says a later lasting change is left to the next year's accounts. Result falls 0.0082 -> 0.0029, as I estimated for dropping the branch.
3. `ima_ls_gain` anchor (medium): settled. Anchored on the Refugee Council's own surveys; I checked accounts p. 14: confidence dealing with unexpected events 31% (asylum) vs 55% (other statuses) improved, worrying less 20% vs 45%, about 800 clients. IRC resettlement model's `reunif_ls_gain` is 1 (0.3-2), as cited. The branch is small.
4. `mvo_pilot_years`: now an estimate, evaluation-sourced: fixed.
5. `grants_per_year`: now an estimate 35,000-70,000 with the trend stated: fixed.
6. Own-range spread: lint medium "spread" remains at 2713x (own ranges, shared assumptions at best). I accept it: it is inherent in the two judged counterfactual and attribution shares (counterfactual 30% / 5%, credit 25% / 12%, each ranged several-fold and multiplied through two branches), the model has no lever left to narrow without inventing evidence, and the summary states that the result is mostly judgment spanning ten-fold per win. Fine for a pass; the best narrowing would be a published campaign-attribution study. The spread rose from 1183x because the lasting branch (which carried a narrow range) is gone.

New findings: none. A hidden wrinkle checked: with the lasting branch at zero the template's win-years row still reads `$win_years_counted` but multiplies 0, so no stray credit; "advocacy line only counts the pilot" is stated in the summary.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against c42a537d.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 3 rows changed, against d150f0b2.
