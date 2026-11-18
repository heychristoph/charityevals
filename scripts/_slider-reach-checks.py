"""Rule slider-reach-checks: the checks that would have caught the slider-reach gaps fixed by species-step-2026,
amf-drc-output-route, later-benefits-discount(-2) and side-effect-tags-imports (src/engine/invariants.ts):
INV-3 also requires the Rethink Priorities switch on days built from SADs, INV-9c requires later-years benefits to
move with the discount rate, INV-24 requires side-effect rows to be tagged. Checks only: no model changes, so this
script does nothing; rule-change.ts releases the rules and moves the receipts it leaves current.

    python3 scripts/_slider-reach-checks.py
"""
print("checks only: no model changes")
