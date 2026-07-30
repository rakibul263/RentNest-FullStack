"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi, clearSession, persistSession, readStoredSession } from "@/lib/api";
import type { User, UserRole } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: "tenant" | "landlord";
    phone?: string;
  }) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyUser = useCallback((u: User) => {
    setUser(u);
    if (typeof window !== "undefined") {
      localStorage.setItem("rn_user", JSON.stringify(u));
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await authApi.me();
      applyUser(res.data!);
    } catch {
      clearSession();
      setUser(null);
    }
  }, [applyUser]);

  useEffect(() => {
    let active = true;
    const init = async () => {
      const { token, user: storedUser } = readStoredSession();
      if (!token) {
        if (active) setIsLoading(false);
        return;
      }
      if (storedUser) setUser(storedUser);
      try {
        const res = await authApi.me();
        if (active) applyUser(res.data!);
      } catch {
        if (active) {
          clearSession();
          setUser(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void init();

    const onUnauthorized = () => {
      setUser(null);
      router.replace("/auth/login");
    };
    window.addEventListener("rn:unauthorized", onUnauthorized);
    return () => {
      active = false;
      window.removeEventListener("rn:unauthorized", onUnauthorized);
    };
  }, [applyUser, router]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login({ email, password });
      persistSession(res.data!.user, res.data!.token);
      applyUser(res.data!.user);
      return res.data!.user;
    },
    [applyUser]
  );

  const register = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      role: "tenant" | "landlord";
      phone?: string;
    }) => {
      const res = await authApi.register(payload);
      persistSession(res.data!.user, res.data!.token);
      applyUser(res.data!.user);
      return res.data!.user;
    },
    [applyUser]
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    toast.success("Signed out successfully");
    router.push("/");
  }, [router]);

  const hasRole = useCallback(
    (...roles: UserRole[]) => !!user && roles.includes(user.role),
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      hasRole,
      login,
      register,
      logout,
      refresh,
    }),
    [user, isLoading, hasRole, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
