import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, ArrowUpRight, Star } from "lucide-react";
import { amenityIcon, amenityLabel, type AmenityKey } from "@/data/amenities";
import type { Room } from "@/data/rooms";

export function RoomCard({ room, index = 0 }: { room: Room; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative rounded-3xl overflow-hidden bg-card border border-border/70 shadow-soft hover:-translate-y-1 transition-all duration-500"
    >
      <Link
        to="/rooms/$slug"
        params={{ slug: room.slug }}
        className="block"
        aria-label={`View ${room.name}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={room.images[0]}
            alt={room.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute top-4 left-4 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-medium tracking-wide text-foreground">
            {room.type}
          </span>
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-medium text-foreground">
            <Star className="size-3 fill-accent text-accent" /> {room.rating}
          </span>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-xs uppercase tracking-widest opacity-80">From</div>
            <div className="font-display text-2xl">${room.price}<span className="text-sm font-sans opacity-80">/night</span></div>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl">{room.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{room.short}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Users className="size-3.5" /> {room.capacity} guests</span>
          <span>·</span>
          <span>{room.size}</span>
          <span>·</span>
          <span>{room.reviews} reviews</span>
        </div>

        <div className="mt-5 flex items-center gap-2">
          {room.amenities.slice(0, 5).map((a) => {
            const Icon = amenityIcon[a as AmenityKey];
            return (
              <span
                key={a}
                title={amenityLabel[a as AmenityKey]}
                className="inline-flex size-8 items-center justify-center rounded-full border border-border text-foreground/70 bg-background"
              >
                <Icon className="size-4" />
              </span>
            );
          })}
          {room.amenities.length > 5 && (
            <span className="text-xs text-muted-foreground">+{room.amenities.length - 5}</span>
          )}
        </div>

        <Link
          to="/rooms/$slug"
          params={{ slug: room.slug }}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground group/link"
        >
          View details
          <ArrowUpRight className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
