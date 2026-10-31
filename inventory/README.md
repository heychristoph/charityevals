# Inventory of public evaluator models

Every public cost-effectiveness model we could find from GiveWell, Animal Charity Evaluators, the
Happier Lives Institute, SoGive (`sogive.md`), Founders Pledge (`founders-pledge.md`), Ambitious Impact (`ambitious-impact-models.json`) and Giving Green (`giving-green.md`), checked page by page in October 2026, and what we did with each. Each entry
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
  - the Shamiri Institute;
  - second pass, from the figures in the report text (no public sheet): Fortify Health (sheet behind
    sign-in), Taimaka, ACTRA, icddr,b's Reach Up parenting programme, and, from the 2026 pain report,
    Pallium India and World Spine Care.
- **Not imported:**
  - NEPI: closed in 2025 after financial irregularities, so there is no charity to give to;
  - deworming: HLI's reports link GiveWell's sheets, and its own view is about deworming in general;
  - older reports superseded by the imported ones, cause explorations with no organisation, and
    methodology. `hli-reports.json` gives every report a status.

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

## Ambitious Impact (formerly Charity Entrepreneurship): `ambitious-impact-models.json`

- **Source:** 96 reports. They come from AIM's research site (research.ambitiousimpact.com) and the archived
  report pages of charityentrepreneurship.com (2019–2026: top ideas, considered ideas, the research-reports-2026
  pages), plus the yearly announcement posts and AIM's Zenodo records. Sheet links were read from each report
  PDF and checked against the xlsx export. 79 reports name a CEA sheet; 74 of those sheets are public.
- **Licence:** about 42 reports are on Zenodo under CC BY 4.0, and the entry for each records it. AIM's terms of
  use otherwise reserve rights, allow non-commercial use, and allow citing with attribution.
- **Imported:** 40 models (17 shown, below) in `models/grants/ambitious-impact/` (41 entries: the 2022 milkfish and 2025 East Asian
  fish reports share one sheet), each attached to the charity AIM incubated to run the idea, checked against AIM's full
  list of incubated charities (61 organisations, 2016 to 2026 H1, including shut-down and merged ones). Each is AIM's
  estimate made before the charity existed; under the ranking rules the newest is AIM's figure for that charity.
  - First pass, 21 sheets, via `scripts/convert-sheet.py` and `scripts/link-aim.py` (`scripts/aim-links.json`).
  - Second pass, 19 models: 15 more sheets (Concentric Policies, ARMoR, Notify Health, Center for Alcohol Policy
    Solutions, Foundations First, Neev, Fortify Health, Centre for Effective Aid Policy 2020, Family Empowerment
    Media, Animal Policy International 2022 and 2020, Scale Welfare, Centre for Aquaculture Progress, CEARCH, High
    Impact Professionals) and minimal models from report text where AIM published no sheet (Fish Welfare Initiative,
    Shrimp Welfare Project, Healthier Hens 2018 and 2020).
  - Animal models from before 2024 are in AIM's welfare points. They reach the scale through one bridge of ours,
    `facts/aim_wp.json`: AIM's sentience adjustment taken out, a welfare-point-year turned into days of disabling pain
    (2.1, calibrated on AIM's own welfare points and SADs for the same hen moving out of a battery cage; range
    1.09–9.09), then Rethink Priorities' species weights as in every animal model.
  - EA-meta models (CEARCH, High Impact Professionals) report dollars of top EA donations; a bridge of ours values
    those at a multiple of GiveWell's cash benchmark (GiveWell's funding bar), with a range.
  - AIM's co-founder and funding counterfactuals are left out of our view (owner decision 2026-10-31; AIM's figure
    stays in the evaluator view); founders' forgone pay is our staff-pay step under "Credit by share of resources".
  - AIM's DALY-equivalents are decomposed in our view: income, deaths and discounting read the shared values
    (`scripts/aim-shared-rates.py`, docs/normalization.md "Decided 2026-10-31").
- **Shown only where it applies** (owner decision 2026-10-31, `scripts/aim-theoretical.py`): an AIM model is a
  pre-founding estimate of an idea, so it is shown only if the charity runs the modelled programme today and no model
  of the charity's actual work exists. 17 models are kept, each marked `theoretical` with the page that shows the
  charity runs the programme (the entry's `theoretical` field), and flagged "purely theoretical" on the site. 23 are
  not shown, each entry's status says why: 10 charities have another evaluator's model of their actual work (ACTRA,
  Ansh, Clear Solutions, Family Empowerment Media, Fortify Health, Healthy Futures, LEEP, Notify Health, Shrimp
  Welfare Project, Spiro); the charity closed (Healthier Hens, both models; Centre for Effective Aid Policy, both;
  Maternal Health Initiative); it doesn't run the modelled programme (Animal Policy International's 2020 precursor
  idea, Fish Welfare Initiative's aeration, Radius Institute's seat-belt law, Rahi Impact's Nepal platform, High
  Impact Professionals' earning-to-give support, Scale Welfare's milkfish water quality); or no evidence it runs it
  today (Center for Alcohol Policy Solutions, Foundations First).
- **Not imported** (each entry says why):
  - 41 ideas with no organisation founded from them after the re-check (welfare-point sheets among them), including
    Lafiya Nigeria's case (it started independently and AIM didn't recommend the 2020 idea) and the 2026 aid-quality
    replication, written after the Centre for Effective Aid Policy closed.
  - 6 pages with no AIM estimate of their own (only literature figures, partial costs or none).
  - 5 private or deleted sheets; 1 breakeven analysis; 2 Fortify Health CEAs that are Fortify's own and already
    imported as GiveWell's.

## Giving Green: `giving-green.md`

- **Source:** all 337 pages in Giving Green's sitemap (`/research/`, `/post/` and the site pages),
  the PDFs they link, and every linked Google Sheet (tested through its public export): 42 entries
  with a cost-effectiveness claim, a dollars-per-tonne figure or a linked model.
- **Imported:** 7 models, all climate, in tonnes of CO₂e converted with the shared climate rate: The
  Good Food Institute, Future Cleantech Architects, Opportunity Green, Evergreen Collaborative (2022,
  and its superseded 2021 analysis), Carbon180 and Industrious Labs (from the figures in Giving Green's
  2024 deep dive; no sheet is published).
- **Not imported:** Giving Green uses its estimates only as plausibility checks against a $1-a-tonne
  benchmark, and most of its pages are qualitative. Left out: recommendations with no published figure
  (Clean Air Task Force and Project InnerSpace, which Giving Green "chose not to quantify"; the
  Australian list and the grantee spotlights), strategy-level sheets with no charity, companies selling
  offsets, not charities (BURN, Tradewater, Climeworks and others), and a superseded copy of the GFI
  sheet. The file lists every entry and its reason.
