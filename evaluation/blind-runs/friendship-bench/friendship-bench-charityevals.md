## Summary

Friendship Bench trains lay health workers, mostly older women known as "grandmothers", to give problem-solving talk therapy on wooden benches at clinics across Zimbabwe. It reports seeing 295,770 clients in 2024 and 336,215 in 2025.

We estimate **0.117 WELLBYs per dollar donated** (about 117 per $1,000), which is **about 16 times GiveDirectly**. The range is very wide: from 0.11× to 690× with every input at its low or high end together, or 0.32× to 263× with the site's shared exchange rates held at their defaults.

Three things decide the answer:

- how many units of value one WELLBY is worth (a shared assumption);
- how long the effect of therapy lasts;
- how far to trust the effect sizes.

Friendship Bench publishes no audited accounts, so the cost per client (about $12.40) is also an estimate. The two trials of the program disagree sharply. About half of clients get a single session, where the trials gave six.

## What the charity does

People who come to a primary-care clinic, or are referred by community health workers, are screened with the Shona Symptom Questionnaire (SSQ-14), a locally validated measure of depression and anxiety. Those above the cut-off sit on a bench with a lay health worker for problem-solving therapy. In the trials this was six weekly sessions of about 45 minutes.

In routine care, Friendship Bench's researchers write that "most recipients received between one and three sessions" and that up to 48% complete only one. Its quarterly reports, which record about one follow-up session per client, are consistent with this. Its annual totals are not: they record far fewer follow-up sessions and can't be reconciled with the quarterly figures.

Afterwards, clients can join a Circle Kubatana Tose peer group, which often runs savings and income activities. A WhatsApp "Open Line" gives remote counselling (9,870 clients in 2024).

The program covers all ten provinces. About four in five clients are seen outside Harare and Bulawayo, by village and community health workers. The program is being handed over to the Ministry of Health and Child Care, with full integration planned by 2028.

Friendship Bench also trains partners abroad ("Friendship Bench in a Box"), does research and runs a community hub in Harare. We don't model these.

## How the impact happens

1. A client with depression or anxiety gets one or more therapy sessions.
2. Their symptoms improve more than they would have with usual care. In the trials this was measured at 6 to 9 months.
3. The improvement fades over the following years.
4. Other members of the client's household benefit a little too (spillovers).

We count the improvement in standard deviations (SD) of depression and distress scales. We convert it to WELLBYs with the site's shared factor of 2 WELLBYs per SD-year. One WELLBY is one point of life satisfaction (0–10) for one person for one year.

## How the model works

### Cost

Friendship Bench Zimbabwe doesn't publish accounts, so we bracket its 2024 spending at $3.1M–4.9M, with $4.0M as the best guess:

- **Low end:** the 2024 Form 990 of its US fundraising arm, $3.1M.
- **Best guess:** its own fundraising ask of $8M for 2024 and 2025 together.
- **High end:** its own figure of "$13–16.50 per client".

We count 85% of that as the bench program, leaving out research and international training: $3.4M.

### Reach

Friendship Bench reports 295,770 clients in 2024. We subtract the 7,382 seen by implementing partners, whose costs aren't Friendship Bench's. We then keep 95% of the rest, to allow for double counting in an unverified administrative figure. That leaves about 274,000 clients, at about $12.40 each.

### Effect of a full course

Our standardisations of the two Friendship Bench trials are:

- **Harare** (Chibanda et al. 2016, JAMA): 1.08 SD.
- **Rural Bikita** (Haas et al. 2023): about 0.2 SD. Depression scores didn't improve there.

We weight them 35/65, because most clients are now seen in the Bikita-like setting, which gives 0.51 SD. We then blend that 50/50 with a meta-analytic prior of 0.49 SD. The prior is the publication-bias-corrected effect of psychotherapy for depression in non-Western, mostly low- and middle-income settings (Tong et al. 2023). The result is **0.50 SD**.

### Duration

The effect falls in a straight line to zero over 5 years (range 2–8). In the largest meta-analysis of long-term effects (Cuijpers et al. 2026), the effect falls from 0.54 SD at 3 months to 0.39 at one year and then stays flat. Long follow-ups are few, and almost all come from high-income countries, so we don't take the plateau fully at face value.

### WELLBYs

A full course gives 0.50 × 5 ÷ 2 = 1.25 SD-years, which is 2.5 WELLBYs per client.

The household multiplier adds about 60%. It uses the site's shared factors of 4.7 people per household and a 16% spillover. These come from the Happier Lives Institute's psychotherapy analysis, so they are the one part of the chain taken from an existing evaluation of this charity.

### Adjustments

Together they multiply the outcome by about 0.38:

- **Evidence, 0.8.** In Tong et al., trials at low risk of bias show about 0.63 of the pooled effect. We apply that discount to the trial half of the blend only, because the prior half is already corrected.
- **Counterfactual, 0.95.** Few other providers offer this kind of help.
- **Attribution, 0.8.** The health ministry's workers and clinics carry part of the cost.
- **Delivery, about 0.63.** Half of clients get one session, worth half a full course. The rest get three quarters of the full effect.

