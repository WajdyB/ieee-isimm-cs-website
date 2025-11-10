# IEEE Computer Society ISIMM Website

This repository contains the marketing website and lightweight admin console for the IEEE Computer Society student branch at ISIMM. It is built with the Next.js App Router and integrates a MongoDB backend for managing public-facing content such as events, committee members, and media assets.

The project ships with an admin dashboard for authenticated members to curate events, upload images, and keep the public site fresh without diving into code.

---

## Table of Contents

1. [Core Features](#core-features)
2. [Tech Stack](#tech-stack)
3. [Quick Start](#quick-start)
4. [Environment Variables](#environment-variables)
5. [Available Scripts](#available-scripts)
6. [Project Structure](#project-structure)
7. [Key Pages & Flows](#key-pages--flows)
8. [API Surface](#api-surface)
9. [Data & Storage](#data--storage)
10. [Deployment Notes](#deployment-notes)
11. [Troubleshooting](#troubleshooting)
12. [Contributing](#contributing)
13. [License](#license)

---

## Core Features

- **Hero site for IEEE CS ISIMM** with mission overview, stats, and calls-to-action in `app/page.tsx`.
- **Dynamic About page** highlighting values, mission, and gallery assets from `lib/images`.
- **Events hub** that reads from MongoDB and showcases recent activities on the homepage (`/`) and the dedicated `app/events` route.
- **Admin dashboard** (`/admin`) with credential-gated access, letting authorized users create, list, and delete events, upload media, and manage visibility.
- **Projects portfolio** (`/projects`) showcasing in-house tools and initiatives with repo links, tech stack, and deployment info.
- **Contact hub** (`/contact`) where visitors can reach the chapter through a modern form routed to the official inbox.
- **Image upload pipeline** backed by MongoDB GridFS and served through streaming routes for efficient delivery.
- **Shadcn/ui design system** and Tailwind CSS for consistent styling, theming, and accessible components (`components/ui`).
- **Robust helper docs** including `SETUP.md` and `TROUBLESHOOTING.md` with deeper configuration notes.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript, server actions)
- **Language:** TypeScript + React 18
- **Styling:** Tailwind CSS, CSS Modules, custom animations in `app/globals.css`
- **UI Kit:** shadcn/ui + Radix primitives
- **Data Layer:** MongoDB (driver v6) with GridFS for binary storage
- **Forms & Validation:** React Hook Form, Zod, `@hookform/resolvers`
- **Charts & Visuals:** Recharts, Embla carousel
- **Tooling:** PostCSS, Autoprefixer, ESLint via `next lint`

---

## Quick Start

1. **Install prerequisites**
   - Node.js 18.17+ (Next.js 15 requirement)
   - npm (bundled), pnpm, or yarn
   - MongoDB Atlas or self-hosted MongoDB instance

2. **Clone and install**
   ```bash
   git clone https://github.com/<org>/ieee-cs-isimm-website.git
   cd ieee-cs-isimm-website
   npm install
   ```

3. **Configure environment**
   - Copy `.env.local.example` (if available) or create `.env.local`.
   - Fill in the variables listed in [Environment Variables](#environment-variables).

4. **Run in development**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the admin dashboard.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

For a more detailed walkthrough (including database provisioning), consult `SETUP.md`.

---

## Environment Variables

Create a `.env.local` file in the project root with:

```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strong_password_here
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL_FROM=IEEE CS ISIMM <onboarding@resend.dev>
CONTACT_EMAIL_TO=ieee.cs.isimm@gmail.com

# Optional
DEBUG=true
```

- `MONGODB_URI` must point to a database with read/write permissions. Atlas SRV URIs are supported.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` define the credentials checked by `app/api/auth/login/route.ts`.
- `RESEND_API_KEY` authenticates requests to the Resend email API used by `/api/contact`.
- `CONTACT_EMAIL_FROM` is the verified sender address configured in Resend.
- `CONTACT_EMAIL_TO` accepts a single email or comma-separated list that will receive contact submissions.
- `DEBUG` enables verbose logging in diagnostic endpoints like `/api/test`.

Next.js automatically injects these into the server runtime. Never commit real credentials to git.

---

## Available Scripts

| Script        | Description                                           |
|---------------|-------------------------------------------------------|
| `npm run dev` | Start the Next.js development server                  |
| `npm run build` | Create a production build                            |
| `npm run start` | Launch the production server (after `npm run build`) |
| `npm run lint` | Run ESLint via `next lint`                            |

---

## Project Structure

```text
app/
  layout.tsx            # Global layout & metadata
  globals.css           # Global styles & Tailwind base
  page.tsx              # Home page with recent events and hero content
  about/page.tsx        # Mission, vision, and gallery page
  events/page.tsx       # Events listing (MongoDB-backed)
  projects/page.tsx     # Portfolio-style showcase of chapter projects
  committee/page.tsx    # Committee introduction (static assets)
  contact/page.tsx      # Contact form with inbox integration
  admin/page.tsx        # Credential-gated admin dashboard
  api/                  # REST-ish endpoints for auth, events, uploads, testing
components/
  header.tsx, footer.tsx, theme-provider.tsx
  ui/                   # shadcn/ui component primitives
hooks/                  # Shared React hooks (toast, mobile detection)
lib/
  api.ts                # Client-side fetch helpers for admin actions
  mongodb.ts            # MongoDB connection lifecycle helpers
  images.ts             # Static image metadata for galleries
public/
  images/, logos/       # Static assets served by Next.js
scripts/
  optimize-images.js    # Utility scripts for asset management
SETUP.md, TROUBLESHOOTING.md
tailwind.config.ts, tsconfig.json, postcss.config.mjs
```

---

## Key Pages & Flows

- **Home (`/`)**: Fetches recent events through `/api/events`, animates sections on scroll, and drives users to key CTAs like About and Events.
- **About (`/about`)**: Tells the IEEE CS ISIMM story with mission/vision cards and a responsive gallery sourced from `lib/images`.
- **Events (`/events`)**: Server component that pulls all events, providing a public catalog of activities with dates, locations, and images.
- **Committee (`/committee`)**: Highlights leadership with static member profiles stored in `public/images/committee`.
- **Projects (`/projects`)**: Portfolio gallery with animated cards, tech tags, and GitHub/live links for flagship builds.
- **Contact (`/contact`)**: Streamlined contact form that posts to `/api/contact` and emails the chapter team.
- **Admin (`/admin`)**: Client-side dashboard providing:
  - Email/password login using environment-backed credentials.
  - Event CRUD operations (create + delete out of the box; update hook ready for extension).
  - GridFS-backed image uploads with size/type validation.

---

## API Surface

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/login` | `POST` | Validates credentials against `ADMIN_EMAIL` and `ADMIN_PASSWORD`. |
| `/api/events` | `GET` | Returns all events sorted by creation date. |
| `/api/events` | `POST` | Validates payload and inserts a new event document. |
| `/api/events/[id]` | `DELETE` | Removes an event by MongoDB ObjectId. |
| `/api/upload` | `POST` | Accepts multi-part form data, stores images in GridFS, returns URLs. |
| `/api/upload/[id]` | `GET` | Streams an uploaded image by GridFS id. |
| `/api/test` | `GET` | Sanity-check endpoint for database connectivity / configuration. |
| `/api/env-test` | `GET` | Lightweight endpoint for verifying env variable exposure. |
| `/api/contact` | `POST` | Validates contact form submissions and forwards emails through Resend. |

All endpoints leverage the shared MongoDB client in `lib/mongodb.ts` to reuse connections across requests.

---

## Data & Storage

- **Events Collection (`events`)**
  ```json
  {
    "_id": "ObjectId",
    "title": "Intro to AI",
    "description": "Workshop covering machine learning basics",
    "date": "2024-11-05",
    "location": "ISIMM Campus",
    "attendees": 120,
    "images": ["/api/upload/<gridfs-id>"],
    "created_at": "ISODate",
    "updated_at": "ISODate"
  }
  ```

- **Admin Users (`admin_users`)**
  - Not yet persisted; credentials are environment-based. Extend `app/api/auth/login` to query MongoDB if needed.

- **Media Storage**
  - GridFS bucket `event-images` retains original uploads.
  - Retrieval is proxied through `/api/upload/[id]` to preserve access control and avoid leaking MongoDB specifics.

---

## Deployment Notes

- Ensure `MONGODB_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are configured in the hosting provider (Vercel, Netlify, etc.).
- For Vercel deployments:
  - Enable the Node.js runtime.
  - Add the environment variables under Project Settings → Environment Variables.
  - If using GridFS, confirm your MongoDB cluster allows network access from Vercel IPs (or use a secure VPN/VPC).
- Run `npm run build` locally before deploying to catch type or lint issues early.

---

## Troubleshooting

- Visit `/api/test` locally to confirm database connectivity (`success: true` indicates a healthy connection).
- See `SETUP.md` for verbose setup steps, admin usage, and security checklists.
- Consult `TROUBLESHOOTING.md` for common database and login issues, including `MONGODB_URI` verification tips.
- Enable `DEBUG=true` in `.env.local` to surface extra logs during development (use sparingly in production).

---

## Contributing

1. Fork the repository and create a feature branch (`git checkout -b feature/amazing-upgrade`).
2. Follow the coding style enforced by ESLint and the existing shadcn/ui patterns.
3. Keep UI components composable and maintain accessibility best practices.
4. Run `npm run lint` and (optionally) `npm run build` before opening a pull request.
5. Document notable changes in this README or supplementary guides when relevant.

Have ideas or spot a bug? Open an issue describing the context, reproduction steps, and expected behavior.

---

## License

No license file is currently provided. All rights are reserved by the IEEE Computer Society ISIMM Student Branch. Contact the maintainers for reuse or distribution inquiries.


