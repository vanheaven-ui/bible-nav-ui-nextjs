import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const config: NextAuthConfig = {
  debug: process.env.NODE_ENV === "development",

  // Prisma adapter handles syncing users with your database
  adapter: PrismaAdapter(prisma),

  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Credentials (email + password) Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Safely assert types
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // Check for missing fields
        if (!email || !password) {
          console.error("Missing email or password");
          return null;
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          console.error("Invalid user or missing password");
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          console.error("Invalid password");
          return null;
        }

        // Return minimal user object to NextAuth
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  // Use JWT strategy (better for stateless APIs)
  session: {
    strategy: "jwt",
  },

  // Inject id into JWT & session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // store id at login
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string; // expose id in session
      }
      return session;
    },
  },

  // Custom pages
  pages: {
    signIn: "/login",
  },
};

// Export NextAuth helpers
export const { handlers, auth, signIn, signOut } = NextAuth(config);
