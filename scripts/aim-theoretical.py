"""Owner decision 2026-10-31: Ambitious Impact's models are mostly estimates written before the charity existed.
A model is shown only if the charity runs the modelled programme today (checked on its website and recent reports)
and no model based on actual data exists for the charity (another evaluator's or our own). Otherwise it is removed
and recorded in inventory/ambitious-impact-models.json as "not shown: <reason>"; kept models get `theoretical`.

    python3 scripts/aim-theoretical.py     # idempotent: removes what REMOVE names, marks what KEEP names

Checked 2026-10-31. Then run npx tsx scripts/summaries.ts and npx tsx scripts/bulk-writeups.ts.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIR = ROOT / "models/grants/ambitious-impact"

OTHER = "a model based on the charity's actual work exists ({}), so AIM's pre-founding estimate is not shown"
REMOVE = {
    "actra-aim": OTHER.format("Happier Lives Institute, actra-hli"),
    "ansh-aim": OTHER.format("GiveWell, ansh-kangaroo-care-2024"),
    "clear-solutions-aim": OTHER.format("GiveWell, clear-solutions-ors-zinc; Founders Pledge, clear-solutions-founders-pledge"),
    "family-empowerment-media-aim": OTHER.format("GiveWell, family-empowerment-media-planning-radio-campaigns-with-fem-kano; Founders Pledge, family-empowerment-media-founders-pledge"),
    "fortify-health-aim": OTHER.format("GiveWell's Fortify Health models and HLI's fortify-health-hli"),
    "healthy-futures-aim": OTHER.format("GiveWell, healthy-futures-phl-based-on-updated-23-feb-2026"),
    "lead-exposure-elimination-project-aim": OTHER.format("Founders Pledge, lead-exposure-elimination-project-founders-pledge"),
    "notify-health-aim": OTHER.format("GiveWell, notify-health-sms-feb-2025"),
    "spiro-aim": OTHER.format("GiveWell, spiro-community-based-tb-hcm-april-2025"),
    "shrimp-welfare-project-aim": "the Shrimp Welfare Project never ran the modelled aeration subsidies (it works on stunning at slaughter and stocking density), and ACE's model of its actual work exists (shrimp-welfare-project)",
    "animal-policy-international-aim-2020": "a precursor idea AIM considered and did not recommend (UK tariffs on low-welfare fish imports); Animal Policy International was founded from the 2022 import-ban idea and does not run tariff work (https://www.animalpolicyinternational.org/, checked 2026-10-31)",
    "fish-welfare-initiative-aim": "Fish Welfare Initiative does not run the modelled aeration subsidy; it dropped aeration and runs water-quality testing and stocking-density commitments through its Alliance for Responsible Aquaculture (https://www.fishwelfareinitiative.org/india, checked 2026-10-31)",
    "healthier-hens-aim": "Healthier Hens shut down in November 2024 (https://forum.effectivealtruism.org/posts/JXp4yz3AZS8Xrg7mp/healthier-hens-y3-update-the-shutdown)",
    "healthier-hens-aim-2018": "Healthier Hens shut down in November 2024 (https://forum.effectivealtruism.org/posts/JXp4yz3AZS8Xrg7mp/healthier-hens-y3-update-the-shutdown); also superseded by AIM's 2020 report",
    "centre-for-effective-aid-policy-aim": "the Centre for Effective Aid Policy shut down in May 2024 and never worked on GIZ cash benchmarking in Germany (its advocacy was in the Netherlands, Sweden, the UK and Denmark: https://forum.effectivealtruism.org/posts/emBSDADvCnSwtL2kS/center-for-effective-aid-policy-has-shut-down)",
    "centre-for-effective-aid-policy-aim-2020": "the Centre for Effective Aid Policy shut down in May 2024 and never worked on moving Germany's bilateral aid (https://forum.effectivealtruism.org/posts/emBSDADvCnSwtL2kS/center-for-effective-aid-policy-has-shut-down)",
    "maternal-health-initiative-aim": "Maternal Health Initiative shut down in 2024 (https://forum.effectivealtruism.org/posts/MWSwSXNmsSBaEKtKw/maternal-health-initiative-is-shutting-down)",
    "radius-institute-aim": "the Radius Institute does not run the modelled programme (seat-belt legislation in Egypt); it works on speed management and automated speed enforcement, with Zambia as its priority country (https://www.impactpool.org/jobs/1224004, checked 2026-10-31)",
    "rahi-impact-aim": "Rahi Impact discontinued the modelled platform for migration from Nepal and pivoted, as Setuwelt, to the India-Germany corridor (https://charityentrepreneurship.com/track-record-charities/rahiimpact, checked 2026-10-31)",
    "high-impact-professionals-aim": "High Impact Professionals pivoted from supporting people who earn to give to helping professionals into high-impact careers (Impact Accelerator, Talent Directory); its pledge club is a small sideline (https://forum.effectivealtruism.org/posts/HGPSfH28Bh9ARvJqD/high-impact-professionals-2025-report)",
    "scale-welfare-aim": "Scale Welfare does not run the modelled water-quality programme on milkfish farms; its primary project is ice-slurry slaughter of tilapia in the Philippines (https://www.scalewelfare.org/our-work, checked 2026-10-31)",
    "center-for-alcohol-policy-solutions-aim": "no evidence that the Center for Alcohol Policy Solutions runs the modelled programme today: its site is dated 2021 and its only reported work (Sri Lanka, not sub-Saharan Africa) is from 2023 (https://alcoholpolicysolutions.center/, checked 2026-10-31)",
    "foundations-first-aim": "no evidence that a charity called Foundations First runs differentiated learning today: no website, report or AIM listing found (searched 2026-10-31)",
}

# Kept: the charity runs the modelled programme today (evidence), no actual-data model exists.
KEEP = {
    "alliance-for-reducing-microbial-resistance-aim": ("https://forum.effectivealtruism.org/posts/srjXGXhsecmZvpEdq/two-years-of-doing-advocacy-on-antimicrobial-resistance",
        "ARMoR advocates for antibiotic pull incentives, its key ask an EU subscription model (November 2025); AIM modelled the US PASTEUR Act."),
    "animal-policy-international-aim": ("https://www.animalpolicyinternational.org/",
        "Animal Policy International campaigns for import welfare standards in New Zealand (Stop Cruel Imports NZ), the UK and the EU."),
    "better-futures-guide-aim": ("https://betterfuturesguide.org/",
        "Better Futures Guide is setting up as a livelihoods charity evaluator; its first recommendations are planned before the end of 2026."),
    "better-season-project-aim": ("https://www.betterseasonproject.org/",
        "Better Season Project partners with Kenyan savings cooperatives to lend smallholders money for rainwater tanks secured on the tank (piloting)."),
    "cearch-aim": ("https://exploratory-altruism.org/",
        "CEARCH researches causes and recommends interventions (800 causes long-listed, 20 in depth), with grantmaking and advisory work built on that research."),
    "concentric-policies-aim": ("https://forum.effectivealtruism.org/posts/zdacfpQdQjfGNoavQ/marginal-funding-for-the-single-best-health-policy-in-the",
        "Concentric Policies advocates for tobacco taxes in Liberia and Guinea-Bissau (November 2024, with plans through 2025); AIM modelled Mongolia."),
    "first-embrace-aim": ("https://forum.effectivealtruism.org/posts/wGXCuedzsubqNDAca/introducing-first-embrace-an-ambitious-impact-incubated",
        "First Embrace runs hospital-embedded kangaroo care in Kano State, Nigeria (since February 2026); AIM modelled Pakistan."),
    "kaya-guides-aim": ("https://www.kayaguides.com/",
        "Kaya Guides runs WHO Step-by-Step guided self-help for depression in India over WhatsApp, with short weekly calls from lay guides."),
    "labri-aim": ("https://www.labrecyclinginitiative.com/post/q1-2026-newsletter",
        "LABRI advocates for regulating used lead-acid battery recycling, mainly in the Philippines (2026); AIM modelled Thailand."),
    "lead-research-for-action-aim": ("https://www.leadresearch.org/what-we-do",
        "Lead Research for Action runs studies of lead in consumer products in Malawi and Kenya; AIM modelled West Africa."),
    "learning-alliance-aim": ("https://www.learningalliance.net/",
        "Learning Alliance runs structured pedagogy (lesson plans, teacher training, coaching) in 72 schools in Iganga District, Uganda."),
    "neev-aim": ("https://neev.earth",
        "Neev trains brick kiln owners in India's brick belt in better firing practice to cut coal use and air pollution."),
    "novah-aim": ("https://novah.ngo",
        "Novah broadcasts radio drama to prevent intimate partner violence in Rwanda, under an RCT; AIM modelled radio and TV in Angola."),
    "opal-health-aim": ("https://opalhealthafrica.org",
        "Opal Health trains government health workers in Uganda to run participatory learning and action sessions for pregnant women; AIM modelled Sierra Leone."),
    "oxygen-access-project-aim": ("https://www.oxygenaccessproject.org",
        "Oxygen Access Project provides hospitals with oximeters, oxygen concentrators, maintenance and power (registered February 2025 for work in Nigeria)."),
    "respira-health-aim": ("https://respirahealth.org",
        "Respira Health runs an eight-week pulmonary rehabilitation programme for COPD over WhatsApp in India; AIM modelled an app partnership in Nepal."),
}

INV = ROOT / "inventory/ambitious-impact-models.json"


def main():
    inv = json.loads(INV.read_text())
    gone = set()
    for mid, why in REMOVE.items():
        p = DIR / f"{mid}.json"
        if p.exists():
            m = json.loads(p.read_text())
            gone.add(m["charity"])
            p.unlink()
        w = ROOT / "writeups" / f"{mid}.md"
        if w.exists() and w.read_text().startswith("<!-- generated"):
            w.unlink()
        for e in inv:
            if e.get("model_id") == mid:
                e["status"] = f"not shown: {why}"
    for mid, (url, quote) in KEEP.items():
        p = DIR / f"{mid}.json"
        m = json.loads(p.read_text())
        m["theoretical"] = {"reason": "Ambitious Impact's estimate of the idea, written before the charity existed; not based on the charity's own results.",
                            "runs": quote, "url": url, "checked": "2026-10-31"}
        p.write_text(json.dumps(m, indent=1, ensure_ascii=False) + "\n")
        for e in inv:
            if e.get("model_id") == mid:
                e["status"] = "imported"
                e["theoretical"] = f"purely theoretical (pre-founding estimate); the charity runs the programme today: {quote} {url}"
    INV.write_text(json.dumps(inv, indent=1, ensure_ascii=False) + "\n")
    # Charities with no model left: their record and generated write-up go too.
    used = set()
    for p in (ROOT / "models").rglob("*.json"):
        c = json.loads(p.read_text()).get("charity")
        if c:
            used.add(c)
    for c in sorted(gone - used):
        (ROOT / "charities" / f"{c}.json").unlink(missing_ok=True)
        print("removed charity", c)
    links = ROOT / "scripts/aim-links.json"
    cfg = json.loads(links.read_text())
    links.write_text(json.dumps({k: v for k, v in cfg.items() if k not in REMOVE}, indent=1, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
