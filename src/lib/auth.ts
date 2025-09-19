import { getServerSession as originalGetServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Session } from "next-auth";

/**
 * Strongly typed wrapper for getServerSession with our custom Session type.
 */
export async function getServerAuthSession(): Promise<Session | null> {
  return originalGetServerSession(authOptions);
}
