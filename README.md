# Bureau Graphics Monorepo (Website + POS)

This repository now contains:
- **Website storefront** (existing React + Vite app at repo root)
- **Standalone POS app** (new app at `apps/pos`)
- **Shared business modules** (new package area at `packages/shared`)

## Repo Structure

```txt
/
  apps/
    pos/
  packages/
    shared/
      types/
      pricing/
      inventory/
      utils/
  src/               # existing website app
```

## Commands

```bash
npm run dev:website     # Website development
npm run build:website   # Website build
npm run dev:pos         # POS development
npm run build:pos       # POS build
```

## Website + POS Data Sync (local mock layer)

Both apps read/write shared localStorage keys used as mock persistence:
- `bureau.pos.products`
- `bureau.pos.inventory`
- `bureau.pos.sales`
- `bureau.pos.websiteRequests`

Flow:
1. POS updates stock through `inventoryService.adjustStock()` after a sale.
2. POS dispatches `inventory-sync` browser event.
3. Website listens and refreshes stock badges using `getWebsiteStockStatus()`.

> For production, replace localStorage service adapters with real API adapters (Supabase/Postgres/Firebase/REST).

## Where to edit core business data

- Products/categories seed: `apps/pos/src/data/mockData.ts`
- Branches/users/roles seed: `apps/pos/src/data/mockData.ts`
- POS business services: `apps/pos/src/services/*`
- Shared types: `packages/shared/types/domain.ts`
- Shared pricing config/pipeline: `packages/shared/pricing/index.ts`
- Shared inventory logic: `packages/shared/inventory/index.ts`

## Deployment Notes

### Vercel
- **Website**: root project with build command `npm run build:website` and output `dist`
- **POS**: second project with build command `npm run build:pos` and output `dist-pos`

### Netlify
- Website: publish `dist`
- POS: publish `dist-pos`

### Cloudflare Pages
- Create separate Pages projects from same repo:
  - website: `npm run build:website` => `dist`
  - pos: `npm run build:pos` => `dist-pos`

### DigitalOcean App Platform
- Configure two app components from same repo branch:
  - Website static component (`dist`)
  - POS static component (`dist-pos`)

## Backend recommendation

- **Fastest to production**: Supabase (Postgres + auth + realtime + storage)
- **If offline-first/mobile-heavy first**: Firebase
- **Most control/enterprise**: PostgreSQL + custom API (NestJS/Fastify)

For this architecture, **Supabase is the best initial choice** because it maps cleanly to shared relational POS data (sales, ledger, stock movements, invoices, users, branches).

## Extra roadmap already prepared in architecture

The POS structure is ready to extend for:
- barcode scanning
- receipt printing
- audit logs / user activity tracking
- backup/export to Excel
- service products that do not reduce stock (already supported)
- VAT reports
- credit limits
- offline mode with sync queue
- multi-currency layer
