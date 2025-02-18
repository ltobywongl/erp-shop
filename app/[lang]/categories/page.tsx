import { HomeIcon, StarIcon } from "lucide-react";
import { BreadcrumbItemType, Breadcrumbs } from "@/components/ui/breadcrumb";
import { getCategories } from "@/utils/products/categories/categories";
import { LinkButton } from "@/components/ui/link-button";

async function Page(props: Readonly<{ params: Promise<{ lang: string }> }>) {
  const params = await props.params;
  const categories = await getCategories(params.lang, {
    createdAt: "desc",
  });

  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeIcon />,
    },
    {
      title: "所有商品種類",
    },
  ];

  return (
    <div className="flex justify-center py-2 px-2">
      <div className="w-full">
        <Breadcrumbs items={breadItems} />
        <div>
          {categories?.map((category) => (
            <LinkButton
              href={`/category/${category.id}`}
              variant={"ghost"}
              size={"lg"}
              className="w-full border-b flex gap-2"
              key={category.id}
            >
              <StarIcon />
              <span>{category.name}</span>
            </LinkButton>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
