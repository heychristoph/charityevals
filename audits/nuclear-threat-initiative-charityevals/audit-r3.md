# Audit: nuclear-threat-initiative-charityevals, round 3 (verification)

Result: 0.02102 daly/$ = 21.0 years of healthy life per $1,000 (combined range 1.08 – 410); no cause median (still the only model in catastrophic-risk). Verdict: pass.
Model-sha: cfdc2405e585b354869ce6b927dec0ad6c17f70cf97637157608080d83adf86e

Scope: only the changes since round 2 (audit-r2.md) and the write-up's "How this model was checked" paragraph.

Mechanical: audit-model gives 21.02, combined range 1.076 – 410.5, and the same 6 low lint findings as rounds 1 and 2 (four smaller-catastrophe zeros with no range; `pol_cost_share` and `fb_cost_share` feed only the check row). The tornado's nuclear death share is now 9.67 – 36.15, as round 2 predicted (9.7 – 36.2). The other drivers are unchanged: the nuclear cut 5.7 – 174, the years counted 4.5 – 64, missing data 4.2 – 42, the discount rate 92.4 at 0.1% and 18.5 at 8%. generated/ was untouched.

Previous round:
1. (medium, nuclear death share range) **Resolved.** `@catastrophe.nuclear_catastrophe_death_share` is 0.15 / 0.45 / 0.85. The source note gives Xia et al.'s Table 1 as round 2 read it: India–Pakistan wars above the threshold kill 15%, 23%, 33% and 40%, and the large US–Russia war 81–85%. The note also gives RP's 36–96%. The explainer says 15–40% and 81–85%, with the range spanning both. The write-up bullet says "from 15% to 85%". Nothing in facts/, docs/, the skills or the write-up still says 30–75%.
2. (medium, summary) **Resolved.** The model summary says "about 21 … from 1 to 410 on the combined range", which matches the live 21.02 and 1.08 – 410.5. The write-up says "about 1 to about 410", and normalization.md 2.19 says "21 … (1.1-410)".
3. (low, bio cut explainer) **Resolved.** Both bio cut explainers say natural and COVID-scale pandemics are "about a third of a pandemic branch's value". That matches round 2's run: 68.6 + 30 of 308 deaths a year per $1M, 32%.
4. (low, losses beyond deaths on extinction deaths) **Resolved by stating it.** The explainer of `@catastrophe.nondeath_losses_vs_deaths` says the factor is read on every death averted, extinction-level ones included, and that its high end overstates by a few percent (round 2: +29.2% against about +26%). It is 0 at the default.

Write-up, "How this model was checked": the paragraph is accurate. It says round 1 found two high issues: the single death share, now split by area, and the experts' forecasts, kept by the site's rule for AI with the superforecasters as the low end. It says the backfire step is now in the cut per dollar. It says round 2 passed and that its fixes were checked in a verification round. This round is that verification, and it passes. The paragraph names two of round 2's four fixes. The two it leaves out are explainer wording, so the omission is fine. The write-up's other figures are still current: about 90 at 0.1% (92.4), and the cut's swing from 6 to 174.

No new findings.

Verdict: pass. Findings: 0 high, 0 medium, 0 low.
