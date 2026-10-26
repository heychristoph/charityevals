import { setView, useView } from "../lib/assumption-state";

/** Switch between our model and the source evaluator's model as published. */
export default function ViewToggle({ evaluatorName }: { evaluatorName?: string }) {
  const view = useView();
  const options = [
    { id: "charityevals" as const, label: "charityevals model", hint: "Your assumptions and our accounting adjustments" },
    { id: "evaluator" as const, label: evaluatorName ? `${evaluatorName}'s model` : "Evaluators' models", hint: "As published by the evaluator, where one exists" },
  ];
  return (
    <div className="view-toggle" role="radiogroup" aria-label="Which model to show">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={view === o.id}
          className={view === o.id ? "on" : ""}
          title={o.hint}
          onClick={() => setView(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
