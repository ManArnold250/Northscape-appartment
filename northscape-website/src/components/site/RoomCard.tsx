import { motion } from "framer-motion";
import { Users, ArrowUpRight, Star } from "lucide-react";
import type { Room } from "@/data/rooms";

export function RoomCard({ room, index = 0 }: { room: Room; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06 }}
      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-card border border-border/70 shadow-soft transition-all duration-300 flex flex-col justify-between"
    >
      <a
        href={`/rooms/${room.slug}`}
        className="block relative"
        aria-label={`View ${room.name}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={room.images[0]}
            alt={room.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30" />
          
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 flex flex-col gap-1 items-start">
            <span className="rounded-full bg-background/90 backdrop-blur px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold tracking-wide text-foreground">
              {room.type}
            </span>
            {room.isBooked ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/90 backdrop-blur px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-destructive-foreground shadow-sm">
                <span className="size-1.5 sm:size-2 rounded-full bg-white animate-pulse" />
                Booked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 backdrop-blur px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-white shadow-sm">
                <span className="size-1.5 sm:size-2 rounded-full bg-emerald-200 animate-pulse" />
                Available
              </span>
            )}
          </div>

          <span className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium text-foreground">
            <Star className="size-2.5 sm:size-3 fill-accent text-accent" /> {room.rating}
          </span>

          <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 text-white">
            <div className="text-[9px] sm:text-[11px] uppercase tracking-widest opacity-80">Rate</div>
            <div className="font-display text-base sm:text-2xl font-bold">
              {room.priceRWF ? `${(room.priceRWF / 1000).toFixed(0)}k RWF` : `$${room.price}`}
              <span className="text-[10px] sm:text-xs font-sans font-normal opacity-85 ml-0.5">/day</span>
            </div>
            <div className="text-[10px] sm:text-xs text-white/80">~${room.price} USD</div>
          </div>
        </div>
      </a>

      <div className="p-3 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <a
            href={`/rooms/${room.slug}`}
            className="group/title block hover:text-accent transition-colors"
          >
            <h3 className="font-display text-sm sm:text-xl font-bold leading-tight line-clamp-1 group-hover/title:text-accent transition-colors">
              {room.name}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {room.short}
            </p>
          </a>
          
          <div className="mt-2.5 sm:mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs text-muted-foreground font-medium">
            <span className="inline-flex items-center gap-1 bg-secondary/60 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
              <Users className="size-3 text-accent" /> {room.capacity}
            </span>
            <span className="inline-flex items-center gap-1 bg-secondary/60 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
              🛏️ {room.specs.bedrooms}
            </span>
            <span className="inline-flex items-center gap-1 bg-secondary/60 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
              🚿 {room.specs.bathrooms}
            </span>
          </div>
        </div>

        <div className="mt-3 sm:mt-6 pt-2.5 sm:pt-4 border-t border-border/60 flex items-center justify-between gap-1">
          <a
            href={`/rooms/${room.slug}`}
            className="inline-flex items-center gap-0.5 text-xs sm:text-sm font-semibold text-foreground group/link hover:text-accent transition-colors"
          >
            Details
            <ArrowUpRight className="size-3.5 sm:size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </a>
          <a
            href={`/book?room=${room.slug}`}
            className="rounded-full bg-primary px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all active:scale-95"
          >
            Book
          </a>
        </div>
      </div>
    </motion.article>
  );
}
