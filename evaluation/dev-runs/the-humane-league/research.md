# Research log: The Humane League (build-cea, blind run)

All retrievals on 2026-10-28 unless noted. "Today" = 2026-10-28.

## Setup / repo files read
- `.claude/skills/build-cea/SKILL.md`, `references/templates.md`, `references/research.md`, `templates/corporate-campaign.json`
- `assumptions/default.json`, `facts/sad_factors.json`, `facts/moral_weights.json`, `src/engine/templates.ts`, `src/engine/lint.ts`, `src/engine/schema.ts`
- `charities/the-humane-league.json` (checked keys only: id, name, cause, website; no evaluator content).
- Did not open any THL model (none exists in sandbox `models/`), nor `models/animal-welfare/aquatic-life-institute.json` (grep shows it mentions "Humane League"; skipped to stay blind).

## Money

### THL 2025 audited financial statements (CBIZ CPAs, opinion dated 2026-04-16)
URL: https://assets.ctfassets.net/ww1ie0z745y7/3MRkx2O0dJW83bmfvo5rZa/56fa379bccf43148fb2b2a135fe72c62/Final_FS_-_230180_THL_AUD_1225.pdf
- p.5 Statement of Functional Expenses, FY ending 2025-12-31:
  - "Total Expenses 14,620,067$ 4,300,517 $ 2,689,268 $ 21,609,852 $" → program 14,620,067; M&G 4,300,517; fundraising 2,689,268; total 21,609,852 (USD 2025)
  - "Salaries and benefits 7,130,974 $ 2,847,282 $ 1,689,425 $ 11,667,681 $" → staff cost 11,667,681
  - "Grants and awards 4,261,891"
- p.4 Statement of Activities: program services 14,620,067; 2024 program 13,091,634, 2024 total 19,905,925.
- Note 7 p.12: "the Organization provided a grant to THL-UK in the amount of $2,150,000."
- Note 6: "one donor accounted for 48% of total revenue and support."
- Note 5: restricted net assets for "Open Win Alliance Grants 764,837", "Animal Policy Alliance 330,000", "Corporate Campaigns 52,658".

### THL 2025 Form 990 (public disclosure copy, signed 05/05/26)
URL: https://assets.ctfassets.net/ww1ie0z745y7/6WLliKUVCOcObDcOcBy98N/677ca120386240c5bae939727477b922/THL_Public_Disclosure_Copy_990.pdf
- Part I line 18 total expenses 21,682,964 (differs from audited 21,609,852 by ~$73k: 990 includes investment fees 92,762 etc.). Part IX line 25: program 14,619,381; M&G 4,375,357; fundraising 2,688,226.
- Part I line 15 salaries etc. 11,667,680. Employees (Part V 2a): 232.
- Part III 4a: "WE SECURED BRAND NEW CORPORATE COMMITMENTS TO END THE USE OF CAGES IN THEIR SUPPLY CHAINS THAT WILL SPARE 1.6 MILLION HENS AROUND THE WORLD" (only one program reported; 4e total 14,619,381).
- Part IX lines 2/3: domestic grants 351,300; foreign grants 3,910,591.
- Decision: model uses the audited statements (primary) for cost rows.

### ProPublica Nonprofit Explorer (EIN 04-3817491)
URL: https://projects.propublica.org/nonprofits/organizations/43817491 — summary page only (FY2025 total expenses $21,682,964). XML and PDF downloads blocked by a "Security Check" (bot detection) page / HTTP 403; did not attempt to bypass. Used THL's own copy of the 990 instead.

### THL 2025 Annual Report (booklet PDF)
URL: https://downloads.ctfassets.net/ww1ie0z745y7/6T4MyY2CVXWdL9Qf4bpGPy/b68f12c43e59b2b9b45490aa8ef571c3/25-annual-report-booklet-design-final-digital-04-29-pages.pdf (web version https://act.thehumaneleague.org/annual-report-2025)
- p.17 (preliminary, unaudited, rounded): "Global Programs 2 $5,204,000"; "Education & Mobilization $4,664,000"; "US Public Policy & Corporate Engagement $2,498,000"; "OWA & APA Grants $1,991,000"; "PROGRAMS TOTAL $14,357,000". Footnote 2: "Includes grants for THL UK. Does not include OWA grants." Shares 36% / 33% / 17% / 14%.
- p.7: APA "$300K IN GRANTS provided to 12 member groups" → OWA grants ≈ $1.69M of the $1.99M.
- p.5: OWA "$2M+ IN FUNDING PROVIDED to 36 groups across 30 countries"; "234 NEW CORPORATE COMMITMENTS secured for chickens around the world".

