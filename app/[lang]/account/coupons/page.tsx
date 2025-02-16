import { ItemCardPointReadOnly } from "@/components/common/itemCard";
import { BreadcrumbItemType, Breadcrumbs } from "@/components/ui/breadcrumb";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { HomeIcon } from "lucide-react";
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

  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeIcon />,
    },
    {
      href: "/account",
      title: "帳號",
    },
    {
      title: "優惠卷",
    },
  ];

  return (
    <div className="flex justify-center py-2 px-2 md:px-0">
      <div className="w-full md:w-4/5 flex flex-col gap-4">
        <Breadcrumbs items={breadItems} />
        <div>
          {!coupons || (coupons.length == 0 && <div>沒有優惠卷</div>)}
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
    </div>
  );
}

export default Page;
