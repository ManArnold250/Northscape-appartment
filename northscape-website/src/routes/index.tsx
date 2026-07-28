import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Star, Users, ArrowUpRight } from "lucide-react";
import { exteriorList, img } from "@/lib/images";
import { rooms } from "@/data/rooms";
import { testimonials } from "@/data/testimonials";
import { whyChooseUs, amenityIcon, amenityLabel } from "@/data/amenities";
import { SectionTitle } from "@/components/site/SectionTitle";
import { RoomCard } from "@/components/site/RoomCard";

import { getRoomsWithLiveStatus } from "@/lib/bookingStore";
import { getAllReviews } from "@/lib/reviewStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NorthScape Apartment — Luxury Stays in Musanze, Rwanda" },
      {
        name: "description",
        content:
          "Warm, wood-lit apartment stays in Musanze. Modern suites, full kitchens, quiet evenings and gracious hospitality — the gateway to Volcanoes National Park.",
      },
      { property: "og:title", content: "NorthScape Apartment — Luxury Stays in Musanze, Rwanda" },
      { property: "og:description", content: "Warm timber, quiet nights and thoughtful hospitality in Musanze, Rwanda." },
    ],
  }),
  component: Home,
});

const HERO = [img.exterior.day, img.exterior.wide, img.exterior.night1, img.exterior.front];

