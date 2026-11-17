# Mobiliser share: adversarial review and implementation plan (17 Nov 2026)

Read-only review of `mobiliser-share-decisions.md` against the data-model-migration worktree (494 models, 396 with a
comparable headline, 215 ranked charities). Nothing in the repo was changed. Scripts and outputs:
`/private/tmp/claude-501/-Users-christoph-repos-charityevals/bb44fb39-21b4-46d5-b849-26e1d7a49e7d/scratchpad/fable-review/`
(`sanity.ts` patches rows in memory and builds the library; `models-0.3-*.tsv`, `charities-0.3-naive.tsv` are its tables;
`attr2.py`, `shapes.py`, `census.py`, `imports.py` count the patterns). Headlines are healthy years per $1,000, our view, defaults.
The sanity run is an approximation: imports were tagged from a hand list, and no single hook catches every branch (problem 5).

## Part 1. Review

Verdict: the core idea holds (two cuts, one slider, coalitions sharing s). It does not yet hold together at the edges.
Four things must be settled before any model is touched: the boundary between a co-funder and a mobilised party (1),
credit shares that already count the mobilised party (2), compounding (3), and costs (4). Most serious first.

**1. The boundary is undefined, and imports sit on the wrong side of it.** "Every resource another party commits
because of the organisation" also describes governments that deliver after technical assistance, health systems that
act on a trial, and mills that fortify flour. Our own builds would take s; the same work imported from an evaluator
would not, if imports are left as the decisions imply. At s = 30% the top of the rankings is then Ubongo, Helen
Keller, Jhpiego, Malaria Consortium, Pure Earth, SickKids, Development Media International. Flips that make no sense:

| Import left unscaled | Same kind of work, our build (falls) |
|---|---|
| Pure Earth, GiveWell's estimate (lead exposure): 35.3 | LEEP: 15.2 → 4.56 |
| Iodine Global Network, GiveWell's estimate (its ranked figure): 6.48 | the same charity, our build: 2.09 → 0.63 |
| SickKids F-35 milk trial (pure research): 33.9, rank 6 | Rethink Priorities global health: 0.294 → 0.079 |
| Teaching at the Right Level Africa (helps governments): 17.2 | Central Square Foundation: 0.85 → 0.25 |
| WHO guideline review (GiveWell grant): 22.7; Evidence Action: 14.6 | Center for Global Development: 1.67 → 0.50 |

Counts by text scan (to be classified by hand): of GiveWell's 158 imports about 28 are technical assistance or policy
and about 34 research (many are unranked value-of-information sheets); plus ACE 17 (all campaigns), Ambitious Impact
5 policy and 2 money movers, LEEP's own 2, HLI's Pure Earth 2, SoGive's Breast Cancer Now. About 55 to 70 imports
should take s. "Direct delivery doesn't move" (decision 5) is true only of real delivery.

Related gaps of the same kind:
- **GiveWell's leverage** (80 models) is mobilisation by definition (government money crowded in by the grant) and is
  credited in full, net of what that money would have done. Small for the Top Charities (AMF's governments pay about
  6%), large for technical assistance. **Matching funds** exist only in GiveWell's UNFPA sheet, through that leverage.
  Our own `leverage_funging_adj` above 1 (Good Food Institute, 1.3) is the same thing. None takes s.
- **Research adoption** is on the decisions' list only as "a funder's grants". All 26 catastrophic-risk and 5
  medical-research models end in other parties' action (labs, governments, health systems). "Every policy win"
  applied to them wholesale moves Arms Control Association 41.3 → 12.4 and ALLFED 25.7 → 7.7. That needs a stated rule.
- **Direct legal services** (exonerations, representation, bail) sit in the rights-advocacy template next to policy
  wins. They are delivery: a branch-level class is needed.
- **Volunteers, donated goods, beneficiaries' time, partners' inputs** are "committed because of the organisation"
  too. Today they are pro rata (Convention 2) or ignored (imports). Read literally, a volunteer-heavy charity would rise.

Proposed boundary, one sentence each, for the owner to confirm:
- *Co-funder (pro rata, as today)*: resources that flow into the organisation's own activity or into a delivery it
  co-pays: cash, staff's forgone pay, volunteers, donated goods, partners' inputs, pass-through grants.
