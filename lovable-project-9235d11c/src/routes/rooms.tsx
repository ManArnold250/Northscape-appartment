import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { rooms } from "@/data/rooms";
import { RoomCard } from "@/components/site/RoomCard";
import { SectionTitle } from "@/components/site/SectionTitle";
import { img } from "@/lib/images";

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
  const [q, setQ] = useState("");
  const [type, setType] = useState<"All" | "Suite" | "Deluxe" | "Studio" | "Family">("All");
  const [guests, setGuests] = useState(1);
  const [maxPrice, setMaxPrice] = useState(300);
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let list = rooms.filter((r) =>
      (type === "All" || r.type === type) &&
      r.capacity >= guests &&
      r.price <= maxPrice &&
      (q.trim() === "" || (r.name + r.short + r.description).toLowerCase().includes(q.toLowerCase())),
    );
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      default: list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  }, [q, type, guests, maxPrice, sort]);

  return (
    <div>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <img src={img.living[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="relative container-x">
          <SectionTitle eyebrow="Stays" title="Find your NorthScape apartment" description="Filter by type, party size and price. Every room is finished with warm timber and marble." />
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="rounded-3xl border border-border/70 bg-card p-5 md:p-6 shadow-soft grid gap-4 md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center">
          <label className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search rooms…"
              className="w-full rounded-full bg-background border border-border pl-11 pr-4 py-2.5 text-sm focus:ring-focus"
            />
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="rounded-full bg-background border border-border px-4 py-2.5 text-sm"
          >
            {["All", "Suite", "Deluxe", "Studio", "Family"].map((t) => (
              <option key={t} value={t}>{t === "All" ? "All types" : t}</option>
            ))}
          </select>

          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="rounded-full bg-background border border-border px-4 py-2.5 text-sm"
          >
            {[1, 2, 3, 4, 5].map((g) => (
              <option key={g} value={g}>{g}+ guests</option>
            ))}
          </select>

          <label className="flex items-center gap-3 rounded-full bg-background border border-border px-4 py-2.5 text-sm">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <span className="whitespace-nowrap">Max ${maxPrice}</span>
            <input
              type="range" min={80} max={300} step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-accent w-32"
            />
          </label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full bg-background border border-border px-4 py-2.5 text-sm"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Guest rating</option>
          </select>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{filtered.length} room{filtered.length === 1 ? "" : "s"} available</p>

        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
