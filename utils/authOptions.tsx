import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/utils/prisma";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

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
            password: true,
            role: true,
            provider: true,
          },
          where: {
            email: credentials.email,
          },
        });

        if (!loginUser || loginUser.provider !== 'credentials') return null;

        const passwordCorrect = await bcrypt.compare(
          credentials.password,
          loginUser.password as string,
        );

        if (passwordCorrect) {
          return {
            id: loginUser.id,
            email: loginUser.email,
            role: loginUser.role,
          };
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
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
    async signIn({ account, profile }) {
      if (!account || !profile?.email) return false;

      if (account.provider === "google") {
        const user = await prisma.user.findFirst({
          select: {
            id: true,
            email: true,
            role: true,
          },
          where: {
            email: profile.email,
            provider: 'google'
          },
        });

        if (!user) {
          // Create a new user
          await prisma.user.create({
            data: {
              id: uuid(),
              email: profile.email,
              provider: 'google',
            },
          });
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
