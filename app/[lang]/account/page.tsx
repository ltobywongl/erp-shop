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
import { translation } from "@/i18n";

async function Page(
  props: Readonly<{
    params: Promise<{ lang: string }>;
  }>
) {
  const params = await props.params;
  const { t } = await translation(params.lang, "account");
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
      title: t("account"),
    },
  ];

  return (
    <div className="flex justify-center py-2 px-2 md:px-0">
      <div className="w-full md:w-4/5">
        <Breadcrumbs items={breadItems} />
        <hr />
        <div>
          <LinkButton
            variant={"ghost"}
            size={"lg"}
            className="w-full border-b flex gap-2"
            href="/account/order-history"
          >
            <TimerIcon style={{ color: "black" }} />
            <div>{t("orderHistory")}</div>
          </LinkButton>
          <LinkButton
            variant={"ghost"}
            size={"lg"}
            className="w-full border-b flex gap-2"
            href="/account/coupons"
          >
            <CircleDollarSignIcon style={{ color: "black" }} />
            <div>{t("coupon")}</div>
          </LinkButton>
          <LinkButton
            variant={"ghost"}
            size={"lg"}
            className="w-full border-b flex gap-2"
            href="/account/change-password"
          >
            <KeyIcon style={{ color: "black" }} />
            <div>{t("changePassword")}</div>
          </LinkButton>
          <SignOutButton
            className="w-full border-b flex gap-2"
            variant="ghost"
            size={"lg"}
          >
            <UserIcon style={{ color: "black" }} />
            <div>{t("logout")}</div>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}

export default Page;
