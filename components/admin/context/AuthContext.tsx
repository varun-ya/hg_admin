"use client";
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "finance" | "support";
  avatar: string;
}

interface AuthCtx {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const MOCK_USERS: Record<string, { password: string; user: AdminUser }> = {
  "admin@homeguruworld.com": {
    password: "admin123",
    user: { id: "USR-001", name: "Naman Gupta", email: "admin@homeguruworld.com", role: "super_admin", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=admin@homeguruworld.com" },
  },
  "karan@homeguruworld.com": {
    password: "admin123",
    user: { id: "USR-002", name: "Karan Malhotra", email: "karan@homeguruworld.com", role: "super_admin", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=karan@homeguruworld.com" },
  },
  "riya@homeguruworld.com": {
    password: "admin123",
    user: { id: "USR-003", name: "Riya Sharma", email: "riya@homeguruworld.com", role: "admin", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=riya@homeguruworld.com" },
  },
  "finance@homeguruworld.com": {
    password: "admin123",
    user: { id: "USR-004", name: "Amit Desai", email: "finance@homeguruworld.com", role: "finance", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=finance@homeguruworld.com" },
  },
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: () => {},
});

const STORAGE_KEY = "hg_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const entry = MOCK_USERS[email.toLowerCase().trim()];
    if (!entry) return { success: false, error: "No account found with this email" };
    if (entry.password !== password) return { success: false, error: "Invalid password" };

    setUser(entry.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.user));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
