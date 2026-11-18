# Audit: all-hands-and-hearts-charityevals, round 3
Result: 2.760e-6 daly/$ = 0.00276 years of healthy life per 1,000 dollars (combined range 0.00057-0.0135); cause median 0.0866 (x0.032). Verdict: pass (no findings).
Model-sha: 399611f67206d4ccef9e3191c2d7819d18c127f1c287ab9e7aad0ea3a31ecc2a
Rules: 0.3.2
Scope: unchanged; only the changes of commit 001c6e4 since 95fed69 were checked (`git diff 95fed69 001c6e4 -- models/ writeups/`).
Mechanical: lint 0 high / 0 medium / 1 low (far-below, the same as round 2, covered by the summary's reason); invariants none; check.ts all models valid; normalization-audit and simulation-check not re-run (a value and two explainers changed).

Previous round (round 2 lows):
- ms_price explainer quoted Bob Vila's figures inexactly: resolved. It now reads $1,125 to $3,439, average $2,254; the modelled $2,200 (1,100-4,000) is unchanged.
- unmodelled_benefits_adj best did not equal the sum of its sized items: resolved. Best 0.15 to 0.13; the items 6+3+3+2-1 sum to 13; the explainer ends "+13%, from -5% to +40%" (range unchanged); the write-up says +13%.

Diff check: three files changed. The US model has exactly two edits (the ms_price explainer; unmodelled_benefits_adj best 0.15 to 0.13 with its explainer's closing figure). The write-up changes the +15% to +13% and adds a "How this model was checked" list of the rounds. Nothing else changed in the model. The result moved from 0.00281 to 0.00276 (-1.8%), as expected from 0.15 to 0.13 on a (1+adj) multiplier.

No new findings.

Verdict: pass.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)

Re-stamped (16 Nov 2026): Pre-audit cleanup (16 Nov 2026): shared figures read from facts at the same values (@myanmar.household_consumption_share_of_gdp, @survey_consumption.disaster_affected_share_of_survey_mean, @volunteering.disaster_volunteer_ls_gain_year); judgments' reference classes named from sources; volunteer-hours labels name the charity. Values unchanged. Mechanical: headline unchanged, against bebc953e.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2b370f40.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.
