// Where each model's beneficiaries are, for the reader's distance weight ($home_country,
// $distance_discount; docs/normalization.md 2.13): fills `beneficiaries` and `beneficiaries_note` on every
// model with a result in common units, from data the models already carry, in this order:
//   1. our own builds and the charities that move money: set below (OURS), from the build's stated
//      countries and the shares of its result by branch;
//   2. climate, and research with global reach: "world" (spread by world population);
//   3. a variant's location (its name's parenthesis: "Against Malaria Foundation (Chad)");
//   4. the charity record's location entries (charities/*.json `locations`: the family's own model);
//   5. the model's name naming countries ("... Zambia and Cameroon");
//   6. an evaluator's sheet: the location columns the bottom line reads (row labels "(Burkina Faso)",
//      "Kenya, Both, <5 years, ...");
//   7. the country facts files its rows read on the way to the bottom line (@kenya.*, @givewell_chad.*);
//   8. the model's summary naming countries;
//   9. where nothing says: the charity's main country of operation from its record (a judgment, listed).
// Several countries from one source share equally. A variant that names no other country inherits its
// parent's. A charity's figure over its programmes and locations needs nothing here: each model's
// headline carries its own weight, so the combination follows from the parts.
//   npx tsx scripts/beneficiary-countries.ts           write the fields, print counts by method
//   npx tsx scripts/beneficiary-countries.ts --check   exit 1 if any model's field would change
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary, comparable, type ResolvedModel } from "../src/engine/model";
import { COUNTRIES } from "../src/engine/countries";

