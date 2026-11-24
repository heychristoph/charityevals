import { useEffect, useRef, useState } from "react";
import { setConsent, track } from "../lib/analytics";
import { markOnboarded, openOnboarding } from "../lib/onboarding";
import { ValueSets } from "./Choices";
import "./onboarding.css";

/** One screen before the ranking: the value sets as cards, none marked until one is clicked, and the
 * analytics choice that Consent.astro would otherwise ask. Without that question a click on a set closes
 * the screen; with it, Accept or Decline does, and the site's own set stays if none was clicked. Opens only
 * on a first visit that starts on the landing page (src/lib/onboarding.ts). */
export default function Onboarding() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    // Usually opened already by the page's early script (index.astro); this covers a page without it.
    openOnboarding();
    if (d.open) track("onboarding_open");
  }, []);

  const finish = (set: string, analytics?: boolean) => {
    if (analytics !== undefined) setConsent(analytics);
    markOnboarded();
    track("onboarding_done", { key: set });
    dialog.current?.close();
  };

  const pick = (id: string) => {
    setPicked(id);
    if (document.documentElement.dataset.onboarding !== "ask") finish(id);
  };

  // The page's early script may have opened the dialog before hydration: its `open` is expected
  // (suppressHydrationWarning).
  return (
    <dialog ref={dialog} className="onboarding" aria-labelledby="onboarding-title" onCancel={(e) => e.preventDefault()} suppressHydrationWarning>
      <div className="onboarding-body">
        <h2 id="onboarding-title">Your values first</h2>
        <p className="onboarding-lead">Pick the set closest to yours.</p>
        <ValueSets picked={picked} onPick={pick} short />
        {/* Shown only while the analytics question is open; html[data-onboarding] says which (onboarding.css). */}
        <div className="onboarding-consent ob-ask">
          <h3>Help us improve charityevals</h3>
          <p>
            We'd like to see which charities people look at and how they get there. Accept, and a random id in this browser
            connects the pages of your visit: no cookies, no names, no ads. Decline, and we count nothing. <a href="/privacy#analytics">How it works</a>
          </p>
        </div>
      </div>
      <div className="onboarding-actions ob-ask">
        <button type="button" className="onboarding-back" onClick={() => finish(picked ?? "default", false)}>Decline</button>
        <button type="button" className="onboarding-next" onClick={() => finish(picked ?? "default", true)}>Accept</button>
      </div>
    </dialog>
  );
}
