import { ItemCardPointReadOnly } from "@/components/common/itemCard";
import prisma from "@/utils/prisma";
import { loadSessionUser } from "@/utils/user";
import { redirect } from "next/navigation";

async function Page() {
  const user = await loadSessionUser();
  if (!user) {
    return redirect("/login");
  }

  const coupons = await prisma.coupon.findMany({
    select: {
      id: true,
      couponCategory: {
        select: {
          value: true,
          point: true,
        },
      },
    },
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="flex justify-center p-2">
      <div className="w-4/5 flex flex-col gap-4">
        {coupons.map((coupon) => {
          return (
            <ItemCardPointReadOnly
              key={coupon.id}
              item={{
                point: coupon.couponCategory.point,
                value: coupon.couponCategory.value,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Page;
