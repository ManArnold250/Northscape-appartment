import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogOut, CheckCircle, Clock, AlertTriangle, Search, Plus, Calendar, DollarSign, Users, RefreshCw, Smartphone, Check, X } from "lucide-react";
import { getRoomsWithAvailabilityFn, getAllBookingsFn, toggleRoomStatusFn, confirmPaymentFn, rejectPaymentFn } from "@/lib/serverFns";
import type { BookingRecord } from "@/lib/db";
import type { Room } from "@/data/rooms";
import { SectionTitle } from "@/components/site/SectionTitle";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — NorthScape Apartment" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  
  const [roomsList, setRoomsList] = useState<Room[]>([]);
  const [bookingsList, setBookingsList] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Manual booking form state
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newRoomSlug, setNewRoomSlug] = useState("");
  const [newCheckIn, setNewCheckIn] = useState("");
  const [newCheckOut, setNewCheckOut] = useState("");

  const refreshData = async () => {
    setLoading(true);
    const r = await getRoomsWithAvailabilityFn();
    const b = await getAllBookingsFn();
    setRoomsList(r);
    setBookingsList(b);
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      refreshData();
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === "northscape2026" || pin.trim() === "1234") {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid Admin PIN / Password. Try 'northscape2026'");
    }
  };

  const handleToggleStatus = async (slug: string, currentBooked: boolean, availDate?: string) => {
    const nextStatus = currentBooked ? "available" : "booked";
    const defaultAvail = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);
    await toggleRoomStatusFn({
      data: {
        slug,
        status: nextStatus,
        availableFrom: nextStatus === "booked" ? (availDate || defaultAvail) : undefined,
      },
    });
    await refreshData();
  };

  const [payingCode, setPayingCode] = useState<string | null>(null);

  const handleConfirmPayment = async (code: string) => {
    setPayingCode(code);
    await confirmPaymentFn({ data: { code } });
    await refreshData();
    setPayingCode(null);
  };

  const handleRejectPayment = async (code: string) => {
    setPayingCode(code);
    await rejectPaymentFn({ data: { code } });
    await refreshData();
    setPayingCode(null);
  };

  const totalRevenueRWF = bookingsList.reduce((acc, b) => acc + (b.totalRWF || 0), 0);
  const activeBookingsCount = bookingsList.filter((b) => b.status === "confirmed").length;
  const occupiedRoomsCount = roomsList.filter((r) => r.isBooked).length;
  const occupancyRate = roomsList.length > 0 ? Math.round((occupiedRoomsCount / roomsList.length) * 100) : 0;

  const filteredBookings = bookingsList.filter(
    (b) =>
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingPayments = bookingsList.filter((b) => b.paymentStatus === "pending_verification");

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-32 pb-24 container-x flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft"
        >
          <div className="mx-auto size-14 rounded-2xl bg-accent/15 grid place-items-center text-accent">
            <Lock className="size-7" />
          </div>
          <h2 className="mt-6 text-center font-display text-3xl">Admin Management Portal</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter private admin PIN or password to manage NorthScape bookings & XAMPP database.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Admin Passcode</span>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN (Default: northscape2026)"
                className="mt-1.5 w-full rounded-xl bg-background border border-border px-4 py-3 text-center text-lg font-mono focus:ring-focus min-h-[48px]"
              />
            </label>

            {error && <p className="text-center text-xs text-destructive font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-full bg-primary text-primary-foreground py-3.5 text-sm font-semibold shadow-soft hover:opacity-90 transition-all min-h-[48px]"
            >
              Authenticate Admin
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 container-x space-y-10">
      {/* Admin Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-accent font-semibold">Private Management Console</div>
          <h1 className="font-display text-3xl sm:text-4xl mt-1">NorthScape Control Panel</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary transition-all"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Live Data
          </button>
          <button
            onClick={() => setAuthenticated(false)}
            className="inline-flex items-center gap-2 rounded-full bg-destructive/15 text-destructive px-4 py-2 text-xs font-semibold hover:bg-destructive/25 transition-all"
          >
            <LogOut className="size-3.5" /> Lock Session
          </button>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-widest font-semibold">Total Revenue (RWF)</span>
            <DollarSign className="size-5 text-accent" />
          </div>
          <div className="mt-3 font-display text-3xl font-bold">{totalRevenueRWF.toLocaleString()} RWF</div>
          <div className="mt-1 text-xs text-muted-foreground">~${Math.round(totalRevenueRWF / 1350)} USD</div>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-widest font-semibold">Active Bookings</span>
            <CheckCircle className="size-5 text-emerald-600" />
          </div>
          <div className="mt-3 font-display text-3xl font-bold">{activeBookingsCount}</div>
          <div className="mt-1 text-xs text-muted-foreground">Confirmed reservations</div>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-widest font-semibold">Occupancy Rate</span>
            <Users className="size-5 text-accent" />
          </div>
          <div className="mt-3 font-display text-3xl font-bold">{occupancyRate}%</div>
          <div className="mt-1 text-xs text-muted-foreground">{occupiedRoomsCount} of {roomsList.length} units occupied</div>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-widest font-semibold">Database Connection</span>
            <span className="size-3 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-emerald-700 dark:text-emerald-400">Database Live</div>
          <div className="mt-1 text-xs text-muted-foreground">Railway MySQL</div>
        </div>
      </div>

      {/* Pending Mobile Money Payments — needs manual verification */}
      {pendingPayments.length > 0 && (
        <div className="rounded-3xl border-2 border-amber-500/40 bg-amber-500/5 p-6 shadow-soft space-y-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-amber-500/20 grid place-items-center text-amber-600 dark:text-amber-400 shrink-0">
              <Smartphone className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-2xl">Pending Payment Verification</h3>
              <p className="text-sm text-muted-foreground">
                Check each transaction reference against your MoMo/Airtel SMS before confirming.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {pendingPayments.map((b) => (
              <div key={b.id} className="rounded-2xl border border-border/70 bg-card p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-accent">{b.bookingCode}</span>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold">
                      {b.paymentMethod === "momo" ? "MTN MoMo" : b.paymentMethod === "airtel" ? "Airtel Money" : "—"}
                    </span>
                  </div>
                  <div className="mt-1 font-semibold text-sm">{b.guestName} · {b.roomName}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Reference: <span className="font-mono font-medium text-foreground">{b.paymentReference || "—"}</span>
                    {" · "}Amount: <span className="font-semibold text-foreground">{b.totalRWF.toLocaleString()} RWF</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleConfirmPayment(b.bookingCode)}
                    disabled={payingCode === b.bookingCode}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-4 py-2 text-xs font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50"
                  >
                    <Check className="size-3.5" /> Confirm
                  </button>
                  <button
                    onClick={() => handleRejectPayment(b.bookingCode)}
                    disabled={payingCode === b.bookingCode}
                    className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 text-destructive px-4 py-2 text-xs font-semibold hover:bg-destructive/25 transition-all disabled:opacity-50"
                  >
                    <X className="size-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Room Status & Re-availability Control Grid */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-display text-2xl">Room Availability Manager</h3>
            <p className="text-sm text-muted-foreground">Toggle availability status and set re-availability dates for occupied rooms.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roomsList.map((room) => (
            <div key={room.id} className="rounded-2xl border border-border/70 bg-background p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{room.type}</span>
                  {room.isBooked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 text-destructive text-[11px] font-bold px-2.5 py-0.5">
                      🔴 Booked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-0.5">
                      🟢 Available
                    </span>
                  )}
                </div>
                <h4 className="font-display text-lg font-bold mt-2">{room.name}</h4>
                <div className="text-xs font-semibold text-accent mt-0.5">
                  {room.priceRWF ? `${room.priceRWF.toLocaleString()} RWF` : `$${room.price}`} / day
                </div>

                {room.isBooked && room.availableFrom && (
                  <div className="mt-2 text-xs text-muted-foreground bg-card p-2 rounded-lg border border-border/60">
                    📅 Free on: <strong className="text-foreground">{room.availableFrom}</strong>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleToggleStatus(room.slug, !!room.isBooked, room.availableFrom)}
                className={`w-full rounded-xl py-2 px-3 text-xs font-semibold transition-all ${
                  room.isBooked
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-destructive text-white hover:bg-destructive/90"
                }`}
              >
                {room.isBooked ? "Mark Available" : "Mark Booked"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings List Table */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl">Guest Reservations Log</h3>
            <p className="text-sm text-muted-foreground">Manage recent reservations stored in MySQL database.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reservations..."
              className="rounded-full bg-background border border-border pl-10 pr-4 py-2 text-sm focus:ring-focus w-64 min-h-[40px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/70 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Booking Code</th>
                <th className="py-3 px-4">Guest Info</th>
                <th className="py-3 px-4">Residence Unit</th>
                <th className="py-3 px-4">Check-in → Check-out</th>
                <th className="py-3 px-4">Total Paid (RWF)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-accent">{b.bookingCode}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{b.guestName}</div>
                    <div className="text-xs text-muted-foreground">{b.guestPhone} · {b.guestEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium">{b.roomName}</td>
                  <td className="py-3.5 px-4 text-xs font-mono">
                    {b.checkIn} → {b.checkOut}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {b.totalRWF ? `${b.totalRWF.toLocaleString()} RWF` : `$${b.totalUSD}`}
                  </td>
                  <td className="py-3.5 px-4">
                    {b.paymentStatus === "confirmed" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1">
                        Confirmed
                      </span>
                    ) : b.paymentStatus === "pending_verification" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-semibold px-3 py-1">
                        Pending Payment
                      </span>
                    ) : b.paymentStatus === "rejected" || b.status === "cancelled" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 text-destructive text-xs font-semibold px-3 py-1">
                        Cancelled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1">
                        {b.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No reservations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
