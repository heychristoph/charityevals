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
  "american-red-cross-charityevals": { b: { USA: 1 }, note: "Our build: US disaster relief, home fire safety and services to military families." },
  "american-red-cross-charityevals-biomedical": { b: { USA: 1 }, note: "Our build: the US blood supply and US training courses." },
  "american-red-cross-charityevals-international": { b: { LBN: 0.16, UKR: 0.16, MOZ: 0.51, BGD: 0.07, MMR: 0.09, BRA: 0.01 }, note: "Our build: disaster-response grants to Red Cross and Red Crescent societies, weighted by region from the Form 990's Schedule F (Middle East 45%, Europe 25%, Sub-Saharan Africa 15%, South Asia 7%, East Asia 5%, the Americas 3.5%), each region valued at a stand-in country (Lebanon, Ukraine, Mozambique, Bangladesh, Myanmar, Brazil): shares of the result at the defaults (the poorest, Mozambique, 51%)." },
  "british-heart-foundation-charityevals": { b: { world: 0.93, GBR: 0.07 }, note: "Our build: research valued as a share of the world's cardiovascular burden (93% of the result at the defaults, spread by world population), UK tobacco policy and NHS implementation pilots (7%)." },
  "british-heart-foundation-charityevals-health": { b: { GBR: 1 }, note: "Our build: health information, the Heart Helpline, peer support, CPR training and the defibrillator network in the UK." },
  "doctors-without-borders-charityevals": { b: { COD: 0.147336, SDN: 0.141066, PSE: 0.126437, SSD: 0.118077, NGA: 0.094044, YEM: 0.092999, TCD: 0.075235, CAF: 0.071055, AFG: 0.07001, NER: 0.063741 }, note: "Our build: medical care in about 70 countries, weighted by programme spending in MSF's ten largest countries (Financial Report 2025, p. 10: the DRC 141, Sudan 135, Palestine 121, South Sudan 113, Nigeria 90, Yemen 89, Chad 72, the Central African Republic 68, Afghanistan 67 and Niger 61 million euros, 957 million of 1,580), the other 60 countries taken as like them (a judgment)." },
  "doctors-without-borders-charityevals-relief": { b: { COD: 0.4489, SDN: 0.2993, SSD: 0.2494, BGD: 0.0024 }, note: "Our build: relief distributions to displaced families (99.8% of the result) in the DRC, Sudan and South Sudan by the build's own country shares (45%, 30%, 25%; a judgment); search and rescue at sea (0.2%), people crossing from Libya, Bangladesh the largest nationality among them (a judgment)." },
  "doctors-without-borders-charityevals-advocacy": { b: { IND: 0.308, IDN: 0.1155, PHL: 0.077, PAK: 0.077, NGA: 0.08285, BGD: 0.0539, ZAF: 0.0385, COD: 0.08975, TCD: 0.02125, SDN: 0.03625, SSD: 0.02125, NER: 0.02125, AFG: 0.02125, SOM: 0.02125, KEN: 0.015 }, note: "Our build: MSF Access's TB price cuts (77% of the result) spread over the high-burden countries that buy the tests and drugs (India, Indonesia, the Philippines, Pakistan, Nigeria, Bangladesh, South Africa, the DRC; our weights by TB burden); awareness-raising (17%) over the crisis countries of MSF's medical model, equally; DNDi (6%) over the DRC, Sudan and Kenya (sleeping sickness and leishmaniasis). A judgment." },
  "american-red-cross-charityevals-measles": { b: { KEN: 0.25, NGA: 0.25, MWI: 0.25, MOZ: 0.25 }, note: "Our build: household visits before measles-rubella campaigns through the Measles & Rubella Partnership; the Red Cross publishes no list of the year's countries, so the partnership countries where its volunteers' visits are documented (Kenya, Nigeria, Malawi, Mozambique) share equally (a judgment)." },
  "habitat-for-humanity-charityevals": { b: { USA: 1 }, note: "Our build: HFHI's US affiliates." },
  "st-jude-charityevals": { b: { world: 0.89, USA: 0.11 }, note: "Our build: St. Jude Global's partner hospitals in more than 70 countries and the graduate school's research (89% of the result at the defaults, spread by world population: a judgment, the build names no split), and patient care, clinical training and community programmes in the US (11%)." },
  "st-jude-charityevals-research": { b: "world", note: "Our build: research valued as a share of the world's childhood cancer, sickle cell and children's influenza burden." },
  "habitat-for-humanity-charityevals-international": { b: { HND: 0.0347, DOM: 0.0347, PER: 0.0346, ARM: 0.0288, MKD: 0.0288, ROU: 0.0287, EGY: 0.0287, KEN: 0.129, UGA: 0.129, MWI: 0.129, ZMB: 0.129, PHL: 0.1325, BGD: 0.1325 }, note: "Our build: Habitat's work in more than 60 countries, by region at the shares of the result at the defaults (Africa 52%, Asia and the Pacific 26%, Europe and the Middle East 12%, Latin America and the Caribbean 10%), each region's share spread equally over the stand-in countries whose survey consumption the build reads (a judgment)." },
  "habitat-for-humanity-charityevals-awareness": { b: { USA: 0.02, HND: 0.0116, DOM: 0.0282, PER: 0.0314, ARM: 0.0494, MKD: 0.0245, ROU: 0.0123, EGY: 0.0993, KEN: 0.1268, UGA: 0.063, MWI: 0.1408, ZMB: 0.1528, PHL: 0.0995, BGD: 0.1404 }, note: "Our build: the global Home Equals campaign (98% of the result at the defaults), valued country by country over the 13 stand-in countries of the international build, each region a quarter of the people (Home Equals publishes no split, a judgment), so the shares follow each country's net value per person; US housing advocacy 2%." },
  "united-way-charityevals": { b: { USA: 1 }, note: "Our build: the US United Way network." },
  "the-nature-conservancy-charityevals": { b: { world: 0.4129, IND: 0.48, MEX: 0.041, USA: 0.0167, SYC: 0.0135, MHL: 0.0135, ECU: 0.0173, BHS: 0.0051 }, note: "Our build: by share of the result at the defaults. PRANA's crop-burning deaths in northwest India (48%); forest and land carbon, power displaced and pandemic risk, spread by world population (41%); adaptation's coastal people in Mexico and Hawai'i (6%, split by judgment); the fisheries rules' fishers in the Seychelles and the Pacific islands (3%, split by judgment); the year's deals' local incomes in Ecuador and The Bahamas (2%, by their people)." },
  "the-humane-league-charityevals-corporate-campaigns": { b: { USA: 0.55, world: 0.45 }, note: "Our build: hens out of cages at companies THL pressed itself, 55% US by ACE's hens in the supply chains of the companies its US and global accountability programmes engaged (135 and 114 million); the rest spread by world population. A judgment." },
  "the-humane-league-charityevals-other-programmes": { b: { world: 0.73, USA: 0.27 }, note: "Our build: animals, by share of the result at the defaults. New corporate commitments 'around the world' (48%) and the Open Wing Alliance's wins abroad (8%) spread by world population; grassroots pressure on switches at companies THL pressed itself (38%), 55% US by ACE's hens in the engaged US and global supply chains (135 and 114 million); state-law defence and the Animal Policy Alliance in the US (6%). A judgment." },
  "salvation-army-charityevals": { b: { USA: 1 }, note: "Our build: the Salvation Army's services in the US (its overseas work has its own model)." },
  "salvation-army-charityevals-international": { b: {IND: 0.056222, PAK: 0.042916, KEN: 0.042766, COG: 0.033992, BRA: 0.028739, COD: 0.026937, PHL: 0.023513, MEX: 0.022432, MDA: 0.022063, UKR: 0.022063, GEO: 0.022063, JAM: 0.021966, HTI: 0.021966, ZMB: 0.020539, PNG: 0.019909, MOZ: 0.019098, ZWE: 0.017446, BWA: 0.017446, BGD: 0.017235, RWA: 0.017111, LKA: 0.016755, PRY: 0.016455, TZA: 0.015884, UGA: 0.015854, GHA: 0.015373, NGA: 0.015193, MWI: 0.014983, AGO: 0.014502, GTM: 0.014317, CRI: 0.014317, SLV: 0.014317, NIC: 0.014317, PER: 0.014014, BOL: 0.014014, BDI: 0.013841, ZAF: 0.013721, LBR: 0.013221, MLI: 0.012925, MMR: 0.012655, THA: 0.012655, MDG: 0.011138, KHM: 0.011138, IDN: 0.011138, NPL: 0.011138, VEN: 0.011138, ROU: 0.010925, ESP: 0.010528, PRT: 0.010528, SLB: 0.008771, ARE: 0.0082, DNK: 0.006488, ITA: 0.005857, GRC: 0.005857, ARG: 0.005316, URY: 0.005316, NLD: 0.004776, CZE: 0.004776, SVK: 0.004776, FIN: 0.003394, EST: 0.003394, DEU: 0.003354, LTU: 0.003354, POL: 0.003354, HND: 0.003179, PAN: 0.003179, CHL: 0.002876, ECU: 0.002876, TWN: 0.002763, SWE: 0.002103, LVA: 0.002103, SLE: 0.002083, GIN: 0.002083, BFA: 0.001787, BGR: 0.001546, SGP: 0.001517, MYS: 0.001516}, note: "Our build: shares of the result by branch at the defaults. The operating support (schools, health care, social services and church life in the territories that can't pay their own way, 48%) follows International Headquarters' maintenance grants by territory (International Trust accounts 2025, Note 11), split equally over each territory's countries; SAWSO's livelihoods and anti-trafficking work (50%) is spread equally over the low- and middle-income countries its report lists; relief goes to Ukraine and the countries hosting its refugees, education projects to Rwanda and the Republic of the Congo (judgments where no split is published)." },
  "the-humane-league-charityevals-owa-grants": { b: { GBR: 0.865, USA: 0.014, GHA: 0.036, BRA: 0.032, POL: 0.030, IDN: 0.011, EGY: 0.007, IND: 0.005 }, note: "Our build: by share of the result (chicken pain days) at the defaults: the grant to THL UK (UK commitments, switches, the cage ban and the breed case, 86%), the US policy grants (1%), and the Open Wing Alliance grants abroad (12%) split by Schedule F's grant regions (Sub-Saharan Africa 30%, South America 26%, Europe outside the UK 25%, East Asia 9%, Middle East and North Africa 6%, South Asia 4%), each region at a stand-in country (Ghana, Brazil, Poland, Indonesia, Egypt, India; the review names wins in Ghana and Indonesia, the 990 in Poland)." },
  "the-life-you-can-save-founders-pledge": { b: "destinations", note: "Moves money: each recommended charity it reads live brings its own countries." },
  "better-futures-guide-aim": { b: "destinations", note: "Moves money: each livelihoods charity it reads live brings its own countries." },
  "cearch-aim": { b: "destinations", note: "Moves money: each GiveWell top charity it reads live brings its own countries." },
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
  "atlas-ai-atlasai-target-pop-optionality-voi": { b: { NGA: 1 }, note: "Targeting vitamin A supplementation; the sheet's one place named is Nigeria (its notes speak of Nigerian populations)." },
  "evidence-action-syphilis-screen-treat-in-pregnant-women": { b: { ZMB: 0.5, CMR: 0.5 }, note: "Evidence Action's syphilis screening in pregnancy runs in Zambia and Cameroon (its other syphilis models), sharing equally." },
  "central-square-foundation-founders-pledge": { b: { IND: 1 }, note: "Central Square Foundation works on India's school education." },
  "dansk-vegetarisk-forening": { b: { DNK: 1 }, note: "Dansk Vegetarisk Forening works in Denmark." },
  "eidu-founders-pledge": { b: { KEN: 1 }, note: "EIDU's digital learning programme runs mainly in Kenya." },
  "kaya-guides-aim": { b: { IND: 1 }, note: "Kaya Guides runs its guided self-help in India." },
  "precision-development-agriculture-intervention-report": { b: { IND: 1 }, note: "Precision Development's largest phone advisory services are in India." },
  "shrimp-welfare-project": { b: { IND: 0.5, VNM: 0.5 }, note: "Shrimp Welfare Project's stunning and farm programmes are in India and Vietnam, sharing equally." },
  "teaching-at-the-right-level-africa-founders-pledge": { b: { ZMB: 1 }, note: "Teaching at the Right Level Africa's largest government programme is in Zambia." },
  "ubongo-founders-pledge": { b: { TZA: 1 }, note: "Ubongo is based in Tanzania, its largest audience." },
  "vegan-outreach-ace-2016": { b: { USA: 1 }, note: "Vegan Outreach's 2016 programmes (leafleting, school visits) were mainly in the US." },
  "world-spine-care-hli": { b: { BWA: 1 }, note: "World Spine Care's first and main clinics are in Botswana." },
  "medicines-development-for-global-health-moxidectin-mda-onchocerciasis-ro": { b: { COD: 1 }, note: "River blindness is almost all in Africa; DRC carries the largest share of it." },
  "global-alliance-for-improved-nutrition-founders-pledge": { b: "world", note: "Salt iodization in about 30 low- and middle-income countries with no main one and no split: spread by world population." },
  "iodine-global-network-founders-pledge": { b: "world", note: "Salt iodization worldwide with no main country and no split: spread by world population." },
  "lead-exposure-elimination-project-founders-pledge": { b: "world", note: "Lead-paint laws across low- and middle-income countries with no main one and no split: spread by world population." },
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
    .replace(/^[ \t]+"beneficiaries": \{\n(?:[ \t]+"[A-Za-z]+": [0-9.e-]+,?\n)*[ \t]+\},\n/m, "")
    .replace(/^[ \t]+"beneficiaries(_note)?": .*\n/gm, "");
  if ("b" in d) {
    const b = typeof d.b === "object" && Object.keys(d.b).length === 1 && d.b.world === 1 ? "world" : d.b;
    next = next.replace(/^([ \t]+)"cause": "[a-z-]+",\n/m, (line, indent: string) => `${line}${indent}"beneficiaries": ${JSON.stringify(b)},\n${indent}"beneficiaries_note": ${JSON.stringify(d.note)},\n`);
    if (!next.includes('"beneficiaries"')) throw new Error(`${m.id}: no top-level "cause" line to write after`);
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
