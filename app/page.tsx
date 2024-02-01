"use client";
import { Carousel, Menu, MenuProps } from "antd";
import { MailTwoTone, MailOutlined } from "@ant-design/icons";
import Image from "next/image";
import carousel1 from "@/public/images/carousel1.jpg";
import carousel2 from "@/public/images/carousel2.jpg";
import carousel3 from "@/public/images/carousel3.jpg";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key?: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export default function Home() {
  const items: MenuItem[] = [
    getItem("新品選購", "Sub0", <MailTwoTone />),

    getItem("限時優惠", "Sub1", <MailTwoTone />, [
      getItem(<Link href={"/category/1"}>滑鼠限時優惠</Link>),
      getItem(<Link href={"/category/2"}>鍵盤限時優惠</Link>),
      getItem(<Link href={"/category/3"}>耳機限時優惠</Link>),
    ]),

    getItem("電腦組件", "Sub2", <MailTwoTone />, [
      getItem("處理器", "item0"),
      getItem("主機板", "item1"),
      getItem("記憶體", "item2"),
      getItem("顯示卡", "item3"),
      getItem("HDD機械硬盤", "item4"),
      getItem("SSD固態硬碟", "item5"),
      getItem("水冷散熱器", "item6"),
      getItem("風冷散熱器", "item7"),
      getItem("電源/火牛", "item8"),
      getItem("機箱", "item9"),
      getItem("作業系統/軟件", "item10"),
      getItem("準系統", "item11"),
      getItem("線材及工具", "item12"),
    ]),
  ];

  const news = [
    {
      link: "/news/1",
      title: "消息"
    },
    {
      link: "/news/1",
      title: "消息"
    },
    {
      link: "/news/1",
      title: "消息"
    },
    {
      link: "/news/1",
      title: "消息"
    },
    {
      link: "/news/1",
      title: "消息"
    },
    {
      link: "/news/1",
      title: "消息"
    },
    {
      link: "/news/1",
      title: "消息"
    },
  ]

  return (
    <main className="flex flex-col md:mt-4">
      <div className="md:grid md:grid-cols-12 gap-1">
        <div className="hidden md:block col-start-3 col-span-2">
          <Menu
            mode="vertical"
            items={items}
            className="border border-solid border-zinc-200"
          />
        </div>
        <div className="col-start-5 col-span-4">
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
        <div className="hidden md:flex col-start-9 col-span-2 flex-col border border-zinc-200 [&>div]:p-2 [&>hr]:w-[90%] [&>hr]:self-center">
          <div className="text-xl font-black">
            最新消息
            <MailOutlined className="ml-1" />
          </div>
          {
            news.map((newsItem) => (
              <>
                <hr />
                <div>
                  <Link href={newsItem.link}>{newsItem.title}</Link>
                </div>
              </>
            ))
          }
        </div>
      </div>
    </main>
  );
}
