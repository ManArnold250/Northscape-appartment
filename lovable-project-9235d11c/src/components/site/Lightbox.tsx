import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: { src: string; alt: string }[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onIndex]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button
            className="absolute top-5 right-5 text-white/80 hover:text-white size-11 grid place-items-center rounded-full border border-white/20"
            onClick={onClose}
            aria-label="Close"
          >
            <X />
          </button>
          <button
            className="absolute left-4 md:left-8 text-white/80 hover:text-white size-11 grid place-items-center rounded-full border border-white/20 bg-black/30"
            onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + images.length) % images.length); }}
            aria-label="Previous"
          >
            <ChevronLeft />
          </button>
          <motion.img
            key={index}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={images[index].src}
            alt={images[index].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
          />
          <button
            className="absolute right-4 md:right-8 text-white/80 hover:text-white size-11 grid place-items-center rounded-full border border-white/20 bg-black/30"
            onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % images.length); }}
            aria-label="Next"
          >
            <ChevronRight />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-widest uppercase">
            {index + 1} / {images.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
