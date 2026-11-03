# Evaluating the build-cea and audit-cea skills

`build-cea` builds charityevals' own cost-effectiveness model of a charity from public evidence;
`audit-cea` is the independent reviewer it calls in a fresh subagent until no high-severity finding
remains (at most 3 rounds). This page records how we tested whether the pair produces models that
land near expert evaluators' numbers, without tuning the skills to those numbers.

## Method

**Split, fixed before any development.** Nine charities that already have a re-implemented
evaluator model in the repo:

| Set | Charity | Evaluator model | Template family |
|---|---|---|---|
| dev | Against Malaria Foundation | GiveWell | direct-health |
| dev | The Humane League | ACE | corporate-campaign |
| dev | StrongMinds | HLI | wellbeing |
| dev | Sociedade Vegetariana Brasileira | ACE | diet-change |
| test | Helen Keller Intl (vitamin A) | GiveWell | direct-health |
| test | New Incentives | GiveWell | direct-health |
| test | Shrimp Welfare Project | ACE | corporate-campaign |
| test | Dansk Vegetarisk Forening | ACE | diet-change |
| test | Friendship Bench | HLI | wellbeing |

The dev set covers one charity per family that the test set uses, so every template was exercised
before the test. The cash-income and policy-research-meta templates had no test charity (GiveDirectly
is the site's benchmark, and no evaluator model in the repo is a policy or meta charity).

**Blind runs.** Every run (dev and test) used a separate copy of the repo made by
`evaluation/make-sandbox.sh`: no git history, no bulk GiveWell imports or GiveWell shared-input facts, and
none of the target charity's models or write-ups (its charity record keeps only name and website).
The builder, a general-purpose subagent with the prompt in `evaluation/builder-prompt.md`, was told not to
read the evaluator's pages, sheets or reports about the charity (for GiveWell charities: all of
givewell.org) and nothing outside the sandbox. It could use the charity's own reports and filings,
general literature and data sources. Each builder ran the audit loop itself, spawning a fresh
auditor subagent per round that saw only the model, write-up, blind list and the previous
findings.

**Comparison.** `npx tsx evaluation/compare.ts` loads each run's model (with any facts the builder
added, for that run only) next to the repo's evaluator model and computes both on the common
scale (× GiveDirectly) under the site's default assumptions (the "charityevals view"). The
ratio compares like with like: the blind model against the evaluator model in the same view.
The evaluator's own view (their moral weights and accounting) is shown for reference.

