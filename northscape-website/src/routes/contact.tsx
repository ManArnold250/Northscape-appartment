import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, ChevronDown } from "lucide-react";
import { SectionTitle } from "@/components/site/SectionTitle";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NorthScape Apartment" },
      { name: "description", content: "Reach the NorthScape team — questions, private bookings and long stays in Musanze, Rwanda." },
      { property: "og:title", content: "Contact — NorthScape Apartment" },
      { property: "og:description", content: "Reach the NorthScape team in Musanze, Rwanda for reservations and private stays." },
    ],
  }),
  component: ContactPage,
});

const faqs = [
  { q: "What's included in the nightly rate?", a: "Every rate includes WiFi, hot water, secure parking, fresh linens and 24/7 on-site service." },
  { q: "Do you offer airport transfers?", a: "Yes — we arrange transfers from Kigali International Airport on request. Contact us before arrival." },
  { q: "Can I cook in the apartment?", a: "Absolutely. Each apartment ships with a full kitchen: stove, oven, microwave, kettle, blender and cookware." },
  { q: "Is NorthScape suitable for families?", a: "Yes, our Family Residence sleeps up to five and includes two private bedrooms and a full living area." },
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <section className="pt-32 md:pt-40 container-x">
        <SectionTitle eyebrow="Contact" title="Say hello — we'd love to host you." description="Reservations, private bookings, event enquiries and long stays." />
      </section>

      <section className="container-x mt-14 grid gap-8 md:grid-cols-5">
        <motion.form
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          onSubmit={(e) => { e.preventDefault(); setSent(true); (e.currentTarget as HTMLFormElement).reset(); setTimeout(() => setSent(false), 4000); }}
          className="md:col-span-3 rounded-3xl border border-border bg-card p-8 shadow-soft"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Name</div>
              <input required className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus" />
            </label>
            <label className="text-sm">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
              <input type="email" required className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus" />
            </label>
            <label className="text-sm md:col-span-2">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Subject</div>
              <input className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus" />
            </label>
            <label className="text-sm md:col-span-2">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Message</div>
              <textarea rows={6} required className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-3 focus:ring-focus resize-none" />
            </label>
          </div>
          <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
            Send message <Send className="size-4" />
          </button>
          {sent && <p className="mt-3 text-sm text-accent">Thank you — we'll be in touch shortly.</p>}
        </motion.form>

        <div className="md:col-span-2 grid gap-4">
          <a
            href="https://maps.app.goo.gl/eVKydymUJHXkZDFW9?g_st=aw"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-3xl border border-border bg-card p-5 flex items-start gap-4 hover:border-accent hover:bg-secondary/40 transition-all group"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-accent/15 text-accent shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <MapPin className="size-5" />
            </span>
            <div>
              <div className="font-display text-lg flex items-center gap-1.5">
                <span>Address</span>
                <span className="text-[11px] text-accent font-sans font-semibold">Open Maps ↗</span>
              </div>
              <div className="text-sm text-muted-foreground">Musanze, Northern Province, Rwanda</div>
            </div>
          </a>

          {[
            { icon: Phone, title: "Phone", copy: "+250 788 764 000" },
            { icon: Mail, title: "Email", copy: "northscape.musanze@gmail.com" },
            { icon: Clock, title: "Hours", copy: "Reception open 24/7\nCheck-in from 14:00" },
          ].map((c) => (
            <div key={c.title} className="rounded-3xl border border-border bg-card p-5 flex items-start gap-4">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-accent/15 text-accent shrink-0"><c.icon className="size-5" /></span>
              <div>
                <div className="font-display text-lg">{c.title}</div>
                <div className="text-sm text-muted-foreground whitespace-pre-line">{c.copy}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x mt-16">
        <div className="relative rounded-3xl overflow-hidden border border-border shadow-soft aspect-[16/8] group">
          <iframe
            title="NorthScape Google Maps Location"
            src="https://maps.google.com/maps?q=-1.4988,29.6338&z=15&output=embed"
            loading="lazy"
            className="h-full w-full border-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-6">
            <div className="text-white">
              <div className="font-display text-xl font-bold">NorthScape Apartment Location</div>
              <div className="text-xs text-white/80">Musanze, Northern Province, Rwanda</div>
            </div>
            <a
              href="https://maps.app.goo.gl/eVKydymUJHXkZDFW9?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground shadow-lg hover:opacity-90 transition-all shrink-0"
            >
              Open in Google Maps 📍 ↗
            </a>
          </div>
        </div>
      </section>

      <section className="container-x mt-20 pb-24">
        <SectionTitle eyebrow="Questions" title="Frequently asked" />
        <div className="mt-10 max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between text-left px-5 py-4"
                aria-expanded={open === i}
              >
                <span className="font-medium">{f.q}</span>
                <ChevronDown className={`size-4 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
