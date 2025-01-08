import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";
import prisma from "./prisma";

export async function loadUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  
  if (!user) {
    return null;
  }
  
  return user;
}

export async function loadSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
