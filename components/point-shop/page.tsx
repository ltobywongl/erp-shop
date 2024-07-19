"use client";
import { CouponCategory } from "@prisma/client";
import { ItemCardPoint } from "@/components/common/itemCard";

function PointShopPage({ point, items }: { point?: number, items: Partial<CouponCategory>[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
      {items.map((item, index) => (
        <ItemCardPoint
          item={item}
          key={`item${index}-${item.id}`}
        />
      ))}
    </div>
  );
}
export default PointShopPage;
