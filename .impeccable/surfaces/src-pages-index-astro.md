---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/models"]
---

Scope: whole site v0 (directory/ranking at /, model pages at /models/<id>, assumptions panel shared). Mode: Operate (with Read for explainers).
Audience/job: EA-aligned donors comparing charities and testing how rankings depend on their own values.
Constraints: static Astro + React islands; every number traceable; no endorsements implied.

## Direction contract

THESIS: The category standard, played straight: an Our World in Data / GiveWell-grade research site where the ranked comparison is the first thing on the page. Refuses the marketing hero, feature grids and card mosaics.

OWN-WORLD: White ground, near-black ink, one blue for everything interactive, muted categorical ink per cause (health, animals, AI safety) used only for that cause. Source Serif 4 for headings and the bottom-line numbers, Source Sans 3 for UI and tables, tabular figures. Hairline rules, tables with zebra-free rows, small caps-free uppercase-free labels; charts with direct labels, light gridlines, notes and sources under every chart.

STORY: The visitor sees which charities rank highest per dollar under the default assumptions, sees the interval and flags beside each, moves one assumption, watches the order change, opens a charity and finds which inputs carry its result and where each comes from.

FIRST VIEWPORT: Left two-thirds: title, one-sentence dek, then the ranked interval chart (log scale, × GiveDirectly, joint low–high bar with central dot, cause colour, flags count). Right third: sticky assumptions panel with the cross-cause exchange rates first, sliders with value readout and reset. No hero.

FORM: Category standard (canon), not on my seven-candidate list; seed key b2ed837d.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
