import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "./CartItem";
import { useCartStore } from "@/store/cartStore";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, getTotal, getItemCount } = useCartStore();
  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-neutral-100 p-6">
              <ShoppingCart className="h-8 w-8 text-neutral-400" />
            </div>
            <p className="text-center text-neutral-600">Your cart is empty</p>
            <Button asChild variant="outline" onClick={() => onOpenChange(false)}>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="divide-y divide-neutral-200">
                {items.map((item) => (
                  <CartItem
                    key={`${item.event.id}-${item.ticketType.id}`}
                    item={item}
                    compact
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 px-6 pb-6 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-neutral-600">Subtotal</span>
                <span className="text-lg font-semibold text-neutral-900">
                  ${total.toFixed(2)}
                </span>
              </div>

              <Separator className="mb-4" />

              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  <Link to="/checkout">Checkout</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  <Link to="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
