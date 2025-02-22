"use client";

import { useTranslation } from "@/i18n/client";
import { cn } from "@/utils/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function SearchBar(params: Readonly<{
  lang: string;
  className?: string;
  keyword?: string;
}>) {
  const { t } = useTranslation(params.lang, "search");
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const defaultValue = params.keyword ?? searchParams.get("keyword") ?? "";
  const onSearch = (data?: string) => {
    if (!data || data === "") {
      return;
    }
    router.push(`/search/${data}`);
  };
  return (
    <div
      className={cn(
        params.className ?? "",
        "w-full z-50 flex outline outline-1 outline-slate-300"
      )}
    >
      <Input
        ref={inputRef}
        type="text"
        className="flex-1 py-2 px-3 rounded-none !ring-0"
        defaultValue={defaultValue}
        placeholder={`${t("search")}...`}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            onSearch(inputRef.current?.value);
          }
        }}
      />
      <button
        className="bg-primary text-white py-2 px-3"
        onClick={() => onSearch(inputRef.current?.value)}
      >
        <SearchIcon />
      </button>
    </div>
  );
}
