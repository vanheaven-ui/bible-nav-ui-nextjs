import { DefaultSession, DefaultUser } from "next-auth";

// -------------------------------------------------------------
// Module augmentation for `next-auth`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    id: string;
    username?: string | null;
    createdAt?: Date;
  }
}

// -------------------------------------------------------------
// Module augmentation for `next-auth/jwt`
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string | null;
    accessToken?: string;
    createdAt?: Date;
  }
}
