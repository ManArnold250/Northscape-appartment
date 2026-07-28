import { img } from "@/lib/images";

export type Room = {
  id: string;
  slug: string;
  name: string;
  type: "Suite" | "Deluxe" | "Studio" | "Family";
  price: number; // per night, USD
  capacity: number;
  size: string;
  rating: number;
  reviews: number;
  short: string;
  description: string;
  amenities: string[];
  images: string[];
  featured?: boolean;
};

export const rooms: Room[] = [
  {
    id: "1",
    slug: "signature-suite",
    name: "Signature Suite",
    type: "Suite",
    price: 145,
    capacity: 2,
    size: "38 m²",
    rating: 4.9,
    reviews: 128,
    short: "Airy suite with wood-clad ceilings and marble floors.",
    description:
      "Our Signature Suite blends warm timber ceilings, tall drapery and marble flooring for a calm, hotel-grade stay. A hand-crafted headboard, crisp cotton linens and a private sitting nook set the tone for restful evenings in Musanze.",
    amenities: ["wifi", "kitchen", "hotShower", "workDesk", "smartTv", "parking", "security"],
    images: [img.bedroom[1], img.bedroom[2], img.bedroom[0], img.living[0]],
    featured: true,
  },
  {
    id: "2",
    slug: "deluxe-loft",
    name: "Deluxe Loft",
    type: "Deluxe",
    price: 189,
    capacity: 3,
    size: "52 m²",
    rating: 4.8,
    reviews: 96,
    short: "Open-plan loft with lounge, bar-kitchen and skyline views.",
    description:
      "A generous open loft with velvet lounges, a granite bar-kitchen and sculpted ceiling lighting. Perfect for longer stays, remote work and slow evenings — every finish curated for warmth.",
    amenities: ["wifi", "kitchen", "hotShower", "workDesk", "smartTv", "parking", "coffee", "security"],
    images: [img.living[0], img.living[1], img.living[3], img.kitchen[0]],
    featured: true,
  },
  {
    id: "3",
    slug: "garden-studio",
    name: "Garden Studio",
    type: "Studio",
    price: 98,
    capacity: 2,
    size: "26 m²",
    rating: 4.7,
    reviews: 74,
    short: "Compact studio with warm timber ceiling and reading nook.",
    description:
      "A cosy studio finished with warm timber ceilings, soft linen drapes and a private reading corner. Ideal for solo travellers and couples exploring Volcanoes National Park.",
    amenities: ["wifi", "kitchen", "hotShower", "smartTv", "coffee", "security"],
    images: [img.bedroom[2], img.bedroom[0], img.kitchen[6], img.living[2]],
    featured: true,
  },
  {
    id: "4",
    slug: "family-residence",
    name: "Family Residence",
    type: "Family",
    price: 240,
    capacity: 5,
    size: "72 m²",
    rating: 4.9,
    reviews: 51,
    short: "Two-bedroom residence with full chef's kitchen.",
    description:
      "The Family Residence pairs two private bedrooms with a full chef's kitchen, dining bar and lounge — a home away from home for families and small groups.",
    amenities: ["wifi", "kitchen", "hotShower", "workDesk", "smartTv", "parking", "coffee", "laundry", "security"],
    images: [img.kitchen[0], img.kitchen[3], img.living[0], img.bedroom[1]],
    featured: true,
  },
  {
    id: "5",
    slug: "chef-kitchen-apartment",
    name: "Chef's Kitchen Apartment",
    type: "Deluxe",
    price: 168,
    capacity: 3,
    size: "48 m²",
    rating: 4.8,
    reviews: 63,
    short: "For guests who love to cook — full granite kitchen included.",
    description:
      "A full working kitchen with gas range, oven, blender and generous storage — set inside a warm, wood-panelled apartment. Cook long dinners, host friends, stay a while.",
    amenities: ["wifi", "kitchen", "hotShower", "smartTv", "parking", "coffee", "laundry"],
    images: [img.kitchen[0], img.kitchen[2], img.kitchen[5], img.bedroom[1]],
  },
  {
    id: "6",
    slug: "twilight-suite",
    name: "Twilight Suite",
    type: "Suite",
    price: 155,
    capacity: 2,
    size: "34 m²",
    rating: 4.8,
    reviews: 42,
    short: "Warm-lit suite designed for slow evenings.",
    description:
      "Copper wall sconces, deep drapery and a private balcony make the Twilight Suite feel like a retreat. Book for anniversaries, quiet weeks and honeymoon stays.",
    amenities: ["wifi", "kitchen", "hotShower", "smartTv", "coffee", "security"],
    images: [img.exterior.night1, img.bedroom[1], img.living[3], img.exterior.night2],
  },
];

export const getRoomBySlug = (slug: string) => rooms.find((r) => r.slug === slug);
