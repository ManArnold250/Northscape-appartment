import { img } from "@/lib/images";

export type FeatureDetail = {
  title: string;
  items: string[];
  images: string[];
};

export type Room = {
  id: string;
  slug: string;
  name: string;
  type: "Full Apartment" | "Guest Room" | "Suite" | "Deluxe";
  price: number; // per night, USD equivalent (~$75)
  priceRWF: number; // official RWF daily rate (100,000 RWF / 20,000 RWF)
  ratesRWF?: {
    day1: number;
    days3: number;
    week1: number;
    weeks2: number;
    month1: number;
  };
  capacity: number;
  size: string;
  rating: number;
  reviews: number;
  short: string;
  description: string;
  amenities: string[];
  images: string[];
  featured?: boolean;
  isBooked?: boolean;
  availableFrom?: string; // e.g. "2026-08-02"
  specs: {
    bedrooms: number;
    bathrooms: number;
    livingRoom: boolean;
  };
  details: {
    bedroom: FeatureDetail;
    kitchen: FeatureDetail;
    bathroom: FeatureDetail;
    living: FeatureDetail;
  };
};

export const rooms: Room[] = [
  {
    id: "1",
    slug: "full-apartment-luxury",
    name: "Full NorthScape Residence (3 Bed & 3 Bath)",
    type: "Full Apartment",
    price: 75,
    priceRWF: 100000,
    ratesRWF: {
      day1: 100000,
      days3: 250000,
      week1: 500000,
      weeks2: 800000,
      month1: 1500000,
    },
    capacity: 6,
    size: "95 m²",
    rating: 4.95,
    reviews: 142,
    short: "Full 3-bedroom, 3-bathroom residence with private living lounge and chef's kitchen.",
    description:
      "The complete NorthScape luxury apartment — 3 private bedrooms, 3 full bathrooms, a spacious living room with timber ceilings, and a fully equipped chef's kitchen. Designed for families, travel groups, and long-stay guests looking for home-like comfort in Musanze.",
    amenities: ["wifi", "kitchen", "hotShower", "workDesk", "smartTv", "parking", "laundry", "security"],
    images: [img.living[6], img.bedroom[1], img.kitchen[0], img.exterior.day, img.kitchen[9], img.bedroom[3]],
    featured: true,
    isBooked: false,
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      livingRoom: true,
    },
    details: {
      bedroom: {
        title: "3 Private Bedrooms (Ibyumba 3)",
        items: [
          "King & Double orthopaedic mattresses",
          "Custom hand-crafted timber headboards",
          "Crisp cotton linens & velvet throw blankets",
          "Built-in wardrobe & bedside warm lighting",
        ],
        images: [img.bedroom[1], img.bedroom[2], img.bedroom[0], img.bedroom[3]],
      },
      kitchen: {
        title: "Full Chef's Kitchen (Igikoni)",
        items: [
          "Gas range stove & baking oven",
          "Blender, microwave & electric kettle",
          "Double stainless basin & granite counter",
          "Complete cookware, cutlery & dinnerware set",
        ],
        images: [img.kitchen[2], img.kitchen[3], img.kitchen[9], img.kitchen[10]],
      },
      bathroom: {
        title: "3 Private Bathrooms & Toilets (Douche 3)",
        items: [
          "Instant hot water rain shower",
          "Modern ceramic toilet & wash basin",
          "Plush bath towels & complimentary toiletries",
          "Full tile finish with anti-slip flooring",
        ],
        images: [img.bathroom.main[0], img.bathroom.main[1], img.bathroom.main[4]],
      },
      living: {
        title: "Spacious Living Lounge (Uruganiriro)",
        items: [
          "Deep plush sofa seating & timber ceiling panels",
          "Smart TV with streaming apps & high-speed WiFi",
          "Dining counter with bar stools",
          "Ambient warm lighting & calm mountain views",
        ],
        images: [img.living[0], img.living[1], img.living[6], img.living[8]],
      },
    },
  },
  {
    id: "2",
    slug: "executive-guest-room-1",
    name: "Executive Guest Room A",
    type: "Guest Room",
    price: 15,
    priceRWF: 20000,
    capacity: 2,
    size: "28 m²",
    rating: 4.85,
    reviews: 88,
    short: "Private guest bedroom with en-suite hot shower bathroom.",
    description:
      "A quiet, comfortable private guest room featuring a plush double bed, timber finishes, high-speed WiFi, and direct access to hot shower facilities. Ideal for solo travellers, couples, and short visits to Musanze.",
    amenities: ["wifi", "hotShower", "smartTv", "parking", "security"],
    images: [img.guestroom[2], img.guestroom[0], img.guestroom[1], img.living[6]],
    featured: true,
    isBooked: false,
    specs: {
      bedrooms: 1,
      bathrooms: 1,
      livingRoom: false,
    },
    details: {
      bedroom: {
        title: "Guest Bedroom",
        items: [
          "Plush double orthopaedic bed",
          "Hand-crafted timber headboard",
          "Work desk & reading lamps",
        ],
        images: [img.guestroom[0], img.guestroom[1], img.guestroom[3]],
      },
      kitchen: {
        title: "Shared Kitchen Access",
        items: [
          "Access to full kitchen equipment & microwave",
          "Electric kettle & coffee set",
        ],
        images: [img.kitchen[0], img.kitchen[2]],
      },
      bathroom: {
        title: "En-suite Bathroom & Toilet",
        items: [
          "Hot water rain shower",
          "Clean ceramic toilet & sink",
          "Fresh towels provided",
        ],
        images: [img.bathroom.guest[0], img.bathroom.guest[1], img.bathroom.guest[2]],
      },
      living: {
        title: "Common Living Area Access",
        items: [
          "Access to main timber-clad living lounge",
          "High-speed WiFi & secure parking",
        ],
        images: [img.living[0], img.living[6]],
      },
    },
  },
  {
    id: "3",
    slug: "executive-guest-room-2",
    name: "Executive Guest Room B",
    type: "Guest Room",
    price: 15,
    priceRWF: 20000,
    capacity: 2,
    size: "26 m²",
    rating: 4.8,
    reviews: 64,
    short: "Cozy private room with warm wood accents and fast WiFi.",
    description:
      "Warm timber-clad guest room equipped with high-speed internet, hot water shower, regular housekeeping, and 24/7 gated security in a peaceful neighbourhood.",
    amenities: ["wifi", "hotShower", "parking", "security"],
    images: [img.guestroom[6], img.guestroom[4], img.guestroom[5], img.living[7]],
    featured: true,
    isBooked: true,
    availableFrom: "2026-07-30",
    specs: {
      bedrooms: 1,
      bathrooms: 1,
      livingRoom: false,
    },
    details: {
      bedroom: {
        title: "Guest Bedroom",
        items: [
          "Comfortable double bed",
          "Crisp linens & blackout curtains",
        ],
        images: [img.guestroom[4], img.guestroom[6]],
      },
      kitchen: {
        title: "Shared Kitchen",
        items: ["Shared kitchen amenities available"],
        images: [img.kitchen[1]],
      },
      bathroom: {
        title: "En-suite Shower & Toilet",
        items: ["Hot water shower & clean toilet"],
        images: [img.bathroom.guest[1], img.bathroom.guest[2]],
      },
      living: {
        title: "Shared Lounge",
        items: ["Lounge & garden courtyard access"],
        images: [img.living[7], img.balcony[0]],
      },
    },
  },
  {
    id: "4",
    slug: "full-apartment-wing-b",
    name: "NorthScape Residence Wing B (3 Bed & 3 Bath)",
    type: "Full Apartment",
    price: 75,
    priceRWF: 100000,
    ratesRWF: {
      day1: 100000,
      days3: 250000,
      week1: 500000,
      weeks2: 800000,
      month1: 1500000,
    },
    capacity: 6,
    size: "95 m²",
    rating: 4.9,
    reviews: 79,
    short: "Full 3-bedroom, 3-bathroom suite with mountain backdrop and full kitchen.",
    description:
      "Spacious 3-bedroom apartment residence with 3 private bathrooms, modern gas stove kitchen, and marble-tiled living area. Excellent for monthly stays, gorilla trekking groups, and family retreats.",
    amenities: ["wifi", "kitchen", "hotShower", "workDesk", "smartTv", "parking", "laundry", "security"],
    images: [img.living[9], img.bedroom[1], img.kitchen[11], img.exterior.night1],
    featured: true,
    isBooked: false,
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      livingRoom: true,
    },
    details: {
      bedroom: {
        title: "3 Private Bedrooms",
        items: ["3 spacious bedrooms with premium mattresses", "Wardrobes & clean linens"],
        images: [img.bedroom[1], img.bedroom[2], img.bedroom[0]],
      },
      kitchen: {
        title: "Full Kitchen Equipment",
        items: ["Gas oven stove", "Blender & microwave", "Utensils & cookware"],
        images: [img.kitchen[1], img.kitchen[4], img.kitchen[10], img.kitchen[11]],
      },
      bathroom: {
        title: "3 Bathrooms & Toilets",
        items: ["3 hot water shower rooms & toilets"],
        images: [img.bathroom.main[2], img.bathroom.main[3]],
      },
      living: {
        title: "Full Living Lounge",
        items: ["Velvet couches & dining bar"],
        images: [img.living[0], img.living[9]],
      },
    },
  },
];

export const getRoomBySlug = (slug?: string): Room => {
  if (!slug) return rooms[0];
  const clean = String(slug).toLowerCase().trim();
  return (
    rooms.find((r) => r.slug.toLowerCase() === clean) ||
    rooms.find((r) => r.id === clean) ||
    rooms.find((r) => clean.includes(r.slug.toLowerCase()) || r.slug.toLowerCase().includes(clean)) ||
    rooms[0]
  );
};
