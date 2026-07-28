import {
  Wifi, Car, ChefHat, BedDouble, ShowerHead, TreePine,
  Sparkles, Sofa, Coffee, Tv, Laptop, ShieldCheck, WashingMachine,
} from "lucide-react";

export const amenityIcon = {
  wifi: Wifi,
  parking: Car,
  kitchen: ChefHat,
  beds: BedDouble,
  hotShower: ShowerHead,
  peaceful: TreePine,
  service: Sparkles,
  interior: Sofa,
  coffee: Coffee,
  smartTv: Tv,
  workDesk: Laptop,
  security: ShieldCheck,
  laundry: WashingMachine,
} as const;

export type AmenityKey = keyof typeof amenityIcon;

export const amenityLabel: Record<AmenityKey, string> = {
  wifi: "Free High-Speed WiFi",
  parking: "Secure Parking",
  kitchen: "Modern Kitchen",
  beds: "Comfortable Beds",
  hotShower: "Hot Shower",
  peaceful: "Peaceful Environment",
  service: "Excellent Service",
  interior: "Beautiful Interior",
  coffee: "Coffee & Tea",
  smartTv: "Smart TV",
  workDesk: "Work Desk",
  security: "24/7 Security",
  laundry: "Laundry Service",
};

export const whyChooseUs: AmenityKey[] = [
  "wifi", "parking", "kitchen", "beds", "hotShower", "peaceful", "service", "interior",
];
