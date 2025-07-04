"use client";
import { toPrice } from "@/utils/string";
import Link from "next/link";
import { useState } from "react";
import LoadingSpinner from "@/components/common/spinner";
import { useCart } from "@/utils/cartProvider";
import { useRouter } from "next/navigation";
import MyImage from "@/components/image/customImage";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { cn } from "@/utils/utils";
import { useModal } from "@/utils/modalProvider";
import { useToast } from "@/hooks/use-toast";

function SmallItemCard(params: Readonly<{ item: Item; lang: string, className?: string }>) {
  const { addQuantity, reduceQuantity } = useCart();
  const { t } = useTranslation(params.lang, "itemCard");
  const item = params.item;
  return (
    <div className={`flex gap-2 ${params.className}`}>
      {item.image ? (
        <MyImage
          src={item.image}
          alt={item.name}
          height={80}
          width={80}
          className="object-contain !max-h-20 md:!max-h-52 hidden md:block"
          externalUrl={true}
        />
      ) : (
        <MyImage
          src={"/images/fallback.png"}
          alt={item.name}
          height={80}
          width={80}
          className="object-contain !max-h-20 md:!max-h-52 hidden md:block"
        />
      )}
      <div className="flex flex-col">
        <Link
          href={`/product/${item.id}`}
          className="text-zinc-800 md:text-lg break-all"
        >
          {item.name}
        </Link>
        <div>
          <span className="text-base text-red-400">${item.sellingPrice}</span>
          {item.markedPrice ? (
            <span className="line-through text-xs text-zinc-500 ml-1">
              ${item.markedPrice}
            </span>
          ) : null}
          {item.couponPoint !== undefined && item.couponPoint > 0 && (
            <span className="text-red-500 ml-1 text-xs">
              ({item.couponPoint * item.quantity} {t("points")})
            </span>
          )}
        </div>
        {item.useStock && (
          <div className="text-xs text-zinc-500">{t("inStock")}: {item.stock}</div>
        )}
        <div className="flex flex-row">
          <Button variant={"secondary"} onClick={() => reduceQuantity(item)}>
            -
          </Button>
          <span className="border px-2 md:px-3 py-1 min-w-10 text-center content-center hide-arrow">
            {item.quantity}
          </span>
          <Button variant={"secondary"} onClick={() => addQuantity(item)}>
            +
          </Button>
        </div>
      </div>
    </div>
  );
}

