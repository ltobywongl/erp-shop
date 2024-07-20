import CheckoutForm from "@/components/checkout/form";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }
  const user = await prisma.user.findUnique({
    select: {
      balance: true,
    },
    where: {
      id: session.user.id,
    },
  });
  if (!user) {
    return redirect("/login");
  }

  return (
    <main className="flex justify-center w-full md:mt-4">
      <CheckoutForm balance={user.balance} />
    </main>
  );
}

export default Page;
