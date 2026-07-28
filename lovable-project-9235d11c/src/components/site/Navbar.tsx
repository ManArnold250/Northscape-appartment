import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { img } from "@/lib/images";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const onHome = pathname === "/";
  const solid = scrolled || !onHome;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        solid ? "glass border-b border-border/60 py-3" : "bg-transparent py-5",
      )}
    >
      <div className="container-x flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 group">
          <span
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors overflow-hidden",
              solid ? "bg-background border-border" : "bg-background/85 border-white/40",
            )}
          >
            <img src={img.logo} alt="NorthScape" className="h-full w-full object-cover" />
          </span>
          <span
            className={cn(
              "font-display text-xl tracking-tight transition-colors",
              solid ? "text-foreground" : "text-white drop-shadow-md",
            )}
          >
            NorthScape
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors relative",
                solid ? "text-foreground/80 hover:text-foreground" : "text-white/90 hover:text-white",
              )}
              activeProps={{
                className: cn(
                  "text-sm font-medium tracking-wide relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-accent",
                  solid ? "text-foreground" : "text-white",
                ),
              }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/book"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90 transition-all hover:-translate-y-0.5"
          >
            Book Now
          </Link>
        </nav>

        <button
          type="button"
          className={cn(
            "md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border",
            solid ? "border-border text-foreground" : "border-white/50 text-white",
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden glass border-t border-border/60"
          >
            <div className="container-x py-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="py-3 px-2 text-base font-medium text-foreground/85 hover:text-foreground rounded-lg hover:bg-muted/60"
                  activeProps={{ className: "py-3 px-2 text-base font-medium text-accent rounded-lg bg-muted/60" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/book"
                className="mt-2 inline-flex justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
