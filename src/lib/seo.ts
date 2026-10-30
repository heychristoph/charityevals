// Search and social metadata: page titles and descriptions generated from the models, and the
// schema.org JSON-LD each page carries. Build time only. Nothing here states more than the page does:
// results are the page's own default-assumption figures, and models are credited to whoever made them.
import { lib, modelUrl, primaryOf, modelFile, rankable } from "./data";
import { assumptionValues, comparable, headline, modelsOf, type ResolvedModel } from "../engine/model";
import { formatYears, plainModelName } from "./format";
import { publisher, repo } from "./site";

export const SITE = "https://charityevals.org";
export const SITE_NAME = "charityevals";
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;

export const abs = (path: string) => new URL(path, SITE).toString();

/** About what a search result shows of a title. */
export const TITLE_MAX = 60;
const SUFFIX = ` · ${SITE_NAME}`;

/** The document title: the page's own, plus the site name where it still fits a search result. */
export function documentTitle(title: string): string {
  const t = title.replace(/\s+/g, " ").trim();
  return t.includes(SITE_NAME) || t.length + SUFFIX.length > TITLE_MAX ? t : t + SUFFIX;
}

/** The canonical form of a built page's path: no ".html", no trailing slash (except the root). */
export function canonicalPath(pathname: string): string {
  const p = pathname.replace(/\.html$/, "").replace(/\/index$/, "/");
  return p.length > 1 ? p.replace(/\/+$/, "") : "/";
}

/** Shortens text to at most `max` characters at a word boundary. */
export function clip(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.–—-]+$/, "")}…`;
}

const firstSentence = (s?: string) => s?.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? s;
const monthYear = (d?: string) => (d ? new Date(d).toLocaleDateString("en-GB", { year: "numeric", month: "long" }) : undefined);

/** The page's own headline figure: years of healthy life per $1,000, default assumptions, our view
 * (what a first-time visitor sees). Undefined for units nobody converts. */
export function defaultYears(m: ResolvedModel): number | undefined {
  if (!comparable(lib, m)) return undefined;
  const av = assumptionValues(lib.assumptions);
  const v = headline(lib, m, av);
  return Number.isFinite(v) && v > 0 ? v : undefined;
}

const spaced = (s: string) => s.replace(/\s+/g, " ").trim();
/** Without what an evaluator's file name keeps in square brackets (the grant it was for, "copy"). */
const unbracketed = (s: string) => spaced(s.replace(/\[[^\]]*\]/g, " ")).replace(/\s+([,)])/g, "$1").replace(/^[,\s]+|[,\s—–-]+$/g, "");
/** Bracketed notes as a plain aside: "[Borno copy] GiveWell's …" → "GiveWell's … (Borno copy)". */
const unboxed = (s: string) => {
  const notes = [...s.matchAll(/\[([^\]]*)\]/g)].map((x) => x[1].trim());
  return notes.length ? `${unbracketed(s)} (${notes.join("; ")})` : spaced(s);
};

let names: Map<string, string> | undefined;
/** A model's name for titles and descriptions: plain words (no "CEA", versions or bracketed grant
 * notes), but never the same as another page's. Where the plain name is shared, the bracketed note
 * comes back as an aside, then the month it was published, and failing that, the evaluator's own name. */
export function seoName(m: ResolvedModel): string {
  if (!names) {
    const count = (f: (x: ResolvedModel) => string) => {
      const c = new Map<string, number>();
      for (const x of rankable) c.set(f(x).toLowerCase(), (c.get(f(x).toLowerCase()) ?? 0) + 1);
      return (x: ResolvedModel) => c.get(f(x).toLowerCase())! === 1;
    };
    const bare = (x: ResolvedModel) => unbracketed(plainModelName(x.name));
    const boxed = (x: ResolvedModel) => unboxed(plainModelName(x.name));
    const dated = (x: ResolvedModel) => `${boxed(x)} (${monthYear(x.source?.published) ?? "undated"})`;
    const bareOk = count(bare), boxedOk = count(boxed), datedOk = count(dated);
    names = new Map(rankable.map((x) => [x.id, bareOk(x) ? bare(x) : boxedOk(x) ? boxed(x) : datedOk(x) ? dated(x) : spaced(x.name)]));
  }
  return names.get(m.id) ?? unbracketed(plainModelName(m.name));
}

const CAUSE = { "global-health": "Global health", "animal-welfare": "Animal welfare", "ai-safety": "AI safety" } as const;

export function modelMeta(m: ResolvedModel) {
  const charity = lib.charities.get(m.charity)!;
  const owner = lib.owners.get(m.owner)!;
  const primary = primaryOf(lib, charity.id)?.id === m.id;
  const evaluators = new Set(modelsOf(lib, charity.id).map((x) => x.owner)).size;
  // Imported model names can be long and contain line breaks; some don't name the charity.
  const name = seoName(m);
  const named = name.toLowerCase().includes(charity.name.toLowerCase());
  // The first candidate that fits a search result (about 60 characters); else the shortest, which is
  // still unique: model names are.
  const candidates = primary
    ? [`${charity.name}: cost-effectiveness (${owner.short})`, `${charity.name}: cost-effectiveness`, charity.name]
    : [`${name}: ${owner.name} model`, ...(named ? [] : [`${charity.name}: ${name} (${owner.short})`]), `${name} (${owner.short})`, name];
  if (primary && evaluators > 1) candidates.shift();
  const title = candidates.find((t) => t.length <= TITLE_MAX) ?? candidates.at(-1)!;

  const x = defaultYears(m);
  const unit = m.output ? lib.assumptions.units[m.output.unit]?.label : undefined;
  const when = monthYear(m.source?.published);
  const by = owner.kind === "charityevals" ? "charityevals' own model" : `${owner.name}'s model${when ? ` (${when})` : ""}`;
  // Long model names are in the title already; the description leads with the charity instead.
  const subject = name.length <= 50 ? name : charity.name;
  const lead = x !== undefined
    ? `${subject}: ${formatYears(x)} years of healthy life per $1,000 on default assumptions, from ${by}.`
    : `${subject}: ${by}, in ${unit ?? "its own unit"} per dollar.`;
  const dek = firstSentence(charity.summary ?? m.summary);
  const tail = "Every input with its source and range.";
  const description = [dek, tail].reduce<string>((acc, s) => (s && `${acc} ${s}`.length <= 160 ? `${acc} ${s}` : acc), lead);
  return { charity, owner, primary, name, title, description: clip(description), cause: CAUSE[charity.cause] };
}

