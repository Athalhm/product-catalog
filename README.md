# Product Catalog

A responsive product catalog built as a frontend intern mini project. The app fetches products from a public API, displays them as reusable cards, supports product search, and includes a working shopping cart.

**Live demo:** https://product-catalog-seven-xi.vercel.app
**Repository:** https://github.com/Athalhm/product-catalog.git

---

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [API Information](#api-information)
3. [Main Features](#main-features)
4. [Project Setup](#project-setup)
5. [Project Structure](#project-structure)
6. [Component Structure and State Management](#component-structure-and-state-management)
7. [Known Limitations](#known-limitations)

---

## Technologies Used

| Purpose | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| UI library | [React](https://react.dev/) (functional components and hooks) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Component library | [shadcn/ui](https://ui.shadcn.com/) (Card, Badge, Button, Input, Sheet, Skeleton, Alert) |
| Icons | [lucide-react](https://lucide.dev/) |
| Package manager | [pnpm](https://pnpm.io/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## API Information

The app uses the public [DummyJSON Products API](https://dummyjson.com/docs/products). No API key or environment variable is required.

| Item | Value |
|---|---|
| Base URL | `https://dummyjson.com` |
| Endpoint used | `GET /products?limit=0` |
| Response shape | `{ products: Product[], total, skip, limit }` |

By default the API returns only 30 products per request. The app passes `limit=0` so that all products are returned in a single request. This makes local search complete, because every product is already in memory.

Product fields used by the app:

`id`, `title`, `price`, `category`, `rating`, `stock`, `thumbnail`, and others defined in `types/product.ts`.

Product images are served from `cdn.dummyjson.com`, which is registered in `next.config.ts` under `images.remotePatterns`.

---

## Main Features

**Fetching data**
- Products are fetched from the API when the application loads.
- A skeleton grid is shown while data is loading.
- A descriptive error message with a "Try again" button is shown if the request fails.
- Request cancellation is handled with `AbortController` to avoid updating state after unmount.

**Product cards**
- Reusable `ProductCard` showing image, name, price, category, rating, stock status, and an "Add to Cart" button.
- Stock status is derived from the stock count: `In Stock`, `Low Stock (N left)`, or `Out of Stock`.
- The button is disabled when a product is out of stock.
- Responsive grid: 1 column on mobile, 2 on small tablets, 3 on laptops, 4 on large screens.

**Search**
- Search by product name, case-insensitive, with surrounding spaces ignored.
- The visible list updates as the user types.
- A clear (X) button removes the search text.
- A "No products found" message is shown when nothing matches.
- A result counter shows how many products match.

**Shopping cart**
- Add products to the cart. Adding the same product again increases its quantity instead of creating a duplicate row.
- A badge on the cart button shows the total number of items.
- The cart opens in a side panel showing image, name, unit price, quantity, and line subtotal for each item.
- Increase and decrease quantity buttons.
- Quantity can never drop below 1 or exceed the product stock.
- Remove an item with the trash button.
- The total price is calculated automatically.
- An empty-cart message is shown when there are no items.

---

## Project Setup

### Prerequisites

- Node.js 20 or later
- pnpm (install with `npm install -g pnpm` if you do not have it)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Athalhm/product-catalog.git
cd product-catalog

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production build locally |
| `pnpm lint` | Run ESLint |

No environment variables are needed to run the project.

---

## Project Structure

```
product-catalog/
├── app/
│   ├── layout.tsx            Root layout, mounts CartProvider
│   ├── page.tsx              Home page, assembles header and catalog
│   └── globals.css
├── components/
│   ├── ui/                   shadcn/ui components (managed by the shadcn CLI)
│   ├── product/
│   │   ├── ProductCatalog.tsx  Container: data, search state, view selection
│   │   ├── ProductList.tsx     Responsive grid and empty state
│   │   ├── ProductCard.tsx     Single product card
│   │   └── SearchBar.tsx       Controlled search input with clear button
│   ├── cart/
│   │   ├── CartButton.tsx      Header button, item badge, opens the cart panel
│   │   ├── Cart.tsx            Cart panel content and total
│   │   └── CartItem.tsx        Single cart row with quantity controls
│   └── common/
│       ├── ProductSkeleton.tsx Loading state
│       └── ErrorMessage.tsx    Error state with retry
├── context/
│   └── CartContext.tsx       Cart state, actions, and useCart hook
├── hooks/
│   └── useProducts.ts        Fetching logic: products, loading, error, retry
├── lib/
│   ├── api.ts                API requests
│   └── utils.ts              cn helper, formatPrice, getStockStatus, filterProductsByName
├── types/
│   └── product.ts            Product, ProductsResponse, CartItem
├── next.config.ts            Remote image configuration
└── README.md
```

---

## Component Structure and State Management

### Component tree

```
app/layout.tsx
 └── CartProvider                 (cart state, shared by the whole app)
      └── app/page.tsx
           ├── CartButton → Sheet → Cart → CartItem (per item)
           └── ProductCatalog
                ├── ProductSkeleton   (while loading)
                ├── ErrorMessage      (on error)
                └── SearchBar + ProductList → ProductCard (per product)
```

### Data flow

- **Props flow down.** `ProductCatalog` passes the filtered products and the `onAddToCart` callback to `ProductList`, which passes them to each `ProductCard`.
- **Events flow up through callbacks.** Clicking "Add to Cart" calls `onAddToCart(product)`, which runs the cart logic in the parent. `ProductCard` itself does not know how the cart works, which keeps it reusable.
- **Shared state flows through Context.** The cart is needed by several unrelated components (product cards, the header badge, and the cart panel), so it lives in `CartContext` instead of being passed through many layers of props.

### State management approach

| State | Where it lives | Why |
|---|---|---|
| `products`, `isLoading`, `error` | `useProducts` hook, used by `ProductCatalog` | Only the catalog needs the product list. The hook hides all fetching details. |
| `searchTerm` | `ProductCatalog` (`useState`) | The search bar and the list both depend on it, so the state is lifted to their common parent. `SearchBar` is a controlled component. |
| Cart `items` | `CartProvider` (`useState`) | Needed by many components across the tree. |
| Cart panel open or closed | `CartButton` (`useState`) | Only this component cares, so it stays local. |

**Derived data is calculated, not stored.** The filtered product list, the cart total price, the cart item count, the stock label, and the line subtotals are all computed from existing state. This avoids keeping several pieces of state in sync by hand.

**Immutable updates.** Cart updates use `map`, `filter`, and the spread operator to create new arrays and objects. State is never mutated directly.

**Quantity rules live in one place.** A single function in `CartContext` clamps quantities between 1 and the product stock. The disabled buttons in the UI are only visual feedback on top of that rule.

---

## Known Limitations

- **The cart is not persisted.** It is stored in memory only, so it is cleared when the page is refreshed.
- **Prices in the cart are snapshots.** Each cart item stores the product as it was when it was added, so later changes in the API data are not reflected.
- **Search only matches the product name.** Category, brand, and description are not searched.
- **Search is local.** It filters products already loaded in memory. This works because all products are fetched at once, but it would not scale to a very large catalog.
- **All products are loaded in one request.** There is no pagination or infinite scroll, so many cards are rendered at once.
- **No checkout flow.** The cart ends at the total price.
- **Currency is assumed to be USD.** The API does not specify a currency.
- **Floating-point arithmetic.** Totals are calculated with JavaScript numbers and rounded only for display. A real store would store prices in the smallest currency unit (for example, cents).
- **Stock is not reserved.** Stock limits are checked against the data fetched on page load.
- **No automated tests.** The app was tested manually.
- **Limited accessibility testing.** Buttons have labels, but no full accessibility audit was done.