"use client";
import { CouponCategory } from "@prisma/client";
import { ItemCardPoint } from "@/components/common/itemCard";

function PointShopPage({
  point,
  items,
}: Readonly<{
  point: number;
  items: Partial<CouponCategory>[];
}>) {
  return (
    <div className="m-3 md:m-6">
      <div className="p-2 md:p-3 border w-fit font-bold">現有積分: {point}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {items.map((item, index) => (
          <ItemCardPoint item={item} key={`item${index}-${item.id}`} />
        ))}
      </div>
    </div>
  );
}
export default PointShopPage;
