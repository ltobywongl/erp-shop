"use client";

import { Breadcrumbs, BreadcrumbItemType } from "@/components/ui/breadcrumb";
import SideMenu from "@/components/common/sideMenu";
import { ItemCardVertical } from "@/components/common/itemCard";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import PaginationClient from "@/components/common/pagination";
import SearchBar from "@/components/common/searchBar";
import { HomeIcon } from "lucide-react";
import { useTranslation } from "@/i18n/client";

function SearchPage({
  lang,
  keyword,
}: Readonly<{ lang: string; keyword: string }>) {
  const [data, setData] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { t } = useTranslation(lang, "search");

  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeIcon />,
    },
    {
      title: t("search"),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        lang: lang,
        keyword,
        page: (pagination.pageIndex + 1).toString(),
      });

      const response = await fetch(`/api/search?${queryParams}`);
      const result = await response.json();

      setIsLoading(false);
      setData(result.body.data);
      setTotalPages(result.body.totalPages);
    };

    fetchData();
  }, [keyword, lang, pagination]);

  return (
    <div className="flex flex-col p-2">
      <div className="md:grid md:grid-cols-10 gap-2">
        <div className="col-start-2 col-span-8">
          <SearchBar lang={lang} keyword={keyword} />
        </div>
        <div className="hidden md:block col-start-2 col-span-2">
          <SideMenu lang={lang} />
        </div>
        <div className="col-start-4 col-span-6 mt-2">
          <Breadcrumbs items={breadItems} />
          <hr className="mt-1" />
          <PaginationClient
            setPagination={setPagination}
            pagination={pagination}
            totalPages={totalPages}
          />
          {isLoading && <Loading />}
          {!isLoading &&
            (data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {data.map((item, index) => (
                  <ItemCardVertical
                    key={`item${index}-${item.id}`}
                    lang={lang}
                    item={{
                      id: item.id,
                      name: item.name,
                      image: item.image,
                      markedPrice: item.markedPrice,
                      sellingPrice: item.sellingPrice,
                      quantity: 1,
                      useStock: item.useStock,
                      stock: item.stock,
                      couponPoint: item.couponPoint,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-center text-2xl font-bold border-b h-24">
                <div>{t("noProductFound")}</div>
              </div>
            ))}
          <PaginationClient
            setPagination={setPagination}
            pagination={pagination}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
