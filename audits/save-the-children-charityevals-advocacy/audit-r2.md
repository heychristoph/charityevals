# Audit: save-the-children-charityevals-advocacy, round 2
Result: 8.514e-4 uov/$ = 0.43 years of healthy life per 1,000 dollars (combined range 0.06-3.1); cause median 0.338 (x1.26). Verdict: pass.
Model-sha: 26e63abf5acec494b6e90142c857ab9093acf5e637182b0e3ee5a193e4d0ce64
Scope: unchanged from round 1 (advocacy line £13.473m plus Elrha £11.161m, 2025). Verification round: only the changes since round 1 were checked.
Mechanical: lint 0 high / 0 medium / 1 low (spread), invariants none, normalization-audit none, simulation stable.
Previous round: #1 (Elrha humanitarian dollar at 1x cash) resolved: new elrha_aid_vs_cash 0.3 (0.1-1), adv_aid_vs_cash now only the displaced-aid side; elrha_value_per_dollar reads the new row. Sister's relief value is about 0.17x cash, so 0.3 sits above it with a stated reason (research improves the better-targeted health, water and protection spending), range 0.1-1 covers both. #2 (Gavi counterfactual) resolved: anchored on the $3bn gap to the $12bn target, a tenth of it = 3%, with 1% and 8% cases. #3 (other wins) resolved: anchored on 3 of about 9 named campaigns, each other worth a twentieth of a modelled win. #4 (average spend vs year) not resolved by design: still a ranged judgment, explainer says the 2022-23 accounts weren't read; stays medium. #5 resolved: tcl_couple_share observed 0.46 with the press-release quote. #6 resolved as wording only: explainer now cites note 7(a) and says the charity-wide share is used (the step itself unchanged; effect under 2%). #7 resolved: "about a third" and "set against the latest count before it". #8 not changed (low, under 3%).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | sensitivity | adv_average_spend_vs_year | Carried from round 1 #4: 2022-23 accounts still unread; the ratio scales every win. Not new, accepted by the builder with reason, but the fix is still available. | explainer | Read the advocacy line of the 2022-24 accounts, deflate with @cpi, set the ratio to mean real spend over each campaign's years over 2025's. | about +-10% on the wins |
| 2 | low | source | elrha_aid_vs_cash explainer | Cites "MSF's relief distributions about 0.4x" and "SCUK emergencies about 0.2x"; the SCUK figure matches the sister (0.17x), the MSF figure was not re-derived here. | sister summary 0.29 yrs/$1,000 vs cash 1.67 | Check the MSF value per dollar against doctors-without-borders-charityevals and state it, or drop the MSF clause. | none (Elrha is about 6.5% of the result) |
| 3 | low | presentation | writeup, "How this model was checked" | Says "Round 2 checked the changes" before this round existed; fine once this file is committed. Branch shares in the write-up were recomputed and match (Gavi about 70% including the other-wins uplift, N4G about 15%, two-child limit about 8%, Elrha about 6.5%; summary and write-up agree). | computed shares | None. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| tcl_couple_share | savethechildren.org.uk press release 2025 (statement on 40,000 more children) | not re-fetched | quote "just under half (46%) are couple households" matches round 1's fetched check |
| gavi_counterfactual_adj anchor | model's own gavi_pledged_usd row | consistent | $9bn against $12bn target = $3bn gap, a tenth = $0.3bn = 3% |

## Drivers
1. gavi_counterfactual_adj (judgment, now anchored), 2. missing_data_discount (shared slider), 3. uov_per_daly, 4. gavi_attribution_share (judgment, SCUK's 15% of resources), 5. @next_dollar.save_the_children. Best further improvement: a published estimate of advocacy's effect on replenishments for the Gavi share.