- *Mobilised (s)*: resources another party spends on its own activity, decided because of the organisation: a gift to
  another charity, a funder's grant, a career, a government programme or its enforcement, a company's compliance,
  adoption of research.
- *Never a party*: beneficiaries' own time and money in using the service.
- *Mixed* (technical assistance): own share of the delivery cost + s × the rest. Pure mobilisers are the limit (own share ≈ 0).

**2. Double cut: about 40 or more credit shares already count the mobilised party pro rata.** Convention 2's
`attribution_share` is meant to be the split among co-advocates. A regex over the 504 credit rows of the policy-type
templates finds at least 38 whose explainer puts the adopter's or implementer's own resources in the denominator
(the true number is probably 60 to 100). Examples: LEEP 0.5 ("ministries' staff time drafting and enforcing the
rules, manufacturers' chemists"); ICAN 0.25 ("the governments' own work"); The Nature Conservancy 0.05 to 0.25 ("Pará's
state government designs, legislates and enforces it"); Iodine Global Network 0.3 ("producers' own spending on
mixers"); Council on Strategic Risks and Federation of American Scientists 0.7 ("agencies' own staff carry out the
changes"); CEPI 0.7; METR 0.7; Tax Justice Network's `movement_credit` 0.15 to 0.25 (civil society against
governments). That is the pure pro-rata rule the owner rejected, already in the models. Multiplying by s cuts these
parties twice (TNC's rule: 0.10 × 0.3 = 3%). Each such share must be re-judged as "share among those who campaigned
or delivered alongside it", with the adopter left to s.

The same double cut exists with **`$resource_shares` on**:
- `META_DONOR_COST_SHARE_FORMULA` puts donors' new money in the denominator. Giving What We Can with the toggle on
  is ×0.18 today; with s it would be ×0.054. Remove `moved_per_dollar * new_money_share` from the formula (25 models
  plus Ambitious Impact's and GiveWell's own versions): the toggle then adds only staff's forgone pay for money movers.
- Animal Policy International's `charity_cost_share` (charity ÷ charity + government, about 14%), LEEP 2024's
  government cost in the denominator, The Life You Can Save imports' `cost_multiplier`, and GiveWell's "all
  contributors' spending" each share with the mobilised government when the toggle is on.
- Rule to write down: a party is either in a pro-rata denominator or under s, never both.

Not double counted (checked): `own_effect_share`, `new_money_share`, `career_counterfactual_share`,
`founding_counterfactual_share`, `p_success`, `counterfactual_adj` and `$win_years_counted` are all "would it have
happened anyway". Staff's forgone pay is the employer's co-funding; a career organisation's s is on another book.

**3. Chains do compound. Decision 4's claim is false once wins take s.** No money mover reads another money mover, but
they read advocacy charities, which now carry s themselves. A second mechanism adds to it: `prior_dollar_value`
(where shifted money would have gone) is a cause average that includes unscaled delivery charities, so the gain
V − V_before shrinks by more than s.

| Model | Today | Meta rows only | With wins too | Ratio |
|---|---|---|---|---|
| Giving What We Can | 55.4 | 16.6 | 15.8 | 0.285 |
| Effektiv Spenden | 22.4 | 6.73 | 6.39 | 0.285 |
| CEARCH; One for the World | 54.5; 12.8 | 16.3; 3.85 | 16.3; 3.85 | 0.30 |
| Rethink Priorities, animals | 0.000101 | 0.0000304 | 0.0000169 | 0.17 |
| 80,000 Hours | 1.31 | 0.39 | 0.20 | 0.155 |
| Project Drawdown | 0.00158 | 0.00079 | 0.00024 | 0.15 |
| Longview | 1.34 | 0.40 | 0.16 | 0.12 |
| Animal Charity Evaluators (ours) | 0.00110 | 0.00033 | 0.000029 | 0.026 |
| Ambitious Impact (ours) | 10.9 | 4.57 | 4.46 | 0.41 |
| Founders Pledge (ours) | 7.05 | 3.79 | 3.71 | 0.53 |
| GiveWell (ours) | 36.0 | 28.9 | 28.9 | 0.80 |

Compounding is internally consistent (the advocacy charity's s × G is split again between a person or donor and
whoever mobilised them; the parts still sum to G). But the owner should confirm it knowingly: meta charities with
advocacy destinations fall to 3% to 17%, not 30%. GiveWell, Founders Pledge and Ambitious Impact fall less because
much of their next dollar is passed on as grants (`next_dollar_freed_for_grants`, `next_dollar_to_grants`): the
donor's own money, which rightly takes no s. GiveWell (28.9) then sits above Giving What We Can (15.8).

**4. Costs: s must scale the net, and the "never rises" test is wrong as stated.**
- Compliance costs (2.21) and public money (2.23) are charged to the charity in full today. If s lands on benefits
  only, results flip sign. With s on `<b>_total_adj`: Clean Air Task Force 0.0035 → −0.0006, Environmental Defense
  Fund 0.0010 → −0.0001, Earthjustice health 0.0040 → −0.0019, THL's grants 0.00021 → −0.00007. With s on
  `<b>_attribution_share` those models scale cleanly (the cost rows read that row) but others don't move at all.
  The cost of a mobilised resource is part of the good done with it: credit = s × (benefit − cost). This is the
  decisions' own "redirected money earns only V − V0".
- Ambitious Impact's `egi_costs_value` (running costs of the giving organisations it launched) is such a cost and
  must take s too (0.41 → 0.44).
- Net-harm models move toward zero as s falls (Carbon180 −0.0030 → −0.0009, Evergreen −0.0064 → −0.0019). Blame is
  shared like credit; consistent, and they still rank last.
- A model with a direct positive part and a net-harmful mobilised part rises when s falls. So "lowering s never raises
  a positive result" cannot be an invariant. The correct one is per branch: halving s leaves a branch's credited value
  unchanged or exactly halves it (never ×0.25, never a sign change), live reads of other models aside.

**5. There is no uniform hook for wins.** Our builds have 500 branch attribution rows in three shapes: 163 are
`= <b>_attribution_share_shared`, 120 are compound formulas, 217 are plain inputs (catastrophic-risk 78,
humanitarian 68). With s on the used share (`<b>_attribution_share`), 14 tagged models don't move at all (ALLFED,
1Day Sooner, Prison Policy Initiative, Save the Children's advocacy and others: their branch shares are inputs or
reach the output through an average row). With s on `<b>_total_adj` they move, but cost rows are left out (problem 4).
Shared word-for-word formulas work for money, changed spending and careers (3 formulas); wins need a per-branch row
plus a behavioural invariant.

