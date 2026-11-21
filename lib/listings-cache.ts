/** Data-cache tag for public listing reads. Admin edits expire this tag. */
export const LISTINGS_CACHE_TAG = "listings";

/**
 * Seconds between public listing refreshes.
 * Keep this in sync with `export const revalidate = 300` on the marketing
 * layout and sitemap — Next.js only accepts a literal there.
 */
export const LISTINGS_REVALIDATE_SECONDS = 300;
