# Research log: The Humane League (blind build-cea run, 2026-11-03)

All retrieved 2026-11-03.

## Blind-rule incidents
1. `grep` over the sandbox for "humane league" (to find files to avoid) printed lines of
   sandbox/docs/normalization.md that contain ACE's and Founders Pledge's results for THL
   (normalization.md lines ~732, 734, 886, 956, 1090-91: before/after figures in healthy years per
   $1,000 and SADs per hen-year figures) and facts/sad_factors.json notes citing ACE's THL CEA
   tabs. I did not use those figures. The shared facts (@sad_factors.*) are the site's shared
   figures every model must read (SKILL.md); some of their range ends are sourced from ACE's THL
   sheet. I read only their values, not their notes in detail.
2. WebSearch for THL's EA Forum methodology post: the result summary showed ACE's and Šimčikas'
   / Open Philanthropy's / Rethink Priorities' hens-per-dollar figures for THL. Not followed, not used.
3. The scratchpad root (parent of my scratch dir) holds the parent session's files (incl. a
   `thl2` folder and ACE sheet downloads). I listed it once by accident when creating a venv
   (`ls` output only); I read none of those files and built my own venv inside my scratch dir.
4. Annual report 2025 page quotes ACE's recommendation text (no figures) - harmless.

## Money (2025, calendar year; latest audited)
- Audited FS 2025: https://assets.ctfassets.net/ww1ie0z745y7/3MRkx2O0dJW83bmfvo5rZa/56fa379bccf43148fb2b2a135fe72c62/Final_FS_-_230180_THL_AUD_1225.pdf
  - p.5 (PDF p.7) Statement of functional expenses: "Total Expenses 14,620,067$ 4,300,517 $ 2,689,268 $ 21,609,852 $"
    -> program 14,620,067; M&G 4,300,517; fundraising 2,689,268; total 21,609,852.
  - "Salaries and benefits 7,130,974 $ 2,847,282 $ 1,689,425 $ 11,667,681 $" -> staff 11,667,681 (54.0% of total).
  - "Grants and awards 4,261,891" (program).
  - Note 7: "the Organization provided a grant to THL-UK in the amount of $2,150,000."
  - Note 6: one donor 48% of revenue.
- Form 990 2025: https://assets.ctfassets.net/ww1ie0z745y7/6WLliKUVCOcObDcOcBy98N/677ca120386240c5bae939727477b922/THL_Public_Disclosure_Copy_990.pdf
  - Part III one program line 14,619,381 incl. grants 4,261,891.
  - Schedule C Part II-A, 2025: grassroots lobbying 159,162; direct lobbying 247,491; total 406,653.
  - Schedule O: "WE SECURED BRAND NEW CORPORATE COMMITMENTS TO END THE USE OF CAGES IN THEIR SUPPLY CHAINS THAT WILL SPARE 1.6 MILLION HENS AROUND THE WORLD"
  - "OVERALL, WE PRESSURED 131 COMPANIES TO MAKE PROGRESS TOWARD THEIR PROMISES, IMPACTING MORE THAN 160 MILLION HENS, AND SAW A 92% FULFILLMENT RATE FOR CORPORATE CAGE-FREE COMMITMENTS WITH DEADLINES OF 2024 OR EARLIER."
  - "THROUGH OUR GLOBAL COALITION, WE SECURED 234 NEW CORPORATE COMMITMENTS FOR CHICKENS AROUND THE WORLD, WITH MORE THAN 60 OF THOSE COMMITMENTS ESTABLISHED IN AFRICA."
  - "THROUGH $300K IN GRANTS TO 12 APA MEMBER GROUPS, WE ALSO SUPPORTED 10 MAJOR LEGISLATIVE VICTORIES"
  - Subway: "SPARING NEARLY 340,000 HENS ANNUALLY"
