# Friendship Bench CEA: research log (build-cea, blind run)

All retrieved 2026-10-28 unless noted.

## Blind-rule notes
- FB homepage (https://www.friendshipbenchzimbabwe.org) shows a badge linking to happierlivesinstitute.org/charities/friendship-bench-zimbabwe/ ("Top Charities Badge 2025"). Link NOT followed. No CE figure was visible.
- facts/wellby_factors.json cites an HLI spreadsheet as source (shared fact, allowed). URL not opened.
- Searches used blocked_domains for HLI, GiveWell, Founders Pledge, EA Forum, charityevals. No search snippet showed an evaluator CE figure for FB.
- KBF Africa Prize page and news echo "$13–16.50 per client" — attributed to FB's own estimate (prize announcement), not an evaluator. Used as a cost cross-check.

## Money
1. ProPublica Nonprofit Explorer, Friendship Bench Inc (US, EIN 85-3440548): https://projects.propublica.org/nonprofits/organizations/853440548
   - FY2024 (Dec): total revenue $1,278,819; total expenses $3,103,651; exec comp $0; other salaries $0.
   - FY2023: revenue $5,089,923; expenses $2,797,049.
   - XML download (download-xml?object_id=202543189349315039) returned a ProPublica "Security Check" page -> not bypassed. Full-filing page renders "Loading..." to WebFetch. So no Part IX / Schedule F detail. US entity pays no salaries -> its expenses are presumably grants (to FB Zimbabwe and global work): treat as a FLOOR for Zimbabwe spending, not the total (FB Zimbabwe also had USAID, WHO, research grants).
2. No audited statements for FB Zimbabwe (PVO 12/21) are public. 2025 AR names auditors: "Vista Chartered Accountants (Zimbabwe)" (p.3).
3. FB Annual Report 2024 (Drive id 1OdRIWIcOX7ZIxq_zaIWRB2WsxQ0GQrgF, via https://www.friendshipbenchzimbabwe.org/impactreports), p.20: "Over the next 2 years (January 2024 -December 2025), we need to raise US$8 million: $4.9M (60%) to [programme] ... $3.1M (40%) to Marketing, finance, HR, administration, fundraising costs which underpin programme delivery." -> ~$4M/yr budget, 60/40 programme/support. (Same text in AR2023 p. last, and Global Pitch Deck p.12: "Expanding our reach to serve an additional 500K clients" -> $16/client planned.)
4. FB Annual Report 2025 (Drive id 1jcoxqvNNTnkIsByD-dSK-u0gnaQzUYCQ) p.20: "Over the next 12 months (January - December 2026), we need to raise US$4.1 million to ... delivering mental health support to 380 000 people." -> $10.8/person planned 2026.
5. KBF Africa Prize laureate page https://kbfafricaprize.org/laureate/friendship-bench-zimbabwe/ : "Delivered at an estimated cost of $13–16.50 per client"; "In 2025 alone, the programme reached over 334,000 people".
6. mhinnovation.net FB page (403 to WebFetch; search snippet only): "2019 to 2022 Total expenditure $3,219,100/Total reach for period 183,395 = cost of innovation USD 17.55". Not used as an input (unverified snippet), context only.
7. Economic threshold analysis (PMC9046737, https://pmc.ncbi.nlm.nih.gov/articles/PMC9046737/): 2019 USD; fixed programme cost $170,419/yr, 12,364 patients (2020), variable cost $3.37/service user; ICER $191 per YLD averted. Implies ~$14–17/patient (WebFetch model's calculation). Context only (partial scale, 2020).

## Reach
- AR2023 p.6: "220766 TOTAL NUMBER OF CLIENTS SEEN BY FRIENDSHIP BENCH IN 2023".
- AR2024 p.6: "295770 TOTAL NUMBER OF CLIENTS SEEN BY FRIENDSHIP BENCH IN 2024"; face-to-face 285,900; online WhatsApp 9,870. Province table p.? "# of Clients seen ... 295,770"; "# of Follow-up sessions ... 47,073".
- AR2025 p.10: "336 215 TOTAL NUMBER OF CLIENTS SEEN BY FRIENDSHIP BENCH IN 2025"; face-to-face 328,876; online 7,339. p.6: "In 2025 alone, 334,653 clients received sessions on the bench". p.11 table: Clients seen 336,215; follow-up sessions 3,284.
- AR2024 p.7: "The Quality and Customer Satisfaction team conducted follow ups with a 10% random sample of the clients seen at 6 weeks"; 82% showed significant decrease on SSQ-14.
- AR2023: "17463 clients were randomly sampled from the 2023 reach, of those sampled, the team managed to call12373 clients, of those contacted, only 3326 clients completed the 6 weeks follow up survey and the SSQ-14."
- AR2025 p.12–13: cohort 13,864 enrolled with baseline SSQ14; 5,686 (41%) any follow-up; 3,009 (22%) baseline+follow-up SSQ14; "Among the 2,990 clients symptomatic at baseline (SSQ14 ≥ 8), 2,550 achieved recovery (SSQ14 ≤ 7) at six-week follow-up, representing an 85.2% recovery rate." Also: "reliability issues missed counselling sessions and incomplete follow-ups by the lay health workers are the primary drivers of suboptimal satisfaction." -> 2,990/3,009 = 99% symptomatic at baseline: clients are a screened-positive population.
- AR2025 p.14: government transition: "full integration planned by 2028"; 2026: seven Implementation Provinces and three Technical Assistance Provinces.
- AR2025 p.7: USAID funding withdrawn Q1 2025.

## Dosage at scale
- Shava et al. 2026, SST pilot protocol, PMC13295822 (https://pmc.ncbi.nlm.nih.gov/articles/PMC13295822/): "most recipients received between one and three sessions" (vs six in the trial); "up to 48% of the participants only complete one (1) therapy session".

## Effect
- Chibanda et al. 2016 JAMA 316(24):2618, https://jamanetwork.com/journals/jama/fullarticle/2594719 : 573 randomized (286/287), 24 clinics Harare; "6 sessions of individual problem-solving therapy"; median 5 sessions, 39.9% completed all 6. SSQ-14 6 months: intervention 3.81 (95% CI 3.28–4.34), control 8.90 (8.33–9.47); "adjusted mean difference −4.86; 95% CI, −5.63 to −4.10". PHQ-9 ≥11: 13.7% vs 49.9%; PR 0.28 (0.22–0.34). PHQ-9 continuous mean diff −6.36. 521 (90.9%) followed up. Baseline SSQ SD ~1.3 (restricted by eligibility). Sample size calc assumed SMD 0.75.
  - My computation: SD from arm CIs: SE_int = (4.34−3.28)/3.92 = 0.27, n≈260 -> SD≈4.4; SE_ctl = (9.47−8.33)/3.92=0.29 -> SD≈4.7; pooled ≈4.5. SMD = 4.86/4.5 ≈ 1.08. If CIs are cluster-adjusted, SD overestimated -> SMD understated; range 0.9–1.3.
- Haas et al. 2023 JAMA Netw Open (rural Bikita, cluster RCT, 16 facilities), PMC10346120 https://pmc.ncbi.nlm.nih.gov/articles/PMC10346120/ : 244 FB / 272 SC; median 6 sessions, 88.1% completed six. SSQ-14 diff month 3 −1.65 (−3.07 to −0.24), month 6 −1.57 (−2.98 to −0.15), month 9 −1.63 (−3.05 to −0.22). PHQ-9 diff month 3 −0.35 (−1.68 to 0.99), 6: 0.01, 9: −0.04. Conclusion: "The intervention improved CMD symptoms, but the effect was smaller than previously shown in an urban setting." Baseline SSQ SD 1.1; PHQ-9 SD 3.5.
  - My computation: SSQ SMD ≈ 1.6/4.5 (borrowing Harare follow-up SD) ≈ 0.36; PHQ-9 ≈ 0. Average ≈ 0.2 (range 0–0.4). Effect stable 3→9 months (no decay visible).
- Tong, Miguel, Panagiotopoulou, Karyotaki, Cuijpers 2023 Psychol Med 53(16):7473, PMC10951412: non-Western trials g = 1.10 (0.90–1.31); low RoB g = 0.69 (0.49–0.89); trim-and-fill 0.60 (0.34–0.87); limit meta-analysis 0.42 (0.18–0.65); selection model 0.49; CAU controls 0.94; post-assessment only.
- Karyotaki et al. 2022 JAMA Psychiatry 79(5):430, PMC8943620: task-shared psychological interventions in LMICs; conventional MA g 0.48 (0.26–0.68), IPD 1-stage g 0.32 (0.26–0.38); "no indication of publication bias"; post-intervention mean 3.7 months.
- Connolly et al. 2021 Bull WHO 99(8):572, PMC8319860: lay counsellors g = 0.616 (0.366–0.866). Context.
- Cuijpers et al. 2026 World Psychiatry 25(2):287, PMC13176859: spline: 3 mo g 0.544 (0.47–0.61); 6 mo 0.434; 12 mo 0.389 (0.31–0.47); 24 mo 0.390. "The SMD increased from baseline to 0.55 at 12 weeks, then gradually decreased to 0.39 at around one‐year follow‐up." 191 RCTs, mostly HIC; few >12 mo.

## Delivery / attribution
- Haas 2023: LHWs "selected from the existing pool of village health workers"; supervised by clinic nurses. MoHCC partnership/handover (AR2024 p.4: "official hand over of the Friendship Bench Zimbabwe project to the Government of Zimbabwe through the Ministry of Health and Child Care").
- Rural FB qualitative study (PMC11221631, search snippet): VHWs received USD $10/month for transport and airtime (context only).

## Not accessible
- ProPublica 990 XML (bot check), Instrumentl (403), mhinnovation (403), medRxiv PDF (403), FB Zimbabwe audited accounts (not public).

## Build v1 (2026-10-28): 0.0912 WELLBY/$ = 12.2x GD (joint 0.14-465x)
## Audit r1: 1 high, 3 medium, 4 low. Fixes: duration 3->5 (2-8) [Cuijpers 2026 Table 2 plateau 0.39 to 5y per auditor]; single-session 0.45->0.65 (0.45-0.9) as judgment (AR2024 p9 47,073 follow-ups/295,770; AR2025 3,284/336,215); multi 0.8->0.75; evidence_adj anchored on Tong low-RoB 0.69 vs 1.10; reach minus partners 7,382 (AR2024 p9) x 0.95 (0.85-1). Kidia et al 2024 (PMC11221631) quote: "primarily voluntary basis but received USD $10 per month for transport and cellphone credit" (SolidarMed rollout, payer not stated).
## v2: 0.1244 WELLBY/$ = 16.6x GD (joint 0.13-667x; 0.37-256x at shared defaults)
## Audit r2: 0 high, 2 medium, 4 low. Verified myself: Q2 2024 impact report (Drive 1rpPGQcpWhn-eRIBSHncfk-x09HXVtjVZ) "# of Clients seen ... 71,388", "# of Follow-up sessions ... 75,256"; Q1 2025 (Drive 1U6FtkVuQZODp29dpuygN-FRuFBMvD3s-) 79,172 clients / 82,245 follow-ups; Q2 2026 86,832 / 2,726. Fixes: share_single_session 0.5 (0.35-0.8); harare_trial_weight 0.35 (0.2-0.5) [Harare 40,684 + Bulawayo 18,278 of 288,388 own clients 2024]; wording fixes; Schleider depression 0.18 vs 0.28 (auditor, via secondary press coverage).
## Final v3: 0.1169 WELLBY/$ = 15.6x GD (joint 0.11-687x; 0.32-263x at shared defaults). Stopped after r2 (no high).
