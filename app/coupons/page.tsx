import { ItemCardPointReadOnly } from "@/components/common/itemCard";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
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
      userId: session.user.id,
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
