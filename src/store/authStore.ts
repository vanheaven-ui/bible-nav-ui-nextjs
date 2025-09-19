import { create } from "zustand";

export interface User {
  id: number | string;
  username?: string | null;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setSessionUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token: string, user: User) => {
    const normalizedUser: User = {
      ...user,
      createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    }
    set({ token, user: normalizedUser, isAuthenticated: true });
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
    set({ token: null, user: null, isAuthenticated: false });
  },

  setSessionUser: (user: User) => {
    const normalizedUser: User = {
      ...user,
      createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    }
    set({ user: normalizedUser, isAuthenticated: true });
  },
}));

// Initialize from localStorage
if (typeof window !== "undefined") {
  const storedToken = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    try {
      const parsedUser: User = JSON.parse(storedUser);
      const user: User = {
        ...parsedUser,
        createdAt: parsedUser.createdAt
          ? new Date(parsedUser.createdAt)
          : undefined,
        updatedAt: parsedUser.updatedAt
          ? new Date(parsedUser.updatedAt)
          : undefined,
      };

      if (storedToken) {
        useAuthStore.getState().setAuth(storedToken, user);
      } else {
        useAuthStore.getState().setSessionUser(user);
      }
    } catch {
      useAuthStore.getState().clearAuth();
    }
  }
}
