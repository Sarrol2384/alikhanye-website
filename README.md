# Alikhanye Properties

R1999 Starter marketing website for **Alikhanye Properties** — a real estate site (Home, About, Properties, Contact) built with Next.js and ready for Vercel.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui (subset)
- react-hook-form + Zod + Sonner
- Brevo transactional email for contact enquiries
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
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Agency admin (you — not the client)

1. Open [http://localhost:3000/admin](http://localhost:3000/admin) (or `/admin/login`).
2. Sign in with `ADMIN_PASSWORD` from `.env.local` (default demo password: `alikhanye2026`).
3. Click **Add listing**, upload photos, fill details, publish.

Listings are saved to `data/listings.json`. Uploaded photos go to `public/properties/`.

**Note:** File-based admin works for local demos and traditional Node hosting. On Vercel’s serverless filesystem, writes are not persistent — migrate listings to a database (e.g. Convex) before relying on production admin, or add listings locally and commit `data/listings.json` + images before deploy.

Client self-serve upload is intentionally not included — sell that as a paid CMS add-on.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `BREVO_API_KEY` | For live email | Brevo API key |
| `BREVO_SENDER_EMAIL` | For live email | Verified Brevo sender |
| `CONTACT_TO_EMAIL` | Recommended | Enquiry inbox (default: `admin@alikhanye.com`) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL for metadata/sitemap |
| `ADMIN_PASSWORD` | Recommended | Password for `/admin` |
| `ADMIN_SECRET` | Optional | Cookie signing secret |

Without `BREVO_API_KEY`, the contact API still accepts submissions but skips sending email (logged as a warning).

## Scripts

```bash
npm run dev      # local development
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Set the environment variables above.
4. Deploy.

For production listing management on Vercel, plan a Convex/database upgrade so admin writes persist.

## Brand assets

Place brand files in `public/brand/`:

- `logo.png`
- `founder.png`
- `banner.png`
