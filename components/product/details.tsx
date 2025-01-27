"use client";
import { toPrice } from "@/utils/string";
import { useCart } from "@/utils/cartProvider";
import MyImage from "../image/customImage";

type DetailsItem = Item & {
  description: string;
};

function ProductDetails({ item }: Readonly<{ item: DetailsItem }>) {
  const { addQuantity } = useCart();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="w-full text-zinc-800 font-bold text-xl md:text-2xl">
        {item.name}
      </h1>
      <div className="w-full">
        {item.image ? (
          <MyImage
            src={item.image}
            alt={`product-${item.id}`}
            height={400}
            width={400}
            className="aspect-square object-contain !max-h-32 md:!max-h-64 w-full"
            externalUrl={true}
          />
        ) : (
          <MyImage
            src={"/images/fallback.png"}
            alt={`product-${item.id}`}
            height={400}
            width={400}
            className="aspect-square object-contain !max-h-32 md:!max-h-64 w-full"
          />
        )}
      </div>
      <div className="flex flex-col ml-4 md:ml-0">
        <div className="text-zinc-600">{item.description}</div>
        <div className="w-full text-red-400 mt-2">
          <span className="md:hidden">HKD$</span>
          <span className="hidden md:inline">$</span>
          <span className="font-bold md:font-normal ml-1 md:ml-0">
            {toPrice(item.sellingPrice)}
          </span>
          {item.markedPrice !== undefined &&
            item.sellingPrice !== item.markedPrice ? (
            <span className="hidden md:inline text-zinc-500 line-through ml-1">
              ${toPrice(item.markedPrice)}
            </span>
          ) : null}
          {item.couponPoint && item.couponPoint > 0 ? (
            <span className="text-red-500 ml-1">({item.couponPoint}積分)</span>
          ) : null}
        </div>
        {item.useStock && (
          <div className="w-full text-zinc-500">剩餘{item.stock}件商品</div>
        )}
        <div className="w-full">
          <button
            className="bg-green-500 text-white rounded-md font-medium py-1 px-3 text-lg"
            onClick={() => addQuantity(item)}
          >
            加至購物車
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
