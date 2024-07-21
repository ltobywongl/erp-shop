import NotFound from "@/app/not-found";
import ProductDetails from "@/components/product/details";
import prisma from "@/utils/prisma";

async function Page({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      price: true,
      stock: true,
      discount: true,
      couponPoint: true,
      category: {
        select: {
          name: true,
          discount: true,
        },
      },
    },
    where: {
      id: params.id,
      deletedAt: null,
      stock: { gt: 0 },
    },
  });

  if (!product) return <NotFound />;

  const item = {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    image: product.image ?? "",
    markedPrice: product.price,
    sellingPrice: product.price - product.discount - product.category.discount,
    quantity: 1,
    stock: product.stock,
    couponPoint: product.couponPoint,
  };

  return (
    <div className="flex justify-center py-2">
      <div className="w-full md:w-4/5">
        <ProductDetails item={item} />
      </div>
    </div>
  );
}

export default Page;
