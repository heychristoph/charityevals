### Summary

This is the British Heart Foundation's health and support work in the UK, in the year to 31 March 2026. It covers health information, the Heart Helpline, the Heart Matters magazine, online peer support, CPR training and the national defibrillator network. BHF's research, NHS pilots and policy work are the [main model](/british-heart-foundation-charityevals).

We estimate **<span data-figure="headline" data-model="british-heart-foundation-charityevals-health">0.005</span> years of healthy life per $1,000** you give to this work. About nine tenths of that comes from information and support, the rest from CPR training and defibrillators. BHF measures no outcomes for any of it, so every part is built from research on that kind of work and discounted for missing data.

### What the charity does

BHF's health spending was £54.2m. The accounts don't split it by activity, so the shares below are our estimates:

- **Information and support, about 74%.** This covers the health information pages (35 million views), the Heart Matters magazine and printed guides (over 150,000 accessible copies), the nurse-led Heart Helpline (26,000 people), online peer support (9,000 active users a month) and awareness campaigns.
- **CPR and defibrillators, about 15%.** The free RevivR app teaches CPR in about 15 minutes, and 190,000 people completed it in the year. The Circuit is the defibrillator map every UK ambulance service uses to send 999 callers to the nearest device. It lists 118,800 defibrillators.
- **Policy (about 6%) and NHS implementation pilots (about 5%).** These are modelled in the main model.

### How the model works

**Information and support** is built from trials of patient education for coronary heart disease:

- **People reached:** the helpline's 26,000 callers and 9,000 peer-community users. Then the readers: 35 million page views, about two thirds from the UK, at about 3 pages per reader, plus about 300,000 readers of print. We count only the 22% of readers we judge to be patients with heart or circulatory disease, about 2 million people.
- **Dose:** the trials gave programmes of education, from one 40-minute session with a follow-up call to weeks of sessions. We count a helpline call or peer support as a tenth of a trial programme, and reading a few pages as a hundredth. For comparison, five tailored mail-outs after a heart attack changed one behaviour a little and medication use not at all (the ISLAND trial). That comes to about 23,000 people's worth of a trial programme.
- **Effect:** in the trials, education cut deaths by a fifth (risk ratio 0.80, 95% CI 0.60 to 1.05; Cochrane, 2017) among patients dying at about 3% a year. It also raised quality of life a little, which we count as 0.02 of a healthy year. Both effects are taken over the trials' follow-up, about a year and a half.
- **Adjustments:** we put trust in the trials at 0.6, since the death effect is uncertain. The trials' control groups already had usual care, so only help from elsewhere counts against BHF: 55% of the benefit wouldn't have come from the NHS website or other charities anyway. BHF has 90% of the credit; Tesco and Royal Mail part-fund the printed information.

**RevivR:**
- A trainee is at a cardiac arrest about once in 1,200 years. That comes from 54 arrests per 100,000 people a year, with 1.5 people present at each.
- Over the 3 years the training lasts, a trained bystander is 15 percentage points likelier to give CPR. In England, bystanders already give CPR at 73% of arrests.
- Bystander CPR adds about 4 points to survival. This is the adjusted figure from a Swedish registry of 30,000 arrests.
- A fifth of trainees would have learned CPR elsewhere in those years.

**The Circuit:**
- Bystanders use a public defibrillator in 9% of the UK's 43,000 attempted resuscitations.
- We judge that a fifth of those uses happen because the network sent someone to a device.
- Each use adds about 8 points to survival.
- BHF gets a tenth of the credit, because others bought the devices and look after them.

Deaths averted are valued at the site's value of a death by age. Heart patients die at the ages of UK cardiovascular deaths (GBD 2023: four in five at 70 or older), using the five-year values above 70. Cardiac-arrest survivors are younger. Every branch is multiplied by the shared "How much we count a programme whose results aren't measured" (50% by default).

### What drives the result

- **The dose of education a reader gets:** a hundredth of a trial programme, 0.3% to 3%. This moves the result about 5 times.
- **The missing-data discount** (your value judgment).
- **The effect of education on deaths:** a fifth fewer, from near zero to two fifths.
- **Pages per reader, the share of readers who are patients, and how long the trials' effect lasts.**

### Biggest uncertainties

