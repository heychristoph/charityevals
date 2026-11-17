// /data/mcp-library.json: the library the MCP server computes custom values with (src/lib/mcp-data.ts).
import type { APIRoute } from "astro";
import { mcpLibrary } from "../../lib/mcp-data";
import { json } from "../../lib/open-data";

export const GET: APIRoute = () => json(mcpLibrary());
