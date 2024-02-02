"use client"
import React from "react";
import { Menu, MenuProps } from "antd";
import { MailTwoTone, MailOutlined, StarFilled, PercentageOutlined, ClusterOutlined } from "@ant-design/icons";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];

function SideMenu() {
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

  const items: MenuItem[] = [
    getItem(
      <Link href={"/category/0"}>新品選購</Link>,
      "Sub0",
      <StarFilled style={{ color: "yellow", fontSize: '20px' }} />
    ),

    getItem("限時優惠", "Sub1", <PercentageOutlined style={{ color: "red", fontSize: '20px' }} />, [
      getItem(<Link href={"/category/1"}>滑鼠限時優惠</Link>, "Sub1-item0"),
      getItem(<Link href={"/category/2"}>鍵盤限時優惠</Link>, "Sub1-item1"),
      getItem(<Link href={"/category/3"}>耳機限時優惠</Link>, "Sub1-item2"),
    ]),

    getItem("電腦組件", "Sub2", <ClusterOutlined style={{ color: "yellowgreen", fontSize: '20px' }} />, [
      getItem("處理器", "Sub2-item0"),
      getItem("主機板", "Sub2-item1"),
      getItem("記憶體", "Sub2-item2"),
      getItem("顯示卡", "Sub2-item3"),
      getItem("HDD機械硬盤", "Sub2-item4"),
      getItem("SSD固態硬碟", "Sub2-item5"),
      getItem("水冷散熱器", "Sub2-item6"),
      getItem("風冷散熱器", "Sub2-item7"),
      getItem("電源/火牛", "Sub2-item8"),
      getItem("機箱", "Sub2-item9"),
      getItem("作業系統/軟件", "Sub2-item10"),
      getItem("準系統", "Sub2-item11"),
      getItem("線材及工具", "Sub2-item12"),
    ]),

    getItem("電腦組件", "Sub3", <ClusterOutlined style={{ color: "yellowgreen", fontSize: '20px' }} />, [
      getItem("處理器", "Sub3-item0"),
      getItem("主機板", "Sub3-item1"),
      getItem("記憶體", "Sub3-item2"),
      getItem("顯示卡", "Sub3-item3"),
      getItem("HDD機械硬盤", "Sub3-item4"),
      getItem("SSD固態硬碟", "Sub3-item5"),
      getItem("水冷散熱器", "Sub3-item6"),
      getItem("風冷散熱器", "Sub3-item7"),
      getItem("電源/火牛", "Sub3-item8"),
      getItem("機箱", "Sub3-item9"),
      getItem("作業系統/軟件", "Sub3-item10"),
      getItem("準系統", "Sub3-item11"),
      getItem("線材及工具", "Sub3-item12"),
    ]),

    getItem("電腦組件", "Sub4", <ClusterOutlined style={{ color: "yellowgreen", fontSize: '20px' }} />, [
      getItem("處理器", "Sub4-item0"),
      getItem("主機板", "Sub4-item1"),
      getItem("記憶體", "Sub4-item2"),
      getItem("顯示卡", "Sub4-item3"),
      getItem("HDD機械硬盤", "Sub4-item4"),
      getItem("SSD固態硬碟", "Sub4-item5"),
      getItem("水冷散熱器", "Sub4-item6"),
      getItem("風冷散熱器", "Sub4-item7"),
      getItem("電源/火牛", "Sub4-item8"),
      getItem("機箱", "Sub4-item9"),
      getItem("作業系統/軟件", "Sub4-item10"),
      getItem("準系統", "Sub4-item11"),
      getItem("線材及工具", "Sub4-item12"),
    ]),
  ];

  return (
    <Menu
      mode="vertical"
      items={items}
      className="border border-solid border-zinc-200 [&>li]:!flex [&>li]:!items-center"
    />
  );
}

export default SideMenu;
