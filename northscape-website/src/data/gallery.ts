import { img, exteriorList } from "@/lib/images";

export type GalleryCategory = "All" | "Exterior" | "Bedrooms" | "Guest Rooms" | "Kitchen" | "Bathrooms" | "Living Area";

export type GalleryItem = {
  src: string;
  category: Exclude<GalleryCategory, "All">;
  alt: string;
  aspect: "portrait" | "landscape" | "square";
};

const bathroomAll = [...img.bathroom.main, ...img.bathroom.guest];

export const galleryItems: GalleryItem[] = [
  ...exteriorList.map((src, i) => ({
    src,
    category: "Exterior" as const,
    alt: `NorthScape exterior view ${i + 1}`,
    aspect: (i % 3 === 0 ? "landscape" : i % 3 === 1 ? "portrait" : "landscape") as GalleryItem["aspect"],
  })),
  ...img.bedroom.map((src, i) => ({
    src,
    category: "Bedrooms" as const,
    alt: `NorthScape bedroom detail ${i + 1}`,
    aspect: (i === 1 ? "portrait" : "portrait") as GalleryItem["aspect"],
  })),
  ...img.guestroom.map((src, i) => ({
    src,
    category: "Guest Rooms" as const,
    alt: `NorthScape guest room detail ${i + 1}`,
    aspect: (i % 2 === 0 ? "portrait" : "landscape") as GalleryItem["aspect"],
  })),
  ...img.kitchen.map((src, i) => ({
    src,
    category: "Kitchen" as const,
    alt: `NorthScape kitchen view ${i + 1}`,
    aspect: (i % 2 === 0 ? "portrait" : "landscape") as GalleryItem["aspect"],
  })),
  ...bathroomAll.map((src, i) => ({
    src,
    category: "Bathrooms" as const,
    alt: `NorthScape bathroom view ${i + 1}`,
    aspect: (i % 2 === 0 ? "portrait" : "landscape") as GalleryItem["aspect"],
  })),
  ...img.living.map((src, i) => ({
    src,
    category: "Living Area" as const,
    alt: `NorthScape living area ${i + 1}`,
    aspect: (i % 2 === 0 ? "landscape" : "portrait") as GalleryItem["aspect"],
  })),
];

export const categories: GalleryCategory[] = ["All", "Exterior", "Bedrooms", "Guest Rooms", "Kitchen", "Bathrooms", "Living Area"];
