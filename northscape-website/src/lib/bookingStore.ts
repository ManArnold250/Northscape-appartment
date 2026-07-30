// This module used to store bookings in the browser's localStorage, which
// meant every visitor saw a different "reality" and the admin panel (backed
// by the database) never agreed with what customers/public pages saw.
// It now delegates everything to the shared database layer in `db.ts`, so
// there is a single source of truth for room availability and bookings.
import {
  createBooking,
  getAllBookings,
  getBookingByCodeDb,
  cancelBookingByCode,
  getRoomsWithAvailability,
  type BookingRecord,
} from "@/lib/db";
import { rooms as initialRooms, type Room } from "@/data/rooms";

export type CustomerBooking = BookingRecord;

/** Rooms + live booked/available status, sourced from the database. */
export async function getRoomsWithLiveStatus(): Promise<Room[]> {
  return getRoomsWithAvailability();
}

/** Synchronous fallback for the very first paint, before the DB responds. */
export function getInitialRooms(): Room[] {
  return initialRooms;
}

export async function saveBooking(
  booking: Omit<CustomerBooking, "id" | "bookingCode" | "createdAt" | "status">
): Promise<CustomerBooking> {
  const record = await createBooking({ ...booking, status: "confirmed" });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("northscape_booking_updated", { detail: record }));
  }
  return record;
}

export async function cancelBooking(bookingCode: string): Promise<boolean> {
  const ok = await cancelBookingByCode(bookingCode);
  if (ok && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("northscape_booking_updated", { detail: { bookingCode } }));
  }
  return ok;
}

export async function getBookingByCode(bookingCode: string): Promise<CustomerBooking | undefined> {
  return getBookingByCodeDb(bookingCode);
}

export async function getStoredBookings(): Promise<CustomerBooking[]> {
  return getAllBookings();
}

export async function getLatestActiveBooking(): Promise<CustomerBooking | undefined> {
  const bookings = await getAllBookings();
  return bookings.find((b) => b.status === "confirmed");
}
