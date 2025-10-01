import { PrismaAdapter } from "@auth/prisma-adapter"; 
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

export interface AuthUser extends User {
  id: string;
  name?: string | null;
  email?: string | null;
}

export interface CustomSession extends Session {
  user: AuthUser;
}

// NextAuth v5 config
const config = {
  adapter: PrismaAdapter(prisma), 

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<string, unknown> | undefined
      ): Promise<AuthUser | null> {
        if (
          !credentials?.email ||
          !credentials?.password ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.username ?? null,
          email: user.email ?? null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: AuthUser }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.name = user.name ?? undefined;
        token.email = user.email ?? undefined;
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<CustomSession> {
      if (session.user && token.id) {
        (session.user as AuthUser).id = token.id as string;
        (session.user as AuthUser).name = (token.name ?? null) as string | null;
        (session.user as AuthUser).email = (token.email ?? null) as
          | string
          | null;
      }

      return session as CustomSession;
    },
  },
};

// -------------------------------------------------------------
// V5 Export (auth + handlers)
export const { handlers, auth } = NextAuth(config);
