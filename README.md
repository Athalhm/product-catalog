# Product Catalog

A responsive product catalog built as a frontend intern mini project. The app fetches products from a public API with server-side search and pagination, displays them as reusable cards, and includes a working shopping cart.

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
| Server state (fetching and caching) | [TanStack Query](https://tanstack.com/query) (React Query) |
| Client state (cart) | [Zustand](https://zustand.docs.pmnd.rs/) |
| Icons | [lucide-react](https://lucide.dev/) |
| Package manager | [pnpm](https://pnpm.io/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## API Information

The app uses the public [DummyJSON Products API](https://dummyjson.com/docs/products). No API key or environment variable is required.

| Item | Value |
|---|---|
| Base URL | `https://dummyjson.com` |
| List endpoint | `GET /products?limit=10&skip=N` |
| Search endpoint | `GET /products/search?q=KEYWORD&limit=10&skip=N` |
| Response shape | `{ products: Product[], total, skip, limit }` |

Pagination is done by the server. The app requests 10 products per page and calculates `skip` as `(page - 1) * 10`. The `total` field in the response is used to calculate the number of pages.

Search is also done by the server through the search endpoint. The API decides which fields are matched, so a keyword can return products whose name does not contain it.

Product fields used by the app include `id`, `title`, `price`, `category`, `rating`, `stock`, and `thumbnail`. The full type is defined in `types/product.ts`.

Product images are served from `cdn.dummyjson.com`, which is registered in `next.config.ts` under `images.remotePatterns`.

---

## Main Features

**Fetching data (TanStack Query)**
- Products are fetched when the application loads.
- A skeleton grid is shown during the first load.
- When the user changes page or search term, the previous results stay visible (dimmed) while the new ones load, so the layout does not flash.
- Results are cached by page and search term. Going back to a page that was already loaded is instant and does not send a new request while the data is still fresh (1 minute).
- A failed request is retried once automatically. If it still fails, a descriptive error message with a "Try again" button is shown.
- In-flight requests are cancelled automatically when the query changes.

**Product cards**
- Reusable `ProductCard` showing image, name, price, category, rating, stock status, and an "Add to Cart" button.
- Stock status is derived from the stock count: `In Stock`, `Low Stock (N left)`, or `Out of Stock`.
- The button is disabled when a product is out of stock.
- Responsive grid: 1 column on mobile, 2 on small tablets, 3 on laptops, 4 on large screens.

**Search**
- Server-side search using the API search endpoint.
- Requests are debounced by 400 ms, so a request is sent only after the user stops typing.
- A clear (X) button removes the search text.
- A "No products found" message is shown when nothing matches.
- A result counter shows the range of products on the current page.

**Pagination**
- 10 products per page.
- Previous and Next buttons, plus a compact list of page numbers with ellipsis (for example `1 ... 9 10 11 ... 20`).
- Previous and Next are disabled at the first and last page.
- Changing the search term resets the page to 1, and changing page scrolls back to the top.

**Shopping cart (Zustand)**
- Add products to the cart. Adding the same product again increases its quantity instead of creating a duplicate row.
- A badge on the cart button shows the total number of items.
- The cart opens in a side panel showing image, name, unit price, quantity, and line subtotal for each item.
- Increase and decrease quantity buttons.
- Quantity can never drop below 1 or exceed the product stock.
- Remove an item with the trash button.
- The total price is calculated automatically.
- An empty-cart message is shown when there are no items.
- The cart is kept while the user changes page or search term.

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
│   ├── layout.tsx              Root layout, mounts Providers
│   ├── providers.tsx           TanStack Query provider (QueryClient)
│   ├── page.tsx                Home page, assembles header and catalog
│   └── globals.css
├── components/
│   ├── ui/                     shadcn/ui components (managed by the shadcn CLI)
│   ├── product/
│   │   ├── ProductCatalog.tsx    Container: search term, page, view selection
│   │   ├── ProductList.tsx       Responsive grid and empty state
│   │   ├── ProductCard.tsx       Single product card
│   │   └── SearchBar.tsx         Controlled search input with clear button
│   ├── cart/
│   │   ├── CartButton.tsx        Header button, item badge, opens the cart panel
│   │   ├── Cart.tsx              Cart panel content and total
│   │   └── CartItem.tsx          Compound component (CartItem.Image, Title, ...)
│   └── common/
│       ├── PaginationControls.tsx  Previous, page numbers, Next
│       ├── ProductSkeleton.tsx     Loading state
│       └── ErrorMessage.tsx        Error state with retry
├── stores/
│   └── cartStore.ts            Zustand cart store and selectors
├── hooks/
│   ├── useProducts.ts          useQuery wrapper for products
│   └── useDebounce.ts          Debounce for the search term
├── lib/
│   ├── api.ts                  API requests and PAGE_SIZE
│   └── utils.ts                cn helper, formatPrice, getStockStatus, getPageNumbers
├── types/
│   └── product.ts              Product, ProductsResponse, ProductsPage, CartItem
├── next.config.ts              Remote image configuration
└── README.md
```

---

## Component Structure and State Management

### Component tree

```
app/layout.tsx
 └── Providers (TanStack Query)
      └── app/page.tsx
           ├── CartButton → Sheet → Cart → CartItem (compound, per item)
           └── ProductCatalog
                ├── SearchBar
                ├── ProductSkeleton      (first load)
                ├── ErrorMessage         (on error)
                ├── ProductList → ProductCard (per product)
                └── PaginationControls
```

### Two kinds of state, two tools

The app separates **server state** from **client state**, because they have different problems.

| | Server state | Client state |
|---|---|---|
| Example | Product list from the API | Cart items |
| Owned by | The server (the app only holds a copy) | The app |
| Can become stale or fail | Yes | No |
| Tool | TanStack Query | Zustand |

### Server state with TanStack Query

`useProducts` wraps `useQuery`. The query key is `["products", { search, page }]`, so every combination of search term and page has its own cache entry. The query function is `fetchProducts` from `lib/api.ts`, which only performs the request and throws on a failed response.

What the library handles instead of hand-written code:

| Concern | How it is handled |
|---|---|
| Loading and error status | `isPending` and `error` |
| Re-fetching when search or page changes | The query key changes |
| Cancelling outdated requests | The `signal` passed to the query function |
| Stale results overwriting newer ones | Query keys |
| Retrying failed requests | `retry: 1` |
| Avoiding repeated requests | Cache with `staleTime` of 1 minute |
| Keeping the previous page visible while loading | `placeholderData: keepPreviousData` |

The `QueryClient` is created inside `useState` in `app/providers.tsx`, so each server render and each browser session gets its own cache instead of sharing one module-level instance.

### Client state with Zustand

The cart lives in `stores/cartStore.ts`. The store holds the `items` array and four actions: `addToCart`, `increaseQuantity`, `decreaseQuantity`, and `removeFromCart`. No provider is needed.

- **Selectors.** Components subscribe to small slices of the store, for example `useCartStore(selectTotalItems)`. A component re-renders only when the slice it selected changes.
- **Derived data is calculated, not stored.** `selectTotalItems` and `selectTotalPrice` compute their values from `items` with `reduce`.
- **Immutable updates.** Actions use `map`, `filter`, and the spread operator to create new arrays and objects. State is never mutated directly.
- **Quantity rules live in one place.** A single function clamps the quantity between 1 and the product stock. The disabled buttons in the UI are only visual feedback on top of that rule.

### Other state

| State | Where it lives | Why |
|---|---|---|
| Search term and current page | `ProductCatalog` (`useState`) | They are used by the search bar, the query, and the pagination, and are part of the query key. |
| Debounced search term | `useDebounce` hook | Only the debounced value is sent to the API. |
| Cart panel open or closed | `CartButton` (`useState`) | Only this component cares, so it stays local. |

### Data flow

- **Props flow down.** `ProductCatalog` passes products and the `onAddToCart` callback to `ProductList`, then to each `ProductCard`.
- **Events flow up through callbacks.** Clicking "Add to Cart" calls `onAddToCart(product)`. `ProductCard` does not know how the cart works, which keeps it reusable.
- **Shared client state lives in a store.** The product cards, the header badge, and the cart panel all read the same cart from Zustand.

### Compound component: `CartItem`

`CartItem` is a compound component. The root receives the item and the cart actions once and shares them through an internal context. The sub-components (`CartItem.Image`, `CartItem.Content`, `CartItem.Title`, `CartItem.Price`, `CartItem.Quantity`, `CartItem.RemoveButton`) read what they need from that context. `Cart.tsx` decides how the parts are arranged, so a different layout does not need new props or a new component. Using a sub-component outside `CartItem` throws a clear error.

---

## Known Limitations

- **The cart is not persisted.** It is stored in memory only, so it is cleared when the page is refreshed.
- **Prices in the cart are snapshots.** Each cart item stores the product as it was when it was added, so later changes in the API data are not reflected.
- **Search relies on the API's matching rules.** Results can include products whose name does not contain the keyword, and matching cannot be customized.
- **Page and search term are not in the URL.** They are stored in component state, so refreshing returns to page 1 and a specific page or search cannot be bookmarked or shared.
- **Data is fetched on the client.** The first paint shows a skeleton. Prefetching on the server would remove it at the cost of more setup.
- **The Zustand store is a module-level singleton.** This is fine for browser-only state like this cart, but data specific to a user would need a per-request store if used during server rendering.
- **No checkout flow.** The cart ends at the total price.
- **Currency is assumed to be USD.** The API does not specify a currency.
- **Floating-point arithmetic.** Totals are calculated with JavaScript numbers and rounded only for display. A real store would store prices in the smallest currency unit (for example, cents).
- **Stock is not reserved.** Stock limits are checked against the data fetched when the page loaded.
- **No automated tests.** The app was tested manually.
- **Limited accessibility testing.** Buttons have labels, but no full accessibility audit was done.