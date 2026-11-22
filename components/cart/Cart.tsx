import { CartItem } from "@/components/cart/CartItem";
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export function Cart() {
  const {
    items,
    totalItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <>
      <SheetHeader>
        <SheetTitle>Shopping Cart</SheetTitle>
        <SheetDescription>
          {totalItems === 0
            ? "Your cart is empty."
            : `${totalItems} item(s) in your cart.`}
        </SheetDescription>
      </SheetHeader>

      {items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-muted-foreground">
          Add a product to get started.
        </div>
      ) : (
        <ul className="flex-1 space-y-4 overflow-y-auto px-4">
          {items.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </ul>
      )}

      <SheetFooter>
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </SheetFooter>
    </>
  );
}