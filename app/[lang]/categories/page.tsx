import Link from "next/link";
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
    <div className="flex justify-center py-2 px-2 md:px-0">
      <div className="w-full md:w-4/5">
        <Breadcrumbs items={breadItems} />
        <div className="md:grid md:grid-cols-2 gap-2">
          {categories?.map((category) => (
            <LinkButton
              href={`/category/${category.id}`}
              variant={"ghost"}
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
