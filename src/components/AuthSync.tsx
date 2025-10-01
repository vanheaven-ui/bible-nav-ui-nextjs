"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import type { Session } from "next-auth";

interface AuthUser {
  id: number;
  username: string;
  email: string;
  created_at?: string;
}

const AuthSync = () => {
  const { data: session } = useSession();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    if (session?.user) {
      // Type session.user properly
      const user: AuthUser = {
        id: session.user.id ? Number(session.user.id) : 0,
        username:
          session.user.name ||
          (session.user as { username?: string }).username ||
          "",
        email: session.user.email || "",
        created_at: (session.user as { created_at?: string }).created_at,
      };

      // Access token (if available)
      const token =
        (session as Session & { accessToken?: string })?.accessToken || "";

      setAuth(token, user);
    }
  }, [session, setAuth]);

  return null;
};

export default AuthSync;
