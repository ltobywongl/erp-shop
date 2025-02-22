import { HomeIcon, StarIcon } from "lucide-react";
import { BreadcrumbItemType, Breadcrumbs } from "@/components/ui/breadcrumb";
import { getCategories } from "@/utils/products/categories/categories";
import { LinkButton } from "@/components/ui/link-button";
import { translation } from "@/i18n";

async function Page(props: Readonly<{ params: Promise<{ lang: string }> }>) {
  const params = await props.params;
  const { t } = await translation(params.lang, "search");
  const categories = await getCategories(params.lang, {
    createdAt: "desc",
  });

  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeIcon />,
    },
    {
      title: t("categories"),
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
