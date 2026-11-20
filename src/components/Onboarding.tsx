import { useEffect, useRef, useState } from "react";
import { lib } from "../lib/data";
import { pickValue } from "../engine/model";
import { useOverrides } from "../lib/assumption-state";
import { setConsent, shouldAsk, track } from "../lib/analytics";
import { markOnboarded, onboardingDue } from "../lib/onboarding";
import { CountrySelect, Slider, Toggle, offered } from "./AssumptionsPanel";
import "./assumptions.css";
import "./onboarding.css";

/** A first screen (what this is, and the analytics choice that Consent.astro would otherwise ask), then one
 * screen per group of Your values, before the ranking: the same controls as the panel, sharing its state.
 * Opens only on a first visit that starts on the landing page (src/lib/onboarding.ts). */
export default function Onboarding() {
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  /** -1 is the first screen. */
  const [step, setStep] = useState(-1);
  const [ask, setAsk] = useState(false);
  const overrides = useOverrides();
  const groups = lib.assumptions.groups
    .map((g) => ({ ...g, rows: lib.assumptions.rows.filter((r) => r.section === g.id && !r.fixed) }))
    .filter((g) => g.rows.length);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (!onboardingDue()) return;
    setAsk(shouldAsk());
    d.showModal();
    track("onboarding_open");
  }, []);

  useEffect(() => {
    body.current?.scrollTo(0, 0);
  }, [step]);

  const finish = (how: "done" | "skip") => {
    markOnboarded();
    track("onboarding_" + how, { value: step + 1 });
    dialog.current?.close();
  };

  const choose = (analytics: boolean) => {
    setConsent(analytics);
    setAsk(false);
    setStep(0);
  };

  if (step < 0)
    return (
      <dialog ref={dialog} className="onboarding" aria-labelledby="onboarding-title" onCancel={(e) => e.preventDefault()}>
        <div className="onboarding-body">
          <h2 id="onboarding-title">Your values first</h2>
          <p className="onboarding-lead">Comparing charities takes value judgments with no right answer. Set yours in {groups.length} short steps; the ranking follows them.</p>
          {ask && (
            <div className="onboarding-consent">
              <h3>Help us improve charityevals</h3>
              <p>
                We'd like to see which charities people look at and how they get there. Accept, and a random id in this browser
                connects the pages of your visit: no cookies, no names, no ads. Decline, and we count nothing. <a href="/privacy#analytics">How it works</a>
              </p>
            </div>
          )}
        </div>
        <div className="onboarding-actions">
          {ask ? (
            <>
              <button type="button" className="onboarding-back" onClick={() => choose(false)}>Decline</button>
              <button type="button" className="onboarding-next" onClick={() => choose(true)}>Accept</button>
            </>
          ) : (
            <button type="button" className="onboarding-next" onClick={() => setStep(0)}>Start</button>
          )}
        </div>
      </dialog>
    );

  const g = groups[step];
  const last = step === groups.length - 1;
  return (
    <dialog ref={dialog} className="onboarding" aria-labelledby="onboarding-title" onCancel={(e) => e.preventDefault()}>
      <div className="onboarding-top">
        <ol className="onboarding-progress" aria-label={`Step ${step + 1} of ${groups.length}`}>
          {groups.map((x, i) => (
            <li key={x.id} className={i <= step ? "on" : undefined}>
              <button type="button" aria-label={x.title} aria-current={i === step ? "step" : undefined} onClick={() => setStep(i)} />
            </li>
          ))}
        </ol>
        <button type="button" className="link-button small" onClick={() => finish("skip")}>Skip</button>
      </div>
      <div className="onboarding-body" ref={body}>
        <h2 id="onboarding-title">{g.title}</h2>
        <div className="assumptions compact">
          {g.rows.filter((r) => offered(r, overrides)).map((r) => {
            const value = overrides[r.id] ?? pickValue(r.value);
            return r.control === "country"
              ? <CountrySelect key={r.id} row={r} value={value} compact />
              : r.format === "toggle"
              ? <Toggle key={r.id} row={r} value={value} compact />
              : <Slider key={r.id} row={r} value={value} compact />;
          })}
        </div>
      </div>
      <div className="onboarding-actions">
        <button type="button" className="onboarding-back" onClick={() => setStep(step - 1)}>Back</button>
        <button type="button" className="onboarding-next" onClick={() => (last ? finish("done") : setStep(step + 1))}>
          {last ? "See the ranking" : "Next"}
        </button>
      </div>
    </dialog>
  );
}