- Annual report 2025 booklet: https://downloads.ctfassets.net/ww1ie0z745y7/6T4MyY2CVXWdL9Qf4bpGPy/b68f12c43e59b2b9b45490aa8ef571c3/25-annual-report-booklet-design-final-digital-04-29-pages.pdf
  - p.17 (preliminary, pre-audit): Global Programs $5,204,000 (36%; "Includes grants for THL UK. Does not include OWA grants."); Education & Mobilization $4,664,000 (33%); US Public Policy & Corporate Engagement $2,498,000 (17%); OWA & APA Grants $1,991,000 (14%); programs total $14,357,000; total opex $21,599,000.
  - p.3: "1.6M HENS IMPACTED by 4 companies' new commitments to end cages in their supply chains"; "7.5M HENS SPARED from cages around the globe, with additional commitments cemented TO SPARE 162.5M MORE EVERY YEAR"; "92% OF CORPORATE CAGE-FREE COMMITMENTS with deadlines of 2024 or earlier were fulfilled"
  - p.2: "we've pressured 131 companies to make progress towards their promises to spare more than 160M hens from extreme confinement."
  - p.16: THL's own CEA: "For every $1 spent on corporate cage-free campaigns, TWO HENS WERE SPARED FROM LIFE IN A CAGE." (charity's own, 2015-2024 data)
- Annual report web page https://act.thehumaneleague.org/annual-report-2025 ; financial graph image (same shares).
- THL methodology https://thehumaneleague.org/article/fifty-cents-to-spare-a-hen : formula hens covered x fulfilled share x 50% credit / costs 2015-2024; "we went with 50% as a conservative estimate"; no totals published. EA Forum post (Fbx9hf2e6MaLfoNwD) via forum-bots mirror: "We apply a 50% multiplier to the number of hens impacted."; underlying data not published. Main site returned 429.
- 2025 room for funding https://thehumaneleague.org/article/2025-room-for-funding : no program budget; "we will need to raise at least $21 million to fund our 2025 operating budget."

## Reach
- OWA 2025 end-of-year review https://thehumaneleague.org/article/2025-owa-end-of-year-review :
  "216 new cage-free policies are now secured"; "18 new policies have been implemented" (broiler);
  "$2,111,701 in 36 organizations across 30 countries and six continents"; "More than 525 staff" (OWA members, cage-free and broiler);
  REWE "an estimated 7 million hens each year", 83% progress; Best Western ~70% cage-free.
  New commitments named: Agro Innova (Ghana, ~15M eggs/month), Locavore NXT, Mana Earthly Paradise (Indonesia), Lidl Latvia.
- No independent tracker figure for THL's hen counts: all reach is THL's own count.

## Not accessible
- EA Forum main domain (HTTP 429); used forum-bots mirror.
- No program-level audited split; used the annual report's preliminary split.

## Judgments (see model explainers)
- Policy share of programme spending 7.5% (5-11%): lobbying $0.41M (990 Sch. C) + APA grants $0.30M + policy staff/litigation; below a tenth, left out.
- Hens per other OWA cage-free policy 10,000 (2,000-50,000).
- Accountability counterfactual 0.2 (0.05-0.5); anchor (0.92-0.77)/0.92 = 0.16.
- Enriched-cage share 0.2 (0.05-0.4).

## Later incidents and sources
5. While reading the shared fact facts/sad_factors.json commitment_fulfilment_cage_free (to answer audit r1), its explainer listed ACE's fulfilment rates for THL (0.65-0.9). Not used.
6. Auditor r2 reported a WebFetch cache copy of THL UK's 2022-23 report saved outside the sandbox (~/.claude/projects/.../tool-results/webfetch-1793706871789-ppunuo.pdf); not read by me, not deleted.
- THL UK impact page https://thehumaneleague.org.uk/impact : no spending split; annual report page empty to WebFetch.
- Search snippet (2026-11-03): an earlier Fair and Fowl report estimated ~3.4M hens spared in the prior year (EA Forum profile cara-schwalbach-thl). Used only as an anchor for acc_evidence_adj.
- THL 2025 annual report p.3: "7.5M HENS SPARED from cages around the globe" -> hens_spared_2025.
