---
name: audit-cea
description: Independently audit a charityevals cost-effectiveness model (models/*.json): for our own models (build-cea) template structure, sources (fetch each key number), double counting, missing adjustments, units and sensitivity; for every model the standard steps of docs/normalization.md, plausibility and a sanity check of the result as its page shows it. Produces findings with severity and concrete fixes. Use when asked to audit, review or check a CEA model, and as build-cea's audit step (fresh subagent).
---

# Audit a CEA

Checks one model (result in **years of healthy life per $1,000**) and lists findings, each with a
severity and a concrete fix: the audit step of build-cea's loop (fresh subagent) and of any import.
Terms: [glossary](../build-cea/references/templates.md#glossary).

You are the independent reviewer: check explainers, don't trust them, and **don't edit the model**.
Work only from the model, its write-up, the blind list and the previous round's findings, never the
builder's notes.

Inputs: the model path; optionally the write-up path, the preflight output, the previous round's
findings, a blind list (sources and model ids you must not read; pass the ids to `--exclude`).

## Rounds

- **Round 1** (opus): this whole skill.
- **Round 2 and later** (sonnet), a scoped verification: only the previous round's highs and mediums
  and the changes made for them, each resolved or not (a note is not a fix), plus any new high or
  medium those changes introduced. No full re-audit. Lows are the builder's to fix and never re-open a
  round; a round with no open high or medium passes.

The rules: docs/normalization.md (standard steps, shared versions, invariants in section 3, owner
decisions), import-cea (evaluator models), build-cea's SKILL.md and references/templates.md
(charityevals models). The principles: **one consistent way** (every shared concept the site's one way,
every slider moving every model it concerns), **best guesses**, and **fix,
don't flag**: every finding names the concrete fix.

## 1. Mechanical pass (any blocking line is high)

Read the preflight output (`npx tsx scripts/preflight.ts <id>`; run it yourself only if none was given
or the model changed since): copy every blocking line as a high, don't re-run its checks by hand. For
an evaluator model, the lint codes for charityevals models only don't apply. A waiver is acceptable
only for a checked false positive, with its reason. Then `npx tsx scripts/audit-model.ts <path>
[--exclude id,id]` for the result, range, tornado, peers and the cause's median.

Then go further: a rule broken under other words is yours to find. Reading shared facts and sliders is
never a finding.

## 2. Structure and standard steps

Each item breached is a finding with a concrete fix (the row, the shared figure, the formula).

- **charityevals model**: open `.claude/skills/build-cea/templates/<family>.json` beside it, and
  build-cea's references/templates.md (its Conventions and the family's recipes). The chain is the
  template's; added rows feed canonical rows; the family fits (a misfiled family is high); every shared
  row the template reads is still read (a template row replaced by a typed number is high).
- **Scope** (high when it moves the result >25% or the model is of something else): build-cea step 0
  (every programme, none left out; the latest year with audited financials and reach; no case study or
  pilot standing in; thin data on its family's chain, never another model's result; Convention 12).
  Check the accounts yourself: a programme missing is high; charities/<id>.json `spending` and `lines`
  match them (normalization.md 2.17).
- **Every model** (docs/normalization.md is the rule; these are the usual breaches):
  - `source.published` the estimate's date;
  - `estimate_basis` right for what the dollar is (Convention 11): a past average's cost and wins from the same period, in one year's prices
    (`@cpi`); a wrong basis is high;
  - one consistent way: every conversion reads the shared version in our view, the evaluator's figure
    in `published`; name the shared version in the fix;
  - deaths by age band (an `@death_ages` mix, or WHO Global Health Estimates shares) × `$life_value_multiplier`; suicides
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
  - credit (Convention 2, normalization.md 2.24): co-funders' resources in `attribution_share_shared`
    (partners, co-advocates, volunteers' time at the local wage), never the adopter's (cut twice with
    `mobiliser_share`: high); a win's or research branch's used share × `mobiliser_share`, its cost rows
    reading it; an import classified (`mobilised`), with our row and the pin `mobiliser_share: 1`;
    staff's forgone pay in `salary_sacrifice`; a wellbeing trial's
    effect already net of care as usual (`counterfactual_adj` 1);
  - climate, money moved and careers: the shared rows (normalization.md 2.5, 2.8; INV-12, valued one way);
  - signs and one question per adjustment (Convention 5);
  - every way the work does good or harm is a row: side effects tagged `side_effect`
    (normalization.md 2.16), never-started lives' good `never_started` (2.25), an evaluator's omitted
    step a row in our section; a known effect left out is missing-adjustment;
  - the simulation (2.18): ranges' `interval` and `shape` as the source states; one-off chances tagged
    `single_event`, no yearly rate or share of many; no range on a year; no remainder of large figures;
  - a past average's `@next_dollar` figure sourced and dated within a year (2.10);
  - missing data (Convention 12, glossary "measured / thin", both ways): a thin branch at 1 is high; so
    is a branch at the slider whose reach the charity counts and whose effect is an RCT's of the same
    intervention delivered the same way (thin over-applied); a judged baseline or counterfactual never makes it thin;
  - best guesses, every subjective choice a ranged `judgment` naming its anchor;
  - an idea-stage model only while no model of the charity's actual work exists, `theoretical`; ours never;
  - an import unchanged except visible overwrites.

## 3. Sources: fetch and verify

For every `observed`/`estimate` input among the top 10 in the tornado, and every input that sets cost
or reach, fetch `source.url` and find the number:

- **verified**: the passage is there; number, unit, year and currency match;
- **mismatch**: the source says something else (quote it);
- **unsupported**: reachable, but the number isn't there;
- **unreachable**: say so; ask for an archived copy or a second source.

Pages: `scripts/fetch.sh <url>`; PDFs: `scripts/pdf-text.sh <pdf>`; IRS 990s: `scripts/irs-990.py`.

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
  prints the median), and which row explains the gap. Over 10× the cause's median or under a tenth of
  it: find that row and check scope, reach and persistence first; a gap that comes from a different
  programme, year or counting rule than the site's is a finding with its fix, a gap the evidence
  supports is noted in the audit. Never in the summary or write-up: site text never compares with other
  charities, a median, an average or peers (the lint's `comparison` code). Never tune toward a peer's
  or an evaluator's number: the fix is the rule, not the result.

- **Sanity check**: read the model as its page shows it (figure, range, chance of no good or harm,
  flags, gap to the evaluator). Anything a donor would find odd is a finding until you've traced it
  to its cause, wherever that is: an input, a shared figure, or the site's own code.

## 6. Severity

- **high**: wrong or unsupported number on a top-5 driver; unit error; double counting or a missing
  adjustment that moves the result by more than 25%; wrong family or scope; any breach of section 2's
  rules (an unsourced number, a shared figure retyped or replaced by an own conversion, a judgment filed
  as observed); a conservative or optimistic case where a best guess is possible (it would rank the
  model unfairly against best guesses); a funding counterfactual subtracted in our view (the ranking
  is that comparison); an unfinished sheet imported; a summary or write-up that compares with other
  charities, a median, an average or peers; any blocking preflight line.
- **medium**: moves the result 10–25%; weak source for a top-10 driver; judgment without a reference
  class; range clearly too narrow or wide; a gap with peers (over 10× or under a tenth of the cause's
  median) whose row isn't found; an odd result whose cause isn't found; a sign convention broken; a write-up with a stale or non-live result, or a result
  as a multiple of GiveDirectly.
- **low**: wording, context, cosmetic structure, better sources.

## 7. Output

```
# Audit: <model id>, round <n>
Result: <x> <unit>/$ = <y> years of healthy life per 1,000 dollars (range <lo>–<hi>, <z>% of draws at or below zero, as audit-model prints them: the page's); cause median <m> (×<r>). Verdict: <pass | fix needed>.
Model-sha: <what `npx tsx scripts/audit-receipt.ts <id>` prints for the audited model>
Rules: <first version in audits/versions.json>
Scope: <programmes and year modelled, against the charity's spending breakdown>
Preflight: <pass | blocking lines>
Previous round: <each earlier high and medium: resolved / not resolved>

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|

## Sources checked
| Row | URL | Status | Note |

## Drivers
<top 5 inputs, sourced or judgment, and what would most improve the model>
```

Categories: structure, scope, normalization, source, double-counting, missing-adjustment, units,
plausibility, sensitivity, comparability, presentation. Every finding has a concrete fix ("set X to Y,
citing Z p. 12"), never "consider revisiting" or "flag". "Pass": no high findings.
