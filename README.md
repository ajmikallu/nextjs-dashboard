# Financial Dashboard Application

A secure, full-stack financial dashboard for managing invoices and customers. Includes role-based access, protected routes, and optimized data handling using Next.js App Router and server actions.

## Key Features
- User authentication (NextAuth.js)
- Role-based access control (RBAC)
- Invoice & customer management (CRUD)
- Blog posts (simple CMS) with create/edit/delete
- Search, pagination, and server-side validation
- React Server Components + Server Actions
- Tailwind CSS for responsive UI

## Technology Stack

| Category       | Technology                         |
|---------------:|------------------------------------|
| Framework      | Next.js (App Router)               |
| Language       | TypeScript                         |
| Database       | PostgreSQL                         |
| Auth          | NextAuth.js                         |
| Styling        | Tailwind CSS (+ optional plugins)  |
| Data layer     | Server Actions / postgres client   |
| Containerization| Docker (optional)                 |

---

## Getting Started

### Prerequisites
- Node.js v18.18.0 or later
- pnpm (install globally: `npm install -g pnpm`)
- Git

Optional:
- Docker & Docker Compose (recommended for consistent environments)

### Local (without Docker)

1. Clone repo
```bash
git clone https://github.com/ajmikallu/nextjs-dashboard.git
cd nextjs-dashboard
```

2. Install dependencies
```bash
pnpm install
```

3. Create `.env` in the project root and set required variables:
```env
AUTH_SECRET=your-auth-secret
NEXTAUTH_URL=http://localhost:3000
POSTGRES_URL=postgres://user:password@localhost:5432/dashboard
POSTGRES_PRISMA_URL=postgres://user:password@localhost:5432/dashboard
POSTGRES_USER=postgres
POSTGRES_HOST=localhost
POSTGRES_PASSWORD=your-password
POSTGRES_DATABASE=dashboard
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

4. Ensure PostgreSQL is running (local or cloud). Seed DB if a seed script is provided:
```bash
pnpm run seed
```

5. Run dev server
```bash
pnpm run dev
```
Open: http://localhost:3000

---

### Docker (recommended for teams)

1. Clone repo and create `.env` as above.

2. Build and run
```bash
docker-compose build
docker-compose up
```

3. Seed the database (in another terminal):
```bash
docker-compose exec nextjs-app pnpm run seed
```

4. Visit:
```
http://localhost:3000
```

Stop containers:
```bash
docker-compose down
```

Useful Docker commands:

| Command | Purpose |
|---|---|
| `docker-compose up -d` | Start in background |
| `docker-compose logs -f` | Follow logs in real-time |
| `docker-compose down --remove-orphans` | Stop & cleanup containers |
| `docker-compose build --no-cache` | Rebuild image from scratch |
| `docker-compose exec nextjs-app pnpm run seed` | Run seed script inside container |
| `docker-compose exec nextjs-app pnpm install <package>` | Install package inside container |
| `docker-compose restart` | Restart all containers |

---

## Deployment

Prepare a managed Postgres (Vercel Postgres, Supabase, etc.) and set environment variables in your hosting provider.

Vercel:
1. Import repo into Vercel.
2. Set Framework Preset to Next.js.
3. Add environment variables (AUTH_SECRET, NEXTAUTH_URL, POSTGRES_URL, etc.).
4. Deploy.

Note: Docker files are for local development; Vercel deploys without Docker.

---

## Environment Variables (reference)

- AUTH_SECRET — random secret for NextAuth
- NEXTAUTH_URL / AUTH_URL — app URL
- POSTGRES_URL — full DB connection string
- POSTGRES_PRISMA_URL — optional pooled connection
- POSTGRES_* — individual DB parts (optional)
- NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY — if using Supabase

---

## Common Commands

- Install: `pnpm install`
- Dev: `pnpm run dev`
- Build: `pnpm run build`
- Start (production): `pnpm run start`
- Seed DB (if provided): `pnpm run seed`

**With Docker:**
- Seed DB: `docker-compose exec nextjs-app pnpm run seed`
- View logs: `docker-compose logs -f`

---

## Troubleshooting

- "Port 3000 in use": kill process `lsof -ti:3000 | xargs kill -9` or change port.
- DB connection errors: verify `.env` values and DB availability.
- Session missing role: sign out and sign back in; ensure auth callback adds role to session.
- If Docker containers fail: `docker-compose down --remove-orphans`, rebuild, then `docker-compose up`.
- Seed fails in Docker: ensure database is fully started before running seed; wait a few seconds after `docker-compose up`.

---

## Project Structure

```
nextjs-dashboard/
├─ app/                 # Next.js app (routes + UI)
├─ public/              # static assets
├─ lib/                 # data fetching, actions
├─ ui/                  # re-usable UI components
├─ Dockerfile
├─ docker-compose.yml
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## Notes
- Project uses TypeScript by default — you can adapt to plain JS.
- Always validate permissions on server-side; client checks are only for UX.
- Add Tailwind plugins (e.g. typography) if you use `prose` styles.

If you want, I can:
- Add a Docker Compose example
- Add seed SQL or Prisma schema
- Tighten README with project-specific commands