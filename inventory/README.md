# Inventory of public evaluator models

Every public cost-effectiveness model we could find from GiveWell, Animal Charity Evaluators, Founders Pledge, Giving Green and the
Happier Lives Institute, checked page by page in October 2026, and what we did with each. Each entry
has a `status`: `imported` (with the model id), or `not imported:` with the reason.

## GiveWell: `givewell-models.json`, `givewell-sheets.json`

- **Source:** GiveWell's grants database (570 grants, read from the Airtable view on its
  [all-grants page](https://www.givewell.org/research/all-grants)) links 282 distinct grant pages. Every
  Google Sheet those pages link was collected: 506 sheets.
- **Imported:** 151 models, one per sheet that estimates a program's or grant's cost-effectiveness:
  top-charity grants, renewals, research and value-of-information grants, and BOTECs.
- **Not imported:**
  - 26 of GiveWell's yearly multi-charity CEAs (2016–2023), superseded by the current top-charity
    models;
  - 14 archived copies and change trackers;
  - about 300 supporting sheets: costs per unit, room for more funding, budgets and inputs;
  - a handful of copies identical to an imported sheet;
  - one sheet that now needs sign-in.
- **How:** `scripts/givewell-manifest.py` decides what to import and from which cell.
  `scripts/import-givewell-grants.py` downloads each sheet and runs `scripts/convert-sheet.py` on it.
  The converter traces the bottom line through every cell it depends on, and each calculated row must
  reproduce the sheet's value; `npm run check` enforces this.
- **Linked like the hand-built models:** `scripts/link-parameters.py` ties each sheet's moral weights,
  discount rate and values of consumption and of a DALY to the shared assumptions; the sheet's own
  values go into the model's evaluator settings. Statistics several sheets share (mortality, population,
  prevalence) live once in `facts/givewell*.json`.
- **Fixed numbers:** formulas the engine can't express are kept as fixed numbers with the original
  formula on the row. These are mostly array formulas, text, conditional sums and IMPORTRANGE.
  Lookups with fixed keys (INDEX, MATCH, FILTER) are resolved to the cell they point at, so they stay
  traceable.

## Animal Charity Evaluators: `ace-models.json`

- **Source:** 58 live review pages from 2014 to 2023, found through the Wayback Machine's index of
  `/charity-review/` and checked on the live site. The current reviews of the ten recommended charities
  were imported earlier (`models/animal-welfare/`).
- **Imported:** the four 2016 Guesstimate models that are still public (HSUS Farm Animal Protection
  Campaign, Vegan Outreach, Albert Schweitzer Foundation, Vegetarierbund Deutschland), via
  `scripts/convert-guesstimate.py`. Their unit is "animals spared per dollar", which has no exchange
  rate, so they are listed but not ranked.
- **Not imported:**
  - 34 Guesstimate models from 2017–2021: Guesstimate returns 401 for them now and the Wayback Machine
    has no copy;
  - the 2019 estimates spreadsheet and the 2022–23 assessment sheets: they score achievements on 1–7
    scales and contain no per-dollar estimate in a unit of impact;
  - room-for-more-funding models and priority scores.

## Happier Lives Institute: `hli-models.json`, `hli-reports.json`

- **Source:** all 63 reports in HLI's sitemap.
- **Imported earlier:** StrongMinds, Friendship Bench, AMF and GiveDirectly.
- **Imported now:**
  - Pure Earth's advocacy against leaded cosmetics in Ghana, both the current sheet and the one before
    HLI's July 2025 correction;
  - the Shamiri Institute.
- **Not imported:**
  - Fortify Health: HLI's sheet asks for sign-in;
  - Taimaka: HLI links GiveWell's model, imported under GiveWell;
  - ACTRA and NEPi: no spreadsheet;
  - deworming: HLI's reports link GiveWell's sheets.

## Founders Pledge: `founders-pledge.md`

- **Source:** every `/research/` page in FP's sitemap, its older report PDFs and linked Google Docs,
  and FP staff's EA Forum posts: 103 pages or reports with a cost-effectiveness claim or model, 35 of
  them with a public sheet.
- **Imported:** 14 models: Clean Air Task Force and Coalition for Rainforest Nations (climate, in
  tonnes of CO₂e), and twelve global health, wellbeing, education and policy models.
- **Not imported:** recommendation pages with no published model (most since 2022, and every
  climate, catastrophic-risk and animal page since 2020), pages that rest on GiveWell's models,
  sheets behind sign-in, intervention-level or hypothetical sheets, and three sheets whose unit or
  figure doesn't carry over (No Means No Worldwide, TerraPraxis, The Humane League 2019). The file
  lists every entry and its reason.

## Giving Green: `giving-green.md`

- **Source:** all 337 pages in Giving Green's sitemap (`/research/`, `/post/` and the site pages),
  the PDFs they link, and every linked Google Sheet (tested through its public export): 42 entries
  with a cost-effectiveness claim, a dollars-per-tonne figure or a linked model.
- **Imported:** 6 models, all climate, in tonnes of CO₂e converted with the shared climate rate: The
  Good Food Institute, Future Cleantech Architects, Opportunity Green, Evergreen Collaborative (2022,
  and its superseded 2021 analysis) and Carbon180.
- **Not imported:** Giving Green uses its estimates only as plausibility checks against a $1-a-tonne
  benchmark, and most of its pages are qualitative. Left out: recommendations with no published figure
  (Clean Air Task Force rests on Founders Pledge's estimate; Industrious Labs, Project InnerSpace,
  the Australian list and the grantee spotlights), strategy-level sheets with no charity, offsets
  bought from companies (BURN, Tradewater, Climeworks and others), and a superseded copy of the GFI
  sheet. The file lists every entry and its reason.
