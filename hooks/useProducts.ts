"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await fetchProducts(controller.signal);
        setProducts(data);
      } catch (err) {
        // Request yang sengaja dibatalkan bukan error sungguhan
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan tak terduga."
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [reloadKey]);

  const retry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);

  return { products, isLoading, error, retry };
}