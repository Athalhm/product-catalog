import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice, getStockStatus } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const stock = getStockStatus(product.stock);

  return (
    <Card className="flex h-full flex-col gap-4 overflow-hidden pt-0">
      <div className="relative aspect-square w-full bg-muted">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain"
        />
      </div>

      <CardContent className="flex flex-1 flex-col gap-2">
        <Badge variant="secondary" className="w-fit capitalize">
          {product.category.replaceAll("-", " ")}
        </Badge>

        <h3 className="line-clamp-2 font-semibold leading-snug">{product.title}</h3>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{product.rating.toFixed(1)}</span>
        </div>

        <p className="text-lg font-bold">{formatPrice(product.price)}</p>

        <Badge variant={stock.variant} className="w-fit">
          {stock.label}
        </Badge>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          disabled={!stock.isAvailable}
          onClick={() => onAddToCart?.(product)}
        >
          {stock.isAvailable ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}