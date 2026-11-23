import { useResults } from "../lib/use-results";

/** How many charities the rankings list right now: the rows themselves, so the count follows the reader's
 * values (estimates left out as too old drop out of both). */
export default function RankedCount() {
  const { results } = useResults();
  return <>{results.length}</>;
}
