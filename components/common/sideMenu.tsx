"use client";

import React, { useState, useEffect } from "react";
import { StarFilled } from "@ant-design/icons";
import Link from "next/link";
import { MenuProps } from "antd";
import MyMenu from "@/components/common/menu";
import LoadingSpinner from "./spinner";

type MenuItem = Required<MenuProps>["items"][number];

function SideMenu() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/suggest-categories");
        const res = await response.json();
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

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
    getItem("推薦商品種類", "Sub0", <StarFilled style={{ color: "orange" }} />),

    ...(categories.map((category) => {
      return getItem(
        <Link href={`/category/${category.id}`}>{category.name}</Link>,
        category.id
      );
    }) || []),
  ];

  if (loading) {
    return <LoadingSpinner className="border border-solid border-zinc-200 flex-1" />;
  }

  return (
    <MyMenu
      mode="vertical"
      items={items}
      className="border border-solid border-zinc-200 [&>li]:!flex [&>li]:!items-center flex-1"
    />
  );
}

export default SideMenu;