**These runs predate the current scale** (October 2026: years of healthy life per $1,000, animal
models through the species step in chicken-equivalent pain days, one SADs figure per physical change,
docs/normalization.md). The figures below are multiples of GiveDirectly, as `evaluation/compare.ts`
still prints them, and the animal models then reported SADs converted with Ambitious Impact's
weights. For the global-health families the ratios carry over (both sides convert the same way); for
the animal families the evaluator side has since changed (e.g. THL's shared hen figure and Rethink
Priorities' species weights), so those ratios would differ if re-run. The skills and templates have
since moved to the current scale; they have not been re-evaluated.

## Re-run, November 2026

The skills brought up to today's rules (below, "Before the re-run") and run again on the same split,
plus two charities for the families the first run had no test for: Village Enterprise (cash-income,
Founders Pledge) and The Life You Can Save (policy-research-meta, Founders Pledge). Figures are years of
healthy life per $1,000 under the site's defaults, with the estimate-age discount off for both sides
(a blind build is dated today, an evaluator's estimate earlier). `evaluation/compare.ts` prints them.

| Set | Charity | Template | Evaluator | Evaluator, own view | Evaluator, charityevals view | Blind build | Blind combined range | Ratio (blind ÷ evaluator) | First run |
|---|---|---|---|---|---|---|---|---|---|
| dev | Against Malaria Foundation | direct-health | GiveWell | 24 | 24 | 25 | 7.0–93 | **1.0** | 0.99 |
| dev | Sociedade Vegetariana Brasileira | diet-change | ACE | 11 | 12 | 11 | 0.077–1,528 | **0.92** | 1.4 |
| dev | StrongMinds | wellbeing | HLI | 23 | 2.5 | 3.2 | 0.93–11 | **1.3** | 0.97 |
| dev | The Humane League | corporate-campaign | ACE | 94 | 51 | 1.4 | 0.034–58 | **0.027** | 0.13 |
| test | Helen Keller Intl | direct-health | GiveWell (VAS) | 7.8 | 7.7 | 14 | 4.6–43 | **1.8** | 1.7 |
| test | New Incentives | direct-health | GiveWell | 4.4 | 4.0 | 14 | 5.3–37 | **3.5** | 1.8 |
| test | Friendship Bench | wellbeing | HLI | 28 | 3.1 | 5.9 | 1.5–23 | **1.9** | 2.4 |
| test | Shrimp Welfare Project | corporate-campaign | ACE | 64 | 10 | 1.6 | 0.0065–412 | **0.16** | 1.2 |
| test | Dansk Vegetarisk Forening | policy-research-meta | ACE | 20 | 0.87 | 0.28 | 0.0013–60 | **0.32** | 0.0095 |
| test | Village Enterprise | cash-income | Founders Pledge (2018) | 2.0 | 2.0 | 4.2 | 1.4–12 | **2.1** | – |
| test | The Life You Can Save | policy-research-meta | Founders Pledge | 163 | 82 | 75 | 20–282 | **0.92** | – |

("First run": the October runs recomputed on today's scale, the same way. "Combined range": every input's range combined as independent errors in log space, a 90% interval if each range is one; the joint low–high, every input at its end at once, spans 10³–10¹⁴×.)

**Test set summary.** 4 of 7 blind builds land within 3× of the evaluator's model in the same view
(Friendship Bench, Helen Keller, Village Enterprise, The Life You Can Save); Dansk Vegetarisk Forening is
just outside (3.1× below), New Incentives 3.5× above, Shrimp Welfare Project 6× below. The geometric mean
of the seven ratios is 1.0. Every evaluator figure but New Incentives' lies inside the blind model's combined range. Against
the first run: Dansk Vegetarisk Forening moved from 1/105 to 1/3 (the scope rule: the builder modelled
the policy work the money paid for, a fund won, not a case study); New Incentives and Shrimp Welfare
Project moved away (the vaccination model now counts adult deaths band by band and the cash; the shrimp
model counts stunners bought, not shrimp under commitments, at a judged 60% delivery). Global-health
builds still come out above their evaluators (1.8–3.5×) and animal builds below (0.16–0.32×), as in the
first run; The Humane League (dev, 1/37) is the largest gap: most of its value is pressing companies on
existing pledges, which the template had no recipe for (one was added after the dev runs, general).

**Audits.** Every build ran 2–3 rounds with a fresh auditor; all ended without a high finding except
Friendship Bench, whose third round found one (suicide rates by age), fixed but not re-audited.

**Leaks found in this run** (all logged by the builders, none used): the required docs and shared facts
quoted evaluator figures for the charity in sentences that named it (now removed from the sandbox, also
across wrapped lines, in write-ups and by removed model id); charities' own reports quote evaluator
figures (New Incentives, Friendship Bench); trial reports carry their own cost-effectiveness analyses
(Village Enterprise). Two test builds used figures whose source is the evaluator's sheet of that charity
because the template requires them as shared facts (New Incentives' internal validity adjustment; the
shrimp SAD figure), so those two are less blind than the others.

**Harness bugs found in this run, not yet fixed in the skills:** `--exclude` in `audit-model.ts` and
`normalization-audit.ts` matches charity ids, so it also dropped the draft being built (the library-wide
invariant run skipped it in four test runs; `audit-model.ts`'s own invariant pass did check it); the
sandbox lacked the bulk models a shared destination set reads (The Life You Can Save was computed
without seven destinations inside the sandbox, and in full by compare.ts). The builders' other
notes on the skills (dev ones fixed before the test, test ones open) are in
`evaluation/blind-runs/builder-notes-2026-11.md`.

## First run, October 2026

| Set | Charity | Template | Evaluator | Evaluator, own view | Evaluator, charityevals view | Blind build | Blind joint low–high | Ratio (blind ÷ evaluator) | Audit rounds (high/med/low) |
|---|---|---|---|---|---|---|---|---|---|
| dev | Against Malaria Foundation | direct-health | GiveWell | 5.59× | 5.67× | 5.59× | 0.13–196× | **0.99** | 1/2/6 → 0/3/5 |
| dev | Sociedade Vegetariana Brasileira | diet-change | ACE | 2.46× | 1.75× | 4.79× | 0.00002–1,740× | **2.7** | 1/5/5 → 1/2/4 → 0/3/4 |
| dev | StrongMinds | wellbeing | HLI | 5.33× | 5.40× | 4.68× | 0.03–180× | **0.87** | 1/3/5 → 0/2/4 |
| dev | The Humane League | corporate-campaign | ACE | 21.6× | 13.8× | 1.61× | 0.0001–209× | **0.12** | 1/6/4 → 0/2/10 |
| test | Helen Keller Intl (VAS) | direct-health | GiveWell | 1.79× | 1.82× | 2.89× | 0.15–35.5× | **1.6** | 1/3/7 → 0/1/4 |
| test | New Incentives | direct-health | GiveWell | 1.02× | 1.03× | 1.65× | 0.15–19.5× | **1.6** | 0/6/11 → 0/2/8 |
| test | Friendship Bench | wellbeing | HLI | 6.40× | 6.49× | 15.6× | 0.11–687× | **2.4** | 1/3/4 → 0/2/4 |
| test | Shrimp Welfare Project | corporate-campaign | ACE | 14.8× | 11.1× | 3.90× | 0.0001–3,790× | **0.35** | 3/5/8 → 2/3/3 → 1/2/4 (not passed) |
| test | Dansk Vegetarisk Forening | diet-change | ACE | 4.54× | 3.41× | 0.0023× | 4e-10–14.9× | **0.0007** | 1/5/4 → 1/1/7 → 0/0/5 |

**Test set summary.** 4 of 5 blind builds land within 3× of the evaluator (geometric mean ratio of
those four: 1.2). For all five, the evaluator's figure lies inside the blind model's joint
low–high, though for Dansk Vegetarisk Forening it is 1,500× above the blind best guess. The global-health families (direct-health, wellbeing) came
out 1.6–2.4× above the evaluators; the animal families came out below them, by 3× for a
welfare-reform campaign and by three orders of magnitude for a diet-change program.

### Where and why the test models differ

**Helen Keller Intl, vitamin A (1.6×).** Cost lines up: the blind model's full cost per dose
received is $1.20 (Helen Keller's own share $0.54 per dose), against GiveWell's $1.09 per
supplement. The gap is the mortality effect. The blind build takes the Cochrane 2022 estimate (12%
all-cause reduction in children 6–59 months) with an evidence adjustment of 0.85, and today's UN
IGME mortality (1.0% per child-year, weighted by where children are reached). GiveWell starts from
a larger implied effect but applies a −65% external validity adjustment (lower vitamin A
deficiency today than in the trials) plus internal validity and frequency discounts, ending near a
5% reduction on a 0.6% baseline. The blind build discounts instead through the counterfactual
(0.6: some doses would be delivered by others) and cost-share attribution (0.47). Net: about 1.6×
more deaths averted per dollar. GiveWell's large deficiency-based external validity discount is
the judgment the blind build did not reproduce.

**New Incentives (1.6×).** Very close on cost (blind $17.04 per infant enrolled, GiveWell $18.21)
and in structure (per-cause vaccine-preventable mortality × coverage gain). The blind build uses a
smaller coverage gain (0.19 vs GiveWell's 0.29 reduction in unvaccinated children) but counts the
cash itself (about 18% of value) and uses higher cause-specific baselines from the 2024 Nigerian
verbal-autopsy study, and a lighter leverage/funging discount (0.9 vs GiveWell's −17%).

**Friendship Bench (2.4×).** Cost per person is similar (blind $12.41, HLI $16.50 on its earlier
year), and the initial effect is close to HLI's prior (0.50 vs 0.53–0.59 SD). The difference is
persistence: the blind build read a 2026 meta-analysis showing a plateau (~0.39 SD from 1 to 5
years) and set a 5-year area-equivalent duration, where HLI's linear decay gives about 3.5 years.
HLI also blends in Friendship Bench's own M&E with a small effect (0.12 SD); the blind build
weighted two RCTs and a meta-analytic prior instead.

**Shrimp Welfare Project (0.35×).** The structure matches ACE's (shrimp stunned per year × years ×
SADs per shrimp × share of credit). Two choices move it: the SAD factor (blind 0.0056 per shrimp,
derived from Ambitious Impact's v1 method with Rethink Priorities' slaughter durations, vs ACE's
0.0045, so similar), and reach and persistence: the blind build counts about 1.3 billion shrimp a
year from stunners actually bought (7.6 × 2,550 t), 5 years, and implementation 0.8; ACE counts
1.74 billion shrimp under commitments for 10 years at 0.9 likelihood, with 50% contribution. The
blind build also includes all stunner capital cost in the year. The SAD factor itself is the
biggest swing in both: Ambitious Impact's 2026 method (v2) would put the blind model at about 0.6×
GiveDirectly. Round 3 still had one high finding (disclosure of the SADs v1/v2 choice); it was
fixed but, under the 3-round cap, not re-audited, so this model counts as **not passed**.

**Dansk Vegetarisk Forening (0.0007×).** The blind model and ACE's model are of different things:
ACE modelled a chef-education case study (50 chefs × 5,000 plant-based meals a year × 10 years ×
60% replacing meat, at 2.58 SADs per meal); DVF publishes no meal counts, so the blind build
modelled all of DVF's 2024 grant-funded kitchen work bottom-up with reach entirely judgment (234,800
meals a year before delivery losses), a per-meal SAD figure adapted to the Danish meat mix (0.19
vs ACE's 2.58), the shared production response (0.76), and heavy discounts (total adjustment
0.07). Per meal, the blind build credits about 1/14 of ACE's suffering, a third of the years, and
a fifth of the meals per dollar; together these give the 1,500× gap. The template forced the
builder to use the shared per-meal fact, then scale it with sourced inputs; ACE's 2.58 is itself
30× its own SVB figure (0.084). This is the clearest case where the evaluator and the blind build
disagree about the basic facts (what a replaced Danish meal contains, how many meals change), not
about structure.

### What the dev set taught (fixed before the test, all general)

- **Spread finding**: the mechanical audit's "joint range > 1000×" fired on every animal model
  because of the shared moral weights and exchange rates, which builders can't narrow. It now
  measures the spread with shared assumptions at their defaults, and prints both.
- **Conventions** added to `references/templates.md` after builders resolved the same questions
  differently: partner and government costs lower attribution rather than entering
  `cost_total` (so the charity's share of resources stays meaningful); reach is a flow, and only new additions get
  persistence (SVB's builder had credited one year's meals for 1.5 years); several branches in
  one family; one question per adjustment (accountability: years brought forward vs.
  counterfactual); optional rows (`indirect_deaths_ratio`, `delay_years`, …); currency rows;
  which year; contractors in staff costs; judgment anchors.
- **Direct health**: indirect deaths and an all-cause calibration (AMF round 1's high finding:
  counting direct malaria deaths only).
- **Wellbeing**: dose discounts only with dose-response evidence; state the implied multiple when
  calibrating against a charity's own RCT.
- **Shared facts**: per-meal SAD reference meal described; the cost-per-person explainer no longer
  points blind builders at an evaluator.
- **Process**: research log kept outside the audit folder (an auditor had read the builder's
  notes); PDF and bot-check advice in `references/research.md`; write-up requirement stated; eval
  sandbox commands.

### After the test (general fixes, not re-run on the test set)

- Wellbeing template: effect duration is now an input and decay is derived, because the formula
  `initial ÷ decay` counted the effect size twice in the joint range (raised by both wellbeing
  builders). Friendship Bench's builder had already used a duration input.
- Stop rule clarified: a round that found high findings is always followed by another round on
  the fixed model.
- Conventions: averages with `avg()` and weight rows, not hidden literals; cost-share attribution
  on the same dose basis as `implementation_adj` (Helen Keller round 1's high finding); a cash
  branch for incentive programs; allowed resource types listed.
- Sandbox: write-ups of other models that name an excluded charity (two GiveWell grant write-ups
  mentioned New Incentives) are now removed too; the builder prompt passes `--exclude` to
  `audit-model.ts` in blind runs.

None of these were chosen to move a test result toward the evaluator; several would move results
away (e.g. the duration input lets a plateau, as in Friendship Bench, raise the estimate).

### Before the re-run (November 2026: the skills brought up to today's rules, not re-run)

Every fix is a rule of the site applied generally, none tuned toward an evaluator's number:

- **Templates follow every rule out of the box.** Each skeleton (and a new climate one in tco2e)
  carries `estimate_basis`, a build date in `source.published`, staff pay from `@staff_pay`, deaths by
  age band, stillbirths, household sizes by place, the moved-money rows and the career-change step; a
  test (src/engine/templates.test.ts) runs every invariant and the lint on each skeleton filled in.
- **Animal weak spots.** Scope: the builder models the programmes the money pays for by spending (every
  one of a tenth or more, by funding weight) in the latest year, never a case study (DVF's gap). Reach
  and persistence of won commitments: every animal under the commitments, delivery only in the shared
  fulfilment rate, `$win_years_counted` from the discounted wait (SWP's and THL's gaps). Per-meal SADs:
  the shared figure × a meal-mix ratio from a published estimate covering both places, never rebuilt
  from a meat mix (DVF's 0.19). The lint enforces the shared reads; the critic checks scope and the
  cause's median.
- **The critic** runs every invariant on the model (scripts/audit-model.ts, drafts included) and the
  normalization audit, treats any violation as high, and gives a concrete fix for every finding.

## Known limitations

- **Small sample.** Five test charities, one or two per family; no test of the cash-income or
  policy-research-meta templates. The ratios are anecdotes, not a calibration.
- **Not fully blind.** The shared facts carry evaluator numbers: GiveWell's moral weights (from the
  AMF CEA), WELLBY conversion and household spillover (from HLI's StrongMinds and Friendship Bench
  sheet: Friendship Bench's run used them), SAD factors from ACE sheets of dev-set and other
  charities. The Shrimp Welfare Project builder took Ambitious Impact's shrimp SAD method from
  ACE's Aquatic Life Institute sheet, likely the same parameter ACE uses for SWP. Several charities'
  own sites quote evaluator figures (New Incentives' history page, Helen Keller's VAS page, THL's
  annual report); builders reported seeing and not using them. Search snippets surfaced evaluator
  material in three runs (logged, not used). All incidents are listed in the run reports
  summarised above.
- **Template structure came from the evaluator models**, including the test charities' evaluators.
  This is by design (comparability), but it means agreement on structure is not evidence.
- **Different scope.** A blind build may model a different program or year than the evaluator
  (DVF most of all); the ratio then measures scope as much as accuracy.
- **Shared exchange rates dominate cross-cause uncertainty.** For animal models the shared rates
  (a chicken against a person, and a day of disabling pain in healthy life) swing the result more
  than anything the builder decides; the joint ranges above include them.
- **Audits are LLM reviews.** They verified sources by fetching them and caught real errors (a
  misread RCT, missing indirect deaths, a double-counted delivery shortfall, a misread UNICEF
  trend), but an auditor can share the builder's blind spots.
- **Effort.** Each build took 30–55 minutes of agent time and 2–3 audit rounds.

## The runs

`evaluation/blind-runs/<charity>/` (test) and `evaluation/dev-runs/<charity>/` (dev) hold each model, its
write-up, the audit findings for every round and the builder's research log. They are not in
`models/`, so the site doesn't publish them. Facts a builder added (country mortality data for
Helen Keller, a shrimp SAD factor for SWP) are in the run's `facts/` folder, not in the repo's
shared facts. Re-run the comparison with `npx tsx evaluation/compare.ts`; make a sandbox with
`evaluation/make-sandbox.sh <dir> <charity-id> …`.
