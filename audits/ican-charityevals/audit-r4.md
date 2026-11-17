# Audit: ican-charityevals, round 4
Result: 0.008645 daly/$ = 8.65 years of healthy life per 1,000 dollars at mobiliser_share 100% (combined range 0.22–343; model's own ranges 0.12–798); cause median not re-run (scoped round). Verdict: pass (one low finding).
Model-sha: 047ee3949ee9c883a3b9e59d1a32b44097741a15469de23992a24ae5be9ebdde
Scope: scoped verification of credit step 5 (rule 2.24): pol_attribution_share_shared re-judged 0.25 (0.1-0.5) -> 0.4 (0.2-0.65), and the classes on the five used shares. Nothing else re-audited.
Preflight: pass (only the out-of-date distributions line, ignored as instructed)
Previous round: round 3 had no open high or medium; its one low (tpnw_vs_typical wording) was not part of this change and is not re-checked.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | pol_attribution_share_shared | The denominator's others ("perhaps $1.5-2.5 million" in all, so $0.75-1.75 million for the Red Cross movement, the four core states' diplomats and partners' national campaigns) have no document behind them; only ICAN's $0.75 million is sourced (0.3 × cost_total, about $2.5M). The report p. 9 does say ICAN worked "closely with governments, parliaments, the International Committee of the Red Cross, and local partners" on the 2024 ratifications, which supports who is counted but not how much. | ICAN AR 2024 p. 9 (fetched); arithmetic 0.75/2.0 = 0.375, 0.75/2.5 = 0.30, 0.75/1.15 = 0.65 | In the explainer, after "Our rough count", add "(the report, p. 9, names governments, the Red Cross and local partners as working beside ICAN; the others' amounts are our judgment)". No value change. | none |

Checks on the listed rows:
1. Denominator. The new count holds ICAN, the Red Cross movement, the core states' diplomats (Austria, Mexico, Ireland, New Zealand) and partners' national campaigns; the ratifying governments' own work (foreign ministries, parliaments' committees and votes) is out and sits under the mobiliser's share. The core states are rightly kept: they promote the treaty to other states, they are not the four ratifying governments, and they committed this work independently of ICAN's 2024 programme (co-funders by the rule's test). Austria's grant to ICAN (AR 2024 donor list) is inside ICAN's $0.75 million; its diplomats' time is separate, so nothing is counted twice. No co-advocate named in the old text was dropped; the only drop is the adopters, with the reason stated.
2. Facts. ICAN's universalisation spending: pol_cost_share 0.3 × cost_total (about $2.5M) = $0.75M, matches the explainer; the accounts line "EIF/ Universalisation" CHF 69,155 and the four 2024 states parties (Indonesia, São Tomé and Príncipe, Sierra Leone, Solomon Islands) are verified in the AR 2024. The core group's promotion work: no primary source reached (the UN document for the 2022 Vienna Action Plan returned "not found"; an icanw.org page 404), so that part rests on the explainer alone; it describes who does the work and is not a number.
3. Value. 0.4 sits just above the explainer's midpoint 0.375 (0.75 over 2.0); the range 0.2-0.65 spans 0.75 over 3.75 to 0.75 over 1.15. A defensible best guess, neither conservative nor optimistic, and consistent with the nuclear branch's 0.55 (ICAN $1.6M against $1-1.5M of partners).
4. Classes. pol = "win"; nuclear, ai, bio, fb = "research". Each used share is `<branch>_attribution_share_shared * mobiliser_share`, and no other row in the model reads mobiliser_share, so the slider is taken once per branch; the aggregate attribution_share only weights the branch products. Tornado: mobiliser_share 5% gives 0.43, 100% gives 8.65. The rule's netting of mobilised resources' costs has nothing to bind here: the model has no cost row for the ratifying governments, and their ratification costs are negligible against the benefit.
5. Counterfactual. "Would it have happened anyway" stays in pol_counterfactual_adj (0.6, 0.3-0.85; its explainer sends others' lobbying to the share row) and in years_of_impact / win_years_counted; pol_p_success is 1. The change touches only the share; nothing is lost or counted twice.
6. Consistent text. The model's summary, pol_p_success and the other rows quote no old share or figure. The write-up's "40% of what remains" matches. Typed numbers made stale by the change were corrected in writeups/ican-charityevals.md (below).

Writeup edits (writeups/ican-charityevals.md), each from this run's audit-model output:
- Summary: plausible range "about 0.27 to about 220" -> "about 0.22 to about 340".
- Drivers: 0.1% discount rate "about 26" -> "about 30"; "three-quarters of the result and the new states parties a quarter" -> "two-thirds ... a third" (the new-states branch is now about 32%).
- Uncertainties: nuclear dollar swing "1.5 to 69" -> "1.7 to 78"; treaty swing "6 to 26" -> "6 to 37"; campaign-versus-typical swing "3 to 20" -> "4 to 22".

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| pol_attribution_share_shared / pol_cost_share | https://assets.nationbuilder.com/ican/pages/9215/attachments/original/1755063572/ICAN_2024_AR_final.pdf | verified | p. 9 co-working with governments, parliaments, ICRC, partners; four new parties; universalisation line CHF 69,155; Austria among donors |
| core states' promotion work | UN doc n2238492 (Vienna Action Plan); icanw.org/vienna_action_plan | unreachable | not found / 404; no second source reached |

## Drivers
The result's top inputs (tornado): the nuclear cut per million (estimate), mobiliser_share (judgment slider), win_years_counted, missing_data_discount and tpnw_vs_typical (judgments). The changed share is a judgment with a sourced ICAN anchor and an unsourced others' side.
