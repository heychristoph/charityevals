---
name: charityevals
description: Open cost-effectiveness analyses for charities, re-ranked live by the visitor's own assumptions.
colors:
  paper: "#ffffff"
  paper-2: "#f6f7f9"
  ink: "#1d2433"
  ink-2: "#4a5468"
  ink-3: "#6b7486"
  rule: "#dfe3ea"
  rule-strong: "#c3c9d4"
  blue: "#2f5fb3"
  blue-ink: "#234a8f"
  blue-wash: "#eaf0fa"
  warn: "#8a6700"
  cause-global-health: "#2e7d5b"
  cause-animal-welfare: "#b0532a"
  cause-ai-safety: "#6a4bb3"
typography:
  display:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "clamp(30px, 3.4vw, 42px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "40px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\", \"lnum\""
  figure-row:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.2
    fontFeature: "\"tnum\", \"lnum\""
  dek:
    fontFamily: "Source Sans 3 Variable, -apple-system, Segoe UI, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Source Sans 3 Variable, -apple-system, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Source Sans 3 Variable, -apple-system, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  axis:
    fontFamily: "Source Sans 3 Variable, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.2
    fontFeature: "\"tnum\", \"lnum\""
rounded:
  hairline: "2px"
  panel: "3px"
  pill: "10px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
  s8: "72px"
components:
  text-link:
    textColor: "{colors.blue}"
  text-link-hover:
    textColor: "{colors.blue-ink}"
  link-button:
    textColor: "{colors.blue}"
    typography: "{typography.body}"
    padding: "0"
  link-button-disabled:
    textColor: "{colors.ink-3}"
  nav-link:
    textColor: "{colors.ink-2}"
    padding: "0 0 3px"
  nav-link-active:
    textColor: "{colors.ink}"
  tag-override:
    backgroundColor: "{colors.blue-wash}"
    textColor: "{colors.blue-ink}"
    rounded: "{rounded.pill}"
    padding: "3px 6px"
  tag-inherited:
    textColor: "{colors.ink-3}"
    rounded: "{rounded.pill}"
    padding: "3px 6px"
  assumptions-panel:
    backgroundColor: "{colors.paper-2}"
    rounded: "{rounded.panel}"
    padding: "{spacing.s5}"
    width: "340px"
  slider-thumb:
    backgroundColor: "{colors.paper}"
    size: "16px"
  ranking-row:
    backgroundColor: "{colors.paper}"
    padding: "{spacing.s4} 0"
  interval-dot:
    size: "14px"
  interval-dot-bottom-line:
    size: "18px"
  formula-block:
    backgroundColor: "{colors.paper}"
    padding: "{spacing.s2} {spacing.s3}"
---

# Design System: charityevals

## Overview

**Creative North Star: "The Research Ledger"**

charityevals plays the category standard straight: a research site at the Our World in Data / GiveWell craft bar, where the ranked comparison is the first thing on the page and every number sits one step from its source. White paper, near-black ink, hairline rules and a single interactive blue. Headings and bottom-line numbers are set in a serif; everything the visitor operates or scans (tables, labels, axes, controls) is set in a sans with tabular figures.

Density is that of a well-set report: a 1240px page, a reading measure of 68ch, a two-thirds/one-third split between the evidence and the assumptions that move it. Charts are interval strips on one fixed log scale, directly labelled, with light gridlines and notes and sources set beneath them. Colour carries meaning only: blue means "you can act on this", a cause ink means "this belongs to that cause", amber means "someone's judgment". Nothing is decorative.

The system rejects the marketing hero, feature grids, card mosaics and stat blocks. Results are shown as intervals, never as a lone big number.

**Key Characteristics:**
- White ground, near-black blue-grey ink, hairline rules instead of boxes.
- Source Serif 4 for headings and result figures; Source Sans 3 for UI, tables and prose; tabular lining numerals for every number.
- One blue for everything interactive.
- Cause inks used only for their cause; input kinds use ink and amber, never a cause ink.
- One shared log scale (0.1× to 10,000×) for every comparison strip.
- Motion only to show change: bars clip, dots translate, rows slide to their new rank.

