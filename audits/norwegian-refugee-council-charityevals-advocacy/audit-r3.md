# Audit: norwegian-refugee-council-charityevals-advocacy, round 3 (verification)
Result: 2.920e-5 uov/$ = 0.0146 years of healthy life per 1,000 dollars (combined range 0.00104–0.206); cause median 0.102 (×0.14). Verdict: pass.
Model-sha: 88cfc1210310a0a925844702fe725fa76c880251be79109989a18ebd63c84114
Scope: only the changes since round 2's input (git diff 3b3ec50..HEAD): the two explainers (fund_aid_moved_share, fund_attribution_share), aid_vs_nrc split into aid_counterfactual_vs_nrc × aid_mix_vs_nrc, the summary, the access counterfactual explainer.
Mechanical: audit-model lint 0 high / 0 medium / 1 low (spread, stated in the summary); check.ts passes ("all models valid"). The result moved 0.017 → 0.015 with the programmes model's 0.25 → 0.20; summary's 0.015 and 0.001–0.21 match.

Previous round: #1 resolved (OECD anchor with URL; arithmetic checks: 1% of funding / 56% cut ≈ 1.8% ≈ 2%, range 0.2–4% → 0.4–7%). #2 resolved (1.29 × 0.85 = 1.10, both parts stated with reasons; the mix's 0.85 rests on the 37%/12% education weighting, a judgment with 0.4–1.6 range). #3 accepted as out of scope: the peers are other builders' audited models, and the gap does not change this model's result; reported to the batch owner. #4 resolved (NRC 2025 income US$860m / US$16.6bn ≈ 5%). #5, #6 resolved (summary "about a fifth of cash" with basis; counterfactual explainer says why 20% stays). #7 is an engine matter outside this model.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| (none) | | | | | | | |
