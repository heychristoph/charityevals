# Audit: village-enterprise-charityevals, round 1

Result: 0.008069 uov/$ = 4.03 years of healthy life per $1,000 (joint 0.14–81.5; own ranges 0.42–26.4); cause median 7.01 (×0.58). Verdict: **pass** (no high findings). Five medium findings should still be fixed. Together they lower the result by about 13% (to about 3.5).

Scope: the model covers all program services for FY2025 (July 2024 to June 2025): $17,076,992, or $20,993,131 with overhead (audited Exhibit B/D, verified). It counts the 47,505 entrepreneurs trained in the same year (annual report p. 6, verified). The spending breakdown from Exhibit D and Form 990 Part III, checked:

| Line | Spending | Share of program spending |
|---|---|---|
| Kenya | $5.24M | |
| Uganda | $3.24M | |
| Rwanda | $1.50M | |
| Ethiopia | $1.67M | |
| East Africa regional | $2.00M | |
| US-booked (subawards to Mercy Corps $2.32M and IDinsight $0.46M) | $3.42M | |
| DREAMS (by program) | $5,425,322 | 31.8% |
| Nawiri (by program) | $987,009 | 5.8% |
| USAID Rwanda (by program) | $985,276 | 5.8% |

Every line is the same graduation model, so pooling all spending against all trained households is right. Nothing of a tenth or more is left out, and no case study stands in for the program.

Mechanical:
- Lint: 0 high, 0 medium, 0 low.
- Invariants: none violated.
- normalization-audit (with `--exclude village-enterprise-founders-pledge`): 0 violations for any model. No waiver touches this model.

Previous round: none (round 1).

