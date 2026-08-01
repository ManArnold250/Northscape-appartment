import { rooms as initialRooms, type Room } from "@/data/rooms";

export type BookingRecord = {
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
  status: "confirmed" | "pending" | "checked_out" | "cancelled";
  specialRequests?: string;
  paymentMethod?: "momo" | "airtel";
  paymentReference?: string;
  paymentStatus: "unpaid" | "pending_verification" | "confirmed" | "rejected";
  createdAt: string;
};

// Global in-memory state fallback (hydrated with real-time XAMPP MySQL data when connected)
let memoryRooms: Room[] = [...initialRooms];
let memoryBookings: BookingRecord[] = [];

async function getMySQLConnection(): Promise<any> {
  if (typeof window !== "undefined") return null;
  try {
    const pkg = "mysql2/promise";
    const mysql = await import(/* @vite-ignore */ pkg);

    // Railway provides a single connection string when you use its MySQL plugin.
    if (process.env.MYSQL_URL) {
      return await mysql.createConnection(process.env.MYSQL_URL);
    }

    return await mysql.createConnection({
      host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
      user: process.env.MYSQLUSER || process.env.DB_USER || "root",
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || "northscape_db",
      port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
    });
  } catch (_e) {
    return null;
  }
}

export async function getRoomsWithAvailability(): Promise<Room[]> {
  try {
    const connection = await getMySQLConnection();
    if (connection) {
      const [rows] = await connection.execute("SELECT * FROM rooms");
      await connection.end();

      if (rows && rows.length > 0) {
        return memoryRooms.map((r) => {
          const dbRoom = rows.find((row: any) => row.slug === r.slug);
          if (dbRoom) {
            return {
              ...r,
              isBooked: dbRoom.status === "booked",
              availableFrom: dbRoom.available_from ? String(dbRoom.available_from).slice(0, 10) : undefined,
            };
          }
          return r;
        });
      }
    }
  } catch (_e) {
    // Fallback
  }

  return memoryRooms;
}

