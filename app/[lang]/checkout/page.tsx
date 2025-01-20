import CheckoutForm from "@/components/checkout/form";
import prisma from "@/utils/prisma";
import { loadUser } from "@/utils/user";
import { redirect } from "next/navigation";

async function Page() {
  const user = await loadUser();
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
      userId: user.id,
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
      <CheckoutForm coupons={filteredCoupons} />
    </main>
  );
}

export default Page;
