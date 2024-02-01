"use client";
import { Carousel, FloatButton } from "antd";
import { MailOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import carousel1 from "@/public/images/carousel1.jpg";
import carousel2 from "@/public/images/carousel2.jpg";
import carousel3 from "@/public/images/carousel3.jpg";
import Link from "next/link";
import React from "react";
import SideMenu from "@/components/common/sideMenu";
import { ItemCardVertical } from "@/components/common/itemCard";

export default function Home() {
  const news = [
    {
      link: "/news/1",
      title: "消息1",
    },
    {
      link: "/news/2",
      title: "消息2",
    },
    {
      link: "/news/3",
      title: "消息3",
    },
    {
      link: "/news/4",
      title: "消息4",
    },
    {
      link: "/news/5",
      title: "消息5",
    },
  ];

  const items: Item[] = [];
  for (let i = 0; i < 10; i++)
    items.push({
      id: "1",
      name: "Donald Fong",
      image: "/logo.png",
      markedPrice: 145,
      sellingPrice: 123,
      quantity: 1,
    });

  return (
    <main className="flex flex-col md:mt-4">
      <FloatButton icon={<QuestionCircleOutlined />} type="primary" />
      <div className="md:grid md:grid-cols-10 gap-2">
        <div className="hidden md:block md:col-start-2 col-span-2">
          <SideMenu />
        </div>
        <div className="col-start-4 md:col-span-4">
          <Carousel autoplay>
            <div className="w-full h-auto">
              <Image src={carousel1} alt="Image" />
            </div>
            <div>
              <Image src={carousel2} alt="Image" />
            </div>
            <div>
              <Image src={carousel3} alt="Image" />
            </div>
          </Carousel>
        </div>
        <div className="flex md:col-start-8 col-span-2 flex-col border border-zinc-200 [&>div]:p-2 [&>hr]:w-[90%] [&>hr]:self-center">
          <div className="text-xl font-black">
            最新消息
            <MailOutlined className="ml-1" />
          </div>
          {news.map((newsItem) => (
            <React.Fragment key={`news-${newsItem.link}`}>
              <hr />
              <div>
                <Link href={newsItem.link}>{newsItem.title}</Link>
              </div>
            </React.Fragment>
          ))}
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
