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

How: StrongMinds is hand-built (row per sheet row). Deworming is traced from each bottom line by
`scripts/import-sogive.py`, which reuses `scripts/convert-sheet.py` and links like GiveWell's sheets
(moral weights, discount rate, leverage and funging, staff pay, GiveWell facts). Every `expected` value
reproduces in the evaluator view (`npm run check`).

## Not imported

**SoGive spreadsheets with numbers, but no charity or no ranked unit**

- *Cookstoves CEA* ([sheet](https://docs.google.com/spreadsheets/d/1xqFz5Lhuc5x__SPrbuHgWtou289lF3oZrinnaoV7whI/edit); post "Clean cookstoves may be competitive with GiveWell-recommended charities", December 2020). It estimates replacing every cookstove in the world (about $11,800 per life saved), not a charity's program; the climate part needs a social cost of carbon, which isn't on our scale.
- *CfRN CEA* ([sheet](https://docs.google.com/spreadsheets/d/12lwvxlWLjwuSuXiciFvnBF2bkfcCkrusdqqT37_QWac/edit); "Why we think the Founders Pledge report overrates CfRN", December 2019). Coalition for Rainforest Nations, in tonnes of CO2e per $. No unit on our scale, and getting one needs a new shared rate (tonnes of CO2e to healthy years).
- *CATF cost-effectiveness* ([sheet](https://docs.google.com/spreadsheets/d/1q6srpmt5VkdXLGfYzqHqkU3hvGUwPKjA67uxqYI0Upw/edit); "Climate change donation recommendations", January 2021; "Update on CATF's plans for 2020"). Clean Air Task Force, in tonnes of CO2e per $. Same reason.
- *Conflict-poverty* ([sheet](https://docs.google.com/spreadsheets/d/1FVMibJXxM72QOQBelR0goTUTPWSMOJ2pCoSt4sOIofs/edit); "Conflict and poverty", March 2020). An order-of-magnitude model of a hypothetical poverty program in Kenya averting war. No charity.

**SoGive supporting sheets** (inputs to the imported models, not models themselves): Deworming replicability adjustment and cost per year of doubled consumption; Deworming replicability adjustment 2019; Deworming CE after economic losers (a pasted summary of the imported sheet); Unprogrammed deworming; Early life growth BOTEC; Mental Health Interventions toolkit; Mental Health meta-analysis (METAPSY); TherapyInterventionsData; DALY burden of depression.

**Other evaluators' sheets that SoGive's posts link**: GiveWell's 2017, 2022 and 2023 CEAs, the deworming summary table, the ITN model, people per net and directed grants (GiveWell imports); HLI's StrongMinds 2023 sheet and AMF SWB CEA (HLI); Founders Pledge's StrongMinds and women's empowerment CEAs (not SoGive's); an effective-giving ecosystem overview (no numbers).

**SoGive's charity database** (about 10,000 UK charities, 167 rated). Not imported, for three reasons:
- The ratings are categories (Gold, Silver, Bronze, "low", "more information needed"), not models.
- The numbers behind them are costs per output (a net, a meal, a scholar). The few costs per life saved restate GiveWell's figures (AMF, Helen Keller) or are one division with no counterfactual (RNLI, about £420,000 per life saved).
- SoGive's data page says use in apps and reports needs a licence from SoGive.

**Posts with no cost-effectiveness numbers** (qualitative, or about SoGive itself):
- StrongMinds series 1, 2 and 3 (methods; numbers feed the imported sheet), "Floors and ceilings" (toolkit), and 5 (moral weight; feeds the sheet).
- NTI "too rich" (a reserves rating), the NTI, Johns Hopkins CHS and SecureBio call notes.
- Malaria vaccines (2021, 2024), COVID-19 donation posts (2020, 2021), microcredit (2020), Giving Green concerns (2022), and "Thresholds #1" (longtermism).
- Moral weights posts and the guided moral-weights tool (2022–2023), and "Moral weights according to EA orgs".
- SoGive Grants launch and payout report (2023), plans and funding requests, hiring, advising, the donor survey, "coattailing and funging", the impact-distributions post, the strategy templates, "EA and tackling racism", the podcast list and the ImpactMatters post.
- "StrongMinds should not be a top-rated charity (yet)" is by Simon M, not SoGive.

All of these were checked for linked sheets or per-dollar figures. Where a post had a figure, it came from a sheet listed above or from another evaluator.
