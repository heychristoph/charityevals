# Audit round 3 (verification): Redwood Research (charityevals)

Scope: the changes of commit 1378cc9 against round 2's findings. Tools run: `check.ts` (all models valid; Redwood 0.052 years/$1k, range 3.8e-7 to 48704), `audit-model.ts` (no high or medium finding; bottom line 0.05203 years/$1k), `simulation-check.ts` (stable: 5% 0.0672, 95% 9.81 times the best guess, one tenfold input, ai_misuse_cost_share 0..0.15 moves it x1 / x13.2), `normalization-audit.ts` (no violations; `generated` restored).

## High
None.

## Medium
None.

## Low

L1. Next-dollar "1.15 times" is a little low. At the model's own values a research dollar's credit per dollar is research_evidence_adj x research_partner_share = 1.2 x 0.65 = 0.78; the programme average is evidence_adj x attribution_share = 0.9647 x 0.6651 = 0.6417 (computed from spend_research 1,967,404, cash 250,000, leasehold 429,955). The ratio is 1.22, not 1.15. Using 1.22 gives 0.5 x 0.7 x 1.22 x 0.95 = 0.41 (range 0.61 to 1.0 capped), against the 0.38 used (0.8 as the use factor, 0.58 to 1.0). The difference is inside the stated range and below the factor's own uncertainty. Fix (optional): say "about 1.2 times" and either keep 0.8 (rounded down) or use 0.85 / 0.61.

L2. The attribution_share_shared explainer says "about 0.66"; the formula gives 0.665 (1,698,621 / 2,553,881 = 0.6651), and the write-up table says 0.67. Make the explainer "about 0.67".

## Checks of each change

- M1 (next dollar 0.8, figure 0.38, 0.14 to 0.84): arithmetic correct (0.5 x 0.8 x 0.95 = 0.38; 0.3 x 0.58 x 0.8 = 0.139; 0.8 x 1.0 x 1.05 = 0.84). The reasoning (Constellation transfers of $679,955 won't recur) is sound and sourced to the 990. The model reads @next_dollar.redwood_research through marginal_vs_past_average; the audit tornado shows 0.14 to 0.84 moving the result 0.019 to 0.115. The summary and write-up say 38%. See L1 for the 1.15.
- M2 (misuse share high end kept at 0.15, re-argued): a sound alternative fix. The audit's concern was that 1 of 4 outputs = 25% is the natural high; the builder instead argues the password-locked paper is a smaller project (four authors, two Redwood's) than the control work or alignment faking, so its share of research spending is below its share by count. That is a judgment with a source (arXiv author list), cited as such, and it is not chosen merely to avoid the simulation flag: the base reasoning is independent and stated. The headcount-to-spend inference is thin, but the row is a judgment with 0 as the default and the explainer states what 25% would do, and the summary and write-up flag this row as a top swing (x13). Accepted. Source block now points at the paper, fine. Write-up "about 15% of the research" gives 0.69, matching the tornado (0.6862).
- L3 (attribution weighting): formula (spend_research x research_evidence_adj x research_partner_share + spend_grant_cash x grant_evidence_adj x grant_partner_share + spend_grant_leasehold x leasehold_evidence_adj x grant_partner_share) / (program_spend x evidence_adj) has no cycle (evidence_adj does not read attribution_share_shared; attribution_share reads only it). Arithmetic: 0.6651, versus the old 0.7014, a fall of 5.2%, matching the write-up's "lowering the result by 5%". The product evidence_adj x attribution_share now equals the sum of each part's own credit, which is the intent. Write-up table 0.67 correct.
- L4: the GPT-5 resource is gone from the resources list; nothing else references it.
- L5: wording changes (staff_pay now cites Part VII section B; switched-off branch rows name the branch's own zero input; control safety case "written in 2024, posted in January 2025") are consistent across rows.
- L7: the CAIS INV-14 waiver for fb_work_years = 5 now says it is the family's default live in this model only, with the other copies placeholders in switched-off branches. Accurate and the normalization audit reports no violation.
- Numbers: summary (0.05; 0.003 to 0.5 in 90% of draws: 0.0672 x 0.0520 = 0.0035, 9.81 x 0.0520 = 0.51; x13 for misuse; 38%) and write-up (0.007 to 0.35; 0.014 to 0.44; 0.69; 33% to 38%; 0.67) match audit-model.ts and the simulation.

Verdict: pass
Model-sha: 928bf39c45c3ed67e0e9f524f9fa7cfb6ead52347b7d7485b39ed9e9ad375918
