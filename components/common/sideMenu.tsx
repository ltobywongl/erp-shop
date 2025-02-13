"use client";

import React, { useState, useEffect } from "react";
import LoadingSpinner from "@/components/common/spinner";
import Menu, { MenuItem } from "@/components/ui/menu";
import { StarIcon } from "lucide-react";

function SideMenu(params: Readonly<{ lang: string }>) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const queryParams = new URLSearchParams({
          lang: params.lang,
        });
        const response = await fetch(`/api/suggest-categories?${queryParams}`);
        const res = await response.json();
        setCategories(res.body.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [params.lang]);

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
    ...(categories.map((category) => {
      return getItem(
        "MenuItem" + category.id,
        category.name,
        `/category/${category.id}`,
        <StarIcon style={{ color: "orange" }} />
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
