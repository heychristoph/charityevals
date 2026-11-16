# Research checklist

Every number must trace to a source a reader can open: the research notes feed the model's `source`
fields and the auditor's checks. Terms: [templates.md](templates.md#glossary).

Pages: `scripts/fetch.sh <url>` (verbatim text; WebFetch paraphrases). PDFs: download into their own
empty scratch folder, then `scripts/pdf-text.sh <pdf>`. Many publishers (PubMed, ScienceDirect,
Cochrane) show bot checks: use the PMC copy, a preprint or the abstract, and say which. Never bypass a
bot check; if the latest accounts sit only behind one, stop and name the file.

**Research notes** (`<scratch>/<charity id>/research-notes.md`), one table per section below, a row
per number: `| what | value | unit, currency, year | URL | retrieved | page/table | quote (≤1 sentence) |`.
Accounts go by programme and year (fiscal year end, audited or not); reach and effects name the
programme; end with **Gaps**: what wasn't found and where you looked.

## Money (cost section, donor section)

- Start with the charity's own financials page (audited statements, 990s it hosts): open the listing
  page and take the latest audited year it links, never a guessed URL (a missing file isn't proof the
  year is unaudited). ProPublica's downloads often show a bot check; `python3 scripts/irs-990.py EIN
  --year T --summary` fetches the IRS e-file XML (its range-read subcommand reads one return from the
  bulk zip).
- US charities: Form 990 via ProPublica Nonprofit Explorer (`projects.propublica.org/nonprofits`),
  Part IX (functional expenses: program, management, fundraising; salaries lines 5–9). UK: Charity
  Commission register (accounts PDF). Elsewhere: the audited statements on the charity's site.
- The latest complete fiscal year for which you also have reach (cost and reach describe the same
  work); note the fiscal year end. Program costs per activity, where reported, go in `program_spend`.
- Currency: record the local-currency amount; the model converts it at `@fx` (templates.md Convention 8).
- Programmes: list every programme with its spending for the year (the statement of functional
  expenses or the annual report's breakdown), noting which have thin outcome data (templates.md
  Convention 12).

## Reach (reach section)

- Annual report / impact page / monitoring reports for the same year. Prefer independent
  measurement (coverage surveys, third-party trackers, external M&E) over administrative counts;
  when you only have the charity's own count, say so and widen `implementation_adj`.

## Effect (effect section)

- Evaluations of this charity's own programmes first: search its name and each programme's name with
  "RCT", "evaluation", "impact", "trial" (charity site, 3ie, AEA RCT Registry, J-PAL/IPA, government
  pilots it ran or scaled); list every one found, or "none found" with the queries, in its own table.
- Then meta-analyses and systematic reviews (Cochrane, Campbell, 3ie), the large RCTs, then
  implementation-specific evidence. Search with the Consensus research MCP (its `search` tool) where
  connected, else PubMed, Europe PMC or web search; cite the paper itself, never Consensus. Record
  the point estimate and the 95% CI as the range. A programme with thin or no outcome data is built
  from this: effect per person or per dollar, and persistence.
- Check whether the trial population resembles the charity's (age, baseline risk, country) and
  put the gap into `evidence_adj` (external validity) with a reason.
- Evaluator intervention reports (GiveWell, ACE, HLI, Rethink Priorities) summarise the literature;
  cite the underlying study. In a blind run, the blind list says which of these you must not read.

## Baselines and shared facts

- Mortality: IHME GBD results tool, UN IGME (childmortality.org). The deaths' age split (each band is
  valued at its own `@moral_weights`): WHO Global Health Estimates (by cause, age, sex and country,
  latest year; IHME GBD where WHO has no split). Consumption and PPP: World Bank (PIP, WDI).
  Household size: facts/household_size.json first; a missing place gets its latest DHS figure
  (StatCompiler, mean usual members per household) as a new fact there.
- New country data goes in `facts/<country>.json` with `source.url`, `retrieved`, and a range when
  sources disagree.
- Animals: SADs per physical change from facts/sad_factors.json (a new change: templates.md,
  corporate-campaign). Reach is the animals under the commitments won or tracked in the year (Chicken
  Watch, the Cage-Free Tracker, company reports). Pledges kept, years counted, production response
  and species weights (facts/welfare_ranges.json; a species it lacks takes the stand-ins of
  docs/normalization.md, decision 6) are shared figures, not research targets. A country's meal mix
  only from a published estimate covering both it and the reference meal.

## Reference classes for judgments

- `npx tsx scripts/audit-model.ts <path>` prints the other hand-built models in the same unit and the
  canonical rows of other charityevals models of the same family: use them to keep judgments
  consistent. The explainer anchors on studies, evaluations or data (templates.md Convention 10).
