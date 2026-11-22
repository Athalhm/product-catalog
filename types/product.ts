export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string; // opsional: produk seperti "Apple" tidak punya brand
  sku: string;
  availabilityStatus: string;
  thumbnail: string;
  images: string[];
}

// Bentuk respons dari GET /products
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}