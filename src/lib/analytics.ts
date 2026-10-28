// Visitor analytics, in two tiers (see src/pages/privacy.astro and docs/analytics.md):
//
// 1. Until the visitor chooses, anonymous counts: an event name, the page path and what was acted on
//    (a charity, an assumption). Nothing is stored on the device and no identifier is sent, so no two
//    events can be tied to each other or to a person. Not sent at all after "Decline", or when the
//    browser asks not to be tracked (Global Privacy Control, Do Not Track).
// 2. After "Accept", the same events also carry two random ids, one kept in localStorage (visitor)
//    and one per tab in sessionStorage (session), so a visit can be followed from page to page.
//    Withdrawing consent deletes both.
//
// Events go to our own Worker (POST /api/event, worker/index.ts), which writes them to Cloudflare
// Workers Analytics Engine. No third parties, no cookies, no IP addresses, no free text.

const CONSENT_KEY = "charityevals:consent";
const VISITOR_KEY = "charityevals:visitor";
const SESSION_KEY = "charityevals:session";
/** Ask again after a year. */
const CONSENT_MAX_AGE = 365 * 24 * 3600 * 1000;
export const CONSENT_EVENT = "charityevals:consent";

export type Consent = "granted" | "denied" | undefined;

type Props = {
  /** Charity id; defaults to the page's (data-track-charity). */
  charity?: string;
  /** Model id; defaults to the page's (data-track-model). */
  model?: string;
  /** What was acted on: an assumption id, an evaluator, a view, a link's host. */
  key?: string;
  /** How: "higher", "lower", "on", a link kind. */
  detail?: string;
  /** One number: a depth, or an assumption's new value (rounded to two significant figures). */
  value?: number;
};

const store = (s: "local" | "session") => {
  try {
    return s === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return undefined;
  }
};

/** A choice made on this page that couldn't be saved (storage blocked or full). When saving works,
 * the stored choice, shared by every tab, is the source of truth and this stays empty. */
let chosen: Consent;

export function getConsent(): Consent {
  if (typeof window === "undefined") return undefined;
  if (chosen) return chosen;
  try {
    const c = JSON.parse(store("local")?.getItem(CONSENT_KEY) ?? "null") as { analytics: boolean; at: number } | null;
    if (!c || typeof c.at !== "number" || Date.now() - c.at > CONSENT_MAX_AGE) return undefined;
    return c.analytics ? "granted" : "denied";
  } catch {
    return undefined;
  }
}

/** The browser asks sites not to track: Global Privacy Control or Do Not Track. */
export function privacySignal(): boolean {
  const n = navigator as Navigator & { globalPrivacyControl?: boolean };
  return n.globalPrivacyControl === true || n.doNotTrack === "1";
}

export function setConsent(analytics: boolean) {
  const was = getConsent();
  // In memory first, so the choice takes effect even if saving it fails.
  chosen = analytics ? "granted" : "denied";
  const attempt = (f: () => void) => {
    try {
      f();
    } catch {
      /* storage blocked or full: the in-memory choice still holds for this page */
    }
  };
  let saved = false;
  attempt(() => {
    const local = store("local");
    if (!local) return;
    local.setItem(CONSENT_KEY, JSON.stringify({ analytics, at: Date.now() }));
    saved = true;
  });
  if (saved) chosen = undefined;
  if (!analytics) {
    // Each id is removed on its own, whatever happened to the write above.
    attempt(() => store("local")?.removeItem(VISITOR_KEY));
    attempt(() => store("session")?.removeItem(SESSION_KEY));
  }
  // Changes made under the previous choice aren't sent under the new one.
  if (getConsent() !== was) cancelAssumptionEvents();
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: analytics }));
  // The page's anonymous view can't be tied to the new session, so start the session here, with this
  // page's context. It's its own event, so view counts don't count this page twice.
  if (analytics && was !== "granted") track("session_start");
}

