# Audit: bulletin-of-the-atomic-scientists-charityevals, round 3
Result: 0.01615 daly/$ = 16.15 years of healthy life per 1,000 dollars (unchanged from round 2). Verdict: pass.
Model-sha: a0f8308dd210cc0625c7b673782fe452d3f0bd09dbdb13671dd9c14d824ad322
Scope: verification round on the last commit only (models, facts/climate.json, write-up). `scripts/audit-model.ts` gives 0 findings and 16.15 per $1,000.

Previous round (round 2):
1. salary_gap (low): resolved. It reads `@staff_pay.gap_media`; the fact exists in facts/staff_pay.json (0.20, range 0.05-0.35, judgment, "producers and researchers in media programs"), which fits editors and journalists at a non-profit outlet. The explainer says so. No change at defaults.
2. Cost-share row sources (low): resolved. The four editor-title quotes are gone. Each listing's FY25 article count is in `page` (96 / about 22 AI; 50; 84), with the 316 total. other_cost_share names all three listings and their parts (16 civil-power articles, about 20 other technology, about a third of the 50 biosecurity ones). The counts agree with the shares in the explainers (5.1% of 316 is 16; 6.3% is 20; 4.8% is about 15 of 316).
3. ai_misuse_cost_share (low): resolved. The explainer now treats AI in military and nuclear decisions and AI-made disinformation as misuse, puts surveillance, governance and loss of control with the misalignment remainder, and says uplift is almost absent. This matches the 30% (10%-60%).
4. Climate tonnes' period (low): resolved. The fact's explainer and climate_fund_tonne_years both say Rethink's brief states no period and that the reading is ours.
5. Sources (low): resolved. The model's `resources` has the topic listings and Rethink's brief; the write-up's Sources has both.

Write-up paragraph "How this model was checked": accurate. Round 1 had four medium and three low findings (audit-r1), round 2 passed with five low findings, and the described fixes (area split from the 316 articles, public-facing evidence figure, shared top-fund cost per tonne, corrected sources and figures) match the model.

No new findings.

Verdict: pass
Model-sha: a0f8308dd210cc0625c7b673782fe452d3f0bd09dbdb13671dd9c14d824ad322

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.
