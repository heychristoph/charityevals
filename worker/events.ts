// Visitor analytics: what the page script (src/lib/analytics.ts) may send to POST /api/event, and how
// one event becomes one Analytics Engine data point. Everything here is an allow-list: unknown events
// are dropped, unknown fields ignored, every string is cut to a short, plain token. Nothing that
// identifies a person or device is ever written: no IP address, no user agent, no free text. The two
// random ids (visitor, session) are only accepted when the event says the visitor opted in, and the
// page only sends them then. See src/pages/privacy.astro and docs/analytics.md.

export const EVENTS = [
  "page_view",
  "session_start",
  "donate_click",
  "assumption_change",
  "assumption_reset",
  "link_copy",
  "view_toggle",
  "evaluator_tab",
  "derivation_open",
  "table_open",
  "suggestion_sent",
  "outbound_click",
] as const;
export type EventName = (typeof EVENTS)[number];

/** The data point layout. Analytics Engine columns are positional, so this order is the schema. */
export const BLOBS = [
  "event", // blob1
  "path", // blob2: page path, no query string or hash
  "charity", // blob3: charity id on charity pages and for donate clicks
  "model", // blob4: model id on model pages
  "tier", // blob5: "anon" (no consent) or "consent"
  "visitor", // blob6: random id kept in localStorage, consent only
  "session", // blob7: random id per tab, consent only
  "key", // blob8: what was acted on: assumption id, evaluator, view, link host, ...
  "detail", // blob9: how: "higher"/"lower"/"default", "on"/"off", link kind, ...
  "referrer", // blob10: referring site's host name, page views only, external sites only
  "country", // blob11: two-letter country from Cloudflare, consent only
] as const;

export type DataPoint = { indexes: [string]; blobs: string[]; doubles: number[] };

const TOKEN = /[^a-z0-9_.:\-/]/gi;
/** A short id-like token: letters, digits and _ . : - / only. Anything else (spaces, @, ?) is dropped. */
export function token(v: unknown, max = 80): string {
  return typeof v === "string" ? v.replace(TOKEN, "").slice(0, max) : "";
}

const ID = /^[a-z0-9]{16,32}$/i;
const HOST = /^[a-z0-9.-]{1,100}$/i;

/** Turns a posted body into a data point, or undefined to drop it. */
export function toDataPoint(body: unknown, country?: string): DataPoint | undefined {
  if (!body || typeof body !== "object") return undefined;
  const b = body as Record<string, unknown>;
  const event = token(b.e, 40) as EventName;
  if (!EVENTS.includes(event)) return undefined;
  // Path only: the site keeps assumption values in the query string, and they belong to the visitor.
  const path = typeof b.p === "string" && b.p.startsWith("/") ? token(b.p.split(/[?#]/)[0], 200) || "/" : "/";
  const consent = b.c === 1;
  const visitor = consent && typeof b.v === "string" && ID.test(b.v) ? b.v : "";
  const session = consent && typeof b.s === "string" && ID.test(b.s) ? b.s : "";
  const referrer = event === "page_view" && typeof b.r === "string" && HOST.test(b.r) ? b.r.toLowerCase() : "";
  const n = typeof b.n === "number" && Number.isFinite(b.n) ? Number(b.n.toPrecision(2)) : 0;
  const blobs = [
    event,
    path,
    token(b.ch),
    token(b.m, 120),
    consent ? "consent" : "anon",
    visitor,
    session,
    token(b.k, 100),
    token(b.d, 40),
    referrer,
    consent && country && /^[A-Z]{2}$/.test(country) ? country : "",
  ];
  // The index is Analytics Engine's sampling key: per session with consent (a journey is kept or
  // dropped whole), otherwise per event name.
  return { indexes: [session || `anon:${event}`], blobs, doubles: [n] };
}
