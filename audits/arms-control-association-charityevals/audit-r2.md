# Audit: arms-control-association-charityevals, round 2
Result: 0.04134 daly/$ = 41.3 years of healthy life per 1,000 dollars, unchanged from round 1 (and unchanged after main was merged in). Verdict: pass.
Scope: verification round. Only the changes since round 1 (`git diff 659a741 6eb8f71` of the model and the write-up) and the six round-1 findings; the rest of the model was passed in round 1 and is not re-audited.
Mechanical: audit-model lint 0 findings (dalys_per_donor_dollar 0.04134); check.ts all models valid; simulation stable (5% 0.127×, median 1.0×, 95% 12.4× of the best guess; one single event, misses 0%); normalization-audit 0 violations in every invariant (generated/ restored).

Previous round:
1. Bio work takes the nuclear adjustments, unsaid: resolved. evidence_adj now ends "The 2% on biological weapons is the same research and journalism, so one figure for both areas"; counterfactual_adj ends "One figure for the nuclear and biological work, which is the same kind of work". Values unchanged.
2. Ploughshares not reading this model live: resolved by wording, and the wording settles it. The two models ask the same questions with the same figures (round 1: 0.207 vs 0.203 of a typical nuclear dollar, about -0.1% on Ploughshares' result, a $178,000 grant out of $3.1M), so a live read would add a cross-model branch and move nothing. Ploughshares' nuclear_cost_share explainer now says the one grantee with a model, the Arms Control Association ($178,000), "is worth the same within 2% and is valued with the rest"; its write-up says the same. The claim matches the figures.
3. "Same share" and "one $178,000 grant": resolved. The explainer says "Ploughshares' two grants ($178,000 ...)" and "credits its grants by the same rule (gr_attribution_share_shared 0.95, averaged over its 46 grantees)"; the write-up says "two grants ($178,000)".
4. Unpaid time "our rough count" without a count: resolved. Worked count: 40 pieces × 30 hours × $75 = $90,000 (exact); 27 scientists, about two days each plus district work, $50,000; retreat of more than 50 people for two days, $55,000; 18 volunteers (990 Part I line 6 TotalVolunteersCnt = 18, re-checked in the XML), $70,000. Sum $265,000, stated as "about $0.25M". Share of resources 1.69 / (1.69 + 0.25) = 0.871, stated "0.87, so 0.9". Arithmetic holds (see finding 1 for a rounding nit). The NTI partnership at the retreat is not named separately but its staff are inside "partners at its retreat". Value 0.9 (0.75 to 1) kept; the count supports it.
5. Reason for being above NTI: resolved. Summary and write-up now say it holds under nine months of reserves, so the next dollar counts for more.
6. Policy-win absence: resolved. pol_cost_share and pol_wins cite the Association's December 2025 year-end update; the Central Asian protocol clause is gone. The quote is on the page ("ACA is at the forefront of the campaign to defend the global nuclear test moratorium ..."), and the page describes campaigns under way (test moratorium, New START, Iran) and no win in 2025.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | attribution_share_shared | The four worked items add to $265,000, the text says "about $0.25M" and computes 0.87; with $265,000 the share is 0.865. Both round to 0.9, and the shares of the items (two days at $75 an hour for 27 people is $32,000 before district work) are rough. | $90,000 + $50,000 + $55,000 + $70,000 = $265,000; 1.69 / (1.69 + 0.265) = 0.865 | Write "about $0.27M" and "0.86, so 0.9", or leave as is. | none (0.9 kept) |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| pol_cost_share, pol_wins | https://www.armscontrol.org/blog/2025-12-17/year-ahead-could-be-even-tougher | verified | quote present as the start of a longer sentence ("... global nuclear test moratorium and the 1996 Comprehensive Test Ban Treaty"); no 2025 win described; campaigns on the test moratorium, New START and Iran under way |
| attribution_share_shared (18 volunteers) | /private/tmp/claude-501/-Users-christoph-repos-charityevals/bb44fb39-21b4-46d5-b849-26e1d7a49e7d/scratchpad/arms-control-association/dl/202621349349307892_public.xml | verified | TotalVolunteersCnt 18 (Part I line 6) |
| attribution_share_shared ($178,000, 46 grantees) | Ploughshares annual report 2025 and its model | verified in round 1 | two grants $125,000 + $53,000; unchanged since |
| Ploughshares nuclear_cost_share wording | models/catastrophic-risk/ploughshares-fund-charityevals.json, writeups/ploughshares-fund-charityevals.md | verified | "worth the same within 2%" matches 0.207 vs 0.203 |

## Drivers
Unchanged from round 1 (no value moved): nuclear catastrophe cut per million, years counted, missing-data discount, nuclear death share, evidence_adj.

Verdict: pass (no high or medium finding; one low)
Model-sha: 936a85ebc60f0c4c96586a8fdd7f72ab4a6c717a397fc51d5ec73ac774989230
