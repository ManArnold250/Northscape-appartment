import { rooms as initialRooms, type Room } from "@/data/rooms";

export type CustomerBooking = {
  id: string;
  bookingCode: string;
  roomSlug: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalRWF: number;
  totalUSD: number;
  status: "confirmed" | "cancelled";
  specialRequests?: string;
  createdAt: string;
};

const STORAGE_KEY = "northscape_user_bookings";

export function getStoredBookings(): CustomerBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (_e) {
    return [];
  }
}

export function saveBooking(booking: Omit<CustomerBooking, "id" | "bookingCode" | "createdAt" | "status">): CustomerBooking {
  const existing = getStoredBookings();
  const code = `NS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const newRecord: CustomerBooking = {
    ...booking,
    id: `bk-${Date.now()}`,
    bookingCode: code,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...existing];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("northscape_booking_updated", { detail: newRecord }));
  }
  return newRecord;
}

export function cancelBooking(bookingCode: string): boolean {
  const existing = getStoredBookings();
  const index = existing.findIndex((b) => b.bookingCode === bookingCode);
  if (index === -1) return false;

  existing[index].status = "cancelled";
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent("northscape_booking_updated", { detail: existing[index] }));
  }
  return true;
}

export function getBookingByCode(bookingCode: string): CustomerBooking | undefined {
  const bookings = getStoredBookings();
  return bookings.find((b) => b.bookingCode === bookingCode);
}

export function getLatestActiveBooking(): CustomerBooking | undefined {
  const bookings = getStoredBookings();
  return bookings.find((b) => b.status === "confirmed");
}

export function getRoomsWithLiveStatus(): Room[] {
  const bookings = getStoredBookings();
  const todayStr = new Date().toISOString().slice(0, 10);

  return initialRooms.map((r) => {
    // Check if there is an active non-cancelled booking for this room where checkOut >= todayStr
    const activeBooking = bookings.find(
      (b) => b.roomSlug === r.slug && b.status === "confirmed" && b.checkOut >= todayStr
    );

    if (activeBooking) {
      return {
        ...r,
        isBooked: true,
        availableFrom: activeBooking.checkOut,
      };
    }

    // Default static initialRooms state check
    if (r.isBooked && r.availableFrom && r.availableFrom <= todayStr) {
      return {
        ...r,
        isBooked: false,
        availableFrom: undefined,
      };
    }

    return r;
  });
}
