// Central image registry for NorthScape Apartment using native Vite asset imports
import logoFullRounded from "@/assets/apt/northscape-full-rounded.jpg";
import logoFull from "@/assets/apt/northscape-logo.jpg";
import flyerPoster from "@/assets/apt/flyer-poster.jpg";
import extDay from "@/assets/apt/exterior-day-1.jpg";
import extFront from "@/assets/apt/exterior-front.jpg";
import extClose from "@/assets/apt/exterior-close.jpg";
import extGate from "@/assets/apt/exterior-gate.jpg";
import extNight1 from "@/assets/apt/exterior-night-1.jpg";
import extNight2 from "@/assets/apt/exterior-night-2.jpg";
import extWide from "@/assets/apt/exterior-wide.jpg";
import extSide from "@/assets/apt/exterior-side.jpg";
import living1 from "@/assets/apt/living-1.jpg";
import living2 from "@/assets/apt/living-2.jpg";
import living3 from "@/assets/apt/living-3.jpg";
import living4 from "@/assets/apt/living-4.jpg";
import kitchen1 from "@/assets/apt/kitchen-1.jpg";
import kitchen2 from "@/assets/apt/kitchen-2.jpg";
import kitchen3 from "@/assets/apt/kitchen-3.jpg";
import kitchen4 from "@/assets/apt/kitchen-4.jpg";
import kitchen5 from "@/assets/apt/kitchen-5.jpg";
import kitchen6 from "@/assets/apt/kitchen-6.jpg";
import kitchen7 from "@/assets/apt/kitchen-7.jpg";
import kitchen8 from "@/assets/apt/kitchen-8.jpg";
import bedroom1 from "@/assets/apt/bedroom-1.jpg";
import bedroom2 from "@/assets/apt/bedroom-2.jpg";
import bedroomDetail from "@/assets/apt/bedroom-detail.jpg";
import bedroom3 from "@/assets/apt/bedroom-3.jpg";

// New exterior angles
import extDay2 from "@/assets/apt/exterior-day-2.jpg";
import extDay3 from "@/assets/apt/exterior-day-3.jpg";
import extDay4 from "@/assets/apt/exterior-day-4.jpg";
import extDay5 from "@/assets/apt/exterior-day-5.jpg";
import extNight3 from "@/assets/apt/exterior-night-3.jpg";
import extNight4 from "@/assets/apt/exterior-night-4.jpg";
import extNight5 from "@/assets/apt/exterior-night-5.jpg";

// More living lounge angles
import living5 from "@/assets/apt/living-5.jpg";
import living6 from "@/assets/apt/living-6.jpg";
import living7 from "@/assets/apt/living-7.jpg";
import living8 from "@/assets/apt/living-8.jpg";
import living9 from "@/assets/apt/living-9.jpg";
import living10 from "@/assets/apt/living-10.jpg";

// More kitchen angles
import kitchen9 from "@/assets/apt/kitchen-9.jpg";
import kitchen10 from "@/assets/apt/kitchen-10.jpg";
import kitchen11 from "@/assets/apt/kitchen-11.jpg";
import kitchen12 from "@/assets/apt/kitchen-12.jpg";

// Guest room bedroom style (distinct wood-chevron headboard rooms)
import guestroom1 from "@/assets/apt/guestroom-1.jpg";
import guestroom2 from "@/assets/apt/guestroom-2.jpg";
import guestroom3 from "@/assets/apt/guestroom-3.jpg";
import guestroom4 from "@/assets/apt/guestroom-4.jpg";
import guestroom5 from "@/assets/apt/guestroom-5.jpg";
import guestroom6 from "@/assets/apt/guestroom-6.jpg";
import guestroom7 from "@/assets/apt/guestroom-7.jpg";

// Real bathroom photos (previously the site had no bathroom category and
// showed kitchen photos in bathroom sections by mistake)
import bathroomGuest1 from "@/assets/apt/bathroom-guest-1.jpg";
import bathroomGuest2 from "@/assets/apt/bathroom-guest-2.jpg";
import bathroomGuest3 from "@/assets/apt/bathroom-guest-3.jpg";
import bathroomMain1 from "@/assets/apt/bathroom-main-1.jpg";
import bathroomMain2 from "@/assets/apt/bathroom-main-2.jpg";
import bathroomMain3 from "@/assets/apt/bathroom-main-3.jpg";
import bathroomMain4 from "@/assets/apt/bathroom-main-4.jpg";
import bathroomMain5 from "@/assets/apt/bathroom-main-5.jpg";

// Balcony / outdoor seating
import balcony1 from "@/assets/apt/balcony-1.jpg";
import balcony2 from "@/assets/apt/balcony-2.jpg";

export const img = {
  logo: logoFullRounded,
  fullLogo: logoFull,
  poster: flyerPoster,
  exterior: {
    day: extDay,
    front: extFront,
    close: extClose,
    gate: extGate,
    night1: extNight1,
    night2: extNight2,
    wide: extWide,
    side: extSide,
  },
  living: [
    living1, living2, living3, living4,
    living5, living6, living7, living8, living9, living10,
  ],
  kitchen: [
    kitchen1, kitchen2, kitchen3, kitchen4,
    kitchen5, kitchen6, kitchen7, kitchen8,
    kitchen9, kitchen10, kitchen11, kitchen12,
  ],
  bedroom: [bedroom1, bedroom2, bedroomDetail, bedroom3],
  // Distinct guest-room bedroom style (wood chevron headboard rooms)
  guestroom: [
    guestroom1, guestroom2, guestroom3, guestroom4,
    guestroom5, guestroom6, guestroom7,
  ],
  // Real bathroom photography, split by which unit style they belong to
  bathroom: {
    guest: [bathroomGuest1, bathroomGuest2, bathroomGuest3],
    main: [bathroomMain1, bathroomMain2, bathroomMain3, bathroomMain4, bathroomMain5],
  },
  balcony: [balcony1, balcony2],
};

export const exteriorList = [
  extFront, extClose, extWide, extGate,
  extDay, extSide, extNight1, extNight2,
  extDay2, extDay3, extDay4, extDay5,
  extNight3, extNight4, extNight5,
];
