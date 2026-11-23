"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Cart } from "@/components/cart/Cart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { selectTotalItems, useCartStore } from "@/stores/cartStore";

export function CartButton() {
  const [isOpen, setIsOpen] = useState(false);
  const totalItems = useCartStore(selectTotalItems);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
        aria-label={`Open cart, ${totalItems} items`}
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -right-2 -top-2 h-5 min-w-5 justify-center rounded-full px-1 text-xs">
            {totalItems}
          </Badge>
        )}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <Cart />
        </SheetContent>
      </Sheet>
    </>
  );
}