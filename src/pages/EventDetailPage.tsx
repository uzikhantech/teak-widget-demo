import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  Minus,
  Plus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getEventById } from "@/data/events";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import type { TicketType } from "@/types";

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const event = getEventById(id || "");

  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(
    event?.ticketTypes[0] || null
  );
  const [quantity, setQuantity] = useState(1);

  if (!event) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="h-12 w-12 text-neutral-400" />
        <h1 className="text-2xl font-bold text-neutral-900">Event Not Found</h1>
        <p className="text-neutral-600">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/events">Browse Events</Link>
        </Button>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleAddToCart = () => {
    if (!selectedTicketType) return;

    addItem(event, selectedTicketType, quantity);
    toast.success(`Added ${quantity} ticket${quantity > 1 ? "s" : ""} to cart`, {
      description: `${event.name} - ${selectedTicketType.name}`,
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  const categoryColors: Record<string, string> = {
    Concerts: "bg-purple-100 text-purple-800",
    Sports: "bg-green-100 text-green-800",
    Theater: "bg-amber-100 text-amber-800",
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Back Button */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Event Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="overflow-hidden rounded-xl bg-neutral-200">
              <img
                src={event.image}
                alt={event.name}
                className="h-64 w-full object-cover sm:h-80 lg:h-96"
              />
            </div>

            {/* Event Details */}
            <div>
              <Badge className={categoryColors[event.category]}>
                {event.category}
              </Badge>
              <h1 className="mt-3 text-3xl font-bold text-neutral-900 sm:text-4xl">
                {event.name}
              </h1>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                    <Calendar className="h-5 w-5 text-neutral-700" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Date</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                    <Clock className="h-5 w-5 text-neutral-700" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Time</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {event.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                    <MapPin className="h-5 w-5 text-neutral-700" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Venue</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {event.venue}
                    </p>
                    <p className="text-xs text-neutral-500">{event.location}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  About This Event
                </h2>
                <p className="mt-3 text-neutral-600 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Selection */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Select Tickets
                </h2>

                <RadioGroup
                  value={selectedTicketType?.id || ""}
                  onValueChange={(value) => {
                    const ticket = event.ticketTypes.find((t) => t.id === value);
                    if (ticket) {
                      setSelectedTicketType(ticket);
                      setQuantity(1);
                    }
                  }}
                  className="mt-4 space-y-3"
                >
                  {event.ticketTypes.map((ticketType) => {
                    const isSelected = selectedTicketType?.id === ticketType.id;
                    const isSoldOut = ticketType.available === 0;

                    return (
                      <div key={ticketType.id}>
                        <Label
                          htmlFor={ticketType.id}
                          className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${
                            isSoldOut
                              ? "cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-60"
                              : isSelected
                              ? "border-neutral-900 bg-neutral-50"
                              : "border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value={ticketType.id}
                              id={ticketType.id}
                              disabled={isSoldOut}
                            />
                            <div>
                              <p className="font-medium text-neutral-900">
                                {ticketType.name}
                              </p>
                              <p className="text-sm text-neutral-500">
                                {isSoldOut ? (
                                  <span className="text-red-600">Sold Out</span>
                                ) : (
                                  `${ticketType.available} available`
                                )}
                              </p>
                            </div>
                          </div>
                          <span className="text-lg font-semibold text-neutral-900">
                            ${ticketType.price}
                          </span>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>

                <Separator className="my-6" />

                {/* Quantity Selector */}
                <div>
                  <Label className="text-sm font-medium text-neutral-700">
                    Quantity
                  </Label>
                  <div className="mt-2 flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center text-lg font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={
                        !selectedTicketType ||
                        quantity >= selectedTicketType.available
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Total & Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Total</span>
                    <span className="text-2xl font-bold text-neutral-900">
                      ${selectedTicketType ? (selectedTicketType.price * quantity).toFixed(2) : "0.00"}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!selectedTicketType || selectedTicketType.available === 0}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
