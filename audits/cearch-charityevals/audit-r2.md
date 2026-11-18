# Audit: cearch-charityevals, round 2
Result: 0.006531 uov/$ = 3.27 years of healthy life per 1,000 dollars (combined range 0.28–37.4); cause median 0.112 (×29.2). Verdict: pass once charities/cearch.json is updated (finding 11, a one-line data fix; no high or medium on the model itself).
Model-sha: bf0a5089cc5ab227ff9db265da8a297bdd2b2424138b2c0e374737da5d9b4883
Rules: 0.1.0
Scope: unchanged from round 1 (all of CEARCH's work, October 2022 to May 2025, 2.6 years). The new branch covers the advisory work outside commissions.
Preflight: pass. Two low lines (generated/distributions.json, generated/usage.json stale): run `npx tsx scripts/summaries.ts` before commit.
Previous round: finding 1 resolved. 2 resolved. 3 resolved in the model, not yet in charities/cearch.json (finding 11). 4 resolved. 5 resolved. Lows 6 to 9 resolved; 10 pending the builder's regeneration.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 11 | medium | normalization | charities/cearch.json spending and lines | Still $110,000; the model's `yearly_spend` best is now $120,000 (normalization.md 2.17: spending and lines match the model). | charities/cearch.json `spending.programme` and `lines[0].dollars` = 110000. | Set both to 120000 and word their sources as the model's judged running costs anchored on the archived Charity Entrepreneurship profile. | none on the model |

Resolved, each checked in the model:
- 1: `moved_own_effect` is the formula `@meta.own_effect_share`; explainer and write-up use the shared figure's wording.
- 2: `commission_share_changed` is `@meta.own_effect_share`, explainer says it is the advised-money share.
- 3: `yearly_spend` is best 120,000 (70,000 to 170,000), source the archived profile; the arithmetic ($260,000 over 27 months, about $116,000, or $161,000) and the headcount sentence now agree with the best guess.
- 4: `advised_grantmakers` 4 (observed, Partners page) × `advised_money_per_grantmaker` judgment $50,000 (10,000 to 300,000, anchored on its own $150,000 and $63,000 advised grants) × `@meta.own_effect_share`, over `spend_period_years`, inside `informed_money`. The branch takes the thin `missing_data_adj` through informed_money as asked. Joint-range wise it moves the result only modestly (tornado 3.01 to 4.86).
- 5: `money_per_commission` anchored on Meta Charity Funders' round totals; explainer says a consultation isn't a commission.
- 6 to 9: grantees named in explainer and write-up; the `@next_dollar.cearch` url is the GHPF report; `commissions` leaves out the meta landscape report (4, 2 to 7); `spend_period_years` note gives both dates.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| yearly_spend | web.archive.org/web/20250120145810/https://www.charityentrepreneurship.com/centre-for-exploratory-altruism-research | verified | "SEED GRANT: $100,000", "MONEY FUNDRAISED TO DATE: $262,000"; team figure as in round 1 |
| money_per_commission | forum.effectivealtruism.org/posts/RfwmZa4qb7F3BaLG2 | verified | "$2,043,176" in the second round, "a significant step up from the $686…" (the first round; the explainer's $687,000 is the rounded figure). The $363,000 third-round figure was not re-checked. |
| advised_grantmakers | exploratory-altruism.org/partners/ | verified in round 1 | names unchanged |

## Drivers
Tornado now: `mobiliser_share` (shared, 0.54 to 10.9), `money_per_commission` (judgment with a reference class, 1.68 to 14.1), `@next_dollar.cearch`, `missing_data_discount`, `@meta.own_effect_share` (shared, 1.63 to 4.90). The result's only mechanical finding is far-above (×29.2 the cause median), explained in round 1: a money mover's dollar moved is valued at the global health rankings' charities, and no row of another programme, year or counting rule explains it. Note for the builder (low): MCF's round totals cover its areas, so the reference class is loose; the wide range (50,000 to 2,000,000) reflects it.
