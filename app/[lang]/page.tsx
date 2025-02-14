import { ItemCardVertical } from "@/components/common/itemCard";
import { pathToS3Url } from "@/utils/string";
import Link from "next/link";
import { translation } from "@/i18n";
import { getProducts } from "@/utils/products/products";

export default async function Home(
  props: Readonly<{
    params: Promise<{ lang: string }>;
  }>
) {
  const params = await props.params;
  const { t } = await translation(params.lang, "home");
  const items = await getProducts(
    params.lang,
    {
      createdAt: "desc",
    },
    10
  );

  return (
    <main className="flex flex-col">
      <div
        className="min-h-[max(100dvh,100vh,300px)] w-full flex flex-col gap-2 items-center justify-center bg-cover py-4 md:py-8"
        style={{ backgroundImage: `url(${pathToS3Url("images/banner.jpg")})` }}
      >
        <div className="text-3xl font-semibold text-white drop-shadow-lg">
          {t("brand")}
        </div>
        <Link
          href={"/categories"}
          className="bg-white border px-4 md:px-6 py-2 md:py-4 rounded"
        >
          {t("shopNow")}
        </Link>
      </div>
      <div className="flex flex-col items-center mt-2">
        <div className="text-xl font-bold">{t("latestProducts")}</div>
        <hr className="my-1 w-full md:w-4/5" />
        <div className="md:w-[80%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {items?.map((item, index) => (
            <ItemCardVertical
              key={`item${index}-${item.id}`}
              lang={params.lang}
              item={{
                id: item.id,
                name: item.name,
                image: item.image ?? "",
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
    </main>
  );
}
