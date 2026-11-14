# Audit: union-of-concerned-scientists-charityevals, round 1

Result: 0.01365 daly/$ = 13.65 years of healthy life per 1,000 dollars (combined range 0.57–326); cause median 1.576 (×8.66). Verdict: pass.

Scope: the Global Security programme ($5,884,339, Form 990 Part III line 4c) and the Center for Science and Democracy ($4,571,442, Schedule O), plus 23.9% of the $319,065 legislative line spread by cost: $10,532,177, $11.93M with overhead (×1.133 = total $49,837,453 / programme $43,987,179), fiscal year to 30 September 2025. The other $33,455,002 (climate and clean energy, clean transportation, food and environment, western states, 76% of legislative) is the climate model. The seven Form 990 programme lines add to $43,987,179 exactly; charities/union-of-concerned-scientists.json `spending` and both `lines` match the accounts.

Mechanical: lint 0/0/0; invariants none; normalization-audit no violation for this model (the 6 INV-4 hits name hias-charityevals-international and usa-for-unhcr-charityevals, not this model); simulation stable (5% 0.106, median 1.0, 95% 12.7 × best guess; the single event misses 0% of draws); check.ts all models valid. `generated/` restored after the run.

Previous round: none (round 1).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | normalization | marginal_vs_past_average (@next_dollar.union_of_concerned_scientists) | The charity's next-dollar figure uses a use factor of 0.6, which is a blend weighted by spending. Its own note gives this model's work a different factor: "the nuclear-weapons and science work is the neutral 0.7". About 76% of spending is climate at 0.55: 0.76 × 0.55 + 0.24 × 0.7 ≈ 0.59, rounded to 0.6. So this model gets a discount meant for the climate work. The write-up repeats the same reasoning ("Its climate work now faces harder ground. The next dollar counts at 36%"). Weighting by value would not save the single blended figure either: the nuclear work carries more than 99.9% of UCS's value, so a dollar given to UCS does about 0.6 × 0.7 of its past average, not 0.36. | facts/next_dollar.json, union_of_concerned_scientists note: "Use 0.6: most of the spending is climate work whose federal ground has turned … the nuclear-weapons and science work is the neutral 0.7." | Split the fact into one figure per model, each from the same room (0.6, 0.4–0.85) and run (1.0, 0.9–1.05). (a) `union_of_concerned_scientists_global_security` = 0.6 × 0.7 × 1.0 = 0.42 (0.4 × 0.5 × 0.9 = 0.18 to 0.85 × 0.9 × 1.05 = 0.80), read by this model's marginal_vs_past_average. (b) `union_of_concerned_scientists` re-based to use 0.55 = 0.33 (0.4 × 0.4 × 0.9 = 0.144 to 0.85 × 0.8 × 1.05 = 0.714) for the climate model. Update the row's explainer ("the same for both its models"), the write-up's "36%" sentence (state 42% and 33%) and the summary's reserves clause. Tell the climate model's auditor, since that model moves −8%. | +16.7% (13.65 → 15.93) |
| 2 | low | double-counting | unmodelled_benefits_adj | The 1% for the Center's election, ballot-design and environmental-justice work is a share of the modelled value, and that value is almost all nuclear. It credits about 4,200 adjusted DALYs, about 400 times what the Center's own public-spending branch earns (gov_uov 145 UoV = 72.5 DALYs before adjustments, about 11 after). The election part of a $4.6M programme would earn tens of DALYs on the site's democracy chain (FairVote, Common Cause, rights-advocacy template). The share is anchored to the wrong base. | outcome_total before the shares 418,962 DALYs × 1% = 4,190; w_gov 72.5 | Drop the democracy part of unmodelled_benefits_adj: best 0.07 (0 to 0.25), with "6% limited nuclear war + 1% radiation compensation". Value the election and justice work, if wanted, as a share of w_gov in the gov branch, not of the total. | −0.9% (13.65 → 13.52) |
| 3 | low | presentation | gov_public_dollars_per_dollar | The explainer argues the work "bear[s] on some billions of public money a year" and cites EPA at about $9 billion and NOAA at about $6 billion. That is about 3,000 public dollars per dollar against $4.6M of work. It then picks 100, which is about $457M a year. Neither budget figure is sourced. | row explainer; source (annual report pp. 4 and 6) has the NOAA quote but no budget figures | Keep 100 (10–1,000) as the shared FAS figure for one chain, and reword: "a rule's or a budget line's share of those budgets that the work actually bears on, a few hundred million dollars a year". Or cite the FY2025 EPA and NOAA enacted budgets if the figures stay. | <0.1% (at 3,000: 13.661) |
| 4 | low | source | @next_dollar.union_of_concerned_scientists (run factor) | "Charity Navigator's four stars" and "a new president in 2024 after an acting year" carry no URL. The other parts of the note (net assets $60.8M → $71.6M, revenue $55.5M, surplus $5.6M, deficit $8.4M in fiscal 2024, contributions $38.2M → $50.8M, 86.6% from individuals) check out against the 990 Part I and the annual report p. 18. | 990 Part I lines 8, 12, 18, 19, 22; annual report p. 18 | Add the Charity Navigator profile URL and the UCS announcement of the president's appointment to the note, with the split of finding 1. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| total_expenses | ucs.org FY25 Form 990 | verified | Part I line 18 and Part IX line 25 (A): 49,837,453 |
| program_expenses | same | verified | Part III line 4e: 43,987,179 |
| gs_line | same | verified | Part III line 4c: 5,884,339; quote matches |
| csd_line | same | verified | Schedule O, Part III line 4d: "EXPENSES $ 4,571,442"; quote matches |
| legislative_line | same | verified | Schedule O: 319,065 (also Schedule C total lobbying 319,065) |
| staff_pay | same | verified | Part I line 15: 35,168,847 |
| gs_risk_share (anchor) | 2025 annual report | verified | p. 12: compensation as "Our biggest victory"; weapons, testing, Golden Dome, Korean dialogue stories; quote matches |
| pol_cost_share / pol_wins | 2025 annual report | verified | p. 12: Nevada resolution "passed unanimously" (non-binding); no treaty or law against nuclear war |
| unmodelled_benefits_adj (RECA) | 2025 annual report | verified | pp. 4 and 12: $8B in compensation, 125,000 more people eligible. A rough check (the $8B at the gov chain's value per dollar, a UCS share of about 10%, counterfactual 0.5, missing data 0.5) gives about 0.6% of the modelled value, against the 1% used |
| gov_public_dollars_per_dollar | 2025 annual report | partly verified | 402 attacks in six months (p. 6), 56 societies (pp. 4 and 6) and the NOAA quote (p. 4) verified; the EPA and NOAA budgets are not in the source (finding 3) |
| nuclear_attribution_share (anchor) | 2025 annual report | verified | p. 18: foundations 13.2% of donor revenue |
| @next_dollar.union_of_concerned_scientists | Form 990 and annual report | verified (numbers) | See finding 4. Use factor reasoning: finding 1 |
| resources: audited statements | ucs.org 2026-03 PDF | reachable | HTTP 200, application/pdf |

The shared @catastrophe figures (XPT chances, Rethink's cut per $1M, death shares) are the site's and were not re-verified here.

## Drivers
1. @catastrophe.nuclear_catastrophe_cut_per_million (shared estimate, Rethink Priorities' placeholder): 2.6–124.
2. $win_years_counted (shared slider): 2.9–42.
3. $missing_data_discount (shared slider; the model is thin on every branch, correctly): 2.7–27.
4. @next_dollar.union_of_concerned_scientists (charity estimate, sourced to the 990): 5.3–29. Its use factor is finding 1.
5. @catastrophe.nuclear_catastrophe_death_share (shared judgment): 5.5–25.

The model's own judgments come next: nuclear_evidence_adj 0.8 (0.35–1.2) and nuclear_counterfactual_adj 0.7 (0.4–0.9). Both are anchored on the Arms Control Association, Ploughshares and FAS, with the same values and ranges, and the anchors are stated. gs_risk_share 0.85 (0.7–0.95) is anchored on the annual report's mix of stories. The model's own ranges alone give 1.5–42, about 30× wide, which is reasonable given the site's shared placeholders. Peers check out: the Arms Control Association's 41.3 × (nuclear share 0.478 / 0.91) × (next dollar 0.36 / 0.56) ≈ 14.0, against 13.65 here, and the rest of the gap is the unmodelled share (8% against 10%). FAS's 1.4 follows from its 3% nuclear share. The result is 8.7× the cause median, under the 10× bar of INV-15. The Center's 44% of cost adds 0.004% of the value through the FAS government-capacity chain, the same chain as FAS. What would most improve the model: a sourced split of Global Security spending (risk work against compensation work), and the per-model next-dollar figure of finding 1.

**Verdict: pass (no high findings; one medium, +17%, to fix with the shared next-dollar fact).**

Model-sha: e5e96fb29decf4147a586f383ad3559173173d140cbc758878a84da17ddda9fe
