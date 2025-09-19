import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      createdAt?: string;
      updatedAt?: string
    } & DefaultSession["user"]; // <-- this merges in `name` and `email`
    accessToken?: string;
  }

  interface User extends DefaultUser {
    id: string;
    username?: string;
    createdAt?: string;
  }

  interface JWT {
    id: string;
    accessToken?: string;
    createdAt?: string;
  }
}
