import Link from "next/link";
import { HomeIcon, StarIcon } from "lucide-react";
import { BreadcrumbItemType, Breadcrumbs } from "@/components/ui/breadcrumb";
import { getCategories } from "@/utils/products/categories/categories";

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
    <div className="flex justify-center py-2">
      <div className="w-full md:w-4/5">
        <Breadcrumbs items={breadItems} />
        <hr className="mt-1" />
        <div className="md:grid md:grid-cols-2 gap-2">
          {categories?.map((category) => (
            <Link
              href={`/category/${category.id}`}
              key={category.id}
              className="hover:bg-orange-50 rounded px-3 py-2 border-b flex gap-2"
            >
              <StarIcon />
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
