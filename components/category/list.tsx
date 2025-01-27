"use client";
import HomeOutlined from "@ant-design/icons/lib/icons/HomeOutlined";
import Breadcrumb, { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import SideMenu from "../common/sideMenu";
import { ItemCardVertical } from "../common/itemCard";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import PaginationClient from "@/components/common/pagination";

function CategoryListPage({ id }: Readonly<{ id: string }>) {
  const [data, setData] = useState<CategoryListProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
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
      setData(result.body.data);
      setTotalPages(result.body.totalPages);
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
                    item={{
                      id: item.id,
                      name: item.name,
                      image: item.image,
                      markedPrice: item.price,
                      sellingPrice:
                        item.price - item.discount - item.category.discount,
                      quantity: 1,
                      useStock: item.useStock,
                      stock: item.stock,
                      couponPoint: item.couponPoint,
                    }}
                    key={`item${index}-${item.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-center text-2xl font-bold border-b h-24">
                <div>查無商品</div>
              </div>
            ))}
          <PaginationClient
            setPagination={setPagination}
            pagination={pagination}
            totalPages={totalPages}
          />
        </div>
      </div>
    </main>
  );
}

export default CategoryListPage;
