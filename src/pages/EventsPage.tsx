import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventGrid } from "@/components/events/EventGrid";
import { events, categories } from "@/data/events";
import type { Event } from "@/types";

type SortOption = "date" | "price-asc" | "price-desc" | "name";

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") as Event["category"] | null;

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>("date");

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...events];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((event) => event.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "date":
        result.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "price-asc":
        result.sort((a, b) => {
          const aMin = Math.min(...a.ticketTypes.map((t) => t.price));
          const bMin = Math.min(...b.ticketTypes.map((t) => t.price));
          return aMin - bMin;
        });
        break;
      case "price-desc":
        result.sort((a, b) => {
          const aMin = Math.min(...a.ticketTypes.map((t) => t.price));
          const bMin = Math.min(...b.ticketTypes.map((t) => t.price));
          return bMin - aMin;
        });
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [selectedCategory, sortBy]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", value);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            All Events
          </h1>
          <p className="mt-2 text-neutral-600">
            Browse our complete catalog of upcoming events
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-medium text-neutral-700">Filters:</span>
            </div>

            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            {selectedCategory !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCategoryChange("all")}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 text-sm text-neutral-600">
          Showing {filteredAndSortedEvents.length} event
          {filteredAndSortedEvents.length !== 1 ? "s" : ""}
        </div>
        <EventGrid
          events={filteredAndSortedEvents}
          emptyMessage="No events found matching your filters."
        />
      </div>
    </div>
  );
}
