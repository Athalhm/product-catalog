"use client";

import { useProducts } from "@/hooks/useProducts";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { ProductSkeleton } from "@/components/common/ProductSkeleton";
import { ProductList } from "@/components/product/ProductList";
import type { Product } from "@/types/product";

export function ProductCatalog() {
  const { products, isLoading, error, retry } = useProducts();

  const handleAddToCart = (product: Product) => {
    console.log("Add to cart:", product.title);
  };

  if (isLoading) return <ProductSkeleton />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;

  return <ProductList products={products} onAddToCart={handleAddToCart} />;
}