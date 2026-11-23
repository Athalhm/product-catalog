export { cn } from "cn"
import type { Product } from "@/types/product";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

export interface StockStatus {
  label: string;
  variant: "secondary" | "destructive" | "outline";
  isAvailable: boolean;
}

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) {
    return { label: "Out of Stock", variant: "destructive", isAvailable: false };
  }
  if (stock < 10) {
    return { label: `Low Stock (${stock} left)`, variant: "secondary", isAvailable: true };
  }
  return { label: "In Stock", variant: "outline", isAvailable: true };
}

export function filterProductsByName(
  products: Product[],
  searchTerm: string
): Product[] {
  const keyword = searchTerm.trim().toLowerCase();

  if (keyword === "") return products;

  return products.filter((product) =>
    product.title.toLowerCase().includes(keyword)
  );
}

export function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("ellipsis");

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (end < totalPages - 1) pages.push("ellipsis");

  pages.push(totalPages);

  return pages;
}