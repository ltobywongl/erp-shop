import { RedirectType, redirect } from "next/navigation";
import RewardsPage from "@/components/rewards/page";
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

    return <RewardsPage point={user.couponPoints} items={items} />;
  } else {
    return redirect("/login", RedirectType.push);
  }
}

export default Page;
