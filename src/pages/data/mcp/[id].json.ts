// /data/mcp/<id>.json: the MCP server's get_model answer for a model or a charity (src/lib/mcp-data.ts).
import type { APIRoute } from "astro";
import { mcpAnswer, mcpAnswerIds } from "../../../lib/mcp-data";
import { json } from "../../../lib/open-data";

export function getStaticPaths() {
  return mcpAnswerIds().map((id) => ({ params: { id } }));
}

export const GET: APIRoute = ({ params }) => json(mcpAnswer(params.id!));
