# Niboshop – Agent Guide

Next.js App Router ecommerce storefront with a customer dashboard and an admin dashboard. Brand: **Niboshop**. Font: Geist (Sans + Mono) via `next/font`. Currency: BDT (৳).

## Routes

| Route | File | Notes |
| --- | --- | --- |
| `/` | `app/(shop)/page.tsx` | Hero carousel + 2 side banners, category strip, product sections |
| `/category/[slug]` | `app/(shop)/category/[slug]/page.tsx` | Product grid, sort/filter |
| `/product/[slug]` | `app/(shop)/product/[slug]/page.tsx` | Gallery, purchase box, Description + Reviews tabs only |
| `/checkout` | `app/(shop)/checkout/page.tsx` | Form + order summary |
| Cart | `components/shop/cart-sheet.tsx` | Side sheet, no `/cart` page |
| `/account/*` | `app/account/` | Overview, orders, wishlist, addresses, profile |
| `/admin/*` | `app/admin/` | Overview, products, orders, customers |
| `/design-system` | `app/design-system/page.tsx` | Living style guide |

Scope is deliberately small. Do not add EMI, pre-order, offers, tools, specification, warranty or Q&A sections. The footer stays simple (logo, contact details, a few links; no store addresses). The logo is `public/images/logo.webp` (white-on-dark artwork), so `<Logo />` must only be placed on dark surfaces.

## Design system rules

1. All colors, radius and fonts are tokens in `app/globals.css` (`:root` and `.dark`). Brand-specific tokens: `header`, `footer`, `sale`, `success`, `star`.
2. Use semantic Tailwind classes (`bg-primary`, `text-muted-foreground`, `bg-header`). Never use raw hex, rgb or palette colors like `bg-blue-500`.
3. Rebrand by editing tokens only. The site name, contact info, stores, delivery fees and navigation live in `lib/site-config.ts`.
4. Use shadcn components from `components/ui`. Add new ones with `npx shadcn@latest add <name>`.
5. Use `gap-*` not `space-*`, `size-*` for equal width and height, and no sizing classes on icons inside Buttons.
6. Product card buttons: Add to cart is the default filled Button, Buy now is `variant="outline"` directly below it.
7. After UI changes, check `/design-system` still reflects the component.

## Data layer

- Types: `lib/data/types.ts`. Seed data: `lib/data/{products,categories,banners,reviews,orders}.ts`.
- Pages never import seed files directly. They call the async functions in `lib/data/index.ts` (`getProducts`, `getProductBySlug`, `getOrders`, …). To connect a real database, re-implement those functions only; signatures stay the same.
- Cart state: `lib/cart.tsx` (`CartProvider`, `useCart`), persisted client-side only for the guest cart. Open the side cart with `useCart().openCart()`.
- Search: `app/api/search/route.ts` returns products only (name and image), triggered after 3 typed characters in `components/shop/search-box.tsx`. No categories in results.
- Formatting helpers: `lib/format.ts` (`formatPrice`, `formatDate`).
- Dashboards currently show a mock signed-in customer and have no authentication. Before production, add real auth (Better Auth on Neon is recommended) and protect `/account` and `/admin`, scoping every query by user id.

## Adding things

- **New storefront page:** create `app/(shop)/<route>/page.tsx`. It inherits the header, footer and side cart from `app/(shop)/layout.tsx`.
- **New dashboard page:** add `app/admin/<route>/page.tsx` or `app/account/<route>/page.tsx`, then add the link to `adminNav` or `accountNav` in `lib/site-config.ts`. Compose with `PageHeader`, `StatCard`, `StatusBadge` from `components/dashboard/primitives.tsx` and `OrdersTable`.
- **New category or product:** edit `lib/data/categories.ts` or `products.ts`. Product images go in `public/images/products/`; banners in `public/images/banners/`.
- **New banner:** edit `lib/data/banners.ts`. Hero banners are image-only, with no overlay text or buttons.
- **New shared component:** put storefront pieces in `components/shop/`, dashboard pieces in `components/dashboard/`, and showcase it on `/design-system`.

## Conventions

- Server components by default. Add `"use client"` only for interactivity (cart, search, forms, carousel).
- Keep page files thin and split UI into components.
- Metadata is set in `app/layout.tsx` and per page.
- Images use `next/image` with meaningful `alt` text.
