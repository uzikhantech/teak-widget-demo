import { Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cartStore";

export function CartPage() {
  const { items, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="bg-neutral-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6 py-16">
            <div className="rounded-full bg-neutral-100 p-8">
              <ShoppingCart className="h-12 w-12 text-neutral-400" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-neutral-900">
                Your cart is empty
              </h1>
              <p className="mt-2 text-neutral-600">
                Looks like you haven't added any tickets yet.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            Shopping Cart
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-neutral-500 hover:text-red-600"
          >
            Clear Cart
          </Button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={`${item.event.id}-${item.ticketType.id}`}
                item={item}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
