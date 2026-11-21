import type { Product, ProductsResponse } from "@/types/product";

const BASE_URL = "https://dummyjson.com";

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products?limit=0`, { signal });

  if (!response.ok) {
    throw new Error(`Gagal mengambil produk (status ${response.status}).`);
  }

  const data: ProductsResponse = await response.json();
  return data.products;
}

//latihan fetch product by id

/* export async function fetchProductById(id: number): Promise<Product> {
	const response = await fetch(`${BASE_URL}/products/${id}`);

		if (!response.ok) {
			throw new Error(`Gagal mengambil produk (status ${response.status}).`);
    }

  const data: Product = await response.json();
  return data;
} */