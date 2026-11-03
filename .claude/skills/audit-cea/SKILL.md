---
name: audit-cea
description: Independently audit a charityevals cost-effectiveness model (models/*.json): for charityevals' own models (build-cea) the template structure, source verification (fetch every key source and check the number), double counting, missing adjustments, unit errors and sensitivity; for every model the standard steps of docs/normalization.md (units, species step, shared figures, levers, evaluator view) and plausibility against its peers. Produces a findings list with severity and concrete fixes. Use when asked to audit, review, critique or check a CEA model, and as the audit step of build-cea (run in a fresh subagent).
---

# Audit a CEA

This skill checks one cost-effectiveness model, whose result is in **years of healthy life per $1,000
donated** (the site's one scale), and produces a findings list, each finding with a severity and a
concrete fix. It is the middle of build-cea's loop (build → independent audit → fix, until no
high-severity finding remains), run in a fresh subagent, and also audits any imported model. Terms
such as uov, SAD or INV-n: [glossary](../build-cea/references/templates.md#glossary).

You are the independent reviewer: check the explainers, don't trust them. You **don't edit the
model**; you write findings its builder can act on. Work only from the model, its write-up, the blind
list and the previous round's findings, never the builder's notes or research log, so your check
doesn't inherit the builder's reasoning.

Inputs: the model path; optionally the write-up path, the previous round's findings, a blind list
(sources and model ids you must not read; pass the ids to `--exclude`) and where to
write findings (default: print them).

The rules: docs/normalization.md (standard steps, shared versions, invariants in section 3, owner
decisions), import-cea (evaluator models), build-cea's SKILL.md and references/templates.md
(charityevals models). The principles: **one consistent way** (every shared concept the site's one way,
every slider moving every model it concerns, so models stay comparable), **best guesses**, and **fix,
don't flag**: every finding names the concrete fix.

## 1. Mechanical pass (any violation is high)

- `npx tsx scripts/audit-model.ts <path> [--exclude id,id]`: the lint, every invariant on the model
  (drafts too), the result with its `Combined range` and joint low–high (glossary), the tornado, the
  peers, the cause's median and same-family rows. For an evaluator model, ignore the lint codes that only
  apply to charityevals models (owner, template, required-row, unit, output, sections, donor, species,
  shared, published).
- `npx tsx scripts/check.ts <id>` (in models/): `expected` values (the sheet's own numbers) reproduce
  in the evaluator view.
- `npx tsx scripts/normalization-audit.ts [--exclude id,id]` (model in models/; run it in the
  background): any violation for this model is **high**. In a sandbox it skips models that don't load
  (and says which): that is not a finding. A waiver is acceptable only for a checked false positive, with
  its reason in src/engine/normalization-waivers.json; one covering a real problem is high. The
  allowlist stays `{}`. Each check's `how` in the report says what it sees and misses.

Copy every high and medium mechanical finding into your list with its fix, then go beyond them: the
checks work on labels and values, so a rule broken under other words is yours to find. Shared facts and
sliders are the site's one answer for every model, even in a blind run and wherever their sources are:
reading them is never a finding.

## 2. Structure and standard steps

Each item breached is a finding with a concrete fix (the row, the shared figure, the formula).

- **charityevals model**: open `.claude/skills/build-cea/templates/<family>.json` beside it, and
  build-cea's references/templates.md (its Conventions and the family's recipes). The chain is the
  template's; added rows feed canonical rows; the family fits (a misfiled family is high); every shared
  row the template reads is still read (a template row replaced by a typed number is high).
- **Scope** (high when it moves the result >25% or the model is of something else): build-cea step 0
  (the main programme and every one of a tenth or more of spending, weighted by spending; grants to
  sister organisations split by what they fund; the latest year with audited financials and reach for
  the same period, stated in the summary; no case study or pilot standing in, since a donor funds the
  whole programme; a programme left out for want of data stated as partial coverage, Convention 12).
  Check the charity's spending breakdown yourself.
- **Every model** (docs/normalization.md is the rule; these are the usual breaches):
  - output in uov, daly, wellby, ced or tco2e; `output.native` set; rows after it in `ours` sections;
    `source.published` the estimate's date;
  - `estimate_basis` right for what the dollar is (INV-18, only past averages read the next-dollar
    slider; Convention 11): a past average's cost and wins from the same period, in one year's prices
    (`@cpi`); a wrong basis is high;
  - one consistent way: every conversion (exchange rate between outcomes, value of a death, depression,
    cash benchmark, currency rate, household size, discount, species weight, supplementary shares) reads
    the shared version in our view, the evaluator's figure in `published`; name the shared version in
    the fix;
  - deaths by age band (an `@death_ages` mix, or WHO Global Health Estimates shares) × `$life_value_multiplier`; in a WELLBY
    model only through `wellbys_from_uov` (INV-17, so deaths don't move with the WELLBY rate); suicides
    averted from the treated population's rate, fading and discounted with the effect;
  - every future benefit and every wait (funds held, delivery, the middle of the protection) discounted
    at `$discount_rate`;
  - won reforms: `$win_years_counted`, the wait discounted, the shared fulfilment rate (pig, fish,
    shrimp: a sourced judgment), production response and per-meal SADs for diet change; a stock (pressed
    pledges, running menu changes) turned into a yearly flow by templates.md's recipes, never credited
    whole to one year nor discounted twice;
  - animal reach: every animal under the commitments, delivery only in the fulfilment rate (a
    delivered-only count × the rate is high when it moves the result >25%); every species through its
    own `ced_<s>` row with the right SAD version; one SADs figure per physical change;
  - credit: every contributor's resources in `attribution_share_shared` (partners, governments,
    volunteers' time at the local wage), staff's forgone pay in `salary_sacrifice`; a wellbeing trial's
    effect already net of care as usual (`counterfactual_adj` 1);
  - climate, money moved and careers: the shared rows (normalization.md 2.5, 2.8; INV-12, valued one way);
  - signs and one question per adjustment (Convention 5);
  - best guesses, every subjective choice a ranged `judgment` naming its anchor; a blend of a charity
    trial and the literature by precision weights;
  - an idea-stage model shown only while no model of the charity's actual work exists, flagged
    `theoretical`; a charityevals model never is;
  - for an import, the evaluator's rows unchanged except visible overwrites.

## 3. Sources: fetch and verify

For every `observed`/`estimate` input among the top 10 in the tornado, and every input that sets cost
or reach, fetch `source.url` and find the number:

- **verified**: the passage is there; number, unit, year and currency match;
- **mismatch**: the source says something else (quote it);
- **unsupported**: reachable, but the number isn't there;
- **unreachable**: say so; ask for an archived copy or a second source (PDFs: the Read tool, by page).

A mismatch or unsupported number among the top 5 swings is **high**; elsewhere **medium**. Check facts added for this model the same way. For an import,
"the source" is the evaluator's sheet: spot-check the top drivers' cells.

## 4. Reasoning checks

Work through [references/checklist.md](references/checklist.md). For each suspected problem, compute
its effect on the result (change the value in a scratch copy, re-run `scripts/audit-model.ts` on it),
so the severity rests on a number.

## 5. Sensitivity and peers

- Name the 3–5 inputs that drive the result and whether each is sourced or a judgment (one that
  drives it needs a reference class).
- Ranges: real uncertainty or arbitrary ±? Anything uncertain left as a point value? Judge the spread
  on the model's own ranges (audit-model's joint low–high with shared assumptions and facts at their
  best): the shared ones are the site's, not the builder's.
- Peers: where the result sits among models in the same unit, intervention and cause (audit-model
  prints the median), and which row explains the gap with the nearest peer. More than 10× the cause's median needs a
  stated reason in the `summary` (INV-15), sourced where it can be; without one it is high. Under a
  tenth of it: find the row that explains the gap and check scope, reach and persistence first; a gap that comes from a different programme, year
  or counting rule than the site's is a finding with its fix, a gap the evidence supports is stated in
  the summary. Never tune toward a peer's or an evaluator's number: the fix is the rule, not the result.

## 6. Severity

- **high**: wrong or unsupported number on a top-5 driver; unit error; double counting or a missing
  adjustment that moves the result by more than 25%; wrong family or scope; any breach of section 2's
  rules (an unsourced number, a shared figure retyped or replaced by an own conversion, a judgment filed
  as observed); a conservative or optimistic case where a best guess is possible (it would rank the
  model unfairly against best guesses); a funding counterfactual subtracted in our view (the ranking
  is that comparison); an unfinished sheet imported; more than 10× the cause's median with no reason;
  any lint high, invariant violation or `npm run check` failure.
- **medium**: moves the result 10–25%; weak source for a top-10 driver; judgment without a reference
  class; range clearly too narrow or wide; a gap with peers left unexplained (including under a tenth of
  the cause's median); a sign convention broken; a write-up with a stale or non-live result, or a result
  as a multiple of GiveDirectly.
- **low**: wording, missing context, cosmetic structure, better sources.

## 7. Output

```
# Audit: <model id>, round <n>
Result: <x> <unit>/$ = <y> years of healthy life per $1,000 (combined range <lo>–<hi>); cause median <m> (×<r>). Verdict: <pass | fix needed>.
Scope: <programmes and year modelled, against the charity's spending breakdown>
Mechanical: lint <h/m/l>, invariants <violations or none>, normalization-audit <violations or none>
Previous round: <each earlier finding: resolved / not resolved (a finding answered with a note, not a fix, is not resolved)>

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|

## Sources checked
| Row | URL | Status | Note |

## Drivers
<top 5 inputs, sourced or judgment, and what would most improve the model>
```

Categories: structure, scope, normalization, source, double-counting, missing-adjustment, units,
plausibility, sensitivity, comparability, presentation. Every finding has a concrete fix ("set X to Y,
citing Z p. 12", "read the shared SADs fact, the charity's figure in the explainer"), never "consider revisiting" or "flag". "Pass" means no high findings remain.
