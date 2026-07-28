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
  const featured = rooms.filter((r) => r.featured);
  const [heroIdx, setHeroIdx] = useState(0);
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO.length), 5500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTIdx((i) => (i + 1) % testimonials.length), 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={heroIdx}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img src={HERO[heroIdx]} alt="NorthScape apartment exterior" className="h-full w-full object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />

        <div className="relative z-10 h-full container-x flex flex-col items-center justify-center text-center text-white">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs md:text-sm uppercase tracking-[0.4em] text-white/80"
          >
            Musanze · Northern Province · Rwanda
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.98] text-balance"
          >
            NorthScape
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-4 font-display italic text-xl md:text-2xl text-white/85"
          >
            A luxury apartment experience
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-6 max-w-xl text-base md:text-lg text-white/85 leading-relaxed"
          >
            Warm timber, marble floors and hand-crafted furniture — a quiet retreat at the foot of the Virunga mountains.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/book"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground shadow-soft hover:opacity-95 transition"
            >
              Book Now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur px-7 py-3.5 text-sm font-medium text-white hover:bg-white/20 transition"
            >
              Explore Rooms
            </Link>
          </motion.div>

          {/* slideshow dots */}
          <div className="absolute bottom-24 md:bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
            {HERO.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === heroIdx ? "w-8 bg-white" : "w-4 bg-white/40"}`}
              />
            ))}
          </div>

          {/* scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80"
          >
            <ChevronDown className="size-6" />
          </motion.div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="container-x py-24 md:py-32 grid gap-12 md:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
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
          viewport={{ once: true, margin: "-80px" }}
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

          <ul className="mt-8 grid grid-cols-2 gap-4">
            {[
              { title: "Modern living", copy: "Timber ceilings, marble floors, curated art." },
              { title: "Comfortable rooms", copy: "Crisp linens, sculpted headboards, quiet sleep." },
              { title: "Peaceful environment", copy: "Gated, secure, softly lit at night." },
              { title: "Great location", copy: "Minutes from Volcanoes National Park." },
            ].map((f) => (
              <li key={f.title} className="rounded-2xl border border-border/70 bg-card p-5">
                <h3 className="font-display text-lg">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.copy}</p>
              </li>
            ))}
          </ul>

          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
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
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {whyChooseUs.map((key, i) => {
            const Icon = amenityIcon[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group rounded-3xl border border-border/70 bg-card p-7 hover:-translate-y-1 hover:shadow-soft transition-all"
              >
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-5 font-display text-lg">{amenityLabel[key]}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Included in every stay, at every apartment across NorthScape.
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

      {/* TESTIMONIALS */}
      <section className="bg-primary text-primary-foreground py-24 md:py-32">
        <div className="container-x">
          <SectionTitle eyebrow="Guest stories" title="Loved by travellers worldwide" />
          <div className="relative mt-12 max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.figure
                key={tIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="flex justify-center gap-1 text-accent">
                  {Array.from({ length: testimonials[tIdx].rating }).map((_, i) => (
                    <Star key={i} className="size-5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-6 font-display text-2xl md:text-3xl leading-snug text-balance">
                  “{testimonials[tIdx].quote}”
                </blockquote>
                <figcaption className="mt-8 inline-flex items-center gap-4">
                  <img src={testimonials[tIdx].avatar} alt="" className="size-12 rounded-full object-cover border-2 border-primary-foreground/20" />
                  <div className="text-left">
                    <div className="font-medium">{testimonials[tIdx].name}</div>
                    <div className="text-xs opacity-70">{testimonials[tIdx].country} · {testimonials[tIdx].stay}</div>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            <div className="mt-10 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === tIdx ? "w-8 bg-primary-foreground" : "w-4 bg-primary-foreground/30"}`}
                  aria-label={`Testimonial ${i + 1}`}
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
