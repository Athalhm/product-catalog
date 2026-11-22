import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export function ProductList({ products, onAddToCart }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center">
        <p className="text-lg font-semibold">No products found</p>
        <p className="text-sm text-muted-foreground">
          Try a different keyword or clear the search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}