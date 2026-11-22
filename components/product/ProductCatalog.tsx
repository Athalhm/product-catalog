"use client";

import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { ProductSkeleton } from "@/components/common/ProductSkeleton";
import { ProductList } from "@/components/product/ProductList";
import { SearchBar } from "@/components/product/SearchBar";
import { filterProductsByName } from "@/lib/utils";

export function ProductCatalog() {
  const { products, isLoading, error, retry } = useProducts();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(
    () => filterProductsByName(products, searchTerm),
    [products, searchTerm]
  );

  if (isLoading) return <ProductSkeleton />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      <ProductList products={filteredProducts} onAddToCart={addToCart} />
    </div>
  );
}