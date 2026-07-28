import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Ruler, Star, ChevronLeft, ChevronRight, ArrowRight, MapPin } from "lucide-react";
import { getRoomBySlug, rooms } from "@/data/rooms";
import { amenityIcon, amenityLabel, type AmenityKey } from "@/data/amenities";
import { RoomCard } from "@/components/site/RoomCard";
import { SectionTitle } from "@/components/site/SectionTitle";

export const Route = createFileRoute("/rooms/$slug")({
  loader: ({ params }) => {
    const room = getRoomBySlug(params.slug);
    if (!room) throw notFound();
    return { room } as { room: NonNullable<ReturnType<typeof getRoomBySlug>> };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.room ? `${loaderData.room.name} — NorthScape Apartment` : "Room — NorthScape";
    const desc = loaderData?.room?.short ?? "Warm, wood-lit apartment stays in Musanze, Rwanda.";
    const image = loaderData?.room?.images[0];
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(image ? [
          { property: "og:image", content: image },
          { name: "twitter:image", content: image },
        ] : []),
      ],
    };
  },
  component: RoomDetail,
});

function RoomDetail() {
  const data = Route.useLoaderData() as { room: import("@/data/rooms").Room };
  const room = data.room;
  const [idx, setIdx] = useState(0);
  const similar = rooms.filter((r) => r.id !== room.id).slice(0, 3);

  return (
    <div>
      <section className="pt-28 md:pt-36 container-x">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/rooms" className="hover:text-foreground">Rooms</Link>
          <span>/</span>
          <span className="text-foreground">{room.name}</span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 md:grid-rows-2 md:h-[520px]">
          <div className="relative md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden shadow-soft">
            <img key={idx} src={room.images[idx]} alt={room.name} className="h-full w-full object-cover animate-[fade-in_.5s_ease-out]" />
            <button
              onClick={() => setIdx((i) => (i - 1 + room.images.length) % room.images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 size-11 grid place-items-center rounded-full bg-background/85 backdrop-blur border border-border hover:bg-background"
              aria-label="Previous"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % room.images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 size-11 grid place-items-center rounded-full bg-background/85 backdrop-blur border border-border hover:bg-background"
              aria-label="Next"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-4 left-4 flex gap-1.5">
              {room.images.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-3 bg-white/50"}`} />
              ))}
            </div>
          </div>
          {room.images.slice(0, 4).map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`relative rounded-2xl overflow-hidden ${i >= 2 ? "hidden md:block" : ""} ${i === idx ? "ring-2 ring-accent" : ""}`}
            >
              <img src={src} alt={`${room.name} view ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs font-medium tracking-wide">{room.type}</span>
              <span className="inline-flex items-center gap-1 text-sm"><Star className="size-4 fill-accent text-accent" /> {room.rating} · {room.reviews} reviews</span>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" /> Musanze, Rwanda</span>
            </div>
            <h1 className="mt-4 font-display text-4xl md:text-5xl leading-tight">{room.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{room.short}</p>

            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <div className="inline-flex items-center gap-2"><Users className="size-4 text-accent" /> Up to {room.capacity} guests</div>
              <div className="inline-flex items-center gap-2"><Ruler className="size-4 text-accent" /> {room.size}</div>
              <div className="inline-flex items-center gap-2"><span className="inline-flex size-2.5 rounded-full bg-green-500" /> Available today</div>
            </div>

            <div className="mt-10 prose max-w-none">
              <h3 className="font-display text-2xl">About this apartment</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{room.description}</p>
            </div>

            <div className="mt-10">
              <h3 className="font-display text-2xl">Amenities</h3>
              <div className="mt-5 grid gap-4 grid-cols-2 sm:grid-cols-3">
                {room.amenities.map((a) => {
                  const Icon = amenityIcon[a as AmenityKey];
                  return (
                    <div key={a} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4">
                      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent"><Icon className="size-5" /></span>
                      <span className="text-sm font-medium">{amenityLabel[a as AmenityKey]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="md:sticky md:top-28 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl">${room.price}</span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Taxes and fees included</div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <label className="rounded-2xl border border-border p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Check-in</div>
                  <input type="date" className="mt-1 w-full bg-transparent focus:outline-none" />
                </label>
                <label className="rounded-2xl border border-border p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Check-out</div>
                  <input type="date" className="mt-1 w-full bg-transparent focus:outline-none" />
                </label>
                <label className="rounded-2xl border border-border p-3 col-span-2">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Guests</div>
                  <select className="mt-1 w-full bg-transparent focus:outline-none">
                    {Array.from({ length: room.capacity }).map((_, i) => (
                      <option key={i}>{i + 1} guest{i > 0 ? "s" : ""}</option>
                    ))}
                  </select>
                </label>
              </div>

              <Link
                to="/book"
                search={{ room: room.slug } as never}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Reserve <ArrowRight className="size-4" />
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">You won't be charged yet.</p>
            </motion.div>
          </aside>
        </div>
      </section>

      <section className="container-x mt-24 mb-24">
        <SectionTitle align="left" eyebrow="More stays" title="You may also like" />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
        </div>
      </section>
    </div>
  );
}
