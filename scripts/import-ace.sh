#!/usr/bin/env bash
# Re-imports Animal Charity Evaluators' cost-effectiveness sheets for its recommended charities.
#   scripts/import-ace.sh [python]
# Sinergia Animal is hand-built (models/animal-welfare/sinergia-animal.json) and Good Food Fund is
# modelled from ACE's review text; neither is regenerated here.
set -euo pipefail
PY=${1:-python3}
cd "$(dirname "$0")/.."
TMP=$(mktemp -d)
R=https://animalcharityevaluators.org/charity-review
run() { # id name review-slug sheet-id published website what [extra converter args...]
  local id=$1 name=$2 rev=$3 sheet=$4 pub=$5 site=$6 what=$7; shift 7
  curl -sL "https://docs.google.com/spreadsheets/d/$sheet/export?format=xlsx" -o "$TMP/$id.xlsx"
  "$PY" -I scripts/convert-ace.py "$TMP/$id.xlsx" --id "$id" --name "$name" --review "$R/$rev/" \
    --sheet-url "https://docs.google.com/spreadsheets/d/$sheet/edit" --published "$pub" \
    ${site:+--website "$site"} --donate "https://animalcharityevaluators.org/donate/$id/" --donate-via ACE \
    --what "$what" --out models/animal-welfare "$@"
}
run the-humane-league "The Humane League" the-humane-league 1vM9Ah8mTob9h_Wkw5aqG_GoaaF8bRK1gWlgsGysJxos 2025-11-04 https://thehumaneleague.org \
  "Holds food companies to their cage-free and broiler welfare pledges in the US, Europe and globally."
run shrimp-welfare-project "Shrimp Welfare Project" shrimp-welfare-project 1ZMSPjCga107ObiFOG1y7PlHeM_7r60b95wgGuRRUDiE 2025-11-04 https://www.shrimpwelfareproject.org \
  "Gets shrimp producers to stun shrimp before slaughter, and works with farms on welfare improvements."
run animal-welfare-observatory "Animal Welfare Observatory" animal-welfare-observatory 1CAcmf4dXPk9tNWit25C7A7GJqEGNtnN-unXKZoyzvx4 2025-11-04 https://observatoriobienestaranimal.org \
  "Campaigns in Spain for corporate cage-free and European Chicken Commitment pledges."
run sociedade-vegetariana-brasileira "Sociedade Vegetariana Brasileira" sociedade-vegetariana-brasileira-svb 1wIFA3Fo9bgXn9Fc7nTT7ia_WpRNQBcneDrH-bXUhPyk 2025-11-04 https://svb.org.br \
  "Works with Brazilian schools and public institutions to replace some meat meals with plant-based ones."
run dansk-vegetarisk-forening "Dansk Vegetarisk Forening" dansk-vegetarisk-forening 1opvB9PLqI8DQJkdwilu64EJAGRHKzGy0aYABdnykpMw 2024-11-12 https://vegetarisk.dk \
  "Trains chefs and influences Danish public funding towards plant-based food."
run aquatic-life-institute "Aquatic Life Institute" aquatic-life-institute 113VWopanUvFiSS9KO3ruj4W8d77MUg0b2IlsVg-hr7M 2024-11-12 https://ali.fish \
  "Pushes companies, certifiers and policymakers to adopt welfare standards for farmed fish."
run ciftlik-hayvanlarini-koruma-dernegi "Çiftlik Hayvanlarını Koruma Derneği" ciftlik-hayvanlarini-koruma-dernegi 1pbZhUGFsU-xjCKggOOoSbgm3vFYBS562PxsWsBqZdw0 2024-11-12 "" \
  "Campaigns for cage-free egg commitments from companies in Turkey."
run wild-animal-initiative "Wild Animal Initiative" wild-animal-initiative 114nMuoeHSKWZslT7tQmxAR2jRoXMWoUBhb_swHx5QcY 2025-11-04 https://www.wildanimalinitiative.org \
  "Funds and runs academic research on the welfare of wild animals, and builds the field around it." \
  --tabs "Grants Program" "Outreach Program" "Research Program" --metric paperspublishedper --unit paper --unit-label "Peer-reviewed papers" --per 1000000
