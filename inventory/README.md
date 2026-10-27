# Inventory of public evaluator models (work in progress, 2026-10-27)

- `givewell-sheets.json`: every spreadsheet linked from GiveWell's 282 grant pages (506 sheets), with recipients and a category: `model` (167), `annual` (26 multi-charity yearly CEAs), `archive` (14), `supporting` (299: cost-per-X, RFMF, budgets, inputs).
- `givewell-conversion.json`: `scripts/convert-sheet.py` run over each `model` sheet: bottom-line cell, value, rows, cells kept as fixed numbers.
- `ace-review-links.json`: sheets and Guesstimate models linked from ACE's 58 live review pages (2014–2023). 34 of 38 Guesstimate models now return 401 (private) and aren't archived. 2019 and 2022–23 sheets are outcome tables and 1–7 scores, not per-dollar estimates.
- `hli-reports.json`: sheets linked from HLI's 63 reports. Public HLI models: StrongMinds/Friendship Bench, AMF, GiveDirectly (imported), Pure Earth Ghana (current + pre-correction), Pure Earth Bangladesh spices, Shamiri. No public sheet: Fortify Health, Taimaka, ACTRA, NEPi, deworming.

Still to do: bottom-line overrides for ~20 GiveWell sheets, dedupe copies, charity records, import, write-ups, client-bundle split (imports total 17 MB).
