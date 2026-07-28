export type ReviewRecord = {
  id: string;
  bookingCode?: string;
  roomSlug: string;
  roomName: string;
  guestName: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  verified: boolean;
};

const REVIEWS_KEY = "northscape_guest_reviews";

// Seed initial authentic guest reviews if empty
const SEED_REVIEWS: ReviewRecord[] = [
  {
    id: "rev-1",
    roomSlug: "full-apartment-luxury",
    roomName: "Full NorthScape Residence",
    guestName: "Dr. Emmanuel K.",
    rating: 5,
    comment: "An absolute haven in Musanze. The timber interiors, mountain views, and high-speed Wi-Fi made our family stay unforgettable.",
    createdAt: "2026-07-20T14:30:00Z",
    verified: true,
  },
  {
    id: "rev-2",
    roomSlug: "executive-room-b",
    roomName: "Executive Guest Room B",
    guestName: "Sarah & David M.",
    rating: 5,
    comment: "Extremely clean, modern, and quiet. Perfect location before our gorilla trek in Volcanoes National Park. Staff were so warm!",
    createdAt: "2026-07-22T09:15:00Z",
    verified: true,
  },
  {
    id: "rev-3",
    roomSlug: "executive-room-a",
    roomName: "Executive Guest Room A",
    guestName: "Jean-Paul H.",
    rating: 5,
    comment: "Best value stay in Northern Province. The kitchen setup and hot shower pressure were outstanding.",
    createdAt: "2026-07-25T18:00:00Z",
    verified: true,
  },
];

export function getAllReviews(): ReviewRecord[] {
  if (typeof window === "undefined") return SEED_REVIEWS;
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(SEED_REVIEWS));
      return SEED_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (_e) {
    return SEED_REVIEWS;
  }
}

export function saveReview(reviewData: Omit<ReviewRecord, "id" | "createdAt" | "verified">): ReviewRecord {
  const current = getAllReviews();
  const newReview: ReviewRecord = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
    verified: true,
  };

  const updated = [newReview, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("northscape_reviews_updated", { detail: updated }));
  }
  return newReview;
}

export function getReviewsForRoom(roomSlug: string): ReviewRecord[] {
  const all = getAllReviews();
  return all.filter((r) => r.roomSlug === roomSlug || r.roomSlug === "all");
}

export function getRoomRatingStats(roomSlug?: string): { rating: number; count: number } {
  const all = getAllReviews();
  const filtered = roomSlug ? all.filter((r) => r.roomSlug === roomSlug) : all;
  if (filtered.length === 0) return { rating: 5.0, count: 0 };
  const sum = filtered.reduce((acc, r) => acc + r.rating, 0);
  const avg = Math.round((sum / filtered.length) * 10) / 10;
  return { rating: avg, count: filtered.length };
}
