import type { ProductsPage, ProductsResponse } from "@/types/product";

const BASE_URL = "https://dummyjson.com";

export const PAGE_SIZE = 10;

interface FetchProductsParams {
  search?: string;
  page?: number;
  signal?: AbortSignal;
}

export async function fetchProducts({ search = "", page = 1, signal,}: FetchProductsParams = {}): Promise<ProductsPage> {
  const keyword = search.trim();
  const endpoint = keyword === "" ? "/products" : "/products/search";

  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    skip: String((page - 1) * PAGE_SIZE),
  });

  if (keyword !== "") {
    params.set("q", keyword);
  }

  const response = await fetch(`${BASE_URL}${endpoint}?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil produk (status ${response.status}).`);
  }

  const data: ProductsResponse = await response.json();
  return { products: data.products, total: data.total };
}