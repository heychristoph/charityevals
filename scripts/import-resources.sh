#!/usr/bin/env bash
# Refreshes every imported model's `resources` from its evaluator's review page.
#   scripts/import-resources.sh [python]
set -euo pipefail
PY=${1:-python3}
cd "$(dirname "$0")/.."
GW_MODELS='https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models'
GW_WEIGHTS='https://docs.google.com/spreadsheets/d/1IXCpVlrAggTdt94ETR4KbQxcKkDYC13bFgEHbBBilb8/edit'

core() { # review-url sheet-url evaluator
  "$PY" -c 'import json,sys
rev,sheet,ev=sys.argv[1:4]
c=[{"title":f"{ev} charity review","url":rev,"type":"evaluation","note":"The full evaluation."}]
if sheet: c.append({"title":f"{ev}’s cost-effectiveness spreadsheet","url":sheet,"type":"model","note":"The model this page reproduces."})
if ev=="GiveWell":
  c+= [{"title":"GiveWell’s cost-effectiveness models","url":sys.argv[4],"type":"evaluation"},
       {"title":"GiveWell’s moral weights","url":sys.argv[5],"type":"model","note":"How GiveWell values deaths averted against income gains."}]
print(json.dumps(c))' "$1" "$2" "$3" "$GW_MODELS" "$GW_WEIGHTS"
}

for f in models/*/*.json; do
  read -r kind publisher rev sheet < <("$PY" -c 'import json,sys; d=json.load(open(sys.argv[1])); s=d.get("source") or {}
print(d["kind"], (s.get("publisher") or "-").replace(" ","_"), s.get("url","-"), s.get("sheet","") or "-")' "$f")
  [ "$kind" = charity ] || continue
  case "$publisher" in
    GiveWell) id=$(basename "$f" .json)
      case "$id" in
        against-malaria-foundation) rev=https://www.givewell.org/charities/amf ;;
        malaria-consortium-smc) rev=https://www.givewell.org/charities/malaria-consortium ;;
        helen-keller-vas) rev=https://www.givewell.org/charities/helen-keller-international ;;
        new-incentives) rev=https://www.givewell.org/charities/new-incentives ;;
        givedirectly) rev=https://www.givewell.org/charities/give-directly ;;
      esac
      ev=GiveWell ;;
    Animal_Charity_Evaluators) ev=ACE ;;
    *) continue ;;
  esac
  [ "$sheet" = - ] && sheet=""
  "$PY" -I scripts/collect-resources.py "$rev" "$f" "$(core "$rev" "$sheet" "$ev")"
done
