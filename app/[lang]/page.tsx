import React from "react";
import { ItemCardVertical } from "@/components/common/itemCard";
import prisma from "@/utils/prisma";
import { pathToS3Url } from "@/utils/string";
import Link from "next/link";
import { translation } from "@/i18n";

export default async function Home({ params }: { params: { lang: string } }) {
  const { t } = await translation(params.lang, "home");
  const items = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      price: true,
      discount: true,
      couponPoint: true,
      useStock: true,
      stock: true,
      category: {
        select: {
          discount: true,
        },
      },
    },
    where: {
      deletedAt: null,
      OR: [
        {
          useStock: false,
        },
        {
          useStock: true,
          stock: { gt: 0 },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <main className="flex flex-col">
      <div
        className="min-h-dvh w-full flex flex-col gap-2 items-center justify-center bg-cover p-2"
        style={{ backgroundImage: `url(${pathToS3Url("images/banner.jpg")})` }}
      >
        <div className="text-3xl font-medium text-white drop-shadow-lg">{t("brand")}</div>
        <Link
          href={"/categories"}
          className="bg-white border px-4 md:px-6 py-2 md:py-4 rounded"
        >
          SHOP NOW
        </Link>
      </div>
      <div className="flex flex-col items-center mt-2">
        <div className="text-xl font-bold">最新商品</div>
        <hr className="my-1 w-full md:w-4/5" />
        <div className="md:w-[80%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {items.map((item, index) => (
            <ItemCardVertical
              item={{
                id: item.id,
                name: item.name,
                image: item.image ?? "",
                markedPrice: item.price,
                sellingPrice:
                  item.price - item.discount - item.category.discount,
                quantity: 1,
                useStock: item.useStock,
                stock: item.stock,
                couponPoint: item.couponPoint,
              }}
              key={`item${index}-${item.id}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
