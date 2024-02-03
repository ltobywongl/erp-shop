"use client";
import { toPrice } from "@/utils/string";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "antd";

function SmallItemCard(props: { item: Item }) {
  const item = props.item;
  return (
    <div className="flex gap-2">
      <Image src={item.image} alt="" height={50} width={50} />
      <div className="flex flex-col">
        <Link href={`/item/${item.id}`} className="text-zinc-800">
          {item.name}
        </Link>
        <div>{item.sellingPrice}</div>
      </div>
    </div>
  );
}

function ItemCardVertical(props: { item: Item }) {
  const item = props.item;
  const showRibbon: boolean =
    item.markedPrice !== undefined && item.sellingPrice !== item.markedPrice;

  const main = (
    <div className="flex md:flex-col gap-2 p-2 md:border md:border-zinc-200">
      <Link href={`/item/${item.id}`} className="w-[20%] md:w-full">
        <Image
          src={item.image}
          alt=""
          height={400}
          width={400}
          className="aspect-square object-contain !max-h-20 md:!max-h-52"
        />
      </Link>
      <div className="flex flex-col items-center justify-center ml-4 md:ml-0">
        <Link
          href={`/item/${item.id}`}
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

export { SmallItemCard, ItemCardVertical };
