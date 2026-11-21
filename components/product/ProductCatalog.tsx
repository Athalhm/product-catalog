"use client";

import { useProducts } from "@/hooks/useProducts";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { ProductSkeleton } from "@/components/common/ProductSkeleton";

export function ProductCatalogue() {
  const { products, isLoading, error, retry } = useProducts();

  if (isLoading) return <ProductSkeleton />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Total produk dimuat: {products.length}
      </p>
      <ul className="space-y-1">
        {products.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </div>
  );
}