# Research checklist

Every number in the model must trace to a source a reader can open, so the log below is what the
model's `source` fields and the auditor's checks are built from. Terms: [templates.md](templates.md#glossary).

Read sources with WebFetch/WebSearch. WebFetch doesn't parse most PDFs: download them into your
scratch directory (its own empty folder) and read them with the Read tool, page by page (`pages`);
`pdftotext` is usually not installed. Many publishers (PubMed, ScienceDirect,
Cochrane) show bot checks: use the PMC or Europe PMC copy, the authors' preprint, or the abstract,
and say which you used. Never bypass a bot check. For every number you take, log: URL, retrieval date,
page/table, a verbatim quote of at most one sentence, and the number as you'll enter it (unit,
currency, year).

## Money (cost section, donor section)

- Start with the charity's own financials page (audited statements, 990s it hosts): open the listing
  page and take the latest audited year it links, never a guessed URL for a year (a missing file isn't
  proof the year is unaudited). ProPublica's PDF and XML downloads are often behind a bot check.
- US charities: Form 990 via ProPublica Nonprofit Explorer (`projects.propublica.org/nonprofits`),
  Part IX (functional expenses: program, management, fundraising; salaries lines 5–9). UK: Charity
  Commission register (accounts PDF). Elsewhere: the audited statements on the charity's site.
- Use the latest complete fiscal year for which you also have reach numbers (cost and reach must
  describe the same work); note the fiscal year end. If the charity reports program costs per activity, use them for `program_spend`.
- Currency: the local-currency amount times `@fx.usd_per_<cur>_<year>` (the IRS yearly average
  where the IRS lists the currency, else the World Bank's official rate; `scripts/link-fx.py` adds a
  missing year), never a typed rate or a constant in a formula.
- Programmes: list every programme with its spending for the year (the statement of functional
  expenses or the annual report's breakdown); you model every one, weighted by
  spending (SKILL.md step 0); note which have no outcome data at all (the proxy rows).

## Reach (reach section)

- Annual report / impact page / monitoring reports for the same year. Prefer independent
  measurement (coverage surveys, third-party trackers such as the Cage-Free Tracker or
  ChickenWatch, external M&E) over administrative counts; when you only have the charity's own
  count, say so and widen `implementation_adj`.

## Effect (effect section)

- Systematic reviews first (Cochrane, Campbell, 3ie), then the large RCTs, then implementation-
  specific evidence. Record the point estimate and the 95% CI; use the CI as the low/high range.
- Check whether the trial population resembles the charity's (age, baseline risk, country) and
  put the gap into `evidence_adj` (external validity) with a reason.
- Evaluator intervention reports (GiveWell, ACE, HLI, Founders Pledge, Rethink Priorities)
  summarise the literature; cite the underlying study where you can. In a blind run, the blind
  list says which of these you must not read.

## Baselines and shared facts

- Mortality: IHME GBD results tool, UN IGME (childmortality.org). The age split of the deaths (each
  band is valued at its own `@moral_weights`, the shared value of a death by age): WHO Global Health
  Estimates (by cause, age, sex and country, latest year; IHME GBD where WHO has no split). Consumption and PPP: World Bank (PIP, WDI).
  Household size: facts/household_size.json first; a missing place gets its latest DHS figure
  (StatCompiler, mean usual members per household) as a new fact there.
- Before adding a fact, grep `facts/` for it. New country data goes in `facts/<country>.json` with
  `source.url`, `retrieved`, and a range when sources disagree.
- Animals: SADs (suffering-adjusted days) per physical change come from facts/sad_factors.json (one figure per change; a new
  change gets a new fact with a `change` note and its SAD version). Reach is the animals under the
  commitments won or tracked in the year (Chicken Watch, the Cage-Free Tracker, company reports);
  pledges kept, years counted and production response are shared figures, not research targets (every
  animal model uses the same ones). A country's meal mix only from a published estimate covering both
  it and the reference meal. Species weights come only from facts/welfare_ranges.json (Rethink
  Priorities, relative to a chicken), through the `ced_<s>` rows (the species step); a species it lacks
  uses the stand-ins of docs/normalization.md, decision 6.

## Reference classes for judgments

- `npx tsx scripts/audit-model.ts <path>` prints the other hand-built models in the same unit (in
  years of healthy life per $1,000) and the canonical rows (the row ids every model of a family shares)
  of other charityevals models of the same family. Anchor judgments on them ("evidence_adj 0.7, as for
  X, because …") or explain why this charity differs: an unanchored guess can't be checked.
