import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { categories, galleryItems, type GalleryCategory } from "@/data/gallery";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Lightbox } from "@/components/site/Lightbox";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — NorthScape Apartment" },
      { name: "description", content: "A photo tour of NorthScape Apartment in Musanze — exteriors, bedrooms, kitchens and living areas." },
      { property: "og:title", content: "Gallery — NorthScape Apartment" },
      { property: "og:description", content: "A photo tour of NorthScape Apartment in Musanze — warm interiors and quiet exteriors." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [filter, setFilter] = useState<GalleryCategory>("All");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const shown = useMemo(
    () => (filter === "All" ? galleryItems : galleryItems.filter((g) => g.category === filter)),
    [filter],
  );

  return (
    <div>
      <section className="pt-32 md:pt-40 container-x">
        <SectionTitle eyebrow="Photography" title="A visual tour of NorthScape" description="Every corner of the apartment, captured by natural and warm evening light." />
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                filter === c ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-foreground hover:bg-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="container-x mt-12 pb-24">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
          {shown.map((g, i) => (
            <motion.button
              key={g.src + i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
              onClick={() => setOpenIdx(i)}
              className="mb-4 block w-full overflow-hidden rounded-2xl relative group break-inside-avoid"
              aria-label={g.alt}
            >
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-[1400ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 text-white text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                {g.category}
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <Lightbox images={shown} index={openIdx} onClose={() => setOpenIdx(null)} onIndex={setOpenIdx} />
    </div>
  );
}
