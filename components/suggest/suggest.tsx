import { Breadcrumbs, BreadcrumbItemType } from "@/components/ui/breadcrumb";
import SideMenu from "@/components/common/sideMenu";
import { ItemCardVertical } from "@/components/common/itemCard";
import prisma from "@/utils/prisma";
import SearchBar from "@/components/common/searchBar";
import { HomeIcon } from "lucide-react";

async function SuggestPage(params: Readonly<{ lang: string }>) {
  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeIcon />,
    },
    {
      title: "搜索",
    },
  ];

  const items = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      price: true,
      discount: true,
      couponPoint: true,
      useStock: true,
      stock: true,
      category: {
        select: {
          discount: true,
        },
      },
    },
    where: {
      deletedAt: null,
      OR: [
        {
          useStock: false,
        },
        {
          stock: { gt: 0 },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <main className="flex flex-col md:mt-4">
      <div className="md:grid md:grid-cols-10 gap-2">
        <div className="col-start-2 col-span-8">
          <SearchBar lang={params.lang} />
        </div>
        <div className="hidden md:block col-start-2 col-span-2">
          <SideMenu />
        </div>
        <div className="col-start-4 col-span-6 px-1">
          <Breadcrumbs items={breadItems} />
          <hr className="mt-1" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {items.map((item, index) => (
              <ItemCardVertical
                item={{
                  id: item.id,
                  name: item.name,
                  image: item.image ?? undefined,
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
        </div>
      </div>
    </main>
  );
}

export default SuggestPage;
