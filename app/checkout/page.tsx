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

  const coupons = await prisma.coupon.findMany({
    select: {
      id: true,
      couponCategory: {
        select: {
          name: true,
          value: true,
        },
      },
    },
    where: {
      userId: session.user.id,
    },
  });

  const filteredCoupons = coupons
    .map((coupon) => {
      return {
        id: coupon.id,
        name: coupon.couponCategory.name,
        value: coupon.couponCategory.value,
      };
    })
    .filter(
      (obj, index, self) => index === self.findIndex((t) => t.id === obj.id)
    );

  return (
    <main className="flex justify-center w-full md:mt-4">
      <CheckoutForm balance={user.balance} coupons={filteredCoupons} />
    </main>
  );
}

export default Page;
