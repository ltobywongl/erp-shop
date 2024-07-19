"use client";
import HomeOutlined from "@ant-design/icons/lib/icons/HomeOutlined";
import Breadcrumb, { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import SideMenu from "../common/sideMenu";
import { ItemCardVertical } from "../common/itemCard";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";

function CategoryListPage({ id }: { id: string }) {
  const [data, setData] = useState<CategoryListProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeOutlined />,
    },
    {
      title: "種類",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        id,
        page: (pagination.pageIndex + 1).toString(),
      });

      const response = await fetch(`/api/category/listing?${queryParams}`);
      const result = await response.json();

      setIsLoading(false);
      setData(result.data);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);
    };

    fetchData();
  }, [id, pagination]);

  return (
    <main className="flex flex-col md:mt-4">
      <div className="md:grid md:grid-cols-10 gap-2">
        <div className="hidden md:block col-start-2 col-span-2">
          <SideMenu />
        </div>
        <div className="col-start-4 col-span-6 px-1">
          <Breadcrumb items={breadItems} />
          <hr className="mt-1" />
          <div className="mt-2">
            <div className="w-full flex items-center gap-2">
              <span className="flex items-center gap-1">
                <div>頁面</div>
                <strong>
                  {pagination.pageIndex + 1}/{totalPages}
                </strong>
              </span>
            </div>
            <div className="w-full flex justify-between gap-4 mt-2">
              <button
                className="hover:bg-slate-50 w-full border rounded px-2 py-1"
                onClick={() =>
                  setPagination((p) => {
                    return { ...p, pageIndex: 0 };
                  })
                }
                disabled={pagination.pageIndex <= 0}
              >
                {"<<"}
              </button>
              <button
                className="hover:bg-slate-50 w-full border rounded px-2 py-1"
                onClick={() =>
                  setPagination((p) => {
                    return { ...p, pageIndex: p.pageIndex - 1 };
                  })
                }
                disabled={pagination.pageIndex <= 0}
              >
                {"<"}
              </button>
              <button
                className="hover:bg-slate-50 w-full border rounded px-2 py-1"
                onClick={() =>
                  setPagination((p) => {
                    return { ...p, pageIndex: p.pageIndex + 1 };
                  })
                }
                disabled={pagination.pageIndex >= totalPages - 1}
              >
                {">"}
              </button>
              <button
                className="hover:bg-slate-50 w-full border rounded px-2 py-1"
                onClick={() =>
                  setPagination((p) => {
                    return { ...p, pageIndex: totalPages - 1 };
                  })
                }
                disabled={pagination.pageIndex >= totalPages - 1}
              >
                {">>"}
              </button>
            </div>
          </div>
          {isLoading ? (
            <Loading />
          ) : data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {data.map((item, index) => (
                <ItemCardVertical
                  item={{
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    markedPrice: item.price,
                    sellingPrice:
                      item.price - item.discount - item.category.discount,
                    quantity: 1,
                  }}
                  key={`item${index}-${item.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-center text-2xl font-bold border-b h-24">
              <div>查無商品</div>
            </div>
          )}
          <div className="mt-2">
            <div className="w-full flex justify-between gap-4">
              <button
                className="hover:bg-slate-50 w-full border rounded px-2 py-1"
                onClick={() =>
                  setPagination((p) => {
                    return { ...p, pageIndex: 0 };
                  })
                }
                disabled={pagination.pageIndex <= 0}
              >
                {"<<"}
              </button>
              <button
                className="hover:bg-slate-50 w-full border rounded px-2 py-1"
                onClick={() =>
                  setPagination((p) => {
                    return { ...p, pageIndex: p.pageIndex - 1 };
                  })
                }
                disabled={pagination.pageIndex <= 0}
              >
                {"<"}
              </button>
              <button
                className="hover:bg-slate-50 w-full border rounded px-2 py-1"
                onClick={() =>
                  setPagination((p) => {
                    return { ...p, pageIndex: p.pageIndex + 1 };
                  })
                }
                disabled={pagination.pageIndex >= totalPages - 1}
              >
                {">"}
              </button>
              <button
                className="hover:bg-slate-50 w-full border rounded px-2 py-1"
                onClick={() =>
                  setPagination((p) => {
                    return { ...p, pageIndex: totalPages - 1 };
                  })
                }
                disabled={pagination.pageIndex >= totalPages - 1}
              >
                {">>"}
              </button>
            </div>
            <div className="w-full flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1">
                <div>頁面</div>
                <strong>
                  {pagination.pageIndex + 1}/{totalPages}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CategoryListPage;
