import type React from "react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { ChevronRight, ExternalLink, AlertTriangle, Info } from "lucide-react";
import { lib, modelUrl, rawFacts } from "../lib/data";
import { buildLibrary, comparable, compute, hasRange, inputRange, pickValue, type ResolvedModel, type ResolvedRow, type View } from "../engine/model";
import { rowsFeeding } from "../engine/sensitivity";
import { useResults, useResultFor } from "../lib/use-results";
import { formatMultiple, formatValue } from "../lib/format";
import { Markdown } from "./AssumptionsPanel";
import ViewToggle from "./ViewToggle";
import Derivation, { type Choice } from "./Derivation";
import { TICKS, xFor, tickLabel, clipSpan, pctStr } from "./scale";
import "./model.css";

const KIND_LABEL = { observed: "Observed", estimate: "Estimate", judgment: "Judgment" } as const;

function Formula({ text, model }: { text: string; model: ResolvedModel }) {
  const parts = text.split(/(@[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*|\$?[a-z_][a-z0-9_]*)/gi);
  return (
    <code className="formula">
      {parts.map((p, i) => {
        if (p.startsWith("@")) {
          const f = lib.facts.get(p.slice(1));
          return f ? <a key={i} href={`/assumptions#f-${f.key}`} title={`Shared fact: ${f.group}`} className="ref ref-f">{f.group}: {f.label}</a> : p;
        }
        if (p.startsWith("$")) {
          const a = lib.assumptions.rows.find((r) => r.id === p.slice(1));
          return a ? <a key={i} href={`#a-${a.id}`} title={a.label} className="ref ref-a">{a.label}</a> : p;
        }
        const r = model.byId.get(p);
        return r ? <a key={i} href={`#row-${r.id}`} title={r.label} className="ref">{r.label}</a> : <Fragment key={i}>{p}</Fragment>;
      })}
    </code>
  );
}

function Tornado({ model }: { model: ResolvedModel }) {
  const r = useResultFor(model);
  const cmp = comparable(lib, model);
  const fmt = (v: number) => (cmp ? formatMultiple(v) : formatValue(v, Math.abs(v) < 0.1 ? "small" : "number"));
  const bench = r.s.central / r.central;
  const rows = r.s.swings.slice(0, 8);
  const lo = Math.min(r.low, ...rows.map((s) => Math.min(s.atLow, s.atHigh) / bench));
  const hi = Math.max(r.high, ...rows.map((s) => Math.max(s.atLow, s.atHigh) / bench));
  const [a, b] = [Math.log10(lo) - 0.05, Math.log10(hi) + 0.05];
  const xn = (v: number) => ((Math.log10(v) - a) / (b - a)) * 100;
  const x = (v: number) => pctStr(xn(v));
  // Gridlines at each power of ten, plus 2× and 5× steps when the range spans little more than a decade.
  const steps = b - a < 1.5 ? [1, 2, 5] : [1];
  const decades: number[] = [];
  for (let d = Math.floor(a); d <= Math.ceil(b); d++)
    for (const m of steps) {
      const v = m * 10 ** d;
      if (Math.log10(v) >= a && Math.log10(v) <= b) decades.push(v);
    }

  return (
    <figure className="tornado" aria-labelledby="tornado-caption">
      <figcaption id="tornado-caption">
        <h2>What drives this result</h2>
        <p className="muted small">
          Each bar moves one input from the low to the high end of its range, holding the rest at their central values. Log scale,
          {cmp ? " as a multiple of GiveDirectly." : ` in ${lib.assumptions.units[model.output!.unit].label} per dollar.`} Dashed line: central estimate.
        </p>
      </figcaption>
      <div className="t-chart" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
        <div className="t-axis">
          <span />
          <div className="t-track">
            {decades.map((d) => (
              <span key={d} className="t-tick num small" style={{ left: x(d) }}>{fmt(d)}</span>
            ))}
          </div>
        </div>
        {rows.map((s) => {
          const v1 = s.atLow / bench, v2 = s.atHigh / bench;
          const [l, h] = v1 < v2 ? [v1, v2] : [v2, v1];
          const href = s.scope === "row" ? `#row-${s.id}` : s.scope === "fact" ? `/assumptions#f-${s.id.slice(1)}` : `#a-${s.id}`;
          return (
            <div key={s.id} className="t-row">
              <a href={href} className="t-label small">
                {s.label}
                <span className={`kind-dot kind-${s.scope === "assumption" ? "judgment" : s.kind}`} aria-hidden />
              </a>
              <div className="t-track">
                {decades.map((d) => <span key={d} className="t-grid" style={{ left: x(d) }} />)}
                <span className="t-bar" style={{ clipPath: clipSpan(xn(l), xn(h), "2px") }} />
                <span className="t-central" style={{ left: x(r.central) }} />
                <span className="t-end num small" style={{ left: x(l) }} data-side="left">{fmt(l)}</span>
                <span className="t-end num small" style={{ left: x(h) }} data-side="right">{fmt(h)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="small muted t-notes">
        <p className="t-legend">
          <span className="kind-dot kind-observed" /> observed <span className="kind-dot kind-estimate" /> estimate{" "}
          <span className="kind-dot kind-judgment" /> judgment or shared assumption
        </p>
        <p>
          Shows the {rows.length} inputs that move the result most. Ranges come from the source where it gives them; explainers say
          when a range is ours.{model.source && <> Source: charityevals model of {model.source.publisher}, {model.source.title}.</>}
        </p>
      </div>
    </figure>
  );
}

function RowValue({ row, value, view, evaluatorName }: { row: ResolvedRow; value: number; view: View; evaluatorName?: string }) {
  const range = inputRange(row, view);
  const other = view === "evaluator" ? row.value : row.published;
  return (
    <>
      <span className="v-main num">{formatValue(value, row.format)}</span>
      {row.range && (
        <span className="v-range small muted num" title={row.range.note}>
          {formatValue(row.range.low, row.format)} – {formatValue(row.range.high, row.format)}
        </span>
      )}
      {hasRange(range) && (
        <span className="v-range small muted num">
          {formatValue(pickValue(range, "low"), row.format)} – {formatValue(pickValue(range, "high"), row.format)}
        </span>
      )}
      {row.published !== undefined && (
        <span className="v-other small num">
          {view === "evaluator" ? "charityevals" : evaluatorName ?? "Evaluator"}: {formatValue(pickValue(other), row.format)}
        </span>
      )}
    </>
  );
}

function ModelRow({ row, model, value, open, onToggle, onPath, view }: {
  row: ResolvedRow; model: ResolvedModel; value: number; open: boolean; onToggle: () => void; onPath: boolean; view: View;
}) {
  const factOnly = row.formula && /^@[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*$/i.test(row.formula.trim()) ? lib.facts.get(row.formula.trim().slice(1)) : undefined;
  const ours = !model.evaluator ? false : row.assumptionDeps.some((a) => ["count_salary_sacrifice", "full_credit"].includes(a)) || row.section === "donor";
  const isOutput = model.output?.row === row.id;
  const detailId = `detail-${row.id}`;
  return (
    <>
      <tr id={`row-${row.id}`} className={`m-row ${row.node ? "is-formula" : "is-input"} ${isOutput ? "is-output" : ""} ${onPath ? "" : "off-path"} ${open ? "open" : ""}`}>
        <th scope="row">
          <button type="button" className="row-toggle" aria-expanded={open} aria-controls={detailId} onClick={onToggle}>
            <ChevronRight size={15} className="chev" aria-hidden />
            <span>{row.label}</span>
          </button>
          {row.overridden?.length ? <span className="tag tag-override" title={`Changed here: ${row.overridden.join(", ")}`}>overridden</span> : null}
          {factOnly && <span className="tag tag-fact" title={`Shared fact: ${factOnly.group}`}>shared fact</span>}
          {row.published !== undefined && <span className="tag tag-differs" title={`We differ from ${model.evaluator?.name ?? "the evaluator"}`}>differs from {model.evaluator?.name ?? "evaluator"}</span>}
          {ours && row.section === "donor" && row.value !== undefined && <span className="tag tag-ours">charityevals</span>}
        </th>
        <td className="m-value"><RowValue row={row} value={value} view={view} evaluatorName={model.evaluator?.name} /></td>
        <td className="m-kind">
          {row.kind ? <span className={`kind kind-${row.kind}`}>{KIND_LABEL[row.kind]}</span> : <span className="kind kind-calc">Calculated</span>}
        </td>
      </tr>
      <tr id={detailId} className="m-detail" hidden={!open}>
        <td colSpan={3}>
          <div className="detail">
            {row.formula && (
              <div className="detail-block">
                <span className="detail-label small">Formula</span>
                <Formula text={row.formula} model={model} />
              </div>
            )}
            {row.explainer && <div className="detail-text"><Markdown text={row.explainer} /></div>}
            {factOnly && (
              <div className="small muted">
                Shared fact from <a href={`/assumptions#f-${factOnly.key}`}>{factOnly.group}</a>: every model that needs it reads the same value.
                {factOnly.source?.title && <> Source: {factOnly.source.url ? <a href={factOnly.source.url}>{factOnly.source.title}</a> : factOnly.source.title}.</>}
              </div>
            )}
            {row.source && (
              <div className="detail-source small muted">
                Source:{" "}
                {row.source.url ? (
                  <a href={row.source.url}>{row.source.title ?? row.source.url} <ExternalLink size={12} aria-hidden /></a>
                ) : row.source.title}
                {row.source.cell && <>{row.source.title || row.source.url ? ", " : ""}cell <code>{row.source.cell}</code>{model.source?.sheet && <> in <a href={model.source.sheet}>the original sheet</a></>}</>}
              </div>
            )}
            {row.expected !== undefined && (
              <div className="small muted">
                The source reports <span className="num">{formatValue(row.expected, row.format)}</span>; this model reproduces it.
              </div>
            )}
            {row.inheritedFrom && (
              <div className="small muted">
                Defined in <a href={`${modelUrl(lib, lib.models.get(row.inheritedFrom)!)}#row-${row.id}`}>{lib.models.get(row.inheritedFrom)?.name}</a>
                {row.overridden?.length ? `; this model changes its ${row.overridden.join(", ")}.` : "."}
              </div>
            )}
            {!onPath && <div className="small muted">Context only: the bottom line doesn't use this row.</div>}
          </div>
        </td>
      </tr>
    </>
  );
}

export default function ModelView({ id, raw, choices = [], children }: { id: string; raw?: unknown; choices?: Choice[]; children?: React.ReactNode }) {
  // Bulk models reach the browser as one-row summaries; their page passes the full file instead.
  const model = useMemo(
    () => (raw ? buildLibrary([raw], lib.assumptions, rawFacts, [...lib.charities.values()], [...lib.owners.values()]).models.get(id)! : lib.models.get(id)!),
    [id, raw],
  );
  const { results, av } = useResults();
  const r = useResultFor(model);
  const rank = model.kind === "charity" ? results.findIndex((x) => x.charity.id === model.charity) + 1 : 0;
  const values = useMemo(() => compute(lib, model, av, {}, r.view), [model, av, r.view]);
  const onPath = useMemo(() => rowsFeeding(model), [model]);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const unit = lib.assumptions.units[model.output!.unit];

  useEffect(() => {
    const openHash = () => {
      const h = decodeURIComponent(location.hash);
      if (h.startsWith("#row-")) setOpen((o) => new Set(o).add(h.slice(5)));
    };
    openHash();
    window.addEventListener("hashchange", openHash);
    return () => window.removeEventListener("hashchange", openHash);
  }, []);

  const toggle = (rid: string) => setOpen((o) => {
    const n = new Set(o);
    n.has(rid) ? n.delete(rid) : n.add(rid);
    return n;
  });

  return (
    <div className="model-view" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
      {model.evaluator && (
        <div className="view-bar">
          <ViewToggle evaluatorName={model.evaluator.name} />
          <p className="view-note">
            {r.view === "evaluator"
              ? `${model.evaluator.name}'s model as published: their moral weights and accounting, with our exchange rates between causes so it can be compared.`
              : `Our model: ${model.evaluator.name}'s analysis plus your assumptions and our accounting adjustments (salary sacrifice, credit for shared outcomes).`}
          </p>
        </div>
      )}
      {comparable(lib, model) ? (
      <section className="bottom-line" aria-labelledby="bl-title">
          <h2 id="bl-title" className="bl-title">
            <span className="bl-figure num">{formatMultiple(r.central)}</span> as much good per dollar as GiveDirectly
            {rank > 0 && <span className="muted bl-rank"> · rank {rank} of {results.length}</span>}
          </h2>
          <div className="bl-strip">
            <div className="bl-axis" aria-hidden>
              {TICKS.map((t) => <span key={t} className="bl-tick num small" style={{ left: pctStr(xFor(t, 100)) }}>{tickLabel(t)}</span>)}
            </div>
            <div className="bl-track" role="img" aria-label={`Central ${formatMultiple(r.central)}, joint low ${formatMultiple(r.low)}, joint high ${formatMultiple(r.high)}`}>
              {TICKS.map((t) => <span key={t} className={`bl-grid ${t === 1 ? "one" : ""}`} style={{ left: pctStr(xFor(t, 100)) }} />)}
              <span className="bl-bar" style={{ clipPath: clipSpan(xFor(r.low, 100), xFor(r.high, 100), "5px") }} />
              <span className="bl-dot-layer" style={{ transform: `translateX(${pctStr(xFor(r.central, 100))})` }}><span className="bl-dot" /></span>
            </div>
          </div>
          <p className="small muted">
            Joint low {formatMultiple(r.low)}, joint high {formatMultiple(r.high)}. In its own unit:{" "}
            <span className="num">{formatValue(r.native, Math.abs(r.native) < 0.1 ? "small" : "number")}</span> {unit.label} per dollar.{" "}
            <a href="#your-assumptions" className="jump">Change your assumptions</a>
          </p>
        </section>
      ) : (
        <section className="bottom-line" aria-labelledby="bl-title">
          <h2 id="bl-title" className="bl-title">
            <span className="bl-figure num">{formatValue(r.native, Math.abs(r.native) < 0.1 ? "small" : "number")}</span> {unit.label} per dollar
          </h2>
          <p className="small muted">
            Range {formatValue(r.low, "number")} – {formatValue(r.high, "number")}. Not ranked against other charities: the evaluator reports
            this in {unit.label}, and there is no defensible exchange rate between that and good done elsewhere.{" "}
            <a href="#your-assumptions" className="jump">Change your assumptions</a>
          </p>
        </section>
      )}

      {r.flags.length > 0 && (
        <section id="flags" className="flags" aria-label="Sensitivity flags">
          <ul>
            {r.flags.map((f) => (
              <li key={f.short} className={`flag flag-${f.level}`}>
                {f.level === "warn" ? <AlertTriangle size={15} aria-hidden /> : <Info size={15} aria-hidden />}
                <span>{f.text}.</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Derivation model={model} choices={choices} />

      {children}

      <Tornado model={model} />

      <section className="model-table" aria-labelledby="model-table-title">
        <div className="mt-head">
          <h2 id="model-table-title">The model, row by row</h2>
          <div className="mt-actions small">
            <button type="button" className="link-button" onClick={() => setOpen(new Set(model.rows.map((x) => x.id)))}>Expand all</button>
            <button type="button" className="link-button" onClick={() => setOpen(new Set())}>Collapse all</button>
          </div>
        </div>
        <p className="muted small">
          Click any row for its explanation, source and formula. Formulas link to the rows they use. Values update with your assumptions.
        </p>
        <table className="m-table">
          <colgroup><col /><col className="c-value" /><col className="c-kind" /></colgroup>
          <thead className="visually-hidden">
            <tr><th scope="col">Row</th><th scope="col">Value</th><th scope="col">Kind</th></tr>
          </thead>
          {model.sections.map((sec) => {
            const rows = model.rows.filter((x) => x.section === sec.id);
            if (!rows.length) return null;
            return (
              <tbody key={sec.id}>
                <tr className="m-section">
                  <th colSpan={3} scope="rowgroup">
                    <h3>{sec.title}</h3>
                    {sec.explainer && <p className="muted small">{sec.explainer}</p>}
                  </th>
                </tr>
                {rows.map((row) => (
                  <ModelRow key={row.id} row={row} model={model} value={values[row.id]} open={open.has(row.id)}
                    onToggle={() => toggle(row.id)} onPath={onPath.has(row.id)} view={r.view} />
                ))}
              </tbody>
            );
          })}
        </table>
      </section>
    </div>
  );
}
