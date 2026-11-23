"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";

interface UseProductsOptions {
  search: string;
  page: number;
}

export function useProducts({ search, page }: UseProductsOptions) {
  const query = useQuery({
    queryKey: ["products", { search, page }],
    queryFn: ({ signal }) => fetchProducts({ search, page, signal }),
    placeholderData: keepPreviousData,
  });

  const retry = () => {
    void query.refetch();
  };

  return {
    products: query.data?.products ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isPending,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error ? query.error.message : null,
    retry,
  };
}