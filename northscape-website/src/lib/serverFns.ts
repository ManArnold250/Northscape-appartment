// Server functions: the actual bridge between browser code (React event
// handlers, useEffect) and the MySQL database.
//
// Why this file exists: db.ts's mysql2 connection code only runs when
// `typeof window === "undefined"` (i.e. on the server). But every booking
// button, admin toggle, and room-status check in this app was being called
// directly from browser-side code — which meant `getMySQLConnection()`
// always returned null there, and everything silently fell back to
// temporary in-memory data instead of ever touching the real database.
//
// `createServerFn` compiles the `.handler()` body to run ONLY on the
// server, and replaces the client-side call with a network request under
// the hood — so calling one of these from a button click actually executes
// on Railway's Node server, where the real MySQL connection works.
import { createServerFn } from "@tanstack/react-start";
import {
  getRoomsWithAvailability,
  createBooking,
  getAllBookings,
  getBookingByCodeDb,
  cancelBookingByCode,
  toggleRoomStatus,
  confirmPayment,
  rejectPayment,
  type BookingRecord,
} from "@/lib/db";

export const getRoomsWithAvailabilityFn = createServerFn({ method: "GET" }).handler(async () => {
  return getRoomsWithAvailability();
});

export const createBookingFn = createServerFn({ method: "POST" })
  .validator((data: Omit<BookingRecord, "id" | "bookingCode" | "createdAt">) => data)
  .handler(async ({ data }) => {
    return createBooking(data);
  });

export const getAllBookingsFn = createServerFn({ method: "GET" }).handler(async () => {
  return getAllBookings();
});

export const getBookingByCodeFn = createServerFn({ method: "GET" })
  .validator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    return getBookingByCodeDb(data.code);
  });

export const cancelBookingFn = createServerFn({ method: "POST" })
  .validator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    return cancelBookingByCode(data.code);
  });

export const toggleRoomStatusFn = createServerFn({ method: "POST" })
  .validator((data: { slug: string; status: "available" | "booked" | "maintenance"; availableFrom?: string }) => data)
  .handler(async ({ data }) => {
    return toggleRoomStatus(data.slug, data.status, data.availableFrom);
  });

export const confirmPaymentFn = createServerFn({ method: "POST" })
  .validator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    return confirmPayment(data.code);
  });

// The real admin PIN lives only here, on the server, read from an
// environment variable. It is never sent to the browser — the client only
// ever gets back true/false, so it can't be read out of the JS bundle the
// way a client-side string comparison could be.
export const verifyAdminPinFn = createServerFn({ method: "POST" })
  .validator((data: { pin: string }) => data)
  .handler(async ({ data }) => {
    const correctPin = process.env.ADMIN_PIN || "NorthScape#2026!";
    // Constant-time-ish comparison isn't critical here (low-value target,
    // rate limiting would matter more at scale), but we avoid ever echoing
    // the correct value back to the client on failure.
    return data.pin.trim() === correctPin;
  });

export const rejectPaymentFn = createServerFn({ method: "POST" })
  .validator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    return rejectPayment(data.code);
  });
