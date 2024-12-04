"use client";

import { cn } from "@/utils/utils";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function SearchBar(params: { className?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const defaultValue = searchParams.get("keyword") ?? "";
  const onSearch = (data?: String) => {
    if (!data || data === "") {
        return;
    }
    router.push(`/search/${data}`);
  };
  return (
    <span className={cn(params.className ?? "", "w-full z-50 flex outline outline-1 outline-slate-300")}>
      <input
        ref={inputRef}
        type="text"
        className="flex-1 py-2 px-3 ring-0 outline-none"
        defaultValue={defaultValue}
        placeholder="Search..."
        onKeyUp={(e) => {
            if (e.key === "Enter") {
              onSearch(inputRef.current?.value);
            }
        }}
      />
      <button
        className="bg-blue-500 text-white py-2 px-3"
        onClick={() => onSearch(inputRef.current?.value)}
      >
        <SearchOutlined />
      </button>
    </span>
  );
}
