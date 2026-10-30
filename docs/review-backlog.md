# Review backlog (October 2026)

Findings from four reviews of branch design/quieter-home: code, models, sanity checks, design.
Tick an item only once it's fixed and checked. Items under "Needs a decision" wait for the owner.

## A. Model data (models/**, assumptions/default.json)

- [x] A1. ORS models wire GiveWell's "costs averted per DALY" (a literal 0.43) to `$uov_per_daly`: new-incentives-with-addition-orsz-january-2025, clinton-health-access-initiative-chai-ors-zinc, chai-ors-zinc-updated-costs-january-202 (rows `units_of_value_costs_averted_per_daly_averted`, `_2`, `_3`). Make it 0.43 and drop `uov_per_daly` from their evaluator assumptions. (+27–37% today.)
- [x] A2. `discount_rate` explainer says ACE uses 4%; THL, SWP, SVB, AWO pin 1.4%. Correct the explainer.
- [ ] A3. Mostly done: Aquatic Life Institute, AMF and SMC now discount at `$discount_rate`; 32 literal 4% rows in 13 grant models linked. Open: Helen Keller (4% sits inside GiveWell's SMC ratio), Malengo (mixed 4%/6.5%), other literal rates (Fortify 4.175%, One Acre Fund 6.5%, R4D 6%).
- [x] A4. healthy-futures-phl-based-on-updated-23-feb-2026 moves the wrong way on `life_value_multiplier` (miscarriage DALY ratio uses only the multiplied neonatal value). Fix the ratio.
- [x] A5. (Linked where the row is clearly a life value; DMI's GiveDirectly cost-per-death rows are an inference worth a glance. Left: Lafiya, Sightsavers, pure-earth-model, CHAI incubator/mSupply/PPM/TSUS have no such row.) centre-for-pesticide-suicide-prevention-cpsp-skeleton: `value_of_preventing_one_death_from_suicide` is a literal; link to the life value. Same check for other mortality grant models that return exactly 1.000 on every assumption (DMI, Lafiya, Vital Strategies, CHAI, Sightsavers, pure-earth-model).
- [x] A6. Wild Animal Initiative: `sads_total` / `sads_per_dollar` labelled as papers; rename. State or add the welfare-range step.

## B. Engine and code (src/**, scripts/**)

- [x] B1. Ranges, caveat flags and uncertainty shares swing `uov_per_daly`, which cancels out of the headline (THL 0.07–5,989 around 80; shares sum to 93%). Run sensitivity/uncertainty on the headline (common ÷ perHealthyYearPer1000 with the swung values).
- [x] B2. Visitors with a saved evaluator view are stuck in it (no switch left; Reset disabled). Remove the view state, or at least make loadView return "charityevals".
- [x] B3. Caveat flags on a model page ignore the reader's edits. Recompute with edits, or hide while editing.
- [x] B4. URL edits to calculated rows apply but are never marked. Only accept input rows and `@fact` keys.
- [x] B5. Copy link: no `.catch` on clipboard; track inside `.then`.
- [x] B6. AssumptionsPanel: InfoTip inside the slider's `<label>` pollutes its accessible name. Move it out.
- [x] B7. Dead code: setView/evaluator-view branches, Metric "lever" branches, conversion-share sentence, `common.benchmark_label`; scripts/check.ts and audit-model.ts still print "× GiveDirectly".
- [x] B8. `headlineFormula` splits `to_common` on `*`; build it as an AST and test each unit.
- [x] B9. Tests: edit-state URL round trip, headlineFormula/rootOf, pathToRef, usage(), parseEdit; tree root equals ranking central for every comparable model; root's child shares sum to ~1.
- [x] B10. `?n.row_240=…` (a pass-through row) had no visible effect; check after B4.

- [x] B11. Pass-through edits follow to their input; ignored keys leave the URL; history, seo and write-ups use `headline()`.

## C. Which model ranks

Decided 2026-10-30:
- C1: one dot per evaluator on a charity's ranking line. Within an evaluator, models covering the same program: only the most recent counts. Skeleton, VOI and breakeven sheets don't count as the program's model.
- C1b: one evaluator, different programs of the same charity (e.g. Evidence Action deworming, syphilis, water): combine into that evaluator's dot by funding share, same rule as C2.
- C2: funding-weighted location figure.
- C3: ignore ACE's 2016 "equivalent animals spared per dollar"; convert their outcome estimates (years of suffering spared) with our own shared rates, like every other animal model.

- [x] C1. The ranking takes the newest grant sheet, which can be a skeleton, VOI or breakeven sheet (CPSP skeleton #5, vital-strategies-botec-breakeven, CHAI msupply-voi, Evidence Action by its syphilis grant). Exclude those kinds or mark a flagship model per charity.
- [x] C2. (Weighting code is in, but no model has real per-location funding sizes: AMF, HKI, NI size every location at a $1M hypothetical, so all still show the median.) New Incentives and Helen Keller show the unweighted median location (incl. places they don't work), landing at cash level. Use funded locations or a funding-weighted figure.
- [x] C3. ACE 2016 models (HSUS #2, ASF #4, Vegan Outreach) rank near the top with ranges from below zero to over a million; their 22.4 SADs per "animal spared" gives ~2.8× more than ACE's years-of-suffering route. Re-convert, mark as old, or drop from the ranking.

- [x] C4. Program and location funding weights: needed for C1b/C2 to work. Without them Malaria Consortium falls 24.5 → 10.0 (#29 → #54), because ITN and VAS count as much as SMC. Source weights from GiveWell's grant totals per program and location (charities/*.json `programs[].weight`).
- [ ] C7. Window 2022–Oct 2026; CHAI PPM out. Open: unsplit grants left out (AMF Aug 2026 six Nigerian states $17.1M, HKI Nigeria 2026 $10.4M and Dec 2025 $33.9M, MC 2022 $13.5M); funding in places with no location model dropped (Kenya, Zambia, Côte d'Ivoire); HKI leans on Niger.
- [x] C8. Model pages still headline the median location ("in DRC, the median of 8 locations") while the ranking now uses the funding-weighted figure; make them agree.
- [x] C9. Homepage row and charity headline agree (primary evaluator's funding-weighted figure; other evaluators as hollow labelled dots); the tree's top row names its location ("… in DRC").
- [x] C5. Newest wins: GiveDirectly ranks on GiveWell's Jan 2025 cash sheet (5.5); main pages show the model that ranks.
- [x] C6. Program splits fixed (ALIMA by country, EA incubator grants weight 0, MC VAS uses the co-delivery sheet).

## D. "Credit by share of resources"

Decided 2026-10-30: count staff salary sacrifice everywhere, not just in ACE models (D2).

- [x] D1. About 62 standard-layout GiveWell models divide by the grantee's spending, not all contributors', when the toggle is on: co-funders' and governments' money counts as free (1.4× on average, up to ~2×). Also downstream government-cost adjustments set to 1 instead of added to costs.
- [x] D2. Salary sacrifice is counted only in 10 hand-built ACE models, all with one generic guess (exactly −26% each). Apply to all or none; use charity-specific inputs if kept.
- [x] D3. HLI models don't respond to the toggle at all.

- [ ] D4. Mostly done: NI uses GiveWell's government + Gavi costs ($62.92/child); 4 sectors fixed; government/Gavi costs count in 7 more grant sheets; StrongMinds' 8.3% doesn't double-count. Open: Suvita and IRD vaccine sheets (have the numbers); maternal syphilis, Friendship Bench, Pure Earth in-kind costs; CHAI ORS/zinc sector (TA vs delivery).

## E. Design

- [x] E1. Mobile: "Your values" is ~11,000px down the homepage. Add a sticky button or sheet.
- [x] E2. Model pages: no headline figure under the title; first number is "24" in the country list without saying which location.
- [x] E3. Units: tree root and write-up summaries still in native units ("units of value per dollar", "SADs", "× GiveDirectly"); THL summary says 63 while the tree says 72.8. Generate summary numbers from the engine.
- [x] E4. Duplicates: "All 8 models" next to "8 countries and programs"; Copy link in tree and panel; cell reference twice in a row's detail; history rows repeated, with no-op before/after values.
- [x] E5. Stale references: THL summary mentions a model switcher that no longer exists.
- [x] E6. Plain page titles; every model summary opens with a plain sentence (skim CA CODE, CHoBI7, Ansh, No Lean Season, written partly from outside knowledge).
- [x] E7. Precision: sliders (9.64, 1.66%), tree (48,715, 116.253), edit field (1.19252), 24.4 vs 24.
- [x] E8. Homepage rows: overlapping evaluator dots, unexplained ⚠, colliding axis labels ("10k100k"), aria range in wrong order, no visible range for most global-health rows.
- [x] E9. "Reveal uncertainties" has no on/off state.
- [x] E10. History: wording-only commits take as much room as real changes; developer-speak titles; "Uncommitted changes" shown.
- [x] E11. /data: paragraphs instead of ⓘ; "Kenya" and "Kenya (GiveWell's data)" as separate groups; not linked from nav or /method.
- [x] E12. "formula" and "Adjust it" links lack the underline style.
- [x] E13. Hydration warnings fixed (tree and homepage); IRC write-up rewritten; ranking rule back as an ⓘ; GiveDirectly write-up leads with the ranked 5.5 and names the Kenya model's 4.4.
