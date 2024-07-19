import { FloatButton } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import carousel1 from "@/public/images/carousel1.jpg";
import React from "react";
import SideMenu from "@/components/common/sideMenu";
import { ItemCardVertical } from "@/components/common/itemCard";
import PopUpAds from "@/components/common/popUpAds";

export default function Home() {
  const items: Item[] = [];
  for (let i = 0; i < 10; i++)
    items.push({
      id: "1",
      name: "28吋 IPS 4K 144Hz 電競顯示器",
      image: "/logo.png",
      markedPrice: 1234 + Math.round(Math.random() * 500),
      sellingPrice: 1234,
      quantity: 1,
    });

  return (
    <main className="flex flex-col md:mt-4">
      <PopUpAds />
      <FloatButton icon={<QuestionCircleOutlined />} type="primary" />
      <div className="md:grid md:grid-cols-10 gap-2">
        <div className="hidden md:flex md:flex-col md:col-start-2 col-span-3">
          <SideMenu />
        </div>
        <div className="col-start-4 md:col-span-5">
          <Image src={carousel1} alt="Image" />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="md:w-[80%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {items.map((item, index) => (
            <ItemCardVertical item={item} key={`item${index}-${item.id}`} />
          ))}
        </div>
      </div>
    </main>
  );
}
