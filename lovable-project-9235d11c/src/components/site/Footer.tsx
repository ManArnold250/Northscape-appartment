import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { img } from "@/lib/images";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/40">
      <div className="container-x py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-background border border-border overflow-hidden">
              <img src={img.logo} alt="NorthScape" className="h-full w-full object-cover" />
            </span>
            <span className="font-display text-xl">NorthScape</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            A quiet, wood-lit apartment retreat in Musanze — the gateway to Volcanoes National Park.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/70">Explore</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li><Link to="/rooms" className="hover:text-foreground">Rooms & Suites</Link></li>
            <li><Link to="/gallery" className="hover:text-foreground">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-foreground">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/book" className="hover:text-foreground">Book a Stay</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/70">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="size-4 mt-0.5 text-accent" /> Musanze, Northern Province, Rwanda</li>
            <li className="flex items-start gap-2"><Phone className="size-4 mt-0.5 text-accent" /> +250 790 659 689</li>
            <li className="flex items-start gap-2"><Phone className="size-4 mt-0.5 text-accent" /> +250 788 764 000</li>
            <li className="flex items-start gap-2"><Mail className="size-4 mt-0.5 text-accent" /> stay@northscape.rw</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/70">Newsletter</h4>
          <p className="mt-4 text-sm text-muted-foreground">Slow letters from Musanze — new photos, offers, seasonal stories.</p>
          <form
            className="mt-4 flex items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); (e.currentTarget as HTMLFormElement).reset(); }}
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-full bg-background border border-border px-4 py-2.5 text-sm focus:ring-focus"
            />
            <button className="rounded-full bg-primary text-primary-foreground text-sm px-4 py-2.5 hover:opacity-90">Join</button>
          </form>
          <div className="mt-6 flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="inline-flex size-9 items-center justify-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition"><Instagram className="size-4" /></a>
            <a href="#" aria-label="Facebook" className="inline-flex size-9 items-center justify-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition"><Facebook className="size-4" /></a>
            <a href="#" aria-label="Twitter" className="inline-flex size-9 items-center justify-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition"><Twitter className="size-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-x py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NorthScape Apartment. All rights reserved.</p>
          <p>Crafted with care in Musanze, Rwanda.</p>
        </div>
      </div>
    </footer>
  );
}
