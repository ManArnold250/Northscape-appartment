import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Calendar, Users, Phone, MessageSquare, AlertTriangle, ArrowRight, ShieldCheck, XCircle, Home, Star } from "lucide-react";
import { getStoredBookings, getBookingByCode, cancelBooking, type CustomerBooking } from "@/lib/bookingStore";
import { saveReview } from "@/lib/reviewStore";
import { rooms } from "@/data/rooms";
import { SectionTitle } from "@/components/site/SectionTitle";

export const Route = createFileRoute("/my-booking")({
  head: () => ({
    meta: [
      { title: "My Reservation — NorthScape Apartment" },
      { name: "description", content: "Manage your guest reservation, contact your host via WhatsApp (+250 795516091), or modify your stay." },
    ],
  }),
  component: MyBookingPage,
});

function MyBookingPage() {
  const [bookingCode, setBookingCode] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const paramCode = new URLSearchParams(window.location.search).get("code");
      if (paramCode) return paramCode;
    }
    return "";
  });

  const [booking, setBooking] = useState<CustomerBooking | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const load = async () => {
      let found: CustomerBooking | undefined;
      if (bookingCode) {
        found = await getBookingByCode(bookingCode);
      } else {
        const all = await getStoredBookings();
        found = all.find((b) => b.status === "confirmed" || b.status === "pending");
        if (found) setBookingCode(found.bookingCode);
      }
      if (active) {
        setBooking(found);
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [bookingCode]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // Guest Review State
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    saveReview({
      bookingCode: booking.bookingCode,
      roomSlug: booking.roomSlug,
      roomName: booking.roomName,
      guestName: booking.guestName,
      rating: userRating,
      comment: reviewComment,
    });
    setReviewSubmitted(true);
  };

  useEffect(() => {
    const handleUpdate = () => {
      if (bookingCode) {
        getBookingByCode(bookingCode).then(setBooking);
      } else {
        getStoredBookings().then((all) => setBooking(all.find((b) => b.status === "confirmed" || b.status === "pending")));
      }
    };
    window.addEventListener("northscape_booking_updated", handleUpdate);
    return () => window.removeEventListener("northscape_booking_updated", handleUpdate);
  }, [bookingCode]);

  const room = rooms.find((r) => r.slug === booking?.roomSlug) || rooms[0];
  const hostNumber = "+250 788 764 000";
  const whatsappUrl = booking
    ? `https://wa.me/250788764000?text=${encodeURIComponent(
        `Hello NorthScape, I have booked ${booking.roomName} (Code: ${booking.bookingCode}). I would like to confirm my arrival details.`
      )}`
    : `https://wa.me/250788764000?text=${encodeURIComponent("Hello NorthScape, I have a question about my stay.")}`;

  const handleConfirmCancel = async () => {
    if (!booking) return;
    const success = await cancelBooking(booking.bookingCode);
    if (success) {
      setBooking((prev) => (prev ? { ...prev, status: "cancelled" } : undefined));
      setIsCancelled(true);
      setShowCancelModal(false);
    }
  };

  return (
    <div>
      <section className="pt-32 md:pt-40 container-x">
        <SectionTitle
          eyebrow="Guest Dashboard"
          title={booking ? "Your Reservation Details" : "Guest Reservation Portal"}
          description="View your active stay details, chat directly with host on WhatsApp (+250 795516091), or manage your reservation."
        />
      </section>

      <section className="container-x mt-10 pb-24 max-w-4xl mx-auto">
        {loading ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-soft text-muted-foreground text-sm">
            Loading your reservation…
          </div>
        ) : !booking || booking.status === "cancelled" || isCancelled ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-card p-8 md:p-12 text-center shadow-soft space-y-6"
          >
            <div className="mx-auto size-20 rounded-full bg-amber-500/15 grid place-items-center text-amber-600">
              <XCircle className="size-10" />
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold">
                {isCancelled || booking?.status === "cancelled"
                  ? "Reservation Cancelled"
                  : "No Active Booking Found"}
              </h3>
              <p className="mt-2 text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                {isCancelled || booking?.status === "cancelled"
                  ? "Your booking has been cancelled successfully. The room is now available for other guests."
                  : "We couldn't locate an active booking under this session. Browse our available residences to reserve your stay."}
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/rooms"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all min-h-[44px]"
              >
                Browse Available Rooms <ArrowRight className="size-4" />
              </a>
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-secondary transition-all min-h-[44px]"
              >
                <Home className="size-4" /> Return to Home
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-card overflow-hidden shadow-soft"
          >
            {/* Status Banner */}
            <div className={`p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 text-white ${
              booking.paymentStatus === "confirmed" ? "bg-emerald-600" : booking.paymentStatus === "rejected" ? "bg-destructive" : "bg-amber-500"
            }`}>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white/20 grid place-items-center shrink-0">
                  <Check className="size-6 text-white" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest opacity-90 font-semibold">
                    {booking.paymentStatus === "confirmed"
                      ? "Booking Confirmed"
                      : booking.paymentStatus === "rejected"
                      ? "Payment Not Verified"
                      : "Pending Payment Verification"}
                  </div>
                  <div className="font-display text-xl font-bold">Code: {booking.bookingCode}</div>
                </div>
              </div>
              <span className="rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold backdrop-blur">
                {booking.paymentStatus === "confirmed"
                  ? "🟢 Room Reserved & Locked"
                  : booking.paymentStatus === "rejected"
                  ? "🔴 Please Contact Us"
                  : "🟡 Awaiting Verification"}
              </span>
            </div>

            {booking.paymentStatus === "pending_verification" && (
              <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-4 text-sm text-amber-700 dark:text-amber-400">
                We've received your payment reference and are verifying it — this usually takes a few hours. You'll be able to check back here anytime with your booking code.
              </div>
            )}
            {booking.paymentStatus === "rejected" && (
              <div className="bg-destructive/10 border-b border-destructive/30 px-6 py-4 text-sm text-destructive">
                We couldn't verify the payment reference you submitted. Please contact us on WhatsApp so we can help resolve this.
              </div>
            )}

            <div className="p-6 md:p-10 space-y-8">
              {/* Room Card Preview */}
              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-6 grid gap-6 md:grid-cols-3 items-center">
                <div className="rounded-xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-full">
                  <img src={room.images[0]} alt={room.name} className="h-full w-full object-cover" />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <span className="rounded-full bg-accent/15 text-accent px-3 py-1 text-xs font-semibold">
                    {room.type}
                  </span>
                  <h3 className="font-display text-2xl font-bold">{room.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{room.short}</p>

                  <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="size-3.5 text-accent" /> {booking.guestsCount} Guests</span>
                    <span className="flex items-center gap-1"><Calendar className="size-3.5 text-accent" /> {booking.checkIn} → {booking.checkOut}</span>
                  </div>
                </div>
              </div>

              {/* Guest & Rate Info Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border/70 p-5 space-y-3 bg-background">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Guest Information</div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Primary Guest</span><span className="font-semibold">{booking.guestName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{booking.guestEmail}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{booking.guestPhone}</span></div>
                    {booking.specialRequests && (
                      <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground">
                        <strong>Special Request:</strong> {booking.specialRequests}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 p-5 space-y-3 bg-background">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Payment & Rate Summary</div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span className="font-medium">{booking.checkIn}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span className="font-medium">{booking.checkOut}</span></div>
                    <div className="flex justify-between font-bold text-base pt-2 border-t border-border/60">
                      <span>Total Amount</span>
                      <span className="text-accent">{booking.totalRWF.toLocaleString()} RWF (~${booking.totalUSD} USD)</span>
                    </div>
                    {booking.paymentMethod && (
                      <div className="flex justify-between pt-2 border-t border-border/60">
                        <span className="text-muted-foreground">Paid via</span>
                        <span className="font-medium">{booking.paymentMethod === "momo" ? "MTN MoMo" : "Airtel Money"}</span>
                      </div>
                    )}
                    {booking.paymentReference && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reference</span>
                        <span className="font-mono text-xs font-medium">{booking.paymentReference}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* DIRECT HOST CONTACT ACTIONS (WhatsApp & Call +250 795516091) */}
              <div className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4">
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                    <MessageSquare className="size-5 text-emerald-600" /> Host Contact & Arrival Coordination
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Contact your NorthScape host on <strong>{hostNumber}</strong> to coordinate key pick-up, airport transfers, or special requests.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3.5 text-sm font-semibold hover:bg-[#20bd5a] shadow-md transition-all active:scale-95 min-h-[48px]"
                  >
                    <MessageSquare className="size-4" /> Send WhatsApp Message
                  </a>
                  <a
                    href={`tel:${hostNumber.replace(/\s+/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-foreground/80 bg-background text-foreground px-6 py-3.5 text-sm font-semibold hover:bg-secondary transition-all active:scale-95 min-h-[48px]"
                  >
                    <Phone className="size-4" /> Call Host ({hostNumber})
                  </a>
                </div>
              </div>

              {/* GUEST REVIEW & FEEDBACK SYSTEM */}
              <div className="rounded-3xl border border-border bg-background p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-lg font-bold flex items-center gap-2">
                      <Star className="size-5 text-amber-500 fill-amber-500" /> Rate & Review Your Stay
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Share your experience to help future guests. Your review will be displayed publicly on the website.
                    </p>
                  </div>
                </div>

                {reviewSubmitted ? (
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center space-y-2">
                    <div className="flex justify-center gap-1 text-amber-500">
                      {Array.from({ length: userRating }).map((_, i) => (
                        <Star key={i} className="size-5 fill-amber-500" />
                      ))}
                    </div>
                    <div className="font-bold text-sm text-foreground">Thank you for your feedback!</div>
                    <p className="text-xs text-muted-foreground">
                      Your review has been published and is now visible to visitors on the NorthScape website.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                        Select Rating (1 to 5 Stars)
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 hover:scale-110 transition-transform focus:outline-none"
                          >
                            <Star
                              className={`size-7 sm:size-8 transition-colors ${
                                star <= (hoverRating || userRating)
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-3 text-sm font-bold text-foreground">
                          {hoverRating || userRating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                        Optional Review / Feedback
                      </div>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell us about your experience — comfort, cleanliness, view, hospitality..."
                        className="w-full rounded-2xl bg-card border border-border p-3.5 text-xs sm:text-sm focus:ring-focus resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 text-xs sm:text-sm font-semibold hover:opacity-90 shadow-soft transition-all min-h-[44px]"
                    >
                      Submit & Publish Review <ArrowRight className="size-4" />
                    </button>
                  </form>
                )}
              </div>

              {/* CANCEL BOOKING OPTION */}
              <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-600 shrink-0" /> Free cancellation anytime before check-in.
                </div>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="rounded-full border border-destructive/40 text-destructive hover:bg-destructive hover:text-white px-5 py-2.5 text-xs font-semibold transition-all min-h-[40px]"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-border space-y-5"
            >
              <div className="mx-auto size-14 rounded-full bg-destructive/15 grid place-items-center text-destructive">
                <AlertTriangle className="size-7" />
              </div>

              <div className="text-center">
                <h3 className="font-display text-xl font-bold">Cancel Reservation?</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Are you sure you want to cancel booking <strong>{booking?.bookingCode}</strong> for <strong>{booking?.roomName}</strong>? This room will be freed up for other guests immediately.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="rounded-full border border-border py-2.5 text-xs font-semibold hover:bg-secondary min-h-[44px]"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="rounded-full bg-destructive text-destructive-foreground py-2.5 text-xs font-semibold hover:opacity-90 min-h-[44px]"
                >
                  Yes, Cancel Reservation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
