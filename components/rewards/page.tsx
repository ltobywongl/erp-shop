"use client";
import { ItemCardPoint } from "@/components/common/itemCard";
import { HomeIcon } from "lucide-react";
import { BreadcrumbItemType, Breadcrumbs } from "@/components/ui/breadcrumb";
import { useTranslation } from "@/i18n/client";

function RewardsPage(
  params: Readonly<{
    lang: string;
    point: number;
    items: CouponCategory[];
  }>
) {
  const { t } = useTranslation(params.lang, "coupons");
  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeIcon />,
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
            {t("yourRewardPoints")}: {params.point}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 mt-2">
        <h3 className="text-primary font-bold text-2xl md:text-3xl lg:text-4xl">
          {t("coupon")}
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {params.items.map((item, index) => (
            <ItemCardPoint
              item={item}
              key={`item${index}-${item.id}`}
              lang={params.lang}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default RewardsPage;
