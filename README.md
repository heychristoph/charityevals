# charityevals

Open, forkable cost-effectiveness analyses (CEAs) for charities: [charityevals.org](https://charityevals.org).

Every model is a JSON file in this repo. Every input has a source, a low/best/high range, a kind
(observed, estimate, judgment) and a plain-language explainer. Shared moral weights and cross-cause
exchange rates live in one file, and visitors can change them in the browser to re-rank everything.

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
- **Accounting toggles:** staff salary sacrifice counted as an in-kind donation, and shared vs full
  credit for outcomes several organisations contribute to.
- **History:** `/<id>/history` rebuilds the library at every commit that touched the model, its
  parents, assumptions or facts, and shows how the result and each row changed.
- **Units:** each model reports per dollar in its own unit (`uov`, `sad`). `assumptions/default.json`
  defines how each unit converts to the common unit, via assumptions the visitor controls.

## Sensitivity

No Monte Carlo. Each result has a central value (all inputs at best), a joint low and joint high
(each input at whichever end lowers or raises the result), a one-at-a-time sensitivity, and on model pages a breakdown of where the uncertainty comes from (default ranges by input type where none is published). Flags:
joint spread over 100×, more than half the uncertainty from judgment, inputs without ranges,
source older than 18 months, and assumptions that reorder the ranking.

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

Code: MIT. Models derived from GiveWell are CC BY-NC-SA 3.0 US. ACE's terms for derived data are
not yet confirmed. GiveWell and ACE have not reviewed or endorsed this project.
