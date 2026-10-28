# Research checklist

Read sources with WebFetch/WebSearch. WebFetch doesn't parse most PDFs: download them into your
scratch directory (its own empty folder) and extract text (`pdftotext` if installed; otherwise
`pypdf` in a scratch venv, or the PDF Read tool page by page). Many publishers (PubMed, ScienceDirect,
Cochrane) show bot checks: use the PMC or Europe PMC copy, the authors' preprint, or the abstract,
and say which you used. Never bypass a bot check. For every number you take, log: URL, retrieval date,
page/table, a verbatim quote of at most one sentence, and the number as you'll enter it (unit,
currency, year).

## Money (cost section, donor section)

- Start with the charity's own financials page (audited statements, 990s it hosts): ProPublica's
  PDF and XML downloads are often behind a bot check.
- US charities: Form 990 via ProPublica Nonprofit Explorer (`projects.propublica.org/nonprofits`),
  Part IX (functional expenses: program, management, fundraising; salaries lines 5–9). UK: Charity
  Commission register (accounts PDF). Elsewhere: the audited statements on the charity's site.
- Use the latest complete fiscal year for which you also have reach numbers; note the fiscal year
  end. If the charity reports program costs per activity, use them for `program_spend`.
- Currency: an input row `fx_<cur>_usd` with the year's average rate (IRS yearly average rates,
  or the central bank), never a constant in a formula.

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

- Mortality: IHME GBD results tool, UN IGME (childmortality.org). Consumption and PPP: World Bank
  (PIP, WDI). Household size: DHS StatCompiler.
- Before adding a fact, grep `facts/` for it. New country data goes in `facts/<country>.json` with
  `source.url`, `retrieved`, and a range when sources disagree.

## Reference classes for judgments

- `npx tsx scripts/audit-model.ts <path>` prints the other hand-built models in the same unit
  and the canonical rows of other charityevals models of the same family. Anchor judgments on
  them ("evidence_adj 0.7, as for X, because …") or explain why this charity differs.
