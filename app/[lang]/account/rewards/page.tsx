import { ItemCardPointReadOnly } from "@/components/common/itemCard";
import { BreadcrumbItemType, Breadcrumbs } from "@/components/ui/breadcrumb";
import { translation } from "@/i18n";
import { getRewardsByUserId } from "@/utils/rewards/rewards";
import { loadUser } from "@/utils/user";
import { HomeIcon } from "lucide-react";
import { redirect } from "next/navigation";

async function Page(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const user = await loadUser();
  if (!user) {
    return redirect("/login");
  }
  const { t } = await translation(params.lang, "coupons");

  const coupons = await getRewardsByUserId(params.lang, user.id);

  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeIcon />,
    },
    {
      href: "/account",
      title: t("account"),
    },
    {
      title: t("coupon"),
    },
  ];

  return (
    <div className="flex flex-col gap-4 py-2 px-2">
      <Breadcrumbs items={breadItems} />
      <div className="flex flex-col gap-6 items-center">
        <div className="[&>p]:text-center [&>p]:font-bold">
          <p>
            {t("yourRewardPoints")}: {user.couponPoints}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 mt-2">
        <h3 className="text-primary font-bold text-2xl md:text-3xl lg:text-4xl">
          {t("coupon")}
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {!coupons || (coupons.length == 0 && <div>{t("noRewards")}</div>)}
          {coupons.map((coupon) => {
            return <ItemCardPointReadOnly key={coupon.id} item={coupon} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Page;
