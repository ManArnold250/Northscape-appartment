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
  living: [living1, living2, living3, living4],
  kitchen: [
    kitchen1, kitchen2, kitchen3, kitchen4,
    kitchen5, kitchen6, kitchen7, kitchen8,
  ],
  bedroom: [bedroom1, bedroom2, bedroomDetail],
};

export const exteriorList = [
  extFront, extClose, extWide, extGate,
  extDay, extSide, extNight1, extNight2,
];
