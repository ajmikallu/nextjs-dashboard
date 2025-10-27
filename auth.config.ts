import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === "user@nextmail.com" &&
          credentials?.password === "123456"
        ) {
          return { id: "1", name: "Demo User", email: "user@nextmail.com" };
        }
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET || "secret-key",
  pages: {
    signIn: "/login",
  },
};
