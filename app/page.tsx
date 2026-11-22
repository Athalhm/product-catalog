import { ProductCatalog } from "@/components/product/ProductCatalog";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-2">
      <h1 className="mb-6 text-2xl font-bold">Product Catalog</h1>
      <ProductCatalog />
    </main>
  );
}