function randomId(): string {
  const b = new Uint8Array(12);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

function idIn(s: Storage | undefined, key: string): string | undefined {
  if (!s) return undefined;
  try {
    let id = s.getItem(key);
    if (!id || !/^[a-f0-9]{24}$/.test(id)) s.setItem(key, (id = randomId()));
    return id;
  } catch {
    return undefined;
  }
}

function pageContext(): { charity?: string; model?: string } {
  const el = document.querySelector<HTMLElement>("[data-track-charity]");
  return { charity: el?.dataset.trackCharity, model: el?.dataset.trackModel };
}

/** Whether events may be sent under this choice: not after "Decline", nor, before a choice, when the
 * browser asks not to be tracked. */
const collecting = (consent: Consent) => consent === "granted" || (consent === undefined && !privacySignal());

/** Sends one event, if the visitor's choice allows it. Never throws, never waits. */
export function track(name: string, props: Props = {}, extra: { referrer?: string } = {}) {
  if (typeof window === "undefined") return;
  try {
    const consent = getConsent();
    if (!collecting(consent)) return;
    const granted = consent === "granted";
    const ctx = pageContext();
    const body = {
      e: name,
      p: location.pathname,
      ch: props.charity ?? ctx.charity,
      m: props.model ?? ctx.model,
      k: props.key,
      d: props.detail,
      n: props.value,
      r: extra.referrer,
      c: granted ? 1 : 0,
      v: granted ? idIn(store("local"), VISITOR_KEY) : undefined,
      s: granted ? idIn(store("session"), SESSION_KEY) : undefined,
    };
    const json = JSON.stringify(body);
    if (!navigator.sendBeacon?.("/api/event", json))
      fetch("/api/event", { method: "POST", body: json, keepalive: true, credentials: "omit" }).catch(() => {});
  } catch {
    /* analytics must never break the page */
  }
}

const timers = new Map<string, { t: ReturnType<typeof setTimeout>; send: () => void }>();

/**
 * An assumption changed. Dragging a slider fires many changes; only the value it settles on is sent,
 * 1.5 s after the last move, rounded to two significant figures.
 */
export function trackAssumption(id: string, value: number, defaultValue: number, toggle = false) {
  clearTimeout(timers.get(id)?.t);
  timers.delete(id);
  // A change is sent under the choice in force when it was made: none while collection is off, and
  // none if the choice changes before it's sent (see setConsent).
  const consent = getConsent();
  if (!collecting(consent)) return;
  const send = () => {
    timers.delete(id);
    if (getConsent() !== consent) return;
    const detail = toggle ? (value >= 0.5 ? "on" : "off") : value > defaultValue ? "higher" : value < defaultValue ? "lower" : "default";
    track("assumption_change", { key: id, detail, value });
  };
  timers.set(id, { t: setTimeout(send, 1500), send });
}

/** Drops changes still waiting out their 1.5 s: after "Reset", they're values the visitor discarded. */
export function cancelAssumptionEvents() {
  for (const { t } of timers.values()) clearTimeout(t);
  timers.clear();
}

/** Sends changes still waiting out their 1.5 s, when the visitor leaves the page. */
function flush() {
  for (const { t, send } of [...timers.values()]) {
    clearTimeout(t);
    send();
  }
}

/** Page view and link clicks, wired once per page by the Consent component. */
export function initAnalytics() {
  const ref = document.referrer ? new URL(document.referrer).hostname : "";
  track("page_view", {}, { referrer: ref && ref !== location.hostname ? ref : undefined });
  window.addEventListener("pagehide", flush);
  // A choice made in another tab replaces whatever this tab holds in memory.
  window.addEventListener("storage", (e) => {
    if (e.key !== CONSENT_KEY && e.key !== null) return;
    chosen = undefined;
    cancelAssumptionEvents();
    // Withdrawn elsewhere (or storage cleared): this tab's session id goes too, so a later "Accept" here
    // starts a fresh session that can't be linked to the earlier one.
    if (getConsent() !== "granted") {
      try {
        store("session")?.removeItem(SESSION_KEY);
      } catch {
        /* nothing stored to clear */
      }
    }
  });

  document.addEventListener(
    "click",
    (e) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      if (a.dataset.track === "donate") {
        track("donate_click", { charity: a.dataset.charity, key: document.querySelector("[data-track-charity]") ? "charity_page" : "rankings" });
        return;
      }
      const url = new URL(a.href, location.href);
      if (!/^https?:$/.test(url.protocol) || url.hostname === location.hostname) return;
      track("outbound_click", { key: url.hostname, detail: a.dataset.trackKind ?? "link" });
    },
    { capture: true },
  );
}
