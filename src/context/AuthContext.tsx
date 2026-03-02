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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem("physio_user");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore errors
    }
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
