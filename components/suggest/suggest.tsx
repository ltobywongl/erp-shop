import { Breadcrumbs, BreadcrumbItemType } from "@/components/ui/breadcrumb";
import SideMenu from "@/components/common/sideMenu";
import { ItemCardVertical } from "@/components/common/itemCard";
import SearchBar from "@/components/common/searchBar";
import { HomeIcon } from "lucide-react";
import { getProducts } from "@/utils/products/products";
import { translation } from "@/i18n";

async function SuggestPage(params: Readonly<{ lang: string }>) {
  const { t } = await translation(params.lang, "search");
  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeIcon />,
    },
    {
      title: t("search"),
    },
  ];

  const items = await getProducts(
    params.lang,
    {
      createdAt: "desc",
    },
    10
  );

  return (
    <div className="flex flex-col p-2">
      <div className="md:grid md:grid-cols-10 gap-2">
        <div className="col-start-2 col-span-8">
          <SearchBar lang={params.lang} />
        </div>
        <div className="hidden md:block col-start-2 col-span-2">
          <SideMenu lang={params.lang} />
        </div>
        <div className="col-start-4 col-span-6 mt-2">
          <Breadcrumbs items={breadItems} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {items?.map((item, index) => (
              <ItemCardVertical
                key={`item${index}-${item.id}`}
                lang={params.lang}
                item={{
                  id: item.id,
                  name: item.name,
                  image: item.image ?? undefined,
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
        </div>
      </div>
    </div>
  );
}

export default SuggestPage;
