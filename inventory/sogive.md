# SoGive

Every public SoGive analysis we could find that might hold a cost-effectiveness estimate, checked page
by page on 2026-10-30, and what we did with each. Each entry has a status: `imported` (with the model
id), or `not imported:` with the reason.

## Where we looked

- **EA Forum.** The [SoGive tag](https://forum.effectivealtruism.org/topics/sogive), the SoGive account
  and the posts by SoGive's analysts (Sanjay Joshi, Ishaan Guha): 45 posts. Every Google Sheet and Doc
  they link was opened (30 sheets, 13 docs). Posts after 1 December 2022 are CC BY 4.0, the Forum's
  default licence; SoGive's sheets and docs carry no licence.
- **sogive.org blog.** It mirrored the Forum posts. It is offline now (the live site serves only the
  donation app), and the Wayback Machine holds just the listing page.
- **SoGive's charity database** (the app at sogive.org, through its public `search.json`). It returned
  about 10,000 UK charity records, capped at 10,000. 167 carry a rating: 6 high, 2 medium, 72 low,
  78 more-info-needed, 4 too-rich, 4 very-low, 1 slightly-low.

## Imported

| Analysis | Source | Date | Licence | Model | Result (SoGive) |
|---|---|---|---|---|---|
| StrongMinds, 2024 update | [SoGive CEA sheet](https://docs.google.com/spreadsheets/d/1sNB40ot0sfa4v3OdF0Pv9F99hSKImbrjyTVfnISJeFU/edit), tabs '2024 simplified cea' and '2024 expanded cea' | July 2024 (from a dated note; the sheet says "in progress") | none published | `strongminds-sogive` | $622.89 per DALY of depression averted |
| StrongMinds, March 2024 | same sheet, tabs 'simplified cea' and 'expanded cea'; [StrongMinds (6 of 9)](https://forum.effectivealtruism.org/posts/QptTu7QnF4S69opjB) | 2024-03-20 | post CC BY 4.0; sheet none | `strongminds-sogive-march-2024` | $1,208.03 per DALY |
| Deworming: Deworm the World | [SoGive Deworming CEA (adapted from GiveWell 2022 v1)](https://docs.google.com/spreadsheets/d/1jMzMHzilvceamu5UzyKdG_eZ8IJ5-6WOBs2nmZGeozE/edit), 'Summary Table'!B7; [Economic losers](https://forum.effectivealtruism.org/posts/kwBoqZcHwo7Dhut94) | 2022-09-01 | none published; built on GiveWell's (CC BY-NC-SA 3.0 US) | `evidence-action-deworm-the-world-sogive-2022` | 0.0309 units of value per $ (£24.27 per year of doubled consumption) |
| Deworming: END Fund | same, C7 | 2022-09-01 | same | `end-fund-deworming-sogive-2022` (new charity `end-fund`) | 0.0186 (£40.29) |
| Deworming: SCI Foundation (now Unlimit Health) | same, D7 | 2022-09-01 | same | `unlimit-health-deworming-sogive-2022` (new charity `unlimit-health`) | 0.0202 (£37.04) |
| Deworming: Sightsavers | same, E7 | 2022-09-01 | same | `sightsavers-deworming-sogive-2022` | 0.0321 (£23.39) |
| Royal National Lifeboat Institution | [SoGive charity page](https://app.sogive.org/#charity?charityId=the-royal-national-lifeboat-institution) (database analysis, text only) | 2020-10-15 (record last modified) | none; SoGive's data terms: free for charity analysis with attribution and a link back | `royal-national-lifeboat-institution-sogive` (new charity) | £421,299 direct cost per life saved (£497,662 with overheads) |
| Breast Cancer Now | [SoGive charity page](https://app.sogive.org/#charity?charityId=breast-cancer-now) (text only) | undated; cites 2019–20 accounts, dated 2021 here | same | `breast-cancer-now-sogive` (new charity) | £1,000–£8,800 per QALY for UK breast cancer research (£2,484 at our middle share) |
| Compassion UK | [SoGive charity page](https://app.sogive.org/#charity?charityId=compassion-uk-christian-child-development) (text only) | 2020-11-11 | same | `compassion-uk-sogive` (new charity `compassion-uk`) | £500 per year of additional income |
| Woodland Trust | [SoGive charity page](https://app.sogive.org/#charity?charityId=woodland-trust) (text only) | 2020-11-16 | same | `woodland-trust-sogive` (new charity) | £2.14 per tonne of CO₂ taken up by planting (£7.40 for restoration) |

How: StrongMinds is hand-built (row per sheet row). Deworming is traced from each bottom line by
`scripts/import-sogive.py`, which reuses `scripts/convert-sheet.py` and links like GiveWell's sheets
(moral weights, discount rate, leverage and funging, staff pay, GiveWell facts). Every `expected` value
reproduces in the evaluator view (`npm run check`). The four database analyses (second pass, October 2026) have no
spreadsheet: each model is built from the figures stated in SoGive's text, each quoted on its row, and
reproduces SoGive's figure; pounds are converted at the Bank of England's annual average rate (`facts/fx.json`).

## Not imported

**Spreadsheets with numbers linked from SoGive's posts: no charity, or not SoGive's**

- *Cookstoves CEA* ([sheet](https://docs.google.com/spreadsheets/d/1xqFz5Lhuc5x__SPrbuHgWtou289lF3oZrinnaoV7whI/edit); post "Clean cookstoves may be competitive with GiveWell-recommended charities", December 2020). It estimates replacing every cookstove in the world (about $11,800 per life saved), not a charity's program (Inyenyeri, a Rwandan stove company, appears only as an example of a stove's price). Rechecked in October 2026: no organisation's figure.
- *CfRN CEA* ([sheet](https://docs.google.com/spreadsheets/d/12lwvxlWLjwuSuXiciFvnBF2bkfcCkrusdqqT37_QWac/edit); "Why we think the Founders Pledge report overrates CfRN", November 2019). Not SoGive's: the sheet is Founders Pledge's 2018 CfRN model (tabs "CfRN past impact" and "CfRN future work"), which SoGive's post links as "FP's CfRN CEA". The post argues qualitatively that FP overrates CfRN (opportunity cost of REDD+ funds, unpaid incentives, optimistic private funding) but puts no figure of its own on it; asked in the comments whether its adjustments would add up to over $10 a tonne, SoGive says it is "hard to say". FP's model is imported (`coalition-for-rainforest-nations-founders-pledge`).
- *CATF cost-effectiveness* ([sheet](https://docs.google.com/spreadsheets/d/1q6srpmt5VkdXLGfYzqHqkU3hvGUwPKjA67uxqYI0Upw/edit); "Climate change donation recommendations", July 2020; "Update on CATF's plans for 2020", December 2019). Not SoGive's: the sheet is Founders Pledge's 2018 CATF model, linked as "Founders Pledge cost-effectiveness model for CATF". SoGive "broadly agrees with its conclusions and cost-effectiveness estimates" and quotes FP's $0.29 a tonne for CATF's future projects; its database page for CATF ("on the order of $1 per tonne") ends "This assessment is from Founders Pledge." The update post is call notes with no figure. FP's model is imported (`clean-air-task-force-founders-pledge`).
- *Conflict-poverty* ([sheet](https://docs.google.com/spreadsheets/d/1FVMibJXxM72QOQBelR0goTUTPWSMOJ2pCoSt4sOIofs/edit); "Conflict and poverty", March 2020). An order-of-magnitude model of a hypothetical poverty program in Kenya averting war. No charity.

**SoGive supporting sheets** (inputs to the imported models, not models themselves): Deworming replicability adjustment and cost per year of doubled consumption; Deworming replicability adjustment 2019; Deworming CE after economic losers (a pasted summary of the imported sheet); Unprogrammed deworming; Early life growth BOTEC; Mental Health Interventions toolkit; Mental Health meta-analysis (METAPSY); TherapyInterventionsData; DALY burden of depression.

**Other evaluators' sheets that SoGive's posts link**: GiveWell's 2017, 2022 and 2023 CEAs, the deworming summary table, the ITN model, people per net and directed grants (GiveWell imports); HLI's StrongMinds 2023 sheet and AMF SWB CEA (HLI); Founders Pledge's StrongMinds and women's empowerment CEAs (not SoGive's); an effective-giving ecosystem overview (no numbers).

**SoGive's charity database** (about 10,000 UK charities, 167 rated). Checked record by record in the second pass
(October 2026) for a figure of SoGive's own per unit of outcome (per life saved, healthy year, year of income or tonne):
- Imported: the RNLI, Breast Cancer Now, Compassion UK and the Woodland Trust (above).
- Versus Arthritis (record `arthritis-research-uk`, £4,000 per life-saved equivalent) and the MND Association (about £300 per DALY): not imported. Both are explicit upper bounds under assumptions SoGive calls unlikely (Versus Arthritis averting the whole UK burden of three kinds of arthritis every year; the MND Association averting a DALY per person supported and per £100 of research), offered to show the charity misses the benchmark even then; SoGive gives no central estimate, and either bound would rank far above what SoGive concludes.
- Helen Keller International (£3,400 per life), the Against Malaria Foundation and Malaria Consortium: not imported; they restate GiveWell's figures in pounds (GiveWell's models are imported).
- Clean Air Task Force: not imported; the text is Founders Pledge's ("This assessment is from Founders Pledge"), imported under FP.
- Cancer Research UK's £1,600 per QALY, cited on several cancer charities' pages (Bowel Cancer UK, the Royal Marsden, Children with Cancer): not imported; a figure for UK cancer research in general, and the Cancer Research UK record itself wasn't among the records the database returned (its analysis isn't public that way).
- Everything else: ratings (Gold to "Not Recommended", or "more information needed") with costs per output (a meal, a scholar, a visit, a person reached) or the benchmarks only, with no outcome figure.
- Terms: SoGive's data page (archived September 2019) says its data is free for charity analysis with attribution, and that apps need a licence, free for low-intensity use, on condition users are told the source of impact assessments with a link back. The imported models and write-ups cite SoGive and link its pages.

**Posts with no cost-effectiveness numbers** (qualitative, or about SoGive itself):
- StrongMinds series 1, 2 and 3 (methods; numbers feed the imported sheet), "Floors and ceilings" (toolkit), and 5 (moral weight; feeds the sheet).
- NTI "too rich" (a reserves rating), the NTI, Johns Hopkins CHS and SecureBio call notes.
- Malaria vaccines (2021, 2024), COVID-19 donation posts (2020, 2021), microcredit (2020), Giving Green concerns (2022), and "Thresholds #1" (longtermism).
- Moral weights posts and the guided moral-weights tool (2022–2023), and "Moral weights according to EA orgs".
- SoGive Grants launch and payout report (2023), plans and funding requests, hiring, advising, the donor survey, "coattailing and funging", the impact-distributions post, the strategy templates, "EA and tackling racism", the podcast list and the ImpactMatters post.
- "StrongMinds should not be a top-rated charity (yet)" is by Simon M, not SoGive.

All of these were checked for linked sheets or per-dollar figures. Where a post had a figure, it came from a sheet listed above or from another evaluator.
