// "use client";

// import { useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useAuthStore } from "@/store/authStore";

// const AuthSync = () => {
//   const { data: session } = useSession();
//   const { setAuth, token: storedToken, user: storedUser } = useAuthStore();

//   console.log(session)

//   // Sync Zustand store with NextAuth session
//   useEffect(() => {
//     if (session?.user) {
//       const user = {
//         id: session.user.id ? Number(session.user.id) : 0,
//         username: session.user.name || "",
//         email: session.user.email || "",
//         created_at: (session.user as any)?.createdAt || undefined,
//       };
//       const token = (session as any)?.accessToken || "";
//       setAuth(token, user);
//     }
//   }, [session, setAuth]);

//   // Sync Zustand store with localStorage on mount
//   useEffect(() => {
//     if (!storedToken && typeof window !== "undefined") {
//       const token = localStorage.getItem("authToken");
//       const userData = localStorage.getItem("user");
//       if (token && userData) {
//         try {
//           const user = JSON.parse(userData);
//           setAuth(token, user);
//         } catch (e) {
//           console.error("Failed to parse stored user data:", e);
//         }
//       }
//     }
//   }, [setAuth, storedToken]);

//   return null;
// };

// export default AuthSync;

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";

const AuthSync = () => {
  const { data: session } = useSession();
  const setAuth = useAuthStore((state) => state.setAuth);
  

  useEffect(() => {
    if (session?.user) {
      const user = {
        id: session.user.id ? Number(session.user.id) : 0, // Google/DB ID
        username: session.user.name || session.user.username || "",
        email: session.user.email || "",
        created_at: (session.user as any)?.created_at || undefined, // Only for DB users
      };

      // Access token (if Google, comes from JWT; if custom backend, from API)
      const token = (session as any)?.accessToken || "";

      // Update Zustand store
      setAuth(token, user);
    }
  }, [session, setAuth]);

  return null;
};

export default AuthSync;
