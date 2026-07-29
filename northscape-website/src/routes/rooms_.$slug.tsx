import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Ruler, Star, ArrowRight, MapPin, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { getRoomBySlug, rooms } from "@/data/rooms";
import { amenityIcon, amenityLabel, type AmenityKey } from "@/data/amenities";
import { RoomCard } from "@/components/site/RoomCard";
import { SectionTitle } from "@/components/site/SectionTitle";

import { getRoomsWithLiveStatus } from "@/lib/bookingStore";
import { getReviewsForRoom, getRoomRatingStats } from "@/lib/reviewStore";

export const Route = createFileRoute("/rooms_/$slug")({
  loader: ({ params }) => {
    const room = getRoomBySlug(params?.slug);
    return { room };
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
  const initialRoom = data.room;

  const [liveRooms, setLiveRooms] = useState(() => getRoomsWithLiveStatus());
  const [roomReviews, setRoomReviews] = useState(() => getReviewsForRoom(initialRoom.slug));
  const [roomStats, setRoomStats] = useState(() => getRoomRatingStats(initialRoom.slug));

  useEffect(() => {
    const handleUpdate = () => setLiveRooms(getRoomsWithLiveStatus());
    window.addEventListener("northscape_booking_updated", handleUpdate);
    return () => window.removeEventListener("northscape_booking_updated", handleUpdate);
  }, []);

  useEffect(() => {
    const handleReviewUpdate = () => {
      setRoomReviews(getReviewsForRoom(initialRoom.slug));
      setRoomStats(getRoomRatingStats(initialRoom.slug));
    };
    window.addEventListener("northscape_reviews_updated", handleReviewUpdate);
    return () => window.removeEventListener("northscape_reviews_updated", handleReviewUpdate);
  }, [initialRoom.slug]);

  const room = liveRooms.find((r) => r.slug === initialRoom.slug) || initialRoom;
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const similar = liveRooms.filter((r) => r.id !== room.id).slice(0, 3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [room.slug]);

  return (
    <div>
      <section className="pt-28 md:pt-36 container-x">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/rooms" className="hover:text-foreground">Residences</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{room.name}</span>
        </div>

        {/* Live Availability Header Alert */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            {room.isBooked ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-destructive/15 text-destructive px-3.5 py-1.5 text-xs font-semibold">
                <span className="size-2.5 rounded-full bg-destructive animate-pulse" />
                Currently Occupied / Booked
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 text-xs font-semibold">
                <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                🟢 Available for Instant Reservation Today
              </span>
            )}
            {room.isBooked && room.availableFrom && (
              <span className="text-xs text-muted-foreground font-medium">
                Next Available Date: <strong className="text-foreground">{room.availableFrom}</strong>
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Direct Reservation: <span className="font-semibold text-foreground">+250 788 764 000</span>
          </div>
        </div>

        {/* Photo Gallery Grid — all images, no slideshow */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4 auto-rows-[130px] sm:auto-rows-[170px] md:auto-rows-[190px]">
          {room.images.map((src, i) => (
            <button
              key={i}
              onClick={() => setLightboxImg(src)}
              className={`relative rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-soft group ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={src}
                alt={`${room.name} view ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-secondary text-secondary-foreground px-3.5 py-1 text-xs font-semibold tracking-wide">{room.type}</span>
              <span className="inline-flex items-center gap-1 text-sm font-medium"><Star className="size-4 fill-accent text-accent" /> {room.rating} · {room.reviews} reviews</span>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" /> Musanze, Northern Province, Rwanda</span>
            </div>

            <h1 className="mt-4 font-display text-3xl sm:text-5xl leading-tight font-bold">{room.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground leading-relaxed">{room.short}</p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-medium">
              <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl"><Users className="size-4 text-accent" /> Up to {room.capacity} guests</div>
              <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl">🛏️ {room.specs.bedrooms} Bedrooms</div>
              <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl">🚿 {room.specs.bathrooms} Bathrooms</div>
              <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl"><Ruler className="size-4 text-accent" /> {room.size}</div>
            </div>

            <div className="mt-10">
              <h3 className="font-display text-2xl font-bold">Residence Overview</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{room.description}</p>
            </div>

            {/* Official Rates Table */}
            {room.ratesRWF && (
              <div className="mt-10 rounded-3xl border border-border/80 bg-card p-6 shadow-soft">
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  <Sparkles className="size-5 text-accent" /> Official Rates & Discounts (RWF)
                </h3>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-2xl border border-border/70 p-3.5 bg-background">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">1 Day / Per Night</div>
                    <div className="font-display text-lg font-bold text-accent mt-1">100,000 RWF</div>
                    <div className="text-xs text-muted-foreground">~$75 USD</div>
                  </div>
                  <div className="rounded-2xl border border-border/70 p-3.5 bg-background">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">3 Days Special</div>
                    <div className="font-display text-lg font-bold text-accent mt-1">250,000 RWF</div>
                    <div className="text-xs text-muted-foreground">~$185 USD</div>
                  </div>
                  <div className="rounded-2xl border border-border/70 p-3.5 bg-background">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">1 Week Stay</div>
                    <div className="font-display text-lg font-bold text-accent mt-1">500,000 RWF</div>
                    <div className="text-xs text-muted-foreground">~$370 USD</div>
                  </div>
                  <div className="rounded-2xl border border-border/70 p-3.5 bg-background">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">2 Weeks Stay</div>
                    <div className="font-display text-lg font-bold text-accent mt-1">800,000 RWF</div>
                    <div className="text-xs text-muted-foreground">~$590 USD</div>
                  </div>
                  <div className="rounded-2xl border border-border/70 p-3.5 bg-background sm:col-span-2">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">1 Month (30 Days)</div>
                    <div className="font-display text-lg font-bold text-accent mt-1">1,500,000 RWF</div>
                    <div className="text-xs text-muted-foreground">~$1,100 USD (Best Value)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Feature Breakdown Sections (Bedroom, Kitchen, Bathroom, Living Lounge) */}
            <div className="mt-12 space-y-8">
              <h3 className="font-display text-2xl font-bold">Detailed Room Features & Layout</h3>
              
              {/* Bedroom Section */}
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft grid gap-6 md:grid-cols-2 items-center">
                <div>
                  <h4 className="font-display text-xl font-bold flex items-center gap-2">🛏️ {room.details.bedroom.title}</h4>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {room.details.bedroom.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-accent shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden aspect-[4/3]">
                  {room.details.bedroom.images.slice(0, 2).map((imgSrc, i) => (
                    <img key={i} src={imgSrc} alt="Bedroom feature" className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => setLightboxImg(imgSrc)} />
                  ))}
                </div>
              </div>

              {/* Kitchen Section */}
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft grid gap-6 md:grid-cols-2 items-center">
                <div>
                  <h4 className="font-display text-xl font-bold flex items-center gap-2">🍳 {room.details.kitchen.title}</h4>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {room.details.kitchen.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-accent shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden aspect-[4/3]">
                  {room.details.kitchen.images.slice(0, 2).map((imgSrc, i) => (
                    <img key={i} src={imgSrc} alt="Kitchen feature" className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => setLightboxImg(imgSrc)} />
                  ))}
                </div>
              </div>

              {/* Bathroom & Toilet Section */}
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft grid gap-6 md:grid-cols-2 items-center">
                <div>
                  <h4 className="font-display text-xl font-bold flex items-center gap-2">🚿 {room.details.bathroom.title}</h4>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {room.details.bathroom.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-accent shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                  <img src={room.details.bathroom.images[0] || room.images[0]} alt="Bathroom feature" className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => setLightboxImg(room.details.bathroom.images[0] || room.images[0])} />
                </div>
              </div>

              {/* Living & Lounge Section */}
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft grid gap-6 md:grid-cols-2 items-center">
                <div>
                  <h4 className="font-display text-xl font-bold flex items-center gap-2">🛋️ {room.details.living.title}</h4>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {room.details.living.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-accent shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                  <img src={room.details.living.images[0] || room.images[0]} alt="Living lounge feature" className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => setLightboxImg(room.details.living.images[0] || room.images[0])} />
                </div>
              </div>
            </div>

            {/* Standard Amenities */}
            <div className="mt-12">
              <h3 className="font-display text-2xl font-bold">Included Amenities</h3>
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

            {/* Room Guest Reviews */}
            <div className="mt-12 border-t border-border pt-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold flex items-center gap-2">
                    <Star className="size-6 text-amber-500 fill-amber-500" /> Guest Reviews & Ratings
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Verified guest feedback for {room.name}
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 px-4 py-2 text-sm font-bold flex items-center gap-1.5">
                  <Star className="size-4 fill-amber-500 text-amber-500" /> {roomStats.rating} / 5 ({roomStats.count} review{roomStats.count !== 1 ? "s" : ""})
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {roomReviews.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                    No public reviews written for this residence yet. Book a stay to share your experience!
                  </div>
                ) : (
                  roomReviews.map((rev) => (
                    <div key={rev.id} className="rounded-2xl border border-border bg-card p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xs">
                            {rev.guestName.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <div className="font-bold text-xs text-foreground">{rev.guestName}</div>
                            <div className="text-[10px] text-muted-foreground">{new Date(rev.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="size-3.5 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                      {rev.comment && (
                        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed pt-1">
                          “{rev.comment}”
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sticky Reservation Widget */}
          <aside className="lg:sticky lg:top-28 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-5"
            >
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Daily Rate</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display text-3xl font-bold">
                    {room.priceRWF ? `${room.priceRWF.toLocaleString()} RWF` : `$${room.price}`}
                  </span>
                  <span className="text-sm text-muted-foreground">/ day</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">~${room.price} USD / night</div>
              </div>

              {room.isBooked && (
                <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive font-medium">
                  ⚠️ This room is currently booked until <strong>{room.availableFrom || "next week"}</strong>. You can reserve for future dates starting {room.availableFrom || "soon"}.
                </div>
              )}

              <div className="space-y-3">
                <a
                  href={`/book?room=${room.slug}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-soft transition-all min-h-[48px]"
                >
                  Proceed to Reservation <ArrowRight className="size-4" />
                </a>

                <a
                  href="tel:+250788764000"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium hover:bg-secondary transition-all"
                >
                  Call +250 788 764 000
                </a>
              </div>

              <div className="pt-4 border-t border-border/60 text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-600" /> Free cancellation anytime before check-in</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-accent" /> Instant Confirmation & WhatsApp Host Coordination</div>
              </div>
            </motion.div>
          </aside>
        </div>
      </section>

      <section className="container-x mt-24 mb-24">
        <SectionTitle align="left" eyebrow="More Stays" title="Explore Other Residences" />
        <div className="mt-10 grid gap-4 grid-cols-2 lg:grid-cols-3">
          {similar.map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
        </div>
      </section>

      {/* Lightbox Fullscreen Image Modal */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setLightboxImg(null)}
          >
            <button
              className="absolute top-6 right-6 text-white bg-white/20 px-4 py-2 rounded-full hover:bg-white/40 text-xs font-semibold"
              onClick={() => setLightboxImg(null)}
            >
              ✕ Close Preview
            </button>
            <img src={lightboxImg} alt="Enlarged view" className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
