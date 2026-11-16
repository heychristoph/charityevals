// The files the MCP server (worker/mcp/) answers from, written at build from the pages' library:
//   /data/mcp-results.json   the catalogue (names, causes, pages, licences, the shared assumptions) and
//                            every figure at the defaults and under every value set
//   /data/mcp/<id>.json      get_model's answer for each model and charity
//   /data/mcp-library.json   the library without the text no answer quotes, for custom values
// The worker's own code computes them, so a stored answer is the one it would compute.
import { assumptionValues } from "../engine/model";
import { precompute, StoredFigures, type Precomputed } from "../../worker/mcp/catalogue";
import { answerIds, getModelAnswer } from "../../worker/mcp/detail";
import type { LibraryInput } from "../../worker/mcp/library";
import { slimLibrary } from "../../worker/mcp/slim";
import { lib } from "./data";
import { libraryJson } from "./open-data";

let results: Precomputed | undefined;
export const mcpResults = () => (results ??= precompute(lib));

export const mcpLibrary = () => slimLibrary(libraryJson() as LibraryInput);

export const mcpAnswerIds = () => answerIds(mcpResults().catalogue);

export function mcpAnswer(id: string) {
  const r = mcpResults();
  return getModelAnswer(lib, r.catalogue, new StoredFigures(r.scenarios.default), assumptionValues(lib.assumptions), id);
}