## Colors

A cool, near-neutral paper-and-ink palette with one interactive blue, one judgment amber and three muted categorical cause inks.

### Primary
- **Ledger Blue** (blue): every interactive affordance: text links, link buttons, the slider thumb ring, the active nav underline, the focus ring, a changed assumption's value readout, and the "evals" half of the wordmark.
- **Pressed Ledger Blue** (blue-ink): link hover and the text of the "overridden" tag.
- **Blue Wash** (blue-wash): background of the "overridden" tag only.

### Secondary
- **Judgment Amber** (warn): sensitivity flag icons, the judgment kind mark and label, and references to shared assumptions inside formulas. It means "this rests on a value judgment or needs caution", never "click here".

### Tertiary (categorical cause inks)
- **Global Health Green** (cause-global-health), **Animal Welfare Rust** (cause-animal-welfare), **AI Safety Violet** (cause-ai-safety): set as a local `--cause` custom property on a row or page and used for that cause's interval dot, its bar (mixed 32% into white on strips, 45% on tornado bars), its cause label, its bottom-line figure and its MiniRanking name.

### Neutral
- **Paper** (paper): page ground, ranking rows, formula blocks, the slider thumb fill and the ring around interval dots.
- **Mist Paper** (paper-2): the assumptions panel, the footer, expanded table detail rows and inline code.
- **Ink** (ink): headings, body text, observed-kind marks, the output row's 2px rules and the tornado's dashed central line.
- **Slate** (ink-2): deks, explainers, secondary metadata, nav at rest and the hollow estimate-kind mark.
- **Pewter** (ink-3): axis ticks, rank numbers, the default-value tick on sliders, off-path rows, disabled link buttons. At 4.7:1 on paper it is the lightest ink allowed for text.
- **Hairline** (rule): row dividers, gridlines, panel border, header and footer rules.
- **Strong Hairline** (rule-strong): axis baselines, the 1× gridline, section rules in the model table, slider tracks.

### Named Rules
**The One Blue Rule.** Everything interactive is Ledger Blue and nothing else is. If it is blue, it can be clicked, dragged or focused; if it can be acted on, it is blue at rest or on hover.

**The Kind Is Not a Cause Rule.** Input kinds never borrow a cause ink: observed is a solid Ink dot, estimate is a hollow Slate ring, judgment is a solid Judgment Amber dot. Cause inks stay reserved for cause identity.

**The Cause Owns Its Ink Rule.** A cause ink appears only on elements that belong to that cause. It is never a general accent, heading colour or chart default.

## Typography

**Display Font:** Source Serif 4 Variable (with Georgia, serif)
**Body Font:** Source Sans 3 Variable (with -apple-system, Segoe UI, sans-serif)
**Label/Mono Font:** ui-monospace, SF Mono, Menlo for code and model file names only.

**Character:** A sober bookish serif for the claims and their numbers, a clear humanist sans for everything the visitor reads row by row or operates. The pairing reads as a published report, not a product page.

### Hierarchy
- **Display** (600, clamp(30px, 3.4vw, 42px), 1.2, balanced wrap): page titles, one per page.
- **Headline** (600, 26px, 1.2): section headings; the model page's bottom-line sentence runs at 22px weight 500.
- **Title** (600, 20px, 1.2): sub-sections; model-table section heads at 19px; charity names in the ranking at 18px.
- **Figure** (650, 40px, -0.02em; 34px under 760px): the bottom-line multiple on a model page, in the cause ink.
- **Row figure** (600, 20px serif, tabular): the central multiple at the end of each ranking row.
- **Dek** (400, 19px, 1.5, Slate, max 62ch): the one-sentence standfirst under a page title (18px on model pages).
- **Body** (400, 17px, 1.55; 16px under 640px; max 68ch): prose, explainers, table cells.
- **Label** (400, 14px, 1.45): notes, sources, footers, metadata, kind legends, MiniRanking.
- **Axis** (400, 13px, Pewter, tabular): tick labels on every strip and tornado; kind labels in tables use 13px weight 600.

