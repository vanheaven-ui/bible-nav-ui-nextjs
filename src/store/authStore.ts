// src/store/authStore.ts
// This Zustand store manages the authentication state of the user.

import { create } from "zustand";

// Define the shape of the user object (matching your backend's login/signup response)
interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string; // Optional, as it might not always be needed on frontend
}

// Define the shape of the authentication state
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

// Create the Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  // Function to set authentication state upon login/signup
  // Explicitly type 'token' as string and 'user' as User
  setAuth: (token: string, user: User) => {
    // Optionally, persist token and user to localStorage for session persistence
    if (typeof window !== "undefined") {
      // Check if window is defined (i.e., not server-side)
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ token, user, isAuthenticated: true });
  },
  // Function to clear authentication state upon logout
  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

// Optional: Hydrate the store from localStorage on application load
// This ensures that if the user refreshes the page, they remain logged in.
if (typeof window !== "undefined") {
  const storedToken = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("user");

  if (storedToken && storedUser) {
    try {
      // Explicitly cast the parsed JSON to the User interface
      const user: User = JSON.parse(storedUser);
      useAuthStore.getState().setAuth(storedToken, user);
    } catch (e: unknown) {
      // Changed 'any' to 'unknown'
      console.error(
        "Failed to parse stored user data:",
        e instanceof Error ? e.message : "Unknown error"
      );
      useAuthStore.getState().clearAuth(); // Clear corrupted data
    }
  }
}
