// The site is static: Cloudflare serves dist/ directly. This Worker only runs for /api/* (see
// run_worker_first in wrangler.jsonc) and handles one thing: the "suggest a charity" form. It is sent
// through Email Routing, which only delivers to the account's verified destination addresses: the
// secret SUGGEST_TO, the inbox hello@charityevals.org forwards to.

const CONTACT = "hello@charityevals.org";
const FROM = { email: "forms@charityevals.org", name: "charityevals suggestions" };
const MAX_BODY = 20_000;
const MIN_FILL_MS = 3_000; // bots post instantly; people take longer than this to fill the form in

type Fields = { charity: string; website: string; why: string; email: string };

function validate(form: FormData): { fields?: Fields; error?: string; spam?: boolean } {
  const get = (k: string) => String(form.get(k) ?? "").trim();
  // Honeypot: a field people never see. Anything in it is a bot.
  if (get("company_url")) return { spam: true };
  // The page script stamps when the form was opened; without JavaScript there's no stamp, and the
  // honeypot alone has to do. A stamp that says the form was filled in instantly is a bot.
  const started = Number(get("started"));
  if (started && Date.now() - started < MIN_FILL_MS) return { spam: true };
  const fields = { charity: get("charity"), website: get("website"), why: get("why"), email: get("email") };
  if (fields.charity.length < 2 || fields.charity.length > 200) return { error: "Please give the charity's name." };
  if (fields.website && (!/^https?:\/\/\S+\.\S+/i.test(fields.website) || fields.website.length > 300))
    return { error: "The website should be a full address, starting with https://." };
  if (fields.why.length > 4000) return { error: "Please keep the note under 4,000 characters." };
  if (fields.email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) || fields.email.length > 200))
    return { error: "That email address doesn't look right." };
  return { fields };
}

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

async function suggest(request: Request, env: Env): Promise<Response> {
  const wantsJson = (request.headers.get("Accept") ?? "").includes("application/json");
  const reply = (status: number, body: { ok: boolean; error?: string }) =>
    wantsJson
      ? Response.json(body, { status })
      : Response.redirect(new URL(body.ok ? "/suggest/?sent=1" : `/suggest/?error=${encodeURIComponent(body.error ?? "")}`, request.url).toString(), 303);

  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY) return reply(413, { ok: false, error: "That's too long to send." });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(400, { ok: false, error: "The form didn't come through. Please try again." });
  }
  const { fields, error, spam } = validate(form);
  // Bots get the same answer as people, so they learn nothing from it.
  if (spam) return reply(200, { ok: true });
  if (!fields) return reply(400, { ok: false, error });

  const lines = [
    `Charity: ${fields.charity}`,
    `Website: ${fields.website || "(not given)"}`,
    `From: ${fields.email || "(no email given)"}`,
    "",
    fields.why || "(no note)",
  ];
  if (!env.SUGGEST_TO) {
    console.error("SUGGEST_TO is not set: run `wrangler secret put SUGGEST_TO`");
    return reply(503, { ok: false, error: `The form isn't set up yet. Please email ${CONTACT} instead.` });
  }
  try {
    await env.SUGGESTIONS.send({
      to: env.SUGGEST_TO,
      from: FROM,
      subject: `Charity suggestion: ${fields.charity.slice(0, 120)}`,
      text: lines.join("\n"),
      html: `<p>${lines.map(escape).join("<br>")}</p>`,
      ...(fields.email ? { replyTo: fields.email } : {}),
    });
  } catch (e) {
    console.error("suggestion email failed", (e as { code?: string }).code, (e as Error).message);
    return reply(502, { ok: false, error: `It didn't send. Please email ${CONTACT} instead.` });
  }
  return reply(200, { ok: true });
}

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/suggest") return suggest(request, env);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
