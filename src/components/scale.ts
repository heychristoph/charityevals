/** The one log scale every comparison uses: 1 to 100,000 years of healthy life per $1,000. Fixed,
 * so a bar means the same length on every page. Values outside are clamped and marked. */
export const DOMAIN: [number, number] = [1, 100000];
export const TICKS = [1, 10, 100, 1000, 10000, 100000];

export function xFor(v: number, width: number, domain = DOMAIN): number {
  const [a, b] = domain.map(Math.log10);
  const t = (Math.log10(Math.min(Math.max(v, domain[0]), domain[1])) - a) / (b - a);
  return t * width;
}

/** CSS for a bar spanning [lo%, hi%] of its track, as a clip-path. Written the way browsers
 * normalise it, so server-rendered and hydrated markup match exactly. */
export function clipSpan(lo: number, hi: number, radius: string): string {
  const r = (v: number) => `${Number(v.toFixed(1))}%`;
  return `inset(0px ${r(100 - hi)} 0px ${r(lo)} round ${radius})`;
}

/** Left offset as a rounded percentage string. */
export const pctStr = (v: number) => `${Number(v.toFixed(1))}%`;

export function tickLabel(t: number): string {
  return t >= 1000 ? `${t / 1000}k` : `${t}`;
}
