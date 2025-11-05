# Financial Dashboard Application

A secure, full-stack financial dashboard for managing invoices, featuring protected routes, user authentication, and optimized data handling.

## Key Features
- User Authentication: Secure login and sign-out using NextAuth.js.
- Protected Dashboard: Role-based access control for sensitive routes.
- Invoice Customer Management (CRUD): Create, read, update, delete invoices.
- Search and Pagination: Efficient querying and navigation using URL search params.
- Optimized Data Handling: React Server Components and Server Actions.
- Modern UI: Responsive, accessible interface (Tailwind CSS or similar).

## Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14+ | Full-stack React framework (App Router) |
| Language | JavaScript / TypeScript | Core language (TypeScript recommended) |
| Database | PostgreSQL | Relational data storage |
| Authentication | NextAuth.js | Authentication and session management |
| Styling | Tailwind CSS (or similar) | Utility-first styling |
| Data Layer | React Server Actions | Server-side data mutation and caching |

## Getting Started

Prerequisites:
- Node.js v18.18.0 or later
- pnpm (Install globally: npm install -g pnpm)
- Git

Local setup:

1. Clone the repository
```bash
git clone https://github.com/ajmikallu/nextjs-dashboard.git
cd nextjs-dashboard
```

2. Install dependencies
```bash
pnpm install
```

3. Create environment variables
Create a `.env` file in the project root and set the following variables:

| Variable | Description |
|---|---|
| AUTH_SECRET | Long secret for signing NextAuth sessions |
| AUTH_URL | App URL (e.g., http://localhost:3000) |
| POSTGRES_URL | PostgreSQL connection string |
| POSTGRES_PRISMA_URL | (If using Prisma) optimized Prisma connection |
| POSTGRES_URL_NON_POOLING | (Vercel Postgres) non-pooled URL |
| POSTGRES_USER / POSTGRES_HOST / POSTGRES_PASSWORD / POSTGRES_DATABASE | Optional individual DB credentials |

4. Local database
- Use a local PostgreSQL instance or Docker.
- Ensure the DB is running and `.env` connection strings are correct.
- Seed the database (if available):
```bash
pnpm run seed
```

5. Run development server
```bash
pnpm run dev
```
App will be available at http://localhost:3000.

## Deployment

Prepare a PostgreSQL database (Vercel Postgres or Supabase) before deployment.

Option A — Vercel Postgres
- Create a Postgres instance in Vercel Storage.
- Link the database to the project.
- Vercel will provide POSTGRES_URL and related environment variables.

Option B — Supabase
- Create a Supabase project and copy the connection string (Project Settings > Database > Connection Info).
- Set POSTGRES_URL in Vercel or `.env`.

Vercel deployment steps:
1. Import repository in Vercel.
2. Set Framework Preset to Next.js.
3. Add required environment variables (AUTH_SECRET, DB connection, etc.).
4. Deploy.

Post-deploy: run seed script against production DB if needed (one-off).

## Usage Notes

- Always enforce server-side permission checks for protected routes and API routes.
- Use role-based checks inside server actions and API handlers.
- Use client-side `can()` checks only for UI visibility; do not rely on them for security.

## Common Commands

- Install: `pnpm install`
- Seed DB: `pnpm run seed`
- Dev: `pnpm run dev`
- Build: `pnpm run build`
- Start: `pnpm run start`

## Troubleshooting

- "User doesn't have permission": verify user's role and role permissions in the database.
- Session missing role: sign out and sign back in; confirm auth callbacks include role and token contains it.
- Database connection errors: verify `.env` values and DB availability.

## Notes

- Project assumes TypeScript for type safety but can run in JavaScript.
- Adjust seeding and DB scripts to match your chosen ORM or client (Prisma, Supabase client, etc.).