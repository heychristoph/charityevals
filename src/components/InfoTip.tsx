import { useEffect, useId, useRef, useState } from "react";
import { Info } from "lucide-react";
import "./info-tip.css";

/** Text ending in an info tip: the last word and the icon share one unbreakable span, so the icon
 * never wraps onto a line of its own. */
export function WithTip({ text, children }: { text: string; children: React.ReactNode }) {
  const i = text.lastIndexOf(" ") + 1;
  return (
    <>
      {text.slice(0, i)}
      <span className="nobr">{text.slice(i)}{"\u00a0"}{children}</span>
    </>
  );
}

/** A toggletip: an ⓘ button that shows a short explanation on click or tap, closes on Escape or a
 * click elsewhere. Click rather than hover, so it works on touch screens and from the keyboard. */
export default function InfoTip({ label, icon, className = "", children }: { label: string; icon?: React.ReactNode; className?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const id = useId();
  // A bubble that opens past the edge of the screen (or of the panel it sits in) scrolls into view.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      bubble.current?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: smooth ? "smooth" : "auto" });
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
    };
  }, [open]);
  return (
    <span className={`info-tip ${className}`} ref={root}>
      <button type="button" className="info-tip-button" aria-label={label} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        {icon ?? <Info size={15} aria-hidden />}
      </button>
      <div id={id} ref={bubble} role="status" className="info-tip-bubble" hidden={!open}>
        {open && children}
      </div>
    </span>
  );
}
