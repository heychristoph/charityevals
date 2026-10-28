# SEO audit, October 2026

Audit of charityevals.org: the build of `feat/evaluator-imports` (559 HTML pages, ~160 imported models) served
locally, plus the live site (which still runs `main`). Method: the claude-seo audit checklist (technical,
on-page, schema, sitemap, performance, AI-search readiness, images, content), run inline with a static
crawler over `dist/` (every page), `curl` against the live site, and Lighthouse 12 on three representative
pages. No paid APIs, no Search Console data (the property isn't connected), so nothing here is field data.

Scope of the fixes: structure only (metadata, structured data, crawlability, internal-link targets,
performance, semantics). No page copy was rewritten; content recommendations are listed at the end.

## Scores

Weights from the audit skill. "Before" is `feat/evaluator-imports` as built; "after" is this branch.
Scores are judgments against the checklist, the numbers under them are measured.

| Category (weight) | Before | After | Main reasons |
|---|---|---|---|
| Technical SEO (22%) | 60 | 85 | Every internal link 307-redirected; history pages in the sitemap; no lastmod. Fixed. www and http duplicates remain (Cloudflare settings). |
| Content quality (23%) | 70 | 70 | Strong provenance, method and publisher pages. Many near-identical variant pages and no cause or evaluator hubs. Not changed (copy). |
| On-page SEO (20%) | 62 | 88 | 319 titles over 60 characters, 75 pages sharing a description, 110 descriptions under 70 characters. |
| Schema (10%) | 0 | 85 | No structured data at all. Now WebSite, Organization, WebPage, NGO, Dataset, BreadcrumbList. |
| Performance (10%) | 40 | 60 | Up to 5 MB of HTML per page (38.5 MB of the site's 60 MB HTML was island props); 1.3 to 1.5 s TBT. |
| AI search readiness (10%) | 65 | 85 | Server-rendered numbers and open robots.txt, but no llms.txt; figures only in islands. |
| Images (5%) | 90 | 90 | All images have alt text; one OG image for every page. |
| **Overall** | **57** | **80** | |

## What was found

### Critical / high

1. **Every internal link went through a redirect.** Pages were built as `about/index.html`. Cloudflare's
   static assets serve those at `/about/` and answer `/about` with a **307 (temporary)** redirect. All
   16,384 internal links in the build point at the unslashed form (`/about`, `/givedirectly`), while the
   canonicals and sitemap named the slashed form. Crawl budget spent on redirects, and the link equity of
   every internal link passed through a temporary redirect. Verified on the live site:
   `curl -I https://charityevals.org/about` returns `307 location: /about/`.
2. **No structured data.** Not one JSON-LD block on any page.
3. **Titles and descriptions not built for search.** 319 of 559 titles were over 60 characters (bulk
   model names such as "In-line Chlorination CEA (Evidence Action, India), 2023 (GW)"); 75 pages shared
   a description with at least one other ("The same GiveWell model with its Chad column." on three pages;
   the site default on four); 183 descriptions were over 160 characters and 110 under 70. The home page
   title was the bare brand, "charityevals". Descriptions never said what the page's result is.
4. **Island props made model pages huge.** A bulk model's page passed the full model file to its island
   as a prop, which Astro serialises into the HTML: the largest page was 5.0 MB (4.96 MB of it props),
   three more over 1.6 MB. Across the site, 38.5 MB of the 60 MB of HTML was serialised props. Lighthouse
   (mobile, local, uncompressed) put that page's FCP at 26 s.
5. **www and http are not redirected** (live): `http://charityevals.org/`, `http://www.charityevals.org/`
   and `https://www.charityevals.org/` all answer 200 with the same pages. Canonicals now point every
   variant at `https://charityevals.org/...`, which contains the damage, but the redirect belongs in
   Cloudflare (see recommendations). Not changed here: it's a zone setting, not code.

### Medium

6. **History pages indexed and in the sitemap.** 275 of the 558 sitemap URLs were `/history` pages:
   version tables rebuilt from git, with little to search for, and half the crawl budget.
7. **No `lastmod`** in the sitemap.
8. **No llms.txt.** The site's best content for AI answers (each charity's result, evaluator and range)
   only exists inside React islands.
9. **Main-thread work.** Lighthouse TBT 1.3 to 1.5 s on home and charity pages. Every island that shows
   the rankings (the rankings themselves, the side panel's mini ranking, a model page's rank) computed
   the full rankings, with sensitivity for every model, separately.
10. **Fonts not preloaded**, and Lighthouse attributes the charity pages' CLS (0.15 to 0.18 on mobile) to
    web fonts arriving late.
11. **No long-lived caching for hashed assets**: `/_astro/*` was served `max-age=0, must-revalidate`.
12. **The 404 page was indexable** (it has the right status, but no noindex), and `/models/*.json` data
    files had nothing to keep them out of the index.

### Low / checked and fine

- `lang="en"`, one `<h1>` per page, no skipped heading levels, `<main>` and labelled `<nav>` landmarks on
  every page; all images have alt text; viewport meta; HTTPS with Brotli; 404s answer 404.
- robots.txt allowed everything and named the sitemap; AI crawlers are not blocked.
- Colour contrast (accessibility, not SEO): `--ink-3` (#6b7486) on `--paper-2` (#f6f7f9) is 4.38:1, just
  under 4.5:1 for 14px text. A design-token decision, left for DESIGN.md.
- No security headers (HSTS, `X-Content-Type-Options`, `Referrer-Policy`). Not a ranking factor; listed
  under recommendations.

## What changed

| Area | Change |
|---|---|
| URLs | `build.format: "file"` and `trailingSlash: "never"`: `/about` is `about.html`, served directly; `/about/` now redirects to `/about`. Canonicals, `og:url` and the sitemap use the unslashed form that every link already used. No link had to change. |
| Titles | Charity pages: "<Charity>: cost-effectiveness (<evaluator>)"; other models: "<model>: <evaluator> model", or the short evaluator code when that would run long. Home: "charityevals: open charity cost-effectiveness analyses". Method and assumptions pages titled after their headings. |
| Descriptions | Generated per model page from its data: the model's own default-assumption result in the page's words ("5.7× as much good per dollar as GiveDirectly on default assumptions"), whose model it is and when it was published, then the charity's one-line summary and a short closing clause where they fit in 160 characters. Method and assumptions descriptions are their own opening sentences. |
| Social | `twitter:title` and `twitter:description`, `og:locale`, `og:image:alt`. Still the one OG image (`public/og.png`); per-page images were not worth the build time. |
| JSON-LD | One `@graph` per page. Every page: `WebSite` and `Organization` (charityevals, with founder, email and the GitHub repo as `sameAs`). Model pages add `WebPage`, the charity as `NGO` (name, its own website as `url` and `sameAs`), the model as a `Dataset` (created and published by charityevals, `isBasedOn` the evaluator's analysis and spreadsheet with the evaluator as author, the source's licence where it is CC BY-NC-SA, the model's JSON on GitHub as a `DataDownload`), and a `BreadcrumbList` (Rankings, charity, model). No ratings, reviews or aggregate scores. The evaluator is credited as the author of the source, not of the dataset: the site re-implements their work and must not imply they made or endorse it. |
| Indexing | History pages and the 404 page: `noindex, follow`. `/models/*.json`: `X-Robots-Tag: noindex` (via `public/_headers`). robots.txt disallows `/api/`. |
| Sitemap | History pages left out (558 → about 285 URLs). `lastmod` for charity and model pages from git: the newest commit to the page's model file (and the files it extends), its write-up and its charity file. Shared assumption changes are left out on purpose: they move every page's figures at once and would give all pages the same date. |
| llms.txt | `/llms.txt`, generated at build: what the site is and isn't (no endorsement), the key pages, every charity with its result and evaluators, and every other model page. |
| Performance | (1) Bulk model pages no longer serialise the model into the HTML. A custom `client:model` directive fetches `/models/<id>.json` (which already existed for the evaluator switch) in parallel with the island's code and hydrates once both arrive, so the island renders from exactly the data the server used and hydration matches. If the file can't load, the page stays as server-rendered. (2) The rankings are computed once per assumption change and shared by every island, instead of once per island. (3) The two latin variable fonts are preloaded. (4) `/_astro/*` gets `Cache-Control: public, max-age=31536000, immutable`. |

### Measured, before and after

Static crawl of every built page (same data, before = `feat/evaluator-imports`, after = this branch):

| | Before | After |
|---|---|---|
| HTML pages | 559 | 559 |
| Internal links answered by a redirect | 16,384 of 16,384 (307) | 0 |
| Total HTML | 59.9 MB (7.5 MB gzip) | 23.4 MB (4.9 MB gzip) |
| Of which serialised island props | 38.5 MB | 0.3 MB |
| Largest page | 5.0 MB (`/evidence-action/evidence-action-in-line-chlorination-india-2023`) | 378 KB (`/assumptions`, unchanged) |
| That bulk model page | 5.0 MB | 60 KB, plus its 300 KB-gzip JSON fetched in parallel with the island code |
| Pages with JSON-LD | 0 | 559 (275 with WebPage, NGO, Dataset, BreadcrumbList); all parse, every `@id` reference resolves |
| Duplicate descriptions | 75 pages in 32 groups | 4 pages in 2 groups: the home and 404 pages (site default), and two copies of the same Malaria Consortium model |
| Model page descriptions over 160 / under 70 characters | 183 / 110 (site-wide) | 0 / 0 |
| Titles over 60 characters | 319 of 559 | 50 of the 284 indexable pages (model names that are long by themselves; still unique) |
| Duplicate titles | 0 | 0 |
| Sitemap URLs | 558, 275 of them history pages, no lastmod | 283, no history pages, 275 with lastmod |
| noindex pages | 0 | 276 (275 history pages and the 404 page) |
| llms.txt | none | 45 KB, 71 charities and 204 further model pages |
| Production build time (this machine) | 32 min | 10 to 17 min (the shared rankings cache also applies at build time) |
| Main client chunk | 2.65 MB (349 KB gzip) | unchanged; see recommendations |

Lighthouse 12, mobile emulation, both builds served by `wrangler dev` (Cloudflare's own static-asset
handling, with compression), two runs each, ranges shown. Lab data, and noisy at this level:

| Page | Before | After |
|---|---|---|
| Home | perf 80 to 84, TBT 620 to 870 ms, LCP 1.1 to 1.2 s, CLS 0.01 | perf 76 to 81, TBT 750 to 1,170 ms, LCP 1.8 to 1.9 s, CLS 0 |
| `/against-malaria-foundation` | perf 73 to 75, TBT 790 to 810 ms, LCP 1.1 to 1.2 s, CLS 0.14 to 0.18 | perf 85 to 86, TBT 550 ms, LCP 1.8 s, CLS 0 |
| Largest bulk model page | perf 60, TBT 2,390 ms, FCP 2.4 s, CLS 0.15, 876 KiB | perf 72, TBT 2,000 ms, FCP 0.9 s, CLS 0, 846 KiB |
| SEO category, all three | 100 | 100 |

Font preloading removes the layout shift (Lighthouse blamed the web fonts) and costs about 0.6 s of
LCP in this lab setup, because the swap to the web font now happens while the page is measured. Both
stay inside "good" (LCP under 2.5 s, CLS under 0.1); before, CLS on charity pages was "needs
improvement". If field data later shows LCP suffering, drop the serif preload first. The home page's
TBT is dominated by evaluating the 2.6 MB shared chunk, which this branch does not change.

## Recommendations not implemented

### Needs a Cloudflare setting (not code)

1. **Redirect www to the apex and http to https** with 301s: a Redirect Rule for `www.charityevals.org/*`
   and "Always Use HTTPS". Then consider HSTS. Both are zone settings, out of scope here.
2. Add Search Console and Bing Webmaster Tools, submit `https://charityevals.org/sitemap-index.xml`, and
   watch the move from `/about/` to `/about` (Google will follow the new canonicals; the old slashed URLs
   now redirect to them).
3. The Worker's no-JavaScript suggestion flow redirects to `/suggest/?sent=1`, which now takes one more
   hop to `/suggest?sent=1`. Harmless, but `worker/index.ts` should point at `/suggest` (left alone:
   another branch is changing the Worker).

### Performance (needs product decisions or larger changes)

4. **The shared client chunk is 2.6 MB (350 KB gzip)**: every island imports `lib/data.ts`, so every page
   ships every model, with explainers, sources and resources the islands never show. Biggest remaining
   win: build a slimmer client library (rows, formulas, values and ranges only; text fetched per page), or
   ship precomputed default results and load the engine only when someone changes an assumption.
5. **Hydration cost**: TBT is still around a second on mobile. The side panel could hydrate on
   `client:idle` on pages where it sits below the fold, once the shared chunk is smaller (today it
   saves little because the chunk is shared).
6. The build takes about 30 minutes, almost all of it the history pages (each rebuilds the library at
   every commit). Caching per-commit results between pages would make every check of this kind cheaper.

### Content (deliberately not changed here)

7. **Cause hub pages** (`/global-health`, `/animal-welfare`, `/ai-safety`): the breadcrumb already names
   the cause but has nowhere to link. A short intro and the cause's ranking would target "most
   cost-effective global health charities" searches, and give the BreadcrumbList a middle level.
8. **Evaluator pages** (`/givewell`, `/ace`, `/hli`): what each evaluator measures and every model of
   theirs on the site. Good for "GiveWell cost-effectiveness spreadsheet" queries, which these pages
   answer better than the evaluators' own spreadsheets.
9. **Thin variant pages.** About 200 pages are country or program variants and older versions that share
   their parent's heading, summary and resources. Each needs a sentence on what is different (country,
   year, the inputs that change) near the top; otherwise consider `noindex` for superseded versions and
   keep the current model and its variants indexed.
10. **Charity summaries.** Charities without a `summary` get their description from the imported model's
    summary, which describes the import rather than the charity. One plain sentence per charity in
    `charities/*.json` would improve the dek, the description and the `NGO` node at once.
11. **Answer-first passages for AI search.** Each charity page could open with one self-contained
    sentence that states the result, the range and the evaluator ("On GiveWell's model and default
    assumptions, AMF does about 5.7× as much good per dollar as GiveDirectly; plausible range ...").
    Today that sentence only exists in the island's markup and the meta description.
12. **A per-charity social image** with the charity's name and result would make shared links clearer.
    The build can draw it with the same scale as the rankings; skipped here because it adds hundreds of
    images to an already long build.
13. **Comparison content.** "AMF vs GiveDirectly" style pages are a natural fit for a site whose unit is
    "× GiveDirectly", but they are editorial work.
