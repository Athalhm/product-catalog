import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemData } from "@/types/product";
import { createContext, useContext, type ReactNode } from "react";

interface CartItemContextValue {
  item: CartItemData;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
}

const CartItemContext = createContext<CartItemContextValue | null>(null);

function useCartItem() {
  const context = useContext(CartItemContext);

  if (context === null) {
    throw new Error("Komponen CartItem.* harus dipakai di dalam <CartItem>")
  }

  return context;
}

export interface CartItemProps extends CartItemContextValue {
  children: ReactNode;
}

export function CartItem({ children, ...value }: CartItemProps){
  return (
    <CartItemContext.Provider value={value}>
      <li className="flex gap-3">{children}</li>
    </CartItemContext.Provider>
  );
}

function CartItemImage() {
  const { item } = useCartItem();
  const { product } = item;

  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
      <Image
        src={product.thumbnail}
        alt={product.title}
        fill
        sizes="80px"
        className="object-contain"
      />
    </div>
  );
}

function CartItemContent({ children }: { children: ReactNode}) {
  return <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
}

function CartItemTitle() {
  const { item } = useCartItem();
    
  return (
    <p className="line-clamp-2 text-sm font-medium leading-snug">
      {item.product.title}
    </p>
  );
}

function CartItemPrice() {
  const { item } = useCartItem();
  const { product , quantity } = item;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{formatPrice(product.price)}</span>
      <span className="font-semibold">
        {formatPrice(product.price * quantity)}
      </span>
    </div>    
  );
}

function CartItemQuantity() {
  const { item, onIncrease, onDecrease } = useCartItem();
  const { product, quantity } = item;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => onDecrease(product.id)}
        disabled={quantity <= 1}
        aria-label={`Decrease quantity of ${product.title}`}
      >
        <Minus className="h-3 w-3" />
      </Button>

      <span className="w-6 text-center text-sm tabular-nums">
        {item.quantity}
      </span>

      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => onIncrease(item.product.id)}
        disabled={quantity >= product.stock}
        aria-label={`Increase quantity of ${item.product.title}`}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

function CartItemRemoveButton() {
  const { item, onRemove } = useCartItem();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-destructive"
      onClick={() => onRemove(item.product.id)}
      aria-label={`Remove ${item.product.title} from cart`}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

CartItem.Image = CartItemImage;
CartItem.Content = CartItemContent;
CartItem.Title = CartItemTitle;
CartItem.Price = CartItemPrice;
CartItem.Quantity = CartItemQuantity;
CartItem.RemoveButton = CartItemRemoveButton;

/* export function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const { product, quantity } = item;
  const isAtMinQuantity = quantity <= 1;
  const isAtMaxStock = quantity >= product.stock;

  return (
    <li className="flex gap-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="line-clamp-2 text-sm font-medium leading-snug">
          {product.title}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {formatPrice(product.price)}
          </span>
          <span className="font-semibold">
            {formatPrice(product.price * quantity)}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onDecrease(product.id)}
              disabled={isAtMinQuantity}
              aria-label={`Decrease quantity of ${product.title}`}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="w-6 text-center text-sm tabular-nums">
              {quantity}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onIncrease(product.id)}
              disabled={isAtMaxStock}
              aria-label={`Increase quantity of ${product.title}`}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={() => onRemove(product.id)}
            aria-label={`Remove ${product.title} from cart`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </li>
  );
} */