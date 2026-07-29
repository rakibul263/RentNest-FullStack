# RentNest — Full Stack Rental Marketplace

A production-grade rental marketplace with a **Node.js/Express + Prisma** backend and a **Next.js 16** frontend. Tenants discover properties, landlords approve requests, and everyone pays securely through **Stripe**.

## Repo Structure

```
RentNest Full Stack/
├── RentNest Backend/     # Express + Prisma + Stripe REST API (port 5050)
└── RentNest Frontend/    # Next.js 16 + Tailwind v4 + React 19 (port 3000)
```

## Features

- **Role-based dashboards** — Tenant, Landlord, and Admin each get a tailored UI.
- **Property discovery** — filterable listing grid, debounced search, detail pages with gallery & reviews.
- **Rental request lifecycle** — tenant requests → landlord approves/rejects → tenant pays.
- **Secure payments** — Stripe PaymentIntent flow with an embedded card form.
- **Cloudinary image uploads** — landlords upload property photos directly to Cloudinary.
- **Dark mode**, responsive layouts, and an animated premium design system.

## Quick Start

### 1. Backend

```bash
cd "RentNest Backend"
cp .env.example .env        # then fill in DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY
npm install
npm run prisma:build        # combine schemas + generate client
npm run seed                # optional demo data
npm run dev                 # http://localhost:5050
```

### 2. Frontend

```bash
cd "RentNest Frontend"
cp .env.example .env.local  # then fill in Stripe/Cloudinary keys
npm install
npm run dev                 # http://localhost:3000
```

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@rentnest.com` | `Admin@123` |
| Landlord | `toufik@rentnest.com` | `Password123!` |
| Tenant | `tanvir@rentnest.com` | `Password123!` |

Test card: `4242 4242 4242 4242` · any future expiry · any CVC.

## API Integration

See [`RentNest Frontend/API_INTEGRATION.md`](RentNest%20Frontend/API_INTEGRATION.md) for a component-to-endpoint mapping.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma (Postgres), Stripe, JWT, ts-node-dev
- **Frontend:** Next.js 16, React 19, Tailwind CSS v4, TypeScript, TanStack Query, React Hook Form + Zod, Framer Motion, Recharts, Stripe Elements, Cloudinary
