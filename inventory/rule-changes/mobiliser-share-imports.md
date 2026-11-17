# Imports: mobilised or own delivery (rule 2.24)

Written by `python3 scripts/link-mobiliser-share.py --table`; the rules are RULES in that script.

The one test: would the party that carries out the good have committed its resources without the organisation?

- **Mobilised** (`mobilised: true`, takes `$mobiliser_share`): the sheet's good is done by another party's own programme or
  decision, taken because of the organisation. Classes: research, technical assistance, policy, campaign, money moved.
- **Own delivery** (`mobilised: false`): the organisation, or partners it pays, delivers the goods or services, also inside
  public facilities or with a government's in-kind help (co-funders, under `$resource_shares`).
- Delivery that also crowds in public money (GiveWell's leverage) is classed whole by what the bottom line mostly is; the
  blend (own share + s × the rest) is deferred (docs/normalization.md 2.24).
- Variants inherit their model's class.

## Counts

| Evaluator | Imports | Mobilised | Research | Technical assistance | Policy | Campaign | Money moved | Delivery |
|---|---|---|---|---|---|---|---|---|
| ace | 17 | 17 | 1 | 0 | 0 | 16 | 0 | 0 |
| ambitious-impact | 16 | 7 | 1 | 0 | 4 | 0 | 2 | 9 |
| givewell | 159 | 60 | 33 | 23 | 4 | 0 | 0 | 99 |
| hli | 13 | 3 | 0 | 1 | 2 | 0 | 0 | 10 |
| leep | 2 | 2 | 0 | 0 | 2 | 0 | 0 | 0 |
| sogive | 11 | 2 | 2 | 0 | 0 | 0 | 0 | 9 |
| the-life-you-can-save | 15 | 4 | 0 | 4 | 0 | 0 | 0 | 11 |
| **All** | 233 | 95 | 37 | 28 | 12 | 16 | 2 | 138 |

## The rules

First match on the model's id wins.

| Evaluator | Class | Models whose id matches | Reason |
|---|---|---|---|
| givewell | delivery | `^raising-the-village-2024 ¦ ^rice-institute-kmc-with ¦ ^ird-global-breastfeeding-promotion-pilot` | A programme sheet: the grantee delivers, and the value of what GiveWell learns is the smaller part of the bottom line. |
| givewell | research | `voi ¦ value-information ¦ optionality ¦ option-value ¦ incubat ¦ accelerator-renewal ¦ rough-beta ¦ -rct ¦ idinsight ¦ m-e-msi ¦ monitoring ¦ atlas-ai ¦ yale-research ¦ medicines-development ¦ who-gdg ¦ sickkids ¦ bridge-funding-water-vouchers-value ¦ india-water-pilot` | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| givewell | policy | `centre-for-pesticide-suicide-prevention ¦ vital-strategies ¦ pure-earth` | The good is done by a government's law, tax or regulation and those who comply with it. |
| givewell | technical assistance | `technical-assistance ¦ chai-ppm ¦ chai-tsus ¦ evidence-action-india$ ¦ -ifa- ¦ iron-folic-acid ¦ syphilis ¦ healthy-futures ¦ rice-fortification ¦ world-food-programme ¦ ^path- ¦ in-line-chlorination-india ¦ ^global-alliance-for-improved-nutrition ¦ ^iodine-global-network` | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| givewell | delivery | `.` | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| ace | research | `^wild-animal-initiative` | Counts published papers: the good is done by whoever acts on the research. |
| ace | campaign | `.` | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| ambitious-impact | money moved | `^better-futures-guide ¦ ^cearch` | Moves donors' money to other charities (the shared money rows carry the share). |
| ambitious-impact | policy | `^alliance-for-reducing-microbial-resistance ¦ ^animal-policy-international ¦ ^concentric-policies ¦ ^labri` | Advocacy: the good is done by a government's law, tax or regulation and those who comply with it. |
| ambitious-impact | research | `^lead-research-for-action` | Studies of lead sources: the good is done by the governments and others that act on them. |
| ambitious-impact | delivery | `.` | The charity delivers the service, training or goods itself. |
| hli | policy | `^pure-earth` | Advocacy and enforcement monitoring: the good is done by the regulator and the producers that comply. |
| hli | technical assistance | `^pallium-india` | Builds palliative care and opioid access through state governments' and hospitals' own services (the model's staff-pay class is research and policy). |
| hli | delivery | `.` | The charity delivers the service or goods itself. |
| leep | policy | `.` | The good is done by governments' lead paint limits and the manufacturers that reformulate. |
| sogive | research | `^breast-cancer-now ¦ ^motor-neurone-disease-association` | Nearly all the healthy years in SoGive's figure come from research: the good is done by the health systems that adopt it. |
| sogive | delivery | `.` | The charity (or partners it pays) delivers the service or goods; where research is the smaller part of the figure the model is classed whole. |
| the-life-you-can-save | technical assistance | `iron-folic-acid ¦ syphilis ¦ ^teaching-at-the-right-level ¦ llins-south-sudan` | A government pays for and delivers the programme; the charity advises and supports it. |
| the-life-you-can-save | delivery | `.` | The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding. |

## Calls near the line

- Deworming (GiveWell's and SoGive's sheets), vitamin A, seasonal malaria chemoprevention, nets: own delivery. The charity pays most of the delivery cost (Deworm the World 61% in GiveWell's 2024 sheet, Helen Keller 45 to 70%); teachers' and health workers' time is a government's in-kind co-funding.
- Fortify Health: own delivery. It pays for the premix and equipment the mills use.
- Results for Development (amoxicillin): own delivery. It pays about two thirds of the drugs in GiveWell's sheet.
- UNFPA Supplies: own delivery (commodities bought); the governments' matched money is the deferred blend.
- PATH (malaria vaccines, perennial chemoprevention): technical assistance. Governments and Gavi pay for and deliver the vaccines and drugs; philanthropy covers 20 to 31% in GiveWell's sheets.
- Evidence Action: iron and folic acid, syphilis screening and in-line chlorination in India are technical assistance (the states buy and deliver); Dispensers for Safe Water and in-line chlorination in Kenya, Malawi and Uganda are own delivery.
- Sheets that add what GiveWell learns to a programme's own benefit: research where the sheet is about the pilot or trial (GiveDirectly's pilots: over half the bottom line is value of information), own delivery where it is a programme sheet with a smaller optionality term (Raising the Village 2024, r.i.c.e. kangaroo care 2023).
- Ambitious Impact's Neev, Learning Alliance and First Embrace: own delivery. The charity pays for the training; what kiln owners, teachers and hospitals add is small.
- SoGive: Motor Neurone Disease Association is research (91% of the healthy years in its figure), Versus Arthritis own delivery (research is 30%).
- HLI's Pallium India: technical assistance, on the model's own staff-pay class (research and policy); HLI gives only a range.
- Better Futures Guide and CEARCH (money moved): their shared money rows carry the share (scripts/moved-money.py), so they get the field and the pin only, no second factor.
- GiveWell's Iodine Global Network sheet has no result in common units: it gets the field only.

## For the step that re-judges shares: the adopter is in the evaluator's denominator

Mobilised, and the evaluator's cost already includes the spending of the party that carries out the good, so below 100% that
party would be cut twice. Nothing changes here (the default is 100%); in our view the adopter's spending has to leave the
denominator (a cost of the mobilised resources instead, inside the share), heaviest first:

- alliance-for-reducing-microbial-resistance-aim: Ambitious Impact's cost per DALY counts the governments' payments for the pull incentive (about $300 million a year, weighted by the chance of success) beside the charity's few million.
- teaching-at-the-right-level-africa-tlycs: The Life You Can Save's figure is per dollar of all the programme's money; the governments pay 39 to 77% of it in the three countries.
- malaria-consortium-tlycs-llins-south-sudan: the cost counted is $3.26 million of nets for the extra people found beside Malaria Consortium's $0.12 million.
- concentric-policies-aim: the government's cost of running the tax (about $44,000 a year) is in the cost per DALY beside the charity's $225,000 a year.
- lead-exposure-elimination-project-leep, lead-exposure-elimination-project-leep-2024: LEEP's cost is its own spending plus the governments' enforcement spending counted at half (about two fifths of the Malawi model's cost, about 7% of the 2024 model's).

## Every import

| Model | Evaluator | Class | Mobilised | Reason |
|---|---|---|---|---|
| albert-schweitzer-foundation-ace-2016 | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| animal-welfare-observatory | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| aquatic-life-institute | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| ciftlik-hayvanlarini-koruma-dernegi | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| ciftlik-hayvanlarini-koruma-dernegi-ace-2026 | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| dansk-vegetarisk-forening | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| good-food-fund | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| greener-by-default | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| humane-society-of-the-united-states-ace-2016 | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| proveg-deutschland-ace-2016 | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| shrimp-welfare-project | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| sinergia-animal | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| sinergia-animal-ace-2026 | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| sociedade-vegetariana-brasileira | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| the-humane-league | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| vegan-outreach-ace-2016 | ace | campaign | yes | The good is done by the companies, institutions, lawmakers and consumers that change what they do after the campaign or outreach, as in our corporate-campaign and diet-change builds. |
| wild-animal-initiative | ace | research | yes | Counts published papers: the good is done by whoever acts on the research. |
| better-futures-guide-aim | ambitious-impact | money moved | yes | Moves donors' money to other charities (the shared money rows carry the share). |
| cearch-aim | ambitious-impact | money moved | yes | Moves donors' money to other charities (the shared money rows carry the share). |
| alliance-for-reducing-microbial-resistance-aim | ambitious-impact | policy | yes | Advocacy: the good is done by a government's law, tax or regulation and those who comply with it. |
| animal-policy-international-aim | ambitious-impact | policy | yes | Advocacy: the good is done by a government's law, tax or regulation and those who comply with it. |
| concentric-policies-aim | ambitious-impact | policy | yes | Advocacy: the good is done by a government's law, tax or regulation and those who comply with it. |
| labri-aim | ambitious-impact | policy | yes | Advocacy: the good is done by a government's law, tax or regulation and those who comply with it. |
| lead-research-for-action-aim | ambitious-impact | research | yes | Studies of lead sources: the good is done by the governments and others that act on them. |
| better-season-project-aim | ambitious-impact | delivery | no | The charity delivers the service, training or goods itself. |
| first-embrace-aim | ambitious-impact | delivery | no | The charity delivers the service, training or goods itself. |
| kaya-guides-aim | ambitious-impact | delivery | no | The charity delivers the service, training or goods itself. |
| learning-alliance-aim | ambitious-impact | delivery | no | The charity delivers the service, training or goods itself. |
| neev-aim | ambitious-impact | delivery | no | The charity delivers the service, training or goods itself. |
| novah-aim | ambitious-impact | delivery | no | The charity delivers the service, training or goods itself. |
| opal-health-aim | ambitious-impact | delivery | no | The charity delivers the service, training or goods itself. |
| oxygen-access-project-aim | ambitious-impact | delivery | no | The charity delivers the service, training or goods itself. |
| respira-health-aim | ambitious-impact | delivery | no | The charity delivers the service, training or goods itself. |
| centre-for-pesticide-suicide-prevention-cpsp-skeleton | givewell | policy | yes | The good is done by a government's law, tax or regulation and those who comply with it. |
| pure-earth-model | givewell | policy | yes | The good is done by a government's law, tax or regulation and those who comply with it. |
| vital-strategies-botec-breakeven | givewell | policy | yes | The good is done by a government's law, tax or regulation and those who comply with it. |
| vital-strategies-model | givewell | policy | yes | The good is done by a government's law, tax or regulation and those who comply with it. |
| atlas-ai-atlasai-target-pop-optionality-voi | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| clinton-health-access-initiative-chai-incubator-threshold | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| clinton-health-access-initiative-chai-msupply-voi-2025 | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| clinton-health-access-initiative-msupply-rct-april-2026 | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| development-innovation-lab-dil-bridge-funding-water-vouchers-value | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| development-innovation-lab-water-vouchers-value-information | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| dimagi-optionality-mother-baby-wellness | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| evidence-action-accelerator-renewal-november-2021 | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| evidence-action-india-water-pilot-expansion-2023 | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| evidence-action-rough-beta | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| fika-bridges-to-prosperity-value-information | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| fortify-health-value-incubation-grants-june-2019 | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| fortify-health-value-information-december-2021 | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| givedirectly-pilots-optionality-2025 | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| idinsight-model | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| idinsight-value-model-new-incentives-endline-rct | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| innovations-for-poverty-action-ipa-m-e-msi-family-planning-outreach | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| international-rescue-committee-voi-irc-mini-incubator-june-27-2024 | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| ird-global-mcct-value-information-evaluation | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| ird-global-zm-mccts-value-information | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| j-pal-vouchers-option-value-2024 | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| johns-hopkins-university-ca-code-voi-threshold | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| johns-hopkins-university-chobi7-bangladesh-voi | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| lshtm-earn-rct-voi-2024 | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| medicines-development-for-global-health-moxidectin-mda-onchocerciasis-ro | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| miraclefeet-monitoring-may-2023-voi-vet-complete | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| new-incentives-expected-cost-effectiveness-2017-rct | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| one-acre-fund-updated-value-information-rwanda | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| sickkids-f35-milk-trial-2026 | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| uduma-ilc-pilot-in-mali-option-value-february | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| wehi-voi-walter-eliza-hall-iron-repletion | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| world-health-organization-rough-who-gdg-march-2025 | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| yale-research-initiative-on-innovation-and-scale-desalination-kiosks-in | givewell | research | yes | The sheet values what a trial, pilot, evaluation or incubator leads GiveWell and others to fund or change later: the spending research changed. |
| clinton-health-access-initiative-chai-ppm-2024 | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| clinton-health-access-initiative-chai-tsus-april-2025 | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| evidence-action-2023-top-up-technical-assistance-to | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| evidence-action-ifa-evac-beta-india | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| evidence-action-ifa-in-bihar-uttar-pradesh-july-2024 | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| evidence-action-ifa-supplementation-2022 | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| evidence-action-in-line-chlorination-india-2023 | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| evidence-action-india | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| evidence-action-iron-folic-acid-supplementation-india | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| evidence-action-maternal-syphilis-zambia-cameroon | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| evidence-action-phase-2-ifa-model-with-updated-iron | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| evidence-action-syphilis-screen-treat-in-pregnant-women | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| evidence-action-syphilis-screening-treatment-in | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| evidence-action-technical-assistance-to-liberia | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| global-alliance-for-improved-nutrition-givewell | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| healthy-futures-phl-based-on-updated-23-feb-2026 | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| iodine-global-network-givewell | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| nutrition-international-rice-fortification-2024 | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| path-pmc-drc-pilot | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| path-pmc-rtss-threshold-2023 | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| path-rts-s-pilot-comparison-areas-based-on | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| path-threshold-accelerator-malaria-vaccines | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| world-food-programme-ta-iron-2-0-2025 | givewell | technical assistance | yes | A government (or its suppliers) pays for and delivers the programme; the grantee advises and supports it. |
| against-malaria-foundation | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| against-malaria-foundation-2023-amf-drc | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| against-malaria-foundation-insecticide-treated-net-itn | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| against-malaria-foundation-insecticide-treated-net-itn-2023-06 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| against-malaria-foundation-insecticide-treated-net-itn-2024-12 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| against-malaria-foundation-insecticide-treated-net-itn-2025-08 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| against-malaria-foundation-insecticide-treated-net-itn-2026-05 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| alima-malnutrition-treatment-chad-2021-with | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| alima-malnutrition-treatment-chad-2024-renewal | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| alima-malnutrition-treatment-combined | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| alima-mirriah-niger-operational | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| alima-primary-healthcare-malnutrition | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| ansh-kangaroo-care-2024 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| clear-solutions-ors-zinc | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| clinton-health-access-initiative-a-community-based-tb-hcm-in-india | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| clinton-health-access-initiative-chai-ors-zinc | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| clinton-health-access-initiative-chai-ors-zinc-updated-costs-january-202 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| clinton-health-access-initiative-malaria-rdt-procurement-chai-nigeria | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| development-innovation-lab-vouchers-water-quality-february-2023 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| development-media-international-dmi | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| dimagi-commcare-connect-2023 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| evidence-action-cost-effectiveness-january-2023-deworm | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| evidence-action-deworm-world-2024-renewal | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| evidence-action-dispensers-safe-water-based-on-larger | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| evidence-action-quick-nls-calcs | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| evidence-action-water-quality-ilc-dsw | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| evidence-action-water-quality-ilc-dsw-with-lower | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| evidence-action-water-quality-nov-2022 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| family-empowerment-media-planning-radio-campaigns-with-fem-kano | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| fika-update-to-bridges-to-prosperity | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| fortify-health-iron-consolidation-published | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| fortify-health-iron-fortification-december-2021 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| fortify-health-iron-fortification-impact-on-perinatal | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| fortify-health-iron-fortification-moral-weights | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| fortify-health-steady-state-iron-fortification-june | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| givedirectly | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| givedirectly-cash-poverty-relief-2024 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| givedirectly-unconditional-cash-transfers-dec-2023 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| givedirectly-v2-6x-botecs-givewell | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| helen-keller-intl-april-2023-madagascar | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| helen-keller-intl-vitamin-a-supplementation-2024-v1 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| helen-keller-intl-vitamin-a-supplementation-2024-v2 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| helen-keller-vas | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| international-rescue-committee-global-vaccines-based-on-new-incentives | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| international-rescue-committee-malnutrition-treatment-irc-standard | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| ird-global-2023-zm-mcct-in-sindh | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| ird-global-breastfeeding-promotion-pilot-march-2024 | givewell | delivery | no | A programme sheet: the grantee delivers, and the value of what GiveWell learns is the smaller part of the bottom line. |
| ird-global-mcct-in-high-risk-sindh-districts-2021 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| ird-global-operational-funding-threshold-2023 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| jhpiego-seasonal-malaria-chemoprevention-smc | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| lafiya-nigeria-2026 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| lshtm-eyeglasses-workers-2024 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-borno-crowding-out-assumptions-seasonal | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-borno-smc-2021 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-high-indirect-deaths-averted-seasonal | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-insecticide-treated-net-itn | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-low-indirect-deaths-averted-seasonal | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-ondo-anambra-llins | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-seasonal-chemoprevention-smc-2025-1 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-seasonal-chemoprevention-smc-2025-2 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-seasonal-chemoprevention-smc-april-2024 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-smc | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-smc-outside-sahel-seasonal | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-smc-vas-co-delivery-by-october-2023 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-vitamin-a-supplementation-vas | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| malengo-2024 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| msi-reproductive-choices-family-planning-mobile-outreach-2026 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-conditional-cash-transfers-to-increase | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-conditional-cash-transfers-to-increase-2023-11 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-conditional-cash-transfers-to-increase-2024-10 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-cost-effectiveness-november-2022 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-evidence-cost-effectiveness-writeup | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-june-2019 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-june-2019-endline-updated-ni-early-2018 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-june-2023 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-march-2025-renewal-conditional-cash | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-ni-early-2018-with-baseline-rates | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-niger-yobe-expansion-conditional-cash | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-with-addition-orsz-january-2025 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| notify-health-sms-feb-2025 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| nutrition-international-2024-chad-renewal-vitamin-a | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| nutrition-international-chad-may-2023 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| nutrition-international-vitamin-a-chad-march-2022 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| one-acre-fund-seedlings-2022 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| precision-development-agriculture-intervention-report | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| raising-the-village-2024 | givewell | delivery | no | A programme sheet: the grantee delivers, and the value of what GiveWell learns is the smaller part of the bottom line. |
| results-for-development-phase-ii-r4d-december-2018-amoxicillin | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| rice-institute-kangaroo-mother-care | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| rice-institute-kmc-with-r-i-c-e-in-uttar-pradesh-2023 | givewell | delivery | no | A programme sheet: the grantee delivers, and the value of what GiveWell learns is the smaller part of the bottom line. |
| sightsavers-cameroon-nigeria-cost-effectiveness | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| sightsavers-cost-effectiveness-april-2023-drc | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| sightsavers-cost-effectiveness-january-2023 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| spiro-community-based-tb-hcm-april-2025 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| suvita-march-2023 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| taimaka-malnutrition-treatment-2024 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| uduma-in-line-chlorination-february-2025 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| unfpa-supplies-partnership-february-2026 | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| university-college-london-pla-mnh-participatory-learning-action | givewell | delivery | no | The grantee, or partners it pays, delivers the goods or services; a government's in-kind help is co-funding. |
| pure-earth-hli-ghana-cosmetics | hli | policy | yes | Advocacy and enforcement monitoring: the good is done by the regulator and the producers that comply. |
| pure-earth-hli-ghana-cosmetics-before-correction | hli | policy | yes | Advocacy and enforcement monitoring: the good is done by the regulator and the producers that comply. |
| pallium-india-hli | hli | technical assistance | yes | Builds palliative care and opioid access through state governments' and hospitals' own services (the model's staff-pay class is research and policy). |
| actra-hli | hli | delivery | no | The charity delivers the service or goods itself. |
| against-malaria-foundation-hli | hli | delivery | no | The charity delivers the service or goods itself. |
| fortify-health-hli | hli | delivery | no | The charity delivers the service or goods itself. |
| friendship-bench | hli | delivery | no | The charity delivers the service or goods itself. |
| givedirectly-hli | hli | delivery | no | The charity delivers the service or goods itself. |
| icddr-b-hli | hli | delivery | no | The charity delivers the service or goods itself. |
| shamiri-institute-hli | hli | delivery | no | The charity delivers the service or goods itself. |
| strongminds | hli | delivery | no | The charity delivers the service or goods itself. |
| taimaka-hli | hli | delivery | no | The charity delivers the service or goods itself. |
| world-spine-care-hli | hli | delivery | no | The charity delivers the service or goods itself. |
| lead-exposure-elimination-project-leep | leep | policy | yes | The good is done by governments' lead paint limits and the manufacturers that reformulate. |
| lead-exposure-elimination-project-leep-2024 | leep | policy | yes | The good is done by governments' lead paint limits and the manufacturers that reformulate. |
| breast-cancer-now-sogive | sogive | research | yes | Nearly all the healthy years in SoGive's figure come from research: the good is done by the health systems that adopt it. |
| motor-neurone-disease-association-sogive-upper-bound | sogive | research | yes | Nearly all the healthy years in SoGive's figure come from research: the good is done by the health systems that adopt it. |
| compassion-uk-sogive | sogive | delivery | no | The charity (or partners it pays) delivers the service or goods; where research is the smaller part of the figure the model is classed whole. |
| end-fund-deworming-sogive-2022 | sogive | delivery | no | The charity (or partners it pays) delivers the service or goods; where research is the smaller part of the figure the model is classed whole. |
| evidence-action-deworm-the-world-sogive-2022 | sogive | delivery | no | The charity (or partners it pays) delivers the service or goods; where research is the smaller part of the figure the model is classed whole. |
| royal-national-lifeboat-institution-sogive | sogive | delivery | no | The charity (or partners it pays) delivers the service or goods; where research is the smaller part of the figure the model is classed whole. |
| sightsavers-deworming-sogive-2022 | sogive | delivery | no | The charity (or partners it pays) delivers the service or goods; where research is the smaller part of the figure the model is classed whole. |
| strongminds-sogive-march-2024 | sogive | delivery | no | The charity (or partners it pays) delivers the service or goods; where research is the smaller part of the figure the model is classed whole. |
| unlimit-health-deworming-sogive-2022 | sogive | delivery | no | The charity (or partners it pays) delivers the service or goods; where research is the smaller part of the figure the model is classed whole. |
| versus-arthritis-sogive-upper-bound | sogive | delivery | no | The charity (or partners it pays) delivers the service or goods; where research is the smaller part of the figure the model is classed whole. |
| woodland-trust-sogive | sogive | delivery | no | The charity (or partners it pays) delivers the service or goods; where research is the smaller part of the figure the model is classed whole. |
| evidence-action-tlycs-iron-folic-acid-india | the-life-you-can-save | technical assistance | yes | A government pays for and delivers the programme; the charity advises and supports it. |
| evidence-action-tlycs-syphilis-free-start-liberia | the-life-you-can-save | technical assistance | yes | A government pays for and delivers the programme; the charity advises and supports it. |
| malaria-consortium-tlycs-llins-south-sudan | the-life-you-can-save | technical assistance | yes | A government pays for and delivers the programme; the charity advises and supports it. |
| teaching-at-the-right-level-africa-tlycs | the-life-you-can-save | technical assistance | yes | A government pays for and delivers the programme; the charity advises and supports it. |
| against-malaria-foundation-tlycs | the-life-you-can-save | delivery | no | The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding. |
| educate-girls-tlycs | the-life-you-can-save | delivery | no | The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding. |
| evidence-action-tlycs-dispensers-for-safe-water | the-life-you-can-save | delivery | no | The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding. |
| fistula-foundation-tlycs | the-life-you-can-save | delivery | no | The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding. |
| helen-keller-intl-tlycs | the-life-you-can-save | delivery | no | The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding. |
| living-goods-tlycs | the-life-you-can-save | delivery | no | The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-tlycs-emergency-response-ethiopia | the-life-you-can-save | delivery | no | The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding. |
| malaria-consortium-tlycs-smc-vas-co-delivery-nigeria | the-life-you-can-save | delivery | no | The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding. |
| new-incentives-tlycs | the-life-you-can-save | delivery | no | The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding. |
| one-acre-fund-tlycs | the-life-you-can-save | delivery | no | The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding. |
| village-enterprise-tlycs | the-life-you-can-save | delivery | no | The charity (or partners it pays) delivers the goods or services; a government's in-kind help is co-funding. |
