import { lib } from "../lib/data";
import { pickValue } from "../engine/model";
import { useOverrides } from "../lib/assumption-state";
import { CountrySelect, Slider, Toggle } from "./AssumptionsPanel";
import "./assumptions.css";

/** Some of Your values, live, where a page talks about them (the method page): the same controls as in
 * the panel, sharing its state, so moving one here moves it everywhere. */
export default function Setting({ ids }: { ids: string[] }) {
  const overrides = useOverrides();
  const rows = ids.map((id) => lib.assumptions.rows.find((r) => r.id === id)).filter((r) => r !== undefined);
  if (!rows.length) return null;
  return (
    <div className="assumptions compact setting-inline">
      {rows.map((row) => {
        const value = overrides[row.id] ?? pickValue(row.value);
        return row.control === "country"
          ? <CountrySelect key={row.id} row={row} value={value} compact />
          : row.format === "toggle"
          ? <Toggle key={row.id} row={row} value={value} compact />
          : <Slider key={row.id} row={row} value={value} compact />;
      })}
    </div>
  );
}