Blind note: a line from the DREAMS report's executive summary slipped past my filter. It summarised that report's cost-benefit comparison ("…costs if impacts are sustained for five years. In host communities, short-run benefits … already surpass total program costs"). I did not follow it or use it. Section 5 (pp. 76–81) was cut from my text extract unread.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | units | `core_control_consumption_month`, `core_effect_month`, `core_ln_gain_year` | The core gain is ln(1 + pooled $ effect / pooled control mean). That pooled ratio gives Kenyan households about twice the weight of Ugandan ones, because Kenya's consumption is twice as high. Under log utility, the mean gain is the mean of each country's ln ratio. In this trial the Kenyan and Ugandan effects differ twofold, so the shortcut matters. | DIB report Tables F1/F2 (PDF pp. 53–54): Kenya control 207.41, ITT 15.21 (7.3%); Uganda control 106.63, ITT 3.87 (3.6%); pooled 158.007 / 9.875 (Table B1). Sample about 51% Kenya, solved from the control means. | Split the branch into `core_kenya_*` and `core_uganda_*` rows: control means 207.41 and 106.63, ITT 15.21 and 3.87, each × the TOT/ITT ratio (10.29/9.875), citing Tables F1 and F2. Make `core_ln_gain_year` the reach-weighted mean of the two ln gains: Kenya households for Kenya, Uganda's non-DREAMS households for Uganda, the pooled mean for Rwanda. Fix the explainer's "6.5%" to the per-country figures. | Core ln gain 0.0631 → 0.0557; result 4.03 → 3.78 (−6.4%) |
| 2 | medium | plausibility | `dreams_effect_month` (applied via `dreams_household_share`) | The Uganda DREAMS effect for all households (refugee and host, 18%) is applied to every DREAMS household. About 8,000 of the ~11,600 are in Ethiopia's Dollo Ado refugee camps, an all-refugee population. The trial itself shows refugees gained much less than hosts. | DREAMS report p. 53: "USD 13.74 difference among refugee households compared to USD 27.99 … host"; Table E1: refugee control about 106 (64% of the sample are refugees, Table 5a, 4,185 of 6,560). Refugee TOT is about 13.9%, ln 0.130, against 0.166 for everyone. | Split DREAMS into `dreams_uganda_*` (the all-household effect, cohort-weighted 3,600 households) and `dreams_ethiopia_*`. The Ethiopia branch takes the refugee-subgroup effect (13.74 × 20.21/19.10 on the refugee control mean, citing p. 53 and Table E1), and its explainer states the move from West Nile to Somali camps. Carry Ethiopia's remaining external-validity doubt in its own `dreams_ethiopia_evidence_adj` (Convention 4), not in the blended `evidence_adj`. | DREAMS ln 0.166 → 0.141; result → 3.76 (−6.7%). With #1: about 3.51 (−13%) |
| 3 | medium | source | `persistence_years`, `core_effect_month` explainers | The persistence judgment (top-2 driver) rests partly on a misstated reading of the trial. The explainers say the gain "showed no decline" and that "earlier cohorts show[ed] similar or larger effects than later ones". That holds only for Uganda. In Kenya, later cohorts, measured sooner after the program, had larger effects, which points to some fade. The report calls the evidence "mixed". The explainer also leaves out the nearest reference class on the site: the Raising the Village model's 3 years (1–6), taken from GiveWell's livelihoods CEA, for a similar Ugandan program. | DIB report p. 21: "treatment effects are greater for the last three cohorts than the first three cohorts in Kenya, the reverse is true in Uganda … the evidence to support this hypothesis is mixed". models/global-health/raising-the-village-founders-pledge.json `effect_years`. | Rewrite both explainers to state the country pattern (Kenya consistent with fade, Uganda confounded by the lockdown). Add the Raising the Village / GiveWell 3-year anchor to the reference class, and say why this program's best guess differs: it has 2.5 years of post-program evidence against that trial's 1 year. Keep the best guess the evidence supports; don't move it toward the peer. If the Kenya pattern is read as fade, use a fading profile (an annual decay rate as a ranged judgment) instead of a full gain that stops. Keep the low end at 3. | Wording now. At 3 years the result is 2.14 (−47%), so the justification carries the result |
| 4 | medium | sensitivity | `evidence_adj` | This judgment is a top-5 driver (3.09–4.75). Its explainer lists its parts (0.95 × 0.9) but names no reference class: no other model's evidence adjustment for this intervention, nor the GiveDirectly peer's internal and external validity rows. Template and Convention 10 require one. Some of the external-validity worry also overlaps with #2 (Ethiopia camps). | Model explainer; templates.md Convention 10; `givedirectly` has `iv_adj_*`/`ev_adj_*` rows. | Name the anchor: GiveWell's validity adjustments in `givedirectly`, and the Raising the Village import's adjustment. State the implied multiple of the trial effect after all adjustments (0.85 × 0.95 × 0.95 ≈ 0.77). Once #2 gives Ethiopia its own adjustment, take the Ethiopia-camp part out of `evidence_adj`. | Neutral once #2 is done; tornado ±20% |
| 5 | medium | presentation | `household_size` explainer; write-up "Reach" | The explainer says household size is "About 6.3" and the write-up says "about 6.3 people each". The model computes 6.45 (4.516 × 1.429). | audit run: `household_size` = 6.451 | Change both to "about 6.5". The comparison with Village Enterprise's own 6.7 people per entrepreneur still holds. | none |
| 6 | low | scope | `dreams_household_share` | The best guess (0.24) leaves out Tanzania. The annual report says Tanzania runs DREAMS through local community-based organisations. It had 9,020 FY2025 lives, about 1,560 households at the report's 5.78 lives per entrepreneur (16,180/2,800), so it is not a "small pilot". The CBOs' own resources are not in Village Enterprise's cost. | Annual report p. 11: "In Tanzania, Village Enterprise is training local community-based organizations to implement DREAMS"; p. 6: TANZANIA 9,020. | Set the best guess to (8,000 + 3,600 + 1,560)/47,505 = 0.277 (range about 0.20–0.32). Give Tanzania the refugee/host effect it fits (naturalised former refugees). Add the CBOs' delivery time to `attribution_share_shared`'s explainer. | +4.3% alone (4.21), smaller with #2 |
| 7 | low | double-counting | `implementation_adj` | The effect is treatment-on-the-treated (those who received the first grant, 95.7% of those offered). The 0.95 then removes about the same non-take-up again. Reach is "entrepreneurs trained", which comes after the training-stage dropout the TOT already excludes. | DIB p. 10: "14,130 households, or 95.7% received at least the first cash grant". DREAMS: 98% received the seed grant. | Either use ITT effects (9.875; 19.10) with `implementation_adj` covering only reporting error (about 0.97–1), or keep TOT and set `implementation_adj` to about 0.98 (0.9–1). Say in the explainer which one it is. | +3 to 5% (at 1.0: 4.25) |
| 8 | low | missing-adjustment | `implementation_adj` / `unmodelled_benefits_adj` | Nawiri (5.8%) and the USAID-funded Rwanda program (5.8%) were cut by the 2025 stop-work order. Households trained in FY2025 under them may have missed the second grant or mentoring. Nothing says so. | Annual report p. 15 (Nawiri "terminated in early 2025"); Form 990 Part III | State in `implementation_adj`'s explainer how many FY2025 Nawiri and Rwanda households lost components (ask the charity, or bound it by the two programs' share of households), and lower the low end if needed. | under 2% |
| 9 | low | source | `persistence_years` explainer, resources | The 7-year Bangladesh and 10-year India results are attributed to Banerjee et al. (2015). They are Bandiera et al. (2017) and Banerjee, Duflo and Sharma (2021). The Sedlmayr et al. resource links IPA's study page, not the JDE paper. | | Cite both papers by name with their URLs, and link the JDE article (doi 10.1016/j.jdeveco.2019.102418). | none |

