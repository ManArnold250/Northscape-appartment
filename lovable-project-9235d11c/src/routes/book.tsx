import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Calendar, Users, ArrowRight, X } from "lucide-react";
import { rooms } from "@/data/rooms";
import { img } from "@/lib/images";
import { SectionTitle } from "@/components/site/SectionTitle";

type Search = { room?: string };

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    room: typeof s.room === "string" ? s.room : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book Your Stay — NorthScape Apartment" },
      { name: "description", content: "Reserve your NorthScape apartment in Musanze — quick booking, transparent pricing, and instant confirmation." },
      { property: "og:title", content: "Book Your Stay — NorthScape Apartment" },
      { property: "og:description", content: "Reserve your NorthScape apartment in Musanze, Rwanda." },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const { room: preselect } = Route.useSearch();
  const [roomSlug, setRoomSlug] = useState(preselect ?? rooms[0].slug);
  const room = rooms.find((r) => r.slug === roomSlug) ?? rooms[0];

  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);
  const [checkIn, setCheckIn] = useState(today.toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(tomorrow.toISOString().slice(0, 10));
  const [guests, setGuests] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  const nights = useMemo(() => {
    const d = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
    return Math.max(1, Math.round(d));
  }, [checkIn, checkOut]);

  const subtotal = nights * room.price;
  const service = Math.round(subtotal * 0.08);
  const tax = Math.round(subtotal * 0.06);
  const total = subtotal + service + tax;

  return (
    <div>
      <section className="pt-32 md:pt-40 container-x">
        <SectionTitle eyebrow="Book" title="Reserve your NorthScape stay" description="Fill in your details — we'll confirm your apartment within moments." />
      </section>

      <section className="container-x mt-14 pb-24 grid gap-8 lg:grid-cols-3">
        <motion.form
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          onSubmit={(e) => { e.preventDefault(); setConfirmed(true); }}
          className="lg:col-span-2 rounded-3xl border border-border bg-card p-8 shadow-soft"
        >
          <h3 className="font-display text-2xl">Guest information</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[
              { label: "First name", type: "text", required: true },
              { label: "Last name", type: "text", required: true },
              { label: "Email", type: "email", required: true },
              { label: "Phone", type: "tel", required: true },
            ].map((f) => (
              <label key={f.label} className="text-sm">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{f.label}</div>
                <input type={f.type} required={f.required} className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus" />
              </label>
            ))}
          </div>

          <h3 className="mt-10 font-display text-2xl">Stay details</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <label className="text-sm">
              <div className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1"><Calendar className="size-3" /> Check-in</div>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus" />
            </label>
            <label className="text-sm">
              <div className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1"><Calendar className="size-3" /> Check-out</div>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus" />
            </label>
            <label className="text-sm">
              <div className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1"><Users className="size-3" /> Guests</div>
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus">
                {Array.from({ length: room.capacity }).map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1} guest{i > 0 ? "s" : ""}</option>
                ))}
              </select>
            </label>
            <label className="text-sm md:col-span-3">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Room</div>
              <select value={roomSlug} onChange={(e) => setRoomSlug(e.target.value)} className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus">
                {rooms.map((r) => (
                  <option key={r.slug} value={r.slug}>{r.name} — ${r.price}/night · up to {r.capacity} guests</option>
                ))}
              </select>
            </label>
            <label className="text-sm md:col-span-3">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Special requests</div>
              <textarea rows={4} placeholder="Late check-in, dietary needs, airport transfer…" className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-3 focus:ring-focus resize-none" />
            </label>
          </div>

          <button type="submit" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90">
            Reserve stay <ArrowRight className="size-4" />
          </button>
        </motion.form>

        <aside className="lg:sticky lg:top-28 h-fit">
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-soft">
            <div className="relative aspect-[4/3]">
              <img src={room.images[0]} alt={room.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-xs uppercase tracking-widest opacity-80">{room.type}</div>
                <div className="font-display text-xl">{room.name}</div>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-display text-lg">Booking summary</h4>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span>{checkIn}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span>{checkOut}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span>{guests}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Nights</span><span>{nights}</span></div>
              </div>
              <div className="mt-5 border-t border-border pt-5 space-y-2 text-sm">
                <div className="flex justify-between"><span>${room.price} × {nights} night{nights > 1 ? "s" : ""}</span><span>${subtotal}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Service fee</span><span>${service}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Taxes</span><span>${tax}</span></div>
              </div>
              <div className="mt-5 border-t border-border pt-5 flex items-center justify-between">
                <span className="font-display text-lg">Total</span>
                <span className="font-display text-2xl">${total}</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Free cancellation up to 48 hours before check-in.</p>
            </div>
          </div>
        </aside>
      </section>

      {/* Confirmation modal */}
      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4"
            onClick={() => setConfirmed(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-card p-8 shadow-soft border border-border"
            >
              <button className="absolute right-4 top-4 size-8 grid place-items-center rounded-full hover:bg-muted" onClick={() => setConfirmed(false)} aria-label="Close">
                <X className="size-4" />
              </button>
              <div className="mx-auto size-16 rounded-full bg-accent/15 grid place-items-center text-accent">
                <Check className="size-8" />
              </div>
              <h3 className="mt-6 text-center font-display text-2xl">Reservation received</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                We'll send a confirmation email for your <span className="font-medium text-foreground">{room.name}</span> stay with {nights} night{nights > 1 ? "s" : ""} for ${total} within a few minutes.
              </p>
              <div className="mt-6 rounded-2xl bg-secondary/50 p-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span>{checkIn}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span>{checkOut}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span>{guests}</span></div>
              </div>
              <button
                onClick={() => setConfirmed(false)}
                className="mt-6 w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-medium hover:opacity-90"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative image */}
      <div className="hidden">{img.exterior.day}</div>
    </div>
  );
}
