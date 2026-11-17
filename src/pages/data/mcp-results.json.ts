// /data/mcp-results.json: what the MCP server answers from without computing (src/lib/mcp-data.ts).
import type { APIRoute } from "astro";
import { mcpResults } from "../../lib/mcp-data";
import { json } from "../../lib/open-data";

export const GET: APIRoute = () => json(mcpResults());
