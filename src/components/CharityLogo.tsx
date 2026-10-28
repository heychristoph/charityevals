import logos from "../../generated/logos.json";
import "./charity-logo.css";

// Logos are trademarks of their owners, shown only to identify each charity. scripts/fetch-logos.ts
// fetches them from each charity's own site; generated/logos.json records each one's source.
const LOGOS: Record<string, { file: string; bleed: boolean }> = logos;

const SMALL_WORDS = new Set(["the", "of", "for", "and", "on", "in", "de", "da", "do"]);

/** One or two initials: "Against Malaria Foundation" → "AM", "J-PAL" → "J". */
export function monogram(name: string): string {
  const words = name.split(/[\s/]+/).filter((w) => w && !SMALL_WORDS.has(w.toLowerCase()));
  return words.slice(0, 2).map((w) => [...w][0].toUpperCase()).join("");
}

type Props = {
  id: string;
  name: string;
  /** Edge in CSS px; the files are 128px, sharp up to 4x density at 32px. */
  size?: 16 | 24 | 32 | 40;
  /** Rows below the fold load lazily; logos in a page header load eagerly. */
  lazy?: boolean;
  className?: string;
};

/** A charity's logo as a small rounded tile, or its initials when we have no logo. Decorative: it
 * always sits next to the charity's name, so it carries no alt text. */
export default function CharityLogo({ id, name, size = 32, lazy = true, className }: Props) {
  const logo = LOGOS[id];
  const cls = ["charity-logo", `charity-logo-${size}`, logo?.bleed && "charity-logo-bleed", !logo && "charity-logo-monogram", className]
    .filter(Boolean)
    .join(" ");
  if (!logo) {
    return (
      <span className={cls} aria-hidden="true">
        {monogram(name)}
      </span>
    );
  }
  return <img className={cls} src={logo.file} width={size} height={size} alt="" loading={lazy ? "lazy" : "eager"} decoding="async" />;
}