function ItemCardVertical(params: Readonly<{ item: Item; lang: string }>) {
  const { t } = useTranslation(params.lang, "itemCard");
  const { addQuantity } = useCart();
  const item = params.item;
  let percentageDiff = 0;
  if (item.markedPrice !== undefined) {
    percentageDiff = Math.round(
      (100 * (item.sellingPrice - item.markedPrice)) / item.markedPrice
    );
  }

  return (
    <div className="relative flex md:flex-col gap-2 p-2">
      {percentageDiff !== 0 && <Badge>{percentageDiff}%</Badge>}
      <Link href={`/product/${item.id}`} className="w-[20%] md:w-full">
        <div className="hover-zb rounded-lg group">
          {item.image ? (
            <MyImage
              src={item.image}
              alt={item.name}
              height={400}
              width={400}
              className="aspect-square object-cover !max-h-20 md:!max-h-52"
              externalUrl={true}
            />
          ) : (
            <MyImage
              src={"/images/fallback.png"}
              alt={item.name}
              height={400}
              width={400}
              className="aspect-square object-cover !max-h-20 md:!max-h-52"
            />
          )}
        </div>
      </Link>
      <div className="flex flex-col items-center justify-center ml-4 md:ml-0">
        <Link
          href={`/product/${item.id}`}
          className="w-full md:text-center text-zinc-800 font-normal md:font-semibold"
        >
          {item.name}
        </Link>
        <div className="w-full md:text-center text-red-400">
          <span className="md:hidden">HKD$</span>
          <span className="hidden md:inline">$</span>
          <span className="font-bold md:font-normal ml-1 md:ml-0">
            {toPrice(item.sellingPrice)}
          </span>
          {item.markedPrice !== undefined &&
          item.sellingPrice !== item.markedPrice ? (
            <span className="hidden md:inline text-zinc-500 line-through ml-1 text-xs">
              ${toPrice(item.markedPrice)}
            </span>
          ) : null}
        </div>
        {item.useStock && (
          <div className="w-full md:text-center text-xs text-zinc-500">
            {t("inStock")}: {item.stock}
          </div>
        )}
        <div className="w-full md:text-center">
          <Button
            onClick={() => addQuantity(item)}
            disabled={item.useStock && item.stock == 0}
          >
            {t("addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ItemCardPoint(
  params: Readonly<{ lang: string; item: CouponCategory }>
) {
  const { t } = useTranslation(params.lang, "itemCard");
  const router = useRouter();
  const { showModal } = useModal();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const item = params.item;

  async function handleRedeem() {
    showModal(`${t("redeem")}?`, "", true, async () => {
      setIsLoading(true);
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        body: JSON.stringify({
          id: item.id,
        }),
      });
      setIsLoading(false);

      if (res.ok) {
        toast({ title: t("rewardsRedeemed") });
      } else {
        toast({ title: t("redeemFailed"), variant: "destructive" });
      }
      router.refresh();
    });
  }

  return (
    <div className="flex md:flex-col justify-between gap-2 p-2 md:border md:border-zinc-200">
      <Link className="w-[25%] md:w-full" href={`/rewards/${item.id}`}>
        {item.imagePath ? (
          <MyImage
            className="w-full !max-h-20 md:!max-h-52 object-contain mx-auto"
            src={item.imagePath}
            width={500}
            height={500}
            alt={`coupon-${item.id}`}
            externalUrl={true}
          />
        ) : (
          <div className="border-4 border-double text-xl md:text-2xl text-center font-semibold md:font-bold bg-gradient-radial from-yellow-200 to-yellow-500 p-1 md:p-5 shadow-sm">
            ${item.value}
          </div>
        )}
      </Link>
      <div className="flex flex-col items-center justify-center ml-4 md:ml-0">
        <Link href={`/rewards/${item.id}`}>
          <div className="font-bold">{item.name}</div>
        </Link>
        <div className="w-full md:text-center text-red-400">
          <span className="font-bold ml-1 md:ml-0">{item.point}</span>
          <span>{t("points")}</span>
        </div>
        {item.useStock && (
          <div className="w-full md:text-center text-zinc-500">
            {t("inStock")}: {item.stock}
          </div>
        )}
        <button
          className="bg-green-500 hover:bg-green-400 text-white rounded-sm py-1 px-3"
          onClick={() => handleRedeem()}
          disabled={isLoading || (item.useStock && item.stock === 0)}
        >
          {isLoading ? <LoadingSpinner /> : t("redeem")}
        </button>
      </div>
    </div>
  );
}

function ItemCardPointReadOnly(params: Readonly<{ item: Coupon }>) {
  const item = params.item;

  return (
    <div className="w-full flex md:flex-col justify-between gap-2 p-2 md:border md:border-zinc-200">
      {item.imagePath ? (
        <MyImage
          className="w-full !max-h-20 md:!max-h-52 object-contain mx-auto"
          src={item.imagePath}
          width={500}
          height={500}
          alt={`coupon-${item.id}`}
          externalUrl={true}
        />
      ) : (
        <div className="border-4 border-double text-xl md:text-2xl text-center font-semibold md:font-bold bg-gradient-radial from-yellow-200 to-yellow-500 p-1 md:p-5 shadow-sm">
          ${item.value}
        </div>
      )}
      <div className="md:text-center font-bold ml-4 md:ml-0">{item.name}</div>
    </div>
  );
}

function AddToCartElement(
  params: Readonly<{
    item: Readonly<Item>;
    direction?: "vertical" | "horizontal";
  }>
) {
  const { addQuantity } = useCart();
  const [count, setCount] = useState(1);

  return (
    <div
      className={cn(
        "flex gap-2",
        params.direction != "horizontal" ? "flex-col" : ""
      )}
    >
      <div className="flex flex-row">
        <Button
          variant={"secondary"}
          onClick={() => setCount(Math.max(1, count - 1))}
        >
          -
        </Button>
        <span className="border px-2 md:px-3 py-1 min-w-10 text-center content-center hide-arrow">
          {count}
        </span>
        <Button
          variant={"secondary"}
          onClick={() =>
            setCount(
              params.item.useStock
                ? Math.min(params.item.stock, count + 1)
                : count + 1
            )
          }
        >
          +
        </Button>
      </div>
      <Button onClick={() => addQuantity(params.item)}>
        <ShoppingCartIcon />
      </Button>
    </div>
  );
}

export {
  SmallItemCard,
  ItemCardVertical,
  ItemCardPoint,
  ItemCardPointReadOnly,
  AddToCartElement,
};
