# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server
npm run build      # tsc type-check + Vite production build
npm run lint       # ESLint
npm run preview    # preview production build locally
```

There are no automated tests in this project.

## Environment

A `VITE_API_URL` environment variable must be set (e.g. in `.env.local`) pointing to the backend REST API base URL. The Axios client reads it via `import.meta.env.VITE_API_URL`.

## Architecture

### Tech stack

- **React 18** + **TypeScript** + **Vite**
- **React Router v7** (browser router, nested layouts)
- **TanStack React Query v5** for server state
- **Zustand v5** for client state (auth store persisted to `localStorage` under key `pb_auth`)
- **Mantine v8** as the primary UI component library (with `@emotion/react` styled engine)
- **Ant Design v5** used in some feature pages alongside Mantine
- **react-hook-form** + **zod** for form validation
- **i18next** + **react-i18next** for i18n (Russian and Uzbek, fallback `uz`)

### Directory layout

```
src/
  app/            # Bootstrap: router, queryClient, MantineProvider theme
  shared/
    api/          # Axios client (shared/api/client.ts) + shared API types
    auth/         # UserRole type and ALL_ROLES constant
    endpoints/    # One file per domain — plain async functions using the shared api client
    modules/      # TanStack Query hooks (useQuery/useMutation wrappers) per domain
    stores/       # Zustand stores (currently only auth)
  features/       # Feature-sliced: auth, profile, orders, search, vacancy, admin, …
  pages/          # Page-level components (landing, worker-search, investors, 404)
  layouts/        # Layout shells (TopbarLayout, FindLayout, FindOrTopbarLayout, AdminLayout)
  components/     # Shared route guards and small reusable UI pieces
  lib/            # Small utilities: axios (legacy thin wrapper), i18n init, storage, pickMessage
  locales/        # ru/common.json and uz/common.json translation files
  types/          # Shared TypeScript types
```

### API layer convention

- **`src/shared/api/client.ts`** is the canonical Axios instance. Use this for all new API calls — not the thin `src/lib/axios.ts` (which is legacy).
- The client automatically attaches the Bearer token from `useAuthStore` and handles 401 → auto-logout.
- Error responses from the interceptor are normalized to `ApiError { status, message, details }`.
- Endpoint functions live in `src/shared/endpoints/<domain>.ts` and call the shared client.
- React Query hooks wrapping those functions live in `src/shared/modules/<domain>.ts`.

### Auth & routing guard layers

The router nests guards in this order (outer → inner):

1. **`InactiveOnly` / `ActiveOnly`** — checks `active` flag from auth store; redirects unactivated users to `/activate`.
2. **`Protected`** — checks `isAuthed`; redirects unauthenticated users to `/login`.
3. **`RoleGuard`** — checks `role` against an allow-list; redirects wrong roles to `/`.

Auth state is stored in Zustand (`useAuthStore`) and persisted to `localStorage` (key `pb_auth`, schema version 3). The `me` object (from `/user/me`) contains the active flag and role; `setMe()` updates both.

### Roles

Five roles: `CLIENT`, `WORKER`, `LEGAL`, `INVESTOR`, `ADMIN`. Routes under `/app` are role-gated via `<RoleGuard allow={[…]} />`. Admin routes live under `/admin` behind an ADMIN role guard.

### Layouts

- `TopbarLayout` — main authenticated shell for `/app/*`
- `FindLayout` / `FindOrTopbarLayout` — public search section at `/find/*` (shows topbar if authed)
- `AdminLayout` — admin panel shell

### Styling

Styles co-located next to components as `*.style.ts` files using Mantine's `createStyles` / `sx` prop pattern. No CSS modules or global stylesheets beyond `src/index.css` (resets) and `src/App.css`.

### i18n

Translation keys live in `src/locales/{ru,uz}/common.json`. Use the `useTranslation` hook from `react-i18next`. The active language is stored in `localStorage` under `i18nextLng`. The API client picks the same key to forward the correct language for localized server error messages.