export async function createBooking(data: Omit<BookingRecord, "id" | "bookingCode" | "createdAt">): Promise<BookingRecord> {
  const code = `NS-2026-${Math.floor(100 + Math.random() * 900)}`;
  const newBooking: BookingRecord = {
    ...data,
    id: `bk-${Date.now()}`,
    bookingCode: code,
    createdAt: new Date().toISOString(),
  };

  try {
    const connection = await getMySQLConnection();
    if (connection) {
      await connection.execute(
        `INSERT INTO bookings (booking_code, room_slug, guest_name, guest_email, guest_phone, check_in, check_out, guests_count, total_rwf, total_usd, status, special_requests, payment_method, payment_reference, payment_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          code,
          data.roomSlug,
          data.guestName,
          data.guestEmail,
          data.guestPhone,
          data.checkIn,
          data.checkOut,
          data.guestsCount,
          data.totalRWF,
          data.totalUSD,
          data.status,
          data.specialRequests || "",
          data.paymentMethod || null,
          data.paymentReference || null,
          data.paymentStatus || "unpaid",
        ]
      );

      await connection.execute(
        `UPDATE rooms SET status = 'booked', available_from = ? WHERE slug = ?`,
        [data.checkOut, data.roomSlug]
      );

      await connection.end();
    }
  } catch (_e) {
    // Fallback
  }

  // Always update in-memory state
  memoryBookings.unshift(newBooking);
  memoryRooms = memoryRooms.map((r) => {
    if (r.slug === data.roomSlug) {
      return {
        ...r,
        isBooked: true,
        availableFrom: data.checkOut,
      };
    }
    return r;
  });

  return newBooking;
}

export async function getAllBookings(): Promise<BookingRecord[]> {
  try {
    const connection = await getMySQLConnection();
    if (connection) {
      const [rows] = await connection.execute("SELECT * FROM bookings ORDER BY created_at DESC");
      await connection.end();

      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          id: String(r.id),
          bookingCode: r.booking_code,
          roomSlug: r.room_slug,
          roomName: memoryRooms.find((mr) => mr.slug === r.room_slug)?.name || r.room_slug,
          guestName: r.guest_name,
          guestEmail: r.guest_email,
          guestPhone: r.guest_phone,
          checkIn: String(r.check_in).slice(0, 10),
          checkOut: String(r.check_out).slice(0, 10),
          guestsCount: r.guests_count,
          totalRWF: Number(r.total_rwf),
          totalUSD: Number(r.total_usd),
          status: r.status,
          specialRequests: r.special_requests,
          paymentMethod: r.payment_method || undefined,
          paymentReference: r.payment_reference || undefined,
          paymentStatus: r.payment_status || "unpaid",
          createdAt: String(r.created_at),
        }));
      }
    }
  } catch (_e) {
    // Fallback
  }

  return memoryBookings;
}

export async function getBookingByCodeDb(bookingCode: string): Promise<BookingRecord | undefined> {
  try {
    const connection = await getMySQLConnection();
    if (connection) {
      const [rows] = await connection.execute("SELECT * FROM bookings WHERE booking_code = ? LIMIT 1", [bookingCode]);
      await connection.end();
      if (rows && rows.length > 0) {
        const r = rows[0];
        return {
          id: String(r.id),
          bookingCode: r.booking_code,
          roomSlug: r.room_slug,
          roomName: memoryRooms.find((mr) => mr.slug === r.room_slug)?.name || r.room_slug,
          guestName: r.guest_name,
          guestEmail: r.guest_email,
          guestPhone: r.guest_phone,
          checkIn: String(r.check_in).slice(0, 10),
          checkOut: String(r.check_out).slice(0, 10),
          guestsCount: r.guests_count,
          totalRWF: Number(r.total_rwf),
          totalUSD: Number(r.total_usd),
          status: r.status,
          specialRequests: r.special_requests,
          paymentMethod: r.payment_method || undefined,
          paymentReference: r.payment_reference || undefined,
          paymentStatus: r.payment_status || "unpaid",
          createdAt: String(r.created_at),
        };
      }
      return undefined;
    }
  } catch (_e) {
    // Fallback
  }
  return memoryBookings.find((b) => b.bookingCode === bookingCode);
}

export async function cancelBookingByCode(bookingCode: string): Promise<boolean> {
  try {
    const connection = await getMySQLConnection();
    if (connection) {
      const [result] = await connection.execute(
        "UPDATE bookings SET status = 'cancelled' WHERE booking_code = ?",
        [bookingCode]
      );
      // Free up the room if this booking was the active one
      const [rows] = await connection.execute(
        "SELECT room_slug FROM bookings WHERE booking_code = ?",
        [bookingCode]
      );
      if (rows && rows.length > 0) {
        await connection.execute(
          "UPDATE rooms SET status = 'available', available_from = NULL WHERE slug = ?",
          [rows[0].room_slug]
        );
      }
      await connection.end();
      return result.affectedRows > 0;
    }
  } catch (_e) {
    // Fallback
  }

  const idx = memoryBookings.findIndex((b) => b.bookingCode === bookingCode);
  if (idx === -1) return false;
  memoryBookings[idx].status = "cancelled";
  const slug = memoryBookings[idx].roomSlug;
  memoryRooms = memoryRooms.map((r) => (r.slug === slug ? { ...r, isBooked: false, availableFrom: undefined } : r));
  return true;
}

export async function confirmPayment(bookingCode: string): Promise<boolean> {
  try {
    const connection = await getMySQLConnection();
    if (connection) {
      const [result] = await connection.execute(
        "UPDATE bookings SET payment_status = 'confirmed', status = 'confirmed' WHERE booking_code = ?",
        [bookingCode]
      );
      await connection.end();
      return result.affectedRows > 0;
    }
  } catch (_e) {
    // Fallback
  }

  const idx = memoryBookings.findIndex((b) => b.bookingCode === bookingCode);
  if (idx === -1) return false;
  memoryBookings[idx].paymentStatus = "confirmed";
  memoryBookings[idx].status = "confirmed";
  return true;
}

export async function rejectPayment(bookingCode: string): Promise<boolean> {
  try {
    const connection = await getMySQLConnection();
    if (connection) {
      const [rows] = await connection.execute(
        "SELECT room_slug FROM bookings WHERE booking_code = ?",
        [bookingCode]
      );
      const [result] = await connection.execute(
        "UPDATE bookings SET payment_status = 'rejected', status = 'cancelled' WHERE booking_code = ?",
        [bookingCode]
      );
      if (rows && rows.length > 0) {
        await connection.execute(
          "UPDATE rooms SET status = 'available', available_from = NULL WHERE slug = ?",
          [rows[0].room_slug]
        );
      }
      await connection.end();
      return result.affectedRows > 0;
    }
  } catch (_e) {
    // Fallback
  }

  const idx = memoryBookings.findIndex((b) => b.bookingCode === bookingCode);
  if (idx === -1) return false;
  memoryBookings[idx].paymentStatus = "rejected";
  memoryBookings[idx].status = "cancelled";
  const slug = memoryBookings[idx].roomSlug;
  memoryRooms = memoryRooms.map((r) => (r.slug === slug ? { ...r, isBooked: false, availableFrom: undefined } : r));
  return true;
}

export async function toggleRoomStatus(slug: string, status: "available" | "booked" | "maintenance", availableFrom?: string) {
  try {
    const connection = await getMySQLConnection();
    if (connection) {
      await connection.execute(
        "UPDATE rooms SET status = ?, available_from = ? WHERE slug = ?",
        [status, availableFrom || null, slug]
      );
      await connection.end();
    }
  } catch (_e) {
    // Fallback
  }

  memoryRooms = memoryRooms.map((r) => {
    if (r.slug === slug) {
      return {
        ...r,
        isBooked: status === "booked",
        availableFrom: status === "booked" ? availableFrom : undefined,
      };
    }
    return r;
  });
}
