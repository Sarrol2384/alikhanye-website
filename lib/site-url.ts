/**
 * Public site origin for robots, sitemap, canonical URLs and JSON-LD.
 *
 * Set NEXT_PUBLIC_SITE_URL on Vercel to the real domain (for example
 * https://alikhanye.co.za). Until that is set, production builds must not
 * advertise localhost.
 */
const PRODUCTION_FALLBACK = "https://alikhanye-website.vercel.app";

function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const host = trimmed.split("/")[0] ?? trimmed;
  const protocol = /^(localhost|127\.0\.0\.1)(:|$)/i.test(host)
    ? "http"
    : "https";
  return `${protocol}://${trimmed}`;
}

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalizeSiteUrl(explicit);

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionHost) return normalizeSiteUrl(productionHost);

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) return normalizeSiteUrl(vercelHost);

  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    return PRODUCTION_FALLBACK;
  }

  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = getSiteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
