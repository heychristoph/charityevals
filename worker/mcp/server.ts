// /mcp: a remote MCP server (Streamable HTTP, protocol 2025-06-18 and later; older clients' versions
// accepted) that answers from charityevals' models. Stateless: every POST carries one JSON-RPC message
// (or, from older clients, a batch) and gets its answer as JSON; there is no session and no server-sent
// stream. Public, read-only and without sign-in; answers are capped in size, a rate limit per IP applies
// where the Worker has one bound (MCP_LIMITER), and calculations with custom values have a global daily
// budget (worker/mcp/tools.ts). Nothing here is for search engines (X-Robots-Tag: noindex).
import { LoadError } from "./library";
import { toolList, TOOLS, ToolError, type Context } from "./tools";

export const PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];
const MAX_REQUEST = 64_000;
/** The largest tool answer, in characters of JSON. */
export const MAX_ANSWER = 120_000;

const INSTRUCTIONS =
  "charityevals' cost-effectiveness models of charities, from evaluators' published analyses and its own. Results are in years of healthy life per $1,000 donated, with a plausible range. search_charities finds ids; get_model explains a model; run_model, compare and rank take your own values for the shared assumptions (list_assumptions). Each answer names the licence its figures can be reused under. Estimates for research, not financial advice.";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, MCP-Protocol-Version",
  "Access-Control-Max-Age": "86400",
  "X-Robots-Tag": "noindex",
};

const NOTE = `charityevals MCP server, for AI assistants: add https://charityevals.org/mcp to your client as a
remote MCP server (Streamable HTTP, no authentication). How: https://charityevals.org/ai
`;

type Id = string | number | null;
type Message = { jsonrpc?: unknown; id?: unknown; method?: unknown; params?: unknown; result?: unknown; error?: unknown };
type Reply = { jsonrpc: "2.0"; id: Id; result?: unknown; error?: { code: number; message: string; data?: unknown } };

const ok = (id: Id, result: unknown): Reply => ({ jsonrpc: "2.0", id, result });
const fail = (id: Id, code: number, message: string): Reply => ({ jsonrpc: "2.0", id, error: { code, message } });

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...CORS, ...headers } });
}

export type RateLimiter = { limit(o: { key: string }): Promise<{ success: boolean }> };

async function answer(msg: Message, ctx: Context): Promise<Reply | undefined> {
  const isRequest = msg.id !== undefined && msg.id !== null && (typeof msg.id === "string" || typeof msg.id === "number");
  const id: Id = isRequest ? (msg.id as string | number) : null;
  // A response from the client (to a request this server never sends): nothing to answer.
  if (msg.method === undefined && ("result" in msg || "error" in msg)) return undefined;
  if (msg.jsonrpc !== "2.0" || typeof msg.method !== "string") return fail(id, -32600, "Invalid request: expected a JSON-RPC 2.0 message with a method.");
  // A notification (initialized, cancelled, …) gets no answer.
  if (!isRequest) return undefined;
  const params = (msg.params && typeof msg.params === "object" ? msg.params : {}) as Record<string, unknown>;
  switch (msg.method) {
    case "initialize": {
      const asked = typeof params.protocolVersion === "string" ? params.protocolVersion : "";
      return ok(id, {
        protocolVersion: PROTOCOL_VERSIONS.includes(asked) ? asked : PROTOCOL_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "charityevals", title: "charityevals", version: "1.0.0", websiteUrl: "https://charityevals.org/ai" },
        instructions: INSTRUCTIONS,
      });
    }
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, { tools: toolList() });
    case "tools/call": {
      const tool = TOOLS.find((t) => t.name === params.name);
      if (!tool) return fail(id, -32602, `Unknown tool: ${String(params.name)}. Tools: ${TOOLS.map((t) => t.name).join(", ")}.`);
      const args = params.arguments ?? {};
      if (typeof args !== "object" || Array.isArray(args)) return fail(id, -32602, "arguments must be an object.");
      try {
        const out = await tool.run(ctx, args as Record<string, unknown>);
        const text = JSON.stringify(out);
        if (text.length > MAX_ANSWER) return ok(id, toolError("That answer is too large. Ask for fewer results (limit) or fewer ids."));
        return ok(id, { content: [{ type: "text", text }], structuredContent: out });
      } catch (e) {
        if (e instanceof ToolError) return ok(id, toolError(e.message));
        if (e instanceof LoadError) {
          console.error("mcp: data failed to load", e.message);
          return fail(id, -32603, "The models couldn't be loaded. Please try again shortly.");
        }
        console.error(`mcp: ${tool.name} failed`, (e as Error).stack);
        return ok(id, toolError("Something went wrong computing that. Please check the ids and values."));
      }
    }
    // Capabilities this server doesn't declare: empty, for clients that ask anyway.
    case "resources/list":
      return ok(id, { resources: [] });
    case "resources/templates/list":
      return ok(id, { resourceTemplates: [] });
    case "prompts/list":
      return ok(id, { prompts: [] });
    default:
      return fail(id, -32601, `Method not found: ${msg.method}`);
  }
}

const toolError = (message: string) => ({ content: [{ type: "text", text: message }], isError: true });

export async function handleMcp(request: Request, ctx: Context, limiter?: RateLimiter): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (request.method === "GET") {
    // A client opening a server-sent stream: this server has none (the spec's answer is 405).
    const accept = request.headers.get("Accept") ?? "";
    if (accept.includes("text/event-stream") && !accept.includes("text/html")) return new Response("No event stream: POST JSON-RPC messages to this address.", { status: 405, headers: { Allow: "GET, POST, OPTIONS", ...CORS } });
    return new Response(NOTE, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600", ...CORS } });
  }
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, POST, OPTIONS", ...CORS } });

  const version = request.headers.get("MCP-Protocol-Version");
  if (version && !PROTOCOL_VERSIONS.includes(version)) return json(fail(null, -32600, `Unsupported MCP-Protocol-Version ${version}; supported: ${PROTOCOL_VERSIONS.join(", ")}.`), 400);
  if (limiter) {
    const key = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await limiter.limit({ key });
    if (!success) return json(fail(null, -32000, "Too many requests. Please wait a minute."), 429, { "Retry-After": "60" });
  }
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_REQUEST) return json(fail(null, -32600, "Request too large."), 413);
  const text = await request.text();
  if (text.length > MAX_REQUEST) return json(fail(null, -32600, "Request too large."), 413);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json(fail(null, -32700, "Parse error: the body isn't JSON."), 400);
  }
  if (Array.isArray(body)) {
    if (!body.length || body.length > 20) return json(fail(null, -32600, "A batch holds 1 to 20 messages."), 400);
    const replies = (await Promise.all(body.map((m) => answer((m ?? {}) as Message, ctx)))).filter((r): r is Reply => !!r);
    return replies.length ? json(replies) : new Response(null, { status: 202, headers: CORS });
  }
  if (!body || typeof body !== "object") return json(fail(null, -32600, "Invalid request."), 400);
  const reply = await answer(body as Message, ctx);
  // Notifications and responses from the client: accepted, nothing to say.
  return reply ? json(reply) : new Response(null, { status: 202, headers: CORS });
}
