# Audit: norwegian-refugee-council-charityevals, round 3
Result: 2.044e-4 daly/$ = 0.204 years of healthy life per 1,000 dollars (combined range 0.052–0.81). Verdict: pass.
Model-sha: 69dcecf79b4109fd2e766318fa52084ee7405ee56c62ab6eaac5420e7460aa01
Scope: verification of the round 2 fixes only (the access share, the cash line's services chain, the age-share explainer, nor_aid_vs_cash, the country count, the summary and write-up numbers).
Mechanical: lint 0 findings; invariants none; check.ts "all models valid"; the cash line's services rows are gone with no dangling references.
Previous round: #1 resolved (edu_access_share 0.10 (0.05-0.25), anchored on the 560-pupil DRC programme, Burde & Linden's 0.65 and 0.40 quoted, the PRIO Uganda trial noted as unpublished). #2 resolved (csh_transfer_share 0.35-0.71, the rest delivery at nothing, csh_uov and csh_judged_missing_data_adj updated, Doocy & Tappis gone with its row so #5 is moot). #3 resolved (WHO GHE 2021 named as the source of a split). #4 resolved (nor_aid_vs_cash 0.25, 0.08-0.8, anchored before the missing-data step). #6 resolved (39 countries). #7 resolved (edu_evidence_adj).
Result moves: 0.251 → 0.204, matching the predicted effects (access share −11%, services at 0 −8%). The write-up's branch shares (cash about 35%, education about 30%, food security about 15%) and 0.20 agree with the model.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | writeup "How this model was checked" | It says "The result rose from 0.15 to 0.25" and then, three sentences later, "The result is 0.20". The 0.25 was the round 1 figure and is no longer the model's. | Write-up, last paragraph. | Say "The result rose from 0.15 to 0.20" and drop the round-1-only 0.25 (or say "to 0.25 in round 1, then fell to 0.20"). | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| edu_access_gain_sd | https://doi.org/10.1257/app.5.3.27 | verified (round 2) | Girls 0.65 SD, boys 0.40 SD; unchanged source, now quoted correctly. |
| edu_access_share | Board report p. 18 | verified (round 2) | 560 pupils in the DRC programme; no split published; the 10% is a stated judgment with a range. |
| csh_transfer_share | Board report p. 30-31 | verified (round 2) | NOK 1,425m = 71% high end; rapid response and response rooms are cash (p. 31). |
