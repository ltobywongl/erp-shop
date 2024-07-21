import SideMenu from "@/components/common/sideMenu";
import { HomeOutlined } from "@ant-design/icons";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Breadcrumb } from "antd";
import { ItemCardVertical } from "@/components/common/itemCard";

function Page() {
  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeOutlined />,
    },
    {
      title: "搜索",
    },
  ];

  const items: Item[] = [];
  for (let i = 0; i < 10; i++)
    items.push({
      id: "1",
      name: "28吋 IPS 4K 144Hz 電競顯示器",
      image: "/logo.png",
      markedPrice: 1234 + Math.round(Math.random() * 500),
      sellingPrice: 1234,
      quantity: 1,
      stock: 100,
    });

  return (
    <main className="flex flex-col md:mt-4">
      <div className="md:grid md:grid-cols-10 gap-2">
        <div className="hidden md:block col-start-2 col-span-2">
          <SideMenu />
        </div>
        <div className="col-start-4 col-span-6 px-1">
          <Breadcrumb items={breadItems} />
          <hr className="mt-1" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {items.map((item, index) => (
              <ItemCardVertical item={item} key={`item${index}-${item.id}`} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
