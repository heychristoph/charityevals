# Audit: refugees-international-charityevals, round 4 (verification)
Result: 2.642e-4 uov/$ = 0.132 years of healthy life per 1,000 dollars (combined range 0.0159–1.10); cause median 0.0866 (×1.53). Verdict: pass.
Model-sha: 6ee446bac7bc0981695c1b5740cbddb9761ec6ceeb9e98e127202ab6128a9b9f
Scope: verification of the two changes since round 3 (the model diff from commit 881e847 to HEAD): acc_evidence_adj and the beneficiaries. Nothing else changed.
Mechanical: audit-model's lint shows 0 high / 0 medium / 1 low (the same spread finding, stated in the summary), no new finding; beneficiaries sum to 1.00.
Previous round:
1. acc_evidence_adj (L1): **resolved**. Formula 1, no kind or range, with a reason naming sdn_response_vs_average (diversion and access problems already in), the shared figure for the dollar, and the missing-data step (Convention 5). The result moved from 0.130 to 0.132 (+1.7%, as r3 predicted); the summary's "about 0.13", the range "0.02-1.1", "about one and a half times the median" (×1.53) and the position between MSF's (0.065) and Save the Children's (0.42) all still hold.
2. Beneficiaries (L2): **resolved**. HTI 0.42, SDN 0.20, TCD 0.03, CRI 0.05, UKR 0.08, PSE 0.08, USA 0.10, UGA 0.04, exactly as r3 proposed; they follow the branch shares (Haiti 42%, Sudan funding 20%, access 3%, Costa Rica 5%, other campaigns 30%) and the beneficiaries_note and the write-up's "two fifths / a quarter / a twentieth" still match.

No new finding.

## Sources checked
No source changed since round 3; none refetched.

Verdict: pass (0 high; 0 medium; 0 low).
Model-sha: 6ee446bac7bc0981695c1b5740cbddb9761ec6ceeb9e98e127202ab6128a9b9f
