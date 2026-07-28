export type Testimonial = {
  name: string;
  country: string;
  avatar: string;
  rating: number;
  quote: string;
  stay: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Amara Okafor",
    country: "Lagos, Nigeria",
    avatar: "https://i.pravatar.cc/120?img=47",
    rating: 5,
    quote:
      "The photos don't do it justice. Warm timber, thoughtful lighting and the calmest sleep I've had in months. Musanze felt like a private retreat.",
    stay: "Signature Suite · 4 nights",
  },
  {
    name: "Julien Moreau",
    country: "Paris, France",
    avatar: "https://i.pravatar.cc/120?img=12",
    rating: 5,
    quote:
      "A rare mix of hospitality and quiet luxury. The kitchen alone would have been enough — we cooked every evening and never wanted to leave.",
    stay: "Chef's Kitchen Apartment · 6 nights",
  },
  {
    name: "Priya Menon",
    country: "Bengaluru, India",
    avatar: "https://i.pravatar.cc/120?img=32",
    rating: 5,
    quote:
      "Everything just… works. The team greets you like family, the rooms are pristine, and the wood-lit evenings on the balcony are unforgettable.",
    stay: "Twilight Suite · 3 nights",
  },
  {
    name: "Marcus Bennett",
    country: "London, UK",
    avatar: "https://i.pravatar.cc/120?img=68",
    rating: 5,
    quote:
      "We booked the Family Residence for a week with the kids. Space, privacy, hot showers and a proper kitchen — better than any hotel we've tried.",
    stay: "Family Residence · 7 nights",
  },
];
