import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mountain, Heart, Sparkles, Users, ArrowRight } from "lucide-react";
import { img } from "@/lib/images";
import { SectionTitle } from "@/components/site/SectionTitle";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — NorthScape Apartment" },
      { name: "description", content: "The story, mission and vision behind NorthScape Apartment — warm hospitality in Musanze, Rwanda." },
      { property: "og:title", content: "Our Story — NorthScape Apartment" },
      { property: "og:description", content: "Warm hospitality, hand-crafted timber and calm evenings in Musanze, Rwanda." },
      { property: "og:image", content: img.exterior.day },
      { name: "twitter:image", content: img.exterior.day },
    ],
  }),
  component: AboutPage,
});

const timeline = [
  { year: "2019", title: "A quiet idea", copy: "The first sketches of NorthScape are drawn — a warm apartment to welcome travellers to Musanze." },
  { year: "2021", title: "Ground broken", copy: "Construction begins with local craftsmen, using timber ceilings and stone masonry." },
  { year: "2023", title: "Doors open", copy: "NorthScape welcomes its first guests, quickly becoming a favourite retreat for slow travellers." },
  { year: "2026", title: "Second wing", copy: "New family residences added, keeping the same hand-crafted details throughout." },
];

const stats = [
  { k: "12+", v: "Apartments" },
  { k: "4.9", v: "Guest rating" },
  { k: "38", v: "Countries welcomed" },
  { k: "24/7", v: "On-site service" },
];

export function AboutPage() {
  return (
    <div>
      <section className="relative pt-32 md:pt-40 pb-24 overflow-hidden">
        <img src={img.exterior.wide} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="relative container-x">
          <SectionTitle
            eyebrow="Our Story"
            title="A quiet corner of Musanze, made with love."
            description="NorthScape was born from a belief that travel should feel like coming home — warm, calm and unhurried."
          />
        </div>
      </section>

      <section className="container-x grid gap-12 md:grid-cols-2 items-center pb-24">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="aspect-[4/5] rounded-3xl overflow-hidden shadow-soft">
          <img src={img.exterior.close} alt="NorthScape exterior facade" className="h-full w-full object-cover" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h3 className="font-display text-3xl md:text-4xl">Rooted in Musanze, built by hand.</h3>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            At the foot of the Virunga volcanoes, NorthScape is more than an apartment — it's a place designed
            around slow mornings, home-cooked evenings and long walks through the northern hills.
          </p>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Every ceiling, every wooden headboard and every stone finish was made with local craftspeople.
            The result is a stay that feels grounded, warm and unmistakably Rwandan.
          </p>
        </motion.div>
      </section>

      <section className="container-x pb-24 grid gap-8 md:grid-cols-3">
        {[
          { icon: Mountain, title: "Mission", copy: "To offer warm, quiet, thoughtfully designed apartments that make every guest feel at home in Musanze." },
          { icon: Heart, title: "Vision", copy: "A generation of travellers who choose slow, place-based stays over anonymous hotel rooms." },
          { icon: Sparkles, title: "Values", copy: "Craft, calm, and care — for our guests, our neighbours and the mountains that surround us." },
        ].map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-3xl border border-border/70 bg-card p-8"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <v.icon className="size-6" />
            </span>
            <h4 className="mt-5 font-display text-2xl">{v.title}</h4>
            <p className="mt-2 text-muted-foreground leading-relaxed">{v.copy}</p>
          </motion.div>
        ))}
      </section>

      <section className="bg-secondary/40 py-24">
        <div className="container-x">
          <SectionTitle eyebrow="Photo timeline" title="A short history of NorthScape" />
          <div className="mt-14 grid gap-3 sm:gap-6 grid-cols-2 md:grid-cols-4">
            {timeline.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-30px" }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                className="relative rounded-2xl sm:rounded-3xl border border-border/70 bg-card p-4 sm:p-6 shadow-soft"
              >
                <div className="font-display text-2xl sm:text-4xl text-accent font-bold">{t.year}</div>
                <h4 className="mt-2 sm:mt-3 font-display text-sm sm:text-lg font-bold">{t.title}</h4>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{t.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.v}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-30px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="text-center"
            >
              <div className="font-display text-3xl sm:text-5xl md:text-6xl font-bold">{s.k}</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm uppercase tracking-widest text-muted-foreground font-semibold">{s.v}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 rounded-3xl bg-primary text-primary-foreground p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-3xl md:text-4xl">Ready to experience NorthScape?</h3>
            <p className="mt-2 opacity-85">Reserve your apartment in a few taps.</p>
          </div>
          <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground hover:opacity-95">
            Book a stay <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
