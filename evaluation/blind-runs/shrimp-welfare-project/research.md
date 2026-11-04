# Research log: Shrimp Welfare Project (blind build-cea run), started 2026-11-03

## Blind-rule notes
- Sandbox docs/normalization.md 2.11 still contains a sentence ranking an (evaluator) "Shrimp Welfare Project" model just above Vegan Outreach (6.59 healthy years/$1,000) in animal welfare. Seen while reading the doc for the won-reforms rules; not used as an anchor. Reported.
- facts/sad_factors.json sads_per_shrimp_stunned: shared fact (source title removed), cell "Program 1: HSI CEA!B13" in an ACE sheet. Used as the site's shared figure as the rules require; source link not opened.

- writeups/aquatic-life-institute.md (sandbox) says the shared 0.0045 SADs/shrimp-stunned figure is "ACE's more recent figure from its 2025 Shrimp Welfare Project review". Shared fact, used as required; ACE's SWP review itself not opened.
- Search results (2026-11-03) listed an EA Forum post "Cost-effectiveness of Shrimp Welfare Project's Humane Slaughter Initiative" (third-party CEA) and the Charity Entrepreneurship/AIM profile that mentions a CE estimate: NOT opened (blind list: any other evaluator's CEA of SWP). No figure from them used. A search summary quoted an Open Philanthropy grant amount ($2M over two years) - funding, not a CE figure.

## Sources read (all retrieved 2026-11-03)

1. SWP home https://www.shrimpwelfareproject.org : UK charity 1204414; programmes Corporate Engagement (Humane Slaughter Initiative, Eyestalk Ablation-Free), Sustainable Shrimp Farming in India (SSFI), Research, Outreach.
2. (Shr)Impact https://www.shrimpwelfareproject.org/shrimpact :
   - "we have signed 37 corporate agreements to provide stunners to shrimp producers across 9 countries"
   - "they are expected to impact 89,774 metric tonnes (MT) of shrimp per year"; 20 stunners installed and commissioned, 54,175 MT (~3.6 billion shrimp) per year (=> ~66 shrimp/kg)
   - "The figure is a projection based on signed commitments — not a count of shrimp that have already been stunned."
   - retailer policies (17 retailers) are listed separately and not counted; "it is often difficult to attribute a retailer's policy to any single organisation."
   - SWP's own 6.5 billion shrimps/yr (4.5-9 bn), 1,400 shrimps/$/yr (970-1,900) - SWP's own figures, context only.
3. Charity Commission register, accounts listing https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/5201958/accounts-and-annual-returns : Accounts and TAR for 31 March 2025 (received 14 Nov 2025) and 31 March 2024. Latest audited year = FY 1 Apr 2024 - 31 Mar 2025. Downloaded PDF (objectiveId A17852216) to {scratch}/dl/cc.
   Report and Financial Statements year ended 31 March 2025 (audited, Goldwins Ltd, 8 Sep 2025):
   - SOFA p.9: Donations 2,179,624; Investments 62,651; Total income 2,242,275; "Charitable activities 5 592,743"; Total expenditure 592,743 (2024: 385,807).
   - Note 5 p.15: direct charitable activities 532,685; support costs 54,058; governance 6,000; total 592,743. Freelancers and contractors 330,739 (287,556 direct + 43,183 support); Wages and salaries 44,364; Depreciation 116,346; FX losses 64,373; Advertising 9,693; Legal 10,353; bank 4,553; admin 4,710; travel 1,612; audit 6,000.
   - Note 9 p.16: Plant and machinery additions in year 388,162 (cost at start 241,959, end 630,121); depreciation 25% reducing balance.
   - Cash flow p.11: purchases of fixed assets (388,162); 2024 (219,864).
   - Balance sheet p.10: cash 2,647,564 (2024: 1,269,848).
   - TAR p.2: "Secured a shrimp welfare policy with Morrisons, a major UK retailer"; "Signed two new Memorandums of Understanding (MOUs) with industry partners".
   - Note 7: average employees 1; trustees paid for services as contractors (Boddy 60,223; Jimenez 16,162).
4. SWP Guesstimate model "Humane Slaughter Initiative" https://www.getguesstimate.com/models/22982 (SWP's own, linked from the Shr(Impact) page; JSON via https://api.getguesstimate.com/spaces/22982, updated 2026-11-02). Per agreement: Production p.a. (MT), "Proportion committed to be stunned", Cost ($) (55,000 mostly; 73,200, 106,150, 88,462, 57,995.3, 105,899.2). "Shrimp Weight" lognormal "10 to 20" g, "We have based our calculation on the assumption that there are around 70 shrimps/kg of production". Agreement dates from the metrics' UUID-v1 creation timestamps (when SWP added each agreement to the model; a proxy for signing).
   FY Apr 2024-Mar 2025 agreements (11): Asia 02 (9,500 MT x 26%, $73,200), Asia 03 (6,000 x 30%), Asia 04 (6,000 x 100%), Asia 05 (3,500 x 85.7%), Asia 06 (3,000 x 60%), Asia 07 (3,000 x 60%), LatAm 06 (7,000 x 28.6%), Asia 08 (7,046 x 25.5%), LatAm 07 (12,500 x 14.4%), Asia 12 (5,000 x 70%, $106,150), Asia 09 (3,000 x 83.33%); others $55,000.
   => committed 28,468 MT/yr; stunner prices $674,350 => 0.04222 MT per stunner dollar (computed {scratch}/scripts).
   All 35 blocks: 85,522 MT (Shr)Impact says 89,774 for 37: consistent.
   FY2023/24: 4 agreements $220k vs capex GBP 219,864 (~$281k); cumulative to Mar 2025: agreements $894k vs capex GBP 630,121 (~$805k): stunners paid roughly as agreements are signed.
5. HSI page https://www.shrimpwelfareproject.org/humane-slaughter-initiative : producers commit to stunning "at least 1,900 metric tonnes of shrimp annually"; SWP pays the stunner, producers freight and duties; SWP keeps ownership, can reclaim if volumes etc. not met; "Maintenance is typically light and full training / support will be provided by the stunner manufacturer." 20 collaborators listed; no lifespan stated.
6. EA Forum (greaterwrong mirror) SWP's 2030 vision, Aaron Boddy, 2 May 2025 https://ea.greaterwrong.com/posts/Ztqzt4BWMPZW5ECfP/ : 17 stunner agreements ~3.3 billion shrimps/yr (then); SSFI sludge removal 100 acres in 2024 ~30 million shrimps at ~$90/acre; 7 retailers committed to electrical stunning.
7. SWP team page https://www.shrimpwelfareproject.org/team (2026 team, 16 staff): programme implementation director, field coordinators Asia and LatAm (HSI), strategic industry partnerships, SSFI director + field lead, research & policy, communications, operations, MEL, scoping leads. Basis of the HSI share-of-opex judgment.
8. Search 2026-11-03: April 2026 PT Brother (Indonesia) bought its own Ace Aquatec stunner (globalseafood/perishablenews result snippet) - producers do sometimes buy stunners themselves (counterfactual).
9. FX: facts/fx.json usd_per_gbp_2024 = 1.277 (IRS); FY is 9 months 2024, 3 months 2025.

## Later sources (2026-11-03)
10. FAO Cultured Aquatic Species, Penaeus vannamei https://www.fao.org/fishery/docs/DOCUMENT/aquaculture/CulturedSpecies/file/en/en_whitelegshrimp.htm : "Cultured shrimp harvested from ponds (after 4–5 months at 15–25 g)"; extensive "small shrimp of 11–12 g"; farm gate 15–20 g. -> shrimp_per_kg 60 (40-90).
11. EU market observatory https://fishery-aquaculture-market-observatory.ec.europa.eu/en/country-and-species-profiles/species-profiles/shrimp-penaeus : whiteleg ~80% of Penaeus aquaculture (2023, FAO).
12. Perishable News 27 Apr 2026 https://perishablenews.com/seafood/pt-brother-sets-bar-for-shrimp-welfare-standards-with-ace-aquatec-system/ : PT Brother "has chosen Ace Aquatec's portable stunner system for its site in Cilacap, Indonesia"; no SWP mention.
13. Accounts p.14 note 4: Bank interest 62,651; p.10 cash 1,269,848 -> 2,647,564.
Final: 4.471 ced/$ = 1.633 healthy years per $1,000.
