"use client";
import React from "react";
import { Menu, MenuProps } from "antd";
import {
  StarFilled,
  PercentageOutlined,
  ClusterOutlined,
} from "@ant-design/icons";
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
      "推薦商品種類",
      "Sub0",
      <StarFilled style={{ color: "orange" }} />
    ),

    getItem(
      <Link href={"/category/3cad13a4-835b-403d-819d-ec72a6ca210c"}>
        裝修工程
      </Link>,
      "Sub1"
    ),

    getItem(
      <Link href={"/category/3d6ffe63-e2b5-4c14-8e45-bfb703b4948e"}>
        鋁窗工程
      </Link>,
      "Sub2"
    ),

    getItem(
      <Link href={"/category/0000b75a-a990-4a54-944d-8f18ba82d37f"}>防水</Link>,
      "Sub3"
    ),

    getItem(
      <Link href={"/category/a1d0af2f-974a-49f6-891e-67bfff3b34cd"}>水電工程</Link>,
      "Sub4"
    ),
  ];

  return (
    <Menu
      mode="vertical"
      items={items}
      className="border border-solid border-zinc-200 [&>li]:!flex [&>li]:!items-center flex-1"
    />
  );
}

export default SideMenu;
