"use client";
import { CouponCategory } from "@prisma/client";
import { ItemCardPoint } from "@/components/common/itemCard";
import { HomeIcon } from "lucide-react";
import { BreadcrumbItemType, Breadcrumbs } from "@/components/ui/breadcrumb";

function RewardsPage({
  point,
  items,
}: Readonly<{
  point: number;
  items: Partial<CouponCategory>[];
}>) {
  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeIcon />,
    },
    {
      title: "獎賞",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-2 py-2 px-2 md:px-0">
      <div className="w-full md:w-4/5">
        <Breadcrumbs items={breadItems} />
        <div className="p-2 md:p-3 w-fit font-bold">現有積分: {point}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {items.map((item, index) => (
            <ItemCardPoint item={item} key={`item${index}-${item.id}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default RewardsPage;
