import { CartButton } from "@/components/cart/CartButton";
import { ProductCatalog } from "@/components/product/ProductCatalog";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6">
      <header className="sticky top-0 z-10 mb-6 flex items-center justify-between border-b bg-background py-3">
        <h1 className="text-2xl font-bold">Product Catalog</h1>
        <CartButton />
      </header>

      <ProductCatalog />
    </main>
  );
}