- **Dose.** No study measures what reading BHF's pages or calling its helpline does. The effect is scaled down from structured education programmes, and the scale is our judgment.
- **The education trials.** Their effect on deaths is moderate-quality evidence, and the interval includes no effect. Telephone support for heart failure points the same way (deaths fell 13%).
- **The spending split** inside health is our judgment.
- **The survival gains** for CPR and defibrillators come from registries, not trials. No study measures what The Circuit adds.

### What isn't modelled

- Awareness campaigns' effect on how quickly people call 999 with heart-attack symptoms. About half the campaigns studied shortened the delay, and half didn't. Also readers prompted to seek a diagnosis. These sit in a small unmodelled share, along with the harm of brain injury in some cardiac-arrest survivors.
- Reassurance for families, and carers who help the patient act on the information.

### How this model was checked

Mechanical checks: lint, the normalization invariants and the reference class (`scripts/audit-model.ts`). The first build's audit rounds are in the main model's write-up.

Rebuild (2026-11-04): the information, helpline and support work, about five sixths of this model's spending then, had been valued at the median of two other charities' models (Breast Cancer Now, Action for Happiness). It is now built from trials of patient education and telephone support for heart disease, with BHF's own reach. Every branch now takes the missing-data discount. The implementation pilots moved to the main model. The result fell from 0.05 to 0.005.

Independent audit, round 1 (2 high, 6 medium, 8 low). What changed:
- **Effect over time:** the trials' effect is now taken over their own follow-up (1.5 years), since the dose rows already shrink a single contact. It had counted the small dose twice.
- **Deaths by age:** heart patients' deaths now take the ages of UK cardiovascular deaths from GBD 2023 (new shared facts), with the five-year values above 70. This lowers the value per death from 33 to 21.
- **Readers:** only UK views (65%, from Similarweb's traffic estimate) and only patients (22%) count. Carers are a named unmodelled benefit.
- **Counterfactual:** usual care is already in the trials' control arms, so only other sources count against BHF (55% kept).
- **Spending:** the unitemised £6.9m of other health grants is named, and the pilots' share has a wider range, in both models.
- **Anchors and sources:** the reading dose is anchored on the ISLAND mail-out trial, the quality-of-life conversion is labelled a judgment, the CPR survival range uses the adjusted interval, and the Resuscitation Council figures are quoted as the page gives them.
- **Smaller fixes:** the canonical implementation and wait rows are now branch averages, labels are fixed, and the staff share covers the full cost.
- The fixes roughly cancelled: 0.0050 before, 0.0053 after.

Independent audit, round 2: no high findings, 1 medium, 10 low. What changed:
- **Readers:** pages per reader and the UK share of views are now anchored on Similarweb's traffic estimate for bhf.org.uk (2.26 pages a visit, 62% of desktop traffic from the UK). The UK share fell to 65%, and the result to 0.0048.
- **Left as they are:** helpline and peer users are all counted as patients, print readers share the web's patient share, and cardiac-arrest survivors keep the 50–74 weight. Each moves the result by 6% or less, and several offset each other. The over-80 share of UK cardiovascular deaths and the quality-of-life conversion stay labelled judgments.

### Sources

- [BHF Annual Report and Accounts 2025-26](https://www.bhf.org.uk/what-we-do/-/media/files/annual_report_and_accounts_2025-26.pdf) (p. 29-32, 109, 125, 136)
- [Anderson et al. 2017, Patient education in the management of coronary heart disease (Cochrane; abstract via Europe PMC)](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:28658719&format=json&resultType=core)
- [Inglis et al. 2015, Structured telephone support or telemonitoring for heart failure (Cochrane; abstract via Europe PMC)](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:26517969&format=json&resultType=core)
- [Ivers et al. 2020, ISLAND trial (BMJ; abstract via Europe PMC)](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:32522811&format=json&resultType=core)
- [IHME, Global Burden of Disease 2023: cardiovascular deaths by age, via Our World in Data](https://ourworldindata.org/grapher/cardiovascular-disease-deaths-by-age)
- [Ellis et al. 2025, Secondary prevention education initiated in hospital for coronary heart disease (abstract via Europe PMC)](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:41206592&format=json&resultType=core)
- [Resuscitation Council UK, epidemiology of cardiac arrest (2025 guidelines)](https://www.resus.org.uk/library/2025-resuscitation-guidelines/epidemiology-cardiac-arrest-guidelines)
- Hasselqvist-Ax et al., NEJM 2015; Pollack et al., Circulation 2018 (abstracts via Europe PMC)
