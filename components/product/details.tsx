"use client";
import { toPrice } from "@/utils/string";
import MyImage from "@/components/image/customImage";
import "@/styles/snow.css";
import { AddToCartElement } from "@/components/common/itemCard";

function ProductDetails({
  lang,
  item,
}: Readonly<{ lang: string; item: Item }>) {
  return (
    <div className="flex flex-col gap-4 py-2 px-2">
      <div className="w-full">
        {item.image ? (
          <MyImage
            src={item.image}
            alt={item.name}
            height={400}
            width={400}
            className="aspect-square object-contain !max-h-32 md:!max-h-64 w-full"
            externalUrl={true}
          />
        ) : (
          <MyImage
            src={"/images/fallback.png"}
            alt={item.name}
            height={400}
            width={400}
            className="aspect-square object-contain !max-h-32 md:!max-h-64 w-full"
          />
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex items-end gap-4">
          <h1 className="text-zinc-800 font-bold text-2xl md:text-3xl">
            {item.name}
          </h1>
          <div className="text-red-400">
            <span>$</span>
            <span className="ml-1 md:ml-0">{toPrice(item.sellingPrice)}</span>
            {item.markedPrice !== undefined &&
            item.sellingPrice !== item.markedPrice ? (
              <span className="hidden md:inline text-zinc-500 line-through ml-1">
                ${toPrice(item.markedPrice)}
              </span>
            ) : null}
            {item.couponPoint && item.couponPoint > 0 ? (
              <span className="text-red-500 ml-1">
                ({item.couponPoint}賞分)
              </span>
            ) : null}
          </div>
          {item.useStock && (
            <div className="text-zinc-500">剩餘{item.stock}件商品</div>
          )}
        </div>
        <AddToCartElement item={item} direction="horizontal" />
      </div>
      <div dangerouslySetInnerHTML={{ __html: item.description ?? "" }} />
    </div>
  );
}

export default ProductDetails;
