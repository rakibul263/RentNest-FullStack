# API Integration & Documentation

This document maps every frontend component to the backend REST endpoints it consumes.

- **Backend base URL:** `http://localhost:5050/api` (set via `NEXT_PUBLIC_API_URL` in `RentNest Frontend/.env.local`)
- **Frontend API client:** `src/lib/api.ts` — a thin `fetch` wrapper (`api.get/post/patch/put/delete`) that:
  - attaches the JWT from `localStorage` (`rn_token`) as `Authorization: Bearer <token>`,
  - parses the backend `{ success, message, data, meta }` envelope,
  - dispatches `rn:unauthorized` (session clear) on `401`.
- All routes are mounted under `/api` in the backend (`src/app.ts`).

---

## 1. Authentication

| Frontend | Backend endpoint | Method | Purpose |
|---|---|---|---|
| `src/hooks/use-auth.tsx` (`useAuth.login`) | `/auth/login` | POST | Sign in with `{ email, password }` |
| `src/hooks/use-auth.tsx` (`useAuth.register`) | `/auth/register` | POST | Create account `{ name, email, password, phone?, role }` |
| `src/hooks/use-auth.tsx` (`useAuth.me`) | `/auth/me` | GET | Restore session / fetch current user |
| `src/app/auth/login/page.tsx` | `/auth/login` | POST | Login form → redirects to role dashboard |
| `src/app/auth/register/page.tsx` | `/auth/register` | POST | Registration form (tenant/landlord) |

## 2. Public Browsing

| Frontend | Backend endpoint | Method | Purpose |
|---|---|---|---|
| `src/app/page.tsx` | `/categories` | GET | Homepage category cards |
| `src/app/page.tsx` | `/properties?limit=9` | GET | Homepage featured properties |
| `src/components/home/hero.tsx` | `/properties/stats` | GET | Live platform stats (properties / tenants / approval rate) |
| `src/app/properties/page.tsx` | `/properties` | GET | Listing grid with `location`, `category`, `minPrice`, `maxPrice`, `bedrooms`, `page`, `limit` |
| `src/components/filters/filter-sidebar.tsx` | `/categories` | GET | Filter dropdown data |
| `src/app/properties/[id]/page.tsx` | `/properties/:id` | GET | Property detail page |
| `src/app/properties/[id]/page.tsx` | `/reviews?propertyId=:id` | GET | Public reviews on detail page |
| `src/components/request-to-rent-modal.tsx` | `/rentals` | POST | Tenant sends rental request `{ propertyId, startDate, endDate, message? }` |

## 3. Tenant Dashboard

| Frontend | Backend endpoint | Method | Purpose |
|---|---|---|---|
| `src/app/dashboard/tenant/page.tsx` | `/rentals` | GET | Overview: request status breakdown |
| `src/app/dashboard/tenant/page.tsx` | `/payments` | GET | Overview: monthly payment chart |
| `src/app/dashboard/tenant/page.tsx` | `/reviews/my` | GET | Overview: review count |
| `src/app/dashboard/tenant/requests/page.tsx` | `/rentals` | GET | "My Requests" list |
| `src/app/dashboard/tenant/requests/[id]/pay/page.tsx` | `/rentals/:id` | GET | Load request + property for checkout |
| `src/app/dashboard/tenant/requests/[id]/pay/page.tsx` | `/payments/create-payment-intent` | POST | Create Stripe PaymentIntent `{ rentalRequestId }` |
| `src/app/dashboard/tenant/requests/[id]/pay/page.tsx` | `/payments/confirm` | POST | Confirm payment `{ paymentId, transactionId }` |
| `src/app/dashboard/tenant/payments/page.tsx` | `/payments` | GET | Payment history |
| `src/app/dashboard/tenant/reviews/page.tsx` | `/reviews/my` | GET | Reviews I've left |
| `src/components/review-modal.tsx` | `/reviews` | POST | Submit review `{ propertyId, rentalRequestId, rating, comment? }` |

## 4. Landlord Dashboard

| Frontend | Backend endpoint | Method | Purpose |
|---|---|---|---|
| `src/app/dashboard/landlord/page.tsx` | `/landlord/properties` | GET | Owned properties + stats |
| `src/app/dashboard/landlord/page.tsx` | `/landlord/requests` | GET | Request stats / approvals chart |
| `src/app/dashboard/landlord/properties/new/page.tsx` | `/landlord/properties` | POST | Create property |
| `src/app/dashboard/landlord/properties/[id]/edit/page.tsx` | `/landlord/properties/:id` | PUT | Update property |
| `src/components/landlord/property-form.tsx` | `/categories` | GET | Category dropdown in the form |
| `src/app/dashboard/landlord/properties/[id]/edit/page.tsx` | `/landlord/properties/:id` | DELETE | Delete property (via `landlordApi.deleteProperty`) |
| `src/app/dashboard/landlord/page.tsx` | `/landlord/properties/:id` | PATCH | Toggle availability (via `updateProperty`) |
| `src/app/dashboard/landlord/requests/page.tsx` | `/landlord/requests` | GET | Incoming rental requests |
| `src/app/dashboard/landlord/requests/page.tsx` | `/landlord/requests/:id` | PATCH | Approve / reject request `{ status }` |

## 5. Admin Panel

| Frontend | Backend endpoint | Method | Purpose |
|---|---|---|---|
| `src/app/dashboard/admin/page.tsx` | `/admin/users?page&limit` | GET | Overview stats + user table |
| `src/app/dashboard/admin/page.tsx` | `/admin/properties?page&limit` | GET | Overview property stats |
| `src/app/dashboard/admin/page.tsx` | `/admin/rentals?page&limit` | GET | Overview revenue / pending requests |
| `src/app/dashboard/admin/users/page.tsx` | `/admin/users?page&limit` | GET | User management list |
| `src/components/admin/user-ban-button.tsx` | `/admin/users/:id` | PATCH | Ban / unban user `{ isBanned }` |
| `src/app/dashboard/admin/properties/page.tsx` | `/admin/properties?page&limit` | GET | Property moderation list |
| `src/app/dashboard/admin/requests/page.tsx` | `/admin/rentals?page&limit` | GET | All rental requests |
| `src/app/dashboard/admin/page.tsx` | `/admin/categories` | POST | Create category |

---

## Route protection (frontend proxy)

`src/proxy.ts` (Next.js `proxy`, replaces legacy `middleware.ts`) protects `/dashboard/*`, `/auth/*`, `/payment/*`:
- Reads the `rn_token` cookie, verifies the JWT, and attaches `X-User-Role` / user claims downstream.
- Redirects unauthenticated visitors to `/auth/login`.
- The backend additionally enforces role-based access on every protected route (`authenticate` + `authorize`).

## Auth flow summary

1. **Login/Register** → `POST /auth/login` or `/auth/register` returns `{ user, token }`.
2. `useAuth` persists `token` (localStorage + cookie) and `user` (localStorage).
3. All subsequent calls attach `Authorization: Bearer <token>`.
4. On `401`, the client clears the session and redirects to login.
5. `/auth/me` restores the session on refresh / page load.
