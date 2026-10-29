# Alikhanye Properties

R1999 Starter marketing website for **Alikhanye Properties** — a real estate site (Home, About, Properties, Contact) built with Next.js and ready for Vercel.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui (subset)
- react-hook-form + Zod + Sonner
- Brevo transactional email for contact enquiries
- **Supabase** for listings + property photos (production admin)
- Agency admin for listings (`/admin`)

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero, services, featured properties, service areas, CTA |
| `/about` | Company story, vision/mission, principal |
| `/properties` | All property listings |
| `/properties/[id]` | Listing detail with enquire / WhatsApp |
| `/contact` | Contact details, enquiry form, Google Maps |
| `/admin` | Agency-only listings admin (password protected) |

## Getting started

```bash
npm install
cp .env.local.example .env.local
# Add Supabase keys to .env.local (see below)
npm run db:setup   # creates storage bucket + seeds sample listing
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase one-time setup

1. Create a Supabase project and add these to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Run the SQL in `supabase/migrations/001_listings.sql` in **Supabase → SQL Editor**  
   *(or set `SUPABASE_DB_URL` from **Settings → Database → Connection string** and run `npm run db:setup` to apply it automatically)*.
3. Run `npm run db:setup` to create the `property-images` bucket and import `data/listings.json` if the table is empty.

Without Supabase env vars, listings fall back to `data/listings.json` and `public/properties/` (local dev only).

## Agency admin (you — not the client)

1. Open [http://localhost:3000/admin](http://localhost:3000/admin) (or `/admin/login`).
2. Sign in with `ADMIN_PASSWORD` from `.env.local`. `ADMIN_SECRET` must be set as well. If either is missing, login is refused — there is no built-in password.
3. Click **Add listing**, upload photos, fill details, publish.

The old admin password was committed in this repository. Set a new password on Vercel and do not reuse the published one.

Listings and uploads persist in Supabase when configured — works on Vercel serverless.

Client self-serve upload is intentionally not included — sell that as a paid CMS add-on.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `BREVO_API_KEY` | For live email | Brevo API key |
| `BREVO_SENDER_EMAIL` | For live email | Verified Brevo sender |
| `CONTACT_TO_EMAIL` | Recommended | Enquiry inbox (default: `admin@alikhanye.com`) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public site URL for canonical links, sitemap and sharing. If unset, production uses `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`, then `https://alikhanye-website.vercel.app`. Local dev still uses localhost. |
| `ADMIN_PASSWORD` | Required for admin | Password for `/admin`. Do not reuse a password that was ever committed to the repo. |
| `ADMIN_SECRET` | Required for admin | Cookie signing secret. Login is refused when this is missing. |
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Supabase anon key (public reads via RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Server-only key for admin CRUD + uploads |
| `SUPABASE_DB_URL` | Optional | Postgres URI for `npm run db:setup` migrations |

Without `BREVO_API_KEY`, the contact form returns an error and does not pretend the message was sent. No email is sent unless Brevo accepts it.

## Scripts

```bash
npm run dev       # local development
npm run build     # production build
npm run start     # serve production build
npm run lint      # ESLint
npm run db:setup  # Supabase bucket + seed (after SQL migration)
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Set all environment variables above (including Supabase keys).
4. Run the SQL migration in Supabase if not done already.
5. Deploy.

Admin **Publish listing** and photo uploads work in production once Supabase is configured.

## Brand assets

Place brand files in `public/brand/`:

- `logo.jpg`
- `founder.jpg`
- `banner.png`