### Named Rules
**The Tabular Figures Rule.** Every number that can be compared is set with tabular lining numerals so columns and readouts do not jitter as values change.

**The Sentence Case Rule.** Labels, legends and headings are sentence case at body weight or 600. No uppercase, no small caps, no tracked-out labels.

## Layout

A centred page column (1240px max, 24px side padding; 16px under 640px). Ranking and model pages use a two-column grid: the evidence in a flexible main column, the assumptions panel in a fixed 340px column, separated by 48px. Reading pages (assumptions, method) are a single column capped near 820px.

Spacing follows an eight-step scale (4, 8, 12, 16, 24, 32, 48, 72px). Ranking rows breathe at 16px top and bottom; section stacks on the model page are 48px apart; the footer sits 72px below content. Text never exceeds the 68ch measure.

Responsive behaviour:
- **Above 1000px:** the assumptions panel is sticky, scrolls within itself, and fades at its bottom edge to signal more content.
- **At 1000px and below:** the panel stacks under the chart and a sticky MiniRanking pins to its top, so the visitor sees the order change while dragging a slider.
- **At 760px and below:** ranking rows reflow to name and figure on one line, the strip full-width beneath, notes below that; the tornado drops to one column; the kind column hides.

### Named Rules
**The One Scale Rule.** Every comparison strip uses the same fixed log scale, 0.1× to 10,000× GiveDirectly, with ticks at each power of ten. A bar means the same length on every page. Out-of-range values are clamped and marked by a square end. Only the tornado, which compares inputs within one model, uses its own fitted domain.

**The Ranking First Rule.** On the ranking page, the ranked interval chart follows the title and dek directly. There is no hero above it.

## Elevation & Depth

The system is flat. Depth comes from tonal layering (Paper against Mist Paper) and hairline rules, not shadows. The only shadow-like values are functional: a 1px ring that outlines interval dots against their own bar, a faint drop under the WebKit slider thumb, and a translucent blurred backdrop on the sticky MiniRanking so rows scrolling beneath it stay legible.

### Shadow Vocabulary
- **Dot ring** (`box-shadow: 0 0 0 1px var(--cause)`): with a 2px (3px on the bottom line) Paper border, separates an interval's central dot from its bar.
- **Thumb lift** (`box-shadow: 0 1px 2px rgb(29 36 51 / 0.2)`): the slider thumb only.

### Named Rules
**The Hairline Over Box Rule.** Group with 1px rules and tonal grounds; don't add shadows or cards to separate content.

## Shapes

Corners are nearly square. The assumptions panel has a 3px radius; focus rings and inline code use 2px; inline tags are 10px pills. Interval bars are clipped with rounded ends (4px on ranking strips, 5px on the bottom-line strip, 2px on tornado bars), squared off on any end that has been clamped to the scale's limit. Dots and kind marks are circles. Rules are 1px; the model output row is the one place a 2px Ink rule is used.

## Components

### Links and link buttons
Quiet and unmistakable.
- **Text link:** Ledger Blue with a 1px underline at 35% blue, 0.18em offset; on hover Pressed Ledger Blue with a full-strength underline.
- **Link button:** every in-panel action (reset, copy link, expand all) is a borderless, backgroundless button in Ledger Blue, optionally led by a 14 to 16px line icon; underline on hover; Pewter when disabled.
- **Focus:** a 2px Ledger Blue outline at 2px offset on everything focusable.
- There are no filled buttons in the system.

### Navigation
Wordmark at left (serif 650, 21px, "charity" in Ink and "evals" in Ledger Blue), sans 15px links at right in Slate. Hover lifts to Ink; the current page is Ink with a 2px Ledger Blue underline. Header and footer are separated by hairlines; the footer sits on Mist Paper in 14px Slate.

