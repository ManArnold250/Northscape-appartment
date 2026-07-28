export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "email" | "google";
  createdAt: string;
};

const AUTH_KEY = "northscape_user_session";

export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_e) {
    return null;
  }
}

export function loginWithEmail(email: string, _password: string, name?: string): UserProfile {
  const user: UserProfile = {
    id: `usr-${Date.now()}`,
    name: name || email.split("@")[0] || "NorthScape Guest",
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    provider: "email",
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("northscape_auth_updated", { detail: user }));
  }
  return user;
}

export function registerWithEmail(name: string, email: string, _password: string): UserProfile {
  return loginWithEmail(email, _password, name);
}

export function loginWithGoogle(customName?: string, customEmail?: string): UserProfile {
  const email = customEmail?.trim() || "guest@gmail.com";
  const name = customName?.trim() || (email ? email.split("@")[0] : "Google User");

  const googleUser: UserProfile = {
    id: `usr-g-${Date.now()}`,
    name,
    email,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    provider: "google",
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, JSON.stringify(googleUser));
    window.dispatchEvent(new CustomEvent("northscape_auth_updated", { detail: googleUser }));
  }
  return googleUser;
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new CustomEvent("northscape_auth_updated", { detail: null }));
  }
}
