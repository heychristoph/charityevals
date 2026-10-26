# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro with React islands, static build (Cloudflare Pages or Vercel). Per-charity pages are static HTML; the assumption controls, tables and charts that recompute are React islands. The engine (`src/engine/`) is plain TypeScript shared by the site and the CLI checks.

## Users

Primary: EA-aligned donors deciding where to give. They want to see why a charity ranks where it does, which numbers carry the result, and how the ranking changes under their own values (moral weights, exchange rates between causes). They read carefully but are not economists.

Secondary, not designed for first: grantmakers and analysts auditing inputs; researchers building or critiquing CEAs who fork models.

## Product Purpose

charityevals.org publishes open cost-effectiveness analyses (CEAs) for charities, as JSON models in git. Each model reproduces a published evaluator's numbers (GiveWell, ACE) or builds new ones where no evaluator exists (AI safety, more animal welfare). Visitors change shared assumptions and see every model recompute. Success: a donor can trace any ranking back to the two or three inputs that decide it and set them to what they believe.

## Positioning

Every number is inspectable: each input has a source, a low/best/high range, a kind (observed, estimate, judgment) and a plain-language explainer, and the visitor's own assumptions re-rank everything. Evaluators publish spreadsheets; this makes them readable, comparable across causes, and forkable.

## Operating Context

- Models live in `models/<cause>/<id>.json`; shared moral weights and cause exchange rates in `assumptions/default.json`.
- Models can inherit from another model and override rows (`extends`), e.g. GiveDirectly Malawi from Kenya.
- `npm run check` proves an import reproduces the source's own figures (`expected`).
- An `import-cea` Claude skill turns a published sheet into a model.
- No accounts. User assumptions live in URL params and localStorage, so a set of assumptions is shareable as a link.

## Capabilities and Constraints

- No Monte Carlo. Each result shows central, joint low and joint high, plus a one-at-a-time tornado. Rankings are "typical case", not expected value.
- Units are native per cause (GiveWell units of value, suffering-adjusted days). Cross-cause comparison happens only through visible, user-set exchange rates.
- Sensitivity flags: spread over 100×, share of uncertainty from judgment, inputs without ranges, stale sources (over 18 months), assumptions that flip the ranking.
- Prefer "unmodelled" over forcing a model to fit.
- Undecided: licensing of ACE-derived data; AI safety templates; feedback channel.

## Brand Commitments

Name: charityevals (domain charityevals.org). Voice: rigorous, calm, transparent; plain words over jargon; never overclaim precision.

## Evidence on Hand

- Models: GiveDirectly Kenya and Malawi (GiveWell, Nov 2024), Sinergia Animal (ACE, 2025). All reproduce their sources' figures exactly.
- No testimonials, users, partners or endorsements exist. Do not imply any. Do not imply GiveWell or ACE endorse this site.

## Product Principles

1. Show the lever, not just the number: the inputs that decide a result are always one step away.
2. Uncertainty is first-class: intervals and flags sit next to every point estimate, never in a footnote.
3. Values are the visitor's: moral weights and exchange rates are visible, adjustable, and labelled as judgments.
4. Faithful before clever: imported models match their source; disagreements are explained, not hidden.
5. Everything has provenance: no number without a source or a reason.

## Visual Commitment

The visitor chose the category standard over a distinctive world (2026-10-26): a research-site look, executed straight. Sit alongside Our World in Data and GiveWell; their craft level is the bar. No novelty theming.
