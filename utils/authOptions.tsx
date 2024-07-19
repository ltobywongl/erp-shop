import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/utils/prisma";
import * as bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) return null;

        const loginUser = await prisma.user.findFirst({
          select: {
            id: true,
            email: true,
            username: true,
            password: true,
            role: true,
          },
          where: {
            email: credentials.email,
          },
        });

        if (!loginUser) return null;

        const passwordCorrect = await bcrypt.compare(
          credentials.password,
          loginUser.password
        );

        if (passwordCorrect) {
          return {
            id: loginUser.id,
            email: loginUser.email,
            name: loginUser.username,
            role: loginUser.role,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return Promise.resolve(token);
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.user.id;
      session.user.name = token.user.name;
      session.user.email = token.user.email;
      session.user.role = token.user.role;
      delete session.user.image;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