const CC_BY_NC_SA_3_US = "https://creativecommons.org/licenses/by-nc-sa/3.0/us/";

/** JSON-LD for a model page: the page, the charity it is about, the model as a dataset, breadcrumbs. */
export function modelSchema(m: ResolvedModel, description: string) {
  const { charity, owner, primary, name } = modelMeta(m);
  const url = abs(modelUrl(lib, m));
  const charityUrl = abs(modelUrl(lib, primaryOf(lib, charity.id)!));
  const ownerNode = owner.kind === "charityevals"
    ? { "@id": ORG_ID }
    : { "@type": "Organization", name: owner.name, url: owner.url };
  const charityNode = {
    "@type": "NGO",
    "@id": `${charityUrl}#charity`,
    name: charity.name,
    ...(charity.website && { url: charity.website, sameAs: [charity.website] }),
  };
  const dataset = {
    "@type": "Dataset",
    "@id": `${url}#model`,
    name: `${name}: cost-effectiveness model`,
    description: clip(m.summary && m.summary.length >= 50 ? m.summary : description, 5000),
    url,
    creator: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isAccessibleForFree: true,
    about: { "@id": `${charityUrl}#charity` },
    keywords: ["cost-effectiveness analysis", CAUSE[charity.cause].toLowerCase(), charity.name, owner.name],
    distribution: [{
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: `https://raw.githubusercontent.com/heychristoph/charityevals/main/${modelFile(m)}`,
    }],
    ...(m.source && {
      // The evaluator's analysis this model reproduces, and its spreadsheet.
      isBasedOn: [
        {
          "@type": "CreativeWork",
          name: m.source.title,
          url: m.source.url,
          author: ownerNode,
          ...(m.source.published && { datePublished: m.source.published }),
          ...(m.source.license === "CC BY-NC-SA 3.0 US" && { license: CC_BY_NC_SA_3_US }),
        },
        ...(m.source.sheet ? [{ "@type": "DigitalDocument", name: `${m.source.title}: spreadsheet`, url: m.source.sheet, author: ownerNode }] : []),
      ],
    }),
  };
  const crumbs = [
    { name: "Rankings", url: abs("/") },
    { name: charity.name, url: charityUrl },
    ...(primary ? [] : [{ name, url }]),
  ];
  return [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": `${charityUrl}#charity` },
      mainEntity: { "@id": `${url}#model` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    charityNode,
    dataset,
    breadcrumbList(crumbs, `${url}#breadcrumb`),
  ];
}

export function breadcrumbList(items: { name: string; url: string }[], id?: string) {
  return {
    "@type": "BreadcrumbList",
    ...(id && { "@id": id }),
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
  };
}

/** The site and its publisher, on the home page. */
export function siteSchema() {
  return [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: abs("/"),
      name: SITE_NAME,
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: abs("/"),
      logo: { "@type": "ImageObject", url: abs("/icon-512.png"), width: 512, height: 512 },
      email: publisher.email,
      founder: { "@type": "Person", name: publisher.name, url: publisher.url },
      sameAs: [repo],
    },
  ];
}

/** Serialises JSON-LD for a <script> element: one @graph, with "<" escaped so no string can close it. */
export function jsonLd(nodes: object[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c");
}