## Reach

### THL 2025 Annual Report
- p.3: "1.6M HENS IMPACTED by 4 companies' new commitments to end cages in their supply chains" → new_commitment_hens = 1,600,000
- p.3: "7.5M HENS SPARED from cages around the globe, with additional commitments cemented TO SPARE 162.5M MORE EVERY YEAR" → accountability_hens = 7,500,000 (THL's own count; counting method not published)
- p.2 (CEO letter): "we've pressured 131 companies to make progress towards their promises to spare more than 160M hens from extreme confinement."
- p.3: "92% OF CORPORATE CAGE-FREE COMMITMENTS with deadlines of 2024 or earlier were fulfilled"; "46.4% OF THE EGG-LAYING HENS IN THE US lived outside a cage for the first time"
- p.8: Subway "nearly 340,000 hens are now spared from cages annually"; p.10 Cheesecake Factory "sparing nearly 185,000 hens"; Walmart "return to the negotiating table".
- p.16: THL's own CEA headline (see blind-rule incidents) — NOT used.

### THL "Our impact" page
URL: https://thehumaneleague.org/our-impact
- "47.5% of birds in the US flock are now spared from brutal cages, compared to just 12.7% a decade ago." (undated)
- "2400+ companies around the world have committed to sparing hens from battery cages."
- No definition of "hens spared".

### OWA 2025 Cage-Free Egg Fulfillment Report (via THL article)
URL: https://thehumaneleague.org/article/2025-cage-free-fulfillment-report
- "92% of cage-free egg commitments with deadlines of 2024 or earlier have been fulfilled" (as of July 2025; up from 89%).
- "85 global companies reported progress on their commitments in 2024, affecting an estimated 3.3 million hens." (search snippet + page)
- Search-result note (EA Forum comment, not opened): the 92% counts companies, not hens. Used only as a caveat.

### USDA AMS Monthly Cage-Free Shell Egg Report (top-down cross-check, not an input)
- Dec 2, 2024 release: https://esmis.nal.usda.gov/sites/default/release-files/rj4304553/mw22x155b/3x818g120/PYMCAGEFREE.PDF — "Est. Layer Flock Size: 125,860,592" (all cage-free layers, organic 20,311,392 + non-organic 105,549,200)
- Oct 1, 2026 release: https://www.ams.usda.gov/mnreports/pymcagefree.pdf — "Est. Layer Flock Size: 151,561,575"
- → US cage-free flock grew ~25.7M hens in 22 months (~14M/yr), partly flock rebuilding after HPAI.

## Effect

### Rethink Priorities (Šimčikas 2019), corporate campaigns for chicken welfare (movement-wide, not THL-specific)
URL: https://rethinkpriorities.org/publications/corporate-campaigns-affect-9-to-120-years-of-chicken-life-per-dollar-spent
- "for every dollar spent, 9 to 120 years of chicken life will be affected"
- Years of impact: "4 to 36 years (the mean is 15 years)"
- Compliance: combined cage-free 48%–84%; US cage-free 33%–85%; outside US 63%–90%.
- Counterfactual: US 18–26% of eggs would have been cage-free without campaigns; outside US 20–50%.
- Movement spend 2005–2018 $54–120M; THL share $7.4–11M (mentioned; no THL-specific CE figure).

### Shared fact
- `@sad_factors.sads_per_hen_year_cage_to_aviary` (17.49, low 7.93). See incident 1.

## Round 1 fixes: additional sources (2026-10-28)
- THL Form 990 2024 (amended), https://assets.ctfassets.net/ww1ie0z745y7/1AXdVUjWnPoagK2mQbnvyQ/3323798567b6625074b4a4ad215b6955/THE_HUMANE_LEAGUE_2024_TAX_RETURN_PUBLIC_DISCLOSURE_COPY_AMENDED_990_2025-09-05__1_.pdf , Part III: "WE SPARED 4.6 MILLION HENS FROM CAGES GLOBALLY AND SECURED COMMITMENTS TO FREE AN ADDITIONAL 79 MILLION MORE." → bounds accountability_hens (low 7.5M − 4.6M = 2.9M; best 5.2M midway). Sch. O: "CKE ... AFFECTING APPROXIMATELY 1.3 MILLION HENS ANNUALLY".
- Welfare Footprint Project, https://welfarefootprint.org/laying-hens/ : CC→aviary "an average of at least 275 hours of Disabling pain, 2,313 hours of Hurtful pain and 4,645 hours of Annoying pain"; FC→aviary "1,410 hours of Hurtful pain and 4,065 hours of Annoying pain prevented for each hen" (no disabling figure given). → enriched_gain_ratio judgment 0.25 (0.1–0.6). Used instead of `@sad_factors.sads_per_hen_year_enriched_to_aviary`, which is sourced from ACE's THL CEA (blinded).
- THL /our-impact: "140+ leading US businesses have committed to THL's science-based welfare standards for chickens raised for meat" → broiler work exists (cage_free_share explainer).
- RP (Šimčikas 2019), same URL as above: follow-through 48–84%; cage-free anyway 18–26% US / 20–50% elsewhere → follow_through_new 0.65 (0.48–0.84), counterfactual_new_commitments 0.75 (0.5–0.82); years 4–36 (15) → years_new_commitments.

## Blind-rule incidents
1. **Shared facts derived from a blinded source.** `facts/sad_factors.json` (which SKILL.md tells me to read and use) cites ACE's THL 2025 CEA spreadsheet: the low end (7.93) of `sads_per_hen_year_cage_to_aviary` is "the 7.93 ACE used in its 2025 review of The Humane League", and `sads_per_hen_year_enriched_to_aviary` and `sads_per_broiler_bcc` are sourced from ACE's THL CEA tabs. I read these values (inputs, not ACE's bottom line). I use only the cage-to-aviary fact, as the skill requires shared facts; its best value comes from AIM via ACE's Sinergia CEA; the low end is from the THL CEA.
2. **references/templates.md** says the corporate-campaign template structure was extracted from "ACE's The Humane League ... models". No numbers, but the template's structure (and the cage-free accountability/enriched-cage framing in facts) is derived from the blinded evaluator model.
3. **THL's own cost-effectiveness claim seen** in its 2025 annual report p.16 ("For every $1 spent on corporate cage-free campaigns, TWO HENS WERE SPARED FROM LIFE IN A CAGE") and on /our-impact ("we spend just 50 cents to spare one hen"), linked to an EA Forum post "Cost-effectiveness of THL's corporate cage-free campaigns" (forum.effectivealtruism.org/posts/Fbx9hf2e6MaLfoNwD) and thl.link/one-dollar. Not opened (it is a cost-effectiveness write-up about THL) and not used as an input.
4. THL's site displays an "ACE 2025 recommended charity" badge and quotes ACE's review sentence (annual report p.20, qualitative only). No ACE page opened.
5. Search snippet for USDA query listed an EA Forum post (v22i7Gf62siWoNwuL) — not opened.

## Sources I could not access
- ProPublica XML/PDF of THL 990s (bot "Security Check" page, 403). Used THL-hosted 990 instead.
- THL 2026 Q1/Q2 progress report PDFs (too large / binary for WebFetch; not needed).
- Total US table-egg layer flock for Dec 2025 from NASS (not fetched; used USDA AMS cage-free counts and THL's 46.4%).
- OWA 2025 fulfillment report PDF (not opened; used THL's article summary).

## Audit rounds
- Initial build: 7.14 SADs/$ = 1.83× GD.
- Round 1 (eval-log/audit-r1.md): 1 high / 6 medium / 4 low. Fixed all except #11 (blinded low end of shared SAD fact; out of model scope). → 6.61 SADs/$ = 1.69×.
- Round 2 (eval-log/audit-r2.md): 0 high / 2 medium / 10 low. Fixed medium #1 (new-commitment years 15→10, counterfactual 0.75→0.65, both now judgments anchored on RP) and lows #3 (hens best 6.0M), #4, #5, #6, #8, #9, #10, #11. Medium #2 (joint spread) inherent to shared assumptions. Not re-audited (stop rule: no high findings). → 6.29 SADs/$ = 1.61×.
- Round 2 also verified AWO model accountability years (models/animal-welfare/animal-welfare-observatory.json, ACE import, not THL): p2 programs 1.5–3 vs 4–5 years; p1 10 vs 25.