### Donor share

A small salary-sacrifice discount: 5%.

## What drives the result

| Input | Range | Result (× GiveDirectly) |
|---|---|---|
| Units of value per WELLBY (shared assumption) | 0.4–3 | 5× to 41× |
| How long the effect lasts | 2–8 years | 6× to 25× |
| Household spillover (shared fact) | 5–30% | 12× to 21× |
| Evidence adjustment | 0.6–1 | 12× to 20× |
| Attribution | 0.6–1 | 12× to 20× |
| WELLBYs per SD-year (shared fact) | 1.5–2.5 | 12× to 20× |
| Spending | $3.1M–4.9M | 20× to 13× |

Judgment calls and shared assumptions make up 79% of the uncertainty.

## Biggest uncertainties

- **Which trial to believe.** The urban trial's effect (about 1.1 SD) is among the largest in the literature. In the rural trial, depression scores (PHQ-9) didn't move, though the distress scale did. We lean toward the rural result and blend both with a literature prior.
- **How long it lasts.** No follow-up of this program goes beyond 9 months.
- **Sessions received.** Friendship Bench's own counts are inconsistent. Evidence on what a single session achieves is thin: a meta-analysis of single-session interventions in young people (Schleider and Weisz 2017) and six small adult trials (Kim, Ryu and Chibanda 2023).
- **Depression scales versus life satisfaction.** Effects in SDs of a symptom scale, measured in a sample screened for symptoms, may not convert one for one into life satisfaction.
- **Cost.** There are no audited accounts.
- **Reach is self-reported.** Friendship Bench's monitoring got complete follow-up data for about a fifth of a cohort and has no control group. We use its client counts with a small discount, and don't use its recovery rates.

## What isn't modelled

- The income and savings effects of the Circle Kubatana Tose peer groups, beyond what the trials captured (they included optional peer support).
- Research, and its influence on other programs and countries.
- Friendship Bench in a Box partners abroad.
- Effects on HIV treatment adherence. The rural trial found none.
- The handover's effect on whether the government keeps providing the service.
- Suicide deaths averted. Friendship Bench reports reduced suicidal ideation, but no trial measured deaths.

## Sources

- Friendship Bench annual reports 2023–2025 and quarterly impact reports: [impact reports page](https://www.friendshipbenchzimbabwe.org/impactreports).
- Friendship Bench Inc Form 990s: [ProPublica](https://projects.propublica.org/nonprofits/organizations/853440548).
- Chibanda et al. 2016: [JAMA](https://jamanetwork.com/journals/jama/fullarticle/2594719).
- Haas et al. 2023: [JAMA Network Open](https://pmc.ncbi.nlm.nih.gov/articles/PMC10346120/).
- Tong et al. 2023: [Psychological Medicine](https://pmc.ncbi.nlm.nih.gov/articles/PMC10951412/).
- Karyotaki et al. 2022: [JAMA Psychiatry](https://pmc.ncbi.nlm.nih.gov/articles/PMC8943620/).
- Cuijpers et al. 2026: [World Psychiatry](https://pmc.ncbi.nlm.nih.gov/articles/PMC13176859/).
- Shava et al. 2026: [single-session therapy protocol](https://pmc.ncbi.nlm.nih.gov/articles/PMC13295822/).
- Schleider and Weisz 2017: [single-session interventions](https://www.sciencedirect.com/science/article/abs/pii/S0890856716319335).
- Kim, Ryu and Chibanda 2023: [single-session therapy review](https://pmc.ncbi.nlm.nih.gov/articles/PMC10631081/).
- Kidia et al. 2024: [rural Friendship Bench qualitative study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11221631).
- [Economic threshold analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC9046737/).
- [KBF Africa Prize](https://kbfafricaprize.org/laureate/friendship-bench-zimbabwe/).

## How this model was checked

The model was built with the build-cea skill. Independent reviewers then audited it with the audit-cea skill, without access to the builder's notes.

**Round 1:** 1 high, 3 medium and 4 low findings. The result moved from 12.2× to 16.6× GiveDirectly.

- **High.** The effect duration contradicted the plateau in its own source. We raised it from 3 years to 5 years, with a range of 2–8.
- **Medium.** We raised the single-session share and lowered the effect for clients with more sessions.
- **Medium.** We anchored the evidence adjustment on Tong et al.'s risk-of-bias gap.
- **Medium.** We removed partner-delivered clients from reach and added a counting adjustment.
- **Low.** We fixed trial figures and wording.

**Round 2:** no high, 2 medium and 4 low findings. The result moved from 16.6× to 15.6×.

- **Medium.** Friendship Bench's quarterly reports contradict its annual follow-up counts. We set the single-session share to 50% (range 35–80%).
- **Medium.** We replaced the 50/50 average of the two trials with a weight on the urban trial of 35% (range 20–50%), reflecting where clients are actually seen.
- **Low.** We clarified the wording of several explainers, added the single-session evidence for depression, disclosed the origin of the spillover factors and added sources.

The loop stopped after round 2 because no high findings remained.
