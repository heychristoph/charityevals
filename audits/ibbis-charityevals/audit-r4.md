# Audit: ibbis-charityevals, round 4
Result: 0.008900 daly/$ = 8.90 years of healthy life per 1,000 dollars (combined range 0.33–244). Verdict: pass.
Model-sha: 6666290fa7aa2df57100f93b6796c743523deba5c7ba946bf485a99f0c9cd204
Scope: scoped verification of credit step 5 (rule 2.24): `bio_attribution_share_shared` 0.75 (0.5 to 0.95) -> 0.8 (0.55 to 0.95), the branch classes, and `fb_credit_share`. No other part re-audited. Preflight passes; headline at mobiliser_share 100% is 8.90 (was 8.34, exactly x 0.8/0.75).

| Row | Check | Result |
|---|---|---|
| bio_attribution_share_shared | 1 co-advocates only | OK. Named: consortium members' time, Microsoft-led study, NIST test sets, workshop co-hosts. The adopters' part of member time is taken out. No co-advocate of the old text is dropped; no enforcer or complier is in it. |
| | 2 factual claims | DSSC "around 30 experts" and SBRC "more than 60" hold (2025 Annual Letter); Microsoft partnership on the Science study, NIST test sets (monthly, 15+ evaluations) and NTI grant $38,343 (r1) hold. Not checkable from the cited sources: Twist and IDT in the study, and the three named workshop co-hosts. SBRC is "financially self-sustaining" per the letter (members' funding, not a cost to IBBIS). |
| | 3 value and range | Arithmetic: 90 experts x 2 to 5% x $250,000 = $0.45M to $1.1M (text: $0.5M to $1.1M, fine). Co-advocate part = two thirds = $0.33M to $0.75M; IBBIS $2.3M / ($2.3M + that) = 0.87 to 0.76 before Microsoft, NIST, co-hosts and fellows, which the text does not price. 0.8 with 0.55 to 0.95 is a defensible best guess; the split is fair in direction. Without the split the same arithmetic gives 0.82 to 0.68 (mid 0.75, the old value), so the split moves the share by about 0.05. |
| classes | 4 | ai/bio/nuclear/fb "research" is right (IBBIS's outputs are taken up by providers, regulators and labs); pol "win" is right for the template. Each used share is shared x mobiliser_share and enters `attribution_share` once (weighted by w_branch); nothing else reads mobiliser_share. |
| fb_credit_share | unused | fb_people is 0; default 1 (0.5 to 1) and text agree with the skeleton and name the mobiliser's share as covering employers. No effect. |
| p_success, counterfactual_adj | 5 | Not touched. The share counts contributions (Microsoft, NIST, members); `bio_counterfactual_adj` 0.7 counts what others would have built instead. NIST appears in both in different roles (contributor vs substitute). No loss or double count. |
| text | 6 | Model summary quotes no share. The write-up carried the old 0.75 and figures derived from the old result: corrected (below). |

Findings (all low, builder's to fix; none re-opens the round):
1. (low) The explainer names Twist and IDT and the three workshop co-hosts with no source on the row; neither is in the cited letter. Fix: add the Science paper / IBBIS news page for the study and the workshop pages to the row's sources, or drop the names.
2. (low) The 2 to 5% of a year per expert has no anchor. Fix: say it is our judgment (the letter gives only member counts), or anchor to the consortia's meeting cadence if IBBIS publishes it.
3. (low) The "third" for adoption time is judgment, and the member time counted (writing standards) is mostly not adoption, which happens at providers' own cost outside the consortia. Direction is right and the effect is about 0.05. Fix: state in the explainer that it is a judgment, not derived.

Edits to writeups/ibbis-charityevals.md (typed numbers stale after the change): table share 0.75 -> 0.8; plausible range "0.4 to about 160" -> "0.3 to about 240" (combined range 0.33 to 244); discount 0.1% "about 115" -> "about 120" (tornado 122.6); years slider "1.8 to 25" -> "1.9 to 27"; pandemic cut "about 4 to 49" -> "about 4.5 to 52"; next dollar "3.6 to 13" -> "3.9 to 14".

Sources checked: IBBIS 2025 Annual Letter (PDF, fetched), Manifund project page (fewer than 10 people full-time on outreach: holds), ibbis.bio global map and search pages (no Tianjin or Twist hits; the Science paper page did not load), docs/normalization.md 2.24.

Verdict: pass (no high or medium findings).
