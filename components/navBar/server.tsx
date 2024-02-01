import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import NavBarClient from "./client";

export default async function NavBar() {
  const session = await getServerSession(authOptions);

  return <NavBarClient session={session} />;
}
