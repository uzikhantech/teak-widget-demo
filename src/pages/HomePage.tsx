import { Link } from "react-router-dom";
import { ArrowRight, Music, Trophy, Theater } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventGrid } from "@/components/events/EventGrid";
import { getFeaturedEvents, categories } from "@/data/events";

const categoryIcons = {
  Concerts: Music,
  Sports: Trophy,
  Theater: Theater,
};

const categoryDescriptions = {
  Concerts: "Live music experiences",
  Sports: "Games & competitions",
  Theater: "Shows & performances",
};

export function HomePage() {
  const featuredEvents = getFeaturedEvents(4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Next
              <span className="block text-neutral-400">Unforgettable Experience</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-300">
              Discover and book tickets to the hottest concerts, sporting events,
              and theater productions. Your next great memory starts here.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                <Link to="/events">
                  Browse All Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {categories.map((category) => {
              const Icon = categoryIcons[category];
              return (
                <Link
                  key={category}
                  to={`/events?category=${category}`}
                  className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 transition-colors group-hover:bg-neutral-200">
                    <Icon className="h-6 w-6 text-neutral-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{category}</h3>
                    <p className="text-sm text-neutral-600">
                      {categoryDescriptions[category]}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="bg-neutral-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                Featured Events
              </h2>
              <p className="mt-2 text-neutral-600">
                Don't miss these upcoming experiences
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link to="/events">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8">
            <EventGrid events={featuredEvents} />
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link to="/events">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-neutral-900 px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready for your next adventure?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-neutral-400">
              Browse our complete catalog of events and find something that
              speaks to you.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-white text-neutral-900 hover:bg-neutral-100"
            >
              <Link to="/events">Explore Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
