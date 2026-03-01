"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  admissionNumber: string;
  className: string;
  role: "trainee" | "admin" | "trainer";
}

interface AuthContextType {
  user: User | null;
  login: (admissionNumber: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get initial user from localStorage - safe for SSR
function getInitialUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("physio_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state with null, then load from localStorage after mount
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const stored = getInitialUser();
    setUser(stored);
    setIsLoading(false);
  }, []);

  const login = async (admissionNumber: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/auth/login?admissionNumber=${encodeURIComponent(admissionNumber)}`);
      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("physio_user", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("physio_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