function Home() {
  const [liveRooms, setLiveRooms] = useState(() => getRoomsWithLiveStatus());
  const [allReviews, setAllReviews] = useState(() => getAllReviews());

  useEffect(() => {
    const handleUpdate = () => setLiveRooms(getRoomsWithLiveStatus());
    window.addEventListener("northscape_booking_updated", handleUpdate);
    return () => window.removeEventListener("northscape_booking_updated", handleUpdate);
  }, []);

  useEffect(() => {
    const handleReviewUpdate = () => setAllReviews(getAllReviews());
    window.addEventListener("northscape_reviews_updated", handleReviewUpdate);
    return () => window.removeEventListener("northscape_reviews_updated", handleReviewUpdate);
  }, []);

  const featured = liveRooms.filter((r) => r.featured);
  const [heroIdx, setHeroIdx] = useState(0);
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO.length), 5500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (allReviews.length === 0) return;
    const t = setInterval(() => setTIdx((i) => (i + 1) % allReviews.length), 6500);
    return () => clearInterval(t);
  }, [allReviews.length]);

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img src={HERO[heroIdx]} alt="NorthScape exterior" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/40" />
          </motion.div>
        </AnimatePresence>

        <div className="container-x relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display italic text-2xl sm:text-3xl md:text-4xl text-white/95 font-medium tracking-wide"
          >
            Welcome to
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mt-1 sm:mt-3 font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.95] text-balance font-bold tracking-tight"
          >
            NorthScape
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-2 sm:mt-4 font-display italic text-base sm:text-xl md:text-2xl text-white/90"
          >
            A luxury apartment experience
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-6 sm:mt-10 grid grid-cols-2 gap-2.5 sm:gap-4 w-full max-w-xs sm:max-w-md mx-auto"
          >
            <Link
              to="/book"
              className="group inline-flex items-center justify-center gap-1 sm:gap-2 rounded-full bg-accent px-3 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold text-accent-foreground shadow-soft hover:opacity-95 transition whitespace-nowrap min-h-[44px] sm:min-h-[48px] active:scale-95"
            >
              Book Now
              <ArrowRight className="size-3.5 sm:size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/rooms"
              className="inline-flex items-center justify-center gap-1 sm:gap-2 rounded-full border border-white/60 bg-black/30 backdrop-blur px-3 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition whitespace-nowrap min-h-[44px] sm:min-h-[48px] active:scale-95"
            >
              Explore Rooms
            </Link>
          </motion.div>

          {/* slideshow dots */}
          <div className="absolute bottom-16 sm:bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
            {HERO.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === heroIdx ? "w-7 sm:w-8 bg-white" : "w-3 sm:w-4 bg-white/40"}`}
              />
            ))}
          </div>

          {/* scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80"
          >
            <ChevronDown className="size-5 sm:size-6" />
          </motion.div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="container-x py-24 md:py-32 grid gap-12 md:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-soft">
            <img src={img.exterior.day} alt="NorthScape exterior facade" className="h-full w-full object-cover" />
          </div>
          <div className="hidden md:block absolute -bottom-8 -right-8 w-52 h-52 rounded-3xl overflow-hidden border-8 border-background shadow-soft">
            <img src={img.living[0]} alt="Living room detail" className="h-full w-full object-cover" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-accent font-medium">About NorthScape</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl leading-[1.05] text-balance">
            A quiet, wood-lit retreat at the foot of the Virungas.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            NorthScape brings together warm architecture, hand-crafted timber and calm interiors —
            minutes from Volcanoes National Park. Every apartment is designed for slow evenings,
            long stays and thoughtful hospitality.
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { title: "Modern living", copy: "Timber ceilings, marble floors, curated art." },
              { title: "Comfortable rooms", copy: "Crisp linens, headboards, quiet sleep." },
              { title: "Peaceful environment", copy: "Gated, secure, softly lit at night." },
              { title: "Great location", copy: "Minutes from Volcanoes National Park." },
            ].map((f) => (
              <li key={f.title} className="rounded-2xl border border-border/70 bg-card p-3.5 sm:p-5">
                <h3 className="font-display text-sm sm:text-lg font-bold">{f.title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.copy}</p>
              </li>
            ))}
          </ul>

          <Link
            to="/about"
            className="mt-8 sm:mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-all active:scale-95"
          >
            Learn more <ArrowUpRight className="size-4" />
          </Link>
        </motion.div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="bg-secondary/40 py-24 md:py-32">
        <div className="container-x">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <SectionTitle
              align="left"
              eyebrow="Featured stays"
              title="Rooms designed for slow, warm evenings"
              description="Every apartment is finished with hand-crafted timber, granite counters and marble floors."
            />
            <Link to="/rooms" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent">
              View all rooms <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            {featured.map((r, i) => (
              <RoomCard key={r.id} room={r} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container-x py-24 md:py-32">
        <SectionTitle
          eyebrow="Why NorthScape"
          title="Everything you'd expect — and more"
          description="Hand-picked comforts and thoughtful services included with every stay."
        />
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {whyChooseUs.map((key, i) => {
            const Icon = amenityIcon[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                className="group rounded-2xl sm:rounded-3xl border border-border/70 bg-card p-4 sm:p-7 shadow-soft transition-all"
              >
                <div className="inline-flex size-10 sm:size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Icon className="size-5 sm:size-6" />
                </div>
                <h3 className="mt-3 sm:mt-5 font-display text-sm sm:text-lg font-bold">{amenityLabel[key]}</h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Included in every stay across NorthScape.
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="container-x pb-24 md:pb-32">
        <SectionTitle eyebrow="Photography" title="A glance around the apartment" />
        <div className="mt-12 grid gap-4 grid-cols-2 md:grid-cols-4">
          {exteriorList.slice(0, 4).concat([img.living[0], img.kitchen[0], img.bedroom[1], img.living[3]]).map((src, i) => (
            <motion.div
              key={src + i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className={`relative overflow-hidden rounded-2xl ${i === 0 || i === 5 ? "md:col-span-2 md:row-span-2 aspect-[4/5]" : "aspect-square"}`}
            >
              <img src={src} loading="lazy" alt="NorthScape gallery preview" className="h-full w-full object-cover hover:scale-110 transition-transform duration-[1400ms]" />
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/gallery" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition">
            Open full gallery <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS & GUEST REVIEWS */}
      <section className="bg-primary text-primary-foreground py-24 md:py-32">
        <div className="container-x">
          <SectionTitle eyebrow="Guest Feedback & Reviews" title="Loved by travellers worldwide" />
          <div className="relative mt-12 max-w-3xl mx-auto">
            {allReviews.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.figure
                  key={tIdx % allReviews.length}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex justify-center gap-1 text-accent">
                    {Array.from({ length: allReviews[tIdx % allReviews.length].rating }).map((_, i) => (
                      <Star key={i} className="size-5 fill-current text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="mt-6 font-display text-2xl md:text-3xl leading-snug text-balance">
                    “{allReviews[tIdx % allReviews.length].comment || "An outstanding 5-star experience at NorthScape Apartment."}”
                  </blockquote>
                  <figcaption className="mt-8 inline-flex items-center gap-4">
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-sm">
                      {allReviews[tIdx % allReviews.length].guestName.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="text-left">
                      <div className="font-medium">{allReviews[tIdx % allReviews.length].guestName}</div>
                      <div className="text-xs opacity-70">
                        {allReviews[tIdx % allReviews.length].roomName} · Verified Stay
                      </div>
                    </div>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            )}

            <div className="mt-10 flex justify-center gap-2">
              {allReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === tIdx % allReviews.length ? "w-8 bg-primary-foreground" : "w-4 bg-primary-foreground/30"}`}
                  aria-label={`Review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url(${img.exterior.night1})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container-x py-24 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl text-balance"
          >
            Book your stay today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 text-lg text-white/85 max-w-xl mx-auto"
          >
            Reserve a warm, quiet apartment at NorthScape — the calm way to experience Musanze.
          </motion.p>
          <div className="mt-8 inline-flex items-center gap-4">
            <Link
              to="/book"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground hover:opacity-95 shadow-soft"
            >
              Reserve now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="hidden sm:flex items-center gap-1 text-sm text-white/75">
              <Users className="size-4" /> Free cancellation up to 48h
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
