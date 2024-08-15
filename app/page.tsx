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
      stock: true,
      category: {
        select: {
          discount: true,
        },
      },
    },
    where: {
      deletedAt: null,
      stock: { gt: 0 },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
  const timeStamp = new Date().getTime();

  return (
    <main className="flex flex-col md:mt-4">
      <PopUpAds />
      <FloatButton
        icon={<QuestionCircleOutlined />}
        type="primary"
        href="/about"
      />
      <div className="md:grid md:grid-cols-10 gap-2">
        <div className="hidden md:flex md:flex-col md:col-start-2 col-span-3">
          <SideMenu />
        </div>
        <div className="col-start-4 md:col-span-5 bg-gray-100">
          <Image
            src={`https://publicen.s3.ap-northeast-1.amazonaws.com/images/banner.jpg?timeStamp=${timeStamp}`}
            className="w-full h-auto max-h-96 object-contain"
            width={600}
            height={600}
            alt="Image"
          />
        </div>
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
