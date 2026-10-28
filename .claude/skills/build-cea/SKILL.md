---
name: build-cea
description: Build charityevals' own cost-effectiveness analysis (CEA) for any charity from public evidence (annual reports, audited financials, program data, studies, evaluator reviews), as a model JSON in this repo's format that follows a fixed template per intervention family and lands on the site's common scale. Runs an independent audit (audit-cea skill, separate subagent) and fixes until no high-severity findings remain. Use when asked to model, evaluate, build a CEA for, or estimate the cost-effectiveness of a charity that has no evaluator CEA to import (for importing a published CEA, use import-cea).
---

# Build a CEA

Goal: `models/<cause>/<charity>-charityevals.json`, owned by `charityevals`, that a donor can
trust and compare with every other model on the site. Three rules decide almost everything:

1. **Comparable**: use the template for the intervention family, its canonical row ids, the
   shared `$assumptions` (moral weights, exchange rates, discount rate, accounting toggles) and
   the shared `@facts` (moral weights, SAD factors, WELLBY conversions, country data). Two models
   of the same family must differ only where the charities differ.
2. **Every number is accounted for**: it is a sourced fact (URL, retrieval date, quote or page),
   a shared assumption, or a labelled model-specific judgment with a rationale and a low/high
   range. Formulas hold no constants beyond unit conversions (`src/engine/lint.ts` lists them).
3. **Faithful to the evidence, not to a hoped-for answer**: when the evidence is thin, say so with
   a wide range and a plain sentence, rather than filling the gap with optimism.

`npm run check` enforces the mechanical half of this (`src/engine/lint.ts`); the audit does the rest.

## 0. Scope and setup

- Inputs: the charity's name and/or website. Optional: an output path (default
  `models/<cause>/<charity>-charityevals.json`), a **blind list** (sources you must not read, used
  in evaluations: see `docs/eval-skills.md`), and a date to use as "today".
- Read `assumptions/default.json`, the `facts/*.json` labels, `src/engine/templates.ts`, and
  [references/templates.md](references/templates.md), especially its **Conventions**: they settle
  cost, attribution, flows vs. stocks and multi-branch programs. Skim a charityevals model of the
  same family if one exists (`grep -l '"template": "<family>"' -r models`), or else an evaluator
  model of the same intervention type, to see what finished explainers look like (unless the
  blind list forbids it).
- If the charity already has a charityevals model, update it instead of starting over.

## 1. Pick the template family

| Family | Use for | Unit |
|---|---|---|
| `direct-health` | deaths and illness averted: nets, SMC, vitamin A, vaccines, deworming, malnutrition treatment, maternal care | uov |
| `cash-income` | cash transfers, graduation programs, agriculture or livelihood programs whose outcome is consumption | uov |
| `wellbeing` | psychotherapy, mental-health care, other programs measured in life satisfaction or depression scores | wellby |
| `corporate-campaign` | cage-free, broiler (BCC/ECC), fish/shrimp stunning and other producer or company welfare reforms, and accountability work on existing pledges | sad |
| `diet-change` | institutional meal replacement, pledges, cooking classes, plant-based outreach | sad |
| `policy-research-meta` | legislation, research, fundraising/meta and capacity building whose value flows through other actors | the downstream unit (uov, sad or wellby) |

A charity with several programs: model the program that takes the most spending (or the one the
charity is known for) with `program_spend` limited to that program, and list the rest under
"What isn't modelled". If a second program is large and fits another family, build it as a second
model `<charity>-charityevals-<program>` (a `variant` cannot change family). Never force a program
into a family whose causal chain doesn't fit; leave it unmodelled and say so.

## 2. Research

Work through [references/research.md](references/research.md). Keep a research log (in your scratch
directory, not the repo): every URL read, date, and the number(s) taken from it with a verbatim
quote and page. In outline:

1. **Money**: audited financial statements or Form 990 / Charity Commission accounts for the latest
   complete year: total expenses, program expenses, the modelled program's spending, staff costs.
2. **Reach**: the charity's own program data for the same year (people treated, nets, hens covered,
   meals replaced), preferably independently verified (coverage surveys, trackers, monitoring reports).
3. **Effect**: the best published evidence for the intervention (Cochrane and other systematic
   reviews, large RCTs), then evidence specific to this charity's implementation.
4. **Baselines**: country data (IHME GBD, UN IGME, DHS, World Bank) for mortality, consumption,
   household size, PPP. Put country data in `facts/<country>.json` (check for an existing fact first).
5. **Existing reviews** (unless blind): evaluator reviews (GiveWell, ACE, HLI, Founders Pledge,
   Rethink Priorities) for checks on your structure and numbers; never copy a number without
   citing it as the evaluator's estimate (`kind: "estimate"`).

## 3. Write the model

