"use client";
import { toPrice } from "@/utils/string";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "antd";
import { CouponCategory } from "@prisma/client";
import { useState } from "react";
import LoadingSpinner from "@/components/common/spinner";
import { useCart } from "@/utils/cartProvider";
import { useRouter } from "next/navigation";

function SmallItemCard(props: { item: Item; className?: string }) {
  const { addQuantity, reduceQuantity } = useCart();
  const item = props.item;
  return (
    <div className={`flex gap-2 ${props.className}`}>
      <Image
        className="object-contain hidden md:block"
        src={item.image}
        alt={`product-${item.id}`}
        height={50}
        width={50}
      />
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
          {item.couponPoint !== undefined && (
            <span className="text-red-500 ml-1 text-xs">
              ({item.couponPoint * item.quantity}積分)
            </span>
          )}
        </div>
        <div className="text-xs text-zinc-500">剩餘{item.stock}件商品</div>
        <div className="flex flex-row">
          <button
            className="border bg-red-500 text-white text-lg font-medium px-2 py-1 rounded"
            onClick={() => reduceQuantity(item)}
          >
            -
          </button>
          <span className="border px-2 py-1 w-10 text-center content-center hide-arrow">
            {item.quantity}
          </span>
          <button
            className="border bg-green-500 text-white text-lg font-medium px-2 py-1 rounded"
            onClick={() => addQuantity(item)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function ItemCardVertical(props: { item: Item }) {
  const { addQuantity } = useCart();
  const item = props.item;
  const showRibbon: boolean =
    item.markedPrice !== undefined && item.sellingPrice !== item.markedPrice;

  const main = (
    <div className="flex md:flex-col gap-2 p-2 md:border md:border-zinc-200">
      <Link href={`/product/${item.id}`} className="w-[20%] md:w-full">
        {item.image ? (
          <Image
            src={item.image}
            alt={`product-${item.id}`}
            height={400}
            width={400}
            className="aspect-square object-contain !max-h-20 md:!max-h-52"
          />
        ) : (
          <Image
            src={"/images/fallback.png"}
            alt={`product-${item.id}`}
            height={400}
            width={400}
            className="aspect-square object-contain !max-h-20 md:!max-h-52"
          />
        )}
      </Link>
      <div className="flex flex-col items-center justify-center ml-4 md:ml-0">
        <Link
          href={`#item-${item.id}`}
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
          <span className="text-red-500 ml-1 text-xs">
            ({item.couponPoint}積分)
          </span>
        </div>
        <div className="w-full md:text-center text-xs text-zinc-500">
          剩餘{item.stock}件商品
        </div>
        <div className="w-full md:text-center">
          <button
            className="bg-green-500 text-white text-sm rounded-md font-medium py-1 px-2"
            onClick={() => addQuantity(item)}
          >
            加至購物車
          </button>
        </div>
      </div>
    </div>
  );

  if (showRibbon && item.markedPrice !== undefined) {
    const percentageDiff = Math.round(
      (100 * (item.sellingPrice - item.markedPrice)) / item.markedPrice
    ).toString();
    return (
      <Badge.Ribbon text={`${percentageDiff}%`} color="red">
        {main}
      </Badge.Ribbon>
    );
  }
  return main;
}

function ItemCardPoint(props: { item: Partial<CouponCategory> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const item = props.item;

  async function handleRedeem() {
    setIsLoading(true);
    const res = await fetch("/api/coupons/redeem", {
      method: "POST",
      body: JSON.stringify({
        id: item.id,
      }),
    });
    setIsLoading(false);

    if (res.ok) {
      alert("已換領禮卷");
    } else {
      alert("換領失敗,請確定你的積分足夠並重試");
    }
    router.refresh();
  }

  return (
    <div className="flex md:flex-col gap-2 p-2 md:border md:border-zinc-200">
      <div className="w-[25%] md:w-full border-4 border-double text-xl md:text-2xl text-center font-semibold md:font-bold bg-gradient-radial from-yellow-200 to-yellow-500 p-1 md:p-4 shadow-sm">
        ${item.value}
      </div>
      <div className="flex flex-col items-center justify-center ml-4 md:ml-0">
        <div className="w-full md:text-center text-red-400">
          <span className="font-bold ml-1 md:ml-0">{item.point}</span>
          <span>積分</span>
        </div>
        <button
          className="bg-green-400 text-white rounded-sm py-1 px-3"
          onClick={() => handleRedeem()}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : "兌換"}
        </button>
      </div>
    </div>
  );
}

function ItemCardPointReadOnly(props: { item: Partial<CouponCategory> }) {
  const item = props.item;

  return (
    <div className="flex md:flex-col gap-2 p-2 md:border md:border-zinc-200">
      <div className="w-[25%] md:w-full border-4 border-double text-xl md:text-2xl text-center font-semibold md:font-bold bg-gradient-radial from-yellow-200 to-yellow-500 p-1 md:p-4 shadow-sm">
        ${item.value}
      </div>
      <div className="flex flex-col items-center justify-center ml-4 md:ml-0">
        <div className="w-full md:text-center text-red-400">
          <span className="font-bold ml-1 md:ml-0">{item.point}</span>
          <span>積分</span>
        </div>
      </div>
    </div>
  );
}

export {
  SmallItemCard,
  ItemCardVertical,
  ItemCardPoint,
  ItemCardPointReadOnly,
};