**6. s = 0 breaks about 18 models.** Shares of a zero total become 0/0 (The Humane League's species split, Giving
What We Can, 80,000 Hours, Ambitious Impact, Longview and others return NaN). The slider's floor should be 5%. And
"close to 0 is pure pro-rata" is loose: at 0 a mobiliser gets nothing, less than its dollar share.

**7. Wording and what the number means.** The decisions say "default credit is counterfactual" and "the default is
30%". Both cannot be the site's default. With s < 1 the headline of a mobiliser is no longer "what your next $1,000
causes", while a delivery charity's still is (GiveWell's crowded-in money included). Nor do shares add up: a reader's
dollar to AMF shows V, and Giving What We Can is credited s × V for a pledger's same dollar. The method text must say
"a judgment about credit", and must not say "adds up". The anchors (OECD 50%, PCAF 33%) are rules for arrangers of
finance; no standard gives a number for an advocacy win or a career change, so one s for all is the site's judgment.

**8. Several mobilisers on one dollar (decision 4): modelable for a few links only.**
- Already done for campaign coalitions (`attribution_share` among co-advocates, then × s) and once for money (The
  Life You Can Save's `rrf_credit_share`, 0.75, a fund run with Founders Pledge).
- Data exists for Giving What We Can's gifts through GiveWell's funds (`gwwc_moved_2023_24_global_health_funds`),
  Effektiv Spenden's GiveWell-advised fund, and Ambitious Impact's giving organisations (two mobilisers by
  construction). None for One for the World, Longview, The Life You Can Save's other channels or GiveWell's side.
- Each organisation's own-effect survey already nets substitutes ("I'd have given anyway because of X"). What
  remains is the complement case, where both were needed.
- Least-bad approximation: where a source gives the share of an organisation's moved dollars that another mobiliser
  also claims, split s equally on that share (`money_moved` × (1 − overlap/2), a reach row like `rrf_credit_share`).
  Elsewhere 1, with one line in normalization.md naming it a known over-count.

**9. Uneven netting of redirected public money.** Money moved nets V_before, climate public money its payers' cost
(2.23), aid won the displaced aid (2.20). Health and other wins that redirect budgets net nothing. Out of scope; log it.

**10. Evaluator views, simulation, MCP, links.**
- Evaluator view: INV-5 watches only the evaluator's layer; a read of s in one of our rows without a pin would move
  the evaluator-view headline. Every import that reads s pins `mobiliser_share: 1` in `evaluator.assumptions`
  (INV-5b then requires it to be read). CEARCH's evaluator view reads V live; pin it too.
- Risk layer: simulations hold the reader's values fixed, so a pure mobiliser's distribution only rescales. Mixed
  models change shape: `generated/distributions.json` is regenerated when the default flips.
- MCP results are precomputed per value set and rebuilt by the build. No preset names a credit value: all inherit 30%.
- Share links and saved values carry only changed ids: old links (and `set=default`) show the new numbers.
- Rankings: 8 of today's top 25 are mobilisers. Giving What We Can goes from 1 to 20, CEARCH 2 to 19, Arms Control
  Association 4 to 23; Ploughshares, Nuclear Threat Initiative, Effektiv Spenden, the Bulletin and ALLFED leave the
  top 25 (`charities-0.3-naive.tsv`; ALLFED is unmoved in that table only because the hook missed it).

**What holds.** The two cuts (deadweight, then s) are distinct in every pattern checked. s × (V − V_before) matches
2.20, 2.21 and 2.23. Pass-through grants are co-funding (THL's `owa_grant / owa_resources`), then s once for the win.
s = 1 reproduces today exactly, provided the toggle-on fix (problem 2) is a separate step.

### Decisions the owner must revisit
1. The boundary rule (problem 1): accept the four classes, and with them that about 55 to 70 imports and GiveWell's
   technical-assistance grants take s. Without this, do not ship: the rankings would be inconsistent in a visible way.
2. Research adoption and the catastrophic-risk family: s on all of it, or only where others' spending is the main cost.
3. Compounding (problem 3): accept s at every link (recommended; correct the decisions' text), or read destinations at s = 1.
4. Slider floor 5% instead of 0.
5. Mixed delivery (GiveWell leverage, technical assistance): the blended formula now, or a binary class now and the
   blend later. Recommended: binary now (own spending under about 20% of delivery cost → s), blend deferred and logged.
6. The "counterfactual by default" sentence.

## Part 2. Implementation plan

Principle for a green CI and valid receipts: **wire everything with the default at 100%, then flip the default.**
Audit receipts fingerprint a model's content, not the assumptions file. With s = 1 no headline moves, so
`scripts/rule-change.ts` re-stamps every receipt mechanically. The flip to 30% changes no model file, so no receipt
breaks, although about 130 headlines move 3.3× or more: its before/after table is the ">2× moves, listed for the
owner" of the audit-budget rule. Scoped (sonnet) verification goes only where a judgment changed (steps 5 to 7).

### The assumption
- `assumptions/default.json`, section `accounting`: id `mobiliser_share`, format `percent`, kind `judgment`,
  value `{ low: 0.05, best: 1 → 0.3 at step 9, high: 1 }`. Label: "A charity gets … % of the good done with money,
  work or budgets it brings in". Technical: "Mobiliser's share of the good done with resources another party commits
  because of the organisation".
- Explainer (79 words): "Fundraisers, advisers and campaigners do good through others: donors who give, people who
  change jobs, governments and companies that act. This is the share of that good credited to the charity; the rest
  stays with those who paid or did the work. At 100% the charity gets all of it, as most evaluators count. Near 0% it
  gets almost none, so no fundraiser would be worth funding. The default, 30%, is near what finance standards give
  arrangers (33–50%)." The `accounting` group's explainer is rewritten to cover both settings in one sentence.

### Steps
| # | Step | Files | Models | Effort | Parallel |
|---|---|---|---|---|---|
| 0 | Owner confirms the six points above; write normalization.md 2.24 (the boundary, the two cuts, costs, compounding, overlap) | docs/normalization.md | 0 | 0.5 day | – |
| 1 | Engine: assumption at 1.0, shared formulas, invariants, lint, tests | below | 0 | 1 day | with 2 |
| 2 | Templates and skills text | below | 0 | 0.5 day | with 1 |
| 3 | Money, changed spending, careers, incubation | script | 31 | 0.5 day | with 4, 7 |
| 4 | Win branches in our builds: add the row, fix cost rows | script + hand fixes | about 105 models, about 350 branches | 1.5 days | by template, 5 agents |
| 5 | Classify branches (win, research adoption, delivery) | models | same 105 | 1 day | by template |
| 6 | Re-judge credit shares that count the adopter | models, explainers | about 40 models, 60–100 rows | 1.5–2 days | per model |
| 7 | Imports: classify, add our row and the pin; converters keep it | models, scripts | about 250 read, 55–70 changed | 1.5 days | by evaluator |
| 8 | Toggle-on clean-up; overlap rows where data exists | moved-money.ts, 30 models | 30 + 4 | 1 day | after 3 |
| 9 | Flip the default to 0.3; regenerate; text | assumptions, generated, docs, pages | 0 files, about 130 headlines | 1 day | – |
| 10 | Scoped verifications (sonnet) of steps 5–7 | audits/ | about 50–70 | 0.5 day wall-clock | fully |

About 9 to 10 agent-days; 4 to 5 calendar days with steps 3, 4 and 7 in parallel after step 1.

**Step 1, engine.**
- `src/engine/moved-money.ts`:
  - A shared row `mobiliser_share = $mobiliser_share` (kind ours), so formulas read the row.
  - `moved_dollar_net_value = mobiliser_share * (new_money_share * moved_dollar_value + (1 - new_money_share) * (moved_dollar_value - prior_dollar_value))`.
  - `shifted_dollar_value = mobiliser_share * (moved_dollar_value - prior_dollar_value)`; `informed_money_value`
    reads it, unchanged. Set rows follow through `destinationSetRows` (which must not prefix `mobiliser_share`).
  - `CAREER_CHANGE_FORMULA`: the same product `* mobiliser_share`. The three rows' labels say "at the mobiliser's share".
  - Step 8, not now: `META_DONOR_COST_SHARE_FORMULA = "1 / (1 + if($resource_shares, salary_sacrifice, 0))"`.
- `src/engine/invariants.ts`:
  - INV-12: the new formulas word for word; a model already stating counterfactual dollars (CEARCH) must multiply by
    `mobiliser_share`; a cost row valued at `prior_dollar_value` must too; after step 8, `donor_cost_share` reads no money moved.
  - New INV-22 "mobilised resources take the mobiliser's share, once": (a) reach: every model (not variants) with a
    row on the path about money moved, changed spending, careers, `p_success` or `$win_years_counted` reads
    `$mobiliser_share` on the path, or carries a branch class that says why not; (b) once: with every `#` read held
    fixed, halving s leaves each branch total unchanged or halves it exactly (catches cost rows left out, double
    application, sign changes); (c) a model with an evaluator view that reads it pins it to 1, and the evaluator
    headline does not move with s; (d) a model with no mobilised branch does not move with s; (e) no NaN at the low end.
  - INV-10: money movers stay exempt from shape checks; add s to the list they may move with.
- `src/engine/lint.ts`, `src/engine/templates.ts`: canonical row `mobiliser_share`; a per-branch class (`win`,
  `research`, `delivery`), required in the policy-type families. `src/engine/preflight.ts`: a `win` or `research`
  branch has its cost rows (`*_compliance_uov`, `*_public_cost_uov`) downstream of the branch's used share.
- Tests: INV-22 unit cases in `normalization.test.ts` (a cost row left out, s applied twice, an unpinned import, a
  delivery model that moves). A new `mobiliser-share.test.ts`: s = 1 equals a stored snapshot of today's 396
  headlines (until step 9; then a grid test that branches with non-negative net value never rise as s falls, with
  an allowlist of net-harm branches).

**Step 2, text for builders.** `build-cea/references/templates.md`: glossary line, shared-row table, and Convention 2
rewritten (the share is among those who paid for or did the same work; whoever adopts or carries out the result is
under the mobiliser's share, never in the denominator; a win's costs take the same share). `families/` (rights-advocacy,
catastrophic-risk, corporate-campaign, climate, medical-research, conservation, companion-animals): one sentence each
on which branches are wins. The 13 skeletons through `scripts/gen-templates.py`. `import-cea/SKILL.md` and `audit-cea`:
classify the import, our row and the pin, the double-cut check. Stay within the skills' word budget.

**Step 3, money, changed spending, careers, incubation (31 models).** `scripts/moved-money.py` rewrites the shared
rows. By hand: CEARCH's bridge (`uov_per_dollar`), Ambitious Impact's `egi_costs_value`, and a check that the
pass-through terms (`next_dollar_freed_for_grants`, `next_dollar_to_grants`) read no s. Counts: money moved 19
(17 ours, CEARCH, Better Futures Guide), changed spending 9, careers 15 live, incubation 1.

**Step 4, win branches (about 105 models).** One script, three shapes: (a) append `* mobiliser_share` to
`<b>_attribution_share = <b>_attribution_share_shared` (163 rows); (b) rename a compound formula to `_shared` and add
the used row (120); (c) rename an input to `_shared` and add the used row (217). INV-22(b) then lists what is left:
cost rows reading `_shared` or `_coalition_share` directly, and branch shares that reach the output only through an
average row (ALLFED and about 13 others). Expect 20 to 30 hand fixes. By family (models / rows):
policy-research-meta 43 / 114, catastrophic-risk 26 / 95, rights-advocacy 18 / 54, conservation 7 / 31,
corporate-campaign 4 / 20, companion-animals 2 / 18, medical-research 5 / 15, single branches elsewhere.

**Step 5, branch classes.** Per branch, by the step 0 rule: `win` (law, regulation, pledge, budget or court order
carried out by others), `research` (adoption by others), `delivery` (own services, own grants, legal representation,
land bought; reads no s). Rule-based first pass by row ids and labels, then one agent per family.

**Step 6, re-judge shares that count the adopter.** The `attr2.py` list, widened by an agent read of every non-1
share's explainer in `win` and `research` branches. Each becomes the share among co-advocates and co-deliverers, with
a new range and explainer, and one scoped verification per model. At 30% most of these branches then fall by less
than 3.3× (LEEP: 0.5 → perhaps 0.8, × 0.3).

**Step 7, imports.** Classify every import by the step 0 rule (a model field `mobilised`, so the choice is visible and
INV-22 can read it). Those that take s get one row in an ours section between `output.native` and the output, and
`evaluator.assumptions.mobiliser_share = 1`. The converters (`convert-givewell.py`, `import-givewell-grants.py`,
`convert-ace.py`, `import-sogive.py`, `convert-sheet.py`) keep both on re-import, as `link-resource-shares.py` does
for the toggle. Variants inherit. Deferred and logged: the blended share for delivery with crowded-in money.

**Step 8, toggle-on and overlap.** Drop donors' new money from `META_DONOR_COST_SHARE_FORMULA` and the 25 + 2
`donor_cost_share` rows; take the mobilised government out of the toggle-on denominators (Animal Policy
International, LEEP 2024, the technical-assistance imports of step 7). Only toggle-on results move. Overlap rows for
Giving What We Can, Effektiv Spenden and Ambitious Impact's giving organisations; the rest deferred in 2.24.

**Step 9, the flip.** `assumptions/default.json` best 1 → 0.3 through `scripts/rule-change.ts` (table to
`inventory/rule-changes/`). Then regenerate `generated/distributions.json`, `bulk-summaries.json`,
`normalization-audit.json`, the browser stand-ins (`scripts/summaries.ts`), the history cache and the MCP data (built);
prose numbers in `writeups/` (`scripts/prose-numbers.ts`); the tables in normalization.md 2.8, 2.9 and 2.24;
`src/pages/method.astro` "Credit" (two sentences for both settings). Replace the s = 1 snapshot test.

### Rollout order (CI green at every commit)
1. Steps 1 + 2 in one commit: assumption at 1.0, formulas, INV-22 with every existing model on a shrinking allowlist.
2. Step 3; step 4 by family; step 7 by evaluator. Each commit: headlines unchanged (snapshot test), receipts re-stamped
   by `rule-change.ts` at 0% tolerance, allowlist shrinks.
3. Steps 5 and 6: some values change at s = 1 (re-judged shares rise): ordinary model edits, scoped verification
   (step 10; never for a model whose only change is the mechanical row). Then step 8: toggle-on results only.
4. Step 9 alone, last, after the owner has read the dry-run table (`rule-change.ts --dry-run`).

Where cost and error concentrate: step 6 (judgment at scale; skipped, about 40 models are cut twice) and step 7's
class list (the most visible choice: GiveWell's technical-assistance grants fall 3.3×).
