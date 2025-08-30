import { create } from "zustand";

interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string; 
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token: string, user: User) => {
  
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ token, user, isAuthenticated: true });
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

if (typeof window !== "undefined") {
  const storedToken = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("user");

  if (storedToken && storedUser) {
    try {
      const user: User = JSON.parse(storedUser);
      useAuthStore.getState().setAuth(storedToken, user);
    } catch (e: unknown) {
      console.error(
        "Failed to parse stored user data:",
        e instanceof Error ? e.message : "Unknown error"
      );
      useAuthStore.getState().clearAuth(); 
    }
  }
}
