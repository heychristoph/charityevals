# Visitor analytics

What visitors do on the site, collected by our own Worker into Cloudflare Workers Analytics Engine. No
third-party scripts, no cookies, no IP addresses, no free text. What visitors are told is on
[the privacy page](../src/pages/privacy.astro); this is the owner's side.

## How it works

- `src/lib/analytics.ts` sends events with `navigator.sendBeacon` to `POST /api/event`.
- `worker/index.ts` drops crawlers and cross-site requests, and `worker/events.ts` turns the body into one
  data point through an allow-list (unknown events dropped, every field cut to a short token, query
  strings removed from paths). It writes to the `EVENTS` binding, dataset `charityevals_events`
  (`wrangler.jsonc`). The dataset is created on the first write after deploy.
- `src/components/Consent.astro` is the bar at the bottom of the page and the footer's "Privacy settings".

Two tiers, chosen by the visitor:

| | Before choosing | Accepted | Declined, or GPC / Do Not Track |
| --- | --- | --- | --- |
| Events sent | yes | yes | none |
| Visitor id (localStorage) and session id (sessionStorage) | no | yes | deleted |
| Country | no | yes | — |
| Legal basis | Telecommunicatiewet 11.7a(3)(b): analytics with no privacy impact; stored rows are not personal data | consent (GDPR 6(1)(a), Tw 11.7a(1)) | — |

Consent is kept in `localStorage["charityevals:consent"]` as `{ analytics, at }` and asked again after
a year.

## Columns

Analytics Engine columns are positional. The order is fixed in `BLOBS` in `worker/events.ts`; append new
fields at the end, never reorder.

| Column | Field | Notes |
| --- | --- | --- |
| `blob1` | event | see below |
| `blob2` | path | no query string or hash |
| `blob3` | charity | charity id on charity pages and for donate clicks |
| `blob4` | model | model id on model pages |
| `blob5` | tier | `anon` or `consent` |
| `blob6` | visitor | random, consent only |
| `blob7` | session | random, per tab, consent only |
| `blob8` | key | what was acted on |
| `blob9` | detail | how |
| `blob10` | referrer | other site's host name, page views only |
| `blob11` | country | two letters, consent only |
| `double1` | value | a number, two significant figures |
| `index1` | sampling key | session id, or `anon:<event>` |

| Event (`blob1`) | `blob8` key | `blob9` detail | `double1` |
| --- | --- | --- | --- |
| `page_view` | | | |
| `session_start` | | | (sent once on "Accept", with the page it happened on; not a view) |
| `donate_click` | `charity_page` or `rankings` | | |
| `assumption_change` | assumption id | `higher`, `lower`, `default`, `on`, `off` | new value (sent 1.5 s after the slider settles) |
| `assumption_reset` | | | how many were changed |
| `link_copy` | | | how many were changed |
| `view_toggle` | `charityevals` or `evaluator` | | |
| `evaluator_tab` | evaluator id | `page` or `other` | |
| `derivation_open` | | | depth (1 = a term of the bottom line) |
| `table_open` | | | rows in the table (retired: the table became the tree) |
| `tree_open` | | `lever` when following the biggest lever | depth opened (1 = the bottom line) |
| `suggestion_sent` | | | |
| `outbound_click` | host name | `source`, `spreadsheet`, `resource-<type>` or `link` | |

## Querying

Queries go to the SQL API with an API token. Create one yourself in the Cloudflare dashboard (My Profile →
API Tokens → Create token → custom, permission **Account → Account Analytics → Read**, this account only).
Keep it out of the repo.

```sh
export CF_ACCOUNT_ID=7c6c4c53ba700e67460bb6724cd7108c
export CF_API_TOKEN=...   # Account Analytics: Read
q() { curl -s "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/analytics_engine/sql" \
  -H "Authorization: Bearer $CF_API_TOKEN" --data "$1"; }
q "SELECT count() FROM charityevals_events FORMAT TabSeparated"
```

Analytics Engine samples at high volume. Every row carries `_sample_interval`, the number of events it
stands for, so count with `sum(_sample_interval)` rather than `count()`. Consenting visitors' events are
sampled by session (whole sessions kept or dropped), so per-session funnels stay intact; at this site's
volume sampling is unlikely to kick in at all. Only one table per query, no joins; subqueries in `FROM`
work.

Most viewed charities, last 30 days:

```sql
SELECT blob3 AS charity, sum(_sample_interval) AS views
FROM charityevals_events
WHERE blob1 = 'page_view' AND blob3 != '' AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY charity
ORDER BY views DESC
LIMIT 50
```

Donate clicks per charity, and where they happened:

```sql
SELECT blob3 AS charity, blob8 AS place, sum(_sample_interval) AS clicks
FROM charityevals_events
WHERE blob1 = 'donate_click' AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY charity, place
ORDER BY clicks DESC
```

Most changed assumptions, and which way:

```sql
SELECT blob8 AS assumption, blob9 AS direction, sum(_sample_interval) AS changes
FROM charityevals_events
WHERE blob1 = 'assumption_change' AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY assumption, direction
ORDER BY changes DESC
```

Where people settle a slider (weighted median of the values they leave it at):

```sql
SELECT blob8 AS assumption, quantileExactWeighted(0.5)(double1, _sample_interval) AS median_value
FROM charityevals_events
WHERE blob1 = 'assumption_change' AND blob9 IN ('higher', 'lower')
GROUP BY assumption
```

Funnel, view to donate (consenting visitors only, per session): of the sessions that viewed a charity's
page, how many clicked a donate link in the same session. A visitor who accepts on a charity page starts
their session with `session_start` on that page (its view was sent before they had an id), so it counts
as a view here.

```sql
SELECT count() AS sessions_viewing_a_charity, countIf(donates > 0) AS of_which_clicked_donate
FROM (
  SELECT blob7 AS session,
         countIf(blob1 IN ('page_view', 'session_start') AND blob3 != '') AS views,
         countIf(blob1 = 'donate_click') AS donates
  FROM charityevals_events
  WHERE blob5 = 'consent' AND blob7 != '' AND timestamp > NOW() - INTERVAL '30' DAY
  GROUP BY session
)
WHERE views > 0
```

For one charity, count sessions that viewed it and sessions that then clicked its donate link:

```sql
SELECT countIf(views > 0) AS viewed, countIf(views > 0 AND donates > 0) AS viewed_and_donated
FROM (
  SELECT blob7 AS session,
         countIf(blob1 IN ('page_view', 'session_start') AND blob3 = 'givedirectly') AS views,
         countIf(blob1 = 'donate_click' AND blob3 = 'givedirectly') AS donates
  FROM charityevals_events
  WHERE blob5 = 'consent' AND blob7 != ''
  GROUP BY session
)
```

Share of events from consenting visitors (how representative the funnels are):

```sql
SELECT blob5 AS tier, sum(_sample_interval) AS events
FROM charityevals_events
WHERE blob1 = 'page_view' AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY tier
```

Other useful ones: `blob10` for where page views come from, `blob8` of `outbound_click` for which evidence
sites people follow, `double1` of `derivation_open` for how deep they read.

## Locally

`npx wrangler dev` runs the Worker with a local Analytics Engine binding: `/api/event` answers 204 and
the write is accepted but not stored anywhere you can query. `astro dev` has no Worker, so events get a
404, which the page ignores.
