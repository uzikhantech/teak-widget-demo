import { EventCard } from "./EventCard";
import type { Event } from "@/types";

interface EventGridProps {
  events: Event[];
  emptyMessage?: string;
}

export function EventGrid({
  events,
  emptyMessage = "No events found.",
}: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50">
        <p className="text-neutral-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
