import NotFound from "@/app/not-found";
import CouponDetails from "@/components/coupon/details";
import ProductDetails from "@/components/product/details";
import prisma from "@/utils/prisma";

async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const couponCategory = await prisma.couponCategory.findUnique({
    select: {
      id: true,
      name: true,
      description: true,
      imagePath: true,
      stock: true,
      point: true,
      value: true,
    },
    where: {
      id: params.id,
      deletedAt: null,
    },
  });

  if (!couponCategory) return <NotFound />;

  const item = {
    id: couponCategory.id,
    name: couponCategory.name,
    description: couponCategory.description ?? "",
    image: couponCategory.imagePath ?? "",
    stock: couponCategory.stock,
    point: couponCategory.point,
    value: couponCategory.value,
  };

  return (
    <div className="flex justify-center gap-2 py-2 px-2 md:px-0">
      <div className="w-full md:w-4/5">
        <CouponDetails item={item} />
      </div>
    </div>
  );
}

export default Page;
