import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const lowestPrice = Math.min(...event.ticketTypes.map((t) => t.price));
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const categoryColors: Record<Event["category"], string> = {
    Concerts: "bg-purple-100 text-purple-800",
    Sports: "bg-green-100 text-green-800",
    Theater: "bg-amber-100 text-amber-800",
  };

  return (
    <Card className="group overflow-hidden border-neutral-200 pt-0 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg">
      <Link to={`/events/${event.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <img
            src={event.image}
            alt={event.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <Badge
            className={`absolute left-3 top-3 ${categoryColors[event.category]}`}
          >
            {event.category}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/events/${event.id}`} className="block">
          <h3 className="line-clamp-1 text-lg font-semibold text-neutral-900 transition-colors group-hover:text-neutral-700">
            {event.name}
          </h3>
        </Link>

        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Calendar className="h-4 w-4" />
            <span>
              {formattedDate} • {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            From{" "}
            <span className="text-lg font-semibold text-neutral-900">
              ${lowestPrice}
            </span>
          </p>
          <Button asChild size="sm">
            <Link to={`/events/${event.id}`}>Get Tickets</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
