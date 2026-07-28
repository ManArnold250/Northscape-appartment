import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { img } from "@/lib/images";

export function Footer() {
  return (
    <footer className="mt-20 md:mt-32 border-t border-border/70 bg-secondary/40">
      <div className="container-x py-12 md:py-16 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#FDF4E3] border-2 border-accent/60 shadow-lg overflow-hidden shrink-0">
              <img src={img.logo} alt="NorthScape" className="h-full w-full object-contain p-0.5 rounded-full" />
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold">NorthScape</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
            A quiet, wood-lit apartment retreat in Musanze — the gateway to Volcanoes National Park.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/80">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/rooms" className="hover:text-foreground transition-colors">Rooms & Suites</Link></li>
            <li><Link to="/gallery" className="hover:text-foreground transition-colors">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-foreground transition-colors">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            <li><Link to="/book" className="hover:text-foreground transition-colors">Book a Stay</Link></li>
            <li><Link to="/my-booking" className="hover:text-foreground transition-colors">My Reservation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/80">Contact</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="size-4 mt-0.5 text-accent shrink-0" />
              <a
                href="https://maps.app.goo.gl/eVKydymUJHXkZDFW9?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground hover:underline transition-colors flex items-center gap-1"
              >
                <span>Musanze, Northern Province, Rwanda</span>
                <span className="text-[10px] text-accent font-semibold">📍</span>
              </a>
            </li>
            <li className="flex items-start gap-2.5"><Phone className="size-4 mt-0.5 text-accent shrink-0" /> <span>+250 788 764 000</span></li>
            <li className="flex items-start gap-2.5"><Mail className="size-4 mt-0.5 text-accent shrink-0" /> <span>northscape.musanze@gmail.com</span></li>
          </ul>
        </div>

        <div className="sm:col-span-2 md:col-span-1">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/80">Newsletter</h4>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">Slow letters from Musanze — new photos, offers, seasonal stories.</p>
          <form
            className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); (e.currentTarget as HTMLFormElement).reset(); }}
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-full bg-background border border-border px-4 py-2.5 text-sm focus:ring-focus min-h-[44px]"
            />
            <button className="rounded-full bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 hover:opacity-90 min-h-[44px] transition-all">Join</button>
          </form>
          <div className="mt-6 flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="inline-flex size-10 items-center justify-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition"><Instagram className="size-4.5" /></a>
            <a href="#" aria-label="Facebook" className="inline-flex size-10 items-center justify-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition"><Facebook className="size-4.5" /></a>
            <a href="#" aria-label="Twitter" className="inline-flex size-10 items-center justify-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition"><Twitter className="size-4.5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-x py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground text-center sm:text-left">
          <p>© {new Date().getFullYear()} NorthScape Apartment. All rights reserved.</p>
          <p>Crafted with care in Musanze, Rwanda.</p>
        </div>
      </div>
    </footer>
  );
}
