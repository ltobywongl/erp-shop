import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";
import prisma from "./prisma";

export async function loadUser(options: { detailed: true }): Promise<{
  id: string;
  email: string;
  password: string | null;
  role: string;
  balance: number;
  couponPoints: number;
  status: string | null;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
} | null>;

export async function loadUser(options: { detailed: false }): Promise<
  | {
      id: string;
      name: string;
      email: string;
      role: string;
    }
  | undefined
>;

export async function loadUser(options: { detailed: true }) {
  const session = await getServerSession(authOptions);

  if (!options.detailed) {
    return session?.user;
  }

  if (!session?.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  return user;
}
