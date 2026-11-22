export { cn } from "cn"

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