import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { RoomCard } from "@/components/site/RoomCard";
import { SectionTitle } from "@/components/site/SectionTitle";
import { img } from "@/lib/images";
import { getRoomsWithLiveStatus } from "@/lib/bookingStore";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Rooms & Suites — NorthScape Apartment" },
      { name: "description", content: "Explore NorthScape's warm, wood-lit apartments in Musanze — suites, lofts and family residences with full kitchens." },
      { property: "og:title", content: "Rooms & Suites — NorthScape Apartment" },
      { property: "og:description", content: "Warm, wood-lit apartments in Musanze with full kitchens and hand-crafted interiors." },
    ],
  }),
  component: RoomsPage,
});

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

function RoomsPage() {
  const [liveRooms, setLiveRooms] = useState(() => getRoomsWithLiveStatus());

  useEffect(() => {
    const handleUpdate = () => setLiveRooms(getRoomsWithLiveStatus());
    window.addEventListener("northscape_booking_updated", handleUpdate);
    return () => window.removeEventListener("northscape_booking_updated", handleUpdate);
  }, []);

  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("All");
  const [availability, setAvailability] = useState<"All" | "Available" | "Booked">("All");
  const [guests, setGuests] = useState(1);
  const [maxPrice, setMaxPrice] = useState(300);
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let list = liveRooms.filter((r) => {
      const matchType = type === "All" || r.type === type;
      const matchAvail =
        availability === "All" ||
        (availability === "Available" && !r.isBooked) ||
        (availability === "Booked" && r.isBooked);
      const matchCapacity = r.capacity >= guests;
      const matchPrice = r.price <= maxPrice;
      const matchQ =
        q.trim() === "" ||
        (r.name + r.short + r.description).toLowerCase().includes(q.toLowerCase());

      return matchType && matchAvail && matchCapacity && matchPrice && matchQ;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [q, type, availability, guests, maxPrice, sort]);

  return (
    <div>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <img src={img.living[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="relative container-x">
          <SectionTitle
            eyebrow="Stays & Rates"
            title="Available NorthScape Residences"
            description="Explore our Full 3-Bedroom Residences (100,000 RWF / day) and Executive Guest Rooms (20,000 RWF / day). Live status updated in real-time."
          />
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-6 shadow-soft space-y-4">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search rooms by title or amenity…"
              className="w-full rounded-full bg-background border border-border pl-11 pr-4 py-2.5 text-sm focus:ring-focus min-h-[44px]"
            />
          </label>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 sm:gap-3">
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as typeof availability)}
              className="w-full sm:w-auto rounded-full bg-background border border-border px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm min-h-[42px] font-semibold"
            >
              <option value="All">All Availability</option>
              <option value="Available">🟢 Available Today</option>
              <option value="Booked">🔴 Currently Booked</option>
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full sm:w-auto rounded-full bg-background border border-border px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm min-h-[42px]"
            >
              <option value="All">All Types</option>
              <option value="Full Apartment">Full 3-Bed Apartment</option>
              <option value="Guest Room">Executive Guest Room</option>
            </select>

            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full sm:w-auto rounded-full bg-background border border-border px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm min-h-[42px]"
            >
              {[1, 2, 3, 4, 5].map((g) => (
                <option key={g} value={g}>{g}+ guests</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full sm:w-auto rounded-full bg-background border border-border px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm min-h-[42px]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Guest rating</option>
            </select>

            <label className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-start gap-2 rounded-full bg-background border border-border px-3.5 py-2 text-xs sm:text-sm min-h-[42px]">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                <span className="whitespace-nowrap font-medium">Max ${maxPrice}</span>
              </span>
              <input
                type="range" min={80} max={300} step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-accent w-20 sm:w-28"
              />
            </label>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{filtered.length} room{filtered.length === 1 ? "" : "s"} available</p>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {filtered.map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No rooms match those filters. Try loosening the price or party size.
          </div>
        )}
      </section>
    </div>
  );
}
