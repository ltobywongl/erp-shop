import { ItemCardVertical } from "@/components/common/itemCard";
import { pathToS3Url } from "@/utils/string";
import { translation } from "@/i18n";
import { getProducts } from "@/utils/products/products";
import { LinkButton } from "@/components/ui/link-button";
import MyImage from "@/components/image/customImage";

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
    <main className="flex flex-col gap-16">
      <div
        className="min-h-80 max-h-[800px] h-dvh w-full flex flex-col gap-4 items-center justify-center bg-cover py-4 md:py-8 bg-center"
        style={{ backgroundImage: `url(${pathToS3Url("images/banner.jpg")})` }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-header">
          {t("brand")}
        </h1>
        <LinkButton
          href={"/categories"}
          size={"lg"}
          variant={"secondary"}
          className="font-bold"
        >
          {t("shopNow")}
        </LinkButton>
      </div>
      <div className="flex flex-col gap-6 items-center px-[10%]">
        <h2 className="text-primary font-bold text-2xl md:text-3xl lg:text-4xl">{t("naturesFeast")}</h2>
        <h3 className="text-primary font-bold text-lg md:text-xl lg:text-2xl">{t("everyBiteIsNaturesPreciousGift")}</h3>
        <div className="[&>p]:text-center">
          <p>{t("selectedPremiumFruitsFromAroundTheWorld")}</p>
          <p>{t("100%Natural")}</p>
          <p>{t("deliveringPureDeliciousnessForYourWellbeing")}</p>
        </div>
      </div>
      <div className="flex gap-6 overflow-x-scroll no-scrollbar px-4 lg:[&>*]:w-1/5 [&>*]:min-w-40 [&>div>img]:object-cover">
        <div className={"flex flex-col items-center gap-4"}>
          <MyImage
            src={"/images/home/D2.jpg"}
            alt="D1"
            height={"200"}
            width={"200"}
            className="rounded-lg"
          />
          <div className="font-bold text-primary text-xl md:text-2xl">{t("heartsBestFriend")}</div>
        </div>
        <div className={"flex flex-col items-center gap-4"}>
          <MyImage
            src={"/images/home/D4.jpg"}
            alt="D1"
            height={"200"}
            width={"200"}
            className="rounded-lg"
          />
          <div className="font-bold text-primary text-xl md:text-2xl">{t("brainPowerUpgrade")}</div>
        </div>
        <div className={"flex flex-col items-center gap-4"}>
          <MyImage
            src={"/images/home/D3.jpg"}
            alt="D1"
            height={"200"}
            width={"200"}
            className="rounded-lg"
          />
          <div className="font-bold text-primary text-xl md:text-2xl">{t("naturalEnergyBoost")}</div>
        </div>
        <div className={"flex flex-col items-center gap-4"}>
          <MyImage
            src={"/images/home/D1.jpg"}
            alt="D1"
            height={"200"}
            width={"200"}
            className="rounded-lg"
          />
          <div className="font-bold text-primary text-xl md:text-2xl">{t("sweetWithoutGuilt")}</div>
        </div>
        <div className={"flex flex-col items-center gap-4"}>
          <MyImage
            src={"/images/home/D5.jpg"}
            alt="D1"
            height={"200"}
            width={"200"}
            className="rounded-lg"
          />
          <div className="font-bold text-primary text-xl md:text-2xl">{t("instantEnergyFix")}</div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 mt-2 px-2">
        <div className="text-xl font-bold">{t("latestProducts")}</div>
        <div className="md:w-[80%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
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
