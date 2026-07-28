// Central image registry sourced from lovable-assets CDN pointers.
import logo from "@/assets/apt/logo.jpg.asset.json";
import extDay from "@/assets/apt/exterior-day-1.jpg.asset.json";
import extFront from "@/assets/apt/exterior-front.jpg.asset.json";
import extClose from "@/assets/apt/exterior-close.jpg.asset.json";
import extGate from "@/assets/apt/exterior-gate.jpg.asset.json";
import extNight1 from "@/assets/apt/exterior-night-1.jpg.asset.json";
import extNight2 from "@/assets/apt/exterior-night-2.jpg.asset.json";
import extWide from "@/assets/apt/exterior-wide.jpg.asset.json";
import extSide from "@/assets/apt/exterior-side.jpg.asset.json";
import living1 from "@/assets/apt/living-1.jpg.asset.json";
import living2 from "@/assets/apt/living-2.jpg.asset.json";
import living3 from "@/assets/apt/living-3.jpg.asset.json";
import living4 from "@/assets/apt/living-4.jpg.asset.json";
import kitchen1 from "@/assets/apt/kitchen-1.jpg.asset.json";
import kitchen2 from "@/assets/apt/kitchen-2.jpg.asset.json";
import kitchen3 from "@/assets/apt/kitchen-3.jpg.asset.json";
import kitchen4 from "@/assets/apt/kitchen-4.jpg.asset.json";
import kitchen5 from "@/assets/apt/kitchen-5.jpg.asset.json";
import kitchen6 from "@/assets/apt/kitchen-6.jpg.asset.json";
import kitchen7 from "@/assets/apt/kitchen-7.jpg.asset.json";
import kitchen8 from "@/assets/apt/kitchen-8.jpg.asset.json";
import bedroom1 from "@/assets/apt/bedroom-1.jpg.asset.json";
import bedroom2 from "@/assets/apt/bedroom-2.jpg.asset.json";
import bedroomDetail from "@/assets/apt/bedroom-detail.jpg.asset.json";

export const img = {
  logo: logo.url,
  exterior: {
    day: extDay.url,
    front: extFront.url,
    close: extClose.url,
    gate: extGate.url,
    night1: extNight1.url,
    night2: extNight2.url,
    wide: extWide.url,
    side: extSide.url,
  },
  living: [living1.url, living2.url, living3.url, living4.url],
  kitchen: [
    kitchen1.url, kitchen2.url, kitchen3.url, kitchen4.url,
    kitchen5.url, kitchen6.url, kitchen7.url, kitchen8.url,
  ],
  bedroom: [bedroom1.url, bedroom2.url, bedroomDetail.url],
};

export const exteriorList = [
  extDay.url, extFront.url, extClose.url, extGate.url,
  extWide.url, extSide.url, extNight1.url, extNight2.url,
];