Copy `templates/<family>.json` to the output path and fill it in:

- `id` `<charity>-charityevals`, `kind: "charity"`, `charity`, `owner: "charityevals"`, `template`,
  `cause`, `summary` (plain language, 2–4 sentences: what the charity does, where, the bottom line
  as × GiveDirectly, the biggest uncertainty), `source` (`publisher: "charityevals"`, `title`,
  `url: https://charityevals.org/<id>`, `published`, `retrieved`), and `resources` (financials,
  program reports, the studies the effect rests on, evaluator reviews; `type` is one of
  `evaluation`, `model`, `data`, `study`, `charity`, `other`).
- **Keep every canonical row id**; replace every `TEMPLATE:` explainer and the example values.
  A branch that doesn't apply (e.g. later-life income for an adult program) stays as a row with
  value 0 and an explainer saying why. You may add rows (one per age group, per supply chain…)
  as long as they feed the canonical rows.
- **Inputs**:
  - `observed` (from data) and `estimate` (someone's calculation: a study's effect size, an evaluator's
    figure) need `source.url`, `source.retrieved` (YYYY-MM-DD), and `source.quote` (short, verbatim)
    or `source.page` (page, table). Give a range when the source gives a CI or the number is shaky.
  - `judgment` (yours) needs a low/best/high range and an explainer that says why the best guess
    and what each end represents. Anchor judgments in reference classes (other models in the repo,
    published estimates); state the anchor.
  - Shared numbers come from `@facts` or `$assumptions` in formulas, never retyped. If a number
    several models need is missing, add it to the right `facts/*.json` with a source and range.
    Add a new **assumption** to `assumptions/default.json` only for a value judgment no fact can
    settle and that applies across models; give it a sourced default and low/high, and never
    change existing labels.
- **Adjustments**: each adjustment answers one question; don't apply a discount twice (an RCT's
  effect is already relative to its control group, so `counterfactual_adj` is about this program's
  setting, not the trial's). Explain what is *not* adjusted for.
- **Money**: USD of the year spent. Convert other currencies with a sourced average rate for that
  year as an input row (`fx_<cur>_usd`), not a constant in a formula.
- **Write-up** `writeups/<id>.md` when this is the charity's main model (`npm run check` requires it
  for a charity with no other model; a charity with evaluator models keeps theirs), with the
  sections of the import-cea skill (Summary, What the charity does, How the impact happens, How the
  model works, What drives the result, Biggest uncertainties, What isn't modelled, Sources), and
  a short "How this model was checked" section listing the audit rounds and what changed.
- **Charity record** `charities/<id>.json` if missing (name, cause, website, donate link).

Check the mechanics as you go:

```bash
npx tsx scripts/audit-model.ts <path>     # lint, tornado, reference class (exit 1 on high findings)
npm run check -- <id>                     # once the file is in models/
```

## 4. Audit loop (independent)

When the mechanical audit has no high findings, have the model audited **by a separate subagent
with fresh context**, so the reviewer hasn't absorbed your reasoning:

```
Agent(subagent_type: "general-purpose", description: "Audit CEA <id> round <n>",
      prompt: "Use the audit-cea skill (.claude/skills/audit-cea/SKILL.md) to audit <path>.
               Write the findings to <audit dir>/audit-r<n>.md. <blind list, if any: the
               sources you must not read, and pass --exclude <ids> to audit-model.ts>.
               Don't edit the model.")
```

Give the auditor only the model path, the write-up path and the blind list: not your notes,
not this conversation. Keep your research log in a different directory from the audit findings,
so the auditor doesn't stumble on it. Then:

1. Read the findings. Fix every **high** finding; fix **medium** ones unless you disagree, in which
   case answer them in the explainer (the next auditor will read it). Don't argue a high finding
   away in prose unless you have a source that settles it.
2. Re-run `scripts/audit-model.ts`, then start a **new** auditor subagent (round n+1) on the fixed
   model, with the previous findings file so it can check each was resolved.
3. Stop when an audit **of the current version** reports no high findings (a round that found highs
   is always followed by another round on the fixed model), or after **3 rounds**. If high findings remain after
   round 3, don't publish: leave the model out of `models/` (keep it in your scratch dir or the
   eval folder) and report what is unresolved.

Record the rounds (findings count by severity, what changed) in the write-up's "How this model
was checked" section, or in the eval log for evaluation runs.

## 5. Verify and report

`npm run check`, `npm test`, and look at the page (`npm run dev`, `/<charity>` and `/<id>`). (In an
evaluation sandbox without bulk models, run `npx tsx scripts/check.ts <id>` instead and skip the
page.) Report:
the bottom line (native unit, × GiveDirectly, joint low–high), the top 3 swings, the judgment share,
audit rounds with counts, every new fact or assumption added, and what isn't modelled.