### Tags
Small 12px pills next to model-table row names: "overridden" in Pressed Ledger Blue on Blue Wash, "inherited" in Pewter with a Hairline border.

### Assumptions panel
A Mist Paper column with a Hairline border and 3px radius. Groups are separated by hairlines with sentence-case legends. Each slider row: label and value readout on one line (readout turns Ledger Blue once changed), a 3px Strong Hairline track, a 16px Paper thumb ringed in 2px Ledger Blue, a 2px Pewter tick marking the default, min and max in Pewter beneath, and a per-row reset link button.

### Interval strip (signature)
The site's result unit. A horizontal track on the shared log scale with light vertical gridlines (the 1× line in Strong Hairline), a cause-tinted bar from joint low to joint high, and a cause-ink central dot ringed in Paper. Used in each ranking row (8px bar, 14px dot, 28px track) and as the model page's bottom line (10px bar, 18px dot, 40px track) beneath a serif sentence carrying the central multiple. The model page result is always this strip, never a stat block. Notes and sources sit beneath every chart in 14px Slate.

### Ranking row
Rank number in Pewter, serif charity name, cause label in its ink, the interval strip, the serif central figure with its low–high range, and a footer line with the native-unit value and an amber-iconed flag count linking to the model's flags. Rows are divided by hairlines, never boxed.

### MiniRanking
Below 1000px only: a sticky, one-line-per-charity list (rank, name in cause ink, multiple) pinned to the top of the assumptions panel on 94% Mist Paper with a 6px backdrop blur and a hairline beneath.

### Tornado chart
One row per input that moves the result: a label (with its kind mark) linking to the table row, a cause-tinted bar between the result at the input's low and high, a 1.5px dashed Ink line at the central result, and end values in Slate. A kind legend sits in the caption.

### Model table
Fixed-layout, zebra-free table with hairline row dividers and Strong Hairline section rules. Inputs are 600 weight, formulas Slate, off-path rows Pewter, the final output framed by 2px Ink rules. Rows expand via a chevron to a Mist Paper detail with explainer, source and a formula block (Paper, Hairline border) in which shared assumptions are named in Judgment Amber.

### Motion
State changes animate over 420ms with `cubic-bezier(0.16, 1, 0.3, 1)`: interval and tornado bars animate their clip-path, central dots move by transform on a full-width layer, and ranking rows slide to their new rank by a FLIP translate. Chevrons rotate 90° over 200ms. Reduced-motion preferences disable all of it.

## Do's and Don'ts

### Do:
- **Do** use Ledger Blue (blue) for every interactive element and for nothing that is not interactive.
- **Do** encode input kind as Ink (observed), a hollow Slate ring (estimate) and Judgment Amber (judgment).
- **Do** set a cause ink through a local `--cause` property and use it only on that cause's elements.
- **Do** plot every cross-charity comparison on the shared 0.1× to 10,000× log scale from `src/components/scale.ts`.
- **Do** show results as an interval with its central value, and put notes and sources beneath every chart.
- **Do** set numbers in tabular lining figures, result figures in Source Serif 4.
- **Do** animate bars with clip-path and dots and rows with transform, at 420ms on `cubic-bezier(0.16, 1, 0.3, 1)`, and respect reduced motion.
- **Do** separate content with 1px hairlines and Mist Paper grounds.

### Don't:
- **Don't** colour an input kind, flag or interactive element with a cause ink.
- **Don't** introduce a second interactive colour or a filled button.
- **Don't** give a chart its own scale when it compares charities; only within-model charts like the tornado fit their own domain.
- **Don't** present a result as a lone big number or stat block without its interval.
- **Don't** set labels in uppercase, small caps or tracked-out type.
- **Don't** put a hero, feature grid or card mosaic above or around the ranking.
- **Don't** use zebra striping in tables; rows are divided by hairlines.
- **Don't** set text lighter than Pewter (ink-3) on Paper.