const root = join(import.meta.dirname, "..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const check = process.argv.includes("--check");

type Beneficiaries = Record<string, number> | "world" | "destinations";
type Decision = { b: Beneficiaries; method: string; note: string } | { inherit: true; method: string };

// --- Our own builds and the charities that move money --------------------------------------------------
// Shares of the result by branch, at the default values, where a build's branches are in different places.
const OURS: Record<string, { b: Beneficiaries; note: string }> = {
  "americares-charityevals": { b: { USA: 0.1735, COL: 0.1775, SLV: 0.1775, IND: 0.1775, HTI: 0.0735, LBR: 0.0735, MWI: 0.0735, PHL: 0.0735 }, note: "Our build: shares of the result by branch at the defaults (clinics 41%, medicine donations to clinics 29%, health-worker training 28%, the US patient-assistance programme 1%); clinics split equally over Colombia, El Salvador, India and the US, donations 20% US (restricted gifts' split, statements note 7) and the rest, with the training, equally over the seven programme countries named in the annual report (Colombia, El Salvador, India, Haiti, Liberia, Malawi, the Philippines): a judgment, as Americares publishes no country split." },
  "americares-charityevals-emergency": { b: { USA: 0.35, LBN: 0.2275, UKR: 0.1479, MMR: 0.2746 }, note: "Our build: emergency responses weighted by the build's own judged shares (US disasters 35%, the Middle East 23%, Ukraine 15%, Asia and Africa 27%), each valued at a stand-in country." },
  "american-red-cross-charityevals": { b: { USA: 1 }, note: "Our build: US disaster relief, home fire safety and services to military families." },
  "american-red-cross-charityevals-biomedical": { b: { USA: 1 }, note: "Our build: the US blood supply and US training courses." },
  "american-red-cross-charityevals-international": { b: { LBN: 0.16, UKR: 0.16, MOZ: 0.51, BGD: 0.07, MMR: 0.09, BRA: 0.01 }, note: "Our build: disaster-response grants to Red Cross and Red Crescent societies, weighted by region from the Form 990's Schedule F (Middle East 45%, Europe 25%, Sub-Saharan Africa 15%, South Asia 7%, East Asia 5%, the Americas 3.5%), each region valued at a stand-in country (Lebanon, Ukraine, Mozambique, Bangladesh, Myanmar, Brazil): shares of the result at the defaults (the poorest, Mozambique, 51%)." },
  "american-cancer-society-charityevals": { b: { world: 0.28, USA: 0.72 }, note: "Our build: research valued as a share of the world's cancer burden (28% of the result at the defaults, spread by world population), ACS CAN's US policy wins and US screening promotion (72%)." },
  "american-cancer-society-charityevals-support": { b: { USA: 1 }, note: "Our build: Hope Lodge lodging, Road To Recovery rides and the helpline and information for patients in the US." },
  "british-heart-foundation-charityevals": { b: { world: 0.87, GBR: 0.13 }, note: "Our build: research valued as a share of the world's cardiovascular burden (87% of the result at the defaults, spread by world population), UK tobacco policy and NHS implementation pilots (13%)." },
  "british-heart-foundation-charityevals-health": { b: { GBR: 1 }, note: "Our build: health information, the Heart Helpline, peer support, CPR training and the defibrillator network in the UK." },
  "campaign-for-tobacco-free-kids-charityevals": { b: { IND: 0.3003, IDN: 0.118, BGD: 0.0563, BRA: 0.0523, PAK: 0.0458, VNM: 0.0389, PHL: 0.036, TUR: 0.0334, UKR: 0.0269, MEX: 0.017, USA: 0.0919, world: 0.1832 }, note: "Our build: shares of the result at the defaults. Tobacco wins in the ten priority countries (72%), split by their smoking DALYs (GBD 2023); US tobacco wins (9%); the Global Health Advocacy Incubator's food, injury and health-system wins in 38 countries (18%), spread by world population." },
  "cancer-research-uk-charityevals": { b: { world: 0.57, GBR: 0.43 }, note: "Our build: research valued as a share of the world's cancer burden (57% of the result at the defaults, spread by world population), UK tobacco policy and UK cancer information and awareness (43%)." },
  "doctors-without-borders-charityevals": { b: { COD: 0.147336, SDN: 0.141066, PSE: 0.126437, SSD: 0.118077, NGA: 0.094044, YEM: 0.092999, TCD: 0.075235, CAF: 0.071055, AFG: 0.07001, NER: 0.063741 }, note: "Our build: medical care in about 70 countries, weighted by programme spending in MSF's ten largest countries (Financial Report 2025, p. 10: the DRC 141, Sudan 135, Palestine 121, South Sudan 113, Nigeria 90, Yemen 89, Chad 72, the Central African Republic 68, Afghanistan 67 and Niger 61 million euros, 957 million of 1,580), the other 60 countries taken as like them (a judgment)." },
  "doctors-without-borders-charityevals-relief": { b: { COD: 0.4489, SDN: 0.2993, SSD: 0.2494, BGD: 0.0024 }, note: "Our build: relief distributions to displaced families (99.8% of the result) in the DRC, Sudan and South Sudan by the build's own country shares (45%, 30%, 25%; a judgment); search and rescue at sea (0.2%), people crossing from Libya, Bangladesh the largest nationality among them (a judgment)." },
  "doctors-without-borders-charityevals-advocacy": { b: { IND: 0.308, IDN: 0.1155, PHL: 0.077, PAK: 0.077, NGA: 0.08285, BGD: 0.0539, ZAF: 0.0385, COD: 0.08975, TCD: 0.02125, SDN: 0.03625, SSD: 0.02125, NER: 0.02125, AFG: 0.02125, SOM: 0.02125, KEN: 0.015 }, note: "Our build: MSF Access's TB price cuts (77% of the result) spread over the high-burden countries that buy the tests and drugs (India, Indonesia, the Philippines, Pakistan, Nigeria, Bangladesh, South Africa, the DRC; our weights by TB burden); awareness-raising (17%) over the crisis countries of MSF's medical model, equally; DNDi (6%) over the DRC, Sudan and Kenya (sleeping sickness and leishmaniasis). A judgment." },
  "american-red-cross-charityevals-measles": { b: { KEN: 0.25, NGA: 0.25, MWI: 0.25, MOZ: 0.25 }, note: "Our build: household visits before measles-rubella campaigns through the Measles & Rubella Partnership; the Red Cross publishes no list of the year's countries, so the partnership countries where its volunteers' visits are documented (Kenya, Nigeria, Malawi, Mozambique) share equally (a judgment)." },
  "habitat-for-humanity-charityevals": { b: { USA: 1 }, note: "Our build: HFHI's US affiliates." },
  "team-rubicon-charityevals": { b: { USA: 1 }, note: "Our build: US disaster response, volunteer training and home rebuilding." },
  "hias-charityevals": { b: { USA: 1 }, note: "Our build: refugees, asylum seekers and other immigrants served in the US (resettlement and legal services)." },
  "hias-charityevals-international": { b: { TCD: 0.4, KEN: 0.05, COL: 0.16, ECU: 0.12, PAN: 0.05, MEX: 0.03, VEN: 0.03, CRI: 0.02, UKR: 0.06, MDA: 0.02, ISR: 0.02, GRC: 0.02, AUT: 0.02 }, note: "Our build: HIAS's country programmes weighted by our judgment of where the spending and the result go, as HIAS publishes no spending by country: Chad (257,700 served, many through cheap camp-wide services, and most of the cash), then Colombia, Ecuador and Panama (36,700, about 21,000 and 23,000 served, with more cash per person and the legal work), Ukraine and Moldova (32,300), Costa Rica, Mexico, Venezuela, Kenya, Israel, Greece and the Resettlement Support Center in Austria (Form 990 Schedule O)." },
  "hias-charityevals-advocacy": { b: { AFG: 0.2, COD: 0.2, MMR: 0.1, SYR: 0.1, SDN: 0.1, GTM: 0.1, VEN: 0.1, SOM: 0.1 }, note: "Our build: refugees waiting abroad for US resettlement, by the largest nationalities in the pipeline (the DRC, Afghanistan, Venezuela, Syria, Myanmar, Sudan, Somalia, Guatemala); a judgment." },
  "all-hands-and-hearts-charityevals": { b: { USA: 1 }, note: "Our build: US disaster response (muck and gut, mould sanitation, smoke remediation) and home repairs." },
  "all-hands-and-hearts-charityevals-international": { b: { MMR: 0.78, NPL: 0.12, PHL: 0.08, MEX: 0.02 }, note: "Our build: the Myanmar earthquake response and school rebuilds in Nepal, the Philippines and Mexico: shares of the result at the defaults." },
  "st-jude-charityevals": { b: { world: 0.89, USA: 0.11 }, note: "Our build: St. Jude Global's partner hospitals in more than 70 countries and the graduate school's research (89% of the result at the defaults, spread by world population: a judgment, the build names no split), and patient care, clinical training and community programmes in the US (11%)." },
  "st-jude-charityevals-research": { b: "world", note: "Our build: research valued as a share of the world's childhood cancer, sickle cell and children's influenza burden." },
  "habitat-for-humanity-charityevals-international": { b: { HND: 0.0347, DOM: 0.0347, PER: 0.0346, ARM: 0.0288, MKD: 0.0288, ROU: 0.0287, EGY: 0.0287, KEN: 0.129, UGA: 0.129, MWI: 0.129, ZMB: 0.129, PHL: 0.1325, BGD: 0.1325 }, note: "Our build: Habitat's work in more than 60 countries, by region at the shares of the result at the defaults (Africa 52%, Asia and the Pacific 26%, Europe and the Middle East 12%, Latin America and the Caribbean 10%), each region's share spread equally over the stand-in countries whose survey consumption the build reads (a judgment)." },
  "habitat-for-humanity-charityevals-awareness": { b: { USA: 0.02, HND: 0.0116, DOM: 0.0282, PER: 0.0314, ARM: 0.0494, MKD: 0.0245, ROU: 0.0123, EGY: 0.0993, KEN: 0.1268, UGA: 0.063, MWI: 0.1408, ZMB: 0.1528, PHL: 0.0995, BGD: 0.1404 }, note: "Our build: the global Home Equals campaign (98% of the result at the defaults), valued country by country over the 13 stand-in countries of the international build, each region a quarter of the people (Home Equals publishes no split, a judgment), so the shares follow each country's net value per person; US housing advocacy 2%." },
  "world-central-kitchen-charityevals": { b: { PSE: 0.7171, HTI: 0.1125, UKR: 0.0891, MMR: 0.0556, JAM: 0.0213, USA: 0.0044 }, note: "Our build: shares of the result at the defaults by branch (Gaza 72%, crises in poorer countries 28%, rich-country disasters under 1%), the poorer-country branch split by its places' spending weights from the Form 990's Schedule F times their log gains (Haiti, Jamaica, Ukraine standing in for the middle-income places, Myanmar for East Asia); the rich-country branch at the US." },
  "world-vision-charityevals": { b: {ETH: 0.044678, KEN: 0.044678, SOM: 0.044678, SSD: 0.044678, SDN: 0.044678, COD: 0.044678, UGA: 0.044678, MWI: 0.044678, ZMB: 0.044678, TZA: 0.044678, RWA: 0.044678, MOZ: 0.044678, NER: 0.044678, MLI: 0.044678, ZWE: 0.044678, BDI: 0.044678, HTI: 0.018048, HND: 0.018048, GTM: 0.018048, SLV: 0.018048, NIC: 0.018048, DOM: 0.018048, PER: 0.008532, BOL: 0.008532, COL: 0.008532, VEN: 0.008532, ECU: 0.008532, BRA: 0.008532, IND: 0.007596, BGD: 0.007596, AFG: 0.007596, LKA: 0.007596, NPL: 0.007596, PHL: 0.005312, MMR: 0.005312, KHM: 0.005312, IDN: 0.005312, VNM: 0.005312, PNG: 0.005312, LBN: 0.006104, SYR: 0.006104, JOR: 0.006104, IRQ: 0.006104, PSE: 0.006104, UKR: 0.005577, ARM: 0.005577, GEO: 0.005577, MEX: 0.00568, ROU: 0.000963, ALB: 0.000963, BIH: 0.000963}, note: "Our build: World Vision US's spending abroad by region from its Form 990 Schedule F (Sub-Saharan Africa 71%, Central America and the Caribbean 11%, South America 5%, South Asia 4%, East Asia and the Pacific 3%, the Middle East 3%, the former Soviet states 2%), each region split equally over World Vision's main programme countries there (a judgment: no country split is published); the advocacy branch aims at the same people." },
  "care-charityevals": { b: {ETH: 0.037982, SDN: 0.037981, SSD: 0.037981, SOM: 0.037981, NGA: 0.037981, NER: 0.037981, MLI: 0.037981, TCD: 0.037981, COD: 0.037981, UGA: 0.037981, KEN: 0.037981, MWI: 0.037981, MOZ: 0.037981, ZWE: 0.037981, MDG: 0.037981, TZA: 0.037981, YEM: 0.028104, SYR: 0.028104, PSE: 0.028104, LBN: 0.028104, JOR: 0.028104, IRQ: 0.028104, AFG: 0.02082, BGD: 0.02082, NPL: 0.02082, IND: 0.02082, PAK: 0.02082, MMR: 0.006361, PHL: 0.006361, KHM: 0.006361, LAO: 0.006361, VNM: 0.006361, IDN: 0.006361, TLS: 0.006361, TUR: 0.017694, UKR: 0.017694, HTI: 0.007116, GTM: 0.007116, HND: 0.007116, SLV: 0.007116, PER: 0.002296, ECU: 0.002296, COL: 0.002296, VEN: 0.002296, GEO: 0.001008, ARM: 0.001008}, note: "Our build: CARE USA's spending abroad by region from its Form 990 Schedule F Part I (Sub-Saharan Africa 61%, the Middle East and North Africa 17%, South Asia 10%, East Asia and the Pacific 4%, Europe 4% (Turkey and Ukraine), Central America and the Caribbean 3%, South America 1%), each region split equally over CARE's main programme countries there (a judgment: no country split is published); public information aims at the same people." },
  "world-vision-charityevals-domestic": { b: { USA: 1 }, note: "Our build: donated goods passed to US churches, schools and nonprofits." },
  "mercy-corps-charityevals": { b: {SDN: 0.043323, SOM: 0.043323, NGA: 0.043323, ETH: 0.043323, KEN: 0.043323, UGA: 0.043323, COD: 0.043323, SSD: 0.043323, NER: 0.043323, MLI: 0.043323, CAF: 0.043323, BFA: 0.043323, IDN: 0.014541, MMR: 0.014541, TLS: 0.014541, AFG: 0.024783, NPL: 0.024783, PSE: 0.025178, SYR: 0.025178, YEM: 0.025178, IRQ: 0.025178, LBN: 0.025178, JOR: 0.025178, UKR: 0.028127, GEO: 0.028127, KGZ: 0.028127, TJK: 0.028127, HTI: 0.014558, GTM: 0.014558, COL: 0.04712, VEN: 0.047123}, note: "Our build: Mercy Corps' programme spending and grants by region from its US entity's Form 990 Schedule F, fiscal 2025 (Sub-Saharan Africa 52%, the Middle East and North Africa 15%, Russia and neighbouring states 11%, South America 9%, South Asia 5%, East Asia and the Pacific 4%, Central America and the Caribbean 3%), each region split equally over Mercy Corps' main programme countries there (a judgment: no country split is published)." },
  "samaritans-purse-charityevals": { b: { USA: 0.160249, SSD: 0.046491, SDN: 0.046491, COD: 0.046491, KEN: 0.046491, ETH: 0.046491, UGA: 0.046491, MOZ: 0.046491, NGA: 0.046491, PSE: 0.030413, LBN: 0.030413, SYR: 0.030413, IRQ: 0.030413, UKR: 0.05946, PER: 0.015248, BOL: 0.015248, ECU: 0.015248, COL: 0.015248, VEN: 0.015248, BRA: 0.015248, HTI: 0.011859, JAM: 0.011859, HND: 0.011859, GTM: 0.011859, NIC: 0.011859, DOM: 0.011859, MMR: 0.014778, PHL: 0.014778, KHM: 0.014778, PNG: 0.014778, IDN: 0.014778, IND: 0.004223, NPL: 0.004223, BGD: 0.004223, MEX: 0.03751 }, note: "Our build: the US disaster work's share of programme spending (16%, Form 990 Part III 4b over the consolidated ministry expenses), the rest by Samaritan's Purse's 2025 spending abroad by region (Form 990 Schedule F: Sub-Saharan Africa 44%, the Middle East 14%, South America 11%, East Asia 9%, Central America and the Caribbean 8%, Ukraine 7%, Mexico 4%, South Asia 2%), each region split equally over its main programme countries (a judgment: no country split is published)." },
  "united-way-charityevals": { b: { USA: 1 }, note: "Our build: the US United Way network." },
  "the-nature-conservancy-charityevals": { b: { world: 0.4129, IND: 0.48, MEX: 0.041, USA: 0.0167, SYC: 0.0135, MHL: 0.0135, ECU: 0.0173, BHS: 0.0051 }, note: "Our build: by share of the result at the defaults. PRANA's crop-burning deaths in northwest India (48%); forest and land carbon, power displaced and pandemic risk, spread by world population (41%); adaptation's coastal people in Mexico and Hawai'i (6%, split by judgment); the fisheries rules' fishers in the Seychelles and the Pacific islands (3%, split by judgment); the year's deals' local incomes in Ecuador and The Bahamas (2%, by their people)." },
  "the-humane-league-charityevals-corporate-campaigns": { b: { USA: 0.55, world: 0.45 }, note: "Our build: hens out of cages at companies THL pressed itself, 55% US by ACE's hens in the supply chains of the companies its US and global accountability programmes engaged (135 and 114 million); the rest spread by world population. A judgment." },
  "the-humane-league-charityevals-other-programmes": { b: { world: 0.73, USA: 0.27 }, note: "Our build: animals, by share of the result at the defaults. New corporate commitments 'around the world' (48%) and the Open Wing Alliance's wins abroad (8%) spread by world population; grassroots pressure on switches at companies THL pressed itself (38%), 55% US by ACE's hens in the engaged US and global supply chains (135 and 114 million); state-law defence and the Animal Policy Alliance in the US (6%). A judgment." },
  "feeding-america-charityevals": { b: { USA: 1 }, note: "Our build: Feeding America's food network and SNAP help in the US." },
  "feeding-america-charityevals-advocacy": { b: { USA: 1 }, note: "Our build: Feeding America's US food policy advocacy, research and awareness." },
  "make-a-wish-charityevals": { b: { USA: 1 }, note: "Our build: wishes granted by Make-A-Wish America's national office and 58 chapters to children in the US and its territories." },
  "macmillan-cancer-support-charityevals": { b: { GBR: 1 }, note: "Our build: Macmillan works only in the UK." },
  "refugee-council-charityevals": { b: { GBR: 1 }, note: "Our build: refugees and people seeking asylum in England, helped where they live now." },
  "refugee-council-charityevals-therapy": { b: { GBR: 1 }, note: "Our build: refugees and people seeking asylum in England, helped where they live now." },
  "refugee-council-charityevals-advocacy": { b: { GBR: 1 }, note: "Our build: UK asylum and refugee policy, for people in the UK asylum system." },
  "salvation-army-charityevals": { b: { USA: 1 }, note: "Our build: the Salvation Army's services in the US (its overseas work has its own model)." },
  "wounded-warrior-project-charityevals": { b: { USA: 1 }, note: "Our build: Wounded Warrior Project's programmes for post-9/11 veterans in the US (mental health has its own model)." },
  "wounded-warrior-project-charityevals-mental-health": { b: { USA: 1 }, note: "Our build: Wounded Warrior Project's mental health programmes for US veterans." },
  "salvation-army-charityevals-international": { b: {IND: 0.056222, PAK: 0.042916, KEN: 0.042766, COG: 0.033992, BRA: 0.028739, COD: 0.026937, PHL: 0.023513, MEX: 0.022432, MDA: 0.022063, UKR: 0.022063, GEO: 0.022063, JAM: 0.021966, HTI: 0.021966, ZMB: 0.020539, PNG: 0.019909, MOZ: 0.019098, ZWE: 0.017446, BWA: 0.017446, BGD: 0.017235, RWA: 0.017111, LKA: 0.016755, PRY: 0.016455, TZA: 0.015884, UGA: 0.015854, GHA: 0.015373, NGA: 0.015193, MWI: 0.014983, AGO: 0.014502, GTM: 0.014317, CRI: 0.014317, SLV: 0.014317, NIC: 0.014317, PER: 0.014014, BOL: 0.014014, BDI: 0.013841, ZAF: 0.013721, LBR: 0.013221, MLI: 0.012925, MMR: 0.012655, THA: 0.012655, MDG: 0.011138, KHM: 0.011138, IDN: 0.011138, NPL: 0.011138, VEN: 0.011138, ROU: 0.010925, ESP: 0.010528, PRT: 0.010528, SLB: 0.008771, ARE: 0.0082, DNK: 0.006488, ITA: 0.005857, GRC: 0.005857, ARG: 0.005316, URY: 0.005316, NLD: 0.004776, CZE: 0.004776, SVK: 0.004776, FIN: 0.003394, EST: 0.003394, DEU: 0.003354, LTU: 0.003354, POL: 0.003354, HND: 0.003179, PAN: 0.003179, CHL: 0.002876, ECU: 0.002876, TWN: 0.002763, SWE: 0.002103, LVA: 0.002103, SLE: 0.002083, GIN: 0.002083, BFA: 0.001787, BGR: 0.001546, SGP: 0.001517, MYS: 0.001516}, note: "Our build: shares of the result by branch at the defaults. The operating support (schools, health care, social services and church life in the territories that can't pay their own way, 48%) follows International Headquarters' maintenance grants by territory (International Trust accounts 2025, Note 11), split equally over each territory's countries; SAWSO's livelihoods and anti-trafficking work (50%) is spread equally over the low- and middle-income countries its report lists; relief goes to Ukraine and the countries hosting its refugees, education projects to Rwanda and the Republic of the Congo (judgments where no split is published)." },
  "the-humane-league-charityevals-owa-grants": { b: { GBR: 0.865, USA: 0.014, GHA: 0.036, BRA: 0.032, POL: 0.030, IDN: 0.011, EGY: 0.007, IND: 0.005 }, note: "Our build: by share of the result (chicken pain days) at the defaults: the grant to THL UK (UK commitments, switches, the cage ban and the breed case, 86%), the US policy grants (1%), and the Open Wing Alliance grants abroad (12%) split by Schedule F's grant regions (Sub-Saharan Africa 30%, South America 26%, Europe outside the UK 25%, East Asia 9%, Middle East and North Africa 6%, South Asia 4%), each region at a stand-in country (Ghana, Brazil, Poland, Indonesia, Egypt, India; the review names wins in Ghana and Indonesia, the 990 in Poland)." },
  "dogs-trust-charityevals": { b: { GBR: 0.845, IND: 0.05, THA: 0.04, LKA: 0.015, MWI: 0.015, BIH: 0.015, KHM: 0.015, BGR: 0.005 }, note: "Our build: by share of the result at the defaults. people in the UK (behaviour-line owners, Freedom's survivors and their children, homeless owners: about 84%) and UK and Irish dogs (under 1%); fewer dog bites and overseas treatment, neutering and training (about 15%) spread over WVS's and the grantees' main countries by grant size (a judgment)." },
  "boys-girls-clubs-of-america-charityevals": { b: { USA: 1 }, note: "Our build: Club members and their families in the US (the youth centres on US military installations abroad serve US service families)." },
  "direct-relief-charityevals": { b: { UKR: 0.33, PSE: 0.08, SYR: 0.02, LBN: 0.02, SDN: 0.015, HTI: 0.01, MEX: 0.12, GTM: 0.05, HND: 0.05, UGA: 0.05, NGA: 0.05, KEN: 0.05, IND: 0.05, PHL: 0.05, MWI: 0.03, SLE: 0.025 }, note: "Our build: international material aid by value (Ukraine $535m and the Middle East $193m of $1,633m, Sudan $23m, Haiti $12m: annual report FY2025 pp. 25-26, 43); the rest, about half, spread over Direct Relief's partners in Latin America, Africa and Asia (a judgment, its own reports name no split): the shares are of aid, a stand-in for the shares of the result." },
  "direct-relief-charityevals-us": { b: { USA: 1 }, note: "Our build: medicines and grants for US safety-net clinics and disaster recovery, all in the United States and its territories." },
  "refugees-international-charityevals": { b: { HTI: 0.42, SDN: 0.2, TCD: 0.03, CRI: 0.05, UKR: 0.08, PSE: 0.08, USA: 0.1, UGA: 0.04 }, note: "Our build: shares of the result by branch at the defaults. Haitians paroled into the US (about 42%, counted as Haiti's), Sudan's humanitarian response and access from Chad (about 23%), asylum seekers' work permits in Costa Rica (about 5%); the other campaigns (about 30%) over Ukraine, Gaza, the US and Uganda by the annual report's emphasis (a judgment)." },
  "cool-earth-charityevals": { b: { PER: 0.758, PNG: 0.157, CMR: 0.058, world: 0.027 }, note: "Our build: by share of the result at the defaults. The cash's value to the communities (97%) split by note 8's programme spending (Peru 76%, Papua New Guinea 16%, Cameroon 6%; the small grant to Go Conscious Earth spread pro rata); the forest's carbon and pandemic risk (3%) spread by world population." },
  "rainforest-foundation-us-charityevals": { b: { world: 0.7005, PER: 0.2179, GUY: 0.0568, BRA: 0.0194, PAN: 0.0054 }, note: "Our build: by share of the result at the defaults. The forest’s pandemic risk and carbon (70%) spread by world population; the patrollers’ pay to their households (30%) by where the patrollers are: Peru 291 of 400 (the 2025 report), the rest over Guyana, Brazil and Panama by the acres patrolled there." },
  "dogs-trust-charityevals-rabies": { b: { IND: 0.5, MWI: 0.25, KHM: 0.1, BGD: 0.05, GIN: 0.05, TLS: 0.04, LAO: 0.01 }, note: "Our build: WVS and Mission Rabies' dog vaccination by 2025 doses: India over half and Cambodia 221,391 (Mission Rabies' 2025 review), Laos 21,500; the rest over Malawi and the grant countries by grant size (a judgment)." },
  "shelterbox-charityevals": { b: { SYR: 0.1523, YEM: 0.1516, TCD: 0.1125, SOM: 0.1006, AFG: 0.0734, BFA: 0.057, PSE: 0.0448, CMR: 0.078, ETH: 0.0397, PHL: 0.113, MMR: 0.0431, PAK: 0.0178, BGD: 0.0113, JAM: 0.0049 }, note: "Our build: by share of the result at the defaults, the poorest conflict and displacement settings (Mozambique stand-in: Syria, Yemen, Chad, Somalia, Afghanistan, Burkina Faso, Gaza) about 69% and the rest (Bangladesh stand-in: Cameroon, Ethiopia, the Philippines, Myanmar, Pakistan, Bangladesh, Jamaica) 31%, each spread over its countries by 2025 grants to partners (note 5 of the accounts; Ukraine and Malawi, under 0.2%, left out)." },
  "international-refugee-assistance-project-charityevals": { b: { JOR: 0.15, LBN: 0.15, AFG: 0.12, KEN: 0.07, USA: 0.07, PAK: 0.04, HND: 0.16, GTM: 0.14, SLV: 0.1 }, note: "Our build: where IRAP's clients wait for a pathway (a judgment, as IRAP publishes no split): Central American families seeking reunification 40% (the model's wh_client_share), and its Jordan and Lebanon offices' refugees, US-affiliated Afghans in Afghanistan and Pakistan, refugees in Kenya referred by partners, and asylum seekers and status cases in the US, the other 60%." },
  "prison-policy-initiative-charityevals": { b: { USA: 1 }, note: "Our build: incarcerated people and their families in the United States (federal phone caps, state free-call laws, decarceration)." },
  "innocence-project-charityevals": { b: { USA: 1 }, note: "Our build: wrongly convicted people in US prisons and their families (exonerations, reforms that prevent wrongful convictions, compensation)." },
  "the-bail-project-charityevals": { b: { USA: 1 }, note: "Our build: people bailed out or supported pretrial at The Bail Project's US sites, and their families." },
  "the-bail-project-charityevals-advocacy": { b: { USA: 1 }, note: "Our build: people kept out of pretrial detention by the US state campaigns (Texas, Florida, Oklahoma and others)." },
  "international-refugee-assistance-project-charityevals-advocacy": { b: { AFG: 0.383, IRQ: 0.027, COD: 0.205, VEN: 0.14, SYR: 0.105, MMR: 0.07, GTM: 0.07 }, note: "Our build: by share of the result at the defaults: the SIV plan (about 27%: Afghans 90%, Iraqis 10%), the US refugee programme's rebuild (about 70%, spread over the largest nationalities of fiscal year 2024 admissions: the DR Congo, Afghanistan, Venezuela, Syria, Burma, Guatemala, a judgment) and the Pacito refugees (3%, Congolese like the lead plaintiff)." },
  "transparency-international-charityevals": { b: { DEU: 0.1281, FRA: 0.1051, ITA: 0.0906, ESP: 0.0747, POL: 0.0562, ROU: 0.0293, NLD: 0.0275, BEL: 0.0181, CZE: 0.0167, SWE: 0.0163, GRC: 0.016, PRT: 0.0163, HUN: 0.0147, AUT: 0.0141, BGR: 0.0098, DNK: 0.0092, FIN: 0.0086, SVK: 0.0083, IRL: 0.0081, HRV: 0.006, LTU: 0.0045, SVN: 0.0032, LVA: 0.0029, EST: 0.0022, CYP: 0.0014, LUX: 0.0011, MLT: 0.0009, world: 0.3101 }, note: "Our build: shares of the result at the defaults: the EU part of the policy branch (about 64%: EU-wide rules, valued at the EU's own cost of corruption) and the legal submissions, mostly in Europe (about 5%), spread over the 27 member states by population (2024, rounded); the rest of the policy changes and the advice centres in 53 countries (about 31%) by world population, as no country list is published (a judgment)." },
  "protect-democracy-charityevals": { b: { USA: 1 }, note: "Our build: the US's people, whose government the work defends; the spillover abroad (a side-effect share of the US value) isn't assigned to countries." },
  "league-of-women-voters-education-fund-charityevals": { b: { USA: 1 }, note: "Our build: the US's people, whose government the work defends and reforms (the redistricting branch's people are in the US states that adopted commissions); the spillover abroad (a side-effect share of the US value) isn't assigned to countries." },
  "common-cause-education-fund-charityevals": { b: { USA: 1 }, note: "Our build: the US's people, whose government the work defends and reforms (the redistricting branch's people are in the US states that adopted commissions); the spillover abroad (a side-effect share of the US value) isn't assigned to countries." },
  "campaign-legal-center-charityevals": { b: { USA: 1 }, note: "Our build: the US's people, whose government the work defends and reforms; the spillover abroad (a side-effect share of the US value) isn't assigned to countries." },
  "fairvote-charityevals": { b: { USA: 1 }, note: "Our build: the people in the US places that adopt ranked-choice voting or proportional representation." },
  "representus-education-fund-charityevals": { b: { USA: 1 }, note: "Our build: the US's people, whose government the work defends and reforms (the reform branches' people are in the US places that adopted ranked-choice voting or redistricting commissions); the spillover abroad (a side-effect share of the US value) isn't assigned to countries." },
  "electoral-reform-society-charityevals": { b: { GBR: 1 }, note: "Our build: the UK's people, whose elections and Parliament the reforms change." },
  "kids-in-need-of-defense-charityevals-advocacy": { b: { USA: 1 }, note: "Our build: the J.O.P. class members and the D.C. youths are in the US." },
  "center-for-global-development-charityevals": { b: { IND: 0.1494, NGA: 0.1407, PAK: 0.0825, ETH: 0.0722, COD: 0.0722, BGD: 0.06, KEN: 0.0497, TZA: 0.0487, UGA: 0.0412, MOZ: 0.0384, GHA: 0.0384, MDG: 0.0309, NER: 0.0309, AFG: 0.0268, IDN: 0.0255, TUR: 0.017, EGY: 0.017, BRA: 0.017, PHL: 0.017, UKR: 0.017, SEN: 0.0075 }, note: "Our build: shares of the result at the defaults by branch: the pneumococcal AMC 80% (children in the 60 Gavi countries that introduced PCV, weighted roughly by births: India, Nigeria, Pakistan, Ethiopia, DR Congo, Bangladesh, then smaller East and West African countries and Afghanistan), the development banks' extra lending 17% (their largest borrowers: India, Indonesia, Turkey, Egypt, Brazil, the Philippines, Ukraine, Nigeria, Kenya, Bangladesh), MCC 3% (its African compact countries). A judgment: no country split of the credited value is published." },
  "tax-justice-network-charityevals": { b: { IND: 0.0911, NGA: 0.065, KEN: 0.065, GHA: 0.065, UGA: 0.065, ETH: 0.065, ZMB: 0.065, TZA: 0.065, RWA: 0.065, BEN: 0.065, PAK: 0.065, BGD: 0.065, PHL: 0.065, BRA: 0.035, MEX: 0.035, COL: 0.015, ZAF: 0.0137, GBR: 0.0302 }, note: "Our build: shares of the result at the defaults by income group: revenue in low and lower-middle income countries other than India 78% (equally over the nine African countries whose tax authorities the network works with in its 2025 report, Nigeria, Kenya, Ghana, Uganda, Ethiopia, Zambia, Tanzania, Rwanda and Benin, and Pakistan, Bangladesh and the Philippines), India 9% (valued at GiveWell's lower figure for its government), upper-middle income 10% (Brazil, Mexico, Colombia, South Africa), high income 3% (the UK as a stand-in). A judgment: no country split of the revenue or losses is published." },
  "fair-tax-foundation-charityevals": { b: { GBR: 0.33, ESP: 0.13, DNK: 0.03, FIN: 0.03, SWE: 0.02, NLD: 0.02, BRA: 0.25, MEX: 0.19 }, note: "Our build: shares of the result at the defaults by where the tax is paid: high-income countries 56% (the UK 33%, Spain 13%, Denmark, Finland, Sweden and the Netherlands 10%, where the certified and indexed firms are based), upper-middle income countries 44% (Brazil and Mexico, where Iberdrola, Repsol and other multinationals pay part of their tax; revenue there counts about seven times as much per dollar). A judgment: the society publishes no country split of the tax." },
  "brennan-center-for-justice-charityevals": { b: { USA: 0.52, CHN: 0.48 }, note: "Our build: by share of the result at the defaults: the tariff ruling's gain abroad (about 48%, China's, net of small losses elsewhere) and the rest in the United States (the tariff ruling at home, democracy, prisons and jails)." },
  "kids-in-need-of-defense-charityevals": { b: { USA: 0.91, GTM: 0.028, HND: 0.026, SLV: 0.026, MEX: 0.0097, UKR: 0.0003 }, note: "Our build: by share of the result at the defaults: the US casework (91%; the children live in the US), the CAM refugee applicants in Guatemala, Honduras and El Salvador (8%, by KIND's clients' countries of origin) and psychosocial support in Mexico and for Ukrainian children (1%)." },
  "aspca-charityevals": { b: { USA: 1 }, note: "Our build: the ASPCA works only in the United States (owners and their dogs, cats and horses)." },
  "aspca-charityevals-farm-animals": { b: { USA: 1 }, note: "Our build: US hens and sows under state laws and higher-welfare purchases." },
  "environmental-defense-fund-charityevals": { b: "world", note: "Our build: a tonne of greenhouse gas kept out of the air spares people everywhere, so the result is spread by world population; the small US power-plant and vehicle smoke share is left in the world figure." },
  "environmental-defense-fund-charityevals-health-nature": { b: { USA: 0.99, MEX: 0.004, IDN: 0.004, world: 0.002 }, note: "Our build: by share of the result at the defaults. EPA's soot and lead-pipe rules in the US (99%); fisheries reforms, split by judgment between Mexico and Indonesia, EDF's largest fisheries countries (0.8%); farm tonnes, spread by world population (0.2%)." },
  "clean-air-task-force-charityevals": { b: "world", note: "Our build: a tonne of greenhouse gas kept out of the air spares people everywhere (heat deaths), so the result is spread by world population; the small US power-plant smoke share is left in the world figure." },
  "earthjustice-charityevals": { b: "world", note: "Our build: a tonne of greenhouse gas kept out of the air spares people everywhere (heat deaths), so the result is spread by world population; the small US coal-smoke share is left in the world figure." },
  "earthjustice-charityevals-health": { b: { USA: 1 }, note: "Our build: the air and drinking-water rules protect people in the United States." },
  "earthjustice-charityevals-biodiversity": { b: "world", note: "Our build: the counted good is forest carbon kept out of the air, which spares people everywhere (heat deaths)." },
  "sierra-club-foundation-charityevals": { b: "world", note: "Our build: a tonne of greenhouse gas kept out of the air spares people everywhere (heat deaths), so the result is spread by world population; the small US coal and traffic smoke share is left in the world figure." },
  "sierra-club-foundation-charityevals-lands-health": { b: { USA: 1 }, note: "Our build: EPA's soot standard and the outdoors trips reach people in the United States." },
  "johns-hopkins-center-for-health-security-charityevals": { b: "world", note: "Our build: a pandemic kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "1day-sooner-charityevals": { b: "world", note: "Our build: most of the result is pandemic risk, which is everyone's, so it is spread by world population; the malaria vaccine branch (sub-Saharan Africa) and hepatitis C (worldwide) are about 23% of it and left in the world figure." },
  "blueprint-biosecurity-charityevals": { b: "world", note: "Our build: a pandemic kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "ibbis-charityevals": { b: "world", note: "Our build: a pandemic kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "securebio-charityevals": { b: "world", note: "Our build: a pandemic kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "cepi-charityevals": { b: "world", note: "Our build: a pandemic kills people everywhere and the future lost is everyone's, so the result is spread by world population; the endemic branch (Lassa, mpox, chikungunya) is under 1% of the result and left in the world figure." },
  "nuclear-threat-initiative-charityevals": { b: "world", note: "Our build: a global catastrophe (nuclear war, a pandemic) kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "international-rescue-committee-charityevals": { b: { SDN: 0.043847, SSD: 0.043854, COD: 0.043854, SOM: 0.043854, ETH: 0.043854, KEN: 0.043854, NGA: 0.043854, TCD: 0.043854, NER: 0.043854, MLI: 0.043854, BFA: 0.043854, UGA: 0.043854, CAF: 0.043854, AFG: 0.032038, PAK: 0.032038, BGD: 0.032038, MMR: 0.032038, THA: 0.032038, SYR: 0.031965, YEM: 0.031965, LBN: 0.031965, JOR: 0.031965, IRQ: 0.031965, PSE: 0.031965, UKR: 0.031965, COL: 0.009192, VEN: 0.009192, HND: 0.009192, GTM: 0.009192, SLV: 0.009192 }, note: "Our build: the IRC's CRRD spending by region in its statement of functional expenses for the year to September 2025 (Africa $362.5m, the Middle East and Ukraine $142.3m, Asia $101.9m, Latin America $29.2m; emergency preparedness and technical units spread the same way), each region split equally over its main programme countries on the 2025 Annual Report's map (a judgment: no country split is published)." },
  "international-rescue-committee-charityevals-resettlement": { b: { USA: 0.939772, DEU: 0.010038, GRC: 0.010038, ITA: 0.010038, POL: 0.010038, SRB: 0.010038, GBR: 0.010038 }, note: "Our build: the IRC's Resettlement, Asylum and Integration spending in the year to September 2025, U.S. $364.1m and Europe $23.3m (statement of functional expenses), Europe split equally over the six countries the 2025 Annual Report names (Germany, Greece, Italy, Poland, Serbia, the UK)." },
  "ploughshares-fund-charityevals": { b: "world", note: "Our build: a nuclear war kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "federation-of-american-scientists-charityevals": { b: "world", note: "Our build: almost all the value is the nuclear and AI work, against risks that kill people everywhere, so the result is spread by world population; the science-policy work (a few percent of the value) is for Americans." },
  "arms-control-association-charityevals": { b: "world", note: "Our build: a nuclear war kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "allfed-charityevals": { b: "world", note: "Our build: a nuclear winter's famine would kill people everywhere, most in countries that import food, and the future lost is everyone's, so the result is spread by world population." },
  "ican-charityevals": { b: "world", note: "Our build: a nuclear war kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "union-of-concerned-scientists-charityevals": { b: "world", note: "Our build: almost all the value is the nuclear-weapons work, against a risk that kills people everywhere, so the result is spread by world population; the science-and-democracy work (under 1% of the value) is for Americans." },
  "union-of-concerned-scientists-charityevals-food": { b: { USA: 1 }, note: "Our build: the flood protection kept is for households in the US Upper Midwest." },
  "union-of-concerned-scientists-charityevals-climate": { b: "world", note: "Our build: a tonne of greenhouse gas kept out of the air spares people everywhere, so the result is spread by world population; the small US power-plant and vehicle smoke share is left in the world figure." },
  "center-for-ai-safety-charityevals": { b: "world", note: "Our build: a global catastrophe from AI kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "save-the-children-charityevals": { b: { AFG: 0.09, YEM: 0.06, MMR: 0.07, NGA: 0.1, COD: 0.08, ETH: 0.08, SOM: 0.08, SDN: 0.08, SSD: 0.04, PSE: 0.06, UKR: 0.03, SYR: 0.03, MWI: 0.04, BGD: 0.04, KEN: 0.03, MOZ: 0.02, SLE: 0.01, TCD: 0.02, LBN: 0.01, GBR: 0.03 }, note: "Our build: shares of the result by branch at the defaults, spread by Save the Children UK's 2025 restricted spending by region (note 22: East and Southern Africa £46m, Asia £32m, Middle East and Eastern Europe £23m, West and Central Africa £20m) over the countries the annual report names (education in Afghanistan, Myanmar, Yemen, Nigeria and the DRC; immunisation in Sudan, Ethiopia and Nigeria; protection in Somalia and Syria; emergencies in Gaza, Sudan, Myanmar and Ukraine; livelihoods in Ethiopia, Malawi and Sierra Leone); the UK programmes about 3%. A judgment where no country split is published." },
  "usa-for-unhcr-charityevals": { b: { SDN: 0.08, TCD: 0.07, SSD: 0.04, UGA: 0.05, ETH: 0.04, COD: 0.05, KEN: 0.02, SOM: 0.015, SYR: 0.07, LBN: 0.05, JOR: 0.04, EGY: 0.03, YEM: 0.02, IRQ: 0.015, BGD: 0.07, AFG: 0.05, PAK: 0.032, UKR: 0.11, MDA: 0.023, POL: 0.02, COL: 0.04, PER: 0.015, ECU: 0.017, MEX: 0.022, MMR: 0.011 }, note: "Our build: USA for UNHCR's 2025 grants by region (Form 990 Schedule F, cash and goods: Sub-Saharan Africa $19.7M, Middle East and North Africa $12.1M, South Asia $8.2M, Europe $6.0M, South America $3.9M, Russia and neighbouring states $2.2M, North America $1.1M, East Asia and the Pacific $0.6M) spread over the largest UNHCR refugee operations in each region (Sudan's neighbours and Sudan, Uganda, Ethiopia, the DRC; Syria, Lebanon, Jordan, Egypt; Bangladesh, Afghanistan, Pakistan; Ukraine and Moldova; Colombia, Peru, Ecuador; Mexico; Myanmar). A judgment where no country split is published." },
  "save-the-children-charityevals-advocacy": { b: { GBR: 0.07, NGA: 0.12, ETH: 0.08, COD: 0.1, PAK: 0.08, IND: 0.06, SDN: 0.06, SSD: 0.04, SOM: 0.05, AFG: 0.05, YEM: 0.05, BGD: 0.05, UKR: 0.03, PSE: 0.04, MMR: 0.04, TCD: 0.04, NER: 0.04 }, note: "Our build: shares of the result by branch at the defaults. The two-child limit (about 7%) in the United Kingdom; the Gavi and Nutrition for Growth pledges (about 75%) and Elrha's research (about 20%) over the Gavi-eligible and crisis countries where Save the Children works, weighted towards the largest (Nigeria, the DRC, Ethiopia, Pakistan); a judgment." },
  "norwegian-refugee-council-charityevals": { b: { AFG: 0.037, BGD: 0.008, IRQ: 0.014, IRN: 0.017, JOR: 0.023, LBN: 0.042, MMR: 0.027, PSE: 0.059, SYR: 0.052, YEM: 0.046, BFA: 0.015, CMR: 0.015, CAF: 0.012, TCD: 0.01, COD: 0.04, DJI: 0.004, ETH: 0.053, KEN: 0.004, LBY: 0.014, MLI: 0.021, MOZ: 0.013, NER: 0.012, NGA: 0.023, SDN: 0.112, SOM: 0.048, SSD: 0.054, TZA: 0.004, UGA: 0.011, MDA: 0.015, UKR: 0.132, COL: 0.028, ECU: 0.005, PAN: 0.001, HND: 0.008, SLV: 0.003, GTM: 0.002, MEX: 0.002, HTI: 0.002, VEN: 0.012 }, note: "Our build: NRC's 2025 project revenue by country office (Annual Accounts 2025, note 2: NOK 7,276m over 39 country offices, NORCAP, regional offices and Norway left out), as the spread of its programmes; the branches' results aren't split by country, so this weights every country by its spending (Ukraine 13%, Sudan 11%)." },
  "norwegian-refugee-council-charityevals-advocacy": { b: { AFG: 0.037, BGD: 0.008, IRQ: 0.014, IRN: 0.017, JOR: 0.023, LBN: 0.042, MMR: 0.027, PSE: 0.059, SYR: 0.052, YEM: 0.046, BFA: 0.015, CMR: 0.015, CAF: 0.012, TCD: 0.01, COD: 0.04, DJI: 0.004, ETH: 0.053, KEN: 0.004, LBY: 0.014, MLI: 0.021, MOZ: 0.013, NER: 0.012, NGA: 0.023, SDN: 0.112, SOM: 0.048, SSD: 0.054, TZA: 0.004, UGA: 0.011, MDA: 0.015, UKR: 0.132, COL: 0.028, ECU: 0.005, PAN: 0.001, HND: 0.008, SLV: 0.003, GTM: 0.002, MEX: 0.002, HTI: 0.002, VEN: 0.012 }, note: "Our build: almost all of the result is humanitarian funding kept or added across the appeals, the rest access in Sudan and the DRC; spread like NRC's programmes by its 2025 project revenue by country office (Annual Accounts 2025, note 2), as a stand-in for the crises the appeals fund; a judgment." },
  "danish-refugee-council-charityevals": { b: { UKR: 0.14, AFG: 0.0375, BGD: 0.0457, MMR: 0.0355, TUR: 0.0304, GEO: 0.0061, YEM: 0.0923, SYR: 0.0406, LBN: 0.0254, IRQ: 0.0203, PSE: 0.0122, JOR: 0.0061, LBY: 0.0041, TUN: 0.002, DZA: 0.001, SDN: 0.0568, SOM: 0.0406, ETH: 0.0355, SSD: 0.0355, KEN: 0.0254, UGA: 0.0203, COD: 0.0152, DJI: 0.002, BDI: 0.0041, TZA: 0.003, BFA: 0.0457, NGA: 0.0457, MLI: 0.0304, NER: 0.0304, CMR: 0.0203, TCD: 0.0203, COL: 0.0203, VEN: 0.0101, CAF: 0.0071, MEX: 0.0051, DNK: 0.027 }, note: "Our build: DRC publishes no spending table by country; its charts give the five largest operations (Ukraine about DKK 445m, Yemen 295m, Sudan 180m, Burkina Faso 145m, Afghanistan 120m) and the four regions' turnover (Asia & Europe about 940m, East Africa & Great Lakes 760m, West Africa & Americas 750m, Middle East & North Africa 650m; Annual Report 2025, p. 49, read from the charts). The rest of each region is a judgment spread over its operations by their size in the report (the six closed in 2025 included); Denmark at its share of programme spending (2.7%)." },
  "jesuit-refugee-service-charityevals": { b: { TCD: 0.088, COD: 0.055, CMR: 0.027, CAF: 0.027, NGA: 0.013, BDI: 0.011, KEN: 0.053, SSD: 0.045, UGA: 0.027, ETH: 0.027, TZA: 0.009, MWI: 0.009, MOZ: 0.009, LBN: 0.051, SYR: 0.026, JOR: 0.015, IRQ: 0.01, COL: 0.032, VEN: 0.02, ECU: 0.012, MEX: 0.016, IDN: 0.021, THA: 0.017, MMR: 0.014, PHL: 0.01, KHM: 0.007, IND: 0.012, AFG: 0.008, ITA: 0.056, DEU: 0.042, FRA: 0.028, ROU: 0.028, PRT: 0.022, GRC: 0.02, BEL: 0.014, MLT: 0.014, GBR: 0.028, UKR: 0.028, USA: 0.049 }, note: "Our build: JRS's 2025 programme expenses by region (Annual Report 2025, p. 33: West Africa $18.4m, Eastern Africa $14.8m, Middle East $8.5m, Latin America $6.7m, Asia Pacific $5.7m, South Asia $1.6m, Europe $23.3m, North America $4.1m), each region spread over its main country programmes by a judgment (Chad, the DRC, Kenya, South Sudan, Lebanon and Italy largest); the branches' results aren't split by country, so this weights every country by its spending." },
  "jesuit-refugee-service-charityevals-advocacy": { b: { TCD: 0.133, COD: 0.083, CMR: 0.04, CAF: 0.04, NGA: 0.02, BDI: 0.017, KEN: 0.08, SSD: 0.066, UGA: 0.04, ETH: 0.04, TZA: 0.013, MWI: 0.013, MOZ: 0.013, LBN: 0.076, SYR: 0.038, JOR: 0.023, IRQ: 0.015, COL: 0.048, VEN: 0.03, ECU: 0.018, MEX: 0.024, IDN: 0.031, THA: 0.026, MMR: 0.02, PHL: 0.015, KHM: 0.01, IND: 0.017, AFG: 0.011 }, note: "Our build: the advocacy's value is humanitarian aid kept in the UN appeals, at the value of JRS's own programmes; spread like JRS's programmes in its southern regions by their 2025 expenses (Annual Report 2025, p. 33: Europe and North America left out, being outside the appeals), each region over its main country programmes by a judgment." },
  "machine-intelligence-research-institute-charityevals": { b: "world", note: "Our build: an AI catastrophe kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "far-ai-charityevals": { b: "world", note: "Our build: an AI catastrophe kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "govai-charityevals": { b: "world", note: "Our build: an AI catastrophe kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "epoch-ai-charityevals": { b: "world", note: "Our build: an AI catastrophe kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "metr-charityevals": { b: "world", note: "Our build: an AI catastrophe kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "redwood-research-charityevals": { b: "world", note: "Our build: an AI catastrophe kills people everywhere and the future lost is everyone's, so the result is spread by world population." },
  "better-futures-guide-aim": { b: "destinations", note: "Moves money: each livelihoods charity it reads live brings its own countries." },
  "cearch-aim": { b: "destinations", note: "Moves money: each GiveWell top charity it reads live brings its own countries." },
  "giving-what-we-can-charityevals": { b: "destinations", note: "Moves money: each recipient its donors give to, read live, brings its own countries." },
  "80000-hours-charityevals": { b: "destinations", note: "Moves people: each cause its plan changes go into, read live, brings its own countries." },
  "givewell-charityevals": { b: "destinations", note: "Moves money: each charity it funds, read live, brings its own countries." },
  "effektiv-spenden-charityevals": { b: "destinations", note: "Moves money: each recipient its donors give to, read live, brings its own countries." },
  "animal-charity-evaluators-charityevals": { b: "destinations", note: "Moves money: each animal charity it reaches, read live, brings its own countries." },
  "rethink-priorities-charityevals": { b: "destinations", note: "Changes others' spending: the charities of each cause it informs, read live, bring their own countries." },
  "rethink-priorities-charityevals-global-health": { b: "destinations", note: "Changes others' spending: the charities of each cause it informs, read live, bring their own countries." },
  "rethink-priorities-charityevals-cross-cause": { b: "destinations", note: "Changes others' spending: the charities of each cause it informs, read live, bring their own countries." },
};
/** Research and standard-setting whose good reaches the whole world. */
const WORLD: Record<string, string> = {
  "alliance-for-reducing-microbial-resistance-aim": "Advocacy for new antimicrobials: antimicrobial resistance is a global burden.",
  "wild-animal-initiative": "Research on wild animals' welfare, for wild animals everywhere.",
  "aquatic-life-institute": "Welfare standards for farmed aquatic animals across the global industry.",
  "world-health-organization-rough-who-gdg-march-2025": "A WHO guideline, adopted by countries worldwide.",
  "sickkids-f35-milk-trial-2026": "A treatment trial whose result informs care for malnourished children worldwide.",
  "wehi-voi-walter-eliza-hall-iron-repletion": "A treatment trial whose result informs iron treatment worldwide.",
};
/** Models that say nothing about where: the charity's main country of operation (a judgment; listed in
 * the report). Charities working across many low- and middle-income countries with no main one are
 * spread by world population. */
const MAIN: Record<string, { b: Record<string, number> | "world"; note: string }> = {
  "international-rescue-committee-voi-irc-mini-incubator-june-27-2024": { b: { TCD: 1 }, note: "Nothing in the sheet says where; it is linked from GiveWell's September 2024 grant for desk-based scoping of vaccination programmes, whose follow-on grant (April 2026) funds vaccination outreach in Salamat and Sila, Chad." },
  "atlas-ai-atlasai-target-pop-optionality-voi": { b: { NGA: 1 }, note: "Targeting vitamin A supplementation; the sheet's one place named is Nigeria (its notes speak of Nigerian populations)." },
  "evidence-action-syphilis-screen-treat-in-pregnant-women": { b: { ZMB: 0.5, CMR: 0.5 }, note: "Evidence Action's syphilis screening in pregnancy runs in Zambia and Cameroon (its other syphilis models), sharing equally." },
  "dansk-vegetarisk-forening": { b: { DNK: 1 }, note: "Dansk Vegetarisk Forening works in Denmark." },
  "kaya-guides-aim": { b: { IND: 1 }, note: "Kaya Guides runs its guided self-help in India." },
  "precision-development-agriculture-intervention-report": { b: { IND: 1 }, note: "Precision Development's largest phone advisory services are in India." },
  "shrimp-welfare-project": { b: { IND: 0.5, VNM: 0.5 }, note: "Shrimp Welfare Project's stunning and farm programmes are in India and Vietnam, sharing equally." },
  "vegan-outreach-ace-2016": { b: { USA: 1 }, note: "Vegan Outreach's 2016 programmes (leafleting, school visits) were mainly in the US." },
  "world-spine-care-hli": { b: { BWA: 1 }, note: "World Spine Care's first and main clinics are in Botswana." },
  "medicines-development-for-global-health-moxidectin-mda-onchocerciasis-ro": { b: { COD: 1 }, note: "River blindness is almost all in Africa; DRC carries the largest share of it." },
  "miraclefeet-monitoring-may-2023-voi-vet-complete": { b: "world", note: "Clubfoot treatment in about 30 low- and middle-income countries with no main one and no split: spread by world population." },
  "unfpa-supplies-partnership-february-2026": { b: "world", note: "Contraceptive supplies to public health systems in many low-income countries, no split: spread by world population." },
};

// --- Country names -------------------------------------------------------------------------------------
const ALIASES: [string, string][] = [
  ...COUNTRIES.map((c) => [c.name, c.iso3] as [string, string]),
  ["DRC", "COD"], ["DR Congo", "COD"], ["Democratic Republic of Congo", "COD"], ["Congo", "COD"], ["Republic of Congo", "COG"],
  ["Cote d'Ivoire", "CIV"], ["Côte d’Ivoire", "CIV"], ["Ivory Coast", "CIV"],
  ["UK", "GBR"], ["U.K.", "GBR"], ["Britain", "GBR"], ["England", "GBR"], ["Scotland", "GBR"], ["Wales", "GBR"],
  ["US", "USA"], ["U.S.", "USA"], ["USA", "USA"], ["United States of America", "USA"],
  ["Turkey", "TUR"], ["Czech Republic", "CZE"], ["Burma", "MMR"], ["Swaziland", "SWZ"], ["Viet Nam", "VNM"], ["Russian Federation", "RUS"],
  ["Holland", "NLD"], ["Northern Ireland", "GBR"],
  // Demonyms that name one country ("Indian" doesn't: the Indian Ocean).
  ["Brazilian", "BRA"], ["Nigerian", "NGA"], ["Kenyan", "KEN"], ["Ugandan", "UGA"], ["Ghanaian", "GHA"], ["Pakistani", "PAK"],
  ["Ethiopian", "ETH"], ["Malawian", "MWI"], ["Rwandan", "RWA"], ["Zambian", "ZMB"], ["Danish", "DNK"], ["Bangladeshi", "BGD"],
  // Places inside one country that sheets and names use alone.
  ...["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Benue", "Borno", "Cross River", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Ogun", "Ondo", "Osun", "Oyo", "Sokoto", "Taraba", "Yobe", "Zamfara", "Abuja"].map((s) => [s, "NGA"] as [string, string]),
  ...["Bihar", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Jharkhand", "Odisha", "Maharashtra", "Gujarat", "Tamil Nadu", "Kerala", "Karnataka", "Chhattisgarh"].map((s) => [s, "IND"] as [string, string]),
  ["Sindh", "PAK"], ["Karachi", "PAK"], ["Ituri", "COD"], ["Haut-Katanga", "COD"], ["Haut-Lomami", "COD"], ["Lualaba", "COD"], ["Kinshasa", "COD"],
  ["Karamoja", "UGA"], ["Nampula", "MOZ"], ["Mirriah", "NER"], ["Maradi", "NER"], ["Nairobi", "KEN"], ["Memphis", "USA"],
];
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PATTERNS = [...ALIASES].sort((a, b) => b[0].length - a[0].length).map(([name, iso]) => ({
  iso,
  re: new RegExp(`(?<![\\w-])${escape(name)}(?![\\w-])${name === "US" ? "(?! ?\\$| ?dollar| ?cent)" : ""}`, "g"),
  // "New Jersey", "Western Australia": a place inside another country, not that country.
  not: name === "Jersey" ? /New $/ : name === "Georgia" ? /(US state|Atlanta)/ : undefined,
}));

/** Countries a text names, in the order they first appear (a longer name masks the shorter one in it:
 * South Sudan is not also Sudan). */
function countriesIn(text: string): string[] {
  let t = text;
  const found: { iso: string; at: number }[] = [];
  for (const p of PATTERNS) {
    t = t.replace(p.re, (m, at: number) => {
      if (p.not?.test(t.slice(Math.max(0, at - 12), at))) return m;
      found.push({ iso: p.iso, at });
      return " ".repeat(m.length);
    });
  }
  return [...new Set(found.sort((a, b) => a.at - b.at).map((f) => f.iso))];
}

/** Equal shares to six decimals, the last taking what rounding left so they sum to 1. */
const equal = (isos: string[]): Record<string, number> => {
  const each = Number((1 / isos.length).toFixed(6));
  return Object.fromEntries(isos.map((i, k) => [i, k < isos.length - 1 ? each : Number((1 - each * (isos.length - 1)).toFixed(6))]));
};
const names = (b: Record<string, number>) => Object.keys(b).map((i) => (i === "world" ? "the world" : COUNTRIES.find((c) => c.iso3 === i)!.name)).join(", ");

// --- The library ---------------------------------------------------------------------------------------
const files = walk(join(root, "models"));
const raws = new Map(files.map((p) => [read(p).id as string, p]));
const lib = buildLibrary(files.map(read), read(join(root, "assumptions/default.json")), walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
if (lib.errors.length) throw new Error(lib.errors.join("\n"));

/** Rows the bottom line reads, directly or not. */
function feeding(m: ResolvedModel): Set<string> {
  const seen = new Set<string>();
  const visit = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    m.byId.get(id)?.deps.forEach(visit);
  };
  if (m.output) visit(m.output.row);
  return seen;
}

/** Countries named in the labels of the rows the bottom line reads, by how many rows name each: the
 * location columns of an evaluator's sheet. Countries named in under half as many rows as the most named
 * are a comparison (a benchmark's country), not a column the bottom line reads. */
function sheetColumns(m: ResolvedModel): string[] {
  const counts = new Map<string, number>();
  for (const id of feeding(m)) for (const iso of countriesIn(m.byId.get(id)!.label)) counts.set(iso, (counts.get(iso) ?? 0) + 1);
  const top = Math.max(0, ...counts.values());
  return [...counts].filter(([, n]) => n >= Math.max(2, top / 2)).sort((a, b) => b[1] - a[1]).map(([i]) => i);
}

/** Countries the explainers of the rows the bottom line reads name at least twice, the most named and
 * those named at least half as often. */
function noteCountries(m: ResolvedModel): string[] {
  const counts = new Map<string, number>();
  for (const id of feeding(m)) {
    const r = m.byId.get(id)!;
    for (const iso of countriesIn(`${r.explainer ?? ""} ${r.source?.note ?? ""}`)) counts.set(iso, (counts.get(iso) ?? 0) + 1);
  }
  const top = Math.max(0, ...counts.values());
  return [...counts].filter(([, n]) => n >= Math.max(2, top / 2)).sort((a, b) => b[1] - a[1]).map(([i]) => i);
}

function factCountries(m: ResolvedModel): string[] {
  const out = new Set<string>();
  for (const id of feeding(m)) for (const f of m.byId.get(id)!.factDeps) {
    const file = f.split(".")[0].replace(/^givewell_/, "");
    countriesIn(lib.facts.get(f)!.group).concat(countriesIn(file.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))).slice(0, 1).forEach((i) => out.add(i));
  }
  return [...out];
}

/** The location a variant's name gives: its last parenthesis, outermost ("New Incentives (Nigeria (Niger))"). */
function variantLocation(name: string): string | undefined {
  const open = name.indexOf("(");
  return open < 0 ? undefined : name.slice(open + 1, name.lastIndexOf(")"));
}

function decide(m: ResolvedModel): Decision {
  const ours = OURS[m.id];
  if (ours) return { b: ours.b, method: ours.b === "destinations" ? "moves money (destinations)" : "our build", note: ours.note };
  if (m.cause === "climate") return { b: "world", method: "world: climate", note: "Climate: the good of a tonne of CO₂ averted is spread over the world, by population." };
  if (WORLD[m.id]) return { b: "world", method: "world: global reach", note: WORLD[m.id] };
  if (m.kind === "variant") {
    const loc = variantLocation(m.name);
    const c = loc ? countriesIn(loc)[0] : undefined;
    const parent = m.extends ? lib.models.get(m.extends) : undefined;
    const parentB = parent ? decide(parent) : undefined;
    if (c && !(parentB && "b" in parentB && typeof parentB.b === "object" && Object.keys(parentB.b).join() === c))
      return { b: { [c]: 1 }, method: "variant location", note: `The variant's location: ${loc}.` };
    return { inherit: true, method: "variant inherits" };
  }
  const own = fromModel(m);
  if (own) return own;
  const charity = lib.charities.get(m.charity);
  if (MAIN[m.id]) return { ...MAIN[m.id], method: "charity's main country (judgment)" };
  const main = countriesIn(charity?.summary ?? "")[0];
  if (main) return { b: { [main]: 1 }, method: "charity's main country (judgment)", note: `Nothing in the model says where; the charity's main country of operation, from its record: ${names({ [main]: 1 })}.` };
  // The country the charity's other models name most.
  const votes = new Map<string, number>();
  for (const x of lib.models.values()) {
    if (x.charity !== m.charity || x.id === m.id || x.kind !== "charity") continue;
    const d = fromModel(x);
    if (d && typeof d.b === "object") for (const iso of Object.keys(d.b)) votes.set(iso, (votes.get(iso) ?? 0) + 1);
  }
  const top = [...votes].sort((a, b) => b[1] - a[1])[0]?.[0];
  if (top) return { b: { [top]: 1 }, method: "charity's main country (judgment)", note: `Nothing in the model says where; the charity's main country of operation, the one its other models name most: ${names({ [top]: 1 })}.` };
  return { b: "world", method: "unresolved", note: "Nothing says where." };
}

/** What the model itself says (steps 4 to 8). */
function fromModel(m: ResolvedModel): { b: Record<string, number>; method: string; note: string } | undefined {
  // A family's own model names the location it shows: "this page shows Togo, the median location".
  const shows = /this page shows ([^,;]+?)(?:, the|\.|;)/.exec(m.summary ?? "")?.[1];
  const shown = shows ? countriesIn(shows)[0] : undefined;
  if (shown) return { b: { [shown]: 1 }, method: "family's shown location", note: `The location the page shows: ${shows}.` };
  const charity = lib.charities.get(m.charity);
  for (const l of charity?.locations ?? []) {
    if (!new RegExp(l.models).test(m.id)) continue;
    const c = countriesIn(l.label);
    if (c.length === 1) return { b: equal(c), method: "charity location", note: `The charity record's location for this model: ${l.label}.` };
  }
  const inName = countriesIn(m.name);
  if (inName.length) return { b: equal(inName), method: "model name", note: `The model's name: ${m.name}.` };
  const cols = sheetColumns(m);
  if (cols.length) return { b: equal(cols), method: "sheet location columns", note: `The location${cols.length > 1 ? "s" : ""} the sheet's bottom line reads (row labels naming ${names(equal(cols))})${cols.length > 1 ? ", sharing equally" : ""}.` };
  const facts = factCountries(m);
  if (facts.length) return { b: equal(facts), method: "country facts", note: `The country facts its rows read: ${names(equal(facts))}${facts.length > 1 ? ", sharing equally" : ""}.` };
  const inSummary = countriesIn(m.summary ?? "");
  if (inSummary.length) return { b: equal(inSummary), method: "model summary", note: `The countries the model's summary names${inSummary.length > 1 ? ", sharing equally" : ""}: ${names(equal(inSummary))}.` };
  const notes = noteCountries(m);
  if (notes.length) return { b: equal(notes), method: "sheet notes", note: `The countries the notes on the rows its bottom line reads name more than once${notes.length > 1 ? ", sharing equally" : ""}: ${names(equal(notes))}.` };
  return undefined;
}

// --- Write ---------------------------------------------------------------------------------------------
const byMethod: Record<string, string[]> = {};
let changed = 0;
for (const m of [...lib.models.values()].sort((a, b) => a.id.localeCompare(b.id))) {
  if (m.kind === "template" || !comparable(lib, m)) continue;
  const d = decide(m);
  (byMethod[d.method] ??= []).push(m.id);
  if (process.argv.includes("--table")) console.log(`${m.id} | ${d.method} | ${"b" in d ? JSON.stringify(d.b) : "-"}`);
  const path = raws.get(m.id)!;
  const text = readFileSync(path, "utf8");
  // The fields as this script writes them (one line each), or an object spread over lines by a JSON
  // pretty-printer (`"beneficiaries": {` … `},`), which a one-line match would cut in half.
  let next = text
    .replace(/^[ \t]+"beneficiaries": \{\n(?:[ \t]+"[^"\n]+": [0-9.e-]+,?\n)*[ \t]+\},?\n/m, "")
    .replace(/^[ \t]+"beneficiaries(_note)?": .*\n/gm, "");
  if ("b" in d) {
    const b = typeof d.b === "object" && Object.keys(d.b).length === 1 && d.b.world === 1 ? "world" : d.b;
    next = next.replace(/^([ \t]+)"cause": "[a-z-]+",\n/m, (line, indent: string) => `${line}${indent}"beneficiaries": ${JSON.stringify(b)},\n${indent}"beneficiaries_note": ${JSON.stringify(d.note)},\n`);
    if (!next.includes('"beneficiaries"')) throw new Error(`${m.id}: no top-level "cause" line to write after`);
  }
  // A layout the text edit doesn't know (keys with spaces, a last field without a comma): rewrite the parsed
  // object instead, fields in their old order with the two written after "cause".
  let parsed: Record<string, unknown> | undefined;
  try { parsed = JSON.parse(next); } catch { /* rewritten below */ }
  const want = "b" in d ? (typeof d.b === "object" && Object.keys(d.b).length === 1 && d.b.world === 1 ? "world" : d.b) : undefined;
  if (!parsed || JSON.stringify(parsed.beneficiaries) !== JSON.stringify(want)) {
    const o = JSON.parse(text) as Record<string, unknown>;
    delete o.beneficiaries; delete o.beneficiaries_note;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(o)) {
      out[k] = v;
      if (k === "cause" && want !== undefined) { out.beneficiaries = want; out.beneficiaries_note = (d as { note?: string }).note; }
    }
    // The field on one line, as the text edit writes it, so the next run finds nothing to change.
    next = (JSON.stringify(out, null, 2) + "\n").replace(/^([ \t]+)"beneficiaries": \{\n(?:[^\n]*\n)*?\1\},\n/m, (_, indent: string) => `${indent}"beneficiaries": ${JSON.stringify(want)},\n`);
  }
  if (next !== text) {
    changed++;
    if (!check) writeFileSync(path, next);
  }
}
for (const [method, ids] of Object.entries(byMethod).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${method}: ${ids.length}`);
  if (process.argv.includes("--list") || /judgment|unresolved/.test(method)) for (const id of ids) console.log(`  ${id}`);
}
console.log(`${changed} file${changed === 1 ? "" : "s"} ${check ? "would change" : "changed"}`);
if (check && changed) process.exit(1);
