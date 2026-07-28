import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Sun, Moon, User as UserIcon, LogOut, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { img } from "@/lib/images";
import { cn } from "@/lib/utils";
import { getStoredUser, logoutUser, type UserProfile } from "@/lib/authStore";
import { AuthModal } from "@/components/site/AuthModal";
import { useLanguage, LANGUAGES } from "@/lib/i18nStore";

const links = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/my-booking", label: "My Stay" },
] as const;

function getUserInitials(name?: string): string {
  if (!name) return "NS";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const handleAuth = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile | null>;
      setUser(customEvent.detail);
    };
    window.addEventListener("northscape_auth_updated", handleAuth);
    return () => window.removeEventListener("northscape_auth_updated", handleAuth);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("northscape-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const darkState = saved === "dark" || (!saved && prefersDark);
    setIsDark(darkState);
    document.documentElement.classList.toggle("dark", darkState);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("northscape-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  useEffect(() => {
    setOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  const onHome = pathname === "/";
  const solid = scrolled || !onHome || open;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          solid ? "glass border-b border-border/60 py-3 shadow-soft" : "bg-transparent py-4 sm:py-5",
        )}
      >
        <div className="container-x flex items-center justify-between gap-2 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group focus-visible:outline-none min-w-0">
            <span
              className={cn(
                "inline-flex h-11 w-11 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 shadow-lg transition-all overflow-hidden shrink-0 bg-[#FDF4E3]",
                solid ? "border-accent/60" : "border-white/80 ring-2 ring-white/30",
              )}
            >
              <img src={img.logo} alt="NorthScape" className="h-full w-full object-contain p-0.5 rounded-full" />
            </span>
            <span
              className={cn(
                "font-display text-base sm:text-2xl font-bold tracking-tight transition-colors truncate",
                solid ? "text-foreground" : "text-white drop-shadow-md",
              )}
            >
              NorthScape
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-4">
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors relative py-1",
                    solid ? "text-foreground/80 hover:text-foreground" : "text-white/90 hover:text-white",
                  )}
                  activeProps={{
                    className: cn(
                      "text-sm font-medium tracking-wide relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-accent",
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
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                Book Now
              </Link>
            </nav>



            {/* Auth / Account Profile Button - Abbreviation Badge Only */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu((v) => !v)}
                  title={user.name}
                  aria-label={`User Account: ${user.name}`}
                  className="inline-flex size-9 sm:size-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xs sm:text-sm shadow-soft border-2 border-border/80 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  {getUserInitials(user.name)}
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-3 shadow-xl space-y-2 text-xs"
                    >
                      <div className="p-2 bg-secondary/50 rounded-xl space-y-0.5">
                        <div className="font-bold text-foreground truncate">{user.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                      </div>
                      <Link
                        to="/my-booking"
                        className="flex items-center gap-2 rounded-xl p-2 font-medium hover:bg-secondary transition-colors"
                      >
                        <ShieldCheck className="size-4 text-accent" /> My Reservations
                      </Link>
                      <button
                        onClick={() => { logoutUser(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 rounded-xl p-2 font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="size-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border size-9 sm:size-auto sm:px-3.5 sm:py-1.5 justify-center text-xs font-semibold transition-all active:scale-95 shrink-0",
                  solid ? "border-border text-foreground bg-background/80 hover:bg-secondary" : "border-white/60 text-white bg-black/20 hover:bg-white/20",
                )}
                aria-label="Sign In / Register"
                title="Sign In / Register"
              >
                <UserIcon className="size-3.5" />
                <span className="hidden sm:inline">Sign In / Register</span>
              </button>
            )}

            {/* Theme Toggle Button (Sun / Moon) */}
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                "inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition-all active:scale-90 hover:opacity-90 shrink-0",
                solid ? "border-border text-foreground bg-background/80" : "border-white/50 text-white bg-black/20",
              )}
              aria-label="Toggle dark/light mode"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="size-4 sm:size-4.5 text-amber-400" /> : <Moon className="size-4 sm:size-4.5" />}
            </button>

            <button
              type="button"
              className={cn(
                "md:hidden inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition-colors min-h-[36px] min-w-[36px] active:scale-95",
                solid ? "border-border text-foreground bg-background/50" : "border-white/50 text-white bg-black/20",
              )}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-4.5 sm:size-5" /> : <Menu className="size-4.5 sm:size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-border/60 bg-background/95 backdrop-blur-md overflow-hidden"
            >
              <div className="container-x py-6 flex flex-col gap-4">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="text-base font-medium text-foreground/80 hover:text-foreground py-1"
                    activeProps={{ className: "text-foreground font-semibold text-accent" }}
                    activeOptions={{ exact: l.to === "/" }}
                  >
                    {l.label}
                  </Link>
                ))}
                {!user ? (
                  <button
                    onClick={() => { setOpen(false); setShowAuthModal(true); }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary py-3 text-sm font-semibold text-foreground min-h-[44px]"
                  >
                    <UserIcon className="size-4" /> Sign In / Register
                  </button>
                ) : (
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xs">
                        {getUserInitials(user.name)}
                      </span>
                      <span className="text-sm font-bold">{user.name}</span>
                    </div>
                    <button
                      onClick={() => { logoutUser(); setOpen(false); }}
                      className="text-xs font-semibold text-destructive"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3.5 text-center text-sm font-medium text-primary-foreground shadow-soft min-h-[48px]"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
