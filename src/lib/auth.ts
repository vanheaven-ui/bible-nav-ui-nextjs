import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// Minimal user object returned by credentials provider
interface SafeUser {
  id: string;
  name: string | null;
  email: string | null;
}

const config: NextAuthConfig = {
  debug: process.env.NODE_ENV === "development",

  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) {
          throw new Error(
            "Missing credentials. Please provide email and password."
          );
        }

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        // Find user in database
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          throw new Error("No account found with that email address.");
        }

        if (!user.password) {
          throw new Error(
            "This account does not support password login. Try Google sign-in."
          );
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password. Please try again.");
        }

        // Return minimal safe user object
        const safeUser: SafeUser = {
          id: user.id,
          name: user.name,
          email: user.email,
        };

        return safeUser;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as SafeUser).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
