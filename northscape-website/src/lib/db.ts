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
  createdAt: string;
};

// Global in-memory state fallback (hydrated with real-time XAMPP MySQL data when connected)
let memoryRooms: Room[] = [...initialRooms];
let memoryBookings: BookingRecord[] = [
  {
    id: "bk-101",
    bookingCode: "NS-2026-881",
    roomSlug: "executive-guest-room-2",
    roomName: "Executive Guest Room B",
    guestName: "Jean Claude N.",
    guestEmail: "jc.n@example.rw",
    guestPhone: "+250 788 123 456",
    checkIn: "2026-07-25",
    checkOut: "2026-07-30",
    guestsCount: 2,
    totalRWF: 100000,
    totalUSD: 75,
    status: "confirmed",
    specialRequests: "Late check-in at 20:00",
    createdAt: new Date().toISOString(),
  },
];

async function getMySQLConnection() {
  if (typeof window !== "undefined") return null;
  try {
    const pkg = "mysql2/promise";
    const mysql = await import(/* @vite-ignore */ pkg);
    return await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "northscape_db",
      port: 3306,
    });
  } catch (_e) {
    return null;
  }
}

export async function getRoomsWithAvailability(): Promise<Room[]> {
  try {
    const connection = await getMySQLConnection();
    if (connection) {
      const [rows] = await connection.execute<any[]>("SELECT * FROM rooms");
      await connection.end();

      if (rows && rows.length > 0) {
        return memoryRooms.map((r) => {
          const dbRoom = rows.find((row) => row.slug === r.slug);
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
        `INSERT INTO bookings (booking_code, room_slug, guest_name, guest_email, guest_phone, check_in, check_out, guests_count, total_rwf, total_usd, status, special_requests)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      const [rows] = await connection.execute<any[]>("SELECT * FROM bookings ORDER BY created_at DESC");
      await connection.end();

      if (rows && rows.length > 0) {
        return rows.map((r) => ({
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
          createdAt: String(r.created_at),
        }));
      }
    }
  } catch (_e) {
    // Fallback
  }

  return memoryBookings;
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
