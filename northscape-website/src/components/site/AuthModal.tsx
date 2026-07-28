import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import { loginWithEmail, registerWithEmail, loginWithGoogle, type UserProfile } from "@/lib/authStore";

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: UserProfile) => void;
}) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [googlePrompt, setGooglePrompt] = useState(false);
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setGoogleName("");
    setGoogleEmail("");
    setGooglePrompt(false);
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleConfirmGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail) {
      setError("Please enter your Google Email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user = loginWithGoogle(googleName, googleEmail);
      setLoading(false);
      if (onSuccess) onSuccess(user);
      handleClose();
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (tab === "register") {
      if (!name) {
        setError("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      let user: UserProfile;
      if (tab === "register") {
        user = registerWithEmail(name, email, password);
      } else {
        user = loginWithEmail(email, password);
      }
      setLoading(false);
      if (onSuccess) onSuccess(user);
      handleClose();
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-border space-y-6"
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 size-8 grid place-items-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            {googlePrompt ? (
              /* Google Sign-In Account Chooser / Entry Step */
              <div className="space-y-6">
                <button
                  onClick={() => setGooglePrompt(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  <ArrowLeft className="size-3.5" /> Back to standard sign in
                </button>

                <div className="text-center space-y-2">
                  <div className="mx-auto size-12 rounded-full border border-border bg-background grid place-items-center shadow-sm">
                    <svg className="size-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                    </svg>
                  </div>
                  <div className="font-display text-xl font-bold">Sign in with Google</div>
                  <p className="text-xs text-muted-foreground">
                    Enter your Google Account details to sign in to <strong>NorthScape Apartment</strong>.
                  </p>
                </div>

                {error && (
                  <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleConfirmGoogleLogin} className="space-y-4">
                  <label className="block text-xs">
                    <span className="uppercase tracking-widest text-muted-foreground font-semibold">Your Name (Google Account)</span>
                    <div className="relative mt-1">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={googleName}
                        onChange={(e) => setGoogleName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        className="w-full rounded-xl bg-background border border-border pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:ring-focus min-h-[44px]"
                      />
                    </div>
                  </label>

                  <label className="block text-xs">
                    <span className="uppercase tracking-widest text-muted-foreground font-semibold">Google Email Address</span>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={googleEmail}
                        onChange={(e) => setGoogleEmail(e.target.value)}
                        placeholder="your.email@gmail.com"
                        className="w-full rounded-xl bg-background border border-border pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:ring-focus min-h-[44px]"
                      />
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 px-4 text-xs sm:text-sm font-semibold hover:opacity-90 transition-all shadow-soft min-h-[44px]"
                  >
                    {loading ? "Authenticating with Google..." : `Sign In with Google`}
                    <ArrowRight className="size-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Standard Auth Tabs (Sign In / Register) */
              <>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold">Welcome to NorthScape</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sign in to manage your residence stays and express reservations.
                  </p>
                </div>

                {/* Tabs Selector */}
                <div className="grid grid-cols-2 rounded-full bg-secondary p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => { setTab("login"); setError(""); }}
                    className={`rounded-full py-2 transition-all ${tab === "login" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTab("register"); setError(""); }}
                    className={`rounded-full py-2 transition-all ${tab === "register" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Register
                  </button>
                </div>

                {/* Google OAuth Login Button */}
                <button
                  type="button"
                  onClick={() => { setError(""); setGooglePrompt(true); }}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 rounded-full border border-border bg-background py-3 px-4 text-xs sm:text-sm font-semibold text-foreground hover:bg-secondary transition-all shadow-sm active:scale-98 min-h-[44px]"
                >
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-border/80" />
                  <span className="absolute bg-card px-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    Or with email
                  </span>
                </div>

                {error && (
                  <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {tab === "register" && (
                    <label className="block text-xs">
                      <span className="uppercase tracking-widest text-muted-foreground font-semibold">Full Name</span>
                      <div className="relative mt-1">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full rounded-xl bg-background border border-border pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:ring-focus min-h-[44px]"
                        />
                      </div>
                    </label>
                  )}

                  <label className="block text-xs">
                    <span className="uppercase tracking-widest text-muted-foreground font-semibold">Email Address</span>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="guest@example.rw"
                        className="w-full rounded-xl bg-background border border-border pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:ring-focus min-h-[44px]"
                      />
                    </div>
                  </label>

                  <label className="block text-xs">
                    <span className="uppercase tracking-widest text-muted-foreground font-semibold">Password</span>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl bg-background border border-border pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:ring-focus min-h-[44px]"
                      />
                    </div>
                  </label>

                  {tab === "register" && (
                    <label className="block text-xs">
                      <span className="uppercase tracking-widest text-muted-foreground font-semibold">Confirm Password</span>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-xl bg-background border border-border pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:ring-focus min-h-[44px]"
                        />
                      </div>
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 px-4 text-xs sm:text-sm font-semibold hover:opacity-90 transition-all shadow-soft min-h-[44px] mt-2"
                  >
                    {loading
                      ? "Processing..."
                      : tab === "register"
                      ? "Create Guest Account"
                      : "Sign In"}
                    <ArrowRight className="size-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
