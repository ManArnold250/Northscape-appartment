// This module used to store bookings in the browser's localStorage, which
// meant every visitor saw a different "reality" and the admin panel (backed
// by the database) never agreed with what customers/public pages saw.
//
// It now delegates everything to server functions (serverFns.ts), which
// actually execute on the Node server where the real MySQL connection
// works — calling db.ts's functions directly from browser code never
// reached the database at all.
import {
  createBookingFn,
  getAllBookingsFn,
  getBookingByCodeFn,
  cancelBookingFn,
  getRoomsWithAvailabilityFn,
} from "@/lib/serverFns";
import type { BookingRecord } from "@/lib/db";
import { rooms as initialRooms, type Room } from "@/data/rooms";

export type CustomerBooking = BookingRecord;

/** Rooms + live booked/available status, sourced from the database. */
export async function getRoomsWithLiveStatus(): Promise<Room[]> {
  return getRoomsWithAvailabilityFn();
}

/** Synchronous fallback for the very first paint, before the DB responds. */
export function getInitialRooms(): Room[] {
  return initialRooms;
}

export async function saveBooking(
  booking: Omit<CustomerBooking, "id" | "bookingCode" | "createdAt" | "status">
): Promise<CustomerBooking> {
  const record = await createBookingFn({ data: booking });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("northscape_booking_updated", { detail: record }));
  }
  return record;
}

export async function cancelBooking(bookingCode: string): Promise<boolean> {
  const ok = await cancelBookingFn({ data: { code: bookingCode } });
  if (ok && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("northscape_booking_updated", { detail: { bookingCode } }));
  }
  return ok;
}

export async function getBookingByCode(bookingCode: string): Promise<CustomerBooking | undefined> {
  return getBookingByCodeFn({ data: { code: bookingCode } });
}

export async function getStoredBookings(): Promise<CustomerBooking[]> {
  return getAllBookingsFn();
}

export async function getLatestActiveBooking(): Promise<CustomerBooking | undefined> {
  const bookings = await getAllBookingsFn();
  return bookings.find((b) => b.status === "confirmed");
}
