import { ProductCatalogue } from "@/components/product/ProductCatalog";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold">Product Catalogue</h1>
      <ProductCatalogue />
    </main>
  );
}