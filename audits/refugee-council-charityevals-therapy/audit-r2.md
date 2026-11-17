# Audit: refugee-council-charityevals-therapy, round 2 (verification)
Result: 4.023e-5 WELLBYs/$ = 0.002626 years of healthy life per $1,000 (combined range 0.00043-0.0161). Verdict: pass.
Verdict: pass
Model-sha: 43baf554f9003730531ffa493355ad3a5f8e535f2d1f3c0c9e5a8ea22f8a0740
Mechanical: lint 0 high / 0 medium / 1 low (far-below, summary gives the reason); simulation stable (5% 0.32, 95% 2.92 x best guess); normalization-audit printed no line for this model (generated/ reverted).

Round-1 findings:
1. `myview_clients` (medium): settled in substance. Best 50, range 0-200; the explainer now states that the accounts do not say which line pays MyView, that 0 removes the double count, and that the services model counts those children's general advice gain only, not therapy (so a residual overlap is limited to the 0-200 range, not a double count of therapy). The 50 rests on the cost gap (£5,700 against a £1,500-2,250 course). Accepted as a judgment with reasoning; the charity could settle it.
2. `evidence_adj` / `missing_data_adj` (medium): settled. External part is population and setting only (0.85), delivery mix left to the missing-data step, stated in both explainers; 0.5 (0.3-0.75).
3. `counterfactual_adj` (medium): settled. 0.9 (0.7-1) with the stated anchor (WWP's mental-health model takes 0.7 for veterans with free VA trauma therapy, verified in that model's `iop_counterfactual_adj`) and the note that no refugee access rate is published.
4. `cost_per_person` explainer: no stale number: fixed.
5. Harris and Barraclough: cited with journal, pages and DOI: fixed.
6. Uncited Scandinavian claim removed: fixed.

New findings: none. Summary updated (0.003, range 0.0004-0.016, $7,000 a person with the 50 MyView children in the count, credit and delivery named).

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): Preflight cleanup: a typed figure now read from its shared fact at the same value (@depression.suicide_rr_with_depression, @meta.fundraiser_side_effects_share, @irap.years_gain_lasts); labels and explainers reworded. Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against a8d130f3.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against c42a537d.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against d150f0b2.
