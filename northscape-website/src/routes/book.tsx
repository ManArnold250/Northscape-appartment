import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, ArrowRight, ArrowLeft, ShieldCheck, Check, Copy, Smartphone } from "lucide-react";
import { getRoomsWithLiveStatus, getInitialRooms, saveBooking } from "@/lib/bookingStore";
import { img } from "@/lib/images";
import { SectionTitle } from "@/components/site/SectionTitle";
import { PAYMENT_METHODS, PAYMENT_NUMBER_DISPLAY, type PaymentMethod } from "@/lib/paymentConfig";

import { getStoredUser } from "@/lib/authStore";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Your Stay — NorthScape Apartment" },
      { name: "description", content: "Reserve your NorthScape residence in Musanze — official RWF accommodation rates, instant booking confirmation, and transparent pricing." },
      { property: "og:title", content: "Book Your Stay — NorthScape Apartment" },
      { property: "og:description", content: "Reserve your NorthScape residence in Musanze, Rwanda." },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const currentUser = useMemo(() => getStoredUser(), []);
  const [liveRooms, setLiveRooms] = useState(() => getInitialRooms());

  useEffect(() => {
    let active = true;
    getRoomsWithLiveStatus().then((r) => {
      if (active) setLiveRooms(r);
    });
    const handleUpdate = () => {
      getRoomsWithLiveStatus().then((r) => {
        if (active) setLiveRooms(r);
      });
    };
    window.addEventListener("northscape_booking_updated", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("northscape_booking_updated", handleUpdate);
    };
  }, []);

  const [roomSlug, setRoomSlug] = useState(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("room");
      if (p) {
        const match = liveRooms.find((r) => r.slug === p || r.id === p);
        if (match) return match.slug;
      }
    }
    return liveRooms[0]?.slug ?? "full-apartment-luxury";
  });

  const room = liveRooms.find((r) => r.slug === roomSlug) ?? liveRooms[0];

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const tomorrowStr = useMemo(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10), []);

  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);
  const [guests, setGuests] = useState(2);

  const [firstName, setFirstName] = useState(() => {
    if (currentUser?.name) return currentUser.name.split(" ")[0] || "";
    return "";
  });
  const [lastName, setLastName] = useState(() => {
    if (currentUser?.name) return currentUser.name.split(" ").slice(1).join(" ") || "";
    return "";
  });
  const [email, setEmail] = useState(() => currentUser?.email || "");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState<"details" | "payment">("details");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("momo");
  const [paymentReference, setPaymentReference] = useState("");
  const [referenceError, setReferenceError] = useState("");
  const [copied, setCopied] = useState(false);

  const nights = useMemo(() => {
    try {
      const d = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
      return isNaN(d) || d < 1 ? 1 : Math.round(d);
    } catch (_e) {
      return 1;
    }
  }, [checkIn, checkOut]);

  // Compute official rate in RWF and USD based on discount tiers
  const { totalRWF, totalUSD, rateTierName } = useMemo(() => {
    const safePriceRWF = room?.priceRWF ?? 100000;
    const safePriceUSD = room?.price ?? 75;

    if (room?.ratesRWF) {
      if (nights >= 30) {
        const months = Math.floor(nights / 30);
        const remDays = nights % 30;
        const total = months * (room.ratesRWF.month1 || 1500000) + remDays * safePriceRWF;
        return { totalRWF: total, totalUSD: Math.round(total / 1350), rateTierName: "Monthly Rate (1,500,000 RWF/mo)" };
      } else if (nights >= 14) {
        const total = room.ratesRWF.weeks2 || 800000;
        return { totalRWF: total, totalUSD: Math.round(total / 1350), rateTierName: "2 Weeks Rate (800,000 RWF)" };
      } else if (nights >= 7) {
        const total = room.ratesRWF.week1 || 500000;
        return { totalRWF: total, totalUSD: Math.round(total / 1350), rateTierName: "Weekly Rate (500,000 RWF/wk)" };
      } else if (nights >= 3) {
        const total = room.ratesRWF.days3 || 250000;
        return { totalRWF: total, totalUSD: Math.round(total / 1350), rateTierName: "3 Days Rate (250,000 RWF)" };
      }
    }
    const rwf = nights * safePriceRWF;
    const usd = nights * safePriceUSD;
    return { totalRWF: rwf, totalUSD: usd, rateTierName: "Standard Daily Rate" };
  }, [nights, room]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === "details") {
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!paymentReference.trim()) {
      setReferenceError("Enter the transaction ID/reference from the SMS you received");
      return;
    }
    setReferenceError("");
    setIsSubmitting(true);

    try {
      const record = await saveBooking({
        roomSlug: room?.slug || "full-apartment-luxury",
        roomName: room?.name || "NorthScape Residence",
        guestName: `${firstName} ${lastName}`.trim() || "Valued Guest",
        guestEmail: email,
        guestPhone: phone,
        checkIn,
        checkOut,
        guestsCount: guests,
        totalRWF,
        totalUSD,
        specialRequests,
        paymentMethod,
        paymentReference: paymentReference.trim(),
      });

      window.location.href = `/my-booking?code=${record.bookingCode}`;
    } catch (_e) {
      setIsSubmitting(false);
    }
  };

  const copyNumber = () => {
    navigator.clipboard?.writeText(PAYMENT_NUMBER_DISPLAY.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const roomImage = room?.images?.[0] || img.living[0];
  const maxCapacity = room?.capacity || 6;

  return (
    <div>
      <section className="pt-32 md:pt-40 container-x">
        <SectionTitle
          eyebrow="Direct Reservation"
          title="Reserve Your NorthScape Residence"
          description="Official accommodation rates in RWF and USD. Instant reservation confirmation with flexible payment on arrival."
        />
      </section>

      <section className="container-x mt-14 pb-24 grid gap-8 lg:grid-cols-3">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-3xl border border-border bg-card p-8 shadow-soft space-y-8"
        >
          {step === "details" && (
          <>
          <div>
            <h3 className="font-display text-2xl">Guest Information</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="text-sm">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">First Name</div>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jean"
                  className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus min-h-[44px]"
                />
              </label>
              <label className="text-sm">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Last Name</div>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Claude"
                  className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus min-h-[44px]"
                />
              </label>
              <label className="text-sm">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Email Address</div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@example.rw"
                  className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus min-h-[44px]"
                />
              </label>
              <label className="text-sm">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Phone Number</div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+250 788 764 000"
                  className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus min-h-[44px]"
                />
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl">Stay & Accommodation Selection</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <label className="text-sm">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1">
                  <Calendar className="size-3.5" /> Check-in Date
                </div>
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus min-h-[44px]"
                />
              </label>
              <label className="text-sm">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1">
                  <Calendar className="size-3.5" /> Check-out Date
                </div>
                <input
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus min-h-[44px]"
                />
              </label>
              <label className="text-sm">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1">
                  <Users className="size-3.5" /> Guests Count
                </div>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus min-h-[44px]"
                >
                  {Array.from({ length: maxCapacity }).map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} Guest{i > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm md:col-span-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Select Residence Unit</div>
                <select
                  value={roomSlug}
                  onChange={(e) => setRoomSlug(e.target.value)}
                  className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus font-medium min-h-[44px]"
                >
                  {liveRooms.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.name} — {r.priceRWF ? `${r.priceRWF.toLocaleString()} RWF` : `$${r.price}`}/day {r.isBooked ? `(🔴 Booked until ${r.availableFrom || "soon"})` : `(🟢 Available)`}
                    </option>
                  ))}
                </select>
              </label>

              {/* Clickable Room Detail Preview Card */}
              <div className="md:col-span-3 rounded-2xl border border-border/80 bg-secondary/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={roomImage} alt={room?.name || "Room"} className="size-16 rounded-xl object-cover shrink-0" />
                  <div>
                    <div className="font-display font-bold text-sm flex items-center gap-2">
                      <span>{room?.name}</span>
                      {room?.isBooked && (
                        <span className="rounded-full bg-destructive/15 text-destructive text-[10px] font-semibold px-2 py-0.5">
                          Booked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{room?.short}</p>
                  </div>
                </div>
                <a
                  href={`/rooms/${room?.slug || "full-apartment-luxury"}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 text-accent px-4 py-2 text-xs font-semibold hover:bg-accent hover:text-accent-foreground transition-all shrink-0 whitespace-nowrap"
                >
                  <span>View Photos & Details (Bathroom, Kitchen, Lounge)</span>
                  <ArrowRight className="size-3.5" />
                </a>
              </div>

              <label className="text-sm md:col-span-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Special Requests</div>
                <textarea
                  rows={4}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Airport transfer from Kigali, late check-in, extra linen..."
                  className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-3 focus:ring-focus resize-none"
                />
              </label>
            </div>
          </div>
          </>
          )}

          {step === "payment" && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setStep("details")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Back to details
            </button>

            <div>
              <h3 className="font-display text-2xl">Choose Payment Method</h3>
              <p className="text-sm text-muted-foreground mt-1">Pay via Mobile Money — your reservation is held while we verify your payment.</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPaymentMethod(key)}
                    className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                      paymentMethod === key ? "border-accent bg-accent/10" : "border-border bg-background hover:border-accent/40"
                    }`}
                  >
                    <Smartphone className={`size-5 shrink-0 ${paymentMethod === key ? "text-accent" : "text-muted-foreground"}`} />
                    <span className="font-semibold text-sm">{PAYMENT_METHODS[key].label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/30 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Send exactly</div>
                  <div className="font-display text-2xl font-bold text-accent">{totalRWF.toLocaleString()} RWF</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">To this number</div>
                  <button
                    type="button"
                    onClick={copyNumber}
                    className="inline-flex items-center gap-1.5 font-display text-lg font-bold hover:text-accent transition-colors"
                  >
                    {PAYMENT_NUMBER_DISPLAY}
                    <Copy className="size-3.5" />
                  </button>
                  {copied && <div className="text-[11px] text-emerald-600 font-medium">Copied!</div>}
                </div>
              </div>

              <ol className="space-y-2 text-sm">
                {PAYMENT_METHODS[paymentMethod].steps.map((s, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="shrink-0 size-5 rounded-full bg-accent/15 text-accent text-[11px] font-bold grid place-items-center mt-0.5">{i + 1}</span>
                    <span className="text-secondary-foreground">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <label className="text-sm block">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Transaction ID / Reference</div>
              <input
                type="text"
                required
                value={paymentReference}
                onChange={(e) => {
                  setPaymentReference(e.target.value);
                  if (referenceError) setReferenceError("");
                }}
                placeholder="e.g. MP240712.1830.A12345"
                className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-2.5 focus:ring-focus min-h-[44px] font-mono"
              />
              {referenceError && <div className="mt-1.5 text-xs text-destructive font-medium">{referenceError}</div>}
              <p className="mt-1.5 text-xs text-muted-foreground">This is the code from the confirmation SMS you receive after sending payment.</p>
            </label>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
              Your booking will show as <strong>Pending Verification</strong> until our team confirms your payment was received — usually within a few hours.
            </div>
          </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-soft transition-all min-h-[48px]"
          >
            {isSubmitting
              ? "Submitting..."
              : step === "details"
              ? "Continue to Payment"
              : "I've Sent the Payment — Submit"}
            <ArrowRight className="size-4" />
          </button>
        </motion.form>

        <aside className="lg:sticky lg:top-28 h-fit">
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-soft">
            <a
              href={`/rooms/${room?.slug || "full-apartment-luxury"}`}
              className="group block relative aspect-[4/3] overflow-hidden"
              aria-label={`View full room photos and description for ${room?.name || "Room"}`}
            >
              <img src={roomImage} alt={room?.name || "Room"} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
              
              <div className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-[11px] font-semibold text-foreground inline-flex items-center gap-1 shadow-md">
                <span>See Photos & Details</span> ↗
              </div>

              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-xs uppercase tracking-widest opacity-80 font-semibold">{room?.type}</div>
                <div className="font-display text-xl font-bold group-hover:text-accent transition-colors">{room?.name}</div>
                <p className="text-xs text-white/80 line-clamp-1 mt-0.5">{room?.short}</p>
              </div>
            </a>
            <div className="p-6 space-y-4">
              <h4 className="font-display text-lg">Official Rate Summary</h4>

              <div className="rounded-2xl bg-secondary/50 p-3.5 text-xs text-secondary-foreground font-medium">
                Applied Tier: <strong className="text-accent">{rateTierName}</strong>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span className="font-medium">{checkIn}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span className="font-medium">{checkOut}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{nights} night{nights > 1 ? "s" : ""}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-medium">{guests}</span></div>
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between font-bold text-lg text-foreground">
                  <span>Total (RWF)</span>
                  <span className="text-accent">{totalRWF.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Equivalent USD</span>
                  <span>~${totalUSD} USD</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 text-xs text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-emerald-600 shrink-0" /> Free cancellation anytime before check-in</div>
                <div className="flex items-center gap-1.5"><Check className="size-4 text-accent shrink-0" /> Pay via MoMo or Airtel — confirmed after verification</div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
