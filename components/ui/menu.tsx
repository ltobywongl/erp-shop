"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { useRouter } from "next/navigation";

export type MenuItem = {
  key: string;
  label: string;
  toUrl?: string;
  icon?: React.ReactNode;
};

function Menu(
  props: Readonly<{ items: MenuItem[]; direction: "vertical" | "horizontal" }>
) {
  const router = useRouter();
  return (
    <div
      className={cn(
        "flex p-1 border gap-1",
        props.direction === "vertical" ? "flex-col" : "flex-row"
      )}
    >
      {props.items.map((item) => (
        <Button
          key={item.key}
          className="w-full"
          variant={"ghost"}
          size={"lg"}
          onClick={() => item.toUrl && router.push(item.toUrl)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </div>
  );
}

export default Menu;
