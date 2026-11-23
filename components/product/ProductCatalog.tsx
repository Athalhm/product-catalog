"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { useCart } from "@/context/CartContext";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ProductSkeleton } from "@/components/common/ProductSkeleton";
import { ProductList } from "@/components/product/ProductList";
import { SearchBar } from "@/components/product/SearchBar";
import { PAGE_SIZE } from "@/lib/api";

export function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm.trim(), 400);

  const { products, total, isLoading, error, retry } = useProducts({
    search: debouncedSearch,
    page,
  });
  const { addToCart } = useCart();

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const rangeStart = (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = rangeStart + products.length - 1;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function renderResults() {
    if (isLoading) return <ProductSkeleton />;
    if (error) return <ErrorMessage message={error} onRetry={retry} />;

    return (
      <>
        <ProductList products={products} onAddToCart={addToCart} />
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={searchTerm} onChange={handleSearchChange} />
        {!isLoading && !error && total > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing {rangeStart}-{rangeEnd} of {total} products
          </p>
        )}
      </div>

      {renderResults()}
    </div>
  );
}