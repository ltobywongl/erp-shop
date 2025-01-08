import { RedirectType, redirect } from "next/navigation";
import PointShopPage from "@/components/point-shop/page";
import prisma from "@/utils/prisma";
import { CouponCategory } from "@prisma/client";
import { loadUser } from "@/utils/user";

async function Page() {
  const user = await loadUser();
  if (user) {
    const items = (await prisma.couponCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        useStock: true,
        stock: true,
        imagePath: true,
        point: true,
        value: true,
      },
      where: {
        active: true,
        deletedAt: null,
      },
    })) as Partial<CouponCategory>[];

    return (
      <div className="m-3 md:m-6">
        <div className="p-2 md:p-3 border w-fit font-bold">
          現有積分: {user?.couponPoints ?? 0}
        </div>
        <PointShopPage point={user?.couponPoints} items={items} />
      </div>
    );
  } else {
    return redirect("/login", RedirectType.push);
  }
}

export default Page;
