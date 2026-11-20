# charityevals

Open, forkable cost-effectiveness analyses (CEAs) for charities: [charityevals.org](https://charityevals.org).

Every model is a JSON file in this repo. Every input has a source, a low/best/high range, a kind
(observed, estimate, judgment) and a plain-language explainer. Shared moral weights and cross-cause
exchange rates live in one file, and visitors can change them in the browser to re-rank everything.

To suggest a charity, report an error or add a model, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Layout

```
charities/<id>.json          a charity: name, website, donate link; its page is /<id>
owners.json                  who makes models: GiveWell, ACE, HLI, charityevals
models/<cause>/<id>.json     a model of one charity by one owner (several per charity allowed),
                             or a country/program variant of one
writeups/<id>.md             one-page evaluation shown on the charity's page
assumptions/default.json     moral weights, exchange rates, accounting toggles, units
brand/final/                 logo masters (colour, black, white, symbol); brand/concepts/ holds earlier rounds
facts/<place>.json           shared data (PPP, mortality…) referenced as @kenya.ppp_factor_2017
src/engine/                  formula language, model resolution (extends), compute, sensitivity
src/pages, src/components    Astro site with React islands
scripts/check.ts             validates models and proves they reproduce their sources
scripts/sheet-dump.py        dumps a Google Sheet's formulas and values for importing
scripts/import-givewell.sh   re-imports GiveWell's top charities (convert-givewell.py)
scripts/import-ace.sh        re-imports ACE's recommended charities (convert-ace.py)
scripts/convert-hli-psychotherapy.py  HLI's StrongMinds / Friendship Bench model
scripts/import-resources.sh  refreshes each charity's evidence and sources list
.claude/skills/import-cea/   Claude skill: turn a published CEA into a model
.claude/skills/build-cea/    Claude skill: build charityevals' own CEA of any charity from public evidence
.claude/skills/audit-cea/    Claude skill: independent audit of a model (sources, double counting, sensitivity)
scripts/audit-model.ts       mechanical audit: template lint, tornado, reference class
evaluation/                  blind tests of build-cea against evaluator models (docs/eval-skills.md)
```

## Models

A model is an ordered list of rows. Input rows have a `value` (a number or `{low, best, high}`),
a `kind` and a `source` or `explainer`. Calculated rows have a `formula` over other row ids and
`$assumptions`, e.g. `y1_uov_per_person * people_reached` or `y1_ln_gain * $uov_per_ln_consumption`.

- **Charities and owners:** each model names its `charity` and its `owner`. A charity can have
  models from several owners (AMF has GiveWell's and HLI's); the rankings show one row per
  charity with a dot per owner, placed at their geometric mean, and the charity page has a tab
  per owner. The first owner in `owners.json` with a model is the charity's main page.
- **Inheritance:** `"extends": "givedirectly"` copies every row of the parent; the child lists only
  the rows it changes. See `models/global-health/givedirectly-malawi.json`.
- **Reproduction:** `expected` on a row holds the value the original spreadsheet shows.
  `npm run check` fails if the model doesn't reproduce it.
- **Evaluator's assumptions:** every model is its evaluator's, and reproduces their numbers under
  their own moral weights and accounting (pinned in `evaluator`). The site computes with the
  visitor's shared assumptions; where those move a result, the model page says so and offers a reset
  to the evaluator's own (the *evaluator view*). Where we disagree with an input, `published` keeps
  the evaluator's value.
- **Credit:** two settings. Co-funders can be credited by what each paid (staff's forgone pay
  counts). A charity gets 30% by default of the good done with money, work or budgets it brings in.
- **History:** `/<id>/history` rebuilds the library at every commit that touched the model, its
  parents, assumptions or facts, and shows how the result and each row changed.
- **Units:** each model reports per dollar in its own unit (`uov`, `sad`). `assumptions/default.json`
  defines how each unit converts to the common unit, via assumptions the visitor controls. Every
  charity is ranked, so a new unit needs an exchange rate (`npm run check` fails without one).

## Sensitivity

Each result is simulated: every uncertain input is drawn 1,000 times across its range (a default
spread by input type where none is published), and the rankings show the 5–95% range. A single event
a model rests on (a law passing, a new charity succeeding) is drawn as happens or doesn't. Where the
simulation can't be relied on, the figure stays at its best guess and the bar runs from every input at
its worse end to every input at its better end. Model pages add a one-at-a-time sensitivity and each
input's share of the uncertainty. Flags: a range over 100×, uncertainty mostly from judgment, an
analysis over 18 months old, programmes left out, a simulation that can't be relied on, a purely
theoretical model.

## Commands

```bash
npm install
npm run check                 # validate all models; npm run check -- <id> prints its tornado
npm test                      # engine tests
npm run dev                   # site at http://localhost:4321
npm run build                 # check, then static build into dist/
```

## Importing a CEA

In Claude Code, ask to import a published CEA (a GiveWell or ACE sheet, say). The `import-cea`
skill dumps the sheet, writes the model row by row with sources and explainers, and iterates until
`npm run check` reproduces every number.

## Licences

- Our own models, write-ups, shared facts and assumptions, and the site's figures:
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit "charityevals (charityevals.org)"
  with a link to the page; each model page has a Cite button.
- Models rebuilt from an evaluator's analysis, and figures taken from one, keep that evaluator's
  terms (`source.license`, shown on each model page): GiveWell's are
  [CC BY-NC-SA 3.0 US](https://creativecommons.org/licenses/by-nc-sa/3.0/us/); for others, check
  their terms. The evaluators have not reviewed or endorsed this project.
- Code: [MIT](LICENSE).

One place decides a model's terms: `src/lib/licence.ts` (`licenceOf`).
