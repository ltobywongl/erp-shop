import { FloatButton } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import React from "react";
import SideMenu from "@/components/common/sideMenu";
import { ItemCardVertical } from "@/components/common/itemCard";
import PopUpAds from "@/components/common/popUpAds";
import prisma from "@/utils/prisma";

export default async function Home() {
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
        }
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <main className="flex flex-col md:mt-4">
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
