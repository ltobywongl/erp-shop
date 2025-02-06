"use client";

import React, { useState, useEffect } from "react";
import LoadingSpinner from "@/components/common/spinner";
import Menu, { MenuItem } from "@/components/ui/menu";
import { StarIcon } from "lucide-react";

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
        setCategories(res.body.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  function getItem(
    key: React.Key,
    label: React.ReactNode,
    toUrl?: string,
    icon?: React.ReactNode
  ): MenuItem {
    return {
      key,
      label,
      toUrl,
      icon,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem(
      "MenuItem0",
      "推薦商品種類",
      undefined,
      <StarIcon style={{ color: "orange" }} />
    ),

    ...(categories.map((category) => {
      return getItem(
        "MenuItem" + category.id,
        category.name,
        `/category/${category.id}`
      );
    }) || []),
  ];

  if (loading) {
    return (
      <LoadingSpinner className="border border-solid border-zinc-200 flex-1" />
    );
  }

  return <Menu items={items} direction="vertical" />;
}

export default SideMenu;