## Sources checked

| Row | URL | Status | Note |
|---|---|---|---|
| program_spend, program_expenses | villageenterprise.org …FY25-Financial-Statements.pdf | verified | "Program Services 17,076,992" (Exhibit B); Exhibit D country split matches the explainer |
| total_expenses | same | verified | "Total expenses 20,993,131" |
| staff_pay | same, Exhibit D | verified | Personnel total 8,851,768 |
| DREAMS 32%, subawards | Form 990 FY2025 | verified | DREAMS $5,425,322 of $17,076,992 (31.8%); Mercy Corps $2,323,287; IDinsight $455,027 |
| households | 2025 Annual Report p. 6 | verified | "Entrepreneurs Trained FY25 47,505"; same period as spending |
| lives_* (5 rows) | same | verified | 116,880 / 91,400 / 51,460 / 48,000 / 9,020; total 316,760 |
| dreams_household_share inputs | Annual report p. 11; DREAMS report p. 5 | verified | Ethiopia 64,800/10,800 = 6 lives per entrepreneur; "ten cohorts of 1,200 … staggering … four months". Tanzania is DREAMS too (#6) |
| study_household_size | IDinsight DIB report Table 1 | verified | "Household size 6.492 6.505 -0.013 0.718"; DREAMS 6.71 (Table 5a) and 7.96 at endline verified |
| core_control_consumption_month, core_effect_month | DIB report Table B1 (PDF p. 39) | verified | "TOT Consumption 158.007 10.290*** 0.000 1.752"; country split, see #1 |
| Sedlmayr comparison | DIB report Appendix L | verified | 3.94 vs 3.87 USD per household-month (Uganda) |
| dreams_control_consumption_month, dreams_effect_month | DREAMS report Table C1 (p. 86) | verified | "6560 112.06 19.10 *** 20.21 *** 18.86 ***"; cohort range 15.90–22.88 with no trend (p. 53) |
| spillover_ratio evidence | DREAMS report pp. 42–51 | verified | Few controls joined; qualitative positive spillovers; "lower bound" |
| delay_years | FS note 1 | verified | "targeting and training over four months before Small Business grants" |
| salary_gap context | Annual report | verified | 351 staff, 94% African |

## Drivers

1. `$uov_per_daly`, shared: 8.07–2.02. Not the builder's.
2. `persistence_years`, a judgment: 2.14–6.24. The biggest lever the builder owns. It needs the corrected trial reading and the peer anchor (#3). The DREAMS second endline (to 2.5 years) will be the best way to improve it.
3. `$uov_per_ln_consumption`, shared: 3.03–5.04.
4. `unmodelled_benefits_adj`, a judgment: 3.33–5.26. Each component is listed with its sign. Acceptable.
5. `evidence_adj`, a judgment: 3.09–4.75. Needs a named anchor (#4).

`core_effect_month` (observed, verified) comes next. The rows behind it should be per-country (#1).

The ranges are real uncertainty: the effect CIs come from the reported SEs, and the persistence range is anchored on published follow-ups. Cost and reach are point values. That is fine for audited figures and an annual count.

The result sits at 0.58× the cause median, next to GiveDirectly (3.96). The gap to the nearest graduation peer, Raising the Village (FP import, 12.6), comes mostly from that model's cost per person (about $30) against this one's $442 per household (about $68 per person). This model has the longer persistence, so persistence doesn't explain the gap. No action is needed beyond #3.
