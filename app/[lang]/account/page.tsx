import Link from "next/link";
import { redirect } from "next/navigation";
import { loadUser } from "@/utils/user";
import SignOutButton from "@/components/common/signOutButton";
import {
  CircleDollarSignIcon,
  HomeIcon,
  KeyIcon,
  TimerIcon,
  UserIcon,
} from "lucide-react";
import { BreadcrumbItemType, Breadcrumbs } from "@/components/ui/breadcrumb";
import { LinkButton } from "@/components/ui/link-button";

async function Page() {
  const user = await loadUser();
  if (!user) {
    return redirect("/login");
  }

  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeIcon />,
    },
    {
      title: "帳號",
    },
  ];

  return (
    <div className="flex justify-center py-2">
      <div className="w-full md:w-4/5">
        <Breadcrumbs items={breadItems} />
        <hr />
        <div>
          <LinkButton
            variant={"ghost"}
            className="w-full"
            href="/account/order-history"
          >
            <TimerIcon style={{ color: "black" }} />
            <div>歷史訂單</div>
          </LinkButton>
          <LinkButton
            variant={"ghost"}
            className="w-full"
            href="/account/coupons"
          >
            <CircleDollarSignIcon style={{ color: "black" }} />
            <div>優惠卷</div>
          </LinkButton>
          <LinkButton
            variant={"ghost"}
            className="w-full"
            href="/account/change-password"
          >
            <KeyIcon style={{ color: "black" }} />
            <div>更改密碼</div>
          </LinkButton>
          <SignOutButton className="w-full" variant="ghost">
            <UserIcon style={{ color: "black" }} />
            <div>登出</div>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}

export default Page;
