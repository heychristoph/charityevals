# Research log: strongminds-charityevals (blind build)

All retrieved 2026-10-28 unless noted. Blind list respected: no HLI pages/spreadsheets, no GiveWell or
Founders Pledge assessments of StrongMinds, no EA Forum posts on HLI's analysis, no existing charityevals
StrongMinds/Friendship Bench model or write-up. Web searches were run with happierlivesinstitute.org,
givewell.org, founderspledge.com and forum.effectivealtruism.org blocked.

Allowed shared inputs used: facts/wellby_factors.json (HLI-derived WELLBY conversion, household size,
spillover ratio, explicitly allowed), assumptions/default.json.

## Money

1. ProPublica Nonprofit Explorer, Strongminds Inc (EIN 46-2090059)
   https://projects.propublica.org/nonprofits/organizations/462090059
   - FY2024 (Dec): total revenue $9,289,461; total expenses $9,651,790 (US entity only).
   - Full filing pages and XML/PDF downloads hit a bot "Security Check"/challenge page; not bypassed.
   - API JSON (https://projects.propublica.org/nonprofits/api/v2/organizations/462090059.json) readable;
     2023: totfuncexpns 9,282,757. Not used in the model (combined audit is better: it includes the
     Uganda and Zambia entities).
2. StrongMinds audited financials index: https://strongminds.org/audited-financials/ (lists 2014–2025 990s and audits)
3. **StrongMinds, Inc. and Related Entities, Combined Financial Statements, years ended Dec 31 2025 and 2024**
   https://strongminds.org/wp-content/uploads/2026/08/2025-Audit.pdf (auditor's report dated June 25, 2026)
   - p.6 (statement of activities 2025): "Program Services 7,316,320"; "Total expenses 11,390,353";
     G&A 3,115,986; Fundraising 958,047.
   - p.8 (functional expenses 2025): "Salaries 3,181,937$ 1,844,909$ 702,154$ 2,547,063$ 5,729,000$";
     "Employee benefits ... 942,229"; "Payroll taxes ... 492,163" → staff pay 7,163,392 = 62.9% of total.
     "Mobilization and facilitation ... 1,489,110" (facilitator/mobiliser costs, not staff pay).
   - p.7 (2024): Program 6,030,178; total 10,146,981.
   - p.11 notes: combined statements "include the operations of StrongMinds, Inc., StrongMinds Uganda and
     StrongMinds Zambia"; US program (StrongMinds America) "ceased effective December 31, 2024".
   - p.5: cash $13,969,632 at end-2025 (vs $6,423,842 end-2024); 2025 revenue 18,823,154 incl. a one-time grant.
   - p.2: SMU and SMZ statements audited by other auditors.

## Reach

4. StrongMinds Q4 2025 report https://strongminds.org/wp-content/uploads/2026/03/2025-Q4-report-8.5x11-3-19-26-FINAL.pdf
   - p.2: "2025 GOAL: 580,000 / 2025 ACTUAL: 745,224"; CEO letter p.4: "reaching 745,224 people with depression in 2025".
     p.1 highlight says "754,224" (typo; 745k also in Q2 2026 report). Used 745,224.
   - p.1/p.2: cost per person "USD $15" (2025 YTD).
   - p.6: "the governments of Uganda and Zambia each covered about 9% of program costs ($0.89–$3.69 per patient)";
     "Of the above contributions, 97% came in the form of government staff time"; "Kenya: county governments are
     estimated to contribute 7%–19% of total program costs"; "Malawi: government contribution is estimated at ~10%".
     "In 2024 we estimated government contributions at roughly 5%".
   - p.7: 2025 YTD expenses (unaudited) 10,883,179.
   - p.3: delivery-method chart (identical to the 2024 report): StrongMinds staff 3%, NGO partners 21%,
     government partners 53%, peer facilitators 23%.
   - p.3 chart: adolescents 267k, adults 478k in 2025.
5. StrongMinds Q4 2024 report https://strongminds.org/wp-content/uploads/2025/03/2024-Q4-report-8.5x11-03-10-2025-FINAL.pdf
   - 426,642 clients in 2024; cost per person $23; "233,185 clients received treatment through government
     partnerships, supported by more than 1,700 government-paid volunteer therapy group facilitators."
   - "CLIENTS TREATED BY THERAPY DELIVERY METHOD": 3% / 21% / 53% / 23% (staff/NGO/government/peer).
   - "USAID accounts for less than 4% of our budget".
6. StrongMinds Q2 2026 report https://strongminds.org/wp-content/uploads/2026/08/2026-Q2-Report.pdf
   - 2026 YTD 589,160 treated; cost per person YTD $10.55 (not used: partial year, unaudited).
7. 2024 achievements post https://strongminds.org/democratizing-access-to-mental-health-care-2024-achievements/ (Mar 25, 2025): 426,642; $23.

## Effect

8. Tong, Miguel, Panagiotopoulou, Karyotaki, Cuijpers (2023) Psychological Medicine 53(16):7473–7483,
   "Psychotherapy for adult depression in LMICs: updated systematic review and meta-analysis"
   https://pmc.ncbi.nlm.nih.gov/articles/PMC10951412/
   - "we found a very large effect size (g = 1.10, 95% CI 0.90–1.31)" (non-Western trials)
   - trim-and-fill: "the effect sizes dropped to g = 0.60 (95% CI 0.34–0.87" (36 studies imputed)
   - "Low-risk-of-bias studies had the lowest effects sizes (g = 0.69, 95% CI 0.49–0.89)."
   - group format g = 1.28; SSA subgroup g = 1.82 (0.39–3.25); only post-treatment effects measured.
   → used g = 0.60 (0.34–0.87) as initial_effect_sd.
9. Cuijpers et al. 2018 World Psychiatry (via search snippet, PMC5775122): non-Western g 1.10, trim-and-fill 0.73, low-RoB g 0.51 (0.34–0.69). Context only.
10. Bolton et al. 2003 JAMA 289(23):3117 (via search snippets; PubMed blocked by browser check)
    https://jamanetwork.com/journals/jama/fullarticle/196766 — 16 weekly sessions; depression severity reduced
    17.47 vs 3.55 points; 6.5% vs 54.7% met major depression criteria after. Bass et al. 2006 BJPsych 6-month
    follow-up: 14.0 points lower (95% CI 12.2–15.8). Context only.
11. **Baird, Özler, Dell'Aira, Parisotto, Us-Salam (2024) World Bank PRWP 10849** (JDE 176, 2025)
    https://documents1.worldbank.org/curated/en/099552207102441963/pdf/IDU1007db5cd16b2f146811a516124d1708f3085.pdf
    (PDF retrieved had 9 pages: abstract + introduction only; tables not available)
    - Abstract: "group-based interpersonal therapy increased the share of adolescents with minimal depression by
      20–30 percent 12 months after therapy, but these effects dissipated by the 24-month follow-up."
    - p.4: "Therapy significantly improved this primary outcome by more than 5 percentage points (pp) 12 months post therapy."
    - Search snippet (ideas/JDE): +5.4 pp from a control base of 18.4%.
    - Design: 106 BRAC ELA clubs, StrongMinds Uganda trained BRAC mentors, 14-week IPT-G, 2019, COVID at follow-up.
    - My conversion (probit, equal-variance latent normal): Φ⁻¹(0.238) − Φ⁻¹(0.184) = 0.19 SD at 12 months.
12. Atuhumuza et al. (2026) medRxiv preprint, StrongMinds pilot cluster RCT, Mayuge, Uganda
    https://www.medrxiv.org/content/10.64898/2026.07.01.26357066v1 (posted July 4, 2026; StrongMinds authors)
    - 292 randomised females ≥13, PHQ-9 ≥10, 6-week IPT-G vs enhanced TAU; 263 with 3-month data.
    - PHQ-9 difference −13.41 (−16.10 to −10.71) at 2 weeks; −7.78 (−9.66 to −5.90) at 3 months;
      −5.19 (−7.39 to −2.99) in the subgroup exposed to both assessment conditions; conclusion: follow-up
      procedures (facilitator presence, honesty prompt) influenced the apparent benefit.
13. StrongMinds 2019–2020 controlled quasi-experimental study (In Situ Research / SMU), Iganga & Mukono
    https://strongminds.org/wp-content/uploads/2026/07/2019-2020-StrongMinds-Controlled-Study-IPT-G-Uganda-.pdf
    - p.4: PHQ-9 at 6 months "2.86 vs. 9.07"; at 12 months "2.63 vs. 5.57" (treatment vs control); completers only
      (186/185 of 250/250); non-random community allocation; 12-week IPT-G.
14. StrongMinds 12-month follow-up of the 2024 cohort (Feb/May 2026), pre-post, no control
    https://strongminds.org/wp-content/uploads/2026/06/2026-StrongMinds-Evaluation-Report-12-month-follow-up-of-2024-cohort-Feb-5-20216.pdf
    - PHQ-9 15.3 → 3.3 / 3.1 / 3.2 at 2 wk / 6 mo / 12 mo; reached 69.0% of eligible at 12 months.
    - Cantril ladder 3.1 → 7.0 / 7.6 / 7.5 (Table 5).
    - "Over six sessions, these lay counselors guide structured discussions"
    - Completion of pre- and post-interviews: "118 out of 133 (88.7%)", NGO "124 of 133 (93.2%)", students
      "123 of 139 (88.5%)"; Zambia MoH "149 out of 160 (93.1%)", Peer "158 of 170 (92.4%)".
15. StrongMinds 2024 evaluation report https://strongminds.org/wp-content/uploads/2024/12/2024-StrongMinds-Evaluation-Report-Feb-19-2025.pdf
    — PHQ-9 15.3 → 3.2 at two weeks; independent psychologists.
16. Assefa et al. (2025) BMJ Global Health 10(11):e018369, retention in IPT-G at scale, Uganda & Zambia 2020–21
    https://pmc.ncbi.nlm.nih.gov/articles/PMC12625953/ (gh.bmj.com returned 403)
    - "Among 45 349 clients, overall average attendance was 82%."
    - "high attendance (63%), moderate attendance (27%), early dropout (6%) and late dropout (4%)"
    - mean PHQ-9 reduction 13.0; early drop-out 10.32 vs high attendance 13.3.
17. StrongMinds evidence page https://strongminds.org/evidence/ — lists JAMA Netw Open 2025 trial (n=328):
    "problem area–concordant 6-week IPT-G was non-inferior to 8-week problem area–discordant IPT-G."
    Also cites WHO: "1.6 mental health professionals per 100,000" in the African region (in the 2019–20 study, p.2).

## Not accessed / failed

- ProPublica full 990 pages, PDF and XML (bot challenge; not bypassed).
- PubMed (browser check); voxdev.org (403); sciencedirect (403); gh.bmj.com (403) — used PMC copy instead.
- Baird et al. tables (PDF copy truncated to introduction); SD-unit effects therefore derived by me.
- WebFetch could not parse PDFs; PDFs were downloaded to the scratch dir and text extracted with macOS PDFKit.

## Blind-rule incidents

- None of the blind sources were opened. Search result summaries did not show any evaluator figure for StrongMinds.
- Note: the build-cea skill's references/templates.md says the wellbeing structure was extracted from
  "HLI's StrongMinds model", and the template's cost_per_person explainer says "compare with the charity's figure and
  HLI's"; I did not look up HLI's figure. facts/wellby_factors.json (HLI's spreadsheet values) is allowed by the rules.

## Added after audit round 1 (2026-10-28)

- Baird et al. 2024 full text (same URL; the round-1 auditor's download had all pages, mine was truncated; I read
  the extracted text myself): p.14 "The reductions in the discrete scores are both less than 0.1 SD and not statistically
  significant. Figure 3 shows that the improvements in the scores largely occurred around the cutoff values for minimal
  depression". Table A4 (LATE): PHQ-8 −0.730 (control SD 4.816) end of therapy; −0.578 (SD 5.137) at 12 months;
  +0.192 at 24 months. GHQ-12 −0.880 (SD 3.159); −0.262 (SD 3.235). p.13: 56% attended at least one session; ~11 of 14
  sessions among attenders. → 0.15 SD / 0.11 SD / ~0, about 0.19 SD-years per attender. My earlier probit "0.19 SD" was
  a wrong anchor (it converts a binary cutoff indicator).
- Tong et al. 2023 (per round-1 auditor, Table 1): non-Western trials averaged 8.87 sessions; no association between
  number of sessions and effect; 40 of 105 trials from LMICs; LMIC subgroup g = 1.45 (0.93–1.97).
- Audit p. 8: "Partners 39" (2025) vs "Partners 253,271" (2024).
- Bass et al. 2006 BJPsych (6-month follow-up of Bolton): 14.0-point gap (95% CI 12.2–15.8), via search snippet.

## Added after audit round 2 (2026-10-28)

- Q2 2026 report p.7 (finance, "As of June 30, 2026"): 2026 fundraising goal $12,000,000; raised YTD $7,316,502,
  pledged $177,409, remaining need $4,506,089; 2026 expense budget $14,205,353; H1 2026 expenses $6,195,266.

## Audit rounds

- Round 1 (eval-log/audit-r1.md): 1 high, 3 medium, 5 low; 6.11× GD → fixed all (see write-up). 
- Round 2 (eval-log/audit-r2.md): 0 high, 2 medium, 4 low; 4.68× GD; pass. Mediums/lows addressed in wording,
  resources and summary; no value changes. Stopped (no high findings).
- Final: 0.0350 WELLBYs per donor dollar = 4.68× GiveDirectly; joint 0.033–180×; auditor's MC 10th–90th ≈ 2.0–10.6×.
