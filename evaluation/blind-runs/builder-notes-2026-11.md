# Builders' notes on the skills, November 2026 re-run (dev items before the skill fixes, test items open)

## StrongMinds (3.21 y/$1k, unit_cost 2025)
- LEAK: docs/normalization.md 2.7 tables print evaluator results; audit-model reference class prints friendship-bench (HLI joint report). Sandbox must strip per-model results from docs / generated tables.
- research.md: find latest audit from financials listing page, not guessed URLs.
- wellbeing: counterfactual_adj default 1 (trial controls already care-as-usual).
- wellbeing deaths: discount suicides over duration? which population suicide rate.
- blend method for charity RCT vs literature (precision-weighted); PHQ-8 note next to phq9_sd.
- volunteer time in attribution: shared approach.
- ALLOWED_LITERALS lacks 100000.
- normalization-audit can't run in sandbox.
## SVB (10.87 y/$1k, past_average 2023; evaluator ~12)
- diet-change: stock of running wins -> wins/yr = (running+lapsed)/campaign years vs avg real spend same period; warn flow/avg age doubles.
- past_average: cost and wins same period; optional average_spend row, CPI deflation (shared CPI fact?).
- when past_average applies for diet change; lint flags past_average low every time.
- meal-mix: 1 (0.5-2) unless published comparison.
- scope exit for programmes with no split/no outcome data; how to flag partial coverage.
- SANDBOX: TLYCS FP model reads grants -> 7 false check errors, normalization-audit can't run. Drop models with missing refs.
- LEAK: normalization.md, sad_factors.json, waivers quote ACE SVB figures -> redact.
- no pdftotext; Read PDF works.
## THL (1.39 y/$1k, past_average 2025; evaluator 51 our view -> 0.027, worse than 0.13 before)
- Driver: accountability branch counterfactual 0.3/15.8 yrs = 0.019; new pledges only 1.6m hens. Template lacks accountability recipe (stock of pledges pressed many years). Builder's derivation divides by years of pressure - questionable (double-count of win_years_counted vs per-year flow?).
- 92% "pledges kept" is same Chicken Watch data as the 77% -> say in templates.md.
- branch adj naming (acc_evidence_adj) convention.
- lint noise: branch summary diagnostic always; spread medium even when explained.
- cross-version SAD split row; SAME-CHANGE false positive on labels.
- tenth rule and grants to sister orgs: split by activity?
- normalization-audit.ts needs --exclude.
- LEAK: normalization.md 2.9/2.10/4.1/5, sad_factors/aim_sads notes quote ACE/FP THL.
- LEAK: sandboxes live in session scratchpad next to ACE sheet downloads -> put sandboxes elsewhere (fresh dir outside scratchpad parent). webfetch cache in ~/.claude/projects/.../tool-results.
## TLYCS (test) sandbox 48.9 without 7 destinations; full repo est ~68
- SANDBOX: shared destination sets (TLYCS_DESTINATIONS, #givewell:...) read bulk models; sandbox must keep models that shared destination sets read (except excluded charity's).
- pass-through charities: operating cost = total less grants passed through.
- zero branches vs lint range findings; career placeholder sources show; sanctioned zero-branch form.
- policy-meta template: attribution/total_adj only on policy branch; decide whether credit share applies to money moved.
- conduit gifts (tax channel) vs new-money method.
- dead constant META_DONOR_COST_SHARE_FORMULA dimensionally wrong.
- normalization.md 2.8 GiveDirectly 0.00872 vs live 0.00792 (stale doc number).
- moved-money.ts explainer "15 charities" -> 14 (builder fixed in sandbox).
## DVF (test) 0.277 y/$1k, policy-research-meta animal variant (fund won), past_average 2024
- SANDBOX scrub: names split across wrapped md lines (Dansk Vegetarisk\nForening's 70%) -> match with \s+ over paragraphs.
- normalization-audit --exclude matches charity id, so skips the draft itself -> exclude by model id, never the charityevals draft.
- far-below medium can't clear -> same summary-reason downgrade as spread.
- policy-research-meta animal variant skeleton (sads_*, species step); zero branches in other units.
- won appropriation/fund recipe; spreading wins over past-average campaign years; counterfactual vs years counted split.
- by-nature accounts (European NGOs), provision transfers.
- formula printer: unary minus before paren fails derive read-back; lint should catch or printer fix.
- PDF pages needs poppler; large PDFs heavy.
- link-cpi.py COUNTRIES doesn't persist new country.
## SWP (test) 1.63 y/$1k unit_cost FY2024/25
- --exclude matches charity id in normalization-audit AND audit-model -> drops the draft. Match model ids only.
- lint: implementation_adj fulfilment read medium for shrimp/pig/fish; builder added Read.unlessSpecies (diff at ce-blind/shrimp-welfare-project/lint.diff, templates.diff) -> port.
- capital equipment recipe: cash vs accrual, depreciation, fx losses out, overhead same basis.
- equipment life vs win_years_counted: min(life, $win_years_counted).
- funds-held wait (reserves) + interest: shared convention for all families, not only direct-health.
- corporate-campaign implementation explainer names an evaluator's ALI model as shrimp anchor -> neutral reference class.
- SANDBOX: writeups not scrubbed (now scrubbed); prompt: say vitest fails expected in sandbox, which tests to run.
## Village Enterprise (test) 4.16 y/$1k unit_cost FY25
- cash-income: graduation/recurring-gain variant rows (fade_rate, persistence_years, branch evidence).
- household size: measured recipients' size as ratio to @household_size + waiver; template vs INV-13 conflict.
- Convention 4 example where branches meet before total_adj.
- baseline_consumption PPP cancels in RCT ratio.
- PDF fallback (pypdf venv; encrypted PDFs).
- normalization-audit mkdir generated/.
- lint: ranged numerator & denominator cancel.
- blind list: CEAs embedded in trial reports.
- reach given only cumulatively.
## HKI (test) 14.0 y/$1k unit_cost FY2025 (VAS 72.5% + NTD 27.5%; rest of nutrition left out)
- illness-only programmes (NTD disability): no sanctioned uov route (INV-2b forbids $uov_per_daly) -> shared uov per YLD / gbd_disability_weights route.
- Convention 4 for two interventions in one direct-health model.
- templates.md vitamin A: name income_to_mortality_value_ratio + rescaling; ln(2) literal.
- in-kind donated goods: out of expenses, into credit share.
- Convention 12: sub-activities with counts but no spending split.
- lint: definitional values without range.
- normalization-audit mkdir generated/; audit-model ~3 min.
- SANDBOX: waivers name model ids (helen-keller-vas) and meta.json source notes -> scrub gone model ids too (done).
## NI (test) 14.05 y/$1k unit_cost 2025
- SANDBOX: url scrub produced invalid URL -> staff_pay schema failed (fixed: placeholder URL). mkdir generated/.
- templates.md: vaccination incentives read internal_validity_adjustment_* (charity-specific evaluator judgment) -> blind conflict; shared figures from the evaluator's vaccine sheets make the model structurally close (limitation).
- vaccination recipe: per-vaccine coverage rise, catchment vs enrolled, adult bands with own discount, partner costs delivered basis.
- cash-income values for $1000 lump sums; small conditional incentives.
