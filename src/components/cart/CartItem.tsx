import { Minus, Plus, Trash2, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { event, ticketType, quantity } = item;
  const lineTotal = ticketType.price * quantity;

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  if (compact) {
    return (
      <div className="flex gap-3 py-3">
        <img
          src={event.image}
          alt={event.name}
          className="h-16 w-16 rounded-lg object-cover"
        />
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h4 className="line-clamp-1 text-sm font-medium text-neutral-900">
              {event.name}
            </h4>
            <p className="text-xs text-neutral-600">{ticketType.name}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-600">Qty: {quantity}</span>
            <span className="text-sm font-medium text-neutral-900">
              ${lineTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-4">
      <img
        src={event.image}
        alt={event.name}
        className="h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"
      />

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-neutral-900">{event.name}</h3>
            <p className="mt-1 text-sm font-medium text-neutral-700">
              {ticketType.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-400 hover:text-red-600"
            onClick={() => removeItem(event.id, ticketType.id)}
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Calendar className="h-3 w-3" />
            <span>
              {formattedDate} • {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <MapPin className="h-3 w-3" />
            <span>{event.venue}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                updateQuantity(event.id, ticketType.id, quantity - 1)
              }
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                updateQuantity(event.id, ticketType.id, quantity + 1)
              }
              disabled={quantity >= ticketType.available}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <p className="text-xs text-neutral-600">
              ${ticketType.price.toFixed(2)} each
            </p>
            <p className="text-lg font-semibold text-neutral-900">
              ${lineTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
