#!/usr/bin/env bash
# Re-imports GiveWell's top-charity models from their published spreadsheets.
#   scripts/import-givewell.sh <python-with-openpyxl>
# Each base column is the median location by GiveWell's final cost-effectiveness; every other
# location becomes a variant. Then run `npm run check` to prove the import.
set -euo pipefail
PY=${1:-python3}
cd "$(dirname "$0")/.."
TMP=$(mktemp -d)
PAGE="https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models"

run() { # file id name org sheet-id base-col website donate donate-via what title
  curl -sL "https://docs.google.com/spreadsheets/d/$5/export?format=xlsx" -o "$TMP/$1.xlsx"
  rm -f models/global-health/"$2".json models/global-health/"$2"-*.json
  "$PY" -I scripts/convert-givewell.py "$TMP/$1.xlsx" --id "$2" --name "$3" --org "$4" \
    --sheet-url "https://docs.google.com/spreadsheets/d/$5/edit" --page-url "$PAGE" \
    --title "${11}" --published 2026-09-01 --base-col "$6" \
    --website "$7" --donate "$8" ${9:+--donate-via "$9"} --what "${10}" --out models/global-health
}

run amf against-malaria-foundation "Against Malaria Foundation" "Against Malaria Foundation" \
  1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc J https://www.againstmalaria.com https://www.againstmalaria.com/donate.aspx "" \
  "Insecticide-treated bed nets, distributed in mass campaigns with partner governments." \
  "Against Malaria Foundation cost-effectiveness analysis (September 2026)"
run mc malaria-consortium-smc "Malaria Consortium SMC" "Malaria Consortium" \
  1-wRh8CVwcCXWfvn4-n-A5owWG2LsbNuo0pGWLoqGd54 S https://www.malariaconsortium.org https://secure.givewell.org/ GiveWell \
  "Seasonal malaria chemoprevention: monthly antimalarial drugs for young children during the rainy season." \
  "Malaria Consortium seasonal malaria chemoprevention cost-effectiveness analysis (September 2026)"
run hki helen-keller-vas "Helen Keller Intl vitamin A" "Helen Keller Intl" \
  1L6D1mf8AMKoUHrN0gBGiJjtstic4RvqLZCxXZ99kdnA AN https://helenkellerintl.org https://secure.givewell.org/ GiveWell \
  "Vitamin A supplements for children aged 6–59 months, twice a year." \
  "Helen Keller Intl vitamin A supplementation cost-effectiveness analysis (September 2026)"
run ni new-incentives "New Incentives" "New Incentives" \
  1mTKQuZRyVMie-K_KUppeCq7eBbXX15Of3jV7uo3z-PM V https://www.newincentives.org https://www.newincentives.org/donate "" \
  "Small cash incentives for caregivers who bring infants for routine vaccinations in northern Nigeria." \
  "New Incentives cost-effectiveness analysis (September 2026)"
