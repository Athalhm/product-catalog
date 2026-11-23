"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types/product";

interface UseProductsOptions { search: string, page: number }

interface LoadedResult { key: string, products: Product[], total: number }

interface FailedResult { key: string, message: string }

export function useProducts({ search, page }: UseProductsOptions) {
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<LoadedResult | null>(null);
  const [failure, setFailure] = useState<FailedResult | null>(null);

  const requestKey = `${search}|${page}|${reloadKey}`;

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await fetchProducts({
          search,
          page,
          signal: controller.signal,
        });
        setResult({ key: requestKey, ...data });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setFailure({
          key: requestKey,
          message:
            err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.",
        });
      }
    }

    load();

    return () => controller.abort();
  }, [search, page, requestKey]);

  const retry = () => setReloadKey((key) => key + 1);

  const hasCurrentResult = result !== null && result.key === requestKey;
  const hasCurrentFailure = failure !== null && failure.key === requestKey;

  return {
    products: hasCurrentResult ? result.products : [],
    total: hasCurrentResult ? result.total : 0,
    isLoading: !hasCurrentResult && !hasCurrentFailure,
    error: hasCurrentFailure ? failure.message : null,
    retry,
  };
}