# Audit: council-on-strategic-risks-charityevals, round 3 (scoped verification)
Result: 0.01198 daly/$ = 12.0 years of healthy life per 1,000 dollars (combined range 0.79–181), unchanged from round 2. Verdict: pass.
Model-sha: 88598e1614405b3be98a2c0b7d7906b4cfff1b170e91dbc5fd374223c6af373d
Scope: only the changes since round 2 (git diff 7f2b23d HEAD, model and write-up). audit-model: 0 findings, invariants none. check.ts: all models valid. simulation-check: 5% 0.158×, median 1.0×, 95% 6.76×, one single event misses 0% of draws. A scratch script (deleted afterwards) printed the engine's row values.

Round 2 findings:
1. Branch shares (medium): **resolved**. Engine w_* at the defaults: nuclear 364,378, biological 108,251, fellowships 41,943, climate security 19.4. Adjustments (evidence × counterfactual × attribution): nuclear 0.6665 × 0.7 × 0.9 = 0.4199, biological 0.8 × 0.7 × 0.8 = 0.448, fellowships 1 × 1 × 0.95 = 0.95, climate security 0.294. Products: 153,010 / 48,497 / 39,846 / 5.7, total 241,359, so shares 63.4% / 20.1% / 16.5% / 0.002%. The summary (63%, a fifth, 17%), the write-up Summary and "What drives the result" (63%, 20%, 17%, under 0.01%) and unmodelled_benefits_adj ("about 60% of it, after adjustments, the nuclear branch's"; 4% is about 6% of the nuclear value, as stated) all match. The fellowships' cost share (8%) matches 350,000 / 4.52M. The added sentence on light adjustments is correct. The explainer's "about 60%" is a rounding of 63%, acceptable.
2. gov_public_dollars_per_dollar (low): **resolved**. cost_total 5,184,309 × gov_cost_share 0.35965 = $1.864M, so "about $1.9M"; $2–3 billion / $1.864M = 1,073 to 1,609, so "1,100 to 1,600". The best guess 500 (50–3,000) is unchanged.
3. covid_scale_deaths_averted / w_pol (low): **resolved**. covid_scale_deaths_averted now adds pol_deaths_averted × bio_covid_scale_share. w_pol now uses ((1 − bio_covid_scale_share) × value_per_death + bio_covid_scale_share × covid_value_per_death), the same form as w_bio. pol_wins is 0, so pol_deaths_averted and w_pol are 0 and the result is unchanged (0.01198, as in round 2). The explainers are correct.
4. Template still typing fb_work_years (low): out of scope here, since the template is a skill file this batch may not change. Acceptable to leave for this model: its own row already reads @catastrophe.field_work_years. The template change should be made in a separate pass, so new builds do not copy a typed number.

New findings: none.

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 12 → 12.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.
